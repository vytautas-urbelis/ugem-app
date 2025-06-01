import random

from django.db import models

from business_user_profile.models import BusinessUserProfile
from campaign.models import Campaign
from collector_card.models import CollectorCard
from customer_user_profile.models import CustomerUserProfile

import segno
from django.core.files.base import ContentFile
from io import BytesIO

import jwt

from promotion.models import Promotion


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


def voucher_image_directory_path(instance, filename):
    return f'voucher/{instance.id}/{filename}'


def voucher_qr_directory_path(instance, filename):
    return f'voucher_qr/{instance.id}/{filename}'


class VoucherType(models.Model):
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.type


class VoucherCard(models.Model):
    expiration_date = models.DateField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_expired = models.DateField(blank=True, null=True)
    date_used = models.DateTimeField(auto_now=True)
    is_used = models.BooleanField(default=False)
    qr_code = models.ImageField(upload_to=voucher_qr_directory_path)
    serial_nr = models.CharField(max_length=15, unique=True, default=code_generator)
    business_id = models.IntegerField(verbose_name='business id', blank=True, null=True)
    to_qr = models.CharField(verbose_name='jwt{voucher_id, secret_key}', max_length=400, blank=False, null=False)

    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.SET_NULL, null=True, blank=True)
    voucher_type = models.ForeignKey(VoucherType, on_delete=models.CASCADE, related_name='voucher_cards', null=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name='voucher_card')
    promotion = models.ForeignKey(Promotion, on_delete=models.SET_NULL, null=True, blank=True,
                                  related_name='voucher_card')
    collector_card = models.ForeignKey(CollectorCard, on_delete=models.SET_NULL, null=True,
                                       related_name='voucher_cards')

    def save(self, *args, **kwargs):
        # If the instance already exists in the database, retrieve the old instance to compare images.
        if self.pk:
            old_instance = VoucherCard.objects.filter(pk=self.pk).first()
            if old_instance:
                old_qr_code = old_instance.qr_code
            else:
                old_qr_code = None
        else:
            old_qr_code = None

        super().save(*args, **kwargs)
        secret = jwt.encode({"user_id": self.customer_user_profile.user.id, "voucher_id": self.id},
                            self.customer_user_profile.secret_key, algorithm="HS256")

        self.to_qr = f'{secret}'

        qr = segno.make(f'{secret}')
        buffer = BytesIO()
        qr.save(buffer, kind='png', scale=5)
        filename = f'qr_business_id{self.business_id}_{self.id}.png'
        self.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
        super().save(update_fields=['qr_code', 'to_qr'])

        # After saving the new QR code, remove the old file if it's different
        if old_qr_code and old_qr_code.name and old_qr_code.name != self.qr_code.name:
            old_qr_code.delete(save=False)

    def __str__(self):
        return self.campaign.name if self.campaign else self.promotion.name if self.promotion else self.serial_nr

import random
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
import jwt

import segno
from django.core.files.base import ContentFile
from io import BytesIO

from customer_user_profile.models import CustomerUserProfile

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


def customer_card_qr_directory_path(instance, filename):
    return f'user_qr/{instance.customer_user_profile.user.email}/{filename}'


def customer_card_thumbnail_directory_path(instance, filename):
    return f'user_qr/{instance.customer_user_profile.user.email}/{filename}'


class CardType(models.Model):
    type = models.CharField(max_length=15)

    def __str__(self):
        return self.type


# Create your models here.
class CustomerCard(models.Model):
    customer_user_profile = models.OneToOneField(CustomerUserProfile, on_delete=models.CASCADE,
                                                 related_name='customer_card')
    card_type = models.ForeignKey(CardType, on_delete=models.CASCADE, related_name='customer_card_type', blank=True,
                                  null=True)
    thumbnail = models.ImageField(upload_to=customer_card_thumbnail_directory_path,
                                  blank=True)  # as thumbnail for Apple Card
    to_qr = models.CharField(verbose_name="jwt{secret_key}", max_length=400)  # as string to Apple Card
    serial_nr = models.CharField(max_length=15, unique=True, default=code_generator)  # as serial nr for Apple Card
    qr_code = models.ImageField(upload_to=customer_card_qr_directory_path, blank=True)

    def __str__(self):
        return self.serial_nr

    def save(self, *args, **kwargs):
        # If the instance already exists, retrieve the old avatar
        if self.pk:
            old_instance = CustomerCard.objects.filter(pk=self.pk).first()
            if old_instance:
                old_qr_code = old_instance.qr_code
            else:
                old_qr_code = None
        else:
            old_qr_code = None

        create = self._state.adding
        secret = jwt.encode({"user_id": self.customer_user_profile.user.id}, self.customer_user_profile.secret_key,
                            algorithm="HS256")
        self.card_type = CardType.objects.get(id=1)
        if not create:
            #  change qr code
            self.to_qr = f'https://ugem.app/get-started/{secret}'
            qr = segno.make(f'https://ugem.app/get-started/{secret}')
            buffer = BytesIO()
            qr.save(buffer, kind='png', scale=10)
            filename = f'qr_{self.customer_user_profile.user}_{self.customer_user_profile.user.id}.png'
            if self.qr_code:
                self.qr_code.delete(save=False)  # Delete the old file if it exists
            self.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
        else:
            #  change qr code
            self.to_qr = f'https://ugem.app/get-started/{secret}'
            qr = segno.make(f'https://ugem.app/get-started/{secret}')
            buffer = BytesIO()
            qr.save(buffer, kind='png', scale=10)
            filename = f'qr_{self.customer_user_profile.user}_{self.customer_user_profile.user.id}.png'
            self.qr_code.save(filename, ContentFile(buffer.getvalue()), save=False)
        # print(jwt.decode(secret, options={"verify_signature": False}))
        super().save(*args, **kwargs)

        # After saving, check if we need to delete the old avatar
        if old_qr_code and old_qr_code.name and old_qr_code.name != self.qr_code.name:
            # Delete the old qr code file from storage
            old_qr_code.delete(save=False)


@receiver(post_save, sender=CustomerUserProfile)
def create_customer_card(sender, instance, **kwargs):
    CustomerCard.objects.get_or_create(customer_user_profile=instance)

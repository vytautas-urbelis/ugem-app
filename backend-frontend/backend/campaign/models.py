from django.db import models
import jwt
from django.core.files.base import ContentFile
from business_user_profile.models import BusinessUserProfile
from utils.campaign_qr_generator.svg_png import generate_campaign_qr
import random


def campaign_directory_path(instance, filename):
    return f'campaign/{instance.id}/{filename}'


def campaign_qr_path(instance, filename):
    return f'campaign/{instance.id}/{filename}'


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


class CollectorType(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class StampDesign(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Campaign(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    description = models.TextField(verbose_name='campaign description', blank=True, null=True)
    additional_information = models.TextField(verbose_name='additional information', blank=True, null=True)
    value_goal = models.FloatField(blank=False, null=False)
    collector_type = models.ForeignKey(CollectorType, on_delete=models.DO_NOTHING, related_name='campaigns')
    date_created = models.DateTimeField(auto_now_add=True)
    beginning_date = models.DateField(blank=False, null=False, auto_now_add=True)
    ending_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True,
                                              related_name='campaigns')

    # Configs
    stamp_design = models.ForeignKey(StampDesign, on_delete=models.DO_NOTHING, related_name='campaigns', blank=True,
                                     null=True)
    image = models.ImageField(verbose_name='image', upload_to=campaign_directory_path, blank=True)
    logo = models.ImageField(verbose_name='logo', upload_to=campaign_directory_path, blank=True)

    color = models.CharField(max_length=20, blank=False, null=False, default='#6870ec')
    qr_code = models.ImageField(verbose_name='QR code', upload_to=campaign_qr_path, blank=True)
    self_scann_amount = models.IntegerField(verbose_name='Amount of points or stamps gets when scan', blank=True,
                                            null=True)
    secret_key = models.CharField(max_length=15, default=code_generator, null=True, blank=True)

    def save(self, *args, **kwargs):

        # If the instance already exists in the database, retrieve the old instance to compare images.
        if self.pk:
            old_instance = Campaign.objects.filter(pk=self.pk).first()
            if old_instance:
                old_qr_code = old_instance.qr_code
            else:
                old_qr_code = None
        else:
            old_qr_code = None

        create = self._state.adding

        if not create:
            secret = jwt.encode({"business_id": self.business_user_profile.user.id, "campaign_id": self.id},
                                self.secret_key, algorithm="HS256")
            png_qr_code = generate_campaign_qr(text=f'https://ugem.app/?code={secret}')
            filename = f'qr_{self.name}_{self.id}.png'

            self.qr_code.save(filename, ContentFile(png_qr_code), save=False)

            # After saving the new image or qr, remove the old file if it's different
            if old_qr_code and old_qr_code.name and old_qr_code.name != self.qr_code.name:
                old_qr_code.delete(save=False)

            super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)
            # If the instance already exists in the database, retrieve the old instance to compare images.
            if self.collector_type.id == 1:
                self.self_scann_amount = 1

            if self.collector_type.id == 2:
                self.self_scann_amount = 10

            secret = jwt.encode({"business_id": self.business_user_profile.user.id, "campaign_id": self.id},
                                self.secret_key, algorithm="HS256")
            png_qr_code = generate_campaign_qr(text=f'https://ugem.app/?code={secret}')
            filename = f'qr_{self.name}_{self.id}.png'

            self.qr_code.save(filename, ContentFile(png_qr_code), save=False)
            super().save()

    def delete(self, *args, **kwargs):
        # Delete the images file from the storage
        self.qr_code.delete(save=False)
        self.image.delete(save=False)
        self.logo.delete(save=False)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.name

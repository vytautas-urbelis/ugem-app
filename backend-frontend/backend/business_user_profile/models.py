import jwt
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

# import segno
from django.core.files.base import ContentFile
# from io import BytesIO

import random

# from project.settings import MEDIA_ROOT
from utils.svg_png import generate_qr_with_svg_overlay

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


def logo_directory_path(instance, filename):
    return f'business_logo/{instance.user.id}/{filename}'


def shop_image_directory_path(instance, filename):
    return f'business_shop_image/{instance.user.id}/{filename}'


def business_user_qr_directory_path(instance, filename):
    return f'business_qr/{instance.user.email}/{filename}'


class BusinessCategory(models.Model):
    name = models.CharField(verbose_name="Business category", max_length=100)

    def __str__(self):
        return self.name


# Create your models here.
class BusinessUserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='business_user_profile')
    code = models.CharField(max_length=15, unique=True, default=code_generator)
    business_name = models.CharField(verbose_name='business name', max_length=100)
    business_category = models.ForeignKey(BusinessCategory, on_delete=models.CASCADE,
                                          related_name='business', blank=True, null=True)
    about = models.TextField(verbose_name="about", max_length=1000, default='Hello :)', null=True, blank=True)
    country = models.CharField(verbose_name='country', max_length=80)
    city = models.CharField(verbose_name='city', max_length=60)
    street = models.CharField(verbose_name='street', max_length=100)
    street_number = models.CharField(verbose_name='street number', max_length=100, null=True, blank=True)
    zip = models.CharField(verbose_name='zip', max_length=10)
    latitude = models.DecimalField(verbose_name='latitude', decimal_places=9, max_digits=12, null=True, blank=True)
    longitude = models.DecimalField(verbose_name='longitude', decimal_places=9, max_digits=12, null=True, blank=True)
    website = models.URLField(verbose_name='website', blank=True)
    logo = models.ImageField(verbose_name='logo', upload_to=logo_directory_path, blank=True, null=True)
    shop_image = models.ImageField(verbose_name='shop_image', upload_to=shop_image_directory_path, blank=True,
                                   null=True)
    qr_code = models.ImageField(upload_to=business_user_qr_directory_path)
    is_verified = models.BooleanField(default=False, blank=True, null=True)

    agreed_tos = models.BooleanField(default=False, blank=True, null=True)
    agreed_tos_date = models.DateTimeField(blank=True, null=True)

    subscription = models.BooleanField(default=False, blank=True, null=True)
    is_vip = models.BooleanField(default=False, blank=True, null=True)

    def save(self, *args, **kwargs):
        # If the instance already exists in the database, retrieve the old instance to compare images.
        if self.pk:
            old_instance = BusinessUserProfile.objects.filter(pk=self.pk).first()
            if old_instance:
                old_qr_code = old_instance.qr_code
                old_logo = old_instance.logo
                old_shop_image = old_instance.shop_image
            else:
                old_qr_code = None
                old_logo = None
                old_shop_image = None
        else:
            old_qr_code = None
            old_logo = None
            old_shop_image = None

        create = self._state.adding
        secret = jwt.encode({"business_id": self.user.id}, self.user.email, algorithm="HS256")

        if not create:
            png_qr_code = generate_qr_with_svg_overlay(text=f'https://ugem.app/get-started/{secret}')
            filename = f'qr_{self.user}_{self.user.id}.png'

            if self.qr_code:
                self.qr_code.delete(save=False)  # Delete the old file if it exists
            self.qr_code.save(filename, ContentFile(png_qr_code), save=False)
        else:
            png_qr_code = generate_qr_with_svg_overlay(text=f'https://ugem.app/get-started/{secret}')
            filename = f'qr_{self.user}_{self.user.id}.png'

            self.qr_code.save(filename, ContentFile(png_qr_code), save=False)
        super().save(*args, **kwargs)

        # After saving the new image or qr, remove the old file if it's different
        if old_qr_code and old_qr_code.name and old_qr_code.name != self.qr_code.name:
            old_qr_code.delete(save=False)
        if old_logo and old_logo.name and old_logo.name != self.logo.name:
            old_logo.delete(save=False)
        if old_shop_image and old_shop_image.name and old_shop_image.name != self.shop_image.name:
            old_shop_image.delete(save=False)

    def delete(self, *args, **kwargs):
        # Delete the images file from the storage
        self.qr_code.delete(save=False)
        self.shop_image.delete(save=False)
        self.logo.delete(save=False)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.business_name


class BusinessWallMessage(models.Model):
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE,
                                              related_name='business_wall')
    # date_created = models.DateField(auto_now_add=True)
    date_created = models.DateTimeField(auto_now_add=True)
    message = models.TextField(verbose_name="Message on wall", max_length=300)

    def likes_number(self):
        return self.likes.count()

    def __str__(self):
        return self.message


@receiver(post_save, sender=User)
def create_registration_profile(sender, instance, created, **kwargs):
    if created and instance.is_business:
        BusinessUserProfile.objects.get_or_create(user=instance)

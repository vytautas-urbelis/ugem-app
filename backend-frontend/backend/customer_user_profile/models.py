import random
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from business_user_profile.models import BusinessUserProfile, BusinessWallMessage
from utils.nickname_generator.nickname import generate_unique_nickname

User = get_user_model()


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


def avatar_directory_path(instance, filename):
    return f'user_avatar/{instance.user.id}/{filename}'


def end_user_qr_directory_path(instance, filename):
    return f'user_qr/{instance.user.email}/{filename}'


def generate_nickname(email):
    return email.split('@')[0]


# Create your models here.
class CustomerUserProfile(models.Model):
    code = models.CharField(max_length=15, unique=True, default=code_generator)
    secret_key = models.CharField(max_length=15, unique=True, default=code_generator)
    nickname = models.CharField(max_length=30, blank=True)
    first_name = models.CharField(verbose_name='first name', max_length=80, blank=True)
    last_name = models.CharField(verbose_name='last name', max_length=80, blank=True)
    country = models.CharField(verbose_name='country', max_length=80, blank=True)
    city = models.CharField(verbose_name='city', max_length=60, blank=True)
    street = models.CharField(verbose_name='street', max_length=100, blank=True)
    street_number = models.CharField(verbose_name='street number', max_length=100, null=True, blank=True)
    zip = models.CharField(verbose_name='zip', max_length=10, blank=True)
    avatar = models.ImageField(verbose_name='avatar', upload_to=avatar_directory_path, blank=True)
    is_verified = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='customer_user_profile')
    referred_by = models.ForeignKey("self", on_delete=models.SET_NULL, null=True, related_name='referred_users')
    referred_by_business = models.ForeignKey(BusinessUserProfile, on_delete=models.SET_NULL, null=True,
                                             related_name='referred_users')
    liked_messages = models.ManyToManyField(BusinessWallMessage, related_name='likes', blank=True)
    followed_businesses = models.ManyToManyField(BusinessUserProfile, related_name='followers', blank=True)
    subscribed_businesses = models.ManyToManyField(BusinessUserProfile, related_name='subscribers', blank=True)

    agreed_tos = models.BooleanField(default=False, blank=True, null=True)
    agreed_tos_date = models.DateTimeField(blank=True, null=True)

    # device_id = models.CharField(blank=True, null=True)

    def save(self, *args, **kwargs):

        # If the instance already exists, retrieve the old avatar
        if self.pk:
            old_instance = CustomerUserProfile.objects.filter(pk=self.pk).first()
            if old_instance:
                old_avatar = old_instance.avatar
            else:
                old_avatar = None
                # nickname = generate_nickname(self.user.email)
                # self.nickname = nickname
                self.nickname = generate_unique_nickname(CustomerUserProfile, self.pk)
        else:
            old_avatar = None

        # if self.pk:
        #     old_instance = CustomerUserProfile.objects.filter(pk=self.pk).first()
        #     if not old_instance:

        super().save(*args, **kwargs)
        # After saving, check if we need to delete the old avatar
        if old_avatar and old_avatar.name and old_avatar.name != self.avatar.name:
            # Delete the old avatar file from storage
            old_avatar.delete(save=False)

    def delete(self, *args, **kwargs):
        # Delete the images file from the storage
        self.avatar.delete(save=False)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.nickname


@receiver(post_save, sender=User)
def create_registration_profile(sender, instance, **kwargs):
    if not instance.is_business:
        CustomerUserProfile.objects.get_or_create(user=instance)

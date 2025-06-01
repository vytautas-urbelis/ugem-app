from django.contrib.auth.models import AbstractUser
from django.db import models
import random


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


# Create your models here.
class User(AbstractUser):
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    email = models.EmailField(unique=True)
    apple_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    is_business = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    password_recovery_code = models.CharField(max_length=15, unique=True, default=code_generator)
    password_recovery_in_progress = models.BooleanField(default=False)

    def __str__(self):
        return self.email

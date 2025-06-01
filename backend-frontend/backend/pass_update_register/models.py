import random

from django.db import models


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


# Create your models here.
class AppleDevice(models.Model):
    device_library_id = models.CharField(max_length=100)
    push_token = models.CharField(max_length=300)
    apple_pass = models.ManyToManyField(to="ApplePass", related_name="apple_device")

    def __str__(self):
        return self.device_library_id


class ApplePass(models.Model):
    pass_type_id = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100)
    last_updated = models.CharField(max_length=15, default=code_generator)

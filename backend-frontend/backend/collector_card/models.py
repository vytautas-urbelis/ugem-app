import random
from django.db import models

from business_user_profile.models import BusinessUserProfile
from campaign.models import Campaign
from customer_user_profile.models import CustomerUserProfile


def code_generator(length=15):
    numbers = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
    return ''.join(random.choice(numbers) for _ in range(length))


def collector_card_logo_path(instance, filename):
    return f'collector_card/{instance.id}/{filename}'


def collector_card_qr_path(instance, filename):
    return f'collector_card_qr/{instance.id}/{filename}'


class CollectorCard(models.Model):
    value_added = models.FloatField(default=0)
    value_counted = models.FloatField(default=0)
    value_goal = models.FloatField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_expired = models.DateField(blank=True, null=True)
    is_collected = models.BooleanField(default=False)
    is_used = models.BooleanField(default=False)
    # business_name = models.CharField(verbose_name='business name', max_length=200, blank=False, null=False)
    # campaign_name = models.CharField(verbose_name='Campaign Name', max_length=40)
    to_qr = models.CharField(verbose_name='jwt{voucher_id, secret_key}', max_length=400, blank=False, null=False)
    serial_nr = models.CharField(verbose_name='Serial nr', max_length=15, unique=True, default=code_generator)
    qr_code = models.ImageField(verbose_name='Customers QR code', upload_to=collector_card_qr_path, blank=True)

    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, related_name='collectors')

    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE, related_name='collectors',
                                              null=True)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, related_name='collectors',
                                              null=True)

    # logo = models.ImageField(verbose_name='business logo', upload_to=collector_card_logo_path, blank=True,
    #                          null=True)  # as logo for Apple Card

    # strip_img = models.IntegerField(blank=True)  # one of 10 stamps 0 - 9

    def __str__(self):
        return self.campaign.name if self.campaign else 'Campaign Deleted - expired'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.qr_code = self.customer_user_profile.customer_card.qr_code
        self.to_qr = self.customer_user_profile.customer_card.to_qr
        super().save(update_fields=['qr_code', 'to_qr'])
        LogsCollector.objects.create(collector=self)


class LogsCollector(models.Model):
    collector = models.ForeignKey('CollectorCard', on_delete=models.SET_NULL, related_name='logs_collectors', null=True)
    collector_id_nr = models.IntegerField(blank=True, null=True)
    value_added = models.FloatField(default=0, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.collector_id_nr = self.collector.id
        self.value_added = self.collector.value_added
        super().save(update_fields=['collector_id_nr', 'value_added'])

    def __str__(self):
        return f"Log for {self.collector} at {self.date_created}"

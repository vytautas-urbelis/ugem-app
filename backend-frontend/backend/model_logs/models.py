from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

from django.db.models.signals import post_save
from django.dispatch import receiver

from business_user_profile.models import BusinessWallMessage, BusinessUserProfile
from campaign.models import Campaign
from collector_card.models import CollectorCard
from customer_user_profile.models import CustomerUserProfile
from promotion.models import Promotion
from teams_request.models import TeamsRequest
from voucher_card.models import VoucherCard

User = get_user_model()

"""
Campaign Message Logs
"""


@receiver(post_save, sender=Campaign)
def log_save_campaign(sender, instance, created, **kwargs):
    if created:
        create_log_campaign(instance, 'create')
    else:
        create_log_campaign(instance, 'update')


class LogsCampaign(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
    )

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_campaign')
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='logs')


def create_log_campaign(instance, action):
    LogsCampaign.objects.create(
        action=action,
        business_user_profile=instance.business_user_profile,
        campaign=instance
    )


"""
Campaign message Logs
"""


@receiver(post_save, sender=Promotion)
def log_save_promotion(sender, instance, created, **kwargs):
    if created:
        create_log_promotion(instance, 'create')
    else:
        create_log_promotion(instance, 'update')


class LogsPromotion(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
    )

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_promotion')
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name='logs')


def create_log_promotion(instance, action):
    LogsPromotion.objects.create(
        action=action,
        business_user_profile=instance.business_user_profile,
        promotion=instance
    )


"""
Collector Card message Logs
"""


@receiver(post_save, sender=VoucherCard)
def log_save_voucher_card(sender, instance, created, **kwargs):
    if created:
        pass
        # create_log_voucher_card(instance, 'issued')
    else:
        create_log_voucher_card(instance, 'issued')


class LogsVoucherCard(models.Model):
    ACTION_CHOICES = (
        ('issued', 'Issued'),
        ('used', 'Used'),
    )

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_voucher_card')
    voucher_card = models.ForeignKey(VoucherCard, on_delete=models.CASCADE, null=True, blank=True,
                                     related_name='logs')
    campaign_name = models.CharField(max_length=200, null=True, blank=True)
    promotion_name = models.CharField(max_length=200, null=True, blank=True)
    business_name = models.CharField(max_length=200, null=True, blank=True)


def create_log_voucher_card(instance, action):
    LogsVoucherCard.objects.create(
        action=action,
        customer_user_profile=instance.customer_user_profile,
        voucher_card=instance,
        campaign_name=instance.campaign.name if instance.campaign else None,
        promotion_name=instance.promotion.name if instance.promotion else None,
        business_name=instance.business_user_profile.business_name if instance.business_user_profile else None,
    )


"""
Teams Requests Logs
"""


@receiver(post_save, sender=TeamsRequest)
def log_save_teams_request(sender, instance, created, **kwargs):
    if created:
        create_log_teams_request(instance, 'create')
    else:
        create_log_teams_request(instance, 'update')


class LogsTeamsRequest(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'update'),
    )
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    status = models.CharField(max_length=12)
    timestamp = models.DateTimeField(default=timezone.now)
    requester = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
                                  related_name='logs_requests')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='logs_received_requests')


def create_log_teams_request(instance, action):
    LogsTeamsRequest.objects.create(
        action=action,
        status=instance.status,
        requester=instance.requester,
        receiver=instance.receiver,
    )


"""
Collector Card message Logs
"""


class LogsCollectorCard(models.Model):
    ACTION_CHOICES = (
        ('create', 'Create'),
        ('update', 'Update'),
    )

    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.SET_NULL, null=True, blank=True,
                                              related_name='logs_collector_card')
    value_added = models.FloatField(default=0)
    value_counted = models.FloatField(default=0)
    value_goal = models.FloatField(default=0)
    collector_card = models.ForeignKey(CollectorCard, on_delete=models.SET_NULL, null=True, blank=True,
                                       related_name='logs')


"""
Like Wall Message Logs
"""


class LogsWallMessage(models.Model):
    ACTION_CHOICES = (
        ('like', 'Like'),
        ('unlike', 'Unlike'),
        ('create', 'Create'),
    )

    action = models.CharField(max_length=15, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_wall_message')
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_wall_message')
    wall_message = models.ForeignKey(BusinessWallMessage, on_delete=models.CASCADE, null=True, blank=True,
                                     related_name='like_logs')


"""
Follow Business Logs
"""


class LogsFollowBusiness(models.Model):
    ACTION_CHOICES = (
        ('follow', 'Follow'),
        ('unfollow', 'Unfollow'),
    )

    action = models.CharField(max_length=15, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_follow_business')
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='follow_logs')


"""
Subscribe Business Logs
"""


class LogsSubscribeBusiness(models.Model):
    ACTION_CHOICES = (
        ('subscribe', 'Subscribe'),
        ('unsubscribe', 'Unsubscribe'),
    )

    action = models.CharField(max_length=15, choices=ACTION_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='logs_subscription_business')
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, null=True, blank=True,
                                              related_name='subscription_logs')

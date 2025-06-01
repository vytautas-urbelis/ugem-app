from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()


class RevenueCatEvent(models.Model):
    # Common fields
    event_timestamp = models.DateTimeField()
    product_id = models.CharField(max_length=255)
    period_type = models.CharField(max_length=50)
    purchased_at = models.DateTimeField()
    expiration_at = models.DateTimeField(null=True, blank=True)
    environment = models.CharField(max_length=50)
    entitlement_id = models.CharField(max_length=255, null=True, blank=True)
    entitlement_ids = models.JSONField(default=list, null=True, blank=True)
    presented_offering_id = models.CharField(max_length=255, null=True, blank=True)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    original_transaction_id = models.CharField(max_length=255, null=True, blank=True)
    is_family_share = models.BooleanField(default=False, null=True, blank=True)
    country_code = models.CharField(max_length=10, null=True, blank=True)
    app_user_id = models.CharField(max_length=255)
    aliases = models.JSONField(default=list)
    original_app_user_id = models.CharField(max_length=255)
    currency = models.CharField(max_length=10, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    price_in_purchased_currency = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    subscriber_attributes = models.JSONField(default=dict)
    store = models.CharField(max_length=50)
    takehome_percentage = models.FloatField(null=True, blank=True)
    offer_code = models.CharField(max_length=255, null=True, blank=True)
    type = models.CharField(max_length=50)
    event_id = models.CharField(max_length=255)
    app_id = models.CharField(max_length=255)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='revenue_cat_events', null=True, blank=True)

    # Fields for optional scenarios
    is_trial_conversion = models.BooleanField(null=True, blank=True)
    expiration_reason = models.CharField(max_length=50, null=True, blank=True)
    tax_percentage = models.FloatField(null=True, blank=True)
    commission_percentage = models.FloatField(null=True, blank=True)

    def __str__(self):
        return f"Event {self.type} - {self.transaction_id}"

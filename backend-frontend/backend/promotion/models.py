from django.db import models

from business_user_profile.models import BusinessUserProfile
from customer_card.models import CardType
from customer_user_profile.models import CustomerUserProfile


def deal_directory_path(instance, filename):
    return f'promotion/{instance.id}/{filename}'


# Create your models here.
class Promotion(models.Model):
    name = models.CharField(verbose_name='name', max_length=200)
    description = models.TextField(verbose_name='promotion description')
    additional_information = models.TextField(verbose_name='additional information', blank=True, null=True)
    image = models.ImageField(verbose_name='promotion image', upload_to=deal_directory_path, null=True, blank=True)
    vouchers_amount = models.IntegerField(verbose_name='amount of vouchers')
    vouchers_issued = models.IntegerField(verbose_name='amount of vouchers issued', default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_ends = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True, verbose_name='is active', null=True, blank=True)
    card_type = models.ForeignKey(CardType, on_delete=models.SET_NULL, related_name='promotions', null=True)
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE, related_name='promotions')
    customer_user_profile = models.ManyToManyField(CustomerUserProfile, related_name='promotions', blank=True)

    def __str__(self):
        return self.name

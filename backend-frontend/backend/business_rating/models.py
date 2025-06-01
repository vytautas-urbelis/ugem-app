from django.db import models

from business_user_profile.models import BusinessUserProfile
from customer_user_profile.models import CustomerUserProfile


# Create your models here.

class BusinessRating(models.Model):
    business_user_profile = models.ForeignKey(BusinessUserProfile, on_delete=models.CASCADE,
                                              related_name='customer_ratings')
    customer_user_profile = models.ForeignKey(CustomerUserProfile, on_delete=models.CASCADE,
                                              related_name='business_ratings')
    date_created = models.DateTimeField(auto_now_add=True)
    rating = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.business_user_profile} was rated {self.rating} by {self.customer_user_profile}"

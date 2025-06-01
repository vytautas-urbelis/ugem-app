from django.contrib import admin

from business_rating.models import BusinessRating


@admin.register(BusinessRating)
class BusinessRatingAdmin(admin.ModelAdmin):
    list_display = ['customer_user_profile', 'business_user_profile', 'date_created', 'rating']

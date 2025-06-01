from django.contrib import admin

from customer_user_profile.models import CustomerUserProfile


@admin.register(CustomerUserProfile)
class CustomerUserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'first_name', 'last_name', 'city', 'street', 'zip', 'agreed_tos', 'agreed_tos_date']

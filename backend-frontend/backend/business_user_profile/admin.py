from django.contrib import admin

from business_user_profile.models import BusinessUserProfile, BusinessWallMessage, BusinessCategory


@admin.register(BusinessUserProfile)
class BusinessUserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'business_name', 'country', 'city', 'street', 'zip', 'agreed_tos', 'agreed_tos_date']


@admin.register(BusinessWallMessage)
class BusinessWallMessageAdmin(admin.ModelAdmin):
    list_display = ['business_user_profile', 'message']


@admin.register(BusinessCategory)
class BusinessCategoryAdmin(admin.ModelAdmin):
    list_display = ['name']

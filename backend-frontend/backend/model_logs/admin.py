from django.contrib import admin

from model_logs.models import LogsWallMessage, LogsCollectorCard, LogsCampaign, LogsFollowBusiness, \
    LogsSubscribeBusiness, LogsPromotion, LogsVoucherCard, LogsTeamsRequest


@admin.register(LogsWallMessage)
class LogsWallMessageAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'customer_user_profile', 'business_user_profile', 'wall_message']


@admin.register(LogsCampaign)
class LogsCampaignAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'business_user_profile', 'campaign']


@admin.register(LogsPromotion)
class LogsPromotionAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'business_user_profile', 'promotion']


@admin.register(LogsTeamsRequest)
class LogsTeamsRequestAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'status', 'requester', 'receiver']


@admin.register(LogsCollectorCard)
class LogsCollectorCardAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'customer_user_profile', 'value_added', 'value_counted', 'value_goal',
                    'collector_card']


@admin.register(LogsVoucherCard)
class LogsVoucherCardAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'customer_user_profile', 'business_name', 'campaign_name', 'voucher_card']


@admin.register(LogsFollowBusiness)
class LogsFollowBusinessAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'customer_user_profile', 'business_user_profile']


@admin.register(LogsSubscribeBusiness)
class LogsSubscribeBusinessAdmin(admin.ModelAdmin):
    list_display = ['action', 'timestamp', 'customer_user_profile', 'business_user_profile']

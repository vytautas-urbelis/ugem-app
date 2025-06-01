from django.urls import path
from web_hooks.views import AcceptRevenueCatHook

urlpatterns = [
    path('revenue-cat/subscriptions/', AcceptRevenueCatHook.as_view(), name='revenue_cat_hook'),
]

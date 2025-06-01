from django.urls import path

from newsletter.views import SubscribeNewsletterView

urlpatterns = [
    path('newsletter/', SubscribeNewsletterView.as_view(), name='Subscribe for newsletter'),

]

from django.urls import path

from business_rating.views import BusinessRatingView

urlpatterns = [
    path('user/business/rate/', BusinessRatingView.as_view(), name='Rate business user'),
]

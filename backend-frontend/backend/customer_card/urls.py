from django.urls import path

from customer_card.views import GetCustomerCard, VerifyCustomerView

urlpatterns = [
    path('customer-card/get/', GetCustomerCard.as_view(), name='gets customer card'),
    path('customer-card/verify-customer/', VerifyCustomerView.as_view(), name='gets customer card'),

]

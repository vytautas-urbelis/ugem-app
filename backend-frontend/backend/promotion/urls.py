from django.urls import path

from promotion.views import ListCreatePromotionView, ReadUpdateDeletePromotionView, ListClosedPromotionsView, \
    ListOpenPromotionsView, ListSpecificBusinessOpenPromotionsView

urlpatterns = [
    path('promotion/', ListCreatePromotionView.as_view(), name='create, get logged in business deals'),
    path('promotion/open/', ListOpenPromotionsView.as_view(), name='get logged in business open promotions'),
    path('promotion/customer/open/<int:pk>', ListSpecificBusinessOpenPromotionsView.as_view(),
         name='get logged in business open promotions'),
    path('promotion/closed/', ListClosedPromotionsView.as_view(), name='get logged in business closed promotions'),
    path('promotion/<int:pk>', ReadUpdateDeletePromotionView.as_view(), name='update, delete logged in business deals'),
    path('promotion/acquire/<int:pk>', ReadUpdateDeletePromotionView.as_view(),
         name='acquire voucher from given promotion'),

]

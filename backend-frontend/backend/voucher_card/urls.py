from django.urls import path

from voucher_card.views import UseVoucherView, CustomerUsersActiveVouchers, CustomerUsersUsedVouchers, \
     GetVoucherView, IsVoucherUsed, CreatePromotionVoucherView

urlpatterns = [
    path('voucher-card/use/', UseVoucherView.as_view(), name='Use voucher'),
    path('voucher-card/get/', GetVoucherView.as_view(), name='Get voucher'),
    # path('voucher-card/create/', CreateCampaignVoucherView.as_view(), name='Create voucher'),
    path('voucher-card/promotion-create/', CreatePromotionVoucherView.as_view(), name='Create voucher from promotion'),
    path('voucher-card/is-used/<int:voucher_id>', IsVoucherUsed.as_view(), name='Check if voucher is used'),
    path('voucher-card/customer/active/', CustomerUsersActiveVouchers.as_view(),
         name='Get end users active vouchers'),
    path('voucher-card/customer/used/', CustomerUsersUsedVouchers.as_view(),
         name='Get end users used vouchers'),

]

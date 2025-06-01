from django.urls import path

from user.apple_account import AppleAuthSignInView, AppleAuthSignUpView, AppleAuthSignInClipView
from user.business_user_views import CreateBusinessUser, VeryfiBusinessUserView, MeBusinessUser, UpdateBusinessUser, \
    DeleteBusinessUser, ListCreateBusinessWallMessageView, DeleteBusinessWallMessageView, SendQrToEmail, \
    GetBusinessUserById, ResendVerificationLinkView, BusinessCategoryListView

from user.customer_user_views import CreateCustomerUser, VerifyCustomerUserAndCreateCard, MeCustomerUser, \
    UpdateCustomerUser, CreateCustomerUserCard, CreateCustomerUserVoucherCard, \
    CreateCustomerUserCollectorCard, GetCustomerUserById, SendVerificationEmail, CustomerUserByEmailIsVerified, \
    FallowBusinessOnScan, ToggleFallowBusiness, ToggleSubscribeBusiness, ToggleLikeWallMessage, DeleteCustomerUser, \
    CreateBusinessUserProfile, GetBusinessOnScan
from user.google_account import GoogleAuthSignUpView, GoogleAuthSignInView
from user.views import RecoverPasswordView, AskToRecoverPasswordView, GetMyProfilesView

urlpatterns = [
    path('user/recover-password/', AskToRecoverPasswordView.as_view(), name='Password recover link'),
    path('user/change-password/', RecoverPasswordView.as_view(), name='Change user password'),

    path('user/profiles/', GetMyProfilesView.as_view(), name='get-all-user-profiles'),

    path('business-wall/', ListCreateBusinessWallMessageView.as_view(), name='Add, get wall message'),
    path('business/send-qr/', SendQrToEmail.as_view(), name='Send business qr'),
    path('business-wall/<int:pk>/', DeleteBusinessWallMessageView.as_view(), name='delete wall message'),
    path('business-wall/like/<int:pk>/', ListCreateBusinessWallMessageView.as_view(), name='like wall message'),
    path('business/user/add/', CreateBusinessUser.as_view(), name='Add business user'),
    path('business/user/verify/', VeryfiBusinessUserView.as_view(), name='Verify business user'),
    path('business/user/resend-link/', ResendVerificationLinkView.as_view(), name='Resend verification link'),
    path('business/user/me/', MeBusinessUser.as_view(), name='Gets back logged in business user object'),
    path('business/user/update/', UpdateBusinessUser.as_view(), name='Update business user'),
    path('business/user/delete/', DeleteBusinessUser.as_view(), name='Delete business user'),
    path('business/user/<int:pk>/', GetBusinessUserById.as_view(), name='Get business user by id'),
    path('business/categories/', BusinessCategoryListView.as_view(), name='Get business category list'),

    path('customer/user/<int:pk>/', GetCustomerUserById.as_view(), name='Get customer user by id'),
    path('customer/user/add/', CreateCustomerUser.as_view(), name='Add end user'),
    path('customer/user/is-verified/', CustomerUserByEmailIsVerified.as_view(),
         name='Get user to check if it is verified'),
    path('customer/user/send-link/', SendVerificationEmail.as_view(), name='Send verification link'),
    path('customer/user/verify/', VerifyCustomerUserAndCreateCard.as_view(),
         name='Verify customer'),
    path('customer/user/customer-card/', CreateCustomerUserCard.as_view(), name='Create and download users card'),
    path('customer/user/voucher-card/', CreateCustomerUserVoucherCard.as_view(),
         name='Create and download voucher card'),
    path('customer/user/collector-card/', CreateCustomerUserCollectorCard.as_view(),
         name='Create and download collector card'),
    path('customer/user/me/', MeCustomerUser.as_view(), name='Gets back logged in end user object'),
    path('customer/user/update/', UpdateCustomerUser.as_view(), name='Update end user'),
    path('customer/user/delete/', DeleteCustomerUser.as_view(), name='Delete customer user'),
    path('customer/user/create-business-profile/', CreateBusinessUserProfile.as_view(), name='Create business profile'),

    path('customer/follow/', FallowBusinessOnScan.as_view(), name='Fallow business on scan'),
    path('customer/get-business-scann/', GetBusinessOnScan.as_view(), name='get-business-id-on-scan'),
    path('customer/follow/toggle/', ToggleFallowBusiness.as_view(), name='toggle follow business'),

    path('customer/subscribe/toggle/', ToggleSubscribeBusiness.as_view(), name='toggle subscribe business'),

    path('customer/like/wall-message/', ToggleLikeWallMessage.as_view(), name='toggle like wall message'),

    # path('clip/user/get-create/', CreateGetClipUser.as_view(), name='clip user'),

    path('google/auth/sign-up/', GoogleAuthSignUpView.as_view(), name='google-auth-sign-in'),
    path('google/auth/sign-in/', GoogleAuthSignInView.as_view(), name='google-auth-sign-in'),

    path('apple/auth/sign-up/', AppleAuthSignUpView.as_view(), name='apple-auth-sign-in'),
    path('apple/auth/sign-in/', AppleAuthSignInView.as_view(), name='apple-auth-sign-in'),
    path('apple/auth/clip/sign-in/', AppleAuthSignInClipView.as_view(), name='apple-auth-sign-in'),

]

"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

from project import settings
from user.views import TokenUserObtainView

schema_view = get_schema_view(
    openapi.Info(
        title="Django API",
        default_version='v1',
        description="Description of your Django App",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="academy@constructor.org"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,  # Set to False restrict access to protected endpoints
    permission_classes=(permissions.AllowAny,),  # Permissions for docs access
)

urlpatterns = [
    path('backend/api/admin/', admin.site.urls),
    path('backend/api/auth/token/', TokenUserObtainView.as_view(), name='token_obtain_pair'),
    path('backend/api/auth/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('backend/api/auth/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_refresh'),
    path('backend/api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('backend/api/', include('user.urls')),
    path('backend/api/', include('campaign.urls')),
    path('backend/api/', include('collector_card.urls')),
    path('backend/api/', include('voucher_card.urls')),
    path('backend/api/', include('customer_card.urls')),
    path('backend/api/', include('promotion.urls')),
    path('backend/api/', include('insights.urls')),
    path('backend/api/', include('pass_update_register.urls')),
    path('backend/api/', include('newsletter.urls')),
    path('backend/api/', include('teams_request.urls')),
    path('backend/api/', include('business_rating.urls')),
    path('backend/api/', include('customer_user_profile.urls')),
    path('backend/api/', include('web_hooks.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    # urlpatterns += static(settings.APP_CLIPS_URL, document_root=settings.APP_CLIPS_ROOT)

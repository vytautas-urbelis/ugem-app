
from .settings import *

import tempfile
import os

# Use a temporary directory for MEDIA_ROOT during testing
TEMP_MEDIA_ROOT = tempfile.gettempdir()
MEDIA_ROOT = os.path.join(TEMP_MEDIA_ROOT, 'media')

if not os.path.exists(MEDIA_ROOT):
    os.makedirs(MEDIA_ROOT)

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'amnasbdfmnsbdfnb234872trg283iufg9287fg'

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/


# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DJANGO_DEBUG', 'False') == 'True'
# DEBUG = True

MEDIA_HOST = 'http://127.0.0.1:8000'
FRONT_END_HOST = 'http://127.0.0.1:5173'

if DEBUG is True:
    MEDIA_HOST = 'http://127.0.0.1:8000'
    FRONT_END_HOST = 'http://127.0.0.1:5173'
else:
    MEDIA_HOST = 'https://swiftybee.ch'
    FRONT_END_HOST = 'https://swiftybee.ch'

ALLOWED_HOSTS = ['swiftybee.ch', '*']

if DEBUG is True:
    ALLOWED_HOSTS += ['*']

if DEBUG is True:
    CORS_ALLOW_ALL_ORIGINS = True

# Application definition

INSTALLED_APPS = [

    # 'channels',
    'daphne',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'drf_yasg',
    'rest_framework',
    'corsheaders',

    'user',
    'business_user_profile',
    'customer_user_profile',
    'campaign',
    'promotion',
    'customer_card',
    'collector_card',
    'voucher_card',
    'pass_update_register',
    'newsletter',
    'model_logs',
    'teams_request',
    'business_rating',

]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'

REDIS_HOST = os.environ.get('REDIS_HOST', 'localhost')
REDIS_PORT = int(os.environ.get('REDIS_PORT', 6379))

ASGI_APPLICATION = 'project.asgi.application'
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [(REDIS_HOST, REDIS_PORT)],
        },
    },
}

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    'default': {
        "ENGINE": 'django.db.backends.postgresql_psycopg2',
        "NAME": os.environ.get('POSTGRES_DB'),
        "PORT": os.environ.get('POSTGRES_PORT'),
        "HOST": os.environ.get('POSTGRES_HOST'),
        "USER": os.environ.get('POSTGRES_USER'),
        "PASSWORD": os.environ.get('POSTGRES_PASSWORD'),
    }
}

if 'test' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',
        }
    }

# registry.gitlab.com/swiftybee/swiftybee

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static-files/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static-files') if DEBUG else '/static-files/'

MEDIA_URL = 'media-files/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]

}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=20),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=50)
}

AUTH_USER_MODEL = 'user.User'

# DOCUMENTATION

DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]

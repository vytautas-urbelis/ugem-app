# tests.py

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status

from user.models import User
from customer_user_profile.models import CustomerUserProfile
from business_user_profile.models import BusinessUserProfile, BusinessCategory
from customer_user_profile.serializers import CustomerUserProfileSerializer
from business_user_profile.serializers import BusinessUserProfileSerializer


class UserModelBusinessTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='testuserbusiness@example.com',
            username='business',
            password='testpass',
            is_business=True
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'testuserbusiness@example.com')
        self.assertEqual(self.user.username, 'business')
        self.assertTrue(self.user.is_business)
        self.assertTrue(isinstance(self.user, User))
        self.assertEqual(str(self.user), self.user.email)


class UserModelCustomerTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='testusercustomer@example.com',
            username='customer',
            password='testpass',
            is_business=False
        )

    def test_user_creation(self):
        self.assertEqual(self.user.email, 'testusercustomer@example.com')
        self.assertEqual(self.user.username, 'customer')
        self.assertFalse(self.user.is_business)
        self.assertTrue(isinstance(self.user, User))
        self.assertEqual(str(self.user), self.user.email)


class BusinessUserProfileModelTest(TestCase):

    def setUp(self):
        # Create the user
        self.user = User.objects.create_user(
            email='testuserbusiness@example.com',
            username='business',
            password='testpass',
            is_business=True
        )
        # Retrieve the automatically created business profile
        self.business_profile = BusinessUserProfile.objects.get(user=self.user)
        # Create a business category
        self.category = BusinessCategory.objects.create(name='Retail')
        # Update the profile fields
        self.business_profile.business_name = 'Test Business'
        self.business_profile.business_category = self.category
        self.business_profile.country = 'USA'
        self.business_profile.city = 'Los Angeles'
        self.business_profile.street = 'Main St'
        self.business_profile.zip = '90001'
        self.business_profile.save()

    def test_business_profile_update(self):
        # Refresh from the database to get the latest data
        self.business_profile.refresh_from_db()
        self.assertEqual(self.business_profile.business_name, 'Test Business')
        self.assertEqual(self.business_profile.business_category, self.category)
        self.assertEqual(self.business_profile.country, 'USA')
        self.assertEqual(self.business_profile.city, 'Los Angeles')
        self.assertEqual(str(self.business_profile), self.business_profile.business_name)


class CustomerUserProfileModelTest(TestCase):

    def setUp(self):
        # Create the user
        self.user = User.objects.create_user(
            email='testusercustomer@example.com',
            username='customer',
            password='testpass',
            is_business=False
        )
        # Retrieve the automatically created customer profile
        self.customer_profile = CustomerUserProfile.objects.get(user=self.user)
        # Update the profile fields
        self.customer_profile.first_name = 'John'
        self.customer_profile.last_name = 'Doe'
        self.customer_profile.country = 'USA'
        self.customer_profile.city = 'New York'
        self.customer_profile.save()

    def test_customer_profile_update(self):
        # Refresh from the database to get the latest data
        self.customer_profile.refresh_from_db()
        self.assertEqual(self.customer_profile.first_name, 'John')
        self.assertEqual(self.customer_profile.last_name, 'Doe')
        self.assertEqual(self.customer_profile.country, 'USA')
        self.assertEqual(self.customer_profile.city, 'New York')
        self.assertEqual(str(self.customer_profile), self.customer_profile.nickname)


class CustomerUserProfileSerializerTest(TestCase):

    def setUp(self):
        # Create the user
        self.user = User.objects.create_user(
            email='testusercustomer@example.com',
            username='customer',
            password='testpass',
            is_business=False
        )
        # Retrieve the automatically created customer profile
        self.customer_profile = CustomerUserProfile.objects.get(user=self.user)
        # Update the profile fields
        self.customer_profile.first_name = 'Jane'
        self.customer_profile.last_name = 'Doe'
        self.customer_profile.country = 'USA'
        self.customer_profile.city = 'San Francisco'
        self.customer_profile.save()
        self.serializer = CustomerUserProfileSerializer(instance=self.customer_profile)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            [
                'secret_key', 'first_name', 'last_name', 'nickname', 'country', 'city', 'street', 'street_number',
                'zip', 'avatar', 'is_verified', 'customer_card', 'followed_businesses'
            ]
        )

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['first_name'], 'Jane')
        self.assertEqual(data['last_name'], 'Doe')
        self.assertEqual(data['country'], 'USA')
        self.assertEqual(data['city'], 'San Francisco')


class BusinessUserProfileSerializerTest(TestCase):

    def setUp(self):
        # Create the user
        self.user = User.objects.create_user(
            email='testuserbusiness@example.com',
            username='business',
            password='testpass',
            is_business=True
        )
        # Retrieve the automatically created business profile
        self.business_profile = BusinessUserProfile.objects.get(user=self.user)
        # Create a business category
        self.category = BusinessCategory.objects.create(name='Hospitality')
        # Update the profile fields
        self.business_profile.business_name = 'Cafe 123'
        self.business_profile.business_category = self.category
        self.business_profile.country = 'USA'
        self.business_profile.city = 'Chicago'
        self.business_profile.street = 'Main St'
        self.business_profile.zip = '90001'
        self.business_profile.save()
        self.serializer = BusinessUserProfileSerializer(instance=self.business_profile)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            [
                'user_id', 'business_name', 'followers', 'about', 'country', 'city', 'street', 'street_number', 'zip',
                'latitude', 'longitude', 'website', 'logo', 'shop_image', 'qr_code', 'business_category',
                'is_verified', 'issued_vouchers', 'hearts_number', 'followers_number'
            ]
        )

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['business_name'], 'Cafe 123')
        self.assertEqual(data['country'], 'USA')
        self.assertEqual(data['city'], 'Chicago')
        self.assertEqual(data['street'], 'Main St')
        self.assertEqual(data['zip'], '90001')
        self.assertEqual(data['business_category']['name'], 'Hospitality')


class BusinessUserRegistrationTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.registration_url = reverse('Add business user')
        self.category = BusinessCategory.objects.create(name='Retail')

    def test_register_business_user(self):
        data = {
            'email': 'newbusiness@example.com',
            'password': 'testpass123',
            'password_repeat': 'testpass123',
            'street_number': '123',
            'street': 'Main St',
            'city': 'Metropolis',
            'country': 'USA',
            'postal_code': '12345',
            'latitude': '40.7128',
            'longitude': '-74.0060',
            'business_category': self.category.id,
            'business_name': 'New Business'
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(email='newbusiness@example.com').exists())
        user = User.objects.get(email='newbusiness@example.com')
        self.assertTrue(user.is_business)
        self.assertFalse(user.business_user_profile.is_verified)


class CustomerUserRegistrationTest(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.registration_url = reverse('Add end user')

    def test_register_customer_user(self):
        data = {
            'email': 'newcustomer@example.com',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertTrue(User.objects.filter(email='newcustomer@example.com').exists())
        user = User.objects.get(email='newcustomer@example.com')
        self.assertFalse(user.is_business)
        self.assertFalse(user.customer_user_profile.is_verified)


class BusinessUserLoginTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='businesslogin@example.com',
            username='businesslogin',
            password='testpass',
            is_business=True
        )
        self.user.business_user_profile.is_verified = True
        self.user.business_user_profile.save()
        self.login_url = reverse('token_obtain_pair')

    def test_login_business_user(self):
        data = {
            'email': 'businesslogin@example.com',
            'password': 'testpass',
            'account': 'business'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('business', response.data)
        self.assertEqual(response.data['business']['email'], 'businesslogin@example.com')


class CustomerUserLoginTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='customerlogin@example.com',
            username='customerlogin',
            password='testpass',
            is_business=False
        )
        self.user.customer_user_profile.is_verified = True
        self.user.customer_user_profile.save()
        self.login_url = reverse('token_obtain_pair')

    def test_login_customer_user(self):
        data = {
            'email': 'customerlogin@example.com',
            'password': 'testpass',
            'account': 'customer'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('customer', response.data)
        self.assertEqual(response.data['customer']['email'], 'customerlogin@example.com')


class BusinessProfileRetrievalTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='businessprofile@example.com',
            username='businessprofile',
            password='testpass',
            is_business=True
        )
        self.user.business_user_profile.is_verified = True
        self.user.business_user_profile.business_name = 'Profile Business'
        self.user.business_user_profile.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('Gets back logged in business user object')

    def test_get_business_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'businessprofile@example.com')
        self.assertEqual(response.data['business_user_profile']['business_name'], 'Profile Business')


class CustomerProfileRetrievalTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='customerprofile@example.com',
            username='customerprofile',
            password='testpass',
            is_business=False
        )
        self.user.customer_user_profile.is_verified = True
        self.user.customer_user_profile.first_name = 'Alice'
        self.user.customer_user_profile.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile_url = reverse('Gets back logged in end user object')

    def test_get_customer_profile(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'customerprofile@example.com')
        self.assertEqual(response.data['customer_user_profile']['first_name'], 'Alice')


class UnverifiedBusinessUserLoginTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='unverifiedbusiness@example.com',
            username='unverifiedbusiness',
            password='testpass',
            is_business=True
        )
        self.login_url = reverse('token_obtain_pair')

    def test_unverified_business_user_login(self):
        data = {
            'email': 'unverifiedbusiness@example.com',
            'password': 'testpass',
            'account': 'business'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('business', response.data)
        self.assertEqual(response.data['business']['email'], 'unverifiedbusiness@example.com')
        # self.assertEqual(response.data['message'], 'No active account found with the given credentials')


class UnauthorizedProfileAccessTest(APITestCase):

    def setUp(self):
        self.business_user = User.objects.create_user(
            email='businessuser@example.com',
            username='businessuser',
            password='testpass',
            is_business=True
        )
        self.business_user.business_user_profile.is_verified = True
        self.business_user.business_user_profile.save()

        self.customer_user = User.objects.create_user(
            email='customeruser@example.com',
            username='customeruser',
            password='testpass',
            is_business=False
        )
        self.customer_user.customer_user_profile.is_verified = True
        self.customer_user.customer_user_profile.save()

        self.client = APIClient()
        self.profile_url = reverse('Gets back logged in business user object')

    def test_customer_access_business_profile(self):
        self.client.force_authenticate(user=self.customer_user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, "User don't have Business profile.")

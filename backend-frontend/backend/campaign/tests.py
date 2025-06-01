from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from campaign.models import Campaign, CollectorType, StampDesign
from business_user_profile.models import BusinessUserProfile
from django.contrib.auth import get_user_model
# from rest_framework.authtoken.models import Token
from datetime import date, timedelta
from campaign.serializers import CampaignSerializer

# from collector_card.models import CollectorCard, LogsCollector

User = get_user_model()


class CampaignModelTest(TestCase):

    def setUp(self):
        # Create necessary related objects
        self.collector_type = CollectorType.objects.create(name='Points')
        self.stamp_design = StampDesign.objects.create(name='Default')
        self.user = User.objects.create_user(
            username='testuser', email='test@example.com', password='testpass'
        )
        self.business_profile = BusinessUserProfile.objects.create(user=self.user, business_name='Test Business')

        # Create a Campaign instance
        self.campaign = Campaign.objects.create(
            name='Test Campaign',
            description='A test campaign',
            value_goal=100.0,
            collector_type=self.collector_type,
            stamp_design=self.stamp_design,
            ending_date=date.today() + timedelta(days=30),
            business_user_profile=self.business_profile
        )

    def test_campaign_creation(self):
        self.assertEqual(self.campaign.name, 'Test Campaign')
        self.assertEqual(self.campaign.business_user_profile, self.business_profile)
        self.assertTrue(isinstance(self.campaign, Campaign))
        self.assertEqual(str(self.campaign), self.campaign.name)


class CampaignSerializerTest(TestCase):

    def setUp(self):
        self.collector_type = CollectorType.objects.create(name='Points')
        self.stamp_design = StampDesign.objects.create(name='Default')
        self.user = User.objects.create_user(
            username='serializeruser', email='serializer@example.com', password='testpass'
        )
        self.business_profile = BusinessUserProfile.objects.create(user=self.user, business_name='Serializer Business')

        self.campaign_attributes = {
            'name': 'Serializer Campaign',
            'description': 'Testing serializer',
            'value_goal': 200.0,
            'collector_type': self.collector_type,
            'stamp_design': self.stamp_design,
            'ending_date': date.today() + timedelta(days=15),
            'business_user_profile': self.business_profile
        }

        self.campaign = Campaign.objects.create(**self.campaign_attributes)
        self.serializer = CampaignSerializer(instance=self.campaign)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            [
                'id', 'is_active', 'closed', 'name', 'value_goal', 'stamp_design', 'description',
                'additional_information', 'date_created', 'beginning_date', 'ending_date', 'image',
                'logo', 'collector_type', 'business_user_profile', 'participants',
                'last_seven_days_participants', 'one_week_ago_participants', 'value',
                'last_seven_days_value', 'one_week_ago_value', 'vouchers_issued',
                'last_seven_days_vouchers_issued', 'one_week_ago_vouchers_issued'
            ]
        )

    def test_field_content(self):
        data = self.serializer.data
        self.assertEqual(data['name'], self.campaign_attributes['name'])
        self.assertEqual(data['description'], self.campaign_attributes['description'])
        self.assertEqual(data['value_goal'], self.campaign_attributes['value_goal'])
        self.assertEqual(data['business_user_profile']['business_name'], self.business_profile.business_name)


class CampaignAPITest(APITestCase):

    def setUp(self):
        # Create user and authenticate
        self.user = User.objects.create_user(
            username='apiuser', email='api@example.com', password='testpass'
        )
        self.business_profile = BusinessUserProfile.objects.create(user=self.user, business_name='API Business')

        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create CollectorType and StampDesign
        self.collector_type = CollectorType.objects.create(name='Points')
        self.stamp_design = StampDesign.objects.create(name='Default')

    def test_create_campaign(self):
        url = reverse('create, get logged in business campaigns')
        data = {
            'name': 'API Campaign',
            'description': 'Created via API test',
            'value_goal': 150.0,
            'collector_type': self.collector_type.id,
            'stamp_design': self.stamp_design.id,
            'ending_date': (date.today() + timedelta(days=10)).isoformat(),
            'is_active': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertEqual(Campaign.objects.get().name, 'API Campaign')

    def test_get_campaigns(self):
        # Create a campaign
        Campaign.objects.create(
            name='Existing Campaign',
            description='Already exists',
            value_goal=100.0,
            collector_type=self.collector_type,
            stamp_design=self.stamp_design,
            ending_date=date.today() + timedelta(days=5),
            business_user_profile=self.business_profile
        )

        url = reverse('create, get logged in business campaigns')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Existing Campaign')

    def test_unauthenticated_access(self):
        # Logout the user
        self.client.logout()

        url = reverse('create, get logged in business campaigns')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_campaign(self):
        # Create a campaign
        campaign = Campaign.objects.create(
            name='Update Campaign',
            description='To be updated',
            value_goal=100.0,
            collector_type=self.collector_type,
            stamp_design=self.stamp_design,
            ending_date=date.today() + timedelta(days=5),
            business_user_profile=self.business_profile
        )

        url = reverse('update, delete logged in business campaigns', kwargs={'pk': campaign.id})
        data = {
            'name': 'Updated Campaign',
            'description': 'Updated description',
            'value_goal': 200.0,
            'collector_type': self.collector_type.id,
            'stamp_design': self.stamp_design.id,
            'ending_date': (date.today() + timedelta(days=15)).isoformat(),
            'is_active': True
        }

        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        campaign.refresh_from_db()
        self.assertEqual(campaign.name, 'Updated Campaign')
        self.assertEqual(campaign.value_goal, 200.0)

    def test_delete_campaign(self):
        # Create a campaign
        campaign = Campaign.objects.create(
            name='Delete Campaign',
            description='To be deleted',
            value_goal=100.0,
            collector_type=self.collector_type,
            stamp_design=self.stamp_design,
            ending_date=date.today() + timedelta(days=5),
            business_user_profile=self.business_profile
        )

        url = reverse('update, delete logged in business campaigns', kwargs={'pk': campaign.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Campaign.objects.filter(id=campaign.id).exists())

    def test_access_another_users_campaign(self):
        # Create another user and campaign
        other_user = User.objects.create_user(
            username='otheruser', email='other@example.com', password='otherpass'
        )
        other_business_profile = BusinessUserProfile.objects.create(user=other_user, business_name='Other Business')

        other_campaign = Campaign.objects.create(
            name='Other Campaign',
            description='Belongs to another user',
            value_goal=100.0,
            collector_type=self.collector_type,
            stamp_design=self.stamp_design,
            ending_date=date.today() + timedelta(days=5),
            business_user_profile=other_business_profile
        )

        url = reverse('update, delete logged in business campaigns', kwargs={'pk': other_campaign.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

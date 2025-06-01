from datetime import timedelta

from django.db.models.functions import TruncDay
from django.utils import timezone

from django.db.models import Count
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from customer_user_profile.models import CustomerUserProfile
from user.serializers import CustomerUserSerializer
from voucher_card.models import VoucherCard


class CustomersStampsCountView(ListAPIView):
    serializer_class = CustomerUserSerializer

    def get(self, request, *args, **kwargs):
        campaign_id = self.kwargs['campaign_id']

        # Get the counts for value_counted from 1 to 10
        counts = (
            CustomerUserProfile.objects
            .filter(collectors__campaign__id=campaign_id)
            .values('collectors__value_counted')
            .annotate(count=Count('user_id', distinct=True))
            .order_by('collectors__value_counted')
        )

        # Convert the queryset to a list of dictionaries
        data = [
            {'label': entry['collectors__value_counted'], 'number': entry['count']}
            for entry in counts if 1 <= entry['collectors__value_counted'] <= 9
        ]

        # Ensure that all labels from 1 to 10 are represented in the data
        labels_present = {entry['label'] for entry in data}
        data.extend([
            {'label': i, 'number': 0} for i in range(1, 10) if i not in labels_present
        ])

        # Sort the data by label to maintain the order from 1 to 9
        data.sort(key=lambda x: x['label'])

        return Response(data, status=status.HTTP_200_OK)


class CustomersVisitsCountView(ListAPIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        campaign_id = kwargs['campaign_id']

        # Fetch counts in one query using annotations
        counts_queryset = (
            CustomerUserProfile.objects
            .filter(collectors__campaign__id=campaign_id,
                    collectors__logs_collectors__date_created__date__range=(thirty_days_ago, today))
            .annotate(date=TruncDay('collectors__logs_collectors__date_created'))
            .values('date')
            .annotate(count=Count('user__id'))  # add distinct=True to get uniq users
            .order_by('date')
        )

        # Convert datetime to date for consistent comparison
        counts_dict = {count['date'].date(): count['count'] for count in counts_queryset}

        # Prepare the response data, ensuring every day is represented
        data = [
            {'day': (thirty_days_ago + timedelta(days=i)).isoformat(),
             'number': counts_dict.get(thirty_days_ago + timedelta(days=i), 0)}
            for i in range(31)  # Ensure it covers exactly 30 days including today
            if counts_dict.get(thirty_days_ago + timedelta(days=i), 0) > 0
        ]
        return Response(data, status=status.HTTP_200_OK)


class NotClaimedVouchersView(ListAPIView):
    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        ten_weeks_ago = today - timedelta(days=70)  # 10 weeks back from today
        campaign_id = kwargs['campaign_id']

        # Fetch all vouchers within the last 5 weeks for the specific campaign that haven't been used
        vouchers = VoucherCard.objects.filter(
            campaign__id=campaign_id,
            is_used=False,
            date_created__date__range=(ten_weeks_ago, today)
        ).values('date_created__date')

        # Organize data by weeks
        week_counts = {}
        for voucher in vouchers:
            voucher_date = voucher['date_created__date']
            start_of_week = voucher_date - timedelta(days=voucher_date.weekday())  # Monday as the start of the week
            week_label = f"{start_of_week} - {start_of_week + timedelta(days=6)}"
            if week_label not in week_counts:
                week_counts[week_label] = 0
            week_counts[week_label] += 1

        # Create response data
        data = [{'label': week, 'number': week_counts.get(week, 0)} for week in
                sorted(week_counts.keys(), reverse=True)]

        return Response(data, status=status.HTTP_200_OK)


class CustomersPointsMoneyCountView(ListAPIView):
    serializer_class = CustomerUserSerializer

    def get(self, request, *args, **kwargs):
        campaign_id = self.kwargs['campaign_id']

        # campaign = Campaign.objects.get(id=campaign_id)
        # value_goal = campaign.value_goal

        # Get the counts for value_counted from 1 to 10
        counts = (
            CustomerUserProfile.objects
            .filter(collectors__campaign__id=campaign_id, collectors__is_collected=False)
            .values('collectors__value_counted')
            .annotate(count=Count('user_id', distinct=True))
            .order_by('collectors__value_counted')
        )

        # Convert the queryset to a list of dictionaries
        data = [
            {'label': entry['collectors__value_counted'], 'number': entry['count']}
            # for entry in counts if 1 <= entry['collectors__value_counted'] <= value_goal
            for entry in counts if entry['count'] > 0
        ]

        # Ensure that all labels from 0 to value_goal are represented in the data

        # labels_present = {entry['label'] for entry in data}
        # data.extend([
        #     {'label': i, 'number': 0} for i in range(10, int(value_goal), 10) if i not in labels_present
        # ])

        # Sort the data by label
        data.sort(key=lambda x: x['label'])

        return Response(data, status=status.HTTP_200_OK)

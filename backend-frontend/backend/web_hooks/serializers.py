from rest_framework import serializers

from web_hooks.models import RevenueCatEvent


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevenueCatEvent
        fields = '__all__'

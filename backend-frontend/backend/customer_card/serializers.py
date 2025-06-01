from rest_framework import serializers

from customer_card.models import CustomerCard, CardType


class CustomerCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerCard
        fields = ['card_type', 'thumbnail', 'serial_nr', 'qr_code']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['card_type'] = CardTypeSerializer(instance.card_type, many=False).data
        return representation


class CardTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardType
        fields = ['id', 'type']

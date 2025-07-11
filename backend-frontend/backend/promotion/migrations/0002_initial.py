# Generated by Django 5.0.3 on 2024-12-04 11:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('business_user_profile', '0002_initial'),
        ('customer_card', '0001_initial'),
        ('customer_user_profile', '0001_initial'),
        ('promotion', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='promotion',
            name='business_user_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='promotions', to='business_user_profile.businessuserprofile'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='card_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='promotions', to='customer_card.cardtype'),
        ),
        migrations.AddField(
            model_name='promotion',
            name='customer_user_profile',
            field=models.ManyToManyField(blank=True, related_name='promotions', to='customer_user_profile.customeruserprofile'),
        ),
    ]

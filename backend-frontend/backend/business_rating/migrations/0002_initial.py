# Generated by Django 5.0.3 on 2024-12-04 11:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('business_rating', '0001_initial'),
        ('business_user_profile', '0002_initial'),
        ('customer_user_profile', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessrating',
            name='business_user_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='customer_ratings', to='business_user_profile.businessuserprofile'),
        ),
        migrations.AddField(
            model_name='businessrating',
            name='customer_user_profile',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='business_ratings', to='customer_user_profile.customeruserprofile'),
        ),
    ]

from django.db import migrations


def create_business_categories(apps, schema_editor):
    business_category = apps.get_model('business_user_profile', 'BusinessCategory')
    business_category.objects.create(name='Food and Beverage')
    business_category.objects.create(name='Health and Wellness')
    business_category.objects.create(name='Fashion and Apparel')
    business_category.objects.create(name='Retail and E-commerce')
    business_category.objects.create(name='Entertainment and Leisure')
    business_category.objects.create(name='Personal Services')
    business_category.objects.create(name='Other')


class Migration(migrations.Migration):
    dependencies = [
        ('business_user_profile', '0002_initial'),
    ]

    operations = [
        migrations.RunPython(create_business_categories),
    ]

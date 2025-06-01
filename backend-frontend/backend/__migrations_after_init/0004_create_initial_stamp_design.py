from django.db import migrations


def create_stamp_designs(apps, schema_editor):
    stamp_design = apps.get_model('campaign', 'StampDesign')
    stamp_design.objects.create(name='Check')
    stamp_design.objects.create(name='Apple')
    stamp_design.objects.create(name='Beer')
    stamp_design.objects.create(name='Bowl')
    stamp_design.objects.create(name='Burger')
    stamp_design.objects.create(name='Coffee')
    stamp_design.objects.create(name='Hotdog')
    stamp_design.objects.create(name='Ice cream')
    stamp_design.objects.create(name='Pizza')
    stamp_design.objects.create(name='Smile')
    stamp_design.objects.create(name='Star')


class Migration(migrations.Migration):
    dependencies = [
        ('campaign', '0003_create_initial_collector_type'),
    ]

    operations = [
        migrations.RunPython(create_stamp_designs),
    ]

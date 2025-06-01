from django.db import migrations


def create_voucher_types(apps, schema_editor):
    VoucherType = apps.get_model('voucher_card', 'VoucherType')
    VoucherType.objects.create(type='Default')
    VoucherType.objects.create(type='Campaign')
    VoucherType.objects.create(type='Promotion')


class Migration(migrations.Migration):
    dependencies = [
        ('voucher_card', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_voucher_types),
    ]

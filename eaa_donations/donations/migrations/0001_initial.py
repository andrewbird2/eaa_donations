# Generated by Django 2.0.9 on 2018-10-05 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerCharity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug_id', models.CharField(max_length=30, unique=True)),
                ('name', models.TextField(unique=True, verbose_name='Name (human readable)')),
                ('email', models.EmailField(help_text='Used to cc the charity on receipts', max_length=254)),
                ('xero_account_name', models.TextField(help_text='Exact text of incoming donation account in xero')),
                ('active', models.BooleanField(default=True)),
                ('thumbnail', models.FileField(blank=True, null=True, upload_to='')),
                ('order', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'verbose_name_plural': 'Partner charities',
            },
        ),
    ]

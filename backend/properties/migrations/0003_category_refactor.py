from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0002_property_category_property_image_url'),
    ]

    operations = [
        # 1. Create the Category table
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id',   models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
            options={'verbose_name_plural': 'categories'},
        ),

        # 2. Remove the old CharField 'category' from Property
        migrations.RemoveField(
            model_name='property',
            name='category',
        ),

        # 3. Add the new ForeignKey 'category' pointing to Category
        migrations.AddField(
            model_name='property',
            name='category',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='properties',
                to='properties.category',
            ),
        ),
    ]

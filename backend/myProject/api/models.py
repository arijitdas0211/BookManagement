from django.db import models

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=50)
    release_year = models.IntegerField()

    class Meta:
        db_table = 'Book'   # Creating custom table name

    def __str__(self):
        return self.title


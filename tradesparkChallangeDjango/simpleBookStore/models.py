from django.db import models

class Author(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    categories = models.ManyToManyField(Category)
    publication_date = models.DateField(blank=True, null=True)
    ISBN = models.CharField(max_length=13, blank=True, null=True)

    def __str__(self):
        return self.title
    
    def remove_category(self, category_name):
        try:
            category = self.categories.get(name=category_name)
            if self.categories.count() > 1:
                self.categories.remove(category)
            else:
                raise ValueError("The book must have at least one category.")
        except Category.DoesNotExist:
            pass  


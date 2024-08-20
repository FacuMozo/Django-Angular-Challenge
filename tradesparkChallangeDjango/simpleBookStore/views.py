from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Author, Category, Book
from .serializers import AuthorSerializer, CategorySerializer, BookSerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    
    @action(detail=False, methods=['post'], url_path='remove-category')
    def remove_category(self, request):
        title = request.data.get('title')
        category_name = request.data.get('category')

        books = Book.objects.filter(title=title)
        warning_books = []

        # Verifica que exista un libro con el titulo 
        if not books.exists():
            return Response({'error': f'Error, no books found with the title "{title}".'}, status=status.HTTP_404_NOT_FOUND)

        # Verifica que la categoria exista
        try:
            category = Category.objects.get(name=category_name)
        except Category.DoesNotExist:
            return Response({'error': f'Error, the category "{category_name}" does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        for book in books:
            try:
                book.remove_category(category_name)
            except ValueError:
                warning_books.append(book)

        if warning_books:
            return Response({
                'warning': f'In certain books with the title "{title}", the category "{category_name}" could not be removed because this is the last category of the book and the field cannot be null.'
            }, status=status.HTTP_200_OK)

        return Response({'message': f'The category "{category_name}" was removed from books with the title "{title}".'}, status=status.HTTP_200_OK)

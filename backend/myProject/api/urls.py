from django.urls import path
from .views import get_books, create_book, book_detail

urlpatterns = [
    path('books/', get_books, name="get_books"),
    path('books/create_book/', create_book, name="create_book"),
    path('book/<int:pk>', book_detail, name="book_detail"),
]


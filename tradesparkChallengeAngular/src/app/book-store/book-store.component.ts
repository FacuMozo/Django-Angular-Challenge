import { Component, OnInit } from '@angular/core';
import { BookStoreService } from '../book-store.service';

@Component({
  selector: 'app-book-store',
  templateUrl: './book-store.component.html',
  styleUrls: ['./book-store.component.css']
})
export class BookStoreComponent implements OnInit {

  books: any[] = [];
  titleFilter: string = '';
  authorFilter: string = '';
  categoryFilter: string = '';
  editMode: boolean = false; // Controla la visualización del formulario
  errorMessage: string | null = null; // Mensaje de error para mostrar al usuario
  titleToRemove: string = ''; // Título a eliminar
  categoryToRemove: string = ''; // Categoría a eliminar

  constructor(private bookStoreService: BookStoreService) { }

  ngOnInit(): void {
    this.bookStoreService.getBooks().subscribe((data: any[]) => {
      this.books = data;
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.errorMessage = null;
    }
  }

  removeCategory(): void {
    this.errorMessage = null;
    this.bookStoreService.removeCategory(this.titleToRemove, this.categoryToRemove).subscribe(
      response => {
        this.errorMessage = null;
        //Controlamos si hay warns
        if (response.warning) {
          this.errorMessage = response.warning;
        }
        // Actualiza los libros después de la eliminación exitosa
        this.bookStoreService.getBooks().subscribe((data: any[]) => {
          this.books = data;
          this.titleToRemove = '';
          this.categoryToRemove = '';
        });
      },
      error => {
        this.errorMessage = error.error.error || `The category "${this.categoryToRemove}" could not be removed from books with the title "${this.titleToRemove}".`;
        
      }
    );
  }

  filteredBooks(): any[] {
    return this.books.filter(book => {
      return (
        book["title"].toLowerCase().includes(this.titleFilter.toLowerCase()) &&
        book["author"]["name"].toLowerCase().includes(this.authorFilter.toLowerCase()) &&
        this.categoriesToString(book['categories']).toLowerCase().includes(this.categoryFilter.toLowerCase())
      );
    });
  }

  categoriesToString(categories: any[]): string {
    return categories.map(category => category.name).join(', ');
  }
}

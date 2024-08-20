import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {

  private apiUrl = 'http://localhost:8000/bookStore'; 

  constructor(private client: HttpClient) { }

  getBooks() {
    return this.client.get(`${this.apiUrl}/books/`)
  }

  removeCategory(bookTitle: string, categoryName: string): Observable<any> {
    const url = `${this.apiUrl}/books/remove-category/`;
    return this.client.post(url, { title: bookTitle, category: categoryName }).pipe(
      catchError((error) => {
        // console.error('Error removing category:', error.error?.error || error.message);
        return throwError(error);
      })
    );
  }
}

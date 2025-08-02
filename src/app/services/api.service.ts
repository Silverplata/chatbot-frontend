import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post(`${this.apiUrl}/login`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      catchError(error => {
        toast.error('No se pudo conectar con el servidor. Inténtalo de nuevo.');
        return throwError(() => new Error(error.message));
      })
    );
  }

  chat(question: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/chat`, { question, max_tokens: 2000 }, { headers })
      .pipe(
        catchError(error => {
          toast.error('No se pudo obtener una respuesta. ¡Inténtalo otra vez!');
          return throwError(() => new Error(error.message));
        })
      );
  }
}
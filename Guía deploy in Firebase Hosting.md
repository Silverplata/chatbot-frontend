# Guía para Desplegar el Frontend Angular en Firebase Hosting

## Prerrequisitos
- Backend desplegado en Render (`https://chatbot-backend-zw4w.onrender.com`).
- Node.js y npm instalados.
- Cuenta en Firebase (https://console.firebase.google.com/).
- Firebase CLI instalada (`npm install -g firebase-tools`).

## Pasos

1. **Actualizar `api.service.ts`**:
   - Modifica `src/app/services/api.service.ts` para usar `environment.apiUrl`:
     ```typescript
     import { Injectable } from '@angular/core';
     import { HttpClient, HttpHeaders } from '@angular/common/http';
     import { Observable, throwError } from 'rxjs';
     import { catchError } from 'rxjs/operators';
     import { toast } from 'ngx-sonner';
     import { environment } from '../environments/environment';

     @Injectable({
       providedIn: 'root'
     })
     export class ApiService {
       private apiUrl = environment.apiUrl;

       constructor(private http: HttpClient) {}

       login(username: string, password: string): Observable<any> {
         const body = new URLSearchParams();
         body.set('username', username);
         body.set('password', password);

         return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), {
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

       getUserProfile(token: string): Observable<any> {
         const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
         return this.http.get(`${this.apiUrl}/user`, { headers })
           .pipe(
             catchError(error => {
               toast.error('No se pudo obtener el perfil de usuario. ¡Inténtalo otra vez!');
               return throwError(() => new Error(error.message));
             })
           );
       }

       updateUserPalette(palette: { primary_color: string, secondary_color: string, accent_color: string, background_color: string }, token: string): Observable<any> {
         const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
         return this.http.put(`${this.apiUrl}/user/palette`, palette, { headers })
           .pipe(
             catchError(error => {
               toast.error('No se pudo actualizar la paleta de colores. ¡Inténtalo otra vez!');
               return throwError(() => new Error(error.message));
             })
           );
       }
     }
     ```

2. **Construir el proyecto**:
   - Genera los archivos estáticos:
     ```bash
     cd E:\chatbot-frontend
     npm run build -- --configuration production
     ```

3. **Instalar Firebase CLI**:
   - Instala la CLI si no la tienes:
     ```bash
     npm install -g firebase-tools
     ```
   - Inicia sesión:
     ```bash
     firebase login
     ```

4. **Crear un proyecto en Firebase**:
   - Ve a https://console.firebase.google.com/ y crea un proyecto (`childbot-frontend`).
   - Copia el **Project ID** (por ejemplo, `childbot-frontend-1234`).

5. **Inicializar Firebase Hosting**:
   - En el directorio `chatbot-frontend`, ejecuta:
     ```bash
     firebase init hosting
     ```
   - Configura:
     - **Public directory**: `dist/chatbot-frontend/browser`
     - **Single-page app**: Yes
     - **Automatic builds with GitHub**: No
     - **Overwrite index.html**: No
   - Esto genera `firebase.json`:
     ```json
     {
       "hosting": {
         "public": "dist/chatbot-frontend/browser",
         "ignore": [
           "firebase.json",
           "**/.*",
           "**/node_modules/**"
         ],
         "rewrites": [
           {
             "source": "**",
             "destination": "/index.html"
           }
         ]
       }
     }
     ```

6. **Desplegar a Firebase**:
   - Ejecuta:
     ```bash
     firebase deploy --only hosting
     ```
   - Obtendrás una URL como `https://childbot-frontend-1234.web.app`.

7. **Actualizar CORS en el backend**:
   - En `chatbot-backend/config/settings.py`, añade las URLs de Firebase:
     ```python
     def configure_cors(app):
         app.add_middleware(
             CORSMiddleware,
             allow_origins=[
                 "http://localhost:4200",
                 "https://childbot-frontend-1234.web.app",
                 "https://childbot-frontend-1234.firebaseapp.com"
             ],
             allow_credentials=True,
             allow_methods=["*"],
             allow_headers=["*"],
         )
     ```
   - Sube los cambios al repositorio del backend:
     ```bash
     cd E:\chatbot-backend
     git add config/settings.py
     git commit -m "Actualizar CORS para Firebase"
     git push origin main
     ```

8. **Probar la integración**:
   - Visita `https://childbot-frontend-1234.web.app`.
   - Prueba:
     - **Login**: Inicia sesión con un usuario válido.
     - **Chat**: Envía una pregunta como `[general] ¿Qué es un volcán?`.
     - **Perfil**: Actualiza la paleta de colores en `/profile/appearance`.
   - Si hay errores, revisa los logs de la consola del navegador o de Render.

## Notas
- **CORS**: Asegúrate de que el backend permita solicitudes desde las URLs de Firebase.
- **Seguridad**: Verifica que las respuestas de GPT-3.5-turbo sean apropiadas para niños de 12 años.
- **Pruebas locales**: Prueba el frontend localmente con `npm run start` antes de desplegar.
- **Límites de Firebase**: El plan gratuito es suficiente para un proyecto educativo.
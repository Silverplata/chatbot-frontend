# Chatbot Frontend

## Descripción

El frontend del proyecto **Childbot** es una aplicación web construida con **Angular** que proporciona una interfaz de usuario para interactuar con el backend del chatbot. Permite a los usuarios iniciar sesión, enviar preguntas al chatbot y recibir respuestas generadas por la API de OpenAI, presentadas de manera clara y amigable para niños de 12 años.

### Características principales
- **Interfaz de usuario**: Diseño simple y accesible para niños, con formularios para autenticación y un chat interactivo.
- **Integración con el backend**: Se comunica con el backend en `http://localhost:8000` a través de un proxy configurado en Nginx.
- **Docker**: La aplicación se ejecuta en un contenedor con Nginx para servir los archivos estáticos.

## Requisitos

- **Node.js**: Versión 20
- **Angular CLI**: Versión compatible con tu proyecto Angular (por ejemplo, 18.x)
- **Docker**: (Opcional) Para ejecutar el frontend en un contenedor.
- **Dependencias**: Definidas en `package.json`.
- **Backend**: El backend debe estar ejecutándose en `http://localhost:8000`.

## Estructura del proyecto

```
chatbot-frontend/
├── Dockerfile           # Configuración para construir la imagen de Docker
├── nginx.conf          # Configuración de Nginx para servir la aplicación
├── package.json        # Dependencias y scripts de Node.js
├── src/               # Código fuente de la aplicación Angular
├── angular.json       # Configuración de Angular
└── README.md          # Este archivo
```

## Configuración

1. **Clonar el repositorio** (si no lo has hecho):
   ```bash
   git clone <url-del-repositorio>
   cd chatbot-frontend
   ```

2. **Instalar dependencias** (si desarrollas localmente):
   ```bash
   npm install
   ```

3. **Configurar el proxy**:
   Asegúrate de que el archivo `nginx.conf` esté configurado para redirigir las solicitudes `/api` al backend:
   ```nginx
   server {
       listen 4200;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;
       location / {
           try_files $uri $uri/ /index.html;
       }
       location /api {
           proxy_pass http://backend:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

4. **Configurar la carpeta de salida**:
   Verifica que el archivo `angular.json` tenga la carpeta de salida configurada como `dist/chatbot-frontend/browser` (o ajusta el `Dockerfile` si es diferente).

## Ejecución

### Opción 1: Localmente con Angular CLI
1. Instala Angular CLI si no lo tienes:
   ```bash
   npm install -g @angular/cli
   ```
2. Ejecuta el servidor de desarrollo:
   ```bash
   ng serve --host 0.0.0.0 --port 4200
   ```
3. Accede a la aplicación en `http://localhost:4200`.

### Opción 2: Con Docker
1. Asegúrate de que el archivo `docker-compose.yml` esté en el directorio raíz (`E:\childbot`) y que incluya el servicio `frontend`.
2. Construye y ejecuta el contenedor:
   ```bash
   cd E:\childbot
   docker-compose up --build
   ```
3. Accede a la aplicación en `http://localhost:4200`.

## Pruebas

1. **Acceder al frontend**:
   - Abre `http://localhost:4200` en un navegador.
   - Inicia sesión con las credenciales `username: student1` y `password: password123`.
   - Envía una pregunta al chatbot, como "Cuales son los ciclos lunares", y verifica que la respuesta sea completa.

2. **Verificar el proxy**:
   - Asegúrate de que las solicitudes a `/api` se redirijan correctamente al backend (`http://localhost:8000`).
   - Prueba el endpoint de login directamente:
     ```bash
     curl -X POST http://localhost:4200/api/login \
       -H "Content-Type: application/x-www-form-urlencoded" \
       -d "username=student1&password=password123"
     ```

## Notas
- Asegúrate de que el backend esté ejecutándose en `http://localhost:8000` antes de iniciar el frontend.
- Si las respuestas del chatbot se cortan, verifica que el parámetro `max_tokens` en las solicitudes al endpoint `/chat` sea suficiente (por ejemplo, 500).
- Para entornos de producción, considera configurar HTTPS y optimizar los archivos estáticos.

## Solución de problemas
- **Error `nginx: [emerg] "location" directive is not allowed here`**:
  - Asegúrate de que `nginx.conf` tenga un bloque `server` que contenga todas las directivas.
  - Verifica que el archivo se guarde con codificación UTF-8 sin BOM.
- **Logs**: Revisa los logs del contenedor con:
  ```bash
  docker-compose logs frontend
  ```
- **Carpeta de salida incorrecta**:
  - Confirma que la ruta en el `Dockerfile` (`COPY --from=build /app/dist/chatbot-frontend/browser /usr/share/nginx/html`) coincida con la carpeta de salida en `angular.json`.
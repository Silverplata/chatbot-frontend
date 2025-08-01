import { ApplicationConfig } from '@angular/core';
  import { provideRouter } from '@angular/router';
  import { provideHttpClient } from '@angular/common/http';
  import { provideAnimations } from '@angular/platform-browser/animations';
  import { LoginComponent } from './components/login/login.component';
  import { ChatComponent } from './components/chat/chat.component';

  export const appConfig: ApplicationConfig = {
    providers: [
      provideRouter([
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'chat', component: ChatComponent }
      ]),
      provideHttpClient(),
      provideAnimations()
    ]
  };
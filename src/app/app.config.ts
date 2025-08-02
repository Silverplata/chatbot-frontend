import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppearanceComponent } from './components/profile/appearance/appearance.component';
import { authGuard } from './guards/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'appearance', pathMatch: 'full' },
          { path: 'appearance', component: AppearanceComponent }
        ]
      },
      { path: '**', redirectTo: '/home' }
    ]),
    provideHttpClient(),
    provideAnimations()
  ]
};
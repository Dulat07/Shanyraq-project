import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { LoginComponent } from './components/login/login.component';
import { PostFormComponent } from './components/post/post.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'property-details/:id', component: PropertyDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'post', component: PostFormComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

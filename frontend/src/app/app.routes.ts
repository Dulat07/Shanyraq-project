import { Routes } from '@angular/router';
import { HomeComponent }           from './components/home/home.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { LoginComponent }           from './components/login/login.component';
import { PostFormComponent }        from './components/post/post.component';
import { FavoritesPageComponent }   from './components/favorites-page/favorites-page.component';
import { ListingDetailsComponent }  from './components/listing-details/listing-details.component';
import { AccountPageComponent }     from './components/account/account-page.component';
import { MyListingsComponent }      from './components/account/tabs/my-listings.component';
import { AccountFavoritesComponent } from './components/account/tabs/favorites.component';
import { AccountRecentComponent }   from './components/account/tabs/recent.component';
import { SettingsComponent }        from './components/account/tabs/settings.component';

export const routes: Routes = [
  { path: '',        redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',    component: HomeComponent },

  // ── Property routes ────────────────────────────────────────
  { path: 'listing/:id',             component: ListingDetailsComponent },
  { path: 'property-details/:id',    component: PropertyDetailsComponent },

  // ── Auth ───────────────────────────────────────────────────────────
  { path: 'login',   component: LoginComponent },
  { path: 'post',    component: PostFormComponent },

  // ── Account (nested) ───────────────────────────────────────────────
  {
    path: 'account',
    component: AccountPageComponent,
    children: [
      { path: '',          component: MyListingsComponent },
      { path: 'favorites', component: AccountFavoritesComponent },
      { path: 'recent',    component: AccountRecentComponent },
      { path: 'settings',  component: SettingsComponent },
    ],
  },

  { path: 'favorites', component: FavoritesPageComponent },
];
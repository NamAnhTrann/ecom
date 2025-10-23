import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { SellerDashboard } from './seller-dashboard/seller-dashboard';
import { authGuard } from './guards/auth-guard';
import { ForgetPassword } from './forget-password/forget-password';
import { AuthCallbackComponent } from './auth-callback.component';
import { ContactUs } from './contact-us/contact-us';

export const routes: Routes = [
    {path: "", component:Homepage},
    {path: "contact-us", component:ContactUs},
    {path: "login", component:Login},
    {path: "signup", component:Signup},
    {path: 'seller-dashboard', component: SellerDashboard, data: { roles: ['seller'] }, canActivate: [authGuard]},
    {path: "forget-password", component: ForgetPassword},
    {path: 'auth/callback', component: AuthCallbackComponent },

];

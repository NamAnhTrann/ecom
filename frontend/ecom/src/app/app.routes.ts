import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { SellerDashboard } from './seller-dashboard/seller-dashboard';
import { authGuard } from './guards/auth-guard';
import { ForgetPassword } from './forget-password/forget-password';

export const routes: Routes = [
    {path: "", component:Homepage},
    {path:"login", component:Login},
    {path:"signup", component:Signup},
    {path: 'seller-dashboard', component: SellerDashboard, data: { roles: ['seller'] }, canActivate: [authGuard]},
    {path: "forget-password", component: ForgetPassword}
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sidenav } from './sidenav/sidenav';
import { Home } from './home/home';
import { Restaurant } from './restaurant/restaurant';
import { Agent } from './agent/agent';
import { Oil } from './oil/oil';
import { Hubs } from './hubs/hubs';
import { AgentTable } from './agent-table/agent-table';
import { Login } from './login/login';
import { AuthGuard } from './auth.guard';
import { NearestOrderComponent } from './nearest-order/nearest-order';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';


const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'adminlogin', component: AdminLogin },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',

    children: [
      { path: 'home', component: Home },
      { path: 'restaurant', component: Restaurant },
      { path: 'agent', component: Agent },
      { path: 'oil', component: Oil },
      { path: 'nearest-order', component: NearestOrderComponent },
      { path: 'admin-dashboard', component: AdminDashboard },
      { path: 'hubs', component: Hubs },
      { path: 'agentTable', component: AgentTable }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

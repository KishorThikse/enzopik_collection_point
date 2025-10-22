import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Sidenav } from './sidenav/sidenav';
import { Home } from './home/home';
import { Restaurant } from './restaurant/restaurant';
import { Agent } from './agent/agent';
import { Oil } from './oil/oil';
import { Hubs } from './hubs/hubs';

const routes: Routes = [

{ path: '', redirectTo: 'home', pathMatch: 'full' }, 
{ path: 'home', component: Home },
{path:'restaurant',component:Restaurant},
{path:'agent',component:Agent},
{path:'oil',component:Oil},
{path:'hubs',component:Hubs}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

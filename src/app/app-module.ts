import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Sidenav } from './sidenav/sidenav';
import { AdminSidenav } from './sidenav/admin-sidenav';
import { Home } from './home/home';
import { CommonModule } from '@angular/common';
import { Restaurant } from './restaurant/restaurant';
import { Agent } from './agent/agent';
import { Oil } from './oil/oil';
import { Hubs } from './hubs/hubs';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AgentTable } from './agent-table/agent-table';
import { FeedbackModal } from './feedback-modal/feedback-modal';
import { Login } from './login/login';
import { NearestOrderComponent } from './nearest-order/nearest-order';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';



@NgModule({
  declarations: [
    App,
    Sidenav,
    AdminSidenav,
    Home,
    Restaurant,
    Agent,
    Oil,
    Hubs,
    AgentTable,
    FeedbackModal,
    Login,
    NearestOrderComponent,
    AdminLogin,
    AdminDashboard
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }

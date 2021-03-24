import { NgModule } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CandyComponent } from './candy/candy.component';

const routes: Routes = [
  { path: '', redirectTo: 'mytab', pathMatch: 'full'  },
  { path: 'mytab', component: TabComponent},
  { path: 'candy', component: CandyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { SqlLibraryComponent } from './sql-library/sql-library.component';
import { SqlQueryEditorComponent } from './sql-query-editor/sql-query-editor.component';
import { TablesAndViewsComponent } from './tables-and-views/tables-and-views.component';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path:'', redirectTo:'/home', pathMatch:'full' },
  { path: 'home', component: SqlQueryEditorComponent },
  { path: 'sql-library', component: SqlLibraryComponent },
  { path: 'tables-and-views', component: TablesAndViewsComponent },
  { path: 'about', component: AboutComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

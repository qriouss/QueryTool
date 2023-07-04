import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule
} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatIconModule
} from '@angular/material/icon';
import {
  MatListModule
} from '@angular/material/list';
import {
  MatSidenavModule
} from '@angular/material/sidenav';
import {
  MatToolbarModule
} from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './about/about.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { KeysPipe } from './keys.pipe';
import { LoginComponent } from './login/login.component';
import { ExcelService } from './services/excel.service';
import { SideNavComponent } from './side-nav/side-nav.component';
import { SqlLibraryComponent } from './sql-library/sql-library.component';
import { SqlQueryEditorComponent } from './sql-query-editor/sql-query-editor.component';
import { TablesAndViewsComponent } from './tables-and-views/tables-and-views.component';
import { SharedService } from './shared.service';
import { TextInputHighlightModule } from 'angular-text-input-highlight';
import { TextareaHighlightComponent } from './textarea-highlight/textarea-highlight.component';

@NgModule({
  declarations: [
    AppComponent,
    SqlQueryEditorComponent,
    DialogBodyComponent,
    KeysPipe,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SideNavComponent,
    SqlLibraryComponent,
    AboutComponent,
    TablesAndViewsComponent,
    TextareaHighlightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    TextInputHighlightModule
  ],
  providers: [ExcelService, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }

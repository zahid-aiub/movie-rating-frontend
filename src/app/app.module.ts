import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ActivationOtfComponent} from './activation-otf/activation-otf.component';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {HttpClientModule} from "@angular/common/http";
import {NgxPaginationModule} from "ngx-pagination";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {FieldErrorDisplayComponent} from './field-error-display/field-error-display.component';
import {CalendarModule} from "primeng/calendar";
import {DatePipe} from "@angular/common";
import {DropdownModule} from 'primeng/dropdown';
import {RadioButtonModule} from "primeng/radiobutton";
import {ActivationOtfListComponent} from './activation-otf-list/activation-otf-list.component';
import {TableModule} from "primeng/table";
import {PaginatorModule} from "primeng/paginator";
import {ToastModule} from 'primeng/toast';
import {MessageService, ConfirmationService} from "primeng/api";
import { TabViewModule } from 'primeng/tabview';
import {CheckboxModule} from 'primeng/checkbox';
import { ReportComponent } from './report/report.component';
import { ModalModule } from 'ngb-modal';
import { ConfirmPopupModule } from "primeng/confirmpopup";
import {MultiSelectModule} from 'primeng/multiselect';import { CommissionStructureComponent } from './commission-structure/commission-structure.component';
import { FilmComponent } from './film/film.component';
import { GenreComponent } from './genre/genre.component';
import { PersonComponent } from './person/person.component';


@NgModule({
    declarations: [
        AppComponent,
        ActivationOtfComponent,
        AppComponent,
        PageNotFoundComponent,
        FieldErrorDisplayComponent,
        ActivationOtfListComponent,
        ReportComponent,
        CommissionStructureComponent,
        FilmComponent,
        GenreComponent,
        PersonComponent

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ModalModule,
        // NgbModule,
        NgxPaginationModule,
        ButtonModule,
        RippleModule,
        ReactiveFormsModule,
        CalendarModule,
        RadioButtonModule,
        DropdownModule,
        PaginatorModule,
        TableModule,
        ToastModule,
        TabViewModule,
        CheckboxModule,
        MultiSelectModule,
        ConfirmPopupModule
    ],
    providers: [DatePipe, MessageService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

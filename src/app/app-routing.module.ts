import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActivationOtfComponent} from "./activation-otf/activation-otf.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {ActivationOtfListComponent} from "./activation-otf-list/activation-otf-list.component";
import {ReportComponent} from "./report/report.component";
import {FilmComponent} from "./film/film.component";
import {PersonComponent} from "./person/person.component";
import {GenreComponent} from "./genre/genre.component";

const routes: Routes = [
  { path: '', component: FilmComponent},
  { path: 'person', component: PersonComponent},
  { path: 'genre', component: GenreComponent},
  { path: 'add', component: ActivationOtfComponent},
  // { path: 'activation-otf/:id', component: UserDetailsComponent},
  { path: 'report', component: ReportComponent},
  { path: '**', component: PageNotFoundComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

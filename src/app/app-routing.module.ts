import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {FilmComponent} from "./film/film.component";
import {PersonComponent} from "./person/person.component";
import {GenreComponent} from "./genre/genre.component";
import {FilmDetailsComponent} from "./film-details/film-details.component";
import {PersonDetailsComponent} from "./person-details/person-details.component";

const routes: Routes = [
    {path: '', component: FilmComponent},
    {path: 'films/:id', component: FilmDetailsComponent},
    {path: 'person', component: PersonComponent},
    {path: 'person/details/:id', component: PersonDetailsComponent},
    {path: 'genre', component: GenreComponent},
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

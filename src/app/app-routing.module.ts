import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {FilmComponent} from "./film/film.component";
import {PersonComponent} from "./person/person.component";
import {GenreComponent} from "./genre/genre.component";
import {FilmDetailsComponent} from "./film-details/film-details.component";
import {PersonDetailsComponent} from "./person-details/person-details.component";
import {UserComponent} from "./user/user.component";
import {SuggestionComponent} from "./suggestion/suggestion.component";
import {GenreDetailsComponent} from "./genre-details/genre-details.component";
import {LoginComponent} from "./login/login.component";
import {FileComponent} from "./file/file.component";
import {AdminComponent} from "./admin/admin.component";

const routes: Routes = [
    {path: '', component: FilmComponent},
    {path: 'login', component: LoginComponent},
    {path: 'file', component: FileComponent},
    {path: 'admin', component: AdminComponent},

    {path: 'films/:id', component: FilmDetailsComponent},
    {path: 'person', component: PersonComponent},
    {path: 'person/details/:id', component: PersonDetailsComponent},
    {path: 'genre', component: GenreComponent},
    {path: 'genres/:id', component: GenreDetailsComponent},
    {path: 'user', component: UserComponent},
    {path: 'suggestion', component: SuggestionComponent},
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

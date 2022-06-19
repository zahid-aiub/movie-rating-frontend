import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {LoginComponent} from "./login/login.component";
import {FileComponent} from "./file/file.component";
import {AdminComponent} from "./admin/admin.component";
import {PubFilesComponent} from "./pub-files/pub-files.component";
import {RegisterComponent} from "./register/register.component";

const routes: Routes = [
    {path: '', component: PubFilesComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: RegisterComponent},
    {path: 'file', component: FileComponent},
    {path: 'admin', component: AdminComponent},
    {path: '**', component: PageNotFoundComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

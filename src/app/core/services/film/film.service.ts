import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class FilmService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    getAllFilms(): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'films').pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getFilmsDetails(id: any): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'films/' + id).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getAllSubFilms(id: any): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'films/' + id + '/sub-films').pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getFilmRating(id: any, isSubFilm: boolean): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'films/' + id + '/rating', {params: {isSubFilm: isSubFilm}}).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getFilmPersonList(id: any, isSubFilm: boolean): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'persons/by-film/' + id, {params: {isSubFilm: isSubFilm}}).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getFilmGenreList(id: any, isSubFilm: boolean): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'genres/by-film/' + id, {params: {isSubFilm: isSubFilm}}).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

}

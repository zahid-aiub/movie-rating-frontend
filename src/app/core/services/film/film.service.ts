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

}

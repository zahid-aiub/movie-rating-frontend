import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";


const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    getAllPersons(): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'persons').pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }
}

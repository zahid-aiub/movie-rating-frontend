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
export class LoginService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    login(data: any) {

    }
}
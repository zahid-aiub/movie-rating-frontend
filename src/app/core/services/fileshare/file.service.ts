import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    getAllFiles(token: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        const requestOptions = { headers: headers };
        return this.httpClient.get<any>(API_URL + 'file/all', requestOptions).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    uploadFiles(files: any) {

    }
}
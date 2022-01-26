import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {Observable} from "rxjs";
import {ActivationOTF, ApiResponse, PaginatedData} from "../../interfaces";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ActivationOtfService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }


    submitActivationOTF(payload: FormData): any {
        this.httpClient
            .post<any>(API_URL + 'activation-otf',
                payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getAllActivationOTFPage(pageNo?: number, size?: number, search?: string): Observable<any> {
        const params: any = {};
        if (pageNo) params['page'] = pageNo;
        if (pageNo) params['size'] = size;
        if (search) params['search'] = search;
        return this.httpClient.get<any>(API_URL + 'activation-otf', {params: params}).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getAllActivationOTF(): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'activation-otf').pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getSetupFormDetails(): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'setup-form/details').pipe(
            map((data: any) => {
                console.log(data)
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getActivationOtfDetailsById(id: number): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'activation-otf/'+ id + '/fat').pipe(
            map((data: any) => {
                console.log(data)
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getAreaListByRegion(regions: any): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'setup-form/areas', {params: regions}).pipe(
            map((data: any) => {
                console.log(data)
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getDistributorListByArea(areas: any): Observable<any> {
        return this.httpClient.get<any>(API_URL + 'setup-form/distributors', {params: areas}).pipe(
            map((data: any) => {
                console.log(data)
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getMaterialList(productTypes: any, simBrand: string, simType: string): Observable<any> {
        const params: any = {};
        params['productTypes'] = productTypes;
        params['simBrand'] = simBrand;
        params['simType'] = simType;
        return this.httpClient.get<any>(API_URL + 'setup-form/materials', {params: params}).pipe(
            map((data: any) => {
                console.log(data)
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getActivationOTFById(id: number): Observable<ApiResponse<ActivationOTF>> {
        return this.httpClient.get<ApiResponse<ActivationOTF>>(API_URL + 'activation-otf/' + id).pipe(
            map((data: ApiResponse<ActivationOTF>) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }


}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../error-handler.service";
import {Observable} from "rxjs";
import {ApiResponse, PaginatedData, Report} from "../../interfaces";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    constructor(
        private httpClient: HttpClient,
        private errorHandlerService: ErrorHandlerService
    ) {
    }

    getAllReports(pageNo?: number, size?: number, search?: string): Observable<any> {
        const params: any = {};
        if (pageNo) params['page'] = pageNo;
        if (pageNo) params['size'] = size;
        if (search) params['search'] = search;
        return this.httpClient.get<any>(API_URL + 'disbursement-report/activation-otf', {params: params}).pipe(
            map((data: any) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }

    getReportById(id: number): Observable<ApiResponse<Report>> {
        return this.httpClient.get<ApiResponse<Report>>(API_URL + 'reports/' + id).pipe(
            map((data: ApiResponse<Report>) => {
                return data;
            }), catchError(this.errorHandlerService.handleError));
    }


}

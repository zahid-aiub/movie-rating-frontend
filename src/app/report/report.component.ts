import {Component, OnInit} from '@angular/core';
import {Report} from "../core/interfaces";
import {ReportService} from "../core/services/report/report.service";
import {Router} from "@angular/router";
import {PrimeNGConfig} from "primeng/api";

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

    searchString: any;
    pageNo: number = 1;
    pageSize: number = 10;
    totalRecords: number = 0;
    reports: Report[] = [];

    cols: any;

    constructor(
        private router: Router,
        private primengConfig: PrimeNGConfig,
        private readonly reportService: ReportService
    ) {
    }

    ngOnInit(): void {
        this.cols = [
            {field: 'channelPartner', header: 'Channel Partner'},
            {field: 'commissionAmount', header: 'Commission Amount'},
            {field: 'elStatus', header: 'EL Status'},
            {field: 'materialCode', header: 'Material Code'},
            {field: 'msisdn', header: 'Msisdn'},
            {field: 'paymentType', header: 'Payment Type'},
            {field: 'eventTime', header: 'Event Time'},
            {field: 'simCommissionType', header: 'Sim Commission Type'},
            {field: 'receiverMsisdn', header: 'Receiver Msisdn'},
            {field: 'channelPartner', header: 'Channel Partner'},
            {field: 'subscriberNid', header: 'Subscriber Nid'},
            {field: 'elTxnId', header: 'ElTxnId'},
            {field: 'time', header: 'Time'},
        ];
        this.getAllReports(this.pageNo, this.pageSize);
    }

    getAllReports(pageNo: any, size: any, searchText?: string) {
        console.log("Current Page.....: ", pageNo);
        this.reportService.getAllReports(pageNo, size, searchText).subscribe((data) => {
            this.reports = data.data;
            this.totalRecords = data.pageInfo.totalElements;
            this.pageNo = data.pageInfo.currentPage;
            console.log("Current Page: ", data.pageInfo.currentPage);
            // console.log(this.pageNo, this.pageSize, this.totalRecords);
        });
    }

    paginate(event: any) {
        console.log('first', event);
        this.pageNo = event.page + 1;
        this.pageSize = event.rows;
        console.log(this.pageNo)
        this.getAllReports(event.page + 1, this.pageSize);
    }

}

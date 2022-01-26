import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivationOtfService} from "../core/services/activation-otf/activation-otf.service";
import {ActivationOTF} from "../core/interfaces";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {Router} from "@angular/router";
import {ModalManager} from "ngb-modal";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-activation-otf-list',
    templateUrl: './activation-otf-list.component.html',
    styleUrls: ['./activation-otf-list.component.css']
})
export class ActivationOtfListComponent implements OnInit {

    searchString: any;
    pageNo: number = 1;
    pageSize: number = 10;
    totalRecords: number = 0;
    activationOTFS: ActivationOTF[] = [];

    headers = ["ID", "Name", "Status", "Activation Start Date", "Activation End Date", "Brand"];

    cols: any;
    data: any;

    @ViewChild('myModal') myModal: any;
    private modalRef: any;
    selectedOtfId: any;

    constructor(
        private router: Router,
        private http: HttpClient,
        private modalService: ModalManager,
        private primengConfig: PrimeNGConfig,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private readonly activationOtfService: ActivationOtfService
    ) {
    }

    setSession(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getSession(key: string): any {
        if (typeof window !== 'undefined') {
            let retrievedObject = localStorage.getItem(key) as any;
            return retrievedObject;
        }
    }

    clearSession(): void {
        localStorage.clear();
    }

    ngOnInit(): void {
        let session = this.getSession('isOtfCreated');
        if (session) {
            setTimeout(() => {
                this.messageService.add({
                    severity: "success",
                    summary: "Success",
                    detail: "OTF created successfully!"
                });
            })
        }
        this.clearSession();
        this.primengConfig.ripple = true;
        this.getAllActivationOTFPage(this.pageNo, this.pageSize);
        this.cols = [
            {field: 'id', header: 'Id'},
            {field: 'status', header: 'Status'},
            {field: 'description', header: 'Name'},
            {field: 'activationStartDate', header: 'Activation Start Date'},
            {field: 'activationEndDate', header: 'Activation End Date'},
            {field: 'brand', header: 'Brand'},
            // {field: 'action', header: 'Action'}
        ];
    }

    getAllActivationOTFPage(pageNo: any, size: any, searchText?: string) {
        this.activationOtfService.getAllActivationOTFPage(pageNo, size, searchText).subscribe((data) => {
            console.log(data);
            this.activationOTFS = data.data;
            this.totalRecords = data.pageInfo.totalElements;
            this.pageNo = data.pageInfo.currentPage;
            this.pageNo = pageNo;
        });
    }

    /*getAllActivationOTF() {
        this.activationOtfService.getAllActivationOTF().subscribe((data) => {
            console.log(data.data);
            this.activationOTFS = data.data;
        });
    }*/

    paginate(event: any) {
        this.pageNo = event.page + 1;
        this.pageSize = event.rows;
        console.log(this.pageNo)
        this.getAllActivationOTFPage(event.page + 1, this.pageSize);
    }

    addNewOtf() {
        let data: any = {};
        data['otfId'] = null;
        data['action'] = 'new';
        this.setSession('sessionData', data);
        this.router.navigate(['/add']);
    }

    otfDetails() {
        if (this.selectedOtfId) {
            let data: any = {};
            data['otfId'] = this.selectedOtfId;
            data['action'] = 'details';
            this.setSession('sessionData', data);
            this.router.navigate(['/add']);
        }
    }

    otfDetailsFromName(id: number) {
        let data: any = {};
        data['otfId'] = id;
        data['action'] = 'details';
        this.setSession('sessionData', data);
        this.router.navigate(['/add']);
    }

    selectedOtf(event: any, id: any) {
        if (event.target.checked === true) {
            this.selectedOtfId = id;
        } else {
            this.selectedOtfId = null;
        }
    }

    copyOtf() {
        if (this.selectedOtfId) {
            let data: any = {};
            data['otfId'] = this.selectedOtfId;
            data['action'] = 'copy';
            this.setSession('sessionData', data);
            this.router.navigate(['/add']);
        }
    }

    delete() {
        console.log("Should be delete");
    }

    reject() {
        console.log("Should be Reject");
    }

    confirmApprove(event: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: "Are you sure that you want to proceed?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                if (this.selectedOtfId) {
                    const data: any = this.activationOTFS.find((item: any) => item.id == this.selectedOtfId);
                    // todo: use enum
                    if (data.status.toUpperCase() == 'NEW') {
                        this.http.put<any>(API_URL + 'activation-otf/' + this.selectedOtfId + '/approve', null).subscribe(data => {
                            console.log(data);
                            this.selectedOtfId = null;
                            this.getAllActivationOTFPage(this.pageNo, this.pageSize);
                            this.messageService.add({
                                severity: "success",
                                summary: "Confirmed",
                                detail: "OTF Approved"
                            });
                        });
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Not Approved",
                            detail: "OTF is not in NEW status"
                        });
                    }
                }
            },
            reject: () => {
            }
        });
    }

    confirmReject(event: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: "Are you sure that you want to proceed?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                if (this.selectedOtfId) {
                    const data: any = this.activationOTFS.find((item: any) => item.id == this.selectedOtfId);
                    // todo: use enum
                    if (data.status.toUpperCase() == 'NEW') {
                        this.http.put<any>(API_URL + 'activation-otf/' + this.selectedOtfId + '/reject', null).subscribe(data => {
                            console.log(data);
                            this.selectedOtfId = null;
                            this.getAllActivationOTFPage(this.pageNo, this.pageSize);
                            this.messageService.add({
                                severity: "success",
                                summary: "Confirmed",
                                detail: "OTF Rejected"
                            });
                        });
                    } else {
                        this.messageService.add({
                            severity: "error",
                            summary: "Not Rejected",
                            detail: "OTF is not in NEW status"
                        });
                    }
                }
            },
            reject: () => {
            }
        });
    }

    confirmDelete(event: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: "Are you sure that you want to delete?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                if (this.selectedOtfId) {
                    // todo: check status of the otf (NEW, APPROVED, REJECTED)
                    this.http.delete<any>(API_URL + 'activation-otf/' + this.selectedOtfId + '/delete').subscribe(data => {
                        this.selectedOtfId = null;
                        this.getAllActivationOTFPage(this.pageNo, this.pageSize);
                        this.messageService.add({
                            severity: "error",
                            summary: "Confirmed",
                            detail: "OTF Deleted"
                        });
                    });
                }
            },
            reject: () => {
            }
        });
    }

}

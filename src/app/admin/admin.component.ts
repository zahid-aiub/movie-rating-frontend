import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "primeng/api";
import {FileService} from "../core/services/fileshare/file.service";
import {environment} from "../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    username: any;
    token: any;
    files: any;

    constructor(
        private router: Router,
        private fileService: FileService,
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.checkSession();
        this.getAllPendingApprovalFiles();
    }

    checkSession() {
        let sessionVal: any = JSON.parse(localStorage.getItem('userInfo') + '');
        console.log(sessionVal);
        if (!sessionVal || sessionVal.user.roles != 'admin') {
            this.router.navigateByUrl('/login');
        }
        this.username = sessionVal.user.username;
        this.token = sessionVal.access_token;
    }

    handleLogOut() {
        localStorage.clear();
        this.router.navigateByUrl('/login');
    }

    getAllPendingApprovalFiles() {
        this.fileService.getAllPendingApprovalFiles(this.token).subscribe((data) => {
            this.files = data;
        });
    }

    handleApproveOrReject(id: any, approvalStatus: any) {
        const data = {
            'fileId': id,
            'approvalReq': approvalStatus
        }
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        });

        const requestOptions = {headers: headers};
        this.httpClient.put<any>(API_URL + 'file/approval-resolve', data, requestOptions).subscribe(data => {
            this.messageService.add({
                key: 'toast-key', severity: 'success', summary: 'Successful',
                detail: 'Approval request Resolved!'
            });
            this.getAllPendingApprovalFiles();
        });
    }

}

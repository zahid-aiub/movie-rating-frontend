import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "primeng/api";
import {FileService} from "../core/services/fileshare/file.service";
import {environment} from "../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.css']
})
export class FileComponent implements OnInit {

    uploadedFiles: any[] = [];
    username: any;
    files: any;
    token: any;

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
        this.getAllFiles();
    }

    checkSession() {
        let sessionVal: any = JSON.parse(localStorage.getItem('userInfo') + '');
        console.log(sessionVal);
        if (!sessionVal || sessionVal.user.roles != 'user') {
            this.router.navigateByUrl('/login');
        }
        this.username = sessionVal.user.username;
        this.token = sessionVal.access_token;
    }

    getAllFiles() {
        this.fileService.getAllFiles(this.token).subscribe((data) => {
            console.log(data);
            this.files = data;
        });
    }

    onFileChange(event: any) {
        for (let i = 0; i < event.target.files.length; i++) {
            this.uploadedFiles.push(event.target.files[i]);
        }
        console.log(this.uploadedFiles);
    }

    handleFileUpload() {
        if (this.uploadedFiles.length > 0) {
            for (let i = 0; i < this.uploadedFiles.length; i++) {
                this.uploadFiles(this.uploadedFiles[i]);
            }
        }
    }

    uploadFiles(file: any) {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${this.token}`
        });

        const requestOptions = {headers: headers};
        const formData = new FormData();
        formData.append('file', file);

        this.httpClient.post<any>(API_URL + 'file/upload', formData, requestOptions).subscribe(data => {
            this.getAllFiles();
            this.messageService.add({
                key: 'toast-key', severity: 'success', summary: 'Successful',
                detail: 'File Uploaded successfully!'
            });
        });

    }

    /* onUpload(event: any) {
         console.log('***********************************')
         for(let file of event.files) {
             this.uploadedFiles.push(file);
         }
         console.log(this.files);
         this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
     }*/

    openModal(id: any) {

    }

    download($event: MouseEvent, id: any) {

    }

    handleLogOut() {
        localStorage.clear();
        this.router.navigateByUrl('/login');
    }

}

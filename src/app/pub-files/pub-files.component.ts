import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FileService} from "../core/services/fileshare/file.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "primeng/api";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-pub-files',
    templateUrl: './pub-files.component.html',
    styleUrls: ['./pub-files.component.css']
})
export class PubFilesComponent implements OnInit {

    uploadedFiles: any[] = [];
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
        this.getAllFiles();
    }


    getAllFiles() {
        this.fileService.getAllFiles().subscribe((data) => {
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
        const formData = new FormData();
        formData.append('file', file);

        this.httpClient.post<any>(API_URL + 'file/public/upload', formData).subscribe(data => {
            this.getAllFiles();
            this.messageService.add({
                key: 'toast-key', severity: 'success', summary: 'Successful',
                detail: 'File Uploaded successfully!'
            });
        });

    }

    unblockRequest(id: any) {
        const file = this.files.filter((obj: any) => {
            return obj.id === id;
        });
        console.log(file);
        if (file[0]?.approvalRequest == 'requestForUnblock') {
            this.messageService.add({
                key: 'toast-key', severity: 'warn', summary: 'Failed',
                detail: 'Unblock request already created!'
            });
            return;
        }

        this.httpClient.put<any>(API_URL + 'file/pub/request-for-unblock/' + id, null).subscribe(data => {
            this.messageService.add({
                key: 'toast-key', severity: 'success', summary: 'Successful',
                detail: 'Unblock request created!'
            });
            this.getAllFiles();
        });
    }

    async download(id: any) {
        this.fileService.downloadFile(id).subscribe((response: any) => {
            console.log(response)
            let blob: any = new Blob([response], {type: response.type});
            const url = window.URL.createObjectURL(blob);
            window.open(url);
        }), (error: any) => console.log('Error downloading the file'),
            () => console.info('File downloaded successfully');

    }


    handleSignIn() {
        this.router.navigateByUrl('/login');
    }
}

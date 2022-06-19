import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {environment} from "../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    username: any;
    password: any;
    form: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            fullName: [null, Validators.required],
            username: [null, Validators.required],
            password: [null, Validators.required],

        });
    }

    async handleSignUp() {
        if (this.form.valid) {
            const data: any = {};
            data.fullName = this.form.get('fullName').value;
            data.username = this.form.get('username').value;
            data.password = this.form.get('password').value;

            this.httpClient.post<any>(API_URL + 'user/add', data).subscribe(data => {

                if (data?.statusCode == 201) {
                    this.router.navigateByUrl('/login')
                } else {
                    this.messageService.add({
                        key: 'toast-key', severity: 'error', summary: 'Failed',
                        detail: 'Server Error'
                    });
                }

            });
        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'warn', summary: 'Failed',
                detail: 'Invalid Form'
            });
        }
    }

    isFieldValid(field: string) {
        return !this.form.get(field).valid && this.form.get(field).touched;
    }

    displayFieldCss(field: string) {
        return {
            'has-error': this.isFieldValid(field),
            'has-feedback': this.isFieldValid(field)
        };
    }

    handleCancel() {
        this.router.navigateByUrl('/login');
    }
}

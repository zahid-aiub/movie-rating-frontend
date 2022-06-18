import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

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
            username: [null, Validators.required],
            password: [null, Validators.required],

        });
    }

    async handleLogin() {
        if (this.form.valid) {
            const data: any = {};
            data.username = this.form.get('username').value;
            data.password = this.form.get('password').value;
            data.grantType = 'password';
            this.httpClient.post<any>(API_URL + 'auth/login', data).subscribe(data => {

                this.setSession('sessionVal', data.user.username);
                this.setSession('authToken', data.access_token);
                if (data?.statusCode == 200 && data?.user.roles == 'user') {
                    this.router.navigateByUrl('/file')
                }
                else {
                    this.router.navigateByUrl('/admin')
                }

            });
        }
        else {
            this.messageService.add({
                key: 'toast-key', severity: 'warn', summary: 'Failed',
                detail: 'Invalid Form'
            });
        }
    }

    setSession(key: string, value: string): void {
        localStorage.setItem(key, value);
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
    
}

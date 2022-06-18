import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

    username: any;
    token: any;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
    ) {
    }

    ngOnInit(): void {
        this.checkSession('sessionVal', 'authToken');
    }

    checkSession(usernameKey: string, authTokenKey: string) {
        let usernameSession: any = localStorage.getItem(usernameKey);
        let authSession: any = localStorage.getItem(authTokenKey);
        if (!usernameSession) {
            this.router.navigateByUrl('/login');
        }
        console.log(usernameSession);
        this.username = usernameSession;
        this.token = authSession;
    }

}

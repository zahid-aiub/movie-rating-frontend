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
        this.checkSession();
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

}

import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalManager} from "ngb-modal";
import {DatePipe} from "@angular/common";
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";
import {PersonService} from "../core/services/person/person.service";
import {ErrorHandlerService} from "../core/services/error-handler.service";
import {environment} from "../../environments/environment";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-person',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

    @ViewChild('personModal') myModal: any;
    private modalRef: any;

    selectedSex: any = null;
    genders: any[] = [{name: 'Male', key: 'M'}, {name: 'Female', key: 'F'}, {name: 'Other', key: 'F'}];

    selectedPersonType: any = null;
    personTypes: any[] = [{name: 'Actor', key: 'A'}, {name: 'Director', key: 'D'}, {name: 'Writer', key: 'W'}];


    persons: any;
    form: any;
    selectedDOB: any;

    constructor(
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService,
        private readonly filmService: FilmService,
        private readonly personService: PersonService,
        private confirmationService: ConfirmationService,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.getAllPersons();
        this.form = this.formBuilder.group({
            name: [null, Validators.required],
            dob: [null],
            sex: [null],
            type: [null, Validators.required],

        });
    }


    private getAllPersons() {
        this.personService.getAllPersons().subscribe((data) => {
            this.persons = data.data;
        });
    }

    personDetailsById(id: any) {

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

    onSubmit() {
        console.log(this.selectedPersonType)
        if (this.form.valid) {
            const data: any = {};
            data.name = this.form.get('name').value;
            data.dob = this.convertDate(this.form.get('dob').value);
            data.sex = this.selectedSex.name;
            data.type = this.selectedPersonType.name;

            this.httpClient.post<any>(API_URL + 'persons', data).subscribe(data => {
                this.getAllPersons();
                this.closeModal();
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Person created successfully!'
                });
            });

        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Form validation failed'
            });
        }

    }

    convertDate(date: Date | undefined): string {
        let data = this.datePipe.transform(date, 'yyyy-MM-dd') + "";
        return data;
    }

    openModal() {
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'personModal',
            hideCloseButton: true,
            centered: false,
            backdrop: false,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: false,
            backdropClass: "modal-backdrop"
        })
    }

    closeModal() {
        this.modalService.close(this.modalRef);
    }

    confirmDelete(event: any, id: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: "Are you sure that you want to delete?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                if (id) {
                    this.httpClient.delete<any>(API_URL + 'persons/' + id).subscribe(data => {
                        this.getAllPersons();
                        this.messageService.add({
                            key: 'toast-key', severity: 'error', summary: 'Deleted',
                            detail: 'Person deleted successfully!'
                        });
                    });
                }
            },
            reject: () => {
                console.log("Rejected")
            }
        });
    }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ModalManager} from "ngb-modal";
import {DatePipe} from "@angular/common";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ErrorHandlerService} from "../core/services/error-handler.service";
import {environment} from "../../environments/environment";
import {GenreService} from "../core/services/genre/genre.service";


const API_URL = environment.apiUrl;

@Component({
    selector: 'app-genre',
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit {

    @ViewChild('genreModal') myModal: any;
    private modalRef: any;
    form: any;
    genres: any;
    createdAt: any = "15-01-2022";


    constructor(
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService,
        private readonly genreService: GenreService,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.getAllGenre();
        this.form = this.formBuilder.group({
            name: [null, Validators.required]

        });
    }

    private getAllGenre() {
        this.genreService.getAllGenre().subscribe((data) => {
            console.log(data.data);
            this.genres = data.data;
        });
    }

    onSubmit() {
        if (this.form.valid) {
            const data: any = {};
            data.name = this.form.get('name').value;
            data.createdAt = this.convertDate(new Date());

            this.httpClient.post<any>(API_URL + 'genres', data).subscribe(data => {
                this.getAllGenre();
                this.closeModal();
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Genre created successfully!'
                });
            });

        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Form validation failed'
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

    convertDate(date: Date | undefined): string {
        let data = this.datePipe.transform(date, 'yyyy-MM-dd') + "";
        return data;
    }

    openModal() {
        this.modalRef = this.modalService.open(this.myModal, {
            size: "md",
            modalClass: 'genreModal',
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

    delete(id: number) {
        console.log(id);

    }
}

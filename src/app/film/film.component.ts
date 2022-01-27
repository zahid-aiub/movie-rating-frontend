import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmationService, MessageService, PrimeNGConfig} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";
import {ModalManager} from "ngb-modal";
import {DatePipe} from "@angular/common";
import {FormBuilder, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "../core/services/error-handler.service";
import {environment} from "../../environments/environment";
import {GenreService} from "../core/services/genre/genre.service";
import {PersonService} from "../core/services/person/person.service";

const API_URL = environment.apiUrl;

@Component({
    selector: 'app-film',
    templateUrl: './film.component.html',
    styleUrls: ['./film.component.css']
})
export class FilmComponent implements OnInit {

    @ViewChild('myModal') myModal: any;
    @ViewChild('editModal') editModal: any;
    private modalRef: any;

    films: any;
    film: any;
    form: any;
    selectedReleaseDate: any;
    isSubFilm: boolean = false;
    persons: any;
    genres: any;
    selectedPersons: any;
    selectedGenres: any;
    selectedFilm: any;
    isEdit: boolean = false;
    isNew: boolean = false;


    constructor(
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private primengConfig: PrimeNGConfig,
        private messageService: MessageService,
        private readonly filmService: FilmService,
        private readonly genreService: GenreService,
        private readonly personService: PersonService,
        private confirmationService: ConfirmationService,
        private errorHandlerService: ErrorHandlerService,
    ) {
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.getAllFilms();
        this.getAllGenre();
        this.getAllPersons();
        this.form = this.formBuilder.group({
            title: [null, Validators.required],
            filmList: [null],
            description: [null],
            subFilm: [null],
            geners: [null, Validators.required],
            filmPerson: [null, Validators.required],
            releaseDate: [null, Validators.required],

        });

    }

    setSession(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private getAllFilms() {
        this.filmService.getAllFilms().subscribe((data) => {
            console.log(data);
            this.films = data.data;
        });
    }

    private getAllGenre() {
        this.genreService.getAllGenre().subscribe((data) => {
            console.log(data.data);
            this.genres = data.data;
        });
    }

    private getAllPersons() {
        this.personService.getAllPersons().subscribe((data) => {
            console.log(data.data);
            this.persons = data.data;
        });
    }

    onSubmit() {
        console.log(this.selectedPersons);
        if (this.form.valid) {
            const data: any = {};
            data.title = this.form.get('title').value;
            data.description = this.form.get('description').value;
            data.releaseDate = this.convertDate(this.form.get('releaseDate').value);
            data.personIdList = this.selectedPersons;
            data.genreIdList = this.selectedGenres;
            data.isSubFilm = this.isSubFilm ? 1 : 0;
            if (this.isSubFilm) {
                data.parentFilmId = this.selectedFilm.id;
            }

            console.log(data.isSubFilm);
            this.httpClient.post<any>(API_URL + 'films', data).subscribe(data => {
                this.getAllFilms();
                this.closeModal();
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Film created successfully!'
                });
            });

        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Form validation failed'
            });
        }
    }

    filmDetailsById(id: any) {

    }

    confirmDelete(event: any, id: any) {
        this.confirmationService.confirm({
            target: event.target,
            message: "Are you sure that you want to delete?",
            icon: "pi pi-exclamation-triangle",
            accept: () => {
                if (id) {
                    this.httpClient.delete<any>(API_URL + 'films/' + id).subscribe(data => {
                        this.getAllFilms();
                        this.messageService.add({
                            key: 'toast-key', severity: 'error', summary: 'Deleted',
                            detail: 'Film deleted successfully!'
                        });
                    });
                }
            },
            reject: () => {
                console.log("Rejected")
            }
        });
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

    handleSubFilm(event: any) {
        console.log(event);
        if (event.checked) {
            this.isSubFilm = true;
        } else {
            this.isSubFilm = false;
        }
    }

    mapToObject(data: any): any {
        return Object.keys(data).map((key: any) => {
            console.log(key)
            return {
                name: key.name,
                id: key.id
            }
        });
    }

    convertDate(date: Date | undefined): string {
        let data = this.datePipe.transform(date, 'yyyy-MM-dd') + "";
        return data;
    }

    openModal(id?: any) {

        if (id) {
            this.isEdit = true;
            console.log(this.isEdit);
            this.populateEditData(id);
        } else {
            this.isNew = true;
            this.isEdit = false;
        }
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'mymodal',
            hideCloseButton: true,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: false,
            backdropClass: "modal-backdrop"
        })
    }

    closeModal() {
        this.isNew = false;
        this.isEdit = false;
        this.modalService.close(this.modalRef);
    }

    private populateEditData(id: any) {
        this.film = this.films.filter((data: any) => data.id == id)[0];
        this.filmService.getFilmPersonList(id, false).subscribe((data) => {
            this.selectedPersons = data.map((a: any) => a.id);
        });

        this.filmService.getFilmGenreList(id, false).subscribe((data) => {
            this.selectedGenres = data.map((a: any) => a.id);
        });
        this.form.patchValue({
            title: this.film.title,
            filmList: this.films,
            description: this.film.description,
            subFilm: false,
            geners: this.selectedGenres,
            filmPerson: this.selectedPersons,
            releaseDate: new Date(this.film.releaseDate)
        });
    }
}

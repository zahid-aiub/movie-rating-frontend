import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {FormBuilder, Validators} from "@angular/forms";
import {ModalManager} from "ngb-modal";
import {DatePipe} from "@angular/common";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {FilmService} from "../core/services/film/film.service";
import {GenreService} from "../core/services/genre/genre.service";
import {PersonService} from "../core/services/person/person.service";
import {environment} from "../../environments/environment";


const API_URL = environment.apiUrl;

@Component({
    selector: 'app-film-details',
    templateUrl: './film-details.component.html',
    styleUrls: ['./film-details.component.css']
})
export class FilmDetailsComponent implements OnInit {

    @ViewChild('detailsModal') detailsModal: any;
    @ViewChild('editSubFilmModal') editSubFilmModal: any;
    private modalRef: any;

    filmId: any;
    film: any;

    subFilm: any = {
        title: '',
        description: '',
        releaseDate: '',
        rating: 2
    };

    subFilms: any;

    filmPersons: any;

    filmGenres: any;

    isSubFilm: boolean = false;

    subFilmPersons: any;
    subFilmGenres: any;
    form: any;
    selectedReleaseDate: any;
    genres: any;
    selectedGenres: any;
    persons: any;
    selectedPersons: any;

    ratingVal: number | undefined;
    filmRating: number | undefined;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        private formBuilder: FormBuilder,
        private genreService: GenreService,
        private modalService: ModalManager,
        private readonly datePipe: DatePipe,
        private primengConfig: PrimeNGConfig,
        private personService: PersonService,
        private messageService: MessageService,
        private activatedRoute: ActivatedRoute,
        private readonly filmService: FilmService
    ) {
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;
        this.filmId = this.activatedRoute.snapshot.params['id'];
        this.populateData(this.filmId);
        this.getAllPersons();
        this.getAllGenre();
        this.form = this.formBuilder.group({
            title: [null, Validators.required],
            rating: [null],
            description: [null],
            genre: [null, Validators.required],
            filmPerson: [null, Validators.required],
            releaseDate: [null, Validators.required],

        });
    }

    private populateData(filmId: any) {
        this.filmService.getFilmsDetails(filmId).subscribe((data) => {
            this.film = data;
            this.filmRating = data.z_rating;
        });

        this.filmService.getAllSubFilms(filmId).subscribe((data) => {
            console.log(data);
            this.subFilms = data.data;
        });

/*        this.filmService.getFilmRating(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.film['rating'] = data;
        });*/

        this.filmService.getFilmPersonList(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.filmPersons = data;
        });

        this.filmService.getFilmGenreList(filmId, this.isSubFilm).subscribe((data) => {
            console.log(data);
            this.filmGenres = data;
        });

    }

    openModal(id: any) {
        this.populateSubFilmData(id);
        this.modalRef = this.modalService.open(this.detailsModal, {
            size: "lg",
            modalClass: 'detailsModal',
            hideCloseButton: true,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: true,
            backdropClass: "modal-backdrop"
        })
    }

    closeModal() {
        this.modalService.close(this.modalRef);
    }

    private populateSubFilmData(id: any) {
        this.subFilm = this.subFilms.filter((data: any) => data.id == id)[0];
        console.log(this.subFilm);

        this.filmService.getFilmPersonList(this.subFilm.id, true).subscribe((data) => {
            console.log(data);
            this.subFilmPersons = data;
            this.selectedPersons = data.map((a: any) => a.id);
        });

        this.filmService.getFilmGenreList(this.subFilm.id, true).subscribe((data) => {
            console.log(data);
            this.subFilmGenres = data;
            this.selectedGenres = data.map((a: any) => a.id);
        });

/*        this.filmService.getFilmRating(this.subFilm.id, true).subscribe((data) => {
            // this.subFilm['rating'] = data;
            this.subFilm['rating'] = 3;
        });*/
    }

    calculateRating(id: any) {
        console.log("======================", id);
        return this.subFilms.filter((item: any)=> item.id == id)[0].z_rating;
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

    update() {
        console.log("Data: ", this.selectedPersons)
        console.log("Data: ", this.selectedGenres)
        if (this.form.valid) {
            const data: any = {};
            data.id = this.subFilm.id;
            data.description = this.form.get('description').value;
            data.zrating = this.ratingVal;
            data.releaseDate = this.convertDate(this.form.get('releaseDate').value);
            data.filmGenreIdList = this.selectedGenres;
            data.filmPersonIdList = this.selectedPersons;
            data.isSubFilm = 1;

            console.log(data.isSubFilm);
            this.httpClient.put<any>(API_URL + 'films', data).subscribe(data => {
                this.refreshSubFilms();
                this.closeModal();
                this.messageService.add({
                    key: 'toast-key', severity: 'success', summary: 'Successful',
                    detail: 'Film Updated successfully!'
                });
            });

        } else {
            this.messageService.add({
                key: 'toast-key', severity: 'error', summary: 'Validation Failed',
                detail: 'Form validation failed'
            });
        }
    }

    refreshSubFilms() {
        this.filmService.getAllSubFilms(this.filmId).subscribe((data) => {
            this.subFilms = data.data;
        });
    }

    convertDate(date: Date | undefined): string {
        let data = this.datePipe.transform(date, 'yyyy-MM-dd') + "";
        return data;
    }

    openEditModal(id: any) {
        this.populateSubFilmData(id);
        this.populateSingleData();
        this.modalRef = this.modalService.open(this.editSubFilmModal, {
            size: "lg",
            modalClass: 'editSubFilmModal',
            hideCloseButton: true,
            centered: false,
            backdrop: true,
            animation: true,
            keyboard: false,
            closeOnOutsideClick: false,
            backdropClass: "modal-backdrop"
        })
    }

    populateSingleData() {
        this.form.patchValue({
            title: this.subFilm.title,
            rating: this.subFilm.z_rating,
            description: this.subFilm.description,
            genre: this.selectedGenres,
            filmPerson: this.selectedPersons,
            releaseDate: new Date(this.subFilm.releaseDate)
        });
    }

    getAllGenre() {
        this.genreService.getAllGenre().subscribe((data) => {
            this.genres = data.data;
        });
    }

    getAllPersons() {
        this.personService.getAllPersons().subscribe((data) => {
            this.persons = data.data;
        });
    }
}

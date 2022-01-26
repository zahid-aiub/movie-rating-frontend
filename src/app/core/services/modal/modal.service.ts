import {Injectable, ViewChild} from '@angular/core';
import {ModalManager} from "ngb-modal";

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    @ViewChild('myModal') myModal: any;
    private modalRef: any;

    constructor(
        private modalService: ModalManager,
    ) {
    }

    openModal() {
        this.modalRef = this.modalService.open(this.myModal, {
            size: "lg",
            modalClass: 'mymodal',
            hideCloseButton: false,
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
        //or this.modalRef.close();
    }


}

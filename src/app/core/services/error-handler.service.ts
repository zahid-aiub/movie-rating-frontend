import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() {
  }

  handleError(error: any) {
    console.log("Error Occurred!!");
    return throwError(error);
  }

}

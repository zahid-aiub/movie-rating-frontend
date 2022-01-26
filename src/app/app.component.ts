import {Component} from '@angular/core';
import {PrimeNGConfig} from 'primeng/api';
import {environment} from "../environments/environment";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ims-fontend';
  baseUrl = environment.baseUrl;

  constructor(private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

}

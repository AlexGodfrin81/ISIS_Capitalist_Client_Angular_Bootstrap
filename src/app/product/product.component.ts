import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RestserviceService } from '../restservice.service';
import { Product } from '../world';

declare var require: (arg0: string) => any;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})



export class ProductComponent implements OnInit {

  product: Product = new Product();
  server = "http://localhost:8081/";
  progressbar: any;
  lastupdate = 0;
  progressbarvalue = 0;



  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }


  @ViewChild('bar') progressBarItem: any;

  constructor(private service: RestserviceService) { }

  ngOnInit() {
    this.progressbar = new
      ProgressBar.Line(this.progressBarItem.nativeElement,
        { strokeWidth: 50, color: '#00ff00' });

  }

  startFabrication() {
    if (this.product.quantite >= 1 && this.product.timeleft == 0) {
      this.product.timeleft = this.product.vitesse;
      this.progressbar.set(0);
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate = Date.now();
    }
  }





}

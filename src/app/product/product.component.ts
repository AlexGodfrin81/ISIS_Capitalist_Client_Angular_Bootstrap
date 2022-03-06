import { Component, Input, OnInit, Output, ViewChild, EventEmitter} from '@angular/core';
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
  _qtmulti: any;
  money:number = 0;
  qtemax:number = 0;
  



  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }

  @Input() set qtmulti(value:string){
    this._qtmulti = value;
    if(this._qtmulti && this.product) this.calcMaxCanBuy();

  }


  @ViewChild('bar') progressBarItem: any;

  constructor(private service: RestserviceService) { }

  ngOnInit() {
    this.progressbar = new
      ProgressBar.Line(this.progressBarItem.nativeElement,
        { strokeWidth: 50, color: '#00ff00' });

    setInterval(()=> {
      this.calcScore();
    },100);

  }

  startFabrication() {
    if (this.product.quantite >= 1 && this.product.timeleft == 0) {
      this.product.timeleft = this.product.vitesse;
      this.progressbar.set(0);
      this.progressbar.animate(1, { duration: this.product.vitesse });
      this.lastupdate = Date.now();
    }
  }

  calcScore(){
    if(this.product.quantite >= 1){
      let temps_ecoule = Date.now() - this.lastupdate;
      this.lastupdate = Date.now();
      if(this.product.timeleft != 0){
        this.product.timeleft = this.product.timeleft - temps_ecoule;
        if(this.product.timeleft <= 0){
          this.product.timeleft = 0;
          this.progressbar.set(0);
           // on prévient le composant parent que ce produit a généré son revenu.
           this.notifyProduction.emit(this.product);
           this.service.putProduct(this.product);
        }
      }
    }
  }

  calcMaxCanBuy(){
    let x = this.product.cout;
    let c = this.product.croissance;
    this.qtemax = Math.floor(Math.log(-(this.money*(1-c))/x+1)/Math.log(c));
    return this.qtemax
    }

  @Output() 
  notifyProduction : EventEmitter<Product> = new EventEmitter <Product>();




}

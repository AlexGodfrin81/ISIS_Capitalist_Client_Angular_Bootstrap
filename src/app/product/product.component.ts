import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { BigvaluePipe } from '../bigvalue.pipe';
import { RestserviceService } from '../restservice.service';
import { Product, Pallier } from '../world';

declare var require: (arg0: string) => any;
const ProgressBar = require("progressbar.js");

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {

  progressbarvalue: number = 0;
  product: Product = new Product();
  server = "http://localhost:8081/";
  progressbar: any;
  lastupdate = 0;
  _qtmulti: any;
  _money: number = 0;
  qtemax: number = 0;
  totalCost: number = 0;
  numberTransformer : BigvaluePipe;
  canBuy: boolean = false;
  bonus_all_speed: number = 0;



  @Input()
  set prod(value: Product) {
    this.product = value;
    this.lastupdate = Date.now();
  }

  @Input() set qtmulti(value: string) {
    this._qtmulti = value;
    if (this._qtmulti && this.product) this.calcMaxCanBuy();
    this.calcQteMulti();
  }

  @Input()
  set money(value: number){
    this._money = value;
    this.calcQteMulti();
  }
  


  @ViewChild('bar') progressBarItem: any;

  constructor(private service: RestserviceService) {
    this.numberTransformer = new BigvaluePipe();
   }

  ngOnInit() {
    setInterval(() => {
      this.calcScore();
    }, 100);

  }

  calcAllUpgradesSpeed(pallier:Pallier){
    if (pallier.typeratio == "vitesse" && this.product.quantite > pallier.seuil){
      this.bonus_all_speed += pallier.ratio;
    }
  }

  startFabrication() {
    console.log(this.product.name);
    if (this.product.quantite >= 1 && this.product.timeleft == 0) {
      this.product.timeleft = this.product.vitesse;

      this.lastupdate = Date.now();
    }
  }

  calcScore() {
    if (this.product.managerUnlocked && this.product.timeleft == 0) {
      this.startFabrication();
    }
    if (this.product.quantite >= 1) {
      let temps_ecoule = Date.now() - this.lastupdate;
      this.lastupdate = Date.now();
      if (this.product.timeleft != 0) {
        this.product.timeleft = this.product.timeleft - temps_ecoule;
        if (this.product.timeleft <= 0) {
          this.product.timeleft = 0;
          this.progressbarvalue = 0;
          // on prévient le composant parent que ce produit a généré son revenu.
          this.notifyProduction.emit(this.product);
          this.service.putProduct(this.product);
        } else {
          this.progressbarvalue = Math.round(((this.product.vitesse - this.product.timeleft) / this.product.vitesse) * 100)
        }
      }
    }
  }

  calcMaxCanBuy() {
    let x = this.product.cout;
    let c = this.product.croissance;
    let prix = x * c**(this.product.quantite+1);
    this.qtemax = Math.floor(Math.log(-(this._money * (1 - c)) / prix + 1) / Math.log(c));
    console.log(this.qtemax);
    return this.qtemax
  }

  qteMulti(){
    return this._qtmulti==="xMax" ? "x" + this.qtemax : this._qtmulti;
  }

  calcQteMulti(){
    let x = this.product.cout;
    let c = this.product.croissance;
    let prix = x * c**(this.product.quantite+1);
    if (this._qtmulti == "x1"){
      this.totalCost = prix;
    } else if (this._qtmulti == "x10") {
      this.totalCost = prix * ((1 - c ** 10) / (1 - c));
    } else if (this._qtmulti == "x100") {
      this.totalCost = prix * ((1 - c ** 100) / (1 - c));
    } else {
      let n = this.calcMaxCanBuy();
      this.totalCost = prix * ((1 - c ** n) / (1 - c));
    }
  }

  buyProduct() {
    this.calcQteMulti();
    console.log(this._qtmulti, this.calcMaxCanBuy());
    if (this._qtmulti == "x1" && this.calcMaxCanBuy() >= 1) {
      this.product.quantite += 1;
      this.notifyBuy.emit(this.totalCost);
    } else if (this._qtmulti == "x10" && this.calcMaxCanBuy() >= 10) {
      this.product.quantite += 10;
      this.notifyBuy.emit(this.totalCost);
    } else if (this._qtmulti == "x100" && this.calcMaxCanBuy() >= 100) {
      this.product.quantite += 100;
      this.notifyBuy.emit(this.totalCost);
    } else if (this._qtmulti == "xMax") {
      this.product.quantite += this.calcMaxCanBuy();
      this.notifyBuy.emit(this.totalCost);
    } else {
      alert("Vous n'avez pas assez d'argent");
    }
    this.product.palliers.pallier.forEach(element => {
      if (this.product.quantite > element.seuil){
        element.unlocked = true;
      }
    });

    this.notifyBuyProduct.emit(this.product);
    
    this.service.putProduct(this.product);
  }

  @Output()
  notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output()
  notifyBuy: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  notifyBuyProduct: EventEmitter<Product> = new EventEmitter<Product>();


}

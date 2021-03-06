import { Component, QueryList, ViewChildren } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductComponent } from './product/product.component';

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren(ProductComponent) public produits: QueryList<ProductComponent> | undefined;
  title = 'ISIS_CAPITALIST_CLIENT';
  world: World = new World();
  server: string;
  qtmulti: any;
  cpt :number = 0;
  price = ["x1", "x10", "x100", "xMax"];
  username: string = "";
  productsComponent: any;
  angelToClaim: number = 0;

  constructor(private service: RestserviceService, private snackBar: MatSnackBar) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
      this.qtmulti = this.price[0];
    });
  }



  ngOnInit() {
    if (localStorage.getItem("username") != null) {
      this.username = String(localStorage.getItem('username'));
    } else {
      if (this.username == "") {
        this.username = "captain" + Math.floor(Math.random() * 10000);
        console.log("username jsuis al" + this.username);
        localStorage.setItem("username", this.username);
      }
    }
  }

  allProductAbove(value: number) {
    let flag = true;
    this.world.products.product.forEach(elt => {
      if (elt.quantite < value) {
        flag = false;
      }
    });
    return flag;
  }

  calculNbAnge() {
    if (150 * (this.world.score/Math.pow(10,15)) - this.world.totalangels < 1){
      this.angelToClaim = 0;
    }else{
      this.angelToClaim = 150 * (this.world.score/Math.pow(10,15)) - this.world.totalangels;
    }
  }

  onProductionDone(p: Product) {
    //console.log("username : " + this.username);
    let bonus = 1;
    p.palliers.pallier.forEach(elt => {
      if (p.quantite >= elt.seuil && elt.typeratio == "gain"){
        bonus += elt.ratio;
      }
    });
    if (bonus > 1) {bonus--;}
    this.world.money += p.revenu * p.quantite * bonus;
    this.world.score += p.revenu * p.quantite * bonus;
    this.calculNbAnge();
  }

  onBuy(number: number) {
    if (this.world.money - number > 0){
      this.world.money = this.world.money - number;      
    }
  }

  onBuyProductDone(product: Product) {
    this.service.putProduct(product);
    //verification de la quantit?? du produit ?? l'achat si elle peut d??bloqu?? un bonus unlock
    for (let unlock of product.palliers.pallier) {
      if (!unlock.unlocked && product.quantite >= unlock.seuil) {
        this.applyUpgrade(unlock);
        unlock.unlocked = true;
        this.popMessage("Unlock "+unlock.name+" for product "+product.name+" unlocked!");     
      }
    }
    //V??rification si un allUnlock peut ??tre d??bloqu?? ?? l'achat d'un produit
    for (let allUnlock of this.world.allunlocks.pallier){
      if(!allUnlock.unlocked){
        let nbSeuil=0;
        for(let p of this.world.products.product){
          if(p.quantite >= allUnlock.seuil){
            nbSeuil++;
          }
        }
        if(nbSeuil == this.world.products.product.length){
          this.applyUpgrade(allUnlock);
          allUnlock.unlocked = true;
          this.popMessage("AllUnlock "+allUnlock.name+" for all products unlocked!");
        }
      }
    }
  }

  applyUpgrade(pallier: Pallier) {
    if (pallier.typeratio == "anges") {
      this.world.angelbonus += pallier.ratio;
    } else {
      let idCible = pallier.idcible;
      let bonusVitesse = 1;
      let bonusGain = 1;

      if (pallier.typeratio == "vitesse")
        bonusVitesse = pallier.ratio;

      if (pallier.typeratio == "gain")
        bonusGain = pallier.ratio;

      if (idCible == 0) {
        for (let p = 0; p < this.world.products.product.length; p++) {
          this.world.products.product[p].revenu *= bonusGain;
          this.world.products.product[p].vitesse /= bonusVitesse;
        }
      }
    }
  }

  commutePrice(){
    let index = this.price.indexOf(this.qtmulti);
    if(index < this.price.length -1){
      this.qtmulti = this.price[index +1];
    }else{
      this.qtmulti = this.price[0];
    }
  }

  hire(manager: Pallier) {
    if (this.world.money > manager.seuil) {
      this.world.money -= manager.seuil;
      manager.unlocked = true;
      this.world.products.product.forEach(element => {
        if (element.id == manager.idcible) {
          element.managerUnlocked = true;
          this.popMessage(manager.name+ " hired !");

        }
      });
    }
  }

  newManager() {
    let res = false;
    this.world.managers.pallier.forEach(value => {
      if (!value.unlocked) {
        if (value.seuil < this.world.money) {
          res = true;
        }
      }
    });
    return res;
  }

  newUpgrade(){
    let res = false;
    this.world.upgrades.pallier.forEach(value => {
      if (!value.unlocked) {
        if (value.seuil < this.world.money) {
          res = true;
        }
      }
    });
    return res;
  }

  newAngel(){
    let res = false;
    this.world.angelupgrades.pallier.forEach(value => {
      if (!value.unlocked) {
        if (value.seuil < this.world.money) {
          res = true;
        }
      }
    });
    return res;
  }

  onUsernameChanged() {
    if (this.username == ""){
      this.username = "Captain" + Math.floor(Math.random()*10000);
    }
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    console.log("service username" + this.service.getUser())
    window.location.reload();
  }

  buyUpgrade(upgrade : Pallier){
    if(this.world.money >= upgrade.seuil){
      this.world.money -= upgrade.seuil;
      upgrade.unlocked = true;
      this.applyUpgrade(upgrade);
      this.service.putUpgrade(upgrade);
      this.popMessage(upgrade.name+" bought!");
      
    }
  }

  buyAngelupgrade(upgrade : Pallier){
    if(this.world.activeangels >= upgrade.seuil){
      this.world.activeangels -= upgrade.seuil;
      upgrade.unlocked = true;
      this.applyUpgrade(upgrade);
      this.service.putAngelupgrade(upgrade);
      this.popMessage(upgrade.name+" bought!");
    }
    
  }
  popMessage(message : string) : void {
    this.snackBar.open(message, "OK", { duration : 5000 })
  }

}

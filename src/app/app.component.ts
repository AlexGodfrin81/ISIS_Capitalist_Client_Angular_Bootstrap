import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToasterModule, ToasterService } from 'angular2-toaster';

@Component({
  selector: 'app-root',
  templateUrl: "./app.component.html",
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISIS_CAPITALIST_CLIENT';
  world: World = new World();
  server: string;
  qtmulti: any;
  cpt :number = 0;
  price = ["x1", "x10", "x100", "xMax"];
  toasterService: ToasterService;
  username: string = "";

  constructor(private service: RestserviceService, toasterService: ToasterService) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
      this.qtmulti = this.price[0];
    });
    this.toasterService = toasterService;
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

  onProductionDone(p: Product) {
    //console.log("username : " + this.username);
    this.world.money += p.revenu * p.quantite;
    this.world.score += p.revenu * p.quantite;
  }

  onBuy(number: number) {
    if (this.world.money - number > 0){
      this.world.money = this.world.money - number;      
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
          this.toasterService.pop("success", "Manager Hired ! ", element.name);

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

  onUsernameChanged() {
    if (this.username == ""){
      this.username = "Captain" + Math.floor(Math.random()*10000);
    }
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
    console.log("service username" + this.service.getUser())
    window.location.reload();
  }

}

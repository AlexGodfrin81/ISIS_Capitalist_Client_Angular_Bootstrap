import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ISIS_CAPITALIST_CLIENT'; 
  world: World = new World();
  server: string;
  qtmulti: any;
  price = ["x1", "x10", "x100", "max"];
 // username: string;

  constructor(private service: RestserviceService) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
      this.qtmulti = this.price[0];
    });
  }


  onProductionDone(p:Product){
    //console.log("username : " + this.username);
    this.world.money += p.revenu * p.quantite;
    this.world.score += p.revenu * p.quantite;
  }

  onBuy(number: number){
    this.world.money = this.world.money - number;
  }
 
  hire(manager: Pallier) {
    if (this.world.money > manager.seuil) {
      this.world.money -= manager.seuil;
      manager.unlocked = true;
      this.world.products.product.forEach(element => {
        if (element.id == manager.idcible) {
          element.managerUnlocked = true;
        }
      });
    }
  }

}

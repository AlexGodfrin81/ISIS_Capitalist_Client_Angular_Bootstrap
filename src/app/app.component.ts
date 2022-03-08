import { Component } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ToastrService, ToastrModule } from 'ngx-toastr';




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
  toastrService : ToastrService;
 // username: string;

  constructor(private service: RestserviceService, private toastr: ToastrService) {
    this.server = service.getServer();
    service.getWorld().then(world => {
      this.world = world;
      this.qtmulti = this.price[0];
    });
    this.toastrService= toastr;
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
          this.toastr.success('success, Manager Hired ! ', element.name );
          
        }
      });
    }
  }

  /*showToaster(){
    console.log('miaou');
    this.toastr.success('ça a marché', this.world.managers.pallier[0].name);
  }*/

}

import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../world';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})


  
export class ProductComponent implements OnInit {
  

  constructor(product: Product) { this.product = product }

  ngOnInit(): void {
  }

  
  product: Product;
  @Input()
  set prod(value: Product){
    this.product = value;
  }

}

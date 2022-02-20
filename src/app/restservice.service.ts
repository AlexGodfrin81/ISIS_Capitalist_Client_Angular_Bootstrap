import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

  constructor() { }
}

import { HttpClient } from '@angular/common/http'
import { World, Pallier, Product } from './world';

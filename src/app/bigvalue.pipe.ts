import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bigvalue'
})
export class BigvaluePipe implements PipeTransform {

  transform(valeur: number, args?: any): string {

    let res: string="";
    if (valeur < 1000)
      res = valeur.toFixed(2);
    else if (valeur < 1000000)
      res = valeur.toFixed(0);
    else if (valeur >= 1000000) {
      res = valeur.toPrecision(4);
      res = res.replace(/e\+(.*)/, " x10<sup>$1</sup>");
    }
    return res;

  }

}


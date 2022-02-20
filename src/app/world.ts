
export class World {
    name : string = ""
    logo : string = ""
    money: number = 0
    score: number = 0
    totalangels: number = 0
    activeangels: number = 0
    angelbonus: number = 0
    lastupdate: string = ""
    products : { "product": Product[] };
    allunlocks: { "pallier": Pallier[]};
    upgrades: { "pallier": Pallier[]};
    angelupgrades: { "pallier": Pallier[]};
    managers: { "pallier": Pallier[]};

    constructor() {
        this.products = { "product":[ ] } ;
        this.managers = { "pallier":[ ] };
        this.upgrades = { "pallier":[ ] };
        this.angelupgrades = { "pallier":[ ] };
        this.allunlocks = { "pallier":[ ] };
    }
}

export class Product {
    id : number = 0
    name : string = ""
    logo : string = ""
    cout : number = 0
    croissance: number = 0
    revenu: number = 0
    vitesse: number = 0
    quantite: number = 0
    timeleft: number = 0
    managerUnlocked: boolean = false
    palliers : { "pallier" : Pallier[]};

    constructor() {
        this.palliers = { "pallier": [] }

    }
}

export class Pallier {
    name: string = ""
    logo: string = ""
    seuil: number = 0
    idcible: number = 0
    ratio: number = 0
    typeratio: string = ""
    unlocked: boolean = false
}

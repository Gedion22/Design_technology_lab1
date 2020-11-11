import { INITIAL_COINS } from './Constants'

export class City {
    x: number;
    y: number;
    country: string;
    balance: object;
    isCompleted: boolean;
    neighbours: City[];

    constructor(x: number, y: number, country: string){
        this.x = x;
        this.y = y;
        this.country = country;
        this.balance = {};
        // @ts-ignore
        this.balance[country] = INITIAL_COINS;
        this.isCompleted = false;
        this.neighbours = [];
    }

    transfer(country: string, amount: number): void{
        // @ts-ignore
        this.balance[country] ? this.balance[country] += amount : this.balance[country] = amount;
    }
}

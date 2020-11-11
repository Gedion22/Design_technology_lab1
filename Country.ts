import { City } from './City'

export class Country{
    name: string;
    xl: number;
    yl: number;
    xh: number;
    yh: number;
    cities: City[];
    isCompleted: boolean;
    days: number;

    constructor(name: string, xl: number, yl: number, xh: number, yh: number){
        this.name = name;
        this.xl = xl;
        this.yl = yl;
        this.xh = xh;
        this.yh = yh;
        this.cities = this.createCities();
        this.isCompleted = false;
    }

    createCities(): City[]{
        const cities = [];
        for(let x = this.xl; x <= this.xh; x++){
            for(let y = this.yl; y<= this.yh; y++){
                const city = new City(x, y, this.name);
                cities.push(city);
            }
        }
        return cities;
    }

};

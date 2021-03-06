import {MAP_MAX, REPRESENTATIVE_FACTOR} from './Constants';
import { Country } from "./Country";
import {City} from "./City";
import {getLengthString, manageString} from "./Utils";

interface IPortion {
    city: City;
    portion: object;
}

export class Grid {
    countries: Country[];
    grid: City[][];

    constructor(countries: Country[]){
        this.countries = countries;
        const { xl, yl, xh, yh } = this.findBoundaries(countries);
        this.grid = [];
        for(let i=0; i<= xh - xl + 1; i++){
            this.grid[i] = new Array(yh - yl + 1);
        }
        countries.map((country: Country) => {
            country.cities.map(city =>{
                if(this.grid[city.x][city.y]){
                    throw new Error('City overlapped')
                }
                this.grid[city.x][city.y] = city;
            });
        });
    }

    getMinBoundary(countries: Country[], key: string): number {
        return (countries.reduce((min: number, p: Country) => p[key] < min ? p[key] : min, countries[0][key]));
    }
    getMaxBoundary(countries: Country[], key: string): number {
        return (countries.reduce((max: number, p: Country) => p[key] > max ? p[key] : max, countries[0][key]));
    }

    findBoundaries(countries: Country[]) : {xl: number, yl: number, xh: number, yh: number}{
        const xl = this.getMinBoundary(countries,'xl');
        const yl = this.getMinBoundary(countries,'yl');
        const xh = this.getMaxBoundary(countries,'xh');
        const yh = this.getMaxBoundary(countries,'yh');
        return { xl, yl, xh, yh };
    }

    calculatePortion(city: City): IPortion{
        let portionArr: IPortion[] = [];
        Object.keys(city.balance).map((key: string) => {
            // @ts-ignore
            const portion = city.balance[key] / REPRESENTATIVE_FACTOR;
            if( portion > 0 ){
                portionArr.push({[key]: portion});
            }
        });
        return {city, portion: portionArr}
    }
    transfer(neighbour: City, city: City, portion: IPortion): void{
        const key = Object.keys(portion);
        city.transfer(key[0], -portion[key[0]]);
        neighbour.transfer(key[0], portion[key[0]]);
    }

    transferToNeighbours(currentColumn: City[], neighbour: City, instruction: IPortion, key: string): boolean {
        const {city, portion} = instruction;
        let neighbor = false;
        if(currentColumn && neighbour){
            if(neighbour.country !== city.country){
                neighbor = true;
            }
            this.transfer(neighbour, city, portion[key]);
        }
        return neighbor;
    }

    distributeToNeighbours(instruction: IPortion): void{
        const {city, portion} = instruction;
        const {x,y} = city;
        let neighbor = false;
        Object.keys(portion).map((key: string) => {
            neighbor = neighbor || this.transferToNeighbours(this.grid[x-1], this.grid[x-1]?this.grid[x-1][y]:null, instruction, key);
            neighbor = neighbor || this.transferToNeighbours(this.grid[x+1], this.grid[x+1]?this.grid[x+1][y]:null, instruction, key);
            neighbor = neighbor || this.transferToNeighbours(this.grid[x], this.grid[x][y+1], instruction, key);
            neighbor = neighbor || this.transferToNeighbours(this.grid[x], this.grid[x][y-1], instruction, key);
        });
        city.isNeighbour = neighbor;
    }

    calculateCompletion(): void{
        let day = 0;
        while(1){
            this.countries.map((country: Country) => {
                country.cities.map((city: City) =>{
                    this.setIsComplete(city);
                    this.setDays(country, day);
                });
            });

            if(day > 0 && this.checkIfComplete()) break;

            let portions = [];
            for(let x=0;x<this.grid.length;x++){
                for(let y=0;y<this.grid[0].length;y++){
                    if(this.grid[x] && this.grid[x][y]){
                        portions.push(this.calculatePortion(this.grid[x][y]));
                    }
                }
            }
            portions.map((port: IPortion)=>{
                this.distributeToNeighbours(port);
            });
            day += 1;
        }
    };
    setDays(country: Country, day: number): void{
        let countryCompleted = true;
        if(!country.isCompleted){
            country.cities.map((city: City) => {
                if(!city.isCompleted) countryCompleted = false;
            });
            if(countryCompleted) {
                country.days = day;
                country.isCompleted = true;
            }
        }

    }
    checkIfComplete(): boolean{
        let allCompleted = true;
        this.countries.forEach(country => {
            if(!country.checkNeighbors()){
                throw new Error('NO Neighbors')
            }
            if(!country.isCompleted) {
                allCompleted = false;
                return allCompleted;
            }
        });
        return allCompleted;
    }

    setIsComplete(city: City): void{
        if(Object.keys(city.balance).length === this.countries.length && !city.isCompleted){
            city.isCompleted = true;
        }
    }
    output(): string{
        let output = '';

        this.countries.sort(function (x,y){
            return x.days - y.days || x.name.localeCompare(y.name)
        });
        this.countries.forEach(country => {
            output += `${country.name}: ${country.days}\n`
        });
        return output;
    }

    log(): void{
        let output = '';
        const stringLength = getLengthString(this.countries);
        this.grid.map(x =>{
            if(!x){
                for (let i = 0; i < MAP_MAX; i++){
                    output = output + manageString('Empty ', stringLength);
                }
            } else {
                for (let i = 0; i < MAP_MAX; i++){
                    if(!x[i])
                        output = output + manageString('Empty', stringLength);
                    else
                        output = output + manageString(`[${x[i].country}] `, stringLength);
                }
            }
            output = output + '\n';
        });
        console.log(output);
    }
}

import { question } from 'readline-sync';
import {Country} from "./Country";
import {MAP_MAX, MAP_MIN} from "./Constants";
import {Grid} from "./Grid";


const checkEnterNumbers = (arr: string[]): boolean =>{
    let isValid = true;
    for (let i = 1; i < 5; i++){
        if(!parseInt(arr[i])) {
            isValid = false;
            break;
        }
    }
    return isValid;
};

let count = '';
while (!parseInt(count)) {
    count = question('Enter countries count ');
    if(!parseInt(count))
        console.log('Enter number ')
}
let enterCountries = [];
for(let i = 0; i < parseInt(count); i++){
    const country = question('Enter country ');
    const port = country.split(' ');
    if(port.length !== 5 && !checkEnterNumbers(port)){
        console.log('Enter valid information');
        i = i-1;
        continue;
    }
    enterCountries.push(port);
}
console.log(enterCountries);
let countries: Country[] = [];
enterCountries.map(countr =>{
    countries.push(new Country(countr[0], parseInt(countr[1]), parseInt(countr[2]), parseInt(countr[3]), parseInt(countr[4])))
});

let output = '';
let isValid = true;

countries.map(countr => {
    isValid = (countr.xl > MAP_MIN && countr.xl <= MAP_MAX) &&
        (countr.yl > MAP_MIN && countr.yl <= MAP_MAX) &&
        (countr.xh > MAP_MIN && countr.xh <= MAP_MAX) &&
        (countr.yh > MAP_MIN && countr.yh <= MAP_MAX);
});
console.log(isValid);
if(isValid){
    try {
        const grid = new Grid(countries);
        grid.log();
        grid.calculateCompletion();
        output = grid.output();
    }catch (e) {
        console.log('Error: '+e.message)
        console.log(e)
    }
}
else{
    output += `input invalid\n`;
}
console.log(output);

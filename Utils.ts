import {Country} from "./Country";

export  const getLengthString = (countries: Country[]):number => {
    let l = 6;
    countries.map(c =>{
        if(c.name.length+1 > l){
            l = c.name.length+3;
        }
    });
    return l;
};

export const manageString = (str: string, l: number): string =>{
    let output = str;
    if(str.length < l){
        for(let i = 0; i < l - str.length; i++){
            output += ' ';
        }
    }
    return output;
};

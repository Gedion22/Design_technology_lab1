import {Country} from "./Country";

export  const getLengthString = (countries: Country[]):number => {
    let minWordLength = 6;
    countries.map(c =>{
        if(c.name.length+1 > minWordLength){
            minWordLength = c.name.length+3;
        }
    });
    return minWordLength;
};

export const manageString = (str: string, wordLength: number): string =>{
    let output = str;
    if(str.length < wordLength){
        for(let i = 0; i < wordLength - str.length; i++){
            output += ' ';
        }
    }
    return output;
};

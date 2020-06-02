const fs = require('fs');

let stateMainFile = null;
let cityMainFile = null;
let numCityState = null;
let longNames = null;
let shortNames = null;

function readFile(name){

    const fileName = `./data/${name}.json`;
    var jsonData = [];
    
    jsonData = fs.readFileSync(fileName, "utf8");
    jsonData = JSON.parse(jsonData);

    return jsonData;
} 

function initializeMainFiles(){
    stateMainFile = readFile("Estados");
    cityMainFile = readFile("Cidades");
}

function separeteCities(){
    stateMainFile.forEach(currentState => {
        const stateId = currentState.ID;
        let cities = [];
        cities = cityMainFile.filter(city => city.Estado === stateId);

        const { Sigla } = currentState;

        const state = {
            Sigla,
            cities
        }

        const fileName = `./data/${Sigla}.json`;
        
        fs.writeFile(fileName, JSON.stringify(state), function(err){
            if (err) return "Write file error";
        });
    });
}

function readInformState(stateInitial){
    const state = readFile(stateInitial);
    
    return state;
}

function getSatesCities(){
    numCityState = stateMainFile.map(state => {
        const { Sigla } = state;
        const readState = readInformState(Sigla);  
        const numCities = readState.cities.length;    
        
        return {
            Sigla,
            numCities
        }
    });
}

function sortCities(){
    numCityState = numCityState.sort((a, b) => 
        b.numCities - a.numCities);
}

function showMoreCities(){

    let moreCities = numCityState.slice(0, 4);

    moreCities = moreCities.sort((a, b) => b.numCities - a.numCities);

    console.log('---------------------------------');
    console.log('lista de estados com mais cidades no Brasil');
    moreCities.forEach(state =>{
        const { Sigla, numCities } = state;

        console.log(`${Sigla} - ${numCities}`);
    });
}

function showLessCities(){

    const end = numCityState.length;
    const start = end - 5;

    let lessCities = numCityState.slice(start, end);

    lessCities = lessCities.sort((a, b) => b.numCities - a.numCities);

    console.log('---------------------------------');
    console.log('lista de estados com menos cidades no Brasil');
    lessCities.forEach(state =>{
        const { Sigla, numCities } = state;

        console.log(`${Sigla} - ${numCities}`);
    });
}

function longNamePerState(){

    longNames =
    stateMainFile.map(state => {
        const { Sigla } = state;
        const readState = readInformState(Sigla);     

        const { cities } = readState;
        let longName = '';
        cities.forEach( city => {
            
            const { Nome } = city;
            if (longName.length < Nome.length){
                longName = Nome;
                return;
            }

            if (longName.length === Nome.length){
                longName = (longName < Nome) ? longName : Nome;
            }
        });

        return {
            Sigla,
            longName
        }
    });
 console.log('------------------------------');
 console.log('lista de maoires nomes:')
 longNames.forEach( item => console.log(`${item.Sigla} - ${item.longName}`));
}

function shortNamePerState(){

    shortNames =
    stateMainFile.map(state => {
        const { Sigla } = state;
        const readState = readInformState(Sigla);     

        const { cities } = readState;
        let shortName = '';
        cities.forEach( city => {
            
            const { Nome } = city;
            if (shortName.length === 0 || shortName.length > Nome.length){
                shortName = Nome;
                return;
            }

            if (shortName.length === Nome.length){
                shortName = (shortName < Nome) ? shortName : Nome;
            }
        });

        return {
            Sigla,
            shortName
        }
    });
 console.log('------------------------------');
 console.log('lista de menores nomes:')
 shortNames.forEach( item => console.log(`${item.Sigla} - ${item.shortName}`));
}


function showLongName(){

/*     let cityLongName  = {
        Sigla: '',
        longName: ''
    }
    longNames.forEach(currentName => {

        const longName = currentName.longName;

        const Nome = cityLongName.longName;      
       
            if (Nome.length < longName.length){
                cityLongName = currentName;
                return;
            }

            if (Nome.length === longName.length){
                cityLongName = (Nome < longName) ? cityLongName : currentName;
            }
        }); */

        const nameToPrint = 
        longNames.reduce((cityLongName, currentName) => {
            const longName = currentName.longName;
            const Nome = cityLongName.longName;      
           
                if (Nome.length < longName.length){
                    cityLongName = currentName;
                }
    
                if (Nome.length === longName.length){
                    cityLongName = (Nome < longName) ? cityLongName : currentName;
                }

                return cityLongName;
            },{Sigla: '', longName: ''});   

 const { Sigla, longName } = nameToPrint;     

 console.log('------------------------------');
 console.log('Cidade com maior nome:');
 console.log(`${Sigla} - ${longName}`);
}

function showShortName(){

/*     let cityShortName  = {
        Sigla: '',
        shortName: ''
    }
    shortNames.forEach(currentName => {

        const shortName = currentName.shortName;

        const Nome = cityShortName.shortName;      
       
            if (Nome.length === 0 || Nome.length > shortName.length){
                cityShortName = currentName;
                return;
            }

            if (Nome.length === shortName.length){
                cityShortName = (Nome < shortName) ? cityShortName : currentName;
            }
        }); */

        const nameToPrint = 
        shortNames.reduce((cityShortName, currentName) => {
            const shortName = currentName.shortName;
            const Nome = cityShortName.shortName;      
           
                if (Nome.length > shortName.length || Nome.length === 0 ){
                    cityShortName = currentName;
                }
    
                if (Nome.length === shortName.length){
                    cityShortName = (Nome < shortName) ? cityShortName : currentName;
                }

                return cityShortName;
            },{Sigla: '', shortName: ''});       

 console.log('------------------------------');
 console.log('Cidade com menor nome:');
 const { Sigla , shortName } = nameToPrint;
 console.log(`${Sigla} - ${shortName}`);
}

initializeMainFiles();

//separeteCities();

getSatesCities();

sortCities();

showMoreCities();

showLessCities();

longNamePerState();

shortNamePerState();

showLongName();

showShortName();
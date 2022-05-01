//change this in the case that other columns will be added into the new format
var header = ["Account #",	'Trade date',	'Settlement date',	'Symbol',	'Exchange',	'Security name',	'TE type',	'Broker type',	'#units',	'$price/unit',	'Amount']


//ignore all variables here is not looking at the searching version
const apiFormatToSystem =  {"TO": ["TSX"], "V": ["TSXV"], "CN": ["CSE"], "US": ["US"], "NEO": ["NEO"]}
const systemToApiFormat = {"TSX":"TO", "TSXV":"V", "CSE":"CN", "US":"US", "NEO": "NEO"}
const apiKey = "625b5df8a34626.35549490"


//info that is needed when mapping out final formats
//final name is the index where the final name is stored added by the search function
//final exchange is where the final exchange is stored added by search functionality
//final symbol is where the final symbol INFO is stored added by the functionality
//original name is where the original name is stored in the case that the user flags an option, it could be reset to the default values
//originalSymbol is the index where the original symbol is so that it can be used if the user flags the row
//infoArr is where all of the info is store
//formation is used by the mapping function in order to map out all the proper index into the correct final format
const finalizeInfo = {
    "TD" : {
        "finalName": 13,
        "finalExchange":15,
        "finalSymbol":16,
        "originalName":2,
        "originalSymbol":10,
        "infoArr":14,
        "formation": {9:0, 0:1, 1:2, 16:3, 15:4, 13:5, 4:6, 3:7, 5:8, 6:9, 8:10}
    },
    "RBC" : {
        "finalName": 14,
        "finalExchange":16,
        "finalSymbol":17,
        "originalName":4,
        "originalSymbol":3,
        "infoArr":14,
        "formation": {8:0, 0:1, 7:2, 17:3, 16:4, 14:5, 1:6, 2:7, 5:8, 6:9, 9:10}
    },
    "questrade" : {
        "finalName": 17,
        "finalExchange":20,
        "finalSymbol":19,
        "originalName":16,
        "originalSymbol":4,
        "infoArr":18,
        "formation": {13:0, 0:1, 1:2, 19:3, 20:4, 17:5, 2:6, 3:7, 7:8, 8:9, 11:10}
    },
    "SCOTIA BANK" : {
        "finalName": 13,
        "finalExchange":16,
        "finalSymbol":15,
        "originalName":0,
        "originalSymbol":12,
        "infoArr":14,
        "formation": {4:0, 2:1, 3:2, 15:3, 16:4, 13:5, 5:6, 6:7, 7:8, 9:9, 10:10}
    },
    "CIBC" : {
        "finalName": 20,
        "finalExchange":23,
        "finalSymbol":22,
        "originalName":7,
        "originalSymbol":5,
        "infoArr":21,
        "formation": {18:0, 0:1, 1:2, 22:3, 23:4, 20:5, 3:6, 4:7, 8:8, 10:9, 14:10}
    },
    "NATIONAL BANK" : {
        "finalName": 13,
        "finalExchange":16,
        "finalSymbol":15,
        "originalName":7,
        "originalSymbol":5,
        "infoArr":17,
        "formation": {0:0, 2:1, 3:2, 15:3, 16:4, 13:5, 8:6, 9:7, 10:8, 11:9, 12:10}
    },
    "VIRTUAL BROKERS" : {
        "finalName": 16,
        "finalExchange":19,
        "finalSymbol":18,
        "originalName":3,
        "originalSymbol":6,
        "infoArr":17,
        "formation": {0:0, 1:1, 2:2, 18:3, 19:4, 16:5, 4:6, 5:7, 11:8, 13:9, 14:10}
    }
}


//checks whether or not an array is equal
function checkArrayEqual(arrayOne, arrayTwo){

    if(arrayOne.length == arrayTwo.length){
        for (let i = 0; i < arrayOne.length; i++) {
            if(arrayOne[i] != arrayTwo[i]){
                return false
            }
            return true
        }
    } else{
        return false
    }

}



//this converts a csv once it is uploaded into an array format so it is easy to work with
function CSVtoArray(text) {
    rows = text.split('\n')
    final = []
    for (let i = 0; i < rows.length; i++) {
        row = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        final.push(row)
    }
    return errorCase(final)
}


//takes in format of {originalIndex:newIndex}. Rearranges the function
function mapToProperFormat(currentData, args){
    final = []

    //initializes the array
    for (let i = 0; i < currentData.length; i++) {
        add = []
        for (let j = 0; j < Object.keys(args).length; j++) {
            add.push('')
        }
        final.push(add)
    }
    //maps everything out

    for (let i = 0; i < currentData.length; i++) {
        for (let j = 0; j < currentData[i].length; j++) {
            if(Object.keys(args).includes(String(j))){
                //due to the API not specifying exactly what stock exchange is from the US it defaults to US which temporarily is put as nothing
                if(currentData[i][j] == "US"){
                    final[i][args[j]]
                } else{
                    final[i][args[j]] = currentData[i][j]
                }
            }
        }
    }

    finalValue = []
    finalValue.push(header)
    for (let i = 0; i < final.length; i++) {
        finalValue.push(final[i])
    }

    return arrayToCsv(finalValue, 'test.csv', 'text/csv;encoding:utf-8')

}


//once the process is done this converts the array format into a csv and then downloads it for the user
function arrayToCsv(data, type){
    final = data.map(row =>
        row
            .map(String)
            .map(v => v.replaceAll('"', '""'))
            .map(v => `"${v}"`)
            .join(',')
    ).join('\r\n');
    return downloadBlob(final, type)
}



//this downloads the csv for the user
function downloadBlob(content, contentType) {
    today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    filename = today + "_traders_edge_"+ input.files[0]["name"]




    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);

    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
    return true
}



//this takes an argument for the ticker and descriptions and looks for options about exchange, security name, symbol and minimizes the amount of options
function filterForTickerAdvanced(ticker, description) {
    apiSearch = []

    filterSearch = []


    //checks whether or not a ticker is specified
    if(ticker) {
        $.ajax({
            url: "https://eodhistoricaldata.com/api/search/" + ticker + "?api_token=" + apiKey,
            type: "get",
            async: false,
            dataType: "json",
            success: function (res){
                for (let i = 0; i < res.length; i++) {

                    //checks whether or not this is the right ticker given by the API and it also checks that is has the supported exchange
                    if(res[i]["Code"] == ticker && Object.keys(apiFormatToSystem).includes(res[i]["Exchange"])) {
                        name = res[i]["Name"]
                        currentTicker = res[i]["Code"]
                        exchange = res[i]["Exchange"]
                        temp = [name, currentTicker, exchange]
                        apiSearch.push(temp)
                    }
                }
            }
        })


        //filters out all of the results to match the description as much as possible by using the keywords in the description
        descriptionKeywords = description.toUpperCase().trim().split(" ")
        for (let i = 0; i < apiSearch.length; i++) {
            apiSearchKeywords = apiSearch[i][0].toUpperCase().trim().split(" ")

            for (let j = 0; j < apiSearchKeywords.length; j++) {
                if(descriptionKeywords.includes(apiSearchKeywords[j])){
                    filterSearch.push(apiSearch[i])
                    break
                }
            }
        }
        final = filterSearch
    }

    //in the case the the symbol lookup didn't find anything or it was not specified this does a description search
    if (filterSearch.length == 0){
        apiSearch = []
        $.ajax({
            url: "https://eodhistoricaldata.com/api/search/" + descriptionKeywords[0] + "?api_token=" + apiKey + "&limit=50",
            type: "get",
            async: false,
            dataType: "json",
            success: function (res){
                for (let i = 0; i < res.length; i++) {

                    name = res[i]["Name"]
                    currentTicker = res[i]["Code"]
                    exchange = res[i]["Exchange"]
                    temp = [name, currentTicker, exchange]
                    if(Object.keys(apiFormatToSystem).includes(exchange)){
                        apiSearch.push(temp)
                    }
                }
            }
        })
        
        final = []
        counter = 0
        while (true) {
            for (let i = 0; i < apiSearch.length; i++) {
                apiSearchKeywords = apiSearch[i][0].toUpperCase().trim().split(" ")
                for (let j = 0; j < apiSearchKeywords.length; j++) {
                    if(descriptionKeywords.includes(apiSearchKeywords[j])) {
                        final.push(apiSearch[i])
                        break
                    }
                }
            }
            if(final.length > 0 && !checkArrayEqual(final, apiSearch)) {
                apiSearch = JSON.parse(JSON.stringify(final))
                final = []

            } else {
                break
            }



        }


    } else {
        final = filterSearch
    }



    return final
}


//in the case the user flags a certain option than this well setup everything so that the original data is set instead
function deleteWrongInfo(id, generalId) {
    importantOptions[id][generalId] = false

}




//this is where the pointer for all of the IDs of the inputs are stored so that they can be used to get the proper values
var optionPointers = {}

//this is where the optionInfo is stored globally and is used once the inputs are submitted by the user
var importantOptions = {}

//this is where the info on ticker is stored by id and can be grabbed just by id in the finalizeOptions function
var generalInfoOnTicker = {}


//this is where the type of broker is stored
var type = ""


//all of the params past optionInfo are indexes in different formats
function optionVisualizer(optionInfo, symbolIndex, originalName, originalSymbol, newInfo, typeBroker){
    type = typeBroker
    document.getElementById("inputBoxes").classList.add("d-none")
    document.getElementById("infoContainer").classList.remove("d-none")
    document.getElementById("infoHolder").innerHTML = ""
    document.getElementById("finalizeButton").setAttribute("onclick", `finalizeOptions()`)
    importantOptions = optionInfo


    //this keeps track of the ids linking certain  information about stocks so they can be easily referenced
    optionCounter = 0
    for (let i = 0; i < optionInfo.length; i++) {
        //this is the case that there
        if(optionInfo[i][newInfo]) {
            //index of info (all trading logs) : id of selector
            optionPointers[i] = "option" + i

            //this is how the option menu will look feel free to change this and sync up to your system
            //the button on the bottom is to flag a certain row in the case that the wrong details are given and it will restore to original data given
            element = `
                    <div class="row justify-content-center border" style="margin-top: 10px;">
                            <div class="col-3">
                                <p class="text-center">${optionInfo[i][originalName]}</p>
                            </div>
                            <div class="col-1"></div>
                            <div class="col-5 ">
                                <select id="${'option' + i}" class="form-control">
                                </select>
                            </div>
                            <div class="col-1">
                                <button class="btn btn-warning" onclick="deleteWrongInfo(${i}, ${newInfo})"><i class="fas fa-flag"></i></button>
                            </div>
                        </div>
                    `
            document.getElementById("infoHolder").innerHTML += element
            for (let j = 0; j < optionInfo[i][newInfo].length; j++) {
                option = document.createElement("option")
                generalInfoOnTicker[optionCounter] = optionInfo[i][newInfo][j]

                //the value matches with a certain ID that is then used to get the info of chosen option
                option.value = optionCounter

                //this orders it by security name and then then ticker, exchange
                option.innerText = optionInfo[i][newInfo][j][0] + " " + optionInfo[i][newInfo][j][1] + " " + apiFormatToSystem[optionInfo[i][newInfo][j][2]]
                if(j == 0) {
                    document.getElementById("option" + i).value = j
                }
                optionCounter++
                document.getElementById("option" + i).append(option)
            }
        }
    }
}

//this is the function activated once the finalize button is clicked
function finalizeOptions() {
    //this stored the final result
    output = []

    //this is all the indexes needed to retrieve and push proper data. These are retrieved from the finalizeInfo variable
    expectedNameIndex = finalizeInfo[type]["finalName"]
    expectedExchangeIndex = finalizeInfo[type]["finalExchange"]
    expectedSymbolIndex = finalizeInfo[type]["finalSymbol"]
    originalNameIndex = finalizeInfo[type]["originalName"]
    originalSymbolIndex = finalizeInfo[type]["originalSymbol"]
    mappingFormation = finalizeInfo[type]["formation"]
    symbolIndexArray = finalizeInfo[type]["infoArr"]



    //check how the importantOptions array looks like
    //console.log(importantOptions)
    for (let i = 0; i < importantOptions.length; i++) {
        temp = importantOptions[i]

        //checks if there is a info on ticker, if it is false that means that either no results were found on this row or the user flagged it as not matching
        if(temp[symbolIndexArray]){

            //takes the value of each selector and then matches it with the correct info retrieved from the variable generalInfoOnTicker[id]

            generalInfoOnTickerId = document.getElementById(optionPointers[i]).value

            //check how generalInfoOnTicker looks like
            //console.log(generalInfoOnTicker)


            correctSymbol = generalInfoOnTicker[generalInfoOnTickerId][1]
            correctName = generalInfoOnTicker[generalInfoOnTickerId][0]
            correctExchange = apiFormatToSystem[generalInfoOnTicker[generalInfoOnTickerId][2]]

            //it maps all of this data to the correct indexes so that the mapToProperFormat can work correctly
            temp[expectedNameIndex] = correctName
            temp[expectedExchangeIndex] = correctExchange
            temp[expectedSymbolIndex] = correctSymbol
            output.push(JSON.parse(JSON.stringify(temp)))


        //this is the case where either no result was found or the user flagged it. It then reverts to the original format
        } else {

            //maps the orginal data to the correct format
            temp[expectedNameIndex] = temp[originalNameIndex]
            temp[expectedExchangeIndex] = ""
            temp[expectedSymbolIndex] = temp[originalSymbolIndex]
            output.push(temp)
        }
    }


    //take a look at how the final output looks
    console.log(output)
    mapToProperFormat(output, mappingFormation)
}

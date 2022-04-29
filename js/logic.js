//change this in the case that other columns will be added into the new format
var header = ["Account #",	'Trade date',	'Settlement date',	'Symbol',	'Exchange',	'Security name',	'TE type',	'Broker type',	'#units',	'$price/unit',	'Amount']
const exchanges = ['TSX', 'TSXV', 'CSE', 'NASDAQ', 'NYSE', 'ARCA', 'NEO']

//ignore all variables here is not looking at the searching version
const apiFormatToSystem =  {"TO": ["TSX"], "V": ["TSXV"], "CN": ["CSE"], "US": ["US"], "NEO": ["NEO"]}
const systemToApiFormat = {"TSX":"TO", "TSXV":"V", "CSE":"CN", "US":"US", "NEO": "NEO"}
const apiKey = "625b5df8a34626.35549490"


//info that is needed when mapping out final formats
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


function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function checkExchangeCorrect(exchange){
    if(Object.keys(apiFormatToSystem).includes(exchange)){
        return {"contains": true, "tickers": apiFormatToSystem[exchange]}
    } else{
        return {"contains": false}
    }
}


function convertExchangeToApiFormat(exchange){
    return systemToApiFormat[exchange]
}

function convertExchangeFromApiFormat(exchange){
    return apiFormatToSystem[exchange]
}





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



function filterDescriptionTD(data){
    all = data.split(" ")
    finalData = ""
    for (let i = 0; i < all.length; i++) {
        if(/\d/.test(all[i])){
            break
        } else{
            finalData = finalData + " " + all[i]
        }
    }

    return finalData
}




function filterForTickerAdvanced(ticker, description) {
    apiSearch = []
    $.ajax({
        url: "https://eodhistoricaldata.com/api/search/" + ticker + "?api_token=" + apiKey,
        type: "get",
        async: false,
        dataType: "json",
        success: function (res){
            for (let i = 0; i < res.length; i++) {
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

    filterSearch = []
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


function deleteWrongInfo(id, generalId) {
    importantOptions[id][generalId] = false

}



var optionPointers = {}
var importantOptions = {}
var generalInfoOnTicker = {}
var type = ""
//all of the params past optionInfo are indexes
function optionVisualizer(optionInfo, symbolIndex, originalName, originalSymbol, newInfo, typeBroker){
    type = typeBroker
    document.getElementById("inputBoxes").classList.add("d-none")
    document.getElementById("infoContainer").classList.remove("d-none")
    document.getElementById("infoHolder").innerHTML = ""
    document.getElementById("finalizeButton").setAttribute("onclick", `finalizeOptions()`)
    importantOptions = optionInfo

    optionCounter = 0
    for (let i = 0; i < optionInfo.length; i++) {
        if(optionInfo[i][newInfo]) {
            //index of info (all trading logs) : id of selector
            optionPointers[i] = "option" + i
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
                option.value = optionCounter
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


function finalizeOptions() {
    output = []
    expectedNameIndex = finalizeInfo[type]["finalName"]
    expectedExchangeIndex = finalizeInfo[type]["finalExchange"]
    expectedSymbolIndex = finalizeInfo[type]["finalSymbol"]
    originalNameIndex = finalizeInfo[type]["originalName"]
    originalSymbolIndex = finalizeInfo[type]["originalSymbol"]
    mappingFormation = finalizeInfo[type]["formation"]
    symbolIndexArray = finalizeInfo[type]["infoArr"]



    for (let i = 0; i < importantOptions.length; i++) {
        temp = importantOptions[i]
        if(temp[symbolIndexArray]){
            generalInfoOnTickerId = document.getElementById(optionPointers[i]).value
            correctSymbol = generalInfoOnTicker[generalInfoOnTickerId][1]
            correctName = generalInfoOnTicker[generalInfoOnTickerId][0]
            correctExchange = apiFormatToSystem[generalInfoOnTicker[generalInfoOnTickerId][2]]
            temp[expectedNameIndex] = correctName
            temp[expectedExchangeIndex] = correctExchange
            temp[expectedSymbolIndex] = correctSymbol
            output.push(JSON.parse(JSON.stringify(temp)))
        } else {
            temp[expectedNameIndex] = temp[originalNameIndex]
            temp[expectedExchangeIndex] = ""
            temp[expectedSymbolIndex] = temp[originalSymbolIndex]
            output.push(temp)
        }
    }


    mapToProperFormat(output, mappingFormation)
}

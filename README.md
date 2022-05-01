CSV FILTERING with search. This is still an easy to implament project and works in a similar fashion as the previous one but now adds in the possobility of
searching for data. So for example getting any missing data like a proper security name, proper symbol, proper exchange. It then also maps it out into the
correct format. 

Before looking at the documination, I suggest taking a look at the project files as I have put a lot of comments there explaining everything, just to get familiar. 

The goal here is still to make everything as maintainable and modifiable easly through making simple and well explained code. My objective was to make it 
easily implamentable into your own system.

It follows similar steps as previously: 
1) It initializes the function based on what type is selected
2) It then converts all the data from the csv into an array
3) Next it checks for errors in the errorCase function. There is an if statement for every type which can have a unique error checking statment
in each. It can eiter return false or continue based on if the data is valid
4) Then it runs a filtering function for every specific broker in order to manipulate the data and put it into the correct format 
5) It then maps some possible options based on the given data for the security name, exchanges, and proper symbols to the given data. 
6) Once the options are mapped out they are visualized to the user and the user can choose from them
7) The user will then finalize the options and it will then take all of the data given by the user and place them into the format 
8) It then maps everything into the proper format and downloads it the user

Setting this up with your system is simalar to the previous version.
1) Go into the init.js file and change line 4 to the correct ID of the file upload input
2) Change line 4 and 14 to the correct input id where selecting all the options 
3) In the logic.js on line 8 change the api key to whatever api key you are using.
4) Feel free to add another function in between that will filter the current data I already have searched from the API with data fromy your system in order
to show the least amount of options to the user. 
6) On line 320 in logic.js change the id to which ever div the original inputs are in 
7) On line 321 in logic.js change the id to which ever div the select options are going to be in 
8) Change line 322 in logic.js to which ever id all of the rows are going to be printed to
9) On line 323 in logic.js to which ever button takes care of finalizing the user's choices
10) On logic.js past line 336 change the HTML inside of the element variable to whicher HTML you need to map out each row. Keep the same data displayed,
from the same variables and keep the same function in the flag button with the correct variables inside it. 
9) Change line 352 to which ever id the rows are going to be printed too. 

Setting up a new broker
1) Go into init.js and add the broker to the options variable. 
2) Go to the initAll function in submit.js and add a new type with the new broker name. Follow the same pattern.
3) Inside of the errorCase function add an if statment with any custom function that checks if the format of the file is correct. Return false if it the 
format is not correct and return the coresponding filtering function if it correct.
4) Create a filtering function that filters and manipulates the data by looking at each row not including the header or any of the other rows.
5) At the end of the function you can either map the data using mapToProperFormat function where you can pass in the current index of the data in each row
corresponding to the index of the row in the correct format
6) In the case that you want to go through the searching process call the function 
addOptionsToFinalFormat(info, symbolIndex, originalName, OriginalSymbol, newInfo, typeBroker. 


- info - this is where your filtered array goes 
- symbolIndex - this is where the symbol is located in each row by index 
- originalName - this is where the name given by the broker goes 
- originalSymbol - this is the same as symbolIndex I just haven't gotten rid of it yet
- newInfo - this is where the all of the options for each stock is going to be stored once the next function adds it in. You could put random value as this
- variable isn't being used as if right now. 
- typeBroker - this is where you put the name of the broker you are adding. 

7) Let the optionVisualizer function run and comment out everything in the finalizeOptions functions. Log importantOptions and based on the index in each
row add a option in the finalizeInfo variable in logic.js and correspond all of the keys with the correct indexes. Use the comments as a reference. 

Should be set up now. 


Setting up another exchange
1) On line 6 in logic.js in apiFromatToSystem add the api's naming of the key and match it towards your system's naming of the key. For example 
{"api name of key" : "your system's name of the key"} 
2) On line 7 systemToApiFormat add your system's ticker name coresponding to the naming with api. For example: {"your sysmtem's ticker name": "api ticker name"}


I hope this explains my extension well enough, if you have any questions, concerns, or criticsm please feel free to reach out to me at halkopavel@gmail.com

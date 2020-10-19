/*- getDataFromRange: This function 3 argument requried (sheet : sheet name, range : range data in sheet wanna store data, 
value : the value you wanna to store in sheet). It's not return.-*/
const setDataToStore = (range, value) => {
    SpreadsheetApp.getActive().getSheetByName('StoreData').getRange(range).setValue(value);
};

/*- getDataFromRange: This function 2 argument requried (sheet : sheet name, range : range data in sheet wanna get it). It's will return range data.-*/
const getDataFromRange = (sheetname, range) => {
    return SpreadsheetApp.getActive().getSheetByName(sheetname).getRange(range).getValue();
};

/*- isEmpty: This function 1 argument requried (text : that wanna check is emtry or null). It's will return True or False.-*/
const isEmpty = (text) => {
    return text === '' ? true : false;
};

const render = (file, argsObject) => {
    var tmp = HtmlService.createTemplateFromFile(file);
    if (argsObject) {
        var keys = Object.keys(argsObject);
        keys.forEach(function(key) {
            tmp[key] = argsObject[key];
        });
    }
    return tmp
        .evaluate()
        .setTitle('- 🕵️‍♀️ Project List -')
        .setFaviconUrl(
            'https://raw.githubusercontent.com/ggafiled/googlesheet_appscript_project_list/master/img/favicon.ico'
        );
};

const filterByValue = (string) => {
    Logger.log('[filterByValue()]: starting function.');
    const Progress = Tamotsu.Table.define({
        sheetName: 'Progress',
        rowShift: 1,
        columnShift: 0,
    });
    if (string) {
        var finalarray = Progress.where((row) => {
                return String(row['Project']).trim() !== '';
            })
            .all()
            .filter((o) =>
                Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(string.toLowerCase()))
            );
    } else {
        var finalarray = Progress.where((row) => {
            return String(row['Project']).trim() !== '';
        }).all();
    }

    // Logger.log("[filterByValue()]" + JSON.stringify(finalarray));
    return JSON.stringify(finalarray);
};

export { setDataToStore, getDataFromRange, isEmpty, render, filterByValue };
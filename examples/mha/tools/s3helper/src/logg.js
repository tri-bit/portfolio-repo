//a wrapper for console.log

const fs = require('fs');

const logDirectory = './logs';

const loggSettings = {
    isRecording:false,
    currentRecording:null,
    recordingEntryLimit:10000
}

const logg = (obj1, obj2)=> {

    const { recordingEntryLimit } = loggSettings;

    if(true) {

        if(obj2) {
            console.log(obj1, obj2);

        } else {
            console.log(obj1);
        }

        if(loggSettings.isRecording && loggSettings.currentRecording.length < recordingEntryLimit) {

            const entry = objectsToEntry([obj1,obj2])
            loggSettings.currentRecording.push(entry);

            if(loggSettings.currentRecording.length === recordingEntryLimit) {
                 loggSettings.currentRecording.push(`--${recordingEntryLimit} limit reached, recording stopped`);
            }

        }

    }

}


const loggWrite = async (objectsArray, options) => {

    const {label, suffixType, entryPrefix, addToFile } = options;

    const logLabel = label;

    if(!label || !objectsArray) {
        console.log('error, loggWrite missing properties', {label, objectsArray});
        return;
    }

    const fileName = createFileNameFromOptions(options);
    const filePath = createFilePathFromFileName(fileName);

    if(!fileName) {
        console.log('error creating filename', options);
        return;
    }

    writeToFile({contents:objectsToEntry(objectsArray, {entryPrefix}), filePath, addToFile, logLabel});

}


const loggAddToDaily = async (objectsArray, {label}) => {

    if(!label) {
        console.log('***loggAddToDaily error - missing log label');
        return;
    }

    loggWrite(objectsArray, {

        label:label,
        suffixType:'day',
        addToFile:true,
        entryPrefix:'clock',

    });

}


const createFileNameFromOptions = (options) => {

    const {label, suffixType } = options;

    let fileName = `${label}`;

    const timestamp = getTimestamp(suffixType);

    return `${fileName}_${timestamp}`;

}

const createFilePathFromFileName = fileName => `${logDirectory}/${fileName}.txt`;

const dailyTimestamp = ()=> {

    const d = new Date();
    return `${d.getMonth() + 1}_${d.getDate()}_${d.getFullYear()}`;

}

const clockTimestamp = ()=> {
    const d = new Date();
    const minutes = d.getMinutes();

    return `${d.getHours()}:${(minutes < 10 ? `0${minutes}` : minutes)}`;
}

const getTimestamp = type => {

    switch(type) {

        case 'day': {
            return dailyTimestamp();
        }

        default: {
            return new Date().getTime();
        }

    }

}



const objectsToEntry = (objectsArray, options)=> {

    const entryPrefix  = options?.entryPrefix;

    if(!objectsArray?.map) {
        console.log('error, item doesnt have map functionality, log canceled', objectsToEntry);
        return;
    }

    const entry = objectsArray.map(obj => {

        if(obj !== undefined) {
            return JSON.stringify(obj, null, 2);
        }

        return ''

    }).join(' ');

    return `${createEntryPrefix(entryPrefix)}${entry}`;

}

const createEntryPrefix = entryPrefixOption => {

    if(entryPrefixOption === 'clock') {
        return `${clockTimestamp()} `;
    }

    return '';

}

const loggStartRecording = ()=> {

    loggSettings.isRecording = true;
    loggSettings.currentRecording = [];

}

const loggStopRecording = ({label, skipFileWrite})=> {

    if(skipFileWrite) {
        return;
    }

    const logLabel = label || 'logFile'


    const toText = loggSettings.currentRecording.join('\n\n');

    if(toText) {

        const filePath = `${logDirectory}/${logLabel}_${new Date().getTime()}.txt`;
        writeToFile({contents:toText, filePath, logLabel});

    }

    loggSettings.currentRecording = [];

}

const writeToFile = async({contents, filePath, addToFile, logLabel}) => {

    if(!filePath || !contents) {
        console.log('missing logg writeToFile options', {contents, filePath});
        return;
    }

    console.log('writing to file path', filePath);

    let fileWritten = false;

    if(addToFile) {

        const exists = await fs.existsSync(filePath);

        if(exists) {

             fs.appendFile(filePath, `${contents}\n\n`, (err, results)=> {

                if(err) {
                    console.log('log write error', err)
                }

            });

        } else {


            fs.writeFile(filePath, contents, (err)=>{

                if(err) {
                    console.log('error writing log file', err);
                } else {
                    console.log('log file written', (logLabel && logLabel));
                }

            });


        }

    } else {

        fs.writeFile(filePath, contents, (err)=>{

            if(err) {
                console.log('error writing log file', err);
            } else {
                console.log('log file written', (logLabel && logLabel));
            }

        });

    }


}


module.exports = {

    logg,
    loggStartRecording,
    loggStopRecording,
    loggWrite,
    loggAddToDaily

}
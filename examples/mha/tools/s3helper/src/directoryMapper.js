
const fs = require('fs');

const {logg, loggStartRecording, loggStopRecording} = require('./logg');


const uploadMap = ({directory, originParentFolder, destinationParentFolder})=> {

    _map = [];

    const localFileMap = directoryMap({directoryFullPath:`${originParentFolder}/${directory}`});

    loggStartRecording();

    logg(`${localFileMap.length} files found`);



    localFileMap.forEach(local => {
        _map.push({
            local,
            destination:local.replace(originParentFolder, destinationParentFolder)
        })
    });


    logg('upload mapping:', {directory, originParentFolder, destinationParentFolder});
    logg('uploadMap', _map);

    loggStopRecording({label:'Upload Mapping'});

    return _map;

}

const directoryMap = ({filesOnly=true, directoryFullPath})=> {

    if(!directoryFullPath) {
        logg('fileMap error: no directory set');
        return null;
    }

    loggStartRecording();

    _mapping = [];
    _filesFound = 0;
    _directoriesFound = 0;

    const map = (path)=> {

        //logg('mapping directory path', path);

        const read = fs.readdirSync(path);

        read.forEach(r => {

            const fullPath = `${path}/${r}`;


            const check = fs.lstatSync(fullPath);
            const isDirectory = check.isDirectory();
            //logg({fullPath, isDirectory});

            if(!filesOnly) {
                _mapping.push(fullPath);
            } else if(filesOnly && !isDirectory) {
                _mapping.push(fullPath);
            }

            if(isDirectory) {

                _directoriesFound++;
                map(fullPath);

            } else {
                _filesFound++;
            }

        });

    }

    logg('mapping directory', directoryFullPath);

    map(directoryFullPath);

    logg({files:_filesFound, folders:_directoriesFound});

    logg(_mapping);

    loggStopRecording({label:'Directory Mapping'});

    return _mapping;

}

module.exports = {

    directoryMap,
    uploadMap

}
//https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const waitFor = (ms) => new Promise(r => setTimeout(r,ms));

async function asyncForEach(array, callback) {
    for(let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function asyncForEachComplete(array, callback) {
    for(let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
    return 'complete';
}

module.exports = {

    waitFor,
    asyncForEach,
    asyncForEachComplete

}
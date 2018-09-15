const {readFileSync} = require('fs');

/**
 * get file path from include statement
 * @param {String} includeString
 * @returns {string} - file path
 * @private
 */
function getFilePathFromMatch(includeString) {
    return './view/' + includeString.replace('<%- include(\'', '').replace('\'); -%>', '') + '.ejs';
}

// ----------------------------------------------------
/**
 * replace {{string}} with it passed value
 * @param {string} body
 * @param {Object} data
 * @returns {string}
 */
function mergeData(body, data) {
    const keys = Object.keys(data); // Array["longUrl", "shortUrl"]
    keys.forEach(key => {
        const value = data[key];
        console.log(`key = ${key}, value = ${value}`);
        const regex = new RegExp(`{{${key}}}`, 'g');
        body = body.replace(regex, value);
    });
    return body;
}

// ----------------------------------------------------

/**
 * get include clauses, then read included files, finally replace include statements with files contents
 * @param {String} fileContent
 * @returns {String}
 */
function replaceIncludesWithContent(fileContent) {
    const regex = /<%- include\('.+'\); -%>/;
    const matches = fileContent.match(new RegExp(regex, 'gm'));
    if (matches)
        try {
            const filesPaths = matches.map(getFilePathFromMatch);

            filesPaths.forEach(file => {
                const includeContent = readFileSync(file, 'utf-8');
                fileContent = fileContent.replace(regex, includeContent);
            });
        } catch (e) {
            console.log(e);
        }
    return fileContent;
}

module.exports = {replaceIncludesWithContent, mergeData};
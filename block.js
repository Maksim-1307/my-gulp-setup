/*

block.js version 1.0
author Maksim1307

функционал:

1) вводится команда: node block [name]
если имя не введено, выдасть ошибку

2) создать файл #src/scss/[name].scss

3) подключить в #src/style.scss: @import scss/[name].scss;

если отсутствуют эти файлы и папки, создать

4) block [name] successfuly created

*/

const fs = require('fs');

let name = process.argv[2];

const sourceFolder = "$src/";
const mainFile = sourceFolder + "scss/style.scss";
const blocksFolder = sourceFolder + "scss/blocks/";
const fileImport = "@import \"blocks/" + name + '.scss\";';

if (name) {
    let filePath = blocksFolder + name + ".scss";
    let fileContent = "." + name + "{\n\n}";

    if (!fs.existsSync(filePath)) {
        //write block file
        fs.writeFile(filePath, fileContent, (err) => {
            if (err) {
                console.log(err);
            } else {
                //include in style.scss
                fs.readFile(mainFile, (err, data) => {
                    let newData = data + '\n' + fileImport;
                    console.log(fileImport);
                    fs.writeFile(mainFile, newData, 'utf-8', function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log('block was successfully created');
                        }
                    })
                })
            }
        })
    } else {
        console.log('ERROR! A block with the same name already exsists!');
    }

} else {
    console.log('ERROR! No block name specified!');
}



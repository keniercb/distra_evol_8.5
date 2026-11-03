/**
 * Creado por Danilo Milán Araujo
 */
var fs = require('fs');
var path = require('path');
var AdmZip = require('adm-zip');
module.exports = (function() {
    /*
     * Eliminar un fichero
     * @params path String --- Ruta del fichero a ser eliminado
     * @params cb Function --- Callback a ser ejecutado cuando se elimine el fichero
     * @return void
     */
    this.eliminarFichero = function(path, cb){
        fs.unlink(path, function(err){
            if(err) {
                console.log('Error al eliminar el archivo');
                console.log(err);
                return;
            }
            if(typeof cb === 'function'){
                cb();
            }
        });
    };
    /*
     * Descomprimir un fichero
     * @params nombreZip String --- Ruta del zip a ser descomprimido
     * @params cb Function --- Callback a ser ejecutado cuando se descomprime el fichero
     * @return void
     */
    this.descomprimirFichero  = function(nombreZip, cb){
        var me = this;
        var zip = new AdmZip(nombreZip);
        var zipEntries = zip.getEntries();
        zipEntries.forEach(function(zipEntry) {
            var data = zipEntry.getData().toString('utf8');
            console.log('Archivo descomprimido correctamente');
            if(typeof cb === 'function'){
                cb(data, nombreZip);
            }

        });

    };
    /*
     * Extraer zip
     * @params pathZip String --- Ruta del zip a ser descomprimido
     * @params dirDestino String --- Ruta de la carpeta donde será descomprimido el fichero
     * @return ruta del archivo extraido
     */
    this.extraerEntryZip = function(pathZip, dirDestino){
        var result = {};
        result.msgCod = 1;
        try{
            var destino = dirDestino || path.dirname(pathZip);
            var zip = new AdmZip(pathZip);
            var zipEntries = zip.getEntries();
            var nombreEntry = zipEntries[0].entryName;
            zip.extractEntryTo(nombreEntry,destino, false, true);
            result.filename = path.normalize(destino + path.sep+ nombreEntry);
        }catch(e){
            result.msgCod = 0;
            result.error = 'errorzip';
            console.log('----Error al extraer fichero');
            console.log(e);
            if(e.toString().indexOf('unsupported zip format') != -1){
                result.error = 'unsupportedZipFormat'
            }
            if(e.toString() == 'Invalid filename'){
                result.error = 'InvalidFilename'
            }
        }
        return result;
    };
    /*
     * Extraer zip completo
     * @params pathZip String --- Ruta del zip a ser descomprimido
     * @params dirDestino String --- Ruta de la carpeta donde será descomprimido el fichero
     * @return void
     */
    this.extraerTodoZip = function(pathZip, dirDestino){
        var destino = dirDestino || path.dirname(pathZip);
        var zip = new AdmZip(pathZip);
        zip.extractAllTo(destino,true);
    };
    /*
     * Comprimir fichero a zip
     * @params filename String --- Ruta del fichero a ser comprimido
     * @params dirDestino String --- Ruta de la carpeta donde será comprimido el fichero
     * @params nombreZip String --- Nombre del zip que será creado
     * @return String --- Ruta completa del zip creado
     */
    this.comprimirArchivo = function(filename, dirDestino, nombreZip){
        var destino = dirDestino || path.dirname(filename);
        var name = nombreZip || path.basename(filename) + '.zip';
        var nameFinal = path.normalize(destino + path.sep + name);
        var zip = new AdmZip();
        zip.addLocalFile(filename);
        zip.writeZip(nameFinal);
        return nameFinal;
    };

    /*
     * Escribir datos en un archivo
     * @params filename String --- Ruta del archivo en el cual se escribirá
     * @params data String --- Datos que serán escritos
     * @params cb Function --- Callback a ser ejecutado cuando se escriba en el archivo
     * @return void
     */
    this.escribirEnFichero = function(filename, data, cb){
        fs.writeFile(filename, data, function (err) {
            if (err) {console.log('Error al escribir en el archivo');}
            if(typeof cb === 'function'){
                cb();
            }

        });
    };
    /*
     * Leer directorio
     */
    this.leerDirectorio = function(dir, cb, cbError){
        fs.readdir(dir, function(err, files){
            var archivos = [];
            if(err){
                cbError(err);
            }else{
                files.forEach(function(file){
                    if(file != '.' && file != '..'){
                        var stat = fs.statSync(dir+file);
                        if(stat.isFile()){
                            var info = {
                                'nombre':file,
                                'filesize':stat.size,
                                'lastChange': stat.ctime
                            };
                            archivos.push(info);
                        }

                    }
                });
                cb(archivos);
            }
        });
    };
    return this;
})();
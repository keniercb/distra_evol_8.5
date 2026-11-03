/**prueba11 y mirando
 * Fichero que contiene el objeto controller del componente Causa y Efecto.
 *
 * @author dtejeda
 * @version 1.0
 */
Ext.namespace('Planificacion.Sistemas');
Planificacion.Sistemas.ReportesController = Ext.extend(Planif.Base.Controller, {
    constructor: function() {
        var config = {
            labels: Planificacion.Sistemas.Etiquetas,
            globals: {
                dirImg: Planificacion.Sistemas.Imagenes
            }
        };
        this.init(config);
    },

    obtenerReporte: function(obj) {


        var me = this;

        Ext.Ajax.request({
            timeout:600000,
            url: obj.path,
            params: {
                parametros:Ext.encode(obj.baseParams),
                filtros:(obj.baseParams.confiltro)?Ext.encode(obj.baseParams.filtros):0,
            },
            success: function(response) {
                var result = response.responseText ? Ext.decode(response.responseText): null;
                var psFn = obj.successParams ? obj.successParams: null;
                if (result) {

                    obj.container.body.setStyle(
                        {
                            'background-image': 'none'
                        });

                    obj.container.body.update(result.html);
                    obj.view && obj.fnSuccess ? me.getFn(obj.view, obj.fnSuccess, result, psFn): null;
                }
            },
            failure: function (response) {
                var result = response.responseText ? Ext.decode(response.responseText): null;
                var peFn = obj.failureParams ? obj.failureParams: null;
                obj.view && obj.fnFailure ? me.getFn(obj.view, obj.fnFailure, result, peFn): null;
            }
        });
    },

    getFn : function (view, nameFn, result, pFn){

        if (view[nameFn]) {
            return view[nameFn].createDelegate(view,[view], true)(result, pFn, this);
        }
        return null;
    },

    /**
     * Función para crear tipo de gráfico deseado
     * @copyright XETID Cuba
     * @author Ing Dasley Tejeda Puentes
     * @param url: Url de la imagen a convertir
     * @param outputFormat: Formato de salida de la imagen
     * @param output: Formato de salida de la respuesta {base64 | image}
     * @param width: Ancho de la imagen cuando {output = image}
     * @param height: Largo de la imagen cuando {output = image}
     *
     * Formatos de entrada compatibles
     * image/png - image/jpeg - imagen/jpg - imagen/gif - imagen/gif - imagen/bmp -
     * image/tiff - image/x-icon - image/svg+xml - imagen/webp

     *Formatos de salida
     * image/png - image/jpeg -imagen/webp (chrome)
     */

    convertImageToBase64 : function (url, outputFormat, output, width, height, variable) {

        var base64 = '';
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var image = new Image;
        image.crossOrigin = 'Anonymous';
        image.src = url;

        image.onload = onLoad = setInterval(function() {

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);
            base64 = canvas.toDataURL(outputFormat);

            if (base64) {
                if (output == 'base64' || output == '' || !output) {

                    variable = base64;
                } else {
                    variable = '<img style= width:' + (width ? width + 'px' : canvas.width + 'px') +
                    '; height:' + (height ? height + 'px' : canvas.height + 'px') + '; src=' + base64 + ' />';
                }
            } else {
                clearInterval(onLoad);
            }


        }, 5);


    }

});



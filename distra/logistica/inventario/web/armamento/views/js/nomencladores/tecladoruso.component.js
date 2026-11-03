/**
 * Created by W-01223 on 13/02/15.
 */
Ext.ns('Ext.erp');

Ext.erp.tecladoruso = Ext.extend(Ext.Panel, {

    constructor: function (config) {
        var _this = this;
        var fecha = new Date();
        this.alfabeto = Array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'Й', 'К', 'Л',
                    'М','И', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш',
                    'Щ', 'Ъ', 'Э', 'Ю', 'Я');
        this.tecladoRuso = _this.getColumnas(this.alfabeto, 5, 7, this);
        config.title = 'Alfabeto ruso';
        config.frame = true;
        config.items =[{layout:'column', items:this.tecladoRuso}] ;

        Ext.erp.tecladoruso.superclass.constructor.call(this, config);
    },

    getColumnas: function (listado, col, fil, ventanaPrincipal) {
        var _this = this;
        var columnas = Array();
        var cont = 0;
        var texto = '';
        for (var i = 0; i < col; i++) {
            var arreglo = Array();
            for (var j = 0; j < fil; j++) {
                var texto = listado[cont++];
                if (texto && texto.length > 0)
                    arreglo.push({
                        xtype: 'button',
                        id: texto,
                        text: texto,
                        style: 'margin-top:3px; margin-left:3px',
                        minWidth: 33,
                        handler: function () {
                            _this.escribir(this.text, ventanaPrincipal)
                        }
                    });
                else {
                    arreglo.push({
                        xtype: 'panel'
                    });
                }
            }

            columnas.push({
                layout: 'form',
                columnWidth: .20,
                items: arreglo
            })

        }
        return columnas;
    },
    escribir: function (bt, ventanaPrincipal) {
        ventanaPrincipal.principal.fpGestionarNomenclador.items.items[0].regex = /^[\w\s\-\/ñÑ/áéíóúАБВГДЕЁЖЗЙКЛМИНОПРСТУФХЦЧШЩЪЭЮЯ]+$/;
        ventanaPrincipal.principal.fpGestionarNomenclador.items.items[0].setValue(ventanaPrincipal.principal.fpGestionarNomenclador.items.items[0].getValue() + bt);
    }
});







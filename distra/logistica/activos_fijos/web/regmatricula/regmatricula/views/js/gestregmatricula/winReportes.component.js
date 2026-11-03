/**
 * Created by yoendy on 4/21/2015.
 */

Ext.ns('Ext.aft.gestregmatricula');

Ext.aft.gestregmatricula.VentanaReporte = Ext.extend(Ext.Window, {
    constructor:function(config){
        Ext.apply(this, config);
        var _this = this;
        this.resizable = false;
        this.modal = true;
        this.width = 320;
        this.autoHeight = true;
        this.title = 'Seleccionar reporte';
        this.buttons = [
            {
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                text: "Cancelar",
                tooltip: 'Cerrar ventana',
                handler: function() {
                    _this.close();
                }
            },
            {
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                text: 'Aceptar',
                tooltip: 'Configurar el reporte seleccionado',
                handler: function () {
                   /* var funcion = _this.storeTipoReporte.getAt(_this.storeTipoReporte.find('id', _this.cmbTipoReporte.getValue())).get('funcion');
                    var report = new Ext.erp.LogisticaReport({});
                    report.showReport(funcion, {
                        iddocumento: _this.iddocumento,
                        aprobadopor: _this.aprobadopor,
                        operacion: _this.operacion,
                        entidad: _this.entidad
                    });*/
                     if (_this.frmReporte.getForm().isValid()) {
                       /* var vent = new Ext.util.ReportsAFT({
                            urlAction: 'reporte',
                            report: _this.cmbTipoReporte.getValue(),
                            formatos:(_this.cmbTipoReporte.getValue()=='ReporteLicenciaCirculacion')?[['pdf', 'PDF'],
                                ['html', 'HTML']]: [['pdf', 'PDF'], ['rtf', 'Word'], ['html', 'HTML']],
                            method: 'getQuery' + _this.cmbTipoReporte.getValue(),
                            filters: {
                                idregnumerico: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.idregnumerico : null,
                                direccion: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.direccion : null,
                                moneda: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.moneda : null,
                                poseedorlegal: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.poseedorlegal : null,
                                municipio: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.municipio : null,
                                provincia: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.provincia : null
                            }
                        });
                        vent.show()*/
                        var has = _this.smGrid.hasSelection();
                        var record = _this.smGrid.getSelected();
                        var report = new Distra.util.report.ReportView({
                            reportList: [
                                {
                                    name: 'Vista principal',
                                    params: {
                                        idregnumericoactivo: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.idregnumerico : null,
                                        direccion: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.direccion : null,
                                        moneda: (_this.smGrid.hasSelection()) ? _this.smGrid.getSelected().data.moneda : null,
                                        poseedorlegal: (_this.smGrid.hasSelection()) ? Ext.aft.gestregmatricula.utf8_encode(_this.smGrid.getSelected().data.poseedorlegal) : null,
                                        municipio: (_this.smGrid.hasSelection()) ? Ext.aft.gestregmatricula.utf8_encode(_this.smGrid.getSelected().data.municipio) : null,
                                        denomtipotramite: (_this.smGrid.hasSelection()) ?Ext.aft.gestregmatricula.utf8_encode(_this.smGrid.getSelected().data.denomtipotramite) : null,
                                        provincia: (_this.smGrid.hasSelection()) ? Ext.aft.gestregmatricula.utf8_encode(_this.smGrid.getSelected().data.provincia) : null,
                                        idestructura: _this.idestructura,
                                        entidad: _this.entidad

                                    },
                                    dirReports: '/distra/logistica/activofijo/Registro_matricula/' + _this.cmbTipoReporte.getValue()
                                }
                            ]
                        });

                        report.view();

                    } else {
                        mostrarMensaje(1, 'Debe seleccionar un reporte.');

                    }


                }
            }

        ];
        _this.storeTipoReporte = new Ext.data.SimpleStore({
               fields: [
                   'id',
                   'nombre'
                ],
            data:[
                ['ReporteModeloTramite', 'Modelo de tr\xe1mites'],
                ['ReporteComprobanteExistencia','Comprobante de existencia de anexo nº1'],
                ['ReporteLicenciaCirculacion','Licencia de circulaci\xf3n'],
                ['ReporteComprobanteConversion','Comprobante de conversi\xf3n'],
                ['ReporteComprobanteExistenciaAdos','Comprobante de existencia de anexo nº2'],
                ['ReporteComprobanteBajas','Comprobante de carros bajas'],
            ]
        });

        this.cmbTipoReporte = new Ext.form.ComboBox({
            fieldLabel:'Tipos de reportes',
            hiddenName: 'id',
            valueField: 'id',
            displayField: 'nombre',
            store: _this.storeTipoReporte,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            allowBlank:false,
            mode: 'local',
            width: 250,
            emptyText: 'Seleccione...',
            editable: false
        });
        if (Ext.LOG.gestregmatricula.vistaactiva == "VEHICULOOPR") {
            this.cmbTipoReporte.setValue('ReporteLicenciaCirculacion');
            this.cmbTipoReporte.disable();
        }
        this.frmReporte = new Ext.form.FormPanel({
            frame: true,
            labelAlign: 'top',
            items: [_this.cmbTipoReporte]
        });
        this.items = [_this.frmReporte];

        Ext.aft.gestregmatricula.VentanaReporte.superclass.constructor.apply(this, arguments);
    }
});

Ext.aft.gestregmatricula.utf8_encode = function(argString) {
    //  discuss at: http://phpjs.org/functions/utf8_encode/
    // original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: sowberry
    // improved by: Jack
    // improved by: Yves Sucaet
    // improved by: kirilloid
    // bugfixed by: Onno Marsman
    // bugfixed by: Onno Marsman
    // bugfixed by: Ulrich
    // bugfixed by: Rafal Kukawski
    // bugfixed by: kirilloid
    //   example 1: utf8_encode('Kevin van Zonneveld');
    //   returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if ((c1 & 0xF800) != 0xD800) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if ((c1 & 0xFC00) != 0xD800) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if ((c2 & 0xFC00) != 0xDC00) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

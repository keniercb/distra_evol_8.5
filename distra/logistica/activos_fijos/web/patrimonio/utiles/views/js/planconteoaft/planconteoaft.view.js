Ext.ns('LOG.lb.planconteoaft');

LOG.lb.planconteoaft.View = Ext.extend(LOG.lb.gestplanconteo.View, {
    constructor: function (config) {
        var _this = this;
        this.modoSeleccion = 1;
        this.autoShow = false;
        this.busquedaBasica = true;
        this.idayuda = 'idplanconteoaft';
        _this.identidad = "";
        _this.entidad = "";
        this.subsistema = LOG.util.Subsistemas.activosfijos;
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/gestplanconteoaft/getentidad',
            method: 'POST',
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.datos.identidad;
                _this.entidad = rd.datos.entidad;


            }

        });
        LOG.lb.planconteoaft.View.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        this.addGridColumn({
            dataIndex: 'idplan',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idejercicio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idplanconteom',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'estadoplan',
            hidden: true
        });
        this.addGridColumn({
            header: 'Plan de conteo',
            dataIndex: 'nbejercicio',
            default: true,
            agrupador: true,
            hidden: true
        });
        this.addGridColumn({
            header: this.idioma.cgPeriodo,
            width: 120,
            dataIndex: 'idperiodo',
            default: true,
            renderer: function (v) {
                return LOG.lb.meses.Periodos[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPorciento,
            width: 120,
            dataIndex: 'porciento',
            default: true,
            editor: new LOG.util.Prototipos.inputEntero({
                allowBlank: false,
                maxValue: 100,
                minValue: 1,
                invalidText: this.idioma.porcietoNoPermitido,
                validator: function (v) {
                    if (this.gridEditor.record.data.estado != 'Elaboración')
                        return false;
                    else
                        return true;
                }
            })
        });
        this.addGridColumn({
            header: this.idioma.cgCreadoPor,
            width: 120,
            dataIndex: 'usuario',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgAprobadoPor, width: 120,
            dataIndex: 'usuarioaprobado', default: true
        });
    },
    render: function (config) {
        var _this = this;
        this.listaBotones.getItem(6).handler =
            function () {
                if (_this.getStorePrincipal().getCount()>0) {
                    var report = new Distra.util.report.ReportView({
                        reportList: [
                            {
                                name: 'Vista principal',
                                params: {
                                    idestructuracomun: _this.idDeposito,
                                    idestructura: _this.identidad,
                                    idejercicio: _this.getStorePrincipal().getAt(0).data.idejercicio,
                                    arearesponsabilidad: _this.utf8_encode(_this.nomDeposito)
                                },
                                dirReports: '/distra/logistica/activofijo/planconteo/PlanConteo',
                                detailFirma: {}
                            }
                        ]
                    }).view();
                }else{
                    mostrarMensaje(1, "No hay datos que imprimir.");
                }

            };
        LOG.lb.planconteoaft.View.superclass.render.call(this, config);

    },
    utf8_encode: function (argString) {
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
    }


});
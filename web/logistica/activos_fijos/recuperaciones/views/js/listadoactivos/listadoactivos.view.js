/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.listadoactivos');
LOG.aft.listadoactivos.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadoactivos';
        config.urlBusquedaGridPrincipal = 'getListadoActivos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;

        config.filters = null;


        Ext.apply(this, config);
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadoactivos.Idioma, LOG.util.Idioma);
        LOG.aft.listadoactivos.view.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            //autoExpand: true,
            dataIndex: 'denominacion',
            width: 250,
            default: true,
            isFiltroBusqueda: true,
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: 'Nro. Inventario',
            width: 100,
            dataIndex: 'nroinventario',
            default: true,
            isFiltroBusqueda: true,
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: "Grupo",
            width: 100,
            default: true,
            isFiltroBusqueda: true,
            dataIndex: 'descripciongrupo',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',
                valueField: 'idgruposubgrupo',
                displayField: 'denominacion',
                dataIndex: 'descripciongrupo',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getgrupossubgrupos',
            }
        });

        this.addGridColumn({
            header: 'Area de responsabilidad',
            width: 150,
            isFiltroBusqueda: true,
            default: true,
            dataIndex: 'deposito',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',
                valueField: 'iddeposito',
                displayField: 'deposito',
                dataIndex: 'deposito',
                url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
            }
        });

        this.addGridColumn({
            header: 'Centro de costo',
            width: 150,
            isFiltroBusqueda: true,
            default: true,
            dataIndex: 'centrocosto',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',
                valueField: 'idcentrogrupo',
                displayField: 'text',
                dataIndex: 'centrocosto',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getcentroscostos'
            }
        });

        this.addGridColumn({
            header: 'Responsable',
            width: 120,
            isFiltroBusqueda: true,
            dataIndex: 'responsable',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',
                valueField: 'idresponsable',
                displayField: 'responsable',
                dataIndex: 'responsable',
                url: '/logistica/activos_fijos/recuperaciones/index.php/submayor/getResponsables'
            }
        });

        this.addGridColumn({
            header: 'Naturaleza',
            dataIndex: 'naturaleza',
            sortable: true,
            isFiltroBusqueda: true,
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',
                valueField: 'idnaturaleza',
                displayField: 'denominacion',
                dataIndex: 'naturaleza',
                url: '/configuracion/nomgenerales/index.php/nomencladoresgenerales/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza'
            }
        });


        this.addGridColumn({
            header: 'Fecha última dep.',
            width: 100,
            isFiltroBusqueda: true,
            dataIndex: 'fechaultimadep',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'date',
                dataIndex: 'fechaultimadep'
            }
        });

        this.addGridColumn({
            header: 'Ultima depreciación',
            width: 100,
            isFiltroBusqueda: true,
            dataIndex: 'ultimadepreciacion',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'numeric',
                dataIndex: 'ultimadepreciacion'
            }
        });

        this.addGridColumn({
            header: "Método",
            width: 100,
            default: true,
            isFiltroBusqueda: true,
            dataIndex: 'metodo',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'combo',

                valueField: 'idmetodo',
                displayField: 'descripcion',
                dataIndex: 'metodo',
                url: '/logistica/activos_fijos/depreciacion/index.php/gestdepreciacion/getmetodosentidad'
            }
        });

        this.addGridColumn({
            header: 'Tasa',
            width: 50,
            isFiltroBusqueda: true,
            dataIndex: 'tasafiscal',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'numeric',
                dataIndex: 'tasafiscal'
            }
        });

        this.addGridColumn({
            header: 'Valor',
            width: 70,
            isFiltroBusqueda: true,
            dataIndex: 'valorcontable',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontable'
            }
        });

        this.addGridColumn({
            header: 'Dep. acum',
            width: 110,
            isFiltroBusqueda: true,
            dataIndex: 'depreciacionacumulada',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumulada'
            }
        });

        this.addGridColumn({
            header: 'Valor residual',
            width: 110,
            isFiltroBusqueda: true,
            dataIndex: 'valorresidual',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>' + value + '</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>' + value + '</span></b>';
                }
            },
            filter: {
                type: 'numeric',
                dataIndex: 'valorresidual'
            }
        });

        this.addGridColumn({
            header: 'Totalmente dep.',
            width: 90,
            dataIndex: 'depreciado',
            renderer: function (value, metaData, r) {
                if (+r.json.depreciado == 1) {
                    return '<b><span style="color:#FF5154";>SI</span></b>';
                } else {
                    return '<b><span style="color:#22BB11";>NO</span></b>';
                }
            },
            filter: {
                type: 'list',
                options: [
                    [1, 'SI'],
                    [2, 'NO']
                ],
                dataIndex: 'depreciado'
            }
        });



        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            default: false
        });
    },
    initDefaultButtons: function () {

        var _this = this;
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            handler: function () {
                _this.getReporte();
            }

        });
        this.addToolbarButton(_this.btnImprimir);
        this.listaBotones.add('->');
    },
    getReporte: function () {

        var _this = this;

        var idestructura = _this.getStorePrincipal().getAt(0).data.idestructura;
        //Ext.Msg.wait(_this.idioma.lbWaitMsgConf, _this.idioma.lbWaitTitle);


        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: {
                        idestructura: idestructura,

                    },
                    //dirMaskReports: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosDepreciados_1',
                    dirReport: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosDepreciados',
                    detailFirma: {}
                }
            ]
        });
        report.view();
    }
});

LOG.aft.listadoactivos.utf8_encode = function (argString) {
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
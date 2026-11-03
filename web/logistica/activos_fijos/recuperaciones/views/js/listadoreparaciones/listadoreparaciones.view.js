/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.listadoreparaciones');
LOG.aft.listadoreparaciones.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadoreparaciones';
        config.urlBusquedaGridPrincipal = 'getListadoReparaciones';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        Ext.apply(this, config);
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadodocumentos.Idioma, LOG.util.Idioma);
        LOG.aft.listadoreparaciones.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: "\xba. serie",
            width: 150,
            dataIndex: 'nroserie',
            default: true
        });
        this.addGridColumn({
            header: "Marca-Modelo",
            width: 150,
            dataIndex: 'descripcionmarcamodelo',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 160,
            dataIndex: 'denominacion',
            default: true
        });

        var valorAdq = 'Valor de adquisici\xf3n';
        this.addGridColumn({
            header: (alternativa) ? valorAdq +' '+ nommonedacontable : valorAdq,
            width: 120,
            dataIndex: 'valoradquisicion',
            default: true
        });
        this.addGridColumn({
            header: (alternativa) ? valorAdq +' '+ nommonedaalternativa : valorAdq,
            width: 120,
            hidden: (alternativa) ? false : true,
            dataIndex: 'valoradquisicionalternativo',
            default: true
        });

        var valorCont = 'Valor contable';
        this.addGridColumn({
            header: (alternativa) ? valorCont +' '+ nommonedacontable : valorCont,
            width: 120,
            dataIndex: 'valorcontable',
            default: true,
            renderer : function(_v, _mD, _r) {
                if(parseFloat(_v) == parseFloat(_r.data.valoradquisicion))
                    _v = parseFloat(_r.data.valoradquisicion - _r.data.depreciacionacumulada).toFixed(6);
                else
                    _v = parseFloat(_v - _r.data.depreciacionacumulada).toFixed(6);
                return _v;
            }
        });
        this.addGridColumn({
            header: (alternativa) ? valorCont +' '+ nommonedaalternativa : valorCont,
            width: 120,
            hidden: (alternativa) ? false : true,
            dataIndex: 'valorcontablealternativo',
            default: true,
            renderer : function(_v, _mD, _r) {
                if(parseFloat(_v) == parseFloat(_r.data.valoradquisicionalternativo))
                    _v = parseFloat(_r.data.valoradquisicionalternativo - _r.data.depreciacionacumuladaalternativo).toFixed(6);
                else
                    _v = parseFloat(_v - _r.data.depreciacionacumuladaalternativo).toFixed(6);
                return _v;
            }
        });

        this.addGridColumn({
            header: _this.idioma.cgEstado,
            width: 120,
            dataIndex: 'denomestadotecnico',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.cgArea,
            width: 250,
            dataIndex: 'area',
            default: false
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
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            handler: function () {
                _this.getReporte();
            }

        }));
    },
    getReporte: function () {
        var _this = this;
        var arrayIdregnumericos = _this.getStorePrincipal().collect('idregnumerico');
        var idestructura = _this.getStorePrincipal().getAt(0).data.idestructura;
        /*
         * Variables globales para la dualidad de moneda
         * VARIABLES                    CONCEPTOS
         * alternativa                  True o False si existe dualidad
         * monedacontable               idmonedacontable
         * nommonedacontable            Nombre moneda contable
         * monedaalternativa            idmonedaalternativa
         * nommonedaalternativa         Nombre moneda alternativa
         * */

        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: {
                        idestructura: idestructura,
                        arrayidregnumerico: "{" + arrayIdregnumericos + "}"
                    },
                    dirReport: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosReparados',
                    detailFirma: {}
                }
            ]
        }).view();
    }
});
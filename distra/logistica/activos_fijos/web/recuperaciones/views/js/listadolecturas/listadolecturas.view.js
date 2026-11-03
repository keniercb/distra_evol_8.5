/**
 * Created by yoendy on 8/28/2017.
 */
Ext.ns('LOG.aft.listadolecturas');
LOG.aft.listadolecturas.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadolecturas';
        config.urlBusquedaGridPrincipal = 'getListadoLecturas';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadolecturas.Idioma, LOG.util.Idioma);
        LOG.aft.listadolecturas.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'denidentificador',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'valoridentificador',
            default: false
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 150,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true,
            agrupador: true
        });
        this.addGridColumn({
            header: _this.idioma.cgIdentificador,
            width: 150,
            dataIndex: 'valoridentificador',
            default: true,
            renderer: function (value, metaData, record) {
                if (value != null) {
                    return '<p><b>' + record.data.denidentificador + ": </b>" + value;
                }
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgFecha,
            width: 160,
            dataIndex: 'fecha',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCantRecursoConsumido,
            width: 150,
            dataIndex: 'cantidadrecursoconsumido',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgLecturaRecursoConsumido,
            width: 150,
            dataIndex: 'lecturarecurso',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgRecursoConsumido,
            width: 150,
            dataIndex: 'cantidad',
            autoExpand: true,
            default: false
        });

        this.addGridColumn({
            header: _this.idioma.lbCmNorma,
            width: 150,
            dataIndex: 'normacombustible',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCmEnDeposito,
            width: 50,
            dataIndex: 'endeposito',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbCmCantEntregada,
            width: 50,
            dataIndex: 'cantentregadacomb',
            default: true
        });
        this.addGridColumn({
            header: 'Consumo',
            width: 150,
            dataIndex: 'consumo',
            default: true
        });


        this.addGridColumn({
            id: 'idregnumericoactivo',
            dataIndex: 'idregnumericoactivo'
        });
        this.addGridColumn({
            id: 'idrecursoregnumericoactivo',
            dataIndex: 'idrecursoregnumericoactivo'
        });
       /* this.addGridColumn({
            header: _this.idioma.cgDepreciacion,
            width: 120,
            dataIndex: 'depreciacionacumulada',
            default: true
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
            dataIndex: 'idarearesp',
            renderer: function (value, meta, record) {

                return _this.arrayDepositos[value];
            },
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: false
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            default: false
        });*/

    },
    render: function (config) {
        var vista = LOG.aft.listadolecturas.view.superclass.render.call(this);
        var _this = this;
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {

            }
            if (e == 'load') {
                if (_this.storePrincipal.getCount() == 0) {
                    _this.btnImprimir.disable();
                } else {
                    _this.btnImprimir.enable();
                }
            }
        });

        return vista;
    },
    initDefaultButtons: function () {
        var _this = this;
        /*this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReporte();
            }

        });*/
        _this.btnImprimirCombust = {
            text: _this.idioma.btnCombustible,
            //disabled: true,
            iconCls: 'crearreporte',
            handler: function () {
                _this.getReporte('ReporteListadoLecturasComb');
            }

        };
        _this.btnImprimirKm = {
            text: _this.idioma.btnKm,
            //disabled: true,
            iconCls: 'crearreporte',
            handler: function () {
                _this.getReporte('ReporteListadoLecturas');
            }

        };
        this.btnImprimir = {
            text: _this.idioma.ttImprimir,
            //tooltip:' _this.idioma.btnReportes',
            disabled: true,
            iconCls: 'crearreporte',
            menu: [_this.btnImprimirCombust, _this.btnImprimirKm],
            controlFn: function (b, _caller) {
                b.enable();
            }
        };
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir(_this.btnImprimir));
        this.listaBotones.add('->');
        this.listaBotones.add('-');
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idListadoLecturas'}));

    },
    getReporte: function (reporte) {

        var _this = this;
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    params: {

                    },
                    //dirMaskReports: '/distra/logistica/activofijo/Recuperaciones/ReporteActivosDepreciados_1',
                    dirReport: '/distra/logistica/activofijo/Recuperaciones/'+reporte,
                    detailFirma: {}
                }
            ]
        }).view();

    }
});
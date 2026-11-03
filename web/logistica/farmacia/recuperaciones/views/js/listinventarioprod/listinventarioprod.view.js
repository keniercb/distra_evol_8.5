Ext.ns('LOG.farm.listinventarioprod');

LOG.farm.listinventarioprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listinventarioprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listinventarioprod.Idioma);
        LOG.farm.listinventarioprod.view.superclass.constructor.call(this, config);

    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'naturaleza',
            header:'Naturaleza',
            width: 130,
            agrupador: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 300,
            dataIndex: 'denominacion',
            default: true,
            autoExpand:true
        });
        this.addGridColumn({
            header: _this.idioma.cgUEmb,
            width: 150,
            dataIndex: 'uemb',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgExistencia,
            width: 120,
            dataIndex: 'existencia',
            default: true
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioCosto,
            width: 120,
            dataIndex: 'preciocosto',
            default: true
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioVenta,
            width: 120,
            dataIndex: 'precioventa',
            default: true
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteVenta,
            width: 120,
            dataIndex: 'precioventa',
            default: true,
            renderer(v, m, _r){
                return (v *_r.data.existencia) || 0.0
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteCosto,
            width: 120,
            dataIndex: 'preciocosto',
            default: true,
            renderer(v, m, _r){
                return (v *_r.data.existencia) || 0.0
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgLote,
            width: 120,
            dataIndex: 'lote',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgCantidad,
            width: 120,
            dataIndex: 'cantidad',
            default: true,
            renderer(v, _mD, _r){
                return v || 0
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgFechaVen,
            width: 120,
            dataIndex: 'fechavencimiento',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDeposito,
            width: 150,
            dataIndex: 'deposito',
            default: true
        });
    },
    render:function(config){
        var vista = LOG.farm.listinventarioprod.view.superclass.render.call(this);
        var _this = this;
        this.storePrincipal.fireEvent = this.storePrincipal.fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {

            }
            if (e == 'load') {
                (_this.storePrincipal.getCount() == 0 )?_this.btnImprimir.disable():_this.btnImprimir.enable()
            }
        });

        return vista;
    },
    initDefaultButtons: function () {
        var _this = this;
        this.btnImprimir = new LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            disabled:true,
            handler: function () {
                _this.getReporte();
            }

        });
        this.addToolbarButton(_this.btnImprimir);

        this.listaBotones.add('->');
        this.listaBotones.add('-');
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistinventarioprod'}));

    },
    getReporte: function () {

        var _this = this;
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: {
                        idestructura: idestructura
                    },
                    dirReport: '/distra/logistica/farmacia/recuperaciones/InventarioProducto',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});
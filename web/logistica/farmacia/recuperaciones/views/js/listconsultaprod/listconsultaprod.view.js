Ext.ns('LOG.farm.listconsultaprod');

LOG.farm.listconsultaprod.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listconsultaprod';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listconsultaprod.Idioma);
        LOG.farm.listconsultaprod.view.superclass.constructor.call(this, config);

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
            width: 150,
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
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMaximo,
            width: 150,
            dataIndex: 'maximo',
            default: true
        }, '0,000'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgMinimo,
            width: 150,
            dataIndex: 'minimo',
            default: true
        }, '0,000'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgFondo,
            width: 150,
            dataIndex: 'porfondofijo',
            default: true,
            renderer(v, _mD, _r){
                return (v *_r.data.maximo)/100 || 0.0
            }
        }, '0,000'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgExistencia,
            width: 150,
            dataIndex: 'existencia',
            default: true,
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgRetenido,
            width: 150,
            dataIndex: 'retenidos',
            default: true,
            renderer(v, _mD, _r){
                return v && Math.round(v)
            }
        }, '0,000.00'));


    },
    render:function(config){
        var vista = LOG.farm.listconsultaprod.view.superclass.render.call(this);
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
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistconsultaprod'}));

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
                    dirReport: '/distra/logistica/farmacia/recuperaciones/ConsultaProducto',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});
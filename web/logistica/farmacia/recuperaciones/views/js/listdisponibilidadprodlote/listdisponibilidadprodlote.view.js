Ext.ns('LOG.farm.listdisponibilidadprodlote');

LOG.farm.listdisponibilidadprodlote.view = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        config.dirController = '/logistica/farmacia/recuperaciones/index.php/listdisponibilidadprodlote';
        config.urlBusquedaGridPrincipal = 'getDatos';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.textBusquedaSimple = "L\xednea de producto";
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        this.tipoVista = 1;
        Ext.apply(this, config);
        this.idioma = Object.assign({}, LOG.farm.Recuperaciones.Idioma, LOG.util.Idioma, LOG.farm.listdisponibilidadprodlote.Idioma);
        LOG.farm.listdisponibilidadprodlote.view.superclass.constructor.call(this, config);

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
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgExistencia,
            width: 150,
            dataIndex: 'cantidad',
            default: true,
            renderer(v, _mD, _r){
                return v
            },
            filter:{
                type:'numeric',
                dataIndex:'cantidad'
            }
        }, '0,000.00'));
        this.addGridColumn({
            header: _this.idioma.cgLote,
            width: 150,
            dataIndex: 'lote',
            default: true
        });
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgCantidad,
            width: 150,
            dataIndex: 'cantidadlote',
            default: true,
            renderer(v, _mD, _r){
                return v || 0
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioCosto,
            width: 150,
            dataIndex: 'preciocosto',
            default: true,
            filter:{
                type:'numeric',
                dataIndex:'preciocosto'
            },
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgPrecioVenta,
            width: 150,
            dataIndex: 'precioventa',
            default: true,
            filter:{
                type:'numeric',
                dataIndex:'precioventa'
            },
            renderer(v, _mD, _r){
                return v
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteCosto,
            width: 150,
            dataIndex: 'importecosto',
            default: true,
            renderer(v, _mD, _r){
                return (_r.data.preciocosto *_r.data.cantidad) || 0.0
            },
            filter:{
                type:'numeric',
                dataIndex:'importecosto'
            }
        }, '0,000.00'));
        this.addGridColumn(LOG.util.Prototipos.createColumn({
            header: _this.idioma.cgImporteVenta,
            width: 150,
            dataIndex: 'importeventa',
            default: true,
            renderer(v, _mD, _r){
                return (_r.data.precioventa *_r.data.cantidad) || 0.0
            },
            filter:{
                type:'numeric',
                dataIndex:'importeventa'
            }
        }, '0,000.00'));


    },
    render:function(config){
        var vista = LOG.farm.listdisponibilidadprodlote.view.superclass.render.call(this);
        var _this = this;
        this.gridFilter.tfBusqueda.addClass('form-control');
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
        this.listaBotones.add(LOG.util.Prototipos.botonAyuda({id: 'idlistdisponibilidadprodlote'}));

    },
    getReporte: function () {

        let _this = this;
        let filtros = _this.getGridPrincipal().filters.getFilterData(),
            params = {idestructura:idestructura, iddeposito:_this.comboDeposito.getValue(),criterio:_this.gridFilter.tfBusqueda.getValue()};
        filtros.map((objeto)=>{
            params[objeto.field+objeto.data.comparison] = objeto.data.value;
        });
        var report = new LOG.util.Report({
            reports: [
                {
                    name: 'Vista principal',
                    isList: true,
                    params: {
                        idestructura: idestructura,
                        iddeposito:_this.comboDeposito.getValue(),
                        criterio: _this.gridFilter.tfBusqueda.getValue()
                    },
                    dirReport: '/distra/logistica/farmacia/recuperaciones/DisponibilidadProductosLotes',
                    detailFirma: {}
                }
            ]
        }).view();

    }
});
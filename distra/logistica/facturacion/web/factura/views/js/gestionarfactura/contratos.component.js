Ext.ns('LOG.fact');
LOG.fact.contratos = Ext.extend(LOG.util.Window, {
    _parent: undefined,
    constructor: function(config) {
        this.idioma = config.idioma;
        this.constrain = true;
        this.idcliente = config.idcliente || null;
        LOG.fact.contratos.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        var _this = this;
        var config = {
            layout: 'border',
            modal: true,
            closeAction: 'hide',
            width: 700,
            frame: true,
            height: 400,
            items: _this.createItems()
        };
        Ext.apply(this, config);
        LOG.fact.contratos.superclass.initComponent.call(this, arguments);
    },
    createItems: function () {
        var _this = this;
        if(_this.servicios) {
            _this.pGdList = new LOG.fact.GridServicios({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcontrato: _this.idcontrato,
                //filter: _this.filter,
                concepto: _this.idioma.conceptoServicios,
                textBusquedaSimple: _this.idioma.fdCriterio
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        } else if(_this.productos){
            _this.pGdList = new LOG.fact.GridProductos({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcontrato: _this.idcontrato,
                //filter: _this.filter,
                concepto: _this.idioma.conceptoServicios,
                textBusquedaSimple: _this.idioma.fdCriterio
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        }else{
            _this.pGdList = new LOG.fact.GridContratos({
                region: 'center',
                idioma: _this.idioma,
                url: _this.urlAction,
                frame: true,
                idcliente: _this.idcliente,
                //filter: _this.filter,
                concepto: _this.idioma.lbconceptocontrato,
                textBusquedaSimple: _this.idioma.cmnumerocontrato
                //iddocumento: _this._parent.scope.modelo.iddocumento
            });
        }
        _this.pGdList.init();
        return _this.pGdList.view();
    },
    aceptarFn: function () {


    },
    postSalvar: function (r, a) {

    }
});

LOG.fact.GridContratos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.idcliente = config.idcliente || -1;
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarContratos';

        LOG.fact.GridContratos.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idcontrato',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idclienteproveedor',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmnumerocontrato,
            width: 150,
            dataIndex: 'numero',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmnombrecontrato,
            width: 200,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCliente,
            width: 200,
            dataIndex: 'clienteproveedor',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var render = LOG.fact.GridContratos.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idclienteproveedor: _this.idcliente || null
        });
        this.getStorePrincipal().reload();
        return render;
    }
});

LOG.fact.GridServicios = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.idcontrato = config.idcontrato;
        this.modoSeleccion = 3;
        this.urlBusquedaGridPrincipal = 'cargarServContrato';

        LOG.fact.GridServicios.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {

    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'prodserv',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idhito',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
       /* this.addGridColumn({
            header: _this.idioma.cmCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        });*/
        this.addGridColumn({
            header: _this.idioma.cmMonto+' '+monedacontable,
            width: 80,
            dataIndex: 'precio'+monedacontable.toLowerCase(),
            default: true,
            renderer: function(v){
                return Ext.util.Format.number(v, '0,000.00');
            }
        });
        if(alternativa){
            this.addGridColumn({
                header: _this.idioma.cmMonto+' '+monedaalternativa,
                width: 80,
                dataIndex: 'precio'+monedaalternativa.toLowerCase(),
                default: true,
                renderer: function(v){
                    return Ext.util.Format.number(v, '0,000.00');
                }
            });
        }
    },
    render: function() {
        var _this = this;
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p>{prodserv}</p>'
            )
        });
        _this.addGridPlugin(expander);
        var render = LOG.fact.GridServicios.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idcontrato: _this.idcontrato || null
        });
        this.getStorePrincipal().on('load', function(st){
            if (st.data.items[0].json.idhito){
                if(_this.rowexp == undefined){
                    _this.rowexp = true;
                    _this.insertGridColumn(expander, 3);
                    var listaColumnas = LOG.util.UIManager.proccessColumns(_this.listaColumnas, _this.getGridPrincipal().getSelectionModel());
                    var columnas = new Ext.grid.ColumnModel(listaColumnas.columns);
                    _this.getGridPrincipal().reconfigure(_this.getStorePrincipal(), columnas);
                }
            }

        });
        this.getStorePrincipal().reload();
        return render;
    }
});

LOG.fact.GridProductos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = false;
        this.autoSelect = false;
        this.idcontrato = config.idcontrato;
        this.modoSeleccion = 3;
        this.urlBusquedaGridPrincipal = 'cargarProdContrato';

        LOG.fact.GridProductos.superclass.constructor.call(this, config);
    },
    initDefaultButtons: function() {
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idhito',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'prodserv',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });
        this.addGridColumn({
            header: _this.idioma.cmCantidad,
            width: 80,
            dataIndex: 'cantidad',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cmPrecio,
            width: 80,
            dataIndex: 'precio',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var expander = new Ext.ux.grid.RowExpander({
            tpl : new Ext.Template(
                '<p>{prodserv}</p>'
            )
        });
        _this.addGridPlugin(expander);
        var render = LOG.fact.GridProductos.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idcontrato: _this.idcontrato || null
        });
        this.getStorePrincipal().on('load', function(st){
            if (st.data.items[0].json.idhito){
                if(_this.rowexp == undefined){
                    _this.rowexp = true;
                    _this.insertGridColumn(expander, 3);
                    var listaColumnas = LOG.util.UIManager.proccessColumns(_this.listaColumnas, _this.getGridPrincipal().getSelectionModel());
                    var columnas = new Ext.grid.ColumnModel(listaColumnas.columns);
                    _this.getGridPrincipal().reconfigure(_this.getStorePrincipal(), columnas);
                }
            }

        });
        this.getStorePrincipal().reload();
        return render;
    }
});
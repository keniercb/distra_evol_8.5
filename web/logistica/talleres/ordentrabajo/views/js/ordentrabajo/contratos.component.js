Ext.ns('LOG.tall');
LOG.tall.contratos = Ext.extend(LOG.util.Window, {
    _parent: undefined,
    constructor: function(config) {
        this.idioma = config.idioma;
        this.constrain = true;
        this.idcliente = config.idcliente || null;
        LOG.tall.contratos.superclass.constructor.call(this, config);
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
        LOG.tall.contratos.superclass.initComponent.call(this, arguments);
    },
    createItems: function () {
        var _this = this;

        _this.pGdList = new LOG.tall.GridContratos({
            region: 'center',
            idioma: _this.idioma,
            url: _this.urlAction,
            frame: true,
            idcliente: _this.idcliente,
            concepto: _this.idioma.lbconceptocontrato,
            textBusquedaSimple: _this.idioma.cmnumerocontrato
        });

        _this.pGdList.init();
        return _this.pGdList.view();
    },
    aceptarFn: function () {


    },
    postSalvar: function (r, a) {

    }
});

LOG.tall.GridContratos = Ext.extend(LOG.util.UITemplate, {
    iddocumento: undefined,
    constructor: function(config) {
        this.formaVisualizacion = 'panel';
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.autoSelect = false;
        this.idcliente = config.idcliente || -1;
        this.modoSeleccion = 1;
        this.urlBusquedaGridPrincipal = 'cargarContratos';

        LOG.tall.GridContratos.superclass.constructor.call(this, config);
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
            width: 460,
            dataIndex: 'clienteproveedor',
            default: true
        });
    },
    render: function() {
        var _this = this;
        var render = LOG.tall.GridContratos.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            idclienteproveedor: _this.idcliente || null
        });
        this.getStorePrincipal().reload();
        return render;
    }
});
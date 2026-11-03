Ext.ns('LOG.aft.winActivosService');

LOG.aft.winActivosService = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    autoLoad: false,
    parametros: undefined,
    constructor: function (config) {
        var _this = this;
        this.formaVisualizacion = 'ventana';

        this.idioma = LOG.aft.winActivosService.Idioma;
        this.modoSeleccion = 3;
        this.gridEditable = true;
        this.busquedaBasica = true;
        this.panelBotonesVisible = false;
        this.autoShow = false;
        this.concepto = config.idioma.lbconcepto;
        this.urlBusquedaGridPrincipal = 'getactivosfijosservice';
        this.dirController = '/logistica/activos_fijos/utiles/index.php/gestregnumerico';

        this.idregistrosExcluir = config.idregistrosExcluir ? config.idregistrosExcluir : [];
        this.callBackAction = config.callBackAction;

        this.parametros = {
            start: 0,
            limit: 30
        };

        LOG.aft.winActivosService.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            header: _this.idioma.lbColCodigo,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbColDenominacion,
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbHColInventario,
            autoExpand: true,
            dataIndex: 'nroinventario',
            default: true/*,
            renderer: function (value, meta, record){
            }*/
        });

        this.addGridColumn({
            header: _this.idioma.lbArea,
            autoExpand: true,
            dataIndex: 'arearesp',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbCentroCosto,
            autoExpand: true,
            dataIndex: 'centrocosto',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbResponsable,
            autoExpand: true,
            dataIndex: 'responsable',
            default: true
        });

        this.addGridColumn({dataIndex: 'iddeposito'});
    },
    init: function () {
        var _this = this;
        Ext.erp.winDepositos.superclass.init.call(this);
        this.getVistaPrincipal().setTitle(_this.idioma.lbAdicionarDepositos);
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 450;
        this.getVistaPrincipal().resizable = false;
        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                LOG.util.UIManager.apply(_this.getStorePrincipal().initBaseParams, _this.parametros);
                _this.onShowHandler();
            },
            aceptarFn: function (aplicar) {
                if (typeof _this.doAction == 'function') {
                    _this.doAction.createDelegate(_this, [_this.getGridPrincipal().getSelectionModel().getSelections(), aplicar]).call();
                }
            }
        });

        this.panelGrid = LOG.util.UIManager.initFocusPanel({
            region: 'center',
            layout: 'border'
        });
    },
    render: function () {
        var _this = this;
        var _res = Ext.erp.winDepositos.superclass.render.call(this);
        this.getGridPrincipal().getSelectionModel().fireEvent = this.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange' && _this.formaVisualizacion == 'ventana') {
                _this.habilitarBotones();
            }
        });

        this.storePrincipal.on('beforeload', function(st, options){
                st.initBaseParams.idregistrosExcluir = _this.idregistrosExcluir ? Ext.encode(_this.idregistrosExcluir) : Ext.encode([]);
            }
        );

        return _res;
    },
    habilitarBotones: function () {
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
            this.getVistaPrincipal().listaBotones.getItem(1).enable();
            this.getVistaPrincipal().listaBotones.getItem(2).enable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, this.parametros);
        this.getStorePrincipal().reload();
    },
    doAction: function (r, aplicar) {
        var _this = this;
        _this.callBackAction(r);
        if(aplicar){
            Ext.each(r, function(rec){
                _this.idregistrosExcluir.push(rec.json.idregnumerico);
            });

            _this.getStorePrincipal().load();
        }
    }
});
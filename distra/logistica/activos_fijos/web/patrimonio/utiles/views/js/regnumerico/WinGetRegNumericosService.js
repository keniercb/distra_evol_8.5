/**
 * Created with JetBrains PhpStorm.
 * User: Osmel Cutino
 * Date: 9/03/15
 * Time: 14:30
 * To change this template use File | Settings | File Templates.
 */
Ext.ns('Ext.LOG');
Ext.LOG.WinGetRegNumericosService = Ext.extend(Ext.Window, {
    width: 999,
    height: 500,
    modal: true,
    closeAction: 'close',
    resizable: true,
    constrain: true,
    constructor: function(config) {
        var _this = this;

        this.doAction = config.doAction;

        this.arrRNnomostrar = (config.arrRNnomostrar) ? config.arrRNnomostrar : Array();
        this.idindicador = (config.idindicador) ? config.idindicador : null;
        this.enviadorepararaction = (config.cargarEnviadosATaller) ? true : false;
        this.idestructura = (config.idestructura) ? config.idestructura : console.exception("Debe mandar la estructura");

        Ext.Ajax.request({
            url: '/logistica/activos_fijos/utiles/index.php/gestregnumerico/cargaretiquetas',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.etiquetas = rd;
                _this._initComponent();
            }});

        Ext.apply(this, config);

        Ext.LOG.WinGetRegNumericosService.superclass.constructor.call(this, arguments);
    },
    _initComponent: function() {
        var _this = this;
        this.layout = 'fit';
        this.urlGrid = (!_this.enviadorepararaction) ? '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getcargarregnummedios' : '/logistica/activos_fijos/utiles/index.php/gestregnumerico/getCargarEnviadosATaller';
        _this.title = (_this.title) ? _this.title : 'Registros num&eacute;ricos';


        this.addAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            id: 'idbtnAceptarWinAdd',
            tooltip: _this.etiquetas.lbTtBtnAceptarF,
            disabled: true,
            handler: function() {
                var records = _this.sm.getSelections();
                _this.doAction(records);
                _this.close();
            }
        });

        this.addCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: "Cancelar",
            id: 'idbtnCancelarWinAddMod',
            tooltip: _this.etiquetas.lbTtBtnCancelarF,
            handler: function() {
                _this.close();
            }
        });

        this.addAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: 'Aplicar',
            id: 'idbtnAplicarWinAddMod',
            disabled: true,
            tooltip: _this.etiquetas.lbTtBtnCancelarF,
            handler: function() {
                Ext.getBody().mask('Cargando...', 'x-mask-loading');
                var records = _this.sm.getSelections();
                _this.doAction(records);
                var i = 0;
                while (i < records.length) {
                    _this.arrRNnomostrar.push(records[i].data.idregnumerico);
                    i += 1;
                }
                _this.gridCEntral.getStore().load();

            }
        });

        this.buttons = [_this.addCancelar, _this.addAplicar, _this.addAceptar];

        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: (_this.singleSelect) ? _this.singleSelect : false,
            checkOnly: false
        });

        this.sm.on({
            'rowselect': function(st, number, record) {

                if (st.selections.items.length > 0) {
                    _this.addAplicar.enable();
                    _this.addAceptar.enable();
                } else {
                    _this.addAplicar.disable();
                    _this.addAceptar.disable();
                }
            },
            'rowdeselect': function(st, number, record) {
                if (st.selections.items.length == 0) {
                    _this.addAplicar.disable();
                    _this.addAceptar.disable();
                } else {
                    _this.addAplicar.enable();
                    _this.addAceptar.enable();
                }
            }
        });

        _this.gridCEntral = new Ext.LOG.GridRegNumericoService({
            url: _this.urlGrid,
            width: 1500,
            autoScroll: true,
            height: 390,
            autoWidth: true,
            autoload: true,
            sm: _this.sm,
            cargarcentral: false,
            configuracion: _this
        });
        _this.gridCEntral.getStore().on('beforeload', function() {
            _this.LoadMask = new Ext.LoadMask(_this.getEl(), {msg: "Cargando..."});
            _this.LoadMask.show();
        });
        _this.gridCEntral.getStore().on('load', function() {
            _this.LoadMask.hide();
        });

        this.panelAddmedios = new Ext.FormPanel({
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 990,
            height: 400,
            autoScroll: true,
            items: [_this.gridCEntral]

        });

        this.items = [_this.panelAddmedios];
        document.onkeyup = function(e) {

            if (e.altKey) {
                if (!e.ctrlKey) {
                    if (e.which == Ext.EventObject.B) {
                        if (_this.gridCEntral.btnBuscarADD) {
                            _this.gridCEntral.btnBuscarADD.handler();
                        }

                    } else if (e.which == Ext.EventObject.L) {
                        if (_this.gridCEntral.btnLimpiarADD) {
                            _this.gridCEntral.btnLimpiarADD.handler();
                        }
                    }

                } else {
                    if (e.which == Ext.EventObject.B) {
                        if (_this.gridCEntral.btnBusqavanzADD) {
                            if (!_this.gridCEntral.btnBusqavanzADD.disabled) {
                                _this.gridCEntral.btnBusqavanzADD.handler();
                            }
                            if (_this.gridCEntral.btnBusqavanzADD) {
                                if (!_this.gridCEntral.btnBusqavanzADD.disabled) {
                                    _this.gridCEntral.btnBusqavanzADD.handler();
                                }
                            }
                        }
                    }
                }
            }
            if (e.which == Ext.EventObject.DELETE) {
                if (!_this.btnEliminar.disabled) {
                    _this.btnEliminar.handler();
                }
            }
        };
        Ext.LOG.WinGetRegNumericosService.superclass.initComponent.call(this);
        this.show();
    }

});

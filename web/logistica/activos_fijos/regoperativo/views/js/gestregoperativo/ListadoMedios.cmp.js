Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.Listado_Medios = Ext.extend(Ext.Window, {
    width : 1100,
    height : 400,
    constructor: function(config) {
        var _this = this;
        _this.singleSelection = true;
        Ext.apply(this, config);
        _this.idioma = config.idioma;
        _this.resizable = true;
        _this.constrain = true;
        _this.modal = true;
        _this.layout = 'fit';
        (config.notab) ? _this.notab = config.notab : 1;
        _this.listeners = {
            'show': function() {
                _this.keymap.stopEvent = true;
                _this.keymap.enable();
                _this.treegrid.getStore().baseParams = {};
                _this.treegrid.getStore().load({
                    params: {
                        anode: null,
                        _id: null/*,
                        idarearesp: _this.idarea*/
                    }});
            },
            'hide': function() {
                this.keymap.disable();
            }
        };
        if (!_this.smtreegrid) {
            this.smtreegrid = new Ext.grid.CheckboxSelectionModel({
                singleSelect: _this.singleSelection
            });
        }
        this.propertyGridMod = new Ext.LOG.RegNumOperativo.propertyAtriDinamicos({
            region: 'center',
            idioma: _this.idioma,
            fnExpand: function() {
                _this.panel_resumen.expand();
            },
            fnCollapse: function() {
                _this.panel_resumen.collapse();
            }
        });

        this.panel_resumen = new Ext.Panel({
            title: _this.idioma.lbTitlePanelDatosMedio,
            layout: 'fit',
            region: 'east',
            width: 250,
            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            autoScroll: true,
            animCollapse: false,
            animate: false,
            split: true,
            collapsed: true,
            items: [_this.propertyGridMod]
        });

        this.treegrid = new Ext.LOG.RegNumOperativo.TreeGridRegistroNO({
            idioma: _this.idioma,
            region: 'center',
            url: 'cargarRegNumOperativo',
            plantilla: (_this.plantilla) ? _this.plantilla : false,
            tbarConfig: (_this.tbarConfig) ? _this.tbarConfig : false,
            sm: _this.smtreegrid,
            idarea: (_this.panelContent &&_this.panelContent.idarearesp)?_this.panelContent.idarearesp:_this.treegridPrincipal.getStore().baseParams.idarearesp,
            notab: _this.notab,
            parent: _this,
            showBtnbusqAvanzada: true,
            showCombofiltroArea: true,
            noModificarProperty: 2,
            idsRegNumNoMostrar: (_this.idsRegNumNoMostrar) ? _this.idsRegNumNoMostrar : new Array(),
            root_title: (_this.plantilla) ? 'Plantillas' : 'Medios'
        });

        if (!_this.plantilla) {
            this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hidden = true;
            this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hideable = false;
        }
        this.treegrid.getSelectionModel().purgeListeners();
        this.treegrid.getSelectionModel().on('rowselect', function(SelectionModel, rowIndex, record) {
            if (SelectionModel.getSelections() && SelectionModel.getSelections().length == 1) {
                var idindicador = record.data.idindicador;
                var idregnumerico = record.data.idregnumerico;
                var idtabla = record.data.idtabla;
                var arridtablas = record.data.arridtablas;
                if (_this.validarRegistro()) {
                    _this.btnAceptarWinMedios.enable();
                }
                _this.propertyGridMod.setContenido(idindicador, idregnumerico, idtabla, arridtablas);
            }
            else {
                _this.propertyGridMod.setContenido();
            }
        });
        this.treegrid.getSelectionModel().on('rowdeselect', function(SelectionModel, rowIndex, record) {
            _this.btnAceptarWinMedios.disable();
            _this.propertyGridMod.setContenido();
        });
        this.treegrid.getStore().on('beforeload', function(Store, options) {
            _this.btnAceptarWinMedios.disable();
        });

        this.btnAceptarWinMedios = new Ext.Button({
            iconCls: 'aceptar',
            disabled: true,
            text: _this.idioma.btnAceptar,
            tooltip: _this.idioma.btnTAceptar,
            handler: function() {
                if (!_this.treegrid.getSelectionModel().hasSelection()) {
                    return;
                }
                _this.functionBtnAceptar();
            }
        });

        this.btnCancelarWinMedios = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.btnCancelar,
            tooltip: _this.idioma.lbTtBtnCancelar,
            handler: function() {
                _this.hide();
            }
        });
        this.panelTreeGridMod = new Ext.Panel({
            region: 'center',
            layout: 'fit',
            autoScroll: true,
            border: false,
            items: [_this.treegrid]
        });
        _this.formModulo = new Ext.Panel({
            idioma: '_this.idioma',
            frame: true,
            layout: 'border',
            region: 'center',
            items: [_this.panelTreeGridMod, _this.panel_resumen]
        });

        _this.buttons = [
            _this.btnCancelarWinMedios,
            _this.btnAceptarWinMedios
        ];
        _this.items = [_this.formModulo];
        _this.keymap = new Ext.KeyMap(document, [{
                key: 13,
                ctrl: false,
                alt: false,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this) {
                        _this.btnAceptarWinMedios.handler();
                    }
                }
            }, {
                key: 88,
                ctrl: false,
                alt: true,
                stopEvent: true,
                fn: function()
                {
                    if (Ext.WindowMgr.getActive() == _this) {
                        _this.btnCancelarWinMedios.handler();
                    }
                }
            }]);

        Ext.LOG.RegNumOperativo.Listado_Medios.superclass.constructor.apply(this, arguments);
    },
    fnAceptarPlantilla: function() {
        var _this = this;
        if (_this.validarRegistro() == true) {
            var datosPlantilla = {
                idregnumerico: _this.treegrid.getSelectionModel().getSelected().data.idregnumerico,
                denominacionplantilla: _this.treegrid.getSelectionModel().getSelected().data.denominacionplantilla
            };
            _this.fn(datosPlantilla);
            _this.hide();
        } else {
            mostrarMensaje(1, _this.idioma.lbValidRegnumPadre);
        }
    },
    fnAceptarRegNumericoModulo: function() {
        var _this = this;
        if (_this.validarRegistro()) {
            if (this.treegrid.getSelectionModel().hasSelection()) {
                var rcds = this.treegrid.getSelectionModel().getSelections();
                for (var i = 0; i < rcds.length; i++) {
                    if (rcds[i].data._is_leaf == true) {
                        _this.panelModulo.treegrid.getStore().add(rcds[i]);
                    } else {
                        for (var j = 0; j < _this.treegrid.getStore().getCount(); j++) {
                            if (_this.treegrid.getStore().getAt(j).data.idarbolmodulo == rcds[i].data.idarbolmodulo) {
                                _this.panelModulo.treegrid.getStore().add(_this.treegrid.getStore().getAt(j));
                            }
                        }
                    }
                    this.treegrid.getStore().remove(rcds[i]);
                }
                _this.hide();
            }
        } else {
            mostrarMensaje(1, _this.idioma.lbValidRegnumPadre);
        }
    },
    validarRegistro: function() {
        var _this = this;
        if (_this.treegrid.getSelectionModel().hasSelection()) {
            var records = _this.treegrid.getSelectionModel().getSelections();
            var i = 0;
            while (i < records.length) {
                if (records[i].data.idregnumerico != records[i].data.idpadremodulo) {
                    return false;
                }
                i += 1;
            }
            return true;
        } else {
            return false;
        }
    },
    destructor: function() {
        this.keymap.disable();
        Ext.LOG.RegNumOperativo.Listado_Medios.superclass.destructor.call(this);
    }
});


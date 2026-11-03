Ext.ns('Ext.LOG.RegNumOperativo');

Ext.LOG.RegNumOperativo.PanelModulo = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        _this.idioma = config.idioma;
        _this.autoScroll = true;
        _this.region = config.region;
        _this.title = _this.idioma.lbTitlePanelModulo;
        _this.layout = 'border';
        _this.esactivo = false;
        _this.arrayIdsregnumerico = Array();
        _this.eliminarElementos = Array();
        _this.arrayEnviar = Array();
        _this.arrayElementosIniciales = Array();
        _this.elementoshijos = Array();

        _this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionarRegTab' + _this.notab,
            iconCls: 'adicionar',
            text: _this.idioma.btnAdicionar,
            tooltip: _this.idioma.TooltbtnAdicionarVariosReg,
            handler: function() {
                _this.arrayIdsregnumerico = _this.treegrid.getStore().collect('idregnumerico');
                _this.onAdicionar();
            }
        });

        _this.btnEliminar = new Ext.Button({
            id: 'btnEliminarRegTab' + _this.notab,
            iconCls: 'eliminar',
            disabled: true,
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.TooltbtnEliminar,
            handler: function() {
                _this.onEliminar();
            }
        });

        this.tbar = [_this.btnAdicionar, _this.btnEliminar];

        this.propertyGridMod = new Ext.LOG.RegNumOperativo.propertyAtriDinamicos({
            region: 'center',
            idioma: _this.idioma,
            fnExpand: function() {
                _this.panel_resumenMod.expand();
            },
            fnCollapse: function() {
                _this.panel_resumenMod.collapse();
            }
        });
        this.panel_resumenMod = new Ext.Panel({
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
            autoLoadStoreP: false,
            url: (_this.idregnumerico) ? 'cargarRegNumOperativo' : null,
            plantilla: _this.plantilla,
            parent: _this,
            idsRegNumMostrar: _this.objRegnumerico,
            modificar: _this.modificar,
            showBtnbusqAvanzada: true,
            showCombofiltroArea: true,
            notab: _this.notab,
            noModificarProperty: 2,
            paginado: -1,
            fnHabilitarBotones: function() {
                _this.habilitarBotones();
            },
            fnDesabilitarBotones: function() {
                _this.desabilitarBotones();
            }
        });
        if (!_this.plantilla) {
            this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hidden = true;
            this.treegrid.getColumnModel().getColumnById('iddenominacionplantilla').hideable = false;
        }
        this.treegrid.getStore().on('load', function(st, rd) {
            _this.arrayElementosIniciales = _this.treegrid.getStore().collect('idregnumerico');
        });
        this.treegrid.getStore().on('beforeload', function(st, rd) {
            if (_this.plantilla) {
                _this.treegrid.getStore().baseParams.moduloPlantilla = 1;
            }
        });
        this.treegrid.getStore().on('beforeexpandnode', function(st, rd) {
            if (!_this.treegrid.getStore().isLoadedNode(rd)) {
                return false;
            }
        });

        this.treegrid.btnBuscaravanzada.disable();

        if (_this.idregnumerico) {
            this.treegrid.getStore().load();
        }

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
            border: false,
            items: [_this.panelTreeGridMod, _this.panel_resumenMod]
        });
        _this.items = [_this.formModulo];
        Ext.LOG.RegNumOperativo.PanelModulo.superclass.constructor.call(this, config);
    },
    getTreegrid: function() {
        return this.treegrid;
    },
    habilitarBotones: function() {
        var _this = this;
        if (this.getTreegrid().getSelectionModel().hasSelection()) {
            _this.btnEliminar.enable();
        }
    },
    desabilitarBotones: function() {
        var _this = this;
        _this.btnEliminar.disable();
    },
    onAdicionar: function() {
        var _this = this;
        if (_this.idregnumerico != null) {
            _this.arrayIdsregnumerico.push(_this.idregnumerico);
        }
        if (!_this.ventanaAdicionarElemento) {
            _this.ventanaAdicionarElemento = new Ext.LOG.RegNumOperativo.Listado_Medios({
                title: _this.idioma.lbMediosDisponibles,
                idioma: _this.idioma,
                treegridPrincipal: _this.treegridPrincipal,
                panelContent: _this.panelContent,
                panelModulo: _this,
                width : 1000,
                height : 400,
                notab: _this.notab,
                //idsRegNumNoMostrar: _this.idregnumerico,
                idsRegNumNoMostrar: _this.arrayIdsregnumerico,
                plantilla: false,
                modal: true,
                functionBtnAceptar: function() {
                    this.fnAceptarRegNumericoModulo();
                },
                fn: function(datosPlantilla) {
                    _this.datosPlantilla = datosPlantilla;
                    _this.comboPlantilla.setValue(_this.datosPlantilla.denominacionplantilla);
                }
            });
            _this.ventanaAdicionarElemento.show();
        } else {
            if (_this.ventanaAdicionarElemento && !_this.ventanaAdicionarElemento.isVisible()) {
                _this.ventanaAdicionarElemento.treegrid.idsRegNumNoMostrar = _this.arrayIdsregnumerico;
                _this.ventanaAdicionarElemento.show();
            }
        }
    },
    onEliminar: function() {
        var _this = this;
        var records = _this.treegrid.getSelectionModel().getSelections();
        for (var i = 0; i < records.length; i++) {
            if (_this.arrayElementosIniciales.indexOf(records[i].data.idregnumerico) != -1) {
                _this.eliminarElementos.push(records[i].data.idregnumerico);
            }
            _this.treegrid.getStore().remove(records[i]);
        }
        _this.btnEliminar.disable();
    },
    retornarValoresCmp: function() {
        var _this = this;
        if (_this.treegrid.getStore().getCount() > 0) {
            var arrayValores = _this.treegrid.getStore().getRange();
            for (var i = 0; i < arrayValores.length; i++) {
                if ((_this.arrayElementosIniciales.indexOf(arrayValores[i])) == -1 && arrayValores[i].data.idregnumerico == arrayValores[i].data.idpadremodulo) {
                    _this.arrayEnviar.push(arrayValores[i].data.idregnumerico);
                }
            }
        }
        if(_this.modificar && (_this.arrayEnviar.length == 0 && _this.eliminarElementos.length == 0))
        {
            return -1;
        }
        var obj = {
            elementoshijos: _this.arrayEnviar,
            eliminarHijos: _this.eliminarElementos,
            cantidadStoreModulo: _this.treegrid.getStore().getCount()
        };
        return obj;
    },
    LimpiarValoresCmp: function() {
        var _this = this;
        _this.treegrid.getStore().removeAll();
    }
});

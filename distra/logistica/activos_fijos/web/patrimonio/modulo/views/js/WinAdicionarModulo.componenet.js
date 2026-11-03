Ext.ns('Ext.LOG.moduloMedio');

Ext.LOG.moduloMedio.winAddModuloP = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        config.resizable = false;
        this.modal = true;
        this.idioma = config.idioma;
        this.autoValidate = true;
        
        this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: this.idioma.labAdicionando});
        this.especialidad = (this.mostrarEspecialidad) ? true : false;

        Ext.LOG.moduloMedio.winAddModuloP.superclass.constructor.call(this, config);
        this.panelDatos();
        this.width = 950;
        this.height = 400;
    },
    initComponent: function(config) {
        var _this = this; 
        Ext.LOG.moduloMedio.winAddModuloP.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                this.destroy();
                _this.keyMap.stopEvent = true;
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            disabled:true,
            handler: function() {
                if (this.tabGeneral.getActiveTemplate().idComponent == 0) {
                    if (this.tabGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                        var datos = this.tabGeneral.getActiveTemplate().getSmPrincipal().getSelections();
                        _this.AdicionarModulo(datos);
                    }
                    else{
                         mostrarMensaje(2, _this.idioma.MsgNoSelecMedio);
                    }
                } else if (this.tabGeneral.getActiveTemplate().idComponent == 1) {
                    if (this.tabGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                        var datos = this.tabGeneral.getActiveTemplate().getSmPrincipal().getSelections();
                        _this.AdicionarModulo(datos);
                    }else{
                        mostrarMensaje(2, _this.idioma.MsgNoSelecAgrupacion);
                    }
                }
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled:true,
            handler: function() {
                if (this.tabGeneral.getActiveTemplate().idComponent == 0) {
                    if (this.tabGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                        var datos = this.tabGeneral.getActiveTemplate().getSmPrincipal().getSelections();
                        _this.AdicionarModulo(datos);
                        _this.destroy();
                    }else{
                         mostrarMensaje(2, _this.idioma.MsgNoSelecMedio);
                    }
                } else if (this.tabGeneral.getActiveTemplate().idComponent == 1) {
                    if (this.tabGeneral.getActiveTemplate().getSmPrincipal().hasSelection()) {
                        var datos = this.tabGeneral.getActiveTemplate().getSmPrincipal().getSelections();
                        _this.AdicionarModulo(datos);
                        _this.destroy();
                    }else{
                         mostrarMensaje(2, _this.idioma.MsgNoSelecAgrupacion);
                    }
                }

            }
        });
    },
    panelDatos: function() {
        var _this = this;
        this.tabGeneral = new LOG.util.UITabTemplate({
            idioma: _this.idioma,
            formaVisualizacion: 'panel'
        });
        this.PanelMedio = new Ext.LOG.moduloMedio.PanelMedioP({
            idioma: _this.idioma,
            formaVisualizacion: 'panel',
            idComponent: 0,
            title: _this.idioma.lbTitlePanelMedio,
            self: _this.self,
            idarea: _this.idarea,
            objetoobra: true
        });
        this.panelNomenMod = new Ext.LOG.moduloMedio.PanelMedioP({
            idioma: _this.idioma,
            idComponent: 1,
            formaVisualizacion: 'panel',
            title: 'Inmuebles',
            self: _this.self,
            idarea: _this.idarea 
        });
        
        
       /* this.panelNomenMod = new Ext.LOG.moduloMedio.panelNomenMod({
            idioma: _this.idioma,
            idComponent: 1,
            formaVisualizacion: 'panel',
            title: 'Inmuebles',
            self: _this.self,
            tabGeneral: _this.tabGeneral,
            idarea: _this.idarea
        });*/

        _this.tabGeneral.addTabToTemplete(_this.PanelMedio);
        _this.tabGeneral.addTabToTemplete(_this.panelNomenMod);
        this.add(_this.tabGeneral);
        _this.tabGeneral.init();
        _this.tabGeneral.view();
        _this.doLayout();
        _this.tabGeneral.setActiveTab(0);
        _this.tabGeneral.on({
            'tabchange': function(tabpanel, panel) {
                _this.tabGeneral.getActiveTemplate().getStorePrincipal().initBaseParams.idarea = _this.idarea;
                if (_this.tabGeneral.getActiveTemplate().idComponent == 0) {
                    if (_this.tabGeneral.getActiveTemplate().smGridPrincipal.selections.items.length > 0) {
                        _this.listaBotones.getItem(2).enable();
                        _this.listaBotones.getItem(1).enable();
                    }else{
                        _this.listaBotones.getItem(2).disable();
                        _this.listaBotones.getItem(1).disable();
                    }
                    _this.tabGeneral.getActiveTemplate().smGridPrincipal.on({
                        'rowselect': function(sm) { 
                            if(sm.selections.items.length > 0){
                                _this.listaBotones.getItem(2).enable();
                                _this.listaBotones.getItem(1).enable();
                            }else{
                                _this.listaBotones.getItem(2).disable();
                                _this.listaBotones.getItem(1).disable();
                            }
                           
                        },
                        'rowdeselect': function(sm) {
                            if(sm.selections.items.length > 0){
                                _this.listaBotones.getItem(2).enable();
                                _this.listaBotones.getItem(1).enable();
                            }else{
                                _this.listaBotones.getItem(2).disable();
                                _this.listaBotones.getItem(1).disable();
                            }
                        }
                    });
                     _this.tabGeneral.getActiveTemplate().getStorePrincipal().on('load', function(store, records, options) {
                        if (records.length == 0) {
                            _this.listaBotones.getItem(2).disable();
                            _this.listaBotones.getItem(1).disable();
                        }
                    });
                    _this.tabGeneral.getActiveTemplate().getStorePrincipal().initBaseParams.interfazNrodinventario = 1;
                }
                else if (_this.tabGeneral.getActiveTemplate().idComponent == 1) {
                    _this.tabGeneral.getActiveTemplate().getStorePrincipal().initBaseParams.interfazNrodinventario = 2;
                     if (_this.tabGeneral.getActiveTemplate().smGridPrincipal.selections.items.length > 0) {
                        _this.listaBotones.getItem(2).enable();
                        _this.listaBotones.getItem(1).enable();
                    }else{
                        _this.listaBotones.getItem(2).disable();
                        _this.listaBotones.getItem(1).disable();
                    }
                    _this.tabGeneral.getActiveTemplate().getStorePrincipal().on('load', function(store, records, options) {
                        if (records.length == 0) {
                            _this.listaBotones.getItem(2).disable();
                            _this.listaBotones.getItem(1).disable();
                        }
                    });
                    _this.tabGeneral.getActiveTemplate().smGridPrincipal.on({
                        'rowselect': function(sm) { 
                            if(sm.selections.items.length > 0){
                                _this.listaBotones.getItem(2).enable();
                                _this.listaBotones.getItem(1).enable();
                            }else{
                                _this.listaBotones.getItem(2).disable();
                                _this.listaBotones.getItem(1).disable();
                            }
                           
                        },
                        'rowdeselect': function(sm) {
                            if(sm.selections.items.length > 0){
                                _this.listaBotones.getItem(2).enable();
                                _this.listaBotones.getItem(1).enable();
                            }else{
                                _this.listaBotones.getItem(2).disable();
                                _this.listaBotones.getItem(1).disable();
                            }
                        }
                    });
                }
            }
        });
    },
    AdicionarModulo: function(datos) {
        var _this = this;
        var medios = new Array();
        for (var i = 0; i < datos.length; i++) {
            medios[i] = {
                idregnumerico: datos[i].data.idregnumerico
            }
        }
        if (_this.idmodulodesdeOrg != null) {
            _this.enviarDatos(_this.idmodulodesdeOrg, medios);
        } else {
            if (Ext.getCmp('idtreegrid').getSelectionModel().hasSelection()) {
                var idmodulo = Ext.getCmp('idtreegrid').getSelectionModel().getSelected().data.idregnumerico;
                _this.enviarDatos(idmodulo, medios);
            } else {
                _this.enviarDatos(null, medios);
            }
        }
    },
    enviarDatos: function(idmodulo, medios) {
        var _this = this;
        _this.getActiveTemplate = _this.tabGeneral.getActiveTemplate();
        Ext.MessageBox.wait(_this.idioma.labAdicionando, _this.idioma.msgEspere || '...');
        Ext.Ajax.request({
            url: 'adicionarModulo',
            method: 'POST',
            params: {
                idarea: _this.idarea,
                idmodulo: (idmodulo != null) ? idmodulo : 0,
                medios: Ext.encode(medios)
            },
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                Ext.MessageBox.hide();
                if (response.msg == 3) {
                    mostrarMensaje(response.msg, _this.idioma.MsgAdicionarModuloError);

                } else {
                    mostrarMensaje(1, _this.idioma.MsgAdicionarModuloOK);
                    if (_this.getActiveTemplate.idComponent == 0) {
                        _this.getActiveTemplate.getStorePrincipal().load();
                    } else if (_this.getActiveTemplate.idComponent == 1) {
                        _this.getActiveTemplate.getStorePrincipal().load({
                            params: {
                                accion2: true
                            }
                        });
                    }
                    if (_this.idmodulodesdeOrg != null) {
                        _this.fndelectCell();
                        _this.fnaddChild();
                    } else {
                        Ext.getCmp('idtreegrid').getSelectionModel().clearSelections();
                        Ext.getCmp('idtreegrid').getStore().baseParams = {};
                        Ext.getCmp('idtreegrid').getStore().load({
                            params: {
                                idarea: _this.idarea,
                                start: Ext.LOG.moduloMedio.start,
                                limit: Ext.LOG.moduloMedio.limit
                            }
                        });
                    }
                }

            }
        });

    }
});
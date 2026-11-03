
Ext.ns('LOG.confreporte');
LOG.confreporte.ventana = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        var _this = this;
        this.autoLoad = false;
        this.dirController = '/logistica/activos_fijos/configuracion/index.php/configuracionreporte';
        this.busquedaBasica = false;
        this.gridEditable = true;
        this.scope = config.scope;
        this.formaVisualizacion = 'panel';
        this.urlBusquedaGridPrincipal = 'cargarGridCentral';
        LOG.confreporte.ventana.superclass.constructor.call(this, config);
        this.modelo = new LOG.model.confreporte({
            idioma: config.idioma,
            scope: _this
        });
    },
    initDefaultColumns: function() {
        var _this = this;
       /* this.nombrecampo = new LOG.util.Prototipos.inputTexto({//inputDecimal
            width: 100,
            editable: true,
            listeners:{
                'change': function(field, newValue, oldValue, row){
                    if (_this.btnGuardar.disabled && newValue != oldValue) {
                        _this.btnGuardar.enable();
                    }
                }
            }
        });*/
        this.addGridColumn({
            header: _this.idioma.lbCmNombreCampo,
            dataIndex: 'nombre',
            width: 80,
            autoExpand: true,
            default: true,
            //editor: _this.nombrecampo
            //agrupador: true

        });
        this.valorcampo = new LOG.util.Prototipos.inputTexto({//inputDecimal
            width: 100,
            editable: true,
            listeners:{
                'change': function(field, newValue, oldValue, row){
                  if (_this.btnGuardar.disabled && newValue != oldValue) {
                      _this.btnGuardar.enable();
                  }
                }
            }
        });
        this.addGridColumn({
            header: _this.idioma.lbCmValorCampo,
            width: 250,
            dataIndex: 'valor',
            default: true,
            editable: true,
            editor: _this.valorcampo,
        });
        this.addGridColumn({
            dataIndex: 'idconfreporteaft',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idreporte',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idconfreporteaftentidad',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idestructura',
            default: true
        });

    },

    initDefaultButtons: function() {
        var _this = this;
        //----------------------------------------
        _this.altaregvehiculo = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuAltaRegVehiculo,
            isList: false,
            disabled: false,
            idreporte: parseInt(1),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.altaregvehiculo.disable();
                    _this.getHabilitarRepores(parseInt(1));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(1)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('AltaRegVehiculos')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.cartaTecnoImport = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuCartaDejaTecnoimport,
            isList: false,
            disabled: false,
            idreporte: parseInt(2),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.cartaTecnoImport.disable();
                    _this.getHabilitarRepores(parseInt(2));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(2)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CartaDejaTecImport')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.cartaTecnoTex = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuCartaDejaTecnotex,
            isList: false,
            disabled: false,
            idreporte: parseInt(3),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.cartaTecnoTex.disable();
                    _this.getHabilitarRepores(parseInt(3));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(3)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CartaDejaTecTex')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.facturaOficTecnoImport = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuFacturaOficioTecnoImport,
            isList: false,
            disabled: false,
            idreporte: parseInt(5),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura && _this.scope.idestructura != 0 ) {
                    _this.facturaOficTecnoImport.disable();
                    _this.getHabilitarRepores(parseInt(5));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(5)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('CopiaFacOficioTecnoimport')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.facturaOficTecnoTex = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuFacturaOficioTecnoTex,
            isList: false,
            disabled: false,
            idreporte: parseInt(6),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.facturaOficTecnoTex.disable();
                    _this.getHabilitarRepores(parseInt(6));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(6)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('FacOficioTecnotex')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.modeloMov = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuModeloMov,
            isList: false,
            disabled: false,
            idreporte: parseInt(4),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.modeloMov.disable();
                    _this.getHabilitarRepores(parseInt(4));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(4)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('MovimientoActivoFijoTangible')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.anexoHoja4 = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuAnexoHoja4,
            isList: false,
            disabled: false,
            idreporte: parseInt(15),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.anexoHoja4.disable();
                    _this.getHabilitarRepores(parseInt(15));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(15)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('AnexoHoja4')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.anexoHoja5 = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuAnexoHoja5,
            isList: false,
            disabled: false,
            idreporte: parseInt(16),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.anexoHoja5.disable();
                    _this.getHabilitarRepores(parseInt(16));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(16)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('AnexoHoja5')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.movInventario = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuMovInventario,
            isList: false,
            disabled: false,
            idreporte: parseInt(17),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.movInventario.disable();
                    _this.getHabilitarRepores(parseInt(17));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(17)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('MovimientoInventario')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });


        //-----------------------------------------------

        _this.bajaTecniProva = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuBajaTecniProva,
            isList: false,
            disabled: false,
            idreporte: parseInt(18),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura ) {
                    _this.bajaTecniProva.disable();
                    _this.bajaTecniProva.disabled = true;
                    _this.getHabilitarRepores(parseInt(18));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(18)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaTecniProvari')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(18);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.bajaTecniPorDesarmeGavi = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuBajaTecniPorDesGav,
            isList: false,
            disabled: false,
            idreporte: parseInt(19),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.bajaTecniPorDesarmeGavi.disable();
                    _this.bajaTecniPorDesarmeGavi.disabled = true;
                    _this.getHabilitarRepores(parseInt(19));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(19)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaTecniPorDesarmeGavi')) {
                    b.setVisible(true);
                   // b.idreporte = parseInt(19);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.bajaAnexodos = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuBajaAnexodos,
            isList: false,
            disabled: false,
            idreporte: parseInt(8),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.bajaAnexodos.disable();
                    _this.bajaAnexodos.disabled = true;
                    _this.getHabilitarRepores(parseInt(8));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(8)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaAnexodos')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(20);
                } else {
                    b.setVisible(false);
                }
            }
        });
        _this.bajaProvAnexodos = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuBajaProvAnexodos,
            isList: false,
            disabled: false,
            idreporte: parseInt(25),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.bajaProvAnexodos.disable();
                    _this.bajaProvAnexodos.disabled = true;
                    _this.getHabilitarRepores(parseInt(25));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(25)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaAnexodos')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(20);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.bajaAnexotres = LOG.util.UIManager.createMenuItem({
            text: 'Baja aprobada(Anexo 3)',//_this.idioma.btnMenuBajaAnexotres,
            isList: false,
            disabled: false,
            idreporte: parseInt(21),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.bajaAnexotres.disable();
                    _this.bajaAnexotres.disabled = true;
                    _this.getHabilitarRepores(parseInt(21));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(21)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaAnexotres')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(21);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.presBajaTur = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnMenuBajaTur,
            isList: false,
            disabled: false,
            idreporte: parseInt(22),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.presBajaTur.disable();
                    _this.presBajaTur.disabled = true;
                    _this.getHabilitarRepores(parseInt(22));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(22)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaTur')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(7);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.solisitudBTurAutos = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnSolisitudBTurAutos,
            isList: false,
            disabled: false,
            idreporte: parseInt(7),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.solisitudBTurAutos.disable();
                    _this.solisitudBTurAutos.disabled = true;
                    _this.getHabilitarRepores(parseInt(7));
                    _this.getStorePrincipal().load({
                        params: {
                            idreporte: parseInt(7)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaTurAutos')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(6);
                } else {
                    b.setVisible(false);
                }
            }
        });

        _this.solisitudBOmnibus = LOG.util.UIManager.createMenuItem({
            text: _this.idioma.btnSolisitudBOmnibus,
            isList: false,
            disabled: false,
            idreporte: parseInt(24),
            //iconCls: 'producto',
            handler: function() {

                if (_this.scope.idestructura) {
                    _this.solisitudBOmnibus.disable();
                    _this.solisitudBOmnibus.disabled = true;
                    _this.getHabilitarRepores(parseInt(24));
                    _this.getStorePrincipal().load({
                        params:{
                            idreporte: parseInt(24)
                        }
                    });
                }
            },
            controlFn: function (b, _caller) {
                if (_caller.grantedAction('btnBajaOmnibusMoto')) {
                    b.setVisible(true);
                    //b.idreporte = parseInt(20);
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.btnMenu = LOG.util.UIManager.createBtn({
            text: _this.idioma.lbBtnReporte,
            iconCls: 'ver',
            tooltip: _this.idioma.btnTtReporte,
            menu: [
                _this.altaregvehiculo,
                _this.cartaTecnoImport,
                _this.cartaTecnoTex,
                _this.facturaOficTecnoImport,
                _this.facturaOficTecnoTex,
                _this.modeloMov,
                _this.anexoHoja4,
                _this.anexoHoja5,
               // _this.movInventario,
                //----------------------
                _this.bajaTecniProva,
                _this.bajaTecniPorDesarmeGavi,
                _this.bajaAnexodos,
                _this.bajaProvAnexodos,
                _this.bajaAnexotres,
                _this.presBajaTur,
                _this.solisitudBTurAutos,
                _this.solisitudBOmnibus
            ]
        });

        this.addToolbarButton(this.btnMenu);

        this.btnGuardar = new LOG.util.Prototipos.botonGuardar({
            disabled: true,
            tooltip: _this.idioma.ttBtnGuardar,
            handler: function(){
                var modifrecor = _this.getStorePrincipal().getModifiedRecords();
                var arraydatos = [];

                Ext.each(modifrecor, function(r){
                    if (r.data.valor != "") {
                        arraydatos.push(r.data);
                    }
                });
                _this.modelo.getGuardar(arraydatos, _this.scope.idestructura);
            }

        });
        this.addToolbarButton(_this.btnGuardar);
        this.addToolbarButton('->');

        this.addToolbarButton(LOG.util.Prototipos.botonAyuda({
            id:'idlecturasrecursos'
        }));
    },

    getHabilitarRepores: function(idreporte){
        var _this = this;
        Ext.each(_this.btnMenu.menu.items.items, function(r){
            if (r.idreporte != idreporte) {
                r.enable();
                r.disabled = false;
            }
        });
    },

    render: function() {
        var _this = this;

        var vista = LOG.confreporte.ventana.superclass.render.call(this);

        _this.getStorePrincipal().on({
            'beforeload': function(store) {
                var idreporte = parseInt(-1);
                Ext.each(_this.btnMenu.menu.items.items, function(r){
                    if (r.idreporte && r.disabled && _this.scope.treeMenu.selModel.selNode != null) {
                        idreporte = parseInt(r.idreporte);
                    }
                });
                store.initBaseParams.idreporte = idreporte;
            },
            'load': function(store) {
                //store.initBaseParams.idreporte = idreporte;
                _this.btnGuardar.disable();
            }
        });

        _this.smGridPrincipal.on({
            'rowselect': function(sm) {

            },
            'rowdeselect': function(sm) {

            }
        });
        return vista;

    }
});

Ext.ns('LOG.confreporte');
LOG.confreporte.Vista = Ext.extend(Ext.Viewport, {
    idreporte: 'tab',
    layout: 'border',
    constructor: function (config) {
        var _this = this;
        //this.idioma = config.idioma;
        Ext.apply(this, config);
        /**
         *  Árbol para la navegación
         */

        this.radioarea = new Ext.form.Radio({
            autoHeight: true,
            checked: true,
            boxLabel: 'Area de responsabilidad',
            name: 'fav-color',
            inputValue: 'red',
            aling: 'center'

        });
        this.radioEntidad = new Ext.form.Radio({
            autoHeight: true,
            checked: false,
            boxLabel: 'Entidad',
            name: 'fav-color',
            inputValue: 'red',
            aling: 'center',
            listeners:{
                'check': function(e, a){
                    _this.concepto = (a) ? 3 : 5;
                    _this.treeMenu.getLoader().load(_this.treeMenu.getRootNode(), function(){
                        _this.treeMenu.getRootNode().expand();
                    });
                    _this.tabContenido.getHabilitarRepores(-1);
                    _this.tabContenido.getStorePrincipal().load({
                        params:{
                            idestructura: 0,
                            idreporte: -1
                        }
                    });

                    _this.idestructura = 0;

                }
            }
        });
        _this.concepto = 5;
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructura',
            listeners: {
                'beforeload': function (atreeloader, anode, obj) {
                    atreeloader.baseParams.idconcepto = _this.concepto;
                },
                'load': function (loader, node, respo) {
                    var resp = Ext.decode(respo.responseText);
                    Ext.each(resp.datos, function(r){
                        _this.addNodoTree(r.deposito, r.iddeposito, null, null, true, r);
                    });
                }
            }
        });

        this.treeMenu = new Ext.tree.TreePanel({
            title: "Areas de responsabilidad / Entidades",
            region: 'west',
            id: 'idconfreporte',
            width: 365,
            minSize: 175,
            maxSize: 500,
            collapsible: true,
            margins: '0 0 0 0',
            cmargins: '0 0 0 0',
            //rootVisible: false,
            lines: false,
            autoScroll: true,
            titleCollapse: true,
            loader: _this.loader,
            tbar: [this.radioarea, "    ",this.radioEntidad],
            root: new Ext.tree.AsyncTreeNode({
                //text: 'Areas',
                draggable: false,
                expanded: true,
                id: '0'
            })

        });

        var idioma = LOG.util.UIManager.apply(LOG.confreporte.Idioma, LOG.util.Idioma);
        this.tabContenido = new LOG.confreporte.ventana({
            idioma: idioma,
            acciones: acciones_reportes,
            scope: _this
        });
        this.tabContenido.init();
        this.items = [_this.treeMenu, this.tabContenido.view({
            region: 'center',
            title: 'Configurar campos'

        })];
        LOG.confreporte.Vista.superclass.constructor.call(this, config);
    },

    addNodoTree: function (text, id, urlController, deposito, isTemplate, datosnodo) {
        var _this = this;
        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: text,
            id: id,
            iconCls: 'historial',
            //urlController: urlController,
            deposito: deposito,
            isTemplate: isTemplate,
            listeners: {
                'click': function (nodo, evento) {
                    _this.selectTab(nodo, datosnodo);
                }
            }
        }));
    },
    selectTab: function (nodo, datosnodo) {
        var _this = this;
        this.idestructura = datosnodo.iddeposito;
        _this.tabContenido.getStorePrincipal().initBaseParams.idestructura = datosnodo.iddeposito;
        _this.tabContenido.getStorePrincipal().load();

    }

});
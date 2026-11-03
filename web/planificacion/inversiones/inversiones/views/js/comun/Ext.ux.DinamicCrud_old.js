var perfil = eval(uneval(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
if (!Ext.ux)
    Ext.ns("Ext.ux.DinamicCrud");

Ext.ux.DinamicCrud = Ext.extend(Ext.grid.GridPanel, {
    columnmodel:[],
    constructor:function (config) {
        if (config.store) {
            this.store = config.store;
            for (var i = 0; i < this.store.fields.items.length; i++) {
                var obj_cm = {};
                Ext.apply(obj_cm, this.store.fields.items[i]);
                obj_cm.dataIndex = this.store.fields.items[i].name;
                obj_cm.id = this.store.fields.items[i].name;
                obj_cm.sortable = true;
                if (obj_cm.header) {
                    this.columnmodel.push(obj_cm);
                }
            }
        }
        else {
            console.error('No store passed');
        }
        this.cm = config.cm || new Ext.grid.ColumnModel(this.columnmodel);
        this.loadMask = true;
        this.bbar = new Ext.PagingToolbar({
            pageSize:config.pageSize || 20,
            store:this.store,
            id:'ptb_' + config.id,
            displayInfo:true
        });
        this.key_map = new Ext.KeyMap(Ext.getBody(), [
            {
                key:'i',
                alt:true,
                scope:this,
                stopEvent:true,
                fn:function (_this) {
                    if (!Ext.getCmp('btn_add_' + config.id).disabled) {
                        Ext.getCmp('btn_add_' + config.id).handler.call(this);
                    }
                }
            },
            {
                key:'m',
                alt:true,
                scope:this,
                stopEvent:true,
                fn:function (_this) {
                    if (!Ext.getCmp('btn_mod_' + config.id).disabled) {
                        Ext.getCmp('btn_mod_' + config.id).handler.call(this);
                    }
                }
            },
            {
                key:Ext.EventObject.DELETE,
                scope:this,
                stopEvent:true,
                fn:function (_this) {
                    if (!Ext.getCmp('btn_del_' + config.id).disabled) {
                        Ext.getCmp('btn_del_' + config.id).handler.call(this);
                    }
                }
            }
        ]);
        this.buttons = [
            {
                icon:perfil.dirImg + 'cancelar.png',
                iconCls:'btn',
                text:'Cancelar',
                handler:function () {
                    console.debug('Cancelar');
                }
            },
            {
                icon:perfil.dirImg + 'aplicar.png',
                iconCls:'btn',
                text:'Aplicar',
                handler:function () {
                    console.debug('Aplicar');
                }
            },
            {
                icon:perfil.dirImg + 'aceptar.png',
                iconCls:'btn',
                text:'Aceptar',
                handler:function () {
                    console.debug('Aceptar');
                }
            }
        ];
        if (config.form) {
            this.form = config.form;
            this.hiddenfield = new Ext.form.Hidden({
                id:'id' + this.form.name
            });
            this.form.add(this.hiddenfield);
        }
        else
            console.error("No form passed");
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect:false,
            listeners:{
                rowselect:{
                    fn:function (_this, row_index, record) {
                        if (_this.getSelections().length > 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).disable();
                        }
                        if (_this.getSelections().length == 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).enable();
                        }
                    },
                    scope:this
                },
                rowdeselect:{
                    fn:function (_this, row_index, record) {
                        if (_this.getSelections().length == 0) {
                            Ext.getCmp('btn_del_' + this.id).disable();
                            Ext.getCmp('btn_mod_' + this.id).disable();
                        }
                        if (_this.getSelections().length > 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).disable();
                        }
                        if (_this.getSelections().length == 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).enable();
                        }
                    },
                    scope:this
                }
            }
        });
        this.gestwindow = new Ext.Window({
            layout:'fit',
            listeners:{
                hide:{
                    fn:function (_this) {
                        this.key_map.enable();
                        this.form.cascade(function (c) {
                            if (typeof c.reset == 'function') {
                                c.reset();
                            }
                        });
                    },
                    scope:this
                },
                show:{
                    fn:function (_this) {
                        this.key_map.disable();
                    },
                    scope:this
                }
            },
            closeAction:'hide',
            buttons:[
                {
                    icon:perfil.dirImg + 'cancelar.png',
                    iconCls:'btn',
                    scope:this,
                    text:'Cancelar',
                    handler:function () {
                        this.gestwindow.hide();
                    }
                },
                {
                    icon:perfil.dirImg + 'aplicar.png',
                    iconCls:'btn',
                    scope:this,
                    text:'Aplicar',
                    handler:function () {
                        this.addOrModConcept('apl');
                    }
                },
                {
                    icon:perfil.dirImg + 'aceptar.png',
                    iconCls:'btn',
                    scope:this,
                    text:'Aceptar',
                    handler:function () {
                        this.addOrModConcept('acp');
                    }
                }
            ]
        });
        this.tbar = config.tbar || [
            {
                icon:perfil.dirImg + 'adicionar.png',
                iconCls:'btn',
                scope:this,
                id:'btn_add_' + config.id,
                text:'Adic<u>i</u>onar',
                tooltip:'Adicionar ' + this.form.id + ' <b>(Alt+I)</b>',
                handler:function () {
                    this.openGestWindow('add');
                }
            },
            {
                icon:perfil.dirImg + 'modificar.png',
                iconCls:'btn',
                scope:this,
                text:'<u>M</u>odificar',
                id:'btn_mod_' + config.id,
                disabled:true,
                tooltip:'Modificar ' + this.form.id + ' <b>(Alt+M)</b>',
                handler:function () {
                    this.openGestWindow('mod');
                }
            },
            {
                icon:perfil.dirImg + 'eliminar.png',
                iconCls:'btn',
                text:'Eliminar',
                scope:this,
                disabled:true,
                tooltip:'Eliminar ' + this.form.id + ' <b>(DEL)</b>',
                id:'btn_del_' + config.id,
                handler:function () {
                    this.deleteConcept();
                }
            }
        ];
        if (config.showBBarButtons) {
            this.buttons = config.buttons || this.buttons;
        } else {
            this.buttons = [];
        }
        if (config.doFilters) {
            var filters = [];
            for (var i = 0; i < this.store.fields.items.length; i++) {
                var obj_filter = {};
                if (this.store.fields.items[i].filter) {
                    Ext.apply(obj_filter, this.store.fields.items[i]);
                    obj_filter.dataIndex = this.store.fields.items[i].name;
                    filters.push(obj_filter);
                }
            }
            this.gridFilters = new Ext.grid.GridFilters({
                filters:filters
            });
            this.plugins = this.gridFilters;
        }
        if (config.showTBarButtons) {
            this.tbar = config.tbar || this.tbar;
        } else {
            this.tbar = null;
        }
        Ext.applyIf(config, {
            name:'',
            frame:true,
            showTBarButtons:false,
            showBBarButtons:false,
            doFilters:false,
            listeners:{
                show:{
                    fn:function () {
                        Ext.getCmp('btn_add_' + config.id).focus();
                    },
                    scope:this
                }
            }
        })
        Ext.ux.DinamicCrud.superclass.constructor.call(this, config);
    },
    getForm:function () {
        this.form.render(Ext.getBody());
        return this.form;
    },
    openGestWindow:function (caso) {
        this.gestwindow.add(this.getForm());
        if (caso == 'add') {
            this.gestwindow.buttons[1].enable();
            this.gestwindow.buttons[1].show();
            this.gestwindow.setTitle('Adicionar ' + this.form.id);
            this.gestwindow.show();
        }
        else if (caso == 'mod') {
            this.gestwindow.setTitle('Modificar ' + this.form.id);
            this.gestwindow.buttons[1].disable();
            this.gestwindow.buttons[1].hide();
            Planificacion.maskElement(Ext.getBody());
            this.form.getForm().load({
                    url:'cargardatos' + this.form.name,
                    params:{
                        idselected:this.selModel.getSelected().id
                    },
                    failure:function (form, action) {
                        var response = action.result[0];
                        Planificacion.unmaskElement(Ext.getBody());
                        for (var property in response) {
                            console.info(property + '_' + this.form.name);
                            if (this.form.getForm().findField(property + '_' + this.form.name))
                                this.form.getForm().findField(property + '_' + this.form.name).setValue(response[property]);
                            if (this.form.getForm().findField(property))
                                this.form.getForm().findField(property).setValue(response[property]);
                        }
                        this.gestwindow.show();
                    },
                    scope:this
                }
            )
            ;
        }

    },
    addOrModConcept:function (btn) {
        if (this.form.getForm().isValid()) {
            var name = this.form.name;
            Planificacion.mostrarMascara('mask_add' + this.form.name, "Por favor espere", "Aplicando cambios...");
            this.form.getForm().submit({
                url:'insert_update' + this.form.name,
                failure:function (form, action) {
                    Planificacion.ocultarMascara('mask_add' + name)
                    var response = action.result;
                    this.store.reload({
                        params:{
                            start:0,
                            limit:20
                        },
                        scope:this,
                        callback:function () {
                            if (response.cod >= 0) {
                                var accion = 'adicionado';
                                if (!response.nomod)
                                    var accion = 'modificado';
                                if (btn == 'acp')
                                    this.gestwindow.hide();
                                else
                                    this.gestwindow.fireEvent('hide');
                                mostrarMensaje(1, "El " + this.form.id + " se ha " + accion + " correctamente");
                            } else if (response.cod == -1) {
                                mostrarMensaje(3, "No pueden haber dos " + this.form.id + "s con la misma denominacion");
                            }
                        }
                    });
                },
                scope:this
            });
        }
    },
    deleteConcept:function () {
        var name = this.form.name;
        var _this = this;
        mostrarMensaje(2, "Está seguro que quiere eliminar el(los) " + this.form.id + "(s) seleccionado(s)", function (btnpressed) {
            if (btnpressed == "ok") {
                Ext.Ajax.request({
                    scope:this,
                    url:'eliminar' + name,
                    params:{
                        todelete:Ext.encode(_this.getSelectionsIds())
                    },
                    callback:function (options, success, response) {
                        response = Ext.decode(response.responseText);
                        _this.store.reload({
                            callback:function () {
                                if (response.cod.length == 0) {
                                    mostrarMensaje(1, "El(los) " + name + "(s) ha(n) sido eliminado(s) correctamente");
                                } else if (response.cod.length > 0) {
                                    mostrarMensaje(3, "Existen un(os) " + name + "(s) que no ha(n) sido eliminado(s) debido a que está(n) en uso");
                                }
                            }
                        });
                    }
                });
            }
        })
    },
    getSelectionsIds:function () {
        var result = [];
        if (this.selModel.hasSelection()) {
            var selection = this.selModel.getSelections();
            for (var i = 0; i < selection.length; i++) {
                result.push(selection[i].id);
            }
        }
        return result;
    },
    addBinding:function (binding) {
        this.key_map.addBinding(binding);
    }
})
;
/**
 * @namespace Ext.notificaciones.gestionarGruposGrupos
 */
Ext.ns('Ext.notificaciones.gestionarGruposGrupos');
Ext.notificaciones.gestionarGruposGrupos.StoreClass = {
    mostrargrupos: new Ext.data.JsonStore({
        url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargargrupos',
        root: 'grupos',
        totalProperty: 'total',
        fields:['idcontacto', 'contacto','iddestinatario']
    })
};

Ext.notificaciones.gestionarGruposGrupos.ListarGrupos = Ext.extend(Ext.grid.GridPanel, {
    columnWidth:    .5,
    frame: true,
    gridContactos: null,
    initComponent: function(){
        this.height =  this.altura  ? this.altura : 350;
        this.title = this.labels.ttDistributionLists;
        this.selModel =    new Ext.grid.RowSelectionModel({
            singleSelect:   true
        });
        this.store = new Ext.data.JsonStore({
            url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargargrupos',
            root: 'grupos',
            totalProperty: 'total',
            fields:['idcontacto', 'contacto','iddestinatario'],
            listeners: {
                'load': function(){
                    if(this.rendered){
                        this.fireEvent('grupodeseleccionado');
                    }
                },
                scope: this
            }
        });
        var self = this;
        this.loadMask = {
            msg: this.labels.lbLoading
        };
        this.columns = [{
            dataIndex:  'contacto',
            header:     this.labels.ttDistributionListsName,
            sortable:   true,
            width:      250
        }],
        this.bbar = new Ext.PagingToolbar({
            pageSize:       10,
            store:          this.store,//Ext.notificaciones.gestionarGruposGrupos.StoreClass.mostrargrupos,
            displayInfo:    false
        //displayMsg:     '',
        //emptyMsg:       ''//this.labels.emptyMsg
        }),
        this.tbar = this.withoutTbar ? null : new Ext.Toolbar({
            items: [{
                xtype:      'button',
                text:       this.labels.actions.add,
                //icon:       perfil.dirImg + 'adicionar.png',
                tooltip:    this.labels.ttipAddDistributionList,
                iconCls:    'adicionar',
                handler: function(){
                    self.MostrarAddGrupos.call(self, true);
                }
            },{
                xtype:      'button',
                text:       this.labels.actions.upd,
                disabled:   true,
                //icon:       perfil.dirImg + 'modificar.png',
                tooltip:    this.labels.ttipUpdDistributionList,
                iconCls:    'modificar',
                handler: function(){
                    self.MostrarAddGrupos.call(self, false);
                }
            },{
                xtype:      'button',
                text:       this.labels.actions.del,
                tooltip: this.labels.ttipDelDistributionList,
                disabled:   true,
                //icon:       perfil.dirImg + 'eliminar.png',
                iconCls:    'eliminar',
                handler: function(){
                    var store = self.getStore();
                    var record = self.getSelectionModel().getSelected();
                    self.Eliminar.call(self, store, record);
                }
            }
            ]
        });
        this.selModel.on('rowselect', function(sm, rowIndex, record){
            if(!this.withoutTbar){
                this.enableAll(true);
            }
            this.fireEvent('gruposeleccionado', {
                idgrupo: record.data.idcontacto,
                iddestinatario: record.data.iddestinatario
            });
        }, this);

        this.selModel.on('rowdeselect', function(sm){
            if(!this.withoutTbar){
                this.enableAll(false);
            }
            this.fireEvent('grupodeseleccionado');
        }, this);
        this.store.load({
            params : {
                start: 0,
                limit: 10
            }
        });
        Ext.notificaciones.gestionarGruposGrupos.ListarGrupos.superclass.initComponent.call(this);
    },
    enableAll: function(enable){
        var toolbar = this.getTopToolbar();
        if (enable){
            toolbar.items.items[1].enable();
            toolbar.items.items[2].enable();
        }
        else{
            toolbar.items.items[1].disable();
            toolbar.items.items[2].disable();
        }
    },
    Eliminar: function(store, record){
        if(!record){
            record = this.selModel.getSelected();
            if(!record) return;
        }
        fn = function(btn){
            if(btn == 'yes'){
                if(isDefined('Secodena')) Secodena.mostrarMascara('mask-del-group', this.labels.waitTitle, this.labels.msgWaitDelGroup);
                Ext.Ajax.request({
                    url: '/herramientas/notificaciones/index.php/gestdestinatarios/eliminardestinatario',
                    params: {
                        iddestinatario:  record.data.iddestinatario
                    },
                    callback: function(opt, success, response){
                        if(success){
                            if(isDefined('Secodena')) Secodena.ocultarMascara('mask-del-group');
                            store.load({
                                params: {
                                    start: 0,
                                    limit: 10
                                }
                            });
                            this.enableAll(false);
                            var scope = this;
                            mostrarMensaje(7, this.labels[Ext.decode(response.responseText).msgLabel]);
                            scope.getTopToolbar().items.items[0].focus(false, 200);
                            this.fireEvent('grupodeseleccionado');
                            var btnAcept = Ext.getCmp('btn-accept-save-notification');
                            if(!btnAcept.tab1 && !btnAcept.tab3){
                                btnAcept.setDisabled(false);
                                btnAcept.tab2 = true;
                            }
                        }
                    },
                    scope: this
                });
            }
            this.getTopToolbar().items.items[0].focus(false, 200);
        };
        Ext.Msg.confirm(this.labels.ttAlerta, this.labels.confirmDelGroup, fn, this);
    },
    MostrarAddGrupos:   function(add){
        if(!add && !this.selModel.getSelected())return;
        if (this.winAddGrupos == null){
            this.winAddGrupos = new Ext.notificaciones.gestionarGrupos.AdicionarGrupos({
                gridReference: this,
                labels: this.labels,
                adicionar: add,
                listeners: {
                    show: function(){
                        this.items.items[0].items.items[0].focus(false, 200);
                    },
                    close: function(){
                        this.gridReference.getTopToolbar().items.items[0].focus(false, 200);
                    },
                    hide: function(){
                        this.gridReference.getTopToolbar().items.items[0].focus(false, 200);
                    },
                    destroy: function(){
                        this.gridReference.getTopToolbar().items.items[0].focus(false, 200);
                    }
                }
            });
            this.winAddGrupos.show();
        }
    }
});
Ext.reg("gestionarGruposGrupos.listarGrupos", Ext.notificaciones.gestionarGruposGrupos.ListarGrupos);


Ext.notificaciones.gestionarGruposGrupos.AdicionarGrupo2Destinatarios = Ext.extend(Ext.Window, {
    closeAction:     'hide',
    modal:           true,
    frame:           true,
    width:           300,
    heigth:          300,
    initComponent: function(){
        this.title = this.labels.ttSelectDistributionList;
        this.grupoSeleccionado = null;
        this.gpListarGrupos = new Ext.notificaciones.gestionarGruposGrupos.ListarGrupos({
            withoutTbar:      true,
            labels:           this.labels,
            listeners: {
                'gruposeleccionado': function(o){
                    this.grupoSeleccionado = o;
                    this.enableBtns(true);
                },
                'grupodeseleccionado': function(){
                    this.grupoSeleccionado = null;
                    this.enableBtns(false);
                },
                scope: this
            }
        });
        this.items = [this.gpListarGrupos];
        this.buttons =  [{
            xtype:  'button',
            text:   this.labels.actions.cancel,
            //icon:       perfil.dirImg + 'cancelar.png',
            tooltip: this.labels.ttipCancelBtn,
            iconCls:    'cancelar',
            handler: function(){
                this.hide();
            },
            scope: this
        },{
            xtype:  'button',
            text:   this.labels.actions.apply,
            //icon:       perfil.dirImg + 'aplicar.png',
            tooltip: this.labels.ttipApplyBtn,
            disabled: true,
            iconCls:    'aplicar',
            handler: function(){
                this.sendValues.call(this, this.grupoSeleccionado);
            },
            scope: this
        },{
            xtype:  'button',
            text:   this.labels.actions.accept,
            //icon:       perfil.dirImg + 'aceptar.png',
            tooltip: this.labels.ttipAcceptBtn,
            iconCls:    'aceptar',
            disabled: true,
            handler: function(){
                this.sendValues.call(this, this.grupoSeleccionado);
                this.hide();
            },
            scope: this
        }];
        Ext.notificaciones.gestionarGruposGrupos.AdicionarGrupo2Destinatarios.superclass.initComponent.call(this);
    },
    enableBtns: function(enable){
        if(enable){
            this.buttons[1].enable();
            this.buttons[2].enable();
        }
        else{
            this.buttons[1].disable();
            this.buttons[2].disable();
        }
    },
    sendValues: function(){
        Ext.Ajax.request({
            url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargarpersonasfromgrupo',
            params: {
                iddestinatario: this.grupoSeleccionado.iddestinatario,
                start: 0,
                limit: Number.MAX_VALUE
            },
            callback: function(opt, success, response){
                if(success){
                    personas = Ext.decode(response.responseText).datos;

                }
            }
        });
    }
});
//----------------------------------------------------------------------------------------------

/**
 * @namespace Ext.notificaciones.gestionarGruposContactos *
 * */
//-------------------------------------------------------------------------------------------
Ext.ns('Ext.notificaciones.gestionarGruposContactos');
Ext.notificaciones.gestionarGruposContactos.DestinatariosOfGroups = Ext.extend(Ext.grid.GridPanel, {
    columnWidth: .5,
    frame: true,
    listeners: {
        'groupchanged': function(o){
            this.idgrupo = o ? o.idgrupo : o;
            this.iddestinatario = o ? o.iddestinatario : o;
            this.enableAll((o !== null), false);
            this.store.baseParams = {
                iddestinatario: this.iddestinatario
            };
            this.store.load({
                params: {
                    start: 0,
                    limit: 10
                }
            });
        }
    },
    initComponent: function(){
        this.height =  this.altura ? this.altura : 350;
        this.title = this.labels.ttUsers;
        this.selModel = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });
        this.loadMask = {
            msg: this.labels.lbLoading
        };

        this.store = new Ext.data.JsonStore({
            url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargarpersonasfromgrupo',
            root: 'datos',
            totalProperty: 'total',
            fields: ['idpersona', 'nombre']
        });
        this.idgrupo = null;
        this.iddestinatario = null;
        this.columns = [{
            dataIndex:  'nombre',
            header:     this.labels.lbDestinatariosName,
            sortable:   true,
            width:      250
        }];
        if(!this.withoutTbar){
            this.tbar = new Ext.Toolbar({
                items:[{
                    xtype: 'button',
                    text:  this.labels.actions.add,
                    //icon:       perfil.dirImg + 'adicionar.png',
                    tooltip: this.labels.ttipAddUser2Group,
                    disabled: true,
                    iconCls:    'adicionar',
                    handler: function(){
                        this.mostrarPersonas.call(this, arguments)
                    },
                    scope: this
                }, {
                    xtype:     'button',
                    text:      this.labels.actions.del,
                    tooltip: this.labels.ttipDelUserFromGroup,
                    disabled:   true,
                    //icon:      perfil.dirImg + 'eliminar.png',
                    iconCls:   'eliminar',
                    handler: function(){
                        var store = this.getStore();
                        var records = this.getSelectionModel().getSelections();
                        this.Eliminar(this, store, records);
                    },
                    scope: this
                }]
            });
        }
        this.bbar = new Ext.PagingToolbar({
            pageSize:       10,
            store:          this.store,
            displayInfo:    false
        //displayMsg: '',
        //emptyMsg: ''
        });
        this.selModel.on('rowselect', function(sm, rowIndex, record){
            this.enableAll(true, true);
        }, this);
        this.selModel.on('rowdeselect', function(sm){
            if(sm.getSelections().length == 0){
                this.enableAll(true, false);
            }
        }, this);
        Ext.notificaciones.gestionarGruposContactos.DestinatariosOfGroups.superclass.initComponent.call(this);
    },
    enableAll: function(add, del){
        if(!this.withoutTbar){
            var addBtn = this.getTopToolbar().items.items[0];
            var delBtn = this.getTopToolbar().items.items[1];
            add ? addBtn.enable() : addBtn.disable();
            del ? delBtn.enable() : delBtn.disable();
        }
    },
    Eliminar: function(scope, store, records){
        if(!records){
            records = scope.getSelectionModel().getSelections();
            if(records.length == 0) return;
        }
        var msg = (records.length > 1) ? this.labels.confirmDelPersonFromGroupP : this.labels.confirmDelPersonFromGroup;
        Ext.Msg.confirm(this.labels.ttAlerta, msg, function(btn){
            if(btn == 'yes'){
                if(isDefined('Secodena')) Secodena.mostrarMascara('mask-del-personfromgroup', this.labels.waitTitle, this.labels.msgWaitDelPerson2Group);
                personas = [];
                Ext.each(records, function(item, index, all){
                    personas.push(item.data.idpersona);
                }, scope);
                Ext.Ajax.request({
                    url: '/herramientas/notificaciones/index.php/gestdestinatarios/eliminarpersonasfromgroup',
                    params: {
                        grupo: scope.idgrupo,
                        personas: Ext.encode(personas)
                    },
                    callback: function(opt, success, response){
                        if(success){
                            if(isDefined('Secodena')) Secodena.ocultarMascara('mask-del-personfromgroup');
                            mostrarMensaje(7, scope.labels[Ext.decode(response.responseText).msgLabel]);
                            scope.getTopToolbar().items.items[0].focus(false, 200);
                            scope.changeGroup(scope.getCurrentGroup());
                            var btnAcept = Ext.getCmp('btn-accept-save-notification');
                            if(!btnAcept.tab1 && !btnAcept.tab3){
                                btnAcept.setDisabled(false);
                                btnAcept.tab2 = true;
                            }
                        }
                    }
                });
            }
            else{
                scope.getTopToolbar().items.items[0].focus(false, 200);
            }
        }, scope);
    },
    mostrarPersonas: function(){
        if(!this.idgrupo) return;
        Ext.notificaciones.gestionarDestinatarios.ShowWinBuscarPersona(this, function(win, rec){
            if(rec.hasOwnProperty('idpersona')){
                var scope = this;
                var fn = function(){
                    scope.store.load({
                        params: {
                            iddestinatario: this.iddestinatario,
                            start: 0,
                            limit: 10
                        }
                    });
                    scope.getTopToolbar().items.items[0].focus();
                };
                if(isDefined('Secodena')) Secodena.mostrarMascara('mask-add-person2group', this.labels.waitTitle, this.labels.msgWaitAsignPerson2Group);
                Ext.Ajax.request({
                    url: '/herramientas/notificaciones/index.php/gestdestinatarios/asignarpersonaagrupo',
                    params: {
                        idpersona: rec.idpersona,
                        idgrupo: this.idgrupo
                    },
                    callback: function(opt, success, response){
                        if(success){
                            if(isDefined('Secodena')) Secodena.ocultarMascara('mask-add-person2group');
                            mostrarMensaje(7, this.labels[Ext.decode(response.responseText).msgLabel]);
                            fn();
                            var btnAcept = Ext.getCmp('btn-accept-save-notification');
                            if(!btnAcept.tab1 && !btnAcept.tab3){
                                btnAcept.setDisabled(false);
                                btnAcept.tab2 = true;
                            }
                        }
                    },
                    scope: this
                });
            }
        }, function(){
            this.getTopToolbar().items.items[0].focus();
        });
    },
    changeGroup: function(o){
        this.fireEvent('groupchanged', o);
    },
    getCurrentGroup: function(){
        return {
            idgrupo: this.idgrupo,
            iddestinatario: this.iddestinatario
        };
    }
});

//-------------------------------------------------------------------------------------------

Ext.notificaciones.gestionarGruposContactos.TabContenedor = Ext.extend(Ext.Panel,{
    frame: true,
    layout: 'fit',
    listeners: {
        render: function(){
            var groups = this.listarGrupos;
            var users = this.listarDestinatariosOfGroup;
            //key map
            this.keyMapping = new Ext.KeyMap(this.getId(), [{//distribution lists hotkeys
                key: 'i',
                alt: true,
                ctrl: false,
                fn: groups.MostrarAddGrupos.createDelegate(groups, [true])
            },{
                key: 'm',
                alt: true,
                ctrl: false,
                fn: groups.MostrarAddGrupos.createDelegate(groups, [false])
            },{
                key: Ext.EventObject.DELETE,
                ctrl: false,
                alt: false,
                fn: groups.Eliminar.createDelegate(groups, [groups.getStore()])
            },{//users hotkeys
                key: 'i',
                alt: true,
                ctrl: true,
                fn: users.mostrarPersonas.createDelegate(users)
            },{
                key: Ext.EventObject.DELETE,
                ctrl: true,
                alt: false,
                fn: users.Eliminar.createDelegate(users, [users])
            }]);
            //end key map
        }
    },
    initComponent: function(){
        this.title = this.title ? this.title : this.labels.ttGestDistributionList;
        this.listarGrupos = new Ext.notificaciones.gestionarGruposGrupos.ListarGrupos({
            altura: this.withoutTbar ? 390 : 350,
            labels: this.labels,
            withoutTbar: this.withoutTbar | false,
            listeners: {
                'gruposeleccionado' : function(o){
                    this.listarDestinatariosOfGroup.changeGroup(o);
                },
                'grupodeseleccionado': function(){
                    this.listarDestinatariosOfGroup.changeGroup(null);
                },
                scope: this
            }
        });
        this.listarDestinatariosOfGroup = new Ext.notificaciones.gestionarGruposContactos.DestinatariosOfGroups({
            altura: this.withoutTbar ? 390 : 350,
            labels: this.labels,
            disabled: this.panelDisabled ? this.panelDisabled : false,
            withoutTbar: this.withoutTbar | false
        });
        this.listarDestinatariosOfGroup.getStore().on('load', function(st, records, opts){
            this.fireEvent('groupchanged', records);
        }, this);
        this.items = [{
            xtype: 'panel',
            layout: 'column',
            items: [this.listarGrupos, this.listarDestinatariosOfGroup]
        }];
        Ext.notificaciones.gestionarGruposContactos.TabContenedor.superclass.initComponent.call(this);
    },
    getGpGrupos: function(){
        return this.listarGrupos;
    },
    getGpPersonas: function(){
        return this.listarDestinatariosOfGroup;
    }
});
Ext.reg("gestionarGruposContactos.TabContenedor", Ext.notificaciones.gestionarGruposContactos.TabContenedor);

//----------------------------------------------------------------------------------------
/**
 *  @namespace Ext.notificaciones.gestionarGrupos
 */
Ext.ns('Ext.notificaciones.gestionarGrupos');
Ext.notificaciones.gestionarGrupos.AdicionarGrupos = Ext.extend(Ext.Window, {
    width:           300,
    heigth:          100,
    closeAction:     'close',
    frame:           true,
    modal:           true,
    gridReference:   null,
    initComponent: function(){
        var self = this;
        this.items = [{
            xtype:      'form',
            id:         'addgrupos_form_id',
            layout:     'form',
            width:      '100%',
            frame:      true,
            labelAlign: 'top',
            items:  [{
                xtype:          'textfield',
                name:           'nombre',
                id:             'nombre_grupo',
                nextTab: 'btn-cancel-add-list',
                fieldLabel:     this.labels.ttDistributionListsName,
                //vtype: 'alphanum',
                maxLength:      30,
                minLength:      1,
                width:          '100%',
                allowBlank:     false
            }]
        }];
        this.buttons =  [{
            xtype:  'button',
            id: 'btn-cancel-add-list',
            nextTab: 'btn-accept-add-list',
            text:   this.labels.actions.cancel,
            //icon:       perfil.dirImg + 'cancelar.png',
            tooltip: this.labels.ttipCancelBtn,
            iconCls:    'cancelar',
            handler: function(){
                self.destroy();
            }
        },{
            xtype:  'button',
            id: 'btn-accept-add-list',
            nextTab: 'nombre_grupo',
            text:   this.labels.actions.accept,
            //icon:       perfil.dirImg + 'aceptar.png',
            tooltip: this.labels.ttipAcceptBtn,
            iconCls:    'aceptar',
            handler: this.sendValues.createDelegate(this),
            scope: this
        }];
        Ext.notificaciones.gestionarGrupos.AdicionarGrupos.superclass.initComponent.call(this);
        self.on('beforedestroy', function(){
            self.gridReference.winAddGrupos = null;
        });
        this.title = this.adicionar ? this.labels.ttAddDistributionList : this.labels.ttUpdDistributionList;
        self.on('show', function(){
            if(this.adicionar === false){
                Ext.getCmp('nombre_grupo').setValue(this.gridReference.getSelectionModel().getSelected().data.contacto);
            }
        }, this);
    },
    sendValues: function(){
        if(Ext.getCmp('addgrupos_form_id').getForm().isValid()){
            this.hide();
            if(isDefined('Secodena')) Secodena.mostrarMascara('mask-add-group', this.labels.waitTitle, this.labels.msgWaitAddGroup);
            var nombreGrupo = Ext.getCmp('nombre_grupo').getValue();
            params = {
                nombre: nombreGrupo
            };
            if(!this.adicionar){
                params.idgrupo = this.gridReference.getSelectionModel().getSelected().data.idcontacto;
            }
            Ext.Ajax.request({
                url: this.adicionar ? '/herramientas/notificaciones/index.php/gestdestinatarios/insertargrupo' :
                '/herramientas/notificaciones/index.php/gestdestinatarios/modificargrupo',
                params: params,
                callback: function(opt, success, response){
                    if(success){
                        var scope = this;
                        var fn = function(btn){
                                scope.gridReference.getTopToolbar().items.items[0].focus(false, 200);
                                var gridRef = scope.gridReference;
                                if(gridRef){
                                    gridRef.enableAll(false);
                                    gridRef.getStore().load({
                                        params: {
                                            start: 0,
                                            limit: 10
                                        }
                                    });
                                    gridRef.fireEvent('grupodeseleccionado');
                                }
                        };
                        result = Ext.decode(response.responseText);
                        if(result.codMsg){
                            if(isDefined('Secodena')) Secodena.ocultarMascara('mask-add-group');
                            mostrarMensaje(result.codMsg, result.mensaje, fn);
                            this.destroy();
                            return;
                        }
                        if(isDefined('Secodena')) Secodena.ocultarMascara('mask-add-group');
                        mostrarMensaje(7, this.labels[result.msgLabel]);
                        fn();
                        this.destroy();
                        var btnAcept = Ext.getCmp('btn-accept-save-notification');
                        if(!btnAcept.tab1 && !btnAcept.tab3){
                            btnAcept.setDisabled(false);
                            btnAcept.tab2 = true;
                        }
                    }
                },
                scope: this
            });
        }
    }
});



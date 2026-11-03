/**
 * @class gestionarEventos.ListarEventos
 * @extends Ext.grid.GridPanel
 */

Ext.ns("gestionarEventos");
gestionarEventos.ListarEventos = Ext.extend(Ext.grid.GridPanel, {
    cls: 'x-toolbar',
    id: 'gestionarEventos-ListarEventos',
    selModel: new Ext.grid.RowSelectionModel({
        singleSelect: true
    }),
    width: 150,
    height: 245,
    autoExpandColumn: 'nombre-evento',
    listeners: {
        render: function() {
            this.getTopToolbar().items.items[0].focus();
        }
    },
    initComponent: function() {
        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                    '<p>' + this.labels.lbDescription + ': {descripcion}</p><br>'
                    )
        });
        this.plugins = expander;
        this.store = new Ext.data.JsonStore({
            url: "listareventos",
            listeners:{
                'load':function(){
                    Ext.getCmp('btn-adicionar-evento').focus(200);
                }
            },
            fields: ["nombre", "descripcion", "idevento", "ejecucion", "activo", "referencia"],
            totalProperty: 'total',
            root: 'events'
        });
        this.title = this.labels.pEventTitle;
        this.columns = [expander, {
                dataIndex: 'nombre',
                id: 'nombre-evento',
                header: this.labels.lbEventName,
                sortable: true,
                width: 60,
                minlength: 1,
                maxlength: 50
            }, {
                dataIndex: 'referencia',
                header: this.labels.lbReference,
                sortable: true,
                width: 100
            }, {
                dataIndex: 'activo',
                header: this.labels.state.active,
                renderer: this.getActiveImg,
                sortable: true,
                width: 40
            }];
        this.btnAyuda = new Ext.Button({
            id: 'ayuda',
            iconCls: 'ayuda',
            text: '<b>Ayuda</b>',
            disabled: false,
            toolTip: 'Ayuda <b>(Alt+H)</b>',
            //icon: perfil.dirImg + 'ayuda.png',
            nextTab: 'btn-adicionar-aviso',
            menu: new Ext.menu.Menu({
                id: 'mainMenu',
                items: [
                    {
                        handler: function () {
                            var title = "Ayuda de la configuración de avisos";
                            var referencia = 'configuraravisos';
                            help.show(title, referencia);
                        },
                        text: 'Ayuda',
                        id: 'btnAyuRel',
                        //icon: perfil.dirImg + 'ayuda.png',
                        iconCls: 'ayuda',
                        tooltip: 'Ayuda del sistema'
                    },
                    {
                        text: 'Acerca de',
                        id: 'acercade',
                        //icon: perfil.dirImg + 'info.png',
                        iconCls: 'info',
                        tooltip: "Acerca de <b>(Alt+...s)</b>",
                        handler: function () {

                            var uri = "herramientas/notificaciones";
                            acercaDe.show(uri);
                        }}
                ]
            })

        });

        this.tbar = new Ext.Toolbar({
            xtype: 'toolbar',
            items: [{
                    xtype: 'button',
                    text: this.labels.actions.add,
                    //icon: perfil.dirImg + 'adicionar.png',
                    tooltip: this.labels.ttipAddEvent,
                    id: 'btn-adicionar-evento',
                    nextTab: 'btn-modificar-evento',
                    iconCls: 'adicionar',
                    handler: function() {

                        this.MostrarEventos.call(this, true, null);
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    text: this.labels.actions.upd,
                    disabled: true,
                    //icon: perfil.dirImg + 'modificar.png',
                    id: 'btn-modificar-evento',
                    nextTab: 'btn-eliminar-evento',
                    tooltip: this.labels.ttipUdtEvent,
                    iconCls: 'modificar',
                    handler: function() {
                        var record = this.getSelectionModel().getSelected();
                        this.MostrarEventos.call(this, false, record);
                    },
                    scope: this
                }, {
                    xtype: 'button',
                    text: this.labels.actions.del,
                    disabled: true,
                    //icon: perfil.dirImg + 'eliminar.png',
                    tooltip: this.labels.ttipDelEvent,
                    id: 'btn-eliminar-evento',
                    nextTab: 'btn-activardesactivar-evento',
                    iconCls: 'eliminar',
                    handler: function() {
                        var store = this.getStore();
                        var record = this.getSelectionModel().getSelected();
                        this.Eliminar.call(this, store, record);
                    },
                    scope: this

                }, {
                    xtype: 'button',
                    text: ' ',
                    tooltip: this.labels.ttipActDesactEvent,
                    disabled: true,
                    id: 'btn-activardesactivar-evento',
                    nextTab: 'btnAyu',
                    handler: function() {
                        var store = this.getStore();
                        var record = this.getSelectionModel().getSelected();
                        console.log(store, record);
                        this.Activar.call(this, store, record);
                    },
                    scope: this
                }, '->',  this.btnAyuda

                ]
        });
        this.bbar = new Ext.PagingToolbar({
            pageSize: 6,
            store: this.store,
            displayInfo: true,
            displayMsg: this.labels.displayMsg,
            emptyMsg: this.labels.emptyMsg
        });
        this.bbar.bind(this.store);
        this.selModel.on('rowselect', function(sm, rowIndex, record) {
            this.enableAll(true);
            var btnActivar = Ext.getCmp('btn-activardesactivar-evento');
            var action = this.labels.actions, active = Util.str2Boolean(record.json.activo);
            btnActivar.setText(active ? action.desactivate : action.activate);
            btnActivar.setIconClass('icondistra-' + (active ? 'bandera rojo' : 'bandera verde'));
        }, this);
        this.selModel.on('rowdeselect', function(sm) {
            this.enableAll(false);
        }, this);
        this.store.load({
            params: {
                start: 0,
                limit: 6
            }
        });
        gestionarEventos.ListarEventos.superclass.initComponent.call(this);
    },
    enableAll: function(enable) {
        var toolbar = this.getTopToolbar();
        if (enable) {
            toolbar.items.items[1].enable();
            toolbar.items.items[2].enable();
            toolbar.items.items[3].enable();
        }
        else {
            toolbar.items.items[1].disable();
            toolbar.items.items[2].disable();
            toolbar.items.items[3].disable();
        }
    },
    Eliminar: function(store, record) {
        var lbl = this.labels;
        var fn = function(btn) {
            if (btn == 'ok') {
                if (isDefined('Secodena'))
                    Secodena.mostrarMascara('mask-del-event', lbl.waitTitle, lbl.msgWaitDelEvent);
                Ext.Ajax.request({
                    url: '../gestnotificationevents/eliminarevento',
                    params: {
                        idevento: record.data.idevento
                    },
                    callback: function(options, success, response) {
                        if (success) {
                            if (isDefined('Secodena'))
                                Secodena.ocultarMascara('mask-del-event');
                            var o = Ext.decode(response.responseText);
                            var scope = this;
                            if (o.cod == 6) {
                                mostrarMensaje(o.cod, lbl[o.msgLabel]);
                                //if (isDefined('Secodena'))
                                //    Secodena.mostrarMascara('mask-activate-event', scope.labels.waitTitle, scope.labels.msgWaitActiveEvent);
                                Ext.Ajax.request({
                                    url: '../gestnotificationevents/activardesactivar',
                                    params: {
                                        idevento: record.data.idevento,
                                        onlyDesactivate: true
                                    },
                                    callback: function(options, success, response) {
                                        if (success) {
                                          //  if (isDefined('Secodena'))
                                            //    Secodena.ocultarMascara('mask-activate-event');
                                            o = Ext.decode(response.responseText);
                                            mostrarMensaje(6, scope.labels[o.msgLabel]);
                                        }
                                    }
                                });
                                store.load({
                                    params: {
                                        start: 0,
                                        limit: 6
                                    }
                                });
                                scope.fireEvent('eventchange');
                            }
                            else if (o.cod == 7) {
                                mostrarMensaje(7, lbl[o.msgLabel],null);
                                store.load({
                                    params: {
                                        start: 0,
                                        limit: 6
                                    }
                                });
                                scope.fireEvent('eventchange');
                            }
                            this.enableAll(false);
                        }
                    },
                    scope: this
                });
            }
        }
        mostrarMensaje(2, this.labels.confirmDelEvent, fn);
        //Ext.Msg.confirm(this.labels.ttAlerta, this.labels.confirmDelEvent, fn, this);
    },
    Activar: function(store, record) {
        if (record) {
            if (isDefined('Secodena'))
                Secodena.mostrarMascara('mask-activar-evento', this.labels.waitTitle, this.labels.msgWaitActiveEvent);
            Ext.Ajax.request({
                url: '../gestnotificationevents/activardesactivar',
                params: {
                    idevento: record.json.idevento,
                    activo: record.json.activo
                },
                callback: function(opt, success, response) {
                    if (success) {
                        if (isDefined('Secodena'))
                            Secodena.ocultarMascara('mask-activar-evento');
                        o = Ext.decode(response.responseText);
                        mostrarMensaje(7, this.labels[o.msgLabel]);
                        this.store.reload();
                        this.fireEvent('eventchange');
                        var toolbar = this.getTopToolbar();
                        toolbar.items.items[3].disable();
                    }
                },
                scope: this
            });
            this.enableAll(false);
        }
    },
    MostrarEventos: function(adicionar, datos) {
        this.winEditarEvents = new gestionarEventos.Editar_Events({
            labels: this.labels,
            adicionar: adicionar,
            datos: datos,
            gridRel: this,
            listeners: {
                datainserted: function(self, response) {
                    this.store.load({
                        params: {
                            start: 0,
                            limit: 6
                        }
                    });
                    this.fireEvent('eventchange');
                },
                show: function() {
                    if (this.docKeyMap) {
                        this.docKeyMap.disable();
                    }
                },
                hide: function() {
                    if (this.docKeyMap) {
                        this.docKeyMap.enable();
                    }
                },
                close: function() {
                    if (this.docKeyMap) {
                        this.docKeyMap.enable();
                    }
                },
                scope: this
            }
        });
        this.winEditarEvents.show();
    },
    getActiveImg: function(active) {
        return '<span class="icondistra-' + (Util.str2Boolean(active) ? 'bandera verde' : 'bandera rojo') + '"/>';
    }
});

Ext.reg("gestionarEventos.listarEventos", gestionarEventos.ListarEventos);

gestionarEventos.SelectAccion = Ext.extend(Ext.Window, {
    width: 304,
    height: 387,
    layout: 'fit',
    modal: true,
    initComponent: function() {
        this.title = this.labels.selectActionTitle;
        var _$ = this;
        this.items = [{
                xtype: 'treepanel',
                title: this.labels.actions.text,
                width: 180,
                height: 290,
                x: 200,
                y: 90,
                autoScroll: true,
                loader: new Ext.tree.TreeLoader({
                    dataUrl: 'mostrarfuncionalidades'
                }),
                root: new Ext.tree.AsyncTreeNode({
                    text: this.labels.lbSubsystems,
                    draggable: false,
                    id: '0'
                }),
                listeners: {
                    "click": function(node) {
                        _$.selectedNode = node;
                        this.IsValid(node) ? this.buttons[1].enable() : this.buttons[1].disable();
                    },
                    scope: this
                }
            }];
        _$.on('beforeclose', _$.onCancel, _$);
        this.buttons = [{
                xtype: 'button',
                text: this.labels.actions.cancel,
                tooltip: this.labels.ttCloseWindow,
                id: 'btn-cancelar-selectAction',
                prevTab: 'btn-aceptar-selectAction',
                nextTab: 'btn-aceptar-selectAction',
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                x: 340,
                y: 400,
                height: 30,
                width: 60,
                handler: function() {
                    _$.onCancel.call(_$, arguments);
                }
            }, {
                xtype: 'button',
                text: this.labels.actions.accept,
                id: 'btn-aceptar-selectAction',
                prevTab: 'btn-cancelar-selectAction',
                nextTab: 'btn-cancelar-selectAction',
                tooltip: this.labels.ttSelectAndCloseWindow,
                disabled: true,
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                x: 180,
                y: 400,
                width: 70,
                height: 30,
                handler: function() {
                    if (_$.IsValid(_$.selectedNode)) {
                        _$.fireEvent("selectednode", _$, _$.selectedNode);
                        _$.hide.call(_$, arguments);
                    }
                }
            }];
        gestionarEventos.SelectAccion.superclass.initComponent.call(this);
    },
    IsValid: function(node) {
        return (node.leaf);
    },
    onCancel: function() {
        this.hide.call(this, arguments);
    }
});

gestionarEventos.Editar_Events = Ext.extend(Ext.Window, {
    id: 'win_evet_sistem',
    validateDefault: true,
    width: 302,
    height: 370,
    modal: true,
    resizable: false,
    closeAction: 'close',
    layout: 'absolute',
    constrain : true,
    frame: true,
    adicionar: true,
    datos: null,
    initComponent: function() {
        var self = _$ = this;
        this.items = [{
                xtype: "form",
                id: "gesteventos_form_id",
                width: 480,
                x: 0,
                y: 0,
                layout: 'absolute',
                frame: true,
                height: 390,
                items: [{
                        xtype: 'label',
                        text: this.labels.lbEventName + ':',
                        x: 10,
                        y: 10
                    }, {
                        xtype: 'textfield',
                        x: 10,
                        y: 30,
                        width: 260,
                        id: 'eventName',
                        prevTab: 'btn-aceptar-editarevento',
                        nextTab: 'descripcion',
                        name: "eventName",
                        allowBlank: false,
                        maxLength: 50,
                        vtype: 'eventNameValid'

                    }, {
                        xtype: 'label',
                        text: this.labels.lbEventDesc + ':',
                        x: 10,
                        y: 60
                    }, {
                        xtype: 'textarea',
                        allowBlank: true,
                        x: 10,
                        y: 80,
                        width: 260,
                        id: 'descripcion',
                        name: "descripcion"
                    }, {
                        xtype: 'fieldset',
                        title: this.labels.lbFromAction,
                        checkboxToggle: true,
                        checkboxName: 'cbfrom_action',
                        id: 'from_action',
                        width: 260,
                        height: 140,
                        x: 10,
                        y: 150,
                        layout: 'absolute',
                        listeners: {
                            'collapse': function(fs) {
                                fs.items.items[1].disable();
                                fs.items.items[3].disable();
                                var form = Ext.getCmp("win_evet_sistem");
                                form.setHeight(250);
                            },
                            'expand': function(fs) {
                                if (fs.items.items[1].disabled)
                                    fs.items.items[1].enable();
                                if (fs.items.items[3].disabled)
                                    fs.items.items[3].enable();
                                var form = Ext.getCmp("win_evet_sistem");
                                form.setHeight(370);
                            }
                        },
                        items: [{
                                xtype: 'label',
                                text: this.labels.lbExecution + ':',
                                x: 0,
                                y: 0
                            }, {
                                xtype: 'combo',
                                x: 0,
                                y: 20,
                                width: 235,
                                allowBlank: false,
                                displayField: 'denom',
                                hiddenName: "ejecucion",
                                valueField: "ejecucion",
                                id: "cbox_ejecucion",
                                typeAhead: false,
                                mode: 'local',
                                editable: false,
                                forceSelection: true,
                                triggerAction: 'all',
                                emptyText: this.labels.lbExecutionMoment,
                                selectOnFocus: true,
                                store: new Ext.data.SimpleStore({
                                    fields: ["denom", "ejecucion", "descripcion"],
                                    data: [
                                        [this.labels.executions.pre.text, this.labels.executions.pre.key, this.labels.executions.pre.desc],
                                        [this.labels.executions.post.text, this.labels.executions.post.key, this.labels.executions.post.desc],
                                        [this.labels.executions.failed.text, this.labels.executions.failed.key, this.labels.executions.failed.desc]]
                                }),
                                tpl: '<tpl for="."><div ext:qtip="<b>{denom}</b><p><tpl if="descripcion">{descripcion}.</tpl></p> " class="x-combo-list-item">{denom}</div></tpl>'
                            }, {
                                xtype: 'label',
                                text: this.labels.actions.singularText + ':',
                                x: 0,
                                y: 50
                            }, {
                                xtype: 'textfield',
                                name: 'dirAction',
                                id: 'referencia',
                                width: 235,
                                x: 0,
                                y: 70,
                                allowBlank: false,
                                listeners: {
                                    'focus': function(tf) {
                                        if (!self.win_Accion) {
                                            self.win_Accion = new gestionarEventos.SelectAccion({
                                                labels: self.labels
                                            });
                                            self.win_Accion.on('selectednode', function(win, selectednode) {
                                                this.setValue(selectednode.id);
                                                Util.fToolTipShow(this, this.getRawValue());
                                            }, this);
                                            self.win_Accion.on('hide', function() {
                                                self.buttons[0].focus();
                                            }, this);
                                        }
                                        self.win_Accion.show();
                                    }
                                }
                            }]
                    }]
            }, {}];
        this.buttons = [{
                xtype: 'button',
                text: this.labels.actions.cancel,
                //icon: perfil.dirImg + 'cancelar.png',
                tooltip: this.labels.ttipCancelBtn,
                iconCls: 'cancelar',
                nextTab: 'btn-aplicar-editarevento',
                id: 'btn-cancelar-editarevento',
                x: 340,
                y: 400,
                height: 30,
                width: 60,
                handler: function() {
                    self.close();
                }
            }, {
                xtype: 'button',
                text: this.labels.actions.apply,
                //icon: perfil.dirImg + 'aplicar.png',
                id: 'btn-aplicar-editarevento',
                prevTab: 'btn-cancelar-editarevento',
                nextTab: 'btn-aceptar-editarevento',
                tooltip: this.labels.ttipApplyBtn,
                iconCls: 'aplicar',
                x: 260,
                y: 400,
                width: 70,
                height: 30,
                handler: function() {
                    self.sendValues.call(self, true);
                }
            }, {
                xtype: 'button',
                text: this.labels.actions.accept,
                //icon: perfil.dirImg + 'aceptar.png',
                id: 'btn-aceptar-editarevento',
                prevTab: 'btn-aplicar-editarevento',
                nextTab: 'eventName',
                tooltip: this.labels.ttipAcceptBtn,
                iconCls: 'aceptar',
                x: 180,
                y: 400,
                width: 70,
                height: 30,
                handler: function() {

                    self.sendValues.call(self, false);
                }
            }];

        this.on('show', function() {
            this.setTitle(this.adicionar ? this.labels.ttAddEvent : this.labels.ttUpdEvent);
            if (!this.adicionar && this.datos != null) {
                var eventName = Ext.getCmp('eventName');
                var descripcion = Ext.getCmp('descripcion');
                var referencia = Ext.getCmp('referencia');
                var ejecucion = Ext.getCmp('cbox_ejecucion');
                var fromAction = Ext.getCmp('from_action');
                Ext.getCmp('btn-aplicar-editarevento').hide();
                eventName.setValue(this.datos.json.nombre);
                descripcion.setValue(this.datos.json.descripcion);
                if (!this.datos.json.ejecucion && !this.datos.json.referencia) {
                    fromAction.toggleCollapse(true);
                }
                else {
                    referencia.setValue(this.datos.json.referencia);
                    ejecucion.setValue(this.datos.json.ejecucion);
                }
                if (referencia.getRawValue()) {
                    Util.fToolTipShow(referencia, referencia.getRawValue());
                }
            }
            Ext.getCmp('eventName').focus(false, 200);
        });

        gestionarEventos.Editar_Events.superclass.initComponent.call(this);
    },
    sendValues: function(apply) {
        var _$ = this;
        var basic = Ext.getCmp("gesteventos_form_id").getForm();
        if (basic.isValid()) {
            if (isDefined('Secodena'))
                Secodena.mostrarMascara('mask-editar-evento', this.labels.waitTitle, this.labels.msgWaitAddingEvent);
            var values = basic.getValues();
            if (this.adicionar) {
                basic.submit({
                    url: "insertarevento",
                    params: {
                        values: Ext.encode(values)
                    },
                    failure: function(response, action) {
                        _$.fireEvent("datainserted", _$, response);
                        if (isDefined('Secodena'))
                            Secodena.ocultarMascara('mask-editar-evento');
                        if (action.result.msgLabel) {

                            mostrarMensaje(action.result.cod, _$.labels[action.result.msgLabel]);
                            apply ? basic.reset() : _$.close();
                        }
                        else {
                            mostrarMensaje(action.result.cod, action.result.mensaje);
                        }

                    }
                });
            }
            else {
                changes = {}, aspected = false;
                oldValues = this.datos.json;
                if (values.eventName != oldValues.nombre) {
                    changes.eventName = values.eventName;
                    changes.oldName = oldValues.nombre;
                }
                if (values.descripcion != oldValues.descripcion)
                    changes.descripcion = values.descripcion;
                if (oldValues.ejecucion && oldValues.referencia)
                    aspected = true;
                if (Util.str2Boolean(aspected) !== Util.str2Boolean(values.cbfrom_action)) {
                    changes.aspectChanged = true;
                    if (values.ejecucion != oldValues.ejecucion)
                        changes.oldExecution = oldValues.ejecucion;
                    if (values.dirAction != oldValues.referencia)
                        changes.oldReference = oldValues.referencia;
                }
                if (Util.str2Boolean(values.cbfrom_action)) {
                    if (values.ejecucion != oldValues.ejecucion) {
                        changes.ejecucion = values.ejecucion;
                        changes.oldExecution = oldValues.ejecucion;
                    }
                    if (values.dirAction != oldValues.referencia) {
                        changes.fromAction = values.dirAction;
                        changes.oldReference = oldValues.referencia;
                    }
                }
                basic.submit({
                    url: 'modificarevento',
                    params: {
                        idevento: this.datos.json.idevento,
                        changes: Ext.encode(changes)
                    },
                    failure: function(response, action) {
                        _$.fireEvent("datainserted", _$, response);
                        if (isDefined('Secodena'))
                            Secodena.ocultarMascara('mask-editar-evento');
                        if (action.result.msgLabel) {
                            mostrarMensaje(action.result.cod, _$.labels[action.result.msgLabel]);
                            if (!apply){
                                _$.close();
                            }
                            else{
                                basic.reset();
                            }
                        }
                        else {
                            mostrarMensaje(action.result.cod, action.result.mensaje);
                        }
                    }
                });
            }
        }
    }

});

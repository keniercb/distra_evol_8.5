var perfil = eval(uneval(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();
Ext.ns('Ext.ux.window');
Ext.ux.window.winLoad = Ext.extend(Ext.Window, {
    layout:'border',
    currentTab:false,
    initComponent:function () {
        this.title = (this.title) ? this.title : 'Cargando datos...';
        this.layout = 'fit';
        this.width = (this.width) ? this.width : 300;
        this.height = 50;
        this.closable = false;
        this.resizable = false;
        this.modal = true;
        var mensaje = (this.mensaje) ? this.mensaje : false;
        this.items = [new Ext.ProgressBar({
            text:(mensaje) ? mensaje : "Cargando datos...",
            cls:'custom'
        })];
        this.closeAction = (this.closeAction) ? this.closeAction : 'hide';
        Ext.ux.window.winLoad.superclass.initComponent.call(this);
    },
    showMask:function () {
        var titulo = this.items.items[0].text;
        this.items.items[0].wait({
            interval:200,
            increment:15,
            fn:function () {
            }
        });
        this.items.items[0].text = titulo;
        this.show();
    },
    hideMask:function () {
        if (this.closeAction == 'destroy')
            this.destroy();
        else
            this.hide();
    },
    mostrar:function (titulo) {
        this.setTitle(titulo);
        this.items.items[0].wait({
            interval:200,
            increment:15,
            fn:function () {
            }
        });
        this.items.items[0].text = titulo;
        this.show();
    },
    ocultar:function (el) {
        this.hide(el);
    },
    setMensaje:function (newT) {
        this.items.items[0].setText(newT);
    }
});
Ext.reg('ux-winload', Ext.ux.window.winLoad);

Ext.ns("Ext.ux.DinamicCrud");
Ext.ux.DinamicCrud = Ext.extend(Ext.grid.GridPanel, {
    columnmodel:[],
    textMsg:false,
    constructor:function (config) {
        if (config.store) {
            this.columnmodel = [];
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
        if (config.textMsg) {
            this.textMsg = config.textMsg;
        }
        this.cm = config.cm || new Ext.grid.ColumnModel(this.columnmodel);
        this.loadMask = true;
        this.bbar = new Ext.PagingToolbar({
            pageSize:config.pageSize || 20,
            store:this.store,
            id:'ptb_' + config.id,
            displayInfo:true
        });

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
            modal:true,
            listeners:{
                hide:{
                    fn:function (_this) {
                        //this.keys.enable();
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
                        //this.keys.disable();
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
                tooltip:'Adicionar ' + this.form.name + ' <b>(Alt+I)</b>',
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
                tooltip:'Modificar ' + this.form.name + ' <b>(Alt+M)</b>',
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
                tooltip:'Eliminar ' + this.form.name + ' <b>(DEL)</b>',
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
            name:'concepto',
            text:'concepto',
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
        });

        this.TaskRunner = new Ext.util.TaskRunner();
        this.TimerCount = {};
        this.maskControl = {};
        this.taskMaskControl = {
            id:'taskMaskControl',
            run:function () {
                for (var a in this.TimerCount) {
                    if (this.TimerCount[a])
                        this.TimerCount[a]++;
                    if (this.TimerCount[a] == 60) {
                        if (this.maskControl[a] && this.maskControl[a] instanceof this.winLoad)
                            this.maskControl[a].destroy();
                        delete this.maskControl[a];
                        delete this.TimerCount[a];
                    }
                }
            },
            interval:2000 //1 second
        }
        this.TaskRunner.start(this.taskMaskControl);
        Ext.ux.DinamicCrud.superclass.constructor.call(this, config);
        if (config.defaultKeyMap) {
            this.keys = [
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
            ];
        }
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
            this.gestwindow.setTitle('Adicionar ' + this.form.text);
            this.gestwindow.show();
        }
        else if (caso == 'mod') {
            this.gestwindow.setTitle('Modificar ' + this.form.text);
            this.gestwindow.buttons[1].disable();
            this.gestwindow.buttons[1].hide();
            this.maskElement(Ext.getBody());
            this.form.getForm().load({
                    url:'cargardatos' + this.form.name,
                    params:{
                        idselected:this.selModel.getSelected().id
                    },
                    failure:function (form, action) {
                        var response = action.result[0];
                        this.unmaskElement(Ext.getBody());
                        for (var property in response) {
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
            var name = (this.textMsg) ? this.textMsg : this.form.text;
            this.mostrarMascara('mask_add' + this.form.name, "Por favor espere", "Aplicando cambios...");
            this.form.getForm().submit({
                url:'insertupdate' + this.form.name,
                failure:function (form, action) {
                    this.ocultarMascara('mask_add' + this.form.name)
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
                                mostrarMensaje(1, "El " + name + " se ha " + accion + " correctamente");
                            } else if (response.cod == -1) {
                                mostrarMensaje(3, "No pueden haber dos " + name + "s con la misma denominacion");
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
        var text = (this.textMsg) ? this.textMsg : this.form.text;
        var _this = this;
        mostrarMensaje(2, "Está seguro que desea eliminar el(los) " + text + "(s) seleccionado(s)", function (btnpressed) {
            if (btnpressed == "ok") {
                _this.mostrarMascara('mask_add' + name, "Por favor espere", "Eliminado datos...");
                Ext.Ajax.request({
                    scope:_this,
                    url:'eliminar' + name,
                    params:{
                        todelete:Ext.encode(_this.getSelectionsIds())
                    },
                    callback:function (options, success, response) {
                        this.ocultarMascara('mask_add' + this.form.name);
                        response = Ext.decode(response.responseText);
                        this.store.reload({
                            callback:function () {
                                if (response.cod.length == 0) {
                                    mostrarMensaje(1, "El(los) " + text + "(s) ha(n) sido eliminado(s) correctamente");
                                } else if (response.cod.length > 0) {
                                    mostrarMensaje(3, "Existen un(os) " + text + "(s) que no ha(n) sido eliminado(s) debido a que está(n) en uso");
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
    getSumSelectionsAttribute:function (attributename) {
        var sum = 0;
        if (this.selModel.hasSelection()) {
            selection = this.selModel.getSelections();
            for (var i = 0; i < selection.length; i++) {
                sum += parseInt(selection[i].data[attributename]);
            }
        }
        return sum;
    },
    addBinding:function (binding) {
        this.keys.addBinding(binding);
    },
    addElementToToolBar:function (element) {
        this.getTopToolbar().push(element);
    },
    loadComboStores:function (stores, callback) {
        for (store in stores) {
            if (stores[store].url)
                stores[store].load({
                    callback:callback
                });
        }
    },
    firstLoad:function (limit, mask) {
        if (mask)
            this.maskElement(Ext.getBody());
        this.store.load({
            params:{
                start:0,
                limit:limit
            },
            scope:this,
            callback:function () {
                if (mask)
                    this.unmaskElement(Ext.getBody());
            }
        });
    },
    ocultarMascara:function (idMask) {
        var mask = Ext.getCmp(idMask);
        if (mask && mask.isXType('ux-winload'))
            mask.hideMask();
    },
    maskElement:function (el) {
        el.mask('Cargando...', 'ext-el-mask-msg x-mask-loading');
    },
    unmaskElement:function (el) {
        el.unmask();
    },
    round:function (value, precision) {
        var result = Number(value);
        if (typeof precision == 'number') {
            precision = Math.pow(10, precision);
            result = Math.round(value * precision) / precision;
        }
        return result;
    },

    find:function (array, value) {
        var index_ = -1
        Ext.each(array, function (item, index, allitems) {
            if (item == value) {
                index_ = index;
                return false;
            }
            else
                return true;
        });
        return index_;
    },
    remove:function (array, value) {
        Ext.each(array, function (item, index, allitems) {
            if (item == value) {
                allitems.splice(index, 1);
                return false;
            }
            else
                return true;
        });
    },
    mostrarMascara:function (idMask, title, mensaje) {
        if (Ext.getCmp(idMask)) {
            Ext.getCmp(idMask).hideMask();
        }
        var width = (title.length < 49) ? 300 : title.length * 6;
        var widthM = (!mensaje || mensaje == '' || mensaje.length < 49) ? 300 : mensaje.length * 6 + 12;
        var mask = new Ext.ux.window.winLoad({
            id:idMask,
            title:title,
            mensaje:mensaje,
            width:(width > widthM) ? width : widthM,
            closeAction:'destroy',
            count:0,
            listeners:{
                show:{
                    scope:this,
                    fn:function (win) {
                        this.maskControl[idMask] = mask;
                        this.TimerCount[idMask] = 1;
                    }
                },
                destroy:{
                    scope:this,
                    fn:function () {
                        delete this.maskControl[idMask];
                        delete this.TimerCount[idMask];
                    }
                }
            }
        });
        mask.showMask();
        return mask;
    }
});
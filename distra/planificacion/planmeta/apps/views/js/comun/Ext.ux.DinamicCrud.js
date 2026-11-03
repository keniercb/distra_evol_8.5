var perfil = JSON.parse(JSON.stringify(window.parent.UCID.portal.perfil));
perfil.etiquetas = Object();

if (!Ext.ux)
    Ext.ns("Ext.ux.DinamicCrud");
var nthis = null;
var modificanco;


Ext.ux.DinamicCrud = Ext.extend(Ext.grid.GridPanel, {
    columnmodel: [],
    constructor: function (config) {
        if (config.store) {
            this.store = config.store;
            for (var i = 0; i < this.store.fields.items.length; i++) {
                var obj_cm = {};
                Ext.apply(obj_cm, this.store.fields.items[i]);
                obj_cm.dataIndex = this.store.fields.items[i].name;
                obj_cm.id = this.store.fields.items[i].name;
                //obj_cm.sortable = true;
                if (obj_cm.header) {
                    this.columnmodel.push(obj_cm);
                }
            }
        }
//        else {
//            console.error('No store passed');
//        }
//        console.log(config.ayuda);
        nthis = this;
        this.cm = config.cm || new Ext.grid.ColumnModel(this.columnmodel);
        this.loadMask = true;
        this.limpiar = new Ext.Button({
            // text: perfil.etiquetas.textBtnLimpiarfiltros,
            id: 'btnlimpiar_' + config.id,
            tooltip: perfil.etiquetas.ttBtnLimpiar,
            // icon: perfil.dirImg + 'limpiar.png',
            iconCls: 'limpiar',
            handler: function () {
                if (config.doFilters) {
                    nthis.gridFilters.clearFilters();
                }
            }
        });
        this.bbar = new Ext.PagingToolbar({
            pageSize: config.pageSize || 20,
            store: this.store,
            items: [this.limpiar],
            id: 'ptb_' + config.id,
            displayInfo: true
        });
        this.key_map = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'Ii',
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function (_this) {
                    if (!Ext.getCmp('btn_add_' + config.id).disabled) {
                        Ext.getCmp('btn_add_' + config.id).handler.call(this);
                    }
                }
            },
            {
                key: 'Mm',
                alt: true,
                scope: this,
                stopEvent: true,
                fn: function (_this) {
                    if (!Ext.getCmp('btn_mod_' + config.id).disabled) {
                        Ext.getCmp('btn_mod_' + config.id).handler.call(this);
                    }
                }
            },
            {
                key: 'Hh',
                alt: true,
                scope: this,
                //stopEvent: true,
                fn: function () {
                    /* if(this.form.name=="concepto"){
                     mostrarAyuda1(config.ayuda);
                     }else if(this.form.name=="viaadquisicion"){
                     mostrarAyuda(config.ayuda);
                     }	*/
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: this,
                stopEvent: true,
                fn: function (_this) {
                    if (!Ext.getCmp('btn_del_' + config.id).disabled) {
                        Ext.getCmp('btn_del_' + config.id).handler.call(this);
                    }
                }
            },
            {
                key: 'Ll',
                alt: true,
                fn: function () {
                    if (config.doFilters) {
                        nthis.gridFilters.clearFilters();
                    }
                }
            }
        ]);
        this.buttons = [
            {
                // icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function () {
                    console.debug('Cancelar');
                }
            },
            {
                // icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                text: 'Aplicar',
                tooltip: 'Guardar datos y limpiar los campos',
                handler: function () {
                    console.debug('Aplicar');
                }
            },
            {
                // icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                text: 'Aceptar',
                tooltip: 'Guardar datos y cerrar ventana',
                handler: function () {
                    console.debug('Aceptar');
                }
            }
        ];
        if (config.form) {
            this.form = config.form;
            this.hiddenfield = new Ext.form.Hidden({
                id: 'id' + this.form.name
            });
            this.form.add(this.hiddenfield);
        } else
            console.error("No form passed");
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: {
                    fn: function (_this, row_index, record) {
                        if (_this.getSelections().length > 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).disable();
                        }
                        if (_this.getSelections().length == 1) {
                            Ext.getCmp('btn_del_' + this.id).enable();
                            Ext.getCmp('btn_mod_' + this.id).enable();
                        }
                    },
                    scope: this
                },
                rowdeselect: {
                    fn: function (_this, row_index, record) {
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
                    scope: this
                }
            }
        });
        this.gestwindow = new Ext.Window({
            layout: 'fit',
            constrain: true,
            listeners: {
                hide: {
                    fn: function (_this) {
                        this.key_map.enable();
                        this.form.cascade(function (c) {
                            if (typeof c.reset == 'function') {
                                c.reset();
                            }
                        });
                    },
                    scope: this
                },
                show: {
                    fn: function (_this) {
                        this.key_map.disable();
                    },
                    scope: this
                }
            },
            closeAction: 'hide',
            buttons: [
                {
                    // icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'cancelar',
                    scope: this,
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        this.gestwindow.hide();
                    }
                },
                {
                    // icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'aplicar',
                    scope: this,
                    text: 'Aplicar',
                    tooltip: 'Guardar datos y limpiar los campos',
                    handler: function () {
                        this.addOrModConcept('apl');
                    }
                },
                {
                    // icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'aceptar',
                    scope: this,
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        this.addOrModConcept('acp');
                    }
                }
            ]
        });

        this.tbar = config.tbar || [
            {
                // icon: perfil.dirImg + 'adicionar.png',
                iconCls: 'adicionar',
                scope: this,
                id: 'btn_add_' + config.id,
                //  text: 'Ad<u>i</u>cionar',
                tooltip: 'Adicionar ' + this.form.id + ' <b>(Alt+I)</b>',
                handler: function () {
                    this.openGestWindow('add');
                }
            }, '-',
            {
                //icon: perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
                scope: this,
                // text: '<u>M</u>odificar',
                id: 'btn_mod_' + config.id,
                disabled: true,
                tooltip: 'Modificar ' + this.form.id + ' <b>(Alt+M)</b>',
                handler: function () {
                    this.openGestWindow('mod');
                }
            }, '-',
            {
                //icon: perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                // text: 'Eliminar',
                scope: this,
                disabled: true,
                tooltip: 'Eliminar ' + this.form.id + ' <b>(DEL)</b>',
                id: 'btn_del_' + config.id,
                handler: function () {
                    this.deleteConcept();
                }
            }, '->', {
                id: 'btnAyudaVia',
                icon: perfil.dirImg + 'ayuda.png',
                tooltip: 'Mostrar ayuda (<b>Alt+H</b>)', //perfil.etiquetas.ttBtnAyuda,
                iconCls: 'ayuda',
                // text: 'Ayuda', //perfil.etiquetas.textBtnAyuda',
                hidden: (this.form.name == "viaadquisicion") ? false : true,
                scope: this

            }, {
                id: 'btnAyudaConceptos',
                // icon: perfil.dirImg + 'ayuda.png',
                tooltip: 'Mostrar ayuda (<b>Alt+H</b>)', //perfil.etiquetas.ttBtnAyuda,
                iconCls: 'ayuda',
                //text: 'Ayuda', //perfil.etiquetas.textBtnAyuda',
                hidden: (this.form.name == "viaadquisicion") ? true : false,
                scope: this
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
                filters: filters
            });
            this.plugins = this.gridFilters;
        }
        if (config.showTBarButtons) {
            this.tbar = config.tbar || this.tbar;
        } else {
            this.tbar = null;
        }
        Ext.applyIf(config, {
            name: '',
            frame: true,
            showTBarButtons: false,
            showBBarButtons: false,
            doFilters: false,
            listeners: {
                show: {
                    fn: function () {
                        Ext.getCmp('btn_add_' + config.id).focus();
                    },
                    scope: this
                }
            }
        })
        Ext.ux.DinamicCrud.superclass.constructor.call(this, config);
    },
    getForm: function () {
        this.form.render(Ext.getBody());
        return this.form;
    },
    openGestWindow: function (caso) {
        this.gestwindow.add(this.getForm());
        if (caso == 'add') {
            modificanco = 0;
            this.gestwindow.buttons[1].enable();
            this.gestwindow.buttons[1].show();
            this.gestwindow.setTitle('Adicionar ' + this.form.id);
            var tipo = this.form.name;
            if (tipo == "concepto") {
                this.gestwindow.on('beforeshow', function ()
                {
                    Ext.getCmp('denominacion_concepto').focus(true, 500);
                });
            } else if (tipo == "viaadquisicion") {
                this.gestwindow.on('beforeshow', function ()
                {
                    Ext.getCmp('denominacion_viaadquisicion').focus(true, 500);
                });
            }
            ;
            this.gestwindow.show();
        } else if (caso == 'mod') {
            modificanco = 1;
            this.gestwindow.setTitle('Modificar ' + this.form.id);
            this.gestwindow.buttons[1].disable();
            this.gestwindow.buttons[1].hide();
            Planificacion.maskElement(Ext.getBody());
            this.form.getForm().load({
                url: 'cargardatos' + this.form.name,
                params: {
                    idselected: this.selModel.getSelected().id
                },
                failure: function (form, action) {
                    var response = action.result[0];
                    Planificacion.unmaskElement(Ext.getBody());
                    for (var property in response) {
                        // console.info(property + '_' + this.form.name);
                        if (this.form.getForm().findField(property + '_' + this.form.name))
                            this.form.getForm().findField(property + '_' + this.form.name).setValue(response[property]);
                        if (this.form.getForm().findField(property))
                            this.form.getForm().findField(property).setValue(response[property]);
                    }
                    this.gestwindow.show();
                },
                scope: this
            }
            )
                    ;
        }

    },
    addOrModConcept: function (btn) {
        var tipo = this.form.name;
        // alert(tipo);
        if (tipo == "concepto") {
            var denominacion = Ext.getCmp('denominacion_concepto').getValue();
            var color1 = Ext.getCmp('color_concepto').getValue();
            var descripcion = Ext.getCmp('descripcion_concepto').getValue();
        } else if (tipo == "viaadquisicion") {
            var denominacion = Ext.getCmp('denominacion_viaadquisicion').getValue();
            var color1 = Ext.getCmp('color_viaadquisicion').getValue();
            var descripcion = Ext.getCmp('descripcion_viaadquisicion').getValue();
        }
        // console.log(color1);
        if (modificanco == 1) {
            var denom = this.selModel.getSelected().json.denominacion;
            var color = this.selModel.getSelected().json.color;
            var descrip = this.selModel.getSelected().json.descripcion;
            //alert(color);alert(color1);  alert(denom);  alert(denominacion);  alert(descrip); alert(descripcion);
        }
        if (this.form.getForm().isValid()) {
            if (denominacion != denom || color != color1 || descripcion != descrip) {
                var name = this.form.name;
                Planificacion.mostrarMascara('mask_add' + this.form.name, "Por favor espere", "Aplicando cambios...");
                this.form.getForm().submit({
                    url: 'insert_update' + this.form.name,
                    failure: function (form, action) {
                        Planificacion.ocultarMascara('mask_add' + name)
                        var response = action.result;
                        this.store.reload({
                            params: {
                                start: 0,
                                limit: 20
                            },
                            scope: this,
                            callback: function () {
                                if (response.cod >= 0) {

                                    var accion = 'adicionado';

                                    if (!response.nomod)
                                        accion = 'modificado';
                                    if (btn == 'acp')
                                        this.gestwindow.hide();
                                    else
                                        this.gestwindow.fireEvent('hide');


                                    mostrarMensaje(1, "El " + this.form.id + " ha sido " + accion + " satisfactoriamente.");
                                } else if (response.cod == 'add') {
                                    if (btn == 'acp')
                                        this.gestwindow.hide();
                                    else
                                        this.gestwindow.fireEvent('hide');
                                    mostrarMensaje(1, "La " + this.form.id + " ha sido adicionada satisfactoriamente.");
                                } else if (response.cod == 'mod') {
                                    if (btn == 'acp')
                                        this.gestwindow.hide();
                                    else
                                        this.gestwindow.fireEvent('hide');
                                    mostrarMensaje(1, " La " + this.form.id + " ha sido modificada satisfactoriamente.");
                                } else if (response.cod == -1) {
                                    mostrarMensaje(1, "La vía de adquisición que quiere adicionar ya existe.");
                                } else if (response.cod == -2) {
                                    mostrarMensaje(1, "El concepto que quiere adicionar ya existe.");
                                } else if (response.cod == -3) {
                                    mostrarMensaje(1, "La vía de adquisición que quiere modificar ya existe.");
                                }
                            }
                        });
                    },
                    scope: this
                });
            } else {
                mostrarMensaje(1, 'Debe realizar al menos una modificación.');
            }
        } else {
            mostrarMensaje(1, "Por favor verifique nuevamente que hay campo(s) vacío(s) o con valor(es) incorrecto(s).");
        }
    },
    deleteConcept: function () {
        var name = this.form.name;
        var tipo = this.form.name;
        if (tipo == "concepto") {
            var variable = 'el(los)';
            var selec = 'seleccionado';
            var nombre = 'concepto(s) ';
        } else if (tipo == "viaadquisicion") {
            var variable = 'la(s)';
            var selec = 'seleccionada';
            var nombre = 'vía de adquisición ';
        }
        var _this = this;
        mostrarMensaje(2, "¿Está seguro que quiere eliminar " + variable + " " + nombre + selec + "(s)?", function (btnpressed) {
            if (btnpressed == "ok") {
                Ext.Ajax.request({
                    scope: this,
                    url: 'eliminar' + name,
                    params: {
                        todelete: Ext.encode(_this.getSelectionsIds())
                    },
                    callback: function (options, success, response) {
                        response = Ext.decode(response.responseText);
                        _this.store.reload({
                            callback: function () {
                                if (response.cod.length == 0) {
                                    if (name == "viaadquisicion") {
                                        name = "La(s) vía(s) de adquisición";
                                        elim = "eliminada";
                                    } else if (name == "concepto") {
                                        name = "El(Los) concepto(s) ";
                                        elim = "eliminado";
                                    }
                                    mostrarMensaje(1, " " + name + " ha(n) sido " + elim + "(s) satisfactoriamente.");

                                } else if (response.cod.length > 0) {
                                    if (name == "viaadquisicion") {
                                        name = "La(s) vía(s) de adquisición";
                                        elim = "eliminada";
                                    } else if (name == "concepto") {
                                        name = "El(Los) concepto(s) ";
                                        elim = "eliminado";
                                    }
                                    mostrarMensaje(1, name + " no ha(n) sido " + elim + "(s) porque está(n) en uso.");
                                }
                            }
                        });
                    }
                });
            }
        })
    },
    getSelectionsIds: function () {
        var result = [];
        if (this.selModel.hasSelection()) {
            var selection = this.selModel.getSelections();
            for (var i = 0; i < selection.length; i++) {
                result.push(selection[i].id);
            }
        }
        return result;
    },
    addBinding: function (binding) {
        this.key_map.addBinding(binding);
    }});
//Ayuda de gestionar concepto revisar que sea dinamica que sirva a otras ayudas!!!!

//     function mostrarAyuda(referencia, title) {
//     var title = 'Ayuda de Vía de Adquisición';
//     var referencia = 'Via de adquisicion'; 
//     help.show(title, referencia);
//}

/* function mostrarAyuda(referencia, title) {
 var title = 'Ayuda de Vía de Adquisición';
 var referencia = 'Via de adquisicion'; 
 help.show(title, referencia);
 }
 >>>>>>> .r106974
 
 <<<<<<< .mine
 //   function mostrarAyuda1(referencia, title) {
 //     var title = 'Ayuda de Concepto';
 //     var referencia = 'Gestionar concepto'; 
 //     help.show(title, referencia);
 //}
 =======
 function mostrarAyuda1(referencia, title) {
 var title = 'Ayuda de Concepto';
 var referencia = 'Gestionar concepto'; 
 help.show(title, referencia);
 }*/



//function mostrarAyuda(opcion) {
//    var urlayuda = "../../../comun/templates/Ayuda/" + opcion + ".html";
//    window.open(urlayuda, "Ayuda", "width=650,height=400,menubar=yes,scrollbars=yes,resizable=yes");
//}



	
Ext.ns("Ext.notificaciones.gestionarDestinatarios");
Ext.notificaciones.gestionarDestinatarios.StoreClass = {
    mostrargrupos: new Ext.data.JsonStore({
        url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargardestinatarios',
        root: "datos",
        totalProperty: "cantidad_filas",
        fields: ["contacto", "idcontacto", "idtipodestinatario", "categoriapersona"]
    })
};

Ext.notificaciones.gestionarDestinatarios.ShowWinBuscarPersona = function (ownerGrid, selectPersonFn, destroyFn) {
    new Ext.notificaciones.gestionarDestinatarios.BuscarPersona({
        id: 'id-win-select-person',
        title: ownerGrid.labels.ttSearchPerson,
        labels: ownerGrid.labels,
        ownerGrid: ownerGrid,
        listeners: {
            personselected: selectPersonFn,
            hide: destroyFn,
            destroy: destroyFn,
            close: destroyFn,
            scope: ownerGrid
        }
    }).show();

};

Ext.notificaciones.gestionarDestinatarios.BuscarPersona = Ext.extend(Ext.Window, {
    closeAction: 'close',
    layout: 'fit',
    id: 'win-buscar-persona',
    plain: 'false',
    width: 700,
    height: 500,
    modal: true,
    initComponent: function () {
        this.recordsPersona = [];
        this.gpBuscarPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
            seguridad: 0,
            singleSelect:false,
            listeners: {
                'personaselecionada': this.enableBtnsByPersons,
                'personanoselecionada': this.enableBtnsByPersons,
                scope: this
            }
        });
        if (this.fromGroupToo) {
            this.gpBuscarPersona.setTitle(this.labels.ttSelectUser);
            this.tabGruposPersonas = new Ext.notificaciones.gestionarGruposContactos.TabContenedor({
                panelDisabled: true,
                labels: this.labels,
                withoutTbar: this.withoutTbar | false,
                title: this.labels.ttSelectGroup,
                listeners: {
                    'groupchanged': this.enableBtnsByGroups,
                    scope: this
                }
            });
            this.tabPanelDestinatarios = new Ext.TabPanel({
                activeTab: 0,
                listeners: {
                    'beforetabchange': this.enableBtnsOnActivate,
                    scope: this
                },
                items: [this.gpBuscarPersona,
                    this.tabGruposPersonas]
            });
        }
        this.items = [this.fromGroupToo ? this.tabPanelDestinatarios : this.gpBuscarPersona];
        this.buttons = [
            {
                xtype: 'button',
                text: this.labels.actions.cancel,
                iconCls: 'cancelar',
                //icon: perfil.dirImg + 'cancelar.png',
                tooltip: this.labels.ttCloseWindow,
                handler: function () {
                    this.destroy();
                },
                scope: this
            },
            {
                xtype: 'button',
                text: this.labels.actions.apply,
                iconCls: 'aplicar',
                disabled: true,
                //icon: perfil.dirImg + 'aplicar.png',
                tooltip: this.labels.ttSelectAndNotClose,
                handler: function () {
                    if (!this.fromGroupToo) {
                        this.fireEvent('personselected', this, this.gpBuscarPersona != null ? this.gpBuscarPersona.getSeleccion().json : {});
                    }
                    else {
                        this.sendDestinatarios.call(this);
                    }
                },
                scope: this
            },
            {
                xtype: 'button',
                text: this.labels.actions.accept,
                iconCls: 'aceptar',
                disabled: true,
                //icon: perfil.dirImg + 'aceptar.png',
                tooltip: this.labels.ttSelectAndClose,
                handler: function () {
                    if (!this.fromGroupToo) {
                        this.fireEvent('personselected', this, this.gpBuscarPersona != null ? this.gpBuscarPersona.getSeleccion().json : {});
                    }
                    else {
                        this.sendDestinatarios.call(this);
                    }
                    this.destroy();
                },
                scope: this
            }
        ];
        Ext.notificaciones.gestionarDestinatarios.BuscarPersona.superclass.initComponent.call(this);
    },
    getGpBuscarPersona: function () {
        return this.gpBuscarPersona;
    },
    setOwnerGrid: function (og) {
        this.ownerGrid = og;
    },
    enableBtnsByPersons: function (rec) {
        this.recordPersona = rec;
        this.enableBtns.call(this);
    },
    enableBtnsByGroups: function (records) {
        this.recordsPersona = records;
        this.enableBtns.call(this);
    },
    enableBtnsOnActivate: function (p, newTab, currentTab) {
        if (newTab instanceof Ext.pvd.persona.buscarpersona.panelBuscarpersona) {
            if (this.recordPersona) {
                this.buttons[1].enable();
                this.buttons[2].enable();
                return;
            }
        }
        else if (newTab instanceof Ext.notificaciones.gestionarGruposContactos.TabContenedor) {
            if (this.recordsPersona.length > 0) {
                this.buttons[1].enable();
                this.buttons[2].enable();
                return;
            }
        }
        //this.buttons[1].disable();
        //this.buttons[2].disable();
    },
    enableBtns: function () {
        var fn = this.validateSendDestinatarios() ? 'enable' : 'disable';
        this.buttons[1][fn]();
        this.buttons[2][fn]();
    },
    validateSendDestinatarios: function () {
        return ((typeof this.recordPersona != 'undefined' && (this.tabPanelDestinatarios) ? (this.tabPanelDestinatarios.getActiveTab() instanceof Ext.pvd.persona.buscarpersona.panelBuscarpersona) : false)
            || (this.recordsPersona.length > 0 && this.tabPanelDestinatarios.getActiveTab() instanceof Ext.notificaciones.gestionarGruposContactos.TabContenedor)
            || typeof this.recordPersona != 'undefined' && !this.tabPanelDestinatarios);
    },
    sendDestinatarios: function () {
        if (this.validateSendDestinatarios()) {
            if (this.tabPanelDestinatarios.getActiveTab() instanceof Ext.pvd.persona.buscarpersona.panelBuscarpersona) {
                this.fireEvent('destinatarioseleccionado', [this.recordPersona]);
            }
            else if (this.tabPanelDestinatarios.getActiveTab() instanceof Ext.notificaciones.gestionarGruposContactos.TabContenedor) {
                this.fireEvent('destinatarioseleccionado', this.recordsPersona);
            }
        }
    }
});


Ext.notificaciones.gestionarDestinatarios.ListarGrupos = Ext.extend(Ext.grid.GridPanel, {
    store: Ext.notificaciones.gestionarDestinatarios.StoreClass.mostrargrupos,
    height: 350,
    initComponent: function () {
        var self = this;
        this.columns = [
            {
                dataIndex: 'contacto',
                header: this.labels.lbDestinatariosName,
                sortable: true,
                width: 290
            }
        ],
            this.bbar = new Ext.PagingToolbar({
                pageSize: 12,
                store: gestionarDestinatarios.StoreClass.mostrargrupos,
                displayInfo: true,
                emptyMsg: this.labels.emptyMsg
            }),
            this.tbar = new Ext.Toolbar({
                items: [
                    {
                        xtype: 'button',
                        text: this.labels.lbGestGroups,
                        handler: function () {
                            self.MostrarGrupos.call(self, arguments);
                        }
                    }
                ]
            });
        Ext.notificaciones.gestionarDestinatarios.ListarGrupos.superclass.initComponent.call(this);
        this.store.load({
            params: {
                start: 0,
                limit: 12/*, texto: Ext.getCmp('tf-filtro-dest') ? Ext.getCmp('tf-filtro-dest').getRawValue() : ''*/
            }
        });

    },
    MostrarGrupos: function () {
        this.winEditarGrupos ?
            this.winEditarGrupos.show() :
            this.winEditarGrupos = new Ext.notificaciones.gestionarDestinatarios.EditarGrupos();
        this.winEditarGrupos.show();
    }
});
Ext.reg("gestionarDestinatarios.listarGrupos", Ext.notificaciones.gestionarDestinatarios.ListarGrupos);


Ext.ns("Ext.notificaciones.direccionesContactos");
Ext.notificaciones.direccionesContactos.StoreClass = {
    mostrarcontactos: new Ext.data.JsonStore({
        url: '/herramientas/notificaciones/index.php/gestavisos/cargarmedioscontactos',
        root: "datos",
        totalProperty: "cantidad_filas",
        fields: ["idpersona", "idcontacto", "medio", "valor"]
    })
};


Ext.ns("Ext.notificaciones.gestionarDestinatarios");
Ext.notificaciones.gestionarDestinatarios.RecordClass = {
    mostrardestinatarios: new Ext.data.Record.create([
        {
            name: 'contacto'
        },

        {
            name: 'idcontacto'
        },

        {
            name: 'idtipocontacto'
        }
    ])
};
Ext.notificaciones.gestionarDestinatarios.StoreClass = {
    mostrardestinatarios: new Ext.data.JsonStore({
        url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargardestinatariosdeaviso',
        fields: Ext.notificaciones.gestionarDestinatarios.RecordClass.mostrardestinatarios
    })
};


Ext.notificaciones.gestionarDestinatarios.ListarDestinatarios = Ext.extend(Ext.grid.GridPanel, {
    width: 400,
    height: 340,
    frame: true,
    autoExpandColumn: 'contacto',
    initComponent: function () {
        this.defaultDestinataryType = null;
        this.limitNumber = 15;
        this.title = this.labels.ttUsers;
        //obtener los destinatarios del aviso al modificar
        this.allData = this.allData ? this.allData : {
            total: 0,
            datos: []
        };
        this.oldDestinatarios = [];
        Ext.each(this.allData.datos, function (o) {
            this.oldDestinatarios.push(o.idcontacto);
        }, this);
        this.newDestinatarios = [];
        this.delDestinatarios = [];
        this.elDeleted = [];

        this.store = new Ext.data.JsonStore({
            fields: Ext.notificaciones.gestionarDestinatarios.RecordClass.mostrardestinatarios,
            root: 'datos',
            totalProperty: 'total',
            proxy: new Ext.ux.data.PagingMemoryProxy(this.allData, {})
        });
        this.bbar = new Ext.PagingToolbar({
            pageSize: this.limitNumber,
            store: this.store,
            displayInfo: true,
            displayMsg: this.labels.displayMsg,
            emptyMsg: this.labels.emptyMsg
        });
        this.loadMask = {
            msg: this.labels.lbLoading,
            store: this.store
        };
        Ext.Ajax.request({
            url: '/herramientas/notificaciones/index.php/gestdestinatarios/obtenertipodestinatariopordefecto',
            success: function (response, opt) {
                this.defaultDestinataryType = Ext.decode(response.responseText).id;
            },
            scope: this
        });
        this.columns = [new Ext.grid.RowNumberer(), {
            dataIndex: 'contacto',
            id: 'contacto',
            header: this.labels.lbDestinatariosName,
            sortable: true,
            width: 300
        }];
        this.tbar = new Ext.Toolbar({
            items: [
                {
                    xtype: 'button',
                    text: this.labels.actions.add,
                    //icon: perfil.dirImg + 'adicionar.png',
                    tooltip: this.labels.ttipAddUser,
                    iconCls: 'adicionar',
                    handler: function () {
                        this.mostrarPersonas.call(this, arguments)
                    },
                    scope: this
                },
                {
                    xtype: 'button',
                    text: this.labels.actions.del,
                    tooltip: this.labels.ttipDelUser,
                    disabled: true,
                    //icon: perfil.dirImg + 'eliminar.png',
                    iconCls: 'eliminar',
                    handler: function () {
                        var records = this.getSelectionModel().getSelections();
                        this.Eliminar(this, this.store, records);
                    },
                    scope: this
                }
            ]
        });
        this.selModel = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                'rowselect': function (sm, rowIndex, record) {
                    this.enableAll(true);
                },
                'rowdeselect': function (sm) {
                    if (sm.getSelections().length == 0) {
                        this.enableAll(false);
                    }
                },
                scope: this
            }
        });
        this.keys = [
            {
                key: 'i',
                alt: true,
                fn: this.mostrarPersonas,
                scope: this
            },
            {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    var records = this.getSelectionModel().getSelections();
                    if (records.length > 0) {
                        this.Eliminar(this, this.store, records);
                    }
                },
                scope: this
            }
        ];
        this.addListener('destinatarioagregado', this.onDestinatarioAgregado);
        this.addListener('destinatarioeliminado', this.onDestinatarioEliminado);
        /*var flag = true;
        this.store.on('load', function(data){
            if(flag){
                initLengthGrid = data;
                flag = false;
                console.log('dkdk',initLengthGrid.data.items);
            }
            console.log('dkdk',initLengthGrid.data.items);
            console.log('dkdk2',data.data.items);
        });*/
        Ext.notificaciones.gestionarDestinatarios.ListarDestinatarios.superclass.initComponent.call(this);
        this.store.load({
            params: {
                start: 0,
                limit: this.limitNumber
            }
        });
    },
    enableAll: function (enable) {
        var delBtn = this.getTopToolbar().items.items[1];
        enable ? delBtn.enable() : delBtn.disable();
    },
    resetAll: function (records) {
        if (records) {
            for (i = 0; i < records.length; i++) {
                this.store.remove(records[i]);
            }
        }
    },
    Eliminar: function (scope, store, records) {
        var unSelecteds = [];
        Ext.MessageBox.confirm(this.labels.ttAlerta, this.labels[records.length == 1 ? 'confirmDelDestinataryFromList' : 'confirmDelDestinatariesFromList' ], function (btn) {
            if (btn == 'yes') {
                store.each(function (rec) {

                    if (!records.contains(rec)) {
                        unSelecteds.push(rec);
                    }
                    else {

                        Ext.each(this.allData.datos, function (el) {
                            if (el && el.idcontacto == rec.data.idcontacto) {
                                this.elDeleted.push(el);
                                this.allData.datos.remove(el);
                                this.allData.total--;
                                this.fireEvent('destinatarioeliminado', el);
                                return;
                            }
                        }, this);
                    }
                    this.store.remove(rec);
                    var btnAcept = Ext.getCmp('btn-accept-save-notification');
                    if(!btnAcept.tab1 && !btnAcept.tab3){
                        if(this.newDestinatarios.length != 0) {
                            btnAcept.setDisabled(false);
                            btnAcept.tab2 = true;
                        } else {
                            btnAcept.setDisabled(true);
                            btnAcept.tab2 = false;
                        }
                    }
                    mostrarMensaje(7,this.labels.msgUserDelSuccess);
                }, this);
                this.store.add(unSelecteds);
                this.store.load({
                    params: {
                        start: 0,
                        limit: this.limitNumber
                    }
                });
                scope.enableAll(false);
            }
            this.getTopToolbar().items.items[0].focus();
        }, this);
    },
    mostrarPersonas: function () {
        var scope = this;
        var fnDestinatarySelected = function (recs) {
            var newRecs = 0;
            Ext.each(recs[0], function (rec) {
                var itIs = false, record = {
                    idtipocontacto: this.defaultDestinataryType,
                    idcontacto: rec.data.idpersona
                };
                if (rec.data.hasOwnProperty('numid')) {
                    record.contacto = [rec.data.nombre + ((rec.data.snombre !== '' && rec.data.snombre !== null) ? ' ' + rec.data.snombre : ''), rec.data.papel, rec.data.sapel].join(' ');
                }
                else {
                    record.contacto = rec.data.nombre;
                }
                Ext.each(this.allData.datos, function (el) {
                    if (el.idcontacto == rec.data.idpersona) {
                        itIs = true;
                        return;
                    }
                }, this);

                if (!itIs) {
                    this.allData.datos.push(record);
                    this.allData.total++;
                    this.fireEvent('destinatarioagregado', record);
                    this.store.load({
                        params: {
                            start: 0,
                            limit: 15
                        }
                    });
                    newRecs++;
                }   //TODO mostrar mensaje de que ya existe la persona en la lista de destinatarios.               
            }, this);
            var btnAcept = Ext.getCmp('btn-accept-save-notification');
            if(!btnAcept.tab1 && !btnAcept.tab3){
                if(this.newDestinatarios.length != 0) {
                    btnAcept.setDisabled(false);
                    btnAcept.tab2 = true;
                } else {
                    btnAcept.setDisabled(true);
                    btnAcept.tab2 = false;
                }
            }
            mostrarMensaje(7, this.labels.fnGetMsgUserAdd(recs.length, newRecs), fnFocusAddBtn);
        };
        var fnFocusAddBtn = function () {
            scope.getTopToolbar().items.items[0].focus();
        };
        new Ext.notificaciones.gestionarDestinatarios.BuscarPersona({
            title: this.labels.ttSelectDestinatary,
            withoutTbar: true,
            fromGroupToo: true,
            labels: this.labels,
            listeners: {
                destinatarioseleccionado: fnDestinatarySelected.createDelegate(this),
                hide: fnFocusAddBtn,
                close: fnFocusAddBtn,
                destroy: fnFocusAddBtn
            }
        }).show();
    },
    onDestinatarioAgregado: function (dest) {
        if (!this.adicionar) {
            if (!this.newDestinatarios.contains(dest.idcontacto) && !this.oldDestinatarios.contains(dest.idcontacto)) {
                this.newDestinatarios.push(dest.idcontacto);
            }
            else if (this.oldDestinatarios.contains(dest.idcontacto)) {
                this.delDestinatarios.remove(dest.idcontacto);
            }
        }
    },
    onDestinatarioEliminado: function (dest) {
        if (!this.adicionar) {
            if (!this.newDestinatarios.contains(dest.idcontacto) && this.oldDestinatarios.contains(dest.idcontacto)) {
                this.delDestinatarios.push(dest.idcontacto);
            }
            else if (!this.oldDestinatarios.contains(dest.idcontacto)) {
                this.newDestinatarios.remove(dest.idcontacto);
            }
        }
    },
    getOldDestinatarios: function () {
        return this.oldDestinatarios;
    },
    getNewDestinatarios: function () {
        return this.newDestinatarios;
    },
    getDelDestinatarios: function () {
        return this.delDestinatarios;
    },
    mostrarGrupos: function () {
        if (!this.listOfGroups) {
            this.listOfGroups = new Ext.notificaciones.gestionarGruposGrupos.AdicionarGrupo2Destinatarios({
                labels: this.labels
            });
        }
        this.listOfGroups.show();
    }
});
Ext.reg("gestionarDestinatarios.listarDestinatarios", Ext.notificaciones.gestionarDestinatarios.ListarDestinatarios);

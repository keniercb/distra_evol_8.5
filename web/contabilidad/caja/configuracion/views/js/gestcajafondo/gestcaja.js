Ext.namespace('Caja.GestCaja');

//--Componete Panel Caja
Caja.GestCaja.PanelCaja = Ext.extend(Ext.Panel, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            region: 'center',
            frame: false,
            labelAlign: 'top',
            buttonAlign: 'right',
            //title: this.idioma.lbGestCaja,
            idioma: params.idioma,
            perfil: params.perfil
        });
        this.createGridPanel();
        this.createButtonPanel();
        this.initEventos();
        this.initFunctions();

        Caja.GestCaja.PanelCaja.superclass.constructor.call(this);
    },
    createButtonPanel: function () {

        this.tbar = [
            this.btnAddCaja = new Ext.Button({
                id: 'btnAddCaja',
                //icon: this.perfil.dirImg + 'adicionar.png',
                iconCls: 'adicionar',
                text: this.idioma.lbAdicionar,
                tooltip: this.idioma.lbToolAddCaja,
                listeners: {
                    scope: this,
                    render: function (tf, e) {
                        this.btnAddCaja.focus();
                    }
                }
            }),
            this.btnModCaja = new Ext.Button({
                disabled: true,
                id: 'btnModCaja',
                //icon: this.perfil.dirImg + 'modificar.png',
                iconCls: 'modificar',
                text: this.idioma.lbModificar,
                tooltip: this.idioma.lbToolModCaja
            }),
            this.btnDelCaja = new Ext.Button({
                disabled: true,
                id: 'btnDelCaja',
                //icon: this.perfil.dirImg + 'eliminar.png',
                iconCls: 'eliminar',
                text: this.idioma.lbEliminar,
                tooltip: this.idioma.lbToolDelCaja
            })
            /*,'->',
             this.btnAyuda = new Ext.Button({
             text: this.idioma.lbBtnAyuda,
             tooltip: this.idioma.lbToolAyuda,
             icon: this.perfil.dirImg + 'ayuda.png',
             iconCls: 'btn'
             })*/
        ];
    },
    createGridPanel: function () {
        var me = this;
        this.searchField = new Ext.Cont.SearchField({
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.1,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
            scope: this,
            fnOnSearch: function () {
                me.searchCaja(me.searchField.getRawValue());
            },
            fnOnClear: function () {
                me.searchCaja('');
            }
        });

        this.rdcaja = new Ext.data.JsonReader({
            root: 'datos',
            totalProperty: 'cant'
        }, [{
            name: 'denominacion'
        }, {
            name: 'codigo'
        }, {
            name: 'idcaja'
        }, {
            name: 'descripcion'
        }, {
            name: 'fechaaprueba'
        }, {
            name: 'docaprueba'
        }, {
            name: 'asociado'
        }, {
            name: 'version'
        }]);

        this.stCaja = new Ext.data.Store({
            url: 'cargarcajas',
            reader: this.rdcaja,
            baseParams: {
                limit: 15,
                filter: ''
            },
            autoLoad: true
        });

        this.gpCaja = new Ext.grid.GridPanel({
                border: false,
                id: 'gpCaja',
                stripeRows: true,
                frame: false,
                //loadMask: true,
                autoExpandColumn: 'descripcion',
                store: this.stCaja,
                sm: this.smCaja = new Ext.grid.RowSelectionModel({
                    singleSelect: true
                }),
                columns: [{
                    id: 'codigo',
                    sortable: true,
                    width: 70,//(Ext.lib.Dom.getViewWidth() - 10) * 0.1,
                    header: this.idioma.lbCodigo,
                    hideable: true,
                    dataIndex: 'codigo'
                }, {
                    header: this.idioma.lbDenominacion,
                    sortable: true,
                    hideable: true,
                    width: 200,//(Ext.lib.Dom.getViewWidth() - 10) * 0.3,
                    id: 'denominacion',
                    dataIndex: 'denominacion'
                }, {
                    header: this.idioma.lbDescripcion,
                    sortable: true,
                    width: 100,//(Ext.lib.Dom.getViewWidth() - 10) * 0.6,
                    hideable: true,
                    id: 'descripcion',
                    dataIndex: 'descripcion'
                }, {
                    hidden: true,
                    hideable: false,
                    id: 'idcaja',
                    dataIndex: 'idcaja'
                }, {
                    //hidden: true,
                    //hideable: false,
                    id: 'fechaaprueba',
                    header: this.idioma.lbFechaAprobacion,
                    width: 100,
                    dataIndex: 'fechaaprueba'
                }, {
                    //hidden: true,
                    //hideable: false,
                    id: 'docaprueba',
                    header: this.idioma.lbDocAprueba,
                    width: 100,
                    dataIndex: 'docaprueba'
                }, {
                    hidden: true,
                    hideable: false,
                    id: 'version',
                    dataIndex: 'version'
                }],
                viewConfig: {
                    forceFit: true
                },
                tbar: [this.searchField],
                bbar: new Ext.Cont.PagingToolbar({
                    pageSize: 15,
                    store: this.stCaja,
                    displayInfo: true,
                    displayMsg: this.idioma.lbDisplayMsg,
                    emptyMsg: this.idioma.lbEmptyMsg,
                    firstText: this.idioma.lbPrimeraPagina,
                    lastText: this.idioma.lbUltimaPagina
                })/*, this.searchField, '->', {xtype: 'tbtext' , text: this.idioma.lbDisplayMsg}*/

            }
        );
        this.items = [this.gpCaja];
    },
    initEventos: function () {

        this.stCaja.on({
            scope: this,
            beforeload: function () {
                this.btnModCaja.disable();
                this.btnDelCaja.disable();
                //-------------
                var recordSelect = this.smCaja.getSelected();
                this.indexSelect = this.stCaja.indexOf(recordSelect);

                if (this.scope.lMask) {
                    if (this.scope.lMask.removeMask) {
                        this.lMaskCargando();
                    } else {
                        this.scope.lMaskEspere();
                    }
                } else this.lMaskCargando();

            },
            load: function (st, recors) {
                this.smCaja.selectRow(this.indexSelect);
                if (this.scope.lMask) {
                    this.scope.lMask.hide();
                    this.scope.lMask.removeMask = true;
                }
                if (this.lMask)
                    this.lMask.hide();
            }
        });

        this.btnAddCaja.on({
            scope: this,
            click: function (button, event) {
                this.fireEvent('showWinCaja', false);
            }
        });
        this.btnModCaja.on({
            scope: this,
            click: function (button, event) {
                this.fireEvent('showWinCaja', true);
            }
        });
        this.btnDelCaja.on({
            scope: this,
            click: function (button, event) {
                this.scope.keyMapa.disable();
                var me = this;
                var cantSelections = this.smCaja.getSelections().length;
                var pregEliminarCaja = (cantSelections > 1) ? this.idioma.lbPregEliminarCajas : this.idioma.lbPregEliminarCaja;
                mostrarMensaje(2, pregEliminarCaja, function (btnPress) {
                    if (btnPress === 'ok') {
                        me.deleteCaja();
                    }
                    me.scope.keyMapa.enable();
                });
            }
        });
        this.smCaja.on({
            scope: this,
            rowselect: function (smodel, rowIndex, record) {
                this.gpCaja.getView().addRowClass(rowIndex, "negrita");
                if (smodel.selections.length == 1) {
                    this.btnModCaja.enable();
                } else {
                    this.btnModCaja.disable();
                    this.scope.panelFondo.btnAsocDes.disable();
                    //this.scope.panelFondo.btnOperaciones.disable();
                    this.scope.panelFondo.btnAperturar.disable();
                }
                this.btnDelCaja.enable();
            },
            rowdeselect: function (smodel, rowIndex, record) {
                this.gpCaja.getView().removeRowClass(rowIndex, "negrita");
                if (smodel.selections.length == 1) {
                    this.btnModCaja.enable();
                } else {
                    this.btnModCaja.disable();
                    this.scope.panelFondo.btnAsocDes.disable();
                    //this.scope.panelFondo.btnOperaciones.disable();
                    this.scope.panelFondo.btnAperturar.disable();
                    // Ext.getCmp('btnAddConsecutivo').disable();
                    this.scope.panelTalonario.stTalonario.removeAll();
                }
                if (smodel.selections.length == 0) {
                    this.btnDelCaja.disable();
                    this.scope.panelFondo.smFondo.clearSelections();
                }
            }
        });
        this.gpCaja.on({
            scope: this,
            rowclick: function (grid, rowIndex, e) {
                this.scope.panelPermiso2.setTitle(this.idioma.lbPermiso);
                this.scope.lMaskEspere();
                this.scope.panelFondo.stFondo.load({
                    scope: this,
                    callback: function (options, success, response) {
                        this.scope.lMask.hide();
                        this.scope.lMask.removeMask = true;
                    }
                });
                //Controlar panel permiso
                if (this.smCaja.getSelections().length == 1) {
                    this.scope.panelPermiso2.setTitle(String.format(this.idioma.lbPermisoFondo, this.smCaja.getSelected().data.denominacion.toLowerCase()));
                    this.scope.panelPermiso.stPermiso.load();
                    Ext.getCmp('idBtnAddPersona').enable();
                } else {
                    this.scope.panelPermiso.stPermiso.removeAll();
                    Ext.getCmp('idBtnAddPersona').disable();
                }
            }
        });

    },
    initFunctions: function () {

        var me = this;

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(me.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.searchCaja = function (filter) {
            this.stCaja.baseParams.filter = filter;
            this.stCaja.load();
            this.stCaja.on({
                scope: this,
                load: function (store, records, options) {
                    if (!records.length && filter)
                        mostrarMensaje(1, 'No existen datos que se correspondan el criterio de búsqueda especificado.')
                }
            });
        };

        this.deleteCaja = function () {

            Ext.Msg.wait(this.idioma.lbEliminado, this.idioma.lbEspere);

            var arrayIdCaja = new Array();
            var arrayCajaSelection = this.selectionsOnPaging();
            for (i = 0; i < arrayCajaSelection.length; i++) {
                arrayIdCaja.push(arrayCajaSelection[i].idcaja);
            }

            var msgSuccess = (arrayIdCaja.length > 1) ? this.idioma.lbDelSatisfatCajas : this.idioma.lbDelSatisfatCaja;

            Ext.Ajax.request({
                scope: this,
                url: 'deletecaja',
                params: {
                    arrayidcaja: Ext.encode(arrayIdCaja)
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '1') {//Se elimino satisfactoriamnete
                        mostrarMensaje(1, msgSuccess);
                        this.scope.panelPermiso.stPermiso.removeAll();
                        Ext.getCmp('idBtnAddPersona').disable();
                        this.scope.panelPermiso2.setTitle(this.idioma.lbPermiso);
                    } else if (respuesta.codM == '2')//Hubieron cajas que no se pudieron eliminar
                        mostrarMensaje(1, this.idioma.lbDelNoCajasHubieron);
                    else if (respuesta.codM == '-1' && arrayIdCaja.length > 1)//No se pudieron eliminar
                        mostrarMensaje(1, this.idioma.lbDelNoCajas);
                    else mostrarMensaje(1, this.idioma.lbDelNoCaja);
                    Ext.MessageBox.hide();
                    this.stCaja.reload();
                }
            });
        };
        this.selectionsOnPaging = function () {
            var arrayValues = new Array();
            var instance = new PagingToolbarSelections({
                'selections': this.gpCaja.getSelectionModel().getSelections(),
                'activePage': this.gpCaja.getBottomToolbar().getPageData().activePage
            });
            return instance.getSelectionsOnArray(arrayValues);
        };
    }

});

//--Componete Window Caja
Caja.GestCaja.WindowCaja = Ext.extend(Ext.Window, {
    constructor: function (params) {

        Ext.apply(this, params);
        Ext.apply(this, {
            width: 500,
            // width: Ext.lib.Dom.getViewWidth() * 0.40,
            autoValidate: true,
            modal: true,
            constrain: true,
            // layout: 'fit',
            closeAction: 'close',
            frame: true,
            resizable: false,
            idioma: params.idioma,
            perfil: params.perfil,
            id: 'windowCaja'
        });
        this.createButtons();
        this.createForm();
        this.initFunctions();
        this.initEventos();

        Caja.GestCaja.WindowCaja.superclass.constructor.call(this);
    },
    initEventos: function () {

        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.saveCaja(false);
            }
        });
        this.btnAplicar.on({
            scope: this,
            click: function () {
                this.saveCaja(true);
            }
        });
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            selectOnFocus: true,
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            scope: this,
            handler: function () {
                this.close();
            }
        });
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            // icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            //disabled: true,
            text: this.idioma.lbAplicar,
            tooltip: this.idioma.lbToolAplicar
        });
        this.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            //disabled: true,
            text: this.idioma.lbAceptar,
            tooltip: this.idioma.lbToolAceptar
        });
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    },
    createForm: function () {

        this.tfCodigo = new Ext.form.NumberField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'tfCodigo',
            name: 'codigo',
            maxLength: 8,
            maxLengthText: "El tamaño máximo requerido es 8 caracteres.",
            enableKeyEvents: true,
            maskRe: /^([0-9\(1)]+ ?[0-9]*)+$/,
            regex: /^([0-9\(1)]+ ?[0-9]*)+$/,
            allowBlank: false,
            allowDecimals: false,
            fieldLabel: this.idioma.lbCodigo,
            anchor: '95%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfDenominacion.focus();
                }
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDenominacion,
            allowBlank: false,
            enableKeyEvents: true,
            maxLength: 50,
            maxLengthText: "El tamaño máximo requerido es 50 caracteres",
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\#\/\s\,\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            id: 'tfDenominacion',
            name: 'denominacion',
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.taDescripcion.focus();
                },
                //invalid: function (cmp, msg) {
                //    if (cmp.getValue().length > 0) {
                //        var vtext = cmp.getValue().trim();
                //        cmp.setValue(vtext);
                //    }
                //},
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        // this.taDescripcion = new Ext.form.TextArea({
        this.taDescripcion = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDescripcion,
            id: 'taDescripcion',
            name: 'descripcion',
            allowBlank: false,
            maxLength: 255,
            maxLengthText: "El tamaño máximo requerido es 255 caracteres.",
            maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\#\/\s\,\-]+$/,
            regex: /^([0-9a-zA-Z\"\-\_\/\(\)\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
            enableKeyEvents: true,
            anchor: '100%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.tfDocAprueba.focus();
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        this.tfDocAprueba = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: this.idioma.lbDocAprueba,
            name: 'docaprueba',
            allowBlank: true,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\.\:\, [a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\.\:\,]*)+$/,
            maxLength: 50,
            maxLengthText: this.idioma.lbMaxLength50,
            id: 'tfDocAprueba',
            anchor: '95%',
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.dfFechaAprueba.focus();
                },
                invalid: function (cmp, msg) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                },
                blur: function (cmp) {
                    if (cmp.getValue().length > 0) {
                        var vtext = cmp.getValue().trim();
                        cmp.setValue(vtext);
                    }
                }
            }
        });

        this.dfFechaAprueba = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            id: 'dfFechaAprueba',
            name: 'fechaaprueba',
            fieldLabel: this.idioma.lbFechaAprobacion,
            allowBlank: true,
            invalidText: this.idioma.lbInvalidFecha,
            format: 'd/m/Y',
            anchor: '100%',
            maxValue: new Date(),
            enableKeyEvents: true,
            listeners: {
                scope: this,
                specialkey: function (tf, e) {
                    if (e.getCharCode() == Ext.EventObject.ENTER)
                        this.btnAceptar.focus();
                }
            }
        });

        this.formCaja = new Ext.FormPanel({
            id: 'formCaja',
            frame: true,
            layout: 'fit',
            autoHeight: true,
            labelWidth: 50,
            labelAlign: 'top',
            trackResetOnLoad: true,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfCodigo]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfDenominacion]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.tfDocAprueba]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.dfFechaAprueba]
                }, {
                    columnWidth: 1,
                    layout: 'form',
                    items: [this.taDescripcion]
                }]
            }]

        });

        this.items = this.formCaja;
    },
    initFunctions: function () {
        var me = this;
        this.cargarWinModCaja = function (select) {
            this.formCaja.getForm().loadRecord(select);
            me.idcaja = select.data.idcaja;
            if (select.data.asociado) {
                this.tfCodigo.setDisabled(true);
                this.tfDenominacion.setDisabled(true);
                if (this.tfDocAprueba.getValue() != '')
                    this.tfDocAprueba.setDisabled(true);
                if (this.dfFechaAprueba.getValue() != '')
                    this.dfFechaAprueba.setDisabled(true);
            }
            me.btnCancelar.focus();
        };

        this.saveCaja = function (aplicar) {

            if (this.formCaja.getForm().isValid()) {

                var msgSuccess = (!me.idcaja) ? this.idioma.lbAddCajaSatisfat : this.idioma.lbModCajaSatisfat;

                Ext.Msg.wait(this.idioma.lbGuardando, this.idioma.lbEspere);
                Ext.Ajax.request({
                    url: 'savecaja',
                    params: {
                        idcaja: me.idcaja,
                        codigo: this.tfCodigo.getValue(),
                        denominacion: this.tfDenominacion.getValue(),
                        descripcion: this.taDescripcion.getValue(),
                        docaprueba: this.tfDocAprueba.getValue(),
                        fechaaprueba: this.dfFechaAprueba.getRawValue()
                    },
                    callback: function (options, success, response) {
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codM == '1') {
                            mostrarMensaje(1, msgSuccess);
                            if (!me.btnAplicar.isVisible() || !aplicar)
                                me.close();
                            else if (aplicar) {
                                me.formCaja.getForm().reset();
                            }
                        } else if (respuesta.codM == '2') {
                            mostrarMensaje(1, me.idioma.lbCodCajaExist);
                            me.btnAplicar.disable();
                            me.btnAceptar.disable();
                            me.tfCodigo.reset();
                        }
                        Ext.MessageBox.hide();
                        me.scope.panelCaja.stCaja.reload();
                    }
                });
            }
        };
    }
});

//--Componete Panel Permiso
Caja.GestCaja.PanelPermiso = Ext.extend(Ext.Panel, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            border: false,
            idioma: params.idioma,
            perfil: params.perfil
        });
        //this.createButtons();
        this.createGrid();
        this.initFunctions();
        this.initEventos();

        Caja.GestCaja.PanelPermiso.superclass.constructor.call(this);
    },
    createButtons: function () {
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            //disabled: true,
            text: this.idioma.lbCancelar,
            tooltip: this.idioma.lbToolCancelar,
            scope: this,
            handler: function () {
                this.close();
            }
        });
        this.buttons = [this.btnCancelar];
    },
    initEventos: function () {
        var me = this;

        this.rowaction.on('action', function (grid, record, action, rowIndex, col, e) {
            switch (action) {
                case 'eliminar':
                    mostrarMensaje(2, me.idioma.lbPregEliminarPersona, function (btnPress) {
                        if (btnPress === 'ok') {
                            me.deletePermiso();
                        }
                        //me.scope.keyMapa.enable();
                    });
                    break;
            }
        });

        this.stPermiso.on({
            scope: this,
            beforeload: function (s, options) {
                this.stPermiso.clearFilter(true);
                this.stPermiso.baseParams.idcaja = this.scope.panelCaja.smCaja.getSelected().data.idcaja;
            }
        });

    },
    initFunctions: function () {

        var me = this;

        this.lMaskCargando = function () {
            this.lMask = new Ext.LoadMask(this.body, {//body de la ventana
                msg: this.idioma.lbCargando
            });
            this.lMask.show();
        };

        this.deletePermiso = function () {

            var msgSuccess = this.idioma.lbDelPersonaSatisfact;
            var lbDelAsocError = this.idioma.lbDelPersonaError;

            Ext.Ajax.request({
                method: "POST",
                url: "deletepermisocaja",
                params: {
                    idpermiso: this.smPermiso.getSelected().data.idpermiso
                },
                scope: this,
                callback: function (options, success, response) {

                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '1') {
                        this.gpPermiso.getStore().load();
                        mostrarMensaje(1, msgSuccess);
                    } else mostrarMensaje(1, lbDelAsocError);
                }
            });

        };

        this.savePermiso = function (idPersona) {
            var msgSuccessAdd = this.idioma.lbAddPersonaSatisfact;
            var msgSuccessMod = this.idioma.lbModPersonaSatisfact;
            var idCaja = this.scope.panelCaja.smCaja.getSelected().get('idcaja');
            var idPermiso = -1;
            if (this.smPermiso.getSelected()) {
                idPermiso = this.smPermiso.getSelected().data.idpermiso
            }

            Ext.Ajax.request({
                method: "POST",
                scope: this,
                url: "savepermisocaja",
                params: {
                    idpermiso: idPermiso,
                    idcaja: idCaja,
                    idpersona: idPersona
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codM == '1' && idPermiso == -1)
                        mostrarMensaje(1, msgSuccessAdd);
                    else mostrarMensaje(1, msgSuccessMod);
                    this.gpPermiso.getStore().load();
                }
            });
        };

        this.mostrarBusquedaPersona = function () {

            this.btnCancelarBusPer = new Ext.Button({
                text: this.idioma.lbCancelar,
                tooltip: this.idioma.lbToolCancelar,
                //icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'cancelar',
                id: 'btnCancelarBusPer',
                scope: this,
                handler: function () {
                    this.windowPersona.close();
                }
            });

            this.btnAceptarBusPer = new Ext.Button({
                text: this.idioma.lbAceptar,
                tooltip: this.idioma.lbToolAceptar,
                //icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'aceptar',
                scope: this,
                id: 'btnAceptarBusPer',
                handler: function () {
                    if (this.panelPersona.getSeleccion()) {
                        var idPersona = this.panelPersona.getSeleccion().get('idpersona');
                        var nombre = '';
                        if (this.panelPersona.getSeleccion().get('snombre')) {
                            nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('snombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                        } else {
                            nombre = this.panelPersona.getSeleccion().get('nombre') + ' ' + this.panelPersona.getSeleccion().get('papel') + ' ' + this.panelPersona.getSeleccion().get('sapel');
                        }
                        this.savePermiso(idPersona);
                        this.windowPersona.close();
                    }
                }
            });

            this.windowPersona = new Ext.Window({
                modal: true,
                layout: 'fit',
                id: 'windowPersona',
                title: 'Buscar persona',
                constrain: true,
                height: Ext.lib.Dom.getViewHeight() * 0.5,
                width: Ext.lib.Dom.getViewWidth() * 0.3,
                closeAction: 'close',
                closable: true,
                plain: false,
                items: [this.panelPersona = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                    seguridad: 0,
                    limit: 15,
                    start: 0
                })],
                resizable: true,
                buttons: [this.btnCancelarBusPer, this.btnAceptarBusPer]
            });
            this.windowPersona.show();
        };
    },
    createGrid: function () {
        var me = this;

        this.rowaction = new Ext.grid.RowActions({
            id: 'idRowaction',
            actions: [
                {
                    id: 'eliminar',
                    tooltip: this.idioma.lbDelPermiso,
                    iconCls: 'eliminar',
                    marginLeft: 5,
                    width: 16,
                    height: 16
                }
            ]
        });

        this.stPermiso = new Ext.data.Store({
            url: 'cargarpermisocaja',
            scope: this,
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idpersona'},
                {name: 'idpermiso'},
                {name: 'nombre'}
            ]),
            sortInfo: {field: 'idpersona', direction: 'DESC'}
        });

        //Nueva solucion de persona----------------------
        this.rowEditor = new Ext.Cont.RowEditor({
            cancelText: this.idioma.lbCancelar,
            saveText: this.idioma.lbAceptar,
            iconClsSave: 'aceptar',
            iconClsCancel: 'cancelar',
            saveTooltip: this.idioma.lbToolRowEditorAceptar,
            cancelTooltip: this.idioma.lbToolRowEditorCancelar
        });

        this.rowEditor.on({
            scope: this,
            afteredit: function (editor, grid, changes, record, rowIndex) {

                record.set('nombre', Ext.getCmp('cbPersona').getRawValue());
                me.savePermiso(Ext.getCmp('cbPersona').getValue());
            }
        });

        this.stPersona = new Ext.data.Store({
            url: 'loadPersonas',
            sortInfo: {
                field: 'nombre',
                direction: "ASC"
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                name: 'idpersona'
            }, {
                name: 'nombre'
            }, {
                name: 'numid'
            }, {
                name: 'cargo'
            }
            ])
        });

        this.cbPersona = new Ext.form.ComboBox({
            id: 'cbPersona',
            fieldLabel: this.idioma.lbNombrecompleto,
            store: this.stPersona,
            valueField: 'idpersona',
            hiddenName: 'idpersona',
            displayField: 'nombre',
            emptyText: this.idioma.lbSeleccione, //'Seleccione...',
            disabledClass: 'disabled-component',
            //editable: true,
            forceSelection: true,
            allowBlank: false,
            //blankText: this.idioma.lbBlankText,
            resizable: true,
            //readOnly: true,
            triggerAction: 'all',
            anchor: '100%',
            minChars: 0, //Para la nueva busqueda poner contraria esta linea
            pageSize: 10, //Para la nueva busqueda poner contraria esta linea
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{numid} {nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            selectOnFocus: true,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                select: function (combo, record, index) {
                    if (this.gpPermiso.getStore().find('idpersona', record.data.idpersona) >= 0 && this.gpPermiso.getStore().find('nombre', record.data.nombre) >= 0) {
                        mostrarMensaje(1, this.idioma.lbPersonaExiste);
                        combo.clearValue();
                    }
                }
            }
        });
        //------------------------------------------

        this.gpPermiso = new Ext.grid.EditorGridPanel({
            clicksToEdit: 2,
            idioma: this.idioma,
            perfil: this.perfil,
            stripeRows: true,
            //loadMask: true,
            frame: false,
            broder: false,
            store: this.stPermiso,
            columns: [
                {
                    header: this.idioma.lbNombreApellido,
                    sortable: true,
                    hideable: true,
                    width: (Ext.lib.Dom.getViewWidth() - 10) * 0.3,
                    dataIndex: 'nombre',
                    editor: this.cbPersona,
                    renderer: function (value, metadata, record, rowIndex, colIndex, store) {
                        if (Ext.isEmpty(value)) {
                            var store = Ext.getCmp('cbPersona').store;
                            if (store) {
                                var index = store.find('idpersona', Ext.getCmp('cbPersona').getValue());
                                if (index >= 0) {
                                    return store.getAt(index).data.nombre;
                                }
                            }
                        } else return record.data.nombre;
                    }
                },
                this.rowaction
            ],
            autoExpandColumn: 'nombre',
            plugins: [this.rowEditor, this.rowaction],
            sm: this.smPermiso = new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            viewConfig: {
                forceFit: true
            },
            tbar: [{
                scope: this,
                text: this.idioma.lbAdd,
                iconCls: 'adicionar',
                id: 'idBtnAddPersona',
                disabled: true,
                tooltip: this.idioma.lbToolAddPersona,
                //icon: this.perfil.dirImg + 'adicionar.png',
                handler: function () {
                    //this.mostrarBusquedaPersona();
                    this.recordPersona = Ext.data.Record.create([
                        {name: 'idpersona', type: 'int'},
                        {name: 'nombre', type: 'string'},
                        {name: 'numid', type: 'string'},
                    ]);

                    var rec = new this.recordPersona({
                        idpersona: '',
                        nombre: '',
                        numid: ''
                    });
                    this.rowEditor.stopEditing();
                    this.stPermiso.insert(0, rec);
                    this.gpPermiso.getView().refresh();
                    this.rowEditor.startEditing(0, 0);
                    this.cbPersona.focus(true, 100);
                }
            }]
        });

        this.items = this.gpPermiso;
    }
});




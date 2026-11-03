Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('prepararproceso', cargarInterfaz);

//botones y barra de herram
var idpersonaEliminar;
var cambio, mskAux, btnModificarPE, btnEliminarPE, btnComisionPE, btnEvaluadosPE;
var btnAddPersEvaluado, btnDelPersEvaluado, btnDelPersEvaluador, btnAddPersEvaluador, btnAddPersComision, btnDelPersComision, btnCancelarPE, btnAplicarPE, btnAceptarPE, toolb,
    btnAceptarComision, btnAceptarEvaluadores, btnAceptarComAsoc, btnAceptarEvaluados, btnAddComision;
var winProcE, cbEvaluadores, gpComisiones, stComisiones, campos, stProcEvalDef, gpanel, colummodel, vp;
var tfperiodo, dfFechaInicioPE, dfFechaFinPE, formPE, gpProcEvalDef, smProcEvalDef;
var idPE, idPCE;
var idestructuraevaluativaReubicar;
//Variables globales
var idPersonaEvaluador = -1;
var idComisionEvaluacion = -1
var validacionDateFieldE = 0;
var validacionDateFieldPE = 0;
//fecha
var fecha = new Date();
//Otros
var accion = 'ADD';
var cAccion = 'ADD';
var mascaraPE;
var idEvaluador;
var idEvaluadoaEliminar;
var cbTipoestructurae;
var msgWait;
var valorcombo;
var idglobal;
var comboEdoresSelected = -1;
var arrayPersona = new Array();
// formulario de la ventana de adicionar evaluados
Ext.components.Evaluaciones.fpEvaluadosPermiso = Ext.extend(Ext.FormPanel, {
    frame: true,
    labelWidth: 150,
    initComponent: function () {

        this.permisoEscritura = new Ext.form.Checkbox({
            fieldLabel: labels.permisoEscritura,
            checked: true,
            name: 'permisoEscritura',
        });

        this.stPlanillas = new Ext.data.Store({
            url: 'cargarplanillasproceso',
            baseParams: {
                iddefprocesoevaluativo: this.iddefprocesoevaluativo
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'idprocesoplanilla'
                },
                {
                    name: 'planilla'
                },
                {
                    name: 'descripcion'
                }
            ])
        });

        this.cbPlanillas = new Ext.form.ComboBox({
            store: this.stPlanillas,
            anchor: '90%',
            fieldLabel: labels.cbPlanillas,
            displayField: 'planilla',
            valueField: 'idprocesoplanilla',
            tpl: '<tpl for="."><div ext:qtip="<b>{planilla}.</b><p>{descripcion}</p>" class="x-combo-list-item">{planilla}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: labels.Seleccione,
            editable: false,
            allowBlank: false,
            selectOnFocus: true
        });
        Ext.components.Evaluaciones.fpEvaluadosPermiso.superclass.initComponent.call(this);
    }
});

//ventana para adicionar evaluados y evaluadores
Ext.components.Evaluaciones.WinBuscarEvaluador = Ext.extend(Ext.Window, {
    title: 'Adicionar persona',
    width: '90%',
    height: 500,
    layout: 'border',
    modal: true,
    closeAction: 'close',
    initComponent: function () {
        var self = this;
        this.tpBuscarPersona = new Ext.components.Evaluaciones.TabPanelContenedor({
            region: 'center',
            margins: '5 5 5 5',
            parent: self,
        });
        this.fpPermisos = new Ext.components.Evaluaciones.fpEvaluadosPermiso({
            parent: self,
            iddefprocesoevaluativo: this.iddefprocesoevaluativo,
            autoHeight: true,
            region: 'north',
            margins: '5 5 0 5',
            hidden: self.accion == 'evaluador' ? true : false
        });
        var btnCancelarBusPer = new Ext.Button({
            name: 'btnCancelarBusPer',
            iconCls: 'cancelar',
            text: labels.lbBtnCancelar,
            tooltip: labels.ttpBtnCancelar,
            handler: function () {
                self.close();
            },
            nextTab: 'btnAplicarBusPer' + self.id,
        });
        var btnAceptarBusPer = new Ext.Button({
            id: 'btnAceptarBusPer' + self.id,
            iconCls: 'aceptar',
            text: labels.lbBtnAceptar,
            tooltip: labels.ttpBtnAceptar,
            handler: function () {
                adicionarPersona(self.accion, 'aceptar');
            },
            prevTab: 'btnAplicarBusPer' + self.id,
        });
        var btnAplicarBusPer = new Ext.Button({
            id: 'btnAplicarBusPer' + self.id,
            iconCls: 'aplicar',
            text: labels.lbtnAplicarPE,
            tooltip: labels.ttpBtnAplicar,
            handler: function () {
                adicionarPersona(self.accion, 'aplicar');
            },
            prevTab: 'btnCancelarBusPer'
        });
        this.items = [self.fpPermisos, self.tpBuscarPersona];
        this.buttons = [btnCancelarBusPer, btnAplicarBusPer, btnAceptarBusPer];
        Ext.components.Evaluaciones.WinBuscarEvaluador.superclass.initComponent.call(this);
        function adicionarPersona(accion, boton) {
            if (accion == 'evaluador') {
                var seleccion = self.tpBuscarPersona.gpDatosPersona.getSelectionModel().getSelections();
                var seleccionCmpPersona = self.tpBuscarPersona.pBuscarPersona.gpPersonabuscar.getSelectionModel().getSelections();
                arrpersonas = new Array();
                Ext.each(seleccion, function (rec) {
                    arrpersonas.push({
                        idpersona: rec.get('idpersona')
                    });
                });
                Ext.each(seleccionCmpPersona, function (rec) {
                    arrpersonas.push({
                        idpersona: rec.get('idpersona')
                    });
                });
                var result = false;
                if (self.idprocesocomisionevaluacion != null) {
                    result = true;
                }
                if (arrpersonas.length > 0) {
                    PVD.mostrarMascara('idmskmodify', labels.lbPleaseWait, 'Guardando datos del evaluador');
                    Ext.Ajax.request({
                        url: 'asociarevaluadores',
                        params: {
                            arrPersonasID: Ext.encode(arrpersonas),
                            idpreprocesoevaluativo: self.recProceso.get('idpreprocesoevaluativo'),
                            autoevaluacion: self.recProceso.get('autoevaluacion'),
                            idprocesocomisionevaluacion: (result ? self.idprocesocomisionevaluacion : -1 )
                        },
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('idmskmodify');
                            responseData = Ext.decode(response.responseText);
                            if (responseData.adicionado == true) {
                                if (arrpersonas.length > 1) {
                                    mostrarMensaje(1, 'Los evaluadores han sido adicionados satisfactoriamente');
                                }
                                else {
                                    mostrarMensaje(1, 'El evaluador han sido adicionado satisfactoriamente');
                                }
                                if (boton == 'aceptar')
                                    self.close();
                            }
                            self.parent.store.baseParams.idpreprocesoevaluativo = self.recProceso.get('idpreprocesoevaluativo');
                            self.parent.store.baseParams.idprocesocomisionevaluacion = (result ? self.idprocesocomisionevaluacion : -1);
                            self.parent.getStore().reload();
                        }
                    });
                }
                else {
                    if (boton == 'aceptar')
                        self.close();
                }
            }
            else {
                if (self.fpPermisos.getForm().isValid()) {
                    var seleccion = self.tpBuscarPersona.gpDatosPersona.getSelectionModel().getSelections();
                    var seleccionCmpPersona = self.tpBuscarPersona.pBuscarPersona.gpPersonabuscar.getSelectionModel().getSelections();
                    arrpersonas = new Array();
                    Ext.each(seleccion, function (rec) {
                        arrpersonas.push({
                            idpersona: rec.get('idpersona')
                        });
                    });
                    Ext.each(seleccionCmpPersona, function (rec) {
                        arrpersonas.push({
                            idpersona: rec.get('idpersona')
                        });
                    });
                    if (arrpersonas.length > 0) {
                        PVD.mostrarMascara('idmskmodify', labels.lbPleaseWait, 'Guardando datos del evaluado');
                        Ext.Ajax.request({
                            url: 'asociarevaluados',
                            params: {
                                idprocesoplanilla: self.fpPermisos.cbPlanillas.getValue(),
                                arrPersonasID: Ext.encode(arrpersonas),
                                idEvaluador: idEvaluador,
                                permisoEscritura: self.fpPermisos.permisoEscritura.getValue(),
                                //idpreprocesoevaluativo: listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
                                //autoevaluacion: listProcesos.getSelectionModel().getSelected().get('autoevaluacion')
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmskmodify');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.adicionado == true) {
                                    if (arrpersonas.length > 1) {
                                        mostrarMensaje(1, 'Los evaluados han sido adicionados satisfactoriamente');
                                        self.parent.gpEvaluados.getStore().load({
                                            params: {
                                                idpreprocesoevaluativo: self.recProceso.get('idpreprocesoevaluativo'),
                                                idEvaluador: idEvaluador
                                            }
                                        });
                                    }
                                    else {
                                        mostrarMensaje(1, 'El evaluado han sido adicionado satisfactoriamente');
                                        self.parent.gpEvaluados.getStore().load({
                                            params: {
                                                idpreprocesoevaluativo: self.recProceso.get('idpreprocesoevaluativo'),
                                                idEvaluador: idEvaluador
                                            }
                                        });
                                    }
                                    if (boton == 'aceptar')
                                        self.close();
                                }

                            }
                        });
                    }
                    else {
                        Ext.MessageBox.show({
                            title: 'Información',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING,
                            msg: 'Debe seleccionar personas para poder adicionar.',
                        });
                    }
                }
            }
        }
    }
});

//formulario que contiene el combobox de comision
Ext.components.Evaluaciones.fpComision = Ext.extend(Ext.FormPanel, {
    frame: true,
    region: 'north',
    autoHeight: true,
    margins: '5 5 0 5',
    initComponent: function () {
        var self = this;
        this.storeComisionfpComision = new Ext.data.Store({
            url: 'cargarcbComision',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idprocesocomisionevaluacion'},
                {name: 'idcomisionevaluacion'},
                {name: 'denom'}
            ])
        });

        this.comboBoxComision = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idprocesocomisionevaluacion',
            hiddenName: 'idprocesocomisionevaluacion',
            forceSelection: true,
            anchor: '95%',
            displayField: 'denom',
            store: this.storeComisionfpComision,
            allowBlank: false,
            fieldLabel: labels.lbBtnComision,
            labelStyle: 'width:140px',
            mode: 'local'
        });

        this.items = [this.comboBoxComision];
        Ext.components.Evaluaciones.fpComision.superclass.initComponent.call(this);
    }
});

//ventana para gestionar evaluados
Ext.components.Evaluaciones.WinGestionarEvaluados = Ext.extend(Ext.Window, {
    layout: 'border',
    width: '98%',
    modal: true,
    closable: true,
    resizable: false,
    height: 460,
    initComponent: function () {
        var self = this;
        var idEvaluadoaEliminar;

        this.winAddEvaluado = new Ext.components.Evaluaciones.WinBuscarEvaluador({
            accion: 'evaluado',
            recProceso: this.listProcesos,
            iddefprocesoevaluativo: this.listProcesos.get('iddefprocesoevaluativo'),
            parent: self
        });

        this.gpEvaluadores = new Ext.components.Evaluaciones.gpListEvaluadores({
            width: '48%',
            margins: '5 0 5 5',
            gestionar: false,
            recProceso: this.listProcesos
        });

        btnAddPersEvaluado = new Ext.Button({
            iconCls: 'adicionar',
            disabled: true,
            text: labels.lbBtnAdicionar,
            tooltip: labels.lbToolTipAddPersEvaluado,
            id: 'btnAddPersEvaluado',
            prevTab: 'btnAceptarEvaluados' + self.id,
            nextTab: 'btnDelPersEvaluado' + self.id,
            handler: function () {
                self.winAddEvaluado.show();
            }
        });

        btnDelPersEvaluado = new Ext.Button({
            iconCls: 'eliminar',
            disabled: true,
            text: labels.lbBtnEliminar,
            tooltip: labels.lbToolTipDelPersEvaluado,
            id: 'btnDelPersEvaluado' + self.id,
            handler: function () {
                mostrarMensaje(2, labels.TextDelEvaluado, function (btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('idmskmodify', labels.lbPleaseWait, labels.TextBarraEnProgresoDelEvaluado);
                        Ext.Ajax.request({
                            url: 'restaurarpersonaedos',
                            method: 'POST',
                            params: {
                                idEvaluado: idEvaluadoaEliminar
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('idmskmodify');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.exception == 1) {
                                    mostrarMensaje(1, labels.EvaluadoEnUso);
                                }
                                else {
                                    btnDelPersEvaluado.disable();
                                    mskAux.hide();
                                    mostrarMensaje(1, labels.EvaluadoDelOK);
                                    st_Evaluados.reload({
                                        params: {
                                            limit: 10,
                                            start: 0
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            },
            nextTab: 'inputNombrePersonasEvaluadas',
            prevTab: 'btnAddPersEvaluado' + self.id
        });

        storeComision = new Ext.data.Store({
            url: 'cargarcbComision',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idprocesocomisionevaluacion'
            }, [
                {
                    name: 'idprocesocomisionevaluacion'
                },
                {
                    name: 'idcomisionevaluacion'
                },
                {
                    name: 'denom'
                }
            ])
        });

        cbComEvaluadores = new Ext.form.ComboBox({
            name: 'cbComEvaluadores',
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            valueField: 'idprocesocomisionevaluacion',
            hiddenName: 'idprocesocomisionevaluacion',
            forceSelection: true,
            anchor: '95%',
            displayField: 'denom',
            store: storeComision,
            mode: 'local',
            allowBlank: false,
            blankText: labels.lbCampoVacioComision,
            labelStyle: 'width:140px',
            fieldLabel: labels.lbBtnComision,
            listeners: {
                select: function (combo, record, index) {
                    idComisionEvaluacion = record.get('idcomisionevaluacion');
                    st_Evaluados.removeAll();
                    cbEvaluadores.enable();
                    cbEvaluadores.reset();
                    storeEvaluadores.load({
                        params: {
                            // idprocesocomisionevaluacion: record.get('idprocesocomisionevaluacion'),
                            idpreprocesoevaluativo: self.listProcesos.get('idpreprocesoevaluativo')
                        }
                    });
                }
            }
        });

        var formEvaluados = new Ext.FormPanel({
            frame: true,
            margins: '5 5 0 5',
            region: 'north',
            autoHeight: true,
            items: [cbComEvaluadores]
        });
        var kmEvaluados = [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    btnAddPersEvaluado.handler();
                }
            },
            {
                key: 46,
                fn: function () {
                    if (!btnDelPersEvaluado.disabled) {
                        btnDelPersEvaluado.handler();
                    }
                }
            }
        ];

        st_Evaluados = new Ext.data.Store({
            url: 'cargarEvaluadosPorEvaluador',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos"
            }, [
                {name: 'idprocesoevaluados'},
                {name: 'nombre'},
                {name: 'idpersona'},
                {name: 'idprocesoevaluadores'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'numid'}
            ])
        });

        this.buscarEvaluado = new Ext.app.SearchField({
            store: st_Evaluados,
            emptyText: labels.TextBuscar
        });

        this.gpEvaluados = new Ext.grid.GridPanel({
            region: 'center',
            disabled: true,
            margins: '5 5 5 5',
            width: '52%',
            title: labels.lbListEvaluados,
            columns: [
                {header: 'No. identidad', sortable: true, dataIndex: 'numid'},
                {header: 'Nombre', sortable: true, dataIndex: 'nombre'},
                {header: 'Segundo nombre', sortable: true, dataIndex: 'snombre'},
                {header: 'Primer apellido', sortable: true, dataIndex: 'papel'},
                {header: 'Segundo apellido', sortable: true, dataIndex: 'sapel'}
            ],
            tbar: [btnAddPersEvaluado, btnDelPersEvaluado, self.buscarEvaluado],
            store: st_Evaluados,
            loadMask: {
                msg: labels.lbGridLoadMask
            },
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            minSize: 75,
            height: 320,
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: st_Evaluados,
                displayInfo: true,
                displayMsg: labels.lbPaginToolBar
            }),
            keys: kmEvaluados,
        });

        this.gpEvaluados.getSelectionModel().on('rowselect', function (sm, rowIndex, record) {
            idEvaluadoaEliminar = record.data.idprocesoevaluados;
            btnDelPersEvaluado.enable();
        });

//        cbComEvaluadores.on('select', function (combo, record, index) {
//            if (self.gpanel.get('autoevaluacion')) {
//                //Mandar a cargar el store del gridpanel de evaluados
//                self.gpEvaluados.store.baseParams.formaevaluacion = 1;
////                self.gpEvaluados.store.baseParams.idpreprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
////                self.gpEvaluados.store.baseParams.autoevaluacion = gpanel.getSelectionModel().getSelected().get('autoevaluacion');
//                self.gpEvaluados.store.load();
//            }
//            else {
//                //Mandar a cargar el store del gridpanel de evaluadores
//                self.gpEvaluadores.enable();
//                self.gpEvaluadores.setIdProcesoComision(record.get('idprocesocomisionevaluacion'));
////                self.gpEvaluadores.store.baseParams.idpreprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
//                self.gpEvaluadores.store.baseParams.idprocesocomisionevaluacion = record.get('idprocesocomisionevaluacion');
//                self.gpEvaluadores.store.load();
//            }
//        }, this);

        this.gpEvaluadores.getSelectionModel().on('rowselect', function (sm, rowIndex, record) {
            this.gpEvaluados.enable();
            btnAddPersEvaluado.enable();
            this.gpEvaluados.getStore().baseParams.idprocesoevaluadores = record.data.idprocesoevaluadores;
//            this.gpEvaluados.getStore().baseParams.idpreprocesoevaluativo = self.gpanel.get('idpreprocesoevaluativo');
//            this.gpEvaluados.getStore().baseParams.autoevaluacion = self.gpanel.get('autoevaluacion');
            idEvaluador = record.data.idprocesoevaluadores;
            this.gpEvaluados.getStore().load({
                params: {
                    limit: '15',
                    start: '0',
                }
            });
        }, this)

        this.btnAceptarWinEvaluador = new Ext.Button({
            iconCls: 'cerrar',
            text: labels.lbBtnCerrar,
            tooltip: labels.ttpBtnCerrar,
            handler: function () {
                self.close();
            }
        });

//        this.on('show', function () {
//            idPersonaEvaluador = -1;
//            st_Evaluados.removeAll();
//            cbEvaluadores.reset();
//            cbComEvaluadores.reset();
//            self.gpEvaluadores.tfBuscar.focus(false, 300);
//            if (self.gpanel.get('autoevaluacion')) {
//                cbComEvaluadores.disable();
//                cbEvaluadores.disable();
//                st_Evaluados.baseParams.idpreprocesoevaluativo = self.gpanel.get('idpreprocesoevaluativo');
//                st_Evaluados.baseParams.idPersonaEvaluador = null;
//                st_Evaluados.baseParams.idprocesoevaluadores = null;
//                st_Evaluados.baseParams.formaevaluacion = 1;
//                st_Evaluados.baseParams.autoevaluacion = self.gpanel.get('autoevaluacion');
//                st_Evaluados.reload({
//                    params: {
//                        limit: 10,
//                        start: 0
//                    }
//                });
//            } else {
//                if (self.gpanel.get('comisionevaluacion')) {
//                    cbComEvaluadores.enable();
//                    cbEvaluadores.disable();
//                    storeComision.load({
//                        params: {
//                            idpreprocesoevaluativo: self.gpanel.get('idpreprocesoevaluativo')
//                        }
//                    });
//                }
//                else {
//                    cbComEvaluadores.disable();
//                    storeEvaluadores.removeAll();
//                }
//            }
//            if (self.gpanel.get('autoevaluacion')) {
//                if (self.gpanel.get('comisionevaluacion')) {
//                    storeComision.reload({
//                        params: {
//                            idpreprocesoevaluativo: self.gpanel.get('idpreprocesoevaluativo')
//                        }
//                    });
//                }
//                else {
//                    cbComEvaluadores.disable();
//                }
//                self.gpEvaluadores.hide();
//                self.gpEvaluados.enable();
//                btnAddPersEvaluado.enable();
//            }
//            else {
//                if (self.gpanel.get('comisionevaluacion')) {
//                    storeComision.reload({
//                        params: {
//                            idpreprocesoevaluativo: self.gpanel.get('idpreprocesoevaluativo')
//                        }
//                    });
//                    self.gpEvaluadores.disable();
//                }
//                else {
//                    cbComEvaluadores.disable();
//                    self.gpEvaluadores.cargarListEvaluadores(self.gpanel.get('idpreprocesoevaluativo'));
//                }
//                self.gpEvaluadores.setVisible(true);
//            }
//            self.doLayout();
//        }, this);

        this.on('close', function () {
            self.gpEvaluadores.getSelectionModel().clearSelections();
        }, this);

        this.gpEvaluadores.getStore().on('load', function () {
            self.gpEvaluadores.btnAddPersEvaluador.focus();
            self.gpEvaluados.getStore().removeAll();
            self.gpEvaluados.disable();
        }, this);

        this.gpEvaluados.getStore().on('load', function () {
            btnAddPersEvaluado.focus();
        }, this);

        this.winAddEvaluado.on('close', function () {
            self.btnAceptarWinEvaluador.focus();
        }, this);

        this.items = [formEvaluados, this.gpEvaluadores, this.gpEvaluados];
        this.keys = [
            {
                key: 'x',
                alt: true,
                ctrl: true,
                fn: function () {
                    self.btnAceptarWinEvaluador.handler();
                }
            }
        ];
        this.buttons = [this.btnAceptarWinEvaluador];
        Ext.components.Evaluaciones.WinGestionarEvaluados.superclass.initComponent.call(this);
    }
});

/**
 * Gestionar estructura evaluativa
 */
Ext.components.Evaluaciones.EstEvaluativa = Ext.extend(Ext.Window, {
    title: 'Gestionar estructura evaluativa',
    width: '30%',
    height: 500,
    layout: 'border',
    modal: true,
    closeAction: 'close',
    initComponent: function () {
        var self = this;

        var rgPlanillaEvaluacion = new Ext.form.RadioGroup({
            xtype: 'radiogroup',
            items: [
                {boxLabel: 'No', name: 'planilla', inputValue: 1, checked: false, width : 150},
                {boxLabel: 'Si', name: 'planilla', inputValue: 0, checked: true, width : 150}
            ]

        });

        this.btnAceptar = new Ext.Button({
            disabled: false,
            iconCls: 'aceptar',
            text: labels.lbBtnAceptar,
            tooltip: labels.ttpBtnAceptar,
            handler: function () {
                guardarEstructuraEvaluativa();
                self.hide();
				//self.stPersonaE.removeAll();
            }
        });

        this.btnAplicar = new Ext.Button({
            disabled: false,
            iconCls: 'aplicar',
            text: labels.lbBtnAplicar,
            tooltip: labels.ttpBtnAplicar,
            handler: function () {
                guardarEstructuraEvaluativa();
            }
        });

        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: labels.lbBtnCancelar,
            tooltip: labels.ttpBtnCancelar,
            handler: function () {
                self.hide();
				//self.stPersonaE.removeAll();
            }
        });
    /******************Para cargar las planillas de las personas de un periodo anterior****************************************/
        self.stPeriodos = new Ext.data.GroupingStore({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/realizarevaluacion/getPeriodos',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{name: 'idperiodoproceso'}, {name: 'periodo'}, {name: 'fdesde'}, {name: 'fhasta'},
                {name: 'proceso'}, {name: 'idpersonaevaluacion'},{name: 'idplanilla'},{name: 'denom'},{name: 'idprocesoplanilla'}
            ]),
            sortInfo: {field: 'denom', direction: "DESC"},
            groupField : 'denom',
            listeners: {
                beforeload: function (st, options) {

                }
            }
        });

        self.stPeriodos.load();


        this.smPer = new Ext.grid.CheckboxSelectionModel({
            singleSelect : true
        });

        this.gpPeriodos = new Ext.grid.GridPanel({
            id: 'gpPeriodosev',
            title: 'Listado de periodos por procesos evaluativos',
            store: this.stPeriodos,
            loadMask: true,
            sm: this.smPer,
            view: new Ext.grid.GroupingView({
                forceFit       : true,
                startCollapsed : false,
                groupTextTpl   : '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Periodos" : "Periodo"]})'
            }),
            columns: [
                {header: 'Planilla evaluativa', width:100, dataIndex: 'denom', hidden: true},
                {header: 'Período evaluativo ', width:200, dataIndex: 'periodo'},
                {header: 'Fecha inicio', width:100, dataIndex: 'fdesde'},
                {header: 'Fecha fin', width:100, dataIndex: 'fhasta'}

            ]
        });

        this.gpPeriodos.getSelectionModel().on('rowselect', function (s){
            self.btnAceptarPer.enable();
        });

        this.btnCancelarPer = new Ext.Button({
            nextTab: 'gpPeriodosev',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
            text: 'Cancelar',
            handler: function ()
            {
                self.winCargarEvalPer.hide();
            }.createDelegate(this)
        });

        this.btnAceptarPer = new Ext.Button({
            id: 'btnAceptarPer',
            nextTab: 'tcbEntidadPadre',
            disabled: true,
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            text: 'Aceptar',
            listeners: {
                'enable': function() {
                    self.btnCancelarPer.nextTab = 'btnAceptarPer';
                },
                'disable': function() {
                    self.btnCancelarPer.nextTab = 'gpPeriodosev';
                }
            },
            handler: function () {
                cargarPlanilla();
            }.createDelegate(this)
        });

        this.winCargarEvalPer = new Ext.Window({
            title: 'Cargar planilla del período seleccionado',
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            width: 500,
            height: 300,
            items: [this.gpPeriodos],
            buttons: [this.btnCancelarPer, this.btnAceptarPer],
            keys: [{
                key: 'x',
                alt: true,
                fn: function () {
                    if (!self.btnCancelarPer.disabled) {
                        self.btnCancelarPer.handler();
                    }
                }
            },
                {
                    key: 13,
                    fn: function () {
                        if (!self.btnAceptarPer.disabled) {
                            self.btnAceptarPer.handler();
                        }
                    }
                }]
        });

 /**************************************************************************************************************************/
        var btnCargarPlnAnt = new Ext.Button({
            text: 'Cargar planilla',
            tooltip: 'Cargar planilla anterior',
            iconCls: 'cargardocumento',
            handler: function () {
                self.winCargarEvalPer.show();
                self.gpPeriodos.getSelectionModel().clearSelections();
            }
        });

        this.loaderEstrucEval =new Ext.tree.TreeLoader({
            url:'getEstructura',
            listeners: {
                beforeload: function (tloader, node, response) {
                    tloader.baseParams.idperiodoproceso = self.idperiodoproceso;
                    self.cbPlanillase.enable();
                }

            }
        }),

        this.tpEstructura = new Ext.tree.TreePanel({
            autoScroll: true,
            animate: true,
            border: false,
            enableDD: true,
            region:'center',
            containerScroll: true,
            loader: self.loaderEstrucEval,
            root: new Ext.tree.AsyncTreeNode({
                expanded: false,
                expandable: true,
                text: 'Estructura Evaluativa',
                id: 'root'
            }),
            rootVisible: true
        });


       this.tpEstructura.on('checkchange', function (n, check) {
            if (check) {
               if (n.hasChildNodes()) {
                    var hijos = n.childNodes;
                    for (var i = 0; i < hijos.length; i++) {
                        hijos[i].ui.toggleCheck(true);

                    }
                }
            }
           else if (!check) {
                if (n.hasChildNodes()) {
                    var hijos = n.childNodes;
                    for (var i = 0; i < hijos.length; i++) {
                        hijos[i].ui.toggleCheck(false);
                    }

                }
            }
         });
		
		/***************************plantilla para la estructura evaluativa******************************/
		this.stPlanillase = new Ext.data.Store({
            url: 'cargarplanillasproceso',
            baseParams: {
                iddefprocesoevaluativo: this.iddefprocesoevaluativo
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'idprocesoplanilla'
                },
                {
                    name: 'planilla'
                },
                {
                    name: 'descripcion'
                }
            ])
        });

        this.cbPlanillase = new Ext.form.ComboBox({
            store: this.stPlanillase,
            anchor: '100%',
			disabled:true,
            fieldLabel: labels.cbPlanillas,
            displayField: 'planilla',
            valueField: 'idprocesoplanilla',
			hiddenName: 'idprocesoplanilla',
            tpl: '<tpl for="."><div ext:qtip="<b>{planilla}.</b><p>{descripcion}</p>" class="x-combo-list-item">{planilla}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: labels.Seleccione,
            editable: false,
            allowBlank: false,
            selectOnFocus: true
          });


        if(rgPlanillaEvaluacion.items[1].checked == true){
            self.cbPlanillase.enable();
        }

       /////////////////////////CUANDO ADICIONAS UN CARGO A LA ESTRUCTURA EVALUATIVA////
		 this.p = new Ext.Panel({			   
				layout:'border',
				region:'center',
				items:[
				this.tpEstructura
				]
			});
        this.tbar = [btnCargarPlnAnt],
        this.keys = [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    self.btnAceptar.handler();
                }
            },
            {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    self.btnAplicar.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();
                }
            }
        ];
        var formPl = new Ext.form.FormPanel({
                id:'formPlanilla',
                region: 'north',
                frame: true,
                margins: '5 5 0 5',
                labelAlign: 'top',
                autoHeight: true,
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                layout: 'column',
                                xtype: 'fieldset',
                                width: 550,
                                autoHeight: true,
                                title: 'Evaluar con la misma planilla toda la estructura',
                                items: [rgPlanillaEvaluacion]
                            }
                        ]
                    },this.cbPlanillase]
        });

        this.items =  [
            formPl,
            this.p
        ],
        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar]
        Ext.components.Evaluaciones.EstEvaluativa.superclass.initComponent.call(this);


        function cargarPlanilla()
        {
            var nodes = self.tpEstructura.getChecked();
            if(nodes.length > 0){
                PVD.mostrarMascara('cargarEval', 'Por favor espere...', 'Cargando la planilla');
                var arrIdpersona = new Array();
                Ext.each(nodes, function (node) {
                    if(node.attributes.id == node.attributes.idpadre){
                        arrIdpersona.push({
                            id: node.attributes.id
                        })
                    }
                    else
                    {
                        arrIdpersona.push({
                            id: node.attributes.idllave
                        })
                    }

                });
                Ext.Ajax.request({
                    url: 'saveEstructuraEvaluativa',
                    method: 'POST',
                    params: {
                        idprocesoplanilla: self.gpPeriodos.getSelectionModel().getSelected().get('idprocesoplanilla'),
                        arrIdpersona: Ext.encode(arrIdpersona),
                        idperiodoproceso: self.idperiodoproceso
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('cargarEval');
                        var responseData = Ext.util.JSON.decode(response.responseText);
                        if(responseData.success){
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'La planilla evaluativa se ha cargado satisfactoriamente.',
                                time: 3
                            });
                        }
                        else
                        {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'La planilla evaluativa no se pudo cargar correctamente.',
                                time: 3
                            });
                        }
                        self.winCargarEvalPer.hide();
                    }
                });
            }


        }

        function guardarEstructuraEvaluativa() {

            var nodes = self.tpEstructura.getChecked();
            if (nodes.length > 0) {
                PVD.mostrarMascara('saveesteval', 'Por favor espere...', 'Guardando datos de la estructura');

                var arrIdpersona = new Array();
                Ext.each(nodes, function (node) {
                    if(node.attributes.id == node.attributes.idpadre){
                        arrIdpersona.push({
                            id: node.attributes.id
                        })
                    }
                    else
                    {
                        arrIdpersona.push({
                            id: node.attributes.idllave
                        })
                    }

                });

                Ext.Ajax.request({
                    url: 'saveEstructuraEvaluativa',
                    method: 'POST',
                    params: {
                        arrIdpersona: Ext.encode(arrIdpersona),
                        idperiodoproceso: self.idperiodoproceso,
                        idprocesoplanilla: self.cbPlanillase.getValue(),
                        planilla:formPl.getForm().getValues().planilla

                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('saveesteval');
                        var responseData = Ext.util.JSON.decode(response.responseText);
                        if(responseData.success){
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El período se ha modificado satisfactoriamente.',
                                time: 3
                            });
                        }
                        else
                        {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El período no se pudo modificar correctamente.',
                                time: 3
                            });
                        }
                    }
                });
            }else{
                PVD.mostrarMascara('saveesteval', 'Por favor espere...', 'Guardando datos de la estructura');

                Ext.Ajax.request({
                    url: 'saveEstructuraEvaluativa',
                    method: 'POST',
                    params: {
                        idperiodoproceso: self.idperiodoproceso,
                        idprocesoplanilla: self.cbPlanillase.getValue(),
                        planilla:formPl.getForm().getValues().planilla
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('saveesteval');
                        var responseData = Ext.util.JSON.decode(response.responseText);
                        if(responseData.success){
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El período se ha modificado satisfactoriamente.',
                                time: 3
                            });
                        }
                        else
                        {
                            Ext.Notification.show({
                                title: 'Informaci&oacute;n',
                                msg: 'El período no se pudo modificar correctamente.',
                                time: 3
                            });
                        }
                    }
                });
            }
        }

    }
});

function cargarInterfaz() {
    perfil = arguments[0];
    labels = arguments[1];

    mskAux = new Ext.LoadMask(Ext.getBody(), {
        msg: labels.lbMsgWaitSend
    });

    var cambio = false;

    var btnAyudaTP = new Ext.Button({
        id: 'ayudaPreparar' ,
        text: labels.lbBtnAyudaTP,
        tooltip: labels.lbToolTipAyudaTP,
        iconCls: 'ayuda',
        nextTab: 'inputNombrePE',
        prevTab: 'btnEvaluadosPE' + self.id
    });

    //Fin de los botones
    //Componetes de la ventana adiconar prediodos de evaluacion
    var btnAcept = new Ext.Button({
        id: 'btnAcept' + self.id,
        text: 'Aceptar',
        tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
        iconCls: 'aceptar',
        handler: function () {
            RealizarAccionPeriodo(windAddPeriodos.accion, 'acp');
        }
    });

    var btnApply = new Ext.Button({
        id: 'btnApply' + self.id,
        text: 'Aplicar',
        tooltip: 'Guardar datos y limpiar los campos <b>(Alt+P)</b>',
        iconCls: 'aplicar',
        handler: function () {
            RealizarAccionPeriodo(accionp, 'apl');
        }
    });

    var btnCancel = new Ext.Button({
        id: 'btnCancel' + self.id,
        text: 'Cancelar',
        tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
        iconCls: 'cancelar',
        handler: function () {
            windAddPeriodos.hide();
        }
    });

    var tfDenomination = new Ext.form.TextField({
        id: 'tfDenomination' + self.id,
        fieldLabel: 'Denominaci&oacute;n',
        name: 'denominacion',
        allowBlank: false,
        anchor: '100%'
    });

    var dfFrom = new Ext.form.DateField({
        name: 'fechainicio',
        id: 'fechainicio' + self.id,
        fieldLabel: 'Fecha inicio',
        anchor: '98%',
        allowBlank: false,
        format: 'd/m/Y',
        value: new Date().format('d/m/Y'),
        vtype: 'daterange',
        endDateField: 'fechafin' + self.id
    });

    var dfUp = new Ext.form.DateField({
        name: 'fechafin',
        id: 'fechafin' + self.id,
        fieldLabel: 'Fecha fin',
        allowBlank: false,
        anchor: '100%',
        format: 'd/m/Y',
        value: '',
        vtype: 'daterange',
        startDateField: 'fechainicio' + self.id
    });

    var dfFromEval = new Ext.form.DateField({
        name: 'fechainicioevalua',
        id: 'fechainicioevalua' + self.id,
        fieldLabel: 'Fecha inicio evaluación',
        anchor: '98%',
        format: 'd/m/Y',
        value:'',
        vtype: 'daterange',
        endDateField: 'fechafinevalua' + self.id
    });

    var dfUpEval = new Ext.form.DateField({
        name: 'fechafinevalua',
        id: 'fechafinevalua' + self.id,
        fieldLabel: 'Fecha fin evaluación',
        anchor: '100%',
        format: 'd/m/Y',
        value: '',
        vtype: 'daterange',
        startDateField: 'fechainicioevalua' + self.id
    });

    var stTipoEstructura= new Ext.data.SimpleStore({
        fields: ['idtipoestructura', 'denomtipoestructura'], data: [
            [1, 'Evaluación de desempeño de personas'],
            [3, 'Evaluación de desempeño de áreas']
        ]
    });

    var cbTipoestructura = new Ext.form.ComboBox({
        fieldLabel: 'Tipo de estructura',
        store: stTipoEstructura,
        displayField: 'denomtipoestructura',
        valueField: 'idtipoestructura',
        name: 'idtipoestructura',
        forceSelection: true,
        allowblank: false,
        readOnly: true,
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        allowBlank: false,
        blankText:'Campo vacio',
        selectOnFocus: true,
        anchor: '100%'

    });

    var rgPlanilla = new Ext.form.RadioGroup({
        xtype: 'radiogroup',
        items: [
            {boxLabel: 'Planilla Evaluativa', name: 'planilla', inputValue: 0, checked: true, width : 150},
            {boxLabel: 'No Planilla Evaluativa', name: 'planilla', inputValue: 1}
        ]
    });



    var formPeriodoEval = new Ext.form.FormPanel({
        width: 420,
        frame: true,
        region: 'center',
        bodyStyle: 'padding: 5px 5px 0',
        border: false,
        labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
        labelAlign: 'top',
        items: [
            tfDenomination,
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [dfFrom]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [dfUp]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [dfFromEval]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [dfUpEval]
                    }

                ]
            },cbTipoestructura,
            {
                layout: 'column',
                xtype: 'fieldset',
                width: 378,
                autoHeight: true,
                title: 'Como se evalua dentro del proceso',
                items: [rgPlanilla]
            }
        ]

    });

    var windAddPeriodos = new Ext.Window({
        border: false,
        modal: true,
        width: 430,
        height: 370,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        items: [formPeriodoEval],
        // keys: mapWinMod,
        keys: [{
            key: Ext.EventObject.ENTER,
            stopEvent: true,
            fn: function () {
                btnAcept.handler();
            }
        },
            {
                key: 'p',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!btnApply.disabled) {
                        btnApply.handler();
                    }

                }
            },
            {
                key: 'x',
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!btnCancel.disabled) {
                        btnCancel.handler();
                    }
                }
            }],
        buttons: [btnCancel, btnApply, btnAcept]
    });

    windAddPeriodos.on('show', function () {
        btnCancel.focus();
    }, this);

    function LimpiarFormPeriodos() {
        formPeriodoEval.getForm().reset();
    };

	function Tieneestructura(accionp,record,tipo) {
        PVD.mostrarMascara('tiene'+ self.id,'Comprobando si existe la estructura seleccionada');
        cbTipoestructura.setValue(cbTipoestructurae.getRawValue());

            Ext.Ajax.request({
                    url: 'tieneEstructura',
                    method: 'POST',
                    timeout:3600000,
                    params: {
                        idpreprocesoevaluativo: (!listProcesos.getSelectionModel().getSelected().get('_is_leaf')) ? listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo') : listProcesos.getSelectionModel().getSelected().get('_parent'),
                        tipo:tipo
                    },
                    callback: function (options, success, response) {
                      PVD.ocultarMascara('tiene'+ self.id);
                        var responseData = Ext.util.JSON.decode(response.responseText);
						if(responseData.success){
						 if (accionp == 'ADD') {
								windAddPeriodos.setTitle(labels.titleAddPeriodos);
								dfFrom.setValue(fecha.format('d/m/Y'));
								Ext.getCmp('btnApply' + self.id).show();
								windAddPeriodos.accion = accionp;
								windAddPeriodos.show();

							} else {
								windAddPeriodos.setTitle(labels.titleModPeriodos);
								Ext.getCmp('btnApply' + self.id).hide();
								windAddPeriodos.accion = accionp;
								windAddPeriodos.show();
								formPeriodoEval.getForm().loadRecord(record);

							}
						}
						else
								{
                                    mostrarMensaje(3, 'El período no se puede adicionar, el proceso evaluativo seleccionado no tiene estructura evaluativa.');
								}

					}
                }
            );
    };


    function showWindAddModPeriodos(accionp, record) {
        LimpiarFormPeriodos();
        /*******************************tiene estructura****************************************/
        if(accionp == 'ADD'){
        var btnAcepte = new Ext.Button({
            id: 'btnAcepte' + self.id,
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana <b>(Enter)</b>',
            iconCls: 'aceptar',
            handler: function () {
                windtieneestructura.hide();
                Tieneestructura(accionp,record, cbTipoestructurae.getValue());

            }
        });

        var btnCancele = new Ext.Button({
            id: 'btnCancele' + self.id,
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar datos <b>(Alt+X)</b>',
            iconCls: 'cancelar',
            handler: function () {
                windtieneestructura.hide();
            }
        });
        var stTipoEstructurae= new Ext.data.SimpleStore({
            fields: ['idtipoestructura', 'denomtipoestructura'], data: [
                [1, 'Evaluación de desempeño de personas'],
                [3, 'Evaluación de desempeño de áreas']
            ]
        });

         cbTipoestructurae = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de estructura',
            store: stTipoEstructurae,
            displayField: 'denomtipoestructura',
            valueField: 'idtipoestructura',
            name: 'idtipoestructura',
            forceSelection: true,
            allowblank: false,
            readOnly: true,
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            allowBlank: false,
            blankText:'Campo vacio',
            selectOnFocus: true,
            anchor: '100%'

        });

        var formPeriodoEvale = new Ext.form.FormPanel({
            width: 420,
            frame: true,
            region: 'center',
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            labelWidth: 90, //Con esto hacemos mas pequeñas las etiquetas
            labelAlign: 'top',
            items: [
                cbTipoestructurae
            ]

        });

        var windtieneestructura = new Ext.Window({
            border: false,
            modal: true,
            title:'Estructura evaluativa a verificar',
            width: 430,
            height: 150,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [formPeriodoEvale],
            keys: [{
                key: Ext.EventObject.ENTER,
                stopEvent: true,
                fn: function () {
                    btnAcepte.handler();
                }
            },
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        if (!btnCancele.disabled) {
                            btnCancele.handler();
                        }
                    }
                }],
            buttons: [btnCancele,btnAcepte]
        });

        windtieneestructura.show();
    }
        else
            {

                windAddPeriodos.setTitle(labels.titleModPeriodos);

                if(record.data.planilla ==1){
                    rgPlanilla.items[0].checked = false;
                    rgPlanilla.items[1].checked = true;
                }else if(record.data.planilla ==0)
                {
                    rgPlanilla.items[0].checked = true;
                    rgPlanilla.items[1].checked = false;
                }


                Ext.getCmp('btnApply' + self.id).hide();
                windAddPeriodos.accion = accionp;
                windAddPeriodos.show();
                formPeriodoEval.getForm().loadRecord(record);
                valorcombo = cbTipoestructurae.getValue();
                cbTipoestructura.disable();
            }
        /***************************************************************************************/

    };
    
    function RealizarAccionPeriodo(accionp, btnpress) {
        if (!listProcesos.getSelectionModel().hasSelection()) {
            Ext.Msg.show({
                title: 'Alerta',
                msg: 'Debe seleccionar un proceso evaluativo.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        var url = '', msgForm = labels.lbWaitMsgAddPE;

        if (accionp == 'ADD') {
            url = 'addRange';
        }
        else {
            url = 'changeRange';
        }

        if (formPE.getForm().isValid() && formPeriodoEval.getForm().isValid()) {
            PVD.mostrarMascara('saveprocess' + self.id, labels.lbPleaseWait, labels.lbMsgWaitSend);
            Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    timeout:3600000,
                    params: {
                        idperiodoproceso: (accionp == 'ADD') ? null : listProcesos.getSelectionModel().getSelected().get('idperiodoproceso'),
                        idpreprocesoevaluativo: (!listProcesos.getSelectionModel().getSelected().get('_is_leaf')) ? listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo') : listProcesos.getSelectionModel().getSelected().get('_parent'),
                        denominacion: tfDenomination.getValue(),
                        fechainicio: dfFrom.getRawValue(),
                        fechafin: dfUp.getRawValue(),
                        fechainicioeval: dfFromEval.getRawValue(),
                        fechafineval: dfUpEval.getRawValue(),
                        idtipoestructura: (accionp == 'ADD') ? cbTipoestructurae.getValue(): valorcombo,
                        iddefprocesoevaluativo: listProcesos.getSelectionModel().getSelected().data.iddefprocesoevaluativo,
                        planilla: formPeriodoEval.getForm().getValues().planilla
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('saveprocess' + self.id);
                        var responseData = Ext.util.JSON.decode(response.responseText);
                        if (responseData.success) {
                            var msg = (accionp == 'ADD') ? labels.msgAddTrue : labels.msgModTrue;
                            if (btnpress == 'acp') {
                                windAddPeriodos.hide();
                            }
                            LimpiarFormPeriodos();
                            mostrarMensaje(1, msg);
                            listProcesos.getSelectionModel().clearSelections();
                            listProcesos.store.reload();

                        } else {
                            var msg = (accionp == 'ADD') ? labels.msgAddFalse : labels.msgModFalse;
                            mostrarMensaje(3, msg);
                        }

                    }
                }
            );
        }
    };
    
    var btnEstEvaluativa = new Ext.Button({
        text:'Asignar planilla ',//labels.lbBtnEstEvaluativa,
        tooltip:'Asignar planilla a los integrantes de la estructura',// labels.ttpBtnEstEvaluativa,
        disabled: true,
        iconCls: 'organigrama',
        handler: function () {

            var win = new Ext.components.Evaluaciones.EstEvaluativa({
                idpreprocesoevaluativo: listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
                idperiodoproceso: listProcesos.getSelectionModel().getSelected().get('idperiodoproceso'),
                iddefprocesoevaluativo: listProcesos.getSelectionModel().getSelected().get('iddefprocesoevaluativo')
            });
            win.show();
        }
    });

    var btnCerrarPeriodo = new Ext.Button({
        text: "Cerrar Per&iacuteodo",//labels.lbBtnCerrarproceso,
        tooltip: "Cerrar Per&iacuteodo",//labels.ttpBtnCerrarproceso,
        disabled: true,
        iconCls: 'cerrar',
        handler: function () {
            cambiarEstado();
        }
    });

    var btnSincronizar = new Ext.Button({
        text: "Sincronizar estructura",
        tooltip: "Sincronizar estructura",
        disabled: true,
        iconCls: 'modificar',
        handler: function () {
            sincronizarEstructura();
        }
    });

    var btnReubicarP = new Ext.Button({
        text: labels.lbBtnReubicarP,
        tooltip: labels.ttpBtnReubicarP,
        disabled: true,
        iconCls: 'buscaryremplazar',
        handler: function () {
            var record = listProcesos.getSelectionModel().getSelected();
            var win = new Ext.components.Evaluaciones.WinReubicarPersona({
                idperiodoproceso: record.data.idperiodoproceso,
                iddefprocesoevaluativo: record.data.iddefprocesoevaluativo
            });
            win.show();
        }
    });

    var btnEstructuraPeriodo = new Ext.Button({
        text:'Estructura periodo',
        tooltip: 'Adicionar persona a la estructura evaluativa',
        disabled: true,
        iconCls: 'buscaryremplazar',
        handler: function () {
            var record = listProcesos.getSelectionModel().getSelected();
            var win = new Ext.components.Evaluaciones.GestEstructura({
                idperiodoproceso: record.data.idperiodoproceso,
                iddefprocesoevaluativo: record.data.iddefprocesoevaluativo,
                estado: record.data.estado

            });
            win.show();
            win.maximize();
        }
    });
		
    var map = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'e',
            alt: true,
            ctrl: true,
            fn: function () {
                btnEstEvaluativa.handler();
            }
        }
    ]);
//cambiar estado  del proceso evaluativo
    function cambiarEstado() {
        if (!listProcesos.getSelectionModel().hasSelection()) {
            Ext.Msg.show({
                title: 'Alerta',
                msg: labels.lbMsgWarnin,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        if (listProcesos.getSelectionModel().getSelected().get('estado') == 2) {
            Ext.Msg.show({
                title: 'Alerta',
                msg: labels.lbMsgWarninAbierto,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        mostrarMensaje(2, 'Est&aacute; seguro que quiere concluir el per&iacute;odo evaluativo', function (btn) {
            if (btn == "ok") {
                PVD.mostrarMascara('mask1', labels.lbMsgWhaitPeriodo, labels.lbMsgCambiarproceso);
                Ext.Ajax.request({
                    url: 'cambiarestado',
                    method: 'POST',
                    params: {
                        idperiodoproceso: listProcesos.getSelectionModel().getSelected().get('idperiodoproceso'),
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask1');
                        var record = listProcesos.getSelectionModel().getSelected();
                        record.set('estado', 2);
						btnCerrarPeriodo.disable();
                    }
                });
            } else {
                btnCerrarPeriodo.focus();
            }
        });
    }

//sincronizar estructura evaluativa
    function sincronizarEstructura() {
        if (!listProcesos.getSelectionModel().hasSelection()) {
            Ext.Msg.show({
                title: 'Alerta',
                msg: labels.lbMsgWarnin,
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }
        mostrarMensaje(2, 'Est&aacute; seguro que quiere sincronizar la estructura evaluativa', function (btn) {
            if (btn == "ok") {
                PVD.mostrarMascara('mask1', 'Sincronizando estructura evaluativa');
                Ext.Ajax.request({
                    url: 'sincronizarestructura',
                    method: 'POST',
                    timeout:3600000,
                        params: {
                        idperiodoproceso: listProcesos.getSelectionModel().getSelected().get('idperiodoproceso')
                    },
                    callback: function (options, success, response) {
                        PVD.ocultarMascara('mask1');
                        responseData = Ext.decode(response.responseText);

                        if (responseData.codResult == 1) {
                            mostrarMensaje(1, responseData.mensaje);
                            btnSincronizar.disable();
                        } else {
                            mostrarMensaje(3, responseData.mensaje);
                            btnSincronizar.disable();
                        }

                    }
                });
            } else {
                btnSincronizar.focus();
            }
        });
    }

//funcionde adicionar persona por comision
    function showWinAddPersComision() {
        var winBusPer = new Ext.components.Evaluaciones.WinBuscarPersona(
            {
                parent: gpPerComision
            });
        winBusPer.show();
        winBusPer.on('close', function (cmp) {
            btnAddPersComision.focus();
        });
        winBusPer.on('peopleSelected', function (selectedRecords) {
            mskAux.show();
            winBusPer.close();
            var arrIdPersonas = new Array();
            Ext.each(selectedRecords, function (proceso) {
                arrIdPersonas.push(proceso.data.idpersona);
            });
            //arrIdPersonas[0] = selectedRecords.data.idpersona;

            Ext.Ajax.request({
                url: 'asociarpersona',
                method: 'POST',
                params: {
                    idcomisionevaluacion: gpComisiones.getSelectionModel().getSelected().get('idcomisionevaluacion'),
                    idpersonas: Ext.encode(arrIdPersonas)//
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    mskAux.hide();
                    st_PerComision.load({
                        params: {
                            limit: 10,
                            start: 0
                        }
                    });
                }
            });
        });
    }

//adicionar personas por comision
    btnAddPersComision = new Ext.Button({
        id: 'btnAddPersComision' + self.id,
        iconCls: 'adicionar',
        text: labels.lbBtnAdicionar,
        tooltip: labels.lbToolTipAddPersComision,
        handler: showWinAddPersComision,
        prevTab: 'btnElmComision' + self.id,
    });

//eliminar personas por comision
    btnDelPersComision = new Ext.Button({
        iconCls: 'eliminar',
        id: 'btnDelPersComision' + self.id,
        disabled: true,
        text: labels.lbBtnEliminar,
        tooltip: labels.lbToolTipDelPersComision,
        handler: function () {
            mostrarMensaje(2, labels.lbMsgEliminarPersona, function (btn) {
                if (btn == "ok") {
                    mskAux.show();
                    var arrPerS = gpPerComision.getSelectionModel().getSelections();
                    var arrPer = new Array();
                    for (var i = 0; i < arrPerS.length; i++) {
                        var arrAux = new Array();
                        arrAux[0] = arrPerS[i].get('idlpersonascomision');
                        arrAux[1] = arrPerS[i].get('idpersona');
                        arrPer[i] = arrAux;
                    }
                    Ext.Ajax.request({
                        url: 'restaurarpersona',
                        method: 'POST',
                        params: {
                            arrPersonas: Ext.encode(arrPer),
//                            idpreprocesoevaluativo: gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
                            formaevaluacion: 1
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            btnDelPersComision.disable();
                            mskAux.hide();
                            st_PerComision.load({
                                params: {
                                    limit: 10,
                                    start: 0
                                }
                            });
                        }
                    });
                } else {
                    btnAddPersComision.focus();
                }
            });
        },
        nextTab: 'inputNombrePC' + self.id,
        prevTab: 'btnAddPersComision' + self.id,
    });

    var textFieldPersCom = new Ext.form.TextField({
        xtype: 'textfield',
        id: 'inputNombrePC' + self.id,
        anchor: '95%',
        fieldLabel: labels.lbDenominacion,
        emptyText: labels.lbEmptyTextBuscar,
        nextTab: 'btnBuscarPersComision' + self.id,
        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        prevTab: 'btnDelPersComision' + self.id,
        listeners: {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    if (!Ext.isEmpty(this.getValue())) {
                        st_PerComision.load({
                            params: {
                                filtro: Ext.getCmp('inputNombrePC' + self.id).getValue(),
                                limit: 15,
                                start: 0
                            },
                            callback: function () {
                                gpPerComision.getSelectionModel().selectFirstRow();
                            }
                        });
                    }
                }
            }
        },
    });

    var btnBuscarPersComision = new Ext.Button({
        iconCls: 'buscar',
        id: 'btnBuscarPersComision' + self.id,
        text: labels.lbBtnBuscarPersComision,
        tooltip: labels.lbToolTipBuscarPersComision,
        handler: function () {
            st_PerComision.load({
                params: {
                    filtro: Ext.getCmp('inputNombrePC' + self.id).getValue(),
                    limit: 15,
                    start: 0
                },
                callback: function () {
                    //gpPerComision.getSelectionModel().selectFirstRow();
                }
            });
        },
        nextTab: 'btnLimpiarPersonaComision' + self.id,
        prevTab: 'inputNombrePC' + self.id,
    });
    var btnLimpiarPersonaComision= new Ext.Button({
        tooltip: 'Limpiar filtros (<b>Alt+L</b>)',
        id: 'btnLimpiarPersonaComision',
        iconCls: 'limpiar',
        text: 'Limpiar',
        handler: function(){
            textFieldPersCom.reset();
            st_PerComision.load({
                params: {
                    filtro: Ext.getCmp('inputNombrePC' + self.id).getValue(),
                    limit: 15,
                    start: 0
                },
                callback: function () {
                }
            });
        },
        nextTab:'btnAceptarComision' + self.id,
        prevTab:'btnBuscarPersComision + self.id'
    });

//    function showWinAddPersEvaluados() {
//        var winBusPer = new Ext.components.Evaluaciones.WinBuscarPersona();
//        winBusPer.show();
//        winBusPer.on('close', function (cmp) {
//            btnAddPersEvaluado.focus();
//        });
//        winBusPer.on('peopleSelected', function (selectedRecords) {
//            mskAux.show();
//            winBusPer.close();
//            var arrIdPersonas = new Array();
//            for (var i = 0; i < selectedRecords.length; i++) {
//                arrIdPersonas[i] = selectedRecords[i].get('idpersona');
//            }
//            Ext.Ajax.request({
//                url: 'asociarevaluados',
//                method: 'POST',
//                params: {
//                    idprocesocomisionevaluacion: cbComEvaluadores.getValue(),
//                    idprocesoevaluadores: cbEvaluadores.getValue(),
//                    idpersonasEvaldos: Ext.encode(arrIdPersonas),
//                    idpreprocesoevaluativo: gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo'),
//                    idPersonaEvaluador: idPersonaEvaluador,
//                    idcomisionevaluacion: idComisionEvaluacion,
//                    formaevaluacion: 1
//                },
//                callback: function (options, success, response) {
//                    responseData = Ext.decode(response.responseText);
//                    mskAux.hide();
//                    if (gpanel.getSelectionModel().getSelected().get('autoevaluacion')) {
//                        st_Evaluados.baseParams.idpreprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
//                        st_Evaluados.reload({
//                            params: {
//                                limit: 10,
//                                start: 0
//                            }
//                        })
//                    } else {
//                        st_Evaluados.reload({
//                            params: {
//                                limit: 10,
//                                start: 0
//                            }
//                        });
//                    }
//                }
//            });
//        });
//    }

    btnAddComision = new Ext.Button({//JSON
        id: 'btnAddComision' + self.id,
        iconCls: 'adicionar',
        text: labels.lbBtnAdicionar,
        tooltip: labels.ttpBtnAdicionarComision,
        handler: function () {
            cAccion = 'ADD';
            VentanaComision(cAccion);
        },
        prevTab: 'btnAceptarComision' + self.id
    });

    btnModComision = new Ext.Button({
        id: 'btnModComision' + self.id,
        iconCls: 'modificar',
        disabled: true,
        text: labels.lbBtnModificar,
        tooltip: labels.ttpBtnModificarComision,
        handler: function () {
            cAccion = 'MOD';
            VentanaComision(cAccion);
        }
    });

    btnElmComision = new Ext.Button({
        id: 'btnElmComision' + self.id,
        iconCls: 'eliminar',
        disabled: true,
        text: labels.lbBtnEliminar,
        tooltip: labels.ttpBtnEliminarComision,
        handler: function () {
            mostrarMensaje(2, labels.lbBtnMsgEliminarCE, function (btn) {
                if (btn == "ok") {
                    mskAux.show();
                    Ext.Ajax.request({
                        url: 'eliminarcomision',
                        method: 'POST',
                        params: {
                            idcomisionevaluacion: gpComisiones.getSelectionModel().getSelected().get('idcomisionevaluacion')
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            mostrarMensaje(responseData.codResult, labels.msgRemoveComision);
                            mskAux.hide();
                            stComisiones.reload({
                                params: {
                                    limit: 15,
                                    start: 0
                                }
                            });
                            btnModComision.disable();
                            btnElmComision.disable();
                        }
                    });
                }
            });
        },
        nextTab: 'btnAddPersComision' + self.id,
        prevTab: 'btnModComision' + self.id
    });


    btnComisionGest = new Ext.Action({
        id: 'btnComisionGest' + self.id,
        text: labels.lbToolTipComisionG,
        iconCls: 'btn',
        handler: showWinGestComision
    });

    /* btnComisionAsoc = new Ext.Action({
     id: 'btnComisionAsoc' + self.id,
     text: labels.lbToolTipComisionA,
     iconCls: 'btn',
     handler: showWinAsocComision
     });*/

    var btnBuscar = new Ext.Button({
        iconCls: 'buscar',
        id: 'btn_Buscar' + self.id,
        text: labels.lbBtnBuscar,
        tooltip: labels.lbToolTipBuscar,
        handler: function () {
            campos.load({
                params: {
                    filtro: tfFiltro.getValue(),
                    limit: 15,
                    start: 0
                },
                callback: function () {
                    btnEvaluadosPE.disable();
                }
            });
            btnEvaluadosPE.disable();
        }
    });

    var btnLimpiar = new Ext.Button({
        tooltip: labels.lbToolTipLimpiar,
        id: 'btnLimpiar' + self.id,
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        handler: function () {
            tfFiltro.reset();
        },
        nextTab: 'adicionarPE' + self.id,
        prevTab: 'btn_Buscar' + self.id,
    });

    /* var menuComAsoc = new Ext.menu.Menu({
     id: 'mainMenu' + self.id,
     items: [btnComisionGest, btnComisionAsoc]
     });*/
    var btnOperaciones = new Ext.Button({
        hidden: self.hideBtnOperCant,
        disabled: true,
        iconCls: 'calcular',
        text: labels.lbBtnComision,
        tooltip: labels.tooltipBtnComision,
        // menu: menuComAsoc
        handler: showWinGestComision
    });

    btnEvaluadosPE = new Ext.Button({
        id: 'btnEvaluadosPE' + self.id,
        text: labels.lbBtnEvaluados,
        tooltip: labels.lbToolTipEvaluadosPE,
        hidden: true,
        disabled: true,
        iconCls: 'user_group',
        handler: function () {
            var win = new Ext.components.Evaluaciones.WinGestionarEvaluados({
//                gpanel: gpanel.getSelectionModel().getSelected(),
                title: labels.lbGestionarEvaluados,
            });
            win.show();
        }
    });

//barra para el gridpanel
    var btnAddProc = new Ext.menu.Item({
        text: 'Adicionar proceso evaluativo',
        iconCls: 'gear_add',
        handler: function () {
            accion = 'ADD';
            VentanaPE(accion);
            winProcE.on('hide', function (cmp) {
                btnAdd.focus();
            })
        }
    });

    var btnAddPeriodo = new Ext.menu.Item({
        text: 'Adicionar período evaluativo',
        iconCls: 'date_add',
        disabled: true,
        handler: function () {
            accionp = 'ADD';
            showWindAddModPeriodos(accionp);
            windAddPeriodos.on('hide', function (cmp) {
                btnAdd.focus();
            })
        }
    });

    var btnAdd = new Ext.Button({
        text: 'Adicionar',
        tooltip: labels.tooltipBtnAddProceso,
        iconCls: 'adicionar',
        menu: new Ext.menu.Menu({
            id: 'mainMenuAdd',
            items: [btnAddProc, btnAddPeriodo]
        })
    });
    var btnChange = new Ext.Button({
        text: labels.lbBtnModificar,
        tooltip: labels.tooltipBtnModProceso,
        disabled: true,
        iconCls: 'modificar',
        handler: function () {
            var record = listProcesos.getSelectionModel().getSelected();
            accion = 'MOD';
            if (record.get('_is_leaf')) {
                showWindAddModPeriodos(accion, record);
                windAddPeriodos.on('hide', function (cmp) {
                    btnAdd.focus();
                });
            } else {
                VentanaPE(accion, record);
                winProcE.on('hide', function (cmp) {
                    btnAdd.focus();
                });
            }
        }
    });

    var btnRemove = new Ext.Button({
        text: labels.lbBtnEliminar,
        tooltip: labels.tooltipBtnDelProceso,
        disabled: true,
        iconCls: 'eliminar',
        handler: function () {
            var record = listProcesos.getSelectionModel().getSelected();
            if (record.data._is_leaf) {
                if (!listProcesos.getSelectionModel().hasSelection()) {
                    Ext.Msg.show({
                        title: 'Alerta',
                        msg: 'Debe seleccionar un proceso evaluativo.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.MessageBox.WARNING
                    });
                    return;
                }
                // var record = listProcesos.getSelectionModel().getSelected();

                var idperiodoproceso = record.data.idperiodoproceso;

                mostrarMensaje(2, labels.lbBtnMsgEliminarPeriodo, function (btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('mask', 'Por favor espere...', 'Eliminando datos del período.' /*labels.lbMsgWhaitPerido, labels.lbMsgEliminado*/);
                        Ext.Ajax.request({
                            url: 'removeRange',
                            method: 'POST',
                            params: {
                                idperiodoproceso: idperiodoproceso
                            },
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                                PVD.ocultarMascara('mask');
                                if (responseData.success) {
                                    listProcesos.getStore().remove(listProcesos.getSelectionModel().getSelected());
                                    mostrarMensaje('1', labels.msgRemoveTrue);
                                    btnChange.disable();
                                    btnRemove.disable();
                                }
                                else if (!responseData.success) {
                                    mostrarMensaje('3', labels.msgRemoveFalse);
                                }

                            }
                        });
                    } else {
                        btnRemove.focus();
                    }
                });
            } else {

                var record = listProcesos.getSelectionModel().getSelected();
                var idproceso = record.data.idpreprocesoevaluativo;

                mostrarMensaje(2, labels.lbBtnMsgEliminarPE, function (btn) {
                    if (btn == "ok") {
                        PVD.mostrarMascara('mask', 'Por favor espere...', 'Eliminando datos del proceso evaluativo.');
                        Ext.Ajax.request({
                            url: 'eliminarprepararproceso',
                            method: 'POST',
                            params: {
                                idprepararPE: idproceso
                            },
                            callback: function (options, success, response) {
                                PVD.ocultarMascara('mask');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.exception == 1) {
                                    mostrarMensaje(1, labels.lbConceptoEnUso);
                                    btnAdd.focus();
                                } else {
                                    listProcesos.getStore().remove(listProcesos.getSelectionModel().getSelected());
                                    mostrarMensaje('1', 'El proceso evaluativo ha sido eliminado satisfactoriamente.');
                                    validacionDateFieldE = 0;
                                    validacionDateFieldPE = 0;
                                    btnEvaluadosPE.disable();

                                }
                            }
                        });
                    } else {
                        btnRemove.focus();
                    }
                });
            }
        }
    });

    //barra para el gridpanel
    toolb = new Ext.Toolbar({
        items: [
            btnAdd,
            btnChange,
            btnRemove,
            btnOperaciones,
            btnEstEvaluativa,
           // btnReubicarP,
           // btnEstructuraPeriodo,
            btnCerrarPeriodo,
            btnSincronizar,
            btnEvaluadosPE,
            '->',
            btnAyudaTP
        ]
    });

    campos = new Ext.data.GroupingStore({
        sortInfo: {
            field: 'tipoproceso',
            direction: 'ASC'
        },
        groupField: 'denom',
        url: 'todospreprocesosevaluativos',
        reader: new Ext.data.JsonReader({
            totalProperty: 'cantidad',
            root: 'datos',
        }, [
            {
                name: 'idpreprocesoevaluativo',
                type: 'int'
            },
            {
                name: 'iddefprocesoevaluativo'
            },
            {
                name: 'fechainicioevalua'
            },
            {
                name: 'fechafinevalua'
            },
            {
                name: 'fechainicioproceso'
            },
            {
                name: 'fechafinproceso'
            },
            {
                name: 'denom'
            },
            {
                name: 'fechacomienzo'
            },
            {
                name: 'idtipoprocesoevaluativo'
            },
            {
                name: 'evaluadoresevaluados'
            },
            {
                name: 'comisionevaluacion'
            },
            {
                name: 'orden'
            },
            {
                name: 'tipoproceso'
            },
            {
                name: 'autoevaluacion'
            },
            {
                name: 'diazrestantes'
            }
        ]),
        listeners: {
            load: function (store, records, options) {
                if (store.getCount() == 0) {
                    Ext.MessageBox.show({
                        title: 'Información',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        msg: (tfFiltro.getValue() != '') ? labels.msgEmptySearch : labels.msgEmptyLoad,
                        fn: function () {
                            btnAdd.focus();
                        }
                    });
                }
            }
        }
    });
    colummodel = [
        {
            header: labels.lbgpPEColumns,
            sortable: true,
            dataIndex: 'denom',
            hidden: true
        },
        {
            id: 'expandir' + self.id,
            header: labels.lbgpPerColumns2,
            width: 250,
            sortable: true,
            dataIndex: 'tipoproceso'
        },
        {
            header: labels.lbgpPerColumns3,
            width: 120,
            sortable: true,
            dataIndex: 'fechainicioevalua'
        },
        {
            header: labels.lbgpPerColumns4,
            width: 110,
            sortable: true,
            dataIndex: 'fechafinevalua'
        },
        {
            header: labels.lbColFechaInicioProceso,
            width: 110,
            sortable: true,
            dataIndex: 'fechainicioproceso'
        },
        {
            header: labels.lbColFechaFinProceso,
            width: 110,
            sortable: true,
            dataIndex: 'fechafinproceso'
        },
        {
            header: labels.lbColDiazRestantes,
            width: 85,
            sortable: true,
            dataIndex: 'diazrestantes'
        }
    ];


    pagintPE = new Ext.PagingToolbar({
        pageSize: 15,
        store: campos,
        displayInfo: true,
        displayMsg: labels.lbPaginToolBar
    });

//Store del combo de comisiones de la ventana de asociar evaluadores
    storeComision = new Ext.data.Store({
        url: 'cargarcbComision',
        reader: new Ext.data.JsonReader({
            root: 'datos',
            id: 'idprocesocomisionevaluacion'
        }, [
            {
                name: 'idprocesocomisionevaluacion'
            },
            {
                name: 'idcomisionevaluacion'
            },
            {
                name: 'denom'
            }
        ])
    });

//Combo de comisiones de la ventana de asociar evaluadores

    cbComision = new Ext.form.ComboBox({
        name: 'cbComision',
        tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
        typeAhead: true,
        triggerAction: 'all',
        valueField: 'idprocesocomisionevaluacion',
        hiddenName: 'idprocesocomisionevaluacion',
        forceSelection: true,
        anchor: '95%',
        displayField: 'denom',
        store: storeComision,
        mode: 'local',
        allowBlank: false,
        blankText: labels.lbCampoVacioComision,
        fieldLabel: labels.lbBtnComision,
        listeners: {
            select: function (combo, record, index) {
                //Mandar a cargar el store del gridpanel de evaluadores
                winEvaluados.gpListEvaluadores.store.baseParams.idpreprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
                winEvaluados.gpListEvaluadores.store.idprocesocomisionevaluacion = record.get('idprocesocomisionevaluacion');
                winEvaluados.gpListEvaluadores.store.reload();
            }
        }
    });


//Store del combo de evaluadores de la ventana de asociar evaluados
    storeEvaluadores = new Ext.data.Store({
        url: 'cargarevaluadores',
        reader: new Ext.data.JsonReader({
            id: 'idprocesoevaluadores',
            root: 'datos'
        }, [
            {
                name: 'idprocesoevaluadores'
            },
            {
                name: 'fullname'
            },
            {
                name: 'idpersona'
            }
        ])
    });

//Combo de evaluadores de la ventana de asociar evaluados
    cbEvaluadores = new Ext.form.ComboBox({
        tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{fullname}</div></tpl>',
        typeAhead: true,
        triggerAction: 'all',
        valueField: 'idprocesoevaluadores',
        hiddenName: 'idprocesoevaluadores',
        forceSelection: true,
        anchor: '100%',
        disabled: true,
        displayField: 'fullname',
        store: storeEvaluadores,
        mode: 'local',
        allowBlank: false,
        blankText: labels.lbCampoVacioPers,
        fieldLabel: labels.lbBtnEvaluadores,
        listeners: {
            select: function (combo, record, index) {
                idPersonaEvaluador = record.get('idpersona');
                st_Evaluados.baseParams.idPersonaEvaluador = idPersonaEvaluador;

                st_Evaluados.baseParams.idpreprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
                st_Evaluados.baseParams.idprocesoevaluadores = record.get('idprocesoevaluadores');
                // st_Evaluados.baseParams.autoevaluacion = gpanel.getSelectionModel().getSelected().get('autoevaluacion');
                st_Evaluados.baseParams.formaevaluacion = 1;
                st_Evaluados.load({
                    params: {
                        limit: 10,
                        start: 0
                    }
                });
            }
        }
    });

    cbEvaluadores.store.on('load', function (store, records, options) {
        btnAceptarEvaluados.focus();
    });

    dfFechaInicioPE = new Ext.form.DateField({
        id: 'fechainicioPE' + self.id,
        fieldLabel: labels.lbFechaInicioProcesoE,
        name: 'fechainicioPE',
        width: 176,
        value: fecha.format('d/m/Y'),
        format: 'd/m/Y',
        allowBlank: false,
        blankText: labels.lbCampoVacio,
        endDateField: 'fechaFinPE' + self.id,
    });

    dfFechaFinPE = new Ext.form.DateField({
        id: 'fechaFinPE' + self.id,
        fieldLabel: labels.lbFechaFinProcesoE,
        name: 'fechaFinPE',
        width: 176,
        format: 'd/m/Y',
        startDateField: 'fechainicioPE' + self.id,
        vtype: 'daterange'
    });

    dfFechaInicioComision = new Ext.form.DateField({
        fieldLabel: labels.lbFechaInicio, //Etiqueta
        id: 'dfFechaInicioComision' + self.id,
        name: 'dfFechaInicioComision',
        anchor: '95%',
        value: fecha.format('d/m/Y'),
        format: 'd/m/Y',
        vtype: 'daterange',
        endDateField: 'dfFechaFinComision' + self.id,
        allowBlank: false,
        blankText: labels.lbCampoVacio,
        listeners: {
            change: function () {
                cambio = 1;
            }
        }
    });

    dfFechaFinComision = new Ext.form.DateField({
        fieldLabel: labels.lbFechaFin,
        id: 'dfFechaFinComision' + self.id,
        name: 'dfFechaFinComision',
        format: 'd/m/Y',
        anchor: '95%',
        readOnly: true,
        vtype: 'daterange',
        startDateField: 'dfFechaInicioComision' + self.id,
        listeners: {
            change: function () {
                cambio = 1;
            }
        }
    });

    var rgOpinante = new Ext.form.RadioGroup({
        xtype: 'radiogroup',
        items: [
            {boxLabel: 'Evaluador', name: 'opinante', inputValue: 0, checked: true, width : 150},
            {boxLabel: 'Evaluado', name: 'opinante', inputValue: 1}
        ]
    });

    formPE = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        title: labels.lbFieldSetProceso,
        autoHeight: true,
        region: 'center',
        margins: '5 5 5 0',
        width: '80%',
        layout: 'form',
        baseParams: {
            idprepararPE: -1
        },
        items: [dfFechaInicioPE, dfFechaFinPE, {
            layout: 'column',
            xtype: 'fieldset',
			width: 378,
            autoHeight: true,
            //title: 'Qui&eacute;n introduce la opini&oacute;n',
            title: 'Quien introduce la opini&oacute;n',
            items: [rgOpinante]
        }]
    });


    function VentanaPE(accion, record) {
        LimpiarFormPE();
        stProcEvalDef.load();
        if (accion == 'ADD') {
            winProcE.setTitle(labels.lbAdicionarPE);
            dfFechaInicioPE.setValue(fecha.format('d/m/Y'));
            Ext.getCmp('btnAplicarPE' + self.id).show();
            winProcE.show();
            smProcEvalDef.clearSelections()
        } else if (accion == 'MOD') {

            dfFechaInicioPE.setValue(record.data.fechainicio);
            dfFechaFinPE.setValue(record.data.fechafin);
            winProcE.setTitle(labels.lbToolTipModificarTP);
            Ext.getCmp('btnAplicarPE' + self.id).hide();
            winProcE.show();
            stProcEvalDef.on('load', function (st, records, options) {
                var index = st.find('iddefprocesoevaluativo', record.get('iddefprocesoevaluativo'));
                smProcEvalDef.selectRow(index);
            });
        }
    }

//botones del window
    btnCancelarPE = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarPE,
        tooltip: labels.lbToolTipCancelar,
        handler: function () {
            winProcE.hide();
        }

    });

    btnAplicarPE = new Ext.Button({
        id: 'btnAplicarPE' + self.id,
        iconCls: 'aplicar',
        text: labels.lbtnAplicarPE,
        tooltip: labels.lbToolTipAplicar,
        handler: function () {
            RealizarAccion(accion, 'APLI');
        }
    });

    btnAceptarPE = new Ext.Button({
        iconCls: 'aceptar',
        id: 'btnAceptarPE' + self.id,
        text: labels.lbtnAceptarPE,
        tooltip: labels.lbToolTipAceptar,
        handler: function () {
            RealizarAccion(accion, 'ACEP');
        },
        nextTab: 'fechainicioEval',
        prevTab: 'btnAplicarPE' + self.id,
    });

    function LimpiarFormPE() {
        formPE.getForm().reset();
    }

    stComisiones = new Ext.data.Store({
        url: 'cargarcomisiones',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idcomisionevaluacion"
        }, [
            {
                name: 'idcomisionevaluacion'
            },
            {
                name: 'iddefprocesoevaluativo'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'denom'
            },
            {
                name: 'idestructura'
            }
        ])
    });
    stComisiones.on('load', function (st, records, options) {
        if (records.length > 0) {
            gpComisiones.getSelectionModel().selectFirstRow();
        } else {
            gpPerComision.disable();
            btnModComision.disable();
            btnElmComision.disable();
            st_PerComision.removeAll();
        }
        btnAddComision.focus();
    });

    var kmComAsociadas = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                btnAddComision.handler();
            }
        },
        {
            key: 'm',
            alt: true,
            fn: function () {
                if (!btnModComision.disabled) {
                    btnModComision.handler();
                }
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnElmComision.disabled) {
                    btnElmComision.handler();
                }
            }
        }
    ];

//gpanel de Comisiones asociadas
    gpComisiones = new Ext.grid.GridPanel({
        id: 'gpComSiAsoc' + self.id,
        title: labels.lbListComisiones,
        columns: [
            {
                id: 'expandir' + self.id,
                header: labels.lbDenom,
                sortable: true,
                width: 120,
                dataIndex: 'denom'
            }
        ],
        tbar: [btnAddComision, btnModComision, btnElmComision],
        stripeRows: true,
        store: stComisiones,
        autoExpandColumn: 'expandir' + self.id,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        region: 'west',
        margins: '5 5 5 5',
        width: 300,
        height: 350,
        sm: new Ext.grid.RowSelectionModel({
            singleSelection: true,
            listeners: {
                rowselect: function (sm, rowIndex, record) {
                    btnModComision.setDisabled(false);
                    btnElmComision.setDisabled(false);
                    gpPerComision.setDisabled(false);
                    st_PerComision.baseParams.idcomisionevaluacion = gpComisiones.getSelectionModel().getSelected().get('idcomisionevaluacion');
                    st_PerComision.load({
                        params: {
                            limit: 10,
                            start: 0
                        }
                    });
                }
            }
        }),
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: stComisiones,
            displayMsg: labels.lbPaginToolBar
        }),
        keys: kmComAsociadas,
    });


    tfDenominacionComision = new Ext.form.TextField({////**********Falta la etiqueta de error....
        fieldLabel: labels.lbDenom,
        name: 'tfDenominacionComision',
        id: 'tfDenominacionComision' + self.id,
        anchor: '98%',
        allowBlank: false,
        regexText: labels.lbDenominacionError,
        regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ]*)+([a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ 0-9]*)+$/,
        listeners: {
            change: function () {
                cambio = 1;
            }
        },
        prevTab: 'btnAceptarGestC' + self.id
    });

    st_PerComision = new Ext.data.Store({
        url: 'cargarpersonasporcomision',
        reader: new Ext.data.JsonReader({
            totalProperty: 'cantidad',
            root: 'datos',
            id: 'idlpersonascomision'
        }, [
            {
                name: 'idlpersonascomision'
            },
            {
                name: 'idpersona'
            },
            {
                name: 'nombre'
            },
            {
                name: 'snombre'
            },
            {
                name: 'papel'
            },
            {
                name: 'sapel'
            }
        ])
    });

    smPerComision = new Ext.grid.CheckboxSelectionModel({
        checkOnly: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                btnDelPersComision.enable();
            }
        }
    });

    var kmPerComision = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                btnAddPersComision.handler();
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnDelPersComision.disabled) {
                    btnDelPersComision.handler();
                }
            }
        },
        {
            key: 'b',
            alt: true,
            fn: function () {
                btnBuscarPersComision.handler();
            }
        },{
            key: 'l',
            alt: true,
            fn: function () {
                btnLimpiarPersonaComision.handler();
            }
        }
    ];

//grid de personas por comision
    gpPerComision = new Ext.grid.GridPanel({
        id: 'gpPerComision' + self.id,
        title: labels.lbListadoPersonasComision,
        region: 'center',
        columns: [smPerComision,
            {
                header: labels.lbNombre,
                sortable: true,
                width: 80,
                dataIndex: 'nombre'
            },
            {
                header: labels.lbSNombre,
                sortable: true,
                width: 100,
                dataIndex: 'snombre'
            },
            {
                header: labels.lbPapel,
                sortable: true,
                width: 100,
                dataIndex: 'papel'
            },
            {
                header: labels.lbSapel,
                sortable: true,
                width: 100,
                dataIndex: 'sapel'
            }
        ],
        tbar: [btnAddPersComision, btnDelPersComision, textFieldPersCom, btnBuscarPersComision, btnLimpiarPersonaComision],
        disabled: true,
        stripeRows: true,
        store: st_PerComision,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        margins: '5 5 5 0',
        width: 350,
        height: 350,
        sm: smPerComision,
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: st_PerComision,
            displayInfo: true,
            displayMsg: labels.lbPaginToolBar
        }),
        keys: kmPerComision
    });

    smEvaluadores = new Ext.grid.CheckboxSelectionModel({
        checkOnly: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                btnDelPersEvaluador.enable();
            }
        }
    });

    var kmEvaluadores = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                btnAddPersEvaluador.handler();
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnDelPersEvaluador.disabled) {
                    btnDelPersEvaluador.handler();
                }
            }
        },
        {
            key: 'b',
            alt: true,
            fn: function () {

            }
        },
        {
            key: 'l',
            alt: true,
            fn: function () {

            }
        }
    ];

    st_ComNoAsoc = new Ext.data.Store({
        url: 'cargarcomisionnoasociadas',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idcomisionevaluacion"
        }, [
            {
                name: 'idcomisionevaluacion'
            },
            {
                name: 'denom'
            }
        ])
    });

    st_ComNoAsoc.on('load', function (st, records, options) {
        btnAceptarComAsoc.focus();

    });

    smComNoAsoc = new Ext.grid.CheckboxSelectionModel({
        checkOnly: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                btnSiguienteComAsoc.enable();
                btnAnteriorComAsoc.disable();
            }
        }
    });

    gpComNoAsoc = new Ext.grid.GridPanel({
        id: 'gpComNoAsoc' + self.id,
        title: labels.lbListComisionesNoAsoc,
        columns: [smComNoAsoc,
            {
                id: 'expandir' + self.id,
                header: labels.lbDenom,
                sortable: true,
                width: 75,
                dataIndex: 'denom'
            }
        ],
        frame: true,
        stripeRows: true,
        store: st_ComNoAsoc,
        autoExpandColumn: 'expandir' + self.id,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minSize: 75,
        region: 'west',
        padding: '5 0 5 5',
        margins: '5 0 5 5',
        width: '100%',
        height: 350,
        sm: smComNoAsoc,
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: st_ComNoAsoc,
            displayMsg: labels.lbPaginToolBar
        })
    });
//*************************************************************************************************************
    st_ComSiAsoc = new Ext.data.Store({
        url: 'cargarcomisionasociadas',
        baseParams: {
            comision: cbComision.getItemId()
        }, //***Los mismo del caso anterior....
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos",
            id: "idprocesocomisionevaluacion"
        }, [
            {
                name: 'idprocesocomisionevaluacion'
            },
            {
                name: 'idcomisionevaluacion'
            },
            {
                name: 'denom'
            }
        ])
    });

    smComSiAsoc = new Ext.grid.CheckboxSelectionModel({
        checkOnly: true,
        listeners: {
            rowselect: function (sm, row, rec) {
                btnSiguienteComAsoc.disable();
                btnAnteriorComAsoc.enable();
            }
        }
    });

    gpComSiAsoc = new Ext.grid.GridPanel({
        id: 'gpComSiAsoc' + self.id,
        title: labels.lbComisionesAsoc,
        columns: [smComSiAsoc, {
            id: 'expandir' + self.id,
            header: labels.lbDenom,
            sortable: true,
            width: 75,
            dataIndex: 'denom'
        }],
        frame: true,
        stripeRows: true,
        store: st_ComSiAsoc,
        autoExpandColumn: 'expandir' + self.id,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        minSize: 75,
        region: 'west',
        padding: '5 0 5 5',
        margins: '5 0 5 5',
        width: '100%',
        height: 350,
        sm: smComSiAsoc,
        bbar: new Ext.PagingToolbar({
            pageSize: 10,
            store: st_ComSiAsoc,
            displayMsg: labels.lbPaginToolBar
        })
    });

//CheckboxSelectionModel que pertenece al gridpanel "gpEvaluados"
    smEvaluados = new Ext.grid.CheckboxSelectionModel({
        checkOnly: false,
        listeners: {
            rowselect: function (sm, row, rec) {
                btnDelPersEvaluado.enable();
                idEvaluadoaEliminar = record.data.idprocesoevaluados;
            }
        }
    });

    var btnLimpiarPersEvaluados = new Ext.Button({
        id: 'btnLimpiarPersEvaluados' + self.id,
        iconCls: 'limpiar',
        text: labels.lbBtnLimpiar,
        tooltip: labels.lbToolTipLimpiar,
        handler: function () {
            Ext.getCmp('inputNombrePersonasEvaluadas').reset();
        },
        nextTab: 'btnAceptarEvaluados' + self.id
    });

    stProcEvalDef = new Ext.data.Store({
        url: 'cargarcomboprocesodef',
        reader: new Ext.data.JsonReader({
            totalProperty: "cantidad",
            root: "datos"
        }, [
            {
                name: 'iddefprocesoevaluativo'
            },
            {
                name: 'denom'
            },
            {
                name: 'idplanilla'
            },
        ])
    });

    smProcEvalDef = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true
    });
    gpProcEvalDef = new Ext.grid.GridPanel({
        region: 'west',
        title: labels.lbProcesoDef,
        columns: [smProcEvalDef,
            {
                id: 'expandir' + self.id,
                header: labels.lbDenominacion,
                sortable: true,
                width: 75,
                dataIndex: 'denom'
            }
        ],
        stripeRows: true,
        store: stProcEvalDef,
        autoExpandColumn: 'expandir' + self.id,
        loadMask: {
            msg: labels.lbGridLoadMask
        },
        margins: '5 5 5 5',
        width: '45%',
        sm: smProcEvalDef,
        /*bbar: new Ext.PagingToolbar({
         pageSize: 10,
         store: stProcEvalDef,
         displayMsg: labels.lbPaginToolBar
         })*/
    });

//window contiene al formpanel y el grid de procesos evaluativos
    winProcE = new Ext.Window({
        layout: 'border',
        modal: true,
        height: 394,
        width: 750,
        closable: true,
        resizable: false,
        closeAction: 'hide',
        items: [gpProcEvalDef, formPE],
        buttons: [btnCancelarPE, btnAplicarPE, btnAceptarPE],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    btnAceptarPE.handler();
                }
            },
            {
                key: 'x',
                alt: true,
                fn: function () {
                    btnCancelarPE.handler();
                }
            }, {
                key: 'p',
                alt: true,
                ctrl: true,
                fn: function () {
                    btnAplicarPE.handler();
                }
            }
        ]
    });

    winProcE.on('show', function (cmp) {
        dfFechaInicioPE.focus(true, 300);
    });

//botones cancelar del window Gestionar Proceso evaluativo
    btnCancelarPE = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarPE,
        handler: function () {
            winProcE.hide();
        }

    });
//cerrar de gestiones comision
    btnAceptarComision = new Ext.Button({
        id: 'btnAceptarComision' + self.id,
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        handler: function () {
            winComisiones.hide();
        },
        nextTab: 'btnAddComision' + self.id,
        prevTab: 'btnBuscarPersComision' + self.id,
    });

//cerrar de comisiones asociadas
    btnAceptarComAsoc = new Ext.Button({
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        handler: function () {
            winComAsoc.hide();
        }
    });

//cerrar de Evaluados
    btnAceptarEvaluados = new Ext.Button({
        id: 'btnAceptarEvaluados' + self.id,
        iconCls: 'cerrar',
        text: labels.lbBtnCerrar,
        tooltip: labels.ttpBtnCerrar,
        handler: function () {
            winEvaluados.hide();
        },
        nextTab: 'btnAddPersEvaluado' + self.id,
        prevTab: 'btnLimpiarPersEvaluados' + self.id,
    });

// cancelr de adicionar comsion
    btnCancelarGestC = new Ext.Button({
        iconCls: 'cancelar',
        text: labels.lbtnCancelarPE,
        tooltip: labels.lbToolTipCancelar,
        handler: function () {
            winGestComision.hide();
        }
    });

// aceptar de adicionar comsion
    btnAceptarGestC = new Ext.Button({
        id: 'btnAceptarGestC' + self.id,
        iconCls: 'aceptar',
        text: labels.lbtnAceptarPE,
        tooltip: labels.lbToolTipAceptar,
        handler: function () {
            if (formGestComision.getForm().isValid()) {
                gestComision(cAccion, 'ACEP');
            }
        },
        nextTab: 'tfDenominacionComision' + self.id,
        prevTab: 'btnAplicarGestC' + self.id,
    });

// aplicar de adicionar comsion
    btnAplicarGestC = new Ext.Button({
        id: 'btnAplicarGestC' + self.id,
        iconCls: 'aplicar',
        text: labels.lbtnAplicarPE,
        tooltip: labels.lbToolTipAplicar,
        handler: function () {
            if (formGestComision.getForm().isValid()) {
                gestComision(cAccion, 'APLI');
            }
        }
    });

//Boton encargado de la accion de asociar personas a comisiones
    btnSiguienteC = new Ext.Button({
        disabled: true,
        id: 'btnSiguienteC' + self.id,
        style: 'margin-left:18px;margin-top:110px',
        iconCls: 'siguiente',
        tooltip: labels.lbAsociarComision,
        handler: function () {
        }
    });

//Boton encargado de la accion de restaurar personas a comisiones
    btnAnteriorC = new Ext.Button({
        disabled: true,
        id: 'btnAnteriorC' + self.id,
        style: 'margin-left:18px;margin-top:90px',
        iconCls: 'anterior',
        tooltip: labels.lbDesasociarComision,
        handler: function () {
        }
    });

//Boton encargado de la accion de asociar comisiones a procesos evaluativos
    btnSiguienteComAsoc = new Ext.Button({
        disabled: true,
        id: 'btnSiguienteComAsoc' + self.id,
        style: 'margin-left:18px;margin-top:110px',
        tooltip: 'Agregar',
        iconCls: 'siguiente',
        handler: function () {
            asociarComAsoc();
        }
    });

//Boton encargado de la accion de restaurar comisiones a procesoces evaluativos
    btnAnteriorComAsoc = new Ext.Button({
        disabled: true,
        id: 'btnAnteriorComAsoc' + self.id,
        style: 'margin-left:18px;margin-top:90px',
        tooltip: 'Quitar',
        iconCls: 'anterior',
        handler: function () {
            restaurarComAsoc();
        }
    });

//Función para asociar comisiones
    function asociarComAsoc() {
        var arrComNoAsoc = gpComNoAsoc.getSelections();
        var arrIdCom = [];
        for (var i = 0; i < arrComNoAsoc.length; i++)
            arrIdCom.push(arrComNoAsoc[i].data.idcomisionevaluacion);
        if (formComAsoc.getForm().isValid()) {
            formComAsoc.getForm().submit({
                url: 'asociarcomision',
                waitMsg: 'Asociando las comisiones seleccionadas...',
                params: {
                    idscomisionevaluacion: Ext.encode(arrIdCom),
//                    idpreprocesoevaluativo: gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo')
                },
                failure: function (form, action) {
                    if (action.result.codResult == 1) {
                        st_ComSiAsoc.reload({
                            params: {
                                limit: 10,
                                start: 0
                            }
                        });
                        st_ComNoAsoc.reload({
                            params: {
                                limit: 10,
                                start: 0
                            }
                        });
                    }
                    if (action.result.codResult == 3)
                        mostrarMensaje(action.result.codResult, action.result.mensaje);
                }
            });
        }
    }

//Función para restaurar las comisiones
    function restaurarComAsoc() {//*******************************************Todavia faltan arreglar cosas aqui......
        var arrComSiAsoc = gpComSiAsoc.getSelections();
        var arrCom = new Array();
        for (var i = 0; i < arrComSiAsoc.length; i++) {
            var arrAux = {
                idprocesocomisionevaluacion: arrComSiAsoc[i].data.idprocesocomisionevaluacion,
                idcomisionevaluacion: arrComSiAsoc[i].data.idcomisionevaluacion
            };
            arrCom.push(arrAux);
        }
        if (formComAsoc.getForm().isValid()) {
            formComAsoc.getForm().submit({
                url: 'restaurarcomisionasociada',
                waitMsg: 'Restaurando las comisiones seleccionadas...',
                params: {
                    arrComisiones: Ext.encode(arrCom),
//                    idpreprocesoevaluativo: gpanel.getSelectionModel().getSelected().get('idpreprocesoevaluativo')
                },
                failure: function (form, action) {
                    if (action.result.codResult == 1) {
                        st_ComSiAsoc.reload({
                            params: {
                                limit: 10,
                                start: 0
                            }
                        });
                        st_ComNoAsoc.reload({
                            params: {
                                limit: 10,
                                start: 0
                            }
                        });
                    }
                    if (action.result.codResult == 3)
                        mostrarMensaje(action.result.codResult, action.result.mensaje);
                }
            });
        }
    }

//Formulario de la ventana asociar evaluadores
    var formEvaluadores = new Ext.FormPanel({
        frame: true,
        region: 'north',
        autoHeight: true,
        margins: '5 5 0 5',
        items: [cbComision]
    });

    var formComAsoc = new Ext.FormPanel({
        labelAlign: 'left',
        frame: true,
        region: 'center',
        height: 370,
        items: [
            {
                layout: 'column',
                items: [
                    {
                        columnWidth: .45,
                        layout: 'form',
                        items: [gpComNoAsoc]
                    },
                    {
                        columnWidth: .10,
                        layout: 'form',
                        items: [btnSiguienteComAsoc, btnAnteriorComAsoc],
                        anchor: '100%'
                    },
                    {
                        columnWidth: .45,
                        layout: 'form',
                        items: [gpComSiAsoc]
                    }
                ]
            }
        ]
    });


//Formulario para gestionar comisiones
    var formGestComision = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        baseParams: {
            idcomisionevaluacion: -1,
            iddefproceso: -1
        },
        items: [tfDenominacionComision, {
            layout: 'column',
            items: [
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: [dfFechaInicioComision],
                    anchor: '100%'
                },
                {
                    columnWidth: .50,
                    layout: 'form',
                    items: [dfFechaFinComision],
                    anchor: '100%'
                }
            ]
        },]
    });
    var keysc = [
        {
            key: 'x',
            alt: true,
            fn: function () {
                self.btnAceptarComision.handler();
            }
        }
    ];
//window donde se muestran las comisiones y se asocian personas a las mismas...
    winComisiones = new Ext.Window({
        layout: 'border',
        modal: true,
        closable: true,
        title: labels.lbWinComisiones,
        resizable: false,
        closeAction: 'hide',
        width: 800,
        keys:keysc,
        height: 500,
        items: [gpComisiones, gpPerComision],
        buttons: [btnAceptarComision]
    });


//window para  asocian comision a proceso evaluativo
    winComAsoc = new Ext.Window({
        layout: 'border',
        modal: true,
        closable: true,
        title: 'Asociar comisiones',
        resizable: false,
        closeAction: 'hide',
        width: 650,
        height: 435,
        items: [formComAsoc],
        buttons: [btnAceptarComAsoc]
    });

    winComAsoc.on('show', function (cmp) {
        btnAceptarComAsoc.focus();
    });

    var keyG = [
        {
            key: Ext.EventObject.ENTER,
            fn: function () {
                self.btnAceptarGestC.handler();
            }
        },
        {
            key: 'p',
            alt: true,
            ctrl: true,
            fn: function () {
                self.btnAplicarGestC.handler();
            }
        },
        {
            key: 'x',
            alt: true,
            fn: function () {
                self.btnCancelarGestC.handler();
            }
        }
    ];
//window para  gestionar comisiones
    winGestComision = new Ext.Window({
        modal: true,
        closable: true,
        //title: 'Gestionar evaluados',
        resizable: false,
        closeAction: 'hide',
        width: 350,
        height: 175,
        keys:keyG,
        items: [formGestComision],
        buttons: [btnCancelarGestC, btnAplicarGestC, btnAceptarGestC]
    });

    winGestComision.on('show', function (cmp) {
        tfDenominacionComision.focus(true, 300);
    });
    winGestComision.on('hide', function (cmp) {
        btnAddComision.focus();
    });

    var tfFiltro = new Ext.form.TextField({
        anchor: '95%',
        fieldLabel: labels.lbDenominacion,
        emptyText: labels.lbEmptyTextBuscar,
        listeners: {
            specialkey: function (field, e) {
                if (e.getKey() == e.ENTER) {
                    if (!Ext.isEmpty(this.getValue())) {
                        campos.load({
                            params: {
                                filtro: tfFiltro.getValue(),
                                limit: 15,
                                start: 0
                            },
                            callback: function () {
                                btnEvaluadosPE.disable();
                            }
                        });
                    }
                }
            }
        }
    });

    var pFiltros = new Ext.Panel({
        layout: 'column',
        margins: '5 5 5 5',
        frame: true,
        defaults: {
            layout: 'form',
            border: false,
            labelAlign: 'top',
            buttonAlign: 'right'
        },
        height: 63,
        autoScroll: true,
        autoShow: true,
        region: 'north',
        items: [
            {
                columnWidth: .3,
                layout: 'form',
                items: [tfFiltro]
            },
            {
                layout: 'form',
                bodyStyle: 'padding:19px 0 0 0;',
                columnWidth: '35px',
                items: [btnBuscar]
            },
            {
                layout: 'form',
                bodyStyle: 'padding:19px 0 0 0;',
                columnWidth: '35px',
                items: [btnLimpiar]
            }
        ]
    });

    var kmPrepararP = [
        {
            key: 'i',
            alt: true,
            fn: function () {
                //btnAdicionarPE.handler();
            }
        },
        {
            key: 'm',
            alt: true,
            fn: function () {
                if (!btnChange.disabled) {
                    btnChange.handler();
                }
            }
        },
        {
            key: 46,
            fn: function () {
                if (!btnRemove.disabled) {
                    btnRemove.handler();
                }
            }
        },
        {
            key: 'h',
            alt: true,
            fn: function () {
                btnAyudaTP.handler();
            }
        },
        {
            key: 'b',
            alt: true,
            fn: btnBuscar.handler
        },
        {
            key: 'l',
            alt: true,
            fn: btnLimpiar.handler
        },
        {
            key: 'o',
            ctrl: true,
            alt: true,
            fn: btnEvaluadosPE.handler
        },
        {
            key: 'g',
            ctrl: true,
            alt: true,
            fn: function () {
                if (!btnOperaciones.disabled) {
                    showWinGestComision();
                }
            }
        },
        {
            key: 'a',
            ctrl: true,
            alt: true,
            fn: function () {
                if (!btnOperaciones.disabled) {
                    showWinAsocComision();
                }
            }
        }
    ];

    var listProcesos = new Ext.PVD.Evaluaciones.ListProcesoEvaluativo({
        region: 'center',
        margins: '5 5 5 5',
        url: 'todospreprocesosevaluativos',
    });
    listProcesos.getStore().load();

    var pContenedor = new Ext.Panel({
        bodyBorder: false,
        tbar: toolb,
        region: 'center',
        layout: 'border',
        items: [/*pFiltros, */listProcesos],
        keys: kmPrepararP,
        listeners: {
            render: function (cmp) {
                btnAdd.focus();
            }
        }
    });
//ViewPort contenedor principal
    vp = new Ext.Viewport({
        layout: 'border',
        items: [pContenedor]
    });
    listProcesos.getSelectionModel().on('selectionchange', function (sm) {
        if (sm.hasSelection()) {
            var record = sm.getSelected();
            btnCerrarPeriodo.disable();
            btnSincronizar.disable();
            btnReubicarP.disable();
            btnEstructuraPeriodo.disable();
            btnChange.enable();
            btnRemove.enable();
            if (record.get('_is_leaf')) {
                btnEstEvaluativa.enable();
                btnOperaciones.disable();
                if (/*record.data.estado == null ||*/ record.data.estado == 1) {
                    btnCerrarPeriodo.enable();
                    btnSincronizar.enable();
                    btnReubicarP.enable();
                    btnEstructuraPeriodo.enable();
                }
                if (/*record.data.estado != null ||*/ record.data.estado == 2) {
                    btnCerrarPeriodo.disable();
                    btnSincronizar.disable();
                    btnReubicarP.disable();
                    btnEstructuraPeriodo.disable();
                }

            } else {
                btnEstEvaluativa.disable();
                btnOperaciones.enable();
                btnAddPeriodo.enable();
                btnCerrarPeriodo.disable();
                btnSincronizar.disable();
                btnReubicarP.disable();
                btnEstructuraPeriodo.disable();

            }
        } else {
            btnAddPeriodo.disable();

        }
    });
//Funcion para determinar si se adiciona o se modifica una comision
    function VentanaComision(cAccion) {
        if (cAccion == 'ADD') {
            formGestComision.getForm().reset();
            winGestComision.setTitle('Adicionar comisión');
            btnAplicarGestC.show();
            winGestComision.show();
        } else {
            tfDenominacionComision.setValue(gpComisiones.getSelectionModel().getSelected().get('denom'));
            winGestComision.setTitle('Modificar comisión');
            btnAplicarGestC.hide();
            winGestComision.show();

        }
    }

//Funcion donde se realiza la accion de gestionar comisiones
    function gestComision(cAccion, cBoton) {
        mskAux.show();
        var url = 'adicionardefinirproceso', msgForm = labels.lbWaitMsgAddDP;

        if (cAccion == 'ADD') {
            url = 'adicionarcomision';
            msgForm = labels.lbWaitMsgAddDP;
        }
        else {
            msgForm = labels.lbWaitMsgModDP;
            url = 'modificarcomision';
            formGestComision.baseParams.idcomisionevaluacion = gpComisiones.getSelectionModel().getSelected().get('idcomisionevaluacion');
        }
        if (cambio == 0) {
            if (accion == 'MOD')
                winGestComision.hide();
            else {
                tfDenominacionComision.markInvalid(labels.lbCampoVacio);
            }
        }
        else {
//            formGestComision.baseParams.iddefprocesoevaluativo = gpanel.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
            if (dfFechaInicioComision.getRawValue() != dfFechaFinComision.getRawValue()) {
                if (formGestComision.getForm().isValid()) {
                    formGestComision.getForm().submit({
                        url: url,
                        params: {
                            idpreprocesoevaluativo: listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo')
                        },
                        waitMsg: msgForm,
                        failure: function (form, action) {
                            mskAux.hide();
                            if (action.result.codResult == 1) {
                                mostrarMensaje(action.result.codResult, 'La comisión ha sido adicionada satisfactoriamente.');
                                if (cBoton == 'ACEP') {
                                    winGestComision.hide();
                                }
                                if (accion == 'ADD' || accion == 'MOD') {
                                    formGestComision.getForm().reset();
                                }
                                stComisiones.reload({
                                    params: {
                                        limit: 10,
                                        start: 0
                                    }
                                })
                            }
                            else if (action.result.codResult == 3)
                                mostrarMensaje(action.result.codResult, action.result.mensaje);
                        }
                    });
                }
            } else {
                mostrarMensaje(3, labels.lbFechasiguales);
            } //Etiquetassssssss
        }
        cambio = 0;
    }

    function showWinGestComision() {
        // st_PerComision.removeAll();
        winComisiones.show();
        stComisiones.baseParams.idpreprocesoevaluativo = listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
        stComisiones.load({
            params: {
                limit: 10,
                start: 0
            }
        });
        winComisiones.on('hide', function (cmp) {
            btnAdd.focus();
        });
    }

    function showWinAsocComision() {
        winComAsoc.on('show', function (cmp) {
            btnAceptarComAsoc.focus();
        });
        winComAsoc.show();
        st_ComNoAsoc.baseParams.iddefprocesoevaluativo = listProcesos.getSelectionModel().getSelected().get('iddefprocesoevaluativo');
        st_ComNoAsoc.baseParams.idpreprocesoevaluativo = listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
        st_ComNoAsoc.load({
            params: {
                limit: 10,
                start: 0
            }
        });
        st_ComSiAsoc.baseParams.idpreprocesoevaluativo = listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
        st_ComSiAsoc.load({
            params: {
                limit: 10,
                start: 0
            }
        });
        winComAsoc.on('hide', function (cmp) {
            btnAdd.focus();
        })
    }

//Funcion donde se realiza la accion de gestionar los procesos evaluativos (Preparar)
    function RealizarAccion(accion, boton) {

        if (!smProcEvalDef.hasSelection()) {
            Ext.Msg.show({
                title: 'Alerta',
                msg: 'Debe seleccionar un proceso evaluativo.',
                buttons: Ext.Msg.OK,
                icon: Ext.MessageBox.WARNING
            });
            return;
        }

        var url = '', msgForm = labels.lbWaitMsgAddPE;
        var idprepararPE = -1;

        if (accion == 'ADD') {
            url = 'adicionarpreproceso';
        }
        else {
            idprepararPE = listProcesos.getSelectionModel().getSelected().get('idpreprocesoevaluativo');
            url = 'modificarpreproceso';
        }

        if (formPE.getForm().isValid()) {
            PVD.mostrarMascara('saveprocess' + self.id, labels.lbPleaseWait, labels.lbMsgWaitSend);
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                params: {
                    idprepararPE: idprepararPE,
                    iddefprocesoevaluativo: smProcEvalDef.getSelected().get('iddefprocesoevaluativo'),
                    fechainicioPE: dfFechaInicioPE.getRawValue(),
                    fechaFinPE: dfFechaFinPE.getRawValue(),
                    opinion: formPE.getForm().getValues().opinante
                },
                callback: function (options, success, response) {
                    PVD.ocultarMascara('saveprocess' + self.id);
                    var datos = Ext.util.JSON.decode(response.responseText);
                    if (datos.codResult == 1) {
                        mostrarMensaje(1, datos.mensaje);
                        if (boton == 'ACEP') {
                            winProcE.hide();
                        }
                        listProcesos.getSelectionModel().clearSelections();
                        listProcesos.store.load({
                            params: {
                                limit: 15,
                                start: 0
                            }
                        });

                        LimpiarFormPE();


                    } else {
                        mostrarMensaje(3, 'Ocurri&oacute; un error interno del sistema. Por favor contacte al administrador.');
                    }
                }
            });
        }
    }

}

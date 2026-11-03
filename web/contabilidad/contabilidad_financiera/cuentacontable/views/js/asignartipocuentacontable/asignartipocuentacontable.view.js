Ext.ns('Contabilidad.AsignarTipoCtaContable');
Ext.Ajax.timeout = 9990000000;
Contabilidad.AsignarTipoCtaContable.View = {
    init: function(idioma, model) {
        var scope = this;
        this.loadMessageBox = function() {
            Ext.MessageBox.show({
                title: perfil.etiquetas.lbEspere,
                msg: perfil.etiquetas.lbCargando,
                width: 300,
                progress: true,
                closable: false
            });
            var f = function(v) {
                return function() {
                    var i = v / 11;
                    Ext.MessageBox.updateProgress(i);
                };
            };
            for (var i = 1; i < 12; i++)
                setTimeout(f(i), i * 500);
        };
        scope.loadMessageBox();
        this.cantNodosSeleccionados = 0;
        this.flag_sel = 0;
        this.btnAdicionarCtaOrden = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarCtaOrden',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            text: perfil.etiquetas.lbAdicionar,
            tooltip: perfil.etiquetas.lbTtAdicionar
        });
        this.btnAdicionarCtaGasto = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarCtaGasto',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            text: perfil.etiquetas.lbAdicionar,
            tooltip: perfil.etiquetas.lbTtAdicionar
        });
        this.btnAdicionarCtaIngreso = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarCtaIngreso',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            text: perfil.etiquetas.lbAdicionar,
            tooltip: perfil.etiquetas.lbTtAdicionar
        });
        this.btnAdicionarCtaResultado = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarCtaResultado',
//            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'adicionar',
            text: perfil.etiquetas.lbAdicionar,
            tooltip: perfil.etiquetas.lbTtAdicionar
        });
        this.btneliminarOrden = new Ext.Button({
            disabled: true,
            id: 'btneliminarOrden',
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            text: perfil.etiquetas.lbbtneliminar,
            tooltip: perfil.etiquetas.lbTtEliminar
        });
        this.btneliminarGasto = new Ext.Button({
            disabled: true,
            id: 'btneliminarGasto',
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            text: perfil.etiquetas.lbbtneliminar,
            tooltip: perfil.etiquetas.lbTtEliminar
        });
        this.btneliminarIngreso = new Ext.Button({
            disabled: true,
            id: 'btneliminarIngreso',
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            text: perfil.etiquetas.lbbtneliminar,
            tooltip: perfil.etiquetas.lbTtEliminar
        });
        this.btneliminarResultado = new Ext.Button({
            disabled: true,
            id: 'btneliminarResultado',
//            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            text: perfil.etiquetas.lbbtneliminar,
            tooltip: perfil.etiquetas.lbTtEliminar
        });
        this.btnAyuda = new Ext.Button({
            disabled: false,
            id: 'btnAyudaAsignarTipoCuenta',
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda',
            text: perfil.etiquetas.lbbtnAyuda,
            tooltip: perfil.etiquetas.tooltipAyuda,
            handler: function() {
//                help.show(perfil.etiquetas.lbVAyuda, 'confin/CG/nome_cuentas/asignartipocuentacontable');
            }
        });
        this.aplicar = new Ext.Button({
            text: perfil.etiquetas.lbbtnAplicar,
            tooltip: perfil.etiquetas.lbTtAplicar,
//            icon: perfil.dirImg + 'aplicar.png',
            iconCls: 'aplicar',
            handler: function() {
                AplicarTipoCuenta();
            }
        });
        this.btnCancelar = new Ext.Button({
//            icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            text: perfil.etiquetas.lbBtnCancelar,
            tooltip: perfil.etiquetas.lbTtCancelar
        });
        this.btnAceptar = new Ext.Button({
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            text: perfil.etiquetas.lbBtnAceptar,
            tooltip: perfil.etiquetas.lbTtAceptar
        });
        this.cbxTipoCuenta = new Ext.form.ComboBox({
            emptyText: perfil.etiquetas.lbEmptyTextSeleccione, //'Seleccione...',
            editable: false,
            fieldLabel: perfil.etiquetas.lbCbTipoCta, //'Tipo de cuenta',
            store: model.storeCargarTipoCuenta,
            valueField: 'idCuenta',
            displayField: 'descrip',
            hiddenName: 'idCuenta',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            anchor: '95%'
        });
        this.smIngresos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.smIngresos.on('beforerowselect', function(a, s, d, f) {
            this.flag_sel = 1;
            this.btneliminar.enable();
        }, this);
        this.cmi = new Ext.grid.ColumnModel([{
                hidden: true,
                hideable: false,
                id: 'idcuenta',
                dataIndex: 'idcuenta'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbClave,
                dataIndex: 'concatcta'
            }, {
                id: 'scta',
                header: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                width: 130
            }]);
        this.gpIngresos = new Ext.Panel({
            region: 'west',
            id: 'gpIngresos',
            title: perfil.etiquetas.lbCtaIngr,
            width: '50%',
            bodyStyle: 'background-color:#fff;',
            frame: true,
            layout: 'fit',
            tbar: [
                scope.btnAdicionarCtaIngreso,
                scope.btneliminarIngreso
            ],
            items: [{}],
            listeners: {
                render: function(component) {
                    new Ext.Cont.Cuentas({
                        id: 'ctasIngresos',
                        singleExpand: false,
                        loadType: [8031],
                        rootText: perfil.etiquetas.lbCtaIngr,
                        selectionType: 1,
                        allCuentas: 2
                    }).on({
                        initialize: function(componentUI) {
                            scope.cantNodosSeleccionados = 0;
                            componentUI.on({
                                checkchange: function(node, checked) {
                                    if (checked)
                                        scope.cantNodosSeleccionados++;
                                    else
                                        scope.cantNodosSeleccionados--;
                                    if (scope.cantNodosSeleccionados <= 0)
                                        Ext.getCmp('btneliminarIngreso').disable();
                                    else
                                        Ext.getCmp('btneliminarIngreso').enable();
                                }
                            });
                            componentUI.setHeight(Ext.getCmp('gpIngresos').getSize().height);
                            Ext.getCmp('gpIngresos').insert(0, componentUI);
                            Ext.getCmp('gpIngresos').doLayout(true);
                        }
                    });
                    Ext.getCmp('btnAdicionarCtaIngreso').focus();
                }
            }
        });
        this.smGastos = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.smGastos.on('beforerowselect', function(a, s, d, f) {
            this.flag_sel = 2;
            this.btneliminar.enable();
        }, this);
        this.cm = new Ext.grid.ColumnModel([{
                hidden: true,
                hideable: false,
                id: 'idcuenta',
                dataIndex: 'idcuenta'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbClave,
                dataIndex: 'concatcta'
            }, {
                id: 'scta',
                header: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                width: 130
            }]);
        this.gpGastos = new Ext.Panel({
            region: 'center',
            id: 'gpGastos',
            title: perfil.etiquetas.lbCtaGast,
            width: '50%',
            bodyStyle: 'background-color:#fff;',
            frame: true,
            layout: 'fit',
            tbar: [
                scope.btnAdicionarCtaGasto,
                scope.btneliminarGasto
            ],
            items: [{}],
            listeners: {
                render: function(component) {
                    new Ext.Cont.Cuentas({
                        id: 'ctasGastos',
                        singleExpand: false,
                        loadType: [8032],
                        rootText: perfil.etiquetas.lbCtaGast,
                        selectionType: 1,
                        allCuentas: 2
                    }).on({
                        initialize: function(componentUI) {
                            scope.cantNodosSeleccionados = 0;
                            componentUI.on({
                                checkchange: function(node, checked) {
                                    if (checked)
                                        scope.cantNodosSeleccionados++;
                                    else
                                        scope.cantNodosSeleccionados--;
                                    if (scope.cantNodosSeleccionados <= 0)
                                        Ext.getCmp('btneliminarGasto').disable();
                                    else
                                        Ext.getCmp('btneliminarGasto').enable();
                                }
                            });
                            componentUI.setHeight(Ext.getCmp('gpGastos').getSize().height);
                            Ext.getCmp('gpGastos').insert(0, componentUI);
                            Ext.getCmp('gpGastos').doLayout(true);
                        }
                    });
                }
            }
        });
        this.smCuentaOrden = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.smCuentaOrden.on('beforerowselect', function(a, s, d, f) {
            flag_sel = 4;
            btneliminar.enable();
        }, this);
        this.cme = new Ext.grid.ColumnModel([{
                hidden: true,
                hideable: false,
                id: 'idcuenta',
                dataIndex: 'idcuenta'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbClave,
                dataIndex: 'concatcta'
            }, {
                id: 'scta',
                header: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                width: 130
            }]);
        this.gpCuentaOrden = new Ext.Panel({
            region: 'west',
            id: 'gpCuentaOrden',
            title: perfil.etiquetas.lbCtaOrd,
            width: '50%',
            bodyStyle: 'background-color:#fff;',
            frame: true,
            layout: 'fit',
            tbar: [
                scope.btnAdicionarCtaOrden,
                scope.btneliminarOrden
            ],
            items: [{}],
            listeners: {
                render: function(component) {
                    new Ext.Cont.Cuentas({
                        id: 'ctasOrden',
                        singleExpand: false,
                        loadType: [8034],
                        rootText: perfil.etiquetas.lbCtaOrd,
                        selectionType: 1,
                        allCuentas: 2
                    }).on({
                        initialize: function(componentUI) {
                            scope.cantNodosSeleccionados = 0;
                            componentUI.on({
                                checkchange: function(node, checked) {
                                    if (checked)
                                        scope.cantNodosSeleccionados++;
                                    else
                                        scope.cantNodosSeleccionados--;
                                    if (scope.cantNodosSeleccionados <= 0)
                                        Ext.getCmp('btneliminarOrden').disable();
                                    else
                                        Ext.getCmp('btneliminarOrden').enable();
                                }
                            });
                            componentUI.setHeight(Ext.getCmp('gpCuentaOrden').getSize().height);
                            Ext.getCmp('gpCuentaOrden').insert(0, componentUI);
                            Ext.getCmp('gpCuentaOrden').doLayout(true);
                        }
                    });
                }
            }
        });
        this.smCuentaResultado = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        this.smCuentaResultado.on('beforerowselect', function(a, s, d, f) {
            flag_sel = 3;
            btneliminar.enable();
        }, this);
        this.cme = new Ext.grid.ColumnModel([{
                hidden: true,
                hideable: false,
                id: 'idcuenta',
                dataIndex: 'idcuenta'
            }, {
                id: 'expandir',
                header: perfil.etiquetas.lbClave,
                dataIndex: 'concatcta'
            }, {
                id: 'scta',
                header: perfil.etiquetas.lbDescripcion,
                dataIndex: 'descripcion',
                width: 130
            }]);
        this.gpCuentaResultado = new Ext.Panel({
            region: 'center',
            id: 'gpCuentaResultado',
            title: perfil.etiquetas.lbCtaResul,
            width: '50%',
            bodyStyle: 'background-color:#fff;',
            frame: true,
            layout: 'fit',
            tbar: [
                scope.btnAdicionarCtaResultado,
                scope.btneliminarResultado
            ],
            items: [{}],
            listeners: {
                render: function(component) {
                    new Ext.Cont.Cuentas({
                        id: 'ctasResultado',
                        singleExpand: false,
                        loadType: [8033],
                        rootText: perfil.etiquetas.lbCtaResul,
                        selectionType: 1,
                        allCuentas: 2
                    }).on({
                        initialize: function(componentUI) {
                            scope.cantNodosSeleccionados = 0;
                            componentUI.on({
                                checkchange: function(node, checked) {
                                    if (checked)
                                        scope.cantNodosSeleccionados++;
                                    else
                                        scope.cantNodosSeleccionados--;
                                    if (scope.cantNodosSeleccionados <= 0)
                                        Ext.getCmp('btneliminarResultado').disable();
                                    else
                                        Ext.getCmp('btneliminarResultado').enable();
                                }
                            });
                            componentUI.setHeight(Ext.getCmp('gpCuentaResultado').getSize().height);
                            Ext.getCmp('gpCuentaResultado').insert(0, componentUI);
                            Ext.getCmp('gpCuentaResultado').doLayout(true);
                        }
                    });
                    Ext.MessageBox.hide();
                }
            }
        });
        this.pIngresosGastos = new Ext.Panel({
            region: 'center',
            id: 'pIngresosGastos',
            frame: true,
            layout: 'border',
            tbar: ['->', this.btnAyuda],
            items: [{
                    region: 'west',
                    id: 'ctaOrdenGasto',
                    layout: 'border',
                    width: '50%',
                    items: [
                        this.gpGastos,
                        this.gpIngresos
                    ]
                }, {
                    region: 'center',
                    id: 'ctaIngresoResultado',
                    layout: 'border',
                    width: '50%',
                    items: [
                        this.gpCuentaOrden,
                        this.gpCuentaResultado
                    ]
                }]
        });
        this.Vista = new Ext.Viewport({
            layout: 'border',
            renderTo: document.body,
            items: [this.pIngresosGastos],
            listeners: {
                resize: function() {
                    Ext.getCmp('ctaOrdenGasto').setWidth('50%');
                    Ext.getCmp('gpIngresos').setWidth('50%');
                    Ext.getCmp('gpCuentaOrden').setWidth('50%');
                }
            }
        });
        this.sm = new Ext.grid.CheckboxSelectionModel();
        this.gpIncluircuenta = new Ext.grid.GridPanel({
            region: 'center',
            frame: true,
            loadMask: true,
            id: 'idGPanel',
            iconCls: 'icon-grid',
            store: model.storeCargargrid,
            height: 440,
            sm: scope.sm,
            autoExpandColumn: 'descrip',
            cm: new Ext.grid.ColumnModel([
                this.sm, {
                    id: 'idCuenta',
                    header: perfil.etiquetas.lbCodigo,
                    width: 200,
                    sortable: true,
                    dataIndex: 'concatcta'
                }, {
                    id: 'descrip',
                    header: perfil.etiquetas.lbDescripcion,
                    width: 120,
                    dataIndex: 'descripcion'
                }
            ]),
            tbar: this.tbCuentas = new Ext.Toolbar({
                items: [scope.sfBuscarCuentasB = new Ext.Cont.SearchField({
                        emptyText: perfil.etiquetas.lbEmptyTextCriterio
                    })]
            }),
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                emptyMsg: perfil.etiquetas.emptyMsg,
                displayMsg: perfil.etiquetas.displayMsg,
                tabIndex: 314,
                store: model.storeCargargrid
            })
        });
        this.fpdatos = new Ext.FormPanel({
            frame: true,
            waitMsg: perfil.etiquetas.lbEspere,
            autoWidth: true,
            layout: 'fit',
            labelWidth: 920,
            items: [this.gpIncluircuenta]
        });
        this.winIncluir = new Ext.Window({
            title: ' ',
            layout: 'fit',
            width: 920,
            height: 520,
            modal: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            maximizable: false,
            constrain: true,
            buttons: [scope.btnCancelar, scope.btnAceptar],
            items: [scope.fpdatos]            
        });
        this.map = new Ext.KeyMap(document, [{
                key: "h",
                alt: true,
                fn: function() {
                    scope.cargarAyuda();
                }
            }
        ]);
    },
    cargarAyuda: function() {
        help.show(perfil.etiquetas.lbVAyuda, 'confin/CG/nome_cuentas/asignartipocuentacontable');
    }
};
Ext.QuickTips.init();
var perfil = window.parent.perfil;
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('asignartipocuentacontable', function() {
    var model = Contabilidad.AsignarTipoCtaContable.Model;
    model.init();
    var view = Contabilidad.AsignarTipoCtaContable.View;
    view.init(perfil, model);
    Contabilidad.AsignarTipoCtaContable.Controller.init(perfil, view, model);
});

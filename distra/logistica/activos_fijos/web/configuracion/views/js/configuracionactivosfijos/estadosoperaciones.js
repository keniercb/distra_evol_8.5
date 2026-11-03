/**
 * Javier Martin Rojas
 * Fichero encargado de la configuracion de los formatos
 **/
Ext.erp.url = '/logistica/activos_fijos/configuracion/index.php/confestadosoperaciones/';
Ext.erp.stEstado = new Ext.data.Store({
    url: Ext.erp.url + 'cargarcomboestado',
    reader: new Ext.data.JsonReader({
        id: "idestatustecnico"
    }, [
        {
            name: 'idestatustecnico'
        },
        {
            name: 'denominacion'
        }
    ])
});

Ext.erp.stEstadoDisponible = new Ext.data.Store({
    url: Ext.erp.url + 'cargarcomboestadousanentidad',
    reader: new Ext.data.JsonReader({
        id: "idestatustecnico"
    }, [
        {
            name: 'idestatustecnico'
        },
        {
            name: 'denominacion'
        }
    ])
});

Ext.erp.stOperaciones = new Ext.data.Store({
    url: Ext.erp.url + 'cargaroperaciones',
    reader: new Ext.data.JsonReader({
        totalProperty: "total",
        root: "datos",
        id: "operaciones"
    }, [
        {
            name: 'idoperacion'
        },
        {
            name: 'denominacion'
        }
    ])
});

Ext.erp.stSeleccionados = new Ext.data.GroupingStore({
    url: Ext.erp.url + 'getdatos',
    listeners: {
        'beforeload': function (stSeleccionados, objeto) {
            Ext.getCmp('btnModificarOperacion').disable();
            Ext.getCmp('btnEliminarOperacion').disable();
            stSeleccionados.baseParams.idoperacion = Ext.getCmp('cbOperacionesBuscar').getValue();
            stSeleccionados.baseParams.idestatustecnico = Ext.getCmp('cbEstadoBuscar').getValue();

        },
        'load': function (stSeleccionados, objeto) {
            stSeleccionados.baseParams.idoperacion = null;
            stSeleccionados.baseParams.idestatustecnico = null;
            if (stSeleccionados.getCount() > 0) {
                Ext.getCmp('gpSeleccionados').getSelectionModel().selectFirstRow();
            }
        }
    },
    reader: new Ext.data.JsonReader({
        totalProperty: "total",
        root: "datos",
        id: "conf_estadosOperaciones"
    }, [
        {
            name: 'idestadosentidad'
        },
        {
            name: 'idestructuracomun'
        },
        {
            name: 'idestatustecnico'
        },
        {
            name: 'estado'
        },
        {
            name: 'idoperacion'
        },
        {
            name: 'idproximoestado'
        },
        {
            name: 'proximoestado'
        },
        {
            name: 'denominacion'
        }
    ]),
    remoteSort: true,
    sortInfo: {
        field: 'estado',
        direction: "ASC"
    },
    groupField: 'denominacion'

});

/**
 *  Crear el tab de Estados por operaciones
 **/
Ext.erp.estadosoperaciones = new Ext.extend(Ext.FormPanel, {
    constructor: function (config) {
        var _this = this;
        this.title = config.etiquetas.lbTpEstados;
        this.layout = 'fit';
        this.id = 'estadosoperaciones';

        var btnAdicionarOperacion = new Ext.Button({
            id: 'btnAdicionarOperacion',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            text: config.etiquetas.lbBtnAdicionar,
            tooltip: config.etiquetas.lbBtnAdicionarToolTip,
            handler: function () {
                if (Ext.erp.stEstado.getTotalCount() == 0) {
                    mostrarMensaje(1, config.etiquetas.lbMsgAdicionarRealcionEstado);
                } else {
                    getWinInsetarMod(true, null, config);
                }

            }
        });

        var btnModificarOperacion = new Ext.Button({
            id: 'btnModificarOperacion',
            icon: perfil.dirImg + 'modificar.png',
            iconCls: 'btn',
            text: config.etiquetas.lbBtnModificar,
            tooltip: config.etiquetas.lbBtnModificarToolTip,
            disabled: true,
            handler: function () {
                var record = Ext.getCmp('gpSeleccionados').getSelectionModel().getSelected();
                getWinInsetarMod(false, record, config);
            }
        });

        var btnEliminarOperacion = new Ext.Button({
            id: 'btnEliminarOperacion',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            text: config.etiquetas.lbBtnEliminar,
            tooltip: config.etiquetas.lbBtnEliminarToolTip,
            disabled: true,
            handler: function () {
                eliminarRelaciones(config);
            }
        });

        var btnBuscarOp = new Ext.Button({
            id: 'btnBuscarop',
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            text: config.etiquetas.lbBuscar,
            tooltip: config.etiquetas.lbTpBuscarOperacion,
            handler: function () {
                Ext.erp.stSeleccionados.load({
                    callback: function () {
                        if (Ext.erp.stSeleccionados.getCount() == 0) {
                            mostrarMensaje(1, config.etiquetas.lbMsgBusquedaVacia);
                        }
                    }
                });
            }
        });

        var btnLimpiar = new Ext.Button({
            text: config.etiquetas.lbBtnLimpiar,
            iconCls: 'btn',
            icon: perfil.dirImg + 'limpiar.png',
            tooltip: config.etiquetas.lbTtBtnLimpiar,
            handler: function () {
                Ext.getCmp('cbOperacionesBuscar').reset();
                Ext.getCmp('cbEstadoBuscar').reset();
                Ext.erp.stSeleccionados.load();
            }
        });

        var gpSeleccionados = new Ext.grid.GridPanel({
            region: 'center',
            id: 'gpSeleccionados',
            loadMask: true,
            store: Ext.erp.stSeleccionados,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: false,
                moveEditorOnEnter: false,
                listeners: {
                    'rowselect': function (record, index) {
                        Ext.getCmp('btnModificarOperacion').enable();
                        Ext.getCmp('btnEliminarOperacion').enable();
                    }
                }
            }),
            columns: [new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }), {
                id: 'denominacion',
                hidden: true,
                hideable: false,
                header: config.etiquetas.lbCOperacion,
                width: 250,
                dataIndex: 'denominacion'
            }, {
                header: config.etiquetas.lbCmTipoEstado,
                width: 150,
                dataIndex: 'estado'
            }, {
                header: config.etiquetas.lbCmProxEstado,
                width: 150,
                dataIndex: 'proximoestado'
            }],

            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),

            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: Ext.erp.stSeleccionados,
                displayInfo: false
            }),
            tbar: [
                new Ext.Toolbar.TextItem(config.etiquetas.lbCOperacion + ':'), new Ext.form.ComboBox({
                    width: 250,
                    fieldLabel: config.etiquetas.lbCOperacion,
                    store: Ext.erp.stOperaciones,
                    id: 'cbOperacionesBuscar',
                    forceSelection: true,
                    //editable: false,
                    valueField: 'idoperacion',
                    displayField: 'denominacion',
                    hiddenName: 'idoperacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                    autoCreate: true,
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    mode: 'local',
                    resizable: true
                }), '', new Ext.Toolbar.TextItem(config.etiquetas.lbCmTipoEstado + ':'), new Ext.form.ComboBox({
                    width: 150,
                    fieldLabel: config.etiquetas.lbCmTipoEstado,
                    store: Ext.erp.stEstado,
                    id: 'cbEstadoBuscar',
                    forceSelection: true,
                    //editable: false,
                    valueField: 'idestatustecnico',
                    displayField: 'denominacion',
                    hiddenName: 'idestatustecnico',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                    autoCreate: true,
                    typeAhead: true,
                    triggerAction: 'all',
                    selectOnFocus: true,
                    mode: 'local',
                    resizable: true
                }), '', btnBuscarOp, btnLimpiar]
        });

        this.tbar = [btnAdicionarOperacion, btnModificarOperacion, btnEliminarOperacion];
        this.items = [gpSeleccionados];

        Ext.erp.estadosoperaciones.superclass.constructor.apply(this, arguments);
    },
    activarHotKey: function (e) {
        if (e.altKey) {
            if (e.which == Ext.EventObject.I) {
                if (!Ext.getCmp('btnAdicionarOperacion').disabled && !Ext.Msg.isVisible() && (!Ext.getCmp('idventana')))
                    Ext.getCmp('btnAdicionarOperacion').handler();
            } else if (e.which == Ext.EventObject.M) {
                if (!Ext.getCmp('btnModificarOperacion').disabled && !Ext.Msg.isVisible() && (!Ext.getCmp('idventana') ))
                    Ext.getCmp('btnModificarOperacion').handler();
            } else if (e.which == Ext.EventObject.B) {
                if (!Ext.getCmp('btnBuscarop').disabled && !Ext.Msg.isVisible() && (!Ext.getCmp('idventana') ))
                    Ext.getCmp('btnBuscarop').handler();
            } else if (e.which == Ext.EventObject.L) {
                if (!Ext.Msg.isVisible() && (!Ext.getCmp('idventana') )) {
                    Ext.getCmp('cbOperacionesBuscar').reset();
                    Ext.getCmp('cbEstadoBuscar').reset();
                    Ext.erp.stSeleccionados.load();
                }
            }
        } else {
            if (e.which == Ext.EventObject.DELETE) {
                if (Ext.getCmp('btnEliminarOperacion'))
                    if (!Ext.getCmp('btnEliminarOperacion').disabled && !Ext.Msg.isVisible() && (!Ext.getCmp('idventana')))
                        eliminarRelaciones({etiquetas: conf.idioma});

            }
        }
    }
});

function getWinInsetarMod(insertar, record, config) {
    var hidden = (insertar) ? false : true;
    var title = (insertar) ? (config.etiquetas.lbTitleAdicionarEstado) : (config.etiquetas.lbTitleModificarEstado);

    if (!Ext.erp.ventanaGestOper) {
        Ext.erp.ventanaGestOper = new Ext.Window({
            title: title,
            height: 125,
            width: 650,
            closeAction: 'hide',
            modal: true,
            resizable: false,
            layout: 'fit',
            id: 'idventana',
            listeners: {
                'show': function () {
                    if (!insertar) {
                        Ext.getCmp('cbOperaciones').setValue(record.get('idoperacion'));
                        Ext.getCmp('cbEstado').setValue(record.get('estado'));
                        Ext.getCmp('cbProximoEstado').setValue(record.get('proximoestado'));
                        Ext.getCmp('hdidestatus').setValue(record.get('idestatustecnico'));
                        Ext.getCmp('hdidproxestatus').setValue(record.get('idproximoestado'));
                        Ext.getCmp('idPanelGestion').getForm().items.each(function (f) {
                            f.originalValue = f.getValue();
                        });
                    }
                }
            },
            items: [
                {
                    xtype: 'form',
                    id: 'idPanelGestion',
                    frame: true,
                    layout: 'column',
                    trackResetOnLoad: true,
                    items: [
                        {
                            columnWidth: .50,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [new Ext.form.ComboBox({
                                width: 300,
                                fieldLabel: config.etiquetas.lbCOperacion,
                                store: Ext.erp.stOperaciones,
                                id: 'cbOperaciones',
                                valueField: 'idoperacion',
                                displayField: 'denominacion',
                                hiddenName: 'idoperacion',
                                disabled: (insertar) ? false : true,
                                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                                autoCreate: true,
                                typeAhead: true,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                mode: 'local',
                                allowBlank: false,
                                resizable: true,
                                forceSelection: true,
                                //editable: false
                            })]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [new Ext.form.ComboBox({
                                width: 150,
                                fieldLabel: config.etiquetas.lbCmTipoEstado,
                                store: Ext.erp.stEstadoDisponible,
                                id: 'cbEstado',
                                valueField: 'idestatustecnico',
                                displayField: 'denominacion',
                                hiddenName: 'idestatustecnico',
                                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                                autoCreate: true,
                                typeAhead: true,
                                triggerAction: 'all',
                                selectOnFocus: true,
                                mode: 'local',
                                allowBlank: false,
                                resizable: true,
                                forceSelection: true,
                                //editable: false,
                                listeners: {
                                    'select': function () {
                                        if (!insertar)
                                            Ext.getCmp('hdidestatus').setValue(Ext.getCmp('cbEstado').getValue());
                                    }
                                }
                            }), {
                                xtype: 'hidden',
                                name: 'idestatustecnico',
                                id: 'hdidestatus'
                            }]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [new Ext.form.ComboBox({
                                width: 150,
                                fieldLabel: config.etiquetas.lbCmProxEstado,
                                store: Ext.erp.stEstadoDisponible,
                                triggerAction: 'all',
                                id: 'cbProximoEstado',
                                valueField: 'idestatustecnico',
                                displayField: 'denominacion',
                                hiddenName: 'idestatustecnico',
                                tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                                autoCreate: true,
                                typeAhead: true,
                                selectOnFocus: true,
                                mode: 'local',
                                allowBlank: false,
                                resizable: true,
                                forceSelection: true,
                                //editable: false,
                                listeners: {
                                    'select': function () {
                                        if (!insertar)
                                            Ext.getCmp('hdidproxestatus').setValue(Ext.getCmp('cbProximoEstado').getValue());
                                    }
                                }
                            }), {
                                xtype: 'hidden',
                                name: 'idestatustecnico',
                                id: 'hdidproxestatus'
                            }]
                        }
                    ]
                }
            ],
            buttons: [
                {
                    iconCls: 'cancelar',
                    tooltip: config.etiquetas.lbTtBtnCancelar,
                    text: config.etiquetas.lbBtnCancelar,
                    id: 'cancelar',
                    handler: function () {
                        Ext.erp.ventanaGestOper.hide();
                    }
                },
                {
                    iconCls: 'aplicar',
                    tooltip: config.etiquetas.lbTtBtnAplicar,
                    hidden: hidden,
                    text: config.etiquetas.lbBtnAplicar,
                    id: 'aplicar',
                    handler: function () {
                        insertarRelacion(Ext.getCmp('cbOperaciones').getValue(), Ext.getCmp('cbEstado').getValue(), Ext.getCmp('cbProximoEstado').getValue(), config, null);
                    }
                },
                {
                    iconCls: 'aceptar',
                    text: config.etiquetas.lbBtnAceptar,
                    tooltip: config.etiquetas.lbTtBtnAceptar,
                    id: 'aceptar',
                    handler: function () {
                        if (insertar)
                            insertarRelacion(Ext.getCmp('cbOperaciones').getValue(), Ext.getCmp('cbEstado').getValue(), Ext.getCmp('cbProximoEstado').getValue(), config, Ext.erp.ventanaGestOper); else
                            modificarRelacion(Ext.getCmp('cbOperaciones').getValue(), Ext.getCmp('hdidestatus').getValue(), Ext.getCmp('hdidproxestatus').getValue(), record.get('idestadosentidad'), config, Ext.erp.ventanaGestOper);
                    }
                }
            ]
        });

    }
    Ext.erp.ventanaGestOper.show();
    Ext.erp.ventanaGestOper.doLayout();

    //ventana.show();
    //ventana.doLayout();
}

function insertarRelacion(idoperacion, idestatustecnico, idproximoestado, config, ventana) {

    if (Ext.getCmp('idPanelGestion').getForm().isValid()) {
        Ext.getBody().mask(config.etiquetas.msgBPEstadosGuardar, 'x-mask-loading');
        //barraProgreso(config.etiquetas.msgBPEstadosGuardar,config.etiquetas.titleBP);
        Ext.Ajax.request({
            url: Ext.erp.url + 'adicionaroperacionestado',
            method: 'POST',
            params: {
                parametros: Ext.encode({
                    idoperacion: idoperacion,
                    idestatustecnico: idestatustecnico,
                    idproximoestado: idproximoestado
                })
            },
            callback: function (options, success, response) {
                var rd = Ext.decode(response.responseText);

                if(rd.CodMsg == 1){
                    mostrarMensaje(rd.CodMsg, config.etiquetas.lbMensaje + config.etiquetas.lbInsertCorrec);
                }
                if(rd.CodMsg == 3){
                    mostrarMensaje(rd.CodMsg, config.etiquetas.lbMensaje + config.etiquetas.lbInsertInCorrec);
                }
                if(rd.CodMsg == 4){
                    mostrarMensaje("3", config.etiquetas.lbMensaje + config.etiquetas.lbInsertInCorrec1);
                }

                if (Ext.getCmp('cbEstado'))
                    Ext.getCmp('cbEstado').reset();
                if (Ext.getCmp('cbProximoEstado'))
                    Ext.getCmp('cbProximoEstado').reset();
                Ext.getCmp('gpSeleccionados').getStore().reload();

                if (ventana) {
                    ventana.close();
                }

                Ext.getBody().unmask();
            }
        });
    } else {
        mostrarMensaje(1, config.etiquetas.lbMsgCamposMal);

    }

}

function modificarRelacion(idoperacion, idestatustecnico, idproximoestado, idestadosentidad, config, ventana) {

    if (Ext.getCmp('idPanelGestion').getForm().isValid()) {
        if (Ext.getCmp('idPanelGestion').getForm().isDirty()) {
            Ext.getBody().mask(config.etiquetas.msgBPEstadosGuardar, 'x-mask-loading');
            Ext.Ajax.request({
                url: Ext.erp.url + 'modificaroperacionestado',
                method: 'POST',
                params: {
                    parametros: Ext.encode({
                        idoperacion: idoperacion,
                        idestado: idestatustecnico,
                        idproximoestado: idproximoestado,
                        idestadosentidad: idestadosentidad
                    })
                },
                callback: function (options, success, response) {
                    var rd = Ext.decode(response.responseText);

                    mostrarMensaje((rd.CodMsg == 1) ? 1 : 3, config.etiquetas.lbMensaje + ((rd.CodMsg == 1) ? config.etiquetas.lbModCorrec : config.etiquetas.lbModInCorrec));

                    Ext.getCmp('gpSeleccionados').getStore().reload();
                    if (ventana) {
                        ventana.close();
                    }
                    Ext.getBody().unmask();
                }
            });
        } else {
            mostrarMensaje(1, config.etiquetas.lbMsgModRelacionExiste);
        }
    } else {
        mostrarMensaje(3, config.etiquetas.lbMsgCamposMal);
    }
}

function eliminarRelaciones(config) {
    mostrarMensaje(2, config.etiquetas.lbMsgEliminar, function (btnOK) {
        if (btnOK == 'ok') {
            Ext.getBody().mask(config.etiquetas.lbMsgEliminandoRelacion, 'x-mask-loading');
            var records = Ext.getCmp('gpSeleccionados').getSelectionModel().getSelections();
            var arrdeides = Array();

            for (var i = 0; i < records.length; i++) {
                arrdeides.push(records[i].get('idestadosentidad'));
            }

            Ext.Ajax.request({
                url: Ext.erp.url + 'eliminarasociado',
                method: 'POST',
                params: {
                    datos: Ext.encode(arrdeides)
                },
                success: function (response) {
                    var rd = Ext.util.JSON.decode(response.responseText);
                    mostrarMensaje(rd.CodMsg, (rd.CodMsg == 1) ? (config.etiquetas.lbMsgEliminar1) : (config.etiquetas.lbMsgEliminar2))
                    Ext.erp.stSeleccionados.reload();
                }
            });
            Ext.getBody().unmask();
        }
    });
}

function cargarStoresEstatus() {
    Ext.erp.stSeleccionados.load({
        params: {start: 0, limit: 15}
    });
    Ext.erp.stEstado.load();
    Ext.erp.stEstadoDisponible.load();
    Ext.erp.stOperaciones.load();
}
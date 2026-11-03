/*
 *@Author: Tte. Ing. Damian O. Falcón Borrás
 *@Name: Planificacion.windModelo
 *@Tipo: Clase
 *@Description: Ventana pa asociar cartas tecnológicas con modelos.
 */
Ext.ns('Ext.Planificacion');
Ext.Planificacion.windModelo = Ext.extend(Ext.Window, {
    layout: 'border',
    title: 'Asociación a planes',
    width: 700,
    constrain: true,
    height: 600,
    id: 'windModelo',
    modal: true,
    frame: true,
    closeAction: 'hide',
    initComponent: function() {
        var self = this;
        this.buttons = [{
                xtype: 'button',
                text: 'Cancelar',
                icon: perfil.dirImg + 'cancelar.png',
                iconCls: 'btn',
                handler: function() {
                    Ext.getCmp('gridCartas').getStore().removeAll();
                    Ext.getCmp('gpPlanesAsociados').getStore().removeAll();
                    Ext.getCmp('gpPlanes').getSelectionModel().clearSelections();
                    this.hide();
                }.createDelegate(this)
            }, {
                xtype: 'button',
                text: 'Aplicar',
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                handler: function() {
                    self.asociarCartasModelo();
                }.createDelegate(this)
            }, {
                xtype: 'button',
                text: 'Aceptar',
                icon: perfil.dirImg + 'aceptar.png',
                iconCls: 'btn',
                handler: function() {
                    self.asociarCartasModelo(true);
                }.createDelegate(this)
            }];
        this.items = [{
                xtype: 'grid',
                id: 'gridCartas',
                title: 'Cartas Tecnológicas',
                frame: true,
                region: 'center',
                autoExpandColumn: 'expandir',
                sm: new Ext.grid.RowSelectionModel(),
                columns: [{
                        header: 'Código',
                        dataIndex: 'codigo'
                    }, {
                        id: 'expandir',
                        header: 'Denominación',
                        dataIndex: 'denominacion'
                    }, {
                        header: 'Rendimiento',
                        dataIndex: 'rendimientoumcarta'
                    }],
                store: new Ext.data.SimpleStore({
                    fields: [{
                            name: 'idcartatecnologica'
                        }, {
                            name: 'codigo'
                        }, {
                            name: 'denominacion'
                        }, {
                            name: 'rendimiento'
                        }]
                }),
                listeners: {
                    cellclick: function() {
                        if (this.getSelectionModel().getCount() == 1) {
                            recargaNormal(Ext.getCmp('gpPlanesAsociados').getStore());
                            Ext.getCmp('gpPlanesAsociados').enable();
                            Ext.getCmp('gpPlanes').enable();
                        }
                        else {
                            Ext.getCmp('gpPlanesAsociados').getStore().removeAll();
                            Ext.getCmp('gpPlanesAsociados').disable();
                            Ext.getCmp('gpPlanes').disable();
                        }
                    }
                }
            }, {
                region: 'south',
                layout: 'form',
                autoHeight: true,
                frame: true,
                items: [{
                        layout: 'column',
                        items: [{
                                columnWidth: .45,
                                layout: 'form',
                                items: [{
                                        xtype: 'grid',
                                        id: 'gpPlanes',
                                        title: 'Planes',
                                        disabled: true,
                                        frame: true,
                                        height: 300,
                                        region: 'center',
                                        loadMask: {
                                            msg: 'Cargando'
                                        },
                                        autoExpandColumn: 'expandir',
                                        sm: new Ext.grid.RowSelectionModel({
                                            singleSelect: false
                                        }),
                                        columns: [{
                                                header: 'Denominación',
                                                dataIndex: 'denominacion',
                                                id: 'expandir'
                                            }],
                                        store: new Ext.data.Store({
                                            url: 'listarModelos',
                                            autoLoad: true,
                                            reader: new Ext.data.JsonReader({
                                                root: 'data',
                                                id: 'idmodelo'
                                            }, [{
                                                    name: 'idmodelo'
                                                }, {
                                                    name: 'denominacion'
                                                }])
                                        })

                                    }]
                            }, {
                                columnWidth: .10,
                                anchor: '100%',
                                layout: 'form',
                                items: [{
                                        xtype: 'button',
                                        id: 'btnsiguiente',
                                        style: 'margin-left:18px;margin-top:90px',
                                        icon: perfil.dirImg + 'siguiente.png',
                                        iconCls: 'btn',
                                        handler: function() {
                                            data = Ext.getCmp('gpPlanes').getSelectionModel().getSelections();
                                            for (var i = 0; i < data.length; i++) {
                                                if (!self.buscarRecordModelo(data[i].data.idmodelo, Ext.getCmp('gpPlanesAsociados').getStore())) {
                                                    Ext.getCmp('gpPlanesAsociados').getStore().add(data[i])
                                                } else {
                                                    Ext.MessageBox.show({
                                                        title: 'Informaci&oacute;n',
                                                        buttons: Ext.MessageBox.OK,
                                                        msg: 'Algunos de los modelos ya existen',
                                                        icon: Ext.MessageBox.INFO
                                                    });
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'button',
                                        id: 'btnAnterior',
                                        style: 'margin-left:18px;margin-top:50px',
                                        icon: perfil.dirImg + 'anterior.png',
                                        iconCls: 'btn',
                                        handler: function() {
                                            data = Ext.getCmp('gpPlanesAsociados').getSelectionModel().getSelections();
                                            for (var i = 0; i < data.length; i++) {
                                                Ext.getCmp('gpPlanesAsociados').getStore().remove(data[i]);
                                            }
                                        }
                                    }]
                            }, {
                                columnWidth: .45,
                                layout: 'form',
                                items: [{
                                        xtype: 'grid',
                                        frame: true,
                                        region: 'east',
                                        disabled: true,
                                        height: 300,
                                        id: 'gpPlanesAsociados',
                                        title: 'Planes asociados',
                                        autoExpandColumn: 'expandir',
                                        loadMask: {
                                            msg: 'Cargando'
                                        },
                                        sm: new Ext.grid.RowSelectionModel({
                                            singleSelect: false
                                        }),
                                        columns: [{
                                                header: 'Denominación',
                                                dataIndex: 'denominacion',
                                                id: 'expandir'
                                            }],
                                        store: new Ext.data.Store({
                                            url: 'listarPlanesAsociadosCarta',
                                            reader: new Ext.data.JsonReader({
                                                root: 'data',
                                                id: 'idmodelo'
                                            }, [{
                                                    name: 'idmodelo'
                                                }, {
                                                    name: 'denominacion',
                                                    mapping: 'DatModelo.denominacion'

                                                }]),
                                            listeners: {
                                                beforeload: function() {
                                                    this.baseParams.idcarta = Ext.getCmp('gridCartas').getSelectionModel().getSelected().data.idcartatecnologica;
                                                }
                                            }
                                        })

                                    }]
                            }]
                    }]
            }]
        Ext.Planificacion.windModelo.superclass.initComponent.call(this, arguments);
    },
    asociarCartasModelo: function(cerrar) {
        if (Ext.getCmp('gpPlanesAsociados').getStore().getCount() == 0) {
            mensaje = 'desasociado';
            mensaje1 = 'Desasociando'
        } else {
            mensaje = 'asociado';
            mensaje1 = 'Asociando'
        }
       var msjAsoc = Ext.MessageBox.show({
            title: 'Por favor espere...',
            msg: mensaje1 + ' cartas tecnológicas a planes',
            width: 300,
            wait: true,
            progress: true,
            closable: false,
            animEl: 'mb6'
        });
        var recordsSel = Ext.getCmp('gridCartas').getSelectionModel().getSelections();
        var cartaasociar = [];
        modelosaasociar = [];
        if (recordsSel.length > 0) {
            for (var i = 0; i < recordsSel.length; i++)
                cartaasociar.push(
                        recordsSel[i].data.idcartatecnologica
                        );
            for (var i = 0; i < Ext.getCmp('gpPlanesAsociados').getStore().getCount(); i++) {
                modelosaasociar.push(
                        Ext.getCmp('gpPlanesAsociados').getStore().getAt(i).data.idmodelo
                        );
            }
            Ext.Ajax.request({
                url: 'asociarCartasaPlanes',
                params: {
                    cartas: Ext.encode(cartaasociar),
                    modelos: Ext.encode(modelosaasociar)
                },
                callback: function(options, success, response) {
                    msjAsoc.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(1, 'La(s) carta(s) tecnológica(s) se han ' + mensaje + ' al plan satisfactoriamente', function() {
                            if (cerrar)
                                recargaNormal(gpCT.getStore());
                        });
                        if (cerrar) {
                            Ext.getCmp('windModelo').hide();
                            Ext.getCmp('gridCartas').getStore().removeAll();
                            Ext.getCmp('gpPlanesAsociados').getStore().removeAll();
                            Ext.getCmp('gpPlanes').getSelectionModel().clearSelections();
                        }
                    }

                }
            });
        }
    },
    buscarRecordModelo: function(id, store) {
        var bandera = false;
        for (var i = 0; i < store.getCount(); i++) {
            if (store.getAt(i).data.idmodelo == id) {
                bandera = true;
                break;
            }
        }
        return bandera;
    }
});

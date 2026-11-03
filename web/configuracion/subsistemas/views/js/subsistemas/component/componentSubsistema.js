/**
 * Subsistema(version componente)
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @author Ing. Alejandro Mengana Pérez.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General. 
 * @namespace Ext.Configuracion_General_Parametros
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Parametros');
Ext.Configuracion_General_Parametros.SubsistemasModel = {
    init: function(scope) {
        scope.dataSubsistema = new Ext.data.Store({
            url: scope.url + 'getSubsistemas',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idsubsistema"
            }, [{
                    name: 'idsubsistema'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'crc'
                }, {
                    name: 'uri'
                }, {
                    name: 'cierra'
                }, {
                    name: 'fecha'
                }, {
                    name: 'precedencia'
                }, {
                    name: 'denomprecedencia'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idestructurasubsist'
                }
            ])
        });
        //scope.dataSubsistema.load();
    }
};


Ext.Configuracion_General_Parametros.SubsistemasController = {
    init: function(scope) {
        scope.loadMessageBox = function(title, msg) {
            Ext.MessageBox.show({
                title: title,
                msg: msg,
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

        scope.showImage = function(value, metaData, record, rowIndex, colIndex, store) {
            if (record.data.idestado == 0) {
//                return '<img qtip="<b>Inactivo</b>" src= ' + scope.perfil.dirImg + 'banderagris.png >';
                return '<img qtip="<b>Inactivo</b>" src= /configuracion/comun/images/banderagris.png >';
            } else if (record.data.idestado == 1) {
//                return '<img qtip="<b>Activo</b>" src= ' + scope.perfil.dirImg + 'banderaazul.png >';
                return '<img qtip="<b>Activo</b>" src= /configuracion/comun/images/banderaazul.png >';
            }
        };

        scope.showImageCierre = function(value, metaData, record, rowIndex, colIndex, store) {
            if (record.data.cierra == 0) {
//                return '<img qtip="<b>No cierra</b>" src= ' + scope.perfil.dirImg + 'cierreno.png >';
                return '<img qtip="<b>No cierra</b>" src= /configuracion/comun/images/cierreno.png >';
            } else if (record.data.cierra == 1) {
//                return '<img qtip="<b>Cierra</b>" src= ' + scope.perfil.dirImg + 'cierresi.png >';
                return '<img qtip="<b>Cierra</b>" src= /configuracion/comun/images/cierresi.png >';
            }
        };

        scope.ClickCierraAction = function(cierre) {
            if (scope.smSubsistema.getSelected()) {
                var listSubsist = [];
                Ext.each(scope.smSubsistema.getSelections(), function(item, index) {
                    if (item.data.cierra != cierre) {
                        listSubsist.push({
                            idestructurasubsist: item.data.idestructurasubsist,
                            idsubsistema: item.data.idsubsistema,
                            tipo: item.data.cierra
                        });
                    }
                });
            } else
                mostrarMensaje(1, scope.etiquetas.NotSelect);
        };

        scope.ClickActivoAction = function(estado) {
            if (scope.smSubsistema.getSelected()) {
                var listSubsist = [];
                Ext.each(scope.smSubsistema.getSelections(), function(item, index) {
                    if (item.data.idestado != estado) {
                        listSubsist.push({
                            idestructurasubsist: item.data.idestructurasubsist,
                            idsubsistema: item.data.idsubsistema,
                            tipo: estado
                        });
                    }
                });
                Ext.Ajax.request({
                    url: scope.url + 'modificarEstado',
                    params: {
                        arraysubsist: Ext.encode(listSubsist)
                    },
                    method: 'POST',
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.codMsg) {
                            case -1 :
                                if (listSubsist.length > 1) {
                                    if (estado == 1)
                                        mostrarMensaje(1, scope.etiquetas.lbMsgActivoOkPlural);
                                    else
                                        mostrarMensaje(1, scope.etiquetas.lbMsgInactivoOkPlural);
                                }
                                else {
                                    if (estado == 1)
                                        mostrarMensaje(1, scope.etiquetas.lbMsgActivoOkSingle);
                                    else
                                        mostrarMensaje(1, scope.etiquetas.lbMsgInactivoOkSingle);
                                }
                                break;
                            case -2 :
                                if (estado == 1)
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteAct);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteInact);
                                break;
                            case -3 :
                                if (estado == 1)
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteActPlural);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteInactPlural);
                                break;
                            case -4 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgError);
                                break;
                            default:
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                break;
                        }
                        fAceptarCambios();
                        function fAceptarCambios(btnPress) {
                            scope.dataSubsistema.removeAll();
                            scope.dataSubsistema.reload();
                            Ext.MessageBox.hide();
                        }
                    }
                });
            } else
                mostrarMensaje(1, scope.etiquetas.NotSelect);
        };
    }
};

Ext.Configuracion_General_Parametros.Subsistemas = Ext.extend(Ext.Panel,
        {
            perfil: window.parent.UCID.portal.perfil,
            desglose: false,
            constructor: function(config)
            {
                Ext.QuickTips.init();
                scope = this;
                scope.addEvents('endload');
                scope.config = config;
                scope.etiquetas = new Object();
                scope.windowOp = false;
                scope.etiquetas = Ext.Configuracion_General_Parametros.etiquetas;
                scope.url = '/configuracion/subsistemas/index.php/gestsubsistemas/';
                scope.model = Ext.Configuracion_General_Parametros.SubsistemasModel;
                scope.controller = Ext.Configuracion_General_Parametros.SubsistemasController;
                Ext.apply(this, config);
                scope.model.init(scope);
                scope.controller.init(scope);
                scope.init(scope);
            },
            init: function() {
                scope.btnAdicionar = new Ext.Button({
                    id: 'btnAdicionar',
                    iconCls: 'adicionar',
                    tooltip: scope.etiquetas.lbTtAdicionarSunsist,
                    text: scope.etiquetas.lbAdicionar,
                    handler: function() {

                    }
                });
                scope.btnModificar = new Ext.Button({
                    id: 'btnModificar',
                    iconCls: 'modificar',
                    disabled: true,
                    tooltip: scope.etiquetas.lbTtModificarSubsistema,
                    text: scope.etiquetas.lbModificar,
                    handler: function() {

                    }
                });
                scope.btnEliminar = new Ext.Button({
                    id: 'btnEliminar',
                    iconCls: 'eliminar',
                    disabled: true,
                    tooltip: scope.etiquetas.lbTtEliminarSubsistema,
                    text: scope.etiquetas.lbEliminar,
                    handler: function() {

                    }
                });

                scope.btnAyuda = new Ext.Button({
                    id: 'btnAyuda',
                    iconCls: 'ayuda',
                    tooltip: scope.etiquetas.lbTtAyuda,
                    text: scope.etiquetas.lbAyuda/*,
                    handler: function() {

                    }*/
                });

                scope.menuItemActivo = new Ext.menu.Item({
                    text: scope.etiquetas.lbActivo,
                    hidden: true,
//                    icon: scope.perfil.dirImg + 'banderaazul.png'
                    icon: '/configuracion/comun/images/banderaazul.png'
                });

                scope.menuItemInactivo = new Ext.menu.Item({
                    text: scope.etiquetas.lbInactivo,
                    hidden: true,
//                    icon: scope.perfil.dirImg + 'banderagris.png'
                    icon: '/configuracion/comun/images/banderagris.png'
                });

                scope.menuItemCierra = new Ext.menu.Item({
                    text: scope.etiquetas.lbCierra,
                    hidden: true,
//                    icon: scope.perfil.dirImg + 'cierresi.png'
                    icon: '/configuracion/comun/images/cierresi.png'
                });

                scope.menuItemNoCierra = new Ext.menu.Item({
                    text: scope.etiquetas.lbNoCierra,
                    hidden: true,
//                    icon: scope.perfil.dirImg + 'cierreno.png'
                    icon: '/configuracion/comun/images/cierreno.png'
                });

                scope.menuContextual = new Ext.menu.Menu({
                    floating: false,
                    shadow: "drop",
                    hideBorders: true,
                    items: [scope.menuItemActivo, scope.menuItemInactivo, scope.menuItemCierra, scope.menuItemNoCierra]
                });

                scope.menuItemActivo.on('click', function() {
                    scope.ClickActivoAction(1);
                });

                scope.menuItemInactivo.on('click', function() {
                    scope.ClickActivoAction(0);
                });

                scope.menuItemCierra.on('click', function() {
                    scope.ClickCierraAction(1);
                });

                scope.menuItemNoCierra.on('click', function() {
                    scope.ClickCierraAction(0);
                });

                scope.smSubsistema = new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    listeners: {
                        rowselect: function(smodel, rowIndex, record) {
                            Ext.getCmp('gpSubsistema').getView().addRowClass(rowIndex, "negrita");
                        },
                        rowdeselect: function(smodel, rowIndex, record) {
                            Ext.getCmp('gpSubsistema').getView().removeRowClass(rowIndex, "negrita");
                        }
                    }
                });

                scope.gpSubsistema = new Ext.grid.GridPanel({
                    id: 'gpSubsistema',
                    frame: true,
                    height: 250,
                    autoExpandColumn: 'expandir',
                    loadMask: {
                        store: scope.dataSubsistema,
                        msg: scope.etiquetas.lbMsgCargando
                    },
                    width: 450,
                    store: scope.dataSubsistema,
                    sm: scope.smSubsistema,
                    stripeRows: true,
                    floating: false,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [{
                            header: scope.etiquetas.lbCodigo,
                            width: 60,
                            dataIndex: 'idsubsistema',
                            sortable: true
                        }, {
                            header: scope.etiquetas.lbDenominacion,
                            width: 150,
                            dataIndex: 'denominacion',
                            sortable: true
                        }, {
                            id: 'expandir',
                            header: scope.etiquetas.lbUri,
                            width: 250,
                            dataIndex: 'uri'
                        }, {
                            header: scope.etiquetas.lbPrecedencia,
                            width: 150,
                            dataIndex: 'denomprecedencia'
                        }, {
                            header: scope.etiquetas.lbCierre,
                            width: 100,
                            dataIndex: 'cierra',
                            align: 'center',
                            renderer: scope.showImageCierre
                        }, {
                            header: scope.etiquetas.lbEstado,
                            width: 100,
                            dataIndex: 'estado',
                            align: 'center',
                            renderer: scope.showImage
                        }
                    ],
                    bbar: new Ext.Cont.PagingToolbar({
                        pageSize: 20,
                        displayInfo: true,
                        displayMsg: scope.etiquetas.lbDisplayMsg,
                        emptyMsg: scope.etiquetas.lbEmptyMsg,
                        tabIndex: 314,
                        store: scope.dataSubsistema
                    })
                });

                scope.gpSubsistema.on({
                    render: function(gridpanel) {
                        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: scope.etiquetas.msgCargando});
                        myMask.show();
                        scope.dataSubsistema.load({
                            callback: function(record, options, success) {
                                myMask.hide();
                                scope.fireEvent('endload', scope);
                            }
                        });
                    },
                    rowcontextmenu: function(grid, rowIndex, eventObject) {
                        eventObject.stopEvent();
                        var record = scope.dataSubsistema.getAt(rowIndex);
                        if (record.data.idestado === '1') {
                            scope.menuItemActivo.hide();
                            scope.menuItemInactivo.show();
                        } else if (record.data.idestado === '0') {
                            scope.menuItemInactivo.hide();
                            scope.menuItemActivo.show();
                        }
                        if (record.data.cierra === '1') {
                            scope.menuItemCierra.hide();
                            scope.menuItemNoCierra.show();
                        } else if (record.data.cierra === '0') {
                            scope.menuItemNoCierra.hide();
                            scope.menuItemCierra.show();
                        }
                        if (scope.smSubsistema.getSelected())
                            scope.menuContextual.showAt(eventObject.getXY());
                        else
                            scope.menuContextual.hide();
                    }
                });

                scope.pnlSubsistema = new Ext.Panel({
                    layout: 'fit',
                    border: true,
                    items: [scope.gpSubsistema],
                    keys: scope.hotKeysNomMoneda = new Ext.KeyMap(Ext.getBody(), [
                        {
                            key: 'i',
                            alt: true,
                            fn: function() {
                                if (!scope.btnAdicionar.disabled && scope.windowOp == false)
                                    scope.btnAdicionar.handler.call();
                            }
                        }, {
                            key: 'm',
                            alt: true,
                            fn: function() {
                                if (!scope.btnModificar.disabled && scope.windowOp == false)
                                    scope.btnModificar.handler.call();
                            }
                        }, {
                            key: Ext.EventObject.DELETE,
                            fn: function() {
                                if (!scope.btnEliminar.disabled && scope.windowOp == false)
                                    scope.btnEliminar.handler.call();
                            }
                        }, {
                            key: 'h',
                            alt: true,
                            fn: function() {

                            }
                        }
                    ]),
                    tbar: [scope.btnAdicionar, scope.btnModificar, scope.btnEliminar, '->', scope.btnAyuda],
                    listeners: {
                        render: function(panel) {
                            scope.btnAdicionar.focus(true, 1000);
                        }
                    }
                });
                Ext.apply(scope.config);
                this.items = scope.pnlSubsistema;
                Ext.Configuracion_General_Parametros.Subsistemas.superclass.constructor.call(this, scope.config);

            }
        });

Ext.reg('nomMoneda', Ext.Configuracion_General_Parametros.Subsistemas);



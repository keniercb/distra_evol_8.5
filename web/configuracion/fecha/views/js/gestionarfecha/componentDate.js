/**
 * Fecha (version componente)
 *
 * @author Ing. Alexis Rodriguez Reyes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.Configuracion_General_Parametros
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Parametros');

Ext.Configuracion_General_Parametros.FechaModel = {
    init: function (scope) {
        scope.stFechaPorSubsistemas = new Ext.data.Store({
            url: scope.url + 'cargarfechas1',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos"
            }, [
                {
                    name: 'idestructurasubsist'
                },
                {
                    name: 'incremento'
                },
                {
                    name: 'fecha',
                    type: 'date',
                    dateFormat: 'd/m/Y'
                }])
        });

        scope.stFechas = new Ext.data.Store({
            url: scope.url + 'cargarfechas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [
                {
                    name: 'idfecha'
                },
                {
                    name: 'idestructurasubsist'
                },
                {
                    name: 'incremento'
                },
                {
                    name: 'fecha',
                    type: 'date',
                    dateFormat: 'd/m/Y'
                },
                {
                    name: 'precedencia'
                },
                {
                    name: 'incrementoc'
                },
                {
                    name: 'idestructurasubsisti'
                },
                {
                    name: 'version'
                }])

        });
        scope.stSubsistemas = new Ext.data.Store({
            url: scope.url + 'cargarSubsistemas',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'idestructurasubsist'
            }, {
                name: 'denominacion'
            }]),
            listeners: {
                loadexception: function (store) {
                    this.removeAll();
                }
            }
        });

        scope.stComportamiento = new Ext.data.Store({
            url: scope.url + 'cargarcombocomport',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'idcomport'
            },
                {
                    name: 'Comportamiento'
                }])
        });
        scope.stEjercicios = new Ext.data.Store({
            url: scope.url + 'cargarEjercicios',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'idejercicio'
            },
                {
                    name: 'nombre'
                }])
        });
        scope.stPeriodos = new Ext.data.Store({
            url: scope.url + 'cargarPeriodos',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [
                {
                    name: 'idperiodo'
                },
                {
                    name: 'nombre'
                }])
        });

        scope.stComportamiento.load();
        scope.stFechas.load({
            params: {
                start: 0,
                limit: 24
            }
        });
        scope.stFechas.on({
            load: function () {
                /*UCID.portal.cargarAcciones(window.frameElement.id, function () {
                 });*/
            }
        });

        function botonModificar() {
            panel.getTopToolbar().items.items[0].focus();
            for (var i = 0; i < cant; i++)
                if (typeof (Ext.pvd) == 'undefined') {
                    btnVerPerfil.hide();
                    btnAsignarPerfil.hide();
                }
        }

        scope.stSubsistemas.load();
        scope.stEjercicios.load();
    }
};

Ext.Configuracion_General_Parametros.FechaController = {
    init: function (scope) {

        window.document.oncontextmenu = function(){
            return false;
        }

        scope.winBuscarFechaPorSubSys = function () {
            this.nodopadre = new Ext.tree.AsyncTreeNode({
                text: scope.etiquetas.lbEntidadesEcon,
                expandable: true,
                id: '0'
            });
            this.treeLoader = new Ext.tree.TreeLoader({
                dataUrl: scope.url + 'obtenerarbol'
            });

            this.winBuscar = new Ext.Window({
                id: 'winBuscar',
                modal: true,
                autoload: true,
                layout: 'border',
                title: scope.etiquetas.lbBuscarFecha,
                constrain: true,
                width: 1000,
                height: 500,
                resizable: false,
                minimizable: true,
                maximizable: true,
                items: [
                    this.panel = new Ext.Panel({
                        region: 'west',
                        width: 250,
                        height: 400,
                        items: [
                            this.tpEstructurae = new Ext.tree.TreePanel({
                                autoScroll: true,
                                height: 468,
                                border: false,
                                root: this.nodopadre,
                                id: 'tpEstructurae',
                                loader: this.treeLoader,
                                listeners: {
                                    click: function (n) {
                                        if (n.id != 0) {
                                            scope.idestructura = n.attributes.idestructuracomun;
                                            scope.stFechaPorSubsistemas.removeAll();
                                            scope.stFechaPorSubsistemas.reload({
                                                params: {
                                                    start: 0,
                                                    limit: 24,
                                                    idestructura: scope.idestructura
                                                }
                                            });
                                        }
                                    },
                                    contextmenu: function (n, e) {
                                        var contextMenu = new Ext.menu.Menu({
                                            items: [{
                                                text: scope.etiquetas.lbActualizar,
                                                icon: scope.perfil.dirImg + 'actualizar.png',
                                                handler: function () {
                                                    Ext.getCmp('tpEstructurae').getRootNode().reload();
                                                }
                                            }
                                            ]
                                        });
                                        contextMenu.showAt(e.getXY());
                                    }
                                }
                            })]
                    }),
                    this.panelCentral = new Ext.Panel({
                        region: 'center',
                        layout: 'fit',
                        id: 'panelCentral',
                        border: false,
                        width: 500,
                        height: 250,
                        items: [
                            this.gpFechasSubsistemasV = new Ext.grid.GridPanel({
                                id: 'gpFechasSubsistemasV',
                                frame: true,
                                iconCls: 'icon-grid',
                                autoExpandColumn: 'expandir',
                                loadMask: scope.etiquetas.lbMsgCargando,
                                width: 450,
                                store: scope.stFechaPorSubsistemas,
                                sm: new Ext.grid.RowSelectionModel({
                                    singleSelect: true
                                }),
                                floating: false,
                                viewConfig: {
                                    forceFit: true
                                },
                                columns: [
                                    {
                                        id: 'expandir',
                                        header: scope.etiquetas.lbSubsistema,
                                        dataIndex: 'idestructurasubsist',
                                        width: 250,
                                        sortable: true,
                                        renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                                            if (record.data.fecha == null || record.data.fecha == "" || record.data.fecha == undefined) {
                                                return '<b><span style=color:red>' + value + '</span></b>';
                                            } else {
                                                return value;
                                            }
                                        }
                                    },
                                    {
                                        header: scope.etiquetas.lbTipoInc,
                                        dataIndex: 'incremento',
                                        width: 250,
                                        sortable: true
                                    },
                                    {
                                        header: scope.etiquetas.lbFechaSist,
                                        dataIndex: 'fecha',
                                        width: 110,
                                        sortable: true,
                                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                                    }],
                                bbar: new Ext.Cont.PagingToolbar({
                                    pageSize: 24,
                                    store: scope.stFechaPorSubsistemas,
                                    displayInfo: true,
                                    displayMsg: scope.etiquetas.lbDisplayMsg,
                                    emptyMsg: scope.etiquetas.lbEmptyMsg
                                })
                            })
                        ]
                    })]
            });
            this.winBuscar.show();
            this.winBuscar.center();
            this.winBuscar.maximize();
            this.winBuscar.doLayout();
            scope.noWindow = false;//se pone en false para indicar que la ventana fue abierta
            this.winBuscar.on('close', function () {
                scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
            });
        };

        scope.winfpSubsistemas = function (Mod) {
            var title = scope.etiquetas.lbWinAddFechaSubSys;
            var keyyyy = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (scope.isOpenW && Ext.getCmp('idbtnAceptarAdd') && !Ext.getCmp('idbtnAceptarAdd').disabled) {
                            Ext.getCmp('idbtnAceptarAdd').handler.call();
                        }
                        if (scope.isOpenW && Ext.getCmp('idbtnAceptarMod') && !Ext.getCmp('idbtnAceptarMod').disabled) {
                            Ext.getCmp('idbtnAceptarMod').handler.call();
                        }
                    }
                }
            ]);
            if (Mod) {
                title = scope.etiquetas.lbWinEditFechaSubSys;
            }
            scope.winInsNCl = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                layout: 'fit',
                title: title,
                width: 400,
                constrain: true,
                height: 250,
                resizable: false,
                keys: keyyyy,
                firstElement: scope.cmbSubSistemas,
                listeners: {
                    hide: function () {
                        scope.noWindow = true;
                    },
                    close: function () {
                        scope.noWindow = true;
                    }
                },
                buttons: (!Mod) ? [{
                    iconCls: 'cancelar',
                    id: 'idbtnWCancelar',
                    text: scope.etiquetas.lbBtnCancelar,
                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                    handler: function () {
                        scope.winInsNCl.hide();
                        scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
                    }
                },
                    this.btnAplicar = new Ext.Button({
                        tooltip: scope.etiquetas.lbBtnTooltipAplicar,
                        iconCls: 'aplicar',
                        id: 'idbtnWPAplicar',
                        disabled: true,
                        text: scope.etiquetas.lbBtnAplicar,
                        handler: function () {
                            scope.fnAdicionarFecha('apl');
                        }
                    }),
                    this.btnAceptar = new Ext.Button({
                        iconCls: 'aceptar',
                        id: 'idbtnAceptarAdd',
                        disabled: true,
                        text: scope.etiquetas.lbBtnAceptar,
                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                        handler: function () {
                            scope.fnAdicionarFecha();
                        }
                    })] : [{
                    iconCls: 'cancelar',
                    id: 'idbtnWPCancel',
                    text: scope.etiquetas.lbBtnCancelar,
                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                    handler: function () {
                        scope.winInsNCl.hide();
                        scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
                    }
                },
                    this.btnAceptar = new Ext.Button({
                        iconCls: 'aceptar',
                        id: 'idbtnAceptarMod',
                        disabled: true,
                        text: scope.etiquetas.lbBtnAceptar,
                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                        handler: function () {
                            scope.fnModificarFecha();
                            scope.btnModificar.disable();
                        }
                    })]
            });

            scope.lMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...'});
            scope.lMask.show();
            if (Mod) {
                Ext.Ajax.request({
                    url: scope.url + 'cargarDatosModf',
                    params: {
                        idestructurasubsisti: scope.smFechasSubsistemas.getSelected().data.idestructurasubsisti
                    },
                    method: 'POST',
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        scope.stSubsistemas.load({
                            callback: function () {
                                Ext.getCmp('cmbSubSistemas').setValue(scope.smFechasSubsistemas.getSelected().data.idestructurasubsisti);
                                Ext.getCmp('cmbSubSistemas').disable();
                                Ext.getCmp('cmbEjercicios').setValue(responseData.Ejercicio[0].idejercicio);
                                scope.stPeriodos.load({
                                    params: {
                                        idejercicio: responseData.Ejercicio[0].idejercicio
                                    },
                                    callback: function () {
                                        var fecha = scope.smFechasSubsistemas.getSelected().data.fecha;
                                        Ext.getCmp('cmbPeriodos').setValue(responseData.Periodo.idperiodo);
                                        scope.cmbPeriodos.enable();
                                        scope.dfDesde.setValue(null);
                                        scope.dfDesde.setMinValue(null);
                                        scope.dfDesde.setMaxValue(null);
                                        scope.dfDesde.setValue(fecha);
                                        scope.dfDesde.enable();
                                        scope.dfDesde.setMinValue(responseData.Periodo.inicio);
										fechaactual= new Date();
										fechaactual=fechaactual.format('d/m/Y');
										
										fechaaxuactual= fechaactual.split("/");
                                        fecha_aux = responseData.Periodo.fin.split("/");
                                        mesfindelperido = parseInt(fecha_aux[1]);
                                        mesperiodoactual= parseInt(fechaaxuactual[1]);
                                        if(mesperiodoactual == mesfindelperido )
                                        scope.dfDesde.setMaxValue(fechaactual);
                                        else
                                        scope.dfDesde.setMaxValue(responseData.Periodo.fin);
										
										                                        
										
                                        scope.lMask.hide();
                                    }
                                });
                            }
                        });
                        Ext.getCmp('cmbComportamiento').setValue(scope.smFechasSubsistemas.getSelected().data.incrementoc);
                        //Ext.getCmp('cmbComportamiento').disable();
                    }
                });
            } else {
                scope.fpSubsistemas.getForm().reset();
                scope.dfDesde.disable();
                scope.cmbPeriodos.disable();
                Ext.getCmp('cmbSubSistemas').enable();
                //Ext.getCmp('cmbComportamiento').enable();
                scope.stSubsistemas.load({
                    callback: function () {
                        scope.lMask.hide();
                        if (!scope.stSubsistemas.getCount() > 0) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelNoSub);
                            scope.winInsNCl.hide();
                            scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
                        }
                    }
                });

            }
            scope.winInsNCl.add(scope.fpSubsistemas);
            scope.winInsNCl.doLayout();
            scope.winInsNCl.show();
            scope.noWindow = false;//se pone en false para indicar que la ventana fue abierta
        };


        scope.fnSetAutomaticaManual = function (incremento) {
            if (!scope.smFechasSubsistemas.getSelected())
                mostrarMensaje(1, scope.etiquetas.lbMsgSelFila);
            else {
                mostrarMensaje(2, scope.etiquetas.lbMsgSelConf + ((incremento == 1) ? 'autom&aacute;tica' : 'manual') + scope.etiquetas.lbMsgSelConfContinuacion, fnAutomatizar);
            }
            function fnAutomatizar(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var sel = scope.fnBuscarSelecionados();
                    scope.loadMask.show();
                    Ext.Ajax.request({
                        url: scope.url + 'pasarautomaticamanual',
                        params: {
                            idfecha: sel,
                            incremento: incremento
                        },
                        waitMsg: scope.etiquetas.lbMsgModFecha,
                        method: 'POST',
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == -1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgDatosP);
                                scope.stFechas.reload();
                            }
                            scope.loadMask.hide();
                        }
                    });
                }
            }
        };
        scope.fnPasarFechaSubSys = function () {
            if (!scope.smFechasSubsistemas.getSelected())
                mostrarMensaje(1, scope.etiquetas.lbMsgSelFila);
            else {
                if (scope.smFechasSubsistemas.getSelections().length > 1)
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelPasarFecha, fnPasarFecha);
                else
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelPasarFecha, fnPasarFecha);
            }
            function fnPasarFecha(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var sel = scope.fnBuscarSelecionados();
                    Ext.Ajax.request({
                        url: scope.url + 'pasarfecha',
                        waitMsg: scope.etiquetas.lbMsgModFecha,
                        params: {
                            idfecha: sel,
                            version: scope.smFechasSubsistemas.getSelected().data.version,
                            dataset: Ext.encode(scope.smFechasSubsistemas.getSelected().data)
                        },
                        method: 'POST',
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgFechaMod);
                                    scope.stFechas.reload();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgFechasMod);
                                    scope.stFechas.reload();
                                    scope.loadMask.hide();
                                    break
                                case -6:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgValidacionPeriodo);
                                    scope.stFechas.reload();
                                    break
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    scope.stFechas.reload();
                                    scope.loadMask.hide();
                                    break;
                            }

                        }
                    });
                }
            }
        };

        scope.fnAdicionarFecha = function (apl) {
            if (scope.fpSubsistemas.getForm().isValid()) {
                scope.fpSubsistemas.getForm().submit({
                    url: scope.url + 'insertarfecha',
                    params: {
                        comportamiento: scope.cmbComportamiento.getRawValue()
                    },
                    waitMsg: scope.etiquetas.lbMsgRegFecha,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddFecha);
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgSubSysSelFecha);
                                scope.cmbSubSistemas.focus();
                                scope.cmbSubSistemas.markInvalid(scope.etiquetas.lbMsgSubSysSelFecha);
                                return;
                            //break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }
                        scope.fpSubsistemas.getForm().reset();
                        scope.stFechas.load();
                        scope.stSubsistemas.reload();
                        if (!scope.stSubsistemas.getCount() > 0) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelNoSub);
//                            scope.stFechas.reload();
                            scope.winInsNCl.hide();
                            scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
                        }
                        if (!apl) {
                            scope.winInsNCl.hide();
                            scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
                        }
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelVerificar);
            }

        };
        scope.fnModificarFecha = function (apl) {
            if (scope.fpSubsistemas.getForm().isValid()) {
                scope.fpSubsistemas.getForm().submit({
                    url: 'modificarfecha',
                    params: {
                        idfecha: scope.smFechasSubsistemas.getSelected().data.idfecha
                    },
                    waitMsg: scope.etiquetas.lbMsgModFecha,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgModificarFecha);
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgSubsistAperturado);
                                break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }
                        scope.fpSubsistemas.getForm().reset();
                        scope.stFechas.load();
                        scope.stSubsistemas.reload();
                        if (!scope.stSubsistemas.getCount() > 0) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelNoSub);
                            scope.stFechas.reload();
                            scope.winInsNCl.hide();
                            scope.noWindow = true;
                        }
                        scope.winInsNCl.hide();
                        scope.noWindow = true;
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelVerificar);
            }

        };
        scope.fnBuscarSelecionados = function () {
            var id = "";
            var cant = scope.smFechasSubsistemas.getSelections().length;
            for (var i = 0; i < cant; i++)
                if (i < cant - 1)
                    id += scope.smFechasSubsistemas.getSelections()[i].get('idfecha') + ",";
                else
                    id += scope.smFechasSubsistemas.getSelections()[i].get('idfecha');
            return id;
        };
        scope.fnBuscarFechas = function (idperiodod) {
            Ext.Ajax.request({
                url: scope.url + 'buscarFechas',
                params: {
                    idperiodo: idperiodod
                },
                method: 'POST',
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    scope.dfDesde.setValue(responseData.inicio);
                    scope.dfDesde.enable();
                    scope.dfDesde.setMinValue(responseData.inicio);
					fechaactual= new Date();
					fechaactual=fechaactual.format('d/m/Y');
					fechaaxuactual= fechaactual.split("/");
					fecha_aux = responseData.fin.split("/");
					mesfindelperido = parseInt(fecha_aux[1]);
					mesperiodoactual= parseInt(fechaaxuactual[1]);
					if(mesperiodoactual == mesfindelperido )
					scope.dfDesde.setMaxValue(fechaactual);
					else
					scope.dfDesde.setMaxValue(responseData.fin);
                    //scope.dfDesde.setMaxValue(responseData.fin);
					//scope.dfDesde.setMaxValue(fechaactual);
                }
            });
        };
//        scope.stSubsistemas.on({
//            beforeload: function(store, options) {
//                scope.lMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Cargando...', store: store});
//                scope.lMask.show();
//            },
//            load: function() {
//                if (scope.lMask) {
//                    scope.lMask.hide();
//                }
//            }
//        });
        scope.knowIfisCont = function () {
            Ext.each(Ext.getCmp('gpFechasSubsistemas').getStore().data.items, function (item, i) {
                if (item.data.incrementoc === '0') {
                    scope.cont = true;
                    return false;
                } else
                    scope.cont = false;
            });
        };
    }
};
function changevalue() {
    var changed = false,
        selected = Ext.getCmp('gpFechasSubsistemas').getSelectionModel().getSelected();
    if(!selected){
        return false;
    }
    var newvalue = scope.fpSubsistemas.getForm().getValues();
    var oldvalue = selected.data;
    for (k in newvalue) {
        if (newvalue[k] != oldvalue[k]) {
            changed = true;
            break;
        }
    }
    return changed;
}
Ext.Configuracion_General_Parametros.Fecha = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.QuickTips.init();
        scope = this;
        scope.windowOp = false;
        scope.etiquetas = Conf.Fecha.etiquetas;
        scope.lMask = undefined;
        scope.url = '/configuracion/fecha/index.php/gestionarfecha/';
        scope.perfil = window.parent.UCID.portal.perfil;
        scope.config = config;
        scope.hideBtns = Conf.CargaInicial ? false : true;
        actionValidate.validate();

        ///...variables...///
        scope.noWindow = true; //se pone en true para indicar que la ventana fue cerrada
        scope.idestructura;
        scope.winInsNCl;
        scope.loadMask;
        scope.model = Ext.Configuracion_General_Parametros.FechaModel;
        scope.model.init(scope);
        scope.controller = Ext.Configuracion_General_Parametros.FechaController;
        scope.controller.init(scope);
        scope.init(scope);
    },
    init: function (scope) {
        scope.loadMask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Modificando fecha ...'
        });

        scope.btnConFechaSubSys = new Ext.Button({
            id: 'btnAddFechaSub',
            iconCls: 'adicionar',
            hidden: scope.hideBtns,
            text: scope.etiquetas.lbBtnConfFechaSubSys,
            tooltip: scope.etiquetas.lbTtConfFechaSubSys,
            handler: function () {
                scope.winfpSubsistemas();
            }
        });

        scope.btnModificar = new Ext.Button({
            id: 'btnModFechaSub',
            iconCls: 'modificar',
            hidden: scope.hideBtns,
            text: scope.etiquetas.lbModificar,
            tooltip: scope.etiquetas.lbTtModificarFechaSubsys,
            disabled: true,
            handler: function () {
                scope.winfpSubsistemas(true);
            }
        });

        scope.btnAyuda = new Ext.Button({
            id: 'btnAyudaFecha',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.lbTtAyuda/*,
             handler: function() {
             help.show(scope.etiquetas.lnTitleWindAyuda, 'CG/gestionar_fecha');
             }*/
        });

        scope.menuItemAutomatico = new Ext.menu.Item({
            id: 'mFechaAutomatica',
            text: scope.etiquetas.lbAutomatico,
            hidden: true,
            //icon: scope.perfil.dirImg + 'calcular.png'
            iconCls:'calcular'
        });
        scope.menuItemManueal = new Ext.menu.Item({
            id: 'mFechaManual',
            text: scope.etiquetas.lbManual,
            hidden: true,
            //icon: scope.perfil.dirImg + 'aplicar.png'
            iconCls:'aplicar'
        });
        scope.menuItemPasarFecha = new Ext.menu.Item({
            id: 'mPasarFecha',
            text: scope.etiquetas.lbPasarFecha,
            hidden: true,
            //icon: scope.perfil.dirImg + 'cambiar.png'
            iconCls:'cambiar'
        });
        scope.menuContextual = new Ext.menu.Menu({
            floating: false,
            shadow: "drop",
            hideBorders: true,
            items: [scope.menuItemAutomatico, scope.menuItemManueal, scope.menuItemPasarFecha]
        });

        scope.menuItemAutomatico.on('click', function () {
            scope.fnSetAutomaticaManual(1);
        });

        scope.menuItemManueal.on('click', function () {
            scope.fnSetAutomaticaManual(2);
        });

        scope.menuItemPasarFecha.on('click', function () {
            scope.fnPasarFechaSubSys();
        });
        scope.smFechasSubsistemas = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpFechasSubsistemas').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpFechasSubsistemas').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        scope.gpFechasSubsistemas = new Ext.grid.GridPanel({
            id: 'gpFechasSubsistemas',
            frame: false,
            border: false,
            iconCls: 'icon-grid',
            autoExpandColumn: 'expandir',
            loadMask: scope.etiquetas.lbMsgCargando,
            width: 450,
            store: scope.stFechas,
            sm: scope.smFechasSubsistemas,
            floating: false,
            viewConfig: {
                forceFit: true
            },
            columns: [
                {
                    dataIndex: 'idfecha',
                    hidden: true,
                    width: 0,
                    hideable: false
                },
                {
                    id: 'expandir',
                    header: scope.etiquetas.lbSubsistema,
                    dataIndex: 'idestructurasubsist',
                    width: 250,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbTipoInc,
                    dataIndex: 'incremento',
                    width: 250,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbFechaSist,
                    dataIndex: 'fecha',
                    width: 110,
                    sortable: true,
                    renderer: function (v, m, r) {
                        return v.format('d/m/Y');
                    }
                },
                {
                    hidden: true,
                    dataIndex: 'precedencia',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'incrementoc',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'idestructurasubsisti',
                    hideable: false
                }],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 24,
                store: scope.stFechas,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                emptyMsg: scope.etiquetas.lbEmptyMsg,
                firstText: scope.etiquetas.lbPrimeraPagina,
                lastText: scope.etiquetas.lbUltimaPagina
            })
        });

        var tbar = [scope.btnConFechaSubSys, scope.btnModificar, /*scope.btnBuscar,*/ '->'];
        if (!(Conf && Conf.CargaInicial && Conf.CargaInicial.Vista && Conf.CargaInicial.Vista.cmbOrgano)) {
            scope.cmbOrganos = new Ext.CmbOrganos({
                idioma: scope.etiquetas,
                gridStore: scope.stFechas
            });
            tbar.push(scope.cmbOrganos);
        }
        tbar.push(scope.btnAyuda);

        scope.panel1 = new Ext.Panel({
            layout: 'fit',
            loadMask: scope.etiquetas.lbMsgCargando,
            items: [scope.gpFechasSubsistemas],
            tbar: tbar
        });

        scope.fpSubsistemas = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:15px 15px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [
                        scope.cmbSubSistemas = new Ext.form.ComboBox({
                            id: 'cmbSubSistemas',
                            fieldLabel: scope.etiquetas.lbSubsistema,
                            emptyText: scope.etiquetas.lbEmptyMsgSel,
                            blankText: scope.etiquetas.lbCampVacio,
                            forceSelection: true,
                            allowBlank: false,
                            typeAhead: true,
                            store: scope.stSubsistemas,
                            resizable: true,
                            anchor: '85%',
                            mode: 'local',
                            name: 'subsistema',
                            triggerAction: 'all',
                            displayField: 'denominacion',
                            valueField: 'idestructurasubsist',
                            hiddenName: 'idestructurasubsisti',
                            enableKeyEvents: true,
                            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                            listeners: {
                                keyup: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                select: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                focus: function () {
                                    scope.comprobarVentanaFecha();
                                }
                            }
                        })]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [
                        scope.cmbEjercicios = new Ext.form.ComboBox({
                            id: 'cmbEjercicios',
                            fieldLabel: scope.etiquetas.lbEjercicio,
                            emptyText: scope.etiquetas.lbEmptyMsgSel,
                            blankText: scope.etiquetas.lbCampVacio,
                            forceSelection: true,
                            allowBlank: false,
                            typeAhead: true,
                            store: scope.stEjercicios,
                            anchor: '85%',
                            mode: 'local',
                            name: 'ejercicio',
                            triggerAction: 'all',
                            displayField: 'nombre',
                            valueField: 'idejercicio',
                            hiddenName: 'idejercicio',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                select: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                focus: function () {
                                    scope.comprobarVentanaFecha();
                                }
                            }
                        })]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [
                        scope.cmbPeriodos = new Ext.form.ComboBox({
                            id: 'cmbPeriodos',
                            fieldLabel: scope.etiquetas.lbPeriodo,
                            emptyText: scope.etiquetas.lbEmptyMsgSel,
                            blankText: scope.etiquetas.lbCampVacio,
                            forceSelection: true,
                            allowBlank: false,
                            typeAhead: true,
                            store: scope.stPeriodos,
                            anchor: '85%',
                            mode: 'local',
                            name: 'idperiodo',
                            triggerAction: 'all',
                            displayField: 'nombre',
                            valueField: 'idperiodo',
                            hiddenName: 'idperiodo',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                select: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                focus: function () {
                                    scope.comprobarVentanaFecha();
                                }
                            }
                        })]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [
                        scope.dfDesde = new Ext.form.DateField({
                            id: 'dfDesde',
                            blankText: scope.etiquetas.lbCampVacio,
                            allowBlank: true,
                            disabled: true,
                            dayNames: ["Domingo", "Lunes", "Martes", "Mi&eacute;coles", "Jueves", "Viernes", "S&aacute;bado"],
                            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
                            todayText: "Hoy",
                            //minValue: new Date(),
                            minText: scope.etiquetas.lbMinText,
                            maxText: scope.etiquetas.lbMaxText,
                            emptyText: scope.etiquetas.lbEmptyMsgSel,
                            invalidText: scope.etiquetas.lbMsgSelForFecha,
                            fieldLabel: scope.etiquetas.lbFechaC,
                            format: 'd/m/Y',
                            displayField: 'state',
                            name: 'desde',
                            anchor: '85%',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                change: function () {
                                    scope.comprobarVentanaFecha();
                                }
                            }

                        })]
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    items: [
                        scope.cmbComportamiento = new Ext.form.ComboBox({
                            id: 'cmbComportamiento',
                            fieldLabel: scope.etiquetas.lbComportamiento,
                            emptyText: scope.etiquetas.lbEmptyMsgSel,
                            blankText: scope.etiquetas.lbCampVacio,
                            forceSelection: true,
                            allowBlank: false,
                            typeAhead: true,
                            store: scope.stComportamiento,
                            anchor: '85%',
                            mode: 'local',
                            name: 'comportamiento',
                            triggerAction: 'all',
                            displayField: 'Comportamiento',
                            valueField: 'idcomport',
                            hiddenName: 'idcomport',
                            enableKeyEvents: true,
                            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                            listeners: {
                                keyup: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                select: function () {
                                    scope.comprobarVentanaFecha();
                                },
                                focus: function () {
                                    scope.comprobarVentanaFecha();
                                }
                            }
                        })]
                }]
            }]
        });

        scope.cmbPeriodos.disable();

        scope.gpFechasSubsistemas.on({
            click: function () {
                filasSeleccionadas = scope.gpFechasSubsistemas.getSelectionModel().getCount();
                if (filasSeleccionadas === 0) {
                    scope.btnModificar.disable();
                }
            }, rowcontextmenu: function (grid, rowIndex, eventObject) {
                scope.knowIfisCont();
                eventObject.stopEvent();
                var record = scope.stFechas.getAt(rowIndex);
                scope.menuItemAutomatico, scope.menuItemManueal, scope.menuItemPasarFecha
                if (record.data.incrementoc === '2') {
                    scope.menuItemManueal.hide();
                    scope.menuItemAutomatico.show();
                    scope.menuItemPasarFecha.show();
                } else if (record.data.incrementoc === '1') {
                    scope.menuItemAutomatico.hide();
                    scope.menuItemPasarFecha.hide();
                    scope.menuItemManueal.show();
                }
                if (scope.smFechasSubsistemas.getSelected())
                    scope.menuContextual.showAt(eventObject.getXY());
                else
                    scope.menuContextual.hide();
                if (scope.menuItemAutomatico.isVisible() && !actionValidate.actions[scope.menuItemAutomatico.id]) {
                    scope.menuItemAutomatico.hide();
                }
                if (scope.menuItemManueal.isVisible() && !actionValidate.actions[scope.menuItemManueal.id]) {
                    scope.menuItemManueal.hide();
                }
                if (scope.menuItemPasarFecha.isVisible() && !actionValidate.actions[scope.menuItemPasarFecha.id]) {
                    scope.menuItemPasarFecha.hide();
                }
                if ((record.data.incrementoc === '1' && !scope.menuItemManueal.isVisible()) || (record.data.incrementoc === '2' && !scope.menuItemManueal.isVisible() && !scope.menuItemPasarFecha.isVisible())) {
                    scope.menuContextual.hide();
                }
            }

        });


        scope.smFechasSubsistemas.on('rowselect', function () {
            scope.btnModificar.enable();
        });

        scope.cmbEjercicios.on('select', function () {
            scope.cmbPeriodos.disable();
            scope.dfDesde.disable();
            scope.cmbPeriodos.setRawValue();
            scope.cmbPeriodos.setValue();
            scope.dfDesde.setValue(null);
            scope.dfDesde.setMinValue(null);
            scope.dfDesde.setMaxValue(null);
            if (scope.stEjercicios.getCount() > 0) {
                var myMask = new Ext.LoadMask(scope.winInsNCl.body, {msg: "Cargando per&iacute;odos..."});
                myMask.show();
                scope.stPeriodos.load({
                    params: {
                        idejercicio: scope.cmbEjercicios.getValue()
                    },
                    callback: function () {
                        myMask.hide();
                    }
                });
                scope.cmbPeriodos.enable();
            }
        });

        scope.cmbPeriodos.on('select', function () {
            if (scope.stPeriodos.getCount() > 0) {
                scope.dfDesde.disable();
                scope.fnBuscarFechas(scope.cmbPeriodos.getValue());
            }
        });

        scope.panelContainer = new Ext.Panel({
            layout: 'fit',
            frame: false,
            border: false,
            floating: false,
            keys: scope.keysFecha = new Ext.KeyMap(Ext.getBody(), [
                {//configurar fecha-subsistema
                    key: "i",
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('btnAddFechaSub').isVisible() && scope.noWindow) {
                            Ext.getCmp('btnAddFechaSub').handler.call();
                        }
                    }
                },
                {
                    key: "m",
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('btnModFechaSub').isVisible() && scope.noWindow && !scope.btnModificar.disabled) {
                            Ext.getCmp('btnModFechaSub').handler.call();
                        }
                    }
                }/*,
                 {//Ayuda
                 key: "h",
                 alt: true,
                 fn: function() {//muestra la ventana modificar
                 if (scope.noWindow) {
                 help.show(scope.etiquetas.lnTitleWindAyuda, 'CG/gestionar_fecha');
                 }
                 }
                 }*/
            ]),
            items: [scope.panel1]
        });

        scope.comprobarVentanaFecha = function () {
            if (scope.fpSubsistemas.getForm().isValid()) {
                if (Ext.getCmp('idbtnWPAplicar')) {
                    Ext.getCmp('idbtnWPAplicar').enable();
                }
                if (Ext.getCmp('idbtnAceptarMod')) {
                    if (changevalue()) {
                        Ext.getCmp('idbtnAceptarMod').enable();
                    }
                    else {
                        Ext.getCmp('idbtnAceptarMod').disable();
                    }
                }
                if (Ext.getCmp('idbtnAceptarAdd')) {
                    Ext.getCmp('idbtnAceptarAdd').enable();
                }
            }
            else {
                if (Ext.getCmp('idbtnWPAplicar')) {
                    Ext.getCmp('idbtnWPAplicar').disable();
                }
                if (Ext.getCmp('idbtnAceptarAdd')) {
                    Ext.getCmp('idbtnAceptarAdd').disable();
                }
                if (Ext.getCmp('idbtnAceptarMod')) {
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
        };

        Ext.apply(scope.config);
        this.items = scope.panelContainer;
        Ext.Configuracion_General_Parametros.Fecha.superclass.constructor.call(this, scope.config);
    }
});
Ext.reg('fecha', Ext.Configuracion_General_Parametros.Fecha);

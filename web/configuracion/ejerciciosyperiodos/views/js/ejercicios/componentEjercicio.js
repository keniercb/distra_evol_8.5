/**
 * Gestion de Ejercicios(version componente)
 *
 * @author Ing. Alexis Rodriguez Reyes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.Configuracion_General_Nomencladores
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Parametros');

Ext.Configuracion_General_Parametros.EjerciciosModel = {
    init: function(scope) {
        scope.dsEjercicioContable = new Ext.data.Store({
            url: scope.url + 'obtenerejercicios',
            baseParams: {
                start: 0,
                limit: 20,
                filter: null,
                filtro:null
            },
            sortInfo: {
                field: "antecesor",
                direction: "ASC"
            },
            //remoteSort: true,
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idejercicio"
            }, [{
                    name: 'idejercicio'

                }, {
                    name: 'nombre'
                }, {
                    mapping: 'inicio',
                    name: 'dfDesde'
                }, {
                    mapping: 'fin',
                    name: 'dfHasta'
                }, {
                    name: 'anonatural',
                    type: 'bool'
                }, {
                    name: 'version'
                }, {
                    name: 'antecesor'
                }])
        });


        scope.dsPeriodoContable = new Ext.data.Store({
            url: scope.url + 'obtenerperiodos',
            baseParams: {
                start: 0,
                limit: 13,
                filter: null
            },
            //remoteSort: true,
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idperiodo"
            }, [{
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }, {
                    name: 'idejercicio'
                }, {
                    name: 'version'
                }])
        });
    }
};

Ext.Configuracion_General_Parametros.EjerciciosController = {
    init: function(scope) {
        scope.winFpRegEjercicios = function(opcion) {
            scope.windowopen = true;
            switch (opcion) {
                case 'Ins':
                    if (!scope.winInsNCl) {
                        scope.winInsNCl = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            constrain:true,
                            title: scope.etiquetas.lbTitWinInsEst,
                            width: 290,
                            height: 200,
                            resizable: false,
                            defaultButton: 'idbtnWCancelar',
                            firstElement: scope.tfNombreEjercicio,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idbtnWCancelar',
                                    text: scope.etiquetas.lbBtnCancelar,
                                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                    handler: function() {
                                        scope.winInsNCl.hide();
                                    }
                                }, {
                                    iconCls: 'aplicar',
                                    id: 'idbtnWAplicar',
                                    disabled : true,
                                    text: scope.etiquetas.lbBtnAplicar,
                                    tooltip: scope.etiquetas.lbBtnTooltipAplicar,
                                    handler: function() {
                                        scope.adicionarEjercicios('apl', false);
                                    }
                                }, {
                                    iconCls: 'aceptar',
                                    id: 'idbtnWAdd',
                                    disabled : true,
                                    text: scope.etiquetas.lbBtnAceptar,
                                    tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                    handler: function() {
                                        scope.adicionarEjercicios('', false);
                                    }
                                }],
                            listeners: {
                                render: function() {
                                    scope.winInsNCl.focus();
                                },
                                hide: function() {
                                    scope.isWinOpenInsEjercicio = false;
                                    scope.windowopen = false;
                                    /*Ext.getCmp('dfDesde').clearInvalid();
                                    Ext.getCmp('dfHasta').clearInvalid();*/
                                    scope.btnAddEjercicio.focus();
                                    Ext.getCmp('idbtnWAdd').disable();
                                    Ext.getCmp('idbtnWAplicar').disable();
                                },
                                close: function() {
                                    scope.isWinOpenInsEjercicio = false;
                                    scope.windowopen = false;
                                    Ext.getCmp('idbtnWAdd').disable();
                                    Ext.getCmp('idbtnWAplicar').disable();
                                },
                                show: function() {
                                    scope.isWinOpenInsEjercicio = true;
                                    scope.fSetValuesFechasE('ins');
                                }
                            },
                            keys: scope.keyssM = new Ext.KeyMap(Ext.getBody(), [
                                {
                                    key: Ext.EventObject.ENTER,
                                    fn: function() {
                                        if(scope.winInsNCl.isVisible() && !Ext.getCmp('idbtnWAdd').disabled){
                                            Ext.getCmp('idbtnWAdd').handler.call();
                                        }
                                    }
                                }
                            ])
                        });
                    }
                    scope.modificar = false;
                    scope.fpRegEjercicios.getForm().reset();
                    scope.winInsNCl.show();
                    scope.winInsNCl.add(scope.fpRegEjercicios);
                    scope.winInsNCl.center();
                    scope.winInsNCl.doLayout();
                    break;
                case 'Mod':
                    if (!scope.smEjercicios.getSelected()) {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelEjeCon);
                    } else {
                        if (scope.smEjercicios.getSelected().data.anonatural == 1) {
                            scope.dfInicioEjercicio.disable();
                            scope.dfFinEjercicio.disable();
                        }
                        if (!scope.winModNCl) {
                            scope.winModNCl = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                constrain:true,
                                firstElement: scope.tfNombreEjercicio,
                                title: scope.etiquetas.lbTitWinModEst,
                                width: 290,
                                height: 200,
                                resizable: false,
                                defaultButton: 'idbtnWCancel',
                                buttons: [{
                                        iconCls: 'cancelar',
                                        id: 'idbtnWCancel',
                                        text: scope.etiquetas.lbBtnCancelar,
                                        tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                        handler: function() {
                                            scope.winModNCl.hide();
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        id: 'idbtnWMod',
                                        disabled : true,
                                        text: scope.etiquetas.lbBtnAceptar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                        handler: function() {
                                            scope.VerificarDataEjercicio();
                                        }
                                    }],
                                listeners: {render: function() {
                                        scope.winModNCl.focus();
                                    },
                                    hide: function() {
                                        scope.isWinOpenModEjercicio = false;
                                        Ext.getCmp('idbtnWMod').disable();
                                        scope.windowopen = false;
                                        /*Ext.getCmp('dfDesde').clearInvalid();
                                        Ext.getCmp('dfHasta').clearInvalid();*/
                                        scope.btnAddEjercicio.focus();
                                    },
                                    close: function() {
                                        scope.isWinOpenModEjercicio = false;
                                        scope.windowopen = false;
                                        Ext.getCmp('idbtnWMod').disable();
                                    },
                                    show: function() {
                                        scope.isWinOpenModEjercicio = true;
                                        /*Ext.getCmp('dfDesde').clearInvalid();
                                        Ext.getCmp('dfHasta').clearInvalid();*/
                                    }
                                },
                                keys: scope.keyssM = new Ext.KeyMap(Ext.getBody(), [
                                    {
                                        key: Ext.EventObject.ENTER,
                                        fn: function() {
                                            if(scope.winModNCl.isVisible() && !Ext.getCmp('idbtnWMod').disabled){
                                                Ext.getCmp('idbtnWMod').handler.call();
                                            }
                                        }
                                    }
                                ])
                            });
                        }
                        scope.modificar = true;
                        scope.winModNCl.show();

                        if (scope.smEjercicios.getSelected().data.anonatural == 1) {
                            scope.tfNombreEjercicio.disable();
                        } else {
                            scope.tfNombreEjercicio.enable();
                        }
                        scope.fSetValuesFechasE();
                        scope.winModNCl.add(scope.fpRegEjercicios);
                        scope.winModNCl.doLayout();
                        scope.fpRegEjercicios.getForm().reset();
                        scope.fpRegEjercicios.getForm().loadRecord(scope.smEjercicios.getSelected());
                        //scope.tfNombreEjercicio.setValue(Ext.Configuracion_General_Util.deleteColorYelow(scope.tfNombreEjercicio.getValue()));
                        scope.fpRegEjercicios.getForm().setValues({
                            'nombre': scope.smEjercicios.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                            'dfDesde': scope.smEjercicios.getSelected().data.dfDesde.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                            'dfHasta': scope.smEjercicios.getSelected().data.dfHasta.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                        });
                        //scope.tfNombreEjercicio.setValue(scope.tfNombreEjercicio.getValue().replace(/\<\/span\>/g, ''));
                        /*Ext.getCmp('dfDesde').clearInvalid();
                        Ext.getCmp('dfHasta').clearInvalid();*/
                    }
                    break;
            }
        };

        scope.isWinOpenInsEjercicio = false;
        scope.isWinOpenModEjercicio = false;
        scope.activarBotonesWinEjercicio = function() {
            if (scope.fpRegEjercicios.getForm().isValid()) {
                if (scope.isWinOpenInsEjercicio) {
                    Ext.getCmp('idbtnWAdd').enable();
                    Ext.getCmp('idbtnWAplicar').enable();
                } else if (scope.isWinOpenModEjercicio) {

                    if (scope.smEjercicios.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegEjercicios.getForm().getValues().nombre
                        || scope.smEjercicios.getSelected().data.dfDesde.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegEjercicios.getForm().getValues().dfDesde
                        || scope.smEjercicios.getSelected().data.dfHasta.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegEjercicios.getForm().getValues().dfHasta) {
                        Ext.getCmp('idbtnWMod').enable();
                    } else {
                        Ext.getCmp('idbtnWMod').disable();
                    }
                }
            } else {
                if (scope.isWinOpenInsEjercicio) {
                    Ext.getCmp('idbtnWAdd').disable();
                    Ext.getCmp('idbtnWAplicar').disable();
                } else if (scope.isWinOpenModEjercicio) {
                    Ext.getCmp('idbtnWMod').disable();
                }
            }
        };

        scope.winFpRegPeriodos = function(opcion) {
            scope.windowopen = true;
            switch (opcion) {
                case 'Ins':
                    if (!scope.smEjercicios.getSelected())
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelEjeCon);
                    else
                    if (scope.smEjercicios.getSelections().length == 1) {
                        if (scope.smEjercicios.getSelected().data.anonatural == 1)
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelInsetar);
                        else {
                            if (!scope.winInsNClA) {
                                scope.winInsNClA = new Ext.Window({
                                    modal: true,
                                    closeAction: 'hide',
                                    layout: 'fit',
                                    title: scope.etiquetas.lbTitAdic,
                                    constrain:true,
                                    width: 290,
                                    height: 200,
                                    resizable: false,
                                    defaultButton: 'idbtnWPCancelar',
                                    firstElement: scope.tfNombrePeriodo,
                                    buttons: [{
                                            iconCls: 'cancelar',
                                            id : 'idbtnWPCancelar',
                                            text: scope.etiquetas.lbBtnCancelar,
                                            tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                            handler: function() {
                                                scope.winInsNClA.hide();
                                            }
                                        },
                                        {
                                            iconCls: 'aplicar',
                                            id : 'idbtnWPAplicar',
                                            disabled : true,
                                            text: scope.etiquetas.lbBtnAplicar,
                                            tooltip: scope.etiquetas.lbBtnTooltipAplicar,
                                            handler: function() {
                                                scope.adicionarPeriodos('apl');
                                            }
                                        },
                                        {
                                            iconCls: 'aceptar',
                                            id: 'idbtnAceptarAdd',
                                            disabled : true,
                                            text: scope.etiquetas.lbBtnAceptar,
                                            tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                            handler: function() {
                                                scope.adicionarPeriodos();
                                            }
                                        }],
                                    listeners: {
                                        hide: function() {
                                            scope.windowopen = false;
                                            scope.isWinOpenInsPeriodos = false;
                                            scope.btnAddPeriodo.focus();
                                            Ext.getCmp('idbtnAceptarAdd').disable();
                                            Ext.getCmp('idbtnWPAplicar').disable();
                                        },
                                        close: function() {
                                            scope.windowopen = false;
                                            scope.isWinOpenInsPeriodos = false;
                                            Ext.getCmp('idbtnAceptarAdd').disable();
                                            Ext.getCmp('idbtnWPAplicar').disable();
                                        }, render: function() {
                                            scope.winInsNClA.focus();
                                        },
                                        show: function(){
                                            scope.isWinOpenInsPeriodos = true;
                                        }
                                    }/*,
                                    keys: scope.keyssM = new Ext.KeyMap(Ext.getBody(), [
                                        {
                                            key: Ext.EventObject.ENTER,
                                            fn: function() {
                                                if(scope.winInsNClA.isVisible() && !Ext.getCmp('idbtnAceptarAdd').disabled){
                                                    Ext.getCmp('idbtnAceptarAdd').handler.call();
                                                }
                                            }
                                        }, {
                                            key: 'p',
                                            ctrl: true,
                                            alt: true,
                                            fn: function() {
                                                if(scope.winInsNClA.isVisible() && !Ext.getCmp('idbtnWPAplicar').disabled){
                                                    Ext.getCmp('idbtnWPAplicar').handler.call();
                                                }
                                            }
                                        }, {
                                            key: 'x',
                                            alt: true,
                                            fn: function() {
                                                if(scope.winInsNClA.isVisible()){
                                                    Ext.getCmp('idbtnWPCancelar').handler.call();
                                                }
                                            }
                                        }, {
                                            key: 'x',
                                            ctrl: true,
                                            alt: true,
                                            fn: function() {
                                                if(scope.winInsNClA.isVisible()){
                                                    scope.winInsNClA.hide();
                                                }
                                            }
                                        }
                                    ])*/
                                });
                            }
                            scope.fpRegPeriodos.getForm().reset();
                            scope.winInsNClA.show();
                            scope.PosicionarFecha('ins');
                            scope.winInsNClA.add(scope.fpRegPeriodos);
                            scope.winInsNClA.doLayout();
                        }
                    } else
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelSingEjeCon);
                    break;
                case 'Mod':
                    if (!(scope.smPeriodos.getSelected() && scope.smEjercicios.getSelected()))
                    {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelPerCon);
                    }
                    else if (scope.smEjercicios.getSelections().length > 1) {
                        scope.btnDelPeriodo.enable();
                        scope.btnModPeriodo.disable();
                    }else{
                    if (!scope.winModNClA) {
                            scope.winModNClA = new Ext.Window({
                                id: 'winModNClA',
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                constrain:true,
                                title: scope.etiquetas.lbTitMod,
                                width: 290,
                                height: 200,
                                resizable: false,
                                defaultButton: 'idbtnWPCancel',
                                firstElement: scope.tfNombrePeriodo,
                                buttons: [{
                                        iconCls: 'cancelar',
                                        id : 'idbtnWPCancel',
                                        text: scope.etiquetas.lbBtnCancelar,
                                        tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                        handler: function() {
                                            scope.winModNClA.hide();
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        id: 'idbtnAceptarMod',
                                        disabled: true,
                                        text: scope.etiquetas.lbBtnAceptar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                        handler: function() {
                                            scope.VerificarDataPeriodo();
                                        }
                                    }],
                                listeners: {
                                    hide: function() {
                                        scope.windowopen = false;
                                        scope.isWinOpenModPeriodos = false;
                                        scope.btnAddPeriodo.focus();
                                        Ext.getCmp('idbtnAceptarMod').disable();
                                    },
                                    close: function() {
                                        scope.windowopen = false;
                                        scope.isWinOpenModPeriodos = false;
                                        scope.btnAddPeriodo.focus();
                                        Ext.getCmp('idbtnAceptarMod').disable();
                                    }, render: function() {
                                        scope.winModNClA.focus();
                                    },
                                    show : function(){
                                        scope.isWinOpenModPeriodos = true;
                                        scope.PosicionarFecha();
                                        scope.fpRegPeriodos.getForm().loadRecord(scope.smPeriodos.getSelected());
                                        scope.fpRegPeriodos.getForm().setValues({
                                            'nombre': scope.smPeriodos.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                                            'inicio': scope.smPeriodos.getSelected().data.inicio.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                                            'fin': scope.smPeriodos.getSelected().data.fin.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                                        });
                                    }
                                }/*,
                                keys: scope.keyssM = new Ext.KeyMap(Ext.getBody(), [
                                    {
                                        key: Ext.EventObject.ENTER,
                                        fn: function() {
                                            if(scope.winModNClA.isVisible() && !Ext.getCmp('idbtnAceptarMod').disabled){
                                                Ext.getCmp('idbtnAceptarMod').handler.call();
                                            }
                                        }
                                    }, {
                                        key: 'x',
                                        alt: true,
                                        fn: function() {
                                            if(scope.winModNClA.isVisible()){
                                                Ext.getCmp('idbtnWPCancel').handler.call();
                                            }
                                        }
                                    }, {
                                        key: 'x',
                                        ctrl: true,
                                        alt: true,
                                        fn: function() {
                                            if(scope.winModNClA.isVisible()){
                                                scope.winModNClA.hide();
                                            }
                                        }
                                    }
                                ])*/
                            });

                        }
                        //scope.fpRegPeriodos.getForm().reset();
                        scope.winModNClA.add(scope.fpRegPeriodos);
                        scope.winModNClA.doLayout();
                        scope.winModNClA.show();

                        /*
                        scope.fpRegPeriodos.getForm().reset();
                        scope.winModNClA.show();
                        scope.PosicionarFecha();
                        //scope.fResetValuesFecha(scope.dfInicioPeriodo, scope.dfFinPeriodo);
                        scope.fSetValuesFechas(scope.smEjercicios.getSelected().data.dfDesde, scope.smEjercicios.getSelected().data.dfHasta);
                        scope.setDateRangePeriodos(scope.smPeriodos.getSelected().data.inicio, scope.smPeriodos.getSelected().data.fin);
                        scope.fpRegPeriodos.getForm().loadRecord(scope.smPeriodos.getSelected());
                        scope.winModNClA.add(scope.fpRegPeriodos);
                        scope.winModNClA.doLayout();*/
                        /*scope.dfInicioPeriodo.clearInvalid();
                        scope.dfFinPeriodo.clearInvalid();*/
                    } break;
            }
        };

        scope.isWinOpenInsPeriodos = false;
        scope.isWinOpenModPeriodos = false;
        scope.activarBotonesWinPeriodos = function() {
            if (scope.fpRegPeriodos.getForm().isValid()) {
                if (scope.isWinOpenInsPeriodos) {
                    Ext.getCmp('idbtnAceptarAdd').enable();
                    Ext.getCmp('idbtnWPAplicar').enable();
                } else if (scope.isWinOpenModPeriodos) {
                    if (scope.smPeriodos.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegPeriodos.getForm().getValues().nombre
                        || scope.smPeriodos.getSelected().data.inicio.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegPeriodos.getForm().getValues().inicio
                        || scope.smPeriodos.getSelected().data.fin.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != scope.fpRegPeriodos.getForm().getValues().fin) {
                        Ext.getCmp('idbtnAceptarMod').enable();
                    } else {
                        Ext.getCmp('idbtnAceptarMod').disable();
                    }
                }
            } else {
                if (scope.isWinOpenInsPeriodos) {
                    Ext.getCmp('idbtnAceptarAdd').disable();
                    Ext.getCmp('idbtnWPAplicar').disable();
                } else if (scope.isWinOpenModPeriodos) {
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
        };

       /* scope.BuscarIndexPeriod = function(idp)
        {
            for (var i = 0; i < scope.dsPeriodoContable.getCount(); i++)
            {
                if (scope.dsPeriodoContable.getAt(i).data.idperiodo == idp)
                    return i;
            }
            return -1;
        };*/
        scope.PosicionarFecha = function(mode) {
            Ext.Ajax.request({
                url: scope.url + 'intervalosFechaUtilizadosPeriodo',
                params: {
                    idejercicio: scope.smEjercicios.getSelected().data.idejercicio,
                    idperiodo: mode == 'ins' ? null : scope.smPeriodos.getSelected().data.idperiodo
                },
                method: 'POST',
                callback: function(options, success, response) {
                    scope.dfInicioPeriodo.setDisabled(false);
                    scope.dfFinPeriodo.setDisabled(false);
                    responseData = Ext.decode(response.responseText);
                    /*scope.dfInicioPeriodo.reset();
                    scope.dfFinPeriodo.reset();*/

                    if(responseData.retorno != null){
                        scope.dfInicioPeriodo.setDisabledDates(responseData.retorno);
                        scope.dfInicioPeriodo.clearInvalid();
                        scope.dfFinPeriodo.setDisabledDates(responseData.retorno);
                        scope.dfFinPeriodo.clearInvalid();

                    }
                    scope.dfInicioPeriodo.setMinValue(scope.smEjercicios.getSelected().data.dfDesde);
                    scope.dfInicioPeriodo.setMaxValue(scope.smEjercicios.getSelected().data.dfHasta);
                    scope.dfInicioPeriodo.clearInvalid();
                    scope.dfFinPeriodo.setMinValue(scope.smEjercicios.getSelected().data.dfDesde);
                    scope.dfFinPeriodo.setMaxValue(scope.smEjercicios.getSelected().data.dfHasta);
                    scope.dfFinPeriodo.clearInvalid();

                }
            });

            //scope.fResetValuesFecha(scope.dfInicioPeriodo, scope.dfFinPeriodo);
            //scope.fSetValuesFechas(scope.gpEjercicios.getSelectionModel().getSelected().data.dfDesde, scope.gpEjercicios.getSelectionModel().getSelected().data.dfHasta);
        };

        scope.buscarEjercicios = function() {

            scope.dsEjercicioContable.baseParams.start = '';
            scope.dsEjercicioContable.baseParams.limit = '';
            scope.dsEjercicioContable.baseParams.filtro = Ext.getCmp('tfNombreBuscar').getRawValue();
            scope.dsEjercicioContable.load();
        };

        scope.eliminarEjercicio = function() {
            scope.windowopen = true;
            if (!scope.smEjercicios.getSelected())
                mostrarMensaje(1, scope.etiquetas.lbMsgSelEjeCon);
            else {
                if (scope.smEjercicios.getSelections().length > 1)
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelPluralEje, elimina);
                else
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelSegEje, elimina);
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    if (scope.smEjercicios.getSelections().length > 1)
                        Ext.Msg.wait(scope.etiquetas.lbMsgWaitPluralDelEj, scope.etiquetas.lbPlease);
                    else
                        Ext.Msg.wait(scope.etiquetas.lbMsgWaitSingleDelEj, scope.etiquetas.lbPlease);
                    var id = "";
                    var cant = scope.smEjercicios.getSelections().length;
                    for (var i = 0; i < cant; i++) {
                        if (i < cant - 1)
                            id += scope.smEjercicios.getSelections()[i].get('idejercicio') + ",";
                        else
                            id += scope.smEjercicios.getSelections()[i].get('idejercicio');
                    }
                    Ext.Ajax.request({
                        url: scope.url + 'eliminarejercicio',
                        params: {
                            idejercicio: id
                        },
                        method: 'POST',
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            if (responseData.codMsg == -1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgEjeElimOkSingle);
                            } else if (responseData.codMsg == -2) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgEjeElimOkPlural);
                            }
                            else if (responseData.codMsg == -4) {
                                if (scope.smEjercicios.getSelections().length > 1)
                                    mostrarMensaje(1, scope.etiquetas.lbEsdeUsoPlural);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbEsdeUsoSingle);
                            } else {
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                            scope.dsEjercicioContable.baseParams.start = 0;
                            scope.dsEjercicioContable.load({
                                params: {
                                    start: 0,
                                    limit: 20
                                }
                            });
                            scope.dsPeriodoContable.reload();
                            scope.windowopen = false;
                        }
                    });
                } else {
                    scope.windowopen = false;
                    scope.btnAddEjercicio.focus();
                }
            }
        };
        scope.adicionarEjercicios = function(apl, natural) {
            var pos = scope.dsEjercicioContable.getCount();
            if (scope.dsEjercicioContable.getCount() > 0) {
                if (natural) {
                    anonatural = scope.dsEjercicioContable.getAt(pos - 1).data.nombre;
                    antecesor = scope.dsEjercicioContable.getAt(pos - 1).data.idejercicio;
                } else {
                    anonatural = scope.dsEjercicioContable.getAt(pos - 1).data.nombre;
                    antecesor = scope.dsEjercicioContable.getAt(pos - 1).data.idejercicio;
                }
            } else {
                antecesor = 0;
            }
            if (natural == true) {
                Ext.Ajax.request({
                    url: scope.url + 'insertarejercicio',
                    params: {
                        anonatural: 1,
                        enero : scope.etiquetas.enero, febrero : scope.etiquetas.febrero, marzo : scope.etiquetas.marzo, abril : scope.etiquetas.abril, mayo : scope.etiquetas.mayo, junio : scope.etiquetas.junio, julio : scope.etiquetas.julio,
                        agosto : scope.etiquetas.agosto, septiembre : scope.etiquetas.septiembre, octubre : scope.etiquetas.octubre, noviembre : scope.etiquetas.noviembre, diciembre : scope.etiquetas.diciembre
                    },
                    method: 'POST',
                    waitMsg: scope.etiquetas.lbMsgGEjercicio,
                    callback: function(options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        switch (responseData.codMsg) {
                            case -1:
                                mostrarMensaje(1, scope.etiquetas.lbMsgConfEjeOk);
                                scope.dsEjercicioContable.load({
                                    params: {
                                        start: 0,
                                        limit: 20
                                    }
                                });
                                 if (!scope.smEjercicios.getSelected())
                                    if (scope.smEjercicios.getSelected)
                                        if(scope.pnlPeriodos.collapsed == false){
                                            scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                            scope.dsPeriodoContable.load();
                                        }
                                        else
                                            scope.dsPeriodoContable.removeAll();
                                scope.windowopen = false;
                                break;
                            case -2:
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteunAN);
                                break;
                            case -3:
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteunANExiste);
                                break;
                            case -4:
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteECExiste);
                                break;
                            case -5:
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteECRangoFecha);
                                break;
                            case -6:
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteECNombre);
                                break;
                            case -7:
                                mostrarMensaje(1, scope.etiquetas.lbMsgInterFueraRango);
                                break;
                            case -8:
                                mostrarMensaje(1, scope.etiquetas.lbMsgFechaInicioMayor);
                                break;
                            default:
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                break;
                        }
                    }
                });
            } else {
                if (scope.fpRegEjercicios.getForm().isValid()) {
                    scope.tfNombreEjercicio.setValue(scope.tfNombreEjercicio.getValue().trim());
                    if(scope.tfNombreEjercicio.getValue() != '') {
                        scope.fpRegEjercicios.getForm().submit({
                            url: scope.url + 'insertarejercicio',
                            params: {
                                nombre: scope.tfNombreEjercicio.getValue(),
                                antecesor: 0,
                                feci: Ext.getCmp('dfDesde').getRawValue(),
                                fechaf: Ext.getCmp('dfHasta').getRawValue()
                            },
                            waitMsg: scope.etiquetas.lbMsgGEjercicio,
                            failure: function (form, action) {
                                switch (action.result.codMsg) {
                                    case -1:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgConfEjeOk);
                                        scope.fpRegEjercicios.getForm().reset();
                                        if (!apl) {
                                            scope.winInsNCl.hide();
                                            scope.windowopen = false;
                                        }
                                        scope.dsEjercicioContable.load({
                                            params: {
                                                start: 0,
                                                limit: 20
                                            }
                                        });
                                        if (!scope.smEjercicios.getSelected())
                                            if (scope.smEjercicios.getSelected)
                                                if (scope.pnlPeriodos.collapsed == false) {
                                                    scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                                    scope.dsPeriodoContable.load();
                                                } else
                                                    scope.dsPeriodoContable.removeAll();
                                        if (apl) {
                                            //scope.clearDateRangeEjercicios();
                                            scope.fSetValuesFechasE();
                                        }
                                        break;
                                    case -2:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgExisteunAN);
                                        break;
                                    case -3:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgExisteunANExiste);
                                        break;
                                    case -4:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgExisteECExiste);
                                        break;
                                    case -5:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgExisteECRangoFecha);
                                        break;
                                    case -6:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgExisteECNombre);
                                        break;
                                    case -7:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgInterFueraRango);
                                        break;
                                    case -8:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgFechaInicioMayor);
                                        break;
                                    default:
                                        mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                        break;
                                }
                            }
                        });
                    }else{
                        Ext.getCmp('idbtnWAdd').disable();
                        Ext.getCmp('idbtnWAplicar').disable();
                    }
                }
                else {
                    mostrarMensaje(1, scope.etiquetas.lbMsgConf);
                }
            }
        };

        scope.adicionarEjercicioContable = function() {
            scope.windowopen = true;
            function checkYear(btnPress) {
                switch (btnPress) {
                    case 'yes':
                        scope.adicionarEjercicios('', true);
                        scope.btnAddEjercicio.focus();
                        break;
                    case 'no':
                        scope.winFpRegEjercicios('Ins');
                        break;
                    case 'cancel':
                        scope.windowopen = false;
                        scope.btnAddEjercicio.focus();
                        break;
                }
            }
            Ext.MessageBox.classIcon = {cancel: "icondistra-cancelar", yes: "icondistra-true verde", no: "icondistra-false rojo"};
            Ext.Msg.show({
                title: scope.etiquetas.lbMsgConfir,
                msg: scope.etiquetas.lbMsgCheckYear,
                buttons:Ext.MessageBox.YESNOCANCEL,
                fn: checkYear,
                animEl: 'btnAddEjercicio',
                icon: Ext.MessageBox.QUESTION
            });
        };
        scope.modificarEjercicios = function() {
            scope.windowopen = true;
            scope.tfNombreEjercicio.setValue(scope.limpiarEspacios(scope.tfNombreEjercicio.getValue()));
            if (scope.fpRegEjercicios.getForm().isValid()) {
                scope.tfNombreEjercicio.setValue(scope.tfNombreEjercicio.getValue().trim());
                if(scope.tfNombreEjercicio.getValue() != '') {
                    scope.fpRegEjercicios.getForm().submit({
                        url: scope.url + 'modificarejercicio',
                        params: {
                            idejercicio: scope.smEjercicios.getSelected().data.idejercicio,
                            version: scope.smEjercicios.getSelected().data.version
                            //idperiodoini: (scope.buscarprimeroultimo().length > 0) ? scope.buscarprimeroultimo()[0] : '',
                            //idperiodofin: (scope.buscarprimeroultimo().length > 0) ? scope.buscarprimeroultimo()[1] : ''

                        },
                        waitMsg: scope.etiquetas.lbMsgGEjercicio,
                        failure: function (form, action) {
                            switch (action.result.codMsg) {
                                case -1 :
                                    mostrarMensaje(1, scope.etiquetas.lbMsgEjeModAct);
                                    scope.modificar = true;
                                    scope.dsEjercicioContable.reload();
                                    scope.winModNCl.hide();
                                    scope.windowopen = false;
                                    scope.elemsel = scope.smEjercicios.getSelections()[0].get('idejercicio');
                                    scope.nuevo = false;
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteECNombre);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteECRangoFecha);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisteECRangoFecha);
                                    break;
                                case -5:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisFechaMod);
                                    break;
                                case -6:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisFechaIniMod);
                                    break;
                                case -7:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisFechaFuerarang);
                                    break;
                                case -8:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgFechaInicioMayor);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    break;
                            }
                        }
                    });
                }else{
                    Ext.getCmp('idbtnWMod').disable();
                }
            }
            else {
                if (!scope.fpRegEjercicios.getForm().isValid())
                    mostrarMensaje(1, scope.etiquetas.lbMsgConf);
            }
            band = false;
        };
        scope.eliminarPeriodo = function() {
            if (scope.smEjercicios.getSelections().length > 1) {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelSingEjeCon);
            } else {
                if (!scope.smPeriodos.getSelected())
                    mostrarMensaje(1, scope.etiquetas.lbMsgSelPerCon);
                else {
                    if (scope.smPeriodos.getSelections().length > 1) {
                        mostrarMensaje(2, scope.etiquetas.lbMsgSelPlurPeriodo, elimina);
                        scope.windowopen = true;
                    }
                    else {
                        mostrarMensaje(2, scope.etiquetas.lbMsgSelSingPeriodo, elimina);
                        scope.windowopen = true;
                    }
                }
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.Msg.wait(scope.etiquetas.lbMsgElimDatosPeriodo, scope.etiquetas.lbPlease);
                    var idper = "";
                    var cant = scope.smPeriodos.getSelections().length;
                    for (var i = 0; i < cant; i++)
                        if (i < cant - 1)
                            idper += scope.smPeriodos.getSelections()[i].get('idperiodo') + ",";
                        else
                            idper += scope.smPeriodos.getSelections()[i].get('idperiodo');
                    Ext.Ajax.request({
                        url: scope.url + 'eliminarperiodo',
                        params: {
                            idperiodo: idper,
                            idejercicio: scope.smEjercicios.getSelected().data.idejercicio,
                            annonatural: (scope.smEjercicios.getSelected().data.anonatural) ? '1' : '0'
                        },
                        method: 'POST',
                        callback: function(options, success, response) {
                            Ext.Msg.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsg == -2) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgPerElimMuchos);
                                scope.elemsel = scope.smEjercicios.getSelections()[0].get('idejercicio');
                                scope.modificar = true;
                                //scope.dsEjercicioContable.reload();
                                scope.windowopen = false;
                                if (scope.smEjercicios.getSelected)
                                    if(scope.pnlPeriodos.collapsed == false){
                                        scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                        scope.dsPeriodoContable.load();
                                    }else
                                        scope.dsPeriodoContable.removeAll();
                            } else if (responseData.codMsg == -1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgPerElimOk);
                                scope.elemsel = scope.smEjercicios.getSelections()[0].get('idejercicio');
                                scope.modificar = true;
                                //scope.dsEjercicioContable.reload();
                                scope.windowopen = false;
                                if (scope.smEjercicios.getSelected)
                                    if(scope.pnlPeriodos.collapsed == false){
                                        scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                        scope.dsPeriodoContable.load();
                                    }else
                                        scope.dsPeriodoContable.removeAll();
                            }
                            else if (responseData.codMsg == -4) {
                                if (scope.smPeriodos.getSelections().length > 1)
                                    mostrarMensaje(1, scope.etiquetas.lbPEsdePlurUso);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbPEsdeSingUso);
                            }

                        }
                    });
                }
                else {
                    scope.btnAddPeriodo.focus();
                }
                scope.windowopen = false;

            }
        };
        scope.adicionarPeriodos = function(apl) {
            if (scope.fpRegPeriodos.getForm().isValid()) {
                scope.tfNombrePeriodo.setValue(scope.tfNombrePeriodo.getValue().trim());
                if(scope.tfNombrePeriodo.getValue() != '') {
                    scope.fpRegPeriodos.getForm().submit({
                        url: scope.url + 'insertarperiodo',
                        params: {
                            idejercicio: scope.smEjercicios.getSelected().data.idejercicio
                        },
                        waitMsg: scope.etiquetas.lbMsgGPeriodo,
                        failure: function (form, action) {
                            switch (action.result.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgConfPerOk);
                                    scope.fpRegPeriodos.getForm().reset();
                                    if (!apl) {
                                        scope.winInsNClA.hide();
                                        scope.windowopen = true;
                                    }
                                    if (scope.smEjercicios.getSelected)
                                        if (scope.pnlPeriodos.collapsed == false) {
                                            scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                            scope.dsPeriodoContable.load();
                                        } else
                                            scope.dsPeriodoContable.removeAll();
                                    scope.modificar = true;
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisPerd);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExistePCExiste);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgPeriodoInvalido);
                                    break;
                                case -5:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgIntervPeriodoInvalido);
                                    break;
                                case -6:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgFechaInicioMayor);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    break;
                            }
                        }
                    });
                }else{
                    Ext.getCmp('idbtnAceptarAdd').disable();
                    Ext.getCmp('idbtnWPAplicar').disable();
                }
            } else {
                mostrarMensaje(1, scope.etiquetas.lbMsgConf);
            }
        };
        scope.modificarPeriodos = function() {
            scope.windowopen = true;
            scope.tfNombrePeriodo.setValue(scope.limpiarEspacios(scope.tfNombrePeriodo.getValue()));
            if (scope.fpRegPeriodos.getForm().isValid()) {
                scope.tfNombrePeriodo.setValue(scope.tfNombrePeriodo.getValue().trim());
                if(scope.tfNombrePeriodo.getValue() != '') {
                    scope.fpRegPeriodos.getForm().submit({
                        url: scope.url + 'modificarperiodo',
                        params: {
                            idejercicio: scope.smEjercicios.getSelected().data.idejercicio,
                            version: scope.smPeriodos.getSelected().data.version,
                            idperiodo: scope.smPeriodos.getSelected().data.idperiodo
                        },
                        waitMsg: scope.etiquetas.lbMsgGPeriodo,
                        failure: function (form, action) {
                            switch (action.result.codMsg) {
                                case -1:
                                    scope.modificar = true;
                                    mostrarMensaje(1, scope.etiquetas.lbMsgPerModOk);
                                    if (scope.smEjercicios.getSelected) {
                                        scope.dsEjercicioContable.reload();
                                        if (scope.pnlPeriodos.collapsed == false) {
                                            scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                            scope.dsPeriodoContable.load();
                                        } else
                                            scope.dsPeriodoContable.removeAll();
                                    }
                                    scope.windowopen = false;
                                    scope.winModNClA.hide();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExistePCMod);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgPeriodoInvalido);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgExisPerd);
                                    break;
                                case -5:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgInterFueraRango);
                                    break;
                                case -6:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgFechaInicioMayor);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    scope.modificar = true;
                                    if (scope.smEjercicios.getSelected) {
                                        if (scope.pnlPeriodos.collapsed == false) {
                                            scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                                            scope.dsPeriodoContable.load();
                                        } else
                                            scope.dsPeriodoContable.removeAll();
                                    }
                                    scope.winModNClA.hide();
                                    scope.windowopen = true;
                                    break;
                            }
                        }
                    });
                }else{
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgConf);
            }
        };
        scope.limpiarEspacios = function(s) {
            s = s.replace(/\s+/gi, ' '); //sacar espacios repetidos dejando solo uno
            s = s.replace(/^\s+|\s+$/gi, ''); //sacar espacios blanco principio y final
            return s;
        };
        /*scope.buscarprimeroultimo = function()
        {
            var elementos = new Array();
            if (scope.dsPeriodoContable.getTotalCount() >= 2)
            {
                elementos[0] = scope.dsPeriodoContable.getAt(0).data.idperiodo;
                elementos[1] = scope.dsPeriodoContable.getAt(scope.dsPeriodoContable.getTotalCount() - 1).data.idperiodo;
            }
            return elementos;
        };*/
        /*scope.nomodificar = function() {
           *//* if (scope.smPeriodos.getSelected().data.idperiodo == scope.dsPeriodoContable.getAt(0).data.idperiodo || scope.smPeriodos.getSelected().data.idperiodo == scope.dsPeriodoContable.getAt(scope.dsPeriodoContable.getTotalCount() - 1).data.idperiodo) {
                scope.btnDelPeriodo.disable();
                scope.btnModPeriodo.disable();
            } else {
                scope.btnDelPeriodo.enable();
                scope.btnModPeriodo.enable();
            }*//*

        };*/
        /*scope.fSetValuesFechas = function(fechaInicio, fechaFin)
        {
            scope.dfInicioPeriodo.setValue(fechaInicio);
            scope.dfFinPeriodo.setValue(fechaFin);

        };*/
        scope.fSetValuesFechasE = function(mode)
        {
            Ext.Ajax.request({
                url: scope.url + 'intervalosFechaUtilizadosEjercicio',
                params: {
                    idejercicio: mode == 'ins' ? null : scope.smEjercicios.getSelected().data.idejercicio
                },
                method: 'POST',
                callback: function(options, success, response) {
                    scope.dfInicioEjercicio.setDisabled(false);
                    scope.dfFinEjercicio.setDisabled(false);
                    responseData = Ext.decode(response.responseText);
                    if(responseData.retorno != null){
                        scope.dfInicioEjercicio.setDisabledDates(responseData.retorno);
                        scope.dfInicioEjercicio.clearInvalid();
                        scope.dfFinEjercicio.setDisabledDates(responseData.retorno);
                        scope.dfFinEjercicio.clearInvalid();

                    }
                }
            });

            /*scope.dfInicioEjercicio.setDisabled(false);
            scope.dfFinEjercicio.setDisabled(false);
            scope.dfInicioEjercicio.reset();
            scope.dfFinEjercicio.reset();
            scope.dfInicioEjercicio.setMinValue(fechaInicio);
            scope.dfFinEjercicio.setMaxValue(fechaFin);
            scope.dfInicioEjercicio.setValue(fechaInicio);
            scope.dfFinEjercicio.setValue(fechaFin);
            scope.dfInicioEjercicio.clearInvalid();
            scope.dfFinEjercicio.clearInvalid();*/
        };


       /* scope.fSetValuesFechasEV1 = function(fechaInicio, fechaFin, Factual)
        {
            scope.dfInicioEjercicio.setDisabled(false);
            scope.dfFinEjercicio.setDisabled(false);
            scope.dfInicioEjercicio.reset();
            scope.dfFinEjercicio.reset();
            scope.dfInicioEjercicio.setMinValue(fechaInicio);
            scope.dfFinEjercicio.setMaxValue(fechaFin);
            scope.dfInicioEjercicio.setValue(fechaInicio);
            scope.dfFinEjercicio.setValue(Factual);
            scope.dfInicioEjercicio.clearInvalid();
            scope.dfFinEjercicio.clearInvalid();
        };
*/
        /*scope.fResetValuesFecha = function(dfDesde, dfHasta)
        {
            date = new Date().format('d/m/Y');
            dfDesde.setDisabled(true);
            dfHasta.setDisabled(true);
            dfDesde.setValue(null);
            dfHasta.setValue(null);

        };*/

        scope.noeliminar = function() {
            if (scope.smEjercicios.getSelected().data.anonatural == 1) {
                scope.btnAddPeriodo.disable();
                scope.btnModPeriodo.disable();
                scope.btnDelPeriodo.disable();
            }
            else {
                scope.btnAddPeriodo.enable();
                scope.btnModPeriodo.enable();
                scope.btnDelPeriodo.enable();
            }
        };
        scope.modvalej = function(v) {
            valej = v;
        };
        scope.VerificarDataEjercicio = function()
        {
            scope.tfNombreEjercicio.setValue(scope.tfNombreEjercicio.getValue().trim());
            if (scope.fpRegEjercicios.getForm().isValid()) {
                if (scope.tfNombreEjercicio.getValue() != '') {
                    scope.modvalej(false);
                    Ext.Ajax.request({
                        url: scope.url + 'verifdatejerc',
                        params: {
                            idejercicio: scope.smEjercicios.getSelected().data.idejercicio,
                            nombre: scope.tfNombreEjercicio.getValue(),
                            inicio: Ext.util.Format.date(Date.parseDate(scope.dfInicioEjercicio.getRawValue(), 'd/m/Y'), 'd/m/Y'),
                            fin: Ext.util.Format.date(Date.parseDate(scope.dfFinEjercicio.getRawValue(), 'd/m/Y'), 'd/m/Y')
                        },
                        method: 'POST',
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.retorno == -1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgDatos);
                                scope.modvalej(false);
                                Ext.getCmp('idbtnWMod').disable();
                            } else if (responseData.retorno == -2) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgInterFueraRango);
                                scope.modvalej(false);
                            } else if (responseData.retorno == -3) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgEjContienePeriodos);
                                scope.modvalej(false);
                            } else {
                                scope.modificarEjercicios();
                            }
                        }
                    });

                } else {
                    Ext.getCmp('idbtnWMod').disable();
                }
            }else {
                mostrarMensaje(1, scope.etiquetas.lbMsgConf);
                Ext.getCmp('idbtnWMod').disable();
            }
        };
        scope.VerificarDataPeriodo = function() {
            scope.tfNombrePeriodo.setValue(scope.tfNombrePeriodo.getValue().trim());
            if (scope.fpRegPeriodos.getForm().isValid()) {
                if(scope.tfNombrePeriodo.getValue() != '') {
                    Ext.Ajax.request({
                        url: scope.url + 'verifdatper',
                        params: {
                            idperiodo: scope.smPeriodos.getSelected().data.idperiodo,
                            nombre: scope.tfNombrePeriodo.getValue(),
                            inicio: Ext.util.Format.date(Date.parseDate(scope.dfInicioPeriodo.getRawValue(), 'd/m/Y'), 'd/m/Y'),
                            fin: Ext.util.Format.date(Date.parseDate(scope.dfFinPeriodo.getRawValue(), 'd/m/Y'), 'd/m/Y')
                        },
                        method: 'POST',
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            if (responseData.retorno == 1) {
                                mostrarMensaje(1, scope.etiquetas.lbMsgDatosP);
                                Ext.getCmp('idbtnAceptarMod').disable();
                            }else
                                scope.modificarPeriodos();
                        }
                    });
                }else{
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgConf);
                Ext.getCmp('idbtnAceptarMod').disable();
            }
        };
    }
};

Ext.Configuracion_General_Parametros.Ejercicios = Ext.extend(Ext.Panel, {
    border:false,
    constructor: function(config)
    {
        Ext.QuickTips.init();
        scope = this;
        scope.etiquetas = Conf.Ejercicios.etiquetas;
        scope.url = '/configuracion/ejerciciosyperiodos/index.php/ejercicios/';
        scope.perfil = window.parent.UCID.portal.perfil;
        scope.config = config;

        scope.busqueda = false;
        scope.modificar = false;
        scope.band = false;
        scope.winInsNCl, scope.winModNCl, scope.winInsNClA, scope.winModNClA;
        scope.elemento, scope.elemsel;
        scope.windowopen = false;
        scope.ultimoEjercicio;
        scope.hideBtns = Conf.CargaInicial ? false : true;

        actionValidate.validate();

        scope.model = Ext.Configuracion_General_Parametros.EjerciciosModel;
        scope.model.init(scope);
        scope.controller = Ext.Configuracion_General_Parametros.EjerciciosController;
        scope.controller.init(scope);
        scope.init(scope);
    },
    init: function(scope) {
        scope.btnAddEjercicio = new Ext.Button({
            id: 'btnAddEjercicio',
            iconCls: 'adicionar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbTooltWinInsEst,
            text: scope.etiquetas.lbBtnAdicionar,
            handler: function() {
                scope.adicionarEjercicioContable();
            }
        });

        scope.btnModEjercicio = new Ext.Button({
            id: 'btnModEjercicio',
            iconCls: 'modificar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbTooltWinModEst,
            text: scope.etiquetas.lbBtnModificar,
            handler: function() {
                if (scope.btnModEjercicio.enable() && scope.smEjercicios.getSelected().data.anonatural != 1) {
                    scope.band = true;
                    scope.winFpRegEjercicios('Mod');
                }
            }
        });

        scope.btnDelEjercicio = new Ext.Button({
            id: 'btnDelEjercicio',
            iconCls: 'eliminar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbTooltWinEliEst,
            text: scope.etiquetas.lbBtnEliminar,
            handler: function() {
                scope.eliminarEjercicio();
                scope.windowopen = false;
            }
        });

        scope.btnAyuda = new Ext.Button({
            id: 'btnAyudaEjercicio',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.lntooltipWindAyuda
        });

        scope.tfNombreBuscar = new Ext.Cont.SearchField({
            id: 'tfNombreBuscar',
            width: 250,
            maxLength: 70,
            emptyText: scope.etiquetas.lbCriterioBuscar,
            searchTooltip: scope.etiquetas.lbsearchTooltip,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            fnOnSearch: function() {
                scope.busqueda = true;
                scope.buscarEjercicios();

            },
            fnOnClear: function() {
                scope.busqueda = false;
                scope.buscarEjercicios();
            }
        });

        scope.smPeriodos = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            defaultSortable : true,
            listeners: {
                rowselect: function(selectioModel, rowIndex, record) {
                    if (selectioModel.getSelections().length <= 0) {
                        scope.btnModPeriodo.disable();
                        scope.btnDelPeriodo.disable();
                    }
                    else if (selectioModel.getSelections().length >= 1) {
                        var seleccion = selectioModel.getSelections();
                        var cont = 0;
                        if (seleccion.length >= 1) {
                            scope.btnDelPeriodo.enable();
                            if (selectioModel.getSelections().length == 1)
                                scope.btnModPeriodo.enable();
                            else
                                scope.btnModPeriodo.disable();
                        } else {
                            scope.btnDelPeriodo.disable();
                            scope.btnModPeriodo.disable();
                        }
                    }
                    Ext.getCmp('idgpPeriodos').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function(selectioModel, rowIndex, record) {
                    if (selectioModel.getSelections().length <= 0) {
                        scope.btnModPeriodo.disable();
                        scope.btnDelPeriodo.disable();
                    }
                    else if (selectioModel.getSelections().length >= 1) {
                        var seleccion = selectioModel.getSelections();
                        var cont = 0;
                        if (seleccion.length >= 1) {
                            scope.btnDelPeriodo.enable();
                            if (selectioModel.getSelections().length == 1)
                                scope.btnModPeriodo.enable();
                            else
                                scope.btnModPeriodo.disable();
                        } else {
                            scope.btnDelPeriodo.disable();
                            scope.btnModPeriodo.disable();
                        }
                    }
                    Ext.getCmp('idgpPeriodos').getView().removeRowClass(rowIndex, "negrita");
                }
            }
        });

        scope.smEjercicios = new Ext.grid.RowSelectionModel({
            singleSelect : false,
            defaultSortable : true
        });

        scope.chkAnnoNatural = new Ext.grid.CheckColumn({
            header: scope.etiquetas.lbAnNatural,
            dataIndex: 'anonatural',
            width: 170,
            align: 'center',
            sortable: true
        });

        scope.btnAddPeriodo = new Ext.Button({
            id: 'btnAddPeriodo',
            iconCls: 'adicionar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbToolTipAdic,
            text: scope.etiquetas.lbBtnAdicionar,
            handler: function() {
                scope.winFpRegPeriodos('Ins');
            }
        });

        scope.btnModPeriodo = new Ext.Button({
            id: 'btnModPeriodo',
            disabled: true,
            iconCls: 'modificar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbToolTipMod,
            text: scope.etiquetas.lbBtnModificar,
            handler: function() {
                if (scope.smPeriodos.getSelections().length > 1)
                    mostrarMensaje(1, scope.etiquetas.lbMsgModPeriodo);
                else
                if (scope.smEjercicios.getSelections().length > 1) {
                    mostrarMensaje(1, scope.etiquetas.lbMsgEjeCon);
                    if(scope.pnlPeriodos.collapsed == false)
                        scope.btnModEjercicio.disable();
                } else {
                    scope.winFpRegPeriodos('Mod');
                }
            }
        });

        scope.btnDelPeriodo = new Ext.Button({
            id: 'btnDelPeriodo',
            iconCls: 'eliminar',
            hidden: scope.hideBtns,
            disabled: true,
            tooltip: scope.etiquetas.lbToolTipEli,
            text: scope.etiquetas.lbBtnEliminar,
            handler: function() {
                scope.eliminarPeriodo();
            }
        });

        scope.filtersEjercicio = new Ext.grid.GridFilters({
            filters:[
                {type: 'numeric',  dataIndex: 'idejercicio'},
                {type: 'string',  dataIndex: 'nombre'},
                {type: 'date',  dataIndex: 'dfDesde'},
                {type: 'date',  dataIndex: 'dfHasta'},
                {type: 'boolean', dataIndex: 'anonatural'}
            ]
        });

        scope.gpEjercicios = new Ext.grid.GridPanel({
            frame: false,
            region: 'center',
            border: false,
            id: 'idgpEjercicios',
            viewConfig: {forceFit:true},
            loadMask: scope.etiquetas.lbMsgCargando,
            stripeRows: true,
            //floating: false,
            autoExpandColumn: 'expandir',
            store: scope.dsEjercicioContable,
            sm: scope.smEjercicios,
            plugins: scope.filtersEjercicio,
            listeners : ({
                dblclick : function(){
                    if(scope.pnlPeriodos.collapsed == true){
                        scope.pnlPeriodos.expand();
                    }else{
                        scope.pnlPeriodos.collapse();
                    }

                }
            }),
            columns: [{
                    dataIndex: 'idejercicio',
                    hidden: true,
                    hideable: false,
                    width: 0
                }, {
                    header: scope.etiquetas.lbNombre,
                    dataIndex: 'nombre',
                    id: 'expandir',
                    width: 250,
                    sortable: true
                }, scope.chkAnnoNatural, {
                    header: scope.etiquetas.lbFechaInicio,
                    width: 150,
                    sortable: true,
                    dataIndex: 'dfDesde'
                }, {
                    header: scope.etiquetas.lbFechaFin,
                    width: 150,
                    sortable: true,
                    dataIndex: 'dfHasta'
                }, {
                    dataIndex: 'anonatural',
                    hidden: true,
                    hideable: false
                },
                {
                    dataIndex: 'version',
                    hidden: true,
                    hideable: false
                }, {
                    dataIndex: 'antecesor',
                    hidden: true,
                    hideable: false
                }],
            tbar: [scope.tfNombreBuscar],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: scope.dsEjercicioContable,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                emptyMsg: '0 Resultado a mostrar',//scope.etiquetas.lbEmptyMsg
                firstText: 'Primera P&aacute;gina',
                lastText: '&Uacute;ltima P&aacute;gina'
            })
        });

        scope.filtersPeriodo = new Ext.grid.GridFilters({
            filters:[
                {type: 'numeric',  dataIndex: 'idperiodo'},
                {type: 'string',  dataIndex: 'nombre'},
                {type: 'date',  dataIndex: 'inicio'},
                {type: 'date',  dataIndex: 'fin'}
            ]
        });

        scope.gpPeriodos = new Ext.grid.GridPanel({
            frame: false,
            iconCls: 'icon-grid',
            id: 'idgpPeriodos',
            autoExpandColumn: 'expandir',
            loadMask: true,
            stripeRows: true,
            store: scope.dsPeriodoContable,
            sm: scope.smPeriodos,
            floating: false,
            border :false,
            titleCollapse : true,
            keyMapGroup: true,
            plugins: scope.filtersPeriodo,
            viewConfig: {
                forceFit: false,
                enableRowBody: true
            },
            columns: [{
                    dataIndex: 'idperiodo',
                    hidden: true,
                    width: 0,
                    hideable: false
                }, {
                    id: 'expandir',
                    header: scope.etiquetas.lbNombre,
                    dataIndex: 'nombre',
                    width: 250,
                    sortable: true
                }, {
                    header: scope.etiquetas.lbFechaInicio,
                    width: 150,
                    sortable: true,
                    dataIndex: 'inicio'

                }, {
                    header: scope.etiquetas.lbFechaFin,
                    width: 150,
                    sortable: true,
                    dataIndex: 'fin'

                }, {
                    dataIndex: 'idejercicio',
                    hidden: true,
                    hideable: false
                }, {
                    dataIndex: 'version',
                    hidden: true,
                    hideable: false
                }],
            tbar: [scope.btnAddPeriodo, scope.btnModPeriodo, scope.btnDelPeriodo/*, new Ext.menu.Separator()*/],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 13,
                store: scope.dsPeriodoContable,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
//                emptyMsg: scope.etiquetas.lbEmptyMsg
                emptyMsg: '0 Resultado a mostrar',
                firstText: 'Primera P&aacute;gina',
                lastText: '&Uacute;ltima P&aacute;gina'
            })
        });

        /*esto es para resolver un problema de inicializacion*/
        var banderainicio=1;
        scope.pnlPeriodos = new Ext.Panel({
            region: 'south',
            split: true,
            collapsible:true,
            collapsed:true,
            listeners : ({
                beforecollapse : function(){
                    /*por defecto el panel se expande y al colapsarlo, cuando se define, se ejecuta este evento beforecollapse*/
                    if(banderainicio!=1){
                        scope.btnDelEjercicio.enable();
                        if(scope.smEjercicios.getSelected().data.anonatural != 1)
                            scope.btnModEjercicio.enable();
                        scope.dsPeriodoContable.removeAll();
                    }
                    banderainicio=0;
                },
                beforeexpand : function(){
                    scope.btnDelEjercicio.disable();
                    scope.btnModEjercicio.disable();
                    scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                    scope.dsPeriodoContable.load();
                }
            }),
            border : false,
            height: Ext.lib.Dom.getViewHeight() * 1 / 2,
            layout: 'fit',
            title: 'Per&iacute;odos contables',
            items: [scope.gpPeriodos]
        });


        scope.panel_completo = new Ext.Panel({
            layout: 'border',
            border:false,
            frame:false,
            listeners: {render: function() {
                    scope.dsEjercicioContable.load();
                    scope.btnAddEjercicio.focus();
                }},
            keys: scope.keyssM = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: 'i',
                    alt: true,
                    fn: function() {
                        if (Ext.getCmp('btnAddEjercicio').isVisible() && !scope.windowopen)
                            scope.adicionarEjercicioContable();
                    }
                }, {
                    key: 'i',
                    ctrl: true,
                    fn: function() {
                        if (Ext.getCmp('btnAddPeriodo').isVisible() && !Ext.getCmp('btnAddPeriodo').disabled && !scope.windowopen)
                            Ext.getCmp('btnAddPeriodo').handler.call();
                    }
                }, {
                    key: 'm',
                    alt: true,
                    fn: function() {
                        if (scope.btnModEjercicio.isVisible() && !scope.btnModEjercicio.disabled && !scope.windowopen)
                            scope.btnModEjercicio.handler.call();
                    }
                }, {
                    key: 'b',
                    alt: true,
                    fn: function() {
                        if(Ext.getCmp('tfNombreBuscar').getRawValue().length > 0){
                            Ext.getCmp('tfNombreBuscar').onTrigger2Click();
                        }else{
                            Ext.getCmp('tfNombreBuscar').focus();
                        }
                    }
                }, {
                    key: 'l',
                    alt: true,
                    fn: function() {
                        if(Ext.getCmp('tfNombreBuscar').getRawValue().length > 0) {
                            Ext.EventObject.stopEvent();
                            Ext.getCmp('tfNombreBuscar').onTrigger1Click();
                        }
                    }
                }, {
                    key: 'm',
                    ctrl: true,
                    fn: function() {
                        if (scope.btnModPeriodo.isVisible() && !scope.btnModPeriodo.disabled && scope.windowopen == false)
                            scope.btnModPeriodo.handler.call();

                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    fn: function() {
                        if (scope.btnDelEjercicio.isVisible() && !scope.btnDelEjercicio.disabled && !scope.windowopen && Ext.EventObject.ctrlKey != 1)
                            scope.btnDelEjercicio.handler.call();
                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    ctrl: true,
                    fn: function() {
                        if (scope.btnDelPeriodo.isVisible() && !scope.btnDelPeriodo.disabled && !scope.windowopen && Ext.EventObject.ctrlKey == 1)
                            scope.btnDelPeriodo.handler.call();
                    }
                }/*, {
                    key: Ext.EventObject.F1,
                    key: 'h',
                            alt: true,
                    fn: function() {
                        help.show(scope.etiquetas.lnTitleWindAyuda, 'CG/gestionar_ejercicio');
                    }
                }*/, {
                    key: 'z',
                    ctrl: true,
                    alt: true,
                    fn: function() {
                        scope.dsEjercicioContable.reload();
                    }
                }
            ]),
            items: [scope.gpEjercicios, scope.pnlPeriodos],
            tbar: [scope.btnAddEjercicio, scope.btnModEjercicio, scope.btnDelEjercicio, '->', scope.btnAyuda]

        });

        scope.fpRegEjercicios = new Ext.FormPanel({
            labelAlign: 'top',
            width: 410,
            height: 410,
            frame: true,
            border: false,
            bodyStyle: 'padding:15px 15px 0',
            waitMsgTarget: false,
            items: [
                scope.tfNombreEjercicio = new Ext.form.TextField({
                    fieldLabel: scope.etiquetas.lbNombre,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
                    regexText: scope.etiquetas.lbEmptyMsgInc,
                    blankText: scope.etiquetas.lbEmptyMsgOblig,
                    maxLength: 70,
                    maxLengthText: scope.etiquetas.lbMaxLengthText,
                    allowBlank: false,
                    name: 'nombre',
                    anchor: '100%',
                    id: 'tfNombreEjercicio',
                    enableKeyEvents: true,
                    listeners:{
                        keyup: function(){
                            scope.activarBotonesWinEjercicio();
                        }
                    }
                }), {
                    xtype: 'panel',
                    layout: 'column',
                    items: [{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [
                                scope.dfInicioEjercicio = new Ext.form.DateField({
                                    fieldLabel: scope.etiquetas.lbFechaInicio,
                                    enableKeyEvents: true,
                                    vtype: 'daterange',
                                    name: 'dfDesde',
                                    id: 'dfDesde',
                                    endDateField: 'dfHasta',
                                    anchor: '100%',
									//maxValue: new Date(),
                                    //readOnly: true,
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    emptyText: scope.etiquetas.lbEmptyMsgSel,
                                    maxText: scope.etiquetas.lbmsgMaxDate,
                                    invalidText: scope.etiquetas.lbInvalidTexDate,
                                    disabledDatesText: scope.etiquetas.lbDateExist,
                                    editable: true,
                                    listeners:{
                                        keyup: function(){
                                            scope.activarBotonesWinEjercicio();
                                        },
                                        change: function(){
                                            scope.activarBotonesWinEjercicio();
                                        }
                                    }
                                })
                            ]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            style: 'margin:0 0 0 5',
                            items: [
                                scope.dfFinEjercicio = new Ext.form.DateField({
                                    fieldLabel: scope.etiquetas.lbFechaFin,
                                    enableKeyEvents: true,
                                    vtype: 'daterange',
                                    name: 'dfHasta',
                                    id: 'dfHasta',
                                    startDateField: 'dfDesde',
                                    anchor: '100%',
                                    format: 'd/m/Y',
                                    allowBlank: false,
                                    minText: scope.etiquetas.lbmsgMinDate,
                                    invalidText: scope.etiquetas.lbInvalidTexDate,
                                    emptyText: scope.etiquetas.lbEmptyMsgSel,
                                    disabledDatesText: scope.etiquetas.lbDateExist,
                                    editable: true,
                                    listeners:{
                                        keyup: function(){
                                            scope.activarBotonesWinEjercicio();
                                        },
                                        change: function(){
                                            scope.activarBotonesWinEjercicio();
                                        }
                                    }
                                })]
                        }]
                }]
        });

        scope.fpRegPeriodos = new Ext.FormPanel({
            labelAlign: 'top',
            width: 400,
            height: 300,
            frame: true,
            border: false,
            bodyStyle: 'padding:15px 15px 0',
            items: [
                scope.tfNombrePeriodo = new Ext.form.TextField({
                    xtype: 'textfield',
                    fieldLabel: scope.etiquetas.lbNombre,
                    allowBlank: false,
                    blankText: scope.etiquetas.lbEmptyMsgOblig,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
                    regexText: scope.etiquetas.lbEmptyMsgInc,
                    name: 'nombre',
                    enableKeyEvents: true,
                    maxLength: 70,
                    maxLengthText: scope.etiquetas.lbMaxLengthText,
                    anchor: '100%',
                    listeners:{
                        keyup: function(){
                            scope.activarBotonesWinPeriodos();
                        }
                    }
                }), {
                    xtype: 'panel',
                    layout: 'column',
                    items: [{
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [
                                scope.dfInicioPeriodo = new Ext.form.DateField({
                                    id: 'inicio',
                                    enableKeyEvents: true,
                                    allowBlank: false,
                                    anchor: '98%',
                                    //readOnly: true,
                                    fieldLabel: scope.etiquetas.lbFechaInicio,
                                    //blankText: scope.etiquetas.lbEmptyMsgOblig,
                                    emptyText: scope.etiquetas.lbEmptyMsgSel,
                                    //invalidText: scope.etiquetas.lbEmptyMsgVal,
                                    //disabledDatesText: scope.etiquetas.lbDisabledDates,
                                    name: 'inicio',
                                    format: 'd/m/Y',
                                    vtype: 'daterange',
                                    maxText: scope.etiquetas.lbmsgMaxDate,
                                    endDateField: 'fin',
                                    editable: true,
                                    listeners:{
                                        keyup: function(){
                                            scope.activarBotonesWinPeriodos();
                                        },
                                        change: function(){
                                            scope.activarBotonesWinPeriodos();
                                        }
                                    }
                                })
                            ]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [
                                scope.dfFinPeriodo = new Ext.form.DateField({
                                    id: 'fin',
                                    enableKeyEvents: true,
                                    allowBlank: false,
                                    anchor: '100%',
                                    //readOnly: true,
                                    fieldLabel: scope.etiquetas.lbFechaFin,
                                    //blankText: scope.etiquetas.lbEmptyMsgOblig,
                                    emptyText: scope.etiquetas.lbEmptyMsgSel,
                                    //invalidText: scope.etiquetas.lbEmptyMsgVal,
                                    //disabledDatesText: scope.etiquetas.lbDisabledDates,
                                    name: 'fin',
                                    format: 'd/m/Y',
                                    vtype: 'daterange',
                                    minText: scope.etiquetas.lbmsgMinDate,
                                    startDateField: 'inicio',
                                    editable: true,
                                    listeners:{
                                        keyup: function(){
                                            scope.activarBotonesWinPeriodos();
                                        },
                                        change: function(){
                                            scope.activarBotonesWinPeriodos();
                                        }
                                    }
                                })
                            ]
                        }]
                }]
        });

        /*scope.tfNombreBuscar.on({
            keyup: function(t, e) {
                if (t.getValue().length == 0) {
                    Ext.getCmp('btnBuscar').disable();
                    Ext.getCmp('BtnLimpiarEjer').hide();
                } else if (t.getValue().length > 0) {
                    Ext.getCmp('btnBuscar').enable();
                    Ext.getCmp('BtnLimpiarEjer').show();
                }
                if (e.getKey() == 13 || e.getKey() == Ext.EventObject.ENTER) {
                    if (t.getValue().length > 0) {
                        scope.buscarEjercicios();
                    } else {
                        Ext.getCmp('btnBuscar').disable();
                        Ext.getCmp('BtnLimpiarEjer').hide();
                        t.reset();
                        t.blur();
                        t.clearInvalid();
                    }
                }
            }
        });*/

        /*scope.dfInicioEjercicio.on({
            valid: function() {
                scope.dfFinEjercicio.enable();
                scope.dfFinEjercicio.setMinValue(scope.dfInicioEjercicio.getRawValue());
            }
        });*/

       /* scope.dfInicioEjercicioBuscar.on(
                {
                    keyup: function(t, e) {
                        if (e.getKey() == 13) {
                            if (t.getRawValue() && t.isValid()) {
                                scope.buscarEjercicios();
                            } else {
                                Ext.getCmp('btnBuscar').disable();
                                Ext.getCmp('BtnLimpiarEjer').hide();
                                t.reset();
                                t.blur();
                                t.clearInvalid();
                            }
                        }
                    }, focus: function() {
                        Ext.getCmp('btnBuscar').enable();
                        Ext.getCmp('BtnLimpiarEjer').show();
                    }
                });

        scope.dfFinEjercicioBuscar.on({
            keyup: function(t, e) {
                if (e.getKey() == 13) {
                    if (t.getRawValue() && t.isValid()) {
                        scope.buscarEjercicios();
                    } else {
                        Ext.getCmp('btnBuscar').disable();
                        Ext.getCmp('BtnLimpiarEjer').hide();
                        t.reset();
                        t.blur();
                        t.clearInvalid();
                    }
                }
            }, focus: function() {
                {
                    Ext.getCmp('btnBuscar').enable();
                    Ext.getCmp('BtnLimpiarEjer').show();
                }
            }
        });*/


        scope.dsEjercicioContable.on({
            load: function(store, records, options) {
                if (store.getTotalCount() != 0) {
                    if (!scope.smEjercicios.getSelected()) {
                        scope.smEjercicios.selectFirstRow();
                    }
                    if(scope.pnlPeriodos.collapsed == false){
                        Ext.getCmp('btnModEjercicio').enable();
                        Ext.getCmp('btnDelEjercicio').enable();
                    }
                } else {
                    if (scope.busqueda) {
                        mostrarMensaje(1, scope.etiquetas.messNoResult);
                    } else {
                        mostrarMensaje(1, scope.etiquetas.messNoDatos);
                    }
                    if(scope.pnlPeriodos.collapsed == true){
                        scope.btnModEjercicio.disable();
                        scope.btnDelEjercicio.disable();
                    }
                }
            },
            datachanged: function() {
                if (scope.modificar)
                    for (var i = 0; i < scope.dsEjercicioContable.getCount(); i++)
                    {
                        if (scope.dsEjercicioContable.getAt(i).data.idejercicio == scope.elemsel)
                            scope.smEjercicios.selectRow(i, true);
                    }
                scope.modificar = false;
            }
        });

        scope.dsPeriodoContable.on({
            load: function(store, records, options) {
                Ext.MessageBox.hide();
                if (store.getTotalCount() != 0) {
                    if (!scope.smPeriodos.getSelected()) {
                        scope.smPeriodos.selectFirstRow();
                    }
                }
            },
            datachanged: function() {
                if (scope.modificar)
                    for (var i = 0; i < scope.dsPeriodoContable.getTotalCount(); i++)
                    {
                        if (scope.dsPeriodoContable.getAt(i).data.idperiodo == scope.elemento)
                            scope.smPeriodos.selectRow(i, true);
                    }
                scope.modificar = false;
            }
        });

        scope.gpEjercicios.getSelectionModel().on({
            rowselect: function() {
                if(scope.pnlPeriodos.collapsed == false){
                    scope.dsPeriodoContable.baseParams.idejercicio = scope.smEjercicios.getSelected().data.idejercicio;
                    scope.dsPeriodoContable.load();
                }else{
                    scope.dsPeriodoContable.removeAll();
                }
            }
        });

        scope.smEjercicios.on({
            rowselect: function(selectionModel, rowIndex, record) {
                Ext.getCmp('idgpEjercicios').getView().addRowClass(rowIndex, "negrita");
                if (selectionModel.getSelections().length <= 0) {
                    scope.btnAddPeriodo.disable();
                    scope.btnModEjercicio.disable();
                    scope.btnDelEjercicio.disable();
                } else if (selectionModel.getSelections().length >= 1) {
                    if(scope.pnlPeriodos.collapsed == true)
                        scope.btnDelEjercicio.enable();
                    if (selectionModel.getSelections().length == 1) {
                        if (selectionModel.getSelected().data.anonatural == 1) {
                            scope.btnAddPeriodo.disable();
                            scope.btnModEjercicio.disable();
                        } else {
                            scope.btnAddPeriodo.enable();
                            if(scope.pnlPeriodos.collapsed == true)
                                scope.btnModEjercicio.enable();
                            //scope.fResetValuesFecha(scope.dfInicioEjercicio, scope.dfFinEjercicio);
                            //scope.fSetValuesFechasE();
                            //scope.fResetValuesFecha(scope.dfInicioPeriodo, scope.dfFinPeriodo);
                            //scope.fSetValuesFechas(selectionModel.getSelected().data.dfDesde, selectionModel.getSelected().data.dfHasta);

                        }
                    } else {
                        scope.btnAddPeriodo.disable();
                        scope.btnModEjercicio.disable();

                    }
                }
            },
            rowdeselect: function(selectionModel, rowIndex, record) {
                Ext.getCmp('idgpEjercicios').getView().removeRowClass(rowIndex, "negrita");
                if (selectionModel.getSelections().length <= 0) {
                    scope.btnAddPeriodo.disable();
                    scope.btnModEjercicio.disable();
                    scope.btnDelEjercicio.disable();
                } else if (selectionModel.getSelections().length >= 1) {
                    if(scope.pnlPeriodos.collapsed == true)
                        scope.btnDelEjercicio.enable();
                    if (selectionModel.getSelections().length == 1) {
                        if (selectionModel.getSelected().data.anonatural == 1) {
                            scope.btnAddPeriodo.disable();
                            scope.btnModEjercicio.disable();
                        } else {
                            scope.btnAddPeriodo.enable();
                            if(scope.pnlPeriodos.collapsed == true)
                                scope.btnModEjercicio.enable();
                        }
                    } else {
                        scope.btnAddPeriodo.disable();
                        scope.btnModEjercicio.disable();
                    }
                }
            }
        });
        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return;
                }
                if (field.startDateField
                    && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax
                        .getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField
                    && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin
                        .getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                return true;
            }
        });

        Ext.apply(scope.config);
        this.items = scope.panel_completo;
        Ext.Configuracion_General_Parametros.Ejercicios.superclass.constructor.call(this, scope.config);
    }
});
Ext.reg('ejercicios', Ext.Configuracion_General_Parametros.Ejercicios);
Ext.grid.CheckColumn = function(config) {
    Ext.applyIf(this, config);
    if (!this.id) {
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};
Ext.grid.CheckColumn.prototype = {
    init: function(grid) {
        this.grid = grid;
        this.grid.on('render', function() {
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },
    onMouseDown: function(e, t) {
        if (t.className && t.className.indexOf('x-grid3-cc-' + this.id) != -1) {
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },
    renderer: function(v, p, record) {
        p.css += ' x-grid3-check-col-td';
        return '<div class="x-grid3-check-col' + (v ? '-on' : '') + ' x-grid3-cc-' + this.id + '">&#160;</div>';
    }
};
Ext.override(Ext.form.DateField, {
    initDisabledDays : function(){
        if(this.disabledDates){
            var dd = this.disabledDates;
            var re = "(?:";
            for(var i = 0; i < dd.length; i++){
                re += this.formatDate(dd[i]);
                if(i != dd.length-1) re += "|";
            }
            this.ddMatch = new RegExp(re + ")");
        }
    }
});








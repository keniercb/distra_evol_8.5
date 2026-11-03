/**
 * Formatos (version componente)
 *
 * @author Ing. Alexis Rodriguez Reyes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.Configuracion_General_Nomencladores
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Nomencladores');

Ext.Configuracion_General_Nomencladores.FormatosModel = {
    init: function (scope) {
        scope.stSubsistema = new Ext.data.Store({
            url: scope.url + 'cargarsubsistema',
            reader: new Ext.data.JsonReader({
                    totalProperty: "total",
                    root: "datos",
                    id: 'stSubsistema'
                },
                [{
                    name: 'idsubsistema'
                }, {
                    name: 'descripcion'
                }]
            )
        });
        scope.stSubsistema.load();


        scope.stFormato = new Ext.data.Store({
            url: scope.url + 'cargar',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [
                {
                    name: 'idformato'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'longitud'
                },
                {
                    name: 'separador'
                },
                {
                    name: 'estructura'
                },
                {
                    name: 'vistap'
                },
                {
                    name: 'version'
                },
                {
                    name: 'nivelpais'
                },
                {
                    name: 'idsubsistema'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'heredado'
                }
            ])
        });
        scope.stNivelFormato = new Ext.data.Store({
            url: scope.url + 'cargarpartes',
            baseParams: {
                idformato: '',
                limit: 10
            },
            listeners: {
                beforeload: function (Store, options) {
                    if (scope.sm.getSelected())
                        scope.stNivelFormato.baseParams.idformato = scope.sm.getSelected().data.idformato;
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id1"
            }, [{
                name: 'idparteformato'
            }, {
                name: 'nombre'
            }, {
                name: 'abreviatura'
            }, {
                name: 'nivel'
            }, {
                name: 'longitud'
            }, {
                name: 'idformato'
            }, {
                name: 'version'
            }, {
                name: 'confapertura', mapping: 'idconfapertura'
            }])
        });

    }
};

Ext.Configuracion_General_Nomencladores.FormatosController = {
    init: function (scope) {

        scope.recorrerFormato = function () {
            var index = scope.stFormato.find('idformato', scope.elemsel)
            if (index != -1) {
                scope.sm.selectRow(index, true);
            }

        };
        scope.winFpRegFormato = function (opcion) {
            scope.hotKeysFOrmatos.disable();
            var keyyy = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (scope.isOpenW && Ext.getCmp('idbtnWAdd') && !Ext.getCmp('idbtnWAdd').disabled) {
                            Ext.getCmp('idbtnWAdd').handler.call();
                        }
                        if (scope.isOpenW && Ext.getCmp('idbtnWMod') && !Ext.getCmp('idbtnWMod').disabled) {
                            Ext.getCmp('idbtnWMod').handler.call();
                        }

                    }

                }

            ]);

            switch (opcion) {
                case 'Ins':
                    if (!scope.winInsNCl) {

                        scope.winInsNCl = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            constrain: true,
                            title: scope.etiquetas.lbTitWinInsEst,
                            width: 460,
                            height: 280,
                            resizable: false,
                            defaultButton: 'idbtnWCancelar',
                            firstElement: scope.campoNombre,
                            keys: keyyy,
                            listeners: {
                                hide: function () {
                                    scope.isOpenW = false;
                                    Ext.getCmp('btnAddFormato').focus();
                                    scope.hotKeysFOrmatos.enable();
                                    Ext.getCmp('idbtnWAplicar').disable();
                                    Ext.getCmp('idbtnWAdd').disable();
                                }, render: function () {
                                    scope.winInsNCl.focus();
                                }
                            },
                            buttons: [{
                                iconCls: 'cancelar',
                                id: 'idbtnWCancelar',
                                text: scope.etiquetas.lbBtnCancelar,
                                tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                handler: function () {
                                    scope.winInsNCl.hide();
                                }
                            },
                                {
                                    iconCls: 'aplicar',
                                    id: 'idbtnWAplicar',
                                    disabled: true,
                                    text: scope.etiquetas.lbBtnAplicar,
                                    tooltip: scope.etiquetas.lbBtnTooltipAplicar,
                                    handler: function () {
                                        scope.adicionarFormato('apl');
                                    }
                                },
                                {
                                    iconCls: 'aceptar',
                                    id: 'idbtnWAdd',
                                    disabled: true,
                                    text: scope.etiquetas.lbBtnAceptar,
                                    tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                    handler: function () {
                                        scope.adicionarFormato();
                                        keyyy.disable();

                                    }
                                }]
                        });
                    }
                    scope.fpRegFormato.getForm().reset();
                    scope.winInsNCl.show();
                    scope.winInsNCl.add(scope.fpRegFormato);
                    scope.winInsNCl.doLayout();
                    scope.winInsNCl.center();
                    scope.nivelpais.setValue(true);
                    scope.cargarSubsitemas(scope.winInsNCl);
                    break;
                case 'Mod':
                    if (!scope.sm.getSelected())
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelMod);
                    else if (scope.sm.getSelections().length > 1)
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelModUno);
                    else {
                        if (!scope.winModNCl) {
                            scope.winModNCl = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                constrain: true,
                                layout: 'fit',
                                title: scope.etiquetas.lbTitWinModEst,
                                width: 460,
                                height: 280,
                                resizable: false,
                                defaultButton: 'idbtnWCancel',
                                firstElement: scope.campoNombre,
                                keys: keyyy,
                                listeners: {
                                    hide: function () {
                                        scope.isOpenW = false;
                                        Ext.getCmp('btnAddFormato').focus();
                                        scope.hotKeysFOrmatos.enable();
                                        Ext.getCmp('idbtnWMod').disable();
                                    }, render: function () {
                                        scope.winModNCl.focus();
                                    }
                                },
                                buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idbtnWCancel',
                                    text: scope.etiquetas.lbBtnCancelar,
                                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                    handler: function () {
                                        scope.winModNCl.hide();
                                    }
                                },
                                    {
                                        iconCls: 'aceptar',
                                        id: 'idbtnWMod',
                                        disabled: true,
                                        text: scope.etiquetas.lbBtnAceptar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                        handler: function () {
                                            scope.VerificarDatFormat();
                                            keyyy.disable();
                                        }
                                    }]
                            });
                        }
                        scope.winModNCl.show();
                        scope.winModNCl.add(scope.fpRegFormato);
                        scope.winModNCl.doLayout();
                        scope.winModNCl.center();
                        scope.cargarSubsitemas(scope.winModNCl, function () {
                            scope.subsistemacb.setValue(scope.sm.getSelected().data.idsubsistema);
                            scope.fpRegFormato.getForm().loadRecord(scope.sm.getSelected());
                            scope.campoNombre.setValue(scope.campoNombre.getValue().replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''));
                            scope.separador.setValue(scope.separador.getValue().replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''));
                            scope.descrip.setValue(scope.descrip.getValue().replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''));
                        });
                    }
                    break;
            }
        };
        scope.winfpRegNivelFormato = function (opcion) {
            scope.hotKeysFOrmatos.disable();
            var keyyyy = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (scope.isOpenW && Ext.getCmp('idbtnAceptarAddN') && !Ext.getCmp('idbtnAceptarAddN').disabled) {
                            Ext.getCmp('idbtnAceptarAddN').handler.call();
                        }
                        if (scope.isOpenW && Ext.getCmp('idbtnAceptarMod') && !Ext.getCmp('idbtnAceptarMod').disabled) {
                            Ext.getCmp('idbtnAceptarMod').handler.call();
                        }

                    }

                }

            ]);
            switch (opcion) {
                case 'Ins':
                    if (!scope.sm.getSelected())
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelAdicionar);
                    else if (scope.sm.getSelections().length > 1)
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelAdicionarUno);
                    else {
                        if (!scope.winInsNClA) {
                            scope.winInsNClA = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: scope.etiquetas.lbTitWinNivelA,
                                constrain: true,
                                width: 380,
                                height: 230,
                                resizable: false,
                                defaultButton: 'idbtnWFCancelar',
                                firstElement: scope.nombreNivel,
                                keys: keyyyy,
                                listeners: {
                                    hide: function () {
                                        scope.isOpenW = false;
                                        Ext.getCmp('btnAddNivel').focus();
                                        scope.hotKeysFOrmatos.enable();
                                        Ext.getCmp('idbtnAceptarAddN').disable();
                                        Ext.getCmp('idbtnWFAplicar').disable();
                                    }, render: function () {
                                        scope.winInsNClA.focus();

                                    }
                                },
                                buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idbtnWFCancelar',
                                    text: scope.etiquetas.lbBtnCancelar,
                                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                    handler: function () {
                                        scope.winInsNClA.hide();
                                    }
                                },
                                    {
                                        iconCls: 'aplicar',
                                        id: 'idbtnWFAplicar',
                                        disabled: true,
                                        text: scope.etiquetas.lbBtnAplicar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAplicar,
                                        handler: function () {
                                            scope.adicionarNivelFormato('apl');
                                            keyyyy.disable();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        id: 'idbtnAceptarAddN',
                                        disabled: true,
                                        text: scope.etiquetas.lbBtnAceptar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                        handler: function () {
                                            scope.adicionarNivelFormato();
                                            keyyyy.disable();
                                        }
                                    }]
                            });
                        }
                        scope.fpRegNivelFormato.getForm().reset();
                        scope.winInsNClA.show();
                        scope.winInsNClA.add(scope.fpRegNivelFormato);
                        scope.winInsNClA.doLayout();
                        scope.winInsNClA.center();
                    }
                    break;
                case 'Mod':
                    if (!scope.sm1.getSelected())
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelModNivel);
                    else {
                        if (!scope.winModNClA) {
                            scope.winModNClA = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                constrain: true,
                                layout: 'fit',
                                defaultButton: 'idbtnWFCancel',
                                firstElement: scope.nombreNivel,
                                keys: keyyyy,
                                listeners: {
                                    hide: function () {
                                        scope.isOpenW = false;
                                        Ext.getCmp('btnAddNivel').focus();
                                        scope.hotKeysFOrmatos.enable();
                                        Ext.getCmp('idbtnAceptarMod').disable();
                                    }, render: function () {
                                        scope.winModNClA.focus();

                                    }
                                },
                                title: scope.etiquetas.lbTitWinNivelD,
                                width: 380,
                                height: 230,
                                resizable: false,
                                buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idbtnWFCancel',
                                    text: scope.etiquetas.lbBtnCancelar,
                                    tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                                    handler: function () {
                                        scope.winModNClA.hide();
                                    }
                                },
                                    {
                                        iconCls: 'aceptar',
                                        id: 'idbtnAceptarMod',
                                        disabled: true,
                                        text: scope.etiquetas.lbBtnAceptar,
                                        tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                                        handler: function () {
                                            scope.VerificarDatNivel();
                                            keyyyy.disable();
                                        }
                                    }]
                            });
                        }
                        scope.winModNClA.show();
                        scope.winModNClA.add(scope.fpRegNivelFormato);
                        scope.winModNClA.doLayout();
                        scope.winModNClA.center();
                        var mask = new Ext.LoadMask(scope.winModNClA.el, {msg: scope.etiquetas.lbMsgCargando});
                        mask.show();
                        scope.stApertura.load({
                            callback: function () {
                                scope.fpRegNivelFormato.getForm().loadRecord(scope.sm1.getSelected());
                                mask.hide();
                            }
                        });

                    }
                    break;
            }
        };
        scope.buscarFormato = function (aCodigo, aSeparador) {
            scope.stFormato.baseParams.start = '';
            scope.stFormato.baseParams.limit = '';
            scope.stFormato.baseParams.sfFiltro = Ext.getCmp('sfFormatos').getRawValue();
            scope.stFormato.load();
        };
        scope.eliminarFormato = function () {
            if (!scope.sm.getSelected())
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElForm);
            else {
                if (scope.sm.getSelections().length > 1)
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelElForm2, elimina)
                else
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelElForm1, elimina)
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.Msg.wait("Eliminando datos del formato...", "Por favor espere...");
                    var id = "";
                    var formatos = [];
                    var selection = scope.sm.getSelections();
                    for (var i = 0; i < selection.length; i++)
                        formatos.push({
                            idformato: selection[i].json.idformato,
                            heredado: selection[i].json.heredado
                        })
                    Ext.Ajax.request({
                        url: scope.url + 'eliminarformato',
                        method: 'POST',
                        //params:{idformato:id},
                        params: {
                            formatos: Ext.encode(formatos)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            //mostrarMensaje(responseData.codMsg,responseData.mensaje);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgElimuchosOk);
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgElimOk)
                                    break
                                case -3:
                                    mostrarMensaje(3, scope.etiquetas.lbMsgError)
                                    break
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbEsdeUso)
                                    break
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                            scope.stFormato.load();
                            scope.stNivelFormato.load();
                            scope.windowopen = false;


                        }
                    });
                } else {
                    Ext.getCmp('btnAddFormato').focus();
                }
                scope.isOpenW = false;
            }
        };
        scope.eliminarNivelFormato = function () {
            if (!scope.sm1.getSelected()) {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElForm);
            } else {
                if (scope.sm1.getSelections().length > 1)
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelElFormNiveles, eliminaNivel)
                else {
                    mostrarMensaje(2, scope.etiquetas.lbMsgSelElFormNivel, eliminaNivel)
                }
            }


            function eliminaNivel(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.Msg.wait("Eliminando datos del nivel formato...", "Por favor espere...");
                    var idpartef = "";
                    var cant = scope.sm1.getSelections().length;

                    for (var i = 0; i < cant; i++)
                        if (i < cant - 1) {
                            idpartef += scope.sm1.getSelections()[i].get('idparteformato') + ",";
                            //sm1.deselectRange( 1,sm1.getCount());

                        }
                        else {
                            idpartef += scope.sm1.getSelections()[i].get('idparteformato');
                            //sm1.deselectRange( 1,sm1.getCount());
                        }

                    //elemsel = sm.getSelections()[0].get('idformato');  
                    if (scope.sm.getSelections().length > 0) {
                        Ext.Ajax.request({
                            url: scope.url + 'eliminarparteformato',
                            method: 'POST',
                            params: {
                                idparteformato: idpartef,
                                idformato: scope.sm.getSelections()[0].get('idformato')
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                Ext.Msg.hide();
                                //mostrarMensaje(responseData.codMsg,responseData.mensaje);	

                                switch (responseData.codMsg) {
                                    case -1:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgElimNOk);
                                        break;
                                    case -2:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgElimuchosNOk);
                                        break
                                    case -3:
                                        mostrarMensaje(7, 'No se puede eliminar porque se encuentra en uso.');
                                        break
                                    case -4:
                                        mostrarMensaje(1, scope.etiquetas.lbMsgNoDel);
                                        break
                                    default:
                                        mostrarMensaje(scope.responseData.codMsg, scope.responseData.mensaje);
                                        break;
                                }
                                scope.windowopen = false;
                                scope.modificarparte = true;
                                scope.stFormato.load();
                                scope.stNivelFormato.load();
                            }
                        });
                    } else {
                        mostrarMensaje(1, scope.etiquetas.lbMsgSelElForm);
                    }
                } else {
                    Ext.getCmp('btnAddNivel').focus();
                }
                scope.isOpenW = false;
            }
        };
        scope.adicionarFormato = function (apl) {
            scope.campoNombre.setValue(scope.limpiarEspacios(scope.campoNombre.getValue()));
            scope.descrip.setValue(scope.limpiarEspaciosInicioFin(scope.descrip.getValue()));
            if (scope.fpRegFormato.getForm().isValid()) {
                scope.fpRegFormato.getForm().submit({
                    url: scope.url + 'insertarformato',
                    params: {
                        idsubsistema: scope.subsistemacb.getValue()
                    },
                    waitMsg: scope.etiquetas.lbWaitMsgRegEst,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1:
                                mostrarMensaje(1, scope.etiquetas.lbMsgConfRegOk);
                                scope.fpRegFormato.getForm().reset();
                                scope.nivelpais.setValue(true);
                                scope.stFormato.load();
                                if (apl != 'apl') {
                                    scope.winInsNCl.hide();
                                }
                                break;
                            case -2:
                                mostrarMensaje(1, scope.etiquetas.lbssmExisteF);
                                break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }
                        scope.stFormato.load();

                    }
                });
            } else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.limpiarEspacios = function (s) {
            var before = s;
            s = s.replace(/\s+/gi, ' '); //sacar espacios repetidos dejando solo uno
            s = s.replace(/^\s+|\s+$/gi, ''); //sacar espacios blanco principio y final
            return s;
        };
        scope.limpiarEspaciosInicioFin = function (s) {
            s = s.replace(/^\s+|\s+$/gi, '');
            return s;
        };
        scope.adicionarNivelFormato = function (apl) {
            scope.nombreNivel.setValue(scope.limpiarEspacios(scope.nombreNivel.getValue()));
            if (scope.fpRegNivelFormato.getForm().isValid()) {
                if (scope.longitud.getRawValue() == 0)
                    mostrarMensaje(1, scope.etiquetas.lbMsgSelLongForm);
                else {
                    scope.fpRegNivelFormato.getForm().submit({
                        url: scope.url + 'inspformato',
                        params: {
                            idformato: scope.sm.getSelected().data.idformato,
                            idconfapertura: scope.cmbApertura.getValue() || null
                        },
                        waitMsg: scope.etiquetas.lbWaitMsgRegEstNivel,
                        failure: function (form, action) {
                            switch (action.result.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgConfRegNOk);
                                    scope.fpRegNivelFormato.getForm().reset();
                                    scope.stFormato.load();
                                    if (!apl) {
                                        scope.winInsNClA.hide();
                                    } else {
                                        Ext.getCmp('idbtnWFAplicar').disable();
                                        Ext.getCmp('idbtnAceptarAddN').disable();
                                    }
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbssmExisteNN);
                                    if (scope.sm.getSelected)
                                        scope.stFormato.load();
                                    break
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    if (scope.sm.getSelected)
                                        scope.stFormato.load();
                                    break;
                            }


                            scope.elemsel = scope.sm.getSelected().data.idformato;
                            scope.modificarparte = true;
                            //                        stFormato.reload();
                            //stNivelFormato.reload();

                        }
                    });
                }

            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.modificarFormato = function () {
            scope.campoNombre.setValue(scope.limpiarEspacios(scope.campoNombre.getValue()));
            scope.descrip.setValue(scope.limpiarEspaciosInicioFin(scope.descrip.getValue()));
            if (scope.fpRegFormato.getForm().isValid()) {
                scope.fpRegFormato.getForm().submit({
                    url: scope.url + 'modificarformato',
                    params: {
                        idformato: scope.sm.getSelected().data.idformato,
                        version: scope.sm.getSelected().data.version,
                        idsubsistema: scope.subsistemacb.getValue()
                    },
                    waitMsg: scope.etiquetas.lbWaitMsgRegEst,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1:
                                mostrarMensaje(1, scope.etiquetas.lbMsgModOk);
                                scope.elemsel = scope.sm.getSelected().data.idformato;
                                scope.modificarparte = true;
                                scope.stFormato.load();
                                scope.winModNCl.hide();
                                break;
                            case -2:
                                mostrarMensaje(1, scope.etiquetas.lbssmExiste);
                                break
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.modificarNivelFormato = function () {
            scope.nombreNivel.setValue(scope.limpiarEspacios(scope.nombreNivel.getValue()));
            if (scope.fpRegNivelFormato.getForm().isValid()) {
                if (scope.longitud.getRawValue() == 0)
                    mostrarMensaje(1, scope.etiquetas.lbMsgSelLongForm);
                else
                //MostrarMascara('Modificando...');
                    scope.fpRegNivelFormato.getForm().submit({
                        url: scope.url + 'modificarparteformato',
                        params: {
                            idparteformato: scope.sm1.getSelected().data.idparteformato,
                            version: scope.sm1.getSelected().data.version,
                            idformato: scope.sm.getSelected().data.idformato,
                            idconfapertura: scope.cmbApertura.getValue() || null
                        },
                        waitMsg: scope.etiquetas.lbWaitMsgRegEstNivel,
                        failure: function (form, action) {
                            /*mostrarMensaje(action.result.codMsg, action.result.mensaje);
                             if (action.result.codMsg != 3){

                             elemsel = sm.getSelected().data.idformato;												
                             modificarparte=true;
                             stFormato.reload();					
                             //stNivelFormato.reload();
                             winModNClA.hide();
                             }*/
                            //loadMask.hide();
                            switch (action.result.codMsg) {
                                case -1:
                                    scope.elemsel = scope.sm.getSelected().data.idformato;
                                    mostrarMensaje(1, scope.etiquetas.lbMsgModNOk);
//                                        stFormato.load();
                                    scope.modificarparte = true;
//                                    scope.stNivelFormato.reload({
//                                        callback: function(){
                                    scope.stFormato.reload();
//                                        }
//                                    });
//                                    scope.stFormato.reload();
                                    scope.winModNClA.hide();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbssmExisteN);
                                    break
                            }
                        }
                    });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.modvalej = function (v) {
            scope.valej = v;
        };
        scope.VerificarDatFormat = function () {
            if (scope.fpRegFormato.getForm().isValid()) {
                scope.modvalej(false);
                (scope.nivelpais.getValue()) ? nv = 1 : nv = 0;
                Ext.Ajax.request({
                    url: scope.url + 'verifdatejformat',
                    params: {
                        idformato: scope.sm.getSelected().data.idformato,
                        nombre: scope.campoNombre.getValue(),
                        descripcion: scope.descrip.getValue(),
                        separador: scope.separador.getRawValue(),
                        nivelpais: nv,
                        idsubsistema: scope.subsistemacb.getValue()
                    },
                    method: 'POST',
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.retorno == 1) {
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelLongFormMod);
                            scope.modvalej(false);
                        }
                        else
                            scope.modificarFormato();
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.VerificarDatNivel = function () {
            if (scope.fpRegNivelFormato.getForm().isValid()) {
                Ext.Ajax.request({
                    url: scope.url + 'verifdatpartform',
                    params: {
                        idparteformato: scope.sm1.getSelected().data.idparteformato,
                        nombre: scope.nombreNivel.getValue(),
                        abreviatura: scope.abrev.getValue(),
                        longitud: scope.longitud.getValue(),
                        idconfapertura: scope.cmbApertura.getValue()
                    },
                    method: 'POST',
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.retorno == -1)
                            mostrarMensaje(1, scope.etiquetas.lbMsgSelLongFormModNivel);
                        else
                            scope.modificarNivelFormato();
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.lbMsgSelElFormVerificar);
            }
        };
        scope.compararEspacio = function (ar) {
            for (var i = 0; i < ar.length; i++)
                if (ar.charAt(i) != ' ')
                    return false;
            return true;
        };
        scope.createWindowExtend = function () {
            scope.btnCancelarHeredar = new Ext.Button({
                id: 'btnCancelarHeredar',
                iconCls: 'cancelar',
                text: scope.etiquetas.lbBtnCancelar,
                tooltip: scope.etiquetas.lbBtnTooltipCancelar,
                handler: function () {
                    scope.winGestionar.close();
                }
            });

            scope.btnAceptarHeredar = new Ext.Button({
                id: 'btnAceptarHeredar',
                iconCls: 'aceptar',
                disabled: true,
                text: scope.etiquetas.lbBtnAceptar,
                tooltip: scope.etiquetas.lbBtnTooltipAceptar,
                handler: function () {
                    scope.heredar();
                }
            });

            // GRID HEREDAR
            scope.stGridHeredar = new Ext.data.JsonStore({
                url: scope.url + 'cargarFormatosHeredar',
                root: 'data',
                totalProperty: 'total',
                fields: [
                    {
                        name: 'nombre'
                    },
                    {
                        name: 'descripcion'
                    },
                    {
                        name: 'longitud'
                    },
                    {
                        name: 'separador'
                    },
                    {
                        name: 'estructura'
                    },
                    {
                        name: 'vistap'
                    }
                ]
            });

            // ------- TOOLBAR ------ //
            /*var sfBuscarFormHeredar = SearchField();
             var toolbarFormHeredar = new Ext.Toolbar({
             id: 'heredar',
             items: [sfBuscarDest]
             })*/
            // ------- SELECTION MODEL ------ //
            scope.smHeredar = new Ext.grid.CheckboxSelectionModel({
                singleSelect: false
            });
            scope.gridHeredar = new Ext.grid.GridPanel({
                id: 'gridHeredar',
                layout: 'fit',
                store: scope.stGridHeredar,
                sm: scope.smHeredar,
                viewConfig: {forceFit: true},
                loadMask: true,
                frame: false,
                border: false,
                stripeRows: true,
                autoExpandColumn: 'descripcion',
                columns: [
                    scope.smHeredar,
                    {
                        id: 'nombre',
                        //hidden: true,
                        sortable: true,
                        header: scope.etiquetas.lbNombreFormato,
                        width: 200,
                        dataIndex: 'nombre'
                    }, {
                        id: 'descripcion',
                        sortable: true,
                        header: scope.etiquetas.lbDescripcion,
                        width: 200,
                        dataIndex: 'descripcion'
                    },
                    {
                        header: scope.etiquetas.lbLongitud,
                        dataIndex: 'longitud',
                        width: 60,
                        sortable: true
                    },
                    {
                        header: scope.etiquetas.lbSeparador,
                        dataIndex: 'separador',
                        width: 70,
                        sortable: true
                    },
                    {
                        header: scope.etiquetas.lbEstructura,
                        dataIndex: 'estructura',
                        width: 310,
                        sortable: true
                    },
                    {
                        header: scope.etiquetas.lbVistap,
                        dataIndex: 'vistap',
                        width: 170,
                        sortable: true
                    }
                ],
                //tbar: [this.toolbarDest],
                bbar: new Ext.Cont.PagingToolbar({
                    pageSize: 20,
                    store: scope.stGridHeredar,
                    displayInfo: true,
                    displayMsg: scope.etiquetas.lbDisplayMsg,
                    emptyMsg: scope.etiquetas.emptyMsg, //'0 Resultado a mostrar',
                    firstText: scope.etiquetas.lbPrimeraPagina,
                    lastText: scope.etiquetas.lbUltimaPagina
                })
            });

            scope.winGestionar = new Ext.Window({
                id: 'winGestionar',
                title: scope.etiquetas.lnTitleWindHeredar,
                modal: true,
                constrain: true,
                layout: 'fit',
                closeAction: 'close',
                bodyStyle: 'padding: 0px 5px 0px 5px',
                listeners: {
                    hide: function () {
                        scope.isOpenW = false;
                    }
                },
                items: [scope.gridHeredar],
                buttons: [scope.btnCancelarHeredar, scope.btnAceptarHeredar]
            });

            scope.addEventsHeredar();
            scope.MostrarMascara(scope.etiquetas.msgLoading);
            scope.stGridHeredar.load({
                callback: function (records, options, success) {
                    loadMask.hide();
                    scope.winGestionar.show(Ext.getBody(), function () {
                        this.maximize();
                        if (records.length == 0) {
//                            scope.notifyEvent(scope.gridHeredar.body.dom, scope.etiquetas.titleInfo, scope.etiquetas.msgNoFormatHeredar, 1, 3000, function() {
//                                scope.winGestionar.close();
//                            });
                            mostrarMensaje(1, scope.etiquetas.msgNoFormatHeredar);
                            scope.winGestionar.close();
                        }
                    });
                }
            });
        };
        scope.addEventsHeredar = function () {
            scope.smHeredar.on({
                rowselect: function (selectioModel, rowIndex, record) {
                    scope.btnAceptarHeredar.enable();
                },
                rowdeselect: function (selectioModel, rowIndex, record) {
                    if (selectioModel.hasSelection()) {
                        scope.btnAceptarHeredar.enable();
                    } else {
                        scope.btnAceptarHeredar.disable();
                    }
                }
            });
        };
        scope.heredar = function () {
            if (scope.smHeredar.hasSelection()) {
                var selections = scope.smHeredar.getSelections();
                var arrayIds = [];
                for (var i = 0; i < selections.length; i++) {
                    arrayIds.push({
                        id: selections[i].json.idformato,
                        nombre: selections[i].json.nombre
                    });
                }
                Ext.Ajax.request({
                    url: scope.url + 'heredarFormatos',
                    method: 'POST',
                    params: {
                        formatos: Ext.encode(arrayIds)
                    },
                    callback: function (options, success, response) {
                        if (!response.responseText)
                            mostrarMensaje(3, scope.etiquetas.msgDeafultError);
                        else {
                            var responseData = Ext.decode(response.responseText);
                            switch (responseData.code) {
                                case 1:
                                    var mensaje = arrayIds.length > 1 ? scope.etiquetas.msgEntendOKPlural : scope.etiquetas.msgEntendOK;
                                    mostrarMensaje(1, mensaje);
                                    scope.stFormato.load();
                                    scope.winGestionar.close();
                                    break;
                                case 2:
                                    mostrarMensaje(1, scope.etiquetas.msgNoFormatSelected);
                                    break;
                                case 3:
                                    if (responseData.errors.length > 0) {
                                        var formatosErrores = responseData.errors.join(",");
                                        var mensaje = responseData.errors.length == 1 ? scope.etiquetas.msgFormatosNoheredados.replace("<formatos>", formatosErrores)
                                            : scope.etiquetas.msgFormatosNoheredadosPlural.replace("<formatos>", formatosErrores);
                                        if (responseData.success.length > 0) {
                                            scope.MsgPersonalizado({
                                                title: scope.etiquetas.titleInfo,
                                                buttons: Ext.Msg.OK,
                                                msg: scope.etiquetas.msgHeredadosParcialmente,
                                                icon: Ext.Msg.INFO,
                                                fn: function () {
//                                                    scope.notifyEvent(scope.gridHeredar.body.dom, scope.etiquetas.titleInfo, mensaje, 1, 3000, function() {
//                                                        scope.winGestionar.close();
//                                                    });
                                                    mostrarMensaje(1, mensaje);
                                                }
                                            });
                                        } else {
//                                            scope.notifyEvent(scope.gridHeredar.body.dom, scope.etiquetas.titleInfo, mensaje, 1, 3000);
                                            mostrarMensaje(1, mensaje);
                                        }
                                    } else {
                                        mostrarMensaje(3, scope.etiquetas.msgDeafultError, function () {
                                        });
                                    }

                                    break;
                                default:
                                    mostrarMensaje(3, scope.etiquetas.msgDeafultError, function () {
                                    });
                                    break;
                            }
                        }
                    }
                });
            } else {
                mostrarMensaje(1, scope.etiquetas.msgNoFormatSelected);
            }
        };
        scope.MostrarMascara = function (mensaje) {
            loadMask = new Ext.LoadMask(Ext.getBody(), {
                msg: mensaje
            });
            loadMask.show();
        };
        scope.notifyEvent = function (animateTarget, title, msg, icon, time, callback) {
            var notification = new Ext.ux.Notification({
                animateTarget: animateTarget,
                fnc: (callback) ? callback : Ext.emptyFn,
                iconbox: icon,
                iconCls: "icon-waiting",
                title: title,
                html: msg,
                hideDelay: (time) ? time : 5000
            });
            notification.box();
        };
        scope.MsgPersonalizado = function (options) {
            Ext.Msg.show({
                title: options.title,
                buttons: options.buttons,
                msg: options.msg,
                icon: options.icon,
                fn: options.fn
            });
        };
        scope.notifyEvent = function (animateTarget, title, msg, icon, time, callback) {
            var notification = new Ext.Cont.Notification({
                animateTarget: animateTarget,
                fnc: (callback) ? callback : Ext.emptyFn,
                iconbox: icon,
                iconCls: "icon-waiting",
                title: title,
                html: msg,
                hideDelay: (time) ? time : 5000
            });
            notification.box();
        };
        scope.cargarSubsitemas = function (window, fn) {
            var mask = new Ext.LoadMask(window.el, {msg: scope.etiquetas.lbMsgCargando});
            mask.show();
            scope.stSubsistema.load({
                callback: function () {
                    mask.hide();
                    if (typeof fn == 'function') {
                        fn.call(scope);
                    }
                }
            });
        }


    }
};
function changevalue() {
    var changed = false;
    var newvalue = scope.fpRegFormato.getForm().getValues();
    newvalue.nivelpais = scope.nivelpais.getValue();
    var oldvalue = scope.gpdat_formato.getSelectionModel().getSelected().data;
    for (k in newvalue) {
        if (newvalue[k].toString() != oldvalue[k].toString().replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')) {
            changed = true;
            break;
        }


    }
    return changed;
}
function changeNF() {
    var changed = false;
    var newvalue = scope.fpRegNivelFormato.getForm().getValues();
    var oldvalue = Ext.getCmp('gpNivelFormato').getSelectionModel().getSelected().data;
    newvalue['confapertura'] = scope.cmbApertura.getValue() || '';
    for (k in newvalue) {
        oldvalue[k] = oldvalue[k] || '';
        if (newvalue[k].toString() != oldvalue[k].toString()) {

            changed = true;
            break;
        }


    }
    return changed;
}
function comprobarVentanaNF() {

    if (scope.fpRegNivelFormato.getForm().isValid()) {
        if (Ext.getCmp('idbtnWFAplicar')) {
            Ext.getCmp('idbtnWFAplicar').enable();
        }
        if (Ext.getCmp('idbtnAceptarAddN')) {
            Ext.getCmp('idbtnAceptarAddN').enable();
        }
        if (Ext.getCmp('idbtnAceptarMod')) {
            if (changeNF()) {
                Ext.getCmp('idbtnAceptarMod').enable();
            }
            else {
                Ext.getCmp('idbtnAceptarMod').disable();
            }
        }
    }
    else {
        if (Ext.getCmp('idbtnWFAplicar')) {
            Ext.getCmp('idbtnWFAplicar').disable();
        }
        if (Ext.getCmp('idbtnAceptarAddN')) {
            Ext.getCmp('idbtnAceptarAddN').disable();
        }
        if (Ext.getCmp('idbtnAceptarMod')) {
            Ext.getCmp('idbtnAceptarMod').disable();
        }
    }


}
function comprobarVentana() {
    if (scope.fpRegFormato.getForm().isValid()) {
        if (Ext.getCmp('idbtnWAplicar')) {
            Ext.getCmp('idbtnWAplicar').enable();
        }
        if (Ext.getCmp('idbtnWMod')) {
            if (changevalue()) {
                Ext.getCmp('idbtnWMod').enable();
            }
            else {
                Ext.getCmp('idbtnWMod').disable();
            }
        }

        if (Ext.getCmp('idbtnWAdd')) {
            Ext.getCmp('idbtnWAdd').enable();
        }

    }
    else {
        if (Ext.getCmp('idbtnWAplicar')) {
            Ext.getCmp('idbtnWAplicar').disable();
        }
        if (Ext.getCmp('idbtnWAdd')) {
            Ext.getCmp('idbtnWAdd').disable();
        }
        if (Ext.getCmp('idbtnWMod')) {
            Ext.getCmp('idbtnWMod').disable();
        }
    }
}
Ext.Configuracion_General_Nomencladores.Formatos = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.QuickTips.init();
        scope = this;
        scope.windowOp = false;
        scope.etiquetas = Conf.Formatos.etiquetas;
        scope.url = '/configuracion/formatos/index.php/formatos/';
        scope.perfil = window.parent.UCID.portal.perfil;
        scope.config = config;
        scope.hideBtns = Conf.CargaInicial ? false : true;
        actionValidate.validate();

        ///...variables...///
        scope.isOpenW = false;
        scope.busquedanivelFormato;
        scope.busqueda = false;
        scope.modificar = false;
        scope.modificarparte = false;
        scope.elemsel;
        scope.valej;

        scope.model = Ext.Configuracion_General_Nomencladores.FormatosModel;
        scope.model.init(scope);
        scope.controller = Ext.Configuracion_General_Nomencladores.FormatosController;
        scope.controller.init(scope);
        scope.init(scope);
    },
    init: function (scope) {

        scope.sm = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (smodel, rowIndex, record) {
                    Ext.getCmp('gpdat_formato').getView().addRowClass(rowIndex, "negrita");
                    var numSel = smodel.getCount();
                    switch (numSel) {
                        case 0:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').disable();
                            Ext.getCmp('btnDelFormato').disable();
                            Ext.getCmp('btnAddNivel').disable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            scope.sm1.clearSelections();
                            scope.gridNivelFormato.getStore().removeAll();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').enable();
                            Ext.getCmp('btnDelFormato').enable();
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            if (record.json.heredado == 0) {
                                Ext.getCmp('btnModFormato').enable();
                            } else {
                                Ext.getCmp('btnModFormato').disable();
                                Ext.getCmp('gpdat_formato').getView().addRowClass(rowIndex, "green");
                            }
                            scope.stNivelFormato.load();
                        }
                            break;
                        default:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').disable();
                            Ext.getCmp('btnDelFormato').enable();
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            scope.sm1.clearSelections();
                            scope.gridNivelFormato.getStore().removeAll();
                        }
                            break;
                    }
                    scope.gridNivelFormato.expand();
                },
                rowdeselect: function (smodel, rowIndex, record) {
                    Ext.getCmp('gpdat_formato').getView().removeRowClass(rowIndex, "negrita");
                    var numSel = smodel.getCount();
                    switch (numSel) {
                        case 0:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').disable();
                            Ext.getCmp('btnDelFormato').disable();
                            Ext.getCmp('btnAddNivel').disable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            scope.sm1.clearSelections();
                            scope.gridNivelFormato.getStore().removeAll();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').enable();
                            Ext.getCmp('btnDelFormato').enable();
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            if (record.json.heredado == 0) {
                                Ext.getCmp('btnModFormato').enable();
                            } else {
                                Ext.getCmp('btnModFormato').disable();
                                Ext.getCmp('gpdat_formato').getView().addRowClass(rowIndex, "green");
                            }
                            scope.stNivelFormato.load();
                        }
                            break;
                        default:
                        {
                            Ext.getCmp('btnAddFormato').enable();
                            Ext.getCmp('btnModFormato').disable();
                            Ext.getCmp('btnDelFormato').enable();
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                            scope.sm1.clearSelections();
                            scope.gridNivelFormato.getStore().removeAll();
                        }
                            break;
                    }
                }
            }
        });
        scope.sm1 = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (smodel, rowIndex, record) {
                    Ext.getCmp('gpNivelFormato').getView().addRowClass(rowIndex, "negrita");
                    var numSel = smodel.getCount();
                    var cant = Ext.getCmp('gpNivelFormato').getStore().getCount() - 1;


                    switch (numSel) {
                        case 0:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').enable();
                            Ext.getCmp('btnDelNivel').enable();
                        }
                            break;
                        default:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                        }
                            break;
                    }
                    if (cant !== rowIndex) {
                        Ext.getCmp('btnDelNivel').disable();
                    }
                },
                rowdeselect: function (smodel, rowIndex, record) {
                    Ext.getCmp('gpNivelFormato').getView().removeRowClass(rowIndex, "negrita");
                    var numSel = smodel.getCount();
                    switch (numSel) {
                        case 0:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').enable();
                            Ext.getCmp('btnDelNivel').enable();
                        }
                            break;
                        default:
                        {
                            Ext.getCmp('btnAddNivel').enable();
                            Ext.getCmp('btnModNivel').disable();
                            Ext.getCmp('btnDelNivel').disable();
                        }
                            break;
                    }
                }
            }
        });
        scope.stFormato.load();
        scope.stFormato.on({
            load: function () {
                if (scope.stFormato.getTotalCount() != 0) {
//                      botonMod1.enable();
//                      botonElim1.enable();
                    if (!scope.sm.getSelected() && !scope.modificar) {
                        //scope.sm.selectFirstRow();
                        scope.modificar = false;
                    }
                } else {
                    if (scope.busqueda) {
                        scope.stNivelFormato.removeAll();
                        mostrarMensaje(1, scope.etiquetas.lbToolTipNoResult);
//                        scope.notifyEvent(scope.gpdat_formato.el.dom, scope.etiquetas.lbinformacion, scope.etiquetas.lbToolTipNoResult, 1, 3000);

                        scope.busqueda = false;
                    }
                    else {
//                        scope.notifyEvent(scope.gpdat_formato.el.dom, scope.etiquetas.titleInfo, scope.etiquetas.NoExisDQM, 1, 3000);
                        mostrarMensaje(1, scope.etiquetas.NoExisDQM);
                    }
//                      botonMod1.disable();
//                      botonElim1.disable();
                }
            },
            datachanged: function () {
                if (scope.modificarparte)
                    scope.recorrerFormato();
                scope.modificarparte = false;

            }
        });
        scope.stNivelFormato.on({
            load: function () {
                if (scope.stNivelFormato.getTotalCount() != 0) {
                    if (!scope.sm1.getSelected()) {
                        //scope.sm1.selectFirstRow();
                    }
                } else {
                    if (scope.stNivelFormato.getTotalCount() == 0) {
                        if (scope.busquedanivelFormato) {
                            notifyEvent(scope.gridNivelFormato.el.dom, scope.etiquetas.informacion, scope.etiquetas.lbToolTipNoResult);
                            scope.busquedanivelFormato = false;
                        }
                    }
                }
            }
        });

        var tbar = [new Ext.Button({
            id: 'btnAddFormato',
            iconCls: 'adicionar',
            hidden: scope.hideBtns,
            tooltip: scope.etiquetas.lbToolTipAdFormato,
            text: scope.etiquetas.lbBtnAdicionar,
            handler: function () {
                scope.isOpenW = true;
                scope.winFpRegFormato('Ins');
            }
        }),
            scope.botonMod1 = new Ext.Button({
                id: 'btnModFormato',
                iconCls: 'modificar',
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.lbToolTipModFormato,
                text: scope.etiquetas.lbBtnModificar,
                disabled: true,
                handler: function () {
                    scope.isOpenW = true;
                    scope.winFpRegFormato('Mod');
                }

            }),
            scope.botonElim1 = new Ext.Button({
                id: 'btnDelFormato',
                iconCls: 'eliminar',
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.lbToolTipElFormato,
                text: scope.etiquetas.lbBtnEliminar,
                disabled: true,
                handler: function () {
                    scope.isOpenW = true;
                    scope.eliminarFormato();
                }

            }),
            scope.btnHeredar = new Ext.Button({
                id: 'btnHeredarFormato',
                iconCls: 'heredar',
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.tooltipHeredar,
                text: scope.etiquetas.labelBtnHeredar,
                handler: function () {
                    scope.isOpenW = true;
                    scope.createWindowExtend();
                }
            }), '->'
        ];
        if (!(Conf && Conf.CargaInicial && Conf.CargaInicial.Vista && Conf.CargaInicial.Vista.cmbOrgano)) {
            scope.cmbOrganos = new Ext.CmbOrganos({
                idioma: scope.etiquetas,
                gridStore: scope.stFormato
            });
            tbar.push(scope.cmbOrganos);
        }
        tbar.push(scope.btnAyuda = new Ext.Button({
            text: scope.etiquetas.lbBtnAyuda,
            id: 'btnAyudaFormato',
            iconCls: 'ayuda',
            tooltip: scope.etiquetas.lntooltipWindAyuda
        }));
        scope.gpdat_formato = new Ext.grid.GridPanel({
            id: 'gpdat_formato',
            frame: false,
            border: false,
            loadMask: scope.etiquetas.lbMsgCargando,
            autoExpandColumn: 'descripcion',
            store: scope.stFormato,
            stripeRows: true,
            sm: scope.sm,
            region: 'center',
            floating: false,
            columns: [{
                dataIndex: 'idformato',
                hidden: true,
                width: 0,
                hideable: false
            },
                {
                    header: scope.etiquetas.lbNombre,
                    dataIndex: 'nombre',
                    width: 200,
                    sortable: true
                },
                {
                    id: 'descripcion',
                    header: scope.etiquetas.lbDescripcion,
                    dataIndex: 'descripcion',
                    width: 200,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbLongitud,
                    dataIndex: 'longitud',
                    width: 70,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbSeparador,
                    dataIndex: 'separador',
                    width: 75,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbEstructura,
                    dataIndex: 'estructura',
                    width: 150,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbVistap,
                    dataIndex: 'vistap',
                    width: 130,
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbSubsistema,
                    dataIndex: 'denominacion',
                    width: 140,
                    sortable: true
                },
                {
                    dataIndex: 'idsubsistema',
                    hidden: true,
                    width: 0,
                    hideable: false
                },
                {
                    dataIndex: 'version',
                    hidden: true,
                    hideable: false
                },
                {
                    dataIndex: 'nivelpais',
                    hidden: true,
                    hideable: false
                }
            ],
            tbar: [
                scope.sfFormatos = new Ext.Cont.SearchField({
                    id: 'sfFormatos',
                    width: 250,
                    emptyText: scope.etiquetas.lbCriterioBuscar,
                    searchTooltip: scope.etiquetas.lbsearchTooltip,
                    //clearTooltip: scope.etiquetas.lbclearTooltip,
                    regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                    maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\*\/\-\|\.\;\,]+ ?[a-zA-Z\s]*)+$/,
                    fnOnSearch: function () {
                        scope.busqueda = true;
                        scope.buscarFormato();

                    },
                    fnOnClear: function () {
                        scope.busqueda = false;
                        scope.buscarFormato();
                    }
                })
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: scope.stFormato,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                emptyMsg: scope.etiquetas.emptyMsg,
                firstText: scope.etiquetas.lbPrimeraPagina,
                lastText: scope.etiquetas.lbUltimaPagina
            })
        });
        scope.gpdat_formato.getView().getRowClass = function (record, index, rowParams, store) {

            if (record.get('heredado') == '1')
                return "green";
        };
        scope.gridNivelFormato = new Ext.grid.GridPanel({
            id: 'gpNivelFormato',
            frame: false,
            border: false,
            autoExpandColumn: 'expandir',
            loadMask: scope.etiquetas.lbMsgCargando,
            store: scope.stNivelFormato,
            sm: scope.sm1,
            stripeRows: true,
            floating: false,
            region: 'south',
            split: true,
            collapsible: true,
            collapsed: true,
            height: Ext.lib.Dom.getViewHeight() * 1 / 2,
            title: scope.etiquetas.lbNivelFormato,
            columns: [{
                dataIndex: 'idparteformato',
                hidden: true,
                hideable: false
            }, {
                header: scope.etiquetas.lbNombre,
                dataIndex: 'nombre',
                id: 'expandir',
                width: 200,
                sortable: true
            }, {
                header: scope.etiquetas.lbAbreviatura,
                width: 200,
                dataIndex: 'abreviatura',
                sortable: true
            }, {
                header: scope.etiquetas.lbNivel,
                width: 100,
                dataIndex: 'nivel',
                sortable: true
            }, {
                header: scope.etiquetas.lbLongitud,
                width: 100,
                dataIndex: 'longitud',
                sortable: true
            }, {
                dataIndex: 'idformato',
                hidden: true,
                hideable: false
            }, {
                dataIndex: 'version',
                hidden: true,
                hideable: false
            }],
            tbar: [new Ext.Button({
                id: 'btnAddNivel',
                iconCls: 'adicionar',
                disabled: true,
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.lbToolTipAdNivel,
                text: scope.etiquetas.lbBtnAdicionar,
                handler: function () {
                    scope.isOpenW = true;
                    scope.winfpRegNivelFormato('Ins');
                }
            }), scope.botonMod = new Ext.Button({
                id: 'btnModNivel',
                iconCls: 'modificar',
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.lbToolTipModNivel,
                text: scope.etiquetas.lbBtnModificar,
                disabled: true,
                handler: function () {
                    scope.isOpenW = true;
                    scope.winfpRegNivelFormato('Mod');
                }
            }), scope.botonElim = new Ext.Button({
                id: 'btnDelNivel',
                iconCls: 'eliminar',
                disabled: true,
                hidden: scope.hideBtns,
                tooltip: scope.etiquetas.lbToolTipElNivel,
                text: scope.etiquetas.lbBtnEliminar,
                handler: function () {
                    scope.isOpenW = true;
                    scope.eliminarNivelFormato();
                }
            })],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 10,
                store: scope.stNivelFormato,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                emptyMsg: '0 Resultado a mostrar',
                //emptyMsg: scope.etiquetas.lbEmptyMsg,
                firstText: scope.etiquetas.lbPrimeraPagina,
                lastText: scope.etiquetas.lbUltimaPagina
            })
        });

        scope.mipanel = new Ext.Panel({
            layout: 'border',
            listeners: {
                render: function () {
                    Ext.getCmp('btnAddFormato').focus();
                }
            },
            floating: false,
            items: [scope.gpdat_formato, scope.gridNivelFormato],
            keys: scope.hotKeysFOrmatos = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: 'i',
                    alt: true,
                    fn: function () {
                        var btn = Ext.getCmp('btnAddFormato');
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }, {
                    key: 'i',
                    ctrl: true,
                    fn: function () {
                        var btn = Ext.getCmp('btnAddNivel');
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }, {
                    key: 'm',
                    alt: true,
                    fn: function () {
                        var btn = scope.botonMod1;
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }, {
                    key: 'm',
                    ctrl: true,
                    fn: function () {
                        var btn = Ext.getCmp('btnModNivel');
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }, {
                    key: 'b',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('sfFormatos').getRawValue().length > 0) {
                            Ext.getCmp('sfFormatos').onTrigger2Click();
                        } else {
                            Ext.getCmp('sfFormatos').focus();
                        }
                    }
                }, {
                    key: 'l',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('sfFormatos').getRawValue().length > 0) {
                            Ext.EventObject.stopEvent();
                            Ext.getCmp('sfFormatos').onTrigger1Click();
                        }
                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    fn: function () {
                        var btn = scope.botonElim1;
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false && Ext.EventObject.ctrlKey != 1)
                            btn.handler.call();
                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    ctrl: true,
                    fn: function () {
                        var btn = scope.botonElim;
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }, {
                    key: 'h',
                    ctrl: true,
                    alt: true,
                    fn: function () {
                        var btn = scope.btnHeredar;
                        if (!btn.disabled && !btn.hidden && scope.isOpenW == false)
                            btn.handler.call();
                    }
                }
            ]),
            tbar: tbar

        });
        scope.fpRegFormato = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 5px 10px',
            items: [{
                xtype: 'panel',
                items: [{
                    layout: 'column',
                    items: [{
                        columnWidth: 0.75,
                        layout: 'form',
                        items: [scope.campoNombre = new Ext.form.TextField({
                            fieldLabel: scope.etiquetas.lbNombre,
                            blankText: scope.etiquetas.lbCampVacio,
                            allowBlank: false,
                            maxLength: 255,
                            maxLengthText: scope.etiquetas.lbMaxLengthText,
                            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            regexText: scope.etiquetas.lbRegTextAbrev,
                            name: 'nombre',
                            anchor: '98%',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    comprobarVentana();
                                }

                            }
                        })]
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: [
                            scope.separador = new Ext.form.ComboBox({
                                store: new Ext.data.SimpleStore({
                                    fields: ['separador'],
                                    data: [['*'], ['/'], ['-'], [':'], ['|'], ['.'], [';'], [',']
                                    ]
                                }),
                                name: 'separador',
                                typeAhead: true,
                                editable: true,
                                maxLength: 1,
                                fieldLabel: scope.etiquetas.lbSeparador,
                                emptyText: scope.etiquetas.emptyText,
                                triggerAction: 'all',
                                forceSelection: true,
                                blankText: scope.etiquetas.lbCampVacio,
                                allowBlank: false,
                                displayField: 'separador',
                                anchor: '98%',
                                mode: 'local',
                                enableKeyEvents: true,
                                listeners: {
                                    keyup: function () {
                                        comprobarVentana();
                                    },
                                    select: function () {
                                        comprobarVentana();
                                    }

                                }
                            })

                        ]
                    }, {
                        columnWidth: .75,
                        layout: 'form',
                        items: [
                            scope.subsistemacb = new Ext.form.ComboBox({
                                store: scope.stSubsistema,
                                name: 'subsistema',
                                typeAhead: true,
                                editable: true,
                                resizable: true,
                                fieldLabel: scope.etiquetas.lbSubsistema,
                                emptyText: scope.etiquetas.emptyText,
                                triggerAction: 'all',
                                forceSelection: true,
                                blankText: scope.etiquetas.lbCampVacio,
                                allowBlank: false,
                                valueField: 'idsubsistema',
                                displayField: 'descripcion',
                                hiddenName: 'idsubsistema',
                                mode: 'local',
                                anchor: '98%',
                                enableKeyEvents: true,
                                listeners: {
                                    keyup: function () {
                                        comprobarVentana();
                                    },
                                    select: function () {
                                        comprobarVentana();
                                    }

                                }
                            })
                        ]
                    }, {
                        columnWidth: .25,
                        layout: 'form',
                        items: [scope.nivelpais = new Ext.form.Checkbox({
                            boxLabel: scope.etiquetas.lbAnNatural,
                            fieldLabel: scope.etiquetas.lbNivelP,
                            hideLabel: false,
                            checked: false,
                            inputValue: true,
                            name: 'nivelpais',
                            anchor: '98%',
                            listeners: {
                                check: function () {
                                    comprobarVentana();
                                }

                            }
                        })]
                    }, {
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.descrip = new Ext.form.TextArea({
                            xtype: 'textarea',
                            region: 'center',
                            blankText: scope.etiquetas.lbCampVacio,
                            allowBlank: false,
                            maxLength: 255,
                            maxLengthText: scope.etiquetas.lbMaxLengthText,
                            //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            //maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            fieldLabel: scope.etiquetas.lbDescripcion,
                            anchor: '98%',
                            //regexText: scope.etiquetas.lbRegTextAbrev,
                            name: 'descripcion',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    comprobarVentana();
                                }

                            }
                        })]
                    }
                    ]
                }]
            }
            ]
        });

        scope.stApertura = new Ext.data.Store({
            url: scope.url + 'cargarAperturas',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'total',
                root: 'data',
                id: 'idconfapertura'
            }, [
                {
                    name: 'idconfapertura'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        scope.cmbApertura = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.emptyText,
            fieldLabel: "Nomenclador",
            name: 'confapertura',
            store: scope.stApertura,
            typeAhead: true,
            displayField: 'denominacion',
            valueField: 'idconfapertura',
            loadingText: scope.etiquetas.lbMsgCargando,
            allowBlank: true,
            forceSelection: false,
            triggerAction: 'all',
            mode: 'local',
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                keyup: comprobarVentanaNF,
                select: comprobarVentanaNF
            }
        });

        scope.fpRegNivelFormato = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 5px',
            items: [{
                xtype: 'panel',
                layout: 'column',
                items: [
                    {
                        columnWidth: 1,
                        layout: 'form',
                        items: [scope.nombreNivel = new Ext.form.TextField({
                            fieldLabel: scope.etiquetas.lbNombre,
                            blankText: scope.etiquetas.lbCampVacio,
                            allowBlank: false,
                            maxLength: 255,
                            maxLengthText: scope.etiquetas.lbMaxLengthText,
                            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z\s]*)+$/,
                            regexText: scope.etiquetas.lbRegTextAbrev,
                            name: 'nombre',
                            anchor: '100%',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    comprobarVentanaNF();
                                }

                            }
                        })]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [
                            scope.abrev = new Ext.form.TextField({
                                fieldLabel: scope.etiquetas.lbAbreviatura,
                                blankText: scope.etiquetas.lbCampVacio,
                                allowBlank: false,
                                maxLength: 50,
                                maxLengthText: scope.etiquetas.lbMaxLengthText,
                                regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z]*)+$/,
                                maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc \"\-\_\/\(\)\.\#\+]+ ?[a-zA-Z]*)+$/,
                                regexText: scope.etiquetas.lbRegTextAbrev,
                                name: 'abreviatura',
                                anchor: '98%',
                                enableKeyEvents: true,
                                listeners: {
                                    keyup: function () {
                                        comprobarVentanaNF();
                                    }

                                }

                            })]
                    },
                    {
                        columnWidth: .5,
                        layout: 'form',
                        items: [scope.cmbApertura]
                    },
                    {
                        columnWidth: .4,
                        layout: 'form',
                        items: [scope.longitud = new Ext.form.NumberField({
                            allowBlank: false,
                            blankText: scope.etiquetas.lbCampVacio,
                            name: 'longitud',
                            maxLength: 3,
                            maxLengthText: scope.etiquetas.lbMaxLengthNum,
                            allowDecimals: false,
                            regex: /^[0-9]+$/,
                            regexText: scope.etiquetas.lbRegTextLongitud,
                            fieldLabel: 'Longitud',
                            anchor: '98%',
                            enableKeyEvents: true,
                            listeners: {
                                keyup: function () {
                                    comprobarVentanaNF();
                                }

                            }
                        })]
                    }

                ]
            }]

        });

        Ext.apply(scope.config);
        this.items = scope.mipanel;
        Ext.Configuracion_General_Nomencladores.Formatos.superclass.constructor.call(this, scope.config);
    }

});
Ext.reg('formatos', Ext.Configuracion_General_Nomencladores.Formatos);



/**
 * Nomenclador de Pa&iacuteses (version componente)
 *
 * @author Ing. Alexis Rodriguez Reyes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.Configuracion_General_Nomencladores
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Nomencladores');

Ext.Configuracion_General_Nomencladores.NomencladorPaisModel = {
    init: function (scope) {
        /*---------------------------------------------------------------------*/
        /*--------------------Store del Grid de Aplicaciones-------------------*/
        scope.stSituacion = new Ext.data.Store({
            url: scope.url + 'cargardatos',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "root", id: "idpais"
            }, [{
                name: 'idpais'
            }, {
                name: 'nombrepais'
            }, {
                name: 'codigopais'
            }, {
                name: 'siglas'
            }, {
                name: 'nacionalidad'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }]),
            listeners: {
                load: function (options) {
                    if (scope.stSituacion.getCount() == 0) {
                        scope.auxDel = false;
                        if (scope.banderabuscar == 1) {
                            mostrarMensaje(1, scope.etiquetas.lbmsgInfo5);
                            scope.banderabuscar = 0;
                        }
                        if (scope.banderabuscar == 0) {
                            mostrarMensaje(1, scope.etiquetas.lbmsgInfo6);
                        }
                    } else {
                        scope.sm.selectFirstRow();
                    }
                }
            }
        });
        scope.stSituacion.load();
    }
};

Ext.Configuracion_General_Nomencladores.NomencladorPaisController = {
    init: function (scope) {
        scope.winForm = function (opcion) {
            if (!scope.winKeyMap) {
                scope.winKeyMap = new Ext.KeyMap(Ext.getBody(), [
                    {
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            if (scope.action == 'adicionar') {
                                if (scope.isOpenW && !Ext.getCmp('idbtnWAdd').disabled) {
                                    //scope.crearSituacion('add');
                                    Ext.getCmp('idbtnWAdd').handler.call();
                                }
                            } else {
                                if (scope.isOpenW && !Ext.getCmp('btnAdd').disabled) {
                                    //scope.modificarsituacion();
                                    Ext.getCmp('btnAdd').handler.call();
                                }
                            }
                        }
                    }/*, {
                        key: "p",
                        alt: true,
                        ctrl: true,
                        fn: function () {
                            if (scope.action == 'adicionar' && scope.isOpenW && !Ext.getCmp('idbtnWAply').disabled) {
                                //scope.crearSituacion('apl');
                                Ext.getCmp('idbtnWAply').handler.call();
                            }
                        }
                    }, {
                        key: "x",
                        alt: true,
                        fn: function () {
                            if (scope.isOpenW) {
                                scope.winKeyMap.disable();
                                if (scope.action == 'adicionar') {
                                    Ext.getCmp('idbtnWCancel').handler.call();
                                    //scope.winIns.hide();
                                } else {
                                    Ext.getCmp('btnCancel').handler.call();
                                    //scope.winMod.hide();
                                }
                            }
                        }
                    }*/
                ]);
            } else {
                scope.winKeyMap.enable();
            }


            switch (opcion) {
                /*-------------Caso para insertar un pais----------*/
                case 'Ins' :
                {
                    scope.action = 'adicionar';
                    if (!scope.winIns) {
                        scope.winIns = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: scope.etiquetas.lbtitleAddPais,
                            width: 390,
                            height: 280,
                            constrain:true,
                            keys: scope.winKeyMap,
                            defaultButton: 'idbtnWCancel',
                            listeners: {
                                hide: function () {
                                    scope.isOpenW = false;
                                    scope.btnAdicionar.focus();
                                    Ext.getCmp('idbtnWAply').disable();
                                    Ext.getCmp('idbtnWAdd').disable();

                                }, render: function () {
                                    Ext.getCmp('nombrepais').focus(false,100);
                                }
                            },
                            buttons: [{
                                iconCls: 'cancelar',
                                id: 'idbtnWCancel',
                                tooltip: scope.etiquetas.ttipbtnCancelar,
                                text: scope.etiquetas.cancelar,
                                handler: function () {
                                    scope.winIns.hide();
                                }
                            }, {
                                iconCls: 'aplicar',
                                id: 'idbtnWAply',
                                disabled: true,
                                tooltip: scope.etiquetas.ttipbtnAplicar,
                                handler: function () {
                                    scope.crearSituacion('apl');

                                },
                                text: scope.etiquetas.aplicar
                            }, {
                                iconCls: 'aceptar',
                                disabled: true,
                                id: 'idbtnWAdd',
                                tooltip: scope.etiquetas.ttipbtnAceptar,
                                nextTab: 'nombrepais',
                                handler: function () {
                                    scope.crearSituacion('add');

                                },
                                text: scope.etiquetas.aceptar
                            }]
                        });
                    }
                    scope.winIns.show();
                    scope.fpSituacion.getForm().reset();
                    scope.winIns.add(scope.fpSituacion);
                    scope.winIns.doLayout();
                }
                    break;
                /*---------------Caso para modificar un pais-------------*/
                case 'Mod' :
                {
                    scope.action = 'modificar';
                    if (!scope.winMod) {
                        scope.winMod = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: scope.etiquetas.lbtitleSetPais,
                            width: 390,
                            defaultButton: 'btnCancel',
                            constrain:true,
                            height: 280,
                            keys: scope.winKeyMap,
                            buttons: [{
                                iconCls: 'cancelar',
                                id: 'btnCancel',
                                tooltip: scope.etiquetas.ttipbtnCancelar,
                                text: scope.etiquetas.cancelar,
                                handler: function () {
                                    scope.winMod.hide();
                                }

                            },
                                {
                                    iconCls: 'aceptar',
                                    id: 'btnAdd',
                                    disabled: true,
                                    nextTab: 'nombrepais',
                                    tooltip: scope.etiquetas.ttipbtnAceptar,
                                    handler: function () {
                                        scope.modificarsituacion();
                                    },
                                    text: scope.etiquetas.aceptar
                                }],
                            listeners: {
                                hide: function () {
                                    scope.btnAdicionar.focus();
                                    scope.isOpenW = false;
                                    Ext.getCmp('btnAdd').disable();
                                }, render: function () {
                                    scope.winMod.focus();
                                }
                            }
                        });
                    }
                    scope.winMod.show();
                    scope.winMod.add(scope.fpSituacion);
                    scope.winMod.doLayout();
                    scope.record = scope.sm.getSelected();
                    scope.fpSituacion.getForm().loadRecord(scope.record);
                    scope.fpSituacion.getForm().setValues({
                        'nombrepais': scope.fpSituacion.getForm().getValues().nombrepais.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'codigopais': scope.fpSituacion.getForm().getValues().codigopais.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'siglas': scope.fpSituacion.getForm().getValues().siglas.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'fechainicio': scope.record.data.fechainicio.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'fechafin': scope.record.data.fechafin ? scope.record.data.fechafin.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') : null
                    });
                }
                    break;
            }
        };
        scope.buscarSituacion = function (aAlias) {
            scope.stSituacion.load();
        };
        scope.mostrarTodos = function () {
            scope.stSituacion.load();
            scope.sm.clearSelections();
        };

        scope.fObtenerDatosImprimirReporte = function () {
            Ext.Msg.wait(scope.etiquetas.lbMsgCargando, scope.etiquetas.lbPlease);
            Ext.Ajax.request({
                method: "POST",
                url: 'obtenerdatosreporte',
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datoCuerpo.length > 0)
                        scope.fOpenWindowReport(responseData);
                    else
                        mostrarMensaje(1, etiquetas.mgsError, function () {
                        });
                    Ext.Msg.hide();
                }
            });
        };

        scope.fOpenWindowReport = function (requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.show();
        };

        scope.crearSituacion = function (apl) {
            if (Ext.getCmp('nombrepais').getValue().toString().length < Ext.getCmp('siglas').getValue().toString().length) {
                //mostrarMensaje(1, scope.etiquetas.msgAbrvMayorDenominacion);
                Ext.getCmp('idbtnWAdd').disable();
                Ext.getCmp('idbtnWAply').disable();
                Ext.getCmp('siglas').focus();
                Ext.getCmp('siglas').selectText();
                Ext.getCmp('siglas').markInvalid(scope.etiquetas.msgAbrvMayorDenominacion);
                return;
            }
            if (scope.fpSituacion.getForm().isValid()) {
                scope.winKeyMap.disable();
                scope.delSpaces();
                scope.fpSituacion.getForm().submit({
                    url: scope.url + 'adicionar',
                    waitMsg: scope.etiquetas.lbmsginfo1,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddPais, fAceptarCambios(apl));
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddExistePaisDenominacion);
                                break;
                            case -3 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddExistePaisSigla);
                                break;
                            case -4 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddExistePaisCodigo);
                                break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje, fAceptarCambios(apl));
                                break;
                        }
                        scope.winKeyMap.enable();
                        function fAceptarCambios(apl) {
                            scope.stSituacion.reload();
                            scope.fpSituacion.getForm().reset();
                            scope.sm.clearSelections();
                            if (apl != 'apl') {
                                scope.winIns.hide();
                            }
                        }
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.camposMal);
            }
        };

        scope.modificarsituacion = function () {
            if (Ext.getCmp('nombrepais').getValue().toString().length < Ext.getCmp('siglas').getValue().toString().length) {
                //mostrarMensaje(1, scope.etiquetas.msgAbrvMayorDenominacion);
                Ext.getCmp('btnAdd').disable();
                Ext.getCmp('siglas').focus();
                Ext.getCmp('siglas').selectText();
                Ext.getCmp('siglas').markInvalid(scope.etiquetas.msgAbrvMayorDenominacion);
                return;
            }
            if (scope.fpSituacion.getForm().isValid()) {
                scope.winKeyMap.disable();
                scope.delSpaces();
                scope.fpSituacion.getForm().submit({
                    url: scope.url + 'modificar',
                    waitMsg: scope.etiquetas.lbmsginfo1,
                    failure: function (form, action) {
                        switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoModPais);
                                scope.stSituacion.reload();
                                scope.winMod.hide();
                                scope.sm.clearSelections();
                                scope.panel.enable();
                                break;
                            case -5 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddExistePaisDenominacion);
                                break;
                            case -3 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoModExistePaisCodigo);
                                break;
                            case -6 :
                                mostrarMensaje(1, scope.etiquetas.lbInfoAddExistePaisSigla);
                                break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }
                        scope.winKeyMap.enable();
                    }
                });
            }
            else {
                mostrarMensaje(1, scope.etiquetas.camposMal);
            }

        };

        scope.eliminarAplicacion = function () {
            mostrarMensaje(2, scope.etiquetas.lbmsginfo2 + '?', eliminar)
            function eliminar(btnPresionado) {
                if (btnPresionado == 'ok') {
                    scope.panel.disable();
                    Ext.Msg.wait(scope.etiquetas.lbmsginfo3, scope.etiquetas.porfavor);
                    Ext.Ajax.request({
                        url: scope.url + 'eliminar',
                        method: 'POST',
                        params: {
                            idpais: scope.sm.getSelected().id
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbInfoDelPais);
                                    scope.stSituacion.load();
                                    scope.sm.clearSelections();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbInfoDelPaisUsado);
                                    break;
                                default:
                                    break;
                            }
                            scope.panel.enable();
                        }
                    });
                }
                scope.btnAdicionar.focus(false, true);
                scope.isOpenW = false;
            }

        };
        scope.searchFiltro = function () {
            scope.stSituacion.baseParams.start = '';
            scope.stSituacion.baseParams.limit = '';
            scope.stSituacion.baseParams.filtrocodigo = scope.tfCodigo.getValue();
            scope.stSituacion.baseParams.fitrosiglas = scope.tfSiglas.getValue();
            scope.stSituacion.baseParams.filtrodenominacion = scope.tfFiltroNombre.getValue();
            scope.stSituacion.baseParams.filtrofechainicio = scope.dfFiltroFechainicio.getRawValue();
            scope.stSituacion.baseParams.filtrofechafin = scope.dfFiltroFechafin.getRawValue();
            scope.stSituacion.load();
            scope.isOpenW = false;
            scope.banderabuscar = 1;
        };
        /*scope.cargarAyuda = function () {
            help.show(scope.etiquetas.lbTitleAyuda, 'confin/CG/DP/getpais');
        };*/
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

        scope.formValid = function () {
            if (scope.tfFiltroNombre.isValid() && scope.tfCodigo.isValid() && scope.tfSiglas.isValid() && scope.dfFiltroFechafin.isValid() && scope.dfFiltroFechainicio.isValid()) {
                if (!Ext.isEmpty(scope.tfFiltroNombre) || !Ext.isEmpty(scope.tfCodigo.isValid()) || !Ext.isEmpty(scope.tfSiglas) || !Ext.isEmpty(scope.dfFiltroFechafin) || !Ext.isEmpty(scope.dfFiltroFechainicio)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        scope.checkWindow = function () {
            if (scope.fpSituacion.getForm().isValid()) {
                if (scope.action == 'modificar' && scope.changedForm()) {
                    Ext.getCmp('btnAdd').enable();
                } else if (scope.action == 'adicionar') {
                    Ext.getCmp('idbtnWAply').enable();
                    Ext.getCmp('idbtnWAdd').enable();
                } else {
                    Ext.getCmp('btnAdd').disable();
                }
            } else {
                if (scope.action == 'adicionar') {
                    Ext.getCmp('idbtnWAdd').disable();
                    Ext.getCmp('idbtnWAply').disable();
                } else {
                    Ext.getCmp('btnAdd').disable();
                }
            }
        };

        scope.changedForm = function () {
            var newValues = scope.fpSituacion.getForm().getValues();
            var oldValues = scope.sm.getSelected().data;
            var changed = false;
            for (k in newValues) {
                if ((!Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k])) || (!Ext.isEmpty(newValues[k]) && Ext.isEmpty(oldValues[k])) || (Ext.isEmpty(newValues[k]) && !Ext.isEmpty(oldValues[k]))) {
                    if (newValues[k] != oldValues[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')) {
                        changed = true;
                        break;
                    }
                }
            }
            return changed;
        };

        scope.delSpaces=function(){
            scope.fpSituacion.getForm().setValues({
                nombrepais:Ext.getCmp('nombrepais').getValue().trim(),
                codigopais:Ext.getCmp('codigopais').getValue(),
                nacionalidad:Ext.getCmp('nacionalidad').getValue().trim(),
                siglas:Ext.getCmp('siglas').getValue().trim(),
                idpais:Ext.getCmp('idpais').getValue(),
                fechainicio:scope.fechainicio.getValue(),
                fechafin:scope.fechafin.getValue()

            });
        }
    }
};

Ext.Configuracion_General_Nomencladores.NomencladorPais = Ext.extend(Ext.Panel, {
    constructor: function (config) {
        Ext.QuickTips.init();
        scope = this;
        scope.etiquetas = Conf.NomPais.etiquetas;
        scope.url = '/configuracion/divisionpolitica/index.php/gestpais/';
        scope.perfil = window.parent.UCID.portal.perfil;
        scope.config = config;
        scope.winIns;
        scope.winMod;
        scope.winRegular;
        scope.isOpenW = false;
        scope.action = 'adicionar';
        scope.idconceptoestructural;
        scope.auxDel;
        scope.record;
        scope.banderabuscar = 0;
        scope.winIns;
        scope.winMod;
        scope.filter = false;

        actionValidate.validate();

        scope.model = Ext.Configuracion_General_Nomencladores.NomencladorPaisModel;
        scope.model.init(scope);
        scope.controller = Ext.Configuracion_General_Nomencladores.NomencladorPaisController;
        scope.controller.init(scope);
        scope.init(scope);
    },
    init: function (scope) {
        /*----------------------------------------------------------------------------*/
        /*--------------------------El ProgressBar------------------------------------*/
        scope.pbLoad = new Ext.ProgressBar({
            text: scope.etiquetas.msg,
            id: 'pbar2',
            cls: 'custom'
        });
        /*----------------------------------------------------------------------------*/
        /*-----------------La ventana  que tiene el ProgressBar-----------------------*/
        scope.wnLoad = new Ext.Window({
            title: scope.etiquetas.msg,
            layout: 'fit', width: 300,
            height: 50,
            constrain:true,
            closable: false,
            resizable: false, modal: true,
            items: [scope.pbLoad],
            closeAction: 'hide',
            listeners: {
                show: function () {
                    scope.pbLoad.text = scope.etiquetas.msg;
                    scope.pbLoad.wait({
                        interval: 200,
                        increment: 15,
                        fn: function () {
                        }
                    });
                },
                hide: function () {
                    scope.pbLoad.reset();
                }
            }
        });

        /*---------------------------------------------------------------------*/
        /*-----------------------Declaración de botones------------------------*/
        scope.btnAdicionar = new Ext.Button({
            id: 'btnAddPais',
            //icon: perfil.dirImg + 'adicionar.png',
            tooltip: scope.etiquetas.lbttipAddPais,
            iconCls: 'adicionar',
            hidden: true,
            text: scope.etiquetas.adicionar,
            handler: function () {
                scope.isOpenW = true;
                scope.winForm('Ins');
            }
        });

        scope.btnModificar = new Ext.Button({
            disabled: true,
            id: 'btnModPais',
            hidden: true,
            tooltip: scope.etiquetas.lbttipSetPais,
            //icon: perfil.dirImg + 'modificar.png',
            iconCls: 'modificar',
            text: scope.etiquetas.modificar,
            handler: function () {
                scope.isOpenW = true;
                scope.winForm('Mod');
            }
        });

        scope.btnEliminar = new Ext.Button({
            disabled: true,
            id: 'btnDelPais',
            hidden: true,
            tooltip: scope.etiquetas.lbttipDelPais,
            //icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'eliminar',
            text: scope.etiquetas.eliminar,
            handler: function () {
                scope.isOpenW = true;
                scope.eliminarAplicacion();
            }
        });

        scope.btnVistaReporte = new Ext.Button({
            id: 'btnVistaReportePais',
            tabIndex: 2,
            iconCls: 'vistareporte',
            hidden: true,
            text: etiquetas.lbBtnVista,
            tooltip: etiquetas.lbTtReporte,
            handler: function () {
                scope.fObtenerDatosImprimirReporte();
            }
        });

        scope.btnAyuda = new Ext.Button({
            disabled: false,
            id: 'btnAyudaPais',
            nextTab: 'tfFiltroNombre',
            tooltip: scope.etiquetas.lbttipHelp,
            iconCls: 'ayuda',
            text: scope.etiquetas.ayuda
        });

        /*---------------------------------------------------------------------*/
        /*----------Establesco modo de seleccion de grid (single)--------------*/
        scope.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function () {
                    if (scope.sm.hasSelection()) {
                        scope.btnModificar.enable();
                        scope.btnEliminar.enable();

                    } else {
                        scope.btnModificar.disable();
                        scope.btnEliminar.disable();

                    }
                },
                rowselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpsituaciones').getView().addRowClass(rowIndex, "negrita");
                },
                rowdeselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpsituaciones').getView().removeRowClass(rowIndex, "negrita");
                }

            }
        });


        /*----------------------------------------------------------------------------*/
        /*------------------------Declaración de los filtros-------------------------*/
        scope.btn_Buscar = new Ext.Button({
            iconCls: 'buscar',
            id: "btn_Buscar",
            disabled: true,
            tooltip: scope.etiquetas.tooltipbuscar,
            text: scope.etiquetas.buscar,
            handler: function () {
                scope.searchFiltro();
                scope.filter = true;
            }
        });
        scope.btnLimpiar = new Ext.Button({
            tooltip: scope.etiquetas.tooltipclean, id: 'btnAll',
            text: scope.etiquetas.limpiar,
            iconCls: 'limpiar',
            hidden: true,
            nextTab: 'btnAddPais',
            handler: function () {
                scope.btnLimpiar.hide();
                scope.btn_Buscar.disable();
                scope.formfiltro.getForm().reset();
                scope.btnAdicionar.focus();
                scope.banderabuscar = 0;
                if (scope.filter) {
                    scope.searchFiltro();
                    scope.filter = false;
                }
            }
        });
        scope.tfFiltroNombre = new Ext.form.TextField({
            name: 'tfFiltroNombre',
            id: 'tfFiltroNombre',
            //regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*$/,
            //maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]$/,
            regexText: scope.etiquetas.textLetras,
            maxLength: 255,
            emptyText: scope.etiquetas.criterio,
            fieldLabel: scope.etiquetas.lbfieldLabelDeno,
            anchor: '100%',
            allowBlank: true,
            enableKeyEvents: true,
            listeners: {
                keyup: onKeyUp
            }
        });
        scope.tfCodigo = new Ext.form.TextField({
            name: 'tfCodigo', anchor: '100%',
            vtype: 'vtalfanumerico',
            maxLength: 3,
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]$/,
            regexText: scope.etiquetas.textAlfaNum,
            emptyText: scope.etiquetas.criterio,
            fieldLabel: scope.etiquetas.lbfieldLabelCod,
            id: 'tfCodigo',
            enableKeyEvents: true,
            allowBlank: true,
            listeners: {
                keyup: onKeyUp
            }
        });
        scope.tfSiglas = new Ext.form.TextField({
            name: 'tfSiglas',
            id: 'tfSiglas',
            regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*$/,
            maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]$/,
            regexText: scope.etiquetas.textLetras,
            maxLength: 10,
            //minLength: 3,
            anchor: '100%',
            enableKeyEvents: true,
            emptyText: scope.etiquetas.criterio,
            fieldLabel: scope.etiquetas.lbfieldLabelSig,
            allowBlank: true,
            listeners: {
                keyup: onKeyUp
            }
        });
        scope.dfFiltroFechafin = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbfieldLabelFFin,
            vtype: 'daterange',
            emptyText: scope.etiquetas.seleccione,
            startDateField: 'dfFiltroFechainicio',
            minText: scope.etiquetas.lbminText,
            anchor: '100%',
            name: 'dfFiltroFechafin',
            id: 'dfFiltroFechafin',
            format: 'd/m/Y',
            //readOnly: true,
            enableKeyEvents: true,
            maskRe: /^[\d\/]$/,
            invalidText: [scope.etiquetas.textFormato].join(""),
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                // focus: onKeyUp,
                change: onKeyUp,
                keyup: onKeyUp
            }
        });
        scope.dfFiltroFechainicio = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbfieldLabelFIni,
            emptyText: scope.etiquetas.seleccione,
            endDateField: 'dfFiltroFechafin',
            maxText: scope.etiquetas.lbmaxText,
            vtype: 'daterange',
            anchor: '100%',
            name: 'dfFiltroFechainicio',
            id: 'dfFiltroFechainicio',
            format: 'd/m/Y',
            //readOnly: true,
            enableKeyEvents: true,
            maskRe: /[\d\/]/,
            invalidText: [scope.etiquetas.textFormato].join(""),
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                // focus: onKeyUp,
                change: onKeyUp,
                keyup: onKeyUp,
            }
        });

        scope.formfiltro = new Ext.FormPanel({
            layout: 'column',
            region: 'north',
            cls: 'x-toolbar',
            frame: true,
            defaults: {
                layout: 'form',
                border: false,
                labelAlign: 'top',
                labelWidth: 50,
                buttonAlign: 'right'
            },
            height: 65,
            bodyBorder: false,
            border: false,
            autoShow: true,
            hideBorders: true,
            items: [{
                layout: 'form',
                columnWidth: .2,
                items: [scope.tfFiltroNombre]
            }, {
                style: 'margin:0 0 0 10',
                columnWidth: .15,
                layout: 'form',
                items: [scope.tfCodigo]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .15,
                items: [scope.tfSiglas]
            }, {
                style: 'margin:0 0 0 10',
                layout: 'form',
                columnWidth: .18,
                items: [scope.dfFiltroFechainicio]
            }, {
                style: 'margin:0 0 0 10', layout: 'form',
                columnWidth: .18,
                items: [scope.dfFiltroFechafin]
            }, {
                columnWidth: '35px',
                layout: 'form',
                style: 'margin:19 0 0 5',
                items: [scope.btn_Buscar]
            }, {
                columnWidth: '35px',
                layout: 'form',
                style: 'margin:19 0 0 5',
                items: [scope.btnLimpiar]
            }]
        });

        scope.gpSituaciones = new Ext.grid.GridPanel({
            frame: true,
            height: 580,
            region: 'center',
            border: false,
            viewConfig: {forceFit:true},
            id: 'gpsituaciones',
            //title: scope.etiquetas.lbtitleGridPaises,
            autoScroll: false,
            store: scope.stSituacion,
            stripeRows: true,
            autoExpandColumn: 'expandir',
            sm: scope.sm,
            loadMask: {
                msg: scope.etiquetas.msg
            },
            columns: [{
                hidden: true,
                hideable: false,
                dataIndex: 'idpais'
            }, {
                header: scope.etiquetas.lbfieldLabelDeno,
                id: 'expandir',
                width: 200,
                dataIndex: 'nombrepais',
                sortable: true
            }, {
                header: scope.etiquetas.lbfieldLabelCod,
                width: 100,
                dataIndex: 'codigopais',
                sortable: true
            }, {
                header: scope.etiquetas.lbfieldLabelSig,
                width: 100,
                dataIndex: 'siglas',
                sortable: true
            }, {
                header: scope.etiquetas.lbfieldLabelNac,
                width: 100,
                dataIndex: 'nacionalidad',
                sortable: true
            },
                {
                    header: scope.etiquetas.lbfieldLabelFIni,
                    id: 'expandir',
                    width: 100,
                    dataIndex: 'fechainicio',
                    sortable: true
                }, {
                    header: scope.etiquetas.lbfieldLabelFFin,
                    id: 'expandir',
                    width: 100,
                    dataIndex: 'fechafin',
                    sortable: true

                }],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: scope.stSituacion,
                displayInfo: true,
                displayMsg: scope.etiquetas.displayMsg,
                emptyMsg: scope.etiquetas.emptyMsg,
                prevText: scope.etiquetas.beforePageText,
                nextText: scope.etiquetas.afterPageText,
                firstText: scope.etiquetas.firstPageText,
                lastText: scope.etiquetas.lastPageText
            })
        });
        scope.tfFiltroNombre.on({
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    scope.btn_Buscar.handler.call();
                }
            }

        });
        scope.tfCodigo.on({
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    scope.btn_Buscar.handler.call();
                }
            }

        });
        scope.tfSiglas.on({
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    scope.btn_Buscar.handler.call();
                }
            }

        });
        scope.dfFiltroFechainicio.on({
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    scope.btn_Buscar.handler.call();
                }
            }/*, keyup: function (t, e) {
             if (e.getKey() == 13) {
             if (t.getValue().length > 0) {
             scope.btn_Buscar.handler.call();
             } else {
             t.reset();
             t.blur();
             t.clearInvalid();
             }
             }
             }*/
        });

        scope.dfFiltroFechafin.on({
            specialkey: function (xfield, xevent) {
                if (Ext.EventObject.getKey() == Ext.EventObject.ENTER && checkSearch()) {
                    scope.btn_Buscar.handler.call();
                }
            }/*, keyup: function (t, e) {
             if (e.getKey() == 13) {
             if (t.getValue().length > 0) {
             scope.btn_Buscar.handler.call();
             } else {
             t.reset();
             t.blur();
             t.clearInvalid();
             }
             }
             }*/
        });
        scope.panel = new Ext.Panel({
            layout: 'border',
            tbar: [scope.btnAdicionar, scope.btnModificar, scope.btnEliminar, scope.btnVistaReporte, '->', scope.btnAyuda],
            items: [scope.formfiltro, scope.gpSituaciones],
            keys: [scope.hotkeysNompais = new Ext.KeyMap(document, [{
                key: Ext.EventObject.DELETE,
                fn: function () {
                    var btn = scope.btnEliminar;
                    if (scope.sm.getSelected() && scope.isOpenW == false && !btn.disabled && !btn.hidden) {
                        isOpenW = true;
                        scope.eliminarAplicacion();
                    }
                }
            }, {
                key: "i",
                alt: true,
                fn: function () {
                    var btn = scope.btnAdicionar;
                    if (scope.isOpenW == false && !btn.hidden) {
                        scope.isOpenW = true;
                        scope.winForm('Ins');
                    }
                }
            }, {
                key: "b",
                alt: true,
                fn: function () {
                    if (!scope.btn_Buscar.disabled && scope.isOpenW == false) {
                        scope.isOpenW = true;
                        scope.btn_Buscar.handler.call();
                    }
                }
            }, {
                key: "l",
                alt: true,
                fn: function () {
                    if (!scope.btnLimpiar.hidden && scope.isOpenW == false) {
                        scope.formfiltro.getForm().reset();
                        scope.btnLimpiar.handler.call();
                    }
                }
            }, {
                key: "r",
                alt: true,
                fn: function () {
                    var btn = scope.btnVistaReporte;
                    if(!btn.hidden){
                        btn.handler.call();
                    }

                }
            },
                {
                    key: "m",
                    alt: true,
                    fn: function () {
                        var btn = scope.btnModificar;
                        if (scope.sm.getSelected() && scope.isOpenW == false && !btn.disabled && !btn.hidden) {
                            scope.isOpenW = true;
                            scope.winForm('Mod');
                        }
                    }
                }/*, {
                    key: "h",
                    alt: true,
                    fn: function () {
                        scope.cargarAyuda();
                    }
                }*/,
                {
                    key: Ext.EventObject.TAB,
                    fn: function () {
                        if ((scope.tfFiltroNombre.getValue() == '') &&
                            (scope.tfCodigo.getValue() == '') && (scope.tfSiglas.getValue() == '') && (scope.dfFiltroFechafin.getValue() == '')
                            && (scope.dfFiltroFechainicio.getValue() == '')) {
                            scope.btn_Buscar.disable();
                        }
                    }
                }])]
        });
        /*------------------------Componentes del formulario--------------------------*/
        scope.fechainicio = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbfieldLabelFIni,
            anchor: '97%',
            name: 'fechainicio',
            id: 'fechainicio',
            value: new Date(),
            endDateField: 'fechafin',
            maxText: scope.etiquetas.lbmaxText,
            vtype: 'daterange',
            format: 'd/m/Y',
            readOnly: false,
            allowBlank: false,
            enableKeyEvents: true,
            maskRe: /[\d\/]/,
            invalidText: [scope.etiquetas.textFormato].join(""),
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                change: function () {
                    scope.checkWindow();
                },
                keyup: scope.checkWindow
            }
        });
        scope.fechafin = new Ext.form.DateField({
            fieldLabel: scope.etiquetas.lbfieldLabelFFin,
            anchor: '97%',
            name: 'fechafin',
            id: 'fechafin',
            startDateField: 'fechainicio',
            minText: scope.etiquetas.lbminText,
            format: 'd/m/Y',
            readOnly: false,
            enableKeyEvents: true,
            maskRe: /[\d\/]/,
            invalidText: [scope.etiquetas.textFormato].join(""),
            parseDate: function (v) {
                return (!v || v instanceof Date) ? v : ((v.length == 6
                || v.length == 8 || v.length == 10) && (Date
                    .parseDate(v, 'd/m/y') || Date
                    .parseDate(v, 'd/m/Y')));
            },
            listeners: {
                change: function () {
                    scope.checkWindow();
                },
                keyup: scope.checkWindow
            }
        });
        /*---------------------------------------------------------------------*/
        /*--------Se define el formulario para adicionar una situación--------*/
        scope.fpSituacion = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            items: [{
                layout: 'column',
                border: 'false',
                items: [{
                    xtype: 'hidden',
                    name: 'idpais',
                    id: 'idpais'
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: scope.etiquetas.lbfieldLabelDeno,
                name: 'nombrepais',
                id: 'nombrepais',
                //regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*$/,
                //maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]$/,
                regexText: scope.etiquetas.textLetras,
                maxLength: 100,
                anchor: '99%',
                allowBlank: false,
                enableKeyEvents: true,
                listeners: {
                    keyup: scope.checkWindow
                }
            }, {
                columnWidth: '.5',
                layout: 'column',
                items: [{
                    columnWidth: '.5',
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: scope.etiquetas.lbfieldLabelCod,
                        regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
                        maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]$/,
                        regexText: scope.etiquetas.textAlfaNum,
                        maxLength: 3,
                        name: 'codigopais',
                        id: 'codigopais',
                        anchor: '97%',
                        allowBlank: false,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: scope.checkWindow
                        }
                    }]
                }, {
                    columnWidth: '.5',
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: scope.etiquetas.lbfieldLabelSig,
                        regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*$/,
                        maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]$/,
                        regexText: scope.etiquetas.textLetras,
                        maxLength: 10,
                        minLength: 3,
                        name: 'siglas',
                        id: 'siglas',
                        anchor: '97%',
                        allowBlank: false,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: scope.checkWindow
                        }
                    }]
                }]
            }, {
                xtype: 'textfield',
                fieldLabel: scope.etiquetas.lbfieldLabelNac,
                name: 'nacionalidad',
                maxLength: 255,
                //regex: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*$/,
                //maskRe: /^[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]$/,
                regexText: scope.etiquetas.textLetras,
                id: 'nacionalidad',
                anchor: '99%',
                allowBlank: false,
                enableKeyEvents: true,
                listeners: {
                    keyup: scope.checkWindow
                }
            }, {
                columnWidth: '.5',
                layout: 'column',
                items: [{
                    columnWidth: '.5',
                    layout: 'form',
                    items: [scope.fechainicio]
                }, {
                    columnWidth: '.5',
                    layout: 'form',
                    items: [scope.fechafin]
                }]
            }]

        });

        scope.panel.on('afterlayout', function () {
            scope.btnAdicionar.focus();
        });
        function onFocus() {
            if ((scope.tfFiltroNombre.getValue() == '') &&
                (scope.tfCodigo.getValue() == '') && (scope.tfSiglas.getValue() == '') && (scope.dfFiltroFechafin.getValue() == '')
                && (scope.dfFiltroFechainicio.getValue() == '')) {
                scope.btn_Buscar.disable();
            }
        }

        function checkSearch() {
            var valido = false;
            if (scope.formfiltro.getForm().isValid() && ((scope.tfFiltroNombre.getValue() != '') ||
                (scope.tfCodigo.getValue() != '') || (scope.tfSiglas.getValue() != '') ||
                (scope.dfFiltroFechafin.getValue() != '') || (scope.dfFiltroFechainicio.getValue() != ''))) {
                valido = true;
            }
            return valido;
        }

        function onKeyUp() {
            if (checkSearch()) {
                scope.btn_Buscar.enable();
                scope.btnLimpiar.show();
            } else {
                scope.btn_Buscar.disable();
                scope.btnLimpiar.hide();
                if (scope.filter) {
                    scope.btnLimpiar.handler.call();
                }
            }
        }

        Ext.apply(scope.config);
        this.items = scope.panel;
        Ext.Configuracion_General_Nomencladores.NomencladorPais.superclass.constructor.call(this, scope.config);
    }
});
Ext.reg('nomPais', Ext.Configuracion_General_Nomencladores.NomencladorPais);



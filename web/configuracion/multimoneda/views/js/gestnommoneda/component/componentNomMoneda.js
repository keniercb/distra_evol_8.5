/**
 * Nomenclador de Monedas(version componente)
 *
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.Configuracion_General_Nomencladores
 * @copyright XETID.
 * @version 1.0
 */
Ext.namespace('Ext.Configuracion_General_Nomencladores');
Ext.Configuracion_General_Nomencladores.NomencladorMonedaModel = {
    init: function(scope) {
        scope.dataMoneda = new Ext.data.Store({
            url: scope.url + 'getmonedas',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idmoneda"
            }, [{
                    name: 'idmoneda'
                }, {
                    name: 'codigo'
                }, {
                    name: 'codigoiso'
                }, {
                    name: 'nombremoneda'
                }, {
                    name: 'organizacion'
                }, {
                    name: 'simbolo'
                }, {
                    name: 'presicion'
                }, {
                    name: 'factorredondeo'
                }, {
                    name: 'idmonedaentidad'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'tipomoneda'
                },{
                    name: 'dualidad'
                },{
                    name: 'idestructuracomun'
                }
            ])
        });
        scope.dataMoneda.load();
    }
};


Ext.Configuracion_General_Nomencladores.NomencladorMonedaController = {
    init: function(scope) {
        window.document.oncontextmenu = function(){
            return false;
        };

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

        scope.buscarMoneda = function() {
            scope.dataMoneda.baseParams.start = '';
            scope.dataMoneda.baseParams.limit = '';
            scope.dataMoneda.baseParams.sfFiltro = scope.sfMoneda.getRawValue();
            scope.dataMoneda.load();
        };
        scope.buscarDesglose = function() {
            scope.stNomDesgloses.load({
                params: {
                    idmoneda: scope.smMoneda.getSelected().json.idmoneda,
                    start: '',
                    limit: '',
                    sfFiltro: scope.sfDesglose.getRawValue()
                }
            });
        };

        scope.WinAddModNomMoneda = function(opcion) {
            var winVentAsig;
            scope.codigo = new Ext.form.TextField({
                id: 'codigo',
                name: 'codigo',
                anchor: '96%',
                fieldLabel: scope.etiquetas.lbCodigo,
                maskRe: /^[0-9]+$/,
                regex: /^[0-9]+$/,
                regexText: scope.etiquetas.lbregexTextNEnteros,
                allowBlank: false,
                maxLength: 3,
                maxLengthText: scope.etiquetas.msgMaxLengthNum,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });
            scope.codigoiso = new Ext.form.TextField({
                id: 'codigoiso',
                name: 'codigoiso',
                anchor: '96%',
                fieldLabel: scope.etiquetas.lbCodigoISO,
                maskRe: /^([a-zA-Z]+ ?[a-zA-Z]*)+$/,
                regex: /^([a-zA-Z]+(\s*[a-zA-Z])*)+$/,
                regexText: scope.etiquetas.lbregexSoloLetras,
                allowBlank: false,
                maxLength: 3,
                maxLengthText: scope.etiquetas.msgMaxLengthTextISO,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });
            scope.nombremoneda = new Ext.form.TextField({
                id: 'nombremoneda',
                name: 'nombremoneda',
                anchor: '98%',
                fieldLabel: scope.etiquetas.lbMoneda,
                regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+(\s*[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*)+$/,
                //maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
                regexText: scope.etiquetas.lbregexSoloLetras,
                allowBlank: false,
                maxLength: 30,
                maxLengthText: scope.etiquetas.msgMaxLengthTextMoneda,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });
            /*scope.organizacion = new Ext.form.TextField({
                id: 'organizacion',
                name: 'organizacion',
                anchor: '98%',
                fieldLabel: scope.etiquetas.lbOrganizacion,
                regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+(\s*[a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*)+$/,
                maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
                regexText: scope.etiquetas.lbregexSoloLetras,
                allowBlank: false,
                maxLength: 30,
                maxLengthText: scope.etiquetas.msgMaxLengthTextMoneda,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });*/


            scope.storganizacion = new Ext.data.Store({
                url: scope.url +'getPaises',
                reader: new Ext.data.JsonReader({
                    totalProperty: 'cant',
                    root: 'datos',
                    id: 'idpais'
                }, [
                    {
                        name: 'idpais'
                    },
                    {
                        name: 'nombrepais'
                    }
                ])
            });

            scope.idpaisRawValue = '';
            scope.smorganizacion = new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    scope: this,
                    rowselect: function (smodel, rowIndex, record) {
                        var cant = smodel.getCount();
                        var data = smodel.getSelected().json;
                        if (cant == 1) {
                            scope.organizacion.setValue(data.nombrepais);
                            scope.organizacion.setRawValue(data.nombrepais);
                            scope.idpaisRawValue = data.idpais;
                            scope.organizacion.collapse();
                            scope.organizacion.fireEvent('select', scope.organizacion, data);
                        }
                    }
                }
            });

            scope.sforganizacion = new Ext.Cont.SearchField({
                id: 'sforganizacion',
                width: 291,
                emptyText: scope.etiquetas.lbCriterioBuscar,
                searchTooltip: scope.etiquetas.lbsearchTooltip,
                regex: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
                maskRe: /([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+/,
                fnOnSearch: function () {
                    searchorganizacion();
                },
                fnOnClear: function () {
                    clearorganizacion();
                }
            });

            function searchorganizacion() {
                var filtro = scope.sforganizacion.getValue();
                scope.storganizacion.baseParams.nombrepais = filtro;
                scope.storganizacion.load({
                    params: {
                        start: 0,
                        limit: 100
                    }
                });
            }
            function clearorganizacion() {
                scope.storganizacion.baseParams.nombrepais = '';
                scope.storganizacion.load({
                    params: {
                        start: 0,
                        limit: 100
                    }
                });
            }

            scope.gporganizacion = new Ext.grid.GridPanel({
                loadMask: this.etiquetas.lbCargando,
                width: '100%',
                height: 200,
                frame: false,
                border: false,
                stripeRows: true,
                autoExpandColumn: 'expandir',
                store: scope.storganizacion,
                sm: scope.smorganizacion,
                enableColumnHide: true,
                floating: false,
                hideHeaders: true,
                viewConfig: {
                    forceFit: true
                },
                columns: [
                    {
                        hidden: true,
                        dataIndex: 'idpais',
                        hideable: false
                    },
                    {
                        id: 'expandir',
                        dataIndex: 'nombrepais',
                        sortable: true
                    }
                ],
                tbar: [scope.sforganizacion],
                bbar: new Ext.PagingToolbar({
                    pageSize: 100,
                    displayInfo: false,
                    store: scope.storganizacion
                })
            });

            scope.organizacion = new Ext.form.ComboBox({
                store: new Ext.data.SimpleStore({
                    fields: [{name: 'idpais'}, {name: 'nombrepais'}],
                    data: [[]]
                }),
                id: 'organizacion',
                name: 'organizacion',
                forceSelection: true,
                fieldLabel: scope.etiquetas.lbOrganizacion,
                triggerAction: 'all',
                editable: false,
                allowBlank: false,
                typeAhead: true,
                displayField: 'nombrepais',
                valueField: 'idpais',
                hiddenName: 'idpais',
                mode: 'local',
                anchor: '98%',
                tpl: '<div id = \"ctOrganizacion\" style = \"height:200px; !important;\"></div>',
                listeners: {
                    expand: function () {
                        scope.gporganizacion.render('ctOrganizacion');
                        if (scope.storganizacion.getCount() == 0) {
                            scope.storganizacion.load({
                                params: {
                                    start: 0,
                                    limit: 100
                                }
                            });
                        }

                    },
                    select: function(){
                     comprobarVentanaMoneda();
                    }
                }
            });

            scope.simbolo = new Ext.form.TextField({
                id: 'simbolo',
                name: 'simbolo',
                anchor: '96%',
                fieldLabel: scope.etiquetas.lbSimbolo,
                // maskRe: /^([a-zA-Z\s]+ ?[a-zA-Z\s]*)+$/,
                //regex: /^([a-zA-Z\s]+ ?[a-zA-Z\s]*)+$/,
                allowBlank: false,
                maxLength: 5,
                maxLengthText: scope.etiquetas.msgMaxLengthTextISO,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });
            scope.presicion = new Ext.form.TextField({
                id: 'presicion',
                name: 'presicion',
                anchor: '96%',
                fieldLabel: scope.etiquetas.lbPersicion,
                maskRe: /^[0-5]+$/,
                regex: /^[0-5]+$/,
                regexText: scope.etiquetas.lbregexTextNsix,
                allowBlank: false,
                maxLength: 1,
                maxLengthText: scope.etiquetas.msgMaxLengthNumUno,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });
            scope.factorredondeo = new Ext.form.TextField({
                id: 'factorredondeo',
                name: 'factorredondeo',
                anchor: '96%',
                fieldLabel: scope.etiquetas.lbFactorredondeo,
                //maskRe: /^([0-1]+)|\.$/,
                //regex: /^0.(0)*1(0)*$/,
                regex: /^0\.(0)*1(0)*$/,
                regexText: scope.etiquetas.lbregexTextNzero,
                allowBlank: false,
                maxLength: 8,
                maxLengthText: scope.etiquetas.msgMaxLengthNum,
                enableKeyEvents: true,
                listeners: {
                    keyup: function() {
                        comprobarVentanaMoneda();
                    }

                }
            });

            var fMoneda = new Ext.FormPanel({
                id: 'fMoneda',
                labelAlign: 'top',
                frame: true,
                border: false,
                items: [{
                        xtype: 'panel',
                        items: [{
                                layout: 'column',
                                items: [{
                                        columnWidth: 0.50,
                                        layout: 'form',
                                        items: [scope.codigo]
                                    }, {
                                        columnWidth: 0.50,
                                        layout: 'form',
                                        items: [scope.codigoiso]
                                    }, {
                                        columnWidth: 1,
                                        layout: 'form',
                                        items: [scope.nombremoneda]
                                    }, {
                                        columnWidth: 1,
                                        layout: 'form',
                                        items: [scope.organizacion]
                                    }, {
                                        columnWidth: 0.33,
                                        layout: 'form',
                                        items: [scope.simbolo]
                                    }, {
                                        columnWidth: 0.34,
                                        layout: 'form',
                                        items: [scope.presicion]
                                    }, {
                                        columnWidth: 0.33,
                                        layout: 'form',
                                        items: [scope.factorredondeo]
                                    }
                                ]
                            }]
                    }
                ]
            });

            switch (opcion) {
                case 'Ins':
                    if (!winVentAsig) {
                        winVentAsig = new Ext.Window({
                            modal: true,
                            id: 'winadd',
                            closeAction: 'close',
                            constrain:true,
                            layout: 'fit',
                            listeners: {
                                close: function() {
                                    scope.windowOp = false;
                                    scope.btnAdicionar.focus();
                                }, render: function() {
                                    winVentAsig.focus();
                                }
                            },
                            title: scope.etiquetas.lbTtlAdicionar,
                            width: 350,
                            defaultButton: 'idWindCancelar',
                            firstElement: scope.codigo,
                            height: 280,
                            resizable: false,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idWindCancelar',
                                    text: scope.etiquetas.lbCancelar,
                                    tooltip: scope.etiquetas.lbTtCancelar,
                                    handler: function() {
                                        winVentAsig.close();
                                    }
                                }, {
                                    iconCls: 'aplicar',
                                    id: 'idWindAplicar',
                                    disabled: true,
                                    text: scope.etiquetas.lbAplicar,
                                    tooltip: scope.etiquetas.lbTtAplicar,
                                    handler: function() {
                                        scope.adicionarMoneda('apl');
                                    }
                                }, {
                                    iconCls: 'aceptar',
                                    id: 'idWindAceptar',
                                    disabled: true,
                                    text: scope.etiquetas.lbAceptar,
                                    tooltip: scope.etiquetas.lbTtAceptar,
                                    handler: function() {
                                        scope.adicionarMoneda();
                                    }
                                }]
                        });
                    }
                    fMoneda.getForm().reset();
                    winVentAsig.add(fMoneda);
                    winVentAsig.show();
                    winVentAsig.doLayout();
                    break;
                case 'Mod':
                    if (!winVentAsig) {
                        winVentAsig = new Ext.Window({
                            modal: true,
                            id: 'winmod',
                            closeAction: 'close',
                            layout: 'fit',
                            constrain:true,
                            listeners: {
                                close: function() {
                                    scope.windowOp = false;
                                    scope.btnAdicionar.focus();
                                }, render: function() {
                                    winVentAsig.focus();
                                }
                            },
                            title: scope.etiquetas.lbTtlModificar,
                            width: 350,
                            defaultButton: 'idWinCancelar',
                            firstElement: scope.codigo,
                            height: 280,
                            resizable: false,
                            buttons: [{
                                    iconCls: 'cancelar',
                                    id: 'idWinCancelar',
                                    text: scope.etiquetas.lbCancelar,
                                    tooltip: scope.etiquetas.lbTtCancelar,
                                    handler: function() {
                                        winVentAsig.close();
                                    }
                                },
                                scope.btn_Aceptar = new Ext.Button({
                                    iconCls: 'aceptar',
                                    id: 'idWindModificar',
                                    disabled: true,
                                    text: scope.etiquetas.lbAceptar,
                                    tooltip: scope.etiquetas.lbTtAceptar,
                                    handler: function() {
                                        scope.modificarMoneda();
                                    }
                                })
                            ]
                        });
                    }
                    winVentAsig.add(fMoneda);
                    winVentAsig.show();
                    winVentAsig.doLayout();
                    fMoneda.getForm().loadRecord(scope.smMoneda.getSelected());
                    fMoneda.getForm().setValues({
                        'codigo': scope.smMoneda.getSelected().data.codigo.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'codigoiso': scope.smMoneda.getSelected().data.codigoiso.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'nombremoneda': scope.smMoneda.getSelected().data.nombremoneda.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                        'organizacion': scope.smMoneda.getSelected().data.organizacion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                    });
                    scope.idpaisRawValue = scope.smMoneda.getSelected().json.idpais;
                    break;
            }
        };
        scope.adicionarMoneda = function(apl) {
            if (Ext.getCmp('fMoneda').getForm().isValid()) {
                Ext.getCmp('fMoneda').getForm().submit({
                    url: scope.url + 'adicionarmoneda',
                    params: {
                        idpaisrawvalue: scope.idpaisRawValue
                    },
                    waitMsg: scope.etiquetas.lbWaitMsgReg,
                    failure: function(form, action) {
                        switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddOk);
                                fAceptarCambios();
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteMoneda);
                                break;
                        }
                        /*switch (action.result.codMsg) {
                            case -1 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddOk);
                                fAceptarCambios();
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteCodigo);
                                break;
                            case -3 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteCodigoISO);
                                break;
                            case -4 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteNombre);
                                break;
                            default:
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                break;
                        }*/
                    }
                });
                function fAceptarCambios(btnPress) {
                    Ext.getCmp('fMoneda').getForm().reset();
                    if (!apl)
                        Ext.getCmp('winadd').close();
                    scope.dataMoneda.removeAll();
                    scope.dataMoneda.reload();
                }
            } else {
                mostrarMensaje(1, scope.etiquetas.msgCamposIncorrectos);
            }
        };

        scope.ClickContableAction = function(cont,dualidad) {
            if (scope.smMoneda.getSelected()) {
                var listIdMoneda = [];
                Ext.each(scope.smMoneda.getSelections(), function(item, index) {
                    if (item.data.tipomoneda != cont || item.data.dualidad != dualidad) {
                        listIdMoneda.push({
                            idmoneda: item.data.idmoneda,
                            idmonedaentidad: item.data.idmonedaentidad,
                            tipo: cont,
                            dualidad:dualidad || 0
                        });
                    }
                });
                Ext.Ajax.request({
                    url: scope.url + 'insertartipo',
                    params: {
                        arraymoneda: Ext.encode(listIdMoneda)
                    },
                    method: 'POST',
                    callback: function(options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        switch (responseData.codMsg) {
                            case -1 :
                                if (listIdMoneda.length > 1)
                                    mostrarMensaje(1, scope.etiquetas.lbMsgClasificadasOk);
                                else
                                    mostrarMensaje(1, scope.etiquetas.lbMsgClasificadaOk);
                                break;
                            case -2 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgClasExiste);
                                break;
                            case -3 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgYaClasNoOk);
                                break;
                            case -4 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteContable);
                                break;
                            case -5 :
                                mostrarMensaje(1, scope.etiquetas.lbMsgExisteAlternativa);
                                break;
                            default:
                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                break;
                        }
                        fAceptarCambios();
                        function fAceptarCambios(btnPress) {
                            scope.dataMoneda.removeAll();
                            scope.dataMoneda.reload();
                            Ext.MessageBox.hide();
                        }
                    }
                });
            } else
                mostrarMensaje(1, scope.etiquetas.NotSelect);
        };

        scope.modificarMoneda = function(apl) {
            if (Ext.getCmp('fMoneda').getForm().isValid()) {
                //if (scope.isDirtyForm('fMoneda', scope.smMoneda) == true) {
                    Ext.getCmp('fMoneda').getForm().submit({
                        url: scope.url + 'modificarmoneda',
                        params: {
                            idmoneda: scope.smMoneda.getSelected().json.idmoneda,
                            idpaisrawvalue: scope.idpaisRawValue
                        },
                        waitMsg: scope.etiquetas.lbWaitMsgReg,
                        failure: function(form, action) {
                            switch (action.result.codMsg) {
                                case -1 :
                                    mostrarMensaje(1, scope.etiquetas.lbMsgModOk);
                                    Ext.getCmp('winmod').close();
                                    scope.dataMoneda.reload();
                                    break;
                                case -2 :
                                    mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteCodigo);
                                    break;
                                case -3 :
                                    mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteCodigoISO);
                                    break;
                                case -4 :
                                    mostrarMensaje(1, scope.etiquetas.lbMsgAddExisteNombre);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    break;
                            }
                        }
                    });
                /*} else {
                    mostrarMensaje(1, scope.etiquetas.lbMsgModNoChanges);
                }*/
            } else {
                mostrarMensaje(1, scope.etiquetas.msgCamposIncorrectos);
            }
        };

        scope.fObtenerDatosImprimirReporte = function() {
            Ext.MessageBox.show({
                // title: agTtl,
                msg: 'Cargando',
                width: 300,
                wait: true,
                waitConfig: {interval: 300},
                progress: true,
                closable: false
            });
            Ext.Ajax.request({
                method: "POST",
                url: scope.url + 'obtenerdatosreporte',
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    var responseData = Ext.decode(response.responseText);
                    scope.fOpenWindowReport(responseData);
                }
            });
        };

        scope.fOpenWindowReport = function(requestDataSources) {

            printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.show();
        };

        scope.eliminarMoneda = function() {
            if (scope.smMoneda.getSelections().length > 1)
                mostrarMensaje(2, scope.etiquetas.msgConfirmMonedasDel, elimina);
            else
                mostrarMensaje(2, scope.etiquetas.msgConfirmMonedaDel, elimina);
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var listIdMoneda = "";
                    Ext.each(scope.smMoneda.getSelections(), function(item, index) {
                        if (index == 0)
                            listIdMoneda += item.data.idmoneda;
                        if (scope.smMoneda.getSelections().length > 1 && index > 0)
                            listIdMoneda += "," + item.data.idmoneda;
                    });
                    scope.loadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbWaitMsgDel);
                    Ext.Ajax.request({
                        url: scope.url + 'eliminarmoneda',
                        params: {
                            idmoneda: listIdMoneda
                        },
                        method: 'POST',
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelOk);
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelsOk);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelsNoOk);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelsNoPluralOk);
                                    break;
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                            fAceptarCambios();
                            function fAceptarCambios(btnPress) {
                                scope.dataMoneda.removeAll();
                                scope.dataMoneda.reload();
                                Ext.MessageBox.hide();
                            }
                        }
                    });
                } else {
                    scope.btnAdicionar.focus();
                }
                scope.windowOp = false;
            }
        };
        scope.ClicDesclasificarAction = function() {
            if (scope.smMoneda.getSelections().length > 1)
                mostrarMensaje(2, scope.etiquetas.msgConfirmDescMonedasDel, elimina);
            else
                mostrarMensaje(2, scope.etiquetas.msgConfirmDescMonedaDel, elimina);
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var listIdMoneda = "";
                    Ext.each(scope.smMoneda.getSelections(), function(item, index) {
                        if (index == 0 && item.data.tipomoneda)
                            listIdMoneda += item.data.idmonedaentidad;
                        if (scope.smMoneda.getSelections().length > 1 && index > 0 && item.data.tipomoneda)
                            listIdMoneda += "," + item.data.idmonedaentidad;
                    });
                    scope.loadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbWaitMsgDesc);
                    Ext.Ajax.request({
                        url: scope.url + 'desclasificar',
                        params: {
                            idmonedaentidad: listIdMoneda
                        },
                        method: 'POST',
                        callback: function(options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDesclaOk);
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDDesclasOk);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDescNoOk);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDescNoPluralOk);
                                    break;
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                            fAceptarCambios();
                            function fAceptarCambios(btnPress) {
                                scope.dataMoneda.reload();
                                Ext.MessageBox.hide();
                            }
                        }
                    });
                } else {
                    scope.btnAdicionar.focus();
                }
                scope.windowOp = false;

            }
        };

        scope.isDirtyForm = function(idForm, smodel, decimalPrecision) {
            var objValuesForm = Ext.getCmp(idForm).getForm().getValues(false);
            var smodelData = smodel.getSelected().data;
            decimalPrecision = decimalPrecision || 2;
            var arrValuesForm = new Array();
            for (var name in objValuesForm) {
                arrValuesForm[name] = objValuesForm[name];
            }
            var arrValuesRecord = new Array();
            for (var valueRecord in smodelData) {
                arrValuesRecord[valueRecord] = smodelData[valueRecord];
            }
            for (var propValuesForm in arrValuesForm) {
                for (var propValuesRecord in arrValuesRecord) {
                    if (propValuesForm == propValuesRecord) {
                        var valuef = arrValuesForm[propValuesForm];
                        var valuer = arrValuesRecord[propValuesRecord];
                        if ((!isNaN(valuef)) && !isNaN(valuer)) {
                            if (parseFloat(valuef).toFixed(decimalPrecision) != parseFloat(valuer).toFixed(decimalPrecision)) {
                                return true;
                            }
                            if (parseInt(valuef, 10) != (parseInt(valuer, 10))) {
                                return true;
                            }
                        }
                        else {
                            if (valuef != valuer) {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        };

        scope.showImage = function(value, metaData, record, rowIndex, colIndex, store) {
            if (record.data.tipomoneda == 0) {
                metaData.attr = 'ext:qtip="' + '<b>Contable</b>"';
                metaData.css = 'icondistra-bandera"';
            } else if (record.data.tipomoneda == 1) {
                if(record.data.dualidad == 1){
                    metaData.attr = 'ext:qtip="' + '<b>Alternativa</b>"';
                    metaData.css = 'icondistra-bandera verde"';
                }else{
                    metaData.attr = 'ext:qtip="' + '<b>De la entidad</b>"';
                    metaData.css = 'icondistra-bandera amarillo"';
                }
            } else {
                metaData.attr = 'ext:qtip="' + '<b>Sin clasificar</b>"';
                metaData.css = 'icondistra-bandera gris"';
            }
        };

        scope.knowIfisCont = function() {
            scope.cont = false;
            scope.alter = false;
            Ext.each(Ext.getCmp('gpMoneda').getStore().data.items, function(item, i) {
                if (item.data.tipomoneda === '0') {
                    scope.cont = true;
                }
                if(item.data.dualidad == 1){
                    scope.alter = true;
                }
            });
        };

        scope.desmarcarGridCheckBox = function(grid) {
            var node = Ext.fly(grid.getView().getHeaderCell(0).firstChild);
            if (node != undefined) {
                if (node.hasClass('x-grid3-hd-checker-on')) {
                    node.removeClass('x-grid3-hd-checker-on');
                }
            }
            var styleList = grid.getView().getHeaderCell(0).firstChild.classList;
            if (styleList != undefined) {
                if (styleList.contains('x-grid3-hd-checker-on')) {
                    styleList.remove('x-grid3-hd-checker-on');
                }
            } else {
                var node = Ext.fly(grid.getView().getHeaderCell(0).firstChild);
                if (node != undefined)
                    if (node.hasClass('x-grid3-hd-checker-on')) {
                        node.removeClass('x-grid3-hd-checker-on');
                    }
            }
        };

        scope.GestionarDesglose = function(apl) {
            var desgloses = '';
            var longitud = scope.smChkDesgloses.getCount();
            if (longitud > 0) {
                for (var i = 0; i < longitud; i++) {
                    if (i != longitud - 1) {
                        desgloses += scope.smChkDesgloses.getSelections()[i].data.iddezglozemonedas + ',';
                    } else {
                        desgloses += scope.smChkDesgloses.getSelections()[i].data.iddezglozemonedas;
                    }
                }
                scope.adicionarDesglose(apl, desgloses);
            } else {
                mostrarMensaje(1, scope.etiquetas.msgSelOneDesglose);
                scope.windowOp = false;
            }
        };

        scope.adicionarDesglose = function(apl, desgloses) {
            Ext.Msg.wait("Guardando datos del desglose de moneda...", "Por favor espere...");
            Ext.Ajax.request({
                url: scope.url + 'insertadesglose',
                params: {
                    idmoneda: scope.smMoneda.getSelected().json.idmoneda,
                    desgloses: desgloses
                },
                method: 'POST',
                callback: function(options, success, response) {
                    Ext.Msg.hide();
                    if (!apl) {
                        Ext.getCmp('winRegDesglose').hide();
                        scope.windowOp = false;
                    } else {
                        scope.desmarcarGridCheckBox(scope.gpDesgloses);
                    }
                    responseData = Ext.decode(response.responseText);
                    switch (responseData.codMsg) {
                        case -1:
                            mostrarMensaje(1, scope.etiquetas.msgAddOneDesglose);
                            break;
                        case -2:
                            mostrarMensaje(1, scope.etiquetas.msgAddManyDesglose);
                            break;
                        default:
                            mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            break;
                    }
                    if (apl)
                        scope.stDesgloses.reload();
                    else
                        scope.stDesgloses.removeAll();
                    scope.stNomDesgloses.reload();
                    Ext.getCmp('btnEliminarMoneda').disable();
                }
            });
        };

        scope.eliminarDesglose = function() {
            scope.windowOp = true;
            if (!scope.smDesglose.getSelected() || !scope.smDesglose.getSelections()) {
                mostrarMensaje(1, scope.etiquetas.msgSelDelOneDesglose);
                scope.windowOp = false;
            } else {
                if (scope.smDesglose.getCount() == 1)
                    mostrarMensaje(2, scope.etiquetas.askDelOneDesglose, elimina);
                else
                    mostrarMensaje(2, scope.etiquetas.askDelManyDesglose, elimina);
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    if (scope.smDesglose.getCount() == 1)
                        Ext.Msg.wait("Eliminando datos del desglose de moneda...", "Por favor espere...");
                    else
                        Ext.Msg.wait("Eliminando datos del desglose de moneda(s)...", "Por favor espere...");
                    var id = "";
                    var cant = scope.smDesglose.getSelections().length;
                    for (var i = 0; i < cant; i++)
                        if (i < cant - 1) {
                            id += scope.smDesglose.getSelections()[i].json.iddezglozemoneda + ",";
                        } else {
                            id += scope.smDesglose.getSelections()[i].json.iddezglozemoneda;
                        }
                    Ext.Ajax.request({
                        url: scope.url + 'eliminardesglose',
                        method: 'POST',
                        params: {
                            desgloses: id
                        },
                        callback: function(options, success, response) {
                            Ext.Msg.hide();
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.msgDelOneDesglose);
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.msgDelManyDesglose);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelDesNoOk);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scope.etiquetas.lbMsgDelDesNoPluralOk);
                                    break;
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                            scope.stNomDesgloses.reload({
                                callback: function(record, options, success) {
                                    if (scope.stNomDesgloses.getTotalCount() == 0)
                                        scope.stNomDesgloses.removeAll();
                                    Ext.getCmp('gridDesglose').getView().refresh();
                                    scope.windowOp = false;
                                }
                            });
                            Ext.getCmp('btnEliminarDesglose').disable();
                        }
                    });
                } else {
                    scope.btnAdicionarDesglose.focus();
                    scope.windowOp = false;
                }
            }
        };

    }
};
function changevalue()
{
    var changed = false;
    var newvalue = Ext.getCmp('fMoneda').getForm().getValues();
    var oldvalue = scope.smMoneda.getSelected().json;
    for (k in newvalue) {
        if (oldvalue[k] && (newvalue[k] != oldvalue[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''))) {
            changed = true;
            break;
        }
        if (!oldvalue[k] && (newvalue[k] != scope.smMoneda.getSelected().json.organizacion)) {
            changed = true;
            break;
        }
    }
    return changed;
}
function comprobarVentanaMoneda() {

    if (Ext.getCmp('fMoneda').getForm().isValid()) {
        if (Ext.getCmp('idWindAplicar'))
        {
            Ext.getCmp('idWindAplicar').enable();
        }
        if (Ext.getCmp('idWindAceptar'))
        {
            Ext.getCmp('idWindAceptar').enable();
        }
        if (Ext.getCmp('idWindModificar'))
        {
            if (changevalue())
            {
                Ext.getCmp('idWindModificar').enable();
            }
            else {
                Ext.getCmp('idWindModificar').disable();
            }
        }

    }
    else {
        if (Ext.getCmp('idWindAplicar')) {
            Ext.getCmp('idWindAplicar').disable();
        }
        if (Ext.getCmp('idWindAceptar'))
        {
            Ext.getCmp('idWindAceptar').disable();
        }
        if (Ext.getCmp('idWindModificar'))
        {
            Ext.getCmp('idWindModificar').disable();
        }

    }
}
Ext.Configuracion_General_Nomencladores.NomencladorMoneda = Ext.extend(Ext.Panel,
        {
            perfil: window.parent.UCID.portal.perfil,
            desglose: false,
            constructor: function(config) {
                Ext.QuickTips.init();
                scope = this;
                scope.config = config;
                scope.etiquetas = new Object();
                scope.windowOp = false;
                scope.etiquetas = Conf.NomMoneda.etiquetas;
                scope.hideBtns = Conf.CargaInicial ? false : true;
                actionValidate.validate();

                scope.url = '/configuracion/multimoneda/index.php/gestnommoneda/';
                scope.model = Ext.Configuracion_General_Nomencladores.NomencladorMonedaModel;
                scope.controller = Ext.Configuracion_General_Nomencladores.NomencladorMonedaController;
                Ext.apply(this, config);
                scope.model.init(scope);
                scope.controller.init(scope);
                scope.init(scope);
            },
            init: function(scope) {
                scope.busqueda = false;
                scope.busquedaDes = false;
                scope.btnAdicionar = new Ext.Button({
                    id: 'btnAdicionarMoneda',
                    iconCls: 'adicionar',
                    hidden: scope.hideBtns,
                    tooltip: scope.etiquetas.lbTtAdicionarMoneda,
                    text: scope.etiquetas.lbAdicionar,
                    handler: function() {
                        scope.windowOp = true;
                        scope.WinAddModNomMoneda('Ins');
                    }
                });
                scope.btnModificar = new Ext.Button({
                    id: 'btnModificarMoneda',
                    iconCls: 'modificar',
                    disabled: true,
                    hidden: scope.hideBtns,
                    tooltip: scope.etiquetas.lbTtModificarMoneda,
                    text: scope.etiquetas.lbModificar,
                    handler: function() {
                        scope.windowOp = true;
                        if (scope.gpMoneda.getSelectionModel().selections.items.length > 0) {
                            scope.WinAddModNomMoneda('Mod');
                        } else {
                            mostrarMensaje(1, scope.etiquetas.lbMonSelc);
                        }
                    }
                });
                scope.btnEliminar = new Ext.Button({
                    id: 'btnEliminarMoneda',
                    iconCls: 'eliminar',
                    disabled: true,
                    hidden: scope.hideBtns,
                    text: scope.etiquetas.lbEliminar,
                    tooltip: scope.etiquetas.lbTtEliminarMoneda,
                    handler: function() {
                        if (scope.gpMoneda.getSelectionModel().selections.items.length > 0) {
                            scope.windowOp = true;
                            scope.eliminarMoneda();
                        } else {
                            mostrarMensaje(1, scope.etiquetas.lbMonSelc);
                        }
                    }
                });
                scope.btnVistaReporte = new Ext.Button({
                    id: 'btnVistaReporteMoneda',
                    tabIndex: 2,
                    hidden: scope.hideBtns,
                    iconCls: 'vistareporte',
                    text: scope.etiquetas.lbBtnVista,
                    tooltip: scope.etiquetas.lbTtReporte,
                    handler: function() {
                        scope.fObtenerDatosImprimirReporte();
                    }
                });
                scope.btnAyuda = new Ext.Button({
                    id: 'btnAyudaMoneda',
                    iconCls: 'ayuda',
                    text: scope.etiquetas.lbAyuda,
                    tooltip: scope.etiquetas.lbTtAyuda
                });
                scope.menuItemAContable = new Ext.menu.Item({
                    id: 'mMonedaContable',
                    text: scope.etiquetas.lbContable,
                    hidden: scope.hideBtns,
                    iconCls:'bandera'
                });
                scope.menuItemAlternativa = new Ext.menu.Item({
                    id: 'mMonedaAlternativa',
                    text: scope.etiquetas.lbAlternativa,
                    hidden: scope.hideBtns,
                    iconCls:'bandera verde'
                });
                scope.menuItemDeLaEntidad = new Ext.menu.Item({
                    id: 'mMonedaEntidad',
                    text: scope.etiquetas.lbDeLaEntidad,
                    hidden: scope.hideBtns,
                    iconCls:'bandera amarillo'
                });
                scope.menuItemDesclasificar = new Ext.menu.Item({
                    id: 'mDesclasificarMoneda',
                    text: scope.etiquetas.lbDesclasificar,
                    hidden: scope.hideBtns,
                    iconCls:'bandera gris'
                });
                scope.menuContextual = new Ext.menu.Menu({
                    floating: false,
                    shadow: "drop",
                    hideBorders: true,
                    items: [scope.menuItemAContable, scope.menuItemAlternativa,scope.menuItemDeLaEntidad, scope.menuItemDesclasificar]
                });
                scope.smMoneda = new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    listeners: {
                        rowselect: function(smodel, rowIndex, record) {
                            Ext.getCmp('gpMoneda').getView().addRowClass(rowIndex, "negrita");
                        },
                        rowdeselect: function(smodel, rowIndex, record) {
                            Ext.getCmp('gpMoneda').getView().removeRowClass(rowIndex, "negrita");
                        }
                    }
                });
                scope.gpMoneda = new Ext.grid.GridPanel({
                    id: 'gpMoneda',
                    frame: false,
                    border:false,
                    height: 250,
                    autoExpandColumn: 'expandir',
                    loadMask: {
                        store: scope.dataMoneda,
                        msg: scope.etiquetas.lbCargar
                    },
                    width: 450,
                    store: scope.dataMoneda,
                    sm: scope.smMoneda,
                    stripeRows: true,
                    floating: false,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [{
                            header: scope.etiquetas.lbCodigo,
                            width: 100,
                            dataIndex: 'codigo',
                            sortable: true
                        }, {
                            header: scope.etiquetas.lbCodigoISO,
                            width: 100,
                            dataIndex: 'codigoiso',
                            sortable: true
                        }, {
                            id: 'expandir',
                            header: scope.etiquetas.lbMoneda,
                            width: 250,
                            dataIndex: 'nombremoneda'
                        }, {
                            header: scope.etiquetas.lbOrganizacion,
                            width: 250,
                            dataIndex: 'organizacion'
                        }, {
                            header: scope.etiquetas.lbSimbolo,
                            width: 100,
                            dataIndex: 'simbolo'
                        }, {
                            header: scope.etiquetas.lbClasific,
                            width: 100,
                            dataIndex: 'clasificacion',
                            align: 'center',
                            renderer: scope.showImage
                        }
                    ],
                    tbar: [
                        scope.sfMoneda = new Ext.Cont.SearchField({
                            id: 'sfMoneda',
                            width: 250,
                            emptyText: scope.etiquetas.lbCriterioBuscar,
                            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                            searchTooltip: scope.etiquetas.lbsearchTooltip,
                            fnOnSearch: function() {
                                scope.busqueda = true;
                                scope.buscarMoneda();
                            },
                            fnOnClear: function() {
                                scope.busqueda = false;
                                scope.buscarMoneda();
                            }
                        })],
                    bbar: new Ext.Cont.PagingToolbar({
                        pageSize: 20,
                        displayInfo: true,
                        displayMsg: scope.etiquetas.lbDisplayMsg,
                        emptyMsg: scope.etiquetas.lbEmptyMsg,
                        prevText: scope.etiquetas.beforePageText,
                        nextText: scope.etiquetas.afterPageText,
                        firstText: scope.etiquetas.firstPageText,
                        lastText: scope.etiquetas.lastPageText,
                        tabIndex: 314,
                        store: scope.dataMoneda
                    })
                });

                scope.dataMoneda.on({
                    load: function(store, record, options) {
                        if (scope.dataMoneda.getTotalCount() == 0) {
                            if (!scope.busqueda) {
                                mostrarMensaje(1, scope.etiquetas.lbNoResultados);
                            } else {
                                mostrarMensaje(1, scope.etiquetas.lbNoResults);
                                scope.busqueda = false;
                            }
                        }
                        scope.btnModificar.disable();
                        scope.btnEliminar.disable();
                        if (scope.smMoneda.getSelected()) {
                            scope.smMoneda.clearSelections();
                        }
                        options.callback = function() {
                            Ext.MessageBox.hide();
                        };
                    }
                });

                scope.gpMoneda.on({
                    rowclick: function() {
                        if (scope.smMoneda.getSelections().length == 1) {
                            scope.btnModificar.enable();
                            scope.btnEliminar.enable();
                        } else {
                            if (scope.smMoneda.getSelections().length > 1) {
                                scope.btnModificar.disable();
                                scope.btnEliminar.enable();
                            } else {
                                scope.btnModificar.disable();
                                scope.btnEliminar.disable();
                                scope.pDetalles.collapse();
                                scope.stNomDesgloses.removeAll();
                                scope.btnAdicionarDesglose.disable();
                            }
                        }
                    }, rowcontextmenu: function(grid, rowIndex, eventObject) {
                        scope.knowIfisCont();
                        eventObject.stopEvent();
                        var record = scope.dataMoneda.getAt(rowIndex);
                        if (record.data.tipomoneda === '1') {
                            if(record.data.dualidad==1){
                                scope.menuItemAlternativa.hide();
                                scope.menuItemDeLaEntidad.show();
                            }else{
                                if(!scope.alter  && scope.smMoneda.getSelections().length == 1){
                                    scope.menuItemAlternativa.show();
                                }else{
                                    scope.menuItemAlternativa.hide();
                                }
                                scope.menuItemDeLaEntidad.hide();
                            }
                            scope.menuItemDesclasificar.show();
                            if (!scope.cont && scope.smMoneda.getSelections().length == 1)
                                scope.menuItemAContable.show();
                            else
                                scope.menuItemAContable.hide();
                        } else if (record.data.tipomoneda === '0') {
                            scope.menuItemAContable.hide();
                            if(!scope.alter  && scope.smMoneda.getSelections().length == 1){
                                scope.menuItemAlternativa.show();
                            }else{
                                scope.menuItemAlternativa.hide();
                            }
                            scope.menuItemDeLaEntidad.show();
                            scope.menuItemDesclasificar.show();
                        } else {
                            if (!scope.cont && scope.smMoneda.getSelections().length == 1)
                                scope.menuItemAContable.show();
                            else
                                scope.menuItemAContable.hide();
                            if(!scope.alter  && scope.smMoneda.getSelections().length == 1){
                                scope.menuItemAlternativa.show();
                            }else{
                                scope.menuItemAlternativa.hide();
                            }
                            scope.menuItemDeLaEntidad.show();
                            scope.menuItemDesclasificar.hide();
                        }
                        if (scope.smMoneda.getSelected())
                            scope.menuContextual.showAt(eventObject.getXY());
                        else
                            scope.menuContextual.hide();
                        if (scope.menuItemAContable.isVisible() && !actionValidate.actions[scope.menuItemAContable.id] && scope.hideBtns) {
                            scope.menuItemAContable.hide();
                        }
                        if (scope.menuItemAlternativa.isVisible() && !actionValidate.actions[scope.menuItemAlternativa.id] && scope.hideBtns) {
                            scope.menuItemAlternativa.hide();
                        }
                        if (scope.menuItemDeLaEntidad.isVisible() && !actionValidate.actions[scope.menuItemDeLaEntidad.id] && scope.hideBtns) {
                            scope.menuItemDeLaEntidad.hide();
                        }
                        if (scope.menuItemDesclasificar.isVisible() && !actionValidate.actions[scope.menuItemDesclasificar.id] && scope.hideBtns) {
                            scope.menuItemDesclasificar.hide();
                        }
                        if ((record.data.tipomoneda === '1' && !scope.menuItemDeLaEntidad.isVisible() && !scope.menuItemAlternativa.isVisible() && !scope.menuItemDesclasificar.isVisible())
                            || (record.data.tipomoneda === '0' && !scope.menuItemDeLaEntidad.isVisible() && !scope.menuItemDesclasificar.isVisible() && !scope.menuItemAlternativa.isVisible())
                            || (!record.data.tipomoneda && !scope.menuItemAContable.isVisible() && !scope.menuItemAlternativa.isVisible() && !scope.menuItemDeLaEntidad.isVisible()) && scope.hideBtns) {
                            scope.menuContextual.hide();
                        }
                    }, dblclick: function(smodel, rowIndex, keepExisting, record) {
                        scope.pDetalles.expand();
                        scope.stNomDesgloses.load({
                            params: {
                                idmoneda: scope.smMoneda.getSelected().json.idmoneda,
                                start: 0,
                                limit: 20
                            }, callback: function() {
                                scope.gridDesglose.enable();
                                scope.btnAdicionarDesglose.enable();
                            }
                        });
                    }
                });

                scope.menuItemAContable.on('click', function() {
                    scope.ClickContableAction(0);
                });

                scope.menuItemAlternativa.on('click', function() {
                    scope.ClickContableAction(1,1);
                });

                scope.menuItemDeLaEntidad.on('click', function() {
                    scope.ClickContableAction(1);
                });

                scope.menuItemDesclasificar.on('click', function() {
                    scope.ClicDesclasificarAction();
                });

                scope.smDesglose = new Ext.grid.RowSelectionModel({
                    singleSelect: false,
                    listeners: {
                        rowselect: function(selectioModel, rowIndex, record) {
                            Ext.getCmp('gridDesglose').getView().addRowClass(rowIndex, "negrita");
                            if (selectioModel.selections.length >= 1)
                                Ext.getCmp('btnEliminarDesglose').enable();
                            else
                                Ext.getCmp('btnEliminarDesglose').disable();
                        },
                        rowdeselect: function(selectioModel, rowIndex, record) {
                            Ext.getCmp('gridDesglose').getView().removeRowClass(rowIndex, "negrita");
                            if (selectioModel.selections.length >= 1)
                                Ext.getCmp('btnEliminarDesglose').enable();
                            else
                                Ext.getCmp('btnEliminarDesglose').disable();
                        }
                    }
                });

                scope.btnAdicionarDesglose = new Ext.Button({
                    id: 'btnAdicionarDesglose',
                    iconCls: 'adicionar',
                    disabled: true,
                    hidden: true,
                    tooltip: scope.etiquetas.lbTtAdicionarDesglose,
                    text: scope.etiquetas.lbAdicionar,
                    handler: function() {
                        scope.winFpDesglose();
                    }
                });

                scope.btnEliminarDesglose = new Ext.Button({
                    id: 'btnEliminarDesglose',
                    iconCls: 'eliminar',
                    disabled: true,
                    hidden: true,
                    text: scope.etiquetas.lbEliminar,
                    tooltip: scope.etiquetas.lbTtEliminarDesglose,
                    handler: function() {
                        scope.eliminarDesglose();
                    }
                });

                scope.stNomDesgloses = new Ext.data.Store({
                    url: scope.url + 'cargardezglozemonedas',
                    baseParams: {
                        start: 0,
                        limit: 20
                    },
                    reader: new Ext.data.JsonReader({
                        totalProperty: "cant",
                        root: "datos",
                        id: "iddezglozemoneda"
                    },
                    [{
                            name: 'iddezglozemoneda'
                        },
                        {
                            name: 'valor'
                        },
                        {
                            name: 'denominacion'
                        },
                        {
                            name: 'valor'
                        }]
                            ),
                    sortInfo: {
                        field: 'valor',
                        direction: 'ASC'
                    }
                });

                scope.gridDesglose = new Ext.grid.GridPanel({
                    store: scope.stNomDesgloses,
                    sm: scope.smDesglose,
                    id: 'gridDesglose',
                    loadMask: true,
                    frame: false,
                    region: 'center',
                    stripeRows: true,
                    disabled: true,
                    border: false,
                    floating: false,
                    viewConfig: {
                        forceFit: true
                    },
                    autoExpandColumn: 'descripcion',
                    columns: [{
                            hidden: true,
                            hideable:false,
                            dataIndex: 'iddezglozemoneda'
                        }, {
                            sortable: true,
                            width: 100,
                            header: scope.etiquetas.lbValor,
                            dataIndex: 'valor'
                        }, {
                            id: 'descripcion',
                            sortable: true,
                            width: 350,
                            header: scope.etiquetas.lbDenominacion,
                            dataIndex: 'denominacion'
                        }],
                    tbar: [
                        scope.sfDesglose = new Ext.Cont.SearchField({
                            id: 'sfDesglose',
                            width: 250,
                            emptyText: scope.etiquetas.lbCriterioBuscar,
                            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]*)+$/,
                            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]*)+$/,
                            searchTooltip: scope.etiquetas.lbsearchDesTooltip,
                            clearTooltip: scope.etiquetas.lbclearTooltipDes,
                            fnOnSearch: function() {
                                scope.busquedaDes = true;
                                scope.buscarDesglose();
                            },
                            fnOnClear: function() {
                                scope.busquedaDes = false;
                                scope.buscarDesglose();
                            }
                        })],
                    bbar: new Ext.Cont.PagingToolbar({
                        pageSize: 20,
                        displayInfo: true,
                        displayMsg: scope.etiquetas.lbDisplayMsg,
                        emptyMsg: scope.etiquetas.lbEmptyMsg,
                        prevText: scope.etiquetas.beforePageText,
                        nextText: scope.etiquetas.afterPageText,
                        firstText: scope.etiquetas.firstPageText,
                        lastText: scope.etiquetas.lastPageText,
                        tabIndex: 314,
                        store: scope.stNomDesgloses
                    })
                });

                scope.pDetalles = new Ext.Panel({
                    region: 'south',
                    hidden: scope.desglose,
                    collapsed: true,
                    collapsible: true,
                    title: scope.etiquetas.lbTitDesglose,
                    height: 350,
                    frame: false,
                    border:false,
                    layout: 'border',
                    items: [scope.gridDesglose],
                    tbar: [scope.btnAdicionarDesglose, scope.btnEliminarDesglose]
                });

                scope.stDesgloses = new Ext.data.Store({
                    url: scope.url + 'cargardezgloze',
                    reader: new Ext.data.JsonReader({
                        root: "datos",
                        id: "iddezglozemonedas"
                    },
                    [{
                            name: 'iddezglozemonedas'
                        },
                        {
                            name: 'denominacion'
                        },
                        {
                            name: 'valor',
                            type: 'float'
                        }
                    ]),
                    sortInfo: {
                        field: 'valor',
                        direction: 'ASC'
                    }
                });

                scope.stNomDesgloses.on({
                    load: function(store, records, options) {
                        Ext.MessageBox.hide();
                        if (scope.pDetalles.hidden == false)
                            if (store.getCount() == 0) {
                                if (!scope.busquedaDes) {
                                    mostrarMensaje(1, scope.etiquetas.lbNoResultados);
                                    scope.busquedaDes = false;
                                } else {
                                    mostrarMensaje(1, scope.etiquetas.lbNoResults);
                                }
                            }
                    },
                    beforeload: function () {
                        scope.stNomDesgloses.baseParams.idmoneda = scope.smMoneda.getSelected().json.idmoneda;
                    }
                });

                scope.smChkDesgloses = new Ext.grid.CheckboxSelectionModel();

                scope.gpDesgloses = new Ext.grid.GridPanel({
                    id: 'gpDesgloses',
                    frame: false,
                    store: scope.stDesgloses,
                    margins: '2 2 2 -4',
                    height: 250,
                    sm: scope.smChkDesgloses,
                    autoExpandColumn: 'expandir',
                    loadMask: scope.etiquetas.lbCargar,
                    enableColumnHide: true,
                    disabled: true,
                    autoScroll: true,
                    stripeRows: true,
                    floating: false,
                    border:false,
                    viewConfig: {
                        forceFit: true
                    },
                    columns: [
                        scope.smChkDesgloses,
                        {
                            hidden: true,
                            dataIndex: 'iddezglozemonedas'
                        },
                        {
                            id: 'expandir',
                            header: scope.etiquetas.lbDesgloses,
                            width: 350,
                            dataIndex: 'denominacion',
                            sortable: true
                        }
                    ]
                });

                scope.fpDesglose = new Ext.FormPanel({
                    id: 'fpDesglose',
                    labelAlign: 'top',
                    frame: false,
                    border: false,
                    layout: 'fit',
                    bodyStyle: 'padding:2px 2px 0',
                    waitMsgTarget: false,
                    items: [scope.gpDesgloses]
                });

                scope.winFpDesglose = function() {
                    scope.windowOp = true;
                    scope.stDesgloses.load({
                        params: {
                            idmoneda: scope.smMoneda.getSelected().json.idmoneda,
                            start: 0,
                            limit: 20
                        }, callback: function() {
                            scope.gpDesgloses.enable();
                        }
                    });
                    if (!scope.winRegDesglose) {
                        scope.winRegDesglose = new Ext.Window({
                            id: 'winRegDesglose',
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            constrain:true,
                            resizable: false,
                            defaultButton: 'btnAdicionarDesglose',
                            title: scope.etiquetas.lbTtlAddDesglose,
                            width: 450,
                            height: 400,
                            buttons: [
                                {
                                    id: 'btnCancelar',
                                    iconCls: 'cancelar',
                                    text: scope.etiquetas.lbCancelar,
                                    tooltip: scope.etiquetas.lbTtCancelar,
                                    handler: function() {
                                        scope.windowOp = false;
                                        scope.winRegDesglose.hide();
                                    }
                                },
                                {
                                    id: 'btnAplicar',
                                    iconCls: 'aplicar',
                                    text: scope.etiquetas.lbAplicar,
                                    tooltip: scope.etiquetas.lbTtAplicar,
                                    handler: function() {
                                        scope.GestionarDesglose('apl');
                                    }
                                },
                                {
                                    id: 'btnAceptar',
                                    iconCls: 'aceptar',
                                    text: scope.etiquetas.lbAceptar,
                                    tooltip: scope.etiquetas.lbTtAceptar,
                                    handler: function() {
                                        scope.GestionarDesglose();
                                    }
                                }]
                        });
                        scope.winRegDesglose.on('hide', function() {
                            scope.desmarcarGridCheckBox(scope.gpDesgloses);
                            scope.btnAdicionarDesglose.focus();
                        });
                        scope.winRegDesglose.on('render', function() {
                            scope.winRegDesglose.focus();
                        });
                    }
                    if (scope.stDesgloses.getTotalCount() > 0) {
                        scope.stDesgloses.removeAll();
                    }
                    scope.fpDesglose.getForm().reset();
                    scope.winRegDesglose.add(scope.fpDesglose);
                    scope.winRegDesglose.doLayout();
                    scope.winRegDesglose.show();
                };

                var tbar = [scope.btnAdicionar, scope.btnModificar, scope.btnEliminar, scope.btnVistaReporte, '->'];
                if (!(Conf && Conf.CargaInicial && Conf.CargaInicial.Vista && Conf.CargaInicial.Vista.cmbOrgano)) {
                    scope.cmbOrganos = new Ext.CmbOrganos({
                        idioma: scope.etiquetas,
                        gridStore: scope.dataMoneda
                    });
                    tbar.push(scope.cmbOrganos);
                }
                tbar.push(scope.btnAyuda);

                scope.pnlNomMoneda = new Ext.Panel({
                    region: 'center',
                    layout: 'border',
                    border: true,
                    items: [{
                            layout: 'fit',
                            region: 'center',
                            items: scope.gpMoneda,
                            border:false
                        }, scope.pDetalles],
                    listeners: {
                        render: function() {
                            scope.btnAdicionar.focus();
                        }
                    },
                    keys: scope.hotKeysNomMoneda = new Ext.KeyMap(Ext.getBody(), [
                        {
                            key: 'i',
                            alt: true,
                            fn: function() {
                                if (scope.btnAdicionar.isVisible() && !scope.btnAdicionar.disabled && scope.windowOp == false)
                                    scope.btnAdicionar.handler.call();
                            }
                        }, {
                            key: 'm',
                            alt: true,
                            fn: function() {
                                if (scope.btnModificar.isVisible() && !scope.btnModificar.disabled && scope.windowOp == false)
                                    scope.btnModificar.handler.call();
                            }
                        }, {
                            key: "r",
                            alt: true,
                            fn: function() {
                                if (scope.btnVistaReporte.isVisible()) {
                                    scope.btnVistaReporte.handler.call();
                                }

                            }
                        }, {
                            key: Ext.EventObject.DELETE,
                            ctrl: true,
                            fn: function() {
                                if (scope.btnEliminarDesglose.isVisible() && !scope.pDetalles.collapsed && scope.smMoneda.hasSelection() && !scope.btnEliminarDesglose.disabled && scope.windowOp == false) {
                                    scope.eliminarDesglose();
                                }
                            }
                        },
                        {
                            key: Ext.EventObject.DELETE,
                            fn: function() {
                                if (scope.btnEliminar.isVisible() && !scope.btnEliminar.disabled && scope.windowOp == false && Ext.EventObject.ctrlKey != 1)
                                    scope.btnEliminar.handler.call();
                            }
                        }, {
                            key: 'b',
                            alt: true,
                            fn: function() {
                                if(Ext.getCmp('sfMoneda').getRawValue().length > 0){
                                    Ext.getCmp('sfMoneda').onTrigger2Click();
                                }else{
                                    Ext.getCmp('sfMoneda').focus();
                                }
                            }
                        }, {
                            key: 'l',
                            alt: true,
                            fn: function() {
                                if(Ext.getCmp('sfMoneda').getRawValue().length > 0) {
                                    Ext.EventObject.stopEvent();
                                    Ext.getCmp('sfMoneda').onTrigger1Click();
                                }
                            }
                        }, {
                            key: 'b',
                            ctrl: true,
                            fn: function() {
                                if(Ext.getCmp('sfDesglose').getRawValue().length > 0){
                                    Ext.getCmp('sfDesglose').onTrigger2Click();
                                }else{
                                    Ext.getCmp('sfDesglose').focus();
                                }
                            }
                        }, {
                            key: 'l',
                            ctrl: true,
                            fn: function() {
                                if(Ext.getCmp('sfDesglose').getRawValue().length > 0) {
                                    Ext.EventObject.stopEvent();
                                    Ext.getCmp('sfDesglose').onTrigger1Click();
                                }
                            }
                        }/*, {
                            key: 'h',
                            alt: true,
                            fn: function() {
                                help.show(scope.etiquetas.lbTtlAyuda, 'CG/multi-moneda/gestnommoneda');
                            }
                        }*/, {
                            key: 'i',
                            ctrl: true,
                            fn: function() {
                                if (scope.btnAdicionarDesglose.isVisible() && !scope.pDetalles.collapsed && scope.smMoneda.hasSelection() && scope.windowOp == false) {
                                    scope.winFpDesglose();
                                }
                            }
                        }

                    ]),
                    tbar: tbar
                });
                Ext.apply(scope.config);
                this.items = scope.pnlNomMoneda;
                Ext.Configuracion_General_Nomencladores.NomencladorMoneda.superclass.constructor.call(this, scope.config);

            }
        });

Ext.reg('nomMoneda', Ext.Configuracion_General_Nomencladores.NomencladorMoneda);



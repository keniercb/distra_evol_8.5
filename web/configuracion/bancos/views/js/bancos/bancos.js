/**
 * UCID - Configuracion General
 * @description Banco y sucursales.
 *
 * @author Ing. Miguel Diaz Riveaux.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.ConfGnral.NomGnral
 * @copyright XETID.
 * @version 2.0
 */

Ext.QuickTips.init();
Ext.namespace('Ext.ConfGnral.NomGnral');
Ext.ConfGnral.NomGnral.BancoSucursal = {};
(function (scope) {
    scope = this;
    scope.perfil = window.parent.UCID.portal.perfil;
    scope.init = (function () {
        UCID.portal.cargarEtiquetas('bancos', function () {
            scope.cargarInterfaz(scope.perfil, scope.perfil.etiquetas);
        });
    })();
    scope.cargarInterfaz = function (perfil, etiquetas) {
        var sm, stnom_banco, stnom_sucursal;
        var winGestNCl, winInsNCl, winModNCl, winInsNClA, winModNClA;
        var fpRegNomBanco, fpRegNomSucursales, botModi, botAdd, botElim, botonModificar, botonEliminar, btnAddBanco;
        var nombreb, modificar;
        var codigob, elemento;
        var cib;
        var isOpenW = false;
        var isOpenWIBanco = false;
        var isOpenWMBanco = false;
        var isOpenWISucursal = false;
        var isOpenWMSucursal = false;
        var sm1;
        var gpNomBanco;
        var bandera = false;
        var tfcodigo, tfnombre, tfabreviatura, store, recordT, p1, p2, cmbmetodo;
        etiquetas = etiquetas || scope.perfil.etiquetas;

        actionValidate.validate();

        // Store para leer fuente de datos del grid
        stnom_banco = new Ext.data.Store({
            url: 'cargar',
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'idbanco'
            }, {
                name: 'codigo'
            }, {
                name: 'nombre'
            }, {
                name: 'abreviatura'
            }])
        });


        stnom_sucursal = new Ext.data.Store({
            url: 'cargarsucursales',
            baseParams: {
                start: 0,
                limit: 10
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'idsucursal'
            }, {
                name: 'numero'
            }, {
                name: 'direccion'
            }, {
                name: 'idbanco'
            }, {
                name: 'metodo'
            }])
        });

        sm = new Ext.grid.RowSelectionModel();
        sm1 = new Ext.grid.RowSelectionModel();
        stnom_banco.load();

        stnom_banco.on({
            load: function () {
                if (stnom_banco.getTotalCount() != 0) {
                    botonModificar.enable();
                    botonEliminar.enable();
                    if (!sm.getSelected() && !modificar) {
                        sm.selectFirstRow();
                        modificar = false;
                    }
                }
                else {
                    if (bandera) {
                        stnom_sucursal.removeAll();
                        botAdd.disable();
                        botModi.disable();
                        botElim.disable();
//                        notifyEvent(gpNomBanco.el.dom, 'Información', etiquetas.msgResultBuscar);
                        mostrarMensaje(1, etiquetas.msgResultBuscar);
                        bandera = false;
                    } else {
//                        notifyEvent(gpNomBanco.el.dom, 'Información', etiquetas.msgResult);
                        mostrarMensaje(1, etiquetas.msgResult);
                    }
                    if (stnom_banco.getTotalCount() == 0)
                        botonModificar.disable();
                    botonEliminar.disable();
                }
            },
            datachanged: function () {
                if (modificar)
                    for (var i = 0; i < stnom_banco.getCount(); i++) {
                        if (stnom_banco.getAt(i).data.idbanco == elemsel)
                            sm.selectRow(i, true);
                    }
                modificar = false;
            }
        });

        stnom_sucursal.on({
            datachanged: function () {
                modificar = false;

                if (stnom_sucursal.getTotalCount() == 0) {

                    if (stnom_banco.getTotalCount() == 0)
                        botAdd.disable();
                    else
                        botAdd.enable();

                    botModi.disable();
                    botElim.disable();
                }
                else
                    sm1.selectFirstRow();
            },
            load: function () {
                /* if(stnom_sucursal.getTotalCount() === 0)
                 mostrarMensaje(1, etiquetas.lbNoResultados);*/
                if (stnom_sucursal.getTotalCount() == 0) {
                    if (bandera) {
                        mostrarMensaje(1, etiquetas.msgResultBuscar);
                        bandera = false;
                    } else if(!p.collapsed){
                        mostrarMensaje(1, etiquetas.msgResult);
                    }
                }

            },
            beforeload: function () {
                stnom_sucursal.baseParams.idbanco = sm.getSelected().data.idbanco;
            }
        });

        tfabreviatura = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            id: 'abreviatura',
            fieldLabel: etiquetas.lbAbrev,
            name: 'abreviatura',
            allowBlank: false,
            maxLength: 10,
            selectOnFocus: true,
            enableKeyEvents: true,
            //vtype:'vtLetras',
            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \-\(\)]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \-\(\)]+ ?[a-zA-Z\s]*)+$/,
            regexText: etiquetas.regexTextValAbre,
            blankText: etiquetas.bTextCampReq,
            anchor: '100%',
            editable: false,
            listeners: {
                keyup: function () {
                    activarBotones();
                }
            }
        });

        tfnombre = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            allowBlank: false,
            selectOnFocus: true,
            enableKeyEvents: true,
            blankText: etiquetas.bTextCampReq,
            editable: false,
            maxLength: 100,
            id: 'nombre',
            name: 'nombre',
            //vtype: 'vtAlfanumericoSinEspaciosPrincioFinal',
            regex: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z\s]*)+$/,
            regexText: etiquetas.regexTextVal,
            fieldLabel: etiquetas.lbNombre,
            anchor: '100%',
            listeners: {
                keyup: function () {
                    activarBotones();
                }
            }
        });
        tfcodigo = new Ext.form.TextField({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true,
            blankText: etiquetas.bTextCampReq,
            editable: false,
            id: 'codigo',
            name: 'codigo',
            //maskRe: /^\d+$/,
            vtype: 'vtAlfanumerico',
            //regexText: etiquetas.regexTextValCod,
            //regex: /^\d+$/,
            fieldLabel: etiquetas.lbCodigo,
            minLength: 1,
            maxLength: 15,
            minLengthText: etiquetas.lbMinLengthText,
            maxLengthText: etiquetas.lbMaxLengthText,
            allowBlank: false,
            anchor: '100%',
            listeners: {
                keyup: function () {
                    activarBotones();
                }
            }
        });

        function activarBotones() {
            if (fpRegNomBanco.getForm().isValid()) {
                if (isOpenWIBanco) {
                    Ext.getCmp('idbtnAddBanco').enable();
                    Ext.getCmp('btnAplI').enable();
                } else if (isOpenWMBanco) {
                    if (sm.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegNomBanco.getForm().getValues().nombre
                        || sm.getSelected().data.codigo.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegNomBanco.getForm().getValues().codigo
                        || sm.getSelected().data.abreviatura.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegNomBanco.getForm().getValues().abreviatura) {
                        Ext.getCmp('idbtnAceptarMod').enable();
                    } else {
                        Ext.getCmp('idbtnAceptarMod').disable();
                    }
                }
            } else {
                if (isOpenWIBanco) {
                    Ext.getCmp('idbtnAddBanco').disable();
                    Ext.getCmp('btnAplI').disable();
                } else if (isOpenWMBanco) {
                    Ext.getCmp('idbtnAceptarMod').disable();
                }
            }
        }

        gpNomBanco = new Ext.grid.GridPanel({
            region: 'center',
            loadMask: etiquetas.loadMaskCargando,
            stripeRows: true,
            split: true,
            listeners: {
                dblclick: function () {
                    p.expand();
                }
            },
            iconCls: 'icon-grid',
            autoExpandColumn: 'expandir',
            store: stnom_banco,
            sm: sm,
            frame: true,
            titleCollapse: true,
            viewConfig: {
                forceFit: true,
                enableRowBody: true
            },
            enableDragDrop: true,
            columns: [{
                dataIndex: 'idbanco',
                hidden: true,
                hideable: false,
                width: 0
            }, {
                header: etiquetas.lbCodigo,
                dataIndex: 'codigo',
                width: 200,
                sortable: true
            }, {
                header: etiquetas.lbNombre,
                width: 250,
                dataIndex: 'nombre',
                id: 'expandir',
                sortable: true
            }, {
                header: etiquetas.lbAbrev,
                width: 250,
                dataIndex: 'abreviatura',
                sortable: true
            }],
            tbar: [
                sfBancos = new Ext.Cont.SearchField({
                    id: 'sfBancos',
                    width: 250,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                    emptyText: etiquetas.lbCriterioBuscar,
                    //clearTooltip: etiquetas.lbclearTooltip,
                    searchTooltip: etiquetas.lbsearchTooltipBancos,
                    fnOnSearch: function () {
                        bandera = true;
                        buscarNomBanco();

                    },
                    fnOnClear: function () {
                        bandera = false;
                        limpiarNomBanco();
                    }
                })],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 10,
                store: stnom_banco,
                displayInfo: true,
                displayMsg: etiquetas.lbDisplayMsg,
                emptyMsg: etiquetas.lbEmptyMsg,
                prevText: etiquetas.beforePageText,
                nextText: etiquetas.afterPageText,
                firstText: etiquetas.firstPageText,
                lastText: etiquetas.lastPageText
            })
        });

        gpNomBanco.getSelectionModel().on({
            rowselect: function () {
                //stnom_sucursal.baseParams.idbanco = sm.getSelected().data.idbanco; 
                stnom_sucursal.load({
                    params: {
                        idbanco: sm.getSelected().data.idbanco,
                        start: 0,
                        limit: 10
                    }
                });
                if (gpNomBanco.getSelectionModel().getCount() <= 0) {
                    botonModificar.disable();
                    botonEliminar.disable();
                } else if (gpNomBanco.getSelectionModel().getCount() > 1) {
                    botonModificar.disable();
                    botonEliminar.enable();
                    gridSucursales.hide();
                    p.collapse();
                }
                else {
                    botonModificar.enable();
                    botonEliminar.enable();
                    gridSucursales.show();
                }
            },
            rowdeselect: function () {
                if (gpNomBanco.getSelectionModel().getCount() <= 0) {
                    botonModificar.disable();
                    botonEliminar.disable();
                } else if (gpNomBanco.getSelectionModel().getCount() > 1) {
                    botonModificar.disable();
                    botonEliminar.enable();
                    gridSucursales.hide();
                    p.collapse();
                }
                else {
                    botonModificar.enable();
                    botonEliminar.enable();
                    gridSucursales.show();
                }
            }
        });

        function limpiarEspacios(s) {
            s = s.replace(/\s+/gi, ' '); //sacar espacios repetidos dejando solo uno
            s = s.replace(/^\s+|\s+$/gi, ''); //sacar espacios blanco principio y final

            return s;
        }

        var gridSucursales = new Ext.grid.GridPanel({
            iconCls: 'icon-grid',
            region: 'center',
            stripeRows: true,
            viewConfig: {forceFit: true},
            loadMask: true,
            autoExpandColumn: 'expandir',
            store: stnom_sucursal,
            sm: sm1,
            height: Ext.lib.Dom.getViewHeight() * 1 / 2,
            columns: [{
                dataIndex: 'idsucursal',
                hidden: true,
                width: 0
            }, {
                header: etiquetas.lbNumero,
                dataIndex: 'numero',
                width: 150,
                sortable: true
            }, {
                header: etiquetas.lbDireccion,
                width: 450,
                id: 'expandir',
                dataIndex: 'direccion',
                sortable: true
            }, {
                dataIndex: 'idbanco',
                hidden: true,
                width: 0
            }, {
                header: etiquetas.lbmetodo,
                width: 250,
                dataIndex: 'metodo',
                sortable: true,
                renderer: function (v) {
                    if (v == 0)
                        return etiquetas.lbcheque;
                    if (v == 1)
                        return etiquetas.lbchequen;
                }
            }],
            tbar: [
                sfSucursales = new Ext.Cont.SearchField({
                    id: 'sfSucursales',
                    width: 250,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,]+ ?[a-zA-Z0-9\s]*)+$/,
                    emptyText: etiquetas.lbCriterioBuscar,
                    clearTooltip: etiquetas.lbclearTooltipSucursales,
                    searchTooltip: etiquetas.lbsearchTooltipSucursales,
                    fnOnSearch: function () {
                        bandera = true;
                        buscarSucursales();

                    },
                    fnOnClear: function () {
                        bandera = false;
                        limpiarSucursales();
                    }
                })],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 10,
                store: stnom_sucursal,
                displayInfo: true,
                displayMsg: etiquetas.lbDisplayMsg,
                emptyMsg: etiquetas.lbEmptyMsg,
                prevText: etiquetas.beforePageText,
                nextText: etiquetas.afterPageText,
                firstText: etiquetas.firstPageText,
                lastText: etiquetas.lastPageText
            })
        });
        sm1.on({
            rowselect: function (selectionModel, rowIndex, record) {
                if (selectionModel.getSelections().length <= 0) {
                    botModi.disable();
                    botElim.disable();
                } else if (selectionModel.getSelections().length == 1) {
                    botModi.enable();
                    botElim.enable();
                } else {
                    botModi.disable();
                    botElim.enable();
                }
                botAdd.enable();
            },
            rowdeselect: function (selectionModel, rowIndex, record) {
                if (selectionModel.getSelections().length <= 0) {
                    botModi.disable();
                    botElim.disable();
                } else if (selectionModel.getSelections().length == 1) {
                    botModi.enable();
                    botElim.enable();
                } else {
                    botModi.disable();
                    botElim.enable();
                }
                botAdd.enable();
            }
        });

        var p = new Ext.Panel({
            region: 'south',
            collapsed: true,
            collapsible: true,
            layout: 'fit',
            height: Ext.lib.Dom.getViewHeight() * 1 / 2,
            title: etiquetas.panelmsgSuc,
            items: [gridSucursales],
            frame: true,
            split: true,
            tbar: [botAdd = new Ext.Button({
                id: 'btnAddSucursal',
                iconCls: 'adicionar',
                disabled: true,
                hidden: true,
                tooltip: etiquetas.tooltipADDSucursal,
                text: etiquetas.lbAdicionar,
                handler: function () {
                    botModi.disable();
                    botElim.disable();
                    isOpenW = true;
                    winFpRegNomSucursales('Ins');
                }
            }), botModi = new Ext.Button({
                id: 'btnModSucursal',
                disabled: true,
                hidden: true,
                iconCls: 'modificar',
                tooltip: etiquetas.tooltipModifSucursal,
                text: etiquetas.lbModificar,
                handler: function () {
                    botAdd.disable();
                    botElim.disable();
                    isOpenW = true;
                    winFpRegNomSucursales('Mod');
                }
            }), botElim = new Ext.Button({
                id: 'btnDelSucursal',
                disabled: true,
                hidden: true,
                iconCls: 'eliminar',
                tooltip: etiquetas.tooltipElimSucursal,
                text: etiquetas.lbEliminar,
                handler: function () {
                    botAdd.disable();
                    botModi.disable();
                    isOpenW = true;
                    eliminarNomSucursales();
                }
            })]
        });

        function fObtenerDatosImprimirReporte() {
            var ms = Ext.MessageBox.show({
                title: 'Por favor espere...',
                msg: etiquetas.lbCargando,
                width: 300,
                progress: true,
                closable: false
            });
            //loadMessageBox(etiquetas.lbCargando);
            Ext.Ajax.request({
                url: 'obtenerDatosImprimirReporte',
                method: 'POST',
                callback: function (options, success, response) {
                    ms.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.datoCuerpo.length > 0)
                        fOpenWindowReport(responseData);
                    else
                        mostrarMensaje(1, etiquetas.msgNoDatosReporte);
                }
            });
        }

        function fOpenWindowReport(requestDataSources) {
            printView = new SCFPrintView(requestDataSources, "/configuracion/reportes/", {
                paperSize: "FOLIO",
                orientation: "Horizontal",
                reportType: "HTML"
            });
            printView.show();
        }

        var vp = new Ext.Viewport({
            layout: 'fit',
            items: new Ext.Panel({
                title: etiquetas.lbTitWinGestMM,
                layout: 'border',
                listeners: {
                    render: function () {
                        btnAddBanco.focus();
                    }
                },
                frame: true,
                floating: false,
                items: [gpNomBanco, p],
                tbar: [
                    btnAddBanco = new Ext.Button({
                        id: 'btnAddBanco',
                        iconCls: 'adicionar',
                        hidden: true,
                        tooltip: etiquetas.tooltipWinInsEst,
                        text: etiquetas.lbAdicionar,
                        handler: function () {
                            Ext.getCmp('btnModBanco').disable();
                            Ext.getCmp('btnDelBanco').disable();
                            winFpRegNomBanco('Ins');
                        }
                    }),
                    botonModificar = new Ext.Button({
                        id: 'btnModBanco',
                        hidden: true,
                        iconCls: 'modificar',
                        tooltip: etiquetas.tooltipWinModEst,
                        text: etiquetas.lbModificar,
                        handler: function () {
                            Ext.getCmp('btnAddBanco').disable();
                            Ext.getCmp('btnDelBanco').disable();
                            winFpRegNomBanco('Mod');
                        }
                    }), botonEliminar = new Ext.Button({
                            id: 'btnDelBanco',
                            iconCls: 'eliminar',
                            hidden: true,
                            tooltip: etiquetas.tooltipElimBanco,
                            text: etiquetas.lbEliminar,
                            handler: function () {
                                Ext.getCmp('btnAddBanco').disable();
                                Ext.getCmp('btnModBanco').disable();
                                isOpenW = true;
                                eliminarNomBanco();
                            }
                        }
                    ), btnVistaPrevia = new Ext.Button({
                        id: 'btnVistaReporteBancoSucursal',
                        iconCls: 'vistareporte',
                        hidden: true,
                        tooltip: etiquetas.tooltipVistaReporte,
                        text: etiquetas.lbVistaReporte,
                        handler: function () {
                            fObtenerDatosImprimirReporte();
                        }
                    }), '->',
                    btnAyuda = new Ext.Button({
                        id: 'btnAyudaBanco',
                        iconCls: 'ayuda',
                        text: etiquetas.lbBtnAyuda,
                        tooltip: etiquetas.lbTooltipAyuda
                        /*handler: function() {//alert('ddv');
                         help.show(etiquetas.lbTitAyuda, 'CG/gestionar_bancoss');
                         }*/
                    })
                ]
            })
        });

        var kmTeclasCalientes = new Ext.KeyMap(Ext.getBody(), [
            {
                key: 'i',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('btnAddBanco').isVisible() && !Ext.getCmp('btnAddBanco').disabled && isOpenW == false)
                        Ext.getCmp('btnAddBanco').handler.call();
                }
            }, {
                key: 'm',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('btnModBanco').isVisible() && !Ext.getCmp('btnModBanco').disabled && isOpenW == false)
                        Ext.getCmp('btnModBanco').handler.call();
                }
            }, {
                key: 'r',
                alt: true,
                fn: function () {
                    if (Ext.getCmp('btnVistaReporteBancoSucursal').isVisible() && !Ext.getCmp('btnVistaReporteBancoSucursal').disabled && isOpenW == false)
                        Ext.getCmp('btnVistaReporteBancoSucursal').handler.call();
                }
            }, {
                key: Ext.EventObject.DELETE,
                fn: function () {
                    if (Ext.getCmp('btnDelBanco').isVisible() && Ext.EventObject.ctrlKey != 1 && !Ext.getCmp('btnDelBanco').disabled && isOpenW == false)
                        Ext.getCmp('btnDelBanco').handler.call();
                }
            }, {
                key: 'b',
                ctrl: true,
                fn: function () {
                    if (Ext.getCmp('sfSucursales').getRawValue().length > 0) {
                        Ext.getCmp('sfSucursales').onTrigger2Click();
                    } else {
                        Ext.getCmp('sfSucursales').focus();
                    }
                }
            }, {
                key: 'l',
                ctrl: true,
                fn: function () {
                    if (Ext.getCmp('sfSucursales').getRawValue().length > 0) {
                        Ext.EventObject.stopEvent();
                        Ext.getCmp('sfSucursales').onTrigger1Click();
                    }
                }
            }/*
             , {
             key: 'h',
             alt: true,
             fn: function() {
             help.show(etiquetas.lbTitAyuda, 'CG/gestionar_bancoss');
             }
             }*/, {
                key: 'i',
                ctrl: true,
                fn: function () {
                    if (botAdd.isVisible() && !botAdd.disabled && isOpenW == false)
                        botAdd.handler.call();
                }
            }, {
                key: 'm',
                ctrl: true,
                fn: function () {
                    if (botModi.isVisible() && !botModi.disabled && isOpenW == false)
                        botModi.handler.call();

                }
            }, {
                key: Ext.EventObject.DELETE,
                ctrl: true,
                fn: function () {
                    if (botElim.isVisible() && Ext.EventObject.ctrlKey == 1 && !botElim.disabled && isOpenW == false)
                        botElim.handler.call();
                }
            }
        ]);

        fpRegNomBanco = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 0',
            layout: 'form',
            items: [{
                xtype: 'panel',
                layout: 'column',
                items: [{
                    columnWidth: 0.5,
                    layout: 'form',
                    items: tfcodigo
                }, {
                    columnWidth: 0.5,
                    layout: 'form',
                    style: 'margin:0 0 0 5',
                    items: tfabreviatura
                }
                ]
            },
                tfnombre]
        });

        Seleccionar = new Ext.grid.CheckboxSelectionModel;

        dataMetodo = [['0', etiquetas.Cheque_c], ['1', etiquetas.Cheque_n_c], ['-1', etiquetas.ninguno]];

        store = new Ext.data.SimpleStore({
            sortInfo: ({
                field: 'nombre',
                direction: 'ASC'
            }),
            fields: [
                {
                    name: 'metodo'
                },
                {
                    name: 'nombre'
                }
            ]
        });

        cmbmetodo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            id: 'cmbmetodo',
            store: store,
            editable: true,
            fieldLabel: etiquetas.lbmetodo,
            displayField: 'nombre',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            hiddenName: 'metodo',
            valueField: 'metodo',
            mode: 'local',
            triggerAction: 'all',
            forceSelection: true,
            allowBlank: false,
            emptyText: etiquetas.emptyText,
            selectOnFocus: true,
            resizable: true,
            typeAhead: true,
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    activarBotonesWinSucursal();
                },
                select: function () {
                    activarBotonesWinSucursal();
                }
            }
        });
        store.loadData(dataMetodo);

        fpRegNomSucursales = new Ext.FormPanel({
            labelAlign: 'top',
            width: 400,
            height: 360,
            frame: true,
            border: false,
            bodyStyle: 'padding:5px 5px 0',
            layout: 'form',
            items: [{
                xtype: 'textfield',
                name: 'numero',
                id: 'numero',
                blankText: etiquetas.bTextCampReq,
                allowBlank: false,
                //maskRe: /^[0-9]+$/,
                //regex: /^[0-9]+$/,
                //regexText: etiquetas.regexTextValCodSuc,
                vtype: 'vtAlfanumerico',
                maxLength: 15,
                enableKeyEvents: true,
                maxLengthText: etiquetas.lbMaxLengthText,
                fieldLabel: etiquetas.lbNumero,
                width: '100%',
                listeners: {
                    keyup: function () {
                        activarBotonesWinSucursal();
                    }
                }
            },
                {
                    xtype: 'textarea',
                    name: 'direccion',
                    id: 'direccion',
                    blankText: etiquetas.bTextCampReq,
                    maxLength: 255,
                    enableKeyEvents: true,
                    maxLengthText: etiquetas.lbMaxLengthText,
                    allowBlank: false,
                    regex: /^([0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\%]+ ?[a-zA-Z\s]*)+$/,
                    maskRe: /^([0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \"\-\_\/\(\)\.\#\+\,\%]+ ?[a-zA-Z\s]*)+$/,
                    regexText: etiquetas.regexTexValLN,
                    fieldLabel: etiquetas.lbDireccion,
                    width: '100%',
                    height: 50,
                    listeners: {
                        keyup: function () {
                            activarBotonesWinSucursal();
                        }
                    }
                }, cmbmetodo]


        });

        function activarBotonesWinSucursal() {
            if (fpRegNomSucursales.getForm().isValid()) {
                if (isOpenWISucursal) {
                    Ext.getCmp('idbtnAceptarAddS').enable();
                    Ext.getCmp('btnAplISucursal').enable();
                } else if (isOpenWMSucursal) {
                    if (sm1.getSelected().data.numero.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegNomSucursales.getForm().getValues().numero
                        || sm1.getSelected().data.direccion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegNomSucursales.getForm().getValues().direccion) {
                        Ext.getCmp('idbtnAceptarModS').enable();
                    } else if (sm1.getSelected().data.metodo == 10 && (fpRegNomSucursales.getForm().getValues().metodo == -1 || fpRegNomSucursales.getForm().getValues().metodo == "Ninguno")) {
                        Ext.getCmp('idbtnAceptarModS').disable();
                    } else if (sm1.getSelected().data.metodo != fpRegNomSucursales.getForm().getValues().metodo) {
                        Ext.getCmp('idbtnAceptarModS').enable();
                    } else {
                        Ext.getCmp('idbtnAceptarModS').disable();
                    }
                }
            } else {
                if (isOpenWISucursal) {
                    Ext.getCmp('idbtnAceptarAddS').disable();
                    Ext.getCmp('btnAplISucursal').disable();
                } else if (isOpenWMSucursal) {
                    Ext.getCmp('idbtnAceptarModS').disable();
                }
            }
        }

        function winFpRegNomBanco(opcion) {
            switch (opcion) {
                case 'Ins':
                    if (!winInsNCl) {
                        winInsNCl = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: etiquetas.lbTitWinInsEst,
                            width: 350,
                            constrain: true,
                            defaultButton: 'idbtnAddBanco',
                            firstElement: tfcodigo,
                            //height: 280,
                            listeners: {
                                hide: function () {
                                    Ext.getCmp('btnModBanco').enable();
                                    Ext.getCmp('btnDelBanco').enable();
                                    isOpenW = false;
                                    isOpenWIBanco = false;
                                    btnAddBanco.focus();
                                    Ext.getCmp('idbtnAddBanco').disable();
                                    Ext.getCmp('btnAplI').disable();
                                }
                            },
                            height: 200,
                            resizable: false,
                            buttons: [{
                                iconCls: 'cancelar',
                                text: etiquetas.lbBtnCancelar,
                                tooltip: etiquetas.lbBtnTooltipCancelar,
                                handler: function () {
                                    winInsNCl.hide();
                                }
                            }, {
                                iconCls: 'aplicar',
                                id: 'btnAplI',
                                disabled: true,
                                text: etiquetas.lbBtnAplicar,
                                tooltip: etiquetas.lbBtnTooltipAplicar,
                                handler: function () {
                                    adicionarNomBanco('apl');
                                }
                            }, {
                                iconCls: 'aceptar',
                                disabled: true,
                                id: 'idbtnAddBanco',
                                text: etiquetas.lbBtnAceptar,
                                tooltip: etiquetas.lbBtnTooltipAceptar,
                                handler: function () {
                                    adicionarNomBanco();
                                }
                            }],
                            keys: ({
                                key: Ext.EventObject.ENTER,
                                handler: function () {
                                    adicionarNomBanco();
                                }
                            })
                        });
                    }
                    fpRegNomBanco.getForm().reset();
                    winInsNCl.show();
                    isOpenW = true;
                    isOpenWIBanco = true;
                    winInsNCl.add(fpRegNomBanco);
                    winInsNCl.doLayout();

                    break;
                case 'Mod':
                    if (!sm.getSelected())
                        mostrarMensaje(1, etiquetas.lbmsgMod);
                    if (sm.getSelections().length > 1)
                        mostrarMensaje(1, etiquetas.lbDebeSUDMM);
                    else {
                        if (!winModNCl) {
                            winModNCl = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                constrain: true,
                                title: etiquetas.lbTitWinModEst,
                                width: 350,
                                listeners: {
                                    hide: function () {
                                        Ext.getCmp('btnAddBanco').enable();
                                        Ext.getCmp('btnDelBanco').enable();
                                        isOpenW = false;
                                        isOpenWMBanco = false;
                                        btnAddBanco.focus();
                                        Ext.getCmp('idbtnAceptarMod').disable();
                                    }, render: function () {
                                        winModNCl.focus();
                                    }
                                },
                                //height: 280,
                                height: 200,
                                resizable: false,
                                defaultButton: 'idbtnCancelarMod',
                                firstElement: tfcodigo,
                                buttons: [{
                                    tooltip: etiquetas.lbBtnTooltipCancelar,
                                    iconCls: 'cancelar',
                                    text: etiquetas.lbBtnCancelar,
                                    id: 'idbtnCancelarMod',
                                    handler: function () {
                                        winModNCl.hide();
                                    }
                                }, {
                                    tooltip: etiquetas.lbBtnTooltipAceptar,
                                    iconCls: 'aceptar',
                                    disabled: true,
                                    id: 'idbtnAceptarMod',
                                    text: etiquetas.lbBtnAceptar,
                                    handler: function () {
                                        fpRegNomBanco.getForm().setValues({
                                            nombre: fpRegNomBanco.getForm().getValues().nombre.trim(),
                                            codigo: fpRegNomBanco.getForm().getValues().codigo.trim(),
                                            abreviatura: fpRegNomBanco.getForm().getValues().abreviatura.trim()
                                        });
                                        if (sm.getSelected().data.nombre != fpRegNomBanco.getForm().getValues().nombre
                                            || sm.getSelected().data.codigo != fpRegNomBanco.getForm().getValues().codigo
                                            || sm.getSelected().data.abreviatura != fpRegNomBanco.getForm().getValues().abreviatura) {
                                            modificarNomBanco();
                                        } else {
                                            Ext.getCmp('idbtnAceptarMod').disable();
                                            mostrarMensaje(1, etiquetas.msgNewok);
                                        }
                                    }
                                }],
                                keys: ({
                                    key: Ext.EventObject.ENTER,
                                    handler: function () {
                                        modificarNomBanco();
                                    }
                                })
                            });
                        }
                        winModNCl.show();
                        isOpenW = true;
                        isOpenWMBanco = true;
                        winModNCl.add(fpRegNomBanco);
                        winModNCl.doLayout();
                        fpRegNomBanco.getForm().loadRecord(sm.getSelected());
                        fpRegNomBanco.getForm().setValues({
                            'codigo': sm.getSelected().data.codigo.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                            'abreviatura': sm.getSelected().data.abreviatura.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                            'nombre': sm.getSelected().data.nombre.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                        });
                        if (sm.getSelected().data.metodo == 10)
                            cmbmetodo.reset();
                    }

                    break;
            }
        }

        function winFpRegNomSucursales(opcion) {
            switch (opcion) {
                case 'Ins':
                    if (!winInsNClA) {
                        winInsNClA = new Ext.Window({
                            modal: true,
                            closeAction: 'hide',
                            constrain: true,
                            layout: 'fit',
                            title: etiquetas.lbTitWinADDSucursal,
                            width: 400,
                            height: 280,
                            defaultButton: 'idbtnAceptarAddS',
                            firstElement: Ext.getCmp('numero'),
                            listeners: {
                                hide: function () {
                                    botModi.enable();
                                    botElim.enable();
                                    isOpenW = false;
                                    isOpenWISucursal = false;
                                    botAdd.focus();
                                    Ext.getCmp('idbtnAceptarAddS').disable();
                                    Ext.getCmp('btnAplISucursal').disable();
                                }, render: function () {
                                    winInsNClA.focus();
                                }
                            },
                            resizable: false,
                            buttons: [{
                                tooltip: etiquetas.lbBtnTooltipCancelar,
                                iconCls: 'cancelar',
                                text: etiquetas.lbBtnCancelar,
                                handler: function () {
                                    winInsNClA.hide();
                                }
                            },
                                {
                                    tooltip: etiquetas.lbBtnTooltipAplicar,
                                    iconCls: 'aplicar',
                                    id: 'btnAplISucursal',
                                    disabled: true,
                                    text: etiquetas.lbBtnAplicar,
                                    handler: function () {
                                        adicionarNomSucursales('apl');
                                    }
                                },
                                {
                                    id: 'idbtnAceptarAddS',
                                    tooltip: etiquetas.lbBtnTooltipAceptar,
                                    iconCls: 'aceptar',
                                    disabled: true,
                                    text: etiquetas.lbBtnAceptar,
                                    handler: function () {
                                        adicionarNomSucursales();
                                    }
                                }],
                            keys: ({
                                key: Ext.EventObject.ENTER,
                                handler: function () {
                                    adicionarNomSucursales();
                                }
                            })
                        });
                    }
                    fpRegNomSucursales.getForm().reset();
                    winInsNClA.show();
                    isOpenW = true;
                    isOpenWISucursal = true;
                    winInsNClA.add(fpRegNomSucursales);
                    winInsNClA.doLayout();
                    break;
                case 'Mod':
                    if (!sm1.getSelected())
                        mostrarMensaje(1, etiquetas.lbmsgMod);
                    if (sm1.getSelections().length > 1)
                        mostrarMensaje(1, etiquetas.lbDebeSUDMS);
                    else {
                        if (!winModNClA) {
                            winModNClA = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                constrain: true,
                                layout: 'fit',
                                defaultButton: 'idbtnCancelarModS',
                                firstElement: Ext.getCmp('numero'),
                                listeners: {
                                    hide: function () {
                                        botAdd.enable();
                                        botElim.enable();
                                        isOpenW = false;
                                        isOpenWMSucursal = false;
                                        botAdd.focus();
                                        Ext.getCmp('idbtnAceptarModS').disable();
                                    }, render: function () {
                                        winModNClA.focus();
                                    }
                                },
                                title: etiquetas.lbTitWinModifSucursal,
                                width: 400,
                                height: 280,
                                resizable: false,
                                buttons: [{
                                    tooltip: etiquetas.lbBtnTooltipCancelar,
                                    iconCls: 'cancelar',
                                    id: 'idbtnCancelarModS',
                                    text: etiquetas.lbBtnCancelar,
                                    handler: function () {
                                        winModNClA.hide();
                                    }
                                },
                                    {
                                        tooltip: etiquetas.lbBtnTooltipAceptar,
                                        iconCls: 'aceptar',
                                        id: 'idbtnAceptarModS',
                                        disabled: true,
                                        text: etiquetas.lbBtnAceptar,
                                        handler: function () {
                                            fpRegNomSucursales.getForm().setValues({
                                                numero: fpRegNomSucursales.getForm().getValues().numero.trim(),
                                                direccion: Ext.getCmp('direccion').getValue().trim(),
                                                metodo: fpRegNomSucursales.getForm().getValues().metodo.trim()
                                            });
                                            if (sm1.getSelected().data.numero != fpRegNomSucursales.getForm().getValues().numero
                                                || sm1.getSelected().data.direccion != fpRegNomSucursales.getForm().getValues().direccion
                                                || sm1.getSelected().data.metodo != fpRegNomSucursales.getForm().getValues().metodo) {
                                                modificarNomSucursales();
                                            } else {
                                                Ext.getCmp('idbtnAceptarModS').disable();
                                                mostrarMensaje(1, etiquetas.msgNewokS);
                                            }

                                        }
                                    }],
                                keys: ({
                                    key: Ext.EventObject.ENTER,
                                    handler: function () {
                                        modificarNomSucursales();
                                    }
                                })
                            });
                        }
                        winModNClA.show();
                        isOpenW = true;
                        isOpenWMSucursal = true;
                        winModNClA.add(fpRegNomSucursales);
                        winModNClA.doLayout();
                        fpRegNomSucursales.getForm().loadRecord(sm1.getSelected());
                        fpRegNomSucursales.getForm().setValues({
                            'numero': sm1.getSelected().data.numero.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                            'direccion': sm1.getSelected().data.direccion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                        });
                        if (sm1.getSelected().data.metodo == 10) {
                            cmbmetodo.reset();
                            cmbmetodo.setValue(etiquetas.ninguno);
                        }
                    }
                    break;
            }
        }

        function buscarNomBanco() {
            bandera = true;
            stnom_banco.baseParams.sfFiltro = sfBancos.getRawValue();
            stnom_banco.load();
        }

        function limpiarNomBanco() {
            bandera = false;
            stnom_banco.baseParams = {
                start: 0,
                limit: 20
            };
            stnom_banco.load();
        }

        function buscarSucursales() {
            bandera = true;
//            stnom_sucursal.baseParams.sfFiltro = sfSucursales.getRawValue();
//            stnom_sucursal.load();
            stnom_sucursal.load({
                params: {
                    idbanco: sm.getSelected().data.idbanco,
                    sfFiltro: sfSucursales.getRawValue(),
                    start: '',
                    limit: ''
                },
                callback: function () {
                    if (stnom_sucursal.getCount() === 0)
                        mostrarMensaje(1, etiquetas.lbNoResultados);
                }
            });
        }

        function limpiarSucursales() {
            bandera = false;
            stnom_sucursal.baseParams = {
                start: 0,
                limit: 20
            };
            stnom_sucursal.load();
        }

        function eliminarNomBanco() {
            if (!sm.getSelected())
                mostrarMensaje(1, etiquetas.lbMsgSelFila);
            else {
                if (sm.getSelections().length > 1)
                    mostrarMensaje(2, etiquetas.lbMsgElimBs, elimina);
                else
                    mostrarMensaje(2, etiquetas.lbMsgElimB, elimina);
            }
        }

        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                if (sm.getSelections().length > 1) {
                    Ext.Msg.wait(etiquetas.waitMsgElimBancos, etiquetas.waitPlease);
                }
                else {
                    Ext.Msg.wait(etiquetas.waitMsgElimBanco, etiquetas.waitPlease);
                }
                //                var id = "";
                var id = new Array();
                var cant = sm.getSelections().length;
                for (var i = 0; i < cant; i++)
                    id.push(sm.getSelections()[i].get('idbanco'));
                Ext.Ajax.request({
                    url: 'eliminar',
                    method: 'POST',
                    params: {
                        idbanco: Ext.encode(id)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        Ext.Msg.hide();
                        var mensaje = '';
                        if (responseData.nombreBancoEli.length > 0) {
                            var banEli = new Array();
                            for (var j = 0; j < responseData.nombreBancoEli.length; j++)
                                banEli[j] = ' ' + responseData.nombreBancoEli[j];
                            if (banEli.length > 1)
                                mensaje += etiquetas.lbMsgLosBancos + etiquetas.lbMsgElims + '</br>';
                            else
                                mensaje += etiquetas.lbMsgElBanco + etiquetas.lbMsgElim + '</br>';
                        }
                        if (responseData.nombreBancoNoEli.length > 0) {
                            var banNoEli = new Array();
                            for (var j = 0; j < responseData.nombreBancoNoEli.length; j++)
                                banNoEli[j] = ' ' + responseData.nombreBancoNoEli[j];
                            if (banNoEli.length > 1)

                                mensaje += etiquetas.lbMsgElimErrors;
                            else
                                mensaje += etiquetas.lbMsgElimError;
                        }
                        mostrarMensaje(1, mensaje);
                        stnom_banco.reload();
                    }
                });
            }
            Ext.getCmp('btnAddBanco').enable();
            Ext.getCmp('btnModBanco').enable();
            isOpenW = false;
            btnAddBanco.focus();

        }

        function adicionarNomBanco(apl) {
            if (fpRegNomBanco.getForm().isValid()) {
                fpRegNomBanco.getForm().setValues({
                    nombre: fpRegNomBanco.getForm().getValues().nombre.trim(),
                    codigo: fpRegNomBanco.getForm().getValues().codigo.trim(),
                    abreviatura: fpRegNomBanco.getForm().getValues().abreviatura.trim()
                });
                if (fpRegNomBanco.getForm().getValues().nombre != '') {
                    fpRegNomBanco.getForm().submit({
                        url: 'insertar',
                        waitMsg: etiquetas.lbWaitMsgRegEst,
                        failure: function (form, action) {
                            /*mostrarMensaje(action.result.codMsg, action.result.mensaje);
                             if (action.result.codMsg != 3) {
                             fpRegNomBanco.getForm().reset();
                             if (!apl)
                             winInsNCl.hide();
                             stnom_banco.reload();
                             }*/
                            if (action.result.codMsg == -1) {
                                mostrarMensaje(1, etiquetas.lbMsgAddOk);
                                fpRegNomBanco.getForm().reset();
                                if (!apl)
                                    winInsNCl.hide();
                                stnom_banco.reload();
                            } else if (action.result.codMsg == -2) {
                                mostrarMensaje(1, etiquetas.lbMsgExiste);//este banco  ya existe , ya existe un banco  con estas caracteristicas
                            } else if (action.result.codMsg == -3) {
                                mostrarMensaje(1, etiquetas.lbMsgExisteAbr);//Ya existe la abreviatura que se desea insertar
                            } else if (action.result.codMsg == -4) {
                                mostrarMensaje(1, etiquetas.lbMsgExisteAbrVsBanco);//La abreviatura que se desea insertar coincide con el nombre de un banco
                            } else {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        }
                    });
                } else {
                    Ext.getCmp('idbtnAddBanco').disable();
                    Ext.getCmp('btnAplI').disable();
                }
            }
            else {
                mostrarMensaje(1, etiquetas.msgNewVerificacion);
            }
        }

        function modificarNomBanco() {
            if (fpRegNomBanco.getForm().isValid()) {
                var no = Ext.getCmp('nombre').getValue();
                var co = Ext.getCmp('codigo').getValue();
                //var me = Ext.getCmp('cmbmetodo').getValue();
                var ab = Ext.getCmp('abreviatura').getValue();

                if ((co != sm.getSelected().data.codigo) || (no != sm.getSelected().data.nombre) /*|| (me != sm.getSelected().data.metodo)*/ || (ab != sm.getSelected().data.abreviatura)) {
                    fpRegNomBanco.getForm().setValues({
                        nombre: fpRegNomBanco.getForm().getValues().nombre.trim(),
                        codigo: fpRegNomBanco.getForm().getValues().codigo.trim(),
                        abreviatura: fpRegNomBanco.getForm().getValues().abreviatura.trim()
                    });
                    if (Ext.getCmp('nombre').getValue() != '') {
                        fpRegNomBanco.getForm().submit({
                            url: 'modificar',
                            params: {
                                idbanco: sm.getSelected().data.idbanco,
                                nombre1: Ext.encode(no)
                            },
                            waitMsg: etiquetas.waitMsgModiBanco,
                            failure: function (form, action) {
                                /* mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                 if (action.result.codMsg != 3) {
                                 stnom_banco.reload();
                                 winModNCl.hide();
                                 }*/

                                if (action.result.codMsg == -1) {
                                    mostrarMensaje(1, etiquetas.lbMsgModOk);
                                    stnom_banco.reload();
                                    winModNCl.hide();
                                } else if (action.result.codMsg == -2) {
                                    mostrarMensaje(1, etiquetas.lbMsgModExiste);//este banco  ya existe , ya existe un banco  con estas caracteristicas
                                } else {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                }

                                elemsel = sm.getSelections()[0].get('idbanco');
                            }
                        });
                    } else {
                        Ext.getCmp('idbtnAceptarMod').disable();
                    }
                }
                else {
                    mostrarMensaje(1, etiquetas.msgNewok);
                }
            }
            else {
                mostrarMensaje(1, etiquetas.msgNewVerificacion);
                Ext.getCmp('idbtnAceptarMod').disable();
            }


        }

        function adicionarNomSucursales(apl) {
            if (fpRegNomSucursales.getForm().isValid()) {
                fpRegNomSucursales.getForm().setValues({
                    numero: fpRegNomSucursales.getForm().getValues().numero.trim(),
                    direccion: Ext.getCmp('direccion').getValue().trim(),
                    metodo: fpRegNomSucursales.getForm().getValues().metodo.trim()
                });
                if (Ext.getCmp('direccion').getValue() != '') {
                    fpRegNomSucursales.getForm().submit({
                        url: 'insertarsucursal',
                        params: {
                            idbanco: sm.getSelected().data.idbanco
                        },
                        waitMsg: etiquetas.waitMsgRegSucursal,
                        failure: function (form, action) {
                            //mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            if (action.result.codMsg != 3 && action.result.codMsg != 1) {
                                fpRegNomSucursales.getForm().reset();
                                if (!apl)
                                    winInsNClA.hide();
                                stnom_sucursal.reload();
                                mostrarMensaje(1, etiquetas.addSucursalOk);
                            } else {
                                mostrarMensaje(1, etiquetas.addSucursalEx);
                                Ext.getCmp('idbtnAceptarAddS').disable();
                                Ext.getCmp('btnAplISucursal').disable();
                            }
                        }
                    });
                } else {
                    Ext.getCmp('idbtnAceptarAddS').disable();
                    Ext.getCmp('btnAplISucursal').disable();
                }
            }
            else {
                mostrarMensaje(1, etiquetas.msgNewVerificacion);
            }
        }

        function modificarNomSucursales() {
            if (fpRegNomSucursales.getForm().isValid()) {
                var no = Ext.getCmp('numero').getValue();
                var me = Ext.getCmp('cmbmetodo').getValue();
                var dir = Ext.getCmp('direccion').getValue();
                if ((no != sm1.getSelected().data.numero) || (me != sm1.getSelected().data.metodo) || (dir != sm1.getSelected().data.direccion)) {
                    fpRegNomSucursales.getForm().setValues({
                        numero: fpRegNomSucursales.getForm().getValues().numero.trim(),
                        direccion: Ext.getCmp('direccion').getValue().trim(),
                        metodo: fpRegNomSucursales.getForm().getValues().metodo.trim()
                    });
                    if (Ext.getCmp('direccion').getValue() != '') {
                        fpRegNomSucursales.getForm().submit({
                            url: 'modificarsucursal',
                            params: {
                                idbanco: sm.getSelected().data.idbanco,
                                idsucursal: sm1.getSelected().data.idsucursal
                            },
                            waitMsg: etiquetas.waitMsgModiSucursal,
                            failure: function (form, action) {
                                mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                if (action.result.codMsg != 3 && action.result.codMsg != 1) {
                                    elemento = sm1.getSelected().data.idsucursal;
                                    stnom_sucursal.reload();
                                    winModNClA.hide();
                                }
                            }
                        });

                        botModi.disable();
                        botElim.disable();
                    } else {
                        Ext.getCmp('idbtnAceptarModS').disable();
                    }
                } else
                    mostrarMensaje(1, etiquetas.msgNewokS);
            } else {
                mostrarMensaje(1, etiquetas.msgNewVerificacion);
                Ext.getCmp('idbtnAceptarModS').disable();
            }
        }

        function eliminarNomSucursales() {
            if (!sm1.getSelected())
            /*aqui******/ mostrarMensaje(1, etiquetas.lbMsgSelFila);
            else {
                /*aqui******/
                if (sm1.getSelections().length > 1)
                    mostrarMensaje(2, etiquetas.lbMsgElimSs, elimina);
                else
                    mostrarMensaje(2, etiquetas.lbMsgElimS, elimina);
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.Msg.wait("Eliminando datos de la(s) sucursal(es)...", "Por favor espere...");
                    var idper = "";
                    var cant = sm1.getSelections().length;
                    for (var i = 0; i < cant; i++)
                        if (i < cant - 1)
                            idper += sm1.getSelections()[i].get('idsucursal') + ",";
                        else
                            idper += sm1.getSelections()[i].get('idsucursal');
                    Ext.Ajax.request({
                        url: 'eliminarsucursal',
                        method: 'POST',
                        params: {
                            idsucursal: idper
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            Ext.Msg.hide();
                            switch (responseData.codMsgg) {
                                case -4:
                                    mostrarMensaje(1, etiquetas.lbEsdeUso);
                                    break;
                                case -5:
                                    mostrarMensaje(1, etiquetas.lbMsgElimOkVariasSuc);
                                    break;

                                case -1:
                                    mostrarMensaje(1, etiquetas.lbMsgElimOkSuc);
                                    break;
                            }
                            //stnom_banco.reload();
                            elemsel = sm.getSelections()[0].get('idbanco');
                            modificar = true;
                            stnom_sucursal.load({
                                params: {
                                    idbanco: sm.getSelected().data.idbanco,
                                    start: 0,
                                    limit: 10
                                }
                            });

                        }
                    });
                    botModi.disable();
                    botElim.disable();
                }
                botAdd.enable();
                botModi.enable();
                isOpenW = false;
                botAdd.focus();

            }
        }

        function notifyEvent(animateTarget, title, msg, icon, time, callback) {
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
        }
    };
    /*scope.cargarAyuda = function() {
     var title = perfil.etiquetas.lbAyuda;
     var referencia = 'CG/Nom/gestionarBancos';
     help.show(title, referencia);

     };*/
}).defer(0, Ext.ConfGnral.NomGnral.BancoSucursal);
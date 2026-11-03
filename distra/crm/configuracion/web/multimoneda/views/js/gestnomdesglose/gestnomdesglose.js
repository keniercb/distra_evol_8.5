/* 
 * Gestionar Desglose de monedas.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP-Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.ConfGnral.Multimoneda
 * @copyright XETID.
 * @version 1.0-0
 */
Ext.namespace('Ext.ConfGnral.Multimoneda');
var perfil = window.parent.UCID.portal.perfil;
Ext.ConfGnral.Multimoneda.NomDesglose = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: 'undefined',
    constructor: function() {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        scopeNomDesglose = this;
        scopeNomDesglose.modificado = false;
        scopeNomDesglose.keys = 'undefined';
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'gestnomdesglose'
            },
            callback: function(options, success, response)
            {
                scopeNomDesglose.etiquetas = Ext.decode(response.responseText);
                scopeNomDesglose.onloadMessageBox(scopeNomDesglose.etiquetas.lbEsperando, scopeNomDesglose.etiquetas.lbCargando);
                if (!document.getElementById('StyleGrid')) {
                    scopeNomDesglose.loadCSS("/configuracion/comun/views/css/styles-grid", 'StyleGrid');
                }
                scopeNomDesglose.cargarInterfaz(scopeNomDesglose.perfil, scopeNomDesglose.etiquetas);
            }
        });
    },
    onloadMessageBox: function(agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
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
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    },
    cargarInterfaz: function(perfil, etiquetas) {
        actionValidate.validate();

        scopeNomDesglose.mapaTeclas = new Ext.KeyMap(Ext.getBody(), [
            {
                key: "i",
                alt: true,
                fn: function() {
                    if (scopeNomDesglose.btnAdicionar.isVisible() && !scopeNomDesglose.btnAdicionar.disabled) {
                        scopeNomDesglose.mapaTeclas.disable();
                        scopeNomDesglose.WinAddModNomMoneda('Ins');
                    }
                }
            },
            {
                key: "m",
                alt: true,
                fn: function() {
                    if (scopeNomDesglose.btnModificar.isVisible() && !scopeNomDesglose.btnModificar.disabled) {
                        scopeNomDesglose.mapaTeclas.disable();
                        scopeNomDesglose.WinAddModNomMoneda('Mod');
                    }
                }
            }, {
                key: 'b',
                alt: true,
                fn: function() {
                    if(Ext.getCmp('sfDesglose').getRawValue().length > 0){
                        Ext.getCmp('sfDesglose').onTrigger2Click();
                    }else{
                        Ext.getCmp('sfDesglose').focus();
                    }
                }
            }, {
                key: 'l',
                alt: true,
                fn: function() {
                    if(Ext.getCmp('sfDesglose').getRawValue().length > 0) {
                        Ext.EventObject.stopEvent();
                        Ext.getCmp('sfDesglose').onTrigger1Click();
                    }
                }
            },
            {
                key: Ext.EventObject.DELETE,
                fn: function() {
                    if (scopeNomDesglose.btnEliminar.isVisible() && !scopeNomDesglose.btnEliminar.disabled) {
                        scopeNomDesglose.winFpRegistrar('Del', false);
                    }
                }
            }/*,
            {
                key: "h",
                alt: true,
                fn: function() {
                    help.show(scopeNomDesglose.etiquetas.lbTtlAyuda, 'CG/multi-moneda/gestdesglose');
                }
            }*/
        ]);

        scopeNomDesglose.btnAdicionar = new Ext.Button({
            id: 'btnAdicionarDesglose',
            iconCls: 'adicionar',
            hidden: true,
            text: scopeNomDesglose.etiquetas.lbBtnAdicionar,
            tooltip: scopeNomDesglose.etiquetas.lbTtAdicionar,
            handler: function() {
                scopeNomDesglose.WinAddModNomMoneda('Ins');
            }
        });
        scopeNomDesglose.btnModificar = new Ext.Button({
            id: 'btnModificarDesglose',
            disabled: true,
            hidden: true,
            iconCls: 'modificar',
            text: scopeNomDesglose.etiquetas.lbBtnModificar,
            tooltip: scopeNomDesglose.etiquetas.lbTtModificar,
            handler: function() {
                scopeNomDesglose.WinAddModNomMoneda('Mod');
            }
        });
        scopeNomDesglose.btnEliminar = new Ext.Button({
            id: 'btnEliminarDesglose',
            disabled: true,
            hidden: true,
            iconCls: 'eliminar',
            text: scopeNomDesglose.etiquetas.lbBtnEliminar,
            tooltip: scopeNomDesglose.etiquetas.lbTtEliminar,
            handler: function() {
                scopeNomDesglose.winFpRegistrar('Del', false);
            }
        });
        scopeNomDesglose.btnAyuda = new Ext.Button({
            id: 'btnAyudaDesglose',
            iconCls: 'ayuda',
            text: scopeNomDesglose.etiquetas.lbBtnAyuda,
            tooltip: scopeNomDesglose.etiquetas.lbTtAyuda/*,
            handler: function( ) {
                help.show(scopeNomDesglose.etiquetas.lbTtlAyuda, 'CG/multi-moneda/gestdesglose');
            }*/
        });

        scopeNomDesglose.smNomDesglose = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(smodel, rowIndex, keepExisting, record) {
                    Ext.getCmp('idgpNomDesglose').getView().addRowClass(rowIndex, "negrita");
                    scopeNomDesglose.modificado = false;
                    switch (smodel.getSelections().length) {
                        case 0:
                            {
                                Ext.getCmp('btnAdicionarDesglose').enable();
                                Ext.getCmp('btnModificarDesglose').disable();
                                Ext.getCmp('btnEliminarDesglose').disable();
                            }
                            break;
                        case 1:
                            {
                                Ext.getCmp('btnModificarDesglose').enable();
                                Ext.getCmp('btnEliminarDesglose').enable();
                            }
                            break;
                        default :
                            {
                                Ext.getCmp('btnModificarDesglose').disable();
                                Ext.getCmp('btnEliminarDesglose').enable();
                            }
                            break;
                    }
                },
                rowdeselect: function(smodel, rowIndex, keepExisting, record) {
                    Ext.getCmp('idgpNomDesglose').getView().removeRowClass(rowIndex, "negrita");
                    switch (smodel.getSelections().length) {
                        case 0:
                            {
                                Ext.getCmp('btnAdicionarDesglose').enable();
                                Ext.getCmp('btnModificarDesglose').disable();
                                Ext.getCmp('btnEliminarDesglose').disable();
                            }
                            break;
                        case 1:
                            {
                                Ext.getCmp('btnModificarDesglose').enable();
                                Ext.getCmp('btnEliminarDesglose').enable();
                            }
                            break;
                        default :
                            {
                                Ext.getCmp('btnModificarDesglose').disable();
                                Ext.getCmp('btnEliminarDesglose').enable();
                            }
                            break;
                    }
                }
            }
        });
        scopeNomDesglose.stNomDesglose = new Ext.data.GroupingStore({
            url: '/configuracion/multimoneda/index.php/gestnomdesglose/getnomdesglose',
            autoLoad: true,
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'iddezglozemonedas'
            }, [{
                    name: 'iddezglozemonedas'
                }, {
                    name: 'idcategoria',
                    mapping: 'categoria'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'valor'
                }]),
            sortInfo: {
                field: 'valor',
                direction: "ASC"
            },
            groupField: 'idcategoria'
        });

        scopeNomDesglose.stNomDesglose.on({
            load: function(store, records, options) {
                Ext.MessageBox.hide();
                if (store.getCount() == 0) {
                    var message = (!Ext.isEmpty(scopeNomDesglose.stNomDesglose.baseParams.sfFiltro)) ? etiquetas.lbNoDataResults : etiquetas.lbNoResults;
                    mostrarMensaje(1, message);
                }else{
                    scopeNomDesglose.smNomDesglose.selectFirstRow();
                }
            }
        });

        scopeNomDesglose.gpNomDesglose = new Ext.grid.GridPanel({
            id: 'idgpNomDesglose',
            width: 690,
            height: 310,
            frame: false,
            border:false,
            floating: false,
            stripeRows: true,
            enableColumnHide: true,
            sm: scopeNomDesglose.smNomDesglose,
            store: scopeNomDesglose.stNomDesglose,
            autoExpandColumn: 'expandir',
            loadMask: {
                store: scopeNomDesglose.stNomDesglose,
                msg: scopeNomDesglose.etiquetas.lbCargando
            },
            viewConfig: {
                forceFit: true
            },
            view: new Ext.grid.GroupingView({
                startCollapsed: true,
                hideGroupedColumn: true,
                groupTextTpl: scopeNomDesglose.etiquetas.lbGroupTextTpl
            }),
            columns: [{
                    hidden: true,
                    dataIndex: 'iddezglozemonedas',
                    hideable: false
                }, {
                    header: scopeNomDesglose.etiquetas.lbCategoria,
                    width: 100,
                    dataIndex: 'idcategoria',
                    sortable: true,
                    renderer: scopeNomDesglose.fnNombrarCategoria
                }, {
                    header: scopeNomDesglose.etiquetas.lbValor,
                    width: 150,
                    dataIndex: 'valor',
                    sortable: true
                }, {
                    id: 'expandir',
                    header: scopeNomDesglose.etiquetas.lbDenominacion,
                    width: 300,
                    dataIndex: 'denominacion',
                    sortable: true
                }],
            tbar: [
                scopeNomDesglose.sfDesglose = new Ext.Cont.SearchField({
                    id: 'sfDesglose',
                    width: 250,
                    emptyText: scopeNomDesglose.etiquetas.lbCriterioBuscar,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.]*)+$/,
                    searchTooltip: scopeNomDesglose.etiquetas.lbsearchDesTooltip,
                    fnOnSearch: function() {
                        scopeNomDesglose.winFpRegistrar('Fnd', false);
                    },
                    fnOnClear: function() {
                        scopeNomDesglose.winFpRegistrar('Cls', false);
                    }
                })
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: scopeNomDesglose.etiquetas.lbDisplayMsg,
                emptyMsg: scopeNomDesglose.etiquetas.lbEmptyMsg,
                store: scopeNomDesglose.stNomDesglose,
                prevText: scopeNomDesglose.etiquetas.beforePageText,
                nextText: scopeNomDesglose.etiquetas.afterPageText,
                firstText: scopeNomDesglose.etiquetas.firstPageText,
                lastText: scopeNomDesglose.etiquetas.lastPageText
            })

        });
        scopeNomDesglose.pDesglose = new Ext.Panel({
            layout: 'fit',
            border: true,
            items: scopeNomDesglose.gpNomDesglose,
            tbar: [scopeNomDesglose.btnAdicionar, scopeNomDesglose.btnModificar, scopeNomDesglose.btnEliminar, '->', scopeNomDesglose.btnAyuda]
        });

        scopeNomDesglose.vpPrincipal = new Ext.Viewport({
            layout: 'fit',
            items: scopeNomDesglose.pDesglose
        });
    },
    WinAddModNomMoneda: function(opcion) {
        scopeNomDesglose.mapaTeclas.disable();
        var winVentAsig;
        scopeNomDesglose.cmbCategoria = new Ext.form.ComboBox({
            name: 'categoria',
            anchor: '100%',
            editable: true,
            typeAhead: true,
            allowBlank: false,
            forceSelection: true,
            enableKeyEvents: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: scopeNomDesglose.etiquetas.lbCategoria,
            emptyText: scopeNomDesglose.etiquetas.lbSeleccionar,
            blankText: scopeNomDesglose.etiquetas.lbBlankText,
            displayField: 'categoria',
            valueField: 'idcategoria',
            hiddenName: 'idcategoria',
            tpl: '<tpl for="."><div ext:qtip="{categoria}" class="x-combo-list-item">{categoria}</div></tpl>',
            store: scopeNomDesglose.stCategoria = new Ext.data.SimpleStore({
                fields: ['idcategoria', 'categoria'],
                data: [[1, scopeNomDesglose.etiquetas.lbMonedas], [2, scopeNomDesglose.etiquetas.lbBilletes]]
            }), listeners: {
                change: function() {
                    scopeNomDesglose.modificado = true;
                },
                keyup: function() {
                    scopeNomDesglose.comprobarVentana();
                },
                select: function() {
                    scopeNomDesglose.comprobarVentana();
                }
            }
        });
        scopeNomDesglose.valor = new Ext.form.TextField({
            name: 'valor',
            anchor: '100%',
            id: 'tfValor',
            maxLength: 10,
            allowNegative: false,
            regex: /^\d+([.]\d+)?$/,
            regexText:scopeNomDesglose.etiquetas.lbregexTextNR,
            allowBlank: false,
            fieldLabel: scopeNomDesglose.etiquetas.lbValor,
            blankText: scopeNomDesglose.etiquetas.lbBlankText,
            maxLengthText: scopeNomDesglose.etiquetas.msgMaxLengthNum,
            enableKeyEvents: true,
            listeners: {
                change: function() {
                    scopeNomDesglose.modificado = true;
                },
                    keyup: function() {
                    scopeNomDesglose.comprobarVentana();
                }
            }
        });
        scopeNomDesglose.denominacion = new Ext.form.TextField({
            anchor: '100%',
            width: 360,
            id: 'tfDenominacion',
            name: 'denominacion',
            maxLength: 30,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
            regexText: scopeNomDesglose.etiquetas.lbregexText,
            allowBlank: false,
            fieldLabel: scopeNomDesglose.etiquetas.lbDenominacion,
            blankText: scopeNomDesglose.etiquetas.lbBlankText,
            enableKeyEvents: true,
            listeners: {
                change: function() {
                    scopeNomDesglose.modificado = true;
                },
                        keyup: function() {
                    scopeNomDesglose.comprobarVentana();
                }
            }
        });
        scopeNomDesglose.fpDesglose = new Ext.FormPanel({
            id: 'fMoneda',
            labelAlign: 'top',
            frame: true,
            border: false,
            items: [scopeNomDesglose.cmbCategoria, scopeNomDesglose.valor, scopeNomDesglose.denominacion]
        });
        switch (opcion) {
            case 'Ins':
                if (!winVentAsig) {
                    winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winadd',
                        closeAction: 'close',
                        layout: 'fit',
                        title: scopeNomDesglose.etiquetas.lbTtlAdicionar,
                        constrain:true,
                        width: 290,
                        defaultButton: 'idWindCancelar',
                        firstElement: scopeNomDesglose.cmbCategoria,
                        height: 230,
                        resizable: false,
                        listeners: {
                            close: function() {
                                scopeNomDesglose.mapaTeclas.enable();
                            }
                        },
                        buttons: [{
                                iconCls: 'cancelar',
                                id:'idWindCancelar',
                                text: scopeNomDesglose.etiquetas.lbBtnCancelar,
                                tooltip: scopeNomDesglose.etiquetas.lbTtCancelar,
                                handler: function() {
                                    winVentAsig.close();
                                }
                            }, {
                                iconCls: 'aplicar',
                                id: 'idWindAplicar',
                                disabled: true,
                                text: scopeNomDesglose.etiquetas.lbBtnAplicar,
                                tooltip: scopeNomDesglose.etiquetas.lbTtAplicar,
                                handler: function() {
                                    scopeNomDesglose.denominacion.setValue(scopeNomDesglose.denominacion.getValue().trim());
                                    scopeNomDesglose.winFpRegistrar('Add', true);
                                }
                            }, {
                                iconCls: 'aceptar',
                                id: 'idWindAceptar',
                                disabled: true,
                                text: scopeNomDesglose.etiquetas.lbBtnAceptar,
                                tooltip: scopeNomDesglose.etiquetas.lbTtAceptar,
                                handler: function() {
                                    scopeNomDesglose.denominacion.setValue(scopeNomDesglose.denominacion.getValue().trim());
                                    scopeNomDesglose.winFpRegistrar('Add', false);
                                }}]
                    });
                }
                scopeNomDesglose.fpDesglose.getForm().reset();
                winVentAsig.add(scopeNomDesglose.fpDesglose);
                winVentAsig.show();
                winVentAsig.doLayout();
                break;
            case 'Mod':
                if (!winVentAsig) {
                    winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winmod',
                        closeAction: 'close',
                        constrain:true,
                        layout: 'fit',
                        listeners: {close: function() {
                                scopeNomDesglose.windowOp = false;
                                scopeNomDesglose.btnAdicionar.focus();
                                scopeNomDesglose.mapaTeclas.enable();
                            }, render: function() {
                                winVentAsig.focus();
                            }},
                        title: scopeNomDesglose.etiquetas.lbTtlModificar,
                        width: 290,
                        defaultButton: 'idWindModificar',
                        firstElement: scopeNomDesglose.cmbCategoria,
                        height: 230,
                        resizable: false,
                        buttons: [{
                                iconCls: 'cancelar',
                                text: scopeNomDesglose.etiquetas.lbBtnCancelar,
                                tooltip: scopeNomDesglose.etiquetas.lbTtCancelar,
                                handler: function() {
                                    winVentAsig.close();
                                }
                            }, {
                                iconCls: 'aceptar',
                                id: 'idWindModificar',
                                disabled: true,
                                text: scopeNomDesglose.etiquetas.lbBtnAceptar,
                                tooltip: scopeNomDesglose.etiquetas.lbTtAceptar,
                                handler: function() {
                                    scopeNomDesglose.denominacion.setValue(scopeNomDesglose.denominacion.getValue().trim());
                                    scopeNomDesglose.comprobarVentana();
                                    if (!Ext.getCmp('idWindModificar').disabled){
                                        scopeNomDesglose.winFpRegistrar('Mod', false);
                                    }
                                }}
                        ]
                    });
                }
                winVentAsig.add(scopeNomDesglose.fpDesglose);
                winVentAsig.show();
                winVentAsig.doLayout();
                scopeNomDesglose.fpDesglose.getForm().loadRecord(scopeNomDesglose.smNomDesglose.getSelected());
                scopeNomDesglose.fpDesglose.getForm().setValues({
                    'denominacion': scopeNomDesglose.smNomDesglose.getSelected().data.denominacion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                });
                break;
        }
    },
    fnNombrarCategoria: function(value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.idcategoria == ('1' || 1)) {
            return scopeNomDesglose.etiquetas.lbMonedas;
        } else {
            return scopeNomDesglose.etiquetas.lbBilletes;
        }
    },
    changevalue: function(){var changed = false;
        var newvalue = scopeNomDesglose.fpDesglose.getForm().getValues();
        var oldvalue = scopeNomDesglose.gpNomDesglose.getSelectionModel().getSelected().data;
       for (k in newvalue) {
            if (newvalue[k] != oldvalue[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')) {
               
                changed = true;
                break;
            }


        }
        return changed;
    },
    comprobarVentana: function() {
     
        if (scopeNomDesglose.fpDesglose.getForm().isValid()) {
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
                if (scopeNomDesglose.changevalue())
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
    },
    winFpRegistrar: function(opcion, apl) {
        switch (opcion) {
            case 'Add':
                {
                    if (scopeNomDesglose.fpDesglose.getForm().isValid()) {
                        scopeNomDesglose.fpDesglose.getForm().submit({
                            url: '/configuracion/multimoneda/index.php/gestnomdesglose/addnomdesglose',
                            waitMsg: scopeNomDesglose.etiquetas.lbWaitMsgReg,
                            failure: function(form, action) {
                                switch (action.result.codMsgg) {
                                    case -1 :
                                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgAdd);
                                        scopeNomDesglose.fpDesglose.getForm().reset();
                                        scopeNomDesglose.smNomDesglose.clearSelections();
                                        if (!apl)
                                            Ext.getCmp('winadd').close();
                                        scopeNomDesglose.stNomDesglose.reload();
                                        break;
                                    case -2 :
                                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgAddExisteValor);
                                        break;
                                    case -3 :
                                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgAddExisteDeno);
                                        break;
                                }
                            }
                        });
                    } else {
                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgCmpIncor);
                    }

                }
                break;
            case 'Mod':
                {
                    if (scopeNomDesglose.modificado) {
                        if (scopeNomDesglose.fpDesglose.getForm().isValid() && scopeNomDesglose.smNomDesglose.getSelections().length == 1) {
                            Ext.Ajax.request({
                                method: 'POST',
                                url: '/configuracion/multimoneda/index.php/gestnomdesglose/modnomdesglose',
                                params: {
                                    iddezglozemonedas: scopeNomDesglose.smNomDesglose.getSelected().data.iddezglozemonedas,
                                    idcategoria: scopeNomDesglose.cmbCategoria.getValue(),
                                    valor: scopeNomDesglose.valor.getValue(),
                                    denominacion: scopeNomDesglose.denominacion.getValue()
                                },
                                callback: function(options, success, response) {
                                    responseData = Ext.decode(response.responseText);
                                    switch (responseData.codMsgg) {
                                        case -1 :
                                            mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgMod);
                                            scopeNomDesglose.fpDesglose.getForm().reset();
                                            scopeNomDesglose.smNomDesglose.clearSelections();
                                            Ext.getCmp('winmod').close();
                                            scopeNomDesglose.stNomDesglose.reload();
                                            break;
                                        case -2 :
                                            mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgAddExisteValor);
                                            break;
                                        case -3 :
                                            mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgAddExisteDeno);
                                            break;
                                        default:
                                            mostrarMensaje(responseData.codMsgg, responseData.mensaje);
                                            scopeNomDesglose.fpNomDesglose.getForm().reset();
                                            scopeNomDesglose.smNomDesglose.clearSelections();
                                            scopeNomDesglose.stNomDesglose.reload();
                                            break;
                                    }
                                }
                            });
                        } else {
                            mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgCmpIncor);
                        }
                    }
                    else {
                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgNHSM);
                    }
                }
                break;
            case 'Del':
                {
                    if (scopeNomDesglose.smNomDesglose.getSelections().length > 0) {
                        var arrayDesgloses = scopeNomDesglose.smNomDesglose.getSelections();
                        var arrayIdDesgloses = [];
                        for (var i = 0; i < arrayDesgloses.length; i++) {
                            arrayIdDesgloses.push({
                                iddezglozemonedas: arrayDesgloses[i].data.iddezglozemonedas
                            });
                        }
                        function elimina(btnPresionado) {
                            scopeNomDesglose.mapaTeclas.enable();

                            if (btnPresionado == 'ok') {
                                Ext.Msg.wait("Eliminando datos del desglose de moneda(s)...", "Por favor espere...");
                                Ext.Ajax.request({
                                    method: 'POST',
                                    url: '/configuracion/multimoneda/index.php/gestnomdesglose/delnomdesglose',
                                    params: {
                                        iddezglozemonedas: Ext.encode(arrayIdDesgloses)
                                    },
                                    callback: function(options, success, response) {
                                        responseData = Ext.decode(response.responseText);
                                        Ext.Msg.hide();
                                        switch (responseData.codMsg) {
                                            case -1:
                                                mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgDel);
                                                scopeNomDesglose.smNomDesglose.clearSelections();
                                                scopeNomDesglose.stNomDesglose.reload();
                                                break;
                                            case -2:
                                                mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgDelPlural);
                                                scopeNomDesglose.smNomDesglose.clearSelections();
                                                scopeNomDesglose.stNomDesglose.reload();
                                                break;
                                            case -3:
                                                if (arrayIdDesgloses.length == 1)
                                                    mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgEsdeUso);
                                                else
                                                    mostrarMensaje(1, scopeNomDesglose.etiquetas.lbMsgNotDelPlural);
                                                scopeNomDesglose.smNomDesglose.clearSelections();
                                                scopeNomDesglose.stNomDesglose.reload();
                                                break;
                                            default:
                                                mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                                break;
                                        }
                                    }
                                });
                            }
                        }
                        if (arrayDesgloses.length > 1) {
                            scopeNomDesglose.mapaTeclas.disable();
                            mostrarMensaje(2, scopeNomDesglose.etiquetas.lbAskDelManyDesglose, elimina);
                        }
                        else {
                            scopeNomDesglose.mapaTeclas.disable();
                            mostrarMensaje(2, scopeNomDesglose.etiquetas.lbAskDelOneDesglose, elimina);
                        }
                    } else {
                        mostrarMensaje(1, scopeNomDesglose.etiquetas.lbSelElemDel);
                    }

                }
                break;
            case 'Fnd':
                {
                    fnBuscar();
                }
                break;
            case 'Cls':
                {
                    fnAceptarCambios('ok');
                }
                break;
        }

        function fnAceptarCambios(btnPress)
        {
            if (btnPress == "ok")
            {
                Ext.getCmp('btnAdicionarDesglose').enable();
                scopeNomDesglose.smNomDesglose.clearSelections();
                scopeNomDesglose.stNomDesglose.baseParams = {};
                scopeNomDesglose.stNomDesglose.reload();
            }
        }

        function fnBuscar() {
            scopeNomDesglose.stNomDesglose.baseParams.start = '';
            scopeNomDesglose.stNomDesglose.baseParams.limit = '';
            scopeNomDesglose.stNomDesglose.baseParams.sfFiltro = scopeNomDesglose.sfDesglose.getRawValue();
            scopeNomDesglose.stNomDesglose.load();
        }
    },
    loadCSS: function(cssSrc, id) {
        if (cssSrc != null) {
            var tagScriptCSS = document.createElement("script");
            tagScriptCSS.setAttribute("rel", "stylesheet");
            tagScriptCSS.setAttribute("type", "text/css");
            tagScriptCSS.setAttribute("id", id);
            tagScriptCSS.setAttribute("src", cssSrc + ".css");
            document.getElementsByTagName("body")[0].appendChild(tagScriptCSS);
        }
    }
});
new Ext.ConfGnral.Multimoneda.NomDesglose();
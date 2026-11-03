/* 
 * Gestionar documentos.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP-Cuba.
 * @subpackage Configuraci&oacute;n General.
 * @namespace Ext.ConfGnral.Documento
 * @copyright XETID.
 * @version 1.0-0
 */
Ext.namespace('Ext.ConfGnral.Documento');
var perfil = window.parent.UCID.portal.perfil;
Ext.ConfGnral.Documento.NomDocumento = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: 'undefined',
    constructor: function () {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        scopeNomDocumento = this;
        scopeNomDocumento.keys = 'undefined';
        scopeNomDocumento.action = 'adicionar';
        //variable usada para almacenar los valores originales del documento
        // que se este modificando en un documento determinado.
        scopeNomDocumento.documento = undefined;
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'nomdocumento'
            },
            callback: function (options, success, response) {
                scopeNomDocumento.etiquetas = Ext.decode(response.responseText);
                scopeNomDocumento.onloadMessageBox(scopeNomDocumento.etiquetas.lbEsperando, scopeNomDocumento.etiquetas.lbCargando);
                scopeNomDocumento.cargarInterfaz(scopeNomDocumento.perfil, scopeNomDocumento.etiquetas);

                //Keymap necesario para el trabajo con las teclas rápidas
                scopeNomDocumento.keyMap = new Ext.KeyMap(scopeNomDocumento.vpPrincipal.getEl(), [
                    {
                        key: "i",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var btn = scopeNomDocumento.btnAdicionar;
                            if(!btn.hidden){
                                scopeNomDocumento.WinAddModNomDocumento('Ins');
                            }
                        }
                    },
                    {
                        key: 'b',
                        alt: true,
                        fn: function() {
                            Ext.getCmp('sfDocumento').focus();
                            setTimeout(function(){
                                Ext.getCmp('sfDocumento').triggers[0].hide();
                            }, 100)

                        }
                    },
                    {
                        key: 'b',
                        alt: true,
                        fn: function() {
                            console.log('length:', Ext.getCmp('sfDocumento').getRawValue().length)
                            console.log('raw:', Ext.getCmp('sfDocumento').getRawValue())
                            if(Ext.getCmp('sfDocumento').getRawValue().length > 0){
                                Ext.getCmp('sfDocumento').onTrigger2Click();
                            }else{
                                Ext.getCmp('sfDocumento').focus();
                            }
                        }
                    }, {
                        key: 'l',
                        alt: true,
                        fn: function() {
                            if(Ext.getCmp('sfDocumento').getRawValue().length > 0) {
                                Ext.EventObject.stopEvent();
                                Ext.getCmp('sfDocumento').onTrigger1Click();
                            }
                        }
                    }, {
                        key: "m",
                        alt: true,
                        scope: this,
                        fn: function () {
                            var btn = scopeNomDocumento.btnModificar;
                            if (!btn.disabled && !btn.hidden && scopeNomDocumento.smNomDocumento.getCount() == 1) {
                                scopeNomDocumento.WinAddModNomDocumento('Mod');
                            }
                        }
                    }, {
                        key: Ext.EventObject.DELETE,
                        scope: this,
                        fn: function () {
                            var btn = scopeNomDocumento.btnEliminar;
                            if (!btn.hidden && !btn.disabled && scopeNomDocumento.smNomDocumento.hasSelection()) {
                                scopeNomDocumento.winFpRegistrar('Del', false);
                            }
                        }
                    }
                ]);
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    },
    cargarInterfaz: function (perfil, etiquetas) {
        scopeNomDocumento.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            iconCls: 'adicionar',
            text: scopeNomDocumento.etiquetas.lbBtnAdicionar,
            tooltip: scopeNomDocumento.etiquetas.lbTtAdicionar,
            hidden:true,
            handler: function () {
                scopeNomDocumento.WinAddModNomDocumento('Ins');
            }
        });
        scopeNomDocumento.btnModificar = new Ext.Button({
            id: 'btnModificar',
            disabled: true,
            iconCls: 'modificar',
            text: scopeNomDocumento.etiquetas.lbBtnModificar,
            tooltip: scopeNomDocumento.etiquetas.lbTtModificar,
            hidden:true,
            handler: function () {
                scopeNomDocumento.WinAddModNomDocumento('Mod');
            }
        });
        scopeNomDocumento.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            disabled: true,
            iconCls: 'eliminar',
            text: scopeNomDocumento.etiquetas.lbBtnEliminar,
            tooltip: scopeNomDocumento.etiquetas.lbTtEliminar,
            hidden:true,
            handler: function () {
                scopeNomDocumento.winFpRegistrar('Del', false);
            }
        });
        scopeNomDocumento.btnAyuda = new Ext.Button({
            id: 'btnAyudaDocumentosPrimaios',
            iconCls: 'ayuda',
            text: scopeNomDocumento.etiquetas.lbBtnAyuda,
            tooltip: scopeNomDocumento.etiquetas.lbTtAyuda/*,
            handler: function () {
                //help.show(perfil.scopeNomDocumento.etiquetas.lbTtlAyuda, 'CG/multi-moneda/gestdesglose');
            }*/
        });

        scopeNomDocumento.smNomDocumento = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (smodel, rowIndex, keepExisting, record) {
                    Ext.getCmp('idgpNomDocumento').getView().addRowClass(rowIndex, "negrita");
                    switch (smodel.getSelections().length) {
                        case 0:
                        {
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnEliminar').disable();
                            scopeNomDocumento.pgNomDocumento.getStore().removeAll();
                            scopeNomDocumento.pgNomDocumento.collapse();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnModificar').enable();
                            Ext.getCmp('btnEliminar').enable();
                            scopeNomDocumento.pgNomDocumento.getStore().reload();
                            scopeNomDocumento.pgNomDocumento.expand();
                        }
                            break;
                        default :
                        {
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnEliminar').enable();
                            scopeNomDocumento.pgNomDocumento.getStore().removeAll();
                            scopeNomDocumento.pgNomDocumento.collapse();
                        }
                            break;
                    }
                },
                rowdeselect: function (smodel, rowIndex, keepExisting, record) {
                    Ext.getCmp('idgpNomDocumento').getView().removeRowClass(rowIndex, "negrita");
                    switch (smodel.getSelections().length) {
                        case 0:
                        {
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnEliminar').disable();
                            scopeNomDocumento.pgNomDocumento.getStore().removeAll();
                            scopeNomDocumento.pgNomDocumento.collapse();
                        }
                            break;
                        case 1:
                        {
                            Ext.getCmp('btnModificar').enable();
                            Ext.getCmp('btnEliminar').enable();
                            scopeNomDocumento.pgNomDocumento.getStore().reload();
                            scopeNomDocumento.pgNomDocumento.expand();
                        }
                            break;
                        default :
                        {
                            Ext.getCmp('btnModificar').disable();
                            Ext.getCmp('btnEliminar').enable();
                            scopeNomDocumento.pgNomDocumento.getStore().removeAll();
                            scopeNomDocumento.pgNomDocumento.collapse();
                        }
                            break;
                    }
                }
            }
        });

        scopeNomDocumento.stConceptod = new Ext.data.Store({
            url: 'cargarconceptos',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "id"
            }, [{
                name: 'concepto'
            }, {
                name: 'nombreconcepto'
            }])
        });

        scopeNomDocumento.stNomDocumento = new Ext.data.Store({
            url: 'cargarnomdocg',
            autoLoad: true,
            baseParams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cant',
                root: 'datos',
                id: 'iddocumentos'
            }, [
                {
                    name: 'iddocumentos'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'abreviatura'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'concepto'
                }
            ])
        });

        scopeNomDocumento.stNomDocumento.on({
            load: function (store, records, options) {
                Ext.MessageBox.hide();
                if (store.getCount() == 0) {
                    var message = (!Ext.isEmpty(scopeNomDocumento.stNomDocumento.baseParams.sfFiltro)) ? scopeNomDocumento.etiquetas.lbNoDataResults : scopeNomDocumento.etiquetas.lbNoResults;
                    mostrarMensaje(1, message);
                } else {
                    scopeNomDocumento.smNomDocumento.selectFirstRow();
                }
            }
        });

        scopeNomDocumento.gpNomDocumento = new Ext.grid.GridPanel({
            id: 'idgpNomDocumento',
            loadMask: scopeNomDocumento.etiquetas.lbCargando,
            width: 690,
            region: 'center',
            height: 310,
            frame: true,
            viewConfig: {forceFit:true},
            stripeRows: true,
            iconCls: 'icon-grid',
            autoExpandColumn: 'expandir',
            store: scopeNomDocumento.stNomDocumento,
            sm: scopeNomDocumento.smNomDocumento,
            enableColumnHide: true,
            floating: false,
            columns: [
                {
                    hidden: true,
                    dataIndex: 'iddocumentos',
                    hideable: false
                },
                {
                    header: scopeNomDocumento.etiquetas.lbCodigo,
                    width: 200,
                    dataIndex: 'codigo',
                    sortable: true
                },
                {
                    id: 'expandir',
                    header: scopeNomDocumento.etiquetas.lbDenominacion,
                    dataIndex: 'denominacion',
                    sortable: true
                },
                {
                    header: scopeNomDocumento.etiquetas.lbAbreviatura,
                    width: 150,
                    dataIndex: 'abreviatura',
                    sortable: true
                },
                {
                    hidden: true,
                    dataIndex: 'concepto',
                    hideable: false
                }
            ],
            tbar: [
                scopeNomDocumento.sfDocumento = new Ext.Cont.SearchField({
                    id: 'sfDocumento',
                    width: 250,
                    emptyText: scopeNomDocumento.etiquetas.lbCriterioBuscar,
                    searchTooltip: scopeNomDocumento.etiquetas.tooltipbuscar,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\s]*)+$/,
                    fnOnSearch: function () {
                        scopeNomDocumento.winFpRegistrar('Fnd', false);
                    },
                    fnOnClear: function () {
                        scopeNomDocumento.winFpRegistrar('Cls', false);
                    }
                })
            ],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                displayInfo: true,
                displayMsg: scopeNomDocumento.etiquetas.lbDisplayMsg,
                emptyMsg: scopeNomDocumento.etiquetas.lbEmptyMsg,
                store: scopeNomDocumento.stNomDocumento,
                firstText: scopeNomDocumento.etiquetas.lbPrimeraPagina,
                lastText: scopeNomDocumento.etiquetas.lbUltimaPagina
            })

        });
        scopeNomDocumento.pgNomDocumento =  new Ext.grid.EditorGridPanel({
            frame: true,
            region: 'east',
            title:'Propiedades',
            width: 350,
            store : store = new Ext.data.Store({
                proxy: new Ext.data.HttpProxy({
                    api: {
                        read : '/configuracion/documento/index.php/propiedadnomdocumento/load',
                        create : '/configuracion/documento/index.php/propiedadnomdocumento/new',
                        update: '/configuracion/documento/index.php/propiedadnomdocumento/edit',
                        destroy: '/configuracion/documento/index.php/propiedadnomdocumento/remove'
                    }
                }),
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'id',
                    root: 'data',
                    messageProperty: 'message'
                }, [
                    {name: 'id', allowBlank: false},
                    {name: 'iddocumentos', allowBlank: false},
                    {name: 'nombre', allowBlank: false},
                    {name: 'valor', allowBlank: false}
                ]),
                autoSave: true,
                listeners: {
                    'beforeload':function(st,opts){
                        if(scopeNomDocumento.smNomDocumento.hasSelection()){
                            st.baseParams.iddocumentos = scopeNomDocumento.smNomDocumento.getSelected().get('iddocumentos');
                        } else {
                            return false;
                        }
                    }
                }
            }),     
            collapsible: true,
            viewConfig : {
                forceFit: true
            },
            columns  :  [
                {header: "Nombre", width: 50, dataIndex: 'nombre', editor: new Ext.form.TextField()},
                {header: "Valor", width: 100, dataIndex: 'valor', editor: new Ext.form.TextField()}
            ],
            tbar : [{
                text: 'Adicionar',
                iconCls: 'adicionar',
                handler: function(btn, ev) {
                    var u = new scopeNomDocumento.pgNomDocumento.getStore().recordType({
                        id : scopeNomDocumento.smNomDocumento.getSelected().get('iddocumentos'),
                        nombre: '',
                        valor : ''
                    });
                    scopeNomDocumento.pgNomDocumento.stopEditing();
                    scopeNomDocumento.pgNomDocumento.getStore().insert(0, u);
                    scopeNomDocumento.pgNomDocumento.startEditing(0, 1);
                },
                scope: this
            }, '-', {
                text: 'Eliminar',
                iconCls: 'eliminar',
                handler:  function(btn, ev) {
                    var index = scopeNomDocumento.pgNomDocumento.getSelectionModel().getSelectedCell();
                    if (!index) {
                        return false;
                    }
                    var rec = scopeNomDocumento.pgNomDocumento.getStore().getAt(index[0]);
                    scopeNomDocumento.pgNomDocumento.getStore().remove(rec);
                },
                scope: this
            }, '-'],
            bbar: new Ext.PagingToolbar({
                store: store,
                displayInfo: true
            }),
            buttons :  [{
                text: 'Aceptar',
                iconCls: 'aceptar',
                handler:  function(btn, ev) {
                    scopeNomDocumento.pgNomDocumento.getStore().save();
                },
                scope: this
            }]
        });
        scopeNomDocumento.pgNomDocumento.relayEvents(scopeNomDocumento.pgNomDocumento.getStore(), ['destroy', 'save', 'update']);
        scopeNomDocumento.pDocumento = new Ext.Panel({
            layout: 'border',
            border: true,
            items: [scopeNomDocumento.gpNomDocumento, scopeNomDocumento.pgNomDocumento],
            tbar: [scopeNomDocumento.btnAdicionar, scopeNomDocumento.btnModificar, scopeNomDocumento.btnEliminar, '->', scopeNomDocumento.btnAyuda]
        });

        scopeNomDocumento.vpPrincipal = new Ext.Viewport({
            layout: 'fit',
            items: scopeNomDocumento.pDocumento
        });
        actionValidate.validate();
    },
    WinAddModNomDocumento: function (opcion) {
        scopeNomDocumento.keyMap.disable();
        var winVentAsig;
        scopeNomDocumento.denominacion = new Ext.form.TextField({
            anchor: '100%',
            id: 'tfDenominacion',
            name: 'denominacion',
            blankText: scopeNomDocumento.etiquetas.textCampoObligatorio,
            allowBlank: false,
            enableKeyEvents: true,
            regex: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            maskRe: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            regexText: scopeNomDocumento.etiquetas.textAlfaNum1,
            maxLength: 250,
            fieldLabel: scopeNomDocumento.etiquetas.lbDenominacion,
            listeners: {
                keyup: function () {
                    scopeNomDocumento.checkWindow();
                }
            }
        });
        scopeNomDocumento.abrevistura = new Ext.form.TextField({
            name: 'abreviatura',
            fieldLabel: scopeNomDocumento.etiquetas.lbAbreviatura,
            blankText: scopeNomDocumento.etiquetas.textCampoObligatorio,
            regex: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            maskRe: /^[\w\s\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\+\-\/\*\_]+$/,
            regexText: scopeNomDocumento.etiquetas.textAlfaNum1,
            allowBlank: false,
            maxLength: 30,
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    scopeNomDocumento.checkWindow();
                }
            }
        });
        scopeNomDocumento.codigo = new Ext.form.TextField({
            name: 'codigo',
            fieldLabel: scopeNomDocumento.etiquetas.lbCodigo,
            blankText: scopeNomDocumento.etiquetas.textCampoObligatorio,
            allowBlank: true,
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
            maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+$/,
            regexText: scopeNomDocumento.etiquetas.textAlfaNum,
            maxLength: 15,
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    scopeNomDocumento.checkWindow();
                }
            }
        });
        scopeNomDocumento.concepto = new Ext.form.ComboBox({
            name: 'concepto',
            editable: true,
            emptyText: scopeNomDocumento.etiquetas.emptyText,
            fieldLabel: scopeNomDocumento.etiquetas.lbConcepto,
            triggerAction: 'all',
            forceSelection: true,
            allowBlank: false,
            anchor: '100%',
            displayField: 'nombreconcepto',
            valueField: 'concepto',
            hiddenName: 'concepto',
            store: scopeNomDocumento.stConceptod,
            mode: 'local',
            typeAhead: true,
            enableKeyEvents: true,
            tpl: '<tpl for="."><div ext:qtip="{nombreconcepto}" class="x-combo-list-item">{nombreconcepto}</div></tpl>',
            listeners: {
                keyup: function () {
                    scopeNomDocumento.checkWindow();
                },
                select: function () {
                    scopeNomDocumento.checkWindow();
                }
            }
        });

        scopeNomDocumento.fpDocumento = new Ext.FormPanel({
            id: 'fMoneda',
            labelAlign: 'top',
            frame: true,
            border: false,
            items: [scopeNomDocumento.codigo, scopeNomDocumento.denominacion, scopeNomDocumento.abrevistura, scopeNomDocumento.concepto]
        });
        scopeNomDocumento.enterPress=false;
        var keys = new Ext.KeyMap(Ext.getBody(), [
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    if (!scopeNomDocumento.enterPress && !Ext.Ajax.isLoading() && Ext.getCmp('btnAcept') && !Ext.getCmp('btnAcept').disabled) {
                        scopeNomDocumento.enterPress=true;
                        if (scopeNomDocumento.action == 'adicionar') {
                            scopeNomDocumento.winFpRegistrar('Add', false);
                        } else {
                            scopeNomDocumento.winFpRegistrar('Mod', false);
                        }
                    }
                }
    },/* {
        key: "p",
        alt: true,
        ctrl: true,
        fn: function () {
            if (!Ext.Ajax.isLoading() && Ext.getCmp('btnAply') && !Ext.getCmp('btnAply').disabled) {
                        scopeNomDocumento.winFpRegistrar('Add', true);
                    }
                }
            }, {
                key: "x",
                alt: true,
                fn: function () {
                    winVentAsig.close();
                }
            }*/
        ]);
        switch (opcion) {
            case 'Ins':
                if (!winVentAsig) {
                    scopeNomDocumento.window = winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winadd',
                        closeAction: 'close',
                        layout: 'fit',
                        title: scopeNomDocumento.etiquetas.lbTtlAdicionar,
                        width: 290,
                        constrain:true,
                        defaultButton: 'btnCancel',
                        height: 280,
                        resizable: false,
                        keys: keys,
                        firstElement:scopeNomDocumento.codigo,
                        buttons: [{
                            iconCls: 'cancelar',
                            id: 'btnCancel',
                            text: scopeNomDocumento.etiquetas.lbBtnCancelar,
                            tooltip: scopeNomDocumento.etiquetas.lbTtCancelar,
                            handler: function () {
                                winVentAsig.close();
                            }
                        },
                            {
                                iconCls: 'aplicar',
                                id: 'btnAply',
                                text: scopeNomDocumento.etiquetas.lbBtnAplicar,
                                disabled: true,
                                tooltip: scopeNomDocumento.etiquetas.lbTtAplicar,
                                handler: function () {
                                    scopeNomDocumento.winFpRegistrar('Add', true);
                                }
                            },
                            {
                                iconCls: 'aceptar',
                                id: 'btnAcept',
                                text: scopeNomDocumento.etiquetas.lbBtnAceptar,
                                disabled: true,
                                tooltip: scopeNomDocumento.etiquetas.lbTtAceptar,
                                handler: function () {
                                    scopeNomDocumento.winFpRegistrar('Add', false);
                                }
                            }],
                        listeners: {
                            beforeshow:function(){
                                var mask=new Ext.LoadMask(scopeNomDocumento.window.body);
                                mask.show();
                                scopeNomDocumento.stConceptod.load({
                                    callback:function(){
                                        mask.hide();
                                    }
                                });
                            },
                            show: function () {
                                scopeNomDocumento.action = 'adicionar';
                                scopeNomDocumento.windowOp = true;
                            },
                            close: function () {
                                scopeNomDocumento.windowOp = false;
                                scopeNomDocumento.btnAdicionar.focus();
                                scopeNomDocumento.keyMap.enable();
                            }, render: function () {
                                winVentAsig.focus();
                            }
                        }
                    });
                }
                scopeNomDocumento.fpDocumento.getForm().reset();
                winVentAsig.add(scopeNomDocumento.fpDocumento);

                winVentAsig.show();
                winVentAsig.doLayout();
                break;
            case 'Mod':
                if (!winVentAsig) {
                    scopeNomDocumento.window = winVentAsig = new Ext.Window({
                        modal: true,
                        id: 'winmod',
                        closeAction: 'close',
                        layout: 'fit',
                        title: scopeNomDocumento.etiquetas.lbTtlModificar,
                        constrain:true,
                        width: 290,
                        defaultButton: 'btnCancel',
                        firstElement:scopeNomDocumento.codigo,
                        height: 280,
                        resizable: false,
                        keys: keys,
                        buttons: [
                            {
                                iconCls: 'cancelar',
                                id: 'btnCancel',
                                text: scopeNomDocumento.etiquetas.lbBtnCancelar,
                                tooltip: scopeNomDocumento.etiquetas.lbTtCancelar,
                                handler: function () {
                                    winVentAsig.close();
                                    scopeNomDocumento.keyMap.enable();
                                }
                            },
                            {
                                iconCls: 'aceptar',
                                disabled: true,
                                id: 'btnAcept',
                                text: scopeNomDocumento.etiquetas.lbBtnAceptar,
                                tooltip: scopeNomDocumento.etiquetas.lbTtAceptar,
                                handler: function () {
                                    scopeNomDocumento.winFpRegistrar('Mod', false);
                                }
                            }
                        ],
                        listeners: {
                            beforeshow:function(){
                                var mask=new Ext.LoadMask(scopeNomDocumento.window.body);
                                mask.show();
                                scopeNomDocumento.stConceptod.load({
                                    callback:function(){
                                        scopeNomDocumento.fpDocumento.getForm().loadRecord(scopeNomDocumento.smNomDocumento.getSelected());
                                        scopeNomDocumento.fpDocumento.getForm().setValues({
                                            'codigo': scopeNomDocumento.fpDocumento.getForm().getValues().codigo.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                                            'denominacion': scopeNomDocumento.fpDocumento.getForm().getValues().denominacion.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''),
                                            'abreviatura': scopeNomDocumento.fpDocumento.getForm().getValues().abreviatura.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')
                                        });
                                        mask.hide();
                                    }
                                });
                            },
                            show: function () {
                                scopeNomDocumento.action = 'modificar';
                                scopeNomDocumento.windowOp = true;
                            },
                            close: function () {
                                scopeNomDocumento.windowOp = false;
                                scopeNomDocumento.documento = undefined;
                                scopeNomDocumento.btnAdicionar.focus();
                                scopeNomDocumento.keyMap.enable();
                            }, render: function () {
                                winVentAsig.focus();
                            }
                        }
                    });
                }
                winVentAsig.add(scopeNomDocumento.fpDocumento);
                winVentAsig.add(scopeNomDocumento.pgNomDocumento);
                winVentAsig.show();
                winVentAsig.doLayout();
                scopeNomDocumento.documento = scopeNomDocumento.smNomDocumento.getSelected().data;
                break;
        }
    },
    fnNombrarCategoria: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.data.idcategoria == ('1' || 1)) {
            return scopeNomDocumento.etiquetas.lbMonedas;
        } else {
            return scopeNomDocumento.etiquetas.lbBilletes;
        }
    },
    winFpRegistrar: function (opcion, apl) {

        switch (opcion) {
            case 'Add':
            {
                var form = scopeNomDocumento.fpDocumento.getForm();
                var mensajeria = validarFormAdicionar(scopeNomDocumento.codigo.getValue(), scopeNomDocumento.denominacion.getValue(), scopeNomDocumento.abrevistura.getValue());
                if (form.isValid()) {
                    if (mensajeria === "") {
                        form.setValues(
                            {
                                denominacion: form.getValues().denominacion.trim(),
                                abreviatura: form.getValues().abreviatura,
                                codigo: form.getValues().codigo,
                                concepto: form.getValues().concepto
                            }
                        );
                        scopeNomDocumento.fpDocumento.getForm().submit({
                            url: 'insertarnomdoc',
                            waitMsg: scopeNomDocumento.etiquetas.textAdicionandoDocumento,
                            failure: function (form, action) {
                                if (action.result.codMsg == -1) {
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.Msgdocinsertado);
                                    scopeNomDocumento.fpDocumento.getForm().reset();
                                    if (!apl) {
                                        Ext.getCmp('winadd').close();
                                        scopeNomDocumento.keyMap.enable();
                                    } else {
                                        Ext.getCmp('btnAcept').disable();
                                        Ext.getCmp('btnAply').disable();
                                    }
                                    scopeNomDocumento.stNomDocumento.reload();
                                } else if (action.result.codMsg == -4) {
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimCodigo);
                                } else if (action.result.codMsg == -5) {
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimNombre);
                                } else {
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimAbrev);
                                }
                                scopeNomDocumento.enterPress=false;
                            }
                        });
                    }
                    else
                        mostrarMensaje(1, mensajeria);
                }
                else {
                    mostrarMensaje(1, scopeNomDocumento.etiquetas.camposMal);
                }
            }
                break;
            case 'Mod':
            {
                var form = scopeNomDocumento.fpDocumento.getForm();
                if (form.isValid()) {

                    form.setValues(
                        {
                            denominacion: form.getValues().denominacion.trim(),
                            abreviatura: form.getValues().abreviatura,
                            codigo: form.getValues().codigo,
                            concepto: form.getValues().concepto
                        }
                    );
                    scopeNomDocumento.fpDocumento.getForm().submit({
                        url: 'modificarnomdoc',
                        params: {
                            iddocumentos: scopeNomDocumento.smNomDocumento.getSelected().data.iddocumentos
                        },
                        waitMsg: scopeNomDocumento.etiquetas.textModificandoDocumento,
                        failure: function (form, action) {
                            switch (action.result.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.MsgdocMod);
                                    scopeNomDocumento.fpDocumento.getForm().reset();
                                    Ext.getCmp('winmod').close();
                                    scopeNomDocumento.keyMap.enable();
                                    scopeNomDocumento.stNomDocumento.reload();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.infoModNomDocPrim);
                                    break;
                                case -4:
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimCodigo);
                                    break;
                                case -5:
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimNombre);
                                    break;
                                case -6:
                                    mostrarMensaje(1, scopeNomDocumento.etiquetas.textYaexisteDocPrimAbrev);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    break;
                            }
                            scopeNomDocumento.enterPress=false;
                        }
                    });
                }
                else {
                    mostrarMensaje(1, scopeNomDocumento.etiquetas.camposMal);
                }
            }
                break;
            case 'Del':
            {
                scopeNomDocumento.keyMap.disable();
                if (scopeNomDocumento.smNomDocumento.getSelections()) {
                    var arrayDocumentos = scopeNomDocumento.smNomDocumento.getSelections();
                    var arrayIdDocumentos = [];
                    for (var i = 0; i < arrayDocumentos.length; i++) {
                        arrayIdDocumentos.push({
                            iddocumentos: arrayDocumentos[i].data.iddocumentos
                        });
                    }
                    function elimina(btnPresionado) {
                        if (btnPresionado == 'ok') {
                            Ext.Msg.wait(scopeNomDocumento.etiquetas.lbmsgEli, scopeNomDocumento.etiquetas.lbEsperando);
                            var idndocumentos = scopeNomDocumento.smNomDocumento.getSelections()[0].get('iddocumentos');


                            Ext.Ajax.request({
                                url: 'eliminarNomencladorDocumentoPrimario',
                                method: 'POST',
                                params: {
                                    iddocumentos: Ext.encode(arrayIdDocumentos)
                                },
                                callback: function (options, success, response) {
                                    responseData = Ext.decode(response.responseText);
                                    var noDocumentDel = responseData.documentos.split(',');
                                    Ext.Msg.hide();
                                    switch (responseData.codMsg) {
                                        case -1:
                                            mostrarMensaje(1, scopeNomDocumento.etiquetas.lbMsgDel);
                                            scopeNomDocumento.smNomDocumento.clearSelections();
                                            scopeNomDocumento.stNomDocumento.reload();
                                            scopeNomDocumento.keyMap.enable();
                                            break;
                                        case -2:
                                            mostrarMensaje(1, scopeNomDocumento.etiquetas.lbMsgDelPlural);
                                            scopeNomDocumento.smNomDocumento.clearSelections();
                                            scopeNomDocumento.stNomDocumento.reload();
                                            scopeNomDocumento.keyMap.enable();
                                            break;
                                        case -3:
                                            var selctionDel = scopeNomDocumento.smNomDocumento.getSelections().length;
                                            var noDocumentDel = responseData.documentos.split(',');

                                            var message = (selctionDel === 1) ? message = scopeNomDocumento.etiquetas.lbMsgNotDelSingular + '</br>'
                                                : (noDocumentDel.length === 1) ? message = scopeNomDocumento.etiquetas.lbMsgNotDelSingularOtro + '</br>'
                                                : (noDocumentDel.length > 1 && noDocumentDel.length < selctionDel) ? message = scopeNomDocumento.etiquetas.lbMsgNotDelSingularOtros + '</br>'
                                                : message = scopeNomDocumento.etiquetas.lbMsgNotDelPlural + '</br>';

                                            message += (selctionDel === 1) ? ''  : "<i> &blacksquare; " + responseData.documentos;
                                            mostrarMensaje(1, message, function () {
                                                scopeNomDocumento.smNomDocumento.clearSelections();
                                                scopeNomDocumento.stNomDocumento.reload();
                                                scopeNomDocumento.keyMap.enable();
                                            });
                                            break;
                                        default:
                                            mostrarMensaje(responseData.codMsg, responseData.mensaje, function () {
                                                scopeNomDocumento.keyMap.enable();
                                            });
                                            break;
                                    }
                                }
                            });
                        } else {
                            scopeNomDocumento.keyMap.enable();
                        }
                    }

                    if (scopeNomDocumento.smNomDocumento.getSelections().length == 1)
                        mostrarMensaje(2, scopeNomDocumento.etiquetas.preguntaElimN, elimina);
                    else
                        mostrarMensaje(2, scopeNomDocumento.etiquetas.preguntaElimNPlural, elimina);
                } else {
                    mostrarMensaje(1, scopeNomDocumento.etiquetas.lbDebeSDEN, function () {
                        scopeNomDocumento.keyMap.enable();
                    });
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

        function validarFormAdicionar(codigo, denominacion, abreviatura) {
            var mensaje = "";
            if(!Ext.isEmpty(codigo)){
                for (var i = 0; i < scopeNomDocumento.stNomDocumento.data.length; i++) {
                    if (scopeNomDocumento.stNomDocumento.data.items[i].get('codigo') === codigo) {
                        mensaje = scopeNomDocumento.etiquetas.textYaexisteDocPrimCodigo;
                        return mensaje;
                    }
                }
            }

            for (var i = 0; i < scopeNomDocumento.stNomDocumento.data.length; i++) {
                if (scopeNomDocumento.stNomDocumento.data.items[i].get('abreviatura') === abreviatura) {
                    mensaje = scopeNomDocumento.etiquetas.textYaexisteDocPrimAbrev;
                    return mensaje;
                }
            }

            for (var i = 0; i < scopeNomDocumento.stNomDocumento.data.length; i++) {
                if (scopeNomDocumento.stNomDocumento.data.items[i].get('denominacion') === denominacion) {
                    mensaje = scopeNomDocumento.etiquetas.textYaexisteDocPrimNombre;
                    return mensaje;
                }
            }

            return mensaje;
        }

        function fnAceptarCambios(btnPress) {
            if (btnPress == "ok") {
                scopeNomDocumento.smNomDocumento.clearSelections();
                scopeNomDocumento.stNomDocumento.baseParams = {};
                scopeNomDocumento.stNomDocumento.reload();
            }
        }

        function fnBuscar() {
            scopeNomDocumento.stNomDocumento.baseParams.start = '';
            scopeNomDocumento.stNomDocumento.baseParams.limit = '';
            scopeNomDocumento.stNomDocumento.baseParams.sfFiltro = scopeNomDocumento.sfDocumento.getRawValue();
            scopeNomDocumento.stNomDocumento.load();
        }
    },
    loadCSS: function (cssSrc, id) {
        if (cssSrc != null) {
            var tagScriptCSS = document.createElement("script");
            tagScriptCSS.setAttribute("rel", "stylesheet");
            tagScriptCSS.setAttribute("type", "text/css");
            tagScriptCSS.setAttribute("id", id);
            tagScriptCSS.setAttribute("src", cssSrc + ".css");
            document.getElementsByTagName("body")[0].appendChild(tagScriptCSS);
        }
    },
    changedForm: function () {
        var newValues = scopeNomDocumento.fpDocumento.getForm().getValues();
        var oldValues = scopeNomDocumento.documento;
        var changed = false;
        for (k in newValues) {
            if (newValues[k].trim() != oldValues[k].replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '')) {
                changed = true;
                break;
            }
        }
        return changed;
    },
    checkWindow: function () {
        if (scopeNomDocumento.fpDocumento.getForm().isValid()) {
            if (scopeNomDocumento.action == 'modificar' && scopeNomDocumento.changedForm()) {
                Ext.getCmp('btnAcept').enable();
            } else if (scopeNomDocumento.action == 'adicionar') {
                Ext.getCmp('btnAcept').enable();
                Ext.getCmp('btnAply').enable();
            } else {
                Ext.getCmp('btnAcept').disable();
            }
        } else {
            Ext.getCmp('btnAcept').disable();
            if (scopeNomDocumento.action == 'adicionar') {
                Ext.getCmp('btnAply').disable();
            }
        }
    }
});
new Ext.ConfGnral.Documento.NomDocumento();


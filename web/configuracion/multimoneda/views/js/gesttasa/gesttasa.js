/* 
 * Gestion de Tasas de cambio.
 * 
 * @author Ing. Maikel Garcia Valdes.
 * @package ERP Cuba.
 * @subpackage Configuraci&oacute;n General. 
 * @namespace Ext.ConfGnral.MultiMoneda
 * @copyright XETID.
 * @version 3.0
 */
Ext.namespace('Ext.ConfGnral.MultiMoneda');
var perfil = window.parent.UCID.portal.perfil;
Ext.ConfGnral.MultiMoneda.GestTasa = Ext.extend(Ext.Component, {
    perfil: window.parent.UCID.portal.perfil,
    etiquetas: window.parent.UCID.portal.perfil.etiquetas,
    constructor: function () {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        scope = this;
        scope.action = 'adicionar';
        Ext.Ajax.request({
            method: "POST",
            url: "cargaretiquetas",
            params: {
                vista: 'gesttasa'
            },
            callback: function (options, success, response) {
                scope.etiquetas = Ext.decode(response.responseText) || scope.etiquetas;
                scope.onloadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbCargando, true);
            }
        });
    },
    onloadMessageBox: function (agTtl, agMsg, inicial) {
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
                if (i == 1 && inicial) {
                    scope.cargarInterfaz();
                }
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);

        }
    },
    cargarInterfaz: function (perfil, etiquetas) {
        var smGestTasa, sfTasas, stTasas, stTipoDeTasa, stClientes, stMonedaAlternativa, stMonedaContable;
        var winAddTasa, winModTasa, winBuscTasa;
        var fpRegTasa, fpRegTasaBus;
        var cmbTipoTasa, cmbCliente;
        var tfHasta, tfDesde, tfDesdeBusqAvanz, tfHastaBusqAvanz, tfNombreBusqAvanz, tfNombreTasa;
        var contratada = false;
        var busqueda;
        var cmbMoneda, cmbMonedaContable, cmbTipoTasaBusqAvanz, cmbClienteBusqAvanz, cmbMonedaBusqAvanz;
        var btnAdicionar, btnModificar, btnEliminar, btnAyuda;
        var gpTasas;
        var nfTasaDirecta, nfTasaIndirecta, nfFactorConversion, tfReferencia;
        var panel, vpPrincipal;
        var isWinOpenMod = false;
        var isWinOpenIns = false;
        var me = this;

        actionValidate.validate();

        btnAdicionar = new Ext.Button({
            id: 'btnAdicionarTasa',
            iconCls: 'adicionar',
            hidden: true,
            tooltip: scope.etiquetas.lbTtAdicionar,
            text: scope.etiquetas.lbBtnAdicionar,
            handler: function () {
                GestTasa('Ins');
            }
        });

        btnModificar = new Ext.Button({
            id: 'btnModificarTasa',
            iconCls: 'modificar',
            hidden: true,
            tooltip: scope.etiquetas.lbttModificar,
            text: scope.etiquetas.lbBtnModificar,
            handler: function () {
                GestTasa('Mod');
            }
        });

        btnEliminar = new Ext.Button({
            id: 'btnEliminarTasa',
            iconCls: 'eliminar',
            hidden: true,
            text: scope.etiquetas.lbBtnEliminar,
            tooltip: scope.etiquetas.lbttEliminar,
            handler: function () {
                Eliminar();
            }
        });

        btnAyuda = new Ext.Button({
            id: 'btnAyudaTasa',
            iconCls: 'ayuda',
            text: scope.etiquetas.lbBtnAyuda,
            tooltip: scope.etiquetas.lbTtAyuda/*,
             handler: function () {
             // help.show(scope.etiquetas.lbVenTtAyuda, 'CG/multi-moneda/gesttasa');
             }*/
        });

        stTasas = new Ext.data.GroupingStore({
            url: 'cargartasa',
            baseparams: {
                start: 0,
                limit: 20
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idtasa"
            }, [{
                name: 'idtasa'
            }, {
                name: 'venta'
            }, {
                name: 'compra'
            }, {
                name: 'desde'
            }, {
                name: 'hasta'
            }, {
                name: 'idcliente'
            }, {
                name: 'referencia'
            }, {
                name: 'idtipotasa'
            }, {
                name: 'nombretipotasa'
            }, {
                name: 'factordeconversion'
            }, {
                name: 'version'
            }, {
                name: 'idmonedacontable'
            }, {
                name: 'idmoneda'
            }, {
                name: 'codigoiso'
            }, {
                name: 'codigoisomonedacontable'
            }, {
                name: 'nombretasa'
            }, {
                name: 'tiempoactual'
            }, {
                name: 'idestructuracomun'
            }, {
                name: 'nombrecliente'
            }]),
            sortInfo: {
                field: 'nombretasa',
                direction: "ASC"
            },
            groupField: 'nombretipotasa'
        });

        stTasas.on({
            beforeload: function (store, options) {
                Ext.MessageBox.hide();
            },
            load: function (store, records, options) {
                Ext.MessageBox.hide();
                if (stTasas.getTotalCount() != 0) {
                    if (!smGestTasa.getSelected()) {
                        smGestTasa.selectFirstRow();
                    }
                } else {
                    if (stTasas.getTotalCount() == 0) {
                        if (!busqueda) {
                            mostrarMensaje(1, scope.etiquetas.NoExisDQM);
                            busqueda = false;
                        } else
                            mostrarMensaje(1, scope.etiquetas.infoNoResultsSimple);
                    }
                }
            }
        });

        smGestTasa = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpTasas').getView().addRowClass(rowIndex, "negrita");
                    changeSelection();
                },
                rowdeselect: function (selectioModel, rowIndex, record) {
                    Ext.getCmp('gpTasas').getView().removeRowClass(rowIndex, "negrita");
                    changeSelection();
                }
            }
        });

        gpTasas = new Ext.grid.GridPanel({
            id: 'gpTasas',
            frame: false,
            border: false,
            iconCls: 'icon-grid',
            autoExpandColumn: 'expandir',
            loadMask: scope.etiquetas.lbCargando,
            width: 450,
            store: stTasas,
            collapsible: true,
            animCollapse: false,
            viewConfig: {
                autoFill: true,
                forceFit: true
            },
            sm: smGestTasa,
            stripeRows: true,
            floating: false,
            columns: [{
                dataIndex: 'idtasa',
                hidden: true,
                width: 0,
                hideable: false
            },
                {
                    id: 'expandir',
                    header: scope.etiquetas.lbNombreTasa,
                    width: 150,
                    dataIndex: 'nombretasa',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbMonedaContable,
                    width: 150,
                    dataIndex: 'codigoisomonedacontable',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbMonedaAlternativa,
                    width: 150,
                    dataIndex: 'codigoiso',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbTipoTasa,
                    width: 90,
                    dataIndex: 'nombretipotasa',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbCompra,
                    width: 90,
                    dataIndex: 'compra',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbVenta,
                    width: 90,
                    dataIndex: 'venta',
                    sortable: true
                },
                {
                    header: scope.etiquetas.lbInicio,
                    width: 90,
                    dataIndex: 'desde'
                },
                {
                    header: scope.etiquetas.lbFin,
                    width: 90,
                    dataIndex: 'hasta'
                },
                {
                    hidden: true,
                    dataIndex: 'factordeconversion',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'codigo',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'referencia',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'idtipotasa',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'idmoneda',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'idmonedacontable',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'monedacontable',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'version',
                    hideable: false
                },
                {
                    hidden: true,
                    dataIndex: 'idcliente',
                    hideable: false
                }
            ],
            tbar: [
                sfTasas = new Ext.Cont.SearchField({
                    id: 'sfTasas',
                    width: 250,
                    emptyText: scope.etiquetas.lbCriterioBuscar,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]*)+$/,
                    searchTooltip: scope.etiquetas.lbsearchTooltip,
                    fnOnSearch: function () {
                        busqueda = true;
                        buscarTasas();
                    },
                    fnOnClear: function () {
                        busqueda = false;
                        buscarTasas();
                    }
                })],
            bbar: new Ext.Cont.PagingToolbar({
                pageSize: 20,
                store: stTasas,
                displayInfo: true,
                displayMsg: scope.etiquetas.lbDisplayMsg,
                emptyMsg: scope.etiquetas.lbEmptyMsg,
                prevText: scope.etiquetas.beforePageText,
                nextText: scope.etiquetas.afterPageText,
                firstText: scope.etiquetas.firstPageText,
                lastText: scope.etiquetas.lastPageText
            }),
            view: new Ext.grid.GroupingView({
                startCollapsed: false,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "en total" : "en total"]})'
            })
        });

        var cmbOrganos = new Ext.CmbOrganos({
            idioma: scope.etiquetas,
            gridStore: stTasas
        });

        panel = new Ext.Panel({
            layout: 'fit',
            border: false,
            loadMask: scope.etiquetas.lbCargando,
            listeners: {
                render: function () {
                    Ext.getCmp('btnAdicionarTasa').focus();
                }
            },
            items: gpTasas,
            tbar: [btnAdicionar, btnModificar, btnEliminar, '->', cmbOrganos, btnAyuda]
        });

        stTipoDeTasa = new Ext.data.Store({
            url: 'cargartipostasa',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idtipotasa"
            }, [{
                name: 'idtipotasa'
            }, {
                name: 'nombretipotasa'
            }])
        });

        stClientes = new Ext.data.Store({
            url: 'cargarclientes',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idclientesproveedores"
            }, [{
                name: 'idclientesproveedores'
            }, {
                name: 'nombre'
            }])
        });

        stMonedaAlternativa = new Ext.data.Store({
            url: 'cargmonedasaltern',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idmoneda"
            }, [{
                name: 'idmoneda'
            }, {
                name: 'codigoiso'
            }])
        });

        stMonedaContable = new Ext.data.Store({
            url: 'cargarmonedacont',
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos",
                id: "idmonedaentidad"
            }, [{
                name: 'idmonedaentidad'
            }, {
                name: 'codigoiso'
            }])
        });

        (function cargarDatos() {
            stTasas.load({
                params: {
                    start: 0,
                    limit: 20
                }
            });
        })();

        tfNombreTasa = new Ext.form.TextField({
            id: 'tfNombreTasa',
            fieldLabel: scope.etiquetas.lbNombre,
            name: 'nombretasa',
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc]+(\s*[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*)+$/,
            // maskRe: /^([a-zA-ZáéíóúñüÑ\s]+ ?[a-zA-ZáéíóúñüÑ]*)+$/,
            allowBlank: false,
            maxLength: 30,
            regexText: scope.etiquetas.lbRegextextOl,
            maxLengthText: scope.etiquetas.lbMaxLengthText,
            blankText: scope.etiquetas.lbBlankText,
            anchor: '85%',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }

            }

        });

        cmbMoneda = new Ext.form.ComboBox({
            id: 'cmbMoneda',
            anchor: '85%',
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbMonedaAlternativa,
            blankText: scope.etiquetas.lbBlankText,
            forceSelection: true,
            typeAhead: true,
            editable: true,
            allowBlank: false,
            store: stMonedaAlternativa,
            name: 'idmoneda',
            displayField: 'codigoiso',
            valueField: 'idmoneda',
            triggerAction: 'all',
            hiddenName: 'idmoneda',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                },
                select: function () {
                    comprobarVentana();
                },
                expand: function (combo) {
                    stMonedaAlternativa.clearFilter();
                    stMonedaAlternativa.filterBy(function (record) {
                        return record.json.idmonedaentidad != cmbMonedaContable.getValue();
                    });
                }
            }
        });

        cmbMonedaContable = new Ext.form.ComboBox({
            id: 'cmbMonedaContable',
            anchor: '85%',
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbMonedaContable,
            blankText: scope.etiquetas.lbBlankText,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            store: stMonedaContable,
            name: 'idmonedacontable',
            displayField: 'codigoiso',
            valueField: 'idmonedaentidad',
            triggerAction: 'all',
            hiddenName: 'idmonedacontable',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                },
                select: function (combo, record, index) {
                    comprobarVentana();
                    if (cmbMoneda.getValue() == record.json.idmoneda) {
                        cmbMoneda.reset();
                    }
                }
            }
        });

        cmbTipoTasa = new Ext.form.ComboBox({
            id: 'cmbTipoTasa',
            name: 'idtipotasa',
            anchor: '85%',
            emptyText: scope.etiquetas.lbSeleccionar,
            fieldLabel: scope.etiquetas.lbTipoTasa,
            blankText: scope.etiquetas.lbBlankText,
            store: stTipoDeTasa,
            forceSelection: true,
            allowBlank: false,
            editable: true,
            typeAhead: true,
            displayField: 'nombretipotasa',
            valueField: 'idtipotasa',
            triggerAction: 'all',
            hiddenName: 'idtipotasa',
            mode: 'local',
            tpl: '<tpl for="."><div ext:qtip="{nombretipotasa}" class="x-combo-list-item">{nombretipotasa}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }
            }

        });

        cmbCliente = new Ext.form.ComboBox({
            emptyText: scope.etiquetas.lbSeleccionar,
            disabled: true,
            allowBlank: false,
            forceSelection: true,
            fieldLabel: scope.etiquetas.lbCliente,
            anchor: '85%',
            name: 'idcliente',
            id: 'idcliente',
            store: stClientes,
            editable: true,
            typeAhead: false,
            displayField: 'nombre',
            valueField: 'idclientesproveedores',
            hiddenName: 'idclientesproveedores',
            triggerAction: 'all',
            mode: 'remote',
            listWidth: 300,
            pageSize: 10,
            minChars: 0,
            queryParam: 'filtronomb',
            loadingText: scope.etiquetas.lbCargando,
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                },
                select: function () {
                    comprobarVentana();
                }

            }
        });

        nfFactorConversion = new Ext.form.TextField({
            id: 'nfFactorConversion',
            fieldLabel: scope.etiquetas.lbFactordeconversion,
            name: 'factordeconversion',
            maxLength: 20,
            maxLengthText: scope.etiquetas.lbMaxLengthNum19,
            anchor: '85%',
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: false,
            regexText: scope.etiquetas.lbRegexTextNR,
            regex: /^\d{1,14}([.]\d{1,5})?$/,
            maskRe: /^\d+([.]\d+)?$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }


            }
        });

        nfTasaDirecta = new Ext.form.NumberField({
            id: 'nfTasaDirecta',
            name: 'compra',
            anchor: '85%',
            maxLength: 20,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbCompra,
            blankText: scope.etiquetas.lbBlankText,
            regexText: scope.etiquetas.lbRegexTextNR,
            maxLengthText: scope.etiquetas.lbMaxLengthNum19,
            regex: /^\d{1,14}([.]\d{1,5})?$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }

            }
        });

        nfTasaIndirecta = new Ext.form.NumberField({
            id: 'nfTasaIndirecta',
            name: 'venta',
            anchor: '85%',
            maxLength: 20,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbVenta,
            blankText: scope.etiquetas.lbBlankText,
            regexText: scope.etiquetas.lbRegexTextNR,
            maxLengthText: scope.etiquetas.lbMaxLengthNum19,
            regex: /^\d{1,14}([.]\d{1,5})?$/,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }

            }
        });

        tfDesde = new Ext.form.DateField({
            id: 'tfDesde',
            name: 'desde',
            format: 'd/m/Y',
            allowBlank: false,
            vtype: 'daterange',
            endDateField: 'tfHasta',
            maxText: scope.etiquetas.lbMaxText,
            value: new Date(),
            fieldLabel: scope.etiquetas.lbDesde,
            blankText: scope.etiquetas.lbBlankText,
            emptyText: scope.etiquetas.lbSeleccionar,
            invalidText: scope.etiquetas.lbInvalidTextFormatFecha,
            enableKeyEvents: true,
            listeners: {
                change: function(field,newvalue) {
                    if (newvalue == '') {
                        var id = field.endDateField;
                        Ext.getCmp(id).setMinValue(null);
                        Ext.getCmp(id).validate();

                    }
                    comprobarVentana();
                },
                keyup: function () {
                    comprobarVentana();
                }
            }
        });

        tfHasta = new Ext.form.DateField({
            id: 'tfHasta',
            name: 'hasta',
            format: 'd/m/Y',
            minText: scope.etiquetas.lbMinText,
            vtype: 'daterange',
            startDateField: 'tfDesde',
            fieldLabel: scope.etiquetas.lbHasta,
            emptyText: scope.etiquetas.lbSeleccionar,
            invalidText: scope.etiquetas.lbInvalidTextFormatFecha,
            enableKeyEvents: true,
            listeners: {
                change: function(field,newvalue) {
                    if (newvalue == '') {
                        var id = field.startDateField;
                        Ext.getCmp(id).setMaxValue(null);
                        Ext.getCmp(id).validate();

                    }
                    comprobarVentana();
                },
                keyup: function () {
                    comprobarVentana();
                }

            }
        });

        tfReferencia = new Ext.form.TextField({
            id: 'tfReferencia',
            name: 'referencia',
            anchor: '93%',
            maxLength: 255,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbFuenteReferencia,
            blankText: scope.etiquetas.lbBlankText,
            maxLengthText: scope.etiquetas.lbMaxLengthText,
            regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+ ?[a-zA-Z\s]*)+$/,
            regexText: scope.etiquetas.lbregexText,
            enableKeyEvents: true,
            listeners: {
                keyup: function () {
                    comprobarVentana();
                }

            }
        });

        fpRegTasa = new Ext.FormPanel({
            id: 'fpRegTasa',
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:15px 15px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.25,
                    layout: 'form',
                    items: tfNombreTasa
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    items: cmbMonedaContable
                }, {
                    columnWidth: 0.25,
                    layout: 'form',
                    items: cmbMoneda
                },
                    {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: cmbTipoTasa
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: cmbCliente
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: nfTasaDirecta
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: nfTasaIndirecta
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: nfFactorConversion
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: tfDesde
                    }, {
                        columnWidth: 0.25,
                        layout: 'form',
                        items: tfHasta
                    },
                    {
                        columnWidth: 0.50,
                        layout: 'form',
                        items: tfReferencia
                    }]
            }
            ]

        });

        fpRegTasaBus = new Ext.FormPanel({
            id: 'fpRegTasaBus',
            labelAlign: 'top',
            frame: true,
            border: false,
            bodyStyle: 'padding:15px 15px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: 0.33,
                    layout: 'form',
                    items: tfNombreBusqAvanz

                }, {
                    columnWidth: 0.33,
                    layout: 'form',
                    items: cmbMonedaBusqAvanz
                },
                    {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: cmbTipoTasaBusqAvanz
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: cmbClienteBusqAvanz
                    },
                    {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: tfDesdeBusqAvanz
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: tfHastaBusqAvanz
                    }]
            }
            ]
        });

        cmbTipoTasa.on({
            select: function (combo) {
                var tipo = combo.getValue();
                if (tipo == 2) {
                    tfDesde.setDisabled(true);
                    tfHasta.setDisabled(true);
                    tfDesde.setValue(new Date());
                    tfHasta.setValue(new Date());
                } else {
                    tfDesde.setDisabled(false);
                    tfHasta.setDisabled(false);
                }

                if (tipo != 1) {
                    Ext.getCmp('idcliente').disable();
                    Ext.getCmp('idcliente').setValue('');
                    contratada = false;
                } else {
                    contratada = true;
                    Ext.getCmp('idcliente').enable();
                    Ext.getCmp('idcliente').store.load({
                        callback:function(records){
                            if (records.length == 0) {
                                combo.markInvalid(scope.etiquetas.lbMsgNoClientesProvedores);
                                if (isWinOpenIns) {
                                    Ext.getCmp('idbtnAcpetarWAdd').disable();
                                    Ext.getCmp('idbtnAplicarWAdd').disable();
                                } else if (isWinOpenMod) {
                                    Ext.getCmp('idbtnAcpetarWMod').disable();
                                }
                            }
                        }
                    });
                }
                comprobarVentana();
            }
        });

        vpPrincipal = new Ext.Viewport({
            layout: 'fit',
            items: [panel],
            keys: scope.keymap = new Ext.KeyMap(Ext.getBody(), [
                {
                    key: 'i',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('btnAdicionarTasa').isVisible() && !Ext.getCmp('btnAdicionarTasa').disabled) {
                            Ext.getCmp('btnAdicionarTasa').handler.call();
                        }
                    }
                }, {
                    key: 'm',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('btnModificarTasa').isVisible() && !Ext.getCmp('btnModificarTasa').disabled) {
                            Ext.getCmp('btnModificarTasa').handler.call();
                        }
                    }
                }, {
                    key: 'b',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('sfTasas').getRawValue().length > 0) {
                            Ext.getCmp('sfTasas').onTrigger2Click();
                        } else {
                            Ext.getCmp('sfTasas').focus();
                        }
                    }
                }, {
                    key: 'l',
                    alt: true,
                    fn: function () {
                        if (Ext.getCmp('sfTasas').getRawValue().length > 0) {
                            Ext.EventObject.stopEvent();
                            Ext.getCmp('sfTasas').onTrigger1Click();
                        }
                    }
                }, {
                    key: Ext.EventObject.DELETE,
                    fn: function () {
                        if (Ext.getCmp('btnEliminarTasa').isVisible() && !Ext.getCmp('btnEliminarTasa').disabled) {
                            Ext.getCmp('btnEliminarTasa').handler.call();
                        }
                    }
                }, {
                    key: 'h',
                    alt: true,
                    fn: function () {
                        Ext.getCmp('btnAyuda').handler.call();
                    }
                }
            ])
        });
        panel.focus();

        function GestTasa(Accion) {
            scope.loadMask("Cargando...");
            stMonedaContable.load({
                callback: function (r, option, success) {
                    if (stMonedaContable.reader.jsonData.datos.length == 0) {
                        lMask.hide();
                        mostrarMensaje(1, scope.etiquetas.lbmsgDebeCOnfigurarMonedaContabl);
                    }
                    else {
                        stMonedaAlternativa.load({
                            callback: function (r, option, success) {
                                if (stMonedaAlternativa.reader.jsonData.datos.length == 0) {
                                    lMask.hide();
                                    mostrarMensaje(1, scope.etiquetas.lbmsgDebeCOnfigurarMonedaAlt);
                                }
                                else {
                                    stTipoDeTasa.load({
                                        callback: function (ri, option, success) {
                                            if (stTipoDeTasa.reader.jsonData.datos.length == 0) {
                                                lMask.hide();
                                                mostrarMensaje(1, scope.etiquetas.lbmsgDebeCOnfigurarTiposDeTasa);
                                            }
                                            else {
                                                lMask.hide();
                                                winFpRegTasa(Accion);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            });
        }

        function buscartasam() {
            if ((smGestTasa.getSelected().data.venta != Ext.getCmp('nfTasaIndirecta').getValue()))
                return true;
            if ((smGestTasa.getSelected().data.compra != Ext.getCmp('nfTasaDirecta').getValue()))
                return true;
            var dt = new Date(smGestTasa.getSelected().data.desde);
            var df = new Date(Ext.getCmp('tfDesde').getValue());
            if ((dt.format("d/m/Y") != df.format("d/m/Y")))
                return true;
            var dh = new Date(smGestTasa.getSelected().data.hasta);
            var dg = new Date(Ext.getCmp('tfHasta').getValue());
            if ((dh.format("d/m/Y") != dg.format("d/m/Y")))
                return true;
            if (smGestTasa.getSelected().data.factordeconversion != Ext.getCmp('nfFactorConversion').getValue())
                return true;
            if (smGestTasa.getSelected().data.nombretasa != Ext.getCmp('tfNombreTasa').getValue())
                return true;
            if (smGestTasa.getSelected().data.referencia != tfReferencia.getValue())
                return true;
            if (smGestTasa.getSelected().data.idtipotasa != Ext.getCmp('cmbTipoTasa').getValue())
                return true;
            if (smGestTasa.getSelected().data.idmoneda != Ext.getCmp('cmbMoneda').getValue())
                return true;
            if ((smGestTasa.getSelected().data.idcliente) && (smGestTasa.getSelected().data.idcliente != Ext.getCmp('idcliente').getValue()))
                return true;
            return false;
        }

        function winFpRegTasa(opcion) {
            scope.keymap.disable();
            var enterpress = false;
            var nombre = Ext.getCmp('tfNombreTasa');
            if (!scope.keyWindow) {
                scope.keyWindow = new Ext.KeyMap(Ext.getBody(), [
                    {
                        key: Ext.EventObject.ENTER,
                        fn: function () {
                            scope.keyWindow.disable();
                            if (scope.action == 'adicionar' && Ext.getCmp('idbtnAcpetarWAdd') && !Ext.getCmp('idbtnAcpetarWAdd').disabled) {
                                Ext.getCmp('idbtnAcpetarWAdd').handler.call();
                            } else if (scope.action == 'modificar' && Ext.getCmp('idbtnAcpetarWMod') && !Ext.getCmp('idbtnAcpetarWMod').disabled) {
                                Ext.getCmp('idbtnAcpetarWMod').handler.call();
                            }
                        }
                    }
                ]);
            } else {
                scope.keyWindow.enable();
            }

            switch (opcion) {
                case 'Ins':
                {
                    scope.action = 'adicionar';
                    if (!winAddTasa) {
                        winAddTasa = new Ext.Window({
                            id: 'winAddTasa',
                            modal: true,
                            closeAction: 'hide',
                            layout: 'fit',
                            title: scope.etiquetas.lbTtlAddTasa,
                            width: 580,
                            keys: scope.keyWindow,
                            constrain: true,
                            height: 250,
                            resizable: false,
                            defaultButton: 'idbtnCancelarWAdd',
                            firstElement: nombre,
                            listeners: {
                                hide: function () {
                                    scope.keymap.enable();
                                    resetForm();
                                    btnAdicionar.focus();
                                    isWinOpenIns = false;
                                    Ext.getCmp('idbtnAcpetarWAdd').disable();
                                    Ext.getCmp('idbtnAplicarWAdd').disable();
                                },
                                show: function () { //evento al mostrarse
                                    isWinOpenIns = true;
                                }
                            },
                            buttons: [{
                                iconCls: 'cancelar',
                                id: 'idbtnCancelarWAdd',
                                text: scope.etiquetas.lbBtnCancelar,
                                tooltip: scope.etiquetas.lbTtCancelar,
                                handler: function () {
                                    winAddTasa.hide();
                                }
                            },
                                {
                                    iconCls: 'aplicar',
                                    id: 'idbtnAplicarWAdd',
                                    text: scope.etiquetas.lbBtnAplicar,
                                    disabled: true,
                                    tooltip: scope.etiquetas.lbTtAplicar,
                                    handler: function () {
                                        scope.keyWindow.disable();
                                        adicionarTasa('apl');
                                    }
                                },
                                {
                                    iconCls: 'aceptar',
                                    id: 'idbtnAcpetarWAdd',
                                    text: scope.etiquetas.lbBtnAceptar,
                                    disabled: true,
                                    tooltip: scope.etiquetas.lbTtAceptar,
                                    handler: function () {
                                        scope.keyWindow.disable();
                                        adicionarTasa();
                                    }
                                }]
                        });
                    }
                    Ext.getCmp('winAddTasa').add(Ext.getCmp('fpRegTasa'));
                    tfDesde.setDisabled(false);
                    tfHasta.setDisabled(false);
                    Ext.getCmp('tfNombreTasa').focus();
                    Ext.getCmp('winAddTasa').doLayout();
                    Ext.getCmp('winAddTasa').show();
                }
                    break;
                case 'Mod':
                {
                    if (!smGestTasa.getSelected())
                        mostrarMensaje(1, scope.etiquetas.warningModManyTasa);
                    else {
                        scope.action = 'modificar';
                        if (!winModTasa) {
                            winModTasa = new Ext.Window({
                                id: 'winModTasa',
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                constrain: true,
                                keys: scope.keyWindow,
                                defaultButton: 'idbtnCancelarWMod',
                                firstElement: nombre,
                                listeners: {
                                    hide: function () {
                                        scope.keymap.enable();
                                        resetForm();
                                        btnAdicionar.focus();
                                        Ext.getCmp('idbtnAcpetarWMod').disable();
                                        isWinOpenMod = false;
                                    },
                                    show: function () {
                                        isWinOpenMod = true;
                                    }
                                },
                                title: scope.etiquetas.lbTtlModTasa,
                                width: 580,
                                height: 250,
                                resizable: false,
                                buttons: [
                                    {
                                        iconCls: 'cancelar',
                                        text: scope.etiquetas.lbBtnCancelar,
                                        id: 'idbtnCancelarWMod',
                                        tooltip: scope.etiquetas.lbTtCancelar,
                                        handler: function () {
                                            winModTasa.hide();
                                        }
                                    },
                                    {
                                        iconCls: 'aceptar',
                                        text: scope.etiquetas.lbBtnAceptar,
                                        id: 'idbtnAcpetarWMod',
                                        disabled: true,
                                        tooltip: scope.etiquetas.lbTtAceptar,
                                        /*listeners: {
                                         enable : function(){
                                         console.log('soy valido');
                                         }
                                         },*/
                                        handler: function () {
                                            scope.keyWindow.disable();
                                            modificarTasa();
                                        }
                                    }]
                            });
                        }

                        Ext.getCmp('winModTasa').add(Ext.getCmp('fpRegTasa'));
                        Ext.getCmp('winModTasa').show();
                        Ext.getCmp('winModTasa').doLayout();


                        var record = smGestTasa.getSelected(),
                            nombrecliente = record.data.nombrecliente;
                        Ext.getCmp('fpRegTasa').getForm().loadRecord(record);
                        if (nombrecliente) {
                            cmbCliente.setRawValue(nombrecliente);
                            cmbCliente.enable();
                        }
                        Ext.getCmp('tfNombreTasa').setValue(smGestTasa.getSelected().data.nombretasa.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, ''));
                        Ext.getCmp('cmbMoneda').setValue(stTasas.getAt(stTasas.find('idmoneda', smGestTasa.getSelected().data.idmoneda)).data.idmoneda);
                        if (cmbTipoTasa.getValue() == 2) {
                            tfDesde.setDisabled(true);
                            tfHasta.setDisabled(true);
                        } else {
                            tfDesde.setDisabled(false);
                            tfHasta.setDisabled(false);
                        }

                    }
                }
                    break;
            }
        }

        function isDirtyForm(idForm, smodel, decimalPrecision) {
            var arrValuesForm = toArray(Ext.getCmp(idForm).getForm().getValues(false));
            var smodelData = smodel.getSelected().data;
            decimalPrecision = decimalPrecision || 2;
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
        }

        function limpiarEspacios(s) {
            s = s.replace(/\s+/gi, ' ');
            s = s.replace(/^\s+|\s+$/gi, '');
            return s;
        }

        function compararEspacio(ar) {
            for (var i = 0; i < ar.length; i++)
                if (ar.charAt(i) != ' ')
                    return false;
            return true;
        }

        function adicionarTasa(apl) {
            Ext.getCmp('tfNombreTasa').setValue(limpiarEspacios(Ext.getCmp('tfNombreTasa').getValue()));
            tfReferencia.setValue(limpiarEspacios(tfReferencia.getValue()));
            if (Ext.getCmp('fpRegTasa').getForm().isValid()) {
                if (compararEspacio(Ext.getCmp('tfNombreTasa').getValue())) {
                    mostrarMensaje(1, scope.etiquetas.warningTypeTasa);
                    scope.keyWindow.enable();
                } else if (contratada && (Ext.getCmp('idcliente').getValue() == null || Ext.getCmp('idcliente').getValue() == '')) {
                    mostrarMensaje(1, scope.etiquetas.warningSelCliente);
                    scope.keyWindow.enable();
                } else {
                    var params = Ext.getCmp('fpRegTasa').getForm().getValues();

                    params.hasta = tfHasta.getRawValue() != scope.etiquetas.lbSeleccionar ? tfHasta.getRawValue() : null;
                    params.desde = tfDesde.getRawValue() != scope.etiquetas.lbSeleccionar ? tfDesde.getRawValue() : null;

                    scope.onloadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbWaitMsgRegTasa);

                    Ext.Ajax.request({
                        url: 'instasa',
                        params: params,
                        callback: function (option,success, response) {
                            var response = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            switch (response.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.infoAddTasa);
                                    stTasas.reload();
                                    resetForm();
                                    if (!apl)
                                        winAddTasa.hide();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.infoExistNombTasa);
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.infoExistTasa);
                                    break;
                                default:
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    break;
                            }
                            scope.keyWindow.enable();
                        }
                    });
                }
            }
            else {
                scope.keyWindow.enable();
                mostrarMensaje(1, scope.etiquetas.infoCamposIncorrectos);
            }
        }

        function modificarTasa() {
            Ext.getCmp('tfNombreTasa').setValue(limpiarEspacios(Ext.getCmp('tfNombreTasa').getValue()));
            tfReferencia.setValue(limpiarEspacios(tfReferencia.getValue()));
            if (Ext.getCmp('fpRegTasa').getForm().isValid()) {
                if (compararEspacio(Ext.getCmp('tfNombreTasa').getValue()))
                    mostrarMensaje(1, scope.etiquetas.warningTypeTasa);
                else if (contratada && (Ext.getCmp('idcliente').getValue() == null || Ext.getCmp('idcliente').getValue() == ''))
                    mostrarMensaje(1, scope.etiquetas.warningSelCliente);
                else {
                    if (cmbTipoTasa.getValue() == 2) {
                        tfDesde.setDisabled(false);
                        tfHasta.setDisabled(false);
                    }

                    var params = Ext.getCmp('fpRegTasa').getForm().getValues();
                    params.idtasa = smGestTasa.getSelected().data.idtasa;
                    params.version =  smGestTasa.getSelected().data.version;
                    params.fechacambio = 'Today';
                    params.hasta = tfHasta.getRawValue() != scope.etiquetas.lbSeleccionar ? tfHasta.getRawValue() : null;

                    scope.onloadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbWaitMsgRegTasa);

                    Ext.Ajax.request({
                        url: 'modiftasa',
                        params: params,
                        callback: function (option,success, response) {
                            var response = Ext.decode(response.responseText);
                            Ext.MessageBox.hide();
                            switch (response.codMsg) {
                                case -1:
                                    winModTasa.hide();
                                    mostrarMensaje(1, scope.etiquetas.infoModTasa);
                                    stTasas.reload();
                                    break;
                                case -2:
                                    mostrarMensaje(1, scope.etiquetas.infoExistTasa);
                                    break;
                                default:
                                    mostrarMensaje(response.codMsg, response.mensaje);
                                    break;
                            }
                        }
                    });
                }
            }
            else {
                mostrarMensaje(1, scope.etiquetas.infoCamposIncorrectos);
            }
        }

        function Eliminar() {
            Ext.getCmp('btnAdicionarTasa').disable();
            Ext.getCmp('btnModificarTasa').disable();
            if (!smGestTasa.getSelected())
                mostrarMensaje(1, scope.etiquetas.warningDelManyTasa);
            else {
                if (smGestTasa.getSelections().length > 1)
                    mostrarMensaje(2, scope.etiquetas.promptDelManyTasa, elimina)
                else
                    mostrarMensaje(2, scope.etiquetas.promptDelOneTasa, elimina)
            }
            function elimina(btnPresionado) {
                if (btnPresionado == 'ok') {
                    var arrIdTasa = new Array();
                    if (smGestTasa.getSelections().length > 0) {
                        Ext.each(smGestTasa.getSelections(), function (item, index, allItems) {
                            arrIdTasa.push(smGestTasa.getSelections()[index].get('idtasa'));
                        });
                    } else {
                        mostrarMensaje(1, scope.etiquetas.warningDelManyTasa);
                    }

                    scope.onloadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbWaitMsgDelTasa);
                    Ext.Ajax.request({
                        url: 'elimtasa',
                        method: 'POST',
                        params: {
                            idtasa: Ext.encode(arrIdTasa)
                        },
                        callback: function (options, success, response) {
                            responseData = Ext.decode(response.responseText);
                            switch (responseData.codMsg) {
                                case -1:
                                    mostrarMensaje(1, scope.etiquetas.infoDelOneTasa);
                                    stTasas.reload();
                                    break;
                                case -2:
                                    if (arrIdTasa.length == 1)
                                        mostrarMensaje(1, scope.etiquetas.tasasEnUsoSingle);
                                    else
                                        mostrarMensaje(1, scope.etiquetas.tasasEnUso);
                                    stTasas.reload();
                                    break;
                                case -3:
                                    mostrarMensaje(1, scope.etiquetas.infoDelManyTasas);
                                    stTasas.reload();
                                    break;
                                default:
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    break;
                            }
                        }
                    });
                } else {
                    btnAdicionar.focus();
                }
                Ext.getCmp('btnAdicionarTasa').enable();
                Ext.getCmp('btnModificarTasa').enable();
            }
        }

        function buscarTasas() {
            stTasas.baseParams.start = '';
            stTasas.baseParams.limit = '';
            stTasas.baseParams.sfFiltro = sfTasas.getRawValue();
            stTasas.load();
        }

        function VerificarDatTasa() {
            Ext.Ajax.request({
                url: 'veriftasa',
                params: {
                    idtasa: smGestTasa.getSelected().data.idtasa,
                    venta: Ext.getCmp('nfTasaIndirecta').getValue(),
                    compra: Ext.getCmp('nfTasaDirecta').getValue(),
                    desde: Ext.util.Format.date(Date.parseDate(Ext.getCmp('tfDesde').getRawValue(), 'd/m/Y'), 'd/m/Y'),
                    hasta: Ext.util.Format.date(Date.parseDate(Ext.getCmp('tfHasta').getRawValue(), 'd/m/Y'), 'd/m/Y'),
                    factordeconversion: Ext.getCmp('nfFactorConversion').getValue(),
                    idmoneda: Ext.getCmp('cmbMoneda').getValue(),
                    idcliente: (Ext.getCmp('idcliente').getValue()) ? Ext.getCmp('idcliente').getValue() : '',
                    referencia: tfReferencia.getValue(),
                    nombretasa: Ext.getCmp('tfNombreTasa').getValue(),
                    idtipotasa: Ext.getCmp('cmbTipoTasa').getValue(),
                    idmonedacontable: Ext.getCmp('cmbMonedaContable').getValue()
                },
                method: 'POST',
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.retorno == -1)
                        mostrarMensaje(1, scope.etiquetas.infoNoChanges);
                    else
                        modificarTasa();
                }
            });
        }

        function changevalue() {
            var changed = false;
            var newvalue = fpRegTasa.getForm().getValues();
            var oldvalue = gpTasas.getSelectionModel().getSelected().data;
            for (k in newvalue) {
                if (newvalue[k] != oldvalue[k]) {
                    changed = true;
                    break;
                }


            }
            return changed;
        }

        function comprobarVentana() {
            if (fpRegTasa.getForm().isValid()) {
                if (isWinOpenIns) {
                    Ext.getCmp('idbtnAcpetarWAdd').enable();
                    Ext.getCmp('idbtnAplicarWAdd').enable();
                } else if (isWinOpenMod) {
                    if (smGestTasa.getSelected().data.nombretasa.replace(/\<span style\=\"background-color\: rgb\(255, 255, 0\)\;\"\>|\<\/span\>/g, '') != fpRegTasa.getForm().getValues().nombretasa
                        || stTasas.getAt(stTasas.find('idmoneda', smGestTasa.getSelected().data.idmoneda)).data.idmoneda != Ext.getCmp('cmbMoneda').getValue()
                        || smGestTasa.getSelected().data.idmonedacontable != Ext.getCmp('cmbMonedaContable').getValue()
                        || smGestTasa.getSelected().data.idtipotasa != fpRegTasa.getForm().getValues().idtipotasa
                        || smGestTasa.getSelected().data.compra != fpRegTasa.getForm().getValues().compra
                        || smGestTasa.getSelected().data.venta != fpRegTasa.getForm().getValues().venta
                        || smGestTasa.getSelected().data.factordeconversion != fpRegTasa.getForm().getValues().factordeconversion
                        || smGestTasa.getSelected().data.referencia != fpRegTasa.getForm().getValues().referencia
                        || smGestTasa.getSelected().data.desde != fpRegTasa.getForm().getValues().desde) {
                        Ext.getCmp('idbtnAcpetarWMod').enable();
                    }
                    else if (smGestTasa.getSelected().data.hasta != null && fpRegTasa.getForm().getValues().hasta != scope.etiquetas.lbSeleccionar &&
                        smGestTasa.getSelected().data.hasta != fpRegTasa.getForm().getValues().hasta) {
                        Ext.getCmp('idbtnAcpetarWMod').enable();
                    } else {
                        Ext.getCmp('idbtnAcpetarWMod').disable();
                        return;
                    }
                }
            } else {
                if (isWinOpenIns) {
                    Ext.getCmp('idbtnAcpetarWAdd').disable();
                    Ext.getCmp('idbtnAplicarWAdd').disable();
                    return;
                } else if (isWinOpenMod) {
                    Ext.getCmp('idbtnAcpetarWMod').disable();
                    return;
                }
            }
            /*if (fpRegTasa.getForm().getValues().idtipotasa == 1) {
                if (Ext.getCmp('idcliente').store.getTotalCount() == 0) {
                    if (isWinOpenIns) {
                        Ext.getCmp('idbtnAcpetarWAdd').disable();
                        Ext.getCmp('idbtnAplicarWAdd').disable();
                    } else if (isWinOpenMod) {
                        Ext.getCmp('idbtnAcpetarWMod').disable();
                    }
                    Ext.getCmp('cmbTipoTasa').markInvalid(scope.etiquetas.lbMsgNoClientesProvedores);
                } else {
                    if (fpRegTasa.getForm().isValid()) {
                        if (isWinOpenIns) {
                            Ext.getCmp('idbtnAcpetarWAdd').enable();
                            Ext.getCmp('idbtnAplicarWAdd').enable();
                        } else if (isWinOpenMod) {
                            if ((smGestTasa.getSelected().data.idcliente) && (smGestTasa.getSelected().data.idcliente != Ext.getCmp('idcliente').getValue())) {
                                Ext.getCmp('idbtnAcpetarWMod').enable();
                            } else {
                                Ext.getCmp('idbtnAcpetarWMod').disable();
                            }
                        } else {
                            if (isWinOpenIns) {
                                Ext.getCmp('idbtnAcpetarWAdd').disable();
                                Ext.getCmp('idbtnAplicarWAdd').disable();
                            } else if (isWinOpenMod) {
                                Ext.getCmp('idbtnAcpetarWMod').disable();
                            }
                        }
                    } else {
                        if (isWinOpenIns) {
                            Ext.getCmp('idbtnAcpetarWAdd').disable();
                            Ext.getCmp('idbtnAplicarWAdd').disable();
                        } else if (isWinOpenMod) {
                            Ext.getCmp('idbtnAcpetarWMod').disable();
                        }
                    }
                }
            }*/
        }

        function toArray(agObject) {
            var _Array = new Array();
            for (var name in agObject) {
                _Array[name] = agObject[name];
            }
            return _Array;
        }

        function changeSelection() {
            var selected = smGestTasa.getCount();
            if (selected == 1) {
                btnModificar.enable();
                btnEliminar.enable();
            } else if (selected > 1) {
                btnModificar.disable();
                btnEliminar.enable();
            } else {
                btnModificar.disable();
                btnEliminar.disable();
            }
        }

        function resetForm() {
            Ext.getCmp('fpRegTasa').getForm().reset();
            Ext.getCmp('tfHasta').setMinValue(null);
            Ext.getCmp('tfDesde').setMaxValue(null);
            Ext.getCmp('idcliente').setValue();
            Ext.getCmp('idcliente').disable();

            if (Ext.getCmp('idbtnAplicarWAdd')) {
                Ext.getCmp('idbtnAplicarWAdd').disable();
            }
            if (Ext.getCmp('idbtnAcpetarWAdd')) {
                Ext.getCmp('idbtnAcpetarWAdd').disable();
            }
            if (Ext.getCmp('idbtnAcpetarWMod')) {
                Ext.getCmp('idbtnAcpetarWMod').disable();
            }
        }

    },
    loadMask: function (message) {
        lMask = new Ext.LoadMask(Ext.getBody(), {
            msg: message
        });
        lMask.show();
    }
});

Ext.apply(Ext.form.VTypes, {
    daterange2: function (val, field) {
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

new Ext.ConfGnral.MultiMoneda.GestTasa();


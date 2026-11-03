Ext.namespace('Ext.Costo.Procesos.Nomencladores.Componentes.UI')
Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCNAE = Ext.extend(Ext.tree.TreePanel,
        {
            mask: undefined,
            notification: undefined,
            constructor: function(scope) {
                Ext.apply(this, {
                    layout: 'fit',
                    id: 'tp' + scope.id,
                    rootVisible: true,
                    containerScroll: true,
                    autoScroll: true,
                    ddScroll: true,
                    lines: true,
                    trackMouseOver: true,
                    bodyStyle: 'background-color:#fff;',
                    shadow: true,
                    animate: true,
                    enableDD: false,
                    loader: scope.tLoader = new Ext.tree.TreeLoader({
                        url: scope.url + scope.method
                    }),
                    root: scope.rootCCNAEOG = new Ext.tree.AsyncTreeNode({
                        text: scope.rootText,
                        draggable: false,
                        id: '0',
                        type: 0,
                        expanded: true,
                        icon: scope.perfil.dirImg + 'organigrama/empty.gif',
                        iconCls: scope.perfil.dirImg + 'organigrama/empty.gif'
                    }),
                    tbar: scope.toolbar = new Ext.Toolbar({
                        items: [scope.sfBuscar = SearchField(),
                            scope.btnReload = new Ext.Toolbar.Button({
                                id: 'btnReload',
                                iconCls: 'actualizar',
                                tooltip: scope.etiquetas.reloadTree
                            }),
                            '-',
                            scope.busquedaAvanz = new Ext.Toolbar.Button({
                                hidden: scope.hideSearch,
                                id: 'btnBuscar',
                                text: scope.etiquetas.titleBusquedaAvanzada,
                                iconCls: 'buscaravanzada',
                                tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBusquedaAvanzadaCC : scope.etiquetas.tooltipBusquedaAvanzadaNAE
                            })]
                    })
                });

                scope.menu = new Ext.menu.Menu({
                    floating: false,
                    shadow: true,
                    hideBorders: true
                });

                scope.miMarcar = new Ext.menu.Item({
                    text: scope.etiquetas.titleMarcar,
                    iconCls: 'siguiente'
                });

                scope.miDesmarcar = new Ext.menu.Item({
                    text: scope.etiquetas.titleDesmarcar,
                    iconCls: 'anterior'
                });

                scope.itemreload = new Ext.menu.Item({
                    text: scope.etiquetas.reload,
                    iconCls: 'actualizar'
                });

                function SearchField() {
                    var search = new Ext.Cont.SearchField({
                        validationEvent: true,
                        validateOnBlur: true,
                        selectOnFocus: true,
                        maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+ ?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
                        regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\[\]\*\.\;\:\#\+\,\&]*)+$/,
                        maxLength: 255,
                        lbTtlElement: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnbuscarCC : scope.etiquetas.tooltipBtnbuscarNAE
                    });
                    return search;
                }

                return Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCNAE.superclass.constructor.call(this);
            },
            // VENTANA DE BUSQUEDA AVANZADA
            createWindowsSearch: function(scope, x) {
                scope.stEstadoSearchCCNAE = new Ext.data.Store({
                    url: '/contabilidad/contabilidad_costos/configuracion/index.php/representarnomencladores/cargarEstadosAll',
                    reader: new Ext.data.JsonReader({
                        root: 'data',
                        totalProperty: 'total',
                        id: 'idestado'
                    },
                    [{
                            name: 'idestado',
                            type: 'int'
                        }, {
                            name: 'descripcion',
                            type: 'string'
                        }]),
                    sortInfo: {
                        field: 'idestado',
                        direction: 'ASC'
                    }
                });
                scope.btnCancelarSearchCCNAE = new Ext.Button({
                    id: 'btnCancelarSearchCCNAE',
                    iconCls: 'cancelar',
                    text: scope.etiquetas.lbBtnCancelarSearch,
                    tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnCancelarSearchCC : scope.etiquetas.tooltipBtnCancelarSearchNAE
                });
                scope.btnAceptarSearchCCNAE = new Ext.Button({
                    id: 'btnAceptarSearchCCNAE',
                    disabled: true,
                    iconCls: 'aceptar',
                    text: scope.etiquetas.lbBtnAceptarSearch,
                    tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnAceptarSearchCC : scope.etiquetas.tooltipBtnAceptarSearchNAE
                });
                scope.cbEstadoSearchCCNAE = new Ext.form.ComboBox({
                    store: scope.stEstadoSearchCCNAE,
                    valueField: 'idestado',
                    displayField: 'descripcion',
                    fieldLabel: scope.etiquetas.flEstado,
                    anchor: '100%',
                    emptyText: scope.etiquetas.emptyText,
                    triggerAction: 'all',
                    mode: 'local',
                    id: 'idEstadoSearchCCNAE',
                    name: 'estado',
                    readOnly: true,
                    enableKeyEvents: true
                });
                scope.tfCodigoSearchCCNAE = new Ext.form.TextField({
                    id: 'tfCodigoSearchCCNAE',
                    maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*$/,
                    regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc])*$/,
                    maxLength: scope.longitudTotal,
                    maxLengthText: scope.etiquetas.maxLengthText.replace('<#>', scope.longitudTotal),
                    name: 'codigo',
                    fieldLabel: scope.etiquetas.flCodigo,
                    anchor: '100%',
                    enableKeyEvents: true,
                    regexText: scope.etiquetas.regexText.replace('<#>', scope.longitudTotal)
                });
                scope.txaDescripcionSearchCCNAE = new Ext.form.TextArea({
                    name: 'descripcion',
                    id: 'txaDescripcionSearchCCNAE',
                    anchor: '100%',
                    maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
                    regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
                    maxLength: 255,
                    maxLengthText: scope.etiquetas.maxLengthTextDescripcion,
                    fieldLabel: scope.etiquetas.flDescripcion,
                    enableKeyEvents: true
                });

                scope.panelGestSearchCCNAE = new Ext.form.FormPanel({
                    id: 'panelGestSearchCCNAE',
                    layout: 'form',
                    labelAlign: 'top',
                    frame: true,
                    height: 200,
                    width: 300,
                    items: [scope.tfCodigoSearchCCNAE, scope.cbEstadoSearchCCNAE, scope.txaDescripcionSearchCCNAE]
                });

                scope.ventanaSearchCCNAE = new Ext.Window({
                    title: (scope.types.length > 1) ? scope.etiquetas.titleVentanaSearch : ((scope.types[0] == 1) ? scope.etiquetas.titleVentanaSearchCC : scope.etiquetas.titleVentanaSearchNAE),
                    id: 'ventanaSearchCCNAE',
                    modal: true,
                    resizable: false,
                    constrain: true,
                    defaultButton: 0,
                    layout: 'fit',
                    closeAction: 'close',
                    x: x,
                    items: [scope.panelGestSearchCCNAE],
                    buttons: [scope.btnCancelarSearchCCNAE, scope.btnAceptarSearchCCNAE]
                });
            },
            loadMask: function(msg) {
                this.mask = new Ext.LoadMask(this.body, {
                    msg: msg
                });
                this.mask.show();
            }
        });

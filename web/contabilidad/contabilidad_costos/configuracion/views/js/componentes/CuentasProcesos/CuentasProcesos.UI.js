Ext.namespace('Ext.Costo.Procesos.Configuracion.Componentes.UI')
Ext.Costo.Procesos.Configuracion.Componentes.UI.CuentasProcesos = Ext.extend(Ext.tree.TreePanel,
    {
        mask: undefined,
        notification: undefined,
        constructor: function (scope) {
            Ext.apply(this, {
                layout: 'fit',
                id: 'tpCuentasProcesos',
                rootVisible: true,
                containerScroll: true,
                frame: false,
                bodyStyle: 'background-color:#fff;',
                autoScroll: true,
                ddScroll: true,
                lines: true,
                trackMouseOver: true,
                shadow: true,
                animate: true,
                enableDD: false,
                loader: scope.tLoader = new Ext.tree.TreeLoader({
                    url: scope.url + scope.method
                }),
                root: scope.rootNode = new Ext.tree.AsyncTreeNode({
                    text: scope.etiquetas.rootText,
                    draggable: false,
                    id: '0',
                    type: 0,
                    expanded: true,
                    icon: scope.perfil.dirImg + 'organigrama/empty.gif',
                    iconCls: scope.perfil.dirImg + 'organigrama/empty.gif'
                }),
                tbar: scope.toolbar = new Ext.Toolbar({
                    items: [
                        scope.sfBuscar = SearchField()
                    ]
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
                      text: scope.etiquetas.titleMarcar,
                      iconCls: 'anterior'
            });
            scope.miEliminar = new Ext.menu.Item({
                      text: scope.etiquetas.titleDelete,
                      iconCls: 'eliminar'
            });
            scope.itemreload = new Ext.menu.Item({
                      text: scope.etiquetas.reload,
                      iconCls: 'actualizar'
            });

            function SearchField() {
                var search = new Ext.Cont.SearchField({
                    validationEvent: false,
                    validateOnBlur: false,
                    selectOnFocus: true,
                    searchTooltip: scope.etiquetas.lbsearchTooltip,
                    regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                    maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/
                })
                return search;
            }

            return Ext.Costo.Procesos.Configuracion.Componentes.UI.CuentasProcesos.superclass.constructor.call(this);
        },
        createWindows: function (scope) {
            scope.btnCancelarAddCuentas = new Ext.Button({
                id: 'btnCancelarAddCuentas',
                      iconCls: 'cancelar',
                text: perfil.etiquetas.lbbtnCancelar
            });
            scope.btnAceptarAddCuentas = new Ext.Button({
                id: 'btnAceptarAddCuentas',
                disabled: true,
                      iconCls: 'aceptar',
                text: perfil.etiquetas.lbbtnAceptar

            });

            scope.panelAddCuentas = new Ext.Panel({
                id: 'panelAddCuentas',
                layout: 'form',
                labelAlign: 'top',
                frame: true,
                height: 300,
                width: 500,
                bodyStyle: 'background-color:#fff;',
                items: [{}],
                listeners: {
                    render: function () {
                        scope.cpmCuentas = new Ext.Cont.Cuentas({
                            id: 'cpmCuentas',
                            types: [8032, 8034],
                            levels: false,
                            loadLeaf: false,
                            selectionType: 2
                        });
                        scope.cpmCuentas.on({
                            initialize: function (componentUI) {
                                componentUI.on({
                                    checkchange: function (node, checked) {
                                        if (checked) {
                                            scope.btnAceptarAddCuentas.enable();
                                        } else {
                                            var selections = scope.cpmCuentas.fGetSelections();
                                            if (selections.length == 0)
                                                scope.btnAceptarAddCuentas.disable();
                                        }
                                    }
                                });
                                componentUI.setHeight(scope.panelAddCuentas.getSize().height);
                                scope.panelAddCuentas.insert(0, componentUI);
                                scope.panelAddCuentas.doLayout(true);
                            }
                        });
                    }
                }
            });

            scope.ventanaCuentas = new Ext.Window({
                title: scope.etiquetas.titleAdd,
                id: 'ventanaSearchCCNAE',
                modal: true,
                resizable: false,
                constrain: true,
                defaultButton: 0,
                layout: 'fit',
                closeAction: 'close',
                items: [scope.panelAddCuentas],
                buttons: [scope.btnCancelarAddCuentas, scope.btnAceptarAddCuentas]
            });
        },
        loadMask: function (msg) {
            this.mask = new Ext.LoadMask(this.body, {
                msg: msg
            });
            this.mask.show();
        }
    });



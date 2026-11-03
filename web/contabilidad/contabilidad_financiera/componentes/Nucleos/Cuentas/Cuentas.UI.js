Ext.namespace('Ext.Cont.UI');
Ext.Cont.UI.Cuentas = Ext.extend(Ext.tree.TreePanel,
        {
            mask: undefined,
            notification: undefined,
            constructor: function(scope)
            {
                this.menu = new Ext.menu.Menu({
                    floating: false,
                    shadow: true,
                    hideBorders: true
                });
                Ext.applyIf(this, {
                    layout: 'fit',
                    rootVisible: true,
                    containerScroll: true,
                    frame: false,
                    autoScroll: true,
                    ddScroll: true,
                    lines: true,
                    trackMouseOver: true,
                    singleExpand: (!scope.singleExpand) ? false : true,
                    shadow: true,
                    animate: true,
                    enableDD: false,
                    loader: scope.tlCuentas = new Ext.tree.TreeLoader({
                        dataUrl: scope.url + "loadDataComponent"
                    }),
                    root: scope.rnCuentas = new Ext.tree.AsyncTreeNode({
                        text: (scope.rootText != undefined) ? scope.rootText : scope.etiquetas.rootText,
                        draggable: false,
                        id: '0',
                        type: 0,
                        expanded: true,
                        icon: scope.perfil.dirImg + 'organigrama/empty.gif',
                        iconCls: scope.perfil.dirImg + 'organigrama/empty.gif'
                    }),
                    tbar: scope.tbCuentas = new Ext.Toolbar({
                        items: [scope.sfBuscarCuentas = new Ext.Cont.SearchField({
                                validationEvent: false,
                                validateOnBlur: false,
                                selectOnFocus: true,
                                searchTooltip: 'Buscar cuentas <b>(Enter)</b>',
                                regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
                                maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/
                            })]
                    })
                });

                scope.miMarcar = new Ext.menu.Item({
                    text: scope.etiquetas.titleMarcar,
                    icon: scope.perfil.dirImg + 'siguiente.png'
                });

                scope.miDesmarcar = new Ext.menu.Item({
                    text: scope.etiquetas.titleDesmarcar,
                    icon: scope.perfil.dirImg + 'anterior.png'
                });

                return Ext.Cont.UI.Cuentas.superclass.constructor.call(this);
            },
            loadMask: function(msg)
            {
                this.mask = new Ext.LoadMask(this.body, {
                    msg: msg
                });
                this.mask.show();
            }
        });



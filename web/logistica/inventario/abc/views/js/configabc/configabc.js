Ext.ns('Ext.log.abc');
Ext.QuickTips.init();
Ext.log.abc.ConfigABC = {

    init: function (idioma, perfil) {
        var self = this;

        //this.configClasificacionABC = new Ext.log.abc.config.ClasificacionABC({perfil: perfil});

        this.treeMenu = new Ext.tree.TreePanel({
            title: idioma.lbMenuConfigABC,
            region: 'west',
            id: 'idmenuConfigABC',
            width: '20%',
            split:true,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            titleCollapse: true,
            root: new Ext.tree.TreeNode({
                text: '',
                draggable: false,
                expanded: true,
                id: 'idrootClasificacionABC'
            })
        });

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: idioma.lbClasificacionABC,
            id: '1',
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    var neededTab = self.tpConfiABC.getItem('ConfiguracionABC-'+nodo.id);
                    if (neededTab) {
                        self.tpConfiABC.activate(neededTab);
                    } else {
                        self.tpConfiABC.add(new Ext.log.abc.config.ClasificacionABC({perfil: perfil})).show();
                    }
                }
            }
        }));

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: idioma.lbDefinicionPeso,
            id: '2',
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    var neededTab = self.tpConfiABC.getItem('DefinicionPeso-'+nodo.id);
                    if (neededTab) {
                        self.tpConfiABC.activate(neededTab);
                    } else {
                        self.tpConfiABC.add(new Ext.log.abc.config.DefinicionPeso({perfil: perfil, idioma: idioma})).show();
                    }
                }
            }
        }));

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: idioma.lbPeriodosClasificacionABC,
            id: '3',
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    var neededTab = self.tpConfiABC.getItem('PeriodosClasificacionABC-'+nodo.id);
                    if (neededTab) {
                        self.tpConfiABC.activate(neededTab);
                    } else {
                        self.tpConfiABC.add(new Ext.log.abc.config.PeriodosClasificacionABC({perfil: perfil, idioma: idioma})).show();
                    }
                }
            }
        }));

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: idioma.lbParametros,
            id: '4',
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    var neededTab = self.tpConfiABC.getItem('ParametrosInventario-'+nodo.id);
                    if (neededTab) {
                        self.tpConfiABC.activate(neededTab);
                    } else {
                        self.tpConfiABC.add(new Ext.log.abc.config.Parametros({perfil: perfil, idioma: idioma})).show();
                    }
                }
            }
        }));

        this.treeMenu.getRootNode().appendChild(new Ext.tree.TreeNode({
            text: 'Dep&oacute;sitos a parametrizar',
            id: '5',
            iconCls: 'historial',
            listeners: {
                'click': function (nodo, evento) {
                    var neededTab = self.tpConfiABC.getItem('DepositosParametrizarTAB-'+nodo.id);
                    if (neededTab) {
                        self.tpConfiABC.activate(neededTab);
                    } else {
                        self.tpConfiABC.add(new Ext.log.abc.config.DepositosParametrizar({perfil: perfil, idioma: idioma})).show();
                    }
                }
            }
        }));

        this.tpConfiABC = new Ext.TabPanel({
            id: 'idtabpanelconfigABC',
            region: 'center',
            enableTabScroll: true,
            defaults: {
                autoScroll: true
            },
            resizeTabs: true,
            width: '80%',
            split:true,
            minTabWidth: 115,
            tabWidth: 320,
            resizeTabs: true,
            frame: true,
            activeTab: 0,
            layoutOnTabChange: true,
        });


        new Ext.Viewport({
            layout: 'border',
            items: [this.treeMenu,this.tpConfiABC]
        });
    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('configabc', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    var interfaz = Ext.log.abc.ConfigABC;
    interfaz.init(idioma, perfil);

});

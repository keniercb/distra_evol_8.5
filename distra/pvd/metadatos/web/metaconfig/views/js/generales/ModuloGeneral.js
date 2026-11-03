Ext.QuickTips.init();
Ext.ns('Configuracion.general');
Configuracion.general.panel = Ext.extend(Ext.Panel, {
    title: etiquetas.general.lbGenerales,
    border: false,
    layout: 'fit',
    viewport: null,
    ajustar: function (id) {
        Ext.getCmp(id).doLayout();
    },
    getPanelGestion: function () {
        return this.panelesGestion;
    },
    initComponent: function () {
        var _this = this;

        _this.panelRestricciones = new Configuracion.restricciones.Panel({
            viewport: _this.viewport,
            contenedor: _this.panelesGestion
        });

        _this.panelesGestion = new Ext.Panel({
            border: false,
            disabled: false,
            layout: 'fit',
            items: [_this.panelRestricciones
            ]
        });

        _this.configuraciones = new Array();
        _this.configuraciones.push(_this.panelRestricciones.getNode());


        _this.rootNode = new Ext.tree.AsyncTreeNode({
            text: etiquetas.general.lbConfiguraciones,
            expanded: true,
            children: _this.configuraciones
        });

        _this.treeConfiguraciones = new Ext.tree.TreePanel({
            loader: new Ext.tree.TreeLoader(),
            autoScroll: true,
            border: false,
            rootVisible: true,
            root: _this.rootNode,
            listeners: {
                click: function (node) {
                    var id = node.id;
                    switch (id) {
                        case 'restricciones':
                            _this.panelRestricciones.show();
                            break;
                    }
                    _this.ajustar(_this.viewport.id);
                }
            }
        });

        Ext.apply(this, {
            iconCls: 'general',
            id: 'configGeneral',
            bodyStyle: { maxHeight: '120px' },
            items: [_this.treeConfiguraciones]
        })
        Configuracion.general.panel.superclass.initComponent.apply(this)
    }
});
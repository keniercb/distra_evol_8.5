Ext.QuickTips.init();
Ext.ns('Configuracion.conceptos');
Configuracion.conceptos.panel = Ext.extend(Ext.Panel, {
    title: etiquetas.general.lbConceptos,
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

        _this.panelesGestion = new Ext.Panel({
            border: false,
            disabled: false,
            layout: 'fit'
        });

        _this.panelConceptos = new Configuracion.conceptos.Gestion({
            viewport: _this.viewport,
            contenedor: _this.panelesGestion
        });

        _this.panelesGestion.add(_this.panelConceptos);

        _this.loaderConceptos = new Ext.tree.TreeLoader({
            dataUrl: 'mostrarConceptos',
            baseParams: {
                idfuncionalidad: window.parent.idFuncionalidad
            }
        });

        _this.treeConceptos = new Ext.tree.TreePanel({
            id: 'treepanel',
            autoScroll: true,
            border: false,
            enableDrag: true,
            ddGroup: 'tree2grid',
            loader: _this.loaderConceptos,
            root: new Ext.tree.AsyncTreeNode({
                text: etiquetas.configuracion.lbConceptos,
                id: 'conceptos',
                expanded: true
            }),
            rootVisible: true,
            viewConfig: {
                listeners: {
                    render: function (tree) {
                        new Ext.dd.DropTarget(tree.el, {
                            ddGroup: 'gridtotree',
                            copy: false,
                            notifyDrop: function (dragSource, event, data) {
                                var idFrom = data.records[0].data.name;
                                var node = _this.tree.getRootNode();
                                node.appendChild({
                                    'text': idFrom,
                                    'children': []
                                });
                            }
                        });
                    }
                }
            },
            listeners: {
                click: function (node) {
                    _this.panelConceptos.stIcono.load();
                    if (!node.isRoot) {
                        _this.miRecord = {
                            denominacion: node.attributes.denominacion,
                            idicono: node.attributes.idicono,
                            identificador: node.attributes.idconcepto,
                            orden: node.attributes.orden,
                            grafica: (node.attributes.grafica == 1) ? true : false,
                            nombre_imagen: node.attributes.nombre_imagen
                        }
                        _this.panelConceptos.setRecord(_this.miRecord);
                        _this.panelConceptos.activar(node);
                    } else {
                        _this.panelConceptos.disable();
                    }
                },
                startdrag: function (tree, node) {
                    _this.panelConceptos.startDragConceptos(node);
                },
                enddrag: function () {
                    _this.panelConceptos.endDragConceptos();
                },
                remove: function () {
                    return false;
                }
            }
        });


        Ext.apply(this, {
            iconCls: 'metaconfig',
            id: 'configConceptos',
            bodyStyle: { maxHeight: '230px' },
            items: [_this.treeConceptos]
        })
        Configuracion.conceptos.panel.superclass.initComponent.apply(this)
    }
});
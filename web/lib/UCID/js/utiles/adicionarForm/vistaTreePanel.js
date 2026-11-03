/**
 * Created by root on 30/01/15.
 */
Ext.ns("cein.views");

cein.views.VistatreePanel = Ext.extend(Ext.Window, {
    constructor: function (config) {
        var me = this;
        config = config || {};
        me.urlcargarSistTree = config.urlcargarSistTree;

        this.btnAceptar1 = new Ext.Button({
            text: "Aceptar",
            //name: "btnAceptar",
            //id: "btnAceptar",
            xtype: "button",
            disabled: true,
            propOwnerCt: "buttons",
            tooltip: "Guardar datos y cerrar ventana <b>(Enter)</b>",
            formBind: true,
            iconCls: "aceptar",
            listeners: {
                click: this.on_btnAceptar_click,
                scope: this
            }
        });

        this.btnCancelar1 = new Ext.Button({
            text: "Cancelar",
            //name: "btnCancelar",
            xtype: "button",
            propOwnerCt: "buttons",
            handler: null,
            tooltip: "Cerrar ventana sin guardar los datos <b>(Alt+X)</b>",
            iconCls: "cancelar",
            listeners: {
                click: this.on_btnCancelar_click,
                scope: this
            }
        });

        this.arbolAccLoader = new Ext.tree.TreeLoader({
            dataUrl: me.urlcargarSistTree,
            checked: true,
            listeners: {
                'beforeload': function (atreeloader, anode) {
                    // console.log(me.urlcargarSistTree);
                    iddominio = anode.attributes.iddominio;
                    atreeloader.baseParams = {};
                    atreeloader.baseParams.iddominio = iddominio;

                    if (anode.attributes.idfuncionalidad)
                        atreeloader.baseParams.idfuncionalidad = anode.attributes.idfuncionalidad;
                    else if (anode.attributes.idsistema)
                        atreeloader.baseParams.idsistema = anode.attributes.idsistema;
                }
            }
        });

        this.arbolAcc = new Ext.tree.TreePanel({
            frame: true,
            id: 'arbolAcc',
            border: false,
            autoScroll: true,
            height: 430,
            //collapsed: false,
            split: true,
            width: '100%',
            loader: this.arbolAccLoader,
            listeners: {
                beforeclick: function (node, e) {
                    if (node.leaf) {
                        me.btnAceptar1.setDisabled(false);
                    }
                    else {
                        me.btnAceptar1.setDisabled(true);
                    }
                },
                render: function (th) {
                    th.root.expand();
                }
            }
        });

        ////------------ Crear nodo padre del arbol ------------////
        this.padreArbolAcc = new Ext.tree.AsyncTreeNode({
            text: 'Sistemas',
            expandable: false,
            id: '0',
            listeners: {
                select: function () {

                },
                scope: this
            }
        });

        this.arbolAcc.setRootNode(this.padreArbolAcc);

        Ext.apply(config, {
            title: "Árbol del sistema",
            id: 'winCpVentana1',
            modal: true,
            autoScroll: true,
            width: 400,
            closeAction: 'hide',
            border: false,
            height: 500,
            xtype: "panel",
            name: "WintreePanel",
            resizable: false,
            buttons: [
                this.btnCancelar1,
                this.btnAceptar1
            ],
            items: [{items: [this.arbolAcc]}],
            keys: [
                {
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    handler: function () {
                        me.destroy();
                    }
                },
                {
                    key: Ext.EventObject.ENTER,
                    handler: function () {
                        var camino = me.construirCamino(me.arbolAcc.getSelectionModel().selNode);
                        Ext.getCmp('fieldSubsistema').setValue(camino);
                        me.destroy();
                    }
                }
            ],
            listeners: {}
        });
        cein.views.VistatreePanel.superclass.constructor.call(this, config);
    },

    onRender: function () {
        //TODO: Pre-render
        cein.views.VistatreePanel.superclass.onRender.apply(this, arguments);
        //TODO: Pos-render
    },

    onDestroy: function () {
        //TODO: Pre-destroy
        cein.views.VistatreePanel.superclass.onDestroy.call(this);
    },

    construirCamino: function (node) {
        if (node.parentNode.text == "Sistemas")
            return node.text;
        else
            return this.construirCamino(node.parentNode) + '/' + node.text;
    },

    on_btnAceptar_click: function () {
        //console.log(this.arbolAcc.getSelectionModel());
        var camino = this.construirCamino(this.arbolAcc.getSelectionModel().selNode);
        Ext.getCmp('fieldSubsistema').setValue(camino);
        this.destroy();
    },
    on_btnCancelar_click: function (butto) {
        this.destroy();
    }
});

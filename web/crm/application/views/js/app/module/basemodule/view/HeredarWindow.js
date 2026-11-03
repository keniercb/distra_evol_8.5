Ext.define('BaseModule.view.HeredarWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.heredarwindow',
    autoCreateForm: true,
    trackResetOnLoad: true,
    layout: 'fit',
    width: 450,
    idproceso: false,
    title:'Heredar tipos de contrato',
    initComponent: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        var tree = Ext.create('Ext.tree.Panel', {
            itemId: 'tree_estructura',
            height: 250,
            margin: '0 0 10 0',
            rootVisible: true,
            frame: false,
            autoScroll: true,
            cls: 'crm-icon-tree',
            store: Ext.create('Ext.data.TreeStore', {
                proxy: {
                    type: 'ajax',
                    url: UtilsFn.buildUrl({action: 'getEstructuras'}, ModuleMgr.get('Nomencladores')),
                    reader: {
                        type: 'json',
                        totalProperty: 'total',
                        successProperty: 'success'
                    },

                },
                root: {
                    text: 'Dominio de entidades',
                    id: '0',
                    expanded: true
                },
            })
        });
        tree.getSelectionModel().on('selectionchange', function () {
            me.btnAceptar.setDisabled(!me.checkValidez());
        });

        me.items = [
            {
                xtype: 'form',
                itemId: 'form_heredar',
                frame: true,
                items: [
                    tree
                    ,
                    Ext.create('Ext.form.field.Hidden', {
                        context: 'nomencladoresproceso',
                        itemId: 'idproceso'
                    }),
                    Ext.create('Ext.ux.CmbSelectField', {
                        fieldLabel: me.etiquetas.lbprocesos,
                        labelAlign: 'top',
                        name: 'nombreproceso',
                        mapping: 'NomProceso.denominacion',
                        realColumn: 'NomProceso.denominacion',
                        localId: 'idproceso',
                        module: 'Nomencladores',
                        allowBlank: !me.idproceso,
                        hidden: !me.idproceso,
                        gen: 'm',
                        filters: {},
                        context: 'nomencladoresproceso',
                        flex: 1,
                        anchor: '100%',
                        multiSelect: true,
                        listeners: {
                            select: function (yo, records) {
                                resultado = '';
                                if (records.length > 0) {
                                    records.forEach(function (x) {
                                        resultado += x.data.idproceso + ' ';
                                    });
                                }
                                me.down('#idproceso').setRawValue(resultado);
                                me.btnAceptar.setDisabled(!me.checkValidez());
                            }
                        }
                    })
                ]
            }
        ];
        this.callParent();
    },
    checkValidez: function () {
        var yo = this;
        if (yo.down('#tree_estructura').getSelectionModel().getSelection().length == 1 && !yo.down('form').hasInvalidField()) {
            return true;
        }
        return false;
    }
});
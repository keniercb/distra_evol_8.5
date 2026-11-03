Ext.define('ConfContratacion.view.ConfComiteGeneral', {
    extend: 'Ext.form.Panel',
    // extend: 'Ext.grid.Panel',
    alias: 'widget.confcomitegeneral',
    frame: true,
    border: false,
    layout: 'fit',
    selType:'checkboxmodel',
    autoScroll: true,

    requires: [
        'ConfContratacion.view.TrasitionPanel'
    ],

    initComponent: function () {
        var me = this;
        this.getLang();
        this.title='Configuraci&oacute;n de comit&eacute;';
        this.store=Ext.create('Ext.data.Store',{
            fields:[
                'idcomitegeneral', 'nombre', 'idproceso',
                'proceso', 'pordefecto', 'descripcion'
            ],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'getConfComite'}, ModuleMgr.get('ConfContratacion')),
                actionMethods: {
                    read: 'POST'
                },
                reader: {
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                }
            }
        }).load();

        this.btnAdd = Ext.create('Ext.Button', {
            action: 'add',
            iconCls: 'adicionar',
            text: this.etiquetas.lbBtnAdd,
            tooltip: this.etiquetas.qtipAdd.get(this.etiquetas.lbComite),
            keyMap: {
                key: 'i',
                alt: true,
                event: 'click'
            }
        });


        this.btnEdit = Ext.create('Ext.Button', {
            iconCls: 'modificar',
            action: 'edit',
            disabled: true,
            text: this.etiquetas.lbBtnMod,
            tooltip: this.etiquetas.qtipMod.get(this.etiquetas.lbComite),
            keyMap: {
                key: 'm',
                alt: true,
                event: 'click'
            }
        });

        this.btnDel = Ext.create('Ext.Button', {
            iconCls: 'eliminar',
            action: 'del',
            disabled: true,
            text: this.etiquetas.lbBtnDel,
            tooltip: this.etiquetas.qtipDel.get(this.etiquetas.lbComite),
            keyMap: {
                key: Ext.EventObject.DELETE,
                event: 'click'
            }
        });

        this.columns=[
            {text:me.etiquetas.lbName, dataIndex:'nombre', flex:1},
            {
                text:me.etiquetas.lbInicial, dataIndex:'pordefecto', width:50,
                renderer: function(value, metaData, records){
                    return value=='1'?'Si':'No';
                }
            },
        ];

        // this.tbar=[
        //     this.btnAdd,
        //     this.btnEdit,
        //     this.btnDel
        // ],

        // this.dockedItems= [
        //     {
        //         xtype: 'pagingtoolbar',
        //         store: this.store,
        //         dock: 'bottom',
        //         pageNumb: true,
        //         displayInfo: true
        //     }
        // ];

        this.grid = Ext.create('Ext.grid.Panel',{
            alias:'widget.gridcomitegeneral',
            itemId:'gridcomitegeneral',
            tbar:[
                this.btnAdd,
                this.btnEdit,
                this.btnDel
            ],
            store: this.store,
            columns: this.columns,
            dockedItems: [
                {
                    xtype: 'pagingtoolbar',
                    store: this.store,
                    dock: 'bottom',
                    pageNumb: true,
                    displayInfo: true
                }
            ]
        });

        this.items = [this.grid];

        // this.btnSave = Ext.create('Ext.Button',{
        //     text: this.etiquetas.lbSave,
        //     tooltip: this.etiquetas.qtipApply,
        //     iconCls: 'guardar',
        //     disabled: true,
        //     action: 'save'
        // });
        //
        // this.btnCancel = Ext.create('Ext.Button',{
        //     text: this.etiquetas.lbBtnCancel,
        //     tooltip: this.etiquetas.qtipCancel,
        //     iconCls: 'cancelar',
        //     action: 'cancel'
        // });
        //
        // this.buttons = [this.btnCancel,this.btnSave];

        this.callParent();
    }
});

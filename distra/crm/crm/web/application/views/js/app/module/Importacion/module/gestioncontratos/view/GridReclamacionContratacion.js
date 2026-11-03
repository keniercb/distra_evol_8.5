Ext.define('GestionContratoImportacion.view.GridReclamacionContratacion', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridreclamacioncontratacionimportacion',
    region: 'center',
    layout:'fit',

    initComponent: function () {
        var me = this;

        me.etiquetas = LangMgr.getLang(me);
        me.store = Ext.create('Ext.data.Store', {
            storeId: 'stReclamacionImportacion',
            remoteSort: true,
            autoLoad: true,
            pageSize: 25,
            fields: ['linea', 'cliente', 'estado','idestado', 'iconoestado', 'proveedor', 'nombre','numero',  'tiporeclamacion',
               'cliente', 'proveedor', 'linea','tipolinea','contrato','motivo','pretension','fundamentacionlegal', 'fecha', 'denominacion',
            'cantidad', 'idreclamacion'],
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'reclamacion'}, ModuleMgr.get('GestionContratoImportacion')),
                actionMethods: {
                    read: 'POST'
                },
                extraParams: {
                    idcontrato: me.idcontrato
                },
                reader: {
                    root: 'datos',
                    totalProperty: 'cant',
                    successProperty: 'success'
                }
            }
        });
        me.columns = [
            {
                text: me.etiquetas.lbNumeroReclamacion,
                sortable: false,
                dataIndex: 'numero',
                locked: true,
                minWidth: 70,
                width: 110,
            }, {
                text: me.etiquetas.lbNombre,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 200,
                dataIndex: 'nombre',
            },
            {
                text: me.etiquetas.lbCliente,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 232,
                dataIndex: 'cliente',
            },
            {
                text: me.etiquetas.lbProveedor,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 220,
                dataIndex: 'proveedor',
            },
            {
                text: me.etiquetas.lbTipoReclamacion,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 150,
                dataIndex: 'tiporeclamacion',
            },
            {
                text: me.etiquetas.lbLinea,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 150,
                dataIndex: 'linea',
            },
            {
                text: me.etiquetas.lbEstado,
                sortable: false,
                locked: true,
                width: 80,
                minWidth: 150,
                dataIndex: 'estado',
                renderer: function (value, meta) {
                    meta.innerCls = "icondistra-" + meta.record.data.iconoestado;
                    meta.tdAttr = 'data-qtip="' + value + '"';
                    return value;
                }
            },
        ];
        me.dockedItems = [
            {
                xtype: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                pageNumb: true,
                displayInfo: true
            }
        ];
        me.frame = false;
        me.margin = false;
        me.border = false;
        me.enableLocking = true;

        me.createToolbar();
        me.callParent();

    },
    createToolbar: function () {
        this.btnDetalles = Ext.create('Ext.Button', {
            iconCls: 'detalles',
            action: 'detallereclamacion',
            selector: 'detallesReclamacion',
            disabled: true,
            text: this.etiquetas.lbBtnDetail,
            tooltip: this.etiquetas.qtipDetail
        });

        this.tbar = [this.btnDetalles];
    }
});

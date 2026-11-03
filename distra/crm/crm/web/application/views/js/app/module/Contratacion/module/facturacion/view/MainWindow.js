Ext.define('Facturacion.view.MainWindow', {
    extend: 'Ext.ux.CustomWindow',
    alias: 'widget.fac_mainwindow',

    autoScroll: false,
    maximizable: true,
    width: 1000,
    height: 470,
    layout: 'border',
    initComponent: function () {
        this.createInitialConfig();
        this.refhelp = '';
        this.callParent();
    },
    createInitialConfig: function () {
        var me = this;

        this.etiquetas = LangMgr.getLang(this);

        this.form = this.createForm();

        this.hitosgrid = Ext.create('Facturacion.view.HitoGrid');

        this.prodservgrid = Ext.create('Facturacion.view.ProductoGrid');

        this.tabpanel = Ext.create('Ext.tab.Panel', {
            region:'center',
            border: false,
            items: [this.hitosgrid, this.prodservgrid]
        });

        this.items = [this.tabpanel];

    },

    createForm: function () {

    },
    createProdServGrid: function () {

    },
    createHitosGrid: function () {

    }
});


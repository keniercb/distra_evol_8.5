Ext.define('BaseModule.view.ElementTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.elementtree',
    rootVisible: false,
    flex: 1,
    // border: false,
    height: 350,
    multiSelect:true,
    root: {
        denominacion: 'Elementos',
        id: 'root',
        expanded: true
    },
    initComponent: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);
        this.columns = [
            // Ext.create('Ext.tree.Column', {
            {   xtype:'treecolumn',
                text: this.etiquetas.lbdenominacion || 'Denominaci&oacute;n',
                dataIndex: 'denominacion',
                flex: 1
            }
            // )
            , {
                text: me.etiquetas.lbdescripcion || 'Descripci&oacute;n',
                dataIndex: 'descripcion',
                flex: 2
            }
        ];

        this.store = this.createStore(me.tipocontrato);
        // Ext.define('elemento', {
        //     extend: 'Ext.data.Model',
        //     fields: [
        //         {name: 'idelemento', type: 'string'},
        //         {name: 'denominacion', type: 'string'},
        //         {name: 'descripcion', type: 'string'},
        //         {name: 'idpadre', type: 'string'},
        //         {name: 'xtype', type: 'mextype'},
        //         {name: 'tipo', type: 'tipo'}
        //     ],
        // });
        // this.store=Ext.create('Ext.data.TreeStore', {
        //     proxy: {
        //         type: 'ajax',
        //         url: UtilsFn.buildUrl({action: 'cargarelementocontrato'}, ModuleMgr.get('TipoContrato'))
        //     },
        //     model: 'elemento',
        //     // autoLoad: false
        // });
        this.callParent();
    },
    createStore: function (tipocontrato) {
        Ext.define('elemento', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idelemento', type: 'string'},
                {name: 'denominacion', type: 'string'},
                {name: 'descripcion', type: 'string'},
                {name: 'idpadre', type: 'string'},
                {name: 'xtype', type: 'mextype'},
                {name: 'tipo', type: 'tipo'}
            ],

        });

        return Ext.create('Ext.data.TreeStore', {
            clearOnLoad:true,
            proxy: {
                type: 'ajax',
                url: UtilsFn.buildUrl({action: 'cargarelementocontrato'}, ModuleMgr.get('TipoContrato')),
                extraParams:{idTipoContrato:tipocontrato}
                // reader: {
                //     type: 'json',
                //     successProperty: 'success'
                // },
            },
            // root: {
            //     text: 'Elementos',
            //     expanded: true
            // },
            model: 'elemento',
            // fields:[
            //     {name: 'idelemento', type: 'string'},
            //     {name: 'denominacion', type: 'string'},
            //     {name: 'descripcion', type: 'string'},
            //     {name: 'idpadre', type: 'string'},
            //     {name: 'xtype', type: 'mextype'},
            //     {name: 'tipo', type: 'tipo'}
            // ],
            // listeners:{
            //     beforeload: function(yo){
            //
            //         console.log('before', yo.isLoading())
            //         if(yo.isLoading()){
            //             if(this.loadmask)this.loadmask.hide();
            //             return false;
            //         }
            //     }
            // }
            // autoLoad: false
        });
    }
});
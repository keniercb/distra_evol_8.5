Ext.define('ClientContract.store.Browsers', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    model: 'ClientContract.model.Browsers',
    proxy: {
        type: 'ajax',
        url: './data/browsers.php',
        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    storeId: 'stock.clientcontract.browsers'

    /**
     *
     autoLoad: true,
     remoteSort: true,
     pageSize: 10,
     proxy: {
        type: 'ajax',
        url: UtilsFn.buildUrl({action: 'getCliente'}, ModuleMgr.get('GestionCampanna')),
        actionMethods: {
            read: 'POST'
        },
        reader: {
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success'
        }
    }
     *
     */
});

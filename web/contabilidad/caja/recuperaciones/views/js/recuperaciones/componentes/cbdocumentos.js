Ext.namespace('Caja.Reportes.CbDocumentos');
Caja.Reportes.CbDocumentos = function (storeListeners)
{
    var cbxDocumentos = new Ext.CONT.UIXCombo({
        emptyText: 'Seleccione...',
        allowBlank: true,
        fieldLabel: 'No. Documento',
        tabIndex: 7
    }, {
        identificador: 'Documentos',
        displayText: 'numero',
        url: 'cargarDocumentos',
        singleSelect: false,
        reader: new Ext.data.JsonReader({
            id: 'idDoc',
            root: 'datos'
        }, [{
            name: '_parent'
        }, {
            name: '_is_leaf'
        }, {
            name: 'text',
            mapping: 'numero'
        }, {
            name: 'codigo',
            mapping: 'numero'
        }, {
            name: 'id',
            mapping: 'idDoc'
        }])
    });

    var lis = Ext.apply({
        beforeload: function (store, options) {
            //scope.busyRequest.documentos = true;
        }
    }, storeListeners);

    Ext.getCmp('gpDocumentos').getStore().on(lis);

    cbxDocumentos.on({
        change: function (field, newValue, oldValue) {
        },
        select: function (field, record, index) {
            // view.btnAceptar.setDisabled(false);
        }
    });
    return cbxDocumentos;
};
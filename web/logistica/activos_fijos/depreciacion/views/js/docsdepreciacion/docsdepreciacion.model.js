Ext.ns('LOG.aft.docsdepreciacion');
LOG.aft.docsdepreciacion.Model = Ext.extend(LOG.util.Model , {
    urlController :undefined,
    constructor: function(config) {
        this.urlAccionRevertir = 'revertirDepreciacion';
        LOG.aft.docsdepreciacion.Model.superclass.constructor.call(this,config);
    },    
    revertirUltimaDepreciacion: function (store, iddocumento) {
        var _this = this;



        Ext.MessageBox.wait('Revirtiendo depreciación', _this.idioma.msgEspere || '...');

        Ext.Ajax.request({
            timeout: '3000000',
            url: this.urlAccionRevertir,
            method: 'POST',
            params: {
                iddocumento: iddocumento
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var rd = Ext.decode(response.responseText);
                
                if (rd.codigoMsg == 1) {
                    Ext.getBody().unmask();
                    mostrarMensaje(2, "La última depreciación fue revertida satisfactoriamente.");
                    store.load();
                }else if(rd.codigoMsg == 2){
                    Ext.MessageBox.show({
                        title: rd.titleMessage,
                        msg: rd.message, 
                        buttons: Ext.MessageBox.OK, 
                        icon: Ext.MessageBox.WARNING 
                    });
                }else if(rd.codigoMsg == 3) {
                    mostrarMensaje(3, rd.errorMessage);
                }
                Ext.getBody().unmask();
            }
        });
      },
});
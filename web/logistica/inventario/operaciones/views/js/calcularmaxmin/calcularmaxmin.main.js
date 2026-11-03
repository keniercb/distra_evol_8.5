
Ext.ns('LOG.inv.operaciones');
Ext.MessageBox.wait(LOG.inv.operaciones.calcularmaxmin.Idioma.msgDatosIniciales, LOG.inv.operaciones.calcularmaxmin.Idioma.msgEspere || '...');
Ext.Ajax.request({
    url: ' cargarDatosIniciales',
    method: 'POST',
    callback: function (options, success, response) {
        Ext.MessageBox.hide();
        var resp = Ext.decode(response.responseText);
        var winMaxMin = new LOG.inv.operaciones.calcularmaxmin.View({
            cargainicial: resp.datos
        });
        winMaxMin.init();
        winMaxMin.view();
    }

});





perfil.etiquetas = Object();
var wnModelosFD;
listarFuentes = function () {

    loaderFD = new Ext.tree.TreeLoader({
        dataUrl: '../gestplanes/listarPlanModeloDeUnTipoModelo',
        listeners: {
            beforeload: function (tl, n) {
                this.baseParams = {tipo: n.attributes.tipo,
                    idmodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idmodelo,
                    idtipomodelo: tpBasePlan.getSelectionModel().getSelectedNode().attributes.idtipomodelo};
            }
        }
    });

    tpFD = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        height: 200,
        region: 'center',
        border: false,
        listeners: {click: function (n, e) {

            }},
        loader: loaderFD,
        root: new Ext.tree.AsyncTreeNode({
            text: perfil.etiquetas.titPlanes,
            tipo: 0,
            expanded: true,
            id: '0'
        })
    });
    var btnAcpModelosFD = new Ext.Button({
        //icon: perfil.dirImg + 'aceptar.png',
        tooltip: 'Aceptar(Enter)',
        iconCls: 'aceptar',
        //disabled:true,
        text: perfil.etiquetas.lbBtnAceptar,
        handler: function () {
            cargarFuenteDatos('none', 1);
        }
    });
    var btnCanModelosFD = new Ext.Button({
        // icon: perfil.dirImg + 'cancelar.png',
        tooltip: 'Cancelar(Alt+X)',
        iconCls: 'cancelar',
        disabled: false,
        text: perfil.etiquetas.lbBtnCancelar,
        handler: function () {
            wnModelosFD.destroy();
        }
    });
    wnModelosFD = new Ext.Window({
        resizable: false,
        title: perfil.etiquetas.msgGestionar,
        layout: 'border',
        constrain: true,
        width: 300,
        modal: true,
        closeAction: 'destroy',
        height: 300,
        items: [tpFD],
        buttons: [btnCanModelosFD, btnAcpModelosFD]
    });
    wnModelosFD.show();

}

function cargarFuenteDatos(btn, valida)
{
    nodo = tpFD.getSelectionModel().getSelectedNode();
    if (btn == 'ok' || btn == 'none')
        Ext.Ajax.request({
            url: 'ImportarFuenteDatos',
            params: {iddestino: treesel, idfuente: nodo.attributes.id, elemento: 1, validar: (btn == 'ok') ? 0 : 1},
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 21) {
                    mostrarMensaje(2, perfil.etiquetas.msgConfirmar, cargarFuenteDatos);
                } else if (responseData.codMsg == 1) {
                    mostrarMensaje(1, perfil.etiquetas.msgCorrecto, function () {
                        gpModelo.getStore().reload();
                    });
                    wnModelosFD.destroy();
                }
            }
        });
}


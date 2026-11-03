/**
 * Created by lily on 11/02/15.
 */

Ext.define('Conf.view.gestsist.VentanaReferencia', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaReferencia',

    initComponent: function() {
        //this.title = 'Referencia';
        this.layout = 'fit';
        this.height = 400;
        this.width = 300;
        this.modal = true;
        this.resizable = true;
        this.constrain = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winReferencia';
        //this.frame = true;
        //this.items = this.arbolReferencia,
        this.buttons = [{
            iconCls: 'cancelar',
            id: 'cancelar',
            nextTab: 'aceptar',
            //prevTab: '',
            text: perfil.etiquetas.cancelar,//'Cancelar',
            tooltip:perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
            action:'closeWinRef'
            },{
            disabled: true,
            iconCls: 'aceptar',
            id:'aceptar',
            //nextTab: '',
            prevTab: 'cancelar',
            text: perfil.etiquetas.aceptar,//'Aceptar',
            tooltip:perfil.etiquetas.toolTipaceptar,//'Guardar datos y cerrar ventana',
            action: 'closeWin'
            }
        ];

        this.callParent(arguments);
    }

});

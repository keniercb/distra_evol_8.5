/**
 * Created by lilianne on 28/01/15.
 */

Ext.define('Conf.view.gestsist.panelDerecho', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelDerecho',

    initComponent: function() {
        this.myformularioPanel = Ext.widget('formularioPanel');
        this.gridEditor = Ext.widget('panelGrid');
        this.border = false;
        this.id = 'panelderecho';
        this.name = 'panelderecho';
        this.region = 'center';
        this.layout = 'border';
        this.items = [
            this.myformularioPanel,
            this.gridEditor
        ];
        this.tbar = [
            {
                disabled: true,
                text: perfil.etiquetas.guardartext,
                id: 'btnGuardar',
                tooltip: perfil.etiquetas.guardar,//'Guardar',
                nextTab: 'btnAyuda',
                prevTab: 'btnLimpiarTreeDerecho',
                iconCls: 'guardar',
                action: 'guardarcambios'
            },'->',{
                text: 'Ayuda',
                iconCls: "ayuda",
                tooltip : 'Ayuda',
                name: 'btnAyuda',
                id: 'btnAyuda',
                nextTab: 'addAccion',
                prevTab: 'btnGuardar'
            }
        ];

        this.callParent(arguments);
    }
});

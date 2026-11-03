/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.FmpeirTabPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    layout: 'border',
    region: 'center',
    border: false,
    initComponent: function() {
        var me = this;
        me.idproyecto = (me.idproyecto) ? me.idproyecto : false;
        me.denominacion = (me.denominacion) ? me.denominacion : false;

        me.MatrizIntegracionLogica = new Planificacion.Integracion.MatrizIntegracionLogica({
            title: 'Matriz de integración lógica del estudio ',
            extendCmp: me.extendCmp,
            controller: me.controller,
            idproyecto: me.idproyecto
        });


        me.tabProyecto = new Ext.TabPanel({
            frame: false,
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            plain: true,
            items:
                    [
                        me.MatrizIntegracionLogica
                    ]
            ,
            listeners: {
                tabchange: function(obj, tab) {
                    tab.doLayout();
                }
            }
        });
        me.items = [{
                layout: 'border',
                region: 'center',
                tbar: ["Denominación del estudio: " + me.denominacion],
                items: [me.tabProyecto]}];

        Planificacion.Integracion.FmpeirTabPanel.superclass.initComponent.call(Ext.apply(me, arguments));
    }
});
Ext.reg('Planificacion.Integracion.FmpeirTabPanel', Planificacion.Integracion.FmpeirTabPanel);


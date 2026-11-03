Ext.ns('Maestro.Example');

Maestro.Example.WinAnalisis = Ext.extend(Ext.Window, {
    modal: true,
    closeAction: 'hide',
    constrain: true,
    resizable:false,
    layout: 'fit',
    border : false,
    width: 1200,
    height: 600,
    initComponent: function(){
        var me = this;

        me.title= 'Ventana de ejemplo de menu';

        me.items = [(new Maestro.Reporte.MenuApp({idmodule:'prueba'})).getMainView()];

        Maestro.Example.WinAnalisis.superclass.initComponent.call(this);
    }
});

Maestro.Example.PanelPrueba = Ext.extend(Ext.Panel, {
    layout: 'form',
    initComponent: function(){
        var me = this;

        me.title= 'Renderiza correctamente',

        me.items = [{xtype: 'textfield', fieldLabel: 'prueba'}, {xtype: 'textfield', fieldLabel: 'prueba'}];

        Maestro.Example.PanelPrueba.superclass.initComponent.call(this);
    },
    reloadComponentInfo: function(filters){
        console.info(filters);
        console.info('funciona');
    },
});
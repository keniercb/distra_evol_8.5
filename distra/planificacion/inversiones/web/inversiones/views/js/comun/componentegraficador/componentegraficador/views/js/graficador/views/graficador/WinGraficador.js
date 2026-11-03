/**
 * Ventana con las misiones
 * @autor Liván Capote Valdés
 */
Ext.ns('Std.Base.Graficador');
Std.Base.Graficador.WinGraficador = Ext.extend(Ext.Window, {
    id: 'winGraficador',
    resizable: true,
    height: 550,
    width: 1200,
    title: 'Graficador',
    layout: 'border',
    collapsible: true,
    initComponent: function() {
        var me = this;
        this.panel = new Std.Base.Graficador.PanelGraficador({
            graficos: me.graficos,
            separar: me.separar,
            parent: me
        });
        this.items = [this.panel];
        Std.Base.Graficador.WinGraficador.superclass.initComponent.call(this);
    }
});
Ext.ns('Caja.Operaciones.Arqueo');
Ext.ArqueoCI = Ext.extend(Ext.Component, {
    constructor: function ()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        new Caja.Operaciones.NewArqueo(1);
    }
});

new Ext.ArqueoCI();
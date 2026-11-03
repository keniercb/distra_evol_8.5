Ext.namespace('Ext.ClassMovimiento');
Ext.ClassMovimiento = Ext.extend(Ext.Component, {
    objClassGestionarMov: undefined,
    constructor: function ()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;

        scope = this;
        this.objClassGestionarMov = new Ext.ClassGestionarMov(1);
    }
});

new Ext.ClassMovimiento();
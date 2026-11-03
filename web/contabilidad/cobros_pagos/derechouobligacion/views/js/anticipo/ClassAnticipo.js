Ext.namespace('Ext.ClassAnticipo');
Ext.ClassAnticipo = Ext.extend(Ext.Component, {
    objClassGestionarAnticipo: undefined,
    constructor: function ()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
        scope = this;
        this.objClassGestionarAnticipo = new Ext.ClassGestionarAnticipo(1);
    }
});
new Ext.ClassAnticipo();
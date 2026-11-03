Ext.namespace('Ext.ClassGestionarObligacionPago');
Ext.ClassGestionarObligacionPago = Ext.extend(Ext.Component,
{
    objClassGestionarDuo : undefined,
	
    constructor : function()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
	
        scope = this;
        this.objClassGestionarDuo = new Ext.ClassGestionarDuo(2, 1);
        
    }
});

new Ext.ClassGestionarObligacionPago();
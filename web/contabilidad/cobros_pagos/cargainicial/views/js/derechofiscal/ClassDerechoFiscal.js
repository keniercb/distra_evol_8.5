Ext.namespace('Ext.ClassGestionarDerechoFiscal');
Ext.ClassGestionarDerechoFiscal = Ext.extend(Ext.Component,
{
    objClassGestionarDuo : undefined,
	
    constructor : function()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
		
        scope = this;
        this.objClassGestionarDuo = new Ext.ClassGestionarDuo(3);
		
    }
});

new Ext.ClassGestionarDerechoFiscal();
Ext.namespace('Ext.ClassGestionarDerechoCobro');
Ext.ClassGestionarDerechoCobro = Ext.extend(Ext.Component,
{
    objClassGestionarDuo : undefined,
	
    constructor : function()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
		
        scope = this;
        this.objClassGestionarDuo = new Ext.ClassGestionarDuo(1, 1);
		
    }
});

new Ext.ClassGestionarDerechoCobro();
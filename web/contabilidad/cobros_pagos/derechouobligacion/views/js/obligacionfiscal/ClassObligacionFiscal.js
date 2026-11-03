Ext.namespace('Ext.ClassGestionarObligacionFiscal');
Ext.ClassGestionarObligacionFiscal = Ext.extend(Ext.Component,
{
    objClassGestionarDuo : undefined,
	
    constructor : function()
    {
        Ext.QuickTips.init();
        Ext.Ajax.timeout = 6000000;
        perfil = window.parent.perfil;
		
        scope = this;
        this.objClassGestionarDuo = new Ext.ClassGestionarDuo(4);
		
    }
});

new Ext.ClassGestionarObligacionFiscal();
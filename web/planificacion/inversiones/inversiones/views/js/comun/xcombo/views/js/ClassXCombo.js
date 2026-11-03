if(!Ext.CONT)
    Ext.namespace('Ext.CONT');
Ext.CONT.ClassXCombo = Ext.extend(Ext.Component, 
{
    constructor : function(properties, params)
    {	
        return  (Ext.getCmp(params.id)) ? Ext.getCmp(params.id) : new Ext.CONT.UIXCombo(this, properties, params);
    }
});
/*
 * Grid para mostrar las notificaciones
 */
Ext.ns('Ext.window.IntervaloNotificaciones');
Ext.window.IntervaloNotificaciones = Ext.extend(Ext.Window, {
    modal: true,
    width: 300,
    height: 100,
    layout: 'fit',
    constructor: function(config) {
        var me = this;
        me.title = 'Cambiar intervalo monitoreo notificaciones',
        me.form = new Ext.form.FormPanel({
            layout: 'anchor',
            frame : true,
            border: false,
            bodyBorder: false,
            items: [{
                xtype: 'numberfield',
                fieldLabel: 'Intervalo',
                anchor: '100%',
                allowBlank : false,
                allowNegative:false
            }]
        });
        me.items = [me.form];
        me.buttons = [{
            text: 'Aceptar',
            iconCls : 'aceptar',
            handler: function(){
                me.form.getForm().submit({
                    url : 'cambiarintervalonotificaciones',
                    success : function(form, action){
                        var result = action.result;
                        Ext.Msg.alert('Success', action.result.msg);
                    },
                    failure: function(form, action){
                        switch (action.failureType) {
                            case Ext.form.Action.CLIENT_INVALID:
                                Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
                                break;
                            case Ext.form.Action.CONNECT_FAILURE:
                                Ext.Msg.alert('Failure', 'Ajax communication failed');
                                break;
                            case Ext.form.Action.SERVER_INVALID:
                                Ext.Msg.alert('Failure', action.result.msg);
                        }
                    }
                })
            }
        },{
            text: 'Cancelar',
            iconCls : 'cancelar',
            handler: function(){
                me.close();
            }
        }];
        Ext.window.IntervaloNotificaciones.superclass.constructor.apply(this, arguments);
        me.show();
        
    }
});

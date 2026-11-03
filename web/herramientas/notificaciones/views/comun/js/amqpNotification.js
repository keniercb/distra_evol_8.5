Ext.ns('Ext.notificaciones.idioma.es');
Ext.notificaciones.idioma.es = {
    msgErrorAmqp : "En estos momentos el servidor de colas de mensajer&iacute;a est&aacute; apagado. Las notificaciones no ser&aacute;n enviadas hasta que el servicio sea habilitado por el administrador. No obstante puede seguir trabajando en espera de su activaci&oacute;n. &iquest;Quiere continuar?"
}
Ext.notificaciones.EVT_MANAGER = new Ext.util.Observable();
Ext.notificaciones.EVT_MANAGER.addEvents({
    "statuschange"	:true,
    "enabled"       :true,
    "disabled"	:true
});
Ext.notificaciones.AmqpConnect = function(is_connect){
    Ext.QuickTips.init();
    if(!is_connect){
        Ext.notificaciones.AmqpStatus = 'disabled';  
        Ext.notificaciones.EVT_MANAGER.fireEvent('disabled',Ext.notificaciones.AmqpStatus);
    }else{        
        Ext.notificaciones.AmqpStatus = 'enabled';
        Ext.notificaciones.EVT_MANAGER.fireEvent('enabled',Ext.notificaciones.AmqpStatus);        
    }
    Ext.notificaciones.EVT_MANAGER.fireEvent('statuschange',Ext.notificaciones.AmqpStatus);
}

Ext.notificaciones.checkConnection = function(){
    Ext.QuickTips.init();
    Secodena.mostrarMascara('dom01', '', Ext.idioma.domain.msgComprobar);
    Ext.Ajax.request({
        url:'/herramientas/notificaciones/index.php/monitoreo/checkconnection',
        callback:function(opt,success,resp){
            var succ = Ext.decode(resp.responseText);
            Secodena.ocultarMascara('dom01');
            if(succ.success){
                Ext.notificaciones.AmqpConnect(true)
            }else{
                Ext.notificaciones.AmqpConnect(false);
            }
            Ext.notificaciones.AmqpShowMsg();
        }
    })
}

Ext.notificaciones.AmqpShowMsg = function(){
    if(Ext.notificaciones.AmqpStatus == 'disabled'){
        Ext.WindowMgr.zseed = 10000;  //Configuramos el zseed a un valor superior al del Desktop
        Ext.MessageBox.show({
            title:'Confirmaci&oacute;n',
            msg:Ext.notificaciones.idioma.es.msgErrorAmqp,
            buttons: Ext.MessageBox.OKCANCEL,
            icon:Ext.MessageBox.QUESTION,
            fn:function(btn){
                if(btn == 'cancel'){
                    var iframeId = window.frameElement.id;
                    var a = window.parent.Ext.getCmp('win'+iframeId);
                    if(a)
                        a.close();
                }
            }
        });
    }
}
Ext.notificaciones.on = function(evtname,fn,scope){
    Ext.notificaciones.EVT_MANAGER.on(evtname,fn,scope);
}
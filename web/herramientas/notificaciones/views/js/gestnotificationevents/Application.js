/**
 *  @include "ConfigurarAvisos.js"
 */
Ext.defineApp("ConfigurarAA", {	
    main : function(){
        var perfil = window.parent.parent.UCID.portal.perfil;             
        Ext.Ajax.request({
            url: 'obteneridioma',
            callback: function(opt, success, response){
                if(success){
                    var o = Ext.decode(response.responseText);
                    var labels = Ext.notificaciones.gestnotificationevents.idioma[o.idioma].etiquetas;
                    this.launcher =  new ConfigurarAvisos({
                        labels: labels
                    }); 
                    //masks 
                    var eventMask = new Ext.LoadMask(this.launcher.getEventGrid().getId(), {
                        msg :   labels.lbLoading, 
                        store : this.launcher.getEventGrid().getStore()
                    });
                    eventMask.show(); 

                    var notificationsMask = new Ext.LoadMask(this.launcher.getNotificationGrid().getId(),{
                        msg :   labels.lbLoading, 
                        store : this.launcher.getNotificationGrid().getStore()
                    });
                    this.launcher.getEventGrid().getSelectionModel().on('rowselect',function(){
                        notificationsMask.show();
                    });
                    //end masks
                    //---------
                    //vtypes
                    Ext.apply(Ext.form.VTypes, {
                        eventNameValid:  function(v) {
                            var alphanum = /^[a-zA-z]+[a-zA-Z0-9_]*$/;
                            return alphanum.test(v);
                        },
                        eventNameValidText: labels.qtEventNameValid,
                        eventNameValidMask: /[a-z0-9_]/i
                    });                    
                }                
            },
            scope: this
        });            
        
    }
}
);
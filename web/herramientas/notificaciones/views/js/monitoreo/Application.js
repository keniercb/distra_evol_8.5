Ext.defineApp('Ext.notificaciones.monitoreo', {
    main: function(){        
        var labels = Ext.notificaciones.monitoreo.idioma[perfil.idioma].etiquetas;
        var container = new Ext.notificaciones.monitoreo.UI_ContenedorPadre({
            labels: labels
        });  
        
        this.launcher =  new Ext.Viewport({
            layout: "fit",
            autoHeight : true,
            resizable : true,
            items:[container]
        }); 
        var eMask = new Ext.LoadMask(container.getLeftCtn().getGridListarEventos().getId(), {
            msg :   labels.lbLoading, 
            store : container.getLeftCtn().getGridListarEventos().getStore()
        });
        eMask.show();  
        this.show();
    }                
});
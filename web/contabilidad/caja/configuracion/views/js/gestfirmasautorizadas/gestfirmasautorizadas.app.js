Ext.ns('Caja.Gestfirmasautorizadas');


 Ext.Ajax.request({
            method: 'POST',
            url: 'cargaretiquetas',
            callback: function(options, success, response) {                
                new Caja.Gestfirmasautorizadas.Viewport({
                    idioma: Ext.decode(response.responseText),
                    perfil: window.parent.perfil
                });
            }
            
         });

Caja.Gestfirmasautorizadas.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function(params) 
    {
        this.layout = 'fit';
        scope: this;
        this.pfirmas = new Caja.Gestfirmasautorizadas.PanelFirmas({
            idioma: params.idioma,
            perfil: params.perfil
        });
        
        
    Ext .apply(this, params);
        Ext.apply(this, {
        layout: 'fit' ,
        items: [this.pfirmas ]
    }); 
       Caja.Gestfirmasautorizadas.Viewport.superclass.constructor.call(this, params);
    }
    
        

    
             
    
});

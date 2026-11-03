Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('nomcompetencia', cargarInterfaz);

function cargarInterfaz(){
    perfil = arguments[0];
    labels = arguments[1];
    
    
    var GEC=new Ext.competencia.GestCompetencia({
        gestionar:true
    });   
    
    var vp=new Ext.Viewport({
        layout:'fit',        
        items:[GEC]
    });
}
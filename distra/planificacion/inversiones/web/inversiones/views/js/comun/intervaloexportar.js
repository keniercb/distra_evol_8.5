/*Usado en
 *Bases plan: Niv. Actividad, Calculo
 ***/
var nfdesde, nfhasta,
fpIntervaloExportacion,winParamsExport;
var estaReseteando = false;
var limitepag = 100;

function init_intervaloexportar(){
    
    
    nfdesde =new Ext.form.TextField({
        xtype:'numberfield',
        id:'nfdesde',
        maskRe:/^([0-9]+ ?[0-9]*)+$/,
        regex:/^([0-9]+ ?[0-9]*)+$/,
        // anchor:'75%',
        fieldLabel:'de',
        allowBlank: false,        
        blankText :perfil.etiquetas.lbRequerido,
        value:'1',
        width: 50,
        disabled:true,
        minValue:1
    // minText:'El mínino valor admitido es 1'
    });

    nfhasta =new Ext.form.TextField({
        xtype:'numberfield',
        id:'nfhasta',
        maskRe:/^([0-9]+ ?[0-9]*)+$/,
        regex:/^([0-9]+ ?[0-9]*)+$/,
        // anchor:'75%',
        fieldLabel:'a',
        allowBlank: false,        
        blankText :perfil.etiquetas.lbRequerido,
        value:'1',
        width: 50,
        disabled:true,
        minValue:1
    // minText:'El mínino valor admitido es 1'
    });


    fpIntervaloExportacion = new Ext.FormPanel({
        //labelWidth: 10, //75
        frame:true,
        autoHeight:true,
        items:[{
            layout:'column',            
            items:[{
                layout:'form',
                //columnWidth:0.3,
                items:[{
                    id:'cbtodas',
                    checked: true,
                    fieldLabel: 'Todas',
                    xtype:'radio',
                    name:'grupo1'
                }]                     
            }]
        },{
            layout:'column',            
            items:[{
                layout:'form',
                //columnWidth:0.3,
                items:[
                {
                    id:'cbpaginas',
                    fieldLabel: 'P&aacute;ginas',
                    xtype:'radio',
                    name:'grupo1',
                    listeners: {
                        check :function(cb,bol){
                            if(cb.checked ){
                                Ext.getCmp('nfdesde').enable();
                                Ext.getCmp('nfhasta').enable();
                                Ext.getCmp('nfdesde').setValue(1);
                                Ext.getCmp('nfhasta').setValue(1);
                            }else{
                                Ext.getCmp('nfdesde').disable();
                                Ext.getCmp('nfhasta').disable();
                                Ext.getCmp('nfdesde').setValue(1);
                                Ext.getCmp('nfhasta').setValue(1);
                            }
                      
                        }
                    }
                },
                nfdesde,nfhasta] 
            }]
        }]
    });

    winParamsExport = new Ext.Window({
        title : perfil.etiquetas.lbTituloIntervaloExportacion, //'Intervalo de exportaci&oacute;n'
        //modal : true,
        closeAction : 'hide',
        width:250,//250
        height:182,//190
        items : fpIntervaloExportacion,  
        buttons : [{
            icon : perfil.dirImg + 'cancelar.png',
            iconCls : 'btn',
            text : 'Cancelar',//perfil.etiquetas.lbBtnCancelar,
            handler : function() {     
                estaReseteando = true;
                fpIntervaloExportacion.getForm().reset();
                estaReseteando = false;
                winParamsExport.hide();
            }
        },{
            icon : perfil.dirImg + 'aceptar.png',
            iconCls : 'btn',
            text : 'Aceptar',//perfil.etiquetas.lbBtnAceptar,
            handler : function() { 
                exportarConcepto();
            }
        }]      
    });

}

function seleccBtnExportar(){ 
    winParamsExport.show();    
};

function validarIntervaloExportacion(plimitepag){
    if(plimitepag == null)
        limitepag = 5000; //por defecto 5000 paginas
    else            
        limitepag = plimitepag;
    
    var start = 0,limit = 0,desde = -1,hasta;
    if(fpIntervaloExportacion.getForm().isValid()){
        
        if(Ext.getCmp('cbpaginas').checked){
            desde = Number( Ext.getCmp('nfdesde').getValue() );
            hasta = Number( Ext.getCmp('nfhasta').getValue() );
            if ( hasta < desde )     {
                mostrarMensaje(1, perfil.etiquetas.lbmsgErrorIntervaloErrroneo );
                return false;
            }    
            if( ( hasta - desde ) > limitepag ) 
            {
                mostrarMensaje(1, perfil.etiquetas.lbmsgErrorIntervaloParte1+limitepag+ perfil.etiquetas.lbmsgErrorIntervaloParte2 );
                return false;
            }
            if( desde == 0 || hasta == 0 ) {
                Ext.getCmp('nfhasta').setValue(1);
                Ext.getCmp('nfdesde').setValue(1);
                return false;
            }
            start = (( desde -1) == 0)? 0 :((( desde -1)*20+1));
            limit = hasta*20;
        }
        winParamsExport.hide();
        estaReseteando = true;
        fpIntervaloExportacion.getForm().reset();
        estaReseteando = false;
        if(desde==-1){
            desde = 1;
            hasta = '*';
        }
        return [start,( (limit == 0)?100000:limit ),desde,hasta];
    }else{
        return false;
    }
};  

function openUrl(url){    
    window.open( url ); 
}
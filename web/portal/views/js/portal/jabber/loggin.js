
/*Ext.onReady(function(){
	
	//document.getElementById('loading').innerHTML='';
	
	var connection;
	var scope=this;
	
	
	var tfusuario = new Ext.form.TextField({
		fieldLabel:'Usuario'
	});
	var tfpassword = new Ext.form.TextField({
		fieldLabel:'password',
		inputType:'password'
	});
	Ext.namespace('Ext.exampledata');
	Ext.exampledata.states = [['es', 'es'],['en', 'en']];
	var store = new Ext.data.SimpleStore({fields: ['abbr', 'state'],data:Ext.exampledata.states});
	
	var fplogin = new Ext.FormPanel({
		frame:true,
		layout:'form',
		border:0,
		items:[tfusuario,tfpassword]
	});
    var  win = new Ext.Window({
                layout:'fit',
                width:300,
                resizable:false,
                height:160,
                closeAction:'hide',
                title:'Entrar al sistema',
                plain: true,
                items:[fplogin],
                buttons: [{
                     text:'Aceptar',
                     icon: 'var/www/titan/web/cmi/comun/images/icons/accept.png',
             		 iconCls: 'btn',
			 handler: function(){
                	    login();
                         }
                },{
                     text:'Cancelar',
                     icon: 'titan/web/cmi/comun/images/icons/accept.png',
             		 iconCls: 'btn',
			 handler: function(){
                	    login();
                         }
                }
                
                
                ],
                keys:[{
                 	key:Ext.EventObject.ENTER,
                 	scope:this,
                 	fn:function(key, e){
                 	if (fplogin.getForm().isValid()){
                 		login();
                 	}
                 	else{                 		
                 		alert('Introduzca sus datos');
                 	}}}
        		 ]
            });      
        win.show();           
        function login(){
        	if(fplogin.getForm().isValid())
        	  {
        		fplogin.getForm().submit({
        			url     :'index.php/login/logear',
        			waitMsg :'Auntenticando usuario',
        	        method  :'POST',
        	        params:{
        	           user:tfusuario.getValue(),
        	           pass:tfpassword.getValue()
        	           //idioma:Ext.getCmp('dbgestor').getValue()
        	        },
        	        failure: function (form, action){
        				if (action.result.codMsg == 1){
        					win.hide();        					
        					document.getElementById('loading').innerHTML='<div id="loading"><div class="loading-indicatorp"><br><br><br><br><br><br><br><br><br><br><b><img src="images/cargando.gif" width="25" height="25" style="" align="middle"/><br>Por favor espere...</b></div></div>';
        					location.href='index.php/app';
        	            }else{
        					tfusuario.setValue('');
        					tfpassword.setValue('');
        				}
        		     }
        	     });
            }
        }                  
       
     	
});*/



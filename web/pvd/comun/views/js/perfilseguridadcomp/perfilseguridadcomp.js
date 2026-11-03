/**
 Uso:Componente para mostrar el perfil de la persona de forma abreviada en seguridad.

  * ---------------------------------------------

  * 9 de Agosto 2011 |   Persona
  *

  * @extends Ext.Window
  * @xtype
  * @autor   Secodena  -  Ing. Yadir Martinez Vergara
  * @version 1.0.0
  */
Ext.ns('Ext.pvd.persona.perfilseguridad');
Ext.QuickTips.init();
Ext.pvd.persona.perfilseguridad.Utils = function() {
	return {
		loadMask : function(msj, cmp) {
			var componente = (!cmp) ? Ext.getBody() : cmp.body;
			this.lMask = new Ext.LoadMask(componente, {
						msg : msj
					});
			this.lMask.show();
		},
		hideMask : function() {
			this.lMask.hide();
		}
	}
};
var utils = new Ext.pvd.persona.perfilseguridad.Utils();
var plantillaFoto = new Ext.XTemplate(
		'<div class="details">',
			'<tpl for=".">',
				'<center><img src="{dirfoto}" height=120 width=120 style="cursor:pointer;border:1px solid 000" /></center><div class="details-info">',
			'</tpl>',
		'</div>'
);
plantillaFoto.compile();

var plantillaDatos = new Ext.XTemplate(
    '<table width="426" border="0" align="center">',
  '<tr>',
    '<td width="130" height="25" class="x-form-check-group-label Estilo4">Nombre y apellidos: </td>',
    '<td width="280"><span class="Estilo3">&nbsp;&nbsp;{nombreapellidos}</span></td>',
  '</tr>',
  '<tr>',
    '<td height="25" class="x-form-check-group-label Estilo4">N&uacute;mero de identificaci&oacute;n: </td>',
    '<td><span class="Estilo3">&nbsp;&nbsp;{numid} </span></td>',
  '</tr>',
  '<tr>',
    '<td height="25" class="x-form-check-group-label Estilo4">Sexo:</td>',
    '<td><span class="Estilo3">&nbsp;&nbsp;{sexo}</span></td>',
  '</tr>',
  '<tr>',
    '<td height="25" class="x-form-check-group-label Estilo4">Fecha de nacimiento:</td>',
    '<td><span class="Estilo3">&nbsp;&nbsp;{fechanacimiento}</span></td>',
  '</tr>',
  '<tr>',
    '<td height="10" class="Estilo4">&nbsp;</td>',
    '<td>&nbsp;</td>',
  '</tr>',
'</table>'
);
plantillaDatos.compile();
function Objf(dirfoto) {
    this.dirfoto = dirfoto
}
var ventana = null; //Variable que es un apuntador al objeto Window(WinperfilSeguridad)
/*---------------------------------------------------------------------*/
/*------------Declaración de la ventana para ver el perfil de la persona -------------*/
Ext.pvd.persona.perfilseguridad.WinperfilSeguridad = Ext.extend(Ext.Window, {
	width 				: 550,
	height				: 230,
	resizable 			: true,
	modal 				: true,
	closeAction 		: 'destroy',
	persona 			: this.persona,
	document_uri 		: '',
	espaciotrabajo 		: '',
	layout              : 'fit',
	allowButtons: true,
	initComponent 		: function() {
		ventana = this;
		this.btnCancelar 	= new Ext.Button({
					text 	: 'Cerrar',
					icon 	: perfil.dirImg + 'cancelar.png',
					iconCls : 'btn',
					tooltip	:'Cerrar la ventana',
					handler : function() {
						this.destroy();
					}.createDelegate(this)
				});

           this.pfoto = new Ext.Panel({
        		width : 135,
        		height : 135,
        		border : true,
                layout:'fit',
        		frame: true,
        		autoShow : true,
                id:'pfoto'
		   });
           this.pDatos = new Ext.Panel({
        		layout : 'fit',
        		frame : true,
        		region: 'center',
        		height : 150,
        		width : 280,
        		items : [{
        		   layout : 'column',
        			border : false,
        				items : [{
        				columnWidth : 0.30,
        				id: 'panelfoto',
        				bodyStyle : 'padding: 0px 0px 0px 15px',
        				layout : 'column',
        				height : 170,
        				border : true,
        				frame: false,
        				items : [{
        						layout : 'form',
        						border : false,
        						frame: false,
        						items : [this.pfoto]  
        					     }]		
        				},
        				{
        				columnWidth: 0.01,	
        				layout: 'form',
        				items:[{xtype: 'panel', height: 140,width:3}]		
        				},
        				{
        				xtype: 'fieldset',
        				id: 'fieldset',
        				columnWidth : .69,
        				bodyStyle : 'padding: 5px 0px 1px 15px',
        				width : '100%',
        				style : '-moz-border-radius:5px',
        				height :'100%',
        				layout : 'column',
        				items:[{xtype: 'panel',  id: 'paneldatos', html: '<p class="Estilo3">Cargando...</p>'}]
        			}   ]
        		}]
        	});

		if(this.allowButtons)this.buttons = [this.btnCancelar];
        this.items = [this.pDatos];
		this.title = 'Perfil de la persona';
          
		Ext.pvd.persona.perfilseguridad.WinperfilSeguridad.superclass.initComponent.apply(this, arguments);
        
        
        
		
	},
	initEvents : function() {
		Ext.pvd.persona.perfilseguridad.WinperfilSeguridad.superclass.initEvents.apply(this,
				arguments);
	},
    listeners: {
        show : function (){
            Ext.Ajax.request({
					url: '/pvd/comun/index.php/perfilseguridadcomp/mostrarperfilseguridad',
					method:'POST',
					params: {idpersona:ventana.persona},
					callback: function (options,success,response){
 							    respuesta = Ext.decode(response.responseText);
								var contenido = ventana.pfoto.body;
                                var datosfoto = new Objf(respuesta.dirfoto);
                    	 	    plantillaFoto.overwrite(contenido, datosfoto);
                    		    contenido.slideIn('l', {stopFx:true,duration:.5});
                                
                                var cantDatos = Ext.getCmp('paneldatos').body;
                                plantillaDatos.overwrite(cantDatos, respuesta);
					}			
			});

        }
    }
});

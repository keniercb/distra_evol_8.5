/*
 * Componente para gestinar los temas.
 * @name temas.js
 * @package portal
 * @copyright UCID Cuba
 * @author Livan A Capote Valdez
 * @version 1.0-0
 */

Ext.ns('Ext.comun.tema');
Ext.QuickTips.init();
Ext.comun.tema.Utils = function() {

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
var utils = new Ext.comun.tema.Utils();
Ext.comun.tema.Panel = Ext.extend(Ext.Panel, {
	autoHeight	:true,
	autoShow	:true,
	layout		:'fit',
	title		:'Temas',
	initComponent 		: function() {	
	this.id = this.id ? this.id : "temas";
	var radios = new Ext.form.RadioGroup({
		 fieldLabel: 'Seleccione',		                
		 columns: 2, //muestra los radiobuttons en dos columnas
		 items: [
			  {boxLabel: 'Tema vino', name: 'framework', inputValue: 'Vino'},
			  {boxLabel: 'Tema azul', name: 'framework', inputValue: 'Azul'}
		 ]
	});	
	var form= new Ext.FormPanel({
		frame:false,
		border:false,
		defaultType: 'radio', 
		title: 'Seleccione',
		autoHeight: true,		
		items:[{
			fieldLabel: 'Color favorito',
			boxLabel: 'Azul',
			name: 'fav-color',
			inputValue: 'azul',
			listeners:{
				check :function(rb,check){	
					if(check){
						this.cambiarTema('default');														
					}								
				}.createDelegate(this)
			}
		},{
			fieldLabel: '',
			labelSeparator: '',
			boxLabel: 'Vino',
			name: 'fav-color',
			inputValue: 'vino',
			listeners:{
				check :function(rb,check){
					if(check){	
						this.cambiarTema('vino');
					}								
				}.createDelegate(this)
			}
		}]
	});       
	/*--------------------------------------------------------------------------*/
	/*-----------Inicializar el componente con el formulario dentro-------------*/	
		this.items = [form];
		Ext.comun.tema.Panel.superclass.initComponent.call(this);
		//Ext.comun.tema.Panel.superclass.initComponent.apply(this, arguments);
    },
	/*--------------------------------------------------------------------------*/
	/*----------------------Función para cambiar el tema------------------------*/
	cambiarTema:function(tema){
		mostrarMensaje(2,"&iquest;Est&aacute; seguro que quiere cambiar de tema? En caso de ejecutar esta acci&oacute;n todo el trabajo no guardado se perder&aacute;.",function(btn){
			if(btn == 'ok'){
				/*window.parent.UCID.portal.perfil.dirCss = window.parent.UCID.portal.perfil['dirCss'].replace('temas/'+window.parent.UCID.portal.perfil.tema,'temas/'+tema);
				window.parent.UCID.portal.perfil.dirImg = window.parent.UCID.portal.perfil['dirImg'].replace('temas/'+window.parent.UCID.portal.perfil.tema,'temas/'+tema);
				window.parent.UCID.portal.perfil.tema = tema;	
				Ext.util.CSS.removeStyleSheet('theme');
				Ext.util.CSS.refreshCache();
				switch(tema){
					case 'default':{
						Ext.util.CSS.swapStyleSheet('theme','../../../lib/ExtJS/temas/default/css/azul.css');
					};break;
					case 'vino':{
						Ext.util.CSS.swapStyleSheet('theme','../../../lib/ExtJS/temas/vino/css/vino.css');
					}
				}*/
				Ext.Ajax.request({
					url		: 'cambiartema',
					method	:'POST',
					params	:{tema:tema},
					callback: function (options,success,response){						
						if(Ext.portal && Ext.portal.comun && Ext.portal.comun.windows && Ext.portal.comun.windows.hasOpenenWindow()){
							alert(1);
							Ext.portal.comun.windows.reloadAllIFrames();
						}
					}
				});
			}
		})
		
	}	
});
/*
 * Componente para gestinar la apariencia.
 * @name apariencia.js
 * @package portal
 * @copyright UCID Cuba
 * @author Livan A Capote Valdez
 * @version 1.0-0
 */

Ext.ns('Ext.comun.apariencia');
Ext.QuickTips.init();
Ext.comun.apariencia.Utils = function() {
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
var utils = new Ext.comun.apariencia.Utils();
Ext.comun.apariencia.Ventana = Ext.extend(Ext.Window, {
	id: 'winApariencia',
    width 				: 450,
    height 				: 400,
    maximizable                         : true,
    resizable 			        : true,
	minimizable: true,
	//closeAction 		        : 'hide',
     
	plain 				: true,
	layout 				: 'fit',
	modal                           : true,
	constrain			: true,
	border 				: false,
	aux		        	: 0,
	taskbar: null,
	taskButton: null,
	activeWindow: null,
	listeners :{
       // hide :function(){
       //       this.destroy();
       //       if(Ext.get('cargarfondos')){
       //       	Ext.get('cargarfondos').destroy();
       //       }
       //},
		activate: function(){this.markActive(this)},
		beforeshow: function(){this.markActive(this)},
		deactivate: function(){this.markInactive(this)},
		minimize: function(){this.minimizeWin(this)},
		close: function(){this.removeWin(this)}
    },
	initComponent 		: function() {
		this.taskbar = window.parent.MyDesktop.getDesktop().taskbar;
		var tb = this.taskbar;
		 var desktopEl = Ext.get('x-desktop');
         this.render(desktopEl);
	   var data = {
		  items: [
			  { cls: 'qo-accesos-icon', id: 'accesosdirectos', label: '<b>Accesos directos<b>' }
			 ,{ cls: 'qo-correr-icon', id: 'aplicaciones', label: 'Inicio autom&aacute;tico' }
			//,{ cls: 'qo-correr-icon', id: 'correr', label: 'Iniciar aplicaci&oacute;n' }
			,{ cls: 'qo-iniciorapido-icon', id: 'iniciorapido', label: 'Inicio r&aacute;pido' }   
			//,{ cls: 'qo-apariencia-icon', id: 'temas', label: 'Temas del portal' }       
			,{ cls: 'qo-fondos-icon', id: 'fondos', label: 'Fondos de pantalla' }      		 
		  ]
	   };
	   var dataView = new Ext.DataView({
		  itemSelector: 'div.thumb-wrap'
		  , listeners: {
			 'click': {
				fn: function(dV, index, node){				
				   var r = dataView.getRecord(node);
				      /*-----------------Para iniciar aplicaciones-----------------*/
				  if(r.data.id=='aplicaciones'){
                      var aplicaciones = new Ext.comun.arbol.aplicaciones.treeEditable();
                      if(!tpDatos.findById(r.data.id)){
                          tpDatos.add(aplicaciones).show();
                          aplicaciones.getRootNode().expand();
                      }
                       else{
                           tpDatos.setActiveTab(r.data.id);
                       }
						
				   }
				   /*------------------------------------------------------*/
				   /*-----------------Para cambiar el tema-----------------*/
				  /* if(r.data.id=='temas'){
					var temas = new Ext.comun.tema.Panel({
						id : r.data.id
					});
					if(!tpDatos.findById(r.data.id)){
						tpDatos.add(temas).show();
					}
					else
						tpDatos.setActiveTab(r.data.id);
				   }*/
				   /*------------------------------------------------------*/
				   /*---------------Para los inicios r�pidos---------------*/
				   if(r.data.id=='iniciorapido'){
				   var iniciorapido = new Ext.comun.arbol.iniciorapido.treeEditable();
					if(!tpDatos.findById(r.data.id)){
						tpDatos.add(iniciorapido).show();
						iniciorapido.getRootNode().expand();
					}
					else{
                                            tpDatos.setActiveTab(r.data.id);
                                        }
						
				   }				   
				   /*------------------------------------------------------*/
				   /*--------------Para los accesos directos---------------*/
				   if(r.data.id=='accesosdirectos'){
				   var accesosdirectos = new Ext.comun.arbol.funcionalidades.treeEditable();
					if(!tpDatos.findById(r.data.id)){
						tpDatos.add(accesosdirectos).show();
						accesosdirectos.getRootNode().expand();
					}
					else{
                                            tpDatos.setActiveTab(r.data.id);
                                        }
						
				   }
				   /*------------------------------------------------------*/
				   /*---------------Para los fondos de pantalla------------*/
				   if(r.data.id=='fondos'){
                       var extra = 0;
                       if(Ext.getCmp('cargarfondos') == undefined) {
                           var fondos = new Ext.ux.ImageBrowser({

                               width: 514,
                               height: 450,
                               closable: true,
                               id: 'cargarfondos',
                               directorio: 'web/portal/views/js/portal/apariencia/imagen/wallpapers/',
                               listURL: '/portal/index.php/apariencia/listadeImagenes',
                               uploadURL: 'uploadimage.php',
                               deleteURL: 'deleteimage.php'
                           });
                           extra = 1;
                       }
					if((!tpDatos.findById(r.data.id)) && this.aux==0){
						this.aux=1;
						tpDatos.add(fondos).show();
						tpDatos.add(fondos).doLayout();						
					}
					else{
                        if(extra) {
                            tpDatos.add(fondos).show();
                            tpDatos.add(fondos).doLayout();
                        }
						tpDatos.setActiveTab('cargarfondos');
					}
				   }
				}
				, scope: this
			 }
		  }
		  , overClass: 'x-view-over'
		  , singleSelect: true
		  , store: new Ext.data.JsonStore({
			 data: data
			 , fields: [ 'cls', 'id', 'label' ]
			 , idProperty: 'id'
			 , root: 'items'
		  })
		  , tpl: new Ext.XTemplate(
			 '<tpl for=".">'
				, '<div style="float:left; margin:20;" class="thumb-wrap" id="{id}">'
				   , '<div class="thumb {cls}"></div>'
					  , '<span>{label}</span>'
				   , '</div>'
				, '</tpl>'
			 , '<div class="x-clear"></div>'
		  )
	   });
		this.taskButton = tb.addTaskButton(this);
		var panel = new Ext.Panel({
			id:'images-view',
			frame:false,	
                      
			autoHeight:true,
			collapsible:true,
			layout:'fit',
			items: dataView,
			title:'Inicio',
			bodyStyle: "padding: 15px; no-repeat center right"
		});
		var tpDatos = new Ext.TabPanel({				
			region : 'center',
			activeTab : 0,
			enableTabScroll : true,
			defaults : {autoScroll : true},
			items : [panel]
		});
       
	/*--------------------------------------------------------------------------*/
	/*-------------Inicializar el componente con el tab panel dentro------------*/	
		this.items = [tpDatos],
		Ext.comun.apariencia.Ventana.superclass.initComponent.call(this);
    },

	minimizeWin: function(win){
		win.minimized = true;
		win.hide();
	},

	markActive: function(win){
		if(this.activeWindow && this.activeWindow != win){
			this.markInactive(this.activeWindow);
		}
		this.taskbar.setActiveButton(win.taskButton);
		this.activeWindow = win;
		Ext.fly(win.taskButton.el).addClass('active-win');
		win.minimized = false;
	},

	markInactive: function(win){
		if(win == this.activeWindow){
			this.activeWindow = null;
			Ext.fly(win.taskButton.el).removeClass('active-win');
		}
	},

	removeWin: function(win){
		this.taskbar.removeTaskButton(win.taskButton);
	}
});

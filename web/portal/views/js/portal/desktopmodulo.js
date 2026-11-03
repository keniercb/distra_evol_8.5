/*
 * Componente portal de aplicaciones
 *
 * Interfaz del portal desktop con ventana por modulos y navegacion vertical independiente.
 *
 * @author Dionisdel Ponce Santana
 * @package Portal
 * @subpackage Portal
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
//Se importa el CSS para los estilos propios del componente desktop
var itemsVentanaCrear;
var menuTMP = {};
	//Objeto desktop del componente desktop de Ext
	MyDesktop = new Ext.app.App({
		init :function(){
			Ext.QuickTips.init();
		},
		getModules : function(){
			return [
				//Defino mi objeto de configuraci�n para el desktop men�
				new MyDesktop.BogusMenuModule()
			];
		},
		//Configuracion para el men� inicio
		getStartConfig : function(){
			var txtUser = (perfil.alias) ? perfil.alias : perfil.usuario;
			console.log(perfil);
			return {
				title:'<center>'+perfilPortal.etiquetas.lbStartTitle +' '+txtUser+'&nbsp; | &nbsp;'+'Tema: '+perfil.tema+'</center>',
				iconCls: 'user',
				perfil:perfil,
				toolItems: tbDesktop
			};
		}
	});
	//Objeto men� del desktop
	MyDesktop.BogusModule = Ext.extend(Ext.app.Module, {
		init : function(){
			this.launcher = {
				text: 'ddd',
				iconCls:'bogus',
				handler : this.createWindow,
				scope: this,
				windowId:'ddd'
			}
		},
		//Funcion para la creaci�n de la ventana din�mica a mostrar en el click de un elemento del men� inicio
		createWindow : function(src){
			var desktop = this.app.getDesktop();
            objDesk = this.app.getDesktop();
			var win = desktop.getWindow('win'+src.aWinConfig.id);
			if(!win){
				win = desktop.createWindow({
					id: 'win'+src.aWinConfig.id,
					title:src.aWinConfig.text,
					layout:'fit',
					items:new Ext.Panel({
						id:'panel'+src.aWinConfig.id,
						border:'false',
						layout:'border',
						items:[new Ext.tree.TreePanel({
								autoScroll:true,
								title:perfilPortal.etiquetas.lbFuncionalidades,
								collapsible:true,
								collapsed:false,
								rootVisible:false,
								width:200,
								region:'west',
								//Evento onclick de un nodo de la navegacion del men� que llama una direcci�n URL para la funcionalidad espec�fica
								listeners: {'click':function (nodo){
										if (nodo.attributes.referencia) {
											idFuncionalidad = nodo.attributes.idfuncionalidad;
											document.getElementById('ifMarco'+src.aWinConfig.id).src = nodo.attributes.referencia;
										}else 
											mostrarMensaje(3,'El nodo no tiene referencia ...');
									}
								},
	
								loader: new Ext.tree.TreeLoader({
											dataUrl:'cargarmodfunc',
											preloadChildren :false
								}),
								root:new Ext.tree.AsyncTreeNode({
									text:perfilPortal.etiquetas.lbModulos,
									expanded:true,
									id: src.aWinConfig.id
								})
							}), new Ext.Panel({
								id: 'iframe'+src.aWinConfig.id,
								border:false,
								region: 'center',
								html: '<iframe id="ifMarco' + src.aWinConfig.id + '" style="width:100%; height: 100%; border:none;"></iframe>',
								layout:'fit'
						})]
					}),
					width:800,
					maximized:true,
					height:490,
					minWidth :800,
					minHeight:480,
					iconCls: 'bogus',
					shim:false,
					animCollapse:false,
					constrainHeader:true
				});
			}
			win.show();
		}
	});
	MyDesktop.BogusMenuModule = Ext.extend(MyDesktop.BogusModule, {
		init : function(){
			this.launcher = {
				text: perfilPortal.etiquetas.lbTituloMenu,
				iconCls: 'bogus',
				handler: function() {
					return false;
				},
				menu: {
					items:dameItemsMenu(this, menuTMP)
				}
			}
		}
	});
	//Funci�n que pasado un objeto de configuracion devuelve un array de elementos para un men�
	function dameItemsMenu(objDesk, objson){
		var arrayItems = Array();
		if (objson && objson.length){
			for(var i=0; i<objson.length;i++){
				if (objson[i].menu){
					arrayItems[i]={
						text: objson[i].text,
						iconCls:'btn',
						icon:objson[i].icono,
                        sistemId: objson[i].id,
						handler: function() {
							return false;
						},
						menu: {
							items: dameItemsMenu(objDesk, objson[i].menu)
						}
					}
				}else{
					arrayItems[i]={
						text: objson[i].text,
						iconCls:'btn',
						icon:objson[i].icono,
						handler : objDesk.createWindow,
						scope: objDesk,
						aWinConfig:objson[i],
						a:'hola',
						windowId: objson[i].id
					}
				}
			}
		}
        console.log('Array --',arrayItems);
		return arrayItems;
	}
//Petici�n AJAX para cargar la configuraci�n del men� seg�n los privilegios del usuario
Ext.Ajax.request({
	url: 'cargardesktopmodulo',
	method:'POST',
	callback: function (options,success,response){
		if(success){
            console.log('WUWUWUW');
			menuTMP = Ext.decode(response.responseText);
			document.getElementById('cargandoconfiguracion').style.display = 'none';
			MyDesktop.initApp();
		}else{
			Ext.Msg.alert('Sorry',response.responseText);
		}
	}
});

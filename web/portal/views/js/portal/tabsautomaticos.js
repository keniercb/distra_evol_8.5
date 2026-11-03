/**
 * Componente portal de aplicaciones
 *
 * Interfaz del portal que carga automaticamente las funcionalidades del usuario en tabs.
 *
 * @author Yoandry Morejon Borbon
 * @package Portal
 * @subpackage Portal
 * @copyright UCID
 * @version 1.0-0
 */

//Inicializando ExtJS.
Ext.BLANK_IMAGE_URL = Ext.getDom('dir_ext_css').value + 'images/s.gif';
Ext.QuickTips.init();

//Creando un espacio de nombres para el caso de estudio.
Ext.ns('UCID.portal');

/**
 * Clase utilizada para definir el componente Portal.
 *
 * @param perfil Perfil del usuario autenticado (Tipo: Object).
 * @param etiquetas: Etiquetas de la IU (Tipo: Object).
 */
UCID.portal.Componente = function(perfil, etiquetas) {
	/**
	 * Directorio de los iconos.
	 */
	this.dirIconos = Ext.getDom('dir_ext_css').value + 'images/iconos/';

	/**
	 * Etiquetas.
	 */
	this.etiquetas = (etiquetas) ? etiquetas : perfil.etiquetas;

	/**
	 * Entorno de la clase.
	 */
	var thisComponent = this;

	/**
	 * Boton para cambiar la entidad en la que se desea trabajar.
	 */
	this.btnCambiarEntidad = new Ext.Button({
		id: 'btnCambiarEntidad',
		text: this.etiquetas.lbCambiarEntidad,
		tooltip: this.etiquetas.lbCambiarEntidad,
		icon: this.dirIconos + 'diferenciaconbanco.png',
		iconCls: 'btn',
		handler: function() {
			thisComponent.ventanaCambiarEntidad.show();
		}
	});

	/**
	 * Boton para cambiar la clave de acceso del usuario autenticado.
	 */
	this.btnCambiarClave = new Ext.Button({
		id: 'btnCambiarClave',
		text: this.etiquetas.lbBtnCambiarpass,
		tooltip: this.etiquetas.lbBtnCambiarpassw,
		icon: this.dirIconos + 'buscarclitepersona.png',
		iconCls: 'btn',
		handler: function(){
			thisComponent.ventanaCambiarClave.show();
		}
	});

	/**
	 * Boton para cerrar session.
	 */
	this.btnCerrarSession = new Ext.Button({
		id: 'btnCerrarSession',
		text: this.etiquetas.lbSalir,
		tooltip: this.etiquetas.cerrarSession,
		icon: this.dirIconos + 'salir.png',
		iconCls: 'btn',
		handler:function(){
			mostrarMensaje(2, '&iquest;' + thisComponent.etiquetas.lbMsgCerrarSesion + UCID.portal.perfil.usuario + '?', thisComponent.cerrarSession);
		}
	});

	/**
	 * Boton para mostrar la ayuda del caso de estudio.
	 */
	this.btnAyuda = new Ext.Button({
		id: 'btnAyuda',
		text: this.etiquetas.lbBtnAyuda,
		tooltip: this.etiquetas.lbHelp,
		icon: this.dirIconos + 'ayuda.png',
		iconCls: 'btn',
		handler:function() {
        	thisComponent.mostrarAyuda();
        }
	});

	/**
	 * Panel que carga en tabs las funcionalidades a las que el usuario autenticado tiene acceso.
	 */
	this.tabPanelPortal = new Ext.TabPanel({
		plain:true,
		autoHeight: true,
		id: 'tabPanelPortal',
		defaults:{autoScroll: true}
    });

	/**
	 * Panel que contiene la barra de herramientas del portal.
	 */
	this.panelGeneralPortal = new Ext.Panel({
		id: 'panelGeneralPortal',
		region: 'center',
		layout:'fit',
		items: [
			this.tabPanelPortal
		],
		tbar: [
		    this.btnCambiarEntidad,
		    this.btnCambiarClave,
			'-',
		    '->',
			'-',
		    this.btnAyuda,
			'-',
			this.btnCerrarSession,
			'-',
			'<b>' + UCID.portal.perfil.usuario + '</b>'
		]
    });

	/**
	 * Panel que contiene el banner del portal.
	 */
	this.panelBanner = new Ext.Panel({
		region: 'north',
		border: false,
		html: '<div id="bannerPortal" class="bannerPortal" style="display:block"><div class="bIzq"></div><div class="bDer"></div></div>'
	});

	/**
	 * Vista general del portal.
	 */
	this.vistaPortal = new Ext.Viewport({
		layout: 'border',
		items: [
			this.panelBanner,
			this.panelGeneralPortal
		]
	});

	/**
	 * Formulario cambiar la entidad.
	 */
	this.formularioCambiarEntidad = new Ext.FormPanel({
		formId: 'formularioCambiarEntidad',
		frame: true,
		bodyStyle: 'padding:5px 5px 0',
		width: 400,
		style: 'text-align:left',
		autoHeight: 300,
		items: [{
			xtype: 'treepanel',
			autoScroll: true,
			frame: false,
			height: 200,
			bodyStyle: 'background-color:#FFFFFF;',
			listeners: {
				'click': function(nodo) {
					if (nodo.id != 0) {
						Ext.getCmp('btnAceptarCambio').enable();
						iddominio = nodo.id;
					} else {
						if (!newAccess)
							Ext.getCmp('btnAceptarCambio').disable();
						iddominio = null;
					}
				}
			},
			root : new Ext.tree.AsyncTreeNode({
				text : 'Dominio de entidades',
				id : '0'
			}),
			loader : new Ext.tree.TreeLoader({
				dataUrl : 'cargardominio',
				preloadChildren : false,
				baseParams : {}
			})
		}, {
			xtype : 'fieldset',
			style : 'margin-top:10px;',
			title : 'Acceder al sistema',
			autoHeight : true,
			items : [{
				xtype : 'radio',
				hideLabel : true,
				boxLabel : 'Entrar con el usuario autenticado',
				name : 'tipoacceso',
				inputValue : 'ultimo',
				checked : true,
				listeners : {
					'check' : function(obj, ischeck) {
						if (ischeck) {
							if (iddominio == null)
								Ext.getCmp('btnAceptarCambio')
								.disable();
							newAccess = false;
						}
					}
				}
			}, {
				xtype : 'radio',
				hideLabel : true,
				boxLabel : 'Entrar con un usuario diferente',
				name : 'tipoacceso',
				inputValue : 'nuevo',
				listeners : {
					'check' : function(obj, ischeck) {
						if (ischeck) {
							Ext.getCmp('btnAceptarCambio').enable();
							newAccess = true;
						}
					}
				}
			}]
		}]
	});

	/**
	 * Ventana que contiene el formulario para cambiar la entidad.
	 */
	this.ventanaCambiarEntidad = new Ext.Window({
		modal: true,
		closeAction: 'hide',
		layout: 'fit',
		title: 'Cambiar entidad y/o usuario',
		width: 400,
		autoHeight: true,
		items: this.formularioCambiarEntidad,
		buttons: [{
			icon: this.dirIconos + 'cancelar.png',
			iconCls: 'btn',
			text: 'Cancelar',
			handler:function(){
				thisComponent.ventanaCambiarEntidad.hide();
			}
		},{
			id: 'btnAceptarCambio',
			text: 'Aceptar',
			icon: this.dirIconos + 'aceptar.png',
			disabled: true,
			iconCls: 'btn',
			handler: function() {
				thisComponent.entrarAlSistema(true);
			}
		}],
        listeners:{
            hide: function(ventana){
				thisComponent.btnCambiarEntidad.focus();
            }
        }
	});

	/**
	 * Formulario para cambiar la clave de acceso.
	 */
	this.formularioCambiarClave = new Ext.FormPanel({
		frame:true,
		width:100,
		bodyStyle:'padding:5px 5px 0',
		items: [{
			layout:'column',
			items:[{
				columnWidth:5,
				layout:'form',
				items:[{
					xtype:'textfield',
					fieldLabel:'Usuario',
					id:'usuariop',
					labelStyle:'width:200px',
					width:200,
					readOnly:'true'
				},{
					xtype:'textfield',
					inputType:'password',
					fieldLabel:'Contrase&ntilde;a anterior',
					id:'oldpass',
					labelStyle:'width:200px',
					allowBlank:false,
					blankText:'Este campo es requerido',
					width:200
				},{
					xtype:'textfield',
					fieldLabel:'Nueva contrase&ntilde;a',
					inputType:'password',
					blankText:'Este campo es requerido',
					id:'contrasenap',
					labelStyle:'width:200px',
					allowBlank:false,
					width:200
				},{
					xtype:'textfield',
					inputType:'password',
					fieldLabel:'Confirmar nueva contrase&ntilde;a',
					blankText:'Este campo es requerido',
					id:'contrasennap',
					labelStyle:'width:200px',
					width:200,
					allowBlank:false
				}]
			}]
		}]
	});

	/**
	 * Ventana que contiene el formulario para cambiar la clave de acceso.
	 */
	this.ventanaCambiarClave = new Ext.Window({
		modal: true,
		closeAction: 'hide',
		layout: 'fit',
		title: 'Cambiar Contrase&ntilde;a',
		width: 450,
		height: 200,
		items: this.formularioCambiarClave,
		buttons: [{
			icon: this.dirIconos + 'cancelar.png',
			iconCls: 'btn',
			text: 'Cancelar',
			handler:function(){
				thisComponent.ventanaCambiarClave.hide();
			}
		},{
			icon: this.dirIconos + 'aceptar.png',
			iconCls: 'btn',
			text: 'Aceptar',
			handler:function(){
				thisComponent.modificarUsuario();
			}
		}],
        listeners:{
            hide: function(ventana){
				thisComponent.btnCambiarPass.focus();
            }
        }
	});

	/**
	 * Cerrar session.
	 *
	 * @param boolean btnAplicarPresionado - Especifica si el boton aplicar fue presionado.
	 */
	// Funcion que se va a llamar para cerrar la sesion de un usuario autenticado
	this.cerrarSession = function(btnPresionado) {
		if (btnPresionado == 'ok') {
			Ext.getBody().mask('Por favor espere. Tramitando el cierre de la sesi&oacute;n ...');
			Ext.Ajax.request({
				url: 'closeportal',
				callback: function(options, success, response) {
					Ext.getBody().unmask();
					responseData = Ext.decode(response.responseText);
					if (responseData.codMsg)
						mostrarMensaje(responseData.codMsg, responseData.mensaje);
					else if (responseData.close) {
						window.parent.focus();
						window.opener.parent.location.reload();
						window.close();
					}
				}
			});
		}
	}

	/**
	 * Mostrar la ayuda del caso de estudio.
	 */
	this.mostrarAyuda = function() {
		var title	= 'Ayuda de usuario';
        var referencia	= 'portal/portal';
        help.show(title, referencia);
	};

	/**
	 * Cargar las funcionalidades a las que el usuario tiene acceso.
	 */
	this.CargarFuncionalidades = function() {
		Ext.Ajax.request({
			url: 'cargarfuncionalidades',
			method:'POST',
			callback: function (options, success, response){
				var funcionalidades = Ext.decode(response.responseText);
				var primerTab = true;
				Ext.each(funcionalidades, function(item, index){
					var nuevoPanel = new Ext.Panel({
						id: 'tab' + item.idfuncionalidad,
						title: item.text,
						html: '<iframe id="' + item.id + '" src = "/'+ item.referencia +'" style="width:100%; height: 100%; border:none;"></iframe>',
						layout:'fit'
					});
					var tab = thisComponent.tabPanelPortal.add(nuevoPanel);
					if (primerTab == true) {
						tab.show();
						primerTab = false;
					}
				});
			}
		});
	}

	/**
	 * Funcion para acceder al sistema una vez seleccionada la entidad
	 */
	this.entrarAlSistema = function() {
		this.formularioCambiarEntidad.getForm().submit({
			url: 'entraralsistema',
			waitMsg: 'Tramitando entrada ...',
			params: {
				dominio: iddominio
			},
			failure: function(form, action) {
				if (action.result.codMsg)
					mostrarMensaje(action.result.codMsg, action.result.mensaje);
				else if (action.result.reload == false) {
					window.parent.focus();
					window.opener.parent.location.reload();
					window.close();
				} else if (action.result.reload == true) {
					thisComponent.ventanaCambiarEntidad.hide();
					window.opener.parent.location.reload();
					window.location.reload();
				}
			}
		});
	}

	/**
	 * Cambiar clave de acceso.
	 */
	this.cambiarClave = function() {
		if(this.formularioCambiarClave.getForm().isValid()) {
			if(Ext.getCmp('contrasennap').getValue() ==  Ext.getCmp('contrasenap').getValue()) {
				this.formularioCambiarClave.getForm().submit({
					url:'nuevopassword',
					waitMsg:'Cambiando contrase&ntilde;a...',
					failure: function(form, action) {
					   if(action.result.codMsg != 3) {
							mostrarMensaje(1, 'Contrase&ntilde;a cambiada correctamente.');
							Ext.getCmp('oldpass').reset();
							Ext.getCmp('contrasenap').reset();
							Ext.getCmp('contrasennap').reset();
							thisComponent.ventanaCambiarClave.hide();
						} else if (action.result.codMsg)
								mostrarMensaje(action.result.codMsg, action.result.mensaje);
					}
				});
			} else mostrarMensaje(3, 'Debe confirmar la contrase&ntilde;a correctamente.');
		} else mostrarMensaje(3, 'Por favor verifique nuevamente que hay campo(s) con valor(es) incorrecto(s).');
	}

	/**
	 * Agregando el focus al boton adicionar.
	 */
	this.btnCambiarEntidad.focus();

	/**
	 * Cargando las funcionalidaddes del portal.
	 */
	this.CargarFuncionalidades();
};

/**
 * Cargar el perfil del usuario.
 */
UCID.portal.cargarPerfil = function() {
	Ext.Ajax.request({
		url : 'cargarperfil',
		method : 'POST',
		callback : function(options, success, response) {
			if (success) {
				UCID.portal.perfil = Ext.decode(response.responseText);
				UCID.portal.perfil.dirImg = UCID.portal.dir_ext_css + 'images/iconos/';
				UCID.portal.perfil.dirCss = UCID.portal.dir_ext_css + 'css/ext-all.css';
				//Cargando las etiquetas e inicializando la IU.
				UCID.portal.cargarEtiquetas('portal', UCID.portal.Componente);
			} else {
				mostrarMensaje(3, response.responseText);
			}
		}
	});
}

/**
 * Directorio del tema de ExtJS asociado al perfil del usuario
 */
UCID.portal.dir_ext_css = document.getElementById('dir_ext_css').value;

/**
 * Cargando el perfil del usuario.
 */
UCID.portal.cargarPerfil();

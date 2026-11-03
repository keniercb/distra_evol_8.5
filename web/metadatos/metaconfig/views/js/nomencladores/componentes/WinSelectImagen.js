Ext.ns('Window');
Window.Imagen = Ext.extend(Ext.Window, {
		title        : '',
		name         : 'ventanaImagen',
		imagen       : false,
		initComponent: function ()
		{
				miImagen = this;
				miImagen.direccion = "../../../comun/recursos/iconos/grados/";
				this.initTools();
				var stIcono = new Ext.data.Store({
						url   : 'mostrarIconos',
						reader: new Ext.data.JsonReader({
								totalProperty: "cant",
								root         : "datos",
								id           : "valor"
						}, [
								{
										name   : 'id',
										mapping: 'id'
								},
								{
										name   : 'valor',
										mapping: 'valor'
								},
								{
										name   : 'icono',
										mapping: 'icono'
								}
						])
				});
				stIcono.load();
				miImagen.imagenGrado = new Ext.ux.ScreenshotField({
						hideLabel  : true,
						allowUpload: true,
						name       : 'imagenGrado',
						id         : 'imagenGrado',
						width      : 100,
						height     : 44,
						allowBlank : false
				});
				if (miImagen.imagen) {
						miImagen.imagenGrado.setValueBase64(miImagen.imagen);
				}
				miImagen.icono = new Ext.FormPanel({
						layout    : 'column',
						width     : 275,
						frame     : true,
						labelAlign: 'top',
						items     : [
								{
										columnWidth: 1,
										layout     : 'fit',
										bodyStyle  : 'padding: 5px 0 10px 25px;',
										items      : [
												miImagen.imagenGrado
										]
								},
								{
										columnWidth: 1,
										bodyStyle  : 'padding: 10px 0 0 0;',
										layout     : 'form',
										items      : [
												{
														xtype        : 'imagencombo',
														fieldLabel   : 'Icono',
														id           : 'imagencombo',
														value        : (miImagen.modificar) ? miImagen.direccion + miImagen.record.data.abreviatura + '.gif' : '',
														editable     : false,
														allowBlank   : false,
														store        : stIcono,
														iconClsField : 'icono',
														mode         : 'local',
														name         : 'icono',
														hiddenName   : 'imagen',
														valueField   : 'icono',
														displayField : 'valor',
														triggerAction: 'all',
														anchor       : '98%',
														handler      : function ()
														{
																this.store.removeAll();
																this.store.load();
														},
														listeners    : {
																select: function (combo, record)
																{
																		var dir = record.data.icono;
																		miImagen.imagenGrado.setValue("../../" + dir);
																		console.info(miImagen.imagenGrado.getName());
																}
														}
												}
										]
								}
						]
				})
				Ext.apply(this, {
						layout   : 'fit',
						items    : [miImagen.icono],
						width    : 200,
						modal    : true,
						constrain: true,
						height   : 220,
						closable : false,
						buttons  : [
								{
										text   : "Cancelar",
										//icon   : perfil.dirImg + 'cancelar.png',
										iconCls: 'cancelar',
										tooltip: "Cerrar ventana sin guardar los datos",
										id     : "btnCancelar" + miImagen.name,
										handler: function ()
										{
												miImagen.destroy();
										}
								},
								{
										text   : "Aceptar",
										//icon   : perfil.dirImg + 'aceptar.png',
										iconCls: 'aceptar',
										tooltip: "Guardar datos y cerrar ventana",
										id     : "btnAceptar" + miImagen.name,
										handler: function ()
										{
												miImagen.enviar();
										}
								}
						]
				})
				Window.Imagen.superclass.initComponent.apply(this)
		},
		enviar       : function ()
		{
				console.info(miImagen.imagenGrado.getValueBase64());
				Ext.getCmp('imagen').setValue(miImagen.imagenGrado.getValueBase64());
		}
})

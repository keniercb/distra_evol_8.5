Ext.ns('Proyecto.win');
Proyecto.win.AsignarUsuario = new Ext.extend(Ext.Window, {
		idproyecto   : 0,
		etiquetas: etiquetas.proyecto,
		storeProyecto: null,
		initComponent: function ()
		{
				var _this = this;
				/**
				 * Campos a capturar del retorno del pedido de usuarios
				 * @type {Array}
				 */
				_this.fields = [
						{
								name: 'idusuario'
						},
						{
								name: 'usuario'
						},
						{
								name: 'aprueba'
						},
						{
								name: 'ajusta'
						}
				];
				/**
				 * Store del grid de disponibilidad, carga los usuarios que no han sido asignados aun al proyecto
				 * @type {Store}
				 */
				_this.storeDisponibles = new Ext.data.Store({
						url       : 'cargarUsuarios',
						autoLoad  : true,
						baseParams: {
								idproyecto: _this.idproyecto
						},
						reader    : new Ext.data.JsonReader({
								totalProperty: "total_disponible",
								root         : "disponibles"
						}, _this.fields)
				})
				/**
				 * Columnas del grid de disponibilidad
				 * @type {Array}
				 */
				_this.columnsDisponibles = [
						{
								header   : 'Aprueba',
								width    : 70,
								dataIndex: 'aprueba',
								align    : 'center',
								renderer :Go.Column.Render.changeValorIcono
						},
						{
								header   : 'Ajusta',
								width    : 70,
								dataIndex: 'ajusta',
								align    : 'center',
								renderer : Go.Column.Render.changeValorIcono
						},
						{
								header   : 'Usuario',
								dataIndex: 'usuario',
								id       : 'usuario',
								renderer : Go.Column.Ttip.ToolTipColumn
						}
				];
				/**
				 * GRIDS de disponibilidad y asignacion existente
				 * @type {GridPanel}
				 */
				_this.gridDisponibles = new Ext.grid.GridPanel({
						border          : false,
						frame           : true,
						autoExpandColumn: 'usuario',
						id              : 'gridDisponibles',
						ddGroup         : 'gridAsignadosDDGroup',
						enableDragDrop  : true,
						stripeRows      : true,
						store           : _this.storeDisponibles,
						sm              : new Ext.grid.RowSelectionModel({
								singleSelect: false
						}),
						columns         : _this.columnsDisponibles,
						listeners       : {
								rowclick: function ()
								{
										Ext.getCmp('btnallRight').enable();
										Ext.getCmp('btnallLeft').enable();
								}
						},
						loadMask        : {
								store: _this.storeDisponibles
						}

				})
				/**
				 * Columnas del  grid de asignacion existente.
				 * No se puede hacer solo con 1 ya que son iguales debido a que no entiende luego el layout de
				 * cada uno de los grids.
				 * @type {Array}
				 */
				_this.columnsAsignados = [
						{
								header   : 'Aprueba',
								width    : 70,
								dataIndex: 'aprueba',
								align    : 'center',
								renderer : Go.Column.Render.changeValorIcono
						},
						{
								header   : 'Ajusta',
								width    : 70,
								dataIndex: 'ajusta',
								align    : 'center',
								renderer : Go.Column.Render.changeValorIcono
						},
						{
								header   : 'Usuario',
								dataIndex: 'usuario',
								id       : 'usuario',
								renderer : Go.Column.Ttip.ToolTipColumn
						}
				];
				/**
				 * Store del grid de disponibilidad, carga los usuarios que no han sido asignados aun al proyecto
				 * @type {Store}
				 */
				_this.storeAsignados = new Ext.data.Store({
						url       : 'cargarUsuarios',
						autoLoad  : true,
						baseParams: {
								idproyecto: _this.idproyecto
						},
						reader    : new Ext.data.JsonReader({
								totalProperty: "total_asignados",
								root         : "asignados"
						}, _this.fields)
				})
				/**
				 * GRIDS de asignacion existente
				 * @type {GridPanel}
				 */
				_this.gridAsignados = new Ext.grid.GridPanel({
						border          : false,
						height          : 230,
						stripeRows      : true,
						autoExpandColumn: 'usuario',
						id              : 'gridAsignados',
						ddGroup         : 'gridDisponiblesDDGroup',
						enableDragDrop  : true,
						store           : _this.storeAsignados,
						sm              : new Ext.grid.RowSelectionModel({
								singleSelect: false
						}),
						frame           : true,
						columns         : _this.columnsAsignados,
						listeners       : {
								rowclick: function ()
								{
										Ext.getCmp('btnallRight').enable();
										Ext.getCmp('btnallLeft').enable();
								}
						},
						loadMask        : { store: _this.storeAsignados }
				})
				/**
				 * Panel contenedor de los grids
				 * @type {Panel}
				 */
				_this.panel = new Ext.Panel({
						layout  : 'column',
						frame   : true,
						border  : false,
						renderTo: 'asignar_usuarios',
						items   : [
								{
										columnWidth: .47,
										layout     : 'fit',
										items      : [
												{
														xtype     : "fieldset",
														title     : 'Usuarios',
														layout    : 'form',
														autoHeight: true,
														defaults  : {
																height: 230
														},
														items     : [
																_this.gridDisponibles
														]
												}
										]
								},
								{
										columnWidth: .06,
										layout     : 'form',
										bodyStyle  : 'padding: 100px 0 45px 15px ;',
										items      : [
												{
														xtype  : 'button',
														iconCls: 'btn',
														id     : 'btnallRight',
														tooltip: 'Asignar a todos los usuarios disponibles',
														icon   : '/metadatos/comun/recursos/iconos/allRight.gif',
														handler: function ()
														{
																_this.OnClickPasar('allRight');
														}
												},
												{
														xtype : 'panel',
														height: 10
												},
												{
														xtype  : 'button',
														iconCls: 'btn',
														id     : 'btnallLeft',
														tooltip: 'Eliminar la asignación de todos los usuarios',
														icon   : '/metadatos/comun/recursos/iconos/allLeft.gif',
														handler: function ()
														{
																_this.OnClickPasar('allLeft');
														}
												}
										]
								},
								{
										columnWidth: .47,
										layout     : 'fit',
										items      : [
												{
														xtype     : "fieldset",
														title     : 'Asignados',
														layout    : 'form',
														autoHeight: true,
														defaults  : {
																height: 230
														},
														items     : [
																_this.gridAsignados
														]
												}
										]
								}
						]
				});
				/**
				 * CONFIGURACIONES PARA LA CAPTURA DE LOS DROP ENTRE LOS GRIDS
				 */
				var gridDisponiblesDropTargetEl = _this.gridDisponibles.getView().el.dom.childNodes[0].childNodes[1];
				new Ext.dd.DropTarget(gridDisponiblesDropTargetEl, {
						ddGroup   : 'gridDisponiblesDDGroup',
						copy      : true,
						notifyDrop: function (ddSource, e, data)
						{

								// Generic function to add records.
								function addRow(record, index, allItems)
								{

										// Search for duplicates
										var foundItem = _this.storeDisponibles.find('usuario', record.data.name);
										// if not found
										if (foundItem == -1) {
												_this.storeDisponibles.add(record);
												// Call a sort dynamically
												_this.storeDisponibles.sort('usuario', 'ASC');
												//Remove Record from the source
												ddSource.grid.store.remove(record);
										}
								}

								// Loop through the selections
								Ext.each(ddSource.dragData.selections, addRow);
								return(true);
						}
				});
				// This will make sure we only drop to the view container
				var gridAsignadosDropTargetEl = _this.gridAsignados.getView().el.dom.childNodes[0].childNodes[1]
				new Ext.dd.DropTarget(gridAsignadosDropTargetEl, {
						ddGroup   : 'gridAsignadosDDGroup',
						copy      : false,
						notifyDrop: function (ddSource)
						{
								// Generic function to add records.
								function addRow(record)
								{
										// Search for duplicates
										var foundItem = _this.storeAsignados.find('usuario', record.data.name);
										// if not found
										if (foundItem == -1) {
												_this.storeAsignados.add(record);
												// Call a sort dynamically
												_this.storeAsignados.sort('usuario', 'ASC');
												//Remove Record from the source
												ddSource.grid.store.remove(record);
										}
								}

								// Loop through the selections
								Ext.each(ddSource.dragData.selections, addRow);
								_this.gridAsignados.doLayout();
								_this.gridDisponibles.doLayout();
								return true;
						}
				});
				/**
				 * Ventana de asignación de usuarios a proyecto
				 */
				Ext.apply(this, {
						title      : 'Asignar proyecto',
						modal      : true,
						border     : false,
						layout     : 'fit',
						closeAction: 'close',
						bodyStyle  : 'padding:5px;',
						closeAction: 'destroy',
						autoScroll : true,
						width      : 900,
						height     : 355,
						items      : [_this.panel],
						buttons    : [
								{
//										icon   : perfil.dirImg + 'cancelar.png',
										iconCls: 'cancelar',
										scope  : this,
										text   : etiquetas.proyecto.lbBtnCancelar,
										tooltip: etiquetas.proyecto.lbtooltipcancelar,
										handler: function ()
										{
												_this.close();
										}

								},
								{
//										icon   : perfil.dirImg + 'aceptar.png',
										iconCls: 'aceptar',
										tooltip: etiquetas.proyecto.lbtooltipaceptar,
										text   : etiquetas.proyecto.lbBtnAceptar,
										handler: function ()
										{
												_this.guardarConfig();
										}
								}
						]
				});
				Proyecto.win.AsignarUsuario.superclass.initComponent.apply(this)
		},
		OnClickPasar : function (buttonName)
		{
				var _this = this;
				switch (buttonName) {
						case 'allLeft':
								var valores = _this.storeAsignados.getRange();
								_this.storeDisponibles.add(valores);
								_this.storeAsignados.removeAll();
								break;
						case 'allRight':
								var valores = _this.storeDisponibles.getRange();
								_this.storeAsignados.add(valores);
								_this.storeDisponibles.removeAll();
								break;
				}
		},
		guardarConfig: function ()
		{
				var _this = this;
				var idproyecto = _this.idproyecto;
				var stAutorizados = _this.gridAsignados.getStore();
				var stDisponibles = _this.gridDisponibles.getStore();

				var autorizados = [], disponibles = [];
				for (var i = 0; i < stAutorizados.getCount(); i++) {
						autorizados[i] = stAutorizados.getAt(i).data.idusuario;
				}
				for (var i = 0; i < stDisponibles.getCount(); i++) {
						disponibles[i] = stDisponibles.getAt(i).data.idusuario;
				}
				autorizados = Ext.encode(autorizados)
				disponibles = Ext.encode(disponibles)
				Secodena.mostrarMascara('permisos', '', _this.etiquetas.lbAsignandoPermisos);
				Ext.Ajax.request({
						url     : 'asignarUsuarioProyecto',
						params  : {
								idproyecto    : idproyecto,
								asignados   : autorizados,
								disponibles: disponibles
						},
						callback: function (options, success, response)
						{
								var responseData = Ext.decode(response.responseText);
								if (responseData.codMsg != 3) {
										Secodena.ocultarMascara('permisos');
										mostrarMensaje(1, responseData.mensaje);
										_this.storeProyecto.reload();
										_this.destroy();
								}
						}

				})
		}
})
Ext.ns('Go.Int.Especialidad');
Go.Int.Especialidad.Ventana = Ext.extend(Ext.Window, {
		etiquetas: etiquetas.estructura, initComponent: function ()
		{
				var _this = this;
				_this.textBuscar = new Ext.form.TextField({
						frame          : true,
						width          : 150,
						maxLength      : 20,
						vtype          : 'vtalfanumericosguiones',
						enableKeyEvents: true,
						emptyText      : "Criterio a buscar...",
						listeners      : {
								'keyup': function (_tx, state)
								{
										if (_tx.getValue() != "" && _tx.isValid()) {
												_this.btnBuscar.enable();
												_this.btnLimpiar.enable();
										} else {
												_this.btnBuscar.disable();
												_this.btnLimpiar.disable();
										}
								}
						}
				});
				_this.btnBuscar = new Ext.Button({
						iconCls : 'buscar',
						disabled: true,
						tooltip : "<u>B</u>uscar especialidad <b>(Alt+B)</b>",
						handler : function ()
						{
								if (_this.textBuscar.getValue() != '') {
										onBuscarClick();
								} else {
										mostrarMensaje(1, _this.etiquetas.lbSinCritero)
								}
						}
				})
				function onBuscarClick()
				{
						filtrarTree();
				}

				function filtrarTree()
				{
						_this.loaderEspecialidad.baseParams = {
								buscar: _this.textBuscar.getValue()
						};
						_this.treeEspecialidad.getRootNode().reload();
						_this.textBuscar.focus(false, 10);
				}

				_this.btnLimpiar = new Ext.Button({
						iconCls : 'limpiar',
						disabled: true,
						tooltip : "<u>L</u>impiar filtros <b>(Alt+L)</b>",
						handler : function ()
						{
								_this.textBuscar.reset();
								_this.loaderEspecialidad.baseParams = {
										buscar: ""
								};
								_this.treeEspecialidad.root.reload();
								_this.textBuscar.focus(false, 10);
						}
				})
				_this.rutaUrl = 'estructura';
				_this.urlReal = '/metadatos/' + _this.rutaUrl + '/index.php/' + _this.rutaUrl + '/';
				_this.loaderEspecialidad = new Ext.tree.TreeLoader({
						dataUrl: _this.urlReal + 'mostrarEspecialidades'
				});
				_this.loaderEspecialidad.on("load", function (treeLoader, node)
				{
						var hijos = node.childNodes.length;
						if (hijos == 0) {
								mostrarMensaje("1", "No existen datos que se correspondan con los criterios de búsqueda especificados.");

						}
				})
				_this.treeEspecialidad = new Ext.tree.TreePanel({
						autoScroll     : true,
						width          : 300,
						height         : 600,
						margins        : '0 0 0 2',
						rootVisible    : true,
						layoutConfig   : {
								animate: true
						},
						region         : 'west',
						enableDD       : false,
						containerScroll: true,
						loader         : _this.loaderEspecialidad,
						tbar           : ['', _this.textBuscar, '', '-', _this.btnBuscar, _this.btnLimpiar],
						keys           : [{
								key: Ext.EventObject.ENTER, fn: function ()
								{
										_this.btnBuscar.handler.call();
								}
						}, {
								key: 'b', alt: true, fn: function ()
								{
										_this.btnBuscar.handler.call();
								}
						}, {
								key: 'l', alt: true, fn: function ()
								{
										_this.btnLimpiar.handler.call();
								}
						}],
						listeners      : {
								click: function (n)
								{
										if (!isNaN(n.attributes.id)) {
												_this.componentForValue.setValue(n.attributes.denominacion);
												_this.componentForValueID.setValue(n.id);
												_this.destroy();
										} else {
												mostrarMensaje(6, _this.etiquetas.lbMsgDebeSeleccionarEspecialidad);
										}
								}
						}
				});
				_this.rootEspecialidad = new Ext.tree.AsyncTreeNode({
						text: 'Especialidades', id: 'Especialidades'
				});
				_this.treeEspecialidad.setRootNode(_this.rootEspecialidad);
				_this.rootEspecialidad.expand();
				Ext.apply(this, {
						title      : _this.etiquetas.lbEspecialidades,
						layout     : 'fit',
						items      : [_this.treeEspecialidad],
						width      : 550,
						modal      : true,
						height     : 400,
						constrain  : true,
						closeAction: 'hide',
						plain      : true
				});
				Go.Int.Especialidad.Ventana.superclass.initComponent.apply(this);
		}
})
Ext.QuickTips.init();
Ext.ns('Configuracion.nomencladores');
Configuracion.nomencladores.panel = Ext.extend(Ext.Panel, {
		title          : etiquetas.general.lbNomencladores,
		border         : false,
		layout         : 'fit',
		viewport       : null,
		contenedor     : null,
		getPanelGestion: function ()
		{
				return this.panelesGestion;
		},
		initComponent  : function ()
		{
				var _this = this;
				_this.panelesGestion = new Ext.Panel({
						border   : false,
						disabled : false,
						layout   : 'fit',
						listeners: {
								render: function ()
								{
										var $contenedor = $('<div/>', {
												id     : 'preview',
												'class': 'preview'
										});
										var $contenedorIcon = $('<div/>', {
												id     : 'previewI',
												'class': 'preview'
										});
										var $imagen = $('<img>', {
												id    : 'previewImage',
												width : 120,
												height: 60
										})
										var $icon = $('<img>', {
												id: 'previewIcon'
										})
										var areaTrabajo = this.getEl().dom;
										$imagen.appendTo($contenedor);
										$icon.appendTo($contenedorIcon);
										$contenedor.appendTo(areaTrabajo);
										$contenedorIcon.appendTo(areaTrabajo);
								}
						}
				});
				_this.tabPanelNomencladores = new Configuracion.nomencladores.TabPanel({
						viewport  : _this.viewport,
						contenedor: _this.panelesGestion
				});
				_this.panelesGestion.add(_this.tabPanelNomencladores);
				_this.nomencladores = _this.tabPanelNomencladores.getNodes();
				_this.rootNode = new Ext.tree.AsyncTreeNode({
						text    : etiquetas.general.lbNomencladores,
						expanded: true,
						children: _this.nomencladores
				});
				_this.treeConfiguraciones = new Ext.tree.TreePanel({
						loader     : new Ext.tree.TreeLoader(),
						autoScroll : true,
						border     : false,
						rootVisible: true,
						root       : _this.rootNode,
						listeners  : {
								click: function (node)
								{
										_this.tabPanelNomencladores.onClick(node);
								}
						}
				});
				Ext.apply(this, {
						iconCls  : 'nomencladores',
						id       : 'configNomencladores',
						bodyStyle: { maxHeight: '420px' },
						items    : [_this.treeConfiguraciones]
				});
				Configuracion.nomencladores.panel.superclass.initComponent.apply(this);
		},
		ajustar        : function (id)
		{
				Ext.getCmp(id).doLayout();
		}
});
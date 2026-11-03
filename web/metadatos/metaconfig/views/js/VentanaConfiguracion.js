Ext.QuickTips.init();

var perfil = window.parent.UCID.portal.perfil
Ext.ns('Configuracion');

Ext.Ajax.request({
	url: 'cargaracciones',
	method: 'POST',
	params: {
		idfuncionalidad: window.frameElement.id
	},
	callback: function (options, success, response) {
		if (success) {
			UCID.acciones[window.frameElement.id] = {};
			acciones_reportes = Ext.decode(response.responseText);

			ACCIONES_ABREVIATURA = {};
			for (let index = 0; index < acciones_reportes.length; index++) {
				ACCIONES_ABREVIATURA[acciones_reportes[index]['abreviatura']] = true;
			}
			
			Configuracion.Viewport = Ext.extend(Ext.Viewport, {
					title                : '',
					layout               : 'fit',
					initComponent        : function ()
					{
							var _this = this;
							_this.eventCollapse = 0;
							_this.acordionConceptos = new Configuracion.conceptos.panel({
									viewport  : _this,
									contenedor: _this.panelesGestion,
									listeners : {
											collapse: function ()
											{
													_this.panelConceptos.hide();
											},
											expand  : function ()
											{
													_this.colapsarTodos(this);
													_this.construirPanelElement(1);
											}
									}
							});
							_this.acordionNomencladores = new Configuracion.nomencladores.panel({
									viewport  : _this,
									contenedor: _this.panelesGestion,
									listeners : {
											collapse: function ()
											{
													_this.panelNomencladores.hide();
											},
											expand  : function ()
											{
													_this.colapsarTodos(this);
													_this.construirPanelElement(2);
											}
									}
							});
							_this.acordionGenerales = new Configuracion.general.panel({
									viewport : _this,
									id       : 'configRestricciones',
									hidden   : true,
									listeners: {
											collapse: function ()
											{
													_this.panelGeneral.hide();
											},
											expand  : function ()
											{
													_this.colapsarTodos(this);
													_this.construirPanelElement(3);
											}
									}
							});
							_this.panelConceptos = _this.acordionConceptos.getPanelGestion();
							_this.panelNomencladores = _this.acordionNomencladores.getPanelGestion();
							_this.panelGeneral = _this.acordionGenerales.getPanelGestion();
							_this.contenedorAcordion = new Ext.Panel({
									region      : 'west',
									id          : 'panel-config',
									title       : etiquetas.general.lbTitle,
									width       : 290,
									minWidth    : 180,
									maxWidth    : 290,
									split       : true,
									margins     : '0 0 0 5',
									layout      : 'accordion',
									layoutConfig: {
											animate: true
									},
									listeners   : {
											collapse: function ()
											{
													_this.panelesGestion.doLayout();
											}
									},
									items       : [
											_this.acordionConceptos, _this.acordionNomencladores, _this.acordionGenerales
									]
							})
							_this.panelesGestion = new Ext.Panel({
									region  : 'center',
									id      : 'panelGestionConfiguracion',
									border  : false,
									disabled: false,
									layout  : 'ux.row',
									defaults: {
											rowHeight: 1,
											width    : '100%'
									},
									items   : [_this.panelConceptos, _this.panelNomencladores, _this.panelGeneral]
							});
							_this.btnAyuda = new Ext.Button({
									//icon   : perfil.dirImg + 'ayuda.png',
									iconCls: 'ayuda',
									id     : 'btnAyudaConfig',
									tooltip: etiquetas.general.tooltipAyuda,
									text   : etiquetas.general.lbBtnAyuda,
									hidden : false
			
							});
							_this.panelSuperior = new Ext.Panel({
									layout: 'border',
									tbar  : ['->', _this.btnAyuda],
									items : [_this.contenedorAcordion, _this.panelesGestion]
							});
							Ext.apply(this, {
									items    : _this.panelSuperior,
									listeners: {
											afterlayout: function ()
											{
													var items = _this.panelesGestion.items;
													for (var i = 0; i < items.length; i++) {
															items[i].doLayout();
													}
											}
									}
							});
							Configuracion.Viewport.superclass.initComponent.apply(this);
					},
					hideAll              : function ()
					{
							var _this = this;
							_this.panelConceptos.hide();
							_this.panelNomencladores.hide();
							_this.panelGeneral.hide();
					},
			
					colapsarTodos        : function (acordion)
					{
							var _this = this;
							var items = _this.panelesGestion.items;
							for (var i = 0; i < items.length; i++) {
									if (items[i] && items[i].id != acordion.id) {
											items[i].collapse();
									}
							}
					},
					colapsarAcordion     : function (acordion)
					{
							if (!acordion.collapsed && !acordion.hidden) {
									acordion.collapse();
							}
					},
					construirPanelElement: function (configuracion)
					{
							var _this = this;
							_this.hideAll();
							switch (configuracion) {
									case 1:
											_this.panelConceptos.show();
											break;
									case 2:
											_this.panelNomencladores.show();
											break;
									case 3:
											_this.panelGeneral.show();
											break;
							}
							_this.panelesGestion.doLayout();
					}
			});
			var viewport = new Configuracion.Viewport({
					id: 'viewportConfiguracion'
			});
		}
	}
});
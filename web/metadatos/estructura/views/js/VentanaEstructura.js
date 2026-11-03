Ext.onReady(function ()
{
		Ext.QuickTips.init();
		var perfil = window.parent.UCID.portal.perfil;
		this.UCID.portal.cargarEtiquetas('gestionarestructura', cargarInterfaz);
		function cargarInterfaz(perfil)
		{
				var panelEstructura = new Gestion.Panel.Estructura({
						perfil: perfil, isestructura: true, reportes: true, checher: true
				})
				new Ext.Viewport({
						layout: 'fit', id: 'ventanaEstructura', items: [panelEstructura]
				})
		}
})

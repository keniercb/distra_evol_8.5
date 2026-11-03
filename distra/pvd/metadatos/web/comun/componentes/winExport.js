Ext.ns('Go.Pdf');
Go.Pdf.Visor = Ext.extend(Ext.Window, {
		title        : 'Visor de contenido',
		params       : null,
		resizable    : true,
		url          : '',
		idIframe     : null,
		initComponent: function ()
		{
				var _this = this;
				this.initTools();
				Ext.apply(this, {
						width          : (screen.width / 2) + 50,
						height         : (screen.height / 2) + 50,
						animCollapse   : false,
						maximizable    : true,
						constrain      : true,
						constrainHeader: false,
						modal          : false,
						border         : false,
						items          : {
								xtype     : 'component',
								autoScroll: true,
								autoEl    : {
										tag  : 'iframe',
										id   : _this.idIframe,
										style: 'height: 100%; width: 100%; border: none',
										src  : _this.url + '?' + _this.params
								}
						},
						buttons        : [
								{
										text   : 'Cerrar',
//										icon   : perfil.dirImg + 'cancelar.png',
										iconCls: 'cerrar',
										scope  : this,
										tooltip: "Cerrar ventana",
										handler: function ()
										{
												this.destroy();
										}
								}
						]
				});
				Go.Pdf.Visor.superclass.initComponent.apply(this)
		}
});


Ext.ns('Win');
Win.Pdf = Ext.extend(Ext.Window, {
    title: 'Visor de contenido',
    params: null,
    resizable: true,
    url: '',
    idIframe: null,
    vigor: true,
    idproyecto:null,
    store:null,
    panelTab:null,
    initComponent: function () {
        var _this = this;
        this.initTools();
        Ext.apply(this, {
            width: (screen.width / 2) + 50,
            height: (screen.height / 2) + 50,
            animCollapse: false,
            maximizable: true,
            constrainHeader: false,
            modal: false,
            border: false,
            items: {
                xtype: 'component',
                autoScroll: true,
                autoEl: {
                    tag: 'iframe',
                    id: _this.idIframe,
                    style: 'height: 100%; width: 100%; border: none',
                    src: _this.url + '?' + _this.params
                }
            },
            buttons: [
                {
                    text: 'Cerrar',
                    iconCls: 'cancelar',
                    scope: this,
                    handler: function () {
                        this.destroy();
                    }
                },
                {
                    text: 'Poner en vigor',
                    iconCls: 'aprobar',
                    hidden: this.vigor,
                    scope: this,
                    handler: function () {
                        this.destroy();
                        mostrarMensaje(2, "¿Está seguro que quiere poner en vigor el proyecto seleccionado?", function (btn) {
                            var id = _this.idproyecto;
                            var tab = Ext.getCmp('ajuste' + id);
                            if (tab != null && tab != undefined) {
                                _this.panelTab.remove(tab);
                            }
                            eventoProyecto('aprobar', btn, 'del proyecto', 'proyecto', id, _this.store, 'tfFiltroDenoP');
                        })
                    }
                }
            ]
        });
        Win.Pdf.superclass.initComponent.apply(this)
    }
})
Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.WinBuscarPersona = Ext.extend(Ext.Window, {
    layout: 'border',
    id: 'winBusPer',
    title: 'Buscar persona',
    width: 800,
    height: 540,
    closeAction: 'close',
    closable: true,
    modal: true,
    initComponent: function () {
        var self = this;

        
        this.pBuscarPersona = new Ext.components.CmpReccomplejas.Interfaz({
					margins: '5 0 5 0',
					title: 'Reporte de personas',
					width: '100%',
					height: 430,
					singleSelect: false,
					region: 'center',
					border: true,
					idconfiguracion: 'personas',
					tituloReporte: 'Reporte de personas',
					tituloConfiguracion: 'Configuración de la búsqueda',
					tituloGrid: 'Listado de personas',
					mainToolBar: ['->', {
						text: 'Ayuda',
						iconCls: 'ayuda'
					}],
					hideBtnRtf: false,
					noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
					useMap: false,
					hideBtnOperCant: false,
					autoLoadList: false,
					renderers: getRenderes()
				});
        
        
        this.pBuscarPersona.pReporte.gpReporte.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
					if(sm)
					{
						btnAceptarBusPer.enable();
						btnCancelarBusPer.enable();						
						self.parent.getStore().load({params: {idpersona: rec.data.idpersona, start: 0, limit: 15}});
						self.parent.recordPersonaGrid=rec;
					}
	 });
            var btnCancelarBusPer = new Ext.Button({
            id: 'btnCancelarBusPer',
            iconCls: 'cancelar',
            text: labels.lbBtnCancelar,
            tooltip: labels.ttpBtnCancelar,
            handler: function () {
                self.close();
            },
            nextTab: 'btnAceptarBusPer'
        });


        var btnAceptarBusPer = new Ext.Button({
            id: 'btnAceptarBusPer',
            iconCls: 'aceptar',
            text: labels.lbBtnAceptar,
            tooltip: labels.ttpBtnAceptar,
            disabled: true,
            handler: function () {
                self.fireEvent('peopleSelected', self.pBuscarPersona.pReporte.gpReporte.getSelectionModel().getSelections());
            },
            prevTab: 'btnCancelarBusPer'
        });       

        this.items = [self.pBuscarPersona];
        this.buttons = [btnCancelarBusPer, btnAceptarBusPer];
        	function getRenderes() {
        return Ext.apply({
            showSexo: function (val) {
                if (val == 0) {
                    return '<center><img src="/pvd/credenciales/views/images/female.png" /></center>';
                } else {
                    return '<center><img src="/pvd/credenciales/views/images/male.png" /></center>';
                }
            }, showGradoMilitar: function (val, opt, rec) {
                // grado
                if (!Ext.isEmpty(val)) {
                    return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                } else {
                    return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                }
            }
        });
    };	
        Ext.components.Evaluaciones.WinBuscarPersona.superclass.initComponent.call(this);
    }
});

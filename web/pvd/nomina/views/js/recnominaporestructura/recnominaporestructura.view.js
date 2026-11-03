Ext.ns('Pvd.Nomina.Recuperaciones.RecNominaporEstructura');
Ext.QuickTips.init();

Pvd.Nomina.Recuperaciones.RecNominaporEstructura.Vista = {
    init: function(perfil, idioma, modelo){

        //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstEntidades = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 3
        });

        //Botón  para cargar las personas pertenecientes a la unidad selecionada.
        this.btnAceptarEntidades = new Ext.Button({
            id: 'btnAceptarEntidades',
            text: idioma.btnAceptar,
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        });         

        //Vista para el componente Buscar estructura 
        this.winEstEntidades = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: '30%',
            closable:false,
            constrain: true,
            resizable:false,
            layout: 'fit',
            items:[this.pEstEntidades],
            buttons: [this.btnAceptarEntidades]
       });
       
       this.objListarPeriodosPagos = new Pvd.Nomina.ElaborarPago.ListarPeriodosPago({

		});
		
		this.btnAceptarPeriodosPagos = new Ext.Button({
            id: 'btnAceptarPeriodosPagos',
            text: idioma.btnAceptar,
            tooltip: '',
            disabled: true,
            iconCls: 'aceptar'
        }); 
       
       this.winPeriodosPagos = new Ext.Window({
            title: 'Per&iacute;odos de pago',
            modal: true,
            height: 400,
            width: 500,
            closable:true,
           constrain: true,
            closeAction: 'hide',
            resizable:false,
            layout: 'border',
            items: [this.objListarPeriodosPagos],
            buttons: [this.btnAceptarPeriodosPagos]
       });
       
       //Panel de estructura y composición que cargo hasta el nivel de entidades.
        this.pEstructuras = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            nivel: 5, 
            width: 300,
            region: 'west',
            border: true,
            split: true
        });
       
       this.gpNominaPersonas = new Ext.grid.GridPanel({
            region: 'center',
			split: true,
            layout: 'fit',
            split: true,
            store: new Ext.data.SimpleStore({
				fields: [{name: 'id'}]
			}),
            autoScroll: true,
            stripeRows: true,
            cm: new Ext.grid.ColumnModel([{header: "Elementos...", width: 200, sortable: true, dataIndex: 'id'}]),
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:false,
                listeners: {
                    rowselect: function(sel, i, r){
                    }.createDelegate(this)
                }
            })
		});
       
       this.pNominaPersonas = new Ext.Panel({
		   title: 'N&oacute;mina',
            height: 400,
            width: 500,
            region: 'center',
            border: true,
            split: true,
            items: [this.gpNominaPersonas]
       });
       
       this.winRecNominaporEstructura = new Ext.Window({
			title: 'N&oacute;minas por estructuras',
			height: 600,
			width: 800,
           constrain: true,
			closeAction: 'hide',
			layout: 'border',
			items:[this.pEstructuras, this.pNominaPersonas]
		});
       
       
    }   
}

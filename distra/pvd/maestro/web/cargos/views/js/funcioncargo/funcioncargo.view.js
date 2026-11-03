/**
 * Autora: Mayler Navarro Diaz
 */
Ext.ns('PVD.Persona.FuncionCargo');
Ext.QuickTips.init();
PVD.Persona.FuncionCargo.Vista = {
	init: function (idioma, modelo) {
        //Botón ayuda
		this.btnAyuda = new Ext.Button({
			id: 'btnAyuda',
			text: 'Ayuda',
			iconCls: 'ayuda',
			disabled: false,
			tooltip: 'Mostrar ayuda de la funcionalidad'
		});

		this.tpEstructura = new Ext.estructura.panel.PanelEstructura({
			border: false,
			width: '20%',
			inicial: perfil.idestructuracomun,
			split: true,
			region: 'center'
		});


		this.gpCargos = new Ext.Panel({
            title: 'Listado de cargos',
			layout: 'fit',
			items: [this.tpEstructura]
		});

		this.btnAdd = new Ext.Button({
			id: 'btnAdd',
			text: idioma.lbBtninsertar,
			disabled: true,
			tooltip: idioma.ttBtnAdicionar,
			iconCls: 'adicionar'
		});

		this.btnMod = new Ext.Button({
			id: 'btnMod',
			text: idioma.lbBtnmodificar,
			disabled: true,
			tooltip: idioma.ttBtnModificar,
			iconCls: 'modificar'
		});

		this.btnDel = new Ext.Button({
			id: 'btnDel',
			text: idioma.lbBtnEliminar,
			disabled: true,
			tooltip: idioma.ttBtnEliminar,
			iconCls: 'eliminar'
		});
		this.smListado1 = new Ext.grid.RowSelectionModel({
			listeners: {}
		});

		this.gpFuncioncargo = new Ext.grid.GridPanel({
          //  title: 'Listado de especializaciones de cargos',
            store: modelo.stFuncionCargos,
			margins: '5 5 5 5',
			sm: this.smListado1,
			columns: [

                {header: 'Descripci&oacute;n',  width:600, dataIndex: 'denominacion'},
				{header: "Espec&iacute;ficas", hidden: true, sortable: true, dataIndex: "especifica", renderer: function (v)
				{
					return (v == 0) ? 'Generales' : 'Espec&iacute;ficas';
				}}
            ],
			viewConfig: {forceFit: true},
			view: new Ext.grid.GroupingView({
				forceFit: true,
				startCollapsed: true,
				groupTextTpl: '{group}'
			}),
			tbar:[this.btnAdd, this.btnMod, this.btnDel],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stFuncionCargos,
                displayMsg: 'Mostrando {0} - {1} de {2} ',
                emptyMsg: 'No hay elementos que mostrar',
                displayInfo: true
            })
        });	
		
		this.btnAceptar = new Ext.Button({
			iconCls: 'aceptar',
            tooltip: idioma.lbBtnAcep,
			text: 'Aceptar'
		}); 
		
		this.btnAplicar = new Ext.Button({
			iconCls: 'aplicar',
            tooltip: idioma.lbBtnAplic,
			text: 'Aplicar'
		}); 
		
		this.btnCancelar= new Ext.Button({
			iconCls: 'cancelar',
            tooltip: idioma.lbBtnCanc,
			text: 'Cancelar'
		}); 
		
		this.tfDenominacion = new Ext.form.TextArea({
            id: 'tfDenominacion',
            fieldLabel: 'Descripci&oacute;n',
            minLength: 3,
            maxLength: 255,
            allowBlank: true,            
            enableKeyEvents: true,
            width: '100%',
            name: 'denominacion'
        });
		
		this.fpDatos = new Ext.FormPanel({
			frame: true,
			width: '100%',
            bodyStyle: 'padding: 7px 7px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
			items: [this.tfDenominacion]
		});	
			
		this.winGest = new Ext.Window({
			modal: true,
			closeAction: 'hide',
			autoScroll: true,
			title: 'Adicionar Funci&oacute;n',
			width: 360,
			height: 200,
			items: [this.fpDatos],
			buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]
		});	
     
		this.Viewport = new Ext.Viewport(
		{
			layout: 'border',			
			items: [{
				region: 'north',
				xtype: 'panel',
				layout:'fit',
				id: 'panelsup',
				border: false,
				tbar: ['->', this.btnAyuda]
			},{
				region: 'west',
				layout:'fit',
				xtype: 'panel',
				split: false,
				border: false,
				style: 'padding: 5px 0px 0px 5px',
				width:'40%',
				items: this.gpCargos
			},
			{
				region: 'center',
				layout:'fit',
				xtype: 'panel',
				split: false,
				border: false,
				style: 'padding: 5px 0px 0px 5px',
				width:'60%',
				items: this.gpFuncioncargo
			}] 
		});        
    }
};

UCID.portal.cargarEtiquetas('funcioncargo', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
		idioma = (idioma) ? idioma : perfil.etiquetas;       
		 //Inicializando el modelo
		var modelo = PVD.Persona.FuncionCargo.Modelo;
		modelo.init();
		
		//Inicializando la vista.
		var vista = PVD.Persona.FuncionCargo.Vista;
		vista.init(idioma, modelo);
		
		//Inicializar controlador.
		var controller = PVD.Persona.FuncionCargo.Controlador;
		controller.init(idioma, vista, modelo);
});
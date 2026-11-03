/**
 * Autora: Yaricel Guerra Velázquez
 */
Ext.ns('PVD.Persona.ConfigEspecializacionCargo');
Ext.QuickTips.init();
PVD.Persona.ConfigEspecializacionCargo.Vista = {
	init: function (idioma, modelo) {
        //Botón ayuda
		this.btnAyuda = new Ext.Button({
			id: 'btnAyuda',
			text: 'Ayuda',
			iconCls: 'ayuda',
			disabled: false,
			tooltip: 'Mostrar ayuda de la funcionalidad'
		});

        this.tfBuscar = new Ext.form.TextField({
            id: 'search' + self.id,
            width: 140,
            allowBlank: true,
            emptyText: 'Criterio a buscar...',
            regexp: /^([a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
            minLength: 1
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            id: 'btnBuscar' + self.id,
            text: idioma.lbBtnBuscar,
            tooltip: idioma.textToolTipBuscar
        });

        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar' + self.id,
            text: idioma.lbBtnLimpiar,
            tooltip: idioma.textToolTipLimpiar,
            iconCls: 'limpiar'
        });

		this.gpCargos = new Ext.grid.GridPanel({
            title: 'Listado de cargos',
            store: modelo.stCargos,
			margins: '5 5 5 5',
            tbar: ['Denominaci&oacute;n del cargo: ', this.tfBuscar, this.btnBuscar, this.btnLimpiar],
            columns: [
                {header: 'Denominaci&oacute;n del cargo',  width: 650, dataIndex: 'denominacion'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stCargos,
                displayMsg: 'Mostrando {0} - {1} de {2} ',
                emptyMsg: 'No hay elementos que mostrar',
                displayInfo: true
            })
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
		
		this.gpHomologaciones = new Ext.grid.GridPanel({
            title: 'Listado de especializaciones de cargos',
            store: modelo.stHomologacionesCargos,			
			margins: '5 5 5 5',
            columns: [
                {header: 'Denominaci&oacute;n de la especializaci&oacute;n',  width:600, dataIndex: 'denominacion'}
            ],
			tbar:[this.btnAdd, this.btnMod, this.btnDel],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stHomologacionesCargos,
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
		
		this.tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacion',
            fieldLabel: 'Denominaci&oacute;n',
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
			
		this.winGestionar = new Ext.Window({
			modal: true,
			closeAction: 'hide',
			autoScroll: true,
			title: 'Adicionar especializaci&oacute;n a cargo',
			width: 360,
			height: 139,
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
				width:'50%',
				items: this.gpCargos
			},
			{
				region: 'center',
				layout:'fit',
				xtype: 'panel',
				split: false,
				border: false,
				style: 'padding: 5px 0px 0px 5px',
				width:'50%',
				items: this.gpHomologaciones
			}] 
		});        
    }
};

UCID.portal.cargarEtiquetas('configespecializacioncargo', function(perfil, idioma){		
    //Escogiendo la configuración del idioma según la versión del MT.
		idioma = (idioma) ? idioma : perfil.etiquetas;       
		 //Inicializando el modelo
		var modelo = PVD.Persona.ConfigEspecializacionCargo.Modelo;
		modelo.init();
		
		//Inicializando la vista.
		var vista = PVD.Persona.ConfigEspecializacionCargo.Vista;
		vista.init(idioma, modelo);
		
		//Inicializar controlador.
		var controller = PVD.Persona.ConfigEspecializacionCargo.Controlador;
		controller.init(idioma, vista, modelo);
});
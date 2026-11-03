Ext.ns('Ext.component.persona');

Ext.component.persona.Vista={

	init: function(perfil, idioma, modelo) {
		/*----------------  FORMULARIO  ----------------*/
		//Botón aceptar
		this.btnAceptar = new Ext.Button({
			id      : 'btnAceptar',
			text    : idioma.lbBtnAceptar,
			tooltip : idioma.ttBtnAceptar,
			iconCls : 'aceptar'
		});

        this.btnAplicar = new Ext.Button({
            id      : 'btnModificar',
            text    : 'Aplicar',
            tooltip : 'Guardar datos y limpiar campos </b>(Ctrl+Alt+P)<b>',
            iconCls : 'aplicar'
        });

		//Botón cancelar
		this.btnCancelar = new Ext.Button({
			id      : 'btnCancelar',
			text    : idioma.lbBtnCancelar,
			tooltip : idioma.ttBtnCancelar,
			iconCls : 'cancelar'
		});

		this.lbBuscarPers = new Ext.form.Label({
			text: 'Buscar persona:',
			hidden: false
		});

		this.sfBuscar = new Ext.app.SearchField({
			store: modelo.stPersonas,
			pageSize: 15
		});

		this.smselect = new Ext.grid.CheckboxSelectionModel({
			singleSelect: true
		});

		this.columnasgp = new Ext.grid.ColumnModel([
			this.smselect,
			/*{
				header: 'Area',
				width: 100,
				hidden: true,
				dataIndex: 'entidad_area'
			},*/
			{
				header: 'No. de identidad',
				width: 150,
				dataIndex: 'numid'
			},
			{
				header: 'Apellidos y nombres',
				width: 350,
				dataIndex: 'nombreyapellidos'
			},
			{
				header: 'Cargo',
				width: 300,
				dataIndex: 'cargo'
			}
		]);

		//Listado de personas.
		this.gpPersonas = new Ext.grid.GridPanel({
			title: 'Listado de personas',
			region: 'center',
			tbar: [this.lbBuscarPers, this.sfBuscar],
			loadMask: {msg: 'Cargando...'},
			store: modelo.stPersonas,
			/*view: new Ext.grid.GroupingView({
				forceFit: true,
				startCollapsed: false,
				groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
			}),*/
			autoScroll: true,
			sm: this.smselect,
			cm: this.columnasgp,
			bbar: new Ext.PagingToolbar({
				pageSize: 15,
				store: modelo.stPersonas,
				displayInfo: true
			})
		});

		//Combobox para la causa de limitación
		this.cbCausa = new Ext.form.ComboBox({
            name           : 'cbCausa',
			triggerAction  :   'all',
			id             : 'idcausa',
			fieldLabel     : idioma.lbCBCausaLimit,
			//labelSeparator : ' ',
			anchor         : '98%',
			forceSelection : true,
			editable       : false,
			store          : modelo.storeCausas,
			displayField   : 'dencausa',
			valueField     : 'idcausa',
			queryMode      : 'local',
			emptyText      : "Seleccione...",
			typeAhead      : true,
            allowBlank     : false
        });
		//Fecha desde
		this.dfDesde = new Ext.form.DateField({
            name: 'fdesde',
            fieldLabel     : idioma.lbDFfdesde,
			//labelSeparator : ' ',
            anchor         : '98%',
            format         : 'd/m/Y',
            editable       : true,
            readOnly       : false,
            allowBlank     : false,
            value          : new Date().format('d/m/Y')
        });
		//Fecha hasta
		this.dfHasta = new Ext.form.DateField({
            name           : 'dfHasta',
            fieldLabel     : idioma.lbDFfhasta,
			//labelSeparator : ' ',
            anchor         : '98%',
            format         : 'd/m/Y',
            editable       : true,
            readOnly       : false,
            allowBlank     : true
        });
		//Formulario
		this.fpDatos = new Ext.FormPanel({
			layout     : 'column',
			frame      : true,
			region     : 'south',
			width      : '100%',
			autoHeight : true,
			autoShow   : true,
			labelAlign: 'top',
			items      : [{
							columnWidth : 0.40,
							layout      : 'form',
							items       : [this.cbCausa]
						},{
							columnWidth : 0.30,
							layout      : 'form',
							items       : [this.dfDesde]
						},{
							columnWidth : 0.30,
							layout      : 'form',
							items       : [this.dfHasta]
						}]
    	});

		this.winAdicionar = new Ext.Window({
			title: 'Adicionar limitaci&oacute;n',
			closeAction: 'hide',
			constrain: true,
			width: 800,
			height: 600,
			resizable: false,
			layout: 'border',
			modal: true,
			buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar],
			items: [this.gpPersonas, this.fpDatos]

		});

		/*----------------  PANEL PRINCIPAL  ----------------*/
		//Botón para adicionar reserva
		this.btnAdicionar = new Ext.Button({
			id      : 'btnAdicionar',
			text    : idioma.lbBtnAdicionar,
			tooltip : idioma.ttBtnAdicionar,
			iconCls : 'adicionar'
		});

        this.btnModificar = new Ext.Button({
            id      : 'btnModificar',
            text    : 'Modificar',
            tooltip : 'Modificar limitación <b>(Alt+M)</b>',
            iconCls : 'modificar'
        });

        this.btnRemove = new Ext.Button({
            id      : 'btnRemove',
            text    : 'Eliminar',
            tooltip : 'Eliminar limitación <b>(Del)</b>',
            iconCls : 'eliminar'
        });
		this.btnExportar = new Ext.Button({
			id      : 'btnExportar',
			text    : 'Exportar',
			tooltip : 'Exportar <b>(Alt+E)</b>',
			iconCls : 'exportar'
		});

        this.searchField = new Ext.app.SearchField({
            store: modelo.store

        });
		//Botón Ayuda
		this.btnAyuda = new Ext.Button({
			id      : 'btnAyuda',
			text    : idioma.lbBtnAyuda,
			tooltip : idioma.lbBtnAyuda,
			iconCls : 'ayuda'
		});

		this.gpLimitados = new Ext.grid.GridPanel({         
            title: 'Listado de limitados',
            width: '100%',  
            region:'center',
            border: false,         
            stripeRows: true,
			loadMask: {msg: 'Cargando...'},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                startCollapsed: true,
                groupTextTpl: '{group}'
            }),
			tbar: ['Buscar persona: ', this.searchField],
            store: modelo.store,                    
            columns    : [
                {id : 'numid',      header: 'No. de identidad',            dataIndex: 'numid',         menuDisable: true, sortable : true},
                {id : 'idnombre',        header : 'Apellidos y nombres',            dataIndex : 'nombreyapellidos',          menuDisabled : true, sortable : true},
				{id : 'causa',        header : 'Causa de limitación',            dataIndex : 'causa',          menuDisabled : true, sortable : true},
				{id : 'idfdesde',       header : 'Fecha inicio',     dataIndex : 'fdesde',         menuDisabled : true, sortable : true},
				{id : 'idfhasta',       header : 'Fecha fin',        dataIndex : 'fhasta',         menuDisabled : true, sortable : true},
				{id : 'ueb',       hidden : true,        dataIndex : 'ueb',         menuDisabled : true, sortable : true}
			],
            bbar:new Ext.PagingToolbar({
                pageSize: 15,
                store:modelo.store,
                displayMsg: 'Mostrando {0} - {1} de {2} ',
                emptyMsg: 'No hay elementos que mostrar',
                displayInfo: true
            })
        }); 
		//Panel principal
		this.pPrincipal = new Ext.Panel({			
			region     : 'center',
			layout     :'fit',
			width      : '100%',
			autoScroll : true,
			tbar       : [this.btnAdicionar, this.btnModificar, this.btnRemove,this.btnExportar, '->', this.btnAyuda],
			items      : [this.gpLimitados]
		});
		/*----------------  VIEWPORT  ----------------*/
		var viewport = new Ext.Viewport({
			layout : 'fit',
			items  :[this.pPrincipal]
		});
	}
};

var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestionarlimitacion', function(perfil, idioma) {
	//Escogiendo la configuración del idioma según la versión del MT.
	idioma = (idioma) ? idioma : perfil.etiquetas;
	//Inicializando el modelo
	var modelo = Ext.component.persona.Modelo;
	modelo.init(perfil);
	//modelo.storeCausas.load();
	//Inicializando la vista.
	var vista = Ext.component.persona.Vista;
	vista.init(perfil,idioma, modelo);
	//Inicializar controlador.
	var controller = Ext.component.persona.Controlador;
	controller.init(perfil,idioma, vista, modelo);
});
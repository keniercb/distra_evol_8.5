
 Ext.ns('Pvd.RegimenTrabajo.PeriodoControl');

Ext.QuickTips.init();
 
///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.RegimenTrabajo.PeriodoControl.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function(idioma, modelo) {
	
	//Botón ayuda
		this.btnAyuda = new Ext.Button({
			id:'btnAyudaPeriodControl',
			text: idioma.btnAyudaPeriodoControl,
			//icon:perfil.dirImg+'ayuda.png',
			iconCls:'ayuda',
			disabled: false,		
			tooltip:idioma.lbBtnAyudaPeriodoControl		
		});
		
	//Botón para adicionar.
		this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.btnAdicionarPeriodoControl,
            tooltip: idioma.lbbtnAdicionarPeriodoControl,
            iconCls: 'adicionar'
		});
        
	//Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.btnModificarPeriodoControl,
            tooltip: idioma.lbbtnModificarPeriodoControl,
            iconCls: 'modificar'
		});
		
	//Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
		});
	
	//Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
		});
	
	//Boton para eliminar.
		this.btnEliminar = new Ext.Button({
            id: 'btnDel',
            text: idioma.btnEliminarPeriodoControl,
            tooltip: idioma.lbbtnEliminarPeriodoControl,
            iconCls: 'eliminar'
		});

	//Fechas para el buscar
		//var fechab = new Date();
		Ext.apply(Ext.form.VTypes, {
			daterange : function(val, field) {
				var dateb = field.parseDate(val);

				if(!dateb){
					return;
				}
				if (field.startDateField && (!this.dateSangeMax || (dateb.getTime() != this.dateSangeMax.getTime()))) {
					var start = Ext.getCmp(field.startDateField);
					start.setMaxValue(dateb);
					start.validate();
					this.dateSangeMax = dateb;
				}
				else if (field.endDateField && (!this.dateSangeMin || (dateb.getTime() != this.dateSangeMin.getTime()))) {
					var end = Ext.getCmp(field.endDateField);
					end.setMinValue(dateb);
					end.validate();
					this.dateSangeMin = dateb;
				}
			return true;
			}

		});	

	this.dfFIniciob = new Ext.form.DateField({
		id: 'dfFIniciob',
		fieldLabel: idioma.lbFechaInicio, 
		name: 'desdeb',
		hiddenname:'desdeb',
		anchor:'97%',
		format:'d/m/Y',
		editable:false,
		readOnly : true,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		endDateField:'dfFFinb',
		listeners:{change: function(tf, n,o){cambio = 1;}}
	});

	this.dfFFinb = new Ext.form.DateField({
		id: 'dfFFinb',
		name: 'fechafinb',
		hiddenname:'fechafinb',
		anchor:'97%',
		format:'d/m/Y',
		editable:false,
		readOnly : true,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		startDateField:'dfFIniciob',
		listeners:{change: function(tf, n,o){cambio = 1;}}
	});
	
	//Expander
   this.expander = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Descripci&oacute;n:</b> {descripcion}</p><br>'          
        )
    });
	
	//Listado.
        this.listado = new Ext.grid.GridPanel({
            title: idioma.lbListadoPeriodoControl,            
            store: modelo.fuenteDatosListado,
			loadMask: {msg: 'Por favor espere. Cargando datos ...'},	
            plugins:this.expander,
			height: 527,
            columns: [this.expander,
                {header: 'Periodo de control',  width:300, dataIndex: 'periodo'}
            ],
			tbar: [
				'','-',
				idioma.lbLabelFInicio,
				this.dfFIniciob,
				'','-',
				idioma.lbLabelFFin,
				this.dfFFinb, '','-',
				this.btnBuscar, 				
                this.btnLimpiar,'','-'
			],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.fuenteDatosListado,
                displayInfo: true
				
            })
        });

	//Fechas para el adicionar y modificar
		var fecha = new Date();
		
	this.dfFInicio = new Ext.form.DateField({
		id: 'dfFInicio',
		fieldLabel: idioma.lbFechaInicio,
		name: 'fdesde',
		hiddenname:'fdesde',
		//value: fecha.format('d/m/Y'),
		anchor:'97%',
		format:'d/m/Y',
		editable:false,
		readOnly : false,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		endDateField:'dfFFin',
		listeners:{change: function(tf, n,o){cambio = 1;}}
	});

	this.dfFFin = new Ext.form.DateField({
		id: 'dfFFin',
		fieldLabel: idioma.lbFechaFin,
		name: 'fhasta',
		hiddenname:'fhasta',
		anchor:'97%',
		format:'d/m/Y',
		editable:false,
		readOnly : false,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		startDateField:'dfFInicio',
		listeners:{change: function(tf, n,o){cambio = 1;}}
	});

       
	// Area de texto Descripción
		var tadescripcion = new Ext.form.TextArea({
			fieldLabel: idioma.lbDescripcion,				
			name: 'descripcion',
			id:	'tadescripcion',
			anchor:	'100%',
			height: 90,
			hiddenname: 'descripcion',
			maxLength: 245,
			regex:/^([a-zA-Z \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc \u00e9 0-9 .,;:()_]+ ?[a-zA-Z \u00e9 \u00e1 \u00ed \u00f3 \u00fa \u00f1 \u00d1 \u00c1 \u00c9 \u00cd \u00d3 \u00da \u00fc 0-9 .,;:()_]*)+$/,
			regexText:idioma.lbRegexText,
			allowBlank:	true	
		});
		
    //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [
				{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.dfFInicio]
                },
				{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.dfFFin]
                },
				{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [tadescripcion]
                }
				]
            },{xtype: 'hidden',
              name: 'idperiodocontrol'
			  }]
		});
        
        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar
        });
        
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar
        });
        
        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar
        });
        
    //Ventana de gestion.
		this.ventanaGestion = new Ext.Window({
			modal: true,
			closeAction: 'hide',
			resizable: false,
			layout: 'fit',
			title: idioma.lbTitVentAddPeriodoControl,
			width: 400,
			height: 250,
			items: [this.formularioGestion],
			buttons: [
				this.btnCancelar,
				this.btnAplicar,
				this.btnAceptar
			]
		});
       
    //Vista general
        new Ext.Viewport({
            layout: 'fit',
			items: [{
				region: 'center',
				layout: 'fit',
				frame:true,
				tbar:[
					this.btnAdicionar,
					this.btnModificar,
					this.btnEliminar,'','-',
					'->', '','-',this.btnAyuda],
				items: [this.listado]
			}]
        });

	}
};

	//Inicializando la vista.
	UCID.portal.cargarEtiquetas('periodocontrol', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.RegimenTrabajo.PeriodoControl.Modelo;
    modelo.init();
    
    //Inicializando la vista.
    var vista = Pvd.RegimenTrabajo.PeriodoControl.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.RegimenTrabajo.PeriodoControl.Controlador.init(idioma, vista, modelo);
});
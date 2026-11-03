Ext.ns('Pvd.RegimenTrabajo.TurnoTrabajo');

Ext.QuickTips.init();
 
///////////////////////////////////////////Vista de la Interfaz///////////////////////////////////////////////////////////

Pvd.RegimenTrabajo.TurnoTrabajo.Vista = {
    /*
     * Inicializar la vista.
     */
    init: function(idioma, modelo) {
	
	//Botón ayuda
		this.btnAyuda = new Ext.Button({
			id:'btnAyudaNomTurnoTrab',
			text: idioma.btnAyudaTurnoTrabajo,
			iconCls:'ayuda',
			disabled: false,		
			tooltip:idioma.lbBtnAyudaTurnoTrabajo		
		});
		
	//Botón para adicionar.
		this.btnAdicionar = new Ext.Button({
            id: 'btnAdd',
            text: idioma.btnAdicionarTurnoTrabajo,
            tooltip: idioma.lbbtnAdicionarTurnoTrabajo,
            iconCls: 'adicionar'
		});
        
	//Boton para modificar.
        this.btnModificar = new Ext.Button({
            id: 'btnUpd',
            text: idioma.btnModificarTurnoTrabajo,
            tooltip: idioma.lbbtnModificarTurnoTrabajo,
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
            text: idioma.btnEliminarTurnoTrabajo,
            tooltip: idioma.lbbtnEliminarTurnoTrabajo,
            iconCls: 'eliminar'
		});
        
	//textfield para el buscar
		this.tfbuscar = new Ext.form.TextField({
			id:'tfbuscar',		
			allowBlank : true,
			emptyText: idioma.lbEmptyTextBuscar,	
			minLength: 3,
            maxLength: 60,
			enableKeyEvents: true, 		
			maskRe : /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,		
			width:140,		
			name : 'tfbuscador'		
		});
	
	//Fechas para el buscar
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
        this.smgrid = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
	
	//Listado.
        this.listado1 = new Ext.grid.GridPanel({
            title: idioma.lbListadoTurnoTrabajo,
            id:'listadoturnos',
            store: modelo.fuenteDatosListado,
			loadMask: {msg: 'Cargando...'},
            plugins:this.expander,
			height: 527,
            sm: this.smgrid,
            columns: [this.expander,
                {header: 'Denominaci&oacute;n',  width:50, dataIndex: 'denominacion'},
                {header: 'Fecha inicio',  width:30, dataIndex: 'fdesde'},
				{header: 'Fecha fin', width:30, dataIndex: 'fhasta'},
				{header: 'Hora inicio',  width:30, dataIndex: 'horainicio'},
                {header: 'Hora fin', width:30, dataIndex: 'horafin'},
                {header: 'Tolerancia de entrada',  width:30, dataIndex: 'toleranciaentrada'},
                {header: 'Tolerancia de salida', width:30, dataIndex: 'toleranciasalida'},
                {header: 'Horario de almuerzo', width:30, dataIndex: 'horarioalmuerzo'},
                {header: 'Tiempo de descanso', width:30, dataIndex: 'tiempodescanso'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.fuenteDatosListado,
                displayInfo: true
				
            })
        });
	
    //textfield denominacion
		var cambio = 0;
		this.tfdenom = new Ext.form.TextField({
			id:'tfdenominacion',
			fieldLabel: 'Denominación del turno de trabajo',
			allowBlank : false,		
			minLength: 3,
			maxLength: 100,
			regexText:idioma.lbRegexText,
			enableKeyEvents: true,
			width:'97%',
			blankText: idioma.lbCampoVacio, 
			name : 'denominacion',
            hiddenname : 'denominacion',
		});
		
	//Fechas para el adicionar y modificar
		var fecha = new Date();
		
	this.dfFInicio = new Ext.form.DateField({
		id: 'dfFInicio',
		fieldLabel: idioma.lbFechaInicio,
		name: 'fdesde',
		hiddenname:'fdesde',
		value: fecha.format('d/m/Y'),
		anchor:'97%',
		format:'d/m/Y',
		editable:false,
		readOnly : false,
        enableKeyEvents: true,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		endDateField:'dfFFin',		
		allowBlank : false,
        blankText: idioma.lbCampoVacio,
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
        enableKeyEvents: true,
		invalidText: idioma.invalidTextFecha,
		vtype:'daterange',
		emptyText: idioma.lbEmptyTextFecha,
		startDateField:'dfFInicio',
		listeners:{change: function(tf, n,o){cambio = 1;}}
	});

        this.cbhoraInicio = new Ext.form.TimeField({
            id: 'cbhoraInicio',
            anchor: '97%',
            fieldLabel  : 'Hora inicio',
            name: 'horainicio',
            hiddenname:'horainicio',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            enableKeyEvents: true,
            value:'08:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',			
			allowBlank : false,
			blankText: idioma.lbCampoVacio
        });

        this.cbhoraFin = new Ext.form.TimeField({
            id: 'cbhoraFin',
            anchor: '97%',
            name: 'horafin',
            hiddenname:'horafin',
            fieldLabel  : 'Hora fin',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '23:59',
            value:'17:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',			
			allowBlank : false,
			blankText: idioma.lbCampoVacio
        });

        this.tftoleranciaentrada = new Ext.form.TimeField({
            id: 'tftoleranciaentrada',
            anchor: '97%',
            fieldLabel  : 'Tolerancia de entrada',
            name: 'toleranciaentrada',
            hiddenname:'tftoleranciaentrada',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '01:00',
            value:'00:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)'
        });

        this.tftoleranciasalida = new Ext.form.TimeField({
            id: 'tftoleranciasalida',
            anchor: '97%',
            fieldLabel  : 'Tolerancia de salida',
            name: 'toleranciasalida',
            hiddenname:'tftoleranciasalida',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '01:00',
            value:'00:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)'
        });

        this.cbhoraalmuerzo = new Ext.form.TimeField({
            id: 'cbhoraalmuerzo',
            anchor: '97%',
            fieldLabel  : 'Horario de descanso',
            name: 'horarioalmuerzo',
            hiddenname:'horaalmuerzo',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '23:59',
            value:'12:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)'
        });

        this.tftiempodescanso = new Ext.form.TimeField({
            id: 'tftiempodescanso',
            anchor: '97%',
            fieldLabel  : 'Tiempo de descanso',
            name: 'tiempodescanso',
            hiddenname:'tftiempodescanso',
            emptyText: 'Seleccione...',
            format: 'H:i',
            minValue: '00:00',
            enableKeyEvents: true,
            maxValue: '23:59',
            value:'01:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)'
        });

        this.otrodia = new Ext.form.Checkbox({
            name : 'otrodia',
            id : 'otrodia',
            anchor:'100%',
            boxLabel  : 'Abarca otro día',
            hideLabel:true
        });

	// Area de texto Descripción
		this.tadescripcion = new Ext.form.TextArea({
			fieldLabel: idioma.lbDescripcion,				
			name: 'descripcion',
			id:	'tadescripcion',
			anchor:	'100%',
			height: 110,	
			hiddenname: 'descripcion',
            enableKeyEvents: true,
			maxLength: 255,
            regex:/^(\S)+([ ]?(\S))*$/,
            regexText: idioma.lbRegexTextdescripcion,
			allowBlank:	true	
		});

        this.EstructuraPadre = new Ext.components.TreeComboBox({
            anchor:	'100%',
            //allowBlank: false,
            mostrarBtnLimpiar: true,
            emptyText: 'Seleccione...',
            fieldLabel: 'Estructura',
            id: 'EstructuraPadre',
            treeConfig: {
                rootVisible: false,
                loader: modelo.estructurapadre,
                border: false,
                autoScroll: true
            }
        });
		
    //Formulario de gestion.
        this.formularioGestion = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            bodyStyle:'padding:5px 5px 0',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.tfdenom]
                },
				{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.dfFInicio]
                },
				{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.dfFFin]
                },{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.cbhoraInicio]
                },
				{
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.cbhoraFin]
                }
                 ,
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.tftoleranciaentrada]
                },
                {
                    columnWidth:.5,
                    layout: 'form',
                    items: [this.tftoleranciasalida]
                },
                    {
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.cbhoraalmuerzo]
                },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.tftiempodescanso]
                },{
                        columnWidth: 1.0,
                        layout: 'form',
                        items: [this.EstructuraPadre]
                    },{
                        columnWidth:1,
                        layout: 'form',
                        items: [this.otrodia]
                },
				{
                    columnWidth:1.0,
                    layout: 'form',
                    items: [this.tadescripcion]
                }
				]
            },{xtype: 'hidden',
              name: 'idturnotrabajo'
			  }]
		});
        
        this.btnCancelar = new Ext.Button({
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });
        
        this.btnAceptar = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });
        
        this.btnAplicar = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });
        
    //Ventana de gestion.
		this.ventanaGestion = new Ext.Window({
			modal: true,
			closeAction: 'hide',
			resizable: false,
            constrain: true,
			layout: 'fit',
			title: idioma.lbTitVentAddTurnoTrabajo,
			width: 425,
			height: 500,
			items: [this.formularioGestion],
			buttons: [
				this.btnCancelar,
				this.btnAplicar,
				this.btnAceptar
			]
		});
       this.panelGrid = new Ext.Panel({
           layout: 'fit'
        });

        //Vista general
      this.VP = new Ext.Viewport({
            layout: 'fit',
			items: [{
				region: 'center',
                id:'panelp',
				layout: 'fit',
				frame:true,
				tbar:[
					this.btnAdicionar,
					this.btnModificar,
					this.btnEliminar,'','-',
                    /*this.tfbuscar,'',
                    this.btnBuscar,
                    this.btnLimpiar,'','-',*/
					'->', '','-',this.btnAyuda
                ],
				items: [this.panelGrid]
			}]
        });

	}
};

	//Inicializando la vista.
	UCID.portal.cargarEtiquetas('turnotrabajo', function(perfil, idioma){
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Pvd.RegimenTrabajo.TurnoTrabajo.Modelo;
    modelo.init();
    
    //Inicializando la vista.
    var vista = Pvd.RegimenTrabajo.TurnoTrabajo.Vista;
    vista.init(idioma, modelo);
    
    //Inicializar controlador.
    Pvd.RegimenTrabajo.TurnoTrabajo.Controlador.init(idioma, vista, modelo);
});
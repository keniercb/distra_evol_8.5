
Ext.ns('RegimenTrabajo.Nomregimentrabajoasist');

RegimenTrabajo.Nomregimentrabajoasist.Vista = {

    init: function (idioma, modelo) {


        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            tooltip: idioma.lbBtnAdicionarR,
            text: idioma.BtnAdicionar,
            iconCls: 'adicionar'
        });
		  this.btnAdicionarP = new Ext.Button({
            id: 'btnAdicionarP',
            tooltip:idioma.lbBtnAdicionar,
            text: idioma.BtnAdicionar,
            iconCls: 'adicionar'
        });
		 this.search = new Ext.app.SearchField({
            id: 'search',
            store: modelo.stTregimen,
            emptyText: 'Criterio a buscar...'
        });
		
		 this.searchP = new Ext.app.SearchField({
            id: 'searchP',          
            store: modelo.stListadoGrupoDescanso,
            emptyText: 'Criterio a buscar...'
        });

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: idioma.BtnEliminar,
            iconCls: 'eliminar',
            disabled: true,
            tooltip: idioma.lbBtnEliminarR
        });
		this.btnEliminarP = new Ext.Button({
            id: 'btnEliminarP',
            text: idioma.BtnEliminar,
            iconCls: 'eliminar',
            disabled: true,
            tooltip: idioma.lbBtnEliminar
        });

        this.btnModificar = new Ext.Button({
            id: 'btnModificar',
            text: idioma.BtnModificar,
            iconCls: 'modificar',
            disabled: true,
            tooltip:idioma.lbBtnModificarR
        });
		    this.btnModificarP = new Ext.Button({
            id: 'btnModificarP',
            text: idioma.BtnModificar,
            iconCls: 'modificar',
            disabled: true,
            tooltip: idioma.lbBtnModificar,
        });
		
		this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            tooltip: idioma.lbBtnExportar,
            text: idioma.BtnExportar,
            iconCls: 'exportar'
        });
		this.btnExportarP = new Ext.Button({
            id: 'btnExportarP',
            tooltip: idioma.lbBtnExportar,
            text: idioma.BtnExportar,
            iconCls: 'exportar'
        });
		
        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaNomRTD',
            tooltip: idioma.lbBtnAyuda,
            text: idioma.BtnAyuda,
            iconCls: 'ayuda'
        });

		this.btnCancelar = new Ext.Button({
            id: 'idcancelar',
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
		
		this.btnCancelarGD = new Ext.Button({
            id: 'idcancelarGD',
            iconCls: 'cancelar',
            text: idioma.lbBtnCancelar,
            tooltip: idioma.lbBtnCanc,
        });

        this.btnAceptarGD = new Ext.Button({
            iconCls: 'aceptar',
            text: idioma.lbBtnAceptar,
            tooltip: idioma.lbBtnAcep,
        });
		
		this.btnAplicarGD = new Ext.Button({
            iconCls: 'aplicar',
            text: idioma.lbBtnAplicar,
            tooltip: idioma.lbBtnAplic,
        });
		
		this.combo = new Ext.form.ComboBox({
        store: modelo.stTregimen,
		fieldLabel: idioma.lbColRegimen,
        displayField:'denominacion',
        blankText: idioma.lbCampoVacio,
        allowBlank : false,
        typeAhead: true,
        mode: 'local',
		anchor: '98%',
        enableKeyEvents: true,
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus:true,
		valueField:'idregimentrabajo',
		name:'idregimentrabajo',
		hiddenname:'idregimentrabajo'
		
    });

		this.expander = new Ext.grid.RowExpander({
			tpl : new Ext.Template(

            '<p><b>Descripcion:</b> {descripcion}</p>'
			)
		});
		
		this.expanderP = new Ext.grid.RowExpander({
			tpl : new Ext.Template(

            '<p><b>Descripcion:</b> {descripcion}</p>'
			)
		});

		this.smListadoRegimen = new Ext.grid.CheckboxSelectionModel({
			singleSelect: false
		});

        function combo(val, metaData, record, rowIndex, colIndex, store) {
           //console.info(val);
            if(val == 1){
                val = 'Fondo de tiempo mensual';
            }else if(val == 2){
                val = 'Fondo de tiempo promedio anual';
            }else if(val == 3){
                val = 'Fondo de tiempo fijo';
            }else{
                val = 'Fondo de tiempo límite';
            }
            return val;
        }

		this.cmlistadoregimentrabajo = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
			this.expander,
			{header:'Denominaci&oacute;n', width: 235,	sortable: true,	dataIndex: 'denominacion'},
			//{header:'Estructura', width: 200,	sortable: true,	dataIndex: 'estructura'},
			{header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
			{header: 'Fecha fin', width: 100, dataIndex: 'fhasta'},
			{header: 'Horas de trabajo diarias', width: 140, dataIndex: 'horastrabajo'},
			{header: 'Tipo de fondo de tiempo', width: 180, dataIndex: 'tipofondotiempo',renderer: combo},
			this.smListadoRegimen
		]);
		
		
		this.gplistadoregimentrabajo = new Ext.grid.GridPanel({
			id: 'listadoPersonasRT',
			height:200,
            cm: this.cmlistadoregimentrabajo,
			title:idioma.lbListadoRegimen,
			plugins:[this.expander],
			tbar: [this.btnAdicionar, this.btnModificar, this.btnEliminar,'','-',this.search],
			stripeRows: true,
			autoScroll:true,
			border: true,
            store:modelo.stTregimen,			
			sm: this.smListadoRegimen,
            loadMask :idioma.lbGridLoadMaskgrupos,
			bbar:new Ext.PagingToolbar({ 
				pageSize: 25,
				store: modelo.stTregimen, 
				displayInfo: true, 
				displayMsg: 'Resultados {0} - {1} de {2}', 
				emptyMsg: idioma.lbemptyMsg
			})
		});

        this.smListadoGrupoDescanso = new Ext.grid.CheckboxSelectionModel();

        this.cmlistadoGrupoDescanso = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer(),
            this.expanderP,
            {header:'Denominación', width: 220,	sortable: true,	dataIndex: 'denominacion'},
            {header:'idregimentrabajo', width: 220,hidden:true,	sortable: true,	dataIndex: 'idregimentrabajo'},
            {header:'Estructura', width: 200,	sortable: true,	dataIndex: 'estructura'},
            {header: 'Fecha inicio', width: 100, dataIndex: 'fdesde'},
            {header: 'Fecha fin', width: 100, dataIndex: 'fhasta'},
            {header: 'Predeterminado', width: 100, dataIndex: 'predeterminado',renderer: function (val) {
                    if (val == 1)return '</center></span><span style=" color:' + '#33aa33' + '"><b>&#10004;</b></span>'; else return '';
                }},
            this.smListadoGrupoDescanso
        ]);

		this.gpListadoGrupoDescanso = new Ext.grid.GridPanel({
			id: 'listadoPersonasGD',
			height:200,
			title:idioma.lbListadoGrupo,
			cm: this.cmlistadoGrupoDescanso,			
			tbar: [this.btnAdicionarP,this.btnModificarP,this.btnEliminarP,'','-',this.searchP],
			stripeRows: true,
			plugins:[this.expanderP],
			autoScroll:true,
			border: true,
            store: modelo.stListadoGrupoDescanso,			
			sm: this.smListadoGrupoDescanso,
			loadMask :idioma.lbGridLoadMaskgrupos,
			bbar:new Ext.PagingToolbar({ 
				pageSize: 15, 
				store: modelo.stListadoGrupoDescanso, 
				displayInfo: true, 
				displayMsg: 'Resultados {0} - {1} de {2}', 
				emptyMsg: idioma.lbemptyMsg
			})
		});
		
		this.tfdenominacion = new Ext.form.TextField({
             id: 'tfDenominacion',
            fieldLabel: idioma.lbColDenominacion,
            allowBlank : false,
            minLength: 3,
            maxLength: 100,
            enableKeyEvents: true,
            regexText:idioma.lbRegexText,
            blankText:idioma.lbCampoVacio,
            width: '98%',		
			listeners:{change: function(tf, n,o){cambio = 1;}},
            name: 'denominacion',
            hiddenname: 'denominacion',
        });

        this.tfHorastrabajo = new Ext.form.TextField({
            id: 'tfHorastrabajo',
            fieldLabel: idioma.lbColHoras,
            allowBlank: false,
            blankText:idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            regex:/^[0-9]+$/,
            regexText:idioma.lbRegexTextNum2,
            maxLength:2,
            width: '98%',
            listeners:{change: function(tf, n,o){cambio = 1;}},
            name: 'horastrabajo',
            hiddenname: 'horastrabajo',
        });


        var fecha = new Date();

        this.dfIregimen = new Ext.form.DateField({
            id: 'dfFInicio',
            fieldLabel: idioma.lbColDesde,
            name: 'fdesde',
            hiddenname:'fdesde',
            value: fecha.format('d/m/Y'),
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            enableKeyEvents: true,
            readOnly : false,
            invalidText: idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField:'dfFFin',
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        this.dfFregimen = new Ext.form.DateField({
            id: 'dfFFin',
            fieldLabel: idioma.lbColHasta,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : false,
            enableKeyEvents: true,
            invalidText:  idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField:'dfFInicio',
            listeners:{change: function(tf, n,o){cambio = 1;}}
        });

        this.predeterminado = new Ext.form.Checkbox({
            name : 'predeterminado',
            id : 'predeterminado',
            anchor:'100%',
            boxLabel  : 'Predeterminado',
            hideLabel:true
        });

        this.smListadoTurnoTrabajo = new Ext.grid.CheckboxSelectionModel();

        this.cmlistadoTurnoTrabajo = new Ext.grid.ColumnModel([this.smListadoGrupoDescanso,
            {header:'Denominación', width: 230,	sortable: true,	dataIndex: 'denominacion'}
        ]);


        this.gpListadoTurnoTrabajo = new Ext.grid.GridPanel({
            id: 'listadoTurnoTrabajo',
            height:200,
            title:'Listado de Turnos de trabajo',
            cm: this.cmlistadoTurnoTrabajo,
            stripeRows: true,
            autoScroll:true,
            border: true,
            store: modelo.stListadoTurnoTrabajo,
            loadMask :idioma.lbGridLoadMaskgrupos
        });
	
	
		this.taDescripcion = new Ext.form.TextArea({
            fieldLabel: idioma.lbColDescripcion,
            name: 'descripcion',
            id: 'tadescripcion',			  
            anchor: '98%',
            height: 50,
            hiddenname: 'descripcion',
            enableKeyEvents: true,
            maxLength: 255,
            regex:/^(\S)+([ ]?(\S))*$/,
            regexText: idioma.lbRegexTextdescripcion,
            allowBlank: true
        });
		
		
		this.tfdenominacionGD = new Ext.form.TextField({
             id: 'tfdenominacionGD',
            fieldLabel: idioma.lbColDenominacion,
            allowBlank : false,
            blankText: idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            maxLength: 100,
            regexText:idioma.lbRegexText,
            width: '98%',		
			listeners:{change: function(tf, n,o){cambio = 1;}},
            name: 'denominacion',
			hiddenname: 'denominacion'
        });

        this.dfIregimenGD = new Ext.form.DateField({
            id: 'dfIregimenGD',
            fieldLabel: idioma.lbColDesde,
            name: 'fdesde',
            hiddenname:'fdesde',
            value: fecha.format('d/m/Y'),
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            enableKeyEvents: true,
            readOnly : false,
            invalidText: idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            endDateField:'dfFregimenGD',
        });

        this.dfFregimenGD = new Ext.form.DateField({
            id: 'dfFregimenGD',
            fieldLabel: idioma.lbColHasta,
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor:'97%',
            format:'d/m/Y',
            editable:false,
            readOnly : false,
            enableKeyEvents: true,
            invalidText:  idioma.invalidTextFecha,
            vtype:'daterange',
            emptyText: idioma.lbEmptyTextFecha,
            startDateField:'dfIregimenGD'
        });
	
	
		this.taDescripcionGD = new Ext.form.TextArea({
            fieldLabel: idioma.lbColDescripcion,
            name: 'descripcion',
            id: 'taDescripcionGD',			  
            anchor: '98%',
            height: 50,
            enableKeyEvents: true,
            hiddenname: 'descripcion',
            maxLength: 255,
            regex:/^(\S)+([ ]?(\S))*$/,
            regexText: idioma.lbRegexTextdescripcion,
            allowBlank: true
        });
		
		
		this.pgrupoPersona = new Ext.Panel({
			id: 'pgrupoPersona',
			width:'55%',
			layout: 'fit',
			region: 'west',		
			collapsible: true,
			split: true,
			items:[this.gplistadoregimentrabajo],			
		});
		this.plistadoPersona = new Ext.Panel({
			id: 'plistadoPersona',
			layout: 'fit',
			region: 'center',		
			collapsible: true,
			split: true,
			items:[this.gpListadoGrupoDescanso],			
		});

        this.cbTipoFondoTiempo = new Ext.form.ComboBox({
            id:'tipofondotiempo',
            store: modelo.stTipoFondoTiempo,
            fieldLabel: idioma.lbcbTipoFondoTiempo,
            anchor: '98%',
            displayField:'denomtipofondotiempo',
            valueField:'tipofondotiempo',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            blankText:idioma.lbCampoVacio,
            emptyText:'Seleccione...',
            selectOnFocus:true,
            value:1
        });

        this.fondoTiempo = new Ext.form.TextField({
            id: 'idfondotiempo',
            fieldLabel: idioma.lbfondoTiempo,
            allowBlank: true,
            blankText:idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            regex:/\d{1,3}\.?\d?/,
            regexText:idioma.lbRegexTextNum,
            maxLength:5,
            width: '98%',
            disabled:true,
            listeners:{change: function(tf, n,o){cambio = 1;}},
            name: 'fondotiempo',
            hiddenname: 'fondotiempo',
            //value:190.6
        });

        this.diasLab = new Ext.form.TextField({
            id: 'iddiaslaborables',
            fieldLabel: 'Días laborables',
            allowBlank: true,
            blankText:idioma.lbCampoVacio,
            enableKeyEvents: true,
            minLength: 1,
            regex:/\d{1,3}\.?\d?/,
            regexText:idioma.lbRegexTextNum,
            maxLength:5,
            width: '98%',
            disabled:true,
            listeners:{change: function(tf, n,o){cambio = 1;}},
            name: 'diaslaborables',
            hiddenname: 'diaslaborables'
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

        this.fadicionarRT = new Ext.form.FormPanel({
			frame: true,
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [                        
						{
                            columnWidth:.6,
                            layout: 'form',
                           items: [this.tfdenominacion]
                        },{
                            columnWidth:.4,
                            layout: 'form',
                           items: [this.tfHorastrabajo]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                           items: [this.cbTipoFondoTiempo]
                        },{
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.fondoTiempo]
                        },{
                            columnWidth: .25,
                            layout: 'form',
                            items: [this.diasLab]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfIregimen]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFregimen]
                        },{
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.taDescripcion]
                        }/*,{
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.EstructuraPadre]
                        }*/
                    ]
                }
            ]
       });
		
		this.winAdicionarRT= new Ext.Window({			
			width : 500,
			height : 550,
			layout: 'fit',
			autoHeight: true,
			closable: true,
            constrain: true,
			resizable: false, 
			closeAction: 'hide',
			items: [this.fadicionarRT],
			modal: true,
			buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]           
		});				
				
        this.fadicionarGD = new Ext.form.FormPanel({
			frame: true,
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [                        
						{
                            columnWidth:1.0,
                            layout: 'form',
                           items: [this.tfdenominacionGD]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                           items: [this.dfIregimenGD]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.dfFregimenGD]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                            items: [this.predeterminado]
                        },{
                            columnWidth: .5,
                            layout: 'form',
                           items: [this.combo]
                        },{
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.EstructuraPadre]
                        },{
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.taDescripcionGD]
                        }
                    ]
                }						
            ]
       });
		
		this.winAdicionarGD= new Ext.Window({			
			width : 400,
			height : 650,
			layout: 'fit',
			autoHeight: true,
			closable: true,
            constrain: true,
			resizable: false, 
			closeAction: 'hide',
			items: [this.fadicionarGD],
			modal: true,
			buttons: [this.btnCancelarGD, this.btnAplicarGD, this.btnAceptarGD]           
		}); 
					
				
		this.pGeneral = new Ext.Panel({
			id: 'pGeneral',
			width : '100%',
			layout:'border',
            tbar:['->', this.btnAyuda],
            items: [this.pgrupoPersona,this.plistadoPersona] 	
		});
	

        new Ext.Viewport({
            layout: 'fit',
			items: this.pGeneral
			
        });
    }

};
//Inicializando la vista.
UCID.portal.cargarEtiquetas('nomregimentrabajoasist', function (perfil, idioma) {
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = RegimenTrabajo.Nomregimentrabajoasist.Modelo;
  modelo.init();

    //Inicializando la vista.
    var vista = RegimenTrabajo.Nomregimentrabajoasist.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    RegimenTrabajo.Nomregimentrabajoasist.Controlador.init(idioma, vista, modelo);
});


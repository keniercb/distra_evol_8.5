/**
 * Componente con los grid's de conceptos de PD de los elementos salariales y las escalas de dichos conceptos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase Interfaz.
 * @uses Pvd.Nomina.gestmodeloaplicacionconvenio
 * @copyright UCID
 * @version 1.0
 */
Ext.ns('Pvd.Nomina.gestmodeloaplicacionconvenio');
//Inicializando la vista.
//Tipo de layout auxiliar
Ext.ns('Ext.ux.layout');
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    // private
    monitorResize:true,

    // private
    isValidParent : function(c, target){
        return c.getEl().dom.parentNode == this.innerCt.dom;
    },
 
    // private
    onLayout : function(ct, target){
        var rs = ct.items.items, len = rs.length, r, i;

        if(!this.innerCt){
            target.addClass('ux-row-layout-ct');
            this.innerCt = target.createChild({cls:'x-row-inner'});
        }
        this.renderAll(ct, this.innerCt);

        var size = target.getViewSize();

        if(size.width < 1 && size.height < 1){ // display none?
            return;
        }

        var h = size.height - target.getPadding('tb'),
            ph = h;

        this.innerCt.setSize({height:h});
        
        // some rows can be percentages while others are fixed
        // so we need to make 2 passes
        
        for(i = 0; i < len; i++){
            r = rs[i];
            if(!r.rowHeight){
                ph -= (r.getSize().height + r.getEl().getMargins('tb'));
            }
        }

        ph = ph < 0 ? 0 : ph;

        for(i = 0; i < len; i++){
            r = rs[i];
            if(r.rowHeight){
                r.setSize({height: Math.floor(r.rowHeight*ph) - r.getEl().getMargins('tb')});
            }
        }
    }
    
    /**
     * @property activeItem
     * @hide
     */
});
Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
Ext.QuickTips.init();
/*Componente panel*/
Pvd.Nomina.gestmodeloaplicacionconvenio = Ext.extend(Ext.Window,{
    title:'Modelo de aplicaci&oacute;n de convenios',
    //region:'center',
    layout: 'fit',
	height: 400,
    width: 600,
    border: false,
    tipoconvenio: (this.tipoconvenio ? this.tipoconvenio : 1), 
    idconvenio: (this.idconvenio ? this.idconvenio : 1), 
    idestructura: (this.idestructura ? this.idestructura : 1), 
    numeroconvenio: (this.numeroconvenio ? this.numeroconvenio : 0), 
    salario: (this.salario ? this.salario : 0.00), 
    salarioreal: (this.salarioreal ? this.salarioreal : 0.00), 
    fechainicio: (this.fechainicio ? this.fechainicio : null), 
    fechafin: (this.fechafin ? this.fechafin : null),
    aprobado: (this.aprobado ? this.aprobado : 0),
    obra: (this.obra ? this.obra : 0),
    horas: (this.horas ? this.horas : 0),
    initComponent: function() {
        this.actionhoras = 0;
		var self = this;
		var array = this.array;
        this.cargosocupados = -1;
	   	var accion = 'Add';
		var accionescala = 'Add';
		
		//Store del listado de obras.
     	this.storeObra = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoObras',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idobra" }, 
			[{name: 'idobra'}
			 ,{name: 'denominación'}
			])
		});
		
		//Store del listado de zonas.
     	this.storeZona = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoObras',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idzona" }, 
			[{name: 'idzona'}
			 ,{name: 'denominación'}
			])
		});
		
		//Store del listado de obras.
     	this.storeOObra = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoObjetosObras',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idobjetoobra" }, 
			[{name: 'idobjetoobra'}
			 ,{name: 'denominación'}
			])
		});
		
		//Store del listado de obras.
     	this.storePlantillasNominales = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoPlantillasNominales',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idplantillanominal" }, 
			[{name: 'idplantillanominal'}
			 ,{name: 'denominación'}
			])
		});
		
		//Store del listado de U. obras.
     	this.storeUObra = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoUObras',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "iduobra" }, 
			[{name: 'iduobra'}
			 ,{name: 'denominación'}
			])
		});
		
		//Combo de las Obras
		this.tfObra = new Ext.form.TextField({id: 'tfObra', fieldLabel: 'Obra', name: 'obra',
            allowBlank: false,  anchor: '90%', readOnly: true

        });
		
		//Combo de las Zonas
		this.cbZona = new Ext.form.ComboBox({id: 'cbZona', fieldLabel: 'Zona',
            //tabIndex: 3, 
			valueField: 'idzona',
            displayField: 'denominacion',
			hiddenName: 'idzona',
            allowBlank: false, mode: 'local',
            store: self.storeZona, 
			emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.', readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
		
		//Number field del # de Convenio.
        this.nfNumConvenio = new Ext.form.NumberField({id:'nfNumConvenio', fieldLabel:'No. Convenio', 
            tabIndex: 1, name: 'denominacion', allowBlank: false,  anchor: '90%',
            prevTab: 'idbtnAceptarTipoP', nextTab: 'idcbDesglose',
			//regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            //regexText:'Solo admite caracteres alfanum&eacute;ricos y el caracter especial ( ).', //maskRe
			maxLength:14,
            maxLengthText:'El tama&ntilde;o m&aacute;ximo requerido es 14 caracteres.',
            blankText:'Este campo es obligatorio.',
            readOnly: true
        });
		
		//Combo de los Objetos de obras
		this.cbOObra = new Ext.form.ComboBox({id: 'cbOObra', fieldLabel:'Objeto de obra',
            valueField: 'idobjetoobra',
            displayField: 'denominacion',
			hiddenName: 'idobjetoobra',
            allowBlank: false, mode: 'local',
            store: self.storeOObra, 
			emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.', readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
		
		//Number field del grupo de ejecucion.
        this.nfGrupoEjecucion = new Ext.form.NumberField({id:'nfGrupoEjecucion', fieldLabel:'Grupo de Ejecuci&oacute;n', 
            tabIndex: 1, name: 'grupoejec', allowBlank: false,  anchor: '90%',
            regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText:'Solo admite caracteres alfanum&eacute;ricos y el caracter especial ( ).', //maskRe
			maxLength:14,
            maxLengthText:'El tama&ntilde;o m&aacute;ximo requerido es 14 caracteres.',
            blankText:'Este campo es obligatorio.' 
        });
		
		//Combo de las brigadas ejecutoras
		this.cbBrigadas = new Ext.form.ComboBox({id: 'cbBrigadas', fieldLabel:'Brigada ejecutora',
            valueField: 'idplantillanominal',
            displayField: 'denominacion',
			hiddenName: 'idplantillanominal',
            allowBlank: false, mode: 'local',
            store: self.storePlantillasNominales, 
			emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.', readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
		
		//Number field de la aplicación.
        this.nfAplicacion = new Ext.form.NumberField({id:'nfAplicacion', fieldLabel:'Aplicaci&oacute;n', 
            tabIndex: 1, name: 'aplicacion', allowBlank: false,  anchor: '90%',
            regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            regexText:'Solo admite caracteres alfanum&eacute;ricos y el caracter especial ( ).', //maskRe
			maxLength:14,
            maxLengthText:'El tama&ntilde;o m&aacute;ximo requerido es 14 caracteres.',
            blankText:'Este campo es obligatorio.' 
        });
		
		//Combo de las unidades de obras
		this.cbUObras = new Ext.form.ComboBox({id: 'cbUObras', fieldLabel:'U. Obra',
            valueField: 'iduobra',
            displayField: 'denominacion',
			hiddenName: 'iduobra',
            allowBlank: false, mode: 'local',
            store: self.storeUObra, 
			emptyText: 'Seleccione...',
            blankText: 'Este campo es obligatorio.', readOnly: true,
            triggerAction: 'all', anchor: '90%'
        });
		
		//Text field del total de horas.
        this.nfHoras = new Ext.form.NumberField({id:'nfHoras', fieldLabel:'Total horas', 
            tabIndex: 1, name: 'horas', allowBlank: false,  anchor: '90%',
            //regex:/^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d ]+(\d*)?)+$/,
            //regexText:'Solo admite caracteres alfanum&eacute;ricos y el caracter especial ( ).', //maskRe
			maxLength:14,
            maxLengthText:'El tama&ntilde;o m&aacute;ximo requerido es 14 caracteres.',
            blankText:'Este campo es obligatorio.',
            hidden: (self.tipoconvenio==1)?true:false
        });
		
		//Number field del salario.
        this.nfSalario = new Ext.form.TextField({id:'nfSalario', fieldLabel:'', 
            tabIndex: 1, name: 'salario', allowBlank: true,  anchor: '100%',
            maskRe :/[0-9.]/i,
		    regex :/^\d+(\.\d{1,2})?$/i,
		    regexText:'Este valor es incorrecto',
            readOnly: true
        });
		
		//Number field del salario.
        this.nfSalarioReal = new Ext.form.TextField({id:'nfSalarioReal', fieldLabel:'', 
            tabIndex: 1, name: 'salarioreal', allowBlank: true,  anchor: '100%',
            maskRe :/[0-9.]/i,
		    regex :/^\d+(\.\d{1,2})?$/i,
		    regexText:'Este valor es incorrecto', 
			readOnly: true
        });
		
		self.nfNumConvenio.setValue(self.numeroconvenio);
		self.nfSalario.setValue(self.salario);
		self.nfSalarioReal.setValue(self.salarioreal);
		self.tfObra.setValue(self.obra);
		self.nhHoras.setValue(self.horas);

		//Elementos del grid de los Modelos de los Convenios
		this.btnCalcularSalario = new Ext.Button({
            id: 'btnCalcularSalario',
            text: 'Calcular',
            tooltip: 'Calcular salario',
            iconCls: 'liquidar',
            prevTab: '',
            nextTab: '',
			disabled: true
		});

		this.btnAddPersonas = new Ext.Button({
            id: 'btnAddPersonas',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Adicionar personas al convenio',
            iconCls: 'usuarioactivo',
            prevTab: '',
            nextTab: '',
            disabled: (self.aprobado==0)?false:true
		});
		
		this.btnDelPersonas = new Ext.Button({
            id: 'btnDelPersonas',
            text: 'Eliminar',
            tooltip: 'Eliminar personas',
            iconCls: 'eliminar',
            prevTab: '',
            nextTab: '',
            disabled: true
		});
		
		this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: 'Exportar',
            tooltip: 'Exportar Modelo de Aplicaci&oacute;n de Convenios',
            iconCls: 'exportar',
            prevTab: '',
            nextTab: '',
            hidden: true
		});
		
		this.expanderModeloConveniosIndividual = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Cargo;{cargo}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.expanderModeloConveniosColectivo = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Cargo;{cargo}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.smModeloConvenios = new Ext.grid.CheckboxSelectionModel();

        //Store del listado de personas para el destajo colectivo.
     	this.storeDestajoColectivo = new Ext.data.GroupingStore({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoPersonasDestajoColectivo',
            groupField:'plantilla',
            sortInfo:{field: 'nombreyapp', direction: "ASC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idmodeloconveniocolectivo" }, 
			[{name: 'idmodeloconveniocolectivo'}
			 ,{name: 'idpersona'}
			 ,{name: 'idconvenio'}
			 ,{name: 'ci'}
			 ,{name: 'idplantilla'}
			 ,{name: 'plantilla'}
			 ,{name: 'nombreyapp'}
			 ,{name: 'cargo'}
			 ,{name: 'grupoescala'}
			 ,{name: 'tarifamn'}
			 ,{name: 'horastrabajadas'}
			 ,{name: 'cpl'}
			 ,{name: 'sbc'}
			 ,{name: 'salarioapagar'}
			])
		});
		
		//Store del listado de personas para el destajo individual.
     	this.storeDestajoIndividual = new Ext.data.GroupingStore({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoPersonasDestajoIndividual',
            groupField:'plantilla',
            sortInfo:{field: 'nombreyapp', direction: "ASC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idmodeloconvenioindividual" }, 
			[{name: 'idmodeloconvenioindividual'}
			 ,{name: 'idpersona'}
			 ,{name: 'idconvenio'}
			 ,{name: 'ci'}
             ,{name: 'idplantilla'}
             ,{name: 'plantilla'}
			 ,{name: 'nombreyapp'}
			 ,{name: 'cargo'}
			 ,{name: 'grupoescala'}
			 ,{name: 'tarifamn'}
			 ,{name: 'porcientoejecutado'}
			 ,{name: 'salariocreado'}
			 ,{name: 'sbc'}
			 ,{name: 'cdsmn'}
			 ,{name: 'salarioapagar'}
			])
		});

        this.storeDestajoIndividual.on('load', function(){
            var total = this.storeDestajoIndividual.getTotalCount();
            for(var i = 0; i < total; i++){
                this.expanderModeloConveniosIndividual.expandRow(i);
            }
            (this.aprobado==0)?this.btnAddPersonas.enable():this.btnAddPersonas.disable();
            this.btnDelPersonas.disable();
        }.createDelegate(this));

        this.storeDestajoColectivo.on('load', function(){
            var total = this.storeDestajoColectivo.getTotalCount();
            for(var i = 0; i < total; i++){
                this.expanderModeloConveniosColectivo.expandRow(i);
            }
            (this.aprobado==0)?this.btnAddPersonas.enable():this.btnAddPersonas.disable();
            this.btnDelPersonas.disable();
        }.createDelegate(this));
		
		if(this.tipoconvenio==1){
		  this.storeDestajoIndividual.load({params:{idconvenio: this.idconvenio}});
		}else{
		  this.storeDestajoColectivo.load({params:{idconvenio: this.idconvenio}});
		}
		
		this.editorsHTrabajadas = new Ext.form.TextField({id: 'editorsHTrabajadas', name: 'horastrabajadas',
			maskRe :/[0-9.]/i,
			regex :/^\d+(\.\d{1,2})?$/i,
			regexText:'Este valor es incorrecto'
        });
		
		this.editorsCPL = new Ext.form.TextField({id: 'editorsCPL', name: 'cpl',
			maskRe :/[0-9.]/i,
			regex :/^\d+(\.\d{1,2})?$/i,
			regexText:'Este valor es incorrecto'
        });
		
		this.cmcolectivo = new Ext.grid.ColumnModel([self.smModeloConvenios,
			         {header: 'idpersona',    hidden: true, hideable: false, dataIndex: 'idpersona'}
                    ,self.expanderModeloConveniosColectivo
					,{header: 'CI', width: 50, sortable: true, dataIndex: 'ci'}
					,{header: 'Nombre y apellidos', width: 100, sortable: true, dataIndex: 'nombreyapp'}
                    ,{header: 'Grupo escala', width: 100, sortable: true, dataIndex: 'grupoescala'}
                    ,{header: 'Tarifa MN.', width: 100, sortable: true, dataIndex: 'tarifamn'}
                    ,{header: 'H. Trabajadas', width: 100, sortable: true, dataIndex: 'horastrabajadas', editor:self.editorsHTrabajadas}  
                    ,{header: 'CPL', width: 100, sortable: true, dataIndex: 'cpl', editor:self.editorsCPL}
                    ,{header: 'SBC', width: 100, sortable: true, dataIndex: 'sbc'}
                    ,{header: 'Salario a pagar', width: 100, sortable: true, dataIndex: 'salarioapagar'}
                    ,{header: 'Plantilla nominal', width: 100, sortable: true, hidden:true, dataIndex: 'plantilla'}
        ]),
		
		this.editorsPorcientoEjecutado = new Ext.form.TextField({id: 'editorsHTrabajadas', name: 'horastrabajadas',
			maskRe :/[0-9.]/i,
			regex :/^\d+(\.\d{1,2})?$/i,
			regexText:'Este valor es incorrecto'
        });
		
		this.cmindividual = new Ext.grid.ColumnModel([self.smModeloConvenios,
			         {header: 'idpersona',    hidden: true, hideable: false, dataIndex: 'idpersona'}
                    ,self.expanderModeloConveniosColectivo
					,{header: 'CI', width: 50, sortable: true, dataIndex: 'ci'}
                    ,{header: 'Nombre y apellidos', width: 100, sortable: true, dataIndex: 'nombreyapp'}
                    ,{header: 'Grupo escala', width: 100, sortable: true, dataIndex: 'grupoescala'}
                    ,{header: 'Tarifa H.', width: 100, sortable: true, dataIndex: 'tarifamn'}
                    ,{header: '% ejecutado', width: 100, sortable: true, dataIndex: 'porcientoejecutado', editor:self.editorsPorcientoEjecutado}
                    ,{header: 'Salario creado', width: 100, sortable: true, dataIndex: 'salariocreado'}
                    ,{header: 'SBC', width: 100, sortable: true, dataIndex: 'sbc'}
                    ,{header: 'CDS(MN)', width: 100, sortable: true, dataIndex: 'cdsmn'}
                    ,{header: 'Salario a pagar', width: 100, sortable: true, dataIndex: 'salarioapagar'}
                    ,{header: 'Plantilla nominal', width: 100, sortable: true, hidden:true, dataIndex: 'plantilla'}
        ]),
            
		this.gpPersonas = new Ext.grid.EditorGridPanel({
            id:'gpPersonas',
            region:'center',
            cm: (self.tipoconvenio==1)?self.cmindividual:self.cmcolectivo,
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '50%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{text}'
            }),
            store: (self.tipoconvenio==1)?self.storeDestajoIndividual:self.storeDestajoColectivo,
            sm: self.smModeloConvenios,
			plugins:(self.tipoconvenio==1)?self.expanderModeloConveniosIndividual:self.expanderModeloConveniosColectivo,
            loadMask:{msg : 'Cargando...'},
			clicksToEdit:1
		});
		
		
		//Panel del grid de personas
		this.panelgridpersonas = new Ext.Panel({
		    title:'Listado del personal de la Brigada',
            region: 'center',
            height: '100%',
            width: '100%',
            split: true,
            border: true,
            layout:'fit',
			items:[self.gpPersonas],
			tbar:[self.btnAddPersonas, self.btnDelPersonas, self.btnCalcularSalario, self.btnExportar, ' ',' ',' ',' ',' ',' ', 'Obra:',' ',self.tfObra, ' ',' ',' ',' ',' ',' ',
                 'Num. Convenio:',' ',self.nfNumConvenio, ' ',' ',' ',' ',' ',' ',(self.tipoconvenio==1)?'':'Total horas:',self.nfHoras, ' ',' ',' ',' ',' ',' ','Salario:', self.nfSalario, ' ',' ',' ',
                  ' ',' ',' ','Salario real:',self.nfSalarioReal
			]
		});
		
		/*
	    *Paneles(general, izquierdo, tab con dos paneles de los cuales el derecho tiene tres paneles mas)
	    */  
         this.panelGeneral = new Ext.Panel({
            id: 'panelGeneral',
            region: 'center',
            height: '100%',
            width: '100%',
            split: true,
            border: true,
            layout:'fit',
			items:[self.panelgridpersonas]
		});
		
		
		
		//Botones de la ventana de convenios
        this.btnCancelarModeloConvenio = new Ext.Button({
            id:'btnCancelarModeloConvenio',
            iconCls:'cancelar',
            text:'Cancelar',   
            tooltip:'Cancelar modelo de aplicaci&oacute;n de convenios ',
			listeners: {
                click: function(){    
                   //self.fireEvent('cancelarmodelo', this);                   
				   self.destroy();
				}.createDelegate(this)
            }
        });

        /*this.btnCancelarModeloConvenio.on('click', function(btn){
            self.fireEvent('clickbotoncancelar', btn);
        }.createDelegate(this));*/
        
        this.btnAceptarModeloConvenio = new Ext.Button({
            id:'idbtnAceptarConvenio',
            iconCls:'aceptar',
            text:'Aceptar',   
            tooltip:'Aceptar modelo de aplicaci&oacute;n de convenios '
        });
		
		//Store del listado de personas para el destajo individual.
     	this.storeBrigadas = new Ext.data.Store({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoBrigadas',
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idplantillanominal" }, 
			[{name: 'idplantillanominal'}
			 ,{name: 'denominacion'}
			])
		});
		
		this.smBrigadas = new Ext.grid.CheckboxSelectionModel();
		
		this.cmBrigadas = new Ext.grid.ColumnModel([self.smBrigadas,
			         {header: 'idpersona',    hidden: true, hideable: false, dataIndex: 'idplantillanominal'} 
					,{header: 'Brigadas', width: 50, sortable: true, dataIndex: 'denominacion'}
        ]),
            
		
		this.gpBrigadas = new Ext.grid.GridPanel({
            id:'gpBrigadas',
            region:'center',
            cm: self.cmBrigadas,
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '100%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            store: self.storeBrigadas,
            sm: self.smBrigadas,
			loadMask:{msg : 'Cargando...'},
		});
		
		//Botones de la ventana para escojer las personas
        this.btnCancelarBrigadas = new Ext.Button({
            id:'btnCancelarBrigadas',
            iconCls:'cancelar',
            text:'Cancelar',   
            tooltip:'Cancelar',
        });
        
        this.btnAceptarBrigadas = new Ext.Button({
            id:'btnAceptarBrigadas',
            iconCls:'aceptar',
            text:'Aceptar',   
            tooltip:'Aceptar',
            disabled:true,
        });

        this.ventanaBrigadas = new Ext.Window({ 
            layout:'border',
            title: 'Listado de brigadas', 
            width:600, 
            height:400,   
            closeAction:'hide', 
            closable:true,
            constrain: true,
            plain: false, 
            modal: true,
            resizable: true,
            items:[self.gpBrigadas],			
            buttons: [self.btnCancelarBrigadas, self.btnAceptarBrigadas] , 
       	});
		
	   /*
	    *  Grid y ventana con las personas del convenio
		*/
		
		//Store del listado de personas.
     	this.storePersonasBrigada = new Ext.data.GroupingStore({
		    url: '/pvd/nomina/index.php/gestconvenios/obtenerListadoPersonasBrigadas',
            groupField:'plantilla',
            sortInfo:{field: 'nombreyapellidos', direction: "ASC"},
			reader:new Ext.data.JsonReader(
			{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idcargosocupados" },
			[{name: 'idpersona'}
			 ,{name: 'ci'}
			 ,{name: 'nombreyapellidos'}
			 ,{name: 'idcargosocupados'}
			 ,{name: 'idcargo'}
			 ,{name: 'cargo'}
			 ,{name: 'idplantillanominal'}
			 ,{name: 'plantilla'}
			])
		});
		
		this.expanderPersonasBrigada = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Cargo:&nbsp;{cargo}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.smPersonasBrigada = new Ext.grid.CheckboxSelectionModel();
		
		this.cmPersonasBrigada = new Ext.grid.ColumnModel([self.smPersonasBrigada,
			         {header: 'idpersona',    hidden: true, hideable: false, dataIndex: 'idpersona'} 
					,self.expanderPersonasBrigada
					,{header: 'CI', width: 50, sortable: true, dataIndex: 'ci'}
					,{header: 'Nombre y Apellidos', width: 100, sortable: true, dataIndex: 'nombreyapellidos'}
					,{header: 'Plantilla nominal', width: 100, sortable: true, hidden:true, dataIndex: 'plantilla'}
		]),

        this.storePersonasBrigada.on('load', function(){
            var total = this.storePersonasBrigada.getCount();
            for(var i = 0; i < total; i++){
                this.expanderPersonasBrigada.expandRow(i);
            }

        }.createDelegate(this));
        		
		this.gpPersonasBrigada = new Ext.grid.GridPanel({
            id:'gpPersonasBrigada',
            region:'center',
            cm: self.cmPersonasBrigada,
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '100%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{text}'
            }),
            store: self.storePersonasBrigada,
            sm: self.smPersonasBrigada,
			plugins: self.expanderPersonasBrigada,
			loadMask:{msg : 'Cargando...'}
		});
		
		//Botones de la ventana para escojer las PersonasBrigada
        this.btnCancelarPersonasBrigada = new Ext.Button({
            id:'btnCancelarPersonasBrigada',
            iconCls:'cancelar',
            text:'Cancelar',   
            tooltip:'Cancelar',
        });
        
        this.btnAceptarPersonasBrigada = new Ext.Button({
            id:'btnAceptarPersonasBrigada',
            iconCls:'aceptar',
            text:'Aceptar',   
            tooltip:'Aceptar',
            disabled:true,
        });

        this.ventanaPersonasBrigada = new Ext.Window({ 
            layout:'border',
            title: 'Buscar persona', 
            width:600, 
            height:400,   
            closeAction:'hide',
            constrain: true,
            closable:true, 
            plain: false, 
            modal: true,
            resizable: true,
            items:[self.gpPersonasBrigada],			
            buttons: [self.btnCancelarPersonasBrigada, self.btnAceptarPersonasBrigada]
       	});

		//Eventos del componente
	    this.btnAddPersonas.on('click', function(){
		    //self.ventanaPersonas.show();
			self.storeBrigadas.load({params:{identidad:self.idestructura}});
		    self.ventanaBrigadas.show();
		}.createDelegate(this));

        this.smModeloConvenios.on('rowselect', function(obj, ind, sm){
            (this.aprobado==0)?this.btnDelPersonas.enable():this.btnDelPersonas.disable();
        }.createDelegate(this));
		
	
	    this.smBrigadas.on('rowselect', function(obj, ind, sm){
		    this.btnAceptarBrigadas.enable();
		}.createDelegate(this));
		
		this.smBrigadas.on('rowdeselect', function(obj, ind, sm){
		    selectionns = this.gpBrigadas.getSelectionModel().getSelections();
			if(selectionns.length == 0){
		      this.btnAceptarBrigadas.disable();	
			}
		}.createDelegate(this));

        this.nfHoras.on('change', function(){
            this.actionhoras = 1;
        }.createDelegate(this));
		
		this.btnCancelarBrigadas.on('click', function(){
		    self.ventanaBrigadas.hide(); 
		}.createDelegate(this));
		
		this.btnAceptarBrigadas.on('click', function(){
		    var contbrigadas = 0;
		    var arrayidbrigadas = new Array();
		    selections = this.gpBrigadas.getSelectionModel().getSelections();
			for(var i=0; i<selections.length; i++){
			  arrayidbrigadas[contbrigadas] = selections[i].data.idplantillanominal;
			  contbrigadas++;
			}
			this.storePersonasBrigada.load({params:{idplantillas: Ext.encode(arrayidbrigadas)}});
			this.ventanaPersonasBrigada.show();
		}.createDelegate(this));
		
		this.btnCancelarPersonasBrigada.on('click', function(){
		    this.ventanaPersonasBrigada.hide();
		}.createDelegate(this));
		
		this.smPersonasBrigada.on('rowselect', function(obj, ind, sm){
		    this.btnAceptarPersonasBrigada.enable();	
			
		}.createDelegate(this));
		
		this.smPersonasBrigada.on('rowdeselect', function(obj, ind, sm){
		    selectionns = this.gpPersonasBrigada.getSelectionModel().getSelections();
			if(selectionns.length == 0){
		      this.btnAceptarPersonasBrigada.disable();	
			}
		}.createDelegate(this));
		
		this.gpPersonas.on('afteredit', function(e){
		    var cont = 0;
			var auxid =new Array();
			var auxarrayDatos =new Array();
			var flag = 0;
            if(this.tipoconvenio == 1){
			  cont = this.storeDestajoIndividual.getTotalCount();
			  var todoselementos =this.storeDestajoIndividual.getRange(0,cont-1);
			  for (var i =  0; i<cont; i++) {
			    if(todoselementos[i].data.porcientoejecutado == null){
				   flag = 1;
				   break;
				}
			  }
			  if(flag==1){
			    this.btnCalcularSalario.disable();
			  }else{
			    this.btnCalcularSalario.enable();
			  }
			}else{
			  cont = this.storeDestajoColectivo.getTotalCount();
			  var todoselementos =this.storeDestajoColectivo.getRange(0,cont-1);
			  for (var i =  0; i<cont; i++) {
                if(todoselementos[i].data.horastrabajadas == null || todoselementos[i].data.cpl == null){
				   flag = 1;
				   break;
				}
			  }
			  if(flag==1){
			    this.btnCalcularSalario.disable();
			  }else{
			    this.btnCalcularSalario.enable();
			  }
			}
            if(self.aprobado==1){
                this.btnCalcularSalario.disable();
            }
        }.createDelegate(this));
		
		this.btnDelPersonas.on('click', function(){
		   var cont = 0;
		   var arrpersonasmodelo = new Array();
		   selectionns = this.gpPersonas.getSelectionModel().getSelections();
		   for(var i = 0; i < selectionns.length; i++){
		     arrpersonasmodelo[cont] = (self.tipoconvenio==1)?selectionns[i].data.idmodeloconvenioindividual:selectionns[i].data.idmodeloconveniocolectivo;
			 cont++;
		   }
		   if(arrpersonasmodelo.length>0){
		     //Se muestra la máscara de espera.
             PVD.mostrarMascara('idmaskdelmodconvenio', 'Por favor espere...', 'Eliminando datos');
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'delModConvenio',
                        method:'POST',
                        params:{arrayidmodeloconvenio : Ext.encode(arrpersonasmodelo),
                                tipoconvenio: self.tipoconvenio,
								salario : self.salario
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);
							PVD.ocultarMascara('idmaskdelmodconvenio');
							if(responseData == "ok"){
							  mostrarMensaje(1, 'Las personas se eliminaron con &eacute;xito', function(btn){
							    if(btn=="ok"){
								  if(self.tipoconvenio == 1){
			                        self.storeDestajoIndividual.load({params:{idconvenio: self.idconvenio}});
			                      }else{
			                        self.storeDestajoColectivo.load({params:{idconvenio: self.idconvenio}});
			                      }
								}
							  });
							}
                        }
                    });
		   }
		}.createDelegate(this));
		
		this.btnCalcularSalario.on('click', function(){
		    var cont = 0;
			var auxid =new Array();
			var auxarrayDatos =new Array();
			var contaux = 0;
            if(this.tipoconvenio == 1){
			  var conttotal = 0;
			  var arraytarinfa = new Array();
			  var arridmodeloindividual = new Array();
			  var arrporcientosejecutados = new Array();
			  cont = this.storeDestajoIndividual.getTotalCount();
			  var todoselementos =this.storeDestajoIndividual.getRange(0,cont-1);
			  for (var i =  0; i<cont; i++) {
                arridmodeloindividual[conttotal] = todoselementos[i].data.idmodeloconvenioindividual;
                arrporcientosejecutados[conttotal] = todoselementos[i].data.porcientoejecutado;
                arraytarinfa[conttotal] = todoselementos[i].data.tarifamn;
				conttotal++;
			  }
			  var sumatoriaporcientos = 0;
			  for(var j  = 0; j < arrporcientosejecutados.length; j++){
			    sumatoriaporcientos = sumatoriaporcientos + parseInt(arrporcientosejecutados[j]);
			  }
			  if(sumatoriaporcientos<=100){
			  //Se muestra la máscara de espera.
              PVD.mostrarMascara('idmaskcalcular', 'Por favor espere...', 'Calculando los datos del convenio');
                   
                    //Enviando datos al servidor.
                    Ext.Ajax.request({
                        url: 'calcularDestajoIndividual',
                        method:'POST',
                        params:{arridmodeloindividual : Ext.encode(arridmodeloindividual),
                                arrporcientosejecutados : Ext.encode(arrporcientosejecutados),
                                arraytarinfa : Ext.encode(arraytarinfa),
                                salarioreal : self.salarioreal,
                                fechainicio : self.fechainicio,
                                fechafin : self.fechafin,
								idestructura: self.idestructura
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);
							PVD.ocultarMascara('idmaskcalcular');
							if(responseData = "ok"){
							  mostrarMensaje(1, 'El convenio fue calculado correctamente');
							  self.storeDestajoIndividual.load({params:{idconvenio: self.idconvenio}});
							}
							
                        }
                    });
		      }else{
			    mostrarMensaje(3, 'La suma de los porcientos de las personas de la brigada debe ser menor que 100');
			  }
			}else{
			  var todoselementos =this.storeDestajoColectivo.getRange(0,cont-1);
			  var conttotal = 0;
			  var arraytarinfa = new Array();
			  var arridmodelocolectivo = new Array();
			  var arrhtrabajadas = new Array();
			  var arrcpl = new Array();
			  cont = this.storeDestajoColectivo.getTotalCount();
			  var todoselementos =this.storeDestajoColectivo.getRange(0,cont-1);
			  for (var i =  0; i<cont; i++) {
                arridmodelocolectivo[conttotal] = todoselementos[i].data.idmodeloconveniocolectivo;
                arraytarinfa[conttotal] = todoselementos[i].data.tarifamn;
				arrhtrabajadas[conttotal] = todoselementos[i].data.horastrabajadas;
				arrcpl[conttotal] = todoselementos[i].data.cpl;
				conttotal++;
			  }
			  var sumatoriahoras = 0;
			  for(var j  = 0; j < arrhtrabajadas.length; j++){
			    sumatoriahoras = sumatoriahoras + parseInt(arrhtrabajadas[j]);
			  }
			  if(self.nfHoras.getValue() != ""){
			    var horasconvenio = 0;
                  if(self.actionhoras == 1){
                      var horasconvenio = self.nfHoras.getValue();
                  }
			    if(sumatoriahoras<=self.nfHoras.getValue()){
				  var flagcpl = 0;
				  for(var k  = 0; k < arrcpl.length; k++){
			        if(arrcpl[k]>1 || arrcpl[k]<0){
					    flagcpl = 1;
					}
			      }
				  if(flagcpl == 0){
				    //Se muestra la máscara de espera.
                    PVD.mostrarMascara('idmaskcalcular', 'Por favor espere...', 'Calculando los datos del convenio');
                   
                     //Enviando datos al servidor.
                     Ext.Ajax.request({
                        url: 'calcularDestajoColectivo',
                        method:'POST',
                        params:{arridmodelocolectivo : Ext.encode(arridmodelocolectivo),
                                arraytarinfa : Ext.encode(arraytarinfa),
                                arrhtrabajadas : Ext.encode(arrhtrabajadas),
                                arrcpl : Ext.encode(arrcpl),
								salarioreal : self.salarioreal,
								fechainicio : self.fechainicio,
                                fechafin : self.fechafin,
								idestructura: self.idestructura,
                                horasconvenio: horasconvenio,
                                idconvenio: self.idconvenio
                        },
                        callback: function (options,success,response){
                            responseData = Ext.decode(response.responseText);
							PVD.ocultarMascara('idmaskcalcular');
							if(responseData = "ok"){
							  mostrarMensaje(1, 'El convenio fue calculado correctamente');
							  self.storeDestajoColectivo.load({params:{idconvenio: self.idconvenio}});
							}
                            self.actionhoras = 0;
                        }
                      });
					}else{
					  mostrarMensaje(3, 'El CPL debe estar entre 0 y 1');
					}
				}else{
				  mostrarMensaje(3, 'La suma de la cantidad de horas de las personas de la brigada debe ser menor que el total de horas del convenio');
				}
			  }else{
			    mostrarMensaje(3, 'Debe especificar la cantidad de horas del convenio');
			  }
			}
		}.createDelegate(this));
		
		this.btnAceptarPersonasBrigada.on('click', function(){
		    var cont = 0;
			var arrpersonas = new Array();
			this.ventanaPersonasBrigada.hide();
		    this.ventanaBrigadas.hide();
			selectionns = this.gpPersonasBrigada.getSelectionModel().getSelections();
			for(var i = 0; i < selectionns.length; i++){
			   arrpersonas[cont] = selectionns[i].data.idpersona;
			   cont++;
			}
			if(this.tipoconvenio == 1){
			  this.storeDestajoIndividual.load({params:{idconvenio: this.idconvenio, add:'ADD', arrayidpersonas:Ext.encode(arrpersonas)}});
			}else{
			  this.storeDestajoColectivo.load({params:{idconvenio: this.idconvenio, add:'ADD', arrayidpersonas:Ext.encode(arrpersonas)}});
			}
		}.createDelegate(this));
				
		this.buttons = [self.btnCancelarModeloConvenio, self.btnAceptarModeloConvenio];
		this.items = [self.panelGeneral];
         
      Pvd.Nomina.gestmodeloaplicacionconvenio.superclass.initComponent.call(this);
	},
	
	AddModeloConvenio: function(){
	  var este = this;
	}

});


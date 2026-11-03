Ext.ns('Pvd.Nomina.Configuraciones.ConfFormasySistemasPago');
Ext.QuickTips.init();
//Modelo
Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function(idioma) {
		this.stConceptosPercepcionesDescuentos = new Ext.data.GroupingStore({
			url: 'obtenerconceptospdportipospago',
			baseParams: {identidad:-1, idtipopago: -1, idsistemapago:-1, sedesglosa: 0},
			reader: new Ext.data.JsonReader(
                    {totalProperty: "cantidad", root: "datos", id: "idconfconceptosportiposysistemaspago"},
            [{name: 'idconfconceptosportiposysistemaspago'}
				, {name: 'idtipopago'}
				, {name: 'idsistemapago'}
				, {name: 'identidad'}
				, {name: 'idconceptopercepciondescuento'}
                , {name: 'abreviatura'}
                , {name: 'denominacion'}
                , {name: 'descripcion'}
                , {name: 'idtipoconceptopd'}
                , {name: 'tipoconcepto'}
            ]),
			sortInfo:{field: 'denominacion', direction: "ASC"},
			groupField:'tipoconcepto'
		});

        this.stConceptosPercepcionesDescuentosReplicar = new Ext.data.GroupingStore({
            url: 'obtenerconceptospdportipospagoreplicar',
            baseParams: {identidad:-1},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idconfconceptosportiposysistemaspago"},
                [{name: 'idconfconceptosportiposysistemaspago'}
                    , {name: 'idtipopago'}
                    , {name: 'idconceptopercepciondescuento'}
                    , {name: 'denominacion'}
                    , {name: 'denomtipopago'}
                ]),
            sortInfo:{field: 'denominacion', direction: "ASC"},
            groupField:'denomtipopago'
        });

        this.camposVariablesAuxiliares = [{name: 'idvariableauxconceptospdformasysistemaspago'}
				, {name: 'idconfconceptospdformasysistemaspago'}
                , {name: 'denominacion'}
                , {name: 'formaentrada'}
                , {name: 'lugaresdecimalesvariable'}
                , {name: 'idconfreportescertificaciones'}
                , {name: 'denominaciontiporeporte'}
                , {name: 'idvariablesconfreportescertificaciones'}
                , {name: 'denominacionvariabletiporeporte'}
            ];
        
        this.stVariablesAuxiliares = new Ext.data.Store({
				url: 'obtenervariablesauxiliares',
				params: {idconfconceptospdformasysistemaspago: -1},
				reader:new Ext.data.JsonReader(
				{totalProperty: "cantidad", autoLoad:true, root: "datos", id: "idvariablesauxiliaresformasistemapago" }, 
				this.camposVariablesAuxiliares)
			});
        
		this.stFormaEntrada = new Ext.data.SimpleStore({
                    fields: [{name: 'valor'}, {name: 'denominacion'}]
        });
        var a = [[1, 'Manual'], [2, 'Reporte']];
        this.stFormaEntrada.loadData(a);
		
		this.datosModelo = null;
		
		this.ConvertiraArreglo = function(arrObj){
			var arr = new Array();
			for(var i = 0; i < arrObj.length; i++){
				var a = new Array();
				a[0] = arrObj[i].idindicador;
				a[1] = arrObj[i].indicador;
				a[2] = arrObj[i].tipo;
				arr[i] = a;
			}
			return arr;
		}
		
		this.CargarConceptosPD = function(identidad, tipopagoseleccionado, idsistemapago){
			this.stConceptosPercepcionesDescuentos.baseParams.identidad = identidad;
			this.stConceptosPercepcionesDescuentos.baseParams.idtipopago = tipopagoseleccionado.data.idtipopago;
			this.stConceptosPercepcionesDescuentos.baseParams.idsistemapago = idsistemapago;
			this.stConceptosPercepcionesDescuentos.baseParams.sedesglosa = tipopagoseleccionado.data.sedesglosa;
			this.stConceptosPercepcionesDescuentos.removeAll();
			this.stConceptosPercepcionesDescuentos.load({params: {limit:1000, start:0}});
		}

        this.CargarConceptosPDReplicar = function(identidad){
            this.stConceptosPercepcionesDescuentosReplicar.baseParams.identidad = identidad;
            this.stConceptosPercepcionesDescuentosReplicar.removeAll();
            this.stConceptosPercepcionesDescuentosReplicar.load();
        }
    }
};

//Vista del componente Nomencladores de nóminas.
Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo).
     */
    init: function(perfil, idioma, modelo) {
      var self = this;
        this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
        	layout: 'border',
            region:'center',
            nivel: 7,
            nivelchequear: 3
            
        });
        
        this.btnAceptarEntidad = new Ext.Button({
            id: 'btnAceptarEntidad',
            text: 'Aceptar',
            tooltip: 'Aceptar',
//            icon: perfil.dirImg+'aceptar.png',
            disabled: true,
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.winEstructura = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnAceptarEntidad] 
        });
        
        this.objTiposPago = new Pvd.nomina.nomencladores.ListarTiposPagoComp({
			title: 'Tipos de pago',
			border: true,
			region: 'center',
            multiselect: true,
			split: true,
			width: '25%',
			height: '50%'
		});
        
        this.pTiposSistemasPago = new Ext.Panel({
			layout: 'border', 
			region: 'west',
			split: true,
            width: '30%',
            height: '35%',
            border: false,
            items: [this.objTiposPago]
		});

        //****Replicar
        this.btnAceptarEntidadreplicar = new Ext.Button({
            id: 'btnAceptarEntidadreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.pobjestructurareplicar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 7,
            nivelachequear: [3, 5]

        });

        this.winEstructurareplicar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.pobjestructurareplicar],
            buttons: [this.btnAceptarEntidadreplicar]
        });
        //Tipo de replica, por entidades o pr tipos de pago
        this.rbEntidades = new Ext.form.Radio({
            id: 'rbEntidades',
            boxLabel: 'Entidades',
            name: 'tiporeplica',
            checked: true,
            inputValue: 1
        });

        this.rbTiposPago = new Ext.form.Radio({
            id: 'rbTiposPago',
            boxLabel: 'Tipos de pago',
            name: 'tiporeplica',
            inputValue: 2
        });

        this.rgTipoReplica = new Ext.form.RadioGroup({
            region: 'center',
            width: '90%',
            hideLabel: true,
            columns: [.5, .5],
            style: 'padding-left: 20px;',
            items: [this.rbEntidades, this.rbTiposPago]
        });

        this.formularioTipoReplica = new Ext.FormPanel({
            id: 'idformularioAsociasion',
            width: 500,
            heigth: 450,
            autoHeight: true,
            frame: true,
            region: 'center',
            items: [{
                xtype: 'fieldset',
                title: '',
                height: 65,
                width: '93%',
                region: 'center',
                items: [
                    this.rgTipoReplica
                ]
            }]
        });

        this.btnAceptarTipoReplica = new Ext.Button({
            id: 'btnAceptarTipoReplica',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana'
        });

        this.btnCancelarTipoReplica = new Ext.Button({
            id: 'btnCancelarTipoReplica',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos'
        });

        this.ventanaTipoReplica = new Ext.Window({
            region: 'center',
            title: 'Tipos de replica',
            layout: 'fit',
            modal: true,
            resizable: false,
            draggable: true,
            autoHeight: true,
            autoWidth: true,
            closeAction: 'hide',
            closable: true,
            items: [this.formularioTipoReplica],
            //buttons: [this.btnCancelarAsociacion, this.btnAceptarAsociacion]
            bbar: ['->', this.btnCancelarTipoReplica, this.btnAceptarTipoReplica]
        });

        //Tipos de pago a replicar
        this.objTiposPagoReplicar = new Pvd.nomina.nomencladores.ListarTiposPagoComp({
            title: 'Tipos de pago',
            border: true,
            multiselect: true,
            region: 'center',
            split: true,
            width: '100%',
            height: '100%'
        });

        this.btnAceptarTiposPagoreplicar = new Ext.Button({
            id: 'btnAceptarTiposPagoreplicar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar',
            handler: function () {
            }.createDelegate(this)
        });

        this.btCancelarTiposPagoreplicar = new Ext.Button({
            id: 'btCancelarTiposPagoreplicar',
            text: 'Cancelar',
            tooltip: 'Cancelar',
            iconCls: 'cancelar',
            handler: function () {
            }.createDelegate(this)
        });

        this.winTiposPagosreplicar = new Ext.Window({
            title: 'Tipos de pago',
            modal: true,
            height: 500,
            width: 600,
            closable: true,
            closeAction: 'hide',
            resizable: false,
            layout: 'fit',
            items: [this.objTiposPagoReplicar],
            buttons: [this.btCancelarTiposPagoreplicar, this.btnAceptarTiposPagoreplicar]
        });


        /**********************************************************************************************/

		
		this.expanderConceptosPercepcionesDescuentos = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });
		
		this.multiSelect = new Ext.grid.CheckboxSelectionModel({});

        this.multiSelectReplicar = new Ext.grid.CheckboxSelectionModel({});

		this.cmConceptosPercepcionesDescuentos = new Ext.grid.ColumnModel([this.multiSelect,{
               header: "idconfconceptosportiposysistemaspago",
               dataIndex: 'idconfconceptosportiposysistemaspago',
               hidden: true,
               hideable: false
            },{
               header: "idtipopago",
               dataIndex: 'idtipopago',
               hidden: true,
               hideable: false
            },{
               header: "idsistemapago",
               dataIndex: 'idsistemapago',
               hidden: true,
               hideable: false
            },{
               header: "identidad",
               dataIndex: 'identidad',
               hidden: true,
               hideable: false
            },{
               header: "idconceptopercepciondescuento",
               dataIndex: 'idconceptopercepciondescuento',
               hidden: true,
               hideable: false
            },{
               header: "idtipoconceptopd",
               dataIndex: 'idtipoconceptopd',
               hidden: true,
               hideable: false
            },this.expanderConceptosPercepcionesDescuentos,{
               header: "Denominaci&oacute;n",
               dataIndex: 'denominacion',
               width: 250
            },{
               header: "Descripci&oacute;n",
               dataIndex: 'descripcion',
               width: 50,
               hidden: true,
               hideable: false
            },{
               header: "Tipo de concepto",
               dataIndex: 'tipoconcepto',
               width: 50,
               hidden: true,
               hideable: false
            }
        ]);
        this.cmConceptosPercepcionesDescuentos.defaultSortable = true;



        this.cmConceptosPercepcionesDescuentosReplicar = new Ext.grid.ColumnModel([this.multiSelect,{
            header: "idconfconceptosportiposysistemaspago",
            dataIndex: 'idconfconceptosportiposysistemaspago',
            hidden: true,
            hideable: false
        },{
            header: "Denominaci&oacute;n",
            dataIndex: 'denominacion',
            width: 250
        },{
            header: "Tipo de Pago",
            dataIndex: 'denomtipopago',
            width: 50,
            hidden: true,
            hideable: false
        }
        ]);
        this.cmConceptosPercepcionesDescuentosReplicar.defaultSortable = true;
        
        this.btnAdicionarConcepto = new Ext.Button({
            id: 'btnAdicionarConcepto',
            text: "Ad<u>i</u>cionar",
            tooltip: idioma.textToolTipAddConcepto,
            disabled: true,
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnEliminarConcepto = new Ext.Button({
            id: 'btnEliminarConcepto',
            text: 'Eliminar',
            tooltip: idioma.textToolTipElimConcepto,
            disabled: true,
//            icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });

        this.btnreplicar = new Ext.Button({
            id: 'btnreplicar',
            text: 'Replicar',
            tooltip: 'Replicar',
            disabled: true,
            iconCls: 'adicionar',
            handler: function () {
            }.createDelegate(this)
        });
        
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: idioma.textToolTipAyuda,
            iconCls:'ayuda'/*,
            prevTab: 'btnElimFormP',
            nextTab: 'btnAddFormP',*/
        });
		
		//Textfield y boton para buscar
		this.tfbuscar = new Ext.form.TextField({
            id:'tfbuscar',
            emptyText:'Criterio a buscar...',
            enableKeyEvents: true,
            maskRe : /^([a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]+ ?[a-zA-ZÃ¡Ã©Ã­Ã³ÃºÃ±Ã¼Ã‘\d\s]*)+$/,
            anchor:'90%',
            name : 'tfbuscador',
            prevTab: '',
            nextTab: ''
        });

        this.btnBuscar = new Ext.Button({
            disabled : false,
            id : 'btnBuscar',
//            icon : perfil.dirImg + 'buscar.png',
            iconCls : 'buscar',
            text: '<u>B</u>uscar',
            tooltip: idioma.textToolTipBuscarConcepto,
        });

		this.gpConceptosPercepcionesDescuentos = new Ext.grid.GridPanel({
			store: modelo.stConceptosPercepcionesDescuentos,
			cm: this.cmConceptosPercepcionesDescuentos,
			sm: this.multiSelect,/*new Ext.grid.RowSelectionModel({ singleSelect:true }),
			region: 'center',
			view: new Ext.grid.GroupingView({
				forceFit:true,
				groupTextTpl: '{text}'
			}),*/
			plugins: this.expanderConceptosPercepcionesDescuentos,
			title: 'Conceptos de percepciones y descuentos',
            region: 'center',
            width: '40%',
            split: true,
            height: '35%',
			loadMask:{msg : 'Cargando...'},
			tbar: [this.btnAdicionarConcepto, this.btnEliminarConcepto, ' ',' ',' ',' ',' ', this.tfbuscar, this.btnBuscar,'->',this.btnreplicar],
            keys: [
                {
                    key: 'b',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnBuscar.handler();
                    }
                },
            ],
            bbar:new Ext.PagingToolbar({ 
                pageSize: 1000, 
                store: modelo.stConceptosPercepcionesDescuentos,
                displayInfo: true, 
                displayMsg: 'Mostrando  {0} - {1} de {2}', 
                emptyMsg: "0 Resultado a mostrar" 
            })
		});


        this.gpConceptosPercepcionesDescuentosReplicar = new Ext.grid.GridPanel({
            store: modelo.stConceptosPercepcionesDescuentosReplicar,
            cm: this.cmConceptosPercepcionesDescuentosReplicar,
            sm: this.multiSelectReplicar,
			view: new Ext.grid.GroupingView({
				forceFit:true,
				groupTextTpl: '{text}'
			}),
            title: 'Conceptos de percepciones y descuentos',
            region: 'center',
            width: '40%',
            split: true,
            height: '35%',
            loadMask:{msg : 'Cargando...'},

        });

        this.btnAceptarConceptoReplicar = new Ext.Button({
            id: 'btnAceptarConceptoReplicar',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar,
//            icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });

        this.btnCancelarConceptoReplicar = new Ext.Button({
            id: 'btnCancelarConceptoReplicar',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar,
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });

        this.winConceptosPercepcionDescuentosReplicar = new Ext.Window({
            title: 'Replicar conceptos de percepci&oacute;n y descuento',
            modal: true,
            height: 400,
            width: 600,
            closeAction: 'hide',
            constrain: true,
            closable:true,
            resizable:false,
            layout: 'border',
            items:[this.gpConceptosPercepcionesDescuentosReplicar],
            buttons:[this.btnCancelarConceptoReplicar, this.btnAceptarConceptoReplicar]
        });
        
        /*********************************************************************************************/
		
		this.objConceptosPercepcionesDescuentos = new Pvd.nomina.nomencladores.ListarConceptosPercepcionesDescuentosComp({
            region: 'center',
            layout: 'fit',
            width: '100%',
            split: true,
            height: '100%',
            tipo: 2,
            seleccionMultiple: true
		});
		
		this.btnAceptarConcepto = new Ext.Button({
            id: 'btnAceptarConcepto',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptar,
//            icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnAplicarConcepto = new Ext.Button({
            id: 'btnAplicarConcepto',
            text: 'Aplicar',
            tooltip: idioma.textToolTipAplicar,
//            icon: perfil.dirImg+'aplicar.png',
            iconCls: 'aplicar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });
        
        this.btnCancelarConcepto = new Ext.Button({
            id: 'btnCancelarConcepto',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelar,
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });


		
		this.winConceptosPercepcionDescuentos = new Ext.Window({
            title: 'Adicionar concepto de percepci&oacute;n y descuento',
            modal: true,
            height: 400,
            width: 600,
            closeAction: 'hide',
            constrain: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.objConceptosPercepcionesDescuentos],
            buttons:[this.btnCancelarConcepto, this.btnAplicarConcepto, this.btnAceptarConcepto]
        });
		
		this.rbManual = new Ext.form.Radio({boxLabel: 'Manual', name: 'formacalculo', inputValue: 1, checked: true});
		this.rbFormula = new Ext.form.Radio({boxLabel: 'F&oacute;rmula', name: 'formacalculo', inputValue: 2});
		this.rgFormaCalculo = new Ext.form.RadioGroup({
				region: 'center',
                height: 20,
                hideLabel : true,
                items: [this.rbFormula]
        }); 
		
	this.nfCantidadLugaresDecimales = new Ext.form.NumberField({id:'idnfCantidadLugaresDecimales', fieldLabel:'Lugares decimales',
                                        name: 'lugaresdecimales', allowBlank: false, 
                                        anchor: '99%',
                                        blankText:'Este campo es obliglatorio',
                                        maxLength:6,
                                        maxLengthText:'El máximo permitido es de 6 caracteres', 
       });

       
        this.taFormula = new Ext.form.TextArea({
			hideLabel: true,
            allowBlank: false,
			disabled: true,
            region: 'center',
            layout: 'fit',  
            anchor: '100%',
            blankText:'Este campo es obligatorio.'
        });
		
	       
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: "Ad<u>i</u>cionar",
            tooltip: idioma.textToolTipAddVarAux,
//            icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: idioma.textToolTipElimVarAux,
            disabled: true,
//            icon: perfil.dirImg+'eliminar.png',
            iconCls: 'eliminar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });
        
        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar1',
            text: 'Guardar',
            tooltip: idioma.textToolTipGuardarConfig,
			disabled: true,
//            icon: perfil.dirImg+'guardar.png',
            iconCls: 'guardar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.expanderVariablesAuxiliares = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Reporte:&nbsp;{denominaciontiporeporte} </p><p>&nbsp;&nbsp;Campo del reporte:&nbsp;{denominacionvariabletiporeporte} </p><br/></div>'
            ),enableCaching: false
        });
        
        this.cmVariablesAuxiliares = new Ext.grid.ColumnModel([{
               header: "idvariableauxconceptospdformasysistemaspago",
               dataIndex: 'idvariableauxconceptospdformasysistemaspago',
               hidden: true,
               hideable: false
            },{
               header: "idconfreportescertificaciones",
               dataIndex: 'idconfreportescertificaciones',
               hidden: true,
               hideable: false
            },{
               header: "idvariablesconfreportescertificaciones",
               dataIndex: 'idvariablesconfreportescertificaciones',
               hidden: true,
               hideable: false
            },this.expanderVariablesAuxiliares,{
               header: "Denominaci&oacute;n",
               dataIndex: 'denominacion',
               width: 150
            },{
               header: "Forma de entrada",
               dataIndex: 'formaentrada',
               width: 75,
               renderer: function(valor){if(valor == 1) return 'Manual'; else if(valor == 2) return 'Reporte'; else return valor;}
            },{
               header: "Lugares decimales",
               dataIndex: 'lugaresdecimalesvariable',
               width: 75,
               //renderer: function(valor){if(valor == 1) return 'Manual'; else if(valor == 2) return 'Reporte'; else return valor;}
            },{
               header: "Reporte",
               dataIndex: 'denominaciontiporeporte',
               width: 50,
               hidden: true,
               hideable: false
            }
            ,{
               header: "Campo del reporte",
               dataIndex: 'denominacionvariabletiporeporte',
               width: 50,
               hidden: true,
               hideable: false
            }
        ]);        
        this.cmVariablesAuxiliares.defaultSortable = true;
        
        this.gpVariablesAuxiliares = new Ext.grid.GridPanel({
			title: 'Variables auxiliares',
			tbar: [this.btnAdicionar, this.btnEliminar],
			store: modelo.stVariablesAuxiliares,
			cm: this.cmVariablesAuxiliares,
			region: 'center',
			layout: 'fit',
			height: 400,
			viewConfig: {forceFit: true},
			loadMask:{msg : 'Cargando...'},
			plugins: this.expanderVariablesAuxiliares
		});

        this.pVariablesAuxiliares = new Ext.Panel({
            region: 'center',
            layout: 'border',
            border: false,
            height: '90%',
            width: '100%',
            items: [this.gpVariablesAuxiliares]
        });
        
        this.pFormulaVariablesAuxiliares = new Ext.Panel({
			frame: true,
			labelAlign: 'left',
			region: 'center',
			layout: 'border',
			border: false,
			height: '90%',
			//disabled: true,
			items: [{
					region: 'north', 
					xtype:'fieldset',
					title: 'F&oacute;rmula',
					height: 100,
					hideLabel: true,
					items: [this.taFormula] 
					},
					this.pVariablesAuxiliares
			]
		});
		
		this.fpFormaCalculo = new Ext.FormPanel({
			frame: true,
			labelWidth: 110,
			labelAlign: 'right', 
			region: 'north',
			height: 80,
			//disabled: true,
			items: [{
				xtype:'fieldset',
				title: 'Forma de c&aacute;lculo',
				autoHeight: true,
				region: 'center',
				items: [{layout:'column',
                                        items:[
                                        {columnWidth:.5, layout: 'form', items: [this.rgFormaCalculo]},
                                        {columnWidth:.5, layout: 'form', items: [this.nfCantidadLugaresDecimales]},                            
                                              ]
                                       }]
				}]
		});
		
		this.pConfFormasySistemasPago = new Ext.Panel({
			title: 'Configuraci&oacute;n',
			tbar: [this.btnGuardar, '->', this.btnAyuda],
            region: 'east',
            layout: 'border',
            width: '35%',
            //disabled: true,
            border: false,
            split: true,
            items: [this.fpFormaCalculo, this.pFormulaVariablesAuxiliares]
		});
		
		this.pTiposReportesCertificaciones = new Pvd.Nomina.TiposReportesyCertificaciones.BuscarTipoReportesyCertificaciones({
            height: 300,
            width: 600,
            region: 'center',
            layout: 'fit',
            cantidadPorPagina: 10,
            border: true,
            mostrarVariables: true
        });
        
        this.tfDenominacion = new Ext.form.TextField({
			fieldLabel: 'Denominaci&oacute;n',
            allowBlank: false,
            vtype:'vtdenominaciones',
            anchor: '99%',
            blankText:'Este campo es obligatorio.'
        });
        
        this.cbFormaEntrada = new Ext.form.ComboBox({
           fieldLabel:'Forma entrada',
           anchor: '98%',
           triggerAction: 'all',
           valueField: 'valor', 
           displayField: 'denominacion', 
           hiddenName: 'valor',
           allowBlank: false, 
           mode: 'local',
           blankText:'Este campo es obligatorio.', 
           readOnly: true,
           store: modelo.stFormaEntrada 
        });
        
	    this.nfCantidadLugaresDecimalesVariable = new Ext.form.NumberField({id:'idnfCantidadLugaresDecimalesVariable', fieldLabel:'Lugares decimales',
                                        name: 'lugaresdecimalesvariable', allowBlank: false, 
                                        anchor: '99%',
                                        //blankText:'Este campo es obliglatorio',
                                        maxLength:6,
                                        maxLengthText:'El máximo permitido es de 6 caracteres', 
       });
	
        this.fpVariablesAuxiliares = new Ext.FormPanel({
			labelAlign: 'top',
			frame:true,
			region: 'center',
			layout:'border',
			height: 400,
			width: 800,
			items: [{
					layout:'column',
					region: 'north',
					height: 50,
					items:[{
							columnWidth:.45,
							layout: 'form',
							items: [this.tfDenominacion]
						},{
							columnWidth:.25,
							layout: 'form',
							items: [this.cbFormaEntrada]
						},{
							columnWidth:.30,
							layout: 'form',
							items: [this.nfCantidadLugaresDecimalesVariable]
						}]
					},this.pTiposReportesCertificaciones
				   ]
		});
		
		this.btnAceptar= new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            tooltip: idioma.textToolTipAceptarVar,
//            icon: perfil.dirImg+'aceptar.png',
            iconCls: 'aceptar'/*,
            prevTab: 'btnAyudaFormP',
            nextTab: 'btnModFormP',*/,
            handler: function(){
            }.createDelegate(this)
        });
        
        this.btnAplicar = new Ext.Button({
            id: 'btnAplicar',
            text: 'Aplicar',
            tooltip: idioma.textToolTipAplicarVar,
//            icon: perfil.dirImg+'aplicar.png',
            iconCls: 'aplicar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });
        
        this.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: idioma.textToolTipCancelarVar,
//            icon: perfil.dirImg+'cancelar.png',
            iconCls: 'cancelar'/*,
            prevTab: 'btnModFormP',
            nextTab: 'btnAyudaFormP',*/
        });
		
		this.winVariablesAuxiliares = new Ext.Window({
            title: 'Adicionar variable auxiliar',
            modal: true,
            height: 400,
            width: 600,
            closeAction: 'hide',
            constrain: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.fpVariablesAuxiliares],
            buttons:[this.btnCancelar, this.btnAplicar, this.btnAceptar]
        });
        
        this.winMostrarConfFormasySistemasPago = new Ext.Window({
            title: 'Configuraci&oacute;n de formas y sistemas de pago',
            modal: true,
            height: 600,
            constrain: true,
            width: 800,
            closeAction: 'hide',
            maximized: true,
            closable:true,
            resizable:false, 
            layout: 'border',
            items:[this.pTiposSistemasPago, this.gpConceptosPercepcionesDescuentos, this.pConfFormasySistemasPago]
        });

        /************************************Eliminar multiple*******************************/
        this.btnAceptarEliminar = new Ext.Button({
            id: 'btnAceptarEliminar',
            text: 'Aceptar',
            tooltip: 'Aceptar',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.pobjestrucEliminar = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'center',
            nivel: 5,
            nivelachequear: [3, 5]
        });

        this.winEstructuraEliminar = new Ext.Window({
            title: 'Entidades',
            modal: true,
            height: 350,
            width: 300,
            closeAction: 'hide',
            //closable: true,
            resizable: false,
            layout: 'fit',
            items: [this.pobjestrucEliminar],
            buttons: [this.btnAceptarEliminar]
        });
        /************************************Eliminar multiple*******************************/
    }
};

//Controlador de la vista del componente Nomencladores de nóminas.
Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Controlador = {
    /**
     * Inicializar el controlador de la vista.
     * 
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param vista Vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Vista)
     * @param modelo Modelo de la vista del componente Nomencladores de nóminas (Tipo: Pvd.Nomina.Nomencladores.NomencladoresNomina.Modelo)
     */
    init: function(idioma, vista, modelo) {
        this.nodosseleccionados = new Array();
        var self = this;
        var tiporeplica = 1;//1:Entidades, 2:Tipos de Pago
        var replicageneral = 0;//0:Para todos los tipos de pago seleccionados, 2:Desde un Tipo de Pago hacia otras Entidades
		this.identidad = null;
		this.idconfconceptospdformasysistemaspago = null;
		this.idconfconceptosportiposysistemaspago = null;
		this.idsistemapago = null; 
		this.idperiodopago = null;
		this.idtipopago = null;
		this.tipopagoseleccionado = null;
		this.accion = '';
		this.idexpresionmatematica = null;
		this.idconceptopercepciondescuento = null;
		this.conceptopercepciondescuento = null;
		this.tarifasconcepto = null;

                //eliminar multiple
                this.nodosseleccionadosaeliminar = new Array();
        var variablesGenerales = {
            identidad: 0,
            identidadreplicar: 0,
            idsistemapago: 0,
            idtipopago: 0,

        };
		
		/**
         *Teclas calientes de la interfaz.
         */
        this.keyMap = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'imh',
            alt: true,
            stopEvent: true, 
            handler: function(k, e) {
               switch(k) {
                    case 73:{ //i para adicionar.
                        if(!vista.btnAdicionarConcepto.disabled && !vista.winConceptosPercepcionDescuentos.isVisible()){
                               vista.btnAdicionarConcepto.fireEvent('click');
                        }
					 break;
                    } 
                    /*case 77:{ //m para modificar .
                        if(!vista.btnModificarSitLaboral.disabled && !vista.ventanaSitLaboral.isVisible()){
                            mostrarVentanaModificarSitLaboral();
                        }
                     break;
                    }*/
                    case 72:{ //h para ayuda. 
                            vista.btnAyuda.focus();
							vista.btnAyuda.fireEvent('click');
                       
                        break;
                    }
               }
            }      
        },{
            key: 46,//del para eliminar.
            fn: function(){if(!vista.btnEliminarConcepto.disabled && !vista.winConceptosPercepcionDescuentos.isVisible() && vista.gpConceptosPercepcionesDescuentos.getSelectionModel().hasSelection()){
                vista.btnEliminarConcepto.fireEvent('click');
            }},
        },{
            key: 13,//enter para aceptar.
            fn: function(){if(vista.btnAceptarConcepto.isVisible()){
                vista.btnAceptarConcepto.focus();
                vista.btnAceptarConcepto.fireEvent('click');
            }},
        }]);
		
        vista.pobjestructura.on('estructuraselecionada',function(sm, nodo){
            //if(nodo.attributes.tipoestructura == 3){
                vista.btnAceptarEntidad.enable();
                this.identidad = nodo.id;
            //}
        }.createDelegate(this));
        
        vista.btnAceptarEntidad.setHandler(function(){
            vista.winMostrarConfFormasySistemasPago.show();
            vista.objConceptosPercepcionesDescuentos.Cargar();
        });
        //Replicar
        vista.pobjestructurareplicar.on('uncheckednode', function (sm, nodo) {
            if(nodo.attributes.id!=this.identidad){
                var index = this.nodosseleccionados.indexOf(nodo.attributes.id);
                if (index > -1) {
                    this.nodosseleccionados.splice(index, 1);
                }
            }


        }.createDelegate(this));

        vista.pobjestructurareplicar.on('checkednode', function (sm, nodo) {
            if(nodo.attributes.id!=this.identidad){
                this.nodosseleccionados.push(nodo.attributes.id);
            }
            
        }.createDelegate(this));


        vista.pobjestructurareplicar.on('estructuraselecionada', function (sm, nodo) {
            //if (nodo.attributes.tipoestructura == 3) {
                vista.btnAceptarEntidadreplicar.enable();
                variablesGenerales.identidadreplicar = nodo.id;

            //}
        }.createDelegate(this));

        vista.btnAceptarEntidadreplicar.on('click', function () {
            if(replicageneral == 0){
                replicarDatosTipoPagoEntidadesOTiposdePago(this.identidad);
            }else{
                replicarDatosTodosTipoPagoEntidades(this.identidad);
            }
        }.createDelegate(this));

        vista.btnreplicar.setHandler(function () {
            var cantidadtipospagosel = vista.objTiposPago.gpTiposPago.getSelectionModel().getSelections().length;

            //Si es un solo Tipo de Pago se Replican los Conceptos de ese Tipo de Pago
            if(cantidadtipospagosel == 1){
                vista.ventanaTipoReplica.show();
                replicageneral = 0;
            }
            //Si son varios Tipos de Pagos se Replican los Conceptos de esos Tipos de Pagos para otras Estructuras
            else{
                var arrtipospagosel = vista.objTiposPago.gpTiposPago.getSelectionModel().getSelections();
                var arrayidtipospago = new Array();
                for(var i = 0; i < arrtipospagosel.length; i++){
                    arrayidtipospago[i] = arrtipospagosel[i].data.idtipopago;
                }
                modelo.stConceptosPercepcionesDescuentosReplicar.baseParams.identidad = this.identidad;
                modelo.stConceptosPercepcionesDescuentosReplicar.baseParams.arrtipospago = Ext.encode(arrayidtipospago);
                modelo.stConceptosPercepcionesDescuentosReplicar.load();
                vista.winConceptosPercepcionDescuentosReplicar.show();

                replicageneral = 1;
            }
        }.createDelegate(this));

        vista.btnCancelarConceptoReplicar.on('click', function(){
            vista.winConceptosPercepcionDescuentosReplicar.hide();
        });

        vista.btnAceptarConceptoReplicar.on('click', function(){
            vista.winEstructurareplicar.show();
        });

        vista.btnCancelarTipoReplica.on('click', function(){
            vista.ventanaTipoReplica.hide();
        });

        vista.btnAceptarTipoReplica.on('click', function(){
            if (vista.rbTiposPago.getGroupValue() == 1) {
                tiporeplica = 1;//Entidades
                vista.winEstructurareplicar.show();
            } else {
                tiporeplica = 2;//Tipos pagos
                vista.winTiposPagosreplicar.show();
                vista.objTiposPagoReplicar.Cargar();
            }
        });

        vista.btCancelarTiposPagoreplicar.on('click', function(){
            vista.winTiposPagosreplicar.hide();
        });

        //Replicar los conceptos para otros tipos de pagos de la misma entidad
        vista.btnAceptarTiposPagoreplicar.on('click', function(){
            replicarDatosTipoPagoEntidadesOTiposdePago(this.identidad);
        }.createDelegate(this));

        //btnBuscar
		vista.btnBuscar.setHandler(function(){
		    var textobuscador = vista.tfbuscar.getValue();
		    if(textobuscador != ""){
			modelo.stConceptosPercepcionesDescuentos.baseParams.identidad = this.identidad;
			modelo.stConceptosPercepcionesDescuentos.baseParams.idtipopago = this.tipopagoseleccionado.data.idtipopago;
			modelo.stConceptosPercepcionesDescuentos.baseParams.idsistemapago = this.idsistemapago;
			modelo.stConceptosPercepcionesDescuentos.baseParams.sedesglosa = this.tipopagoseleccionado.data.sedesglosa;
			//modelo.stConceptosPercepcionesDescuentos.baseParams.buscar = 1;
			modelo.stConceptosPercepcionesDescuentos.baseParams.texto = textobuscador;
			modelo.stConceptosPercepcionesDescuentos.removeAll();
			modelo.stConceptosPercepcionesDescuentos.load({params: {limit:1000, start:0, texto:textobuscador, buscar:1}});
		    }else{
			textobuscador = "";
			modelo.CargarConceptosPD(this.identidad, this.tipopagoseleccionado, this.idsistemapago);
			}
			textobuscador = "";
		}.createDelegate(this));
		
        vista.btnAdicionarConcepto.on('click', function(){
		   	vista.winConceptosPercepcionDescuentos.show();
			vista.objConceptosPercepcionesDescuentos.Desmarcar();
		}.createDelegate(this));
		
		vista.btnEliminarConcepto.on('click',function(){
			if(this.idconceptopercepciondescuento){
				mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar el concepto de percepci&oacute;n y descuento seleccionado?', function(btn){
					if(btn == "ok"){
					        vista.winEstructuraEliminar.show();
						//this.ADDDELConceptosPD('DEL', 'ACEPTAR', this.DatosConceptosPD('DEL'));
					}
				}.createDelegate(this));
			}else {
				mostrarMensaje(1,'Debe seleccionar un concepto de percepci&oacute;n y descuento.');
			}
		}.createDelegate(this));
		
		vista.btnCancelarConcepto.setHandler(function(){
			vista.winConceptosPercepcionDescuentos.hide();
			vista.objConceptosPercepcionesDescuentos.Desmarcar();
		}.createDelegate(this));
		
		vista.btnAceptarConcepto.on('click', function(){
			if(vista.objConceptosPercepcionesDescuentos.GetSeleccionados().length > 0){
				this.ADDDELConceptosPD('ADD', 'ACEPTAR', this.DatosConceptosPD('ADD'));
			}else{
				mostrarMensaje(1, 'Debe seleccinar un concepto de percepci&oacute;n y descuento.');
			}
		}.createDelegate(this));
		
		vista.btnAplicarConcepto.setHandler(function(){
			if(vista.objConceptosPercepcionesDescuentos.GetSeleccionados().length > 0){
				this.ADDDELConceptosPD('ADD', 'APLICAR', this.DatosConceptosPD('ADD'));
			}else{
				mostrarMensaje(1, 'Debe seleccinar un concepto de percepci&oacute;n y descuento.');
			}
		}.createDelegate(this));
		

		
		vista.objTiposPago.on('tipopagoseleccionado', function(fila){
			vista.btnEliminarConcepto.disable();
			vista.btnGuardar.disable();
			this.idtipopago = fila.data.idtipopago;
			this.tipopagoseleccionado = fila;
			this.idconceptopercepciondescuento = null;
			modelo.stConceptosPercepcionesDescuentos.removeAll();
			this.limpiarConfiguracion();
            this.idsistemapago = null;
            this.idperiodopago = null;
            vista.gpConceptosPercepcionesDescuentos.enable();
            vista.btnAdicionarConcepto.enable();
            this.idconceptopercepciondescuento = null;
            modelo.CargarConceptosPD(this.identidad, this.tipopagoseleccionado, this.idsistemapago);

            vista.btnreplicar.enable();

		}.createDelegate(this));

        
        vista.winMostrarConfFormasySistemasPago.on('show', function(){
			vista.objTiposPago.Cargar();
			this.limpiarConfiguracion();
		}.createDelegate(this));
		
		vista.winEstructura.show();

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowselect', function(sm, index, r){
            vista.btnAceptarTiposPagoreplicar.enable();
        });

        vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().on('rowdeselect', function(sm, index, r){
            vista.btnAceptarTiposPagoreplicar.disable();
        });
		
		vista.gpConceptosPercepcionesDescuentos.getSelectionModel().on('rowselect', function(sm, index, r){
            vista.btnreplicar.enable();
		    vista.btnGuardar.enable();
			this.idconceptopercepciondescuento = r.data.idconceptopercepciondescuento;
			this.idconfconceptosportiposysistemaspago = r.data.idconfconceptosportiposysistemaspago;
			this.conceptopercepciondescuento = r;
			vista.nfCantidadLugaresDecimales.setValue("");
			if(this.tipopagoseleccionado.data.sedesglosa == 1){
				if(this.idperiodopago && this.idconceptopercepciondescuento){
					this.CargarConfiguracionConceptoSistemaPago();
				}
			} else this.CargarConfiguracionConceptoSistemaPago();
			
			vista.btnEliminarConcepto.enable();
		}.createDelegate(this));

        //Deshabilitar el botón REPLICAR si no existen conceptos seleccionados.
        vista.gpConceptosPercepcionesDescuentos.getSelectionModel().on('rowdeselect', function (sm, index, r) {
            (sm.selections.length > 0) ? vista.btnreplicar.enable() : vista.btnreplicar.disable();
        }.createDelegate(this));

        function replicarDatosTipoPagoEntidadesOTiposdePago(identidad){
            var arrEntidades = new Array();
            var arrTiposPagosReplicar = new Array();
            //Si la replica es hacia otras entidades
            if(tiporeplica == 1){
                var s = vista.pobjestructurareplicar.getSeleccionados();
                if(s.length <= 0){
                    mostrarMensaje(3, 'Debe seleccionar una entidad.');
                    return;
                }

                for(var i = 0; i < s.length; i++){
                    if(s[i].id != this.identidad){
                        arrEntidades.push(s[i].id);
                    }
                }
                arrTiposPagosReplicar[0] = vista.objTiposPago.gpTiposPago.getSelectionModel().getSelected().data.idtipopago;
            //Si la replica es hacia otros tipos de pagos de la entidad
            }else if(tiporeplica == 2){
                arrEntidades[0] = identidad;
                if(vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().hasSelection()){
                    var datostipospago = vista.objTiposPagoReplicar.gpTiposPago.getSelectionModel().getSelections();
                    Ext.each(datostipospago, function (rec) {
                        arrTiposPagosReplicar.push(rec.get('idtipopago'));
                    });
                }

            }



            if((tiporeplica == 1 && self.nodosseleccionados.length>0) || (tiporeplica == 2 && arrTiposPagosReplicar.length>0)){
                var datos = vista.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelections();
                idconceptopercepciondescuento = new Array();
                Ext.each(datos, function (rec) {
                    idconceptopercepciondescuento.push({
                        id: rec.get('idconfconceptosportiposysistemaspago'),
                        idconceptopercepciondescuento: rec.get('idconceptopercepciondescuento'),

                    });
                });
                //
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Replicando datos'
                });
                winload.showMask();
                Ext.Ajax.request({
                    url: 'replicardatos',
                    method: 'POST',
                    params: {
                        tiporeplica: tiporeplica,
                        conceptos: (datos.length > 0 ? Ext.encode(idconceptopercepciondescuento) : null),
                        identidad: Ext.encode(arrEntidades),
                        identidadreplica: identidad,
                        arrtipospagoreplicar: Ext.encode(arrTiposPagosReplicar),
                        idsistemapago: vista.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelected().data.idsistemapago,
                        sedesglosa: vista.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelected().data.sedesglosa,
                        id: id
                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'El concepto de percepci&oacute;n y descuento se adicion&oacute; satisfactoriamente.');
                        }
                        vista.winEstructurareplicar.hide();
                        vista.ventanaTipoReplica.hide();
                        vista.winTiposPagosreplicar.hide();

                    }.createDelegate(this)
                });
            }else{
                mostrarMensaje(3, 'Por favor seleccione las entidades o los tipos de pago a los que desea replicar la configuraci&oacute;n.');
            }
            replicageneral = 0;
        }

        function replicarDatosTodosTipoPagoEntidades(identidad){
            var arrEntidades = new Array();
            var arrTiposPagosReplicar = new Array();
            //Si la replica es hacia otras entidades
            var s = vista.pobjestructurareplicar.getSeleccionados();
            if(s.length <= 0){
                mostrarMensaje(3, 'Debe seleccionar una entidad.');
                return;
            }

            for(var i = 0; i < s.length; i++){
                if(s[i].id != this.identidad){
                    arrEntidades.push(s[i].id);
                }
            }

                //tipos de pagos seleccionados
            if(vista.gpConceptosPercepcionesDescuentosReplicar.getSelectionModel().hasSelection()){
                var datostipospago = vista.gpConceptosPercepcionesDescuentosReplicar.getSelectionModel().getSelections();
                Ext.each(datostipospago, function (rec) {
                    arrTiposPagosReplicar.push(rec.get('idtipopago'));
                });
            }



            if((self.nodosseleccionados.length>0) && (arrTiposPagosReplicar.length>0)){
                var datos = vista.gpConceptosPercepcionesDescuentosReplicar.getSelectionModel().getSelections();
                idconceptopercepciondescuento = new Array();
                Ext.each(datos, function (rec) {
                    idconceptopercepciondescuento.push({
                        id: rec.get('idconfconceptosportiposysistemaspago'),
                        idconceptopercepciondescuento: rec.get('idconceptopercepciondescuento'),

                    });
                });console.info(arrEntidades);
                //
                var winload = new Ext.PVD.comun.window.winLoad({
                    title: 'Por favor espere...',
                    mensaje: 'Replicando datos'
                });
                winload.showMask();
                Ext.Ajax.request({
                    url: 'replicardatos',
                    method: 'POST',
                    params: {
                        tiporeplica: tiporeplica,
                        conceptos: (datos.length > 0 ? Ext.encode(idconceptopercepciondescuento) : null),
                        identidad: Ext.encode(arrEntidades),
                        identidadreplica: identidad,
                        arrtipospagoreplicar: Ext.encode(arrTiposPagosReplicar),
                        id: id
                    },
                    callback: function (options, success, response) {
                        winload.hideMask();
                        var respuesta = Ext.decode(response.responseText);

                        if (respuesta.codigo == 'ADD-1') {
                            mostrarMensaje(1, 'Los conceptos de percepci&oacute;n y descuento se adicionaron; satisfactoriamente.');
                        }
                        vista.winEstructurareplicar.hide();
                        vista.winConceptosPercepcionDescuentosReplicar.hide();
                    }.createDelegate(this)
                });
            }else{
                mostrarMensaje(3, 'Por favor seleccione las entidades o los tipos de pago a los que desea replicar la configuraci&oacute;n.');
            }
            replicageneral = 0;
        }
		
		this.DatosConceptosPD = function(accion){
			if(accion == 'ADD'){
				var arrConceptos = new Array();
				var a = vista.objConceptosPercepcionesDescuentos.GetSeleccionados();
				for(var i = 0; i < a.length; i++){
					arrConceptos[i] = a[i].data.idconceptopercepciondescuento;
				}
				return {
						identidad: this.identidad,
						idtipopago: this.tipopagoseleccionado.data.idtipopago,
						sedesglosa: this.tipopagoseleccionado.data.sedesglosa,
						idsistemapago: this.idsistemapago,
						conceptos: Ext.encode(arrConceptos)
					};
			
			}else if(accion == 'DEL'){
				return {
						idconfconceptosportiposysistemaspago: vista.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelected().data.idconfconceptosportiposysistemaspago,
						idtipopago: this.tipopagoseleccionado.data.idtipopago,
                                                identidad: Ext.encode(this.nodosseleccionadosaeliminar)
					};
			}
		}.createDelegate(this);
		
		this.ADDDELConceptosPD = function(accion, boton, datos){
			var url = '';
			var idconfconceptosportiposysistemaspago = new Array();
			var arrDatos = vista.gpConceptosPercepcionesDescuentos.getSelectionModel().getSelections(); 
			if(accion == 'ADD'){
				url = 'adicionarconceptospdportipospago';
			}else if(accion == 'DEL'){
				url = 'eliminarconceptospdportipospago';
			}
			
			if(accion == 'ADD'){
				PVD.mostrarMascara('madicionarconceptospdportipospago','Por favor espere...','Adicionando datos del concepto de percepci&oacute;n y descuento');
			}else if(accion == 'DEL'){
				PVD.mostrarMascara('meliminarconceptospdportipospago','Por favor espere...','Eliminando datos del concepto de percepci&oacute;n y descuento');
			}
			
			for (var i = 0; i < arrDatos.length; i++){
		       idconfconceptosportiposysistemaspago.push(arrDatos[i]['data']['idconfconceptosportiposysistemaspago']);
            }
			
			Ext.Ajax.request({
				url: url,
				method:'POST',
				params: {
					 idconfconceptosportiposysistemaspago: (arrDatos.length>0 ? Ext.encode(idconfconceptosportiposysistemaspago) : null),
					 identidad: (datos.identidad ? datos.identidad : null),
					 idtipopago: (datos.idtipopago ? datos.idtipopago : null),
					 idsistemapago: (datos.idsistemapago ? datos.idsistemapago : null),
					 sedesglosa: (datos.sedesglosa ? datos.sedesglosa : null),
					 conceptos: (datos.conceptos ? datos.conceptos : null)
				},
				callback: function (options,success,response){
				    if(accion == 'ADD'){
			  	      PVD.ocultarMascara('madicionarconceptospdportipospago');
			        }else if(accion == 'DEL'){
				      PVD.ocultarMascara('meliminarconceptospdportipospago');
			        }
					var respuesta = Ext.decode(response.responseText);
					if(respuesta.codigo == 'ADD-1'){
						mostrarMensaje(1, 'El concepto de percepci&oacute;n y descuento se adicion&oacute; satisfactoriamente.');
						
					}else if(respuesta.codigo == 'Err-1'){
						mostrarMensaje(1, 'El concepto de percepci&oacute;n y descuento se adicion&oacute; satisfactoriamente.');
						mostrarMensaje(3, 'No se pudieron adicionar conceptos de percepci&oacute;n y descuento ya que existen.');
						
					}else if(respuesta.codigo == 'ERR-NO-EST'){
                        mostrarMensaje(3, 'Por favor seleccione una estructura para poder eliminar.');

                    }else if(respuesta.codigo == 'DEL-1'){
						mostrarMensaje(1, 'El concepto de percepci&oacute;n y descuento se elimin&oacute; satisfactoriamente.');
					}

					if(boton == 'ACEPTAR' && accion != 'DEL'){
					   vista.winConceptosPercepcionDescuentos.hide();
					}
					if(boton == 'APLICAR' && accion != 'DEL'){
					   vista.objConceptosPercepcionesDescuentos.Desmarcar();
					}
					
					if(accion == 'DEL'){
						vista.btnEliminarConcepto.disable();
						vista.winEstructuraEliminar.hide();
					}
					this.limpiarConfiguracion();
					this.idconceptopercepciondescuento = null;
					vista.btnGuardar.disable();
					modelo.CargarConceptosPD(this.identidad, this.tipopagoseleccionado, this.idsistemapago);
				}.createDelegate(this)
			});
		}.createDelegate(this);
		
		this.DatosVariablesAuxiliares = function(){
			if(this.accion == 'ADD'){
				var selReporteVariable = vista.pTiposReportesCertificaciones.getSeleccion();
				if(vista.cbFormaEntrada.getValue() == 2 && !selReporteVariable){
					mostrarMensaje(1, 'Debe seleccionar una variable de reporte.');
					return false;
				}
				if(vista.cbFormaEntrada.getValue() == 2){
					return {
						 idvariableauxconceptospdformasysistemaspago: null,
						 idconfconceptospdformasysistemaspago: this.idconfconceptospdformasysistemaspago,
						 denominacion: vista.tfDenominacion.getValue(),
						 formaentrada: vista.cbFormaEntrada.getValue(),
						 idconfreportescertificaciones: selReporteVariable.data.idconfreportescertificaciones,
						 idvariablesconfreportescertificaciones: selReporteVariable.data.idvariablesconfreportescertificaciones,
					};
				}else{
					return {
						 idvariableauxconceptospdformasysistemaspago: null,
						 idconfconceptospdformasysistemaspago: this.idconfconceptospdformasysistemaspago,
						 denominacion: vista.tfDenominacion.getValue(),
						 formaentrada: vista.cbFormaEntrada.getValue(),
						 idconfreportescertificaciones: null,
						 idvariablesconfreportescertificaciones: null,
					};
				}
			}else if(this.accion == 'DEL'){
				if(vista.gpVariablesAuxiliares.getSelectionModel().hasSelection()){
					return {
						 idvariableauxconceptospdformasysistemaspago: vista.gpVariablesAuxiliares.getSelectionModel().getSelected().data.idvariableauxconceptospdformasysistemaspago
					};
				}else {
					mostrarMensaje(1,'Debe seleccionar una variable auxiliar.');
					return false;
				}
			}	
		}.createDelegate(this);
		
		this.cargarVariablesAuxiliares = function(){
			modelo.stVariablesAuxiliares.removeAll();
			modelo.stVariablesAuxiliares.baseParams.idconfconceptospdformasysistemaspago = this.idconfconceptospdformasysistemaspago;
			modelo.stVariablesAuxiliares.load();
		}.createDelegate(this);
		
		this.limpiarConfiguracion = function(){
		   	//vista.pFormulaVariablesAuxiliares.disable();
			vista.btnAdicionar.disable();
			vista.btnEliminar.disable();
			vista.taFormula.setValue("");
			vista.taFormula.disable();
			
			vista.fpFormaCalculo.disable();
			this.limpiarFormularioVariablesAuxiliares();
			vista.btnGuardar.setText('Nuevo');
		}
		
		this.limpiarFormularioVariablesAuxiliares = function(){
			vista.fpVariablesAuxiliares.getForm().reset();
			//vista.taFormula.reset();
			vista.cbFormaEntrada.reset();
			vista.cbFormaEntrada.setValue(1);
			//modelo.stVariablesAuxiliares.removeAll();
			vista.pTiposReportesCertificaciones.disable();
			vista.pTiposReportesCertificaciones.limpiarSeleccion();
		}.createDelegate(this);
		
		this.ADDDELVariablesAuxiliares = function(accion, boton, datos){
			var url = '';
			if(accion == 'ADD'){
				url = 'adicionarvariablesauxiliares';
			}else if(accion == 'DEL'){
				url = 'eliminarvariablesauxiliares';
			}
			
			if(accion == 'ADD'){
				PVD.mostrarMascara('madicionarvariablesauxiliares','Por favor espere...','Adicionando datos de la variable global');
			}else if(accion == 'DEL'){
				PVD.mostrarMascara('meliminarvariablesauxiliares','Por favor espere...','Eliminando datos de la variable global');
			}
			
			if(vista.fpVariablesAuxiliares.getForm().isValid() || accion == 'DEL'){
				Ext.Ajax.request({
                    url: url,
                    method:'POST',
                    params: {
						 idvariableauxconceptospdformasysistemaspago: (datos.idvariableauxconceptospdformasysistemaspago ? datos.idvariableauxconceptospdformasysistemaspago : null),
						 idconfconceptospdformasysistemaspago: datos.idconfconceptospdformasysistemaspago,
						 denominacion: datos.denominacion,
						 formaentrada: datos.formaentrada,
						 idconfreportescertificaciones: (datos.idconfreportescertificaciones ? datos.idconfreportescertificaciones : null),
						 idvariablesconfreportescertificaciones: (datos.idvariablesconfreportescertificaciones ? datos.idvariablesconfreportescertificaciones : null),
						 lugaresdecimalesvariable: (vista.nfCantidadLugaresDecimalesVariable.getValue() ? vista.nfCantidadLugaresDecimalesVariable.getValue() : null)
                    },
                    callback: function (options,success,response){
					    if(accion == 'ADD'){
				          PVD.ocultarMascara('madicionarvariablesauxiliares');
			            }else if(accion == 'DEL'){
			              PVD.ocultarMascara('meliminarvariablesauxiliares');
			            }
                        var respuesta = Ext.decode(response.responseText);
                        if(respuesta.codigo == 'EXISTE'){
							mostrarMensaje(1, 'La variable auxiliar ya existe.');
							return;
						}
                        if(respuesta.codigo == 'ADD-1'){
                            mostrarMensaje(1, 'La variable auxiliar se adicion&oacute; satisfactoriamente.');
                            
                        }else if(respuesta.codigo == 'DEL-1'){
                            mostrarMensaje(1, 'La variable auxiliar se elimin&oacute; satisfactoriamente.');
                        } 
                        
                        if(boton == 'APLICAR' && accion == 'ADD'){
                            this.limpiarFormularioVariablesAuxiliares();
                        }else if(boton == 'ACEPTAR'&& accion != 'DEL'){
                            vista.winVariablesAuxiliares.hide();
                        }
                        
                        if(accion == 'DEL'){
                            vista.btnEliminar.disable();
                        }
                        
                        this.cargarVariablesAuxiliares();
                    }.createDelegate(this)
                });
			}
		};
		
		this.MostrarConfiguracionConceptoSistemaPago = function(objConf){
			//vista.pConfFormasySistemasPago.enable();
			this.idexpresionmatematica = null;
			this.idconfconceptospdformasysistemaspago = null;
			this.tarifasconcepto = null;
			modelo.stVariablesAuxiliares.removeAll();
			vista.taFormula.setValue('');
			vista.btnGuardar.setText('Guardar');
			vista.fpFormaCalculo.disable();
			//vista.pFormulaVariablesAuxiliares.disable();
			vista.taFormula.disable();
			vista.btnAdicionar.disable();
			vista.btnEliminar.disable();this.tarifasconcepto = objConf.tarifasconcepto;
					
			if(objConf.resultado == 1){
				    this.idconfconceptospdformasysistemaspago = objConf.idconfconceptospdformasysistemaspago;
					this.idexpresionmatematica = (objConf.idexpresionmatematica && objConf.idexpresionmatematica != '' ? objConf.idexpresionmatematica : null);
					vista.fpFormaCalculo.enable();
					
					/*if(objConf.formacalculo == 1){
						vista.rbManual.setValue(true);
						vista.rbFormula.setValue(false);
					}else{*/
						vista.rbFormula.setValue(true);
						//vista.rbManual.setValue(false);
						vista.taFormula.setValue(objConf.expresionamostrar);
						this.accion = 'ADD';
						this.cargarVariablesAuxiliares();
						//vista.pFormulaVariablesAuxiliares.enable(); 
						vista.taFormula.enable();
						vista.btnAdicionar.enable();
						//}
			vista.nfCantidadLugaresDecimales.setValue(objConf.lugaresdecimales);
			}else{
				//vista.rbManual.setValue(true);
				vista.rbFormula.setValue(false);
				vista.btnGuardar.setText('Nuevo');
			}
		};
		
		this.CargarConfiguracionConceptoSistemaPago = function(){
			Ext.Ajax.request({
                    url: 'obtenerconfiguracionesformaysistemapago',
                    method:'POST',
                    params: {
                        idconfconceptosportiposysistemaspago: this.idconfconceptosportiposysistemaspago,
                        idconceptopercepciondescuento: this.idconceptopercepciondescuento,
                        idperiodopago: this.idperiodopago
                    },
                    callback: function (options,success,response){
						var respuesta = Ext.decode(response.responseText);
						this.MostrarConfiguracionConceptoSistemaPago(respuesta);
					}.createDelegate(this)
			});		
		}
		
		vista.objConceptosPercepcionesDescuentos.on('conceptoseleccionado', function(fila){
			this.idconceptopercepciondescuento = fila.data.idconceptopercepciondescuento;
		}.createDelegate(this));
		
		this.CargarLimpiarManualFormula = function(forma){
			if(forma == 1){//Manual
				//vista.pFormulaVariablesAuxiliares.disable();
				vista.taFormula.disable();
				vista.btnAdicionar.disable();
			    vista.btnEliminar.disable();
			}else{//Formula
				//vista.pFormulaVariablesAuxiliares.enable();
				vista.taFormula.enable();
				vista.btnAdicionar.enable();
			   
			}
		}.createDelegate(this);
		
		vista.rbFormula.on('check', function( rb, checked ) {
			if(checked)
				this.CargarLimpiarManualFormula(2);
		}.createDelegate(this));
		
		vista.cbFormaEntrada.on('select', function(combo, record, index){
			if(record.data.valor == 1){
				vista.pTiposReportesCertificaciones.disable();
			}else {
				vista.pTiposReportesCertificaciones.enable();
			}
		}.createDelegate(this));
		
		vista.gpVariablesAuxiliares.getSelectionModel().on('rowselect', function(sm, index, r){
			vista.btnEliminar.enable();
		}.createDelegate(this));
		
		vista.btnAdicionar.setHandler(function(){
			if(this.idconfconceptospdformasysistemaspago){
				vista.winVariablesAuxiliares.show();
				vista.pTiposReportesCertificaciones.Cargar();
				vista.cbFormaEntrada.setValue(1);
				vista.pTiposReportesCertificaciones.disable();
				this.limpiarFormularioVariablesAuxiliares();
			}else{
					mostrarMensaje(1, 'Debe guardar la configuraci&oacute;n.');
					return;
				}
			
		}.createDelegate(this));
		
		vista.btnEliminar.setHandler(function(){
			this.accion = 'DEL';
			mostrarMensaje(2, '¿Est&aacute; seguro que desea eliminar la variable auxiliar seleccionada?', function(btn){
				if(btn == "ok"){
					var datos = this.DatosVariablesAuxiliares();
					if(datos){
						this.ADDDELVariablesAuxiliares(this.accion, 'ACEPTAR', datos);
					}
				}
			}.createDelegate(this));
			
		}.createDelegate(this));
		
		vista.btnAceptar.setHandler(function(){
			this.accion = 'ADD';
			var datos = this.DatosVariablesAuxiliares();
			if(datos){
				this.ADDDELVariablesAuxiliares(this.accion, 'ACEPTAR', datos);
			}
		}.createDelegate(this));
		
		vista.btnAplicar.setHandler(function(){
			this.accion = 'ADD';
			var datos = this.DatosVariablesAuxiliares();
			if(datos){
				this.ADDDELVariablesAuxiliares(this.accion, 'APLICAR', datos);
			}
		}.createDelegate(this));
		
		vista.btnCancelar.setHandler(function(){
			vista.winVariablesAuxiliares.hide();
			this.limpiarFormularioVariablesAuxiliares();
		}.createDelegate(this));
		
		vista.btnGuardar.setHandler(function(){
			if(this.tipopagoseleccionado.data.sedesglosa == 1 && this.idperiodopago == null){
				mostrarMensaje(1, 'Debe seleccionar un per&iacute;odo de pago.');
				return;
			}
			Ext.Ajax.request({
                    url: 'guardarconfconceptospdformassistemaspago',
                    method:'POST',
                    params: {
						 idconfconceptospdformasysistemaspago: this.idconfconceptospdformasysistemaspago,
						 idperiodopago: this.idperiodopago,
						 idconfconceptosportiposysistemaspago: this.idconfconceptosportiposysistemaspago,
						 formacalculo: 2,
						 idexpresionmatematica: this.idexpresionmatematica,
		                                lugaresdecimales: (vista.nfCantidadLugaresDecimales.getValue() ? vista.nfCantidadLugaresDecimales.getValue() : null)
						 
                    },                            
                    callback: function (options,success,response){
                        var respuesta = Ext.decode(response.responseText);
                        if(respuesta.codigo == 'GUAR-1'){
                            mostrarMensaje(1, 'La configuraci&oacute;n se guard&oacute; satisfactoriamente.');
                        }
                        this.idconfconceptospdformasysistemaspago = respuesta.idconfconceptospdformasysistemaspago;
						vista.btnGuardar.setText('Guardar'); 
                        vista.fpFormaCalculo.enable();
                    
                    }.createDelegate(this)
                });
		}.createDelegate(this));

        this.MostrarFormula = function (arrIndTarifas) {
            //Cargo las variables globales y conceptos de la retribucion monetaria
            var ind = modelo.ConvertiraArreglo(modelo.datosModelo.indicadores);
            //Cargo las tarifas que tiene el concepto seleccionado
            var nombreconceptoytipo = 'Tarifas de ' + this.conceptopercepciondescuento.data.denominacion;
            if (arrIndTarifas) {
                for (var i = 0; i < arrIndTarifas.length; i++) {
                    var a = new Array();
                    a[0] = 'CPDT_' + arrIndTarifas[i].idconceptopdtarifa;
                    a[1] = 'Tarifa ' + arrIndTarifas[i].denomtarifa + '_' + arrIndTarifas[i].denomformacalculo;
                    a[2] = nombreconceptoytipo;
                    ind.push(a);
                }
            }
            //Cargo las variables auxiliares
            if (modelo.stVariablesAuxiliares.getCount() > 0) {
                var arr = modelo.stVariablesAuxiliares.getRange(0, 1000);
                for (var i = 0; i < arr.length; i++) {
                    var a = new Array();
                    a[0] = 'VASP_' + arr[i].data.idvariableauxconceptospdformasysistemaspago;
                    a[1] = arr[i].data.denominacion;
                    a[2] = 'Variables auxiliares';
                    ind.push(a);
                }
            }
            var a = new Array();
            a[0] = 'SPC_0';
            a[1] = 'Salario escala';
            a[2] = 'Salario escala';
            ind.push(a);

            this.objExpMat = new Ext.pvd.persona.formula.winEditorExpresiones({
                title: 'Editor de expresiones matem&aacute;ticas',
                idexpresionmatematica: (this.idexpresionmatematica ? this.idexpresionmatematica : -1),
                indicadores: ind,
                agrupado: 1,
                campoagrupar: 'Tipo',
                mostrarFunciones: 2,
                mostrarCondicionales: 1,
                operadoresMostrar: [],
                mostrarDenominacion: false
            });
            this.objExpMat.on('expresionsalvada', function (arr) {
                this.idexpresionmatematica = arr.idexpresionmatematica;
                vista.taFormula.setValue(arr.elementosMostrar);
                this.objExpMat.close();
            }.createDelegate(this));

            this.objExpMat.show();
        }.createDelegate(this);
		
		vista.taFormula.on('focus', function(){
			if(this.idconfconceptospdformasysistemaspago) {
                this.MostrarFormula(this.tarifasconcepto);

            }else{
					mostrarMensaje(1, 'Debe guardar la configuraci&oacute;n.');
					return;
				}	
		}.createDelegate(this));

        /*********************************Eliminar multiple*******************************/
        vista.pobjestrucEliminar.on('uncheckednode', function (sm, nodo) {
            var index = this.nodosseleccionadosaeliminar.indexOf(nodo.attributes.id);
            if (index > -1) {
                this.nodosseleccionadosaeliminar.splice(index, 1);
                estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
                //console.info(this.nodosseleccionadosaeliminar);
            }
        }.createDelegate(this));


        vista.pobjestrucEliminar.on('checkednode', function (sm, nodo) {
//console.info(nodo.id);
            if (nodo.attributes.id != 'idraiz') {
                this.nodosseleccionadosaeliminar.push(nodo.attributes.id);
            }else{
                this.nodosseleccionadosaeliminar.push(nodo.id);
            }
            estanNodosSeleccionados(this.nodosseleccionadosaeliminar);
            //console.info(this.nodosseleccionadosaeliminar);
        }.createDelegate(this));

        vista.pobjestrucEliminar.on('estructuraselecionada', function (sm, nodo) {
            //console.log(nodo.attributes.tipoestructura);
            if (nodo.attributes.tipoestructura == 3) {
                vista.btnAceptarEliminar.enable();
            }else{
                this.nodosseleccionadosaeliminar.push(nodo.id);
            }
        }.createDelegate(this));

        vista.btnAceptarEliminar.setHandler(function () {
            // DELConfiguracionConceptosGenerales(this);
            this.ADDDELConceptosPD('DEL', 'ACEPTAR', this.DatosConceptosPD('DEL'));
        }.createDelegate(this));

        //eliminar multiple
        function ejecutarEliminar(_this) {
            if (_this.nodosseleccionadosaeliminar.length > 0) {
                //Se muestra la máscara de espera.
                PVD.mostrarMascara('idmaskeleminartipopago', idioma.lbMsgEsperaEnviarDatos, idioma.lbMsgEliminar);
                //Enviando los datos al servidor.
                Ext.Ajax.request({
                    url: '/pvd/nomina/index.php/estructurarmodelosnomina/eliminarEstructurasNomina',
                    method: 'POST',
                    params: {
                        idestructuramodelodomina: Ext.encode(arrayConceptos),
                        idestructura: Ext.encode(_this.nodosseleccionadosaeliminar)
                    },
                    callback: function (options, success, response) {
                        //Se oculta la máscara de espera.
                        PVD.ocultarMascara('idmaskeleminartipopago');
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg) {
                            //Mostrando el mensaje de que se ha el tipo de nómina.
                            mostrarMensaje(1, idioma.lbMsgCorrectoEliminado, function () {

                            });
                            //Recargando el grid de tipos de nómina.
                            vista.gpEstructurarNomina.getStore().removeAll();
                            vista.gpEstructurarNomina.getStore().load({
                                params: {
                                    idtiponomina: vista.idtiponomina,
                                    idestructura: vista.idestructura
                                }
                            });
                        }
                    }
                });
            }
        }

        function estanNodosSeleccionados(nodos) {
            if (nodos.length > 0) {
                vista.btnAceptarEliminar.enable();
            } else {
                vista.btnAceptarEliminar.disable();
            }
        }

        /*********************************Eliminar multiple*******************************/

    }
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('confformasysistemaspago', function(perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    
    /*Configuracion inicial*/
    //Hago la peticion para cargar los datos iniciales
        PVD.mostrarMascara('idmaskcargardatosconceptosgenerales', 'Por favor espere...', 'Cargando datos de las configuraciones de las formas y los sistemas de pagos');
        Ext.Ajax.request({
            url: 'obtenerconfiguracioninicial',
            method:'POST',
            callback: function (options,success,response){
                PVD.ocultarMascara('idmaskcargardatosconceptosgenerales');
                //Inicializando el modelo
                var modelo = Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Modelo;
				modelo.init(idioma);
                                
                modelo.datosModelo = Ext.decode(response.responseText); 
                
                //Inicializando la vista.
                var vista = Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Vista;
				vista.init(perfil, idioma, modelo);
            
                //Inicializar controlador.
                Pvd.Nomina.Configuraciones.ConfFormasySistemasPago.Controlador.init(idioma, vista, modelo);
                UCID.portal.cargarAcciones(window.parent.idFuncionalidad);
            }.createDelegate(this)
        });
});

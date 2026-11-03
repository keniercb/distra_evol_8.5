Ext.ns('Ext.component.persona');

Ext.component.persona.Vista={
	
	init: function(perfil,idioma, modelo) {
		
		//Adicionar
        this.btnAdicionar = new Ext.Button({         
            tooltip: 'Adicionar campo <b>(Alt+I)</b>',
            text: 'Ad<u>i</u>cionar',
            iconCls: 'adicionar',
			disabled: true,
			handler: function() {
				this.fireEvent('adicionar');
			}
            });
    
    //Eliminar
         this.btnEliminar = new Ext.Button({
            id:'btnEliminar',            
            text: 'Eliminar',
            tooltip: 'Eliminar campo <b>(DEL)</b>',
            iconCls: 'eliminar',
            disabled: true,
	    handler: function() {
	        this.fireEvent('eliminar');
	    }
          });
    
    //Modificar
        this.btnModificar = new Ext.Button({
            id: 'btnModificar',            
            text: 'Modificar',
            tooltip: 'Modificar campo <b>(Alt+M)</b>',
            iconCls: 'modificar',
            disabled: true,
	    handler: function() {
	        this.fireEvent('modificar');
	    }
           });

        this.btnAyuda = new Ext.Button({
            id:'hlp',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
            iconCls: 'ayuda',
	    handler: function() {
	    }
          });
	
	this.expander = new Ext.grid.RowExpander({
        	tpl : new Ext.Template(
           	 '<div><b>Descripcion: </b> {descripcion}</div>'
        	)
    });
	this.pbCampo = new Ext.PagingToolbar({
	      store: modelo.storeGrid,
	      displayInfo: true,
	      displayMsg: 'Resultados {0} - {1} de {2} ',
	      emptyMsg: 'No hay datos para mostrar',
	      pageSize: 15
	 });
	 this.selectionModel = new Ext.grid.RowSelectionModel({
            singleSelect: true
 	    
        }); 
	this.teclas==[{
                key: 'i',
                alt: true,
                fn: function() {
                    this.btnAdicionar.handler();
                }
                }, {
                key: 'm',
                alt: true,
                fn: function() {
                    if (!this.btnModificar.disabled) {
                        this.btnModificar.handler();
                    }
                }
               }, {
                key: 46,
                fn: function() {
                    if (!this.btnModificar.disabled) {
                        this.btnModificar.handler();
                    }
                }
                }, {
                key: 'h',
                alt: true,
                fn: function() {
                    this.btnAyuda.handler();
                }
            }
        ];
	
	// component buscar
	this.tfBuscar = new Ext.app.SearchField({
            store: modelo.storeGrid,
            emptyText: 'Criterio a buscar...'
        });
	
	
       //Grid panel de campo
        this.gpCampo = new Ext.grid.GridPanel({
            title: 'Listado de campos',
            region:'center',
	    width:'50%',
	    margins:'5 5 5 0',
	    gestionar:true,
	    keys:this.teclas,
            autoExpandColumn: 'expandDenom',
            store: modelo.storeGrid,
	    sm:this.selectionModel,
	    plugins:this.expander,           
	    loadMask: true,	    
            columns: [
            this.expander,
            {
                id: 'expandDenom',
                header: 'Denominación',
                menuDisabled: true,
                dataIndex: 'denominacion',
                sortable: true,
                width: 230
            },
            {
                header: 'Tipo de campo',
                type: 'date',
		menuDisabled:true, 
		dataIndex: 'denom',
                sortable: true
            }   
            ],
            bbar: this.pbCampo,
	    tbar: [this.btnAdicionar, this.btnModificar,this.btnEliminar,this.tfBuscar,'->',this.btnAyuda]
        });
                
          //  Elelmentos del Formulario
	this.tfDenominacion = new Ext.form.TextField({
            fieldLabel: 'Denominaci&oacute;n',
            name: 'denominacion',
            allowBlank: false,
            anchor: '100%'
        });
	
	this.GrupoCombo=new Ext.form.ComboBox({
		fieldLabel:'Tipo de dato ',
		name: 'tipodato',
		emptyText:'Seleccione...',
		anchor:'99%',	
		allowBlank:false,
		blankText:'Este campo es obligatorio',	
		store:modelo.stTipoDato,
		displayField:'denominacion',
		valueField:'idtipodedato',
		triggerAction:'all',
		forceSelection:true,
		editable:false,
		mode:'local'
	});
		
       this.taDescripcion = new Ext.form.TextArea({
            name: 'descripcion',
            fieldLabel: 'Descripci&oacute;n',
            anchor: '100%',
            height: 90
        });
   
	   
        //Formulario
	this.form = new Ext.form.FormPanel({
            width: 300,
            frame: true,
            bodyStyle: 'padding: 5px 5px 0',
            border: false,
            labelAlign: 'top',
            items: [this.tfDenominacion,this.GrupoCombo, this.taDescripcion]
        });
        //Botones para la ventana adicionar
      this.btnAceptar = new Ext.Button({
            text: 'Aceptar',            
            iconCls: 'aceptar',
	    tooltip: 'Guardar datos y cerrar ventana <b>(ENTER)</b>',
	    handler: function() {
	        this.fireEvent('aceptar');
	    }
        });
        this.btnAplicar = new Ext.Button({
            text: 'Aplicar',           
            iconCls: 'aplicar',
	    tooltip:'Guardar datos y limpiar los campos <b>(Ctrl+Alt+P)</b>',
	    handler: function() {
	        this.fireEvent('aplicar');
	    }
        });
        this.btnCancelar = new Ext.Button({
            text:'Cancelar',            
            iconCls: 'cancelar',
	    tooltip:'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
	    handler: function() {
	        this.fireEvent('cancelar');
	    }
        });
	// teclas caliente de la ventana
	this.teclasWin==[
		{
			key:Ext.EventObject.ENTER,
			fn:function(){this.btnAceptar.handler();}
		},{
			key:'p',
			alt:true,
			ctrl:true,
			fn:function(){this.btnAplicar.handler();}
		},{
			key:'x',
			alt:true,
			fn:function(){this.btnCancelar.handler();}
		}
	];
          
      //Ventana
	this.WinCampos = new Ext.Window({
            modal: true, 
	    keys:this.teclasWin,
            items: [this.form],
            buttons: [this.btnCancelar,this.btnAplicar,this.btnAceptar
            ]
	});
	
	// Instancia del componente concepto
	this.cmpConcepto= new Ext.component.persona.gpConcepto({
	  region:'west',
	  width:'47%',
	  gestionar:'true',
	  margins:'5 0 5 5'
	});
	this.cmpConcepto.on('render',function(){
	    this.cmpConcepto.btnAdicionar.focus();
	},this);
	
	//Vista general .
       var viewport=new Ext.Viewport({
            layout: 'border',
            items: [this.gpCampo,this.cmpConcepto]
	  });	
	}
};
var perfil = window.parent.parent.UCID.portal.perfil;
Ext.QuickTips.init();
labels = Object();
//Inicializando la vista.
UCID.portal.cargarEtiquetas('configurarconcepto', function(perfil, idioma){
	
    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;
    
    //Inicializando el modelo
    var modelo = Ext.component.persona.Modelo;
    modelo.init(perfil);
    
    //Inicializando la vista.
    var vista = Ext.component.persona.Vista;
    vista.init(perfil,idioma, modelo);
    
    //Inicializar controlador.
    var controller = Ext.component.persona.Controlador;
    controller.init(perfil,idioma, vista, modelo);
});
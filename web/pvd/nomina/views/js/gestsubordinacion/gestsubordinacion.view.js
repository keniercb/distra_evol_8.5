Ext.ns('Pvd.Nomina.Configuracion.GestSubordinacion');

Ext.QuickTips.init();

//Vista del componente Gestionar subordinacion.
Pvd.Nomina.Configuracion.GestSubordinacion.Vista = {
    /**
     * Inicializar la vista.
     * 
     * @param perfil Objeto que contiene el perfil de la IU (Tipo: Object).
     * @param idioma Objeto que contiene el idioma de los textos de la IU (Tipo: Object).
     * @param modelo Modelo de la vista del componente Gestionar subordinacion (Tipo: Pvd.Nomina.Configuracion.GestSubordinacion.Modelo).
     */
    init: function(perfil, idioma, modelo) {

        //Botones de Asoc, Elim subordinacion.
        this.btnAsociarCargos = new Ext.Button({
            id: 'btnAsociarCargos',
            text: idioma.lbbtnAsociarCargos,
            tooltip: idioma.textToolTipbtnAsociarCargos,
            iconCls: 'usuarioactivo',
            prevTab: '',
            nextTab: '',
			disabled: true
        });
		
		this.btnDesasociarCargos = new Ext.Button({
            id: 'btnDesasociarCargos',
            text: idioma.lbbtnbtnDesasociarCargos,
            tooltip: idioma.textToolTipbtnbtnDesasociarCargos,
            iconCls: 'eliminar',
            prevTab: '',
            nextTab: '',
			disabled: true
        });
		
		//Panel de estructura y composición que carga hasta el nivel de entidades.
         this.panelEstEnt = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
            layout: 'border',
            region: 'west',
            width: '30%', 
            heigth: '100%', 
            nivel: 7,
            nivelachequear: 8
        });
		
		//Elementos del grid de los cargos
		this.expanderCargos = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        this.smCargos = new Ext.grid.CheckboxSelectionModel();

        this.gpCargos = new Ext.grid.GridPanel({
            id:'idgpCargos',
            title:idioma.lbTitleCargos,
            region:'center',
            columns: [this.smCargos,
			         {header: 'idsubordinacion',    hidden: true, hideable: false, dataIndex: 'idsubordinacion'} 
                    ,this.expanderCargos
                    ,{header: 'Cargo', width: 100, sortable: true, dataIndex: 'denomcargo'}
                    ,{header: 'descripcion', hidden:true, width: 100, sortable: true, dataIndex: 'descripcion'}
                    
            ],
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '50%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            store: modelo.storeCargos,
            sm: this.smCargos,
            plugins:this.expanderCargos,
            loadMask:{msg : idioma.lbMaskGridCargando},
        });
		
		//Elementos del grid de las personas subordinadas
		this.expanderPersona = new  Ext.grid.RowExpander({
            tpl : new Ext.Template(
                '<div style="word-wrap:break-word;white-space:normal;"><p>&nbsp;&nbsp;Descripci&oacute;n:&nbsp;{descripcion}</p><br/></div>'
            ),enableCaching: false
        });

        this.smPersona = new Ext.grid.RowSelectionModel({
            singleSelect:true,
        });

        this.gpPersona = new Ext.grid.GridPanel({
            id:'gpPersona',
			//layout: 'fit',
            title:idioma.lbTitlePersonas,
            region:'center',
            columns: [{header: 'idpersona',    hidden: true, hideable: false, dataIndex: 'idpersona'} 
                    ,this.expanderPersona
                    ,{header: 'Nombre y Apellidos', width: 100, sortable: true, dataIndex: 'nombreapp'}
                    ,{header: 'descripcion', hidden:true, width: 100, sortable: true, dataIndex: 'descripcion'}
                    
            ],
            stripeRows: true,
            autoScroll:true,
            border: true,
            width: '50%', 
            heigth: '100%', 
            viewConfig: {forceFit: true},
            store: modelo.storePersonas,
            sm: this.smPersona,
            plugins:this.expanderPersona,
            loadMask:{msg : idioma.lbMaskGridCargando},
        });

        //Tree de vista previa.    
        this.smArbolPlantilla = new Ext.tree.DefaultSelectionModel({
        });
        
        this.ArbolPlantilla = new Ext.tree.TreePanel({
            title:idioma.lbTitleArbolGestSubordinacion,
            region:'east',
            height: '100%', 
            width: '100%', 
            split:false,
            border:true,
            rootVisible:false,
            autoScroll:true,
            layout: 'fit',
            loader: modelo.storeArbolPlantilla,
            selModel: this.smArbolPlantilla,
            root: new Ext.tree.AsyncTreeNode({
                    text:'Escala',
                    // leaf:true,
                    id: 'root'
            }),
        });
		
		//Formulario de la plantilla de laestructura.
        this.formularioEstructA = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            region:'center',
            height:300,
            width: 900,
            items: [{xtype: 'panel',
                     border:false,
                     layout:'fit',
					 height:'100%',
                     width: '100%',
                     items:[this.ArbolPlantilla]
                        }]
        })
		
		//Botones de la ventana de la plantilla de la entidad.
        this.btnCancelarPlantilla = new Ext.Button({
            id:'idbtnCancelarPlantillaN',
            iconCls:'cancelar',
            text:idioma.lbBtnCancelar,   
            tooltip:idioma.textToolTipCancelar,
            prevTab: '', 
            nextTab: '',
        });
        
        this.btnAceptarPlantilla = new Ext.Button({
            id:'idbtnAceptarPlantillaN',
            iconCls:'aceptar',
            text:idioma.lbBtnAceptar,   
            tooltip:idioma.textToolTipAceptar,
            prevTab: '', 
            nextTab: '',
        });

        //Ventana de adicionar y modificar plantilla nominal.
        this.ventanaArbolPlantilla = new Ext.Window({
            title: idioma.lbTitleVentanaArbol,
			modal: true,
			width: 500, 
            heigth: 550, 
            closeAction: 'hide',
            constrain: true,
            autoHeight: true,
            closable:true,
            resizable:true, 
            layout: 'fit',
            items:[this.formularioEstructA],
            buttons: [this.btnCancelarPlantilla, this.btnAceptarPlantilla] , 
        });	
        
		//Panel del grid de personas
		this.panelcenter = new Ext.Panel({
            title:'Personas subordinadas',
			region: 'center',
            height: '100%',
            width: '50%',
            split: true,
            layout: 'border',
            items: [this.gpPersona]            
        });
		
		//Panel del grid de cargos
		this.panelwest = new Ext.Panel({
            region: 'west',
            height: '100%',
            width: '50%',
            split: true,
            border: true,
            layout:'fit',
			tbar:[this.btnAsociarCargos, this.btnDesasociarCargos],
			items:[this.gpCargos]
		});
             
        //Vista general de la interfaz.
        new Ext.Viewport({
            layout: 'border',
            items: [this.panelEstEnt,
			        {
                        region:'center', 
                        border :true, 
                        width:'40%', 
                        layout:'border',
                        items : [this.panelcenter, this.panelwest]
                    }]
        });
            	
	}
};

//Inicializando la vista.
UCID.portal.cargarEtiquetas('gestsubordinacion', function(perfil, idioma){
    perfil = arguments[0];
	idioma = arguments[1];
	
    //Inicializando el modelo.
    var modelo = Pvd.Nomina.Configuracion.GestSubordinacion.Modelo;
    modelo.init();
    //Inicializando la vista.
	var vista = Pvd.Nomina.Configuracion.GestSubordinacion.Vista;
    vista.init(perfil, idioma, modelo);
    //Inicializar controlador.
    Pvd.Nomina.Configuracion.GestSubordinacion.Controlador.init(idioma, vista, modelo);
});

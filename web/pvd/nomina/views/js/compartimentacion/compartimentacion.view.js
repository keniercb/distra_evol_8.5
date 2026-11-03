Ext.ns('Pvd.Nomina.Pagos.Compartimentacion');
 Ext.QuickTips.init();

Pvd.Nomina.Pagos.Compartimentacion.Vista = {
    init: function(perfil, idioma, modelo){
		var self = this;
		this.pobjestructura = new Ext.pvd.persona.buscarestructura.panelBuscarestructura({
        	layout: 'border',
            region:'center',
            nivel: 7,
            nivelchequear: 7            
        });
        
        this.btnAceptarCargo = new Ext.Button({
            id: 'btnAceptarCargo',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana (<b>ENTER</b>)',
            disabled: true,
            iconCls: 'aceptar'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Ayuda',
            iconCls: 'ayuda',

        });
        
        this.btnCancelarCargo = new Ext.Button({
            id: 'btnCancelarCargo',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            iconCls: 'cancelar'
        });
        
        this.winEstructura = new Ext.Window({
            title: 'Cargos',
            modal: true,
            height: 350,
            width: 300,
            constrain: true,
            closable:false,
            closeAction: 'hide',
            resizable:false, 
            layout: 'fit',
            items:[this.pobjestructura],
            buttons: [this.btnCancelarCargo, this.btnAceptarCargo] ,
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarCargo.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarCargo.handler();
                    }
                }
            ]
        });
		
		
		 this.cmCompartimentacionCargos = new Ext.grid.ColumnModel([{
               header: "idcompartimentacionnomina",
               dataIndex: 'idcompartimentacionnomina',
               hidden: true,
               hideable: false
            },{
               header: "idcargo",
               dataIndex: 'idcargo',
               hidden: true,
               hideable: false
            },{
               header: "Cargos",
               dataIndex: 'cargo',
               width: 200
            }
        ]);
        this.cmCompartimentacionCargos.defaultSortable = true;
        
        this.btnAdicionar = new Ext.Button({
            id: 'btnAdicionar',
            text: 'Ad<u>i</u>cionar',
            tooltip: 'Ad<u>i</u>cionar cargos (<b>Alt+I</b>)',
           // icon: perfil.dirImg+'adicionar.png',
            iconCls: 'adicionar'
        });
        
        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar cargos (<b>DEL</b>)',
            iconCls: 'eliminar'
        });
        
		this.gpCompartimentacionCargos = new Ext.grid.GridPanel({
            title:'Cargos',
            region: 'west',
            layout: 'fit',
            split: true,
            store: modelo.stCompartimentacionCargos,
            autoScroll: true,
            cm: this.cmCompartimentacionCargos,
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            width:350,
            height:600,
            viewConfig: {forceFit: true},
            loadMask:{msg : 'Cargando...'},
            tbar:[this.btnAdicionar,  this.btnEliminar],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminar.handler();
                    }
                },{
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionar.handler();
                    }
                }
            ]
        });
        
        
        /************************************************************************************/
        
         this.cmCompartimentacionTipoNomina = new Ext.grid.ColumnModel([{
               header: "idcompartimentacioncargoportiponomina",
               dataIndex: 'idcompartimentacioncargoportiponomina',
               hidden: true,
               hideable: false
            },{
               header: "idcompartimentacionnomina",
               dataIndex: 'idcompartimentacionnomina',
               hidden: true,
               hideable: false
            },{
               header: "idtiponomina",
               dataIndex: 'idtiponomina',
               hidden: true,
               hideable: false
            },{
               header: "Tipo de n&oacute;mina",
               dataIndex: 'tiponomina',
               width: 300
            },{
               header: "Permiso",
               dataIndex: 'permiso',
               width: 150,
               renderer: function(val){
						var index = modelo.stPermisos.find('valor', val);
						if(index != -1) return modelo.stPermisos.getAt(index).data.denominacion;
						else return val;
				},
				editor: new Ext.form.ComboBox({
				    valueField: 'valor',
					displayField: 'denominacion', 
					hiddenName: 'valor',
					allowBlank: false, 
					mode: 'local',
					blankText: 'Este campo es obligatorio.', 
					readOnly: true,
					triggerAction: 'all',
					store: modelo.stPermisos
				})
            }
        ]);
        this.cmCompartimentacionTipoNomina.defaultSortable = true;
        
        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: '<u>G</u>uardar',
            tooltip: '<u>G</u>uardar compartimentaci&oacute;n por tipo de n&oacute;mina (<b>Alt+G</b>)',
            iconCls: 'guardar'
        });
        
        this.btnAyuda = new Ext.Button({
            id: 'btnAyuda',
            text: 'Ayuda',
            tooltip: 'Mostrar ayuda de la funcionalidad (<b>Alt+H</b>)',
            iconCls: 'ayuda',

        });
        
		this.gpCompartimentacionTipoNomina = new Ext.grid.EditorGridPanel({
            title:'Compartimentaci&oacute;n por tipos de n&oacute;mina',
            region: 'center',
            layout: 'fit',
            split: true,
            store: modelo.stCompartimentacionTipoNomina,
            autoScroll: true,
            cm: this.cmCompartimentacionTipoNomina,
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            width:500,
            height:600,
            clicksToEdit:1,
            loadMask:{msg : 'Cargando...'},
            tbar:[this.btnGuardar,'->',this.btnAyuda],
            keys: [
               {
                    key: 'g',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnGuardar.handler();
                    }
                }
            ]

        });

        //**************************************************************
        this.btnAceptarCategoria = new Ext.Button({
            id: 'btnAceptarC',
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana(<b>ENTER</b>)',
            iconCls: 'aceptar'
        });

        this.btnCancelarcategoria = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos (<b>Alt+X</b>)',
            iconCls: 'cancelar'
        });
        this.btnAdicionarCateg = new Ext.Button({
            id: 'btnAdicionar',
            text: "Ad<u>i</u>cionar",
            tooltip: 'Ad<u>i</u>cionar categor&iacute;a (<b>Alt+I</b>)',
            iconCls: 'adicionar',
            disabled: true,
        });

        this.btnEliminarCateg = new Ext.Button({
            id: 'btnEliminar',
            text: 'Eliminar',
            tooltip: 'Eliminar categor&iacute;a  (<b>DEL</b>)',
            iconCls: 'eliminar',
            disabled: true,
        });

        this.smcategoria = new Ext.tree.DefaultSelectionModel({
        });

        this.categoria = new Ext.tree.TreePanel({
            //title:'Categorías',
            region:'east',
            width: '40%',
            split:false,
            border:true,
            rootVisible:false,
            autoScroll:true,
            layout: 'fit',
            loader: modelo.stcategoria,
            selModel: this.smcategoria,
            root: new Ext.tree.AsyncTreeNode({
                text:'Escala',
                // leaf:true,
                id: 'root'
            }),
        });

        this.winCategoria = new Ext.Window({
            title: 'Categoria',
            modal: true,
            height: 350,
            width: 300,
            closable:false,
            constrain: true,
            closeAction: 'hide',
            resizable:false,
            layout: 'fit',
            items:[this.categoria],
            buttons: [this.btnCancelarcategoria, this.btnAceptarCategoria],
            keys: [
                {
                    key: Ext.EventObject.ENTER,
                    stopEvent: true,
                    fn: function () {
                        self.btnAceptarCategoria.handler();
                    }
                },{
                    key: 'x',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnCancelarcategoria.handler();
                    }
                }
            ]
        });
        this.selectionModel = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,

        });
        this.cmCompartimentacionCategorias = new Ext.grid.ColumnModel([this.selectionModel,{
            header: "idcompartimentacionnomina",
            dataIndex: 'idcompartimentacionnomina',
            hidden: true,
            hideable: false
        },{
            header: "idcategoria",
            dataIndex: 'idcategoria',
            hidden: true,
            hideable: false
        },{
            header: "Categoria",
            dataIndex: 'denominacion',
            width: 200
        }
        ]);
        this.cmCompartimentacionCategorias.defaultSortable = true;



        this.gpCompartimentacionCategorias = new Ext.grid.GridPanel({
            title:'Listado de categoría',
            region: 'east',
            layout: 'fit',
            split: true,
            store: modelo.stCompartimentacionCategorias,
            autoScroll: true,
            cm: this.cmCompartimentacionCategorias,
            sm: this.selectionModel,
            width:350,
            height:600,
            viewConfig: {forceFit: true},
            loadMask:{msg : 'Cargando...'},
            tbar:[ this.btnAdicionarCateg,this.btnEliminarCateg, '->', this.btnAyuda],
            keys: [
                {
                    key: Ext.EventObject.DELETE,
                    stopEvent: true,
                    fn: function () {
                        self.btnEliminarCateg.handler();
                    }
                },{
                    key: 'i',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAdicionarCateg.handler();
                    }
                },{
                    key: 'h',
                    alt: true,
                    stopEvent: true,
                    fn: function () {
                        self.btnAyuda.handler();
                    }
                }]
                });
        
        new Ext.Viewport({
			layout: 'border',
			items: [this.gpCompartimentacionCargos, this.gpCompartimentacionTipoNomina/*,this.gpCompartimentacionCategorias*/]
		});
       
    }   
}

Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.ViewGrid = Ext.extend(Ext.grid.GridPanel, {
	stripeRows: true,
    width: '90%',
    region: 'center',
    border: false,      
    initComponent: function () {
        //Variables
        var self = this;
        
        this.btnReubicarPE = new Ext.Button({
        text:labels.lbBtnReubicarP,
        tooltip:labels.ttpBtnReubicarP,
        disabled: true,
        id:'reubicar',
        iconCls:'buscaryremplazar',
        handler: function () {					
			var record=self.getSelectionModel().getSelected();	
			var idpersona=record.data.idpersona;
			var idperiodoproceso=self.idperiodoproceso;
			var win=new Ext.components.Evaluaciones.WinEvaluador({				
				idpersona:idpersona,
				idperiodoproceso:self.idperiodoproceso,
				gridpersona:self
			});
			win.show();				
			
        }
    });      
               
        this.store = new Ext.data.Store({
            url: 'getPersonasEval',
            autoLoad: true,
            baseParams: {
               // start: 0,
                //limit: 10,//tamPaginado
                idperiodoproceso:self.idperiodoproceso
            },            
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idpersona'},
                {name: 'nombre'},               
                {name: 'papel'},
                {name: 'sapel'},
                {name:'numid'},
                {name: 'evaluador'}     

            ])
        });

        this.obj = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(sm) {                    
                    if (sm.hasSelection()) {
                       self.btnReubicarPE.enable();
                    }
                }
            }
        });
        this.columns = [
              
             {
                header: 'CI',
                sortable: true,
                width: 140,
                resizable: true,
                dataIndex: 'numid'
            },
            {
                header: 'Nombre',                
                sortable: true, 
                width:170,               
                resizable: true,
                dataIndex: 'nombre'
            }
            , {
                header: 'Primer Apellido',
                sortable: true,
                width: 170,
                resizable: true,
                dataIndex: 'papel'
            },
            {
                header: 'Segundo Apellido',
                sortable: true,
                width: 170,
                resizable: true,
                dataIndex: 'sapel'
            },       
            {
                header: 'Evaluador',
                sortable: true,
                width: 210,
                resizable: true,
                dataIndex: 'evaluador',
                renderer: showEvaluador
                
            }       
           
        ];
       

        this.loadMask = {
            msg: 'Cargando...'
        };

        this.tbar = [this.obj, this.btnReubicarPE],
        
        this.bbar = new Ext.PagingToolbar({
                    pageSize: 10,
                    store: this.store,
                    displayInfo: true
                });             
		this.wind=new Ext.components.Evaluaciones.WinEvaluador({
			
		});
        Ext.components.Evaluaciones.ViewGrid.superclass.initComponent.call(this);  
            
       
          function showEvaluador(val) {
            if (Ext.isEmpty(val)) {
                return '';
            } else if (val === 0) {
                return '<b style="color:green;">Finalizado</b>';
            } else {
                return '<b>' + val + '</b>';
            }
        }
    }
});

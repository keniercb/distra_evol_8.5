Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.ViewGridTrazas = Ext.extend(Ext.grid.GridPanel, {
	stripeRows: true,
    width: '90%',
    region: 'center',
    border: false,      
    initComponent: function () {
        //Variables
        var self = this;
               
        this.store = new Ext.data.Store({
            url: 'getTrazas',
            autoLoad: true,
            baseParams: {
                 start: 0,
                 limit: 10,//tamPaginado
                 idmodelo:self.idmodelo
            },            
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idpersona'},
				{name: 'numero'},
                {name: 'nombre'},               
                {name: 'papel'},
                {name: 'sapel'},
                {name:'fecha'},
                {name: 'hora'}     

            ])
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(sm) {                    
                    if (sm.hasSelection()) {
                      
                    }
                }
            }
        });
		 this.obj = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });
        this.columns = [
              
             {
                header: 'CI',
                sortable: true,
                width: 140,
                resizable: true,
                dataIndex: 'numero'
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
                header: 'Fecha',
                sortable: true,
                width: 210,
                resizable: true,
                dataIndex: 'fecha'                
                
            },
            {
                header: 'Hora',
                sortable: true,
                width: 210,
                resizable: true,
                dataIndex: 'hora'                
                
            }      			
           
        ];
       

        this.loadMask = {
            msg: 'Cargando...'
        };
        this.tbar = [this.obj],
		
        this.bbar = new Ext.PagingToolbar({
                    pageSize: 10,
                    store: this.store,
                    displayInfo: true
                });             
		
        Ext.components.Evaluaciones.ViewGridTrazas.superclass.initComponent.call(this);  
        
    }
});

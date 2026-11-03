Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.ViewGridEvaluador = Ext.extend(Ext.grid.GridPanel, {
	stripeRows: true,
    width: '90%',
    region: 'center',
    border: false,      
    initComponent: function () {
        //Variables
        var self = this;           
               
        this.store = new Ext.data.Store({
            url: 'getEvaluadores',
            autoLoad: true,
            baseParams: {
                start: 0,
                limit: 10,//tamPaginado
                idperiodoproceso:self.idperiodoproceso,
                idpersona:self.idpersona
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
                       
                    }
                }
            }
        });
        this.columns = [
                         
             {
                header: 'CI',
                sortable: true,
                width: 150,
                resizable: true,
                dataIndex: 'numid'
            } ,
              {
                header: 'Nombre',                
                sortable: true, 
                width:175,               
                resizable: true,
                dataIndex: 'nombre'
            }
            , {
                header: 'Primer Apellido',
                sortable: true,
                width: 175,
                resizable: true,
                dataIndex: 'papel'
            },
            {
                header: 'Segundo Apellido',
                sortable: true,
                width: 175,
                resizable: true,
                dataIndex: 'sapel'
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
      
        Ext.components.Evaluaciones.ViewGridEvaluador.superclass.initComponent.call(this);       
    }
});

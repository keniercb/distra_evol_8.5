Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.WinReubicarPersona = Ext.extend(Ext.Window, {
    layout: 'border',
    id: 'winRePer',
    title: 'Reubicar personas evaluadas',
    width: '95%',
    height: 500,
    closeAction: 'close',
    closable: true,
    modal: true,
    initComponent: function () {
        var self = this;
        
        this.btnReubicarPE = new Ext.Button({
        text:labels.lbBtnReubicarP,
        tooltip:labels.ttpBtnReubicarP,
        disabled: true,
        id:'reubicar',
        iconCls:'buscaryremplazar',
        handler: function () {					
			var record=self.grid.getSelectionModel().getSelected();	
			var idpersona=record.data.idpersona;
			var idperiodoproceso=self.idperiodoproceso;
			var win=new Ext.components.Evaluaciones.WinEvaluador({				
				idpersona:idpersona,
				idperiodoproceso:self.idperiodoproceso,
				gridpersona:self.grid
			});
			win.show();				
			
        }
    });      
        
        this.grid=new Ext.components.Evaluaciones.ViewGrid({
			//title:'Listado de personas evaluadas',
			idperiodoproceso:self.idperiodoproceso,
			btn:self.btnReubicarPE.disable()						
		});	
				
		//this.tbar = [this.btnReubicarPE],
		this.buttons = [
            {
                text: 'Cancelar',
                iconCls: 'cancelar',
                handler: function() {
                    self.close();
                }
            }
        ];
        this.key = [
            {
                key: 'b',
                alt: true,
                stopEvent: true,
                fn: function () {                    
                        self.btnReubicarPE.handler();
                        }
            }
        ];
        this.items=[this.grid];
        Ext.components.Evaluaciones.WinReubicarPersona.superclass.initComponent.call(this);
        this.grid.on('rowdblclick',function(grid,rowIndex,e){
			var record=grid.getSelectionModel().getSelected();
		    var idpersona=record.data.idpersona;	
			var win=new Ext.components.Evaluaciones.WinEvaluador({							
				idpersona:idpersona,
				idperiodoproceso:self.idperiodoproceso,
				gridpersona:self.grid
			});
			win.show();		
		}); 
    }
});

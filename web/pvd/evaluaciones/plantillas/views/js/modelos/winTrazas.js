Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.WinTrazas = Ext.extend(Ext.Window, {
    layout: 'border',
    id: 'winTrazas',    
    width: '75%',
    height: 500,
    closeAction: 'close',
    closable: true,
    modal: true,
    initComponent: function () {
        var self = this;
        
        this.grid=new Ext.components.Evaluaciones.ViewGridTrazas({			
			idmodelo:self.idmodelo									
		});
        this.btnCancelar = new Ext.Button({
            text: 'Cancelar',
           //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            tooltip: 'Cerrar ventana(<b>Alt+X</b>)',
            handler: function() {
                self.close();
            }
        });
        this.keys = [
            {
                key: 'x',
                alt: true,
                fn: function () {
                    self.btnCancelar.handler();                
            }
         }
        ];
		this.buttons = [
            self.btnCancelar
        ];       
        this.items=[this.grid];
        Ext.components.Evaluaciones.WinTrazas.superclass.initComponent.call(this);
     }
});

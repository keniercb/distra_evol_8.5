Ext.ns("Ext.components.Evaluaciones");
Ext.components.Evaluaciones.CmpListPlanillasActivas = Ext.extend(Ext.grid.GridPanel,{
    autoExpandColumn: 'denominacion',    
    autoExpandColumn: 'denominacion',    
    initComponent: function() {
        var self = this;
		
        this.btnBuscar = new Ext.Button({
            id:'btnBuscar'+self.id,
            iconCls: 'buscar',
            text: self.labels.lbBtnBuscar,
            tooltip:self.labels.ttpBtnBuscar,
            handler: buscar
        });
		
        this.btnLimpiar= new Ext.Button({
            id:'btnLimpiar'+self.id, 
            tooltip: self.labels.ttpBtnLimpiar,
            iconCls: 'limpiar',
            text: self.labels.lbBtnLimpiar,
            nextTab: 'btnCancelar'+self.id, 
            prevTab: 'btnBuscar'+self.id,
            handler: function(){ 
                tfDenomPlanilla.reset();
                self.btnBuscar.focus();
            }
        });
	
        var tfDenomPlanilla = new Ext.form.TextField({
            width:160,
            anchor: '95%',
            id:'tfDenomPlanilla'+self.id,
            nexTab:'btnBuscar'+self.id,
            prevTab:'btnAceptar'+self.id,
            emptyText: self.labels.lbEmptyTextBuscar,
            listeners: {
                specialkey: function(field, e){			
                    if (e.getKey() == e.ENTER) {
                        self.btnBuscar.handler();
                    }
                }
            }
        });
		
        this.chSelModel = new Ext.grid.RowSelectionModel({
            singleSelect: self.singleSelect || true
        });
        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template('<div style ="word-wrap:break-word;margin:5px;"><p><b>Descripci&oacute;n</b>:&nbsp;{descripcion}</p></div>')
        });

        this.store = new Ext.data.Store({
            url: '/pvd/evaluaciones/procesoevaluativo/index.php/definirproceso/getplanillasactivas',
            reader:new Ext.data.JsonReader({
                root:'datos',
                totalProperty: 'cantidad'
            },[
            {
                name:'idplanilla'
            },

            {
                name:'denom'
            },

            {
                name:'descripcion'
            }
            ])
        });		
        this.columns = [expander,
        {
            id:'denominacion',
            header: self.labels.cMDenomPlanilla,
            width: 200, 
            sortable: true, 
            dataIndex: 'denom'
        }
        ];
        this.loadMask = {
            msg:self.labels.lbGridLoadMask
        };
        this.plugins = expander;
        this.sm = self.chSelModel;
		
        this.keys = [{
            key: 'b', 
            alt:true,
            fn: self.btnBuscar.handler
        },{
            key: 'l', 
            alt:true,
            fn:	self.btnLimpiar.handler
        }
        ];
		
        this.tbar = ['',self.labels.cMDenomPlanilla+': ',tfDenomPlanilla,'',self.btnBuscar,self.btnLimpiar];
        this.bbar = new Ext.PagingToolbar({
            pageSize: 15,
            store: self.store,
            displayInfo: true
        });
        Ext.components.Evaluaciones.CmpListPlanillasActivas.superclass.initComponent.call(this);
	
        this.store.load({
            callback:function(){
                self.btnBuscar.focus(false, 300);
            }
        });
		
        function buscar(){
            self.store.load({
                params:{
                    filtro: tfDenomPlanilla.getValue()
                }
            });
        }
    }
});

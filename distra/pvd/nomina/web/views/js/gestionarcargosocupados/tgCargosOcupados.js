Ext.ns('PVD.Nomina.Pagos');
PVD.Nomina.Pagos.CargosOcupados = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel,{
    stripeRows: true,
    autoExpandColumn: 'expandir',
    master_column_id : 'expandir',
    title: 'Cargos ocupados',
    root_title: 'Indicadores',
    loadMask:{
        msg: 'Cargando...'
    },

    initComponent: function(){
        var self = this;

        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            //autoLoad: true,
            url: '/pvd/nomina/index.php/gestionarcargosocupados/obtenerCargosOcupados',//self.url,
            listeners:{
                beforeexpandnode: function(st, record){
                   
					st.baseParams._id = record.get('_id');
					st.baseParams.identidad= record.get('identidad');
					st.baseParams.idpersa= record.get('idpersona');//id persona actual del grid derecho
                },
                beforeload:function(st, options){
                    //st.baseParams.idplanilla = self.idplanilla;
                    //st.baseParams.idpersonaevaluacion = self.idpersonaevaluacion || '';
                },
                load :function(store,record,options) {
                }
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'datos',
                totalProperty: 'cantidad',
                successProperty: 'success'
            },
            [{
                name: '_id'
            },
            {
                name: '_parent'
            },
			{
                name: '_is_leaf'
            }, 
            {
                name: 'idpersona'
            }, 
			{
                name: 'identidad'
            }, 
            {
                name: 'denom'
            }, 
            {
                name: 'situac'
            }, 
            {
                name: 'idsituac'
            }, 
            {
                name: 'fecharegistro'
            }, 
            {
                name: 'fechaaplicacion'
            }, 
            {
                name: 'fechavencimiento'
            }]
            )
        });

        this.columns = [
        {
            id:'expandir',
            header: "Cargo",
            width: 200,
            sortable: true,
            dataIndex: 'denom',
            renderer: self.showImageTipoIndicador
        },
        {
            header: "Situaci&oacute;n laboral",
            width: 140,
            sortable: true,
            dataIndex: 'situac'
        },
		{
            header: "F.Reg",
            width: 80,
            sortable: true,
            dataIndex: 'fecharegistro'
        },
		{
            header: "F.Aplic.",
            width: 80,
            sortable: true,
            dataIndex: 'fechaaplicacion'
        },
		{
            header: "F.Venc.",
            width: 80,
            sortable: true,
            dataIndex: 'fechavencimiento'
        }
        ];
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });
        PVD.Nomina.Pagos.CargosOcupados.superclass.initComponent.call(this);
    },
    showImageTipoIndicador: function(val, fn, record) {
        //width=15 height=15
        //return '<span><img src="/pvd/evaluaciones/evaluar/views/images/folder.png" style="float:left; 	padding:0 !important;">'+' '+val+'</span>';
        return val;
    }
});

PVD.Nomina.Pagos.Cargos = Ext.extend(Ext.ux.maximgb.treegrid.GridPanel,{
    stripeRows: true,
    autoExpandColumn: 'expandir',
    master_column_id : 'expandir',
    //title: 'Cargos ocupados',
    root_title: 'Indicadores',
    loadMask:{
        msg: 'Cargando...'
    },

    initComponent: function(){
        var self = this;

        this.store = new Ext.ux.maximgb.treegrid.AdjacencyListStore({           
            url: '/pvd/nomina/index.php/gestionarcargosocupados/obtenerCargosOcupados',//self.url,
            listeners:{
                beforeexpandnode: function(st, record){
                    st.baseParams._id = record.get('_id');
                },
                beforeload:function(st, options){
                    //st.baseParams.idplanilla = self.idplanilla;
                    //st.baseParams.idpersonaevaluacion = self.idpersonaevaluacion || '';
                },
                load :function(store,record,options) {
                }
            },
            reader: new Ext.data.JsonReader({
                id: '_id',
                root: 'data',
                totalProperty: 'total',
                successProperty: 'success'
            },
            [{
                name: '_id'
            },
            {
                name: '_parent'
            },
            {
                name: '_is_leaf'
            }, 
            {
                name: 'denom'
            }, 
            {
                name: 'situac'
            }, 
            {
                name: 'idsituac'
            }, 
            {
                name: 'freg'
            }, 
            {
                name: 'faplic'
            }, 
            {
                name: 'fvenc'
            }			
            ])
        });

        this.columns = [
        {
            id:'expandir',
            header: "Cargo",
            width: 200,
            sortable: true,
            dataIndex: 'denom',
            renderer: self.showImageTipoIndicador
        },        
		{
            header: "F.Reg",
            width: 80,
            sortable: true,
            dataIndex: 'freg'
        }];
        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });
        PVD.Nomina.Pagos.CargosOcupados.superclass.initComponent.call(this);
    },
    showImageTipoIndicador: function(val, fn, record) {
        //width=15 height=15
        //return '<span><img src="/pvd/evaluaciones/evaluar/views/images/folder.png" style="float:left; 	padding:0 !important;">'+' '+val+'</span>';
        return val;
    }
});
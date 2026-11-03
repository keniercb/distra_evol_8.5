Ext.ns('Pvd.Nomina.Pagos.Nomina');

Pvd.Nomina.Pagos.Nomina.Modelo = {
    init: function() {

     	this.stPeriodosPago = new Ext.data.GroupingStore({
            url: 'obtenerperiodosdepago',
            sortInfo: {field: 'fechapago', direction: "ASC"},
            groupField: 'anyo',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad", 
                autoLoad:true, 
                root: "datos", 
                id: "idelaborarpagos" }, 
                [{name: 'idelaborarpagos'}
                ,{name: 'idtipopago'}
                ,{name: 'idperiodopago'}		
                ,{name: 'fechapago'}		
                ,{name: 'fechainicioperiodo'}
                ,{name: 'fechafinperiodo'}
                ,{name: 'mesanyopago'}
                ,{name: 'estado'}
                ,{name: 'identidad'}
                ,{name: 'anyo'}
                ,{name: 'mes'}
                ,{name: 'periodopago'}
                ])
        });
        
        this.CargarPeriodosPago = function(identidad, idtipopago, modopago){
			this.stPeriodosPago.removeAll();
			this.stPeriodosPago.baseParams.identidad = identidad;
			this.stPeriodosPago.baseParams.idtipopago = idtipopago;
			this.stPeriodosPago.baseParams.modopago = modopago;
			this.stPeriodosPago.load();
		}

		
    }
};


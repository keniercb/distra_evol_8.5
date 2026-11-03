Ext.ns('Pvd.Nomina.CalculoPagoResultado');
/**
 *  Autora: Beatriz Selema Alvarez
 */
Pvd.Nomina.CalculoPagoResultado.Modelo = {

    init: function () {
        this.stPlantillaNAreas = new Ext.data.Store({
            url: 'obtenerAreas',
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idarea" },
                [ 	 {name: 'idarea'}
                    ,{name: 'area'}
                    ,{name: 'monto'}
                    ,{name: 'idpagoporresultadoarea'}
                    ,{name: 'idpagoporresultado'}
                ])
        });

        this.stPagosResultados = new Ext.data.Store({
            url: 'obtenerpagos',
            baseParams:{identidad:perfil.idestructuracomun},
            //autoLoad:true,
            reader:new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idpagoporresultado" },
                [ 	 {name: 'idpagoporresultado'}
                    ,{name: 'idtipopago'}
                    ,{name: 'dentipopago'}
                    ,{name: 'referencia'}
                    ,{name: 'estado'}
                    ,{name: 'identidad'}
                    ,{name: 'denentidad'}
                    ,{name: 'pagos'}
                    ,{name: 'areas'}
                    ,{name: 'fechas'}
                    ,{name: 'fechainicio'}
                    ,{name: 'fechafin'}
                    ,{name: 'pagoxresultadosdestajo'}
                ])
        });


    }
}

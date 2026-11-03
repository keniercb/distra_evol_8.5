Ext.ns('Pvd.Nomina.Recuperacion.Resumensalario');

Pvd.Nomina.Recuperacion.Resumensalario.Modelo = {
    init: function() {
        this.stPeriodosPago = new Ext.data.GroupingStore({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenerperiodosdepago',
            sortInfo: {field: 'fechapago', direction: "ASC"},
            groupField: 'anyo',
            reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad:true,
                    root: "datos",
                    id: "idelaborarpagos" },
                [{name: 'idelaborarpagos'}
                    ,{name: 'idtipopago'}
                    ,{name: 'denomtipopago'}
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

        this.CargarPeriodosPago = function(identidades, idtipopagos, modopago){
            this.stPeriodosPago.removeAll();
            this.stPeriodosPago.baseParams.identidades = Ext.encode(identidades);
            this.stPeriodosPago.baseParams.idtipopagos = Ext.encode(idtipopagos);
            this.stPeriodosPago.baseParams.modopago = modopago;
            this.stPeriodosPago.load();
        };

        this.stTipoPago = new Ext.data.Store({
            url: '/pvd/nomina/index.php/elaborarpagos/obtenertipospago',
            reader:new Ext.data.JsonReader(
                {id: "idtipopago" },
                [ 	 {name: 'idtipopago'}
                    ,{name: 'denominacion'}
                    ,{name: 'sedesglosa'}
                    ,{name: 'modopago'}
                    ,{name: 'modoseleccionpersonas'}
                    ,{name: 'fechainicio'}
                    ,{name: 'fechafin'}
                    ,{name: 'descripcion'}
                ])
        });
   }
};
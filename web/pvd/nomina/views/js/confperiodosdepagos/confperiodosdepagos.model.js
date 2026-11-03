Ext.ns('Pvd.Nomina.Configuracion.PeriodosDePagos');

//Modelo de la vista del componente Configurar Periodos De Pagos.
Pvd.Nomina.Configuracion.PeriodosDePagos.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        //Store del listado de tipos de pagos
        this.stTiposPagos = new Ext.data.Store({
            url: 'obtenerTiposPagos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idtipopago"},
                [{name: 'idtipopago'}
                    , {name: 'denominacion'}
                ])
        });

        //Store del listado de tipos de pagos
        this.stPeriodosPago = new Ext.data.Store({
            url: 'obtenerPeriodos',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodopago"},
                [{name: 'idperiodopago'}
                    , {name: 'denominacion'}
                ])
        });

        //Store del listado de tipos de pagos
        this.stFechasInicioFin = new Ext.data.GroupingStore({
            url: 'obtenerFechasInicioFin',
            sortInfo: {field: 'orden', direction: "DESC"},//"DESC"
            groupField: 'anno',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "iddesgloseperiodos"}, [
                    {name: 'iddesgloseperiodos'},
                    {name: 'idperiodostipospago'},
                    {name: 'idestructura'},
                    {name: 'idtipopago'},
                    {name: 'denomtipopago'},
                    {name: 'idperiodopago'},
                    {name: 'fechainicio'/*, type: 'date'*/},
                    {name: 'fechafin'/*, type: 'date'*/},
                    {name: 'anno'},
                    {name: 'orden'/*,type: 'float'*/}
                ])
        });

    }
};
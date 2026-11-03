Ext.ns('Pvd.Nomina.Pagos.ElaborarPagos');

Pvd.Nomina.Pagos.ElaborarPagos.Modelo = {
    init: function () {

        this.stPeriodosPago = new Ext.data.GroupingStore({
            url: 'obtenerperiodosdepago',
            sortInfo: {field: 'anyo', direction: "DESC"},
            groupField: 'anyo',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idelaborarpagos"
                },
                [
                    {name: 'idelaborarpagos'}
                    ,
                    {name: 'idtipopago'}
                    ,
                    {name: 'idperiodopago'}
                    ,
                    {name: 'fechapago'}
                    ,
                    {name: 'fechainicioperiodo'}
                    ,
                    {name: 'fechafinperiodo'}
                    ,
                    {name: 'mesanyopago'}
                    ,
                    {name: 'estado'}
                    ,
                    {name: 'identidad'}
                    ,
                    {name: 'anyo'}
                    ,
                    {name: 'mes'}
                    ,
                    {name: 'periodopago'}
                ])
        });

        this.stPeriodosPagoReferenciados = new Ext.data.GroupingStore({
            url: 'obtenerperiodosdepagoreferenciados',
            sortInfo: {field: 'fechainicioperiodo', direction: "ASC"},
            groupField: 'anyo',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idelaborarpagosreferencia"
                },
                [
                    {name: 'idelaborarpagosreferencia'}
                    ,
                    {name: 'idelaborarpagos'}
                    ,
                    {name: 'idtipopago'}
                    ,
                    {name: 'idperiodopago'}
                    ,
                    {name: 'fechapago'}
                    ,
                    {name: 'fechainicioperiodo'}
                    ,
                    {name: 'fechafinperiodo'}
                    ,
                    {name: 'mesanyopago'}
                    ,
                    {name: 'estado'}
                    ,
                    {name: 'identidad'}
                    ,
                    {name: 'anyo'}
                    ,
                    {name: 'mes'}
                    ,
                    {name: 'periodopago'}
                    ,
                    {name: 'denomtipopago'}
                ])
        });

        this.CargarPeriodosPago = function (identidad, idtipopago, modopago) {
            this.stPeriodosPago.removeAll();
            this.stPeriodosPago.baseParams.identidad = identidad;
            this.stPeriodosPago.baseParams.idtipopago = idtipopago;
            this.stPeriodosPago.baseParams.modopago = modopago;
            this.stPeriodosPago.load();
        }

        this.stPersonasPeriodosPago = new Ext.data.GroupingStore({
            url: 'obtenerpersonasperiodosdepago',
            groupField:'nombreplantilla',
            sortInfo: {field: 'ordenunico', direction: "ASC"},
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idpersonaelaborarpagos"
                },
                [
                    {name: 'idpersonaelaborarpagos'}
                    ,
                    {name: 'idelaborarpagos'}
                    ,
                    {name: 'idpersona'}
                    ,
                    {name: 'excluido'}
                    ,
                    {name: 'idcausaexclusion'}
                    ,
                    {name: 'nombreyapellidos'}
                    ,
                    {name: 'causaexclusion'}
                    ,
                    {name: 'codcontable'}
                    ,
                    {name: 'ci'}
                    ,
                    {name: 'nombreplantilla'}
                    ,
                    {name: 'idplantillanominal'}
                    ,
                    {name: 'ordenunico'}
                ])
        });


        this.stPersonasExcluidas = new Ext.data.Store({
            url: 'obtenerpersonasexcluidasperiodosdepago',
            sortInfo: {field: 'nombreyapellidos', direction: "ASC"},
            reader: new Ext.data.JsonReader({
                    autoLoad: true,
                    root: "datos",
                    id: "idpersonaelaborarpagos"
                },
                [
                    {name: 'idpersonaelaborarpagos'}
                    ,
                    {name: 'idelaborarpagos'}
                    ,
                    {name: 'idpersona'}
                    ,
                    {name: 'excluido'}
                    ,
                    {name: 'idcausaexclusion'}
                    ,
                    {name: 'nombreyapellidos'}
                    ,
                    {name: 'causaexclusion'}
                ])
        });


        this.CargarPersonasElaborarPago = function (idelaborarpagos, identidad, modoseleccionpersonas, cargar) {
            this.stPersonasPeriodosPago.removeAll();
            this.stCargos.removeAll();
            if (cargar == 1) {
                this.stPersonasPeriodosPago.baseParams.identidad = identidad;
                this.stPersonasPeriodosPago.baseParams.idelaborarpagos = idelaborarpagos;
                this.stPersonasPeriodosPago.baseParams.modoseleccionpersonas = modoseleccionpersonas;
                this.stPersonasPeriodosPago.baseParams.critbusq = '';
                this.stPersonasPeriodosPago.load({params: {limit: 15, start: 0}});
            }
        }

        this.stTipoPago = new Ext.data.Store({
            url: 'obtenertipospago',
            //sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {id: "idtipopago"},
                [
                    {name: 'idtipopago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'sedesglosa'}
                    ,
                    {name: 'modopago'}
                    ,
                    {name: 'modoseleccionpersonas'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'orden'}
                ])
        });

        this.stPeriodoPago = new Ext.data.Store({
            url: 'obtenerperiodospago',
            reader: new Ext.data.JsonReader(
                {id: "idperiodopago"},
                [
                    {name: 'idperiodopago'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                    ,
                    {name: 'cantidaddias'}
                    ,
                    {name: 'esmensual'}
                ])
        });

        this.stPeriodoPago.load();

        this.arrMes = [
            ['01', 'Enero'],
            ['02', 'Febrero'],
            ['03', 'Marzo'],
            ['04', 'Abril'],
            ['05', 'Mayo'],
            ['06', 'Junio'],
            ['07', 'Julio'],
            ['08', 'Agosto'],
            ['09', 'Septiembre'],
            ['10', 'Octubre'],
            ['11', 'Noviembre'],
            ['12', 'Diciembre']
        ];
        this.stMes = new Ext.data.Store({
            data: this.arrMes,
            reader: new Ext.data.ArrayReader({}, [
                {name: 'valor'},
                {name: 'denominacion'}
            ]),
            sortInfo: {field: 'valor', direction: "ASC"}
        });

        this.stCargos = new Ext.data.Store({
            url: 'obtenercargosysituacionlaboral',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idcargosocupados"
            }, [
                {name: 'idcargo'}
                ,
                {name: 'denomcargo'}
                ,
                {name: 'idsituacionlaboral'}
                ,
                {name: 'denomsituacionlaboral'}
                ,
                {name: 'idcargosocupados'}
            ])
        });

        this.CargarCargosOcupadosPersona = function (identidad, idpersona, idperiodopago, idpersonaelaborarpagos) {
            this.stCargos.removeAll();
            this.stCargos.baseParams.identidad = identidad;
            this.stCargos.baseParams.idpersona = idpersona;
            this.stCargos.baseParams.idperiodopago = idperiodopago;
            this.stCargos.baseParams.idpersonaelaborarpagos = idpersonaelaborarpagos;
            this.stCargos.load();
        }

        this.stCausaExclusion = new Ext.data.Store({
            url: 'obtenercausaexclusion',
            reader: new Ext.data.JsonReader(
                {id: "idcausaexclusion"},
                [
                    {name: 'idcausaexclusion'}
                    ,
                    {name: 'denominacion'}
                    ,
                    {name: 'fechainicio'}
                    ,
                    {name: 'fechafin'}
                    ,
                    {name: 'descripcion'}
                ])
        });

        this.stCausaExclusion.load();

        this.stVariablesPersona = new Ext.data.GroupingStore({
            url: 'obtenervariablespersona',
            sortInfo: {field: 'variable', direction: "ASC"},
            groupField: 'tipo',
            params: {idpersonaelaborarpagos: -1},
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "idvariablespersonaelaborarpagos"
                },
                [
                    {name: 'idvariablespersonaelaborarpagos'}
                    ,
                    {name: 'idpersonaelaborarpagos'}
                    ,
                    {name: 'idcargosocupados'}
                    ,
                    {name: 'idvariableauxconceptospdformasysistemaspago'}
                    ,
                    {name: 'idvariableauxiliarformula'}
                    ,
                    {name: 'idconceptopercepciondescuento'}
                    ,
                    {name: 'origenvariable'}
                    ,
                    {name: 'valor'}
                    ,
                    {name: 'variable'}
                    ,
                    {name: 'tipo'}
                    ,
                    {name: 'detalles'}
                ])
        });

        this.stConfigPeriodosPago = new Ext.data.GroupingStore({
            url: 'obtenerconfigperiodospagos',
            sortInfo: {field: 'fechainicioperiodo', direction: "DESC"},
            groupField: 'anno',
            params: {idpersonaelaborarpagos: -1},
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                    id: "iddesgloseperiodos"
                },
                [
                    {name: 'iddesgloseperiodos'}
                    ,
                    {name: 'idperiodostipospago'}
                    ,
                    {name: 'idtipopago'}
                    ,
                    {name: 'idperiodopago'}
                    ,
                    {name: 'fechainicioperiodo'}
                    ,
                    {name: 'fechafinperiodo'}
                    ,
                    {name: 'anno'}
                ])
        });

        this.CargarVariablesPersona = function (idpersonaelaborarpagos, idcargosocupados) {
            this.stVariablesPersona.removeAll();
            this.stVariablesPersona.baseParams.idpersonaelaborarpagos = idpersonaelaborarpagos;
            this.stVariablesPersona.baseParams.idcargosocupados = idcargosocupados;
            this.stVariablesPersona.load();
        }

    }
};


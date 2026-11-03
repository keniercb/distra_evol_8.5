Ext.ns('Pvd.Nomina.Pago.Retencion');

//Modelo de la vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Retencion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {

        //Store del listado de retenciones.
        this.storeRetenc = new Ext.data.Store({
            url: 'obtenerListadoRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idretencionpersona"
            }, [
                {name: 'idretencionpersona'},
                {name: 'idtiporetencion'},
                {name: 'activo'},
                {name: 'saldolimite'},
                {name: 'saldoinicial'},
                {name: 'mensualidad'},
                {name: 'ultmensualidad'},
                {name: 'refdocumentoacredita'},
                {name: 'fechadocumento'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'tiporetencion'},
                {name: 'cuentacontable'},
                {name: 'cobrosypagos'},
                {name: 'denom'},
                {name: 'numerocomprobante'},

            ])
        });
        //Store del listado de personas altas retenciones.
        this.storePersRetenc = new Ext.data.GroupingStore({
            url: 'obtenerListadoPersonasRetencion',  
            sortInfo: {field: 'ordencargo',direction: "ASC"}, 
            groupField: 'plantillanominal',  
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idconfpersonaretencion"
            }, [
                {name: 'idpersona'},
                {name: 'idconfpersonaretencion'},
                {name: 'identidad'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'numid'},
                {name: 'idcargo'},
                {name: 'denomcargo'},
                {name: 'idplantillanominal'},
                {name: 'iddatretencionpersona'},
                {name: 'plantilla'},
                {name: 'orden'},
                {name: 'plantillanominal'},
                {name: 'ordencargo', type: 'float'},
                {name: 'cdgocontable'}
            ])
        });      
        //Store del listado de personas bajas retenciones.
        this.storePersRetencBaj = new Ext.data.GroupingStore({
            url: 'obtenerListadoPersonasRetencionBaja',
            sortInfo: {field: 'ordencargo',direction: "ASC"}, 
            groupField: 'plantillanominal', 
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'},
                {name: 'personacargoocp'},
                {name: 'identidad'},
                {name: 'numero'},
                {name: 'nombre'},
                {name: 'snombre'},
                {name: 'papel'},
                {name: 'sapel'},
                {name: 'idcargo'},
                {name: 'denomcargo'},
                {name: 'cargo'},
                {name: 'orden'},
                {name: 'area'},
                {name: 'plantillanominal'},
                {name: 'idplantillanominal'},
                {name: 'ordencargo', type: 'float'},
                {name: 'cdgocontable'}
            ])
        });

        //Store del listado de retenciones.
        this.storeRepRetenc = new Ext.data.Store({
            url: 'obtenerNomencladorRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idtiporetencion"
            }, [
                {name: 'idtiporetencion'},
                {name: 'abreviatura'},
                {name: 'denominacion'},
                {name: 'saldolimite'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'descripcion'}
            ])
        });

        //Store del listado de periodos
        this.storeperiodosSubmayor = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty:"cantidad", root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        //Store del listado de retenciones.
        this.storeRepRetencTodas = new Ext.data.Store({
            url: 'obtenerNomencladorRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idtiporetencion"
            }, [
                {name: 'idtiporetencion'},
                {name: 'abreviatura'},
                {name: 'denominacion'},
                {name: 'saldolimite'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'descripcion'}
            ])
        });

        //Store del listado de operaciones retenciones .
        this.storeRetencHist = new Ext.data.Store({
            url: 'obtenerListadoRetencionesHistorico',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idhisretencionpersona"
            }, [
                {name: 'idhisretencionpersona'},
                {name: 'idretencionpersona'},
                {name: 'idnomina'},
                {name: 'numeronomina'},
                {name: 'idcomprobanteacredita'},
                {name: 'idcomprobantependiente'},
                {name: 'retenido'},
                {name: 'saldodeladeudo'},
                {name: 'retencionpendiente'},
                {name: 'saldodeladeudopendiente'},
                {name: 'fechaoperacion'},
                {name: 'numerocomprobanteoperaciones'},
                {name: 'fechacomprobantependiente'}
            ])
        });

        // listado del historico de retenciones
        this.storeRetencHistorico = new Ext.data.Store({
            url: 'obtenerHistoricoListadoRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idhisdatretencionpersona"
            }, [
                {name: 'idhisdatretencionpersona'},
                {name: 'idtiporetencion'},
                {name: 'saldolimite'},
                {name: 'saldoinicial'},
                {name: 'mensualidad'},
                {name: 'ultmensualidad'},
                {name: 'refdocumentoacredita'},
                {name: 'fechadocumento'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'tiporetencion'},
            ])
        });

        //Store  listado del historico operaciones retenciones .
        this.storeOperacionesRetencHist = new Ext.data.Store({
            url: 'obtenerListadohistoricoOperacionesRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idhisoperacionretencionpersona"
            }, [
                {name: 'idhisoperacionretencionpersona'},
                {name: 'idhisdatretencionpersona'},
                {name: 'idnomina'},
                {name: 'numeronomina'},
                {name: 'idcomprobanteacredita'},
                {name: 'idcomprobantependiente'},
                {name: 'retenido'},
                {name: 'saldodeladeudo'},
                {name: 'retencionpendiente'},
                {name: 'saldodeladeudopendiente'},
                {name: 'fechaoperacion'},
                {name: 'fechacomprobantependiente'}
            ])
        });

        //Store del combo de tipo de retención.
        this.storeTipoRetencion = new Ext.data.Store({
            url: 'obtenerTiposRetenciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idtiporetencion"
            }, [
                {name: 'idtiporetencion'},
                {name: 'denominacion'},
                {name: 'saldolimite'},
                {name: 'descripcion'},
            ])
        });

        //Store de tipos de nominas
        this.stTiposNominas = new Ext.data.Store({
            url: 'obtenertiposnomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtiponomina"},
                [{name: 'idtiponomina'}, {name: 'denominaciontiponomina'}
                ])
        });

        //Store de las operaciones contables
        this.cmbOperaciones = new Ext.data.Store({
            url: 'obtenerOperacionesContables',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idoperacion"},
                [{name: 'idoperacion'}, {name: 'operacion'}
                ])
        });

        this.stcuenta = new Ext.data.Store({
            url       : '/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/cargarCuentas',
            baseParams: {
                tipocta     : 2,
                idsubsistema: 71
            },
            reader    : new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuentacontable', mapping: 'id'},
                {name: 'denom', mapping: 'text'}
            ])
        });

        /*
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
		}*/
    }
};

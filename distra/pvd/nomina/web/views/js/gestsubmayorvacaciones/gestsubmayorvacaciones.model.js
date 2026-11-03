Ext.ns('Pvd.Nomina.Submayor.Vacaciones');

//Modelo de la vista del componente Gestionar submayor de vacaciones. 
Pvd.Nomina.Submayor.Vacaciones.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        //Store de los datos del submayor de vacaciones.
        this.storeVac = new Ext.data.Store({
            url: 'obtenerDatosGeneralesSubVacaciones',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idvacacionespersona"
            }, [
                {name: 'idvacacionespersona'},
                {name: 'tiempoacumuladoinicial'},
                {name: 'importeacumuladoinicial'},
                {name: 'tiempoacumulado'},
                {name: 'importeacumulado'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'idpersona'},
                {name: 'identidad'},
                {name: 'cantidadoperaciones'}
            ])
        });

        this.storeAjustes = new Ext.data.SimpleStore({
            fields: ['tipoajuste', 'valor'],
            data: [['Suma', '1'], ['Resta', '2']]
        });

        //Store del listado de actualizaciones del submayor de vacaciones.
        this.storeVacHist = new Ext.data.GroupingStore({
            url: 'obtenerListadoActualizaciones',
            sortInfo: {field: 'periodo', direction: "DESC"},
            groupField: 'periodo',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idhisvacacionespersona"
            }, [
                {name: 'idhisvacacionespersona'},
                {name: 'idvacacionespersona'},
                {name: 'idnomina'},
                {name: 'numeronomina'},
                {name: 'tipooperacion'},
                {name: 'fechaoperacion'},
                {name: 'tiempoacumulado'},
                {name: 'importeacumulado'},
                {name: 'saldoentiempo'},
                {name: 'saldoenimporte'},
                {name: 'promedioimporte'},
                {name: 'ajusteimporte'},
                {name: 'ajustetiempo'},
                {name: 'tipoajuste'},
                {name: 'periodo'}
            ])
        });

        ////Store listado de historici ajustes de trazas operaciones por persona
        //this.storeMostrarTrazas = new Ext.data.GroupingStore({
        //    url: 'obtenerListadoAjustesOperaciones',
        //    method: 'POST',
        //    sortInfo: {field: 'periodo', direction: "DESC"},
        //    groupField: 'periodo',
        //    reader: new Ext.data.JsonReader({
        //        root: "datos",
        //        totalProperty: "cantidad",
        //        id: "idajustesoperaciones"
        //    }, [
        //        {name: 'idajustesoperaciones'},
        //        {name: 'idvacasionespersona'},
        //        {name: 'numeronomina'},
        //        {name: 'tipooperacion'},
        //        {name: 'idusuario'},
        //        {name: 'identidad'},
        //        {name: 'fechaajuste'},
        //        {name: 'tipoaccion'},
        //        {name: 'tipoajuste'},
        //        {name: 'nombreusuario'},
        //        {name: 'ajusteimporte'},
        //        {name: 'ajustetiempo'},
        //        {name: 'periodo'},
        //    ])
        //});
        //
        ////Store listado de historici ajustes de trazas operaciones
        //this.storeMostrarTrazasHis = new Ext.data.GroupingStore({
        //    url: 'obtenerListadoAjustesOperacionesHis',
        //    method: 'POST',
        //    sortInfo: {field: 'periodo', direction: "DESC"},
        //    groupField: 'periodo',
        //    reader: new Ext.data.JsonReader({
        //        root: "datos",
        //        totalProperty: "cantidad",
        //        id: "idajustesoperaciones"
        //    }, [
        //        {name: 'idajustesoperaciones'},
        //        {name: 'idvacasionespersona'},
        //        {name: 'numeronomina'},
        //        {name: 'nombreapell'},
        //        {name: 'tipooperacion'},
        //        {name: 'idusuario'},
        //        {name: 'identidad'},
        //        {name: 'fechaajuste'},
        //        {name: 'tipoaccion'},
        //        {name: 'tipoajuste'},
        //        {name: 'nombreusuario'},
        //        {name: 'ajusteimporte'},
        //        {name: 'ajustetiempo'},
        //        {name: 'periodo'},
        //    ])
        //});
        //
        //
        //
        //this.storeMostrarTrazasBaja = new Ext.data.GroupingStore({
        //    url: 'obtenerListadoAjustesOperacionesPersonasBaja',
        //    method: 'POST',
        //    sortInfo: {field: 'periodo', direction: "ASC"},
        //    groupField: 'periodo',
        //    reader: new Ext.data.JsonReader({
        //        root: "datos",
        //        totalProperty: "cantidad",
        //        id: "idajustesoperacionespersonabaja"
        //    }, [
        //        {name: 'idajustesoperacionespersonabaja'},
        //        {name: 'idhisvacacionespersonabaja'},
        //        {name: 'idpersonabaja'},
        //        {name: 'idpersona'},
        //        {name: 'idusuario'},
        //        {name: 'identidad'},
        //        {name: 'tipooperacion'},
        //        {name: 'fechaajuste'},
        //        {name: 'tipoaccion'},
        //        {name: 'tipoajuste'},
        //        {name: 'ajusteimporte'},
        //        {name: 'ajustetiempo'},
        //        {name: 'numeronomina'},
        //        {name: 'nombreusuario'},
        //        {name: 'periodo'},
        //    ])
        //});
        //
        //this.storeMostrarTrazasHisBaja = new Ext.data.GroupingStore({
        //    url: 'obtenerListadoAjustesOperacionesHisBaja',
        //    method: 'POST',
        //    sortInfo: {field: 'periodo', direction: "ASC"},
        //    groupField: 'periodo',
        //    reader: new Ext.data.JsonReader({
        //        root: "datos",
        //        totalProperty: "cantidad",
        //        id: "idajustesoperacionespersonabaja"
        //    }, [
        //        {name: 'idajustesoperacionespersonabaja'},
        //        {name: 'idhisvacacionespersonabaja'},
        //        {name: 'idpersona'},
        //        {name: 'idpersonabaja'},
        //        {name: 'idusuario'},
        //        {name: 'identidad'},
        //        {name: 'tipoajuste'},
        //        {name: 'fechaajuste'},
        //        {name: 'tipoaccion'},
        //        {name: 'ajusteimporte'},
        //        {name: 'ajustetiempo'},
        //        {name: 'tipooperacion'},
        //        {name: 'numeronomina'},
        //        {name: 'periodo'},
        //        {name: 'nombreapell'},
        //        {name: 'nombreusuario'},
        //        {name: 'denominacion'}
        //    ])
        //});
        this.CargarHistoricoSubMayor = function (idvacacionespersona) {
            this.storeVacHist.load({params: {limit: 15, start: 0, idvacacionespersona: idvacacionespersona}});
        };

        //Store del combobox de fórmulas.
        this.storeFormula = new Ext.data.Store({
            url: 'obtenerVariablesAcumLiq',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idvacacionesvariables"
            }, [
                {name: 'idvacacionesvariables'},
                {name: 'denominacion'},
                {name: 'idexpresionmatematica'},
                {name: 'expresionmatematica'},
            ])
        });

        //Store del listado de variables auxiliares de fórmulas.
        this.storeVariable = new Ext.data.Store({
            url: 'obtenerListadoVariablesAuxiliaresFormula',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idvariableauxiliarformula"
            }, [
                {name: 'idvariableauxiliarformula'},
                {name: 'denominacion'},
                {name: 'formaentrada'},
                {name: 'idconfreportescertificaciones'},
                {name: 'denomreporte'},
                {name: 'idvariablesconfreportescertificaciones'},
                {name: 'denomvarreporte'}
            ])
        });

        this.storePersonasDerechoSubmayor = new Ext.data.GroupingStore({
            url: 'obtenerListadoPersonasDerechoSubmayor',
            sortInfo: {field: 'ordenunico', direction: "ASC"},
            groupField: 'plantillanominal',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}
                ,
                {name: 'idvacacionespersona'}
                ,
                {name: 'idestructura'}
                ,
                {name: 'nombreapellidos'}
                ,
                {name: 'noidentidad'}
                ,
                {name: 'cargo'}
                ,
                {name: 'idcargo'}
                ,
                {name: 'plantillanominal'}
                ,
                {name: 'orden'}
                ,
                {name: 'ordenplantilla'}
                ,
                {name: 'idplantillanominal'}
                ,
                {name: 'saldoentiempo'}
                ,
                {name: 'ordenunico'}
                ,
                {name: 'iddatvacacionespersona'}
                ,
                {name: 'cdgocontable'}
                ,
                {name: 'ordencargo', type: 'float'}
            ])
        });

        this.indicadoresExpMat = new Array();

        this.CargarIndicadoresExpMat = function () {
            Ext.Ajax.request({
                url: 'cargarindicadores',
                method: 'POST',
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    for (var i = 0; i < respuesta.length; i++) {
                        var a = new Array();
                        a.push(respuesta[i].idindicador);
                        a.push(respuesta[i].indicador);
                        a.push(respuesta[i].tipo);
                        this.indicadoresExpMat.push(a);
                    }
                }.createDelegate(this)
            });
        };

        //this.CargarIndicadoresExpMat();

        this.stPeriodosPago = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        this.stPeriodosPagoDescCargasIyF = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        this.stPeriodosPagoDescSubmayor = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        this.stPeriodosPagoDescNomina = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        this.stPeriodosPagoCuadrarSubmayor = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        this.stPeriodosPagoCuadrarSubmayorBajas = new Ext.data.GroupingStore({
            url: 'obtenerPeriodosPagosSubmayor',
            sortInfo: {field: 'idmes', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idperiodo"},
                [
                    {name: 'idperiodo'},
                    {name: 'fechapago'},
                    {name: 'anno'},
                    {name: 'mes'},
                    {name: 'idmes'}
                ])
        });

        //Personas bajas
        this.storePersonasDerechoSubmayorBajas = new Ext.data.GroupingStore({
            url: 'obtenerListadoPersonasDerechoSubmayorBajas',
            sortInfo: {field: 'ordencargo', direction: "ASC"},
            groupField: 'plantillanominal',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [
                {name: 'idpersona'}
                ,
                {name: 'idvacacionespersona'}
                ,
                {name: 'idestructura'}
                ,
                {name: 'nombreapellidos'}
                ,
                {name: 'noidentidad'}
                ,
                {name: 'cargo'}
                ,
                {name: 'idcargo'}
                ,
                {name: 'plantillanominal'}
                ,
                {name: 'orden'}
                ,
                {name: 'ordenplantilla'}
                ,
                {name: 'idplantillanominal'}
                ,
                {name: 'saldoentiempo'}
                ,
                {name: 'iddatvacacionespersona'}
                ,
                {name: 'cdgocontable'}
                ,
                {name: 'ordencargo', type: 'float'}
            ])
        });

        this.storeVacBajas = new Ext.data.Store({
            url: 'obtenerDatosGeneralesSubVacacionesBajas',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idpersonabaja"
            }, [
                {name: 'idpersonabaja'},
                {name: 'tiempoacumuladoinicial'},
                {name: 'importeacumuladoinicial'},
                {name: 'tiempoacumulado'},
                {name: 'importeacumulado'},
                {name: 'fechainicio'},
                {name: 'fechafin'},
                {name: 'idpersona'},
                {name: 'identidad'},
                {name: 'cantidadoperaciones'}
            ])
        });

        //Store del listado de actualizaciones del submayor de vacaciones.
        this.storeVacHistBajas = new Ext.data.GroupingStore({
            url: 'obtenerListadoActualizacionesBajas',
            sortInfo: {field: 'periodo', direction: "DESC"},
            groupField: 'periodo',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idhisvacacionespersonabaja"
            }, [
                {name: 'idhisvacacionespersonabaja'},
                {name: 'idpersonabaja'},
                {name: 'idnomina'},
                {name: 'numeronomina'},
                {name: 'tipooperacion'},
                {name: 'fechaoperacion'},
                {name: 'tiempoacumulado'},
                {name: 'importeacumulado'},
                {name: 'saldoentiempo'},
                {name: 'saldoenimporte'},
                {name: 'promedioimporte'},
                {name: 'ajusteimporte'},
                {name: 'ajustetiempo'},
                {name: 'tipoajuste'},
                {name: 'periodo'}
            ])
        });

        //Store del listado de campos dias de la nomina serializada dado el periodo, para cuadrar el submayor
        this.stCamposDias = new Ext.data.GroupingStore({
            url: 'obtenerCamposDatNominasPorPeriodos',
            sortInfo: {field: 'idtiponomina', direction: "ASC"},
            groupField: 'tiponomina',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idestructurarmodelonomina"
            }, [
                {name: 'idestructurarmodelonomina'},
                {name: 'denominacion'},
                {name: 'idtiponomina'},
                {name: 'tiponomina'}
            ])
        });

        //Store del listado de campos importe de la nomina serializada dado el periodo, para cuadrar el submayor
        this.stCamposImporte = new Ext.data.GroupingStore({
            url: 'obtenerCamposDatNominasPorPeriodos',
            sortInfo: {field: 'idtiponomina', direction: "ASC"},
            groupField: 'tiponomina',
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad",
                id: "idestructurarmodelonomina"
            }, [
                {name: 'idestructurarmodelonomina'},
                {name: 'denominacion'},
                {name: 'idtiponomina'},
                {name: 'tiponomina'}
            ])
        });

    }
};

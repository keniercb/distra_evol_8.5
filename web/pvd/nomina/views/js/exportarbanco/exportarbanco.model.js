Ext.ns('Pvd.Nomina.Banco.ExportarBanco');

Pvd.Nomina.Banco.ExportarBanco.Modelo = {
    init: function () {

        this.stExportarBanco = new Ext.data.GroupingStore({
            url: 'obtenerperiododepagoexportado',
            groupField: 'denominacion',
            sortInfo: {field: 'denominacion', direction: "ASC"},
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    id: "idpersona"
                },
                [{name: 'idpersona'}
                    , {name: 'idplantillanominal'}
                    , {name: 'denominacion'}
                    , {name: 'nombreyapellidos'}
                    , {name: 'cod_tipid'}
                    , {name: 'cod_paexid'}
                    , {name: 'num_ideper'}
                    , {name: 'cta_mnac'}
                    , {name: 'importe_n'}
                    , {name: 'cta_mlc'}
                    , {name: 'importe_d'}
                    , {name: 'codtipoid'}
                    , {name: 'cdgocontable'}
            ]),
            listeners: {
                load: function (st) {
                    if (st.reader.jsonData.codigo == "NOCOLUMNAPAGOSALARIO") {
                        mostrarMensaje(3, 'No existen columnas configuradas para el pago salario.');
                    }
                }
            }
        });

        this.stBanco = new Ext.data.Store({
            url: '/pvd/persona/index.php/gestionarpersona/getBancos',
            reader: new Ext.data.JsonReader({
                    totalProperty: "quantity",
                    autoLoad: true,
                    root: "data",
                    id: "idbanco"
                },[
                    {name: 'idbanco'}, 
                    {name: 'nombre'},
                    {name: 'abreviatura'}
                ]),
            autoLoad: true  
        });

        this.stBilletesCUP = new Ext.data.Store({
            url: 'obtenerBilletesCUP',
            baseParams: {idfechascierre: -1, estado: 0},
            reader: new Ext.data.JsonReader({root: "datos", id: "idbillete"}, [
                {name: 'idbillete'},
                {name: 'billete'},
                {name: 'cantidadbillete'},
                {name: 'producto'}
            ])
        });

        this.stBilletesCUC = new Ext.data.Store({
            url: 'obtenerBilletesCUC',
            baseParams: {idfechascierre: -1, estado: 0},
            reader: new Ext.data.JsonReader({root: "datos", id: "idbillete"}, [
                {name: 'idbillete'},
                {name: 'billete'},
                {name: 'cantidadbillete'},
                {name: 'producto'}
            ])
        });

        this.stPersonasCaja = new Ext.data.GroupingStore({
            url: 'obtenerpersonascaja',
            groupField: 'denominacion',
            sortInfo: {field: 'denominacion', direction: "ASC"},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idpersona"
            }, [{name: 'idpersona'}
                , {name: 'idplantillanominal'}
                , {name: 'denominacion'}
                , {name: 'nombreyapellidos'}
                , {name: 'cod_tipid'}
                , {name: 'num_ideper'}
                , {name: 'importe_n'}
                , {name: 'importe_d'}
                , {name: 'cdgocontable'}
            ])
        });

        this.stFechasCierre = new Ext.data.GroupingStore({
            url: 'obtenerResumenesPeriodosPago',
            groupField: 'anno',
            sortInfo: {field: 'annoall', direction: "DESC"},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "id"
            }, [{name: 'idfechascierre'}
                , {name: 'fechacierre'}
                , {name: 'estado'}
                , {name: 'identidad'}
                , {name: 'anno'}
                , {name: 'annoall'}
                , {name: 'listadotipospagos'}
                , {name: 'cajeromontocup'}
                , {name: 'cajeromontocuc'}
                , {name: 'cajamontocup'}
                , {name: 'cajamontocuc'}
            ])
        });

        this.CargarParaExportarBanco = function (auxid, pidentidad, estado, idfechascierre) {
            //Cargando el grid de cajero
            this.stExportarBanco.removeAll();
            this.stExportarBanco.baseParams.idelaborarpagos = Ext.encode(auxid);
            this.stExportarBanco.baseParams.identidad = pidentidad;
            this.stExportarBanco.baseParams.estado = estado;
            this.stExportarBanco.baseParams.idfechascierre = Ext.encode(idfechascierre);
            this.stExportarBanco.load();

            //Cargando el grid de caja
            this.stPersonasCaja.removeAll();
            this.stPersonasCaja.baseParams.idelaborarpagos = Ext.encode(auxid);
            this.stPersonasCaja.baseParams.identidad = pidentidad;
            this.stPersonasCaja.baseParams.estado = estado;
            this.stPersonasCaja.baseParams.idfechascierre = Ext.encode(idfechascierre);
            this.stPersonasCaja.load();

            //Cargando el grid de desglose CUP
            this.stBilletesCUP.removeAll();
            this.stBilletesCUP.baseParams.arridelaborarpagos = Ext.encode(auxid);
            this.stBilletesCUP.baseParams.identidad = pidentidad;
            this.stBilletesCUP.baseParams.estado = estado;
            this.stBilletesCUP.baseParams.idfechascierre = Ext.encode(idfechascierre);
            this.stBilletesCUP.load();

            //Cargando el grid de desglose CUC
            this.stBilletesCUC.removeAll();
            this.stBilletesCUC.baseParams.arridelaborarpagos = Ext.encode(auxid);
            this.stBilletesCUC.baseParams.identidad = pidentidad;
            this.stBilletesCUC.baseParams.estado = estado;
            this.stBilletesCUC.baseParams.idfechascierre = Ext.encode(idfechascierre);
            this.stBilletesCUC.load();
        };
    }
};


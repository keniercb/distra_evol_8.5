Ext.ns('Pvd.Nomina.Confpagoxresultados');

Pvd.Nomina.Confpagoxresultados.Modelo = {
    init: function () {

        this.stExportarSBC = new Ext.data.GroupingStore({
            // url: 'cargarSalariosBaseCalculo',
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "iddatossbc"
                },
                [{name: 'iddatossbc'}
                    , {name: 'idpersona'}
                    , {name: 'ci'}
                    , {name: 'nombreyapellidos'}
                    , {name: 'sbc1'}
                    , {name: 'sbc2'}
                    , {name: 'sbc3'}
                    , {name: 'sbct'}
                    , {name: 'evalindividual'}
                    , {name: 'evalcolectiva'}
                    , {name: 'cpdt'}
                    , {name: 'ids'}
                    , {name: 'ctrt'}
                    , {name: 'area'}
                    , {name: 'idarea'}
                ]),
            sortInfo: {field: 'idarea', direction: "ASC"},
            groupField: 'area'
        });

        this.stPagosxresultados = new Ext.data.Store({
            url: 'obtenerConfpagosporresultados',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idpagoporresultado"},
                [{name: 'idarea'}
                    , {name: 'area'}
                    , {name: 'idpagoporresultado'}
                    , {name: 'referencia'}
                    , {name: 'denominacion'}
                    , {name: 'estado'},
                    , {name: 'idtipopago'}
                ]),
        });

        this.stIndicadores = new Ext.data.Store({
            url: 'ObtenerIndicadorespagosporresultadosid',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idindicadorespagoresultado"},
                [{name: 'idindicadorespagoresultado'}
                    , {name: 'denominacion'}
                    , {name: 'tipovalor'}
                    , {name: 'idreporteentrada'}
                    , {name: 'idreportesalida'}
                    , {name: 'idpagoporresultado'}
                    , {name: 'idestructuramodelonomina'}
                    , {name: 'denomcampoestmodnom'}
                    , {name: 'denomtiponominacampo'}
                    , {name: 'orden'}
                    , {name: 'entrada'}
                    , {name: 'salida'}
                    , {name: 'lugaresdecimales'}
                    , {name: 'obligatorio'}
                    , {name: 'recalculable'}
                    , {name: 'resultadofinal'}
                    , {name: 'sumadestajo'}
                ])
            //autoLoad:true
        });

        this.streeAreas = new Ext.tree.TreeLoader({
            url: 'obtenerArea'
            // baseParams: {id:0}
        });
        // this.streeAreas.load
        this.stArea = new Ext.data.Store({
            url: 'ObtenerCargosporareas',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idarea"},
                [{name: 'idarea'}
                    , {name: 'area'}
                    , {name: 'valor'}
                ])
            // autoLoad:true,
        });

        this.stArea = new Ext.data.GroupingStore({
            url: 'ObtenerCargosporareas',
            reader: new Ext.data.JsonReader({
                    root: "datos",
                    totalProperty: "cantidad",
                    id: "idplantillanominalcargo"
                },
                [
                    , {name: 'idplantillanominalcargo'}
                    , {name: 'idcargo'}
                    , {name: 'idplantillanominal'}
                    , {name: 'area'}
                    , {name: 'idarea'}
                    , {name: 'denominacion'}
                ]),
            sortInfo: {field: 'idarea', direction: "ASC"},
            groupField: 'area'
        });

        this.stAreaI = new Ext.data.GroupingStore({
            url: 'ObtenerCargosapagosporresultados',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idcargopagoresultado"},
                [{name: 'idcargopagoresultado'}
                    , {name: 'idcargo'}
                    , {name: 'idpagoporresultado'}
                    , {name: 'idarea'}
                    , {name: 'area'}
                    , {name: 'denominacion'}
                ]),
            sortInfo: {field: 'idarea', direction: "ASC"},
            groupField: 'area'
            // autoLoad:true,
        });

        this.stNomTipopago = new Ext.data.Store({
            url: 'obtenerTiposPago',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtipopago"},
                [{name: 'idtipopago'}
                    , {name: 'denominacion'}
                    , {name: 'referencia'}

                ]),
            autoLoad: true
        });

        this.stTipovalor = new Ext.data.SimpleStore({

            fields: ['idtipovalor', 'tipovalor'],
            data: [[1, 'Campos de la nómina'], [2, 'Reporte de entrada'], [3, 'Calculable']]

        });

        this.stEntrada = new Ext.data.GroupingStore({
            url: 'obtenerVariables',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [{name: 'idvariablesconfreportescertificaciones'}
                    , {name: 'denominacion'}
                    , {name: 'tipovalor'}
                    , {name: 'idnomencladorreferencia'}
                    , {name: 'nivelaplicarvalor'}
                    , {name: 'idconfreportescertificaciones'}
                    , {name: 'lugaresdecimales'}
                    , {name: 'tipovariable'}
                    , {name: 'plantilla'}
                ]),
            sortInfo: {field: 'idconfreportescertificaciones', direction: "ASC"},
            groupField: 'plantilla',
            autoLoad: true,
        });
        this.stSalida = new Ext.data.GroupingStore({
            url: 'obtenerVariables',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [{name: 'idvariablesconfreportescertificaciones'}
                    , {name: 'denominacion'}
                    , {name: 'tipovalor'}
                    , {name: 'idnomencladorreferencia'}
                    , {name: 'nivelaplicarvalor'}
                    , {name: 'idconfreportescertificaciones'}
                    , {name: 'lugaresdecimales'}
                    , {name: 'tipovariable'}
                    , {name: 'plantilla'}
                ]),
            sortInfo: {field: 'idconfreportescertificaciones', direction: "ASC"},
            groupField: 'plantilla',
            autoLoad: true,
        });

        this.CargarParaExportarSBC = function (auxid, pidentidad) {
            this.stExportarSBC.removeAll();
            this.stExportarSBC.load({params: {limit: 20, start: 0}});
        };

    }
};


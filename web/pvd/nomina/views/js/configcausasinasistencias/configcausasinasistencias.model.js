Ext.ns('Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias');

//Modelo de la vista del componente Configurar conceptos contables.
Pvd.Nomina.ReportesyCertificaciones.ConfigCausasInasistencias.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        //Store del listado de causas de inasistencias
        this.storeConfigCausasInasistencias = new Ext.data.GroupingStore({
            url: 'obtenerConfigCausasInasistencias',
            groupField: 'nombretiporeporte',
            sortInfo: {field: 'tiporeporte', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [
                    {name: 'idvariablesconfreportescertificaciones'},
                    {name: 'vartiporeportecertif'},
                    {name: 'tiporeporte'},
                    {name: 'nombretiporeporte'},
                    {name: 'campo'},
                    {name: 'horasdias'},
                    {name: 'deresultados'},
                ])
        });

        //Store del listado de reportes ausencias
        this.storeReportes = new Ext.data.GroupingStore({
            url: 'obtenerReportesAusencias',
            groupField: 'tiporeporte',
            sortInfo: {field: 'tiporeporte', direction: "DESC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idvariablesconfreportescertificaciones"},
                [
                    {name: 'idvariablesconfreportescertificaciones'},
                    {name: 'idconfreportescertificaciones'},
                    {name: 'tiporeporte'},
                    {name: 'variabletiporeporte'}
                ])
        });

        //Store del listado de causas asistencias
        this.storeCausasAusencias = new Ext.data.Store({
            url: 'obtenerCausasAusencias',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idcausaausencia"},
                [
                    {name: 'idcausaausencia'},
                    {name: 'denominacion'},
                    {name: 'horasdias'},
                ])
        });

        //Store del listado de indicadores de evaluaciones
        this.storeIndicadoresEvaluaciones = new Ext.data.GroupingStore({
            url: 'obtenerIndicadoresEvaluaciones',
            groupField: 'nombreplantilla',
            sortInfo: {field: 'orden', direction: "ASC"},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "orden"},
                [
                    {name: 'idplanilla'},
                    {name: 'nombreplantilla'},
                    {name: 'idindicador'},
                    {name: 'indicador'},
                    {name: 'denompadre'},
                    {name: 'orden'}
                ])
        });

        //Store del listado de indicadores de talleres
        this.storeIndicadoresTalleres = new Ext.data.Store({
            url: 'obtenerIndicadoresTalleres',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idindicador"},
                [
                    {name: 'idindicador'},
                    {name: 'denominacion'}
                ])
        });

        //Store del combo de modo de seleccion de las personas.
        this.storeHorasDias = new Ext.data.SimpleStore({
            fields: [
                {name: 'horasdias'}
                ,
                {name: 'denomhorasdias'}
            ],
            data: [
                [1, 'Horas'],
                [2, 'Dias'],
                [3, 'Mes Inicial']
            ]
        });
    }
};
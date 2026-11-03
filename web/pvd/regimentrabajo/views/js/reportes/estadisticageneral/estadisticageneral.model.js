Ext.ns('Pvd.ControlAsistencia.EstadisticaGeneral');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.EstadisticaGeneral.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        
        this.stListado = new Ext.data.GroupingStore({
            url: 'getasistencia',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idestructura'},{name:'estructura'},{name:'porplantilla'},{name:'cubierto'},{name:'presente'},
                    {name:'totalfuera'},{name:'entidad'}]
            )
        });

        this.stListadonominal = new Ext.data.GroupingStore({
            url: 'getReporteNominal',
            remoteGroup: true,
            remoteSort: true,
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'},
                    {name:'denomentidad'},{name:'denomcargo'},{name:'denomarea'},
                    {name: 'fecharegistro'},{name:'denominacion'},{name:'idcausa'},{name:'observacion'},{name:'fechaentrada'},
                    {name:'fechahoraentrada'},{name:'fechasalida'},{name:'fechahorasalida'},{name:'fdesde'},{name:'fhasta'}
                    ,{name:'idpersonacontrola'},{name:'personacontrola'},{name:'idpersonamodifica'},{name:'personamodifica'}
                    ,{name:'idpersonacertifica'},{name:'personacertifica'},{name:'hrsdescontadas'},{name:'agrupador'}]
            ),
            sortInfo:{field: 'agrupador', direction: "ASC"},
            groupField:'agrupador'
        });

        this.recQrElement = new Ext.data.Record.create(
            {name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'},
            {name:'denomentidad'},{name:'denomcargo'},{name:'denomarea'},
            {name: 'fecharegistro'},{name:'causa'},{name:'idcausa'},{name:'observacion'},{name:'fechaentrada'},
            {name:'fechahoraentrada'},{name:'fechasalida'},{name:'fechahorasalida'},{name:'fdesde'},{name:'fhasta'}
            ,{name:'idpersonacontrola'},{name:'personacontrola'},{name:'idpersonamodifica'},{name:'personamodifica'}
            ,{name:'idpersonacertifica'},{name:'personacertifica'},{name:'hrsdescontadas'},{name:'agrupador'}
        );

        this.stlistadoCausas = new Ext.data.Store({
            url: 'getCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'},{name:'abreviatura'},{name:'color'}]
            )
        });

        this.storeTipografica = new Ext.data.SimpleStore({
            fields: ['idtipo','denominacion'],
            data : [[1,'Real vs. Presentes'],[2,'Presentes vs. Ausentes'],[3,'Causas de ausencia']/*,[4,'Tardanza media']*/]
        });

        this.reporte = [
            [1,'Estructura'],
            [2,'Categoría ocupacional'],
            [3,'Fecha'],
            //[4,'Género']
        ]

        this.storereporte = new Ext.data.SimpleStore({
            fields:[{name:'idreporte'},{name:'denominacion'}]
        });
        this.storereporte.loadData(this.reporte);

        this.agrupador = [
            [1,'Área'],
            [2,'Causa'],
            [3,'Fecha'],
        ]

        this.storeagrupador = new Ext.data.SimpleStore({
            fields:[{name:'idagrupador'},{name:'denominacion'}]
        });
        this.storeagrupador.loadData(this.agrupador);
    }

};

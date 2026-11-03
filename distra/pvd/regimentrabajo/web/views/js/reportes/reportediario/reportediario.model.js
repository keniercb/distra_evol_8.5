Ext.ns('Pvd.ControlAsistencia.ReporteDiario');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.ReporteDiario.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        
        this.stListado = new Ext.data.GroupingStore({
            url: 'getReporte',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'numid'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},{name:'idarea'},
                    {name:'denomarea'},{name:'denomcargo'},{name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechahorasalida'},
                    {name:'fecharegistro'},{name:'denomentidad'},{name:'causa'},{name:'idcausa'},{name:'horasextras'}]
            ),
            sortInfo:{field: 'causa', direction: "ASC"},
            groupField:'causa'
        });

        this.storeCausasAusencia = new Ext.data.JsonStore({
            url: 'cargacausasausencia',
            root: 'datos',
            fields:['idcausa','denominacion']
        });

        this.storeTurnoTrabajo = new Ext.data.JsonStore({
            url: 'cargaturnodetrabajo',
            root: 'datos',
            fields:['idturnotrabajo','denominacion']
        });
    }

};

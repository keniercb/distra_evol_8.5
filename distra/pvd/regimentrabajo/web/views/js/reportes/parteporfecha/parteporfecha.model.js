Ext.ns('Pvd.ControlAsistencia.PartePorFecha');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.PartePorFecha.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        
        this.stListado = new Ext.data.GroupingStore({
            remoteGroup: true,
            remoteSort: true,
            url: 'getReporte',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'idasistencia'},{name:'numid'},{name:'nombreapellidos'},{name:'fechaentrada'}, {name:'fechahoraentrada'},{name:'idarea'},
                    {name:'denomarea'},{name:'denomcargo'},{name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechasalida'},{name:'fechahorasalida'},
                    {name:'fecharegistro'},{name:'denomentidad'},{name:'causa'},{name:'idcausa'},{name:'horasextras'}
                    ,{name:'idpersonacontrola'},{name:'personacontrola'},{name:'idpersonamodifica'},{name:'personamodifica'}
                    ,{name:'idpersonacertifica'},{name:'personacertifica'},{name:'agrupador'}]
            ),
            sortInfo:{field: 'agrupador', direction: "ASC"},
            groupField:'agrupador'
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

        this.agrupador = [
            [1,'Causa'],
            [2,'Área']
        ]

        this.storeagrupador = new Ext.data.SimpleStore({
            fields:[{name:'idagrupador'},{name:'denominacion'}]
        });
        this.storeagrupador.loadData(this.agrupador);
    }

};

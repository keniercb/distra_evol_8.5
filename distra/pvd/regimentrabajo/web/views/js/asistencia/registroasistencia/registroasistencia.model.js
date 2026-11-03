Ext.ns('Pvd.ControlAsistencia.Registroasistencia');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.Registroasistencia.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        this.stListadoResumen = new Ext.data.GroupingStore({
            remoteGroup:true,
            remoteSort: true,
            url: 'getAsistencia',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},
                    {name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechahorasalida'},
                    {name:'fecharegistro'},{name:'causa'}, {name:'color'}, {name:'horasextras'}, {name:'idpersonacontrola'},
                    {name:'personacontrola'}, {name:'idpersonamodifica'}, {name:'personamodifica'},
                    {name:'dia'}, {name:'mes'},{name:'observacion'}, {name:'actualizado'}, {name:'finsemana'}]
            ),
            sortInfo:{field: 'fecharegistro', direction: "ASC"},
            groupField:'mes'
        });

        this.meses = [
            [1,'Enero'],
            [2,'Febrero'],
            [3,'Marzo'],
            [4,'Abril'],
            [5,'Mayo'],
            [6,'Junio'],
            [7,'Julio'],
            [8,'Agosto'],
            [9,'Septiembre'],
            [10,'Octubre'],
            [11,'Noviembre'],
            [12,'Diciembre'],
        ]

        this.storeMeses = new Ext.data.SimpleStore({
            fields:[{name:'idmes'},{name:'denominacion'}]
        });
        this.storeMeses.loadData(this.meses);


        this.storeYear = new Ext.data.SimpleStore({
            fields:[{name:'idyear'},{name:'denominacion'}]
        });



    }

};

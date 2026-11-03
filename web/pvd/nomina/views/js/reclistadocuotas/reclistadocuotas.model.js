Ext.ns('Pvd.Nomina.Recuperacion.Reclistadocuotas');
Pvd.Nomina.Recuperacion.Reclistadocuotas.Modelo = {
    init: function() {

        this.stPersonasAfiliadas = new Ext.data.GroupingStore({
        });

        this.stFechasCierre = new Ext.data.GroupingStore({
            url: 'obtenerFechasCierre',
            groupField:'anno',
            sortInfo:{field: 'fechacierre', direction: "DESC"},
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "id"
            }, [ {name: 'idfechascierre'}
                ,{name: 'fechacierre'}
                ,{name: 'estado'}
                ,{name: 'identidad'}
                ,{name: 'anno'}
            ])
        });

        this.stAfiliaciones = new Ext.data.Store({
            url: 'obtenerAfiliaciones',
            reader:new Ext.data.JsonReader({
                    root: "datos",
                    id: "idconfafiliacion" },
                [
                    {name: 'idconfafiliacion'},
                    {name: 'idafiliacion'},
                    {name: 'denominacion'}
                ])
        });
    }
};
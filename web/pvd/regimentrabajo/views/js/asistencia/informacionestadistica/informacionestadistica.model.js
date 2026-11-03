Ext.ns('Pvd.ControlAsistencia.Informacionestadistica');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.Informacionestadistica.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stListadoPersonas = new Ext.data.GroupingStore({
            url: 'getpersonasasistencia',
            pruneModifiedRecords:true,
                reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},
                 {name:'idvariablesconfreportescertificaciones'},{name:'fdesde'},{name:'fhasta'},{name:'hrsdescontadas'},{name:'fechahorasalida'},{name:'fecharegistro'}]
            ),
            sortInfo:{field: 'nombreapellidos', direction: "ASC"},
            groupField:'idpersona'
        });

        this.stListadoApa = new Ext.data.GroupingStore({
            url: 'getapa',
                reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'nombreapellidos'}]
            ),
            sortInfo:{field: 'nombreapellidos', direction: "ASC"},
            groupField:'idpersona'
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
            [11,'Novienbre'],
            [12,'Diciembre'],
        ]

        this.storeMeses = new Ext.data.SimpleStore({
            fields:[{name:'idmes'},{name:'denominacion'}]
        });
        this.storeMeses.loadData(this.meses);


        this.storeYear = new Ext.data.SimpleStore({
            fields:[{name:'idyear'},{name:'denominacion'}]
        });

        this.stTregimen = new Ext.data.Store({
            url: '/pvd/regimentrabajo/index.php/informacionestadistica/getReporte',
            reader:  new Ext.data.JsonReader(
                {totalProperty: 'quantity', root: 'data', id: 'idreporte'},
                [
                    {name: 'idreporte'}
                    ,{name: 'denominacion'}
                    ,{name: 'fdesde'}
                    ,{name: 'fhasta'}
                    ,{name: 'descripcion'}


                ]
            )

        });

        this.stinfoestadistica = new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({ url: "/pvd/regimentrabajo/index.php/informacionestadistica/getIndicadoresValores", timeout: 120000 }),
            reader:new Ext.data.JsonReader({totalProperty: 'cantidad', root: 'datos', id: 'idindicador'},
                [
                    {name: 'idindicador'}
                    ,{name: 'denominacion'}
                    ,{name: 'fdesde'}
                    ,{name: 'fhasta'}
                    ,{name: 'unidadmedida'}
                    ,{name: 'datos'}
                    ,{name: 'orden'}
                ]),
            sortInfo :{field: "orden", direction: "ASC"}
        });

    }

};

Ext.ns('Pvd.Nomina.Cierre');

Pvd.Nomina.Cierre.Modelo = {
    init: function(idioma) {
        var pagingSize = 100;

     	this.stCuentasNomina = new Ext.data.GroupingStore({
            url: 'obtenerDatosCuentas',//metodo de la controladora 
            sortInfo: {field: 'denominacion', direction: "ASC"},
            groupField: 'denominacion',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos" }, 
                [
                    {name: 'idperiodo'},
                    {name: 'cuentas'},
                    {name: 'contab'} ,
                    {name: 'identidad'} ,
                    {name: 'estado'},
                    {name: 'diferencia'},
                    {name: 'denominacion'},
                    {name: 'nomina'} 
            ])
        });

        this.stPeriodoPago = new Ext.data.GroupingStore({
            url: 'periodosPago',
            sortInfo: {field: 'anyo', direction: "DESC"},
            groupField: 'anyo',
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad: true,
                    root: "datos",
                },
                [   {name:'identidad'},
                    {name: 'fechainicioperiodo'},
                    {name: 'fechafinperiodo'},
                    {name: 'anyo'},
                    {name: 'estado'},
                    {name: 'idestado'},
                    {name: 'periodopago'},
                ])
        });
           
    
        this.stPersonal = new Ext.data.GroupingStore({
            url: 'personal',//metodo de la controladora
            sortInfo: {field:'orden', direction: 'ASC'},
                groupField: 'denomorden',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos" },
                [
                    ,{name: 'orden'}
                    ,{name: 'denomorden'}
                    ,{name: 'nombre'}
                                                                                                                                                                                                                                                                                                                                 
            ])
        }); 

     
    }
};






Ext.ns('Pvd.Nomina.Gestionarantiguedad');

//Modelo de la vista del componente Gestionar cargos ocupados.
Pvd.Nomina.Gestionarantiguedad.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        //Store del listado de cargos ocupados.
        this.stcbCajaCajero = new Ext.data.Store({
           // url: 'obtenerTipoPago',
            reader:new Ext.data.JsonReader({
                    totalProperty: "cantidad",
                    autoLoad:true,
                    root: "datos",
                    id: "idcajacajero" },
                [{name: 'idcajacajero'}
                    ,{name: 'denominacion'}
                ])
        });
        //this.stcbCajaCajero.load();

        this.stPersonas = new Ext.data.GroupingStore({
            url: 'getPersonaentidad',
            groupField:'nombreplantilla',
            sortInfo:{field: 'nombreplantilla', direction: "ASC"},
            reader:new Ext.data.JsonReader({
                    totalProperty: "quantity",
                    root: "data",
                    id: "idpersona" },
                [{name: 'idpersona'}
                    ,{name: 'nombreapellidos'}
                    ,{name: 'sexo'}
                    ,{name: 'numid'}
                    ,{name: 'entidad'}
                    ,{name: 'fechacert'}
                    ,{name: 'identidad'}
                    ,{name: 'valor'}
                    ,{name: 'cargo'}
                    ,{name: 'mesesservicio'}
                    ,{name: 'annosserventidad'}
                    ,{name: 'antuguedad'}
                    ,{name:'nombreplantilla'}
                    ,{name:'reporteantiguedad'}

                ])
        });



    }

};


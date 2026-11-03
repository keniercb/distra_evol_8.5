Ext.ns('Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas');

//Modelo de la vista del componente Gestionar submayor de vacaciones. 
Pvd.Nomina.Configuraciones.ConfigNivelesActividadesEconomicas.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        //Store de los datos del submayor de vacaciones.
        this.storeTipoNomina = new Ext.data.Store({
            url: 'obtenerTiposDeNominas',
            reader: new Ext.data.JsonReader({root: "datos", totalProperty: "cantidad", id: "idtiponomina"},
                [
                    {name: 'idtiponomina'},
                    {name: 'denominacion'},
                ])
        });

        this.storeNivelActividadEconom = new Ext.data.GroupingStore({
            url: 'obtenerConfiguracionNivelesAE',
            //groupField: 'plantillanominal',
            //sortInfo: {field: 'idconfiguracionnivelae', direction: "ASC"},
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idconfiguracionnivelae"
            }, [
                {name: 'idconfiguracionnivelae'},
                {name: 'idtiponomina'},
                {name: 'idnivelactividadeconomica'},
                {name: 'tiponomina'},
                {name: 'nivelactividadeconomica'}
            ])
        });


    }
};

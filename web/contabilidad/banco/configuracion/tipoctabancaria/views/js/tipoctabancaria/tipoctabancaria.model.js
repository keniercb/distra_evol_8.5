//Empaquetando el componente tipo cta bancaria.
Ext.ns('Banco.Tipoctabancaria');

//Model del componente Tipo cta bancaria.
Banco.Tipoctabancaria.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        // Store para cargar los tipos de cuanta bancaria  del GridPanel
        this.stTipoCtaB = new Ext.data.GroupingStore({
            url: 'cargargridtipocuenta',
            //	method : 'POST',
            groupField: 'idestructuracomun',
            sortInfo: {
                field: 'codigo',
                direction: 'ASC'
            }, // DESC
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "tipocuenta",
                id: "idtipocuentabancaria"
            }, [{
                    name: 'idtipocuenta',
                    mapping: 'idtipocuentabancaria',
                    type: 'string'
                }, {
                    name: 'codigo',
                    mapping: 'codigo',
                    type: 'string'
                }, {
                    name: 'denominacion',
                    mapping: 'descripcion',
                    type: 'string'
                }, {
                    name: 'version'
                }, {
                    name: 'idestructuracomun',
                    type: 'string'
                }, {
                    name: 'rectora'
                }, {
                    name: 'entidad'
                },
                {
                    name: 'libre'
                }])
        });
        // FIN DEL  Store

        // Store para cargar los tipos de cuanta bancaria   del  boton Heredar 
        this.stHeredar = new Ext.data.Store({
            url: 'cargarheredar',
            method: 'POST',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad_filas",
                root: "tipocuenta",
                id: "idtipocuentabancaria"
            }, [{
                    name: 'idtipocuenta',
                    mapping: 'idtipocuentabancaria',
                    type: 'string'
                }, {
                    name: 'codigo',
                    mapping: 'codigo',
                    type: 'string'
                }, {
                    name: 'denominacion',
                    mapping: 'descripcion',
                    type: 'string'
                }, {
                    name: 'version'
                }, {
                    name: 'idestructuracomun',
                    type: 'string'
                }, {
                    name: 'rectora'
                }, {
                    name: 'entidad'
                }]),
            sortInfo: {
                field: 'codigo',
                direction: 'ASC'
            }
        });
        // FIN DEL  Store		
    }
};

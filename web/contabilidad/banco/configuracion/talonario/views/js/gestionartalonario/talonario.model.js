//Empaquetando el componente Talonario.
Ext.ns('Banco.Talonario');

//Model del componente Documento.
Banco.Talonario.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        // Store para cargar los tipos de cuanta bancaria  del GridPanel
        this.stTalonario = new Ext.data.GroupingStore({
            url: 'cargartalonarios',
            groupField: 'text',
            sortInfo: {
                field: 'documento',
                direction: 'ASC'
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cant",
                root: "datos"
            }, [{
                    name: 'idtalonario'
                }, {
                    name: 'orden'
                }, {
                    name: 'numerocta'
                }, {
                    name: 'nombrecta'
                }, {
                    name: 'documento'
                }, {
                    name: 'numeroinicio'
                }, {
                    name: 'numerofin'
                }, {
                    name: 'text'
                }, {
                    name: 'estado'
                }, {
                    name: 'imgestado'
                }, {
                    name: 'disponible'
                }, {
                    name: 'idcuentabancaria'
                }, {
                    name: 'idparteformato'
                }, {
                    name: 'tipodocumentos'
                }])
        });

        //store para cargar el formato del talonario
        this.stformato = new Ext.data.Store({
            url: 'cargarformato',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                    name: 'idparteformato'
                }, {
                    name: 'nombre'
                }, {
                    name: 'longitud'
                }]),
            sortInfo: {
                field: 'nombre',
                direction: 'ASC'
            }
        });

        //carga las ctas bancarias
        this.stctaBancaria = new Ext.data.Store({
            url: 'cargarCuentasBancarias',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                    name: 'idcuentabancaria',
                    type: 'string'
                }, {
                    name: 'nombrecuentabancaria',
                    type: 'string'
                }]),
            sortInfo: {
                field: 'nombrecuentabancaria',
                direction: 'ASC'
            }
        });

        //carga los tipo de documento
        this.sttipodoc = new Ext.data.Store({
            url: 'cargargridtipodocumento',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idbanco',
                totalProperty: 'total'
            }, [{
                    name: 'idtipodoctalonario',
                    type: 'string'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'marcado',
                    type: 'boolean'
                }])
        });

    }

};

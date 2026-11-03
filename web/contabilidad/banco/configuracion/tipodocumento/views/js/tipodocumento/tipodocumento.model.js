//Empaquetando el componente tipo documento.
Ext.ns('Banco.Documento');

//Model del componente Documento.
Banco.Documento.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {
        // Store para cargar los instrumentos de pago del GridPanel
        this.stTipoDocumentos = new Ext.data.Store({
            url: 'cargartiposdocsBanco',
            sortInfo: {
                field: 'denominacion',
                direction: 'ASC'
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "tipodoc"
            }, [{
                    name: 'idtipodoctalonario',
                    type: 'string'
                },
                {
                    name: 'iddoc',
                    mapping: 'idtipodocumento',
                    type: 'string'
                },
                {
                    name: 'codigo'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'importemin'
                },
                {
                    name: 'importemax'
                },
                {
                    name: 'vigencia',
                    mapping: 'diasvigencia'
                },
                {
                    name: 'cobro',
                    type: 'boolean'
                },
                {
                    name: 'pago',
                    type: 'boolean'
                },
                {
                    name: 'talonariocobro',
                    type: 'boolean'
                },
                {
                    name: 'talonario',
                    mapping: 'talonariopago',
                    type: 'boolean'
                },
                {
                    name: 'asociado',
                    type: 'boolean'
                },
                {
                    name: 'importecertifica'
                },
                {
                    name: 'certifica',
                    type: 'boolean'
                }
            ])
        });

        // Store y ComboBox para los instrumentos de pago configurados para Banco
        this.stCbTipodoc = new Ext.data.Store({
            url: 'cargartiposdocsAll',
            reader: new Ext.data.JsonReader({
                root: 'tipodoc',
                totalProperty: 'cantidad'
            },
            [{
                    name: 'iddoc',
                    type: 'string'
                }, {
                    name: 'denominacion'
                }]),
            sortInfo: {
                field: 'denominacion',
                direction: 'ASC'
            }
        });

    }
};

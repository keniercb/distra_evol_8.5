Ext.ns('Caja.Operaciones.Arqueo');
Caja.Operaciones.Arqueo.Model = {
    init: function () {
        this.stArqueos = new Ext.data.JsonStore({
            url: 'cargararqueos',
            autoLoad: false,
            root: 'datos',
            totalProperty: 'cant',
            fields: [
                {
                    name: 'idarqueo'
                },
                {
                    name: 'iddocumento'
                },
                {
                    name: 'diferenciafaltante'
                },
                {
                    name: 'diferenciasobrante'
                },
                {
                    name: 'importemo'
                },
                {
                    name: 'importemb'
                }, {
                    name: 'importecheques'
                },
                {
                    name: 'numero'
                },
                {
                    name: 'cierre'
                }, {
                    name: 'idcierre'
                },
                {
                    name: 'fecha'
                },
                {
                    name: 'comentario'
                },
                {
                    name: 'nomEstado'
                },
                {
                    name: 'idestado'
                },
                {
                    name: 'idrealizadopor'
                },
                {
                    name: 'personaexterna'
                },
                {
                    name: 'namerealizadopor'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'idcajero'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'cargainicial'
                },
                {
                    name: 'numcomprobante'
                },
                {
                    name: 'showCmp'
                },
                {
                    name: 'arrayIdCmp'
                }
            ]

        });

        var dataEstados = [[8, 'Guardado'], [5, 'Confirmado'], [6, 'Posteado'], [7, 'Cancelado']];

        this.stEstado = new Ext.data.SimpleStore({
            fields: ['idestado', 'nombre']
        });
        this.stEstado.loadData(dataEstados);

        this.stBilletes = new Ext.data.Store({
            url: 'obtenerDesgloseBilletes',
            reader: new Ext.data.JsonReader({
                //root: 'campos'
            }, [{
                name: 'cantidad',
                type: 'int'
            }, {
                name: 'iddesglosemoneda',
                mapping: 'iddezglozemoneda'
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'valor',
                type: 'float',
                mapping: 'valor'
            }, {
                name: 'importe'
            }, {
                name: 'idcantidaddenominacion'//Se usa para modificar
            }
            ]),
            sortInfo: {field: 'valor', direction: "DESC"}
        });

        this.stSellos = new Ext.data.Store({
            url: 'obtenerDesgloseSellos',
            reader: new Ext.data.JsonReader({
                //root: 'campos'
            }, [{
                name: 'cantidad',
                type: 'int'
            }, {
                name: 'idsellos',
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'valor',
                type: 'float',
                mapping: 'importe'
            }, {
                name: 'importemo'
            }, {
                name: 'idcantidaddenominacionsello'//Se usa para modificar
            }
            ]),
            sortInfo: {field: 'valor', direction: "DESC"}
        });

        this.stMonedas = new Ext.data.Store({
            url: 'obtenerDesgloseMonedas',
            reader: new Ext.data.JsonReader({
                //root: 'campos'
            }, [{
                name: 'cantidad',
                type: 'int'
            }, {
                name: 'iddesglosemoneda',
                mapping: 'iddezglozemoneda'
            }, {
                name: 'denominacion',
                mapping: 'denominacion'
            }, {
                name: 'valor',
                type: 'float',
                mapping: 'valor'
            }, {
                name: 'importe'
            }, {
                name: 'idcantidaddenominacion'//Se usa para modificar
            }
            ]),
            sortInfo: {field: 'valor', direction: "DESC"}
        });

        this.stInstrumentos = new Ext.data.GroupingStore({
            url: 'cargarInstrumentosporArqueo',
            reader: new Ext.data.JsonReader({
                //root: 'instrumentos'
            }, [{
                name: 'iddocumento'
            }, {
                name: 'iddocumentoarqueo'
            }, {
                name: 'numero', mapping: 'numero'
            }, {
                name: 'fecha'
            }, {
                name: 'importe',
                mapping: 'importemo',
                type: 'float'
            }, {
                name: 'nomtipodocumento'
            }, {
                name: 'comentario'
            }, {
                name: 'numDocMov'
            }, {
                name: 'numero_mov', type: 'int'
            }
            ]),
            // groupField: 'numDocMov',
            groupField: 'numero_mov',
            sortInfo: {field: 'importe', direction: "ASC"}
        });

        this.stDocumentos = new Ext.data.Store({
            url: 'cargarDocumentos',
            reader: new Ext.data.JsonReader({
                total: 'total',
                root: 'datos'
            }, [{
                name: 'numero'
            }, {
                name: 'fecha'
            }, {
                name: 'idDoc'
            }, {
                name: 'importe'
            }, {
                name: 'diferencia'
            }, {
                name: 'tipodocumento'
            }])
        });

        this.stCajero = new Ext.data.Store({
            url: 'GetDatosUser',
            autoLoad: false,
            reader: new Ext.data.JsonReader({}, [{
                name: 'idpersona'
            }, {
                name: 'fullname'
            }
            ])
        });

        this.stCierre = new Ext.data.SimpleStore({
            fields: ['cierre', 'val'],
            data: [
                ['1', 'Si'],
                ['0', 'No']
            ]
        });

        this.stMotivo = new Ext.data.Store({
            url: 'motivoCancelacion',
            method: 'POST',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmotivocancelacion',
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ])
        });

        this.stOperacion = new Ext.data.Store({
            url: 'loadDataCheques',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idRecord'
            }, [{
                name: 'idDoc'
            }, {
                name: 'numero'
            }, {
                name: 'dia'
            }, {
                name: 'tipoinstrumento'
            }, {
                name: 'importe'
            }, {
                name: 'idmovimiento'
            }, {
                name: 'descripcion'
            }, {
                name: 'cliente'
            }
            ])
        });
    }
};
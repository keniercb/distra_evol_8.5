//Empaquetando el componente Ctabancaria.
Ext.ns('Banco.Ctabancaria');

//Controller del componente Ctabancaria.
Banco.Ctabancaria.Model = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        // Store para cargar las ctas bancarias en el  grid de la ventana principal
        this.stCtabancaria = new Ext.data.GroupingStore({
            url: 'cargargridcuentas',
            groupField: 'idestructuracomun',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            },
            [{
                    name: 'idcuentabancaria',
                    type: 'string'
                }, {
                    name: 'nombrecuentabancaria'
                }, {
                    name: 'nrocuenta'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'sobregiro',
                    type: 'string'
                }, {
                    name: 'nombremoneda'
                }, {
                    name: 'codigoiso'
                }, {
                    name: 'idbanco',
                    type: 'string'
                }, {
                    name: 'nombrebanco',
                    type: 'string'
                }, {
                    name: 'idsucursal',
                    type: 'string'
                }, {
                    name: 'nombreidsucursal',
                    type: 'string'
                }, {
                    name: 'periodo',
                    type: 'string'
                }, {
                    name: 'aperturado'
                }, {
                    name: 'fechaapertura'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idlog'//idlog es el  atributo  que  me indica el  id de la entidad autenticada
                }, {
                    name: 'entidad'
                }, {
                    name: 'saldoinicialmo'
                }, {
                    name: 'saldoinicialmb'
                }, {
                    name: 'saldoenbancomo'
                }, {
                    name: 'saldoenbancomb'
                }, {
                    name: 'saldoinicialbancomo'
                }, {
                    name: 'saldoactualctacontable'
                }, {
                    name: 'idtipocuentabancaria'
                }, {
                    name: 'nombretipocuentabancaria'
                }, {
                    name: 'idcuenta',
                    type: 'string'
                }, {
                    name: 'cuentascontables'
                }, {
                    name: 'unidadcontable'
                }, {
                    name: 'idsobregirobanc',
                    type: 'string'
                }, {
                    name: 'idcuentasg',
                    type: 'string'
                }, {
                    name: 'limite'
                },
                {
                    name: 'contrato'
                }, {
                    name: 'cerrada'
                }, {
                    name: 'rectora'
                }, {
                    name: 'fechaincio'
                }, {
                    name: 'fechafin'
                }, {
                    name: 'disponibilidad'
                },
                {
                    name: 'activada'
                },
                {
                    name: 'permitirsobregiro'
                }
            ]),
            sortInfo: {
                field: 'fechaapertura',
                direction: "ASC"
            }
        });
        // Store  para unidades contables (usuarias) del tab en pesta�a 0
        this.stUnidadesusuarias = new Ext.data.Store({
            url: 'cargargridunidadesusuariasporcuenta',
            baseParams: {
                idcuentabancaria: 0
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idRecord',
                totalProperty: 'cant'
            },
            [{
                    name: 'idestructura'
                }, {
                    name: 'codigo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'abreviatura'
                }]),
            sortInfo: {
                field: 'codigo',
                direction: 'ASC'
            }
        });

        // Store  para estados de cuenta del tab en pesta�a 1
        this.stEstadocta = new Ext.data.Store({
            url: 'cargargridestadocuenta',
            baseParams: {
                idcuentabancaria: 0
            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idRecord',
                totalProperty: 'cant'
            },
            [{
                    name: 'idestadodecuenta'
                }, {
                    name: 'nroestado'
                }, {
                    name: 'fecha'
                }, {
                    name: 'saldoinicialmo'
                }, {
                    name: 'saldofinalmo',
                    type: 'float'
                }, {
                    name: 'contabilizado'
                }]),
            sortInfo: {
                field: 'fecha',
                direction: 'ASC'
            }
        });

        // Store  para  cargar las operaciones efectuadas del tab en pesta�a 2
        this.stOperaciones = new Ext.data.Store({
            url: 'cargargridoperacionesefectuadas',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idRecord',
                totalProperty: 'cant'
            },
            [{
                    name: 'iddocumento'
                }, {
                    name: 'numerodocumento'
                },
                {
                    name: 'DenomTipoDoc'
                }, {
                    name: 'comentario'
                },
                {
                    name: 'fecharecepcion'
                }, {
                    name: 'importemo'
                },
                {
                    name: 'nombretipomovimiento'
                }]),
            sortInfo: {
                field: 'fecharecepcion',
                direction: 'ASC'
            }
        });

        // Store  para los tipos de cta bancaria configurados para Banco (campo cbTipocuenta)
        this.stTipocuenta = new Ext.data.Store({
            url: 'cargartipocuenta',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cant'
            },
            [{
                    name: 'idtipocuenta',
                    mapping: 'idtipocuentabancaria'
                }, {
                    name: 'denom',
                    mapping: 'descripcion'
                }]),
            sortInfo: {
                field: 'denom',
                direction: 'ASC'
            }
        });

        // Store  para moneda de cta bancaria configurados para Banco (campo cbMoneda)
        this.stMoneda = new Ext.data.Store({
            url: 'cargarcombomoneda',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmoneda',
                totalProperty: 'cant'
            },
            [{
                    name: 'idmoneda',
                    type: 'string'
                }, {
                    name: 'nombremoneda'
                }, {
                    name: 'codigoiso'
                }, {
                    name: 'idmonedaentidad',
                    type: 'string'
                }, {
                    name: 'idtasa'
                }])
        });

        // Store  para bancos  configurados para la cta (campo cbBanco)
        this.stBanco = new Ext.data.Store({
            url: 'cargarcombobanco',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idbanco',
                totalProperty: 'cant'
            },
            [{
                    name: 'idbanco',
                    type: 'string'
                }, {
                    name: 'banco',
                    mapping: 'nombre'
                }]),
            sortInfo: {
                field: 'banco',
                direction: 'ASC'
            }
        });

        // Store  para sucursales  configurados seg'un el  banco (campo cbSucursalbanc)
        this.stSucursalbanc = new Ext.data.Store({
            url: 'cargarsucursales',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idsucursal',
                totalProperty: 'cant'
            },
            [{
                    name: 'idsucursal',
                    type: 'string'
                }, {
                    name: 'direccion'
                },
                {
                    name: 'numdir'
                }]),
            sortInfo: {
                field: 'direccion',
                direction: 'ASC'
            }
        });

        // Store  para unidades contables del tab en pesta�a 1
        this.stUnidadcontable = new Ext.data.Store({
            url: 'cargargridunidadcontable',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idbanco',
                totalProperty: 'cant'
            }, [{
                    name: 'idestructura',
                    type: 'string'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'marcado',
                    type: 'boolean'
                }, {
                    name: 'idestructuracuentabnk',
                    type: 'string'
                }, {
                    name: 'codigo'
                }])
        });

        // Store  para sobregiro del tab en pesta�a 2
        this.stCtacontableSG = new Ext.data.Store({
            url: 'cargarcuentasobregiro',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                    name: 'idcuentasg',
                    mapping: 'idcuenta',
                    type: 'string'
                }, {
                    name: 'nombrecuenta',
                    mapping: 'text'
                }])
        });
    }
};

/* 
 * @autor Alejandro Mengana Perez
 * Grupo de desarrolladores de CONFIN
 */

Ext.namespace('Banco.Recuperaciones.Conciliacion');

Banco.Recuperaciones.Conciliacion.Model = {
    inicio: function() {

        this.stconcepto = new Ext.data.Store({
            //url: 'cargartipocuenta',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idbanco',
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

        this.stperiodo = new Ext.data.Store({
            url: 'cargarperiodos',
            id: 'stperiodo',
            reader: new Ext.data.JsonReader({
                id: 'periodo'
            },
            [{
                    name: 'idperiodo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }])
        });

        this.stejercicio = new Ext.data.Store({
            //url: 'cargarejercicios',
            id: 'stejercicio',
            reader: new Ext.data.JsonReader({
                id: 'ejercicio'
            },
            [{
                    name: 'idejercicio'
                }, {
                    name: 'nombre'
                }, {
                    name: 'inicio'
                }, {
                    name: 'fin'
                }])
        });

        this.stCuentaBanc = new Ext.data.Store({
            url : 'cargarCtaBancaria',
            reader : new Ext.data.JsonReader({
                root : 'datos',
                id : 'idcuentabancaria',
                totalProperty : 'totalRecords'
            }, [{
                name : 'idcuentabancaria',
                type : 'string'
            },
                {
                    name : 'nombrecuentabancaria'
                },
                {
                    name : 'text'
                },
                {
                    name : 'saldoinicialmb'
                },
                {
                    name : 'idmoneda'
                },
                {
                    name : 'saldoenbancomo'
                },
                {
                    name : 'nrocuenta'
                }
            ]),
            sortInfo :{
                field: 'text',
                direction: 'ASC'
            }
        });

        //Reader para el combo de las estructuras economicas
        this.jrEntidad = new Ext.data.JsonReader({
            id: 'idestructurae',
            root: 'datos'
        }, [{
                name: '_parent',
                mapping: 'idestructuraepadre'
            }, {
                name: '_is_leaf',
                mapping: 'leaf'
            }, {
                name: 'text'
            }, {
                name: 'idestructurae'
            }, {
                name: 'idestructuraepadre'
            }, {
                name: 'codigo',
                mapping: 'text'
            }, {
                name: 'ordenizq'
            }, {
                name: 'ordender'
            }, {
                name: 'idestructuracomun'
            }]);
        
        //store para el combo del tipo de conciliacion
        this.stTipoMetdConc = new Ext.data.SimpleStore({
            fields: ['idreporte', 'textometdconc'],
            data: [
                [1, 'Saldo según libro'], [2, 'Saldo según banco'], [3, 'Saldo ajustado']
            ]
        });
    }
};
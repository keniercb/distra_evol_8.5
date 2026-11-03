Ext.namespace('Presupuesto.Reportes');

Presupuesto.Reportes.Model = {
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
        this.stTipoReporte = new Ext.data.SimpleStore({
            fields: ['idreporte', 'textometdconc'],
            data: [
                [1, 'Asignado por el Organismo Superiror'], [2, 'Distribuido a las UM'], [3, 'Reserva del Presupuesto']
            ]
        });
    }
};
Ext.ns('Gestionar.clasifinversiones');

Gestionar.clasifinversiones.Modelo = {
    init: function() {
        var vista = Gestionar.clasifinversiones.Vista;
        _this = this;

        mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...',
            removeMask: false
        });

        this.myData = [
            [71.72, 'constructiva', 'formato 1'],
            [29.01, 'no constructiva', 'formato 2']
        ];

        _this.stDocumento = new Ext.data.Store({
            url: 'cargarDocPrimarios',
            reader: new Ext.data.JsonReader({
                root: 'data',
                id:'iddoc'
            }, [{
                name: 'iddocumentos'
            },{
                name: 'iddoc'
            }, {
                name: 'denominacion'
            }, {
                name: 'checked'
            }
            ])

        });

        /*this.store_gestionar_inversiones = new Ext.data.SimpleStore({
            fields: [{
                    name: 'idinversiones'
                },{
                    name: 'iddocumentos'
                },{
                    name: 'denomdoc'
                }, {
                    name: 'clasificacion'
                }, {
                    name: 'formato'
                }]
        });*/
        this.stFormato = new Ext.data.Store({
            url: 'listarformato',
            reader: new Ext.data.JsonReader({
                id: 'idformatoetapa',
                root: 'data'
            },
            [{
                    name: 'denominacion'
                }, {
                    name: 'idformatoetapa'
                }])
        });


        this.store_gestionar_inversiones = new Ext.data.Store({
            url: 'listar',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'idtipoinversion'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'idformatoetapa'
                }, {
                    name: 'donemformato'
                }, {
                    name: 'uso'
                },{
                    name: 'iddocumentos'
                },{
                    name: 'denomdoc'
                }
            ])

        });




    }
}
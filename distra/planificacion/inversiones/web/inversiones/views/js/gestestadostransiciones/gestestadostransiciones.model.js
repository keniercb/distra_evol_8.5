Ext.ns('Gestionar.estadostransiciones');

Gestionar.estadostransiciones.Modelo = {
    init: function() {
        _this = this;
        vista = Gestionar.estadostransiciones.Vista;

        _this.stEstados = new Ext.data.Store({
            url: 'listarEstados',
            id: 'idcbestados',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idestadosft'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'uso'
                }]),
        });

        _this.stFlujo = new Ext.data.Store({
            url: 'listarFlujoTrabajo',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idflujotrabajo'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'uso'
                }])
        });

        _this.stTodosUser = new Ext.data.Store({
            url: 'listarTodosUser',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idusuario'
                }, {
                    name: 'nombreusuario'
                }
            ])
        });

        _this.stUserAutorizados = new Ext.data.Store({
            url: 'listarUserAut',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idusuario'
                }, {
                    name: 'nombreusuario'
                }
            ])
        });


        _this.stTransiciones = new Ext.data.Store({
            url: 'listarTransiciones',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idtransicion'
                }, {
                    name: 'idestadoinicial'
                }, {
                    name: 'idestadofinal'
                }, {
                    name: 'idflujotrabajo'
                },
                {
                    name: 'inicial'
                }, {
                    name: 'estadoinicial'
                }, {
                    name: 'estadofinal'
                }
            ])
        });

        _this.stEstadosIniciales = new Ext.data.Store({
            url: 'listarEstadosIniciales',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idestadosft'
                }, {
                    name: 'denominacion'
                }])
        });

        _this.stEstadosFinales = new Ext.data.Store({
            url: 'listarEstadosFinales',
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'cant'
            }, [{
                    name: 'idestadosft'
                }, {
                    name: 'denominacion'
                }])
        });




    }
}
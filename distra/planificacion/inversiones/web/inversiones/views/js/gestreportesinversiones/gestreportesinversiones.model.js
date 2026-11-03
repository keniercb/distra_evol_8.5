Ext.ns('Gestionar.gestreportesinversiones');


Gestionar.gestreportesinversiones.Modelo = {
    init: function() {
        _this = this;

        _this.stCbejercicio = new Ext.data.Store({
            url: 'listarEjercicios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'idestado'
                }])
        });



        //store del grid donde cargo los reportes existentes
        _this.stGReportesExistentes = new Ext.data.Store({
            autoLoad: true,
            url: 'getReportes',
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "data"/*,
                 id: "idreporte"*/
            },
            [{
                    name: 'idreporte'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'configuracion'
                }])
        });

        _this.stOrganismo = new Ext.data.Store({
            url: 'getOrganismos',
            reader: new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            },
            [{
                    name: 'idorganismo'
                }, {
                    name: 'organismo'
                }])
        });

        _this.stMedioAmbiente = new Ext.data.Store({
            url: 'getMedioAmbiente',
            reader: new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            },
            [{
                    name: 'idorganismo'
                }, {
                    name: 'organismo'
                }])
        });

        _this.stObjetivo = new Ext.data.Store({
            url: '/planificacion/planmeta/index.php/inversiones/cargarDatosNomInversion',
            baseParams: {
                idNomInversion: 7
            },
            reader: new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            },
            [{
                    name: 'idorganismo'
                }, {
                    name: 'organismo'
                }])
        });

        _this.stNiveles = new Ext.data.SimpleStore({
            fields: ['idnivel', 'nivel'],
            data: [[1, 'Genérico'], [2, 'Subgenérico'], [3, 'Específico'], [4, 'Surtido']]
        });
    }
};

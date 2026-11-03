//Namespace del componente RedistribuciÃ³n asociadas a Balance Material
Ext.ns('Planificacion.BalanceMaterial.Redistribucion')
//modelo 2
//Modelo del componente RedistribuciÃ³n asociadas a Balance Material
Planificacion.BalanceMaterial.Redistribucion.Modelo = {
    //Inicializar modelo de la vista del componente RedistribuciÃ³n asociadas a Balance Material
    init: function() {
        //Store para los indicadores demandados
        var vista = Planificacion.BalanceMaterial.Redistribucion.Vista;
        Ext.Ajax.timeout = 3600000; //600000 = 10min  3600000=1h 
        this.stgpIndDemandados = new Ext.data.Store({
            url: 'listarIndocadoresConDemanda',
            reader: new Ext.data.JsonReader({
                id: 'idindicador',
                root: 'datos',
                totalProperty: 'total',
                importetotal: 'importetotal'
            }, [{
                    name: 'idindicador'
                },
                {
                    name: 'identidad'
                },
                {
                    name: 'idcentrobalance'
                },
                {
                    name: 'denominacioncb'
                }, {
                    name: 'identidad'
                }, {
                    name: 'codigo'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'importedns'

                }, {
                    name: 'importesatisfecha'

                }, {
                    name: 'denominacion'
                }, {
                    name: 'umedida'
                }, {
                    name: 'precio'
                }, {
                    name: 'preciomlc'
                }, {
                    name: 'flete'
                }, {
                    name: 'contingencia'
                }, {
                    name: 'demanda'
                }, {
                    name: 'satisfecha'
                }, {
                    name: 'esd'
                }, {
                    name: 'porciento'
                }, {
                    name: 'importe'
                }, {
                    name: 'dns'
                }
            ])
        });
        //Store para los entidades abastecedoras
        this.stgpEntidadesAbast = new Ext.data.Store({
            url: 'listarEspAbastecedoras',
            reader: new Ext.data.JsonReader({
                id: 'idresdistribucionexcedente',
                root: 'data',
                totalProperty: 'total',
                importetotal: 'importetotal'
            }, [{
                    name: 'idresdistribucionexcedente'
                },
                {
                    name: 'idespecialidad'
                },
                {
                    name: 'denespecialidad'
                },
                {
                    name: 'prioridad'
                },
                {
                    name: 'cantdisponible'
                }, {
                    name: 'cantasignado'
                }, {
                    name: 'cantsindistribuir'
                }, {
                    name: 'cantidad'
                },
            ])
        });

        this.stcbCtroBalance = new Ext.data.Store({
            autoLoad: true,
            url: 'listarComboCentroBalance',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [{
                    name: 'centrobalance'
                }, {
                    name: 'idcentrobalance'
                }])
        });


        this.stProductos = new Ext.data.Store({
            timeout: 7200000,
            url: 'listarProductos',
            reader: new Ext.data.JsonReader({
                id: 'idindicador',
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'codigo'
                }, {
                    name: 'numeropieza'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'denominacioncb'
                }, {
                    name: 'coberturatotalestimada'
                }, {
                    name: 'demanda'
                }, {
                    name: 'unidadmedida'
                }, {
                    name: 'organodemandante'
                }, {
                    name: 'centrobalance'
                }, {
                    name: 'situacion'
                }, {
                    name: 'disponible'
                }, {
                    name: 'cer'
                }

            ])
        });

        this.stEnconProd = new Ext.data.Store({
            url: 'listarProdPorEsp',
            reader: new Ext.data.JsonReader({
                id: 'rdproductoesp',
                root: 'data',
                totalProperty: 'total'
            }, [{
                    name: 'idproducto'
                }, {
                    name: 'idestructuraop'
                }, {
                    name: 'especialidad'
                }, {
                    name: 'codigoprod'
                }, {
                    name: 'categoria'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'um'
                }, {
                    name: 'existencia'
                }, {
                    name: 'cantidaddisponible'
                }, {
                    name: 'importetotal'
                }, {
                    name: 'idservidor'
                }, {
                    name: 'deposito'
                }, {
                    name: 'idespecialidad'
                }, {
                    name: 'lugar'
                }, {
                    name: 'preciopromedio'
                }, {
                    name: 'preciounitario'
                }
            ])
        });
        this.stCbImportes = new Ext.data.SimpleStore({
            fields: ['idimporte', 'denominacion'],
            data: [
                [1, 'Importe demanda'],
                [2, 'Importe satisfecha'],
                [3, 'Importe demanda no satisfecha']
            ]
        });



        this.stCbejercicio = new Ext.data.Store({
            url: ' ../gestplanes/getEjercicios',
            autoLoad: true,
            listeners: {
                load: function(t, n, e) {
                    vista.cbEjercicio.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
                }
            },
            reader: new Ext.data.JsonReader({
                root: "data",
                id: 'idejercicio'
            }, [{
                    name: 'idejercicio'
                }, {
                    name: 'ejercicio'
                }, {
                    name: 'estado'
                }])
        });
        ;
    }


}

function CargaInicial() {

}


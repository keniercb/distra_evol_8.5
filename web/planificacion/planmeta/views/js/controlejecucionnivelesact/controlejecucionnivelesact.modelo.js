//Namespace del componente Niveles y Control de la Ejecuci�n
Ext.ns('Planificacion.Ejecucion.Nivelesact')

//Modelo del componente Niveles y Control de la Ejecuci�n
Planificacion.Ejecucion.Nivelesact.Modelo = {
    //Inicializar modelo de la vista
    init: function () {
        var vista = Planificacion.Ejecucion.Nivelesact.Vista;

        this.stNiveles = new Ext.data.Store({
            url: ' listarNiveles',
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{
                name: 'idactividad'
            }, {
                name: 'identidad'
            }, {
                name: 'denominacion'
            }, {
                name: 'descripcion'
            }, {
                name: 'codigo'
            }, {
                name: 'denespecialidad'
            }, {
                name: 'comportamiento'
                },
                {
                    name: 'idactividadentidad'
                }, {
                    name: 'nivelactividad'
                }, {
                    name: 'importe'
                }, {
                    name: 'nivelactividadautomatico'
                }, {
                    name: 'nivelactividadmanual'
                }, {
                    name: 'nivelactividadproduccion'
                }, {
                    name: 'nivelactividadct'
                }, {
                    name: 'esorigenautomatico'
                }, {
                    name: 'importe_total_paginado'
                }, {
                    name: 'sololectura'
                }, {
                    name: 'ajuste'
                }, {
                    name: 'idaprobacion'
                }, {
                    name: 'denmodelo'
                }, {
                    name: 'restoxdistrib'
                }, {
                    name: 'version_manual'
                }, {
                    name: 'existe_demanda'
                }, {
                    name: 'importeajustado'
                }, {
                    name: 'importefinal'
                }, {
                    name: 'desglosada'
                }, {
                    name: 'cantdesglosada'
                }
            ])
        });


        //Fuente de datos de los recursos financieros
        this.stAjuste = new Ext.data.Store({
            url: 'listarAjuste',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idrecursofinanciero", totalProperty: "total"},
                [{name: 'idrecursofinanciero'}, {name: 'codigo'}, {name: 'denominacion'}]
            )
        });
        //Fuente de datos de los recursos financieros
        this.stNivelesAjuste = new Ext.data.Store({
            url: 'listarNivelesAjustar',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idrecursofinanciero", totalProperty: "total"},
                [{name: 'idrecursofinanciero'}, {name: 'codigo'}, {name: 'denominacion'}]
            )
        });
        //Fuente de datos de los recursos financieros
        this.stControl = new Ext.data.Store({
            url: 'listarControles',
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idrecursofinanciero", totalProperty: "total"},
                [{name: 'idrecursofinanciero'}, {name: 'codigo'}, {name: 'denominacion'}]
            )
        });


        this.stCbejercicio = new Ext.data.Store({
            url: ' ListarEjercicios',
            autoLoad: true,
            listeners: {
                load: function (t, n, e) {
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

    }
};


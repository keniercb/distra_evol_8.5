//Namespace del componente Priorizarentidad asociadas a Balance Material
Ext.ns('Planificacion.BalanceMaterial.Priorizarentidad')
//Modelo del componente Priorizarentidad asociadas a Balance Material
Planificacion.BalanceMaterial.Priorizarentidad.Modelo = {
    vista: null,
    init: function(vista) {
        this.vista = vista;
        //Store para los centros de balance
        this.stgpCentrosbalance = new Ext.data.Store({
            id: 'stgpCentrosbalance',
            url: 'listarCentrosbalance ',
            listeners:
                    {
                        load: function(st)
                        {
                            if (st.getCount() == 0) {
                                mostrarMensaje(1, perfil.etiquetas.msgBuscar);
                            }
                        }
                    },
            reader: new Ext.data.JsonReader({
                root: 'data',
                totalProperty: 'total',
                id: 'identidaddatosnomenclador'
            }, [
                {
                    name: 'identidaddatosnomenclador'
                }, {
                    name: 'denominacion'
                },
                {
                    name: 'identidad'
                }
                , {
                    name: 'total'
                }
                , {
                    name: 'totalesp'
                }
            ])
        });
        //Store para la Especialidad
        this.stgpEspecialidad = new Ext.data.Store({
            url: 'listarEspecialidad',
            listeners: {
                beforeload: function(st) {
                }

            },
            reader: new Ext.data.JsonReader({
                id: 'idespecialidad',
                root: 'data',
                totalProperty: 'total',
                importetotal: 'importetotal'
            }, [{
                    name: 'idespecialidad'
                }, {
                    name: 'denespecialidad'
                }, {
                    name: 'prioridad'
                },
            ])
        });

        this.stCbPaginado = new Ext.data.SimpleStore({
            fields: ['idnumpag', 'dennumpag'],
            data: [
                [20, '20'],
                [40, '40'],
                [80, '80'],
                [100, '100'],
                [150, '150']
            ]
        });



    }
}




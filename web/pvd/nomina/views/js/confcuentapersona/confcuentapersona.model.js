Ext.ns('Pvd.Nomina.Configuracion.Confcuentapersona');

//Modelo de la vista del componente Gestionar plantilla nominal.
Pvd.Nomina.Configuracion.Confcuentapersona.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stConfcuentapersona = new Ext.data.Store({
            url: 'obtenerconfiguracionecuentasaperturapersona',
           // baseParams: {idestructura: -1},
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", autoLoad: true, root: "datos", id: "idcuentaaperturapersona"},
                [{name: 'id'}
                    , {name: 'idcuentaaperturapersona'}
                    , {name: 'idcuenta'}
                    , {name: 'idestructura'}
                    , {name: 'descripcion'}
                    , {name: 'tipoapertura'}
                    , {name: 'denom'}

                ])
        });

        this.stcuenta = new Ext.data.Store({
            url:'/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/cargarCuentas',
            baseParams: {
                tipocta: 2,
                idsubsistema:71
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuenta', mapping: 'id'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });
   }
};
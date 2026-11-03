
//Empaquetando el componente.
Ext.ns('Copa.Reportes');

Copa.Reportes.Model = {
    init: function() {
        this.stReportes = new Ext.data.Store({
            url: 'cargarreportes',
            sortInfo: ({
                field: 'denominacion',
                direction: 'ASC'
            }),
            reader: new Ext.data.JsonReader({
                id: 'store'
            }, [{name: 'idreporte'},
                {name: 'denominacion'},
                {name: 'url'}
            ])
        });



        this.strClientProv = new Ext.data.Store({
            url: 'obtenerclientesprovedores',
            sortInfo: ({
                field: 'nombre',
                direction: 'ASC'
            }),
            reader: new Ext.data.JsonReader({
                root: 'datos',
                fields: [
                    {name: 'idestructuracliente'},
                    {name: 'nombre'}
                ]
            })
        });
    }
};
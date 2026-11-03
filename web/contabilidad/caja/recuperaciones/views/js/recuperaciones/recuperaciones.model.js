
//Empaquetando el componente.
Ext.ns('Caja.Reportes');

Caja.Reportes.Model = {
    init: function() {
        this.recordT = Ext.data.Record.create([
            {name: 'idreporte'},
            {name: 'denominacion'}
        ]);

        this.stReportes = new Ext.data.Store({
            // url: 'cargarreportes',
            sortInfo: ({
                field: 'denominacion',
                direction: 'ASC'
            }),
            reader: new Ext.data.JsonReader({
                id: 'idreporte'
            }, this.recordT)
        });

        // this.strClientProv = new Ext.data.Store({
        //     url: 'obtenerclientesprovedores',
        //     sortInfo: ({
        //         field: 'nombre',
        //         direction: 'ASC'
        //     }),
        //     reader: new Ext.data.JsonReader({
        //         root: 'datos',
        //         fields: [
        //             {name: 'idestructuracliente'},
        //             {name: 'nombre'}
        //         ]
        //     })
        // });
    }
};
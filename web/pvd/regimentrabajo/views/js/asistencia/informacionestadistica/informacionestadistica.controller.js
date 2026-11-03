Ext.ns('Pvd.ControlAsistencia.Informacionestadistica');
//Controlador de la vista del componente
Pvd.ControlAsistencia.Informacionestadistica.Controlador = {

    init: function (idioma, vista, modelo) {
        this.idestructura = perfil.idestructuracomun;
        var self = this;

        vista.Listadoinfoestadistica.setTitle('Listado de indicadores entidad:' + ' ' + perfil.entidad);

        modelo.storeMeses.on('load', function (th, recs, opt) {
            vista.comboMeses.setValue(vista.fecha.getMonth() + 1);
        });


        //variante 2 pra las fechas
        var _self = this;


        vista.gplistadoreporte.getSelectionModel().on('rowselect', function (obj, i, data) {

            modelo.stinfoestadistica.load({
                params: {
                    idestructura: this.idestructura,
                    idreporte: data.get('idreporte')
                }
            });

        }.createDelegate(this));


        function representarImagen(val) {
            return "<img src=data:image/jpg;base64," + val + " width='50' height='40' />";
        }


    }

///
}

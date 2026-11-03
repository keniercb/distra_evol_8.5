/*Componente para gestionar el registro de Salarios y tiempo de servicio (SNC - 225)
 *@author 1er Tte. Frank Rodriguez Berroa
 *@email fberroa@xetid.cu
 */
Ext.ns('Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio');
//Modelo de la vista del componente Gestionar registro de salarios y tiempo de servicios.
Pvd.Nomina.Submayor.GestRegistroSalarioTiempoServicio.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        var annos = new Array();
        this.datosModelo = null;
        fnLlenarArregloAnnos();
        //Store del listado de Gestionar registro de salarios y tiempo de servicios.
         this.storeRegistroSalario = new Ext.data.GroupingStore({
            groupField: 'anno',
            url: 'obtenerListadoRegistroSalario',
            sortInfo: {field: 'anno', direction: "DESC"},
            reader: new Ext.data.JsonReader({
                root: "datos",
                totalProperty: "cantidad"
            }, [
                {name: 'idregistrosalariotiemposervicio'},
                {name: 'idpersona'},
                {name: 'anno'},
                {name: 'idmes'},
                {name: 'mes'},
                {name: 'idtiponomina'},
                {name: 'denominaciotiponomina'},
                {name: 'diasacumulados'},
                {name: 'salariodevengado'},
                {name: 'idestructura'},
                {name: 'idconfregistsalartiempservc'},
                {name: 'confregistsalartiempservc'},
                {name: 'registrotiponominamanual'},
                {name: 'salariodevengadoreporte'}
            ])
        });

        this.storeCbAnnos = new Ext.data.SimpleStore({
            fields: [
                {name: 'idannos'},
                {name: 'denominacion'}
            ],
            data: annos
        });

        this.storeCbMeses = new Ext.data.Store({
            url: 'obtenerMeses',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idmes"},
                [{name: 'idcalendario'},
                    {name: 'idmes'},
                    {name: 'denominacion'}
                ])
        });

        this.storeCbTipoNomina = new Ext.data.Store({
            url: 'obtenerTiposNomina',
            reader: new Ext.data.JsonReader(
                {totalProperty: "cantidad", root: "datos", id: "idtiponomina"},
                [   {name: 'idtiponomina'},
                    {name: 'denominacion'}
                ])
        });

        function fnLlenarArregloAnnos() {
            for (var i = 0; i <= 100; i++) {
                annos.push([i, i + 2000]);
            }
        }

        this.ConvertiraArreglo = function (arrObj) {
            var arr = new Array();
            for (var i = 0; i < arrObj.length; i++) {
                var a = new Array();
                a[0] = arrObj[i].idindicador;
                a[1] = arrObj[i].indicador;
                a[2] = arrObj[i].tipo;
                arr[i] = a;
            }
            return arr;
        }
    }
};

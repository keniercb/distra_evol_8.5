Ext.ns('Pvd.ControlAsistencia.PromedioTrabajadores');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.PromedioTrabajadores.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function () {
        this.store = new Ext.data.GroupingStore({
            url: 'getdatos',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name: 'idestructura'}, {name: 'concepto'}]
            )
        });

        this.concepto = [
            [1, 'Licencia por Cuidado de Hijos'],
            [2, 'Prestación Económica'],
            [3, 'Prestación Social'],
            [4, 'Trabajadores Interruptos'],
            [5, 'Suspención Laboral Salida del País'],
            [6, 'Licencia por Asuntos Personales'],
            [7, 'Personal en el Extranjero'],
            [8, 'Enfermedad o Accidente Común'],
            [9, 'Enfermedad sin Certificado Médico'],
            [10, 'Ausencias por Baja'],
            [11, 'Ausencias al Trabajo'],
            [12, 'Bajo Proceso de Peritaje Médico'],
            [13, 'En Proceso de Jubilación'],
            [14, 'Movilizados']
        ];

        this.storeConceptos = new Ext.data.SimpleStore({
            fields: [{name: 'idconcepto'}, {name: 'concepto'}]
        });
        this.storeConceptos.loadData(this.concepto);

        this.storeCausas = new Ext.data.Store({
            url: 'getlistadoCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name: 'idcausa'}, {name: 'denominacion'}, {name: 'idconcepto'}, {name: 'check'}]
            )
        });

        this.concept = [
            [1, 'Trabajadores Fijos'],
            [2, 'Trabajadores Contratados'],
            [3, 'Nombramiento Provisional'],
            [4, 'Período a Prueba']
        ];

        this.storeConcept = new Ext.data.SimpleStore({
            fields: [{name: 'idconcepto'}, {name: 'denominacion'}, {name: 'check'}]
        });
        this.storeConcept.loadData(this.concept);

        this.storeTipocontrato = new Ext.data.Store({
            url: 'getTipocontrato',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name: 'idtipocontrato'}, {name: 'denominacion'}, {name: 'check'}]
            )
        });

        this.storeSituacion = new Ext.data.Store({
            url: 'getSituacion',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name: 'idsituacion'}, {name: 'denominacion'}, {name: 'idtipocontrato'}, {name: 'check'}]
            )
        });
    }


};

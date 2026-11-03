Ext.ns('Pvd.ControlAsistencia.Asistenciamensual');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.Asistenciamensual.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stListadoPersonas = new Ext.data.GroupingStore({
            remoteGroup:true,
            remoteSort: true,
            url: 'getpersonasasistencia',
            pruneModifiedRecords:true,
                reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idasistencia'},{name:'idpersona'},{name:'nombreapellidos'}, {name:'fechahoraentrada'},
                 {name:'idvariablesconfreportescertificaciones'},{name:'fdesde'},{name:'fhasta'},
                    {name:'hrsdescontadas'},{name:'fechahorasalida'},{name:'fecharegistro'},{name:'denomarea'}
                    ,{name:'lft'}]
            ),
            sortInfo:{field: 'lft', direction: "ASC"},
            groupField:'denomarea'
        });

        this.stListadoApa = new Ext.data.GroupingStore({
            url: 'getapa',
                reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'nombreapellidos'}]
            ),
            sortInfo:{field: 'nombreapellidos', direction: "ASC"},
            groupField:'idpersona'
        });

        this.meses = [
            [1,'Enero'],
            [2,'Febrero'],
            [3,'Marzo'],
            [4,'Abril'],
            [5,'Mayo'],
            [6,'Junio'],
            [7,'Julio'],
            [8,'Agosto'],
            [9,'Septiembre'],
            [10,'Octubre'],
            [11,'Noviembre'],
            [12,'Diciembre'],
        ]

        this.storeMeses = new Ext.data.SimpleStore({
            fields:[{name:'idmes'},{name:'denominacion'}]
        });
        this.storeMeses.loadData(this.meses);


        this.storeYear = new Ext.data.SimpleStore({
            fields:[{name:'idyear'},{name:'denominacion'}]
        });

        this.stlistadoAsistencia = new Ext.data.Store({
            url: 'reporteasistencia',
            reader: new Ext.data.JsonReader(
                {totalProperty: 'cantidad', root: 'data', id: 'idregimentrabajo'},
                [
                    {name: 'idpersona'}
                    , {name: 'nombreapellidos'}
                    , {name: 'denarea'}
                    , {name: 'horaentradatrabajo'}
                    , {name: 'horasalidatrabajo'}
                    , {name: 'horaentradaextra'}
                    , {name: 'horasalidaextra'}
                ]
            )

        });

        this.stinfoestadistica = new Ext.data.Store({
            url: 'getinfoestadistica',
            reader: new Ext.data.JsonReader(
                {root: "datos", totalProperty: "cantidad"},
                [{name:'idestructura'},{name:'entidad'},{name:'ft'},{name:'trt'},{name:'hp'},{name:'he'},{name:'hf'},{name:'hft'}]
            )
        });

        this.stlistadoCausas = new Ext.data.Store({
            url: 'getCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'},{name:'abreviatura'},{name:'color'}]
            )
        });

        this.valores = [
            [1,'Fondo de tiempo','FT'],
            [2,'Tiempo real trabajado','TRT'],
            [3,'Horas perdidas','HP'],
            [4,'Horas extras','HE'],
            [5,'Horas feriadas','HF'],
            [6,'Horas feriadas trabajadas','HFT'],
        ]

        this.storeValores = new Ext.data.SimpleStore({
            fields:[{name:'idvalor'},{name:'denominacion'},{name:'abreviatura'}]
        });
        this.storeValores.loadData(this.valores);

        this.rangos = [
            [1,'Primera quincena'],
            [2,'Segunda quincena'],
            [3,'Mes']
        ]

        this.storequincenal = new Ext.data.SimpleStore({
            fields:[{name:'idrango'},{name:'denominacion'}]
        });
        this.storequincenal.loadData(this.rangos);

        this.stlistadoCausas = new Ext.data.Store({
            url: 'getCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'},{name:'abreviatura'}]
            )
        });

        this.reporte = [            
            [1,'Horas trabajadas'], 
            [2,'Horas perdidas']
        ]

        this.storereporte = new Ext.data.SimpleStore({
            fields:[{name:'idreporte'},{name:'denominacion'}]
        });
        this.storereporte.loadData(this.reporte);

        this.analisis = [
            [1,'Mensual'],
            [2,'Rango de fecha']
        ]

        this.storeanalisis = new Ext.data.SimpleStore({
            fields:[{name:'idanalisis'},{name:'denominacion'}]
        });
        this.storeanalisis.loadData(this.analisis);

        this.certifico = [
            [1,'Certificada', '<span style=" color:' + '#33aa33' + ';"><b>&#11044;</b></span>'],
            [0,'No Certificada', '<span style=" color:' + '#FFC800' + ';"><b>&#11044;</b></span>']
        ]

        this.storecertificacion = new Ext.data.SimpleStore({
            fields:[{name:'idcertificacion'},{name:'denominacion'}, {name:'icono'}]
        });
        this.storecertificacion.loadData(this.certifico);

        this.concepto = [
            [1, 'Vacaciones'],
            [2, 'Accidentes del trabajo'],
            [3, 'Enfermedad profesional'],
            [4, 'Enfermedad o accidente común'],
            [5, 'Licencias no retribuidas'],
            [6, 'Ausencias Justificadas'],
            [7, 'Por ausencias injustificadas'],
            [8, 'Total de certificados médicos recibidos'],
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

        this.trimestre = [
            [1,'1er Trimestre'],
            [2,'2do Trimestre'],
            [3,'3er Trimestre'],
            [4,'4to Trimestre'],
        ]

        this.storeTrimestre = new Ext.data.SimpleStore({
            fields:[{name:'idtrimestre'},{name:'denominacion'}]
        });
        this.storeTrimestre.loadData(this.trimestre);

        this.formato = [
            [0,'A0'],
            [1,'A1'],
            [2,'A3'],
            [3,'A4'],
        ]
        this.stformato = new Ext.data.SimpleStore({
            fields:[{name:'idformato'},{name:'formato'}]
        });
        this.stformato.loadData(this.formato);

    }

};

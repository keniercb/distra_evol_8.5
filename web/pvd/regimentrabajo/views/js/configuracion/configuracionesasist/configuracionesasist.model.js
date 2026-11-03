Ext.ns('Pvd.ControlAsistencia.Configuracionesasist');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.Configuracionesasist.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        this.stLimites = new Ext.data.Store({
            url: 'getLimites',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'limite'}
            ])
        });

        this.stHorario = new Ext.data.Store({
            url: 'getHabilitado',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'habilitado'}
            ])
        });
        this.stHabSesiones = new Ext.data.Store({
            url: 'getHabSesiones',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: ''
            }, [
                {name: 'habsesion'}
            ])
        });
		
        this.stHabCA = new Ext.data.Store({
            url: 'getHabilitadoCA',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'idca'},
                {name: 'habilitadoca'},
                {name: 'habilitadosw'},
                {name: 'habilitadoabd'},
                {name: 'dirautenticacion'},
                {name: 'dirdatos'},
                {name: 'estructuras'}
            ])
        });

        /*this.storeestructurasCA = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructurasCA',
            preloadChildren: false
        });*/

        this.stHabCausa = new Ext.data.Store({
            url: 'getHabilitadoCausa',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'habilitado'}
            ])
        });

        this.stHabSubVac = new Ext.data.Store({
            url: 'getHabSubVac',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: ''
            }, [
                {name: 'id'},
                {name: 'habilitado'}
            ])
        });

        this.stHabPagoMensual = new Ext.data.Store({
            url: 'getHabFinmes',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: ''
            }, [
                {name: 'id'},
                {name: 'habilitado'}
            ])
        });

        this.estructurapadre = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructurasCA',
            preloadChildren: false
        });

        this.store = new Ext.data.Store({
            url: 'getlistadoEstructuraTempus',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idestructura'},{name:'denomestructura'},{name:'dirapp'}]
            )
        });

        this.storeReloj = new Ext.data.Store({
            url: 'getlistadoEstructuraReloj',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idestructura'},{name:'denomestructura'},{name:'dirserver'},{name:'nombredb'},{name:'usuario'},{name:'contrasena'}]
            )
        });

        this.storePtoAcc = new Ext.data.Store({
            url: 'getlistadoPuntoAcceso',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idpuntoacceso'},{name:'denominacion'}]
            )
        });

        this.storeNoct = new Ext.data.Store({
            url: 'getlistadoHorarioNoct',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idhorarionocturnidad'},{name:'denominacion'},{name:'horainicio'},{name:'horafin'}]
            )
        });

        this.storeCategoria = new Ext.data.Store({
            url: 'getlistadoCategorias',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcategoriapersona'},{name:'denominacion'},{name:'fondodetiempo'}]
            )
        });

        this.storeCausas = new Ext.data.Store({
            url: 'getlistadoCausas',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'}, {name:'idcategoria'}, {name:'check'}]
            )
        });

        this.storeCausasCert = new Ext.data.Store({
            url: 'getlistadoCausasCert',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'}, {name:'check'}]
            )
        });

        this.storeGrupo = new Ext.data.GroupingStore({
            url: 'getlistadoGrupos',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idgrupodescanso"
            }, [{name:'idgrupodescanso'},{name:'denominacion'}, {name:'check'},{name:'idregimentrabajo'},{name:'denregimentrabajo'}
            ]),
            sortInfo: {field: 'denregimentrabajo', direction: "ASC"},
            groupField:'denregimentrabajo'
        });

        this.storeUsuarios = new Ext.data.GroupingStore({
            url: 'getUsuarios',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idusuario"
            }, [{name:'idusuario'},{name:'usuario'}, {name:'check'}
            ]),
            sortInfo: {field: 'usuario', direction: "ASC"}
        });

        this.diashoras = [
            [1,'Días'],
            [2,'Horas']
        ]

        this.stDiashoras = new Ext.data.SimpleStore({
            fields:[{name:'id'},{name:'horasdias'}]
        });
        this.stDiashoras.loadData(this.diashoras);

        this.stNofirman = new Ext.data.Store({
            url: 'getHabilitadoCargosnofirman',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'habilitado'}
            ])
        });

        this.concepto = [
            [1, 'Vacaciones'],
            [2, 'Tiempo no trabajado por alta'],
            [3, 'Tiempo no trabajado por baja'],
            [4, 'Licencia de maternidad'],
            [5, 'Prestacion social'],
            [6, 'Licencia sin sueldo por ley maternidad'],
            [7, 'Autorizaciones legales vigentes'],
            [8, 'Interrupciones de dias completos'],
            [9, 'Accidente de trabajo'],
            [10, 'Accidente de trayecto'],
            [11, 'Enfermedad(Certificado medico)'],
            [12, 'Autorizacones administrativas'],
            [13, 'Ausencias justificadas'],
        ];

        this.storeConceptos = new Ext.data.SimpleStore({
            fields: [{name: 'idconcepto'}, {name: 'concepto'}]
        });
        this.storeConceptos.loadData(this.concepto);

        this.storeCausasRep = new Ext.data.Store({
            url: 'getlistadoCausasRep',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'}, {name:'idconcepto'}, {name:'check'}]
            )
        });

        this.storeCausasPromTrab = new Ext.data.Store({
            url: 'getlistadoCausasPromTrab',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'},{name:'adiciondeducion'}]
            )
        });

        this.storeConceptosONEI = new Ext.data.Store({
            url: 'getlistadoConceptosONEI',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idconcepto'},{name:'orden'},{name:'denominacion'}]
            )
        });

        this.storeCausasONEI = new Ext.data.Store({
            url: 'getlistadoCausasONEI',
            reader: new Ext.data.JsonReader(
                {root: "datos"},
                [{name:'idcausa'},{name:'denominacion'}, {name:'idconcepto'}, {name:'check'}]
            )
        });

        this.stHabMultiplesCausas = new Ext.data.Store({
            url: 'getHabMultiplesCausas',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'habilitadomc'}
            ])
        });
	}
	
};


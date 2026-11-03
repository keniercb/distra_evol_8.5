Ext.ns('Pvd.ControlAsistencia.DiasFeriadosHabilitados');
//Modelo de la vista del componente.
Pvd.ControlAsistencia.DiasFeriadosHabilitados.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Store del grid de tipo de dia
        this.storeGruposRegimen = new Ext.data.GroupingStore({
            url: 'cargarGruposRegimen',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idgrupodescanso"
            }, [{name: 'idgrupodescanso'},
                {name: 'denominacion'},
                {name: 'descripcion'},
                {name: 'fdesde'},
                {name: 'fhasta'},
                {name: 'idregimentrabajo'},
                {name: 'denregimentrabajo'},
                {name: 'horastrabajo'},
                {name: 'tipofondotiempo'},
                {name: 'fondotiempo'}
            ]),
            baseParams:{
                criterio:-1
            },
            sortInfo: {field: 'denregimentrabajo', direction: "ASC"},
            groupField:'denregimentrabajo'
        });

        this.fuenteDatosListado = new Ext.data.GroupingStore({
            remoteGroup: true,
            remoteSort: true,
            url: 'getpersonasByIdGrupoDescanso',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'}, {name:'nombreapellidos'},{name:'denomcargo'},{name:'entidad'},{name:'area'}]
            ),
            sortInfo: {field: 'area', direction: "ASC"},
            groupField:'area'
        });

        this.recQrElement = new Ext.data.Record.create(
            {name:'idpersona'}, {name:'nombreapellidos'},{name:'denomcargo'},{name:'entidad'},{name:'area'}
        );

        this.storeDiasFeriados = new Ext.data.Store({
            url: 'getDiasFeriados',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "fecha", totalProperty: "cantidad"},
                [{name:'iddiaferiadohabilitado'},{name:'idpersona'},{name:'fecha'}, {name:'habilitado'}/*,{name:'horas'}*/]
            )
        });

        this.stHoras = new Ext.data.SimpleStore({
            fields: ['hora'],
            data : [['1'],['2'],['3'],['4'],['5'],['6'],['7'],['8'],['9'],['10'],
                ['11'],['12'],['13'],['14'],['15'],['16'],['17'],['18'],['19'],['20'],
                ['21'],['22'],['23'],['24']]
        });

	}
	
};


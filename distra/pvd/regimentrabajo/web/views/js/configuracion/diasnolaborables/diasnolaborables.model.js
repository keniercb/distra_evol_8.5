Ext.QuickTips.init();
Ext.ns('Ext.Zeolides.Diasnolaborables');

Ext.Zeolides.Diasnolaborables.Modelo = {

	init: function () {
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
                {name: 'fondotiempo'},
                {name: 'predeterminado'},
            ]),
            baseParams:{
                criterio:-1
            },
            sortInfo: {field: 'denregimentrabajo', direction: "ASC"},
            groupField:'denregimentrabajo'
        });

        this.storeTurnoTrabajo = new Ext.data.JsonStore({
            url: 'obtenerTurnoTrabajo',
            root: 'datos',
            fields:['idturnotrabajo','denominacion']
        });

        //Store del grid de dias no laborables
        this.storegridDiasNoLaborables = new Ext.data.GroupingStore({
            url: 'cargarDias',
            reader:new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idcalendario"
            }, [{name: 'idcalendario'},
                {name: 'idtipodedia'},
				{name: 'horas'},
                {name: 'fecha'},
                {name: 'descripcion'},
                {name: 'idgrupodescanso'},
                {name: 'dentipodia'},
                {name: 'tieneasistencia'}
            ]),
            baseParams:{
                criterio:-1
            },
            sortInfo: {field: 'dentipodia', direction: "ASC"},
            groupField:'dentipodia'
        });

        this.storeTipodia = new Ext.data.JsonStore({
			url: 'cargatTipoDias',
			root: 'datos',
			fields:['idtipodedia','denominacion','color','trabajo', 'feriado']
		});

        this.storeCbRegimentrabajo = new Ext.data.JsonStore({
			url: 'cargaRegimentrabajo',
			root: 'datos',
			fields:['idregimentrabajo','denominacion']
		});

        this.storeCbRegimentrabajoPer = new Ext.data.JsonStore({
            url: 'cargaRegimentrabajo',
            root: 'datos',
            fields:['idregimentrabajo','denominacion','tipofondotiempo']
        });

        this.storeResumenRTD = new Ext.data.JsonStore({
            url: 'getResumen',
            root: 'datos',
            fields:['key','mes','cantidad']
        });

        this.storeResumenQuincenal = new Ext.data.JsonStore({
            url: 'getResumenQuincenal',
            root: 'datos',
            fields:['key','mes','primquincena','segquincena','cantidad']
        });

        this.storeRangoFechas = new Ext.data.JsonStore({
            url: 'getRangosFechas',
            root: 'datos',
            fields:['key','mes','desde','hasta']
        });

        this.storeRangoFechasQuincenal = new Ext.data.JsonStore({
            url: 'getRangosFechasQuincenal',
            root: 'datos',
            fields:['key','mes','desdeprimquincena','hastaprimquincena','desdesegquincena','hastasegquincena']
        });
		
		this.stHoras = new Ext.data.SimpleStore({
			fields: ['hora'],
			data : [['01'],['02'],['03'],['04'],['05'],['06'],['07'],['08'],['09'],['10'],
					['11'],['12'],['13'],['14'],['15'],['16'],['17'],['18'],['19'],['20'],
					['21'],['22'],['23'],['24']]
		});

        this.stLimites = new Ext.data.Store({
            url: 'getLimites',
            reader: new Ext.data.JsonReader({
                totalProperty: '', root: '', id: 'id'
            }, [
                {name: 'id'},
                {name: 'denominacion'},
                {name: 'limite'}
            ])
        });

        this.storeGrupos = new Ext.data.Store({
            url: 'cargarGruposByIdRegimen',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idgrupodescanso'
            }, [
                {name: 'idgrupodescanso'},
                {name: 'denominacion'},
                {name: 'orden'}
            ]),
            sortInfo: {field: 'orden', direction: "ASC"},
        });

     this.storeTurnos = new Ext.data.Store({
            url: 'obtenerTurnoTrabajo',
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad', root: 'datos', id: 'idturnotrabajo'
            }, [
                {name: 'idturnotrabajo'},
                {name: 'denominacion'},
                {name: 'horainicio'},
                {name: 'horafin'},
                {name: 'otrodia'}
            ])
        });

        this.fuenteDatosListado = new Ext.data.GroupingStore({
            remoteSort: true,
            remoteGroup: true,
            url: 'getPersonas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name: 'idpersona'}, {name: 'nombreapellidos'}, {name: 'idgrupodescanso'}, {name: 'grupodescanso'}, {name: 'idregimentrabajo'}, {name: 'idcargo'},
                    {name: 'denomcargo'}, {name: 'idarea'}, {name: 'denomarea'}]
            ),
            sortInfo: {field: 'grupodescanso', direction: "ASC"},
            groupField: 'grupodescanso'
        });

    }

}


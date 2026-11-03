/*
 * Movimiento de personas.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Movimientoslaborales
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Movimientoslaborales');

Pvd.Fuerzatrabajo.Movimientoslaborales.Modelo = {
    init: function () {
        this.stPersonas = new Ext.data.GroupingStore({
            id: 'stpers1',
            url: 'getPersonas',
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idsituacionlaboralp", totalProperty: "cantidad"},
                    [{name: 'idpersona'}, {name: 'numid'}, {name: 'nombreyapellidos'}, {name: 'idsituacion'}, {name: 'situacion'}, {name: 'idsituacionlaboralp'}, {name: 'cargo'},
                        {name: 'idcargo'}, {name: 'idtipocontrato'}, {name: 'tipocontrato'}, {name: 'cantd'}, {name: 'idcandidato'}, {name: 'area'}, {name: 'idarea'}, {name: 'p'},
                        {name: 'identidad'}, {name: 'entidad_area'}, {name: 'fdesde'}, {name: 'fhasta'}, {name: 'idprocedenciasocial'}, {name: 'procedencia'}, {name: 'ueb'}, {name: 'estado'},
                        {name: 'vencido'}, {name: 'orden'}, {name: 'idprogramalaboral'}, {name: 'denominacion'}, {name: 'temporal'}, {name: 'idespcargo'}, {name: 'noalta'}, {name: 'categoria'},
                        {name: 'determinado'}, {name: 'idueb'}, {name: 'entidad'}, {name: 'idmodalidadempleo'}, {name: 'modalidadempleo'}, {name: 'faltaentidad'}, {name: 'principal'}]
                    ),
            sortInfo: {
                field: 'orden',
                direction: "ASC"
            },
            groupField: 'entidad_area',
            remoteGroup: true
        });

        //Store de las variantes
        this.stVariantes = new Ext.data.SimpleStore({
            fields: ['id', 'variante'],
            data: [
                [1, 'Entidades Estatales '],
                [2, 'Sociedades Mercantiles '],
                [3, 'Asociaciones y Fundaciones'],
                [4, 'Organizaciones Políticas y de Masas ']

            ]
        });
        ////////////store de los titulos
        // this.stTituloER = new Ext.data.Store({
        //     url: '/pvd/movimientoslaborales/index.php/Movimientopersona/titulosEr',   
        //     autoLoad: true,
        //     reader: new Ext.data.JsonReader(
        //         {root: "datos",  id:"idtitulo"  },
        //         [{name: 'codigo'}, {name: 'denominacion'}]
        //     )
        // });

        this.stEspecialidad = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/Movimientopersona/especialidadER',
            autoLoad: true,
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idespecialidad"},
                    [{name: 'idespecialidad'}, {name: 'denespecialidad'}]
                    )
        });
        /////////  periodos de pago 
        this.stFechaCierre = new Ext.data.GroupingStore({
            url: '/pvd/movimientoslaborales/index.php/Movimientopersona/obtenerResumenesPeriodosPago',
            //autoLoad:true,
            sortInfo: {field: 'annoall', direction: "DESC"},
            groupField: 'anno',
            reader: new Ext.data.JsonReader({
                totalProperty: "cantidad",
                root: "datos",
                id: "idfechascierre"
            }, [{name: 'idfechascierre'}
                , {name: 'anno'}
                , {name: 'annoall'}
                , {name: 'fechacierre'}
                , {name: 'identidad'}
                , {name: 'estado'}
            ])
        });

        this.stTipoContrato = new Ext.data.Store({
            url: 'getTiposContrato',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "idtipocontrato"},
                    [{name: 'idtipocontrato'}, {name: 'denominacion'}, {name: 'determinado'}, {name: 'idplantilla'}, {name: 'descripcion'}]
                    )
        });

        this.stProcedenciaSocial = new Ext.data.Store({
            url: 'getProcedenciaSocial',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "idprocedenciasocial"},
                    [{name: 'idprocedenciasocial'}, {name: 'denominacion'}]
                    )
        });

        this.tlSituacion = new Ext.tree.TreeLoader({
            dataUrl: 'getSituacion',
            preloadChildren: false
        });

        this.tlMotivoBaja = new Ext.tree.TreeLoader({
            dataUrl: 'getMotivoBaja',
            preloadChildren: false
        });

        this.tlProcedencia = new Ext.tree.TreeLoader({
            dataUrl: 'getProcedenciaSocial',
            preloadChildren: false
        });

        this.tlcargos = new Ext.tree.TreeLoader({
            dataUrl: 'getEstructuraCargo',
            preloadChildren: false
        });

        this.tlMotivoMovimiento = new Ext.tree.TreeLoader({
            dataUrl: 'getMotivoMovimiento',
            preloadChildren: false
        });

        this.sttipoFiltro = new Ext.data.SimpleStore({
            fields: ['id', 'tipo'],
            data: [
                [1, 'Personas seleccionadas'],
                [2, 'Personas sin situación'],
                [3, 'Todas'],
                [4, 'Reserva']
            ]
        });

        this.stCargosEsp = new Ext.data.Store({
            url: 'getEspecializacionesByCargo',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "id"},
                    [{name: 'id'}, {name: 'denominacion'}]
                    )
        });

        this.stPrograma = new Ext.data.Store({
            url: 'getPrograma',
            reader: new Ext.data.JsonReader(
                    {root: "datos", totalProperty: "cantidad"},
                    [{name: 'idprogramalaboral'}, {name: 'denominacion'}, {name: 'descripcion'}]
                    )
        });

        this.stProgramaM = new Ext.data.Store({
            url: 'getPrograma',
            reader: new Ext.data.JsonReader(
                    {root: "datos", totalProperty: "cantidad"},
                    [{name: 'idprogramalaboral'}, {name: 'denominacion'}, {name: 'descripcion'}]
                    )
        });

        this.stCargosEspMov = new Ext.data.Store({
            url: 'getEspecializacionesByCargo',
            reader: new Ext.data.JsonReader(
                    {root: "", id: "id"},
                    [{name: 'id'}, {name: 'denominacion'}]
                    )
        });

        this.stSuplementos = new Ext.data.Store({
            url: '/pvd/movimientoslaborales/index.php/nomencladores/getSuplementos',
            reader: new Ext.data.JsonReader(
                    {root: "datos", totalProperty: "cantidad"},
                    [{name: 'idsuplemento'}, {name: 'denominacion'}, {name: 'idplantilla'}, {name: 'tipoplantilla'}]
                    )
        });

        this.stElaborado = new Ext.data.Store({
            url: 'getElaborado',
            reader: new Ext.data.JsonReader(
                    {root: "datos", totalProperty: "cantidad"},
                    [{name: 'idpersona'}, {name: 'nombreapellidos'}, {name: 'cargo'}]
                    )
        });

        this.stAprobado = new Ext.data.Store({
            url: 'getAprobado',
            reader: new Ext.data.JsonReader(
                    {root: "datos", totalProperty: "cantidad"},
                    [{name: 'idpersona'}, {name: 'nombreapellidos'}, {name: 'cargo'}]
                    )
        });

        this.stModalidadEmpleo = new Ext.data.Store({
            url: 'getModalidadesempleo',
            reader: new Ext.data.JsonReader(
                    {root: "", totalProperty: "cantidad"},
                    [{name: 'idmodalidadempleo'}, {name: 'denominacion'}, {name: 'descripcion'}]
                    )
        });

        this.stConfigUEB = new Ext.data.GroupingStore({
            url: 'obtenerConfigUEB',
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idestructura", totalProperty: ""},
                    [{name: 'idestructura'}, {name: 'estructura'}, {name: 'identidad'}, {name: 'entidad'}]
                    ),
            sortInfo: {
                field: 'entidad',
                direction: "DESC"
            },
            groupField: 'entidad'
        });

        this.stConfirmarTraslados = new Ext.data.Store({
            url: 'obtenerTrasladosUeb',
            reader: new Ext.data.JsonReader(
                    {root: "datos", id: "idtraslado"},
                    [
                        {name: 'idtraslado'},
                        {name: 'idpersona'},
                        {name: 'idsituacionlaboral'},
                        {name: 'idueb'},
                        {name: 'ci'},
                        {name: 'nombreyapellido'},
                        {name: 'ueb'}
                    ]
                    )
        });
    }
};
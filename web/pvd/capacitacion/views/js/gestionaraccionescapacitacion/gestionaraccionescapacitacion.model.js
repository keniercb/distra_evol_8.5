
/*
 * Gestionar acción de capacitación.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Capacitacion
 * @uses Pvd.Capacitacion.Gestionaraccion
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.Capacitacion.Gestionaraccion');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.Capacitacion.Gestionaraccion.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de acciones.
        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getAccionescapacitacion',
            method : 'POST'
        });

        this.stAcciones = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccion", totalProperty: "cantidad"},
                [{name:'idaccion'},{name:'denominacion'}, {name:'modoformacion'}, {name:'tipoaccion'}, {name:'duracion'}, {name:'observaciones'},
                 {name:'lugar'}, {name:'categorias'}, {name:'idscategorias'}, {name:'idmodoformacion'}, {name:'idtipoaccion'}, {name:'fdesde'},
                 {name:'fhasta'}, {name:'frdesde'}, {name:'frhasta'}, {name:'estructura'}, {name:'curso'}, {name:'estado'}, {name: 'necesidades'}]
            ),
            sortInfo   : {
                field: 'estructura',
                direction: "DESC"
            },
            groupField : 'estructura',
            remoteGroup: true
        });

        //Fuente de datos del listado de personas.
        var connObjPer = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getPersonas',
            method : 'POST'
        });

        this.stPersonas = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObjPer),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idpersona", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'}, {name:'area'}, {name:'orden'},
                    {name:'identidad'}, {name:'entidad'}, {name:'entidad_area'}, {name:'categoria'}, {name:'idcategoria'}]
            ),
            sortInfo   : {
                field: 'orden',
                direction: "DESC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        //Fuente de datos del listado de participantes.
        this.stParticipantes = new Ext.data.Store({
            url: 'getParticipantes',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccionparticipante", totalProperty: "cantidad"},
                [{name:'idaccionparticipante'}, {name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
                  {name:'categoria'}, {name:'terminado'}, {name:'resultado'}, {name:'observacion'}, {name:'alerta'}]
            )
        });

        //Fuente de datos del listado de cursos.
        this.stCursosNom = new Ext.data.Store({
            url: 'getCursosNom',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcurso", totalProperty: "cantidad"},
                [{name:'idcurso'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        this.stCursos = new Ext.data.Store({
            url: 'getCursos',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccioncurso", totalProperty: "cantidad"},
                [{name:'idaccioncurso'}, {name:'idaccion'},{name:'idcurso'}, {name:'denominacion'}, {name:'fdesde'}, {name:'fhasta'}
                  , {name:'descripcion'}, {name:'profesor'}, {name:'frdesde'}, {name:'frhasta'}, {name:'estado'}]
            )
        });

        this.stCursosEval = new Ext.data.Store({
            url: 'getCursos',
            baseParams: {tipo: 2},
            reader: new Ext.data.JsonReader(
                {root: "", id: "idaccioncurso", totalProperty: "cantidad"},
                [{name:'idaccioncurso'}, {name:'idaccion'},{name:'idcurso'}, {name:'denominacion'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'descripcion'}, {name:'profesor'}, {name:'frdesde'}, {name:'frhasta'},
                {name:'resultadocurso'}, {name:'idparticipantecurso'}]
            )
        });

        //Fuente de datos del listado de aseguramientos.
        this.stAseguramientos = new Ext.data.Store({
            url: 'getAseguramientos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idaseguramiento", totalProperty: "cantidad"},
                [{name:'idaseguramiento'}, {name:'idaccionaseguramiento'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de necesidades.
        this.stAccionNecesidades = new Ext.data.Store({
            url: 'getNecesidadesByAccionTodosNomen',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idnecesidad", totalProperty: "cantidad"},
                [{name:'idnecesidad'}, {name:'idaccionnecesidad'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de modos de formación.
        this.stModoFormacion = new Ext.data.Store({
            url: 'getModoFormacion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idmodoformacion"},
                [{name:'idmodoformacion'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de tipos de accion
        this.stTipoAccion = new Ext.data.Store({
            url: 'getTipoaccion',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idtipoaccion"},
                [{name:'idtipoaccion'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de categorias.
        this.stCategorias = new Ext.data.Store({
            url: 'getCategorias',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcategoria"},
                [{name:'idcategoria'},{name:'denominacion'},{name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de necesidades vencidas.
        this.stNecesidadesVencidas = new Ext.data.Store({
            url: 'getNecesidadesByAccionPersonaTodos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idnecesidad", totalProperty: "cantidad"},
                [{name:'idnecesidad'}, {name:'iddnecesidad'}, {name:'necesidad'},
                    {name:'idpersona'}, {name:'fregistro'}, {name:'fvencida'}]
            )
        });

        this.stIndPartic = new Ext.data.GroupingStore({
            url: 'getIndicadoresParticipante',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idevalimpacto", totalProperty: "cantidad"},
                [{name:'idevalimpacto'},{name:'idindicador'},{name:'indicador'}, {name:'periodo'}, {name:'idperiodo'},
                 {name:'idvalor'}, {name:'valor'}, {name:'complemento'}, {name:'fecha'}]
            ),
            sortInfo   : {
                field: 'periodo',
                direction: "DESC"
            },
            groupField : 'periodo',
            remoteGroup: true
        });

        //Fuente de datos del listado de indicadores.
        this.stIndicadores = new Ext.data.Store({
            url: 'getIndicadores',
            baseParams: {activo: 1},
            reader: new Ext.data.JsonReader(
                {root: "", id: "idindicador"},
                [{name:'idindicador'}, {name:'idescala'}, {name:'denominacion'},
                 {name:'fdesde'}, {name:'fhasta'}, {name:'descripcion'}]
            )
        });

        this.stPeriodos = new Ext.data.Store({
            url: 'getPeriodos',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idperiodo"},
                [{name:'idperiodo'}, {name:'denominacion'},
                    {name:'fdesde'}, {name:'fhasta'}, {name:'descripcion'}]
            )
        });

        this.stValores = new Ext.data.Store({
            url: 'getValoresInd',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name:'idvalor'}, {name:'valor'}]
            )
        });
    }
};

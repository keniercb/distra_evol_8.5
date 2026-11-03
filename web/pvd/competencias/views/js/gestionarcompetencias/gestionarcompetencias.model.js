/**
 * @name GestionarCompetenciasOrganizacion.model - Modelo de la interfaz.
 * @package   Pvd.Competencia
 * @uses      Pvd.Competencia.GestionarCompetenciasOrganizacion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 *            Eddy Santana Navarro
 * @version   1.0
 */
Ext.ns('Pvd.Competencia.GestionarCompetencias');
Ext.QuickTips.init();
Pvd.Competencia.GestionarCompetencias.Modelo = {
    init: function (idioma) {

        this.stEscala = new Ext.data.Store({
            url   : 'mostrarEscala',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idescala"},
                [{name: 'idescala'}, {name: 'denominacion'}]
            )
        });
        this.stNivelesCompetencias = new Ext.data.Store({
            url      : 'mostrarNivelesCompetencia',
            reader   : new Ext.data.JsonReader(
                {root: "", id: "idnivelcompetencia"},
                [{name: 'idnivelcompetencia'}, {name: 'valorescala'}, {name: 'descripcion'}, {name: 'idescala'}, {name: 'idvalorescala'}]
            ),
            listeners: {
                load: function (st) {
                    if (st.getCount() == 0 && (st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');

                    }
                    else if (st.getCount() == 0 && (!st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen niveles de competencias asociados.');
                    }
                }
            }
        });

        this.stValorEscala = new Ext.data.Store({
            url         : 'mostrarValorEscala',
            reader      : new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name: 'idvalor'}, {name: 'valor'}, {name: 'tipoescala'}, {name: 'idescala'}]
            ), listeners: {
                load: function (st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, 'No existen valores escalas asociados a la escala de la competencia seleccionada.');
                    }
                }
            }
        });
        this.stValorEscalaP = new Ext.data.Store({
            url         : 'mostrarValorEscala',
            reader      : new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name: 'idvalor'}, {name: 'valor'}, {name: 'tipoescala'}, {name: 'idescala'}]
            ), listeners: {
                load: function (st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, 'No existen valores escalas asociados a la escala de la competencia seleccionada.');
                    }
                }
            }
        });
        this.stValorEscalaC = new Ext.data.Store({
            url         : 'mostrarValorEscala',
            reader      : new Ext.data.JsonReader(
                {root: "", id: "idvalor"},
                [{name: 'idvalor'}, {name: 'valor'}, {name: 'tipoescala'}, {name: 'idescala'}]
            ), listeners: {
                load: function (st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, 'No existen valores escalas asociados a la escala de la competencia seleccionada.');
                    }
                }
            }
        });
        this.stClasificacion = new Ext.data.Store({
            url   : 'mostrarClasificacionCompetencias',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idclasifcompetencia"},
                [{name: 'idclasifcompetencia'}, {name: 'denominacion'}]
            )
        });
        this.stCompetenciasEstructura = new Ext.data.GroupingStore({
            url        : 'mostrarCompetenciasEstructura',
            reader     : new Ext.data.JsonReader(
                {root: "datos", id: "iddcompetencia", totalProperty: "cantidad"},
                [
                    {name: 'iddcompetencia'},
                    {name: 'idestructura'},
                    {name: 'denominacion'},
                    {name: 'fdesde'},
                    {name: 'fhasta'},
                    {name: 'escala'},
                    {name: 'idescala'},
                    {name: 'clasificacion'},
                    {name: 'idclasifcompetencia'},
                    {name: 'idcompetencia'},
                    {name: 'idvalorescala'},
                    {name: 'nivelrequerido'},
                    {name: 'orden'},
                    {name: 'denomarea'}
                ]
            ),
            sortInfo   : {
                field    : 'idestructura', // iddcompetencia
                direction: "DESC"
            },
            groupField : 'denomarea',
            remoteGroup: true,
            listeners  : {
                load: function (st) {
                    if (st.getCount() == 0 && (st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');

                    }
                    else if (st.getCount() == 0 && (!st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen competencias en la estructura seleccionada');
                    }
                }
            }
        });
        this.stCompetenciasProcesos = new Ext.data.GroupingStore({
            url        : 'mostrarCompetenciasProcesos',
            reader     : new Ext.data.JsonReader(
                {root: "datos", id: "iddcompetencia", totalProperty: "cantidad"},
                [
                    {name: 'iddcompetencia'},
                    {name: 'idproceso'},
                    {name: 'denominacion'},
                    {name: 'denominacionproceso'},
                    {name: 'fdesde'},
                    {name: 'fhasta'},
                    {name: 'escala'},
                    {name: 'idescala'},
                    {name: 'idestructura'},
                    {name: 'clasificacion'},
                    {name: 'idclasifcompetencia'},
                    {name: 'idcompetencia'},
                    {name: 'idvalorescala'},
                    {name: 'nivelrequerido'},
                    {name: 'orden'},
                    {name: 'denomarea'},
                    {name: 'idcompetenciaproc'}
                ]
            ),
            sortInfo   : {
                field    : 'idestructura',
                direction: "DESC"
            },
            groupField : 'denomarea',
            remoteGroup: true,
            listeners  : {
                load: function (st) {
                    if (st.getCount() == 0 && (st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');

                    }
                    else if (st.getCount() == 0 && (!st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen competencias por procesos en la estructura seleccionada');
                    }
                }
            }
        });
        this.stProcesos = new Ext.data.Store({
            url         : 'mostrarProcesos',
            reader      : new Ext.data.JsonReader(
                {root: "", id: "idproceso"},
                [{name: 'idproceso'}, {name: 'denominacion'}, {name: 'idprocesoestructura'}, {name: 'idestructura'}, {name: 'fdesde'}, {name: 'fhasta'}]
            ), listeners: {
                load: function (st) {
                    if (st.getCount() == 0) {
                        mostrarMensaje(1, 'No existen procesos asociados a la estructura seleccionada.');
                    }
                }
            }
        });
        this.stCompetencias = new Ext.data.Store({
            url   : 'mostrarCompetencias',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcompetencia"},
                [{name: 'idcompetencia'}, {name: 'denominacion'}, {name: 'idescala'}, {name: 'fdesde'}, {name: 'fhasta'}]
            )
        });
        this.stCompetenciasCargos = new Ext.data.GroupingStore({
            url        : 'mostrarCompetenciasCargos',
            reader     : new Ext.data.JsonReader(
                {root: "datos", id: "iddcompetencia", totalProperty: "cantidad"},
                [
                    {name: 'iddcompetencia'},
                    {name: 'idcargo'},
                    {name: 'idcompetenciacargo'},
                    {name: 'denominacion'},
                    {name: 'fdesde'},
                    {name: 'fhasta'},
                    {name: 'escala'},
                    {name: 'idescala'},
                    {name: 'clasificacion'},
                    {name: 'idclasifcompetencia'},
                    {name: 'idcompetencia'},
                    {name: 'idvalorescala'},
                    {name: 'nivelrequerido'},
                    {name: 'orden'},
                    {name: 'denomarea'}
                ]
            ),
            sortInfo   : {
                field    : 'idcargo',
                direction: "DESC"
            },
            groupField : 'denomarea',
            remoteGroup: true,
            listeners  : {
                load: function (st) {
                    if (st.getCount() == 0 && (st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');

                    }
                    else if (st.getCount() == 0 && (!st.baseParams.busqueda)) {
                        mostrarMensaje(1, 'No existen competencias por cargos que mostrar');
                    }
                }
            }
        });

    }
};
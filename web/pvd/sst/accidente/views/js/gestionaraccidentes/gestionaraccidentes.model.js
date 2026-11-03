/*
 * Gestionar Accidentes.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.SST
 * @uses Pvd.SST.Gestionaraccidentes
 * @copyright XETID
 * @version 1.0
 */
 
 Ext.ns('Pvd.SST.Gestionaraccidentes');

///////////////////////////////////////Modelo de la Interfaz///////////////////////////////////////////////////////

Pvd.SST.Gestionaraccidentes.Modelo = {
    /**
     * Inicializar el modelo de la vista.
     */
    init: function() {

        //Fuente de datos del listado de accidentes.
        var connObj = new Ext.data.Connection({
            timeout : 3600000,
            url: 'getAccidentes',
            method : 'POST'
        });

        this.stAccidentes = new Ext.data.GroupingStore({
            proxy: new Ext.data.HttpProxy(connObj),
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccidente", totalProperty: "cantidad"},
                [{name:'idaccidente'},{name:'tipoaccidente'}, {name:'idtipoaccidente'}, {name:'formaaccidente'}, {name:'estructura'},
                 {name:'idformaaccidente'}, {name:'tipoagente'}, {name:'lugar'}, {name:'idtipoagente'}, {name:'agente'},
                 {name:'idagente'}, {name:'fecha'}, {name:'hora'}, {name:'descripcion'}, {name:'equiparado'}, {name:'equip'}]
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

        this.stComision = new Ext.data.Store({
            url: 'getComisiones',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idcomision", totalProperty: ""},
                [{name:'idcomision'},{name:'denominacion'},{name:'idaccidentecomision'}]
            )
        });

        //Fuente de datos del listado de implicados.
        this.stImplicados = new Ext.data.Store({
            url: 'getParticipantes',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idaccionparticipante", totalProperty: "cantidad"},
                [{name:'idaccionparticipante'}, {name:'idpersona'}, {name:'numid'}, {name:'nombreyapellidos'}, {name:'cargo'},
                  {name:'categoria'}, {name:'terminado'}, {name:'resultado'}, {name:'observacion'}, {name:'alerta'}]
            )
        });

        //Fuente de datos del listado de tipos de accidentes.
        this.stTiposAcc = new Ext.data.Store({
            url: 'getTiposAccidente',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idtipoaccidente", totalProperty: "cantidad"},
                [{name:'idtipoaccidente'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        this.stFormaAcc = new Ext.data.Store({
            url: 'getFormasAccidente',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idformaaccidente", totalProperty: "cantidad"},
                [{name:'idformaaccidente'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de tipos de agente.
        this.stTiposAgente = new Ext.data.Store({
            url: 'getTiposAgente',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idtipoagente", totalProperty: "cantidad"},
                [{name:'idtipoagente'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });

        //Fuente de datos del listado de agente.
        this.stAgente = new Ext.data.Store({
            url: 'getAgentes',
            reader: new Ext.data.JsonReader(
                {root: "", id: "idagente", totalProperty: "cantidad"},
                [{name:'idagente'},{name:'denominacion'}, {name:'descripcion'}]
            )
        });
    }
};

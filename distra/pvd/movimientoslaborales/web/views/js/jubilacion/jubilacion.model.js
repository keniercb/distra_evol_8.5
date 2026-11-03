/*
 * Jubilacion.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Fuerzatrabajo
 * @uses Pvd.Fuerzatrabajo.Jubilacion
 * @copyright XETID
 * @version 1.0
 */

Ext.ns('Pvd.Fuerzatrabajo.Jubilacion');

Pvd.Fuerzatrabajo.Jubilacion.Modelo = {
    init: function() {
        this.stPersonasTrab = new Ext.data.GroupingStore({
            url: 'getPersonas',
            reader: new Ext.data.JsonReader(
                {root: "datos", id: "idsituacionlaboralp", totalProperty: "cantidad"},
                [{name:'idpersona'},{name:'numid'}, {name:'nombreyapellidos'}, {name:'idsituacionlaboralp'}, {name:'cargo'},
                 {name:'idcargo'}, {name:'idtipocontrato'}, {name:'tipocontrato'}, {name:'area'}, {name:'idarea'}, {name:'p'},
                 {name:'identidad'}, {name:'entidad_area'}, {name:'fdesde'}, {name:'fhasta'}, {name:'ueb'}, {name:'estado'},
                    {name: 'idueb'}, {name: 'entidad'}, {name: 'faltaentidad'}, {name: 'edad'}]
            ),
            sortInfo   : {
                field: 'p',
                direction: "ASC"
            },
            groupField : 'entidad_area',
            remoteGroup: true
        });

        this.stTrayectoria = new Ext.data.Store({
            url: 'getTrayectoriaLaboral',
            reader: new Ext.data.JsonReader(
                {root: "", id: "id"},
                [{name:'idcargo'},{name:'cargo'},{name:'fdesde'},{name:'fhasta'}]
            )
        });

        this.stSalarios = new Ext.data.Store({
            url: 'getSalarios',
            reader: new Ext.data.JsonReader(
                {root: "", id: "anno"},
                [{name:'anno'},{name:'salario'},{name:'meses'}]
            )
        });
    }
};
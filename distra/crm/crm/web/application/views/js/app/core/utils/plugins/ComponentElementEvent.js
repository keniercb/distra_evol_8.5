/**
 * Esta plugin agrega los eventos del Ext.Element correspondiente a un Ext.Component a este ultimo.
 *
 * @author  Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 */

Ext.define('CRM.plugins.ComponentElementEvent', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugins.cmp-el-event',

    /**
     * @cfg {String | Array} eventName Nombre (o arreglo de nombres) de los eventos a escuchar, 'click' y 'dblclick' por defecto
     */
    eventName: ['click','dblclick'],

    /**
     * @cfg {String} compEl Nombre del elemento dentro del componente para aplicar el evento, 'body' por defecto (para el cuerpo)
     * tambien puede ser 'el' (para el header)
     */
    compEl: 'body',

    init: function (cmp) {
        var scope = this;
        if (typeof this.eventName === "string") {
            cmp.on(this.eventName, this.handleEvent, this, {element: this.compEl});
        } else if (Ext.isArray(this.eventName)) {
            this.eventName.every(function (evt) {
                if (typeof evt === "string") {
                    cmp.on(evt, scope.handleEvent, scope, {element: scope.compEl});
                }
                return true;
            });
        }
    },
    handleEvent: function (e, t) {
        var eventName = e.type || this.eventName;
        this.getCmp().fireEvent(eventName, this.getCmp(), e, t);
    }
});
/**
 Uso:Componente para listar los periodos por destajo
 * @extends   Ext.Panel
 * @xtype
 * @autor     Linea Capital Humano - Ing. Aroldo L. Hechavarría Hechavarría
 */
Ext.ns('Pvd.Nomina.PagoDestajo');
Ext.QuickTips.init();
Pvd.Nomina.PagoDestajo.Utils = function () {
    return {
        loadMask: function (msj, cmp) {
            var componente = (!cmp) ? Ext.getBody() : cmp.body;
            this.lMask = new Ext.LoadMask(componente, {
                msg: msj
            });
            this.lMask.show();
        },
        hideMask: function () {
            this.lMask.hide();
        }
    }
};
var utils = new Pvd.Nomina.PagoDestajo.Utils();

/*Componente*/

/**
 * Created by Rubier on 22/07/2015.
 */
Ext.namespace('Planificacion.Integracion');
Planificacion.Integracion.ImpactocruzadoComponent = ExtExtend.Class({
    $extend: Ext.Panel,
    frame: false,
    border: false,
    layout: 'border',
    region: this.region ? this.region : 'center',
    idestudio: this.idestudio,
    west: this.west ? this.west : true,
    pnTbar: this.pnTbar ? this.pnTbar : true,
    pnBbar: this.pnBbar ? this.pnBbar : true,
    pnTitle: this.pnTitle ? this.pnTitle : true,
    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.ImpactocruzadoController();
        me.etiquetas = me.controller._getLabel('Impactocruzado');

        if (me.west) {
            me.variablesPanel = new Planificacion.Integracion.VariablesPanel({
                controller: me.controller,
                objproyecto: me.objproyecto,
                idestudio: me.idestudio,
                split: true,
                minWidth: 300,
                maxWidth: 400
            });
        }

        me.matrizPanel = new Planificacion.Integracion.MatrizPanel({
            controller: me.controller,
            objproyecto: me.objproyecto,
            idestudio: me.idestudio,
            denominacion: me.denominacion,
            pnTbar: me.pnTbar,
            pnBbar: me.pnBbar,
            pnTitle: me.pnTitle,
            diagrama: true
        });

        me.items = me.west ? [me.variablesPanel, me.matrizPanel] : [me.matrizPanel];

        Planificacion.Integracion.ImpactocruzadoComponent.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.ImpactocruzadoComponent', Planificacion.Integracion.ImpactocruzadoComponent);
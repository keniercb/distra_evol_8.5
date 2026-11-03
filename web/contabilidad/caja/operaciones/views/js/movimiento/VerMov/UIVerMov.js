Ext.namespace('Ext.UIVerMg');

Ext.UIVerMg = Ext.extend(Ext.Window, {
    constructor: function (scope, saldoCuentas, datosMg)
    {
        scope.btnVerCerrar = new Ext.Button({
            text: 'Cerrar',
            id: 'btnVerCerrar',
            tooltip: 'Cerrar',
            tabIndex: 409,
            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'btn',
            scope: this
        });

        scope.pVerDatosDocumentos = new Ext.Panel({
            title: scope.etiquetas.lbDocSeleccionados,
            region: (datosMg) ? 'center' : 'north',
            id: "panelreporte",
            height: (Ext.lib.Dom.getViewHeight() - 10) * 0.65,
            html: datosMg,
            autoScroll: true
        });

        scope.pVerResumenCuentas = new Ext.Panel({
            title: scope.etiquetas.lbResumenCuentas,
            region: (datosMg) ? 'south' : 'center',
            id: "panelimporte",
            height: (Ext.lib.Dom.getViewHeight() - 10) * 0.35,
            collapsible: (datosMg) ? true : false,
            split: true,
            html: saldoCuentas,
            autoScroll: true
        });

        Ext.apply(this, {
            modal: true,
            id: 'wVerMg',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            height: Ext.lib.Dom.getViewHeight() - 10,
            border: false,
            closable: false,
            layout: 'border',
            defaultButton: 'btnVerCerrar',
            width: '80%',
            items: [scope.pVerDatosDocumentos, scope.pVerResumenCuentas],
            buttons: [scope.btnVerCerrar]
        });

        if (!datosMg)
            scope.pVerDatosDocumentos.hide();

        return Ext.UIVerMg.superclass.constructor.call(this);
    }
});

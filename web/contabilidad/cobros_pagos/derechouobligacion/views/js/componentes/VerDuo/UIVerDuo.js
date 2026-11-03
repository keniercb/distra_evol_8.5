Ext.namespace('Ext.UIVerDuo');

Ext.UIVerDuo = Ext.extend(Ext.Window, {
    constructor: function(scope, saldoCuentas, datosDuo)
    {
        scope.btnVerCerrar = new Ext.Button({
            text: 'Cerrar',
            id: 'btnVerCerrar',
            tooltip: 'Cerrar ventana',
            tabIndex: 409,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.pVerDatosDocumentos = new Ext.Panel({
            title: scope.etiquetas.lbDocSeleccionados.replace('<#artDuo>',scope.artTextoP.toLowerCase()).replace('<#tipoDuo>',scope.textDuoP.toLowerCase()).replace('<#select>',(scope.tipoDuo == '1' || scope.tipoDuo == '2') ? scope.etiquetas.lbSelFP : scope.etiquetas.lbSelMP),
            region: (datosDuo) ? 'center' : 'north',
            id: "panelreporte",
            height: (Ext.lib.Dom.getViewHeight() - 10) * 0.65,
            html: datosDuo,
            autoScroll: true
        });

        scope.pVerResumenCuentas = new Ext.Panel({
            title: scope.etiquetas.lbResumenCuentas,
            region: (datosDuo) ? 'south' : 'center',
            id: "panelimporte",
            height: (Ext.lib.Dom.getViewHeight() - 10) * 0.35,
            collapsible: (datosDuo) ? true : false,
            split: true,
            html: saldoCuentas,
            autoScroll: true
        });

        Ext.apply(this, {
            modal: true,
            id: 'wVerDuo',
            labelAlign: 'top',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            height: Ext.lib.Dom.getViewHeight() - 70,
            border: false,
            closable: true,
            defaultButton: 'btnVerCerrar',
            layout: 'border',
            width: '30%',
            constrain: true,
            items: [scope.pVerDatosDocumentos, scope.pVerResumenCuentas],
            buttons: [scope.btnVerCerrar]
        });

        if (!datosDuo)
            scope.pVerDatosDocumentos.hide();

        return Ext.UIVerDuo.superclass.constructor.call(this);
    }
});

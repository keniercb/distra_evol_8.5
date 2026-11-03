UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.inv.entrada.apertura.Idioma;
    var vistaApertura = new LOG.inv.entrada.apertura.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma
    });
    vistaApertura.attachPlugin(new LOG.lb.plugin.ComboDepositos());
    vistaApertura.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 2,
        firmas: [
            'creadopor',
            'aprobadopor'
        ]
    }));

    vistaApertura.init();
    vistaApertura.getPanelBusqueda().setColumns(1);

    vistaApertura.addFilterComponent(
        new LOG.util.ComboBox({
            fieldLabel: idioma.lbCbEstado,
            hiddenName: 'estado',
            valueField: 'idestado',
            displayField: 'estado',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [3, LOG.lb.documento.Estado[3]],
                    [5, LOG.lb.documento.Estado[5]]
                ]
            })
        })
    );

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'idusuario'
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbAprobadoPor,
            campo: 'aprobadopor',
            alias: 'aperturaLog',
            subsistema: 10,
            hiddenName: 'aprobadopor'
        })
    );

    vistaApertura.addFilterComponent(cls);

    var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    clsFecha.addComponent(
        new Ext.form.DateField({
            fieldLabel: idioma.lbDfDesde,
            name: 'desde',
            vtype: 'daterange',
            id: 'desde',
            endDateField: 'hasta',
            editable: false
        })
    );
    clsFecha.addComponent(
        new Ext.form.DateField({
            fieldLabel: idioma.lbDfHasta,
            name: 'hasta',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        })
    );

    vistaApertura.addFilterComponent(
        new Ext.form.FieldSet({
            title: idioma.lbFsRangoFecha,
            items: [clsFecha]
        })
    );

    vistaApertura.view();
});

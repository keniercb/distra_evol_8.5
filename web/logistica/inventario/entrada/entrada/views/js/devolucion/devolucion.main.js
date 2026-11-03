UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var gridPlugins = new LOG.util.List();
    gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));
    var idioma = LOG.inv.entrada.devolucion.Idioma;
    var vistaDevolucion = new LOG.inv.entrada.devolucion.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });
    vistaDevolucion.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vistaDevolucion.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'entregadopor',
            'recibido',
            'contabilizadopor'
        ]
    }));

    vistaDevolucion.init();
    vistaDevolucion.getPanelBusqueda().setColumns(1);

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    cls.addComponent(
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
                    [4, LOG.lb.documento.Estado[4]],
                    [5, LOG.lb.documento.Estado[5]],
                    [7, LOG.lb.documento.Estado[7]]
				]
            })
        })
    );
    cls.addComponent(
        new LOG.util.ComboBox({
            fieldLabel: idioma.lbCbTipoDocumento,
            hiddenName: 'tieneorigen',
            valueField: 'tieneorigen',
            displayField: 'origen',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['tieneorigen', 'origen'],
                data: [
                    [1, idioma.lbValeEntrega],
                    [2, idioma.lbFactura]
                ]
            })
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'valedev',
            subsistema: 10,
            hiddenName: 'idusuario'
        })
    );
    cls.addComponent(
        new LOG.util.ComboBox({
            fieldLabel: idioma.lbCbContabilizadoPor,
            campo: 'aprobadopor',
            alias: 'valedev',
            subsistema: 10,
            hiddenName: 'aprobadopor'
        })
    );
    vistaDevolucion.addFilterComponent(cls);

    var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    clsFecha.addComponent(
        new Ext.form.DateField({
            fieldLabel: idioma.lbDfDesde,
            name: 'desde',
            xtype: 'datefield',
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
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        })
    );

    vistaDevolucion.addFilterComponent(
        new Ext.form.FieldSet({
            title: idioma.lbFsRangoFecha,
            items: [clsFecha]
        })
    );

    vistaDevolucion.view();
});

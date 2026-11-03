UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var gridPlugins = new LOG.util.List();
    gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));
    var vistaAjusteInventario = new LOG.inv.ajuste.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        idioma: LOG.inv.ajuste.Idioma,
        gridPlugins
    });
    vistaAjusteInventario.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vistaAjusteInventario.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'creadopor',
            'autorizadopor',
            'contabilizadopor'
        ]
    }));

    vistaAjusteInventario.init();
    vistaAjusteInventario.getPanelBusqueda().setColumns(1);

    vistaAjusteInventario.addFilterComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAjusteInventario.idioma.lbEstado,
        hiddenName: 'estado',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [4, LOG.lb.documento.Estado[4]],
                [7, LOG.lb.documento.Estado[7]],
                [5, LOG.lb.documento.Estado[5]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: false
    }));

    vistaAjusteInventario.addFilterComponent(new LOG.util.ComboBox({
        fieldLabel: vistaAjusteInventario.idioma.lbMotivoAjuste,
        url: 'cargaMotivoAjuste',
        hiddenName: 'tipoajuste',
        valueField: 'idoperacion',
        displayField: 'descripcion',
        editable: false
    }));

    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaAjusteInventario.idioma.lbCreadoPor,
        hiddenName: 'idusuario',
        alias: 'ajusteLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaAjusteInventario.idioma.lbAprobadoPor,
        campo: 'aprobadopor',
        hiddenName: 'aprobadopor',
        alias: 'ajusteLog',
        subsistema: 10
    }));

    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaAjusteInventario.idioma.lbDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));

    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaAjusteInventario.idioma.lbHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    vistaAjusteInventario.addFilterComponent(fpDatosBusqueda);
    
    vistaAjusteInventario.addFilterComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaAjusteInventario.idioma.lbContabilizadoPor,
        url: 'cargarUsuarios',
        campo: 'contabilizadopor',
        hiddenName: 'contabilizadopor',
        alias: 'ajusteLog',
        subsistema: 10
    }));
    
    vistaAjusteInventario.addFilterComponent(new Ext.form.FieldSet({
        title: vistaAjusteInventario.idioma.tlRangoFecha,
        items: [fpFechas]
    }));
    vistaAjusteInventario.view();
});
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var gridPlugins = new LOG.util.List();
    /*gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));*/
    var idioma = LOG.inv.entrada.recepcion.Idioma;
    var vistaRecepcion = new LOG.inv.entrada.recepcion.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });

    vistaRecepcion.attachPlugin(new LOG.lb.plugin.ComboDepositos());
    vistaRecepcion.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'creadopor',
            'autorizadopor',
            'contabilizadopor',
            'transportadopor'
        ]
    }));
//    vistaRecepcion.attachPlugin(new LOG.lb.producto.BarcodeReader());

    vistaRecepcion.init();

    vistaRecepcion.getPanelBusqueda().setColumns(1);

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
                    [13, LOG.lb.documento.Estado[13]],
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [4, LOG.lb.documento.Estado[4]],
                    [7, LOG.lb.documento.Estado[7]],
                    [6, LOG.lb.documento.Estado[6]],
                    [5, LOG.lb.documento.Estado[5]]
                ]
            })
        })
    );
    cls.addComponent(
        new LOG.util.ComboBox({
            fieldLabel: idioma.lbCbSuministrador,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            mode: 'remote',
            pageSize: 10,
            resizable: true
        })
    );
    cls.addComponent(
        new LOG.util.ComboBox({
            fieldLabel: idioma.lbCbTipoDocumento,
            hiddenName: 'idoperacion',
            editable: false,
            url: 'cargarComboTipoDocumento',
            valueField: 'idnomoperaciones',
            displayField: 'denominacion'
        })
    );
    cls.addComponent(
        LOG.util.Prototipos.inputTexto({
            fieldLabel: idioma.lbNfDocOrigen,
            name: 'docorigen',
            regex: LOG.util.Regex.cadena,
            //maxLength: 10
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'recepcionLog',
            hiddenName: 'idusuario',
            subsistema: LOG.util.Subsistemas.inventario
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbContabilizadoPor,
            campo: 'aprobadopor',
            alias: 'recepcionLog',
            hiddenName: 'aprobadopor',
            subsistema: LOG.util.Subsistemas.inventario
        })
    );
    vistaRecepcion.addFilterComponent(cls);

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

    vistaRecepcion.addFilterComponent(
        new Ext.form.FieldSet({
            title: idioma.lbFsRangoFecha,
            items: [clsFecha]
        })
    );

    vistaRecepcion.view();
});
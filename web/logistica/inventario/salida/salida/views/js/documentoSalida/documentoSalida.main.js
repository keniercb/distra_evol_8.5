
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var gridPlugins = new LOG.util.List();
    /*gridPlugins.add(new Ext.Cont.Plugins.GridColumnComprobanteReporte({
        textIndex: 'nrocomprobante',
        idComprobantesCSVIndex: 'idcomprobante',
    }));*/
    var idioma = LOG.inv.documentoSalida.Idioma;
    var vistaSalida = new LOG.inv.documentoSalida.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma,
        gridPlugins: gridPlugins
    });
    vistaSalida.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vistaSalida.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 4,
        firmas: [
            'entregadopor',
            'recibido',
            'contabilizadopor',
            'transportadopor'
        ],
        entidadDeLaPersona: {
            'recibido': 'idclienteexterno',
            'transportadopor': -1
        }
    }));

    vistaSalida.init();

    vistaSalida.getPanelBusqueda().setColumns(1);

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    cls.addComponent(new LOG.util.ComboBox({
        fieldLabel: idioma.lbCbEntregarA,
        hiddenName: 'idcliente',
        valueField: 'idcliente',
        displayField: 'cliente',
        triggerAction: 'all',
        mode: 'remote',
        url: '/logistica/inventario/salida/salida/index.php/documentosalida/cargarClientesBusqueda'
    }));

    /*cls.addComponent(new LOG.util.ComboBox({
     fieldLabel: idioma.lbCbEstadoSuministrador,
     hiddenName: 'idestadosuministrador',
     valueField: 'idestadosuministrador',
     displayField: 'estadosuministrador',
     triggerAction: 'all',
     editable: false,
     mode: 'local',
     store: new Ext.data.SimpleStore({
     fields: ['idestadosuministrador', 'estadosuministrador'],
     data: [
     [1, LOG.inv.documentoSalida.EstadoCmpto[1]],
     [2, LOG.inv.documentoSalida.EstadoCmpto[2]],
     [3, LOG.inv.documentoSalida.EstadoCmpto[3]]
     ]
     })
     }));*/

    cls.addComponent(new LOG.util.ComboBox({
        fieldLabel: idioma.lbCbTipoDocumento,
        hiddenName: 'idtipodoc',
        valueField: 'idtipodoc',
        displayField: 'tipodoc',
        triggerAction: 'all',
        editable: false,
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['idtipodoc', 'tipodoc'],
            data: [
                [1, LOG.inv.documentoSalida.TipoDocumento[1]],
                [2, LOG.inv.documentoSalida.TipoDocumento[2]]
            ]
        })
    }));

    cls.addComponent(new LOG.util.ComboBox({
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
                [7, LOG.lb.documento.Estado[7]],
                [5, LOG.lb.documento.Estado[5]]
            ]
        })
    }));

    cls.addComponent(
            new LOG.lb.documento.ComboUsuarios({
                fieldLabel: idioma.lbCbCreadoPor,
                campo: 'idusuario',
                alias: 'aperturaLog',
                subsistema: 10,
                hiddenName: 'idusuario'
            })
            );
    cls.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.lbCbContabilizadoPor,
        campo: 'aprobadopor',
        alias: 'aperturaLog',
        subsistema: 10,
        hiddenName: 'aprobadopor'
    }));

    vistaSalida.addFilterComponent(cls);

    var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    clsFecha.addComponent(new Ext.form.DateField({
        fieldLabel: idioma.lbDfDesde,
        name: 'desde',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));
    clsFecha.addComponent(new Ext.form.DateField({
        fieldLabel: idioma.lbDfHasta,
        name: 'hasta',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    vistaSalida.addFilterComponent(new Ext.form.FieldSet({
        title: idioma.lbFsRangoFecha,
        items: [clsFecha]
    }));

    vistaSalida.view();
});

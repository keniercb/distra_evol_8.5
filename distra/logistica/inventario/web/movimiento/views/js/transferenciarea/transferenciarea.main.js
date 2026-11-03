UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaTransferenciarea = new LOG.inv.transferenciarea.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        idioma: LOG.util.UIManager.apply(LOG.inv.transferenciarea.Idioma, LOG.util.Idioma)
    });
    vistaTransferenciarea.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
    }));
    vistaTransferenciarea.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'creadopor',
            'aprobadopor',
            'contabilizadopor'
        ]
    }));

    vistaTransferenciarea.init();
    vistaTransferenciarea.getPanelBusqueda().setColumns(1);

    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaTransferenciarea.idioma.lbEstado,
        hiddenName: 'estado',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [5, LOG.lb.documento.Estado[5]]
            ]
        }),
        valueField: 'idestado',
        displayField: 'estado',
        editable: false
    }));
    fpDatosBusqueda.addComponent(new Ext.erp.comboNomenclador({
        controller: '/logistica/utiles/nomencladores/index.php/nomencladores/',
        modelo: 'NomTipotransferencia',
        idnom: 'idtipotransferencia',
        name: 'tipotransferencia',
        autoCargar: true,
        allowBlank: true,
        fieldLabel: vistaTransferenciarea.idioma.lbTipoTransferencia
    }));

    var stAreasOrigenDestino = new Ext.data.Store({
        url: 'cargarAreasOrigenDestino',
        reader: new Ext.data.JsonReader({
                id: "idareau",
                root: "datos"
            },
            [
                {
                    name: 'idarea'
                },
                {
                    name: 'idareau'
                },
                {
                    name: 'descripcion'
                }
            ])
    });

    var cmbAreaOrigen = new LOG.util.ComboBox({
        fieldLabel: vistaTransferenciarea.idioma.lbAreaOrigen,
        store: stAreasOrigenDestino,
        valueField: 'idarea',
        displayField: 'descripcion',
        hiddenName: 'areaorigen',
        editable: false
    });

    fpDatosBusqueda.addComponent(cmbAreaOrigen);


    var cmbAreaDestino = new LOG.util.ComboBox({
        fieldLabel: vistaTransferenciarea.idioma.lbAreaDestino,
        store: stAreasOrigenDestino,
        valueField: 'idarea',
        displayField: 'descripcion',
        hiddenName: 'areadestino',
        editable: false
    });

    fpDatosBusqueda.addComponent(cmbAreaDestino);

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaTransferenciarea.idioma.lbCreadoPor,
        hiddenName: 'creadopor',
        alias: 'transferenciaLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaTransferenciarea.idioma.lbAprobadoPor,
        hiddenName: 'aprobadopor',
        alias: 'transferenciaLog',
        subsistema: 10
    })
    );

    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaTransferenciarea.idioma.lbDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));

    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaTransferenciarea.idioma.lbHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    vistaTransferenciarea.addFilterComponent(fpDatosBusqueda);
    vistaTransferenciarea.addFilterComponent(new Ext.form.FieldSet({
        title: vistaTransferenciarea.idioma.tlRangoFecha,
        items: [fpFechas]
    }));
    vistaTransferenciarea.render = vistaTransferenciarea.render.createSequence(function () {
        vistaTransferenciarea.getPanelSuperior().comboDeposito.fireEvent = vistaTransferenciarea.getPanelSuperior().comboDeposito.fireEvent.createSequence(function (e, args) {
            if ('valuechange' == e) {
                stAreasOrigenDestino.baseParams.iddeposito = args;
                stAreasOrigenDestino.load();
            }
        })
    });
    vistaTransferenciarea.view();

});
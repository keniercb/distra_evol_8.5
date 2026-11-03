
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.inv.documentoconciliacion.Idioma;
    var vista = new LOG.inv.documentoconciliacion.View({
        acciones: acciones_reportes,
        idioma: idioma
    });
    vista.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vista.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'creadopor',
            'aprobadopor',
            'conciliadopor'
        ]
    }));

    vista.init();
    vista.getPanelBusqueda().setColumns(1);
    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    cls.addComponent(new LOG.util.ComboBox({
        fieldLabel: vista.idioma.lbCbEstado,
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
                [12, LOG.lb.documento.Estado[12]],
                [5, LOG.lb.documento.Estado[5]]
            ]
        })
    }));
    var cbCliente = new LOG.util.ComboBox({
        name: 'idcliente',
        valueField: 'idcliente',
        displayField: 'cliente',
        fieldLabel: vista.idioma.lbCbCliente,
        mode: 'local',
        autoLoad: false,
        forceSelection: true,
        url: 'cargarClientesConTransferecia',
        width: 200
    });
    cls.addComponent(cbCliente);
    cls.addComponent(new LOG.util.ComboBox({
        fieldLabel: vista.idioma.lbCbNivelAprob,
        hiddenName: 'usuario',
        valueField: 'idtipousuario',
        displayField: 'usario',
        //  triggerAction: 'all',
        editable: false,
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['idtipousuario', 'usario'],
            data: [
                [1, vista.idioma.lbCbCreadoPor],
                [2, vista.idioma.lbCbAprobadoPor],
                [3, vista.idioma.lbCbConciliadoPor]
            ]
        })
    }));
    cls.addComponent(new LOG.util.ComboBox({
        name: 'campousuario',
        displayField: 'nombreusuario',
        valueField: 'idusuario',
        fieldLabel: vista.idioma.lbCbUsuarios,
        mode: 'local',
        forceSelection: true,
        url: 'cargarTodosUsuarios',
        width: 200
    }));
    vista.addFilterComponent(cls);
    var clsFsRangoFecha = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    var clsFsRFInterno = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var inicio = new Ext.form.DateField({
        fieldLabel: vista.idioma.lbDfDesde,
        name: 'desde',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false

    });
    var fin = new Ext.form.DateField({
        fieldLabel: vista.idioma.lbDfHasta,
        name: 'hasta',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false

    });

    clsFsRFInterno.addComponent(inicio);
    clsFsRFInterno.addComponent(fin);

    clsFsRangoFecha.addComponent(new Ext.form.FieldSet({
        title: vista.idioma.lbFsRangoFecha,
        items: clsFsRFInterno
    }));
    vista.addFilterComponent(clsFsRangoFecha);
    var clsFsTransf = LOG.util.UIManager.initColumnForm({
        columnas: 1
    });
    var clsFsTSuperior = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var clsFsTInferior = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    var iniciot = new Ext.form.DateField({
        fieldLabel: vista.idioma.lbDfDesde,
        name: 'desdeTrnasf',
        id: 'desdeTrnasf',
        endDateField: 'hastaTransf',
        vtype: 'daterange',
        editable: false

    });
    var fint = new Ext.form.DateField({
        fieldLabel: vista.idioma.lbDfHasta,
        name: 'hastaTransf',
        id: 'hastaTransf',
        startDateField: 'desdeTrnasf',
        vtype: 'daterange',
        editable: false
    });

    clsFsTInferior.addComponent(iniciot);
    clsFsTInferior.addComponent(fint);
    clsFsTSuperior.addComponent(LOG.util.Prototipos.inputEntero({
        fieldLabel: vista.idioma.lbTfNoTransferencia,
        name: 'nroTransf'
    }));
    clsFsTransf.addComponent(new Ext.form.FieldSet({
        title: vista.idioma.lbFsTransferencia,
        items: [clsFsTSuperior, clsFsTInferior]
    }));
    vista.addFilterComponent(clsFsTransf);
    vista.render = vista.render.createSequence(function() {
        vista.getPanelSuperior().comboDeposito.fireEvent = vista.getPanelSuperior().comboDeposito.fireEvent.createSequence(function(e, args) {
            if ('valuechange' == e) {
                cbCliente.store.baseParams.idestructuracomun = args;
                cbCliente.store.load();
            }
        })
    });

    vista.view();
});

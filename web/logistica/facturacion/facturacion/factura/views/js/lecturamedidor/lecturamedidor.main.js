UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.fac.lecturamedidor.Idioma;
    var vistaRecepcion = new LOG.fac.lecturamedidor.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma
    });

    vistaRecepcion.init();

    vistaRecepcion.getPanelBusqueda().setColumns(1);

    vistaRecepcion.addFilterComponent(
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
                    [6, LOG.lb.documento.Estado[6]]
                ]
            })
        })
    );

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
//    cls.addComponent(
//        new LOG.util.ComboBox({
//            fieldLabel: idioma.lbCbTipoDocumento,
//            hiddenName: 'idoperacion',
//            editable: false,
//            url: 'cargarComboTipoDocumento',
//            valueField: 'idnomoperaciones',
//            displayField: 'denominacion'
//        })
//    );
    cls.addComponent(
        new LOG.util.Prototipos.inputEntero({
            fieldLabel: idioma.lbNfDocOrigen,
            name: 'docorigen'
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbCreadoPor,
            campo: 'idusuario',
            alias: 'lecturamedidorLog',
            hiddenName: 'idusuario'
        })
    );
    cls.addComponent(
        new LOG.lb.documento.ComboUsuarios({
            fieldLabel: idioma.lbCbContabilizadoPor,
            campo: 'aprobadopor',
            alias: 'lecturamedidorLog',
            hiddenName: 'aprobadopor'
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
Ext.ns('log.lb.auditoriadocumento');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.lb.auditoriadocumento.Idioma, LOG.util.Idioma.init());
    var VistaAuditoria = new LOG.lb.auditoriadocumento.View({
        idioma: idioma,
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true
    });

    VistaAuditoria.init();

    VistaAuditoria.getPanelBusqueda().setColumns(1);

    var numero = LOG.util.Prototipos.inputEntero({
        fieldLabel: idioma.cgNro,
        name: 'nrodoc',
        hiddenName: 'nrodoc'
    });

    var estado = new LOG.util.ComboBox({
        fieldLabel: idioma.cgEstado,
        hiddenName: 'estado',
        valueField: 'idestado',
        displayField: 'estado',
        editable: false,
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['idestado', 'estado'],
            data: [
                [1, LOG.lb.documento.Estado[1]],
                [13, LOG.lb.documento.Estado[13]],
                [2, LOG.lb.documento.Estado[2]],
                [3, LOG.lb.documento.Estado[3]],
                [12, LOG.lb.documento.Estado[12]],
                [4, LOG.lb.documento.Estado[4]],
                [5, LOG.lb.documento.Estado[5]],
                [6, LOG.lb.documento.Estado[6]],
                [7, LOG.lb.documento.Estado[7]],
                [10, LOG.lb.documento.Estado[10]]
            ]
        })
    });

    var cmbTipoDocumento = new LOG.util.ComboBox({
        fieldLabel: idioma.cgTdoc,
        editable: false,
        url: 'obtenerTipoDocumento',
        hiddenName: 'alias',
        valueField: 'alias',
        displayField: 'denominacion'
    });
    var cmbDeposito = new LOG.util.ComboBox({
        fieldLabel: LOG.util.Idioma.lbDepositos,
        editable: false,
        url: 'obtenerDepositos',
        valueField: 'iddeposito',
        hiddenName: 'iddeposito',
        displayField: 'deposito'
    });

    /*var comboCreadoPor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.fCreado,
        editable: false,
        campo: 'idusuario',
        hiddenName: 'idusuario'
    });

    var comboAprobadoPor = new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.fAprobado,
        editable: false,
        campo: 'idusuario',
        hiddenName: 'aprobadopor'
    });*/

    var desde = new Ext.form.DateField({
        fieldLabel: idioma.fDesde,
        name: 'desde',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta'
    });
    var hasta = new Ext.form.DateField({
        fieldLabel: idioma.fHasta,
        name: 'hasta',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde'
    });

    var frmBusqAvanz = new LOG.util.ColumnForm(2);
    var frmFecha = new LOG.util.ColumnForm(2);
    var frmFechaRango = new LOG.util.ColumnForm(2)

    frmBusqAvanz.addComponent(numero);
    frmBusqAvanz.addComponent(estado);
    frmBusqAvanz.addComponent(cmbTipoDocumento);
    frmBusqAvanz.addComponent(cmbDeposito);

    frmFechaRango.addComponent(desde);
    frmFechaRango.addComponent(hasta);
    frmFecha.addComponent(new Ext.form.FieldSet({
        title: idioma.tRangoFecha,
        anchor: '100%',
        items: [frmFechaRango]
    }));

    frmFecha.getColumn(0).columnWidth = 1;
    frmFecha.getColumn(0).getComponent(0).anchor = '99%';

    VistaAuditoria.addFilterComponent(frmBusqAvanz);
    VistaAuditoria.addFilterComponent(frmFecha);

    VistaAuditoria.view();
});

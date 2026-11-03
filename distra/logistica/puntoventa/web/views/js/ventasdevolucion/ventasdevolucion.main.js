Ext.ns('log.fac.ventasdevolucion');
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(LOG.fac.ventasdevolucion.Idioma, LOG.util.Idioma.init());
    var Vista = new LOG.fac.ventasdevolucion.View({
        idioma: idioma,
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true
    });
   // Vista.attachPlugin(new LOG.lb.plugin.ComboDepositos({}, 0));
    Vista.init();

    Vista.getPanelBusqueda().setColumns(1);

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
    var cmbVendedor = new LOG.util.ComboBox({
        fieldLabel: idioma.cgCajero,
        editable: false,
        url: 'obtenerVendedor',
        hiddenName: 'idusuario',
        valueField: 'idusuario',
        displayField: 'nombre'
    });
    var cmbCliente = new LOG.util.ComboBox({
        fieldLabel: idioma.cgCliente,
        editable: true,
        url: 'obtenerClientes',
        hiddenName: 'idventacliente',
        valueField: 'idventacliente',
        displayField: 'nombre',
        pageSize: 30,
        mode: 'remote',
        minChars: 0,
        autoLoad: false
    });
    var cmbProductos = new LOG.util.ComboBox({
        fieldLabel: idioma.cgProductos,
        editable: true,
        url: 'getProductosVenta',
        hiddenName: 'idproducto',
        valueField: 'idproducto',
        displayField: 'denominacion',
        pageSize: 30,
        mode: 'remote',
        minChars: 0,
        autoLoad: true
    });
    var cmbModoPago = new LOG.util.ComboBox({
        fieldLabel: idioma.cgModopago,
        editable: false,
        url: 'getModoPago',
        hiddenName: 'idmodopago',
        valueField: 'idmodopago',
        displayField: 'denominacion'
    });
    var cmbMetodoEntrega = new LOG.util.ComboBox({
        fieldLabel: idioma.cgMetodoentrega,
        editable: false,
        //url: 'getModoPago',
        hiddenName: 'idmetodo',
        valueField: 'idmetodo',
        displayField: 'denominacion',
        editable: false,
        mode: 'local',
        store: new Ext.data.SimpleStore({
            fields: ['idmetodo', 'denominacion'],
            data: [
                [1, 'Entrega en tienda'],
                [2, 'Entrega a domicilio']
            ]
        })
    });
    var cmbCiudad = new LOG.util.ComboBox({
        fieldLabel: idioma.cgCiudad,
        editable: false,
        //url: 'getCiudad',
        hiddenName: 'ciudad',
        valueField: 'ciudad',
        displayField: 'ciudad'
    });
    var cmbMunicipio = new LOG.util.ComboBox({
        fieldLabel: idioma.cgMunicipio,
        editable: false,
        //url: 'getMunicipio',
        hiddenName: 'municipio',
        valueField: 'municipio',
        displayField: 'municipio'
    });
    /*var cmbDeposito = new LOG.util.ComboBox({
        fieldLabel: idioma.cgDeposito,
        editable: false,
        url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarPuntoVenta',
        valueField: 'idestructuraop',
        hiddenName: 'idestructuraop',
        displayField: 'coddenominacion'
    });*/

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
    frmBusqAvanz.addComponent(cmbVendedor);
    frmBusqAvanz.addComponent(cmbCliente);
    frmBusqAvanz.addComponent(cmbProductos);
    frmBusqAvanz.addComponent(cmbModoPago);
    frmBusqAvanz.addComponent(cmbMetodoEntrega);
    frmBusqAvanz.addComponent(cmbCiudad);
    frmBusqAvanz.addComponent(cmbMunicipio);
    //frmBusqAvanz.addComponent(cmbDeposito);

    frmFechaRango.addComponent(desde);
    frmFechaRango.addComponent(hasta);
    frmFecha.addComponent(new Ext.form.FieldSet({
        title: idioma.tRangoFecha,
        anchor: '100%',
        items: [frmFechaRango]
    }));

    frmFecha.getColumn(0).columnWidth = 1;
    frmFecha.getColumn(0).getComponent(0).anchor = '99%';

    Vista.addFilterComponent(frmBusqAvanz);
    Vista.addFilterComponent(frmFecha);


    Vista.view();
});

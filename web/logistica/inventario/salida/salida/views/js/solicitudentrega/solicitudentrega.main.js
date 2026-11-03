
UCID.portal.cargarAcciones(window.frameElement.id, function() {
    /**
     * @class solicitudentrega.main
     * (Descripcion de la clase, objetivo)
     *
     * @package Inventario
     * @subpackage Salida
     * @author Osmel A. Larduet Hechavarría
     * @copyright XETID
     * @version 1.0
     */
    var idioma = LOG.inv.salida.solicitudentrega.Idioma;
    var model = new LOG.lb.documento.Model(idioma);
    var vistaSolicitudentrega = new LOG.inv.salida.solicitudentrega.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma,
        model: model
    });

    vistaSolicitudentrega.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vistaSolicitudentrega.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 3,
        firmas: [
            'solicitadopor',
            'aprobadopor',
            'recibido'
        ]
    }));

    vistaSolicitudentrega.init();
    vistaSolicitudentrega.getPanelBusqueda().setColumns(1);

    var cls = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    vistaSolicitudentrega.addFilterComponent(new LOG.util.ComboBox({
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
    }));

    cls.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.lbCbCreadoPor,
        campo: 'idusuario',
        alias: 'aperturaLog',
        subsistema: 10,
        hiddenName: 'idusuario'
    }));
    cls.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: idioma.lbCbAprobadoPor,
        campo: 'aprobadopor',
        alias: 'aperturaLog',
        subsistema: 10,
        hiddenName: 'aprobadopor'
    }));

    vistaSolicitudentrega.addFilterComponent(cls);

    var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    clsFecha.addComponent(new Ext.form.DateField({
        fieldLabel: idioma.lbDfDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));
    clsFecha.addComponent(new Ext.form.DateField({
        fieldLabel: idioma.lbDfHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    vistaSolicitudentrega.addFilterComponent(new Ext.form.FieldSet({
        title: idioma.lbFsRangoFecha,
        items: [clsFecha]
    }));
    vistaSolicitudentrega.view();
});

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var vistaHojaInventario = new LOG.inv.hojainventario.View({
        acciones: acciones_reportes,
        busquedaBasica: true,
        busquedaAvanzada: true,
        idioma: LOG.util.UIManager.apply(LOG.inv.hojainventario.Idioma, LOG.util.Idioma)
    });
    vistaHojaInventario.attachPlugin(new LOG.lb.plugin.ComboDepositos({
    caso : 3
    }));
    vistaHojaInventario.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 2,
        firmas: [
            'creadopor',
            'jefealmacen',
            'jefecomision',
            'aprobadopor',
        ]
    }));

    vistaHojaInventario.init();
    vistaHojaInventario.getPanelBusqueda().setColumns(1);
    /*vistaHojaInventario.getPanelBusqueda().cargarDatos = function(v) {
     stAreas.load({
     params : {
     iddeposito : v.idDeposito
     }
     });
     };*/

    var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaHojaInventario.idioma.lbEstado,
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

    /*var stAreas = new Ext.data.Store({
     url: 'cargarAreas',
     reader: new Ext.data.JsonReader({
     id: "area",
     root: "datos"
     },
     [
     {
     name: 'area'
     },
     {
     name: 'descripcion'
     }
     ])
     });

     fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
     fieldLabel: vistaHojaInventario.idioma.lbArea,
     store: stAreas,
     valueField: 'area',
     displayField: 'descripcion',
     hiddenName: 'area',
     editable: false
     }));*/

    fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
        fieldLabel: vistaHojaInventario.idioma.lbTipoInventario,
        hiddenName: 'tipoinventario',
        store: new Ext.data.SimpleStore({
            fields: ['tipoinventario', 'dtipoinventario'],
            data: [
                [1, LOG.lb.documento.TipoInventario[1]],
                [2, LOG.lb.documento.TipoInventario[2]],
                [3, LOG.lb.documento.TipoInventario[3]],
                [4, LOG.lb.documento.TipoInventario[4]]
            ]
        }),
        valueField: 'tipoinventario',
        displayField: 'dtipoinventario',
        editable: false
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaHojaInventario.idioma.lbCreadoPor,
        hiddenName: 'idusuario',
        alias: 'inventariogLog',
        subsistema: 10
    }));

    fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
        fieldLabel: vistaHojaInventario.idioma.lbAprobadoPor,
        hiddenName: 'aprobadopor',
        alias: 'inventariogLog',
        subsistema: 10
    }));

    var fpFechas = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaHojaInventario.idioma.lbDesde,
        name: 'desde',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
    }));

    fpFechas.addComponent(new Ext.form.DateField({
        fieldLabel: vistaHojaInventario.idioma.lbHasta,
        name: 'hasta',
        xtype: 'datefield',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
    }));

    vistaHojaInventario.addFilterComponent(fpDatosBusqueda);
    vistaHojaInventario.addFilterComponent(new Ext.form.FieldSet({
        title: vistaHojaInventario.idioma.tlRangofecha,
        items: [fpFechas]
    }));
    vistaHojaInventario.view();
});

UCID.portal.cargarAcciones(window.frameElement.id, function() {
    var idioma = LOG.inv.entrada.reclamacion.Idioma;
    var vistaReclamacion = new LOG.inv.entrada.reclamacion.View({
        acciones: acciones_reportes,
        busquedaAvanzada: true,
        idioma: idioma
    });
    vistaReclamacion.attachPlugin(new LOG.lb.plugin.ComboDepositos({
        caso: 3
    }));
    vistaReclamacion.attachPlugin(new LOG.lb.documento.PluginFirmaDocumentos({
        columnas : 4,
        firmas: [
            'recibido',
            'aprobadopor',
            'transportadopor',
            'entregadopor'
        ]
    }));

    vistaReclamacion.init();

    vistaReclamacion.getPanelBusqueda().setColumns(1);

    var clsInfDif = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });

    var date = new Date();
    clsInfDif.addComponent(
            new LOG.util.YearField({
                fieldLabel: idioma.lbNfAnno,
                name: 'anno',
                totalYears: 5,
                maxValue: date.getFullYear(),
                minValue: date.getFullYear() - 5,
            })
            );
    clsInfDif.addComponent(
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
                        [3, LOG.lb.documento.Estado[3]],
                        [5, LOG.lb.documento.Estado[5]]
                    ]
                })
            })
            );
    clsInfDif.addComponent(
            new LOG.lb.documento.ComboUsuarios({
                fieldLabel: idioma.lbCbCreadoPor,
                campo: 'idusuario',
                alias: 'informediferenciaLog',
                subsistema: 10,
                hiddenName: 'idusuario'
            })
            );
    clsInfDif.addComponent(
            new LOG.lb.documento.ComboUsuarios({
                fieldLabel: idioma.lbCbAprobadoPor,
                campo: 'aprobadopor',
                alias: 'informediferenciaLog',
                subsistema: 10,
                hiddenName: 'aprobadopor'
            })
            );
    vistaReclamacion.addFilterComponent(
            new Ext.form.FieldSet({
                title: idioma.lbFsDatosInfDif,
                items: [clsInfDif]
            })
            );

    var clsInfRecep = LOG.util.UIManager.initColumnForm({
        columnas: 2
    });
    clsInfRecep.addComponent(
            new LOG.util.Prototipos.inputEntero({
                fieldLabel: idioma.lbNfNumero,
                name: 'nrodocrecepcion'
            })
            );
    clsInfRecep.addComponent(
            new LOG.util.YearField({
                fieldLabel: idioma.lbNfAnno,
                name: 'annorecepcion',
                totalYears: 5,
                maxValue: date.getFullYear(),
                minValue: date.getFullYear() - 5,
            })
            );
    vistaReclamacion.addFilterComponent(
            new Ext.form.FieldSet({
                title: idioma.lbFsDatosInfRecep,
                items: [clsInfRecep]
            })
            );

    vistaReclamacion.view();
});

UCID.portal.cargarAcciones(window.frameElement.id, function () {
    Ext.Ajax.request({
        url: 'cargaInicial',
        method: 'POST',
        params: {
            idfuncionalidad: window.frameElement.id
        },
        callback: function (opts, success, response) {
            var responseText = Ext.decode(response.responseText);
            var idioma = LOG.util.UIManager.apply(LOG.farm.reenvase.Idioma, LOG.util.Idioma);
            var vista = new LOG.farm.reenvase.View({
                idioma: idioma,
                busquedaBasica: true,
                busquedaAvanzada: true,
                acciones: acciones_reportes,
                baseParams: {
                    identidad: responseText.datos.encabezado.identidad
                }
            });
            vista.init();
            vista.getPanelSuperior().onRender = vista.getPanelSuperior().onRender.createSequence(function () {
                vista.getPanelSuperior().add({
                        border: false,
                        tbar: ['->', idioma.lbFecha  + ':', responseText.datos.encabezado.fechacontable, ' ', '-', idioma.lbEntidad + ':', responseText.datos.encabezado.entidad]
                    }
                );
                vista.getPanelSuperior().doLayout();
            });

            vista.getPanelBusqueda().setColumns(1);

            var fpEstado = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            fpEstado.addComponent(new LOG.util.ComboBox({
                fieldLabel: vista.idioma.lbCmbEstadoReenvase,
                hiddenName: 'estado',
                store: new Ext.data.SimpleStore({
                    fields: ['idestado', 'estado'],
                    data: [
                        [1, LOG.lb.documento.Estado[1]],
                        [2, LOG.lb.documento.Estado[2]],
                        [3, LOG.lb.documento.Estado[3]]
                    ]
                }),
                valueField: 'idestado',
                displayField: 'estado',
                editable: false,
                emptyText: vista.idioma.lbSeleccione
            }));

            var cmbDenomProductoReenvasar = new Ext.form.TriggerField({
                fieldLabel: vista.idioma.lbCmbProductoReenvasar,
                emptyText: vista.idioma.lbSeleccione,
                triggerClass: 'x-form-cliente-trigger',
                tabular: true,
                name: 'productoreenvasar',
                anchor: '98%',
                editable: false
            });

            cmbDenomProductoReenvasar.onTriggerClick = function (e) {
                
            }

            var cmbDenomProductoReenvasado = new Ext.form.TriggerField({
                fieldLabel: vista.idioma.lbCmbProductoReenvasado,
                emptyText: vista.idioma.lbSeleccione,
                triggerClass: 'x-form-cliente-trigger',
                tabular: true,
                name: 'productoreenvasado',
                anchor: '98%',
                editable: false
            });

            cmbDenomProductoReenvasado.onTriggerClick = function (e) {
                LOG.inv.maestroproductos.Loader.init(function () {
                    var _pr = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        _parent: vista,
                        modoSeleccion: 1,
                        doAction: function (r) {
                            cmbDenomProductoReenvasado.setValue(r[0].json.idindicador);
                            cmbDenomProductoReenvasado.setRawValue(r[0].json.denominacion);
                            vista.getPanelBusqueda().parametros['idindicador'] = r[0].json.idindicador;
                            cmbDenomProductoReenvasado.clearInvalid();
                            cmbDenomProductoReenvasado.focus();
                        }
                    });
                    _pr.constrain = true;
                    _pr.show();

                    _pr.panelProductos.getGridPrincipal().on({
                        rowdblclick: function (grid, rowIndex, e) {
                            cmbDenomProductoReenvasado.value = _pr.panelProductos.getGridPrincipal().getSelectionModel().getSelected().data.idindicador;
                            cmbDenomProductoReenvasado.setRawValue(_pr.panelProductos.getGridPrincipal().getSelectionModel().getSelected().data.denominacion);
                            vista.getPanelBusqueda().parametros['idindicador'] = _pr.panelProductos.getGridPrincipal().getSelectionModel().getSelected().data.idindicador;
                            cmbDenomProductoReenvasado.clearInvalid();
                            _pr.close();
                            cmbDenomProductoReenvasado.focus();
                        }
                    });
                });
            }

            var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            fpDatosBusqueda.addComponent(cmbDenomProductoReenvasar);
            fpDatosBusqueda.addComponent(cmbDenomProductoReenvasado);

            fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
                fieldLabel: vista.idioma.lbCmbCreadoPor,
                hiddenName: 'idusuario',
                alias: 'reenvaseLog',
                emptyText: vista.idioma.lbSeleccione,
                subsistema: 121
            }));

            fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
                fieldLabel: vista.idioma.lbCmbAprobadoPor,
                hiddenName: 'aprobadopor',
                alias: 'reenvaseLog',
                emptyText: vista.idioma.lbSeleccione,
                subsistema: 121
            }));

            var fpFechas = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            var fpFechaRango = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            fpFechaRango.addComponent(new Ext.form.DateField({
                fieldLabel: vista.idioma.lbDfFechaInicio,
                name: 'desde',
                xtype: 'datefield',
                vtype: 'daterange',
                id: 'desde',
                endDateField: 'hasta',
                editable: false
            }));

            fpFechaRango.addComponent(new Ext.form.DateField({
                fieldLabel: vista.idioma.lbDfFechaFin,
                name: 'hasta',
                xtype: 'datefield',
                vtype: 'daterange',
                id: 'hasta',
                startDateField: 'desde',
                editable: false
            }));

            fpFechas.addComponent(new Ext.form.FieldSet({
                title: vista.idioma.tlRangofecha,
                items: [fpFechaRango]
            }));

            fpFechas.getColumn(0).columnWidth = 1;
            fpFechas.getColumn(0).getComponent(0).anchor = '99%';
            vista.addFilterComponent(fpEstado);
            vista.addFilterComponent(fpDatosBusqueda);
            vista.addFilterComponent(fpFechas);
            vista.view();
        }
    });
});
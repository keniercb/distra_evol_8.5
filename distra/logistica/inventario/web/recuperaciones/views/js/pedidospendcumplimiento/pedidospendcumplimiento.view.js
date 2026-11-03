Ext.ns('Ext.erp.pedidospendcumplimiento');
Ext.erp.pedidospendcumplimiento = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        var _this = this;
        config.dirController = '/logistica/inventario/recuperaciones/index.php/pedidospendcumplimiento';
        config.urlBusquedaGridPrincipal = 'cargarPedidosPendientes';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = true;
        config.busquedaAvanzada=true;
        config.idioma = {};
        Ext.erp.pedidospendcumplimiento.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.inv.pedidospendcumplimiento.Idioma);
        _this.concepto = this.idioma.documentos;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimple;
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.cgNroDocumento,
            width: 110,
            dataIndex: 'nrodoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'iddocumento',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgNroReferencia,
            width: 110,
            dataIndex: 'numeroref',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgFechaCreado,
            width: 120,
            dataIndex: 'fechacontable',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgClientes,
            dataIndex: 'cliente',
            autoExpand: true,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgEstado,
            width: 90,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            header: this.idioma.cgEstadoEjecucion,
            width: 150,
            dataIndex: 'estadopedido',
            default: true,
            renderer: function(v) {
                return _this.idioma.EstadoEjecucionPedido[v];
            }
        });
        this.addGridColumn({
            header: _this.idioma.cgFechaVencimiento,
            dataIndex: 'fechavencimiento',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCantProductos,
            width: 150,
            align: 'right',
            dataIndex: 'productos',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCantServicios,
            width: 150,
            align: 'right',
            dataIndex: 'servicios',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCantReclamos,
            width: 150,
            align: 'right',
            dataIndex: 'reclamos',
            default: true
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(new LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            disabled: true,
            handler: function () {
                _this.getReportes(_this);
            },
            controlFn: function (b, _caller) {
                _caller.getGridPrincipal().store.fireEvent = _caller.getGridPrincipal().store.fireEvent.createSequence(function (e) {
                    if (e == 'load') {
                        if (_caller.getStorePrincipal().getCount() != 0) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }));
        this.addToolbarButton("->");
        this.addToolbarButton("-");
        this.addToolbarButton(new LOG.util.Prototipos.botonAyuda({id: 'idpedido'}));
    },
    view:function() {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        fpDatosBusqueda.addComponent(new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.lbTfNroDocumento,
            name: 'nrodoc',
            allowBlank: true
        }));
       /* fpDatosBusqueda.addComponent(new LOG.util.Prototipos.inputEntero({
            fieldLabel: _this.idioma.cgNroReferencia,
            name: 'numeroref',
            allowBlank: true
        }));*/
        var fpFechas = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var fpFechaRango = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        fpFechaRango.addComponent(new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfDesde,
            name: 'desde',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desde',
            endDateField: 'hasta',
            editable: false
        }));
        fpFechaRango.addComponent(new Ext.form.DateField({
            fieldLabel: _this.idioma.lbDfHasta,
            name: 'hasta',
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hasta',
            startDateField: 'desde',
            editable: false
        }));

        fpFechas.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.tlRangofecha,
            items: [fpFechaRango]
        }));

        fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbCbCliente,
            editable: false,
            url: '/logistica/inventario/recuperaciones/index.php/pedidospendcumplimiento/cargarClientes',
            hiddenName: 'idcliente',
            valueField: 'idclientesproveedores',
            displayField: 'nombre',
            loadingText: _this.idioma.lbCargando,
            hideTrigger: false,
            readOnly: false,
            triggerAction: 'all',
            enableQtip: true,
            pageSize: 10,
            emptyText:_this.idioma.lbSeleccione,
            minChars: 0,
            mode: 'remote'
        }));

        fpDatosBusqueda.getColumn(0).columnWidth = 1;
        fpDatosBusqueda.getColumn(0).getComponent(0).anchor = '99%';
        fpDatosBusqueda.getColumn(0).getComponent(1).anchor = '99%';
        fpFechas.getColumn(0).columnWidth = 1;
        fpFechas.getColumn(0).getComponent(0).anchor = '99%';

        _this.addFilterComponent(fpDatosBusqueda);
        _this.addFilterComponent(fpFechas);
        return Ext.erp.pedidospendcumplimiento.superclass.view.call(this);
    },
    getReportes: function (btn) {
        var _this = this;
        this.control = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/inventario/recuperaciones/PedidosPendCumplimiento',
                    name: 'PedidosPendCumplimiento',
                    isList:true,
                    params: {
                        iddoc:_this.getStorePrincipal().reader.jsonData.iddoc,
                        idestructura: idEntidad ? idEntidad : null,
                        criterio: (_this.panelBusquedaAvanzada.findByType('textfield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('textfield')[0].getValue() : null,
                        idcliente: (_this.panelBusquedaAvanzada.findByType('combo')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('combo')[0].getValue() : null,
                        fechainicio: (_this.panelBusquedaAvanzada.findByType('datefield')[0].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[0].getValue().format('d/m/Y') : null,
                        fechafin: (_this.panelBusquedaAvanzada.findByType('datefield')[1].getValue()) ? _this.panelBusquedaAvanzada.findByType('datefield')[1].getValue().format('d/m/Y') : null
                    }
                }
            ]
        });
        this.control.view('1');
    }
});
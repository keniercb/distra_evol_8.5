/**
 * Esta clase muestra los documentos que estan reservando disponibilidad de un producto
 * @copyright XETID
 * @author División Gestión de Entidades
 * @version 1.0
 */
Ext.ns('LOG.inv.submayor');
LOG.inv.submayor.DisponibleProductoPlugin = function () {
    /**
     * Dibuja la interfaz y llama a la clase controladora
     * @return
     */
    function __conmit(v) {
        var listaId = new LOG.util.List();
        LOG.inv.submayor.reporte = Ext.extend(LOG.util.UITemplate, {
            constructor: function (config) {
                this.formaVisualizacion = 'ventana';
                this.modoSeleccion = 1;
                this.concepto = '----- ';
                this.busquedaAvanzada = true;
                this.autoLoad = false;
                this.idGridPrincipal = 'idcantidadcomprometida';
                this.urlBusquedaGridPrincipal = 'getDisponibilidadProducto';
                LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
                LOG.inv.submayor.reporte.superclass.constructor.call(this, config);
                this.getVistaPrincipal().title = config.idioma.tlDisponibilidad  + ' ' + v.smGridPrincipal.getSelected().json.denominacion;
                this.getVistaPrincipal().maximizable = false;
                this.getVistaPrincipal().maximized = true;

            },
            init: function () {
                LOG.inv.submayor.reporte.superclass.init.call(this);
            },
            initDefaultButtons: function () {
                var _this = this;
                LOG.util.UIManager.apply(_this.getVistaPrincipal().buttons[0], LOG.util.Prototipos.botonCancelar({
                    text: _this.idioma.lbBtnCerrar
                }, true));
                this.getVistaPrincipal().buttons[1].setVisible(false);
                this.getVistaPrincipal().buttons[2].setVisible(false);
            },
            initDefaultColumns: function () {
                var _this = this;

                this.addGridColumn({
                    header: _this.idioma.cgFecha,
                    width: 80,
                    dataIndex: 'fechacontable',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgTipoDoc,
                    width: 110,
                    dataIndex: 'tipodoc',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgNumeroDocumento,
                    width: 120,
                    dataIndex: 'nrodoc',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.cgNumeroRef,
                    width: 120,
                    dataIndex: 'numeroref',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbEstadoDoc,
                    width: 120,
                    dataIndex: 'estado',
                    default: true,
                    renderer: function (v) {
                        return LOG.lb.documento.Estado[v];
                    }
                });
                this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
                    header: _this.idioma.lbCantidad,
                    width: 100,
                    align: 'right',
                    dataIndex: 'cantidad',
                    default: true
                }));


                this.addGridColumn({
                    dataIndex: 'iddocumento',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'abreviatura',
                    default: true
                });

            },

            render: function () {
                var _this = this;
                this.getPanelBusqueda().width = 338;
                var vist = LOG.inv.submayor.reporte.superclass.render.call(_this);
                //_this.valor = [];
                this.getGridPrincipal().on({
                    'rowdblclick': function (grid, rowIndex, e) {
                        if (grid.getSelectionModel().hasSelection()) {
                            _this.getReporteModelo();
                        }
                    }
                });
                this.getStorePrincipal().initBaseParams.idproducto = v.smGridPrincipal.getSelected().data.idproducto;
                this.getStorePrincipal().initBaseParams.iddeposito = v.idDeposito;
                /*Ext.Ajax.request({
                    url: 'getMovimientosProducto',
                    method: 'POST',
                    callback: function (options, success, response) {
                        _this.valor = Ext.decode(response.responseText);
                    }
                })*/

                this.getPanelBusqueda().listaBotones.getItem(1).handler = this.getPanelBusqueda().listaBotones.getItem(1).handler.createInterceptor(function () {
                    gridDocumento.getSelectionModel().clearSelections();
                    listaId.deleteAll();
                });
                this.getStorePrincipal().load();
                return vist;
            }

        });

        //----construyendo la busqueda avanzada
        var idioma = LOG.inv.submayor.Idioma;
        var winReporte = new LOG.inv.submayor.reporte({
            idioma: idioma
        });

        winReporte.init();

        winReporte.getPanelBusqueda().setColumns(1);
        var clsFecha = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        var desde = new Ext.form.DateField({ //----1er campo de fecha
            fieldLabel: idioma.lbDfDesde,
            name: 'desde',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });
        var hasta = new Ext.form.DateField({ //----2do campo de fecha
            fieldLabel: idioma.lbDfHasta,
            name: 'hasta',
            xtype: 'datefield',
            vtype: 'daterange',
            editable: false
        });

        desde.endDateField = hasta.id; //-------validacion de fecha
        hasta.startDateField = desde.id;

        clsFecha.addComponent(desde);

        clsFecha.addComponent(hasta);

        winReporte.addFilterComponent( //-------muestra los campos de fecha
            new Ext.form.FieldSet({
                title: idioma.lbFsRangoFecha,
                items: [clsFecha]
            })
        );

        var lista = new LOG.util.List(); // ------------ cunstruyendo el grid de la busqueda avanzada
        var check = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        lista.add(check);
        lista.add({
            header: idioma.cgDenominacion,
            width: 250,
            dataIndex: 'denominacion',
            default: true
        });
        lista.add({
            dataIndex: 'iddoc',
            default: true
        });

        var clsTipoDato = LOG.util.UIManager.proccessColumns(lista);
        var cmDocumento = new Ext.grid.ColumnModel(clsTipoDato.columns);
        var smDocumento = check;
        var recDocumento = Ext.data.Record.create(clsTipoDato.fields);
        var stDocumento = new Ext.data.Store({
            url: 'cargarTipoDoc',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos'
            }, recDocumento)
        });
        smDocumento.on({
            'selectionchange': function () {
                listaId.deleteAll();
                Ext.each(smDocumento.getSelections(), function (r) {
                    listaId.add(r.data.iddoc);
                });
                winReporte.getPanelBusqueda().parametros.iddoc = Ext.encode(listaId.getArray());
            }
        });

        var gridDocumento = LOG.util.UIManager.initEditableGridPanel(cmDocumento, stDocumento, smDocumento);
        gridDocumento.height = 335;
        gridDocumento.bbar = null;
        winReporte.addFilterComponent(
            new Ext.form.FieldSet({
                title: idioma.lbFsTipoDoc,
                items: [gridDocumento],
                height: 370
            })
        );
        winReporte.view();
        //----------se acaba la busqueda avanzada
    }

    return {
        init: function (v) {
            v.insertToolbarButton(LOG.util.UIManager.createBtn({
                iconCls: 'movimiento',
                text: LOG.inv.submayor.Idioma.lbDisponiblePend,
                tooltip: LOG.inv.submayor.Idioma.ttbtnDisponiblePend,
                handler: function () {
                    __conmit(v);
                },
                //-----------validacion show/hide del boton
                controlFn: function (b, _caller) {
                    b.disable();
                    LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                        if (e == 'selectionchange') {
                            if (this.getCount() == 1) {
                                b.enable();

                            } else {

                                b.disable();
                            }
                        }
                    }, 'dispo');
                    /* _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                     if (e == 'rowselect') {
                     b.enable();
                     }
                     if (e == 'rowdeselect') {
                     b.disable();
                     }
                     });*/
                }
                //----------termina la validacion show/hide del boton
            }), 2);
        }
    };
}

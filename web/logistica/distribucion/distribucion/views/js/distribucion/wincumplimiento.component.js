Ext.ns('LOG.dist.distribucion');

LOG.dist.distribucion.winCumplimiento = Ext.extend(LOG.util.UITemplate, {
    autoSelect: false,
    nodoSeleccionadoArbol: undefined,
    dirController: '/logistica/distribucion/distribucion/index.php/distribucion',
    urlBusquedaGridPrincipal: 'cargarProductosEstadoEjecucion',
    constructor: function (config) {
        this.autoLoad = false;
        this.modoSeleccion = 1;
        this.concepto = 'productos';
        this.busquedaBasica = true;
        this.autoSelect = true;
        config.idGridPrincipal = 'idprodorden';
        this.formaVisualizacion = 'ventana';
        config.idioma = LOG.util.UIManager.apply(LOG.dist.distribucion.Idioma, LOG.util.Idioma);
        LOG.util.UIManager.apply(config.idioma, LOG.util.Idioma);
        LOG.dist.distribucion.winCumplimiento.superclass.constructor.call(this, config);
        this.setTitulo();
    },
    initDefaultButtons: function () {
        var _this = this;

        this.lbCantidadproductos = new Ext.form.Label({text: _this.idioma.lbCantidadProductos, style: 'padding: 10px 8px 0px 0px;'});

        this.lbCantidadcumptotal = new Ext.form.Label({text: _this.idioma.lbCantidadCummplidosTotal, style: 'padding: 10px 8px 0px 0px;'});

        this.lbCantidadcumpparcialmente = new Ext.form.Label({text: _this.idioma.lbCantidadCumplidosParcialmente, style: 'padding: 10px 8px 0px 0px;'});

        this.progressCumplido = new Ext.ux.ProgressBar({
            textPst: '%',
            colored: true,
            mal: 65,
            regular: 85,
            label: _this.idioma.lbPorCientoCumplimiento
        });

        this.addToolbarButton(this.lbCantidadproductos);
        this.addToolbarButton(' ');
        this.addToolbarButton(this.lbCantidadcumptotal);
        this.addToolbarButton(' ');
        this.addToolbarButton(this.lbCantidadcumpparcialmente);
        this.addToolbarButton(' ');
        this.addToolbarButton(this.progressCumplido.getFormatLabel());
        this.addToolbarButton(' ');
        this.addToolbarButton({text: this.progressCumplido.getProgressBar(), id: 'progresCumplimiento'});
    },
    initDefaultColumns: function () {
        var _this = this;
        let isFarmacia = typeof farmacia !== "undefined" && farmacia == 1;
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        if(isFarmacia == 1) {
            this.addGridColumn({
                header: 'Nº. lote',
                width: 150,
                dataIndex: "numerolote",
                default: true,
                filter: {
                    type: "string",
                    emptyText: 'N\xfamero de lote',
                    dataIndex: "numerolote",
                },
            });

            this.addGridColumn({
                header: 'Fecha vencimiento lote',
                width: 100,
                dataIndex: "fechavencelote",
                default: true
            });
        }
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            dataIndex: 'denominacion',
            default: true,
            autoExpand: true
        });

        this.addGridColumn({
            header: _this.idioma.cgUM,
            width: 80,
            dataIndex: 'umedida',
            default: true
        });
        
        this.addGridColumn({
            header: _this.idioma.cgCliente,
            hidden: true,
            width: 120,
            dataIndex: 'cliente',
            agrupador: true,
            default: true
        });

        /*this.addGridColumn({
            header: 'Pedido',
            width: 120,
            dataIndex: 'pedida',
            default: true
        });*/

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgAutorizado,
            width: 80,
            dataIndex: 'cantidad',
            align: 'right',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgEntregado,
            width: 80,
            dataIndex: 'entregado',
            align: 'right',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgEnProceso,
            width: 80,
            dataIndex: 'enproceso',
            align: 'right',
            default: true
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaCantidad({
            header: _this.idioma.cgNoProcesado,
            width: 80,
            dataIndex: 'noprocesado',
            align: 'right',
            default: true
        }));

        this.addGridColumn(new Ext.ux.grid.ProgressColumn({
            header: _this.idioma.cgPorCiento,
            width: 105,
            dataIndex: 'porciento',
            align: 'center',
            textPst: '%',
            actionEvent: 'click'
        }));

        this.addGridColumn({dataIndex: 'idprodorden'});

        this.addGridColumn({dataIndex: 'idcliente'});

        this.addGridColumn({dataIndex: 'cantcumpltotal'});

        this.addGridColumn({dataIndex: 'cantcumplparc'});

    },
    init: function () {
        var _this = this;
        LOG.dist.distribucion.winCumplimiento.superclass.init.call(this);
        LOG.util.UIManager.apply(_this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: 'Cerrar'
        }, true));
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().maximized = true;
        this.getVistaPrincipal().resizable = false;

        this.treeLoader = new Ext.tree.TreeLoader({
            dataUrl: '/logistica/distribucion/distribucion/index.php/distribucion/cargarArbolClientes',
            listeners: {
                beforeload: function (loader, nodo, fnCallBack) {
                    this.baseParams.iddocumento = (_this.datos.iddocumento) ? _this.datos.iddocumento : -1;
                    _this.tpEstructuras.enable();
                },
                load: function (obj, node, response) {
                }
            }
        });

        this.tpEstructuras = new Ext.tree.TreePanel({
            useArrows: true,
            urlController: null,
            border: false,
            bodyBorder: false,
            region: 'center',
            containerRegion: 'west',
            containerCollapsible: true,
            enableDD: true,
            autoScroll: true,
            style: 'margin: 2 2 2 2',
            loader: this.treeLoader,
            frame: true,
            height: 800,
            layout: 'fit',
            bodyStyle: 'background-color: white',
            listeners: {
                'click': function (node, e) {
                    _this.nodoSeleccionadoArbol = node;
                    _this.getStorePrincipal().reload();
                }
            }
        });

        this.nodopadre = new Ext.tree.AsyncTreeNode({
            text: _this.idioma.lbClientes,
            id: '0',
            animate: true,
            expanded: true
        });

        this.tpEstructuras.setRootNode(this.nodopadre);

        this.PanelRegionOeste = LOG.util.UIManager.initPanel({
            collapsible: true,
            layout: 'fit',
            width: 255,
            collapseMode: 'mini',
            titleCollapse: true,
            region: 'west',
            title: _this.idioma.tlPanelClientesCumplimiento,
            animCollapse: false,
            animate: true,
            pContainer: _this.getPanelPrincipal(),
            items: [this.tpEstructuras]
        });


        this.listColCancel = new LOG.util.List();

        this.listColCancel.add({
            dataIndex: 'idcancelacion',
            default: true
        });

        this.listColCancel.add({
            header: 'Motivo',
            dataIndex: 'motivo',
            default: true,
            width: 350
        });

        this.listColCancel.add({
            header: 'Cantidad',
            dataIndex: 'cantidad',
            default: true,
            align: 'right',
            width: 100
        });

        this.listColCancel.add({
            header: 'Fecha',
            dataIndex: 'fecha',
            default: true,
            width: 100
        });

        this.listColCancel.add({
            header: 'Creado por',
            dataIndex: 'creadopor',
            default: true,
            width: 150
        });

        this.listColCancel.add({
            header: 'Aprobado por',
            dataIndex: 'aprobadopor',
            default: true,
            width: 150
        });

        this.smGridCancel = LOG.util.UIManager.initSelectionModel(2, true);

        var cls = LOG.util.UIManager.proccessColumns(this.listColCancel);
        this.cmGridCancel = new Ext.grid.ColumnModel(cls.columns);
        this.recStGridCancel = Ext.data.Record.create(cls.fields);
        this.storeCancel = new Ext.data.Store({
            autoLoad: false,
            url: 'cargarCancelaciones',
            reader: new Ext.data.JsonReader({
                id: "idcancelacion",
                root: "datos"
            }, this.recStGridCancel)
        });
        this.gpCancel = LOG.util.UIManager.initEditableGridPanel(this.cmGridCancel, this.storeCancel, this.smGridCancel, {nobbar: true});

        this.PanelRegionSur = LOG.util.UIManager.initPanel({
            collapsible: true,
            layout: 'fit',
            collapseMode: 'mini',
            titleCollapse: true,
            region: 'south',
            title: 'Cancelaciones',
            split: true,
            animCollapse: false,
            animate: true,
            height: 150,
            pContainer: _this.getPanelGrid(),
            items: [this.gpCancel]
        });

        _this.getPanelPrincipal().onRender = _this.getPanelPrincipal().onRender.createSequence(function () {
            _this.getPanelGrid().add(this.PanelRegionSur);
            _this.getPanelPrincipal().add(this.PanelRegionOeste);
        }, _this);

        LOG.util.UIManager.apply(this.getVistaPrincipal(), {
            onShow: function () {
                _this.onShowHandler();
            }
        });

    },
    render: function () {
        var _this = this;
        var render = LOG.dist.distribucion.winCumplimiento.superclass.render.call(this);

        return render;
    },
    redondear: function (cantidad, decimales) {
        var cantidad = parseFloat(cantidad);
        var decimales = parseFloat(decimales);
        decimales = (!decimales ? 2 : decimales);
        return Math.round(cantidad * Math.pow(10, decimales)) / Math.pow(10, decimales);
    },
    onShowHandler: function () {
        var _this = this;
        LOG.util.UIManager.apply(this.getStorePrincipal().initBaseParams, {
            iddocumento: (_this.datos.iddocumento) ? _this.datos.iddocumento : -1,
            estadopedido: (_this.datos.estadopedido) ? _this.datos.estadopedido : -1,
            cumplimiento: true
        });
        _this.getStorePrincipal().on({
            'beforeload': function () {
                _this.getStorePrincipal().initBaseParams.idcliente = (_this.nodoSeleccionadoArbol != null) ? _this.nodoSeleccionadoArbol.attributes.id : null;
                _this.getStorePrincipal().initBaseParams.externo = _this.externo;
            },
            'load': function (stCumpl, objeto) {
                for (var i = 0; i < stCumpl.data.length; i++) {
                    var obj = stCumpl.data.items[i].data;
                    stCumpl.getAt(i).set('porciento', _this.redondear(obj.porciento, 2));
                }
                _this.lbCantidadproductos.setText(_this.idioma.lbCantidadProductos + ' ' + stCumpl.getCount());
                _this.lbCantidadcumptotal.setText(_this.idioma.lbCantidadCummplidosTotal + ' ' + (stCumpl.reader.jsonData.cantcumpltotal || 0));
                _this.lbCantidadcumpparcialmente.setText(_this.idioma.lbCantidadCumplidosParcialmente + ' ' + (stCumpl.reader.jsonData.cantcumplparc || 0));
                var valor = (isNaN(parseInt(stCumpl.reader.jsonData.porcientocumplimiento))) ? 0 : _this.redondear(stCumpl.reader.jsonData.porcientocumplimiento, 2);
                _this.progressCumplido.setText('progresCumplimiento', valor);
            }
        });
        _this.getSmPrincipal().on('selectionchange', function(sm) {
            if (sm.getSelections().length == 1) {
                _this.storeCancel.load({
                    params: {
                        idprodorden: sm.getSelections()[0].data.idprodorden
                    }
                });
            } else {

            }
        });
        this.getStorePrincipal().load();
    },
    setTitulo: function () {
        var _this = this;
        _this.getVistaPrincipal().setTitle(String.format(_this.idioma.tlVentanaCumplimiento, _this.record.data.nrodoc, _this.record.data.fechacontable, LOG.lb.documento.Estado[_this.record.data.estado]));
    }
});
Ext.ns('LOG.lb.maestroproductos');

LOG.lb.maestroproductos.UIProductos = Ext.extend(LOG.util.Window, {
    usarAplicar: false,
    tipo: 1,
    estado: true,
    usarEspecialidad: true,
    usarMarcaModelo: false,
    usarCodigoAutogenerado: false,
    dirController: undefined,
    controllerAction: undefined,
    arbolDirController: undefined,
    arbolControllerAction: undefined,
    showArbol: false,
    parametros: undefined,
    constructor: function (config) {
        var _this = this;
        config = config || {};
        Ext.apply(this, config);
        config.idioma = LOG.util.UIManager.apply(LOG.lb.maestroproductos.Idioma, LOG.util.Idioma);
        LOG.lb.maestroproductos.UIProductos.superclass.constructor.call(this, config);
        this.add(this.initPanel());
        this.panelProductos.getStorePrincipal().on({
            beforeload: function () {
                LOG.util.UIManager.apply(_this.panelProductos.getStorePrincipal().initBaseParams, _this.parametros);
                this.initBaseParams.tipo = _this.tipo;
                this.initBaseParams.estado = _this.estado ? 1 : 0;
                if (_this.parametros && _this.parametros.idseleccionados) {
                    _this.panelProductos.getStorePrincipal().initBaseParams.idseleccionados = _this.parametros.idseleccionados;
                }
            }
        });
        this.getConfiguredTitle();
        this.getButton(2).controlFn = this.defaultControlFn;
        this.getButton(1).controlFn = this.defaultControlFn;
        if (!this.usarEspecialidad) {
            this.panelProductos.getStorePrincipal().load();
        }
        this.aceptarFn = function () {
            if (this.doAction && typeof this.doAction == 'function') {
                this.doAction.createDelegate(this, [this.panelProductos.getSmPrincipal().getSelections()]).call();
            }
        };
        this.panelProductos.getGridPrincipal().on(
            "celldblclick",
            function (grid, rowIndex, columnIndex, e) {
              this.img = grid.store.data.items[rowIndex].data.imagen;
      
              if (columnIndex == 2 && this.img) {
                  //if (!_this.winImagen) {
                      _this.winImagen = new LOG.util.Window({
                          usarAplicar: false,
                          usarAceptar: false,
                          resizable: false,
                          title: 'Vista previa',
                          width: 450,
                          height: 450,
                          items: [
                              LOG.util.UIManager.initPanel({
                                  region: 'center',
                                  html: '<img src='+this.img+' style="width: 100%; height: 100%;">'
                              })
                          ]
                      });
                      _this.winImagen.on({
                          'show': function () {
                              _this.winImagen.base64Img = this.img;
                          },
                          'close':function() {
                              _this.winImagen.destroy();
                          }
                      });
                  }
      
                  _this.winImagen.show();
                  _this.winImagen.doLayout();
              //}
            }
          );
    },
    initPanel: function () {
        this.panelProductos = new LOG.util.UITemplate({
            busquedaBasica: true,
            activeView: 0,
            modoSeleccion: this.modoSeleccion || 3,
            autoLoadPlugins: false,
            autoLoad: false,
            textBusquedaSimple: this.idioma.lbBusquedaSimple,
            concepto: this.tipo == 1 ? this.idioma.ttBuscar : this.idioma.ttBuscarServ,
            autoSelect: false,
            formaVisualizacion: 'panel',
            dirController: this.dirController || '/logistica/utiles/maestroproductos/index.php/maestroproductos',
            urlBusquedaGridPrincipal: this.controllerAction || 'cargarGridClasificador'
        });

        this.panelProductos.addGridColumn({
            header: 'Imagen',
            width: 40,
            dataIndex: 'imagen',
            default: true,
            renderer: function (value, metaData, record) {
              if (record.json.imagen) {
                return '<button class="icondistra-aceptar verde" style="background: transparent;border:none"></button>';
              }
              return '<button class="icondistra-cancelar rojo" style="background: transparent;border:none"></button>';
            }
        });
        this.panelProductos.addGridColumn({
            header: this.idioma.lbEstado,
            width: 65,
            dataIndex: 'estado',
            default: true,
            renderer: function (value, metaData) {
                if (value == 1) {
                    metaData.css = 'log-estado';
                } else {
                    metaData.css = 'log-inactivo';
                }
                return '';
            }
        });
        if (this.usarCodigoAutogenerado) {
            this.panelProductos.addGridColumn({
                header: this.idioma.lbCodigo,
                dataIndex: 'codigo',
                default: true,
                width: 120,
                filter: {
                    type: 'string',
                    emptyText: this.idioma.lbCodigo,
                    dataIndex: 'codigo'
                }
            });
        }
        this.panelProductos.addGridColumn({
            header: this.idioma.lbNroPieza,
            dataIndex: 'numeropieza',
            default: true,
            width: 120,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbNroPieza,
                dataIndex: 'numeropieza'
            }
        });
        this.panelProductos.addGridColumn({
            header: this.idioma.lbDenom,
            dataIndex: 'denominacion',
            default: true,
            width: 285,
            filter: {
                type: 'string',
                emptyText: this.idioma.lbDenom,
                dataIndex: 'denominacion'
            }
        });
        this.panelProductos.addGridColumn({
            header: this.idioma.lbPais,
            dataIndex: 'nacionalidad',
            default: true,
            width: 285,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarPaises',
                valueField: 'idpais',
                displayField: 'nombrepais',
                dataIndex: 'nacionalidad',
            }
        });
        if (this.usarMarcaModelo) {
            this.panelProductos.addGridColumn({
                header: this.idioma.lbMarcaModelo,
                dataIndex: 'marcamodelo',
                width: 285
            });
        }
        this.panelProductos.addGridColumn(LOG.util.Prototipos.columnaPrecio({
            header: this.tipo == 1 ? this.idioma.lbPrecio : this.idioma.lbTarifa,
            dataIndex: 'precio',
            default: true,
            width: 65
        }));
        if (this.tipo == 1) {
            this.panelProductos.addGridColumn({
                header: this.idioma.lbUmedida,
                dataIndex: 'umedida',
                default: true,
                width: 65
            });
        }
        this.panelProductos.addGridColumn({
            header: this.idioma.lbNaturaleza,
            dataIndex: 'naturaleza',
            default: true,
            width: 90,
            filter: {
                type: 'combo',
                url: '/logistica/utiles/nomencladores/index.php/nomencladores/cargarnomencladorentidad?modelo=NomNaturaleza&idnom=idnaturaleza',
                valueField: 'idnaturaleza',
                displayField: 'denominacion',
                dataIndex: 'naturaleza',
            }
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'idindicador',
            default: true,
            width: 70
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'idnaturaleza',
            default: true,
            width: 70
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'idtabla',
            default: true,
            width: 70
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'idtablageneral',
            default: true,
            width: 70
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'arridtablas',
            default: true
        });
        this.panelProductos.addGridColumn({
            dataIndex: 'arridtablasgenerales',
            default: true
        });
        if (this.usarEspecialidad) {
            this.panelProductos.attachPlugin(new LOG.lb.maestroproductos.PluginEspecialidad(null, '?restringir=0'));
        }
        this.panelProductos.init();
        if (this.showArbol !== false) {

            this.arbolProductos = new LOG.lb.maestroproductos.ArbolProductos({
                parentContainer: this.panelProductos.getPanelGrid(),
                parentUI: this.panelProductos,
                urlController: this.arbolDirController,
                controllerAction: this.arbolControllerAction
            });
            this.arbolProductos.init();
            this.panelProductos.arbolProductos = this.arbolProductos;
            this.arbolProductos.getLoader().baseParams = this.parametros;
        }
        this.panelProductos.initPlugins();
        return this.panelProductos.view();
    },
    getConfiguredTitle: function () {
        var title = this.tipo == 1 ? 'Nomenclador de productos' : 'Nomenclador de servicios';
        title = this.title || title;
        var cssClass = this.tipo == 1 ? 'log-producto' : 'log-servicio';
        this.setTitle(title, cssClass);
        this.setSize(800, 400);
    },
    onShow: function () {
        var _this = this;
        LOG.util.UIManager.apply(_this.panelProductos.getStorePrincipal().initBaseParams, _this.parametros);
        this.listaBotones.each(function (b) {
            if (b.controlFn && typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        });
    },
    onShowHandler: function () {
        var _this = this;
        LOG.util.UIManager.apply(_this.panelProductos.getStorePrincipal().initBaseParams, _this.parametros);
        this.listaBotones.each(function (b) {
            if (b.controlFn && typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        });
    },
    defaultControlFn: function (btn, caller) {
        btn.disable();
        var sm = this.panelProductos.getSmPrincipal();
        caller.panelProductos.getSmPrincipal().fireEvent = this.panelProductos.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                btn.disable();
                if (sm.hasSelection()) {
                    btn.enable();
                }
            }
        });
    }
});

LOG.lb.maestroproductos.UIArbolProductos = Ext.extend(LOG.util.Window, {
    usarAplicar: false,
    tipo: 1,
    usarCheckBox: false,
    resizable: false,
    constructor: function (config) {
        config = config || {};
        this.selectHojas = config.selectHojas || false;
        LOG.lb.maestroproductos.UIArbolProductos.superclass.constructor.call(this, config);
    },
    initComponent: function () {
        LOG.lb.maestroproductos.UIArbolProductos.superclass.initComponent.call(this);
        this.arbolProductos = new LOG.lb.maestroproductos.ArbolProductos({
            parentContainer: this,
            containerRegion: 'center',
            containerCollapsible: false,
            isService: true,
            baseParams: {
                tipo: this.tipo,
                usarCheckBox: this.usarCheckBox ? 1 : 0
            }
        });
        this.arbolProductos.init();
        this.setTitle('\xc1rbol' + (this.tipo == 1 ? ' de productos' : ' de servicios'));
        this.setSize(305, 450);
        this.getButton(2).controlFn = this.defaultControlFn;
        this.getButton(1).controlFn = this.defaultControlFn;
        this.aceptarFn = function () {
            if (this.doAction && typeof this.doAction == 'function') {
                this.doAction.createDelegate(this, [this.usarCheckBox ? this.arbolProductos.getChecked() : this.arbolProductos.getSelectedNode()]).call();
            }
        };
        var _this = this;
        this.on('show', function () {
            _this.onShow();
        });
    },
    onShow: function () {
        var _this = this;
        this.listaBotones.each(function (b) {
            if (b.controlFn && typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        });
    },
    defaultControlFn: function (btn, caller) {
        btn.disable();
        var sm = caller.arbolProductos.getSelectionModel();
        caller.arbolProductos.fireEvent = caller.arbolProductos.fireEvent.createSequence(function (e) {
            if (e == 'checkchange') {
                btn.disable();
                if (caller.arbolProductos.getChecked().length > 0) {
                    btn.enable();
                }
            }
        });
        sm.fireEvent = sm.fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                if (caller.usarCheckBox) {
                    return;
                }
                btn.disable();
                if (caller.selectHojas) {
                    if (sm.getSelectedNode().id != 0 && sm.getSelectedNode().leaf == true) {
                        btn.enable();
                    }
                    a
                } else {
                    if (sm.getSelectedNode().id != 0) {
                        btn.enable();
                    }
                }
            }
        });
    },
    getChecked: function () {
        if (this.usarCheckBox) {
            return this.arbolProductos.getChecked('id');
        }
        return [];
    }
});
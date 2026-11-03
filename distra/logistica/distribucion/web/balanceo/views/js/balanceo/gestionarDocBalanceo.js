LOG.dist.balanceo.GestDocBalanceo = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    listaGridColumnsBalanceo: undefined,
    estadoDoc: undefined,
    constructor: function (config) {
        LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
        this.listaGridColumnsBalanceo = new LOG.util.List();
        this.listaPedidos = [];
        this.modelo = new LOG.dist.balanceo.Model({
            idioma: config.idioma,
            urlAccionConfirmar: 'confirmarDocumento',
            urlAccionAnularEstado: 'anularEstadoDocumento',
            urlAccionAprobar: 'aprobarEstadoDocumento',
            urlAccionAnular: 'eliminarDocumento'
        });

        LOG.dist.balanceo.GestDocBalanceo.superclass.constructor.call(this, config);

        
    },
    initDefaultButtons: function () {
      var _this = this;
      
      this.addToolbarButtonVentana(LOG.util.Prototipos.botonAbrir({
        text: 'Balancear',
        scope: this,
        tooltip: 'Realizar balanceo',
        handler: function(){
          _this.openGestionarDatosBalanceo();
        },
        controlFn: function (b, _caller) {
          if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('RProductos')) {
            b.setVisible(true);
          } else {
            b.setVisible(false);
          }
        }
      }));
      
      this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
          handler: function(){
            _this.modelo.anular();
            _this.close();
          },
          controlFn: function (b, _caller) {
            if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('REliminar')) {
              b.setVisible(true);              
            } else {
              b.setVisible(false);
            }
          }
      }));
      this.addToolbarButtonVentana(LOG.util.Prototipos.botonConfirmar({
          text: 'Confirmar',
          handler: function(){
            _this.modelo.confirmar(null, function(resp){
              _this.setEstadoDoc(2);
            }, (resp) => {
              if(resp.codigoMsg == 'CANT_ERRORNEAS'){
                mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFailCant);
              }else {
                mostrarMensaje(3, _this.idioma.msgDocumentoConfirmadoFail);
              }
            });
          },
          controlFn: function (b, _caller) {
            if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('RConfirmar')) {
              b.setVisible(true);
            } else {
              b.setVisible(false);
            }
          }
      }));

      this.addToolbarButtonVentana(LOG.util.Prototipos.botonAnularEstado({
          text: 'Anular estado',
          handler: function(){
            _this.modelo.anularestado(null, function(resp){
              _this.setEstadoDoc(1);
            });
          },
          controlFn: function (b, _caller) {
            if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('RAnularestado') || _this.scope.grantedAction('RAnular')) {
              b.setVisible(true);
            } else {
              b.setVisible(false);
            }
          }
      }));

      this.addToolbarButtonVentana(LOG.util.Prototipos.botonAprobar({
          text: 'Aprobar',
          handler: function(){
            _this.modelo.aprobar(null, function(){
              _this.setEstadoDoc(3);
            });
          },
          controlFn: function (b, _caller) {
            if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RAprobar')) {
              b.setVisible(true);
            } else {
              b.setVisible(false);
            }
          }
      }));

      this.btnAdicionarPedidos = LOG.util.Prototipos.botonAdicionar({
        text: 'Adicionar',
        scope: this,
        tooltip: 'Adicionar pedido',
        handler: function(){
          _this.openWinAddPedido();
        },
        controlFn: function (b, _caller) {
          if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('REditar')) {
            b.setVisible(true);
          } else {
            b.setVisible(false);
          }
        }
      });
      this.addToolbarButtonProductos(this.btnAdicionarPedidos);

      this.btnEliminarPediod = LOG.util.Prototipos.botonEliminar({
        text: 'Eliminar',
        scope: this,
        tooltip: 'Eliminar pedido',
        handler: function(){
          _this.eliminarPedidos();
        },
        controlFn: function (b, _caller) {
          if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('REditar')) {
            b.setVisible(true);
          } else {
            b.setVisible(false);
          }
        }
      });
      this.addToolbarButtonProductos(this.btnEliminarPediod);
      
      this.btnComprar = LOG.util.UIManager.createBtn({
        iconCls: 'comprar',
        text: 'Comprar productos',
        handler: function () {
          _this.comprarTodosPedidos();
        },
        controlFn: function (b, _caller) {
          if (_this.scope.grantedAction('CT') || _this.scope.grantedAction('RCRUD') || _this.scope.grantedAction('REditar')) {
            b.setVisible(true);
          } else {
            b.setVisible(false);
          }
        }
      });
      this.addToolbarButtonProductos(this.btnComprar);
      
    },
    initDefaultColumns: function (config) {
        var _this = this;
        LOG.dist.balanceo.GestDocBalanceo.superclass.initDefaultColumns.call(this);
        
        this.listaGridColumnsBalanceo.add({
            header: 'Entidad',
            width: 300,
            default: true,
            autoExpand: true,
            dataIndex: 'estructura',
            agrupador: true
        });

        this.listaGridColumnsBalanceo.add({
            header: 'No. de pedido',
            width: 120,
            default: false,
            dataIndex: 'nrodoc'
        });
        
        this.listaGridColumnsBalanceo.add({
            header: 'Cliente',
            width: 250,
            default: true,
            autoExpand: true,
            dataIndex: 'cliente'
        });

        this.listaGridColumnsBalanceo.add({
            header: 'Fecha de emisi\xf3n',
            width: 140,
            dataIndex: 'fechacontable',
            default: true
        });

        this.listaGridColumnsBalanceo.add({
            header: 'Cantidad de productos',
            width: 140,
            dataIndex: 'productos',
            default: true
        });

        this.listaGridColumnsBalanceo.add({
            header: 'Observaciones',
            width: 140,
            dataIndex: 'observaciones',
            default: true
        });

        this.listaGridColumnsBalanceo.add({dataIndex: 'idcliente'});

        this.listaGridColumnsBalanceo.add({dataIndex: 'idpedido'});

    },
    builComponent: function () {
        this.idioma = this.idioma || LOG.dist.balanceo.Idioma;

        var _this = this;
        
        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: this.idioma.tlPanelGeneral,
            autoHeight: true,
            frame: true
        });

        this.smGridDetalles = LOG.util.UIManager.initSelectionModel(2);

        var cls = LOG.util.UIManager.proccessColumns(this.listaGridColumnsBalanceo);

        this.cmGridDetalles = new Ext.grid.ColumnModel(cls.columns);

        this.recStGridDetalles = Ext.data.Record.create(cls.fields);

        this.stGridDetalles = new Ext.data.Store({
            url: 'cargarPedidosBalanceo',
            reader: new Ext.data.JsonReader({
                id: 'iddocumento',
                totalProperty: 'cantidad',
                root: 'datos'
            }, this.recStGridDetalles)
        });

        this.stGridDetalles.on({
            'beforeload': function () {
              _this.stGridDetalles.initBaseParams[_this.modelo.primaryKeyField] = (_this.modelo[_this.modelo.primaryKeyField]) ? _this.modelo[_this.modelo.primaryKeyField] : -1;
            },
            'load': function(st, records, options){
              _this.listaPedidos = records.map(pedido => ({
                nrodoc: pedido.json.nrodoc,
                cliente: pedido.json.cliente,
                fechacontable: pedido.json.fechacontable,
                productos: pedido.json.productos,
                idpedido: pedido.json.iddocumento,
                idcliente: pedido.json.idcliente,
                observaciones: pedido.json.observaciones
              }));
            }
        });

        this.stGridDetalles.fireEvent = this.stGridDetalles.fireEvent.createSequence(function (e) {
            if (e == 'load') {
                _this.smGridDetalles.clearSelections();
                _this.smGridDetalles.fireEvent('rowdeselect');
                if (_this.stGridDetalles.getTotalCount() > 0) {
                    _this.smGridDetalles.selectFirstRow();
                }
            }
        });

        this.gridDetalles = LOG.util.UIManager.initEditableGridPanel(this.cmGridDetalles, this.stGridDetalles, this.smGridDetalles, {
            expanded: cls.expanded,
            nobbar: false
        });

        LOG.util.UIManager.initFilterGrid(this.gridDetalles,'No. Doc',this.idioma.ttConcepto);

        // El panel productos es en realidad el panel pedidos
        this.panelProductos = LOG.util.UIManager.initPanel({
            tbar: LOG.util.UIManager.initToolbar({
                items: this.listaBotonesProductos.getArray()
            }),
            layout: 'border',
            region: 'center',
            title: 'Pedidos',
            items: [this.gridDetalles]
        });

        this.panelProductos.doLayout();

        this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: this.salvarHandler,
            scope: this
        });

        /*this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.ttBtnNuevo,
            handler: this.onResetHandler,
            scope: this
        });*/

        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: this.idioma.lbBtnCerrar,
            scope: this
        }, true);

        this.modelo.addActionButton(this.btnSalvar);

        LOG.util.UIManager.apply(this, {
            tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            items: [this.panelSuperior, this.panelProductos],
            buttons: [this.btnCerrar, /*this.btnNuevo,*/ this.btnSalvar]
        });

        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.onShow = this.onShow.createSequence(this.onShowHandler, this);
    },
    onShowHandler: function() {
        this.listaBotonesVentana.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
        this.listaBotonesProductos.each(function(b) {
            LOG.util.UIManager.applyKey(b, this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }, this);
    },
    onRenderHandler: function() {
        LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this);
        LOG.util.UIManager.applyKey(this.btnNuevo, this);
    },
    onCloseHandler: function (p) {
        var _this = this;
        _this.onClose();
        _this.idDocumento = undefined;
        this.listaPedidos = [];
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            if (_this.stGridDetalles) {
                _this.stGridDetalles.removeAll();
                _this.gridDetalles.getView().refresh();
            }
        }
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.record = null;
            _this.stGridDetalles.removeAll();
            _this.gridDetalles.getView().refresh();
            _this.setTitle(_this.idioma.tlGestDocBalanceo);
            _this.onShowHandler();
        }
    },
    salvarHandler: function (params) {
        var _this = this.scope || this;
        params = params || null;
        
        if(!params){
          params = {
            iddocumento: _this.idDocumento || null,
            documentos: Ext.encode(_this.listaPedidos.map(p => p.idpedido)),
          } 
        }
        

        if (_this.stGridDetalles.data.length == 0 ) {
            mostrarMensaje(1, _this.idioma.msgValidarBalanceo);
        } else {
            _this.modelo.salvar(params, function (r) {
                
                if (_this.winGestionarDocumento && _this.winGestionarDocumento.record == null) {
                    _this.winGestionarDocumento.record = {};
                    Ext.apply(_this.winGestionarDocumento.record, {
                        data: {
                            iddocumento: r.iddocumento,
                            nrodoc: r.nro,
                            numeroref: r.numeroref,
                            fechacontable: r.fecha,
                            //tipodestino: r.tipodestino,
                            //tipodistribucion: r.tipodistribucion,
                            estado: "1",
                            //cant_clientes: r.cantclientes,
                            //cant_productos: 0
                        }
                    });
                }
                _this.getTitleDocumento(r.iddocumento);
                _this.listaBotonesVentana.each(function (b) {
                    LOG.util.UIManager.applyKey(b, _this);
                    if (typeof b.controlFn == 'function') {
                        b.controlFn.createDelegate(_this, [b, _this]).call();
                    }
                }, _this);
                _this.setEstadoDoc(1);
            }, null, "El documento ha sido guardado satisfactoriamente.");
        }
    },
    cargarProductos: function (parametros) {
        const lastOptions = this.stGridDetalles.lastOptions || {params: {}};
        Ext.apply(lastOptions.params, parametros);
        
        this.stGridDetalles.load();
    },
    prepareDocModify: function (d) {
        if (this.fromularioGestion) {
            this.fromularioGestion.getForm().loadRecord(d);
            this.modelo.loadRecord();
            this.cargarProductos();
            this.record = d;
            this.getTitleDocumento(this.record.data.iddocumento);
        }
    },
    getTitleDocumento: function(iddocumento) {
        var _this = this;
        _this.modelo.iddocumento = iddocumento;
        _this.idDocumento = iddocumento;
        this.modelo.cargaInicial({
            url: 'cargarEncabezado',
            iddocumento: iddocumento
        }, function(datos) {
            var encabezado = datos[0];
            encabezado.estado = LOG.lb.documento.Estado[encabezado.estado];
            if (_this.isVisible()) {
                _this.setTitle(encabezado.tipo + " # " + encabezado.numero + " del " + encabezado.fecha + " en " + encabezado.estado);
            }
            _this.fromularioGestion.getForm().loadRecord({
                data: encabezado
            });
        });
    },
    onShow: function () {
        this.listaBotonesVentana.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
        this.listaBotonesProductos.each(function (b) {
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(this, [b, this]).call();
            }
        }.createDelegate(this));
    },
    openWinAddPedido: function() {
        var _this = this;      
        _this.winAddPedidos = new LOG.dist.balanceo.WinSeleccionarPedidos({
          idioma: _this.idioma,
          textBusquedaSimple: 'Nro documento',
          busquedaBasica: true,
          busquedaAvanzada: true,
          viewConfig: {
            width: '80%',
            height: 500,
            title: 'Pedidos'
          },
          baseParams: {
            //idseleccionados: Ext.encode(_this.listaPedidos.map(p => p.idpedido))
          },
          onSelectPedido: function(pedidos, fn_reload) {
            if(pedidos && pedidos.length > 0){
              if(!_this.idDocumento){
                pedidos
                  .map(pedido => ({
                    nrodoc: pedido.nrodoc,
                    cliente: pedido.cliente,
                    fechacontable: pedido.fechacontable,
                    productos: pedido.productos,
                    idpedido: pedido.iddocumento,
                    idcliente: pedido.idcliente,
                    estructura: pedido.estructura,
                    observaciones: pedido.observaciones,
                  }))
                  .forEach(pedido => {
                    _this.listaPedidos.push(pedido);
                    const rec = new _this.stGridDetalles.recordType(pedido, pedido.idpedido);
                    _this.stGridDetalles.add(rec);
                  });
              } else {
                var _fn = function(){
                  _this.stGridDetalles.load();
                };
                const idpedidos = pedidos.map(pedido => pedido.iddocumento);
                _this.modelo.agregarPedidosDoc(_this.idDocumento, idpedidos, _fn);
              }  
            } 
          }
        });
        _this.winAddPedidos.init();
        _this.winAddPedidos.getPanelBusqueda().setColumns(1);
        _this.winAddPedidos.addFilterComponent(LOG.dist.balanceo.formBusqAvanzada(_this.winAddPedidos));
     
        _this.winAddPedidos.view();
    },
    openGestionarDatosBalanceo: function(){
      var _this = this;      
      _this.vpGestDatosBalanceo = new LOG.dist.balanceo.VpGestionarDatosBalanceo({
        idioma: _this.idioma,
        iddocumento: _this.idDocumento,
        estadoDoc: _this.estadoDoc,
        formaVisualizacion: 'ventana',
        viewConfig: {
          width: window.innerWidth,
          height: window.innerHeight,
          title: 'Balanceo'
         
        },
        parentView: _this,
      });
      _this.vpGestDatosBalanceo.attachPlugin(new LOG.lb.plugin.Sustituto());
      _this.vpGestDatosBalanceo.init();
      _this.vpGestDatosBalanceo.getVistaPrincipal().on({
        'beforehide': function(){
          _this.cargarProductos();
        }
      });
      _this.vpGestDatosBalanceo.view();

    },
    eliminarPedidos: function() {

      const _this = this; 
      const records = _this.smGridDetalles.getSelections();
      if(records.length == 0){
        mostrarMensaje(3, 'Debe seleccionar al menos un pedido a eliminar.');
        
      } else {
        mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar los pedidos seleccionados\x3f', function(btn) {
          if(btn == 'ok'){
              var vistaBalanceo = new LOG.dist.balanceo.View({
                  acciones: acciones_reportes,
                  busquedaBasica: true,
                  busquedaAvanzada: true,
                  idioma: LOG.util.UIManager.apply(LOG.dist.balanceo.Idioma, LOG.util.Idioma)
              });
            if(!_this.idDocumento){
              _this.stGridDetalles.remove(records);
                self.observaciones = '';
                self.obsanteriores = vistaBalanceo.taObservaciones.getValue();
                var observacion = self.obsanteriores.split('\n');console.info(observacion);
                Ext.each(records, function (rec) {
                    var observ = rec.data.nrodoc + ' - ' + rec.data.estructura + ' - ' + rec.data.observaciones;
                    Ext.each(observacion, function (obs) {
                        if(observacion.indexOf(observ) != -1){
                            observacion.splice(observacion.indexOf(observ),1)
                        }
                    });
                });
                self.observaciones = observacion.join('\n');

                vistaBalanceo.taObservaciones.setValue(self.observaciones);
            }else{
              const _fn = function(){
                _this.stGridDetalles.load({
                    callback: function (r, opt, succ) {
                        self.observaciones = '';
                        self.obsanteriores = vistaBalanceo.taObservaciones.getValue();
                        var observacion = self.obsanteriores.split('\n');
                        Ext.each(records, function (rec) {
                            var observ = rec.data.nrodoc + ' - ' + rec.data.estructura + ' - ' + rec.data.observaciones;
                            Ext.each(observacion, function (obs) {
                                if(observacion.indexOf(observ) != -1){
                                    observacion.splice(observacion.indexOf(observ),1)
                                }
                            });
                        });
                        self.observaciones = observacion.join('\n');
                        vistaBalanceo.taObservaciones.setValue(self.observaciones);
                        Ext.Ajax.request({
                            url: 'actualizarObservaciones',
                            params: {observaciones: self.observaciones, iddocumento: _this.idDocumento},
                            method: "POST",
                            callback: function (options, success, response) {
                                var responseData = Ext.decode(response.responseText);
                            },
                            success: function () {
                            }
                        });
                    }
                });
              };
              const idpedidos = records.map(records => records.json.iddocumento);
              _this.modelo.eliminarPedidos(_this.idDocumento, idpedidos,  _fn);

            }
          }
        });
      }
    },
    comprarTodosPedidos: function() {
      const _this = this;
      const records = _this.smGridDetalles.getSelections();
      if(records.length == 0){
        mostrarMensaje(3, 'Debe seleccionar los pedidos que desea enviar a comprar directamente.');
      } else {
        const idpedidos = records.map(records => records.json.iddocumento);
        _this.modelo.comprarPedidos(_this.idDocumento, idpedidos);
      }
    },
    setEstadoDoc: function(estado = undefined){
      this.estadoDoc = estado;
      this.gestionarBtns();
    },
    getEstadoDoc: function(){
      return this.estadoDoc;
    },
    gestionarBtns: function () {
      const posBtnBalancear = 0;
      const posBtnEliminar = 1;
      const posBtnConfirmar = 2;
      const posBtnAnular = 3;
      const posBtnAprobar = 4;
      const posBtnImprimir = 5;
  
      if(this.estadoDoc == 1){

        this.listaBotonesVentana.arrayData[posBtnBalancear].enable();
        this.listaBotonesVentana.arrayData[posBtnEliminar].enable();
        this.listaBotonesVentana.arrayData[posBtnConfirmar].enable();
        this.listaBotonesVentana.arrayData[posBtnAnular].disable();
        this.listaBotonesVentana.arrayData[posBtnAprobar].disable();
        this.listaBotonesVentana.arrayData[posBtnImprimir].enable();

        this.btnAdicionarPedidos.enable();
        this.btnEliminarPediod.enable();
        this.btnComprar.enable();

      } else if(this.estadoDoc == 2){
        
        this.listaBotonesVentana.arrayData[posBtnBalancear].enable();
        this.listaBotonesVentana.arrayData[posBtnEliminar].disable();
        this.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
        this.listaBotonesVentana.arrayData[posBtnAnular].enable();
        this.listaBotonesVentana.arrayData[posBtnAprobar].enable();
        this.listaBotonesVentana.arrayData[posBtnImprimir].enable();

        this.btnAdicionarPedidos.disable();
        this.btnEliminarPediod.disable();
        this.btnComprar.disable();

      } else if(this.estadoDoc == 3 || this.estadoDoc == 16){
        this.listaBotonesVentana.arrayData[posBtnBalancear].enable();
        this.listaBotonesVentana.arrayData[posBtnEliminar].disable();
        this.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
        this.listaBotonesVentana.arrayData[posBtnAnular].disable();
        this.listaBotonesVentana.arrayData[posBtnAprobar].disable();
        this.listaBotonesVentana.arrayData[posBtnImprimir].enable();

        this.btnAdicionarPedidos.disable();
        this.btnEliminarPediod.disable();
        this.btnComprar.disable();
      } else {
        this.listaBotonesVentana.arrayData[posBtnBalancear].disable();
        this.listaBotonesVentana.arrayData[posBtnEliminar].disable();
        this.listaBotonesVentana.arrayData[posBtnConfirmar].disable();
        this.listaBotonesVentana.arrayData[posBtnAnular].disable();
        this.listaBotonesVentana.arrayData[posBtnAprobar].disable();
        this.listaBotonesVentana.arrayData[posBtnImprimir].disable();

        this.btnAdicionarPedidos.enable();
        this.btnEliminarPediod.enable();
        this.btnComprar.disable();
      }
    }
});
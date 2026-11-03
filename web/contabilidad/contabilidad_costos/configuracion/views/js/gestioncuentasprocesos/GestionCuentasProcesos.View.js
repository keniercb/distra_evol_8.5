  Ext.ns('Costo.Procesos.Nomencladores');
  Costo.Procesos.Nomencladores.View = {
      init: function(perfil, etiquetas, model) {
          var scope = this;

          this.loadMessageBox = function() {
              Ext.MessageBox.show({
                  title: etiquetas.wait,
                  msg: etiquetas.loading,
                  width: 300,
                  progress: true,
                  closable: false
              });
              var f = function(v) {
                  return function() {
                      var i = v / 11;
                      Ext.MessageBox.updateProgress(i);
                  };
              };
              for(var i = 1; i < 12; i++)
                  setTimeout(f(i), i * 500);
          };
          scope.loadMessageBox();

          // Permite controlar si se esta realizando una peticion AJAx en determinado momento
          this.busyRequest = false;
          this.nodeSelected = undefined;

          this.btnPersistir = new Ext.Button({
              id: 'btnPersistir',
              disabled: true,
              iconCls: 'iniciodeanno',
              tooltip: etiquetas.tooltipBtnPersist,
              text: etiquetas.titleBtnPersist
          });

          this.btnAdicionar = new Ext.Button({
              id: 'btnAdicionar',
              iconCls: 'adicionar',
              tooltip: etiquetas.tooltipBtnAdicionar,
              text: etiquetas.lbtnAdicionar
          });

          this.btnEliminar = new Ext.Button({
              disabled: true,
              id: 'btnEliminar',
              iconCls: 'eliminar',
              tooltip: etiquetas.tooltipBtnEliminar,
              text: etiquetas.lbtnEliminar
          });

          this.btnAyuda = new Ext.Button({
              id: 'btnHelpCtaProc',
              iconCls: 'ayuda',
              tooltip: etiquetas.tooltipBtnAyuda,
              text: etiquetas.lbtnAyuda
          });

          // Para el menu contextual
          this.menuItemPersistir = new Ext.menu.Item({
              text: etiquetas.titleBtnPersist,
              iconCls: 'guardar'
          });

          this.menuContextual = new Ext.menu.Menu({
              floating: false,
              shadow: true,
              hideBorders: true,
              items: [this.menuItemPersistir]
          });

          this.mySelectionModel = new Ext.grid.RowSelectionModel({
              singleSelect: true
          });
          this.gridSubCuentas = new Ext.grid.GridPanel({
              id: 'gridSubCuentas',
              region: 'east',
              width: '70%',
              margins: '3 3 3 0',
              layout: 'fit',
              //disabled: true,
              frame: true,
              store: model.storeSubCuentas,
              autoExpandColumn: 'descripcion',
              loadMask: true,
              stripeRows: true,
              sm: this.mySelectionModel,
              columns: [{
                      id: 'idcuenta',
                      hidden: true,
                      sortable: true,
                      dataIndex: 'idcuenta'
                  }, {
                      id: 'codigo',
                      width: 150,
                      sortable: true,
                      header: etiquetas.lbCodigo,
                      dataIndex: 'concatcta'
                  }, {
                      id: 'descripcion',
                      sortable: true,
                      header: etiquetas.lbDescripcion,
                      dataIndex: 'descripcion'
                  }],
              tbar: [this.btnPersistir],
              bbar: new Ext.Cont.PagingToolbar({
                  pageSize: 20,
                  displayInfo: true,
                  emptyMsg: etiquetas.emptyMsg,
                  displayMsg: etiquetas.displayMsg,
                  tabIndex: 314,
                  store: model.storeSubCuentas
              })
          });

          aux = this;
          this.panelcomp = new Ext.form.FormPanel({
              id: 'idpanel',
              region: 'center',
              width: '30%',
              margins: '3 3 3 3',
              layout: 'fit',
              frame: true,
              items: [{}],
              tbar: [this.btnAdicionar, '-', this.btnEliminar],
              listeners: {
                  render: function() {
                      aux.btnAdicionar.focus(true, 100);
                      new Ext.Costo.Procesos.Configuracion.Componentes.CuentasProcesos({
                          id: 'cpmCuentasProcesos'
                      }).on({
                          initialize: function(componentClass, componentUI) {
                              componentUI.on({
                                  click: function(node, event) {
                                      Ext.getCmp('btnPersistir').disable();
                                      if(node.id != 0) {
                                          Ext.getCmp('btnEliminar').disable();
                                          Ext.getCmp('gridSubCuentas').enable();

                                          if(!scope.busyRequest && node != scope.nodeSelected) {
                                              scope.busyRequest = true;
                                              scope.nodeSelected = node;
                                              this.suspendEvents(); // suspendiendo los eventos para evitar que se seleccion otro nodo
                                              model.storeSubCuentas.load({
                                                  params: {
                                                      start: 0,
                                                      limit: 20
                                                  },
                                                  callback: function(records, options, success) {
                                                      scope.busyRequest = false;
                                                      componentUI.resumeEvents(); // activando nuevamente los eventos del arbol
                                                      Ext.getCmp('btnEliminar').enable();
                                                  }
                                              });
                                          }
                                      } else {
                                          Ext.getCmp('btnEliminar').disable();
                                      }
                                  }

                              });
                              componentUI.setHeight(aux.panelcomp.getSize().height);
                              aux.panelcomp.insert(0, componentUI);
                              aux.panelcomp.doLayout(true);
                          },
                          beforeload: function(object, node, callback) {
                              model.storeSubCuentas.removeAll();
                              Ext.MessageBox.hide();
                          }
                      });
                  }
              }
          });

          //**************panel principal************************//
          this.panel = new Ext.Panel({
              layout: 'border',
              items: [this.panelcomp, this.gridSubCuentas],
              tbar: ['->', this.btnAyuda]
          });
          new Ext.Viewport({
              layout: 'fit',
              items: [this.panel]
          });
      },
      createWindows: function(perfil, etiquetas) {
          this.btnCancelarAddCuentas = new Ext.Button({
              id: 'btnCancelarAddCuentas',
              iconCls: 'cancelar',
              tooltip: etiquetas.tooltipBtnCancelar,
              text: etiquetas.lbBtnCancelar
          });
          this.btnAceptarAddCuentas = new Ext.Button({
              id: 'btnAceptarAddCuentas',
              disabled: true,
              iconCls: 'aceptar',
              tooltip: etiquetas.tooltipBtnAceptar,
              text: etiquetas.lbBtnAceptar
          });

          this.panelAddCuentas = new Ext.Panel({
              id: 'panelAddCuentas',
              layout: 'form',
              labelAlign: 'top',
              frame: true,
              height: 300,
              width: 500,
              bodyStyle: 'background-color:#fff;',
              items: [{}],
              listeners: {
                  render: function(component) {
                      new Ext.Cont.Cuentas({
                          id: 'cpmCuentas',
                          types: [8032, 8034],
                          levels: false,
                          loadLeaf: false,
                          selectionType: 2,
                          addIn: component
                      });
                  }
              }
          });

          this.ventanaCuentas = new Ext.Window({
              onEsc: Ext.emptyFn(),
              title: etiquetas.titleVentAdicionar,
              id: 'ventanaSubCuenta',
              modal: true,
              resizable: false,
              constrain: true,
              defaultButton: 0,
              layout: 'fit',
              closeAction: 'close',
              items: [this.panelAddCuentas],
              buttons: [this.btnCancelarAddCuentas, this.btnAceptarAddCuentas]
          });
      }
  };

//Inicializando la vista.
  Ext.QuickTips.init();
  var perfil = window.parent.perfil
  perfil.etiquetas = Object();

  Ext.Ajax.request({
      method: "POST",
      url: "cargaretiquetas",
      callback: function(options, success, response) {
          var etiquetas = Ext.decode(response.responseText);
          //Inicializar el modelo
          var model = Costo.Procesos.Nomencladores.Model;
          model.init();

          //Inicializar la vista.
          var view = Costo.Procesos.Nomencladores.View;
          view.init(perfil, etiquetas, model);

          //Inicializar controlador.
          var controller = Costo.Procesos.Nomencladores.Controller;
          controller.init(perfil, view, model, etiquetas);
      }
  });

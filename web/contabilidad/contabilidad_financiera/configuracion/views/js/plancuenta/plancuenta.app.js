  Ext.ns('Contabilidad.PlanCuenta');
  Ext.QuickTips.init();
  Ext.onReady(function() {
      new Contabilidad.PlanCuenta.Viewport();
  });

  Contabilidad.PlanCuenta.Viewport = Ext.extend(Ext.Viewport, {
      constructor: function(params) {
          this.idioma = Contabilidad.PlanCuenta.idioma;
          this.perfil = window.parent.perfil;

          Ext.MessageBox.wait(this.idioma.lbCargando, this.idioma.lbEspere);
          this.cargarInterfaz();
          this.initEvents();
          this.initGlobalsKeys();
          Ext.MessageBox.hide();
          Contabilidad.PlanCuenta.Viewport.superclass.constructor.call(this, params);
      },
      cargarInterfaz: function() {
          this.layout = 'fit';
          this.menuBar = new Contabilidad.PlanCuenta.Toolbar({
              idioma: this.idioma,
              perfil: this.perfil,
              scope: this,
              border: false
          });
          this.treePlanCuenta = new Contabilidad.PlanCuenta.TreePlanCuenta({
              idioma: this.idioma,
              perfil: this.perfil,
              rootVisible: false,
              scope: this
          });
          this.form = new Contabilidad.PlanCuenta.EditForm({
              idioma: this.idioma,
              perfil: this.perfil,
              scope: this
          });
          this.items = [{
              xtype: 'panel',
              layout: 'border',
              border: false,
              tbar: this.menuBar,
              items: [this.treePlanCuenta, this.form]
          }];
      },
      initGlobalsKeys: function() {
          var me = this;

          this.map = new Ext.KeyMap(document, [
              {
                  key: "i",
                  alt: true,
                  fn: function() {
                      me.menuBar.btnAdicionar.fireEvent('click');
                  }
              }, {
                  key: "m",
                  alt: true,
                  fn: function() {
                      if(!me.menuBar.btnModificar.disabled)
                          me.menuBar.btnModificar.fireEvent('click');
                  }
              }, {
                  key: Ext.EventObject.DELETE,
                  alt: false,
                  fn: function() {
                      if(!me.menuBar.btnEliminar.disabled)
                          me.menuBar.btnEliminar.fireEvent('click');
                  }
              }, {
                  key: "h",
                  alt: true,
                  fn: function() {
                      me.menuBar.btnAyuda.fireEvent('click');
                  }
              }, {
                  key: "r",
                  alt: true,
                  fn: function() {
                      if(!me.menuBar.btnVistap.disabled)
                          me.menuBar.btnVistap.fireEvent('click');
                  }
              }, {
                  key: "b",
                  alt: true,
                  scope: this,
                  fn: function() {
                      var filter = Ext.getCmp('sField');
                      if(filter.getValue()) {
                          filter.onTrigger2Click();
                      } else {
                          filter.focus();
                      }
                  }
              }, {
                  key: "l",
                  alt: true,
                  scope: this,
                  fn: function() {
                      var filter = Ext.getCmp('sField');
                      if(filter.getValue()) {
                          filter.onTrigger1Click();
                      }
                  }
              }
          ]);
      },
      initEvents: function() {
          var me = this;
          me.treePlanCuenta.on({
              resize: function(cmp, adjWidth, adjHeight, rawWidth, rawHeight) {
                  me.treePlanCuenta.sField.setWidth(adjWidth - 4);
                  cmp.doLayout();
              },
              bodyresize: function(p, w, h) {
                  me.treePlanCuenta.columns[0].width = parseInt(w * 0.7);
                  me.treePlanCuenta.columns[1].width = parseInt(w * 0.27);
              },

              click: function(n, e) {
                  me.form.nodeSelect = n;
                  if(n.attributes.idplancuenta) {
                      me.form.setVarConfig(n);
                      me.form.setValuesComponent(n);
                      me.form.btnGuardar.setDisabled(true);
                      me.form.btnEliminar.setDisabled(!n.attributes.leaf);
                      me.menuBar.btnModificar.setDisabled(false);
                      me.menuBar.btnEliminar.setDisabled(true);
                      me.menuBar.btnVistap.setDisabled(true);
                      if(n.attributes.idformato) {
                          me.menuBar.btnModificar.setDisabled(false);
                      } else {
                          me.menuBar.btnModificar.setDisabled(true);
                      }
                  } else {
                      me.form.btnNuevo.setDisabled(false);
                      me.form.btnGuardar.setDisabled(true);
                      me.form.btnEliminar.setDisabled(true);
                      me.menuBar.btnEliminar.setDisabled(!n.leaf);
                      if(n.attributes.idformato) {
                          me.menuBar.btnModificar.setDisabled(false);
                      } else {
                          me.menuBar.btnModificar.setDisabled(true);
                      }
                      me.menuBar.btnVistap.setDisabled(false);
                      me.form.setVarConfig(0);
                      me.form.setValuesComponent(n);
                  }
                  me.form.btnNuevo.setDisabled(false);
                  me.treePlanCuenta.getLoader().baseParams = {
                      idpadre: 0
                  };
              },
              beforeload: function(n, e) {
                  if(!n.attributes.leaf) {
                      me.treePlanCuenta.getLoader().baseParams = {
                          filter: ''
                      };
                  }
                  if(n.attributes.idpadre) {
                          me.treePlanCuenta.getLoader().baseParams = {
                              idpadre: n.attributes.idpadre
                          };
                  }
              },
              load: function() {
                  me.menuBar.btnAdicionar.focus(true, 1000);
                  me.treePlanCuenta.getLoader().baseParams = {
                      idpadre: 0
                  };
              }
          });

          me.form.on({
              beforeAction: function(node) {
                  me.treePlanCuenta.beforeAction(node);
              }
          });

          me.menuBar.on({
              beforeShowWindow: function(add) {
                  var winPlanCuenta = new Contabilidad.PlanCuenta.WindowPlanCuenta({
                      id: 'winPlanCuenta',
                      defaultButton: 0,
                      idioma: me.idioma,
                      action: add,
                      scope: me,
                      listeners: {
                          close: function() {
                              me.map.enable();
                          },
                          show: function() {
                              if(add)
                                  this.tfNombre.focus(false, 100);
                          }
                      }
                  });
                  winPlanCuenta.fLoadMask();
                  winPlanCuenta.stFormato.load();
                  winPlanCuenta.on('beforeshow', function() {
                      this.btnAceptar.getEl().addKeyMap([
                          {
                              key: Ext.EventObject.TAB,
                              stopEvent: true,
                              fn: function() {
                                  this.tfNombre.focus(true, true);
                              }
                          }
                      ]);

                      this.tfNombre.getEl().addKeyMap({
                          key: Ext.EventObject.TAB,
                          shift: true,
                          stopEvent: true,
                          fn: function() {
                              this.btnAceptar.focus();
                          }
                      });
                  });

                  if(!add)
                      winPlanCuenta.cargarVentanaModificar(me.form.nodeSelect);
              },
              beforeKeyMap: function() {

                  me.map.disable();
              }
          });
      }
  });

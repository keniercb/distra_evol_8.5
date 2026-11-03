  Ext.ns('Contabilidad.Grupocontable');
  Ext.QuickTips.init();
  Ext.onReady(function() {
      new Contabilidad.Grupocontable.Viewport();
  });

  Contabilidad.Grupocontable.Viewport = Ext.extend(Ext.Viewport, {
      constructor: function(params) {
          this.idioma = Contabilidad.Grupocontable.idioma;
          this.perfil = window.parent.perfil;

          Ext.MessageBox.wait(this.idioma.lbCargando, this.idioma.lbEspere);
          this.cargarInterfaz();
          this.initEvents();
          this.initGlobalsKeys();
          Ext.MessageBox.hide();
          Contabilidad.Grupocontable.Viewport.superclass.constructor.call(this, params);
          //Ocultando primero todos los botones
          //Validando permisos de acceso a los recurdos en los botones
          validate.checkPermisos();
      },
      cargarInterfaz: function() {
          this.layout = 'fit';
          this.menuBar = new Contabilidad.Grupocontable.Toolbar({
              idioma: this.idioma,
              perfil: this.perfil,
              border: false
          });
          this.treeGrupocontable = new Contabilidad.Grupocontable.TreeGrupocontable({
              idioma: this.idioma,
              perfil: this.perfil,
              rootVisible: true
          });
          this.form = new Contabilidad.Grupocontable.EditForm({
              idioma: this.idioma,
              perfil: this.perfil
          });
          this.items = [{
                  xtype: 'panel',
                  layout: 'border',
                  border: false,
                  tbar: this.menuBar,
                  items: [this.treeGrupocontable, this.form]
              }];
      },
      initGlobalsKeys: function() {
          var me = this;

          this.map = new Ext.KeyMap(document, [
              {
                  key: "r",
                  alt: true,
                  fn: function() {
                      me.menuBar.btnVistap.fireEvent('click');
                  }
              }, {
                  key: "z",
                  ctrl: true,
                  alt: true,
                  fn: function() {
                      me.menuBar.btnActualizar.fireEvent('click');
                  }
              }, {
                  key: "h",
                  alt: true,
                  fn: function() {
                      me.menuBar.btnAyuda.fireEvent('click');
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

          me.menuBar.btnActualizar.on({
              click: function() {
                  me.form.clearForm();
                  me.treeGrupocontable.sField.fnOnClear();
              }
          });

          me.treeGrupocontable.on({
              resize: function(cmp, adjWidth, adjHeight, rawWidth, rawHeight) {
                  me.treeGrupocontable.sField.setWidth(adjWidth - 4);
                  cmp.doLayout();
              },
              beforeload: function(n) {
                  me.treeGrupocontable.body.mask(me.idioma.lbCargando, 'x-mask-loading');
              },
              load: function(n) {
                  me.treeGrupocontable.body.unmask();
                  me.menuBar.btnActualizar.focus(true, 1000);
              },
              bodyresize: function(p, w, h) {
                  me.treeGrupocontable.columns[0].width = parseInt(w * 0.7);
                  me.treeGrupocontable.columns[1].width = parseInt(w * 0.27);
              },
              click: function(n, e) {
                  me.form.enable();
                  me.form.nodeSelect = n;
                  me.form.btnNuevo.setDisabled(false);
                  me.form.tfCodigo.enable();
                  me.form.cbNaturaleza.enable();
                  me.form.tfDenominacion.enable();
                  if(n.attributes.id != 0) {
                      me.form.setValuesComponent(n);
                      me.form.setVarConfig(n);
                  } else {
                      me.form.setVarConfig(0);
                      me.form.btnNuevo.fireEvent('click');
                      me.form.btnEliminar.setDisabled(true);
                      me.form.getFormato(1);
                  }
              }
          });

          me.form.on({
              beforeAction: function(node) {
                  me.treeGrupocontable.beforeAction(node);
              }
          });
      }
  });

  Ext.ns('Contabilidad.Grupocontable');
  Contabilidad.Grupocontable.Toolbar = Ext.extend(Ext.Toolbar, {
      constructor: function(params) {
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.createButtons();
          this.initFunctions();
          return Contabilidad.Grupocontable.Toolbar.superclass.constructor.call(this, params);
      },
      fLoadMask: function(agMsg) {
          var me = this;
          this.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || me.idioma.lbCargando
          });
          me.lMask.show();
      },
      createButtons: function() {
          this.btnActualizar = new Ext.Button({
              tabIndex: 1,
              id: 'btnActualizar',
              text: this.idioma.lbBtnActualizar,
              tooltip: this.idioma.lbTooltipBtnActualizar,
              iconCls: 'actualizar'
          });
          this.btnVistap = new Ext.Button({
              tabIndex: 8,
              id: 'btnVistap',
              text: this.idioma.lbBtnVistap,
              tooltip: this.idioma.lbTooltipBtnVistap,
              iconCls: 'vistareporte',
              abreviatura: 'vReporte_grupocont'
          });
          validate.addButton(this.btnVistap);
          this.btnAyuda = new Ext.Button({
              id: 'btnHelpGrupoCont',
              tabIndex: 10,
              text: this.idioma.lbBtnAyuda,
              tooltip: this.idioma.lbTooltipBtnAyuda,
              iconCls: 'ayuda'
          });
          this.items = [this.btnActualizar, this.btnVistap, '->', this.btnAyuda];
      },
      initFunctions: function() {
          var me = this;
          this.btnVistap.on('click', function() {
              me.getDataPrinter();
          });

          this.getDataPrinter = function() {
              me.fLoadMask();
              Ext.Ajax.request({
                  method: "POST",
                  url: 'getDataReport',
                  callback: function(options, success, response) {
                      var responseData = Ext.decode(response.responseText);
                      if(responseData.datoCuerpo.length > 0) {
                          me.openConfigReport(responseData);
                      } else {
                          mostrarMensaje(1, me.idioma.lbNoDataRptShow);
                      }
                      me.lMask.hide();
                  }
              });
          };
          this.openConfigReport = function(requestDataSources) {
              var printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  paperSize: "FOLIO",
                  orientation: "Horizontal",
                  reportType: "HTML"
              });
              printView.show();
          };
      }
  });

  Contabilidad.Grupocontable.EditForm = Ext.extend(Ext.Panel, {
      constructor: function(params) {
          this.frame = true;
          this.layout = 'form';
          this.labelAlign = 'top';
          this.buttonAlign = 'right';
          this.width = Ext.lib.Dom.getViewWidth() / 2;
          this.region = 'east';
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.idGrupo = 0;
          this.idPadreGrupo = 0;
          this.nivel = 0;
          this.longitud = 0;
          this.idparte = 0;
          this.dataFormato = new Array();
          this.nodeSelect = 0;
//          this.disabled = true;
          this.createForm(params);
          this.initButtons();
          this.initFunctions();
          this.addEvents('beforeAction');
          this.loadFormatos();
          return Contabilidad.Grupocontable.EditForm.superclass.constructor.call(this, params);
      },
      createForm: function() {
          var me = this;
          this.tfCodigo = new Ext.form.TextField({
              tabIndex: 2,
              fieldLabel: this.idioma.lbCodigo,
              anchor: '100%',
              allowBlank: false,
              maskRe: /^[0-9]*$/,
              regex: /^[0-9]*$/,
              enableKeyEvents: true,
              disabled: true
          });
          this.tfDenominacion = new Ext.form.TextArea({
              tabIndex: 4,
              fieldLabel: this.idioma.lbDenominacion,
              anchor: '100%',
              maxLength: 50,
              maxLengthText: this.idioma.textMaxLength,
              allowBlank: false,
              maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\-\+\/\(\)]*$/,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\-\+\/\(\)]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\-\+\/\(\)]*)+$/,
              enableKeyEvents: true,
              disabled: true
          });
          this.stNaturaleza = new Ext.data.Store({
              url: 'loadNaturaleza',
              reader: new Ext.data.JsonReader({
              }, [{
                      name: 'idnaturaleza'
                  }, {
                      name: 'descripcion'
                  }
              ])
          });
          this.cbNaturaleza = new Ext.form.ComboBox({
              tabIndex: 3,
              fieldLabel: this.idioma.lbNaturaleza,
              emptyText: this.idioma.lbSeleccione,
              loadingText: this.idioma.lbCargando,
              store: this.stNaturaleza,
              valueField: 'idnaturaleza',
              displayField: 'descripcion',
              disabledClass: 'disabled-component',
              anchor: '100%',
              resizable: true,
              typeAhead: true,
              editable: true,
              triggerAction: 'all',
              mode: 'local',
              allowBlank: false,
              forceSelection: true,
              enableKeyEvents: true,
              disabled: true
          });
          this.tfFormato = new Ext.form.TextField({
              fieldLabel: this.idioma.lbFormato,
              anchor: '100%',
              readOnly: true
          });
          this.tfNivelFormato = new Ext.form.TextField({
              fieldLabel: this.idioma.lbNivelFormato,
              anchor: '100%',
              readOnly: true
          });
          this.tfVpFormato = new Ext.form.TextField({
              fieldLabel: this.idioma.lbVistaprevia,
              anchor: '100%',
              readOnly: true
          });
          this.tfVpNivelFormato = new Ext.form.TextField({
              fieldLabel: this.idioma.lbVistaprevia,
              anchor: '100%',
              readOnly: true
          });
          this.items = [{
                  layout: 'column',
                  anchor: '100%',
                  items: [{
                          columnWidth: .5,
                          layout: 'form',
                          labelAlign: 'top',
                          items: [this.tfCodigo]
                      }, {
                          columnWidth: .5,
                          style: 'margin:0 0 0 10',
                          layout: 'form',
                          labelAlign: 'top',
                          items: [this.cbNaturaleza]
                      }]
              }, {
                  layout: 'form',
                  anchor: '100%',
                  labelAlign: 'top',
                  items: this.tfDenominacion
              }, new Ext.form.FieldSet({
                  title: this.idioma.lbInfoFormato,
                  autoHeight: true,
                  items: [{
                          layout: 'column',
                          anchor: '100%',
                          items: [{
                                  columnWidth: .4,
                                  layout: 'form',
                                  labelAlign: 'top',
                                  items: this.tfFormato
                              }, {
                                  columnWidth: .6,
                                  layout: 'form',
                                  style: 'margin:0 0 0 10',
                                  labelAlign: 'top',
                                  items: this.tfVpFormato
                              }]
                      }, {
                          layout: 'column',
                          anchor: '100%',
                          items: [{
                                  columnWidth: .4,
                                  layout: 'form',
                                  labelAlign: 'top',
                                  items: this.tfNivelFormato
                              }, {
                                  columnWidth: .6,
                                  layout: 'form',
                                  style: 'margin:0 0 0 10',
                                  labelAlign: 'top',
                                  items: this.tfVpNivelFormato
                              }]
                      }]
              })];
          this.keys = this.kmAperturas = new Ext.KeyMap(Ext.getBody(), [{
                  alt: true,
                  key: 'n',
                  fn: function() {
                      if(!Ext.getCmp('btnNuevo').disabled)
                          Ext.getCmp('btnNuevo').fireEvent('click');
                  },
                  scope: me
              }, {
                  alt: true,
                  key: 'g',
                  fn: function() {
                      if(!Ext.getCmp('btnGuardar').disabled)
                          Ext.getCmp('btnGuardar').fireEvent('click');
                  },
                  scope: me
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function() {
                      if(!Ext.getCmp('btnEliminar').disabled)
                          Ext.getCmp('btnEliminar').fireEvent('click');
                  },
                  scope: me
              }]);
      },
      initButtons: function() {
          this.btnNuevo = new Ext.Button({
              tabIndex: 5,
              id: 'btnNuevo',
              iconCls: 'nuevo',
              disabled: true,
              text: this.idioma.lbBtnNuevo,
              tooltip: this.idioma.lbTooltipNuevo,
              abreviatura: 'add_grupocont'
          });
          this.btnGuardar = new Ext.Button({
              tabIndex: 6,
              id: 'btnGuardar',
              iconCls: 'guardar',
              disabled: true,
              text: this.idioma.lbBtnGuardar,
              tooltip: this.idioma.lbTooltipGuardar,
              abreviatura: 'add_grupocont'
          });
          this.btnEliminar = new Ext.Button({
              tabIndex: 7,
              id: 'btnEliminar',
              iconCls: 'eliminar',
              disabled: true,
              text: this.idioma.lbBtnEliminar,
              tooltip: this.idioma.lbTooltipEliminar,
              abreviatura: 'del_grupocont'
          });
          this.buttons = [this.btnNuevo, this.btnGuardar, this.btnEliminar];
          validate.addButton(this.btnNuevo);
          validate.addButton(this.btnGuardar);
          validate.addButton(this.btnEliminar);
      },
      initFunctions: function() {
          var me = this;
          me.stNaturaleza.load();
          this.loadFormatos = function() {
              Ext.Ajax.request({
                  url: 'loadFormatos',
                  callback: function(options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      me.dataFormato = responseData[0];
                  }
              });
          };
          this.activeButtons = function(leaf) {
              me.btnEliminar.setDisabled((leaf) ? false : true);
              if(me.nodeSelect.attributes.id != '0') {
                  me.btnGuardar.setDisabled(true);
              }
          };
          this.setValuesComponent = function(n) {
              me.tfCodigo.setValue(n.attributes.codigo);
              me.tfDenominacion.setValue(n.attributes.descripcion);
              me.cbNaturaleza.setValue(n.attributes.idnaturaleza);
              me.cbNaturaleza.setRawValue(n.attributes.naturaleza);
              me.tfFormato.setValue(n.attributes.formato.descripcion);
              me.tfVpFormato.setValue(n.attributes.formato.vistap);
              var level = this.getNivelFormato(n.attributes.nivel, n.attributes.formato.partes);
              me.tfNivelFormato.setValue(level[0]);
              me.tfVpNivelFormato.setValue(level[1]);
              this.activeButtons(n.attributes.leaf);
          };
          this.getNivelFormato = function(l, niveles) {
              var me = this;
              var length = niveles.length;
              var arrLevel = new Array();
              for(var i in niveles) {
                  if(i < length) {
                      if(parseInt(niveles[i].nivel) == l) {
                          me.longitud = parseInt(niveles[i].longitud);
                          me.idparte = niveles[i].idparteformato;
                          arrLevel.push(niveles[i].nombre);
                          arrLevel.push(niveles[i].vistap);
                          arrLevel.push(niveles[i].idparteformato);
                          break;
                      }
                  }
              }
              return arrLevel;
          };
          this.getFormato = function(l) {
              me.tfFormato.setValue(me.dataFormato.descripcion);
              me.tfVpFormato.setValue(me.dataFormato.vistap);
              var level = this.getNivelFormato(l, me.dataFormato.partes);
              if(level.length > 0) {
                  me.tfNivelFormato.setValue(level[0]);
                  me.tfVpNivelFormato.setValue(level[1]);
                  me.idparte = level[2];
//                if (parseInt(l) > 1)
//                    me.cbNaturaleza.setDisabled(true);
              } else {
                  mostrarMensaje(1, 'El formato configurado no admite nuevos niveles de grupos.');
                  me.btnGuardar.setDisabled(true);
              }
          };
          this.setVarConfig = function(n) {
              me.idGrupo = (n) ? n.attributes.idgrupo : n;
              me.idPadreGrupo = (n) ? n.attributes.idgrupopadre : n;
              me.nivel = (n) ? n.attributes.nivel : n;
              me.idparte = (n) ? n.attributes.idparteformato : n;

              if(n) {
                  me.cbNaturaleza.setValue(n.attributes.idnaturaleza);
                  me.cbNaturaleza.setDisabled((n.attributes.leaf == true) ? false : true);
              } else {
                  me.cbNaturaleza.reset();
                  me.cbNaturaleza.setDisabled(false);
              }
              me.tfCodigo.focus();
          };
          this.btnNuevo.on('click', function(button, e) {
              me.tfCodigo.focus(false, 100);
              me.tfCodigo.reset();
              me.tfDenominacion.reset();
              me.tfFormato.reset();
              me.tfVpFormato.reset();
              me.tfNivelFormato.reset();
              me.tfVpNivelFormato.reset();
              me.idPadreGrupo = me.idGrupo;
              me.idGrupo = 0;
//            me.btnGuardar.setDisabled(false);
              me.cbNaturaleza.setDisabled(false);
              me.getFormato(parseInt(me.nivel) + 1);
          });
          ComprobarCampos = function() {
              if(me.tfCodigo.isValid() && me.tfDenominacion.isValid() && me.cbNaturaleza.isValid()) {
                  me.btnGuardar.setDisabled(false);
              } else {
                  me.btnGuardar.setDisabled(true);
              }
          };
          me.tfCodigo.on('keyup', function() {
              ComprobarCampos();
          });
          me.tfDenominacion.on({
              'keyup': function() {
                  ComprobarCampos();
              },
              'invalid': function(cmp, msg) {
                  // if(cmp.getValue() != '') {
                  // // if(cmp.getValue().length > 0) {
                  //     var vtext = cmp.getValue().trim();
                  //     cmp.setValue(vtext);
                  // }
              },
              'blur': function(cmp) {
                  // if(cmp.getValue() != '') {
                  // // if(cmp.getValue().length > 0) {
                  //     var vtext = cmp.getValue().trim();
                  //     cmp.setValue(vtext);
                  // }
              }
          });
          me.cbNaturaleza.on('select', function() {
              ComprobarCampos();
          });
          this.btnGuardar.on('click', function() {
              if((me.validateCodigo(me.tfCodigo) && me.tfCodigo.isValid()) && me.tfDenominacion.isValid() && me.cbNaturaleza.isValid()) {
                  var cod = '';
                  if(me.nodeSelect.attributes.id != '0') {
                      if(me.nodeSelect.parentNode.attributes.id == '0' && me.idGrupo == 0) {
                          cod = me.nodeSelect.attributes.concatgrupo;
                      } else if(me.idGrupo == 0) {
                          cod = me.nodeSelect.attributes.concatgrupo;
                      } else if(me.nodeSelect.parentNode.attributes.id != '0') {
                          cod = me.nodeSelect.parentNode.attributes.concatgrupo;
                      }
                  }

                  var params = {
                      idgrupo: (me.idGrupo) ? me.idGrupo : null,
                      idgrupopadre: me.idPadreGrupo,
                      codigo: me.tfCodigo.getValue(),
                      descripcion: me.tfDenominacion.getValue(),
                      concatgrupo: (cod != '') ? (cod + '.' + me.tfCodigo.getValue()) : me.tfCodigo.getValue(),
                      nivel: (me.idGrupo) ? parseFloat(me.nivel) : parseFloat(me.nivel) + 1,
                      idparteformato: me.idparte,
                      idnaturaleza: me.cbNaturaleza.getValue()
                  };

                  Ext.MessageBox.wait(me.idioma.lbWaitMsgGrupo, me.idioma.lbEspere);
                  Ext.Ajax.request({
                      url: 'updateGrupo',
                      params: params,
                      callback: function(options, success, response) {
                          Ext.MessageBox.hide();
                          responseData = Ext.decode(response.responseText);
                          var msg = (responseData.msg === 1) ? me.idioma.lbMsgGuardado : ((responseData.msg === 2) ? me.idioma.lbMsgExiste : me.idioma.lbMsgErrorGuardar);
                          mostrarMensaje(responseData.codM, msg);
                          if(responseData.success == true) {
                              me.fireEvent('beforeAction', me.nodeSelect);
                              me.btnGuardar.setDisabled(true);
                          }
                      }
                  });
              } else {
                  mostrarMensaje(1, me.idioma.lbInvalidForm);
              }
          });
          this.btnEliminar.on('click', function() {
              mostrarMensaje(2, String.fromCharCode(191) + me.idioma.lbMsgEliminar, function (btnPress) {
                  if (btnPress === 'ok') {
                      me.deleteGrupo();
                  }
              });
              /*Ext.Msg.confirm(me.idioma.lbConfirmar, String.fromCharCode(191) + me.idioma.lbMsgEliminar, function(btnPress) {
                  if(btnPress === 'yes') {
                      me.deleteGrupo();
                  }
              });*/
          });
          this.deleteGrupo = function() {
              Ext.MessageBox.wait(me.idioma.lbWaitMsgDeleteGrupo, me.idioma.lbEspere);
              Ext.Ajax.request({
                  url: 'deleteGrupo',
                  params: {idgrupo: me.idGrupo},
                  callback: function(options, success, response) {
                      Ext.MessageBox.hide();
                      responseData = Ext.decode(response.responseText);
                      var msg = (responseData.msg === 1) ? me.idioma.lbMsgEliminado : ((responseData.msg === 2) ? me.idioma.lbMsgEnUso : me.idioma.lbMsgErrorEliminar);
                      mostrarMensaje(responseData.codM, msg);
                      if(responseData.success == true) {
                          me.fireEvent('beforeAction', me.nodeSelect);
                      }
                  }
              });
          };
          this.validateCodigo = function(tf) {
              var me = this;
              var length = me.tfCodigo.getValue().toString().length;
              if(length > 0) {
                  if(length > me.longitud || length < me.longitud) {
                      me.tfCodigo.markInvalid("El tama&ntilde;o requerido es " + me.longitud + " d\xEDgitos.");
                      return false;
                  } else {
                      tf.clearInvalid();
                      return true;
                  }
              }
              else {
                  tf.clearInvalid();
                  return true;
              }
          };
          me.tfCodigo.on({
              blur: function(tf) {
                  var v = me.validateCodigo(tf);
              },
              focus: function(tf) {
                  var v = me.validateCodigo(tf);
              },
              keypress: function(tf) {
                  var v = me.validateCodigo(tf);
              }
          });

          this.validateDenominacion = function(tf) {
              var me = this;
              var length = me.tfDenominacion.getValue().toString().length;
              if(length > 0) {
                  if(length > 50) {
                      me.tfDenominacion.markInvalid("El tama&ntilde;o m&aacute;ximo requerido es " + 50 + " caracteres.");
                      return false;
                  } else {
                      tf.clearInvalid();
                      return true;
                  }
              }
              else {
                  tf.clearInvalid();
                  return true;
              }
          };
          me.tfDenominacion.on({
              blur: function(tf) {
                  var v = me.validateDenominacion(tf);
              },
              focus: function(tf) {
                  var v = me.validateDenominacion(tf);
              },
              keypress: function(tf) {
                  var v = me.validateDenominacion(tf);
              }
          });

          this.clearForm = function() {
              me.tfCodigo.reset();
              me.tfCodigo.disable();
              me.cbNaturaleza.reset();
              me.cbNaturaleza.disable();
              me.tfDenominacion.reset();
              me.tfDenominacion.disable();
          };
      }
  });

  Contabilidad.Grupocontable.TreeGrupocontable = Ext.extend(Ext.tree.TreeGrid, {
      constructor: function(params) {
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.rootVisible = true;
          this.region = 'center';
          this.border = false;
          this.isSearch = false;
          this.lMask;
          this.useArrows = false;
          this.lines = true;
          this.enableSort = false;
          this.cls = 'hidden-icon';
          this.createItems();
          this.initFunctions();
          this.initializeEvents();
          Contabilidad.Grupocontable.TreeGrupocontable.superclass.constructor.call(this);
      },
      fLoadMask: function(agMsg) {
          var me = this;
          this.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || me.idioma.lbCargando
          });
          me.lMask.show();
      },
      createItems: function() {
          this.dataUrl = 'loadGrupocontable';
          var me = this;
          this.sField = new Ext.Cont.SearchField({
              id: 'sField',
              tabIndex: 9,
              maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda ]*$/,
              fnOnSearch: function() {
                  me.searchGrupocontable(me.sField.getRawValue());
              },
              fnOnClear: function() {
                  this.reset();
                  me.searchGrupocontable('');
              }
          });
          this.tbar = [this.sField];
          this.columns = [
              {
                  header: "Grupo contable",
                  dataIndex: 'text',
                  width: 20,
                  sortable: true
              }, {
                  header: "Naturaleza",
                  dataIndex: 'naturaleza',
                  width: 20,
                  sortable: true
              }
          ];
          this.root = new Ext.tree.AsyncTreeNode({
              id: '0',
              text: me.idioma.lbRootGrupo,
              expanded: true,
              uiProvider: Ext.ux.tree.TreeGridNodeUI
          });
      },
      initFunctions: function() {
          var me = this;
          this.searchGrupocontable = function(filter) {
              me.fLoadMask();
              me.getLoader().baseParams = {
                  filter: filter
              };
              me.getLoader().load(me.root, function() {
                  if(me.root.childNodes.length == 0)
                      mostrarMensaje(1, me.idioma.lbNoDataSearch);
                  me.root.expand();
                  me.lMask.hide();
              });
          };
      },
      initializeEvents: function() {
          var me = this;
          this.beforeAction = function(node) {
              me.fLoadMask();
              var idparent = (node.attributes.idgrupopadre != null) ? node.attributes.idgrupopadre : 0;
              var parent = (idparent == node.attributes.idgrupo) ? 0 : idparent;
              var parentNode = me.getNodeById(parent);
              me.getLoader().load(parentNode, function() {
                  parentNode.expand();
                  me.lMask.hide();
              });
              me.selModel.select(parentNode);
              me.fireEvent('click', parentNode);
          };
      }
  });

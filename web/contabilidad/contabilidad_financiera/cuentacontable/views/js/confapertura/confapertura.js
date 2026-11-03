
  Ext.QuickTips.init();
  Ext.namespace('Ext.Confin.CuentaContable');
  Ext.Confin.CuentaContable.NomApertura = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: window.parent.UCID.portal.perfil.etiquetas,
      initApp: false,
      /** @constructor */
      constructor: function() {
          Ext.Ajax.timeout = 6000000;
          scopeNomApertura = this;
          Ext.Ajax.request({
              method: "POST",
              url: "cargaretiquetas",
              params: {
                  vista: 'confapertura'
              },
              callback: function(options, success, response) {
                  scopeNomApertura.etiquetas = Ext.decode(response.responseText);
                  scopeNomApertura.onloadMessageBox(scopeNomApertura.etiquetas.lbEsperando, scopeNomApertura.etiquetas.lbCargando);
                  scopeNomApertura.cargarInterfaz(scopeNomApertura.perfil, scopeNomApertura.etiquetas);
              }
          });
      },
      /**
       * Esta funcion muestra una ventana de progreso.
       * @param {string} agTtl T&iacute;tulo de la ventana.
       * @param {string} agMsg Mensaje a mostrar.
       */
      onloadMessageBox: function(agTtl, agMsg) {
          Ext.MessageBox.show({
              title: agTtl || scopeNomApertura.etiquetas.lbEsperando,
              msg: agMsg || scopeNomApertura.etiquetas.lbCargando,
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
          for(var i = 1; i < 12; i++) {
              setTimeout(f(i), i * 500);
          }
      },
      /**
       * Representa la interfaz principal.
       * @param {object} perfil Perfil del sistema para el usuario logueado.
       * @param {object} etiquetas Etiquetas a usar segun el idioma del perfil.
       */
      cargarInterfaz: function(perfil, etiquetas) {
          var me = this;
          var actualiza = false, stident, stidentificadorpadre, stconceptos, stcodigo, stdescripcion, stnomenclador, btnBuscar, btnLimpiar, btnAdicionar, btnModificar, btnEliminar, btnAyuda, btnAplicarA, btnAceptarA, btnCancelarA, btnAceptarM, btnCancelarM, hversion, txtBuscar, txtdenominacionA, cbxidentificadorpadreM, cbxidentificadorpadreA, cbxconceptoA, cbxidentificadorA, cbxcodigoA, cbxdescripcionA, txtdenominacionM, cbxconceptoM, cbxcodigoM, cbxdescripcionM, gpnomencladores, fpnomaperturaadicionar, fpnomaperturamodificar, panelContenedor, vpContenido, winInsNom, winModNom, sml, lMask, estaComboCreado = false, winFpReg = '';
          var cantSpaceM = 0, valueM = '', cantSpaceA = 0, valueA = '', cant_e = 0, cont = 0, value;
          lMask = new Ext.LoadMask(Ext.getBody(), {msg: etiquetas.lbCargando});
          stidentificadorpadre = new Ext.data.Store({
              url: 'cargardescripciones',
              reader: new Ext.data.JsonReader({
                  root: "descripcion"
              },
              [{name: 'descripcion', mapping: 'field'}]
                      )});
          stconceptos = new Ext.data.Store({
              url: 'cargarconceptos',
              reader: new Ext.data.JsonReader({
                  root: "conceptos"
              }, [{name: 'concepto', mapping: 'tabla'}, {name: 'tree'}, {name: 'esquema'}])});
          stident = new Ext.data.Store({
              url: 'cargarcodigos',
              reader: new Ext.data.JsonReader({
                  root: "codigos"
              }, [{name: 'codigo', mapping: 'field'}]
                      )});
          stcodigo = new Ext.data.Store({
              url: 'cargardescripciones',
              reader: new Ext.data.JsonReader({
                  root: "descripcion"
              },
              [{name: 'descripcion', mapping: 'field'}]
                      )});
          stdescripcion = new Ext.data.Store({
              url: 'cargardescripciones',
              reader: new Ext.data.JsonReader({
                  root: "descripcion"
              }, [{name: 'descripcion', mapping: 'field'}])});
          stnomenclador = new Ext.data.Store({
              url: 'cargarnomapertura',
              baseParams: {
                  start: 0,
                  limit: 20
              },
              reader: new Ext.data.JsonReader({
                  totalProperty: 'cantidad_filas',
                  root: 'nomenclador',
                  id: 'idnom'
              }, [{name: 'idconfapertura'}, {name: 'denominacionM', mapping: 'denominacion'}, {name: 'conceptoM', mapping: 'concepto'}, {name: 'codigoM', mapping: 'codigo'}, {name: 'descripcionM', mapping: 'descripcion'}, {name: 'identM', mapping: 'identificador'}, {name: 'version'}, {name: 'idestructurae'}, {name: 'identificadorpadre'}, {name: 'nomesquema'}]),
              listeners: {
                  load: function(xStore, xRecord, xOptions) {
                      Ext.getCmp('btnAdicionar').focus();
                      Ext.getCmp('btnModificar').disable();
                      Ext.getCmp('btnEliminar').disable();
                      xOptions.callback = function() {
                          if(Ext.MessageBox.getDialog() && me.initApp == false) {
                              Ext.Msg.hide();
                              me.initApp == true;
                          }
                          var numData = xStore.getCount();
                          if(numData == 0) {
                              if(actualiza == true) {
                                  mostrarMensaje(1, etiquetas.lbNoDataResults);
                              } else {
                                  mostrarMensaje(1, etiquetas.lbNoResults);
                              }
                          } else {
                              sml.selectFirstRow();
                          }
                      };

                  }
              }
          });
          btnAdicionar = new Ext.Button({
              tabIndex: 1,
              disabled: false,
              id: 'btnAdicionar',
              iconCls: 'adicionar',
              text: etiquetas.lbBtnAdicionar,
              tooltip: etiquetas.textToolTipAdicionar,
              handler: function() {
                  cbxidentificadorpadreA.disable();
                  winForm(0);
              }
          });
          btnModificar = new Ext.Button({
              tabIndex: 2,
              id: 'btnModificar',
              disabled: true,
              iconCls: 'modificar',
              text: etiquetas.lbBtnModificar,
              tooltip: etiquetas.textToolTipModificar,
              handler: function() {
                  VerificarModificar();
              }
          });
          btnEliminar = new Ext.Button({
              tabIndex: 3,
              id: 'btnEliminar',
              disabled: true,
              iconCls: 'eliminar',
              text: etiquetas.lbBtnEliminar,
              tooltip: etiquetas.textToolTipEliminar,
              handler: function() {
                  EliminarNomenclador();
              }
          });
          btnAyuda = new Ext.Button({
              tabIndex: 4,
              id: 'btnHelpConfApertura',
              iconCls: 'ayuda',
              tooltip: etiquetas.lbTtbtnAyuda,
              text: 'Ayuda'
          });
          btnAceptarA = new Ext.Button({
              tabIndex: 18,
              disabled: true,
              id: 'btnAceptarA',
              iconCls: 'aceptar',
              text: etiquetas.lbAceptar,
              tooltip: etiquetas.textToolTipAceptarA,
              handler: function() {
                  RegistrarNomenclador();
              }
          });
          btnAplicarA = new Ext.Button({
              tabIndex: 17,
              disabled: true,
              id: 'btnAplicarA',
              iconCls: 'aplicar',
              text: etiquetas.lbAplicar,
              tooltip: etiquetas.textToolTipAplicarA,
              handler: function() {
                  RegistrarNomenclador('apl');
              }
          });
          btnCancelarA = new Ext.Button({
              tabIndex: 16,
              disabled: false,
              id: 'btnCancelarA',
              iconCls: 'cancelar',
              text: etiquetas.lbCancelar,
              tooltip: etiquetas.textToolTipCancelarA,
              handler: function() {
                  winInsNom.hide();
                  fpnomaperturaadicionar.getForm().reset();
                  stconceptos.removeAll();
                  stdescripcion.removeAll();
              }
          });
          btnAceptarM = new Ext.Button({
              tabIndex: 27,
              id: 'btnAceptarM',
              iconCls: 'aceptar',
              disabled: true,
              text: etiquetas.lbAceptar,
              tooltip: etiquetas.textToolTipAceptarA,
              handler: function() {
                  ModificarNomenclador();
              }
          });
          btnCancelarM = new Ext.Button({
              tabIndex: 26,
              disabled: false,
              id: 'btnCancelarM',
              iconCls: 'cancelar',
              text: etiquetas.lbCancelar,
              tooltip: etiquetas.textToolTipCancelarA,
              handler: function() {
                  winModNom.hide();
                  fpnomaperturamodificar.getForm().reset();
              }
          });
          txtdenominacionA = new Ext.form.TextField({
              tabIndex: 10,
              id: 'denominacionA',
              name: 'denominacionA',
              width: 280,
              disabled: false,
              enableKeyEvents: true,
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-\+\*\/\%\#\&]+?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\,\-\+\*\/\%\#\&]*)+$/,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\,\-\+\*\/\%\#\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\,\-\+\*\/\%\#\&]*)+$/,
              regexText: etiquetas.lbRegexText,
              maxLength: 50,
              maxLengthText: String.format(etiquetas.lbMaxLengthText, 50),
              allowBlank: false,
              blankText: etiquetas.lbCampoObligatorio,
              fieldLabel: etiquetas.lbDenominacion
          });
          cbxconceptoA = new Ext.form.ComboBox({
              tabIndex: 11,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbConcepto,
              store: stconceptos,
              valueField: 'concepto',
              displayField: 'concepto',
              hiddenName: 'concepto',
              width: 280,
              id: 'conceptoA',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          cbxidentificadorA = new Ext.form.ComboBox({
              tabIndex: 12,
              emptyText: etiquetas.lbSeleccione,
              editable: true,
              typeAhead: true,
              selectOnFocus: true,
              forceSelection: true,
              allowBlank: false,
              fieldLabel: etiquetas.lbIdentificador,
              store: stident,
              valueField: 'codigo',
              displayField: 'codigo',
              hiddenName: 'identificador',
              width: 280,
              id: 'identA',
              mode: 'local',
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          cbxcodigoA = new Ext.form.ComboBox({
              tabIndex: 14,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbCode,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'codigo',
              width: 280,
              id: 'codigoA',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          cbxdescripcionA = new Ext.form.ComboBox({
              tabIndex: 15,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbDescripcion,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'descripcion',
              width: 280,
              id: 'descripcionA',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          hversion = new Ext.form.Hidden({
              id: 'idversion',
              name: 'version'
          });
          cbxidentificadorpadreA = new Ext.form.ComboBox({
              tabIndex: 13,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              disabled: true,
              fieldLabel: etiquetas.lbIdentificadorPadre,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'identificadorpadreA',
              width: 280,
              id: 'cbxidentificadorpadreA',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          cbxidentificadorpadreM = new Ext.form.ComboBox({
              tabIndex: 23,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              disabled: true,
              fieldLabel: etiquetas.lbIdentificadorPadre,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'identificadorpadre',
              width: 280,
              id: 'cbxidentificadorpadreM',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          var txtdenominacionM = new Ext.form.TextField({
              tabIndex: 20,
              id: 'denominacionM',
              name: 'denominacionM',
              width: 280,
              disabled: false,
              allowBlank: false,
              enableKeyEvents: true,
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \.\,\-\+\*\/\(\)\%\#\&\"]+ ?[a-zA-Z]*)+$/,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \.\,\-\+\*\/\(\)\%\#\&\"]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s \.\,\-\+\*\/\(\)\%\#\&\"]*)+$/,
              regexText: etiquetas.lbRegexText,
              maxLength: 50,
              maxLengthText: String.format(etiquetas.lbMaxLengthText, 50),
              blankText: etiquetas.lbCampoObligatorio,
              fieldLabel: etiquetas.lbDenominacion
          });
          var cbxconceptoM = new Ext.form.ComboBox({
              tabIndex: 21,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbConcepto,
              store: stconceptos,
              valueField: 'concepto',
              displayField: 'concepto',
              hiddenName: 'concepto',
              name: 'conceptoM',
              id: 'conceptoM',
              width: 280,
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function(cb, rc, id) {
                      cbxcodigoM.reset();
                      cbxdescripcionM.reset();
                      cbxidentificadorM.reset();
                      cbxidentificadorpadreM.reset();
                      stdescripcion.removeAll();
                      stident.removeAll();
                      loadDatosFiltrar(cbxconceptoM.getValue());
                      verificarCampos();
                  }
              }
          });
          var cbxidentificadorM = new Ext.form.ComboBox({
              tabIndex: 22,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              disabled: true,
              fieldLabel: etiquetas.lbIdentificador,
              store: stident,
              valueField: 'codigo',
              displayField: 'codigo',
              hiddenName: 'identificador',
              id: 'identM',
              width: 280,
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      if(!cbxidentificadorpadreM.disabled) {
                          cbxidentificadorpadreM.enable();
                          cbxidentificadorpadreM.focus(true, 100);
                          cbxidentificadorpadreM.expand();
                      } else {
                          cbxcodigoM.enable();
                          cbxcodigoM.focus(true, 100);
                          cbxcodigoM.expand();
                      }
                      verificarCampos();
                  }
              }
          });
          cbxcodigoM = new Ext.form.ComboBox({
              tabIndex: 24,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbCode,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'codigo',
              name: 'codigoM',
              id: 'codigoM',
              width: 280,
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      cbxdescripcionM.enable();
                      cbxdescripcionM.focus(true, 100);
                      cbxdescripcionM.expand();
                      verificarCampos();
                  }
              }
          });
          cbxdescripcionM = new Ext.form.ComboBox({
              tabIndex: 25,
              emptyText: etiquetas.lbSeleccione,
              editable: false,
              fieldLabel: etiquetas.lbDescripcion,
              store: stdescripcion,
              valueField: 'descripcion',
              displayField: 'descripcion',
              hiddenName: 'descripcion',
              name: 'descripcionM',
              id: 'descripcionM',
              width: 280,
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              listeners: {
                  'select': function() {
                      verificarCampos();
                  }
              }
          });
          var sfBuscar = new Ext.Cont.SearchField({
              tabIndex: 5, hasSearch: false, enableKeyEvents: true, id: 'sfBuscar', width: 250, anchor: '100%', lbTtlElement: 'nomenclador(es) para apertura',
              maskRe: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-\+\*\/\(\)\%\#\&\"]+?[a-zA-Z]*)+$/,
              regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\,\-\+\*\/\(\)\%\#\&\"]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\.\,\-\+\*\/\(\)\%\#\&\"]*)+$/,
              regexText: etiquetas.lbRegexText,
              invalidText: etiquetas.lbRegexText,
              fnOnSearch: function() {
                  this.hasSearch = true;
                  Buscar('busc');
              },
              fnOnClear: function() {
                  this.hasSearch = false;
                  Buscar();
              },
              listeners: {
                  'invalid': function(cmp, msg) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  },
                  'blur': function(cmp) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }

              }
          });
          btnBuscar = new Ext.Button({
              disabled: true,
              id: 'btnBuscar',
              iconCls: 'buscar',
              text: etiquetas.lbBtnBuscar,
              tooltip: etiquetas.textToolTipBuscar,
              handler: function() {
                  Buscar('busc');
              }
          });
          btnLimpiar = new Ext.Button({
              disabled: true,
              id: 'btnLimpiar',
              iconCls: 'limpiar',
              text: etiquetas.lbBtnLimpiar,
              tooltip: etiquetas.textToolTipLimpiar,
              hidden: true,
              handler: function() {
                  Buscar();
              }
          });
          txtBuscar = new Ext.form.TextField({
              name: 'search',
              id: 'search',
              width: 160,
              emptyText: etiquetas.lbCriterioBuscar,
              regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
              maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
              regexText: etiquetas.lbRegexText,
              invalidText: etiquetas.lbRegexText,
              enableKeyEvents: true
          });
          txtBuscar.on({
              keyup: function(t, e) {
                  if(t.getValue().length == 0 && actualiza) {
                      btnBuscar.disable();
                      btnLimpiar.disable();
                      stnomenclador.load({
                          callback: Ext.emptyFn()});
                      actualiza = false;
                  }
                  else if(t.getValue().length == 0 && !actualiza) {
                      btnBuscar.disable();
                      btnLimpiar.disable();
                  }
                  else if(t.getValue().length > 0) {
                      btnBuscar.enable();
                      btnLimpiar.enable();
                      if(e.getKey() == 13) {
                          Buscar('busc');
                      }
                  }
                  else if(t.getValue().length == 0) {
                      btnBuscar.disable();
                      btnLimpiar.disable();
                  }
              }
          });
          txtBuscar.on('keyup', function(t, e) {
              if(e.getKey() == 32 && cont == 0) {
                  txtBuscar.reset();
              }
              else if(e.getKey() != 32) {
                  cont = t.getValue().length;
                  value = t.getValue();
              }
              else if(e.getKey() == 32 && cont != 0 && cant_e == 0) {
                  cant_e++;
              }
              else if(e.getKey() == 32 && cont != 0 && cant_e == 1) {
                  cant_e = 0;
                  t.setValue(value + ' ');
              }
          }, this);
          txtBuscar.on('blur', function(t) {
          }, this);
          function Buscar(busc) {
              if(busc) {
                  stnomenclador.reload({params: {descripcion: sfBuscar.getValue(), opcion: 1}, callback: function() {
                          if(stnomenclador.getCount() == 0)
                              mostrarMensaje(1, etiquetas.lbNoDataResults);
                      }});
                  btnLimpiar.show();
                  actualiza = true;
              } else {
                  loadstnomencladores(0);
                  txtBuscar.reset();
                  btnBuscar.disable();
                  btnLimpiar.hide();
                  actualiza = false;
              }
          }
          sml = new Ext.grid.RowSelectionModel({
              singleSelect: true,
              listeners: {
                  rowselect: function(smodel, rowIndex, record) {
                      Ext.getCmp('gpNomencladorApertura').getView().addRowClass(rowIndex, "negrita");
                      Ext.getCmp('btnModificar').enable();
                      Ext.getCmp('btnEliminar').enable();
                  },
                  rowdeselect: function(smodel, rowIndex, record) {
                      Ext.getCmp('gpNomencladorApertura').getView().removeRowClass(rowIndex, "negrita");
                      Ext.getCmp('btnModificar').disable();
                      Ext.getCmp('btnEliminar').disable();
                  }
              }
          });
          gpnomencladores = new Ext.grid.GridPanel({
              id: 'gpNomencladorApertura',
              frame: false,
              border: false,
              store: stnomenclador,
              sm: sml,
              stripeRows: true,
              viewConfig: {
                  forceFit: true
              },
              loadMask: {
                  store: stnomenclador,
                  msg: etiquetas.lbCargando
              },
              tbar: [sfBuscar],
              autoExpandColumn: 'denominacion',
              columns: [
                  {hidden: true, hideable: false, dataIndex: 'idconfapertura'},
                  {header: etiquetas.lbDenominacion, width: 300, sortable: true, dataIndex: 'denominacionM', id: 'denominacion', tooltip: etiquetas.lbTtDenominacion},
                  {header: etiquetas.lbConcepto, width: 200, sortable: true, dataIndex: 'conceptoM', tooltip: etiquetas.lbTtConcepto},
                  {header: etiquetas.lbIdentificador, width: 200, sortable: true, dataIndex: 'identM', tooltip: etiquetas.lbTtIdentificar},
                  {header: etiquetas.lbIdentificadorPadre, width: 150, sortable: true, dataIndex: 'identificadorpadre', tooltip: etiquetas.lbIdentificadorPadre},
                  {header: etiquetas.lbCode, width: 170, sortable: true, dataIndex: 'codigoM', tooltip: etiquetas.lbTtCodigo},
                  {header: etiquetas.lbDescripcion, width: 150, sortable: true, dataIndex: 'descripcionM', tooltip: etiquetas.lbTtDescripcion},
                  {header: "Version", width: 150, dataIndex: 'version', hidden: true, hideable: false},
                  {header: "IdEstructuraE", width: 150, dataIndex: 'idestructurae', hidden: true, hideable: false}

              ],
              bbar: new Ext.Cont.PagingToolbar({
                  pageSize: 20,
                  store: stnomenclador,
                  displayInfo: true,
                  displayMsg: etiquetas.lbDisplayMsg,
                  emptyMsg: etiquetas.lbEmptyMsg
              }),
              listeners: {
                  'dblclick': function(event) {
                      if(!btnModificar.disabled)
                          btnModificar.handler.call();
                  }
              }
          });
          loadstnomencladores(0);
          fpnomaperturaadicionar = new Ext.form.FormPanel({
              labelAlign: 'top',
              bodyStyle: 'padding: 10px 10px 10px 10px;',
              frame: true,
              width: 360,
              id: 'fpnomaperturaadicionar',
              items: [txtdenominacionA, cbxconceptoA, cbxidentificadorA, cbxidentificadorpadreA, cbxcodigoA, cbxdescripcionA]
          });
          fpnomaperturamodificar = new Ext.form.FormPanel({
              labelAlign: 'top',
              bodyStyle: 'padding: 10px 10px 10px 10px;',
              frame: true,
              width: 340,
              items: [hversion, txtdenominacionM, cbxconceptoM, cbxidentificadorM, cbxidentificadorpadreM, cbxcodigoM, cbxdescripcionM]
          });
          function verificarCampos() {
              if(fpnomaperturaadicionar && fpnomaperturaadicionar.getForm().isValid()) {
                  btnAplicarA.setDisabled(false);
                  btnAceptarA.setDisabled(false);
              } else {
                  btnAplicarA.setDisabled(true);
                  btnAceptarA.setDisabled(true);
              }
              if(fpnomaperturamodificar && fpnomaperturamodificar.getForm().isValid()) {
                  btnAceptarM.setDisabled(false);
              } else {
                  btnAceptarM.setDisabled(true);
              }
          }
          winModNom = new Ext.Window({
              resizable: false,
              modal: true,
              constrain: true,
              defaultButton: 0,
              autoValidate: false,
              width: 342,
              closeAction: 'hide',
              title: etiquetas.titleModNom,
              keys: new Ext.KeyMap(Ext.getBody(), [
                  {
                      key: Ext.EventObject.TAB, //TAB
                      fn: function() {
                          if(document.activeElement.tabIndex == 27)
                              Ext.getCmp('denominacionM').focus(true, 10);
                      }
                  }, {
                      key: Ext.EventObject.TAB, //SHIFT+TAB
                      shift: true,
                      fn: function() {
                          if(document.activeElement.tabIndex == 20)
                              Ext.getCmp('btnAceptarM').focus();

                      }
                  }], "keydown"),
              listeners: {
                  show: function(c) {
                      Ext.getCmp('denominacionM').focus(true, 100);
                  },

                  hide: function() {
                      Ext.getCmp('btnAdicionar').focus();

                  }
              },
              buttons: [btnCancelarM, btnAceptarM]
          });
          winInsNom = new Ext.Window({
              resizable: false,
              modal: true,
              width: 342,
              closeAction: 'hide',
              constrain: true,
              defaultButton: 0,
              keys: new Ext.KeyMap(Ext.getBody(), [{
                      key: Ext.EventObject.ENTER,
                      fn: function() {
                          Ext.getCmp('btnAceptarA').handler.call();
                      },
                      scope: winInsNom
                  }, {
                      key: Ext.EventObject.TAB, //TAB
                      fn: function() {
                          if(document.activeElement.tabIndex == 18)
                              Ext.getCmp('denominacionA').focus(true, 10);
                      }
                  }, {
                      key: Ext.EventObject.TAB, //SHIFT+TAB
                      shift: true,
                      fn: function() {
                          if(document.activeElement.tabIndex == 10)
                              Ext.getCmp('btnAceptarA').focus();
                      }
                  }], "keydown"),
              listeners: {
                  show: function() {
                      Ext.getCmp('denominacionA').focus(false, 350);
                  },
                  hide: function() {
                      Ext.getCmp('btnAdicionar').focus();
                      winFpReg = '';
                  }
              },
              title: etiquetas.titleCreateNom,
              buttons: [btnCancelarA, btnAplicarA, btnAceptarA]
          });
          function winForm(opcion) {
              switch(opcion) {
                  case 0:
                      {
                          winFpReg = 'add';
                          loadstconceptos();
                      }
                      break;
                  case 1:
                      {
                          if(sml.getSelected())
                          {
                              fpnomaperturamodificar.getForm().reset();
                              winFpReg = 'mod';
                              winModNom.add(fpnomaperturamodificar);
                              winModNom.doLayout();
                              winModNom.show();
                              fpnomaperturamodificar.getForm().loadRecord(sml.getSelected());
                          }

                      }
                      break;
              }
          }
          function RegistrarNomenclador(apl) {
              if(fpnomaperturaadicionar.getForm().isValid()) {
                  a2 = stconceptos.find('concepto', cbxconceptoA.getValue());
                  esq2 = stconceptos.getAt(parseInt(a2));
                  var cont = 0;
                  Ext.each(stnomenclador.reader.jsonData.nomenclador, function(item, index) {
                      if(item.concepto == esq2.data.concepto) {
                          cont++;
                      }
                  });
                  if(cont <= 0) {
                      fpnomaperturaadicionar.getForm().submit({
                          waitMsg: etiquetas.lbWaitReg,
                          url: 'adicionarnomenclador',
                          params: {esquema: esq2.data.esquema},
                          failure: function(form, action) {
                              switch(action.result.codMsg) {
                                  case -1:
                                      {
                                          mostrarMensaje(1, etiquetas.lbAddOK);
                                          if(!apl) {
                                              winInsNom.hide();
                                          }
                                          loadstnomencladores(0);
                                      }
                                      break;
                                  case -2:
                                      {
                                          mostrarMensaje(1, etiquetas.lbExistNom2);
                                      }
                                      break;
                                  case -3:
                                      {
                                          mostrarMensaje(1, etiquetas.lbExistNom3);
                                      }
                                      break;
                                  default:
                                      {
                                          mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                      }
                                      break;
                              }
                              form.reset();
                              Ext.getCmp('btnAdicionar').focus();
                          }
                      });
                  } else {
                      mostrarMensaje(1, etiquetas.msgExist);
                  }
              } else {
                  mostrarMensaje(1, etiquetas.msgInvalidForm);
              }

          }
          function EliminarNomenclador() {
              mostrarMensaje(2, etiquetas.msgConfirmDelete, eliminar);
              function eliminar(btnPresionado) {
                  if(btnPresionado == 'ok') {
                      Ext.Msg.wait(etiquetas.lbWaitDel, etiquetas.lbEsperando);
                      if(sml.getSelected()) {
                          Ext.Ajax.request({
                              url: 'eliminarnomenclador',
                              method: 'POST',
                              params: {idconfapertura: sml.getSelected().get('idconfapertura')},
                              callback: function(options, success, response) {
                                  responseData = Ext.decode(response.responseText);
                                  Ext.Msg.hide();
                                  switch(responseData.codMsg) {
                                      case -1:
                                          {
                                              mostrarMensaje(1, etiquetas.lbDelOK);
                                              loadstnomencladores(0);
                                              Ext.getCmp('btnAdicionar').focus();
                                          }
                                          break;
                                      case -2:
                                          {
                                              mostrarMensaje(1, etiquetas.lbNomDelUso);
                                          }
                                          break;
                                      default:
                                          {
                                              mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                          }
                                          break;
                                  }
                                  btnModificar.disable();
                                  btnEliminar.disable();
                                  Ext.getCmp('btnAdicionar').focus();
                              }
                          });
                      } else {
                          mostrarMensaje(1, etiquetas.msgNoneNomSelected);
                      }
                  }
              }
          }
          function fCreoRecord() {
              var array = new Array();
              var arrayValoresLoad = new Array(sml.getSelected().get('codigoM'), sml.getSelected().get('descripcionM'), sml.getSelected().get('denominacionM'), sml.getSelected().get('identificadorpadre'));
              var arrayValoresMod = new Array(cbxcodigoM.getRawValue(), cbxdescripcionM.getRawValue(), txtdenominacionM.getRawValue(), cbxidentificadorpadreM.getRawValue());
              return array = {'valoresLoad': arrayValoresLoad, 'valoresMod': arrayValoresMod};
          }
          function fValoresModificador(Array) {
              for(var i = 0; i < Array['valoresMod'].length; i++)
                  if(Array['valoresLoad'][i] != Array['valoresMod'][i])
                      return true;
          }
          function VerificarModificar() {
              Ext.Msg.wait(etiquetas.verifing, etiquetas.lbEsperando);
              stconceptos.load();
              Ext.Ajax.request({
                  url: 'verificarmodificar',
                  method: 'POST',
                  params: {
                      idconfapertura: sml.getSelected().get('idconfapertura')
                  },
                  callback: function(options, success, response) {
                      var responseData = parseInt(Ext.decode(response.responseText));
                      Ext.Msg.hide();
                      var esquema = '';
                      for(var i = 0, long = stconceptos.getCount(); i < long; i++) {
                          if(stconceptos.getAt(i).data.concepto == sml.getSelected().get('conceptoM')) {
                              esquema = sml.getSelected().data.nomesquema || stconceptos.getAt(i).data.esquema;
                              if(stconceptos.getAt(i).data.tree == true) {
                                  Ext.getCmp('cbxidentificadorpadreM').enable();
                              } else {
                                  Ext.getCmp('cbxidentificadorpadreM').disable();
                              }
                          }
                      }
                      if(responseData != 0) {
                          mostrarMensaje(1, etiquetas.lbNoModNomApertura);
                      } else {
                          stdescripcion.load({
                              params: {
                                  nombre: sml.getSelected().get('conceptoM'),
                                  esquema: sml.getSelected().get('nomesquema')
                              }
                          });
                          winForm(1);
                      }
                  }
              });
          }
          function ModificarNomenclador() {
              if(fpnomaperturamodificar.getForm().isValid()) {
                  if(fValoresModificador(fCreoRecord())) {
                      fpnomaperturamodificar.getForm().submit({
                          waitMsg: etiquetas.lbWaitReg,
                          url: 'modificarnomenclador',
                          params: {
                              identificador: sml.getSelected().get('identM'),
                              concepto: sml.getSelected().get('conceptoM'),
                              idconfapertura: sml.getSelected().get('idconfapertura'),
                              idestructurae: sml.getSelected().get('idestructurae')
                          },
                          failure: function(form, action) {
                              switch(action.result.codMsg) {
                                  case -1:
                                      {
                                          mostrarMensaje(1, etiquetas.lbModOK);
                                          form.reset();
                                          loadstnomencladores(0);
                                          winModNom.hide();
                                          btnModificar.disable();
                                          btnEliminar.disable();
                                      }
                                      break;
                                  case -2:
                                      {
                                          mostrarMensaje(1, etiquetas.lbMsgModFailed);
                                      }
                                      break;
                                  case -3:
                                      {
                                          mostrarMensaje(1, etiquetas.lbMsgModVersion);
                                      }
                                      break;
                                  default:
                                      {
                                          mostrarMensaje(action.result.codMsg, action.result.mensaje, function() {
                                              cbxconceptoM.reset();
                                              cbxidentificadorM.reset();
                                          });
                                      }
                                      break;
                              }
                              Ext.getCmp('btnAdicionar').focus();
                          }
                      });
                  } else {
                      mostrarMensaje(1, etiquetas.lbNoChanges);
                  }
              } else {
                  mostrarMensaje(1, etiquetas.msgInvalidForm);
              }
              btnAceptarM.disable();
          }
          panelContenedor = new Ext.Panel({
              layout: 'fit',
              width: 820,
              listeners: {
                  render: function() {
                      Ext.getCmp('btnAdicionar').focus();
                  }
              },
              tbar: [btnAdicionar, btnModificar, btnEliminar, '->', btnAyuda],
              items: [gpnomencladores]
          });
          vpContenido = new Ext.Viewport({
              layout: 'fit',
              items: panelContenedor,
              keys: new Ext.KeyMap(Ext.getBody(), [
                  {
                      key: 'i',
                      alt: true,
                      fn: function() {
                          if(!btnAdicionar.disabled)
                              btnAdicionar.handler.call();
                      }
                  }, {
                      key: 'm',
                      alt: true,
                      fn: function() {
                          if(!btnModificar.disabled)
                              btnModificar.handler.call();
                      }
                  }, {
                      key: Ext.EventObject.DELETE,
                      fn: function() {
                          if(!btnEliminar.disabled)
                              btnEliminar.handler.call();
                      }
                  }, {
                      key: "b",
                      alt: true,
                      scope: this,
                      fn: function() {
                          var filter = Ext.getCmp('sfBuscar');
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
                          var filter = Ext.getCmp('sfBuscar');
                          if(filter.getValue()) {
                              filter.onTrigger1Click();
                          }
                      }
                  }, {
                      key: Ext.EventObject.F1,
                      fn: function() {
                          btnAyuda.handler.call();
                      }
                  }, {
                      key: 'h',
                      alt: true,
                      fn: function() {
                          btnAyuda.handler.call();
                      }
                  }
              ])
          });
          txtdenominacionM.on({
              keyup: function(t, e) {
                  if(e.getKey() == 32 && valueM.length == 0)
                      txtdenominacionM.reset();
                  else if(e.getKey() == 32 && cantSpaceM == 0 && valueM.length != 0)
                      cantSpaceM++;
                  else if(e.getKey() == 32 && cantSpaceM > 0)
                      txtdenominacionM.setValue(valueM + ' ');
                  else if(e.getKey() != 32) {
                      cantSpaceM = 0;
                      valueM = txtdenominacionM.getValue();


                  }
                  verificarCampos();
                  btnAceptarM.setDisabled(false);
              },
              /*change: function(t, e) {
                  btnAceptarM.enable();
                  console.info(122);
              },*/
              'invalid': function(cmp, msg) {
                  if(cmp.getValue().length > 0) {
                      var vtext = cmp.getValue().trim();
                      cmp.setValue(vtext);
                  }
              },
              'blur': function(cmp) {
                  if(cmp.getValue().length > 0) {
                      var vtext = cmp.getValue().trim();
                      cmp.setValue(vtext);
                  }
              }
          });

          txtdenominacionA.on({
              change: function(t, e) {
                  btnAceptarM.enable();
              }
          });

          txtdenominacionA.on({
              keyup: function(t, e) {
                  if(e.getKey() == 32 && valueA.length == 0)
                      txtdenominacionA.reset();
                  else if(e.getKey() == 32 && cantSpaceA == 0 && valueA.length != 0)
                      cantSpaceA++;
                  else if(e.getKey() == 32 && cantSpaceA > 0)
                      txtdenominacionA.setValue(valueA + ' ');
                  else if(e.getKey() != 32) {
                      cantSpaceA = 0;
                      valueA = txtdenominacionA.getValue();
                  }
                  verificarCampos();
              },
              'invalid': function(cmp, msg) {
                  if(cmp.getValue().length > 0) {
                      var vtext = cmp.getValue().trim();
                      cmp.setValue(vtext);
                  }
              },
              'blur': function(cmp) {
                  if(cmp.getValue().length > 0) {
                      var vtext = cmp.getValue().trim();
                      cmp.setValue(vtext);
                  }
              }
          });
          cbxconceptoA.on({
              select: function(This, newValue, oldValue) {
                  if(estaComboCreado)
                      cbxcodigoA.reset();
                  cbxdescripcionA.reset();
                  cbxidentificadorA.reset();
                  cbxidentificadorpadreA.reset();
                  stdescripcion.removeAll();
                  stident.removeAll();
                  loadDatosFiltrar(cbxconceptoA.getValue());
              }
          });
          cbxconceptoM.on({
              select: function(This, newValue, oldValue) {
                  btnAceptarM.enable();
              }
          });
          cbxcodigoM.on({
              change: function(This, newValue, oldValue) {
                  //btnAceptarM.enable();
              }
          });
          cbxdescripcionM.on({
              change: function(This, newValue, oldValue) {
                  btnAceptarM.enable();
              }
          });
          btnModificar.on({
              click: function(t, e) {
                  btnAceptarM.disable();
              }
          });
          function loadstnomencladores(opc) {
              Ext.MessageBox.hide();
              stnomenclador.load({
                  params: {opcion: opc},
                  callback: function() {
                      if(stnomenclador.getCount() == 0) {
                          mostrarMensaje(1, etiquetas.msgNoneNomConf);
                      }
                  }});
          }
          function loadMask(message) {
              lMask = new Ext.LoadMask(Ext.getBody(), {msg: message});
              lMask.show();
          }
          function loadstconceptos() {
              loadMask(etiquetas.lbCargando);
              stconceptos.load({
                  callback: function() {
                      if(stconceptos.getCount() == 0) {
                          lMask.hide();
                          mostrarMensaje(1, etiquetas.lbNoConceptosConf);
                      } else {
                          lMask.hide();
                          fpnomaperturaadicionar.getForm().reset();
                          winInsNom.add(fpnomaperturaadicionar);
                          winInsNom.show();
                          winInsNom.doLayout();
                          fpnomaperturaadicionar.getForm().isValid();
                      }
                  }
              });
          }
          function enableFieldsOnAdd() {
              cbxidentificadorA.enable();
              cbxcodigoA.enable();
              cbxdescripcionA.enable();
          }
          function disableFieldsOnAdd() {
              cbxidentificadorA.disable();
              cbxcodigoA.disable();
              cbxdescripcionA.disable();

          }
          function DevolverTree(concepto) {
              for(var i = 0; i < stconceptos.getCount(); i++)
                  if(eval('stconceptos.getRange(0,stconceptos.getCount()-1)[i].data.concepto') == concepto)
                      return eval('stconceptos.getRange(0,stconceptos.getCount()-1)[i].data.tree');
          }
          function loadDatosFiltrar(concepto) {
              loadMask(etiquetas.lbCargando);
              if(DevolverTree(concepto)) {
                  cbxidentificadorpadreA.enable();
              } else {
                  cbxidentificadorpadreA.disable();
              }
              var a1 = '';
              if(winFpReg == 'add') {
                  a1 = stconceptos.find('concepto', cbxconceptoA.getValue());
              } else {
                  a1 = stconceptos.find('concepto', cbxconceptoM.getValue());

              }
              var esq = stconceptos.getAt(parseInt(a1));
              stident.load({
                  params: {
                      nombre: concepto,
                      esquema: esq.data.esquema
                  },
                  callback: function(r, options, success) {
                      loadMask(etiquetas.lbCargando);
                      Ext.Ajax.request({
                          method: "POST",
                          url: "cargardescripciones",
                          params: {nombre: concepto,
                              esquema: esq.data.esquema
                          },
                          callback: function(options, success, response) {
                              lMask.hide();
                              if(winFpReg == 'add') {
                                  Ext.getCmp('identA').focus(false, 100);
                                  Ext.getCmp('identA').expand();
                              } else {
                                  Ext.getCmp('identM').focus(true, 100);
                                  Ext.getCmp('identM').expand();
                              }
                          }
                      });
                      stdescripcion.load({
                          params: {nombre: concepto,
                              esquema: esq.data.esquema
                          },
                          callback: function() {
                              lMask.hide();
                              if(stdescripcion.getCount() == 0 || stident.getCount() == 0) {
                                  cbxcodigoM.disable();
                                  cbxdescripcionM.disable();
                                  cbxidentificadorM.disable();
                                  cbxidentificadorpadreM.disable();
                                  mostrarMensaje(1, etiquetas.msgNoDataAsocToConcept);
                              } else {
                                  if(winFpReg == 'add') {
                                      Ext.getCmp('identA').enable();
                                      cbxcodigoA.enable();
                                      cbxdescripcionA.enable();
                                      Ext.getCmp('identA').focus(false, 100);
                                      Ext.getCmp('identA').expand();
                                  } else {
                                      Ext.getCmp('identM').enable();
                                      cbxcodigoM.enable();
                                      cbxdescripcionM.enable();
                                      Ext.getCmp('identM').focus(true, 100);
                                      Ext.getCmp('identM').expand();
                                  }
                              }
                          }
                      });
                  }
              });
          }
      }
  });
  new Ext.Confin.CuentaContable.NomApertura();
  Ext.namespace('Ext.ClassComprobante');
  Ext.ClassComprobante = Ext.extend(Ext.Component, {
      idEstructurae: undefined,
      idComprobante: undefined,
      tipoComprobante: undefined,
      numeroComprobante: undefined,
      creadoEnContabilidad: 1,
      idAsiento: undefined,
      readOnlyComprobante: false,
      url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/',
      pnlHeight: 270,
      comprobanteBlock: false,
      comprobanteEditable: true,
      reloadGridRegistroComprobantes: false,
      perfil: window.parent.perfil,
      etiquetas: undefined,
      aperturado : 0,
      constructor: function (params) {
          Ext.apply(this, params);
          this.addEvents('closeUIComprobante');
          this.tipoComprobante = params.tipoComprobante;
          this.idComprobante = (params.accion > 1) ? params.idComprobante : undefined;
          this.idEstructurae = (params.accion > 1) ? params.idEstructurae : undefined;
          this.idSubsistema = params.idSubsistema;
          this.aperturado = 0;
          this.classParams = params;
          this.cargarPerfil(this);
      },
      constructorBase: function (params) {
          switch(params.tipoComprobante)
          {
              case 1 :
                  {
                      this.jsSrc = "FrmComprobanteTipo";
                      this.pnlHeight = 275;
                  }
                  break;
              case 2 :
              case 3:
              {
                  this.jsSrc = "FrmComprobanteTipo";
                  //CARGAR JS DESGLOSE CUENTA
                  this.loadJs('/contabilidad/contabilidad_financiera/cuentacontable/views/js/componentes/DesgloseXNivel/ClassDesgloseXNivel', 'ClassDesgloseXNivel');
                  this.loadJs('/contabilidad/contabilidad_financiera/cuentacontable/views/js/componentes/DesgloseXNivel/FrmDesgloseXNivel', 'FrmDesgloseXNivel');
              }
          }
          if(!document.getElementById('windowComprobante'))
              this.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/windowComprobante", 'windowComprobante');
          this.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/ClassCambiarNumero", 'ClassCambiarNumero');
          this.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/ClassAnexoGasto", 'ClassAnexoGasto');
          if(!document.getElementById('Notification'))
              this.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');

          if(!document.getElementById('MessageBox'))
              this.loadJs("/contabilidad/comun/componentes/MessageBox/MessageBox", 'MessageBox');

          this.loadJs("/contabilidad/contabilidad_financiera/comprobante_operaciones/views/js/comprobante/" + this.jsSrc, this.jsSrc);

          Ext.ClassComprobante.superclass.constructor.call(this, params);
          this.loadData(this);
      },
      fComprobarBloqueoComprobante: function (params) {
          var scope = this;
          if(this.idComprobante != undefined && !scope.comprobanteBlock)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', 'Cargando comprobante...');
              Ext.Ajax.request({
                  method: "POST",
                  params: {
                      idComprobante: this.idComprobante
                  },
                  url: this.url + "estaBloqueadoComprobante",
                  callback: function (options, success, response)
                  {
                      responseData = Ext.decode(response.responseText);
                      function fAcepto(btn)
                      {
                          if(btn == 'ok')
                          {
                              scope.comprobanteBlock = true;
                              scope.constructorBase(params);
                          } else {
                              Ext.CONT.Componentes.HideBox('msgbIniciando');
                          }
                      }
                      if(responseData.flag == true || responseData.flag == 'true')
                          mostrarMensaje(2, scope.etiquetas.msgComprobanteBloqueado1 + responseData.Usuario + scope.etiquetas.msgComprobanteBloqueado2, fAcepto);
                      else
                          scope.constructorBase(params);
                  }
              });
          } else
              scope.constructorBase(params);
      },
      loadJs: function (jsSrc, id) {
          if(jsSrc != null)
          {
              var tagScript = document.createElement("script");
              tagScript.setAttribute("type", "text/javascript");
              tagScript.setAttribute("id", id);
              tagScript.setAttribute("src", jsSrc + ".js");
              document.getElementsByTagName("body")[0].appendChild(tagScript);
          }
      },
      cargarPerfil: function (scope) {
          Ext.CONT.Componentes.MessageBox('msgbIniciando', 'Cargando...');
          Ext.Ajax.request({
              method: "POST",
              url: scope.url + "cargaretiquetas",
              callback: function (options, success, response)
              {
                  scope.etiquetas = Ext.decode(response.responseText);
                  scope.fComprobarBloqueoComprobante(scope.classParams);
              }
          });
      },
      loadData: function (scope) {
          Ext.Ajax.request({
              method: "POST",
              params: {
                  accion: scope.accion,
                  tipoComprobante: scope.tipoComprobante,
                  comprobanteBlock: scope.comprobanteBlock,
                  idComprobante: scope.idComprobante
              },
              url: scope.url + "loadDataComponent",
              callback: function (options, success, response)
              {
                  responseData = Ext.decode(response.responseText);
                  if((responseData.info === 'true' || responseData.info === true) && responseData.Monedas.length > 0 && responseData.Tasas.length > 0)
                  {
                      if(responseData.infoComprobanteApertura == true) {
                          scope.tipoComprobante = 1;
                      }
                      switch(scope.tipoComprobante)
                      {
                          case 1 :
                              scope.title = scope.etiquetas.textWindowComprobanteApertura;
                              if(responseData.Comprobante.idestadocomprobante != 8032 || responseData.Comprobante.idestadocomprobante == 8031)
                                  mostrarMensaje(1, "El comprobante que est&aacute; a punto de editar representa el Balance de apertura.");
                              break;
                          case 2 :
//                                    scope.title = scope.etiquetas.textWindowComprobanteDesglosado;
//                                    break;
                          case 3 :
                              scope.title = scope.etiquetas.textWindowComprobante;
                              break;
                      }

                      scope.wComprobante = new Ext.windowComprobante(scope, {
                          title: scope.title,
                          constrain: true
                      });

                      scope.initializeEvents(scope);
                      scope.initializeFunctions(scope);
                      scope.loadDataComponent(responseData);
                  } else {
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      var msgError = '';
                      if(responseData.infoMonedasEntidad == false) {
                          msgError += '<li>Las monedas alternativas. </li>';
                      }
                      if(responseData.infoMonedaContable == false) {
                          msgError += '<li>La moneda contable. </li>';
                      }
                      if(responseData.infoTasaContable == false) {
                          msgError += '<li>La tasa de la moneda contable. </li>';
                      }
                      if(responseData.SeleccionInicial.length == 0) {
                          msgError += '<li>Los subsistemas que contabilizan. </li>';
                      }
                      mostrarMensaje(1, '</p>' + scope.etiquetas.msgErrorInicioComprobante + ' Los siguientes datos no han sido configurados correctamente: <br><div><ul>' + msgError + '</ul></div></p>', Ext.emptyFn);
                  }
              }
          });
      },
      loadDataComponent: function (data) {
          this.cbxCuenta.getStore().reload();
          var scope = this;
          if(this.idComprobante != undefined)
              scope.creadoEnContabilidad = data.Comprobante.creadoEnContabilidad;

          //this.dfFecha.setMinValue(data.Fecha);
          //this.dfFecha.setMaxValue(data.Periodo.fin);
          this.dfFecha.setMinValue(data.Periodo.inicio);
          this.dfFecha.setMaxValue(data.Fecha);

          if(!this.comprobanteBlock)
          {
              // if(this.tipoComprobante != 1) {
              this.stSubsistema.loadData(data.SeleccionInicial);
              // }
              if (this.stSubsistema.getTotalCount() == 1) {
                  this.cbxSubsistema.setValue(this.stSubsistema.getAt(0).data.idsubsistema);
                  // this.cbxSubsistema.setRawValue(this.stSubsistema.getAt(0).data.denominacion);
                  this.cbxSubsistema.fireEvent('select', this.cbxSubsistema, this.stSubsistema.getAt(0), 0);
              }
              this.stMoneda.loadData(data.Monedas);
              this.stTasa.loadData(data.Tasas);
              this.cbxMoneda.setValue(data.MonedaContable.idmoneda);

              if(data.Comprobante && this.tipoComprobante != 1)
                  this.stOperacion.load({
                      params: {idSubsistema: data.Comprobante.idSubsistema}
                  });

              if(this.idComprobante != undefined)
              {
                  if(this.tipoComprobante != 1) {
                      this.cbxSubsistema.setValue(data.Comprobante.idSubsistema);
                      // this.cbxSubsistema.setRawValue(data.SeleccionInicial[0].denominacion);
                      this.cbxSubsistema.disable();
                  }
                  if(data.Comprobante.idestadocomprobante == 8030 || data.Comprobante.idestadocomprobante == 8031)
                  {
                      if(data.Comprobante.idestadocomprobante == 8031)
                      {
                          this.btnCambiarEstado.setText(scope.etiquetas.btnAsentar);
                          this.fActionOnButtonsComprobante(data);
                      }
                      if((scope.creadoEnContabilidad * 1) < 1)
                          this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 3, 7), false);
                          //this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 6, 7), false);
                      else
                          this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 5, 6, 7), false);
                  } else
                  if(data.Comprobante.idestadocomprobante == 8032)
                  {
                      this.fActionOnButtonsComprobante(data);
                      if((scope.creadoEnContabilidad * 1) < 1)
                          this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 3, 7], false);
                      else {
                          if(scope.readOnlyComprobante == true) {
                              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 7], false);
                          } else {
                              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 3, 4, 5, 7], false);
                          }
                      }
                  } else
                  if(data.Comprobante.idestadocomprobante == 8033)
                      this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                      //this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 6, 7], false);
                  if(data.Comprobante.idestadocomprobante == 8034) {
                      this.fActionOnButtonsComprobante(data);
                      this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                  }

                  if(this.tipoComprobante == 1)
                  {
                      this.tfDetalle.setValue(data.Comprobante.detalle);
                      this.taDescripcion.setValue(data.Comprobante.observacion);
                      this.cbxSubsistema.setValue(data.Comprobante.idSubsistema);

                      this.cbxSubsistema.fireEvent('select', this.cbxSubsistema);

                      this.cbxSubsistema.disable();
                      this.cbxDocumento.disable();
                      this.tfNumeroDocumento.disable();
                  }
              } else {
                  if(this.tipoComprobante == 1)
                  {
                      this.tfDetalle.setValue(data.Comprobante.detalle);
                      this.taDescripcion.setValue(data.Comprobante.observacion);
                      // this.cbxSubsistema.setValue(data.Comprobante.idSubsistema);
                      // this.cbxSubsistema.setRawValue(data.SeleccionInicial[0].denominacion);
                      //this.cbxSubsistema.disable();
                      this.cbxDocumento.disable();
                      this.tfNumeroDocumento.disable();
                  }
              }
          } else {
              this.fActionOnButtonsComprobante(data);
              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 7], false);
          }
          if(this.idComprobante != undefined)
          {
              this.idAsiento = data.Comprobante.idAsiento;
              this.tfDetalle.setValue(data.Comprobante.detalle);
              this.taDescripcion.setValue(data.Comprobante.observacion);
              this.numeroComprobante = data.Comprobante.numeroComprobante;
              if(data.AperturaEjercicio == true || data.AperturaEjercicio == 'true')
              {
//                        this.dfFecha.setMinValue(null);
                  this.dfFecha.setMinValue(data.Periodo.inicio);
                  this.dfFecha.setValue(data.Comprobante.fecha);
                  this.dfFecha.setMaxValue(data.Periodo.fin);//add
              } else {
                  this.dfFecha.setValue(data.Comprobante.fecha);
              }
              scope.fActualizarVariablesListenersChange();
          } else
          {
              this.dfFecha.setValue(data.Fecha);
              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [7], false);
          }

          this.wComprobante.show(Ext.getBody(), function () {
              this.maximize();
              scope.wComprobante.getComponent(0).getComponent(0).getComponent(0).getComponent(0).getComponent(0).focus(true, 100);
              if(scope.idComprobante != undefined)
                  scope.fCargarPases();
          });

      },
      initializeEvents: function (scope) {
          this.tfDetalle.on({
              'keypress': function (t, e) {
                  if(e.getKey() == 13) {
                      scope.dfFecha.focus(true, 10);
                  }
                  // if(t.getValue().toString().length > 0)
                  //     scope.fToggleVisibleBtnAceptarPase();
              },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          this.dfFecha.on({
              'keypress': function (t, e) {
                  if(e.getKey() == 13 || e.getKey() == 9) {
                      scope.taDescripcion.focus(true, 10);
                  }
                  // if(t.getValue().toString().length > 0)
                  //     scope.fToggleVisibleBtnAceptarPase();
              },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          this.taDescripcion.on({
              'keypress': function (t, e) {
                  if((e.getKey() == 13) && (scope.tipoComprobante != 3)) {
                      e.stopEvent();
                      scope.cbxCuenta.focus(true, 10);
                  }
                  if((e.getKey() == 13) && (scope.tipoComprobante == 3)) {
                      e.stopEvent();
                      scope.cbxSubsistema.focus(true, 10);
                  }
                  // if(t.getValue().toString().length > 0)
                  //     scope.fToggleVisibleBtnAceptarPase();
              },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          if(scope.tipoComprobante == 3) {
              this.cbxDocumento.on('keypress', function (t, e) {
                  if(e.getKey() == 13) {
                      scope.tfNumeroDocumento.focus(true, 10);
                  }
              });
              this.tfNumeroDocumento.on('keypress', function (t, e) {
                  if(e.getKey() == 13 || e.getKey() == 9) {
                      scope.cbxCuenta.focus(true, 100);
                  }
              });
          }
          this.wComprobante.on({
              'resize': function (window, width, height) {
                  window.doLayout();
              },
              'beforeshow': function () {
                  if(scope.tipoComprobante == 3)
                  {
                      scope.cbxOperacion.setRawValue(scope.etiquetas.textSeleccioneObjeto);
                      scope.cbxCuenta.setRawValue(scope.etiquetas.textSeleccioneObjeto);
                      scope.cbxDocumento.setRawValue(scope.etiquetas.textSeleccioneOperacion);
                  }
              },
              'show': function () {
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
              },
              'close': function () {
                  if(document.getElementById('ClassDesgloseXNivel'))
                      document.getElementsByTagName("body")[0].removeChild(document.getElementById('ClassDesgloseXNivel'));
                  if(document.getElementById('FrmDesgloseXNivel'))
                      document.getElementsByTagName("body")[0].removeChild(document.getElementById('FrmDesgloseXNivel'));
                  document.getElementsByTagName("body")[0].removeChild(document.getElementById(scope.jsSrc));
              }
          });
          if(this.cbxSubsistema)
              this.cbxSubsistema.on({
                  select: function (combo, record, index) {
                      scope.lMask.show();
                      scope.stOperacion.load({
                          params: {
                              idSubsistema: combo.getValue()
                          },
                          callback: function () {
                              // if(scope.tipoComprobante == 3 && !scope.cbxOperacion.disabled) {
                              //     scope.cbxOperacion.focus(true, 10);
                              //     scope.cbxOperacion.expand();
                              // }
                          }
                      });
                  },
                  keypress: function (t, e) {
                      if(e.getKey() == 13 && scope.tipoComprobante == 3 && !scope.cbxOperacion.disabled) {
                          scope.cbxOperacion.focus(true, 10);
                          scope.cbxOperacion.expand();
                      }
                  }
              });
          if(this.stOperacion)
              this.stOperacion.on('load', function (store, records, options) {
                  scope.fEnableComponentByContent(scope.cbxOperacion, scope.stOperacion, records, true);
              });
          if(this.stDocumento)
              this.stDocumento.on('load', function (store, records, options) {
                  scope.cbxDocumento.setValue(records[0].data.iddoc);
                  scope.cbxDocumento.setRawValue(records[0].data.denominacion);
                  scope.lMask.hide();
              });
          if(this.cbxOperacion)
              this.cbxOperacion.on({
                  select: function (combo, record, index) {
                      scope.idAsiento = null;
                      scope.lMask.show();
                      scope.tfNumeroDocumento.focus(true, true);
                      scope.cbxCuenta.enable();
                      if(record.data.idmodelo !== null) {
                          scope.btnAddModelo.enable();
                      } else {
                          scope.btnAddModelo.disable();
                      }
                      scope.stDocumento.load({
                          params: {
                              idDocumento: record.data.iddocumento
                          }
                      });
                  },
                  keypress: function (t, e) {
                      if((e.getKey() == 13 || e.getKey() == 9) && scope.tipoComprobante == 3) {
                          scope.tfNumeroDocumento.focus(true, true);
                      }
                  }
              });
          var cont = 0;
          this.cbxCuenta.on({
              'select': function (combo, record, index) {
                  scope.fDeleteComponents();
                  if(parseInt(record.data.idnaturaleza) == 8031) {
                      scope.nfDebito.focus(true, 10);
                  } else {
                      scope.nfCredito.focus(true, 10);
                  }
                  if(record.data.leaf)
                  {
                      // scope.fDisabledNumberField(false);
                      scope.recordLastComponent = record;
                  }

                  //cuando selecciono la cuenta busco  en el combo de moneda el record de esa moneda
                  //seteo el codigo iso y el idnommonedaentidad que tiene el record en el combo
                  // disparo el evento de select de la moneda

                  var index = scope.stMoneda.find('idmoneda', record.data.idmoneda);
                  scope.cbxMoneda.setValue(scope.stMoneda.getAt(index).data.idmoneda);
                  scope.cbxMoneda.setRawValue(scope.stMoneda.getAt(index).data.codigo);
                    //scope.cbxMoneda.fireEvent('select', scope.cbxMoneda, scope.stMoneda.getAt(0), 0);
                  scope.lMask.show();
                  scope.stTasa.load({
                      params: {
                          idmoneda: record.data.idmoneda
                      }
                  });

                  // scope.fToggleVisibleBtnAceptarPase();
              },
              'keypress': function (t, e) {
                  // if(t.getValue().toString().length > 0 && t.isValid())
                  if(e.getKey() == 13 || e.getKey() == 9) {
                      scope.cbxMoneda.focus(true, 10);
                  }
              },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          this.fpContainerTopNorth.on({
              'collapse': function (panel) {
                  if(scope.fpContainerRegionNorth.isVisible())
                      Ext.getCmp('globalNorth').setHeight(scope.pnlHeight - 130);
                  else
                      Ext.getCmp('globalNorth').setHeight(40);
                  scope.wComprobante.doLayout();
              },
              'expand': function (panel) {
                  if(scope.fpContainerRegionNorth.isVisible())
                      Ext.getCmp('globalNorth').setHeight(scope.pnlHeight);
                  else
                      Ext.getCmp('globalNorth').setHeight(scope.pnlHeight - 100);
                  scope.wComprobante.doLayout();
              }
          });
          this.cbxMoneda.on({
              'select': function (combo, record, index) {
                  scope.lMask.show();
                  scope.stTasa.load({
                      params: {
                          idmoneda: record.data.idmoneda
                      }
                  });
              },
              // 'keypress': function (t, e) {
              //     if(e.getKey() == 13 || e.getKey() == 9) {
              //         scope.cbxTasa.focus(true, 10);
              //     }
              // },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          this.cbxTasa.on({
              'select': function (combo, record, index) {
                  scope.txtFactorConversion.setValue(record.data.factordeconversion);
              },
              'keypress': function (t, e) {
                  if(e.getKey() == 13 || e.getKey() == 9) {
                      scope.txtFactorConversion.focus(true, 10);
                  }
              },
              'invalid': function () {
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              }
          });
          this.stTasa.on('load', function (store, records, options) {
              if(records.length > 0)
              {
                  scope.cbxTasa.setDisabled(false);
                  scope.cbxTasa.setValue(scope.stTasa.getAt(0).data.idtasa);
                  scope.txtFactorConversion.setValue(scope.stTasa.getAt(0).data.factordeconversion);

              } else
              {
                  scope.cbxTasa.clearValue();
                  scope.txtFactorConversion.setValue(null);
                  scope.stTasa.removeAll();
                  scope.cbxTasa.setDisabled(true);
                  mostrarMensaje(1, scope.etiquetas.msgNoHayTasas);
              }
              scope.lMask.hide();
          });
          this.txtFactorConversion.on({
              'keypress': function (t, e) {
                  if(e.getKey() == 13 || e.getKey() == 9) {
                      scope.nfDebito.focus(true, 10);
                  }
              }
          });
          this.nfDebito.on({
              'focus': function (t) {
                  this.selectText();
              },
              'keypress': function (component, event) {
                  if(event.getKey() == 46 || event.getKey() >= 48 && event.getKey() <= 57)
                      scope.fSetActionNumberField(scope.nfCredito, false);
                  else if(event.getKey() == 9)
                      scope.nfCredito.selectText();
                  else if(event.getKey() == 13 && scope.nfDebito.getValue())
                      scope.btnAceptarPase.fireEvent('click', scope.btnAceptarPase);
                  else if(event.getKey() == 13 && scope.nfDebito.getValue().length == 0)
                      scope.nfCredito.focus(true, 10);
                  else scope.btnAceptarPase.enable();
                  // if(component.getValue().toString().length > 0 && component.isValid()) {
                  //     scope.fToggleVisibleBtnAceptarPase();
                  // }
              // },
              // 'invalid': function () {
              //     if(scope.btnAceptarPase.isVisible()) {
              //         scope.btnAceptarPase.disable();
              //     } else {
              //         scope.btnGuardarPase.disable();
              //     }
              }
          });
          this.nfCredito.on({
              'focus': function () {
                  this.selectText();
              },
              'keypress': function (component, event) {
                  if(event.getKey() == 46 || event.getKey() >= 48 && event.getKey() <= 57)
                      scope.fSetActionNumberField(scope.nfDebito, false);
                  else if(event.getKey() == 9)
                      scope.nfDebito.selectText();
                  else if(event.getKey() == 13 && scope.nfCredito.getValue())
                      scope.btnAceptarPase.fireEvent('click', scope.btnAceptarPase);
                  else scope.btnAceptarPase.enable();
                  // if(component.getValue().toString().length > 0 && component.isValid()) {
                  //     scope.fToggleVisibleBtnAceptarPase();
                  // }
              // },
              // 'invalid': function () {
              //     if(scope.btnAceptarPase.isVisible()) {
              //         scope.btnAceptarPase.disable();
              //     } else {
              //         scope.btnGuardarPase.disable();
              //     }
              }
          });
          this.btnAceptarPase.on({
              'click': function (component) {
                  if(!scope.btnCancelarModificacionPase.hidden) {
                      if(scope.fIsValidContainer(scope.fpContainerRegionTopGrid.items))
                          scope.fGestionaCuentas();
                  } else {
                      if(scope.fpContainerTopNorth.getForm().isValid(true) && scope.fpContainerRegionNorth.getForm().isValid(true) && !scope.btnAceptarPase.disabled)
                          scope.fGestionaCuentas();
                  }
              }
          });
          this.btnGuardarPase.on({
              'click': function (component) {
                  scope.btnAceptarPase.fireEvent('click');
              }
          });
          this.tbGpAnotaciones.on({
              'show': function () {
                  scope.GpAnotaciones.syncSize();
                  scope.wComprobante.doLayout(true);
              },
              'hide': function () {
                  scope.GpAnotaciones.syncSize();
                  scope.wComprobante.doLayout(true);
              }
          });
          this.bbGpAnotaciones.on({
              'show': function () {
                  scope.GpAnotaciones.syncSize();
                  scope.lbNroComprobante.setText('<b>' + scope.numeroComprobante + '</b>', false);
                  scope.wComprobante.doLayout(true);
              },
              'hide': function () {
                  scope.GpAnotaciones.syncSize();
                  scope.wComprobante.doLayout(true);
              }
          });
          this.stGpAnotaciones.on({
              'beforeload': function (store, options) {
                  scope.tbGpAnotaciones.hide();
              },
              'load': function (store, records, options) {
                  scope.lMaskGrid.hide();
                  if(records.length > 0)
                  {
                      if(records.length > 1)
                          scope.btnEliminarPase.show();
                      else
                          scope.btnEliminarPase.hide();

                      scope.nfTotalDebito.setText('<b>' + records[0].data.totalDebito + '</b>', false);
                      scope.nfTotalCredito.setText('<b>' + records[0].data.totalCredito + '</b>', false);
                      var textEstado = (records[0].data.idEstadoComprobante == 8033 || records[0].data.idEstadoComprobante == 8034) ? '<span style="color:red;"><b>' + records[0].data.estadoComprobante + '</b></span>' : '<b>' + records[0].data.estadoComprobante + '</b>';
                      scope.estadoComprobante = records[0].data.idEstadoComprobante;
                      if(records[0].data.idEstadoComprobante == 8033 && !scope.comprobanteBlock)
                          //scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 6, 7], false);
                          // scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                          scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 6, 7], false);
                      else if(records[0].data.idEstadoComprobante == 8034 && !scope.comprobanteBlock)
                          scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                      // else if(records[0].data.idEstadoComprobante == 8030 && !scope.comprobanteBlock)
                          // scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 2, 5, 6, 7], false);
                      // else if(records[0].data.idEstadoComprobante == 8031 && !scope.comprobanteBlock)
                      //     scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 2, 5, 6, 7], false);
                          //scope.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 2, 4, 6, 7], false);

                      scope.lbEstadoComprobante.setText(textEstado, false);
                      scope.bbGpAnotaciones.show();
                      // scope.GpAnotaciones.getSelectionModel().selectFirstRow();
                  }
              }
          });
          this.smPases.on({
              'rowdeselect': function (selmodel, rowIndex, record) {
                  if(scope.btnCancelarModificacionPase.hidden && !scope.tbGpAnotaciones.hidden) {
                      scope.tbGpAnotaciones.hide();
                      scope.kmTeclasCalientes.enable();
                  }
              },
              'rowselect': function (selmodel, rowIndex, record) {
                  if(scope.btnCancelarModificacionPase.hidden)
                  {
                      if(!scope.comprobanteEditable)
                          scope.tbGpAnotaciones.hide();
                      else
                      {
                          scope.fToggleVisibleBtnDesgloseAnexo(record);
                          if(scope.tipoComprobante == 3)
                          {
                              if(record.data.paseadicional > 0)
                              {
                                  scope.btnInvertirPase.hide();
                                  scope.btnDuplicarPase.hide();
                              } else
                              {
                                  scope.btnInvertirPase.show();
                                  scope.btnDuplicarPase.show();
                              }
                              scope.fToggleVisibleBtnEliminar(record);
                          }
                          scope.tbGpAnotaciones.show();
                      }
                      if(!scope.tbGpAnotaciones.hidden) {
                          scope.kmTeclasCalientes.enable();
                      }
                  }
              }
          });
          this.GpAnotaciones.on('rowdblclick', function (grid, rowIndex, e) {
              if(scope.GpAnotaciones.getStore().getAt(rowIndex).data.anexo && scope.btnCancelarModificacionPase.hidden)
                  scope.btnVerPase.fireEvent('click', scope.btnVerPase);
          });
          /* this.GpAnotaciones.getView().getRowClass = function(record, index, rowParams, store)
           {
           if ((record.data.descuadreAnexo == true || record.data.descuadreAnexo == 'true'))
           return 'FilaRoja';
           else
           if (record.data.paseadicional * 1)
           {
           if (record.data.porciento * 1 == 100)
           return 'FilaOscura';
           else
           return 'FilaVerde';
           }
           return '';
           };*/
          var arrayTeclasCalientes = [{
                  key: 'd',
                  alt: true,
                  ctrl: true,
                  fn: function () {
                      if (!scope.btnDuplicarPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnDuplicarPase.fireEvent('click', scope.btnDuplicarPase);
                      }
                  }
              }, {
                  key: 'm',
                  alt: true,
                  fn: function () {
                      if (!scope.btnModificarPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnModificarPase.fireEvent('click', scope.btnModificarPase);
                      }
                  }
              }, {
                  key: 'i',
                  alt: true,
                  fn: function () {
                      if (!scope.btnAceptarPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnAceptarPase.fireEvent('click', scope.btnAceptarPase);
                      }
                  }
              }, {
                  key: 'i',
                  alt: true,
                  ctrl: true,
                  fn: function () {
                      if (!scope.btnInvertirPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnInvertirPase.fireEvent('click', scope.btnInvertirPase);
                      }
                  }
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function () {
                      if (!scope.btnEliminarPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnEliminarPase.fireEvent('click', scope.btnEliminarPase);
                      }
                  }
              }, {
                  key: 'g',
                  alt: true,
                  fn: function () {
                      if (!scope.btnGuardarPase.disabled && !scope.tbGpAnotaciones.hidden) {
                          scope.btnGuardarPase.fireEvent('click', scope.btnGuardarPase);
                      }
                  }
              }];
          this.kmTeclasCalientes = new Ext.KeyMap(Ext.getDoc(), arrayTeclasCalientes);
          this.btnVerPase.on('click', function (component) {
              scope.btnVerPase.pressed = true;
              scope.fAbrirDesgloseRegistroAnexo();
          });
          this.btnModificarPase.on('click', function (component) {
              scope.btnModificarPase.pressed = true;
              scope.fModificarPase();
          });
          this.btnCancelarModificacionPase.on('click', function (component) {
              function fAceptoCancelacion(btn)
              {
                  if(btn == 'ok')
                      scope.fCancelarModificacionPase();

              }
              mostrarMensaje(2, scope.etiquetas.msgPreguntaCancelarModificacion, fAceptoCancelacion);
          });
          this.btnEliminarPase.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fEliminarPase();
              }
              mostrarMensaje(2, scope.etiquetas.msgPreguntaEliminacion, fAcepto);
          });
          this.btnDuplicarPase.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fInvertirDuplicarPase(false);
              }
              mostrarMensaje(2, scope.etiquetas.msgPreguntaDuplicar, fAcepto);
          });
          this.btnInvertirPase.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fInvertirDuplicarPase(true);
              }
              mostrarMensaje(2, scope.etiquetas.msgPreguntaInvertir, fAcepto);
          });
          this.btnCerrarwComprobante.on('click', function () {
              scope.fAccionEnButtonsPorEstado(false);
              scope.fCloseWindow();
          });
          this.btnAnular.on('click', function () {
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fAnularComprobante();
              }
              mostrarMensaje(2, scope.etiquetas.msgfAnularComprobante, fAcepto);
          });
          this.btnNuevoComprobante.on('click', function (component) {
              scope.fNuevoComprobante();
          });

          /*this.btnEliminarComprobante.on('click', function(component)
           {
           scope.fEliminarComprobante(scope.idComprobante);
           });*/
          this.btnDuplicarComprobante.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fInvertirDuplicarComprobante(false);
                  else
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              }
              scope.fAccionEnButtonsPorEstado(false);
              mostrarMensaje(2, scope.etiquetas.msgPreguntaDuplicarComprobante, fAcepto);
          });
          this.btnInvertirComprobante.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fInvertirDuplicarComprobante(true);
                  else
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              }
              scope.fAccionEnButtonsPorEstado(false);
              mostrarMensaje(2, scope.etiquetas.msgPreguntaInvertirComprobante, fAcepto);
          });
          this.btnCambiarEstado.on('click', function (component) {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                      scope.fCambiarEstadoComprobante();
                  else
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              }
              scope.fAccionEnButtonsPorEstado(false);
              mostrarMensaje(2, scope.etiquetas.msgPreguntaCambiarEstadoComprobante, fAcepto);
          });
          /* this.btnCambiarNum.on('click', function(component)
           {
           function fAcepto(btn)
           {
           if (btn == 'ok')
           scope.fCambiarNumeroComprobante(scope.numeroComprobante, scope.idComprobante);
           else
           scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
           }
           scope.fAccionEnButtonsPorEstado(false);
           mostrarMensaje(2, scope.etiquetas.msgPreguntaCambiarNumeroComprobante, fAcepto);
           });*/
          this.btnVistaReporte.on('click', function (component) {
              if(!document.getElementById('SCFPrintView'))
                  scope.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintView", 'SCFPrintView');
              scope.fObtenerDatosImprimirReporte(new Array({
                  idcomprobante: scope.idComprobante,
                  idestructurae: scope.idEstructurae,
                  idEstadoComprobante: scope.estadoComprobante,
                  typeAction: 'report'
              }), 'report');
          });
          this.btnExportar.on('click', function (component) {
              if(!document.getElementById('SCFPrintView'))
                  // scope.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData.min", 'SCFPrintData');
                  scope.loadJs("/contabilidad/comun/SCFPrintView/views/js/SCFPrintData", 'SCFPrintData');
              scope.fObtenerDatosImprimirReporte(new Array({
                  idcomprobante: scope.idComprobante,
                  idestructurae: scope.idEstructurae,
                  idEstadoComprobante: scope.estadoComprobante,
                  typeAction: 'export'
              }), 'export');
          });
          if(this.tipoComprobante != 1 && this.btnAddModelo)
              this.btnAddModelo.on('click', function () {
                  if(scope.cbxDocumento.isValid() && scope.tfNumeroDocumento.isValid() && scope.cbxMoneda.isValid()) {
                      var index = scope.stOperacion.find('idoperacion', scope.cbxOperacion.getValue());
                      scope.fLoadModeloContable(scope.stOperacion.getAt(index).data.idmodelo, scope.stOperacion.getAt(index).data.iddocumento);
                  }
              });
          if(this.tipoComprobante != 1 && this.stOperacion)
              this.stOperacion.on({
                  'load': function (store, record, options) {
                      if(options.params.idSubsistema) {
                          if(store.getTotalCount() > 0) {
                              scope.fStateOnComponent(scope.cbxOperacion, true);
                          } else {
                              mostrarMensaje(1, String.format('No existen operaciones configuradas para el subsistema {0}.', scope.cbxSubsistema.getRawValue()), function () {
                                  scope.fStateOnComponent(scope.cbxOperacion, false);
                              });
                          }
                      }
                  }
              });
      },
      initializeFunctions: function (scope) {
          this.fActionOnButtonsComprobante = function (data)
          {
              this.comprobanteEditable = false;
              this.tfDetalle.readOnly = true;
              this.taDescripcion.readOnly = true;
              this.dfFecha.disable();
              if((scope.creadoEnContabilidad * 1) >= 1) {
                  this.dfFecha.setMaxValue(null);
                  this.dfFecha.setMinValue(null);
              } else {
                  // this.dfFecha.setMinValue(data.Fecha);
                  // this.dfFecha.setMaxValue(data.Fecha);
              }
              this.fpContainerRegionNorth.hide();
              this.globalNorth.setHeight(160);
              this.wComprobante.doLayout(true);
          };

          this.fDeleteComponents = function ()
          {
              scope.recordLastComponent = null;
              /* if (scope.tipoComprobante > 1)
               if (scope.frmPanel.getComponent(0).items.length > 0)
               scope.classDesglose.deleteComponent(scope.frmPanel.getComponent(0), scope.frmPanel.getComponent(0).getComponent(0));*/
          };

          this.fDisabledNumberField = function (flag)
          {
              if(flag)
              {
                  scope.nfDebito.setValue(null);
                  scope.nfCredito.setValue(null);
                  // if(scope.btnAceptarPase.isVisible()) {
                  //     scope.btnAceptarPase.disable();
                  // } else {
                  //     scope.btnGuardarPase.disable();
                  // }
              } else if(scope.fpContainerTopNorth.getForm().isValid(true) && scope.fpContainerRegionNorth.getForm().isValid(true) && !scope.btnAceptarPase.disabled) {
                  if(scope.nfCredito.getValue().length == 0 && scope.nfDebito.getValue().length == 0) {
                      if(scope.btnAceptarPase.isVisible()) {
                          scope.btnAceptarPase.disable();
                      } else {
                          scope.btnGuardarPase.disable();
                      }
                  } else {
                      if(scope.btnAceptarPase.isVisible()) {
                          scope.btnAceptarPase.enable();
                      } else {
                          scope.btnGuardarPase.enable();
                      }
                  }
              }
          };

          this.fSetActionNumberField = function (numberField, flag)
          {
              numberField.clearInvalid();
              if(!flag)
                  numberField.setValue(null);
          };

          this.fEnableComponentByContent = function (component, store, records, flag)
          {
              component.clearInvalid();
              component.enable();
              if(flag)
                  component.clearValue();
              if(records.length == 0)
              {
                  component.markInvalid();
                  store.removeAll();
              }
              scope.lMask.hide();
          };

          this.fStateOnComponent = function (component, flag, displayText)
          {
              if(flag)
                  component.enable();
              else
                  component.disable();
              if(displayText != undefined)
                  component.setRawValue(displayText);
              else
                  component.clearValue();
              component.clearInvalid();
          };

          this.fAfterSelectObjeto = function (idObjeto)
          {
              scope.lMask.show();
              Ext.Ajax.request({
                  method: "POST",
                  params: {
                      idObjeto: idObjeto,
                      idSubsistema: scope.cbxSubsistema.getValue(),
                      tipoComprobante: scope.tipoComprobante
                  },
                  url: scope.url + "loadDataAfterSelectObjeto",
                  callback: function (options, success, response)
                  {
                      responseData = Ext.decode(response.responseText);
                      scope.fStateOnComponent(scope.cbxOperacion, true);
                      scope.fStateOnComponent(scope.cbxCuenta, true);

                      scope.tfNumeroDocumento.clearInvalid();

                      if(responseData.Operaciones.length > 0)
                          scope.stOperacion.loadData(responseData.Operaciones);
                      else
                      {
                          mostrarMensaje(1, scope.etiquetas.msgNoOperacion, function () {
                          });
                          scope.cbxOperacion.markInvalid(scope.etiquetas.markInvalidOperaciones);
                          scope.stOperacion.removeAll();
                      }
                      if(responseData.Cuentas.length > 0)
                          scope.stCuenta.loadData(responseData.Cuentas);
                      else
                      {
                          mostrarMensaje(1, scope.etiquetas.msgNoCuenta, function () {
                          });
                          scope.cbxCuenta.markInvalid(scope.etiquetas.markInvalidCuentas);
                          scope.stCuenta.removeAll();
                      }
                      scope.lMask.hide();
                  }
              });
          };

          this.fGestionaCuentas = function ()
          {
              if(scope.nfCredito.getValue() || scope.nfDebito.getValue())
              {
                  // scope.btnAceptarPase.disable();
                  if(scope.btnCancelarModificacionPase.hidden)
                      scope.fObtengoCuentasAnalizar();
                  else
                      scope.fEnvioModificacionPase();
              } else
              {
                  mostrarMensaje(1, scope.etiquetas.lbInvalidForm);
                  scope.nfDebito.markInvalid(scope.etiquetas.markInvalid);
                  scope.nfCredito.markInvalid(scope.etiquetas.markInvalid);
              }
          };

          this.fObtengoCuentasAnalizar = function ()
          {
              //partida 0 cuenta pase
              //partida 1 cuenta operacion contra partida
              //partida 2 cuenta operacion contabilidad adicional
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              scope.arrayCuentasParaPase = new Array();
              scope.arrayCuentasAnalizar = new Array();
              scope.arrayCuentasAnalizar.push({
                  partida: 0,
                  idcuenta: scope.recordLastComponent.data.idcuenta,
                  gasto: scope.recordLastComponent.data.gasto,
                  text: scope.recordLastComponent.data.text,
                  credito: (scope.nfCredito.getValue()) ? true : false,
                  importe: (scope.nfCredito.getValue()) ? scope.nfCredito.getValue() : scope.nfDebito.getValue(),
                  porciento: '100',
                  anexo: new Array()
              });
              /*if (scope.tipoComprobante == 3)
               {
               Ext.Ajax.request({
               url: scope.url + 'obtenerContabilidadAdicional',
               params: {
               idoperacion: scope.cbxOperacion.getValue()
               },
               callback: function(options, success, response) {
               responseData = Ext.decode(response.responseText);
               if (responseData.result.length > 0)
               scope.arrayCuentasAnalizar = scope.arrayCuentasAnalizar.concat(responseData.result);
               scope.fAnalisisCuenta();
               }
               });
               } else*/
              scope.fAnalisisCuenta();
          };

          this.fAnalisisCuenta = function ()
          {
              if(scope.arrayCuentasAnalizar.length > 0)
                  scope.fAceptarPase(scope.arrayCuentasAnalizar.splice(0, 1)[0]);
              else
                  scope.fEnviarInformacionConstruirPase();
          };

          this.fListenersEventsAnexo = function (cuenta, flagModificar)
          {
              scope.ClassAnexoGasto.addListener('sendingData', function (listValues, importe, updateImporte, flagCredito) {
                  if(!flagModificar)
                  {
                      if(updateImporte)
                      {
                          if(flagCredito)
                          {
                              scope.nfCredito.setValue(importe);
                              scope.nfCredito.focus(true, 10);
                          } else
                          {
                              scope.nfDebito.setValue(importe);
                              scope.nfDebito.focus(true, 10);
                          }
                          cuenta.importe = importe;
                      }
                      if(listValues.length > 0)
                      {
                          if(cuenta.partida > 0)
                              cuenta.importe = importe;
                          cuenta.anexo = listValues;
                      }
                      scope.arrayCuentasParaPase.push(cuenta);

                      scope.fAnalisisCuenta();
                  } else
                      scope.fModificarGastoAnexo(cuenta, listValues);
              }, this);

              scope.ClassAnexoGasto.addListener('close', function () {
                  scope.btnAceptarPase.enable();
                  scope.cbxCuenta.focus();
              });
          };

          this.fModificarGastoAnexo = function (objPase, listValues)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              Ext.Ajax.request({
                  url: scope.url + 'modificarGastoAnexo',
                  params: {
                      idmoneda: objPase.idmoneda,
                      idtasa: objPase.idtasa,
                      signo: (objPase.credito) ? -1 : 1,
                      idPase: objPase.idpase,
                      desgloseGasto: Ext.encode(listValues)
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag)
                          scope.fCargarPases();
                  }
              });
          };

          this.fAceptarPase = function (cuenta)
          {
              if(cuenta.gasto == 8032 || cuenta.gasto == 8034)
              {
                  Ext.CONT.Componentes.MessageBox('msgbIniciando');
                  Ext.Ajax.request({
                      url: scope.url + 'verificarCtaEnConcepto',
                      params: {
                          idcuenta: cuenta.idcuenta
                      },
                      callback: function (options, success, response) {
                          responseData = Ext.decode(response.responseText);
                          creditoOriginal = (scope.nfCredito.getValue()) ? true : false;
                          importeOriginal = (scope.nfCredito.getValue()) ? scope.nfCredito.getValue() : scope.nfDebito.getValue();
                          scope.ClassAnexoGasto = new Ext.ClassAnexoGasto(scope.GpAnotaciones.getEl().dom, true, cuenta.gasto, cuenta.idcuenta, cuenta.text, cuenta.partida, cuenta.credito, cuenta.porciento, responseData.flag, importeOriginal, creditoOriginal, {});
                          scope.fListenersEventsAnexo(cuenta, false);
                      }
                  });
              } else
              {
                  if(cuenta.partida > 0)
                  {
                      cuenta.importe = (parseFloat((scope.nfCredito.getValue()) ? scope.nfCredito.getValue() : scope.nfDebito.getValue()) * parseFloat(cuenta.porciento).toFixed(2)) / 100;
                      if(!cuenta.credito)
                          cuenta.importe *= -1;
                  }
                  scope.arrayCuentasParaPase.push(cuenta);
                  scope.fAnalisisCuenta();
              }
          };

          this.fEnviarInformacionConstruirPase = function ()
          {
              params = {
                  tipoComprobante: scope.tipoComprobante,
                  detalle: scope.tfDetalle.getValue(),
                  fecha: scope.dfFecha.getRawValue(),
                  observacion: scope.taDescripcion.getValue(),
                  idMoneda: scope.cbxMoneda.getValue(),
                  idTasa: scope.cbxTasa.getValue(),
                  tasa: scope.cbxTasa.getRawValue(),
                  fConversion: scope.txtFactorConversion.getValue(),
                  pases: Ext.encode(scope.arrayCuentasParaPase)
              };
              // if(scope.tipoComprobante == 3)
              // {
                  params.idSubsistema = scope.cbxSubsistema.getValue();
                  params.idOperacion = scope.cbxOperacion.getValue();
                  params.idDocumento = scope.cbxDocumento.getValue();
                  params.codigoDocumentoPrimario = scope.tfNumeroDocumento.getValue();
              // }

              if(scope.idComprobante == undefined)
                  this.fGuardarComprobante(params);
              else
                  this.fGuardarAnotacionContable(params);
          };

          this.fEnvioModificacionPase = function ()
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              record = this.GpAnotaciones.getSelectionModel().getSelected();
              params = {
                  idPase: record.data.idpase,
                  tipoComprobante: scope.tipoComprobante,
                  idMoneda: scope.cbxMoneda.getValue(),
                  idTasa: scope.cbxTasa.getValue(),
                  tasa: scope.cbxTasa.getRawValue(),
                  fConversion: scope.txtFactorConversion.getValue(),
                  signo: (scope.nfCredito.getValue()) ? -1 : 1,
                  importe: ((scope.nfCredito.getValue()) ? scope.nfCredito.getValue() : scope.nfDebito.getValue())
              };
              if(scope.cbxCuenta.getValue()) {
                  params.idCuenta = scope.cbxCuenta.getValue();
              }
              if(scope.tipoComprobante == 3)
              {
                  params.idDocumento = scope.cbxDocumento.getValue();
                  params.codigoDocumentoPrimario = scope.tfNumeroDocumento.getValue();
              }
              Ext.Ajax.request({
                  url: scope.url + 'modificarPase',
                  params: params,
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      if(Ext.getCmp('msgbIniciando'))
                          Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(scope.accion == 2) {
                          scope.reloadGridRegistroComprobantes = true;
                      }
                      scope.fCancelarModificacionPase();
                      if(responseData.flag == 'true' || responseData.flag == true) {
                          scope.fCargarPases();
                      } else if (responseData.cod == -1) {
                          mostrarMensaje(1, 'La cuenta esta inactiva.');
                      }
                  }
              });
          };

          this.fGuardarComprobante = function (params)
          {
              Ext.Ajax.request({
                  url: scope.url + 'guardarComprobante',
                  params: params,
                  autoAbort: true,
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      if(Ext.getCmp('msgbIniciando'))
                          Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.numComprobante)
                      {
                          scope.idComprobante = responseData.idComprobante;

                          if(scope.tipoComprobante == 3)
                          {
                              scope.cbxSubsistema.disable();
//                                    scope.cbxObjeto.disable();
                          }
                          scope.reloadGridRegistroComprobantes = true;
                          scope.idAsiento = responseData.idAsiento;
                          scope.numeroComprobante = responseData.numComprobante;
                          scope.idEstructurae = responseData.idEstructurae;
                          scope.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(), true);

                          scope.fActualizarVariablesListenersChange();

                          scope.fCargarPases();
                          mostrarMensaje(1, scope.etiquetas.msgRegistroComprobante + " <b>" + responseData.numComprobante + "</b>" + scope.etiquetas.msgRegistroComprobantes);
                          //scope.aqui va ..(scope.GpAnotaciones.getEl().dom, 'Informaci&oacute;n', scope.etiquetas.msgRegistroComprobante + " <b>" + responseData.numComprobante + "</b>" + scope.etiquetas.msgRegistroComprobantes, 1);
                          scope.cbxCuenta.focus();
                      } else if (responseData.cod == -1) {
                          mostrarMensaje(1, 'La cuenta esta inactiva.');
                      } else {
                          mostrarMensaje(1, scope.etiquetas.msgErrorCrearComprobante);
                      }
                      //  scope.aqui va ..(scope.GpAnotaciones.getEl().dom, 'Informaci&oacute;n', scope.etiquetas.msgErrorCrearComprobante, 2);
                  }
              });
          };

          this.fGuardarAnotacionContable = function (params)
          {
              if(scope.tfNumeroDocumento) {
                  if(scope.tfNumeroDocumento.isDirty() || scope.cbxDocumento.isDirty()) {
                      scope.idAsiento = null;
                  }
              }
              params.idAsiento = scope.idAsiento;
              params.idComprobante = scope.idComprobante;

              Ext.Ajax.request({
                  url: scope.url + 'guardarAnotacionContable',
                  params: params,
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      scope.reloadGridRegistroComprobantes = true;
                      if(Ext.getCmp('msgbIniciando'))
                          Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.save || responseData.save == 'true') {
                          scope.fCargarPases();
                          scope.cbxCuenta.reset();
                          scope.nfDebito.reset();
                          scope.nfCredito.reset();
                          scope.cbxCuenta.focus();
                          scope.cbxCuenta.expand();
                      } else if (responseData.cod == -1) {
                          mostrarMensaje(1, 'La cuenta esta inactiva.');
                      } else {
                          mostrarMensaje(1, scope.etiquetas.msgErrorCrearAnotacion);
                      }
                  }
              });
          };

          this.fCargarPases = function ()
          {
              scope.fAccionEnButtonsPorEstado();//cada ves que carge los pases oculta to los botones
              scope.lMaskGrid = Ext.windowComprobante.loadMask(scope, scope.GpAnotaciones.body, scope.etiquetas.lMask);
              scope.lMaskGrid.show();
              scope.btnAceptarPase.enable();
              scope.stGpAnotaciones.load({
                  params: {
                      idComprobante: scope.idComprobante
                  },
                  callback: function () {
                      scope.cbxOperacion.setValue(scope.stGpAnotaciones.getAt(0).data.idOperacion);
                      scope.stDocumento.load({
                          params: {
                              idDocumento: scope.stGpAnotaciones.getAt(0).data.idDocumento
                          },
                          callback: function ()
                          {
                              scope.cbxDocumento.setValue(scope.stGpAnotaciones.getAt(0).data.idDocumento);

                          }
                      });
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
                  }
              });
          };

          this.fToggleVisibleBtnDesgloseAnexo = function (record)
          {
              if(record.data.anexo)
                  scope.btnVerPase.show();
              else
                  scope.btnVerPase.hide();
          };

          this.fToggleVisibleBtnEliminar = function (record)
          {
              count = this.stGpAnotaciones.getCount();
              if(this.fGeneraContabilidadAdicional(record, count) || count == 1)
                  this.btnEliminarPase.hide();
              else
                  this.btnEliminarPase.show();
          };

          this.fGeneraContabilidadAdicional = function (record, count)
          {
              for(var i = 0; i < count; i ++)
                  if(this.stGpAnotaciones.getAt(i).data.paseadicional > 0 && this.stGpAnotaciones.getAt(i).data.idpasegenara == record.data.idpase)
                      return true;
              return false;
          };

          this.fAbrirDesgloseRegistroAnexo = function ()
          {
              selectionModel = scope.GpAnotaciones.getSelectionModel();
              if(selectionModel.hasSelection())
              {
                  record = selectionModel.getSelected();
                  Ext.CONT.Componentes.MessageBox('msgbIniciando');
                  Ext.Ajax.request({
                      url: scope.url + 'verificarCtaEnConcepto',
                      params: {
                          idcuenta: record.data.idcuenta
                      },
                      callback: function (options, success, response) {
                          responseData = Ext.decode(response.responseText);
                          if(parseFloat(record.data.paseadicional) > 0)
                          {
                              recordPaseGenera = scope.stGpAnotaciones.getAt(scope.stGpAnotaciones.find('idpase', record.data.idpasegenara));
                              importeOriginal = (recordPaseGenera.data.credito) ? recordPaseGenera.data.credito : recordPaseGenera.data.debito;
                              creditoOriginal = (recordPaseGenera.data.credito) ? true : false;
                          } else
                          {
                              importeOriginal = (record.data.credito) ? record.data.credito : record.data.debito;
                              creditoOriginal = (record.data.credito) ? true : false;
                          }
                          credito = (record.data.credito) ? true : false;
                          scope.ClassAnexoGasto = new Ext.ClassAnexoGasto(scope.GpAnotaciones.getEl().dom, scope.comprobanteEditable, record.data.gasto, record.data.idcuenta, responseData.textCuenta, record.data.idpasegenara, credito, record.data.porciento, responseData.flag, importeOriginal, creditoOriginal, {
                              idcuenta: record.data.idcuenta,
                              idpase: record.data.idpase
                          });
                          scope.fListenersEventsAnexo(record.data, true);
                      }
                  });
              }
          };

          this.fModificarPase = function ()
          {
              record = this.GpAnotaciones.getSelectionModel().getSelected();
              indexMoneda = this.stMoneda.find('idmoneda', record.data.idmoneda);
              dataMoneda = this.stMoneda.getAt(indexMoneda).data;
              this.lMask.show();
              this.fpContainerTopNorth.disable();
              this.fpContainerRegionNorth.getComponent(0).disable();
              this.cbxCuenta.reset();
              this.btnAceptarPase.enable();
              this.GpAnotaciones.getSelectionModel().lock();
              if(this.tipoComprobante > 1)
              {
//                        this.frmPanel.disable();
                  this.fDeleteComponents();
                  if(this.tipoComprobante > 2)
                  {
                      this.cbxOperacion.reset();
                      this.cbxCuenta.reset();
                      this.cbxOperacion.setRawValue(this.etiquetas.textSeleccione);
                      this.cbxCuenta.setRawValue(this.etiquetas.textSeleccione);
                      scope.stDocumento.load({
                          params: {
                              idDocumento: record.data.idDocumento
                          },
                          callback: function ()
                          {
                              scope.cbxDocumento.setValue(record.data.idDocumento);
                              scope.tfNumeroDocumento.setValue(record.data.codigodocumentoprimario);
                          }
                      });
                  }
              }
              this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(), false);
              this.tbGpAnotaciones.hide();
              this.stTasa.load({
                  params: {
                      idMoneda: dataMoneda.idmoneda
                  },
                  callback: function ()
                  {
                      indexTasa = scope.stTasa.find('idtasa', record.data.idtasa);
                      dataTasa = scope.stTasa.getAt(indexTasa).data;
                      scope.cbxMoneda.setValue(dataMoneda.idmoneda);
                      scope.cbxTasa.setValue(record.data.idtasa);
                      scope.txtFactorConversion.setValue(dataTasa.factordeconversion);
                  }
              });
              this.nfDebito.reset();
              this.nfCredito.reset();
              if(record.data.credito)
                  this.nfCredito.setValue(record.data.credito);
              else
                  this.nfDebito.setValue(record.data.debito);
//              this.btnAceptarPase.setText(this.etiquetas.btnGuardar);
              this.btnAceptarPase.hide();
              this.btnGuardarPase.enable();
              this.btnGuardarPase.show();
              this.btnCancelarModificacionPase.show();
          };

          this.fCancelarModificacionPase = function ()
          {
              scope.GpAnotaciones.getSelectionModel().unlock();
              scope.btnCancelarModificacionPase.hide();
//              scope.btnAceptarPase.setText(scope.etiquetas.btnAdicionar);
              scope.btnAceptarPase.show();
              scope.btnGuardarPase.disable();
              scope.btnGuardarPase.hide();
              scope.fpContainerTopNorth.enable();
              scope.fpContainerRegionNorth.getComponent(0).enable();
//                    if (scope.tipoComprobante > 1)
//                    {
//                        scope.frmPanel.enable();
//                        if (scope.tipoComprobante > 2)
//                        {
//                            scope.cbxDocumento.disable();
              scope.cbxDocumento.setRawValue(scope.etiquetas.textSeleccioneOperacion);
              scope.tfNumeroDocumento.reset();
              scope.tfNumeroDocumento.clearInvalid();
//                        }
//                    }
//               scope.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(), true);
              scope.tbGpAnotaciones.show();
              scope.cbxMoneda.reset();
//                    scope.cbxMoneda.fireEvent('select', scope.cbxMoneda, scope.stMoneda.getAt(0), 0);
              scope.nfDebito.reset();
              scope.nfCredito.reset();
          };

          this.fEliminarPase = function ()
          {
              scope.tbGpAnotaciones.hide();
              scope.lMaskEliminarPase = Ext.windowComprobante.loadMask(scope, scope.GpAnotaciones.body, scope.etiquetas.lMaskEliminarPase);
              scope.lMaskEliminarPase.show();
              record = this.GpAnotaciones.getSelectionModel().getSelections();
              var arrayIdPase = [];
              for (var i = 0; i < record.length; i++) {
                  arrayIdPase.push(record[i].data.idpase);
              }

              Ext.Ajax.request({
                  url: scope.url + 'eliminarPase',
                  params: {
                      arrayIdPase: Ext.encode(arrayIdPase)
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      scope.lMaskEliminarPase.hide();
                      if(scope.accion == 2)
                          scope.reloadGridRegistroComprobantes = true;
                      if(responseData.flag == true || responseData.flag == 'true')
                          scope.fCargarPases();
                      else
                      {
                          mostrarMensaje(1, scope.etiquetas.msgErrorEliminarAnotacion);
                          //scope.aqui va ..(scope.GpAnotaciones.getEl().dom, 'Error', scope.etiquetas.msgErrorEliminarAnotacion, 2);
                          scope.tbGpAnotaciones.show();
                      }

                  }
              });
          };
          //
          // this.fEliminarPase = function ()
          // {
          //     scope.tbGpAnotaciones.hide();
          //     scope.lMaskEliminarPase = Ext.windowComprobante.loadMask(scope, scope.GpAnotaciones.body, scope.etiquetas.lMaskEliminarPase);
          //     scope.lMaskEliminarPase.show();
          //     record = this.GpAnotaciones.getSelectionModel().getSelected();
          //     Ext.Ajax.request({
          //         url: scope.url + 'eliminarPase',
          //         params: {
          //             idPase: record.data.idpase
          //         },
          //         callback: function (options, success, response) {
          //             responseData = Ext.decode(response.responseText);
          //             scope.lMaskEliminarPase.hide();
          //             if(scope.accion == 2)
          //                 scope.reloadGridRegistroComprobantes = true;
          //             if(responseData.flag == true || responseData.flag == 'true')
          //                 scope.fCargarPases();
          //             else
          //             {
          //                 mostrarMensaje(1, scope.etiquetas.msgErrorEliminarAnotacion);
          //                 //scope.aqui va ..(scope.GpAnotaciones.getEl().dom, 'Error', scope.etiquetas.msgErrorEliminarAnotacion, 2);
          //                 scope.tbGpAnotaciones.show();
          //             }
          //
          //         }
          //     });
          // };

          this.RowClick = function (sm, indiceFila, record) {
              var arreglocant = sm.getSelections();
              scope.btnModificarPase.setDisabled(arreglocant.length !== 1);
              scope.btnInvertirPase.setDisabled(arreglocant.length !== 1);
              scope.btnDuplicarPase.setDisabled(arreglocant.length !== 1);
              scope.btnEliminarPase.setDisabled(arreglocant.length === 0);
          };

          this.fInvertirDuplicarPase = function (flag)
          {
              scope.tbGpAnotaciones.hide();
              scope.lMaskInvertirDuplicarPase = Ext.windowComprobante.loadMask(scope, scope.GpAnotaciones.body, (flag) ? scope.etiquetas.lMaskInvertirPase : scope.etiquetas.lMaskDuplicarPase);
              scope.lMaskInvertirDuplicarPase.show();
              record = this.GpAnotaciones.getSelectionModel().getSelected();
              Ext.Ajax.request({
                  url: scope.url + 'invertirDuplicarPase',
                  params: {
                      idPase: record.data.idpase,
                      flag: flag,
                      arrayIdPaseAdicional: Ext.encode(this.fObtenerPasesContabilidadAdicional(record.data))
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      scope.lMaskInvertirDuplicarPase.hide();
                      if(scope.accion == 2)
                          scope.reloadGridRegistroComprobantes = true;
                      if(responseData.flag == true || responseData.flag == 'true')
                          scope.fCargarPases();
                      else
                      {
                          mostrarMensaje(1, (flag) ? scope.etiquetas.msgErrorInvertirAnotacion : scope.etiquetas.msgErrorDuplicarAnotacion);
                          scope.tbGpAnotaciones.show();
                      }
                  }
              });
          };

          this.fObtenerPasesContabilidadAdicional = function (objPase)
          {
              result = new Array();
              if(this.tipoComprobante == 3)
              {
                  count = this.stGpAnotaciones.getCount();
                  for(var i = 0; i < count; i ++)
                      if(this.stGpAnotaciones.getAt(i).data.paseadicional > 0 && this.stGpAnotaciones.getAt(i).data.idpasegenara == objPase.idpase)
                          result.push(this.stGpAnotaciones.getAt(i).data.idpase);
              }
              return result;
          };

          this.fIsPosicionOut = function (listButtons, listOut, flag, pos)
          {
              for(var j = 0; j < listOut.length; j ++)
                  if(pos == listOut[j])
                  {
                      listButtons[pos].setVisible((flag) ? false : true);
                      return true;
                  }
              return false;
          };

          this.fGetButtonsSetVisible = function (listButtons, listOut, flag)
          {
              for(var i = 0; i < listButtons.length; i ++)
                  if(!this.fIsPosicionOut(listButtons, listOut, flag, i)) {
                      listButtons[i].setVisible(flag);
                  }
          };

          this.fAccionEnButtonsPorEstado = function (visible, idEstadoComprobante)
          {
              //8030 SIN ERROR
              //8031 TERMINADO
              //8032 ASENTADO
              //8033 CON ERROR
              //8034 ANULADO
              if(!visible)
                  scope.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(), visible);
              else
              {
                  if(!this.comprobanteBlock)
                  {
                      if(scope.idComprobante != undefined)
                      {
                          if(idEstadoComprobante == 8030 || idEstadoComprobante == 8031)
                          {
                              if((scope.creadoEnContabilidad * 1) < 1)
                                  //this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 6, 7), false);
                                  this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 3, 7), false);
                              else
                                  this.fGetButtonsSetVisible(scope.wComprobante.buttons, new Array(0, 1, 2, 5, 6, 7), false);
                          } else if(idEstadoComprobante == 8032)
                          {
                              if((scope.creadoEnContabilidad * 1) < 1)
                                  this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 3, 7], false);
                              else
                                  this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 3, 4, 5, 7], false);
                          } else if(idEstadoComprobante == 8033) {
                              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 6, 7], false);
                              // this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                          } else if(idEstadoComprobante == 8034) {
                              this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 7], false);
                          }
                      } else
                          this.fGetButtonsSetVisible(scope.wComprobante.buttons, [7], false);
                  } else
                      this.fGetButtonsSetVisible(scope.wComprobante.buttons, [0, 1, 7], false);
              }
          };

          this.fIsValidContainer = function (containerItems)
          {
              valid = true;
              itemsLength = containerItems.length;
              for(var i = 0; i < itemsLength; i ++)
                  if(i < (itemsLength - 2) && (containerItems[i].items.getXType() == 'combo' || containerItems[i].items.getXType() == 'textfield' || containerItems[i].items.getXType() == 'numberfield'))
                      if(!containerItems[i].items.isValid(true))
                          valid = false;
              return valid;
          };

          this.fGetDataChangeComprobanteTopPanel = function ()
          {
              params = {
                  idComprobante: scope.idComprobante,
                  detalle: undefined,
                  observacion: undefined,
                  fecha: undefined
              };
              if(scope.detalle != scope.tfDetalle.getValue() && scope.tfDetalle.isValid(true))
                  params.detalle = scope.tfDetalle.getValue();
              if(scope.observacion != scope.taDescripcion.getValue() && scope.taDescripcion.isValid(true))
                  params.observacion = scope.taDescripcion.getValue();
              if(scope.fecha != scope.dfFecha.getRawValue() && scope.dfFecha.isValid(true))
                  params.fecha = scope.dfFecha.getRawValue();
              return params;
          };

          this.fIsDirtyComprobanteTopPanel = function (params)
          {
              if(params.detalle != undefined || params.observacion != undefined || params.fecha != undefined)
              {
                  scope.lMaskTopPanel = Ext.windowComprobante.loadMask(scope, scope.fpContainerTopNorth.body, 'Guardando cambios...');
                  return true;
              } else
                  return false;
          };

          this.fCloseWindow = function ()
          {
              params = scope.fGetDataChangeComprobanteTopPanel();
              if(scope.fIsDirtyComprobanteTopPanel(params) && scope.idComprobante != undefined && this.comprobanteEditable)
              {
                  if(scope.fpContainerTopNorth.getForm().isValid(true))
                  {
                      scope.lMaskTopPanel.show();
                      Ext.Ajax.request({
                          url: scope.url + 'actualizarCambiosEnComprobante',
                          params: params,
                          callback: function (options, success, response) {
                              responseData = Ext.decode(response.responseText);
                              scope.lMaskTopPanel.hide();
                              scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
                              if(responseData.flag == true || responseData.flag == 'true')
                              {
                                  scope.fActualizarVariablesListenersChange();
                                  scope.reloadGridRegistroComprobantes = true;
                                  scope.fCloseWindowAndUnBlock();
                              } else
                                  mostrarMensaje(1, scope.etiquetas.msgErrorGuardarCambios);
                          }
                      });
                  } else
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              } else
                  scope.fCloseWindowAndUnBlock();
          };

          this.fActualizarVariablesListenersChange = function ()
          {
              scope.detalle = scope.tfDetalle.getValue();
              scope.observacion = scope.taDescripcion.getValue();
              scope.fecha = scope.dfFecha.getRawValue();
          };

          this.fCloseWindowAndUnBlock = function ()
          {
              if(!this.comprobanteBlock && this.idComprobante != undefined)
              {
                  Ext.CONT.Componentes.MessageBox('msgbIniciando');
                  Ext.Ajax.request({
                      url: scope.url + 'desbloquearComprobante',
                      params: {
                          idComprobante: scope.idComprobante
                      },
                      callback: function (options, success, response) {
                          responseData = Ext.decode(response.responseText);
                          Ext.CONT.Componentes.HideBox('msgbIniciando');
                          if(responseData.flag == true || responseData.flag == 'true')
                          {
                              scope.fireEvent('closeUIComprobante', scope.accion, scope.reloadGridRegistroComprobantes);
                              scope.wComprobante.close();
                          } else
                              mostrarMensaje(1, scope.etiquetas.msgErrorCerrarComprobante);
                      }
                  });
              } else
              {
                  scope.fireEvent('closeUIComprobante', scope.accion, scope.reloadGridRegistroComprobantes);
                  scope.wComprobante.close();
              }
          };

          this.fNuevoComprobante = function ()
          {
              scope.fAccionEnButtonsPorEstado(false);
              scope.wComprobante.close();
              new Ext.ClassComprobante({
                  accion: 1,
                  tipoComprobante: scope.tipoComprobante,
                  idSubsistema: scope.idSubsistema
              });

          };

          this.fEliminarComprobante = function (idComprobante)
          {
              function fAcepto(btn)
              {
                  if(btn == 'ok')
                  {
                      Ext.CONT.Componentes.MessageBox('msgbIniciando');
                      Ext.Ajax.request({
                          url: scope.url + 'eliminarComprobantes',
                          params: {
                              idComprobantes: Ext.encode(new Array(idComprobante))
                          },
                          callback: function (options, success, response) {
                              responseData = Ext.decode(response.responseText);
                              Ext.CONT.Componentes.HideBox('msgbIniciando');
                              if(responseData.flag == false || responseData.flag == 'false')
                              {
                                  scope.wComprobante.close();
                                  scope.fireEvent('closeUIComprobante', scope.accion, (scope.accion == 2) ? true : false);
                              } else
                              {
                                  scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
                                  if((responseData.flag == true || responseData.flag == 'true') && responseData.Comprobantes.length > 0)
                                      mostrarMensaje(1, scope.etiquetas.msgComprobanteBloqueado1 + responseData.Comprobantes[0].Usuario + '</b>.');
                                  else
                                      mostrarMensaje(6, scope.etiquetas.msgErrorEliminarComprobante);
                              }
                          }
                      });
                  } else
                      scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              }
              scope.fAccionEnButtonsPorEstado(false);
              mostrarMensaje(2, scope.etiquetas.msgPreguntaEliminarComprobante, fAcepto);
          };

          this.fInvertirDuplicarComprobante = function (flag)
          {
              params = scope.fGetDataChangeComprobanteTopPanel();
              if(scope.fpContainerTopNorth.getForm().isValid(true) && scope.fIsDirtyComprobanteTopPanel(params) && scope.idComprobante != undefined && this.comprobanteEditable)
              {
                  scope.lMaskTopPanel.show();
                  Ext.Ajax.request({
                      url: scope.url + 'actualizarCambiosEnComprobante',
                      params: params,
                      callback: function (options, success, response) {
                          responseData = Ext.decode(response.responseText);
                          scope.lMaskTopPanel.hide();
                          if(responseData.flag == true || responseData.flag == 'true')
                          {
                              scope.fActualizarVariablesListenersChange();
                              scope.fInvertirDuplicarAction(scope.idComprobante, flag);
                          } else
                              mostrarMensaje(1, scope.etiquetas.msgErrorGuardarCambios);
                      }
                  });
              } else
                  scope.fInvertirDuplicarAction(scope.idComprobante, flag);
          };

          this.fInvertirDuplicarAction = function (idComprobante, flag)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              Ext.Ajax.request({
                  url: scope.url + 'invertirDuplicarComprobante',
                  params: {
                      idComprobante: idComprobante,
                      flag: flag,
                      detalle: ((flag) ? scope.etiquetas.textInvertido : scope.etiquetas.textDuplicado)
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag == false || responseData.flag == 'false')
                      {
                          scope.fireEvent('closeUIComprobante', 2, true, responseData.Comprobante.idcomprobante);
                          scope.wComprobante.close();
                      } else
                      {
                          scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
                          if((responseData.flag == true || responseData.flag == 'true') && responseData.Usuario) {
                              mostrarMensaje(1, scope.etiquetas.msgComprobanteBloqueado1 + responseData.Usuario + '</b>.');
                          } else if (responseData.cod == -1) {
                              mostrarMensaje(1, 'No se puede invertir este comprobante porque existen cuentas inactivas asociadas.');
                          } else {
                              mostrarMensaje(6, (flag) ? scope.etiquetas.msgErrorInvertirComprobante : scope.etiquetas.msgErrorDuplicarComprobante);
                          }
                      }
                  }
              });
          };

          this.fCambiarEstadoComprobante = function ()
          {
              params = scope.fGetDataChangeComprobanteTopPanel();
              if(scope.fpContainerTopNorth.getForm().isValid(true) && scope.fIsDirtyComprobanteTopPanel(params) && scope.idComprobante != undefined && this.comprobanteEditable)
              {
                  scope.lMaskTopPanel.show();
                  Ext.Ajax.request({
                      url: scope.url + 'actualizarCambiosEnComprobante',
                      params: params,
                      callback: function (options, success, response) {
                          responseData = Ext.decode(response.responseText);
                          scope.lMaskTopPanel.hide();
                          if(responseData.flag == true || responseData.flag == 'true')
                          {
                              scope.fActualizarVariablesListenersChange();
                              scope.fCambiarEstadoComprobanteAction(scope.idComprobante, scope.estadoComprobante);
                          } else
                              mostrarMensaje(1, scope.etiquetas.msgErrorGuardarCambios);
                      }
                  });
              } else
                  scope.fCambiarEstadoComprobanteAction(scope.idComprobante, scope.estadoComprobante);
          };

          this.fCambiarEstadoComprobanteAction = function (idComprobante, estadoComprobante)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              var listComprobantes = new Array();
              listComprobantes.push(idComprobante);
              Ext.Ajax.request({
                  url: scope.url + 'cambiarEstadoComprobantes',
                  params: {
                      idComprobantes: Ext.encode(listComprobantes),
                      estadoComprobante: estadoComprobante
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag === false || responseData.flag === 'false')
                      {
                          scope.fireEvent('closeUIComprobante', 2, true, idComprobante);
                          scope.wComprobante.close();
                      } else
                      {
                          scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Comprobantes.length > 0)
                              mostrarMensaje(1, scope.etiquetas.msgComprobanteBloqueado1 + responseData.Comprobantes[0].Usuario + '</b>.');
                          else if (responseData.flag == 0) {
                              mostrarMensaje(1, 'La estructura no esta autorizada para asentar comprobantes.');
                          } else {
                              mostrarMensaje(1, scope.etiquetas.msgErrorCambiarEstadoComprobante);
                          }
                      }
                  }
              });
          };

          this.fCambiarNumeroComprobante = function (numeroComprobante, idComprobante)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              scope.ClassCambiarNumero = new Ext.ClassCambiarNumero({
                  numeroComprobante: numeroComprobante,
                  idComprobante: idComprobante
              });
              scope.ClassCambiarNumero.addListener('close', function (numeroComprobante)
              {
                  if(numeroComprobante != undefined)
                  {
                      scope.lbNroComprobante.setText('<b>' + numeroComprobante + '</b>', false);
                      scope.numeroComprobante = numeroComprobante;
                      if(scope.accion == 2)
                          scope.reloadGridRegistroComprobantes = true;
                  }
                  scope.fAccionEnButtonsPorEstado(true, scope.estadoComprobante);
              });
          };

          this.fObtenerDatosImprimirReporte = function (listResult, argTypeAction)
          {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              var typeAction = argTypeAction || 'report';
              if (typeAction == 'report') {
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                  scope.fOpenWindowReport({
                      datoGeneral: {
                          reporte: '100',
                          titulo: 'Comprobante de operaciones',
                          // idcomprobante: idComprobante
                      },
                      datoCuerpo: [],
                      datoParametros: [{idcomprobante: scope.idComprobante}]
                  });
              } else {
                  // Ext.Ajax.request({
                  //     timeout: 300000,
                  //     url: "/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/registrodecomprobantes/" + 'obtenerDatosImprimirReporte',
                  //     params: {
                  //         reporteParams: Ext.encode(listResult)
                  //     },
                  //     callback: function (options, success, response) {
                  //         var responseData = Ext.decode(response.responseText);
                  //         Ext.CONT.Componentes.HideBox('msgbIniciando');
                  //         if(responseData.dataSources.length > 0) {
                  //             if(typeAction == 'report') {
                  //                 scope.fOpenWindowReport({
                  //                     datoGeneral: {
                  //                         reporte: '100',
                  //                         titulo: 'Comprobante de operaciones',
                  //                         idcomprobante: scope.idComprobante
                  //                     },
                  //                     datoCuerpo: responseData.dataSources
                  //                 });
                  //             } else {
                  //                 scope.fExportComprobante({
                  //                     datoGeneral: {
                  //                         reporte: '100',
                  //                         titulo: 'Comprobante de operaciones',
                  //                         idcomprobante: scope.idComprobante
                  //                     },
                  //                     datoCuerpo: responseData.dataSources
                  //                 });
                  //             }
                  //         } else {
                  //             mostrarMensaje(1, scope.etiquetas.msgErrorCargando);
                  //         }
                  //     }
                  // });
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                  scope.fExportComprobante({
                      datoGeneral: {
                          reporte: '100',
                          titulo: 'Comprobante de operaciones',
                          idcomprobante: scope.idComprobante
                      },
                      datoCuerpo: [],
                      datoParametros: listResult
                  });

              }

          };

          this.fLoadModeloContable = function (agIdModelo, agIdDocumento) {
              Ext.CONT.Componentes.MessageBox('msgbIniciando');
              Ext.Ajax.request({
                  url: scope.url + 'loadModeloContable',
                  params: {
                      idModelo: agIdModelo,
                      idDocumento: agIdDocumento,
                      idmoneda: scope.cbxMoneda.getValue(),
                      idtasa: scope.cbxTasa.getValue(),
                      codigodocumentoprimario: scope.tfNumeroDocumento.getValue(),
                      idOperacion: scope.cbxOperacion.getValue(),
                      idSubsistema: scope.cbxSubsistema.getValue()
                  },
                  callback: function (options, success, response) {
                      var responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData) {
                          scope.fSavePaseModelo(responseData);
                      } else
                          mostrarMensaje(1, scope.etiquetas.msgErrorCargando);
                  }
              });
          };

          this.fSavePaseModelo = function (agArrPases)
          {
              var params = {
                  tipoComprobante: scope.tipoComprobante,
                  detalle: scope.tfDetalle.getValue(),
                  fecha: scope.dfFecha.getRawValue(),
                  observacion: scope.taDescripcion.getValue(),
//                        idMoneda: scope.stMoneda.getAt(scope.stMoneda.find('idmoneda', scope.cbxMoneda.getValue())).data.idmoneda,
                  idMoneda: scope.cbxMoneda.getValue(),
                  idTasa: scope.cbxTasa.getValue(),
                  tasa: scope.cbxTasa.getRawValue(),
                  fConversion: scope.txtFactorConversion.getValue(),
                  pases: Ext.encode(agArrPases)
              };
              if(scope.tipoComprobante == 3)
              {
                  params.idSubsistema = scope.cbxSubsistema.getValue();
                  params.idOperacion = scope.cbxOperacion.getValue();
                  params.idDocumento = scope.cbxDocumento.getValue();
                  params.codigoDocumentoPrimario = scope.tfNumeroDocumento.getValue();
              }
              if(scope.idComprobante == undefined) {
                  this.fValidaModeloComprobante(params);
              } else
                  this.fGuardarAnotacionContable(params);
          };

          this.fValidaModeloComprobante = function (params) {
              mostrarMensaje(2, scope.etiquetas.msgAddComprobanteModelo, fVerify);
              function fVerify(btn)
              {
                  if(btn == 'ok')
                      scope.fGuardarComprobante(params);
              }
              scope.fAccionEnButtonsPorEstado(false);
          };

          this.fOpenWindowReport = function (requestDataSources)
          {
              printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  paperSize: "FOLIO",
                  orientation: "Horizontal",
                  reportType: "HTML"
              });
              printView.show();
          };

          this.fExportComprobante = function (requestDataSources)
          {
              scope.winExportCmp = new SCFPrintData(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  reportType: "DBF",
                  typeAction: 'export'
              });
              scope.winExportCmp.show();
              scope.winExportCmp.doLayout();
          };

          this.fAnularComprobante = function () {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.lMask, scope.etiquetas.lbEsperando);
              Ext.Ajax.request({
                  url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/anularComprobante',
                  params: {
                      idComprobante: scope.idComprobante
                  },
                  callback: function (options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag === false || responseData.flag === 'false') {
                          scope.fCargarPases();
                      } else {
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Usuario)
                              mostrarMensaje(1, scope.etiquetas.msgcomprobantebloqueado + responseData.Usuario + '</b>.');
                          else
                              mostrarMensaje(1, scope.etiquetas.msgerroranulando);
                      }
                  }
              });
          };
          this.fToggleVisibleBtnAceptarPase = function () {
              if(scope.fpContainerTopNorth.getForm().isValid(true) && scope.fpContainerRegionNorth.getForm().isValid(true)) {
                  if(scope.nfCredito.getValue() > 0 || scope.nfDebito.getValue() > 0) {
                  // if(scope.nfCredito.getValue().length != 0 || scope.nfDebito.getValue().length != 0) {
                      if(scope.btnAceptarPase.isVisible()) {
                          scope.btnAceptarPase.enable();
                          scope.btnGuardarPase.disable();
                      } else {
                          scope.btnAceptarPase.disable();
                          scope.btnGuardarPase.enable();
                      }
                  }
              }
          };
      }
  });

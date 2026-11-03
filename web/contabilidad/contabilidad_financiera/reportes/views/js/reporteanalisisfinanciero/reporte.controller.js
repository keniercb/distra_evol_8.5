  Ext.namespace('Ext.CONT.AnalisisFinanciero');
  Ext.CONT.AnalisisFinanciero.ReporteAnalisisController = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: undefined,
      UIReporteAnalisis: undefined,
      initApp: false,
      constructor: function() {
          Ext.QuickTips.init();
          Ext.Ajax.timeout = 6000000;
          scope = this;
          Ext.Ajax.request({
              method: "POST",
              url: "cargaretiquetas",
              params: {
                  vista: 'reporteanalisisfinanciero'
              },
              callback: function(options, success, response) {
                  scope.etiquetas = Ext.decode(response.responseText);
                  if(scope.etiquetas) {
                      scope.loadMessageBox(scope.etiquetas.lbPlease, scope.etiquetas.lbCargar);
                  } else {
                      scope.loadMessageBox('Por favor espere...', 'Cargando...');
                  }
                  scope.initializeClass();
              }
          });
          if(!document.getElementById('UIXCombo'))
              this.loadJs("/contabilidad/contabilidad_financiera/componentes/xcombo/views/js/UIXCombo", 'UIXCombo');
          if(!document.getElementById('UIReporteAnalisis'))
              this.loadJs("../../views/js/reporteanalisisfinanciero/reporte.view", 'UIReporteAnalisis');
      },
      loadMessageBox: function(title, msg) {
          Ext.MessageBox.show({
              title: title,
              msg: msg,
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
      },
      loadJs: function(jsSrc, id) {
          if(jsSrc != null) {
              var tagScript = document.createElement("script");
              tagScript.setAttribute("type", "text/javascript");
              tagScript.setAttribute("id", id);
              tagScript.setAttribute("src", jsSrc + ".js");
              document.getElementsByTagName("body")[0].appendChild(tagScript);
          }
      },
      initializeClass: function() {
          this.UIReporteAnalisis = new Ext.CONT.AnalisisFinanciero.ReporteAnalisisView(this);
          this.initializeEvents(this);
          this.initializeFunctions(this);
          this.loadData(this);
          Ext.CONT.AnalisisFinanciero.ReporteAnalisisController.superclass.constructor.call(this);
      },
      initializeEvents: function(scope) {
          var kmTeclasCalientes = new Ext.KeyMap(Ext.getDoc(), [{
                  key: 'h',
                  alt: true,
                  fn: function() {
                      help.show(scope.etiquetas.lbTtlAyuda, 'confin/analisisEF/estadoF/evaluarEF');
                  }
              }, {
                  key: 'r',
                  alt: true,
                  fn: function() {
                      if(!scope.btnVistaPreliminar.hidden)
                          scope.btnVistaPreliminar.handler.call();
                  }
              }, {
                  key: 'z',
                  alt: true,
                  ctrl: true,
                  fn: function() {
                      var tree = Ext.getCmp('trpConfiguraciones');
                      tree.body.mask(scope.etiquetas.lbCargar, 'x-mask-loading');
                      tree.root.reload();
                      tree.root.collapse(true, false);
                      setTimeout(function() {
                          tree.body.unmask();
                          tree.root.expand(true, true);
                      }, 1000);
                  }
              }, {
                  key: 'c',
                  alt: true,
                  ctrl: true,
                  fn: function() {
                      if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                          Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                      } else {
                          mostrarMensaje(1, scope.etiquetas.lbSelConfiguracion);
                      }
                  }
              }, {
                  key: 'g',
                  alt: true,
                  fn: function() {
                      if(!scope.btnSalvarConfReporte.hidden)
                          scope.btnSalvarConfReporte.handler.call();
                  }
              }, {
                  key: 'o',
                  alt: true,
                  fn: function() {
                      if(!scope.btnGraficar.hidden)
                          scope.btnGraficar.handler.call();
                  }
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function() {

                      if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                          Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                          mostrarMensaje(2, scope.etiquetas.lbPromptDelConf, function(btn) {
                              if(btn == "ok") {
                                  scope.EliminarConfiguracionReporte();
                              }
                          });
                      } else {
                          Ext.Msg.show({
                              title: 'Informaci&oacute;n',
                              msg: scope.etiquetas.lbSelDelConfiguracion,
                              buttons: Ext.Msg.OK,
                              animEl: 'trpConfiguraciones',
                              icon: Ext.MessageBox.INFO
                          });
                      }
                  }
              }]);

          Ext.getCmp('trpConfiguraciones').on({
              dblclick: function(nodeDbl, eventDbl) {
                  if(nodeDbl.id == 0)
                      //eventDbl.stopEvent();
                      return;
                  else {
                      scope.selectedRecords = scope.dvTiposAnalisis.getSelectedRecords();
                      scope.estadof = scope.selectedRecords[0].data;
                      scope.CargarConfiguracionReporte(nodeDbl);
                  }
              },
              contextmenu: function(nodeCm, eventCm) {
                  nodeCm.select();
                  var c = nodeCm.getOwnerTree().contextMenu;
                  c.contextNode = nodeCm;
                  c.showAt(eventCm.getXY());
              }
          });
          Ext.getCmp('gpConceptos').getSelectionModel().on({
              selectionchange: function(dv, sel) {
                  scope.selectedRecords = Ext.getCmp('gpConceptos').getSelectionModel().getSelections();
                  scope.idconceptoentidad = scope.selectedRecords[0].data.idconceptocontableestructurae;
                  scope.idformula = scope.selectedRecords[0].data.idformula;
                  scope.showDetails();
              }
          });
          Ext.getCmp('gpAnalisisFinaniero').getSelectionModel().on({
              rowselect: function(smodel, rowIndex, record) {
				  var gSelections = Ext.getCmp('gpAnalisisFinaniero').getSelectionModel().getSelections();
                  if(gSelections.length > 1){
						Ext.getCmp('btnGraficar').enable();
				  }
                  Ext.getCmp('gpAnalisisFinaniero').getView().addRowClass(rowIndex, "negrita");
              },
              rowdeselect: function(smodel, rowIndex, record) {
                  Ext.getCmp('gpAnalisisFinaniero').getView().removeRowClass(rowIndex, "negrita");
                  var gSelections = Ext.getCmp('gpAnalisisFinaniero').getSelectionModel().getSelections();
                  if(gSelections.length == 0)
                      Ext.getCmp('btnGraficar').disable();
              }

          });
          Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().on({
              rowselect: function(smodel, rowIndex, record) {
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  var indexSAcumulado = scope.jsDimensiones.find('idnomdimensionesanalisis', '8032', 0, false, true);
                  var indexSDiferencia = scope.jsDimensiones.find('idnomdimensionesanalisis', '8033', 0, false, true);
                  var indexSInicial = scope.jsDimensiones.find('idnomdimensionesanalisis', '8030', 0, false, true);
                  var indexSEAnterior = scope.jsDimensiones.find('idnomdimensionesanalisis', '8034', 0, false, true);
                  scope.fSInicial = smodel.isSelected(indexSInicial);
                  scope.fSPeriodo = smodel.isSelected(indexSPeriodo);
                  scope.fSAcumulado = smodel.isSelected(indexSAcumulado);
                  scope.fSDiferencia = smodel.isSelected(indexSDiferencia);
                  scope.fSEAnterior = smodel.isSelected(indexSEAnterior);
                  if(rowIndex === indexSDiferencia) {
                      smodel.selectRows([indexSPeriodo, indexSAcumulado], true);
                  } else if(smodel.isSelected(indexSPeriodo) && rowIndex === indexSAcumulado) {
                      smodel.selectRow(indexSDiferencia, true);
                  } else if(smodel.isSelected(indexSAcumulado) && rowIndex === indexSPeriodo) {
                      smodel.selectRow(3, true);
                  }
              },
              rowdeselect: function(smodel, rowIndex, record) {
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  var indexSAcumulado = scope.jsDimensiones.find('idnomdimensionesanalisis', '8032', 0, false, true);
                  var indexSDiferencia = scope.jsDimensiones.find('idnomdimensionesanalisis', '8033', 0, false, true);
                  var indexSInicial = scope.jsDimensiones.find('idnomdimensionesanalisis', '8030', 0, false, true);
                  var indexSEAnterior = scope.jsDimensiones.find('idnomdimensionesanalisis', '8034', 0, false, true);
                  scope.fSInicial = smodel.isSelected(indexSInicial);
                  scope.fSPeriodo = smodel.isSelected(indexSPeriodo);
                  scope.fSAcumulado = smodel.isSelected(indexSAcumulado);
                  scope.fSDiferencia = smodel.isSelected(indexSDiferencia);
                  scope.fSEAnterior = smodel.isSelected(indexSEAnterior);
                  if(rowIndex === indexSDiferencia) {
                      smodel.deselectRow(indexSPeriodo);
                      smodel.deselectRow(indexSAcumulado);
                  }
                  if(rowIndex === indexSPeriodo && smodel.isSelected(indexSAcumulado) && smodel.isSelected(indexSDiferencia)) {
                      smodel.deselectRow(indexSDiferencia);
                      smodel.selectRow(indexSAcumulado, true);
                  }
                  if(rowIndex === indexSAcumulado && smodel.isSelected(indexSPeriodo) && smodel.isSelected(indexSDiferencia)) {
                      smodel.deselectRow(indexSDiferencia);
                      smodel.selectRow(indexSPeriodo, true);
                  }
              }
          });
          Ext.getCmp('gpEntidad').getStore().on('load', function(store, records, options) {
              scope.fValorActual(store, 'Entidad', scope.responseData.Entidades.Actual);
          });
          Ext.getCmp('gpNiveles').getStore().on('load', function(store, records, options) {
              scope.fValorActual(store, 'Niveles', scope.responseData.Niveles.Actual);
          });
          Ext.getCmp('gpEntidad').getSelectionModel().on({
              selectionchange: function() {
                  scope.fResetValues(scope.cbxEjercicio);
                  scope.fResetValues(scope.cbxPeriodo);
                  scope.fResetValues(scope.cbxMoneda);
                  scope.fResetValuesFecha();
                  scope.cbxMoneda.valuesLoaded = new Array();
              },
              rowselect: function(selectionModel, rowIndex, record) {
                  Ext.getCmp('btnConsolidar').setVisible(false);
                  Ext.getCmp('btnNoConsolidar').setVisible(false);
                  scope.menuConsolidar.IsValidShow(Ext.getCmp('gpEntidad'), rowIndex);
              },
              rowdeselect: function(selectionModel, rowIndex, record) {
                  Ext.getCmp('btnConsolidar').setVisible(false);
                  Ext.getCmp('btnNoConsolidar').setVisible(false);
                  gridPanel = Ext.getCmp('gpEntidad');
                  if(record.data.consolidar) {
                      record.data.text = record.data.text.replace(" <b>(CONSOLIDAR)</b>", '');
                      record.data.consolidar = false;
                      scope.menuConsolidar.UpdateData(gridPanel);
                  }
                  var nodeAncestors = gridPanel.getStore().getNodeAncestors(record);
                  for(var i = 0; i < nodeAncestors.length; i++)
                      if(nodeAncestors[i].data.consolidar)
                          if(scope.menuConsolidar.GetNodeChildrenSelected(gridPanel, gridPanel.getStore().getNodeChildren(nodeAncestors[i])).length == 0) {
                              nodeAncestors[i].data.text = nodeAncestors[i].data.text.replace(" <b>(CONSOLIDAR)</b>", '');
                              nodeAncestors[i].data.consolidar = false;
                              scope.menuConsolidar.UpdateData(gridPanel);
                          }
              }
          });
          Ext.getCmp('gpEntidad').on('rowclick', function(gridPanel, rowIndex, e) {
              Ext.getCmp('btnConsolidar').setVisible(false);
              Ext.getCmp('btnNoConsolidar').setVisible(false);
              if(gridPanel.getSelectionModel().isSelected(rowIndex))
                  scope.menuConsolidar.IsValidShow(gridPanel, rowIndex);
          });
          Ext.getCmp('gpEjercicio').getStore().on('load', function(store, records, options) {
              if(scope.jrEjercicio.jsonData.Actual != null) {
                  scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', scope.jrEjercicio.jsonData.Actual);
              }
          });
          this.cbxEjercicio.on('expand', function() {
              if(scope.cbxEntidad.isValid()) {
                  if(scope.cbxEjercicio.fIsDirty(scope.cbxEntidad.fSelect.values)) {
                      scope.cbxEjercicio.fSelect.valuesLoaded = scope.cbxEntidad.fSelect.values;
                      Ext.getCmp('gpEjercicio').getStore().removeAll();
                      Ext.getCmp('gpEjercicio').getStore().load({
                          params: {
                              arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                          }
                      });
                  }
              } else
                  scope.cbxEjercicio.collapse();
          });
          Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function() {
              scope.fResetValues(scope.cbxPeriodo);
              scope.fResetValuesFecha();
              if(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !scope.cbxEjercicio.isValid())
                  scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
          });
          this.cbxPeriodo.on('expand', function() {
              if(scope.cbxEjercicio.isValid()) {
                  if(scope.cbxPeriodo.fIsDirty(scope.cbxEjercicio.fSelect.values)) {
                      scope.cbxPeriodo.fSelect.valuesLoaded = scope.cbxEjercicio.fSelect.values;
                      store = Ext.getCmp('gpPeriodo').getStore();
                      recordsSelected = Ext.getCmp('gpEjercicio').getSelectionModel().getSelections();
                      result = new Array();
                      for(i = 0; i < recordsSelected.length; i++)
                          result.push({
                              text: recordsSelected[i].data.text,
                              idEjercicio: recordsSelected[i].data.idejercicio
                          });
                      store.removeAll();
                      store.load({
                          params: {
                              arrayEjercicios: Ext.encode(result)
                          }
                      });
                  }
              } else
                  scope.cbxPeriodo.collapse();
          });
          this.cbxPeriodo.content.getComponent(0).getStore().on('load', function(store, records, options) {
              if(scope.jrPeriodo.jsonData.Actual != null) {
                  scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', scope.jrPeriodo.jsonData.Actual);
                  scope.fSetValuesFechas(scope.responseData.Periodos.fechaInicio, scope.responseData.Periodos.fechaFin);
              }
          });
          Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function() {
              selectionsPeriodo = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
              scope.fSetearFechas((selectionsPeriodo.length > 0) ? selectionsPeriodo : Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
          });
          Ext.getCmp('gpMoneda').getStore().on('load', function(store, records, options) {
              scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
              scope.cbxMoneda.enable();
              if(scope.jrMoneda.jsonData.Actual != null) {
                  Ext.each(scope.jrMoneda.jsonData.datos, function(item, index) {
                      if(item.idmoneda == scope.responseData.Monedas.Actual) {
                          scope.cbxMoneda.setValue(item.codigoiso);
                          scope.cbxMoneda.fSelect.values.push(item.idmoneda);
                          scope.cbxMoneda.fSelect.display.push(item.codigoiso);
                          return false;
                      }
                  });
              }
          });
          Ext.getCmp('gpMoneda').getSelectionModel().on('selectionchange', function() {
              if(Ext.getCmp('gpMoneda').getSelectionModel().getSelections().length === 0)
                  scope.fResetValues(scope.cbxMoneda);
          });
          this.cbxMoneda.on('expand', function() {
              if(scope.cbxEntidad.isValid()) {
                  if(scope.cbxMoneda.fIsDirty(scope.cbxEntidad.fSelect.values)) {
                      scope.cbxMoneda.fSelect.valuesLoaded = scope.cbxEntidad.fSelect.values;
                      Ext.getCmp('gpMoneda').getStore().removeAll();
                      Ext.getCmp('gpMoneda').getStore().load({
                          params: {
                              arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                          }
                      });
                  }
              } else
                  scope.cbxMoneda.collapse();
          });
          this.cbxEntidad.on('collapse', function() {
              if(scope.cbxEntidad.isValid()) {
                  if(Ext.getCmp('gpMoneda').getStore().getCount() == 0) {
                      scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
                      scope.cbxMoneda.disable();
                      Ext.getCmp('gpMoneda').getStore().load({
                          params: {
                              arrayIdEstructurae: Ext.encode(scope.cbxEntidad.fSelect.values)
                          }
                      });
                  }
              }
          });
      },
      loadData: function(scope) {
          Ext.Ajax.request({
              method: "POST",
              url: "loadData",
              callback: function(options, success, response) {
                  scope.responseData = Ext.decode(response.responseText);
                  if(scope.initApp == false) {
                      Ext.Msg.hide();
                      scope.initApp = true;
                  }
                  if(scope.responseData.Entidades.datos.length > 0) {
                      Ext.getCmp('gpEntidad').getStore().loadData(scope.responseData.Entidades);
                  } else {
                      scope.initMsgWarning(1);
                  }
                  if(scope.responseData.Ejercicios.datos.length > 0) {
                      Ext.getCmp('gpEjercicio').getStore().loadData(scope.responseData.Ejercicios);
                  } else {
                      scope.initMsgWarning(2);
                  }
                  if(scope.responseData.Periodos.datos.length > 0) {
                      Ext.getCmp('gpPeriodo').getStore().loadData(scope.responseData.Periodos);
                  } else {
                      scope.initMsgWarning(3);
                  }
                  if(scope.responseData.Monedas.datos.length > 0) {
                      Ext.getCmp('gpMoneda').getStore().loadData(scope.responseData.Monedas);
                  } else {
                      scope.initMsgWarning(4);
                  }

                  if(scope.responseData.Niveles.datos.length > 0) {
                      Ext.getCmp('gpNiveles').getStore().loadData(scope.responseData.Niveles);
                  } else {
                      scope.initMsgWarning(5);
                  }

                  scope.jsDimensiones.load({
                      callback: function(record, options, success) {
                          scope.fSetearDimensionInicial();
                      }
                  });
              }
          });
      },
      initializeFunctions: function(scope) {
          this.fValorActual = function(store, identificador, idActual) {
              cbxComponente = Ext.getCmp('cbx' + identificador);
              if(idActual && cbxComponente.fSelect.values.length == 0) {
                  for(i = 0; i < store.getCount(); i++)
                      if(store.getAt(i).id == idActual) {
                          cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                          cbxComponente.fSelect.values.push(store.getAt(i).id);
                          cbxComponente.fSelect.index.push(i);
                      }
                  cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
              }
          };
          this.fValorActualCopy = function(store, identificador, identificadorAntecesor, idActual) {
              cbxComponente = Ext.getCmp('cbx' + identificador);
              if(idActual && cbxComponente.fSelect.values.length == 0) {
                  for(i = 0; i < store.getCount(); i++)
                      if(this.findValue(store.getAt(i).id, idActual)) {
                          cbxComponente.fSelect.display.push(store.getAt(i).data.codigo);
                          cbxComponente.fSelect.values.push(store.getAt(i).id);
                          cbxComponente.fSelect.valuesLoaded = Ext.getCmp('cbx' + identificadorAntecesor).fSelect.values;
                          cbxComponente.fSelect.index.push(i);
                      }
                  cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
              }
          };
          this.findValue = function(list, id) {
              for(j = 0; j < list.length; j++)
                  if(list[j] == id)
                      return true;
              return false;
          };
          this.fSetValuesFechas = function(fechaInicio, fechaFin) {
              scope.dfFechaDesde.setDisabled(false);
              scope.dfFechaHasta.setDisabled(false);
              scope.dfFechaDesde.reset();
              scope.dfFechaHasta.reset();
              scope.dfFechaDesde.setMinValue(fechaInicio);
              scope.dfFechaHasta.setMaxValue(fechaFin);
              scope.dfFechaDesde.setValue(fechaInicio);
              scope.dfFechaHasta.setValue(fechaFin);
              scope.dfFechaDesde.clearInvalid();
              scope.dfFechaHasta.clearInvalid();
          };
          this.fResetValues = function(component) {
              component.clearValue();
              component.fSelect.values = new Array();
              component.fSelect.display = new Array();
              component.fSelect.index = new Array();
          };
          this.fSetearFechas = function(recordsSelection) {
              recordsLength = recordsSelection.length;
              if(recordsLength > 1) {
                  recordsMenores = scope.fOrdenaFechasMenores(recordsSelection);
                  scope.fSetValuesFechas((recordsMenores[0].data.apertura == 1) ? recordsMenores[0].data.inicio : recordsMenores[0].data.inicio, scope.fOrdenaFechasMayores(recordsSelection)[0].data.fin);
              } else if(recordsLength == 1) {
                  scope.fSetValuesFechas((recordsSelection[0].data.apertura == 1) ? null : recordsSelection[0].data.inicio, recordsSelection[0].data.fin);
              } else
                  scope.fResetValuesFecha();
          };
          this.fResetValuesFecha = function() {
              date = new Date().format('d/m/Y');
              scope.dfFechaDesde.setDisabled(true);
              scope.dfFechaHasta.setDisabled(true);
              scope.dfFechaDesde.setValue(null);
              scope.dfFechaHasta.setValue(null);
          };
          this.fFechaMayor = function(fechaUno, fechaDos) {
              xMes = fechaUno.substring(3, 5);
              xDia = fechaUno.substring(0, 2);
              xAnio = fechaUno.substring(6, 10);
              yMes = fechaDos.substring(3, 5);
              yDia = fechaDos.substring(0, 2);
              yAnio = fechaDos.substring(6, 10);
              return (xAnio > yAnio) ? true : ((xAnio == yAnio) ? ((xMes > yMes) ? true : ((xMes == yMes) ? ((xDia > yDia) ? true : false) : false)) : false);
          };
          this.fFechaIguales = function(fechaUno, fechaDos) {
              xMes = fechaUno.substring(3, 5);
              xDia = fechaUno.substring(0, 2);
              xAnio = fechaUno.substring(6, 10);
              yMes = fechaDos.substring(3, 5);
              yDia = fechaDos.substring(0, 2);
              yAnio = fechaDos.substring(6, 10);
              return (xAnio == yAnio) ? ((xMes == yMes) ? ((xDia == yDia) ? true : false) : false) : false;
          };
          this.fOrdenaFechasMenores = function(valores) {
              for(i = 0; i < valores.length - 1; i++)
                  for(j = i + 1; j < valores.length; j++)
                      if(this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                          valor = valores[i];
                          valores[i] = valores[j];
                          valores[j] = valor;
                      } else if(this.fFechaIguales(valores[i].data.inicio, valores[j].data.inicio))
                          if(this.fFechaMayor(valores[i].data.fin, valores[j].data.fin)) {
                              valor = valores[i];
                              valores[i] = valores[j];
                              valores[j] = valor;
                          }

              return valores;
          };
          this.fOrdenaFechasMayores = function(valores) {
              for(i = 0; i < valores.length - 1; i++)
                  for(j = i + 1; j < valores.length; j++)
                      if(!this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                          valor = valores[i];
                          valores[i] = valores[j];
                          valores[j] = valor;
                      }
              return valores;
          };
          this.menuConsolidar = {
              IsValidShow: function(gridPanel, rowIndex) {
                  store = gridPanel.getStore();
                  node = gridPanel.getStore().getAt(rowIndex);
                  if(node.data.consolidar == true)
                      this.ShowContext(gridPanel, false, node.data);
                  else if(!node.data._is_leaf && store.isExpandedNode(node)) {
                      nodeChildren = store.getNodeChildren(node);
                      if(this.GetNodeChildrenSelected(gridPanel, nodeChildren).length > 0)
                          this.ShowContext(gridPanel, true, node.data);
                  }
              },
              GetNodeChildrenSelected: function(gridPanel, nodeChildren) {
                  result = new Array();
                  for(i = 0; i < nodeChildren.length; i++)
                      if(gridPanel.getSelectionModel().isSelected(nodeChildren[i]))
                          result.push(nodeChildren[i]);
                  return result;
              },
              ShowContext: function(gridPanel, flag, node) {
                  Ext.getCmp('btnConsolidar').setVisible(flag);
                  Ext.getCmp('btnNoConsolidar').setVisible(!flag);
                  this.HandleFunction(this, flag, node, gridPanel);
              },
              UpdateData: function(gridPanel) {
                  store = gridPanel.getStore();
                  Ext.getCmp('cbxEntidad').clearValue();
                  gridPanel.getSelectionModel().displaySelect = new Array();
                  recordsSelections = gridPanel.getSelectionModel().getSelections();
                  records = store.getRange(0, store.getCount());
                  store.removeAll();
                  store.add(records);
                  gridPanel.getSelectionModel().selectRecords(recordsSelections);
              },
              HandleFunction: function(scope, flag, node, gridPanel) {
                  if(!flag) {
                      Ext.getCmp('btnNoConsolidar').purgeListeners();
                      Ext.getCmp('btnNoConsolidar').on('click', function() {
                          this.hide();
                          node.text = node.text.replace(" <b>(CONSOLIDAR)</b>", '');
                          node.consolidar = false;
                          scope.UpdateData(gridPanel);
                      });
                  } else {
                      Ext.getCmp('btnConsolidar').purgeListeners();
                      Ext.getCmp('btnConsolidar').on('click', function() {
                          this.hide();
                          node.text = node.text + " <b>(CONSOLIDAR)</b>";
                          node.consolidar = true;
                          scope.UpdateData(gridPanel);
                      });
                  }

              }
          };
          this.showDetails = function() {
              scope.btnEvaluar.enable();
              scope.idconceptoentidad = scope.selectedRecords[0].data.idconceptocontableestructurae;
          };
          this.EvaluarAnalisisEconFinanciero = function() {
              if(scope.fpFiltrosBasicosReporte.getForm().isValid()) {
                  this.listEstructurasConsolidan = scope.fObtenerListaEstructuraConsolidan();
                  var saldosSeleccionados = scope.smCheckFiltroAdicional.getSelections();
                  var saldosSeleccionados = Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().getSelections();
                  scope.saldos = new Array();
                  scope.saldosStr = new Array();
                  scope.saldosObj = new Array();
                  if(saldosSeleccionados.length > 0) {
                      for(indiceSaldo = 0; indiceSaldo < saldosSeleccionados.length; indiceSaldo++) {
                          scope.saldos.push(saldosSeleccionados[indiceSaldo]['data']['idnomdimensionesanalisis']);
                          scope.saldosStr.push(saldosSeleccionados[indiceSaldo]['data']['denominacion']);
                          scope.saldosObj.push({
                              "idnomdimensionesanalisis": saldosSeleccionados[indiceSaldo]['data']['idnomdimensionesanalisis'],
                              "denominacion": saldosSeleccionados[indiceSaldo]['data']['denominacion']
                          });
                      }
                  }
                  scope.fLoadMaskCmp(scope, scope.gpAnalisis, "Cargando...");
                  Ext.Ajax.request({
                      url: 'obtenerdatosanalisisreporte',
                      method: 'POST',
                      timeout: 300000,
                      params: {
                          'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                          'arrayIdEstructurae': Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                          'arrayIdEjercicio': Ext.encode(this.fObtenerArrayIdEjercicio()),
                          'arrayIdPeriodo': Ext.encode(this.fObtenerArrayIdPeriodo()),
                          'desde': scope.dfFechaDesde.getRawValue(),
                          'hasta': scope.dfFechaHasta.getRawValue(),
                          'arrayIdMonedaEntidad': Ext.encode(this.fObtenerArrayIdMonedaEntidad()),
                          'arrayDimensiones': Ext.encode(scope.saldos),
                          'arrayStrMonedaEntidad': Ext.encode(this.fObtenerArrayStrMonedaEntidad()),
                          'arrayStrDimensiones': Ext.encode(scope.saldosStr),
                          'idformula': scope.idformula,
                          'arrayNombreMoneda': Ext.encode(this.fObtenerArrayNombreMonedaEntidad),
                          'idconceptoentidad': scope.idconceptoentidad,
                          "idReporte": "5930"
                      },
                      callback: function(options, success, response) {
                          respuesta = Ext.decode(response.responseText);
                          scope.responseDataRpt = Ext.decode(response.responseText);
                          if(respuesta.datos.length > 0) {
                              scope.fConstruirArrayObjetoPrint(scope.responseDataRpt);
                              scope.gpAnalisis.reconfigure(
                                      this.store = new Ext.data.GroupingStore({
                                          groupField: 'Entidad',
                                          sortInfo: {
                                              field: "Entidad",
                                              direction: "ASC"
                                          },
                                          reader: new Ext.data.ArrayReader({}, [
                                              {
                                                  name: 'Entidad',
                                                  mapping: 'descripcionestructura'
                                              },
                                              {
                                                  name: 'idestructurae',
                                                  mapping: 'idestructurae'
                                              },
                                              {
                                                  name: 'descripcionestructura',
                                                  mapping: 'descripcionestructura'
                                              },
                                              {
                                                  name: 'type',
                                                  mapping: 'type'
                                              },
                                              {
                                                  name: 'idpartida',
                                                  mapping: 'idpartida'
                                              },
                                              {
                                                  name: 'descripcionpartida',
                                                  mapping: 'descripcionpartida'
                                              },
                                              {
                                                  name: 'text',
                                                  mapping: 'text'
                                              },
                                              {
                                                  name: 'idmoneda',
                                                  mapping: 'idmoneda'
                                              },
                                              {
                                                  name: 'codigoiso',
                                                  mapping: 'codigoiso'
                                              },
                                              {
                                                  name: 'idejercicio',
                                                  mapping: 'idejercicio'
                                              },
                                              {
                                                  name: 'ejercicio',
                                                  mapping: 'ejercicio'
                                              },
                                              {
                                                  name: 'idperiodo',
                                                  mapping: 'idperiodo'
                                              },
                                              {
                                                  name: 'periodo',
                                                  mapping: 'periodo'
                                              },
                                              {
                                                  name: 'sinicial',
                                                  mapping: 'sinicial'
                                              },
                                              {
                                                  name: 'speriodo',
                                                  mapping: 'speriodo'
                                              },
                                              {
                                                  name: 'sacumulado',
                                                  mapping: 'sacumulado'
                                              },
                                              {
                                                  name: 'sdiferencia',
                                                  mapping: 'sdiferencia'
                                              },
                                              {
                                                  name: 'sejercicioanterior',
                                                  mapping: 'sejercicioanterior'
                                              },
                                              {
                                                  name: 'promedio'
                                              }
                                          ]),
                                          data: respuesta.datos
                                      }),
                                      new Ext.grid.ColumnModel([
                                          {
                                              id: 'expandir',
                                              header: 'Entidad',
                                              dataIndex: 'Entidad',
                                              hidden: true
                                          },
                                          {
                                              id: 'expandir',
                                              header: 'idestructurae',
                                              hidden: true,
                                              hideable: false,
                                              dataIndex: 'idestructurae',
                                              renderer: scope.DetallesReporte,
                                              width: 100
                                          },
                                          {
                                              header: 'C&oacute;digo',
                                              dataIndex: 'concat',
                                              align: 'left',
                                              width: 100,
                                              hidden: true,
                                              hideable: false
                                          },
                                          {
                                              header: 'type',
                                              hidden: true,
                                              hideable: false,
                                              dataIndex: 'type',
                                              width: 100
                                          },
                                          {
                                              header: 'idpartida',
                                              hidden: true,
                                              hideable: false,
                                              dataIndex: 'idpartida',
                                              width: 100
                                          },
                                          {
                                              header: 'Partida',
                                              dataIndex: 'descripcionpartida',
                                              tooltip: 'Nombre de las cuentas',
                                              width: 250,
                                              editor: new Ext.form.TextField({
                                                  allowBlank: false
                                              })
                                          },
                                          {
                                              header: 'text',
                                              dataIndex: 'text',
                                              hidden: true,
                                              hideable: false,
                                              width: 400
                                          },
                                          {
                                              header: 'idmoneda',
                                              dataIndex: 'idmoneda',
                                              hidden: true,
                                              hideable: false,
                                              width: 100
                                          },
                                          {
                                              header: 'Moneda',
                                              dataIndex: 'codigoiso',
                                              hidden: true,
                                              hideable: false,
                                              width: 80
                                          },
                                          {
                                              header: 'idejercicio',
                                              dataIndex: 'idejercicio',
                                              hidden: true,
                                              hideable: false,
                                              width: 100
                                          },
                                          {
                                              header: 'Ejercicio',
                                              dataIndex: 'ejercicio',
                                              hidden: true,
                                              hideable: false,
                                              width: 80
                                          },
                                          {
                                              header: 'idperiodo',
                                              dataIndex: 'idperiodo',
                                              hidden: true,
                                              hideable: false,
                                              width: 100
                                          },
                                          {
                                              header: 'Per&iacute;odo',
                                              dataIndex: 'periodo',
                                              hidden: true,
                                              hideable: false,
                                              width: 80
                                          },
                                          {
                                              header: 'Saldo inicial',
                                              tooltip: 'Apertura o saldo con que se inicia las operaciones',
                                              dataindex: 'sinicial',
                                              align: 'right',
                                              width: 100,
                                              renderer: scope.FormatoPesos,
                                              hidden: (scope.fSInicial) ? false : true
                                          },
                                          {
                                              header: 'Saldo periodo',
                                              tooltip: 'Saldo del periodo actual',
                                              dataindex: 'speriodo',
                                              align: 'right',
                                              width: 100,
                                              renderer: scope.FormatoPesos,
                                              hidden: (scope.fSPeriodo) ? false : true
                                          },
                                          {
                                              header: 'Saldo acumulado',
                                              tooltip: 'Saldo hasta la fecha',
                                              dataindex: 'sacumulado',
                                              align: 'right',
                                              width: 150,
                                              renderer: scope.FormatoPesos,
                                              hidden: (scope.fSAcumulado) ? false : true
                                          },
                                          {
                                              header: 'Saldo diferencia',
                                              dataindex: 'sdiferencia',
                                              align: 'right',
                                              width: 150,
                                              renderer: scope.FormatoPesos,
                                              hidden: (scope.fSDiferencia) ? false : true
                                          },
                                          {
                                              hidden: (scope.fSEAnterior) ? false : true,
                                              tooltip: 'Saldo correspondiente al ejercicio anterior',
                                              header: 'Saldo ejercicio anterior',
                                              dataindex: 'sejercicioanterior',
                                              align: 'right',
                                              width: 150,
                                              renderer: scope.FormatoPesos
                                          }, {
                                              header: 'Promedio',
                                              tooltip: 'Promedio de saldos',
                                              dataindex: 'promedio',
                                              align: 'right',
                                              width: 100,
                                              renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                                                  if(record.data.type == 'total') {
                                                      value = ((parseFloat(record.data.speriodo) + parseFloat(record.data.sacumulado) + parseFloat(record.data.sdiferencia)) / 3);
                                                      return value;
                                                  } else {
                                                      return '0.00';
                                                  }
                                              }
                                          }
                                      ]));
                              scope.btnSalvarConfReporte.enable();
                              scope.btnVistaPreliminar.enable();
                              scope.pnlEast.collapse();
                              scope.pnlCenter.doLayout();
                          }
                          else {
                              scope.btnEvaluar.disable();
                              scope.btnSalvarConfReporte.disable();
                              scope.btnVistaPreliminar.disable();
                              scope.maskCmp.hide();
                              Ext.Msg.show({
                                  title: scope.etiquetas.lbInformacion,
                                  msg: scope.etiquetas.lbNoDataConf,
                                  buttons: Ext.Msg.OK,
                                  animEl: 'gpAnalisisFinaniero',
                                  icon: Ext.MessageBox.INFO
                              });
                          }
                          scope.maskCmp.hide();
                      }
                  });
              } else {
                  scope.fpFiltrosBasicos.body.stopFx();
                  scope.fpFiltrosBasicos.body.highlight();
              }
          };
          this.FormatoPesos = function(value, metaData, record, rowIndex, colIndex, store) {
              if(record.data.type == 'totalneto') {
                  return '<b><span style=color:green>' + value + '</b>';
              }
              if(record.data.type == 'total') {
                  return '<b>' + value + '</b>';
              } else {
                  return value;
              }
          };
          /**
           * Dar formato contable a un n&uacute;mero.
           * @param {float} <p> The number being formatted. </p>
           * @param * @param {bool} keepCeros [optional] <p>False by default. Use to keep double ceros at end. e.g: <code>100.00</code></p>
           * @returns {String}
           */
          this.setFormatContable = function(number, keepCeros) {
              if(number == 0) {
                  if(!keepCeros) {
                      return '';
                  } else if(keepCeros) {
                      return number_format(number, 2, '.', ',');
                  }
              } else if(number < 0) {
                  return '(' + number_format(number * -1, 2, '.', ',') + ')';
              } else {
                  return number_format(number, 2, '.', ',');
              }
          };
          /**
           * Formats a number with grouped thousands like php function number_format.
           * @param {float} <p> The number being formatted. </p>
           * @param {int} decimals [optional] <p> Sets the number of decimal points.</p>
           * @param {string} dec_point [optional] <p>Sets the separator for the decimal point.</p>
           * @param {string} thousands_sep [optional] <p>Sets the thousands separator.
           * @returns {string} A formatted version of <i>number</i>.
           */
          this.number_format = function(number, decimals, dec_point, thousands_sep) {
              // Formats a number with grouped thousands
              //
              // version: 1103.1210
              // discuss at: http://phpjs.org/functions/number_format
              // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
              // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
              // +     bugfix by: Michael White (http://getsprink.com)
              // +     bugfix by: Benjamin Lupton
              // +     bugfix by: Allan Jensen (http://www.winternet.no)
              // +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
              // +     bugfix by: Howard Yeend
              // +    revised by: Luke Smith (http://lucassmith.name)
              // +     bugfix by: Diogo Resende
              // +     bugfix by: Rival
              // +      input by: Kheang Hok Chin (http://www.distantia.ca/)
              // +   improved by: davook
              // +   improved by: Brett Zamir (http://brett-zamir.me)
              // +      input by: Jay Klehr
              // +   improved by: Brett Zamir (http://brett-zamir.me)
              // +      input by: Amir Habibi (http://www.residence-mixte.com/)
              // +     bugfix by: Brett Zamir (http://brett-zamir.me)
              // +   improved by: Theriault
              // +      input by: Amirouche
              // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
              // *     example 1: number_format(1234.56);
              // *     returns 1: '1,235'
              // *     example 2: number_format(1234.56, 2, ',', ' ');
              // *     returns 2: '1 234,56'
              // *     example 3: number_format(1234.5678, 2, '.', '');
              // *     returns 3: '1234.57'
              // *     example 4: number_format(67, 2, ',', '.');
              // *     returns 4: '67,00'
              // *     example 5: number_format(1000);
              // *     returns 5: '1,000'
              // *     example 6: number_format(67.311, 2);
              // *     returns 6: '67.31'
              // *     example 7: number_format(1000.55, 1);
              // *     returns 7: '1,000.6'
              // *     example 8: number_format(67000, 5, ',', '.');
              // *     returns 8: '67.000,00000'
              // *     example 9: number_format(0.9, 0);
              // *     returns 9: '1'
              // *    example 10: number_format('1.20', 2);
              // *    returns 10: '1.20'
              // *    example 11: number_format('1.20', 4);
              // *    returns 11: '1.2000'
              // *    example 12: number_format('1.2000', 3);
              // *    returns 12: '1.200'
              // *    example 13: number_format('1 000,50', 2, '.', ' ');
              // *    returns 13: '100 050.00'
              // Strip all characters but numerical ones.

              number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
              var n = !isFinite(+number) ? 0 : +number,
                      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                      s = '',
                      toFixedFix = function(n, prec) {
                          var k = Math.pow(10, prec);
                          return '' + Math.round(n * k) / k;
                      };
              // Fix for IE parseFloat(0.55).toFixed(0) = 0;
              s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
              if(s[0].length > 3) {
                  s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
              }
              if((s[1] || '').length < prec) {
                  s[1] = s[1] || '';
                  s[1] += new Array(prec - s[1].length + 1).join('0');
              }
              return s.join(dec);
          };
          this.DetallesReporte = function(value, metaData, record, rowIndex, colIndex, store) {
              var view = scope.gpAnalisis.getView();
              view.enableRowBody = true;
              if(record.data.type == 'detalle' || rowIndex == 0) {
                  metaData.cellAttr = 'rowspan="2";colspan="2"';
                  metaData.value = scope.tplDetailsReport.apply(record.data);
                  valor = scope.tplDetailsReport.apply(record.data);
                  return '<b>' + valor + '</b>';
              } else {
                  return value;
              }
          };
          this.GuardarConfiguracionReporte = function() {
              if(scope.fpFiltrosBasicos.getForm().isValid()) {
                  Ext.Ajax.request({
                      url: 'guardarconfiguracionreporte',
                      method: 'POST',
                      params: {
                          'listIdEstructuraConsolidar': Ext.encode(this.listEstructurasConsolidan),
                          'arrayIdEstructurae': Ext.encode(this.fObtenerListaEstructura(this.listEstructurasConsolidan)),
                          'arrayIdEjercicio': Ext.encode(this.fObtenerArrayIdEjercicio()),
                          'arrayIdPeriodo': Ext.encode(this.fObtenerArrayIdPeriodo()),
                          'desde': scope.dfFechaDesde.getRawValue(),
                          'hasta': scope.dfFechaHasta.getRawValue(),
                          'arrayIdMonedaEntidad': Ext.encode(this.fObtenerArrayIdMonedaEntidad()),
                          'arrayDimensiones': Ext.encode(scope.saldos),
                          'arrayStrMonedaEntidad': Ext.encode(this.fObtenerArrayStrMonedaEntidad()),
                          'arrayStrDimensiones': Ext.encode(scope.saldosStr),
                          'objDimensiones': Ext.encode(scope.saldosObj),
                          'idformula': scope.idformula,
                          'nivel': scope.cbxNiveles.fSelect.values,
                          'idconceptoentidad': scope.idconceptoentidad,
//                          'nombreAnalisis': scope.tfTitulo.getValue(),
                          "idReporte": "900000"
                      },
                      callback: function(options, success, response) {
                          respuesta = Ext.decode(response.responseText);
                          switch(respuesta.codMsg) {
                              case -1:
                                  {
                                      scope.pnlEast.expand();
                                      scope.pnlCenter.doLayout();
                                      Ext.getCmp('trpConfiguraciones').getRootNode().reload();
                                      mostrarMensaje(1, scope.etiquetas.lbInfoAddConf);
                                  }
                                  break;
                              case -2:
                                  {
                                      mostrarMensaje(1, scope.etiquetas.ExistNomb);
                                  }
                                  break;
                              case -4:
                                  {
                                      mostrarMensaje(1, scope.etiquetas.Exist);
                                  }
                                  break;
                              default:
                                  mostrarMensaje(respuesta.codMsg, respuesta.mensaje);
                                  break;
                          }
                      }
                  });
              } else {
                  scope.fpFiltrosBasicos.body.stopFx();
                  scope.fpFiltrosBasicos.body.highlight();
              }
          };
          this.CargarConfiguracionReporte = function(nodoConf) {
              scope.conf = {};
              scope.conf.idEntidades = nodoConf.attributes.idestructurase;
              scope.conf.idEjercicios = nodoConf.attributes.idejercicios;
              scope.conf.idPeriodos = nodoConf.attributes.idperiodos;
              scope.conf.desde = nodoConf.attributes.fechainicio;
              scope.conf.hasta = nodoConf.attributes.fechafin;
              scope.conf.idMonedasEntidad = nodoConf.attributes.idmonedasentidad;
              scope.conf.titulo = nodoConf.attributes.denominacion;
              scope.conf.idFormula = nodoConf.attributes.idformula;
              scope.conf.nivel = nodoConf.attributes.nivel;
              scope.conf.idDimensiones = nodoConf.attributes.iddimensiones;
              scope.conf.idEstructuraconsolida = nodoConf.attributes.idestructuraconsolida;
              scope.pnlEast.expand();
              scope.fpFiltrosBasicosReporte.expand();
              scope.pnlCenter.doLayout();
              this.fSetearDimensiones(scope.conf.idDimensiones);
              this.fSelectValueXCombo(scope, 'Entidad', scope.conf.idEntidades, 'idestructurae', scope.jrEntidad, 'text');
              this.fSelectValueXCombo(scope, 'Ejercicio', scope.conf.idEjercicios, 'idejercicio', scope.jrEjercicio, 'text');
              this.fSelectValueXCombo(scope, 'Periodo', scope.conf.idPeriodos, 'idperiodo', scope.jrPeriodo, 'text');
              this.fSelectValueXCombo(scope, 'Moneda', scope.conf.idMonedasEntidad, 'idmoneda', scope.jrMoneda, 'codigoiso');
              this.fSelectValueXCombo(scope, 'Niveles', scope.conf.nivel, 'nivel', scope.jrNiveles, 'text');
          };
          this.EliminarConfiguracionReporte = function() {
              var trpNodoConf = scope.trpVersionesReporte.getSelectionModel().getSelectedNode();
              if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                  Ext.Ajax.request({
                      url: 'eliminarconfiguracionreporte',
                      method: 'POST',
                      params: {
                          'idconfiguracion': trpNodoConf.attributes.id
                      },
                      callback: function(options, success, response) {
                          respuesta = Ext.decode(response.responseText);
                          switch(respuesta.codMsg) {
                              case -1:
                                  {
                                      mostrarMensaje(1, scope.etiquetas.lbInfoDelConf, function() {
                                          Ext.getCmp('trpConfiguraciones').getRootNode().reload();
                                      });
                                  }
                                  break;
                              default:
                                  mostrarMensaje(respuesta.codMsg, respuesta.mensaje);
                                  break;
                          }
                      }
                  });
              } else {
                  mostrarMensaje(1, scope.etiquetas.lbSelDelConfiguracion);
              }
          };
          this.fGetChildrenNodes = function(node, selection) {
              var arrayConsolidar = new Array(node.data.idestructurae);
              for(k = 0; k < selection.length; k++) {
                  if(node.data.ordenizq * 1 < selection[k].data.ordenizq * 1 && node.data.ordender * 1 > selection[k].data.ordender * 1) {
                      arrayConsolidar.push(selection[k].data.idestructurae);
                  }
              }
              return arrayConsolidar;
          };
          this.fObtenerListaEstructuraConsolidan = function() {
              var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
              var list = new Array();
              for(var i = 0; i < select.length; i++)
                  if(select[i].data.consolidar)
                      list.push({
                          id: select[i].data.idestructurae,
                          consolida: scope.fGetChildrenNodes(select[i], select)
                      });
              return list;
          };
          this.fObtenerListaEstructura = function(listEstructurasConsolidan) {
              var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
              var list = new Array();
              if(listEstructurasConsolidan.length > 0) {
                  for(var i = 0; i < select.length; i++)
                      if(select[i].data.consolidar)
                          for(var j = 0; j < select.length; j++)
                              if(select[i].data.ordenizq * 1 <= select[j].data.ordenizq * 1 && select[i].data.ordender * 1 <= select[j].data.ordender * 1)
                                  list.push(select[j].data.idestructurae);
                  return list;
              }
              return scope.cbxEntidad.fSelect.values;
          };
          this.fObtenerArrayIdMonedaEntidad = function() {
              if(Ext.getCmp('gpMoneda').getSelectionModel().getSelections().length) {
                  var select = Ext.getCmp('gpMoneda').getSelectionModel().getSelections();
                  scope.listIdMonedaEntidad = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          scope.listIdMonedaEntidad.push(select[i].data.idmoneda);
                      }
                  }
                  return scope.listIdMonedaEntidad;
              }
              return scope.cbxMoneda.fSelect.values;
          };
          this.fObtenerArrayStrMonedaEntidad = function() {
              if(Ext.getCmp('gpMoneda').getSelectionModel().getSelections().length) {
                  var select = Ext.getCmp('gpMoneda').getSelectionModel().getSelections();
                  scope.listStrMonedaEntidad = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          scope.listStrMonedaEntidad.push(select[i].data.text);
                      }
                  }
                  return scope.listStrMonedaEntidad;
              }
              return scope.cbxMoneda.fSelect.display;
          };
          this.fObtenerArrayNombreMonedaEntidad = function() {
              scope.listNombreMonedaEntidad = new Array();
              if(Ext.getCmp('gpMoneda').getSelectionModel().getSelections().length) {
                  var select = Ext.getCmp('gpMoneda').getSelectionModel().getSelections();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          scope.listNombreMonedaEntidad.push(select[i].data.nombre);
                      }
                  }
                  return scope.listNombreMonedaEntidad;
              } else {
                  var indice = Ext.getCmp('gpMoneda').getStore().find('moneda', scope.cbxMoneda.fSelect.values[0], 0, false, true);
                  scope.listNombreMonedaEntidad.push(Ext.getCmp('gpMoneda').getStore().getAt(indice).data.nombre);
                  return scope.cbxMoneda.fSelect.display;
              }
          };
          this.fObtenerArrayIdPeriodo = function() {
              if(Ext.getCmp('gpPeriodo').getSelectionModel().getSelections().length > 0) {
                  var select = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
                  var list = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          list.push(select[i].data.idperiodo[0]);
                      }
                  }
                  return list;
              }
              return scope.cbxPeriodo.fSelect.values[0];
          };
          this.fObtenerArrayIdEjercicio = function() {
              if(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0) {
                  var select = Ext.getCmp('gpEjercicio').getSelectionModel().getSelections();
                  var list = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          list.push(select[i].data.idejercicio[0]);
                      }
                  }
                  return list;
              }
              return scope.cbxEjercicio.fSelect.values[0];
          };
          this.fCargarMonedasEntidad = function() {
              var select = Ext.getCmp('gpMoneda').getSelectionModel().getSelections();
              scope.listIdMonedaEntidad = new Array();
              for(var i = 0; i < select.length; i++) {
                  if(select[i].data.codigo) {
                      scope.listIdMonedaEntidad.push(select[i].data.idmoneda);
                  }
              }
              return scope.listIdMonedaEntidad;
          };
          this.fSelectValueXCombo = function(scope, xCombo, arrayIdValores, propiedad, jsCmp, vDisplay) {
              gpComponente = Ext.getCmp('gp' + xCombo);
              cbxComponente = Ext.getCmp('cbx' + xCombo);
              scope.fResetValues(cbxComponente);
              for(i = 0; i < arrayIdValores.length; i++) {
                  var indice = gpComponente.getStore().find(propiedad.toString(), arrayIdValores[i], 0, false, true);
                  cbxComponente.fSelect.display.push(jsCmp.jsonData.datos[indice][vDisplay.toString()]);
                  cbxComponente.fSelect.values.push(jsCmp.jsonData.datos[indice][propiedad.toString()]);
              }
              if(cbxComponente.fSelect.display.length > 0) {
                  cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
              }
          };
          this.fSetearDimensiones = function(arrayIdDimensiones) {
              arrayIdDimensiones = arrayIdDimensiones || scope.conf.idDimensiones;
              Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().clearSelections();
              Ext.each(arrayIdDimensiones, function(item, index) {
                  var indexDimension = scope.jsDimensiones.find('idnomdimensionesanalisis', scope.conf.idDimensiones[index], 0, false, true);
                  Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().selectRow(indexDimension, true);
              });
          };
          this.fSetearDimensionInicial = function() {
              Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().clearSelections();
              if(scope.jsDimensiones.getTotalCount() > 0) {
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().selectRow(indexSPeriodo);
              }
          };
          this.fSetearMonedaInicial = function(scope) {
              Ext.getCmp('gpMoneda').getSelectionModel().clearSelections();
              Ext.getCmp('gpMoneda').getStore().loadData(scope.responseData.Monedas);
          };
          this.fSetearMonedas = function() {

          };
          this.treeContextHandler = function(node) {
              node.select();
              scope.trpMenuContextual.show(node.ui.getAnchor());
          };
          this.fConstruirArrayObjetoPrint = function(data) {
              scope.datosRpt = new Array();
              scope.flagBalance = true;
              if(data.total > 0) {
                  scope.datosRpt.push({
                      "datoGeneral": data.dataSources[0].datoGeneral,
                      "datoCuerpo": data.dataSources[0].datoCuerpo,
                      "datoPie": data.dataSources[0].datoPie,
                      "reporte": "5930"
                  });
              }
          };
          this.fOpenWindowReport = function() {
              scope.defaultComponentsValue = {
                  paperSize: "A4",
                  orientation: "Horizontal",
                  reportType: "HTML"
              };
              if(scope.datosRpt == (null || undefined)) {
                  scope.datosRpt = {
                      "datoGeneral": new Array(),
                      "datoCuerpo": new Array(),
                      "datoPie": new Array(),
                      "reporte": "5930"
                  };
              }

              printView = new SCFPrintView(scope.datosRpt, "/contabilidad/comun/SCFPrintView/", scope.defaultComponentsValue);
              printView.show();
          };
          this.fLoadMaskCmp = function(scope, cmp, msg) {
              var body = cmp.body || Ext.getBody();
              scope.maskCmp = new Ext.LoadMask(body, {
                  msg: msg
              });
              scope.maskCmp.show();
          };
          this.fConfGrafica = function() {
              scope.fpTipoGrafico = new Ext.form.FormPanel({
                  frame: true,
                  id: 'fpTipoGrafico',
                  region: 'center',
                  labelAlign: 'top',
                  items: [new Ext.DataView({
                          id: 'dvImage',
                          style: 'margin:35 0 0 25',
                          store: scope.setImageDataView('bar'),
                          tpl: new Ext.XTemplate(
                                  '<tpl for=".">',
                                  '<div class="thumb-wrap" id="{name}">',
                                  '<div class="thumb"><img src="{url}" title="{name}"></div>',
                                  '<span class="x-editable">{shortName}</span></div>',
                                  '</tpl>',
                                  '<div class="x-clear"></div>'
                                  ),
                          autoHeight: true,
                          autoShow: true,
                          overClass: 'x-view-over',
                          itemSelector: 'div.thumb-wrap',
                          emptyText: scope.etiquetas.lbNoImage
                      })]
              });
              scope.fpConfiguracion = new Ext.form.FormPanel({
                  frame: true,
                  region: 'west',
                  id: 'fpConfiguracion',
                  width: 390,
                  labelAlign: 'top',
                  items: [{
                          xtype: 'fieldset',
                          title: scope.etiquetas.lbGrafico,
                          autoHeight: true,
                          autoWidth: true,
                          items: [new Ext.form.TextField({
                                  id: 'tfTtlGrafica',
                                  fieldLabel: scope.etiquetas.lbTtlGrafico,
                                  emptyText: scope.etiquetas.lbTitulo,
                                  anchor: '95%',
                                  maxLength: 50,
                                  invalidText: scope.etiquetas.lbInvalidText,
                                  regexText: scope.etiquetas.lbInvalidText,
                                  maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\.\#\+\,\%\&]+$/,
                                  regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\.\#\+\,\%\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\.\#\+\,\%\&]*)+$/,
                                  enableKeyEvents: true,
                                  listeners: {
                                      'keyup': function() {
                                          scope.verificarConfGraf();
                                      },
                                      'invalid': function(cmp, msg) {
                                          if(cmp.getValue().length > 0) {
                                              var vtext = cmp.getValue().trim();
                                              cmp.setValue(vtext);
                                          }
                                          scope.verificarConfGraf();
                                      },
                                      'blur': function(cmp) {
                                          if(cmp.getValue().length > 0) {
                                              var vtext = cmp.getValue().trim();
                                              cmp.setValue(vtext);
                                          }
                                          scope.verificarConfGraf();
                                      }
                                  }
                              }), new Ext.form.ComboBox({
                                  id: 'cbxTipoGrafico',
                                  fieldLabel: scope.etiquetas.lbTipoGrafico,
                                  store: new Ext.data.SimpleStore({
                                      fields: ['id', 'tipo'],
                                      data: [['bar', 'Barras'], ['pie', 'Pastel'], ['column', 'Columnas'], ['line', 'Lineas']]
                                  }),
                                  valueField: 'id',
                                  displayField: 'tipo',
                                  hiddenName: 'id',
                                  tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
                                  anchor: '95%',
                                  typeAhead: true,
                                  allowBlank: false,
                                  value: 'pie',
                                  mode: 'local',
                                  forceSelection: true,
                                  triggerAction: 'all',
                                  emptyText: 'Seleccione...',
                                  selectOnFocus: true,
                                  listeners: {
                                      select: function(combo, record, index) {
                                          Ext.getCmp('dvImage').setStore(scope.setImageDataView(Ext.getCmp('cbxTipoGrafico').getValue()));
                                          scope.verificarConfGraf();
                                      },
                                      render: function() {
                                          Ext.getCmp('dvImage').setStore(scope.setImageDataView('pie'));
                                      }
                                  }
                              }), new Ext.form.ComboBox({
                                  id: 'cbxDimensiones',
                                  fieldLabel: scope.etiquetas.lbDimensiones,
                                  store: scope.jsDimensiones,
                                  valueField: 'idnomdimensionesanalisis',
                                  displayField: 'denominacion',
                                  hiddenName: 'idnomdimensionesanalisis',
                                  tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                                  anchor: '95%',
                                  typeAhead: true,
                                  mode: 'local',
                                  forceSelection: true,
                                  allowBlank: false,
                                  value: '8031',
                                  triggerAction: 'all',
                                  emptyText: 'Seleccione...',
                                  selectOnFocus: true,
                                  listeners: {
                                      'select': function() {
                                          scope.verificarConfGraf();
                                      }
                                  }
                              })]
                      }, {
                          xtype: 'fieldset',
                          title: 'Leyenda',
                          autoHeight: true,
                          autoWidth: true,
                          items: [new Ext.form.ComboBox({
                                  id: 'cbxLegendPos',
                                  fieldLabel: scope.etiquetas.lbOrientacion,
                                  store: new Ext.data.SimpleStore({
                                      fields: ['id', 'tipo'],
                                      data: [['horizontal', 'Horizontal'], ['vertical', 'Vertical']]
                                  }),
                                  valueField: 'id',
                                  displayField: 'tipo',
                                  hiddenName: 'id',
                                  tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
                                  anchor: '95%',
                                  typeAhead: true,
                                  mode: 'local',
                                  forceSelection: true,
                                  allowBlank: false,
                                  value: 'vertical',
                                  triggerAction: 'all',
                                  emptyText: 'Seleccione...',
                                  selectOnFocus: true,
                                  listeners: {
                                      'select': function() {
                                          scope.verificarConfGraf();
                                      }
                                  }
                              }), new Ext.form.ComboBox({
                                  id: 'cbxVerticalAlign',
                                  fieldLabel: scope.etiquetas.lbAlineacion,
                                  store: new Ext.data.SimpleStore({
                                      fields: ['id', 'tipo'],
                                      data: [['top', 'Arriba'], ['bottom', 'Abajo']]
                                  }),
                                  valueField: 'id',
                                  displayField: 'tipo',
                                  hiddenName: 'id',
                                  tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
                                  anchor: '95%',
                                  typeAhead: true,
                                  allowBlank: false,
                                  value: 'bottom',
                                  mode: 'local',
                                  forceSelection: true,
                                  triggerAction: 'all',
                                  emptyText: 'Seleccione...',
                                  selectOnFocus: true,
                                  listeners: {
                                      'select': function() {
                                          scope.verificarConfGraf();
                                      }
                                  }
                              }), new Ext.form.ComboBox({
                                  id: 'cbxLegendText',
                                  fieldLabel: scope.etiquetas.lbAlineacionText,
                                  store: new Ext.data.SimpleStore({
                                      fields: ['id', 'tipo'],
                                      data: [['right', 'Derecha'], ['left', 'Izquierda'], ['center', 'Centro']]
                                  }),
                                  valueField: 'id',
                                  displayField: 'tipo',
                                  hiddenName: 'id',
                                  tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
                                  anchor: '95%',
                                  typeAhead: true,
                                  allowBlank: false,
                                  value: 'center',
                                  mode: 'local',
                                  forceSelection: true,
                                  triggerAction: 'all',
                                  emptyText: 'Seleccione...',
                                  selectOnFocus: true,
                                  listeners: {
                                      'select': function() {
                                          scope.verificarConfGraf();
                                      }
                                  }
                              })]
                      }]
              });
              scope.winConfGrafica = new Ext.Window({
                  title: scope.etiquetas.lbTtlSelGraficar,
                  bodyStyle: 'padding:5px 10px 5px 10px',
                  resizable: false,
                  modal: true,
                  constrain: true,
                  defaultButton: 0,
                  id: 'winConfGrafica',
                  layout: 'border',
                  height: 455,
                  width: 600,
                  items: [scope.fpConfiguracion, scope.fpTipoGrafico],
                  buttons: [scope.btnCancelarGraf = new Ext.Button({
                          id: 'btnCancelarGraf',
                          text: scope.etiquetas.lbBtnCancelar,
                          tooltip: scope.etiquetas.lbTtCancelarGraf,
                          iconCls: 'cancelar',
                          handler: function() {
                              Ext.getCmp('winConfGrafica').close();
                          }
                      }), scope.btnAceptarGraf = new Ext.Button({
                          id: 'btnAceptarGraf',
                          text: scope.etiquetas.lbBtnAceptar,
                          tooltip: scope.etiquetas.lbTtAceptarGraf,
                          iconCls: 'aceptar',
                          handler: function() {
                              var config = new Object();
                              config.titulo = Ext.getCmp('tfTtlGrafica').getValue();
                              config.tipoGrafico = Ext.getCmp('cbxTipoGrafico').getValue();
                              config.dimension = Ext.getCmp('cbxDimensiones').getValue();
                              config.layout = Ext.getCmp('cbxLegendPos').getValue();
                              config.align = Ext.getCmp('cbxLegendText').getValue();
                              config.verticalAlign = Ext.getCmp('cbxVerticalAlign').getValue();
                              scope.fGraficar(config);
                          }
                      })]
              });
              scope.winConfGrafica.show();
          };
          this.setImageDataView = function(name) {
              return new Ext.data.SimpleStore({
                  fields: ['url', 'name'],
                  data: [["/contabilidad/comun/images/" + name + ".png", name]]
              });
          };
          this.fGraficar = function(config) {
              scope.winGrafica = new Ext.Window({
                  id: 'winGrafica',
                  title: scope.etiquetas.lbTtlGraficar,
                  closable: true,
                  height: 580,
                  html: '<div id="container" style="width: 830; height: 500; margin: 0 auto"></div>',
                  layout: 'fit',
                  modal: true,
                  resizable: true,
                  constrain: true,
                  defaultButton: 0,
                  width: 850,
                  buttons: [{
                          text: scope.etiquetas.lbBtnSalir,
                          iconCls: 'salir',
                          tooltip: scope.etiquetas.lbTtSalir,
                          handler: function() {
                              Ext.getCmp('winGrafica').close();
                          }
                      }]
              });
              scope.winGrafica.show();
              var gSelections = Ext.getCmp('gpAnalisisFinaniero').getSelectionModel().getSelections();
              var gData = new Array();
              var totalSaldo = 0;
              Ext.each(gSelections, function(item, index) {
                  if(parseFloat(item.data.speriodo) < 0) {
                      totalSaldo += parseFloat(item.data.speriodo) * -1;
                  } else
                      totalSaldo += parseFloat(item.data.speriodo);
              });
              var colors = Highcharts.getOptions().colors;
              Ext.each(gSelections, function(item, index) {
                  var percentil = 0;
                  var cantItem = 0;
                  if(parseFloat(item.data.speriodo) < 0) {
                      cantItem = (parseFloat(item.data.speriodo) * -1).toFixed(2);
                  } else {
                      cantItem = parseFloat(item.data.speriodo).toFixed(2);
                  }
                  percentil = (parseFloat(item.data.speriodo) / totalSaldo) * 100;
                  if(percentil < 0)
                      percentil = parseFloat(percentil) * -1;

                  var textName = item.data.text;
                  gData.push({
                      "distance": -30,
                      "name": textName,
                      "y": percentil,
                      "sliced": false,
                      "color": colors[index],
                      "cant": cantItem,
                      "total": cantItem,
                      "data": cantItem
                  });
              });
              switch(config.tipoGrafico) {
                  case 'pie':
                      {
                          chart = new Highcharts.Chart({
                              chart: {
                                  renderTo: 'container',
                                  plotBackgroundColor: null,
                                  plotBorderWidth: null,
                                  plotShadow: false
                              },
                              title: {
                                  text: config.titulo
                              },
                              tooltip: {
                                  formatter: function() {
                                      var cantn = 0;
                                      var saldo = '';
                                      if(parseFloat(this.point.cant) < 0) {
                                          cantn = parseFloat(this.point.cant) * -1;
                                          saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                      } else {
                                          saldo = this.point.cant;
                                      }
                                      return '<b>Cuenta:</b> ' + this.point.name + '<br><b>Saldo:</b> $' + saldo + '<br><b>Percentil:</b> ' + parseFloat(this.point.y).toFixed(2) + ' %';
                                  }
                              },
                              plotOptions: {
                                  pie: {
                                      shadow: false,
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                          enabled: true,
                                          color: '#000000',
                                          connectorColor: '#000000',
                                          formatter: function() {
                                              var cantn = 0;
                                              var saldo = '';
                                              if(parseFloat(this.point.cant) < 0) {
                                                  cantn = parseFloat(this.point.cant) * -1;
                                                  saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                              } else {
                                                  saldo = this.point.cant;
                                              }
                                              return '<b>' + this.point.name + '</b>: ' + saldo + '<br>' + parseFloat(this.point.y).toFixed(2) + ' %';
                                          }
                                      },
                                      showInLegend: true
                                  }
                              },
                              legend: {
                                  layout: config.layout || 'vertical',
                                  align: config.align || 'right',
                                  verticalAlign: config.verticalAlign || 'bottom'
                              },
                              series: [{
                                      type: 'pie',
                                      size: '60%',
                                      name: 'Cuentas',
                                      distance: -30,
                                      data: gData
                                  }]
                          });
                      }
                      break;
                  case 'column':
                      {
                          chart = new Highcharts.Chart({
                              chart: {
                                  renderTo: 'container',
                                  plotBackgroundColor: null,
                                  plotBorderWidth: null,
                                  plotShadow: false,
                                  type: 'column'
                              },
                              title: {
                                  text: config.titulo
                              },
                              tooltip: {
                                  formatter: function() {
                                      var cantn = 0;
                                      var saldo = '';
                                      if(parseFloat(this.point.config) < 0) {
                                          cantn = parseFloat(this.point.config) * -1;
                                          saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                      } else {
                                          saldo = this.point.config;
                                      }
                                      return '<b>Cuenta:</b> ' + this.series.name + '<br><b>Saldo:</b> $' + saldo;
                                  }
                              },
                              credits: {
                                  enabled: false
                              },
                              plotOptions: {
                                  column: {
                                      pointPadding: 0.2,
                                      borderWidth: 0,
                                      groupPadding: 0,
                                      shadow: false
                                  }
                              },
                              legend: {
                                  layout: config.layout || 'vertical',
                                  align: config.align || 'right',
                                  verticalAlign: config.verticalAlign || 'bottom'
                              },
                              series: gData
                          });
                      }
                      break;
                  case 'bar':
                      {
                          chart = new Highcharts.Chart({
                              chart: {
                                  renderTo: 'container',
                                  plotBackgroundColor: null,
                                  plotBorderWidth: null,
                                  plotShadow: false,
                                  type: 'bar'
                              },
                              title: {
                                  text: config.titulo
                              },
                              tooltip: {
                                  formatter: function() {
                                      var cantn = 0;
                                      var saldo = '';
                                      if(parseFloat(this.point.config) < 0) {
                                          cantn = parseFloat(this.point.config) * -1;
                                          saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                      } else {
                                          saldo = this.point.config;
                                      }
                                      return '<b>Cuenta:</b> ' + this.series.name + '<br><b>Saldo:</b> $' + saldo;
                                  }
                              },
                              plotOptions: {
                                  bar: {
                                      shadow: false,
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                          enabled: true,
                                          color: '#000000',
                                          connectorColor: '#000000',
                                          formatter: function() {
                                              var cantn = 0;
                                              var saldo = '';
                                              if(parseFloat(this.point.config) < 0) {
                                                  cantn = parseFloat(this.point.config) * -1;
                                                  saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                              } else {
                                                  saldo = this.point.config;
                                              }
                                              return '<b>' + this.point.series.name + '</b>: $' + saldo;
                                          }
                                      },
                                      showInLegend: true
                                  }
                              },
                              legend: {
                                  layout: config.layout || 'vertical',
                                  align: config.align || 'right',
                                  verticalAlign: config.verticalAlign || 'bottom'
                              },
                              series: gData
                          });
                      }
                      break;
                  case 'line':
                      {
                          chart = new Highcharts.Chart({
                              chart: {
                                  renderTo: 'container',
                                  type: 'line',
                                  marginRight: 130,
                                  marginBottom: 25
                              },
                              title: {
                                  text: config.titulo,
                                  x: -20 //center
                              },
                              tooltip: {
                                  formatter: function() {
                                      var cantn = 0;
                                      var saldo = '';
                                      if(parseFloat(this.point.cant) < 0) {
                                          cantn = parseFloat(this.point.cant) * -1;
                                          saldo = '(' + parseFloat(cantn).toFixed(2) + ')';
                                      } else {
                                          saldo = this.point.cant;
                                      }
                                      return '<b>Cuenta:</b> ' + this.point.name + '<br><b>Saldo:</b> $' + saldo + '<br><b>Percentil:</b> ' + parseFloat(this.point.y).toFixed(2) + ' %';
                                  }
                              },
                              plotOptions: {
                                  line: {
                                      shadow: false,
                                      allowPointSelect: true,
                                      cursor: 'pointer',
                                      dataLabels: {
                                          enabled: true,
                                          color: '#000000',
                                          connectorColor: '#000000',
                                          formatter: function() {
                                              return parseFloat(this.point.y).toFixed(2) + ' %';
                                          }
                                      }
                                  }
                              },
                              legend: {
                                  layout: config.layout || 'vertical',
                                  align: config.align || 'right',
                                  verticalAlign: config.verticalAlign || 'bottom',
                                  borderWidth: 0
                              },
                              series: [{
                                      distance: -30,
                                      type: 'line',
                                      data: gData
                                  }]
                          });
                      }
                      break;
              }

          };
          this.verificarConfGraf = function() {
              if(Ext.getCmp('fpConfiguracion').getForm().isValid()) {
                  Ext.getCmp('btnAceptarGraf').setDisabled(false);
              } else {
                  Ext.getCmp('btnAceptarGraf').setDisabled(true);
              }
          };

      },
      initMsgWarning: function(idWarning) {
          switch(idWarning) {
              case 1 :
                  {
                      mostrarMensaje(1, "Las estructuras econ&oacute;micas no han sido configuradas.", scope.disableFilters);
                  }
                  break;
              case 2 :
                  {
                      mostrarMensaje(1, "No existen ejercicios configurados.", scope.disableFilters);
                  }
                  break;
              case 3 :
                  {
                      mostrarMensaje(1, "No existen per&iacute;odos configurados.", scope.disableFilters);
                  }
                  break;
              case 4 :
                  {
                      mostrarMensaje(1, "No existen monedas configuradas.", scope.disableFilters);
                  }
                  break;
              case 5 :
                  {
                      mostrarMensaje(1, "No existen niveles configurados para la entidad seleccionada.", scope.disableFilters);
                  }
                  break;
          }
      },
      disableFilters: function(btn) {
          if(btn == 'ok') {
              window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
              scope.btnEvaluar.disable();
              scope.btnSalvarConfReporte.disable();
              scope.btnVistaPreliminar.disable();
              scope.pnlEast.collapse();
              scope.pnlCenter.disable();
              scope.pnlCenter.doLayout();
          }
      }
  });
  new Ext.CONT.AnalisisFinanciero.ReporteAnalisisController();
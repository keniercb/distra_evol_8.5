
  Ext.namespace('Ext.CONT.AnalisisFinanciero');
  Ext.CONT.AnalisisFinanciero.ClassEvaluarAnalisis = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil,
      etiquetas: undefined,
      UIEvaluarAnalisis: undefined,
      initApp: false,
      constructor: function () {
          Ext.QuickTips.init();
          Ext.Ajax.timeout = 6000000;
          scope = this;
          Ext.Ajax.request({
              method: "POST",
              url: "cargaretiquetas",
              params: {
                  vista: 'evaluaranalisisfinanciero'
              },
              callback: function (options, success, response) {
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
              this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/UIXCombo", 'UIXCombo');
          if(!document.getElementById('UIEvaluarAnalisis'))
              this.loadJs("../../views/js/evaluaranalisisfinanciero/UIEvaluarAnalisis", 'UIEvaluarAnalisis');
      },
      loadMessageBox: function (title, msg) {
          Ext.MessageBox.show({
              title: title,
              msg: msg,
              width: 300,
              progress: true,
              closable: false
          });
          var f = function (v) {
              return function () {
                  var i = v / 11;
                  Ext.MessageBox.updateProgress(i);
              };
          };
          for(var i = 1; i < 12; i++)
              setTimeout(f(i), i * 500);
      },
      loadJs: function (jsSrc, id) {
          if(jsSrc != null) {
              var tagScript = document.createElement("script");
              tagScript.setAttribute("type", "text/javascript");
              tagScript.setAttribute("id", id);
              tagScript.setAttribute("src", jsSrc + ".js");
              document.getElementsByTagName("body")[0].appendChild(tagScript);
          }
      },
      initializeClass: function () {
          this.UIEvaluarAnalisis = new Ext.CONT.AnalisisFinanciero.UIEvaluarAnalisis(this);
          this.initializeEvents(this);
          this.initializeFunctions(this);
          this.loadData(this);
          Ext.CONT.AnalisisFinanciero.ClassEvaluarAnalisis.superclass.constructor.call(this);
      },
      initializeEvents: function (scope) {
          this.pnlWest.on({
              expand: function (xpanel) {
                  scope.pnlNorth.doLayout();
                  scope.pnlCenter.doLayout();
                  Ext.getCmp('vpGlobal').doLayout();
              },
              collapse: function (xpanel) {
                  scope.pnlNorth.doLayout();
                  scope.pnlCenter.doLayout();
                  Ext.getCmp('vpGlobal').doLayout();
              }
          });
          scope.kmTeclasCalientes = new Ext.KeyMap(Ext.getDoc(), [{
                  key: 'h',
                  alt: true,
                  fn: function () {
                      help.show(scope.etiquetas.lbTtlAyuda, 'confin/analisisEF/estadoF/evaluarEF');
                  }
              }, {
                  key: 'r',
                  alt: true,
                  fn: function () {
                      if(!scope.btnVistaPreliminar.hidden)
                          scope.btnVistaPreliminar.handler.call();
                  }
              }, {
                  key: 'z',
                  alt: true,
                  ctrl: true,
                  fn: function () {
                      var tree = Ext.getCmp('trpConfiguraciones');
                      tree.body.mask(scope.etiquetas.lbCargar, 'x-mask-loading');
                      tree.root.reload();
                      tree.root.collapse(true, false);
                      setTimeout(function () {
                          tree.body.unmask();
                          tree.root.expand(true, true);
                      }, 1000);
                  }
              }, {
                  key: 'c',
                  alt: true,
                  ctrl: true,
                  fn: function () {
                      if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                          Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                      } else {
                          mostrarMensaje(1, scope.etiquetas.lbSelConfiguracion);
                      }
                  }
              }, {
                  key: 'g',
                  alt: true,
                  fn: function () {
                      if(!scope.btnSalvarConfReporte.hidden)
                          scope.btnSalvarConfReporte.handler.call();
                  }
              }, {
                  key: 'o',
                  alt: true,
                  fn: function () {
                      if(!scope.btnGraficar.hidden)
                          scope.btnGraficar.handler.call();
                  }
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function () {

                      if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                          Ext.getCmp('trpConfiguraciones').fireEvent('dblclick', scope.trpVersionesReporte.getSelectionModel().getSelectedNode());
                          mostrarMensaje(2, scope.etiquetas.lbPromptDelConf, function (btn) {
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
          scope.jstTiposAnalisis.on({
              load: function (store, records, options) {
                  scope.pnlWest.body.unmask();
              }
          });
          this.dvTiposAnalisis.on({
              selectionchange: function (dv, sel) {
                  scope.selectedRecord = scope.dvTiposAnalisis.getSelectedRecords()[0];
                  scope.idconceptoentidad = scope.selectedRecord.data.idconceptocontableestructurae;
                  scope.idformula = scope.selectedRecord.data.idformula;
//                Ext.getCmp('trpConfiguraciones').getRootNode().reload();
                  scope.showDetails();
                  scope.pnlNorth.doLayout();
                  scope.pnlWest.doLayout();
              },
              contextmenu: function (dataView, index, nodeHTMLElement, eventObject) {
                  eventObject.stopEvent();
                  scope.dvMenuContextual.items.items[0].enable();
                  scope.dvMenuContextual.show(nodeHTMLElement, 'c');
                  var sel = dataView.getSelectedRecords().length || undefined;
                  if(sel == 0 || sel == undefined) {
                      scope.dvMenuContextual.items.items[1].disable();
                  } else {
                      scope.dvMenuContextual.items.items[1].enable();
                  }
              }
          });
          this.cbxEntidad.on('collapse', function () {
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
          Ext.getCmp('gpEntidad').on('rowclick', function (gridPanel, rowIndex, e) {
              Ext.getCmp('btnConsolidar').setVisible(false);
              Ext.getCmp('btnNoConsolidar').setVisible(false);
              if(gridPanel.getSelectionModel().isSelected(rowIndex))
                  scope.menuConsolidar.IsValidShow(gridPanel, rowIndex);
          });
          Ext.getCmp('gpEntidad').getStore().on('load', function (store, records, options) {
              scope.fValorActual(store, 'Entidad', scope.responseData.Entidades.Actual);
          });
          Ext.getCmp('gpEntidad').getSelectionModel().on({
              selectionchange: function () {
                  scope.fResetValues(scope.cbxEjercicio);
                  scope.fResetValues(scope.cbxPeriodo);
                  scope.fResetValues(scope.cbxMoneda);
                  scope.fResetValuesFecha();
                  scope.cbxMoneda.valuesLoaded = new Array();
              },
              rowselect: function (selectionModel, rowIndex, record) {
                  Ext.getCmp('btnConsolidar').setVisible(false);
                  Ext.getCmp('btnNoConsolidar').setVisible(false);
                  scope.menuConsolidar.IsValidShow(Ext.getCmp('gpEntidad'), rowIndex);
              },
              rowdeselect: function (selectionModel, rowIndex, record) {
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
          this.cbxEjercicio.on('expand', function () {
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
          Ext.getCmp('gpEjercicio').getStore().on('load', function (store, records, options) {
              if(scope.jrEjercicio.jsonData.Actual != null) {
                  scope.fValorActualCopy(store, 'Ejercicio', 'Entidad', scope.jrEjercicio.jsonData.Actual);
              }
          });
          Ext.getCmp('gpEjercicio').getSelectionModel().on('selectionchange', function () {
              scope.fResetValues(scope.cbxPeriodo);
              scope.fResetValuesFecha();
              if(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length > 0 || !scope.cbxEjercicio.isValid())
                  scope.fSetearFechas(Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
          });
          this.cbxPeriodo.on('expand', function () {
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
          this.cbxPeriodo.content.getComponent(0).getStore().on('load', function (store, records, options) {
              if(scope.jrPeriodo.jsonData.Actual != null) {
                  scope.fValorActualCopy(store, 'Periodo', 'Ejercicio', scope.jrPeriodo.jsonData.Actual);
                  scope.fSetValuesFechas(scope.responseData.Periodos.fechaInicio, scope.responseData.Periodos.fechaFin);
              }
          });
          Ext.getCmp('gpPeriodo').getSelectionModel().on('selectionchange', function () {
              selectionsPeriodo = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
              scope.fSetearFechas((selectionsPeriodo.length > 0) ? selectionsPeriodo : Ext.getCmp('gpEjercicio').getSelectionModel().getSelections());
          });
          this.cbxMoneda.on('expand', function () {
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
          Ext.getCmp('gpMoneda').getStore().on('load', function (store, records, options) {
              scope.cbxMoneda.valuesLoaded = scope.cbxEntidad.fSelect.values;
              scope.cbxMoneda.enable();
              if(scope.jrMoneda.jsonData.Actual != null) {
                  Ext.each(scope.jrMoneda.jsonData.datos, function (item, index) {
                      if(item.idmoneda == scope.responseData.Monedas.Actual) {
                          scope.cbxMoneda.setValue(item.codigoiso);
                          scope.cbxMoneda.fSelect.values.push(item.idmoneda);
                          scope.cbxMoneda.fSelect.display.push(item.codigoiso);
                          return false;
                      }
                  });
              }
          });
          Ext.getCmp('gpMoneda').getSelectionModel().on('selectionchange', function () {
              if(Ext.getCmp('gpMoneda').getSelectionModel().getSelections().length === 0)
                  scope.fResetValues(scope.cbxMoneda);
          });
          Ext.getCmp('gpNiveles').getStore().on('load', function (store, records, options) {
              scope.fValorActual(store, 'Niveles', scope.responseData.Niveles.Actual);
          });
          Ext.getCmp('gpReportes').getSelectionModel().on({
              rowselect: function (selectionModel, rowIndex, record) {
                  Ext.getCmp('btnLoadConf').setDisabled(false);
                  scope.selectedRecord = record;
                  scope.idconceptoentidad = record.data.idconceptocontableestructurae;
                  scope.idformula = record.data.idformula;
                  scope.showDetails();
                  scope.pnlNorth.doLayout();
                  scope.pnlWest.doLayout();
              },
              rowdeselect: function (selectionModel, rowIndex, record) {
                  Ext.getCmp('btnLoadConf').setDisabled(true);
                  scope.selectedRecord = new Object();
                  scope.idconceptoentidad = undefined;
                  scope.idformula = undefined;
              },
              selectionchange: function () {
                  if(Ext.getCmp('gpReportes').getSelectionModel().getSelections().length === 0)
                      scope.fResetValues(scope.cbxReportes);
              }
          });
          scope.stReportes = Ext.getCmp('gpReportes').getStore();
          scope.stReportes.on({
              load: function (store, records, options) {
                  if(store.getTotalCount() > 0) {
                      scope.pnlWest.body.unmask();
                  } else {
                      scope.pnlWest.body.unmask();
                  }
              }
          });
          Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().on({
              rowselect: function (smodel, rowIndex, record) {
                  var indexSInicial = scope.jsDimensiones.find('idnomdimensionesanalisis', '8030', 0, false, true);
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  var indexSAcumulado = scope.jsDimensiones.find('idnomdimensionesanalisis', '8032', 0, false, true);
                  var indexSDiferencia = scope.jsDimensiones.find('idnomdimensionesanalisis', '8033', 0, false, true);
                  var indexSEAnterior = scope.jsDimensiones.find('idnomdimensionesanalisis', '8034', 0, false, true);
                  var indexCPorcentual = scope.jsDimensiones.find('idnomdimensionesanalisis', '8035', 0, false, true);
                  var indexSPromedio = scope.jsDimensiones.find('idnomdimensionesanalisis', '8036', 0, false, true);
                  var indexDispersion = scope.jsDimensiones.find('idnomdimensionesanalisis', '8037', 0, false, true);
                  scope.fSInicial = smodel.isSelected(indexSInicial);
                  scope.fSPeriodo = smodel.isSelected(indexSPeriodo);
                  scope.fSAcumulado = smodel.isSelected(indexSAcumulado);
                  scope.fSDiferencia = smodel.isSelected(indexSDiferencia);
                  scope.fSEAnterior = smodel.isSelected(indexSEAnterior);
                  scope.fSPromedio = smodel.isSelected(indexSPromedio);
                  scope.fCPorcentual = smodel.isSelected(indexCPorcentual);
                  scope.fSDispersion = smodel.isSelected(indexDispersion);
                  if(rowIndex === indexSDiferencia) {
                      smodel.selectRows([indexSPeriodo, indexSAcumulado], true);
                  } else if(smodel.isSelected(indexSPeriodo) && rowIndex === indexSAcumulado) {
                      smodel.selectRow(indexSDiferencia, true);
                  } else if(smodel.isSelected(indexSAcumulado) && rowIndex === indexSPeriodo) {
                      smodel.selectRow(3, true);
                  }
              },
              rowdeselect: function (smodel, rowIndex, record) {
                  var indexSInicial = scope.jsDimensiones.find('idnomdimensionesanalisis', '8030', 0, false, true);
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  var indexSAcumulado = scope.jsDimensiones.find('idnomdimensionesanalisis', '8032', 0, false, true);
                  var indexSDiferencia = scope.jsDimensiones.find('idnomdimensionesanalisis', '8033', 0, false, true);
                  var indexSEAnterior = scope.jsDimensiones.find('idnomdimensionesanalisis', '8034', 0, false, true);
                  var indexCPorcentual = scope.jsDimensiones.find('idnomdimensionesanalisis', '8035', 0, false, true);
                  var indexSPromedio = scope.jsDimensiones.find('idnomdimensionesanalisis', '8036', 0, false, true);
                  var indexDispersion = scope.jsDimensiones.find('idnomdimensionesanalisis', '8037', 0, false, true);
                  scope.fSInicial = smodel.isSelected(indexSInicial);
                  scope.fSPeriodo = smodel.isSelected(indexSPeriodo);
                  scope.fSAcumulado = smodel.isSelected(indexSAcumulado);
                  scope.fSDiferencia = smodel.isSelected(indexSDiferencia);
                  scope.fSEAnterior = smodel.isSelected(indexSEAnterior);
                  scope.fSPromedio = smodel.isSelected(indexSPromedio);
                  scope.fCPorcentual = smodel.isSelected(indexCPorcentual);
                  scope.fSDispersion = smodel.isSelected(indexDispersion);
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
          Ext.getCmp('gpAnalisisFinanciero').getSelectionModel().on({
              rowselect: function (smodel, rowIndex, record) {
                  Ext.getCmp('btnGraficar').enable();
                  Ext.getCmp('gpAnalisisFinanciero').getView().addRowClass(rowIndex, "negrita");
              },
              rowdeselect: function (smodel, rowIndex, record) {
                  Ext.getCmp('gpAnalisisFinanciero').getView().removeRowClass(rowIndex, "negrita");
                  if(smodel.getCount() < 2)
                      Ext.getCmp('btnGraficar').disable();
              }
          });
          Ext.getCmp('trpConfiguraciones').on({
              dblclick: function (nodeDbl, eventDbl) {
                  if(nodeDbl.id == 0)
                      //eventDbl.stopEvent();
                      return;
                  else {
//                      scope.selectedRecord = scope.dvTiposAnalisis.getSelectedRecords()[0];
                      scope.estadof = scope.selectedRecord.data;
                      scope.CargarConfiguracionReporte(nodeDbl);
                  }
              },
              contextmenu: function (nodeCm, eventCm) {
                  nodeCm.select();
                  var c = nodeCm.getOwnerTree().contextMenu;
                  c.contextNode = nodeCm;
                  c.showAt(eventCm.getXY());
              }
          });
          Ext.getCmp('trpConfiguraciones').getLoader().on({
              beforeload: function (treeloader, node) {
                  Ext.getCmp('trpConfiguraciones').getRootNode().eachChild(function (child) {
                      if(child.attributes.idconceptocontestructura == scope.idconceptoentidad && child.attributes.idformula == scope.idformula) {
                          child.getUI().show();
                      } else {
                          child.getUI().hide();
                      }
                  });
              },
              load: function (treeloader, node, response) {
                  if(!Ext.getCmp('trpConfiguraciones').getRootNode().hasChildNodes()) {
                      Ext.getCmp('trpConfiguraciones').getRootNode().getUI().show();
                      mostrarMensaje(1, scope.etiquetas.lbNoConfResults);
                      //scope.aqui va ...(scope.trpVersionesReporte.body.dom, scope.etiquetas.lbInformacion, scope.etiquetas.lbNoConfResults, 1, 3000);
                  }
                  Ext.getCmp('trpConfiguraciones').getRootNode().eachChild(function (child) {
                      if(child.attributes.idconceptocontestructura == scope.idconceptoentidad) {
                          child.getUI().show();
                      } else {
                          child.getUI().hide();
                      }
                  });
              }
          });
      },
      loadData: function (scope) {
          Ext.Ajax.request({
              method: "POST",
              url: "loadData",
              callback: function (options, success, response) {
                  scope.pnlWest.body.mask(scope.etiquetas.lbCargando, 'x-mask-loading');
                  scope.responseData = Ext.decode(response.responseText);
//                if (scope.responseData.Entidades.datos.length > 0) {
//                    Ext.getCmp('gpEntidad').getStore().loadData(scope.responseData.Entidades);
//                }
//                if (scope.responseData.Ejercicios.datos.length > 0) {
//                    Ext.getCmp('gpEjercicio').getStore().loadData(scope.responseData.Ejercicios);
//                }
//                if (scope.responseData.Periodos.datos.length > 0) {
//                    Ext.getCmp('gpPeriodo').getStore().loadData(scope.responseData.Periodos);
//                }
//                if (scope.responseData.Monedas.datos.length > 0) {
//                    Ext.getCmp('gpMoneda').getStore().loadData(scope.responseData.Monedas);
//                }
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
                      callback: function (record, options, success) {
                          scope.fSetearDimensionInicial();
                      }
                  });
                  scope.stReportes.load({
                      callback: function (record, options, success) {
                          if(scope.stReportes.getTotalCount() > 0) {
                              scope.tbCuerpoReporte.activate(0);
                              scope.fpFiltrosBasicosReporte.enable();
                              scope.gpFiltrosAdicionales.enable();
                          } else {
                              mostrarMensaje(1, scope.etiquetas.lbEmptyTextConceptConf, function () {
                                  scope.btnEvaluar.disable();
                                  scope.btnSalvarConfReporte.disable();
                                  scope.btnVistaPreliminar.disable();
                                  scope.pnlNorth.collapse();
                                  scope.pnlWest.collapse();
                                  scope.fpFiltrosBasicosReporte.collapse();
                                  scope.pnlEast.collapse();
                                  scope.pnlCenter.disable();
                                  scope.pnlCenter.doLayout();
                              });
                          }
                      }
                  });
//                          scope.jstTiposAnalisis.load({
//                          callback: function (record, options, success) {
//                          if(scope.jstTiposAnalisis.getTotalCount() > 0) {
//                          scope.tbCuerpoReporte.activate(0);
//                                  scope.fpFiltrosBasicosReporte.enable();
//                                  scope.gpFiltrosAdicionales.enable();
//                          } else {
//                          mostrarMensaje(1, scope.etiquetas.lbEmptyTextConceptConf, function () {
//                          scope.btnEvaluar.disable();
//                                  scope.btnSalvarConfReporte.disable();
//                                  scope.btnVistaPreliminar.disable();
//                                  scope.pnlNorth.collapse();
//                                  scope.pnlWest.collapse();
//                                  scope.fpFiltrosBasicosReporte.collapse();
//                                  scope.pnlEast.collapse();
//                                  scope.pnlCenter.disable();
//                                  scope.pnlCenter.doLayout();
//                          });
//                          }
//                          }
//                          }
//                  );
              }
          });
      },
      initializeFunctions: function (scope) {
          this.fValorActual = function (store, identificador, idActual) {
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
          this.fValorActualCopy = function (store, identificador, identificadorAntecesor, idActual) {
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
          this.findValue = function (list, id) {
              for(j = 0; j < list.length; j++)
                  if(list[j] == id)
                      return true;
              return false;
          };
          this.fSetValuesFechas = function (fechaInicio, fechaFin) {
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
          this.fResetValues = function (component) {
              component.clearValue();
              component.fSelect.values = new Array();
              component.fSelect.display = new Array();
              component.fSelect.index = new Array();
          };
          this.fSetearFechas = function (recordsSelection) {
              recordsLength = recordsSelection.length;
              if(recordsLength > 1) {
                  recordsMenores = scope.fOrdenaFechasMenores(recordsSelection);
                  scope.fSetValuesFechas(scope.fOrdenaFechasMenores(recordsSelection)[0].data.inicio, scope.fOrdenaFechasMayores(recordsSelection)[0].data.fin);
              } else if(recordsLength == 1) {
                  scope.fSetValuesFechas(recordsSelection[0].data.inicio, recordsSelection[0].data.fin);
              } else
                  scope.fResetValuesFecha();
          };
          this.fResetValuesFecha = function () {
              date = new Date().format('d/m/Y');
              scope.dfFechaDesde.setDisabled(true);
              scope.dfFechaHasta.setDisabled(true);
              scope.dfFechaDesde.setValue(null);
              scope.dfFechaHasta.setValue(null);
          };
          this.fFechaMayor = function (fechaUno, fechaDos) {
              var xMes = fechaUno.substring(3, 5);
              var xDia = fechaUno.substring(0, 2);
              var xAnio = fechaUno.substring(6, 10);
              var yMes = fechaDos.substring(3, 5);
              var yDia = fechaDos.substring(0, 2);
              var yAnio = fechaDos.substring(6, 10);
              return (xAnio > yAnio) ? true : ((xAnio == yAnio) ? ((xMes > yMes) ? true : ((xMes == yMes) ? ((xDia > yDia) ? true : false) : false)) : false);
          };
          this.fFechaIguales = function (fechaUno, fechaDos) {
              var xMes = fechaUno.substring(3, 5);
              var xDia = fechaUno.substring(0, 2);
              var xAnio = fechaUno.substring(6, 10);
              var yMes = fechaDos.substring(3, 5);
              var yDia = fechaDos.substring(0, 2);
              var yAnio = fechaDos.substring(6, 10);
              return (xAnio == yAnio) ? ((xMes == yMes) ? ((xDia == yDia) ? true : false) : false) : false;
          };
          this.fOrdenaFechasMenores = function (valores) {
              for(var i = 0; i < valores.length - 1; i++)
                  for(var j = i + 1; j < valores.length; j++)
                      if(this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                          var valor = valores[i];
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
          this.fOrdenaFechasMayores = function (valores) {
              for(var i = 0; i < valores.length - 1; i++)
                  for(var j = i + 1; j < valores.length; j++)
                      if(!this.fFechaMayor(valores[i].data.inicio, valores[j].data.inicio)) {
                          var valor = valores[i];
                          valores[i] = valores[j];
                          valores[j] = valor;
                      }
              return valores;
          };
          this.menuConsolidar = {
              IsValidShow: function (gridPanel, rowIndex) {
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
              GetNodeChildrenSelected: function (gridPanel, nodeChildren) {
                  result = new Array();
                  for(i = 0; i < nodeChildren.length; i++)
                      if(gridPanel.getSelectionModel().isSelected(nodeChildren[i]))
                          result.push(nodeChildren[i]);
                  return result;
              },
              ShowContext: function (gridPanel, flag, node) {
                  Ext.getCmp('btnConsolidar').setVisible(flag);
                  Ext.getCmp('btnNoConsolidar').setVisible(!flag);
                  this.HandleFunction(this, flag, node, gridPanel);
              },
              UpdateData: function (gridPanel) {
                  store = gridPanel.getStore();
                  Ext.getCmp('cbxEntidad').clearValue();
                  gridPanel.getSelectionModel().displaySelect = new Array();
                  recordsSelections = gridPanel.getSelectionModel().getSelections();
                  records = store.getRange(0, store.getCount());
                  store.removeAll();
                  store.add(records);
                  gridPanel.getSelectionModel().selectRecords(recordsSelections);
              },
              HandleFunction: function (scope, flag, node, gridPanel) {
                  if(!flag) {
                      Ext.getCmp('btnNoConsolidar').purgeListeners();
                      Ext.getCmp('btnNoConsolidar').on('click', function () {
                          this.hide();
                          node.text = node.text.replace(" <b>(CONSOLIDAR)</b>", '');
                          node.consolidar = false;
                          scope.UpdateData(gridPanel);
                      });
                  } else {
                      Ext.getCmp('btnConsolidar').purgeListeners();
                      Ext.getCmp('btnConsolidar').on('click', function () {
                          this.hide();
                          node.text = node.text + " <b>(CONSOLIDAR)</b>";
                          node.consolidar = true;
                          scope.UpdateData(gridPanel);
                      });
                  }

              }
          };
          this.showDetails = function () {
              scope.pnlNorth.expand();
              scope.fpFiltrosBasicosReporte.expand();
              scope.tbCuerpoReporte.activate(0);
              scope.btnEvaluar.enable();
              scope.selNode = scope.dvTiposAnalisis.getSelectedNodes();
              scope.tfTitulo.setValue(scope.selectedRecord.data.descripcion);
              scope.taFormula.setValue(scope.selectedRecord.data.formulaDescriptiva);
              scope.idformula = scope.selectedRecord.data.idformula;
              scope.idconceptoentidad = scope.selectedRecord.data.idconceptocontableestructurae;
              if(scope.selNode && scope.selNode.length > 0) {
                  scope.selNode = scope.selNode[0];
                  scope.datos = scope.lookup[scope.selNode.id];
              }
          };
          this.EvaluarAnalisisEconFinanciero = function () {
              if(scope.fpFiltrosBasicosReporte.getForm().isValid()) {
                  this.listEstructurasConsolidan = scope.fObtenerListaEstructuraConsolidan();
                  var saldosSeleccionados = scope.smCheckFiltroAdicional.getSelections();
                  scope.saldos = new Array();
                  scope.saldosStr = new Array();
                  scope.saldosObj = new Array();
                  if(saldosSeleccionados.length > 0) {
                      for(var indiceSaldo = 0; indiceSaldo < saldosSeleccionados.length; indiceSaldo++) {
                          scope.saldos.push(saldosSeleccionados[indiceSaldo]['data']['idnomdimensionesanalisis']);
                          scope.saldosStr.push(saldosSeleccionados[indiceSaldo]['data']['denominacion']);
                          scope.saldosObj.push({
                              "idnomdimensionesanalisis": saldosSeleccionados[indiceSaldo]['data']['idnomdimensionesanalisis'],
                              "denominacion": saldosSeleccionados[indiceSaldo]['data']['denominacion']
                          });
                      }
                      var numMeses = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections().length;
                      var numAnnos = Ext.getCmp('gpEjercicio').getSelectionModel().getSelections().length;
                      if(numMeses > 1 || numAnnos > 1) {
                          scope.generateGroupGrid();
                      } else {
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
                                  'nivel': scope.cbxNiveles.fSelect.values,
                                  'nombreAnalisis': scope.tfTitulo.getValue(),
                                  "idReporte": "5930"
                              },
                              callback: function (options, success, response) {
                                  var respuesta = Ext.decode(response.responseText);
                                  scope.responseDataRpt = Ext.decode(response.responseText);
                                  var cmodel = scope.getColumnVert();
                                  if(respuesta.datos.length > 0) {
                                      scope.tbCuerpoReporte.activate(1);
                                      Ext.getCmp('gpAnalisisVertical').enable();
                                      scope.fConstruirArrayObjetoPrint(scope.responseDataRpt);
                                      scope.gpAnalisis.reconfigure(new Ext.data.GroupingStore({
                                          groupField: 'Entidad', sortInfo: {field: "Entidad", direction: "ASC"},
                                          reader: new Ext.data.ArrayReader({}, scope.columnMappingConfig),
                                          data: respuesta.datos
                                      }), new Ext.grid.ColumnModel(cmodel));
                                      scope.btnSalvarConfReporte.enable();
                                      scope.btnVistaPreliminar.enable();
                                      scope.pnlNorth.collapse();
                                      scope.pnlWest.collapse();
                                      scope.fpFiltrosBasicosReporte.collapse();
                                      scope.pnlEast.collapse();
                                      scope.pnlCenter.doLayout();
                                  } else {
                                      scope.btnEvaluar.disable();
                                      scope.btnSalvarConfReporte.disable();
                                      scope.btnVistaPreliminar.disable();
                                      scope.maskCmp.hide();
                                      Ext.Msg.show({
                                          title: scope.etiquetas.lbInformacion,
                                          msg: scope.etiquetas.lbNoDataConf,
                                          buttons: Ext.Msg.OK,
                                          animEl: 'gpAnalisisFinanciero',
                                          icon: Ext.MessageBox.INFO
                                      });
                                  }
                                  scope.maskCmp.hide();
                              }
                          });
                      }
                  } else {
                      mostrarMensaje(1, scope.etiquetas.lbSelSaldo);
                  }
              } else {
                  scope.fpFiltrosBasicos.body.stopFx();
                  scope.fpFiltrosBasicos.body.highlight();
              }
          };
          this.getColumnHorz = function () {
              return [{
                      id: 'expandir',
                      header: 'Entidad',
                      dataIndex: 'Entidad',
                      hidden: true
                  }, {
                      id: 'expandir',
                      header: 'idestructurae',
                      hidden: true,
                      hideable: false,
                      dataIndex: 'idestructurae',
                      renderer: scope.DetallesReporte,
                      width: 100
                  }, {
                      header: 'Denominaci&oacute;n',
                      dataIndex: 'descripcionestructura',
                      width: 100,
                      hidden: true
                  }, {
                      header: 'C&oacute;digo',
                      dataIndex: 'concat',
                      align: 'left',
                      width: 100,
                      hidden: true,
                      hideable: false
                  }, {
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
                      header: 'text',
                      dataIndex: 'text',
                      hidden: true,
                      hideable: false,
                      width: 400
                  }, {
                      header: 'idmoneda',
                      dataIndex: 'idmoneda',
                      hidden: true,
                      hideable: false,
                      width: 100
                  }, {
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
                  }, {
                      header: 'Ejercicio',
                      dataIndex: 'ejercicio',
                      hidden: true,
                      hideable: false,
                      width: 80
                  }, {
                      header: 'idperiodo',
                      dataIndex: 'idperiodo',
                      hidden: true,
                      hideable: false,
                      width: 100
                  }, {
                      header: 'Per&iacute;odo',
                      dataIndex: 'periodo',
                      hidden: true,
                      hideable: false,
                      width: 80
                  }
              ];
          };
          this.getColumnVert = function () {
              scope.columnMappingConfig = [{
                      name: 'Entidad',
                      mapping: 'descripcionestructura'
                  }, {
                      name: 'idestructurae',
                      mapping: 'idestructurae'
                  }, {
                      name: 'descripcionestructura',
                      mapping: 'descripcionestructura'
                  }, {
                      name: 'type',
                      mapping: 'type'
                  }, {
                      name: 'idpartida',
                      mapping: 'idpartida'
                  }, {
                      name: 'descripcionpartida',
                      mapping: 'descripcionpartida'
                  },
                  {
                      name: 'text',
                      mapping: 'text'
                  }, {
                      name: 'idmoneda',
                      mapping: 'idmoneda'
                  }, {
                      name: 'codigoiso',
                      mapping: 'codigoiso'
                  }, {
                      name: 'idejercicio',
                      mapping: 'idejercicio'
                  }, {
                      name: 'ejercicio',
                      mapping: 'ejercicio'
                  }, {
                      name: 'idperiodo',
                      mapping: 'idperiodo'
                  }, {
                      name: 'periodo',
                      mapping: 'periodo'
                  }];
              var cmVertical = [{
                      id: 'expandir',
                      header: 'Entidad',
                      dataIndex: 'Entidad',
                      hidden: true
                  }, {
                      id: 'expandir',
                      header: 'idestructurae',
                      hidden: true,
                      hideable: false,
                      dataIndex: 'idestructurae',
                      renderer: scope.DetallesReporte,
                      width: 100
                  }, {
                      header: 'Denominaci&oacute;n',
                      dataIndex: 'descripcionestructura',
                      width: 100,
                      hidden: true
                  }, {
                      header: 'C&oacute;digo',
                      dataIndex: 'concat',
                      align: 'left',
                      width: 100,
                      hidden: true,
                      hideable: false
                  }, {
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
                  }, {
                      header: 'Partida',
                      dataIndex: 'descripcionpartida',
                      tooltip: 'Nombre de las cuentas',
                      width: 250,
                      editor: new Ext.form.TextField({
                          allowBlank: false
                      })
                  }, {
                      header: 'text',
                      dataIndex: 'text',
                      hidden: true,
                      hideable: false,
                      width: 400
                  }, {
                      header: 'idmoneda',
                      dataIndex: 'idmoneda',
                      hidden: true,
                      hideable: false,
                      width: 100
                  }, {
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
                  }, {
                      header: 'Ejercicio',
                      dataIndex: 'ejercicio',
                      hidden: true,
                      hideable: false,
                      width: 80
                  }, {
                      header: 'idperiodo',
                      dataIndex: 'idperiodo',
                      hidden: true,
                      hideable: false,
                      width: 100
                  }, {
                      header: 'Per&iacute;odo',
                      dataIndex: 'periodo',
                      hidden: true,
                      hideable: false,
                      width: 80
                  }];
              var saldosCheck = scope.smCheckFiltroAdicional.getSelections();
              Ext.each(saldosCheck, function (saldo) {
                  var headerSaldo = '';
                  var headerTooltip = '';
                  var dataIndexSaldo = '';
                  var hideColumn = true;
                  switch(saldo.data.idnomdimensionesanalisis) {
                      case '8030':
                          {
                              headerSaldo = scope.etiquetas.lbSaldoInicial;
                              headerTooltip = scope.etiquetas.lbTtSaldoInicial;
                              dataIndexSaldo = 'sinicial' + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSInicial) ? false : true;
                              scope.columnMappingConfig.push({name: 'sinicial' + scope.cbxPeriodo.fSelect.values[0], mapping: 'sinicial' + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                      case '8031':
                          {
                              headerSaldo = scope.etiquetas.lbSaldoPeriodo;
                              headerTooltip = scope.etiquetas.lbTtSaldoPeriodo;
                              dataIndexSaldo = 'speriodo' + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSPeriodo) ? false : true;
                              scope.columnMappingConfig.push({name: 'speriodo' + scope.cbxPeriodo.fSelect.values[0], mapping: 'speriodo' + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                      case '8032':
                          {
                              headerSaldo = scope.etiquetas.lbSaldoAcumulado;
                              headerTooltip = scope.etiquetas.lbTtSaldoAcumulado;
                              dataIndexSaldo = 'sacumulado' + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSAcumulado) ? false : true;
                              scope.columnMappingConfig.push({name: 'sacumulado' + scope.cbxPeriodo.fSelect.values[0], mapping: 'sacumulado' + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                      case '8033':
                          {
                              headerSaldo = scope.etiquetas.lbSaldoDiferencia;
                              headerTooltip = scope.etiquetas.lbTtSaldoDiferencia;
                              dataIndexSaldo = 'sdiferencia' + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSDiferencia) ? false : true;
                              scope.columnMappingConfig.push({name: 'sdiferencia' + scope.cbxPeriodo.fSelect.values[0], mapping: 'sdiferencia' + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                      case '8034':
                          {
                              headerSaldo = scope.etiquetas.lbSaldoEjercicioAnterior;
                              headerTooltip = scope.etiquetas.lbTtSaldoEjercicioAnterior;
                              dataIndexSaldo = 'sejercicioanterior' + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSEAnterior) ? false : true;
                              scope.columnMappingConfig.push({name: 'sejercicioanterior' + scope.cbxPeriodo.fSelect.values[0], mapping: 'sejercicioanterior' + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                      default:
                          {
                              headerSaldo = saldo.data.denominacion;
                              headerTooltip = saldo.data.denominacion;
                              dataIndexSaldo = saldo.data.abreviatura + scope.cbxPeriodo.fSelect.values[0];
                              hideColumn = (scope.fSPromedio) ? false : true;
                              scope.columnMappingConfig.push({name: saldo.data.abreviatura + scope.cbxPeriodo.fSelect.values[0], mapping: saldo.data.abreviatura + scope.cbxPeriodo.fSelect.values[0]});
                              cmVertical.push({
                                  header: headerSaldo,
                                  tooltip: headerTooltip,
                                  dataIndex: dataIndexSaldo,
                                  align: 'right',
                                  width: 100,
                                  renderer: scope.FormatoPesos,
                                  hidden: hideColumn
                              });
                          }
                          break;
                  }
              });
              return cmVertical;
          };
          this.generateGroupGrid = function () {
              scope.gridFields = [{
                      name: 'descripcionpartida'
                  }];
              scope.gridColumns = [{
                      header: 'Partidas',
                      dataIndex: 'descripcionpartida',
                      tooltip: 'Nombre de las cuentas',
                      width: 250
                  }];
              scope.rowGroupEjercicio = [{}];
              scope.rowGroupPeriodo = [{}];
              var selectAnnos = Ext.getCmp('gpEjercicio').getSelectionModel().getSelections();
              var selectMeses = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
              var strPeriodos = scope.fObtenerArrayStrPeriodo();
              var estructura = {};
              scope.columnConfig = [{
                      name: 'descripcionestructura'
                  }, {
                      name: 'idestructurae'
                  }, {
                      name: 'descripcionestructura'
                  }, {
                      name: 'type'
                  }, {
                      name: 'text'
                  }, {
                      name: 'idpartida'
                  }, {
                      name: 'idmoneda'
                  }, {
                      name: 'codigoiso'
                  },
                  {
                      name: 'idejercicio'
                  }, {
                      name: 'ejercicio'
                  }, {
                      name: 'idperiodo'
                  }, {
                      name: 'periodo'
                  }];
              if(selectAnnos.length > 1) {
                  Ext.each(selectAnnos, function (anno) {
                      estructura[anno.data.text] = strPeriodos;
                  });
                  iterate(estructura, function (ejercicios, periodos) {
                      scope.columnTempModel = scope.getColumnHorz();
                      scope.rowGroupEjercicio.push({
                          header: ejercicios,
                          align: 'center',
                          colspan: periodos.length * scope.columnTempModel.length
                      });
                      Ext.each(periodos, function (periodo) {
                          scope.rowGroupPeriodo.push({
                              header: periodo + " - " + ejercicios,
                              align: 'center',
                              colspan: scope.columnTempModel.length
                          });
                          Ext.each(scope.columnTempModel, function (cmodel) {
                              scope.gridFields.push({name: cmodel.dataIndex});
                              scope.gridColumns.push(cmodel);
                          });
                      });
                  });
                  scope.rowGroupGrid = [scope.rowGroupEjercicio, scope.rowGroupPeriodo];
              } else {
                  var saldosCheck = scope.smCheckFiltroAdicional.getSelections();
                  Ext.each(selectMeses, function (periodo) {
                      scope.columnTempModel = scope.getColumnHorz();
                      Ext.each(saldosCheck, function (saldo) {
                          var headerSaldo = '';
                          var headerTooltip = '';
                          var dataIndexSaldo = '';
                          var hideColumn = true;
                          switch(saldo.data.idnomdimensionesanalisis) {
                              case '8030':
                                  {
                                      headerSaldo = scope.etiquetas.lbSaldoInicial;
                                      headerTooltip = scope.etiquetas.lbTtSaldoInicial;
                                      dataIndexSaldo = 'sinicial' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSInicial) ? false : true;
                                      scope.columnConfig.push({name: 'sinicial' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                              case '8031':
                                  {
                                      headerSaldo = scope.etiquetas.lbSaldoPeriodo;
                                      headerTooltip = scope.etiquetas.lbTtSaldoPeriodo;
                                      dataIndexSaldo = 'speriodo' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSPeriodo) ? false : true;
                                      scope.columnConfig.push({name: 'speriodo' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                              case '8032':
                                  {
                                      headerSaldo = scope.etiquetas.lbSaldoAcumulado;
                                      headerTooltip = scope.etiquetas.lbTtSaldoAcumulado;
                                      dataIndexSaldo = 'sacumulado' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSAcumulado) ? false : true;
                                      scope.columnConfig.push({name: 'sacumulado' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                              case '8033':
                                  {
                                      headerSaldo = scope.etiquetas.lbSaldoDiferencia;
                                      headerTooltip = scope.etiquetas.lbTtSaldoDiferencia;
                                      dataIndexSaldo = 'sdiferencia' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSDiferencia) ? false : true;
                                      scope.columnConfig.push({name: 'sdiferencia' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                              case '8034':
                                  {
                                      headerSaldo = scope.etiquetas.lbSaldoEjercicioAnterior;
                                      headerTooltip = scope.etiquetas.lbTtSaldoEjercicioAnterior;
                                      dataIndexSaldo = 'sejercicioanterior' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSEAnterior) ? false : true;
                                      scope.columnConfig.push({name: 'sejercicioanterior' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                              default:
                                  {
                                      headerSaldo = saldo.data.denominacion;
                                      headerTooltip = '';
                                      dataIndexSaldo = 'promedio' + periodo.data.idperiodo[0];
                                      hideColumn = (scope.fSPromedio) ? false : true;
                                      scope.columnConfig.push({name: 'promedio' + periodo.data.idperiodo[0]});
                                      scope.columnTempModel.push({
                                          header: headerSaldo,
                                          tooltip: headerTooltip,
                                          dataIndex: dataIndexSaldo,
                                          align: 'right',
                                          width: 100,
                                          renderer: scope.FormatoPesos,
                                          hidden: hideColumn
                                      });
                                  }
                                  break;
                          }
                      });
                      Ext.each(scope.columnConfig, function (gfield) {
                          scope.gridFields.push(gfield);
                      });
                      Ext.each(scope.columnTempModel, function (cmodel) {
                          scope.gridColumns.push(cmodel);
                      });
                      scope.rowGroupPeriodo.push({
                          header: periodo.data.text,
                          align: 'center',
                          colspan: scope.columnTempModel.length
                      });
                  });
                  scope.rowGroupGrid = [scope.rowGroupPeriodo];
              }
              scope.fLoadMaskCmp(scope, scope.gpAnalisisComparativo, "Cargando...");
              Ext.getCmp('pAnalisisHorizontal').remove(Ext.getCmp('pAnalisisHorizontal').getComponent(0), true);
              scope.btnSalvarConfReporteHorz = new Ext.Button({
                  id: 'btnSalvarConfReporteHorz',
                  iconCls: 'guardar',
                  text: scope.etiquetas.lbGuardarConfReporte,
                  tooltip: scope.etiquetas.lbTtGuardarConfReporte,
                  disabled: true,
                  handler: function () {
                      scope.GuardarConfiguracionReporte();
                  }
              });
              scope.btnVistaPreliminarHorz = new Ext.Button({
                  id: 'btnVistaPreliminarHorz',
                  iconCls: 'vistareporte',
                  text: scope.etiquetas.lbVistaReporte,
                  tooltip: scope.etiquetas.lbTtVistaReporte,
                  disabled: true,
                  hidden:true,
                  handler: function () {
                      scope.fOpenWindowReport();
                  }
              });
              scope.btnGraficarHorz = new Ext.Button({
                  id: 'btnGraficarHorz',
                  iconCls: 'graficar',
                  disabled: true,
                  hidden:true,
                  text: scope.etiquetas.lbGraficar,
                  tooltip: scope.etiquetas.lbTtGraficar,
                  handler: function () {
                      scope.fConfGrafica();
                  }
              });
              scope.gridColumnGroup = new Ext.grid.GridPanel({
                  title: "<i class='fa fa-file-text'></i> Estado financiero comparativo",
                  id: 'gpAnalisisGroupFin',
                  layout: 'fit',
                  region: 'center',
                  autoExpandColumn: 'expandir',
                  stripeRows: true,
                  frame: false,
                  border: false,
                  split: true,
                  autoScroll: true,
                  viewConfig: {
                      forceFit: true,
                      autoFill: true
                  },
                  bbar: [scope.btnSalvarConfReporteHorz, "->", scope.btnGraficarHorz, scope.btnVistaPreliminarHorz],
                  sm: new Ext.grid.RowSelectionModel({
                      singleSelect: false,
                      listeners: {
                          rowselect: function (smodel, rowIndex, record) {
                              scope.gridColumnGroup.getView().addRowClass(rowIndex, "negrita");
                              if(smodel.getCount() > 1)
                                  scope.btnGraficarHorz.enable();
                          },
                          rowdeselect: function (smodel, rowIndex, record) {
                              scope.gridColumnGroup.getView().removeRowClass(rowIndex, "negrita");
                              if(smodel.getCount() < 2)
                                  scope.btnGraficarHorz.disable();
                          }
                      }
                  }),
                  store: new Ext.data.JsonStore({
                      url: 'obtenerdatosanalisisreporte',
                      root: 'datos',
                      fields: scope.gridFields,
                      baseParams: {
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
                          'nombreAnalisis': scope.tfTitulo.getValue(),
                          "idReporte": "5930"
                      }
                  }),
                  columns: scope.gridColumns,
                  plugins: new Ext.Cont.ColumnHeaderGroup({
                      rows: scope.rowGroupGrid
                  })
              });
              Ext.getCmp('pAnalisisHorizontal').add(scope.gridColumnGroup);
              Ext.getCmp('pAnalisisHorizontal').enable();
              scope.gridColumnGroup.store.removeAll();
              scope.gridColumnGroup.store.reload({
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
                      'nivel': scope.cbxNiveles.fSelect.values,
                      'nombreAnalisis': scope.tfTitulo.getValue(),
                      "idReporte": "5930"
                  },
                  callback: function (record, options, success) {
                      Ext.getCmp('tbCuerpoReporte').setActiveTab(2);
                      scope.maskCmp.hide();
                      scope.btnSalvarConfReporteHorz.enable();
                      scope.btnVistaPreliminarHorz.enable();
                      scope.pnlNorth.collapse();
                      scope.pnlWest.collapse();
                      scope.fpFiltrosBasicosReporte.collapse();
                      scope.pnlEast.collapse();
                      scope.pnlCenter.doLayout();
                  }
              });
          };
          this.getCountVisibleColumn = function (colModel) {
              var cantColumn = 0;
              for(var i = 0; i < colModel.length; i++) {
                  if(!colModel[i].hidden || colModel[i].hidden == "undefined" || colModel[i].hidden == undefined) {
                      cantColumn++;
                  }
              }
              return cantColumn;
          };
          this.fObtenerArrayStrIdPeriodo = function () {
              if(Ext.getCmp('gpPeriodo').getSelectionModel().getSelections().length > 0) {
                  var select = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
                  var list = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          list.push({periodo: select[i].data.text, idperiodo: select[i].data.idperiodo[0]});
                      }
                  }
                  return list;
              }
              return scope.cbxPeriodo.fSelect.values[0];
          };
          this.fObtenerArrayStrPeriodo = function () {
              if(Ext.getCmp('gpPeriodo').getSelectionModel().getSelections().length > 0) {
                  var select = Ext.getCmp('gpPeriodo').getSelectionModel().getSelections();
                  var list = new Array();
                  for(var i = 0; i < select.length; i++) {
                      if(select[i].data.codigo) {
                          list.push(select[i].data.text);
                      }
                  }
                  return list;
              }
              return scope.cbxPeriodo.fSelect.values[0];
          };
          this.FormatoPesos = function (value, metaData, record, rowIndex, colIndex, store) {
              var saldo = 0;
              var keepCeros = true;
              if(value == 0) {
                  if(!keepCeros) {
                      return '';
                  } else if(keepCeros) {
                      saldo = scope.number_format(value, 2, '.', ',');
                  } else if(keepCeros) {
                      saldo = scope.number_format(value, 2, '.', ',');
                  }
              } else if(value < 0) {
                  saldo = '(' + scope.number_format(value * -1, 2, '.', ',') + ')';
              } else {
                  saldo = scope.number_format(value, 2, '.', ',');
              }
              switch(record.data.type) {
                  case 'total':
                      value = '<b>' + saldo + '</b>';
                      break;
                  case 'totalneto':
                      value = '<b><span style=color:green>' + saldo + '</span></b>';
                      break;
                  case '1':
                      value = '<b>' + saldo + '</b>';
                      break;
                  case 'detalle':
                      value = '';
                      break;
                  default:
                      value = saldo;
                      break;
              }
              return value;
          };
          /**
           * Dar formato contable a un n&uacute;mero.
           * @param {float} <p> The number being formatted. </p>
           * @param * @param {bool} keepCeros [optional] <p>False by default. Use to keep double ceros at end. e.g: <code>100.00</code></p>
           * @returns {String}
           */
          this.setFormatContable = function (number, keepCeros) {
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
          this.number_format = function (number, decimals, dec_point, thousands_sep) {
              number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
              var n = !isFinite(+number) ? 0 : +number,
                      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                      s = '',
                      toFixedFix = function (n, prec) {
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
          this.DetallesReporte = function (value, metaData, record, rowIndex, colIndex, store) {
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
          this.MostrarConfiguracionesReporte = function () {
              scope.trpVersionesReporte.getRootNode().reload();
              Ext.getCmp('tbpVersiones').enable();
              Ext.getCmp('tbpVersiones').setVisible(true);
              Ext.getCmp('tbpVersiones').expand();
          };
          this.GuardarConfiguracionReporte = function () {
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
                          'nombreAnalisis': scope.tfTitulo.getValue(),
                          "idReporte": "900000"
                      },
                      callback: function (options, success, response) {
                          var respuesta = Ext.decode(response.responseText);
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
          this.CargarConfiguracionReporte = function (nodoConf) {
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
              scope.tbCuerpoReporte.activate(0);
              scope.pnlNorth.expand();
              scope.pnlEast.expand();
              scope.fpFiltrosBasicosReporte.expand();
              scope.pnlCenter.doLayout();
              scope.tfTitulo.setValue(scope.conf.titulo);
              this.fSetearDimensiones(scope.conf.idDimensiones);
              this.fSelectValueXCombo(scope, 'Entidad', scope.conf.idEntidades, 'idestructurae', scope.jrEntidad, 'text');
              this.fSelectValueXCombo(scope, 'Ejercicio', scope.conf.idEjercicios, 'idejercicio', scope.jrEjercicio, 'text');
              this.fSelectValueXCombo(scope, 'Periodo', scope.conf.idPeriodos, 'idperiodo', scope.jrPeriodo, 'text');
              this.fSelectValueXCombo(scope, 'Moneda', scope.conf.idMonedasEntidad, 'idmoneda', scope.jrMoneda, 'codigoiso');
              var indice = Ext.getCmp('gpNiveles').getStore().find('nivel', scope.conf.nivel, 0, false, true);
              var vDisplay = Ext.getCmp('gpNiveles').getStore().getAt(indice).nombre;
              Ext.getCmp('cbxNiveles').fSelect.display.push(vDisplay);
              Ext.getCmp('cbxNiveles').fSelect.values.push(scope.conf.nivel);
          };
          this.EliminarConfiguracionReporte = function () {
              var trpNodoConf = scope.trpVersionesReporte.getSelectionModel().getSelectedNode();
              if(scope.trpVersionesReporte.getSelectionModel().getSelectedNode() !== null) {
                  Ext.Ajax.request({
                      url: 'eliminarconfiguracionreporte',
                      method: 'POST',
                      params: {
                          'idconfiguracion': trpNodoConf.attributes.id
                      },
                      callback: function (options, success, response) {
                          var respuesta = Ext.decode(response.responseText);
                          switch(respuesta.codMsg) {
                              case -1:
                                  {
                                      mostrarMensaje(1, scope.etiquetas.lbInfoDelConf, function () {
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
          this.fGetChildrenNodes = function (node, selection) {
              var arrayConsolidar = new Array(node.data.idestructurae);
              for(k = 0; k < selection.length; k++) {
                  if(node.data.ordenizq * 1 < selection[k].data.ordenizq * 1 && node.data.ordender * 1 > selection[k].data.ordender * 1) {
                      arrayConsolidar.push(selection[k].data.idestructurae);
                  }
              }
              return arrayConsolidar;
          };
          this.fObtenerListaEstructuraConsolidan = function () {
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
          this.fObtenerListaEstructura = function (listEstructurasConsolidan) {
              var select = Ext.getCmp('gpEntidad').getSelectionModel().getSelections();
              var list = new Array();
              // if(listEstructurasConsolidan.length > 0) {
              //     for(var i = 0; i < select.length; i++)
              //         if(select[i].data.consolidar)
              //             for(var j = 0; j < select.length; j++)
              //                 if(select[i].data.ordenizq * 1 <= select[j].data.ordenizq * 1 && select[i].data.ordender * 1 <= select[j].data.ordender * 1)
              //                     list.push(select[j].data.idestructurae);
              //     return list;
              // }
              return scope.cbxEntidad.fSelect.values;
          };
          this.fObtenerArrayIdMonedaEntidad = function () {
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
          this.fObtenerArrayStrMonedaEntidad = function () {
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
          this.fObtenerArrayNombreMonedaEntidad = function () {
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
          this.fObtenerArrayIdPeriodo = function () {
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
          this.fObtenerArrayIdEjercicio = function () {
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
          this.fSelectValueXCombo = function (scope, xCombo, arrayIdValores, propiedad, jsCmp, vDisplay) {
              gpComponente = Ext.getCmp('gp' + xCombo);
              cbxComponente = Ext.getCmp('cbx' + xCombo);
              scope.fResetValues(cbxComponente);
              cbxComponente.fSelect.values = arrayIdValores;
              if(gpComponente.getSelectionModel().hasSelection())
                  gpComponente.getSelectionModel().clearSelections();
              var recordSel = new Array();
              Ext.each(arrayIdValores, function (item) {
                  var indexSel = gpComponente.getStore().find(propiedad.toString(), item, 0, false, true);
                  recordSel.push(gpComponente.getStore().getAt(indexSel));
                  cbxComponente.fSelect.display.push(jsCmp.jsonData.datos[indexSel][vDisplay.toString()]);
              });
              if(cbxComponente.fSelect.display.length > 0) {
                  cbxComponente.setValue(cbxComponente.fSelect.display.join(", "));
              }
              gpComponente.getSelectionModel().selectRecords(recordSel, true);
          };
          this.fSetearDimensiones = function (arrayIdDimensiones) {
              arrayIdDimensiones = arrayIdDimensiones || scope.conf.idDimensiones;
              Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().clearSelections();
              Ext.each(arrayIdDimensiones, function (item, index) {
                  var indexDimension = scope.jsDimensiones.find('idnomdimensionesanalisis', scope.conf.idDimensiones[index], 0, false, true);
                  Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().selectRow(indexDimension, true);
              });
          };
          this.fSetearDimensionInicial = function () {
              Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().clearSelections();
              if(scope.jsDimensiones.getTotalCount() > 0) {
                  var indexSPeriodo = scope.jsDimensiones.find('idnomdimensionesanalisis', '8031', 0, false, true);
                  Ext.getCmp('gpFiltrosAdicionales').getSelectionModel().selectRow(indexSPeriodo);
              }
          };
          this.fConstruirArrayObjetoPrint = function (data) {
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
          this.fOpenWindowReport = function () {
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
          this.fLoadMaskCmp = function (scope, cmp, msg) {
              var body = cmp.body || Ext.getBody();
              scope.maskCmp = new Ext.LoadMask(body, {
                  msg: msg
              });
              scope.maskCmp.show();
          };
          this.fConfGrafica = function () {
              scope.fpTipoGrafico = new Ext.form.FormPanel({
                  frame: true,
                  id: 'fpTipoGrafico',
                  region: 'center',
                  labelAlign: 'top',
                  html: "<i class='fa fa-file-text'></i> "
//                  items: [new Ext.DataView({
//                          id: 'dvImage',
//                          style: 'margin:35 0 0 25',
////                          store: scope.setImageDataView('bar'),
//                          tpl: new Ext.XTemplate(
//                                  '<tpl for=".">',
//                                  '<div class="thumb-wrap" id="{name}">',
//                                  '<div class="thumb"><img src="{url}" title="{name}"></div>',
//                                  '<span class="x-editable">{shortName}</span></div>',
//                                  '</tpl>',
//                                  '<div class="x-clear"></div>'
//                                  ),
//                          autoHeight: true,
//                          autoShow: true,
//                          overClass: 'x-view-over',
//                          itemSelector: 'div.thumb-wrap',
//                          emptyText: scope.etiquetas.lbNoImage
//                      })]
              });
              scope.fpConfiguracion = new Ext.form.FormPanel({
                  frame: true,
                  border: false,
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
                                  emptyText: scope.etiquetas.lbTtlGrafico,
                                  anchor: '95%',
                                  maxLength: 50,
                                  invalidText: scope.etiquetas.lbInvalidText,
                                  regexText: scope.etiquetas.lbInvalidText,
                                  maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\"\-\_\/\(\)\.\#\+\,\%\&]+$/,
                                  regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\.\#\+\,\%\&]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\"\-\_\/\(\)\.\#\+\,\%\&]*)+$/,
                                  enableKeyEvents: true
//                                  listeners: {
//                                      'keyup': function() {
//                                          scope.verificarConfGraf();
//                                      },
//                                      'invalid': function(cmp, msg) {
//                                          if(cmp.getValue().length > 0) {
//                                              var vtext = cmp.getValue().trim();
//                                              cmp.setValue(vtext);
//                                          }
//                                          scope.verificarConfGraf();
//                                      },
//                                      'blur': function(cmp) {
//                                          if(cmp.getValue().length > 0) {
//                                              var vtext = cmp.getValue().trim();
//                                              cmp.setValue(vtext);
//                                          }
//                                          scope.verificarConfGraf();
//                                      }
//                                  }
                              }), new Ext.form.ComboBox({
                                  id: 'cbxTipoGrafico',
                                  fieldLabel: scope.etiquetas.lbTipoGrafico,
                                  store: new Ext.data.SimpleStore({
                                      fields: ['id', 'tipo', 'img'],
                                      // data: [['pie', 'Pastel', 'pie'], ['column', 'Columnas', 'bar'], ['line', 'Lineas', 'line']]
                                      data: [['pie', 'Pastel', 'pie']]
                                  }),
                                  valueField: 'id',
                                  displayField: 'tipo',
                                  hiddenName: 'id',
                                  tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item"><i class="fa fa-{img}-chart"></i> {tipo}</div></tpl>',
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
                                      select: function (combo, record, index) {
                                          var faChartGet = Ext.get('faChart');
                                          faChartGet.removeClass(faChartGet.dom.className);
                                          faChartGet.toggleClass('fa fa-' + record.data.img + '-chart fa-5x');
//                                          Ext.getCmp('dvImage').setStore(scope.setImageDataView(Ext.getCmp('cbxTipoGrafico').getValue()));
//                                          scope.verificarConfGraf();
                                      },
                                      render: function () {
//                                          Ext.getCmp('dvImage').setStore(scope.setImageDataView('pie'));
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
                                      'select': function () {
//                                          scope.verificarConfGraf();
                                      }
                                  }
                              })]}, {
                          xtype: 'fieldset',
                          title: 'Leyenda',
                          autoHeight: true,
                          autoWidth: true,
                          id: 'fsLeyendaGrafica',
                          checkboxName: 'chkLeyenda',
                          checkboxToggle: true,
                          collapsed: false,
                          collapsible: false,
                          checked: false,
                          maskDisabled: false,
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
                                      'select': function () {
//                                          scope.verificarConfGraf();
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
                                      'select': function () {
//                                          scope.verificarConfGraf();
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
                                      'select': function () {
//                                          scope.verificarConfGraf();
                                      }
                                  }
                              })],
                          listeners: {
                              collapse: function (p) {
                                  p.checked = false;
                                  scope.winConfGrafica.syncSize();
                              },
                              expand: function (p) {
                                  p.checked = true;
                                  scope.winConfGrafica.syncSize();
                              }
                          }
                      }]
              });
              scope.winConfGrafica = new Ext.Window({
                  title: scope.etiquetas.lbTtlSelGraficar,
                  bodyStyle: 'padding:5px 10px 5px 10px',
                  border: false,
                  resizable: true,
                  modal: true,
                  constrain: true,
                  defaultButton: 0,
                  id: 'winConfGrafica',
                  layout: 'border',
                  height: 455,
                  width: 600,
                  items: [scope.fpConfiguracion, {
                      frame: true,
                      border: false,
                      id: 'fpTipoGrafico',
                      region: 'center',
                      labelAlign: 'top',
                      html: "<div><center><i id='faChart' class='fa fa-pie-chart fa-5x' style='align: center; margin-top: 50px; font-size: 10em'></i></center></div> "}],
                  buttons: [scope.btnCancelarGraf = new Ext.Button({
                      id: 'btnCancelarGraf',
                      text: scope.etiquetas.lbBtnCancelar,
                      tooltip: scope.etiquetas.lbTtCancelarGraf,
                      iconCls: 'cancelar',
                      handler: function () {
                          Ext.getCmp('winConfGrafica').close();
                      }
                  }), scope.btnAceptarGraf = new Ext.Button({
                      id: 'btnAceptarGraf',
                      text: scope.etiquetas.lbBtnAceptar,
                      tooltip: scope.etiquetas.lbTtAceptarGraf,
                      iconCls: 'aceptar',
                      handler: function () {
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
//          this.setImageDataView = function(name) {
//              return new Ext.data.SimpleStore({
//                  fields: ['url', 'name'],
//                  data: [["/contabilidad/comun/images/" + name + ".png", name]]
//              });
//          };
          this.fGraficar = function (config) {
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
                          handler: function () {
                              Ext.getCmp('winGrafica').close();
                          }
                      }]
              });
              scope.winGrafica.show();
              scope.winGrafica.show();
              scope.winGrafica.show();
              var gSelections = Ext.getCmp('gpAnalisisFinanciero').getSelectionModel().getSelections();
              var gData = new Array();
              var totalSaldo = 0;
              Ext.each(gSelections, function (item, index) {
                  var speriodo = 'speriodo' + item.data.idperiodo;
                  if(parseFloat(item.data[speriodo]) < 0) {
                      totalSaldo += parseFloat(item.data[speriodo]) * -1;
                  } else
                      totalSaldo += parseFloat(item.data[speriodo]);
              });
              var colors = Highcharts.getOptions().colors;
              Ext.each(gSelections, function (item, index) {
                  var speriodo = 'speriodo' + item.data.idperiodo;
                  var percentil = 0;
                  var cantItem = 0;
                  if(parseFloat(item.data[speriodo]) < 0) {
                      cantItem = (parseFloat(item.data[speriodo]) * -1).toFixed(2);
                  } else {
                      cantItem = parseFloat(item.data[speriodo]).toFixed(2);
                  }
                  percentil = (parseFloat(item.data[speriodo]) / totalSaldo) * 100;
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
                                  formatter: function () {
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
                                          formatter: function () {
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
                                  formatter: function () {
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
                                  formatter: function () {
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
                                          formatter: function () {
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
                                  formatter: function () {
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
                                          formatter: function () {
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
          this.verificarConfGraf = function () {
              if(Ext.getCmp('fpConfiguracion').getForm().isValid()) {
                  Ext.getCmp('btnAceptarGraf').setDisabled(false);
              } else {
                  Ext.getCmp('btnAceptarGraf').setDisabled(true);
              }
          };
      },
      initMsgWarning: function (idWarning) {
          switch(idWarning) {
              case 1 :
                  {
                      mostrarMensaje(1, scope.etiquetas.lbNoConfEstructuraEcon, scope.disableFilters);
                  }
                  break;
              case 2 :
                  {
                      mostrarMensaje(1, scope.etiquetas.lbNoConfEjercicio, scope.disableFilters);
                  }
                  break;
              case 3 :
                  {
                      mostrarMensaje(1, scope.etiquetas.lbNoConfPer, scope.disableFilters);
                  }
                  break;
              case 4 :
                  {
                      mostrarMensaje(1, scope.etiquetas.lbNoConfMoneda, scope.disableFilters);
                  }
                  break;
              case 5 :
                  {
                      mostrarMensaje(1, scope.etiquetas.lbNoConfNivel, scope.disableFilters);
                  }
                  break;
          }
      },
      disableFilters: function (btn) {
          if(btn == 'ok') {
              window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
              scope.btnEvaluar.disable();
              scope.btnSalvarConfReporte.disable();
              scope.btnVistaPreliminar.disable();
              scope.pnlNorth.collapse();
              scope.pnlWest.collapse();
              scope.fpFiltrosBasicosReporte.collapse();
              scope.pnlEast.collapse();
              scope.pnlCenter.disable();
              scope.pnlCenter.doLayout();
          }
      }
  });
  new Ext.CONT.AnalisisFinanciero.ClassEvaluarAnalisis();
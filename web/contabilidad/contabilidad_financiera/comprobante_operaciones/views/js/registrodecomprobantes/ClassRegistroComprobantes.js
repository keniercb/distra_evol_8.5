  Ext.namespace('Ext.ClassRegistroComprobantes');
  Ext.ClassRegistroComprobantes = Ext.extend(Ext.Component, {
      objClassComprobante: undefined,
      objClassBuscarComprobante: undefined,
      arrayValuesSelections: new Array(),
      map: undefined,
      etiquetas: undefined,
      constructor: function() {
          Ext.QuickTips.init();
          Ext.Ajax.timeout = 6000000;
          perfil = window.parent.perfil;
          Ext.CONT.Componentes.MessageBox('msgbIniciando', 'Cargando registro...');
          if(!document.getElementById('UIRegistroComprobantes'))
              this.loadJs("../../views/js/registrodecomprobantes/UIRegistroComprobantes", 'UIRegistroComprobantes');
          if(!document.getElementById('ClassBuscarComprobante'))
              this.loadJs("../../views/js/registrodecomprobantes/ClassBuscarComprobante", 'ClassBuscarComprobante');
          if(!document.getElementById('UIBuscarComprobante'))
              this.loadJs("../../views/js/registrodecomprobantes/UIBuscarComprobante", 'UIBuscarComprobante');
          if(!document.getElementById('ClassXCombo'))
              this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/ClassXCombo", 'ClassXCombo');
          if(!document.getElementById('UIXCombo'))
              this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/UIXCombo", 'UIXCombo');
          if(!document.getElementById('UXTreeGrid'))
              this.loadJs("/contabilidad/comun/componentes/xcombo/views/js/TreeGrid", 'UXTreeGrid');
          if(!document.getElementById('Notification'))
              this.loadJs("/contabilidad/comun/componentes/Notification/js/Ext.Cont.Notification", 'Notification');
          var scope = this;
          Ext.Ajax.request({
              method: "POST",
              url: "cargaretiquetas",
              callback: function(options, success, response) {
                  scope.etiquetas = Ext.decode(response.responseText);
                  scope.initializeClass();
              }
          });
      },
      loadJs: function(jsSrc, id) {
          if(jsSrc !== null) {
              var tagScript = document.createElement("script");
              tagScript.setAttribute("type", "text/javascript");
              tagScript.setAttribute("id", id);
              tagScript.setAttribute("src", jsSrc + ".js");
              document.getElementsByTagName("body")[0].appendChild(tagScript);
          }
      },
      initializeClass: function(scope) {
          this.ViewPort = new Ext.UIRegistroComprobantes.ViewPort(this, {
              items: [this.pnlContenedor = new Ext.UIRegistroComprobantes.pnlContenedor(this)]
          });
          this.initializeEvents(this);
          this.initializeFunctions(this);
          this.initializeKeyMap(this);
          this.loadDataComponent(this);
          return Ext.ClassRegistroComprobantes.superclass.constructor.call(this);
      },
      loadDataComponent: function(scope) {
          Ext.Ajax.request({
              method: "POST",
              url: "loadDataComponent",
              callback: function(options, success, response) {
                  var responseData = Ext.decode(response.responseText);
                  scope.aperturado = responseData.aperturado;
                  scope.habilitarGeneracion = responseData.habilitarGeneracion;
                  // if (scope.habilitarGeneracion == 0) {
                  //     scope.btnNewUIComprobanteTipoOperaciones.disable();
                  //     // scope.btnNewUIComprobanteTipoOperaciones.hide();
                  // }

                  if(scope.aperturado == 0) {
                      scope.lbInformacionPeriodo.setText('<b>' + 'Carga inicial: ' + '</b> ' + responseData.fecha + '</b>', false);
                      visible = false;
                  }
                  else {
                      visible = true;
                      scope.lbInformacionPeriodo.setText('Per\u00EDodo actual ' + '<b>' + responseData.periodo.nombre + '</b>, ' + 'desde ' + '<b>' + responseData.periodo.inicio + '</b> ' + 'hasta ' + '<b>' + responseData.periodo.fin + '</b>. ' + 'Fecha contable' + '<b> ' + responseData.fecha + '</b>.', false);
                  }
                  scope.btnPasarFecha.setVisible(visible);
                  scope.btnBuscarComprobantes.setVisible(visible);
                  scope.btnImportar.setVisible(true);
                  // scope.btnImportar.setVisible(visible);

                  var fechaMin = new Date();
                  fechaMin = Date.parseDate(responseData.fecha, "d/m/Y");
                  scope.btnPasarFecha.menu.picker.minDate = fechaMin;
                  var fechaMax = new Date();
                  fechaMax = Date.parseDate(responseData.periodo.fin, "d/m/Y");
                  scope.btnPasarFecha.menu.picker.maxDate = fechaMax;
                  var fechaActual = Date.parseDate(responseData.fecha, "d/m/Y");
                  scope.btnPasarFecha.menu.picker.setValue(fechaActual);
                  scope.stRegistroComprobantes.load();
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
              }
          });
      },
      initializeEvents: function(scope) {
          this.stRegistroComprobantes.on('beforeload', function() {
              scope.tbGpComprobantes.disable();
              scope.lMaskGpRegistro = new Ext.UIRegistroComprobantes.loadMask(scope.gpRegistroComprobantes.body, 'Cargando comprobantes...');
              scope.lMaskGpRegistro.show();
          });
          this.stRegistroComprobantes.on('load', function(store, records, options) {
              scope.lMaskGpRegistro.hide();
              scope.tbGpComprobantes.enable();
             // scope.gpRegistroComprobantes.getSelectionModel().selectFirstRow();
              scope.btnGraficarComprobantes.setVisible((records.length > 0) ? true : false);
          });
          this.stRegistroComprobantes.on('loadexception', function() {
              scope.lMaskGpRegistro.disable();
              scope.tbGpComprobantes.show();
          });
          this.btnBuscarComprobantes.on('click', function() {
              scope.fShowBuscarComprobantes();
          });
          this.btnMenuComprobante.on('toggle', function() {
              scope.menuActions.show();
          });
          this.menuActions.on('beforeshow', function() {
              scope.fBeforeMenuShow();
          });
          this.gpRegistroComprobantes.on('rowcontextmenu', function(gridPanel, rowIndex, e) {
              e.stopEvent();
              selections = scope.fGetSelectionsOnPaging();
              if(selections.length > 1) {
                  textNumeros = '';
                  for(i = 0; i < selections.length; i ++)
                      textNumeros += (i === 0) ? selections[i].numeroComprobante : ', ' + selections[i].numeroComprobante;
                  mostrarMensaje(1, scope.etiquetas.msgcantselect1 + textNumeros + scope.etiquetas.msgcantselect3);
              }
//            scope.btnNewUIComprobante.hide();
              scope.btnNewUIComprobanteTipoOperaciones.hide();
              scope.gpRegistroComprobantes.contextMenu = scope.menuActions;
              scope.gpRegistroComprobantes.contextMenu.showAt(e.getXY());

          });
          this.gpRegistroComprobantes.on('rowdblclick', function(gridPanel, rowIndex, e) {
              selections = scope.fGetSelectionsOnPaging();
              if(selections.length > 1)
                  scope.fShowComprobantesSelectedMessage(gridPanel, selections, rowIndex);
              else
                  scope.fOpenUIComprobanteContable();
          });
          /*this.gpRegistroComprobantes.on('rowcontextmenu', function(gridPanel, rowIndex, e) {
           gridPanel.getSelectionModel().selectRow(rowIndex);
           if (gridPanel.selModel.getSelected().data.idEstadoComprobante === '8033')
           scope.btnDeleteUIComprobante.show();
           else
           scope.btnDeleteUIComprobante.hide();
           });*/
          this.btnMenuComprobante.on('click', function() {
//            scope.btnNewUIComprobante.show();
              scope.btnNewUIComprobanteTipoOperaciones.show();
          });
          this.btnNewUIComprobanteTipoOperaciones.on('click', function() {
              scope.fUIComprobanteContable({
                  accion: 1,
                  tipoComprobante: 3,
                  idSubsistema: 4
              });
          });
          this.btnOpenUIComprobante.on('click', function() {
              scope.fOpenUIComprobanteContable();
          });
          this.ptRegistroComprobantes.on('beforechange', function() {
              instance = new PagingToolbarSelections({
                  'selections': scope.gpRegistroComprobantes.getSelectionModel().getSelections(),
                  'activePage': this.getPageData().activePage
              });
              instance.saveSelectionsOnPage(scope.arrayValuesSelections);
          });
          this.ptRegistroComprobantes.on('change', function() {
              instance = new PagingToolbarSelections({
                  'activePage': this.getPageData().activePage
              });
              instance.setSelectionsOnPage(scope.arrayValuesSelections, scope.gpRegistroComprobantes);
          });
          this.btnViewReportUIComprobante.on('click', function() {
              scope.fObtenerDatosImprimirReporte('report');
          });
          this.btnChangeNumberUIComprobante.on('click', function() {
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fChangeNumberUIComprobante();
              }
              mostrarMensaje(2, scope.etiquetas.msgfChangeNumber, fAcepto);
          });
          this.btnInvertUIComprobante.on('click', function() {
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fInvertDuplicateComprobante(true);
              }
              mostrarMensaje(2, scope.etiquetas.msgfInvertDuplicateComprobante, fAcepto);
          });
          this.btnDuplicateUIComprobante.on('click', function() {
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fInvertDuplicateComprobante(false);
              }
              mostrarMensaje(2, scope.etiquetas.msgfInvertDuplicateComprobante1, fAcepto);
          });
          this.btnAnularUIComprobante.on('click', function() {
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fAnularComprobante();
              }
              mostrarMensaje(2, scope.etiquetas.msgfAnularComprobante, fAcepto);
          });
          /*this.btnDeleteUIComprobante.on('click', function(component) {
           selection = scope.fGetSelectionsOnPaging();
           function fAcepto(btn)
           {
           if (btn === 'ok')
           scope.fDeleteComprobante(selection);
           }
           text = (selection.length > 1) ? scope.etiquetas.msglos : scope.etiquetas.msgel;
           mostrarMensaje(2, scope.etiquetas.msgfDeleteComprobante + text + '?', fAcepto);
           });*/
          this.btnChangeStateUIComprobante.on('click', function() {
              selection = scope.fGetSelectionsOnPaging();
              function fAcepto(btn) {
                  if(btn === 'ok')
                      scope.fChangeStateUIComprobante(selection, selection[0].idEstadoComprobante);
              }
              text = (selection.length > 1) ? scope.etiquetas.msgalos : scope.etiquetas.msgal;
              mostrarMensaje(2, scope.etiquetas.msgfChangeStateUIComprobante + text + '?', fAcepto);
          });
          this.btnGraficarComprobantes.on('click', function() {
              scope.fGraphComprobantes();
          });
          this.btnImportar.on('click', function() {
              scope.fConfigurarImportar();
          });
          this.btnExportarComprobante.on('click', function() {
              scope.fObtenerDatosImprimirReporte('export');
          });
          this.dmPasarFecha.on({
              'select': function(picker, date) {
                  function pasarDia(btn) {
                      if(btn == 'ok') {
                          Ext.Msg.wait(scope.etiquetas.msgCargando, scope.etiquetas.msgEsperar);
                          Ext.Ajax.request({
                              method: "POST",
                              params: {fechaActual: date.format('d/m/Y')},
                              url: "pasarDia",
                              callback: function(options, success, response) {
                                  Ext.Msg.hide();
                                  var responseData = Ext.decode(response.responseText);
                                  mostrarMensaje(1, String.format(scope.etiquetas.lbSubSistContabCloseDay, responseData.fechaPasada, responseData.fechaActual), function() {
                                      scope.loadDataComponent(scope);
                                      var fechaActual = new Date();
                                      fechaActual = Date.parseDate(responseData.fechaActual, "d/m/Y");
                                      picker.minDate = fechaActual;
                                      picker.setValue(fechaActual);
                                      picker.setMinDate(fechaActual);
                                  });
                              }
                          });
                      }
                  }
                  mostrarMensaje(2, String.format(scope.etiquetas.promptPasarDia, date.format('d/m/Y')), pasarDia);
              }
          });
      },
      initializeFunctions: function(scope) {
          this.fShowComprobantesSelectedMessage = function(gridPanel, selections, rowIndex) {
              function fAcepto(btn) {
                  if(btn === 'ok') {
                      scope.arrayValuesSelections = new Array();
                      selectionModel = gridPanel.getSelectionModel();
                      selectionModel.clearSelections();
                      selectionModel.selectRow(rowIndex);
                  }
              }
              textNumeros = '';
              for(i = 0; i < selections.length; i ++)
                  textNumeros += (i === 0) ? selections[i].numeroComprobante : ', ' + selections[i].numeroComprobante;
              mostrarMensaje(2, scope.etiquetas.msgcantselect1 + textNumeros + scope.etiquetas.msgcantselect2 + gridPanel.getStore().getAt(rowIndex).data.numeroComprobante + '</b>?', fAcepto);
          };
          this.fShowBuscarComprobantes = function() {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgfShowBuscarComprobantes, scope.etiquetas.msgEsperar);
              var self = this;
              self.map.disable();
              this.btnBuscarComprobantes.disable();
              this.objClassBuscarComprobante = new Ext.ClassBuscarComprobante(scope.etiquetas);
              this.objClassBuscarComprobante.addListener('closeBuscar', function(cancel, infoAgrupada, params, buscar) {
                  self.map.enable();
                  scope.btnBuscarComprobantes.enable();
                  scope.objClassBuscarComprobante = undefined;
                  if(!cancel) {
                      scope.stRegistroComprobantes.baseParams.params = Ext.encode(params);
                      scope.stRegistroComprobantes.baseParams.start = 0;
                      scope.stRegistroComprobantes.load({
                          callback: function(options, success, response) {
                              scope.arrayValuesSelections = new Array();
                              columnModel = scope.gpRegistroComprobantes.getColumnModel();
                              indexSubsistema = columnModel.getIndexById('subsistema');
                              if(!infoAgrupada)
                                  scope.stRegistroComprobantes.clearGrouping();
                              else
                                  scope.stRegistroComprobantes.groupBy('subsistema');
                              columnModel.setHidden(indexSubsistema, infoAgrupada);
                              if(buscar && options.length == 0)
                                  mostrarMensaje(2, scope.etiquetas.MsgInformacionSinResultadoSearch);
                          }
                      });
                  }
              });
          };
          this.fUIComprobanteContable = function(params) {
              this.menuActions.hide();
              var self = this;
              params.habilitarGeneracion = scope.habilitarGeneracion;
              self.map.disable();
              this.objClassComprobante = new Ext.ClassComprobante(params);
              this.objClassComprobante.addListener('closeUIComprobante', function(accion, reloadGrid, idcomprobante) {
                  self.map.enable();
                  scope.gpRegistroComprobantes.syncSize();
                  scope.gpRegistroComprobantes.doLayout();
                  if(idcomprobante) {
                      params.idComprobante = idcomprobante;
                      params.reloadGridRegistroComprobantes = reloadGrid;
                      scope.fUIComprobanteContable(params);
                  }
                  else if(reloadGrid) {
                      if(accion === 1)
                          scope.stRegistroComprobantes.load();
                      else
                          scope.stRegistroComprobantes.reload();
                  }
              });
          };
          this.fOpenUIComprobanteContable = function() {
              selections = this.fGetSelectionsOnPaging();
              if(selections.length === 1)
              {
                  recordSelected = selections[0];
                  scope.fUIComprobanteContable({
                      accion: 2,
                      tipoComprobante: parseInt(recordSelected.idTipoComprobante),
                      idComprobante: recordSelected.idComprobante,
                      idEstructurae: recordSelected.idEstructurae,
                      idSubsistema: recordSelected.idSubsistema
                  });
              }
          };
          this.fGetSelectionsOnPaging = function() {
              instance = new PagingToolbarSelections({
                  'selections': scope.gpRegistroComprobantes.getSelectionModel().getSelections(),
                  'activePage': scope.ptRegistroComprobantes.getPageData().activePage
              });
              return instance.getSelectionsOnArray(scope.arrayValuesSelections);
          };
          this.fWithDifferentState = function(arraySelections) {
              for(i = 0; i < arraySelections.length - 1; i++)
                  for(j = i + 1; j < arraySelections.length; j++)
                      if(arraySelections[i].idEstadoComprobante !== arraySelections[j].idEstadoComprobante)
                          return true;
              return false;
          };
          this.fAllTheSameState = function(arraySelections, state) {
              for(i = 0; i < arraySelections.length; i++)
                  if(arraySelections[i].idEstadoComprobante !== state)
                      return false;
              return true;
          };
          this.fLeastOne = function(arraySelections, state) {
              for(i = 0; i < arraySelections.length; i++)
                  if(arraySelections[i].idEstadoComprobante === state)
                      return true;
              return false;
          };
          this.fLeastOneDifferent = function(arraySelections, state) {
              for(i = 0; i < arraySelections.length; i++)
                  if(arraySelections[i].idSubsistema !== state)
                      return true;
              return false;
          };
          this.fBeforeMenuShow = function() {
              arraySelections = this.fGetSelectionsOnPaging();
              length = arraySelections.length;
              if(length > 0) {
                  scope.btnAnularUIComprobante.hide();
                  if(this.fWithDifferentState(arraySelections)) {
                      scope.btnOpenUIComprobante.hide();
                      scope.btnChangeStateUIComprobante.hide();
                      scope.btnChangeNumberUIComprobante.hide();
                      scope.btnDuplicateUIComprobante.hide();
                      scope.btnInvertUIComprobante.hide();
                      scope.btnViewReportUIComprobante.show();
                      scope.btnExportarComprobante.hide();
                  } else {
                      if(length === 1) {
                          scope.btnOpenUIComprobante.show();
                          scope.btnChangeNumberUIComprobante.hide();
                          switch(arraySelections[0].idEstadoComprobante) {
                              case '8030':
                                  {
                                      scope.btnExportarComprobante.show();
                                      scope.btnAnularUIComprobante.show();
                                      scope.btnDuplicateUIComprobante.hide();
                                      scope.btnInvertUIComprobante.hide();
                                      scope.btnChangeStateUIComprobante.show();
                                      scope.btnChangeStateUIComprobante.setText(scope.etiquetas.msgBtnTerminar);
                                  }
                                  break;
                              case '8031':
                                  {
                                      scope.btnExportarComprobante.show();
                                      scope.btnDuplicateUIComprobante.hide();
                                      scope.btnInvertUIComprobante.hide();
                                      if(!this.fLeastOneDifferent(arraySelections, 4)) {
                                          scope.btnAnularUIComprobante.show();
                                      } else {
                                          scope.btnAnularUIComprobante.hide();
                                      }
                                      // scope.btnAnularUIComprobante.show();
                                      scope.btnChangeStateUIComprobante.show();
                                      scope.btnChangeStateUIComprobante.setText(scope.etiquetas.msgBtnAsentar);
                                  }
                                  break;
                              case '8033':
                                  {
                                      scope.btnDuplicateUIComprobante.hide();
                                      scope.btnInvertUIComprobante.hide();
                                      scope.btnExportarComprobante.show();
                                      scope.btnAnularUIComprobante.show();
                                  }
                                  break;
                              case '8034':
                                  {
                                      scope.btnExportarComprobante.hide();
                                      scope.btnAnularUIComprobante.hide();
                                  }
                                  break;
                              default:
                                  {
                                      scope.btnExportarComprobante.show();
                                      scope.btnAnularUIComprobante.hide();
                                      scope.btnChangeStateUIComprobante.hide();
                                      scope.btnChangeStateUIComprobante.setText(scope.etiquetas.msgBtnTerminar);
                                      scope.btnInvertUIComprobante.show();
                                      if(!this.fLeastOneDifferent(arraySelections, 4)) {
                                          scope.btnDuplicateUIComprobante.show();
                                      } else {
                                          scope.btnDuplicateUIComprobante.hide();
                                      }
                                  }
                                  break;
                          }
                          // if(!this.fLeastOneDifferent(arraySelections, 4)) {
                          //     scope.btnDuplicateUIComprobante.show();
                          //     // scope.btnInvertUIComprobante.show();
                          // } else {
                          //     scope.btnDuplicateUIComprobante.hide();
                          //     // scope.btnInvertUIComprobante.hide();
                          // }
                      } else {
                          scope.btnOpenUIComprobante.hide();
                          scope.btnDuplicateUIComprobante.hide();
                          scope.btnInvertUIComprobante.hide();
                          scope.btnChangeNumberUIComprobante.hide();
                      }
                      scope.btnViewReportUIComprobante.show();
                      if(this.fAllTheSameState(arraySelections, '8031')) {
                          scope.btnChangeNumberUIComprobante.hide();
                          scope.btnChangeStateUIComprobante.show();
                          scope.btnChangeStateUIComprobante.setText(scope.etiquetas.msgBtnAsentar);
                          scope.btnExportarComprobante.show();
                      } else if(this.fAllTheSameState(arraySelections, '8032')) {
                          scope.btnAnularUIComprobante.hide();
                          scope.btnChangeStateUIComprobante.hide();
                          scope.btnChangeNumberUIComprobante.hide();
                          scope.btnExportarComprobante.show();
                      } else if(this.fAllTheSameState(arraySelections, '8033')) {
                          scope.btnChangeStateUIComprobante.hide();
//                        scope.btnDeleteUIComprobante.show();
                          scope.btnExportarComprobante.hide();
                      } else if(this.fAllTheSameState(arraySelections, '8034')) {
                          scope.btnChangeStateUIComprobante.hide();
                          scope.btnAnularUIComprobante.hide();
                          scope.btnDuplicateUIComprobante.hide();
                          scope.btnInvertUIComprobante.hide();
                          scope.btnExportarComprobante.show();
                      } else {
                          scope.btnChangeStateUIComprobante.show();
                          scope.btnChangeStateUIComprobante.setText((arraySelections[0].idEstadoComprobante === '8030') ? scope.etiquetas.msgBtnTerminar : scope.etiquetas.msgBtnAsentar);
                          scope.btnExportarComprobante.show();
                      }
                  }
              } else {
                  scope.btnOpenUIComprobante.hide();
                  scope.btnAnularUIComprobante.hide();
                  scope.btnChangeStateUIComprobante.hide();
                  scope.btnChangeNumberUIComprobante.hide();
                  scope.btnDuplicateUIComprobante.hide();
                  scope.btnInvertUIComprobante.hide();
                  scope.btnViewReportUIComprobante.show();
                  scope.btnExportarComprobante.hide();
              }
          };
          this.fObtenerDatosImprimirReporte = function(argTypeAction) {
              var typeAction = argTypeAction || 'report';
              if(typeAction == 'report') {
                  Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargandodatosparareporte, scope.etiquetas.msgEsperar);
              } else {
                  Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.lbMsgCargandoDatosExportar, scope.etiquetas.msgEsperar);
              }
              listResult = new Array();
              arrayPrint = scope.fGetSelectionsOnPaging();
              if (this.gpRegistroComprobantes.getSelectionModel().getSelected()) {
                  var idComprobante = this.gpRegistroComprobantes.getSelectionModel().getSelected().idComprobante;
              }
              var stparam = this.gpRegistroComprobantes.getStore().baseParams.params;
              var arrayIdCmp = [];
              for(var i = 0; i < arrayPrint.length; i++) {
                  listResult.push({typeAction: typeAction, idcomprobante: arrayPrint[i].idComprobante, idestructurae: arrayPrint[i].idEstructurae, idEstadoComprobante: arrayPrint[i].idEstadoComprobante});
                  arrayIdCmp.push({idcomprobante: arrayPrint[i].idComprobante});
              }
              if (typeAction == 'report') {
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                  scope.fOpenWindowReport({
                      datoGeneral: {
                          reporte: '100',
                          titulo: 'Comprobante de operaciones',
                          // idcomprobante: idComprobante
                      },
                      datoCuerpo: [],
                      datoParametros: arrayIdCmp
                  });
              } else {
                  // Ext.Ajax.request({
                  //     timeout: 300000,
                  //     url: 'obtenerDatosImprimirReporte',
                  //     params: {
                  //         reporteParams: Ext.encode(listResult),
                  //         filtro: stparam
                  //     },
                  //     callback: function(options, success, response) {
                  //         var responseData = Ext.decode(response.responseText);
                  //         Ext.CONT.Componentes.HideBox('msgbIniciando');
                  //         if(responseData.dataSources.length > 0) {
                  //             if(typeAction == 'report') {
                  //                 scope.fOpenWindowReport({
                  //                     datoGeneral: {
                  //                         reporte: '100',
                  //                         titulo: 'Comprobante de operaciones',
                  //                         idcomprobante: idComprobante
                  //                     },
                  //                     datoCuerpo: responseData.dataSources
                  //                 });
                  //             } else {
                  //                 scope.fExportComprobante({
                  //                     datoGeneral: {
                  //                         reporte: '100',
                  //                         titulo: 'Comprobante de operaciones',
                  //                         idcomprobante: idComprobante
                  //                     },
                  //                     datoCuerpo: responseData.dataSources
                  //                 });
                  //             }
                  //         } else {
                  //             mostrarMensaje(6, scope.etiquetas.msgErrorcargandodatosparaelreporte);
                  //         }
                  //     }
                  // });
                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                  scope.fExportComprobante({
                      datoGeneral: {
                          reporte: '100',
                          titulo: 'Comprobante de operaciones',
                          idcomprobante: idComprobante
                      },
                      datoCuerpo: [],
                      datoParametros: listResult
                  });
              }

          };
          this.fOpenWindowReport = function(requestDataSources) {
              var self = this;
              self.map.disable();
              scope.winPrintView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  paperSize: "FOLIO",
                  orientation: "Horizontal",
                  reportType: "HTML"
              });
              scope.winPrintView.show();
              scope.winPrintView.doLayout();
              scope.winPrintView.on({
                  'show': function() {
                      self.map.disable();
                  },
                  'close': function() {
                      self.map.enable();
                  }
              });
          };
          this.fChangeNumberUIComprobante = function() {
              recordSelected = this.gpRegistroComprobantes.getSelectionModel().getSelected();
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando, scope.etiquetas.msgEsperar);
              scope.ClassCambiarNumero = new Ext.ClassCambiarNumero({
                  numeroComprobante: recordSelected.data.numeroComprobante,
                  idComprobante: recordSelected.data.idComprobante
              });
              scope.ClassCambiarNumero.addListener('close', function(numeroComprobante)
              {
                  if(numeroComprobante !== undefined)
                      scope.gpRegistroComprobantes.getStore().reload();
              });
          };
          this.fInvertDuplicateComprobante = function(flag) {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando, scope.etiquetas.msgEsperar);
              recordSelected = this.gpRegistroComprobantes.getSelectionModel().getSelected();
              Ext.Ajax.request({
                  url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/invertirDuplicarComprobante',
                  params: {
                      idComprobante: recordSelected.data.idComprobante,
                      flag: flag,
                      detalle: ((flag) ? 'Invertido' : 'Duplicado')
                  },
                  callback: function(options, success, response) {
                      var responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag === false || responseData.flag === 'false') {
                          scope.fUIComprobanteContable({
                              accion: 2,
                              tipoComprobante: parseInt(recordSelected.data.idTipoComprobante),
                              idComprobante: responseData.Comprobante.idcomprobante,
                              idEstructurae: recordSelected.data.idEstructurae,
                              idSubsistema: recordSelected.idSubsistema,
                              reloadGridRegistroComprobantes: true
                          });
                      } else {
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Usuario) {
                              mostrarMensaje(1, scope.etiquetas.msgcomprobantebloqueado + responseData.Usuario + '</b>.');
                          } else if (responseData.cod == -1) {
                              mostrarMensaje(1, 'No se puede invertir este comprobante porque existen cuentas inactivas asociadas.');
                          } else {
                              mostrarMensaje(6, (flag) ? scope.etiquetas.msgerrorinvirtiendo : scope.etiquetas.msgerrorduplicando);
                          }
                      }
                  }
              });
          };
          this.fAnularComprobante = function() {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando, scope.etiquetas.msgEsperar);
              var recordSelected = this.gpRegistroComprobantes.getSelectionModel().getSelected();
              Ext.Ajax.request({
                  url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/anularComprobante',
                  params: {
                      idComprobante: recordSelected.data.idComprobante
                  },
                  callback: function(options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag === false || responseData.flag === 'false') {
                          scope.fUIComprobanteContable({
                              accion: 2,
                              tipoComprobante: parseInt(recordSelected.data.idTipoComprobante),
                              idComprobante: responseData.Comprobante.idcomprobante,
                              idEstructurae: recordSelected.data.idEstructurae,
                              idSubsistema: recordSelected.idSubsistema,
                              reloadGridRegistroComprobantes: true
                          });
                      } else {
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Usuario)
                              mostrarMensaje(1, scope.etiquetas.msgcomprobantebloqueado + responseData.Usuario + '</b>.');
                          else
                              mostrarMensaje(6, scope.etiquetas.msgerroranulando);
                      }
                  }
              });
          };
          this.fDeleteComprobante = function(selection) {
              result = new Array();
              length = selection.length;
              for(i = 0; i < length; i++) {
                  result.push(selection[i].idComprobante);
              }
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgeliminando, scope.etiquetas.msgEsperar);
              Ext.Ajax.request({
                  url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/eliminarComprobantes',
                  params: {
                      idComprobantes: Ext.encode(result)
                  },
                  callback: function(options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      if(responseData.flag === false || responseData.flag === 'false') {
                          scope.gpRegistroComprobantes.getStore().reload();
                      } else {
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Comprobantes.length > 0) {
                              textNumeros = '';
                              textNumeroUsuario = '';
                              for(i = 0; i < responseData.Comprobantes.length; i ++)
                                  if(responseData.Comprobantes.length > 1)
                                  {
                                      textNumeros += (i === 0) ? responseData.Comprobantes[i].Numero : ', ' + responseData.Comprobantes[i].Numero;
                                      textNumeroUsuario += '<br> <b>' + responseData.Comprobantes[i].Numero + '</b> => <b>' + responseData.Comprobantes[i].Usuario + '</b>';
                                  }
                              mostrarMensaje(1, (responseData.Comprobantes.length > 1) ? 'Los comprobantes <b>' + textNumeros + '</b> est&aacute;n bloqueados.' + textNumeroUsuario : 'El comprobante est&aacute; bloqueado por el usuario <b>' + responseData.Comprobantes[0].Usuario + '</b>.');
                          } else
                              mostrarMensaje(6, (length > 1) ? 'Error eliminando comprobantes.' : 'Error eliminando comprobante.');
                      }
                  }
              });
          };
          this.fChangeStateUIComprobante = function(selection, estadoComprobante) {
              result = new Array();
              length = selection.length;
              for(i = 0; i < length; i++) {
                  result.push(selection[i].idComprobante);
              }
              //Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgcambiandoestado, scope.etiquetas.msgEsperar);
              Ext.Msg.wait(scope.etiquetas.msgcambiandoestado, scope.etiquetas.msgEsperar);
              Ext.Ajax.request({
                  url: '/contabilidad/contabilidad_financiera/comprobante_operaciones/index.php/comprobante/cambiarEstadoComprobantes',
                  params: {
                      idComprobantes: Ext.encode(result),
                      estadoComprobante: estadoComprobante
                  },
                  callback: function(options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      //Ext.CONT.Componentes.HideBox('msgbIniciando');
                      Ext.MessageBox.hide();
                      if(responseData.flag === false || responseData.flag === 'false') {
                          scope.gpRegistroComprobantes.getStore().reload();
                      } else {
                          if((responseData.flag === true || responseData.flag === 'true') && responseData.Comprobantes.length > 0) {
                              textNumeros = '';
                              textNumeroUsuario = '';
                              for(i = 0; i < responseData.Comprobantes.length; i ++)
                                  if(responseData.Comprobantes.length > 1)
                                  {
                                      textNumeros += (i === 0) ? responseData.Comprobantes[i].Numero : ', ' + responseData.Comprobantes[i].Numero;
                                      textNumeroUsuario += '<br> <b>' + responseData.Comprobantes[i].Numero + '</b> => <b>' + responseData.Comprobantes[i].Usuario + '</b>';
                                  }
                              mostrarMensaje(1, (responseData.Comprobantes.length > 1) ? scope.etiquetas.msgcantselect1 + textNumeros + scope.etiquetas.msgestanbloqueados + textNumeroUsuario : scope.etiquetas.msgcomprobantebloqueado + responseData.Comprobantes[0].Usuario + '</b>.'
                                      );
                          } else if (responseData.flag == 0) {
                              mostrarMensaje(1, 'La estructura no esta autorizada para asentar comprobantes.');
                          } else {
                              mostrarMensaje(6, (length > 1) ? scope.etiquetas.msgcambiandoestadodloscomprobantes : scope.etiquetas.msgcambiandoestadoalcomprobantes);
                          }
                      }
                  }
              });
          };
          this.fGraphComprobantes = function() {
              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgcargandoestado, scope.etiquetas.msgEsperar);
              var self = this;
              self.map.disable();
              Ext.Ajax.request({
                  url: 'obtenerCantidadComprobantesPorEstado',
                  method: 'POST',
                  callback: function(options, success, response) {
                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                      w_graficar = new Ext.Window({
                          title: scope.etiquetas.wgraficar,
                          closable: true,
                          height: 400,
                          html: '<div id="container" style="width: 630px; height: 370px; margin: 0 auto"></div>',
                          layout: 'fit',
                          modal: true,
                          resizable: false,
                          constrain: true,
                          width: 630,
                          listeners: {
                              'close': function() {
                                  self.map.enable();
                              }
                          }
                      });
                      w_graficar.show();
                      chart = new Highcharts.Chart({
                          chart: {
                              renderTo: 'container',
                              plotBackgroundColor: null,
                              plotBorderWidth: null,
                              plotShadow: false
                          },
                          title: {
                              text: ''
                          },
                          tooltip: {
                              formatter: function() {
                                  return '<b>' + this.point.name + '</b>: ' + this.point.cant + '<br>' + this.point.y + ' %';
                              }
                          },
                          plotOptions: {
                              pie: {
                                  allowPointSelect: true,
                                  cursor: 'pointer',
                                  dataLabels: {
                                      enabled: true,
                                      color: '#000000',
                                      connectorColor: '#000000',
                                      formatter: function() {
                                          return '<b>' + this.point.name + '</b>: ' + this.point.cant + '<br>' + this.point.y + ' %';
                                      }
                                  }
                              }
                          },
                          series: [{
                                  type: 'pie',
                                  name: '',
                                  data: Ext.decode(response.responseText)
                              }]
                      });
                  }
              });
          };
          this.fExportComprobante = function(requestDataSources) {
              var self = this;
              self.map.disable();
              scope.winExportCmp = new SCFPrintData(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  reportType: "DBF",
                  typeAction: 'export'
              });
              scope.winExportCmp.show();
              scope.winExportCmp.doLayout();
              scope.winExportCmp.on({
                  'show': function() {
                      self.map.disable();
                  },
                  'close': function() {
                      self.map.enable();
                  }
              });
          };
          this.fConfigurarImportar = function() {
              var self = this;
              self.map.disable();
              scope.winImportCmp = new SCFPrintData(new Object(), "/contabilidad/comun/SCFPrintView/", {
                  reportType: "DBF",
                  typeAction: 'import'
              });
              scope.winImportCmp.show();
              scope.winImportCmp.doLayout();
              scope.winImportCmp.on({
                  'show': function() {
                      self.map.disable();
                  },
                  'close': function() {
                      self.map.enable();
                      scope.stRegistroComprobantes.load();
                  }
              });
          };

      },
      initializeKeyMap: function(scope) {
          this.map = new Ext.KeyMap(Ext.getBody(), [{
                  key: "n",
                  alt: true,
                  fn: function() {
                      if (!scope.btnNewUIComprobanteTipoOperaciones.disabled) {
                          scope.btnNewUIComprobanteTipoOperaciones.fireEvent('click', scope.btnNewUIComprobanteTipoOperaciones);
                      }
                  }
              }, {
                  key: "b",
                  alt: true,
                  fn: function() {
                      scope.btnBuscarComprobantes.fireEvent('click', scope.btnBuscarComprobantes);
                  }
              }, {
                  key: "h",
                  alt: true,
                  fn: function() {
                      var title = 'Mostrar ayuda de la funcionalidad';
                      var referencia = 'confin/CG/comprobante/registrodecomprobante';
                      help.show(title, referencia);
                  }
              }, {
                  key: "o",
                  alt: true,
                  fn: function() {
                      scope.btnGraficarComprobantes.fireEvent('click', scope.btnGraficarComprobantes);
                  }
              }, {
                  key: "r",
                  alt: true,
                  fn: function() {
                      scope.btnViewReportUIComprobante.fireEvent('click', scope.btnViewReportUIComprobante);
                  }
              }, {
                  key: "e",
                  alt: true,
                  fn: function() {
                      scope.btnExportarComprobante.fireEvent('click', scope.btnExportarComprobante);
                  }
              }, {
                  key: "i",
                  ctrl: true,
                  alt: true,
                  fn: function() {
                      scope.btnImportar.fireEvent('click', scope.btnImportar);
                  }
              }, {
                  key: "a",
                  alt: true,
                  fn: function() {
                      scope.btnOpenUIComprobante.fireEvent('click', scope.btnOpenUIComprobante);
                  }
              }]);
      }
  });
  new Ext.ClassRegistroComprobantes();

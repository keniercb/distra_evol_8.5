  function SCFPrintView(requestDataSources, component_path, defaultComponentsValue, propertiesWindow) {
      Ext.QuickTips.init();
      this.component_path = component_path;
      this.requestDataSources = requestDataSources;
      Ext.apply(this, defaultComponentsValue);
      this.gPaperWidth = 11.69;
      this.gPaperHeight = 8.27;
      scopePrintView = this;
      var perfil = window.parent.perfil;
      if(!document.getElementById('MessageBox'))
          this.loadJs("/contabilidad/comun/componentes/MessageBox/MessageBox", 'MessageBox');
      this.keyMap = new Ext.KeyMap(Ext.getBody(), [{
              key: 'x',
              alt: true,
              fn: function() {
                  scopePrintView.close();
              }
          }, {
              key: Ext.EventObject.ENTER,
              fn: function() {
                  if(!Ext.getCmp('btnAceptar').disabled)
                      Ext.getCmp('btnAceptar').handler.call();
              },
              scope: scopePrintView
          }, {
              key: Ext.EventObject.TAB, //TAB
              fn: function() {
                  if(document.activeElement.tabIndex == 104) {
                      Ext.getCmp('cbxTipoHoja').focus(true, 10);
                  }
              },
              scope: scopePrintView
          }, {
              key: Ext.EventObject.TAB, //SHIFT+TAB
              shift: true,
              fn: function() {
                  if(document.activeElement.tabIndex == 100) {
                      if(!Ext.getCmp('btnAceptar').disabled) {
                          Ext.getCmp('btnAceptar').focus();
                      } else {
                          Ext.getCmp('btnCancelar').focus();
                      }
                  }
              },
              scope: scopePrintView
          }], "keydown");
      scopePrintView.dataStore = new Array();
      scopePrintView.flOption = '';
      scopePrintView.hdCombo = true;
      scopePrintView.typeAction = this.typeAction || 'report';
      if(scopePrintView.typeAction == 'report') {
          scopePrintView.heightWin = 315;
          scopePrintView.lbBtnAceptar = 'Aceptar configuraci&oacute;n y mostrar reporte';
          scopePrintView.ttlWinReport = 'Seleccionar la configuraci&oacute;n para mostrar el reporte';
          scopePrintView.flfsFormato = 'Formato';
          scopePrintView.flOption = 'Reporte';
          scopePrintView.dataStore = [['HTML'], ['PDF'], ['EXCEL']];
      } else {
          scopePrintView.heightWin = 350;
          scopePrintView.lbBtnAceptar = 'Aceptar configuraci&oacute;n y exportar datos';
          scopePrintView.ttlWinReport = 'Seleccionar la configuraci&oacute;n para exportar los datos';
          scopePrintView.flfsFormato = 'Formato contable';
          scopePrintView.flOption = 'Formato';
          scopePrintView.dataStore = [['DBF'], ['EXCEL'], ['CSV']];
      }
      Ext.Window.call(this, (propertiesWindow) ? propertiesWindow : {
          //iconCls: 'icondistra-imprimir',
          onEsc: function() {
              scopePrintView.close();
          },
          title: scopePrintView.ttlWinReport,
          bodyStyle: 'padding:5px 10px 5px 10px',
          resizable: false,
          constrain: true,
          modal: true,
          id: 'wReporte',
          layout: 'border',
          height: scopePrintView.heightWin || 325,
          width: 400,
          defaultButton: 1,
          animateTarget: 'btnVistaReporte',
          items: [scopePrintView.fContentPrintInPanelWest(), scopePrintView.fContentPrintInPanelCenter()],
          buttons: [new Ext.Button({
                  id: 'btnCancelar',
                  text: 'Cancelar',
                  tooltip: 'Cancelar la configuraci&oacute;n y cerrar ventana',
                  iconCls: "cancelar",
                  tabIndex: 103,
                  handler: function() {
                      scopePrintView.close();
                  }
              }), new Ext.Button({
                  id: 'btnAceptar',
                  text: 'Aceptar',
                  tooltip: scopePrintView.lbBtnAceptar,
                  iconCls: "aceptar",
                  tabIndex: 104,
                  handler: function() {
                      if(scopePrintView.typeAction == 'report') {
                          scopePrintView.fBUILDReport();
                      } else {
                          scopePrintView.fBUILDReport();
                      }
                  }
              })],
          listeners: {
              'show': function() {
                  if(scopePrintView.typeAction != 'report') {
                      Ext.getCmp('cbxFormatoContabilidad').focus(false, 100);
                  }
              }
          }
      });
      return this;
  }
  SCFPrintView.prototype = new Ext.Window;
  SCFPrintView.prototype.loadJs = function(jsSrc, id) {
      if(jsSrc != null)
      {
          var tagScript = document.createElement("script");
          tagScript.setAttribute("type", "text/javascript");
          tagScript.setAttribute("id", id);
          tagScript.setAttribute("src", jsSrc + ".js");
          document.getElementsByTagName("body")[0].appendChild(tagScript);
      }
  };
  SCFPrintView.prototype.fContentPrintInPanelWest = function() {
      var fsFormato = new Ext.form.FieldSet({
          title: scopePrintView.flfsFormato,
          autoHeight: true,
          autoWidth: true
      });
      var fsOpciones = new Ext.form.FieldSet({
          xtype: 'fieldset',
          title: 'Opciones',
          autoHeight: true,
          autoWidth: true,
          items: [SCFPrintView.prototype.cbxTipoReporte = new Ext.form.ComboBox({
                  id: 'cbxTipoReporte',
                  fieldLabel: scopePrintView.flOption,
                  store: SCFPrintView.prototype.stTipoReporte = new Ext.data.SimpleStore({
                      fields: ['id'],
                      data: scopePrintView.dataStore
                  }),
                  valueField: 'id',
                  displayField: 'id',
                  hiddenName: 'tipo',
                  tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
                  anchor: '95%',
                  typeAhead: true,
                  mode: 'local',
                  forceSelection: true,
                  triggerAction: 'all',
                  emptyText: 'Seleccione...',
                  selectOnFocus: true,
                  tabIndex: 102,
                  listeners: {
                      render: function(component) {
                          component.setValue(scopePrintView.reportType);
                      },
                      select: function(combo, record, index) {
                          switch(combo.getValue()) {
                              case 'DBF':
                                  {
                                      Ext.getCmp('dvImage').setStore(scopePrintView.fDataStore(combo.getValue()));
                                      Ext.getCmp('lSize').hide();
//                                    Ext.getCmp('cbxTipoHoja').disable();
//                                    Ext.getCmp('cbxOrientacion').disable();
                                  }
                                  break;
                              case 'CSV':
                                  {
                                      Ext.getCmp('dvImage').setStore(scopePrintView.fDataStore(combo.getValue()));
                                      Ext.getCmp('lSize').hide();
//                                    Ext.getCmp('cbxTipoHoja').disable();
//                                    Ext.getCmp('cbxOrientacion').disable();
                                  }
                                  break;
                              case 'XML':
                                  {
                                      Ext.getCmp('dvImage').setStore(scopePrintView.fDataStore(combo.getValue()));
                                      Ext.getCmp('lSize').hide();
//                                    Ext.getCmp('cbxTipoHoja').disable();
//                                    Ext.getCmp('cbxOrientacion').disable();
                                  }
                                  break;
                              default :
                                  {
                                      Ext.getCmp('dvImage').setStore(scopePrintView.fDataStore(combo.getValue()));
                                      Ext.getCmp('lSize').show();
                                      Ext.getCmp('cbxTipoHoja').enable();
                                      Ext.getCmp('cbxOrientacion').enable();
                                  }
                                  break;
                          }
                      }
                  }
              })]
      });
      var fpPrintView = new Ext.form.FormPanel({
          frame: true,
          region: 'west',
          id: 'fpContentPrintInPanelWest',
          width: 220,
          autoHeight: true,
          labelAlign: 'top'
      });
      if(scopePrintView.typeAction == 'report') {
          SCFPrintView.prototype.cbxTipoHoja = new Ext.form.ComboBox({
              id: 'cbxTipoHoja',
              fieldLabel: 'Tama&ntilde;o del papel',
              store: new Ext.data.SimpleStore({
                  fields: ['id', 'tipo'],
                  data: [['A4', 'A4'], ['LETTER', 'CARTA'], ['FOLIO', 'FOLIO'], ['LEGAL', 'LEGAL']]
              }),
              valueField: 'id',
              displayField: 'tipo',
              hiddenName: 'id',
              tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
              anchor: '95%',
              typeAhead: true,
              mode: 'local',
              forceSelection: true,
              triggerAction: 'all',
              emptyText: 'Seleccione...',
              selectOnFocus: true,
              tabIndex: 100,
              listeners: {
                  render: function(component)
                  {
                      component.setValue(scopePrintView.paperSize);
                  },
                  select: function(combo, record, index) {
                      Ext.getCmp('lSize').setText('<center>' + scopePrintView.fGetPageSize(combo.getValue()) + '</center>', false);
                  }
              }
          });
          SCFPrintView.prototype.cbxOrientacion = new Ext.form.ComboBox({
              id: 'cbxOrientacion',
              fieldLabel: 'Orientaci&oacute;n',
              store: new Ext.data.SimpleStore({
                  fields: ['id'],
                  data: [['Horizontal'], ['Vertical']]
              }),
              valueField: 'id',
              displayField: 'id',
              hiddenName: 'id',
              tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
              anchor: '95%',
              typeAhead: true,
              mode: 'local',
              forceSelection: true,
              triggerAction: 'all',
              emptyText: 'Seleccione...',
              selectOnFocus: true,
              tabIndex: 101,
              listeners: {
                  render: function(component) {
                      component.setValue(scopePrintView.orientation);
                  },
                  select: function(combo, record, index) {
                      scopePrintView.orientation = (combo.getValue() == "Horizontal") ? "Horizontal" : "Vertical";
                      Ext.getCmp('dvImage').setStore(scopePrintView.fDataStore(Ext.getCmp('cbxTipoReporte').getValue()));
                      Ext.getCmp('lSize').setText('<center>' + scopePrintView.fGetPageSize(Ext.getCmp('cbxTipoHoja').getValue()) + '</center>', false);
                  }
              }
          });
          fsFormato.add(SCFPrintView.prototype.cbxTipoHoja);
          fsFormato.add(SCFPrintView.prototype.cbxOrientacion);
          fpPrintView.add(fsFormato);
          fpPrintView.add(fsOpciones);
          if(fsOpciones.getComponent('cbxSysCont')) {
              fsOpciones.remove('cbxSysCont');
          }
      } else {
          SCFPrintView.prototype.cbxFormatoContabilidad = new Ext.form.ComboBox({
              id: 'cbxFormatoContabilidad',
              fieldLabel: 'Formatos',
              loadingText: 'Cargando...',
              resizable: true,
              store: scopePrintView.stFormatos = new Ext.data.Store({
                  autoLoad: false,
                  url: '/contabilidad/contabilidad_financiera/configuracion/index.php/estructurae/loadFormatos',
                  reader: new Ext.data.JsonReader({
                      root: 'datos'
                  }, [{
                          name: 'idformato'
                      }, {
                          name: 'nombre'
                      }, {
                          name: 'vistap'
                      }
                  ]),
                  listeners: {
                      'beforeload': function(store, options) {
                          scopePrintView.lMask = new Ext.LoadMask('fpContentPrintInPanelWest', {msg: 'Cargando...', agStore: store});
                          scopePrintView.lMask.show();
                      },
                      'load': function(store, records, options) {
                          scopePrintView.lMask.hide();
                      }
                  }
              }),
              valueField: 'idformato',
              displayField: 'nombre',
              hiddenName: 'idformato',
              tpl: '<tpl for="."><div ext:qtip="{vistap}" class="x-combo-list-item">{nombre}</div></tpl>',
              anchor: '95%',
              typeAhead: true,
              mode: 'remote',
              forceSelection: true,
              triggerAction: 'all',
              emptyText: 'Seleccione...',
              selectOnFocus: true,
              listeners: {
                  'expand': function(combo) {
                      scopePrintView.stFormatos.load();
                  }
              }
          });
          SCFPrintView.prototype.cbxConstanteCta = new Ext.form.ComboBox({
              id: 'cbxConstanteCta',
              fieldLabel: 'Constante de completamiento',
              store: new Ext.data.SimpleStore({
                  fields: ['id', 'descripcion'],
                  data: [['0', '0 - Ceros'], ['X', 'X - Equis']]
              }),
              valueField: 'id',
              displayField: 'id',
              hiddenName: 'id',
              tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{id}</div></tpl>',
              anchor: '95%',
              typeAhead: true,
              mode: 'local',
              forceSelection: true,
              triggerAction: 'all',
              value: '0',
              emptyText: 'Seleccione...',
              selectOnFocus: true
          });
          SCFPrintView.prototype.cbxSysCont = new Ext.form.ComboBox({
              id: 'cbxSysCont',
              fieldLabel: 'Sistemas compatibles',
              store: SCFPrintView.prototype.stSysCont = new Ext.data.SimpleStore({
                  fields: ['id', 'descripcion'],
                  data: [['distra', 'DISTRA'], ['rodas', 'RODAS XXI']/*, ['versat', 'VERSAT'], ['sun', 'Sun Asset'], ['asset', 'Asset NS'], ['condor', 'CONDOR']*/]
              }),
              valueField: 'id',
              displayField: 'descripcion',
              hiddenName: 'id',
              tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
              anchor: '95%',
              typeAhead: true,
              mode: 'local',
              value: 'versat',
              forceSelection: true,
              triggerAction: 'all',
              emptyText: 'Seleccione...',
              selectOnFocus: true
          });
          fsFormato.add(SCFPrintView.prototype.cbxFormatoContabilidad);
          fsFormato.add(SCFPrintView.prototype.cbxConstanteCta);
          fpPrintView.add(fsFormato);
          fsOpciones.insert(0, SCFPrintView.prototype.cbxSysCont);
          fpPrintView.add(fsOpciones);
      }
      return fpPrintView;
  };
  SCFPrintView.prototype.fContentPrintInPanelCenter = function() {
      var labelHtml = (scopePrintView.typeAction == 'report') ? '<center>' + scopePrintView.fGetPageSize(Ext.getCmp('cbxTipoHoja').getValue()) + '</center>' : '<center>&nbsp;</center>';
      return new Ext.form.FormPanel({
          frame: true,
          id: 'fpContentPrintInPanelCenter',
          region: 'center',
          labelAlign: 'top',
          items: [new Ext.DataView({
                  id: 'dvImage',
                  style: 'margin:35 0 0 25',
                  store: scopePrintView.fDataStore(scopePrintView.reportType),
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
                  emptyText: 'No images to display'
              }), new Ext.form.Label({
                  id: 'lSize',
                  html: labelHtml
              })
//            , {html:'<hr>'}
          ]
      });
  };
  SCFPrintView.prototype.fDataStore = function(name) {
      return new Ext.data.SimpleStore({
          fields: ['url', 'name'],
          data: [[scopePrintView.component_path + "views/images/" + name + ".png", name]]
      });
  };
  SCFPrintView.prototype.fGetPageSize = function(sheet) {
      var size;
      switch(sheet) {
          case 'LETTER' :
              {
                  size = (scopePrintView.orientation == "Horizontal") ? "11 x 8.5" : "8.5 x 11";
              }
              break;
          case 'FOLIO' :
              {
                  size = (scopePrintView.orientation == "Horizontal") ? "13 x 8.5" : "8.5 x 13";
              }
              break;
          case 'LEGAL' :
              {
                  size = (scopePrintView.orientation == "Horizontal") ? "14 x 8.5" : "8.5 x 14";
              }
              break;
          default :
              {
                  size = (scopePrintView.orientation == "Horizontal") ? "11.7 x 8.3" : "8.3 x 11.7";
              }
      }
      return size + " in \u2192 \u2191";
  };
  SCFPrintView.prototype.fVistaPreliminar = function(agWindow) {
      var PrintUtils = {
          fpaperSizeList: {
              1: {
                  PD: 1,
                  PN: 'na_letter',
                  PWG: 'na_letter_8.5x11in',
                  Name: 'US Letter',
                  W: 8.5,
                  H: 11,
                  M: 'in'
              },
              2: {
                  PD: 2,
                  PN: 'na_letter',
                  PWG: 'na_letter_8.5x11in',
                  Name: 'US Letter Small',
                  W: 8.5,
                  H: 11,
                  M: 'in'
              },
              9: {
                  PD: 9,
                  PN: 'iso_a4',
                  PWG: 'iso_a4_210x297mm',
                  Name: 'A4',
                  W: 210,
                  H: 297,
                  M: 'mm'
              }
              ,
              10: {
                  PD: 10,
                  PN: 'iso_a4',
                  PWG: 'iso_a4_210x297mm',
                  Name: 'A4 Small',
                  W: 210,
                  H: 297,
                  M: 'mm'
              }
          },
          fAdjustValueToInches: function(aValue, aToInches) {
              if(aToInches)
                  return  aValue / 25.4;
              return  aValue * 25.4;
          },
          fGetPrintSettings: function()
          {
              var printSettingsService = Components.classes["@mozilla.org/gfx/printsettings-service;1"].getService(Components.interfaces.nsIPrintSettingsService);
              var printSettings = printSettingsService.globalPrintSettings;
              printSettings.orientation = agWindow.scope.orientation;
              printSettings.showPrintProgress = 1;
              printSettings.headerStrRight = '';
              printSettings.headerStrCenter = '';
              printSettings.headerStrLeft = '';
              printSettings.footerStrRight = '';
              printSettings.footerStrCenter = '';
              printSettings.footerStrLeft = '';
              printSettings.printBGColors = false;
              printSettings.printBGImages = false;
              printSettings.printInColor = false;
              printSettings.shrinkToFit = false;
              printSettings.paperName = this.fpaperSizeList[9].PN;
              printSettings.paperData = this.fpaperSizeList[9].PD;
              printSettingsService.savePrintSettingsToPrefs(printSettings, true, printSettings.kInitSaveAll);
              return printSettings;
          },
          fPrintPreview: function(aWindow)
          {
              var interfaceRequestor = aWindow._content.QueryInterface(Components.interfaces.nsIInterfaceRequestor);
              var webBrowserPrint = interfaceRequestor.getInterface(Components.interfaces.nsIWebBrowserPrint);
              var DOMWindow = interfaceRequestor.getInterface(Components.interfaces.nsIDOMWindow);
              webBrowserPrint.printPreview(this.fGetPrintSettings(), DOMWindow, null);
              aWindow.content.focus();
          },
          fPrintPreviewToolbar: function(aWindow, DOMWindow)
          {
              var printToolbar = aWindow._content.document.getElementById("print-preview-toolbar");
              if(printToolbar)
              {
                  printToolbar.updateToolbar();
                  printToolbar.hidden = false;
              } else
              {
                  var XUL_NS = "";
                  printToolbar = aWindow._content.document.createElementNS(XUL_NS, "toolbar");
                  printToolbar.setAttribute("printpreview", true);
                  printToolbar.setAttribute("id", "print-preview-toolbar");
                  DOMWindow.parentNode.insertBefore(printToolbar, DOMWindow);
              }
          }
      };
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
      PrintUtils.fPrintPreview(agWindow);
  };
  SCFPrintView.prototype.onAfterReportShow = function() {
      Ext.CONT.Componentes.HideBox('msgbIniciando');
  };
  SCFPrintView.prototype.fBUILDReport = function() {
      Ext.CONT.Componentes.MessageBox('msgbIniciando');
      if(scopePrintView.typeAction == 'report') {
          scopePrintView.paramsAjax = {
              dataSources: Ext.encode(scopePrintView.requestDataSources),
              reportType: Ext.getCmp('cbxTipoReporte').getValue(),
              reportOrientation: Ext.getCmp('cbxOrientacion').getValue(),
              reportPaperSize: Ext.getCmp('cbxTipoHoja').getValue(),
              typeAction: 'report'
          };
      } else {
          scopePrintView.paramsAjax = {
              dataSources: Ext.encode(scopePrintView.requestDataSources),
              reportType: Ext.getCmp('cbxTipoReporte').getValue(),
              idFormatCtas: Ext.getCmp('cbxFormatoContabilidad').getValue(),
              constanteCta: Ext.getCmp('cbxConstanteCta').getValue(),
              systemCont: Ext.getCmp('cbxSysCont').getValue(),
              typeAction: 'export'
          };
      }
      Ext.Ajax.request({
          method: "POST",
          params: scopePrintView.paramsAjax,
          url: scopePrintView.component_path + "index.php/scfprintview/savePost",
          callback: function(options, success, response)
          {
              this.responseData = Ext.decode(response.responseText);
              switch(this.responseData.info) {
                  case true:
                      {
                          var gWindow = window.open(scopePrintView.component_path + "index.php/scfprintview/buildReport", "", "menubar = yes, scrollbars = yes, status = no, toolbar = no, location = yes, resizable = no, titlebar = no", true);
                          scopePrintView.showMask(gWindow);
                          if(Ext.getCmp('cbxTipoReporte').getValue() == "HTML")
                          {
                              gWindow.onload = function() {
                                  scopePrintView.onAfterReportShow();
                              };

                          } else if(Ext.getCmp('cbxTipoReporte').getValue() == "DBF") {

                              {
                                  Ext.DomHelper.append(document.body, {
                                      tag: 'iframe',
                                      id: 'downloadIframe',
                                      frameBorder: 0,
                                      width: 0,
                                      height: 0,
                                      css: 'display:none;visibility:hidden;height:0px;',
                                      src: scopePrintView.component_path + "index.php/scfprintview/exportReport"
                                  });
                              }
                          } else {
                              scopePrintView.onAfterReportShow();
                          }
                          gWindow.onbeforeunload = function() {
                              scopePrintView.onAfterReportShow();
                          };
                          gWindow.focus();
                      }
                      break
                  case false:
                      {
                          scopePrintView.onAfterReportShow();
                      }
                      break
                  default:
                      {
                      }
                      break
              }

          }
      });
  };
  SCFPrintView.prototype.showMask = function(win) {
      var div1 = document.createElement("div");
      div1.setAttribute("id", "loading-mask");
      div1.setAttribute("style", " background-color; blue;  position:absolute;left:45%; top:40%;padding:2px; z-index:20001; color:#444;font:bold 13px Helvetica, Arial, sans-serif; height:auto;   ");
      div1.innerHTML = ' <img src="http://' + document.location.host + '/contabilidad/comun/images/cargando.gif" width="64" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>Cargando...<br /><span id="loading-msg" style = "font-size: 10px; font-weight: normal;"> Por favor espere...</span>';
      win.document.getElementsByTagName("body")[0].appendChild(div1);
  };
  SCFPrintView.prototype.descargarArchivo = function(contenidoEnBlob, nombreArchivo) {
      var reader = new FileReader();
      reader.onload = function(event) {
          var save = document.createElement('a');
          save.href = event.target.result;
          save.target = '_blank';
          save.download = nombreArchivo; //|| 'archivo.dat';
          var clicEvent = new MouseEvent('click', {
              'view': window,
              'bubbles': true,
              'cancelable': true
          });
          save.dispatchEvent(clicEvent);
          (window.URL || window.webkitURL).revokeObjectURL(save.href);
      };
      reader.readAsDataURL(contenidoEnBlob);
  };

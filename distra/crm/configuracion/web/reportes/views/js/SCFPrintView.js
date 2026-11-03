  function SCFPrintView(requestDataSources, component_path, defaultComponentsValue, propertiesWindow) {
      Ext.QuickTips.init();
      this.component_path = component_path;
      this.requestDataSources = requestDataSources;
      Ext.apply(this, defaultComponentsValue);
      this.gPaperWidth = 11.69;
      this.gPaperHeight = 8.27;
      scope = this;
      var perfil = window.parent.perfil;
      if(!document.getElementById('MessageBox'))
          this.loadJs("/configuracion/comun/views/js/MessageBox/MessageBox", 'MessageBox');
      this.keyMap = new Ext.KeyMap(Ext.getBody(), [{
              key: 'p',
              alt: true,
              fn: function() {
                  Ext.getCmp("btnAceptar").handler.call(Ext.getCmp("btnAceptar").scope);
              }
          }, {
              key: 27,
              fn: function() {
                  scope.close();
              }
          }]);
      Ext.Window.call(this, ( propertiesWindow ) ? propertiesWindow : {
          onEsc: function() {
              scope.close();
          },
          title: 'Seleccionar la configuraci&oacute;n para mostrar el reporte',
          bodyStyle: 'padding:5px 10px 5px 10px',
          resizable: false,
          modal: true,
          id: 'wReporte',
          layout: 'border',
          height: 325,
          width: 380,
          defaultButton: 'btnAceptar',
          constrain:true,
          items: [scope.fContentPrintInPanelWest(), scope.fContentPrintInPanelCenter()],
          buttons: [new Ext.Button({
                  id: 'btnCancelar',
                  text: 'Cancelar',
                  tooltip: 'Cancelar la configuraci&oacute;n y cerrar ventana',
                  iconCls: "cancelar",
                  handler: function() {
                      scope.close();
                  }
              }), new Ext.Button({
                  id: 'btnAceptar',
                  text: 'Aceptar',
                  tooltip: 'Aceptar la configuraci&oacute;n y mostrar el reporte',
                  iconCls: "aceptar",
                  handler: function() {
                      scope.fBUILDReport();
                  }
              })]
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
      return new Ext.form.FormPanel({
          frame: true,
          region: 'west',
          id: 'fpContentPrintInPanelWest',
          width: 200,
          labelAlign: 'top',
          items: [{
                  xtype: 'fieldset',
                  title: 'Formato',
                  autoHeight: true,
                  autoWidth: true,
                  items: [new Ext.form.ComboBox({
                          id: 'cbxTipoHoja',
                          fieldLabel: 'Tamaño del papel',
                          store: new Ext.data.SimpleStore({
                              fields: ['id', 'tipo'],
                              data: [['A4', 'A4'], ['LETTER', 'CARTA'], ['FOLIO', 'FOLIO'], ['LEGAL', 'LEGAL']]
                          }),
                          valueField: 'id',
                          displayField: 'tipo',
                          hiddenName: 'id',
                          tpl: '<tpl for="."><div ext:qtip="{tipo}" class="x-combo-list-item">{tipo}</div></tpl>',
                          anchor: '90%',
                          typeAhead: true,
                          mode: 'local',
                          forceSelection: true,
                          triggerAction: 'all',
                          emptyText: 'Seleccione',
                          selectOnFocus: true,
                          listeners: {
                              render: function(component)
                              {
                                  component.setValue(scope.paperSize);
                              },
                              select: function(combo, record, index) {
                                  Ext.getCmp('lSize').setText(scope.fGetPageSize(combo.getValue()));
                              }
                          }
                      }),
                      new Ext.form.ComboBox({
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
                          anchor: '90%',
                          typeAhead: true,
                          mode: 'local',
                          forceSelection: true,
                          triggerAction: 'all',
                          emptyText: 'Seleccione',
                          selectOnFocus: true,
                          listeners: {
                              render: function(component) {
                                  component.setValue(scope.orientation);
                              },
                              select: function(combo, record, index) {
                                  scope.orientation = ( combo.getValue() == "Horizontal" ) ? "Horizontal" : "Vertical";
                                  Ext.getCmp('dvImage').setStore(scope.fDataStore(combo.getValue() + Ext.getCmp('cbxTipoReporte').getValue()));
                                  Ext.getCmp('lSize').setText(scope.fGetPageSize(Ext.getCmp('cbxTipoHoja').getValue()));
                              }
                          }
                      })]
              }, {
                  xtype: 'fieldset',
                  title: 'Opciones',
                  autoHeight: true,
                  autoWidth: true,
                  items: [SCFPrintView.prototype.cbxTipoReporte = new Ext.form.ComboBox({
                          id: 'cbxTipoReporte',
                          fieldLabel: 'Reporte',
                          store: SCFPrintView.prototype.stTipoReporte = new Ext.data.SimpleStore({
                              fields: ['id'],
                              data: [['HTML'], ['PDF']/*, ['EXCEL'], ['DBF'], ['XML']*/]
                          }),
                          valueField: 'id',
                          displayField: 'id',
                          hiddenName: 'tipo',
                          tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
                          anchor: '90%',
                          typeAhead: true,
                          mode: 'local',
                          forceSelection: true,
                          triggerAction: 'all',
                          emptyText: 'Seleccione',
                          selectOnFocus: true,
                          listeners: {
                              render: function(component) {
                                  component.setValue(scope.reportType);
                              },
                              select: function(combo, record, index) {
                                  switch(combo.getValue()) {
                                      case 'DBF':
                                          {
                                              Ext.getCmp('cbxTipoHoja').disable();
                                              Ext.getCmp('cbxOrientacion').disable();
                                              Ext.getCmp('lSize').hide();
                                              Ext.getCmp('dvImage').setStore(scope.fDataStore(combo.getValue()));
                                          }
                                          break;
                                      case 'XML':
                                          {
                                              Ext.getCmp('cbxTipoHoja').disable();
                                              Ext.getCmp('cbxOrientacion').disable();
                                              Ext.getCmp('lSize').hide();
                                              Ext.getCmp('dvImage').setStore(scope.fDataStore(combo.getValue()));
                                          }
                                          break;
                                      default :
                                          {
                                              Ext.getCmp('cbxTipoHoja').enable();
                                              Ext.getCmp('cbxOrientacion').enable();
                                              Ext.getCmp('lSize').show();
                                              Ext.getCmp('dvImage').setStore(scope.fDataStore(Ext.getCmp('cbxOrientacion').getValue() + combo.getValue()));
                                          }
                                          break;
                                  }
                              }
                          }
                      })]
              }]
      });
  };
  SCFPrintView.prototype.fContentPrintInPanelCenter = function() {
      return new Ext.form.FormPanel({
          frame: true,
          id: 'fpContentPrintInPanelCenter',
          region: 'center',
          labelAlign: 'top',
          items: [new Ext.DataView({
                  id: 'dvImage',
                  style: 'margin:35 0 0 25',
                  store: scope.fDataStore(scope.orientation + scope.reportType),
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
                  text: scope.fGetPageSize(Ext.getCmp('cbxTipoHoja').getValue())
              })
          ]
      });
  };
  SCFPrintView.prototype.fDataStore = function(name) {
      return new Ext.data.SimpleStore({
          fields: ['url', 'name'],
          data: [[scope.component_path + "views/images/" + name + ".png", name]]
      });
  };
  SCFPrintView.prototype.fGetPageSize = function(sheet) {
      var size;
      switch(sheet) {
          case 'LETTER' :
              {
                  size = ( scope.orientation == "Horizontal" ) ? "11 x 8.5" : "8.5 x 11";
              }
              break;
          case 'FOLIO' :
              {
                  size = ( scope.orientation == "Horizontal" ) ? "13 x 8.5" : "8.5 x 13";
              }
              break;
          case 'LEGAL' :
              {
                  size = ( scope.orientation == "Horizontal" ) ? "14 x 8.5" : "8.5 x 14";
              }
              break;
          default :
              {
                  size = ( scope.orientation == "Horizontal" ) ? "11.7 x 8.3" : "8.3 x 11.7";
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
      Ext.Ajax.request({
          method: "POST",
          params: {
              dataSources: Ext.encode(scope.requestDataSources),
              reportType: Ext.getCmp('cbxTipoReporte').getValue(),
              reportOrientation: Ext.getCmp('cbxOrientacion').getValue(),
              reportPaperSize: Ext.getCmp('cbxTipoHoja').getValue()
          },
          url: scope.component_path + "index.php/scfprintview/savePost",
          callback: function(options, success, response)
          {
              this.responseData = Ext.decode(response.responseText);
              if(this.responseData.info == true)
              {
                  var gWindow = window.open(scope.component_path + "index.php/scfprintview/buildReport", "", "menubar = yes, scrollbars = yes, status = no, toolbar = no, location = yes, resizable = no, titlebar = no", true);
				  scope.showMask(gWindow);
                  if(Ext.getCmp('cbxTipoReporte').getValue() == "HTML")
                  {
                      //                    gWindow.content.addEventListener("readystatechange", function()
                      //                    {
                      //                        if(gWindow.document.readyState == "complete")
                      //                        {
                      //                            gWindow.scope = scope;
                      //                            gWindow.setTimeout("scope.fVistaPreliminar(this)", 001);
                      //                            scope.onAfterReportShow();
                      //                        } 
                      //                    }, true);   
                      gWindow.onload = function() {
                          scope.onAfterReportShow();
                      };

                  }
                  gWindow.onbeforeunload = function() {
                      scope.onAfterReportShow();
                  };
                  gWindow.focus();
              } else
                  scope.onAfterReportShow();
          }
      });
  };
  SCFPrintView.prototype.showMask = function(win){
		var div1 = document.createElement("div");
		div1.setAttribute("id","loading-mask");
		div1.setAttribute("style"," background-color; blue;  position:absolute;left:45%; top:40%;padding:2px; z-index:20001; color:#444;font:bold 13px Helvetica, Arial, sans-serif; height:auto;   "); 
		div1.innerHTML = ' <img src="http://'+document.location.host+'/portal/views/images/portal/cargando.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>Cargando...<br /><span id="loading-msg" style = "font-size: 10px; font-weight: normal;"> Por favor espere...</span>';
		win.document.getElementsByTagName("body")[0].appendChild(div1);
	};
  SCFPrintView.prototype.descargarArchivo = function(contenidoEnBlob, nombreArchivo) {
      var reader = new FileReader();
      reader.onload = function(event) {
          var save = document.createElement('a');
          save.href = event.target.result;
          save.target = '_blank';
          save.download = nombreArchivo;//|| 'archivo.dat';
          var clicEvent = new MouseEvent('click', {
              'view': window,
              'bubbles': true,
              'cancelable': true
          });
          save.dispatchEvent(clicEvent);
          ( window.URL || window.webkitURL ).revokeObjectURL(save.href);
      };
      reader.readAsDataURL(contenidoEnBlob);
  };

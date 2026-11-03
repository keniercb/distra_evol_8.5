  Ext.namespace('Ext.Costo.Procesos.Nomencladores.Componentes.UI');
  Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCEOG = Ext.extend(Ext.tree.TreePanel,
          {
              mask: undefined,
              notification: undefined,
              constructor: function(scope) {
                  Ext.apply(this, {
                      layout: 'fit',
                      id: 'tp' + scope.id,
                      rootVisible: true,
                      containerScroll: true,
                      autoScroll: true,
                      ddScroll: true,
                      lines: true,
                      trackMouseOver: true,
                      bodyStyle: 'background-color:#fff;',
                      shadow: true,
                      animate: true,
                      enableDD: false,
                      clearOnLoad: false,
                      loader: scope.tLoaderEOG = new Ext.tree.TreeLoader({
                          url: scope.url + scope.method
                      }),
                      root: scope.rootCCEOG = new Ext.tree.AsyncTreeNode({
                          text: scope.rootText.toUpperCase(),
                          draggable: false,
                          id: '0',
                          type: 0,
                          expanded: true,
                          icon: scope.perfil.dirImg + 'organigrama/empty.gif',
                          iconCls: scope.perfil.dirImg + 'organigrama/empty.gif'
                      }),
                      tbar: scope.toolbarEOG = new Ext.Toolbar({
                          items: [scope.sfBuscarEOG = SearchField(),
                              scope.btnReload = new Ext.Toolbar.Button({
                                  id: 'btnReload',
                                  iconCls: 'actualizar',
                                  tooltip: scope.etiquetas.reloadTree
                              }),
                              '-',
                              scope.busquedaAvanzEOG = new Ext.Toolbar.Button({
                                  hidden: scope.hideSearch,
                                  id: 'btnBuscar',
                                  text: scope.etiquetas.titleBusquedaAvanzada,
                                  iconCls: 'buscaravanzada',
                                  tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBusquedaAvanzadaEO : scope.etiquetas.tooltipBusquedaAvanzadaOG
                              })]
                      })
                  });

                  scope.menuEOG = new Ext.menu.Menu({
                      floating: false,
                      shadow: true,
                      hideBorders: true
                  });

                  scope.miMarcar = new Ext.menu.Item({
                      text: scope.etiquetas.titleMarcar,
                      iconCls: 'siguiente'
                  });

                  scope.miDesmarcar = new Ext.menu.Item({
                      text: scope.etiquetas.titleDesmarcar,
                      iconCls: 'anterior'
                  });

                  scope.itemreload = new Ext.menu.Item({
                      text: scope.etiquetas.reload,
                      iconCls: 'actualizar'
                  });

                  function SearchField() {
                      var search = new Ext.Cont.SearchField({
                          validationEvent: false,
                          validateOnBlur: false,
                          selectOnFocus: true,
                          lbTtlElement: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnbuscarEG : scope.etiquetas.tooltipBtnbuscarOG
                      });
                      return search;
                  }

                  return Ext.Costo.Procesos.Nomencladores.Componentes.UI.CCEOG.superclass.constructor.call(this);
              },
              // VENTANA DE BUSQUEDA AVANZADA
              createWindowsSearch: function(scope, x) {
                  scope.stEstadoSearch = new Ext.data.Store({
                      url: '/contabilidad/contabilidad_costos/configuracion/index.php/representarnomencladores/cargarEstadosAll',
                      reader: new Ext.data.JsonReader({
                          root: 'data',
                          totalProperty: 'total',
                          id: 'idestado'
                      },
                      [{
                              name: 'idestado',
                              type: 'int'
                          }, {
                              name: 'descripcion',
                              type: 'string'
                          }]),
                      sortInfo: {
                          field: 'idestado',
                          direction: 'ASC'
                      }
                  });
                  scope.btnCancelarSearch = new Ext.Button({
                      id: 'btnCancSearch',
                      iconCls: 'cancelar',
                      text: scope.etiquetas.lbBtnCancelarSearch,
                      tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnCancelarSearchEG : scope.etiquetas.tooltipBtnCancelarSearchOG
                  });
                  scope.btnAceptarSearch = new Ext.Button({
                      id: 'btnAceptarSearch',
                      disabled: true,
                      iconCls: 'aceptar',
                      text: scope.etiquetas.lbBtnAceptarSearch,
                      tooltip: (scope.types[0] == 1) ? scope.etiquetas.tooltipBtnAceptarSearchEG : scope.etiquetas.tooltipBtnAceptarSearchOG
                  });
                  scope.cbEstadoSearch = new Ext.form.ComboBox({
                      store: scope.stEstadoSearch,
                      valueField: 'idestado',
                      displayField: 'descripcion',
                      fieldLabel: scope.etiquetas.flEstado,
                      anchor: '100%',
                      emptyText: scope.etiquetas.emptyText,
                      triggerAction: 'all',
                      mode: 'local',
                      id: 'idEstadoSearch',
                      name: 'estado',
                      readOnly: true,
                      enableKeyEvents: true
                  });
                  scope.tfCodigoSearch = new Ext.form.TextField({
                      id: 'tfCodigoSearch',
                      maskRe: /^[0-9]*[.]*$/,
                      regex: /^((.)?[0-9](.)?)+?$/,
                      maxLength: scope.longitudTotal,
                      maxLengthText: scope.etiquetas.maxLengthText.replace('<#>', scope.longitudTotal),
                      name: 'codigo',
                      fieldLabel: scope.etiquetas.flCodigo,
                      anchor: '100%',
                      enableKeyEvents: true,
                      regexText: scope.etiquetas.regexText.replace('<#>', scope.longitudTotal)
                  });
                  scope.txaDescripcionSearch = new Ext.form.TextArea({
                      name: 'descripcion',
                      id: 'txaDescripcionSearch',
                      anchor: '100%',
                      maskRe: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
                      regex: /^([a-zA-Z0-9_ \u00e1\u00e9\u00ed\u00f3\u00fa\u00f1\u00d1  ().:;,"*-])+$/,
                      maxLength: 255,
                      maxLengthText: scope.etiquetas.maxLengthTextDescripcion,
                      fieldLabel: scope.etiquetas.flDescripcion,
                      enableKeyEvents: true
                  });

                  scope.panelGestSearch = new Ext.form.FormPanel({
                      layout: 'form',
                      labelAlign: 'top',
                      frame: true,
                      height: 200,
                      width: 300,
                      items: [scope.tfCodigoSearch, scope.cbEstadoSearch, scope.txaDescripcionSearch]
                  });

                  scope.ventanaSearch = new Ext.Window({
                      title: (scope.types.length > 1) ? scope.etiquetas.titleVentanaSearch : ((scope.types[0] == 1) ? scope.etiquetas.titleVentanaSearchEG : scope.etiquetas.titleVentanaSearchOG),
                      modal: true,
                      resizable: false,
                      constrain: true,
                      defaultButton: 0,
                      layout: 'fit',
                      closeAction: 'close',
                      x: x,
                      items: [scope.panelGestSearch],
                      buttons: [scope.btnCancelarSearch, scope.btnAceptarSearch]
                  });
              },
              loadMask: function(msg) {
                  this.mask = new Ext.LoadMask(this.body, {
                      msg: msg
                  });
                  this.mask.show();
              },
              SearchFieldEOG: Ext.extend(Ext.form.TwinTriggerField, {
                  validationEvent: false,
                  validateOnBlur: false,
                  selectOnFocus: true,
                  id: 'myeditEOG',
                  trigger1Class: 'x-form-clear-trigger',
                  trigger2Class: 'x-form-search-trigger',
                  hideTrigger1: true
              })
          });



  Ext.QuickTips.init();
  var viewport, winIns, perfil = window.parent.UCID.portal.perfil;
  Ext.Ajax.request({method: "POST", url: "cargaretiquetas", callback: function(options, success, response) {
          var etiquetas = Ext.decode(response.responseText);
          Ext.Msg.wait(etiquetas.msgWait, etiquetas.lbMsgEspere);
          cargaDatosInicial(etiquetas);
      }});
  function onloadMask(message) {
      message ? ( lMask = new Ext.LoadMask(Ext.getBody(), {msg: message}), lMask.show() ) : lMask.hide();
  }
  function cargaDatosInicial(etiquetas) {
      Ext.Ajax.request({url: 'cargaDatosInicial', method: 'POST', callback: function(options, success, response) {
              responseText = Ext.decode(response.responseText);
              cargarInterfaz(responseText.flag, etiquetas);
          }});
  }
  function cargarInterfaz(flag, etiquetas) {
      var btn_Adicionar = new Ext.Button({
          id: 'btn_Adicionar', iconCls: 'adicionar', text: etiquetas.lbAsociar, tooltip: etiquetas.tooltipAsociar, handler: function() {
              AdicionarConceptoReporte();
          }
      });
      var btnAyuda = new Ext.Button({id: 'btnAyuda', iconCls: 'ayuda', text: etiquetas.lBbtnAyuda, tooltip: etiquetas.lbTtbtnAyuda, handler: function() {
              var title = etiquetas.lbTittle, referencia = 'confin/CG/configuracion/asociarconceptoareporte';
              ayuda.show(2, referencia);
          }});
      var btn_Eliminar = new Ext.Button({id: 'btn_Eliminar', iconCls: 'eliminar', hidden: true, text: etiquetas.lbEliminar, tooltip: etiquetas.tooltipEliminar, handler: function() {
              Eliminar();
          }});
      var st_conceptos = new Ext.data.GroupingStore({url: 'obtenerConceptos', reader: new Ext.data.JsonReader({id: 'reader', root: "datos", totalProperty: "total"}, [{name: 'idnomfijo'}, {name: 'idfijoreporte'}, {name: 'descripcion'}, {name: 'asociarconcepto'}, {name: 'idreporte'}, {name: 'reporte'}, {name: 'enabled'}]), baseParams: {idreporte: ''}, sortInfo: {field: 'descripcion', direction: "ASC"}, groupField: 'reporte'});
      st_conceptos.load();
      var sm_conceptos = new Ext.grid.CheckboxSelectionModel({});
      function cantidadConceptosEnReporte(agIdReporte, agIdNomFijo) {
          cant = 0;
          st_conceptos.each(function(record) {
              if(record.data.idreporte == agIdReporte && record.data.idnomfijo != agIdNomFijo) {
                  cant++;
              }
          });
          return cant;
      }
      function fCanIShowBtnCambiarConcepto(selections) {
          var flag = true;
          if(selections.length > 1)
              for(var i = 0; i < selections.length - 1; i++)
                  for(var j = i + 1; j < selections.length; j++)
                      if(selections[i].data.idreporte == selections[j].data.idreporte || selections[i].data.asociarconcepto == 0 || selections[j].data.asociarconcepto == 0)
                          flag = false;
          return flag;
      }
      sm_conceptos.on('rowdeselect', function(t, i, r) {
          Ext.getCmp('gpConceptos').getView().removeRowClass(i, "negrita");
          if(t.hasSelection())
              btn_Eliminar.show();
          else
              btn_Eliminar.hide();
      });
      sm_conceptos.on('rowselect', function(t, i, r) {
          Ext.getCmp('gpConceptos').getView().addRowClass(i, "negrita");
          btn_Eliminar.show();
      });
      var cm_conceptos = new Ext.grid.ColumnModel([sm_conceptos, {id: 'id', header: etiquetas.lbIdNomFijo, hidden: true, hideable: false, dataIndex: 'idnomfijo'}, {id: 'idfijoreporte', hidden: true, hideable: false, dataIndex: 'idfijoreporte'}, {id: 'concepto', header: etiquetas.lbConcepto, sortable: true, dataIndex: 'descripcion'}, {hidden: true, hideable: false, id: 'asociado', dataIndex: 'asociarconcepto'}, {id: 'idreporte', hidden: true, hideable: false, dataIndex: 'idreporte'}, {id: 'reporte', header: etiquetas.lbReporte, sortable: true, hidden: true, dataIndex: 'reporte'}]);
      var gp_conceptos = new Ext.grid.GridPanel({border: false, frame: false, loadMask: true, region: 'center', id: 'gpConceptos', cm: cm_conceptos, sm: sm_conceptos, store: st_conceptos, tbar: new Ext.Toolbar({height: 25, items: [btn_Adicionar, btn_Eliminar, btnHeredar = new Ext.Button({id: 'btn_Heredar', iconCls: 'btn', icon: '/contabilidad/comun/images/heredar.png', hidden: flag, text: etiquetas.lbHeredar, tooltip: etiquetas.tooltipHeredar, handler: function() {
                          fVentanaHeredar().show();
                      }}), '->', btnAyuda]}), view: new Ext.grid.GroupingView({forceFit: true, startCollapsed: true, groupTextTpl: '{text} {[(values.rs[0].data.asociarconcepto > 0)? "(" + values.rs.length: ""]} {[(values.rs[0].data.asociarconcepto > 0)?((values.rs.length > 1) ? "Conceptos" : "Concepto")+")":""]}'})});
      gp_conceptos.on('render', function(t, r, re) {
          btn_Adicionar.focus();
      });
      if(!viewport) {
          viewport = new Ext.Viewport({id: 'viewport', border: false, layout: 'border', items: [gp_conceptos], keys: new Ext.KeyMap(Ext.getBody(), [{key: 'a', alt: true, fn: function() {
                          if(!btn_Adicionar.disabled)
                              btn_Adicionar.handler.call();
                      }}, {key: 'e', alt: true, fn: function() {
                          if(!btnHeredar.hidden)
                              btnHeredar.handler.call();
                      }}, {key: 'h', alt: true, fn: function() {
                          if(!btnAyuda.hidden)
                              btnAyuda.handler.call();
                      }}, {key: Ext.EventObject.DELETE, fn: function() {
                          if(!btn_Eliminar.hidden)
                              btn_Eliminar.handler.call();
                      }}])});
      }
      var st_reportes = new Ext.data.Store({url: 'obtenerReportes', reader: new Ext.data.JsonReader({id: 'reader', root: "datos"}, [{name: 'idreporte'}, {name: 'descripcion'}, {name: 'asociarconcepto'}])});
      st_reportes.load();
      var cb_reportes = new Ext.form.ComboBox({id: 'cbReportes', store: st_reportes, forceSelection: true, selectOnFocus: true, allowBlank: false, typeAhead: true, emptyText: etiquetas.lbSeleccione, fieldLabel: etiquetas.lbReporte, valueField: 'idreporte', displayField: 'descripcion', mode: 'local', triggerAction: 'all', anchor: '100%', tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>', listeners: {'select': function(combo, record, index) {
                  ( record.data.asociarconcepto == 1 ) ? pGrid.enable() : ( sm_conceptos_winins.clearSelections(), pGrid.disable() );
              }}});
      var st_conceptos_winins = new Ext.data.Store({url: 'obtenerConceptosCuentasAsociadas', reader: new Ext.data.JsonReader({id: 'reader', root: "datos", totalProperty: "total"}, [{name: 'idnomfijo'}, {name: 'descripcion'}])});
      Ext.Msg.hide();
      var sm_conceptos_winins = new Ext.grid.CheckboxSelectionModel({});
      var sfBuscar = new Ext.Cont.SearchField({
          hasSearch: false, enableKeyEvents: true, id: 'sfBuscar', width: 530, anchor: '100%', lbTtlElement: 'concepto(s)',
          regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
          maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/,
          fnOnSearch: function() {
              this.hasSearch = true;
              fnFilterConceptos('Busc');
          },
          fnOnClear: function() {
              this.hasSearch = false;
              fnFilterConceptos();
          },
          listeners: {
              keyup: function(sf, ev) {
                this.triggers[0].show();
                this.fnOnSearch().call();
              }
          }
      });
      function fnFilterConceptos(busc) {
          if(busc) {
              var filter = Ext.getCmp('sfBuscar').getValue().toString();
              if(filter.length > 0) {
                  var re = new RegExp(Ext.escapeRe(filter), 'gi');
                  st_conceptos_winins.filterBy(function(record) {
                    var denomConcepto = record.data.descripcion;
                    return denomConcepto.toString().match(re);
                  });
              } else {
                  st_conceptos_winins.clearFilter(false);
              }
          } else {
              st_conceptos_winins.clearFilter(false);
          }
      }
      var cm_conceptos_winins = new Ext.grid.ColumnModel([sm_conceptos_winins, {id: 'id', hidden: true, hideable: false, dataIndex: 'idnomfijo'}, {id: 'concepto', header: "Concepto", sortable: true, width: 500, dataIndex: 'descripcion'}]);
      var gp_conceptos_winins = new Ext.grid.GridPanel({height: 300, border: false, loadMask: true, stripeRows: true, cm: cm_conceptos_winins, sm: sm_conceptos_winins, store: st_conceptos_winins, bbar: [sfBuscar]});
      var fpAsoc = new Ext.form.FormPanel({frame: false, anchor: '100%', labelAlign: 'top', items: [cb_reportes]});
      var pGrid = new Ext.form.FormPanel({frame: false, anchor: '100%', layout: 'fit', items: [gp_conceptos_winins]});
      var pGeneral = new Ext.Panel({frame: true, items: [fpAsoc, pGrid]});
      function AdicionarConceptoReporte() {
          onloadMask(etiquetas.msgWait, etiquetas.lbMsgEspere);
          st_conceptos_winins.load({callback: function() {
                  if(!winIns) {
                      winIns = new Ext.Window({
                          onEsc: Ext.emptyFn(),
                          modal: true,
                          constrain: true,
                          defaultButton: 0,
                          closeAction: 'hide',
                          resizable: false,
                          title: etiquetas.titleWindAsoc,
                          width: 560,
                          autoHeight: true,
                          items: [pGeneral],
                          buttons: [{iconCls: 'cancelar', text: etiquetas.lbCancelar, tooltip: etiquetas.lbBtnTooltipCancelar, handler: function() {
                                      winIns.hide();
                                      sm_conceptos_winins.clearSelections();
                                      cb_reportes.reset();
                                      btn_Adicionar.focus();
                                  }}, {iconCls: 'aplicar', text: etiquetas.lbAplicar, tooltip: etiquetas.lbBtnTooltipAplicar, handler: function() {
                                      Asociar(1);
                                      Ext.getCmp('cbReportes').focus(true, 100);
                                  }}, {iconCls: 'aceptar', text: etiquetas.lbAceptar, tooltip: etiquetas.lbBtnTooltipAceptar, handler: function() {
                                      Asociar(0);
                                      btn_Adicionar.focus();
                                  }}]
                      });
                  }
                  lMask.hide();
                  winIns.show();
                  fpAsoc.getForm().reset();
                  winIns.doLayout();
                  cb_reportes.focus(false, 100);
              }});
      }
      function AsociarConcepto(reporte, conceptos) {
          loadMessageBox(etiquetas.loading);
          Ext.Ajax.request({
              url: 'asociarConceptosReporte',
              method: 'POST',
              params: {'reporte': reporte,
                  'conceptos': conceptos
              },
              callback: function(options, success, response)
              {
                  if(Ext.decode(response.responseText).codMsg == 'true')
                  {
                      sm_conceptos_winins.clearSelections();
                      cb_reportes.reset();
                      Ext.MessageBox.hide();
                      st_conceptos.load({callback: function() {
                              var mensaje = ( conceptos.length > 1 ) ? etiquetas.msgAddAsocOKPlural : etiquetas.msgAddAsocOKSingle;
                              mostrarMensaje(1, mensaje, function(btn) {
                                  if(btn == 'ok') {
                                      btn_Adicionar.focus();
                                  }

                              });
                          }});
                  } else
                      mostrarMensaje(1, etiquetas.lbNoConfRpt);
              }
          });
      }
      function Asociar(opcion) {
          if(fpAsoc.getForm().isValid()) {
              if(sm_conceptos_winins.hasSelection()) {
                  asociarconcepto = st_reportes.getAt(st_reportes.find('idreporte', cb_reportes.getValue())).data.asociarconcepto;
                  switch(asociarconcepto)
                  {
                      case '0' :
                          {
                              AsociarConcepto(cb_reportes.getValue(), null);
                          }
                          break;
                      case '1' :
                          {
                              var conceptos = new Array();
                              var chequeados = new Array();
                              chequeados = sm_conceptos_winins.getSelections();
                              for(var i = 0; i < chequeados.length; i++)
                                  conceptos.push(chequeados[i].data.idnomfijo);
                              AsociarConcepto(cb_reportes.getValue(), Ext.encode(conceptos));
                          }
                          break;
                      default :
                          {
                              mostrarMensaje(1, etiquetas.msgDeafultError);
                              opcion = 0;
                          }
                  }
              } else {
                  opcion = 1;
                  mostrarMensaje(1, etiquetas.msgInvalidForm, function() {
                  });
              }
              if(opcion == 0)
                  winIns.hide();
          }
      }
      function Eliminar() {
          var conceptos = new Array(), reportes = new Array(), chequeados = new Array();
          chequeados = sm_conceptos.getSelections();
          for(var i = 0; i < chequeados.length; i++) {
              conceptos.push(chequeados[i].data.idnomfijo);
              reportes.push(chequeados[i].data.idreporte);
          }
          var confirmsg = ( conceptos.length > 1 ) ? etiquetas.msgConfirmDelPlural : etiquetas.msgConfirmDelSingle;
          Ext.Msg.confirm(etiquetas.titleConfirm, confirmsg, function(btnPress) {
              if(btnPress === 'yes') {
                  loadMessageBox(etiquetas.loadingDel);
                  Ext.Ajax.request({
                      url: 'elimiarConceptosReportes',
                      method: 'POST',
                      params: {
                          conceptos: Ext.encode(conceptos),
                          reportes: Ext.encode(reportes)
                      },
                      callback: function(options, success, response) {
                          if(Ext.decode(response.responseText).codMsg == 'true') {
                              Ext.MessageBox.hide();
                              var mensaje = ( conceptos.length > 1 ) ? etiquetas.msgDelPlural : etiquetas.msgDelSingle;
                              mostrarMensaje(1, mensaje, function() {
                              });
                              btn_Eliminar.hide();
                              st_conceptos.load();
                          }
                      }
                  });
              }
          });
      }
      function fVentanaHeredar() {
          return new Ext.Window({
              modal: true, closeAction: 'close', resizable: false, id: 'wHeredar', title: etiquetas.lbTtlHeredar, autoWidth: true, autoHeight: true,
              items: [new Ext.grid.GridPanel({id: 'gpReporteHeredar', border: false, frame: true, loadMask: true, width: 800, height: 500, sm: new Ext.grid.CheckboxSelectionModel({}), cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({}), {id: 'id', hidden: true, hideable: false, dataIndex: 'idnomfijo'}, {menuDisabled: false, id: 'concepto', header: etiquetas.lbConcepto, width: 645, sortable: true, dataIndex: 'descripcion'}, {hidden: true, hideable: false, id: 'asociado', header: " ", dataIndex: 'asociarconcepto'}, {id: 'idreporte', hidden: true, hideable: false, dataIndex: 'idreporte'}, {id: 'reporte', header: "Reporte", sortable: true, hidden: true, dataIndex: 'reporte'}]), store: new Ext.data.GroupingStore({sortInfo: {field: 'descripcion', direction: "ASC"}, groupField: 'reporte', autoLoad: true, url: 'obtenerConceptosHeredar', reader: new Ext.data.JsonReader({root: "datos", totalProperty: "total"}, [{name: 'idnomfijo'}, {name: 'descripcion'}, {name: 'asociarconcepto'}, {name: 'idreporte'}, {name: 'reporte'}, {name: 'enabled'}]),
                          listeners: {'load': function(store, records, options) {
                                  if(records.length > 0) {
                                      Ext.getCmp('btnAplicar').enable();
                                      Ext.getCmp('btnAceptar').enable();
                                  } else {
                                      Ext.getCmp('btnAplicar').disable();
                                      Ext.getCmp('btnAceptar').disable();
                                      mostrarMensaje(1, etiquetas.lbMsgNoHeredar);
                                  }
                              }}}),
                      view: new Ext.grid.GroupingView({forceFit: true, startCollapsed: false, groupTextTpl: '{text} {[(values.rs[0].data.asociarconcepto > 0)? "(" + values.rs.length: ""]} {[(values.rs[0].data.asociarconcepto > 0)?((values.rs.length > 1) ? "Conceptos" : "Concepto")+")":""]}'})})],
              buttons: [{id: 'btnCancelar', iconCls: 'cancelar', text: etiquetas.lbCancelar, handler: function() {
                          Ext.getCmp('wHeredar').close();
                      }}, {id: 'btnAplicar', iconCls: 'aplicar', text: etiquetas.lbAplicar, handler: function() {
                          fGuardarConceptosHeredados(false, Ext.getCmp('gpReporteHeredar').getSelectionModel().getSelections());
                      }}, {id: 'btnAceptar', iconCls: 'aceptar', text: etiquetas.lbAceptar, handler: function() {
                          fGuardarConceptosHeredados(true, Ext.getCmp('gpReporteHeredar').getSelectionModel().getSelections());
                      }}]
          });
      }
      function fGuardarConceptosHeredados(opcion, recordsSelected) {
          if(recordsSelected.length > 0) {
              arraySelected = new Array();
              for(i = 0; i < recordsSelected.length; i++)
                  arraySelected.push(recordsSelected[i].data);
              Ext.Ajax.request({url: 'heredarConceptos', method: 'POST',
                  params: {'arraySelected': Ext.encode(arraySelected)},
                  callback: function(options, success, response) {
                      responseText = Ext.decode(response.responseText);
                      if(responseText.flag)
                          Ext.getCmp('gpConceptos').getStore().load({callback:
                                      function() {
                                          mostrarMensaje(1, etiquetas.lbMsgAsocOk);
                                          if(opcion)
                                              Ext.getCmp('wHeredar').close();
                                          else
                                              Ext.getCmp('gpReporteHeredar').getStore().load();
                                      }});
                      else
                          mostrarMensaje(1, etiquetas.lbNoConfRpt);
                  }});
          } else
              mostrarMensaje(1, etiquetas.lbMsgSelConfRpt);
      }
      function loadMessageBox(msg) {
          Ext.MessageBox.show({title: etiquetas.lbMsgEspere, msg: msg, width: 300, progress: true, closable: false});
          var f = function(v) {
              return function() {
                  var i = v / 11;
                  Ext.MessageBox.updateProgress(i);
              };
          };
          for(var i = 1; i < 12; i++) {
              setTimeout(f(i), i * 500);
          }
      }
  }
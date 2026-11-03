  Ext.QuickTips.init(); var perfil = window.parent.UCID.portal.perfil;
  Ext.Ajax.request({method: "POST", url: "cargaretiquetas", params: {vista: 'asoccuentaconcepto'}, callback: function(options, success, response) {
          var etiquetas = Ext.decode(response.responseText);
          Ext.Msg.wait(etiquetas.lbCargando, etiquetas.lbEspere);
          cargaDatosInicial(etiquetas);
      }});
  function cargaDatosInicial(etiquetas) { Ext.Ajax.request({
          url: 'cargaDatosInicial', method: 'POST',
          callback: function(options, success, response) {
              responseText = Ext.decode(response.responseText);
              cargarInterfaz(responseText.flag, etiquetas);
          }});}
  function cargarInterfaz(flag, etiquetas) {
      var winIns; var winCuentas;
      btnAdicionar = new Ext.Button({id: 'btnAdic', iconCls: 'adicionar', text: etiquetas.lbAsociar, tooltip: etiquetas.tooltipAsociar, handler: function() {
              Ext.Msg.wait(etiquetas.lbCargando, etiquetas.lbEspere);
              if(winIns)
                  tpArbolCuenta.getLoader().load(tpArbolCuenta.getRootNode());
              tpArbolCuenta.getRootNode().expand();
              Ext.Msg.hide();
              winForm();
          }});
      btnAyuda = new Ext.Button({id: 'btnAyuda', iconCls: 'ayuda', text: etiquetas.lBbtnAyuda, tooltip: etiquetas.lbTtbtnAyuda, handler: function() {
              var title = etiquetas.lbTittle;
              var referencia = 'confin/CG/configuracion/asociarcuentaaconcepto';
              help.show(title, referencia);
          }});
      btnEliminar = new Ext.Button({hidden: true, id: 'btnEli', iconCls: 'eliminar', text: etiquetas.lbEliminar, tooltip: etiquetas.tooltipEliminar, handler: function() {
              eliminarCtasConcepto();
          }});
      btnHeredar = new Ext.Button({id: 'btn_Heredar', iconCls: 'btn', icon:'/contabilidad/comun/images/heredar.png', hidden: false, text: etiquetas.lbHeredar, tooltip: etiquetas.tooltipHeredar, handler: function() {
              fVentanaHeredar().show();
          }});
      stConceptos = new Ext.data.Store({url: 'cargarconceptos', reader: new Ext.data.JsonReader({id: 'idconceptos'}, [{name: 'idnomfijo'}, {name: 'conceptodes', mapping: 'descripcion'}])});
      stConceptos.load();
      stAsocCta = new Ext.data.GroupingStore({url: 'obtenerCuentasConcepto', reader: new Ext.data.JsonReader({id: 'stAsocCta', root: 'datos', totalProperty: 'total'}, [{name: 'idcuenta'}, {name: 'cuenta'}, {name: 'concepto'}, {name: 'idconcepto'}, {name: 'text'}]), sortInfo: {field: 'cuenta', direction: "ASC"}, groupField: 'concepto'});
      stAsocCta.load();
      Ext.Msg.hide();
      cbsmAsocCta = new Ext.grid.CheckboxSelectionModel({});
      cbsmAsocCta.on({ rowselect: function(selectioModel, rowIndex, record) {
              Ext.getCmp('gpAsocCta').getView().addRowClass(rowIndex, "negrita");
              btnEliminar.show();
          }, rowdeselect: function(selectioModel, rowIndex, record) {
              Ext.getCmp('gpAsocCta').getView().removeRowClass(rowIndex, "negrita");
              if(selectioModel.getSelections().length == 0) {
                  btnEliminar.hide();
              } else {
                  btnEliminar.show();
              }
          }});
      gpAsocCta = new Ext.grid.GridPanel({frame: false, border: false, height: 300, id: 'gpAsocCta', layout: 'fit', autoExpandColumn: 'expandir', autoScroll: false, iconCls: 'icon-grid', view: new Ext.grid.GroupingView({forceFit: true, groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Cuentas" : "Cuenta"]})', startCollapsed: true}), sm: cbsmAsocCta, store: stAsocCta, columns: [cbsmAsocCta, {id: 'idcuenta', hidden: true, hideable: false, dataIndex: 'idcuenta'}, {id: 'text', header: "Cuenta", sortable: true, dataIndex: 'text'}, {id: 'concepto', header: "Concepto", sortable: true, hidden: true, dataIndex: 'concepto'}, {id: 'idconcepto', hidden: true, hideable: false, dataIndex: 'idconcepto'}], tbar: [btnAdicionar, btnEliminar, btnHeredar, '->', btnAyuda]});
      gpAsocCta.on('render', function(t, r, re) { btnAdicionar.focus();});
      treeload = new Ext.tree.TreeLoader({dataUrl: 'cargararbolcuenta'});
      sfBuscar = new Ext.Cont.SearchField({id: 'sfBuscar', width: 666, anchor: '100%', style: 'margin:0 0 5 2', lbTtlElement: 'cuentas', regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/, maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-]+)*$/, fnOnSearch: function() { busqueda = true; fnBuscarCuentas('Busc');}, fnOnClear: function() { busqueda = false; fnBuscarCuentas(); }});
      tpArbolCuenta = new Ext.tree.TreePanel({ id: 'tpArbolCuenta', autoScroll: true, enableDD: false, border: false, boxReady: true, style: 'margin:5 0 0 0', margins: '2 0 0 0', root: new Ext.tree.AsyncTreeNode({ text: etiquetas.lbRootCuenta, draggable: false, id: '0'}),  loader: treeload, bbar: [sfBuscar]});
      rootNode = new Ext.tree.AsyncTreeNode({ text: etiquetas.lbRootCuenta, draggable: false, id: '0', leaf: false});
      tpArbolCuenta.setRootNode(rootNode);
      cbConcepto = new Ext.form.ComboBox({emptyText: etiquetas.lbSeleccione, id: 'cbConcepto', forceSelection: true, fieldLabel: etiquetas.lbConceptos, store: stConceptos, valueField: 'idnomfijo', displayField: 'conceptodes', hiddenName: 'idnomfijo', typeAhead: true, tpl: '<tpl for="."><div ext:qtip="{conceptodes}" class="x-combo-list-item">{conceptodes}</div></tpl>', mode: 'local', allowBlank: false, triggerAction: 'all', selectOnFocus: true, anchor: '100%'});
      fpAsocCta = new Ext.form.FormPanel({
          frame: true,
          labelAlign: 'top',
          items: [cbConcepto]
      });
      pArbol = new Ext.form.FormPanel({
          id:'pArbol',
          frame: false,
          height: 358,
          layout: 'fit',
          items: [tpArbolCuenta]
      });
      pGeneral = new Ext.Panel({
          id:'pGeneral',
          frame: true,
          border: false,
          items: [fpAsocCta, pArbol],
          keys: new Ext.KeyMap(Ext.getBody(), [{
                  key: 'a', alt: true,
                  fn: function() {
                      if(!btnAdicionar.disabled)
                          btnAdicionar.handler.call();
                  }
              }, {
                  key: 'e', alt: true,
                  fn: function() {
                      if(!btnHeredar.hidden)
                          btnHeredar.handler.call();
                  }
              }, {
                  key: 'h', alt: true,
                  fn: function() {
                      if(!btnAyuda.hidden)
                          btnAyuda.handler.call();
                  }
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function() {
                      if(!btnEliminar.disabled)
                          btnEliminar.handler.call();
                  }
              }])
      });
      view = new Ext.Viewport({layout: 'fit', items: gpAsocCta});
      function fnBuscarCuentas(bus) {
          if(bus) {
              tpArbolCuenta.getLoader().baseParams = {filtro: Ext.getCmp('sfBuscar').getValue()};
              tpArbolCuenta.getLoader().load(tpArbolCuenta.getRootNode(), function() {
                  tpArbolCuenta.getRootNode().expand();
              });
          } else {
              tpArbolCuenta.getLoader().baseParams = {};
              tpArbolCuenta.getLoader().load(tpArbolCuenta.getRootNode(), function() {
                  tpArbolCuenta.getRootNode().expand();
              });
          }
      }
      function winForm() {
          if(!winIns) { winIns = new Ext.Window({
                  onEsc: Ext.emptyFn(),
                  modal: true,
                  constrain: true,
                  defaultButton: 0,
                  closeAction: 'hide',
                  loadMask: {msg: etiquetas.lbCargando},
                  resizable: false,
                  title: etiquetas.titleWindAsoc,
                  width: 700, height: 500,
                  items: [pGeneral],
                  buttons: [ {
                          iconCls: 'cancelar',
                          text: etiquetas.lbCancelar,
                          tooltip: etiquetas.lbBtnTooltipCancelar,
                          handler: function() {
                              winIns.hide();
                              btnAdicionar.focus();
                          }
                      }, {
                          iconCls: 'aplicar',
                          text: etiquetas.lbAplicar,
                          tooltip: etiquetas.lbBtnTooltipAplicar,
                          handler: function() {
                              fAsociarCta('apl');
                              Ext.getCmp('cbConcepto').focus(true, 100);
                              Ext.getCmp('cbConcepto').expand();
                          }
                      }, {
                          id: 'btnAceptarr',
                          iconCls: 'aceptar',
                          text: etiquetas.lbAceptar,
                          tooltip: etiquetas.lbBtnTooltipAceptar,
                          handler: function() {
                              fAsociarCta();
                              btnAdicionar.focus();
                          }
                      }]
              });
          }
          winIns.show();
          fpAsocCta.getForm().reset();
          winIns.doLayout();
          cbConcepto.focus(false, 100);
      }
      function fAsociarCta(apl) {
          if(fpAsocCta.getForm().isValid())
              if(tpArbolCuenta.getChecked().length > 0) {
                  arrayIdCuentas = new Array();
                  listChecked = tpArbolCuenta.getChecked();
                  for(i = 0; i < listChecked.length; i++)
                      arrayIdCuentas.push(listChecked[i].id);
                  fpAsocCta.getForm().submit({
                      url: 'asociarctasconcepto',
                      waitMsg: etiquetas.msgWaitAsoc,
                      params: {arrayCtas: Ext.encode(arrayIdCuentas)},
                      failure: function(form, action) {
                          if(action.result.codMsg != false) {
                              if(!apl) {
                                  winIns.hide();
                                  fpAsocCta.getForm().reset();
                              } else {
                                  fpAsocCta.getForm().reset();
                                  tpArbolCuenta.getLoader().load(tpArbolCuenta.getRootNode());
                              }
                              stAsocCta.load();
                              tpArbolCuenta.getRootNode().expand();
                              cbsmAsocCta.clearSelections();
                              btnEliminar.hide();
                              var mensaje = ( arrayIdCuentas.length > 1 ) ? etiquetas.msgAddAsocOKPlural : etiquetas.msgAddAsocOKSingle;
                              mostrarMensaje(1, mensaje);
                                      btnAdicionar.focus();
//                               mostrarMensaje(1, mensaje, function(btn) {
//                                   if(btn == 'ok') {
//                                       btnAdicionar.focus();
//                                   }
//                               });
                          }
                      }
                  });
              } else {
                  mostrarMensaje(1, etiquetas.msgInformCuenta);
              }
      }
      function eliminarCtasConcepto() {
          var cuentas = [];
          var conceptos = [];
          var aux = new Array();
          var chequeados = cbsmAsocCta.getSelections();
          for(var i = 0; i < chequeados.length; i++) {
              cuentas.push(chequeados[i].data.idcuenta); conceptos.push(chequeados[i].data.idconcepto);
              if(chequeados[i].data.base == 1)
                  aux.push(chequeados[i].data.idconcepto);
          }
          var confirmsg = ( cuentas.length > 1 ) ? etiquetas.lbConfirmDelMany : etiquetas.msgConfirmDelSingle;
          Ext.Msg.confirm(etiquetas.titleConfirm, confirmsg, function(btnPress) { if(btnPress === 'yes') {
                  loadMessageBox(etiquetas.loadingDel);
                  Ext.Ajax.request({ url: 'eliminarCuentasConcepto', method: 'POST', params: {'cuentas': Ext.encode(cuentas), 'conceptos': Ext.encode(conceptos), 'aux': Ext.encode(aux)}, callback: function(options, success, response) { if(Ext.decode(response.responseText).codMsg == 'true') {
                              Ext.MessageBox.hide(); cbsmAsocCta.clearSelections();
                              var mensaje = ( cuentas.length > 1 ) ? etiquetas.msgDelPlural : etiquetas.msgDelSingle;
                              stAsocCta.load({callback: function() {mostrarMensaje(1, mensaje);}});
                          }}});
              }});
      }
      function fVentanaHeredar() {
          return new Ext.Window ({
            modal: true, closeAction: 'close', resizable: false, id: 'wHeredar', title: etiquetas.tittleWindHeredar, autoWidth: true, autoHeight: true, items: [new Ext.grid.GridPanel({id: 'gpCuentasHeredar', border: false, frame: true, loadMask: true, width: 800, height: 500,
            cm: new Ext.grid.ColumnModel([new Ext.grid.CheckboxSelectionModel({}), {menuDisabled: true, id: 'text', header: etiquetas.lbCuenta, sortable: true, dataIndex: 'text'}, {id: 'concepto', header: etiquetas.lbConcepto, sortable: true, hidden: true, dataIndex: 'concepto'}, {id: 'idconcepto', hidden: true, hideable: false, dataIndex: 'idconcepto'}, {id: 'idcuenta', hidden: true, hideable: false, dataIndex: 'idcuenta'}, {id: 'idnomfijo', hidden: true, hideable: false, dataIndex: 'idnomfijo'}]),
            sm: new Ext.grid.CheckboxSelectionModel({}), store: new Ext.data.GroupingStore({sortInfo: {field: 'text', direction: "ASC"}, groupField: 'concepto', autoLoad: true, url: 'obtenerCuentasHeredar', reader: new Ext.data.JsonReader({root: "datos", totalProperty: "total"}, [{name: 'text'}, {name: 'concepto'}, {name: 'idconcepto'}, {name: 'idcuenta'}, {name: 'idnomfijo'}]), listeners: {'load': function(store, records, options) {
                                          if(records.length > 0) {
                                              Ext.getCmp('btnAplicar').enable();
                                              Ext.getCmp('btnAceptar').enable();
                                          } else {
                                              Ext.getCmp('btnAplicar').disable();
                                              Ext.getCmp('btnAceptar').disable();
                                              mostrarMensaje(1, etiquetas.msgNoConceptHeredar);
                                          }
                                      }}}), view: new Ext.grid.GroupingView({forceFit: true, startCollapsed: false, groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Cuentas" : "Cuenta"]})'})})],
              buttons: [{id: 'btnCancelar', iconCls: 'cancelar', text: 'Cancelar', tooltip: etiquetas.lbBtnTooltipCancelar, handler: function() {
                          Ext.getCmp('wHeredar').close();
                      }}, {id: 'btnAplicar', iconCls: 'aplicar', text: 'Aplicar', tooltip: etiquetas.lbBtnTooltipAplicar, handler: function() {
                          fGuardarCuentasHeredados(false, Ext.getCmp('gpCuentasHeredar').getSelectionModel().getSelections());
                      }}, {id: 'btnAceptar', iconCls: 'aceptar', text: 'Aceptar', tooltip: etiquetas.lbBtnTooltipAceptar, handler: function() {
                          fGuardarCuentasHeredados(true, Ext.getCmp('gpCuentasHeredar').getSelectionModel().getSelections());
                      }}]
        });
      }
      function fGuardarCuentasHeredados(opcion, recordsSelected) {
          if(recordsSelected.length > 0) {
              arraySelected = new Array();
              for(i = 0; i < recordsSelected.length; i++)
                  arraySelected.push(recordsSelected[i].data);
              Ext.Ajax.request({url: 'heredarCuentas', method: 'POST', params: {'arraySelected': Ext.encode(arraySelected)}, callback: function(options, success, response) {
                      responseText = Ext.decode(response.responseText);
                      if(responseText.flag)
                          Ext.getCmp('gpAsocCta').getStore().load({callback:
                            function() {
                                var mensaje = ( arraySelected.length > 1 ) ? etiquetas.msgAddAsocOKPlural : etiquetas.msgAddAsocOKSingle;
                                mostrarMensaje(1, mensaje);
                                if(opcion)
                                    Ext.getCmp('wHeredar').close();
                                else
                                    Ext.getCmp('gpCuentasHeredar').getStore().load();
                            }});
                      else
                          mostrarMensaje(1, etiquetas.msg1);
                  }});
          } else mostrarMensaje(1, etiquetas.msgNoConfigSelectedHeredar);
      }
      function loadMessageBox(msg) {
          Ext.MessageBox.show({title: etiquetas.lbEspere, msg: msg, width: 300, progress: true, closable: false});
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
  Ext.QuickTips.init();
  var perfil = window.parent.UCID.portal.perfil;
  UCID.portal.cargarEtiquetas('cambiarsaldocuenta', function() {
      cargarInterfaz();
  });
  var tfCtaODropTargetEl, ctadestino = '', ind, winRegistroAnx, texto, nameCtaO, arrayCtasO = Array(), arrayCtaD = Array();
  function cargarInterfaz() {
      smCambioSaldo = new Ext.grid.RowSelectionModel({
          singleSelect: true,
          listeners: {
              rowselect: function(selModel, rowIndex, record) {
                  Ext.getCmp('gpCambioSaldo').getView().addRowClass(rowIndex, "negrita");
                  Ext.getCmp('btnregistroanex').disable();
                  if(record.data.anexo == 1)
                      Ext.getCmp('btnregistroanex').enable();
                  ind = rowIndex;
              },
              rowdeselect: function(selModel, rowIndex, record) {
                  Ext.getCmp('gpCambioSaldo').getView().removeRowClass(rowIndex, "negrita");
              }
          }
      });
      var btnCancelar = new Ext.Button({
          disabled: true,
          iconCls: 'cancelar',
          text: perfil.etiquetas.lbbtnCancelar,
          tooltip: perfil.etiquetas.tooltipbtnCancelar,
          handler: function() {
              cancelarCtas();
          }
      });
      var btnCambiarS = new Ext.Button({
          disabled: true,
          iconCls: 'cambiar', text: perfil.etiquetas.lbbtnCambiar,
          tooltip: perfil.etiquetas.tooltibtnCambiar,
          handler: function() {
              realizarCambioCuenta();
          }
      });
      var btnRegistroA = new Ext.Button({
          disabled: true,
          id: 'btnregistroanex',
          iconCls: 'abrirventana',
          text: perfil.etiquetas.lbbtnRegistro,
          tooltip: perfil.etiquetas.tooltibtnRegistro,
          handler: function() {
              flagAnexo = 'SaldoAnexo';
              if(ind == stCambioSaldo.getCount() - 1 && tfCuentaD.getValue()) {
                  flagAnexo = 'AnexoCC';
              }
              if(smCambioSaldo.getSelected()) {
                  loadMask(perfil.etiquetas.lbCargando);
                  stRegistroAnx.load({
                      params: {
                          idcuenta: smCambioSaldo.getSelected().data.idcuenta,
                          flaganexo: flagAnexo,
                          ctasorigen: Ext.encode(arrayCtasO)
                      },
                      callback: function() {
                          if(stRegistroAnx.getCount() > 0)
                              abrirWindow(perfil.etiquetas.lbTtlRegistro, gpRegistroAnx);
                          else
                              mostrarMensaje(1, perfil.etiquetas.msgNotRegistro);
                          //aqui va ...(tpArbolCuenta.el.dom, perfil.etiquetas.ttleInf, perfil.etiquetas.msgNotRegistro);
                          lMask.hide();
                      }
                  });
              } else {
                  mostrarMensaje(1, "Debe seleccionar la cuenta que quiere ver su registro anexo al pase.");
              }
          }});
      var btnAyuda = new Ext.Button({
          id: 'btnAyu',
          iconCls: 'ayuda',
          tooltip: perfil.etiquetas.tooltibtnAyuda,
          text: perfil.etiquetas.lbbtnAyuda,
          handler: function() {
              var title = perfil.etiquetas.lbVAyuda;
              var referencia = 'confin/CG/comp_oper/cambiarsaldocuenta';
              help.show(title, referencia);

          }
      });
      var tfCuentaO = new Ext.form.TextArea({
          fieldLabel: perfil.etiquetas.lbCuentaOrigen,
          anchor: '100%',
          height: '100',
          name: 'cuentao',
          listeners: {'render': function(t) {
                  tfCtaODropTargetEl = t.el.dom;
                  var tfCtaODropTarget = new Ext.dd.DropTarget(tfCtaODropTargetEl, {
                      ddGroup: 'grupoDD',
                      notifyDrop: function(ddSource, e, data) {
                          if(data.node.leaf) {
                              if(verificarCtas(ddSource.dragData.node.attributes.id))
                              {
                                  loadMask(perfil.etiquetas.lbCargando);
                                  Ext.Ajax.request({
                                      url: 'calcularsaldoCtaO',
                                      params: {ctaorigen: ddSource.dragData.node.attributes.id},
                                      callback: function(options, success, response) {
                                          responseData = Ext.decode(response.responseText);
                                          if(responseData.codMsg) {
                                              mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                              lMask.hide();
                                          }
                                          else
                                          {
                                              var record = Ext.data.Record.create([
                                                  {name: 'idcuenta'}, {name: 'cuenta'}, {name: 'debito'}, {name: 'credito'}, {name: 'anexo'}]);
                                              var valores = new record({
                                                  idcuenta: ddSource.dragData.node.attributes.id,
                                                  cuenta: ddSource.dragData.node.attributes.text,
                                                  debito: responseData.debito,
                                                  credito: responseData.credito,
                                                  anexo: responseData.anexo
                                              });
                                              stCambioSaldo.insert(arrayCtasO.length, valores);
                                              texto = (!texto) ? (ddSource.dragData.node.attributes.text) : (texto + ' \n' + ddSource.dragData.node.attributes.text);
                                              t.setValue(texto);
                                              array = {idcuenta: ddSource.dragData.node.attributes.id, debito: responseData.debito, credito: responseData.credito, anexo: responseData.anexo};
                                              arrayCtasO.push(array);
                                              lMask.hide();
                                              if(ctadestino != '')
                                                  verificarCompatibilidadCtas(ctadestino);
                                              btnCancelar.enable();
                                              if(tfCuentaD.getValue()) {
                                                  btnCambiarS.enable();
                                              }
                                              tfCuentaD.enable();
                                              return true;
                                          }
                                      }});
                              }
                              else
                                  mostrarMensaje(1, perfil.etiquetas.msgExiste, function() {
                                  });
                              return true;
                          }
                      }});
              },
              'focus': function(t) {
                  btnCancelar.focus();
              }}
      });
      var tfCuentaD = new Ext.form.TextField({
          fieldLabel: perfil.etiquetas.lbCuentaDestino,
          anchor: '100%',
          name: 'cuentad',
          disabled: true,
          listeners: {'render': function(t) {
                  tfCtaDDropTargetEl = t.el.dom;
                  var tfCtaDDropTarget = new Ext.dd.DropTarget(tfCtaDDropTargetEl, {
                      ddGroup: 'grupoDD',
                      notifyDrop: function(ddSource, e, data) {
                          t.setValue(ddSource.dragData.node.attributes.text);
                          verificarCompatibilidadCtas(ddSource.dragData.node.attributes.id);
                          btnCancelar.enable();
                          if(tfCuentaO.getValue()) {
                              btnCambiarS.enable();
                          }
                          return true;
                      }});
              },
              'focus': function(t) {
                  btnCancelar.focus();
              }}
      });
      taDescripcion = new Ext.form.TextArea({
          fieldLabel: perfil.etiquetas.lbDescrip,
          id: 'tadesc',
          disabled: true,
          tabIndex: 5,
          allowBlank: false,
          name: 'tadesc',
          width: '100%',
          height: 50
      });
      cmCambioSaldo = new Ext.grid.ColumnModel([{
              id: 'idp', header: "idp", dataIndex: 'idp', hidden: true}, {
              id: 'cuenta', header: perfil.etiquetas.lbCuenta, dataIndex: 'cuenta', width: 108}, {
              id: 'deb', header: perfil.etiquetas.lbDebito, dataIndex: 'debito', width: 80, align: 'right'}, {
              id: 'cred', header: perfil.etiquetas.lbCredito, dataIndex: 'credito', width: 80, align: 'right'}, {
              id: 'anexo', header: perfil.etiquetas.lbAter, tooltip: perfil.etiquetas.tooltipAnexo, dataIndex: 'anexo', width: 25, align: 'center', renderer: changeAnexo}]);
      stCambioSaldo = new Ext.data.Store({
          reader: new Ext.data.JsonReader({
              id: 'id'
          }, [{
                  name: 'idcuenta'
              }, {
                  name: 'cuenta'
              }, {
                  name: 'debito'
              }, {
                  name: 'credito'
              }, {
                  name: 'anexo'
              }])
      });
      var gpCambioSaldo = new Ext.grid.GridPanel({
          id: 'gpCambioSaldo',
          border: false,
          style: 'margin: 20 0 0 0',
          hideBorders: true,
          bodyBorder: false,
          layout: 'fit',
          stripeRows: true,
          layoutConfig: {
              forceFit: true
          },
          autoScroll: true,
          cm: cmCambioSaldo,
          sm: smCambioSaldo,
          frame: true,
          height: 200,
          autoExpandColumn: 'cuenta',
          store: stCambioSaldo,
          tbar: [btnRegistroA]
      });
      var fpCuentas = new Ext.form.FormPanel({
          bodyStyle: 'padding: 10px; background-color: #DFE8F6',
          labelAlign: 'top',
          region: 'east',
          frame: true,
          width: 550,
          height: 500,
          items: [tfCuentaO, tfCuentaD, {
                  xtype: 'fieldset',
                  id: 'fsComprobante',
                  style: 'margin: 10 0 0 0',
                  title: perfil.etiquetas.lbComprobante,
                  autoHeight: true,
                  anchor: '100%',
                  items: [taDescripcion, gpCambioSaldo]}],
          buttons: [btnCancelar, btnCambiarS]
      });
      tpArbolCuenta = new Ext.tree.TreePanel({
          id: 'tpArbolCuenta',
          autoScroll: true,
          ddGroup: 'grupoDD',
          border: false,
          region: 'center',
          enableDrag: true,
          enableDrop: false,
          height: 500,
          root: new Ext.tree.AsyncTreeNode({
              text: perfil.etiquetas.lbCuenta,
              expanded: true,
              draggable: true,
              id: '0'
          }),
          margins: '2 2 2 2',
          loader: tlCuentas = new Ext.tree.TreeLoader({
              dataUrl: 'cargararbolcuenta',
              listeners: {
                  load: function(treeloader, node, response) {
                      dataResult = Ext.decode(response.responseText);
                      Ext.getCmp('tpArbolCuenta').body.unmask();
                      if(dataResult.length <= 0) {
                          mostrarMensaje(1, "No existen datos que mostrar.");
                      }
                  },
                  beforeload: function(treeloader, node) {
                      Ext.getCmp('tpArbolCuenta').body.mask('Cargando', 'x-mask-loading');
                  }
              }
          })
      });
      var pcentro = new Ext.Panel({
          tbar: ['->', btnAyuda],
          layout: 'border',
          keys: new Ext.KeyMap(Ext.getBody(), [{
                  key: 'h',
                  alt: true,
                  fn: function() {
                      var title = perfil.etiquetas.lbVAyuda;
                      var referencia = 'confin/CG/comp_oper/cambiarsaldocuenta';
                      help.show(title, referencia);

                  }
              }]),
          items: [tpArbolCuenta, fpCuentas] //contiene al grid y al panel colapsible

      });
      var vpCambioSaldo = new Ext.Viewport({
          layout: 'fit',
          items: pcentro
      });
      stRegistroAnx = new Ext.data.Store({
          url: 'mostrarreganexo',
          reader: new Ext.data.JsonReader({
              id: 'id'
          }, [{
                  name: 'centrocosto'
              }, {
                  name: 'objetogasto'
              }, {
                  name: 'importe',
                  type: 'float'
              }])
      });
      sm = new Ext.grid.RowSelectionModel({
          singleSelect: true,
          listeners: {
              rowselect: function(selModel, rowIndex, record) {
                  Ext.getCmp('gpRegistroAnx').getView().addRowClass(rowIndex, "negrita");
              },
              rowdeselect: function(selModel, rowIndex, record) {
                  Ext.getCmp('gpRegistroAnx').getView().removeRowClass(rowIndex, "negrita");
              }
          }
      });
      var gpRegistroAnx = new Ext.grid.GridPanel({
          id: 'gpRegistroAnx',
          frame: false,
          layout: 'fit',
          autoExpandColumn: 'expandir',
          autoScroll: false,
          stripeRows: true,
          layoutConfig: {
              forceFit: true
          },
          height: 250,
          region: 'center',
          sm: sm,
          store: stRegistroAnx,
          columns: [
              {id: 'expandir', header: perfil.etiquetas.lbCCosto, sortable: true, dataIndex: 'centrocosto'},
              {header: perfil.etiquetas.lbGastos, width: 300, sortable: true, dataIndex: 'objetogasto'},
              {header: perfil.etiquetas.lbImporte, width: 80, sortable: true, align: 'right', dataIndex: 'importe', renderer: formatoMoneda}
          ]
      });
      function abrirWindow(title, componente) {
          if(!winRegistroAnx)
          {
              winRegistroAnx = new Ext.Window({
                  layout: 'fit',
                  width: 730,
                  autoHeigth: true,
                  modal: true,
                  closable: false,
                  resizable: false,
                  plain: true,
                  constrain: true,
                  defaultButton: 0,
                  buttons: [new Ext.Button({
                          disabled: false,
                          id: 'btncerrar',
                          iconCls: 'cerrar',
                          text: perfil.etiquetas.lbBtnSalir,
                          tooltip: perfil.etiquetas.lbTtSalir,
                          handler: function() {
                              winRegistroAnx.hide();
                          }
                      })]
              });
          }
          winRegistroAnx.setTitle(title);
          winRegistroAnx.add(componente);
          winRegistroAnx.doLayout(true);
          winRegistroAnx.show();
      }
      function cancelarCtas() {
          stCambioSaldo.removeAll();
          tfCuentaO.reset();
          tfCuentaD.reset();
          arrayCtasO = new Array();
          arrayCtaD = new Array();
          btnCancelar.disable();
          btnCambiarS.disable();
          btnRegistroA.disable();
          taDescripcion.reset();
          texto = '';
          ctadestino = '';
          tfCuentaD.disable();
      }
      function realizarCambioCuenta() {
          Ext.Msg.wait("Realizando el cambio de saldo de la(s) cuenta(s)...", "Por favor espere...");
          Ext.Ajax.request({
              url: 'realizarcambiocuenta',
              method: 'POST',
              params: {ctasorigen: Ext.encode(arrayCtasO), ctadestino: Ext.encode(arrayCtaD), descripcion: taDescripcion.getValue()},
              callback: function(options, success, response) {
                  Ext.Msg.hide();
                  responseData = Ext.decode(response.responseText);
                  if(responseData.codMsg != -3) {
                      cancelarCtas();
                  }
                  if(responseData.codMsg == -1) {
                      mostrarMensaje(1, perfil.etiquetas.msgAddCompr.replace('<numero>', responseData.idcomprobante), function() {
                      });
                  } else if(responseData.codMsg == -3) {
                      mostrarMensaje(1, perfil.etiquetas.msgNotCambio, function() {
                      });
                  }
              }
          }
          );
      }
      function calcularSaldoCuenta(idcuenta) {
          Ext.Ajax.request({
              url: 'calcularsaldoCtaO',
              params: {ctaorigen: idcuenta},
              callback: function(options, success, response) {
                  responseData = Ext.decode(response.responseText);
                  if(responseData.codMsg) {
                      mostrarMensaje(responseData.codMsg, responseData.mensaje);
                      return false;
                  }
                  else
                  {
                      var record = Ext.data.Record.create([
                          {name: 'cuenta'}, {name: 'cuenta'}, {name: 'debito'}, {name: 'credito'}, {name: 'anexo'}]);

                      var valores = new record({
                          idcuenta: idcuenta,
                          cuenta: nameCtaO,
                          debito: responseData.debito,
                          credito: responseData.credito,
                          anexo: responseData.anexo
                      });
                      stCambioSaldo.add(valores);
                      return true;
                  }
              }});
      }
      function loadMask(message) {
          lMask = new Ext.LoadMask(Ext.getBody(), {msg: message});
          lMask.show();
      }
      function changeAnexo(val) {
          return (val == 1) ? '*' : '';
      }
      function verificarCtas(idcuenta) {
          for(var i = 0; i < arrayCtasO.length; i++)
          {
              if(arrayCtasO[i].idcuenta == idcuenta)
              {
                  return false;
              }
          }
          return true;
      }
      function verificarCompatibilidadCtas(idcuentad) {
          loadMask(perfil.etiquetas.lbCargando);
          Ext.Ajax.request({
              url: 'verificarcompatibilidadctas',
              params: {ctasorigen: Ext.encode(arrayCtasO), ctadest: idcuentad},
              callback: function(options, success, response) {
                  responseData = Ext.decode(response.responseText);
                  if(responseData.codMsg !== undefined) {
                      function fAcepto() {
                          btnCambiarS.disable();
                          btnRegistroA.disable();
                      }
                      mostrarMensaje(1, responseData.mensaje, fAcepto);
                      tfCuentaD.reset();
                      if(ctadestino != '') {
                          stCambioSaldo.remove(stCambioSaldo.getAt(stCambioSaldo.getCount() - 1));
                          arrayCtaD.splice(0, 1);
                          ctadestino = '';
                      }
                      lMask.hide();
                  } else {
                      var saldodestino = 0;
                      var credito = '0';
                      var debito = '0';
                      var ctasdescripcion = '';
                      if(ctadestino != '') {
                          stCambioSaldo.remove(stCambioSaldo.getAt(stCambioSaldo.getCount() - 1));
                          arrayCtaD.splice(0, 1);
                      }
                      for(var i = 0; i < stCambioSaldo.getCount(); i++)
                      {
                          saldodestino += (cleanComa(stCambioSaldo.getAt(i).data.debito) - cleanComa(stCambioSaldo.getAt(i).data.credito));
                          ctasdescripcion += (i + 1 != stCambioSaldo.getCount()) ? (stCambioSaldo.getAt(i).data.cuenta + ', ') : (stCambioSaldo.getAt(i).data.cuenta);
                      }
                      (saldodestino > 0) ? (credito = saldodestino) : (debito = Math.abs(parseFloat(saldodestino)));

                      var record = Ext.data.Record.create([
                          {name: 'idcuenta'}, {name: 'cuenta'}, {name: 'debito'}, {name: 'credito'}, {name: 'anexo'}]);

                      var valores = new record({
                          idcuenta: idcuentad,
                          cuenta: tfCuentaD.getValue(),
                          debito: debito,
                          credito: credito,
                          anexo: responseData.anexo
                      });
                      stCambioSaldo.add(valores);
                      array = {idcuenta: idcuentad, debito: debito, credito: credito, anexo: responseData.anexo};
                      arrayCtaD.push(array);
                      taDescripcion.setValue(perfil.etiquetas.lbCambio + ctasdescripcion + perfil.etiquetas.lbcuenta + tfCuentaD.getValue() + '.');
                      ctadestino = idcuentad;
                  }
                  lMask.hide();
              }});
      }

      function cleanComa(v) {
          if(v != (0 || '0.00'))
              v = v.replace(/\,/g, ''); //sacar coma repetida
          return v;
      }

  }
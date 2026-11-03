
  if(!Ext.Cont)
      Ext.namespace('Ext.Cont');
  Ext.Cont.ConfCierre = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil, etiquetas: new Object(),
      paramsConf: new Array(),
      arrayEstadosFinancierosConf: new Array(),
      constructor: function() {
          Ext.QuickTips.init();
          scopeConfCierre = this;
          scopeConfCierre.etiquetas = Contabilidad.Cierre.idioma;
          Ext.Msg.wait(scopeConfCierre.etiquetas.lbCargando, scopeConfCierre.etiquetas.lbEsperando);
          scopeConfCierre.initApp();
      },
      loadMask: function(agMsg) {
          scopeConfCierre.lMask = new Ext.LoadMask(Ext.getBody(), {msg: agMsg || scopeConfCierre.etiquetas.lbCargando});
          scopeConfCierre.lMask.show();
      },
      onloadMessageBox: function() {
          Ext.MessageBox.show({title: scopeConfCierre.etiquetas.lbEsperando, msg: scopeConfCierre.etiquetas.lbCargando, width: 300, progress: true, closable: false});
          var f = function(v) {
              return function() {
                  var i = v / 11;
                  Ext.MessageBox.updateProgress(i);
              };
          };
          for(var i = 1; i < 12; i++) {
              setTimeout(f(i), i * 500);
          }
      },
      initApp: function() {
          scopeConfCierre.stOperaciones = new Ext.data.Store({
              url: 'cargarconfiguracion',
              autoLoad: true,
              reader: new Ext.data.JsonReader({root: 'datos', totalProperty: 'cant'}, [
                  {name: 'idconfcierre'},
                  {name: 'idtipocuenta'},
                  {name: 'descripcion'},
                  {name: 'idcuentagrupo'},
                  {name: 'descripcioncuentagrupo'},
                  {name: 'idoperacion'},
                  {name: 'descripcionoperacion'}
              ]),
              listeners: {
                  'load': function(st, rec, obj) {
                      var ctas = {cant: '6', datos: [
                              {descripcion: 'Nominales Acreedoras', idconfcierre: '', idtipocuenta: '8031', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                              {descripcion: 'Nominales Deudoras', idconfcierre: '', idtipocuenta: '8032', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                              //  {descripcion: 'Orden', idconfcierre: '', idtipocuenta: '8033', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                              {descripcion: 'Resultado', idconfcierre: '', idtipocuenta: '8034', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                              {descripcion: 'Utilidades Retenidas', idconfcierre: '', idtipocuenta: '8035', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                              {descripcion: 'Pérdida', idconfcierre: '', idtipocuenta: '8036', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                          ]};
                      if(rec.length == 0)
                          st.loadData(ctas);
                  }
              }
          });
          scopeConfCierre.cmOperaciones = new Ext.grid.ColumnModel({
              columns: [
                  {
                      header: scopeConfCierre.etiquetas.lbNombCuenta,
                      tooltip: scopeConfCierre.etiquetas.lbTtNombCuenta,
                      id: 'cuenta',
                      dataIndex: 'descripcion',
                      width: 120,
                      editor: this.tfCuenta = new Ext.form.TextField({
                          allowBlank: false,
                          disabled: true
                      })
                  }, {
                      header: scopeConfCierre.etiquetas.lbGrupoCta,
                      tooltip: scopeConfCierre.etiquetas.lbTtGrupoCta,
                      id: 'grupocuenta',
                      dataIndex: 'descripcioncuentagrupo',
                      width: 225,
                      sortable: true,
                      editor: scopeConfCierre.cbxGrupoCta = new Ext.CONT.UIXCombo({
                          emptyText: scopeConfCierre.etiquetas.lbSeleccione,
                          allowBlank: false,
                          hiddenTbar: true
                      }, {
                          identificador: 'GrupoCta',
                          displayText: scopeConfCierre.etiquetas.lbCtaNomAcreedora,
                          url: 'obtenercuentastipo',
                          singleSelect: true,
                          reader: scopeConfCierre.jrCtaNomAcreedora = new Ext.data.JsonReader({id: 'id', root: 'datos'
                          }, [{
                                  name: '_parent'
                              }, {
                                  name: '_is_leaf',
                                  mapping: 'leaf'
                              }, {name: 'text'
                              }, {
                                  name: 'nivel'
                              }, {
                                  name: 'descripcion'
                              }, {
                                  name: 'codigo'
                              }, {
                                  name: 'id'
                              }, {
                                  name: 'idformato'
                              }, {name: 'ordenizq'
                              }, {
                                  name: 'ordender'
                              }])
                      })
                  }, {
                      header: scopeConfCierre.etiquetas.lbOperacion,
                      tooltip: scopeConfCierre.etiquetas.lbTtOperacion,
                      id: 'operacion',
                      dataIndex: 'descripcionoperacion',
                      width: 150,
                      sortable: true,
                      editor: scopeConfCierre.cbxRowEditorOperaciones = new Ext.form.ComboBox({
                          id: 'cbxRowEditorOperaciones',
                          tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                          editable: false,
                          resizable: true,
                          lazyRender: true,
                          readOnly: true,
                          displayField: 'denominacion',
                          valueField: 'idnomoperaciones',
                          hiddenName: 'idnomoperaciones',
                          typeAhead: true,
                          forceSelection: true,
                          mode: 'local',
                          triggerAction: 'all',
                          allowBlank: false,
                          savedisplayField: true,
                          store: new Ext.data.Store({
                              autoLoad: true,
                              url: 'obteneroperaciones',
                              reader: new Ext.data.JsonReader({
                                  totalProperty: 'cant',
                                  root: 'datos'
                              }, [{name: 'idnomoperaciones'}, {
                                      name: 'denominacion'
                                  }])
                          }),
                          listeners: {
                              'select': function(cb, rc, idx) {
                                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().beginEdit();
                                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().set('idnomoperaciones', rc.data.idnomoperaciones);
                                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().endEdit();
                              }
                          }
                      })
                  }, {
                      dataIndex: 'idcuenta',
                      hidden: true,
                      hideable: false
                  }, {
                      dataIndex: 'idnomoperaciones',
                      hidden: true,
                      hideable: false
                  }
              ]
          });
          scopeConfCierre.rowEditorCtas = new Ext.Cont.RowEditor({
              id: 'rowEditorCtas',
              clicksToEdit: 2,
              iconCls: 'btn',
              cancelText: scopeConfCierre.etiquetas.lbCancelar,
              saveText: scopeConfCierre.etiquetas.lbAceptar,
              iconSave: scopeConfCierre.perfil.dirImg + 'aceptar.png',
              iconCancel: scopeConfCierre.perfil.dirImg + 'cancelar.png'
          });
          scopeConfCierre.gpOperaciones = new Ext.grid.GridPanel({
              id: 'gpOperacionesc',
              height: 230,
              region: 'center',
              loadMask: true,
              autoExpandColumn: 'operacion',
              plugins: scopeConfCierre.rowEditorCtas,
              width: 220,
              store: scopeConfCierre.stOperaciones,
              cm: scopeConfCierre.cmOperaciones
          });
          new Ext.Window({
              title: scopeConfCierre.etiquetas.lbTtlConfCierreContable,
              resizable: false,
              closeAction: 'close',
              modal: true,
              layout: 'fit',
              id: 'winConfCierre',
              width: 640,
              height: 500,
              constrain: true,
              defaultButton: 0,
              items: [new Ext.FormPanel({
                      id: 'confCierre',
                      layout: 'border',
                      labelAlign: 'top',
                      frame: true,
                      items: [scopeConfCierre.gpOperaciones
                                  , {
                                      xtype: 'fieldset',
                                      title: scopeConfCierre.etiquetas.lbEstadosFinancieros,
                                      region: 'south',
                                      anchor: '99%',
                                      height: 230,
                                      bodyStyle: 'margin:-2 0 5 5',
                                      items: [{
                                              xtype: 'itemselector',
                                              name: 'itemselector',
                                              id: 'itemselector',
                                              fieldLabel: "ItemSelector",
                                              hideLabel: true,
                                              loadMask: true,
                                              dataFields: ['id', 'descripcion'],
                                              msWidth: 275,
                                              msHeight: 200,
                                              valueField: 'id',
                                              displayField: 'descripcion',
                                              imagePath: '/contabilidad/comun/componentes/MultiItemSelector/images',
                                              toLegend: scopeConfCierre.etiquetas.lbEstadosFinancierosGen,
                                              fromLegend: scopeConfCierre.etiquetas.lbEstadosFinancierosConf,
                                              toStore: scopeConfCierre.stEstadosFDerech = new Ext.data.Store({
                                                  url: 'cargarEstadosFinancieros',
                                                  autoLoad: true, reader: new Ext.data.JsonReader({root: 'datos', totalProperty: 'cant'}, [{name: 'id'}, {name: 'descripcion'}])
                                              }),
                                              fromStore: scopeConfCierre.stEstadosF = new Ext.data.Store({
                                                  url: 'obtenerestadosfinancierosconf',
                                                  autoLoad: true, reader: new Ext.data.JsonReader({root: 'datos', totalProperty: 'cant'}, [{name: 'id'}, {name: 'descripcion'}])
                                              })
                                          }]
                                  }]
                  })],
              buttons: [{
                      id: 'btnCancelarConf',
                      iconCls: 'cancelar',
                      text: scopeConfCierre.etiquetas.lbCancelar,
                      tooltip: scopeConfCierre.etiquetas.lbTtCancelar,
                      handler: function() {
                          Ext.getCmp('confCierre').getForm().reset();
                          Ext.getCmp('winConfCierre').close();
                          Ext.getCmp('btnMenu').focus();
                      }
                  }, {id: 'btnAceptarConf',
                      iconCls: 'guardar',
                      text: scopeConfCierre.etiquetas.lbGuardar,
                      tooltip: scopeConfCierre.etiquetas.lbTtAceptar,
                      handler: function() {
                          if(Ext.getCmp('confCierre').getForm().isValid()) {
                              var selector = Ext.getCmp('confCierre').getForm().findField('itemselector').getDataRight();
                              var data = scopeConfCierre.gpOperaciones.getStore().getRange();
                              var arrayDatos = [];
                              for(var i = 0; i < data.length; i++) {
                                  arrayDatos.push({
                                      idtipocuenta: data[i].data.idtipocuenta,
                                      idcuentagrupo: data[i].data.idcuentagrupo,
                                      idoperacion: data[i].data.idnomoperaciones,
                                      idconfcierre: data[i].data.idconfcierre
                                  });
                              }
                              //queda agrgar el cargar del panel derecho
                              //if (selector.length == 0) {
                              if(validar(arrayDatos) == true) {
                                  Ext.Msg.wait(scopeConfCierre.etiquetas.lbGuardandoConf, scopeConfCierre.etiquetas.lbEsperando);
                                  Ext.Ajax.request({
                                      method: "POST",
                                      url: "registrarconfiguracioncierre",
                                      params: {datos: Ext.encode(arrayDatos),
                                          estadosf: Ext.encode(selector)
                                      },
                                      callback: function(options, success, response) {
                                          var result = Ext.decode(response.responseText);
                                          Ext.Msg.hide();
                                          switch(result) {
                                              case -1:
                                                  {
                                                      mostrarMensaje(1, 'La configuraci&oacute;n ha sido guardada satisfactoriamente.');
                                                      Ext.getCmp('confCierre').getForm().reset();
                                                      Ext.getCmp('winConfCierre').close();
                                                      Ext.getCmp('btnMenu').focus();
                                                  }
                                                  break;
                                              case -2:
                                                  {
                                                      mostrarMensaje(1, 'Ya existe la configuraci&oacute;n para este jercicio.');
                                                  }
                                                  break;
                                          }
                                      }
                                  });
                              } else
                                  mostrarMensaje(1, 'Debe configurar los datos de las cuentas.');
//                            } else
//                                mostrarMensaje(1, 'Debe establecer el orden de los estados finacieron a generar.');
                          }
                      }
                  }],
              listeners: {
                  'show': function() {
                      Ext.Msg.hide();
                  }
              }
          });
          function validar(array) {
              if(array.length > 0 && array[0].idcuentagrupo != '' && array[0].idoperacion != '' &&
                      array[1].idcuentagrupo != '' && array[1].idoperacion != '' &&
                      array[3].idcuentagrupo != '' &&
                      array[4].idcuentagrupo != '' && array[4].idoperacion != ''/* &&
                       array[5].idcuentagrupo != '' && array[5].idoperacion != ''*/)
                  return true;
              else
                  return false;
          }
          scopeConfCierre.initEvents();
          Ext.getCmp('winConfCierre').show();
          Ext.getCmp('winConfCierre').doLayout();
      }, initEvents: function() {
          scopeConfCierre.cbxGrupoCta.on({
              'expand': function(store, records, options) {
                  var idcuenta = scopeConfCierre.gpOperaciones.getSelectionModel().selections.items[0].json.idtipocuenta;
                  if(idcuenta == '8031' || idcuenta == '8032' || idcuenta == '8033') {
                      Ext.getCmp('gpGrupoCta').getStore().removeAll();
                      Ext.getCmp('gpGrupoCta').getStore().load({
                          params: {tipoCta: 'grupos'
                          }
                      });
                  } else {
                      Ext.getCmp('gpGrupoCta').getStore().removeAll();
                      Ext.getCmp('gpGrupoCta').getStore().load({
                          params: {tipoCta: 'clasificador'
                          }
                      });
                  }
              }
          });
          Ext.getCmp('gpGrupoCta').getStore().on({
              'expandnode': function(record, ev) {
                  var rowIndex = this.find('idcuenta', record.data.idcuenta);
                  Ext.getCmp('gpGrupoCta').getSelectionModel().selectRow(rowIndex);
                  Ext.getCmp('gpGrupoCta').getView().focusRow(rowIndex + 10);
              }
          });
          Ext.getCmp('gpGrupoCta').getSelectionModel().on({
              rowselect: function(xSelModel, xIndex, xRecords) {
                  var arreglo = new Array();
                  Ext.getCmp('cbxGrupoCta').setValue(Ext.getCmp('gpGrupoCta').getSelectionModel().getSelected().data.text);
                  arreglo.push(Ext.getCmp('gpGrupoCta').getSelectionModel().getSelected().data.id);
                  Ext.getCmp('cbxGrupoCta').fSelect.values = arreglo;
                  Ext.getCmp('cbxGrupoCta').fSelect.display.push(Ext.getCmp('gpGrupoCta').getSelectionModel().getSelected().data.text);
                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().beginEdit();
                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().set('idcuentagrupo', Ext.getCmp('cbxGrupoCta').fSelect.values[0]);
                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().set('text', Ext.getCmp('gpGrupoCta').getSelectionModel().getSelected().data.text);
                  scopeConfCierre.gpOperaciones.getSelectionModel().getSelected().endEdit();
              }
          });
          scopeConfCierre.gpOperaciones.getSelectionModel().on({
              rowselect: function(xSelModel, xIndex, xRecords) {
                  if(xRecords.json.idcomprobante != null) {
                      scopeConfCierre.cbxRowEditorOperaciones.disable();
                      scopeConfCierre.cbxGrupoCta.disable();
                  } else {
                      scopeConfCierre.cbxGrupoCta.enable();
                      if(xRecords.data.idtipocuenta == '8034') {
                          scopeConfCierre.cbxRowEditorOperaciones.disable();
                      } else
                          scopeConfCierre.cbxRowEditorOperaciones.enable();
                  }
              }
          });
      }
  });
  Ext.Cont.Comprobantes = Ext.extend(Ext.Component, {perfil: window.parent.UCID.portal.perfil, etiquetas: new Object(),
      paramsConf: new Array(),
      arrayEstadosFinancierosConf: new Array(),
      constructor: function() {
          Ext.QuickTips.init();
          scopeComprobantes = this;
          scopeComprobantes.etiquetas = Contabilidad.Cierre.idioma;
          scopeComprobantes.initApp();
      },
      loadMask: function(agMsg) {
          scopeComprobantes.lMask = new Ext.LoadMask(Ext.getBody(), {msg: agMsg || scopeComprobantes.etiquetas.lbCargando});
          scopeComprobantes.lMask.show();
      },
      fShowComprobante: function(respData, tipoContabilizacion, parametros) {
          var descripcion = 'CANCELANDO ';
          descripcion = descripcion + respData.observacion;
          var cmpGen = Ext.Cont.Comprobante.init(respData.idsubsistema, respData.detalle, descripcion, respData.fechaCont, respData.dataComprobante, respData.idtipocomprobante, tipoContabilizacion, 1).onSaved(function(idComprobante, numComprobante, fechaComprobante) {
              if(idComprobante) {
                  scopeComprobantes.loadMask(scopeComprobantes.etiquetas.lbGuardandoCmp);
                  var idconfcierre = scopeComprobantes.gpComprobantes.getSelectionModel().getSelected().data.idconfcierre;
                  Ext.Ajax.request({
                      method: "POST",
                      url: "guardarnumcomp",
                      params: {
                          idconfcierre: idconfcierre,
                          idComprobante: idComprobante
                      },
                      callback: function(options, success, response) {
                          var result = Ext.decode(response.responseText);
                          scopeComprobantes.lMask.hide();
                          switch(result) {
                              case -1:
                                  {
                                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgSaveCmpOk);
                                      scopeComprobantes.stComprobante.reload();
                                  }
                                  break;
                              case -2:
                                  {
                                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgSaveCmpError);
                                  }
                                  break;
                          }
                      }
                  });
              }
          });
      },
      initApp: function() {
          scopeComprobantes.rowaction = new Ext.grid.RowActions({
              id: 'idRowaction',
              actions: [{
                      id: 'idgenerar',
                      tooltip: scopeComprobantes.etiquetas.lbTtlGenerarCpm,
                      icon: perfil.dirImg + 'asentar.png',
                      marginLeft: 5,
                      width: 16,
                      height: 16
                  }, {
                      id: 'idver',
                      tooltip: scopeComprobantes.etiquetas.lbTtlVerCpm,
                      icon: perfil.dirImg + 'ver.png',
                      marginLeft: 5,
                      width: 16,
                      height: 16
                  }
              ]
          });

          scopeComprobantes.stComprobante = new Ext.data.Store({
              url: 'cargarcomprobantesgenerar',
              autoLoad: true,
              baseParams: {start: 0,
                  limit: 20
              },
              reader: new Ext.data.JsonReader({
                  totalProperty: 'cant',
                  root: 'datos',
                  id: 'idconfcierre'
              }, [{
                      name: 'idconfcierre'
                  },
                  {
                      name: 'idtipocuenta'
                  },
                  {
                      name: 'descripcion'
                  },
                  {
                      name: 'idcuentagrupo'
                  },
                  {
                      name: 'descripcioncuentagrupo'
                  },
                  {
                      name: 'idoperacion'
                  },
                  {
                      name: 'descripcionoperacion'
                  },
                  {
                      name: 'idcomprobante'
                  },
                  {
                      name: 'numerocomprobante'
                  },
                  {
                      name: 'idestadocomprobante'
                  },
                  {
                      name: 'descripcionestado'
                  }
              ])
          });
          scopeComprobantes.gpComprobantes = new Ext.grid.GridPanel({
              id: 'idgpComprobantes',
              loadMask: true,
              frame: true,
              autoExpandColumn: 'descripcioncuentagrupo',
              store: scopeComprobantes.stComprobante,
              enableColumnHide: true,
              viewConfig: {forceFit: true
              },
              columns: [new Ext.grid.RowNumberer({
                      header: scopeComprobantes.etiquetas.lbNo
                  }),
                  {
                      hidden: true,
                      dataIndex: 'idcuenta',
                      hideable: false
                  },
                  {
                      header: scopeComprobantes.etiquetas.lbTipCuenta,
                      width: 90,
                      dataIndex: 'descripcion',
                      sortable: true
                  },
                  {
                      hidden: true,
                      dataIndex: 'idcuentagrupo',
                      hideable: false
                  },
                  {
                      header: scopeComprobantes.etiquetas.lbCuentaGrupo,
                      width: 200,
                      dataIndex: 'descripcioncuentagrupo',
                      sortable: true
                  },
                  {
                      hidden: true,
                      dataIndex: 'idoperacion',
                      sortable: true
                  },
                  {
                      header: scopeComprobantes.etiquetas.lbOperacion,
                      width: 180,
                      dataIndex: 'descripcionoperacion',
                      sortable: true
                  },
                  {
                      hidden: true,
                      dataIndex: 'idcomprobante',
                      sortable: true
                  },
                  {
                      header: scopeComprobantes.etiquetas.lbNoCmp,
                      width: 80,
                      fixed: true,
                      align: 'right',
                      renderer: scopeComprobantes.showImage
                  },
                  {
                      hidden: true,
                      dataIndex: 'idestadocomprobante',
                      sortable: true
                  },
                  {
                      header: scopeComprobantes.etiquetas.lbEstado,
                      width: 60,
                      renderer: scopeComprobantes.showEstado
                  },
                  scopeComprobantes.rowaction
              ],
              plugins: [scopeComprobantes.rowaction]
          });
          new Ext.Window({
              title: scopeComprobantes.etiquetas.lbTtlComprobantes,
              resizable: false,
              closeAction: 'close',
              modal: true,
              layout: 'fit',
              id: 'winComprobantes',
              width: 900,
              height: 400,
              items: scopeComprobantes.gpComprobantes,
              constrain: true,
              defaultButton: 0,
              buttons: [{
                      id: 'btnCancelarComp',
                      iconCls: 'cancelar',
                      text: scopeComprobantes.etiquetas.lbCancelar,
                      tooltip: scopeComprobantes.etiquetas.lbTtCancelar,
                      handler: function() {
                          Ext.getCmp('winComprobantes').close();
                          Ext.getCmp('btnMenu').focus();
                      }
                  }]
          });
          scopeComprobantes.initEvents();
          return Ext.getCmp('winComprobantes').show();
      },
      showImage: function(value, metaData, record, rowIndex, colIndex, store) {
          if(record.data.idcomprobante == null) {
              return scopeComprobantes.etiquetas.lbSinGenerar;
          } else {
              return record.data.numerocomprobante;
          }
      },
      showEstado: function(value, metaData, record, rowIndex, colIndex, store) {
          if(record.data.idestadocomprobante == null) {
              return scopeComprobantes.etiquetas.lbSinGenerar;
          } else {
              return record.data.descripcionestado;
          }
      },
      initEvents: function() {
          scopeComprobantes.rowaction.on('action', function(grid, record, action, rowIndex, col, e) {
              if(action == 'idgenerar') {
                  switch(record.data.idtipocuenta) {
                      case '8031':
                          {
                              scopeComprobantes.generarCmp(record.data);
                          }
                          break;
                      case '8032':
                          {
                              scopeComprobantes.generarCmp(record.data);
                          }
                          break;
                      case '8033':
                          {
                              if(record.data.idcuentagrupo != null && record.data.idoperacion != null) {
                                  scopeComprobantes.generarCmp(record.data);
                              } else {
                                  mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoSaveConfiguracion);
                              }
                          }
                          break;
                      case '8035':
                          {
                              if(grid.store.data.items[0].data.idestadocomprobante != null && grid.store.data.items[1].data.idestadocomprobante != null) {
                                  if(grid.store.data.items[0].data.idestadocomprobante == '8032' && grid.store.data.items[1].data.idestadocomprobante == '8032') {
                                      scopeComprobantes.comprobarsaldoResultado(record.data);
                                  } else {
                                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoAsenCmpCtasNom);
                                  }
                              } else {
                                  mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                              }
                          }
                          break;
                      case '8036':
                          {
                              if(grid.store.data.items[0].data.idestadocomprobante != null && grid.store.data.items[1].data.idestadocomprobante != null) {
                                  if(grid.store.data.items[0].data.idestadocomprobante == '8032' && grid.store.data.items[1].data.idestadocomprobante == '8032') {
                                      scopeComprobantes.comprobarsaldoResultado(record.data);
                                  } else {
                                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoAsenCmpCtasNom);
                                  }
                              } else {
                                  mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                              }
                          }
                          break;
                  }
              } else if(action == 'idver') {
                  if(record.data.idcomprobante != null) {
                      Ext.Cont.Comprobante.Tool.init(record.data.idcomprobante);
                  } else {
                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenerado);
                  }
              }
          }, this);

      },
      generarCmp: function(data) {
          var me = this;
          if(data.numerocomprobante == null) {
              Ext.Msg.wait(me.etiquetas.lbCargando, me.etiquetas.lbEsperando);
              Ext.Ajax.request({
                  method: "POST",
                  url: "generarComprobante",
                  params: {data: Ext.encode(data)},
                  callback: function(options, success, response) {
                      var result = Ext.decode(response.responseText);
                      if(result.datos)
                          me.fShowComprobante(result.datos, 1);
                      else
                          Ext.Msg.hide();
                  }
              });
          } else {
              mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgYaGenerado);
          }
      },
      comprobarsaldoResultado: function(data) {
          Ext.Ajax.request({
              method: "POST",
              url: "comprobarsaldoResultado",
              callback: function(options, success, response) {
                  var result = Ext.decode(response.responseText);
                  if(data.idtipocuenta == '8035') {
                      if(result == '-1') {
                          scopeComprobantes.generarCmp(data);
                      } else if(result == '-2') {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgGenCmpCtaResPsitivo);
                      } else if(result == '-3') {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                      }
                  } else if(data.idtipocuenta == '8036') {
                      if(result == '-1') {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgGenCmpCtaResNegativo);
                      } else if(result == '-2') {
                          scopeComprobantes.generarCmp(data);
                      } else if(result == '-3') {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                      }
                  }
              }
          });
      }
  });
  Ext.Cont.Estadosf = Ext.extend(Ext.Component, {perfil: window.parent.UCID.portal.perfil, etiquetas: new Object(),
      paramsConf: new Array(),
      arrayEstadosFinancierosConf: new Array(),
      constructor: function() {
          Ext.QuickTips.init();
          scopeEstadosf = this;
          scopeEstadosf.etiquetas = Contabilidad.Cierre.idioma;
          scopeEstadosf.initApp();
      },
      loadMask: function(agMsg) {
          scopeEstadosf.lMask = new Ext.LoadMask(Ext.getBody(), {msg: agMsg || scopeEstadosf.etiquetas.lbCargando});
          scopeEstadosf.lMask.show();
      },
      initApp: function() {
          scopeEstadosf.rowaction = new Ext.grid.RowActions({
              id: 'idRowaction',
              actions: [{
                      id: 'aprobarEstadof',
                      tooltip: scopeEstadosf.etiquetas.lbTtlAprobar,
                      icon: perfil.dirImg + 'aprobar.png',
                      marginLeft: 5,
                      width: 16,
                      height: 16
                  }/*, {
                   id: 'vistarptef',
                   tooltip: scopeEstadosf.etiquetas.lbTtlVerEF,
                   icon: perfil.dirImg + 'ver.png',
                   marginLeft: 5,
                   width: 16,
                   height: 16
                   }*/
              ]
          });

          scopeEstadosf.stEstadosf = new Ext.data.Store({
              url: 'cargarEstadosFinancieros',
              autoLoad: true,
              baseParams: {start: 0,
                  limit: 20
              },
              reader: new Ext.data.JsonReader({
                  totalProperty: 'cant',
                  root: 'datoss',
                  id: 'idconfcierre'
              }, [{
                      name: 'idconceptocontable'
                  },
                  {
                      name: 'idestadofinancieroconf'
                  },
                  {
                      name: 'descripcion'
                  },
                  {
                      name: 'estado'
                  }
              ])
          });

          scopeEstadosf.gpEstadosf = new Ext.grid.GridPanel({
              id: 'idgpEstadosf',
              frame: true,
              autoExpandColumn: 'descripcion',
              loadMask: true,
              store: scopeEstadosf.stEstadosf,
              viewConfig: {forceFit: true
              },
              columns: [new Ext.grid.RowNumberer({
                      header: scopeEstadosf.etiquetas.lbNo
                  }),
                  {
                      hidden: true,
                      dataIndex: 'idconceptocontable',
                      hideable: false
                  },
                  {
                      header: scopeEstadosf.etiquetas.lbEstadof,
                      width: 200,
                      dataIndex: 'descripcion',
                      sortable: true
                  },
                  {
                      header: scopeEstadosf.etiquetas.lbEstado,
                      width: 100,
                      renderer: scopeEstadosf.showImage
                  },
                  scopeEstadosf.rowaction
              ],
              plugins: [scopeEstadosf.rowaction]
          });
          new Ext.Window({
              title: scopeEstadosf.etiquetas.ttEstadof,
              resizable: false,
              closeAction: 'close',
              modal: true,
              layout: 'fit',
              id: 'winEstadosf',
              width: 900,
              height: 400,
              items: scopeEstadosf.gpEstadosf,
              constrain: true,
              defaultButton: 0,
              buttons: [{
                      id: 'btnCancelarEF',
                      iconCls: 'cancelar',
                      text: scopeEstadosf.etiquetas.lbCancelar,
                      tooltip: scopeEstadosf.etiquetas.lbTtCancelar,
                      handler: function() {
                          Ext.getCmp('winEstadosf').close();
                          Ext.getCmp('btnMenu').focus();
                      }
                  }]
          });
          scopeEstadosf.initEvents();
          return Ext.getCmp('winEstadosf').show();
      },
      showImage: function(value, metaData, record, rowIndex, colIndex, store) {
          if(record.data.estado == 1) {
              return scopeEstadosf.etiquetas.lbSinAprobar;
          } else if(record.data.estado == 2) {
              return scopeEstadosf.etiquetas.lbAprobado;
          }
      },
      initEvents: function() {
          scopeEstadosf.rowaction.on('action', function(grid, record, action, rowIndex, col, e) {
              if(action == 'vistarptef') {
                  scopeEstadosf.loadMask();
                  Ext.Ajax.request({
                      method: "POST",
                      url: "vistaReporteEstadoFinanciero",
                      params: {
                          idconceptocontable: record.data.idconceptocontable,
                          idestadofinancieroconf: record.data.idestadofinancieroconf
                      },
                      callback: function(options, success, response) {
                          var responseDataReporte = Ext.decode(response.responseText);
                          scopeEstadosf.lMask.hide();
                          scopeEstadosf.printViewEF = new SCFPrintView(responseDataReporte.datos, "/contabilidad/comun/SCFPrintView/", {
                              paperSize: "A4",
                              orientation: "Horizontal",
                              reportType: "HTML"
                          });
                          scopeEstadosf.printViewEF.show();
                      }
                  });
              } else {
                  if(record.data.estado == 1) {
                      scopeEstadosf.loadMask();
                      Ext.Ajax.request({
                          method: "POST",
                          url: "evaluarAnalisis",
                          params: {id: Ext.encode(record.data.idestadofinancieroconf)
                          },
                          callback: function(options, success, response) {
                              var result = Ext.decode(response.responseText);
                              scopeEstadosf.lMask.hide();
                              switch(result) {
                                  case -1:
                                      {
                                          mostrarMensaje(1, scopeEstadosf.etiquetas.lbMsgAprobOk);
                                          scopeEstadosf.stEstadosf.reload();
                                      }
                                      break;
                                  case -2:
                                      {
                                          mostrarMensaje(1, scopeEstadosf.etiquetas.lbMsgErrorSist);
                                      }
                                      break;
                              }
                          }
                      });
                  } else {
                      mostrarMensaje(1, scopeEstadosf.etiquetas.lbMsgYaAprob);
                  }
              }
          }, this);

      }
  });
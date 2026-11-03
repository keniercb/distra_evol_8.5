
  if(!Ext.Cont)
      Ext.namespace('Ext.Cont');
  Ext.Cont.ConfCierre = Ext.extend(Ext.Component, {
      perfil: window.parent.UCID.portal.perfil, etiquetas: new Object(),
      paramsConf: new Array(),
      arrCtaa: new Array(),
      arrayEstadosFinancierosConf: new Array(),
      // subCuentasData: '',
      constructor: function() {
          Ext.QuickTips.init();
          scopeConfCierre = this;
          // arrCta = [];
          scopeConfCierre.etiquetas = Contabilidad.Cierre.idioma;
          Ext.Msg.wait(scopeConfCierre.etiquetas.lbCargando, scopeConfCierre.etiquetas.lbEsperando);
          // if (!this.subCuentasData) {
          //     Ext.Ajax.request({
          //         scope: this,
          //         method: "POST",
          //         params: undefined,
          //         url: "obtenerSubCuentas",
          //         callback: function (options, success, response) {
          //             this.subCuentasData = response.responseText;
          //             scopeConfCierre.initApp();
          //         }
          //     });
          // }
          this.initTabPanelCtaProceso();
          // scopeConfCierre.initApp();

      },
      loadMask: function(agMsg) {
          scopeConfCierre.lMask = new Ext.LoadMask(Ext.getBody(), {msg: agMsg || scopeConfCierre.etiquetas.lbCargando});
          scopeConfCierre.lMask.show();
      },
      gpCuentasProcesoFactory: function (idConf, conf) {
          if (!idConf) {
              return undefined;
          }

          var recordCtasProceso = Ext.data.Record.create([
              {name: 'idfila', sortDir: "ASC", type: 'int'},
              {name: 'cuentadestino'},
              {name: 'cuentaorigen'},
              {name: 'idcuentadestino'},
              {name: 'idcuentaorigen'}
          ]);

          var stCtasProceso = new Ext.data.Store({
              url: 'obtenerconfiguracionCtasProceso',
              autoLoad: true,
              // baseParams: {
              //     idConf: idConf
              // },
              reader: new Ext.data.JsonReader(
                  {},
                  recordCtasProceso
              ),
              listeners: {
                  'load': function (store, arrRecord, index) {
                      // Ext.each(arrRecord, function (item) {
                      //     store.arrCtaa[parseInt(item.data.idfila)] = {
                      //         'arrOrigen': Ext.decode(item.data.idcuentaorigen),
                      //         'arrDestino': item.data.idcuentadestino
                      //     };
                      // });
                  }
              }
          });

          stCtasProceso.baseParams = {
              idConf: idConf
          };

          // stCtasProceso.arrCtaa = [];


          var rowaction = new Ext.grid.RowActions({
              // id: 'idRowaction',
              actions: [
                  {
                      id: 'eliminar',
                      // tooltip: this.idioma.lbtpEliminar,
                      iconCls: 'eliminar',
                      marginLeft: 5,
                      width: 20,
                      height: 16
                  }
              ]
          });

          rowaction.on({
              'action': function (grid, record, action, rowIndex, col, e) {
                  // rowEditorCtasProceso.stopEditing();
                  grid.plugins[0].stopEditing();
                  Ext.Msg.show({
                      title: 'Eliminar',
                      buttons: Ext.MessageBox.OKCANCEL,
                      msg: 'Esta seguro que desea eliminar esta fila?',
                      fn: function (btn) {
                          if (btn === 'ok') {
                              var seleccionado = grid.getSelectionModel().getSelected();
                              grid.getStore().remove(seleccionado);

                              // grid.getStore().arrCtaa[parseInt(seleccionado.data.idfila)] = {
                              //     'arrOrigen': [],
                              //     'arrDestino': []
                              // };
                          }
                      }
                  });
              }
          });

          var cmCtasProceso = new Ext.grid.ColumnModel({
              columns: [
                  {
                      header: 'Cuentas a traspasar',
                      tooltip: 'Cuentas a traspasar hacia una cuenta destino',
                      dataIndex: 'cuentaorigen',
                      id: 'cuentaorigen' + idConf,
                      width: 450,
                      sortable: true,
                      editor: new Ext.CONT.UIXCombo({
                          emptyText: 'Seleccione',
                          invalidText: "Este campo es obligatorio.",
                          allowBlank: true,
                          loaded: false,
                          fieldLabel: 'Cuenta origen',
                          tabIndex: 8
                      }, {
                          // identificador: 'Origen',
                          identificador: 'cuentaorigen' + idConf,
                          displayText: 'text',
                          url: 'obtenerSubCuentas',
                          baseParams: {
                              idConf: idConf
                          },
                          height: 400,
                          autoLoad: false,
                          singleSelect: false,
                          reader: new Ext.data.JsonReader(
                              {id: 'idcuenta'},
                              [{
                                  name: '_parent'
                              }, {
                                  name: '_is_leaf'
                              }, {
                                  name: 'text'
                              }, {
                                  name: 'idcuenta'
                              }, {
                                  name: 'codigo',
                                  mapping: 'concatcta'
                              }, {
                                  name: 'descripcion'
                              }, {
                                  name: 'clavecuenta'
                              }])
                      }),
                  }, {
                      header:'Cuenta destino',
                      tooltip: 'Cuenta a la que se traspasa el saldo de las cuentas seleccionadas',
                      dataIndex: 'cuentadestino',
                      width: 250,
                      sortable: true,
                      editor: new Ext.form.ComboBox({
                          id: 'cbxDestino' + idConf,
                          disabledClass: 'disabled-component',
                          selectOnFocus: true,
                          //fieldLabel: etiquetas.lbPersona,
                          resizable: true,
                          pageSize: 10,
                          minChars: 3,
                          mode: 'remote',
                          listWidth: 350,
                          emptyText: 'Seleccione...',
                          editable: true,
                          // disabled: true,
                          store: new Ext.data.Store({
                              id: 'stcbxDestino' + idConf,
                              url: 'obtenerCuentas',
                              baseParams: {
                                  idConf: idConf
                              },
                              reader: new Ext.data.JsonReader({
                                  totalProperty: 'cant',
                                  root: 'datos'
                              }, [{name: 'idcuenta'}, {
                                  name: 'concatcta'
                              }])
                          }),
                          valueField: 'concatcta',
                          displayField: 'concatcta',
                          hiddenName: 'idcuenta',
                          forceSelection: true,
                          anchor: '100%',
                          enableKeyEvents: true,
                          triggerAction: 'all',
                          //typeAhead: true,
                          allowBlank: true,
                          readOnly: false
                      }),
                  },
                  rowaction,
                  {
                      dataIndex: 'idfila',
                      hidden: true,
                      hideable: false
                  },
              ]
          });

          Ext.getCmp('gpcuentaorigen' + idConf).getSelectionModel().on({
              beforerowselect: function (selectionModel, rowIndex, keepExisting, record) {
                  var gpStore = gpCtasProceso.getStore();
                  var records = gpStore.getRange();
                  var arrOrigen = [];
                  var destino = '';
                  for (var i = 0; i < records.length; i++) {
                      arrOrigen = Ext.decode(records[i].get('idcuentaorigen'));
                      destino = records[i].get('idcuentadestino');
                      if((gpCtasProceso.getSelectionModel().getSelected() ? (gpStore.indexOf(gpCtasProceso.getSelectionModel().getSelected()) != i) : true)) {
                          if (arrOrigen.includes(record.data.idcuenta)) {
                              return false;
                          }
                      }
                      if (destino == record.data.idcuenta) {
                          return false;
                      }
                  }

              }
          });

          Ext.getCmp('gpcuentaorigen' + idConf).getView().getRowClass = function (record, index, rowParams, store) {
              var gpStore = gpCtasProceso.getStore();
              var records = gpStore.getRange();
              var arrOrigen = [];
              var destino = '';
              for (var i = 0; i < records.length; i++) {
                  arrOrigen = Ext.decode(records[i].get('idcuentaorigen')) ? Ext.decode(records[i].get('idcuentaorigen')) : [];
                  destino = records[i].get('idcuentadestino');

                  if (arrOrigen.includes(record.data.idcuenta) && (gpCtasProceso.getSelectionModel().getSelected() ? (gpStore.indexOf(gpCtasProceso.getSelectionModel().getSelected()) != i) : true)) {
                      rowParams.tstyle += "background-color: #FF0266;";
                      break;
                  } else if (destino == record.data.idcuenta) {
                      rowParams.tstyle += "background-color: #41C300;";
                      break;
                  }
                  else {
                      var style = rowParams.tstyle.split(';');
                      if (style[0]) {
                          rowParams.tstyle = style[0] + ';';
                      }
                  }
              }
          };

          Ext.getCmp('cbxcuentaorigen' + idConf).on({
              expand: function () {
                  if (!this.yaSeExpandio) {
                      Ext.getCmp('gpcuentaorigen' + idConf).getStore().load({
                          callback: function () {
                              Ext.getCmp('gpcuentaorigen' + idConf).getSelectionModel().clearSelections();
                              Ext.getCmp('gpcuentaorigen' + idConf).getView().refresh();
                          }
                      });
                      this.yaSeExpandio = true;
                  } else {
                      Ext.getCmp('gpcuentaorigen' + idConf).getSelectionModel().clearSelections();
                      Ext.getCmp('gpcuentaorigen' + idConf).getView().refresh();
                  }
              }
          });

          // if (this.subCuentasData) {
          //     Ext.getCmp('gpcuentaorigen' + id).getStore().loadData(this.subCuentasData);
          // }

          var rowEditorCtasProceso = new Ext.Cont.RowEditor({
              id: 'rowEditorCtasProceso' + idConf,
              clicksToEdit: 2,
              iconCls: 'btn',
              cancelText: scopeConfCierre.etiquetas.lbCancelar,
              saveText: scopeConfCierre.etiquetas.lbAceptar,
              iconClsSave: 'aceptar',
              iconClsCancel: 'cancelar',
          });

          rowEditorCtasProceso.on({
              scope: this,
              oninitsetvalue: function (roweditor, field, record) {
                  if (field.id == 'cbxcuentaorigen'+ idConf) {
                      var temp = Ext.decode(record.data.idcuentaorigen);
                      if (temp){
                          Ext.getCmp('cbxcuentaorigen'+ idConf).fSelect.values = temp
                      }
                  } else if (field.id == 'cbxDestino' + idConf) {
                      var temp = Ext.decode(record.data.idcuentadestino);
                      if (temp){
                          Ext.getCmp('cbxDestino' + idConf).setValue(temp);
                      }
                  }
              },
              afteredit: function (editor, grid, changes, record, rowIndex) {
                  if (Ext.getCmp('cbxDestino' + idConf).selectedIndex !== -1) {
                      var idcuentadestino = Ext.getCmp('cbxDestino' + idConf).store.getAt(Ext.getCmp('cbxDestino' + idConf).selectedIndex).data.idcuenta;
                  } else {
                      var idcuentadestino = record.data.idcuentadestino;
                  }
                  record.data.idcuentaorigen = Ext.encode(Ext.getCmp('cbxcuentaorigen'+ idConf).fSelect.values);
                  record.data.idcuentadestino = idcuentadestino;
                  record.data.cuentadestino = Ext.getCmp('cbxDestino' + idConf).getRawValue();
                  // grid.getStore().arrCtaa[parseInt(record.data.idfila)] = {
                  //     'arrOrigen': Ext.getCmp('cbxcuentaorigen'+ id).fSelect.values.splice(0),
                  //     'arrDestino': cbDestinoRecord
                  // };
              },
              beforeedit: function (roweditor, grid, record, rowIndex) {

              },
              validateedit: function (roweditor, grid, changes, record, rowIndex) {
                  var origen = Ext.getCmp('cbxcuentaorigen'+ idConf).fSelect.values;
                  // var destino = Ext.getCmp('cbxDestino' + id).getValue();
                  if (Ext.getCmp('cbxDestino' + idConf).selectedIndex !== -1) {
                      var destino = Ext.getCmp('cbxDestino' + idConf).store.getAt(Ext.getCmp('cbxDestino' + idConf).selectedIndex).data.idcuenta;
                  } else {
                      var destino = record.data.idcuentadestino;
                  }

                  if (!(origen.includes(destino))){
                      return true
                  } else {
                      return false
                  }
              }
          });

          var tbar = [
              new Ext.Button({
                  iconCls: 'adicionar',
                  text: 'Adicionar',
                  handler: function (button, event) {
                      var count = stCtasProceso.getCount();
                      stCtasProceso.add(
                          new recordCtasProceso({
                              // idfila: stCtasProceso.getAt(count-1) ? new Number(stCtasProceso.getAt(count-1).data.idfila)+1 : 1,
                              idcuentadestino: undefined,
                              idcuentaorigen: undefined,
                              cuentaorigen: undefined,
                              cuentadestino: undefined
                          })
                      );
                      gpCtasProceso.getSelectionModel().selectRow(count);
                      rowEditorCtasProceso.startEditing(count);
                  }
              })
          ];

          if (conf) {
              if (conf.rellenoauto) {
                  tbar.push(
                      new Ext.Button({
                          iconCls: conf.rellenoauto.btn.icono,
                          text: conf.rellenoauto.btn.nombre,
                          handler: function (button, event) {
                              Ext.Msg.wait('Generado configuracion...', 'Por favor espere...');
                              Ext.Ajax.request({
                                  method: "POST",
                                  params: {
                                      idconf: idConf
                                  },
                                  url: conf.rellenoauto.metodo,
                                  callback: function (options, success, response) {
                                      var res = Ext.decode(response.responseText);
                                      if (success && !res.codMsg) {
                                          stCtasProceso.load();
                                          Ext.MessageBox.hide();
                                      }
                                  }
                              });
                          }
                      })
                  );
              }
          }

          var gpCtasProceso = new Ext.grid.GridPanel({
              id: 'gpCtasProceso ' + idConf,
              title: 'Cuentas a traspasar',
              // height: 250,
              // region: 'center',
              loadMask: true,
              autoExpandColumn: 'cuentaorigen' + idConf,
              plugins: [rowEditorCtasProceso, rowaction],
              // width: 220,
              store: stCtasProceso,
              cm: cmCtasProceso,
              tbar: tbar,
          });



          return gpCtasProceso;
      },
      initTabPanelCtaProceso: function () {
          Ext.Ajax.request({
              method: "POST",
              params: undefined,
              url: "confCtasProceso",
              callback: function (options, success, response) {
                  var confCtasProceso = Ext.decode(response.responseText);
                  var arrTabs = [];
                  if (success && !confCtasProceso.codMsg) {
                      confCtasProceso.forEach(function (element, arr, index) {
                          arrTabs.push({
                              id: element.idconf,
                              title: element.title,
                              layout: 'fit',
                              items: scopeConfCierre.gpCuentasProcesoFactory(element.idconf, Ext.decode(element.conf))
                          });
                      });
                      if (arrTabs.length != 0) {
                          scopeConfCierre.gpCtasProceso = new Ext.TabPanel({
                              activeTab: 0,
                              region: 'center',
                              height: 250,
                              defaults: {
                                  autoScroll: true
                              },
                              border: false,
                              items: arrTabs
                          });
                          scopeConfCierre.initApp();
                      } else {
                          Ext.Msg.hide();
                          mostrarMensaje(1, 'Configure las cuentas proceso');//algun mensaje, despues veo
                      }
                  }
              }
          });

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
                      if(rec.length == 0) {
                          var ctas = {cant: '6', datos: [
                                  {descripcion: 'Nominales Acreedoras (INGRESO)', idconfcierre: '', idtipocuenta: '8031', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                                  {descripcion: 'Nominales Deudoras (GASTOS)', idconfcierre: '', idtipocuenta: '8032', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                                  {descripcion: 'Resultado (ORDEN)', idconfcierre: '', idtipocuenta: '8034', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                                  {descripcion: 'Utilidades Retenidas', idconfcierre: '', idtipocuenta: '8035', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                                  {descripcion: 'Pérdida', idconfcierre: '', idtipocuenta: '8036', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''},
                                  {descripcion: 'Cuentas traspaso saldo inicio de año (TRASPASO)', idconfcierre: '', idtipocuenta: '9000', idcuentagrupo: '', descripcioncuentagrupo: '', idoperacion: '', descripcionoperacion: ''}
                              ]};
                          st.loadData(ctas);
                      }
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
                      width: 250,
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
                          isTree: true,
                          reader: scopeConfCierre.jrCtaNomAcreedora = new Ext.data.JsonReader({id: 'id', root: 'datos'
                          }, [{
                              name: '_parent'
                          }, {
                              name: '_is_leaf', mapping: 'leaf'
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
                          }, {
                              name: 'ordenizq'
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
              iconClsSave: 'aceptar',
              iconClsCancel: 'cancelar'
          });
          scopeConfCierre.gpOperaciones = new Ext.grid.GridPanel({
              id: 'gpOperacionesc',
              height: 170,
              region: 'north',
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
              width: 650,
              height: 600,
              // autoHeight: true,
              constrain: true,
              defaultButton: 0,
              items: [new Ext.FormPanel({
                  id: 'confCierre',
                  layout: 'border',
                  labelAlign: 'top',
                  frame: false,
                  border: false,
                  items: [scopeConfCierre.gpOperaciones, scopeConfCierre.gpCtasProceso]
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

                              // var dataCtasProceso = scopeConfCierre.gpCtasProceso.getStore().getRange();
                              // var arrayCtasProceso = [];
                              // for(var i = 0; i < dataCtasProceso.length; i++) {
                              //     arrayCtasProceso.push({
                              //         idfila: dataCtasProceso[i].data.idfila,
                              //         idcuentaorigen: dataCtasProceso[i].data.idcuentaorigen,
                              //         idcuentadestino: dataCtasProceso[i].data.idcuentadestino
                              //     });
                              // }
                              var arrayCtasProceso = [];

                              scopeConfCierre.gpCtasProceso.items.items.forEach(function (element, arr, index) {
                                  var dataCtasProceso = element.items.items[0].getStore().getRange();
                                  var arrayCtasProcesoTab = [];
                                  for(var i = 0; i < dataCtasProceso.length; i++) {
                                      arrayCtasProcesoTab.push({
                                          idfila: dataCtasProceso[i].data.idfila,
                                          idcuentaorigen: dataCtasProceso[i].data.idcuentaorigen,
                                          idcuentadestino: dataCtasProceso[i].data.idcuentadestino
                                      });
                                  }

                                  if (arrayCtasProcesoTab.length != 0) {
                                      arrayCtasProceso.push({
                                          idConf: element.id,
                                          data: arrayCtasProcesoTab
                                      });
                                  }
                              });



                              //queda agrgar el cargar del panel derecho
                              if(validar(arrayDatos) == true) {
                                  Ext.Msg.wait(scopeConfCierre.etiquetas.lbGuardandoConf, scopeConfCierre.etiquetas.lbEsperando);
                                  Ext.Ajax.request({
                                      method: "POST",
                                      url: "registrarconfiguracioncierre",
                                      params: {datos: Ext.encode(arrayDatos), proceso: Ext.encode(arrayCtasProceso) },
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
                                                      mostrarMensaje(1, 'Ya existe la configuraci&oacute;n para este ejercicio.');
                                                  }
                                                  break;
                                          }
                                      }
                                  });
                              } else
                                  mostrarMensaje(1, 'Debe configurar los datos de las cuentas.');
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
          Ext.getCmp('winConfCierre').maximize();
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
                      if(xRecords.data.idtipocuenta == '9000') {
                          scopeConfCierre.cbxGrupoCta.disable();
                      }
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
          var descripcion = respData.observacion;
          Ext.Cont.Comprobante.init(respData.idsubsistema, respData.detalle, descripcion, respData.fechaCont, respData.dataComprobante, respData.idtipocomprobante, tipoContabilizacion, 1).onSaved(function(idComprobante, numComprobante, fechaComprobante) {
              if(idComprobante) {
                  scopeComprobantes.loadMask(scopeComprobantes.etiquetas.lbGuardandoCmp);
                  var idconfcierreejercicio = scopeComprobantes.gpComprobantes.getSelectionModel().getSelected().data.idconfcierre;
                  var idconfctasproceso = scopeComprobantes.gpComprobantes.getSelectionModel().getSelected().data.idconfctasproceso;
                  Ext.Ajax.request({
                      method: "POST",
                      url: "guardarnumcomp",
                      params: {
                          idconfcierreejercicio: idconfctasproceso ? '' : idconfcierreejercicio,
                          idconfctasproceso: idconfctasproceso,
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
                  iconCls: 'icondistra-asentar',
                  marginLeft: 5,
                  width: 16,
                  height: 16
              }, {
                  id: 'idver',
                  tooltip: scopeComprobantes.etiquetas.lbTtlVerCpm,
                  iconCls: 'icondistra-ver',
                  marginLeft: 5,
                  width: 16,
                  height: 16
              }, {
                  id: 'idcancelar',
                  tooltip: 'Cancelar comprobante',
                  iconCls: 'icondistra-cancelar',
                  marginLeft: 5,
                  width: 16,
                  height: 16
              }]
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
                  // id: 'idconfcierre'
              }, [{
                      name: 'idconfcierre'
                  }, {
                      name: 'idtipocuenta'
                  }, {
                      name: 'descripcion'
                  }, {
                      name: 'idcuentagrupo'
                  }, {
                      name: 'descripcioncuentagrupo'
                  }, {
                      name: 'idoperacion'
                  }, {
                      name: 'descripcionoperacion'
                  }, {
                      name: 'idcomprobante'
                  }, {
                      name: 'numerocomprobante'
                  }, {
                      name: 'idestadocomprobante'
                  }, {
                      name: 'descripcionestado'
                  }, {
                      name: 'idconfctasproceso'
                  }, {
                      name: 'tienesaldo'
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
              columns: [
                  new Ext.grid.RowNumberer({
                      header: scopeComprobantes.etiquetas.lbNo
                  }), {
                      hidden: true,
                      dataIndex: 'idcuenta',
                      hideable: false
                  }, {
                      header: scopeComprobantes.etiquetas.lbTipCuenta,
                      width: 90,
                      dataIndex: 'descripcion',
                      sortable: true
                  }, {
                      hidden: true,
                      dataIndex: 'idcuentagrupo',
                      hideable: false
                  }, {
                      header: scopeComprobantes.etiquetas.lbCuentaGrupo,
                      width: 200,
                      dataIndex: 'descripcioncuentagrupo',
                      sortable: true
                  }, {
                      hidden: true,
                      dataIndex: 'idoperacion',
                      sortable: true
                  }, {
                      header: scopeComprobantes.etiquetas.lbOperacion,
                      width: 180,
                      dataIndex: 'descripcionoperacion',
                      sortable: true
                  }, {
                      hidden: true,
                      dataIndex: 'idcomprobante',
                      sortable: true
                  }, {
                      header: scopeComprobantes.etiquetas.lbNoCmp,
                      width: 80,
                      fixed: true,
                      align: 'right',
                      renderer: scopeComprobantes.showImage
                  }, {
                      hidden: true,
                      dataIndex: 'idestadocomprobante',
                      sortable: true
                  }, {
                      header: scopeComprobantes.etiquetas.lbEstado,
                      width: 60,
                      renderer: scopeComprobantes.showEstado
                  },
                  scopeComprobantes.rowaction
              ],
              // tbar: scopeConfCierre.tbConf = new Ext.Toolbar({
              //     hidden: false,
              //     items: [{
              //         id: 'btnGenerarCmp',
              //         iconCls: 'comprobante',
              //         text: 'Generar comprobante',
              //         tooltip: 'Generar comprobante',
              //         handler: function() {
              //             // Ext.Msg.wait(me.etiquetas.lbCargando, me.etiquetas.lbEsperando);
              //             Ext.Ajax.request({
              //                 method: "POST",
              //                 url: "generarComprobante",
              //                 params: {
              //                     data: Ext.encode(scopeConfCierre.stOperaciones)
              //                 },
              //                 callback: function(options, success, response) {
              //                     var result = Ext.decode(response.responseText);
              //                     if(result.datos)
              //                         me.fShowComprobante(result.datos, 1);
              //                     Ext.Msg.hide();
              //                 }
              //             });
              //         }
              //     }],
              // }),
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
//           wi_comprobante.doLayout();
// //                        wi_comprobante.maximize();
//           Ext.getCmp('winComprobantes').doLayout();
//           Ext.getCmp('winComprobantes').maximize();
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
                              if((grid.store.data.items[0].data.tienesaldo == 0 || grid.store.data.items[0].data.idestadocomprobante != null) && grid.store.data.items[1].data.idestadocomprobante != null) {
                                  if((grid.store.data.items[0].data.tienesaldo == 0 || grid.store.data.items[0].data.idestadocomprobante == '8032') && grid.store.data.items[1].data.idestadocomprobante == '8032') {
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
                              if((grid.store.data.items[0].data.tienesaldo == 0 || grid.store.data.items[0].data.idestadocomprobante != null) && grid.store.data.items[1].data.idestadocomprobante != null) {
                                  if((grid.store.data.items[0].data.tienesaldo == 0 || grid.store.data.items[0].data.idestadocomprobante == '8032') && grid.store.data.items[1].data.idestadocomprobante == '8032') {
                                      scopeComprobantes.comprobarsaldoResultado(record.data);
                                  } else {
                                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoAsenCmpCtasNom);
                                  }
                              } else {
                                  mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                              }
                          }
                          break;
                      case '9000':
                      {
                          scopeComprobantes.generarCmp(record.data);
                          // // alert("asfd");
                          // if(grid.store.data.items[0].data.idestadocomprobante != null && grid.store.data.items[1].data.idestadocomprobante != null) {
                          //     if(grid.store.data.items[0].data.idestadocomprobante == '8032' && grid.store.data.items[1].data.idestadocomprobante == '8032') {
                          //         scopeComprobantes.comprobarsaldoResultado(record.data);
                          //     } else {
                          //         mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoAsenCmpCtasNom);
                          //     }
                          // } else {
                          //     mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                          // }
                      }
                          break;
                  }
              } else if(action == 'idver') {
                  if(record.data.idcomprobante != null) {
                      Ext.Cont.Comprobante.Tool.init(record.data.idcomprobante);
                  } else {
                      mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenerado);
                  }
              } else if(action == 'idcancelar') {
                  if(record.data.idcomprobante != null) {
                      mostrarMensaje(2, 'Esta seguro que desea cancelar el comprobante?', function (btnPress) {
                          if (btnPress === 'ok') {
                              Ext.CONT.Componentes.MessageBox('msgLoadingRevert', 'Cancelando el comprobante...', 'Por favor espere');

                              Ext.Ajax.request({
                                  scope: this,
                                  method: "POST",
                                  timeout: 30000,
                                  params: {
                                      idcomprobante: record.data.idcomprobante
                                  },
                                  url: "guardarnumcompcancelado",
                                  callback: function (options, success, response) {
                                      var guardarnumcompcancelado = Ext.decode(response.responseText);

                                      if (success && !guardarnumcompcancelado.codMsg) {
                                          mostrarMensaje(1, "El comprobante número " + guardarnumcompcancelado + " a sido cancelado satisfactoriamente");
                                          scopeComprobantes.stComprobante.reload();
                                      }
                                      Ext.CONT.Componentes.HideBox('msgLoadingRevert');
                                  }
                              });

                          }
                      });
                  } else {
                      mostrarMensaje(1, 'No puede cancelar un comprobante que no ha generado. (=_=)');
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
                  // params: {data: Ext.encode(data)},
                  params: {
                      data: Ext.encode({
                          idoperacion: data.idoperacion,
                          idtipocuenta: data.idtipocuenta,
                          idcuentagrupo: data.idcuentagrupo,
                          idconf: data.idconfctasproceso ? data.idconfctasproceso : ''
                      })
                  },
                  callback: function(options, success, response) {
                      var result = Ext.decode(response.responseText);
                      if(result.datos)
                          me.fShowComprobante(result.datos, 1);
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
                      if(result == -1) {
                          scopeComprobantes.generarCmp(data);
                      } else if(result == -2) {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgGenCmpCtaResPsitivo);
                      } else if(result == -3) {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgNoGenCmpCtasNom);
                      }
                  } else if(data.idtipocuenta == '8036') {
                      if(result == -1) {
                          mostrarMensaje(1, scopeComprobantes.etiquetas.lbMsgGenCmpCtaResNegativo);
                      } else if(result == -2) {
                          scopeComprobantes.generarCmp(data);
                      } else if(result == -3) {
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
                  id: 'asociarEstF',
                  tooltip: 'Asociar/Desasociar estados financieros al cierre contable',
                  iconCls: 'cambiar',
                  marginLeft: 5,
                  width: 15,
                  height: 15
                  }, {
                    id: 'aprobarEstadof',
                    tooltip: 'Emitir estado financiero',
                    iconCls: 'icondistra-aprobar',
                    marginLeft: 1,
                    width: 15,
                    height: 15
                 }
              ]
          });

          scopeEstadosf.stEstadosf = new Ext.data.Store({
              url: 'cargarEstadosFinancieros',
              baseParams: {start: 0,
                  limit: 20
              },
              reader: new Ext.data.JsonReader({
                  totalProperty: 'cant',
                  root: 'datos',
                  id: 'idreportefinanciero'
              }, [{
                      name: 'idconceptocontable'
                  }, {
                      name: 'codigo'
                  }, {
                      name: 'denominacion'
                  }, {
                      name: 'idestado'
                  }, {
                      name: 'idreportefinanciero'
                  }
              ])
          });

          scopeEstadosf.gpEstadosf = new Ext.grid.GridPanel({
              id: 'idgpEstadosf',
              border: false,
              frame: false,
              autoExpandColumn: 'denominacion',
              loadMask: true,
              store: scopeEstadosf.stEstadosf,
              viewConfig: {forceFit: true},
              columns: [{
                  header: 'C&oacute;digo',
                  dataIndex: 'codigo',
                  sortable: true
              }, {
                  hidden: true,
                  dataIndex: 'idreportefinanciero',
                  hideable: false
              }, {
                  header: scopeEstadosf.etiquetas.lbEstadof,
                  width: 200,
                  dataIndex: 'denominacion',
                  sortable: true
              }, {
                  header: 'Asociado al cierre',
                  tooltip: 'Asociado al cierre contable',
                  dataindex: 'idestado',
                  align: 'center',
                  width: 125,
                  fixed: true,
                  sortable: true,
                  renderer: scopeEstadosf.showVisibility
              }, {
                  header: 'Emitido',
                  tooltip: 'Estado financiero emitido',
                  dataindex: 'idestado',
                  align: 'center',
                  width: 75,
                  fixed: true,
                  sortable: true,
                  renderer: scopeEstadosf.showPrint
              }, scopeEstadosf.rowaction],
              plugins: [scopeEstadosf.rowaction]
          });
          new Ext.Window({
              title: scopeEstadosf.etiquetas.ttEstadof,
              resizable: false,
              closeAction: 'close',
              modal: true,
              layout: 'fit',
              id: 'winEstadosf',
              width: 500,
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
          Ext.getCmp('winEstadosf').show();

          Ext.Ajax.request({
              method: "POST",
              url: "cargarEstadosFinancieros",
              callback: function(options, success, response) {
                  responseData = Ext.decode(response.responseText);
                  scopeEstadosf.stEstadosf.loadData(responseData);
              }
          });

          return;
      },
      showImage: function(value, metaData, record, rowIndex, colIndex, store) {
          if(record.data.estado == 1) {
              return scopeEstadosf.etiquetas.lbSinAprobar;
          } else if(record.data.estado == 2) {
              return scopeEstadosf.etiquetas.lbConfirmado;
          }
      },
      showVisibility: function (value, metaData, record, rowIndex, colIndex, store) {
          if (record.data.idestado == 2 || record.data.idestado == 3) {
              metaData.attr = 'ext:qtip="' + '<b>' + 'Asociado al cierre contable' + '</b>"';
              metaData.css = 'icondistra-true';
          }
      },
      showPrint: function (value, metaData, record, rowIndex, colIndex, store) {
          if (record.data.idestado == 3) {
              metaData.attr = 'ext:qtip="' + '<b>' + 'Estado financiero impreso' + '</b>"';
              metaData.css = 'icondistra-imprimir';
          }
      },
      initEvents: function() {
          scopeEstadosf.gpEstadosf.getView().getRowClass = function (record, index, rowParams, store) {
              if (record.get('idestadodocumento') == 4)
                  return 'FilaVerde';
          };

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
              } else  if(action == 'aprobarEstadof') {
                  if(record.data.idestado == 1) {
                      mostrarMensaje(1, 'El estado financiero no se encuentra asociado al cierre.');
                  } else {
                      if(record.data.idestado == 2) {
                          estado = 3;
                      } else if(record.data.idestado == 3) {
                          estado = 2;
                      }
                      scopeEstadosf.loadMask();
                      Ext.Ajax.request({
                          method: "POST",
                          url: "evaluarAnalisis",
                          params: {
                              id: Ext.encode(record.data.idreportefinanciero),
                              estado: estado
                          },
                          callback: function(options, success, response) {
                              var result = Ext.decode(response.responseText);
                              scopeEstadosf.lMask.hide();
                              switch(result) {
                                  case -1:
                                      {
                                          mostrarMensaje(1, 'El estado financiero ha sido emitido satisfactoriamente.');
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
                  }
              } else  if(action == 'asociarEstF') {
                  if(record.data.idestado == 1) {
                      estado = 2;
                  } else if(record.data.idestado == 2 || record.data.idestado == 3) {
                      estado = 1;
                  }
                  scopeEstadosf.loadMask();
                  Ext.Ajax.request({
                      method: "POST",
                      url: "evaluarAnalisis",
                      params: {
                          id: Ext.encode(record.data.idreportefinanciero),
                          estado: estado
                      },
                      callback: function(options, success, response) {
                          var result = Ext.decode(response.responseText);
                          scopeEstadosf.lMask.hide();
                          switch(result) {
                              case -1:
                              {
                                  if(estado == 2)
                                      mensaje = 'El estado financiero ha sido asociado satisfactoriamente.';
                                  else
                                      mensaje = 'El estado financiero ha sido desasociado satisfactoriamente.';
                                  mostrarMensaje(1, mensaje);
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
              }
          }, this);
      }
  });

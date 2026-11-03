  Ext.namespace('Ext.CONT.UICierre');
  Ext.CONT.UICierre = {
      initializeComponents: function(scope) {
          scope.vpCierre = new Ext.CONT.UICierre.viewPort({
              items: [new Ext.CONT.UICierre.pnlCierre(scope)]
          });
      }
  };
  Ext.CONT.UICierre.viewPort = Ext.extend(Ext.Viewport,
          {
              constructor: function(params) {
                  Ext.apply(this, {
                      layout: 'fit',
                      renderTo: document.body
                  });
                  return Ext.CONT.UICierre.viewPort.superclass.constructor.call(this, params);
              }
          });

  Ext.CONT.UICierre.pnlCierre = Ext.extend(Ext.Panel, {
      constructor: function(scope) {
          Ext.applyIf(this, {
              layout: 'fit',
              tbar: ['->', scope.lbInformacionFecha = new Ext.form.Label({
                      text: '...',
                      style: 'font-size:13px;'
                  })],
              items: [scope.gpInformacion = new Ext.CONT.UICierre.gpInformacion(scope)]
          });
          return this;
      }
  });

  Ext.CONT.UICierre.menuActions = Ext.extend(Ext.menu.Menu, {
      constructor: function(scope) {
          Ext.apply(this, {
              shadow: true,
              items: [scope.btnPasarDia = new Ext.menu.Item({
                      text: 'Pasar al d&iacute;a ...',
                      iconCls: 'calendario',
                      tabIndex: 2,
                      menu: new Ext.menu.DateMenu({
                          format: 'd/m/Y',
                          id: 'dmPasarDia',
                          shadow: true,
                          handler: function(datepicker, date) {
                              function pasarDia(btn) {
                                  if(btn == 'ok') {
                                      Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                                      Ext.Ajax.request({
                                          method: "POST",
                                          params: {
                                              fechaActual: date.format('d/m/Y')
                                          },
                                          url: "pasarDia",
                                          callback: function(options, success, response) {
                                              var responseData = Ext.decode(response.responseText);
                                              if(responseData.flag == true || responseData.flag == 'true') {
                                                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                                                  mostrarMensaje(1, String.format(scope.etiquetas.lbSubSistContabCloseDay, responseData.diaPasado, responseData.fechaActual), function() {
                                                      Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                                                      scope.loadDataComponent(scope);
                                                      var fechaActual = new Date();
                                                      fechaActual = Date.parseDate(responseData.fechaActual, "d/m/Y");
                                                      datepicker.minDate = fechaActual;
                                                      datepicker.setValue(fechaActual);
                                                      datepicker.setMinDate(fechaActual);
                                                  });
                                              } else {
                                                  stInformacion.on('load', function(store, records, options) {
                                                      Ext.CONT.Componentes.HideBox('msgbIniciando');
                                                      mostrarMensaje(1, scope.etiquetas.msgNotOperacion, function() {
                                                          {
                                                              scope.tbInformacion.enable();
                                                          }
                                                      });
                                                  });
                                                  if(responseData.Data)
                                                      stInformacion.loadData(responseData.Data);
                                                  else
                                                      scope.tbInformacion.enable();
                                              }
                                          }
                                      });
                                  }
                              }

                              mostrarMensaje(2, String.format(scope.etiquetas.lbSeguroPasarDia, date.format('d/m/Y')), pasarDia);
                          }
                      })
                  }),
                  scope.btnDia = new Ext.menu.Item({
                      text: scope.etiquetas.btnDia,
                      iconCls: 'cambiosdecuenta',
                      tabIndex: 3
                  }),
                  scope.btnPeriodo = new Ext.menu.Item({
                      text: scope.etiquetas.btnPeriodo,
                      iconCls: 'cambiar',
                      tabIndex: 4
                  }),
                  scope.btnComprobantes = new Ext.menu.Item({
                      text: scope.etiquetas.btnComprobante,
                      iconCls: 'informe',
                      tabIndex: 5
                  }),
                  scope.btnEjercicio = new Ext.menu.Item({
                      text: scope.etiquetas.btnEjercicio,
                      hidden: true,
                      iconCls: 'cambiar',
                      tabIndex: 6
                  })
              ]
          });
          return Ext.CONT.UICierre.menuActions.superclass.constructor.call(this);
      }
  });

  Ext.CONT.UICierre.gpInformacion = Ext.extend(Ext.grid.GridPanel, {
      store: stInformacion = new Ext.data.GroupingStore({
          reader: new Ext.data.JsonReader({}, [{name: 'sort'}, {name: 'dos'}, {name: 'uno'}, {name: 'tres'}, {name: 'cuatro'}, {name: 'texto'}, {name: 'idcomprobante'}]),
          sortInfo: {field: "sort", direction: "ASC"},
          groupField: 'texto'
      }),
      view: new Ext.grid.GroupingView({
          forceFit: true,
          groupTextTpl: '{text}({[values.rs.length]})'
      }),
      constructor: function(scope) {
          scope.btnMenu = new Ext.Button({
              id: 'btnMenu',
              text: scope.etiquetas.btnCierre,
              tooltip: scope.etiquetas.tpCierre,
              tabIndex: 1,
              iconCls: 'iniciodeanno',
              menu: scope.menuActions = new Ext.CONT.UICierre.menuActions(scope)
          });

          scope.btnAbrirComprobante = new Ext.Button({
              id: 'btnAbrirComprobante',
              hidden: true,
              iconCls: 'comprobante',
              text: scope.etiquetas.lbBtnAbrir,
              tooltip: scope.etiquetas.lbTtBtnAbrir,
              tabIndex: 9
          });
          scope.btnPreview = new Ext.Button({
              id: 'btnVistaPreliminar',
              hidden: true,
              iconCls: 'vistareporte',
              text: scope.etiquetas.TtCierre,
              tooltip: scope.etiquetas.BtnCierre,
              tabIndex: 10
          });

          scope.btnBuscarProblemas = new Ext.Button({
              id: 'btnBuscarProblemas',
              iconCls: 'recargar',
              text: 'Actualizar',
              // tooltip: scope.etiquetas.BtnCierre,
              tooltip: 'Actualizar cierre',
              tabIndex: 10
          });
          scope.btnAyuda = new Ext.Button({
              iconCls: 'ayuda',
              id: 'btnHelpCierreContabilidad',
              text: scope.etiquetas.lbbtnHelp,
              nextTab: 'cbPais',
              tooltip: scope.etiquetas.lbttipHelp,
              tabIndex: 11
          });
          Ext.applyIf(this, {
              frame: false,
              border: false,
              autoScroll: true,
              stripeRows: true,
              iconCls: 'icon-grid',
              autoExpandColumn: 'dos',
              cm: scope.cmInfomacion = new Ext.grid.ColumnModel([{
                      sortable: true,
                      hideable: false,
                      dataIndex: 'uno'
                  }, {
                      id: 'dos',
                      hideable: false,
                      sortable: true,
                      dataIndex: 'dos'
                  }, {
                      sortable: false,
                      hideable: false,
                      dataIndex: 'tres'
                  }, {
                      sortable: true,
                      hideable: false,
                      dataIndex: 'cuatro',
                      align: 'right'
                  }, {
                      header: "<font color=\"FF0000\">ERROR",
                      hidden: true,
                      sortable: true,
                      dataIndex: 'texto', renderer: function(value) {
                          switch(value) {
                              case 1:
                                  return scope.etiquetas.txtCOMPROBANTESNOASENTADOS;
                              case 2:
                                  return scope.etiquetas.txtSUBSISTEMANOCIERRE;
                              case 3:
                                  return scope.etiquetas.txtCUENTASSALDOCONTRARIO;
                              case 4:
                                  return scope.etiquetas.txtCUENTASNOCERRADAS;
                              case 5:
                                  return 'Las siguientes cuentas deben quedar con saldo 0';
                          }
                      }
                  }, {
                      hidden: true,
                      hideable: false,
                      sortable: true,
                      dataIndex: 'idcomprobante'
                  }]),
              sm: scope.smInformacion = new Ext.grid.RowSelectionModel({
                  width: 30,
                  sortable: false,
                  singleSelect: true,
                  listeners: {
                      rowselect: function(selectionModel, rowIndex, record) {
                          Ext.getCmp('btnAbrirComprobante').setVisible((record.data.idcomprobante != undefined) ? ((record.data.idcomprobante.length > 0) ? true : false) : false);
                      },
                      rowdeselect: function(selectionModel, rowIndex, record) {
                          Ext.getCmp('btnAbrirComprobante').setVisible(false);
                      }
                  }
              }),
              tbar: scope.tbInformacion = new Ext.Toolbar({
                  hidden: false,
                  items: [scope.btnMenu, scope.btnAbrirComprobante, scope.btnPreview, scope.btnBuscarProblemas, '->', scope.btnAyuda]
              })
          });
          return this;
      }
  });



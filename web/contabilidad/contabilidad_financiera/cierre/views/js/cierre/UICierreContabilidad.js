  Ext.namespace('Ext.CONT.UICierreContabilidad');
  Ext.CONT.UICierreContabilidad = {
      initializeComponents: function(scope) {
          scope.vpCierre = new Ext.CONT.UICierreContabilidad.viewPort({
              items: [new Ext.CONT.UICierreContabilidad.pnlCierre(scope)]
          });
      }
  };
  
  Ext.CONT.UICierreContabilidad.viewPort = Ext.extend(Ext.Viewport,
      {
          constructor: function(params) {
              Ext.apply(this, {
                  layout: 'fit',
                  renderTo: document.body
              });
              return Ext.CONT.UICierreContabilidad.viewPort.superclass.constructor.call(this, params);
          }
      }
  );

  Ext.CONT.UICierreContabilidad.pnlCierre = Ext.extend(Ext.Panel, {
      constructor: function(scope) {
          Ext.applyIf(this, {
              layout: 'fit',
              tbar: ['->', scope.lbInformacionFecha = new Ext.form.Label({text: '...', style: 'font-size:13px;'})],
              items: [scope.gpInformacion = new Ext.CONT.UICierreContabilidad.gpInformacion(scope)]
          });
          return this;
      }
  });

  Ext.CONT.UICierreContabilidad.menuActions = Ext.extend(Ext.menu.Menu, {
      constructor: function(scope) {
          Ext.apply(this, {
              shadow: true,
              items: [scope.btnPasarDia = new Ext.menu.Item({
                  text: 'Pasar al d&iacute;a ...',
                  iconCls: 'cambiar',
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
                                              mostrarMensaje(1, String.format(scope.etiquetas.lbSubSistContabCloseDay, responseData.diaPasado, responseData.fechaActual));//, function() {
                                              Ext.CONT.Componentes.MessageBox('msgbIniciando', scope.etiquetas.msgCargando);
                                              scope.loadDataComponent(scope);
                                              var fechaActual = new Date();
                                              fechaActual = Date.parseDate(responseData.fechaActual, "d/m/Y");
                                              datepicker.minDate = fechaActual;
                                              datepicker.setValue(fechaActual);
                                              datepicker.setMinDate(fechaActual);
                                          } else {
                                              stInformacion.on('load', function(store, records, options) {
                                                  Ext.CONT.Componentes.HideBox('msgbIniciando');
                                                  mostrarMensaje(1, scope.etiquetas.msgNotOperacionCausas);
                                                  scope.tbInformacion.enable();
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
                  iconCls: 'excluir',
                  tabIndex: 3
              }),
              scope.btnPeriodo = new Ext.menu.Item({
                  text: scope.etiquetas.btnPeriodo,
                  hidden: true,
                  iconCls: 'periodo',
                  tabIndex: 4
              }),
              scope.btnCargaInicial = new Ext.menu.Item({
                  text: 'Carga inicial',
                  hidden: true,
                  iconCls: 'periodo',
                  tabIndex: 4
              }),
              scope.btnComprobantes = new Ext.menu.Item({
                  text: scope.etiquetas.btnComprobante,
                  iconCls: 'comprobante',
                  tabIndex: 5
              }),
              scope.btnEjercicio = new Ext.menu.Item({
                  text: scope.etiquetas.btnEjercicio,
                  hidden: true,
                  iconCls: 'cambiar',
                  tabIndex: 8
              })
              ]
          });
          return Ext.CONT.UICierreContabilidad.menuActions.superclass.constructor.call(this);
      }
  });

  Ext.CONT.UICierreContabilidad.gpInformacion = Ext.extend(Ext.grid.GridPanel, {
      store: stInformacion = new Ext.data.GroupingStore({
          reader: new Ext.data.JsonReader({}, [{name: 'sort'}, {name: 'dos'}, {name: 'uno'}, {name: 'tres'},
                                                {name: 'cuatro'}, {name: 'texto'}, {name: 'idcomprobante'}]),
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
              menu: scope.menuActions = new Ext.CONT.UICierreContabilidad.menuActions(scope)
          });
          scope.btnConfiguracion = new Ext.Button({
              text: scope.etiquetas.btnConfiguracion,
              tooltip: scope.etiquetas.toolConfiguracion,
              hidden: true,
              iconCls: 'configuracion',
              tabIndex: 8
          });
          scope.btnEstadosF = new Ext.Button({
              text: scope.etiquetas.btnEstadosF,
              tooltip: scope.etiquetas.ttEstadof,
              hidden: true,
              iconCls: 'aprobar',
              tabIndex: 7
          }),
          scope.btnAbrirComprobante = new Ext.Button({
              id: 'btnAbrirComprobante',
              hidden: true,
              iconCls: 'comprobante',
              text: scope.etiquetas.lbBtnAbrir,
              tooltip: scope.etiquetas.lbTtBtnAbrir,
              tabIndex: 9
          }),
          scope.btnPreview = new Ext.Button({
              id: 'btnVistaPreliminar',
              hidden: true,
              iconCls: 'vistareporte',
              text: scope.etiquetas.TtCierre,
              tooltip: scope.etiquetas.BtnCierre,
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
                      header: "<font color=\"FF0000\">MOTIVO",
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
                                  return scope.etiquetas.txtESTADOSFINANCIEROSSINGENERAR;
                              case 6:
                                  return scope.etiquetas.txtCOMPROBANTESCONERROR;
                              case 7:
                                  return 'DIFERENCIA EN OPERACIONES ENTRE DEPENDENCIAS';
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
                  items: [scope.btnMenu, scope.btnConfiguracion, scope.btnEstadosF, scope.btnAbrirComprobante, scope.btnPreview, '->', scope.btnAyuda]
              })
          });
          return this;
      }
  });



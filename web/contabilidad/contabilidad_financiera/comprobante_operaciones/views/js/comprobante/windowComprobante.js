  Ext.namespace('Ext.windowComprobante');
  Ext.windowComprobante = Ext.extend(Ext.Window, {
      constructor: function(scope, params) {
          scope.lMask = Ext.windowComprobante.loadMask(scope, Ext.getBody(), scope.etiquetas.lMask);
          scope.btnVistaReporte = new Ext.Button({
              text: scope.etiquetas.btnVistaReporte,
              tooltip: scope.etiquetas.tpVistaReporte,
              tabIndex: 24,
              iconCls: 'vistareporte',
              scope: this
          });
          scope.btnExportar = new Ext.Button({
              text: scope.etiquetas.btnExportar,
              // hidden: true,
              tooltip: scope.etiquetas.lbTtExportar,
              tabIndex: 25,
              iconCls: 'exportar',
              scope: this
          });
          scope.btnCambiarEstado = new Ext.Button({
              text: scope.etiquetas.btnTerminar,
              tooltip: scope.etiquetas.tpCambiarEstado,
              tabIndex: 26,
              iconCls: 'asentar',
              scope: this
          });
          scope.btnInvertirComprobante = new Ext.Button({
              text: scope.etiquetas.lbInvertir,
              tabIndex: 27,
              tooltip: scope.etiquetas.tpInvertirComprobante,
              iconCls: 'invertir',
              scope: this
          });
          scope.btnDuplicarComprobante = new Ext.Button({
              text: scope.etiquetas.lbDuplicar,
              tooltip: scope.etiquetas.tpDuplicarComprobante,
              tabIndex: 28,
              iconCls: 'duplicar',
              scope: this
          });
          scope.btnNuevoComprobante = new Ext.Button({
              text: scope.etiquetas.btnNuevo,
              tooltip: scope.etiquetas.tpNuevo,
              tabIndex: 29,
              iconCls: 'nuevo',
              scope: this
          });
          scope.btnAnular = new Ext.Button({
              text: scope.etiquetas.btnAnular,
              tooltip: scope.etiquetas.lbTtAnular,
              //tabIndex: 30,
              iconCls: 'anular',
              scope: this
          });

          /*scope.btnEliminarComprobante = new Ext.Button({
           text: scope.etiquetas.btnEliminar,
           tooltip: scope.etiquetas.tpEliminarComprobante,
           tabIndex: 36,
           iconCls: 'eliminar',
           scope: this
           });*/

          scope.btnCerrarwComprobante = new Ext.Button({
              text: scope.etiquetas.btnCerrarwComprobante,
              tooltip: scope.etiquetas.tpCerrarwComprobante,
              tabIndex: 30,
              iconCls: 'cerrar',
              scope: this
          });
          Ext.applyIf(params || this, {
              id: 'wComprobante',
              constrain: true,
              plain: true,
              monitorResize: true,
              closable: false,
              modal: true,
              resizable: false,
              layout: 'border',
              items: [scope.globalNorth = new Ext.Panel({
                      region: 'north',
                      id: 'globalNorth',
                      frame: true,
                      border: false,
                      height: scope.pnlHeight,
                      hideBorders: true,
                      bodyBorder: false,
                      items: [
                          this.fpNorth(scope),
                          this.regionNorth(scope)
                      ]
                  }), scope.GpAnotaciones = new Ext.windowComprobante.GpAnotaciones(scope)
              ],
              buttons: [
                  scope.btnVistaReporte,
                  scope.btnExportar,
                  scope.btnCambiarEstado,
                  scope.btnInvertirComprobante,
                  scope.btnDuplicarComprobante,
                  scope.btnNuevoComprobante,
                  scope.btnAnular,
                  scope.btnCerrarwComprobante
              ]
          });
          return Ext.windowComprobante.superclass.constructor.call(this, params);
      },
      fpNorth: function(scope) {
          scope.tfDetalle = new Ext.form.TextField({
              fieldLabel: scope.etiquetas.lbDetalle,
              selectOnFocus: true,
              anchor: '100%',
              id: 'tfDetalle',
              name: 'tfDetalle',
              maxLength: 1000,
              maxLengthText: 'El tamaño m&aacute;ximo requerido es 1000 caracteres.',
              //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\(\)\,\.\-\\\/\:\;\#]+$/,
              //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]*)+$/,
              //regexText: scope.etiquetas.lbRegexText,
              tabIndex: 1,
              allowBlank: false,
              enableKeyEvents: true,
              /*listeners: {
                  'invalid': function(cmp, msg) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  },
                  'blur': function(cmp) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }

              }*/
          });
          scope.dfFecha = new Ext.Cont.DateField({
              fieldLabel: scope.etiquetas.lbFecha,
              anchor: '100%',
              id: 'dfFecha',
              name: 'dfFecha',
              tabIndex: 2,
              enableKeyEvents: true,
              format: 'd/m/Y',
              allowBlank: false,
              invalidText: scope.etiquetas.lbInvalidFecha,
              value: (scope.accion == 1) ? scope.fecha : scope.fechaComprobante
          });
          scope.taDescripcion = new Ext.form.TextArea({
              fieldLabel: scope.etiquetas.lbDescripcion,
              width: '100%',
              height: 40,
              stateful: true,
              preventScrollbars: true,
              id: 'taDescripcion',
              name: 'taDescripcion',
              maxLength: 1000,
              maxLengthText: 'El tamaño m&aacute;ximo requerido es 1000 caracteres.',
              //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s(\)\,\.\-\\\/\:\;\#]+$/,
              //regex: /^([a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]+(\s{1})?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\(\)\,\.\-\\\/\:\;\#]*)+$/,
              //regexText: scope.etiquetas.lbRegexText,
              tabIndex: 3,
              allowBlank: false,
              enableKeyEvents: true,
              /*listeners: {
                  'invalid': function(cmp, msg) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  },
                  'blur': function(cmp) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }
              }*/
          });
          return scope.fpContainerTopNorth = new Ext.form.FormPanel({
              title: ' ',
              labelAlign: 'top',
              titleCollapse: true,
              collapsed: false,
              collapsible: true,
              border: false,
              hideBorders: true,
              bodyBorder: false,
              items: [{
                      layout: 'column',
                      bodyStyle: 'padding:5px 5px 0 5px',
                      items: [
                          {
                              columnWidth: .85,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.tfDetalle
                          },
                          {
                              columnWidth: .15,
                              layout: 'form',
                              labelAlign: 'top',
                              items: scope.dfFecha
                          }]
                  },
                  {
                      layout: 'form',
                      labelAlign: 'top',
                      bodyStyle: 'padding:5px 5px 0 5px',
                      items: scope.taDescripcion
                  }
              ]
          });
      },
      regionNorth: function(scope) {
          scope.cbxMoneda = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.textSeleccione,
              fieldLabel: scope.etiquetas.lbMoneda,
              id: "cbxMoneda",
              tabIndex: 9,
              disabled: true,
              enableKeyEvents: true,
              maskRe: /^([a-zA-Z]+[a-zA-Z]*)+$/,
              forceSelection: true,
              valueField: 'idmoneda',
              displayField: 'codigo',
              hiddenName: 'idmonedaentidad',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              selectOnFocus: true,
              anchor: '100%',
              tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{codigo}</div></tpl>',
              store: scope.stMoneda = new Ext.data.Store({
                  url: scope.url + 'cargarMonedas',
                  reader: new Ext.data.JsonReader({}, [{
                          name: 'codigo',
                          mapping: 'codigoiso'
                      }, {
                          name: 'idmonedaentidad'
                      }, {
                          name: 'idmoneda'
                      }, {
                          name: 'descripcion',
                          mapping: 'nombremoneda'
                      }
                  ])
              })
          });
          scope.cbxTasa = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.textSeleccione,
              fieldLabel: scope.etiquetas.lbTasa,
              id: "cbxTasa",
              tabIndex: 10,
              enableKeyEvents: true,
              maskRe: /[0-9.]$/,
              forceSelection: true,
              valueField: 'idtasa',
              displayField: 'compra',
              hiddenName: 'idtasa',
              typeAhead: true,
              mode: 'local',
              allowBlank: false,
              triggerAction: 'all',
              selectOnFocus: true,
              anchor: '100%',
              tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{compra}</div></tpl>',
              store: scope.stTasa = new Ext.data.Store({
                  url: scope.url + 'cargarTasas',
                  reader: new Ext.data.JsonReader({}, [{
                          name: 'descripcion',
                          mapping: 'nombretasa'
                      }, {
                          name: 'factordeconversion'
                      }, {
                          name: 'idmonedacontable'
                      }, {
                          name: 'idmoneda'
                      }, {
                          name: 'idtipotasa'
                      }, {
                          name: 'compra'
                      }, {
                          name: 'venta'
                      }, {
                          name: 'idtasa'
                      }
                  ])
              })
          });

          scope.txtFactorConversion = new Ext.form.TextField({
              fieldLabel: scope.etiquetas.lbFactorConversion,
              id: "txtFactorConversion",
              tabIndex: 12,
              readOnly: true,
              anchor: '100%',
              maxLength: 10,
              style: 'text-align:left'
          });

          scope.cbxCuenta = new Ext.contabilidad.util.linkedCombo({
              store: scope.stCuenta = new Ext.data.Store({
                  url: scope.url + 'cargarDatosCuentas',
                  reader: new Ext.data.JsonReader({
                      root: 'datos'
                  }, [
                      {
                          name: 'idcuenta'
                      }, {
                          name: 'denominacion', mapping: 'text'
                      }, {
                          name: 'idmoneda'
                      }, {
                          name: 'codigoiso'
                      }
                  ])
              }),
              fieldLabel: 'Cuenta contable',
              maskRe: /[0-9.X|-]$/,
              displayField: 'denominacion',
              valueField: 'idcuenta',
              listHeight: 300,
              tabIndex: 8,
              tipocta: '',
              lazyRender: true,
              allowBlank: false,
              enableKeyEvents: true,
              fnCreateNew: Ext.emptyFn
          });

          scope.nfDebito = new Ext.form.NumberField({
              fieldLabel: scope.etiquetas.lbDebe,
              // fieldLabel: scope.etiquetas.lbDebito,
              id: "nfDebito",
              enableKeyEvents: true,
              tabIndex: 9,
              allowDecimals: true,
              anchor: '100%',
              allowNegative: false,
              maxLength: 16,
              maxLengthText: scope.etiquetas.lbMaxLengthNum,
              invalidText: scope.etiquetas.lbNumReales,
              style: 'text-align:right'
          });
          scope.nfCredito = new Ext.form.NumberField({
              fieldLabel: scope.etiquetas.lbHaber,
              // fieldLabel: scope.etiquetas.lbCredito,
              id: "nfCredito",
              enableKeyEvents: true,
              tabIndex: 10,
              allowDecimals: true,
              anchor: '100%',
              allowNegative: false,
              maxLength: 16,
              style: 'text-align:right'
          });
          scope.btnAceptarPase = new Ext.Button({
              text: scope.etiquetas.btnAdicionar,
              enableToggle: true,
              tabIndex: 11,
              tooltip: scope.etiquetas.tpAdicionarPase,
              id: 'btnAceptarPase',
             // disabled: true,
              iconCls: 'adicionar',
              scope: this
          });
          scope.btnGuardarPase = new Ext.Button({
              text: scope.etiquetas.btnGuardar,
              enableToggle: true,
              tabIndex: 16,
              tooltip: scope.etiquetas.tpGuardarPase,
              id: 'btnGuardarPase',
              disabled: true,
              hidden: true,
              iconCls: 'guardar',
              scope: this
          });
          scope.btnCancelarModificacionPase = new Ext.Button({
              text: scope.etiquetas.btnCancelar,
              tabIndex: 17,
              hidden: true,
              tooltip: scope.etiquetas.tpCancelarModificacion,
              id: 'btnCancelarModificacionPase',
              iconCls: 'cancelar',
              scope: this
          });
          scope.pnlAlignBtn = {
              monitorResize: true,
              layout: 'form',
              border: false,
              hideBorders: true,
              bodyBorder: false,
              bodyStyle: 'padding:0 0 18px 0'
          };
          scope.pnlAlignBtnAceptarPase = {
              autoWidth: true,
              layout: 'form',
              bodyStyle: 'padding:0 5px 0 0',
              labelAlign: 'top',
              items: [scope.pnlAlignBtn, scope.btnAceptarPase, scope.btnGuardarPase]
          };
          scope.pnlAlignBtnCancelarModificacionPase = {
              autoWidth: true,
              layout: 'form',
              labelAlign: 'top',
              items: [scope.pnlAlignBtn, scope.btnCancelarModificacionPase]
          };
          scope.fpContainerRegionNorth = new Ext.FrmComprobante.Comprobante(scope);
          return scope.fpContainerRegionNorth;
      }
  });
  Ext.windowComprobante.loadMask = function(scope, body, msg) {
      return new Ext.LoadMask(body, {msg: msg});
  };
  Ext.windowComprobante.GpAnotaciones = Ext.extend(Ext.grid.GridPanel, {
      constructor: function(scope, params) {
          scope.btnInvertirPase = new Ext.Button({
              text: scope.etiquetas.btnInvertir,
              tooltip: scope.etiquetas.tpInvertirPase,
              id: "btnInvertirPase",
              tabIndex: 18,
              iconCls: 'invertir',
              scope: this
          });
          scope.btnDuplicarPase = new Ext.Button({
              text: scope.etiquetas.btnDuplicar,
              tooltip: scope.etiquetas.tpDuplicarPase,
              id: "btnDuplicarPase",
              tabIndex: 19,
              iconCls: 'duplicar',
              scope: this
          });
          scope.btnModificarPase = new Ext.Button({
              text: scope.etiquetas.btnModificar,
              tooltip: scope.etiquetas.tpModificarPase,
              id: "btnModificarPase",
              tabIndex: 20,
              iconCls: 'modificar',
              scope: this
          });
          scope.btnEliminarPase = new Ext.Button({
              text: scope.etiquetas.btnEliminar,
              tooltip: scope.etiquetas.tpEliminarPase,
              id: "btnEliminarPase",
              tabIndex: 21,
              iconCls: 'eliminar',
              scope: this
          });
          scope.btnVerPase = new Ext.Button({
              text: scope.etiquetas.btnVerAnexo,
              tooltip: scope.etiquetas.tpVerAnexoPase,
              id: "btnVerPase",
              tabIndex: 22,
              iconCls: 'abrirventana',
              scope: this
          });
          scope.lbNroComprobante = new Ext.form.Label({
              id: "lbNroComprobante",
              html: "<b>" + scope.etiquetas.textPregunta + "</b>"
          });
          scope.lbEstadoComprobante = new Ext.form.Label({
              id: "lbEstadoComprobante",
              html: "<b>" + scope.etiquetas.textPregunta + "</b>"
          });
          scope.stGpAnotaciones = this.getStorePases(scope);

          this.id = 'GpAnotaciones';
          this.tabIndex = 23;
          this.region = 'center';
          this.bodyStyle = 'padding:0 5px 0 5px';
          this.autoExpandColumn = 'colCuenta';
          this.autoScroll = true;
          this.border = false;
          this.hideBorders = true;
          this.bodyBorder = false;
          this.viewConfig = {
              forceFit: true
          };
          this.view = new Ext.grid.GroupingView({
              forceFit: true,
              groupTextTpl: '{text} ({[values.rs.length]} {[(values.rs.length > 1) ? "Anotaciones" : "Anotaci&oacuten"]})'
          });
          this.tbar = scope.tbGpAnotaciones = new Ext.Toolbar({
              hidden: true,
              items: [
                  scope.btnInvertirPase, scope.btnDuplicarPase, scope.btnModificarPase, scope.btnEliminarPase, scope.btnVerPase]
          });
          this.bbar = scope.bbGpAnotaciones = new Ext.Toolbar({
              hidden: true,
              items: [
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  new Ext.Toolbar.TextItem({
                      text: scope.etiquetas.lbNroComprobante
                  }),
                  scope.lbNroComprobante,
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  new Ext.Toolbar.TextItem({
                      text: scope.etiquetas.lbEstado
                  }), scope.lbEstadoComprobante, '->',
                  new Ext.Toolbar.TextItem({
                      text: scope.etiquetas.lbTotalSaldo
                  }),
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  new Ext.Toolbar.TextItem({
                      text: scope.etiquetas.lbDebe
                      // text: scope.etiquetas.lbDebito
                  }),
                  {xtype: 'tbspacer'},
                  scope.nfTotalDebito = new Ext.form.Label({
                      html: "<b>0.00</b>"
                  }),
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'},
                  new Ext.Toolbar.TextItem({
                      text: scope.etiquetas.lbHaber
                      // text: scope.etiquetas.lbCredito
                  }),
                  {xtype: 'tbspacer'},
                  scope.nfTotalCredito = new Ext.form.Label({
                      html: "<b>0.00</b>"
                  }),
                  {xtype: 'tbspacer'},
                  {xtype: 'tbspacer'}]
          });
          this.sm = scope.smPases = new Ext.grid.RowSelectionModel({
              // singleSelect: true
              id: 'smPases',
              sortable: true,
              listeners: {
                  rowselect: function(smodel, rowIndex, record) {
                      scope.RowClick(smodel, rowIndex, record);
                  },
                  rowdeselect: function(smodel, rowIndex, record) {
                      scope.RowClick(smodel, rowIndex, record);
                  }
              }
          });
          this.cm = this.getColumnsPases(scope);
          this.store = scope.stGpAnotaciones;
          return Ext.windowComprobante.GpAnotaciones.superclass.constructor.call(this);
      },
      getColumnsPases: function(scope) {
          return new Ext.grid.ColumnModel([{
                  hidden: true,
                  hideable: false,
                  header: 'Operaci&oacute;n',
                  // sortable: true,
                  dataIndex: 'descOperacion'
              }, {
                  header: scope.etiquetas.tfNumDoc,
                  dataIndex: 'codigodocumentoprimario',
                  width: 30
              }, {
                  header: scope.etiquetas.lbCuenta,
                  id: 'colCuenta',
                  // sortable: true,
                  dataIndex: 'cuenta'
              }, {
                  header: scope.etiquetas.lbMoneda,
                  dataIndex: 'moneda',
                  width: 30
              // }, {
              //     header: scope.etiquetas.lbPorciento,
              //     dataIndex: 'porciento',
              //     width: 20,
              //     renderer: function(v) {
              //         return v + '%';
              //     }
              }, {
                  header: scope.etiquetas.lbDebe,
                  // header: scope.etiquetas.lbDebito,
                  tooltip: scope.etiquetas.tpDebito,
                  resizable: true,
                  // sortable: true,
                  dataIndex: 'debitoFormat',
                  align: 'right',
                  width: 50
              }, {
                  header: scope.etiquetas.lbHaber,
                  // header: scope.etiquetas.lbCredito,
                  tooltip: scope.etiquetas.tpCredito,
                  resizable: true,
                  // sortable: true,
                  dataIndex: 'creditoFormat',
                  align: 'right',
                  width: 50
              }, {
                  header: scope.etiquetas.lbAnexo,
                  tooltip: scope.etiquetas.tpAnexo,
                  resizable: true,
                  hidden: true,
                  hideable: false,
                  menuDisabled: true,
                  dataIndex: 'anexo',
                  align: 'center',
                  width: 15
              }
          ]);
//                return scope.fpContainerRegionNorth.getColumnsPases(scope);
      },
      getStorePases: function(scope) {
          return new Ext.data.GroupingStore({
              url: scope.url + 'cargarPases',
              sortInfo: {field: 'idEstadoComprobante', direction: "DESC"},
              groupField: 'descOperacion',
              reader: new Ext.data.JsonReader({},
                  [{
                          name: 'idpase'
                      }, {
                          name: 'descuadreAnexo'
                      }, {
                          name: 'cuenta'
                      }, {
                          name: 'idcuenta'
                      }, {
                          name: 'moneda'
                      }, {
                          name: 'idmoneda'
                      }, {
                          name: 'version'
                      }, {
                          name: 'idtasa'
                      }, {
                          name: 'debito'
                      }, {
                          name: 'debitoFormat'
                      }, {
                          name: 'credito'
                      }, {
                          name: 'creditoFormat'
                      }, {
                          name: 'porciento'
                      }, {
                          name: 'totalDebito'
                      }, {
                          name: 'totalCredito'
                      }, {
                          name: 'anexo'
                      }, {
                          name: 'codigodocumentoprimario'
                      }, {
                          name: 'idDocumento'
                      }, {
                          name: 'idpasegenara'
                      }, {
                          name: 'paseadicional'
                      }, {
                          name: 'estadoComprobante'
                      }, {
                          name: 'idEstadoComprobante'
                      }, {
                          name: 'idOperacion'
                      }, {
                          name: 'descOperacion'
                      }
                  ])
          });
      }
  });

  Ext.Cont.Comprobante.UI = Ext.extend(Ext.Component, {
      constructor: function(arg) {
          Ext.apply(this, arg);
          this.init();
          return Ext.Cont.Comprobante.UI.superclass.constructor.call(this);
      },
      init: function() {
          var scope = this;
          scope.ID = Ext.id();
          scope.lMask = function(body, msg)
          {
              return new Ext.LoadMask(body, {
                  msg: msg
              });
          };

          scope.initWindowComprobante = function() {
              this.tfDetalle = new Ext.form.TextField({
                  fieldLabel: this.etiquetas.lbDetalle,
                  selectOnFocus: true,
                  disabledClass: 'disabled-component',
                  anchor: '100%',
                  id: 'tfDetalle'+scope.ID,
                  name: 'tfDetalle',
                  maxLength: 1000,
                  maxLengthText: 'El tamaño m&aacute;ximo requerido es 1000 caracteres.',
                  //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]+)*$/,
                  //regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]*(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]+)*$/,
                  tabIndex: 1,
                  allowBlank: false,
                  enableKeyEvents: true,
                  listeners: {
                      'blur': function(tf)
                      {
                          if(!tf.isValid() || !scope.taDescripcion.isValid()) {
                              scope.btnAceptarComprobante.disable();
                          } else {
                              scope.btnAceptarComprobante.enable();
                          }
                      }
                  }
              });

              this.taDescripcion = new Ext.form.TextArea({
                  fieldLabel: this.etiquetas.lbDescripcion,
                  width: '100%',
                  stateful: true,
                  disabledClass: 'disabled-component',
                  preventScrollbars: true,
                  id: 'taDescripcion'+scope.ID,
                  name: 'taDescripcion',
                  maxLength: 1000,
                  maxLengthText: 'El tamaño m&aacute;ximo requerido es 1000 caracteres.',
                  //maskRe: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]*(\s{1})?(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]+)*$/,
                  //regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]*(\s{1}?[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\(\)\,\.\-\\\/\:\;\#]+)*$/,
                  tabIndex: 3,
                  allowBlank: false,
                  enableKeyEvents: true,
                  listeners: {
                      'blur': function(tf)
                      {
                          if(!tf.isValid() || !scope.tfDetalle.isValid()) {
                              scope.btnAceptarComprobante.disable();
                          } else {
                                scope.btnAceptarComprobante.enable();
                          }
                      }
                  }
              });

              this.dfFecha = new Ext.form.DateField({
                  fieldLabel: this.etiquetas.lbFecha,
                  anchor: '100%',
                  id: 'dfFecha'+scope.ID,
                  name: 'dfFecha',
                  tabIndex: 2,
                  readOnly: true,
                  hideTrigger: true,
                  enableKeyEvents: true,
                  format: 'd/m/Y',
                  allowBlank: false
              });

              this.btnVerRegistroAnexo = new Ext.Button({
                  text: this.etiquetas.btnVerAnexo,
                  tooltip: this.etiquetas.tpVerAnexoPase,
                  id: "btnVerRegistroAnexo"+scope.ID,
                  tabIndex: 32,
                  hidden: true,
//                  icon: this.perfil.dirImg + 'abrirventana.png',
                  iconCls: 'abrirventana',
                  scope: this
              });

              this.btnCerrarComprobante = new Ext.Button({
                  text: this.etiquetas.btnCerrar,
                  tooltip: this.etiquetas.tpCerrarComprobante,
                  tabIndex: 34,
//                  icon: this.perfil.dirImg + 'cerrar.png',
                  iconCls: 'cerrar',
                  scope: this
              });

              this.btnAceptarComprobante = new Ext.Button({
                  text: this.etiquetas.btnPostear,
                  tooltip: this.etiquetas.tpAceptar,
                  tabIndex: 41,
                  hidden: true,
                  iconCls: 'contabilidad',
                  scope: this
              });

              this.btnVistaPrevia = new Ext.Button({
                  text: this.etiquetas.btnVistaPrevia,
                  tooltip: this.etiquetas.ttVistaPrevia,
                  hidden: true,
                  iconCls: 'vistareporte'
              });
              this.btnExportar = new Ext.Button({
                  text: scope.etiquetas.btnExportar,
                  tooltip: scope.etiquetas.lbTtExportar,
                  tabIndex: 41,
                  iconCls: 'exportar',
                  abreviatura: 'btnExportar',
                  // hidden: true,
                  scope: this
              });

              //validate.addButton(this.btnExportar);
              //validate.checkPermisos();

              this.lbNroComprobante = new Ext.form.Label({
                  id: "lbNroComprobante"+scope.ID,
                  style: 'color:#000;font:bold 11px tahoma,arial,verdana,sans-serif;',
                  html: "<b>" + this.etiquetas.textPregunta + "</b>"
              });

              this.lbEstadoComprobante = new Ext.form.Label({
                  id: "lbEstadoComprobante"+scope.ID,
                  style: 'color:#000;font:bold 11px tahoma,arial,verdana,sans-serif;',
                  html: "<b>" + this.etiquetas.textPregunta + "</b>"
              });

              this.gpAnotaciones = new Ext.grid.GridPanel({
                  id: 'gpAnotaciones'+scope.ID,
                  region: 'center',
                  layout: 'fit',
                  tabIndex: 33,
                  autoExpandColumn: 'cuenta',
                  autoScroll: true,
                  frame: false,
                  border: false,
                  viewConfig: {
                      forceFit: true
                  },
                  tbar: this.tbgpAnotaciones = new Ext.Toolbar({
                      hidden: true,
                      items: [this.btnVerRegistroAnexo]
                  }),
                  bbar: this.bbgpAnotaciones = new Ext.Toolbar({
                      hidden: true,
                      items: [
                          this.textItemNoComprobante = new Ext.Toolbar.TextItem({
                              text: this.etiquetas.lbNroComprobante
                          }), this.lbNroComprobante,
                          {xtype: 'tbspacer'},
                          new Ext.Toolbar.TextItem({
                              text: this.etiquetas.lbEstado
                          }), this.lbEstadoComprobante, '->',
                          new Ext.Toolbar.TextItem({
                              text: this.etiquetas.lbTotalSaldo
                          }),
                          {xtype: 'tbspacer'},
                          new Ext.Toolbar.TextItem({
                              text: this.etiquetas.lbDebe
                              // text: this.etiquetas.lbDebito
                          }),
                          {xtype: 'tbspacer'},
                          this.nfTotalDebito = new Ext.form.Label({
                              html: "<b>0.00</b>"
                          }),
                          {xtype: 'tbspacer'},
                          new Ext.Toolbar.TextItem({
                              text: this.etiquetas.lbHaber
                              // text: this.etiquetas.lbCredito
                          }),
                          {xtype: 'tbspacer'},
                          this.nfTotalCredito = new Ext.form.Label({
                              html: "<b>0.00</b>"
                          }),
                          {xtype: 'tbspacer'}]
                  }),
                  sm: this.smAnotaciones = new Ext.grid.RowSelectionModel({
                      // singleSelect: true
                  }),
                  columns: [
                      {
                          header: this.etiquetas.lbDocumento,
                          dataIndex: 'numerodocumento',
                          width: 40
                      }, {
                          header: this.etiquetas.lbCuenta,
                          id: 'cuenta',
                          dataIndex: 'cuenta'
                      }, {
                          header: this.etiquetas.lbMoneda,
                          dataIndex: 'moneda',
                          width: 30
                      }, {
                          header: this.etiquetas.lbDebe,
                          // header: this.etiquetas.lbDebito,
                          tooltip: this.etiquetas.tpDebito,
                          resizable: true,
                          menuDisabled: true,
                          dataIndex: 'debito',
                          align: 'right',
                          width: 50,
                          renderer: function(value)
                          {
                              if(value)
                                  return formatoMonedaABS(value);
                              return value;
                          }
                      }, {
                          header: this.etiquetas.lbHaber,
                          // header: this.etiquetas.lbCredito,
                          tooltip: this.etiquetas.tpCredito,
                          resizable: true,
                          menuDisabled: true,
                          dataIndex: 'credito',
                          align: 'right',
                          width: 50,
                          renderer: function(value)
                          {
                              if(value)
                                  return formatoMonedaABS(value);
                              return value;
                          }
                      }, {
                          header: this.etiquetas.lbAnexo,
                          tooltip: this.etiquetas.tpAnexo,
                          resizable: true,
                          hidden: true,
                          hideable: false,
                          menuDisabled: true,
                          dataIndex: 'anexos',
                          align: 'center',
                          width: 15,
                          renderer: function(value)
                          {
                              if(value != undefined)
                                  if(value.length > 0)
                                      return "***";
                              return value;
                          }
                      }],
                  store: this.stAnotaciones = new Ext.data.SimpleStore({
                      remoteSort: false,
                      fields: [{
                              name: 'tipo'
                          }, {
                              name: 'cuenta'
                          }, {
                              name: 'idcuenta'
                          }, {
                              name: 'moneda'
                          }, {
                              name: 'idmoneda'
                          }, {
                              name: 'idtasa'
                          }, {
                              name: 'debito',
                              type: 'float'
                          }, {
                              name: 'credito',
                              type: 'float'
                          }, {
                              name: 'porciento'
                          }, {
                              name: 'anexos'
                          }, {
                              name: 'numerodocumento'
                          }, {
                              name: 'iddocumento'
                          }, {
                              name: 'idoperacion'
                          }],
                      data: []
                  })
              });

              this.wComprobante = new Ext.Window({
                  id: 'wComprobante'+scope.ID,
                  border: false,
                  title: this.etiquetas.textWindowComprobante,
                  monitorResize: true,
                  closable: false,
                  closeAction :'close',
                  modal: true,
                  resizable: false,
                  layout: 'fit',
                  constrain: true,
                  buttons: [this.btnVistaPrevia, this.btnExportar, this.btnAceptarComprobante, this.btnCerrarComprobante],
                  keys: new Ext.KeyMap(Ext.getBody(), [{
                      key: 'x',
                      alt: true,
                      fn: function() {
                          this.btnCerrarComprobante.fireEvent('click');
                      },
                      scope: this
                  }])
              });

              this.pnlComprobante = {
                  layout: 'border',
                  frame: true,
                  items: [{
                      region: 'north',
                      labelAlign: 'top',
                      border: false,
                      items: [{
                          layout: 'column',
                          border: false,
                          items: [{
                              columnWidth: .85,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: this.tfDetalle
                          }, {
                              columnWidth: .15,
                              layout: 'form',
                              labelAlign: 'top',
                              items: this.dfFecha
                          }]}, {
                              layout: 'form',
                              labelAlign: 'top',
                              border: false,
                              items: this.taDescripcion
                          }]
                  }, this.gpAnotaciones]
              };
          };

          scope.initWindowRegistrosAnexos = function(tipo, debito, importe) {

              this.btnCerrarRegistrosAnexos = new Ext.Button({
                  text: this.etiquetas.btnCerrar,
                  tooltip: this.etiquetas.tpCerrarRegistrosAnexos,
                  tabIndex: 34,
                  iconCls: 'cerrar',
                  scope: this
              });

              this.gpRegistrosAnexos = new Ext.grid.GridPanel({
                  id: 'gpRegistrosAnexos'+scope.ID,
                  layout: 'fit',
                  autoExpandColumn: 'centronivel',
                  autoScroll: true,
                  frame: false,
                  border: false,
                  hideBorders: true,
                  bodyBorder: false,
                  iconCls: 'icon-grid',
                  viewConfig: {
                      forceFit: true
                  },
                  bbar: ["->", new Ext.Toolbar.TextItem({
                          text: this.etiquetas.lbImporteOriginal + ((debito !== undefined) ? this.etiquetas.lbDebe : this.etiquetas.lbHaber) + ' :'
                      }),
                      {
                          xtype: 'tbspacer'
                      }, this.nfImporteOriginal = new Ext.Toolbar.TextItem({
                          text: "<b>" + formatoMonedaABS(importe) + "</b>"
                      }),
                      {
                          xtype: 'tbspacer'
                      }, {
                          xtype: 'tbspacer'
                      }, {
                          xtype: 'tbspacer'
                      }, {
                          xtype: 'tbspacer'
                      }, {
                          xtype: 'tbspacer'
                      }, {
                          xtype: 'tbspacer'
                      },
                      new Ext.Toolbar.TextItem({
                          text: this.etiquetas.lbSumaControl
                      }),
                      {
                          xtype: 'tbspacer'
                      }, this.nfImporteTotal = new Ext.form.Label({
                          style: 'font-weight: bold;'
                      }), new Ext.menu.Separator({})],
                  sm: this.smRegistrosAnexos = new Ext.grid.RowSelectionModel({
                      singleSelect: true
                  }),
                  columns: [{
                      header: (tipo === 1) ? this.etiquetas.headerCentroCosto : this.etiquetas.headerNAE,
                      id: 'centronivel',
                      dataIndex: 'centronivel'
                  }, {
                      header: (tipo === 1) ? this.etiquetas.headerElemento : this.etiquetas.headerObjeto,
                      dataIndex: 'elementouobjeto',
                      width: 40
                  }, {
                      header: this.etiquetas.lbImporte,
                      tooltip: this.etiquetas.tpImporte,
                      resizable: false,
                      menuDisabled: true,
                      dataIndex: 'importe',
                      align: 'right',
                      width: 50,
                      renderer: function(value)
                      {
                          if(value)
                              return formatoMonedaABS(value);
                          return value;
                      }
                  }],
                  store: this.stRegistrosAnexos = new Ext.data.SimpleStore({
                      fields: [{
                              name: 'centronivel'
                          }, {
                              name: 'idcentronivel'
                          }, {
                              name: 'elementouobjeto'
                          }, {
                              name: 'idelementouobjeto'
                          }, {
                              name: 'importe'
                          }],
                      data: []
                  })
              });

              this.wRegistrosAnexos = new Ext.Window({
                  id: 'wRegistrosAnexos'+scope.ID,
                  constrain: true,
                  layout: 'fit',
                  plain: true,
                  title: this.etiquetas.textRegistrosAnexos,
                  monitorResize: true,
                  closable: false,
                  closeAction: 'hide',
                  modal: true,
                  resizable: false,
                  defaultButton: 0,
                  items: [this.gpRegistrosAnexos],
                  buttons: [this.btnCerrarRegistrosAnexos]
              });
          };

          scope.initWindowComprobante();
      }
  });
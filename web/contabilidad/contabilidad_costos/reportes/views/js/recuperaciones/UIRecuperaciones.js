  Ext.namespace('Ext.CONT.Analisis.UIRecuperacionesBasicas');
  Ext.CONT.Analisis.UIRecuperaciones = Ext.extend(Ext.util.Observable, {
      constructor: function(scope) {
          Ext.CONT.Analisis.UIRecuperaciones.superclass.constructor.call(this);
          this.viewPort(scope);
          return this;
      },
      loadMask: function(body, msg) {
          Ext.apply(this, {
              msg: msg
          });
          return new Ext.LoadMask(body, this);
      },
      viewPort: function(scope) {
          Ext.apply(this, {
              keys: new Ext.KeyMap(Ext.getBody(), [{
                      // ADICIONAR
                      key: 'h',
                      alt: true,
                      fn: function() {
                          help.show(scope.etiquetas.titleH1, 'confin/CG/recuperaciones/basicas');
                      }
                  },
                  {
                      key: 'r',
                      alt: true,
                      fn: function() {
                          if(!Ext.getCmp('btnVistaPreliminar').hidden)
                              Ext.getCmp('btnVistaPreliminar').fireEvent('click');
                      }
                  },
                  {
                      key: 'a',
                      alt: true,
                      fn: function() {
                          if(!Ext.getCmp('btnAbrirComprobante').hidden)
                              Ext.getCmp('btnAbrirComprobante').fireEvent('click');
                      }
                  }
              ]),
              renderTo: document.body,
              layout: 'border',
              items: [scope.pnlNorth = this.pnlNorth(scope), scope.pnlSouth = this.pnlSouth(scope)]
          });
          return new Ext.Viewport(this);
      },
      pnlNorth: function(scope) {
          scope.cbxEntidad = new Ext.CONT.UIXCombo({
              emptyText: scope.etiquetas.txtSeleccione,
              allowBlank: false,
              fieldLabel: scope.etiquetas.lbEntidad,
              tabIndex: 1
          }, {
              identificador: 'Entidad',
              displayText: 'Entidad',
              url: 'obtenerEntidadesParaBusqueda',
              autoLoad: false,
              tbar: [new Ext.Button({
                      iconCls: 'deshabilitar',
                      text: scope.etiquetas.txtNoConsolidar,
                      id: 'btnNoConsolidar',
                      hidden: true
                  }),
                  new Ext.Button({
                      iconCls: 'habilitar',
                      text: scope.etiquetas.txtConsolidar,
                      id: 'btnConsolidar',
                      hidden: true
                  })],
              singleSelect: false,
              reader: scope.jrEntidad = new Ext.data.JsonReader({
                  id: 'idestructurae',
                  root: 'datos'
              }, [{
                      name: '_parent',
                      mapping: 'idestructuraepadre'
                  }, {
                      name: '_is_leaf',
                      mapping: 'leaf'
                  }, {
                      name: 'id'
                  }, {
                      name: 'text'
                  }, {
                      name: 'codigo',
                      mapping: 'text'
                  }, {
                      name: 'idestructurae'
                  }, {
                      name: 'idestructuraepadre'
                  }, {
                      name: 'ordenizq'
                  }, {
                      name: 'ordender'
                  }])
          });

          scope.cbxEjercicio = new Ext.CONT.UIXCombo({
              emptyText: scope.etiquetas.txtSeleccione,
              allowBlank: false,
              fieldLabel: scope.etiquetas.txtEjercicio,
              hiddenTbar: true,
              tabIndex: 2
          }, {
              identificador: 'Ejercicio',
              displayText: 'Ejercicio',
              url: 'obtenerEjerciciosParaBusqueda',
              autoLoad: false,
              singleSelect: true,
              reader: scope.jrEjercicio = new Ext.data.JsonReader({
                  id: 'idejercicio',
                  root: 'datos'
              }, [{
                      name: '_parent'
                  }, {
                      name: '_is_leaf'
                  }, {
                      name: 'text'
                  }, {
                      name: 'idejercicio'
                  }, {
                      name: 'nombre'
                  }, {
                      name: 'codigo',
                      mapping: 'text'
                  }, {
                      name: 'inicio'
                  }, {
                      name: 'fin'
                  }])
          });

          scope.cbxPeriodo = new Ext.CONT.UIXCombo({
              emptyText: scope.etiquetas.txtSeleccione,
              fieldLabel: scope.etiquetas.txtPeriodo,
              tabIndex: 3
          }, {
              identificador: 'Periodo',
              displayText: 'Per&iacute;odo',
              url: 'obtenerPeriodosParaBusqueda',
              autoLoad: false,
              singleSelect: false,
              reader: scope.jrPeriodo = new Ext.data.JsonReader({
                  id: 'idperiodo',
                  root: 'datos'
              }, [{
                      name: '_parent'
                  }, {
                      name: '_is_leaf'
                  }, {
                      name: 'text'
                  }, {
                      name: 'idperiodo'
                  }, {
                      name: 'nombre'
                  }, {
                      name: 'codigo',
                      mapping: 'text'
                  }, {
                      name: 'idejercicio'
                  }, {
                      name: 'inicio'
                  }, {
                      name: 'fin'
                  }, {
                      name: 'apertura'
                  }])
          });

          Ext.apply(Ext.form.VTypes, {
              daterange: function(val, field) {
                  var date = field.parseDate(val);
                  var dispUpd = function(picker) {
                      var ad = picker.activeDate;
                      picker.activeDate = null;
                      picker.update(ad);
                  };
                  if(field.startDateField) {
                      var sd = Ext.getCmp(field.startDateField);
                      sd.maxValue = date;
                      if(sd.menu && sd.menu.picker) {
                          sd.menu.picker.maxDate = date;
                          dispUpd(sd.menu.picker);
                      }
                  } else if(field.endDateField) {
                      var ed = Ext.getCmp(field.endDateField);
                      ed.minValue = date;
                      if(ed.menu && ed.menu.picker) {
                          ed.menu.picker.minDate = date;
                          dispUpd(ed.menu.picker);
                      }
                  }
                  return true;
              }
          });

          scope.dfDesde = new Ext.form.DateField({
              fieldLabel: scope.etiquetas.txtDesde,
              enableKeyEvents: true,
              tabIndex: 4,
              vtype: 'daterange',
              name: 'dfDesde',
              id: 'dfDesde',
              endDateField: 'dfHasta',
              anchor: '100%',
              readOnly: true,
              format: 'd/m/Y',
              allowBlank: true
          });

          scope.dfHasta = new Ext.form.DateField({
              fieldLabel: scope.etiquetas.txtHasta,
              enableKeyEvents: true,
              vtype: 'daterange',
              startDateField: 'dfDesde',
              tabIndex: 5,
              name: 'dfHasta',
              id: 'dfHasta',
              anchor: '100%',
              allowBlank: false,
              readOnly: true,
              format: 'd/m/Y'
          });

          scope.cbxMoneda = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.txtSeleccione,
              forceSelection: true,
              tabIndex: 6,
              allowBlank: false,
              valuesLoaded: new Array(),
              fieldLabel: scope.etiquetas.txtMoneda,
              store: scope.stMoneda = new Ext.data.Store({
                  url: 'obtenerMonedasParaBusqueda',
                  reader: scope.jrMoneda = new Ext.data.JsonReader({
                      root: 'datos',
                      id: 'idmoneda'
                  }, [{
                          name: 'idmoneda'
                      }, {
                          name: 'nombre'
                      }, {
                          name: 'codigoiso'
                      }])
              }),
              valueField: 'idmoneda',
              displayField: 'codigoiso',
              hiddenName: 'idmoneda',
              typeAhead: true,
              mode: 'local',
              triggerAction: 'all',
              selectOnFocus: true,
              shadow: true,
              enableKeyEvents: true,
              tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{codigoiso}</div></tpl>',
              anchor: '100%'
          });

          scope.cbxReporte = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.txtSeleccione,
              invalidText: "Este campo es obligatorio",
              forceSelection: true,
              tabIndex: 7,
              allowBlank: false,
              fieldLabel: scope.etiquetas.txtReporte,
              store: new Ext.data.JsonStore({
                  fields: ['idreporte', 'nombre'],
                  autoLoad: true,
                  data: [
                      {
                          'idreporte': '501',
                          'nombre': scope.etiquetas.lbSubMayorEG
                      },
                      {
                          'idreporte': '502',
                          'nombre': scope.etiquetas.lbSubMayorCC
                      },
                      {
                          'idreporte': '503',
                          'nombre': scope.etiquetas.lbProrrateo
                      },
                      {
                          'idreporte': '504',
                          'nombre': scope.etiquetas.lbSubMayorCP
                      }]
              }),
              valueField: 'idreporte',
              displayField: 'nombre',
              hiddenName: 'idreporte',
              typeAhead: true,
              mode: 'local',
              triggerAction: 'all',
              selectOnFocus: true,
              shadow: true,
              enableKeyEvents: true,
              tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>',
              anchor: '100%'
          });

          scope.btnAceptar = new Ext.Button({
              iconCls: 'aceptar',
              disabled: true,
              tooltip: scope.etiquetas.tooltipBtnAceptar,
              text: scope.etiquetas.txtAceptar,
              id: 'btnAceptar'
          });
          scope.btnAyuda = new Ext.Button({
              iconCls: 'ayuda',
              id: 'btnHelpRecuperacionesBasicas',
              text: scope.etiquetas.lbbtnHelp,
              tooltip: scope.etiquetas.lbttipHelp
          });

          Ext.apply(this, {
              region: 'north',
              height: 135,
              frame: true,
              border: false,
              labelAlign: 'top',
              items: [
                  {
                      layout: 'column',
                      labelAlign: 'top',
                      items: [
                          {
                              columnWidth: .30,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.cbxEntidad
                          },
                          {
                              columnWidth: .15,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.cbxEjercicio
                          },
                          {
                              columnWidth: .20,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.cbxPeriodo
                          },
                          {
                              columnWidth: .10,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.dfDesde
                          },
                          {
                              columnWidth: .10,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.dfHasta
                          },
                          {
                              columnWidth: .10,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.cbxMoneda
                          }]
                  },
                  {
                      layout: 'column',
                      labelAlign: 'top',
                      items: [
                          {
                              columnWidth: .20,
                              style: 'margin: 0 0 0 5',
                              layout: 'form',
                              items: scope.cbxReporte
                          }]
                  }
              ],
              bbar: [scope.btnAceptar, "->", scope.btnAyuda]
          });
          return new Ext.form.FormPanel(this);
      },
      fGetComponent: function(value, scope) {
          switch(value) {
              case '101' :
                  component = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      invalidText: "Este campo es obligatorio",
                      allowBlank: true,
                      loaded: false,
                      fieldLabel: scope.etiquetas.lbCuenta,
                      tabIndex: 8
                  }, {
                      identificador: 'Component',
                      displayText: 'text',
                      url: 'obtenerCuentas',
                      height: 400,
                      autoLoad: false,
                      singleSelect: false,
                      baseParams: {
                          'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                      },
                      reader: scope.jrCuenta = new Ext.data.JsonReader({
                          id: 'idcuenta'
                      }, [{
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
                  });
                  break;
              case '501':
              case '502':
              case '504':
                  component = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      invalidText: "Este campo es obligatorio",
                      allowBlank: true,
                      loaded: false,
                      fieldLabel: scope.etiquetas.txtSubCuenta,
                      tabIndex: 8
                  }, {
                      identificador: 'Component',
                      displayText: 'text',
                      url: 'obtenerSubCuentas',
                      baseParams: {
                          'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values),
                          'idReporte': scope.cbxReporte.getValue()
                      },
                      height: 400,
                      autoLoad: false,
                      singleSelect: false,
                      reader: scope.jrSubCuenta = new Ext.data.JsonReader({
                          id: 'idcuenta'
                      }, [{
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
                  });
                  break;
              default :
                  component = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      invalidText: "Este campo es obligatorio",
                      allowBlank: false,
                      loaded: false,
                      fieldLabel: scope.etiquetas.txtNivel,
                      tabIndex: 8
                  }, {
                      identificador: 'Component',
                      displayText: 'text',
                      url: 'obtenerNivelesCuentas',
                      baseParams: {
                          'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values)
                      },
                      autoLoad: false,
                      singleSelect: true,
                      reader: scope.jrNiveles = new Ext.data.JsonReader({
                          id: 'id'
                      }, [{
                              name: '_parent'
                          }, {
                              name: '_is_leaf'
                          }, {
                              name: 'idparteformato'
                          }, {
                              name: 'codigo'
                          }, {
                              name: 'text'
                          }, {
                              name: 'nombre'
                          }, {
                              name: 'id'
                          }, {
                              name: 'nivel'
                          }, {
                              name: 'abreviatura'
                          }])
                  });
          }
          return {
              columnWidth: .25,
              style: 'margin: 0 0 0 5',
              layout: 'form',
              labelAlign: 'top',
              items: component
          };
      },
      fAddCbxComponent: function(numero, scope) {
          switch(numero) {
              case '1' :
                  combo = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      allowBlank: false,
                      fieldLabel: scope.etiquetas.txtSubsistema,
                      tabIndex: 8
                  }, {
                      identificador: 'Subsistema',
                      displayText: 'text',
                      url: 'obtenerSubsistemas',
                      baseParams: {
                          'arrayIdEstructurae': Ext.encode(scope.cbxEntidad.fSelect.values),
                          'fechaInicio': scope.dfDesde.getRawValue(),
                          'fechaFin': scope.dfHasta.getRawValue()
                      },
                      autoLoad: false,
                      singleSelect: false,
                      reader: scope.jrSubCuenta = new Ext.data.JsonReader({
                          id: 'idSubsistema',
                          root: 'datos'
                      }, [{
                              name: '_parent'
                          }, {
                              name: '_is_leaf'
                          }, {
                              name: 'codigo'
                          }, {
                              name: 'text'
                          }])
                  });
                  break;
              case '2' :
                  combo = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      allowBlank: false,
                      fieldLabel: scope.etiquetas.cbxEstado,
                      tabIndex: 8
                  }, {
                      identificador: 'Estado',
                      displayText: 'text',
                      url: 'obtenerEstadosComprobantes',
                      autoLoad: false,
                      singleSelect: false,
                      reader: scope.jrEstado = new Ext.data.JsonReader({
                          id: 'idEstadoComprobante',
                          root: 'datos'
                      }, [{
                              name: '_parent'
                          }, {
                              name: '_is_leaf'
                          }, {
                              name: 'text'
                          }, {
                              name: 'idEstadoComprobante'
                          }, {
                              name: 'codigo'
                          }])
                  });
                  break;
              case '3' :
                  combo = new Ext.CONT.UIXCombo({
                      emptyText: scope.etiquetas.txtSeleccione,
                      allowBlank: false,
                      fieldLabel: scope.etiquetas.cbxNumero,
                      tabIndex: 8
                  }, {
                      identificador: 'Numero',
                      displayText: 'text',
                      url: 'obtenerNumerosComprobantes',
                      autoLoad: false,
                      singleSelect: false,
                      reader: scope.jrNumero = new Ext.data.JsonReader({
                          id: 'numerocomprobante',
                          root: 'datos'
                      }, [{
                              name: '_parent'
                          }, {
                              name: '_is_leaf'
                          }, {
                              name: 'text'
                          }, {
                              name: 'codigo'
                          }])
                  });
                  break;
          }
          return {
              columnWidth: .25,
              style: 'margin: 0 0 0 5',
              layout: 'form',
              labelAlign: 'top',
              items: combo
          };
      },
      pnlSouth: function(scope) {
          Ext.apply(this, {
              layout: 'fit',
              region: 'center',
              frame: false,
              border: false,
              items: [scope.gpDatosReporte = new Ext.grid.GridPanel
                          ({
                              id: 'gpReportes',
                              autoScroll: true,
                              frame: false,
                              layout: 'fit',
                              border: false,
                              sm: scope.smDatosReporte = new Ext.grid.RowSelectionModel({
                                  singleSelect: true
                              }),
                              store: new Ext.data.GroupingStore({
                                  fields: [],
                                  data: [[]],
                                  reader: new Ext.data.ArrayReader({}, [
                                      {name: 'Cuenta'},
                                      {name: 'fechaemision'},
                                      {name: 'comprobante'},
                                      {name: 'descripcion'}
                                  ])
                              }),
                              columns: [
                                  {
                                      header: scope.etiquetas.lbCuenta,
                                      tooltip: scope.etiquetas.lbTtCuenta,
                                      dataIndex: 'Cuenta',
                                      align: 'left',
                                      width: 150
                                  },
                                  {
                                      header: scope.etiquetas.lbFecha,
                                      tooltip: scope.etiquetas.lbFechaCont,
                                      dataIndex: 'fechaemision',
                                      width: 100
                                  },
                                  {
                                      header: scope.etiquetas.lbNoComprobante,
                                      tooltip: scope.etiquetas.lbTtNoComprobante,
                                      dataIndex: 'comprobante',
                                      width: 100
                                  },
                                  {
                                      id: 'expandir',
                                      header: scope.etiquetas.lbDescripcion,
                                      tooltip: scope.etiquetas.lbTtDescripcion,
                                      dataIndex: 'descripcion',
                                      width: 350
                                  }],
                              view: new Ext.grid.GroupingView({
                                  forceFit: true,
                                  ShowGroupName: true,
                                  enableNoGroup: false,
                                  enableGropingMenu: false,
                                  hideGroupedColumn: true,
                                  groupTextTpl: '{text}'
                              }),
                              tbar: [
                                  scope.btnAbrirComprobante = new Ext.Button({
                                      id: 'btnAbrirComprobante',
                                      hidden: true,
                                      iconCls: 'comprobante',
                                      text: scope.etiquetas.textAbrir,
                                      tooltip: scope.etiquetas.txtAbrirOp
                                  }),
                                  scope.btnVistaPreliminar = new Ext.Button({
                                      id: 'btnVistaPreliminar',
                                      hidden: true,
                                      iconCls: 'vistareporte',
                                      text: scope.etiquetas.txtVista,
                                      tooltip: scope.etiquetas.tooltipVista
                                  })
                              ]
                          })]
          });
          return new Ext.Panel(this);
      }

  });
Ext.ns("Ext.erp");
Ext.erp.configuracioninventario = Ext.extend(LOG.util.Panel, {
  listaBotonesVentanaToolbar: undefined,
  listaBotonesPanel: undefined,

  constructor: function (config) {
    var _this = this;
    this.listaBotonesVentanaToolbar = new LOG.util.List();
    this.listaBotonesPanel = new LOG.util.List();
    this.addButtonPanel("->");

    this.addButtonPanel(
      LOG.util.Prototipos.botonGuardar({
        text: config.idioma.lbBtnGuardar,
        tooltip: config.idioma.lbTtBtnGuardar,
        disabled: false,
        handler: function () {
          _this.salvarConfiguracion();
        },
      })
    );

    /*this.addToolbarButtonPanel(LOG.util.Prototipos.botonAdicionar({
            text : 'Crear configuraci\xf3n',
            tooltip : 'Crear configuraci\xf3n',
            handler: function () {
                var pForm = LOG.util.UIManager.initColumnForm({columnas : 2})
                pForm.addComponent( new LOG.util.ComboBox({
                    url : '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarComboTipoDocumento',
                    fieldLabel: 'Facturas',
                    hiddenName: 'recep_fact',
                    valueField: 'idnomoperaciones',
                    displayField: 'denominacion',
                    editable: true,
                    allowBlank: false,
                    anchor: '98%',
                }));
                pForm.addComponent(new LOG.util.ComboBox({
                    url : '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarComboTipoDocumento',
                    fieldLabel: 'Transferencias externas',
                    hiddenName: 'recep_trans_ext',
                    valueField: 'idnomoperaciones',
                    displayField: 'denominacion',
                    editable: true,
                    allowBlank: false,
                    anchor: '98%',
                }));
                pForm.addComponent( new LOG.util.ComboBox({
                    url : '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarComboTipoDocumento',
                    fieldLabel: 'Transferecias internas',
                    hiddenName: 'recep_trans_int',
                    valueField: 'idnomoperaciones',
                    displayField: 'denominacion',
                    editable: true,
                    allowBlank: false,
                    anchor: '98%',
                }));
                pForm.addComponent( new LOG.util.ComboBox({
                    url : '/logistica/inventario/entrada/entrada/index.php/recepcion/cargarComboTipoDocumento',
                    fieldLabel: 'Ordenes de produci\xf3n',
                    hiddenName: 'recep_prod',
                    valueField: 'idnomoperaciones',
                    displayField: 'denominacion',
                    editable: true,
                    allowBlank: false,
                    anchor: '98%',
                }));
                var fsetOpones = new Ext.form.FieldSet({
                    title: 'Operaciones de recepci\xf3n',
                    items: [pForm]
                });

                var fpConfiguracion = LOG.util.UIManager.initForm({
                    region: 'center',
                    style: '-moz-border-radius:20px',
                    bodyStyle: 'padding:10px 10px 0',
                    layout: 'form',
                    frame: true,
                    items: [fsetOpones]
                });
                var winConfig = LOG.util.UIManager.initWindow({
                    layout : 'border',
                    height : 230,
                    width : 420,
                    title : 'Configuraci\xf3n de sistema',
                    items : [fpConfiguracion],
                    buttons : [LOG.util.Prototipos.botonGuardar({
                        text: LOG.util.Idioma.lbBtnGuardar,
                        tooltip: LOG.util.Idioma.lbTtBtnGuardar,
                        disabled: false,
                        handler: function () {
                            fpConfiguracion.getForm().submit({
                                url: _this.urlController + 'escribirFicheroConf',
                                method: 'POST',
                                success: function () {
                                    Ext.getBody().unmask();
                                    mostrarMensaje(1, _this.idioma.lbMsgSalvarOk);
                                    winConfig.close();
                                },
                                failure: function () {
                                    Ext.getBody().unmask();
                                }
                            });
                        }
                    })]
                });
                winConfig.show();
            }
        }))*/

    this.addToolbarButtonPanel("->");

    this.addToolbarButtonPanel(
      new Ext.Button({
        id: "idconfiguracionalmacen",
        text: "Ayuda",
        iconCls: "ayuda",
      })
    );
    this.chCategoriaProducto = new Ext.form.Checkbox({
      boxLabel: config.idioma.lbCategoria,
      height: 40,
      name: "usarcategoria",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    this.chComprobanteOperaciones = new Ext.form.Checkbox({
      boxLabel: config.idioma.lbComprobante,
      height: 40,
      name: "comprobante",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    this.chFirmaDigital = new Ext.form.Checkbox({
      boxLabel: config.idioma.lbFirmadigital,
      height: 40,
      name: "firmadigital",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            // _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    this.chCantidadFactura = new Ext.form.Checkbox({
      boxLabel: config.idioma.lbCantidadFactura,
      height: 40,
      name: "registrarcantidad",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    this.chContIntegrada = new Ext.form.Checkbox({
      boxLabel: config.idioma.lbContIntegrada,
      height: 40,
      name: "contintegrada",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
      this.chFarmaciaIntegrada = new Ext.form.Checkbox({
          boxLabel: config.idioma.lbFarmaciaIntegrada,
          height: 40,
          name: "farmaciaintegrada",
          hideLabel: true,
          listeners: {
              check: function (_checkbox, checked) {
                  _checkbox.setRawValue(checked == true ? 1 : 0);
                  if (
                      _this.fpConfiguracion.getForm().isValid() &&
                      _this.fpConfiguracion.getForm().isDirty()
                  ) {
                      _this.listaBotonesPanel.arrayData[1].enable();
                  } else {
                      //  _this.listaBotonesPanel.arrayData[1].disable();
                  }
              },
          },
      });
    //existencia almacen nuevo
    this.chexistenciaAlmacen = new Ext.form.Checkbox({
      boxLabel: config.idioma.ckboxexistenciaalmacen,
      height: 40,
      name: "almacen",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    this.stTasa = new Ext.data.Store({
      autoLoad: true,
      url: "/logistica/inventario/configuracion/index.php/configuracioninventario/cargartipostasa",
      reader: new Ext.data.JsonReader(
        {
          id: "idtipotasa",
          root: "datos",
        },
        [{ name: "idtipotasa" }, { name: "nombretipotasa" }]
      ),
    });

    this.cmbTasa = new LOG.util.ComboBox({
      store: this.stTasa,
      fieldLabel: config.idioma.cmbTipoTasa,
      hiddenName: "idtipotasa",
      valueField: "idtipotasa",
      displayField: "nombretipotasa",
      editable: false,
      allowBlank: true,
      anchor: "20%",
      listeners: {
        select: function () {
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            // _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });

    this.cmbOrdenProducto = new LOG.util.ComboBox({
      store: new Ext.data.SimpleStore({
          fields:['ordenproducto','denomorden'],
          data: [[3,'Órden de inserción de los productos'],[2,'Ordenar por Denominación'],
                [1,'Ordenar por Código'],[4,'Ordenar por Código fabricante'],[5,'Ordenar por Naturaleza']]
      }),
      fieldLabel: config.idioma.cmbOrdenProducto,
      hiddenName: "ordenproducto",
      valueField: "ordenproducto",
      displayField: "denomorden",
      editable: false,
      allowBlank: true,
      hidden:(!_this.grantedAction("CFORDENPROD")),
      anchor: "20%",
      listeners: {
        select: function () {
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            // _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });
    //botones

    this.btnOrgano = new Ext.Button({
      iconCls: "organos",
      tooltip: config.idioma.ttOrganos,
      handler: function () {
        _this.stEstructura.load({ params: { organo: 1 } });
        //_this.salvarConfiguracion();
      },
    });
    this.btnEntidad = new Ext.Button({
      iconCls: "entidades",
      tooltip: config.idioma.ttEntidades,
      handler: function () {
        _this.stEstructura.load({ params: { entidad: 1 } });
        //_this.salvarConfiguracion();
      },
    });

    this.stEstructura = new Ext.data.Store({
      autoLoad: true,
      url: "/logistica/inventario/configuracion/index.php/configuracioninventario/obtenerEstructurasUMayor",
      reader: new Ext.data.JsonReader(
        {
          id: "idestructura",
          root: "datos",
        },
        [
          { name: "idestructura" },
          { name: "codigo" },
          { name: "denominacion" },
          { name: "coddenominacion" },
        ]
      ),
    });
    this.gridUnidadmayor = new Ext.grid.GridPanel({
      store: this.stEstructura,
      tbar: [this.btnOrgano, this.btnEntidad],
      loadMask: true,
      colModel: new Ext.grid.ColumnModel({
        defaults: {
          width: 285,
          sortable: true,
        },
        columns: [
          {
            header: "Codigo-denominacion",
            dataIndex: "coddenominacion",
            sortable: true,
          },
        ],
      }),
      sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
    });
    this.gridUnidadmayor.getSelectionModel().on({
      rowselect: function (sm, index, record) {
        _this.tcEstructura.setValue(record.data.coddenominacion);
        _this.hdEstructura.setValue(record.data.idestructura);
        win.hide();
      },
    });
    var win;
    this.tcEstructura = new Ext.form.TriggerField({
      fieldLabel: config.idioma.tfUnidadMayor,
      editable: true,
      anchor: "20%",
      name: "coddenominacion",
      listeners: {
        keyup: function (me) {
          if (_this.tcEstructura.getValue()) {
            me.onTriggerClick(false);
          }
          var valores = {};
          valores["start"] = 0;
          valores["limit"] = 3;
          valores["criterioB"] = _this.tcEstructura.getValue();
          _this.stEstructura.load({ params: valores });
        },
      },
      onTriggerClick: function (v) {
        if (!win) {
          win = new Ext.Window({
            header: false,
            closable: false,
            height: 180,
            width: _this.tcEstructura.getWidth(),
            layout: "fit",
            border: false,
            shadow: false,
            resizable: false,
            draggable: false,
            hideBorders: true,
            x: _this.tcEstructura.el.getXY()[0],
            y:
              _this.tcEstructura.el.getXY()[1] + _this.tcEstructura.getHeight(),
            items: [_this.gridUnidadmayor],
          });
        }
        if (v) {
          if (win.isVisible()) {
            win.hide();
          } else {
            win.show();
          }
        } else {
          win.show();
        }
      },
    });

    this.hdEstructura = new Ext.form.Hidden({
      name: "idpadre",
    });

    this.chTarjetaCombustible = new Ext.form.Checkbox({
      boxLabel: config.idioma.ckboxTarjetaCombustible,
      height: 40,
      name: "tarjeta",
      hideLabel: true,
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });

    this.chCerrarCDiarioConDif = new Ext.form.Checkbox({
      boxLabel: config.idioma.ckboxCuadreDiario,
      height: 40,
      name: "cuadrediario",
      hideLabel: true,
      hidden: (!_this.grantedAction("CFCDIARIODIF")),
      listeners: {
        check: function (_checkbox, checked) {
          _checkbox.setRawValue(checked == true ? 1 : 0);
          if (
            _this.fpConfiguracion.getForm().isValid() &&
            _this.fpConfiguracion.getForm().isDirty()
          ) {
            _this.listaBotonesPanel.arrayData[1].enable();
          } else {
            //  _this.listaBotonesPanel.arrayData[1].disable();
          }
        },
      },
    });

    //asignacion de los checkbox de ui
    this.panelCheckBox = new LOG.util.ColumnForm({ columnas: 1 });
    this.panelCheckBox.addComponent(this.chCategoriaProducto);
    this.panelCheckBox.addComponent(this.chComprobanteOperaciones);
    this.panelCheckBox.addComponent(this.chFirmaDigital);
    this.panelCheckBox.addComponent(this.chCantidadFactura);
    this.panelCheckBox.addComponent(this.chContIntegrada);
    this.panelCheckBox.addComponent(this.chexistenciaAlmacen);
    this.panelCheckBox.addComponent(this.chTarjetaCombustible);
    this.panelCheckBox.addComponent(this.chCerrarCDiarioConDif);
    this.panelCheckBox.addComponent(this.chFarmaciaIntegrada);

    this.minimomaximo = new LOG.util.Prototipos.inputDecimal({
      anchor: "40%",
      name: "minimo",
      // maxLength: '3',
      maxValue: 100,
      decimalPrecision: 2,
      disabled: false,
      fieldLabel: config.idioma.lbMinimo,
      allowBlank: true,
      maxLength: 100,
      maxLengthText: "El valor m&aacute;ximo para este campo es de 100.",
      regexText: "El valor m&aacute;ximo para este campo es de 100.",
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.fondofijo = new LOG.util.Prototipos.inputDecimal({
      anchor: "40%",
      name: "fondofijo",
      //maxLength: '3',
      maxValue: 100,
      decimalPrecision: 2,
      disabled: false,
      fieldLabel: config.idioma.lbFondoFijo,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLength: 100,
      maxLengthText: "El valor m&aacute;ximo para este campo es de 100.",
      regexText: "El valor m&aacute;ximo para este campo es de 100.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.reserva = new LOG.util.Prototipos.inputDecimal({
      anchor: "40%",
      name: "reserva",
      // maxLength: '3',
      maxValue: 100,
      decimalPrecision: 2,
      disabled: false,
      fieldLabel: config.idioma.lbReserva,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLengthText: "El valor m&aacute;ximo para este campo es de 100.",
      regexText: "El valor m&aacute;ximo para este campo es de 100.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.normaabast = new LOG.util.Prototipos.inputEntero({
      anchor: "40%",
      name: "normabast",
      maxValue: 365,
      disabled: false,
      fieldLabel: config.idioma.lbNormaAbast,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLengthText: "El valor m&aacute;ximo para este campo es de 365.",
      regexText: "El valor m&aacute;ximo para este campo es de 365.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.minimaarea = new LOG.util.Prototipos.inputDecimal({
      anchor: "40%",
      name: "minarea",
      maxValue: 100,
      decimalPrecision: 2,
      disabled: false,
      fieldLabel: config.idioma.lbMinimoArea,
      autoCreate: true,
      allowBlank: true,
      maxLengthText: "El valor m&aacute;ximo para este campo es de 100.",
      regexText: "El valor m&aacute;ximo para este campo es de 100.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.checkPuntoRepo = new Ext.form.Checkbox({
      fieldLabel: "",
      boxLabel: config.idioma.checkPuntoRepo,
      name: "ptoreposicion",
    });

    this.panelReaprovisionamiento = new LOG.util.ColumnForm({ columnas: 1 });
    this.panelReaprovisionamiento.addComponent(this.normaabast);
    this.panelReaprovisionamiento.addComponent(this.minimomaximo);
    this.panelReaprovisionamiento.addComponent(this.reserva);
    this.panelReaprovisionamiento.addComponent(this.fondofijo);
    this.panelReaprovisionamiento.addComponent(this.minimaarea);
    this.panelReaprovisionamiento.addComponent(this.checkPuntoRepo);

    this.diasconsig = new LOG.util.Prototipos.inputEntero({
      anchor: "40%",
      name: "diaconsignado",
      maxValue: 365,
      disabled: false,
      fieldLabel: config.idioma.lbdiasconsig,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLengthText: "El valor m&aacute;ximo para este campo es de 365.",
      regexText: "El valor m&aacute;ximo para este campo es de 365.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.diasminven = new LOG.util.Prototipos.inputEntero({
      anchor: "40%",
      name: "diaminvencido",
      maxValue: 365,
      disabled: false,
      fieldLabel: config.idioma.lbDiasMinVen,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLengthText: "El valor m&aacute;ximo para este campo es de 365.",
      regexText: "El valor m&aacute;ximo para este campo es de 365.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.diasminventarje = new LOG.util.Prototipos.inputEntero({
      anchor: "40%",
      name: "diamintarjeta",
      maxValue: 365,
      disabled: false,
      fieldLabel: config.idioma.lbDiasMinVenTarge,
      autoCreate: true,
      allowBlank: true,
      /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
      maxLengthText: "El valor m&aacute;ximo para este campo es de 365.",
      regexText: "El valor m&aacute;ximo para este campo es de 365.",
      enableKeyEvents: true,
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.diasprox = new LOG.util.Prototipos.inputEntero({
      anchor: "40%",
      name: "diaproxvencer",
      maxValue: 365,
      disabled: false,
      fieldLabel: config.idioma.lbDiasProx,
      autoCreate: true,
      allowBlank: true,
      enableKeyEvents: true,
      maxLengthText: "El valor m&aacute;ximo para este campo es de 365.",
      regexText: "El valor m&aacute;ximo para este campo es de 365.",
      listeners: {
        change: function (field, newValue, oldValue) {},
      },
    });

    this.checkLotesVens = new Ext.form.Checkbox({
      fieldLabel: "",
      boxLabel: config.idioma.checkLotesVens,
      name: "lotevencido",
    });

    this.panelAlertaAvisos = new LOG.util.ColumnForm({ columnas: 1 });
    this.panelAlertaAvisos.addComponent(this.diasconsig);
    this.panelAlertaAvisos.addComponent(this.diasminven);
    this.panelAlertaAvisos.addComponent(this.diasminventarje);
    this.panelAlertaAvisos.addComponent(this.diasprox);
    this.panelAlertaAvisos.addComponent(this.checkLotesVens);

    this.fsetReaprovisionamiento = new Ext.form.FieldSet({
      title: config.idioma.filsetIzq,
      anchor: "90%",
      collapsible: true,
      //collapsed:true,
      items: [this.panelReaprovisionamiento],
    });

    this.fsetAlertasAvisos = new Ext.form.FieldSet({
      title: config.idioma.filsetDer,
      anchor: "40%",
      collapsible: true,
      //collapsed:true,
      items: [this.panelAlertaAvisos],
    });

    this.clsSuperior = LOG.util.UIManager.initColumnForm(2);

    this.clsSuperior.addComponent(this.panelCheckBox);
    this.clsSuperior.addComponent(this.fsetReaprovisionamiento);

    this.panelValores = new LOG.util.ColumnForm({ columnas: 1 });
    this.panelValores.addComponent(this.cmbTasa);
    this.panelValores.addComponent(this.cmbOrdenProducto);
    this.panelValores.addComponent(this.tcEstructura);
    this.panelValores.addComponent(this.hdEstructura);

    this.clsInferior = LOG.util.UIManager.initColumnForm(2);
    this.clsInferior.addComponent(this.panelValores);
    this.clsInferior.addComponent(this.fsetAlertasAvisos);

    /*this.cmbSubordinacion = new LOG.util.ComboBox({
            fieldLabel: config.idioma.lbSubordinacioncb,
            valueField: 'idnomsubordinacion',
            displayField: 'denominacion',
            hiddenName: 'idnomsubordinacion',
            url: '/logistica/inventario/configuracion/index.php/configuracioninventario/obtenerSubordinaciones',
            allowBlank: false,
            editable: false,
            anchor: '10%',
            listeners: {
                'select': function () {
                    if (_this.fpConfiguracion.getForm().isValid() && _this.fpConfiguracion.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[1].enable();

                    } else {
                        //_this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
            }
        });
        this.chckbxParaEntidades = new Ext.form.Checkbox({
            name: 'usarentidades',
            boxLabel: config.idioma.ckboxTodasentidades,
            anchor: '40%',
            listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    if (_this.fpConfiguracion.getForm().isValid() && _this.fpConfiguracion.getForm().isDirty()) {
                        _this.listaBotonesPanel.arrayData[1].enable();
                    } else {
                       // _this.listaBotonesPanel.arrayData[1].disable();
                    }
                }
            }
        });

        this.clsSubordinacion.addComponent(this.cmbSubordinacion);
        this.clsSubordinacion.addComponent(this.chckbxParaEntidades);
        
        this.fsetSubordinacion = new Ext.form.FieldSet({
            title: config.idioma.lbSubordinacionDespacho,
            anchor: '40%',
            items: [this.clsSubordinacion]
        });*/

    config.panelConfiguracion = LOG.util.UIManager.initPanel({
      region: "center",
      labelAlign: "top",
      layout: "form",
      items: [
        /*this.panelCheckBox,*/ this.clsSuperior,
        this
          .clsInferior /*this.cmbTasa,this.tcEstructura,this.hdEstructura, this.fsetSubordinacion,  this.fsDescuentoRecargoComercial*/,
      ],
    });

    config.fpConfiguracion = LOG.util.UIManager.initForm({
      region: "center",
      style: "-moz-border-radius:20px",
      bodyStyle: "padding:10px 10px 0",
      layout: "form",
      items: [
        config.panelConfiguracion,
        //                , {
        //                xtype: 'hidden',
        //                name: 'descuentorecargo',
        //                id: 'idhdescuentorecargo',
        //                value: 0
        //            }
      ],
    });

    config.layout = "border";
    config.items = [
      {
        region: "north",
        tbar: [this.listaBotonesVentanaToolbar.getArray()],
      },
      {
        region: "center",
        frame: true,
        autoScroll: true,
        items: [config.fpConfiguracion],
      },
      {
        region: "south",
        tbar: [this.listaBotonesPanel.getArray()],
      },
    ];
    document.onkeyup = function (e) {
      if (e.altKey) {
        if (e.which == Ext.EventObject.G) {
          _this.salvarConfiguracion();
        }
      }
    };

    Ext.erp.configuracioninventario.superclass.constructor.call(this, config);
    _this.on({
      show: function () {
        _this.stTasa.load({
          callback: function () {
            _this.cargarConfiguracionInicial();
          },
        });
      },
      close: function () {
        win.hide();
      },
    });
  },

  addToolbarButtonPanel: function (b, f) {
    this.listaBotonesVentanaToolbar.add(
      LOG.util.UIManager.reconfigureButton(b)
    );
  },
  addButtonPanel: function (b, f) {
    this.listaBotonesPanel.add(LOG.util.UIManager.reconfigureButton(b));
  },
  grantedAction: function (idAccion) {
    var existe = false;
    Ext.each(acciones_reportes, function (a) {
      if (a["abreviatura"] == idAccion) {
        existe = true;
      }
    });
    return existe;
  },
  cargarConfiguracionInicial: function () {
    var _this = this;
    Ext.getBody().mask(_this.idioma.lbCargandoCfg);
    Ext.Ajax.request({
      url: _this.urlController + "caragrconfiguracion",
      method: "POST",
      callback: function (opt, scs, resp) {
        Ext.getBody().unmask();
        if (scs) {
          aux = Ext.decode(resp.responseText);
          var record = {
            data: aux.datos,
          };
          if (record.data.cantidadmoneda <= 1) {
            _this.cmbTasa.allowBlank = true;
          }
          /*if (record.data.idnomsubordinacion == 0) {
                        record.data.idnomsubordinacion = null;
                    }
                    if (record.data.todasentidades == 1 && record.data.idestructuraseleccionada == record.data.idestructuracomun) {
                        _this.chckbxParaEntidades.enable();
                        _this.cmbSubordinacion.enable();

                    } else if (record.data.todasentidades == 1) {
                        _this.chckbxParaEntidades.disable();
                        _this.cmbSubordinacion.disable();
                    }*/

          //                    Ext.getCmp('idhdescuentorecargo').setValue(aux.datos.descuentorecargo);
          //                    if (aux.datos.descuentorecargo == 1) {
          //                        _this.rdEfectivo.setValue(true);
          //                    }

          //                    else {
          //                        _this.rdPorcentual.setValue(true);
          //                    }
          _this.fpConfiguracion.getForm().loadRecord(record);
        }
        // _this.listaBotonesPanel.arrayData[1].disable();
      },
    });
  },
  salvarConfiguracion: function () {
    var _this = this;
    var fp = _this.fpConfiguracion.getForm();
    //_this.cmbSubordinacion.enable();
    if (!fp.isValid()) {
      mostrarMensaje(3, _this.idioma.lbMsgCamposVacios);
      return;
    }
    Ext.getBody().mask(_this.idioma.lbMsgSalvandoCfg);
    console.debug(fp);
    fp.submit({
      url: _this.urlController + "salvarconfiguracion",
      method: "POST",
      success: function () {
        Ext.getBody().unmask();
        mostrarMensaje(1, _this.idioma.lbMsgSalvarOk);
        _this.cargarConfiguracionInicial();
      },
      failure: function () {
        Ext.getBody().unmask();
      },
    });
  },
});

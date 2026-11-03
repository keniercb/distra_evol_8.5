Ext.ns("Ext.erp");
Ext.erp.configuracionbalanceo = Ext.extend(LOG.util.Panel, {
  constructor: function (config) {
    var _this = this;
    this.frame = true;
    this.doFocus = true;
    this.layout = "border";
    this.panelEste = this.crearPanelEste();
    var cmpBalanceo = new Ext.erp.configuracionbalanceoCmp({
      busquedaAvanzada: false,
      idioma: {},
      panelEste: _this.panelEste[0],
      gridEste: _this.panelEste[1],
    });
    cmpBalanceo.init();
    let cmp = cmpBalanceo.view();
    _this.items = [cmp];
    Ext.erp.configuracionbalanceo.superclass.constructor.call(_this, config);
    cmpBalanceo.getGridPrincipal().getSelectionModel().fireEvent = cmpBalanceo
      .getGridPrincipal()
      .getSelectionModel()
      .fireEvent.createSequence(function (e) {
        if (
          e == "selectionchange" &&
          cmpBalanceo.getGridPrincipal().getSelectionModel().getSelections()
            .length == 1
        ) {
          let identidad = cmpBalanceo
            .getGridPrincipal()
            .getSelectionModel()
            .getSelections()[0].json.iddeposito;
          _this.panelEste[1].getStore().initBaseParams.idestructuracomun =
            identidad;
          _this.panelEste[1].getStore().load();
        }
      });
  },
  crearPanelEste: function () {
    var _this = this;

    var columnas = new LOG.util.List();

    columnas.add({
      dataIndex: "idclasificacioncontable",
      default: true,
    });

    columnas.add({
      dataIndex: "idcuenta",
      default: true,
    });

    columnas.add({
      dataIndex: "idconfdeposito",
      default: true,
    });

    columnas.add({
      xtype: "checkcolumn",
      header: "Cuadre",
      dataIndex: "activo",
      default: true,
      width: 50,
      align: "center",
      type: "bool",
    });

    columnas.add({
      header: "Clasificaci\xf3n contable",
      dataIndex: "denominacion",
      default: true,
      width: 95,
      id: "idExpandGrid",
    });

    columnas.add({
      header: "Cuenta",
      dataIndex: "concatcta",
      default: true,
      width: 95
    });

    
    this.smGridClasificaciones = LOG.util.UIManager.initSelectionModel(
      3,
      false
    );

    var cls = LOG.util.UIManager.proccessColumns(columnas, null);
    this.cmGridClasificaciones = new Ext.grid.ColumnModel(cls.columns);

    var recStGridClasificaciones = Ext.data.Record.create(cls.fields);
    this.storeClasificaciones = new Ext.data.Store({
      //autoLoad: true,
      url: "/logistica/distribucion/configuracion/index.php/configuracionbalanceo/cargarClasificaciones",
      reader: new Ext.data.JsonReader(
        {
          id: "idclasificaciones",
          root: "datos",
        },
        recStGridClasificaciones
      ),
      listeners: {
        beforeload: function (st) {
          //st.initBaseParams.agrupacion = 1;
        },
        load: function (st) {},
      },
    });

    this.gpClasificaciones = LOG.util.UIManager.initEditableGridPanel(
      this.cmGridClasificaciones,
      this.storeClasificaciones,
      this.smGridClasificaciones,
      { nobbar: false, expanded: true, autoExpandColumn: "idExpandGrid" }
    );
    this.panelClasificaciones = LOG.util.UIManager.initPanel({
      region: "east",
      layout: "border",
      //collapsible: true,
      //collapseMode: 'mini',
      //collapsed: true,
      width: 400,
      title: "Clasificaciones contables",
      split: true /*,
            listeners: {
                expand: function(p) {
                    p.setWidth(_this.getPanelGrid().getSize().width / 2);
                }
            }*/,
    });
    this.cmBusqueda = new LOG.util.Prototipos.inputTexto({
      maxLength: 100,
      emptyText: "Criterio a buscar",
      anchor: "100%",
      enableKeyEvents: true,
      listeners: {
        keyup: function (i, e) {
          if (e.getKey() == 13) {
            _this.botonBuscar();
          }
        },
      },
    });
    this.btnBuscar = LOG.util.Prototipos.botonBuscar({
      tooltip: "Buscar <b>(Alt + B)</b>",
      handler: function () {
        _this.botonBuscar();
      },
    });
    this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({
      tooltip: "Limpiar filtro <b>(Alt + L)</b>",
      handler: function () {
        _this.botonLimpiar();
      },
    });
    /* this.gpClasificaciones
      .getTopToolbar()
      .add([this.cmBusqueda, "-", this.btnBuscar, this.btnLimpiar]); */
    this.panelClasificaciones.add(this.gpClasificaciones);
    return [this.panelClasificaciones, this.gpClasificaciones];
  },
  botonBuscar: function () {
    let _this = this;
    if (_this.panelEste[1].getStore().baseParams.idestructuracomun) {
      _this.panelEste[1].getStore().reload({
        params: {
          denominacion: this.cmBusqueda.getValue(),
        },
      });
    }
  },
  botonLimpiar: function () {
    let _this = this;
    if (_this.panelEste[1].getStore().baseParams.idestructuracomun) {
      _this.panelEste[1].getStore().reload({
        params: {
          denominacion: "",
        },
      });
    }
  },
});

Ext.erp.configuracionbalanceoCmp = Ext.extend(LOG.util.UITemplate, {  
  autoSelect: false,
  autoLoad: false,
  parametros: undefined,
  constructor: function (config) {
    this.formaVisualizacion = "panel";
    this.modoSeleccion = 1;
    this.gridEditable = true;
    this.busquedaBasica = true;
    this.panelBotonesVisible = true;
    this.autoShow = false;
    this.concepto = config.idioma.lbconcepto;
    this.urlBusquedaGridPrincipal = "cargaralmacenes";
    this.autoLoad = true;
    this.dirController =
      "/logistica/distribucion/configuracion/index.php/configuracionbalanceo";
    this.parametros = {
      start: 0,
      limit: 30,
    };
    this.postActions = config.postActions;
    Ext.erp.configuracionbalanceoCmp.superclass.constructor.call(this, config);
  },
  initDefaultColumns: function () {
    var _this = this;

    this.addGridColumn({
      header: "Entidad",
      dataIndex: "entidad",
      default: true,
      width: 220,
      filter: {
        type: "string",
        dataIndex: "entidad",
      },
    });

    this.addGridColumn({
      header: "Depósito",
      //autoExpand: true,
      width: 350,
      dataIndex: "deposito",
      default: true,
      filter: {
        type: "string",
        dataIndex: "deposito",
      },
    });

    this.addGridColumn({
      xtype: "checkcolumn",
      header: "Excluir balanceo",
      dataIndex: "excluido",
      width: 90,
      align: "center",
      type: "bool",
      filter: {
        type: "list",
        options: [
          ["si", "Si"],
          ["no", "No"],
        ],
        dataIndex: "excluido",
      },
    });

    this.addGridColumn({
      //xtype: "checkcolumn",
      header: "Cuadre diario",
      dataIndex: "cuadrediario",
      width: 85,
      align: "center",
      //type: "bool",
      default: true,
      renderer: function (value, metaData) {
        metaData.css =
          value == 1 ? "icondistra-aceptar verde" : "icondistra-aceptar rojo";
        metaData.attr = value == 1 ? 'ext:qtip="Si"' : 'ext:qtip="No"';
      } /* 
      filter: {
        type: "list",
        options: [
          ["si", "Si"],
          ["no", "No"],
        ],
        dataIndex: "cuadrediario",
      }, */,
    });
      this.addGridColumn({
          xtype: "checkcolumn",
          header: "Publicar",
          dataIndex: "publico",
          width: 90,
          align: "center",
          type: "bool",
          filter: {
              type: "list",
              options: [
                  ["si", "Si"],
                  ["no", "No"],
              ],
              dataIndex: "publico",
          },
      });
    this.addGridColumn({ dataIndex: "iddeposito" });
    this.addGridColumn({ dataIndex: "idestructura" });
  },
  initDefaultButtons: function () {
    var _this = this;
    _this.addToolbarButton(
      LOG.util.Prototipos.botonGuardar({
        hidden: false,
        disabled: false,
        handler: _this.guardar.bind(_this),
      })
    );
    _this.addToolbarButton(
      LOG.util.UIManager.createBtn({
        text: "Carga inicial",
        tooltip: "Guardar saldos iniciales",
        iconCls: "cargainicial",
        //hidden: true,
        isContextual: true,
        handler: _this.cargainicial.bind(_this),
      })
    );
  },
  guardar: function () {
    var _this = this;
    var datos = _this.getStorePrincipal().getModifiedRecords();
    console.info(datos);
    var entSelecionadas = _this
      .getGridPrincipal()
      .getSelectionModel()
      .getSelections();
    const clasifSelected = [];

    var array = [];
    for (var index = 0; index < datos.length; index++) {
      var obj = {
        iddeposito: datos[index].data.iddeposito,
        idestructura: datos[index].data.idestructura,
        excluido: datos[index].data.excluido,
        cuadrediario: datos[index].data.cuadrediario,
        publico: datos[index].data.publico,
      };
      array[index] = obj;
    }

    if (entSelecionadas.length > 0) {
      let clasificaciones = _this.gridEste.store.data;
      /* console.info(clasifChequeadas);
      console.info(_this.gridEste.store); */
      //let clasifSelecionadas = clasifChequeadas.length > 0 ? clasifChequeadas : clasifSelected;

      var iddeposito = entSelecionadas[0].data.iddeposito;
      var idestructura = entSelecionadas[0].data.idestructura;
      //let denomEntidades = [];
      if (entSelecionadas.length > 0 && clasificaciones.length > 0) {
        //denomEntidades.push(entSelecionadas[0].json.entidad);
        /* entSelecionadas.forEach((el) => {
          flag = entidad != el.json.idestructura && flag == false ? true : flag;
           if (flag == true) {
            denomEntidades.push(el.json.entidad);
          } 
          entidades.push(el.data.iddeposito);
        }); */
        clasificaciones.items.forEach((el) => {
          if (el.data.activo == true){
            let item = {
              idclasificacioncontable:el.data.idclasificacioncontable, 
              idcuenta:el.data.idcuenta
            };
            clasifSelected.push(item);
          }
        });
      }
    }

    ///if (flag == false) {
    Ext.Ajax.request({
      url: _this.dirController + "/guardarconf",
      params: {
        datos: Ext.encode(array),
        iddeposito: iddeposito,
        idestructura: idestructura,
        clasifSelecionadas: Ext.encode(clasifSelected),
      },
      success: function () {
        mostrarMensaje(
          1,
          "La configuración ha sido guardada satisfactoriamente."
        );
        _this.getStorePrincipal().commitChanges();
        //_this.getStorePrincipal().reload();
        _this.gridEste.store.commitChanges();
        //_this.gridEste.store.reload();
      },
      failure: function () {
        mostrarMensaje(3, "Ha ocurrido un error al guardar la configuración.");
        _this.getStorePrincipal().reload();
        _this.gridEste.store.reload();
      },
    });
    /*}  else {
      const dEntidades = new Set(denomEntidades);
      let result = [...dEntidades];
      mostrarMensaje(
        3,
        "Ha ocurrido un error al guardar la configuración. No puede seleccionar entidades diferentes. <b>(" +
          result.toString() +
          ")</b>"
      );
    } */
  },
  cargainicial: function () {
    var _this = this;
    Ext.MessageBox.wait(
      "Guardando saldos iniciales",
      _this.idioma.msgEspere || "..."
    );
    Ext.Ajax.request({
      url: _this.dirController + "/guardarcargainicial",
      params: {},
      success: function () {
        Ext.MessageBox.hide();
        mostrarMensaje(
          1,
          "La carga inicial se ha realizado satisfactoriamente."
        );
        _this.getStorePrincipal().commitChanges();
        //_this.getStorePrincipal().reload();
        _this.gridEste.store.commitChanges();
        //_this.gridEste.store.reload();
      },
      failure: function () {
        Ext.MessageBox.hide();
        mostrarMensaje(3, "Ha ocurrido un error al guardar la carga inicial.");
        _this.getStorePrincipal().reload();
        _this.gridEste.store.reload();
      },
    });
    /*}  else {
      const dEntidades = new Set(denomEntidades);
      let result = [...dEntidades];
      mostrarMensaje(
        3,
        "Ha ocurrido un error al guardar la configuración. No puede seleccionar entidades diferentes. <b>(" +
          result.toString() +
          ")</b>"
      );
    } */
  },
  init: function () {
    var _this = this;
    Ext.erp.configuracionbalanceoCmp.superclass.init.call(this);
    this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function () {
        _this.getPanelPrincipal().add(_this.getPanelSur());

        _this.getGridPrincipal().getSelectionModel().on('rowselect', function (sm, index, r) {

            if (_this.getSmPrincipal().getSelections().length == 1) {
                _this.panelSur.expand();
                _this.storeSur.load();
            } else {
                _this.storeSur.removeAll();
            }
        });
        _this.getGridPrincipal().getSelectionModel().on('rowdeselect', function (sm, index, r) {
            if (_this.getSmPrincipal().getSelections().length != 1) {
                _this.storeSur.removeAll();
            } else {
                _this.storeSur.load();
            }
        });

        if (typeof _this.btnAddNaturaleza.controlFn == 'function') {
            _this.btnAddNaturaleza.controlFn.createDelegate(_this, [_this.btnAddNaturaleza, _this]).call();
        }
        if (typeof _this.btnDelNaturaleza.controlFn == 'function') {
            _this.btnDelNaturaleza.controlFn.createDelegate(_this, [_this.btnDelNaturaleza, _this]).call();
        }
    });
    LOG.util.UIManager.apply(this.getVistaPrincipal(), {
      onShow: function () {
        LOG.util.UIManager.apply(
          _this.getStorePrincipal().initBaseParams,
          _this.parametros
        );
        _this.onShowHandler();
      },
      aceptarFn: function (aplicar) {
        if (typeof _this.doAction == "function") {
          _this.doAction
            .createDelegate(_this, [
              _this.getStorePrincipal().getModifiedRecords(),
              aplicar,
            ])
            .call();
        }
      },
    });

    this.panelGrid = LOG.util.UIManager.initFocusPanel({
      region: "center",
      layout: "border",
    });
    if (this.panelEste) {
      this.getPanelPrincipal().add(this.panelEste);
    }
  },
  onShowHandler: function () {
    LOG.util.UIManager.apply(
      this.getStorePrincipal().initBaseParams,
      this.parametros
    );
    this.getStorePrincipal().reload();
  },
  doAction: function (r, aplicar) {
    var _this = this;

    var accionesCheckColumns = [];
    Ext.each(r, function (rec) {
      if (rec.data.excluido === "0") rec.data.excluido = false;
      if (rec.data.excluido === "1") rec.data.excluido = true;
      var excluido = rec.data.excluido ? 1 : 0;

      if (rec.data.cuadrediario === "0") rec.data.cuadrediario = false;
      if (rec.data.cuadrediario === "1") rec.data.cuadrediario = true;
      let cuadrediario = rec.data.cuadrediario ? 1 : 0;

      if (rec.data.publico === "0") rec.data.publico = false;
      if (rec.data.publico === "1") rec.data.publico = true;
      let publico = rec.data.publico ? 1 : 0;


        if (
        excluido != rec.json.excluido ||
        (cuadrediario != rec.json.cuadrediario) == 0 ||
        publico != rec.json.publico
      ) {
        var isNew = 0;
        if (rec.json.excluido == 0 || rec.json.cuadrediario == 0 || rec.json.publico == 0) {
          isNew = 1;
        }

        var objMPM = {
          idalmacen: rec.data.iddeposito,
          excluido: excluido,
          cuadrediario: cuadrediario,
          publico: publico,
          isNew: isNew,
        };
        accionesCheckColumns.push(objMPM);
      }
    });

    if (accionesCheckColumns.length > 0) {
      Ext.Ajax.request({
        url: "/logistica/distribucion/configuracion/index.php/configuracionbalanceo/guardarconf",
        params: {
          acciones: Ext.encode(accionesCheckColumns),
        },
        callback: function (opt, scs, resp) {
          if (resp.statusText == "OK") {
            mostrarMensaje(1, _this.idioma.lbMsgDepConfOk);
          } else {
            mostrarMensaje(3, _this.idioma.lbMsgDepConfError);
          }
          _this.getStorePrincipal().commitChanges();
          _this.getStorePrincipal().reload();
          _this.postSalvar();
        },
      });
    }
  },
  postSalvar: function (r, a, _idselecc) {
    this.postActions();
  },
  getPanelSur: function() {
      let _this = this;
      this.btnAddNaturaleza = LOG.util.Prototipos.botonAdicionar({
          text: 'Adicionar',
          tooltip: 'Adicionar naturalezas a publicar del dep\xf3sito seleccionado',
          disabled: true,
          handler: function () {
              let win = new Ext.erp.configuracionbalanceo.Naturaleza({ idioma: _this.idioma, iddeposito: _this.getSmPrincipal().getSelected().json.iddeposito,
                  _parent: _this});
              win.init();
              win.view();
          },
          controlFn: function (btn, called) {
              /*if (called.grantedAction('CT') || called.grantedAction('RNat')) {
                  btn.show();*/
                  btn.disable();
                  _this.getSmPrincipal().fireEvent = _this.getSmPrincipal().fireEvent.createSequence(function (e) {
                      var seleccion = _this.getGridPrincipal().getSelectionModel().getSelections();
                      if (e == "selectionchange") {
                          if (seleccion.length == 1) {
                              btn.enable();
                          } else {
                              btn.disable();
                          }
                      }
                  });
              /*} else {
                  btn.hide();
              }*/
          }
      });
      this.btnDelNaturaleza = LOG.util.Prototipos.botonEliminar({
          disabled: true,
          idioma: this.idioma,
          tooltip: 'Eliminar naturalezas publicadas del dep\xf3sito seleccionado',
          handler: function() {
              mostrarMensaje(2, '\xbfEst\xe1 seguro que desea eliminar las naturalezas seleccionadas\x3f', function(btn, text) {
                  if (btn === 'ok') {
                      let seleccion = _this.smGridSur.getSelections();
                      let naturalezas = new Array();
                      Ext.each(seleccion, function(recd) {
                          naturalezas.push(recd.data.iddepositonaturaleza);
                      });
                      Ext.MessageBox.wait('Eliminando naturalezas', _this.idioma.msgEspere);
                      var objSubmit = {
                          naturalezas: Ext.encode(naturalezas)
                      };
                      Ext.Ajax.request({
                          url: _this.dirController+'/eliminarNaturalezas',
                          method: 'POST',
                          params: objSubmit,
                          callback: function (o, s, r) {
                              Ext.MessageBox.hide();
                              var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                              if (resp.success && resp.codigoMsg == 1) {
                                  mostrarMensaje(resp.codigoMsg, 'Las naturalezas han sido eliminadas satisfactoriamente');
                                  _this.storeSur.load();
                                  if (typeof _fn == 'function') {
                                      _fn.createDelegate(this, [resp.datos]).call();

                                  }
                              }
                          }.createDelegate(this)
                      });
                  }
              });
          },
          controlFn: function (btn, called) {
              /*if (called.grantedAction('CT') || called.grantedAction('RDelNat')) {
                  btn.show();*/
                  btn.disable();
                  _this.smGridSur.fireEvent = _this.smGridSur.fireEvent.createSequence(function (e) {
                      var seleccion = _this.smGridSur.getSelections();
                      if (e == "selectionchange") {
                          if (seleccion.length > 0) {
                              btn.enable();
                          } else {
                              btn.disable();
                          }
                      }
                  });
              /*} else {
                  btn.hide();
              }*/
          }
      });
      this.panelSur = LOG.util.UIManager.initPanel({
          region: 'south',
          title: 'Naturalezas',
          border: true,
          layout: 'border',
          collapsible: true,
          collapsed: true,
          split: true,
          tbar: ['-', this.btnAddNaturaleza, this.btnDelNaturaleza],
          listeners: {
              expand: function (p) {
                  p.setHeight(_this.getPanelPrincipal().getHeight() / 2);
              }
          }
      });
      this.pnGrid = LOG.util.UIManager.initFocusPanel({
          region: 'center',
          layout: 'border'
      });

      this.columnasSur = new LOG.util.List();
      this.columnasSur.add({
          dataIndex: 'iddepositonaturaleza'
      });
      this.columnasSur.add({
          dataIndex: 'idnaturaleza'
      });
      this.columnasSur.add({
          dataIndex: 'iddeposito'
      });
      this.columnasSur.add({
          header: 'C\xf3digo',
          dataIndex: 'codigo',
          width: 200,
          default: true
      });
      this.columnasSur.add({
          header: 'Denominaci\xf3n',
          dataIndex: 'denominacion',
          width: 350,
          autoExpand: true,
          default: true
      });

      this.smGridSur = LOG.util.UIManager.initSelectionModel(3, false);

      var cls = LOG.util.UIManager.proccessColumns(this.columnasSur, this.smGridSur);
      this.cmGridSur = new Ext.grid.ColumnModel(cls.columns);
      this.recStGridSur = Ext.data.Record.create(cls.fields);

      this.storeSur = new Ext.data.Store({
          //autoLoad: true,
          url: '/logistica/distribucion/configuracion/index.php/configuracionbalanceo/devolverNaturalezasByDeposito',
          reader: new Ext.data.JsonReader({
              id: "iddepositonaturaleza",
              root: "datos"
          }, this.recStGridSur),
          listeners: {}
      });

      this.storeSur.on({
          'beforeload': function () {
              _this.storeSur.baseParams.iddeposito = _this.getSmPrincipal().getSelected().data.iddeposito;
              _this.storeSur.initBaseParams.iddeposito = _this.getSmPrincipal().getSelected().data.iddeposito;
          }
      });

      this.gpSur = LOG.util.UIManager.initEditableGridPanel(this.cmGridSur, this.storeSur, this.smGridSur, {nobbar: false});

      this.gridFilter = new LOG.util.GridFilter({
          grid: _this.gpSur,
          concepto: '',
          searchTipText: ''
      });

      this.pnGrid.add(this.gpSur);
      this.panelSur.add(this.pnGrid);

      return this.panelSur;

  }
});

Ext.ux.grid.CheckColumn = Ext.extend(Ext.grid.Column, {
  processEvent: function (name, e, grid, rowIndex, colIndex) {
    if (name == "mousedown") {
      var record = grid.store.getAt(rowIndex);
      record.set(this.dataIndex, !record.data[this.dataIndex]);
      return false;
    } else {
      return Ext.grid.ActionColumn.superclass.processEvent.apply(
        this,
        arguments
      );
    }
  },
  renderer: function (v, p, record) {
    p.css += " x-grid3-check-col-td";
    return String.format(
      '<div class="x-grid3-check-col{0}">&#160;</div>',
      v ? "-on" : ""
    );
  },
  init: Ext.emptyFn,
});
Ext.preg("checkcolumn", Ext.ux.grid.CheckColumn);
Ext.grid.CheckColumn = Ext.ux.grid.CheckColumn;
Ext.grid.Column.types.checkcolumn = Ext.ux.grid.CheckColumn;

Ext.erp.configuracionbalanceo.Naturaleza = Ext.extend(LOG.util.UITemplate, {
    dirController: "/logistica/distribucion/configuracion/index.php/configuracionbalanceo",
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarNaturalezas',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function (config) {
        let _this = this;
        this.formaVisualizacion = 'ventana';
        this.urlBusquedaGridPrincipal = 'cargarNaturalezas';
        this.autoLoad = false;
        this.autoSelect = false;
        this.gridEditable = true;
        this.iddeposito = config.iddeposito;
        this._parent = config._parent;
        this.busquedaBasica = true;
        Ext.erp.configuracionbalanceo.Naturaleza.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = 'Naturalezas';
        this.getVistaPrincipal().width = 500;
        this.getVistaPrincipal().height = 300;
        //this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.getVistaPrincipal().listaBotones.getItem(1).handler = function () {
            Ext.MessageBox.wait('Salvando los datos...', "Por favor espere...");
            let seleccionados = _this.getGridPrincipal().getSelectionModel().getSelections();
            let data = new Array();
            Ext.each(seleccionados, function(recd) {
                data.push(recd.data);
            });
            Ext.Ajax.request({
                url: _this.dirController+'/guardarNaturalezas',
                method: 'POST',
                params: {
                    data: Ext.encode(data),
                    iddeposito: _this.iddeposito
                },
                success: function (o, s, r) {
                    Ext.MessageBox.hide();
                    mostrarMensaje(1, 'Los datos han sido guardados satisfactoriamente');
                    _this.getStorePrincipal().reload();
                    _this._parent.storeSur.load();
                }
            });
        }
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({ dataIndex: 'idnaturaleza' });
        this.addGridColumn({
            header: 'C\xf3digo',
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: 'Denominaci\xf3n',
            autoExpand: true,
            dataIndex: 'denominacion',
            default: true
        });


    },
    render: function () {
        var _this = this;
        var render = Ext.erp.configuracionbalanceo.Naturaleza.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function () {
                this.baseParams.iddeposito = this.initBaseParams.iddeposito = _this.iddeposito;
            }
        });
        this.getStorePrincipal().load();
        return render;
    }
});
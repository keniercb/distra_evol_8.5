Ext.ns("LOG.lb.producto");
LOG.lb.producto.View = Ext.extend(LOG.util.UITemplate, {
  /**
   *
   */
  autoSelect: false,
  /**
   *
   */
  usarFiltroArea: true,
  busquedaAvanzada: true,
  mostrarCategoria: true,
  autoExpand: false,
  concepto: "producto(s)",
  autoLoad: false,
  gridEditable: true,
  /*
   * Usar la columna de marca y modelo
   */
  usarMarcaModelo: false,
  /**
   *
   * @type type
   */
  usarFiltroDeposito: false,
  parametros: undefined,
  idGridPrincipal: "idproducto",
  /**
   *
   * @param {type} config
   * @returns {undefined}
   */
  constructor: function (config) {
    this.formaVisualizacion = "ventana";
    this.modoSeleccion = 3;
    this.busquedaBasica = true;
    this.panelBotonesVisible = false;
    this.autoShow = false;
    this.urlBusquedaGridPrincipal =
      config.urlBusquedaGridPrincipal || "cargarproductos";
    this.widthAvanzada = "37%";
    this.dirController =
      config.dirController || "/logistica/utiles/producto/index.php/producto";
    config.idioma = LOG.lb.producto.Idioma;
    this.textBusquedaSimple = config.idioma.texBusqueda;
    LOG.lb.producto.View.superclass.constructor.call(this, config);
  },
  /**
   * Inicializa los botones de la interfaz.
   * @returns {undefined}
   */
  initDefaultButtons: function () {
    this.addToolbarButton("->");
    this.addToolbarButton(
      LOG.util.Prototipos.botonAyuda({
        referencia: "/logistica/utiles/producto/index.php/producto/producto",
        id: "idCrearTarjeta",
      })
    );
  },
  columnaCategoria: function () {
    return (
      typeof usarCategoria !== "undefined" &&
      usarCategoria == true &&
      this.mostrarCategoria !== false
    );
  },
  /**
   * Inicializa las columnas del grid de la ventana.
   * @returns {undefined}
   */
  initDefaultColumns: function () {
    var _this = this;
    let isFarmacia = typeof farmacia !== "undefined" && farmacia == 1;

    this.addGridColumn({
      header: "Imagen",
      width: 40,
      dataIndex: "imagen",
      default: true,
      renderer: function (value, metaData, record) {
        if (record.json.imagen) {
          return '<button class="icondistra-aceptar verde" style="background: transparent;border:none"></button>';
        }
        return '<button class="icondistra-cancelar rojo" style="background: transparent;border:none"></button>';
      }
    });

    if (typeof CODIGO_PRODUCTO === "undefined") {
      this.addGridColumn({
        header: this.idioma.cgCodigo,
        width: 120,
        dataIndex: "codigo",
        default: true,
        filter: {
          type: "string",
          emptyText: this.idioma.cgCodigo,
          dataIndex: "codigo",
        },
      });

      this.addGridColumn({
        header: this.idioma.cgCodProveedor,
        width: 130,
        dataIndex: "codigoproveedor",
        default: true,
        filter: {
          type: "string",
          emptyText: this.idioma.cgCodProveedor,
          dataIndex: "codigoproveedor",
        },
      });
    } else {
      this.addGridColumn({
        header: this.idioma.cgCodigo,
        width: 120,
        dataIndex: CODIGO_PRODUCTO == 1 ? "codigo" : "codigoproveedor",
        default: true,
        filter: {
          type: "string",
          emptyText:
            CODIGO_PRODUCTO == 1
              ? this.idioma.cgCodigo
              : this.idioma.cgCodProveedor,
          dataIndex: CODIGO_PRODUCTO == 1 ? "codigo" : "codigoproveedor",
        },
      });
    }
    if(isFarmacia == 1) {
        this.addGridColumn({
            header: 'Nº. lote',
            width: 200,
            dataIndex: "numerolote",
            default: true
        });

        this.addGridColumn({
            header: 'Fecha vencimiento lote',
            width: 200,
            dataIndex: "fechavencelote",
            default: true
        });
    }
    this.addGridColumn({
      header: this.idioma.cgDenominacion,
      width: 250,
      dataIndex: "denominacion",
      default: true,
      filter: {
        type: "string",
        emptyText: this.idioma.cgDenominacion,
        dataIndex: "denominacion",
      },
    });
    if (isFarmacia == 1) {
      this.addGridColumn({
        header: this.idioma.cgDescripcionV,
        width: 200,
        dataIndex: "descripcionventa",
        default: true,
        filter: {
          type: "string",
          emptyText: this.idioma.cgDenominacion,
          dataIndex: "descripcionventa",
        },
      });

      this.addGridColumn({
        header: this.idioma.lbLineaProducto,
        width: 120,
        dataIndex: "naturaleza",
        agrupador: true,
        default: true,
      });
    }

    if (_this.usarMarcaModelo) {
      this.addGridColumn({
        header: this.idioma.lbMarcaModelo,
        dataIndex: "marcamodelo",
        default: true,
        width: 150,
      });
    }
    if (this.columnaCategoria()) {
      this.addGridColumn({
        header: this.idioma.cgCategoria,
        width: 120,
        dataIndex: "nomcategoria",
        default: true,
      });
    }

    this.addGridColumn({
      header: this.idioma.cgUM,
      width: 50,
      dataIndex: "umedida",
      default: true,
    });

    this.addGridColumn({
      header: "Cantidad",
      width: 120,
      align: "right",
      editable: true,
      editor: LOG.util.Prototipos.inputDecimal({}),
      dataIndex: "cantidad",
      default: true,
      renderer: function (value, metaData, record) {
        if (record.json.cantidad) {
          return record.json.cantidad;
        }
        return value;
      },
    });

    this.addGridColumn(
      LOG.util.Prototipos.columnaPrecio({
        header: this.idioma.cgPrecio,
        width: 70,
        align: "right",
        dataIndex: "precio",
        default: true,
      })
    );

    this.addGridColumn(
      LOG.util.Prototipos.columnaCantidad({
        header: this.idioma.cgExistencia,
        width: 80,
        align: "right",
        dataIndex: "existencia",
        default: true,
        renderer: function (value, metaData, record) {
          if (record.json.disponible_area) {
            return record.json.existencia_area;
          }
          return value;
        },
      })
    );

    this.addGridColumn(
      LOG.util.Prototipos.columnaCantidad({
        header: this.idioma.cgDisponible,
        width: 80,
        align: "right",
        dataIndex: "disponible",
        default: true,
        renderer: function (value, metaData, record) {
          if (record.json.disponible_area) {
            return record.json.disponible_area;
          }
          return value;
        },
      })
    );

    /*if (this.lineaProducto) {
            this.addGridColumn({
                header: LOG.util.Idioma.lbNaturaleza,
                width: 150,
                agrupador: true,
                dataIndex: 'naturaleza',
                //default: true,
            });
        }*/

    if (_this.usarFiltroDeposito) {
      this.addGridColumn({
        header: this.idioma.cgDepositos,
        width: 90,
        dataIndex: "deposito",
        agrupador: true,
        default: true,
      });
    }

    if (isFarmacia == 1) {
      this.addGridColumn({
        header: this.idioma.lbFormaFarma,
        width: 120,
        dataIndex: "formafarma",
        //agrupador: true,
        default: true,
      });

      this.addGridColumn({
        header: this.idioma.lbPresentacion,
        width: 120,
        dataIndex: "presentacion",
        //agrupador: true,
        default: true,
      });
    }

    this.addGridColumn({
      header: this.idioma.cgAlmacenamiento,
      width: 100,
      dataIndex: "especial",
      default: true,
      renderer: function (value, metaData, record, rowIndex, colIndex, store) {
        if (record.get("municion") == 1) {
          metaData.css = "icondistra-partida";
          metaData.attr = 'ext:qtip="' + _this.idioma.ttClmMunicion + '"';
        } else if (record.get("equipo") == 1) {
          metaData.css = "icondistra-numeroserie";
          metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNorSerie + '"';
        } else if (record.get("tienelote") == 1) {
          metaData.css = "icondistra-lote";
          metaData.attr = 'ext:qtip="' + _this.idioma.ttClmLote + '"';
        } else {
          metaData.css = "icondistra-producto";
          metaData.attr = 'ext:qtip="' + _this.idioma.ttClmProducto + '"';
        }
      },
    });

    this.addGridColumn({
      header: "Nacionalidad",
      width: 120,
      dataIndex: "nacionalidad",
      default: true,
      filter: {
        type: "combo",
        url: "/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarPaises",
        valueField: "idpais",
        displayField: "nombrepais",
        dataIndex: "nacionalidad",
      },
    });
    this.addGridColumn({
      dataIndex: "idproducto",
    });
    this.addGridColumn({
      dataIndex: "idindicador",
    });
    this.addGridColumn({
      dataIndex: "descrpcionnacionalidad",
    });
    this.addGridColumn({
      dataIndex: "disponible_area",
    });
    this.addGridColumn({
      dataIndex: "existencia_area",
    });
    this.addGridColumn({
      dataIndex: "idumedida",
    });
    this.addGridColumn({
      dataIndex: "dumedida",
    });
    this.addGridColumn({
      dataIndex: "iddeposito",
    });
    this.addGridColumn({
      dataIndex: "url",
    });
    this.addGridColumn({
      dataIndex: "tienelote",
    });
    this.addGridColumn({
      dataIndex: "equipo",
    });
    this.addGridColumn({
      dataIndex: "municion",
    });
  },
  /**
   *
   * @returns {undefined}
   */
  init: function () {
    var _this = this;
    LOG.lb.producto.View.superclass.init.call(this);
    this.getVistaPrincipal().setTitle(this.idioma.hdProductos);
    this.getVistaPrincipal().listaBotones.getItem(1).disable();
    this.getVistaPrincipal().listaBotones.getItem(2).disable();
    this.getVistaPrincipal().width = 950;
    this.getVistaPrincipal().height = 500;

    LOG.util.UIManager.apply(this.getVistaPrincipal(), {
      onShowHandler: function () {
        LOG.util.UIManager.apply(
          _this.getStorePrincipal().initBaseParams,
          _this.parametros
        );
        _this.onShowHandler();
      },
      onShowFn: function () {
        LOG.util.UIManager.apply(
          _this.getStorePrincipal().initBaseParams,
          _this.parametros
        );
        _this.onShowHandler();
      },
      aceptarFn: function () {
        if (typeof _this.doAction == "function") {
          if (!_this.getGridPrincipal().getSelectionModel().hasSelection()) {
            mostrarMensaje(1, _this.idioma.msgSelectObjeto);
            return;
          }
          _this.doAction
            .createDelegate(_this, [
              _this.getGridPrincipal().getSelectionModel().getSelections(),
            ])
            .call();
        }
      },
    });
    if (_this.busquedaAvanzada) {
      this.getPanelBusqueda().setColumns(1);
      var clfBusc = LOG.util.UIManager.initColumnForm({
        columnas: 2,
      });

      clfBusc.addComponent(
        new LOG.util.Prototipos.inputTexto({
          name: "denominacion",
          fieldLabel: _this.idioma.cgDenominacion,
          regex: LOG.util.Regex.cadena,
          width: "98%",
        })
      );
      clfBusc.addComponent(
        new LOG.util.Prototipos.inputTexto({
          name: "codigo",
          fieldLabel: _this.idioma.cgCodigo,
          width: "98%",
        })
      );
      clfBusc.addComponent(
        new Ext.erp.comboNomenclador({
          controller:
            "/logistica/utiles/nomencladores/index.php/nomencladores/",
          modelo: "NomCategoriasproducto",
          idnom: "idcategoria",
          name: "categoria",
          autoCargar: true,
          fieldLabel: _this.idioma.lbCbCategoria,
        })
      );
      clfBusc.addComponent(
        new LOG.util.Prototipos.inputEntero({
          fieldLabel: _this.idioma.cgExistencia,
          name: "existencia",
          empty: true,
        })
      );
      clfBusc.addComponent(
        new LOG.util.TreeCombo({
          url: "/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas",
          name: "idnaturaleza",
          selectOnlyLeaf: true,
          fieldLabel: "Naturaleza",
        })
      );

      clfBusc.addComponent(
        new LOG.util.ComboBox({
          width: "98%",
          fieldLabel: _this.idioma.cgEspecialidad,
          url: "/logistica/utiles/plugin/index.php/sistemasexternos/cargarEspecialidad",
          valueField: "idespecialidad",
          name: "idespecialidad",
          displayField: "denespecialidad",
        })
      );

      clfBusc.addComponent(
        new Ext.erp.comboNomenclador({
          controller:
            "/logistica/utiles/nomencladores/index.php/nomencladores/",
          modelo: "NomClasificacioncontablelog",
          idnom: "idclasificacioncontable",
          name: "denominacion",
          autoCargar: true,
          fieldLabel: "Clasificaci\xf3n contable",
        })
      );

      clfBusc.addComponent(
        new LOG.util.Prototipos.inputTexto({
          name: "codigoproveedor",
          fieldLabel: _this.idioma.cgCodProveedor,
          width: "98%",
        })
      );
      clfBusc.addComponent(
        new LOG.util.Prototipos.inputTexto({
          fieldLabel: _this.idioma.cgCodigoAuxiliar,
          name: "codigoauxiliar",
        })
      );

      if (_this.usarFiltroArea) {
        this.cbarea = new LOG.util.ComboBox({
          fieldLabel: _this.idioma.cgArea,
          url: "/logistica/utiles/producto/index.php/producto/cargarAreasXDeposito",
          displayField: "descripcion",
          name: "idarea",
          hiddenName: "idarea",
          autoLoad: false,
          valueField: "idarea",
        });
        clfBusc.addComponent(this.cbarea);
        this.getPanelBusqueda().cargarDatos = function (v) {
          _this.cbarea.store.load({
            params: {
              idestructura: v.idDeposito || _this.parametros.idestructura,
            },
          });
        };
      }

      this.tipoProducto = new LOG.util.ComboBox({
        hiddenName: "tipoproducto",
        valueField: "idtipoproducto",
        displayField: "tipoproducto",
        descField: "desc",
        fieldLabel: _this.idioma.cgTipoProducto,
        store: new Ext.data.ArrayStore({
          fields: ["idtipoproducto", "tipoproducto", "desc"],
          data: [
            [1, _this.idioma.lbFormaNinguna, _this.idioma.lbDesFormaNinguna],
            [2, _this.idioma.lbFormaLote, _this.idioma.lbDesFormaLote],
            [3, _this.idioma.lbFormaSerie, _this.idioma.lbDesFormaSerie],
            [4, _this.idioma.lbFormaPartidas, _this.idioma.lbDesFormaPartidas],
          ],
        }),
      });
      clfBusc.addComponent(this.tipoProducto);
      if (_this.usarFiltroDeposito) {
        /*this.comboDeposito = new LOG.util.ComboBox({
                    url: '/logistica/utiles/plugin/index.php/plugincombodeposito/cargardepositos',
                    hiddenName: 'idestructura',
                    autoLoad: false,
                    valueField: 'id',
                    displayField: 'text',
                    fieldLabel: 'Depositos'
                });
                this.comboDeposito.store.baseParams.idtipo = -1;
                this.comboDeposito.store.load();
                clfBusc.addComponent(this.comboDeposito);*/
        clfBusc.addComponent(
          new LOG.util.SelectorTF({
            width: 350,
            fieldLabel: "Dep\xf3sitos",
            title: "Dep\xf3sitos",
            url: "cargardepositos?idtipo= -1",
            controller:
              "/logistica/utiles/plugin/index.php/plugincombodeposito",
            valueField: "iddeposito",
            displayField: "deposito",
            hiddenName: "idestructura",
            columns: [
              {
                header: "Código",
                dataIndex: "codigo",
                width: 120,
              },
              {
                header: "Dep\xf3sito",
                dataIndex: "deposito",
                width: 250,
                autoExpand: true,
              },
              {
                header: "Estado",
                dataIndex: "denestado",
                width: 120,
              },
              {
                dataIndex: "estado",
              },
            ],
          })
        );
      }
      this.addFilterComponent(clfBusc);

      var clsDias = LOG.util.UIManager.initColumnForm({
        columnas: 1,
      });
      var cantidadias = new LOG.util.Prototipos.inputEntero({
        fieldLabel: _this.idioma.cgDias,
        name: "cantdias",
        empty: true,
      });
      clsDias.addComponent(cantidadias);
      var clsFecha = LOG.util.UIManager.initColumnForm({
        columnas: 2,
      });
      var desde = new Ext.form.DateField({
        fieldLabel: _this.idioma.cgDesde,
        name: "desde",
        vtype: "daterange",
        editable: false,
      });
      var hasta = new Ext.form.DateField({
        fieldLabel: _this.idioma.cgHatsa,
        name: "hasta",
        vtype: "daterange",
        editable: false,
      });
      desde.endDateField = hasta.id;
      hasta.startDateField = desde.id;
      clsFecha.addComponent(desde);
      clsFecha.addComponent(hasta);

      this.addFilterComponent(
        new Ext.form.FieldSet({
          title: _this.idioma.tlFielSetMovimiento,
          items: [clsDias, clsFecha],
        })
      );
    }
  },
  /**
   *
   * @returns {Array.render._res}
   */
  render: function () {
    var _this = this;
    var _res = LOG.lb.producto.View.superclass.render.call(this);

    this.getGridPrincipal().on(
      "celldblclick",
      function (grid, rowIndex, columnIndex, e) {
        this.img = grid.store.data.items[rowIndex].data.imagen;

        if (columnIndex == 2 && this.img) {
            //if (!_this.winImagen) {
                _this.winImagen = new LOG.util.Window({
                    usarAplicar: false,
                    usarAceptar: false,
                    resizable: false,
                    title: 'Vista previa',
                    width: 450,
                    height: 450,
                    items: [
                        LOG.util.UIManager.initPanel({
                            region: 'center',
                            html: '<img src='+this.img+' style="width: 100%; height: 100%;">'
                        })
                    ]
                });
                _this.winImagen.on({
                    'show': function () {
                        _this.winImagen.base64Img = this.img;
                    },
                    'close':function() {
                        _this.winImagen.destroy();
                    }
                });
            _this.winImagen.show();
            _this.winImagen.doLayout();
            }


        //}
      }
    );
    this.getGridPrincipal().getSelectionModel().fireEvent =
      this.getGridPrincipal()
        .getSelectionModel()
        .fireEvent.createSequence(function (e) {
          if (e == "selectionchange" && _this.formaVisualizacion == "ventana") {
            _this.habilitarBotones();
          }
        });
    var _this = this;
    this.getStorePrincipal().on({
      load: function (st) {
        _this.getStorePrincipal().each(function (r) {
          if (r.imagen != null) {
            r.data.url = "URL";
          } else {
            r.data.url = "/logistica/utiles/comun/views/images/sin_imagen.png";
          }
        });
      },
    });
    return _res;
  },
  /**
   *
   * @returns {undefined}
   */
  habilitarBotones: function () {
    this.getVistaPrincipal().listaBotones.getItem(1).disable();
    this.getVistaPrincipal().listaBotones.getItem(2).disable();
    if (this.getGridPrincipal().getSelectionModel().hasSelection()) {
      this.getVistaPrincipal().listaBotones.getItem(1).enable();
      this.getVistaPrincipal().listaBotones.getItem(2).enable();
    }
  },
  onShowHandler: function () {
    LOG.util.UIManager.apply(
      this.getStorePrincipal().initBaseParams,
      this.parametros
    );
    if (this.autoLoadProd) {
      this.getStorePrincipal().load({
        params: {
          start: 0,
          limit: 30,
        },
      });
    }
  },
});

LOG.lb.producto.BarcodeReader = function () {
  function initVentanaBarCode() {
    var panelCodigo = LOG.util.UIManager.initColumnForm({
      columnas: 1,
      region: "center",
    });
    panelCodigo.addComponent(
      LOG.util.Prototipos.inputTexto({
        fieldLabel: "C\xf3digo de barras",
      })
    );

    panelCodigo.init();
    var fsProducto = new Ext.form.FieldSet({
      title: "Datos del producto",
      region: "south",
      checkboxToggle: true,
      height: 60,
      items: [
        {
          html: "asdadas",
        },
      ],
    });
    var fpCodigo = LOG.util.UIManager.initForm({
      labelAlign: "top",
      region: "center",
      frame: true,
      items: [panelCodigo, fsProducto],
    });

    var wind = LOG.util.UIManager.initWindow({
      usarAplicar: false,
      resizable: false,
      title: "Buscar producto",
      width: 350,
      height: 210,
      aceptarFn: function () {
        alert("asdad");
        return false;
      },
      items: [fpCodigo],
    });
    wind.getButton(0).setText(LOG.util.Idioma.lbBtnCerrar);
    wind.getButton(2).setText(LOG.util.Idioma.lbBtnBuscar);
    wind.getButton(0).setTooltip("");
    wind.getButton(2).setTooltip("");
    wind.show();
  }
  return {
    init: function (v) {
      var btn = LOG.util.Prototipos.botonBarCode({
        vista: v,
        handler: initVentanaBarCode,
      });
      if (typeof v.addToolbarButtonProductos == "function") {
        v.addToolbarButtonProductos(btn);
      } else {
        v.addToolbarButton(btn);
      }
    },
  };
};

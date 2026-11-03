/*
  RECURSOS:
  CT - Todos los botones
  RCRUD - Botones (Nuevo, Abrir, Eliminar, Balanceo, Confirmar, Anular, Imprimir, Adicionar pedidos, Eliminar pedidos, Comprar todos, Eliminar producto, Adicionar sustituto)
  RB - Botones (Imprimir)
  RAdicionar - Botones (Nuevo)
  RAbrir - Botones (Abrir)
  REliminar - Botones (Eliminar)
  RProductos - Botones (Balanceo)
  RConfirmar - Botones (Confirmar)
  RAnularestado - Botones (Anular)
  RAnular - Botones (Anular)
  RAprobar - Botones (Aprobar)
  REditar - Botones (Adicionar pedidos, Eliminar pedidos, Comprar todos, Eliminar producto, Adicionar sustituto)

*/

UCID.portal.cargarAcciones(window.frameElement.id, function () {
  var vistaBalanceo = new LOG.dist.balanceo.View({
    acciones: acciones_reportes,
    busquedaBasica: true,
    busquedaAvanzada: true,
    idioma: LOG.util.UIManager.apply(LOG.dist.balanceo.Idioma, LOG.util.Idioma)
  });

  vistaBalanceo.init();
  vistaBalanceo.getPanelBusqueda().setColumns(1);

  var fpDatosBusquedaAvanzada = LOG.util.UIManager.initColumnForm({
    columnas: 1
  });
  var fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
    columnas: 2
  });

  fpDatosBusqueda.addComponent(new LOG.util.Prototipos.inputEntero({
    fieldLabel: 'No.Doc.Pedido',
    emptyText: vistaBalanceo.idioma.lbSeleccione,
    name: 'nroDoc',
    editable: false
  }));
  fpDatosBusqueda.addComponent(new LOG.util.ComboBox({
    fieldLabel: 'Estado',
    hiddenName: 'estado',
    emptyText: vistaBalanceo.idioma.lbSeleccione,
    store: new Ext.data.SimpleStore({
      fields: ['idestado', 'estado'],
      data: [
        [1, LOG.lb.documento.Estado[1]],
        [2, LOG.lb.documento.Estado[2]],
        [3, LOG.lb.documento.Estado[3]],
        [9, LOG.lb.documento.Estado[9]]
      ]
    }),
    valueField: 'idestado',
    displayField: 'estado',
    editable: false
  }));
  fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
    fieldLabel: vistaBalanceo.idioma.lbCreadoPor,
    hiddenName: 'idusuario',
    alias: 'entregaLog',
    subsistema: 10
  }));

  fpDatosBusqueda.addComponent(new LOG.lb.documento.ComboUsuarios({
    fieldLabel: vistaBalanceo.idioma.lbAprobadoPor,
    hiddenName: 'aprobadopor',
    alias: 'entregaLog',
    subsistema: 10
  }));

  var cmbDenomProducto = new Ext.form.TriggerField({
    fieldLabel: 'Producto',
    disabled: false,
    emptyText: vistaBalanceo.idioma.lbSeleccione,
    triggerClass: 'x-form-cliente-trigger',
    tabular: true,
    name: 'producto',
    anchor: '98%',
    editable: false
  });
  cmbDenomProducto.onTriggerClick = function (e) {
    var _this = this;
    LOG.inv.maestroproductos.Loader.init(function () {
      var v = new LOG.lb.maestroproductos.UIProductos({
        tipo: 1,
        usarAplicar: false,
        modoSeleccion: 1,
        parametros: {
        },
        doAction: function (r) {
          var _idproductos = [];
          Ext.each(r, function (obj) {
            var objSi = obj;
            objSi.data.idproducto = obj.id;
            _idproductos.push(obj.json.idindicador)
          });
          cmbDenomProducto.setValue(r[0].data.idproducto);
          cmbDenomProducto.setRawValue(r[0].data.denominacion);
          vistaBalanceo.getPanelBusqueda().parametros['idproducto'] = r[0].data.idproducto;
          cmbDenomProducto.clearInvalid();
          cmbDenomProducto.focus();
          if (v.isVisible()) {
            v.panelProductos.getStorePrincipal().reload(
                v.parametros.idseleccionados = Ext.encode(Ext.decode(v.panelProductos.getStorePrincipal().baseParams.idseleccionados).concat(_idproductos))
            );
          }
        }
      });
      v.show();
    });
  };
  fpDatosBusqueda.addComponent(cmbDenomProducto);

  this.checkCapacidadLiquida = new Ext.form.Checkbox({
    boxLabel:'Capacidad líquida',
    name: 'capacidadliquida',
    style: 'margin:25px 0px 0px 15px',
    height: 40,
    width: '98%',
    disabled: false
  });

  this.panelCheck = LOG.util.UIManager.initPanel({
    title: '',
    region: 'center',
    labelAlign: 'left',
    layout: 'column',
    height: 48,
    width: '98%',
    items: [this.checkCapacidadLiquida]
  });
  fpDatosBusqueda.addComponent(this.panelCheck);

  var tipopedido = new LOG.util.ComboBox({
    fieldLabel: 'Tipo de pedido',
    url: 'cargarNomtipopedido',
    hiddenName: 'idnomconcepto',
    valueField: 'idnomconcepto',
    displayField: 'denomtipopedido',
    loadingText: vistaBalanceo.idioma.lbCargando,
    hideTrigger: false,
    readOnly: false,
    triggerAction: 'all',
    enableQtip: true,
    pageSize: 10,
    emptyText: vistaBalanceo.idioma.lbSeleccione,
    minChars: 0,
    mode: 'remote'//,
  });
  fpDatosBusqueda.addComponent(tipopedido);

  this.cmbAgencia = new LOG.util.ComboBox({
    fieldLabel: 'Agencia',
    url: 'cargarEntidades',
    hiddenName: 'entidaddestino',
    valueField: 'idestructura',
    displayField: 'denominacion',
    loadingText: vistaBalanceo.idioma.lbCargando,
    hideTrigger: false,
    readOnly: false,
    triggerAction: 'all',
    enableQtip: true,
    pageSize: 10,
    emptyText: vistaBalanceo.idioma.lbSeleccione,
    minChars: 0,
    mode: 'remote'//,
  });
  fpDatosBusqueda.addComponent(this.cmbAgencia);

  this.Observaciones = new Ext.form.TextArea({
    fieldLabel: 'Observaciones',
    name: 'observaciones',
    maxLength: 255,
    minLength: 2,
    width: '100%',
    enableKeyEvents: true
  });

  var clsFecha = LOG.util.UIManager.initColumnForm({
    columnas: 2
  });

  clsFecha.addComponent(
      new Ext.form.DateField({
        fieldLabel: 'Desde',
        name: 'desde',
        vtype: 'daterange',
        id: 'desde',
        endDateField: 'hasta',
        editable: false
      })
  );

  clsFecha.addComponent(
      new Ext.form.DateField({
        fieldLabel: 'Hasta',
        name: 'hasta',
        vtype: 'daterange',
        id: 'hasta',
        startDateField: 'desde',
        editable: false
      })
  );
  fpDatosBusquedaAvanzada.addComponent(fpDatosBusqueda);
  fpDatosBusquedaAvanzada.addComponent(this.Observaciones);
  fpDatosBusquedaAvanzada.addComponent(new Ext.form.FieldSet({
    title: 'Rango de fecha',
    items: [clsFecha]
  }));
  vistaBalanceo.addFilterComponent(fpDatosBusquedaAvanzada);
  vistaBalanceo.view();


});


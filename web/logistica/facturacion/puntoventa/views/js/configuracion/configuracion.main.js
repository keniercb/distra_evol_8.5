
UCID.portal.cargarAcciones(window.frameElement.id, function () {
  var idioma = LOG.util.UIManager.apply(LOG.fac.configuracionpuntoventa.Idioma, LOG.util.Idioma.init());
  var ventana = new LOG.util.UITabTemplate({
      idioma: idioma,
      formaVisualizacion: 'viewport'
  });
  var configuracion = new LOG.fac.configuracionpuntoventa.Configuracion({
      idioma: idioma,
      title: idioma.tlVentanaPtoVenta,
      _parent: ventana,
      urlBusquedaGridPrincipal: 'cargarPuntoVenta',
      idComponent: 0
  });
  
  ventana.addTabToTemplete(configuracion);

  /*var confcajero = new LOG.fac.configuracionpuntoventa.GestionarCajero({
        idioma: idioma,
        title: idioma.tlVentanaGestionarCajero,
        _parent: ventana,
        urlBusquedaGridPrincipal: 'cargarPuntoVenta',
        idComponent: 3
  });
  ventana.addTabToTemplete(confcajero);*/

  var confcaja = new LOG.fac.configuracionpuntoventa.ConfigurarCaja({
      idioma: idioma,
      title: idioma.tlVentanaConfigurarCaja,
      _parent: ventana,
      urlBusquedaGridPrincipal: 'cargarPuntoVenta',
      idComponent: 1
  });
  ventana.addTabToTemplete(confcaja);
  var confnaturaleza = new LOG.fac.configuracionpuntoventa.Naturaleza({
      idioma: idioma,
      title: idioma.tlVentanaNaturaleza,
      _parent: ventana,
      //urlBusquedaGridPrincipal: 'cargarListadoNaturaleza',
      idComponent: 2
  });
  ventana.addTabToTemplete(confnaturaleza);
    /*var pProductos = new LOG.fac.configuracionpuntoventa.Producto({
        idioma: idioma,
        _parent: ventana,
        title: idioma.tlVentanaProductos,
        idComponent: 0,
        acciones: acciones_reportes
    });
    var pServicios = new LOG.fac.configuracionpuntoventa.Producto({
        idioma: idioma,
        _parent: ventana,
        title: 'Servicios',
        idComponent: 1,
        acciones: acciones_reportes
    });

  var tProductos = new LOG.fac.configuracionpuntoventa.ProductosServicios({
      idioma: idioma,
      _parent: ventana,
      title: 'Productos/Servicios',
      idComponent: 3,
      acciones: acciones_reportes
  });
  tProductos.addTabToTemplete(pProductos);
  tProductos.addTabToTemplete(pServicios);
  tProductos.init()
  let _p = tProductos.view();

    this.cmbArea = new LOG.util.ComboBox({
        autoLoad: true,
        name: 'idareaventa',
        url: '/logistica/facturacion/puntoventa/index.php/configuracionpuntoventa/cargarAreas',
        valueField: 'idestructuraop',
        displayField: 'coddenominacion',
        width:350,
        anchor: '90%',
        listWidth:350,
        //pageSize: 10,
        //mode: 'remote',
        allowBlank: false,
        editable: true,
        listeners: {
            /!*expand: function () {
                this.store.reload();
            },*!/
            select: function (combo,record,index) {
                _this.productos.setIdAreaVenta(record.json.idareaventa)
                _this.devoluciones.setIdAreaVenta(record.json.idareaventa)
                _this.pedidos.setIdAreaVenta(record.json.idareaventa)

                _this.productos.setIdDeposito(record.json.idestructuraop)
                _this.devoluciones.setIdDeposito(record.json.idestructuraop)

                _this.productos.getGridPrincipal().getStore().load();
                _this.devoluciones.getGridPrincipal().getStore().load();
                _this.pedidos.getGridPrincipal().getStore().load();

            }
        }
    });
  ventana.addTabToTemplete(LOG.util.UIManager.initPanel({
      title: 'Productos/Servicios',
      region: 'center',
      layout: 'border',
      items: _p,
      tbar: ['->', '-', idioma.tfArea + ':', this.cmbArea],
      view: function () {
          return this;
      }
  }));*/
    let tProductos = new LOG.fac.configuracionpuntoventa.PanelProductos({
        idioma: idioma,
        _parent: ventana,
        title: 'Productos/Servicios',
        idComponent: 3,
        acciones: acciones_reportes
    });
    ventana.addTabToTemplete(tProductos)
  ventana.init();
    //this.documentKeyMap = new Ext.KeyMap(document,
  //    [  {
  //        alt: true,
  //        ctrl:false,
  //        key: 'i',
  //        fn: function () {
  //        }
  //    }
  //
  //        ]);
  
  ventana.view();
  ventana.hideTabStripItem(0);
  ventana.hideTabStripItem(1);
  ventana.hideTabStripItem(2);
  ventana.hideTabStripItem(3);
  this.listaAcciones = new LOG.util.List(acciones_reportes);
  this.listaAcciones.each(function(a) {
      if (a['abreviatura'] == 'CONFAREA') {
          ventana.unhideTabStripItem(0);
      } else if (a['abreviatura'] == 'CONFCAJA') {
          ventana.unhideTabStripItem(1);
      } else if (a['abreviatura'] == 'CONFNATURALEZA') {
          ventana.unhideTabStripItem(2);
      } else if (a['abreviatura'] == 'CONFPRODUCTOS') {
          ventana.unhideTabStripItem(3);
      }
  });
});
//
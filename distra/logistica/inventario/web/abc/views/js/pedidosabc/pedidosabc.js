/**
 Uso:Componente para la gestion de los pedidos ABC

 * ---------------------------------------------

 * 11 de Junio 2021 |   ABC
 *

 * @extends Ext.Panel
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */

Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

Ext.log.abc.PedidosABC = Ext.extend(LOG.util.UITemplate, {
  constructor: function (config) {
    var _this = this;
    _this.idioma = this.idioma;
    config.dirController = '/logistica/inventario/abc/index.php/pedidosabc';
    config.urlBusquedaGridPrincipal = 'obtenerpedidosabc';
    config.modoSeleccion = 1;
    config.busquedaBasica = true;
    config.formaVisualizacion = 'panel';
    config.gridEditable = false;
    config.roweditor = false;
    config.autoShow = true;
    config.autoLoad = true;
    config.busquedaAvanzada = true;
    config.idioma = {};
    config.baseParams = {limit: 30, start: 0};
    Ext.log.abc.PedidosABC.superclass.constructor.call(this, config);
    _this.textBusquedaSimple = 'No. de pedido';

  },
  initDefaultColumns: function () {
    this.addGridColumn({
      header: 'idpedidoabc',
      width: 80,
      dataIndex: 'idpedidoabc',
      default: true,
      hidden: true
    });
    this.addGridColumn({
      header: 'idpedido',
      width: 80,
      dataIndex: 'idpedido',
      default: true,
      hidden: true
    });
    this.addGridColumn({
      header: 'idconfperiodosclasificacionabc',
      width: 80,
      dataIndex: 'idconfperiodosclasificacionabc',
      default: true,
      hidden: true
    });
    this.addGridColumn({
      header: 'No. del pedido',
      width: 100,
      dataIndex: 'nrodoc',
      default: true,
      hidden: false
    });
    this.addGridColumn({
      header: 'Estado',
      width: 120,
      dataIndex: 'estado',
      default: true,
      hidden: true
    });
    this.addGridColumn({
      header: 'Estado',
      width: 120,
      dataIndex: 'estadomostrar',
      default: true,
      hidden: false
    });
    this.addGridColumn({
      header: 'Fecha',
      dataIndex: 'fecha',
      width: 100,
      default: true,
      hidden: false
    });
    this.addGridColumn({
      header: 'Per&iacute;odo de clasificaci&oacute;n',
      width: 200,
      dataIndex: 'periodo',
      default: true,
      hidden: false
    });
    this.addGridColumn({
      header: 'Naturalezas',
      width: 350,
      dataIndex: 'naturalezas',
      default: true,
      hidden: false
    });

  },
  initDefaultButtons: function () {
    let self = this;
    this.addToolbarButton(new Ext.Button({
        id: 'btnAdicionarPedidoABC',
        iconCls: 'adicionar',
        text: 'Adicionar',
        tooltip: 'Adicionar pedido ABC',
        handler: function () {
          let addWin = new Ext.log.abc.AdicionarPedidoABC({
            idestructura: idestructura,
            periodos: periodosclasificacion,
            depositosreaprovisionamientos: depositosreaprovisionamientos,
            permitireditarpedido: permitireditarpedido
          });
          addWin.on('pedidoguardado', function () {
            self.reiniciarBusqueda();
          });
          addWin.show();
        }

      })
    );

    this.addToolbarButton(" ");
    this.addToolbarButton("-");
    this.addToolbarButton(new Ext.Button({
        id: 'btnEliminarPedidoABC',
        iconCls: 'eliminar',
        text: 'Eliminar',
        tooltip: 'Eliminar pedido ABC',
        handler: function () {
          if (self.smGridPrincipal.hasSelection()) {
            let pedidoSeleccionado = self.smGridPrincipal.getSelected();
            if (pedidoSeleccionado.data.estado == '1') {
              mostrarMensaje(2, "¿Desea eliminar el pedido seleccionado?", function (btn) {
                if (btn == 'ok') {
                  let mascara = new Ext.LoadMask(Ext.getBody(), {
                    msg: 'Eliminando el pedido. Por favor espere...'
                  });
                  mascara.show();

                  Ext.Ajax.request({
                    url: 'eliminarpedidosabc',
                    method: 'POST',
                    timeout: 300000,
                    params: {
                      idpedidoabc: pedidoSeleccionado.data.idpedidoabc,
                      idpedido: pedidoSeleccionado.data.idpedido
                    },
                    callback: function (options, success, response) {
                      mascara.hide();
                      var obj = Ext.decode(response.responseText);
                      if (obj.codigo == 1) {
                        mostrarMensaje(1, 'El pedido ha sido eliminado satisfactoriamente.');
                        self.reiniciarBusqueda();
                      } else {
                        mostrarMensaje(3, obj.mensaje);
                      }
                    }.createDelegate(this)
                  });
                }
              });
            } else {
              mostrarMensaje(3, "El pedido no est&aacute; en elaboraci&oacute;n.");
            }
          } else {
            mostrarMensaje(3, "Debe seleccionar un pedido.");
          }
        }

      })
    );

    this.addToolbarButton(new Ext.Button({
        id: 'btnProductosPedidoABC',
        iconCls: 'producto',
        text: 'Productos',
        tooltip: 'Productos del pedido ABC',
        handler: function () {
          if (self.smGridPrincipal.hasSelection()) {
            let productosWin = new Ext.log.abc.ProductosPedidoABC({
              title: 'Productos del pedido: ' + self.smGridPrincipal.getSelected().data.nrodoc,
              idpedido: self.smGridPrincipal.getSelected().data.idpedido,
              estado: self.smGridPrincipal.getSelected().data.estado,
              permitireditarpedido: permitireditarpedido
            });
            productosWin.show();
          } else {
            mostrarMensaje(3, "Debe seleccionar un pedido.");
          }
        }

      })
    );

    this.addToolbarButton(new Ext.Button({
        id: 'btnEstadoPedidoABC',
        iconCls: 'preparar',
        text: 'Preparar pedido',
        tooltip: 'Prepara el pedido y envia a la entidad encargada de realizar la distribuci&oacute;n',
        handler: function () {
          if (self.smGridPrincipal.hasSelection()) {
            let pedidoSeleccionado = self.smGridPrincipal.getSelected();
            if (pedidoSeleccionado.data.estado == '1') {
              mostrarMensaje(2, "¿Desea preparar el pedido seleccionado para su distribuci&oacute;n en la entidad encargada?", function (btn) {
                if (btn == 'ok') {
                  let mascara = new Ext.LoadMask(Ext.getBody(), {
                    msg: 'Preparando el pedido. Por favor espere...'
                  });
                  mascara.show();

                  Ext.Ajax.request({
                    url: 'prepararpedidosabc',
                    method: 'POST',
                    timeout: 300000,
                    params: {
                      idpedido: pedidoSeleccionado.data.idpedido
                    },
                    callback: function (options, success, response) {
                      mascara.hide();
                      var obj = Ext.decode(response.responseText);
                      if (obj.codigo == 1) {
                        mostrarMensaje(1, 'El pedido ha sido preparado satisfactoriamente.');
                        self.reiniciarBusqueda();
                      } else {
                        mostrarMensaje(3, obj.mensaje);
                      }
                    }.createDelegate(this)
                  });
                }
              });
            } else {
              mostrarMensaje(3, "El pedido no est&aacute; en elaboraci&oacute;n.");
            }
          } else {
            mostrarMensaje(3, "Debe seleccionar un pedido.");
          }
        }

      })
    );


    this.addToolbarButton("-");
    this.addToolbarButton("->");
    self.addToolbarButton(estructura);
  },
  view: function () {
    let _this = this;
    this.getPanelBusqueda().setColumns(1);
    let fpDatosBusqueda = LOG.util.UIManager.initColumnForm({
      columnas: 1
    });

    let cbNaturalezas = new LOG.util.ComboBox({
      fieldLabel: 'Naturaleza',
      editable: true,
      url: '/logistica/inventario/abc/index.php/clasificacionabc/obtenerlineasproducto',
      hiddenName: 'idnaturaleza',
      valueField: 'idnaturaleza',
      displayField: 'denominacion',
      loadingText: 'Cargando...',
      hideTrigger: false,
      readOnly: false,
      triggerAction: 'all',
      enableQtip: true,
      pageSize: 10,
      emptyText: 'Seleccione...',
      minChars: 0,
      mode: 'local'
    });

    fpDatosBusqueda.addComponent(cbNaturalezas);

    let stConfPeriodosClasificacion = new Ext.data.SimpleStore({
      fields: [
        {name: 'idconf'},
        {name: 'periodo'},
        {name: 'naturalezas'}
      ]
    });
    stConfPeriodosClasificacion.loadData(periodosclasificacion);


    let cbConfPeriodosClasificacion = new LOG.util.ComboBox({
      tpl: '<tpl for="."><div ext:qtip="<b>Naturalezas: </b> {naturalezas}" class="x-combo-list-item">{periodo}'
        + '</div></tpl>',
      fieldLabel: 'Per&iacute;odos de clasificaci&oacute;n',
      editable: true,
      hiddenName: 'idconf',
      valueField: 'idconf',
      displayField: 'periodo',
      hideTrigger: false,
      readOnly: false,
      triggerAction: 'all',
      enableQtip: true,
      emptyText: 'Seleccione...',
      mode: 'local',
      store: stConfPeriodosClasificacion
    });

    fpDatosBusqueda.addComponent(cbConfPeriodosClasificacion);

    fpDatosBusqueda.getColumn(0).columnWidth = 1;
    fpDatosBusqueda.getColumn(0).getComponent(0).anchor = '99%';


    this.addFilterComponent(fpDatosBusqueda);
    return Ext.log.abc.PedidosABC.superclass.view.call(this);

  }
});


Ext.log.abc.PedidosABCBase = {
  init: function (idioma, perfil) {
    let _this = this;
    this.p = new Ext.log.abc.PedidosABC({});

    this.p.init();
    this.vista = this.p.view();
    this.p.getSmPrincipal().on({
      rowselect: function (_sm, _index, _r) {
        _this.p.panelBotones.getTopToolbar().items.items[2].enable();
      },
      rowdeselect: function (_sm, _index, _r) {
        _this.p.panelBotones.getTopToolbar().items.items[2].disable();
      }
    });

    this.vp = new Ext.Viewport({
      layout: 'border',
      items: [this.vista]
    });
  }
};
var estructura = null;
var idestructura = null;
var tipoestructura = null;
var periodosclasificacion = null;
var depositosreaprovisionamientos = null;
var idestructurarecibepedido = null;
var permitireditarpedido = 0;

Ext.onReady(function () {
  UCID.portal.cargarEtiquetas('pedidosabc', function (perfil, idioma) {
    perfil = arguments[0];
    idioma = arguments[1];
    let mascara = new Ext.LoadMask(Ext.getBody(), {
      msg: 'Cargando...'
    });
    mascara.show();
    Ext.Ajax.request({
      url: 'obtenerPeriodoAnalizaryParametros',
      method: 'POST',
      timeout: 300000,
      params: {},
      callback: function (options, success, response) {
        mascara.hide();
        let obj = Ext.decode(response.responseText);
        if (obj.codigo == 1) {
          tipoestructura = obj.tipo;
          estructura = obj.estructura;
          idestructura = obj.idestructura;
          idestructurarecibepedido = obj.idestructurarecibepedido;
          permitireditarpedido = obj.permitireditarpedido;

          periodosclasificacion = new Array();
          for (let i = 0; i < obj.periodos.length; i++) {
            periodosclasificacion.push([obj.periodos[i].idconf, obj.periodos[i].periodo
              , obj.periodos[i].naturalezas]);
          }

          depositosreaprovisionamientos = new Array();
          for (let i = 0; i < obj.depositos.length; i++) {
            depositosreaprovisionamientos.push([obj.depositos[i].iddeposito, obj.depositos[i].deposito]);
          }

          let interfaz = Ext.log.abc.PedidosABCBase;
          interfaz.init(idioma, perfil);
        } else {
          Ext.MessageBox.buttonText.ok = "Aceptar";
          Ext.Msg.show
          ({
            title: 'Informaci&oacute;n',
            buttons: Ext.Msg.OK,
            msg: obj.mensaje
          });
          mostrarMensaje(3, obj.mensaje);
        }
      }
    });

  });
}, true);



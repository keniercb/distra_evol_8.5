/**
 Uso:Componente para mostrar los productos de un pedido ABC

 * ---------------------------------------------

 * 11 de Junio de 2021 |   ABC
 *

 * @extends Ext.Window
 * @xtype
 * @autor   Centro Logistica - Ing. Yadir Martinez Vergara
 * @version 1.0.0
 */
Ext.ns('Ext.log.abc');
Ext.QuickTips.init();

Ext.log.abc.ProductosPedidoABC = Ext.extend(Ext.Window, {
  id: 'ProductosPedidoABC-1',
  title: 'Productos del pedido: ' + this.title,
  region: (this.region ? this.region : 'center'),
  layout: (this.layout ? this.layout : 'border'),
  modal: true,
  height: 500,
  width: 900,
  closable: true,
  idpedido: this.idpedido,
  estado: this.estado,
  permitireditarpedido: this.permitireditarpedido,
  initComponent: function () {
    let self = this;

    self.st = new Ext.data.Store({
      url: 'obtenerproductosdelpedido',
      reader: new Ext.data.JsonReader(
        {root: "datos"},
        [
          {name: 'idproductopedido'},
          {name: 'idproducto'},
          {name: 'codigo'},
          {name: 'producto'},
          {name: 'estado'},
          {name: 'cantidad'}
        ])
    });

    self.editorCantidad = null;
    if (self.permitireditarpedido == 1) {
      self.editorCantidad = new Ext.form.NumberField({
        allowBlank: false,
        anchor: '100%',
        allowDecimals: false,
        allowNegative: false,
        maxValue: 1000000,
        minValue: 0,
        nanText: 'Este valor es incorrecto.',
        blankText: 'Este campo es obligatorio.'
      });
    }

    self.columnas = [
      {header: 'idproductopedido', hidden: true, hideable: false, dataIndex: 'idproducto'},
      {header: 'idproducto', hidden: true, hideable: false, dataIndex: 'idproducto'},
      {header: 'C&oacute;digo', width: 120, sortable: true, dataIndex: 'codigo'},
      {
        header: 'Producto', hidden: false, width: 250, sortable: true, hideable: false,
        dataIndex: 'producto'
      },
      {header: 'Estado', hidden: false, width: 80, hideable: false, dataIndex: 'estado'},
      {
        header: 'Cantidad', width: 80, sortable: true, dataIndex: 'cantidad',
        renderer: function (val) {
          return '<p style="text-align:right">' + val + '</p>';
        },
        editor: self.editorCantidad
      }
    ];


    self.gp = null;
    if (self.permitireditarpedido == 1) {
      self.gp = new Ext.grid.EditorGridPanel({
        id: 'egpPPABC',
        layout: 'fit',
        height: 800,
        split: true,
        width: 500,
        region: 'center',
        columns: self.columnas,
        stripeRows: true,
        autoScroll: true,
        border: true,
        hideBorders: false,
        viewConfig: {forceFit: true},
        store: self.st,
        loadMask: {msg: 'Cargando...'}
      });

    } else {
      self.gp = new Ext.grid.GridPanel({
        id: 'gpPPABC',
        layout: 'fit',
        height: 800,
        split: true,
        width: 500,
        region: 'center',
        columns: self.columnas,
        stripeRows: true,
        autoScroll: true,
        border: true,
        hideBorders: false,
        viewConfig: {forceFit: true},
        store: self.st,
        loadMask: {msg: 'Cargando...'}
      });
    }

    self.items = [this.gp];

    self.btnGuardar = new Ext.Button({
      iconCls: 'guardar',
      text: 'Guardar',
      tooltip: 'Guardar las cantidades de los productos del pedido ABC',
      disabled: true,
      handler: function () {
        let filasModificadas = self.st.getModifiedRecords();
        if (filasModificadas.length > 0) {
          let arrProductos = new Array();
          self.st.each(
            function (rec) {
              arrProductos.push([rec.data.idproductopedido, rec.data.cantidad]);
            }
          );

          let mascara = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Guardando cantidades de los productos. Por favor espere...'
          });
          mascara.show();

          Ext.Ajax.request({
            url: 'guardarcantidadesproductospedidoabc',
            method: 'POST',
            timeout: 300000,
            params: {
              productos: Ext.encode(arrProductos)
            },
            callback: function (options, success, response) {
              mascara.hide();
              let obj = Ext.decode(response.responseText);
              if (obj.codigo == 1) {
                mostrarMensaje(1, 'Las cantidades de los productos han sido guardadas' +
                  +' satisfactoriamente.');
                self.close();
              } else {
                mostrarMensaje(3, obj.mensaje);
              }
            }
          });
        } else {
          mostrarMensaje(3, 'Debe realizar alg&uacute;n cambio para guardar.');
        }

      }
    });

    self.btnCerrar = new Ext.Button({
      iconCls: 'cerrar',
      text: 'Cerrar',
      tooltip: 'Cerrar ventana',
      handler: function () {
        self.close();
      }
    });

    if (self.permitireditarpedido == 1) {
      self.btnGuardar.enable();
    } else {
      self.btnGuardar.disable();
    }

    if (self.estado == 1) {
      self.btnGuardar.enable();
    } else {
      self.btnGuardar.disable();
    }

    this.buttons = [self.btnGuardar, self.btnCerrar];

    Ext.log.abc.ProductosPedidoABC.superclass.initComponent.call(this);
    this.st.load({
      params: {
        idpedido: self.idpedido
      }
    });
  }
});

/**
 Uso:Componente para adicionar un pedido ABC

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

Ext.log.abc.AdicionarPedidoABC = Ext.extend(Ext.Window, {
  id: 'AdicionarPedidoABC-1',
  title: 'Adicionar pedido abc',
  region: (this.region ? this.region : 'center'),
  layout: (this.layout ? this.layout : 'border'),
  modal: true,
  height: 500,
  width: 800,
  closable: true,
  idestructura: this.idestructura,
  periodos: this.periodos,
  depositosreaprovisionamientos: this.depositosreaprovisionamientos,
  permitireditarpedido: this.permitireditarpedido,
  initComponent: function () {
    let self = this;

    self.stPeriodos = new Ext.data.SimpleStore({
      fields: [
        {name: 'idconf'},
        {name: 'periodo'},
        {name: 'naturalezas'}
      ]
    });
    self.stPeriodos.loadData(this.periodos);

    self.cbPeriodos = new Ext.form.ComboBox({
      tpl: '<tpl for="."><div ext:qtip="<b>Naturalezas: </b> {naturalezas}" '
        + 'class="x-combo-list-item">{periodo}</div></tpl>',
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
      store: this.stPeriodos,
      listeners: {
        select: function () {
          self.st.removeAll();
          if (self.cbDepositos.getValue() != "" && self.cbPeriodos.getValue() != "") {
            self.st.load({
              params: {
                idconf: self.cbPeriodos.getValue(),
                idueb: self.idestructura,
                iddeposito: self.cbDepositos.getValue()
              }
            });
          }
        }
      }
    });

    self.stDepositosReaprovisionamientos = new Ext.data.SimpleStore({
      fields: [
        {name: 'iddeposito'},
        {name: 'deposito'},
      ]
    });

    self.stDepositosReaprovisionamientos.loadData(this.depositosreaprovisionamientos);

    self.cbDepositos = new Ext.form.ComboBox({
      editable: true,
      hiddenName: 'iddeposito',
      valueField: 'iddeposito',
      displayField: 'deposito',
      hideTrigger: false,
      readOnly: false,
      triggerAction: 'all',
      enableQtip: true,
      emptyText: 'Seleccione...',
      minChars: 0,
      width: 250,
      mode: 'local',
      store: this.stDepositosReaprovisionamientos,
      listeners: {
        select: function () {
          self.st.removeAll();
          if (self.cbDepositos.getValue() != "" && self.cbPeriodos.getValue() != "") {
            self.st.load({
              params: {
                idconf: self.cbPeriodos.getValue(),
                idueb: self.idestructura,
                iddeposito: self.cbDepositos.getValue()
              }
            });
          }
        }
      }
    });

    self.st = new Ext.data.Store({
      url: 'obtenerproductosperiodoconf',
      reader: new Ext.data.JsonReader(
        {root: "datos"},
        [
          {name: 'idproducto'},
          {name: 'idindicador'},
          {name: 'codigo'},
          {name: 'producto'},
          {name: 'existenciamaxima'},
          {name: 'existenciadeposito'},
          {name: 'pedido'}
        ])
    });

    let editorCantidad = null;
    if (self.permitireditarpedido == 1) {
      editorCantidad = new Ext.form.NumberField({
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
      {header: 'idproducto', hidden: true, hideable: false, dataIndex: 'idproducto'},
      {header: 'idindicador', hidden: true, hideable: false, dataIndex: 'idindicador'},
      {header: 'C&oacute;digo', width: 120, sortable: true, dataIndex: 'codigo'},
      {header: 'Producto', hideable: false, sortable: true, width: 250, dataIndex: 'producto'},
      {
        header: 'Existencia m&aacute;xima',
        width: 100,
        sortable: true,
        dataIndex: 'existenciamaxima',
        renderer: function (val) {
          return '<p style="text-align:right">' + val + '</p>';
        }
      },
      {
        header: 'Existencia en dep&oacute;sito', width: 100, sortable: true,
        dataIndex: 'existenciadeposito',
        renderer: function (val) {
          return '<p style="text-align:right">' + val + '</p>';
        }
      },
      {
        header: 'Pedido', width: 80, sortable: true, dataIndex: 'pedido', editor: editorCantidad,
        renderer: function (val) {
          return '<p style="text-align:right">' + val + '</p>';
        }
      }
    ];

    self.btnGuardar = new Ext.Button({
      iconCls: 'guardar',
      text: 'Guardar',
      tooltip: 'Guardar pedido ABC',
      handler: function () {
        if (self.cbDepositos.getValue() != "" && self.cbPeriodos.getValue() != "") {
          if (self.st.getCount() > 0) {
            let arrProductos = new Array();
            self.st.each(
              function (rec) {
                arrProductos.push([rec.data.idproducto, rec.data.pedido]);
              }
            );

            let mascara = new Ext.LoadMask(Ext.getBody(), {
              msg: 'Guardando el pedido. Por favor espere...'
            });
            mascara.show();

            Ext.Ajax.request({
              url: 'adicionarpedidoabc',
              method: 'POST',
              timeout: 300000,
              params: {
                idestructura: self.idestructura,
                idconf: self.cbPeriodos.getValue(),
                productos: Ext.encode(arrProductos)
              },
              callback: function (options, success, response) {
                mascara.hide();
                let obj = Ext.decode(response.responseText);
                if (obj.codigo == 1) {
                  mostrarMensaje(1, 'El pedido ha sido guardado satisfactoriamente.');
                  self.fireEvent('pedidoguardado');
                  self.close();
                } else {
                  mostrarMensaje(3, obj.mensaje);
                }
              }
            });
          } else {
            mostrarMensaje(3, "No existen productos a pedir.");
          }
        } else {
          mostrarMensaje(3, "Debe seleccionar un per&iacute;odo y un dep&oacute;sito para "
            + "realizar el pedido.");
        }
      }
    });

    self.btnCerrar = new Ext.Button({
      iconCls: 'cerrar',
      text: 'Cerrar',
      tooltip: 'Cerrar pedido ABC',
      handler: function () {
        self.close();
      }
    });

    self.gp = null;
    if (self.permitireditarpedido == 1) {
      self.gp = new Ext.grid.EditorGridPanel({
        id: 'egpAdicionarPedidoABC',
        layout: 'fit',
        height: 500,
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
        sm: self.sm,
        loadMask: {msg: 'Cargando...'},
        tbar: ['Per&iacute;odos de clasificaci&oacute;n: ', self.cbPeriodos,
          'Dep&oacute;sitos:', self.cbDepositos],
        buttons: [self.btnGuardar, self.btnCerrar]
      });
    } else {
      self.gp = new Ext.grid.GridPanel({
        id: 'gpAdicionarPedidoABC',
        layout: 'fit',
        height: 500,
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
        sm: self.sm,
        loadMask: {msg: 'Cargando...'},
        tbar: ['Per&iacute;odos de clasificaci&oacute;n: ', self.cbPeriodos,
          'Dep&oacute;sitos:', self.cbDepositos],
        buttons: [self.btnGuardar, self.btnCerrar]
      });
    }

    self.items = [self.gp];
    Ext.log.abc.AdicionarPedidoABC.superclass.initComponent.call(this);
  }
});

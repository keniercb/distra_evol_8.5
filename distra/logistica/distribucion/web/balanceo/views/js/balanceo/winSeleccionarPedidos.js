LOG.dist.balanceo.WinSeleccionarPedidos = Ext.extend(LOG.util.UITemplate, {
  onSelectPedido: function(){},
  constructor: function (config) {
    LOG.util.UIManager.apply(config.idioma, LOG.dist.balanceo.Idioma);
    this.modelo = new LOG.dist.balanceo.Model({
        idioma: config.idioma
    });
    this.autoSelect = false;
    this.formaVisualizacion = 'ventana';
    this.modoSeleccion = 3;
    this.dirController = '/logistica/distribucion/balanceo/index.php/balanceo';
    this.urlBusquedaGridPrincipal = 'cargarPedidos';
    //this.idseleccionados = config.idseleccionados || [];

    LOG.dist.balanceo.WinSeleccionarPedidos.superclass.constructor.call(this, config);

    this.vistaPrincipal.aceptarFn = () => this.onAceptar(this);
    
  },
  render: function() {
    LOG.dist.balanceo.WinSeleccionarPedidos.superclass.render.call(this);
    this.storePrincipal.baseParams = {
    
    }

  },
  initDefaultColumns: function () {
    var _this = this;
    
    this.addGridColumn({
      header: 'No. de pedido',
      width: 60,
      default: false,
      dataIndex: 'nrodoc'
    });

    this.addGridColumn({
        header: 'Entidad',
        width: 300,
        //default: true,
        //autoExpand: true,
        dataIndex: 'estructura',
        agrupador: true
    });

    this.addGridColumn({
        header: 'Cliente',
        width: 200,
        default: false,
        dataIndex: 'cliente'
    });

    this.addGridColumn({
        header: 'Fecha de emisi\xf3n',
        width: 70,
        dataIndex: 'fechacontable',
        default: false
    });

    this.addGridColumn({
        header: 'Cantidad',
        width: 30,
        dataIndex: 'productos',
        default: false,
        align:'right',
    });

    this.addGridColumn({
        header: 'Importe',
        width: 50,
        dataIndex: 'importe',
        default: false,
        type: 'decimal',
        align:'right',
    });

      this.addGridColumn({
          header: 'Observaciones',
          width: 300,
          dataIndex: 'observaciones',
          default: false,
          align:'left',
          renderer: function (v,metaData) {
              if(v != null)
                 metaData.attr = 'ext:qtip="' + v + '"';
              return v;
          },
          filter: {
              type: 'string',
              dataIndex: 'observaciones'
          }
      });

  },
  initDefaultButtons: function () {},
  onAceptar: function(self) {
    var selectedRecords = self.getGridPrincipal().getSelectionModel().getSelections();

    records = selectedRecords.map(rec => rec.json);

    //self.idseleccionados = self.idseleccionados.concat(records.map(r => r.iddocumento))

      self.observaciones = '';
      if (selectedRecords.length > 0) {
          var vistaBalanceo = new LOG.dist.balanceo.View({
              acciones: acciones_reportes,
              busquedaBasica: true,
              busquedaAvanzada: true,
              idioma: LOG.util.UIManager.apply(LOG.dist.balanceo.Idioma, LOG.util.Idioma)
          });
          self.obsanteriores = vistaBalanceo.taObservaciones.getValue();
          Ext.each(selectedRecords, function (rec) {
              var observ = rec.data.nrodoc + ' - ' + rec.data.estructura + ' - ' + rec.data.observaciones;
                  if(self.obsanteriores.indexOf(observ) == -1){
                      if(rec.data.observaciones){
                          self.observaciones = self.observaciones.concat(rec.data.nrodoc + ' - ' + rec.data.estructura + ' - ' + rec.data.observaciones,'\n');
                      }
                  }
          });
          if(Ext.isEmpty(self.obsanteriores) || self.obsanteriores.indexOf('\n') == 0){
              self.obsultimas = self.observaciones;
          }else{
              if(self.obsanteriores.indexOf('\n') != -1){
                  self.obsultimas = self.obsanteriores.concat(self.observaciones);
              }else{
                  self.obsultimas = self.obsanteriores.concat('\n', self.observaciones);
              }
          }
          vistaBalanceo.taObservaciones.setValue(self.obsultimas);
          vistaBalanceo.taObservaciones.focus();
      }
    const lastOptions = self.storePrincipal.lastOptions;
    
    lastOptions.params = {
      ...lastOptions.params,
      //idseleccionados: self.idseleccionados
    }
    
    self.storePrincipal.reload(lastOptions);
    this.onSelectPedido(records);
  }
});

LOG.dist.balanceo.formBusqAvanzada = function(scope) {

  scope.cbNaturaleza = new LOG.util.TreeCombo({
    url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
    name: 'idnaturaleza',
    selectOnlyLeaf: true,
    fieldLabel: 'Naturaleza',
    resizable: true,
    listWidth: 300
  });

  scope.cbCliente = new LOG.util.ComboBox({
    fieldLabel: 'Cliente',
    url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarClientes',
    hiddenName: 'idcliente',
    valueField: 'idclientesproveedores',
    displayField: 'nombre',
    //mode: 'remote',
    pageSize: 20,
    resizable: true
  });

  scope.cmbAgencia = new LOG.util.ComboBox({
    fieldLabel: 'Agencia',
    url: 'cargarEntidades',
    hiddenName: 'entidad',
    valueField: 'idestructura',
    displayField: 'denominacion',
    loadingText: scope.idioma.lbCargando,
    hideTrigger: false,
    readOnly: false,
    triggerAction: 'all',
    enableQtip: true,
    pageSize: 10,
    emptyText: scope.idioma.lbSeleccione,
    minChars: 0,
    mode: 'remote'//,
  });

  var panel = LOG.util.UIManager.initColumnForm({
    columnas: 1
  });

  panel.addComponent(scope.cbNaturaleza);
  panel.addComponent(scope.cbCliente);
  panel.addComponent(scope.cmbAgencia);

  scope.formBusqAvanzada = LOG.util.UIManager.initPanel({
    items: [panel]
  });

  return scope.formBusqAvanzada;
};
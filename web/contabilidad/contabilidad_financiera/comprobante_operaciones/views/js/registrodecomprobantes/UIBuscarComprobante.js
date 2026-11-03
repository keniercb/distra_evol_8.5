  Ext.namespace('Ext.UIBuscarComprobante');
  Ext.UIBuscarComprobante = Ext.extend(Ext.Window, {
      constructor: function(scope)
      {
          scope.btnCerrarBusqueda = new Ext.Button({
              text: scope.etiquetas.btnCancelar,
              tooltip: scope.etiquetas.tpCerrarBusquedaComprobantes,
              tabIndex: 409,
              iconCls: 'cancelar',
              scope: this
          });

          scope.btnAceptarBusqueda = new Ext.Button({
              text: scope.etiquetas.btnAceptar,
              tooltip: scope.etiquetas.tpAceptarBusqueda,
              tabIndex: 408,
              iconCls: 'aceptar',
              scope: this
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
              fieldLabel: scope.etiquetas.dfDesde,
              enableKeyEvents: true,
              tabIndex: 403,
              vtype: 'daterange',
              name: 'dfDesde',
              id: 'dfDesde',
              endDateField: 'dfHasta',
              anchor: '100%',
              readOnly: true,
              format: 'd/m/Y'
          });
          scope.dfHasta = new Ext.form.DateField({
              fieldLabel: scope.etiquetas.dfHasta,
              enableKeyEvents: true,
              vtype: 'daterange',
              startDateField: 'dfDesde',
              tabIndex: 404,
              name: 'dfHasta',
              id: 'dfHasta',
              anchor: '100%',
              allowBlank: false,
              readOnly: true,
              format: 'd/m/Y'
          });

          Ext.apply(this, {
              title: scope.etiquetas.wBuscarComprobantes,
              id: 'wBuscarComprobantes',
              constrain: true,
              plain: true,
              monitorResize: true,
              closable: false,
              modal: true,
              resizable: false,
              width: 500,
              autoHeight: true,
              constrain: true,
                      defaultButton: 0,
              items: [scope.pnlBuscar = new Ext.form.FormPanel({
                      labelAlign: 'top',
                      frame: true,
                      border: false,
                      hideBorders: true,
                      autoHeight: true,
                      bodyBorder: false,
                      items: [
                          scope.cbxEntidad,
                          {
                              layout: 'column',
                              items: [
                                  {
                                      columnWidth: .5,
                                      layout: 'form',
                                      bodyStyle: 'padding: 0 5px 0 0',
                                      items: [scope.cbxEjercicio, scope.dfDesde]
                                  },
                                  {
                                      columnWidth: .5,
                                      layout: 'form',
                                      items: [scope.cbxPeriodo, scope.dfHasta]
                                  }]
                          },
                          scope.cbxSubsistema,
                          {
                              layout: 'column',
                              items: [
                                  {
                                      columnWidth: .5,
                                      layout: 'form',
                                      bodyStyle: 'padding: 0 5px 0 0',
                                      items: [scope.cbxEstado]
                                  },
                                  {
                                      columnWidth: .5,
                                      layout: 'form',
                                      items: [scope.cbxNumero]
                                  }]
                          }]
                  })],
              buttons: [scope.btnCerrarBusqueda, scope.btnAceptarBusqueda]
          });
          return Ext.UIBuscarComprobante.superclass.constructor.call(this);
      }
  });


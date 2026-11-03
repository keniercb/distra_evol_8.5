  Ext.namespace('Ext.UICambiarNumero');
  Ext.UICambiarNumero = Ext.extend(Ext.Window,
          {
              constructor: function(scope)
              {
                  scope.btnAceptarNumero = new Ext.Button({
                      text: scope.etiquetas.btnAceptar,
                      tabIndex: 202,
                      tooltip: scope.etiquetas.tpAceptarCambio,
                      iconCls: 'aceptar',
                      scope: this
                  });

                  scope.btnCancelarNumero = new Ext.Button({
                      text: scope.etiquetas.btnCancelar,
                      tabIndex: 203,
                      tooltip: scope.etiquetas.tpCancelarCambio,
                      iconCls: 'cancelar',
                      scope: this
                  });

                  scope.tfNumeroAnterior = new Ext.form.TextField({
                      fieldLabel: scope.etiquetas.lbNumeroAnterior,
                      id: "nfNumeroAnterior",
                      tabIndex: 200,
                      disabled: true,
                      anchor: '100%',
                      maxLength: 19,
                      style: 'text-align:right'
                  });

                  scope.tfNumeroNuevo = new Ext.form.TextField({
                      fieldLabel: scope.etiquetas.lbNumeroNuevo,
                      id: "nfNumeroNuevo",
                      enableKeyEvents: true,
                      maskRe: /[0-9]$/,
                      tabIndex: 201,
                      anchor: '100%',
                      allowBlank: false,
                      maxLength: 19,
                      style: 'text-align:right'
                  });

                  Ext.applyIf(this, {
                      id: 'wCambiarNumero',
                      title: scope.etiquetas.titleCambiarNumero,
                      width: 200,
                      autoHeight: true,
                      resizable: false,
                      modal: true,
                      constrain: true,
                      defaultButton: 0,
                      items:
                              [
                                  scope.fpCambiarNumero = new Ext.form.FormPanel({
                                      labelAlign: 'top',
                                      bodyStyle: 'padding:5px 5px 0 5px',
                                      border: false,
                                      hideBorders: true,
                                      bodyBorder: false,
                                      items: [scope.tfNumeroAnterior, scope.tfNumeroNuevo]
                                  })
                              ],
                      buttons: [scope.btnCancelarNumero, scope.btnAceptarNumero]
                  });
                  return Ext.UICambiarNumero.superclass.constructor.call(this);
              }
          })
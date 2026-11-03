  Ext.namespace('Ext.FrmComprobante');

  Ext.FrmComprobante.Comprobante = Ext.extend(Ext.form.FormPanel, {
      constructor: function(scope, params)
      {
          scope.cbxSubsistema = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.textSeleccione,
              fieldLabel: scope.etiquetas.lbSubsistema,
              id: 'cbxSubsistema',
              disabledClass: 'disabled-component',
              tabIndex: 4,
              maskRe: /^([a-zA-Z]+[a-zA-Z]*)+$/,
              valueField: 'idsubsistema',
              displayField: 'denominacion',
              hiddenName: 'idsubsistema',
              enableKeyEvents: true,
              editable: true,
              forceSelection: true,
              selectOnFocus: true,
              typeAhead: true,
              allowBlank: false,
              triggerAction: 'all',
              mode: 'local',
              anchor: '100%',
              tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
              store: scope.stSubsistema = new Ext.data.Store({
                  url: scope.url + 'cargarSubsistemas',
                  reader: new Ext.data.JsonReader({}, [
                      {
                          name: 'idsubsistema'
                      }, {
                          name: 'denominacion'
                      }
                  ])
              })
          });
          scope.cbxOperacion = new Ext.form.ComboBox({
              emptyText: scope.etiquetas.textSeleccione,
              fieldLabel: scope.etiquetas.lbOperacion,
              id: 'cbxOperacion',
              disabledClass: 'disabled-component',
              tabIndex: 5,
              valueField: 'idoperacion',
              displayField: 'denominacion',
              hiddenName: 'idoperacion',
              enableKeyEvents: true,
              editable: true,
              forceSelection: true,
              selectOnFocus: true,
              typeAhead: true,
              disabled: true,
              allowBlank: false,
              triggerAction: 'all',
              mode: 'local',
              anchor: '100%',
              tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
              store: scope.stOperacion = new Ext.data.Store({
                  url: scope.url + 'cargarOperaciones',
                  reader: new Ext.data.JsonReader({}, [{
                          name: 'idoperacion',
                          mapping: 'idnomoperaciones'
                      }, {
                          name: 'denominacion'
                      }, {
                          name: 'iddocumento'
                      }, {
                          name: 'idmodelo'
                      }
                  ])
              })
          });
          scope.btnAddModelo = new Ext.Button({
              id: 'btnAddModelo',
              tooltip: scope.etiquetas.tpAdicionarModelo,
              iconCls: 'adicionar',
              disabled: true,
              enableToggle: true,
              tabIndex: 6,
              scope: this
          });
          scope.cbxDocumento = new Ext.form.ComboBox({
              fieldLabel: scope.etiquetas.lbDocumento,
              id: 'cbxDocumento',
              tabIndex: 19,
              valueField: 'iddoc',
              displayField: 'denominacion',
              hiddenName: 'iddoc',
              enableKeyEvents: true,
              editable: true,
              forceSelection: true,
              selectOnFocus: true,
              typeAhead: true,
              disabled: true,
              allowBlank: false,
              hideTrigger: true,
              mode: 'local',
              anchor: '100%',
              tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
              store: scope.stDocumento = new Ext.data.Store({
                  url: scope.url + 'cargarDocumentos',
                  reader: new Ext.data.JsonReader({}, [{
                          name: 'iddoc',
                          mapping: 'iddocumentos'
                      }, {
                          name: 'idoperacion'
                      }, {
                          name: 'denominacion'
                      }
                  ])
              })
          });
          scope.tfNumeroDocumento = new Ext.form.TextField({
              fieldLabel: scope.etiquetas.tfNumDoc,
              width: '100%',
              disabledClass: 'disabled-component',
              id: 'tfNumeroDocumento',
              name: 'tfNumeroDocumento',
              tabIndex: 7,
              //allowBlank: false,
              maxLength: 19,
              maskRe: /^([a-zA-Z0-9.\-\|\_\/]+ ?[a-zA-Z0-9.\-\|\_\/]*)+$/,
              regex: /^([a-zA-Z0-9.\-\|\_\/]+ ?[a-zA-Z0-9.\-\|\_\/]*)+$/,
              regexText: scope.etiquetas.lbRegexTextDoc,
              maxLengthText: scope.etiquetas.textMaxLength + " 19 " + scope.etiquetas.textCaracteres,
              enableKeyEvents: true
          });
          Ext.applyIf(params || this, {
              items: [
                  {
                      layout: 'column',
                      bodyStyle: 'padding:0 5px 0 5px',
                      border: false,
                      hideBorders: true,
                      bodyBorder: false,
                      items: [
                          {
                              columnWidth: .2,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.cbxSubsistema
                          }, {
                              columnWidth: .5,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.cbxOperacion
                          // }, {
                          //     layout: 'form',
                          //     style: 'margin:20 0 0 0',
                          //     items: scope.btnAddModelo
                          }, {
                              columnWidth: .3,
                              layout: 'form',
                              bodyStyle: 'padding:0 0 0 10px',
                              labelAlign: 'top',
                              items: scope.cbxDocumento
                          }
                      ]
                  },
                  scope.fpContainerRegionTopGrid = {
                      layout: 'column',
                      bodyStyle: 'padding:5px 5px 0 5px',
                      border: false,
                      hideBorders: true,
                      bodyBorder: false,
                      items: [
                          {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.tfNumeroDocumento
                          }, {
                              columnWidth: .4,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.cbxCuenta
                          }, {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.cbxMoneda
                          }, {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.cbxTasa
                          }, {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.txtFactorConversion
                          }, {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.nfDebito
                          }, {
                              columnWidth: .1,
                              layout: 'form',
                              bodyStyle: 'padding:0 10px 0 0',
                              labelAlign: 'top',
                              items: scope.nfCredito
                          },
                          scope.pnlAlignBtnAceptarPase,
                          scope.pnlAlignBtnCancelarModificacionPase
                      ]
                  }
              ]
          });
          return Ext.FrmComprobante.Comprobante.superclass.constructor.call(this, params);
      }
  });
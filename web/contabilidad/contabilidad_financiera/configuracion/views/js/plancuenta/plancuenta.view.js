  Ext.ns('Contabilidad.PlanCuenta');
  Contabilidad.PlanCuenta.Toolbar = Ext.extend(Ext.Toolbar, {
      constructor: function(params) {
          Ext.apply(this, params);
          var me = this;
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.keymapButtons = params.keymapButtons;
          this.windowsShow = false;
          this.addEvents('beforeShowWindow', 'afterDelete', 'beforeKeyMap');
          this.createButtons();
          this.initFunctions();
          return Contabilidad.PlanCuenta.Toolbar.superclass.constructor.call(this, params);
      },
      fLoadMask: function(agMsg) {
          var me = this;
          this.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || me.idioma.lbCargando
          });
          me.lMask.show();
      },
      createButtons: function() {
          var me = this;

          this.btnAdicionar = new Ext.Button({
              tabIndex: 1,
              id: 'btnAdicionar',
              text: this.idioma.lbBtnAdicionar,
              tooltip: this.idioma.lbTooltipBtnAdicionar,
              iconCls: 'adicionar'
          });

          this.btnModificar = new Ext.Button({
              tabIndex: 2,
              id: 'btnModificar',
              text: this.idioma.lbBtnModificar,
              tooltip: this.idioma.lbTooltipBtnModificar,
              disabled: true,
              iconCls: 'modificar'
          });

          this.btnEliminar = new Ext.Button({
              tabIndex: 3,
              id: 'btnEliminar',
              text: this.idioma.lbBtnEliminar,
              tooltip: this.idioma.lbTooltipBtnEliminar,
              disabled: true,
              iconCls: 'eliminar'
          });

          this.btnVistap = new Ext.Button({
              tabIndex: 4,
              id: 'btnVistap',
              text: this.idioma.lbBtnVistap,
              tooltip: this.idioma.lbTooltipBtnVistap,
              disabled: true,
              iconCls: 'vistareporte'
          });

          this.btnAyuda = new Ext.Button({
              id: 'btnHelpPlancuenta',
              tabIndex: 5,
              text: this.idioma.lbBtnAyuda,
              tooltip: this.idioma.lbTooltipBtnAyuda,
              iconCls: 'ayuda'
          });

          me.items = [this.btnAdicionar, this.btnModificar, this.btnEliminar, this.btnVistap, '->', this.btnAyuda];
      },
      initFunctions: function() {
          var me = this;

          this.btnVistap.on('click', function() {
              me.getDataPrinter();
          });

          this.getDataPrinter = function() {
              me.fLoadMask();
              Ext.Ajax.request({
                  method: "POST",
                  url: 'getDataReport',
                  params: {
                      idclasificador: me.scope.form.idclasificadorplancuenta
                  },
                  callback: function(options, success, response) {
                      var responseData = Ext.decode(response.responseText);
                      if(responseData.datoCuerpo.length > 0) {
                          me.openConfigReport(responseData);
                      } else {
                          mostrarMensaje(1, me.idioma.lbNoDataRptShow);
                      }
                      me.lMask.hide();
                  }
              });
          };
          this.openConfigReport = function(requestDataSources) {
              var printView = new SCFPrintView(requestDataSources, "/contabilidad/comun/SCFPrintView/", {
                  paperSize: "FOLIO",
                  orientation: "Horizontal",
                  reportType: "HTML"
              });
              printView.show();
          };

          this.btnAdicionar.on('click', function() {
              me.fireEvent('beforeKeyMap');
              me.fireEvent('beforeShowWindow', true);
          });

          this.btnModificar.on('click', function() {
              me.fireEvent('beforeKeyMap');
              me.fireEvent('beforeShowWindow', false);
          });

          this.btnEliminar.on('click', function() {
              me.fireEvent('beforeKeyMap');
              mostrarMensaje(2,String.fromCharCode(191) + me.idioma.lbMsgEliminar, function (btnPress) {
                  if (btnPress === 'ok') {
                      me.scope.treePlanCuenta.eliminarClasificador();
                  }
              });
          });
      }
  });

  Contabilidad.PlanCuenta.EditForm = Ext.extend(Ext.Panel, {
      constructor: function(params) {
          Ext.apply(this, params);
          var me = this;
          this.frame = true;
          this.id = 'EditForm';
          this.layout = 'form';
          this.labelAlign = 'top';
          this.buttonAlign = 'right';
          this.width = Ext.lib.Dom.getViewWidth() / 2;
          this.region = 'east';
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.autoValidate = false;
          this.idplancuenta = 0;
          this.idclasificadorplancuenta = 0;
          this.idGrupoContable = 0;
          this.nivel = 0;
          this.nivelHijo = 0;
          this.action = 'add';
          this.idpradre = null;
          this.dataFormato = new Array();
          this.nodeSelect = 0;
          this.createForm(params);
          this.initButtons();
          this.initFunctions();
          this.addEvents('beforeAction');
          return Contabilidad.PlanCuenta.EditForm.superclass.constructor.call(this, params);
      },
      createForm: function() {
          var me = this;
          this.tfNaturaleza = new Ext.form.TextField({
              tabIndex: 9,
              fieldLabel: this.idioma.lbNaturaleza,
              anchor: '100%',
              allowBlank: false,
              disabled: true,
              readOnly: true,
              enableKeyEvents: true
          });

          this.cbNaturaleza = new Ext.form.ComboBox({
              tabIndex: 14,
              id: 'cbNaturaleza',
              name: 'descripnaturaleza',
              fieldLabel: 'Naturaleza',
              emptyText: 'Seleccione...',
              tpl: '<tpl for="."><div ext:qtip="{descripnaturaleza}" class="x-combo-list-item">{descripnaturaleza}</div></tpl>',
              anchor: '100%',
              displayField: 'descripnaturaleza',
              valueField: 'idnaturaleza',
              hiddenName: 'idnaturaleza',
              disabled: true,
              typeAhead: true,
              editable: true,
              forceSelection: true,
              resizable: true,
              mode: 'local',
              triggerAction: 'all',
              allowBlank: false,
              // store: new Ext.data.Store({
              //     autoLoad: true,
              //     url: '/contabilidad/comun/xml/naturalezas.xml',
              //     reader: new Ext.data.XmlReader({
              //         record: 'row',
              //         id: 'idnaturaleza',
              //         totalRecords: '@cant'
              //     }, [{name: 'descripnaturaleza', mapping: 'naturaleza'}, 'idnaturaleza'])
              // }),

              store: new Ext.data.SimpleStore({
                  fields: ['idnaturaleza', 'descripnaturaleza'],
                  data: [
                      ['8030', 'ACREEDORA'],
                      ['8031', 'DEUDORA'],
                      ['8032', 'MIXTA']
                  ]
              }),
              listeners: {
                  'select': function () {
                      me.ComprobarCampos();
                  }
              }
          });

          this.tfTipoCuenta = new Ext.form.TextField({
              id: 'tfTipoCuenta',
              fieldLabel: 'Tipo de Cuenta',
              anchor: '100%',
              allowBlank: false,
              enableKeyEvents: true
          });

          this.stTipoCuenta = new Ext.data.Store({
              reader: new Ext.data.JsonReader({
                      id: 'idtipocuenta',
                  }, [
                      {name: 'idtipocuenta'},
                      {name: 'descripcion'}
                  ]
              )
          });

          Ext.Ajax.request({
              url: 'loadDataTCuenta',
              method: 'POST',
              scope: this,
              callback: function (options, success, response) {
                  this.responseDataTipoCta = Ext.decode(response.responseText);
                  this.stTipoCuenta.loadData(this.responseDataTipoCta);
              }
          });

          this.cbTipoCuenta = new Ext.form.ComboBox({
              id: 'cbTipoCuenta',
              name: 'descripcion',
              disabled: true,
              editable: false,
              typeAhead: true,
              tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
              allowBlank: false,
              emptyText: 'Seleccione...',
              resizable: true,
              valueField: 'idtipocuenta',
              displayField: 'descripcion',
              hiddenName: 'idtipocuenta',
              triggerAction: 'all',
              forceSelection: true,
              mode: 'local',
              anchor: '100%',
              store: this.stTipoCuenta,
              fieldLabel: 'Tipo de cuenta',
              listeners: {
                  'select': function () {
                      me.ComprobarCampos();
                  }
              }
          });

          this.tfMoneda = new Ext.form.TextField({
              id: 'tfMoneda',
              fieldLabel: 'Moneda',
              anchor: '100%',
              allowBlank: false,
              enableKeyEvents: true
          });

          this.stMoneda = new Ext.data.Store({
              reader: new Ext.data.JsonReader({
                      id: 'idmoneda',
                  }, [{name: 'codigoiso'},
                      {name: 'idmoneda'},
                      {name: 'tipomoneda'}
                  ]
              )
          });

          Ext.Ajax.request({
              url: 'loadDataMoneda',
              method: 'POST',
              scope: this,
              callback: function (options, success, response) {
                  this.responseDataMoneda = Ext.decode(response.responseText);
                  this.stMoneda.loadData(this.responseDataMoneda);
              }
          });

          this.cbMoneda = new Ext.form.ComboBox({
              tabIndex: 16,
              id: 'cbMoneda',
              name: 'codigoiso',
              fieldLabel: 'Moneda',
              emptyText: 'Seleccione...',
              tpl: '<tpl for="."><div ext:qtip="{codigoiso}" class="x-combo-list-item">{codigoiso}</div></tpl>',
              anchor: '100%',
              displayField: 'codigoiso',
              valueField: 'idmoneda',
              hiddenName: 'idmoneda',
              disabled: true,
              typeAhead: true,
              editable: false,
              forceSelection: true,
              resizable: true,
              mode: 'local',
              triggerAction: 'all',
              allowBlank: false,
              store: me.stMoneda,
              listeners: {
                  'select': function () {
                      me.ComprobarCampos();
                  }
              }
          });

          this.cbxGrupoContable = new Ext.CONT.UIXCombo({
              fieldLabel: this.idioma.lbGrupoContable,
              emptyText: this.idioma.lbSeleccione,
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              allowBlank: false,
              anchor: '100%',
              hiddenTbar: true,
              tabIndex: 9,
              disabled: true,
              resizable: true,
              filter: 'text'
          }, {
              identificador: 'GrupoContable',
              displayText: 'text',
              url: 'loadGrupoContable',
              autoLoad: true,
              singleSelect: false,
              reader: new Ext.data.JsonReader({
                  id: 'id',
                  root: 'datos'
              }, [{
                      name: 'text'
                  }, {
                      name: 'codigo',
                      mapping: 'text'
                  }, {
                      name: 'id'
                  }, {
                      name: 'idnaturaleza'
                  }, {
                      name: 'naturaleza'
                  }, {
                      name: '_parent'
                  }, {
                      name: '_is_leaf',
                      mapping: 'leaf'
                  }]
              )
          });

        Ext.getCmp('gpGrupoContable').getSelectionModel().on({
            rowselect: function(xSelModel, xIndex, xRecords) {
                if(xSelModel.hasSelection()) {
                    me.btnGuardar.enable();
                    me.validarForm();
                    me.cbNaturaleza.enable();
                    me.cbNaturaleza.setValue(xSelModel.getSelected().data.idnaturaleza);
                    me.cbNaturaleza.setRawValue(xSelModel.getSelected().data.naturaleza);

                    Ext.getCmp('cbxGrupoContable').setValue(xSelModel.getSelected().data.text);
                    Ext.getCmp('cbxGrupoContable').fSelect.values.push(xSelModel.getSelected().data.id);
                    Ext.getCmp('cbxGrupoContable').fSelect.display.push(xSelModel.getSelected().data.text);
                    me.idGrupoContable = xSelModel.getSelected().data.id;
                 }
            },
            rowdeselect: function(xSelModel, xIndex, xRecords) {
                Ext.getCmp('cbxGrupoContable').reset();
                me.cbNaturaleza.reset();
                me.cbMoneda.reset();
                me.cbTipoCuenta.reset();
                Ext.getCmp('cbxGrupoContable').fSelect.values = new Array();
                Ext.getCmp('cbxGrupoContable').fSelect.display = new Array();
                me.idGrupoContable = 0;
              }
          });

          this.tfCodigo = new Ext.form.TextField({
              tabIndex: 10,
              fieldLabel: this.idioma.lbCodigo,
              anchor: '100%',
              disabled: true,
              allowBlank: false,
              enableKeyEvents: true,
              blankText: this.idioma.lbCampoObligatorio,
              regex: /^[0-9]/,
              maskRe: /^[0-9]/,
              invalidText: this.idioma.lbInvalidAlphaNum,
              regexText: this.idioma.lbInvalidAlphaNum
          });

          this.tfNombre = new Ext.form.TextField({
              tabIndex: 11,
              fieldLabel: this.idioma.lbNombre,
              anchor: '100%',
              allowBlank: false,
              maxLength: 50,
              maxLengthText: String.format(this.idioma.textMaxLength,50),
              disabled: true,
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
              regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
              blankText: this.idioma.lbCampoObligatorio,
              enableKeyEvents: true
          });

          this.tfDescripcion = new Ext.form.TextArea({
              tabIndex: 12,
              fieldLabel: this.idioma.lbDescripcion,
              anchor: '100%',
              allowBlank: false,
              maxLength: 255,
              maxLengthText: String.format(this.idioma.textMaxLength,255),
              disabled: true,
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
              regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
              blankText: this.idioma.lbCampoObligatorio,
              enableKeyEvents: true
          });

          this.tfFormato = new Ext.form.TextField({
              tabIndex: 13,
              fieldLabel: this.idioma.lbFormato,
              anchor: '100%',
              blankText: this.idioma.lbCampoObligatorio,
              readOnly: true
          });

          this.tfNivelFormato = new Ext.form.TextField({
              tabIndex: 15,
              fieldLabel: this.idioma.lbNivelFormato,
              anchor: '100%',
              readOnly: true
          });

          this.tfVpFormato = new Ext.form.TextField({
              tabIndex: 14,
              fieldLabel: this.idioma.lbVistaprevia,
              anchor: '100%',
              readOnly: true
          });

          this.tfVpNivelFormato = new Ext.form.TextField({
              tabIndex: 16,
              fieldLabel: this.idioma.lbVistaprevia,
              anchor: '100%',
              readOnly: true
          });

          this.items = [{
              layout: 'column',
              anchor: '100%',
              items: [{
                  columnWidth: .4,
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.cbxGrupoContable]
              }, {
                  columnWidth: .2,
                  style: 'margin:0 0 0 10',
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.cbNaturaleza]
              }, {
                  columnWidth: .4,
                  style: 'margin:0 0 0 10',
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.cbMoneda]
              }]
          }, {
              layout: 'column',
              anchor: '100%',
              items: [{
                  columnWidth: .2,
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.tfCodigo]
              }, {
                  columnWidth: .4,
                  style: 'margin:0 0 0 10',
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.tfNombre]
              },
                  {
                      columnWidth: .4,
                      style: 'margin:0 0 0 10',
                      layout: 'form',
                      labelAlign: 'top',
                      items: [this.cbTipoCuenta]
                  }]
          }, {
              layout: 'fit',
              anchor: '100%',
              items: [{
                  columnWidth: .1,
                  layout: 'form',
                  labelAlign: 'top',
                  items: [this.tfDescripcion]
              }]
          }, new Ext.form.FieldSet({
              title: this.idioma.lbInfoFormato,
              autoHeight: true,
              items: [{
                  layout: 'column',
                  anchor: '100%',
                  items: [{
                      columnWidth: .5,
                      layout: 'form',
                      labelAlign: 'top',
                      items: this.tfFormato
                      }, {
                          columnWidth: .5,
                          layout: 'form',
                          style: 'margin:0 0 0 10',
                          labelAlign: 'top',
                          items: this.tfVpFormato
                      }]
              }, {
                  layout: 'column',
                  anchor: '100%',
                  items: [{
                      columnWidth: .5,
                      layout: 'form',
                      labelAlign: 'top',
                      items: this.tfNivelFormato
                  }, {
                      columnWidth: .5,
                      layout: 'form',
                      style: 'margin:0 0 0 10',
                      labelAlign: 'top',
                      items: this.tfVpNivelFormato
                  }]
              }]
          })];

          this.keys = this.kmPlancuenta = new Ext.KeyMap(Ext.getBody(), [
              {
                  alt: true,
                  key: 'n',
                  fn: function() {
                      if(!Ext.getCmp('btnNuevo').disabled)
                          Ext.getCmp('btnNuevo').fireEvent('click');
                  },
                  scope: me
              }, {
                  alt: true,
                  key: 'g',
                  fn: function() {
                      if(!Ext.getCmp('btnGuardar').disabled)
                          Ext.getCmp('btnGuardar').fireEvent('click');
                  },
                  scope: me
              }, {
                  key: Ext.EventObject.DELETE,
                  fn: function() {
                      if(!Ext.getCmp('btnEliminar').disabled)
                          Ext.getCmp('btnEliminar').fireEvent('click');
                  },
                  scope: me
              }
          ]);
      },
      initButtons: function() {
          this.btnNuevo = new Ext.Button({
              tabIndex: 7,
              id: 'btnNuevo',
              iconCls: 'nuevo',
              disabled: true,
              text: this.idioma.lbBtnNuevo,
              tooltip: this.idioma.lbTooltipNuevo
          });

          this.btnGuardar = new Ext.Button({
              tabIndex: 17,
              id: 'btnGuardar',
              iconCls: 'guardar',
              disabled: true,
              text: this.idioma.lbBtnGuardar,
              tooltip: this.idioma.lbTooltipGuardar
          });

          this.btnEliminar = new Ext.Button({
              tabIndex: 18,
              id: 'btnEliminar',
              iconCls: 'eliminar',
              disabled: true,
              text: this.idioma.lbBtnEliminar,
              tooltip: this.idioma.lbTooltipEliminarCta
          });

          this.buttons = [this.btnNuevo, this.btnGuardar, this.btnEliminar];
      },
      initFunctions: function() {
          var me = this;
          this.loadFormatos = function() {
              Ext.Ajax.request({
                  url: 'loadFormatos',
                  callback: function(options, success, response) {
                      responseData = Ext.decode(response.responseText);
                      me.dataFormato = responseData[0];
                  }
              });
          };

          this.activeButtons = function(leaf) {
              me.btnEliminar.setDisabled((leaf) ? false : true);
              me.btnGuardar.setDisabled(true);
          };

          this.setValuesComponent = function(n) {
              if(n.attributes.idplancuenta) {
                  me.action = 'mod';
                  me.tfCodigo.setValue(n.attributes.codigo);
                  if(n.attributes.leaf)
                      me.tfCodigo.enable();
                  else
                      me.tfCodigo.disable();
                           me.tfNombre.setValue(n.attributes.nombre);
                          me.cbTipoCuenta.setValue(n.attributes.idtipocuenta);
                          me.cbTipoCuenta.enable();
                          me.cbMoneda.setValue(n.attributes.idmoneda);
                          me.cbMoneda.enable();
                          me.tfDescripcion.setValue(n.attributes.descripcion);
                          me.cbxGrupoContable.reset();
                          Ext.getCmp('cbxGrupoContable').setValue(n.attributes.grupo);
                          Ext.getCmp('cbxGrupoContable').fSelect.values.push(n.attributes.idgrupo);
                          Ext.getCmp('cbxGrupoContable').fSelect.display.push(n.attributes.grupo);
                          me.cbNaturaleza.setValue(n.attributes.idnaturaleza);
                          me.tfNombre.enable();
                          me.tfDescripcion.enable();
                          me.cbxGrupoContable.enable();
                          me.cbNaturaleza.enable();
                          me.validCode = true;

                          var nivel = n.attributes.nivel;
                          me.tfNivelFormato.setValue(n.attributes.formato.partes[nivel - 1].nombre);
                          me.tfVpNivelFormato.setValue(n.attributes.formato.partes[nivel - 1].vistap);
                          this.activeButtons(n.attributes.leaf);
              } else {
                  me.tfCodigo.disable();
                  me.tfNombre.disable();
                  me.tfDescripcion.disable();
                  me.cbxGrupoContable.disable();
                  me.cbNaturaleza.disable();
                  me.cbTipoCuenta.disable();
                  me.cbMoneda.disable();
                  me.validCode = false;
              }
              me.tfFormato.setValue(n.attributes.formato.nombre);
              me.tfVpFormato.setValue(n.attributes.formato.vistap);
          };

          this.setVarConfig = function(n) {
              me.idclasificadorplancuenta = me.nodeSelect.attributes.idclasificadorplancuenta;
              me.nivel = (me.nodeSelect.attributes.nivel) ? parseFloat(me.nodeSelect.attributes.nivel) : 0;
              me.formato = (me.nodeSelect.attributes.formato) ? me.nodeSelect.attributes.formato : me.formato;
              if(n) {
                  me.nivelHijo = 1;
                  me.idpadre = (me.nodeSelect.attributes.idpadre) ? me.nodeSelect.attributes.idpadre : null;
                  me.idplancuenta = (me.nodeSelect.attributes.idplancuenta) ? me.nodeSelect.attributes.idplancuenta : 0;
                  me.idGrupoContable = (me.nodeSelect.attributes.idgrupo) ? me.nodeSelect.attributes.idgrupo : 0;
              } else {
                  me.cbNaturaleza.reset();
                  me.cbMoneda.reset();
                  me.cbTipoCuenta.reset();
                  me.tfCodigo.reset();
                  me.tfDescripcion.reset();
                  me.tfNombre.reset();
                  me.cbxGrupoContable.reset();
                  me.tfVpFormato.reset();
                  me.tfVpNivelFormato.reset();
                  me.tfFormato.reset();
                  me.tfNivelFormato.reset();
              }
          };

          this.btnNuevo.on('click', function(button, e) {
              me.nivelHijo = me.nivel + 1;
              if(me.nivelHijo > 2) {
                  mostrarMensaje(1, me.idioma.msgLimitNivel);
                  return;
              }
              me.action = 'add';
              me.tfCodigo.reset();
              me.tfCodigo.enable();
              me.tfDescripcion.enable();
              me.tfNombre.enable();
              me.tfCodigo.reset();
              me.tfDescripcion.reset();
              me.tfNombre.reset();
              me.cbxGrupoContable.enable();
              me.cbxGrupoContable.focus(false, 500);
              me.tfDescripcion.reset();
              me.tfNombre.reset();
              me.cbNaturaleza.enable();
              me.cbTipoCuenta.enable();
              me.cbMoneda.enable();


              me.tfNivelFormato.reset();
              me.tfVpNivelFormato.reset();
              me.btnGuardar.setDisabled(true);
              me.idplancuenta = 0;
              me.idpadre = me.nodeSelect.attributes.idplancuenta;
              me.cbxGrupoContable.focus();
              Ext.getCmp('btnEliminar').setDisabled(true);
          });

          this.btnGuardar.on('click', function() {
              if(me.cbNaturaleza.isValid() && me.cbxGrupoContable.isValid() && me.tfCodigo.isValid()
                  && me.validCode && me.tfDescripcion.isValid() && me.tfNombre.isValid()) {
                  // if(me.nodeSelect.attributes.idnaturaleza != me.cbNaturaleza.getValue() || me.nodeSelect.attributes.codigo != me.tfCodigo.getValue() || me.nodeSelect.attributes.nombre != me.tfNombre.getValue() || me.nodeSelect.attributes.descripcion != me.tfDescripcion.getValue() || me.nodeSelect.attributes.idgrupo != (me.idGrupoContable)) {
                  if(me.nodeSelect.attributes.idmoneda != me.cbMoneda.getValue()
                      || me.nodeSelect.attributes.idtipocuenta != me.cbTipoCuenta.getValue()
                      || me.nodeSelect.attributes.idnaturaleza != me.cbNaturaleza.getValue()
                      || me.nodeSelect.attributes.codigo != me.tfCodigo.getValue()
                      || me.nodeSelect.attributes.nombre != me.tfNombre.getValue()
                      || me.nodeSelect.attributes.descripcion != me.tfDescripcion.getValue()
                      || me.nodeSelect.attributes.idgrupo != (me.idGrupoContable)) {
                      var concat = "";
                      if(me.nivel == 1 && me.action == 'add')
                          concat = me.nodeSelect.attributes.codigo + me.nodeSelect.attributes.formato.separador + me.tfCodigo.getValue();
                      else if(me.nivel == 2 && me.action == 'mod')
                          concat = me.nodeSelect.parentNode.attributes.codigo + me.nodeSelect.attributes.formato.separador + me.tfCodigo.getValue();
                      else
                          concat = me.tfCodigo.getValue();

                      var params = {
                          idplancuenta: me.idplancuenta,
                          idnaturaleza: me.cbNaturaleza.getValue(),
                          idclasificadorplancuenta: me.idclasificadorplancuenta,
                          idgrupo: me.idGrupoContable,
                          idpadre: me.idpadre,
                          nivel: (me.action == 'mod') ? parseInt(me.nivel) : me.nivelHijo,
                          nombre: me.tfNombre.getValue(),
                          codigo: me.tfCodigo.getValue(),
                          descripcion: me.tfDescripcion.getValue(),
                          idmoneda: me.cbMoneda.getValue(),
                          idtipocuenta: me.cbTipoCuenta.getValue(),
                          concatcuenta: concat
                      };
                      Ext.MessageBox.wait(me.idioma.lbWaitMsgGrupo, me.idioma.lbEspere);
                      Ext.Ajax.request({
                          url: 'savePlanCuenta',
                          params: params,
                          callback: function(options, success, response) {
                              Ext.MessageBox.hide();
                              responseData = Ext.decode(response.responseText);
                              var msg = (responseData.msg === 1) ? me.idioma.lbMsgGuardado : me.idioma.lbMsgErrorGuardar;
                              mostrarMensaje(responseData.msg, msg);
                              if(responseData.success == true) {
                                  if(me.nivel != 0) {
                                      me.scope.treePlanCuenta.reloadNodePadre(me.idclasificadorplancuenta);
                                  }
                                  else {
                                      me.scope.treePlanCuenta.searchPlanCuenta('');
                                  }
                                  me.setVarConfig(0);

                                  me.scope.menuBar.btnModificar.setDisabled(true);
                                  me.scope.menuBar.btnEliminar.setDisabled(true);
                                  me.btnGuardar.setDisabled(true);
                                  me.btnNuevo.setDisabled(true);
                                  me.tfCodigo.disable();
                                  me.tfNombre.disable();
                                  me.tfDescripcion.disable();
                                  me.cbxGrupoContable.disable();
                                  me.cbNaturaleza.disable();
                                  me.cbTipoCuenta.disable();
                                  me.cbMoneda.disable();
                              }
                          }
                      });
                  } else
                      mostrarMensaje(1, me.idioma.msgDatosNoModificados);
              } else
                  mostrarMensaje(1, me.idioma.msgDatosIncorrectos);
          });

          this.btnEliminar.on('click', function() {
              mostrarMensaje(2,String.fromCharCode(191) + me.idioma.lbMsgPlanEliminar, function (btnPress) {
                  if (btnPress === 'ok') {
                      me.deleteCuenta();
                  }
              });
          });

          this.deleteCuenta = function() {
              Ext.MessageBox.wait(me.idioma.lbWaitMsgDeletePlan, me.idioma.lbEspere);
              Ext.Ajax.request({
                  url: 'deletePlanCuenta',
                  params: {idplancuenta: me.idplancuenta},
                  callback: function(options, success, response) {
                      Ext.MessageBox.hide();
                      responseData = Ext.decode(response.responseText);
                      var msg = (responseData.msg === 1) ? me.idioma.lbMsgPlanEliminado : ((responseData.msg === 2) ? me.idioma.lbMsgEnUso : me.idioma.lbMsgErrorEliminar);
                      mostrarMensaje(1, msg);
                      if(responseData.success == true) {
                          if(me.nivel > 0) {
                              me.scope.treePlanCuenta.reloadNodePadre(me.idclasificadorplancuenta);
                              me.scope.treePlanCuenta.searchPlanCuenta('');
                          }
                          else {
                              me.scope.treePlanCuenta.searchPlanCuenta('');
                          }
                          me.setVarConfig(0);
                          me.btnGuardar.setDisabled(true);
                          me.btnEliminar.setDisabled(true);
                          me.btnNuevo.setDisabled(true);
                          me.tfCodigo.disable();
                          me.tfNombre.disable();
                          me.tfDescripcion.disable();
                          me.cbxGrupoContable.disable();
                          me.cbNaturaleza.disable();
                          me.cbTipoCuenta.disable();
                          me.cbMoneda.disable();
                      }
                  }
              });
          };

          this.validateCodigo = function(tf) {
              var me = this;
              var length = me.tfCodigo.getValue().toString().length;
              var lengthFormato = 0;
              if(me.action == 'add')
                  lengthFormato = me.formato.partes[me.nivelHijo - 1].vistap.toString().length;
              else if(me.nivel != 0)
                  lengthFormato = me.formato.partes[me.nivel - 1].vistap.toString().length;
              else
                  lengthFormato = me.formato.partes[0].vistap.toString().length;
              if(length > lengthFormato) {
                  tf.markInvalid("El tama&ntilde;o m&aacute;ximo requerido es " + lengthFormato + " d&iacute;gitos.");
                  me.validCode = false;
              } else {
                  me.validCode = true;
              }
          };

          me.tfCodigo.on({
              blur: function(tf) {
                  me.validateCodigo(tf);
              },
              focus: function(tf) {
                  me.validateCodigo(tf);
              },
              keyup: function(tf) {
                  me.validateCodigo(tf);
                  me.ComprobarCampos();
                  me.validarForm();
              }
          });

          me.cbxGrupoContable.on('select', function() {
              me.btnGuardar.setDisabled(false);
              me.ComprobarCampos();
              me.validarForm();
          });

          me.cbNaturaleza.on('change', function() {
              //me.ComprobarCampos();
              me.validarForm();
          });

          me.tfNombre.on('keyup', function() {
              me.ComprobarCampos();
              me.validarForm();
          });

          me.cbTipoCuenta.on('select', function() {
              me.ComprobarCampos();
              me.validarForm();
          });

          me.cbMoneda.on('select', function() {
              me.ComprobarCampos();
              me.validarForm();
          });

          me.tfDescripcion.on('keyup', function() {
              me.ComprobarCampos();
              me.validarForm();
          });

          this.ComprobarCampos = function() {
              if(me.nodeSelect.attributes.idnaturaleza != me.cbNaturaleza.getValue() || me.nodeSelect.attributes.idmoneda != me.cbMoneda.getValue() ||me.nodeSelect.attributes.idtipocuenta != me.cbTipoCuenta.getValue() || me.nodeSelect.attributes.codigo != me.tfCodigo.getValue() || me.nodeSelect.attributes.nombre != me.tfNombre.getValue() || me.nodeSelect.attributes.descripcion != me.tfDescripcion.getValue() || me.nodeSelect.attributes.idgrupo != (me.idGrupoContable) && (me.cbxGrupoContable.getValue() !='' &&  me.tfCodigo.getValue().length ==3 && me.tfNombre !='' && me.cbNaturaleza.getValue() !='' && me.tfDescripcion.getValue() !='' ))
              {
                  me.btnGuardar.setDisabled(false);
              } else {
                  me.btnGuardar.setDisabled(true);
              }
          };

          this.validarForm = function() {
              var textReq = me.formato.partes[me.nivelHijo - 1].vistap.toString().length;

              if(me.cbxGrupoContable.isValid() && me.cbMoneda.isValid() && me.cbTipoCuenta.isValid()
                  && me.tfCodigo.getValue().length <=textReq &&  me.tfCodigo.getValue().length > 0
                  && me.tfNombre.isValid() && me.tfDescripcion.isValid() )
              {
                  me.btnGuardar.setDisabled(false);
              } else {
                  me.btnGuardar.setDisabled(true);
              }
          };
      }
  });

  Contabilidad.PlanCuenta.TreePlanCuenta = Ext.extend(Ext.tree.TreeGrid, {
      constructor: function(params) {
          Ext.apply(this, params);
          var me = this;
          this.idioma = params.idioma;
          this.perfil = params.perfil;
          this.rootVisible = false;
          this.region = 'center';
          this.border = false;
          this.isSearch = false;
          this.lMask;
          this.useArrows = false;
          this.lines = true;
          this.cls = 'hidden-icon';
          this.createItems();
          this.initFunctions();
          this.initializeEvents();
          Contabilidad.PlanCuenta.TreePlanCuenta.superclass.constructor.call(this);
      },
      fLoadMask: function(agMsg) {
          var me = this;
          this.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || me.idioma.lbCargando
          });
          me.lMask.show();
      },
      createItems: function() {
          var me = this;
          this.dataUrl = 'loadClasificadorPlanCuenta';
          this.sField = new Ext.Cont.SearchField({
              id: 'sField',
              tabIndex: 6,
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              remaskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
              regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
              fnOnSearch: function() {
                  me.searchPlanCuenta(me.sField.getRawValue());
              },
              fnOnClear: function() {
                  me.searchPlanCuenta(me.sField.getRawValue());
                  /*Evento del Clrear*/
              }
          });

          this.tbar = [this.sField];
          this.columns = [
              {
                  header: me.idioma.lbColumClasificador,
                  dataIndex: 'text',
                  width: '60',
                  sortable: true
              }, {
                  header: me.idioma.lbDescripcion,
                  dataIndex: 'descripcion',
                  width: '40',
                  sortable: true
              }
          ];
          this.root = new Ext.tree.AsyncTreeNode({
              id: '0',
              text: me.idioma.lbRootGrupo,
              expanded: true,
              uiProvider: Ext.ux.tree.TreeGridNodeUI
          });
      },
      initFunctions: function() {
          var me = this;
          this.searchPlanCuenta = function(filter) {
              me.fLoadMask();
              me.getLoader().baseParams = {
                  filter: filter
              };
              me.getLoader().load(me.root, function() {
                  if(me.root.childNodes.length == 0)
                      mostrarMensaje(1, me.idioma.lbNoDataSearch);
                  me.root.expand();
                  me.lMask.hide();
              });
          };
          this.reloadNodePadre = function(parent) {
              me.fLoadMask();
              var parentNode = me.getNodeById(parent);

              me.getLoader().load(parentNode, function() {
                  parentNode.expand();
                  me.lMask.hide();
              });
          };
          this.eliminarClasificador = function() {
              Ext.MessageBox.wait(me.idioma.lbWaitMsgDelete, me.idioma.lbEspere);
              Ext.Ajax.request({
                  url: 'deleteClasificadorPlanCuenta',
                  params: {
                      idClasificador: me.scope.form.nodeSelect.attributes.id
                  },
                  callback: function(options, success, response) {
                      Ext.MessageBox.hide();
                      responseData = Ext.decode(response.responseText);
                      var msg = (responseData.msg === 1) ? me.idioma.lbMsgEliminado : ((responseData.msg === 2) ? me.idioma.lbMsgEnUso : me.idioma.lbMsgErrorEliminar);
                      mostrarMensaje(1, msg);
                      if(responseData.success == true) {
                          me.getLoader().load(me.root, function() {
                              if(me.root.childNodes.length == 0){
                                  me.scope.form.btnNuevo.disable();
                                  me.scope.form.tfFormato.reset();
                                  me.scope.form.tfVpFormato.reset();
                                  me.scope.menuBar.btnModificar.setDisabled(true);
                                  me.scope.menuBar.btnEliminar.setDisabled(true);
                                  }
                              me.root.expand();
                          });
                      }
                      me.scope.menuBar.btnModificar.setDisabled(true);
                      me.scope.menuBar.btnEliminar.setDisabled(true);
                  }
              });
          };
      },
      initializeEvents: function() {
          var me = this;
          this.beforeAction = function(node) {
              me.fLoadMask();
              var idparent = (node.attributes.idgrupopadre != null) ? node.attributes.idgrupopadre : 0;
              var parent = (idparent == node.attributes.idgrupo) ? 0 : idparent;
              var parentNode = me.getNodeById(parent);
              me.getLoader().load(parentNode, function() {
                  parentNode.expand();
                  me.lMask.hide();
              });
              me.selModel.select(parentNode);
              me.fireEvent('click', parentNode);
          };

      }
  });

  Contabilidad.PlanCuenta.WindowPlanCuenta = Ext.extend(Ext.Window, {
      constructor: function(params) {
          Ext.apply(this, params);
          var me = this;
          this.id = 'winPlanCuenta',
          this.title = (params.action) ? this.idioma.lbTitleAdicionar : this.idioma.lbTitleModificar;
          this.constrain = true;
          this.defaultButton = 0;
          this.lMask;
          this.action = params.action;
          this.height = 270;
          this.autoValidate = false;
          this.width = 350;
          this.closeAction = 'close';
          this.validCode = false;
          this.modal = true;
          this.scope = params.scope;
          this.addEvents('beforeAction');
          this.createForm();
          this.initButtons();
          this.initFunctions();
          this.initializeEvents();
          Contabilidad.PlanCuenta.WindowPlanCuenta.superclass.constructor.call(this);
      },
      fLoadMask: function(agMsg) {
          var me = this;
          this.lMask = new Ext.LoadMask(Ext.getBody(), {
              msg: agMsg || me.idioma.lbCargando
          });
          me.lMask.show();
      },
      createForm: function() {
          var me = this;

          this.tfNombre = new Ext.form.TextField({
              tabIndex:20,
              id: 'tfNombre',
              fieldLabel: this.idioma.lbNombre,
              anchor: '100%',
              maxLength: 50,
              // maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\;\.\:\#\(\)\*\&\+\/\s\,\-]+$/,
              // regex: /^([0-9a-zA-Z\"\-\_\/\#\:\&\;\+\*\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
              maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+)([-\s]?[a-zA-ZÁÉÍÓÚáéíóúñüÑ])*$/,
              regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+)([-\s]?[a-zA-ZÁÉÍÓÚáéíóúñüÑ])*$/,
              allowBlank: false,
              blankText: this.idioma.lbCampoObligatorio,
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              maxLengthText: String.format(this.idioma.textMaxLength,50),
              enableKeyEvents: true,
              listeners: {
                  'invalid': function(cmp, msg) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }/*,
                  'blur': function(cmp) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }*/
              }
          });

          this.tfDescripcion = new Ext.form.TextArea({
              tabIndex:21,
              id: 'tfDescripcion',
              fieldLabel: this.idioma.lbDescripcion,
              anchor: '100%',
              maxLength: 255,
              allowBlank: false,
              maxLengthText: String.format(this.idioma.textMaxLength,255),
              invalidText: this.idioma.lbInvalidText,
              regexText: this.idioma.lbInvalidText,
              blankText: this.idioma.lbCampoObligatorio,
              maskRe: /^[a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\.\#\/\s\,\%\-]+$/,
              regex: /^([0-9a-zA-Z\"\-\_\/\(\)\.\,\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1-]+ ?)+$/,
              enableKeyEvents: true,
              /*listeners: {
                  'blur': function(cmp) {
                      if(cmp.getValue().length > 0) {
                          var vtext = cmp.getValue().trim();
                          cmp.setValue(vtext);
                      }
                  }
              }*/
          });

          this.tfFormato = new Ext.form.TextField({
              id: 'tfFormato',
              fieldLabel: this.idioma.lbFormato,
              anchor: '100%',
              allowBlank: false,
              enableKeyEvents: true
          });

          this.stFormato = new Ext.data.Store({
              url: 'loadDataFormatos',
              reader: new Ext.data.JsonReader({
                  root: 'datos'
              }, [{
                      name: 'idformato'
                  }, {
                      name: 'nombre'
                  }, {
                      name: 'descripcion'
                  }
              ])
          });

          this.stFormato.on({
              load: function() {
                  me.show();
                  me.formPlanCuenta.getForm().isValid();
                  if(!me.action)
                      me.btnAplicar.hide();
                  me.lMask.hide();
              }
          });

          this.cbFormato = new Ext.form.ComboBox({
              tabIndex:22,
              fieldLabel: this.idioma.lbFormato,
              emptyText: this.idioma.lbSeleccione,
              loadingText: this.idioma.lbCargando,
              id: 'cbFormato',
              store: this.stFormato,
              valueField: 'idformato',
              displayField: 'nombre',
              disabledClass: 'disabled-component',
              anchor: '100%',
              resizable: true,
              typeAhead: true,
              editable: false,
              triggerAction: 'all',
              mode: 'local',
              allowBlank: false,
              blankText: this.idioma.lbCampoObligatorio,
              enableKeyEvents: true
          });

          this.formPlanCuenta = new Ext.form.FormPanel({
              autoHeight: true,
              frame: true,
              layout: 'form',
              items: [{
                  layout: 'form',
                  anchor: '100%',
                  items: [{
                      layout: 'form',
                      columnWidth: .1,
                      labelAlign: 'top',
                      items: [this.tfNombre]
                  }, {
                      layout: 'form',
                      columnWidth: .1,
                      labelAlign: 'top',
                      items: [this.tfDescripcion]
                  }, {
                      layout: 'form',
                      columnWidth: .1,
                      labelAlign: 'top',
                      items: [this.cbFormato]
                  }]
              }]
          });
          me.items = this.formPlanCuenta;
      },
      initButtons: function() {
          this.btnCancelar = new Ext.Button({
              tabIndex:23,
              iconCls: 'cancelar',
              text: this.idioma.lbBtnCancelar,
              tooltip: this.idioma.lbToolTipCancelar
          });

          this.btnAplicar = new Ext.Button({
              tabIndex:24,
              iconCls: 'aplicar',
              id: 'apli',
              text: this.idioma.lbBtnAplicar,
              disabled: true,
              tooltip: this.idioma.lbToolTipAplicar
          });

          this.btnAceptar = new Ext.Button({
              tabIndex:25,
              iconCls: 'aceptar',
              text: this.idioma.lbBtnAceptar,
              disabled: true,
              tooltip: this.idioma.lbToolTipAceptar
          });

          this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
      },
      initializeEvents: function() {
          var me = this;
          this.btnAceptar.on('click', function(button, e) {
              if(me.formPlanCuenta.getForm().isValid()) {
                  this.addmodClasificador(me.idioma);
              } else
                  mostrarMensaje(1, me.idioma.msgDatosIncorrectos);
          }, this);

          this.btnAplicar.on('click', function() {
              if(me.formPlanCuenta.getForm().isValid()) {
                  this.addmodClasificador(me.idioma, 'apl');
                  this.btnAplicar.disable();
                  this.btnAceptar.disable();
              }
              else
                  mostrarMensaje(1, me.idioma.msgDatosIncorrectos);
          }, this);

          this.btnCancelar.on('click', function(button, e) {
              this.close();
          }, this);

          this.ComprobarCampos = function() {
              if(me.tfNombre.isValid() && me.tfDescripcion.isValid() && me.cbFormato.isValid()) {
                  me.btnAplicar.setDisabled(false);
                  me.btnAceptar.setDisabled(false);
              } else {
                  me.btnAplicar.setDisabled(true);
                  me.btnAceptar.setDisabled(true);
              }
          };

          this.toggleBtnAceptar = function() {
              var attr = me.scope.treePlanCuenta.getSelectionModel().getSelectedNode().attributes;
              if(me.formPlanCuenta.getForm().isValid()) {
                  if(me.action == true) {
                      me.btnAceptar.enable();
                      me.btnAplicar.enable();
                  } else if(me.action == false) {
                      if(attr.nombre != me.formPlanCuenta.getForm().getValues().tfNombre || attr.descripcion != me.formPlanCuenta.getForm().getValues().tfDescripcion || attr.idformato != me.cbFormato.getValue()) {
                          me.btnAceptar.enable();
                      } else {
                          me.btnAceptar.disable();
                      }
                  }
              } else {
                  me.btnAplicar.disable();
                  me.btnAceptar.disable();
              }
          };

          me.tfNombre.on('keyup', function() {
              me.ComprobarCampos();
              if(me.action == false)
                  me.toggleBtnAceptar();
          });

          me.tfDescripcion.on('keyup', function() {
              me.ComprobarCampos();
              if(me.action == false)
                  me.toggleBtnAceptar();
          });

          me.cbFormato.on('select', function() {
              me.ComprobarCampos();
              if(me.action == false)
                  me.toggleBtnAceptar();
          });
      },
      initFunctions: function() {
          var me = this;
          this.addmodClasificador = function(idioma, apl) {
              this.baseUrl = (me.action) ? 'add' : 'update';

              var clasificador = {
                  idClasificador: me.idClasificador ? me.idClasificador : '',
                  nombre: me.tfNombre.getValue(),
                  descripcion: me.tfDescripcion.getValue(),
                  idformato: me.cbFormato.getValue(),
                  action: this.baseUrl
              };

              //Adicionando o modificando el clasificador
              var msgAccion = (clasificador.idClasificador == '') ? me.idioma.msgRegCta : me.idioma.msgRegPlan;
              var msgSuccess = (me.action) ? me.idioma.msgSuccessAddPlan : (clasificador.idClasificador == '') ? me.idioma.msgSuccessModClf : me.idioma.msgSuccessModPlan;

              Ext.MessageBox.wait(msgAccion, me.idioma.lbEspere);
              Ext.Ajax.request({
                  url: this.baseUrl + 'ClasificadorPlanCuenta',
                  params: clasificador,
                  method: 'post',
                  callback: function(options, success, response) {
                      var respuesta = Ext.decode(response.responseText);
                      Ext.MessageBox.hide();
                      switch(respuesta) {
                          default:
                              me.tfNombre.reset();
                              me.tfDescripcion.reset();
                              me.cbFormato.reset();
                              me.scope.treePlanCuenta.searchPlanCuenta('');
                              if(!apl || apl == 'undefined' || apl == undefined) {
                                  Ext.getCmp('winPlanCuenta').close();
                              }
                              mostrarMensaje(1, msgSuccess);
                              break;
                          case -2:
                              mostrarMensaje(1, me.idioma.msgErrorMod);
                              me.tfNombre.focus(100, false);
                              break;
                          case -3:
                              mostrarMensaje(1, me.idioma.msgErrorMod);
                              me.tfNombre.focus(100, false);
                              break;
                      }
                      me.scope.menuBar.btnModificar.setDisabled(true);
                      me.scope.menuBar.btnEliminar.setDisabled(true);
                  }
              });
          };
          this.cargarVentanaModificar = function(nodeSelect) {
              this.idClasificador = nodeSelect.attributes.id;
              this.tfNombre.setValue(nodeSelect.attributes.nombre);
              this.tfDescripcion.setValue(nodeSelect.attributes.descripcion);
              this.cbFormato.setValue(nodeSelect.attributes.idformato);
              this.cbFormato.setDisabled(!nodeSelect.leaf);
          };
      }
  });
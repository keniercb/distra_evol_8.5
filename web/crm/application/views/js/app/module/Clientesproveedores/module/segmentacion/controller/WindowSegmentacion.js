Ext.define('Segmentacion.controller.WindowSegmentacion', {
    extend: 'Ext.app.Controller',
    //views: ['WindowSegmentacion'],

    refs: [
        {ref: 'GridSegmentacion', selector: 'GridSegmentacion'},
        {ref: 'WindowSegmentacion', selector: 'WindowSegmentacion'},
        {ref: 'CriterioSegmentacion', selector: 'CriterioSegmentacion'},
    ],

    init: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);

        this.listen({
            component: {
                'WindowSegmentacion combobox[context]': {
                    change: this.cmbChange,
                },
                'CriterioSegmentacion radiogroup': {
                    //activate: this.activateRadio,
                    change: this.activateRadio,
                },
                'CriterioSegmentacion button': {
                    click: this.actionButton,
                }
            }
        });
    },

    cmbChange: function (cmp, newValue, oldValue, eOpts) {
        console.log(cmp, newValue, oldValue, eOpts, cmp.getValue(), cmp.getRawValue(), cmp.valueModels)
        if (newValue) {
            var me = this,
                win = me.getWindowSegmentacion();
            switch (cmp.context) {
                case 'datosGenerales':
                    if (cmp.getValue() != 'tipocliente') {
                        me.createCmp(win.fieldsetDG, cmp.getValue(), cmp.getRawValue(), 'NomClienteproveedor.' + cmp.getValue(), 'idclienteproveedor', 'TipoContrato', [], cmp.context);
                    } else {
                        me.createCmpTipoCliente(win.fieldsetDG, cmp);
                    }
                    break;
                case 'datosContables':
                    me.createCmp(win.fieldsetC, cmp.getValue(), cmp.getRawValue(), 'NomClienteproveedor.' + cmp.getValue(), 'idclienteproveedor', 'TipoContrato', [], cmp.context);
                    break;
                case 'cobrosPagos':
                    me.createCmp(win.fieldsetCP, cmp.getValue(), cmp.getRawValue(), 'NomClienteproveedor.' + cmp.getValue(), 'idclienteproveedor', 'TipoContrato', [], cmp.context);
                    break;
                case 'segmentacionwindowpregunta':
                    var mask = new Ext.LoadMask(win.el, {
                        msg: me.etiquetas.msgLoading
                    });
                    mask.show();
                    Ext.Ajax.request({
                        url: UtilsFn.buildUrl({action: 'datatype'}, me),
                        params: {idtiporespuesta: parseInt(cmp.valueModels[0].data.idtiporespuesta), type: 'numeric'},
                        success: function (response, opts) {
                            mask.hide();
                            var result = Ext.decode(response.responseText),
                                dataType = '';console.log(result,result.numeric,result.date)
                            if (result.numeric) {
                                dataType = 'numeric';
                            } else if (result.date) {
                                dataType = 'date';
                            } else {
                                dataType = 'alphanumeric';
                            }
                            me.createCmp(win.fieldsetP, 'respuesta', cmp.getRawValue(), 'NomRespuestaperfil.respuesta', 'idpregunta', 'NomClienteProveedor', {idtiporespuesta: parseInt(cmp.valueModels[0].data.idtiporespuesta)}, cmp.context, dataType);
                        },
                        failure: function (response, opts) {
                            mask.hide();
                        }
                    });
                    break;
                case 'operador':
                    if (cmp.getValue() == 'parcialigual') {
                        var criterio = cmp.up().up();
                        criterio.radio.items.items[1].setValue(true);
                    }
                    break;
            }
        }
    },

    createCmp: function (where, name, fieldLabel, mapping, localId, module, filters, context, dataType) {
        var toolbar = Ext.create('Segmentacion.view.CriterioSegmentacion', {
            name: name,
            fieldLabel: fieldLabel,
            mapping: mapping,
            localId: localId,
            module: module,
            filters: filters,
            context: context,
            dataType: (dataType ? dataType : '')
        });
        toolbar.combo.select(toolbar.storeCombo.data.items[0]);
        where.add(toolbar);
    },

    createCmpTipoCliente: function (where, cmp) {
        var me = this,
            label = Ext.create('Ext.form.Label', {
                text: cmp.getRawValue(),
                margin: '2 0 0 5',
                columnWidth: 0.5,
                style: 'font-weight:bold'
            }),
            radio = Ext.create('Ext.form.RadioGroup', {
                anchor: 'none',
                vertical: true,
                columns: 2,
                columnWidth: 0.5,
                layout: {
                    autoFlex: true
                },
                defaults: {
                    name:  cmp.getValue(),
                    margin: '0 15 0 0'
                },
                items: [{
                    inputValue: 'nojuridica',
                    boxLabel: me.etiquetas.lbNoJuridica,
                    checked: true
                }, {
                    inputValue: 'juridica',
                    boxLabel: me.etiquetas.lbJuridica
                }]
            }),
            toolbar = Ext.create('Ext.toolbar.Toolbar', {
                autoScroll: true,
                maximizable: true,
                name: cmp.getValue(),
                fieldLabel: cmp.getRawValue(),
                layout: 'column',
                margin: '0 0 5 0',
                items: [Ext.create('Ext.panel.Panel', {
                    bodyStyle: 'background:#DFE9F6;',
                    border: false,
                    layout: 'column',
                    columnWidth: 1,
                    //disabled: true,
                    defaults: {
                        anchor: '99%',
                        margin: '0 5 5 5',
                        bodyStyle: 'background:#DFE9F6;',
                        border: true,
                    },
                    margin: 0,
                    items: [
                        label,
                        radio,
                        {
                            xtype: 'button',
                            iconCls: 'icondistra-eliminar',
                            action: 'eliminar',
                            width: 23,
                            height: 23,
                            tooltip: me.etiquetas.lbEliminar + " " + me.etiquetas.lbSegmento.toLowerCase(),
                            margin: '0 5 0 0',
                            listeners: {
                                click: function (btn) {
                                    me.actionButton(btn);
                                }
                            }
                        }
                    ]
                })]
            });
        where.add(toolbar);
    },

    activateRadio: function (radio, newValue, oldValue, eOpts) {
        console.log(radio.up().up().up(), newValue, oldValue, eOpts)
        var criterio = radio.up().up().up(),
            name = criterio.mapping;
        if (newValue[name] == 'obtenervalues') {
            criterio.cmbfieldselect.show();
            criterio.campoValor.hide();
        } else if (newValue[name] == 'proporcionarvalor') {
            criterio.cmbfieldselect.hide();
            criterio.campoValor.show();
        }
    },

    actionButton: function (btn) {
        var me = this;
        mostrarMensaje(2, me.etiquetas.msgDelSegmento, function (response) {
            if (response === 'ok') {
                btn.up().up().destroy();
            }
        });
    },

});
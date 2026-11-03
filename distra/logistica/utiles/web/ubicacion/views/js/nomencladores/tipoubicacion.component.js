Ext.ns('Ext.erp');

Ext.erp.tipoubicacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function(config) {
        var _this = this;
        Ext.apply(this, config);
        this.campoIdNomenclador = 'idtipoubicacion';

        this.storeFields = [
            {
                name: 'peso'
            },
            {
                name: 'volumen'
            },
            ,
                    {
                        name: 'capacidad'
                    },
            {
                name: 'producto'
            },
            {
                name: 'idtipoubicacion'
            },
            {
                name: 'um'
            }
        ];



        this.columnsFields = [
            {
                dataIndex: 'producto',
                header: _this.idioma.lbUnicoProducto,
                width: 95,
                renderer: function(value, metaData) {
                    if (value == 1) {
                        metaData.css = 'icondistra-aceptar verde';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmProductoUnico + '"';
                    } else {
                        metaData.css = 'icondistra-aceptar rojo';
                        metaData.attr = 'ext:qtip="' + _this.idioma.ttClmNoProductoUnico + '"';
                    }
                }
            }
        ];

        this.bussinesModel = 'NomTipoubicModel';
        Ext.erp.tipoubicacion.superclass.constructor.call(this, config);
    },
    onBtnAdicionarClick: function() {
        Ext.erp.tipoubicacion.superclass.onBtnAdicionarClick.call(this);
        this.fpGestionarNomenclador.setWidth(400);
    },
    initFormFields: function() {
        var _this = this;
        this.formFields = [new Ext.form.FieldSet(
                    {
                        title: _this.idioma.lbTituloPanelParametros,
                        style: '-moz-border-radius:5px',
                        anchor: '98%',
                        autoHeight: true,
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .35,
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbUnicoProducto,
                                        name: 'producto',
                                        anchor: '95%',
                                        hideLabel: true,
                                        listeners: {
                                            'check': function(_checkbox, checked) {
                                                Ext.getCmp('idhdproducto').setValue(checked == true ? 1 : 0);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbCapacidad,
                                        name: 'capacidad',
                                        anchor: '95%',
                                        hideLabel: true,
                                        listeners: {
                                            'check': function(_checkbox, checked) {
                                                Ext.getCmp('idhdcapacidad').setValue(checked == true ? 1 : 0);
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                columnWidth: .35,
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbPeso,
                                        name: 'peso',
                                        anchor: '95%',
                                        hideLabel: true,
                                        listeners: {
                                            'check': function(_checkbox, checked) {
                                                Ext.getCmp('idhdpeso').setValue(checked == true ? 1 : 0);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbVolumen,
                                        name: 'volumen',
                                        anchor: '95%',
                                        hideLabel: true,
                                        listeners: {
                                            'check': function(_checkbox, checked) {
                                                Ext.getCmp('idhvolumen').setValue(checked == true ? 1 : 0);
                                            }
                                        }

                                    }
                                ]
                            },
                            {
                                columnWidth: .30,
                                items: [
                                    {
                                        xtype: 'checkbox',
                                        boxLabel: _this.idioma.lbUnidadMedida,
                                        name: 'um',
                                        anchor: '95%',
                                        hideLabel: true,
                                        listeners: {
                                            'check': function(_checkbox, checked) {
                                                Ext.getCmp('idhunidadmedida').setValue(checked == true ? 1 : 0);
                                            }
                                        }
                                    }
                                ]
                            }, {
                                xtype: 'hidden',
                                name: 'peso',
                                id: 'idhdpeso',
                                value: 0
                            }, {
                                xtype: 'hidden',
                                name: 'volumen',
                                id: 'idhvolumen',
                                value: 0
                            }, {
                                xtype: 'hidden',
                                name: 'capacidad',
                                id: 'idhdcapacidad',
                                value: 0
                            }, {
                                xtype: 'hidden',
                                name: 'um',
                                id: 'idhunidadmedida',
                                value: 0
                            }, {
                                xtype: 'hidden',
                                name: 'producto',
                                id: 'idhdproducto',
                                value: 0
                            }
                        ]
                    }
        )];
    }
});
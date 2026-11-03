Ext.ns('Ext.reccomplejas');
Ext.reccomplejas.RecManyValues = Ext.data.Record.create([
    {name: 'idcampo'},
    {name: 'valor'},
    {name: 'denominacion'},
]);

Ext.reccomplejas.CbCondicion = Ext.extend(Ext.form.ComboBox, {
    displayField: 'condicionmostrar',
    valueField: 'condicion',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    emptyText: 'Seleccione..',
    selectOnFocus: true,
    initComponent: function ()
    {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.store = new Ext.data.SimpleStore({
            fields: ['condicion', 'condicionmostrar']
        });
        Ext.reccomplejas.CbCondicion.superclass.initComponent.call(this);
    },
    loadData: function (tipoDato)
    {
        var arrCondiciones;
        switch (tipoDato) {
            case 'FECHA':
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto'],
                    ['>', 'Posterior a'],
                    ['<', 'Anterior a'],
                    ['>=', 'Posterior o igual a'],
                    ['<=', 'Anterior o igual a']
                ];
                break;
            case 'HORA':
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto'],
                    ['>', 'Posterior a'],
                    ['<', 'Anterior a'],
                    ['>=', 'Posterior o igual a'],
                    ['<=', 'Anterior o igual a']
                ];
                break;
            case 'NUMERO':
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto'],
                    ['>', 'Posterior a'],
                    ['<', 'Anterior a'],
                    ['>=', 'Posterior o igual a'],
                    ['<=', 'Anterior o igual a']
                ];
                break;
            case 'NOMENCLADOR':
            case 'MULTIPLESVALORES':
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto']
                ];
                break;
            case 'ARBOL':
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto']
                ];
                break;
            default:
                //TEXTO
                arrCondiciones = [
                    ['=', 'Igual'],
                    ['<>', 'Distinto'],
                    ['%x%', 'Contiene'],
                    ['x%', 'Comienza con'],
                    ['%x', 'Termina con']
                ];
        }
        this.store.loadData(arrCondiciones);
    }
});

Ext.reccomplejas.CbTipoDato = Ext.extend(Ext.form.ComboBox, {
    displayField: 'tipoDato',
    editable: false,
    mode: 'local',
    triggerAction: 'all',
    emptyText: 'Seleccione..',
    allowBlank: false,
    initComponent: function ()
    {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.store = new Ext.data.SimpleStore({
            fields: ['tipoDato'],
            data: [
                ['TEXTO'],
                ['NUMERO'],
                ['FECHA'],
                ['HORA'],
                ['NOMENCLADOR'],
                ['MULTIPLESVALORES'],
                ['ARBOL']
            ]
        });
        Ext.reccomplejas.CbTipoDato.superclass.initComponent.call(this);
    }
});

Ext.reccomplejas.CbReemplezar = Ext.extend(Ext.form.ComboBox, {
    displayField: 'usarReemplazar',
    editable: false,
    mode: 'local',
    triggerAction: 'all',
    emptyText: 'Seleccione..',
    allowBlank: false,
    initComponent: function ()
    {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.store = new Ext.data.SimpleStore({
            fields: ['usarReemplazar'],
            data: [
                ['NINGUNO'],
                ['MAYUSCULA'],
                ['MINUSCULA'],
                ['MAYUSCULA SIN TILDE'],
                ['MINUSCULA SIN TILDE']
            ]
        });
        Ext.reccomplejas.CbReemplezar.superclass.initComponent.call(this);
    }
});

Ext.reccomplejas.CmpConfigField = Ext.extend(Ext.Panel, {
    title: 'Configuraci&oacute;n del campo',
    layout: 'border',
    initComponent: function ()
    {
        var self = this;
        this.idioma = Ext.idioma.es.cmpreccomplejas.administracion.etiquetas;
        this.selectedNode = null;
        this.defaultSourceMostrar = {
            'denominacion': '',
            'descripcion': '',
            'obligatorio': false,
            'oculto': false,
            'anchoColumna': 100,
            'expander': false,
            'agruparCampo': false,
            'tooltip': false,
            'renderer': '',
            'sqlSelect': '',
            'alias': '',
            'icono': ''
        };

        this.defaultSourceCondicion = {
            'usarReemplazar':'',
            'usarCondicion': true,
            'tipoDato': 'TEXTO',
            'condicionPorDefecto': '',
            'mostrarEnToolbar': false,
            'sqlWhere': '',
            'sqlFilter': '',
            'expresionRegular': '',
            'idtabla': ''
        };

        this.btnAdicionar = new Ext.Button({
            text: this.idioma.btnAdicionar,
            tooltip: this.idioma.tooltipBtnAddMultiplesValores,
            id: 'btnAdicionar' + self.id,
            nextTab: 'btnEliminarValor' + self.id,
            prevTab: 'btnGuardar' + self.id,
            iconCls: 'adicionar',
            handler: function ()
            {
                var r = new Ext.reccomplejas.RecManyValues({
                    idcampo: self.selectedNode.attributes.idcampo,
                    valor: '',
                    denominacion: ''
                });
                self.gpManyValues.stopEditing();
                self.gpManyValues.getStore().insert(0, r);
                self.gpManyValues.startEditing(0, 0);
            }
        });

        this.btnEliminar = new Ext.Button({
            text: this.idioma.btnEliminar,
            tooltip: this.idioma.tooltipBtnElimimnarMultiplesValores,
            nextTab: 'btnReset' + self.id,
            prevTab: 'btnAdicionar' + self.id,
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                var st = self.gpManyValues.getStore();
                st.remove(st.getAt(self.gpManyValues.getSelectionModel().getSelectedCell()[0]));
            },
            id: 'btnEliminarValor' + self.id
        });

        //tabs del panel configuracion del campo
        this.pgDatosMostrar = new Ext.grid.PropertyGrid({
            title: self.idioma.titleDatosMostrar,
            tabTip: this.idioma.tabTipDatosMostrar,
            customEditors: {
                renderer: new Ext.grid.GridEditor(new Ext.form.TextField({
                    maxLength: 255,
                    maskRe: /^([_a-zA-Z\d]+ ?[_a-z0-9A-Z\d]*)+$/,
                    regex: /^([_a-zA-Z\d]+ ?[_a-z0-9A-Z\d]*)+$/
                })),
                denominacion: new Ext.grid.GridEditor(new Ext.form.TextField({
                    maxLength: 255, allowBlank: false,
                    regexText: this.idioma.MsgAlert
                })),
                descripcion: new Ext.grid.GridEditor(new Ext.form.TextField({
                    maxLength: 255,
                    regexText: this.idioma.MsgAlert
                })),
                anchoColumna: new Ext.grid.GridEditor(new Ext.form.NumberField({
                    maxLength: 3, minValue: 10
                })),
                alias: new Ext.grid.GridEditor(new Ext.form.TextField({
                    maxLength: 255,
                    maskRe: /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]*)+$/,
                    regex: /^([_a-z0-9A-ZáéíóúñüÑ\d]+ ?[_a-z0-9A-ZáéíóúñüÑ\d]*)+$/,
                    regexText: this.idioma.MsgAlert
                })),
                icono: new Ext.grid.GridEditor(new Ext.form.TriggerField({
                    triggerClass: 'x-form-search-trigger',
                    maxLength: 50,
                    maskRe: /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]*)+$/,
                    regex: /^([_a-z0-9A-ZáéíóúñüÑ\d]+ ?[_a-z0-9A-ZáéíóúñüÑ\d]*)+$/,
                    regexText: this.idioma.MsgAlert
                }))
            },
            source: this.defaultSourceMostrar
        });

        this.pgDatosCondicion = new Ext.grid.PropertyGrid({
            title: self.idioma.titleDatosCondicion,
            tabTip: this.idioma.tabTipDatosCondicion,
            customEditors: {
                tipoDato: new Ext.grid.GridEditor(new Ext.reccomplejas.CbTipoDato({
                    listeners: {
                        select: function (combo, record, index)
                        {
                            if (record.get('tipoDato') == 'NOMENCLADOR' || record.get('tipoDato') == 'ARBOL') {
                                this.ShowWinSelecIDTabla();
                            }
                        }.createDelegate(this)
                    }
                })),
                usarReemplazar: new Ext.grid.GridEditor(new Ext.reccomplejas.CbReemplezar({
                    listeners: {
                        select: function (combo, record, index)
                        {

                        }.createDelegate(this)
                    }
                })),
                condicionPorDefecto: new Ext.grid.GridEditor(new Ext.reccomplejas.CbCondicion({
                    listeners: {
                        focus: function (field)
                        {
                            field.loadData(self.pgDatosCondicion.getSource().tipoDato);
                        }
                    }
                }))
            },
            source: this.defaultSourceCondicion
        });

        this.gpManyValues = new Ext.grid.EditorGridPanel({
            title: self.idioma.titleMultiplesValores,
            tabTip: this.idioma.tabTipMultiplesValores,
            tbar: [self.btnAdicionar, self.btnEliminar],
            store: new Ext.data.Store({
                url: 'getMultiplesValores',
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'idcampo'},
                    {name: 'valor'},
                    {name: 'denominacion'}


                ])
            }),
            columns: [
                {header: 'Valor', width: 80, dataIndex: 'valor', editor: new Ext.form.TextField({
                    allowBlank: false,
                    maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ\d]*)+$/,
                    regex: /^([a-z0-9A-ZáéíóúñüÑ\d]+ ?[a-z0-9A-ZáéíóúñüÑ\d]*)+$/,
                    regexText: this.idioma.MsgAlert,
                    maxLength: 255
                })
                },
                {id: 'vm', header: 'Denominaci&oacute;n', width: 100, dataIndex: 'denominacion', editor: new Ext.form.TextField({
                    allowBlank: false,
                    maskRe: /^([_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]+ ?[_a-zA-ZÁÉÍÓÚáéíóúñüÑ\d\s]*)+$/,
                    regex: /^([_a-z0-9A-ZáéíóúñüÑ\d\s]+ ?[_a-z0-9A-ZáéíóúñüÑ\d\s]*)+$/,
                    regexText: this.idioma.MsgAlert,
                    maxLength: 255
                })
                }
            ],
            sm: new Ext.grid.CellSelectionModel({
                listeners: {
                    selectionchange: function (sm, obj)
                    {
                        obj ? Ext.getCmp('btnEliminarValor' + self.id).enable() : Ext.getCmp('btnEliminarValor' + self.id).disable();
                        self.btnAdicionar.focus();
                    }
                }
            }),
            stripeRows: true,
            autoExpandColumn: 'vm',
            clicksToEdit: 1
        });

        this.tabProperties = new Ext.TabPanel({
            xtype: 'tabpanel',
            activeTab: 0,
            margins: '0 5 5 5',
            region: 'center',
            items: [this.pgDatosMostrar, this.pgDatosCondicion, this.gpManyValues]
        });

        this.btnClear = new Ext.Button({
            text: this.idioma.btnResetear,
            tooltip: this.idioma.tooltipBtnResetear,
            id: 'btnReset' + self.id,
            nextTab: 'btnGuardar' + self.id,
            prevTab: 'btnEliminarValor' + self.id,
            iconCls: 'limpiar',
            handler: function ()
            {
                self.gpManyValues.getStore().reload();
                self.pgDatosMostrar.setSource({
                    'denominacion': self.selectedNode.text,
                    'descripcion': self.selectedNode.attributes.descripcion || '',
                    'obligatorio': self.selectedNode.attributes.obligatorio != 0 ? true : false,
                    'oculto': self.selectedNode.attributes.oculto != 0 ? true : false,
                    'icono': '',
                    'anchoColumna': self.selectedNode.attributes.anchocolumna,
                    'expander': self.selectedNode.attributes.expander != 0 ? true : false,
                    'agruparCampo': self.selectedNode.attributes.agruparcampo != 0 ? true : false,
                    'tooltip': self.selectedNode.attributes.tooltip != 0 ? true : false,
                    'renderer': self.selectedNode.attributes.renderer || '',
                    'sqlSelect': self.selectedNode.attributes.sqlselect || '',
                    'alias': self.selectedNode.attributes.alias || ''
                });

                self.pgDatosCondicion.setSource({
                    'usarCondicion': self.selectedNode.attributes.usarcondicion != 0 ? true : false,
                    'tipoDato': self.selectedNode.attributes.tipodato,
                    'usarReemplazar': self.selectedNode.attributes.usarreemplazar,
                    'condicionPorDefecto': self.selectedNode.attributes.condicionpordefecto || '',
                    'mostrarEnToolbar': self.selectedNode.attributes.representartbar != 0 ? true : false,
                    'sqlWhere': self.selectedNode.attributes.sqlwhere || '',
                    'sqlFilter': self.selectedNode.attributes.sqlfilter || '',
                    'expresionRegular': self.selectedNode.attributes.expresionregular || '',
                    'idtabla': self.selectedNode.attributes.idtabla || ''
                });
            }
        });
        this.btnGuardar = new Ext.Button({
            text: this.idioma.btnGuardar,
            tooltip: this.idioma.tooltipBtnGuardar,
            id: 'btnGuardar' + self.id,
            nextTab: 'btnAdicionar' + self.id,
            prevTab: 'btnReset' + self.id,
            iconCls: 'guardar',
            handler: function ()
            {
                self.saveFieldConfig(self);
            }
        });

        this.keys = [
            {
                key: 'i',
                alt: true,
                ctrl: true,
                fn: function ()
                {
                    self.btnAdicionar.handler();
                }
            },
            {
                key: 46,
                alt: true,
                fn: function ()
                {
                    if (!self.btnEliminar.disabled) {
                        self.btnEliminar.handler();
                    }
                }
            },
            {
                key: 'g',
                alt: true,
                fn: function ()
                {
                    self.btnGuardar.handler();
                }
            },
            {
                key: 'z',
                alt: true,
                fn: function ()
                {
                    self.btnClear.handler();
                }
            },
            {
                key: '3',
                alt: true,
                fn: function ()
                {
                    self.tabProperties.setActiveTab(0);
                }
            },
            {
                key: '4',
                alt: true,
                fn: function ()
                {
                    self.tabProperties.setActiveTab(1);
                }
            },
            {
                key: '5',
                alt: true,
                fn: function ()
                {
                    self.tabProperties.setActiveTab(2);
                }
            }
        ];

        this.pInfo = new Ext.FormPanel({
            layout: 'form',
            labelWidth: 50,
            bodyStyle: 'padding:4px 4px 0',
            defaults: {
                anchor: '100%'
            },
            frame: true,
            defaultType: 'textfield',
            items: [
                {
                    fieldLabel: this.idioma.tfTabla,
                    name: 'tabla',
                    readOnly: true
                },
                {
                    fieldLabel: this.idioma.tfCampo,
                    name: 'campo',
                    readOnly: true
                },
                {
                    name: 'idcampo',
                    xtype: 'hidden'
                }
            ],
            region: 'north',
            margins: '5 5 5 5',
            height: 70
        });
        this.items = [this.pInfo, this.tabProperties];
        this.bbar = ['->', self.btnClear, self.btnGuardar];
        Ext.reccomplejas.CmpConfigField.superclass.initComponent.call(this);
    },
    ShowWinSelecIDTabla: function ()
    {
        stCamposTabla = new Ext.data.Store({
            url: 'getCamposTabla',
            reader: new Ext.data.JsonReader({
                id: 'id',
                root: 'datos'
            }, [
                {
                    name: 'campo'
                }
            ])
        });

        cbCamposTabla = new Ext.form.ComboBox({
            store: stCamposTabla,
            hideLabel: true,
            displayField: 'campo',
            valueField: 'campo',
            hiddenName: 'campo',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione..',
            selectOnFocus: true,
            editable: false,
            allowBlank: false,
            width: 170
        });

        stCamposTabla.reload({
            params: {
                esquema: this.esquema,
                tabla: this.tabla,
                servidor: this.config.get('servidor'),
                puerto: this.config.get('puerto'),
                usuario: this.config.get('usuario'),
                contrasena: this.config.get('contrasena'),
                basedato: this.config.get('basedato')
            }
        }, this);

        var winSelectIDTabla = new Ext.Window({
            title: this.idioma.titleWinIdTabla,
            layout: 'fit',
            closeAction: 'hide',
            modal: true,
            plain: true,
            closable: false,
            items: new Ext.FormPanel({
                id: 'fpSelecIDTabla',
                labelWidth: 90,
                region: 'center',
                border: false,
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                width: 285,
                height: 50,
                defaults: {
                    width: 260
                },
                items: [cbCamposTabla]
            }),
            buttons: [
                {
                    text: this.idioma.btnAceptar,
                    iconCls: 'aceptar',
                    handler: function ()
                    {
                        if (Ext.getCmp('fpSelecIDTabla').getForm().isValid()) {
                            idtabla = cbCamposTabla.getValue();
                            this.pgDatosCondicion.show();
                            var objtmp = this.pgDatosCondicion.getSource();
                            objtmp.idtabla = idtabla;
                            this.pgDatosCondicion.setSource(objtmp);
                            winSelectIDTabla.hide();
                        }
                    }.createDelegate(this)
                }
            ]
        });
        winSelectIDTabla.show();
    },
    updateFieldConfig: function (node)
    {
        if (node && node.isLeaf()) {
            this.on('enable', function ()
            {
                this.btnGuardar.focus();
            }, this);

            this.enable();
            this.selectedNode = node;
            //Actualiza el metadato del campo
            this.pInfo.getForm().findField('tabla').setValue(node.attributes.esquema + '.' + node.attributes.tabla);
            this.tabla = node.attributes.tabla;
            this.esquema = node.attributes.esquema;
            this.pInfo.getForm().findField('campo').setValue(node.attributes.campo);
            this.pInfo.getForm().findField('idcampo').setValue(node.attributes.idcampo);
            //Actualiza Multiples valores
            this.gpManyValues.show();
            this.gpManyValues.getStore().load({
                params: {
                    idcampo: node.attributes.idcampo
                }
            });
            //Actualiza Datos condicion
            this.pgDatosCondicion.show();
            this.pgDatosCondicion.setSource({
                'usarReemplazar': node.attributes.usarreemplazar,
                'usarCondicion': node.attributes.usarcondicion == 1 ? true : false,
                'tipoDato': node.attributes.tipodato,
                'condicionPorDefecto': node.attributes.condicionpordefecto || '',
                'mostrarEnToolbar': node.attributes.representartbar == 1 ? true : false,
                'sqlWhere': node.attributes.sqlwhere || '',
                'sqlFilter': node.attributes.sqlfilter || '',
                'expresionRegular': node.attributes.expresionregular || '',
                'idtabla': node.attributes.idtabla || ''
            });
            //Actualiza Datos mostrar
            this.pgDatosMostrar.show();
            this.pgDatosMostrar.setSource({
                'denominacion': node.text,
                'descripcion': node.attributes.descripcion || '',
                'obligatorio': node.attributes.obligatorio == 1 ? true : false,
                'oculto': node.attributes.oculto == 1 ? true : false,
                'icono': '',
                'anchoColumna': node.attributes.anchocolumna,
                'expander': node.attributes.expander == 1 ? true : false,
                'agruparCampo': node.attributes.agruparcampo == 1 ? true : false,
                'tooltip': node.attributes.tooltip == 1 ? true : false,
                'renderer': node.attributes.renderer || '',
                'sqlSelect': node.attributes.sqlselect || '',
                'alias': node.attributes.alias || ''
            });
        } else {
            this.pInfo.getForm().reset();
            this.pgDatosMostrar.setSource(this.defaultSourceMostrar);
            this.pgDatosCondicion.setSource(this.defaultSourceCondicion);
            this.disable();
        }
    },
    saveFieldConfig: function (self)
    {
        //Datos multiples valores
        var contador = 0;
        var arrRecord = self.gpManyValues.getStore().getRange();
        var arrMultievaluado = new Array();
        Ext.each(arrRecord, function (record)
        {
            if (record.get('valor') == '' || record.get('denominacion') == '') {
                contador = 1;
            }
            else {
                arrMultievaluado.push({
                    valor: record.get('valor'),
                    denominacion: record.get('denominacion')
                })
            }
        });
        //Datos condicion del campo
        var sourceCondicion = self.pgDatosCondicion.getSource();
        sourceCondicion.idconfigcondicion = self.selectedNode.attributes.idconfigcondicion;
        sourceCondicion.usarCondicion = sourceCondicion.usarCondicion == true ? 1 : 0;
        sourceCondicion.mostrarEnToolbar = sourceCondicion.mostrarEnToolbar == true ? 1 : 0;

        //Datos mostrar del campo
        var sourceMostrar = self.pgDatosMostrar.getSource();
        sourceMostrar.idconfigmostrar = self.selectedNode.attributes.idconfigmostrar;
        sourceMostrar.obligatorio = sourceMostrar.obligatorio == true ? 1 : 0;
        sourceMostrar.oculto = sourceMostrar.oculto == true ? 1 : 0;
        sourceMostrar.icono = '';
        sourceMostrar.expander = sourceMostrar.expander == true ? 1 : 0;
        sourceMostrar.agruparCampo = sourceMostrar.agruparCampo == true ? 1 : 0;
        sourceMostrar.tooltip = sourceMostrar.tooltip == true ? 1 : 0;

        if (contador == 0) {
            PVD.mostrarMascara('mascara', this.idioma.MsgWait, this.idioma.MsgAddConfAccion);
            Ext.Ajax.request({
                url: 'guardarDatosCampo',
                method: 'POST',
                params: {
                    idconfiguracion: self.config.get('idconfiguracion'),
                    idcampo: self.pInfo.getForm().findField('idcampo').getValue(),
                    sourceMostrar: Ext.encode(sourceMostrar),
                    sourceCondicion: Ext.encode(sourceCondicion),
                    arrMultievaluado: Ext.encode(arrMultievaluado)
                },
                callback: function (options, success, response)
                {
                    PVD.ocultarMascara('mascara');
                    responseData = Ext.decode(response.responseText);
                    if (responseData.success) {
                        Ext.Notification.show({
                            title: self.idioma.titleInfo,
                            msg: self.idioma.MsgSaveConfOK,
                            time: 3
                        });
                        self.fireEvent('fieldConfigSaved', self.selectedNode);
                        self.pgDatosMostrar.show();
                    }
                    else {
                        Ext.Notification.show({
                            title: self.idioma.titleInfo,
                            msg: self.idioma.MsgSaveConfFail,
                            time: 3
                        });
                    }
                }
            });
        }
        else {
            Ext.Notification.show({
                title: self.idioma.titleInfo,
                msg: self.idioma.MsgAlerValores,
                time: 3
            });
        }
    }
});
/*
 * Configuracion de la matriz de relacion.
 *
 * @copyright XETID Cuba
 * @author Reyner Labrada Sablon
 * @version 1.0.0.0 Alfa
 */
Planificacion.Integracion.Win = Ext.extend(Ext.Window, {
    id: 'Win&' + this.id,
    width: this.width ? this.width : 400,
    autoHeight: this.autoHeight == false ? this.autoHeight : true,
    modal: true,
    layout: 'form',
    resizable: false,
    controller: this.controller ? this.controller : new Planificacion.Integracion.MatrizrelacionesController(),
    comps: ExtExtend.Components,
    initComponent: function () {
        var me = this;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        var comps = ExtExtend.Components;
        me.btnCancel = new comps.buttons.btnCancelar({
            handler: function () {
                me.close();
            }
        });
        me.btnSave = new comps.buttons.btnAceptar({
            text: 'Aceptar',
            tooltip: 'Guardar datos y cerrar ventana',
            disabled: true,
            handler: function () {
                me.save();
            },
            togleEnable: function (enabled) {
                var me = this;
                if (enabled) {
                    me.enable();
                } else {
                    me.disable();
                }
            }
        });
        me.btnAply = new comps.buttons.btnAplicar({
            disabled: true,
            handler: function () {
                me.aply();
            },
            togleEnable: function (enabled) {
                var me = this;
                if (enabled) {
                    me.enable();
                } else {
                    me.disable();
                }
            }
        });
        me.keys = [
            {
                key: 'g',
                scope: me,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!me.btnSave.disabled) {
                        me.btnSave.handler.call();
                    }
                }
            },
            {
                key: 'p',
                scope: me,
                alt: true,
                ctrl: true,
                stopEvent: true,
                fn: function () {
                    if (!me.btnAply.disabled) {
                        me.btnAply.handler.call();
                    }
                }
            },
            {
                key: 'x',
                scope: me,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!me.btnCancel.disabled) {
                        me.btnCancel.handler.call();
                    }
                }
            }
        ];
        Planificacion.Integracion.Win.superclass.initComponent.call(me);
    }
});
Ext.reg('Planificacion.Integracion.Win', Planificacion.Integracion.Win);
Planificacion.Integracion.WincConfigMatriz = Ext.extend(Planificacion.Integracion.Win, {
    id: 'WincConfigMatriz&' + this.id,
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.title ? me.title : me.etiquetas.titleConfigMatriz;
        me.togleenablesave = function () {
            me.btnSave.togleEnable(me.anyChange());
        };
        me.radiotext = new Ext.form.Radio({
            boxLabel: me.etiquetas.lblRbText,
            name: 'rb-text',
            height: 22,
            inputValue: true,
            checked: !(me.matriz.config.tipodato === false),
            listeners: {
                check: function (thisf, checked) {
                    me.togleenablesave();
                    if (checked) {
//                        me.checkPorciento.disable();
//                        me.checkPorciento.hide();
                        me.checkPromedio.disable();
                        me.checkPromedio.hide();
                    } else {
//                        me.checkPorciento.enable();
//                        me.checkPorciento.show();
                        me.checkPromedio.enable();
                        me.checkPromedio.show();
                    }
                }
            }
        });
        me.radioGroupTipo = new Ext.form.RadioGroup({
            allowBlank: false,
            hideLabel: true,
            columns: 2,
            fieldClass: 'nobackground-matrizrelaciones',
            columnWidth: '.5',
            frame: true,
            disabled: me.matriz.config.idconfiguracionmatrizrelacion ? true : false,
            border: false,
            defaults: {
                ctCls: 'fields-matrizrelaciones',
                height: 22
            },
            items: [
                me.radiotext,
                {
                    boxLabel: me.etiquetas.lblRbNumbers,
                    name: 'rb-text',
                    inputValue: false,
                    height: 22,
                    checked: me.matriz.config.tipodato === false
                }
            ],
            getValue: function () {
                return me.radiotext.getValue();
            }
        });
        me.checkPromedio = new Ext.form.Checkbox({
            boxLabel: me.etiquetas.lblPromedio,
            name: 'promedio',
            checked: me.matriz.config.promedio,
            disabled: me.radiotext.checked,
            hidden: me.radiotext.checked,
            listeners: {
                check: me.togleenablesave.createDelegate(this)
            }
        });
        me.checkPorciento = new Ext.form.Checkbox({
            boxLabel: me.etiquetas.lblProciento,
            name: 'porciento',
            checked: me.matriz.config.porciento,
//            disabled: me.radiotext.checked,
//            hidden: me.radiotext.checked,
            listeners: {
                check: me.togleenablesave.createDelegate(this)
            }
        });
        me.checkGroupSalidas = new Ext.form.CheckboxGroup({
            hideLabel: true,
            columns: 2,
            columnWidth: '.5',
            fieldClass: 'nobackground-matrizrelaciones',
            border: false,
            defaults: {
                ctCls: 'fields-matrizrelaciones',
                height: 22,
                listeners: {
                    check: me.togleenablesave.createDelegate(this)
                }
            },
            items: [
                {
                    boxLabel: me.etiquetas.lblTotalDatos,
                    name: 'totaldatos',
                    checked: me.matriz.config.totaldatos
                },
                me.checkPorciento, {
                    boxLabel: me.etiquetas.lblCantRelaciones,
                    name: 'cantrelaciones',
                    checked: me.matriz.config.cantrelaciones
                },
                me.checkPromedio
            ],
            getValue: function () {
                var _thischG = this;
                var salidas = {};
                _thischG.items.each(function (item) {
                    salidas[item.name] = !item.disabled && item.checked;
                });
                return salidas;
            }
        });
        me.tfFilas = new comps.fields.simpleField({
            fieldLabel: 'Filas',
            allowBlank: true,
            vType: 'vtalfanumericos',
            listeners: {
                change: function (th, e, ne) {
                    me.btnSave.togleEnable(me.anyChange())
                }
            }
        });
        me.tfColumnas = new comps.fields.simpleField({
            fieldLabel: 'Columnas',
            allowBlank: true,
            vType: 'vtalfanumericos',
            listeners: {
                change: function (th, e, ne) {
                    me.btnSave.togleEnable(me.anyChange())
                }
            }
        });
        me.tfFilas1 = new comps.fields.simpleField({
            fieldLabel: 'Cantidad de filas',
            vType: 'vtnumeroReales',
            listeners: {
                change: function (th, e, ne) {
                    me.btnSave.togleEnable(me.anyChange())
                }
            }
        });
        me.tfColumnas1 = new comps.fields.simpleField({
            fieldLabel: 'Cantidad de columnas',
            vType: 'vtnumeroReales',
            listeners: {
                change: function (th, e, ne) {
                    me.btnSave.togleEnable(me.anyChange())
                }
            }
        });
        me.items = [/*{
            xtype: 'fieldset',
            title: me.etiquetas.lblTipoDatos,
            autoHeight: true,
            items: [me.radioGroupTipo]
        },*/ {
            xtype: 'fieldset',
            title: me.etiquetas.lblSalidasMatriz,
            layout: 'form',
            autoHeight: true,
            items: [me.checkGroupSalidas]
        }, {
            xtype: 'fieldset',
            title: 'Nombre de la relación',
            layout: 'form',
            autoHeight: true,
            items: [{
                layout: 'column', anchor: '100%', frame: true,
                items: [
                    {columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.tfFilas]},
                    {columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.tfColumnas]}
                ]
            }]
        }];
        if (me.matriz.config.idconfiguracionmatrizrelacion === null) {
            me.items.push({
                xtype: 'fieldset',
                title: 'Generar matriz de :',
                layout: 'form',
                autoHeight: true,
                items: [{
                    layout: 'column', anchor: '100%', frame: true,
                    items: [
                        {columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.tfFilas1]},
                        {columnWidth: .5, layout: 'form', labelAlign: 'top', items: [me.tfColumnas1]}
                    ]
                }]
            });
        }
        me.keys = [
            {
                key: 'g',
                scope: me.gpProyecto,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!me.btnSave.disabled) {
                        me.btnSave.handler.call();
                    }
                }
            }, {
                key: 'x',
                scope: me,
                alt: true,
                stopEvent: true,
                fn: function () {
                    if (!me.btnCancel.disabled) {
                        me.btnCancel.handler.call();
                    }
                }
            }
        ];
        if (me.nombrerelacion) {
            me.nombre = (me.nombrerelacion) ? me.nombrerelacion.split('/') : '';
            me.tfFilas.setValue(me.nombre[0]);
            me.tfColumnas.setValue(me.nombre[1]);
        }
        Planificacion.Integracion.WincConfigMatriz.superclass.initComponent.call(me);
        me.buttons = [me.btnCancel, me.btnSave];
        me.btnSave.togleEnable(!me.radioGroupTipo.disabled/* && me.anyChange()*/);
        me.controller._insertItem('matrizrelaciones', me.matriz);
    },
    getValue: function () {
        var me = this;
        var config = me.checkGroupSalidas.getValue();
        config.tipodato = me.radioGroupTipo.getValue();
        config.nombrerelacion = me.tfFilas.getRawValue() + '/' + me.tfColumnas.getRawValue();
        config.cantidadfilas = me.tfFilas1.getValue();
        config.cantidadcolumnas = me.tfColumnas1.getValue();
        return config;
    },
    save: function () {
        var me = this;
        var newConfig = me.getValue();
        newConfig.idconfiguracionmatrizrelacion = me.matriz.config.idconfiguracionmatrizrelacion;
        newConfig.idestudiomatrizrelacion = me.matriz.config.idestudiomatrizrelacion;
        newConfig.idproyecto = me.matriz.config.idproyecto;
        me.controller._insertItem('matrizrelaciones', me.matriz);
        me.controller.saveConfig(newConfig);
        me.close();
    },
    anyChange: function () {
        var me = this;
        var newConfig = me.getValue();
        return me.matriz.config.cantrelaciones !== newConfig.cantrelaciones || me.matriz.config.porciento !== newConfig.porciento || me.matriz.config.promedio !== newConfig.promedio || me.matriz.config.tipodato !== newConfig.tipodato || me.matriz.config.totaldatos !== newConfig.totaldatos || me.nombrerelacion !== newConfig.nombrerelacion;
    }
});
Ext.reg('Planificacion.Integracion.WincConfigMatriz', Planificacion.Integracion.WincConfigMatriz);
Planificacion.Integracion.WincAddElement = Ext.extend(Planificacion.Integracion.Win, {
    id: 'WincAddElement&' + this.id,
    labelWidth: '95%',
    resizable: false,
    initComponent: function () {
        var me = this;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.title ? me.title : me.etiquetas.titleAddColumn;
        me.lblDenom = me.lblDenom ? me.lblDenom : me.etiquetas.lblDenomColumn;
        me.lblDesc = me.lblDesc ? me.lblDesc : me.etiquetas.lblDescColumn;
        me.tfDenomination = new Ext.form.TextField({
            id: "tfDenominacion&" + me.id,
            fieldLabel: me.lblDenom,
            allowBlank: false,
            maxLength: 255,
            vtypes:'vtalfanumericos',
            width: '100%',
            listeners: {
                valid: function (thisf) {
                    me.togleEnableButtons(me.anyChange());
                },
                invalid: function (thisf, msg) {
                    me.togleEnableButtons(false);
                }
            }
        });
        me.taDescription = new Ext.form.TextArea({
            id: "taDescripcion&" + me.id,
            fieldLabel: me.lblDesc,
            width: '100%',
            height: 70,
            listeners: {
                valid: function () {
                    if (me.tfDenomination.isValid()) {
                        me.togleEnableButtons(me.anyChange());
                    }
                }
            }
        });

        me.pnCentral = new Ext.Panel({
            items: [me.tfDenomination, me.taDescription],
            labelAlign: 'top',
            layout: 'form',
            frame: true
        });
        me.items = [me.pnCentral];
        Planificacion.Integracion.WincAddElement.superclass.initComponent.call(me);
    },
    togleEnableButtons: function (enable) {
        var me = this;
        me.btnSave.togleEnable(enable);
        me.btnAply.togleEnable(enable);
    },
    getDescription: function () {
        var me = this;
        return me.taDescription.getValue();
    },
    getDenomination: function () {
        var me = this;
        return me.tfDenomination.getValue();
    },
    setDescription: function (val) {
        var me = this;
        me.taDescription.setValue(val);
    },
    setDenomination: function (val) {
        var me = this;
        return me.tfDenomination.setValue(val);
    },
    insertColumnRow: function (fila, callback) {
        var me = this;
        var denominat = me.getDenomination();
        if (me.validate() && !me.matriz.existentColumnRow(fila, denominat)) {
            me.controller._insertItem('matrizrelaciones', me.matriz);
            me.controller.insertColumnRow({
                denominacion: denominat,
                descripcion: me.getDescription(),
                fila: fila
            });
            callback();
        } else {
            mostrarMensaje(1, fila ? me.etiquetas.rowExistentError : me.etiquetas.columnExistentError, function () {
            });
        }
    },
    updateColumnRow: function (fila, callback) {
        var me = this;
        var denominat = me.getDenomination();
        if (me.validate() && !me.matriz.existentColumnRow(fila, denominat)) {
            me.controller._insertItem('matrizrelaciones', me.matriz);
            me.controller.updateColumnRow({
                denominacion: denominat,
                descripcion: me.getDescription(),
                idcolumnrow: me.idcolumnrow,
                fila: fila
            });
            callback();
        } else {
            //Secodena.Mensajeria.Utiles.mostrarMensajeFlotante.msg('', (fila ? me.etiquetas.rowExistentError : me.etiquetas.columnExistentError) + " <i>" + denominat + "</i>", 3);
            mostrarMensaje(1, fila ? me.etiquetas.rowExistentError : me.etiquetas.columnExistentError, function () {
            });
        }
    },
    saveCR: function (fila) {
        var me = this;
        me.insertColumnRow(fila, function () {
            me.close();
        });
    },
    aplyCR: function (fila) {
        var me = this;
        me.insertColumnRow(fila, function () {
            me.reset();
        });
    },
    reset: function () {
        var me = this;
        me.tfDenomination.reset();
        me.taDescription.reset();
        me.btnSave.disable();
        me.btnAply.disable();
    },
    validate: function () {
        var me = this;
        return me.tfDenomination.isValid();
    },
    anyChange: function () {
        var me = this;
        return me.getDenomination() !== me.denomcolumnrow || me.getDescription() !== me.desccolumnrow;
    }
});
Ext.reg('Planificacion.Integracion.WincAddElement', Planificacion.Integracion.WincAddElement);
Planificacion.Integracion.WincAddColumnMR = Ext.extend(Planificacion.Integracion.WincAddElement, {
    id: 'WincAddColumn&' + this.id,
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.btnSave = new comps.buttons.btnAceptar({
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                me.save();
            }
        });
        Planificacion.Integracion.WincAddColumnMR.superclass.initComponent.call(me);
        me.buttons = [me.btnCancel, me.btnAply, me.btnSave];
    },
    save: function () {
        var me = this;
        me.saveCR(false);
    },
    aply: function () {
        var me = this;
        me.aplyCR(false);
    }
});
Ext.reg('Planificacion.Integracion.WincAddColumnMR', Planificacion.Integracion.WincAddColumnMR);
Planificacion.Integracion.WincUpdColumnMR = Ext.extend(Planificacion.Integracion.WincAddElement, {
    id: 'WincUpdColumn&' + this.id,
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.idcolumnrow = me.idcolumnrow ? me.idcolumnrow : null;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.title ? me.title : me.etiquetas.titleUpdColumn;
        me.btnSave = new comps.buttons.btnAceptar({
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
                me.save();
            }
        });
        Planificacion.Integracion.WincUpdColumnMR.superclass.initComponent.call(me);
        me.setDescription(me.desccolumnrow);
        me.setDenomination(me.denomcolumnrow);
        me.buttons = [me.btnCancel, me.btnSave];
    },
    reset: function () {
        var me = this;
        me.desccolumnrow = me.getDenomination();
        me.denomcolumnrow = me.getDescription();
        me.btnSave.disable();
        me.btnAply.disable();
    },
    save: function () {
        var me = this;
        me.updateColumnRow(false, function () {
            me.close();
        });
    },
    aply: function () {
        var me = this;
        me.updateColumnRow(false, function () {
            me.reset();
        });
    }
});
Ext.reg('Planificacion.Integracion.WincUpdColumnMR', Planificacion.Integracion.WincUpdColumnMR);
Planificacion.Integracion.WincAddRowMR = Ext.extend(Planificacion.Integracion.WincAddElement, {
    id: 'WincAddRow&' + this.id,
    initComponent: function () {
        var me = this;
        var comps = ExtExtend.Components;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.title ? me.title : me.etiquetas.titleAddRow;
        me.lblDenom = me.lblDenom ? me.lblDenom : me.etiquetas.lblDenomRow;
        me.lblDesc = me.lblDesc ? me.lblDesc : me.etiquetas.lblDescRow;
        Planificacion.Integracion.WincAddRowMR.superclass.initComponent.call(me);
        me.buttons = [me.btnCancel, me.btnAply, me.btnSave];
    },
    save: function () {
        var me = this;
        me.saveCR(true);
    },
    aply: function () {
        var me = this;
        me.aplyCR(true);
    }
});
Ext.reg('Planificacion.Integracion.WincAddRowMR', Planificacion.Integracion.WincAddRowMR);
Planificacion.Integracion.WincUpdRowMR = Ext.extend(Planificacion.Integracion.WincAddElement, {
    id: 'WincUpdRow&' + this.id,
    initComponent: function () {
        var me = this;
        me.idcolumnrow = me.idcolumnrow ? me.idcolumnrow : null;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.title ? me.title : me.etiquetas.titleUpdRow;
        me.lblDenom = me.lblDenom ? me.lblDenom : me.etiquetas.lblDenomRow;
        me.lblDesc = me.lblDesc ? me.lblDesc : me.etiquetas.lblDescRow;
        Planificacion.Integracion.WincUpdRowMR.superclass.initComponent.call(me);
        me.setDescription(me.desccolumnrow);
        me.setDenomination(me.denomcolumnrow);
        me.buttons = [me.btnCancel, me.btnSave];
    },
    reset: function () {
        var me = this;
        me.desccolumnrow = me.getDenomination();
        me.denomcolumnrow = me.getDescription();
        me.btnSave.disable();
        me.btnAply.disable();
    },
    save: function () {
        var me = this;
        me.updateColumnRow(true, function () {
            me.close();
        });
    },
    aply: function () {
        var me = this;
        me.updateColumnRow(true, function () {
            me.reset();
        });
    }
});
Ext.reg('Planificacion.Integracion.WincUpdRowMR', Planificacion.Integracion.WincUpdRowMR);

Planificacion.Integracion.ExportarWindowRelaciones = Ext.extend(Planificacion.Integracion.Win, {
    id: 'exportarfmpeir',
    width: 315,
    height: 120,
    autoHeight: false,
    closeAction: 'destroy',
    constrain: true,
    layout: 'border',
    initComponent: function () {
        var me = this;
        me.idCmp = this.id;
        var comps = ExtExtend.Components;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.title = me.etiquetas.titleGuardar;
        me.btnAceptar = new comps.buttons.btnAceptar({
            tooltip: me.etiquetas.ttpAceptarExportar,
            handler: function () {
                if (me.fpanel.getForm().isValid()) {
                    var a = me.fpanel.getForm().getValues();
                    if (a['farchivo'] == 'rtf' || a['farchivo'] == 'pdf') {
                        me.export(a['farchivo']);
                    }
                    me.close();
                }
            }
        });

        me.btnCancelar = new comps.buttons.btnCerrar({
            tooltip: me.etiquetas.ttpCerrar,
            handler: function () {
                me.close();
            }
        });

        me.narchivo = new Ext.form.TextField({
            fieldLabel: me.etiquetas.lbNombreArchivo,
            name: 'narchivo',
            id: 'narchivo' + me.idCmp,
            allowBlank: false,
            width: 170,
            value: me.matrix.config.denommatrix ? me.matrix.config.denommatrix : "new_file",
            vtype: 'vtalfanumericos',
            listeners: {
                invalid: function (thisf, msg) {
                    me.btnAceptar.disable();
                },
                valid: function (thisf) {
                    if (me.comboformato.isValid()) {
                        me.btnAceptar.enable();
                    }
                }
            }
        });

        me.storeformato = new Ext.data.SimpleStore({
            fields: ['id', 'denominacion', 'formato'],
            data: [[1, 'PDF', 'pdf'], [2, 'RTF', 'rtf']]
        });

        me.comboformato = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            store: me.storeformato,
            fieldLabel: me.etiquetas.lbFormatoArchivo,
            valueField: 'formato',
            displayField: 'denominacion',
            id: 'farchivo' + me.idCmp,
            name: 'farchivo',
            hiddenName: 'farchivo',
            width: 170,
            allowBlank: false,
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            listeners: {
                select: function (combo, rec, index) {
                    combo.valueField = 'formato';
                },
                invalid: function (thisc, msg) {
                    me.btnAceptar.disable();
                },
                valid: function (thisf) {
                    if (me.narchivo.isValid()) {
                        me.btnAceptar.enable();
                    }
                }
            }
        });

        me.fpanel = new Ext.form.FormPanel({
            region: 'center',
            id: 'fpanelexportar',
            labelAlign: 'left',
            labelWidth: 110,
            height: 100,
            frame: true,
            items: [me.narchivo, me.comboformato]
        });

        me.items = [me.fpanel];

        me.buttons = [me.btnCancelar, me.btnAceptar];

        Planificacion.Integracion.ExportarWindowRelaciones.superclass.initComponent.call(me);
    },
    export: function (type) {
        var me = this.matrix, th = '', tr = '';


        for (var key in me.colModel.config) {
            if (me.colModel.config[key].hidden !== true && typeof me.colModel.config[key] !== "function") {
                th += "<th>" + me.colModel.config[key].header + "</th>";
            }
        }
        var rela = [], tot = 0, prom = 0;
        me.store.data.each(function (row) {
            var data = row.data;

            var relaciones = 0;
            var total = 0;

            tr += "<tr>";
            for (var key in me.colModel.config) {
                if (me.colModel.config[key].hidden !== true && typeof me.colModel.config[key] !== "function" && me.colModel.config.hasOwnProperty(key) && row.data.hasOwnProperty(me.colModel.config[key].dataIndex)) {

                    if (me.colModel.config[key].dataIndex === "denominacion") {
                        tr += "<th>" + me.datarender(row.data[me.colModel.config[key].dataIndex]) + "</td>";
                    } else {
                        tr += "<td>" + me.datarender(row.data[me.colModel.config[key].dataIndex]) + "</td>";
                        //row.data.hasOwnProperty(me.colModel.config[key].dataIndex)
                        rela[key] += row.data[me.colModel.config[key].dataIndex].length > 0 ? 1 : 0;
                    }
                }
            }
            tr += "<td><b>" + me.relacionesRender(relaciones, false, row) + "</b></td>";
            tr += "<td><b>" + me.totalRender(relaciones, false, row) + "</b></td>";
            tr += "</tr>"
        });
        var exporthtml = "<table class='table'><thead><tr>" + th + "</tr></thead><tbody>" + tr + "</tbody></table>";
        var filename = "newfile";
        me.controller._insertItem('matrizrelaciones', me);
        me.controller.export(type, filename, exporthtml);
    }
});
Ext.reg('Planificacion.Integracion.ExportarWindowRelaciones', Planificacion.Integracion.ExportarWindowRelaciones);
Planificacion.Integracion.WincSetText = Ext.extend(Ext.Panel, {
    width: 200,
    height: 150,
    ignoreNoChange: true,
    layout: "border",
    value: "",
    closable: true,
    alignment: "tl?",
    shadow: "frame",
    floating: true,
    shadowOffset: 10,
    constrain: true,
    swallowKeys: true,
    completeOnEnter: true,
    cancelOnEsc: true,
    updateEl: true,
    grow: true,
    controller: this.controller ? this.controller : new Planificacion.Integracion.MatrizrelacionesController(),
    initComponent: function () {
        var me = this;
        me.id = 'panelSetTextEditor&' + me.id;
        me.etiquetas = me.etiquetas ? me.etiquetas : me.controller._getLabel('Matrizrelaciones');
        me.key = "new", me.oldTv = "", me.startValue = me.value = [];
        me.addEvents("beforestartedit", "startedit", "beforecomplete", "complete", "canceledit", "specialkey", "blur", "focus", "change", "invalid", "valid");
        me.recText = Ext.data.Record.create([
            {name: 'texto', type: 'string'},
            {name: 'id'}
        ]);
        me.gstore = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                root: 'datos',
                record: 'text',
                id: 'id'
            }, me.recText)
        });
        me.btnAdicionarTexto = new ExtExtend.Components.buttons.btnAdicionar({
            text: "",
            tooltip: me.etiquetas.ttpAdicionar,
            handler: function () {
                var t = new me.recText({
                    texto: '',
                    id: 'new-' + me.gstore.getCount()
                });
                me.gridEditor.stopEditing();
                me.gstore.insert(0, t);
                me.gridEditor.startEditing(0, 0);
            }
        });
        me.btnAceptarTexto = new ExtExtend.Components.buttons.btnAceptar({
            text: "",
            tooltip: me.etiquetas.ttpAceptar,
            handler: function () {
                me.fireEvent("blur", me);
            }
        });
        me.btnCancelarTexto = new ExtExtend.Components.buttons.btnCancelar({
            text: "",
            tooltip: me.etiquetas.ttpCancelar,
            handler: function () {
                me.cancelEdit();
            }
        });
        me.gridEditor = new Ext.grid.EditorGridPanel({
            id: "gridEditor&" + me.id,
            region: 'center',
            store: me.gstore,
            overCls: 'text-grid-editor-over',
            baseCls: 'text-grid-editor-base',
            cls: 'text-grid-editor',
            hideHeaders: true,
            clicksToEdit: 1,
            autoExpandColumn: 'denom&' + me.id,
            view: new Ext.grid.GridView({
                forceFit: true,
                emptyText: "..." + me.etiquetas.ttpAdicionar + "...",
                scrollOffset: '1px'
            }),
            listeners: {
                afteredit: function (ev) {
//                    var idtext = ev.record.data.id;
//                    var delarr = idtext.split("-");
                    if (ev.originalValue !== "") {
                        ev.record.data.id = "upd-" + ev.record.id
                    }
                },
                cellclick: function (thGr, rInd, colInd, ev) {
                    if (colInd === 0) {
                        var idtext = thGr.getStore().getAt(rInd).get("id");
                        var delarr = idtext.split("-");
                        if (delarr[0] !== "del" && !isNaN(delarr[0])) {
                            thGr.getStore().getAt(rInd).set("id", "del-" + delarr[0]);
//                            thGr.getStore().getAt(rInd).set("texto", '<i>' + thGr.getStore().getAt(rInd).get("texto") + '</i>');
                        }
                    }
                }
            },
            colModel: new Ext.grid.ColumnModel([{
                id: 'idcol&' + me.id,
                hideable: false,
                sortable: false,
                locked: true,
                hidden: false,
                editable: false,
                align: 'left',
                dataIndex: 'id',
                selectable: false,
                renderer: function (c, metaData, record, rowIndex, colIndex, store) {
                    metaData.css = "col-delete-text";
                    metaData.style = "width:16px;text-align:center;";
                    return '<div id="butondeletetext&' + me.id + rowIndex + colIndex + '" class="extExtend_eliminar col-delete-text" onclick="me.deferredFocus"></div>';
                }
            }, {
                id: 'denom&' + me.id,
                hideable: false,
                sortable: false,
                locked: true,
                align: 'left',
                dataIndex: 'texto',
                editable: true,
                editor: new Ext.form.TextField({
                    id: 'tfEditText&' + me.id,
                    allowBlank: false
                }),
                renderer: function (c, metaData, record, rowIndex, colIndex, store) {
                    var idtext = record.get("id"), delarr = idtext.split("-"), res;
                    if (delarr[0] == "del") {
                        res = "<strike>" + c + "</strike>";
                    } else {
                        res = c;
                    }
                    return res;
                }
            }]),
            bbar: new Ext.Toolbar({
                cls: 'text-bbar-editor',
                items: [me.btnAdicionarTexto, '->', me.btnCancelarTexto, me.btnAceptarTexto]
            })
        });
        me.items = [me.gridEditor];
        Planificacion.Integracion.WincSetText.superclass.initComponent.call(me);
    },
    isDirty: function () {
        var me = this;
        if (me.disabled) {
            return false;
        }
        var B = me.getValue();
        var stringNewV = B.toString();
        var stringOldV = me.startValue.toString();
        return (stringNewV !== stringOldV) && me.ignoreNoChange;
    },
    onRender: function (B, A) {
        var me = this;
        Planificacion.Integracion.WincSetText.superclass.onRender.call(me, B, A);
        me.grid = Ext.getCmp(B.parent().parent().parent().parent().parent().parent().parent().parent().id);
        me.el = new Ext.Layer({
            shadow: me.shadow,
            cls: "x-editor",
            parentEl: B,
            shim: me.shim,
            shadowOffset: me.shadowOffset,
            id: me.id,
            constrain: me.constrain
        });
        me.inEditor = true;
        me.render(me.el);
        me.on("specialkey", me.onSpecialKey, me);
        me.on("complete", me.onEditComplete, me);
        if (me.swallowKeys) {
            me.el.swallowEvent(["keydown", "keypress"])
        }

        me.focus();
        me.on("blur", me.onBlur, me);
        me.show();
        if (me.grow) {
            me.on("autosize", me.el.sync, me.el, {delay: 1})
        }
    },
    onSpecialKey: function (C, B) {
        var me = this;
        var A = B.getKey();
        if (me.completeOnEnter && A == B.ENTER) {
            B.stopEvent();
            me.completeEdit(me)
        } else {
            if (me.cancelOnEsc && A == B.ESC) {
                me.cancelEdit()
            } else {
                me.fireEvent("specialkey", C, B)
            }
        }
        if (me.triggerBlur && (A == B.ENTER || A == B.ESC || A == B.TAB)) {
            me.triggerBlur()
        }
    },
    startEdit: function (B, C) {
        var me = this;
        if (me.editing) {
            me.completeEdit(me);
        }
        me.boundEl = Ext.get(B);
        var A = C !== undefined ? C : [];
        if (me.fireEvent("beforestartedit", me, me.boundEl, A) === false) {
            return;
        }
        me.value = me.startValue = A;
        me.loadData(me.value);
        me.editing = true;
        me.realign();
        me.show();
    },
    realign: function () {
        var me = this;
//        me.setWidth(me.boundEl.getWidth());
        me.el.alignTo(me.boundEl, me.alignment);
    },
    completeEdit: function (ME) {
        var me = this
        if (typeof ME !== 'undefined') {
            if (ME.id === me.id) {
                if (!me.editing) {
                    return;
                }
                var storeData = me.parseValue();
                me.setValue(storeData);
                if (me.isDirty()) {
                    var B = me.getValue();
                    if (me.fireEvent("beforecomplete", me, B, me.startValue) !== false) {
                        me.editing = false;
                        if (me.updateEl && me.boundEl) {
                            me.boundEl.update(B);
                        }
                        me.editing = false;
                        me.activeEditor = null;
                        me.fireEvent("change", me, B, me.startValue);
                        me.fireEvent("complete", me, B, me.startValue);
                    }
                }
                me.editing = false;
                return me.hide();
            }
        }
    },
    onEditComplete: function (B, D, A) {
        var me = this;
//        B.grid.fireEvent("complete", B, D, A);
    },
    onShow: function () {
        var me = this;
        me.el.show();
        if (Ext.isIE && !this.fixIEFocus) {
            this.fixIEFocus = true;
            this.deferredFocus.defer(50, this);
        } else {
            this.focus();
        }
        me.expand(true);
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },
    loadData: function (data) {
        var me = this;
        var loadabledata = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                for (var key1 in data[key]) {
                    if (data[key].hasOwnProperty(key1)) {
                        loadabledata.push({
                            id: key1,
                            texto: data[key][key1]
                        });
                    }
                }
            }
        }
        me.gstore.loadData({
            datos: loadabledata
        });
    },
    cancelEdit: function (A) {
        var me = this;
        if (me.editing) {
            var B = me.getValue();
            me.setValue(me.startValue);
            if (A !== true) {
                me.hide();
            }
            me.fireEvent("canceledit", me, B, me.startValue);
//            me.grid.fireEvent("complete", me.grid, B, me.startValue);
        }
    },
    onBlur: function () {
        var me = this;
        if (me.allowBlur !== true && me.editing) {
            me.completeEdit(me);
        }

    },
    onHide: function () {
        var me = this;
        if (me.editing) {
            me.completeEdit(me);
            return;
        }
        me.blur();
        me.el.hide();
        if (me.hideEl !== false) {
            me.boundEl.show()
        }
    },
    getValue: function () {
        var me = this;
        return me.value;
    },
    setValue: function (val) {
        var me = this;
        me.value = val;
    },
    parseValue: function () {
        var me = this;
        var obj = [], mykey = "new";
        for (var key in me.value) {
            if (me.value.hasOwnProperty(key)) {
                mykey = key;
            }
        }
        obj = new Object();
        obj[mykey] = {};
        me.gstore.each(function (rec) {
            obj[mykey][rec.data.id] = rec.data.texto;
        });
        obj.toString = function () {
            var res = "";
            var first = true;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    for (var key1 in obj[key]) {
                        if (obj[key].hasOwnProperty(key1)) {
                            res += (!first ? ", " : "") + obj[key][key1];
                            first = false;
                        }
                    }
                }
            }
            return res;
        }
        return obj;
    }
});
Ext.reg('Planificacion.Integracion.WincSetText', Planificacion.Integracion.WincSetText);
Planificacion.Integracion.EditorNF = Ext.extend(Ext.form.NumberField, {
    id: 'NumberEditor&' + this.id,
    initComponent: function () {
        var me = this;
        if (me.sologd) {
            me.maskRe = /([0-3])$/;
            me.maxLength = 1;
        }
        me.on('keypress', function (th, e) {
        });
        me.key = "new", me.oldNv = "", me.oldValue = me.value = [];
        me.on('change', function (th, nw, old) {
            var me = this;
            if (me.sologd) {
                if (nw == 0 || nw == 1 || nw == 2 || nw == 3) {
                } else {
                    mostrarMensaje(1, 'El grado de dominio debe ser 0(ninguno), 1(poco), 2(medio) y 3(alto).', function () {
                    });
                    th.setValue(old);
                }

            }

        });
        Planificacion.Integracion.EditorNF.superclass.initComponent.call(me);


    },
    getValue: function () {
        var me = this;
        return me.value;
    },
    beforeBlur: function () {
        var me = this;
        me.oldValue = me.getValue();
        var A = this.parseValue(me.getRawValue());
        if (A) {
            me.setValue(A);
        }

    },
    onBlur: function () {
        var me = this;
        me.beforeBlur();
        if (!Ext.isOpera && me.focusClass) {
            me.el.removeClass(me.focusClass)
        }
        me.hasFocus = false;
        if (me.value.hasOwnProperty(me.key) && String(me.value[me.key]["number"]) !== String(me.oldNv)) {
            me.fireEvent("change", me, me.value[me.key]["number"], me.oldNv);
        }
        me.fireEvent("blur", me);
    },
    setValue: function (val) {
        var me = this;
        me.key = "new";
        me.oldNv = "";
        me.setRawValue("");
        for (var key in val) {
            if (val.hasOwnProperty(key) && val[key].hasOwnProperty("number")) {
                if (!isNaN(val[key]["number"])) {
                    me.key = String(key);
                    me.oldNv = me.value.hasOwnProperty(key) && me.value[key].hasOwnProperty("number") ? me.value[key]["number"] : val[me.key]["number"];
                    me.setRawValue(val[me.key]["number"]);
                }
            }
        }
        me.value = val;
    },
    parseValue: function (A) {
        var me = this;
        var obj = new Object();
        if (me.key && A !== "") {
            obj[me.key] = {};
            obj[me.key]["number"] = A;
            obj.toString = function () {
                if (A !== me.oldNv) {
                    return this[me.key]["number"];
                } else {
                    return "[object Object]";
                }
            }
        } else {
            obj = [];
        }
        return obj;
    }
});
Ext.reg('Planificacion.Integracion.EditorNF', Planificacion.Integracion.EditorNF);
Ext.grid.TotalSummary = function (config) {
    Ext.apply(this, config);
};
Ext.extend(Ext.grid.TotalSummary, Ext.util.Observable, {
    init: function (grid) {
        this.grid = grid;
        this.id = this.id + "&" + this.grid.id;
        this.cm = grid.getColumnModel();
        this.view = grid.getView();
        this.etiquetas = this.grid.etiquetas;
        var v = this.view;
        v.afterMethod('onDataChange', this.doGroupEnd, this);
//        v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
        v.afterMethod('onAllColumnWidthsUpdated', this.doGroupEnd, this);
        v.afterMethod('onRemove', this.doGroupEnd, this);
        v.afterMethod('onUpdate', this.doGroupEnd, this);
        v.afterMethod('onColumnMove', this.doGroupEnd, this);
        if (!this.rowTpl) {
            this.rowTpl = new Ext.Template(
                '<div class="x-grid3-summary-row x-grid3-header" style="{tstyle}">',
                '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                '<tbody><tr>{cells}</tr></tbody>',
                '</table></div>'
            );
            this.rowTpl.disableFormats = true;
        }
        this.rowTpl.compile();
        if (!this.cellTpl) {
            this.cellTpl = new Ext.Template(
                '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}">',
                '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on"><i>{value}</i></div>',
                "</td>"
            );
            this.cellTpl.disableFormats = true;
        }
        this.cellTpl.compile();
        this.bbarpanel = new Ext.Panel({
            id: "panel&" + this.id
        });
    },
    toggleSummaries: function (visible) {
        var el = this.grid.getGridEl();
        if (el) {
            if (visible === undefined) {
                visible = el.hasClass('x-grid-hide-summary');
            }
            el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
        }
    },
    renderSummary: function (o) {
        var buf = [], c, cf, p = {}, cs = this.view.getColumnData(), cfg = this.view.cm.config, last = cs.length - 1;
        this.rowTpl.overwrite(this.bbarpanel.body, {
            tstyle: 'width:' + this.view.getTotalWidth() + ';',
            cells: buf.join('')
        });
        for (var key in o) {
            buf = [];
            for (var i = 0, len = cs.length; i < len; i++) {
                c = cs[i];
                cf = cfg[i];
                p.id = c.id;
                p.style = c.style;
                p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                if (cf.name === "denominacion") {
                    p.value = this.etiquetas["header" + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()];
                } else if (!isNaN(o[key][cf.name])) {
                    p.value = Math.round(o[key][cf.name] * 100) / 100;
                } else {
                    p.value = "";
                }
                buf[buf.length] = this.cellTpl.apply(p);
            }
            this.rowTpl.append(this.bbarpanel.body, {
                tstyle: 'width:' + this.view.getTotalWidth() + '; ',
                cells: buf.join('')
            });
        }

        return this.bbarpanel.body;
    },
    calculate: function () {
        var cm = this.cm, data = {}, r, rs = this.grid.store.data.items, totalgral = this.grid.totalgral();
        if (this.grid.config.cantrelaciones) {
            data.relaciones = {
                relaciones: 0
            };
        }
        if (this.grid.config.porciento) {
            data.porciento = {
                totalgral: totalgral,
                totalp: 0,
                porciento: 0
            };
        }
        if (this.grid.config.promedio) {
            data.promedio = {
                totalgral: totalgral,
                count: 0,
                promedio: 0
            };
        }
        if (this.grid.config.totaldatos) {
            data.total = {
                total: totalgral
            };
        }
        for (var j = 0, jlen = rs.length; j < jlen; j++) {
            r = rs[j].data;
            for (var key in r) {
                if (r.hasOwnProperty(key)) {
                    if (key !== "promedio" && key !== "relaciones" && key !== "total" && key !== "porciento" && key !== "denominacion" && key !== "idcolumnafila" && key !== "descripcion" && key !== "recursos") {
                        if (this.grid.config.totaldatos) {
                            data.total[key] = Ext.grid.TotalSummary.Calculations["totaldatos"](r[key], key, data.total);
                        }
                        if (this.grid.config.porciento) {
                            data.porciento[key] = Ext.grid.TotalSummary.Calculations["porciento"](r[key], key, data.porciento);
                        }
                        if (this.grid.config.promedio) {
                            data.promedio[key] = Ext.grid.TotalSummary.Calculations["promedio"](r[key], key, data.promedio);
                        }
                        if (this.grid.config.cantrelaciones) {
                            data.relaciones[key] = Ext.grid.TotalSummary.Calculations["relaciones"](r[key], key, data.relaciones);
                        }
                    }
                }
            }
        }
        return data;
    },
    doGroupEnd: function (thisg) {
        var data = this.calculate(thisg);
        if (!this.bbarpanel.rendered) {
            this.bbarpanel.render(this.grid.body.dom.childNodes[0].childNodes[0].childNodes[1]);
        }
        var rs = this.grid.getStore();
        var valor = Planificacion.Integracion.functions.getTotalValorGeneral(rs);
        var valor1 = Planificacion.Integracion.functions.getTotalValor1General(rs);
        //var valor2 = Planificacion.Integracion.functions.getTotalrecursos(rs);
        //console.log(rs);
        //console.log(valor);
        //console.log(valor1);
        if (data.total) {
            data.total.valor = valor.valor;
            data.total.valor1 = valor1.valor;
            //data.total.recursos = valor2.valor;
        }
        this.renderSummary(data);
    },
    doAllWidths: function (ws, tw) {
        if (this.bbarpanel.body) {
            var s = this.bbarpanel.body.dom.childNodes, cells;
            for (var i = 0, max = s.length; i < max; i++) {
                s[i].style.width = tw;
                s[i].firstChild.style.width = tw;
                cells = s[i].firstChild.firstChild.rows[0].childNodes;
                for (var j = 0, max1 = cells.length; j < max1; j++) {
                    cells[j].style.width = ws[j];
                }
            }
        }
    }
});
Ext.grid.TotalSummary.Calculations = {
    totaldatos: function (record, field, data) {
        data[field] = data[field] || 0;
        if (field == 'valor' || field == 'valor1') {
            if (record[field] && record !== '' && record !== 'undefined' && record !== undefined && record !== null) {
                var arr = parseFloat(record[field]);
                data[field] += arr;
            }
        }
        else if (record.length !== 0) {
            for (var key in record) {
                if (record.hasOwnProperty(key) && record[key] !== null) {
                    if (record[key].hasOwnProperty("number") && !isNaN(record[key]["number"])) {
                        data[field] += parseFloat(record[key]["number"]);
                    } else {
                        for (var key1 in record[key]) {
                            if (record[key].hasOwnProperty(key1)) {
                                data[field]++;
                            }
                        }
                    }
                }
            }
        }
        return data[field];
    },
    porciento: function (record, field, data) {
        data["total" + field] = data["total" + field] || 0;
        data[field] = data[field] || 0;
        if (record.length !== 0) {
            for (var key in record) {
                if (record.hasOwnProperty(key) && record[key] !== null) {
                    if (record[key].hasOwnProperty("number") && !isNaN(record[key]["number"])) {
                        data["total" + field] += parseInt(record[key]["number"]);
                    } else {
                        for (var key1 in record[key]) {
                            if (record[key].hasOwnProperty(key1)) {
                                data["total" + field]++;
                            }
                        }
                    }
                }
            }
        }
        data[field] = data["total" + field] === 0 || data.totalgral === 0 ? 0 : data["total" + field] * 100 / data.totalgral;
        data.porciento = data["total" + field] === 0 || data.totalgral === 0 ? 0 : 100;
        return data[field];
    },
    promedio: function (record, field, data) {
        data["total" + field] = data["total" + field] || 0;
        data["count" + field] = data["count" + field] || 0;
        data[field] = data[field] || 0;
        //if (record.length !== 0) {
        for (var key in record) {
            if (record.hasOwnProperty(key) && record[key] !== null) {
                if (record[key].hasOwnProperty("number") && !isNaN(record[key]["number"])) {
                    data["total" + field] += parseInt(record[key]["number"]);
                } else {
                    for (var key1 in record[key]) {
                        if (record[key].hasOwnProperty(key1)) {
                            data["total" + field]++;
                        }
                    }
                }
                data.count++;
            }
        }
        data["count" + field]++;
        //}
        data[field] = data["count" + field] === 0 ? 0 : data["total" + field] / data["count" + field];
        data.promedio = data.count === 0 ? 0 : data.totalgral / data.count;
        return data[field];
    },
    relaciones: function (record, field, data) {
        data[field] = data[field] || 0;
        if (record.length !== 0) {
            data[field]++;
            data.relaciones++;
        }
        return data[field];
    },
    max: function (v, record, field, data) {
        var v = record.data[field];
        var max = data[field + 'max'] === undefined ? (data[field + 'max'] = v) : data[field + 'max'];
        return v > max ? (data[field + 'max'] = v) : max;
    },
    min: function (v, record, field, data) {
        var v = record.data[field];
        var min = data[field + 'min'] === undefined ? (data[field + 'min'] = v) : data[field + 'min'];
        return v < min ? (data[field + 'min'] = v) : min;
    },
    sum: function (v, record, field) {
        return v + (record.data[field] || 0);
    }
}
Planificacion.Integracion.functions = {
    getTotalFila: function (record) {
        var data = record.data, totalrecurso = total = relaciones = cantc = 0;
        for (var key in data) {
            if (data.hasOwnProperty(key) && key !== "denominacion" && key !== "descripcion" && key !== "idcolumnafila" && key !== "porciento" && key !== "promedio" && key !== "relaciones" && key !== "total" && key !== "recursos" && key !== "valor" && key !== "valor1") {
                cantc++;
                if (data[key].length !== 0) {
                    relaciones++;
                    for (var key1 in data[key]) {
                        if (data[key].hasOwnProperty(key1) && data[key][key1] !== null) {
                            if (data[key][key1].hasOwnProperty("number") && !isNaN(data[key][key1]["number"])) {
                                total += parseFloat(data[key][key1]["number"]);
                            } else {
                                for (var key2 in data[key][key1]) {
                                    if (data[key][key1].hasOwnProperty(key2)) {
                                        total++;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        }
        return {
            total: total,
            relaciones: relaciones,
            cantc: cantc
        };
    },
    getTotalFila1: function (record) {
        var data = record.data, total = relaciones = cantc = 0;
        for (var key in data) {
            if (data.hasOwnProperty(key) && key !== "denominacion" && key !== "descripcion" && key !== "idcolumnafila" && key !== "porciento" && key !== "promedio" && key !== "relaciones" && key !== "total" && key !== "recursos" && key !== "valor" && key !== "valor1") {
                cantc++;
                if (data[key].length !== 0) {
                    relaciones++;
                    for (var key1 in data[key]) {
                        if (data[key].hasOwnProperty(key1) && data[key][key1] !== null) {
                            if (data[key][key1].hasOwnProperty("number") && !isNaN(data[key][key1]["number"])) {
                                total += parseFloat(data[key][key1]["number"]);
                            } else {
                                for (var key2 in data[key][key1]) {
                                    if (data[key][key1].hasOwnProperty(key2)) {
                                        if (data[key][key1][key2] == 'D' || data[key][key1][key2] == 'd' || data[key][key1][key2] == 'directa' || data[key][key1][key2] == 'Directa') {
                                            total++;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return {
            directas: total,
            relaciones: relaciones,
            cantc: cantc
        };
    },
    getTotalGeneral: function (store) {
        var _this = this, totalrecord = {}, total = relaciones = 0;
        store.data.each(function (record) {
            totalrecord = _this.getTotalFila(record);
            total += totalrecord.total;
            relaciones += totalrecord.relaciones;
        });
        return {
            total: total,
            relaciones: relaciones
        };
    }
    ,
    getTotalValorGeneral: function (store) {
        var _this = this, totalrecord = {}, total = relaciones = 0;
        store.data.each(function (record) {
            if (record.data.valor)
                total += parseFloat(record.data.valor);
        });
        return {
            valor: total
        };
    },
    getTotalValor1General: function (store) {
        var _this = this, totalrecord = {}, total = relaciones = 0;
        store.data.each(function (record) {
            if (record.data.valor1)
                total += parseFloat(record.data.valor1);
        });
        return {
            valor: total
        };
    },
    getTotalrecursos: function (store) {
        var _this = this, totalrecord = {}, total = relaciones = 0;
        store.data.each(function (record) {
            if (record.data.totalrecursos)
                total += parseFloat(record.data.totalrecursos);
        });
        return {
            valor: total
        };
    }

}
Ext.reg('Planificacion.Integracion.functions', Planificacion.Integracion.functions);
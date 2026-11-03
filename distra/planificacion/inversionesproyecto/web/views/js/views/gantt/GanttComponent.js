Planificacion.Integracion.GanttComponent = ExtExtend.Class({
    $extend: Ext.Panel,
    initComponent: function() {
        var _this = this;

        _this.extendCmp = ExtExtend.Components;

        _this.controller._insertItem('ganttComponent', _this);

        var fieldDenom = new _this.extendCmp.fields.fieldDenom({
            width: 400,
            allowBlank: true,
            colWidth: .2,
            anchor: "98%"
        });

        var fieldFechaInicio = new _this.extendCmp.fields.dateField({
            fieldLabel: _this.etiquetas.fieldLabelFechaInicio,
            allowBlank: true,
            colWidth: .1,
            anchor: "96%"
        });

        var fieldFechaFin = new _this.extendCmp.fields.dateField({
            fieldLabel: _this.etiquetas.fieldLabelFechaFin,
            allowBlank: true,
            colWidth: .1,
            anchor: "98%"
        });

        _this.btnBuscar = new _this.extendCmp.buttons.btnBuscar({
            text:'<u>B</u>uscar',
            tooltip: 'Buscar tarea',
            handler: function() {
                _this.handlerButtonBuscar();
            }
        });

        _this.btnExportar = new _this.extendCmp.buttons.btnExportar({
            handler: function() {
                params = {
                    idestudiogantt: _this.objproyecto.get('idestudiogantt'),
                    denominacion: _this.objproyecto.get('denominacion')
                }
                _this.controller.obtenerReporte(params);

                var ganttDiagram = new Planificacion.Integracion.GanttDiagram({
                    etiquetas: _this.etiquetas,
                    extendCmp: _this.extendCmp,
                    controller: _this.controller,
                    objproyecto: _this.objproyecto,
                    ganttComponent: _this
                });
            }
        });

        _this.btnAyuda = new _this.extendCmp.buttons.btnAyuda({
            tooltip: 'Mostrar ayuda de la funcionalidad',
            handler: function() {
                _this.controller.mostrarAyuda('gantt');
            }
        });

        _this.btnLimpiar = new _this.extendCmp.buttons.btnLimpiar({
            text:'<u>L</u>impiar',
            tooltip: 'Limpiar filtros',
            handler: function() {
                _this.searchPanel.elementos[0].reset();
                _this.searchPanel.elementos[1].reset();
                _this.searchPanel.elementos[2].reset();
                _this.gridPanel.getStore().load({
                    params: {
                        idestudiogantt: _this.objproyecto.get('idestudiogantt')
                    }
                });
            }
        });

        _this.searchPanel = new Ext.ToolBar.searchToolBar({
            elementos: [fieldDenom, fieldFechaInicio, fieldFechaFin],
            botones: [_this.btnBuscar, _this.btnLimpiar]
        });

        _this.btnAdicionar = new _this.extendCmp.buttons.btnAdicionar({
            text:'Ad<u>i</u>cionar',
            tooltip: 'Adicionar acción',
            handler: function() {
                _this.handlerButtonTbar('adicionar');
            }
        });

        _this.btnModificar = new _this.extendCmp.buttons.btnModificar({
            text:'<u>M</u>odificar',
            tooltip: 'Modificar acción',
            disabled: true,
            handler: function() {
                _this.handlerButtonTbar('modificar');
            }
        });

        _this.btnEliminar = new _this.extendCmp.buttons.btnEliminar({
            tooltip: 'Eliminar acción',
            disabled: true,
            handler: function() {
                _this.handlerButtonTbar('eliminar');
            }
        });

        _this.btnGenerarDiagrama = new _this.extendCmp.Button({
            text: _this.etiquetas.textGenerarDiagrama,
            iconCls: 'btn',
            icon: _this.perfil.dirImg + 'genreportesinactivo.png',
            handler: function() {
                // generar diagrama de gantt
                var ganttDiagram = new Planificacion.Integracion.GanttDiagram({
                    etiquetas: _this.etiquetas,
                    extendCmp: _this.extendCmp,
                    controller: _this.controller,
                    objproyecto: _this.objproyecto,
                    ganttComponent: _this
                });
                ganttDiagram.show();
            }
        });

        _this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnGenerarDiagrama, '->', _this.btnExportar, _this.btnAyuda];

        _this.gridPanel = new Planificacion.Integracion.GanttGridPanel({
            etiquetas: _this.etiquetas
        });

        _this.items = [_this.searchPanel, _this.gridPanel];

        _this.on('show', function() {
            _this.gridPanel.getStore().load({
                params: {
                    idestudiogantt: _this.objproyecto.get('idestudiogantt')
                }
            });
        });

        _this.keys = [
            {
                key: 'i',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnAdicionar.handler.call();
                }
            },
            {
                key: 'h',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnAyuda.handler.call();
                }
            },
            {
                key: Ext.EventObject.DELETE,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnEliminar.handler.call();
                }
            },
            {
                key: 'm',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnModificar.handler.call();
                }
            },
            {
                key: 'b',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnBuscar.handler.call();
                }
            },
            {
                key: 'l',
                alt: true,
                scope: _this,
                stopEvent: true,
                fn: function() {
                    _this.btnLimpiar.handler.call();
                }
            }

        ];

        Planificacion.Integracion.GanttComponent.superclass.initComponent.call(Ext.apply(_this, arguments));
    },
    handlerButtonTbar: function(opcion) {
        var _this = this;

        _this.createAddModWindow(opcion);

        function handlerButton(btn) {

            var formPanel = _this.addModWindow.items.items[0];

            if (formPanel.getForm().isValid()) {
                var values = formPanel.getForm().getValues();

                var objDatTareagantt = new DatTareagantt();
                objDatTareagantt.set((values));

                var fieldFechaInicio = formPanel.getForm().findField('fechaini');
                objDatTareagantt.set('fechaini', fieldFechaInicio.getValue());

                var fieldFechaFin = formPanel.getForm().findField('fechafin');
                objDatTareagantt.set('fechafin', fieldFechaFin.getValue());

                if (btn === 'aceptar') {
                    _this.addModWindow.close();
                } else if (btn === 'aplicar' && opcion === 'adicionar') {
                    _this.addModWindow.items.get(0).getForm().reset();
                }

                objDatTareagantt.on('objetoguardado', function(obj, response) {
                    Secodena.ocultarMascara('adicionarTarea');
                    if (response.cod !== 3) {
                        var msg = opcion === 'adicionar' ? _this.etiquetas.msgAdicionarTarea : _this.etiquetas.msgModificarTarea;
                        mostrarMensaje(1, msg, function() {
                        });
                    } else {
                        mostrarMensaje(1, response.mensaje, function() {
                        });
                    }
                    _this.fireEvent('show');
                });

                objDatTareagantt.on('errorguardar', function(obj, response) {
                    Secodena.ocultarMascara('adicionarTarea');
                    mostrarMensaje(1, response.mensaje, function() {
                    });
                });

                if (objDatTareagantt.isValidWithOutPK()) {
                    Secodena.mostrarMascara('adicionarTarea', '', 'Adicionando tarea...');
                    objDatTareagantt.save();
                }

            }

        }
        ;

        _this.addModWindow.buttons[2].handler = function() {
            handlerButton('aceptar');
        };
        _this.addModWindow.buttons[1].handler = function() {
            handlerButton('aplicar');
        };

        if (opcion === 'adicionar') {
            _this.addModWindow.show();
        }

        if (opcion === 'modificar') {
            _this.addModWindow.show();

            var record = _this.gridPanel.getSelectionModel().getSelected().copy();

            var form = _this.addModWindow.items.get(0).getForm();
            form.loadRecord(record);

            form.findField('idunidadtiempo').store.loadData([{
                    idunidadtiempo: record.get('idunidadtiempo'),
                    denominacion: record.get('unidadtiempo')}
            ]);
            form.findField('idunidadtiempo').setValue(record.get('idunidadtiempo'));

            form.findField('porcientocumplimiento').setValue(record.get('porcientocumplimiento'));

            if (record.get('idtareagantt') !== record.get('idpadre')) {

                form.findField('idpadre').store.loadData([{
                        idtareagantt: record.get('idpadre'),
                        denominacion: record.get('predecesora')}
                ]);
                form.findField('idpadre').setValue(record.get('idpadre'));

            } else {
                form.findField('idpadre').setValue(null);
            }

        }

        if (opcion === 'eliminar') {
            mostrarMensaje(2, _this.etiquetas.confirmEliminarTarea, function (btn) {
                if (btn === 'ok') {
                    var record = _this.gridPanel.getSelectionModel().getSelected().copy();

                    var objDatTareagantt = new DatTareagantt();
                    objDatTareagantt.set((record.data));

                    objDatTareagantt.on('objetoeliminado', function(obj, response) {
                        Secodena.ocultarMascara('eliminarTarea');
                        if (response.cod === 1) {
                            mostrarMensaje(1, _this.etiquetas.msgEliminarTarea, function() {
                            });
                        } else {
                            mostrarMensaje(1, response.mensaje, function() {
                            });
                        }
                        _this.fireEvent('show');
                    });
                    objDatTareagantt.on('erroreliminar', function (obj, response) {
                        Secodena.ocultarMascara('eliminarTarea');
                    });

                    if (objDatTareagantt.isValid()) {
                        Secodena.mostrarMascara('eliminarTarea', '', 'Eliminando tarea...');
                        objDatTareagantt.eliminar();
                    }

                } else {
                    this.close();
                }
            });
        }

    },
    createAddModWindow: function(opcion) {
        var _this = this;

        var title = opcion === 'adicionar' ? _this.etiquetas.titleAdicionarTarea : _this.etiquetas.titleModificarTarea;

        _this.addModWindow = new _this.extendCmp.containers.windows.addModWindow({
            width: 400,
            height: 370,
            layout: 'fit',
            modal: true,
            resizable: false,
            title: title
        });

        _this.addModWindow.fieldDenomTarea = new _this.extendCmp.fields.fieldDenom({
            name: 'denominacion',
            fieldLabel: _this.etiquetas.fieldLabelDenomTarea,
            anchor: '100%'
        });

        _this.addModWindow.fieldDescripTarea = new _this.extendCmp.fields.fieldDescripcion({
            name: 'descripcion',
            fieldLabel: _this.etiquetas.fieldLabelDescripTarea,
            anchor: '100%'
        });

        _this.addModWindow.fieldDuracion = new Ext.form.NumberField({
            name: 'duraciontarea',
            allowBlank: false,
            width: 54,
            listeners: {
                keyup: function(cmp) {
                    var fechaIni = _this.addModWindow.fieldFechaInicio.getValue();
                    var fechaCombo = _this.addModWindow.comboDuracion.getValue();
                    var fechaFin = _this.addModWindow.fieldFechaFin.getValue();
                    if (fechaIni !== '') {
                        // (24 horas x 60 minutos x 60 segundos x 1000 milisegundos)
                        var msecFin = fechaIni.getTime() + ((cmp.getValue() - 1) * 24 * 60 * 60 * 1000);
                        var dtFin = new Date(msecFin);
                        _this.addModWindow.fieldFechaFin.setValue(dtFin);
                    } else if(fechaIni === '' && fechaFin !== '') {
                        var msecIni = fechaFin.getTime() - ((cmp.getValue() - 1) * 24 * 60 * 60 * 1000);
                        var dtIni = new Date(msecIni);
                        _this.addModWindow.fieldFechaInicio.setValue(dtIni);
                    }                  
                }
            }
        });

        _this.addModWindow.comboDuracion = new Ext.form.ComboBox({
            name: 'idunidadtiempo',
            width: 93,
            allowBlank: false,
            readOnly: true,
            hiddenName: 'idunidadtiempo',
            displayField: 'denominacion',
            valueField: 'idunidadtiempo',
            typeAhead: true,
            loadingText: 'Cargando...',
            mode: 'remote',
            triggerAction: 'all',
            selectOnFocus: true,
            store: new Ext.data.Store({
                url: Planificacion.Integracion.UrlModulo + 'gantt/obtenerUnidadTiempo',
                reader: new Ext.data.JsonReader({},
                        [{name: 'idunidadtiempo'}, {name: 'denominacion'}])
            })
        });

        _this.addModWindow.comboCumplimiento = new Ext.form.ComboBox({
            name: 'porcientocumplimiento',
            fieldLabel: _this.etiquetas.fieldLabelCumplimiento,
            width: 70,
            allowBlank: false,
            readOnly: true,
            hiddenName: 'porcientocumplimiento',
            displayField: 'label',
            valueField: 'porcientocumplimiento',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            store: new Ext.data.SimpleStore({
                fields: ['label', 'porcientocumplimiento'],
                data: [
                    ['0 %', '0'],
                    ['10 %', '10'],
                    ['20 %', '20'],
                    ['30 %', '30'],
                    ['40 %', '40'],
                    ['50 %', '50'],
                    ['60 %', '60'],
                    ['70 %', '70'],
                    ['80 %', '80'],
                    ['90 %', '90'],
                    ['100 %', '100']
                ]
            }),
            value: '0 %'
        });

        _this.addModWindow.fieldFechaInicio = new _this.extendCmp.fields.dateField({
            id: 'fechaIni',
            name: 'fechaini',
            format: 'd/m/Y',
            fieldLabel: _this.etiquetas.fieldLabelFechaInicio,
            anchor: '80%',
            readOnly: true,
            vtype: 'daterange',
            endDateField: 'fechaFin',
            listeners: {
                 select: function(cmp, newValue) { 
                     var fechaFin = _this.addModWindow.fieldFechaFin.getValue();
                     var duracion = _this.addModWindow.fieldDuracion.getRawValue();
                     if(fechaFin !== '') {
                         var range = _this.calculateRange(newValue, fechaFin);                         
                         _this.addModWindow.fieldDuracion.setValue(range);                  
                     } else if(fechaFin === '' && duracion !== '') {
                         var msecFin = newValue.getTime() + ((duracion - 1) * 24 * 60 * 60 * 1000);
                         var dtFin =  new Date(msecFin);                         
                         _this.addModWindow.fieldFechaFin.setValue(dtFin);
                     }                     
                 }
            }
        });

        _this.addModWindow.fieldFechaFin = new _this.extendCmp.fields.dateField({
            id: 'fechaFin',
            name: 'fechafin',
            format: 'd/m/Y',
            fieldLabel: _this.etiquetas.fieldLabelFechaFin,
            anchor: '80%',
            readOnly: true,
            vtype: 'daterange',
            startDateField: 'fechaIni',
            listeners: {
                select: function(cmp, newValue) {                     
                     var fechaIni = _this.addModWindow.fieldFechaInicio.getValue();
                     var duracion = _this.addModWindow.fieldDuracion.getRawValue();
                     if(fechaIni !== '') {
                         var range = _this.calculateRange(fechaIni, newValue);                         
                         _this.addModWindow.fieldDuracion.setValue(range);
                     } else if(fechaIni === '' && duracion !== '') {
                         var msecIni = newValue.getTime() - ((duracion - 1) * 24 * 60 * 60 * 1000);
                         var dtIni = new Date(msecIni);
                        _this.addModWindow.fieldFechaInicio.setValue(dtIni);
                     }                     
                 }
            }
        });

        _this.addModWindow.comboTareaPredecesora = new Ext.form.ComboBox({
            name: 'idpadre',
            fieldLabel: _this.etiquetas.fieldLabelTareaPredecesora,
            anchor: '100%',
            readOnly: true,
            hiddenName: 'idpadre',
            displayField: 'denominacion',
            valueField: 'idtareagantt',
            typeAhead: true,
            loadingText: 'Cargando...',
            mode: 'remote',
            triggerAction: 'all',
            selectOnFocus: true,
            store: new Ext.data.Store({
                url: Planificacion.Integracion.UrlModulo + 'gantt/obtenerTareaPredecesora',
                reader: new Ext.data.JsonReader({},
                        [{name: 'idtareagantt'}, {name: 'denominacion'}, {name: 'fechaini'}]),
                listeners: {
                    beforeload: function(store, options) {
                        var params = {
                            idestudiogantt: _this.objproyecto.get('idestudiogantt')
                        };
                        if (opcion === 'modificar') {
                            params.idtareagantt = _this.addModWindow.fieldTareaGantt.getValue();
                        }
                        store.baseParams = params;
                    }
                }
            }),
            listeners: {
                select: function(combo, record, index) {
                    if (_this.addModWindow.fieldFechaInicio.getValue() !== '' &&
                            _this.addModWindow.fieldFechaInicio.isValid()) {
                        var record = (record.get('fechaini')).split('/');
                        var fechainiPredecesora = new Date(record[2], record[1] - 1, record[0]);
                        var fechainisuscesora = _this.addModWindow.fieldFechaInicio.getValue().format('Y/m/d');
                        var fsuce = new Date(fechainisuscesora);
                        var fPrede = new Date(fechainiPredecesora);
                        if (fPrede.getTime() > fsuce.getTime()) {
                            combo.markInvalid('La fecha de inicio no puede ser menor que la fecha de inicio de la acción predecesora.');
                        }
                    }
                },
                beforeselect: function(combo, record, index) {
                    combo.clearInvalid();
                }
            }
        });

        _this.addModWindow.fieldTareaGantt = new Ext.form.Field({
            name: 'idtareagantt',
            anchor: '100%',
            hidden: true,
            value: 'undefined'
        });

        _this.addModWindow.fieldEstudioGantt = new Ext.form.Field({
            name: 'idestudiogantt',
            anchor: '100%',
            hidden: true,
            value: _this.objproyecto.get('idestudiogantt')
        });

        var formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [
                {
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 1.0,
                            items: [_this.addModWindow.fieldDenomTarea]
                        }]
                },
                {
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 1.0,
                            items: [_this.addModWindow.fieldDescripTarea]
                        }]
                },
                {
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 0.5,
                            items: [new Ext.Panel({
                                    items: [
                                        new Ext.form.Label({
                                            text: _this.etiquetas.fieldLabelDuracion,
                                            style: 'font:normal 12px tahoma, arial, helvetica, sans-serif;'
                                        }),
                                        {
                                            layout: 'column',
                                            bodyStyle: 'padding:3px 0px 0 0;',
                                            items: [
                                                {
                                                    columnWidth: 0.3,
                                                    items: [_this.addModWindow.fieldDuracion]
                                                },
                                                {
                                                    columnWidth: 0.5,
                                                    items: [_this.addModWindow.comboDuracion]
                                                }
                                            ]
                                        }
                                    ]
                                })]
                        },
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 0.5,
                            items: [_this.addModWindow.comboCumplimiento]
                        }
                    ]
                },
                {
                    layout: 'column',
                    items: [
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 0.5,
                            items: [_this.addModWindow.fieldFechaInicio]
                        },
                        {
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 0.5,
                            items: [_this.addModWindow.fieldFechaFin]
                        }
                    ]
                },
                {
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            labelAlign: 'top',
                            columnWidth: 1.0,
                            items: [_this.addModWindow.comboTareaPredecesora]
                        }]
                },
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.5,
                            items: [_this.addModWindow.fieldTareaGantt]
                        },
                        {
                            columnWidth: 0.5,
                            items: [_this.addModWindow.fieldEstudioGantt]
                        }
                    ]
                }
            ]
        });

        // add formPanel
        _this.addModWindow.add(formPanel);

        // event show
        _this.addModWindow.on('show', function(win) {
            // iniciar validador formPanel
            _this.validatorFormPanel = new ExtExtend.FormValidator({
                buttons: [win.buttons[1], win.buttons[2]],
                fields: [win.fieldDenomTarea, win.fieldDescripTarea, win.fieldDuracion,
                    win.comboDuracion, win.comboCumplimiento, win.fieldFechaInicio,
                    win.fieldFechaFin, win.comboTareaPredecesora]
            });
        });

    },
    handlerButtonBuscar: function() {
        var _this = this;
        var elementos = _this.searchPanel.elementos;
        var fieldDenom = elementos[0];
        var fieldFechaInicio = elementos[1];
        var fieldFechaFin = elementos[2];
        if ((fieldDenom.getValue() !== '' && fieldDenom.isValid()) ||
                (fieldFechaInicio.getValue() !== '' && fieldFechaInicio.isValid()) ||
                (fieldFechaFin.getValue() !== '' && fieldFechaFin.isValid())) {

            var params = {
                idestudiogantt: _this.objproyecto.get('idestudiogantt'),
                denominacion: fieldDenom.getValue(),
                fechaini: fieldFechaInicio.getValue(),
                fechafin: fieldFechaFin.getValue()
            };

            _this.controller.buscarTarea(Ext.encode(params));

        }
    },
    calculateRange: function(fechaini, fechafin) {
        var msecIni = fechaini.getTime();
        var msecFin = fechafin.getTime();
        // (24 horas x 60 minutos x 60 segundos x 1000 milisegundos)        
        var msecPorDia = ((1000 * 60) * 60) * 24;
        var intervalo = msecFin - msecIni;
        var duracion = Math.floor(intervalo / msecPorDia) + 1;
        return duracion; 
    }
});
Ext.reg('Planificacion.Integracion.GanttComponent', Planificacion.Integracion.GanttComponent);
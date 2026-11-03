Utilidades.Cmp.Cmpgestionarfondotiempo = function (opcionesConfig) {

    Ext.QuickTips.init();
    Ext.Ajax.timeout = 1000000000;
    var _this = this;
    this.opcionesConfig = opcionesConfig;
    this.idcomponente = opcionesConfig.idcomponente;
    this.fecha = new Date().format('d/m/Y');
    this.arrFecha = _this.fecha.split('/');
    this.anno = _this.arrFecha[2];
    this.identidadselected = null;
    this.tieneValoresCal = false;
    this.posteliminar = false;
    this.tipoInterfaz = (opcionesConfig.hasOwnProperty('tipoInterfaz')) ? opcionesConfig.tipoInterfaz : 'estructura';
    this.tipoComponente = (opcionesConfig.hasOwnProperty('tipoComponente')) ? opcionesConfig.tipoComponente : null;
    this.idPanelPincipal = (opcionesConfig.hasOwnProperty('idPanelPincipal')) ? opcionesConfig.idPanelPincipal : '1';
    this.idcalendario = null;
    var arr_hour = [];
    this.incidencia = 0;

    //objeto del componente "barra de progreso"
    this.barraProgreso = new BarraEstado();
    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();
    this.objCrudFondoTiempo = new Utilidades.Cmp.CmpCrudFondoTiempo();

    this.btnEliminar = new Ext.Button({
        id: 'btnEliminar',
        text: 'Eliminar',
        tooltip: 'Eliminar configuraci&oacute;n del (de los) d&iacute;a(s) <b>(DEL)</b>',
        iconCls: 'eliminar',
        disabled: true,
        listeners: {
            click: function () {
                _this.getDates('DEL');
            }
        }
    });

    this.btnGuardar = new Ext.Button({
        id: 'btnGuardar',
        iconCls: 'guardar',
        disabled: true,
        text: 'Guardar',
        tooltip: 'Guardar datos de la configuraci&oacute;n de los d&iacute;as <b>(Alt+G)</b>',
        listeners: {
            click: function () {
                _this.getDates('ADD');
            }
        }
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaDiasNoLab',
        text: 'Ayuda',
        tooltip: 'Mostrar ayuda de la funcionalidad <b>(Alt+H)</b>',
        iconCls: 'ayuda'
    });

    this.datePicker = new Ext.ux.DatePickerPlus({
        useQuickTips: false,
        startDay: 0,
        format: 'd/m/Y',
        value: new Date(_this.arrFecha[2], 0, 1),
        noOfMonth: 12,
        noOfMonthPerRow: 4,
        multiSelection: true,
        allowMouseWheel: false,
        showWeekNumber: false,
        weekendText: 'Fin de semana',
        showActiveDate: true,
        summarizeHeader: true,
        renderPrevNextButtons: false,
        renderPrevNextYearButtons: true,
        renderOkUndoButtons: false,
        listeners: {
            'select': function (dp, date) {
                var allStringDates = [];
                if (Ext.isDate(date)) {
                    allStringDates.push(date.format('d/m/Y'));
                } else {
                    Ext.each(date, function (c) {
                        allStringDates.push(c.format('d/m/Y'));
                    }, this);
                }
                if (allStringDates.length > 0) {
                    //mostrarMensaje(1, 'Se ha(n) seleccionado el(los) siguiente(s) d&iacute;a(s): <br>' + allStringDates.join('<br>'));
                } else {
                    //mostrarMensaje(1, 'No se han seleccionado d&iacute;as.');
                }

            },
            'afterdateclick': function (datepicker) {
                //Validar si existen fechas seleccionadas que se puedan eliminar
                var arrayDiasConfigurados = _this.datePicker.edArray;
                var arrayDiasSeleccionados = _this.datePicker.selectedDates;
                var a = arrayDiasSeleccionados.length;
                var b = arrayDiasConfigurados.length;
                var activarBtnEliminar = false;
                for (var i = 0; i < a; i++) {
                    for (var j = 0; j < b; j++) {
                        if (arrayDiasSeleccionados[i].format('d/m/Y') == arrayDiasConfigurados[j].date.format('d/m/Y')) {
                            activarBtnEliminar = true;
                            break;
                        }
                    }
                }
                if (activarBtnEliminar) {
                    _this.tieneValoresCal = true;
                } else {
                    _this.tieneValoresCal = false;
                }
            }
            ,
            'afteryearchange': function (datepicker, oldyear, newyear) {
                _this.anno = newyear;
                _this.cbTipoDia.validate();
                _this.paintDates();
            }
        }
        ,
        eventDates: function (year) {
            var dates = [];
            return dates;
        }
    });

    this.panelDatePicker = new Ext.Panel({
        id: 'panelDatePicker' + _this.idPanelPincipal,
        region: 'center',
        width: '100%',
        heigth: 260,
        bodyBorder: true,
        autoScroll: true,
        border: true,
        frame: true,
        layout: 'fit',
        items: [_this.datePicker]
    });

    this.storeTipodia = new Ext.data.JsonStore({
        url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarTipoDias',
        autoLoad: true,
        id: 'idtipodia',
        root: 'data',
        fields: ['idtipodia', 'denominacion', 'color', 'incidencia'],
        listeners: {
            beforeload: function (st) {

            },
            load: function (store, record, options) {
                var table = leyenda();
                var Leyend = new Ext.Panel({
                    id: 'Leyend' + _this.idPanelPincipal,
                    bodyBorder: true,
                    border: true,
                    frame: true,
                    layout: 'fit',
                    html: table,
                    autoScroll: true,
                });
                if (_this.panelLeyenda.findById('Leyend' + _this.idPanelPincipal) == null) {
                    _this.panelLeyenda.add(Leyend);
                    _this.panelLeyenda.doLayout();
                } else {
                    _this.panelLeyenda.remove('Leyend' + _this.idPanelPincipal);
                    _this.panelLeyenda.add(Leyend);
                    _this.panelLeyenda.doLayout();
                }
                if (store.getCount() == 0) {
                    mostrarMensaje(1, 'Debe adicionar al menos un nomenclador de tipo de d&iacute;a(s).');
                    _this.cbTipoDia.clearValue();

                }
            }
        },
    });

    this.cbTipoDia = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        id: 'cbTipoDia' + _this.idPanelPincipal,
        fieldLabel: 'Tipo de d&iacute;as',
        store: _this.storeTipodia,
        hiddenName: 'idtipodia',
        valueField: 'idtipodia',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: false,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'local',
        readOnly: false,
        selectOnFocus: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio',
        typeAhead: true,
        anchor: '95%',
        listeners: {
            expand: function (combo) {
                _this.storeTipodia.reload();
            },
            focus: function (combo) {
                _this.storeTipodia.reload();
            },
            select: function (combo, record, index) {
                _this.incidencia = record.data.incidencia;
                if (_this.incidencia == 0) {
                    _this.cbHoras.reset();
                    _this.tmfhoraini.reset();
                    _this.tmfhorafin.reset();
                    _this.cbHoras.disable();
                    _this.tmfhoraini.disable();
                    _this.tmfhorafin.disable();
                } else {
                    _this.cbHoras.enable();
                    _this.tmfhoraini.enable();
                    _this.tmfhorafin.enable();
                }
            },

        }
    });

    this.stHoras = new Ext.data.SimpleStore({
        fields: ['hora'],
        data: [['01'], ['02'], ['03'], ['04'], ['05'], ['06'], ['07'], ['08'], ['09'], ['10'],
            ['11'], ['12'], ['13'], ['14'], ['15'], ['16'], ['17'], ['18'], ['19'], ['20'],
            ['21'], ['22'], ['23'], ['24']]
    });

    this.cbHoras = new Ext.form.ComboBox({
        id: 'cbHoras' + _this.idPanelPincipal,
        editable: false,
        fieldLabel: 'Jornada (horas)',
        valueField: 'hora',
        displayField: 'hora',
        value: '08',
        hiddenName: 'hora',
        mode: 'local',
        triggerAction: 'all',
        forceSelection: true,
        typeAhead: true,
        selectOnFocus: true,
        allowBlank: false,
        blankText: 'Este campo es obligatorio',
        emptyText: 'Seleccione',
        anchor: '95%',
        store: _this.stHoras,
        emptyText: 'Seleccione',
        listeners: {
            select: function (combo, record, index) {
                if (_this.tmfhorafin.isValid() && _this.tmfhoraini.isValid()) {
                    var vHoraFinal = _this.tmfhorafin.getValue();
                    var vHoraInicial = _this.tmfhoraini.getValue();
                    var verificarhoras = _this.restarHoras(vHoraInicial, vHoraFinal, combo.getValue());
                    if (!verificarhoras) {
                        combo.markInvalid('La jornada laboral excede el tiempo entre la hora de inicio y la hora fin.');
                    } else combo.clearInvalid();
                    return verificarhoras;
                } else {
                    combo.markInvalid('Debe validar el campo hora de inicio y/o hora de fin.');
                    return false;
                }
            },
        }
    });

    this.tmfhoraini = new Ext.form.TimeField({
        fieldLabel: 'Hora de inicio',
        format: 'H:i',
        minValue: '00:00',
        maxValue: '23:59',
        increment: 15,
        readOnly: false,
        value: '8:00',
        id: 'tmfhorainift',
        editable: true,
        emptyText: 'Seleccione',
        anchor: '95%',
        maskRe: /^([0-9:aAmMpP\s])$/,
        maxText: 'Formato establecido: hh:mm am/pm.',
        allowBlank: false,
        validationEvent: false,
        listeners: {
            beforeselect: function (combo, record, index) {
                arr_hour.push(Date.parseDate(combo.getValue(), 'H:i'));
                //si retornas true te permite seleccionar y false cancela la seleccion
                if (!_this.tmfhorafin.isValid()) {
                    combo.markInvalid('Debe validar el campo hora de fin.');
                    return false;
                } else {
                    var vHoraFinal = Date.parseDate(_this.tmfhorafin.getValue(), 'H:i').format("U");
                    var vHoraInicial = Date.parseDate(record.get('text'), 'H:i').format("U");
                    var nopuedeSeleccionar = (vHoraInicial > vHoraFinal);
                    if (nopuedeSeleccionar) {
                        combo.markInvalid("La hora de inicio debe ser menor que la hora de fin.");
                    } else {
                        _this.tmfhoraini.clearInvalid();
                        _this.tmfhorafin.clearInvalid();
                    }
                    return !nopuedeSeleccionar;
                }
            },
            select: function (combo, record, index) {
                _this.validarJornada();
            },
            'render': function (c) {
                //Validar campo al escribir
                c.getEl().on('keyup', function () {
                    if (c.isValid()) {
                        _this.validarHoraInicioFin(this, false);
                        _this.validarJornada();
                    }
                }, c);
            },
            blur: function (c) {
                if (c.isValid()) {
                    _this.validarHoraInicioFin(this, false);
                }
            }
        }
    });

    this.tmfhorafin = new Ext.form.TimeField({
        fieldLabel: 'Hora de fin',
        format: 'H:i',
        minValue: '00:00',
        maxValue: '23:59',
        increment: 15,
        readOnly: false,
        value: '17:00',
        id: 'tmfhorafinft',
        editable: true,
        emptyText: 'Seleccione',
        anchor: '95%',
        maskRe: /^([0-9:aAmMpP\s])$/,
        maxText: 'Formato establecido: hh:mm am/pm.',
        allowBlank: false,
        validationEvent: false,
        listeners: {
            beforeselect: function (combo, record, index) {
                arr_hour.push(Date.parseDate(combo.getValue(), 'H:i'));
                //si retornas true te permite seleccionar y false cancela la seleccion
                if (!_this.tmfhoraini.isValid()) {
                    combo.markInvalid('Debe validar el campo hora de inicio.');
                    return false;
                } else {
                    var vHoraInicial = Date.parseDate(_this.tmfhoraini.getValue(), 'H:i').format("U");
                    var vHoraFinal = Date.parseDate(record.get('text'), 'H:i').format("U");
                    var nopuedeSeleccionar = (vHoraInicial > vHoraFinal);
                    if (nopuedeSeleccionar) {
                        combo.markInvalid("La hora de fin debe ser mayor que la hora de inicio.");
                    } else {
                        //combo.clearInvalid();
                        _this.tmfhoraini.clearInvalid();
                        _this.tmfhorafin.clearInvalid();
                    }
                    return !nopuedeSeleccionar;
                }
            },
            select: function (combo, record, index) {
                _this.validarJornada();
            },
            'render': function (c) {
                //Validar campo al escribir
                c.getEl().on('keyup', function () {
                    if (c.isValid()) {
                        _this.validarHoraInicioFin(this, true);
                        _this.validarJornada();
                    }
                }, c);
            },
            blur: function (c) {
                if (c.isValid()) {
                    _this.validarHoraInicioFin(this, true);
                    _this.validarJornada();
                }
            }
        }
    });

    this.formularioGuardar = new Ext.FormPanel({
        id: 'formularioGuardar' + _this.idPanelPincipal,
        labelAlign: 'top',
        frame: true,
        width: '100%',
        height: 100,
        region: 'south',
        buttons: [_this.btnGuardar, _this.btnEliminar],
        items: [
            {
                layout: 'column',
                width: '100%',
                items: [{
                    columnWidth: 0.4,
                    layout: 'form',
                    items: [_this.cbTipoDia]
                }, {
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [_this.cbHoras]
                }, {
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [_this.tmfhoraini]
                }, {
                    columnWidth: 0.2,
                    layout: 'form',
                    items: [_this.tmfhorafin]
                }
                ]
            }
        ],
        listeners: {
            'clientvalidation': function (fm, valid) {
                if (_this.datePicker.selectedDates.length > 0) {
                    if (valid && (_this.identidadselected != null || _this.idcalendario != null)) {
                        _this.btnGuardar.setDisabled(false);
                    } else {
                        _this.btnGuardar.setDisabled(true);
                    }
                    if (_this.tieneValoresCal) {
                        _this.btnEliminar.setDisabled(false);
                    } else {
                        _this.btnEliminar.setDisabled(true);
                    }
                } else {
                    _this.btnGuardar.setDisabled(true);
                    _this.btnEliminar.setDisabled(true);
                }
            }
        }
    });


    this.panelLeyenda = new Ext.Panel({
        id: 'panelLeyenda' + _this.idPanelPincipal,
        width: '100%',
        heigth: 80,
        autoScroll: true,
        bodyBorder: true,
        border: true,
        split: true,
        region: 'center',
        layout: 'fit',
    });

    if (_this.tipoInterfaz == 'grid') {

        this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

        this.tfDenominacion = new Ext.form.TextField({
            id: 'tfDenominacionFondoTiempo',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
            fieldLabel: 'Denominaci&oacute;n',
            regex: _this.ObjValidaciones.expresionRegular('denominacionPuntoyComa'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,.;/()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacionPuntoyComa'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: true,
            width: '400',
            enableKeyEvents: true,
            listeners: {
                change: function (el, nv, ov) {
                    if (nv != '') {
                        //dirty = true;
                    }
                },
                keydown: function (tf, e) {
                    if (e.getKey() == 13) {
                        _this.adicionarFondoTiempo();
                    }
                },
                keyup: function (tf, e) {
                    if (tf.isValid() && tf.getValue() != '') {
                        _this.btnAdicionarFondoTiempo.enable();
                    } else {
                        _this.btnAdicionarFondoTiempo.disable();
                    }
                }
            }
        });

        this.btnAdicionarFondoTiempo = new Ext.Button({
            id: 'btnAdicionarFondoTiempo',
            //text: 'Adicionar',
            tooltip: "Adicionar fondo de tiempo (Para adicionar varios elementos separe por punto y coma ';')",
            iconCls: 'adicionar',
            disabled: true,
            handler: function () {
                _this.adicionarFondoTiempo();
            },
            listeners: {}
        });

        this.btnGuardarFondoTiempo = new Ext.Button({
            id: 'btnGuardarFondoTiempo',
            //text: 'Guardar',
            tooltip: 'Guardar fondo de tiempo',
            iconCls: 'guardar',
            disabled: true,
            handler: function () {
                _this.guardarFondoTiempo();
            },
            listeners: {}
        });

        this.btnEliminarFondoTiempo = new Ext.Button({
            id: 'btnEliminarFondoTiempo',
            //text: 'Eliminar',
            tooltip: 'Eliminar fondo de tiempo',
            iconCls: 'eliminar',
            disabled: true,
            handler: function () {
                _this.eliminarFondoTiempo();
            },
            listeners: {}
        });

        this.btnCancelarFondoTiempo = new Ext.Button({
            id: 'btnCancelarFondoTiempo',
            //text: 'Cancelar',
            tooltip: 'Deshacer cambios en el grid',
            iconCls: 'deshacer',
            disabled: true,
            handler: function () {
                _this.gpCmpFondoTiempo.getStore().rejectChanges();
                _this.btnCancelarFondoTiempo.disable();
                _this.btnGuardarFondoTiempo.disable();
            },
            listeners: {
                click: function () {

                }
            }
        });

        this.btnCompartirFondoTiempo = new Ext.Button({
            id: 'btnCompartirFondoTiempo',
            //text: 'Compartir configuraci&oacute;n',
            tooltip: 'Compartir configuraci&oacute;n  de fondo de tiempo</b>',
            iconCls: 'compartir',
            disabled: true,
            listeners: {
                click: function () {
                    var parametros = ({
                        anno: _this.anno,
                        idcalendario: _this.idcalendario,
                        tipoInterfaz: _this.tipoInterfaz
                    });
                    _this.objCrudFondoTiempo.CrearWinCrudFondoTiempo(parametros);
                }
            }
        });

        this.cmCmpFondoTiempo = new Ext.grid.ColumnModel(
            [{
                header: 'Fondo de tiempo',
                tooltip: '',
                dataIndex: 'denominacion',
                id: 'expandir',
                sortable: true,
                editor: new Ext.form.TextField({
                    allowBlank: false,
                    regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                    maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                    regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                    vtype: 'validarEspaciosEnBlanco',
                    maxLength: 255,
                    maxLengthText: 'El tamaño máximo requerido es 255 caracteres.',
                })
            }]
        );
        this.smCmpFondoTiempo = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            id: 'smCmpFondoTiempo',
            listeners: {
                rowselect: function () {
                    _this.ActualizarEstadoBarraHerramientas();
                }, rowdeselect: function () {
                    _this.ActualizarEstadoBarraHerramientas();
                }
            }
        });

        this.stCmpFondoTiempo = new Ext.data.Store({
            url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/listarFondoTiempo',
            autoLoad: true,
            listeners: {
                beforeload: function (st) {
                    st.baseParams.start = _this.start;
                },
                load: function (record) {
                    if (_this.gpCmpFondoTiempo.getStore().getCount() == 0 && !_this.posteliminar) {
                        if ((_this.gfCmpFondoTiempo.getFiltrosActivos() == undefined || _this.gfCmpFondoTiempo.getFiltrosActivos().length == 0)) {
                            mostrarMensaje(1, 'No existen datos que mostrar.');
                        } else {
                            mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                        }
                    }
                    _this.posteliminar = false;
                    _this.ActualizarEstadoBarraHerramientas();
                }
            },
            reader: new Ext.data.JsonReader({
                id: 'idcalendario',
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'idcalendario'
            }, {
                name: 'denominacion'
            }])
        });

        this.gfCmpFondoTiempo = new Ext.grid.GridFilters({
            filters: [{
                type: 'string',
                dataIndex: 'denominacion'
            }]
        });

        this.ptbGPCmpFondoTiempo = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stCmpFondoTiempo,
            displayInfo: true,
            listeners: {
                beforechange: function (p, e) {
                    _this.start = e.start;
                }
            }
        });

        this.gpCmpFondoTiempo = new Ext.grid.EditorGridPanel({
            store: _this.stCmpFondoTiempo,
            title: '',
            stripeRows: true,
            id: 'gpCmpFondoTiempo',
            region: 'center',
            sm: _this.smCmpFondoTiempo,
            cm: _this.cmCmpFondoTiempo,
            frame: true,
            autoExpandColumn: 'expandir',
            //plugins: _this.gfCmpFondoTiempo,
            margins: '2 2 2 -4',
            tbar: ['Denominaci&oacute;n: ', ' ', _this.tfDenominacion, _this.btnAdicionarFondoTiempo],
            bbar: _this.ptbGPCmpFondoTiempo,
            loadMask: {
                msg: 'Cargando datos...'
            },
            listeners: {
                celldblclick: function (grid, row_id, col_id) {
                    grid.getColumnModel().setEditable(col_id, true);
                },
                afteredit: function (e) {
                    _this.btnGuardarFondoTiempo.enable();
                    _this.btnCancelarFondoTiempo.enable();
                },
                beforeedit: function (e) {
                },
                validateedit: function (e) {
                }
            }
        });

        this.pFondoTiempo = new Ext.Panel({
            region: 'center',
            id: 'pFondoTiempo' + _this.idPanelPincipal,
            layout: 'fit',
            tbar: [_this.btnGuardarFondoTiempo, _this.btnCancelarFondoTiempo, _this.btnEliminarFondoTiempo],
            items: [_this.gpCmpFondoTiempo]
        });
    } else {

        this.btnEliminarConf = new Ext.Button({
            id: 'btnEliminarConf',
            //text: 'Eliminar configuraci&oacute;n',
            tooltip: 'Eliminar configuraci&oacute;n de la entidad <b>(Alt+DEL)</b>',
            iconCls: 'eliminar',
            disabled: true,
            listeners: {
                click: function () {
                    _this.eliminarConf();
                }
            }
        });

        this.btnDelegarConf = new Ext.Button({
            id: 'btnDelegarConf',
            //text: 'Delegar configuraci&oacute;n',
            tooltip: 'Delegar configuraci&oacute;n a la(s) entidad(es) hija(s) <b>(Ctrl+D)</b>',
            iconCls: 'heredar',
            disabled: true,
            listeners: {
                click: function () {
                    _this.delegarConf();
                }
            }
        });
        this.btnCompartirConf = new Ext.Button({
            id: 'btnCompartirConf',
            //text: 'Compartir configuraci&oacute;n',
            tooltip: 'Compartir configuraci&oacute;n  <b>(Alt+C)</b>',
            iconCls: 'compartir',
            disabled: true,
            listeners: {
                click: function () {
                    var parametros = ({
                        idEntidadCompartir: _this.identidadselected + _this.idPanelPincipal,
                        anno: _this.anno,
                        idPanelPrincipal: _this.idPanelPincipal
                    });
                    _this.objCrudFondoTiempo.CrearWinCrudFondoTiempo(parametros);
                }
            }
        });

        this.tfbuscarEstructuras = new Ext.form.TextField(
            {
                id: 'tfbuscarEstructuras',
                enableKeyEvents: true,
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                maxLength: 255,
                width: 150,
                listeners: {
                    keydown: function (tf, e) {
                        if (e.getKey() == 13) {
                            if (tf.isValid() && tf.getValue() != '') {
                                _this.tpBaseEstructura.getRootNode().reload();
                            }
                        }
                    },
                    keyup: function (tf, e) {
                        if (tf.getValue() != '') {
                            _this.btnLimpiarEstructuras.enable();
                            if (tf.isValid()) {
                                _this.btnbuscarEstructuras.enable();
                            } else {
                                _this.btnbuscarEstructuras.disable();
                            }
                        } else {
                            _this.btnLimpiarEstructuras.disable();
                            _this.btnbuscarEstructuras.disable();
                        }
                    }
                }
            });
        this.btnbuscarEstructuras = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Buscar estructura <b>(Alt+B)</b>',
            disabled: true,
            handler: function () {
                _this.tpBaseEstructura.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'B'
            },
            scope: this
        });
        this.btnLimpiarEstructuras = new Ext.Button({
            iconCls: 'limpiar',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            disabled: true,
            handler: function () {
                _this.tfbuscarEstructuras.reset();
                _this.btnbuscarEstructuras.disable();
                _this.btnLimpiarEstructuras.disable();
                _this.tpBaseEstructura.getRootNode().reload();
            },
            key: {
                alt: true,
                key: 'L'
            },
            scope: this
        });

        this.loaderTreeBaseEstructura = new Ext.tree.TreeLoader({
            dataUrl: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarEntidades',
            listeners: {
                beforeload: function (tl, n) {
                    var text = _this.tfbuscarEstructuras.getValue();
                    this.baseParams = {
                        idEstructuraPadre: n.attributes.idEstructuraPadre,
                        denominacion: text

                    };
                }
            }
        });

        this.tpBaseEstructura = new Ext.tree.TreePanel({
            autoScroll: true,
            layout: 'fit',
            border: false,
            id: 'tpBaseEstructura' + _this.idPanelPincipal,
            tbar: [_this.btnDelegarConf, _this.btnCompartirConf, _this.btnEliminarConf, '-', '-',
                'Buscar:', '', _this.tfbuscarEstructuras, _this.btnbuscarEstructuras,
                _this.btnLimpiarEstructuras, '-',
                {
                    id: 'btnExpandirEntidadGestFT',
                    iconCls: 'expandir',
                    tooltip: 'Expandir todas las entidades',
                    handler: function () {
                        _this.tpBaseEstructura.root.expand(true);
                        _this.actualizarBarraHerramientasEstructura('expandir');
                    }
                },
                {
                    id: 'btnContraerEntidadGestFT',
                    iconCls: 'contraer',
                    tooltip: 'Contraer todas las entidades',
                    handler: function () {
                        _this.tpBaseEstructura.root.collapse(true);
                        _this.actualizarBarraHerramientasEstructura('contraer');
                    }
                },
                {
                    id: 'btnActualizarEntidadGestFT',
                    iconCls: 'actualizar',
                    tooltip: 'Refrescar todas las entidades',
                    handler: function () {
                        _this.tfbuscarEstructuras.reset();
                        _this.tpBaseEstructura.getRootNode().reload();
                        _this.identidadselected = 0;
                        _this.actualizarBarraHerramientasEstructura('actualizar');
                        _this.actualizarBarraHerramientas();
                    }
                }, '->', _this.btnAyuda
            ],
            listeners: {
                click: function (n, e) {
                    _this.tpBaseEstructura.getSelectionModel().select(n);
                    _this.identidadselected = n.id;
                    _this.actualizarBarraHerramientas();
                    if (n.leaf) {
                        eshoja = 1;
                    } else {
                        eshoja = 0;
                    }

                },
                beforeexpandnode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('expandir');
                },
                beforecollapsenode: function (node) {
                    _this.actualizarBarraHerramientasEstructura('contraer');
                },
                load: function (node) {
                    _this.actualizarBarraHerramientasEstructura('actualizar');
                },
                render: function (tpanel) {
                    //_this.tpBaseEstructura.getRootNode().reload();
                }

            },
            loader: _this.loaderTreeBaseEstructura,
            root: new Ext.tree.AsyncTreeNode({
                text: 'Entidades',
                tipo: 0,
                expanded: true,
                id: '0'
            })

        });

        this.panelEstructuras = new Ext.Panel({
            id: 'panelEstructuras' + _this.idPanelPincipal,
            width: 450,
            heigth: 450,
            autoScroll: true,
            bodyBorder: true,
            border: true,
            split: true,
            region: 'center',
            items: [_this.tpBaseEstructura]
        });

        this.pEstructura = new Ext.Panel({
            region: 'center',
            id: 'pEstructura' + _this.idPanelPincipal,
            layout: 'fit',
            items: _this.tpBaseEstructura
        });
    }
    this.pDatePicker_formGuardar = new Ext.Panel({
        region: 'center',
        id: 'pDatePicker_formGuardar' + _this.idPanelPincipal,
        layout: 'border',
        /*height: 610,
         width: 1000,*/
        items: [_this.panelDatePicker, _this.formularioGuardar]
    });

    this.pLeyenda = new Ext.Panel({
        region: 'south',
        border: false,
        id: 'pLeyenda' + _this.idPanelPincipal,
        layout: 'fit',
        collapseMode: 'mini',
        width: 500,
        height: 95,
        items: _this.panelLeyenda
    });

    this.pContenedorGestionDeFondo = new Ext.Panel({
        id: 'pContenedorGestionDeFondo' + _this.idPanelPincipal,
        layout: 'border',
        region: 'east',
        width: 750,
        disabled: true,
        items: [_this.pDatePicker_formGuardar, _this.pLeyenda]
    });

    this.pContenedorGeneral = new Ext.Panel({
        id: 'pContenedorGeneral' + _this.idPanelPincipal,
        layout: 'border',
        items: [(opcionesConfig.tipoInterfaz == 'grid') ? _this.pFondoTiempo : _this.pEstructura, _this.pContenedorGestionDeFondo]
    });

    this.panelPrincipal = new Ext.Panel({
        layout: 'fit',
        /*width: 1000,
         height: 510,*/
        closable: (opcionesConfig.hasOwnProperty('cerrarPestaña')) ? opcionesConfig.cerrarPestaña : false,
        closeAction: 'destroy',
        id: _this.idPanelPincipal,
        region: 'center',
        modal: true,
        items: [_this.pContenedorGeneral]
    });

    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        closable: false,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.panelPrincipal]
    });

    function leyenda() {
        var compDiv = _this.storeTipodia.getCount() / 3;

        var Div = Math.floor(compDiv);
        var restoDiv = _this.storeTipodia.getCount() % 3;

        var arrRecs = _this.storeTipodia.getRange();
        var cont = 0;

        var tabla = "<table width='720' border='0'>";
        tabla += "<tr ><td colspan='3' ><div class='textLeyenda'><center><b>Leyenda tipo de d&iacute;as</b></center></div></td></tr> ";
        //tabla+="<tr align='center'><td colspan='3' ><div class='textLeyenda'></div></td></tr> ";
        for (var x = 0; x < Div; x++) {
            tabla += "<tr>";
            tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont].data.denominacion + " </div></td>";
            tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont + 1].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont + 1].data.denominacion + " </div></td>";
            tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont + 2].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont + 2].data.denominacion + " </div></td>";
            tabla += "</tr>";
            cont += 3;
        }

        if (restoDiv > 0) {
            tabla += "<tr>";
            if (restoDiv == 1) {
                tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont].data.denominacion + " </div></td>";
                tabla += "<td width='210'><div></div></td>";
                tabla += "<td width='210'><div></div></td>";
            }
            else {
                tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont].data.denominacion + " </div></td>";
                tabla += "<td width='210'><div class='iconLeyenda' style='background-color:" + arrRecs[cont + 1].data.color + "'></div><div class='textLeyenda'>" + arrRecs[cont + 1].data.denominacion + " </div></td>";
                tabla += "<td width='210'><div></div></td>";
            }
            tabla += "</tr>";
        }
        tabla += "</table>";

        return tabla;
    }

    this.paintDates = function () {
        _this.barraProgreso.show('Cargando...');
        Ext.Ajax.request({
            url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarDias',
            method: 'POST',
            params: {
                idestructura: (_this.identidadselected != null) ? _this.identidadselected + _this.idPanelPincipal : null,
                anno: _this.anno,
                idcalendario: _this.idcalendario
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.cantidad > 0) {
                    var arrDates = [];
                    var cont = 0;
                    var date = responseData.datos;
                    var cant = date.length;
                    Ext.each(responseData.datos, function (date) {
                        var fechas = date.fecha.split(',');
                        // function getContrastYIQ(hexcolor){
                        var r = parseInt(date.color.substr(0, 2), 16);
                        var g = parseInt(date.color.substr(2, 2), 16);
                        var b = parseInt(date.color.substr(4, 2), 16);
                        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                        var texto = (yiq >= 128) ? '#000000' : '#ffffff';
                        var txt = '';
                        if (date.horas)
                            txt = 'Tipo de día: ' + date.dentipodia + '\n Jornada: ' + date.horas + ' hora(s) \n Hora de inicio: ' + date.horainicio + '\n Hora de fin: ' + date.horafin;
                        else
                            txt = date.dentipodia;

                        var cant = fechas.length;
                        for (var i = 0; i < cant; i++) {
                            var fecha = fechas[i].split('/');
                            var style = document.createElement('style');
                            style.type = 'text/css';
                            //style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; background-color:' + date.color + ' !important;}';
                            style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; border: 2px solid #' + date.color + ' !important;}';
                            document.getElementsByTagName('head')[0].appendChild(style);
                            var x = {
                                cls: 'tipodia' + cont + '',
                                date: new Date(fecha[2], fecha[1] - 1, fecha[0]),
                                text: txt
                            };
                            arrDates.push(x);
                            cont++;
                        }
                    });
                    _this.datePicker.setEventDates(arrDates);
                    _this.cbTipoDia.validate();
                    _this.btnEliminar.setDisabled(false);
                    if (_this.btnEliminarConf) _this.btnEliminarConf.setDisabled(false);
                    if (_this.btnCompartirConf) _this.btnCompartirConf.setDisabled(false);
                    if (_this.tpBaseEstructura) {
                        var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
                        (isEntidadHija) ? _this.btnDelegarConf.setDisabled(true) : _this.btnDelegarConf.setDisabled(false);
                    }
                    _this.barraProgreso.hide();
                } else {
                    _this.tieneValoresCal = false;
                    _this.datePicker.setEventDates([]);
                    _this.cbTipoDia.validate();
                    _this.btnEliminar.setDisabled(true);
                    if (_this.btnEliminarConf) _this.btnEliminarConf.setDisabled(true);
                    if (_this.btnCompartirConf) _this.btnCompartirConf.setDisabled(true);
                    if (_this.btnDelegarConf) _this.btnDelegarConf.setDisabled(true);
                    _this.barraProgreso.hide();
                }
            }
        });
    };

    this.getDates = function (btn) {
        _this.datePicker.copyPreToSelectedDays();
        var selectedDates = _this.datePicker.selectedDates.sortDates();
        var allStringDates = [];
        if (Ext.isDate(selectedDates)) {
            allStringDates.push(date.format('d/m/Y'));
        } else {
            Ext.each(selectedDates, function (c) {
                allStringDates.push(c.format('d/m/Y'));
            }, this);
        }
        if (btn == 'ADD')
            _this.addDays(allStringDates);
        else {
            mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar la configuraci&oacute;n del(de los) d&iacute;a(s) seleccionado(s)?', function (btn) {
                if (btn == 'ok') {
                    _this.delDays(allStringDates);
                }
            })
        }

    };

    this.addDays = function (dates) {
        if (dates.length > 0 && _this.formularioGuardar.getForm().isValid()) {
            _this.barraProgreso.show('Guardando datos.');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/addDias',
                method: 'POST',
                params: {
                    idestructura: (_this.identidadselected != null) ? _this.identidadselected + _this.idPanelPincipal : null,
                    horas: _this.cbHoras.getValue(),
                    idtipodia: _this.cbTipoDia.getValue(),
                    fechas: Ext.encode(dates),
                    anno: _this.anno,
                    idcalendario: _this.idcalendario,
                    horainicio: _this.tmfhoraini.getValue(),
                    horafin: _this.tmfhorafin.getValue(),
                    incidencia: _this.incidencia
                },
                callback: function (options, success, response) {
                    _this.barraProgreso.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.cod == 1) {
                        _this.formularioGuardar.getForm().reset();
                        _this.datePicker.clearSelectedDates();
                        _this.paintDates();
                        mostrarMensaje(1, 'La configuraci&oacute;n del(de los) d&iacute;a(s) ha sido guardada satisfactoriamente.');
                    } else if (responseData.cod == 2) {
                        _this.formularioGuardar.getForm().reset();
                        _this.datePicker.clearSelectedDates();
                        _this.paintDates();
                        mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n del(de los) \n d&iacute;a(s) en alguna(s) estructura(s) hija(s).');
                    }
                    else if (responseData.cod == 3) {
                        mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n del(de los) d&iacute;a(s) seleccionado(s).');
                    }
                }
            });
        }
        else {
            mostrarMensaje(1, 'Debe seleccionar al menos un d&iacute;a en el calendario.');
        }
    };

    this.delDays = function (dates) {
        if (dates.length > 0) {
            _this.barraProgreso.show('Eliminando datos.');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delDias',
                method: 'POST',
                params: {
                    seleccion: Ext.encode(dates),
                    idestructura: (_this.identidadselected != null) ? _this.identidadselected + _this.idPanelPincipal : null,
                    anno: _this.anno,
                    idcalendario: _this.idcalendario
                },
                callback: function (options, success, response) {
                    _this.barraProgreso.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.cod == 1) {
                        _this.datePicker.clearSelectedDates();
                        _this.paintDates();
                        mostrarMensaje(1, 'La configuraci&oacute;n del(de los) d&iacute;a(s) ha sido eliminada satisfactoriamente.');
                    } else if (responseData.cod == 2) {
                        _this.datePicker.clearSelectedDates();
                        mostrarMensaje(1, 'La entidad seleccionada no tiene d&iacute;a(s) configurado(s) para el a&ntildeo ' + _this.anno + '.');
                    }
                    else {
                        mostrarMensaje(1, 'Ha ocurrido un error al eliminar la configuraci&oacute;n del(de los) d&iacute;a(s) seleccionado(s).');
                    }
                }
            });
        }
        else {
            mostrarMensaje(1, 'Debe seleccionar al menos una fecha el calendario \n para poder realizar esta acci&oacute;n.');
        }
    };

    this.eliminarConf = function () {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere eliminar toda la configuraci&oacute;n para la entidad seleccionada?', function (btn) {
            if (btn == 'ok') {
                _this.barraProgreso.show('Eliminando datos.');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delConfiguracion',
                    method: 'POST',
                    params: {
                        idestructura: _this.identidadselected + _this.idPanelPincipal,
                        anno: _this.anno
                    },
                    callback: function (options, success, response) {
                        _this.barraProgreso.hide();
                        var responseData = Ext.decode(response.responseText);
                        if (responseData.cod == 1) {
                            _this.datePicker.clearSelectedDates();
                            _this.paintDates();
                            mostrarMensaje(1, 'La configuraci&oacute;n de la entidad ha sido eliminada satisfactoriamente.');
                        } else if (responseData.cod == 2) {
                            _this.datePicker.clearSelectedDates();
                            mostrarMensaje(1, 'La entidad seleccionada no tiene d&iacute;a(s) configurado(s) para el a&ntildeo ' + _this.anno + '.');
                        }
                        else {
                            mostrarMensaje(1, 'Ha ocurrido un error al eliminar la configuraci&oacute;n de la entidad seleccionada.');
                        }
                    }
                });

            }

        });
    };

    this.delegarConf = function () {
        mostrarMensaje(2, '&iquest;Est&aacute; seguro que quiere delegar toda la configuraci&oacute;n de la entidad seleccionada a su(s) entidad(es) hija(s)?', function (btn) {
            if (btn == 'ok') {
                var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
                if (_this.identidadselected != null && _this.identidadselected != 0 && !isEntidadHija) {
                    _this.barraProgreso.show('Guardando datos.');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delegarConfiguracion',
                        method: 'POST',
                        params: {
                            idestructura: _this.identidadselected + _this.idPanelPincipal,
                            anno: _this.anno
                        },
                        callback: function (options, success, response) {
                            _this.barraProgreso.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.cod == 1) {
                                //_this.datePicker.clearSelectedDates();
                                //_this.paintDates();
                                mostrarMensaje(1, 'La configuraci&oacute;n de la(s) entidad(es) hijas(s) ha sido guardada satisfactoriamente.');
                            } else if (responseData.cod == 2) {
                                mostrarMensaje(1, 'La entidad seleccionada no tiene d&iacute;a(s) configurado(s) para el a&ntildeo ' + _this.anno + '.');
                            } else if (responseData.cod == 3) {
                                mostrarMensaje(1, 'Ha ocurrido un error al guardar la configuraci&oacute;n en alguna(s) entidad(es) hija(s).');
                            } else if (responseData.cod == 4) {
                                mostrarMensaje(1, 'Debe seleccionar una entidad padre para delegar su configuraci&oacute;n a la(s) entidad(es) hija(s).');
                            }
                        }
                    });
                } else {
                    mostrarMensaje(1, 'Debe seleccionar una entidad padre para delegar su configuraci&oacute;n a la(s) entidad(es) hija(s).');
                }
            }
        });
    };

    this.adicionarFondoTiempo = function () {
        if (_this.tfDenominacion.isValid() && _this.tfDenominacion.getValue().toString() !== '') {
            _this.barraProgreso.show('Adicionando datos...');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/adicionarFondoTiempo',
                method: 'POST',
                params: {
                    denominacion: _this.tfDenominacion.getValue()
                },
                callback: function (options, success, response) {
                    _this.barraProgreso.hide();
                    var responseData = Ext.decode(response.responseText);
                    if (responseData.cod == 1) {
                        mostrarMensaje(1, 'La denominaci&oacute;n del fondo de tiempo ha sido adicionada satisfactoriamente.');

                    } else if (responseData.cod == 0) {
                        mostrarMensaje(1, 'Ha ocurrido un error al adicionar la denominaci&oacute;n del fondo de tiempo.');
                    }
                    _this.tfDenominacion.reset();
                    _this.btnAdicionarFondoTiempo.disable();
                    _this.stCmpFondoTiempo.reload();
                }
            });
        } else {
            mostrarMensaje(1, 'Debe escribir una denominaci&oacute;n de fondo de tiempo.');
        }
    };

    this.guardarFondoTiempo = function () {
        var modified = _this.gpCmpFondoTiempo.getStore().getModifiedRecords();
        if (!Ext.isEmpty(modified)) {
            var arrayMod = [];
            Ext.each(modified, function (record) {
                arrayMod.push(Ext.apply({id: record.id}, record.data));
            });
            var long = arrayMod.length;
            if (arrayMod.length > 0) {
                _this.barraProgreso.show('Guardando datos...');
                _this.gpCmpFondoTiempo.stopEditing();
                Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/guardarFondoTiempo',
                        method: 'POST',
                        params: {
                            arrayElementos: Ext.encode(arrayMod)
                        },
                        callback: function (options, success, response) {
                            _this.barraProgreso.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.cod == 1) {
                                var msjconf = 'La denominaci&oacute;n del fondo de tiempo ha sido guardada satisfactoriamente.'
                                msjconf = (long > 1) ? 'Las denominaciones del fondo de tiempo han sido guardadas satisfactoriamente.' : msjconf;
                                mostrarMensaje(1, msjconf);
                            } else if (responseData.cod == 0) {
                                var msjerror = 'Ha ocurrido un error al guardar la denominaci&oacute;n del fondo de tiempo.';
                                msjerror = (long > 1) ? 'Ha ocurrido un error al guardar las denominaciones del fondo de tiempo.' : msjerror;
                                mostrarMensaje(1, msjerror);
                            }
                            _this.btnGuardarFondoTiempo.disable();
                            _this.btnCancelarFondoTiempo.disable();
                            _this.gpCmpFondoTiempo.getStore().commitChanges();
                        }
                    }
                );
            } else {
                mostrarMensaje(1, 'No existen datos para guardar.');
                _this.btnGuardarFondoTiempo.disable();
                _this.btnCancelarFondoTiempo.disable();
                _this.gpCmpFondoTiempo.getStore().commitChanges();
            }
        }
    };

    this.eliminarFondoTiempo = function () {
        var sm = _this.smCmpFondoTiempo;
        var gp = _this.gpCmpFondoTiempo;
        var mensajeconfirmacion2 = 'Debe seleccionar al menos un elemento para poder eliminarlo.';

        if (sm.hasSelection() && sm.getSelections().length > 0) {
            var mensaje = ' ¿Est&aacute; seguro que desea eliminar el(los) fondo(s) de tiempo seleccionado(s)?';
            var mensajemascara = 'Eliminando fondo(s) de tiempo...';
            var mensajeconfirmacion0 = 'Ha ocurrido un error al eliminar el(los) fondo(s) de tiempo seleccionado(s).';
            var mensajeconfirmacion1 = 'El(los) fondo(s) de tiempo seleccionado(s) ha(n) sido eliminado(s) satisfactoriamente.';

            var arrayIdElementosEliminar = [];
            var arrayrecords = sm.getSelections();
            var cant = arrayrecords.length;
            for (var i = 0; i < cant; i++) {
                arrayIdElementosEliminar[i] = arrayrecords[i].data.idcalendario;
            }
            mostrarMensaje(2, mensaje, function (btnoprimido) {
                if (btnoprimido == 'ok') {
                    _this.barraProgreso.show(mensajemascara);
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/eliminarFondoTiempo',
                        params: {
                            arrayIdElementosEliminar: Ext.encode(arrayIdElementosEliminar)
                        },
                        callback: function (options, success, response) {
                            _this.barraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, mensajeconfirmacion1);
                                _this.PostAccionesGestionar(1, 'Eliminar');
                            }
                            if (responseData.mensaje == 0) {
                                mostrarMensaje(1, mensajeconfirmacion0);
                                _this.PostAccionesGestionar(1, 'Eliminar');
                            }
                            if (responseData.mensaje == 2) {
                                mostrarMensaje(1, mensajeconfirmacion2);
                            }
                        }
                    });
                } else {
                    if (sm && sm.hasSelection()) {
                        sm.clearSelections();
                        if (gp) gp.getView().refresh(true);
                    }
                }
            });
        } else {
            mostrarMensaje(1, mensajeconfirmacion2, function () {
            });
        }
    };

    this.actualizarArbol = function (arbol, valor) {
        if (arbol.getSelectionModel().getSelectedNode() != undefined) {
            if (!arbol.getSelectionModel().getSelectedNode().leaf) {
                arbol.getSelectionModel().getSelectedNode().reload({
                    params: {
                        valor: valor
                    }
                });
            }
        } else
            arbol.root.reload({
                params: {
                    valor: valor
                }
            });
    };

    this.buscarNodo = function (tree) {
        _this.buscarNodoTreeX(tree, _this.identidadselected, 'idfiltroent');
    };

    this.buscarNodoTreeX = function (trEnt, idselected, idcampobusq) {

        var rootNode = null;
        var idRootNode = null;
        if (idselected == null) {
            idRootNode = trEnt.getRootNode().firstChild.id;
            rootNode = trEnt.getNodeById(idRootNode);
            trEnt.getSelectionModel().select(rootNode);
        }
        else {
            if (idRootNode == null)
                idRootNode = idselected;
            rootNode = trEnt.getNodeById(idRootNode);
        }

        function contarCoinc(t1, t2) {
            var cont = 0;
            for (var index = 0; index < t1.length && index < t2.length; index++) {
                if (t1.charAt(index).toLowerCase() == t2.charAt(index).toLowerCase()) {
                    cont++;
                } else {
                    break;
                }
            }
            return cont;
        }

        var idmayor = -1;
        var cantConincMayor = 0;
        var node = null;
        rootNode.eachChild(function (n) {
            var cont = null;
            cont = contarCoinc(n.attributes.text, Ext.getCmp(idcampobusq).getValue());
            if (cont > cantConincMayor) {
                cantConincMayor = cont;
                idmayor = n.id;
                node = n;
            }
        }, null, null);
        if (node != null)
            trEnt.getSelectionModel().select(node);

    };

    this.teclaAlt = new Ext.KeyMap(Ext.getDoc(), [
        {
            key: 'g',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 71: { //tecla "G" para guardar
                        if (!_this.btnGuardar.disabled) {
                            _this.getDates('ADD');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46, //tecla "DEL" para eliminar configuracion de los dias
            fn: function () {
                if (!_this.btnEliminar.disabled) {
                    _this.getDates();
                }
            }
        }, {
            key: 46, //tecla "DEL" para eliminar configuracion de la entidad
            alt: true,
            fn: function () {
                if (!_this.btnEliminarConf.disabled) {
                    _this.eliminarConf();
                }
            }
        }, {
            key: 'c',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 67: { //tecla "C" para copiar/compartir
                        if (!_this.btnCompartirConf.disabled) {
                            var parametros = ({
                                idEntidadCompartir: _this.identidadselected + opcionesConfig.idPanelPincipal,
                                anno: _this.anno,
                                idPanelPrincipal: _this.idPanelPincipal
                            });
                            _this.objCrudFondoTiempo.CrearWinCrudFondoTiempo(parametros);
                        }
                        break;
                    }
                }
            }
        }, {
            key: 'd',
            ctrl: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 68: { //tecla "D" para delegar
                        if (!_this.btnDelegarConf.disabled) {
                            _this.delegarConf();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 'l',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 76: { //tecla "L" para Limpiar filtro
                        if (!_this.btnLimpiarEstructuras.disabled) {
                            _this.btnLimpiarEstructuras.handler();
                        }
                        break;
                    }
                }
            }
        }, {
            key: 'b',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //tecla "B" para buscar entidad
                        if (!_this.btnbuscarEstructuras.disabled) {
                            _this.btnbuscarEstructuras.handler();
                        }
                        break;
                    }
                }
            }
        }]);

    this.actualizarBarraHerramientas = function () {
        var idPanelContenedorGestionFondo = this.pContenedorGestionDeFondo.getId();
        if (_this.identidadselected != null && _this.identidadselected != 0) {
            _this.paintDates();
            _this.pContenedorGestionDeFondo.enable();
            _this.cbHoras.validate();
            _this.cbTipoDia.validate();
            _this.btnEliminarConf.setDisabled(false);
            _this.btnCompartirConf.setDisabled(false);

            var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
            (isEntidadHija) ? _this.btnDelegarConf.setDisabled(true) : _this.btnDelegarConf.setDisabled(false);
        } else {
            _this.pContenedorGestionDeFondo.disable();
            _this.btnEliminarConf.setDisabled(true);
            _this.btnDelegarConf.setDisabled(true);
            _this.btnCompartirConf.setDisabled(true);
        }
    };

    this.actualizarBarraHerramientasEstructura = function (accion) {
        if (_this.tpBaseEstructura.getRootNode().childNodes.length == 0) {
            Ext.getCmp('btnExpandirEntidadGestFT').setDisabled(true);
            Ext.getCmp('btnContraerEntidadGestFT').setDisabled(true);
        } else {
            if (accion == 'contraer') {
                Ext.getCmp('btnExpandirEntidadGestFT').setDisabled(false);
                Ext.getCmp('btnContraerEntidadGestFT').setDisabled(true);
            } else if (accion == 'expandir' || accion == 'actualizar') {
                Ext.getCmp('btnExpandirEntidadGestFT').setDisabled(true);
                Ext.getCmp('btnContraerEntidadGestFT').setDisabled(false);
                if (accion == 'actualizar') {
                    _this.tfbuscarEstructuras.reset();
                    _this.btnbuscarEstructuras.disable();
                    _this.btnLimpiarEstructuras.disable();
                }
            }
        }
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.btnEliminarFondoTiempo.disable();
        _this.idcalendario = null;
        if (_this.smCmpFondoTiempo.hasSelection()) {
            var selected = _this.smCmpFondoTiempo.getSelections();
            if (selected.length > 0) {
                _this.btnEliminarFondoTiempo.enable();
                if (selected.length == 1) {
                    _this.idcalendario = selected[0].data.idcalendario;
                    _this.paintDates();
                    _this.pContenedorGestionDeFondo.enable();
                } else {
                    _this.idcalendario = null;
                    _this.pContenedorGestionDeFondo.disable();
                }
            } else _this.btnEliminarFondoTiempo.disable();
        } else {
            _this.pContenedorGestionDeFondo.disable();
        }
    }

    this.PostAccionesGestionar = function (mensaje, accion) {
        switch (mensaje) {
            case 0:
                _this.stCmpFondoTiempo.reload({
                    params: {
                        start: _this.start
                    }
                });
                break;
            case 1:
                if (accion == 'Adicionar') {
                    _this.PaginaActual(null);
                } else if (accion == 'Eliminar') {
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    _this.PaginaActual(null);
                } else if (accion == 'Cancelar-Cerrar') {
                    _this.UltimaPagina();
                }
                break;
        }
    };

    this.PaginaActual = function (anode) {
        _this.smCmpFondoTiempo.clearSelections();
        _this.start = (_this.ptbGPCmpFondoTiempo.getPageData().activePage - 1) * (_this.ptbGPCmpFondoTiempo.cbPageSize.getValue());
        _this.stCmpFondoTiempo.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stCmpFondoTiempo.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbGPCmpFondoTiempo.cbPageSize.getValue();
                    _this.stCmpFondoTiempo.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    this.UltimaPagina = function () {
        _this.smCmpFondoTiempo.clearSelections();
        var numentero = Math.floor(_this.stCmpFondoTiempo.getTotalCount() / _this.ptbGPCmpFondoTiempo.cbPageSize.getValue());
        _this.start = numentero * _this.ptbGPCmpFondoTiempo.cbPageSize.getValue();
        _this.stCmpFondoTiempo.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.validarHoraInicioFin = function (combo, horafin) {
        var msj = "La hora de inicio debe ser menor que la hora de fin.";
        if (horafin) {
            msj = "La hora de fin debe ser mayor que la hora de inicio.";
        }
        var vHoraFinal, vHoraInicial = false;
        if (_this.tmfhorafin.isValid()) {
            vHoraFinal = Date.parseDate(_this.tmfhorafin.getValue(), 'H:i').format("U");
        }
        if (_this.tmfhoraini.isValid()) {
            vHoraInicial = Date.parseDate(_this.tmfhoraini.getValue(), 'H:i').format("U");
        }
        if (!vHoraInicial || !vHoraFinal) {
            combo.markInvalid("Debe validar la hora de inicio y/o la hora de fin.");
            return false;
        } else {
            var nopuedeSeleccionar = (vHoraInicial > vHoraFinal);
            if (nopuedeSeleccionar) {
                combo.markInvalid(msj);
            } else {
                //combo.clearInvalid();
                _this.tmfhoraini.clearInvalid();
                _this.tmfhorafin.clearInvalid();
            }
            return !nopuedeSeleccionar;
        }
    };

    this.validarJornada = function () {
        if (_this.tmfhorafin.isValid() && _this.tmfhoraini.isValid()) {
            var vHoraFinal = _this.tmfhorafin.getValue();
            var vHoraInicial = _this.tmfhoraini.getValue();
            var horas = _this.cbHoras.getValue();
            var verificarhoras = _this.restarHoras(vHoraInicial, vHoraFinal, horas);
            if (!verificarhoras) {
                _this.cbHoras.markInvalid('La jornada laboral no puede exceder el tiempo entre la hora de inicio y la hora fin.');
            } else _this.cbHoras.clearInvalid();
            return verificarhoras;
        }
    }

    this.restarHoras = function (horaini, horafin, horasft) {
        var horaini = horaini.split(":"),
            horafin = horafin.split(":");
        var inicioMinutos = parseInt(horaini[1]);
        var inicioHoras = parseInt(horaini[0]);
        var finMinutos = parseInt(horafin[1]);
        var finHoras = parseInt(horafin[0]);
        var transcurridoMinutos = finMinutos - inicioMinutos;
        var transcurridoHoras = finHoras - inicioHoras;
        if (transcurridoMinutos < 0) {
            transcurridoHoras--;
            transcurridoMinutos = 60 + transcurridoMinutos;
        }
        var horas = transcurridoHoras.toString();
        var minutos = transcurridoMinutos.toString();
        var horasft = parseInt(horasft);
        var result = false;
        if (horas >= horasft) result = true;
        return result;
    }

    this.cargarCmpFondoTiempo = function () {
        if (_this.tipoComponente == 'panel') {
            _this.WinPrincipal.show();
        }
    };


}
;
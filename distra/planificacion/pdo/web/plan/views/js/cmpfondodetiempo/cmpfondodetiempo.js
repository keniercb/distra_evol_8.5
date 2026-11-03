Utilidades.Cmp.Cmpfondodetiempo = function () {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    this.array = [];
    var arr_dates = [];
    this.BarraProgreso = new BarraEstado();
    this.arrayidinvolucrados;

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.CrearWinFondoDeTiempo = function (arrayidinvolucrados, fechainicio, fechafin, objclasificadorinvol) {
        _this.arrayidinvolucrados = arrayidinvolucrados;
        this.fini = new Ext.form.DateField({
            fieldLabel: 'Fecha de inicio',
            id: 'finifdtiempo',
            prevTab: 'btncerrarfdtiempo',
            nextTab: 'ffinfdtiempo',
            endDateField: 'ffinfdtiempo',
            vtype: 'rangodefechas',
            format: 'd/m/Y',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            width: 100,
            allowBlank: false,
            menuListeners: {
                select: function (df, date) {
                    _this.fini.setValue(date);


                    if (_this.ffin.getValue() != "") {
                        _this.dpfondodetiempo.enable();
                        _this.dpfondodetiempo.setMinDate(date);
                        _this.dpfondodetiempo.setMaxDate(_this.ffin.getValue());
                        _this.dpfondodetiempo.show();
                        _this.obtenerRangoDeFechas(arrayidinvolucrados, _this.fini.getValue().format('d/m/Y'), _this.ffin.getValue().format('d/m/Y'));
                    }
                }
            },
            listeners: {
                change: function (el, vn, ov) {
                    if (vn == "") {
                        _this.dpfondodetiempo.disable();
                    }
                }
            }
        });

        this.ffin = new Ext.form.DateField({
            fieldLabel: 'Fecha de fin',
            id: 'ffinfdtiempo',
            prevTab: 'finifdtiempo',
            nextTab: 'btncerrarfdtiempo',
            vtype: 'rangodefechas',
            minText: 'La fecha debe ser posterior a la fecha de inicio',
            format: 'd/m/Y',
            invalidText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('fecha'),
            width: 100,
            allowBlank: false,
            menuListeners: {
                select: function (df, date) {
                    _this.ffin.setValue(date);
                    _this.fini.setMaxValue(date);
                    if (_this.fini.getValue() != "") {
                        _this.dpfondodetiempo.enable();
                        _this.dpfondodetiempo.setMinDate(_this.fini.getValue());
                        _this.dpfondodetiempo.setMaxDate(date);
                        _this.dpfondodetiempo.show();
                        _this.obtenerRangoDeFechas(arrayidinvolucrados, _this.fini.getValue().format('d/m/Y'), _this.ffin.getValue().format('d/m/Y'));
                    }
                }
            },
            listeners: {
                change: function (el, vn, ov) {
                    if (vn == "") {
                        _this.dpfondodetiempo.disable();
                    }
                }
            }
        });

        this.dpfondodetiempo = new Ext.ux.DatePickerPlus({
            id: 'dpfondodetiempo',
            hidden: false,
            noOfMonth: 3,
            disabled: true,
            format: 'd/m/Y',
            fechaInicio: fechainicio,
            fechaFin: fechafin,
            verDetalles: ObtenerDetallesDadoFecha
        });

        function ObtenerDetallesDadoFecha(fecha) {
            _this.CrearWinVerificarConflicto(_this.arrayidinvolucrados, fecha.format('d/m/Y'), null, objclasificadorinvol);
        }

        this.pfondodetiempo = new Ext.Panel({
            width: 620,
            height: 295,
            tbar: ['-', 'Fecha de inicio: ', _this.fini, '-', '->', '-', 'Fecha de fin: ', _this.ffin, '-'],
            items: [_this.dpfondodetiempo]
        });

        this.winFondoDeTiempo = new Ext.Window({
            modal: true,
            layout: 'fit',
            constrain: 'true',
            title: 'Verificar tiempo libre',
            width: 620,
            height: 295,
            resizable: false,
            listeners: {
                beforeshow: function (win) {
                }
            },
            items: [_this.pfondodetiempo],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    id: 'btncerrarfdtiempo',
                    prevTab: 'ffinfdtiempo',
                    nextTab: 'finifdtiempo',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.winFondoDeTiempo.destroy();
                    }
                }
            ]
        });
        _this.winFondoDeTiempo.show();
        _this.fini.focus(false, 1024);
    }

    this.obtenerRangoDeFechas = function (arrayidinvol, fechainicio, fechafin) {

        _this.BarraProgreso.show('Obteniendo rango de fechas');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/obtenerrangodefechas',
            params: {
                fechainicio: fechainicio,
                fechafin: fechafin,
                arrayinvolucrados: Ext.encode(arrayidinvol)
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.length > 0)
                    _this.dpfondodetiempo.setDisabledDates(responseData);
                _this.dpfondodetiempo.update(_this.fini.getValue());

            }
        });
    };

    this.CrearWinVerificarConflicto = function (arrayidinvolucrados, fechainicio, fechafin, objclasificadorinvol) {
        _this.BarraProgreso.show('Cargando datos');
        _this.arrayidinvolucrados = arrayidinvolucrados;
        var btnConflictoVisible = false;
        var btnTiempoLibreVisible = false;

        if (fechafin == null) {
            btnConflictoVisible = true;
            btnTiempoLibreVisible = false;
        } else {
            btnConflictoVisible = false;
            btnTiempoLibreVisible = true;
        }

        var arrayuserinvol = objclasificadorinvol.ObtenerInvolucrados(true);

        this.stVerificarConflicto = new Ext.data.GroupingStore({
            autoLoad: true,
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/verificarconflicto',
            listeners: {
                beforeload: function (st) {
                    st.baseParams.fechainicio = fechainicio;
                    st.baseParams.fechafin = fechafin;
                    st.baseParams.arrayinvolucrados = Ext.encode(arrayidinvolucrados);
                },
                load: function (store, record, options) {
                    _this.BarraProgreso.hide();
                    if (store.getCount() != 0) {
                        _this.winVerificarConflicto.show();
                    } else {
                        var mensaje = '';
                        if (arrayuserinvol.length == 1) {
                            mensaje = 'No existe conflicto con el involucrado seleccionado.';
                        } else
                            mensaje = 'No existen conflictos con los involucrados seleccionados.';

                        mostrarMensaje(1, mensaje);
                    }
                }
            },
            reader: new Ext.data.JsonReader({
                totalProperty: "total",
                root: "campos"
            }, [{
                name: 'car'
            }, {
                name: 'denomactividad'
            }, {
                name: 'denomuser'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'idusuario'
            }, {
                name: 'horainicio'
            }, {
                name: 'horafin'
            }]),
            sortInfo: {
                field: 'denomactividad',
                direction: "ASC"
            },
            groupField: 'denomuser'
        });

        //barra de paginado del treegrid donde se muestran las actividades
        this.ptbVerificarConflicto = new Ext.PagingToolbar({
            pageSize: 20,
            store: _this.stVerificarConflicto,
            displayInfo: true
        });

        //modo de del treegrid donde se muestran las actividades
        this.smVerificarConflicto = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, indiceFila, record) {
                    /*if (sm.getSelections().length != 0) {
                     Ext.getCmp('btnResolverConflicto').enable();
                     }*/
                }
            }
        });

        this.tgVerificarConflicto = new Ext.grid.GridPanel({
            store: _this.stVerificarConflicto,
            master_column_id: 'expandir',
            autoExpandMin: 165,
            title: '<div style=" margin-left:135px; ">' + 'Los siguientes usuarios presentan actividades planificadas en el rango de fecha selecionado: </div>',
            region: 'center',
            sm: _this.smVerificarConflicto,
            width: 715,
            loadMask: {
                msg: 'Cargando datos de usuarios'
            },
            columns: [_this.smVerificarConflicto,
                {
                    header: "Usuario",
                    dataIndex: 'denomuser',
                    width: 95,
                    sortable: true,
                    renderer: function (val) {
                        return '<b>' + val + '</b>';
                    }
                }, {
                    header: "Denominaci&oacute;n",
                    dataIndex: 'denomactividad',
                    width: 240,
                    sortable: true,
                    renderer: MostrarImagenTipoElemento
                }, {
                    header: 'CAR',
                    dataIndex: 'car',
                    width: 105,
                    renderer: function (val) {
                        return val;
                    },
                    sortable: true
                }, {
                    header: 'Fecha de Inicio',
                    dataIndex: 'fechainicio',
                    width: 100,
                    sortable: true
                }, {
                    header: 'Hora de Inicio',
                    dataIndex: 'horainicio',
                    width: 100,
                    sortable: true
                }, {
                    header: 'Fecha de Fin',
                    dataIndex: 'fechafin',
                    width: 100,
                    sortable: true
                }, {
                    header: 'Hora de Fin',
                    dataIndex: 'horafin',
                    width: 100,
                    sortable: true
                }],
            listeners: {},
            view: new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '<center>{text}</center>'
            }),
            bbar: _this.ptbVerificarConflicto
        });

        function MostrarImagenTipoElemento(valor, m, p) {
            m.attr = 'ext:qtip="<b>' + valor + '</b>"';
            return '<span><img src="../../../comun/recursos/images/fam/act_ejec.png" >' + ' ' + valor + '</span>';
        }

        function replaceAll(text, busca, reemplaza) {
            while (text.toString().indexOf(busca) != -1)
                text = text.toString().replace(busca, reemplaza);
            return text;
        }

        this.tbarVerificarConflicto = new Ext.Toolbar({
            height: 30,
            items: ['<div style=" margin-left:135px; font-size:13px;">' + '<b> Los siguientes usuarios presentan actividades planificadas en el rango de fecha selecionado: </b></div>']
        });

        this.winVerificarConflicto = new Ext.Window({
            modal: true,
            layout: 'fit',
            constrain: 'true',
            title: 'Verificar conflicto',
            width: 890,
            height: 400,
            resizable: true,
            items: [_this.tgVerificarConflicto],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Ignorar',
                    tooltip: 'Ignorar conflicto',
                    hidden: btnConflictoVisible,
                    handler: function () {
                        _this.winVerificarConflicto.destroy();
                    }
                }, {
                    id: 'btnResolverConflicto',
                    iconCls: 'aceptar',
                    text: 'Resolver conflicto',
                    tooltip: 'Resolver conflicto de involucrados seleccionados',
                    disabled: false,
                    hidden: btnConflictoVisible,
                    handler: function () {
                        _this.resolverConflicto(_this.smVerificarConflicto.getSelections(), _this.stVerificarConflicto, objclasificadorinvol, _this.winVerificarConflicto)
                    }
                }, {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    hidden: btnTiempoLibreVisible,
                    handler: function () {
                        _this.winVerificarConflicto.destroy();
                    }
                }
            ]
        });
    };

    this.resolverConflicto = function (sm, store, objclasificadorinvol, winVerificarConflicto) {
        var arrayidinvol = [];

        if (sm.length != 0) {
            arrayidinvol.push(sm[0].data.idusuario);
            for (var i = 0; i < sm.length; i++) {
                if (i != 0 && sm[i].data.idusuario != sm[i - 1].data.idusuario)
                    arrayidinvol.push(sm[i].data.idusuario);
            }
        } else {
            var arrayidinvoltienenconflictos = store.getRange();
            arrayidinvol.push(arrayidinvoltienenconflictos[0].data.idusuario)
            for (var i = 0; i < arrayidinvoltienenconflictos.length; i++) {
                if (i != 0 && arrayidinvoltienenconflictos[i].data.idusuario != arrayidinvoltienenconflictos[i - 1].data.idusuario)
                    arrayidinvol.push(arrayidinvoltienenconflictos[i].data.idusuario)
            }
        }
        objclasificadorinvol.resolverConflicto(arrayidinvol);
        winVerificarConflicto.destroy();
    }

    this.crearWinModificarFechaActividad = function (parametros) {
        var fecha = new Date().format('d/m/Y');
        var arrFecha = fecha.split('/');
        var anno = arrFecha[2];
        var fechaSeleccionada = null;
        this.dpfondodetiempo = new Ext.ux.DatePickerPlus({
            id: 'dpfondodetiempo',
            hidden: false,
            startDay: 0,
            value: new Date(arrFecha[2], 0, 1),
            noOfMonth: 12,
            noOfMonthPerRow: 4,
            disabled: false,
            format: 'd/m/Y',
            renderPrevNextButtons: false,
            renderPrevNextYearButtons: true,
            renderOkUndoButtons: false,
            showWeekNumber: false,
            showActiveDate: true,
            summarizeHeader: true,
            weekendText: 'Fin de semana',
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
                        Ext.getCmp('btnAceptarWinFondoDeTiempo').enable();
                    } else {
                        Ext.getCmp('btnAceptarWinFondoDeTiempo').disable();
                    }
                    setTimeout(function () {
                        Ext.getCmp('btnCerrarWinFondoDeTiempo').focus(true, 700);
                    }, 500);
                },
            }
        });

        this.pfondodetiempo = new Ext.Panel({
            width: 710,
            height: 545,
            items: [_this.dpfondodetiempo]
        });

        this.winFondoDeTiempo = new Ext.Window({
            modal: true,
            layout: 'fit',
            constrain: 'true',
            title: '',
            resizable: false,
            listeners: {
                beforeshow: function (win) {
                },
                destroy: function (win) {
                    fechaSeleccionada = null;
                }
            },
            items: [_this.pfondodetiempo],
            buttons: [
                {
                    iconCls: 'cerrar ',
                    text: 'Cerrar ',
                    id: 'btnCerrarWinFondoDeTiempo',
                    prevTab: 'btnAceptarWinFondoDeTiempo',
                    nextTab: 'btnAceptarWinFondoDeTiempo',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.winFondoDeTiempo.destroy();
                    }
                }, {
                    iconCls: 'aceptar ',
                    text: 'Aceptar ',
                    id: 'btnAceptarWinFondoDeTiempo',
                    prevTab: 'btnCerrarWinFondoDeTiempo',
                    nextTab: 'btnCerrarWinFondoDeTiempo',
                    tooltip: 'Guardar datos y cerrar ventana',
                    disabled: true,
                    handler: function () {
                        _this.dpfondodetiempo.copyPreToSelectedDays();
                        var selectedDates = _this.dpfondodetiempo.selectedDates.sortDates();
                        var allStringDates = [];
                        if (Ext.isDate(selectedDates)) {
                            allStringDates.push(date.format('d/m/Y'));
                        } else {
                            Ext.each(selectedDates, function (c) {
                                allStringDates.push(c.format('d/m/Y'));
                            }, this);
                        }
                        fechaSeleccionada = allStringDates;
                        if (fechaSeleccionada == null || fechaSeleccionada == '') {
                            mostrarMensaje(1, 'Debe seleccionar una fecha.');
                        } else {
                            parametros.fechaSeleccionada = fechaSeleccionada;
                            _this.winFondoDeTiempo.destroy();
                            _this.modificarFechaActividad(parametros);
                        }
                    }
                }
            ]
        });
        _this.winFondoDeTiempo.on('beforeshow', function () {
            setTimeout(function () {
                Ext.getCmp('btnCerrarWinFondoDeTiempo').focus(true, 700);
            }, 500);

        });
        _this.winFondoDeTiempo.show();
    }

    this.modificarFechaActividad = function (parametros) {
        var msj = 'Modificando fecha de inicio de la actividad';
        this.BarraProgreso.show(msj);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/modificarFechaActividad',
            params: {
                idactividad: parametros.idactividad,
                fecha: parametros.fechaSeleccionada
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.mensaje == 1) {
                    msj = 'La actividad ha sido modificada satisfactoriamente.';
                    mostrarMensaje(1, msj);
                }
                if (responseData.mensaje == 0) {
                    msj = 'Ha ocurrido un error al modificar la actividad.';
                    mostrarMensaje(1, msj);
                }
                if (responseData.mensaje == 2) {
                    msj = 'Debe seleccionar una actividad.';
                    mostrarMensaje(1, msj);
                }
                parametros.st.reload();
                parametros.sm.clearSelections();
            }
        });
    }

}

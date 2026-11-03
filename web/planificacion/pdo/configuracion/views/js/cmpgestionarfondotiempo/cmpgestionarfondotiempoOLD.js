Utilidades.Cmp.Cmpgestionarfondotiempo = function (opcionesConfig) {

    Ext.QuickTips.init();
    Ext.Ajax.timeout = 1000000000;

    var _this = this;
    this.idcomponente = opcionesConfig.idcomponente;
    this.fecha = new Date().format('d/m/Y');
    this.arrFecha = _this.fecha.split('/');
    this.anno = _this.arrFecha[2];
    this.identidadselected = null;
    this.tieneValoresCal = false;

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

    this.btnEliminarConf = new Ext.Button({
        id: 'btnEliminarConf',
        //text: 'Eliminar configuraci&oacute;n',
        tooltip: 'Eliminar configuraci&oacute;n de la entidad',
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
        tooltip: 'Delegar configuraci&oacute;n a la(s) entidad(es) hija(s) <b>(Ctrl+Alt+D)</b>',
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
                    idEntidadCompartir: _this.identidadselected,
                    anno: _this.anno
                });
                _this.objCrudFondoTiempo.CrearWinCrudFondoTiempo(parametros);
            }
        }
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaDiasNoLab',
        //text: 'Ayuda',
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
            },
            'afteryearchange': function (datepicker, oldyear, newyear) {
                _this.anno = newyear;
                _this.cbTipoDia.validate();
                _this.paintDates();
            }
        },
        eventDates: function (year) {
            var dates = [];
            return dates;
        }
    });

    this.panelDatePicker = new Ext.Panel({
        id: 'panelDatePicker',
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
        fields: ['idtipodia', 'denominacion', 'color'],
        listeners: {
            beforeload: function (st) {

            },
            load: function (store, record, options) {
                var table = leyenda();
                var Leyend = new Ext.Panel({
                    id: 'Leyend',
                    bodyBorder: true,
                    border: true,
                    frame: true,
                    layout: 'fit',
                    html: table,
                    autoScroll: true,
                });
                if (_this.panelLeyenda.findById('Leyend') == null) {
                    _this.panelLeyenda.add(Leyend);
                    _this.panelLeyenda.doLayout();
                } else {
                    _this.panelLeyenda.remove('Leyend');
                    _this.panelLeyenda.add(Leyend);
                    _this.panelLeyenda.doLayout();
                }
            }
        },
    });

    this.cbTipoDia = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de d&iacute;as',
        store: _this.storeTipodia,
        hiddenName: 'idtipodia',
        valueField: 'idtipodia',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
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
            }
        }
    });

    this.stHoras = new Ext.data.SimpleStore({
        fields: ['hora'],
        data: [['01'], ['02'], ['03'], ['04'], ['05'], ['06'], ['07'], ['08'], ['09'], ['10'],
            ['11'], ['12'], ['13'], ['14'], ['15'], ['16'], ['17'], ['18'], ['19'], ['20'],
            ['21'], ['22'], ['23'], ['24']]
    });

    this.cbHoras = new Ext.form.ComboBox({
        id: 'cbHoras',
        editable: false,
        fieldLabel: 'Horas',
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
        anchor: '75%',
        store: _this.stHoras,
        emptyText: 'Seleccione'
    });

    this.formularioGuardar = new Ext.FormPanel({
        id: 'formularioGuardar',
        labelAlign: 'top',
        frame: true,
        width: '100%',
        height: 100,
        region: 'south',
        buttons: [_this.btnGuardar, _this.btnEliminar],
        items: [
            {
                layout: 'column',
                width: '70%',
                items: [{
                    columnWidth: .3,
                    layout: 'form',
                    items: [_this.cbTipoDia]
                }, {
                    columnWidth: .3,
                    layout: 'form',
                    items: [_this.cbHoras]
                }
                ]
            }
        ],
        listeners: {
            'clientvalidation': function (fm, valid) {
                if (_this.datePicker.selectedDates.length > 0) {
                    if (valid && _this.identidadselected != null) {
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
    })
    ;

    this.loaderTreeBaseEstructura = new Ext.tree.TreeLoader({
        dataUrl: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/cargarEntidades',
        listeners: {
            beforeload: function (tl, n) {
                this.baseParams = {
                    idEstructuraPadre: n.attributes.idEstructuraPadre

                };
            }
        }
    });

    this.tpBaseEstructura = new Ext.tree.TreePanel({
        autoScroll: true,
        layout: 'fit',
        border: false,
        id: 'tpestructura',
        tbar: [
            {
                iconCls: 'expandir',
                tooltip: 'Expandir todas las entidades',
                handler: function () {
                    _this.tpBaseEstructura.root.expand(true);
                }
            },
            {
                iconCls: 'contraer',
                tooltip: 'Contraer todas las entidades',
                handler: function () {
                    _this.tpBaseEstructura.root.collapse(true);
                }
            },
            {
                iconCls: 'actualizar',
                tooltip: 'Refrescar todas las entidades',
                handler: function () {
                    _this.tpBaseEstructura.root.reload(true);
                    _this.tpBaseEstructura.getSelectionModel().select(_this.tpBaseEstructura.root);
                    _this.identidadselected = 0;
                    _this.actualizarBarraHerramientas();
                }
            },
            '-',
            {
                xtype: 'textfield',
                emptyText: 'Buscar entidad',
                width: 150,
                id: 'idfiltroent',
                regex: _this.ObjValidaciones.expresionRegular('denominacion'),
                maskRe: /^([a-zA-Z0-9��������������"' ,./()_-])$/,
                regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
                vtype: 'validarEspaciosEnBlanco',
                listeners: {
                    specialkey: function (t, e) {
                        if (e.getKey() == '13') {
                            _this.buscarNodo(_this.tpBaseEstructura);
                            _this.actualizarArbol(_this.tpBaseEstructura);

                        }
                    }
                }
            }
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
        id: 'panelEstructuras',
        width: 450,
        heigth: 450,
        autoScroll: true,
        bodyBorder: true,
        border: true,
        split: true,
        region: 'center',
        items: [_this.tpBaseEstructura]
    });

    this.panelLeyenda = new Ext.Panel({
        id: 'panelLeyenda',
        width: '100%',
        heigth: 80,
        autoScroll: true,
        bodyBorder: true,
        border: true,
        split: true,
        region: 'center',
        layout: 'fit',
    });

    this.vp = new Ext.Viewport({
        layout: 'fit',
        items: [
            {
                layout: 'border',
                margins: '0 0 0 0',
                tbar: [_this.btnDelegarConf, _this.btnCompartirConf, _this.btnEliminarConf, '->', _this.btnAyuda],
                items: [
                    {
                        region: 'center',
                        layout: 'fit',
                        width: '40%',
                        margins: '0 0 0 0',
                        items: [_this.panelEstructuras]
                    }, {
                        region: 'east',
                        margins: '0 0 0 0',
                        layout: 'border',
                        width: 750,
                        disabled: true,
                        id: 'vpEast',
                        items: [
                            {
                                region: 'center',
                                layout: 'border',
                                height: 610,
                                width: 720,
                                margins: '0 0 0 0',
                                items: [_this.panelDatePicker, _this.formularioGuardar]
                            }, {
                                region: 'south',
                                margins: '0 0 0 0',
                                border: false,
                                collapseMode: 'mini',
                                collapsible: true,
                                collapsed: false,
                                layout: 'fit',
                                split: true,
                                width: '100%',
                                height: 95,
                                items: [_this.panelLeyenda]
                            }]
                    }
                ]
            }
        ],
        listeners: {
            'render': function (c) {

            }
        }
    })
    ;

    this.WinPrincipal = new Ext.Window({
        layout: 'fit',
        closable: false,
        draggable: false,
        constrain: true,
        maximized: true,
        modal: true,
        width: 1000,
        height: 510,
        items: [_this.vp],
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
                idestructura: _this.identidadselected,
                anno: _this.anno
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                if (responseData.cantidad > 0) {
                    var arrDates = [];
                    var cont = 0;
                    Ext.each(responseData.datos, function (date) {
                        var fechas = date.fecha.split(',');
                        // function getContrastYIQ(hexcolor){
                        var r = parseInt(date.color.substr(0, 2), 16);
                        var g = parseInt(date.color.substr(2, 2), 16);
                        var b = parseInt(date.color.substr(4, 2), 16);
                        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                        var texto = (yiq >= 128) ? '#000000' : '#ffffff';
                        var txt = '';
                        if (date.horas > 0)
                            txt = date.dentipodia + ' (' + date.horas + ' hora(s))';
                        else
                            txt = date.dentipodia;

                        var cant = fechas.length;
                        for (var i = 0; i < cant; i++) {
                            var fecha = fechas[i].split('/');
                            var style = document.createElement('style');
                            style.type = 'text/css';
                            //style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; background-color:' + date.color + ' !important;}';
                            style.innerHTML = '.tipodia' + cont + ' {color:#ee0000 ; border: 1px solid #' + date.color + ' !important;}';
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
                    _this.btnEliminarConf.setDisabled(false);
                    _this.btnCompartirConf.setDisabled(false);
                    _this.btnEliminar.setDisabled(false);
                    var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
                    (isEntidadHija) ? _this.btnDelegarConf.setDisabled(true) : _this.btnDelegarConf.setDisabled(false);
                    _this.barraProgreso.hide();
                } else {
                    _this.tieneValoresCal = false;
                    _this.datePicker.setEventDates([]);
                    _this.cbTipoDia.validate();
                    _this.btnEliminarConf.setDisabled(true);
                    _this.btnCompartirConf.setDisabled(true);
                    _this.btnEliminar.setDisabled(true);
                    _this.btnDelegarConf.setDisabled(true);
                    _this.barraProgreso.hide();
                    //mostrarMensaje(1, 'No se ha configurado ning&uacute;n d&iacute;a para la entidad seleccionada.');
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
            mostrarMensaje(2, '&iquest;Est&aacute; seguro de que desea eliminar la configuraci&oacute;n del(de los) d&iacute;a(s) seleccionado(s)?', function (btn) {
                if (btn == 'ok') {
                    _this.delDays(allStringDates);
                }
            })
        }

    };

//Funcion para adicionar los tipos de dias de una entidad
    this.addDays = function (dates) {
        if (dates.length > 0 && _this.formularioGuardar.getForm().isValid()) {
            _this.barraProgreso.show('Guardando datos.');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/addDias',
                method: 'POST',
                params: {
                    idestructura: _this.identidadselected,
                    horas: _this.cbHoras.getValue(),
                    idtipodia: _this.cbTipoDia.getValue(),
                    fechas: Ext.encode(dates),
                    anno: _this.anno
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

//Funcion para eliminar los dias seleccionados de una entidad
    this.delDays = function (dates) {
        if (dates.length > 0) {
            _this.barraProgreso.show('Eliminando datos.');
            Ext.Ajax.request({
                url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delDias',
                method: 'POST',
                params: {
                    seleccion: Ext.encode(dates),
                    idestructura: _this.identidadselected,
                    anno: _this.anno
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
        mostrarMensaje(2, '&iquest;Est&aacute; seguro de que desea eliminar toda la configuraci&oacute;n para la entidad seleccionada?', function (btn) {
            if (btn == 'ok') {
                _this.barraProgreso.show('Eliminando datos.');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delConfiguracion',
                    method: 'POST',
                    params: {
                        idestructura: _this.identidadselected,
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
        mostrarMensaje(2, '&iquest;Est&aacute; seguro de que desea delegar toda la configuraci&oacute;n de la entidad seleccionada a su(s) entidad(es) hija(s)?', function (btn) {
            if (btn == 'ok') {
                var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
                if (_this.identidadselected != null && _this.identidadselected != 0 && !isEntidadHija) {
                    _this.barraProgreso.show('Guardando datos.');
                    Ext.Ajax.request({
                        url: '/planificacion/pdo/configuracion/index.php/cmpgestionarfondotiempo/delegarConfiguracion',
                        method: 'POST',
                        params: {
                            idestructura: _this.identidadselected,
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
                    case 71:
                    { //tecla "G" para guardar
                        if (!_this.btnGuardar.disabled) {
                            _this.getDates('ADD');
                        }
                        break;
                    }
                }
            }
        }, {
            key: 46,//tecla "DEL" para eliminar
            fn: function () {
                if (!_this.btnEliminar.disabled) {
                    _this.getDates();
                }
            }
        }, {
            key: 'c',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 67:
                    { //tecla "C" para copiar/compartir
                        if (!_this.btnCompartirConf.disabled) {
                            var parametros = ({
                                idEntidadCompartir: _this.identidadselected,
                                anno: _this.anno
                            });
                            _this.objCrudFondoTiempo.CrearWinCrudFondoTiempo(parametros);
                        }
                        break;
                    }
                }
            }
        }, {
            key: 'd',
            ctrl:true,
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 68:
                    { //tecla "D" para delegar
                        if (!_this.btnDelegarConf.disabled) {
                            _this.delegarConf();
                        }
                        break;
                    }
                }
            }
        }]);

    this.actualizarBarraHerramientas = function () {
        if (_this.identidadselected != null && _this.identidadselected != 0) {
            _this.paintDates();
            Ext.getCmp('vpEast').setDisabled(false);
            _this.cbHoras.validate();
            _this.cbTipoDia.validate();
            _this.btnEliminarConf.setDisabled(false);
            _this.btnCompartirConf.setDisabled(false);

            var isEntidadHija = _this.tpBaseEstructura.getSelectionModel().getSelectedNode().leaf;
            (isEntidadHija) ? _this.btnDelegarConf.setDisabled(true) : _this.btnDelegarConf.setDisabled(false);
        } else {
            Ext.getCmp('vpEast').setDisabled(true);
            _this.btnEliminarConf.setDisabled(true);
            _this.btnDelegarConf.setDisabled(true);
            _this.btnCompartirConf.setDisabled(true);
        }
    };

    this.cargarCmpFondoTiempo = function () {
        if (opcionesConfig.tipoComponente == 'panel') {
            _this.WinPrincipal.show();
        }
    };


}
;
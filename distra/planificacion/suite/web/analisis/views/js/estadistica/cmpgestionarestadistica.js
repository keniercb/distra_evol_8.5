Utilidades.Cmp.Cmpgestionarestadistica = function () {
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.BarraProgreso = new BarraEstado();

    //objeto del componente "Gestionar Estructura"
    this.objestructura = new Utilidades.Cmp.estructura();

    Ext.ns('Ext.ux.layout');
    Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
        monitorResize: true,
        isValidParent: function (c, target) {
            return c.getEl().dom.parentNode == this.innerCt.dom;
        },
        onLayout: function (ct, target) {
            var rs = ct.items.items, len = rs.length, r, i;
            if (!this.innerCt) {
                target.addClass('ux-row-layout-ct');
                this.innerCt = target.createChild({cls: 'x-row-inner'});
            }
            this.renderAll(ct, this.innerCt);
            var size = target.getViewSize();
            if (size.width < 1 && size.height < 1) { // display none?
                return;
            }
            var h = size.height - target.getPadding('tb'),
                ph = h;
            this.innerCt.setSize({height: h});
            // some rows can be percentages while others are fixed
            // so we need to make 2 passes
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (!r.rowHeight) {
                    ph -= (r.getSize().height + r.getEl().getMargins('tb'));
                }
            }
            ph = ph < 0 ? 0 : ph;
            for (i = 0; i < len; i++) {
                r = rs[i];
                if (r.rowHeight) {
                    r.setSize({height: Math.floor(r.rowHeight * ph) - r.getEl().getMargins('tb')});
                }
            }
        }
    });
    Ext.Container.LAYOUTS['ux.row'] = Ext.ux.layout.RowLayout;
    Ext.QuickTips.init();

    this.fechaInicio = new Ext.form.DateField({
        fieldLabel: 'Fecha de inicio',
        format: 'd/m/Y',
        name: 'fechaini',
        id: 'fechaini',
        emptyText: 'Seleccione',
        endDateField: 'fechafin',
        allowBlank: true,
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                _this.fechaInicio.setValue(date);
                if (_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if (_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if (_this.cbHitos.getValue() == '') {
                    idcb = _this.cbPlanes.getValue();
                } else {
                    idcb = _this.cbHitos.getValue();
                }
                if (_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                } else if (_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                } else if (_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                } else if (_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                }
            }
        }
    });
    this.fechaFin = new Ext.form.DateField({
        fieldLabel: 'Fecha de fin',
        disabled: false,
        format: 'd/m/Y',
        name: 'fechafin',
        id: 'fechafin',
        emptyText: 'Seleccione',
        vtype: 'daterange',
        anchor: '90%',
        width: 100,
        menuListeners: {
            select: function (df, date) {
                _this.fechaFin.setValue(date);
                if (_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if (_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if (_this.cbHitos.getValue() == '') {
                    idcb = _this.cbPlanes.getValue();
                } else {
                    idcb = _this.cbHitos.getValue();
                }
                if (_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                }
            }
        }
    });

    this.btnLimpiar = new Ext.Button({
        iconCls: 'limpiar',
        disabled: false,
        handler: function () {
            _this.cbPlanes.reset();
            _this.cbHitos.reset();
            _this.fechaInicio.reset();
            _this.fechaFin.reset();
            if (_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                _this.cargarCalidad(null, null, null, _this.objestructura.idEstructura);
            } else if (_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                _this.cargarTiepoPlanificado(null, null, null, _this.objestructura.idEstructura);
            } else if (_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                _this.cargarGraficasAct(null, null, null, _this.objestructura.idEstructura);
            } else if (_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                _this.cargarTipoActividades(null, null, null, _this.objestructura.idEstructura);
            }
        },
        tooltip: 'Limpiar filtros',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaEstadistica',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: false,
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });

    this.stcbcbPlanes = new Ext.data.Store({
        autoLoad: true,
        url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarComboProyectos',
        reader: new Ext.data.JsonReader({
            id: 'idproyecto',
            root: "data"
        }, [{
            name: 'idproyecto'
        }, {
            name: 'denominacion'
        }])
    });
    this.cbPlanes = new Ext.form.ComboBox({
        store: _this.stcbcbPlanes,
        displayField: 'denominacion',
        valueField: 'idproyecto',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            expand: function (combo) {
                _this.stcbcbPlanes.reload({
                    params: {
                        idEstructura: _this.objestructura.idEstructura
                    }
                });
            },
            select: function (cb, record, index) {
                if (_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if (_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if (_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                }
            }
        }
    });
    //****Hitos****
    this.stcbHitos = new Ext.data.Store({
        autoLoad: true,
        url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarComboHitos',
        reader: new Ext.data.JsonReader({
            id: 'idhito',
            root: "data"
        }, [{
            name: 'idhito'
        }, {
            name: 'denominacion'
        }])
    });
    this.cbHitos = new Ext.form.ComboBox({
        store: _this.stcbHitos,
        displayField: 'denominacion',
        valueField: 'idhito',
        mode: 'local',
        triggerAction: 'all',
        selectOnFocus: true,
        width: 100,
        emptyText: 'Seleccione',
        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        listeners: {
            expand: function (combo) {
                _this.stcbHitos.reload({
                    params: {
                        idEstructura: _this.objestructura.idEstructura,
                        idproy: _this.cbPlanes.getValue()
                    }
                });
            },
            select: function (cb, record, index) {
                if (_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if (_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if (_this.tpGraficas.getActiveTab().id == 'panelCalidad') {
                    _this.cargarCalidad(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelTiempoP') {
                    _this.cargarTiepoPlanificado(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'panelContenedor') {
                    _this.cargarGraficasAct(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);

                } else if (_this.tpGraficas.getActiveTab().id == 'tipoActividad') {
                    _this.cargarTipoActividades(cb.value, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                }
            }
        }
    });


    //*******calidad de la planificacion ********
    this.panelCantidadCalidad = new Ext.Panel({
        id: 'panelCantidadCalidad',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerCantidadCalidad" ></div>'
    });
    this.panelPorcientoCalidad = new Ext.Panel({
        id: 'panelPorcientoCalidad',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPorcientoCalidad' ></div>"
    });
    this.panelTrimestreCalidad = new Ext.Panel({
        id: 'panelTrimestreCalidad',
        layout: 'fit',
        region: 'center',
        border: false,
        html: "<div id = 'containerTrimestreCalidad' ></div>"
    });
    this.panelUp = new Ext.Panel({
        id: 'panelUp',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelCantidadCalidad, _this.panelPorcientoCalidad]
    });
    this.panelDown = new Ext.Panel({
        id: 'panelDown',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelTrimestreCalidad]
    });
    this.panelCalidad = new Ext.Panel({
        id: 'panelCalidad',
        title: 'Calidad de la planificaci\xf3n',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelUp]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelDown]
        }]
    });

    //*******Tiempo planificado ********
    this.panelTiepoPlanificado = new Ext.Panel({
        id: 'panelTiepoPlanificado',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerTiempoPlan" ></div>'
    });
    this.panelVistaEjecucion = new Ext.Panel({
        id: 'panelVistaEjecucion',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerVistaEje' ></div>"
    });
    this.panelEvolMes = new Ext.Panel({
        id: 'panelEvolMes',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerEvolucionMes' ></div>"
    });
    this.panelEvolTri = new Ext.Panel({
        id: 'panelEvolTri',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerEvolucionTri' ></div>"
    });
    this.panelAlto = new Ext.Panel({
        id: 'panelAlto',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelTiepoPlanificado, _this.panelVistaEjecucion]
    });
    this.panelBajo = new Ext.Panel({
        id: 'panelBajo',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelEvolMes, _this.panelEvolTri]
    });
    this.panelTiempoP = new Ext.Panel({
        id: 'panelTiempoP',
        title: 'Tiempo planificado',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelAlto]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelBajo]
        }]
    });

    //******* Cumplimiento de actividad ********
    this.panelDisciplina = new Ext.Panel({
        id: 'containerDisciplina',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: '<div id = "containerDisciplina" ></div>'
    });
    this.panelValorizacion = new Ext.Panel({
        id: 'containerValorizacion',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerValorizacion' ></div>"
    });
    this.panelBalance = new Ext.Panel({
        id: 'containerBalance',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerBalance' ></div>"
    });
    this.panelPesoBalance = new Ext.Panel({
        id: 'containerPesoBalance',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPesoBalance' ></div>"
    });
    this.panelNorte = new Ext.Panel({
        id: 'panelNorte',
        layout: 'border',
        region: 'center',
        border: false,
        width: '100%',
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelDisciplina, _this.panelValorizacion]
    });
    this.panelSur = new Ext.Panel({
        id: 'panelSur',
        layout: 'border',
        region: '.67+',
        border: false,
        height: '50%',
        bodyStyle: 'background: white',
        items: [_this.panelBalance, _this.panelPesoBalance]
    });
    this.panelContenedor = new Ext.Panel({
        id: 'panelContenedor',
        title: 'Cumplimiento de tareas',
        border: false,
        height: '100%',
        layout: 'ux.row',
        items: [{
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelNorte]
        }, {
            rowHeight: .50,
            width: '100%',
            border: false,
            layout: 'fit',
            items: [_this.panelSur]
        }]
    });

    // ****** Tipo de catividad  ********
    this.panelTipoAct = new Ext.Panel({
        id: 'containerTipoAct',
        layout: 'fit',
        region: 'west',
        width: '50%',
        border: false,
        html: "<div id = 'containerTipoAct' ></div>"
    });
    this.panelPesoAct = new Ext.Panel({
        id: 'containerPesoAct',
        layout: 'fit',
        region: 'center',
        width: '50%',
        border: false,
        html: "<div id = 'containerPesoAct' ></div>"
    });
    this.tipoActividad = new Ext.Panel({
        id: 'tipoActividad',
        title: 'Tipos de tareas',
        layout: 'border',
        region: 'center',
        border: false,
        bodyStyle: 'background: white',
        items: [_this.panelTipoAct, _this.panelPesoAct]
    });

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpGraficas = function () {
        _this.WinPrincipal.show();
    };
    this.cargarGraficasAct = function (idproy, fechaI, fechaF, idEstructura) {
        if (idEstructura != '' && idEstructura != null && idEstructura != 'nodo2') {
            _this.BarraProgreso.show('Cargando diagrama');
            _this.cargarDisciplina(idproy, fechaI, fechaF, idEstructura);
            _this.cargarValorizacion(idproy, fechaI, fechaF, idEstructura);
            _this.cargarBalance(idproy, fechaI, fechaF, idEstructura);
            _this.cargarPesoBalance(idproy, fechaI, fechaF, idEstructura);
        }
    };

    this.cargarTiepoPlanificado = function (idproy, fechaI, fechaF, idEstructura) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarTiempoPlan(idproy, fechaI, fechaF, idEstructura);
        _this.cargarVistaEje(idproy, fechaI, fechaF, idEstructura);
        _this.cargarEvolucionMes(idproy, fechaI, fechaF, idEstructura);
        _this.cargarEvolucionTri(idproy, fechaI, fechaF, idEstructura);
    };

    this.cargarCalidad = function (idproy, fechaI, fechaF, idEstructura) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarCantidadCalidad(idproy, fechaI, fechaF, idEstructura);
        _this.cargarPorcientoCalidad(idproy, fechaI, fechaF, idEstructura);
        _this.cargarTrimestreCalidad(idproy, fechaI, fechaF, idEstructura);
    };

    this.cargarTipoActividades = function (idproy, fechaI, fechaF, idEstructura) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarPesoAct(idproy, fechaI, fechaF, idEstructura);
        _this.cargarTipoAct(idproy, fechaI, fechaF, idEstructura);
    };

    this.cargarDesviaciones = function (idproy, fechaI, fechaF, idEstructura) {
        _this.BarraProgreso.show('Cargando diagrama');
        _this.cargarDesvTotal(idproy, fechaI, fechaF, idEstructura);
        _this.cargarDesvCant(idproy, fechaI, fechaF, idEstructura);
    };

    //************* Cumplimiento de actividades ******************
    this.cargarDisciplina = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarDisciplina',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                peso: 0
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerDisciplina').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelDisciplina.getInnerHeight()
                        },
                        title: {
                            text: 'Disciplina en el cumplimiento'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> tarea(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarValorizacion = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarDisciplina',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                peso: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerValorizacion').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelValorizacion.getInnerHeight()
                        },
                        title: {
                            text: 'Valorizaci\xf3n del cumplimiento'
                        },
                        plotOptions: {
                            pie: {
                                innerSize: 200,
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarBalance = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarBalance',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                peso: 0,
                idEstructura: idEstructura
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerBalance').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelBalance.getInnerHeight()
                        },
                        title: {
                            text: 'Balance de tareas activas'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"> {point.text}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.y}</b> tarea(s)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarPesoBalance = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarBalance',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                peso: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerPesoBalance').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelPesoBalance.getInnerHeight()
                        },
                        title: {
                            text: 'Peso del balance de tareas activas'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"> {point.text}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.y}</span><br/>'

                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    //************* Tipos de actividad ******************
    this.cargarPesoAct = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarTipoAct',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                tiponom: 17,
                peso: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerPesoAct').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelPesoAct.getInnerHeight()
                        },
                        title: {
                            text: 'Valor (peso) del tiempo invertido'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.act}</b> tarea(s)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarTipoAct = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarTipoAct',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                tiponom: 17,
                peso: 0
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerTipoAct').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelTipoAct.getInnerHeight()
                        },
                        title: {
                            text: 'Tiempo total invertido por tipo de tarea (hora(s))'
                        },
                        xAxis: {
                            type: 'category'
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y:.2f}'
                                },
                                shadow: true
                            },
                            column: {
                                pointPadding: 0.2
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.y:.2f}</b> hora(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.act}</b> tarea(s)</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    //************* Tiempo planificado ******************
    this.cargarTiempoPlan = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarTiempoPlan',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                idEstructura: idEstructura,
                fechafin: fechaF,
                cumplimiento: 0
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerTiempoPlan').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelTiepoPlanificado.getInnerHeight()
                        },
                        title: {
                            text: 'Tiempo planificado vs tiempo disponible'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.cant} hora(s)'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> hora(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };
    this.cargarVistaEje = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarEjecucion',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                ejecucion: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerVistaEje').highcharts({
                        chart: {
                            type: 'column',
                            zoomType: 'xy',
                            height: _this.panelVistaEjecucion.getInnerHeight()
                        },
                        title: {
                            text: 'Vista detalle de ejecuci\xf3n: total / mes / semana'
                        },
                        xAxis: {
                            categories: ['Total de actividades', 'Este mes', 'Esta semana']
                        },
                        yAxis: {
                            title: {
                                text: ''
                            }
                        },
                        plotOptions: {
                            column: {
                                pointPadding: 0.2
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y}'
                                },
                                shadow: true
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    this.cargarEvolucionMes = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarEjecucion',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                idEstructura: idEstructura,
                fechafin: fechaF
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerEvolucionMes').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: _this.panelEvolMes.getInnerHeight()
                        },
                        title: {
                            text: 'Evoluci\xf3n del cumplimiento de las tareas por meses'
                        },
                        xAxis: {
                            categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
                                'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };
    this.cargarEvolucionTri = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarEjecucion',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                idEstructura: idEstructura,
                fechafin: fechaF,
                trimestre: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerEvolucionTri').highcharts({
                        chart: {
                            zoomType: 'xy',
                            height: _this.panelEvolTri.getInnerHeight()
                        },
                        title: {
                            text: 'Evoluci\xf3n del cumplimiento de las tareas por trimestres'
                        },
                        xAxis: {
                            categories: ['Ene-Mar', 'Abr-Jun', 'Jul-Sep', 'Oct-Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    //************* Calidad de la planificacion ******************
    this.cargarCantidadCalidad = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarCalidad',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                fechafin: fechaF,
                idEstructura: idEstructura,
                tiponom: 18,
                peso: 0
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                _this.BarraProgreso.hide();
                $(function () {
                    $('#containerCantidadCalidad').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelCantidadCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de tareas por criterio de evaluaci\xf3n'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> {point.cant}</b> tarea(s)</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            colorByPoint: true,
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    this.cargarPorcientoCalidad = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarCalidad',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                idEstructura: idEstructura,
                fechafin: fechaF,
                tiponom: 18,
                peso: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);
                $(function () {
                    $('#containerPorcientoCalidad').highcharts({
                        chart: {
                            type: 'pie',
                            zoomType: 'xy',
                            height: _this.panelPorcientoCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Peso de las tareas por criterio de evaluaci\xf3n'
                        },
                        plotOptions: {
                            pie: {
                                innerSize: 200,
                                allowPointSelect: true
                            },
                            series: {
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.name}: {point.y:.1f} %'
                                },
                                shadow: true
                            }
                        },
                        tooltip: {
                            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                            '<span style="font-size: 12px"><b> Peso:</b> {point.cant}</span><br/>' +
                            '<span style="color:{point.color}">\u25CF</span> ' +
                            '<span style="font-size: 12px"><b> {point.y:.2f} %</b> del total</span><br/>'
                        },
                        series: [{
                            data: respuesta.data
                        }]
                    });
                });
            }
        });
    };

    this.cargarTrimestreCalidad = function (idproy, fechaI, fechaF, idEstructura) {
        Ext.Ajax.request({
            url: '/planificacion/suite/analisis/index.php/cmpestadistica/cargarCalidadTri',
            params: {
                idproy: idproy,
                fechainicio: fechaI,
                idEstructura: idEstructura,
                fechafin: fechaF,
                tiponom: 18,
                trimestre: 1
            },
            callback: function (options, success, response) {
                respuesta = Ext.decode(response.responseText);

                $(function () {
                    $('#containerTrimestreCalidad').highcharts({
                        chart: {
                            type: 'spline',
                            zoomType: 'xy',
                            height: _this.panelTrimestreCalidad.getInnerHeight()
                        },
                        title: {
                            text: 'Cantidad de tareas por criterio de evaluaci\xf3n por trimestres'
                        },
                        xAxis: {
                            categories: ['Ene-Mar', 'Abr-Jun', 'Jul-Sep', 'Oct-Dic']
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: ''
                            }
                        },
                        series: respuesta.data
                    });
                });
            }
        });
    };

    //tabpanel donde muestro los tipos de graficos
    this.tpGraficas = new Ext.TabPanel({
        activeTab: 0,
        frame: true,
        items: [_this.panelContenedor, _this.panelTiempoP, _this.panelCalidad, _this.tipoActividad],
        listeners: {
            tabchange: function (tabpanel, tabseleccionado) {

                if (_this.fechaFin.getValue() == '') {
                    fechaFin = '';
                } else {
                    fechaFin = _this.fechaFin.getValue().format('Y/m/d');
                }
                if (_this.fechaInicio.getValue() == '') {
                    fechaInicio = '';
                } else {
                    fechaInicio = _this.fechaInicio.getValue().format('Y/m/d');
                }
                if (_this.cbHitos.getValue() == '') {
                    idcb = _this.cbPlanes.getValue();
                } else {
                    idcb = _this.cbHitos.getValue();
                }
                if (tabseleccionado == _this.tipoActividad) {
                    _this.cargarTipoActividades(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                } else if (tabseleccionado == _this.panelContenedor) {
                    _this.cargarGraficasAct(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                    _this.cbPlanes.enable();
                } else if (tabseleccionado == _this.panelTiempoP) {
                    _this.cargarTiepoPlanificado(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                    _this.cbPlanes.enable();
                } else if (tabseleccionado == _this.panelCalidad) {
                    _this.cargarCalidad(idcb, fechaInicio, fechaFin, _this.objestructura.idEstructura);
                    _this.cbPlanes.enable();
                }
            }
        }
    });

    this.pEstadistica = new Ext.Panel({
        region: 'center',
        disabled: true,
        layout: 'fit',
        tbar: ['Proyectos: ', _this.cbPlanes, '-', 'Hitos: ', _this.cbHitos, '-', 'Fecha de inicio: ', _this.fechaInicio,
            '-', 'Fecha de fin: ', _this.fechaFin, '-', _this.btnLimpiar,
            '->', _this.btnAyuda],
        items: [_this.tpGraficas]
    });

    this.tpEstructuras = _this.objestructura.CrearArbolEstructura(
        _this.pEstadistica, function () {
            _this.tpGraficas.activate(0);
            _this.BarraProgreso.show('Cargando diagrama');
            _this.cargarDisciplina(null, null, null, _this.objestructura.idEstructura);
            _this.cargarValorizacion(null, null, null, _this.objestructura.idEstructura);
            _this.cargarBalance(null, null, null, _this.objestructura.idEstructura);
            _this.cargarPesoBalance(null, null, null, _this.objestructura.idEstructura);
        }
    );
    this.pEstructura = new Ext.Panel({
        title: 'Estructuras',
        id: 'Estructura',
        layout: 'fit',
        collapsible: true,
        collapsed: false,
        width: 280,
        region: 'west',
        margins: '3 3 3 3',
        items: [_this.tpEstructuras]
    });

    this.WinPrincipal = new Ext.Window({
        closable: false,
        graggable: false,
        maximized: true,
        layout: 'border',
        modal: true,
        usarKeymap: true,
        botonesKeymap: [_this.btnLimpiar, _this.btnAyuda],
        items: [_this.pEstructura, _this.pEstadistica]
    });

};






Utilidades.Cmp.Cmpcalculotarea = function(opcionesConfig) {
    var _this = this;
    this.BarraProgreso = new BarraEstado();
    this.next = false;
    this.btDguardar = true;  //lo uso para opcion de siguiente no guarde dos veces cuando se llama a detener por fin de tareas
    this.elcrono = "";  //var para detener la ejecucion del ciclo
    this.permitirResaltar = false;
    this.duracionEstimadaNoCalculada = 0;
    //funcion del flaco copie y pegue para no tener que hacer links y cargar cosas inecesarias
    function MostrarDuracionEstimada(equivalenciaMinutos, m, p) {
        var tiempo = '';
        var restoAnos = equivalenciaMinutos % (525600);
        var equivalenciaAnos = equivalenciaMinutos / (525600);
        var restoMeses = restoAnos % (44640);
        var equivalenciaMeses = restoAnos / (44640);
        var restoDias = restoMeses % (1440);
        var equivalenciaDias = restoMeses / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        _this.equivalenciaDuracion = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };

        if (equivalenciaMinutos >= 60) {
            if (_this.equivalenciaDuracion.equivalenciaDias != 0)
                tiempo = parseInt(_this.equivalenciaDuracion.equivalenciaDias) + ' dias';
            else
                tiempo = '';
            if (_this.equivalenciaDuracion.equivalenciaHoras != 0)
                tiempo += ' ' + parseInt(_this.equivalenciaDuracion.equivalenciaHoras) + ' horas';
            else
                tiempo += '';
            if (_this.equivalenciaDuracion.restoMinutos != 0)
                tiempo += ' ' + Math.round(_this.equivalenciaDuracion.restoMinutos) + ' min';
            else
                tiempo += '';
        } else {
            tiempo = Math.round(equivalenciaMinutos) + ' min';
        }

        if (_this.permitirResaltar)
            return '<b>' + tiempo + '</b>';
        else
            return tiempo;
    }

    this.smCalculo = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function(sm) {
                _this.eliminarregistro.setDisabled(!sm.getSelections().length);
                _this.modificarTES.setDisabled(sm.getSelections().length != 1);
            }
        }
    });

    this.user = "";

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaCalculo',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: false,
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });

    this.proyectos = new Ext.Button({
        text: 'Plantilla',
        hidden: opcionesConfig.useRemoto,
        iconCls: 'icondistra-planilla sipac-carmelita',
        handler: function() {

            _this.objCmpPlantilla = new Utilidades.Cmp.Cmpgestionarplantilla(
                    {
                        noUsarAdicionar: false,
                        noUsarModificar: false,
                        noUsarEliminar: false,
                        maxWinPrincipal: false,
                        noUsarCerrarWinP: false,
                        noUsarSeleccionarWinP: false,
                        noUsarGestObser: false,
                        noMostrarColumObser: false,
                        nombrePanel: 'Registro de plantillas',
                        dependenciaTotal: false,
                        dependenciaPorcentual: false,
                        dependenciaPuertaAbierta: false,
                        noAutoload: true,
                        singleSeleccion: true,
                        reordenarHijos: false,
                        desdeCalculo: true,
                        desasociarVisible: true
                    });

            _this.objCmpPlantilla.CargarCmpPlantilla(null, null, 1);
            _this.objCmpPlantilla.btnSeleccionarPlantilla.setHandler(function() {

                _this.stTareas.removeAll();
                _this.stCalculo.removeAll();
                _this.seguir = false;
                _this.cronometro.resetHtml();
                _this.actTiempoEstimado.disable();
                _this.cargarProyecto(_this.objCmpPlantilla.smPlantilla.getSelections()[0].data);
                _this.objCmpPlantilla.WinPrincipal.close();
            })
        }
    });

    this.calculo = new Ext.Button({
        hidden: false,
        disabled: true,
        iconCls: 'calcular',
        tooltip: 'Calcular tiempo estimado (Dt).',
        handler: function() {
            _this.winCalculodetiempo.show();
        }
    });
    this.actualizarcalculo = new Ext.Button({
        hidden: false,
        disabled: true,
        iconCls: 'recargar',
        tooltip: 'Actualizar tiempo estimado (Dt).',
        handler: function() {
            _this.updateTiempoEstimadoTarea(_this.smlistadoT.getSelected().data.duracionestimada, _this.smlistadoT.getSelected());
        }
    });

    this.formula = '<div style="float: left; margin-left: 20px;"><h3 style="font-size:15px;">Dt = (To+4Tm+Tp)/6   <br>Dt = X</h3></div>';
    this.leyenda = '<div style="float: left; margin-left: 10px;"><h3 style="font-size:10px;">To: Tiempo Optimista<br>Tp: Tiempo Pesimista<br>Tm: Tiempo Medio</h3></div>';

    document.cronoI = function(en) {
        en.hidden = true;
        document.getElementById("btDetenerCrn").hidden = false;
        document.getElementById("btSiguienteCrn").hidden = false;
        document.getElementById("btCapturarCrn").disabled = false;
        document.getElementById("btCapturarCrn").className = "buttonCapturarCalc";
        _this.seguir = true;
        empezar()
    };
    document.cronoD = function(en) {
        clearInterval(_this.elcrono);
        en.hidden = true;
        document.getElementById("btIniciarCrn").hidden = false;
        document.getElementById("btSiguienteCrn").hidden = true;
        document.getElementById("btCapturarCrn").disabled = true;
        document.getElementById("btCapturarCrn").className = "buttonCapturarCalc opaciti";
        _this.seguir = false;

        if (_this.btDguardar) {
            _this.guardar();
        }
        _this.btDguardar = true;
        _this.cronometro.setTime('0:00:00.00');

        setTimeout(function() {
            _this.getRegistroTiempoByTarea();
        }, 500);

    };
    document.cronoC = function(en) {
        _this.cronometro.capturar()
    };
    document.cronoS = function(en) {
        _this.next = true;
        _this.cronometro.capturar();
        _this.guardar();

        if (!_this.smlistadoT.selectNext()) {
            _this.next = false;
            _this.btDguardar = false;
            document.cronoD(document.getElementById("btDetenerCrn"));
            _this.smlistadoT.selectFirstRow();
            mostrarMensaje(1, "No quedan tareas por correr.");
        }
    };

    this.butC = '<div style="float:right;">';
    this.butC += '<button id="btIniciarCrn" onclick="cronoI(this)" disabled class="buttonIniciarCalc opaciti">Iniciar</button>';
    this.butC += '<button id="btDetenerCrn" onclick="cronoD(this)"  hidden class="buttonDetenerCalc" >Finalizar</button>';
    this.butC += '<button id="btCapturarCrn" onclick="cronoC(this)" disabled class="buttonCapturarCalc opaciti">Capturar</button>';
    this.butC += '<button id="btSiguienteCrn" onclick="cronoS(this)" hidden class="buttonSiguienteCalc">Siguiente</button>';
    this.butC += '</div>';

    this.cronometro = new Ext.Panel({
        width: "100%",
        region: 'south',
        html: _this.butC + _this.leyenda + _this.formula + '<h3 style="float: left; margin-left: 30px; margin-right: 10px;"><b style="font-size:30px;"><div  id="htmlcrono">0:00:00.00</div></b></h3>',
        valor: "0:00:00.00",
        capturar: function() {
            var date = new Date().format('d/m/Y');
            var str = new Ext.data.Record({
                'idcalc': false,
                'tiempo': this.valor,
                'fecha': date,
                'usuario': _this.user
            });
            _this.stCalculo.add(str);
            var row = _this.stCalculo.getAt(_this.stCalculo.getCount() - 1);
            row.set("tiempo", this.valor + 0);
        },
        setTime: function(time) {
            this.valor = time;
            document.getElementById("htmlcrono").textContent = time;
        },
        resetHtml: function() {
            _this.seguir = false;
            this.valor = "0:00:00.00";
            this.body.update(_this.butC + _this.leyenda + _this.formula + '<h3 style="float: left; margin-left: 30px; margin-right: 10px;"><b style="font-size:30px;"><div  id="htmlcrono">0:00:00.00</div></b></h3>')
        },
        updateHtml: function(optimista, pesimista, medio, xn) {

            var formulaU = '<div style="float: left; margin-left: 30px;"><h3 style="font-size:15px;">Dt = (To+4Tm+Tp)/6   <br>Dt = ' + xn + '</h3></div>';
            var evalu = '<div style="float: left; margin-left: 10px;"><h3 style="font-size:10px;">To: ' + optimista + '<br>Tp: ' + pesimista + '<br>Tm: ' + medio + '</h3></div>';
            this.body.update(_this.butC + evalu + formulaU + '<h3 style="float: left; margin-left: 30px;"><b style="font-size:30px;"><div  id="htmlcrono">' + this.valor + '</div></b></h3>');
        }
    });
    this.seguir = false;

    function tiempo() {
        if (_this.seguir) {
            actual = new Date(); //fecha a cada instante
            //tiempo del crono (cro) = fecha instante (actual) - fecha inicial (emp)
            cro = actual - emp; //milisegundos transcurridos.
            cr = new Date(); //pasamos el num. de milisegundos a objeto fecha.
            cr.setTime(cro);
            //obtener los distintos formatos de la fecha:
            cs = cr.getMilliseconds(); //milisegundos
            cs = cs / 10; //paso a centésimas de segundo.
            cs = Math.round(cs); //redondear las centésimas
            sg = cr.getSeconds(); //segundos
            mn = cr.getMinutes(); //minutos
            ho = cr.getHours() - 1; //horas
            ho = 0;
            d = cr.getDay(); // Dias
            //poner siempre 2 cifras en los números
            if (cs < 10) {
                cs = "0" + cs;
            }
            if (sg < 10) {
                sg = "0" + sg;
            }
            if (mn < 10) {
                mn = "0" + mn;
            }
            if (d < 10) {
                d = "0" + d;
            }
            //llevar resultado al visor.
            str = ho + ":" + mn + ":" + sg + "." + cs;
            _this.cronometro.setTime(str)
        }
    }
    function empezar() {
        emp = new Date(); //fecha inicial (en el momento de pulsar)
        _this.elcrono = setInterval(tiempo, 10); //poner en marcha el temporizador.
    }

    //modo de del treegrid donde se muestran los planes
    //if para saber si reinicio o no el html y usar setTime
    this.smlistadoT = new Ext.grid.CheckboxSelectionModel({
        singleSelect: true,
        listeners: {
            rowselect: function(sm, indiceFila, record) {
                if (_this.smlistadoT.hasSelection()) {
                    var arrayrecords = _this.smlistadoT.getSelections();
                    if (arrayrecords[0].data.actualizar == '1') {
                        _this.actualizarcalculo.enable();
                    }
                    _this.actTiempoEstimado.enable();
                    _this.calculo.enable();
                    _this.getRegistroTiempoByTarea();
                }
            },
            rowdeselect: function(sm, indiceFila, record) {
                if (!_this.smlistadoT.hasSelection()) {
                    if (_this.permitirResaltar) {
                        _this.cancelarActualizacion(record);
                    }
                    _this.calculo.disable();
                    _this.actualizarcalculo.disable();
                }
                _this.cronometro.resetHtml();
                _this.actTiempoEstimado.disable();
                _this.stCalculo.removeAll();
            },
            beforerowselect: function(sm, indiceFila, keep, record) {

                /*if (_this.smlistadoT.hasSelection()) {
                 if (_this.permitirResaltar) {
                 //console.log(record);
                 _this.cancelarActualizacion(record);
                 }
                 }*/
            },
            selectionchange: function(sm) {
            }
        }
    });
    this.stTareas = new Ext.data.SimpleStore({
        fields: [
            {name: 'denelemento'},
            {name: 'duracionestimada'},
            {name: 'idelemento'},
            {name: 'actualizar'}
        ]
    });
    this.listadoT = new Ext.grid.GridPanel({
        title: 'Listado de Tareas',
        sm: _this.smlistadoT,
        frame: true,
        iconCls: 'icon-grid',
        store: _this.stTareas,
        autoExpandColumn: 'tareaspan',
        columns: [_this.smlistadoT, {
                header: "idelemento",
                dataIndex: 'idelemento',
                hidden: true
            }, {
                header: "Tarea",
                id: "tareaspan",
                sortable: true,
                dataIndex: 'denelemento',
                tooltip: 'Tarea',
                renderer: MostrarImagenTipoElemento
            }, {
                header: "T.Estimado",
                sortable: true,
                dataIndex: 'duracionestimada',
                tooltip: 'Tiempo Estimado',
                renderer: function(value) {
                    return MostrarDuracionEstimada(value, true, true);
                }
            }],
        region: 'west',
        width: "70%",
        height: "100%"
    });
    this.stCalculo = new Ext.data.SimpleStore({
        fields: [
            {name: 'idcalc'},
            {name: 'tiempo'},
            {name: 'fecha'},
            {name: 'usuario'}
        ]
    });
    this.cmCalculo = [_this.smCalculo, {
            header: "Tiempo",
            flex: 1,
            sortable: true,
            dataIndex: 'tiempo',
            tooltip: 'Tiempo'
        }, {
            header: "Fecha",
            flex: 0.5,
            sortable: true,
            dataIndex: 'fecha',
            tooltip: 'Fecha'
        }, {
            header: "Usuario",
            sortable: true,
            flex: 0.5,
            dataIndex: 'usuario',
            tooltip: 'Usuario'
        }];

    this.guardar = function() {
        var arrayregistro = [];
        _this.stCalculo.each(function(t) {
            if (!t.data.idcalc)
                arrayregistro.push(t.data.tiempo)
        });

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/guardarregistro',
            params: {
                arrayregistro: Ext.encode(arrayregistro),
                idtarea: _this.smlistadoT.getSelected().data.idelemento
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                mostrarMensaje(1, "Los registro han sido guardados satisfactoriamente.");
            }
        });
    };
    this.getRegistroTiempoByTarea = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/registrobytarea',
            params: {
                idtarea: _this.smlistadoT.getSelected().data.idelemento
            },
            callback: function(options, success, response) {
                dt = Ext.decode(response.responseText);

                if (dt.promedios[0].optimista == null) {
                    dt.promedios[0].optimista = '00:00:00'
                }
                if (dt.promedios[0].pesimista == null) {
                    dt.promedios[0].pesimista = '00:00:00'
                }
                if (dt.promedios[0].medio == null) {
                    dt.promedios[0].medio = '00:00:00'
                }

                _this.cronometro.updateHtml(dt.promedios[0].optimista, dt.promedios[0].pesimista, dt.promedios[0].medio, dt.xn);
                _this.stCalculo.loadData(dt.registros);
                _this.gdCalculo.setTitle("Dts: " + _this.smlistadoT.getSelected().data.denelemento);
                document.getElementById("btIniciarCrn").disabled = false;
                document.getElementById("btIniciarCrn").className = "buttonIniciarCalc";

                if (_this.next) {
                    _this.next = false;
                    document.cronoI(document.getElementById("btIniciarCrn"));
                }
            }
        });
    };
    this.getTiempoEstimadoTarea = function() {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/registrobytarea',
            params: {
                idtarea: _this.smlistadoT.getSelected().data.idelemento
            },
            callback: function(options, success, response) {
                dt = Ext.decode(response.responseText);
                //console.log(dt.xn);

                //var duracionEstimada = (_this.duracionEstimadaDias.getValue() * 24) + _this.duracionEstimadaHoras.getValue() + (_this.duracionEstimadaMinutos.getValue() / 60);

                var tiempo = dt.xn.split(':');
                if (tiempo['0'] > 0 && tiempo['1'] > 0 && tiempo['2'] > 1) {
                    tiempo['1'] = 1;
                }

                tiempo = tiempo['0'] * 60 + tiempo['1'] / 60; //convierto a minutos

                //console.log('ceil : ' + Math.ceil(tiempo)); // redondeo hacia arriba

                _this.updateTiempoEstimadoTarea(Math.ceil(tiempo), _this.smlistadoT.getSelected());

            }
        });
    };
    this.updateTiempoEstimadoTarea = function(tiempoEstimado, record) {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarTiempoEstimado',
            params: {
                idtarea: record.data.idelemento,
                tiempoEstimado: tiempoEstimado,
                tiempooptimista: _this.tiempoopt,
                tiempomedio: _this.tiempomed,
                tiempopesimista: _this.tiempopes
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.cargarProyecto(_this.objCmpPlantilla.smPlantilla.getSelections()[0].data);
                _this.permitirResaltar = false;
                _this.smlistadoT.clearSelections();
                _this.stCalculo.removeAll();
                _this.cronometro.resetHtml();
                mostrarMensaje(1, "El tiempo estimado ha sido actualizado satisfactoriamente.");
            }
        });
    };

    this.actTiempoEstimado = new Ext.Button({
        iconCls: 'recargar',
        disabled: true,
        tooltip: 'Actualizar Tiempo Estimado de la Tarea',
        handler: function() {
            //_this.guardar()
            _this.getTiempoEstimadoTarea();
        }
    });
    this.modificarTES = new Ext.Button({
        iconCls: 'modificar',
        disabled: true,
        hidden: true,
        tooltip: 'Modificar tiempo de estimación',
        handler: function() {
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/modificarest',
                params: {
                    tiempo: _this.smCalculo.getSelected().data.tiempo,
                    idtarea: _this.smlistadoT.getSelected().data.idelemento
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    _this.smlistadoT.getSelected().set("duracionestimada", responseData.newtiempo.duracionestimada)
                    mostrarMensaje(1, "El tiempo estimado ha sido modificado satisfactoriamente.");
                }
            });
        }
    });
    this.eliminarregistro = new Ext.Button({
        iconCls: 'eliminar',
        disabled: true,
        tooltip: 'Eliminar Registros',
        handler: function() {
            if (_this.smCalculo.getSelections().length > 1) {
                msg = "Los registros han sido eliminados satisfactoriamente.";
            } else {
                msg = "El registro ha sido eliminado satisfactoriamente.";
            }

            var arrayregistro = [];
            for (var i = 0; i < _this.smCalculo.getCount(); i++) {
                arrayregistro.push(_this.smCalculo.getSelections()[i].data.idcalc);
            }

            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalculotarea/eliminarRegistro',
                params: {
                    arrayregistro: Ext.encode(arrayregistro),
                    idtarea: _this.smlistadoT.getSelected().data.idelemento
                },
                callback: function(options, success, response) {
                    if (success) {
                        _this.getRegistroTiempoByTarea();
                        mostrarMensaje(1, msg);
                    }
                }
            });
        }
    });
    this.gdCalculo = new Ext.grid.GridPanel({
        title: 'Registro de Tiempos',
        id: 'gdCalculo',
        width: "30%",
        height: "100%",
        region: 'center',
        frame: true,
        iconCls: 'icon-grid',
        tbar: [_this.actTiempoEstimado, _this.modificarTES, _this.eliminarregistro],
        store: _this.stCalculo,
        sm: _this.smCalculo,
        columns: _this.cmCalculo,
        loadMask: {
            msg: 'Cargando Registros...'
        },
        listeners: {}
    });

    //panel para los calculos de duracionestimada
    this.tiempoopt = 0;
    this.tiempooptimistaDias = new Ext.form.NumberField({
        fieldLabel: 'D&iacute;as',
        id: 'tiempooptimistaDias',
        maxValue: 1000,
        //width: 40,
        allowBlank: false,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempooptimistaHoras = new Ext.form.NumberField({
        fieldLabel: 'Horas',
        id: 'tiempooptimistaHoras',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        //width: 40,
        allowBlank: false,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempooptimistaMinutos = new Ext.form.NumberField({
        fieldLabel: 'Min',
        id: 'tiempooptimistaMinutos',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        // width: 40,
        allowNegative: false,
        allowBlank: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempooptimista = new Ext.form.FieldSet({
        title: 'Tiempo optimista:',
        height: 91,
        anchor: '95%',
        items: [{
                layout: 'column', items: [{
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempooptimistaDias]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempooptimistaHoras]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempooptimistaMinutos]
                    }]
            }]
    });

    this.tiempomed = 0;
    this.tiempomedioDias = new Ext.form.NumberField({
        fieldLabel: 'D&iacute;as',
        id: 'tiempomedioDias',
        maxValue: 1000,
        //width: 40,
        allowBlank: false,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempomedioHoras = new Ext.form.NumberField({
        fieldLabel: 'Horas',
        id: 'tiempomedioHoras',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        //width: 40,
        allowBlank: false,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempomedioMinutos = new Ext.form.NumberField({
        fieldLabel: 'Min',
        id: 'tiempomedioMinutos',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        // width: 40,
        allowNegative: false,
        allowBlank: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempomedio = new Ext.form.FieldSet({
        title: 'Tiempo medio:',
        height: 91,
        anchor: '95%',
        items: [{
                layout: 'column', items: [{
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempomedioDias]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempomedioHoras]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempomedioMinutos]
                    }]
            }]
    });

    this.tiempopes = 0;
    this.tiempopesimistaDias = new Ext.form.NumberField({
        fieldLabel: 'D&iacute;as',
        id: 'tiempopesimistaDias',
        maxValue: 1000,
        //width: 40,
        allowBlank: false,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempopesimistaHoras = new Ext.form.NumberField({
        fieldLabel: 'Horas',
        id: 'tiempopesimistaHoras',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        //width: 40,
        allowBlank: false,
        allowNegative: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempopesimistaMinutos = new Ext.form.NumberField({
        fieldLabel: 'Min',
        id: 'tiempopesimistaMinutos',
        maxValue: 1000,
        maxText: 'Solo admite números enteros positivos entre 0 y 1000.',
        //readOnly: readOnly,
        // width: 40,
        allowNegative: false,
        allowBlank: false,
        value: 0,
        anchor: '90%',
        listeners: {}
    });
    this.tiempopesimista = new Ext.form.FieldSet({
        title: 'Tiempo pesimista:',
        height: 91,
        anchor: '95%',
        items: [{
                layout: 'column', items: [{
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempopesimistaDias]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempopesimistaHoras]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempopesimistaMinutos]
                    }]
            }]
    });

    this.fscalculo = new Ext.form.FieldSet({
        title: 'Variables que intervienen en el cálculo de la Duración estimada (Dt):',
        height: 140,
        anchor: '100%',
        items: [{
                layout: 'column', items: [{
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempooptimista]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempomedio]
                    }, {
                        columnWidth: 0.33,
                        layout: 'form',
                        items: [_this.tiempopesimista]
                    }]
            }]
    });

    this.fpcalculodetiempo = new Ext.FormPanel({
        labelAlign: 'top',
        frame: true,
        items: [_this.fscalculo]
    });
    this.btnAceptarCalculo = new Ext.Button({
        iconCls: 'aceptar',
        text: 'Aceptar ',
        tooltip: 'Guardar datos y cerrar ventana',
        handler: function() {
            _this.CalculoTiempoEstimado();
        }
    });
    this.winCalculodetiempo = new Ext.Window({
        modal: true,
        //closeAction: 'destroy',
        constrain: true,
        layout: 'fit',
        title: 'Cálculo de tiempo',
        width: 650,
        height: 225,
        resizable: false,
        /*autoValidate: true,
         validateDefault: true,*/
        listeners: {
            beforeshow: function(win) {
            },
            destroy: function() {
            },
            beforedestroy: function() {
            }
        },
        buttons: [{
                iconCls: 'cancelar',
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                handler: function() {
                    _this.winCalculodetiempo.hide();
                    _this.fpcalculodetiempo.getForm().reset();
                }
            }, _this.btnAceptarCalculo
        ],
        items: _this.fpcalculodetiempo
    });

    //****** FUNCIONES GENERALES *********

    //*** PANEL DETALLES *** *** *** **** ****
    this.PanelG = new Ext.Panel({
        layout: 'border',
        items: [_this.listadoT, _this.gdCalculo, _this.cronometro]
    });

    this.cargarProyecto = function(datos) {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/getAllTareasByProyecto',
            params: {
                idproyecto: Ext.encode(datos.idelemento)
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.WinPrincipalCalculo.setTitle(opcionesConfig.nombrePanel + datos.denominacion);
                _this.stTareas.removeAll();
                responseData.tareas.forEach(function(v) {
                    var str = new Ext.data.Record(v);
                    _this.stTareas.add(str)
                });
                _this.user = responseData.user;
            }
        });
    };

    this.cargarEjercicio = function(datos) {
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/getAllTareasByEjercicio',
            params: {
                idejercicio: datos.idejercicio
            },
            callback: function(options, success, response) {
                responseData = Ext.decode(response.responseText);
                _this.WinPrincipalCalculo.setTitle(opcionesConfig.nombrePanel + datos.denominacion);
                _this.stTareas.removeAll();
                responseData.tareas.forEach(function(v) {
                    var str = new Ext.data.Record(v);
                    _this.stTareas.add(str);
                });
                _this.user = responseData.user;
            }
        });
    };

    this.WinPrincipalCalculo = new Ext.Window({
        title: opcionesConfig.nombrePanel,
        layout: 'fit',
        constrain: true,
        tbar: [_this.proyectos, '-', _this.calculo, '-', _this.actualizarcalculo, '->', _this.btnAyuda],
        maximized: opcionesConfig.maxWinPrincipal,
        closable: !opcionesConfig.noUsarCerrarWinP,
        graggable: false,
        modal: true,
        width: 998,
        height: 500,
        usarKeymap: true,
        //botonesKeymap: [_this.btnAyuda],
        items: _this.PanelG,
        listeners: {
            close: function() {
                clearInterval(_this.elcrono);
            }
        }
    });

    this.InicializarCalculo = function() {
        _this.WinPrincipalCalculo.show();
        if (opcionesConfig.proyectoSelect) {
            _this.cargarProyecto(opcionesConfig.proyectoSelect)
        }
        _this.BarraProgreso.show('Cargando registros');
        _this.BarraProgreso.hide();
    };

    this.InicializarCalculoEjercicio = function() {
        _this.WinPrincipalCalculo.show();
        if (opcionesConfig.proyectoSelect) {
            _this.cargarEjercicio(opcionesConfig.proyectoSelect)
        }
        _this.BarraProgreso.show('Cargando registros');
        _this.BarraProgreso.hide();
    };

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m, p) {
        return '<span class="icondistra-tarea sipac-carmelita">' + ' ' + valor + '</span>';
    }

    this.CalculoTiempoEstimado = function() {
        var tiempooptimistaDias = _this.tiempooptimistaDias.getValue();
        var tiempooptimistaHoras = _this.tiempooptimistaHoras.getValue();
        var tiempooptimistaMinutos = _this.tiempooptimistaMinutos.getValue();

        var tiempomedioDias = _this.tiempomedioDias.getValue();
        var tiempomedioHoras = _this.tiempomedioHoras.getValue();
        var tiempomedioMinutos = _this.tiempomedioMinutos.getValue();

        var tiempopesimistaDias = _this.tiempopesimistaDias.getValue();
        var tiempopesimistaHoras = _this.tiempopesimistaHoras.getValue();
        var tiempopesimistaMinutos = _this.tiempopesimistaMinutos.getValue();

        var duracionestimada = 0;
        var tiempooptimista = 0;
        tiempooptimista = (parseInt(tiempooptimistaDias) * 24) * 60;
        tiempooptimista = (parseInt(tiempooptimistaHoras) * 60) + parseInt(tiempooptimista);
        tiempooptimista = parseInt(tiempooptimistaMinutos) + parseInt(tiempooptimista);
        tiempooptimista = Math.round(tiempooptimista);
        _this.tiempoopt = tiempooptimista;

        var tiempomedio = 0;
        tiempomedio = (parseInt(tiempomedioDias) * 24) * 60;
        tiempomedio = (parseInt(tiempomedioHoras) * 60) + parseInt(tiempomedio);
        tiempomedio = parseInt(tiempomedioMinutos) + parseInt(tiempomedio);
        tiempomedio = Math.round(tiempomedio);
        _this.tiempomed = tiempomedio;

        var tiempopesimista = 0;
        tiempopesimista = (parseInt(tiempopesimista) * 24) * 60;
        tiempopesimista = (parseInt(tiempopesimistaHoras) * 60) + parseInt(tiempopesimista);
        tiempopesimista = parseInt(tiempopesimistaMinutos) + parseInt(tiempopesimista);
        tiempopesimista = Math.round(parseInt(tiempopesimista));
        _this.tiempopes = tiempopesimista;

        duracionestimada = (parseInt(tiempooptimista) + (parseInt(tiempomedio) * 4) + parseInt(tiempopesimista)) / 6;
        var duracionTotal = _this.MostrarDuracionPlan(duracionestimada);

        _this.duracionEstimadaNoCalculada = _this.smlistadoT.getSelected().data.duracionestimada;
        _this.permitirResaltar = true;
        var arrayrecords = _this.smlistadoT.getSelections();
        var record = arrayrecords[0];
        record.set("duracionestimada", duracionestimada);
        record.set("actualizar", '1');
        record.commit();
        _this.winCalculodetiempo.hide();
        _this.fpcalculodetiempo.getForm().reset();
        _this.actualizarcalculo.enable();
    };

    this.MostrarDuracionPlan = function(equivalenciaMinutos) {
        var restoAnos = equivalenciaMinutos % (525600);
        var equivalenciaAnos = equivalenciaMinutos / (525600);
        var restoMeses = restoAnos % (44640);
        var equivalenciaMeses = restoAnos / (44640);
        var restoDias = restoMeses % (1440);
        var equivalenciaDias = restoMeses / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        _this.equivalencia = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };
        return duracionPlanTotal;
    }

    this.cancelarActualizacion = function(record) {
        var mensaje = '¿Desea actualizar el tiempo estimado calculado?';

        mostrarMensaje(2, mensaje, function(btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.updateTiempoEstimadoTarea(record.data.duracionestimada, record);
            } else {
                _this.permitirResaltar = false;
                record.set("duracionestimada", _this.duracionEstimadaNoCalculada);
                record.commit();
            }
        });
    };

};
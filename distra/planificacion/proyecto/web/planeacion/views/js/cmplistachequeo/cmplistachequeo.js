Utilidades.Cmp.Cmplistachequeo = function(opcionesConfig) {
    var _this = this;
    this.start = 0;
    this.BarraProgreso = new BarraEstado();

    //objeto de la clase de configuracion de NodeJS
    this.objNodeJS = new Utilidades.Cmp.ServerPortNodeJS();
    this.arrayidelementos = [];

    // nodeJS, socket-io - Generar Eventos
    this.socketEvents = new io.connect(_this.objNodeJS.ip_servidor, {port: _this.objNodeJS.port_servidor});
    _this.socketEvents.on('connect', function() {
    });


    //funcion del flaco copie y pegue para no tener que hacer links y cargar cosas inecesarias
    function MostrarDuracionEstimada(equivalenciaMinutos) {
        var tiempo = '';
        /*var restoAnos = equivalenciaMinutos % (525600);
         var equivalenciaAnos = equivalenciaMinutos / (525600);
         var restoMeses = restoAnos % (44640);
         var equivalenciaMeses = restoAnos / (44640);*/
        var restoDias = equivalenciaMinutos % (1440);
        var equivalenciaDias = equivalenciaMinutos / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        //var duracionPlanTotal = parseInt(equivalenciaAnos) + ' a�os - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
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

        return tiempo;
    }

    this.stTareas = new Ext.data.Store({
        autoLoad: true,
        url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/obtenerTareasParaChequear',
        reader: new Ext.data.JsonReader({
            id: 'idelemento',
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idelemento'
            }, {
                name: 'denominacion'
            }, {
                name: 'pendiente'
            }, {
                name: 'tiempoestimado'
            }, {
                name: 'nombreautor'
            }, {
                name: 'plantilla'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'nombreautor'
            }, {
                name: 'fechainicio'
            }, {
                name: 'horainicio'
            },{
                name: 'horafin'
            }]),
        listeners: {
            beforeload: function(st) {

            },
            load: function(store, record, options) {
                _this.sm.clearSelections();
                _this.arrayidelementos = [];
            }
        },
    });



    /*var arr = [{'idtarea':9000008710,'denominacion':'Cargar contenedores en el almacen 2','pendiente':false,duracion:160,autor:"Jefe de Almacen"},
     {'idtarea':9000008711,'denominacion':'Mover el avion F501 H300 al a la pista 34','pendiente':false,duracion:350,autor:"Flaco"},
     {'idtarea':9000008712,'denominacion':'Otra tarea mas y hace falta para ahora','pendiente':false,duracion:255,autor:"Drt. Economia"},
     {'idtarea':9000008713,'denominacion':'Esta tarea es larga pero bueno hay que hacerla es para ocupar espacio tu sabes','pendiente':true,duracion:160,autor:"Desarrollador"},
     {'idtarea':9000008714,'denominacion':'Mover el avion F501 H300 al a la pista 34','pendiente':false,duracion:3050,autor:"Jefe de Grua"},
     {'idtarea':9000008710,'denominacion':'Otra tarea mas y hace falta para ahora','pendiente':false,duracion:300,autor:"Leonardo"},
     {'idtarea':9000008711,'denominacion':'Esta tarea es larga pero bueno hay que hacerla es para ocupar espacio tu sabes','pendiente':true,duracion:650,autor:"Leonardo"},
     ]
     
     arr.forEach(function(v){
     _this.stTareas.add(new Ext.data.Record(v));
     })*/

    this.pagTareas = new Ext.PagingToolbar({
        pageSize: 10,
        store: _this.stTareas,
        displayInfo: true,
        listeners: {
            beforechange: function(paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    document.allc = function(en) {
        _this.stTareas.each(function(v) {
            v.set("pendiente", true);
        })


    }
    document.alld = function(en) {
        _this.stTareas.each(function(v) {
            v.set("pendiente", false);
        })

    }

    document.cpt = function(en) {
        var row = _this.gdTareas.getSelectionModel().getSelected()
        row.set("pendiente", !row.get('pendiente'))
        console.log("enviar la solicitud al serve")
    }

    document.actualizar = function(en) {
        /*var row = _this.gdTareas.getSelectionModel().getSelected()
        row.set("pendiente", !row.get('pendiente'))*/
        //console.log("actualizar")

        _this.actualizarCumplimientoChequeo(2);

        /*if (_this.winActualizarCumplimiento) {
            _this.winActualizarCumplimiento.destroy();
        }
        _this.winActualizarCumplimiento = new Ext.Window({
            title: 'Actualizar Cumplimiento',
            width: 200,
            height: 130,
            modal: true,
            buttons: [
                {
                    handler: function () {
                        _this.winActualizarCumplimiento.destroy();
                    },
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: ''
                }, {
                    handler: function () {
                        _this.BarraProgreso.show('Actualizando cumplimiento...');
                        Ext.Ajax.request({
                            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                            params: {
                                arrayidtareas: Ext.encode(_this.arrayidelementos),
                                cumplimiento: Ext.get(_this.idcmp + '_nfActCumplimiento').getValue(),
                                metodo: metodo
                            },
                            callback: function (options, success, response) {
                                _this.BarraProgreso.hide();
                                responseData = Ext.decode(response.responseText);
                                if (responseData.respuesta == 1) {
                                    mostrarMensaje(1, msj);
                                    _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                                    _this.winActualizarCumplimiento.destroy();
                                    _this.accionesPostActualizarCumplimiento(1);
                                }
                                if (responseData.respuesta == 3) {
                                    mostrarMensaje(1, msjError);
                                    _this.accionesPostActualizarCumplimiento(0);
                                }
                                if (responseData.respuesta == 0) {
                                    _this.winActualizarCumplimiento.destroy();
                                    _this.smsInformacion(msjAntecedentes);
                                }
                            }
                        });
                    },
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: ''
                }
            ],
            items: [
                new Ext.FormPanel({
                    labelAlign: 'top',
                    frame: true,
                    items: [
                        new Ext.form.NumberField({
                            fieldLabel: 'Porciento de cumplimiento',
                            id: _this.idcmp + '_nfActCumplimiento',
                            maxValue: 100,
                            maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                            allowBlank: false,
                            anchor: '90%'
                        })
                    ]
                })
            ]
        });
        _this.winActualizarCumplimiento.show();*/

    };

    document.ejc = function(en) {

        _this.actualizarCumplimientoChequeo(1);

       /* _this.arrayidelementos.push({
            id: _this.sm.getSelected().data.idelemento,
            tipo: _this.sm.getSelected().data.tipoelemento,
            plantilla: _this.sm.getSelected().data.plantilla,
            idautor: _this.sm.getSelected().data.idautor,
            gradocumplimiento: _this.sm.getSelected().data.gradocumplimiento,
            denominacion: _this.sm.getSelected().data.denominacion,
        });

        var msj = '', msjError = '';
        if (_this.arrayidelementos.length == 1) {
            msj = 'La tarea ha sido actualizada satisfactoriamente.';
            msjError = 'La tarea no ha sido actualizada.';
        } else {
            msj = 'Las tareas han sido actualizadas satisfactoriamente.';
            msjError = 'Las tareas no han sido actualizada.';
        }

        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
            params: {
                arrayidtareas: Ext.encode(_this.arrayidelementos),
                metodo: 1
            },
            callback: function(options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.respuesta == 1) {
                    mostrarMensaje(1, msj);
                    _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                }
                if (responseData.respuesta == 3) {
                    mostrarMensaje(1, msjError);
                }

                _this.sm.clearSelections();
                _this.arrayidelementos = [];
                _this.stTareas.reload({
                    params: {
                        start: _this.start
                    }
                });

            }
        });*/
    }

    this.actualizarCumplimientoChequeo = function(metodo){

        _this.arrayidelementos.push({
            id: _this.sm.getSelected().data.idelemento,
            tipo: _this.sm.getSelected().data.tipoelemento,
            plantilla: _this.sm.getSelected().data.plantilla,
            idautor: _this.sm.getSelected().data.idautor,
            gradocumplimiento: _this.sm.getSelected().data.gradocumplimiento,
            denominacion: _this.sm.getSelected().data.denominacion,
        });

        var msj = '', msjError = '';
        if (_this.arrayidelementos.length == 1) {
            msj = 'La tarea ha sido actualizada satisfactoriamente.';
            msjError = 'La tarea no ha sido actualizada.';
        } else {
            msj = 'Las tareas han sido actualizadas satisfactoriamente.';
            msjError = 'Las tareas no han sido actualizada.';
        }

        if(metodo == 1){
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                params: {
                    arrayidtareas: Ext.encode(_this.arrayidelementos),
                    metodo: 1
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                        _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                    }
                    if (responseData.respuesta == 3) {
                        mostrarMensaje(1, msjError);
                    }
                    _this.actualizarGridChequeo();

                }
            });
        }else{

            if (_this.winActualizarCumplimiento) {
                _this.winActualizarCumplimiento.destroy();
            }
            _this.winActualizarCumplimiento = new Ext.Window({
                title: 'Actualizar Cumplimiento',
                width: 200,
                height: 130,
                modal: true,
                buttons: [
                    {
                        handler: function () {
                            _this.winActualizarCumplimiento.destroy();
                        },
                        iconCls: 'cancelar',
                        text: 'Cancelar',
                        tooltip: ''
                    }, {
                        handler: function () {
                            _this.BarraProgreso.show('Actualizando cumplimiento...');
                            Ext.Ajax.request({
                                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                                params: {
                                    arrayidtareas: Ext.encode(_this.arrayidelementos),
                                    cumplimiento: Ext.get(_this.idcmp + '_nfActCumplimiento').getValue(),
                                    metodo: 2
                                },
                                callback: function (options, success, response) {
                                    _this.BarraProgreso.hide();
                                    responseData = Ext.decode(response.responseText);
                                    if (responseData.respuesta == 1) {
                                        mostrarMensaje(1, msj);
                                        _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                                        _this.winActualizarCumplimiento.destroy();
                                        //_this.accionesPostActualizarCumplimiento(1);
                                    }
                                    if (responseData.respuesta == 3) {
                                        mostrarMensaje(1, msjError);
                                        //_this.accionesPostActualizarCumplimiento(0);
                                    }
                                    if (responseData.respuesta == 0) {
                                        _this.winActualizarCumplimiento.destroy();
                                        _this.smsInformacion(msjAntecedentes);
                                    }
                                    _this.actualizarGridChequeo();
                                }
                            });
                        },
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        tooltip: ''
                    }
                ],
                items: [
                    new Ext.FormPanel({
                        labelAlign: 'top',
                        frame: true,
                        items: [
                            new Ext.form.NumberField({
                                fieldLabel: 'Porciento de cumplimiento',
                                id: _this.idcmp + '_nfActCumplimiento',
                                maxValue: 100,
                                maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                allowBlank: false,
                                anchor: '90%'
                            })
                        ]
                    })
                ]
            });
            _this.winActualizarCumplimiento.show();
        }

    };

    this.actualizarGridChequeo = function(){
        _this.sm.clearSelections();
        _this.arrayidelementos = [];
        _this.stTareas.reload({
            params: {
                start: _this.start
            }
        });
    };

    this.confAll = '<button id="confAll" title="Comfirmar todas." class="buttonCnfAll" onclick="allc(this)">Comfirmar Todas</button>'
    this.DngAll = '<button  id="DngAll"  title="Denegar todas." class="buttonDngAll" onclick="alld(this)">Liberar Todas</button>'

    this.capturar = '<div class="btn" style="height: 60px; width: 60px; margin: 5px 0;"><button class="buttonSolicitar" onclick="cpt(this)">Comfirmar</button></div>'
    this.hecho = '<div class="btn" style="height: 60px; width: 60px; margin: 5px 0;"><button class="buttonHecho" onclick="ejc(this)">Ejecutar</button></div>'
    this.denegar = '<div class="btn" style="height: 60px; width: 60px; margin: 5px 0;"><button class="buttonDenegar" onclick="cpt(this)">Liberar</button></div>'
    this.porciento_cumplimiento = '<div class="btn" style="height: 60px; width: 60px; margin: 5px 0;"><button class="buttonPorciento" onclick="actualizar(this)">Actualizar</button></div>'


    this.sm = new Ext.grid.RowSelectionModel({
        singleSelect: false,
        listeners: {
            selectionchange: function(sm) {
                /*if (sm.getSelections().length == 1)
                    _this.panelDetalles.updHtml(sm.getSelected().data)*/
            }
        }
    })

    this.gdTareas = new Ext.grid.GridPanel({
        id: 'gdChe',
        sm: _this.sm,
        bbar: _this.pagTareas,
        //region: 'center',
        border: 10,
        frame: true,
        iconCls: 'icon-grid',
        stripeRows: true,
        autoExpandColumn: 'columspan',
        store: _this.stTareas,
        columns: [{
                header: "Actividades",
                id: "columspan",
                dataIndex: 'denominacion',
                renderer: mostrarTooltip
                /*renderer: function(value) {
                    return '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + value + '>' + value + '</h1>';
                }*/
            }, {
                header: "Fecha de inicio",
                dataIndex: 'fechainicio',
                renderer: mostrarTooltip
                /*renderer: function(value) {
                    return '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + value + '>' + value + '</h1>';
                }*/
            }, {
                header: "Hora inicio",
                dataIndex: 'horainicio',
                renderer: mostrarTooltip
                /*renderer: function(value) {
                    return '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + value + '>' + value + '</h1>';
                }*/
            }, {
                header: "Hora fin",
                dataIndex: 'horafin',
                renderer: mostrarTooltip
                /*renderer: function(value) {
                 return '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + value + '>' + value + '</h1>';
                 }*/
            }, {
                header: "% Cumplimiento",
                dataIndex: 'gradocumplimiento',
                renderer: mostrarTooltip
                /*renderer: function(value) {
                 return '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + value + '>' + value + '</h1>';
                 }*/
            }, {
                header: "Solicitar",
                hidden: true,
                dataIndex: 'pendiente',
                renderer: function(value) {
                    if (value) {
                        return _this.denegar
                    } else {
                        return _this.capturar;
                    }

                }
            }, {
                header: "Actualizar %",
                dataIndex: '',
                renderer: function(value) {
                    return _this.porciento_cumplimiento;
                }
            },{
                header: "Realizado",
                dataIndex: '',
                renderer: function(value) {
                    return _this.hecho;
                }
            }],
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true,
            // if(row.get("change") < 0)
            getRowClass: function(row, index) {
                var cls = "";
                if (true) {
                    cls = "row_heith"; // assign css class in some condition!
                }
                return cls;
            }

        },
        loadMask: {
            msg: 'Cargando Actividades...'
        },
        listeners: {
        }
    });

    function mostrarTooltip(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        valor = '<h1 style="font-size: 14px; color:#525252; font-weight: bold; margin: 12px 0;" tooltip=' + valor + '>' + valor + '</h1>';
        return valor;
    }
    /*this.panelDetalles = new Ext.Panel({
     title: "Detalles",
     updHtml: function(data) {
     this.body.update('<p class="h2Text">Duracion: ' + MostrarDuracionEstimada(MostrarDuracionEstimada(_this.sm.getSelected().data.tiempoestimado), true, true) + '</p><p class="h2Text">Autor: ' + _this.sm.getSelected().data.nombreautor + '</p>')
     },
     region: "west",
     width: "17%",
     html: "<p class='h2Text'>Duracion: </p><p class='h2Text'>Autor: </p>"
     
     })*/

    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaChequeo',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: false,
        tooltip: 'Mostrar ayuda de la funcionalidad'
    });

    // me.down('#detalles').tpl.overwrite(me.down('#detalles').body,datos{Object})
    this.WinPrincipalChe = new Ext.Window({
        title: opcionesConfig.nombrePanel,
        //tbar:[_this.confAll,_this.DngAll],
        tbar:['->',_this.btnAyuda],
        layout: 'fit',
        constrain: true,
        maximized: opcionesConfig.maxWinPrincipal,
        closable: !opcionesConfig.noUsarCerrarWinP,
        graggable: false,
        modal: true,
        width: 710,
        height: 400,
        usarKeymap: true,
        items: [_this.gdTareas/*, _this.panelDetalles*/]

    });

    this.InicializarChequeo = function() {
        _this.WinPrincipalChe.show();

    };


};

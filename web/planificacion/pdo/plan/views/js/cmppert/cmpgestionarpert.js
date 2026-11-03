Utilidades.Cmp.Cmpgestionarpert = function (opcionesConfig) {

//captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    //identificador para los elementos de la vista
    this.idcmp = 'cmpPert_' + opcionesConfig.idcmp;
    //objetos de otros componentes
    this.BarraProgreso = new BarraEstado();
    //objeto del componente "relaciones"
    this.objcmprelaciones = new Utilidades.Cmp.Cmprelaciones();

    this.arrayAsociativoCompresion = [];
    //objeto CRUD del componente "actividades"
    this.objCmpCrudActividad = (opcionesConfig.objCmpCrudActividad) ? opcionesConfig.objCmpCrudActividad : new Utilidades.Cmp.Cmpcrudactividades();

    //objeto del componente "Reporte"
    //this.objCmpPlantilla = new Utilidades.Cmp.Cmpgestionarplantilla(opcionesConfig);

    this.generarDiagramaDesde = (opcionesConfig.generarDiagramaDesde) ? opcionesConfig.generarDiagramaDesde : 'Pert';

    this.integracionProyecto = (_this.generarDiagramaDesde == 'Proyecto') ? true : false;

    this.tipoelemento = _this.integracionProyecto ? 10 : 3;

    if (_this.integracionProyecto) this.objcompresionProyecto = new Utilidades.Cmp.Cmpcompresion();

    //objeto de la clase de configuracion de NodeJS
    this.objNodeJS = new Utilidades.Cmp.ServerPortNodeJS();
    this.objreporte = new Utilidades.Cmp.Cmpreportes(
        {
            noUsarModificar: false,
            noUsarEliminar: false,
            noUsarActivar: false,
            noUsarDesactivar: false,
            noUsarCerrarWinP: false,
            noUsarSeleccionarWinP: true,
            maxWinPrincipal: false,
            noUsarCbAprob: false,
            noUsarGestObser: false,
            noMostrarColumObser: false,
            singlemodoSeleccionGridPlanes: false,
            noUsarMenuGrid: false,
            closableWinPrincipal: true,
            titleWinPrincipal: 'Reportes',
            excluirPlan: 1
        });

    //variables auxiliares
    this.idTipoElemento = 0;
    this.elemento = [];
    this.actividadesPert = [];
    this.arrayRelaciones = [];
    this.arrayGruposHitos = [];
    this.equivalencia = [];
    this.critical = false;
    this.cumplida = false;
    _this.background = "white";
    _this.separatorStroke = "black";
    this.opcionesConfig = opcionesConfig;
    this.vistaAmpliada = null;
    this.idNodeFrom = null;
    this.idNodeTo = null;
    this.idNodeSelected = null;
    this.arrayNodeSelected = [];
    this.arrayGlobalTareas = [];
    /*
     *
     * Funciones
     *
     * */


    this.ConstruirComponentesVisuales = function () {

        if (_this.WinPrincipal) {
            _this.WinPrincipal.destroy();
        }

//composicion de la vista

//botones
        _this.btn100 = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-verde',
            tooltip: 'Actualizar' + (_this.integracionProyecto ? ' tarea(s)' : ' actividad(es)') + ' al 100% de cumplimiento',
            handler: function () {
                if (_this.integracionProyecto)
                    _this.aprobarTarea(_this.arrayNodeSelected, 1);
                else {
                    var arrayidactividades = [];
                    _this.arrayNodeSelected.forEach(function (item, index) {
                        arrayidactividades[index] = item.id;
                    });
                    var objCmpActividades = new Utilidades.Cmp.Cmpgestionaractividades(
                        {
                            noUsarModificar: true,
                            noUsarEliminar: true,
                            noUsarActivar: true,
                            noUsarDesactivar: true,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            maxWinPrincipal: false,
                            noUsarCbAprob: true,
                            noUsarGestObser: true,
                            noMostrarColumObser: true,
                            singlemodoSeleccionGridActividades: true,
                            reordenarHijos: true,
                            arrayidactividades: arrayidactividades,
                            noUsarMenuGrid: true,
                            nombrePanel: 'Registro de actividades',
                            idcmp: 'Pert'
                        });
                    objCmpActividades.actualizarCumplimiento(1);
                }
            },
            key: {
                alt: true,
                key: 'W'
            }
        });
        _this.btnOtroValor = new Ext.Button({
            disabled: true,
            iconCls: 'icondistra-bandera sipac-amarilla',
            tooltip: 'Actualizar % cumplimiento de la(s) ' + (_this.integracionProyecto ? ' tarea(s)' : ' actividad(es)'),
            handler: function () {
                if (_this.integracionProyecto)
                    _this.aprobarTarea(_this.arrayNodeSelected, 2);
                else {
                    var arrayidactividades = [];
                    _this.arrayNodeSelected.forEach(function (item, index) {
                        arrayidactividades[index] = item.id;
                    });
                    var objCmpActividades = new Utilidades.Cmp.Cmpgestionaractividades(
                        {
                            noUsarModificar: true,
                            noUsarEliminar: true,
                            noUsarActivar: true,
                            noUsarDesactivar: true,
                            noUsarCerrarWinP: false,
                            noUsarSeleccionarWinP: false,
                            maxWinPrincipal: false,
                            noUsarCbAprob: true,
                            noUsarGestObser: true,
                            noMostrarColumObser: true,
                            singlemodoSeleccionGridActividades: true,
                            reordenarHijos: true,
                            arrayidactividades: arrayidactividades,
                            noUsarMenuGrid: true,
                            nombrePanel: 'Registro de actividades',
                            idcmp: 'Pert'
                        });
                    objCmpActividades.actualizarCumplimiento(2);
                }
            },
            key: {
                ctrl: true,
                alt: true,
                key: 'W'
            }
        });
        this.aprobarTarea = function (arrayNodeSelected, metodo) {

            msj = 'La tarea ha sido actualizada satisfactoriamente.';
            msjError = 'La tarea no ha sido actualizada.';
            msjAntecedentes = 'La tarea a la que quiere dar cumplimiento depende de otras que la anteceden y no están cumplidas. ¿Desea darle cumplimiento a todas?';
            if (metodo == 1) {
                this.BarraProgreso.show('Actualizando cumplimiento...');
                Ext.Ajax.request({
                    url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
                    params: {
                        arrayidtareas: Ext.encode(arrayNodeSelected)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.respuesta == 1) {
                            mostrarMensaje(1, msj);
                            _this.socketEvents.emit("actualizarPorcientoCumplimientoDesdePert", responseData.arrayidTareas);
                        }
                        if (responseData.respuesta == 3) {
                            mostrarMensaje(1, msjError);
                        }
                        if (responseData.respuesta == 0) {
                            _this.arrayGlobalTareas = responseData.arrayidTareas;
                            _this.smsInformacion(msjAntecedentes);
                        }
                    }
                });
            } else {
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
                                        arrayidtareas: Ext.encode(arrayNodeSelected),
                                        cumplimiento: Ext.get(_this.idcmp + '_nfActCumplimiento').getValue()
                                    },
                                    callback: function (options, success, response) {
                                        _this.BarraProgreso.hide();
                                        responseData = Ext.decode(response.responseText);
                                        if (responseData.respuesta == 1) {
                                            mostrarMensaje(1, msj);
                                            _this.socketEvents.emit("actualizarPorcientoCumplimientoDesdePert", responseData.arrayidTareas);
                                            _this.winActualizarCumplimiento.destroy();
                                        }
                                        if (responseData.respuesta == 3) {
                                            mostrarMensaje(1, msjError);
                                        }
                                        if (responseData.respuesta == 0) {
                                            _this.winActualizarCumplimiento.destroy();
                                            _this.arrayGlobalTareas = responseData.arrayidTareas;
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
                _this.winActualizarCumplimiento.show();
            }

        };

        this.smsInformacion = function (msjAntecedentes) {
            Ext.MessageBox.show({
                title: 'Información',
                msg: msjAntecedentes,
                buttons: Ext.MessageBox.YESNO,
                fn: showOptions,
                animEl: 'mb4',
                icon: Ext.MessageBox.INFO
            });
        };

        function showOptions(btn) {
            if (btn == 'yes') {
                _this.aprobarAnteceden();
            }
        }
        ;
        this.aprobarAnteceden = function () {
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimientoTareasAnteceden',
                params: {
                    arrayidtareas: Ext.encode(_this.arrayGlobalTareas)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.respuesta == 1) {
                        mostrarMensaje(1, msj);
                        _this.socketEvents.emit("actualizarPorcientoCumplimientoDesdePert", responseData.arrayidTareas);
                    }
                }
            });
        };
        _this.btnAyuda = new Ext.Button({
            text: 'Ayuda',
            iconCls: 'ayuda',
            disabled: false,
            key: {
                alt: true,
                key: 'H'
            },
            scope: this
        });
        if (_this.winDatosPlan) {
            _this.winDatosPlan.destroy();
        }
        _this.btnVerInformacion = new Ext.Button({
            iconCls: 'verficha',
            id: this.idcmp + '_btnVerInformacion',
            tooltip: 'Mostrar los datos asociados al diagrama',
            listeners: {
                click: function (btn, event) {
                    _this.posicicionXVentanaDatosPlan = event.getPageX();
                    _this.posicicionYVentanaDatosPlan = event.getPageY();
                }
            },
            handler: function () {
                _this.ConstruirVentanaDatosPlan();
            }
        });
        _this.btnVerReporteObjetivos = new Ext.Toolbar.MenuButton({
            iconCls: 'crearreporte',
            tooltip: 'Obtener matriz',
            menu: {
                items: [
                    {
                        text: 'MATRIZ de Antecedentes',
                        handler: function () {
                            _this.objreporte.GenerarReporte('vp',
                                {
                                    planObjetivos: 1,
                                    idplan: _this.elemento.idelemento,
                                    generarDiagramaDesde: _this.generarDiagramaDesde,
                                    tipoDeMatriz: 10
                                }
                            );
                        },
                        hidden: (_this.generarDiagramaDesde == 'Proyecto') ? false : true,
                        iconCls: 'crearreporte',
                        tooltip: 'Crear el reporte MATRIZ de Antecedentes'
                    }, {
                        text: 'MATRIZ de Secuencia',
                        handler: function () {
                            _this.objreporte.GenerarReporte('vp',
                                {
                                    planObjetivos: 1,
                                    idplan: _this.elemento.idelemento,
                                    generarDiagramaDesde: _this.generarDiagramaDesde,
                                    tipoDeMatriz: 11
                                }
                            );
                        },
                        hidden: (_this.generarDiagramaDesde == 'Proyecto') ? false : true,
                        iconCls: 'crearreporte',
                        tooltip: 'Crear el reporte MATRIZ de Secuencia'
                    }, {
                        text: 'Listado de actividades',
                        handler: function () {
                            _this.objreporte.GenerarReporte('vp',
                                {
                                    planObjetivos: 1,
                                    idplan: _this.elemento.idelemento,
                                    generarDiagramaDesde: _this.generarDiagramaDesde
                                }
                            );
                        },
                        hidden: (_this.generarDiagramaDesde == 'Proyecto') ? true : false,
                        iconCls: 'crearreporte',
                        tooltip: 'Crear el reporte con los objetivos estrategicos'
                    }

                ]
            }
        });
        _this.btnEjecutar = new Ext.Button({
            iconCls: 'tributar',
            id: this.idcmp + '_btnEjecutar',
            tooltip: 'Ejecución de tareas',
            hidden: _this.integracionProyecto ? false : true,
            handler: function () {
                _this.WinEjecutar.show();
                _this.stEjecutar.load();
            }
        });
        _this.btnExportarImg = new Ext.Toolbar.MenuButton({
            iconCls: 'exportar',
            id: this.idcmp + 'btnExportarImg',
            tooltip: 'Exportar diagrama de Pert',
            menu: {
                items: [
                    {
                        text: 'Exportar Diagrama de Pert',
                        handler: function () {
                            exportarImagen({idImage: 'diagramaPert', denom: _this.elemento.denominacion});
                        },
                        iconCls: 'exportar',
                        tooltip: 'Exportar diagrama'
                    }, {
                        text: 'Exportar Diagrama de Pert Fragmentado',
                        handler: function () {
                            generateImages(2000, 2000);
                        },
                        iconCls: 'exportar',
                        tooltip: 'Exportar diagrama fragmentado'
                    }

                ]
            }
        });

        _this.btnGenerarCompresion = (_this.integracionProyecto) ?
            new Ext.Button({
                iconCls: 'reevaluacion',
                // disabled: true,
                handler: function () {
                    _this.objcompresionProyecto.crearWinCompresion(_this.obj_plantilla, _this.arrayAsociativoCompresion);
                },
                tooltip: 'Generar compresi&oacute;n del proyecto',
                key: {
                    ctrl: true,
                    key: 'P'
                },
                scope: this
            })
            : '';

        _this.btnRelaciones = new Ext.Button({
            disabled: true,
            handler: function () {
                _this.idtareaSub = _this.idNodeSelected;
                _this.relacionar = true;
                //_this.relacionarTarea();
            },
            iconCls: 'gestionarrelaciones',
            tooltip: 'Relacionar tarea(s)',
            id: this.idcmp + 'btnRelacionarActDesdePert'
        });

        _this.btnEliminarRelaciones = new Ext.Button({
            disabled: true,
            handler: function () {
                var infoLink = {
                    from: _this.idNodeFrom,
                    to: _this.idNodeTo
                }
                _this.eliminarRelacionEntreTarea(infoLink);
            },
            iconCls: 'eliminar',
            tooltip: 'Eliminar relaciones de la(s) ' + (_this.integracionProyecto) ? 'tarea(s)' : 'actividad(es)',
            id: this.idcmp + 'btnEliminarRelaciones'
        });

        function exportarImagen(obj) {
            var me = this;
            var windexportar = new Planificacion.Integracion.ExportarWindowImage({
                controller: me.controller,
                idImage: obj.idImage,
                diagrama: ' DE PERT ',
                denominacion: obj.denom,
                closable: true,
                flujo: true,
                matrix: me
            });
            windexportar.show();
        }

        function generateImages(width, height) {
            // sanitize input
            width = parseInt(width);
            height = parseInt(height);
            if (isNaN(width))
                width = 100;
            if (isNaN(height))
                height = 100;
            // Give a minimum size of 50x50
            width = Math.max(width, 50);
            height = Math.max(height, 50);
            //var imgDiv = document.getElementById('diagramaPert');
            //imgDiv.innerHTML = ''; // clear out the old images, if any
            var db = _this.diagramaPert.documentBounds.copy();
            var boundswidth = db.width;
            var boundsheight = db.height;
            var imgWidth = width;
            var imgHeight = height;
            var p = db.position.copy();
            for (var i = 0; i < boundsheight; i += imgHeight) {
                for (var j = 0; j < boundswidth; j += imgWidth) {
                    img = _this.diagramaPert.makeImage({
                        scale: 1,
                        position: new go.Point(p.x + j, p.y + i),
                        size: new go.Size(imgWidth, imgHeight),
                        background: "white",
                        type: "image/jpeg"
                    });
                    var newWindow = window.open("", "Imagen Generada");
                    if (!newWindow) {
                        console.log('No se ha podido exportar el Diagrama!');
                        return;
                    } else {
                        newWindow.document.title = 'Diagrama de Pert Fragmentado';
                    }
                    //var newDocument = newWindow.document;
                    //newWindow.document.body.text = 'sad';
                    newWindow.document.body.appendChild(img);
                    newWindow.document.body.appendChild(document.createElement('br'));
                }
            }
        }


        /*_this.btnVerReporteObjetivos = new Ext.Button({
         iconCls: 'crearreporte',
         tooltip: 'Crear el reporte con los objetivos estrategicos',
         handler: function() {
         _this.objreporte.GenerarReporte('vp',
         {
         planObjetivos: 1,
         idplan: _this.elemento.idelemento,
         generarDiagramaDesde: _this.generarDiagramaDesde
         }
         );
         }
         });*/
        _this.btnVerVistaAmpliada = new Ext.Button({
            iconCls: 'buscar',
            tooltip: 'Habilitar vista ampliada sobre el diagrama',
            handler: function () {
                _this.MostrarVistaAmpliada();
            }
        });

        if (_this.generarDiagramaDesde == 'Plan') {
            _this.stcbAgruparPorPlan = new Ext.data.SimpleStore({
                fields: ['key', 'text', 'isGroup', 'color'],
                data: [
                    [_this.elemento.idelemento, _this.elemento.denominacion, true, '#5F5F5F']
                ]
            });
        }

        var url = (_this.integracionProyecto) ? 'obtenerHitosDadoProyecto' : 'obtenerPlanes';
        _this.stcbAgruparPorHistos = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpdiagramapert/' + url,
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [{
                name: 'key'
            }, {
                name: 'text'
            }]),
            listeners: {
                beforeload: function (st, opts) {
                    st.baseParams.idproyecto = _this.elemento.idelemento;
                }
            }
        });
        _this.cbAgruparPorHistos = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            //width: 150,
            width: 300,
            align: 'right',
            mode: 'local',
            store: (_this.generarDiagramaDesde != 'Plan') ? _this.stcbAgruparPorHistos : _this.stcbAgruparPorPlan,
            valueField: 'key',
            displayField: 'text',
            triggerAction: 'all',
            emptyText: 'Agrupar tareas ' + (_this.integracionProyecto ? 'por hito..' : 'por plan..'),
            listWidth: '40%',
            typeAhead: true, /*
             tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>'*/
            listeners: {
                expand: function (combo) {
                    // _this.stcbAgruparPorHistos.reload();
                },
                select: function (combo, record, index) {
                    if (record.data.checked == true)
                        for (var j = 0; j < _this.arrayGruposHitos.length; j++) {
                            if (_this.arrayGruposHitos[j].key == record.data.key) {
                                _this.actividadesPert[_this.actividadesPert.length] = _this.arrayGruposHitos[j];
                                _this.diagramaPert.model.clear();
                                _this.diagramaPert.model = new go.GraphLinksModel(_this.actividadesPert, _this.arrayRelaciones);
                                _this.diagramaPert.select(_this.diagramaPert.findNodeForKey(_this.arrayGruposHitos[j].key));
                                break;
                            }
                        }
                    else {
                        var arraycollNodos = [];
                        for (var i = 0; i < _this.arrayGruposHitos.length; i++) {
                            if (_this.arrayGruposHitos[i].key == record.data.key) {
                                arraycollNodos[0] = _this.arrayGruposHitos[i];
                            }
                        }
                        _this.diagramaPert.model.removeNodeDataCollection(arraycollNodos);
                        _this.diagramaPert.updateAllTargetBindings();
                    }
                }
            }
        });
        //combo para seleccionar la unidad de tiempo
        _this.stcbUnidadTiempo = new Ext.data.SimpleStore({
            fields: ['idunidad', 'denominacion'],
            data: [
                ['Y', 'Annos'],
                ['m', 'Meses'],
                ['w', 'Semanas'],
                ['d', 'Dias'],
                ['H', 'Horas'],
                ['i', 'Minutos'],
                ['all', 'Todas las combinaciones']
            ]
        });
        _this.cbUnidadTiempo = new Ext.form.ComboBox({
            store: _this.stcbUnidadTiempo,
            displayField: 'denominacion',
            value: 'i',
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            valueField: 'idunidad',
            width: 150,
            emptyText: '--Seleccione la unida de tiempo--',
            listeners: {
                select: function (combo, record, index) {
// _this.CargarConceptoAGraficar(combo.getValue());
                }
            }
        });
        //panel que contiene el diagrama(ubicado al centro)
        _this.PanDiagramaPrincipal = new Ext.Panel({
            layout: 'fit',
            region: 'center',
            width: '100%',
            border: false,
            tbar: [/*'-','Ver duracion en ',' ', _this.cbUnidadTiempo,'-',' ',*/' ', _this.btnVerInformacion, _this.btnVerReporteObjetivos,
                _this.btnExportarImg, '-', _this.btnEjecutar, _this.btnGenerarCompresion, '-', _this.btn100, _this.btnOtroValor, '-', _this.cbAgruparPorHistos, '-', _this.btnRelaciones, _this.btnEliminarRelaciones, '->', _this.btnAyuda],
            html: '<div id="contenedorDiagramaPert" style=" width:100%; height:100%;position: relative;">' +
            '<div id="diagramaPert" style=" width:100%; height:100%">' +
            '</div>' +
            '<div id="capaVistaAmpliada"></div>' +
            '</div>'
        });
        this.stEjecutar = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
            url: '/planificacion/pdo/plan/index.php/cmpdiagramapert/cargarTareasAEjecutar',
            autoLoad: false,
            reader: new Ext.data.JsonReader({
                id: 'id',
                root: "campos",
                totalProperty: "total"
            }, [
                {
                    name: 'denominacion'
                }, {
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'gradocumplimiento'
                }, {
                    name: 'autor'
                }, {
                    name: 'idelemento'
                }, {
                    name: 'idtipoelemento'
                }, {
                    name: 'idautor'
                }
            ]),
            listeners: {
                beforeload: function (st) {
//_this.BarraProgreso.show('Cargando');
                    st.baseParams.idproyecto = _this.elemento.idelemento;
                },
                load: function (st) {
                    st.each(function (record) {
                        Ext.get(record.data.idelemento).addListener('click', _this.EjecutarCumplimiento, this, {
                            stopPropagation: true,
                            normalized: true,
                            preventDefault: true,
                            store: st,
                            record: record
                        });
                    });
                }
            }
        });
        this.smEjecutar = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function (sm, ri, record) {
                },
                rowdeselect: function (sm, ri, record) {
                }
            }
        });
        this.cmEjecutar = [
            _this.smEjecutar,
            {
                header: "CAR",
                width: 120,
                dataIndex: 'idelemento',
                sortable: true
            },
            {
                id: 'expandir',
                header: "Denominación",
                width: 170,
                sortable: true,
                dataIndex: 'denominacion',
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Ejecutar cumplimiento",
                width: 120,
                dataIndex: 'gradocumplimiento',
                sortable: true,
                renderer: RealizarEjecucion
            }, /* {
             header: "Activo",
             dataIndex: 'activo',
             width: 80,
             sortable: true,
             renderer: MostrarImagenActivo
             }*/];
        this.paginadoEjec = new Ext.ux.maximgb.treegrid.PagingToolbar({
            id: "paginadoEjec",
            pageSize: 15,
            store: _this.stEjecutar,
            displayInfo: true,
            listeners: {
                beforechange: function (paginado, evento) {
                    _this.pgactual = evento.start;
                    _this.start = evento.start;
                }
            }
        });
        this.gdEjecutar = new Ext.ux.maximgb.treegrid.GridPanel({
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            //plugins: _this.filtrosEjecutar,
            autoExpandColumn: 'expandir',
            autoExpandMax: 250,
            store: _this.stEjecutar,
            sm: _this.smEjecutar,
            columns: _this.cmEjecutar,
            width: 600,
            bbar: _this.paginadoEjec,
            listeners: {
                rowdblclick: function (t, ri, event) {
                },
                rowcontextmenu: function (t, ri, e) {
                },
                cellclick: function (grid, rowIndex, columnIndex, e) {
                }
            }
        });
        _this.WinEjecutar = new Ext.Window({
            title: 'Ejecución de tareas ',
            layout: 'fit',
            closable: true,
            closeAction: 'hide',
            draggable: false,
            maximized: false,
            modal: true,
            width: 600,
            height: 510,
            items: _this.gdEjecutar,
            listeners: {
                destroy: function (win) {
                }
            },
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    //hidden: opcionesConfig.noUsarCerrarWinP,
                    iconCls: 'cerrar',
                    handler: function () {
                        _this.WinEjecutar.hide();
                    }
                }
            ]
        });
        //panel principal de la vista
        _this.PanPrincipal = new Ext.Panel({
            layout: 'border',
            items: [_this.PanDiagramaPrincipal]

        });
        //ventana principal de la vista
        _this.WinPrincipal = new Ext.Window({
            title: _this.opcionesConfig.titleWinPrincipal,
            layout: 'fit',
            closable: !_this.opcionesConfig.noUsarCerrarWinP,
            closeAction: 'destroy',
            draggable: false,
            id: 'winPrincipalPert',
            maximized: _this.opcionesConfig.maxWinPrincipal,
            modal: true,
            width: 1000,
            height: 510,
            items: _this.PanPrincipal,
            listeners: {
                destroy: function (win) {
                    if (_this.winDatosPlan) {
                        _this.winDatosPlan.destroy();
                    }
                },
                render: function () {
                    setTimeout(function () {
                        _this.WinPrincipal.focus();
                    }, 500);
                }
            },
            buttons: [
                {
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    hidden: opcionesConfig.noUsarCerrarWinP,
                    iconCls: 'cerrar',
                    handler: function () {
                        _this.WinPrincipal.destroy();
                        _this.WinEjecutar.destroy();
                        _this.socketEvents.on('disconnect', function () {
                        });
                    }
                }
            ]
        });
    };

    /******
     *
     * ****/

    this.ConstruirVentanaDatosPlan = function () {
        if (_this.winDatosPlan) {
            _this.winDatosPlan.destroy();
        }
        var duracionPlanMinutos = 0;
        //html donde se muestran los datos del camino critico
        var htmlRC_Vectores = '';
        var htmlRC_Sumas = '';
        var htmlTotalActYEventos = '';
        var tiempoestimado = 0;
        var equivalencia = 0
        var html = '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
        for (var i = 0; i < _this.elemento.caminoCritico.length; i++) {
            html += '<label style="font-weight: bold;color: red">RC = </label>';
            htmlRC_Vectores += '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
            htmlRC_Vectores += '<label style="font-weight: bold;color: red">RC = </label>';
            htmlRC_Sumas += '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
            htmlRC_Sumas += '<label style="font-weight: bold;color: red">RC = </label>';
            htmlTotalActYEventos += '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
            htmlTotalActYEventos += '<label style="font-weight: bold">TOTAL DE ACTIVIDADES: ' + '<label style="font-weight: bold;color: red">' + _this.elemento.actividadesPert.length + '</label></label>';
            htmlTotalActYEventos += '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
            htmlTotalActYEventos += '<label style="font-weight: bold">TOTAL DE RELACIONES: ' + '<label style="font-weight: bold;color: red">' + _this.elemento.relacionesPert.length + '</label></label>';
            htmlTotalActYEventos += '<div style="font-size:16px;padding:12px 0px;float:left;text-align:center;margin-top:20px;border-top:1px solid #DEDEDE;width:100%;">';
            htmlTotalActYEventos += '<label style="font-weight: bold">TOTAL DE ACTIVIDADES EN PARALELO: ' + '<label style="font-weight: bold;color: red">' + ((_this.elemento.cantTareasParalelas) ? _this.elemento.cantTareasParalelas : 0) + '</label></label>';
            var camino = _this.elemento.caminoCritico[i].camino;
            var duracion = parseFloat(camino[0].tiempoestimado); // * 60; 
            for (var j = 0; j < camino.length; j++) {
                if (j > 0) {
                    duracion = duracion + parseFloat(camino[j].tiempoestimado); // * 60);
                }
                var signo = ' + ';
                var tiempo = '';
                if (j == (camino.length - 1)) {
                    signo = '';
                }
                html += '<label>' + camino[j].numero + '</label>';
                html += '<label>(' + Math.round(duracion) /*camino[j].duracion*/ + ' minutos)</label>';
                html += signo;
                tiempoestimado = parseFloat(camino[j].tiempoestimado); // * 60;
                equivalencia = _this.MostrarDuracionPlan(tiempoestimado);
                if (tiempoestimado >= 60) {
                    if (_this.equivalencia.equivalenciaDias != 0)
                        tiempo = parseInt(_this.equivalencia.equivalenciaDias) + ' dias';
                    else
                        tiempo = '';
                    if (_this.equivalencia.equivalenciaHoras != 0)
                        tiempo += ' ' + parseInt(_this.equivalencia.equivalenciaHoras) + ' horas';
                    else
                        tiempo += '';
                    if (_this.equivalencia.restoMinutos != 0)
                        tiempo += ' ' + Math.round(_this.equivalencia.restoMinutos) + ' min';
                    else
                        tiempo += '';
                } else {
                    tiempo = Math.round(tiempoestimado) + ' min';
                }

                htmlRC_Sumas += '<label style="color: red">' + tiempo + signo + '</label>';
                if (j == 0) {
                    htmlRC_Vectores += '<label style="color: red">(' + camino[j].numero + ', ' + ((camino[j + 1]) ? camino[j + 1].numero : '') + ')</label>';
                } else if (j != (camino.length - 1)) {
                    htmlRC_Vectores += '<label style="color: red"> + (' + camino[j].numero + ', ' + ((camino[j + 1]) ? camino[j + 1].numero : '') + ')</label>';
                }
            }

            html += '<label style="font-weight: bold;color: red"> = </label>';
            var duracionMinutos = _this.elemento.caminoCritico[i].duracion;
            html += '<label>' + Math.round(duracion)/*duracionMinutos*/ + ' minutos</label>';
            var equivalenciaHoras = duracion /*duracionMinutos*/ / (60);
            html += '<label style="font-weight: bold;color: red"> &tilde;</label>';
            html += '<label>' + equivalenciaHoras + ' horas</label>';
            duracionPlanMinutos = duracion;
            var duracionPlanTotal = _this.MostrarDuracionPlan(duracionPlanMinutos);
        }

        html += htmlRC_Vectores + htmlRC_Sumas + htmlTotalActYEventos + '</div>';
        //panel para mostrar los datos del plan
        _this.pDatosPlan = new Ext.Panel({
            layout: 'fit',
            html: "<div style='width: 100%;float:left;height: 100%;font: Arial;padding:10px;'>" +
            "<div style='width:100%;height:30px ;float:left;text-align: center;font-size:13px; text-decoration: underline;color: black;'>" +
            _this.elemento.denominacion +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: right;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Inicia </label> : " +
            "<label style='color: black;'>" + _this.elemento.fechainicio + "</label>" +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: center;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Termina </label> : " +
            "<label style='color: black;'>" + _this.elemento.fechafin + "</label>" +
            "</div>" +
            "<div style='width:33%;height:30px ;float:left;text-align: left;font-size:13px; '>" +
            "<label style='text-decoration: underline;color: black;font-weight: bold;'>Duración </label> : " +
            "<label style='color: black;'>" + parseInt(duracionPlanMinutos)/*_this.elemento.duracionPlan*/ + " minutos</label> " +
            "<label style='color: black;'>( " + duracionPlanTotal /*_this.elemento.duracionPlanTotal*/ + " )</label> " +
            "</div>" +
            html +
            "</div> "
        });
        //ventana para mostrar los datos del plan
        _this.winDatosPlan = new Ext.Window({
            layout: 'fit',
            title: 'Datos del Proyecto',
            closable: true,
            closeAction: 'destroy',
            draggable: true,
            resizable: true,
            width: '75%',
            height: '80%',
            modal: true,
            border: false,
            animateTarget: this.idcmp + '_btnVerInformacion',
            x: _this.posicicionXVentanaDatosPlan,
            y: (_this.posicicionYVentanaDatosPlan + 15),
            collapsible: true,
            items: [_this.pDatosPlan],
            listeners: {}
        });
        _this.winDatosPlan.show();
    };
    this.CargarCmpPert = function (idTipoElemento, elemento, obj_plantilla) {
        //console.log('info del proyecto', elemento);
        _this.obj_plantilla = obj_plantilla;
        _this.arrayAsociativoCompresion = [];
        _this.arrayAsociativoCompresion.push({
            idproyecto: elemento.idelemento,
            denproyecto: elemento.denominacion,
            fechainicio: elemento.fechainicio,
            gradocumplimiento: elemento.gradocumplimiento,
            duracionestimada: elemento.duracionestimada,
            fechafin: elemento.fechafin
        });
        _this.idTtipoElemento = idTipoElemento;
        _this.elemento = elemento;

        _this.ConstruirComponentesVisuales();
        _this.ObtenerDatosDiagrama('Generando diagrama...');
        if (_this.opcionesConfig.tipoComponente == 'panel') {
            return _this.PanPrincipal;
        } else {
            _this.WinPrincipal.show();
        }
    };

    this.ObtenerDatosDiagrama = function (mensajeEspera) {
        _this.BarraProgreso.show(mensajeEspera);
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpdiagramapert/obtenerActividadesPert',
            params: {
                idTipoElemento: _this.idTtipoElemento,
                elemento: Ext.encode(_this.elemento),
                generarDiagramaDesde: _this.generarDiagramaDesde,
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                var actividadesPert = responseData.actividadesPert;
                var relacionesPert = responseData.relacionesPert;
                var duracionPlan = responseData.duracionPlan;
                var duracionPlanTotal = responseData.duracionPlanTotal;
                var caminoCritico = responseData.caminoCritico;
                var cantTareasParalelas = responseData.cantTareasParalelas;
                var arrayGruposHitos = responseData.arrayGrupoHitos;
                _this.arrayGruposHitos = arrayGruposHitos;
                _this.elemento.duracionPlan = duracionPlan;
                _this.elemento.duracionPlanTotal = duracionPlanTotal;
                _this.elemento.caminoCritico = caminoCritico;
                _this.elemento.relacionesPert = relacionesPert;
                _this.elemento.actividadesPert = actividadesPert;
                _this.elemento.cantTareasParalelas = cantTareasParalelas;
                if (opcionesConfig.criticas != undefined) {
                    var criticas = [];
                    for (var i = 0; i < actividadesPert.length; i++) {
                        if (actividadesPert[i].critical) {
                            criticas.push(actividadesPert[i]);
                        }
                    }
                    actividadesPert = criticas;
                }

                _this.calcularHolguraRealPorActividad(actividadesPert, relacionesPert);
                var arrayTareasAgrupadas = _this.agregarGruposHitosADiagrama(actividadesPert, arrayGruposHitos);
                _this.actividadesPert = actividadesPert;
                _this.arrayRelaciones = relacionesPert;

                if (_this.elemento.plantilla == 0) {
                    _this.ConstruirDiagrama(actividadesPert, relacionesPert);
                }
                else {
                    _this.ConstruirDiagramaParaUnaPlantilla(actividadesPert, relacionesPert);
                }
                if (!actividadesPert || actividadesPert.length == 0) {
                    _this.btnVerInformacion.disable();
                    _this.btnEjecutar.disable();
                    _this.btnExportarImg.disable();
                }

                _this.BarraProgreso.hide();
            }
        });
    };
    this.ConstruirDiagrama = function (actividadesPert, relacionesPert) {

        /*
         *  primero se genera el diagrama principal
         * */
        var $ = go.GraphObject.make;
        _this.diagramaPert =
            $(go.Diagram, "diagramaPert",
                {
                    initialAutoScale: go.Diagram.Uniform,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.hoverDelay": 100,
                    layout: $(go.LayeredDigraphLayout),
                    // allow Ctrl-G to call groupSelection()
                    "commandHandler.archetypeGroupData": {text: "Grupo", isGroup: true, color: "blue"},
                    // enable undo & redo
                    "undoManager.isEnabled": true
                }
            );

        function nodeInfo(d) {  // Tooltip info for a node data object
            var str = d.text + "\n" + "" + d.fechainicio + "\n" + "" + d.fechafin + "\n" + "Duracion : " + _this.MostrarDuracionEstimada(d.tiempoestimado) + "\n" + d.gradocumplimiento + "% de cumplimiento" + "\n" + /*"Tiempo previo : " +*/ d.tiempoprevio + "\n" + "Descripción : " + d.descelemento; //
            return str;
        }

        function makeButton(text, action, visiblePredicate) {
            return $("ContextMenuButton",
                $(go.TextBlock, text),
                {click: action},
                // don't bother with binding GraphObject.visible if there's no predicate
                visiblePredicate ? new go.Binding("visible", "", visiblePredicate).ofObject() : {});
        }

// a context menu is an Adornment with a bunch of buttons in them
        var partContextMenu =
            $(go.Adornment, "Vertical",
                makeButton("Propiedades",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        if (part instanceof go.Link)
                            alert(linkInfo(part.data));
                        else if (part instanceof go.Group)
                            alert(groupInfo(contextmenu));
                        else
                            alert(nodeInfo(part.data));
                    }),
                makeButton("Eliminar relacion",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        if (part instanceof go.Link) {
                            //console.log(part.data);
                            _this.eliminarRelacionEntreTarea(part.data);
                        }
                    }),
                makeButton("Relacionar con",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        _this.idtareaSub = _this.idNodeSelected;
                        _this.relacionar = true;
                    }),
                makeButton("Deshacer",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
                makeButton("Rehacer",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    }),
                makeButton("Grupo",
                    function (e, obj) {
                        e.diagram.commandHandler.groupSelection();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canGroupSelection();
                    }),
                makeButton("Desagrupar",
                    function (e, obj) {
                        e.diagram.commandHandler.ungroupSelection();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUngroupSelection();
                    })
            );
        _this.diagramaPert.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", // the border
                    {fill: "white"},
                    new go.Binding("stroke", "critical",
                        function (b) {
                            _this.critical = b;
                            return (b ? "red" : "blue");
                        })),
                $(go.Panel, "Table", {padding: 0.5},
                    $(go.RowColumnDefinition, {
                        column: 0,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 0,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"},
                        new go.Binding("background", "es", ColorEstadoDeCumpliemto)),
                    $(go.RowColumnDefinition, {
                        row: 2,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"},
                        new go.Binding("background", "es", ColorEstadoDeCumpliemto)),
                    $(go.RowColumnDefinition, {
                        row: 4,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {
                        row: 6,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 5, separatorStroke: "black"},
                        new go.Binding("background", "es", ColorEstadoDeCumpliemto)),
                    $(go.TextBlock,
                        new go.Binding("text", "numero"),
                        {row: 2, column: 0, margin: 5, textAlign: "center", font: " bold 20px arial"}),
                    $(go.TextBlock,
                        new go.Binding("text", "fechaInicialOptimista"),
                        {row: 1, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "holgura", _this.MostrarDuracionEstimada),
                        {row: 1, column: 2, margin: 5, textAlign: "center"/*, editable:true*/}),
                    $(go.TextBlock, // earlyFinish
                        new go.Binding("text", "fechaFinalOptimista"),
                        {row: 1, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "text"),
                        {
                            row: 0,
                            column: 1,
                            columnSpan: 3,
                            margin: 5,
                            textAlign: "left",
                            font: "bold 14px sans-serif",
                            wrap: go.TextBlock.WrapFit,
                            maxSize: new go.Size(200, NaN)
                        }),
                    $(go.TextBlock, // lateStart
                        new go.Binding("text", "fechaInicialPesimista"),
                        {row: 3, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, // slack
                        new go.Binding("text", "tiempoestimado", _this.MostrarDuracionEstimada),
                        {row: 3, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "fechaFinalPesimista"),
                        {row: 3, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "fechainicio"),
                        {row: 2, column: 0, columnSpan: 4, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "fechafin"),
                        {
                            row: 4, column: 0, columnSpan: 4, margin: 5,
                            textAlign: "center"
                        }),
                    $(go.TextBlock,
                        new go.Binding("text", "tiempoprevio"),
                        {
                            row: 6, column: 0, columnSpan: 4, margin: 5,
                            textAlign: "center"
                        }),
                    $(go.TextBlock,
                        new go.Binding("text", "tiempooptimista", _this.MostrarDuracionEstimada),
                        {row: 5, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "tiempomedio", _this.MostrarDuracionEstimada),
                        {row: 5, column: 2, margin: 5, textAlign: "center"/*, editable:true*/}),
                    $(go.TextBlock, // earlyFinish
                        new go.Binding("text", "tiempopesimista", _this.MostrarDuracionEstimada),
                        {row: 5, column: 3, margin: 5, textAlign: "center"})
                ),
                {// this tooltip Adornment is shared by all nodes
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", nodeInfo))
                    ),
                    // this context menu Adornment is shared by all nodes
                    contextMenu: partContextMenu
                }, {
                    doubleClick: function (e, node) {
                        var arrayIdElementos = [];
                        arrayIdElementos[0] = node.data.key;
                        if (_this.tipoelemento == 3) {
                            _this.objCmpCrudActividad.CrearWinCrudActividades(
                                new Date().format('d/m/Y'),
                                new Date().format('d/m/Y'),
                                _this.horainicio,
                                _this.horafin,
                                'Modificar',
                                _this.ActualizarDiagrama,
                                arrayIdElementos,
                                node.data.idautor,
                                eshija = 0, permisomodificar = 1,
                                permisoeliminar = 1,
                                [],
                                null,
                                null, null,
                                node.data.gradocumplimiento,
                                null,
                                null);
                        }
                        if (_this.tipoelemento == 10) { //Crud tarea
                        }
                    }
                }
            ); // end Node

        function linkColorConverter(linkdata, elt) {
            var link = elt.part;
            if (!link)
                return "blue";
            var f = link.fromNode;
            if (!f || !f.data || !f.data.critical)
                return "blue";
            var t = link.toNode;
            if (!t || !t.data || !t.data.critical)
                return "blue";
            return "red"; // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }

        function ancholink(linkdata, elt) {
            var link = elt.part;
            if (!link)
                return 1;
            var f = link.fromNode;
            if (!f || !f.data || !f.data.critical)
                return 1;
            var t = link.toNode;
            if (!t || !t.data || !t.data.critical)
                return 1;
            return 4; // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }

        function ColorEstadoDeCumpliemto(b) {
            if (b == 5)
                return "#0099FF";
            else if (b == 4)
                return "#FF9F9F"
            else if (b)
                return "#55d822"
            else if (b == false)
                return "#FFCC00";
            else
                return "white";
        }

        function linkInfo(d) {  // Tooltip info for a link data object
            return "Evento:\nDesde " + _this.diagramaPert.model.findNodeDataForKey(d.from).text + '.' + " hasta " + _this.diagramaPert.model.findNodeDataForKey(d.to).text;
        }

        _this.diagramaPert.linkTemplate =
            $(go.Link,
                $(go.Shape,
                    new go.Binding("strokeWidth", "", ancholink),
                    new go.Binding("stroke", "", linkColorConverter)),
                $(go.Shape, // arrowhead
                    {toArrow: "Standard", stroke: null},
                    new go.Binding("strokeWidth", "", ancholink),
                    new go.Binding("stroke", "", linkColorConverter)),
                {// this tooltip Adornment is shared by all links
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling linkInfo(data)
                            new go.Binding("text", "", linkInfo))
                    ),
                    // the same context menu Adornment is shared by all links
                    contextMenu: partContextMenu
                });

        //Template para agrupar.

        function groupInfo(adornment) {  // takes the tooltip or context menu, not a group node data object
            var g = adornment.adornedPart; // get the Group that the tooltip adorns
            var mems = g.memberParts.count;
            var links = 0;
            //console.log(g.Eh.key);
            g.memberParts.each(function (part) {
                if (part instanceof go.Link)
                    links++;
            });
            return "Grupo: " + g.data.text + "\n" + _this.cantidadTareasDadoHito(g.Eh.key) + " tareas incluidas";
        }

        function diagramInfo(model) {  // Tooltip info for the diagram's model
            return "Modelo:\n" + model.nodeDataArray.length + " nodos, " + model.linkDataArray.length + " eventos";
        }

        _this.diagramaPert.groupTemplate =
            $(go.Group, "Vertical",
                {
                    selectionObjectName: "PANEL", // selection handle goes around shape, not label
                    ungroupable: true,
                    layout: $(go.LayeredDigraphLayout)
                }, // enable Ctrl-Shift-G to ungroup a selected Group
                $(go.TextBlock,
                    {
                        font: "bold 19px arial",
                        isMultiline: false, // don't allow newlines in text
                        editable: true  // allow in-place editing by user
                    },
                    new go.Binding("text", "text").makeTwoWay(),
                    new go.Binding("stroke", "color")),
                $(go.Panel, "Auto", {name: "PANEL"},
                    $(go.Shape, "Rectangle", {fill: "white"}),
                    $(go.Placeholder, {padding: 20})  // represents where the members are
                ),
                {// this tooltip Adornment is shared by all groups
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4},
                            // bind to tooltip, not to Group.data, to allow access to Group properties
                            new go.Binding("text", "", groupInfo).ofObject())
                    ),
                    // the same context menu Adornment is shared by all groups
                    contextMenu: partContextMenu
                });
        _this.diagramaPert.contextMenu =
            $(go.Adornment, "Vertical",
                makeButton("Pegar",
                    function (e, obj) {
                        e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
                    },
                    function (o) {
                        return o.diagram.commandHandler.canPasteSelection();
                    }),
                makeButton("Deshacer",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
                makeButton("Rehacer",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    })
            );
        _this.diagramaPert.model = new go.GraphLinksModel(actividadesPert, relacionesPert);
        // Leyenda
        _this.diagramaPert.add(
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle", {fill: "#DDF4FF"}),
                $(go.Panel, "Table", {padding: 1},
                    $(go.RowColumnDefinition, {
                        column: 0,
                        separatorStroke: "black",
                        background: "#B9E9FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 0,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 2,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 4,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 5, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 6,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.TextBlock, "No. del Nodo",
                        {row: 2, column: 0, margin: 5, textAlign: "center", font: " bold 15px arial"}),
                    $(go.TextBlock, "Fecha y hora incicial optimista",
                        {row: 1, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Holgura",
                        {row: 1, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Fecha y hora final optimista",
                        {row: 1, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Denominación de la tarea",
                        {
                            row: 0,
                            column: 1,
                            columnSpan: 3,
                            margin: 5,
                            textAlign: "center",
                            font: "bold 14px sans-serif"
                        }),
                    $(go.TextBlock, "Fecha inicial pesimista",
                        {row: 3, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo estimado",
                        {row: 3, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Fecha final pesimista",
                        {row: 3, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Fecha y hora en que inicia la tarea",
                        {row: 2, column: 0, columnSpan: 4, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Fecha y hora en que termina la tarea",
                        {row: 4, column: 0, columnSpan: 4, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo optimista",
                        {row: 5, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo medio",
                        {row: 5, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo pesimista",
                        {row: 5, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo previo de la tarea",
                        {row: 6, column: 0, columnSpan: 4, margin: 5, textAlign: "center"})
                )
            ));
        _this.diagramaPert.add(
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle", {fill: "white"}),
                $(go.Panel, "Table", {padding: 1, defaultSeparatorPadding: 3},
                    $(go.RowColumnDefinition, {column: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"}),
                    $(go.TextBlock, "Tarea cumplida",
                        {row: 0, column: 0, margin: 5, textAlign: 'left', alignment: go.Spot.Left}),
                    $(go.TextBlock, "Tarea parcialmente cumplida",
                        {row: 1, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),
                    $(go.TextBlock, "Tarea incumplida",
                        {row: 2, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),
                    $(go.TextBlock, "Tarea en ejecución",
                        {row: 3, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),
                    $(go.TextBlock, "      ",
                        {row: 0, column: 1, margin: 5, textAlign: "center", background: "#55d822"}),
                    $(go.TextBlock, "      ",
                        {row: 1, column: 1, columnSpan: 3, margin: 5, textAlign: "center", background: "#FFCC00"}),
                    $(go.TextBlock, "      ",
                        {row: 2, column: 1, margin: 5, textAlign: "center", background: "#FF9F9F"}),
                    $(go.TextBlock, "      ",
                        {row: 3, column: 1, margin: 5, textAlign: "center", background: "#0099FF"})
                )
            ));
        _this.diagramaPert.addDiagramListener("ObjectSingleClicked",
            function (e) {
                var part = e.subject.part;
                _this.idNodeSelected = part.data.key;
                if (e.diagram.selection.count > 1) {
                    if (part.isSelected) {
                        if (!_this.isChecked(_this.arrayNodeSelected, part.data.key)) {
                            _this.arrayNodeSelected.push({id: part.data.key});
                        }
                    }
                    else {
                        _this.eliminarNodoDeArrayElementosSeleccionados(_this.arrayNodeSelected, part.data.key);
                    }
                } else {
                    _this.arrayNodeSelected = [];
                    _this.arrayNodeSelected.push({id: part.data.key});
                }

                if (e.diagram.selection.count >= 1 && part.isSelected) {

                    if (part instanceof go.Link) {
                        _this.btn100.disable();
                        _this.btnOtroValor.disable();
                        _this.btnRelaciones.disable();
                        _this.btnEliminarRelaciones.enable();
                    }
                    else if (part instanceof go.Group) {
                    }
                    else {
                        _this.btnEliminarRelaciones.disable();
                        _this.btn100.enable();
                        _this.btnOtroValor.enable();
                        _this.btnRelaciones.enable();
                    }
                    if (_this.relacionar) {
                        _this.relacionarTarea();
                        _this.relacionar = false;
                    }

                    if (_this.arrayNodeSelected.length > 1) {
                        _this.btnRelaciones.disable();
                    }
                } else {
                    _this.btn100.disable();
                    _this.btnOtroValor.disable();
                }

                _this.idNodeFrom = part.Eh.from;
                _this.idNodeTo = part.Eh.to;
//                    console.log(part.Eh.from);
//                     console.log(_this.arrayNodeSelected);
            });
        _this.diagramaPert.addDiagramListener("BackgroundSingleClicked",
            function (e) {
                _this.arrayNodeSelected = [];
                _this.btn100.disable();
                _this.btnOtroValor.disable();
                _this.btnRelaciones.disable();
                _this.btnEliminarRelaciones.disable();
            });
    };
    this.ConstruirDiagramaParaUnaPlantilla = function (actividadesPert, relacionesPert) {

        /*
         *  primero se genera el diagrama principal
         * */
        var $ = go.GraphObject.make;
        _this.diagramaPert =
            $(go.Diagram, "diagramaPert",
                {
                    initialAutoScale: go.Diagram.Uniform,
                    initialContentAlignment: go.Spot.Center,
                    "toolManager.hoverDelay": 100,
                    layout: $(go.LayeredDigraphLayout),
                    // allow Ctrl-G to call groupSelection()
                    "commandHandler.archetypeGroupData": {text: "Grupo", isGroup: true, color: "blue"},
                    // enable undo & redo
                    "undoManager.isEnabled": true
                }
            );

        function nodeInfo(d) {  // Tooltip info for a node data object
            var str = d.text + "\n" /*+ "" + d.fechainicio + "\n" + "" + d.fechafin + "\n" */ + "Duracion : " + _this.MostrarDuracionEstimada(d.tiempoestimado) + "\n" /*+ d.gradocumplimiento + "% de cumplimiento" + "\n" + "Tiempo previo : " + d.tiempoprevio + "\n" */ + "Descripción : " + d.descelemento; //
            return str;
        }

        function makeButton(text, action, visiblePredicate) {
            return $("ContextMenuButton",
                $(go.TextBlock, text),
                {click: action},
                // don't bother with binding GraphObject.visible if there's no predicate
                visiblePredicate ? new go.Binding("visible", "", visiblePredicate).ofObject() : {});
        }

// a context menu is an Adornment with a bunch of buttons in them
        var partContextMenu =
            $(go.Adornment, "Vertical",
                makeButton("Propiedades",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        if (part instanceof go.Link)
                            alert(linkInfo(part.data));
                        else if (part instanceof go.Group)
                            alert(groupInfo(contextmenu));
                        else
                            alert(nodeInfo(part.data));
                    }),
                makeButton("Eliminar relacion",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        if (part instanceof go.Link) {
                            //console.log(part.data);
                            _this.eliminarRelacionEntreTarea(part.data);
                        }
                    }),
                makeButton("Relacionar con",
                    function (e, obj) {  // OBJ is this Button
                        var contextmenu = obj.part; // the Button is in the context menu Adornment
                        var part = contextmenu.adornedPart; // the adornedPart is the Part that the context menu adorns
                        // now can do something with PART, or with its data, or with the Adornment (the context menu)
                        _this.idtareaSub = _this.idNodeSelected;
                        _this.relacionar = true;
                    }),
                makeButton("Deshacer",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
                makeButton("Rehacer",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    }),
                makeButton("Grupo",
                    function (e, obj) {
                        e.diagram.commandHandler.groupSelection();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canGroupSelection();
                    }),
                makeButton("Desagrupar",
                    function (e, obj) {
                        e.diagram.commandHandler.ungroupSelection();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUngroupSelection();
                    })
            );
        _this.diagramaPert.nodeTemplate =
            $(go.Node, "Auto",
                $(go.Shape, "RoundedRectangle", // the border
                    {fill: "white"},
                    new go.Binding("stroke", "critical",
                        function (b) {
                            _this.critical = b;
                            return (b ? "red" : "blue");
                        })),
                $(go.Panel, "Table", {padding: 0.5},
                    $(go.RowColumnDefinition, {
                        column: 0,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 0,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"},
                        new go.Binding("background", "es", ColorEstadoDeCumpliemto)),
                    $(go.RowColumnDefinition, {
                        row: 2,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"},
                        new go.Binding("background", "es", ColorEstadoDeCumpliemto)),
                    $(go.RowColumnDefinition, {
                        row: 4,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {
                        row: 5,
                        separatorStroke: "black",
                        background: "white",
                        coversSeparators: true
                    }),
                    $(go.TextBlock,
                        new go.Binding("text", "numero"),
                        {row: 1, column: 0, margin: 5, textAlign: "center", font: " bold 20px arial"}),
                    $(go.TextBlock,
                        new go.Binding("text", "tiempooptimista", _this.MostrarDuracionEstimada),
                        {row: 1, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "tiempomedio", _this.MostrarDuracionEstimada),
                        {row: 1, column: 2, margin: 5, textAlign: "center"/*, editable:true*/}),
                    $(go.TextBlock, // earlyFinish
                        new go.Binding("text", "tiempopesimista", _this.MostrarDuracionEstimada),
                        {row: 1, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock,
                        new go.Binding("text", "text"),
                        {
                            row: 0,
                            column: 1,
                            columnSpan: 3,
                            margin: 5,
                            textAlign: "left",
                            font: "bold 14px sans-serif",
                            wrap: go.TextBlock.WrapFit,
                            maxSize: new go.Size(200, NaN)
                        }),
                    /*$(go.TextBlock, // lateStart
                     new go.Binding("text", "fechaInicialPesimista"),
                     {row: 3, column: 1, margin: 5, textAlign: "center"}),
                     $(go.TextBlock, // slack
                     new go.Binding("text", "tiempoestimado", _this.MostrarDuracionEstimada),
                     {row: 3, column: 2, margin: 5, textAlign: "center"}),
                     $(go.TextBlock,
                     new go.Binding("text", "fechaFinalPesimista"),
                     {row: 3, column: 3, margin: 5, textAlign: "center"}),*/
                    $(go.TextBlock,
                        new go.Binding("text", "tiempoestimado", _this.MostrarDuracionEstimada),
                        {row: 2, column: 0, columnSpan: 4, margin: 5, textAlign: "center"})/*,
                 $(go.TextBlock,
                 new go.Binding("text", "fechafin"),
                 {
                 row: 4, column: 0, columnSpan: 4, margin: 5,
                 textAlign: "center"
                 }),
                 $(go.TextBlock,
                 new go.Binding("text", "tiempoprevio"),
                 {
                 row: 5, column: 0, columnSpan: 4, margin: 5,
                 textAlign: "center"
                 })*/
                ),
                {// this tooltip Adornment is shared by all nodes
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling nodeInfo(data)
                            new go.Binding("text", "", nodeInfo))
                    ),
                    // this context menu Adornment is shared by all nodes
                    contextMenu: partContextMenu
                }, {
                    doubleClick: function (e, node) {
                        var arrayIdElementos = [];
                        arrayIdElementos[0] = node.data.key;
                        _this.objCmpCrudActividad.CrearWinCrudActividades(
                            new Date().format('d/m/Y'),
                            new Date().format('d/m/Y'),
                            _this.horainicio,
                            _this.horafin,
                            'Modificar',
                            _this.ActualizarDiagrama,
                            arrayIdElementos,
                            node.data.idautor,
                            eshija = 0, permisomodificar = 1,
                            permisoeliminar = 1,
                            [],
                            null,
                            null, null,
                            node.data.gradocumplimiento,
                            null,
                            null);
                    }
                }
            ); // end Node

        function linkColorConverter(linkdata, elt) {
            var link = elt.part;
            if (!link)
                return "blue";
            var f = link.fromNode;
            if (!f || !f.data || !f.data.critical)
                return "blue";
            var t = link.toNode;
            if (!t || !t.data || !t.data.critical)
                return "blue";
            return "red"; // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }

        function ancholink(linkdata, elt) {
            var link = elt.part;
            if (!link)
                return 1;
            var f = link.fromNode;
            if (!f || !f.data || !f.data.critical)
                return 1;
            var t = link.toNode;
            if (!t || !t.data || !t.data.critical)
                return 1;
            return 4; // when both Link.fromNode.data.critical and Link.toNode.data.critical
        }

        function ColorEstadoDeCumpliemto(b) {
            /*if (b == 5)
                return "#0099FF";
            else if (b == 4)
                return "#FF9F9F"
            else if (b)
                return "#55d822"
            else if (b == false)
                return "#FFCC00";
            else*/
            return "white";
        }

        function linkInfo(d) {  // Tooltip info for a link data object
            return "Evento:\nDesde " + _this.diagramaPert.model.findNodeDataForKey(d.from).text + '.' + " hasta " + _this.diagramaPert.model.findNodeDataForKey(d.to).text;
        }

        _this.diagramaPert.linkTemplate =
            $(go.Link,
                $(go.Shape,
                    new go.Binding("strokeWidth", "", ancholink),
                    new go.Binding("stroke", "", linkColorConverter)),
                $(go.Shape, // arrowhead
                    {toArrow: "Standard", stroke: null},
                    new go.Binding("strokeWidth", "", ancholink),
                    new go.Binding("stroke", "", linkColorConverter)),
                {// this tooltip Adornment is shared by all links
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4}, // the tooltip shows the result of calling linkInfo(data)
                            new go.Binding("text", "", linkInfo))
                    ),
                    // the same context menu Adornment is shared by all links
                    contextMenu: partContextMenu
                });

        //Template para agrupar.

        function groupInfo(adornment) {  // takes the tooltip or context menu, not a group node data object
            var g = adornment.adornedPart; // get the Group that the tooltip adorns
            var mems = g.memberParts.count;
            var links = 0;
            //console.log(g.Eh.key);
            g.memberParts.each(function (part) {
                if (part instanceof go.Link)
                    links++;
            });
            return "Grupo: " + g.data.text + "\n" + _this.cantidadTareasDadoHito(g.Eh.key) + " tareas incluidas";
        }

        function diagramInfo(model) {  // Tooltip info for the diagram's model
            return "Modelo:\n" + model.nodeDataArray.length + " nodos, " + model.linkDataArray.length + " eventos";
        }

        _this.diagramaPert.groupTemplate =
            $(go.Group, "Vertical",
                {
                    selectionObjectName: "PANEL", // selection handle goes around shape, not label
                    ungroupable: true,
                    layout: $(go.LayeredDigraphLayout)
                }, // enable Ctrl-Shift-G to ungroup a selected Group
                $(go.TextBlock,
                    {
                        font: "bold 19px arial",
                        isMultiline: false, // don't allow newlines in text
                        editable: true  // allow in-place editing by user
                    },
                    new go.Binding("text", "text").makeTwoWay(),
                    new go.Binding("stroke", "color")),
                $(go.Panel, "Auto", {name: "PANEL"},
                    $(go.Shape, "Rectangle", {fill: "white"}),
                    $(go.Placeholder, {padding: 20})  // represents where the members are
                ),
                {// this tooltip Adornment is shared by all groups
                    toolTip: $(go.Adornment, "Auto",
                        $(go.Shape, {fill: "#FFFFCC"}),
                        $(go.TextBlock, {margin: 4},
                            // bind to tooltip, not to Group.data, to allow access to Group properties
                            new go.Binding("text", "", groupInfo).ofObject())
                    ),
                    // the same context menu Adornment is shared by all groups
                    contextMenu: partContextMenu
                });
        _this.diagramaPert.contextMenu =
            $(go.Adornment, "Vertical",
                makeButton("Pegar",
                    function (e, obj) {
                        e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
                    },
                    function (o) {
                        return o.diagram.commandHandler.canPasteSelection();
                    }),
                makeButton("Deshacer",
                    function (e, obj) {
                        e.diagram.commandHandler.undo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canUndo();
                    }),
                makeButton("Rehacer",
                    function (e, obj) {
                        e.diagram.commandHandler.redo();
                    },
                    function (o) {
                        return o.diagram.commandHandler.canRedo();
                    })
            );
        _this.diagramaPert.model = new go.GraphLinksModel(actividadesPert, relacionesPert);
        // Leyenda
        _this.diagramaPert.add(
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle", {fill: "#DDF4FF"}),
                $(go.Panel, "Table", {padding: 1},
                    $(go.RowColumnDefinition, {
                        column: 0,
                        separatorStroke: "black",
                        background: "#B9E9FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 2, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 0,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 2,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {
                        row: 4,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.RowColumnDefinition, {
                        row: 5,
                        separatorStroke: "black",
                        background: "#DDF4FF",
                        coversSeparators: true
                    }),
                    $(go.TextBlock, "No. del Nodo",
                        {row: 1, column: 0, margin: 5, textAlign: "center", font: " bold 15px arial"}),
                    $(go.TextBlock, "Tiempo optimista",
                        {row: 1, column: 1, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo medio",
                        {row: 1, column: 2, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Tiempo pesimista",
                        {row: 1, column: 3, margin: 5, textAlign: "center"}),
                    $(go.TextBlock, "Denominación de la tarea",
                        {
                            row: 0,
                            column: 1,
                            columnSpan: 3,
                            margin: 5,
                            textAlign: "center",
                            font: "bold 14px sans-serif"
                        }),
                    /*$(go.TextBlock, "Fecha inicial pesimista",
                     {row: 3, column: 1, margin: 5, textAlign: "center"}),
                     $(go.TextBlock, "Tiempo estimado",
                     {row: 3, column: 2, margin: 5, textAlign: "center"}),
                     $(go.TextBlock, "Fecha final pesimista",
                     {row: 3, column: 3, margin: 5, textAlign: "center"}),*/
                    $(go.TextBlock, "Duración estimada",
                        {row: 2, column: 0, columnSpan: 4, margin: 5, textAlign: "center"})/*,
                 $(go.TextBlock, "Fecha y hora en que termina la tarea",
                 {row: 4, column: 0, columnSpan: 4, margin: 5, textAlign: "center"}),
                 $(go.TextBlock, "Tiempo previo de la tarea",
                 {row: 5, column: 0, columnSpan: 4, margin: 5, textAlign: "center"})*/
                )
            ));
        _this.diagramaPert.add(
            $(go.Node, "Auto",
                $(go.Shape, "Rectangle", {fill: "white"}),
                $(go.Panel, "Table", {padding: 1, defaultSeparatorPadding: 3},
                    $(go.RowColumnDefinition, {column: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {column: 1, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 0, separatorStroke: "black"}),
                    $(go.RowColumnDefinition, {row: 1, separatorStroke: "black"}),
                    /*$(go.RowColumnDefinition, {row: 2, separatorStroke: "black"}),
                     $(go.RowColumnDefinition, {row: 3, separatorStroke: "black"}),*/
                    /*$(go.TextBlock, "Tarea cumplida",
                     {row: 0, column: 0, margin: 5, textAlign: 'left', alignment: go.Spot.Left}),
                     $(go.TextBlock, "Tarea parcialmente cumplida",
                     {row: 1, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),*/
                    $(go.TextBlock, "Tarea crítica",
                        {row: 0, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),
                    $(go.TextBlock, "Tarea no crítica",
                        {row: 1, column: 0, margin: 5, textAlign: "left", alignment: go.Spot.Left}),
                    /*$(go.TextBlock, "      ",
                     {row: 0, column: 1, margin: 5, textAlign: "center", background: "#55d822"}),
                     $(go.TextBlock, "      ",
                     {row: 1, column: 1, columnSpan: 3, margin: 5, textAlign: "center", background: "#FFCC00"}),*/
                    $(go.TextBlock, "      ",
                        {row: 0, column: 1, margin: 5, textAlign: "center", background: "#FF9F9F"}),
                    $(go.TextBlock, "      ",
                        {row: 1, column: 1, margin: 5, textAlign: "center", background: "#0099FF"})
                )
            ));
        _this.diagramaPert.addDiagramListener("ObjectSingleClicked",
            function (e) {
                var part = e.subject.part;
                _this.idNodeSelected = (part.data) ? part.data.key : null;
                if (_this.idNodeSelected) {
                    if (e.diagram.selection.count > 1) {
                        if (part.isSelected) {
                            if (!_this.isChecked(_this.arrayNodeSelected, part.data.key)) {
                                _this.arrayNodeSelected.push({id: part.data.key});
                            }
                        } else {
                            _this.eliminarNodoDeArrayElementosSeleccionados(_this.arrayNodeSelected, part.data.key);
                        }
                    } else {
                        _this.arrayNodeSelected = [];
                        _this.arrayNodeSelected.push({id: part.data.key});

                    }
                }

                if (e.diagram.selection.count >= 1 && part.isSelected && part.data) {
                    if (part instanceof go.Link) {
                        _this.btn100.disable();
                        _this.btnOtroValor.disable();
                        _this.btnRelaciones.disable();
                        _this.btnEliminarRelaciones.enable();
                    } else if (part instanceof go.Group) {

                    } else {
                        _this.btnEliminarRelaciones.disable();
                        _this.btn100.enable();
                        _this.btnOtroValor.enable();
                        _this.btnRelaciones.enable();
                    }
                    if (_this.relacionar) {
                        _this.relacionarTarea();
                        _this.relacionar = false;
                    }

                    if (_this.arrayNodeSelected.length > 1) {
                        _this.btnRelaciones.disable();
                    }
                } else {
                    _this.btn100.disable();
                    _this.btnOtroValor.disable();
                    _this.btnRelaciones.disable();
                    _this.btnEliminarRelaciones.disable();
                }

                if (part.Eh) {
                    _this.idNodeFrom = part.Eh.from;
                    _this.idNodeTo = part.Eh.to;
                }
            });
        _this.diagramaPert.addDiagramListener("BackgroundSingleClicked",
            function (e) {
                _this.arrayNodeSelected = [];
                _this.btn100.disable();
                _this.btnOtroValor.disable();
                _this.btnRelaciones.disable();
                _this.btnEliminarRelaciones.disable();
            });
    };
    this.ActualizarDiagrama = function () {
        document.getElementById("contenedorDiagramaPert").removeChild(document.getElementById("diagramaPert"));
        document.getElementById("contenedorDiagramaPert").innerHTML = '<div id="diagramaPert" style=" width:100%; height:100%"></div><div id="capaVistaAmpliada"></div>';
        _this.ObtenerDatosDiagrama('Actualizando diagrama...');
    };
    this.MostrarVistaAmpliada = function () {

        var capaVistaAmpliada = document.getElementById("capaVistaAmpliada");
        if (_this.vistaAmpliada === null || capaVistaAmpliada.style.display === "none") {
//alert(1);
// show DIV
            capaVistaAmpliada.style.display = "inline";
            capaVistaAmpliada.style.height = "200";
            capaVistaAmpliada.style.width = "200";
            // create Overview
            _this.vistaAmpliada =
                go.GraphObject.make(go.Overview, capaVistaAmpliada, // the HTML DIV element for the Overview
                    {
                        observed: _this.diagramaPert, // tell it which Diagram to show
                        // disable normal Overview functionality to make it act as a magnifying glass:
                        initialScale: 1, // zoom in even more than normal
                        autoScale: go.Diagram.None, // don't show whole observed Diagram
                        hasHorizontalScrollbar: false, // don't show any scrollbars
                        hasVerticalScrollbar: false
                    });
            // disable all mouse-down tools
            _this.vistaAmpliada.toolManager.mouseDownTools.each(function (t) {
                t.isEnabled = false;
            });
            // handle mouse moves within the Overview by redirecting the events to the _this.diagramaPert
            _this.vistaAmpliada.doMouseMove = function () {
                var pt = _this.vistaAmpliada.lastInput.documentPoint.copy();
                var e = _this.diagramaPert.lastInput;
                e.documentPoint = pt;
                e.viewPoint = _this.diagramaPert.transformDocToView(e.documentPoint);
                _this.diagramaPert.toolManager.doMouseMove();
            };
            // implement the magnifying glass functionality, to have the Overview show part of the Diagram where the mouse is
            _this.diagramaPert.toolManager.doMouseMove = function () {
                go.ToolManager.prototype.doMouseMove.call(_this.diagramaPert.toolManager);
                var capaVistaAmpliada = document.getElementById("capaVistaAmpliada");
                if (capaVistaAmpliada.style.display !== "none") {
                    var e = _this.diagramaPert.lastInput;
                    var osize = _this.vistaAmpliada.viewportBounds.size;
                    _this.vistaAmpliada.position = new go.Point(e.documentPoint.x - osize.width / 2, e.documentPoint.y - osize.height / 2);
                    capaVistaAmpliada.style.left = (e.viewPoint.x - capaVistaAmpliada.scrollWidth / 2) + "px";
                    capaVistaAmpliada.style.top = (e.viewPoint.y - capaVistaAmpliada.scrollHeight / 2) + "px";
                }
            };
        } else {
// hide DIV
            capaVistaAmpliada.style.display = "none";
        }
    }
    this.MostrarDuracionPlan = function (equivalenciaMinutos) {

        var restoAnos = equivalenciaMinutos % (525600);
        var equivalenciaAnos = equivalenciaMinutos / (525600);
        var restoMeses = restoAnos % (44640);
        var equivalenciaMeses = restoAnos / (44640);
        var restoDias = restoMeses % (1440);
        var equivalenciaDias = restoMeses / (1440);
        var restoHoras = restoDias % (60);
        var equivalenciaHoras = restoDias / (60);
        var restoMinutos = restoDias % (60);
        var duracionPlanTotal = parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - ' + parseInt(equivalenciaDias) + ' días - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
        _this.equivalencia = {
            equivalenciaDias: (parseInt(equivalenciaDias) != 0) ? parseInt(equivalenciaDias) : 0,
            equivalenciaHoras: (parseInt(equivalenciaHoras) != 0) ? parseInt(equivalenciaHoras) : 0,
            restoMinutos: (restoMinutos != 0) ? restoMinutos : 0
        };
        return duracionPlanTotal;
    }
    this.MostrarDuracionEstimada = function (equivalenciaMinutos) {
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
        var duracionPlanTotal = /*parseInt(equivalenciaAnos) + ' años - ' + parseInt(equivalenciaMeses) + ' meses - '*/ +parseInt(equivalenciaDias) + ' dias - ' + parseInt(equivalenciaHoras) + ' horas - ' + parseInt(restoMinutos) + ' minutos';
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

    // console.log(_this.objNodeJS.ip_servidor);
    this.socketEvents = new io.connect(_this.objNodeJS.ip_servidor, {port: _this.objNodeJS.port_servidor});
    _this.socketEvents.on('connect', function () {
    });
    this.fecha_hora_server;
    this.actualizarDiagramaTareasCumplidas = function (arrayTareas) {

        _this.socketEvents.emit("obtenerFechaHora");
        _this.socketEvents.on('obtenerFechaHora', function (fecha_hora_server) {
            _this.fecha_hora_server = fecha_hora_server;
        });
        //console.log('fecha: ' + _this.fecha_hora_server);

        for (var i = 0; i < arrayTareas.length; i++) {
            var esIncumplida = false;
            var aIniciado = false;
            var estado;

            //var text = _this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text.split('-');

            if (arrayTareas[i].gradocumplimiento == 0) {
                aIniciado = _this.aIniciado(arrayTareas[i], _this.fecha_hora_server);
                //console.log('estado: ' + aIniciado);
            }
            else if (arrayTareas[i].gradocumplimiento == 100) {

                //console.log(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text);
                artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text + ' está cumplida');
                //artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text) + ' está cumplida');
                _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id), 'es', true);
                estado = true;
            }

            else if (arrayTareas[i].gradocumplimiento >= 1) {

                esIncumplida = _this.esIncumplida(arrayTareas[i].id, _this.fecha_hora_server);
                if (_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).es == 4 || esIncumplida) {
                    //artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text + ' está incumplida');
                    artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text) + ' está incumplida');
                    _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id), 'es', 4);
                    estado = 4;
                } else {
                    //artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text + ' está parcialmente cumplida');
                    artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text) + ' está parcialmente cumplida');
                    _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id), 'es', false);
                    estado = false;
                }
            }
            else {

                esIncumplida = _this.esIncumplida(arrayTareas[i].id, _this.fecha_hora_server);
                if (_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).es == 4 || esIncumplida) {
                    //artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text + ' está incumplida');
                    artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id).text) + ' está incumplida');
                    _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id), 'es', 4);
                    estado = 4;
                } else {
                    _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(arrayTareas[i].id), 'es', null);
                    estado = null;
                }
            }
            _this.actualizarArregloActividadesPert(arrayTareas[i].id, estado, arrayTareas[i].gradocumplimiento);
        }
    }

    this.returnDenomTarea = function (denom) {
        var text = denom.split('-');
        return text[0];
    }
    this.calcularHolguraPorActividad = function (arrayTareas, relacionesPert) {

        for (var i = arrayTareas.length; i > 0; i--) {

            var datosTareas = arrayTareas[i - 1];
            var holgura;
            if (datosTareas.antecedente == null && datosTareas.numero == 1) {

                datosTareas.holgura = 0;
                datosTareas.fechaInicialOptimista = _this.extraerFecha(datosTareas.fechainicio);
                datosTareas.fechaFinalOptimista = _this.extraerFecha(datosTareas.fechafin);
                datosTareas.fechaInicialPesimista = _this.extraerFecha(datosTareas.fechainicio);
                datosTareas.fechaFinalPesimista = _this.extraerFecha(datosTareas.fechafin);
            } else {

                var arrayHolguras = [];
                arrayHolguras = _this.buscarAntecedentes(datosTareas, relacionesPert, arrayTareas);
                if (arrayHolguras.length != 0) {
                    holgura = _this.buscarHolguraEntreTareasPadres(arrayHolguras);
                    datosTareas.holgura = holgura.holguraTotal;
                }

                datosTareas.fechaInicialOptimista = _this.restaHorasFechas(holgura.holguraDifFechas, datosTareas.fechainicio);
                var duracionEnMinutos = _this.diferenciaHoras(datosTareas.fechainicio, datosTareas.fechafin) * 60;
                datosTareas.fechaFinalOptimista = _this.summaHorasFechas(duracionEnMinutos, datosTareas.fechaInicialOptimista);
                datosTareas.fechaInicialPesimista = _this.extraerFecha(datosTareas.fechainicio);
                datosTareas.fechaFinalPesimista = _this.extraerFecha(datosTareas.fechafin);
                if (datosTareas.holgura == 0) {
                }

            }
            arrayTareas[i - 1] = datosTareas;
        }
    }

// Función para calcular los días transcurridos entre dos fechas
// Las fechas pasadas deben ser dos strings en formato â€˜dd/mm/aaaaâ€™.
    this.restaFechas = function (f1, f2) {
        var aFecha1 = f1.split('/');
        var aFecha2 = f2.split('/');
        var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
        var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        return dias;
    }

// Función que suma o resta días a la fecha indicada
// Esta función está pensada 
// para ser usada con fechas en formato dd/mm/aaaa y dd-mm-aaaa. Admite como separador â€˜/â€™ y â€˜-â€˜.

    this.sumaFecha = function (d, fecha) {
        var Fecha = new Date();
        var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
        var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
        var aFecha = sFecha.split(sep);
        var fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];
        fecha = new Date(fecha);
        fecha.setDate(fecha.getDate() + parseInt(d));
        var anno = fecha.getFullYear();
        var mes = fecha.getMonth() + 1;
        var dia = fecha.getDate();
        mes = (mes < 10) ? ("0" + mes) : mes;
        dia = (dia < 10) ? ("0" + dia) : dia;
        var fechaFinal = dia + sep + mes + sep + anno;
        return (fechaFinal);
    }
    this.restaFecha = function (d, fecha) {
        var Fecha = new Date();
        var sFecha = fecha || (Fecha.getDate() + "/" + (Fecha.getMonth() + 1) + "/" + Fecha.getFullYear());
        var sep = sFecha.indexOf('/') != -1 ? '/' : '-';
        var aFecha = sFecha.split(sep);
        var fecha = aFecha[2] + '/' + aFecha[1] + '/' + aFecha[0];
        fecha = new Date(fecha);
        fecha.setDate(fecha.getDate() - parseInt(d));
        var anno = fecha.getFullYear();
        var mes = fecha.getMonth() + 1;
        var dia = fecha.getDate();
        mes = (mes < 10) ? ("0" + mes) : mes;
        dia = (dia < 10) ? ("0" + dia) : dia;
        var fechaFinal = dia + sep + mes + sep + anno;
        return (fechaFinal);
    }
    this.extraerFecha = function (cadena) {
        var fecha = cadena.split(' ');
        return fecha[1];
    }
    this.restaHorasFechas = function (equivalenciaMinutos, fechainicio) {

        var holgura = _this.MostrarDuracionPlan(equivalenciaMinutos);
        var fecha_hora_inicio = fechainicio.split(' ');
        var horainicio = fecha_hora_inicio[2].split(':');
        var fecha = _this.restaFecha(_this.equivalencia.equivalenciaDias, fecha_hora_inicio[1]);
        var parametros = fecha.split("/");
        var fecha2 = new Date(parametros[2], parametros[1] - 1, parametros[0], horainicio[0] - _this.equivalencia.equivalenciaHoras, horainicio[1] - _this.equivalencia.restoMinutos);
        var hours = fecha2.getHours();
        var minutes = fecha2.getMinutes();
        var seconds = fecha2.getSeconds();
        var hours = (hours < 10) ? "0" + hours : hours;
        var minutes = (minutes < 10) ? "0" + minutes : minutes;
        var seconds = (seconds < 10) ? "0" + seconds : seconds;
        // Human Format
        var formattedTime = hours + ':' + minutes + ':' + seconds;
        return fecha2.getDate() + "/" + parseInt(fecha2.getMonth() + 1) + "/" + fecha2.getFullYear() + " " + formattedTime;
    }
    this.summaHorasFechas = function (equivalenciaMinutos, fechainicio) {

        var holgura = _this.MostrarDuracionPlan(equivalenciaMinutos);
        var fecha_hora_inicio = fechainicio.split(' ');
        var horainicio = fecha_hora_inicio[1].split(':');
        var fecha = _this.sumaFecha(_this.equivalencia.equivalenciaDias, fecha_hora_inicio[0]);
        var parametros = fecha.split("/");
        var fecha2 = new Date(parametros[2], parametros[1] - 1, parametros[0], parseInt(horainicio[0]) + Math.round(_this.equivalencia.equivalenciaHoras), parseInt(horainicio[1]) + Math.round(_this.equivalencia.restoMinutos));
        var hours = fecha2.getHours();
        var minutes = fecha2.getMinutes();
        var seconds = fecha2.getSeconds();
        var hours = (hours < 10) ? "0" + hours : hours;
        var minutes = (minutes < 10) ? "0" + minutes : minutes;
        var seconds = (seconds < 10) ? "0" + seconds : seconds;
        // Human Format
        var formattedTime = hours + ':' + minutes + ':' + seconds;
        return fecha2.getDate() + "/" + parseInt(fecha2.getMonth() + 1) + "/" + fecha2.getFullYear() + " " + formattedTime;
    }
    this.buscarHolguraEntreTareasPadres = function (arrayTareasAntecedente) {

        if (arrayTareasAntecedente[0].holguraRestaDeFechas == 0) {

            var holgura = arrayTareasAntecedente[0].holguraAntecedente;
            var holguraDifFecha = 0;
        }
        else {

            var holgura = arrayTareasAntecedente[0].holguraRestaDeFechas + arrayTareasAntecedente[0].holguraAntecedente;
            var holguraDifFecha = arrayTareasAntecedente[0].holguraRestaDeFechas;
            var holguraMenor = arrayTareasAntecedente[0].holguraRestaDeFechas;
            for (var i = 1; i < arrayTareasAntecedente.length; i++) {

                if (arrayTareasAntecedente[i].holguraRestaDeFechas == 0) {
                    holgura = arrayTareasAntecedente[i].holguraAntecedente;
                    holguraDifFecha = 0;
                    break;
                }

                if (arrayTareasAntecedente[i].holguraRestaDeFechas < holguraMenor) {

                    holguraMenor = arrayTareasAntecedente[i].holguraRestaDeFechas;
                    holgura = arrayTareasAntecedente[i].holguraRestaDeFechas + arrayTareasAntecedente[i].holguraAntecedente;
                    holguraDifFecha = arrayTareasAntecedente[i].holguraRestaDeFechas;
                }
            }
        }
        var holguraFinal = {
            holguraTotal: holgura,
            holguraDifFechas: holguraDifFecha
        }

        return holguraFinal;
    }
    this.buscarAntecedentes = function (tarea, relacionesPert, arrayTareas) {

        var arrayAntecedentes = [];
        var contHolguras = 0;
        for (var i = 0; i < relacionesPert.length; i++) {

            var tareaAntecedente;
            if (relacionesPert[i].to == tarea.key) {

                tareaAntecedente = _this.buscarDatosTareaAntecedente(relacionesPert[i].from, arrayTareas);
                var fechafin = _this.extraerFecha(tarea.fechainicio);
                var fechainicio = _this.extraerFecha(tareaAntecedente.fechafin);
                var holguraEnMinutos = _this.diferenciaHoras(tareaAntecedente.fechafin, tarea.fechainicio) * 60;
                var holgura = {
                    holguraAntecedente: tareaAntecedente.holgura,
                    holguraRestaDeFechas: Math.round(holguraEnMinutos) //_this.restaFechas(fechainicio, fechafin)
                };
                arrayAntecedentes[contHolguras++] = holgura;
            }
        }
        return arrayAntecedentes;
    }
    this.buscarDatosTareaAntecedente = function (idtarea, arrayTareas) {
        var tarea;
        for (var j = 0; j < arrayTareas.length; j++) {
            if (arrayTareas[j].key == idtarea) {
                tarea = arrayTareas[j];
                break;
            }
        }
        return tarea;
    }
    this.diferenciaHoras = function (fecha_hora_inicio, fecha_hora_fin) {

        var arrayFHinicio = fecha_hora_inicio.split(' ');
        var arrayFHfin = fecha_hora_fin.split(' ');
        var f1 = arrayFHinicio[1];
        var f2 = arrayFHfin[1];
        var horainicio = arrayFHinicio[2].split(":");
        var horafinal = arrayFHfin[2].split(":");
        var aFecha1 = f1.split('/');
        var aFecha2 = f2.split('/');
        var fFecha1 = Date.UTC(aFecha1[2], aFecha1[1] - 1, aFecha1[0]);
        var fFecha2 = Date.UTC(aFecha2[2], aFecha2[1] - 1, aFecha2[0]);
        var dif = fFecha2 - fFecha1;
        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
        var diferenciahorasfechas = dias * 24;
        var horasdiainicio = horainicio[0] / 1;
        var minutosdiainicio = horainicio[1] /= 60;
        var rangohoras1 = horasdiainicio + minutosdiainicio;
        var horasdiafinal = horafinal[0] / 1;
        var minutosdiafinal = horafinal[1] /= 60;
        var rangohoras2 = horasdiafinal + minutosdiafinal;
        var diferenciahorasdia = rangohoras2 - rangohoras1;
        var horastotales = diferenciahorasfechas + diferenciahorasdia;
        return horastotales.toFixed(2);
    }
    this.agregarGruposHitosADiagrama = function (arrayTareas, arrayGruposHitos) {

        var arrayTareasAgrupadas = [];
        if (arrayTareas) {
            var lengthArrayTareas = arrayTareas.length;
            for (var j = 0; j < arrayTareas.length; j++) {
                arrayTareasAgrupadas[j] = arrayTareas[j];
            }

            for (var i = 0; i < arrayGruposHitos.length; i++) {
                arrayTareasAgrupadas[lengthArrayTareas] = arrayGruposHitos[i];
                lengthArrayTareas++;
            }
        }
        return arrayTareasAgrupadas;
    }
    this.actualizarDiagramaTareasSimplificadas = function (arrayTareas, arrayHitos, arrayRelaciones) {
        var arraycollNodos = [];
        var arraycollLink = [];
        var poscoll = 0;
        for (var i = 0; i < arrayHitos.length; i++) {

            for (var j = 0; j < arrayTareas.length; j++) {

                if (arrayTareas[j].group == arrayHitos[i] || arrayTareas[j].key == arrayHitos[i]) {
                    arraycollNodos[poscoll] = _this.diagramaPert.model.findNodeDataForKey(arrayTareas[j].key);
                    poscoll++;
                }
            }
            poscoll = 0;
            for (var v = 0; v < arraycollNodos.length; v++) {

                for (var k = 0; k < arrayRelaciones.length; k++) {

                    if (arraycollNodos[v].key == arrayRelaciones[k].from || arraycollNodos[v].key == arrayRelaciones[k].to) {
                        arraycollLink[poscoll] = arrayRelaciones[k];
                        poscoll++;
                    }
                }
            }

            _this.diagramaPert.model.removeNodeDataCollection(arraycollNodos);
            _this.diagramaPert.model.removeLinkDataCollection(arraycollLink);
        }
    }

    function RealizarEjecucion(valor, o, record) {
        var retorno = '<center><a href="#" id = "' + record.data.idelemento + '" style="text-decoration:none" ><span class="icondistra-bandera sipac-verde"></span></a>' + ' ' + '</center>';
        return retorno;
    }

    function MostrarImagenTipoElemento(valor, m, r) {
        if (r.data.origen == 4) {
            return '<span class="icondistra-tarea sipac-naranja">' + ' ' + valor + '</span>';
        } else
            return '<span class="icondistra-tarea sipac-azul">' + ' ' + valor + '</span>';
    }

    this.EjecutarCumplimiento = function () {

        var arrayrecords = _this.smEjecutar.getSelections();
        var arrayidelementos = [];
        arrayidelementos.push({
            id: arrayrecords[0].data.idelemento,
            tipo: 10,
            plantilla: 0,
            idautor: arrayrecords[0].data.idautor,
            evento: 'vacio',
            gradocumplimiento: arrayrecords[0].data.gradocumplimiento
        });
        //this.BarraProgreso.show('Actualizando cumplimiento');
        Ext.Ajax.request({
            url: '/planificacion/proyecto/planeacion/index.php/cmpgestionarplantilla/actualizarCumplimiento',
            params: {
                arrayidtareas: Ext.encode(arrayidelementos),
                metodo: 1
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.respuesta == 1) {
                    mostrarMensaje(1, 'La tarea ha sido actualizada satisfactoriamente.');
                    _this.socketEvents.emit("actualizarPorcientoCumplimiento", responseData.arrayidTareas);
                    _this.stEjecutar.reload();
                }
                if (responseData.respuesta == 3) {
                    mostrarMensaje(1, msjError);
                }
            }
        });
    }
    this.validarIncumplimiento = function (fecha_hora_server) {
        //console.log(fecha_hora_server);
        var arrayfecha_hora_servidor = fecha_hora_server.split(' ');
        var fecha = arrayfecha_hora_servidor[0].split("/");
        var hora = arrayfecha_hora_servidor[1].split(":");
        var fecha_hora_server_format = new Date(fecha[2], fecha[1] - 1, fecha[0], hora[0], hora[1]);
        var arrayfecha_hora = [];
        for (var i = 0; i < _this.actividadesPert.length; i++) {

            if (_this.actividadesPert[i].gradocumplimiento != 100 && _this.actividadesPert[i].isGroup != true && _this.actividadesPert[i].es != 4) {

                var array_fecha_hora = _this.actividadesPert[i].fechafin.split(' ');
                var fechatarea = array_fecha_hora[1].split("/");
                var horatarea = array_fecha_hora[2].split(":");
                var fecha_hora_tarea = new Date(fechatarea[2], fechatarea[1] - 1, fechatarea[0], horatarea[0], horatarea[1]);
                if (fecha_hora_tarea <= fecha_hora_server_format) {
                    //var text = _this.diagramaPert.model.findNodeDataForKey(_this.actividadesPert[i].key).text.split('-');
                    //artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(_this.actividadesPert[i].key).text + ' está incumplida');
                    artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(_this.actividadesPert[i].key).text) + ' está incumplida');
                    _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(_this.actividadesPert[i].key), 'es', 4);
                    _this.actividadesPert[i].es = 4;
                } else if (_this.actividadesPert[i].gradocumplimiento == 0 && _this.actividadesPert[i].isGroup != true && _this.actividadesPert[i].es != 5) {

                    var arraytarea = null;
                    arraytarea = {
                        id: _this.actividadesPert[i].key,
                        gradocumplimiento: _this.actividadesPert[i].gradocumplimiento
                    }
                    var aIniciado = _this.aIniciado(arraytarea, fecha_hora_server);
                }
            }

        }
    }
    this.esIncumplida = function (idtarea, fecha_hora_server) {
        var esIncumplida = false;
        var arrayfecha_hora_servidor = fecha_hora_server.split(' ');
        var fecha = arrayfecha_hora_servidor[0].split("/");
        var hora = arrayfecha_hora_servidor[1].split(":");
        var fecha_hora_server = new Date(fecha[2], fecha[1] - 1, fecha[0], hora[0], hora[1]);
        var arrayfecha_hora = [];
        var tarea = _this.diagramaPert.model.findNodeDataForKey(idtarea);
        if (tarea.gradocumplimiento != 100 && tarea.isGroup != true) {

            var array_fecha_hora = tarea.fechafin.split(' ');
            var fechatarea = array_fecha_hora[1].split("/");
            var horatarea = array_fecha_hora[2].split(":");
            var fecha_hora_tarea = new Date(fechatarea[2], fechatarea[1] - 1, fechatarea[0], horatarea[0], horatarea[1]);
            if (fecha_hora_tarea <= fecha_hora_server) {
                _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(tarea.key), 'es', 4);
                esIncumplida = true;
            }
        }
        return esIncumplida;
    }
    this.aIniciado = function (arrayTareas, fecha_hora_server) {
        var tareaIniciada = false;
        var arrayfecha_hora_servidor = fecha_hora_server.split(' ');
        var fecha = arrayfecha_hora_servidor[0].split("/");
        var hora = arrayfecha_hora_servidor[1].split(":");
        var fecha_hora_server = new Date(fecha[2], fecha[1] - 1, fecha[0], hora[0], hora[1]);
        var arrayfecha_hora = [];
        var tarea = _this.diagramaPert.model.findNodeDataForKey(arrayTareas.id);
        //console.log('tarea.gradocumplimiento: ' + tarea.gradocumplimiento);
        if (arrayTareas.gradocumplimiento != 100 && tarea.isGroup != true) {

            var array_fecha_hora = tarea.fechafin.split(' ');
            var fechatareafin = array_fecha_hora[1].split("/");
            var horatareafin = array_fecha_hora[2].split(":");
            var fecha_hora_fin_tarea = new Date(fechatareafin[2], fechatareafin[1] - 1, fechatareafin[0], horatareafin[0], horatareafin[1]);
            var array_fecha_hora_ini = tarea.fechainicio.split(' ');
            var fechatareainicio = array_fecha_hora_ini[1].split("/");
            var horatareainicio = array_fecha_hora_ini[2].split(":");
            var fecha_hora_inicio_tarea = new Date(fechatareainicio[2], fechatareainicio[1] - 1, fechatareainicio[0], horatareainicio[0], horatareainicio[1]);
            //console.log('fecha_hora_inicio_tarea: ' + fecha_hora_inicio_tarea + ' <= ' + fecha_hora_server + ' && fecha_hora_fin_tarea: ' + fecha_hora_fin_tarea + ' >= ' + fecha_hora_server);
            if (fecha_hora_inicio_tarea <= fecha_hora_server && fecha_hora_fin_tarea >= fecha_hora_server) {
                //var text = _this.diagramaPert.model.findNodeDataForKey(tarea.key).text.split('-');
                //artyom.say('Atención, Atención, la tarea ' + _this.diagramaPert.model.findNodeDataForKey(tarea.key).text + ' ha iniciado');
                artyom.say('Atención, Atención, la tarea ' + _this.returnDenomTarea(_this.diagramaPert.model.findNodeDataForKey(tarea.key).text) + ' ha iniciado');
                _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(tarea.key), 'es', 5);
                _this.actualizarArregloActividadesPert(tarea.key, 5, arrayTareas.gradocumplimiento);
                tareaIniciada = true;
            } else {
                _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(tarea.key), 'es', null);
            }
        }
        return tareaIniciada;
    }
    this.eliminarNodoDeArrayElementosSeleccionados = function (arrayElementosSeleccionados, idnodo) {
        var arrayNodosTemp = [];
        var pos = 0;
        for (var i = 0; i < arrayElementosSeleccionados.length; i++) {
            if (arrayElementosSeleccionados[i].id != idnodo) {
                arrayNodosTemp[pos] = arrayElementosSeleccionados[i];
                pos++;
            }
        }
        _this.arrayNodeSelected = arrayNodosTemp;
    }
    this.isChecked = function (arrayElementosSeleccionados, idnodo) {
        var isChecked = false;
        for (var i = 0; i < arrayElementosSeleccionados.length; i++) {
            if (arrayElementosSeleccionados[i].id == idnodo) {
                isChecked = true;
                break;
            }
        }
        return isChecked;
    }
    this.cantidadTareasDadoHito = function (idHito) {
        var cantidadDeTarea = 0;
        for (var i = 0; i < _this.actividadesPert.length; i++) {
            if (_this.actividadesPert[i].group == idHito) {
                cantidadDeTarea++;
            }
        }
        return cantidadDeTarea;
    }
    this.actualizarArregloActividadesPert = function (idactividad, estado, gradocumplimiento) {
//console.log(estado);
        for (var i = 0; i < _this.actividadesPert.length; i++) {
            if (_this.actividadesPert[i].key == idactividad) {
                _this.actividadesPert[i].gradocumplimiento = gradocumplimiento;
                _this.diagramaPert.model.setDataProperty(_this.diagramaPert.model.findNodeDataForKey(idactividad), 'gradocumplimiento', gradocumplimiento);
                _this.actividadesPert[i].es = estado;
            }
        }
    }
    this.calcularHolguraRealPorActividad = function (arrayTareas, relacionesPert) {
        if (arrayTareas) {
            for (var i = arrayTareas.length; i > 0; i--) {

                var datosTareas = arrayTareas[i - 1];
                var holgura;
                if (datosTareas.antecedente == null && datosTareas.numero == 1) {

                    datosTareas.holgura = 0;
                    datosTareas.fechaInicialOptimista = _this.extraerFecha(datosTareas.fechainicio);
                    datosTareas.fechaFinalOptimista = _this.extraerFecha(datosTareas.fechafin);
                    datosTareas.fechaInicialPesimista = _this.extraerFecha(datosTareas.fechainicio);
                    datosTareas.fechaFinalPesimista = _this.extraerFecha(datosTareas.fechafin);
                } else {

                    var arraySucesores = [];
                    arraySucesores = _this.buscarSucesores(datosTareas, relacionesPert, arrayTareas);
                    if (arraySucesores.length != 0) {
                        holgura = _this.buscarHolguraEntreTareasSucesoras(datosTareas, arraySucesores);
                        datosTareas.holgura = holgura.holguraTotal;
                    } else {
                        holgura = {holguraTotal: arrayTareas[i].holgura}
                    }

                    datosTareas.fechaInicialOptimista = _this.restaHorasFechas(holgura.holguraTotal, datosTareas.fechainicio);
                    var duracionEnMinutos = _this.diferenciaHoras(datosTareas.fechainicio, datosTareas.fechafin) * 60;
                    datosTareas.fechaFinalOptimista = _this.summaHorasFechas(duracionEnMinutos, datosTareas.fechaInicialOptimista);
                    datosTareas.fechaInicialPesimista = _this.extraerFecha(datosTareas.fechainicio);
                    datosTareas.fechaFinalPesimista = _this.extraerFecha(datosTareas.fechafin);
                }
                arrayTareas[i - 1] = datosTareas;
            }
        }
    }
    this.buscarSucesores = function (tarea, relacionesPert, arrayTareas) {

        var arraySucesores = [];
        var pos = 0;
        for (var i = 0; i < relacionesPert.length; i++) {
            var tareaSucesora;
            if (relacionesPert[i].from == tarea.key) {
                tareaSucesora = _this.buscarDatosTareaAntecedente(relacionesPert[i].to, arrayTareas);
                arraySucesores[pos++] = tareaSucesora;
            }
        }
        return arraySucesores;
    }
    this.buscarHolguraEntreTareasSucesoras = function (tarea, arraySucesores) {

        var arrayHolguras = [];
        for (var i = 0; i < arraySucesores.length; i++) {
            var duracionEnMinutos = _this.diferenciaHoras(tarea.fechafin, arraySucesores[i].fechainicio) * 60;
            arrayHolguras[i] = duracionEnMinutos;
        }

        var holgura = arrayHolguras[0];
        for (var i = 0; i < arrayHolguras.length; i++) {
            if (arrayHolguras[i] < holgura) {
                holgura = arrayHolguras[i];
            }

        }

        var holguraFinal = {
            holguraTotal: holgura/*,
             holguraDifFechas: holguraDifFecha*/
        }

        return holguraFinal;
    }
    this.CrearWindowRelacionarTarea = function () {

        this.stTareasRelacion = new Ext.data.Store({
            url: _this.url + 'cargarincidencias',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
            }, [
                {
                    name: 'denelemento'
                }, {
                    name: 'idincidencia'
                }, {
                    name: 'dennomenclador'
                }
            ]),
            listeners: {
                beforeload: function (s) {
                    // _this.BarraProgreso.show('Cargando...');
                },
                load: function (st) {
                }
            }
        });

        this.smTareasRelacion = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function (sm, ri, record) {
                    //_this.ActualizarEstadoBarraHerramientas();
                },
                rowdeselect: function (sm, ri, record) {
                    //_this.ActualizarEstadoBarraHerramientas();
                }

            }
        });
        this.cmTareasRelacion = [
            _this.smTareasRelacion,
            {
                header: "Denominaci&oacute;n",
                id: 'expandir',
                dataIndex: 'denelemento',
                width: 605,
                sortable: true
            }
        ];

        this.gdTareasRelacion = new Ext.grid.GridPanel({
            frame: true,
            iconCls: 'icon-grid',
            master_column_id: 'expandir',
            autoExpandColumn: 'expandir',
            autoExpandMax: 500,
            store: _this.stTareasRelacion,
            sm: _this.smTareasRelacion,
            columns: _this.cmTareasRelacion,
            width: 500,
            listeners: {
                rowcontextmenu: function (t, ri, event) {
                    _this.smTareasRelacion.selectRow(ri);
                    var menuPert = new Ext.menu.Menu({
                        id: 'menuPert',
                        items: [{
                            handler: function () {
                                _this.VerificarTareasRelacion();
                            },
                            text: 'Eliminar',
                            itemCls: 'x-menu-item icondistra-modificar',
                            iconCls: 'imagen-none',
                            tooltip: 'Eliminar del listado de tareas a relacionar'
                        }]
                    });
                },
                rowdblclick: function (t, ri, event) {
                    _this.VerificarTareasRelacion();
                }
            }
        });

        _this.btnCancelarRel = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.WinTareasRelacion.destroy();
            }
        });
        _this.btnAceptarRel = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar ',
            tooltip: 'Guardar datos y cerrar ventana',
            handler: function () {
            }
        });

        _this.WinTareasRelacion = new Ext.Window({
            title: 'Relacionar elementos a la tarea',
            layout: 'fit',
            id: 'WinTareasRelacion',
            //closable: true,
            //graggable: false,
            modal: false,
            //style: 'z-index: 1000000 !important;',
            //bodyStyle: 'z-index:22000',
            width: 500,
            height: 350,
            items: [_this.gdTareasRelacion],
            buttons: [_this.btnCancelarRel, _this.btnAceptarRel],
            listeners: {
                render: function () {
                    var mask = Ext.get('WinTareasRelacion');
                    var maskPrincipal = Ext.get('winPrincipalPert');
                    //mask.setOpacity(0.68);

                    Ext.EventManager.on(maskPrincipal.dom, 'click', function () {
                        mask.setOpacity(0.62);
                    });
                    Ext.EventManager.on(mask.dom, 'click', function () {
                        mask.clearOpacity();
                    });
                }
            }
        });
        _this.WinTareasRelacion.show();
        _this.WinTareasRelacion.toFront();

    }
    this.eliminarRelacionEntreTarea = function (infoLink) {

        var arrayrelacionesseleccionadas = [];
        var relacion = {
            idtarea: infoLink.from,
            idactividad: infoLink.from,
            tipoelemento: _this.integracionProyecto ? 10 : 3,
            idrelacion: infoLink.to + infoLink.from
        }
        arrayrelacionesseleccionadas.push(relacion);

        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmprelaciones/eliminarrelacionesuperiores',
            params: {
                from: infoLink.from,
                to: infoLink.to,
                arrayrelacionesseleccionadas: Ext.encode(arrayrelacionesseleccionadas),
                idelemento: infoLink.to,
                tipoelemento: _this.integracionProyecto ? 10 : 3,
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                //console.log(responseData.mensaje);
                if (responseData.mensaje == 1) {
                    mostrarMensaje(1, 'La relación se ha eliminado satisfactoriamente.');
                    _this.ConstruirComponentesVisuales();
                    _this.ObtenerDatosDiagrama('Generando diagrama...');
                    _this.WinPrincipal.show();

                }
                if (responseData.mensaje == 3) {
                    mostrarMensaje(1, 'Ocurrio un error.');
                }
            }
        });
    }
    this.relacionarTarea = function (infoLink) {

        var arrayrelacionesseleccionadas = [];
        arrayrelacionesseleccionadas.push(_this.idNodeSelected);

        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/generarDependencia',
            params: {
                arraysubactividades: Ext.encode(arrayrelacionesseleccionadas),
                actpadre: _this.idtareaSub,
                idmodulo: 2,
                origen: 6
            },
            callback: function (options, success, response) {
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.success == 1) {
                    mostrarMensaje(1, 'La relación se ha realizado satisfactoriamente.');
                    _this.ConstruirComponentesVisuales();
                    _this.ObtenerDatosDiagrama('Generando diagrama...');
                    _this.WinPrincipal.show();
                }
                if (responseData.respuesta != 1) {
                    mostrarMensaje(1, 'No se pudo generar la relación, verifique las fechas de la dependencia');
                }
            }
        });
    }


};


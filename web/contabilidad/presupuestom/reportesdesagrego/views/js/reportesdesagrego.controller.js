
Ext.namespace('Presupuesto.Reportes');

Presupuesto.Reportes.Controller = {
    inicio: function(idioma, vista, modelo) {
        var scope=this;
        //Objeto para ejecutar una tarea
        //esto me sirve para validar el formulario en el modificar
        this.runner = new Ext.util.TaskRunner();
        this.tarea;

        this.startTaskValidation = function(arrbotones) {
            this.tarea = {
                run: function() {
                    if (!Ext.isEmpty(vista.cbtipoMetdConc.getValue()) /*&& !Ext.isEmpty(vista.cbconcepto.getValue())*/) {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(false);
                        }
                    }
                    else {
                        for (var i = 0, long = arrbotones.length; i < long; i++) {
                            arrbotones[i].setDisabled(true);
                        }
                    }
                },
                interval: 300,
                scope: this
            };

            this.runner.start(this.tarea);
        };

        this.stopTaskValidation = function() {
            if (!Ext.isEmpty(this.tarea)) {
                this.runner.stop(this.tarea);
            }
        };

        this.count = 0, this.fechainicio = '', this.fechafin = '';

        //********************Carga del componente***********************************
        vista.addMascaraBody();
        vista.MostrarEtiquetas(Ext.getBody(), idioma.msgCargando);

        Ext.Ajax.request({
            url: 'loadDataIni',
            method: 'POST',
            scope: this,
            callback: function(options, success, response) {

                responseData = Ext.decode(response.responseText);

                //Carga el combo tipo cuenta
                modelo.stconcepto.loadData(responseData.tiposcuentas);

                //Carga el combo de ejercicios
                modelo.stejercicio.loadData(responseData.ejercicios);

                //Cargar el combo tree grid
                // Ext.getCmp('gpEntidad').getStore().loadData(responseData.estructurae);
                // if (responseData.estructurae.datos[0].idestructurae && responseData.estructurae.datos[0].descripcion)
                    //vista.cbxEntidad.enable();

                //Cargar la fecha contable del sistema
                vista.dfDesde.setMaxValue(responseData.fechacontable.fechacontable);
                vista.dfHasta.setMaxValue(responseData.fechacontable.fechacontable);
                vista.dfHasta.setMinValue(responseData.fechacontable.fechacontable);

                //Mostrar laventana principal y cerrar la mascara
                vista.win.show();
                vista.lMask.hide();
                vista.delMascaraBody();

                vista.cbtipoMetdConc.focus(true, true);

               // this.startTaskValidation([Ext.getCmp('btnImprimir')]);
            }
        });

        //*******************************************************************************

        //***********Funcionalidades y Eventos ********************************

        vista.cbtipoMetdConc.on({
            beforeselect :function(t, r) {
                vista.cbOperacion.setValue('');
                vista.cbOperacion.enable();
                vista.cbxEntidad.disable();
                vista.cbxEntidad.setValue('');
                vista.cbEjercicio.setValue('');
                vista.labelDoc.setValue('');
                vista.labelDoc.disable();
                vista.cbEjercicio.disable();
                vista.btnVistaReporte.disable();
                vista.cbPeriodo.setValue('');
                vista.NAEEdit.disable();
                vista.comboespecialidad.disable();
                vista.elementoGasto.disable();
                vista.NAEEdit.setValue('');
                vista.comboespecialidad.setValue('');
                vista.elementoGasto.setValue('');

            },

        });
        vista.cbOperacion.on('select', function(t, r) {
            vista.cbEjercicio.enable();
            vista.NAEEdit.enable();
            vista.comboespecialidad.enable();
            vista.labelDoc.enable();
            vista.elementoGasto.enable();
            if(vista.cbtipoMetdConc.getValue()==2)
                vista.cbxEntidad.enable();
            else
                vista.cbxEntidad.disable();
        },this);

        vista.cbtipoMetdConc.on('select', function(combo, record, index) {
            this.fSetearFechas(record.data.inicio, record.data.fin);
        }, this);

        vista.cbPeriodo.on('render', function(component) {
            component.getEl().on('mouseover', function() {
                if (Ext.getCmp('cbPeriodo').getValue() != 'Seleccione...' && Ext.getCmp('cbPeriodo').getValue().length > 0)
                    vista.fToolTipShow(Ext.getCmp('cbPeriodo'), Ext.getCmp('cbPeriodo').getRawValue());
            });
        }, this);

        vista.cbEjercicio.on('select', function(t, r) {
            vista.addMascaraBody();
            vista.btnVistaReporte.enable();
            vista.MostrarEtiquetas(Ext.getBody(), idioma.msgCargando);
            this.fSetearFechas(r.data.inicio, r.data.fin);
            vista.cbPeriodo.reset();
            modelo.stperiodo.load({
                params: {
                    idejercicio: r.data.idejercicio
                },
                callback: function() {
                    vista.lMask.hide();
                    vista.delMascaraBody();
                }
            });
        }, this);

        vista.cbEjercicio.on('render', function(component) {
            component.getEl().on('mouseover', function() {
                if (Ext.getCmp('cbEjercicio').getValue() != idioma.emptyTSleccione && Ext.getCmp('cbEjercicio').getValue().length > 0)
                    vista.fToolTipShow(Ext.getCmp('cbEjercicio'), Ext.getCmp('cbEjercicio').getRawValue());
            });
        }, this);

        vista.cbconcepto.on('render', function(component) {
            component.getEl().on('mouseover', function() {
                if (Ext.getCmp('cbconcepto').getValue() != idioma.emptyTSleccione && Ext.getCmp('cbconcepto').getValue().length > 0)
                    vista.fToolTipShow(Ext.getCmp('cbconcepto'), Ext.getCmp('cbconcepto').getRawValue());
            });
        }, this);

        vista.btnAyuda.on('click', function() {
            //help.show(idioma.lbtextTitleHelp, 'confin/banco/reportesdesagrego/conciliacion');
        }, this);

        vista.win.buttons[1].on('click', function() {
            vista.win.hide();
            window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
        }, this);

        vista.win.on('hide', function(r, options) {
            this.stopTaskValidation();
            window.parent.Ext.getCmp('win' + window.parent.idFuncionalidad).close();
        }, this);

        // vista.win.on({
        //     show: function() {
        //         //Key map del inicio y fin del formulario
        //         var btnImprimir = vista.win.buttons[1];
        //         btnImprimir.getEl().addKeyMap([
        //             {
        //                 key: Ext.EventObject.TAB,
        //                 stopEvent: true,
        //                 fn: function() {
        //                     vista.cbtipoMetdConc.focus(true, true);
        //                 }
        //             }
        //         ]);
        //
        //         vista.cbtipoMetdConc.getEl().addKeyMap([
        //             {
        //                 key: Ext.EventObject.TAB,
        //                 shift: true,
        //                 stopEvent: true,
        //                 fn: function() {
        //                     btnImprimir.focus();
        //                 }
        //             }
        //         ]);
        //     }
        // });

        /*vista.cbconcepto.on('valid', function(t) {//habilita el btn vista previa
            Ext.getCmp('btnImprimir').enable();
        }, this);*/

        vista.cbEjercicio.on('select', function(t) {//almacena la fecha seleccionada
            this.prioridadFecha();
        }, this);

        vista.cbPeriodo.on('select', function(combo, record, index) {
            this.fSetearFechas(record.data.inicio, record.data.fin);
            this.fechainicio=record.data.inicio;
            this.fechafin=record.data.fin;
        }, this);
        vista.cbOperacion.on('select', function(t) {//almacena la fecha seleccionada
           // vista.cbEjercicio.setTitle('Ejercicio:')
            vista.cbxEntidad.setVisible(true);
            vista.cbEjercicio.setValue(modelo.stejercicio.data.items[modelo.stejercicio.data.items.length-1].data.idejercicio)
            vista.cbEjercicio.setRawValue(modelo.stejercicio.data.items[modelo.stejercicio.data.items.length-1].data.nombre)

            if (vista.cbEjercicio.getValue() != '')
                this.fechainicio = modelo.stejercicio.getAt(modelo.stejercicio.find('idejercicio', vista.cbEjercicio.getValue())).data.inicio;
            //PARA LA FECHA FIN
            if (vista.dfHasta.getValue() != '')
                this.fechafin = vista.dfHasta.getRawValue();
            else if (vista.cbPeriodo.getValue() != '')
                this.fechafin = modelo.stperiodo.getAt(modelo.stperiodo.find('idperiodo', vista.cbPeriodo.getValue())).data.fin;
            else if (vista.cbEjercicio.getValue() != '')
                this.fechafin = modelo.stejercicio.getAt(modelo.stejercicio.find('idejercicio', vista.cbEjercicio.getValue())).data.fin;
            scope.fSetearFechas( this.fechainicio, this.fechafin);
            vista.btnVistaReporte.enable();

        }, this);

        vista.dfDesde.on('change', function(df, newvalue, oldvalue) {//almacena la fecha seleccionada
            this.prioridadFecha();
        }, this);

        vista.dfHasta.on('change', function(df, newvalue, oldvalue) {//almacena la fecha seleccionada
            this.prioridadFecha();
        }, this);

        //se setea la fecha seleccionada al componente fecha hasta
        this.fSetearFechas = function(fechaInicio, fechaFin) {
            Ext.getCmp('desdeintrv').setMinValue(fechaInicio);
            Ext.getCmp('hastaintrv').setMinValue(fechaInicio);
            Ext.getCmp('desdeintrv').setMaxValue(fechaFin);
            Ext.getCmp('hastaintrv').setMaxValue(fechaFin);
            Ext.getCmp('desdeintrv').setValue(fechaInicio);
            Ext.getCmp('hastaintrv').setValue(fechaFin);
        };

        //se encarga de seleccionar la fecha segun prioridad del componente
        this.prioridadFecha = function() {
            //PARA LA FECHA INICIO
            /*if (vista.dfDesde.getValue() != '')
                this.fechainicio = vista.dfDesde.getRawValue();
            else if (vista.cbPeriodo.getValue() != '')
                this.fechainicio = modelo.stperiodo.getAt(modelo.stperiodo.find('idperiodo', vista.cbPeriodo.getValue())).data.inicio;
            else*/ if (vista.cbEjercicio.getValue() != '')
                this.fechainicio = modelo.stejercicio.getAt(modelo.stejercicio.find('idejercicio', vista.cbEjercicio.getValue())).data.inicio;
            //PARA LA FECHA FIN
            if (vista.dfHasta.getValue() != '')
                this.fechafin = vista.dfHasta.getRawValue();
            else if (vista.cbPeriodo.getValue() != '')
                this.fechafin = modelo.stperiodo.getAt(modelo.stperiodo.find('idperiodo', vista.cbPeriodo.getValue())).data.fin;
            else if (vista.cbEjercicio.getValue() != '')
                this.fechafin = modelo.stejercicio.getAt(modelo.stejercicio.find('idejercicio', vista.cbEjercicio.getValue())).data.fin;
        };

        //funcion que llena el arreglo de entidades seleccionadas
        // this.arrEntidades = function() {
        //     sm = Ext.getCmp('gpEntidad').getSelectionModel();
        //     cant = sm.getCount();
        //     seleccionados = sm.getSelections();
        //     arrentidades = new Array();
        //     for (i = 0; i < cant; i++) {
        //         arrentidades.push(seleccionados[i].data.idestructuracomun);
        //     }
        //     return arrentidades;
        // };

        //Funcion encargada de construir los datos para el reporte
        this.construirdatosReporte = function(responseData) {
            resumen = responseData.resumen;
            desglose = responseData.desglose;
            insTransito = new Array();
            datosGenerales = new Object();
            datosCuerpo = new Array();
            datoPie = responseData.usuario;
            idreporte = '120001';
            //Condición que verifica si se recuperaron datos
            if (resumen.length > 0) {
                for (i = 0; i < resumen.length; i++) {
                    datos = new Array();

                    datos.push({
                        idcuentabancaria: resumen[i][0].idcuentabancaria,
                        nombrecuentabancaria: resumen[i][0].nombrecuentabancaria,
                        concatcuentabancaria: resumen[i][0].concatcuentabancaria
                    });
                    for (j = 1; j < resumen[i].length; j++) {
                        datos.push(resumen[i][j]);
                    }

                    //Llenado del arreglo de los instrumentos en transito
                    idcuentabancaria = resumen[i][0].idcuentabancaria;
                    instrumentosT = new Array();
                    for (k = 0; k < desglose.length; k++) {
                        if (desglose[k].length > 0 && idcuentabancaria === desglose[k][0].idcuentabancaria) {
                            instrumentosT = desglose[k];
                            instrumentosT.unshift({
                                idcuentabancaria: resumen[i][0].idcuentabancaria,
                                nombrecuentabancaria: resumen[i][0].nombrecuentabancaria,
                                concatcuentabancaria: resumen[i][0].concatcuentabancaria,
                                flag: '1',
                                nombrecliente: 'flag'
                            });
                            break;
                        }
                    }
                    if (instrumentosT.length === 0) {
                        instrumentosT.push({
                            idcuentabancaria: resumen[i][0].idcuentabancaria,
                            nombrecuentabancaria: resumen[i][0].nombrecuentabancaria,
                            concatcuentabancaria: resumen[i][0].concatcuentabancaria,
                            flag: '1',
                            nombrecliente: 'flag'
                        });
                    }

                    //Llenado del arrglo para los datos del cuerpo del reporte
                    datosCuerpo.push({tiporeporte: vista.cbtipoMetdConc.getValue(), listEstatico: datos, instrumentosT: instrumentosT, salto: 'break'});
                }

                //Llenar los datos generales
                datosGenerales = {
                    fechainicio: responseData.fechainicio,
                    fechafin: responseData.fechafin,
                    identidad: resumen[0][0].identidad,
                    codigoentidad: resumen[0][0].codigoentidad,
                    descripcionentidad: resumen[0][0].descripcionentidad,
                    tipocuentabancaria: resumen[0][0].texo,
                    titulo: 'CONCILIACION MENSUAL'
                };

                return new Array({
                    datoGeneral: datosGenerales,
                    datoCuerpo: datosCuerpo,
                    datoPie: datoPie,
                    reporte: idreporte
                });
            }else{
                return -1;
            }
        };

       // Funcion para cargar los datos del reporte
        vista.btnVistaReporte.on('click', function() {
            scope.fShowReporte();
        }, this);
       


this.fShowReporte = function () {
    Ext.Msg.wait('Cargando', 'Por favor espere...');
    Ext.Ajax.request({
        url: 'mostrarDataReporte',
        method: 'POST',
        params: {
                        //tipocuenta: Ext.encode(arraytipo),
                        fechainicio: this.fechainicio,
                        fechafin: this.fechafin,
                        identidades: vista.cbxEntidad.getValue(),//Ext.encode(this.arrEntidades()),
                        nodoc: vista.labelDoc.getValue(),
                        tiporep: vista.cbtipoMetdConc.getValue(),
                        tipooperacion: vista.cbOperacion.getValue(),
                        grupoNAE:vista.NAEEdit.getValue(),
                        especialidad: vista.comboespecialidad.getValue(),
                        elementgasto: vista.elementoGasto.getValue()
                    },
        callback: function (options, success, response) {
            if(response.responseText == -1)
            {
                Ext.MessageBox.hide();
                var msg="No existen reportes que correspondan con esta busqueda"
                mostrarMensaje(1, msg);
            }
            else
            {
                Ext.MessageBox.hide();
                var responseData = Ext.decode(response.responseText);
                if (responseData)
                    scope.fOpenWindowReport(responseData);

            }

        }
    });
};

this.fOpenWindowReport = function (datosReporte) {
    defaultComponentsValue = {
        paperSize: "A4",
        orientation: "Horizontal",
        reportType: "HTML"
    };
    Ext.MessageBox.hide();
    var printView = new SCFPrintView(datosReporte, "/contabilidad/comun/SCFPrintView/", defaultComponentsValue);
    printView.show();
};


        //
        // function() {
        //     vista.addMascaraBody();
        //     vista.MostrarEtiquetas(Ext.getBody(), idioma.msgCargando);
        //
        //     var arraytipo = new Array();
        //     arraytipo.push(vista.cbconcepto.getValue());
        //
        //     arrentidades = this.arrEntidades();
        //
        //     Ext.Ajax.request({
        //         url: 'calcularconciliacion',
        //         method: 'POST',
        //         scope: this,
        //         params: {
        //             tipocuenta: Ext.encode(arraytipo),
        //             fechainicio: this.fechainicio,
        //             fechafin: this.fechafin,
        //             identidades: Ext.encode(arrentidades),
        //             tiporep: vista.cbtipoMetdConc.getValue()
        //         },
        //         callback: function(options, success, response) {
        //             var responseData = Ext.decode(response.responseText);
        //             //variable que almacena los datos construidos
        //             var datosReporte = this.construirdatosReporte(responseData);
        //             if (datosReporte === -1) {
        //                 vista.lMask.hide();
        //                 vista.delMascaraBody();
        //                 mostrarMensaje(1, idioma.msgNoRecuperacion);
        //             } else {
        //                 printView = vista.crearPrintView(datosReporte, {paperSize: "A4", orientation: "Horizontal", reportType: "HTML"});
        //                 printView.show();
        //                 vista.lMask.hide();
        //                 vista.delMascaraBody();
        //             }
        //         }
        //     });
        // };
    }
};
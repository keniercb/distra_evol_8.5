Ext.namespace('Ext.CICancelacion');
Ext.CICancelacion.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: '/contabilidad/comun/componentes/CargaInicialCancelacion/',
    etiquetas: undefined,
    objVentana: undefined,
    idObjCancelar: undefined,//id del objecto a cancelar
    signo: 28,//signo de la operacion, lo defino aki porsi va a ser dinamico
    constructor: function(params)
    {
        this.crearSetsAndGets();

        this.setIdSubsistema(params.idSubsistema);
        this.setFuncionalidad(params.funcionalidad);
        this.setArrayIdObjCancelar(params.arrayIdObj);
        this.setIdMoneda(params.idMoneda);
        // this.setEtiquetas(params.etiquetas);

        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: this.url + 'CICancelacionView',
                id: 'CICancelacionView',
            },
            {
                url: this.url + 'CICancelacionModel',
                id: 'CICancelacionModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentCICancelacion();
        }.bind(this));

        Ext.CICancelacion.Controller.superclass.constructor.call(this);
        this.addEvents({
            'close': true,
            'cancelar': true
        });
    },
    loadMessageBox: function (msg = 'Cargando...', title = 'Por favor espere...') {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            progress: true,
            closable: false
        });//manera de ocultarlo Ext.MessageBox.hide();
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++)
            setTimeout(f(i), i * 500);
    },
    hideMessageBox: function () {
        Ext.MessageBox.hide();
    },
    initComponentCICancelacion: function()
    {
        var modelo = new Ext.CICancelacion.Model();
        var ventana = new Ext.CICancelacion.View(modelo, {
            etiquetas: this.getEtiquetas()
        });
        this.setModelo(modelo);
        this.setVentana(ventana);
        this.crearFunciones(ventana, modelo);
        this.crearEventos(ventana, modelo);
        this.loadDataComponent(ventana, modelo);
    },
    loadDataComponent: function(ventana, model)
    {
        Ext.MessageBox.hide();
        ventana.show();
        ventana.crearFormSteps();
        ventana.loadMask();
        model.getStoreOperacion().load({
            scope: this,
            params: {
                idSubsistema: this.getIdSubsistema(),
                signo: this.getSignoOperacion(),
                idmoneda: this.getIdMoneda()
            },
            callback: function (re, opts, success) {
                if (success) {
                    ventana.hideMask();
                }
            }
        });
    },
    crearEventos: function(ventana, model)
    {
        model.getStoreOperacion().on('load', function (store, records, opt) {
            if (records.length <= 0){
                // mostrarMensaje(1, cmp.etiquetas.lbMsgNoOperaciones);
                mostrarMensaje(1, 'No hay operaciones disponibles de signo cancelacion.');
            } else if (records.length === 1) {
                ventana.getCbOperacion().setValue(records[0].get('idnomoperaciones'));
                ventana.getCbOperacion().fireEvent('select', null, records[0], 0);
                ventana.getCbOperacion().disable();
            } else {
                ventana.getCbOperacion().enable();
            }
        }, this);

        ventana.getCbOperacion().on('select', function (combo, record, index) {
            ventana.getCbCuenta().reset();
            var modelo = model.getStoreOperacion().data.items[index].json.modelo;
            var idcuenta = [];
            if (modelo) {
                for (var i = 0; i < modelo.length; i++) {
                    if (modelo[i].cuentas) {
                        var temp = Ext.decode(modelo[i].cuentas);
                        idcuenta.push(temp.idcuenta);
                    }

                }
                if (idcuenta.length > 0) {
                    model.getStoreCuenta().baseParams.arrayIdCuenta = Ext.encode(idcuenta);
                    ventana.getCbCuenta().load();
                } else {
                    mostrarMensaje(1, "Por favor configure correctamente el modelo de la operaci&oacute;n");
                }
            } else {
                mostrarMensaje(1, "La operaci&oacute;n asignada no tiene ningun modelo asociado");
            }
        }, this);

        ventana.getCbCuenta().on({
            scope: this,
            load: function (data) {
                var respondetext = Ext.decode(data.responseText);
                if (respondetext.datos.length == 1) {
                    ventana.getCbCuenta().setValue(respondetext.datos[0].idcuenta, respondetext.datos[0].text);
                    ventana.getCbCuenta().fireEvent('select', ventana.getCbCuenta(), {data: respondetext.datos[0]}, 0);
                }
                ventana.getCbCuenta().enable();
                ventana.getForm().getForm().isValid();
            },
            // select: function (combo, record, index) {
            //     if (!(/^699/.test(record.data.concatcta) || /^696\./.test(record.data.concatcta))) {
            //         // this.stLiquidar.baseParams.idmoneda = record.data.idmoneda;
            //     } else {
            //         // this.stLiquidar.baseParams.idmoneda = undefined;
            //     }
            // }
        });

        //saveRecargaFincimex
        ventana.on({
            scope: this,
            FormStepsCreado: function (formStep) {
                formStep.on({
                    scope: this,
                    // Nuevo: function (fnCallback) {
                    //     this.limpiarCamposForm();
                    //     this.habilitarDesabilitarCampos(1);
                    //     fnCallback.call();
                    // },
                    Crear: function (fnCallback, cerrarVentana) {
                        // var fn = function (id) {
                        //     this.habilitarDesabilitarCampos(0);
                        //     fnCallback.call(undefined, id);
                        // }.bind(this);
                        // this.saveRecargaFincimex(fn, cerrarVentana);
                        this.loadDataCancelacion();
                    },
                    // Confirmar: function (fnCallback, id) {
                    //     this.fireEvent('confirmar', id, fnCallback);
                    // },
                    // Postear: function (fnCallback, id) {
                    //     this.fireEvent('postear', id, fnCallback);
                    // },
                });
            }
        });

    },
    crearFunciones: function(ventana, model)
    {
        this.loadDataCancelacion = function () {
            this.loadMessageBox();
            var arrayIdObj = this.getArrayIdObjCancelar();
            var idSubsistema = this.getIdSubsistema();
            var funcionalidad = this.getFuncionalidad();
            var idOperacion = ventana.getCbOperacion().getValue();
            var idCuenta = ventana.getCbCuenta().getValue();


            Ext.Ajax.request({
                url: '/contabilidad/comun/componentes/index.php/componentes/loadDataComprobanteCancelacion',
                method: 'POST',
                scope: this,
                params: {
                    arrayIdObj: Ext.encode(arrayIdObj),
                    idSubsistema: idSubsistema,
                    funcionalidad: funcionalidad,
                    idOperacionCancelar: idOperacion,
                    idCuentaCancelar: idCuenta
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    this.fireEvent('cancelar', responseData);
                    // this.hideMessageBox();
                    ventana.close();
                }
            });
        };

    },
    crearSetsAndGets: function()
    {
        this.setVentana = function (ventana) {
            this.objVentana = ventana;
        };
        this.getVentana = function () {
            return this.objVentana;
        };
        this.setModelo = function (modelo) {
            this.objModel = modelo;
        };
        this.getModelo = function () {
            return this.objModel;
        };
        this.setSignoOperacion = function (signo) {
            this.signo = signo;
        };
        this.getSignoOperacion = function () {
            return this.signo;
        };
        this.setArrayIdObjCancelar = function (arrayIdObj) {
            this.arrayIdObj = arrayIdObj;
        };
        this.getArrayIdObjCancelar = function () {
            return this.arrayIdObj;
        };
        this.setIdMoneda = function (idMoneda) {
            this.idMoneda = idMoneda;
        };
        this.getIdMoneda = function () {
            return this.idMoneda;
        };
        this.setIdSubsistema = function (idSubsistema) {
            this.idSubsistema = idSubsistema;
        };
        this.getIdSubsistema = function () {
            return this.idSubsistema;
        };
        this.setFuncionalidad = function (funcionalidad) {
            this.funcionalidad = funcionalidad;
        };
        this.getFuncionalidad = function () {
            return this.funcionalidad;
        };
        this.setEtiquetas = function (etiquetas) {
            this.etiquetas = etiquetas;
        };
        this.getEtiquetas = function () {
            return this.etiquetas;
        };
    }
});

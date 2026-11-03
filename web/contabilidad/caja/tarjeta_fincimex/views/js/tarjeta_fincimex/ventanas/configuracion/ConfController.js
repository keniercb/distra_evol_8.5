Ext.namespace('Ext.GestionarTarjetaOperConf');
Ext.GestionarTarjetaOperConf.Controller = Ext.extend(Ext.Component, {
    lmask: undefined,
    url: undefined,
    etiquetas: undefined,
    objVentana: undefined,
    ajaxCalls: undefined,
    constructor: function(params)
    {
        this.loadMessageBox = params.loadMessageBox;
        this.ajaxCalls = params.ajaxCalls;
        this.setUrl(params.url);
        this.setEtiquetas(params.etiquetas);
        this.loadMessageBox();

        requireJS.loadJsArray([
            {
                url: params.url + 'ventanas/configuracion/ConfView',
                id: 'TajertaOperConfView',
            },
            {
                url: params.url + 'ventanas/configuracion/ConfModel',
                id: 'TajertaOperConfModel',
            },
            {
                url: "/contabilidad/comun/js/FormSteps",
                id: 'FormSteps'
            },
        ], function () {
            this.initComponentTarjetaOperConf();
        }.bind(this));

        Ext.GestionarTarjetaOperConf.Controller.superclass.constructor.call(this);
        // this.addEvents({
        //     'Nuevo': true,
        //     'Crear': true,
        //     'Confirmar': true,
        //     'Postear': true,
        // });
    },
    setUrl: function(url)
    {
        this.url = url;
    },
    getUrl: function()
    {
        return this.url;
    },
    setEtiquetas: function(etiquetas)
    {
        this.etiquetas = etiquetas;
    },
    getEtiquetas: function()
    {
        return this.etiquetas;
    },
    setVentana: function(ventana)
    {
        this.objVentana = ventana;
    },
    getVentana: function()
    {
        return this.objVentana;
    },
    initComponentTarjetaOperConf: function()
    {
        var ventana = new Ext.GestionarTarjetaOperConf.View({
            etiquetas: this.getEtiquetas()
        });
        this.setVentana(ventana);
        this.loadDataComponent();
        this.crearFunciones();
        this.crearEventos();
    },
    loadDataComponent: function()
    {
        var ventana = this.getVentana();
        var fn = function (options, success, response) {
            var res = Ext.decode(response.responseText);
            if (success) {
                if (res) {
                    this.idConexion = res.idconexion;
                    ventana.tfHost.setValue(res.host);
                    ventana.nfPuerto.setValue(res.puerto);
                    ventana.tfBdNombre.setValue(res.basedato);
                    ventana.tfUsuario.setValue(res.usuario);
                    ventana.tfPassWord.setValue(res.password);
                }
                ventana.show();
                ventana.crearFormSteps();
            }
            Ext.MessageBox.hide();
        }.bind(this);

        this.ajaxCalls.cargarDatosBD(undefined, fn);
    },
    crearEventos: function()
    {
        var ventana = this.getVentana();

        ventana.btnPrueba.on({
            scope: this,
            click: function () {
                var params = {
                    scope: this,
                    params: {
                        host: ventana.tfHost.getValue(),
                        puerto: ventana.nfPuerto.getValue(),
                        basedato: ventana.tfBdNombre.getValue(),
                        usuario: ventana.tfUsuario.getValue(),
                        password: ventana.tfPassWord.getValue(),
                    }
                };
                this.loadMessageBox();
                this.ajaxCalls.probarConexionBD(params, this.callBackTest);
            }
        });

        ventana.btnAceptar.on({
            scope: this,
            click: function () {
                var params = {
                    scope: this,
                    params: {
                        idconexion: this.idConexion,
                        host: ventana.tfHost.getValue(),
                        puerto: ventana.nfPuerto.getValue(),
                        basedato: ventana.tfBdNombre.getValue(),
                        usuario: ventana.tfUsuario.getValue(),
                        password: ventana.tfPassWord.getValue(),
                    }
                };
                this.loadMessageBox();
                this.ajaxCalls.guardarDatosBD(params, this.callBackGuardarDatosBD);
            }
        });

    },
    crearFunciones: function functionName()
    {

        this.callBackTest = function (options, success, response) {
            var obj = Ext.decode(response.responseText);
            if (success) {
                if (obj.codMg == 1) {
                    mostrarMensaje(1, 'Se pudo establecer la conexion.');
                } else if (obj.codMg == -1) {
                    mostrarMensaje(1, 'No se pudo establecer la conexion debido al siguiente error: ' + obj.msg);
                }
            }
            Ext.MessageBox.hide();
        };

        this.callBackGuardarDatosBD = function (options, success, response) {
            var obj = Ext.decode(response.responseText);
            if (success) {
                if (obj.codMg == 1) {
                    mostrarMensaje(1, 'Se guardo exitosamente la configuración.');
                }
                this.getVentana().close();
            }
            Ext.MessageBox.hide();
        }.bind(this);

    }
});

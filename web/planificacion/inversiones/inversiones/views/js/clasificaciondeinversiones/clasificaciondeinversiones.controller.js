Ext.ns('Gestionar.clasifinversiones');

UCID.portal.cargarEtiquetas('clasificaciondeinversiones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.clasifinversiones.Modelo;
    modelo.init();


    var vista = Gestionar.clasifinversiones.Vista;
    vista.init(idioma, modelo);
    var adicionar;
    var modificar;
    var acciones;
    var aceptar;
    var aplicar;
    var cancelar;
    var validarNomDenom;
    Gestionar.clasifinversiones.Controlador.init(idioma, vista, modelo);
});

Gestionar.clasifinversiones.Controlador = {
    init: function(idioma, vista, modelo) {

        aceptar = function aceptar(modificar) {
            if (vista.formulario_general_inversiones.getForm().isValid()) {
                if (modificar == 'mod') {
                    mymask.show();
                    Ext.Ajax.request({
                        url: 'modificar',
                        waitMsg: "Cargando...",
                        params: {
                            idformatoetapa: vista.formato.getValue(),
                            denominacion: Ext.getCmp('iddenominversiones').getValue(),
                            idtipoinversion: vista.grid_gestionar_inversiones.getSelectionModel().getSelected().data.idtipoinversion
                        },
                        callback: function(options, success, response) {
                            mymask.hide();
                            _this.window_general_inversiones.hide();
                            mostrarMensaje(1, 'La clasificación ha sido modificada satisfactoriamente.');
                            modelo.store_gestionar_inversiones.reload();

                        }
                    });
                } else {
                    mymask.show();
                    Ext.Ajax.request({
                        url: 'adicionar',
                        waitMsg: "Cargando...",
                        params: {
                            formato: vista.formato.getValue(),
                            denominacion: Ext.getCmp('iddenominversiones').getValue()
                        },
                        callback: function(options, success, response) {
                            mymask.hide();
                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                mostrarMensaje(1, 'La clasificación ha sido adicionada satisfactoriamente.');
                                modelo.store_gestionar_inversiones.reload();
                                _this.window_general_inversiones.hide();
                                _this.formulario_general_inversiones.getForm().reset();
                            } else if (responseData.codMsgA == 0) {
                                mostrarMensaje(1, 'La clasificación que quiere adicionar ya existe.');
                            }
                        }
                    });

                }
            }
            else {
                mostrarMensaje(3, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
            }
        }

        cancelar = function cancelar() {
            vista.formulario_general_inversiones.getForm().reset();
            vista.window_general_inversiones.hide();
        }

        aplicar = function aplicar() {
            if (vista.formulario_general_inversiones.getForm().isValid()) {
                mymask.show();
                Ext.Ajax.request({
                    url: 'adicionar',
                    waitMsg: "Cargando...",
                    params: {
                        formato: vista.formato.getValue(),
                        denominacion: Ext.getCmp('iddenominversiones').getValue()
                    },
                    callback: function(options, success, response) {
                        mymask.hide();
                        mostrarMensaje(1, 'La clasificación ha sido adicionada satisfactoriamente.');
                        modelo.store_gestionar_inversiones.reload();
                    }
                });

            }
            else {
                mostrarMensaje(3, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
            }
            vista.formulario_general_inversiones.getForm().reset();
        }

        acciones = function AccionesAddModElim(interfaz) {
            if (interfaz == 'add') {
	    Ext.getCmp('btnApl').show();
                modelo.stFormato.reload();
                vista.btn_modificar_inversiones.disable();
                vista.btn_eliminar_inversiones.disable();
                vista.window_general_inversiones.setTitle(idioma.vtadicionar);
                vista.window_general_inversiones.show();
            }
            else if (interfaz == 'mod') {
                Ext.getCmp('btnApl').hide();
                recordSelInver = vista.sm_inversiones.getSelected();
                vista.denominacion.setValue(recordSelInver.data.clasificacion);
                vista.window_general_inversiones.setTitle(idioma.vtmodificar);
                vista.window_general_inversiones.show();
            }

        }

        Ext.getCmp('btnMenuAsociacion').on('click', function() {
            _this.mymask.show();
            _this.asociar = true;
            modelo.stDocumento.load({
                callback: function(options, success, response) {
                    _this.mymask.hide();
                    vista.window_asocdoc.show();
                }
            });
        });

        vista.btn_aceptar_asocdoc.on('click', function(){
           var store = vista.gpdocumento.getStore();
           var id_documento = null;
           for (var i = 0; i < store.getCount(); i++) {
                if(document.getElementById('checkbox-' + store.getAt(i).id).checked == true)
                    id_documento = store.getAt(i).id;
            }

            arrayTiposInv = new Array();
            modelo.store_gestionar_inversiones.each(function (record) {//console.log(record.data);
                arrayTiposInv.push(record.data.idtipoinversion);
            });
            if(arrayTiposInv.length > 0) {
                if (id_documento != null) {


                    mymask.show();
                    Ext.Ajax.request({
                        url: 'guardarDocumentoTipoInversion',
                        //waitMsg: "Cargando...",
                        params: {
                            iddocumento: id_documento,
                            idtiposinversion: Ext.encode(arrayTiposInv)
                        },
                        callback: function (options, success, response) {

                            responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                mostrarMensaje(1, 'El documento se ha asociado satisfactoriamente');
                                vista.window_asocdoc.hide();
                                mymask.hide();
                                modelo.store_gestionar_inversiones.load();
                            }
                        }
                    });

                } else {
                    mostrarMensaje(1, 'Debe seleccionar primero un tipo de documento.');
                }
            }else
               mostrarMensaje(1, 'Debe existir al menos una clasificaci\xF3n de inversiones.');

        });


        vista.denominacion.on({
            keyup: function(tf, e) {
                if (tf.getValue() != '') {
                    vista.btn_aceptar_inversiones.enable();
                    vista.btn_aplicar_inversiones.enable();
                }
                else
                {
                    vista.btn_aceptar_inversiones.disable();
                    vista.btn_aplicar_inversiones.disable();
                }
            }

        });
        vista.window_general_inversiones.on({
            hide: function() {
                vista.btn_aceptar_inversiones.disable();
                vista.btn_aplicar_inversiones.disable();
            }

        });
        modelo.store_gestionar_inversiones.on('load', function() {
            if (vista.filtrosinversiones.getFiltrosActivos().length > 0 && modelo.store_gestionar_inversiones.getCount() == 0) {
                mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
            }

        });

        vista.btn_ayuda_inversiones.focus();

        //crear los tooltips de los grid
        function crearToolTip(v, m) {
            m.attr = 'ext:qtip="' + v + '"';
            return v;
        }
        //aceptar = function aceptar(modificar){
        validarNomDenom = function validarNomDenom(interfaz) {
            mymask.show();
            Ext.Ajax.request({
                method: "POST",
                url: "mismadenominacion",
                params: {
                    denominacion: Ext.getCmp('iddenominversiones').getValue()
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        mostrarMensaje(1, 'idioma.mismoDenForComp');
                        mymask.hide();
                    } else
                        _this.aceptar(interfaz);
                }
            });
        };
        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: 'Cargando...'
        });
        modelo.store_gestionar_inversiones.load({
            params: {
                start: 0,
                limit: 20
            }
        });




    }


}
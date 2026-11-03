Ext.ns('Gestionar.estadostransiciones');

Ext.QuickTips.init();
UCID.portal.cargarEtiquetas('gestestadostransiciones', function(perfil, idioma) {
    idioma = (idioma) ? idioma : perfil.etiquetas;

    var modelo = Gestionar.estadostransiciones.Modelo;
    modelo.init();

    var vista = Gestionar.estadostransiciones.Vista;
    vista.init(idioma, modelo);

    var accion;
    var ventana = false;

    var accionesAddModElimEstado;
    var accionesAddModElimFlujo;
    var accionesAddModElimTransicion;

    var accionesAceptarEstado;
    var accionesCancelarEstado;
    var accionesAplicarEstado;

    var accionesAceptarFlujo;
    var accionesCancelarFlujo;
    var accionesAplicarFlujo;

    var accionesAceptarTransicion;
    var accionesCancelarTransicion;
    var accionesAplicarTransicion;

    var accionesLimpEstado;
    var accionesLimpFlujo;
    var accionesLimpTrans;

    Gestionar.estadostransiciones.Controlador.init(idioma, vista, modelo);
});

Gestionar.estadostransiciones.Controlador = {
    init: function(idioma, vista, modelo) {
        _this.userAutorizadosViejos;
        vista.btnAyudaFunc.focus();

        modelo.stTransiciones.on('beforeload', function(st, record, ob) {
            st.baseParams.idflujo = vista.smFlujo.getSelected().data.idflujotrabajo;
            st.baseParams.start = 0;
            st.baseParams.limit = 20;


        });

        //---------------------------------Estado-------------------------------------------         
        accionesAddModElimEstado = function(interfaz) {
            if (interfaz == 'add') {
                vista.fpEstado.getForm().reset();
                vista.smEstados.clearSelections();
                vista.btnModificarEstado.disable();
                vista.btnEliminarEstado.disable();
                vista.wEstado.setTitle(idioma.twAddEstado);
                vista.wEstado.on({
                    beforeshow: function() {

                        Ext.getCmp('tfDen').focus(true, 700);
                    }
                });
                vista.wEstado.show();
            }
            else if (interfaz == 'mod') {
                vista.btnAceptarEstado.disable();
                _this.recordSelEstado = vista.smEstados.getSelected();
                vista.tfDenomEstado.setValue(_this.recordSelEstado.data.denominacion);
                vista.tfDescripEstado.setValue(_this.recordSelEstado.data.descripcion);
                vista.btnEliminarEstado.disable();
                vista.btnAplicarEstado.hide();
                vista.wEstado.setTitle(idioma.twModEstado);
                vista.wEstado.show();
            }
            else {
                if (vista.smEstados.getSelected().data.uso != 1) {
                    function eliminarEstado() {
                        mostrarMensaje(2, idioma.textConfiElim + 'el(los) estado(s) ' + idioma.textConfiElim1, elimina);
                        function elimina(btn) {
                            if (btn == 'ok') {
                                _this.estados = [];
                                _this.recordsSelEstados = vista.gpEstados.getSelectionModel().getSelections();
                                for (var i = 0; i < _this.recordsSelEstados.length; i++) {
                                    _this.estados.push({
                                        idestado: _this.recordsSelEstados[i].data.idestadosft
                                    });
                                }
                                Ext.Ajax.request({
                                    url: 'eliminarEstado',
                                    waitMsg: "Cargando...",
                                    params: {
                                        idestado: Ext.encode(_this.estados)
                                    },
                                    callback: function(options, success, response) {
                                        var responseData = Ext.decode(response.responseText);
                                        if (responseData.codMsgg == 1) {
                                            vista.smEstados.clearSelections();
                                            vista.btnModificarEstado.disable();
                                            vista.btnEliminarEstado.disable();
                                            mostrarMensaje(1, 'El(Los) estado(s)' + idioma.textEliminadoSatis);
                                            modelo.stEstados.reload({params: {
                                                    start: 0,
                                                    limit: 20
                                                }});
                                        }
                                    }
                                });
                            }
                        }
                    }
                    eliminarEstado();
                }
                else {
                    mostrarMensaje(1, idioma.textEstadoUso);
                }
            }
        }


        accionesAceptarEstado = function(accion) {

            if (vista.fpEstado.getForm().isValid()) {
                if (accion == 'add') {
                    Ext.Ajax.request({
                        url: 'adicionarEstado',
                        waitMsg: "Cargando...",
                        params: {
                            denominacion: vista.tfDenomEstado.getValue(),
                            descripcion: vista.tfDescripEstado.getValue()
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpEstado.getForm().reset();
                                vista.wEstado.hide();
                                vista.btnModificarEstado.disable();
                                vista.smEstados.clearSelections();
                                mostrarMensaje(1, 'El estado' + idioma.textAdicionadoSatis);
                                modelo.stEstados.reload({params: {
                                        start: 0,
                                        limit: 20
                                    }});

                            } else if (responseData.codMsg == 0) {
                                mostrarMensaje(1, 'El estado' + idioma.msgExiste);
                            }


                        }
                    });
                }
                else {
                    Ext.Ajax.request({
                        url: 'modificarEstado',
                        waitMsg: "Cargando...",
                        params: {
                            denominacion: vista.tfDenomEstado.getValue(),
                            descripcion: vista.tfDescripEstado.getValue(),
                            idestado: vista.smEstados.getSelected().data.idestadosft
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {

                                vista.fpEstado.getForm().reset();
                                vista.wEstado.hide();
                                vista.btnModificarEstado.disable();
                                vista.smEstados.clearSelections();
                                mostrarMensaje(1, 'El estado' + idioma.textModificadoSatis);
                                modelo.stEstados.reload({params: {
                                        start: 0,
                                        limit: 20

                                    }});

                            } else {
                                mostrarMensaje(1, 'El estado' + idioma.msgExiste);
                            }

                        }
                    });
                }
            }
            else {
                mostrarMensaje(3, idioma.textMsgErrorAdd);
            }
        }

        accionesAplicarEstado = function(accion) {

            if (vista.fpEstado.getForm().isValid()) {

                Ext.Ajax.request({
                    url: 'adicionarEstado',
                    waitMsg: "Cargando...",
                    params: {
                        denominacion: vista.tfDenomEstado.getValue(),
                        descripcion: vista.tfDescripEstado.getValue()
                    },
                    callback: function(options, success, response) {

                        vista.fpEstado.getForm().reset();

                        vista.btnModificarEstado.disable();

                        mostrarMensaje(1, 'El estado' + idioma.textAdicionadoSatis);
                    }
                });
            }
            else {
                mostrarMensaje(3, idioma.textMsgErrorAdd);
            }
        }


        accionesCancelarEstado = function() {
            Ext.getCmp('fpEstado').getForm().reset();
            vista.wEstado.hide();
        }
        Ext.getCmp('btnCancelarEstado').on('click', function() {
            Ext.getCmp('fpEstado').getForm().reset();
            vista.tfDenomEstado.setValue('');
            vista.tfDescripEstado.setValue('');
            vista.wEstado.hide();
        });
        accionesLimpEstado = function() {
            vista.filtrosestados.clearFilters();
        }


        //---------------------------------Flujo de trabajo-------------------------------------------          


        accionesAddModElimFlujo = function(interfaz) {
            if (interfaz == 'add') {
                _this.gpTransiciones.collapse(true);
                vista.fpFlujo.getForm().reset();
                vista.smFlujo.clearSelections();
                vista.btnModificarFlujo.disable();
                vista.btnEliminarFlujo.disable();
                vista.smFlujo.clearSelections();
                vista.wFlujo.setTitle(idioma.twAddFlujo);
                vista.wFlujo.on({
                    beforeshow: function() {

                        vista.tfDenomFlujo.focus(true, 700);
                    }
                });
                vista.wFlujo.show();
            }
            else if (interfaz == 'mod') {
                vista.btnAceptarFlujo.disable();
                _this.gpTransiciones.collapse(true);
                _this.recordSelFlujo = vista.smFlujo.getSelected();
                vista.tfDenomFlujo.setValue(_this.recordSelFlujo.data.denominacion);
                vista.tfDescripFlujo.setValue(_this.recordSelFlujo.data.descripcion);
                vista.btnEliminarFlujo.disable();
                vista.btnAplicarFlujo.hide();
                vista.wFlujo.setTitle(idioma.twModFlujo);
                vista.wFlujo.show();
            }
            else {
                function eliminarFlujo() {
                    _this.gpTransiciones.collapse(true);
                    mostrarMensaje(2, idioma.textConfiElim + 'el(los) flujo(s) de trabajo' + idioma.textConfiElim1, elimina);
                    function elimina(btn) {
                        if (btn == 'ok') {
                            _this.idflujotrabajo = [];
                            _this.recordsSelFlujo = vista.gpFlujo.getSelectionModel().getSelections();
                            for (var i = 0; i < _this.recordsSelFlujo.length; i++) {
                                _this.idflujotrabajo.push({
                                    idflujo: _this.recordsSelFlujo[i].data.idflujotrabajo
                                });
                            }
                            Ext.Ajax.request({
                                url: 'eliminarFlujoTrabajo',
                                waitMsg: "Cargando...",
                                params: {
                                    idflujo: Ext.encode(_this.idflujotrabajo)
                                },
                                callback: function(options, success, response) {
                                    var responseData = Ext.decode(response.responseText);
                                    if (responseData.codMsgg == 1) {
                                        mostrarMensaje(1, idioma.msgFlujoEnUso);
                                        vista.btnModificarFlujo.disable();
                                        vista.btnModificarFlujo.disable();
                                        vista.btnEliminarFlujo.disable();
                                    }

                                    else if (responseData.codMsg == 0) {
                                        vista.btnModificarFlujo.disable();
                                        vista.btnModificarFlujo.disable();
                                        vista.btnEliminarFlujo.disable();
                                        mostrarMensaje(1, 'El(Los) flujo(s) de trabajo' + idioma.textEliminadoSatis);
                                        modelo.stFlujo.reload({params: {
                                                start: 0,
                                                limit: 20

                                            }});

                                    }
                                }
                            });
                        }
                    }
                }
                eliminarFlujo();
            }
        }




        accionesAceptarFlujo = function(accion) {
            if (vista.fpFlujo.getForm().isValid()) {
                if (accion == 'add') {
                    Ext.Ajax.request({
                        url: 'adicionarFlujoTrabajo',
                        waitMsg: "Cargando...",
                        params: {
                            denominacion: vista.tfDenomFlujo.getValue(),
                            descripcion: vista.tfDescripFlujo.getValue()
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpFlujo.getForm().reset();
                                vista.wFlujo.hide();
                                vista.btnModificarFlujo.disable();
                                vista.smFlujo.clearSelections();
                                mostrarMensaje(1, 'El flujo de trabajo' + idioma.textAdicionadoSatis);
                                modelo.stFlujo.reload({params: {
                                        start: 0,
                                        limit: 20

                                    }});

                            } else {
                                mostrarMensaje(1, 'El flujo de trabajo' + idioma.msgExiste);
                            }
                        }
                    });
                }
                else {
                    Ext.Ajax.request({
                        url: 'modificarFlujoTrabajo',
                        waitMsg: "Cargando...",
                        params: {
                            denominacion: vista.tfDenomFlujo.getValue(),
                            descripcion: vista.tfDescripFlujo.getValue(),
                            idflujotrabajo: vista.smFlujo.getSelected().data.idflujotrabajo
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpFlujo.getForm().reset();
                                vista.wFlujo.hide();
                                vista.btnModificarFlujo.disable();
                                vista.smFlujo.clearSelections();
                                mostrarMensaje(1, 'El estado' + idioma.textModificadoSatis);
                                modelo.stFlujo.reload({params: {
                                        start: 0,
                                        limit: 20

                                    }});

                            } else {
                                mostrarMensaje(1, 'El flujo de trabajo' + idioma.msgExiste);
                            }

                        }
                    });
                }
            }
            else {
                mostrarMensaje(3, idioma.textMsgErrorAdd);
            }
        }


        accionesCancelarFlujo = function() {
            Ext.getCmp('fpFlujo').getForm().reset();
            vista.tfDenomFlujo.setValue('');
            vista.tfDescripFlujo.setValue('');
            vista.wFlujo.hide();
        }

        accionesAplicarFlujo = function(accion) {
            if (vista.fpFlujo.getForm().isValid()) {
                Ext.Ajax.request({
                    url: 'adicionarFlujoTrabajo',
                    waitMsg: "Cargando...",
                    params: {
                        denominacion: vista.tfDenomFlujo.getValue(),
                        descripcion: vista.tfDescripFlujo.getValue()
                    },
                    callback: function(options, success, response) {

                        vista.fpFlujo.getForm().reset();
                        vista.btnModificarFlujo.disable();
                        vista.smFlujo.clearSelections();
                        mostrarMensaje(1, 'El flujo' + idioma.textAdicionadoSatis);

                    }
                });
            }
            else {
                mostrarMensaje(3, idioma.textMsgErrorAdd);
            }
        }

        vista.smFlujo.on({
            rowselect: function() {
                CambiarEstadoBotonesFlujo();
            }
        })
        function EstaSelecionadoFlujo() {
            return vista.smFlujo.hasSelection();
        }

        function CambiarEstadoBotonesFlujo() {

            if (EstaSelecionadoFlujo()) {
                vista.btnModificarFlujo.enable();
                vista.btnEliminarFlujo.enable();
                _this.btnAdicionarTrans.enable();
                vista.gpTransiciones.expand(true);
                modelo.stTransiciones.load();
            }
            else {
                vista.btnModificarFlujo.disable();
                vista.btnEliminarFlujo.disable();
                _this.btnModificarTrans.disable();
                _this.btnEliminarTrans.disable();
                _this.btnAdicionarTrans.disable();
                vista.gpTransiciones.collapse(true);
            }
        }


        accionesLimpFlujo = function() {
            vista.filtrosflujo.clearFilters();
        }

        //---------------------------------Transicion-------------------------------------------     


        _this.userAutIniciales = new Array();
        accionesAddModElimTransicion = function(interfaz) {
            _this.mymask.show();
            if (interfaz == 'add') {
                vista.fpTransicion.getForm().reset();
                vista.smTransiciones.clearSelections();
                vista.btnModificarTrans.disable();
                vista.btnEliminarTrans.disable();
                vista.wTransicion.setTitle(idioma.twAddTransicion);
                modelo.stTodosUser.load({
                    callback: function() {
                        vista.wTransicion.show();
                        _this.mymask.hide();
                    }
                });
            }
            else if (interfaz == 'mod') {
                modelo.stUserAutorizados.load({
                    params: {
                        idtransicion: vista.smTransiciones.getSelected().data.idtransicion
                    },
                    callback: function() {
                        modelo.stTodosUser.load({
                            callback: function() {
                                var userAut = new Array();
                                userAut = modelo.stUserAutorizados.getRange();
                                for (var i = 0; i < userAut.length; i++) {
                                    modelo.stTodosUser.remove(modelo.stTodosUser.getAt(modelo.stTodosUser.find('idusuario', userAut[i].data.idusuario)));
                                }
                                vista.fpUsers.enable();
                                _this.userAutIniciales = modelo.stUserAutorizados.getRange();
                                _this.mymask.hide();
                            }
                        });
                    }
                });

                vista.btnAceptarTransicion.disable();
                _this.recordSelTransicion = vista.smTransiciones.getSelected();
                vista.cbEstadoInic.setValue(_this.recordSelTransicion.data.estadoinicial);
                vista.cbEstadoFinal.setValue(_this.recordSelTransicion.data.estadofinal);

                if (_this.recordSelTransicion.data.inicial == 1) {
                    vista.chbEstadoInicial.checked = true;
                }
                vista.btnEliminarTrans.disable();
                vista.btnAplicarTransicion.hide();
                vista.wTransicion.setTitle(idioma.twModTransicion);
                vista.wTransicion.show();
            }
            else {
                function eliminarTransicion() {
                    mostrarMensaje(2, idioma.textConfiElim + 'la(s) transición(es)' + idioma.textConfiElim2, elimina);
                    _this.mymask.hide();
                    function elimina(btn) {
                        if (btn == 'ok') {

                            _this.transiciones = [];
                            _this.recordsSeltransiciones = vista.gpTransiciones.getSelectionModel().getSelections();
                            for (var i = 0; i < _this.recordsSeltransiciones.length; i++) {
                                _this.transiciones.push({
                                    idtrans: _this.recordsSeltransiciones[i].data.idtransicion
                                });
                            }

                            Ext.Ajax.request({
                                url: 'eliminarTransicion',
                                waitMsg: "Cargando...",
                                params: {
                                    idtrans: Ext.encode(_this.transiciones),
                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo
                                },
                                callback: function(options, success, response) {
                                    var responseData = Ext.decode(response.responseText);

                                    if (responseData.codMsgg == 1) {
                                        mostrarMensaje(1, idioma.textTransInicial);
                                    } else {
                                        vista.btnModificarTrans.disable();
                                        vista.smTransiciones.clearSelections();
                                        vista.btnModificarTrans.disable();
                                        vista.btnEliminarTrans.disable();
                                        mostrarMensaje(1, 'La(s) transición(es)' + idioma.textEliminadoSatis);
                                        modelo.stTransiciones.load();
                                    }
                                }
                            });

                        }
                    }
                }
                eliminarTransicion();
            }
        };

        accionesAceptarTransicion = function(accion) {
            if (vista.fpTransicion.getForm().isValid()) {
                if (vista.chbEstadoInicial.checked) {
                    estinicial = 1;
                } else {
                    estinicial = 0;
                }
                if (accion == 'add') {
                    var records = new Array();
                    records = modelo.stUserAutorizados.getRange();
                    arrUser = new Array();
                    for (var i = 0; i < records.length; i++) {
                        arrUser.push(records[i].data.idusuario);
                    }
                    Ext.Ajax.request({
                        url: 'adicionarTransicion',
                        waitMsg: "Cargando...",
                        params: {
                            idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                            idestadoinic: vista.cbEstadoInic.getRawValue(),
                            idestadofinal: vista.cbEstadoFinal.getRawValue(),
                            inicial: estinicial,
                            userAto: Ext.encode(arrUser)
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpTransicion.getForm().reset();
                                vista.smTransiciones.clearSelections();
                                vista.wTransicion.hide();
                                vista.btnModificarTrans.disable();
                                modelo.stTodosUser.removeAll();
                                modelo.stUserAutorizados.removeAll();

                                mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                modelo.stTransiciones.load();

                            } else if (responseData.codMsggg == 2) {
                                mostrarMensaje(3, idioma.msgErrorCombos);
                            } else if (responseData.codMsgggg == 3) {
                                function comprobarTransicionInicial() {
                                    Ext.MessageBox.confirm(idioma.textConfir, idioma.msgTransInicExiste, showResult);
                                    function showResult(btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: 'adicionarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    inicial: 1,
                                                    actualizar: 1
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        vista.wTransicion.hide();
                                                        vista.btnModificarTrans.disable();

                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            Ext.Ajax.request({
                                                url: 'adicionarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    inicial: 0,
                                                    actualizar: 0
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        vista.wTransicion.hide();
                                                        vista.btnModificarTrans.disable();

                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();

                                                    }
                                                }});
                                        }
                                    }
                                }
                                comprobarTransicionInicial();
                            }
                            else {
                                mostrarMensaje(1, 'La transición' + idioma.msgExiste);
                            }

                        }
                    });
                } else {
                    var records = new Array();
                    records = modelo.stUserAutorizados.getRange();
                    users = new Array();
                    userIniciales = new Array();
                    for (var i = 0; i < records.length; i++) {
                        users.push(records[i].data.idusuario);
                    }
                    for (var i = 0; i < _this.userAutIniciales.length; i++) {
                        userIniciales.push(records[i].data.idusuario);
                    }
                    Ext.Ajax.request({
                        url: 'modificarTransicion',
                        waitMsg: "Cargando...",
                        params: {
                            idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                            idtransicion: vista.smTransiciones.getSelected().data.idtransicion,
                            idestadoinic: vista.cbEstadoInic.getRawValue(),
                            idestadofinal: vista.cbEstadoFinal.getRawValue(),
                            inicial: estinicial,
                            userIniciales: Ext.encode(userIniciales),
                            users: Ext.encode(users)
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpTransicion.getForm().reset();
                                vista.smTransiciones.clearSelections();
                                vista.wTransicion.hide();
                                vista.btnModificarTrans.disable();
                                mostrarMensaje(1, 'El estado' + idioma.textModificadoSatis);
                                modelo.stTransiciones.load();

                            }
                            else if (responseData.codMsggg == 2) {
                                mostrarMensaje(3, idioma.msgErrorCombos);
                            } else if (responseData.codMsgggg == 3) {
                                function comprobarTransicionInicial() {
                                    Ext.MessageBox.confirm(idioma.textConfir, idioma.msgTransInicExiste, showResult);
                                    function showResult(btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: 'modificarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    idtransicion: vista.smTransiciones.getSelected().data.idtransicion,
                                                    inicial: 1,
                                                    actualizar: 1
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        vista.wTransicion.hide();
                                                        vista.btnModificarTrans.disable();

                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();

                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            Ext.Ajax.request({
                                                url: 'modificarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    idtransicion: vista.smTransiciones.getSelected().data.idtransicion,
                                                    inicial: 0,
                                                    actualizar: 0
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        vista.wTransicion.hide();
                                                        vista.btnModificarTrans.disable();

                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();

                                                    }
                                                }});
                                        }
                                    }
                                }
                                comprobarTransicionInicial();
                            } else {
                                mostrarMensaje(1, 'El flujo de trabajo' + idioma.msgExiste);
                            }

                        }
                    });
                }

            }
            else {
                mostrarMensaje(1, idioma.textMsgErrorAdd);
            }



        }


        vista.btnCancelarTransicion.on({
            click: function() {
                vista.fpTransicion.getForm().reset();
                vista.wTransicion.hide();

            }
        });



        vista.btnAplicarTransicion.on({
            click: function() {

                if (vista.fpTransicion.getForm().isValid()) {
                    if (vista.chbEstadoInicial.checked) {
                        estinicial = 1;
                    } else {
                        estinicial = 0;
                    }
                    Ext.Ajax.request({
                        url: 'adicionarTransicion',
                        waitMsg: "Cargando...",
                        params: {
                            idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                            idestadoinic: vista.cbEstadoInic.getRawValue(),
                            idestadofinal: vista.cbEstadoFinal.getRawValue(),
                            inicial: estinicial
                        },
                        callback: function(options, success, response) {

                            var responseData = Ext.decode(response.responseText);
                            if (responseData.codMsgg == 1) {
                                vista.fpTransicion.getForm().reset();
                                vista.smTransiciones.clearSelections();
                                modelo.stUserAutorizados.removeAll();
                                // vista.wTransicion.hide();
                                vista.btnModificarTrans.disable();
                               if(vista.smFlujo.getSelected().data.idflujotrabajo!=null)
                                modelo.stEstadosIniciales.reload();
                                mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                modelo.stTransiciones.load();

                            } else if (responseData.codMsggg == 2) {
                                mostrarMensaje(3, idioma.msgErrorCombos);
                            } else if (responseData.codMsgggg == 3) {
                                function comprobarTransicionInicial() {
                                    Ext.MessageBox.confirm(idioma.textConfir, idioma.msgTransInicExiste, showResult);
                                    function showResult(btn) {
                                        if (btn == 'yes') {
                                            Ext.Ajax.request({
                                                url: 'adicionarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    inicial: 1,
                                                    actualizar: 1
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        modelo.stUserAutorizados.removeAll();
                                                        vista.btnModificarTrans.disable();
                                                        if(vista.smFlujo.getSelected().data.idflujotrabajo!=null)
                                                            modelo.stEstadosIniciales.reload();
                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();

                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            Ext.Ajax.request({
                                                url: 'adicionarTransicion',
                                                waitMsg: "Cargando...",
                                                params: {
                                                    idflujo: vista.smFlujo.getSelected().data.idflujotrabajo,
                                                    idestadoinic: vista.cbEstadoInic.getRawValue(),
                                                    idestadofinal: vista.cbEstadoFinal.getRawValue(),
                                                    inicial: 0,
                                                    actualizar: 0
                                                },
                                                callback: function(options, success, response) {

                                                    var responseData = Ext.decode(response.responseText);
                                                    if (responseData.codMsgg == 1) {
                                                        vista.fpTransicion.getForm().reset();
                                                        vista.smTransiciones.clearSelections();
                                                        modelo.stUserAutorizados.removeAll();
                                                        vista.btnModificarTrans.disable();
                                                        if(vista.smFlujo.getSelected().data.idflujotrabajo!=null)
                                                            modelo.stEstadosIniciales.reload();
                                                        mostrarMensaje(1, 'La transición' + idioma.textAdicionadoSatis);
                                                        modelo.stTransiciones.load();

                                                    }
                                                }});
                                        }
                                    }
                                }
                                comprobarTransicionInicial();
                            }
                            else {
                                mostrarMensaje(1, 'La transición' + idioma.msgExiste);
                            }

                        }
                    });

                }
            }

        });

        accionesLimpTrans = function() {
            vista.filtrostransiciones.clearFilters();
        };



        vista.cbEstadoFinal.on({
            select: function() {
                vista.fpUsers.enable();
            }
        });

        _this.arrayidrecursosdesasoc = [];
        _this.arrayidrecursosasociados = [];
        vista.btnAsociarEstado.on({
            click: function() {
                _this.userAutorizadosViejos = modelo.stUserAutorizados.getRange();
                if (_this.smTodosUser.hasSelection()) {
                    var arrayusuariosparadesasociar = _this.smTodosUser.getSelections();
                    if (arrayusuariosparadesasociar.length > 0) {
                        for (var i = 0; i < arrayusuariosparadesasociar.length; i++) {
                            modelo.stUserAutorizados.add(arrayusuariosparadesasociar[i]);
                            _this.arrayidrecursosasociados[_this.arrayidrecursosasociados.length] = arrayusuariosparadesasociar[i].data.idusuario;
                            _this.arrayidrecursosdesasoc = _this.eliminar(arrayusuariosparadesasociar[i].data.idusuario, _this.arrayidrecursosdesasoc);

                            modelo.stTodosUser.remove(arrayusuariosparadesasociar[i]);
                        }

                    }

                }
            }
        });

        vista.btnDesAsociarEstado.on({
            click: function() {
                if (vista.smRightGrid.hasSelection()) {
                    var arrayusuariosparadesasociar = vista.smRightGrid.getSelections();
                    if (arrayusuariosparadesasociar.length > 0) {
                        for (var i = 0; i < arrayusuariosparadesasociar.length; i++) {
                            modelo.stTodosUser.add(arrayusuariosparadesasociar[i]);
                            _this.arrayidrecursosdesasoc[_this.arrayidrecursosdesasoc.length] = arrayusuariosparadesasociar[i].data.idusuario;
                            _this.arrayidrecursosasociados = _this.eliminar(arrayusuariosparadesasociar[i].data.idusuario, _this.arrayidrecursosasociados);
                            modelo.stUserAutorizados.remove(arrayusuariosparadesasociar[i]);
                        }

                    }

                }
            }
        });

        _this.eliminar = function(id, array) {
            var arreglonuevo = [];
            var cont = 0;
            for (var i = 0; i < array.length; i++) {
                if (array[i] != id) {
                    arreglonuevo[cont] = array[i]
                }
            }
            return arreglonuevo;
        };

        _this.mymask = new Ext.LoadMask(Ext.getBody(), {
            msg: idioma.lbCargando
        });


    }
};
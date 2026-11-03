Ext.namespace('CON.Util.FormSteps');
CON.Util.FormSteps = Ext.extend(Ext.Component, {
    /**
    * id para saber cual objeto(anticipo, pago, etc) confirmar postear etc
    */
    idObj: undefined,
    /**
    * arreglo de formularios
    */
    arrForm: undefined,
    /**
    * arreglo de grids
    * opcional para hacer comprobaciones al grid, debe venir
    * un arreglo de objetos {grid: [], ordenar: '', evaluar: [''], tipo: 'sm'}
    */
    arrGrid: undefined,
    /**
    * boton para limpiar los campos y empezar limpio
    */
    btnNuevo: undefined,
    /**
    * boton para guardar sin salir de la ventana
    */
    btnAplicar: undefined,
    /**
    * boton para guardar
    */
    btnGuardar: undefined,
    /**
    * boton para confirmar algo Guardado
    */
    btnConfirmar: undefined,
    /**
    * boton para postear algo confirmado
    */
    btnPostear: undefined,
    /**
     * la instancia de formvalidation.js
     */
    formValidador: undefined,
    /**
     * la instancia de FormGrid.js
     */
    formGrid: undefined,
    constructor: function (config) {
        this.crearSetAndGet();
        this.initializeClass(config);
        this.cargarDependencias();
        CON.Util.FormSteps.superclass.constructor.call(this);
        this.annadirEventos();

        this.validateForm();
        if (this.getGrids() instanceof Array) {
            this.formGrid = new CON.Util.FormGrid(this.getGrids(), this.getForm(), this.formValidador);
        }
    },
    loadJsSync: function (jsSrc, id = null) {
        var req = new XMLHttpRequest();
        req.open("GET", jsSrc + ".js", false);
        req.send(null);

        var headElement = document.getElementsByTagName("head")[0];
        var newScriptElement = document.createElement("script");
        newScriptElement.setAttribute("type", "text/javascript");
        if (id != null) {
            newScriptElement.setAttribute("id", id);
        }
        newScriptElement.text = req.responseText;
        headElement.appendChild(newScriptElement);
    },
    cargarDependencias: function () {
        if (typeof requireJS === 'undefined') {
            this.loadJsSync("/contabilidad/comun/js/LoadJs");
        }
        requireJS.loadJsSync("/contabilidad/comun/js/Util/Forms/FormValidation", 'FormValidationjs');
        if (this.getGrids() instanceof Array) {
            requireJS.loadJsSync("/contabilidad/comun/js/Util/Forms/FormGrid", 'FormGridjs');
        }
    },
    asignar: function (arrBtn, form, arrGrid) {
        this.asignarBtns(arrBtn);
        this.asignarForms(form);
        this.asignarGrids(arrGrid);
    },
    annadirEventos: function () {
        this.addEvents({
            'Nuevo': true,
            'Cancelar': true,
            'Crear': true,
            'Confirmar': true,
            'Postear': true,
        });
    },
    initializeClass: function (config) {
        this.initializeFunctions();
        this.asignar(config.arrBtn, config.arrForm, config.arrGrid);
        this.initializeEvents();

        if (this.getBtnNuevo()) {
            this.getBtnNuevo().enable();
        }
    },
    initializeEvents: function()
    {
        if (this.getBtnNuevo()) {
            this.getBtnNuevo().on('click', function (btn) {
                this.fireEvent('Nuevo', this.accionNuevo, this.limpiarCampos, this.desabilitarForm, this.formGrid ? this.formGrid.desabilitarGrid : function (){});//aka ay que limpiar los campos y habilitarlos donde se reciba este evento
            }, this);
        }

        if (this.getBtnCancelar()) {
            this.getBtnCancelar().on('click', function (btn) {
                this.fireEvent('Cancelar', this.accionCancelar, this.limpiarCampos, this.desabilitarForm, this.formGrid ? this.formGrid.desabilitarGrid : function (){});//aka ay que limpiar los campos y habilitarlos donde se reciba este evento
            }, this);
        }
        // aka en el evento crear se deben desabilitar los campos del formulario
        if (this.getBtnAplicar()) {
            this.getBtnAplicar().on('click', function (btn) {
                this.fireEvent('Crear', this.accionCrear, false, this.desabilitarForm, this.formGrid ? this.formGrid.desabilitarGrid : function (){});//paso falso pa no cerrar ventana
            }, this);
        }
        if (this.getBtnGuardar()) {
            this.getBtnGuardar().on('click', function (btn) {
                this.fireEvent('Crear', this.accionCrear, false, this.desabilitarForm, this.formGrid ? this.formGrid.desabilitarGrid : function (){});//paso true pa cerrar ventana
            }, this);
        }
        if (this.getBtnConfirmar()) {
            this.getBtnConfirmar().on('click', function (btn) {
                this.fireEvent('Confirmar', this.accionConfirmar, this.getIdObj());
            }, this);
        }
        if (this.getBtnPostear()) {
            this.getBtnPostear().on('click', function (btn) {
                this.fireEvent('Postear', this.accionPostear, this.getIdObj());
            }, this);
        }
    },
    initializeFunctions: function()
    {

        this.asignarBtns = function (arrBtn) {
            if (arrBtn instanceof Array) {
                for (var i = 0; i < arrBtn.length; i++) {
                    if (!(arrBtn[i] instanceof Ext.Button)) {
                        //console.log('Los elementos del arreglo debe ser una instancia de Ext.Button');
                        return false;
                    } else {
                        //Aka asigno segun algun criterio
                        arrBtn[i].disable();
                        var word = arrBtn[i].iconCls;
                        if (typeof word === 'string') {
                            word = word.toLowerCase();
                        }
                        if (word === 'icondistra-nuevo' || word === 'nuevo') {
                            this.setBtnNuevo(arrBtn[i]);
                        } else if (word === 'icondistra-aplicar' || word === 'aplicar') {
                            this.setBtnAplicar(arrBtn[i]);
                        } else if (word === 'icondistra-aceptar' || word === 'aceptar') {
                            this.setBtnGuardar(arrBtn[i]);
                        } else if (word === 'icondistra-confirmar' || word === 'confirmar') {
                            this.setBtnConfirmar(arrBtn[i]);
                        } else if (word === 'icondistra-contabilidad' || word === 'contabilidad') {
                            this.setBtnPostear(arrBtn[i]);
                        } else if (word === 'icondistra-cancelar' || word === 'cancelar') {
                            this.setBtnCancelar(arrBtn[i]);
                            arrBtn[i].enable();
                        } else {
                            arrBtn[i].enable();
                            //console.log('Este btn no correspode a ningun criterio', arrBtn[i]);
                        }
                    }
                }
            } else {
                //console.log('No se ha pasado un array de botones');
                return false;
            }
            return true;
        };

        this.asignarForms = function (forms) {
            if (forms instanceof Array) {
                for (var i = 0; i < forms.length; i++) {
                    if (!(forms[i] instanceof Ext.FormPanel)) {
                        return false;
                    }
                }
                this.setForm(forms);
                return true;
            } else if (forms instanceof Ext.FormPanel) {
                this.setForm([forms]);
                return true;
            } else {
                return false;
            }
        };

        this.asignarGrids = function (arrGrid) {
            if (arrGrid instanceof Array) {
                this.setGrids(arrGrid);
            }
        };

        this.validateForm = function () {
            if (this.getBtnAplicar() || this.getBtnGuardar()) {
                var forms = this.getForm();
                var arrBtn = this.getArrButtonsValidation();
                this.formValidador = new CON.Util.FormValidation(forms, arrBtn);
            }
        };

        this.accionNuevo = function () {
            this.resetIdOjt();
            this.formValidador.asignarValorInicial();
            // this.desabilitarCamposForm(false);
            // this.limpiarCampos();
            if (this.formGrid) {
                this.formGrid.actualizarFieldCheckGp();
            }
            if (this.getBtnConfirmar()) {
                this.getBtnConfirmar().disable();
            }
            if (this.getBtnPostear()) {
                this.getBtnPostear().disable();
            }
        }.bind(this);
        this.accionCrear = function (id) {//si se quiere se le pasa un id para tenerlo en los demas eventos
            if (id) {
                this.setIdObj(id);
            }
            // this.desabilitarCamposForm(true);
            this.formValidador.asignarValorInicial();
            if (this.getBtnConfirmar()) {
                this.getBtnConfirmar().enable();
            }
            if (this.getBtnPostear()) {
                this.getBtnPostear().disable();
            }
        }.bind(this);
        this.accionConfirmar = function () {
            if (this.getBtnConfirmar()) {
                this.getBtnConfirmar().disable();
            }
            if (this.getBtnPostear()) {
                this.getBtnPostear().enable();
            }
        }.bind(this);
        this.accionPostear = function () {
            if (this.getBtnConfirmar()) {
                this.getBtnConfirmar().disable();
            }
            if (this.getBtnPostear()) {
                this.getBtnPostear().disable();
            }
        }.bind(this);
        this.accionCancelar = function () {
            if (this.getBtnConfirmar()) {
                this.getBtnConfirmar().disable();
            }
            if (this.getBtnPostear()) {
                this.getBtnPostear().disable();
            }
        }.bind(this);

        this.desabilitarForm = function (flag) {
            var forms = this.getForm();
            for (var i = 0; i < forms.length; i++) {
                if (flag) {
                    forms[i].disable();
                } else {
                    forms[i].enable();
                }
            }
        }.bind(this);

        this.limpiarCampos = function () {
            var forms = this.getForm();
            for (var i = 0; i < forms.length; i++) {
                forms[i].getForm().reset();
            }
        }.bind(this);

    },
    crearSetAndGet: function () {

        this.setIdObj = function (id) {
            this.idObj = id;
        };
        this.getIdObj = function () {
            return this.idObj;
        };
        this.resetIdOjt = function () {
            this.idObj = undefined;
        };

        this.setGrids = function (arrGrid) {
            this.arrGrid = arrGrid;
        };
        this.getGrids = function () {
            return this.arrGrid;
        };

        this.setForm = function (arrForm) {
            this.arrForm = arrForm;
        };
        this.getForm = function () {
            return this.arrForm;
        };

        this.setBtnNuevo = function (btn) {
            this.btnNuevo = btn;
        };
        this.getBtnNuevo = function () {
            return this.btnNuevo;
        };

        this.setBtnAplicar = function (btn) {
            this.btnAplicar = btn;
        };
        this.getBtnAplicar = function () {
            return this.btnAplicar;
        };

        this.setBtnGuardar = function (btn) {
            this.btnGuardar = btn;
        };
        this.getBtnGuardar = function () {
            return this.btnGuardar;
        };

        this.setBtnConfirmar = function (btn) {
            this.btnConfirmar = btn;
        };
        this.getBtnConfirmar = function () {
            return this.btnConfirmar;
        };

        this.setBtnPostear = function (btn) {
            this.btnPostear = btn;
        };
        this.getBtnPostear = function () {
            return this.btnPostear;
        };

        this.setBtnCancelar = function (btn) {
            this.btnCancelar = btn;
        };
        this.getBtnCancelar = function () {
            return this.btnCancelar;
        };

        this.getArrButtonsValidation = function () {
            var arr = [];
            if (this.getBtnAplicar()) {
                arr.push(this.getBtnAplicar());
            }
            if (this.getBtnGuardar()) {
                arr.push(this.getBtnGuardar());
            }
            return arr;
        };

    },
});

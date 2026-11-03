Ext.namespace('Ext.FormSteps');
Ext.FormSteps = Ext.extend(Ext.Component, {
    idObj: undefined,//id para saber cual objeto(anticipo, pago, etc) confirmar postear etc
    form: undefined,
    arrGrid: undefined,//opcional para hacer comprobaciones al grid, debe venir
    //un arreglo de objetos {grid: [], ordenar: '', evaluar: [''], tipo: 'sm'}
    btnNuevo: undefined,//boton para limpiar los campos y empezar limpio
    btnAplicar: undefined,//boton para guardar sin salir de la ventana
    btnGuardar: undefined,//boton para guardar y salir de las ventana
    btnConfirmar: undefined,//boton para confirmar algo Guardado
    btnPostear: undefined,//boton para postear algo confirmado
    constructor: function(form, arrBtn, arrGrid)
    {
        if (!this.asignarBtns(arrBtn)) {
            //console.log('Fallo al asignar botones a sus responsabilidades');
            return;
        }

        if (!this.asignarForms(form)) {
            return;
        }

        this.asignarGrids(arrGrid);

        if (typeof requireJS === 'undefined') {
            this.loadJsSync("/contabilidad/comun/js/LoadJs");
        }

        requireJS.loadJsSync("/contabilidad/comun/js/FormValidation", 'FormValidationjs');

        this.initializeClass();
        Ext.FormSteps.superclass.constructor.call(this);
        this.addEvents({
            'Nuevo': true,
            'Crear': true,
            'Confirmar': true,
            'Postear': true,
        });
        this.validateForm();
        if (this.getGrids()) {
            this.crearCampoStringParaForm();
            this.validarGrids();
        }
        return this;
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
    asignarBtns: function(arrBtn)
    {
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
    },
    asignarForms: function(forms)
    {
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
    },
    asignarGrids: function(arrGrid)
    {
        if (arrGrid instanceof Array) {
            this.setGrids(arrGrid);
        }
    },
    crearCampoStringParaForm: function(arrGrid)
    {
        var form = this.getForm()[0];

        this.checkGp = new Ext.form.TextField({
            name: 'check',
            allowBlank: false,
            anchor: '100%',
            hidden: true
        });

        form.add(this.checkGp);
        form.doLayout();
    },
    setGrids: function (arrGrid) {
        this.arrGrid = arrGrid;
    },
    getGrids: function () {
        return this.arrGrid;
    },
    setForm: function (form) {
        this.form = form;
    },
    getForm: function () {
        return this.form;
    },
    validateForm: function () {
        if (this.getBtnAplicar() || this.getBtnGuardar()) {
            var forms = this.getForm();
            var arrBtn = this.getArrButtonsValidation();
            var fn;
            if (forms.length > 1) {
                fn = function (fpanel, valid) {
                    for (var i = 0; i < forms.length; i++) {
                        if (fpanel.getId() != forms[i].getId()) {
                            if (!forms[i].getForm().isValid()) {
                                return false;
                            }
                        }
                    }
                    return true;
                };
            }
            for (var i = 0; i < forms.length; i++) {
                FormValidationjs(forms[i], arrBtn, fn);
            }
        }
    },
    getArrButtonsValidation: function () {
        var arr = [];
        if (this.getBtnAplicar()) {
            arr.push(this.getBtnAplicar());
        }
        if (this.getBtnGuardar()) {
            arr.push(this.getBtnGuardar());
        }
        return arr;
    },
    getIdObj: function () {
        return this.idObj;
    },
    setIdObj: function (id) {
        this.idObj = id;
    },
    resetIdOjt: function () {
        this.idObj = undefined;
    },
    getBtnNuevo: function () {
        return this.btnNuevo;
    },
    setBtnNuevo: function (btn) {
        this.btnNuevo = btn;
    },
    getBtnAplicar: function () {
        return this.btnAplicar;
    },
    setBtnAplicar: function (btn) {
        this.btnAplicar = btn;
    },
    getBtnGuardar: function () {
        return this.btnGuardar;
    },
    setBtnGuardar: function (btn) {
        this.btnGuardar = btn;
    },
    getBtnConfirmar: function () {
        return this.btnConfirmar;
    },
    setBtnConfirmar: function (btn) {
        this.btnConfirmar = btn;
    },
    getBtnPostear: function () {
        return this.btnPostear;
    },
    setBtnPostear: function (btn) {
        this.btnPostear = btn;
    },
    initializeClass: function () {
        this.initializeEvents();
        this.initializeFunctions();
        if (this.getBtnNuevo()) {
            this.getBtnNuevo().enable();
        }
    },
    initializeEvents: function()
    {
        if (this.getBtnNuevo()) {
            this.getBtnNuevo().on('click', function (btn) {
                this.fireEvent('Nuevo', this.accionNuevo, this.limpiarCampos, this.desabilitarForm);//aka ay que limpiar los campos y habilitarlos donde se reciba este evento
            }, this);
        }
        // aka en el evento crear se deben desabilitar los campos del formulario
        if (this.getBtnAplicar()) {
            this.getBtnAplicar().on('click', function (btn) {
                this.fireEvent('Crear', this.accionCrear, false, this.desabilitarForm);//paso falso pa no cerrar ventana
            }, this);
        }
        if (this.getBtnGuardar()) {
            this.getBtnGuardar().on('click', function (btn) {
                this.fireEvent('Crear', this.accionCrear, false, this.desabilitarForm);//paso true pa cerrar ventana
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
        this.accionNuevo = function () {
            this.resetIdOjt();
            this.validateForm();
            // this.desabilitarCamposForm(false);
            // this.limpiarCampos();
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
            this.validateForm();
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

        this.validarGrids = function () {
            var arrGrids = this.getGrids();
            for (var i = 0; i < arrGrids.length; i++) {
                arrGrids[i].grid;
                arrGrids[i].ordenar;
                arrGrids[i].evaluar;
                this.validarSegunTipo(arrGrids[i].grid, arrGrids[i].ordenar, arrGrids[i].evaluar, arrGrids[i].tipo);
            }
        }.bind(this);

        this.validarSegunTipo = function (grid, ordenar, evaluar, tipo) {
            if (tipo === 'sm') {//cuando se por seleccion
                this.crearEventoGridSm(grid, ordenar, evaluar);
            } else if (tipo === 'st') {// cuando sea por que hay datos

            }
        }.bind(this);

        this.crearEventoGridSm = function (grid, ordenar, evaluar) {
            grid.getSelectionModel().on({
                scope: this,
                selectionchange: function (sm) {
                    var ident = this.getGridIdentString(sm.getSelections(), ordenar, evaluar);
                    this.checkGp.setValue(ident);
                }
            });
        }.bind(this);

        // this.crearCampoStringParaForm = function () {
        //     var form = this.getForm()[0];
        //
        //     this.checkGp = new Ext.form.TextField({
        //         name: 'check',
        //         allowBlank: false,
        //         anchor: '100%',
        //         hidden: true
        //     });
        //
        //     form.add(this.checkGp);
        //     form.doLayout();
        // }.bind(this);

        this.getGridIdentString = function (records, campoOrden, camposEvaluar) {
            var recordscheck = [];
            var temp = '';
            // var records = grid.getStore().getRange();
            //si esta desordenado puede causar que falle lo que intento hacer mas abajo en el otro comentario
            records.sort(function (a, b) {
                return a.get(campoOrden) - b.get(campoOrden);
            });
            records.forEach(function (item, i) {
                //esto es pa poder saber si han sido modificados
                camposEvaluar.forEach(function (campo, j) {
                    temp = temp + item.get(campo) + '@';
                });
                recordscheck.push(temp);
                temp = '';
            });
            return recordscheck.toString();
        };
    }
});

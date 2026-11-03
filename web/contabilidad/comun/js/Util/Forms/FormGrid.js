Ext.namespace('CON.Util.FormGrid');
CON.Util.FormGrid = Ext.extend(Object, {
    /**
     * un arreglo de objetos con la siguiente estructura
     * {grid, ordenar, evaluar, campoRecords, tipo}
     * grid: un grid
     * ordenar:
     * evaluar:
     * campoRecords:
     * tipo:
     */
    arrGrids: undefined,
    checkGp: undefined,
    constructor: function (arrGrids, arrForms, formValidador) {
        this.crearSetAndGet();
        this.setGrids(arrGrids);
        this.setForm(arrForms);
        this.formValidador = formValidador;
        this.initializeFunctions();
        this.checkGp = this.crearCampoStringParaForm();
        this.validarGrids();
        this.asosiarGridCheck();
        formValidador.asignarValorInicial();
        // this.formValidador.comprobarFormulario(this.getForm()[0]);
    },
    initializeFunctions: function () {

        this.desabilitarGrid = function (flag) {
            var arrGrids = this.getGrids();
            for (var i = 0; i < arrGrids.length; i++) {
                if (flag) {
                    if (arrGrids[i].tipo === 'sm') {
                        arrGrids[i].grid.getSelectionModel().lock();
                    } else if (arrGrids[i].tipo === 'eg') {
                        arrGrids[i].grid.suspendEvents();
                    }
                } else {
                    if (arrGrids[i].tipo === 'sm') {
                        arrGrids[i].grid.getSelectionModel().unlock();
                    } else if (arrGrids[i].tipo === 'eg') {
                        arrGrids[i].grid.resumeEvents();
                    }
                }
            }
        }.bind(this);

        this.validarGrids = function () {
            var arrGrids = this.getGrids();
            for (var i = 0; i < arrGrids.length; i++) {
                this.validarSegunTipo(arrGrids[i].grid, arrGrids[i].ordenar, arrGrids[i].evaluar, arrGrids[i].campoRecords, arrGrids[i].tipo);
            }
        }.bind(this);

        this.validarSegunTipo = function (grid, ordenar, evaluar, campo, tipo) {
            if (tipo === 'sm') {//cuando se por seleccion
                this.crearEventoGridSm(grid, ordenar, evaluar);
            } else if (tipo === 'eg') {// cuando sea por que hay datos
                this.crearEventoGridEditor(grid, ordenar, evaluar, campo);
            }
        }.bind(this);

        this.crearEventoGridSm = function (grid, ordenar, evaluar) {
            // var checkGp = this.crearCampoStringParaForm(grid.getId());
            grid.getSelectionModel().on({
                scope: this,
                selectionchange: function (sm) {
                    var ident = this.getGridIdentString(sm.getSelections(), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                }
            });
        }.bind(this);

        this.crearEventoGridEditor = function (grid, ordenar, evaluar, campo) {
            // var checkGp = this.crearCampoStringParaForm(grid.getId());
            grid.on({
                scope: this,
                afteredit: function (e) {
                    var ident = this.getGridIdentString(this.recordsConXCampo(grid, campo), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                    // console.log('evento afteredit');
                }
            });
            grid.getStore().on({
                scope: this,
                load: function (e) {
                    var ident = this.getGridIdentString(this.recordsConXCampo(grid, campo), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                    // console.log('evento load');
                },
                add: function () {
                    var ident = this.getGridIdentString(this.recordsConXCampo(grid, campo), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                    // console.log('evento add');
                },
                clear: function () {
                    var ident = this.getGridIdentString(this.recordsConXCampo(grid, campo), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                    // console.log('evento clear');
                },
                remove: function () {
                    var ident = this.getGridIdentString(this.recordsConXCampo(grid, campo), ordenar, evaluar);
                    grid.checkGp = ident;
                    this.actualizarFieldCheckGp();
                    // console.log('evento remove');
                }
            });
        }.bind(this);

        this.recordsConXCampo = function (grid, campo) {
            var records = grid.getStore().getRange();
            var recordsconchips = [];
            records.forEach(function (item, i) {
                if (item.get(campo)) {
                    recordsconchips.push(item);
                }
            });
            return recordsconchips;
        }.bind(this);

        this.crearCampoStringParaForm = function () {
            var form = this.getForm()[0];

            var checkGp = new Ext.form.TextField({
                name: 'check' + form.getId(),
                allowBlank: false,
                anchor: '0%',
                hidden: true,
                hideLabel: true
            });

            form.add(checkGp);
            form.doLayout();
            return checkGp;
        }.bind(this);

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

        this.actualizarFieldCheckGp = function () {
            var arrGrids = this.getGrids();
            var check = [];
            for (var i = 0; i < arrGrids.length; i++) {
                if (arrGrids[i].grid.checkGp) {
                    check.push(arrGrids[i].grid.checkGp);
                }
            }
            // console.log(check.toString());
            this.checkGp.setValue(check.toString());
            this.formValidador.comprobarFormulario(this.getForm()[0]);
        };

        this.asosiarGridCheck = function () {
            var arrGrids = this.getGrids();
            var ident;
            for (var i = 0; i < arrGrids.length; i++) {
                if (arrGrids[i].tipo === 'sm') {
                    ident = this.getGridIdentString(arrGrids[i].grid.getSelectionModel().getSelections(), arrGrids[i].ordenar, arrGrids[i].evaluar);
                } else if (arrGrids[i].tipo === 'eg') {
                    ident = this.getGridIdentString(this.recordsConXCampo(arrGrids[i].grid, arrGrids[i].campoRecords), arrGrids[i].ordenar, arrGrids[i].evaluar);
                }
                arrGrids[i].grid.checkGp = ident;
            }
            this.actualizarFieldCheckGp();
        };

    },
    crearSetAndGet: function () {
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
    }
});
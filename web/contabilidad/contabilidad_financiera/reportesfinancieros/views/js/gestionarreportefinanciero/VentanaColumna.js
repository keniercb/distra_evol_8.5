Ext.namespace('Contabilidad.Reporte.VentanaColumna');

Contabilidad.Reporte.VentanaColumna.View = Ext.extend(Contabilidad.Reporte.Ventana.View, {
    width: 820,
    height: 600,
    layout: 'border',
    initComponent: function () {

        this.concepto = 'Columna';
        this.title = this.accion == 'adicionar' ? 'Adicionar' : 'Modificar';
        this.title = this.title + ' ' + this.concepto.toLowerCase();
        this.addEvents('adicionarcolumna', 'modificarcolumna');
        Contabilidad.Reporte.VentanaColumna.View.superclass.initComponent.call(this);

        this.controller = new Contabilidad.Reporte.VentanaColumna.Controller({
            view: this
        });
        this.controller.inicializarEventos();
    },

    crearCuerpo: function () {
        this.crearForm();
        this.paneleditor = new Contabilidad.Reporte.PanelEditor.View({
            region: 'center',
            width: 490,
            disabledToolbar: true
        });

        this.variables = new Contabilidad.Reporte.PanelVariables.View({
            region: 'west',
            etiquetas: this.etiquetas,
            disabledSelection: true,
            elementos: ['nomenclador']
        });

        this.items = [this.form, {
            region: 'center',
            layout: 'border',
            border: false,
            frame: false,
            items: [this.variables, this.paneleditor]
        }];
    },

    crearForm: function () {
        this.idconfcolumna = new Ext.form.Hidden({
            name: 'idconfcolumna'
        });

        this.stColumna = new Ext.data.Store({
            url: 'cargarColumnas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{name: 'idcolumna'}, {name: 'denominacion'}, {name: 'clasificacion'}])

        });

        this.hdColumna = new Ext.form.Hidden({
            name: 'idcolumna'
        });

        this.firstElement = this.cmbColumna = new Ext.form.ComboBox({
            fieldLabel: 'Columna',
            anchor: '99%',
            valueField: 'denominacion',
            displayField: 'denominacion',
            name: 'denominacion',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            allowBlank: false,
            store: this.stColumna,
            emptyText: 'Seleccione...',
            loadingText: this.etiquetas.lbCargando
        });

        this.cbpersonalizada = new Ext.form.Checkbox({
            boxLabel: 'Personalizada',
            labelSeparator: ' ',
            name: 'personalizada'
        });

        this.denominacion = new Ext.form.TextField({
            fieldLabel: this.etiquetas.lbDenominacion,
            allowBlank: false,
            name: 'denominacion',
            anchor: '100%',
            disabled: true,
            maxLength: 255
        });

        this.form = new Ext.form.FormPanel({
            region: 'north',
            layout: 'column',
            frame: true,
            border: false,
            labelAlign: 'top',
            trackResetOnLoad: true,
            collapsible: true,
            split: true,
            height: 110,
            items: [
                this.idconfcolumna,
                this.hdColumna,
                {
                    layout: 'form',
                    columnWidth: .88,
                    items: [this.cmbColumna]
                },
                {
                    layout: 'form',
                    columnWidth: .12,
                    items: [this.cbpersonalizada]
                },
                {
                    layout: 'form',
                    columnWidth: 1,
                    items: [this.denominacion]
                }
            ]
        })
    },

    esValida: function () {
        var form = this.form.getForm(),
            editor = this.paneleditor;
        if (form.isValid() && editor.esValido() && (form.isDirty() || editor.cambiado())) {
            return true;
        }
        return false;
    }

});

Contabilidad.Reporte.VentanaColumna.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {
        var me = this;
        this.view.on({
            show: function () {
                if (this.accion == 'modificar') {
                    me.setValores(this, this.record);
                }
            }
        });

        this.view.cbpersonalizada.on({
            scope: this,
            check: this.habilitarColumnaPersonalizada
        });

        this.view.variables.btnAdicionarCta.on({
            scope: this,
            click: function () {
                if (this.view.variables.pNomenclador && this.view.variables.pNomenclador.collapsed == false) {
                    this.adicionarNomemcladorFormula();
                } else if (this.view.variables.pCuentas && this.view.variables.pCuentas.collapsed == false) {
                    this.adicionarCuentaFormula();
                }
            }
        });

        this.view.btnAceptar.on({
            scope: this,
            click: this.salvarColumna
        });

        this.view.btnAplicar.on({
            scope: this,
            click: this.salvarColumna
        });

        this.view.cmbColumna.on({
            scope: this,
            select: function (cmb, record) {
                this.view.hdColumna.setValue(record.data.idcolumna);
            },
            change: function (cmb, value) {
                if (!value) {
                    this.view.hdColumna.setValue('');
                }
            },
            disable: function () {
                this.view.hdColumna.setValue('');
            }
        })
    };

    this.habilitarColumnaPersonalizada = function (checkbox, valor) {
        if (valor) {
            this.view.denominacion.focus(false, 100);
        }
        this.view.denominacion.setValue();
        this.view.cmbColumna.setValue();
        this.view.cmbColumna.setRawValue('');
        this.view.denominacion.setDisabled(!valor);
        this.view.paneleditor.toolbar.setDisabled(!valor);
        this.view.variables.deshabilitarSeleccion(!valor);
        this.view.cmbColumna.setDisabled(valor);
        this.view.paneleditor.editor.controller.handlerBtnLimpiar();
    };

    this.salvarColumna = function (btn) {
        var params = this.view.form.getForm().getValues(),
            event = this.view.accion + 'columna';
        params.formula = this.view.paneleditor.obtenerValor();
        params.denominacion = params.denominacion.trim();

        this.view.fireEvent(event, this.view, params);
        if (btn.accion == 'aceptar') {
            this.view.close();
        } else {
            this.resetearVentana();
        }
    };

    this.adicionarCuentaFormula = function () {
        var records = this.view.variables.smCuenta.getSelections(),
            controller = this.view.paneleditor.editor.controller,
            temp = new Array(),
            idnivel = this.view.variables.cmbNivel.getValue(),
            nivel = this.view.variables.cmbNivel.store.getById(idnivel);

        if (records.length != 0) {
            Ext.each(records, function (record, index) {
                if (!this.existeVariable(record.data.idcuenta)) {
                    if (temp.length != 0) {
                        controller.adicionarOperador({}, {
                            type: 'operador',
                            text: '+',
                            eval: '+'
                        });
                    }
                    controller.adicionarVariableRef({
                        type: 'variable',
                        text: record.data.concatcta,
                        id: record.data.idcuenta,
                        idtipo: 1,
                        nombretipo: 'cuenta',
                        datostipo: nivel.data,
                        datoselemento: record.data,
                        tooltip: {
                            title: nivel.data.nombre,
                            descripcion: record.data.concatcta + ' ' + record.data.descripcion
                        }
                    });

                    temp.push(record.data.idcuenta);
                }
            }, this);
        }

        this.view.variables.smCuenta.clearSelections();
    };

    this.adicionarNomemcladorFormula = function () {
        var records = this.view.variables.smTreeApertura.getSelections(),
            controller = this.view.paneleditor.editor.controller,
            temp = new Array(),
            idnomenclador = this.view.variables.cmbNivelNom.getValue(),
            nomenclador = this.view.variables.cmbNivelNom.store.getById(idnomenclador);
        if (records.length != 0) {
            Ext.each(records, function (record, index) {
                if (!this.existeVariable(record.data.id)) {
                    if (temp.length != 0) {
                        controller.adicionarOperador({}, {
                            type: 'operador',
                            text: '+',
                            eval: '+'
                        });
                    }
                    controller.adicionarVariableRef({
                        type: 'variable',
                        text: record.data.concat,
                        id: record.data.id,
                        idtipo: 2,
                        nombretipo: 'nomenclador',
                        datostipo: nomenclador.data,
                        datoselemento: record.data,
                        tooltip: {
                            title: nomenclador.data.nombre,
                            descripcion: record.data.concat + ' ' + record.data.descripcion
                        }
                    });

                    temp.push(record.data.id);
                }
            }, this);
        }

        this.view.variables.smTreeApertura.clearSelections();
    };

    this.existeVariable = function (id) {
        var array = this.view.paneleditor.editor.controller.arrayElementos.items,
            existe = false;

        Ext.each(array, function (elemento) {
            if (elemento['type'] == 'variable' && elemento['idref'] == id) {
                existe = true;
                return false;
            }
        });

        return existe;
    };

    this.setValores = function (window, record) {
        window.form.getForm().loadRecord(record);
        if (!record.data.idcolumna) {
            window.denominacion.setValue(record.data.denominacion);
            window.denominacion.originalValue = record.data.denominacion;
        }
        window.paneleditor.setValor(record.data.formula);
    };

    this.resetearVentana = function () {
        this.view.form.getForm().reset();
        this.view.paneleditor.resetar();
    };
}
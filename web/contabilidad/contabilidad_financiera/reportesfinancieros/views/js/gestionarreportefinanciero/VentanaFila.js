Ext.namespace('Contabilidad.Reporte.VentanaFila');

Contabilidad.Reporte.VentanaFila.View = Ext.extend(Contabilidad.Reporte.Ventana.View, {
    width: 820,
    height: 600,
    layout: 'border',
    initComponent: function () {

        this.concepto = 'Fila';
        this.title = this.accion == 'adicionar' ? 'Adicionar' : 'Modificar';
        this.title = this.title + ' ' + this.concepto.toLowerCase();
        this.addEvents('adicionarfila', 'modificarfila', 'antesadicionarfilaformula');

        Contabilidad.Reporte.VentanaFila.View.superclass.initComponent.call(this);

        this.controller = new Contabilidad.Reporte.VentanaFila.Controller({
            view: this
        });

        this.controller.inicializarEventos();
    },

    crearCuerpo: function () {
        this.crearForm();
        this.crearPanelCentral();
        this.variables = new Contabilidad.Reporte.PanelVariables.View({
            region: 'west',
            etiquetas: this.etiquetas
        });

        this.items = [this.form,
            {
                region: 'center',
                layout: 'border',
                border: false,
                frame: false,
                items: [this.variables, this.panelcentral]
            }];
    },

    crearForm: function () {
        this.idconffila = new Ext.form.Hidden({
            name: 'idconffila'
        });

        this.firstElement = this.primercampo = this.denominacion = new Ext.form.TextField({
            fieldLabel: this.etiquetas.lbDenominacion,
            allowBlank: false,
            name: 'denominacion',
            anchor: '98%',
            maxLength: 255
        });

        this.numerofila = new Ext.form.Checkbox({
            boxLabel: this.etiquetas.lbNroFila,
            labelSeparator: ' ',
            name: 'nrofila',
            hideLabel: true
        });

        this.form = new Ext.form.FormPanel({
            region: 'north',
            layout: 'column',
            trackResetOnLoad: true,
            frame: true,
            border: false,
            labelAlign: 'top',
            collapsible: true,
            split: true,
            height: 100,
            items: [
                this.idconffila,
                {
                    layout: 'form',
                    columnWidth: 1,
                    items: [this.denominacion]
                }, {
                    layout: 'form',
                    columnWidth: .20,
                    items: [this.numerofila]
                }
            ]
        })
    },

    crearPanelCentral: function () {

        this.paneleditor = new Contabilidad.Reporte.PanelEditor.View({
            region: 'center'

        });

        this.stEf = new Ext.data.Store({
            url: 'cargarReportesFinancieros',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [{name: 'idreportefinanciero'}, {name: 'denominacion'}, {name: 'codigo'}])

        });

        this.cmbEf = new Ext.form.ComboBox({
            fieldLabel: this.etiquetas.lbEF,
            anchor: '98%',
            valueField: 'idreportefinanciero',
            displayField: 'codigo',
            triggerAction: 'all',
            editable: true,
            forceSelection: true,
            typeAhead: true,
            resizable: true,
            store: this.stEf,
            emptyText: 'Seleccione...',
            loadingText: this.etiquetas.lbCargando,
            queryParam: 'codigo',
            pageSize: 10,
            queryDelay: 400,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{codigo} {denominacion}" class="x-combo-list-item">{codigo}</div></tpl>'
        });

        this.tfFila = new Ext.form.NumberField({
            enableKeyEvents: true,
            allowDecimals: false,
            allowNegative: false,
            fieldLabel: this.etiquetas.lbNroFilaFormula,
            anchor: '98%'
        });

        this.btnAdicionarFila = new Ext.Button({
            iconCls: 'adicionar',
            disabled: true
        });

        this.formfila = new Ext.form.FormPanel({
            region: 'north',
            layout: 'column',
            frame: true,
            border: false,
            labelWidth: 105,
            height: 70,
            items: [
                {
                    layout: 'form',
                    columnWidth: .665,
                    items: [this.cmbEf]
                },
                {
                    layout: 'form',
                    columnWidth: .6,
                    items: [this.tfFila]
                },
                {
                    layout: 'form',
                    columnWidth: .2,
                    items: [this.btnAdicionarFila]
                }

            ]
        });

        this.panelcentral = new Ext.Panel({
            region: 'center',
            width: 490,
            layout: 'border',
            border: false,
            frame: false,
            items: [this.formfila, this.paneleditor]
        });
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

Contabilidad.Reporte.VentanaFila.Controller = function (params) {

    Ext.apply(this, params);

    this.inicializarEventos = function () {
        var me = this;
        this.view.on({
            show: function () {
                if (this.accion == 'modificar') {
                    me.setValores(this, this.record);
                } else {
                    this.numerofila.setValue(true);
                }
            }
        });

        this.view.variables.smCuenta.on({
            scope: this,
            selectionchange: function (sm) {
                var cant = sm.getCount(),
                    records = sm.getSelections();
                if (cant >= 1) {
                    if (!this.view.denominacion.getValue()) {
                        this.view.denominacion.setValue(records[0].data.descripcion);
                    }
                }
            }
        });

        this.view.variables.btnAdicionarCta.on({
            scope: this,
            click: function () {
                if (this.view.variables.pCuentas.collapsed) {
                    this.adicionarNomemcladorFormula();
                } else {
                    this.adicionarCuentaFormula();
                }

            }
        });

        this.view.btnAdicionarFila.on({
            scope: this,
            click: this.adicionarFilaFormula
        });

        this.view.tfFila.on({
            scope: this,
            keyup: function (tf, eventObject) {
                if (tf.getValue()) {
                    this.view.btnAdicionarFila.enable();
                } else {
                    this.view.btnAdicionarFila.disable();
                    return;
                }
                if (eventObject.keyCode == 13) {
                    this.adicionarFilaFormula();
                    this.view.btnAdicionarFila.disable();
                }
            }
        });

        this.view.stEf.on({
            scope: this,
            beforeload: function (store) {
                var idreporte = this.view.idreporte;
                if (idreporte) {
                    var filtro = [{
                        field: 'idreportefinanciero',
                        data: {
                            type: 'numeric',
                            comparison: 'dis',
                            value: idreporte
                        }
                    }];
                    store.baseParams = this.crearFiltro('filtro', filtro);

                }
            }
        })

        this.view.btnAceptar.on({
            scope: this,
            click: this.salvarFila
        });

        this.view.btnAplicar.on({
            scope: this,
            click: this.salvarFila
        });

        this.view.paneleditor.on({
            scope: this,
            operadoradicionado: function () {
                this.view.tfFila.focus(false, 100);
            }
        });
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
            nomenclador = this.view.variables.cmbNivel.store.getById(idnomenclador);

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

        this.view.variables.smCuenta.clearSelections();
    };

    this.adicionarFilaFormula = function () {
        var idef = this.view.cmbEf.getValue(),
            ef = this.view.cmbEf.getRawValue(),
            nro = this.view.tfFila.getValue(),
            texto = ef ? nro + ' (' + ef + ')' : nro,
            idtexto = idef ? nro + '' + idef : nro,
            descripcion = idef ? nro + '<b> EF </b>' + ef : nro,
            controller = this.view.paneleditor.editor.controller;

        if (!this.existeVariable(idtexto)) {
            controller.adicionarVariableRef({
                type: 'variable',
                text: texto,
                id: idtexto,
                idtipo: 3,
                nombretipo: 'fila',
                datostipo: [],
                datoselemento: {
                    idreportefinanciero: idef ? idef : null,
                    codigo: ef,
                    fila: nro
                },
                tooltip: {
                    title: 'Fila',
                    descripcion: '# ' + descripcion
                }
            });
            this.view.formfila.getForm().reset();
        }
        /*else {
         mostrarMensaje(1, this.etiquetas.lbExisteFila);
         }*/
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

    this.salvarFila = function (btn) {
        var params = this.view.form.getForm().getValues(),
            event = this.view.accion + 'fila';
        params.formula = this.view.paneleditor.obtenerValor();
        params.denominacion = params.denominacion.trim();

        this.view.fireEvent(event, this.view, params);
        if (btn.accion == 'aceptar') {
            this.view.close();
        } else {
            this.resetearVentana();
        }
    };

    this.resetearVentana = function () {
        this.view.form.getForm().reset();
        this.view.paneleditor.resetar();
        this.view.numerofila.setValue(true);
        this.view.primercampo.focus(false, 100);
    };

    this.setValores = function (window, record) {
        window.form.getForm().loadRecord(record);
        window.paneleditor.setValor(record.data.formula);
    };

    this.crearFiltro = function (paramPrefix, filters) {
        var p = {};
        for (var i = 0, len = filters.length; i < len; i++) {
            var f = filters[i];
            var root = [paramPrefix, '[', i, ']'].join('');
            p[root + '[field]'] = f.field;
            var dataPrefix = root + '[data]';
            for (var key in f.data) {
                p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
            }
        }

        return p;
    }
};
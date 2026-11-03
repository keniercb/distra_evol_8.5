Ext.define('PRT.view.WindowHojaDistributiva', {
    extend: 'Ext.window.Window',
    alias: 'widget.windowhojadistributiva',

    //idioma: eval('PRT.language.' + lang),
    idioma: PRT.language[lang],
    numberformat: CostoComun.NumberFormat,
    autoShow: true,

    initComponent: function () {
        this.contLoadTree = 0;

        this.btnCancelar = Ext.create('Ext.Button', {
            text: this.idioma.lbbtnCancelar,
            scope: this,
            tooltip: this.idioma.tooltipbtnCancelar,
            //margin: '1 0 1 445',
            height: 23,
        });

        this.btnAplicar = Ext.create('Ext.Button', {
            tooltip: this.idioma.lbtooltipBtnAplicar,
            text: this.idioma.lbbtnAplicar,
            scope: this,
            height: 23,
            disabled: true
        });

        this.btnAceptar = Ext.create('Ext.Button', {
            tooltip: this.idioma.lbtooltipBtnAceptar,
            text: this.idioma.lbbtnAceptar,
            scope: this,
            height: 23,
            disabled: true
        });

        this.inicializarStores();
        this.contLoad = 0;
        this.cbEjercicio = Ext.create('Ext.form.ComboBox', {
            anchor: '25%',
            labelAlign: 'top',
            width: 80,
            forceSelection: true,
            fieldLabel: 'Ejercicio',
            labelWidth: 110,
            margin: '0 10 5 7',
            store: this.stEjercicio,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            //flex: 1,
            queryMode: 'local',
            valueField: 'idejercicio',
            displayField: 'nombre',
            enforceMaxLength: true,
            listConfig: {
                minWidth: null
            },
        });
        this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            autoLoad: true,
            errorSummary: false,
            saveBtnText: this.idioma.lbbtnAceptar,
            cancelBtnText: this.idioma.lbbtnCancelar
        });
        this.cbPeriodo = Ext.create('Ext.form.ComboBox', {
            anchor: '25%',
            labelAlign: 'top',
            width: 120,
            disabled: true,
            forceSelection: true,
            fieldLabel: 'Período',
            labelWidth: 110,
            margin: '0 10 5 0',
            store: this.stPeriodo,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            // flex: 1,
            queryMode: 'local',
            valueField: 'idperiodo',
            displayField: 'nombre',
            enforceMaxLength: true,
            listConfig: {
                minWidth: null
            }
        });

        this.cbInductor = Ext.create('Ext.form.ComboBox', {
            anchor: '50%',
            labelAlign: 'top',
            width: 150,
            disabled: true,
            forceSelection: true,
            fieldLabel: 'Base distributiva',
            labelWidth: 110,
            margin: '0 10 5 0',
            store: this.stInductor,
            allowBlank: false,
            blankText: this.idioma.blankTextField,
            editable: false,
            //flex: 2,
            queryMode: 'local',
            valueField: 'idinductor',
            displayField: 'abreviaturanivel',

            listConfig: {
                getInnerTpl: function () {
                    return '<div data-qtip="{nominductor}"/>' + '<div>{abreviatura} ({nombre})</div>'
                }
            }
        });
        this.btnAplicar = Ext.create('Ext.Button', {
            text: this.idioma.lbbtnAplicar,
            scope: this,
            height: 23,
            disabled: true
        });
        this.treeGridHojaDistributiva = Ext.create('Ext.tree.Panel', {
            plugins: [this.rowEditing],
            margin: '0 0 5 0',
            //maskOnDisable: false,
            // width: 550,
            // height: 310,
            width: 650,
            height: 350,
            //hidden: true,
            useArrows: true,
            rootVisible: false,
            store: this.stCuentas,
            multiSelect: true,
            columns: [
                /* {
                     xtype: 'treecolumn',
                     header: 'Cuentas',
                     sortable: true,
                     flex: 2,
                     width: 300,
                     dataIndex: 'text',
                     locked: true,
                 },{
                     xtype: 'numberfield',
                     flex: 1,
                     align: 'right',
                     dataIndex: 'valorinductor',
                     minValue: 0,
                     maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\/\s]+$/,
                     regex: /^([0-9\-\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1]+ ?)+$/,
                     blankText: this.idioma.blankTextField,
                     renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                         if (value) {
                             return this.numberformat.formatoMoneda(value);
                         } else {
                             return '0.00';
                         }
                     },
                 }*/
            ],
            listeners: {
                scope: this,
                itemclick:
                    function (dv, record, item, index, e) {
                        this.idcuenta = record.data.idcuenta;
                    },
                itemdblclick:
                    function (dv, record, item, index, e) {
                        var indexPeriodo = this.stPeriodo.find('idperiodo', this.cbPeriodo.getValue())
                        var periodo = this.stPeriodo.getAt(indexPeriodo);
                        if (periodo) {
                            var fechFin = periodo.data.fin.split('/');
                            var periodoFin = new Date(fechFin[2], fechFin[1] - 1, fechFin[0]);

                            var fechInicio = this.periodo.inicio.split('/');
                            var periodoInicio = new Date(fechInicio[2], fechInicio[1] - 1, fechInicio[0]);

                            if (periodoFin < periodoInicio) {
                                this.rowEditing.cancelEdit();
                            }
                        } else {
                            this.rowEditing.cancelEdit();
                        }
                        if (!record.data.idhojadistributiva && !record.data.idcuenta && record.data.text != 'Total') {
                            this.rowEditing.cancelEdit();
                        } else {
                            if (record.data.leaf) {
                                if (!(this.cbEjercicio.isValid() && this.cbPeriodo.isValid())) {
                                    this.rowEditing.cancelEdit();
                                    mostrarMensaje(1, this.idioma.lbEjerPeriodoComplet);
                                }
                            } else {
                                this.rowEditing.cancelEdit();
                            }
                        }
                        /*}else{
                                this.rowEditing.cancelEdit();
                            }*/
                    }
            }
        });

        this.frame = true;

        this.autoValidate = true;
        this.modal = true;
        this.title = this.idioma.btnHojaDistribucion;
        this.bodyPadding = 8;
        // this.width = 450;
        // this.height = 520;
        this.width = 550;
        this.height = 530;
        this.constrain = true;
        this.fieldDefaults = {
            labelAlign: 'right',
            labelWidth: 90,
            msgTarget: 'qtip'
        };
        this.items = [{
            layout: 'hbox',
            frame: true,
            items: [
                this.cbEjercicio,
                this.cbPeriodo,
                this.cbInductor
            ]
        }, {
            xtype: 'fieldset',
            title: '<p style ="color: #000000; font-size: 12px;">Cuentas a distribuir</p>',
            margin: '0 0 0 0',
            frame: true,
            defaultType: 'textfield',
            layout: 'anchor',
            defaults: {
                anchor: '100%'
            },
            items: [this.treeGridHojaDistributiva]
        },];

        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
        //this.reconfigurarTreeGrid();

        this.inicializarEventos();
        this.callParent(arguments);
    },

    inicializarStores: function () {
        Ext.define('Cuentas', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'idcuenta'},
                {name: 'idcuentapadre'},
                {name: 'text'},
                {name: 'concatcta'},
                {name: 'idhojadistributiva'},
                {name: 'valorinductor'},
                {name: 'leaf'},
                {name: 'idperiodo'},
                {
                    name: 'qtip',
                    mapping: 'text'
                }

            ]
        });

        this.stCuentas = Ext.create('Ext.data.TreeStore', {
            //autoLoad: false,
            pageSize: 20,
            model: 'Cuentas',
            proxy: {
                scope: this,
                type: 'ajax',
                url: 'loadCuentaParteFormatoHojaDistributiva',
                reader: {
                    type: 'json',
                    root: 'datos',
                },
                writer: {
                    type: 'json'
                }
            },
            root: {
                loaded: true
            },
            listeners: {
                scope: this,
                beforeload: function (store, operation, eOpts) {
                    operation.params = {
                        idperiodo: this.cbPeriodo.getValue(),
                        idinductor: this.cbInductor.getValue()
                    }
                },
                load: function (store, node, records, successful) {

                }
            }
        });

        this.stEjercicio = Ext.create('Ext.data.Store', {
            scope: this,
            autoLoad: true,
            fields: [{
                name: 'idejercicio',
                type: 'int'
            }, {
                name: 'nombre',
                type: 'string'
            }],
            sortInfo: {
                field: 'idejercicio',
                direction: 'ASC'
            },
            proxy: {
                type: 'ajax',
                url: 'cargarEjercicios',
                reader: {
                    type: 'json',
                    root: 'datos'
                },
                writer: {
                    type: 'json'
                }
            },
            listeners: {
                scope: this,
                load: function () {
                    this.contLoad++;
                }
            }
        });

        this.stPeriodo = Ext.create('Ext.data.Store', {
            scope: this,
            //autoLoad: true,
            fields: [{
                name: 'idperiodo'
            }, {
                name: 'nombre'
            }, {
                name: 'idejercicio'
            }, {
                name: 'inicio'
            }, {
                name: 'fin'
            }],
            sortInfo: {
                field: 'nombre',
                direction: 'ASC'
            },
            proxy: {
                type: 'ajax',
                url: 'cargarPeriodos',
                reader: {
                    type: 'json',
                    root: 'datos'
                },
                writer: {
                    type: 'json'
                }
            },
            listeners: {
                scope: this,
                load: function () {
                    this.contLoad++;
                }
            }
        });

        this.stInductor = Ext.create('Ext.data.Store', {
            scope: this,
            autoLoad: true,
            fields: [{
                name: 'idinductor'
            }, {
                name: 'nominductor'
            }, {
                name: 'abreviatura'
            }, {
                name: 'nombre'
            }, {
                name: 'abreviaturanivel',
                convert: function (value, record) {
                    return record.data.abreviatura + ' (' + record.data.nombre + ')';
                }
            }],
            proxy: {
                type: 'ajax',
                url: 'getInductorHojaDistributiva',
                reader: {
                    type: 'json',
                    root: 'data'
                },
                writer: {
                    type: 'json'
                }
            },
            listeners: {
                scope: this,
                load: function () {
                    this.contLoad++;
                }
            }
        });

    },

    inicializarEventos: function () {
        /*this.btnCancelar.on({
            scope: this,
            click: function () {
                this.close();
            }
        });*/
        this.on({
            scope: this,
            show: function () {
                this.mask = new Ext.LoadMask(this.getEl(), {msg: this.idioma.msgCargando});
                this.mask.show();

            }
        });

        this.cbEjercicio.on({
            scope: this,
            select: function () {
                this.cbPeriodo.reset();
                this.cbPeriodo.getStore().load({
                    params: {
                        idejercicio: this.cbEjercicio.getValue()
                    }
                });
                //this.cbPeriodo.enable();
            }
        });

        this.cbPeriodo.on({
            scope: this,
            select: function () {
                // this.cbInductor.reset();
            },
        });

        this.stPeriodo.on({
            scope: this,
            beforeload: function () {
                this.rowEditing.cancelEdit();
            },
            load: function () {
                var indexperiodoactual = this.stPeriodo.find('idperiodo', this.stEjercicio.getAt(this.stEjercicio.getTotalCount() - 1).raw.periodo.idperiodo);
                var periodoactualmodel = this.stPeriodo.getAt(indexperiodoactual);
                this.cbPeriodo.select(periodoactualmodel);
                this.mask.hide()
                this.cbPeriodo.enable();
                this.cbInductor.enable();

            }.bind(this)
        });

        this.stEjercicio.on({
            scope: this,
            load: function () {
                this.cbEjercicio.select(parseFloat(this.stEjercicio.getAt(this.stEjercicio.getTotalCount() - 1).raw.ejer));
                this.stPeriodo.load({
                    params: {
                        idejercicio: parseFloat(this.stEjercicio.getAt(this.stEjercicio.getTotalCount() - 1).raw.ejer)
                    }
                });
                this.ejer = parseFloat(this.stEjercicio.getAt(this.stEjercicio.getTotalCount() - 1).raw.ejer);
                this.periodo = this.stEjercicio.getAt(this.stEjercicio.getTotalCount() - 1).raw.periodo;
            }
        });

        this.cbInductor.on({
            scope: this,
            select: function (combo, records) {
                var idinductor = combo.getValue();
                // this.stCuentas.load();
                /*if(this.recordModificados){
                    var cantMod = this.recordModificados.length;
                    for(var i = 0; i< cantMod; i++){
                        this.recordModificados[i].commit();
                    }

                }*/
                this.maskTreePanel = new Ext.LoadMask(this.treeGridHojaDistributiva.getEl(), {msg: this.idioma.msgCargando});
                this.maskTreePanel.show();
                //this.treeGridHojaDistributiva.getStore().load();
                this.reconfigurarTreeGrid(idinductor);
            },
        });

        this.rowEditing.on({
            scope: this,
            edit: function (e, context) {
                this.recordModificados = this.treeGridHojaDistributiva.getStore().getModifiedRecords();
                /*var nodePadre = context.record.parentNode.data;
                var nodeTotal = this.stCuentas.getRootNode().childNodes[0].data;
                this.recordModificados = this.treeGridHojaDistributiva.getStore().getModifiedRecords();
                var lengthRecorMod = this.recordModificados.length;
                this.rModified = (this.recordModificados.length > 0);
                var cantInd = this.inductor.length;
                var cont = 0;
                for (var i = 1; i < cantInd; i++) {
                    this.sumaControl['valor' + this.inductor[i].split('-')[1]] = 0;
                    for (var j = 0; j < lengthRecorMod; j++) {
                        //nodePadre['valor' + this.inductor[i].split('-')[1]] = nodePadre['valor' + this.inductor[i].split('-')[1]] + (context.record.data['valor' + this.inductor[i].split('-')[1]] - this.recordModificados[j].modified['valor' + this.inductor[i].split('-')[1]]);

                        this.sumaControl['valor' + this.inductor[i].split('-')[1]] += this.recordModificados[j].data['valor' + this.inductor[i].split('-')[1]];
                    }

                    //this.sumaControl['valor' + this.inductor[i].split('-')[1]] += context.record.data['valor' + this.inductor[i].split('-')[1]];
                    if (nodeTotal['valor' + this.inductor[i].split('-')[1]] == parseInt(this.sumaControl['valor' + this.inductor[i].split('-')[1]])) {
                        cont++;
                    }
                }*/
                var record = context.record;
                this.sumaValorPadres(record);

                /*var cantInd = this.inductor.length;
                var cantHijos = this.stCuentas.getRootNode().childNodes.length;
                var parenthNode = this.stCuentas.getRootNode();
                var suma = 0;
                var cont = 0;
                var total = 0;
                var sumaControl = 0;
                for (var i = 1; i < cantInd; i++) {
                    for (var j = 2; j < cantHijos; j++) {
                        if (parenthNode.childNodes[j].data['valor' + this.inductor[i].split('-')[1]]) {
                            suma += parseInt(parenthNode.childNodes[j].data['valor' + this.inductor[i].split('-')[1]]);
                        }
                    }
                    parenthNode.childNodes[1].data['valor' + this.inductor[i].split('-')[1]] = suma;
                    parenthNode.childNodes[1].commit();
                    suma = 0;
                    sumaControl = parenthNode.childNodes[1].data['valor' + this.inductor[i].split('-')[1]];
                    total = parseInt(parenthNode.childNodes[0].data['valor' + this.inductor[i].split('-')[1]]);
                    if(!total){
                        total = 0;
                    }
                    if (total == sumaControl) {
                        cont++;
                    }
                }
                if (cont == cantInd - 1) {
                    this.btnAceptar.enable();
                } else {
                    this.btnAceptar.disable();
                }*/


                //context.record.commit();
                //context.record.parentNode.commit();
                /*if (cont == cantInd - 1) {
                    this.btnAceptar.enable();
                }else{
                    this.btnAceptar.disable();
                }*/

            },
            beforeedit: function (editor, context, eOpts) {

            },
            validateedit: function (editor, context, eOpts) {

            },
            cancelEdit: function (editor, context, eOpts) {
                if (this.tareaGuardar) {
                    this.runner.stop(this.tareaGuardar);
                }
            }
        });

        this.btnAplicar.on({
            scope: this,
            click: function () {
                Ext.TaskManager.stop(this.tareaAceptar);
                var datos = new Array();
                var paramHojaDist = {};
                for (var i = 0; i < this.recordModificados.length; i++) {
                    paramHojaDist = {};
                    if (this.recordModificados[i].data['idperiodo']) {
                        paramHojaDist['idperiodo'] = this.recordModificados[i].data['idperiodo'];
                    } else {
                        paramHojaDist['idperiodo'] = this.cbPeriodo.getValue();
                    }
                    paramHojaDist['idcuenta'] = this.recordModificados[i].data['idcuenta'];
                    paramHojaDist['idhojadistributiva'] = this.recordModificados[i].data['idhojadistributiva'];
                    paramHojaDist['idinductor'] = this.cbInductor.getValue();
                    paramHojaDist['valorinductor'] = this.recordModificados[i].data['valorinductor'];
                    datos.push(paramHojaDist);
                }

                var parameter = {
                    parametros: Ext.encode(datos)
                };
                var myMask = new Ext.LoadMask(this.treeGridHojaDistributiva.getEl(), {msg: this.idioma.msgCargando});
                myMask.show();
                Ext.Ajax.request({
                    scope: this,
                    url: 'saveHojaDistributiva',
                    params: parameter,
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        var msg = (responseData.msg === 1) ? this.idioma.lbConfigGuardada : this.idioma.lbMsgErrorGuardar;
                        mostrarMensaje(1, msg);
                        myMask.hide();
                        if (success) {
                            this.stCuentas.load();
                            myMask.hide();
                        }
                    }
                });

            }
        });

        this.btnCancelar.on({
            scope: this,
            click: function () {
                // Ext.TaskManager.stop(this.tareaAceptar);
                this.close();
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                this.btnAplicar.fireEvent('click');
                // Ext.TaskManager.stop(this.tareaAceptar);
                this.close();
            }
        });

        this.stCuentas.on({
            scope: this,
            beforeload: function (store, operation, eOpts) {
                //store.root = {loaded:true};
                //if(!this.recordEdit){
                var record = store.lastOptions.node;
                this.idcuenta = record.data.idcuenta;
                if (this.idcuenta) {
                    operation.params = {
                        node: this.idcuenta,
                        idperiodo: this.cbPeriodo.getValue(),
                        idinductor: this.cbInductor.getValue()

                    };
                    /*}else{

                        this.rowEditing.cancelEdit();
                    }*/
                }
            },

            load: function (store, operation, eOpts) {
                this.maskTreePanel.hide();

                this.tareaBtnAceptar();
                if (this.inductor) {

                    this.contLoadTree++;
                    //if (this.contLoadTree == 1) {
                    var cantHijos = this.stCuentas.getRootNode().childNodes.length;
                    var parenthNode = this.stCuentas.getRootNode();
                    var suma = 0;
                    var cont = 0;
                    var total = 0;
                    var sumaControl = 0;

                    for (var j = 3; j < cantHijos; j++) {
                        if (parenthNode.childNodes[j].data['valorinductor']) {
                            suma += parseFloat(parenthNode.childNodes[j].data['valorinductor']);
                        }
                    }
                    parenthNode.childNodes[1].data['valorinductor'] = suma;
                    parenthNode.childNodes[1].commit();

                    sumaControl = parenthNode.childNodes[1].data['valorinductor'];
                    total = parseFloat(parenthNode.childNodes[0].data['valorinductor']);
                    parenthNode.childNodes[2].data['valorinductor'] = total - suma;
                    parenthNode.childNodes[2].commit();
                    suma = 0;
                    /*if (!total) {
                        total = 0;
                    }
                    if (total == sumaControl) {
                        cont++;
                    }


                    if (cont == 1) {
                        this.btnAceptar.enable();
                    } else {
                        this.btnAceptar.disable();
                    }*/
                    //}
                } else {
                    this.mask.hide();
                }
            },
        });
    },

    reconfigurarTreeGrid: function (idinductor) {
        if (idinductor) {
            /*var myMask = new Ext.LoadMask(this.treeGridHojaDistributiva.getEl(), {msg: this.idioma.msgCargando});
            myMask.show();*/
            Ext.Ajax.request({
                scope: this,
                url: 'loadDatosReconfigure',
                params: {
                    node: 'root',
                    idinductor: idinductor
                },
                success: function (response) {

                    var datos = Ext.decode(response.responseText);
                    //this.tareaCargaPerEjer(this.periodo.idperiodo, this.ejer);
                    this.configurarColumnas(datos);
                    // this.mask.hide();
                    this.stCuentas.load({
                        params: {
                            idperiodo: this.cbPeriodo.getValue(),
                            idinductor: this.cbInductor.getValue()
                        }
                    });
                    this.treeGridHojaDistributiva.getView().refresh();
                },
                failure: function (response) {

                }
            });
        } else {
            this.stCuentas.load({
                params: {
                    idperiodo: this.cbPeriodo.getValue()
                }
            });
        }
    },

    configurarColumnas: function (datos) {
        this.columnasEjecucion = new Array();
        this.inductor;
        var inductores = datos.inductores;
        this.sumaControl = new Array();
        if (inductores.length > 0) {
            this.columnasEjecucion.push(
                {
                    text: 'Cuentas',
                    xtype: 'treecolumn',
                    // width: 300,
                    flex: 3,
                    dataIndex: 'text',
                    align: 'left',
                    name: 'text',
                    locked: true,
                    itemId: 'text',
                    sortable: false,
                }
            );

            //this.inductor.push('text');

            this.columnasEjecucion.push(
                {
                    scope: this,
                    text: inductores[0].abreviatura,
                    flex: 1,
                    itemId: 'columnvalorinductor',
                    align: 'right',
                    dataIndex: 'valorinductor',
                    editor: Ext.create('Ext.form.field.Number', {
                        blankText: this.idioma.blankTextField,
                        enableKeyEvents: true,
                        name: 'valorinductor',
                        minValue: 0,
                        allowDecimals: true,
                        forcePrecision: true,
                        decimalPrecision: 2,
                        decimalSeparator: '.',
                        maskRe: /^[0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xda\xfc\/\s\.]+$/,
                        regex: /^([0-9\-\xf3\xf1\xe1\xe9\xed\xfa\xda\xd1\.]+ ?)+$/
                    }),
                    renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        if (value) {
                            return this.numberformat.formatoMoneda(value);
                        } else {
                            return '0.00';
                        }
                    },
                }
            );
            this.inductor = inductores[0].abreviatura + '-' + inductores[0].idinductor;

            field = this.treeGridHojaDistributiva.getStore().model.getFields();
            field.push({name: 'valorinductor'});
            this.treeGridHojaDistributiva.getStore().model.setFields(field);
            this.sumaControl['valorinductor'] = 0;
        }
        if (this.contLoadTree > 0) {
            var objcolumninductor = this.treeGridHojaDistributiva.down('gridcolumn[itemId=columnvalorinductor]');
            objcolumninductor.setText(inductores[0].abreviatura);
        } else {
            this.treeGridHojaDistributiva.reconfigure(this.treeGridHojaDistributiva.getStore(), this.columnasEjecucion);
        }
    },

    /*tareaCargaPerEjer: function (idperiodo, idejercicio) {
        this.tareaLoad = {
            run: function () {
                if (this.contLoad == 2) {
                    var ejercicio = this.stEjercicio.findRecord('idejercicio', idejercicio);
                    this.cbEjercicio.select(ejercicio);
                    this.cbPeriodo.select(idperiodo);
                    this.cbPeriodo.enable();
                    Ext.TaskManager.stop(this.tareaLoad);
                }
            },
            interval: 200,
            scope: this
        };
        Ext.TaskManager.start(this.tareaLoad);
    },*/

    tareaBtnAceptar: function () {
        this.tareaAceptar = {
            run: function () {
                this.btnAceptar.setDisabled(!this.recordModificados);
                this.btnAplicar.setDisabled(!this.recordModificados);
            },
            interval: 200,
            scope: this
        };
        Ext.TaskManager.start(this.tareaAceptar);
    },

    sumaValorPadres: function (record) {
        var parenthNode = record.parentNode
        var suma = 0;
        //var cantInd = this.inductor.length;
        var cantHijos = parenthNode.childNodes.length;
        if (!parenthNode.data['root']) {
            // for (var i = 1; i < cantInd; i++) {
            for (var j = 0; j < cantHijos; j++) {
                if (parenthNode.childNodes[j].data['valorinductor']) {
                    suma += parseFloat(parenthNode.childNodes[j].data['valorinductor']);
                }
            }

            parenthNode.data['valorinductor'] = suma;
            suma = 0;
            //}
            parenthNode.commit();
            return this.sumaValorPadres(parenthNode);
        } else {
            var cont = 0;
            var contDist = 0;
            var total = 0;
            var sumaControl = 0;
            var arrayDist = new Array();
            // for (var i = 1; i < cantInd; i++) {
            for (var j = 3; j < cantHijos; j++) {
                if (parenthNode.childNodes[j].data['valorinductor']) {
                    suma += parseFloat(parenthNode.childNodes[j].data['valorinductor']);
                }
            }
            parenthNode.childNodes[1].data['valorinductor'] = suma;
            parenthNode.childNodes[1].commit();
            total = parseFloat(parenthNode.childNodes[0].data['valorinductor']);
            sumaControl = parenthNode.childNodes[1].data['valorinductor'];
            if (!total) {
                total = 0;
            }
            parenthNode.childNodes[2].data['valorinductor'] = total - suma;
            parenthNode.childNodes[2].commit();
            suma = 0;
            if (sumaControl == total) {
                cont++;
            } else {
                arrayDist[contDist] = ' ' + this.inductor.split('-')[0];
                contDist++;
            }
            //}

            if (cont == 1) {
                this.btnAplicar.enable();
                this.btnAceptar.enable();
            } else {
                this.btnAplicar.disable();
                this.btnAceptar.disable();
                mostrarMensaje(1, this.idioma.lbErrorTotalBaseDist.replace('<#>', arrayDist))
            }
            return 0;
        }
    }
});

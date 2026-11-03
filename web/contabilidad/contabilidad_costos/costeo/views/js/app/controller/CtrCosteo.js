Ext.define('PRT.controller.CtrCosteo', {
    extend: 'Ext.app.Controller',

    views: [
        'PanelProrrateo@PRT.view',
        'GridPanelProrrateo@PRT.view',
        'WindowConfCosteo@PRT.view',
        'WindowAddModProrrateo@PRT.view',
        'WindowAsociar@PRT.view'
    ],
    stores: [
        'StProrrateo@PRT.store'
    ],
    models: [
        'MdProrrateo@PRT.model'
    ],

    refs: [
        {
            ref: 'gridProrrateo',
            selector: 'gridpanelprorrateo'
        },
        {
            ref: 'comboNivelProrrateo',
            selector: 'gridpanelprorrateo toolbar combobox[name=nivelprorrateo]'
        },
        {
            ref: 'toolbarPanelProrrateo',
            selector: 'panelprorrateo toolbar'
        },
        {
            ref: 'panelDetalleProrrateo',
            selector: 'panelprorrateo panel[itemId=panelDetalleProrrateo]'
        }
    ],

    init: function () {
        this.fechaContableObj = null;
        //this.idioma = eval('PRT.language.' + lang);
        this.idioma = PRT.language[lang];
        this.numberformat = CostoComun.NumberFormat;

        //Ext.FocusManager.enable(true);
        this.listen({
            global: {},
            controller: {},
            store: {
                '#stNivelProrrateo': {
                    load: function (store, records, successful, eOpts) {
                       // this.fechaContableObj = store.getProxy().getReader().rawData.fecha;
                        this.validateNivelProrrateo(records);
                    }
                },
                '#stProrrateo': {}
            },
            component: {}
        });

        this.control({
            /*Botón Configuración*/
            'panelprorrateo toolbar button[itemId=btnconfiguracionprorrateo]': {
                click: this.showWindowConfigurarCosteo
            },
            /*Botón Hoja de distribución*/
            'panelprorrateo toolbar button[itemId=btnhojadistribucion]': {
                click: this.showWindowAsociar
            },
            /*Botón Adicionar prorrateo*/
            'panelprorrateo toolbar button[itemId=btnadicionarprorrateo]': {
                click: function (button, event, eOpts) {
                    //this.showWindowAddModProrrateo('add');
                }
            },
            /*Botón Modificar prorrateo*/
            'panelprorrateo toolbar button[itemId=btnmodificarprorrateo]': {
                click: function (button, event, eOpts) {
                  //  this.showWindowAddModProrrateo('mod');
                }
            },
            /*Botón Eliminar prorrateo*/
            'panelprorrateo toolbar button[itemId=btneliminarprorrateo]': {
                click: function () {
                   // this.eliminarProrrateo();
                }
            },
            /*Action column*/
            'gridpanelprorrateo actioncolumn[itemId=actioncolumngridprorrateo]': {
                afterrender: this.initActionColumnProrrateo
            },
            /*ComboBox Nivel del prorrateo*/
            'gridpanelprorrateo toolbar combobox[name=nivelprorrateo]': {
                change: function (field, newValue, oldValue, eOpts) {
                    this.changeValueComboNivelProrrateo(newValue, oldValue);
                }
            },
            /*Grid panel prorrateo*/
            'gridpanelprorrateo': {
                selectionchange: function (selmodel, selected, eOpts) {
                    this.activateDesactivateBtns(selected);
                    this.showDetailProrrateo(selected);
                }
            }
        });

        /*this.nav = Ext.create('Ext.util.KeyNav', Ext.getBody(), {
            "left" : function(){
                var el = Ext.FocusManager.focusedCmp;
                if (el.previousSibling()) el.previousSibling().focus();
            },
            "right" : function(){
                var el = Ext.FocusManager.focusedCmp;
                if (el.nextSibling()) el.nextSibling().focus();
            },
            "up" : function() {
                var el = Ext.FocusManager.focusedCmp;
                if (el.up()) el.up().focus();
            },
            "down" : function() {
                var el = Ext.FocusManager.focusedCmp;
                if (el.items) el.items.items[0].focus();
            },
            scope : this
        });*/

        // map multiple keys to multiple actions by strings and array of codes
        /*this.map = Ext.create('Ext.util.KeyMap', {
            target: Ext.getBody(),
            binding: [{
                key: [10, 13],
                fn: function () {
                    alert("Return was pressed");
                }
            }, {
                key: "abc",
                scope: this,
                fn: function () {
                }
            }, {
                key: Ext.EventObject.T,
                ctrl: true,
                shift: true,
                fn: function () {
                    alert('Control + shift + t was pressed.');
                }
            }]
        });*/
    },
    /*
    * Función que se utiliza para mostrar la ventana de configuración de costeo
    * */
    showWindowConfigurarCosteo: function () {
        Ext.widget('windowconfcosteo');
    },
    /*
    * Función que se utiliza para mostrar la ventana de la hoja de distribución
    * */
    showWindowAsociar: function () {
        Ext.widget('windowasociar');
    },
    /*
    * Función que se utiliza para mostrar la ventana de adicionar o modificar prorrateo
    * */
    /*showWindowAddModProrrateo: function (action) {
        var idnivelprorrateo = this.getComboNivelProrrateo().getValue();
        var storenivelprorrateo = this.getComboNivelProrrateo().store;
        var index = storenivelprorrateo.find('idnivelprorrateo', idnivelprorrateo);
        var recordnivelprorrateo = storenivelprorrateo.getAt(index);

        var objmodprorrateo = null;
        if (action == 'mod') {
            var selected = this.getGridProrrateo().getSelectionModel().getLastSelected().data;

            var arrreceptores = [];
            selected.receptores.forEach(function (item, index, AllItems) {
                arrreceptores.push({
                    id: item.idcuentareceptor
                });
            }, this);

            objmodprorrateo = {
                idprorrateo: selected.idprorrateo,
                descripcion: selected.descripcion,
                fecha: selected.fecha,
                emisor: [{id: selected.idcuentaemisor, value: selected.cuentaemisor}],
                elementogastotraspaso: [{id: selected.idelementogastotraspaso, value: selected.elementogastotraspaso}],
                idorigenBD: selected.idorigenBD,
                idinductor: selected.idinductor,
                elementogastoaprorratear: [{
                    id: selected.idelementogastoaprorratear,
                    value: selected.elementogastoaprorratear
                }],
                porcientotraspasar: selected.porcientotraspasar,
                receptores: arrreceptores
            };
        }

        Ext.widget('windowaddmodprorrateo', {
            action: action,
            nivel: {
                idnivelprorrateo: idnivelprorrateo,
                idparteformatoorigen: recordnivelprorrateo.data.idparteformatoorigen,
                idparteformatodestino: recordnivelprorrateo.data.idparteformatodestino
            },
            fechaObj: this.fechaContableObj,
            objmodprorrateo: objmodprorrateo
        }).on({
            scope: this,
            addprorrateo: function (window, datos, aplicar) {
                this.addmodProrrateo(action, datos, window, aplicar);
            }
        });
    },*/
    /*
    * Activar o desactivar los botones según los elemento seleccionados
    * */
    activateDesactivateBtns: function (selected) {
        var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
        if (selected.length === 1) {
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(false);
        }
        else if (selected.length > 1) {
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(false);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
        }
        else {
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
        }
    },
    /*
    * Función necesariap ara mostrar los detalles del prorrateo seleccioando
    * */
    showDetailProrrateo: function (selected) {
        var tplTemp = new Ext.XTemplate();
        tplTemp.overwrite(this.getPanelDetalleProrrateo().body, {});

        if (selected.length == 1) {
            if (this.getPanelDetalleProrrateo().collapsed) {
                this.getPanelDetalleProrrateo().expand();
            }

            var arrCtaParams = [];
            selected[0].data.receptores.forEach(function (item, index, allItems) {
                arrCtaParams.push({
                    id: item.idcuentareceptor
                });
            }, this);

            var myMask = new Ext.LoadMask(this.getPanelDetalleProrrateo().getEl(), {msg: this.idioma.msgCargando});
            myMask.show();

            Ext.Ajax.request({
                scope: this,
                url: 'loadDataReceptores',
                params: {
                    ctareceptores: Ext.encode(arrCtaParams),
                    idinductor: selected[0].data.idinductor
                },
                callback: function (options, success, response) {
                    myMask.hide();
                    var responseobj = Ext.decode(response.responseText);

                    var basedistributiva = '';
                    if (selected[0].data.idorigenBD == 1) {
                        basedistributiva = 'Unidades físicas';
                    }
                    else if (selected[0].data.idorigenBD == 2) {
                        basedistributiva = 'Monto total';
                    }
                    else {
                        basedistributiva = 'Elemento de gasto';
                    }

                    var data = {
                        idorigenBD: selected[0].data.idorigenBD,
                        basedistributiva: basedistributiva,
                        idinductor: selected[0].data.idinductor,
                        inductor: selected[0].data.inductor,
                        idelementogastoaprorratear: selected[0].data.idelementogastoaprorratear,
                        elementogastoaprorratear: selected[0].data.elementogastoaprorratear,
                        receptores: responseobj.datos
                    };

                    var tpl = new Ext.XTemplate(
                        '<div class="det-general">',
                        '<h3>Origen de base distributiva:</h3>',
                        '<h2>{basedistributiva}</h2>',
                        '</div>',
                        '<div class="det-general">',
                        '<tpl if="idorigenBD == 1">',
                        '<h3>Inductor:</h3>',
                        '<h2>{inductor}</h2>',
                        '<tpl elseif="idorigenBD == 3">',
                        '<h3>Elemento de gasto a prorratear:</h3>',
                        '<h2>{elementogastoaprorratear}</h2>',
                        '</tpl>',
                        '</div>',
                        '<hr class="det-hr" />',
                        '<div>',
                        '<tpl for="receptores">',
                        '<tpl if="idinductor">',
                        '<div class="det-card">',
                        '<p>Receptor:</p>',
                        '<p>{receptor}</p>',
                        '<p>Valor: {valorinductor}</p>',
                        '</div>',
                        '<tpl else>',
                        '<div class="det-card">',
                        '<p>Receptor:</p>',
                        '<p>{receptor}</p>',
                        '</div>',
                        '</tpl>',
                        '</tpl>',
                        '</div>',
                        {
                            disableFormats: true,
                        }
                    );
                    tpl.overwrite(this.getPanelDetalleProrrateo().body, data);
                }
            });
        }
        else {
            this.getPanelDetalleProrrateo().collapse();
        }
    },
    /*
    * Función que se utiliza para eliminar el o los prorrateos seleccionados
    * */
    eliminarProrrateo: function () {
        var arrseleccionados = this.getGridProrrateo().getSelectionModel().getSelection();

        var msgPregunta = (arrseleccionados.length > 1) ? this.idioma.msgPreguntaEliminarProrrateMany : this.idioma.msgPreguntaEliminarProrrateOne;
        mostrarMensaje(2, msgPregunta, function (btn) {
            if (btn == 'ok') {
                var msgEliminando = (arrseleccionados.length > 1) ? this.idioma.msgEliminandoProrrateoMany : this.idioma.msgEliminandoProrrateoOne;
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msgEliminando});
                myMask.show();

                var arrids = [];
                arrseleccionados.forEach(function (item, index, AllItems) {
                    arrids.push(item.data.idprorrateo);
                }, this);

                Ext.Ajax.request({
                    scope: this,
                    url: 'delProrrateo',
                    params: {
                        arridprorrateos: Ext.encode(arrids)
                    },
                    callback: function (options, success, response) {
                        myMask.hide();
                        var responseobj = Ext.decode(response.responseText);

                        if(responseobj.code == 1) {
                            var msgSuccessEliminado = (arrseleccionados.length > 1) ? this.idioma.msgSuccessEliminadoProrrateoMany : this.idioma.msgSuccessEliminadoProrrateoOne;
                            mostrarMensaje(1, msgSuccessEliminado);
                            this.getStProrrateoStore().remove(arrseleccionados);
                            this.getStProrrateoStore().commitChanges();
                        }
                    }
                });
            }
        }.bind(this));
    },
    /*
    * Función que se utiliza para adicionar el prorrateo
    * */
    addmodProrrateo: function (action, datos, window, aplicar) {
        var msgMask = (action == 'add') ? this.idioma.msgAdicionandoProrrateo : this.idioma.msgModificandoProrrateo
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msgMask});
        myMask.show();

        var recordprorrateo = null;
        if (action == 'add') {
            var mdprorrateo = Ext.create('PRT.model.MdProrrateo', {
                idprorrateo: datos.idprorrateo,
                descripcion: datos.descripcion,
                idelementogastotraspaso: datos.idelementogastotraspaso,
                elementogastotraspaso: datos.elementogastotraspaso,
                idestado: datos.idestado,
                fecha: datos.fecha,
                idcuentaemisor: datos.idcuentaemisor,
                cuentaemisor: datos.cuentaemisor,
                idinductor: datos.idinductor,
                inductor: datos.inductor,
                idorigenBD: datos.idorigenBD,
                nocomprobante: datos.nocomprobante,
                idcomprobante: datos.idcomprobante,
                porcientotraspasar: datos.porcientotraspasar,
                idelementogastoaprorratear: datos.idelementogastoaprorratear,
                elementogastoaprorratear: datos.elementogastoaprorratear,
                idnivelprorrateo: datos.idnivelprorrateo,
                receptores: datos.receptores
            });

            recordprorrateo = mdprorrateo;
            this.getStProrrateoStore().add(recordprorrateo);
        }
        else {
            //Modificar
            var index = this.getStProrrateoStore().find('idprorrateo', datos.idprorrateo);
            if (index > -1) {
                var recordprorrateo = this.getStProrrateoStore().getAt(index);
                var objmodprorrateo = {
                    idprorrateo: datos.idprorrateo,
                    descripcion: datos.descripcion,
                    idelementogastotraspaso: datos.idelementogastotraspaso,
                    elementogastotraspaso: datos.elementogastotraspaso,
                    idestado: datos.idestado,
                    fecha: datos.fecha,
                    idcuentaemisor: datos.idcuentaemisor,
                    cuentaemisor: datos.cuentaemisor,
                    idinductor: datos.idinductor,
                    inductor: datos.inductor,
                    idorigenBD: datos.idorigenBD,
                    nocomprobante: datos.nocomprobante,
                    idcomprobante: datos.idcomprobante,
                    porcientotraspasar: datos.porcientotraspasar,
                    idelementogastoaprorratear: datos.idelementogastoaprorratear,
                    elementogastoaprorratear: datos.elementogastoaprorratear,
                    idnivelprorrateo: datos.idnivelprorrateo,
                    receptores: datos.receptores
                };
                recordprorrateo.set(objmodprorrateo);
            }
        }

        this.getStProrrateoStore().sync({
            scope: this,
            callback: function (batch, options) {
                myMask.hide();
                var rawData = batch.proxy.getReader().rawData;
                if (rawData.code == 1) {
                    recordprorrateo.set('idprorrateo', rawData.idprorrateo);
                    recordprorrateo.commit();

                    this.getGridProrrateo().getSelectionModel().select([recordprorrateo]);
                    //this.showDetailProrrateo([recordprorrateo]);

                    var msg = (action == 'add') ? this.idioma.msgSuccessAddProrrateo : this.idioma.msgSuccessModProrrateo;
                    mostrarMensaje(1, msg);
                }
                else if (rawData.code == 2) {
                    mostrarMensaje(1, this.idioma.msgErrorAddProrrateo);
                }
                else if (rawData.code == 3) {
                    mostrarMensaje(1, this.idioma.msgErrorAddReceptores);
                }
            }
        });

        //También se puede hacer así, lo que en el modelo en cuestión tiene que estar el proxy configurado
        /*mdprorrateo.save({
            scope: this,
            callback: function (records, operation, success) {
            }
        });*/
    },
    /*
    * Función que se utiliza para adicionar las funcionalidades del action column
    * */
    initActionColumnProrrateo: function (actioncolumn, eOpts) {

        actioncolumn.items[0].scope = this;
        actioncolumn.items[1].scope = this;
        actioncolumn.items[2].scope = this;

        //Funcionalidad del Ver comprobante
        actioncolumn.items[0].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
            viewgrid.getSelectionModel().select(record);
        };

        //Funcionalidad del Modificar
        actioncolumn.items[1].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
            viewgrid.getSelectionModel().select(record);
        };

        //Funcionalidad del Eliminar
        actioncolumn.items[2].handler = function (viewgrid, rowIndex, colIndex, item, e, record) {
            grid.getSelectionModel().select(record);
        };
    },
    /*
    * Función necesaria para validar la cantidad de niveles de prorrateos cargados
    * EL botón de Configurar esta activo siempre
    * */
    validateNivelProrrateo: function (records) {
        var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
        //Setear la fecha contable del subsistema
        //var textfecha = this.idioma.lbFechaContable + this.fechaContableObj.fecha;
        var labelfechacont = toolbarPanelProrrateo.down('label[itemId=labelfechacontable]');
        //labelfechacont.show();
        //labelfechacont.setText(textfecha);

       // var cantidanivel = records.length > 0;

        /*if (cantidanivel) {
            //Cargar el primer valor del combo nivel del prorrateo
            this.getComboNivelProrrateo().setValue(records[0].data.idnivelprorrateo);
        }
        else {
            mostrarMensaje(1, this.idioma.msgNivelesNoLoad);
        }*/
    },
    /*
    * Función necesaria para cuando se cambie le valor del combo nivel del prorrateo
    * se activen los botones corespondientes
    * */
    changeValueComboNivelProrrateo: function (newValue, oldValue) {
        if (newValue != oldValue) {
            var toolbarPanelProrrateo = this.getToolbarPanelProrrateo();
            toolbarPanelProrrateo.down('button[itemId=btnhojadistribucion]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnadicionarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
            toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
            this.getStProrrateoStore().load({
                scope: this,
                params: {
                    idnivelprorrateo: newValue
                },
                callback: function (records, operation, success) {
                    toolbarPanelProrrateo.down('button[itemId=btnhojadistribucion]').setDisabled(false);
                    toolbarPanelProrrateo.down('button[itemId=btnadicionarprorrateo]').setDisabled(false);
                    toolbarPanelProrrateo.down('button[itemId=btnmodificarprorrateo]').setDisabled(true);
                    toolbarPanelProrrateo.down('button[itemId=btneliminarprorrateo]').setDisabled(true);
                    toolbarPanelProrrateo.down('button[itemId=btnejecutarprorrateo]').setDisabled(true);
                }
            });
        }
    }
});
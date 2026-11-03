/**
 * Jorge Luis Cuellar Mondeja
 */
Ext.ns('Ext.erp')

Ext.erp.treeNomDinamicos = Ext.extend(Ext.tree.TreePanel, {
    idioma: '',
    urlControladora: '',
    rootVisible: false,
    root: {
        text: "Nomencladores",
        animate: false,
        draggable: false,
        expandable: false,
        expanded: true,
        id: '0'
    },
    constructor: function(config) {

        var _this = this;
        Ext.apply(this, config);
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: _this.urlControladora + 'getnomencladores',
            clearOnLoad: true
        });
        this.btnAdicionar = new Ext.Button({
            id: 'botonA',
            iconCls: 'adicionar',
            tooltip: _this.idioma.btnAdicionarNomenclador,
            text: _this.idioma.btnAdicionar,
            handler: function() {
                _this.mostrarVentanaGestNomenclador(true);
            }
        });
        this.btnModificar = new Ext.Button({
            id: 'botonM',
            iconCls: 'modificar',
            tooltip: _this.idioma.btnModificarNomenclador,
            text: _this.idioma.btnModificar,
            disabled: true,
            handler: function() {
                _this.mostrarVentanaGestNomenclador(false);
            }
        });
        this.btnEliminar = new Ext.Button({
            id: 'botonE',
            iconCls: 'eliminar',
            tooltip: _this.idioma.btnEliminarNomenclador,
            text: _this.idioma.btnEliminar,
            disabled: true,
            handler: function() {
                _this.eliminarNomenclador();
//                _this.delGridValores();
            }
        });
        /**
         *  Grid para la gestión de atributos dinámicos
         */
        this.gridAtribDinamicos = new Ext.erp.gridAtribDinamicos({
            schema: 'mod_datosmaestrosmeta',
            descripcionOrigen: 'Nomenclador_dinamico',
            prefijoTabla: 'Nomenclador_dinamico',
            globalHide: true,
            globalDefault: false,
            scope: _this,
            valoresIntocables: ['denominacion'],
            preOperacion: function() {
                this.btnAdicionar.enable();
                this.getStore().baseParams = {
                    arridtablas: _this.getSelectionModel().getSelectedNode().attributes.idtabla
                };
                this.idtabla = _this.getSelectionModel().getSelectedNode().attributes.idtabla;
            }
        });
        this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar];
        Ext.erp.treeNomDinamicos.superclass.constructor.apply(this, arguments);
    },
    desabilitarBtn: function() {
        var _this = this;
        _this.btnModificar.disable();
        _this.btnEliminar.disable();
    },
    mostrarVentanaGestNomenclador: function(adicionar) {
        var _this = this;
        if (!_this.vAtributos) {
            _this.vAtributos = new Ext.Window({
                title: (adicionar) ? _this.idioma.vAdicionarNomenclador : _this.idioma.vModificarNomenclador,
                closeAction: 'hide',
                layout: 'border',
                constrain: true,
                resizable: false,
                height: 300,
                width: 600,
                modal: true,
                listeners: {
                    'show': function() {

                        this.keymap.stopEvent = true;
                        this.keymap.enable();
                    },
                    'hide': function() {
                        this.keymap.disable();
                    }
                },
                keymap: new Ext.KeyMap(document, [{
                        key: 13,
                        ctrl: false,
                        alt: false,
                        stopEvent: true,
                        fn: function()
                        {
                            _this.vAtributos.buttons[1].handler();
                        }
                    }, {
                        key: 88,
                        ctrl: false,
                        alt: true,
                        stopEvent: true,
                        fn: function()
                        {
                            _this.vAtributos.buttons[0].handler();
                        }
                    }]),
                items: [
                    new Ext.FormPanel({
                        region: 'north',
                        height: 40,
                        id: 'idFormularioNomDinamocos',
                        layout: 'column',
                        frame: true,
                        listeners: {
                            'clientvalidation': function(fp, valid) {
//                                if (_this.vAtributos.buttons[1].isVisible()) {
//                                    if (_this.oldValueDenomNomDinamico != Ext.getCmp('tfAlias').getValue()) {
//                                        _this.vAtributos.buttons[1].enable();
//                                    } else {
//                                        _this.vAtributos.buttons[1].disable();
//                                    }
//                                }
                                var checkdirty = false;
                                fp.getForm().items.each(function(field) {
                                    if (field.isDirty && valid) {
                                        checkdirty = true;
                                        if (Ext.getCmp('btnCrearNomenclador').isVisible()) {
                                            Ext.getCmp('btnCrearNomenclador').enable();
                                        }
                                        if (_this.vAtributos.buttons[1].isVisible()) {
                                            _this.vAtributos.buttons[1].enable();
                                        }
                                    }
                                });
                                if (!checkdirty) {
                                    if (Ext.getCmp('btnCrearNomenclador').isVisible()) {
                                        Ext.getCmp('btnCrearNomenclador').disable();
                                    }
                                    if (_this.vAtributos.buttons[1].isVisible()) {
                                        _this.vAtributos.buttons[1].disable();
                                    }
                                }
                            }
                        },
                        items: [
                            {
                                width: 470,
                                layout: 'form',
                                labelWidth: 150,
                                items: [
                                    {
                                        xtype: 'textfield',
                                        id: 'tfAlias',
                                        value: '',
                                        name: 'text',
                                        fieldLabel: _this.idioma.lbNombreNomenclador,
                                        regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ]*){1,35}$/,
                                        maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ]*){1,35}$/,
                                        regexText: _this.idioma.lbValorIncorrectoTextArea,
                                        width: 300,
                                        allowBlank: false,
                                        maxLength: 35,
                                        maxLengthText: _this.idioma.lbMsgMaxLongNomNomenclador,
                                        minLength: 2,
                                        minLengthText: _this.idioma.lbMsgMinLongNomNomenclador,
                                        listeners: {
                                            'valid': function(field) {
                                                if (field.getValue().charAt(0) == ' ') {
                                                    field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                                                } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                                                    field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                                                } else {
                                                    for (var i = 0; i < field.getValue().length - 1; i++) {
                                                        var char = field.getValue().charAt(i);
                                                        if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                                            var char1 = field.getValue().charAt(i + 1);
                                                            if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                                                field.markInvalid(_this.idioma.lbValorIncorrectoTextArea);
                                                            }
                                                        }

                                                    }
                                                }
                                            }
                                        }

                                    }
                                ]
                            },
                            {
                                width: 100,
                                items: [
                                    {
                                        style: 'margin-top: 1px;',
                                        xtype: 'button',
                                        id: 'btnCrearNomenclador',
                                        disabled: true,
                                        text: _this.idioma.btnCrear,
                                        tooltip: _this.idioma.btnTtCrear,
                                        iconCls: 'nuevo',
                                        handler: function() {
                                            if (Ext.getCmp('tfAlias').isValid())
                                            {
                                                if (_this.trimvalores(Ext.getCmp('tfAlias').getValue()).length > 0) {
                                                    _this.adicionarNomenclador(Ext.getCmp('tfAlias').getValue(), adicionar);
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]

                    }), new Ext.Panel({
                        region: 'center',
                        layout: 'fit',
                        items: [_this.gridAtribDinamicos]
                    })],
                buttons: [
                    {
                        text: _this.idioma.btnCancelar,
                        iconCls: 'cerrar',
                        id: 'btnCerrarVentana',
                        tooltip: _this.idioma.lbToltipCancelar,
                        handler: function() {
                            _this.vAtributos.hide();
                            _this.fnLoadGrid(_this.getSelectionModel().getSelectedNode());
                            //_this.gridAtribDinamicos.getStore().removeAll();
                        }
                    },
                    {
                        text: _this.idioma.btnAceptar,
                        iconCls: 'aceptar',
                        disabled: true,
                        id: 'btnCambiarDenominacion',
                        tooltip: _this.idioma.lbToltipAdicionar,
                        handler: function() {
                            _this.modificarNombreNomenclador(Ext.getCmp('tfAlias').getValue());
                            _this.vAtributos.hide();
                        }
                    }
                ]
            });
            _this.vAtributos.show();
            _this.addVentana(_this, adicionar);
        } else {
            (adicionar) ? _this.vAtributos.setTitle(_this.idioma.vAdicionarNomenclador) : _this.vAtributos.setTitle(_this.idioma.vModificarNomenclador);
            _this.vAtributos.show();
            _this.addVentana(_this, adicionar);
        }
    },
    trimvalores: function(cadena) {
        var retorno = cadena.replace(/^\s+/g, '');
        retorno = retorno.replace(/\s+$/g, '');
        return retorno;
    },
    addVentana: function(_this, adicionar) {
        var _this = this;

        Ext.getCmp('btnCrearNomenclador').setVisible(adicionar);
        Ext.getCmp('btnCambiarDenominacion').setVisible(!adicionar);
        _this.gridAtribDinamicos.setDisabled(adicionar);
        if (!adicionar) {
            _this.oldValueDenomNomDinamico = _this.trimvalores(_this.getSelectionModel().getSelectedNode().attributes.text);
            Ext.getCmp('tfAlias').setValue(_this.oldValueDenomNomDinamico);
//            Ext.getCmp('tfAlias').originalValue = _this.oldValueDenomNomDinamico;
            _this.gridAtribDinamicos.getStore().load();
        } else {
            Ext.getCmp('tfAlias').reset();
        }

        //Ext.getCmp('tfAlias').clearInvalid();
        Ext.getCmp('tfAlias').focus(false);
    },
    adicionarNomenclador: function(nombre, adicionar) {
        var _this = this;
        var doble = false;
        _this.getRootNode().eachChild(function(node) {
            if (node.attributes.text.toUpperCase() == nombre.toUpperCase()) {
                doble = true;
            }
        });
        if (doble) {
            mostrarMensaje(3, _this.idioma.lbMsgAdicionarError);
        } else {
            if (!Ext.getCmp('tfAlias').isValid()) {
                mostrarMensaje(3, _this.idioma.lbValidar2)
            } else {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: adicionar ? "Adicionando..." : "Modificando..."});
                myMask.show();
                Ext.Ajax.request({
                    url: adicionar ? _this.urlControladora + 'insertarnomenclador' : _this.urlControladora + 'modificarnomenclador',
                    method: 'POST',
                    params: {
                        alias: nombre
                    },
                    callback: function(options, success, response) {
                        myMask.hide();
                        var rd = Ext.decode(response.responseText);
                        if (rd.success == true) {
                            mostrarMensaje(1, _this.idioma.lbGuardarOk);
                            _this.gridAtribDinamicos.setDisabled(false);
                            _this.getLoader().load(_this.getRootNode(), function() {
                                _this.getRootNode().expand();
                                var nodoselecionado = _this.getNodeById(rd.idtabla);
                                if (!nodoselecionado.isSelected())
                                    nodoselecionado.select();
                                _this.gridAtribDinamicos.getStore().load();
                            });
                        } else {
                            mostrarMensaje(3, _this.idioma.lbMsgAdicionarError)
                        }
                    }
                });
            }
        }
    },
    modificarNombreNomenclador: function(nombre) {
        var _this = this;
        var doble = false;
        _this.getRootNode().eachChild(function(node) {
            if (node.attributes.text.toUpperCase() == nombre.toUpperCase()) {
                doble = true;
            }
        });
        if (doble) {
            mostrarMensaje(3, _this.idioma.lbMsgModificarError);
        } else {
            var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Modificando..."});
            myMask.show();
            Ext.Ajax.request({
                url: _this.urlControladora + 'modificarnomenclador',
                method: 'POST',
                params: {
                    idtabla: _this.getSelectionModel().getSelectedNode().attributes.idtabla,
                    alias: nombre
                },
                callback: function(options, success, response) {
                    myMask.hide();
                    var rd = Ext.decode(response.responseText);
                    if (rd.success == true) {
                        mostrarMensaje(1, _this.idioma.lbModificarOk);
                        _this.getLoader().load(_this.getRootNode(), function() {

                            _this.getRootNode().expand();
                            var node = _this.getNodeById(0);
                            if (!node.isSelected())
                                node.select();
                            _this.desabilitarBtn();
                            _this.delGridValores();
                        });
                    } else {
                        mostrarMensaje(3, _this.idioma.lbMsgModificarError);
                    }
                }
            });
        }
    },
    eliminarNomenclador: function() {
        var _this = this;
        function elimina(button) {
            if (button == 'ok') {
                var nodoSeleccionado = _this.getSelectionModel().getSelectedNode();
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Eliminando..."});
                myMask.show();
                Ext.Ajax.request({
                    url: _this.urlControladora + 'eliminarnomenclador',
                    method: 'POST',
                    params: {
                        idtabla: nodoSeleccionado.attributes.idtabla
                    },
                    callback: function(options, success, response) {
                        myMask.hide();
                        var rd = Ext.decode(response.responseText);
                        if (rd.success == true) {
                            mostrarMensaje(1, _this.idioma.lbEliminarOk);
                            _this.delGridValores();
                            nodoSeleccionado.remove();
                            nodoSeleccionado = _this.getNodeById(0);
                            if (!nodoSeleccionado.isSelected()) {
                                nodoSeleccionado.select();
                                _this.desabilitarBtn();
                            }

                        } else {
                            mostrarMensaje(3, _this.idioma.lbMsgAdicionarError);
                        }
                    }
                });
            }
        }

        mostrarMensaje(2, _this.idioma.lbEliminarNomencladores, elimina);
    }
});
Ext.erp.panelNomDinamicos = Ext.extend(Ext.Panel, {
    idioma: '',
    urlControladora: '',
    gpValores: true,
    accionModificar: true,
    Record: false,
    columnasValores: false,
    columRecord: false,
    idtabla: '',
    filaSeleccionada: false,
    constructor: function(config) {
        var _this = this;
        _this.myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});
        Ext.apply(this, config);
        this.btnAdicionar = new Ext.Button({
            id: 'botonA1',
            iconCls: 'adicionar',
            tooltip: _this.idioma.btnAdicionarValor,
            text: _this.idioma.btnAdicionar,
            disabled: true,
            handler: function() {
                _this.adicionarValor();
            }
        })

        this.btnEliminar = new Ext.Button({
            id: 'botonE1',
            iconCls: 'eliminar',
            tooltip: _this.idioma.btnEliminarValor,
            text: _this.idioma.btnEliminar,
            disabled: true,
            handler: function() {
                _this.eliminarValores();
            }
        })

        this.btnGuardar = new Ext.Button({
            id: 'botonG',
            iconCls: 'guardar',
            tooltip: _this.idioma.btnGuardarCambios,
            text: _this.idioma.btnGuardar,
            disabled: true,
            handler: function() {
                _this.guardarValores();
            }
        })

        this.btnAyuda = new Ext.Button({
            id: 'botonAyuda',
            iconCls: 'ayuda',
            tooltip: _this.idioma.btnTtAyuda,
            text: _this.idioma.btnAyuda/*,
             handler: function() {
             var referencia = 'Logistica/Gestion de transporte/Configuracion/Nomencladores dinámicos';
             help.show(_this.idioma.btnAyuDin, referencia);
             }*/
        })

        this.tbar = [_this.btnAdicionar, _this.btnEliminar, _this.btnGuardar, '->', _this.btnAyuda];
        Ext.erp.panelNomDinamicos.superclass.constructor.apply(this, arguments);
    },
    modificarTupla: function(pTupla) {
        var _this = this;
        var tupla = {};
        var _expresionReg = function _expresionReg(tupla) {

            if (pTupla['regex'] && pTupla['regex'] != "" && pTupla['regex'] != "//") {
                //tupla['maskRe'] = Ext.decode(pTupla['regex']);
                tupla['regex'] = Ext.decode(pTupla['regex']);
            }
            return tupla;
        }
        for (var item in pTupla) {
            if (item != 'xtype' && item != 'anchor' && item != 'fieldLabel' && item != 'regex') {
                tupla[item] = pTupla[item];
            }
        }

        tupla.id = tupla.name;
        switch (pTupla.xtype) {
            case 'textfield' :
                var componente = new Ext.form.TextField(_expresionReg(tupla));
                break;
            case 'numberfield' :
                var componente = new Ext.form.NumberField(_expresionReg(tupla));
                break;
            case 'textarea' :
                var componente = new Ext.form.TextArea(_expresionReg(tupla));
                break;
            case 'combo' :
                var componente = _this._adecuarCombo(tupla);
                break;
            case 'checkbox' :
                var componente = new Ext.form.Checkbox(tupla);
                break;
            case 'datefield' : // xxx
                var componente = new Ext.form.DateField(tupla);
                componente.format = 'd/m/Y';
                break;
        }
        if (typeof (componente) != 'undefined') {

            componente.enableKeyEvents = true;
            return new Ext.grid.GridEditor(componente);
        }
    },
    getGridValoresNomDinamicos: function(nodo) {
        var _this = this;
        _this.columRecord = Array();
        _this.columnasValores = Array();
        //if (_this.gpValores) {
        _this.maskActiva = true;
        _this.myMask.show();
        if (_this.gpValores) {
            _this.remove(_this.gpValores);
        }
        if (_this.idtabla && _this.idtabla != -1) {
            Ext.Ajax.request({
                url: _this.urlControladora + 'getgridatributos',
                method: 'POST',
                params: {
                    idtabla: _this.idtabla
                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    var columnas = rd.cm;
                    var columnasId = rd.rd;
                    var i = 0;
                    function formatDate(value) {

                        if (value != null && value.toString().length > 0) {
                            var fecha = value.toString().split("-");
                            if (fecha.length > 2) {
                                value = fecha[2] + '/' + fecha[1] + '/' + fecha[0];
                            } else {
                                fecha = new Date(value);
                                var d = fecha.getDate();
                                var m = (fecha.getMonth() + 1);
                                var Y = fecha.getFullYear();
                                value = ((d.toString().length == 2) ? d : '0' + d) + "/" + ((m.toString().length == 2) ? m : '0' + m) + "/" + Y;
                            }
                        }
                        return value;
                    }
                    ;
                    function comboDenomStore(value) {
                        var valueMostrar = "";
                        var thisreg = this;
                        var columna = _this.gpValores.getColumnModel().getColumnById(thisreg.id);
                        var storeCombo = columna.editor.field.store;
                        var combo = columna.editor.field;
                        for (var i = 0; i < storeCombo.data.items.length; i++) {
                            for (var prop in storeCombo.data.items[i].data) {
                                if (prop == combo.valueField && storeCombo.data.items[i].data[prop] == value) {

                                    return  storeCombo.data.items[i].data[combo.displayField];
                                }
                            }
                        }
                        return valueMostrar;
                    }

                    for (var tupla in columnas) {
                        if (tupla != 'remove') {
                            if (rd.items[tupla].xtype == 'datefield')
                                columnas[tupla]['renderer'] = formatDate;
                            if (rd.items[tupla].xtype == 'combo')
                                columnas[tupla]['renderer'] = comboDenomStore;
                            _this.columnasValores[columnas[tupla].dataIndex] = '';
                            columnas[tupla]['editor'] = _this.modificarTupla(rd.items[tupla]);
                        }
                        i++;
                    }

                    columnas[0]['id'] = columnas[0].dataIndex;
                    i = 0;
                    for (var tupla in columnasId) {
                        if (tupla != 'remove') {
                            _this.columRecord[i] = {
                                name: columnasId[tupla].name,
                                mapping: columnasId[tupla].name
                            }
                        }
                        i++;
                    }

                    _this.Record = new Ext.data.Record.create(_this.columRecord);
                    var store = new Ext.data.Store({
                        url: _this.urlControladora + 'getvalores',
                        reader: new Ext.data.JsonReader({
                            totalProperty: 'total',
                            root: 'datos'
                        }, _this.columRecord),
                        listeners: {
                            'beforeload': function(store, opciones) {
                                if (!_this.maskActiva) {
                                    _this.myMask.show();
                                }
                                store.baseParams.idtabla = _this.idtabla;
                                //                            Ext.getCmp('btnAdicionarValor').enable();
                                //                            Ext.getCmp('btnGuardarValor').enable();
                            },
                            'load': function(store, opciones) {
                                _this.myMask.hide();
                                _this.maskActiva = false;
                                _this.accionModificar = true;
                                if (store.getCount() > 0) {
                                    _this.gpValores.getSelectionModel().selectFirstRow();
                                    _this.btnEliminar.enable();
                                } else
                                    _this.btnEliminar.disable();
                            }
                        }
                    });
                    _this.gpValores = new Ext.grid.EditorGridPanel({
                        enableKeyEvents: true,
                        clicksToEdit: 1,
                        autoExpandColumn: columnas[0].dataIndex,
                        sm: new Ext.grid.RowSelectionModel({
                            moveEditorOnEnter: false,
                            singleSelect: false,
                            listeners: {
                                'rowselect': function(sm, rowIndex, r) {
                                    _this.btnEliminar.enable();
                                    //_this.btnGuardar.enable();

                                    _this.filaSeleccionada = rowIndex;
                                },
                                'rowdeselect': function(sm, rowIndex, r) {
                                    _this.filaSeleccionada = false;
                                }
                            }
                        }),
                        columns: columnas,
                        store: store,
                        listeners: {
                            'afteredit': function(e) {
                                _this.btnGuardar.enable();
                                //                            if (e.getKey() == 13)
                                //                                adicionarValor();
                            }
                        },
                        bbar: new Ext.PagingToolbar({
                            pageSize: 20,
                            store: store,
                            displayInfo: true,
                            displayMsg: _this.idioma.lbGpMsgBBar,
                            emptyMsg: _this.idioma.lbGpMsgBBar2
                        })
                    });
                    _this.setTitle(_this.idioma.lbPanelValores + ' ( ' + nodo.text + ' )');
                    _this.add(_this.gpValores);
                    _this.doLayout();
                    _this.btnAdicionar.enable();
                    store.load();
                }
            });
        } else {
            _this.myMask.hide();
        }
        //}
    },
    _adecuarCombo: function(tupla) {
        var _this = this;
        var store = _this._adecuarStore(tupla);
        var combo = new Ext.form.ComboBox({
            tpl: '<tpl for="."><div ext:qtip="{' + tupla.displayField + '}" class="x-combo-list-item">{' + tupla.displayField + '}</div></tpl>',
            valueField: tupla.valueField,
            displayField: tupla.displayField,
            allowBlank: tupla.allowBlank,
            editable: false,
            //id: tupla.id,
            name: tupla.hiddenName,
//                fieldLabel: (tupla.fieldLabel) ? tupla.fieldLabel : tupla.hiddenName,
            lazyRender: true,
            store: store,
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            listeners: {
                "select": function() {
                    _this.gpValores.getColumnModel().ge
                }
            }
        });
        return combo;
    },
    _adecuarStore: function(tupla) {
        var str = tupla.store.replace("new Ext.data.JsonStore({", '');
        str = str.replace("})", '');
        var config = Ext.decode("{" + str + "}");
        var _data = Array();
        var _fields = Array();
        for (var i = 0; i < config.data.length; i++) {
            var _subData = Array();
            for (var key in config.data[i]) {
                _subData.push(config.data[i][key]);
            }

            if (_subData.length > 0) {
                _data.push(_subData.reverse());
            }

            _fields.push(config.fields[i]);
        }

        var store = new Ext.data.SimpleStore({
            fields: _fields,
            data: _data
        });
        return store;
    },
    setIdTabla: function(idtabla) {
        this.idtabla = idtabla;
    },
    adicionarValor: function() {
        var _this = this;
        if (_this.gpValores.getStore().getCount() > 0) {

            if (_this.accionModificar) {
                addTupla();
            }

        } else {
            addTupla();
        }

        _this.gpValores.getSelectionModel().selectFirstRow();
        _this.gpValores.startEditing(0, 0);
        function addTupla() {
            if (_this.Record) {
                _this.accionModificar = false;
                var columnaFechaInicio = false;
                var date = new Date();
                var tupla = new _this.Record(_this.columnasValores);
                for (var key in tupla.data) {
                    if (columnaFechaInicio == false) {
                        var arreglo = key.split('fechainicio');
                        if (arreglo.length > 1) {
                            columnaFechaInicio = key;
                        }
                    }
                    tupla.data[key] = null;
                }
                tupla.data['new'] = true;
                _this.gpValores.stopEditing();
                _this.gpValores.getStore().insert(0, tupla);
                _this.gpValores.getStore().getAt(0).set(columnaFechaInicio, date);
            } else
                throw ('Undefined param "Record"');
        }
    },
    trimvalores: function(cadena) {
        var valor1 = cadena.replace(/^\s+/g, '');
        var valor2 = valor1.replace(/\s/g, '');
        var result = valor2.replace(" ", "");
        return result.toLowerCase();
    },
    guardarValores: function() {
        var _this = this;
        if (_this.gpValores) {

            var campoVacio = false;
            for (var i = 0; i < _this.gpValores.getColumnModel().config.length; i++) {
                var record = _this.gpValores.getSelectionModel().getSelected();
                var value = record.get(_this.gpValores.getColumnModel().config[i].dataIndex);
                value = (value == null) ? '' : value.toString().replace(/[\s]/ig, '');

                var lenValue = value.length;
                if (_this.gpValores.getColumnModel().config[i].editor.field.allowBlank != null && !_this.gpValores.getColumnModel().config[i].editor.field.allowBlank && lenValue == 0) {
                    mostrarMensaje(1, _this.idioma.lbMsgFormInvalido);
                    _this.gpValores.startEditing(_this.filaSeleccionada, _this.gpValores.getColumnModel().getIndexById(_this.gpValores.getColumnModel().config[i].id));
                    campoVacio = true;
                    record.set(_this.gpValores.getColumnModel().config[i].dataIndex, '');
                    break;
                }
            }
            if (!campoVacio) {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Guardando..."});
                myMask.show();
                var records = _this.gpValores.getStore().getModifiedRecords();
                if (_this.validValuesRepeat(records)) {
                    myMask.hide();
                    mostrarMensaje(1, _this.idioma.lbMsgValoresRepetidos);
                    return;
                }
                var adicionar = false;
                var datos = Array();
                if (records[0].get('new') == true) {
                    datos[0] = records[0].getChanges();
                    adicionar = true;
                } else {
                    for (var i = 0; i < records.length; i++) {
                        datos[i] = records[i].data;
                    }
                }

                Ext.Ajax.request({
                    url: _this.urlControladora + ((adicionar == true) ? 'insertarvalores' : 'modificarvalores'),
                    method: 'POST',
                    params: {
                        idtabla: _this.idtabla,
                        datos: Ext.encode(datos)
                    },
                    callback: function(options, success, response) {
                        myMask.hide();
                        var rd = Ext.decode(response.responseText);
                        if (rd.success == true) {
                            mostrarMensaje(1, _this.idioma.lbMsgGuardarCambios);
                            _this.btnGuardar.disable();
                            _this.gpValores.getStore().reload();
                            _this.gpValores.getStore().rejectChanges();
                        } else {
                            mostrarMensaje(3, _this.idioma.lbMsgAdicionarError);
                        }
                    }
                });
            }

        } else
            throw ('Undefined param "gpValores"');
    },
    validValuesRepeat: function(records) {
        var _this = this;
        var existe = false;

        //for (var i = 0; i < _this.gpValores.getColumnModel().config.length; i++) {
            for (var j = 0; j < records.length; j++) {
                var record = records[j];
                var value = record.get(_this.gpValores.getColumnModel().config[0].dataIndex);
                if (value != null && value != '') {
                    value = value.toString().replace(/[\s]/ig, '');
                    _this.gpValores.getStore().each(function(rd) {
                        if (record.id != rd.id) {
                            var valueSaved = rd.get(_this.gpValores.getColumnModel().config[0].dataIndex);
                            if (valueSaved != null && valueSaved != '') {
                                valueSaved = valueSaved.toString().replace(/[\s]/ig, '');
                                if (valueSaved == value) {
                                    existe = true;
                                    var indexRecord = _this.gpValores.getStore().indexOf(record);
                                    _this.gpValores.startEditing(indexRecord, _this.gpValores.getColumnModel().getIndexById(_this.gpValores.getColumnModel().config[0].id));
                                    return;
                                }
                            }
                        }
                    });
                }
            }
        //}
        return existe;
    },
    eliminarValores: function() {

        var _this = this;
        function elimina(button) {
            if (button == 'ok') {
                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: "Eliminando..."});
                myMask.show();
                var records = _this.gpValores.getSelections();
                var datos = Array();
                for (var i = 0; i < records.length; i++) {
                    datos[i] = records[i].data;
                }

                Ext.Ajax.request({
                    url: _this.urlControladora + 'eliminarvalores',
                    method: 'POST',
                    params: {
                        idtabla: _this.idtabla,
                        datos: Ext.encode(datos)
                    },
                    callback: function(options, success, response) {
                        myMask.hide();
                        var rd = Ext.decode(response.responseText);
                        if (rd.success == true) {
                            _this.gpValores.getStore().reload();
                            mostrarMensaje(1, _this.idioma.lbMsgEliminarValor);
                        } else {
                            mostrarMensaje(3, _this.idioma.lbMsgAdicionarError);
                        }
                    }
                });
            }
        }

        mostrarMensaje(2, _this.idioma.lbEliminar2, elimina);
    }
});
Ext.erp.compNomDinamicos = Ext.extend(Ext.Panel, {
    /**
     *  Arreglo de etiquetas de la interfaz
     */
    idioma: '',
    /**
     *  Dirección de la controladora del componente
     */
    urlControladora: '/configuracion/nomdinamicos/index.php/nomdinamicos/',
    constructor: function(config) {
        var _this = this;
        Ext.Ajax.request({
            url: ((config.urlControladora) ? config.urlControladora : _this.urlControladora) + 'cargaretiquetas',
            method: 'POST',
            callback: function(options, success, response) {
                if (success) {

                    _this.idioma = Ext.decode(response.responseText);
                    _this._initComponent();
                }
            }
        });
        Ext.erp.compNomDinamicos.superclass.constructor.apply(this, arguments);
    },
    _initComponent: function() {
        var _this = this;
        this.treeNomDinamicos = new Ext.erp.treeNomDinamicos({
            idioma: _this.idioma,
            urlControladora: _this.urlControladora,
            delGridValores: function() {
                _this.gridValoresNomDinamicos.remove(_this.gridValoresNomDinamicos.gpValores);
                _this.gridValoresNomDinamicos.gpValores = false;
            },
            fnLoadGrid: function(node) {
                _this.loadGridAtributos(node);
            },
            listeners: {
                'click': function(node) {
                    if (!node.isSelected())
                        node.select();
                    _this.loadGridAtributos(node);
                    if (node.id != 0) {
                        this.btnModificar.enable();
                        this.btnEliminar.enable();
                    }
                }
            }
        });
        this.gridValoresNomDinamicos = new Ext.erp.panelNomDinamicos({
            idioma: _this.idioma,
            urlControladora: _this.urlControladora,
            region: 'center',
            layout: 'fit',
            title: _this.idioma.lbPanelValores
        });
        this.layout = 'border';
        this.items = [
            {
                width: 250,
                region: 'west',
                layout: 'fit',
                collapsible: true,
                autoScroll: true,
                animCollapse: false,
                animate: false,
                split: true,
                collapsed: false,
                titleCollapse: true,
                title: _this.idioma.lbPanelNomencladores,
                items: [_this.treeNomDinamicos]
            },
            _this.gridValoresNomDinamicos
        ];
        Ext.erp.compNomDinamicos.superclass.initComponent.call(this);
        this.show();
        this.initHotKeys();
    },
    loadGridAtributos: function(node) {
        var _this = this;
        if (node) {
            _this.gridValoresNomDinamicos.setIdTabla(node.attributes.idtabla);
            _this.gridValoresNomDinamicos.getGridValoresNomDinamicos(node);
        } else {
            node = _this.treeNomDinamicos.getRootNode();
            _this.gridValoresNomDinamicos.setIdTabla(-1);
            _this.gridValoresNomDinamicos.getGridValoresNomDinamicos(node);
        }

    },
    initHotKeys: function() {
        var _this = this;
        document.onkeyup = function(e) {
            if (e.ctrlKey) {
                if (e.which == Ext.EventObject.I) {
                    if (!Ext.getCmp('botonA').disabled)
                        Ext.getCmp('botonA').handler();
                } else if (e.which == Ext.EventObject.M) {
                    if (!Ext.getCmp('botonM').disabled)
                        Ext.getCmp('botonM').handler();
                }

                else if (e.which == Ext.EventObject.G) {
                    if (!Ext.getCmp('botonG').disabled)
                        Ext.getCmp('botonG').handler();
                }

                if (e.which == Ext.EventObject.DELETE) {
                    if (!Ext.getCmp('botonE').disabled)
                        Ext.getCmp('botonE').handler();
                }
            } else {
                if (e.altKey) {
                    if (e.which == Ext.EventObject.I) {
                        if (!_this.treeNomDinamicos.vAtributos || (_this.treeNomDinamicos.vAtributos && !_this.treeNomDinamicos.vAtributos.isVisible())) {
                            if (!Ext.getCmp('botonA1').disabled)
                                Ext.getCmp('botonA1').handler();
                        }
                    }

                    else if (e.which == Ext.EventObject.G) {
                        if (!Ext.getCmp('botonG').disabled)
                            Ext.getCmp('botonG').handler();
                    }

                    else if (e.which == Ext.EventObject.H) {
                        Ext.getCmp('botonAyuda').handler();
                    }
                }
                if (e.which == Ext.EventObject.DELETE) {
                    if (!Ext.getCmp('botonE1').disabled)
                        Ext.getCmp('botonE1').handler();
                }
            }

        };
    }
});


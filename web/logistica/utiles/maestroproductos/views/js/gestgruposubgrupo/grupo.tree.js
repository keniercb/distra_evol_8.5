Ext.ns('Ext.aft.grupo');
/**
 * Jorge Luis Cuellar Mondeja
 * 08/05/2013
 */
Ext.aft.grupo.tree = Ext.extend(Ext.tree.TreePanel, {
    constructor: function(config) {
        var _self = this;
        this.etiq = config.etiq;

        //this.enableDD = true;
        this.bodyStyle = 'background-color:#FFFFFF;';
        this.maskDisabled = true;
        this.width = 270;
        this.maxSize = 264;
        this.collapsible = true;
        this.collapseMode = 'mini';
        this.autoScroll = true;
        this.animCollapse = false;
        this.animate = false;
        this.split = true;
        this.idnodo = 0;

        var LoadMask;
        this.loader = new Ext.tree.TreeLoader({
            dataUrl: 'gettreegrupo',
            listeners: {
                'beforeload': function(loader, nodo, fnCallBack) {
                    Ext.getBody().mask(_self.etiq.lbMsgCargandoDatos, 'x-mask-loading');
                    _self.loaderBeforeLoad(loader, nodo, _self.etiq, _self.tfGrupoFiltro.getValue());
                    LoadMask = new Ext.LoadMask(config.id, {
                        msg: _self.etiq.lbCar
                    });
                    LoadMask.show();
                },
                'load': function() {
                    Ext.getBody().unmask();

                    LoadMask.hide();

                    if (Ext.aft.grupoNodeSeleccionado) {
                        _self.treeClick(Ext.aft.grupoNodeSeleccionado);
                    } else {
                        _self.treeClick(_self.getRootNode());
                    }
                }

            }
        });

        this.btnAdicionarGrupos = config.btnAdicionarGrupos;
        this.btnAdicionarGrupos.on('click', function() {
            _self.wingestGrupo(_self.etiq, true, _self.idnodo);
        });

        this.btnModificarGrupos = config.btnModificarGrupos;
        this.btnModificarGrupos.on('click', function() {
            _self.wingestGrupo(_self.etiq, false, _self.idnodo);
        });

        this.btnEliminarGrupos = config.btnEliminarGrupos;
        this.btnEliminarGrupos.on('click', function() {
            _self.eliminarGrupo(_self.etiq, _self);
        });

        this.btnBuscarGrupos = config.btnBuscarGrupos;
        this.btnBuscarGrupos.on('click', function() {
            _self.filtrarArbol();
        });
        this.btnLimpiar = config.btnLimpiar;
        this.btnLimpiar.on('click', function() {
            _self.onTreeClear();
        });
        this.tfCodigoFiltro = new Ext.form.TextField({
            fieldLabel: _self.etiq.lbCodigo,
            enableKeyEvents: true,
            maskRe: /^[0-9]+$/,
            regex: /^[0-9]+$/,
            width: 125,
            listeners: {
                'keypress': function(t, e) {
                    validarCantidadCaracteres(t, 20, e);
                },
                'keyup': function(textfield, eventObj) {
                    if (eventObj.getCharCode() == 13) {
                        _self.filtrarArbol();
                    }
                }
            }
        });

        this.tfGrupoFiltro = new Ext.form.TextField({
            fieldLabel: _self.etiq.lbGrupo,
            enableKeyEvents: true,
            emptyText: _self.etiq.lbMsgTextFieldBuscarTree,
            regexText: _self.etiq.lbValorIncorrectoTextArea,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñü/(Ñ0-9]+)([/./,]?[-_\s/(]?[a-zA-ZÁÉÍÓÚáéíóúñü/)Ñ0-9])*$/,
            width: 210,
            listeners: {
                'keypress': function(t, e) {
                    validarCantidadCaracteres(t, 60, e);
                },
                'keyup': function(textfield, eventObj) {
                    if (eventObj.getCharCode() == 13) {
                        _self.filtrarArbol();
                    }
                }
            }
        });

        this.tbar = new Ext.Toolbar({
            bodyBorder: false,
            frame: true,
            items: [new Ext.FormPanel({
                    style: 'margin: -4px',
                    labelPad: 1,
                    labelWidth: 55,
                    width: 500,
                    items: [
                        {
                            xtype: 'panel',
                            tbar: [_self.btnAdicionarGrupos, _self.btnModificarGrupos, _self.btnEliminarGrupos]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            tbar: [_self.tfGrupoFiltro, ' ', _self.btnBuscarGrupos, ' ', _self.btnLimpiar]
                        }
                    ]
                })]
        });

        this.root = new Ext.tree.AsyncTreeNode({
            text: _self.etiq.lbTitleGrupo,
            animate: false,
            draggable: false,
            expandable: false,
            expanded: true,
            id: '0'
        });

        this.listeners = {
            'dblclick': _self.treeDbleClick,
            'click': _self.treeClick,
            'beforecollapsenode': _self.treeBeforeCollapseNode,
            'beforeexpandnode': _self.treeBeforeExpandNode
        };

        Ext.aft.grupo.tree.superclass.constructor.apply(this, arguments);
    },
    filtrarArbol: function() {
        var _self = this;
        _self.loader.load(_self.getRootNode(), function() {
            _self.getRootNode().expand();
            if (_self.getRootNode().childNodes.length == 0) {
                mostrarMensaje(1, _self.etiq.lbMsgBuscarGrupoSubgrupo);
            }
        });
    },
    treeDbleClick: function(node, e) {
        Ext.aft.grupoNodeSeleccionado = node;
    },
    onTreeClear: function() {
        var _this = this.scope || this;
        _this.getLoader().baseParams = {};
        _this.tfGrupoFiltro.reset();
        _this.loader.load(_this.getRootNode());
    },
    treeClick: function(node, e) {
        var _self = this;

        var nohijo = Ext.aft.grupoNodeSeleccionado.attributes.ordender - Ext.aft.grupoNodeSeleccionado.attributes.ordenizq;

        if (nohijo == 1) {
            _self.idnodo = node.attributes.id;
        } else {
            _self.idnodo = 0;
        }

        Ext.aft.grupoNodeSeleccionado = node;

        if (!Ext.aft.grupoNodeSeleccionado.isSelected()) {
            Ext.aft.grupoNodeSeleccionado.select();
            _self.main.grid.store.reload();
        }

        if (!Ext.aft.grupoNodeSeleccionado.isExpanded()) {
            Ext.aft.grupoNodeSeleccionado.expand();
        }

        var nodoPadre = (Ext.aft.grupoNodeSeleccionado.id == 0) ? (Ext.aft.grupoNodeSeleccionado) : (Ext.aft.grupoNodeSeleccionado.parentNode);

        if (nodoPadre.id != 0) {
            Ext.aft.grupoNodeSeleccionado.attributes.arrTablas = nodoPadre.attributes.arrTablas + ',' + Ext.aft.grupoNodeSeleccionado.attributes.idtabla;
            Ext.aft.grupoNodeSeleccionado.attributes.arrTablasGeneral = nodoPadre.attributes.arrTablasGeneral + ',' + Ext.aft.grupoNodeSeleccionado.attributes.idtablageneral;
        }

        this.fnConfBotones(this.main);

    },
    treeBeforeCollapseNode: function(node) {
        var _self = this;
        Ext.aft.grupoNodeSeleccionado = node;

        if (!Ext.aft.grupoNodeSeleccionado.isSelected()) {
            _self.treeClick(node);
        }
    },
    treeBeforeExpandNode: function(node) {
        var _self = this;
        Ext.aft.grupoNodeSeleccionado = node;

        if (!Ext.aft.grupoNodeSeleccionado.isSelected()) {
            _self.treeClick(node);
        }
    },
    /*
     *  Eventos que se deben disparar antes de que el árbol cargue datos
     */
    loaderBeforeLoad: function(loader, nodo, etiq, denominacion) {

        loader.baseParams.denominacion = denominacion;
        loader.baseParams.nivel = nodo.attributes.nivel;

    },
    /*
     *  Crear la ventana para la gestión de un grupo ya sea a la hora de adicionar o modificar
     *  @param etiq Arreglo de etiquetas de la interfaz
     *  @param adicionar Si estoy adicionando o modificando un grupo
     */
    wingestGrupo: function(etiq, adicionar, idnodo) {
        var _this = this;
        if (!_this.ventana || !_this.ventana.isVisible()) {
            var idformato;
            var fecha = new Date();
            var longitud_formato_mostrar;
            var nodohijo = Ext.aft.grupoNodeSeleccionado.attributes.ordender - Ext.aft.grupoNodeSeleccionado.attributes.ordenizq;

            var nivelnodo;
            nivelnodo = Ext.aft.grupoNodeSeleccionado.getDepth();

            if (!adicionar) {
                nivelnodo = Ext.aft.grupoNodeSeleccionado.getDepth() - 1;
            }

            if (Ext.aft.grupoNodeSeleccionado.id != 0) {
                idformato = Ext.aft.grupoNodeSeleccionado.attributes.idformato;
                var indexRecord = Ext.aft.grupo.stComboFormat.find('idformato', idformato);

                var recordFormat = Ext.aft.grupo.stComboFormat.getAt(indexRecord);
                var arrayPartes = (idformato) ? recordFormat.data.partes : [];
                for (var i = 0; i < arrayPartes.length; i++) {
                    if (arrayPartes[i].nivel == nivelnodo) {
                        longitud_formato_mostrar = arrayPartes[i].longitud;
                        break;
                    }
                }
            }

            var comboFormat = new Ext.form.ComboBox({
                id: 'idcomboformat',
                hiddenName: 'idformato',
                valueField: 'idformato',
                allowBlank: false,
                forceSelection: true,
                displayField: 'nombre',
                store: Ext.aft.grupo.stComboFormat,
                autoCreate: false,
                typeAhead: true,
                fieldLabel: _this.etiq.lbMsgLabelCombo,
                triggerAction: 'all',
                mode: 'local',
                hidden: (Ext.aft.grupoNodeSeleccionado.id == 0 || (nodohijo == 1 && Ext.aft.grupoNodeSeleccionado.getDepth() == 1 && !adicionar)) ? false : true,
                width: 300,
                emptyText: etiq.lbMsgCombo,
                hideLabel: (Ext.aft.grupoNodeSeleccionado.id == 0 || (nodohijo == 1 && Ext.aft.grupoNodeSeleccionado.getDepth() == 1 && !adicionar)) ? false : true,
                listeners: {
                    'select': function(combo, record, index) {
                        Ext.getCmp('newnombre').enable();
                        Ext.getCmp('newcod').enable();
                        idformato = combo.getValue();
                        var arrayPartes = record.data.partes;
                        for (var i = 0; i < arrayPartes.length; i++) {
                            if (arrayPartes[i].nivel == nivelnodo) {
                                longitud_formato_mostrar = arrayPartes[i].longitud;
                                break;
                            }
                        }
                        if (Ext.getDom('longcodigo_adicGrupo')) {
                            Ext.getDom('longcodigo_adicGrupo').innerHTML = etiq.lbNivel + longitud_formato_mostrar;
                            Ext.getCmp('newcod').validate();
                        }
                    }
                }
            });

            var textarea = new Ext.form.TextArea({
                fieldLabel: etiq.lbDenominacion,
                anchor: '100%',
                heidth: 100,
                allowBlank: false,
                disabled: (Ext.aft.grupoNodeSeleccionado.id == 0),
                id: 'newnombre',
                name: 'denominacion',
                tabIndex: 1,
                maxLength: 255,
                maxLengthText: etiq.lbMsgMaxLongDenominacion,
                regexText: etiq.lbValorIncorrectoTextArea,
                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñü/(Ñ0-9]+)([/./,]?[-_\s/(]?[a-zA-ZÁÉÍÓÚáéíóúñü/)Ñ0-9])*$/,
//                regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9/(///\]+)([/./,]?[-_\s]?[/(]*[a-zA-ZÁÉÍÓÚáéíóúñüÑ0-9/)])*$/,
                enableKeyEvents: true/*,
                 listeners: {
                 'keyup': function(textfield, eventObj) {
                 flag = false;
                 },
                 'keypress': function(t, e) {
                 validarCantidadCaracteres(t, 255, e);
                 }
                 }*/
            });

            var textfield = new Ext.form.TextField({
                fieldLabel: etiq.lbCodigo,
                anchor: '100%',
                xtype: 'textfield',
                id: 'newcod',
                name: 'codigo',
                maskRe: /^[0-9]+$/,
                regex: /^[0-9]+$/,
                disabled: (Ext.aft.grupoNodeSeleccionado.id == 0),
                enableKeyEvents: true,
                allowBlank: false,
                //vtype:'longitudCodigo',
                longitudCodigo: (!adicionar) ? longitud_formato_mostrar : null,
                tabIndex: 2,
                validator: function() {
                    if (textfield.getValue().length == longitud_formato_mostrar) {
                        return true;
                    } else {
                        return "El tama\xf1o requerido es " + longitud_formato_mostrar + " caracteres.";
                    }
                },
                //maxLength: (!adicionar)?longitud_formato_mostrar:null,
                //maxLengthText: "El tama\xf1o m\xe1ximo requerido es "+ longitud_formato_mostrar+" caracteres.",
                regexText: etiq.lbValorNumIncorrecto,/*
                 listeners: {
                 scope: this,
                 'keyup': function(textfield, eventObj) {
                 flag = false;
                 },
                 'keypress': function(t, e) {
                 validarCantidadCaracteres(t, 60, e);
                 }
                 }*/
            });

            _this.startDate = new Ext.form.DateField({
                fieldLabel: 'Fecha inicio',
                xtype: 'datefield',
                vtype: 'daterange',
                name: 'fechainicio',
                id: "idFechaInicioG",
                minValue: (adicionar) ? fecha.format('d/m/Y') : null,
                endDateField: "idFechaFinG",
                value: fecha.format('d/m/Y'),
                anchor: '95%',
                format: 'd/m/Y',
                enableKeyEvents: true,
                mode: 'local',
                readOnly: true
            });
            _this.endDate = new Ext.form.DateField({
                fieldLabel: 'Fecha fin',
                xtype: 'datefield',
                vtype: 'daterange',
                name: 'fechafin',
                id: "idFechaFinG",
                startDateField: "idFechaInicioG",
                anchor: '95%',
                format: 'd/m/Y',
                enableKeyEvents: true,
                mode: 'local',
                allowBlank: true,
                readOnly: true
            });

            var field = [new Ext.Panel({
                    html: '<div style="font: 12px tahoma, arial, helvetica, sans-serif;" id="longcodigo_adicGrupo"></div></br>'
                }), {
                    layout: 'form',
                    items: [textarea, textfield]
                }, new Ext.form.FieldSet({
                    //autoWidth: true,
                    style: '-moz-border-radius:5px',
                    autoHeight: true,
                    layout: 'column',
                    anchor: '100%',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [
                                _this.startDate
                            ]
                        },
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [
                                _this.endDate
                            ]
                        }
                    ]
                })];
            if (Ext.aft.grupoNodeSeleccionado.id == 0 || (nodohijo == 1 && Ext.aft.grupoNodeSeleccionado.getDepth() == 1 && !adicionar)) {
                field.unshift(comboFormat);
            }
            _this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                frame: true,
                border: false,
                id: 'form',
                bodyStyle: 'padding:10px 10px 0',
                items: field,
                listeners: {
                    'clientvalidation': function(fp, valid) {
                        var checkdirty = false;
                        fp.getForm().items.each(function(field) {
                            if (field.isDirty() && valid) {
                                checkdirty = true;
                                _this.habilitarbotonesWinGest();
                            }
                        });
                        if (!checkdirty) {
                            _this.desabilitarbotonesWinGest();
                        }
                    }
                }
            });

            _this.btnAceptar = new Ext.Button({
                iconCls: 'aceptar',
                text: etiq.lbBtnAceptar,
                tooltip: etiq.lbTtBtnAceptar + ' <b>(Enter)</b>',
                handler: function() {
                    if (_this.formulario.getForm().isValid()) {
                        _this.guardarGrupo(etiq, _this, _this.ventana, _this.formulario, true, adicionar, longitud_formato_mostrar, idformato);
                       
                    }
                    else {
                        mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
                    }
                }
            });
            _this.btnAplicar = new Ext.Button({
                iconCls: 'aplicar',
                text: etiq.lbBtnAplicar,
                tooltip: etiq.lbTtBtnAplicar + ' <b>(Ctrl+Alt+P)</b>',
                hidden: !adicionar,
                handler: function() {
                    if (_this.formulario.getForm().isValid()) {
                        _this.guardarGrupo(etiq, _this, _this.ventana, _this.formulario, false, adicionar, longitud_formato_mostrar, idformato);  
                       /*  textarea.disable();
                        textfield.disable();*/
                    }
                    else {
                        mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
                    }
                }
            });
            _this.btnCancelar = new Ext.Button({
                iconCls: 'cancelar',
                text: etiq.lbBtnCancelar,
                tooltip: etiq.lbTtBtnCancelar + ' <b>(Alt+X)</b>',
                handler: function() {
                    _this.ventana.close();
                    //_self.loader.load(_self.root);
                }
            });

            if (idnodo != 0) {
                comboFormat.enable();
            }

            /*Ext.getCmp('newcod').on({
             'keypress': function(t, e) {
             validarCantidadCaracteres(t, longitud_formato_mostrar, e);
             }
             });*/

            _this.ventana = new Ext.Window({
                modal: true,
                layout: 'fit',
                constrain: true,
                autoValidate: (!adicionar) ? false : true,
                items: [_this.formulario],
                listeners: {
                    'show': function() {
                        if (comboFormat.isVisible()) {
                            comboFormat.focus(true, 500);
                        } else {
                            Ext.getCmp('newnombre').focus(true, 50);
                        }
                        var valorCodigo = (longitud_formato_mostrar) ? longitud_formato_mostrar : '#';
                        if (Ext.getDom('longcodigo_adicGrupo')) {
                            Ext.getDom('longcodigo_adicGrupo').innerHTML = etiq.lbNivel + valorCodigo;
                        }

                        if (!adicionar) {
                            var record = {
                                data: _this.getData()
                            };
                            var longcodhijo = devolverLogitudFormato(record.data.idformato, record.data.nivel - 1);
                            var codigocomp = record.data.codigo;
                            record.data.codigo = codigocomp.substring(codigocomp.length - longcodhijo);
                            _this.formulario.getForm().loadRecord(record);

                            _this.formulario.getForm().items.each(function(field) {
                                field.originalValue = field.getValue();
                            });
                        }
                    },
                    render: function() {
                        _this.ventana.getKeyMap().addBinding({
                            key: Ext.EventObject.ENTER,
                            shift: false,
                            alt: false,
                            ctrl: false,
                            fn: function() {
                                _this.btnAceptar.handler.call(_this, _this.btnAceptar);
                            }
                        });
                        _this.ventana.getKeyMap().addBinding({
                            key: 'P',
                            shift: false,
                            alt: true,
                            ctrl: true,
                            fn: function() {
                                _this.btnAplicar.handler.call(_this, _this.btnAplicar);
                            }
                        });
                        _this.ventana.getKeyMap().addBinding({
                            key: 'X',
                            shift: false,
                            alt: true,
                            ctrl: false,
                            fn: function() {
                                _this.btnCancelar.handler.call(_this, _this.btnCancelar);
                            }
                        });
                    }
                },
                title: (adicionar) ? (etiq.lbTitleAdicionarGrupo) : (etiq.lbTitleModificarGrupo),
                width: 450,
                height: (Ext.aft.grupoNodeSeleccionado.id == 0 || (nodohijo == 1 && Ext.aft.grupoNodeSeleccionado.getDepth() == 1 && !adicionar)) ? 410 : 350,
                resizable: false,
                buttons: [_this.btnCancelar,
                    _this.btnAplicar,
                    _this.btnAceptar
                ]
            });
            LOG.util.UIManager.reconfigureButtons(_this.ventana.buttons);
            _this.ventana.show();
        }
    },
    habilitarbotonesWinGest: function() {
        this.btnAplicar.enable();
        this.btnAceptar.enable();
    },
    desabilitarbotonesWinGest: function() {
        var _this = this;
        _this.btnAplicar.disable();
        _this.btnAceptar.disable();
    },
    /*
     *  Guardar los cambios en un grupo, ya sea a la hora de insertar o modificar
     *  @param etiq Arreglo de etiquetas de la interfaz
     *  @param arbol Instancia del árbol
     *  @param ventana Instancia de la ventana creada para insertar o modificar el grupo
     *  @param formulario Formulario dentro de la ventana de gestión de grupos
     *  @param cerrar Si se debe cerrar la ventana tras la modificacion
     *  @param adicionar Si estoy adicionando o modificando un grupo
     *  @param longitud_formato_mostrar Longitud que debe tener el código
     *       
     */
    //estas funciones las voy a usar ahora me quede aqui
    getData: function() {
        var _this = this;
        var node = _this.getSelectedNode();
        return node.attributes;
        /*
         * 
         * _self.formulario.getForm().loadRecord({
         data: _self.getData()
         });
         */

    },
    getSelectedNode: function() {
        return this.getSelectionModel().getSelectedNode() || this.getRootNode();
    },
    guardarGrupo: function(etiq, arbol, ventana, formulario, cerrar, adicionar, longitud_formato_mostrar, idformato) {
        var _this = this;
        if (Ext.getCmp('newnombre').getValue().length == 0) {
            mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
            Ext.getCmp('newnombre').focus(true, 50);

        } else if (Ext.getCmp('newcod').getValue().length == 0) {
            mostrarMensaje(1, etiq.lbMsgCamposIncorrectos);
            Ext.getCmp('newcod').focus(true, 50);

        } else {
            var nivel = (Ext.aft.grupoNodeSeleccionado.id == 0) ? 1 : parseInt(Ext.aft.grupoNodeSeleccionado.attributes.nivel) + 1;
            if (longitud_formato_mostrar == Ext.getCmp('newcod').getValue().length) {

                var newcodigo = Ext.getCmp('newcod').getValue();
                var codigo_anterior = '';
                var codigopadre = Ext.aft.grupoNodeSeleccionado.attributes.codigo;
                var version = 0;
                var nodoPadre = Ext.aft.grupoNodeSeleccionado.parentNode;

                /*
                 *  En el caso que sea una modificación
                 */

                if (!adicionar) {
                    var codCompleto = Ext.aft.grupoNodeSeleccionado.attributes.codigo;
                    var subCodigo = '';

                    //var long = devolverLogitudFormato(idformato, Ext.aft.grupoNodeSeleccionado.attributes.nivel - 2);

                    subCodigo = codCompleto.substring(0, codCompleto.length - longitud_formato_mostrar);

                    codigo_anterior = codCompleto;
                    newcodigo = (Ext.aft.grupoNodeSeleccionado.attributes.nivel <= 1) ? Ext.getCmp('newcod').getValue() : subCodigo + (Ext.getCmp('newcod').getValue());
                    codigopadre = nodoPadre.attributes.codigo;
                    version = nodoPadre.attributes.version;
                }

                /*var old_denominacion = Ext.aft.grupoNodeSeleccionado.attributes.denominacion;
                 var new_denominacion = Ext.getCmp('newnombre').getValue();
                 var old_idformato = (Ext.aft.grupoNodeSeleccionado.attributes.idformato) ? Ext.aft.grupoNodeSeleccionado.attributes.idformato : false;*/

                //if ((codigo_anterior != newcodigo) || (old_denominacion != new_denominacion) || (old_idformato && (old_idformato != idformato))) {

                Ext.Ajax.request({
                    url: (adicionar) ? 'insertargrupo' : 'modificargrupo',
                    method: 'POST',
                    params: {
                        denominacion: Ext.getCmp('newnombre').getValue(),
                        codigo: newcodigo,
                        nivel: Ext.aft.grupoNodeSeleccionado.getDepth() + 1,
                        codigopadre: codigopadre,
                        longitudformato: longitud_formato_mostrar,
                        codigo_anterior: codigo_anterior,
                        version: version,
                        idformato: idformato,
                        idgrupo: Ext.aft.grupoNodeSeleccionado.attributes.id,
                        fechainicio: _this.startDate.getRawValue(),
                        fechafin: _this.endDate.getRawValue()
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);

                        if (rd.cod == 1) {
                            mostrarMensaje(1, (adicionar) ? (etiq.lbMsgAddGrupo) : (etiq.lbMsgModGrupo));
                            acepta();
                        } else
                            mostrarMensaje(1, (adicionar) ? (etiq.lbMsgDUPGrupo) : (etiq.lbMsgModGrupoUSO));

                        function acepta(btnPresionado) {
                            formulario.getForm().reset();

                            if (!cerrar) {
                                Ext.getCmp('newnombre').focus(false, 50);
                                //Ext.getDom('longcodigo_adicGrupo').innerHTML = etiq.lbNivel + '#';
                            }
                            arbol.loader.load((adicionar) ? (Ext.aft.grupoNodeSeleccionado) : (nodoPadre), function() {

                                if (adicionar) {
                                    Ext.aft.grupoNodeSeleccionado.expand();
                                } else {
                                    nodoPadre.expand();
                                }
                            });

                            if (cerrar) {
                                ventana.close();
                            }
                        }
                    }
                });
                /*} else {
                 mostrarMensaje(1, 'No se ha realizado ningún cambio.');
                 ventana.close();
                 }*/
            } else
                mostrarMensaje(1, etiq.lbNivel + longitud_formato_mostrar + '.');
        }
    },
    /*
     *  Eliminar un grupo del árbol
     *  @param etiq Arreglo de etiquetas de la interfaz
     *  @param arbol Instancia del árbol
     */
    eliminarGrupo: function(etiq, arbol) {
        var _self = this;
        var nodoPadre = Ext.aft.grupoNodeSeleccionado.parentNode;

        function elimina(btnPresionado) {
            if (btnPresionado == 'ok') {
                Ext.Ajax.request({
                    url: 'eliminargrupo',
                    method: 'POST',
                    params: {
                        idgrupo: Ext.aft.grupoNodeSeleccionado.attributes.id
                    },
                    callback: function(options, success, response) {

                        function acepta(btnPresionado) {
                            arbol.loader.load(nodoPadre, function() {
                                _self.treeClick(nodoPadre);
                            });
                        }

                        var rd = Ext.decode(response.responseText);
                        if (rd.cod == 1) {
                            mostrarMensaje(1, etiq.lbMsgEliminarGrupo);
                            acepta();

                        } else if (rd.cod == 2) {
                            mostrarMensaje(3, etiq.lbMsgEliminarGrupoNo);
                            acepta();
                        }
                    }
                });
            }
        }

        mostrarMensaje(2, etiq.lbMsgConfEliminarGrupo, elimina);
    }
});

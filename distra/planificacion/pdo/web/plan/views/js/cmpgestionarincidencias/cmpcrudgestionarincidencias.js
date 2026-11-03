Utilidades.Cmp.Cmpcrudgestionarincidencias = function () {
    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    var change = false;
    Ext.Ajax.timeout = 1000000000;
    this.BarraProgreso = new BarraEstado();
    this.url = '/planificacion/pdo/plan/index.php/cmpgestionarincidencias/';
    this.mod = ({
        denominacion: false,
        impacto: false,
        tipoInc: false,
        asociarDesv: false,
        descripcion: false
    });
    this.valoresiniform = ({
        denominacion: '',
        impacto: '',
        tipoInc: '',
        asociarDesv: '',
        descripcion: ''
    });

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    this.CrearWinFormIncidencias = function (PostAccionesGestionar, accion, arreglo, idincidencias) {
        if (_this.winFormIncidencias)
            _this.winFormIncidencias.destroy();

        this.tfdenominacion = new Ext.form.TextField({
            id: 'tfdenominaciondesv',
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
            fieldLabel: 'Denominaci&oacute;n',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            prevTab: 'btnAceptarInc',
            allowBlank: false,
            anchor: '100%',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                'render': function (c) {
                    if (_this.estamodificando == 1) {
                        c.getEl().on('keyup', function () {
                            (_this.valoresiniform.denominacion !== c.getValue().toString()) ? _this.mod.denominacion = true : _this.mod.denominacion = false;
                        }, c);
                    }
                },
            }
        });

        this.stcbimpacto = new Ext.data.SimpleStore({
            fields: ['idestado', 'denominacion'],
            data: [
                [1, 'Bajo'],
                [2, 'Medio'],
                [3, 'Alto']
            ],
            listeners: {
                load: function (st) {
                    /* st.getAt(0).set(true);
                     // console.log(st.data.items[1]);
                     _this.cbimpacto.setValue(st.datast.data.items[1]);
                     */
                }

            }
        });

        this.cbimpacto = new Ext.form.ComboBox({
            fieldLabel: 'Impacto',
            value: 'Bajo',
            forceSelection: true,
            store: _this.stcbimpacto,
            displayField: 'denominacion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            hiddenName: 'idestado',
            valueField: 'idestado',
            width: 50,
            anchor: '95%',
            emptyText: 'Seleccione...',
            readOnly: true,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.impacto != record.data.idestado) {
                            _this.mod.impacto = true;
                        } else {
                            _this.mod.impacto = false;
                        }
                    }
                }
            }
        });

        this.stcbtipoIncidencias = new Ext.data.Store({
            url: _this.url + 'cargartiposincidencias',
            //autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idnomenclador',
                root: "data"
            }, [{
                name: 'dennomenclador'
            }, {
                name: 'idnomenclador'
            }, {
                name: 'incidencia'
            }]),
            listeners: {
                beforeload: function (st, opt) {
                },
                load: function (store, records, options) {

                }
            }
        });

        this.cbtipoIncidencias = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de incidencia',
            store: _this.stcbtipoIncidencias,
            displayField: 'dennomenclador',
            typeAhead: true,
            //allowBlank: false,
            mode: 'remote',
            triggerAction: 'all',
            loadingText: 'Cargando Incidencias...',
            valueField: 'idnomenclador',
            anchor: '100%',
            emptyText: 'Seleccione...',
            forceSelection: true,
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.tipoInc != record.data.idnomenclador) {
                            _this.mod.tipoInc = true;
                        } else {
                            _this.mod.tipoInc = false;
                        }
                    }
                }
            }
        });

        this.stcbasociardesv = new Ext.data.Store({
            url: '/planificacion/pdo/plan/index.php/cmpgestionardesviaciones/cargardesviaciones',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                id: 'idtipo',
                root: "campos"
            }, [{
                name: 'denominacion'
            }, {
                name: 'idelemento'
            }, {
                name: 'desviacion'
            }]),
            listeners: {
                load: function (store, records, options) {
                    if (accion == 'Modificar') {
                        Ext.Ajax.request({
                            url: _this.url + 'verificarincidencia',
                            params: {
                                idelemento: idincidencias
                            },
                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                store.each(function (record) {
                                    for (var i = 0; i < responseData.data[0].desviacion.length; i++) {
                                        if (record.data.idelemento == responseData.data[0].desviacion[i]) {
                                            record.set('checked', true);
                                        }
                                    }
                                }, this);
                                _this.cbasociardesv.doQuery(_this.cbasociardesv.allQuery);
                                _this.cbasociardesv.setValue(_this.cbasociardesv.getCheckedValue());
                                _this.valoresiniform.asociarDesv = _this.cbasociardesv.getCheckedValue();
                            }
                        });
                    }
                }
            }
        });

        this.cbasociardesv = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            fieldLabel: 'Asociada a la desviaci&oacute;n',
            displayField: 'denominacion',
            id: 'cbasocdesv',
            valueField: 'idelemento',
            store: _this.stcbasociardesv,
            autoCreate: true,
            typeAhead: true,
            hiddenName: 'desviacion',
            triggerAction: 'all',
            editable: false,
            allowBlank: true,
            listWidth: 350,
            anchor: '100%',
            mode: 'local',
            listeners: {
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                select: function (combo, record, index) {
                    if (_this.estamodificando == 1) {
                        if (_this.valoresiniform.asociarDesv != combo.getCheckedValue()) {
                            _this.mod.asociarDesv = true;
                        } else {
                            _this.mod.asociarDesv = false;
                        }
                    }
                }
            }
        });
        this.taDescripcion = new Ext.form.HtmlEditor({
            id: 'hedescripciondesv',
            anchor: '100%',
            height: 120,
            maxLength: 255,
            maxLengthText: 'El tamaño máximo requerido es de 255 caracteres.',
            fieldLabel: 'Descripci&oacute;n',
            buttonTips: {
                bold: {
                    title: 'Negrita (Ctrl+B)',
                    text: 'Aplica el formato de negrita al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                italic: {
                    title: 'Cursiva (Ctrl+I)',
                    text: 'Aplica el formato de cursiva al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                underline: {
                    title: 'Subrayado (Ctrl+U)',
                    text: 'Subraya el texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                increasefontsize: {
                    title: 'Agrandar fuente',
                    text: 'Aumenta el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                backcolor: {
                    title: 'Color de resaltado del texto',
                    text: 'Cambia el aspecto del texto como si estuviera marcado con un marcador.',
                    cls: 'x-html-editor-tip'
                },
                forecolor: {
                    title: 'Color de fuente',
                    text: 'Cambia el color del texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyleft: {
                    title: 'Alinear texto a la izquierda',
                    text: 'Alinea el texto a la izquierda.',
                    cls: 'x-html-editor-tip'
                },
                justifycenter: {
                    title: 'Centrar',
                    text: 'Centrar el texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyright: {
                    title: 'Alinear texto a la derecha',
                    text: 'Alinea el texto a la derecha.',
                    cls: 'x-html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Viñetas',
                    text: 'Inicia una lista con viñetas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Numeración',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'Hipervínculo',
                    text: 'Hace del texto seleccionado un hipervínculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                    change = true;
                },
                change: function (field, newValue, oldValue) {
                    change = true;
                },
                sync: function (editor, html) {

                    var parts = html.split(' ');
                    var lastWord = parts[parts.length - 1];
                    var plastWord = parts[parts.length - 2];


                    if (_this.estamodificando == 1) {
                        /* if (_this.valoresiniform.descripcion == '' || _this.valoresiniform.descripcion == '&nbsp;' || _this.valoresiniform.descripcion == '&nbsp;<br>' || _this.valoresiniform.descripcion == '<br>') {
                         if (html == '' || html == '&nbsp;' || html == '&nbsp;<br>' || html == '<br>' || lastWord == '<br>')
                         _this.mod.descripcion = false;
                         else
                         _this.mod.descripcion = true;
                         } else if (_this.valoresiniform.descripcion != html)
                         _this.mod.descripcion = true;
                         else
                         _this.mod.descripcion = false;*/

                        if (lastWord == '<br>' || lastWord.search('&nbsp;') >= 0) {

                            if (_this.valoresiniform.descripcion == '') {
                                if (plastWord == undefined)
                                    _this.mod.descripcion = false;
                                else if (plastWord.search('&nbsp;') >= 0) {
                                    var plastwsplit = plastWord.split('&nbsp;');

                                    if (plastwsplit[0] == '')
                                        _this.mod.descripcion = false;
                                    else
                                        _this.mod.descripcion = true;

                                }
                                else
                                    _this.mod.descripcion = true;
                            }
                            else
                                _this.mod.descripcion = false;


                        }
                        else
                            _this.mod.descripcion = true;

                        if (lastWord == '' && plastWord == undefined)
                            _this.mod.descripcion = false;
                    }

                }
            }
        });

        this.pDescripcion = new Ext.Panel({
            title: 'Descripci&oacute;n',
            id: 'pDescripcion',
            height: 110,
            layout: 'fit',
            items: [_this.taDescripcion]
        });
        if (accion == 'Modificar') {
            this.pclasificadorinvolll = new Ext.tree.TreePanel({
                id: 'tpPublicidadInci',
                autoScroll: true,
                split: false,
                useArrows: true,
                collapsible: false,
                root: {
                    text: 'Clasificador de involucrados',
                    expanded: true,
                    id: 'root',
                    children: [
                        {
                            nodeType: 'async',
                            id: 'nodo2',
                            idgrupo: 'nodo2',
                            text: 'Mis grupos',
                            leaf: false,
                            checked: false
                        },
                        {
                            nodeType: 'async',
                            id: 'nodo3',
                            idgrupo: 'nodo3',
                            text: 'Usuarios subordinados',
                            leaf: false,
                            checked: false
                        },
                        {
                            nodeType: 'async',
                            id: 'nodo5',
                            idgrupo: 'nodo5',
                            text: 'Estructuras',
                            leaf: false,
                            checked: false
                        }
                    ]
                },
                listeners: {
                    'checkchange': function (nodo, check) {
                        if (_this.tpPublicidadIncidencias.getChecked().length > 0) {
                            if (nodo.id == 'nodo3') {
                                _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo3').expand(false, true, function (n) {
                                    nodo.eachChild(function (n) {
                                        n.getUI().toggleCheck(check);
                                    });
                                });
                            }
                            if (nodo.id == 'nodo2') {
                                _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo2').expand(false, true, function (n) {
                                    nodo.eachChild(function (n) {
                                        n.getUI().toggleCheck(check);
                                    });
                                });
                            }
                            if (nodo.id == 'nodo5') {
                                _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo5').expand(false, true, function (n) {
                                    nodo.eachChild(function (n) {
                                        n.getUI().toggleCheck(check);
                                    });
                                });
                            }
                        }
                    }
                },
                loader: new Ext.tree.TreeLoader({
                    dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarRangoPublicidad',
                    listeners: {
                        'beforeload': function (atreeloader, anode) {
                            atreeloader.baseParams = {
                                estamodificando: 0,
                                idgrupo: anode.attributes.idgrupo/*,							
                                 idnom: selected.idnom*/
                            };
                        },
                        'load': function (atreeloader, anode) {
                            /*array_publicidad_ini = _this.tpPublicidadIncidencias.getChecked();*/
                        }
                    }
                })
            });

            //fin probando            

            _this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolIncidenciaDesviacion(arreglo['idincidencia'], 'incidencia', 1, arreglo['idusuariocrea']);
            this.pclasificadorinvol.setTitle('Rango de publicidad');
        } else {
            this.pclasificadorinvol = _this.objclasificadorinvol.CrearClasificadorInvolIncidenciaDesviacion(0, 'calendario', 0, null, 1);
            this.pclasificadorinvol.setTitle('Rango de publicidad');
        }
        var ocultarBotonAplicar = false;
        _this.estamodificando = 0;
        if (accion == 'Modificar') {
            ocultarBotonAplicar = true;
            _this.estamodificando = 1;
        }
        this.tpInvolDescrip = new Ext.TabPanel({
            activeTab: 0,
            border: false,
            height: 250,
            items: [_this.pclasificadorinvol, _this.pDescripcion],
            listeners: {
                tabchange: function (tp, p) {
                    if (p.id == 'pDescripcion') {
                        _this.taDescripcion.focus();
                    }
                    else
                        _this.tfdenominacion.focus();
                }
            }
        });

        this.formIncidencias = new Ext.form.FormPanel({
            width: 655,
            height: 500,
            frame: true,
            bodyStyle: 'padding: 5px 5px 0',
            labelAlign: 'top',
            listeners: {
                'clientvalidation': function (fm, valid) {
                    (valid) ? Ext.getCmp('btnAceptarInc').setDisabled(false) : Ext.getCmp('btnAceptarInc').setDisabled(true);

                    if (_this.estamodificando == 1) {
                        _this.objclasificadorinvol.comprobarCambiosInv();
                        if (valid && (_this.mod.denominacion || _this.mod.impacto || _this.mod.tipoInc ||
                            _this.mod.asociarDesv || _this.mod.descripcion ||
                            _this.objclasificadorinvol.modificarInv))
                            Ext.getCmp('btnAceptarInc').setDisabled(false);
                        else
                            Ext.getCmp('btnAceptarInc').setDisabled(true);
                    }
                }
            },
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [_this.tfdenominacion]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [_this.cbimpacto]
                        }, {
                            columnWidth: 0.5,
                            layout: 'form',
                            items: [_this.cbtipoIncidencias]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [_this.cbasociardesv]
                        }
                    ]
                },
                _this.tpInvolDescrip
            ]
        });
        _this.LLenarModificar(accion, arreglo);

        this.winFormIncidencias = new Ext.Window({
            modal: true,
            layout: 'fit',
            closeAction: 'destroy',
            title: accion + ' incidencia',
            width: 755,
            height: 490,
            constrain: true,
            autoValidate: true,
            validateDefault: true,
            listeners: {
                beforeshow: function (win) {
                },
                destroy: function () {
                    _this.mod = ({
                        denominacion: false,
                        impacto: false,
                        tipoInc: false,
                        asociarDesv: false,
                        descripcion: false
                    });
                }
            },
            items: [_this.formIncidencias],
            buttons: [
                {
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        _this.winFormIncidencias.destroy();
                    }
                }, {
                    iconCls: 'aplicar',
                    text: 'Aplicar',
                    tooltip: 'Guardar datos y limpiar los campos',
                    hidden: ocultarBotonAplicar,
                    id: 'btnaplicar',
                    handler: function () {
                        _this.GestionarIncidencias(PostAccionesGestionar, accion, idincidencias, true);
                    }
                }, {
                    iconCls: 'aceptar ',
                    id: 'btnAceptarInc',
                    text: 'Aceptar ',
                    nextTab: 'tfdenominaciondesv',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.GestionarIncidencias(PostAccionesGestionar, accion, idincidencias, false);
                        //_this.winFormIncidencias.destroy();                    
                    }
                }]
        });
        _this.winFormIncidencias.show();
        this.tfdenominacion.focus(false, 1024);
    };

    this.CrearVentanaPublicarIncidencias = function (esPublicarTodos, stIncidencias, smIncidencias, PostAccionesGestionar) {

        this.tpPublicidadIncidencias = new Ext.tree.TreePanel({
            id: 'tpPublicidadInci',
            autoScroll: true,
            split: false,
            useArrows: true,
            collapsible: false,
            root: {
                text: 'Clasificador de involucrados',
                expanded: true,
                id: 'root',
                children: [
                    {
                        nodeType: 'async',
                        id: 'nodo2',
                        idgrupo: 'nodo2',
                        text: 'Mis grupos',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo3',
                        idgrupo: 'nodo3',
                        text: 'Usuarios subordinados',
                        leaf: false,
                        checked: false
                    }, {
                        nodeType: 'async',
                        id: 'nodo5',
                        idgrupo: 'nodo5',
                        text: 'Estructuras',
                        leaf: false,
                        checked: false
                    }
                ]
            },
            listeners: {
                'checkchange': function (nodo, check) {
                    if (_this.tpPublicidadIncidencias.getChecked().length > 0) {
                        if (nodo.id == 'nodo3') {
                            _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo3').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo2') {
                            _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo2').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                        if (nodo.id == 'nodo5') {
                            _this.tpPublicidadIncidencias.getRootNode().findChild('id', 'nodo5').expand(false, true, function (n) {
                                nodo.eachChild(function (n) {
                                    n.getUI().toggleCheck(check);
                                });
                            });
                        }
                    }
                }
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/configuracion/index.php/gestionarnomencladores/cargarRangoPublicidad',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            estamodificando: 0,
                            idgrupo: anode.attributes.idgrupo/*,							
                             idnom: selected.idnom*/
                        };
                    },
                    'load': function (atreeloader, anode) {
                        /*array_publicidad_ini = _this.tpPublicidadIncidencias.getChecked();*/
                    }
                }
            })
        });

        this.panelPublicidad = new Ext.Panel({
            title: 'Usuarios',
            id: 'panelPublicidadIncidencias',
            layout: 'fit',
            autoScroll: true,
            height: 300,
            region: 'center',
            items: _this.tpPublicidadIncidencias,
            listeners: {
                activate: function (p) {
                }
            }
        });

        this.tbPanelPublicar = new Ext.TabPanel({
            title: 'Rango de publicidad',
            activeTab: 0,
            border: false,
            items: [_this.panelPublicidad]
        });

        this.wPublicarIncidencias = new Ext.Window({
            title: 'Publicar Incidencias',
            width: 345,
            constrain: true,
            modal: true,
            layout: 'fit',
            items: _this.tbPanelPublicar,
            buttons: [
                new Ext.Button({
                    iconCls: 'cancelar',
                    text: 'Cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos',
                    handler: function () {
                        _this.wPublicarIncidencias.destroy();
                    }

                }),
                new Ext.Button({
                    iconCls: 'aceptar',
                    text: 'Aceptar',
                    tooltip: 'Guardar datos y cerrar ventana',
                    handler: function () {
                        _this.PublicarTodos(esPublicarTodos, stIncidencias, smIncidencias, PostAccionesGestionar)
                    }
                })
            ]
        });
        _this.wPublicarIncidencias.show();
    };

    this.PublicarTodos = function (esPublicarTodos, stIncidencias, smIncidencias, PostAccionesGestionar) {

        var array_idincidencias = [];

        if (esPublicarTodos) {
            /*if (stIncidencias.getCount() != 0) {
             for (var i = 0; i < stIncidencias.getCount(); i++) {
             array_idincidencias.push(stIncidencias.getAt(i).data.idincidencia);
             }
             }*/
            var arrayIncidenciasSeleccionados = smIncidencias.getSelections();
            if (arrayIncidenciasSeleccionados.length > 0) {
                for (var i = 0; i < arrayIncidenciasSeleccionados.length; i++) {
                    array_idincidencias.push(arrayIncidenciasSeleccionados[i].data.idincidencia);
                }
            }
        } else {
            array_idincidencias.push(smIncidencias.getSelections()[0].data.idincidencia);
        }

        var arrayPublicidadUsuarios = getgestionarCheck(_this.tpPublicidadIncidencias, ['idusuario', 'idgrupo', 'tipo']);
        var arrayPubli = arrayPublicidadUsuarios.insertar;

        for (var i = 0; i < arrayPubli.length; i++) {
            if (arrayPubli[i].id == 'nodo2' || arrayPubli[i].id == 'nodo3' || arrayPubli[i].id == 'nodo5') {
                for (var j = i; j < arrayPubli.length; j++) {
                    arrayPubli[i] = arrayPubli[i + 1];
                }
                arrayPubli.length--;
            }
        }
        if (arrayPubli.length != 0) {
            var mensajeMascara = 'Publicando incidencias';
            _this.BarraProgreso.show(mensajeMascara);

            Ext.Ajax.request({
                url: _this.url + 'publicartodasincidencias',
                params: {
                    arrayidincidencias: Ext.encode(array_idincidencias),
                    arrayidusuarios: Ext.encode(arrayPubli)
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    var mensaje = '';
                    _this.BarraProgreso.hide();
                    if (responseData.mensaje == 1) {
                        if (array_idincidencias.length == 1) {
                            mensaje = 'La incidencia ha sido publicada satisfactoriamente.';
                        } else {
                            mensaje = 'Las incidencias han sido publicadas satisfactoriamente.';
                        }
                        mostrarMensaje(2, mensaje);
                        PostAccionesGestionar('Publicar', 3);
                        _this.wPublicarIncidencias.destroy();
                    }
                }
            });
        } else {
            mostrarMensaje(2, 'Debe seleccionar al menos un grupo de usuario y/o estructura de los listados');
        }
    };

    this.DespublicarTodos = function (stIncidencias, PostAccionesGestionar, smIncidencias, todos) {
        //mostrarMensaje(2, '¿Est&aacute; seguro que quiere eliminar la(s) incidencia(s) seleccionada(s)?', function(btnoprimido) {
        //  if (btnoprimido == 'ok') {	
        var array_idincidencias = [];
        var mensajeactivar, mensajeMascara;
        if (!todos) {
            array_idincidencias.push(smIncidencias.getSelections()[0].data.idincidencia);
        } else {
            /* if (stIncidencias.getCount() != 0) {
             for (var i = 0; i < stIncidencias.getCount(); i++) {
             array_idincidencias.push(stIncidencias.getAt(i).data.idincidencia);
             }
             }*/
            var arrayIncidenciasSeleccionados = smIncidencias.getSelections();
            if (arrayIncidenciasSeleccionados.length > 0) {
                for (var i = 0; i < arrayIncidenciasSeleccionados.length; i++) {
                    array_idincidencias.push(arrayIncidenciasSeleccionados[i].data.idincidencia);
                }
            }
        }

        if (arrayIncidenciasSeleccionados.length == 1) {
            mensajeactivar = '¿Est&aacute; seguro que quiere eliminar la publicación seleccionada?';
            mensajeMascara = 'Eliminando publicaci&oacute;n';
        }
        else {
            mensajeactivar = '¿Est&aacute; seguro que quiere eliminar las publicaciones seleccionadas?';
            mensajeMascara = 'Eliminando publicaciones';
        }
        _this.BarraProgreso.show(mensajeMascara);


        mostrarMensaje(2, mensajeactivar, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                Ext.Ajax.request({
                    url: _this.url + 'despublicartodasincidencias',
                    params: {
                        arrayidincidencias: Ext.encode(array_idincidencias)
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        _this.BarraProgreso.hide();
                        if (responseData.mensaje == 1) {
                            if (arrayIncidenciasSeleccionados.length == 1)
                                mostrarMensaje(2, 'La publicación ha sido eliminada satisfactoriamente.');
                            else
                                mostrarMensaje(2, 'Las publicaciones han sido eliminadas satisfactoriamente.');

                            PostAccionesGestionar('Despublicar', 3);
                        }
                    }
                });
            }
        });
    };


    this.GestionarIncidencias = function (PostAccionesGestionar, accion, idincidencias, apl) {
        _this.BarraProgreso.show('Guardando datos de la incidencia...');
        if (_this.formIncidencias.getForm().isValid()) {
            if (accion == 'Modificar') {
                if (change  || _this.mod.impacto || _this.mod.tipoInc ||
                    _this.mod.asociarDesv || _this.mod.descripcion || _this.objclasificadorinvol.modificarInv) {
                    Ext.Ajax.request({
                        url: _this.url + 'modificarincidencias',
                        params: {
                            denominacion: _this.tfdenominacion.getValue(),
                            idelemento: idincidencias,
                            tipoIncidencias: _this.cbtipoIncidencias.getValue(),
                            impacto: _this.cbimpacto.getValue(),
                            descripcion: _this.taDescripcion.getValue(),
                            desviacion: Ext.encode(_this.cbasociardesv.getValue()),
                            involucrados: Ext.encode(_this.objclasificadorinvol.ObtenerInvolucrados())
                        },
                        callback: function (options, success, response) {
                            _this.BarraProgreso.hide();
                            responseData = Ext.decode(response.responseText);
                            if (responseData.mensaje == 1) {
                                mostrarMensaje(1, 'La incidencia ha sido modificada satisfactoriamente.');
                                PostAccionesGestionar('Adicionar', 2);
                                _this.winFormIncidencias.destroy();
                                _this.objclasificadorinvol.ResetearCampos();
                            } else {
                                mostrarMensaje(1, 'Ya existe una incidencia con la denominación especificada.');
                            }
                        }
                    });
                    change = false;
                } else {
                    mostrarMensaje(1, 'Usted no ha realizado modificaciones.');
                }
            }
            else {
                Ext.Ajax.request({
                    url: _this.url + 'adicionarincidencias',
                    params: {
                        denominacion: _this.tfdenominacion.getValue(),
                        tipoIncidencias: _this.cbtipoIncidencias.getValue(),
                        impacto: _this.cbimpacto.getValue(),
                        descripcion: _this.taDescripcion.getValue(),
                        desviacion: Ext.encode(_this.cbasociardesv.getValue()),
                        involucrados: Ext.encode(_this.objclasificadorinvol.ObtenerInvolucrados())
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, 'La incidencia ha sido adicionada satisfactoriamente.');
                            PostAccionesGestionar('Adicionar', 2);
                            if (apl) {
                                _this.formIncidencias.getForm().reset();
                                _this.objclasificadorinvol.ResetearCampos();

                            } else {
                                _this.winFormIncidencias.destroy();
                            }
                        } else {
                            mostrarMensaje(1, 'Ya existe una incidencia con la denominación especificada.');
                        }

                    }
                });
            }
        } else {
            mostrarMensaje(1, 'Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).');
        }
    };

    this.LLenarModificar = function (accion, arreglo) {
        _this.stcbtipoIncidencias.reload({
            callback: function () {
                if (accion == 'Modificar') {
                    _this.cbtipoIncidencias.setValue(arreglo.idnomenclador);
                    //_this.cbtipoIncidencias.setValue(MostrarIncidencia(arreglo.idnomenclador));
                    _this.valoresiniform.tipoInc = arreglo.idnomenclador;
                }
            }
        });
        if (accion == 'Modificar') {
            _this.tfdenominacion.setValue(arreglo.denelemento);
            _this.cbimpacto.setValue(MostrarImpacto(arreglo.impacto));
            _this.taDescripcion.setValue(arreglo.descelemento);
            _this.valoresiniform.denominacion = arreglo.denelemento;
            _this.valoresiniform.impacto = arreglo.impacto;
            _this.valoresiniform.descripcion = arreglo.descelemento;
        }
    };

    function MostrarImpacto(val) {
        if (val == 1) {
            return ' Bajo';
        }
        if (val == 2) {
            return ' Medio';
        }
        if (val == 3) {
            return ' Alto';
        }
    };

    function MostrarIncidencia(id) {
        var denomInc = _this.stcbtipoIncidencias.getById(id).data.dennomenclador;
        return denomInc;
    };

    function MostrarImagenTipoElemento(valor, m, p) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return '<span><img src="../../../comun/recursos/images/fam/act_ejec.png" >' + ' ' + valor + '</span>';
    };

};



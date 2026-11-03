/**
 * Componente para la adición y modificación de valores contables.
 * @class Ext.Conf.ModContb.WinAddValoresContb
 * @extends Ext.Conf.ModContb.Window
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */
Ext.Conf.ModContb.WinAddValoresContb = new Ext.extend(Ext.Conf.ModContb.Window, {
    constructor: function (params) {
        this.idsubsistema = (params && params.idsubsistema) ? params.idsubsistema : -3;
        this.action = (params && params.action) ? params.action : 'adicionar';
        this.baseUrl = '/configuracion/modeloscontabilizacion/gestvalorescontables/index.php/gestvalorescontables/';

        if (!params.idioma) {
            Ext.Ajax.request({
                method: "POST",
                url: this.baseUrl + 'cargaretiquetas',
                scope: this,
                callback: function (options, success, response) {
                    params.idioma = this.idioma = Ext.decode(response.responseText);
                    this.inicializar(params);
                }
            });
        } else {
            this.idioma = params.idioma;
            this.inicializar(params);
        }

    },
    //Crea los componentes visuales de la ventana
    crearInterfaz: function (scope) {
        this.width = 500;
        this.height = 290;
        this.layout = 'fit';
        this.tipoAnt = '1';
        //utilizado durante la selección de un nodo del arbol clase
        this.tipoAct = '1';
        //último nodo expandido
        this.expandido = undefined;
        //ruta hasta el ultimo nodo expandido
        this.expandidoAnt = undefined;
        //nodo seleccionado
        this.nodo = undefined;
        //nodo padre del nodo seleccionado
        this.nodoPadre = undefined;
        //Arreglo de ids seleccionados del grid dinámico
        this.idsselected = new Array();
        this.newvalues = {
            nombre: '',
            tipo: '',
            referencia: ''
        };

        if (this.action === 'modificar') {
            this.title = (this.idioma.titleeditvalores);
        } else {
            this.title = (this.idioma.titleaddvalores);
        }

        this.hdidvalor = new Ext.form.Hidden({
            name: 'idvalorcontable'
        });

        this.firstElement = this.tfnombre = new Ext.form.TextField({
            fieldLabel: scope.idioma.lbtfnombre,
            anchor: '100%',
            name: 'nombre',
            id: 'nombre',
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maxLength: 255,
            allowBlank: false,
            enableKeyEvents: true,
            regexText: scope.idioma.regexTextLetrasNumeros
        });

        this.chboxsubstitucion = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbchboxsubstitucion,
            hideLabel: true,
            readOnly: scope.readOnly,
            checked: scope.checked,
            name: 'sustitucion'
        });

        this.rdpropiedad = new Ext.form.Radio({
            hideLabel: true,
            boxLabel: scope.idioma.lbrdpropiedad,
            inputValue: '1',
            name: 'tipo',
            checked: true
        });

        this.rdfuncionalidad = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdfuncionalidad,
            inputValue: '2',
            checked: false
        });

        this.rdcuenta = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdcuenta,
            inputValue: '3',
            disabled: scope.checked,
            checked: false
        });

        this.rdphp = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            disabled: true,
            hidden: true,
            boxLabel: scope.idioma.lbrdphp,
            inputValue: '4',
            checked: false
        });

        this.rdvariable = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdvariable,
            inputValue: '5',
            checked: false
        });

        /* radio para la referencia estatica */
        this.rdstatictref = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdstaticref,
            inputValue: '6',
            checked: false
        });

        this.pdinamico = new Ext.Panel({
            items: [{
                layout: 'column',
                id: 'column',
//                    items: [this.crearTxFStaticVar()]
                items: [this.crearCmbClase(), this.crearCmbCampo()]
            }]
        });

        this.fieldset = new Ext.form.FieldSet({
            xtype: 'fieldset',
            title: scope.idioma.lbfieldset + ' <span style="color:red;">' + '*' + '</span>',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .30,
                            layout: 'form',
                            items: [this.rdpropiedad, this.rdstatictref]
                        },
                        {
                            columnWidth: .19,
                            layout: 'form',
                            items: [this.rdcuenta/*, this.rdvariable*/]
                        },
                        {
                            columnWidth: .24,
                            layout: 'form',
                            items: [this.rdfuncionalidad]
                        },
                        {
                            columnWidth: .27,
                            layout: 'form',
                            items: [this.rdvariable]
                        }
                    ]
                }, this.pdinamico
            ]
        });

        this.form = new Ext.form.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            height: 80,
            //style: 'padding:5px;',
            items: [this.hdidvalor,
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .75,
                            layout: 'form',
                            items: [scope.tfnombre]
                        },
                        {
                            columnWidth: .25,
                            layout: 'form',
                            bodyStyle: 'padding:12px 0 0 5px;',
                            items: [scope.chboxsubstitucion]
                        }
                    ]
                }, this.fieldset]
        });

        return this.form;
    },
    inicializar: function (params) {
        this.readOnly = params.readOnly || false;
        this.checked = params.checked || false;
        this.items = this.crearInterfaz(this);

        this.keyMap = new Ext.KeyMap(Ext.getBody(), [
            {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    var filter = this.ftDinamico,
                        loading = Ext.Ajax.isLoading();
                    if (this.tipoAnt == 5 && filter && !loading) {
                        if (filter.getValue()) {
                            filter.onTrigger2Click();
                        } else {
                            filter.focus();
                        }
                    }
                }
            },
            {
                key: "l",
                alt: true,
                scope: this,
                fn: function () {
                    var filter = this.ftDinamico,
                        loading = Ext.Ajax.isLoading();
                    if (this.tipoAnt == 5 && filter && !loading) {
                        if (filter.getValue()) {
                            filter.onTrigger1Click();
                        }
                    }
                }
            }
        ]);

        Ext.Conf.ModContb.WinAddValoresContb.superclass.constructor.call(this, params);
        //se inicilaizan los eventos del padre y de la clase Ext.Conf.ModContb.WinAddCamposContb
        Ext.Conf.ModContb.WinAddValoresContb.superclass.inicializarEventos.call(this);

        //Evento para saber si presiono el boton aplicar
        this.addEvents('addElement');

        this.show();
    },
    //Se inicializan los eventos de los componentes visuales de la ventana
    inicializarEventos: function (scope) {
        this.on(
            {
                show: function () {
                    //this.formValido();
                    this.checkWindow();
                },
                cancel: function () {
                    //Se aborta la actual peticion ajax que se
                    //este realizando.
                    Ext.Ajax.abort();
                    this.keyMap.disable();
                }
            }
        );

        this.rdcuenta.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        this.rdfuncionalidad.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        if (!Ext.isEmpty(this.expandido) && this.tipoAnt == '5') {
                            this.treeAnt = this.tpdirectorio;
                        } else {
                            this.treeAnt = undefined;
                        }
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        this.rdpropiedad.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        if (!Ext.isEmpty(this.expandido) && this.tipoAnt == '5') {
                            this.treeAnt = this.tpdirectorio;
                        } else {
                            this.treeAnt = undefined;
                        }
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        this.rdphp.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        this.rdvariable.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        if (!Ext.isEmpty(this.expandido) && (this.tipoAnt == '1' || this.tipoAnt == '2')) {
                            this.treeAnt = this.tpdirectorio;
                        } else {
                            this.treeAnt = undefined;
                        }
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        /* esta es la referencia estatica */
        this.rdstatictref.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    if (checked) {
                        this.crearCmp(checkbox.getRawValue());
                    }
                }
            }
        );

        this.tfnombre.on(
            {
                scope: this,
                keyup: function () {
                    //this.formValido();
                    this.checkWindow();
                }

            }
        );

        this.chboxsubstitucion.on(
            {
                scope: this,
                check: function (checkbox, checked) {
                    this.rdcuenta.setDisabled(checked);
                    //this.formValido();
                    this.checkWindow();
                }
            }
        );

        this.btnaceptar.on(
            {
                scope: this,
                'click': function () {
                    this.salvar(true);
                }
            }
        );

        this.btnaplicar.on(
            {
                scope: this,
                'click': function () {
                    this.salvar(false);
                }
            }
        );

    },
    //Crea y retorna el componente taphp
    crearTextArea: function () {
        this.taphp = new Ext.form.TextArea({
            id: 'referencia',
            name: 'referencia',
            fieldLabel: this.idioma.lbtareaphp,
            allowBlank: false,
            anchor: '100%',
            height: 122,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                keyup: function () {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        return {
            columnWidth: .99,
            layout: 'form',
            labelAlign: 'top',
            items: [this.taphp]
        }
    },
    //Crea y retorna el componente cmbcuenta
    crearCmbCuenta: function () {
        this.stcuenta = new Ext.data.Store({
            url: this.baseUrl + 'cargarCuentas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuenta', mapping: 'id'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });

        this.cmbcuenta = new Ext.contabilidad.util.linkedCombo({
            fieldLabel: this.idioma.lbcmbcuenta,
            store: this.stcuenta,
            displayField: 'denominacion',
            valueField: 'cuenta',
            name: 'cuenta',
            id: 'cuenta',
            listHeight: 200,
            emptyText: this.idioma.lbSeleccione,
            lazyRender: true,
            allowBlank: false,
            fnCreateNew: Ext.emptyFn,
            listeners: {
                scope: this,
                select: function (cmb, record, index) {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        return {
            columnWidth: 1,
            layout: 'form',
            labelAlign: 'top',
            items: [this.cmbcuenta]
        };
    },
    crearTxFStaticVar: function () {
        this.staticVar = new Ext.form.TextField({
            fieldLabel: this.idioma.lbtxfstatica,
            allowBlank: false,
            name: 'varestatica',
            id: 'varestatica',
            anchor: '100%',
            regex: /^[a-zA-Z0-9]+$/,
            maskRe: /^[a-zA-Z0-9]+$/,
            regexText: this.idioma.regexTextLetrasNumeros,
            maxLength: 255,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                keyup: function (field, eventObj) {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        return {
            columnWidth: 1,
            layout: 'form',
            labelAlign: 'top',
            items: [this.staticVar]
        };
    },
    //Crea y retorna el componente cmbclase
    crearCmbClase: function (tipo) {
        if (Ext.isEmpty(this.treeAnt)) {
            this.tpdirectorio = new Ext.tree.TreePanel({
                animate: true,
                autoScroll: true,
                height: 250,
                border: false,
                trackMouseOver: true,
                rootVisible: false,
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Aplicación',
                    id: '0',
                    expanded: true
                }),
                loader: new Ext.tree.TreeLoader({
                    url: this.baseUrl + 'cargarDir',
                    clearOnLoad: true,
                    listeners: {
                        scope: this,
                        beforeload: function (treeloader, node) {
                            this.treemask = new Ext.LoadMask(this.tpdirectorio.getEl());
                            this.treemask.show();
                            treeloader.baseParams.tipo = this.tipoAnt;
                        },
                        load: function (treeloader, node, response) {
                            node.expand();
                            if (this.nodo && this.nodo.leaf) {
                                var nodo = this.tpdirectorio.getNodeById(this.nodo.attributes.id);
                                this.tpdirectorio.getSelectionModel().select(nodo);
                            }
                            this.tipoAct = treeloader.baseParams.tipo;

                        }
                    }
                }),
                listeners: {
                    scope: this,
                    click: function (node, e) {
                        this.treeClick(node);
                    },
                    expandnode: function (node) {
                        this.expandido = node;
                        this.treemask.hide();
                    }
                }
            });
        } else {
            this.treeAnt.rendered = false;
            this.tpdirectorio = this.treeAnt;
        }

        this.cmbclase = new Ext.form.ComboBox({
            fieldLabel: this.idioma.lbcmbclase,
            allowBlank: false,
            forceSelection: true,
            anchor: '100%',
            typeAhead: true,
            emptyText: this.idioma.lbSeleccione,
            name: 'clase',
            value: (!Ext.isEmpty(this.nodo)) ? this.nodo.attributes.text : '',
            id: 'clase',
            mode: 'local',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            lazyRender: true,
            tpl: '<div id = \"treeclase\" style = \"height:200px; !important;\"></div>',
            listeners: {
                scope: this,
                expand: function (combo) {
                    if (!this.tpdirectorio.rendered) {
                        this.tpdirectorio.render('treeclase');
                        var dif = Math.abs(parseInt(this.tipoAnt) - parseInt(this.tipoAct));
                        if (this.expandido && dif != 4 && dif != 0) {
                            this.expandir(this.expandido);
                        }
                    } else if (this.tipoAct != this.tipoAnt) {
                        if (this.expandido) {
                            this.expandir(this.expandido);
                        }
                    }
                },
                select: function () {
                    if (this.tipoAnt == 1) {
                        this.cmbcampo.clearValue();
                    } else if (this.tipoAnt == 2) {
                        this.cmbfuncionalidad.clearValue();
                    }
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        var witdth = .5;

        if (tipo == 5) {
            witdth = 1;
        }

        return {
            columnWidth: witdth,
            layout: 'form',
            labelAlign: 'top',
            items: [this.cmbclase]
        };
    },
    //Crea y retorna el componente cmbcampo
    crearCmbCampo: function (disabled) {
        this.stcampo = new Ext.data.Store({
            url: this.baseUrl + 'cargarCampos',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {name: 'denominacion'}
            ])
        });

        this.cmbcampo = new Ext.form.ComboBox({
            id: 'cmbcampo',
            fieldLabel: this.idioma.lbcmbcampo,
            store: this.stcampo,
            displayField: 'denominacion',
            valueField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            emptyText: this.idioma.lbSeleccione,
            mode: 'local',
            triggerAction: 'all',
            anchor: '100%',
            editable: false,
            disabled: true,
            name: 'campo',
            id: 'campo',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                select: function () {
                    //this.formValido();
                    this.checkWindow();
                },
                enable: function () {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        return {
            columnWidth: .5,
            layout: 'form',
            labelAlign: 'top',
            style: "padding-left:5px",
            items: [this.cmbcampo]
        };
    },
    //Crea y retorna el componente cmbfuncionalidad
    crearCmbFuncionalidad: function () {
        this.stfuncionalidad = new Ext.data.Store({
            url: this.baseUrl + 'cargarFuncionalidades',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {name: 'denominacion'}
            ])
        });

        this.cmbfuncionalidad = new Ext.form.ComboBox({
            id: 'cmbfuncionalidad',
            fieldLabel: this.idioma.lbcmbfuncionalidad,
            store: this.stfuncionalidad,
            displayField: 'denominacion',
            valueField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            emptyText: this.idioma.lbSeleccione,
            mode: 'local',
            triggerAction: 'all',
            anchor: '100%',
            editable: false,
            disabled: true,
            name: 'funcionalidad',
            id: 'funcionalidad',
            allowBlank: false,
            enableKeyEvents: true,
            listeners: {
                scope: this,
                select: function () {
                    //this.formValido();
                    this.checkWindow();
                },
                enable: function () {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        return {
            columnWidth: .5,
            layout: 'form',
            labelAlign: 'top',
            style: "padding-left:5px",
            items: [this.cmbfuncionalidad]
        };
    },
    //Crea el panel donde se adicionará el grid en dependencia de la clase seleccionada.
    crearBaseGrid: function () {
        this.panelBase = new Ext.Panel({
            disabled: true,
            height: 215,
//            frame: true,
            border: false,
            layout: 'fit'
        });

        return {
            columnWidth: 1,
            layout: 'form',
            items: [this.panelBase]
        };
    },
    //Crea y retorna un grid en dependencia de la clase dominio seleccionada.
    crearGrid: function (attributes, callbackFn) {
        var directorio = attributes.id.split('/');
        var dir = directorio[directorio.length - 2];
        this.idsselected = new Array();
        //Si la clase seleccionada no es una clase domain no posee campos
        if (dir == 'domain') {
            if (attributes.idtabla) {
                this.idsselected = (attributes.idtabla.indexOf(',') !== -1) ? attributes.idtabla.split(',') : (!Ext.isArray(attributes.idtabla)) ? [attributes.idtabla] : attributes.idtabla;
            } else {
                this.idsselected = new Array();
            }

            var stDinamico = new Ext.data.JsonStore({
                url: this.baseUrl + "cargarConfiguracionGrid",
                getIdProperty: function () {
                    return this.reader.meta.idProperty;
                }
            });
            var mask = new Ext.LoadMask(this.panelBase.getEl());

            var scope = this;
            var filter = scope.ftDinamico = new Ext.Cont.SearchField({
                id: 'filter',
                width: 450,
                clearTooltip: this.idioma.clearTooltip,
                searchTooltip: this.idioma.searchQtip,
                fnOnSearch: function () {
                    stDinamico.load({
                        params: {
                            filter: filter.getRawValue(),
                            start: 0,
                            limit: 10
                        }
                    });
                },
                fnOnClear: function () {
                    stDinamico.load({
                        params: {
                            start: 0,
                            limit: 10
                        }
                    });
                }
            });

            var pagingtbar = new Ext.PagingToolbar({
                pageSize: 10,
                store: stDinamico,
                displayInfo: true
            });

            //una vez que posea valor true se puede seleccionar una fila de acuerdo al
            //idtabla seleccionado.
            var flag = false;

            function seleccionarFila() {
                if (scope.idsselected) {
                    var store = scope.gpDinamico.getStore();
                    setTimeout(function () {
                        var filas = scope.idsselected;
                        Ext.each(store.data.items, function (record, index) {
                            if (filas.indexOf(record.data[store.getIdProperty()]) != -1) {
                                scope.gpDinamico.getSelectionModel().selectRow(index, true);
                            }
                        }, scope);
                        flag = true;
                    }, 10);
                    scope.checkWindow();
                }
            }

            function cargarStore(params) {
                stDinamico.load({
                    params: params,
                    scope: this,
                    callback: function (record, options, success) {
                        if (success) {
                            var sm = new Ext.grid.CheckboxSelectionModel({
                                singleSelect: false,
                                listeners: {
                                    rowselect: function (sm, index, record) {
                                        if (scope.idsselected.indexOf(record.data[stDinamico.getIdProperty()]) == -1) {
                                            scope.idsselected.push(record.data[stDinamico.getIdProperty()])
                                        }
                                        //scope.formValido();
                                        scope.checkWindow();
                                    },
                                    rowdeselect: function (sm, index, record) {
                                        //scope.formValido();
                                        var pos = scope.idsselected.indexOf(record.data[stDinamico.getIdProperty()]);
                                        if (pos != -1) {
                                            scope.idsselected.splice(pos, 1);
                                        }
                                        scope.checkWindow();
                                    }
                                }
                            });

                            var cm = [sm];
                            Ext.each(stDinamico.fields.items, function (data) {
                                cm.push({
                                    header: data.header,
                                    dataIndex: data.name,
                                    width: data.width,
                                    hidden: data.hidden,
                                    hideable: data.hideable
                                });
                            });

                            scope.gpDinamico = new Ext.grid.GridPanel({
                                store: stDinamico,
                                id: 'gridDinamico',
                                sm: sm,
                                columns: cm,
                                autoExpand: true,
                                autoScroll: true,
                                viewConfig: {
                                    deferEmptyText: false,
                                    emptyText: scope.idioma.lbNoResults
                                },
                                border: false,
                                stripeRows: true,
                                tbar: [filter],
                                bbar: pagingtbar
                            });
                            scope.panelBase.add(scope.gpDinamico);

                            seleccionarFila = seleccionarFila.createInterceptor(function () {
                                scope.panelBase.doLayout();
                                pagingtbar.bind(stDinamico);
                            });

                            seleccionarFila();
                        } else {
                            mostrarMensaje(1, scope.idioma.msgDependencias);
                        }
                        mask.hide();
                    }
                });
            }

            stDinamico.on(
                {
                    beforeload: function () {
                        mask.show();
                        this.baseParams.clase = attributes.text;
                        this.baseParams.ruta = attributes.id;
                        if (filter.hasSearch && !Ext.isEmpty(filter.getValue())) {
                            this.baseParams.filter = filter.getValue();
                        } else {
                            this.baseParams.filter = null;
                        }
                        /*if (!Ext.isEmpty(attributes.idtabla)) {
                         this.baseParams.idtabla = attributes.idtabla
                         } else {
                         this.baseParams.idtabla = null;
                         }*/
                    },
                    load: function (store) {
                        if (store.getCount() == 0) {
                            var message = (!Ext.isEmpty(store.baseParams.filter)) ? scope.idioma.lbNoDataResults : scope.idioma.lbNoResults;
                            mostrarMensaje(1, message);
                        }

                        if (scope.idsselected && flag) {
                            seleccionarFila();
                        } else {
                            scope.checkWindow();
                        }
                        mask.hide();
                    }
                }
            );
            var params = {
                start: 0,
                limit: 10
            };

            if (this.action == 'modificar' && attributes.idtabla) {
                mask.show();
                Ext.Ajax.request({
                    url: this.baseUrl + 'getRange',
                    params: {
                        ruta: attributes.id,
                        clase: attributes.text,
                        idtabla: scope.idsselected[0]
                    },
                    callback: function (options, success, response) {
                        params = Ext.decode(response.responseText);
                        cargarStore(params);
                    }
                });
            } else {
                cargarStore(params);
            }

        } else {
            mostrarMensaje(1, this.idioma.msgNoDatos);
        }


    },
    //Añade un componente de acuerdo a la selección
    crearCmp: function (tipoAct, reset) {
        if (Ext.getCmp('column').getComponent(1)) {
            Ext.getCmp('column').getComponent(1).destroy();
            Ext.getCmp('column').remove(Ext.getCmp('column').getComponent(1));
            if (tipoAct != 1 && tipoAct != 2 || this.tipoAnt == 5 || reset) {
                Ext.getCmp('column').getComponent(0).destroy();
                Ext.getCmp('column').remove(Ext.getCmp('column').getComponent(0));
            }
        } else {
            //if ((this.tipoAnt == 5 && tipoAct != 1 && tipoAct != 2 ) || tipoAct == 5 || this.tipoAnt != 5) {
            Ext.getCmp('column').getComponent(0).destroy();
            Ext.getCmp('column').remove(Ext.getCmp('column').getComponent(0));
            //}

        }

        switch (tipoAct) {
            case '1':
                if (this.tipoAnt != '2') {
                    Ext.getCmp('column').add(this.crearCmbClase(tipoAct));
                    if (this.tipoAnt != '5') {
                        //Se indefine el nodo en caso de haber obtenido algun valor anteriormente
                        this.nodo = undefined;
                        this.nodoPadre = undefined;
                        this.expandido = undefined;
                        this.expandidoAnt = undefined;
                    }
                }
                Ext.getCmp('column').add(this.crearCmbCampo());
                this.setHeight(290);
                if ((this.tipoAnt == '2' || this.tipoAnt == '5') && !Ext.isEmpty(this.nodo)) {
                    var params = this.nodo.attributes;
                    params.tipo = tipoAct;
                    this.cargarCmb(params);
                }
                break;
            case '2':
                if (this.tipoAnt != '1') {
                    Ext.getCmp('column').add(this.crearCmbClase());
                    if (this.tipoAnt != '5') {
                        //Se indefine el nodo en caso de haber obtenido algun valor anteriormente
                        this.nodo = undefined;
                        this.nodoPadre = undefined;
                        this.expandido = undefined;
                        this.expandidoAnt = undefined;
                    }
                }
                Ext.getCmp('column').add(this.crearCmbFuncionalidad());
                if ((this.tipoAnt == '1' || this.tipoAnt == '5') && !Ext.isEmpty(this.nodo)) {
                    var params = this.nodo.attributes;
                    params.tipo = tipoAct;
                    this.cargarCmb(params);
                }
                this.setHeight(290);
                break;
            case '3':
                Ext.getCmp('column').add(this.crearCmbCuenta());
                this.setHeight(290);
                break;
            case '4':
                Ext.getCmp('column').add(this.crearTextArea());
                this.setHeight(290);
                break;
            case '5':
                Ext.getCmp('column').add(this.crearCmbClase(tipoAct));

                Ext.getCmp('column').add(this.crearBaseGrid());
                this.setHeight(505);
                if ((this.tipoAnt == '1' || this.tipoAnt == '2') && !Ext.isEmpty(this.nodo)) {
                    this.form.doLayout();
                    var params = this.nodo.attributes;
                    params.tipo = tipoAct;
                    this.crearGrid(params);
                }
                break;
            case '6':
                Ext.getCmp('column').add(this.crearTxFStaticVar());
                this.setHeight(290);
                break;
            default:
                break;
        }
        this.center();
        this.tipoAnt = tipoAct;
        this.form.doLayout();

        //this.formValido();
        this.checkWindow();
    },
    //función del evento click del tree tpdirectorio
    treeClick: function (node) {
        this.nodo = node;
        this.nodoPadre = node.parentNode;
        var seleccionado = this.tpdirectorio.getSelectionModel().isSelected(node);
        if (node.attributes.leaf && !seleccionado) {
            this.cmbclase.setValue(node.attributes.text);
            this.cmbclase.setRawValue(node.attributes.text);
            this.cmbclase.collapse();
            this.cmbclase.fireEvent('select', this.cmbclase, node);
            var params = node.attributes;
            params.tipo = this.tipoAnt;
            if (this.tipoAnt != 5) {
                this.cargarCmb(node.attributes);
            } else {
                if (this.gpDinamico) {
                    this.gpDinamico.getStore().removeAll();
                    this.panelBase.remove(this.gpDinamico);
                }
                this.crearGrid(node.attributes);
            }

        }
    },
    //Expande el arbol dado un nodo.
    expandir: function (nodeExp) {
        var existLeaf = false;
        nodeExp.eachChild(function (node) {
            if (node.isLeaf()) {
                existLeaf = true;
                return false;
            }
        }, this);
        if (existLeaf) {
            this.tpdirectorio.getLoader().load(nodeExp);
        }
    },
    //Carga los store de los combo cmbcampo o cmbfuncionalidad
    cargarCmb: function (params, callbackFn) {
        var mask = new Ext.LoadMask(this.body, {msg: this.idioma.msgCargando});
        if (params.tipo == '2') {
            this.cmbfuncionalidad.enable();
            mask.show();
            if (this.stcampo) {
                this.stcampo.removeAll();
            }
            this.stfuncionalidad.load({
                scope: this,
                params: {
                    ruta: params.id,
                    clase: params.text
                },
                callback: function (records) {
                    mask.hide();
                    if (records.lengt == 0) {
                        mostrarMensaje(1, this.idioma.msgNoFuncionalidades);
                    }
                    if (typeof callbackFn === 'function') {
                        callbackFn();
                    }
                }
            });
        } else {
            var directorio = params.id.split('/');
            var dir = directorio[directorio.length - 2];
            //Si la clase seleccionada no es una clase domain no posee campos
            if (dir == 'domain') {
                this.cmbcampo.enable();
                mask.show();
                this.stcampo.removeAll();
                this.stcampo.load({
                    scope: this,
                    params: {
                        ruta: params.id,
                        clase: params.text
                    },
                    callback: function (records) {
                        mask.hide();
                        if (records.length == 0) {
                            mostrarMensaje(1, this.idioma.msgNoCampos);
                        }
                        if (typeof callbackFn === 'function') {
                            callbackFn();
                        }
                    }
                })
            } else {
                mostrarMensaje(1, this.idioma.msgNoCampos);
                if (typeof callbackFn === 'function') {
                    callbackFn();
                }
            }
        }
    },
    //Adiciona o modifica un valor contable
    salvar: function (cerrar) {
        var scope = this;
        var form = this.form.getForm();
        this.tfnombre.setValue(this.tfnombre.getValue().trim());
        params = form.getValues();
        params.idsubsistema = this.idsubsistema;

        if (params.tipo == 1) {
            params.referencia = params.clase + '.' + params.campo;
            params.ruta = this.nodo.attributes.id;
        } else if (params.tipo == 2) {
            params.referencia = params.clase + '.' + params.funcionalidad;
            params.ruta = this.nodo.attributes.id;
        } else if (params.tipo == 3) {
            params.referencia = this.cmbcuenta.getValue();
        } else if (params.tipo == 6) {
            params.referencia = this.staticVar.getValue();
        } else if (params.tipo == 5) {
            var idProperty = this.gpDinamico.getStore().getIdProperty();
            params.ruta = this.nodo.attributes.id;
            this.idsselected.sort(function (a, b) {
                return a - b;
            });
            params.referencia = params.clase + '.' + this.idsselected.join(',');
        }
        params.sustitucion = (params.sustitucion == 'on') ? true : false;

        scope.onloadMessageBox(scope.idioma.msgWaitEspera, scope.idioma.msgWaitGuardando);

        Ext.Ajax.request({
            url: scope.baseUrl + 'add',
            scope: this,
            params: params,
            callback: function (options, success, response) {
                Ext.MessageBox.hide();
                var response = Ext.decode(response.responseText);

                var errors = response.errors;
                if (errors.length != 0) {
                    if (response.code == 3) {
                        mostrarMensaje(3, this.idioma.msgError);
                    } else if (response.code == 5) {
                        mostrarMensaje(1, this.idioma.msgExisteNomb);
                    } else if (response.code == 6) {
                        mostrarMensaje(1, this.idioma.msgNoModificar.replace(/<#>/g, errors[0].nombre));
                    }
                } else {
                    if (this.action == 'adicionar') {
                        mostrarMensaje(1, this.idioma.msgInsertado);
                    } else {
                        mostrarMensaje(1, this.idioma.msgModificado);
                    }
                    this.fireEvent('addElement', this, response.success);
                    if (cerrar) {
                        this.destroy();
                    } else {
                        //Se retorna a la configuración inicial de la ventana
                        this.nodo = undefined;
                        this.nodoPadre = undefined;
                        this.expandido = undefined;
                        this.expandidoAnt = undefined;

                        this.rdpropiedad.setValue(true);
                        this.rdfuncionalidad.setValue(false);
                        this.rdstatictref.setValue(false);
                        this.rdcuenta.setValue(false);
                        if (this.rdphp.isVisible()) {
                            this.rdphp.setValue(false);
                            this.rdphp.disable();
                        }
                        this.rdvariable.setValue(false);
                        this.tipoAnt = '1';
                        this.crearCmp(this.tipoAnt, true);
                        this.tfnombre.reset();
                        this.chboxsubstitucion.reset();
                        this.cmbclase.reset();
                        this.cmbcampo.reset();
                        this.tfnombre.focus(true);
                        this.center();
                    }
                }
            }
        });
    },
    //Valida el formulario
    formValid: function () {
        var objeto = this.form.getForm().getValues();
        var cont = 0;
        var keys = Object.keys(objeto);
        if (keys.indexOf('clase') != -1) {
            if (objeto.tipo == '1' && keys.indexOf('campo') == -1) {
                keys.push('campo');
            } else if (objeto.tipo == '2' && keys.indexOf('funcionalidad') == -1) {
                keys.push('funcionalidad');
            } else if (objeto.tipo == '5' && keys.indexOf('gridDinamico') == -1) {
                keys.push('gridDinamico');
            }
        }
        //se optionen las posiciones en el arreglo de llaves
        var index = new Array();
        index.push(keys.indexOf('tipo'));
        index.push(keys.indexOf('sustitucion'));
        index.push(keys.indexOf('idvalorcontable'));
        index.push(keys.indexOf('filter'));
        for (var i = 0; i < index.length; i++) {
            //Se eliminan en caso de existir ya que es necesario descartartarlo durante la validación
            if (index[i] != -1) {
                keys.splice(index[i], 1);
            }
        }

        Ext.each(keys, function (key) {
            var cmp = Ext.getCmp(key);
            if (cmp) {
                if (cmp.getXType() == 'grid' && this.idsselected.length >= 1) {
                    cont++
                } else {
                    if (cmp.getXType() != 'grid' && !cmp.disabled && (cmp.isValid() || cmp.isValid() != '')) {
                        cont++;
                    }
                }
            }

        }, this);
        return cont == keys.length;
    },
    //Muestra un mensaje
    mostrarMensaje: function (codigo, mensaje, fn) {
        if (codigo == 1) {
            var buttons = Ext.MessageBox.OK;
            var title = this.idioma.titlemsg;
        }
        Ext.MessageBox.show({
            title: title,
            msg: mensaje,
            width: 300,
            buttons: buttons,
            fn: fn
        });
    },
    //Actualiza la propiedad newvalues de esta clase
    updatevalues: function () {
        params = this.form.getForm().getValues();
        this.newvalues.nombre = params.nombre;
        this.newvalues.tipo = params.tipo;
        if (params.tipo == 1) {
            this.newvalues.referencia = params.clase + '.' + params.campo;
        } else if (params.tipo == 2) {
            this.newvalues.referencia = params.clase + '.' + params.funcionalidad;
        } else if (params.tipo == 3) {
            this.newvalues.referencia = this.cmbcuenta.getValue();
        } else if (params.tipo == 6) {
            this.newvalues.referencia = this.staticVar.getValue();
        } else if (params.tipo == 5) {
            this.idsselected.sort(function (a, b) {
                return a - b;
            });
            this.newvalues.referencia = params.clase + '.' + this.idsselected.join(',');
        }
    },
    //Habilita o deshabilita los botones de la ventana.
    checkWindow: function () {
        var condition = true;
        if (this.formValid()) {
            this.changeValue = this.changeValue.createInterceptor(this.updatevalues());
            if (this.action == 'modificar') {
                this.fireEvent('windowValid', this.changeValue());
            } else {
                this.fireEvent('windowValid', true);
            }
        } else {
            this.fireEvent('windowValid', false);
        }
    },
    //Verifica si se realizaron cambios en los datos del formulario.
    changeValue: function () {
        var newvalue = this.newvalues;
        var oldvalue = Ext.getCmp('grid' + this.idsubsistema).getSelectionModel().getSelected().data;
        for (k in newvalue) {
            if ((!Ext.isEmpty(oldvalue[k]) && !Ext.isEmpty(newvalue[k])) || (Ext.isEmpty(oldvalue[k]) && !Ext.isEmpty(newvalue[k])) || (!Ext.isEmpty(oldvalue[k]) && Ext.isEmpty(newvalue[k]))) {
                if (oldvalue[k] != newvalue[k]) {
                    return true;
                }
            }
        }
        return false;
    },
    //Muestra un mensaje de espera
    onloadMessageBox: function (agTtl, agMsg) {
        Ext.MessageBox.show({
            title: agTtl,
            msg: agMsg,
            width: 300,
            progress: true,
            closable: false
        });
        var f = function (v) {
            return function () {
                var i = v / 11;
                Ext.MessageBox.updateProgress(i);
            };
        };
        for (var i = 1; i < 12; i++) {
            setTimeout(f(i), i * 500);
        }
    }
});


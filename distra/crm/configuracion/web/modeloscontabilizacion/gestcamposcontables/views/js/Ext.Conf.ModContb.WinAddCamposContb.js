/**
 * Componente para la inserción y modificación de campos contables.
 * @class Ext.Conf.ModContb.WinAddCamposContb
 * @extends Ext.Conf.ModContb.Window
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */

Ext.Conf.ModContb.WinAddCamposContb = new Ext.extend(Ext.Conf.ModContb.Window, {
    constructor: function(params) {
        this.baseUrl = '/configuracion/modeloscontabilizacion/gestcamposcontables/index.php/gestcamposcontables/';
        this.idsubsistema = undefined;
        this.campocontable = (params && params.campocontable) ? params.campocontable : {};
        this.idsubsistema = (params && params.idsubsistema) ? params.idsubsistema : -3;
        this.action = (params && params.action) ? params.action : 'adicionar';

        if (!params.idioma) {
            Ext.Ajax.request({
                method: "POST",
                url: this.baseUrl + 'cargaretiquetas',
                scope: this,
                callback: function(options, success, response) {
                    this.idioma = Ext.decode(response.responseText);
                    params.idioma = this.idioma;
                    this.inicializar(params);
                }
            });

        } else {
            this.idioma = params.idioma;
            this.inicializar(params);
        }

    },
    inicializar: function(params) {
        this.crearInterfaz(this);

        this.keyMap = new Ext.KeyMap(Ext.getBody(), [
            {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function() {
                    if (this && !this.btnaceptar.disabled) {
                        this.salvar(true);
                    }
                }
            },
            {
                key: "b",
                alt: true,
                scope: this,
                fn: function () {
                    var filter = this.ftDinamico,
                        loading = Ext.Ajax.isLoading();
                    if (this.tipo == 5 && filter && !loading) {
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
                    if (this.tipo == 5 && filter && !loading) {
                        if (filter.getValue()) {
                            filter.onTrigger1Click();
                        }
                    }
                }
            }
        ]);

        Ext.Conf.ModContb.WinAddCamposContb.superclass.constructor.call(this, params);
        //se inicilaizan los eventos del padre y de la clase Ext.Conf.ModContb.WinAddCamposContb
        Ext.Conf.ModContb.WinAddCamposContb.superclass.inicializarEventos.call(this);

        //Evento para saber si presiono el boton aplicar
        this.addEvents('addElement');
        this.show();
    },
    //Inicializa los eventos de los componentes visuales
    inicializarEventos: function(scope) {
        this.on(
                {
                    cancel: function() {
                        //Se aborta la actual peticion ajax que se
                        //este realizando.
                        Ext.Ajax.abort();
                        this.keyMap.disable();
                    },
                    show: function(win) {
                        if (this.idsubsistema == -2) {
                            this.mostrarCmp('2');
                            if (scope.action == 'modificar') {
                                scope.form.getForm().loadRecord(scope.campocontable);
                            }
                        } else {
                            if (scope.action == 'modificar') {
                                var array = scope.campocontable.data.referencia.split('.');
                                scope.nodo = {
                                    attributes: {
                                        'id': scope.campocontable.data.ruta,
                                        'text': array[0],
                                        'tipo': scope.tipo,
                                        'idtabla': array[1]
                                    }
                                };

                                if (scope.campocontable.data.tipo == 1) {
                                    var myMask = new Ext.LoadMask(this.body, {msg: scope.idioma.cargando2});
                                    myMask.show();
                                    this.stclasificador.load({
                                        callback: function(record, options, success) {
                                            myMask.hide();
                                            scope.form.getForm().loadRecord(scope.campocontable);

                                            scope.cmbcampo.enable();
                                            scope.cmbcampo.setValue(array[1]);
                                            var myMask1 = new Ext.LoadMask(scope.body, {msg: scope.idioma.cargando1});
                                            myMask1.show();
                                            var clasificador = scope.getClasificador();

                                            scope.stcampo.load({
                                                params: {
                                                    ruta: clasificador.data.ruta,
                                                    clase: clasificador.data.clase
                                                }, callback: function(record, options, success) {
                                                    //scope.formValido();
                                                    scope.checkWindow();
                                                    myMask1.hide();
                                                }
                                            });
                                            scope.taruta.reset();
                                        }
                                    });

                                } else if (scope.campocontable.data.tipo == 3) {
                                    scope.form.getForm().loadRecord(scope.campocontable);
                                    scope.cmbclase.enable();
                                    scope.cmbclase.setValue(array[0]);
                                    scope.cmbfuncionalidad.enable();
                                    scope.cmbfuncionalidad.setValue(array[1]);
                                    var myMask1 = new Ext.LoadMask(scope.body, {msg: scope.idioma.cargando4});
                                    myMask1.show();
                                    scope.stfuncionalidad.load({
                                        params: {
                                            clase: array[0],
                                            ruta: scope.campocontable.data.ruta
                                        },
                                        callback: function(record, options, success) {
                                            myMask1.hide();
                                            //scope.formValido();
                                            scope.checkWindow();
                                        }
                                    });
                                    scope.taruta.reset();
                                } else if (scope.campocontable.data.tipo == 5) {
                                    scope.form.getForm().loadRecord(scope.campocontable);
                                    scope.cmbclase1.setValue(array[0]);
                                    scope.cmbclase1.setRawValue(array[0]);
                                    scope.crearGrid(scope.nodo.attributes);
                                } else if (scope.campocontable.data.tipo == 6) {
                                    scope.form.getForm().loadRecord(scope.campocontable);
                                    scope.staticVar.enable();
                                    scope.staticVar.setValue(scope.campocontable.data.referencia);
                                }
                            }else{
                                setTimeout(function(){
                                    scope.firstElement.focus();
                                },100);
                            }
                        }
                    },
                    destroy:function(){
                        this.keyMap.disable();
                    }
                }
        );

        if (this.radioclasificador) {
            this.radioclasificador.on('check', function(cmp, check) {
                if (check) {
                    this.tipo = 1;
                    this.mostrarCmp('1');
                    //this.formValido();
                    this.checkWindow();
                }
            }, this);
        }

        if (this.radiovariable) {
            this.radiovariable.on('check', function(cmp, check) {
                if (check) {
                    this.tipo = 5;
                    this.mostrarCmp('5');
                    //this.formValido();
                    this.checkWindow();
                }
            }, this);
        }

        if (this.radiofuncionalidad) {
            this.radiofuncionalidad.on('check', function(cmp, check) {
                if (check) {
                    this.tipo = 3;
                    this.mostrarCmp('3');
                    //this.formValido();
                    this.checkWindow();
                }
            }, this);
        }

        if (this.rdstatictref) {
            this.rdstatictref.on({
                scope: this,
                check: function(checkbox, checked) {
                    if (checked) {
//                        this.crearCmp(checkbox.getRawValue());
                        this.tipo = 6;
                        this.mostrarCmp('6');
                        //this.formValido();
                        this.checkWindow();
                    }
                }
            });
        }

        if (this.cmbclasificador) {
            this.cmbclasificador.on('select', function(combo, record, index) {
                this.cmbcampo.clearValue();
                this.nombclasificador = record.denominacion;
                var myMask = new Ext.LoadMask(this.body, {msg: (scope.idioma.cargando1) ? scope.idioma.cargando1 : "Cargando campos..."});
                myMask.show();
                this.stcampo.load({
                    scope: this,
                    params: {
                        ruta: record.data.ruta,
                        clase: record.data.referenciaclase
                    }, callback: function(record, options, success) {
                        myMask.hide();
                        scope.cmbcampo.enable();
                        //scope.formValido();
                        scope.checkWindow();
                    }
                });
            }, this);
        }

        if (this.cmbclase) {
            this.cmbclase.on(
                    {
                        scope: this,
                        expand: function(combo) {
                            if (this.tpdirectorio.rendered) {
                                this.tpdirectorio.rendered = false;
                            }
                            this.tpdirectorio.render('treeclase');
                            if (this.expandido) {
                                var leaf = this.expandido.findChild('leaf', true);
                                var loaded = this.tpdirectorio.getLoader().baseParams.tipo;
                                if (leaf && this.tipo != loaded) {
                                    this.tpdirectorio.getLoader().load(this.expandido);
                                }
                            }
                        }
                    }
            );
        }

        if (this.cmbclase1) {
            this.cmbclase1.on(
                    {
                        scope: this,
                        expand: function(combo) {
                            if (this.tpdirectorio.rendered) {
                                this.tpdirectorio.rendered = false;
                            }
                            this.tpdirectorio.render('treeclase1');
                            if (this.expandido) {
                                var leaf = this.expandido.findChild('leaf', true);
                                var loaded = this.tpdirectorio.getLoader().baseParams.tipo;
                                if (leaf && this.tipo != loaded) {
                                    this.tpdirectorio.getLoader().load(this.expandido);
                                }
                            }
                        }
                    }
            );
        }

        if (this.tpdirectorio) {
            this.tpdirectorio.getLoader().on(
                    {
                        scope: this,
                        beforeload: function(treeloader, node) {
                            this.treemask = new Ext.LoadMask(this.tpdirectorio.getEl());
                            this.treemask.show();
                            treeloader.baseParams.tipo = this.tipo;
                        },
                        load: function(treeloader, node, reponse) {
                            node.expand();
                            this.treemask.hide();
                        }
                    }
            );

            this.tpdirectorio.on(
                    {
                        scope: this,
                        click: function(node, e) {
                            this.treeClick(node);
                        },
                        expandnode: function(node) {
                            this.expandido = node;
                        }
                    }
            );
        }

        if (this.cmbcampo) {
            this.cmbcampo.on('select', function(combo, record, index) {
                //this.formValido();
                this.checkWindow();
            }, this);
        }

        if (this.tfnombre) {
            this.tfnombre.on('keyup', function(field, event) {
                //this.formValido();
                this.checkWindow();
            }, this);
        }

        if (this.taruta) {
            this.taruta.on('keyup', function(field, event) {
                //this.formValido();
                this.checkWindow();
            }, this);
        }

        //botones que hereda del padre
        this.btnaceptar.on('click', function() {
            this.salvar(true);
        }, this);

        this.btnaplicar.on('click', function() {
            this.salvar(false);
        }, this);
    },
    //Crea los componentes visaules de la ventana
    crearInterfaz: function(scope) {
        this.width = 500;
        this.height = 275;
        this.constrain = true;
        this.layout = 'fit';
        this.nodo = undefined;
        this.expandido = undefined;
        this.tipo = 1;
        this.newvalues={
            nombre:'',
            tipo:'',
            referencia:''
        };

        if (this.action === 'modificar') {
            this.title = this.idioma.titleeditcampo;
        } else {
            this.title = this.idioma.titleaddcampo;
        }

        this.firstElement = this.tfnombre = new Ext.form.TextField({
            fieldLabel: scope.idioma.lbtfnombre,
            anchor: '100%',
            name: 'nombre',
            allowBlank: false,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            maxLength: 255,
            regexText:scope.idioma.regexTextLetrasNumeros
        });

        this.radioclasificador = new Ext.form.Radio({
            hideLabel: true,
            boxLabel: scope.idioma.lbrdclasificador,
            inputValue: '1',
            name: 'tipo',
            disabled: (scope.idsubsistema == -2) ? true : false,
            checked: (scope.idsubsistema == -2) ? false : true
        });

        this.radiovariable = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdvariable,
            inputValue: '5',
            checked: (scope.idsubsistema == -2) ? true : false
        });

        this.radiofuncionalidad = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdfuncionalidad,
            inputValue: '3',
            checked: (scope.idsubsistema == -2) ? true : false
        });

        /* radio para la referencia estatica */
        this.rdstatictref = new Ext.form.Radio({
            hideLabel: true,
            name: 'tipo',
            boxLabel: scope.idioma.lbrdstaticref,
            inputValue: '6',
            checked: false
        });

        this.stclasificador = new Ext.data.Store({
            url: scope.baseUrl + 'cargarClasificadores',
            baseParams: {
                idsubsistema: scope.idsubsistema
            },
            reader: new Ext.data.JsonReader({
                root: "data"
            }, [
                {name: 'idclasificador', mapping: 'idclasificador'},
                {name: 'denominacion', mapping: 'nombre'},
                {name: 'ruta', mapping: 'ruta'},
                {name: 'clase', mapping: 'referenciaclase'}
            ])
        });

        this.cmbclasificador = new Ext.contabilidad.util.linkedCombo({
            fieldLabel: scope.idioma.cmbclasificador,
            store: this.stclasificador,
            //url: 'cargarClasificadores',
            displayField: 'denominacion',
            valueField: 'idclasificador',
            listHeight: 200,
            fnCreateNew: scope.crearWindow,
            emptyText: scope.idioma.seleccione,
            name: 'idclasificador'
        });

        this.stcampo = new Ext.data.Store({
            url: scope.baseUrl + 'cargarCampos',
            reader: new Ext.data.JsonReader({
                root: "datos"
            }, [
                {name: 'denominacion'}
            ])
        });

        this.cmbcampo = new Ext.form.ComboBox({
            fieldLabel: scope.idioma.cmbcampo,
            store: this.stcampo,
            displayField: 'denominacion',
            valueField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            emptyText: scope.idioma.seleccione,
            mode: 'local',
            triggerAction: 'all',
            anchor: '100%',
            editable: false,
            disabled: true,
            name: 'campo',
            allowBlank: false,
            hidden: false,
            enableKeyEvents: true
        });

        this.pcombos = new Ext.Panel({
            height: 50,
            hidden: false,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [
                                this.cmbclasificador
                            ]
                        }, {
                            columnWidth: .5,
                            bodyStyle: 'padding-left:5px',
                            layout: 'form',
                            items: [
                                this.cmbcampo
                            ]
                        }
                    ]
                }]
        });

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
                clearOnLoad: true
            })
        });

        this.cmbclase = new Ext.form.ComboBox({
            fieldLabel: this.idioma.cmbclase,
            allowBlank: false,
            forceSelection: true,
            anchor: '100%',
            typeAhead: true,
            emptyText: scope.idioma.seleccione,
            name: 'clase',
            id: 'clase',
            mode: 'local',
            disabled: true,
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
                select: function() {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        this.cmbclase1 = new Ext.form.ComboBox({
            fieldLabel: this.idioma.cmbclase,
            allowBlank: false,
            forceSelection: true,
            anchor: '100%',
            typeAhead: true,
            emptyText: scope.idioma.seleccione,
            name: 'clase',
            id: 'clase1',
            mode: 'local',
            disabled: true,
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: false,
            store: new Ext.data.SimpleStore({
                fields: [],
                data: [[]]
            }),
            lazyRender: true,
            tpl: '<div id = \"treeclase1\" style = \"height:200px; !important;\"></div>',
            listeners: {
                scope: this,
                select: function() {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

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
            fieldLabel: this.idioma.cmbfuncionalidad,
            store: this.stfuncionalidad,
            displayField: 'denominacion',
            valueField: 'denominacion',
            typeAhead: true,
            forceSelection: true,
            emptyText: scope.idioma.seleccione,
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
                select: function() {
                    //this.formValido();
                    this.checkWindow();
                },
                enable: function() {
                    //this.formValido();
                    this.checkWindow();
                }
            }
        });

        this.pcombos1 = new Ext.Panel({
            height: 50,
            hidden: true,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .5,
                            layout: 'form',
                            items: [
                                this.cmbclase
                            ]
                        }, {
                            columnWidth: .5,
                            bodyStyle: 'padding-left:5px',
                            layout: 'form',
                            items: [
                                this.cmbfuncionalidad
                            ]
                        }
                    ]
                }]
        });

        this.pcombos3 = new Ext.Panel({
            height: 50,
            hidden: true,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            labelAlign: 'top',
                            items: [this.staticVar = new Ext.form.TextField({
                                    fieldLabel: this.idioma.lbtxfstatica,
                                    allowBlank: false,
                                    name: 'varestatica',
                                    id: 'varestatica',
                                    anchor: '100%',
                                    regex: /^[a-zA-Z0-9]+$/,
                                    maskRe: /^[a-zA-Z0-9]+$/,
                                    maxLength:255,
                                    regexText:scope.idioma.regexTextLetrasNumeros,
                                    disabled: true,
                                    enableKeyEvents: true,
                                    listeners: {
                                        scope: this,
                                        keyup: function(field, eventObj) {
                                            //this.formValido();
                                            this.checkWindow();
                                        }
                                    }
                                })]
                        }

                    ]
                }]
        });

        this.taruta = new Ext.form.TextArea({
            fieldLabel: scope.idioma.lbtarearuta,
            name: 'referencia',
            allowBlank: false,
            disabled: true,
            anchor: '100%',
            height: 120,
            enableKeyEvents: true
        });

        this.pradios = new Ext.Panel({
            height: 50,
            layout: 'fit',
            hidden: false,
            items: [{
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .20,
                            layout: 'form',
                            items: [
                                this.radioclasificador
                            ]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [
                                this.radiofuncionalidad
                            ]
                        }, {
                            columnWidth: .27,
                            layout: 'form',
                            items: [
                                this.radiovariable
                            ]
                        },
                        {
                            columnWidth: .28,
                            layout: 'form',
                            items: [
                                this.rdstatictref
                            ]
                        }
                    ]
                }]
        });

        this.ptextarea = new Ext.Panel({
            height: 150,
            style: 'padding:5px;',
            hidden: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .99,
                            layout: 'form',
                            items: [this.taruta]
                        }]
                }]
        });

        this.pcombos2 = new Ext.Panel({
            height: 50,
            hidden: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: [
                                this.cmbclase1
                            ]
                        }]
                }]
        });

        this.panelGrid = new Ext.Panel({
            disabled: true,
            border: false,
            height: 215,
            layout: 'fit'
        });

        this.panelBase = new Ext.Panel({
            height: 215,
            hidden: true,
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: [
                                this.panelGrid
                            ]
                        }]
                }]
        });

        this.fieldset = new Ext.form.FieldSet({
            xtype: 'fieldset',
            title: scope.idioma.lbfieldset + ' <span style="color:red;">' + '*' + '</span>',
            autoHeight: true,
            items: [this.pradios, this.pcombos, this.ptextarea, this.pcombos1, this.pcombos2, this.pcombos3, this.panelBase]
        });

        this.form = new Ext.form.FormPanel({
            labelAlign: 'top',
            frame: true,
            border: false,
            height: 80,
            //style: 'padding:5px;',
            items: [scope.tfnombre, this.fieldset]
        });

        this.items = this.form;
    },
    //Muestra los paneles en dependencia del radio button seleccionado
    mostrarCmp: function(tipo) {
        switch (tipo) {
            case '1':
                this.pcombos.show();
                this.cmbclasificador.reset();
                this.cmbclasificador.enable();
                this.cmbcampo.reset();

                this.pcombos1.hide();
                this.cmbclase.disable();
                this.cmbfuncionalidad.disable();

                this.pcombos3.hide();
                this.staticVar.disable();

                this.pcombos2.hide();
                this.cmbclase1.disable();
                this.panelBase.hide();
                this.panelGrid.disable();
                this.fieldset.doLayout();
                this.setHeight(280);
                break;
            case '5':
                this.pcombos2.show();
                this.cmbclase1.reset();
                this.cmbclase1.enable();
                if (this.nodo) {
                    this.treeClick(this.nodo, true);
                }

                this.panelBase.show();
                this.fieldset.doLayout();

                this.pcombos1.hide();
                this.cmbclase.disable();
                this.cmbfuncionalidad.disable();

                this.pcombos3.hide();
                this.staticVar.disable();

                this.pcombos.hide();
                this.cmbclasificador.disable();
                this.cmbcampo.disable();
                this.setHeight(495);
                break;
            case '3':
                this.pcombos1.show();
                this.cmbclase.reset();
                this.cmbclase.enable();
                this.cmbfuncionalidad.reset();
                if (this.nodo) {
                    this.treeClick(this.nodo, true);
                }

                this.pcombos.hide();
                this.cmbclasificador.disable();
                this.cmbcampo.disable();
                
                this.pcombos3.hide();
                this.staticVar.disable();

                this.pcombos2.hide();
                this.cmbclase1.disable();
                this.panelBase.hide();
                this.panelGrid.disable();
                this.fieldset.doLayout();
                this.setHeight(280);
                break;
            case '6':
                this.pcombos3.show();
                this.staticVar.reset();
                this.staticVar.enable();
                
                this.pcombos1.hide();
                this.cmbclase.disable();
                this.cmbfuncionalidad.disable();
                
                this.pcombos.hide();
                this.cmbclasificador.disable();
                
                this.pcombos2.hide();
                this.cmbclase1.disable();
                this.panelBase.hide();
                this.panelGrid.disable();
                this.fieldset.doLayout();
                this.setHeight(280);
                break;
            default:
                break;
        }
        this.center();
    },
    //Adiciona o modifica un campo contable
    salvar: function(cerrar) {
        var scope = this;
        var form = this.form.getForm();
        this.tfnombre.setValue(this.tfnombre.getValue().trim());
        params = form.getValues();
        params.idsubsistema = this.idsubsistema;
        if (params.tipo == 1) {
            var clasificador = this.getClasificador();
            params.idclasificador = this.cmbclasificador.getValue();
            params.referencia = clasificador.data.clase + '.' + params.campo;
        } else if (params.tipo == 3) {
            params.referencia = params.clase + '.' + params.funcionalidad
            params.ruta = this.nodo.attributes.id;
        } else if (params.tipo == 5) {
            var idProperty = this.gpDinamico.getStore().getIdProperty();
            params.referencia = params.clase + '.' + this.gpDinamico.getSelectionModel().getSelected().data[idProperty];
            params.ruta = this.nodo.attributes.id;
        } else if (params.tipo == 6) {
            params.referencia = this.staticVar.getValue();
        }

        if (this.action == 'modificar') {
            params.id = this.campocontable.data.idcampo;
        }

        if (form.isValid()) {
            this.keyMap.disable();
            this.onloadMessageBox(this.idioma.msgWaitEspera , this.idioma.msgWaitGuardando);
            Ext.Ajax.request({
                url: scope.baseUrl + 'add',
                scope: this,
                params: params,
                callback: function(options, success, response) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(response.responseText);
                    var errors = response.errors;
                    if (errors.length != 0) {
                        this.keyMap.enable();
                        if (response.code == 6) {
                            mostrarMensaje(1, this.idioma.msgExisteCampo);
                        } else if (response.code == 7) {
                            mostrarMensaje(1, this.idioma.msgExisteNomb);
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
                            this.keyMap.enable();
                            if (this.tipo == 5 && this.gpDinamico) {
                                this.gpDinamico.getStore().removeAll();
                                this.panelGrid.remove(this.gpDinamico);
                            }
                            this.form.getForm().reset();
                            this.tfnombre.focus(true);
                            this.cmbcampo.disable();
                            this.nodo = undefined;
                            this.expandido = undefined;
                            this.fireEvent('windowValid', false);
                        }
                    }
                }
            });
        } else {
            mostrarMensaje(3, this.idioma.camposincorrectos);
        }
    },
    //Retorna el clasficador que se encuentra seleccionado en el combo cmbclasificador
    getClasificador: function() {
        return this.stclasificador.getAt(this.stclasificador.find('idclasificador', this.cmbclasificador.getValue()));
    },
    //función del evento click del tree tpdirectorio
    treeClick: function(node, flag) {
        this.nodo = node;
        var seleccionado = this.tpdirectorio.getSelectionModel().isSelected(node);
        if (node.attributes.leaf && (!seleccionado || flag)) {
            var combo = this.cmbclase;
            if (this.tipo == 5) {
                combo = this.cmbclase1;
            }
            combo.setValue(node.attributes.text);
            combo.setRawValue(node.attributes.text);
            combo.collapse();
            combo.fireEvent('select', combo, node);
            if (this.tipo != 5) {
                this.cargarFuncionalidad(node.attributes);
            } else {
                if (this.gpDinamico) {
                    this.gpDinamico.getStore().removeAll();
                    this.panelGrid.remove(this.gpDinamico);
                }
                this.crearGrid(node.attributes);
            }

        }
    },
    //Crea y retorna un grid en dependencia de la clase dominio seleccionada.
    crearGrid: function(attributes) {
        var directorio = attributes.id.split('/');
        var dir = directorio[directorio.length - 2];
        //Si la clase seleccionada no es una clase domain no posee campos
        if (dir == 'domain') {
            var stDinamico = new Ext.data.JsonStore({
                url: this.baseUrl + "cargarConfiguracionGrid",
                getIdProperty: function() {
                    return this.reader.meta.idProperty;
                },
                getPage: function() {
                    return this.reader.meta.page;
                }
            });
            var mask = new Ext.LoadMask(this.panelBase.getEl());

            var scope = this;
            var filter = scope.ftDinamico = new Ext.Cont.SearchField({
                id: 'filter',
                width: 440,
                clearTooltip: this.idioma.clearTooltip,
                searchTooltip: this.idioma.searchQtip,
                fnOnSearch: function() {
                    stDinamico.load({
                        params: {
                            filter: filter.getRawValue(),
                            start: 0,
                            limit: 10
                        }
                    });
                },
                fnOnClear: function() {
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
            var flag = false

            function seleccionarFila() {
                var store = scope.gpDinamico.getStore();
                var row = store.find(store.getIdProperty(), attributes.idtabla);
                setTimeout(function() {
                    scope.gpDinamico.getSelectionModel().selectRow(row, true);
                    flag = true;
                }, 10);
            }

            function cargarStore(params) {
                stDinamico.load({
                    params: params,
                    scope: this,
                    callback: function(record, options, success) {
                        var cm = [];
                        if(success){
                            Ext.each(stDinamico.fields.items, function(data) {
                                cm.push({
                                    header: data.header,
                                    dataIndex: data.name,
                                    width: data.width,
                                    hidden: data.hidden,
                                    hideable: data.hideable
                                });
                            });

                            var sm = new Ext.grid.RowSelectionModel({
                                singleSelect: true,
                                listeners: {
                                    selectionchange: function(sm) {
                                        //scope.formValido();
                                        scope.checkWindow();
                                        if (sm.getCount() != 0) {
                                            attributes.idtabla = sm.getSelected().data[stDinamico.getIdProperty()];
                                        }
                                    }
                                }
                            });

                            scope.gpDinamico = new Ext.grid.GridPanel({
                                store: stDinamico,
                                id: 'gridDinamico',
                                sm: sm,
                                columns: cm,
                                autoExpand: true,
                                viewConfig: {
                                    deferEmptyText:false,
                                    emptyText:scope.idioma.lbNoResults
                                },
                                autoScroll: true,
                                border: false,
                                stripeRows: true,
                                tbar: [filter],
                                bbar: pagingtbar
                            });
                            scope.panelGrid.add(scope.gpDinamico);

                            seleccionarFila = seleccionarFila.createInterceptor(function() {
                                scope.panelGrid.enable();
                                scope.panelGrid.doLayout();
                                pagingtbar.bind(stDinamico);
                            });

                            seleccionarFila();
                        }else{
                            mostrarMensaje(1,scope.idioma.msgDependencias);
                        }
                        mask.hide();
                    }
                });
            }

            stDinamico.on(
                    {
                        beforeload: function() {
                            mask.show();
                            this.baseParams.clase = attributes.text;
                            this.baseParams.ruta = attributes.id;
                            if (filter.hasSearch && !Ext.isEmpty(filter.getValue())) {
                                this.baseParams.filter = filter.getValue();
                            } else {
                                this.baseParams.filter = null;
                            }
                            if (!Ext.isEmpty(attributes.idtabla)) {
                                this.baseParams.idtabla = attributes.idtabla
                            } else {
                                this.baseParams.idtabla = null;
                            }
                        },
                        load: function(store,records,options) {
                            if (store.getCount() == 0) {
                                var message = (!Ext.isEmpty(store.baseParams.filter)) ? scope.idioma.lbNoDataResults : scope.idioma.lbNoResults;
                                mostrarMensaje(1, message);
                            }

                            if (records.length>0 && attributes.idtabla && flag) {
                                seleccionarFila();
                            }
                            mask.hide();
                        }
                    }
            );
            var params = {
                start: 0,
                limit: 10
            }

            if (this.action == 'modificar' && attributes.idtabla) {
                mask.show();
                Ext.Ajax.request({
                    url: this.baseUrl + 'getRange',
                    params: {
                        ruta: attributes.id,
                        clase: attributes.text,
                        idtabla: attributes.idtabla
                    },
                    callback: function(options, success, response) {
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
    //Carga las funcionalidades
    cargarFuncionalidad: function(params) {
        var mask = new Ext.LoadMask(this.body, this.idioma.cargando4);
        this.cmbfuncionalidad.enable();
        mask.show();
        this.stfuncionalidad.load({
            scope: this,
            params: {
                ruta: params.id,
                clase: params.text
            },
            callback: function(records) {
                mask.hide();
                if (records.lengt == 0) {
                    mostrarMensaje(1, this.idioma.msgNoFuncionalidades);
                }
            }
        })

    },
    //Actualiza la propiedad newvalues de esta clase
    updatevalues:function(){
        params = this.form.getForm().getValues();
        this.newvalues.nombre=params.nombre;
        this.newvalues.tipo=params.tipo;
        if (params.tipo == 1) {
            var clasificador = this.getClasificador();
            this.newvalues.referencia = clasificador.data.clase + '.' + params.campo;
        } else if (params.tipo == 3) {
            this.newvalues.referencia = params.clase + '.' + params.funcionalidad;
        } else if (params.tipo == 5) {
            if(this.gpDinamico){
                var idProperty = this.gpDinamico.getStore().getIdProperty();
                if(this.gpDinamico.getSelectionModel().hasSelection()){
                    this.newvalues.referencia = params.clase + '.' + this.gpDinamico.getSelectionModel().getSelected().data[idProperty];
                }
            }
        } else if (params.tipo == 6) {
            this.newvalues.referencia = this.staticVar.getValue();
        }
    },
    //Habilita o deshabilita los botones de la ventana.
    checkWindow: function () {
        var condition = true;
        if (this.tipo == 5) {
            condition = this.gpDinamico && this.gpDinamico.getSelectionModel().hasSelection();
        }

        if(this.form.getForm().isValid()){
            this.changeValue=this.changeValue.createInterceptor(this.updatevalues());
            if(this.action=='modificar'){
                this.fireEvent('windowValid', condition && this.changeValue());
            }else{
                this.fireEvent('windowValid', condition);
            }
        }else{
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
/**
 * Componente para la adición y modificación de modelos contables.
 * @class Ext.Conf.ModContb.WinAddModelos
 * @extends Ext.Conf.ModContb.Window
 * @category Componente
 * @author Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @version 1.0
 */
Ext.Conf.ModContb.WinAddModelos = Ext.extend(Ext.Conf.ModContb.Window, {
    constructor: function (params) {
        //arreglo con los ids de los asientos y sustituciones eliminados
        this.arrEliminados = [];
        this.arrEliminados['asientos'] = [];
        this.arrEliminados['sustituciones'] = [];
        this.idsubsistema = (params && params.idsubsistema) ? params.idsubsistema : -3;
        this.action = (params && params.action) ? params.action : 'adicionar';
        this.baseUrl = '/configuracion/modeloscontabilizacion/gestmodelos/index.php/gestionarmodelos/';
        arrJs = [
            ['/configuracion/modeloscontabilizacion/gestcamposcontables/views/js/Ext.Conf.ModContb.WinAddCamposContb', 'WinAddCamposContb'],
            ['/configuracion/modeloscontabilizacion/gestvalorescontables/views/js/Ext.Conf.ModContb.WinAddValoresContb', 'WinAddValoresContb'],
            ['/configuracion/modeloscontabilizacion/componentes/Ext.Conf.ModContb.GridEditor', 'Ext.Conf.ModContb.GridEditor'],
            ['/configuracion/modeloscontabilizacion/componentes/RowEditor/RowEditor', 'RowEditor'],
            ['/configuracion/modeloscontabilizacion/componentes/linkedCombo', 'linkedCombo'],
            ['/configuracion/comun/views/js/Ext.Cont.SearchField', 'Ext.Cont.SearchField']
        ];
        this.loadJs(arrJs, function () {
            this.addEvents('addElement');
            if (!params.idioma) {
                var mask = new Ext.LoadMask(this.getEl());
                mask.show();
                Ext.Ajax.request({
                    method: "POST",
                    url: this.baseUrl + 'cargaretiquetas',
                    scope: this,
                    callback: function (options, success, response) {
                        this.idioma = Ext.decode(response.responseText);
                        mask.hide();
                        this.inicializar(params);
                    }
                });
            } else {
                this.idioma = params.idioma;
                this.inicializar(params);
            }
        }, this);
    },
    inicializar: function (params) {
        this.crearInterfaz(this);

        this.keyMap = new Ext.KeyMap(Ext.getBody(), [
            {
                key: "i",
                alt: true,
                scope: this,
                fn: function () {
                    this.gridAsiento.insertar();
                }
            },
            {
                key: "i",
                key: "s",
                alt: true,
                scope: this,
                fn: function () {
                    if (!this.gridSustitucion.btnadd.disabled && !this.pSustitucion.collapsed && !this.gridSustitucion.disabled) {
                        this.gridSustitucion.insertar();
                    }
                }
            }
            /*{
             key: "x",
             alt: true,
             scope: this,
             fn: function () {
             //En este caso es necesario desabilitar el keymap
             //dado que el mismo por alguna razon este no se destruye
             //una vez que la ventana ese eliminada.
             this.keyMap.disable();
             this.destroy();
             }
             },
             {
             key: "p",
             ctrl: true,
             alt: true,
             scope: this,
             fn: function () {
             if (this.action == 'adicionar' && !this.btnaplicar.disabled) {
             //En este caso es necesario desabilitar el keymap
             //dado que el mismo por alguna razon este no se destruye
             //una vez que la ventana ese eliminada.
             this.salvar(false);
             }
             }
             },*/
            /*{
             key: Ext.EventObject.ENTER,
             scope: this,
             fn: function () {
             if (!this.btnaceptar.disabled) {
             //En este caso es necesario desabilitar el keymap
             //dado que el mismo por alguna razon este no se destruye
             //una vez que la ventana ese eliminada.
             this.salvar(true);
             }
             }
             }*/
        ]);

        Ext.Conf.ModContb.WinAddModelos.superclass.constructor.call(this, params);
        //inicializo los eventos del padre juntos con los de la clase Ext.Conf.ModContb.WinAddModelos
        Ext.Conf.ModContb.WinAddModelos.superclass.inicializarEventos.call(this);

        this.show();
    },
    //Se crean todos los elementos de la ventana
    crearInterfaz: function (scope) {
        var me=this;
        this.layout = 'border';
        //this.maximized = true;
        this.width = 1000;
        this.height = 600;
        this.constrain = true;
        this.maximized = (Ext.lib.Dom.getViewWidth() - this.width < 30 || Ext.lib.Dom.getViewHeight() - this.height < 30) ? true : false;
        //arreglo que almacena temporalmente todos los valores seleccionados
        //en el combo valor de las sustituciones.
        this.arrTemp = new Array();

        if (this.action === 'modificar') {
            this.title = this.idioma.tittlewineditmodelo;
        } else {
            this.title = this.idioma.tittlewinaddmodelo;
        }
        this.hdidmodelo = new Ext.form.Hidden({
            name: 'idmodelo'
        });

        this.hdestado = new Ext.form.Hidden({
            name: 'estado'
        });

        this.btnAddCampo = new Ext.Button({
            text: this.idioma.lbbtnAddBottom,
            iconCls: 'adicionar',
            tooltip: this.idioma.lbtooltipAddCampo
        });

        this.btnAddValorAsiento = new Ext.Button({
            text: this.idioma.lbbtnAddBottom,
            iconCls: 'adicionar',
            tooltip: this.idioma.lbtooltipAddValor
        });

        this.btnAddValorSust = new Ext.Button({
            text: this.idioma.lbbtnAddBottom,
            iconCls: 'adicionar',
            tooltip: this.idioma.lbtooltipAddValor
        });

        this.firstElement = this.tfcodigo = new Ext.form.TextField({
            fieldLabel: scope.idioma.lbtfcodigo,
            anchor: '98%',
            name: 'codigo',
            allowBlank: false,
            enableKeyEvents: true,
            regex: /^[a-zA-Z0-9]+$/,
            maskRe: /^[a-zA-Z0-9]+$/,
            regexText: scope.idioma.regexTextLetrasNumeros,
            maxLength: 30
        });

        this.tfnombre = new Ext.form.TextField({
            fieldLabel: scope.idioma.lbtfnombre,
            anchor: '100%',
            name: 'nombre',
            allowBlank: false,
            enableKeyEvents: true,
            maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s]+$/,
            regexText: scope.idioma.regexTextLetrasNumeros,
            maxLength: 255
        });

        this.tfdescripcion = new Ext.form.TextField({
            fieldLabel: scope.idioma.lbtfdescripcion,
            anchor: '100%',
            name: 'descripcion',
            allowBlank: true,
            enableKeyEvents: true,
            maxLength: 255
        });

        this.form = new Ext.form.FormPanel({
            frame: true,
            //height: 115,
            autoHeight: true,
            region: 'north',
            labelAlign: 'top',
            style: 'padding:5px;',
            items: [this.hdidmodelo, this.hdestado, {
                layout: 'column',
                items: [
                    {
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.tfcodigo]
                    },
                    {
                        columnWidth: .8,
                        layout: 'form',
                        items: [this.tfnombre]
                    }]
            }, this.tfdescripcion]
        });

        this.lbdebe = new Ext.form.Label(
            {
                xtype: 'label',
                text: '0'
            }
        );

        this.lbhaber = new Ext.form.Label(
            {
                xtype: 'label',
                text: '0'
            }
        );

        this.statusBar = new Ext.StatusBar({
            defaultText: this.idioma.lbdefaultText,
            items: [this.idioma.lbDebe, this.lbdebe, '%', '-', this.idioma.lbHaber, this.lbhaber, '%']
        });

        this.stcuenta = new Ext.data.Store({
            url: this.baseUrl + 'cargarCuentas',
            baseParams: {
                tipocta: ''
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'cuenta', mapping: 'id'},
                {name: 'denominacion', mapping: 'text'}
            ])
        });

        this.stvalorAsientos = new Ext.data.Store({
            url: this.baseUrl + 'cargarValores',
            baseParams: {
                sustitucion: false,
                idsubsistema: this.idsubsistema
            },
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'idvalorcontable'},
                {name: 'nombre'}
            ])
        });

        this.stvalorSustitucion = new Ext.data.Store({
            url: this.baseUrl + 'cargarValores',
            baseParams: {
                sustitucion: true,
                idsubsistema: this.idsubsistema
            },
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'valor', mapping: 'idvalorcontable', type: 'int'},
                {name: 'denominacion', mapping: 'nombre'}
            ])
        });

        var stAsientos = new Ext.data.Store({
            url: this.baseUrl + 'cargarAsientos',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'idasiento'},
                {name: 'tipocuenta'},
                {name: 'creditodebito'},
                {name: 'cuenta'},
                {name: 'idvalorcontable'},
                {name: 'porciento', type: 'float'},
                {name: 'denominacion'},
                {name: 'valid'},
                {name: 'sustitucion'},
                {name: 'cantsustituciones'}
            ]),
            sortInfo: {field: 'creditodebito', direction: 'ASC'}
        });

        this.cmbtipocta = new Ext.form.ComboBox({
            store: new Ext.data.SimpleStore({
                fields: ['tipocuenta', 'denominacion'],
                data: [[1, 'Cuenta Din\xE1mica'], [2, 'Cuenta Fija']]
            }),
            editable: false,
            lazyRender: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            displayField: 'denominacion',
            valueField: 'tipocuenta',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: scope.idioma.msgSeleccione,
            allowBlank: false
        });

        this.cbxcuenta = new Ext.contabilidad.util.linkedCombo({
            store: this.stcuenta,
            displayField: 'denominacion',
            valueField: 'cuenta',
            /*maskRe: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,
            regex: /^[0-9a-zA-Z\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\-\,\(\)]+$/,*/
            maxLength: 255,
            disabled: true,
            listHeight: 200,
            tipocta: '',
            id: 'lnkcuenta',
            lazyRender: true,
            buttons: [this.btnAddCampo],
            fnCreateNew: Ext.emptyFn
        });

        this.cbxvalorAsiento = new Ext.contabilidad.util.linkedCombo({
            store: this.stvalorAsientos,
            displayField: 'nombre',
            valueField: 'idvalorcontable',
            listHeight: 200,
            id: 'lnkvalorAsiento',
            buttons: [this.btnAddValorAsiento],
            lazyRender: true,
//            singleSelection: false,
            fnCreateNew: Ext.emptyFn
        });

        var cm = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.idioma.hdTipoCta,
                    dataIndex: 'tipocuenta',
                    width: 130,
                    fixed: true,
                    editor: scope.cmbtipocta,
                    sortable: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return scope.mostrarValor(scope.gridAsiento, value, rowIndex, colIndex, record);
                    }
                },
                {
                    id: 'idcampo',
                    header: this.idioma.hdCuenta,
                    dataIndex: 'cuenta',
                    width: 250,
                    editable: true,
                    sortable: true,
                    editor: this.cbxcuenta,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var field = scope.gridSustitucion.getColumnModel().getCellEditor(colIndex, rowIndex).field;
                        var displayField = field.displayField;
                        console.log(value, record.data[displayField], stAsientos.getAt(rowIndex))
                        return record.data[displayField];
                        //return scope.mostrarValor(scope.gridAsiento, value, rowIndex, colIndex, record);
                    }
                },
                {
                    header: this.idioma.hdAfecta,
                    dataIndex: 'creditodebito',
                    width: 100,
                    sortable: true,
                    fixed: true,
                    editor: new Ext.form.ComboBox({
                        store: new Ext.data.SimpleStore({
                            fields: ['creditodebito', 'denominacion'],
                            data: [[1, 'Debe'], [2, 'Haber']]
                        }),
                        editable: false,
                        readOnly: true,
                        lazyRender: true,
                        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                        displayField: 'denominacion',
                        valueField: 'creditodebito',
                        typeAhead: true,
                        forceSelection: true,
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: scope.idioma.msgSeleccione
                    }),
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return scope.mostrarValor(scope.gridAsiento, value, rowIndex, colIndex, record);
                    }
                },
                {
                    header: this.idioma.hdValor,
                    dataIndex: 'idvalorcontable',
                    width: 250,
                    fixed: true,
                    sortable: true,
                    editor: this.cbxvalorAsiento,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return scope.mostrarValor(scope.gridAsiento, value, rowIndex, colIndex, record);
                    }
                },
                {
                    header: this.idioma.hdPorciento,
                    dataIndex: 'porciento',
                    sortable: true,
                    width: 110,
                    fixed: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowNegative: false,
                        minValue: 0.01,
                        maxValue: 900,
                        nanText: scope.idioma.regexTextReales,
                        listeners: {
                            show: function (field) {
                                field.setValue(100)
                            }
                        }
                    })
                }
            ]
        });

        this.gridAsiento = new Ext.Conf.ModContb.GridEditor({
            idComponente: 1.1,
            idioma: this.idioma,
            perfil: this.perfil,
            region: 'center',
            store: stAsientos,
            cm: cm,
            autoExpandColumn: 'idcampo',
            idsubsistema: this.idSubsistema,
            title: this.idioma.titlegridAsiento,
            textbtnadd: this.idioma.lbbtnAdd,
            tooltipbtnadd: this.idioma.lbtooltipAddAsiento,
            textbtndel: this.idioma.lbbtnDel,
            tooltipbtndel: this.idioma.lbtooltipDelAsiento,
            saveText: this.idioma.btnaceptar,
            saveTooltip: this.idioma.btnaceptarRe,
            cancelText: this.idioma.btncancelar,
            cancelTooltip: this.idioma.btncancelarRe,
            iconSave: 'aceptar',
            btnDuplicar: true,
            idProperty: 'idasiento',
            duplicar: function(){
                var selected=this.getSelectionModel().getSelections()[0],
                    cloneRecord = selected.copy();
                var nuevosasientos=[];
                cloneRecord.get('sustitucion').forEach(function(x){
                    var valores=Object.assign({}, x);
                    valores['idsustitucion']='';
                    valores['idasiento']='';
                    nuevosasientos.push(valores);
                });
                cloneRecord.set('idasiento', '');
                var nuevo=cloneRecord.data;
                nuevo['sustitucion']=nuevosasientos;
                var recordDinamico = Ext.data.Record.create(this.getStore().fields.keys);
                var record = new recordDinamico(nuevo);
                this.getStore().add(record);
            }
            //bbar: this.statusBar
        });

        var stSustitucion = new Ext.data.Store({
            url: this.baseUrl + 'cargarSustituciones',
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'idsustitucion'},
                {name: 'idasiento'},
                {name: 'idnivelsustitucion'},
                {name: 'tipoorigen'},
                {name: 'valor'},
                {name: 'referencia'},
                //campos auxiliares
                {name: 'denominacion'}, //denominacion del valor
                {name: 'idtemp'}, //id temporal para identificar la sustitución
                {name: 'valid', type: 'boolean'}//determina si una fila es valida
            ]),
            listeners:{
                beforeload: function(){
                    if(me.gridAsiento.btndpl)
                        me.gridAsiento.btndpl.disable();
                },
                load: function(){
                    if(me.gridAsiento.btndpl)
                        me.gridAsiento.btndpl.setDisabled(me.gridAsiento.getSelectionModel().getCount()!=1);
                }
            }
        });

        this.cmbnivel = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                autoLoad: true,
                url: scope.baseUrl + 'cargarNivelesCuentas',
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'idnivelsustitucion', mapping: 'idparteformato'},
                    {name: 'denominacion', mapping: 'nombre'}
                ])
            }),
            editable: false,
            lazyRender: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            displayField: 'denominacion',
            valueField: 'idnivelsustitucion',
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            emptyText: scope.idioma.msgSeleccione
        });

        this.cmborigen = new Ext.form.ComboBox({
            store: new Ext.data.Store({
                url: scope.baseUrl + 'cargarOrigen',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    root: 'datos'
                }, [
                    {name: 'tipoorigen', mapping: 'idconfapertura'},
                    {name: 'denominacion'},
                    {name: 'esquema'},
                    {name: 'concepto'},
                    {name: 'identificador'},
                    {name: 'descripcion'},
                    {name: 'codigo'},
                    {name: 'identificadorpadre'},
                ])
            }),
            editable: false,
            lazyRender: true,
            readOnly: true,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            displayField: 'denominacion',
            valueField: 'tipoorigen',
            typeAhead: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            emptyText: scope.idioma.msgSeleccione,
            listHeight: 150

        });

        this.cbxvalorSust = new Ext.contabilidad.util.linkedCombo({
            store: this.stvalorSustitucion,
            displayField: 'denominacion',
            valueField: 'valor',
            disabled: true, /*
             editable:true,
             enableKeyEvents:true,*/
            listHeight: 200,
            id: 'lnkvalorSust',
//            singleSelection: false,
            allowBlank: true,
            idtipo: '',
            buttons: [this.btnAddValorSust],
            lazyRender: true,
            fnCreateNew: Ext.emptyFn
        });

        var cmSustitucion = new Ext.grid.ColumnModel({
            columns: [
                {
                    header: this.idioma.hdEstructura,
                    dataIndex: 'idnivelsustitucion',
                    width: 130,
                    editor: this.cmbnivel,
                    fixed: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        scope.cmbnivel.store.clearFilter();
                        return scope.mostrarValor(scope.gridSustitucion, value, rowIndex, colIndex, record);
                    }
                },
                {
                    header: this.idioma.hdOrigen,
                    dataIndex: 'tipoorigen',
                    width: 200,
                    editor: this.cmborigen,
                    fixed: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        return scope.mostrarValor(scope.gridSustitucion, value, rowIndex, colIndex, record);
                    }
                },
                {
                    header: this.idioma.hdValor,
                    dataIndex: 'valor',
                    id: 'valor',
                    width: 120,
                    editor: this.cbxvalorSust,
                    renderer: function (value, metaData, record, rowIndex, colIndex) {
                        var field = scope.gridSustitucion.getColumnModel().getCellEditor(colIndex, rowIndex).field;
                        var displayField = field.displayField;
                        return record.data[displayField];
                        //return scope.mostrarValor(scope.gridSustitucion, value, rowIndex, colIndex, record);
                    }
                }
            ]
        });

        this.gridSustitucion = new Ext.Conf.ModContb.GridEditor({
            idComponente: 1.2,
            store: stSustitucion,
            cm: cmSustitucion,
            idioma: this.idioma,
            perfil: this.perfil,
            disabled: true,
            autoExpandColumn: 'valor',
            textbtnadd: this.idioma.lbbtnAdd,
            tooltipbtnadd: this.idioma.lbtooltipAddSustitucion,
            textbtndel: this.idioma.lbbtnDel,
            tooltipbtndel: this.idioma.lbtooltipDelSustitucion,
            saveText: this.idioma.btnaceptar,
            saveTooltip: this.idioma.btnaceptarRe,
            cancelText: this.idioma.btncancelar,
            cancelTooltip: this.idioma.btncancelarRe,
            iconSave: 'aceptar',
            validateChange: false
        });

        this.pSustitucion = new Ext.Panel({
            xtype: 'panel',
            layout: 'fit',
            region: 'south',
            title: this.idioma.titlepanelSustitucion,
            collapsed: true,
            split: true,
            collapsible: true,
            height: 170,
            items: [this.gridSustitucion]
        });

        this.panel = new Ext.Panel({
            layout: 'border',
            items: [this.gridAsiento, this.pSustitucion]
        });

        this.fieldset = new Ext.form.FieldSet({
            region: 'center',
            margins: '5 5 5 5',
            title: scope.idioma.lbfieldset + ' <span style="color:red;">' + '*' + '</span>',
            layout: 'border',
            items: [this.gridAsiento, this.pSustitucion]
        });

        this.items = [this.form, this.fieldset];
    },
    //Se definen las funciones para los distintos componentes visuales de la ventana
    inicializarEventos: function (scope) {
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

        this.on(
            {
                cancel: function () {
                    //Se aborta la peticion ajax que se este realizando actualmente.
                    Ext.Ajax.abort();
                }
            }
        );

        if (this.gridAsiento) {
            this.gridAsiento.on(
                {
                    rowclick: function (grid, rowIndex, event) {
                        var cant = this.getSelectionModel().getCount();
                        if (cant == 1 && this.getSelectionModel().getSelected().data.valid) {
                            scope.gridSustitucion.getStore().removeAll();
                            scope.gridSustitucion.enable();
                            //scope.pSustitucion.expand(true);
                            scope.cargarGridSustitucion();
                        } else {
                            scope.gridSustitucion.getStore().removeAll();
                            scope.pSustitucion.collapse(true);
                            scope.gridSustitucion.disable();
                        }
                        scope.checkWindow();
                    },
                    gridvalid: function (valid, grid, record) {
                        scope.calcular();
                        if (valid) {
                            scope.gridSustitucion.getStore().removeAll();
                            scope.gridSustitucion.enable();
                            //scope.pSustitucion.expand(true);
                            scope.cargarGridSustitucion();
                        }
                    }
                }
            );

            this.cbxcuenta.on(
                {
                    scope: this,
                    select: function (combo, record, rowIndex) {
                        var recordCmb = this.cmbtipocta.store.getAt(this.cmbtipocta.store.find('tipocuenta', this.cmbtipocta.getValue()));
                        this.cbxcuenta.tipocta = recordCmb.data.tipocuenta;
                    },
                    expand: function () {
                        /*var recordGrid = this.gridAsiento.getStore().getAt(this.gridAsiento.rowEditing);*/
                        var tree = this.cbxcuenta.tree;
                        if (Ext.isEmpty(this.cbxcuenta.getValue())) {
                            tree.getSelectionModel().clearSelections();
                        } else {
                            tree.getSelectionModel().select(tree.getNodeById(this.cbxcuenta.getValue()));
                        }
                    }
                }
            );

            this.cbxcuenta.tree.on(
                {
                    scope: this,
                    beforerender: function () {
                        //Antes de que el tree del linkedcombo se renderice y cargue completamente
                        //no es conveniente permitir que el usuario pueda comenzar a editar
                        //una fila que tiene un tipo de cuenta distinto al actual.
                        //Esto trae como consecuencia que el componente no se renderice satisfactoriamente.
                        //Por ello se supenden los eventos del grid, para que una vez que marque una fila
                        //sin que el tree se haya cargado completamente por primera vez, no se dispare
                        //el evento click del grid y por tanto no se ejecuta el metodo startEditing del roweditor.
                        this.gridAsiento.suspendEvents();
                    },
                    load: function () {
                        //Una vez cargado el tree por primera vez se resumen los eventos.
                        this.gridAsiento.resumeEvents();
                    }
                }
            );
            this.cbxcuenta.tree.getLoader().on(
                {
                    beforeload: function () {
                        //Antes de realizar cualquier peticion se verifica si
                        //actulamente el treeLoader está realizando una petición,
                        //y casi simultaneamente se realizó otra, en ese caso
                        //se aborta la petición anterior y se continua con la última
                        //realizada.
                        if (this.isLoading()) {
                            Ext.Ajax.abort(this.transId);
                        }
                    }
                }
            );

            this.gridAsiento.roweditor.on({
                scope: this,
                beforeedit: function (roweditor, grid, record, rowIndex) {
                    grid.rowEditing = rowIndex;
                    if (!Ext.isEmpty(record)) {
                        var store = this.cbxcuenta.getStore();

                        var recordInst = this.crearRecord(store, record, false);
                        //Se adiciona al store la instancia creada.
                        store.insert(0, recordInst);

                        var cm = grid.getColumnModel();
                        var editor = cm.getCellEditor(1, rowIndex);
                        var tipocta = this.cbxcuenta.tipocta;
                        //Se oculta el boton adicionar del toolbar del combo.
                        this.btnAddCampo.setVisible(record.data.tipocuenta == '1' ? true : false);
                        var baseParams = {};
                        if (!Ext.isEmpty(record.data.tipocuenta)) {
                            baseParams.tipocta = record.data.tipocuenta;
                            baseParams.idsubsistema = this.idsubsistema;

                            this.cbxcuenta.tipocta = record.data.tipocuenta;
                            //Template donde se renderiza el linkedcombo.
                            //El idtentificador del template está compuesto por la concatenación
                            // de lnkcombo y el id del linkedcombo.
                            var lnkcomboArea = document.getElementById('lnkcombolnkcuenta');
                            //Si existe el area sobre la cual se renderiza el linkedcombo entonces se
                            // se recarga el store del mismo.
                            if (!Ext.isEmpty(lnkcomboArea) && tipocta != record.data.tipocuenta) {
                                this.cbxcuenta.reload(false, false, baseParams);
                            } else {
                                this.cbxcuenta.setBaseParams(baseParams);
                            }
                            this.cbxcuenta.enable();
                        } else {
                            this.cbxcuenta.disable();
                        }
                    }
                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    var displayField = this.cbxcuenta.displayField;
                    var rawValue = this.cbxcuenta.getRawValue();
                    var store = this.gridAsiento.getStore();
                    //Record del grid
                    var record = store.getAt(rowIndex);
                    //record.beginEdit();
                    record.set(displayField, rawValue);
                    //record.endEdit();
                    store.sort('creditodebito', 'ASC');
                },
                validateedit: function (roweditor, grid, changes, record, rowIndex) {
                    var respuesta = this.validar(grid, record, changes, this.idioma.msgExisteAsiento);
                    if (respuesta === false) {
                        return false;
                    }
                }
            });

            this.gridAsiento.getStore().on(
                {
                    remove: function (store, record, index) {
                        //Si se está ejecutando una petición al servidor esta se aborta
                        if (Ext.Ajax.isLoading()) {
                            Ext.Ajax.abort();
                            scope.sustMask.hide();
                        }
                        scope.pSustitucion.collapse(true);
                        scope.calcular();
                        //Si el record eliminado posee idasiento significa que se encuentra en bd
                        //por lo tanto ahi que eliminarlo una vez se haga la peticion al servidor
                        var idasiento = record.data.idasiento;
                        if (!Ext.isEmpty(idasiento) && scope.action == 'modificar') {
                            var index = scope.existeId(idasiento, 'idasiento', scope.arrEliminados['asientos']);
                            if (index == -1) {
                                scope.arrEliminados['asientos'].push(idasiento);
                                //Buscar si el asiento posee sustituciones
                                var arrSust = record.data.sustitucion;
                                if (Ext.isArray(arrSust) && arrSust.length != 0) {
                                    var cant = arrSust.length;
                                    for (var i = 0; i < cant; i++) {
                                        if (arrSust[i].idsustitucion) {
                                            scope.arrEliminados['sustituciones'].push(arrSust[i].idsustitucion);
                                        }
                                    }
                                }
                            }
                        }
                        scope.checkWindow();
                    },
                    add: function (store, records, index) {
                        scope.calcular();
                        scope.cbxvalorAsiento.setValue('', '');
                        scope.cbxcuenta.setValue('', '');
                    },
                    update: function (store, record, operation) {
                        scope.checkWindow();
                    },
                    load: scope.setOriginalValue.bind(scope)
                }
            );

            this.cmbtipocta.on({
                    scope: this,
                    select: function (combo, record, index) {
                        //tipo cuenta seleccionado en el combo
                        var tipocta = this.cbxcuenta.tipocta;
                        //Se oculta el boton adicionar del toolbar del combo
                        this.btnAddCampo.setVisible(record.data.tipocuenta == '1' ? true : false);

                        var recordGrid = this.gridAsiento.getStore().getAt(this.gridAsiento.rowEditing);

                        var rowIndex = this.gridAsiento.rowEditing;
                        var baseParams = {};
                        baseParams.idsubsistema = this.idsubsistema;
                        baseParams.tipocta = this.cmbtipocta.getValue();

                        this.cbxcuenta.enable();
                        //Template donde se renderiza el linkedcombo.
                        //El idtentificador del template está compuesto por la concatenación
                        // de lnkcombo y el id del linkedcombo.
                        var lnkcomboArea = document.getElementById('lnkcombolnkcuenta');
                        //Si existe el area sobre la cual se renderiza el linkedcombo entonces se
                        // se recarga el store del mismo.
                        if (!Ext.isEmpty(lnkcomboArea) && tipocta != this.cmbtipocta.getValue()) {
                            this.cbxcuenta.clearValue();
                            this.cbxcuenta.reload(false, false, baseParams);
                        } else {
                            this.cbxcuenta.clearValue();
                            this.cbxcuenta.setBaseParams(baseParams);
                        }
                        this.cbxcuenta.tipocta = this.cmbtipocta.getValue();
                    }
                }
            );

            this.cbxvalorAsiento.on(
                {
                    expand: function () {
                        var tree = this.tree;
                        if (Ext.isEmpty(this.getValue())) {
                            tree.getSelectionModel().clearSelections();
                        } else {
                            tree.getSelectionModel().select(tree.getNodeById(this.getValue()));
                        }
                    }
                }
            )

            this.btnAddCampo.on(
                {
                    scope: scope,
                    click: function () {
                        var mask = new Ext.LoadMask(this.getEl());
                        mask.show();
                        var win = new Ext.Conf.ModContb.WinAddCamposContb({
                            idsubsistema: this.idsubsistema,
                            listeners: {
                                scope: this,
                                addElement: function (win, object) {
                                    this.cbxcuenta.addRecord(object);
                                },
                                show: function () {
                                    mask.hide();
                                }
                            }
                        });

                        this.cbxcuenta.collapse();
                    }
                }
            );

            this.btnAddValorAsiento.on(
                {
                    scope: this,
                    click: function () {
                        var mask = new Ext.LoadMask(this.getEl());
                        mask.show();
                        var win = new Ext.Conf.ModContb.WinAddValoresContb({
                            idsubsistema: this.idsubsistema,
                            readOnly: true,
                            checked: false,
                            listeners: {
                                scope: this,
                                addElement: function (win, object) {
                                    this.cbxvalorAsiento.addRecord(object);
                                },
                                show: function () {
                                    mask.hide();
                                }
                            }
                        });
                        this.cbxvalorAsiento.collapse();
                    }
                }
            );
        }

        if (this.gridSustitucion) {
            this.gridSustitucion.on(
                {
                    scope: this,
                    gridvalid: function (valid, grid, record) {
                        if (valid) {
                            //si el asiento seleccionado aun no posee un id en bd entonces se toma el id
                            //asignado por el store.
                            var recordAsiento = this.gridAsiento.getSelectionModel().getSelected();
                            //id asigna en el record
                            //var idAsiento = recordAsiento.id;

                            //idkey almacena una clave temporal en caso de no poseer idsustitucion
                            //para realizar busquedas dentro del arreglo
                            var idKey = (record.data.idsustitucion) ? 'idsustitucion' : 'idtemp';

                            if (!record.data[idKey]) {
                                //se agrega un identificador temperal
                                record.data.idtemp = record.id;
                                //Si el asiento posee idasiento se le asiegna a la nueva sustitucion
                                if (!Ext.isEmpty(recordAsiento.data.idasiento)) {
                                    record.data.idasiento = recordAsiento.data.idasiento;
                                }
                                //Se obtiene el campo sustitucion del record que se encuentra seleccionado en el grid Asiento
                                //y se le insertan los datos del record resientemente insertado.
                                //this.gridAsiento.getStore().getById(idAsiento).data.sustitucion.push(record.data);
                                recordAsiento.data.sustitucion.push(record.data);
                                //Se modifican los campos dirty y modified para señalar que el record cambió
                                recordAsiento.dirty = true;
                                recordAsiento.modified = {sustitucion: new Array()};
                                this.gridAsiento.getStore().fireEvent('update', this.gridAsiento.getStore(), recordAsiento, 'edit');
                            } else {
                                //Se obtiene al array sustitucion del asiento seleccionado
                                var arrSustitucion = recordAsiento.data.sustitucion;
                                //Se busca la posicion de la sustitucion modificada
                                var index = this.indexSustitucion(record, arrSustitucion);

                                //Se guarda el nuevo valor de la sustitucion
                                //this.gridAsiento.getStore().getById(idAsiento).data.sustitucion[index] = record.data;
                                recordAsiento.data.sustitucion[index] = record.data;
                                //Se modifican los campos dirty y modified para señalar que el record cambió
                                recordAsiento.dirty = true;
                                recordAsiento.modified = {sustitucion: new Array()};
                                this.gridAsiento.getStore().fireEvent('update', this.gridAsiento.getStore(), recordAsiento, 'edit');
                            }
                        }
                    }
                }
            );

            var store = this.gridSustitucion.getStore();
            var tree = this.cbxvalorSust.tree;

            store.on(
                {
                    scope: this,
                    remove: function (store, record) {
                        var idAsiento = this.gridAsiento.getSelectionModel().getSelected().id;
                        var arrSustitucion = this.gridAsiento.getStore().getById(idAsiento).data.sustitucion;
                        var index = this.indexSustitucion(record, arrSustitucion);
                        if (index != -1) {
                            this.gridAsiento.getStore().getById(idAsiento).data.sustitucion.splice(index, 1);
                        }
                        this.gridAsiento.getStore().getById(idAsiento).dirty = true;
                        this.gridAsiento.getStore().getById(idAsiento).modified = {sustitucion: new Array()};
                        this.checkWindow();
                        var idsustitucion = record.data.idsustitucion;
                        if (!Ext.isEmpty(idsustitucion) && scope.action == 'modificar') {
                            var posDel = scope.existeId(idsustitucion, 'idsustitucion', scope.arrEliminados['sustituciones']);
                            if (posDel == -1) {
                                //Si el record eliminado posee idsustitucion significa que se encuentra en bd
                                //por lo tanto ahi que eliminarlo una vez se haga la peticion al servidor
                                scope.arrEliminados['sustituciones'].push(idsustitucion);
                            }
                        }
                        this.filtrarStore();
                        if (this.cmbnivel.store.getCount() == 0) {
                            this.gridSustitucion.btnadd.disable();
                        } else {
                            scope.gridSustitucion.btnadd.enable();
                        }

                    },
                    add: function (record) {
                        this.checkWindow();
                        if (this.cbxvalorSust && tree.rendered) {
                            this.limpiarSeleccion();
                        }
                    }
                }
            );

            this.cmborigen.on(
                {
                    scope: this,
                    select: function (combo, record, index) {
                        var baseParams = {};
                        var recordGrid = this.gridSustitucion.getStore().getAt(this.gridSustitucion.rowEditing);
                        var idtipoAnt = this.cbxvalorSust.idtipo;
                        //Si el elemento seleccionado es un nomenclador por apertura entonces al menos posee estos campos,
                        // por lo tanto se debe modifica en el reocod del grid la referencia.
                        //En caso contrario se modifica con valor vacio previendo que posea un valor.
                        if (!Ext.isEmpty(record.data.esquema) && !Ext.isEmpty(record.data.concepto)) {
                            recordGrid.data.referencia = record.data.esquema + '.' + record.data.concepto + '.' + record.data.identificador + '.' + record.data.descripcion + '.' + record.data.codigo;
                            //datos del record seleccionado en el combo
                            baseParams = record.data;
                            //Esquema.tabla en base de datos
                            baseParams.referencia = recordGrid.data.referencia;
                            //El boton adicionar valor solo se muestra para el caso en que el elemento en el combo
                            //sea valor dinámico.
                            this.btnAddValorSust.hide();
                        } else {
                            recordGrid.data.referencia = '';
                            baseParams.sustitucion = true;
                            baseParams.idsubsistema = this.idsubsistema;
                            //El boton adicionar valor solo se muestra para el caso en que el elemento en el combo
                            //sea valor dinámico.
                            this.btnAddValorSust.show();
                        }
                        //Se habilita el combobox dado que este por defecto aparece deshabilitado.
                        this.cbxvalorSust.enable();
                        //Template donde se renderiza el linkedcombo.
                        //El idtentificador del template está compuesto por la concatenación
                        // de lnkcombo y el id del linkedcombo.
                        var lnkcomboArea = document.getElementById('lnkcombolnkvalorSust');
                        //Si existe el area sobre la cual se renderiza el linkedcombo entonces se
                        // se recarga el store del mismo.
                        if (!Ext.isEmpty(lnkcomboArea) && idtipoAnt != record.data.tipoorigen) {
                            //Una vez seleccionado un nuevo elemento si es diferente al elemento
                            //anteriormente seleccionado el valor del combo cbxvalorSust se modifica
                            //con valor vacio.
                            this.cbxvalorSust.setValue('', '');
                            this.arrTemp = new Array();
                            this.cbxvalorSust.reload(false, false, baseParams);
                        } else {
                            this.cbxvalorSust.setValue('', '');
                            this.arrTemp = new Array();
                            this.cbxvalorSust.setBaseParams(baseParams);
                        }
                        this.cbxvalorSust.idtipo = record.data.tipoorigen;
                    }
                }
            );

            this.cmbnivel.on(
                {
                    scope: this,
                    expand: function (combo) {
                        this.filtrarStore(combo.getValue());
                    }
                }
            );

            this.cbxvalorSust.on(
                {
                    scope: this,
                    select: function (combo, record, rowIndex) {
                        var recordGrid = this.gridSustitucion.getStore().getAt(this.gridSustitucion.rowEditing);
                        var arrReferencia = recordGrid.data.referencia.split('.');
                        var recordCmb = this.cmborigen.store.getAt(this.cmborigen.store.find('tipoorigen', this.cmborigen.getValue()));
                        if (arrReferencia.length == 5 && recordCmb.data.tipoorigen != -1) {
                            recordGrid.data.referencia = recordCmb.data.esquema + '.' + recordCmb.data.concepto + '.' + recordCmb.data.identificador + '.' + recordCmb.data.descripcion + '.' + recordCmb.data.codigo;
                        }
                        this.cbxvalorSust.idtipo = recordCmb.data.tipoorigen;
                        this.gridSustitucion.roweditor.saveBtn.enable();
                    },
                    /*show: function (combo) {
                     if (combo.getValue() == '&nbsp;') {
                     combo.setValue('');
                     }
                     },*/
                    expand: function () {
                        var recordSust = this.gridSustitucion.getStore().getAt(this.gridSustitucion.rowEditing);
                        var tree = this.cbxvalorSust.tree;
                        if (this.arrTemp.length == 0) {
                            if (recordSust.data.tipoorigen == this.cmborigen.getValue()) {
                                if (Ext.isArray(recordSust.data.valor)) {
                                    this.arrTemp = this.igualarArray(this.arrTemp, recordSust.data.valor);
                                    //Si en el momento en que se expande el combo el tree todavia se está cargando
                                    //entonces no se selecciona ningun nodo.
                                    if (!this.cbxvalorSust.tree.getLoader().isLoading()) {
                                        Ext.each(this.arrTemp, function (item) {
                                            if (tree.getNodeById(item)) {
                                                tree.getNodeById(item).getUI().toggleCheck(true);
                                            }
                                        }, this)
                                    }
                                } else {
                                    if (!Ext.isEmpty(recordSust.data.valor)) {
                                        this.arrTemp.push(recordSust.data.valor);
                                        tree.getSelectionModel().select(tree.getNodeById(recordSust.data.valor));
                                        var node = tree.getNodeById(recordSust.data.valor);
                                        if (node && !Ext.isEmpty(node.attributes.checked)) {
                                            node.getUI().toggleCheck(true);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            );

            var arrayNodosSeleccionados = new Array();
            tree.on(
                {
                    scope: this,
                    beforerender: function () {
                        //Antes de que el tree del linkedcombo se renderice y cargue completamente
                        //no es conveniente permitir que el usuario pueda comenzar a editar
                        //una fila que tiene un tipo de cuenta distinto al actual.
                        //Esto trae como consecuencia que el componente no se renderice satisfactoriamente.
                        //Por ello se supenden los eventos del grid, para que una vez que marque una fila
                        //sin que el tree se haya cargado completamente por primera vez, no se dispare
                        //el evento click del grid y por tanto no se ejecuta el metodo startEditing del roweditor.
                        this.gridSustitucion.suspendEvents();
                    },
                    load: function () {
                        //Una vez cargado el tree por primera vez se resumen los eventos.
                        this.gridSustitucion.resumeEvents();
                    },
                    checkchange: function (node, checked) {
                         //Validando si es el primer nodo seleccionado
                        if(checked == false){
                            var index = arrayNodosSeleccionados.indexOf(node.attributes.id);
                            if (index > -1) {
                                arrayNodosSeleccionados.splice(index, 1);
                            }
                        }else{
                            arrayNodosSeleccionados.push(node.attributes.id)
                        }
                        //Si es el primer nodo seleccionado que inicialize nuevamente este array => this.arrTemp
                        if(arrayNodosSeleccionados.length == 1){
                            this.arrTemp = new Array();
                        }


                        //.log('checkchange');
                        var idNode = node.attributes.id;
                        var textNode = node.attributes.text;
                        //var tree = this.cbxvalorSust.tree;
                        if (checked) {
                            if (this.arrTemp.indexOf(idNode) == -1) {
                                //console.info(this.arrTemp);
                                this.arrTemp.push(idNode);
                            }
                            if (this.arrTemp.length == 1) {
                                tree.getSelectionModel().select(tree.getNodeById(idNode));
                            }
                        } else {
                            var index = this.arrTemp.indexOf(idNode);
                            if (index != -1) {
                                this.arrTemp.splice(index, 1);
                            }
                            if (this.arrTemp.length == 1) {
                                tree.getSelectionModel().select(tree.getNodeById(this.arrTemp[0]));
                                this.cbxvalorSust.setValue(this.arrTemp[0], tree.getNodeById(this.arrTemp[0]).attributes.text);
                            }
                        }
                    }
                }
            );

            tree.getSelectionModel().on(
                {
                    scope: this,
                    selectionchange: function (sm, node) {
                        if (node && Ext.isEmpty(node.attributes.checked)) {
                            if (sm.isSelected(node)) {
                                this.arrTemp[0] = node.attributes.id;
                            }
                        }
                    }
                }
            )

            tree.getLoader().on(
                {
                    beforeload: function () {
                        //Antes de realizar cualquier peticion se verifica si
                        //actulamente el treeLoader está realizando una petición,
                        //y casi simultaneamente se realizó otra, en ese caso
                        //se aborta la petición anterior y se continua con la última
                        //realizada.
                        if (this.isLoading()) {
                            Ext.Ajax.abort(this.transId);
                            //agregarValores.call(this);
                        } else {
                            //agregarValores.call(this);
                        }

                        /*function agregarValores() {
                         var recordSust = scope.gridSustitucion.getStore().getAt(scope.gridSustitucion.rowEditing);
                         if (!Ext.isEmpty(recordSust.data.valor)) {
                         if (Ext.isArray(recordSust.data.valor)) {
                         this.baseParams.valores = Ext.encode(recordSust.data.valor);
                         scope.cbxvalorSust.setBaseParams(this.baseParams);
                         } else {
                         this.baseParams.valores = recordSust.data.valor;
                         scope.cbxvalorSust.setBaseParams(this.baseParams);
                         }
                         }
                         }*/
                    },
                    load: function () {
                        var recordSust = scope.gridSustitucion.getStore().getAt(scope.gridSustitucion.rowEditing);
                        if (recordSust.data.tipoorigen == scope.cmborigen.getValue()) {
                            var arrTemp = new Array();
                            var tree = scope.cbxvalorSust.tree;
                            var recordSust = scope.gridSustitucion.getStore().getAt(scope.gridSustitucion.rowEditing);
                            if (!Ext.isEmpty(recordSust.data.valor)) {
                                if (Ext.isArray(recordSust.data.valor)) {
                                    arrTemp = recordSust.data.valor;
                                    Ext.each(arrTemp, function (item) {
                                        var node = tree.getNodeById(item);
                                        if (node) {
                                            node.getUI().toggleCheck(true);
                                        }
                                    }, scope);
                                } else {
                                    var node = tree.getNodeById(recordSust.data.valor);
                                    if (node) {
                                        node.getUI().toggleCheck(true);
                                        tree.getSelectionModel().select(node);
                                    }
                                }
                            }
                        }
                    }
                }
            );

            this.gridSustitucion.roweditor.on({
                scope: this,
                beforeedit: function (roweditor, grid, record, rowIndex) {
                    this.arrTemp = new Array();
                    this.limpiarSeleccion();
                    grid.rowEditing = rowIndex;
                    //Se limpia el filtro aplicado inicialmente
                    this.cmbnivel.store.clearFilter();
                    //this.filtrarStore(record.data.idnivelsustitucion);
                    if (!Ext.isEmpty(record)) {
                        var store = this.cbxvalorSust.getStore();

                        var recordInst = this.crearRecord(store, record, false);
                        //Se adiciona al store la instancia creada.
                        store.insert(0, recordInst);

                        //idtipo anterior.
                        var idtipoAnt = this.cbxvalorSust.idtipo;
                        if (!Ext.isEmpty(record.data.tipoorigen)) {
                            var baseParams = {};
                            this.cbxvalorSust.idtipo = record.data.tipoorigen;
                            if (!Ext.isEmpty(record.data.referencia)) {
                                var index = this.cmborigen.store.find('tipoorigen', record.data.tipoorigen);
                                var recordCmb = this.cmborigen.store.getAt(index);
                                //datos del record seleccionado en el combo
                                baseParams = recordCmb.data;
                                //Esquema.tabla en base de datos
                                baseParams.referencia = record.data.referencia;
                                this.btnAddValorSust.hide();
                                //this.cbxvalorSust.setEditable(true);
                            } else {
                                baseParams.sustitucion = true;
                                baseParams.idsubsistema = this.idsubsistema;
                                //this.cbxvalorSust.setEditable(true);
                                this.btnAddValorSust.show();
                            }
                            //Template donde se renderiza el linkedcombo.
                            //El idtentificador del template está compuesto por la concatenación
                            // de lnkcombo y el id del linkedcombo.
                            var lnkcomboArea = document.getElementById('lnkcombolnkvalorSust');
                            //Si existe el area sobre la cual se renderiza el linkedcombo entonces se
                            // se recarga el store del mismo.
                            if (!Ext.isEmpty(lnkcomboArea) && idtipoAnt != this.cbxvalorSust.idtipo) {
                                this.cbxvalorSust.reload(false, false, baseParams);
                            } else {
                                this.cbxvalorSust.setBaseParams(baseParams);
                            }
                            this.cbxvalorSust.enable();
                        } else {
                            this.cbxvalorSust.disable();
                        }
                    }
                },
                afteredit: function (roweditor, grid, changes, record, rowIndex) {
                    //Si seleccionaron varios valores
                    if (store.getCount() == this.cmbnivel.store.getCount()) {
                        scope.gridSustitucion.btnadd.disable();
                    }
                    var recordSust = this.gridSustitucion.getStore().getAt(this.gridSustitucion.rowEditing);
                    var displayField = this.cbxvalorSust.displayField;
                    if (this.arrTemp.length != 0) {
                        if (this.arrTemp.length > 1) {
                            recordSust.data.valor = new Array();
                            recordSust.beginEdit();
                            //recordSust.data.valor = this.arrTemp;
                            recordSust.set('valor', this.arrTemp);
                            var rawValue = this.cbxvalorSust.getRawValue();
                            recordSust.set(displayField, rawValue);
                            recordSust.endEdit();
                        } else if (this.arrTemp.length == 1) {
                            recordSust.beginEdit();
                            //recordSust.data.valor = this.arrTemp[0];
                            recordSust.set('valor', this.arrTemp[0]);
                            var rawValue = this.cbxvalorSust.getRawValue();
                            //recordSust.data[displayField] = rawValue;
                            recordSust.set(displayField, rawValue);
                            recordSust.endEdit();
                        }
                        this.arrTemp = new Array();
                    } else if (Ext.isEmpty(this.cbxvalorSust.getValue())) {
                        recordSust.beginEdit();
                        recordSust.data.valor = '';
                        recordSust.data[displayField] = '';
                        recordSust.endEdit();
                    }
                    //recordSust.commit();

                    recordSust.dirty = true;
                    if (recordSust.modified) {
                        recordSust.modified[displayField] = '';
                    } else {
                        recordSust.modified = {};
                        recordSust.modified[displayField] = '';
                    }
                    recordSust.isGostRecord = false;
                },
                validation: function (roweditor, valid) {
                    if (valid) {
                        var keys = ['idnivelsustitucion', 'tipoorigen', 'valor'];
                        var changes = false;

                        Ext.each(roweditor.items.items, function (item) {
                            var field = item.column.dataIndex;
                            if (keys.indexOf(field) != -1) {
                                var oldvalue = roweditor.record.data[field];
                                var newvalue = item.getValue();
                                if (Ext.isArray(roweditor.record.data[field])) {
                                    oldvalue = roweditor.record.data['denominacion'];
                                    newvalue = item.getRawValue();
                                }
                                if (newvalue != oldvalue) {
                                    changes = true;
                                    return false;
                                }
                            }
                        }, this);

                        this.gridSustitucion.roweditor.saveBtn.setDisabled(!changes);

                        if (changes) {
                            if (this.cmborigen.getValue() == -1 && Ext.isEmpty(this.cbxvalorSust.getValue())) {
                                this.gridSustitucion.roweditor.saveBtn.disable();
                                this.cbxvalorSust.markInvalid();
                            } else {
                                this.gridSustitucion.roweditor.saveBtn.enable();
                                this.cbxvalorSust.clearInvalid();
                            }
                        }
                    }

                }
            });

            this.btnAddValorSust.on(
                {
                    scope: this,
                    click: function () {
                        var mask = new Ext.LoadMask(this.getEl());
                        mask.show();
                        var win = new Ext.Conf.ModContb.WinAddValoresContb({
                            idsubsistema: this.idsubsistema,
                            readOnly: true,
                            checked: true,
                            listeners: {
                                scope: this,
                                addElement: function (win, object) {
                                    this.cbxvalorSust.addRecord(object);
                                },
                                show: function () {
                                    mask.hide();
                                }
                            }
                        });
                        this.cbxvalorSust.collapse();
                    }
                }
            );
        }

        if (this.tfnombre) {
            this.tfnombre.on('keyup', function (field, event) {
                //this.windowValid();
                this.checkWindow();
            }, this);
        }

        if (this.tfcodigo) {
            this.tfcodigo.on('keyup', function (field, event) {
                //this.windowValid();
                this.checkWindow();
            }, this);
        }

        if (this.tfdescripcion) {
            this.tfdescripcion.on('keyup', function (field, event) {
                //this.windowValid();
                this.checkWindow();
            }, this);
        }


    },
    //Retorna la posicion del elemento dentro del array en caso de que exista
    existeId: function (id, campoId, array) {
        var cant = array.length;
        if (cant == 0) {
            return -1;
        }

        for (var i = 0; i < cant; i++) {
            if (array[i][campoId] === id) {
                return i;
            }
        }
        return -1;
    },
    //Retorna la posicion de una sustitucion dado un id
    indexSustitucion: function (record, array) {
        var index = -1;
        /*
         *Para el caso en que se haya eliminado un record
         *que aun no se haya guardado en el store.
         */
        if (!record.isGostRecord) {
            var idKey = (record.data.idsustitucion) ? 'idsustitucion' : 'idtemp';
            for (var i = 0; i < array.length; i++) {
                if (array[i][idKey] == record.data[idKey]) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    },
    //Carga el grid Sustitucion
    cargarGridSustitucion: function () {
        var record = this.gridAsiento.getSelectionModel().getSelected();
        //guarda el id (asignado por el store) del record correspondiente al asiento seleccionado en el grid Asiento
        //no corresponde el id del asiento almacenado en bd.
        var idAsiento = record.id;
        //Se obtiene el campo sustitucion del record que se encuentra seleccionado en el grid Asiento;
        var arrSustitucion = this.gridAsiento.getStore().getById(idAsiento).data.sustitucion;
        //Si el campo sustitucion esta vacio y el asiento posee un idasiento se realiza una
        // peticiÃ³n al servidor en busca de sus sustituciones
        if (arrSustitucion.length == 0 && !Ext.isEmpty(record.data.idasiento) && Ext.isEmpty(record.data.cantsustituciones)) {
            this.sustMask = new Ext.LoadMask(this.gridSustitucion.getEl(), {msg: this.idioma.msgCargandoSust});
            this.sustMask.show();
            this.gridSustitucion.getStore().load({
                scope: this,
                params: {
                    idasiento: record.data.idasiento
                },
                callback: function (records, options, success) {
                    this.gridAsiento.getStore().getById(idAsiento).json.sustitucion = new Array();
                    if (records.length != 0) {
                        var cant = records.length
                        var arrSustitucion = this.gridAsiento.getStore().getById(idAsiento).json.sustitucion;
                        for (var i = 0; i < cant; i++) {
                            /*
                             *se adiciona al arreglo el objeto clonado para evitar
                             *que se modifique el mismo, en la propiedad json del record.
                             */
                            arrSustitucion.push(this.clone(records[i].data));
                        }
                        this.gridAsiento.getStore().getById(idAsiento).data.sustitucion = arrSustitucion.slice(0);
                    }
                    this.gridAsiento.getStore().getById(idAsiento).data.cantsustituciones = records.length;
                    this.gridAsiento.getStore().getById(idAsiento).json.cantsustituciones = records.length;
                    this.filtrarStore();
                    if (this.cmbnivel.store.getCount() == 0) {
                        this.gridSustitucion.btnadd.disable();
                    } else {
                        this.gridSustitucion.btnadd.enable();
                    }
                    this.sustMask.hide();
                    this.setOriginalValue();
                }
            });

        } else {
            //Si no estÃ¡ vacio se lee directamente del campo sustitucion del store
            //del grid asiento
            this.gridSustitucion.getStore().loadData({'data': arrSustitucion});
            this.filtrarStore();
            if (this.cmbnivel.store.getCount() == 0) {
                this.gridSustitucion.btnadd.disable();
            } else {
                this.gridSustitucion.btnadd.enable();
            }
        }
    },
    //Actualiza la barra de estado del grid Asientos
    cambiarEstado: function (tipo) {
        var text = '';
        if (tipo) {
            text = 'Estado:<span style="color:green; font-weight: bold;">' + 'OK' + '</span>';
        } else {
            text = 'Estado:<span style="color:red; font-weight: bold;">' + 'ERROR' + '</span>';
        }
        this.statusBar.setStatus({
            text: text,
            clear: false
        });
    },
    //verifica si todos los campos de la ventana son validos
    windowValid: function () {
        //almacenan true o false en dependencia si los grid poseen algun campo invalido
        var gridAsientoValido = this.gridAsiento.gridValid();
        var gridSustValido = this.gridSustitucion.gridValid();

        var count = this.gridAsiento.getStore().getCount();

        if (count) {
            var store = this.gridAsiento.getStore(),
                records = store.getRange(0, count),
                check = store.getAt(0).data.creditodebito,
                validDebeHaber = false;
            records.every(function (item) {
                if (item.data.creditodebito != check) {
                    validDebeHaber = true;
                    return false;
                }
                return true;
            });
            gridAsientoValido = gridAsientoValido && validDebeHaber;
        }
        //si posee valor true entonces hay algun data incorrecto
        var noValido = !this.form.getForm().isValid() || !gridAsientoValido || count == 0 || !gridSustValido;

        return !noValido;
    },
    //Actuliza los valores de los labels lbdebe y lbhaber
    calcular: function () {
        var store = this.gridAsiento.getStore();
        var count = store.getCount();
        var debe = 0;
        var haber = 0;
        for (var i = 0; i < count; i++) {
            var porciento = store.getAt(i).data.porciento;
            if (store.getAt(i).data.creditodebito == 1) {
                debe += porciento ? porciento : 0;
            } else {
                haber += porciento ? porciento : 0;
            }
        }
        this.lbdebe.setText(debe);
        this.lbhaber.setText(haber);
        //se cambia el estado del bbar en dependencia
        //si el debe y el haber sin iguales o no.
        this.cambiarEstado(debe === haber);
        //this.windowValid();
        this.checkWindow();
    },
    //Salva los modelos contables
    salvar: function (close) {
        //Se eliminan los espacios del principio y del final de los valores
        // de los campos nombre y descripcion.
        this.tfnombre.setValue(this.tfnombre.getValue().trim());
        this.tfdescripcion.setValue(this.tfdescripcion.getValue().trim());
        if (this.form.getForm().isValid()) {
            this.keyMap.disable();
            //arreglo temporal para almacenar los asientos insertados o modificados
            var temp = [];
            var store = this.gridAsiento.getStore();
            var cambios = true;
            //Se guardan los valores del form
            var form = this.form.getForm();
            var params = form.getValues();
            //Se guardan el idsubsistema
            params.idsubsistema = this.idsubsistema;

            //Si se esta modificando envia los elementos modificados y eliminados
            //para restrigir que asientos o sustituciones seran eliminados y cuales
            //modificados
            if (this.action === 'modificar') {
                params.sustEliminadas = Ext.encode(this.arrEliminados['sustituciones'].length != 0 ? this.arrEliminados['sustituciones'] : []);
                params.asientosEliminados = Ext.encode(this.arrEliminados['asientos'].length != 0 ? this.arrEliminados['asientos'] : []);
            }
            var cant = store.getCount();
            //Se recorren los records del store del grid asiento
            for (var i = 0; i < cant; i++) {
                temp.push(store.getAt(i).data);
            }
            params.asientos = Ext.encode(temp);

            this.onloadMessageBox(this.idioma.msgWaitEspera, this.idioma.msgWaitGuardando);

            Ext.Ajax.request({
                url: this.baseUrl + 'add',
                params: params,
                scope: this,
                callback: function (options, success, response) {
                    Ext.MessageBox.hide();
                    var response = Ext.decode(response.responseText);
                    if (response.code == 5) {
                        mostrarMensaje(1, this.idioma.msgExisteCod);
                        this.keyMap.enable();
                    } else if (response.code == 6) {
                        mostrarMensaje(1, this.idioma.msgExisteNomb);
                        this.keyMap.enable();
                    } else if (response.code == 1) {
                        if (this.action === 'modificar') {
                            mostrarMensaje(1, this.idioma.msgModificado);
                        } else {
                            mostrarMensaje(1, this.idioma.msgInsertado);
                        }
                        this.fireEvent('addElement');
                        if (close) {
                            this.destroy();
                        } else {
                            this.keyMap.enable();
                            this.form.getForm().reset();
                            this.gridAsiento.getStore().removeAll();
                            this.gridSustitucion.getStore().removeAll();
                            this.pSustitucion.collapse();
                            this.fireEvent('windowValid', false);
                        }
                    }
                }
            });
        } else {
            mostrarMensaje(1, this.idioma.verificarCampos);
        }


    },
    //Función utilizada en el renderer de las columnas de los grid editables
    mostrarValor: function (grid, value, rowIndex, colIndex, record) {
        var editor = grid.getColumnModel().getCellEditor(colIndex, rowIndex);
        if (!Ext.isEmpty(editor)) {
            var field = editor.field;
            var store = field.store;
            var valuefield = field.valueField;
            var displayfield = field.displayField;
        }

        if (record.data.tipocuenta == 1 && colIndex == 1) {
            store = this.stcamposctb;
        } else if (record.data.tipocuenta == 2 && colIndex == 1) {
            store = this.stcuenta;
        } else {
            if (field.xtype === 'linkedcombo') {
                store = field.getStore();
            }
        }
        if (value && store) {
            var index = store.find(valuefield, value);
            if (index != -1) {
                return store.getAt(index).data[displayfield];
            }
        }

        return value;
    },
    //Añade uno o varios javaScript al Dom
    loadJs: function (arrJs, callbackFn, scope) {
        if (Ext.isArray(arrJs)) {
            var total = arrJs.length;
            var cont = 0;
            Ext.each(arrJs, function (arr) {
                if (!document.getElementById(arr[1])) {
                    var tagScript = document.createElement("script");
                    tagScript.type = 'text/javascript';
                    tagScript.id = arr[1];
                    tagScript.src = arr[0] + '.js';
                    tagScript.onload = function () {
                        cont++;
                        if (total == cont && typeof callbackFn === 'function') {
                            callbackFn.call(scope);
                        }
                    };
                    Ext.DomQuery.selectNode("body").appendChild(tagScript);
                } else {
                    cont++;
                    if (total == cont && typeof callbackFn === 'function') {
                        callbackFn.call(scope);
                    }
                }
            });
        }
    },
    //Filtra el store de los niveles de análisis
    filtrarStore: function (idnivelsustitucion) {
        //this.cmbnivel.store.clearFilter();
        var arrNiveles = [];
        Ext.each(this.gridSustitucion.getStore().data.items, function (record) {
            if (!Ext.isEmpty(record.data.idnivelsustitucion)) {
                arrNiveles.push(record.data.idnivelsustitucion);
            }
        });
        this.cmbnivel.store.filterBy(function (record, id) {
            var index = arrNiveles.indexOf(record.data.idnivelsustitucion);
            if (!Ext.isEmpty(idnivelsustitucion) && record.data.idnivelsustitucion == idnivelsustitucion) {
                return true;
            } else if (index == -1) {
                return true;
            }

            return false;
        }, this);
    },
    //Crea un record vacio o con datos para los linkedcombos dado un store y el record del grid
    //al que pertenecen.
    crearRecord: function (store, record, vacio) {
        var arrFields = [];
        var obj = {}
        Ext.each(store.fields.keys, function (key) {
            //Se crea un arreglo con los campos del record.
            arrFields.push({name: key});
            //Se crea un objeto con los valores del record.
            if (record.data[key] && !vacio) {
                obj[key] = record.data[key];
            } else {
                obj[key] = '';
            }
        });
        //Se crea el objeto Record con los campos definidos.
        var Record = Ext.data.Record.create(arrFields);
        //Se crea una instancia del objeto Record con los valores.
        var recordInst = new Record(obj);
        return recordInst;
    },
    //Retorna true si el record pasado por parametros es igual a otro record
    //presente en el store.
    existeRecord: function (store, record, changes, cm) {
        var columns = cm.columns;
        var existe = false;
        // console.log('record', record)
        // console.log('changes', changes)
        Ext.each(store.data.items, function (item) {
            if (record.id != item.id) {
                var cont = 0;
                Ext.each(columns, function (column) {
                    var key = column.dataIndex;
                    if (Ext.isEmpty(column.actions)) {
                        // console.log(key, item.data[key] == record.data[key], item.data[key] == changes[key], record.data[key], item.data[key], changes[key], !changes[key] && item.data[key] == record.data[key])
                        // if (item.data[key] == record.data[key] || item.data[key] == changes[key]) { //linea original
                        if (item.data[key] == changes[key] || (!changes[key] && item.data[key] == record.data[key])) {
                            cont++;
                        }
                    }
                });
                if (cont == columns.length - 1) {
                    existe = true;
                    return false;
                }
            }
        }, this);
        return existe;
    },
    //valida que el record no exista en el store.
    validar: function (grid, record, changes, msg) {
        /*for (var k in changes) {
         record.data[k] = changes[k];
         }*/
        var existe = this.existeRecord(grid.getStore(), record, changes, grid.getColumnModel());
        if (existe) {
            mostrarMensaje(1, msg);
            return false;
        }
    },
    //Busca un nodo en el arbol y retorna el valor de su atributo text
    buscarNodo: function (rootNode, idNode) {
        var textNode = '';
        rootNode.eachChild(function (node) {
            if (node.attributes.id == idNode) {
                textNode = node.attributes.text;
                return false;
            } else {
                this.buscarNodo(node, idNode);
            }
        }, this);
    },
    //Asigna al nuevo array los valores del antiguo y devuelve el primero
    igualarArray: function (newArray, oldArray) {
        newArray = new Array();
        for (k in oldArray) {
            newArray[k] = oldArray[k];
        }
        return newArray;
    },
    //clona un objeto y devuelve la copia
    clone: function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        var temp = obj.constructor();
        for (var key in obj) {
            temp[key] = this.clone(obj[key]);
        }

        return temp;
    },
    //limpia la selecciones y desmarca los nodos del arbol
    limpiarSeleccion: function () {
        var tree = this.cbxvalorSust.tree;
        if (tree && tree.rendered) {
            tree.getRootNode().cascade(function () {
                this.getUI().toggleCheck(false);
            });
            tree.getSelectionModel().clearSelections();
        }
    },
    //Actualiza la propiedad newvalues de esta clase
    updatevalues: function () {
        params = this.form.getForm().getValues();
        this.newvalues.nombre = params.nombre;
        this.newvalues.tipo = params.tipo;
        if (params.tipo == 1) {
            var clasificador = this.getClasificador();
            this.newvalues.referencia = clasificador.data.clase + '.' + params.campo;
        } else if (params.tipo == 3) {
            this.newvalues.referencia = params.clase + '.' + params.funcionalidad;
        } else if (params.tipo == 5) {
            if (this.gpDinamico) {
                var idProperty = this.gpDinamico.getStore().getIdProperty();
                if (this.gpDinamico.getSelectionModel().hasSelection()) {
                    this.newvalues.referencia = params.clase + '.' + this.gpDinamico.getSelectionModel().getSelected().data[idProperty];
                }
            }
        } else if (params.tipo == 6) {
            this.newvalues.referencia = this.staticVar.getValue();
        }
    },
    //Habilita o deshabilita los botones de la ventana.
    checkWindow: function () {
        if (this.windowValid()) {
            if (this.action == 'modificar') {
                var valid = this.changeValue();
                this.fireEvent('windowValid', valid);
            } else {
                this.fireEvent('windowValid', true);
            }
        } else {
            this.fireEvent('windowValid', false);
        }
    },
    //Verifica si se realizaron cambios en los datos del formulario del grid.
    changeValue: function () {
        var newvalue = this.form.getForm().getValues(),
            oldvalue = Ext.getCmp('grid' + this.idsubsistema).getSelectionModel().getSelected().data,
            store = this.gridAsiento.getStore(),
            records = store.getRange(0, store.getCount() - 1),
            temp = new Array();
        for (k in newvalue) {
            //Para el caso que tenga valor nulo
            oldvalue[k] = Ext.isEmpty(oldvalue[k]) ? '' : oldvalue[k];
            if (oldvalue[k].toString() != newvalue[k].toString()) {
                return true;
            }
        }

        Ext.each(records, function (record) {
            temp.push(record.data);
        });
        temp = Ext.encode(temp);
        if(temp != this.gridAsiento.originalValue){
            return true;
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
    },
    //Establece el valor original de gridAsiento para posteriormente verfificar los cambios
    setOriginalValue: function () {
        var temp = new Array(),
            grid = this.gridAsiento,
            store = grid.getStore(),
            records = store.getRange(0, store.getCount() - 1);
        Ext.each(records, function (record) {
            temp.push(record.data);
        });
        grid.originalValue = Ext.encode(temp);
    }
});

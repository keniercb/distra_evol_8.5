Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.gpOrdenarPor = Ext.extend(Ext.grid.EditorGridPanel, {
    stripeRows: true,
    /*viewConfig: {
        forceFit: true
    },*/
    width: 230,
    clicksToEdit: 1,
    enableDrop: true,

    initComponent: function() {
        var self = this;
        this.autoExpandColumn = 'denom'+this.id,
        this.title = self.idioma.lbTitWinOrdenarPor;

//        var btnAceptar = new Ext.Button({
//            iconCls: 'btn',
//            icon: perfil.dirImg + 'aceptar.png',
//            text: self.idioma.lbBtnAceptar,
//            tooltip: self.idioma.ttpBtnAceptar,
//            handler: recogerDatos
//        });

        var btnSubir = new Ext.Button({
            disabled: true,
            iconCls: 'arriba',
            tooltip: self.idioma.ttpBtnSubir,
            handler: subirCampo
        });
        var btnBajar = new Ext.Button({
            disabled: true,
            iconCls: 'abajo',
            tooltip: self.idioma.ttpBtnBajar,
            handler: bajarCampo
        });
        var btnEliminar = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: self.idioma.lbBtnEliminar,
            tooltip: self.idioma.ttpBtnEliminarCampo,
            handler: eliminarCampoOrdenar
        });

        this.keys = [{
                key: 46,
                fn: eliminarCampoOrdenar
            }
        ];

        var stOrden = new Ext.data.SimpleStore({
            fields: ['orden']
        });

        var datosOrden = [['ASC'], ['DESC']];
        stOrden.loadData(datosOrden);
        var cbOrden = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
            lazyRender: true,
            width: 100,
            store: stOrden,
            displayField: 'orden',
            valueField: 'orden',
            mode: 'local',
            forceSelection: true,
            editable: false,
            allowBlank: false,
            selectOnFocus: true
        });

        this.loadMask = {
            msg: self.idioma.lbGridLoadMask
        };

        this.store = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'denom'
                },
                {
                    name: 'idcampo'
                },
                {
                    name: 'orden' //ASC o DESC
                }
            ]
        });

        this.columns = [new Ext.grid.RowNumberer(),
            {
                id: 'denom' + this.id,
                header: self.idioma.cmCampo,
                sortable: false,
                dataIndex: 'denom',
                menuDisabled: true,
                width: 200
            }, {
                header: self.idioma.cmOrden,
                sortable: false,
                dataIndex: 'orden',
                menuDisabled: true,
                width: 60,
                editor: cbOrden
            }
        ];

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                beforerowselect: function(S, rowIndex, keepExisting, rec) {
                    btnEliminar.enable();
                    if (rowIndex == 0) {
                        btnSubir.disable();
                    } else {
                        btnSubir.enable();
                    }
                    if (rowIndex + 1 == self.getStore().getCount()) {
                        btnBajar.disable();
                    } else {
                        btnBajar.enable();
                    }
                }
            }
        });

        function subirCampo() {
            var recordSeleccionado = self.getSelectionModel().getSelected();
            var pos = self.getStore().indexOf(recordSeleccionado);
            if (pos > 0) {
                var recordAux = recordSeleccionado;
                self.getStore().remove(recordSeleccionado);
                self.getStore().insert(pos - 1, recordAux);
                self.getSelectionModel().selectPrevious(false);
                self.getColumnModel().fireEvent('columnmoved');
            }
        }

        function bajarCampo() {
            var recordSeleccionado = self.getSelectionModel().getSelected();
            var pos = self.getStore().indexOf(recordSeleccionado);
            if (pos < self.getStore().getCount() - 1) {
                var recordAux = recordSeleccionado;
                self.getStore().remove(recordSeleccionado);
                self.getStore().insert(pos + 1, recordAux);
                self.getSelectionModel().selectNext(false);
                self.getColumnModel().fireEvent('columnmoved');
            }
        }

        function recogerDatos() {
            self.fireEvent('camposaordenar', self.stOrdenarPor);
            self.hide();
        }

        function eliminarCampoOrdenar() {
            if (self.getSelectionModel().hasSelection()) {
                self.getStore().remove(self.getSelectionModel().getSelected());
                self.getColumnModel().fireEvent('columnmoved');
                btnBajar.disable();
                btnSubir.disable();
                btnEliminar.disable();
            }
        }

        this.tbar = [btnEliminar, '->', btnSubir, '-', btnBajar, ' '];
        Ext.components.CmpReccomplejas.gpOrdenarPor.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_WinOrdenarPor', Ext.components.CmpReccomplejas.gpOrdenarPor);
Ext.components.CmpReccomplejas.ComboBoxNomenclador = Ext.extend(Ext.form.ComboBox, {
    modal: true,
    closeAction: 'destroy',
    displayField: 'denom',
    hiddenName: 'idvalor',
    valueField: 'idvalor',
    tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
    typeAhead: true,
    mode: 'local',
    triggerAction: 'all',
    selectOnFocus: true,
    width: 280,
    initComponent: function() {
        var self = this;
        this.emptyText = self.idioma.lbCriterioBuscarDate;
        self.store = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/cargarValoresNomenclador',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idvalor'
                },
                {
                    name: 'denom'
                }
            ])
        });
        self.store.load({
            params: {
                idconfiguracion: self.idconfiguracion,
                idcampo: self.idcampo,
                tipo: self.tipo
            }
        });
        this.on('blur', function(cb, nVal, oVal) {
            if (this.store instanceof Ext.data.Store) {
                if (Ext.isEmpty(this.getValue())) {
                    this.clearValue();
                }
            }
        })
        Ext.components.CmpReccomplejas.ComboBoxNomenclador.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_ComboBoxNomenclador', Ext.components.CmpReccomplejas.ComboBoxNomenclador);
Ext.components.CmpReccomplejas.PanelConfiguracion = Ext.extend(Ext.Panel, {
    region: 'center',
    layout: 'border',
    iconCls: 'conf_reporte',
    initComponent: function() {
        this.idioma = Ext.idioma.es.cmpreccomplejas.reccomplejas.etiquetas;
        var self = this;
        var recordCondiciones = null; //Almacena la fila del grid de condiciones seleccionada
        var winOperacion = null;
        //Botones
        var btnAyuda = new Ext.Button({
            iconCls: 'ayuda',
            text: self.idioma.lbBtnAyuda,
            tooltip: self.idioma.ttpBtnAyuda,
            handler: mostrarAyuda,
            id: 'btnAyuda' + self.id,
            nextTab: 'btnAdicionarCond' + self.id,
            prevTab: 'btnGenerar' + self.id
        });
        var btnGenerar = new Ext.Button({
            iconCls: 'buscar',
            text: self.idioma.lbBtnBuscar,
            tooltip: self.idioma.ttpBtnBuscar,
            handler: function() {
                self.generarReporte();
            },
            id: 'btnGenerar' + self.id
        });
        var btnMapa = new Ext.Button({
            text: self.idioma.lbBtnMapa,
            iconCls: 'informe',
            tooltip: self.idioma.ttpBtnMapa,
            hidden: !self.useMap,
            handler: function() {
                if (self.validarCondiciones(false) === false) {
                    self.parent.setActiveTab(1);
                    return;
                } else {
                    var win = new Ext.components.CmpReccomplejas.WinSelectFieldsMap({
                        idioma: self.idioma,
                        parent: self,
                        data: self.getFieldsToShow()
                    });
                    win.show();
                }
            }
        });

       /* var btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: self.idioma.lbBtnLimpiar,
            tooltip: self.idioma.ttpBtnLimpiar,
            handler: limpiarTodo
        });*/

        var btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: self.idioma.lbBtnLimpiar,
            tooltip: self.idioma.ttpBtnLimpiar,
            menu: {
                items: [
                    {
                        iconCls: 'limpiar',
                        text: 'Limpiar Operación',
                        handler:limpiarOperacion

                    },{
                        text: 'Limpiar condiciones',
                        iconCls: 'limpiar',
                        handler: limpiarCondicion


                    },
                    {
                        text: 'Limpiar todo',
                        iconCls: 'limpiar',
                        handler: limpiarTodo

                    }

                ]
            }

        });

        var btnAdicionarCond = new Ext.Button({
            hidden:true,
            iconCls: 'adicionar',
            text: self.idioma.lbBtnAdicionar,
            tooltip: self.idioma.ttpBtnAddCondicion,
            handler: function() {
                winCondiciones.show();
            },
            id: 'btnAdicionarCond' + self.id,
            prevTab: 'btnAyuda' + self.id
        });
        var btnEliminarCond = new Ext.Button({
            disabled: true,
            iconCls: 'eliminar',
            text: self.idioma.lbBtnEliminar,
            tooltip: self.idioma.ttpBtnElimCondicion,
            handler: eliminarCondicion
        });
        var btnRecCantidad = new Ext.Action({
            iconCls: 'cargocivil',
            text: self.idioma.lbBtnRecCantidad,
            tooltip: self.idioma.ttpBtnRecCantidad,
            handler: fnShowWinOperacion
        });
        var btnOperaciones = new Ext.Button({
            hidden: self.hideBtnOperCant,
            iconCls: 'calcular',
            text: self.idioma.lbtnOperaciones,
            menu: [btnRecCantidad],
            tooltip: self.idioma.ttpBtnOperCant
        });
        var btnParentesisAbierto = new Ext.Button({
            text: '<b>&nbsp;(&nbsp;</b>',
            disabled: true,
            tooltip: self.idioma.ttpBtnParAbierto,
            handler: adicionarParAbierto
        });
        var btnParentesisCerrado = new Ext.Button({
            text: '<b>&nbsp;)&nbsp;</b>',
            disabled: true,
            tooltip: self.idioma.ttpBtnParCerrado,
            handler: adicionarParCerrado
        });
        var btnSubirCond = new Ext.Button({
            disabled: true,
            iconCls: 'arriba',
            tooltip: self.idioma.ttpBtnSubirCond,
            handler: subirCondicion,
            id: 'btnSubirCond' + self.id
        });
        var btnBajarCond = new Ext.Button({
            disabled: true,
            iconCls: 'abajo',
            tooltip: self.idioma.ttpBtnBajarCond,
            handler: bajarCondicion,
            id: 'btnBajarCond' + self.id,
            nextTab: 'cbReportes' + self.id,
            prevTab: 'btnSubirCond' + self.id
        });
        var btnValidarCond = new Ext.Button({
            disabled: true,
            iconCls: 'validar',
            text: self.idioma.lbBtnValidar,
            tooltip: self.idioma.ttpBtnValidar,
            handler: function() {
                self.validarCondiciones(true);
            }
        });
        var btnGuardarConf = new Ext.Button({
            iconCls: 'guardar',
            text: self.idioma.lbBtnGuardar,
            tooltip: self.idioma.ttpBtnGuardarConf,
            handler: showWinGuardarBusqueda
        });
        var btnGestionarBusquedas = new Ext.Button({
            iconCls: 'agrupacion',
            text: self.idioma.lbBtnGestionarBusquedas,
            tooltip: self.idioma.ttpBtnGestionarBusquedas,
            handler: showWinGestBusquedas
        });
        //Variable donde voy a almacenar el campo al cual le voy a hacer la operación.
       // this.arrOperacion = {};
        this.arrOperacion = new Array();
        //Redefinir keymap
        Ext.override(Ext.KeyMap, {
            addBinding: function(config) {
                if (Ext.isArray(config)) {
                    for (var i = 0, len = config.length; i < len; i++) {
                        this.addBinding(config[i]);
                    }
                    return;
                }
                var keyCode = config.key,
                        shift = config.shift,
                        ctrl = config.ctrl,
                        alt = config.alt,
                        fn = config.fn || config.handler,
                        scope = config.scope;
                if (config.stopEvent) {
                    this.stopEvent = config.stopEvent;
                }
                if (typeof keyCode == "string") {
                    var ks = [];
                    var keyString = keyCode.toUpperCase();
                    for (var j = 0, len = keyString.length; j < len; j++) {
                        ks.push(keyString.charCodeAt(j));
                    }
                    keyCode = ks;
                }
                var keyArray = Ext.isArray(keyCode);
                var handler = function(e) {
                    if (((shift === undefined) || (shift === e.shiftKey)) &&
                            ((ctrl === undefined) || (ctrl === e.ctrlKey)) &&
                            ((alt === undefined) || (alt === e.altKey))) {
                        var k = e.getKey();
                        if (keyArray) {
                            for (var i = 0, len = keyCode.length; i < len; i++) {
                                if (keyCode[i] == k) {
                                    if (this.stopEvent) {
                                        e.stopEvent();
                                    }
                                    fn.call(scope || window, k, e);
                                    return;
                                }
                            }
                        } else {
                            if (k == keyCode) {
                                if (this.stopEvent) {
                                    e.stopEvent();
                                }
                                fn.call(scope || window, k, e);
                            }
                        }
                    }
                };
                this.bindings.push(handler);
            }
        });
        this.keys = [{
                key: 'b',
                alt: true,
                fn: function() {
                    self.generarReporte();
                }
            }, {
                key: 'l',
                alt: true,
                fn: limpiarTodo
            }, {
                key: 'h',
                alt: true,
                fn: mostrarAyuda
            }, {
                key: 'g',
                ctrl: true,
                alt: true,
                fn: showWinGestBusquedas
            }, {
                key: 'g',
                alt: true,
                ctrl: false,
                fn: showWinGuardarBusqueda
            }, {
                key: 'i',
                alt: true,
                fn: function() {
                    btnAdicionarCond.handler();
                }
            }, {
                key: 46,
                fn: eliminarCondicion
            }, {
                key: 'k',
                alt: true,
                fn: function() {
                    btnValidarCond.handler();
                }
            }, {
                key: 'o',
                alt: true,
                fn: function() {
                    if (!btnMapa.hidden) {
                        btnMapa.handler();
                    }
                }
            }, {
                key: '1',
                alt: true,
                fn: function() {
                    self.parent.setActiveTab(0);
                }
            }
        ];
        //Diccionario de condiciones
        var datosCondicionFecha = [['=', 'Igual'], ['<>', 'Distinto'], ['>', 'Posterior a'], ['<', 'Anterior a'], ['>=', 'Posterior o igual a'], ['<=', 'Anterior o igual a'], ['IS NULL', 'Es nulo'], ['IS NOT NULL', 'No nulo']];
        var datosCondicionTexto = [['=', 'Igual'], ['<>', 'Distinto'], ['%x%', 'Contiene'], ['x%', 'Comienza con'], ['%x', 'Termina con'],['IS NULL', 'Es nulo'], ['IS NOT NULL', 'No nulo']];
        var datosCondicionNomenclador = [['=', 'Igual'], ['<>', 'Distinto']];
        var datosCondicionArbolEspecial = [['=', 'Igual'], ['<>', 'Distinto'], ['IN', 'Contenido en'], ['NOT IN', 'No contenido en']];
        var datosCondicionArbol = [['=', 'Igual'], ['<>', 'Distinto'], ['IN', 'Contenido en'], ['NOT IN', 'No contenido en']];
        var datosCondicionNumero = [['=', 'Igual'], ['<>', 'Distinto'], ['>', 'Posterior a'], ['<', 'Anterior a'], ['>=', 'Posterior o igual a'], ['<=', 'Anterior o igual a'], ['IS NULL', 'Es nulo'], ['IS NOT NULL', 'No nulo']];
        var stReportes = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/getBusquedas',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [{
                    name: 'idbusqueda'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'codigo'
                }, {
                    name: 'descripcion'
                }, {
                    name: 'configuracion'
                }, {
                    name: 'pordefecto'
                }]),
            listeners: {
                load: function(st, records, options) {
                    Ext.each(records, function(record) {
                        if (record.get('pordefecto') == 1) {
                            var datos = Ext.decode(record.get('configuracion'));
                            self.reconfigurarBusqueda(datos.selectores, datos.condiciones, datos.orden, datos.operacion);
                            return;
                        }
                    }, this);
                }
            }
        });

        var cbReportes = new Ext.form.ComboBox({
            id: 'cbReportes' + self.id,
            store: stReportes,
            emptyText: self.idioma.lbCriterioBuscarDate,
            displayField: 'denominacion',
            hiddenName: 'idbusqueda',
            valueField: 'idbusqueda',
            tpl: '<tpl for="."><div ext:qtip="<b>Descripción: </b><p>{descripcion}</p> " class="x-combo-list-item">{denominacion}</div></tpl>',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            width: 280,
            listeners: {
                select: function(combo, record, index) {
                    self.cargarConfiguracionBusqueda(record.get('idbusqueda'));
                }
            },
            prevTab: 'btnBajarCond' + self.id
        });
        //EDITOR COMBO DEL CAMPO LOGICO
        var stLogico = new Ext.data.SimpleStore({
            fields: [{
                    name: 'idlogico'
                }, {
                    name: 'denominacion'
                }]
        });
        var datosLogico = [['and', 'Y'], ['or', 'O']];
        stLogico.loadData(datosLogico);
        var comboLogico = new Ext.form.ComboBox({
            store: stLogico,
            displayField: 'denominacion',
            hiddenName: 'idlogico',
            valueField: 'denominacion',
            mode: 'local',
            typeAhead: true,
            triggerAction: 'all',
            listClass: 'x-combo-list-small',
            forceSelection: true,
            selectOnFocus: true,
            listWidth:50,
            msgTarget: 'qtip',
            listeners: {
                select: function(combo, record, index) {
                    var filaSel = self.smCondiciones.getSelected();
                    var pos = stCondiciones.indexOf(filaSel);
                    filaSel.set('logico', record.get('idlogico'));
                    if (self.gpCondiciones.getStore().getCount() == 1) {
                        self.gpCondiciones.stopEditing();
                        filaSel.set('logico', '');
                        filaSel.set('mostrarlogico', '');
                        Ext.MessageBox.show({
                            title: self.idioma.titleAlerta,
                            msg: self.idioma.MsgDelFail,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return;
                    }
                    if (filaSel.get('tipo') == 'pabierto') {
                        self.gpCondiciones.stopEditing();
                        filaSel.set('logico', '');
                        filaSel.set('mostrarlogico', '');
                        Ext.MessageBox.show({
                            title: self.idioma.titleAlerta,
                            msg: self.idioma.MsgAlert,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        return;
                    }
                    if (pos == self.gpCondiciones.getStore().getCount() - 1) {
                        Ext.MessageBox.show({
                            title: self.idioma.titleAlerta,
                            msg: self.idioma.MsgAddFail,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING
                        });
                        self.gpCondiciones.stopEditing();
                        filaSel.set('logico', '');
                        filaSel.set('mostrarlogico', '');
                        return;
                    }
                }
            }
        });
        //Combo para las condiciones de los filtros
        var stCondicion = new Ext.data.SimpleStore({
            fields: [{
                    name: 'condicion'
                }, {
                    name: 'condiciontext'
                }]
        });
        var cbCondicion = new Ext.form.ComboBox({
            store: stCondicion,
            modal: true,
            closeAction: 'destroy',
            displayField: 'condiciontext',
            hiddenName: 'condicion',
            tpl: '<tpl for="."><div ext:qtip="{condiciontext}</p> " class="x-combo-list-item">{condiciontext}</div></tpl>',
            valueField: 'condiciontext',
            mode: 'local',
            allowBlank: false,
            typeAhead: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '90%',
            listeners: {
                select: function(combo, record, index) {
                    self.smCondiciones.getSelected().set('condicion', record.get('condicion'));
                }
            }
        });
        //Función que crea el árbol tantp para los selectores como para las condiciones
        var crearArbolCampos = function(url, title, width, tipo) {
            this.tpArbolCampos = new Ext.tree.TreePanel({
                margins: '5 0 5 5',
                cmargins: '5 5 5 5',
                title: title, //self.idioma.lbTitTreeSelectores,
                region: 'west',
                split: true,
                collapsible: true,
                animate: true,
                rootVisible: false,
                autoScroll: true,
                containerScroll: true,
                width: width,
                layout: 'fit',
                autoShow: true,
                selModel: new Ext.tree.DefaultSelectionModel(),
                loader: new Ext.tree.TreeLoader({
                    baseParams: {
                        idconfiguracion: self.idconfiguracion,
                        tipo: tipo
                    },
                    dataUrl: url
                }),
                root: new Ext.tree.AsyncTreeNode({
                    text: 'Campos'
                })
            });
            return this.tpArbolCampos;
        };
        //Arbol de selectores
        this.tpSelectores =  new Ext.tree.TreePanel({
            margins: '5 0 5 5',
            cmargins: '5 5 5 5',
            title: self.idioma.lbTitTpSelectores,
            region: 'west',
            split: true,
            collapsible: true,
            animate: true,
            rootVisible: false,
            autoScroll: true,
            containerScroll: true,
            width: '25%',
            layout: 'fit',
            autoShow: true,
            ddGroup: 'tpSelectores',
            enableDrag: true,
            selModel: new Ext.tree.DefaultSelectionModel(),
            loader: new Ext.tree.TreeLoader({
                baseParams: {
                    idconfiguracion: self.idconfiguracion,
                    tipo: 'campos'
                },
                dataUrl: '/reccomplejas/index.php/reccomplejas/cargarselectores'
            }),
            root: new Ext.tree.AsyncTreeNode({
                text: 'Campos'
            }),
            listeners:{
                checkchange:  function(node, checked){
                    if(!checked){
                        var st = self.gpOrderBy.getStore();
                        var index = st.find('idcampo', node.attributes.idcampo);
                        if(index != -1){
                            st.remove(st.getAt(index));
                        }
                    }
                }
            }
        });
        //Arbol de condiciones
        var tpCondiciones = crearArbolCampos('/reccomplejas/index.php/reccomplejas/cargarselectores', self.idioma.lbTitTpCondiciones, '45%', self.idioma.lbTitTpCondiciones);
        tpCondiciones.addListener('checkchange', function(node, chequeado) {
            tpCondiciones.suspendEvents();
            if (chequeado) {
                var rAddFila = new rPlantillaAddCond({
                    idcampo: node.attributes.idcampo,
                    campo: node.attributes.campo,
                    denominacion: node.text,
                    tipo: node.attributes.tipodato,
                    expresionregular: node.attributes.expresionregular,
                    cantidad: 1
                });
                stAddCondiciones.add(rAddFila);
            } else {
                var cantGridAdd = stAddCondiciones.getCount();
                for (var i = 0; i < cantGridAdd; i++) {
                    if (stAddCondiciones.getAt(i).get('idcampo') == node.attributes.idcampo) {
                        stAddCondiciones.remove(stAddCondiciones.getAt(i));
                        break;
                    }
                }
            }
            egpAddCondiciones.doLayout();
            tpCondiciones.resumeEvents();
        });
        //PLANTILLA PARA ADICIONAR EN EL GRID  DE CONDICIONES
        var rPlantillaCond = new Ext.data.Record.create({
            name: 'denominacion'
        },
        {
            name: 'condicionmostrar'
        },
        {
            name: 'valormostrar'
        },
        {
            name: 'logico'
        },
        {
            name: 'mostrarlogico'
        },
        {
            name: 'tipo'
        },
        {
            name: 'condicion'
        },
        {
            name: 'valor'
        },
        {
            name: 'idcampo'
        });
        //Store GridPanel de las condiciones
        var stCondiciones = new Ext.data.SimpleStore({
            fields: [{
                    name: 'denominacion'
                }, {
                    name: 'condicionmostrar'
                }, {
                    name: 'valormostrar'
                }, {
                    name: 'logico'
                }, {
                    name: 'mostrarlogico'
                }, {
                    name: 'tipo'
                }, {
                    name: 'condicion'
                }, {
                    name: 'valor'
                }, {
                    name: 'idcampo'
                }
            ],
            listeners: {
                remove: function(st, record, index) {
                    btnBajarCond.disable();
                    btnSubirCond.disable();
                    btnParentesisAbierto.disable();
                    btnParentesisCerrado.disable();
                    if (st.getCount() == 0) {
                        btnValidarCond.disable();
                    }
                    self.updateConditionCount(st.getCount());
                },
                add: function(st, records, index) {
                    btnValidarCond.enable();
                    self.updateConditionCount(st.getCount());
                },
                clear: function(st){
                    self.updateConditionCount(st.getCount());
                }
            }
        });

        this.updateConditionCount = function(cant){
            Ext.fly(tfCantConditions.getEl()).update('Cantidad de elementos: '+cant);
        }

        this.smCondiciones = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                beforerowselect: function(S, rowIndex, keepExisting, rec) {
                    btnEliminarCond.enable();
                    recordCondiciones = rec;
                    btnParentesisAbierto.enable();
                    btnParentesisCerrado.enable();
                    if (rowIndex == 0) {
                        btnSubirCond.disable();
                    } else {
                        btnSubirCond.enable();
                    }
                    if (rowIndex + 1 == stCondiciones.getCount()) {
                        btnBajarCond.disable();
                    } else {
                        btnBajarCond.enable();
                    }
                }
            }
        });
        var cmCondiciones = [
            {
                id: 'denominacion' + self.id,
                header: self.idioma.cmCampo,
                width: 250,
                sortable: false,
                dataIndex: 'denominacion',
                menuDisabled: true
            },
            {
                header: self.idioma.cmCondicion,
                width: 120,
                sortable: false,
                dataIndex: 'condicionmostrar',
                menuDisabled: true,
                editor: cbCondicion
            },
            {
                header: self.idioma.cmValor,
                width: 230,
                sortable: false,
                dataIndex: 'valormostrar',
                menuDisabled: true,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            },
            {
                header: self.idioma.cmLogico,
                width: 50,
                sortable: false,
                dataIndex: 'mostrarlogico',
                menuDisabled: true,
                editor: comboLogico
            }
        ];

        function addRecord(node){
            var cantCond = stCondiciones.getCount();
            if (cantCond > 0) {//Si hay al menos una condicion insertada, entonces busco la ultima y le pongo el valor del logico
                var temp = stCondiciones.getAt(cantCond - 1);
                temp.set('logico', 'and');
                temp.set('mostrarlogico', 'Y');
            }
            rAddFilaCond = new rPlantillaCond({
                denominacion: node.attributes.denominacion,
                condicionmostrar: '',
                valormostrar: '',
                logico: '',
                mostrarlogico: '',
                tipo:  node.attributes.tipodato,
                condicion: '',
                valor: '',
                idcampo: node.attributes.idcampo
            });
            stCondiciones.add(rAddFilaCond);
            btnValidarCond.enable();
            self.gpCondiciones.doLayout();
        }

        var tfCantConditions = new Ext.Toolbar.TextItem('Cantidad de elementos: 0');

        //GridPanel de las condiciones
        this.gpCondiciones = new Ext.grid.EditorGridPanel({
            store: stCondiciones,
            sm: self.smCondiciones,
            clicksToEdit: 1,
            columns: cmCondiciones,
            autoExpandColumn: 'denominacion' + self.id,
            stripeRows: true,
            height: 500,
            width: '100%',
            region: 'center',
            layout: 'fit',
            title: self.idioma.lbTitGpCondiciones,
            enableDrop: true,
            margins: '5 0 5 0',
            tbar: [btnAdicionarCond, btnEliminarCond, '-', btnOperaciones, '-', btnValidarCond, '->', btnParentesisAbierto, '-', btnParentesisCerrado, '-', btnSubirCond, '-', btnBajarCond],
            bbar: new Ext.StatusBar({
                // defaults to use when the status is cleared:
                defaultText: 'Default status text',
                defaultIconCls: 'default-icon',

                // values to set initially:
                text: 'Para adicionar arrastre un campo desde el panel de la izquierda.',
                iconCls: 'ready-icon',

                // any standard Toolbar items:
                items: [tfCantConditions,' ']
            }),
            listeners: {
                render: function(g){
                    Ext.fly(tfCantConditions.getEl().parentNode).addClass('x-status-text-panel').createChild({cls:'spacer'});
                    GridDropTarget = new Ext.dd.DropTarget(g.getView().el.dom.childNodes[0].childNodes[1], {
                        ddGroup: 'tpSelectores',
                        notifyDrop: function(ddSource, e, data) {
                            if(ddSource.dragData.node.attributes.usarcondicion){
                                addRecord(ddSource.dragData.node);
                                return true;
                            }
                            return false;
                        },
                        notifyOver : function(ddSource, e, data) {
                            var node = ddSource.dragData.node;
                            if (node.attributes.usarcondicion){
                                return Ext.dd.DropTarget.prototype.dropAllowed;
                            } else {
                                return Ext.dd.DropTarget.prototype.dropNotAllowed;
                            }
                        }
                    });
                },
                cellclick: function(grid, rowIndex, columnIndex, e) {
                    var record = grid.getStore().getAt(rowIndex);
                    var type = record.get('tipo');
                    var editor;
                    if (columnIndex == 2) {
                        switch (type) {
                            case 'NUMERO':
                                editor = new Ext.form.NumberField({
                                    allowBlank: false,
                                    allowNegative: false
                                });
                                break;
                            case 'bool':
                                editor = new Ext.form.TextField({
                                    allowBlank: false
                                });
                                break;
                            case 'FECHA':
                                editor = new Ext.form.DateField({
                                    format: 'd/m/Y',
                                    readOnly: (record.get('condicion') === 'IS NULL' || record.get('condicion') === 'IS NOT NULL')
                                });
                                break;
                            case 'HORA':
                                editor = new Ext.form.TimeField({
                                    minValue: '0:00am',
                                    maxValue: '11:59pm',
                                    typeAhead: true,
                                    mode: 'local',
                                    triggerAction: 'all',
                                    selectOnFocus: true,
                                    increment: 30,
                                    listeners: {
                                        valid: function(field) {
                                            self.smCondiciones.getSelected().set('valor', field.getRawValue());
                                        }
                                    }
                                });
                                break;
                            case 'NOMENCLADOR':
                            case 'NOMENCLADORCOMPLEJO':
                            case 'MULTIPLESVALORES':
                                var cbNomenclador = new Ext.components.CmpReccomplejas.ComboBoxNomenclador({
                                    valueField:'denom',
                                    parent: self,
                                    idconfiguracion: self.idconfiguracion,
                                    idcampo: record.get('idcampo'),
                                    tipo: record.get('tipo'),
                                    idioma: self.idioma,
                                    listeners: {
                                        'select': function(combo, record, index) {
                                            self.smCondiciones.getSelected().set('valor', record.get('idvalor'));
                                        }
                                    }
                                });
                                editor = cbNomenclador;
                                break;
                            case 'ARBOL':
                                var cbTreeArbol = new Ext.components.CmpReccomplejas.TreeComboBox({
                                    anchor: "98%",
                                    treeConfig: {
                                        rootVisible: false,
                                        loader: new Ext.tree.TreeLoader({
                                            dataUrl: '/reccomplejas/index.php/reccomplejas/cargarValoresArbol',
                                            preloadChildren: false,
                                            listeners: {
                                                beforeload: function(treeLoader, node, response) {
                                                    treeLoader.baseParams.idconfiguracion = self.idconfiguracion;
                                                    treeLoader.baseParams.idcampo = record.get('idcampo');
                                                }
                                            }
                                        }),
                                        border: false,
                                        autoScroll: true,
                                        root: new Ext.tree.AsyncTreeNode({
                                            id: '-1',
                                            text: 'Arbol',
                                            animate: false,
                                            draggable: false,
                                            expanded: false
                                        }),
                                        listeners: {
                                            click: function(node, e) {
                                                self.smCondiciones.getSelected().set('valor', node.id);
                                            }
                                        }
                                    }
                                });
                                editor = cbTreeArbol;
                                break;
                            case 'ARBOLESPECIAL':
                                var cbTreeArbol = new Ext.components.CmpReccomplejas.TreeComboBox({
                                    anchor: "98%",
                                    treeConfig: {
                                        rootVisible: false,
                                        loader: new Ext.tree.TreeLoader({
                                            dataUrl: '/reccomplejas/index.php/reccomplejas/cargarValoresArbol',
                                            preloadChildren: false,
                                            listeners: {
                                                beforeload: function(treeLoader, node, response) {
                                                    treeLoader.baseParams.idnodo = node.id; //node.attributes.idnodo;
                                                    treeLoader.baseParams.idpais = node.attributes.idpais;
                                                    treeLoader.baseParams.idconfiguracion = self.idconfiguracion;
                                                    treeLoader.baseParams.idcampo = record.get('idcampo');
                                                    treeLoader.baseParams.tipoarbol = record.get('tipo');
                                                }
                                            }
                                        }),
                                        border: false,
                                        autoScroll: true,
                                        root: new Ext.tree.AsyncTreeNode({
                                            id: '-1',
                                            text: 'Arbol',
                                            idnodo: '-1',
                                            idpais: '-1',
                                            animate: false,
                                            draggable: false,
                                            expanded: false
                                        }),
                                        listeners: {
                                            click: function(node, e) {
                                                self.smCondiciones.getSelected().set('valor', node.id);
                                            }
                                        }
                                    }
                                });
                                editor = cbTreeArbol;
                                break;
                            default:
                                editor = new Ext.form.TextField({
                                    allowBlank: false,
                                    maxLength: 255
                                });
                        }
                        cmCondiciones[columnIndex].editor = editor;
                        grid.reconfigure(stCondiciones, new Ext.grid.ColumnModel(cmCondiciones));
                    }
                    else if (columnIndex == 1) {

                        var datos = null;
                        if (record.get('tipo') == 'TEXTO') {
                            datos = datosCondicionTexto;
                        }
                        else if (record.get('tipo') == 'FECHA' || record.get('tipo') == 'HORA') {
                            datos = datosCondicionFecha;
                        }
                        else if (record.get('tipo') == 'NUMERO') {
                            datos = datosCondicionNumero;
                        }
                        else if (record.get('tipo') == 'NOMENCLADOR' || record.get('tipo') == 'MULTIPLESVALORES' || record.get('tipo') == 'NOMENCLADORCOMPLEJO') {
                            datos = datosCondicionNomenclador;
                        }
                        else if (record.get('tipo') == 'ARBOLESPECIAL') {
                            datos = datosCondicionArbolEspecial;
                        }
                        else if (record.get('tipo') == 'ARBOL' || record.get('tipo') == 'ARBOLESPECIAL') {
                            datos = datosCondicionArbol;
                        }
                        stCondicion.loadData(datos);
                    }
                },
                afteredit: function(object) {
                    if (object.column == 1 && object.record.get('tipo') == 'FECHA' && object.record.get('condicion') == 'IS NULL') {
                        object.record.set('valor', '');
                        object.record.set('valormostrar', '');
                    }
                    if (object.column == 2 && (object.record.get('tipo') == 'TEXTO' || object.record.get('tipo') == 'NUMERO' || object.record.get('tipo') == 'HORA')) {
                        self.smCondiciones.getSelected().set('valor', object.value);
                    }
                    if (object.column == 2 && object.record.get('tipo') == 'FECHA') {
                        if (object.record.get('condicion') === 'IS NULL' || object.record.get('condicion') === 'IS NOT NULL') {
                            self.smCondiciones.getSelected().set('valor', '');
                            self.smCondiciones.getSelected().set('valormostrar', '');
                        } else {
                            self.smCondiciones.getSelected().set('valor', object.value.dateFormat('d/m/Y'));
                            object.record.set('valormostrar', object.value.dateFormat('d/m/Y'));
                        }
                    }
                }
            }
        });
        //GRID DONDE SE VA A MOSTRAR LAS CONDICIONES A SELECCIONAR PARA LA COLOUMNA DE CONDICIONES
        var gpColCondiciones = new Ext.grid.GridPanel({
            store: new Ext.data.SimpleStore({
                fields: [{
                        name: 'condicion'
                    }, {
                        name: 'denominacion'
                    }]
            }),
            region: 'center',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                listeners: {
                    rowselect: function(sel, rowIndex, rec) {
                        var filaCond = self.gpCondiciones.getSelectionModel().getSelected();
                        filaCond.set('condicion', rec.get('condicion'));
                        filaCond.set('condicionmostrar', rec.get('denominacion'));
                        winColCondiciones.hide();
                    }
                }
            }),
            columns: [
                {
                    header: self.idioma.fldenominacion,
                    width: 100,
                    sortable: true,
                    dataIndex: 'denominacion',
                    menuDisabled: true
                },
                {
                    header: self.idioma.cmCondicion,
                    width: 80,
                    sortable: true,
                    dataIndex: 'condicion',
                    hidden: true,
                    menuDisabled: true
                }
            ],
            stripeRows: true,
            height: 190,
            width: 110,
            border: false,
            layout: 'fit'
        });
        //VENTANA PARA MOSTRAR LAS CONDICIONES A SELECCIONAR EN LA COLUMNA DE CONDICIONES
        var winColCondiciones = new Ext.Window({
            title: self.idioma.lbTitTpCondiciones,
            height: 190,
            width: 125,
            closable: true,
            closeAction: 'hide',
            modal: true,
            resizable: false,
            items: [gpColCondiciones]
        });
        //PLANTILLA PARA ADICIONAR EN EL GRID DENTRO DE LA VENTANA DE CONDICIONES
        var rPlantillaAddCond = new Ext.data.Record.create({
            name: 'idcampo'
        }, {
            name: 'denominacion'
        }, {
            name: 'tipo'
        }, {
            name: 'expresionregular'
        }, {
            name: 'cantidad'
        });
        //STORE DEL GRID VENTANA ADICIONAR CONDICIONES
        var stAddCondiciones = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'idcampo'
                },
                {
                    name: 'denominacion'
                },
                {
                    name: 'tipo'
                },
                {
                    name: 'expresionregular'
                },
                {
                    name: 'cantidad'
                }
            ]
        });
        //GRID VENTANA ADICIONAR CONDICION
        var egpAddCondiciones = new Ext.grid.EditorGridPanel({
            store: stAddCondiciones,
            region: 'center',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true
            }),
            clicksToEdit: 1,
            margins: '5 5 5 0',
            columns: [
                {
                    header: self.idioma.cmId,
                    dataIndex: 'id',
                    hidden: true,
                    menuDisabled: true
                },
                {
                    header: self.idioma.fldenominacion,
                    width: 220,
                    sortable: true,
                    dataIndex: 'denominacion',
                    menuDisabled: true
                },
                {
                    header: self.idioma.cmTipo,
                    width: 80,
                    sortable: true,
                    dataIndex: 'tipo',
                    hidden: true,
                    menuDisabled: true
                },
                {
                    header: self.idioma.cmCantidad,
                    width: 100,
                    sortable: true,
                    dataIndex: 'cantidad',
                    menuDisabled: true,
                    editor: new Ext.form.NumberField({
                        allowBlank: false,
                        allowDecimals: false,
                        allowNegative: false,
                        maxLength: 2,
                        maxValue: 20,
                        minLength: 1,
                        minValue: 1
                    })
                }
            ],
            stripeRows: true,
            height: '100%',
            width: '50%',
            layout: 'fit',
            view: new Ext.grid.GridView({
                forceFit: true
            }),
            title: self.idioma.lbTitEgpAddCondiciones
        });
        //VENTANA DE ADICIONAR CONDICIONES
        var winCondiciones = new Ext.Window({
            title: self.idioma.lbTitWinAddCondiciones,
            height: 480,
            width: 650,
            closable: true,
            closeAction: 'hide',
            layout: 'border',
            modal: true,
            items: [tpCondiciones, egpAddCondiciones],
            listeners: {
                show: function() {
                    tpCondiciones.getRootNode().expand(true, true);
                },
                hide: function() {
                    egpAddCondiciones.getStore().removeAll();
                    var nodosChequeados = tpCondiciones.getChecked();
                    for (var i = 0; i < nodosChequeados.length; i++) {
                        nodosChequeados[i].getUI().toggleCheck(false);
                    }
                }
            },
            buttons: [{
                    text: self.idioma.lbBtnCancelar,
                    iconCls: 'cancelar',
                    tooltip: self.idioma.ttpBtnCancelar,
                    handler: function() {
                        winCondiciones.hide();
                    }
                }, {
                    text: 'Aceptar',
                    iconCls: 'aceptar',
                    tooltip: self.idioma.ttpBtnAceptar,
                    handler: function() {
                        var cantGridCond = stAddCondiciones.getCount();
                        if (cantGridCond > 0) {
                            var cantCond = stCondiciones.getCount();
                            if (cantCond > 0) {//Si hay al menos una condicion insertada, entonces busco la ultima y le pongo el valor del logico
                                var temp = stCondiciones.getAt(cantCond - 1);
                                temp.set('logico', 'and');
                                temp.set('mostrarlogico', 'Y');
                            }
                            for (var i = 0; i < cantGridCond; i++) {
                                var cantAux = stAddCondiciones.getAt(i).get('cantidad');
                                for (var j = 0; j < cantAux; j++) {
                                    var rAddFilaCond = null;
                                    if (i == cantGridCond - 1 && (cantAux == 1 || j == cantAux - 1)) {
                                        rAddFilaCond = new rPlantillaCond({
                                            denominacion: stAddCondiciones.getAt(i).get('denominacion'),
                                            condicionmostrar: '',
                                            valormostrar: '',
                                            logico: '',
                                            mostrarlogico: '',
                                            tipo: stAddCondiciones.getAt(i).get('tipo'),
                                            condicion: '',
                                            valor: '',
                                            idcampo: stAddCondiciones.getAt(i).get('idcampo')
                                        });
                                    } else {
                                        rAddFilaCond = new rPlantillaCond({
                                            denominacion: stAddCondiciones.getAt(i).get('denominacion'),
                                            condicionmostrar: '',
                                            valormostrar: '',
                                            logico: 'and',
                                            mostrarlogico: 'Y',
                                            tipo: stAddCondiciones.getAt(i).get('tipo'),
                                            condicion: '',
                                            valor: '',
                                            idcampo: stAddCondiciones.getAt(i).get('idcampo')
                                        });
                                    }
                                    stCondiciones.add(rAddFilaCond);
                                }
                            }
                            btnValidarCond.enable();
                        }
                        winCondiciones.hide();
                        self.gpCondiciones.doLayout();
                    }
                }
            ]
        });
        winCondiciones.on('hide', function(cmp) {
            btnGenerar.focus();
        });
        //GRIDPANEL PARA MOSTRAR LOS CAMPOS SOBRE LOS CUALES SE VA A REALIZAR LA OPERACION DE CANTIDAD
        var stOperacion = new Ext.data.SimpleStore({
            fields: [{
                    name: 'idcampo'
                }, {
                    name: self.idioma.cmCampo
                }, {
                    name: 'tooltip'
                }, {
                    name: 'text'
                },{
                name: 'esquema'
            },{
                name: 'tabla'
            }
            ]
        });
        var smrow = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        var gpOperacion = new Ext.grid.GridPanel({
            store: stOperacion,
            border: false,
            cm: new Ext.grid.ColumnModel(
                [smrow,
                {
                    id: 'idcampo',
                    header: self.idioma.cmCampo,
                    width: 200,
                    sortable: true,
                    dataIndex: 'text'
                }]
            ),
            sm: smrow,
            width: 280,
            height: 250,
            autoScroll: true,
            iconCls: 'icon-grid',
            layout: 'fit',
            viewConfig: {
                forceFit: true
            },
            listeners: {
                rowdblclick: function(gp, rowIndex, event) {
                    self.arrOperacion = {}; //Variable donde voy a almacenar el campo al cual le voy a hacer la operación.
                    var campo = gpOperacion.getSelectionModel().getSelected();
                    self.arrOperacion.campo = campo.get('text');
                    self.arrOperacion.tooltip = campo.get('tooltip');
                    self.arrOperacion.idcampo = campo.get('idcampo');
                    self.arrOperacion.tipoOperacion = 'COUNT'; //Tipo de operacion que voy a ejecutar
                    self.arrOperacion.nombreOperacion = 'Cantidad';
                    winOperacion.hide();
                }
            }
        });

        this.obtenerCamposAMostrar = function() {
            var arrCampos = new Array();
            var arrNodos = self.tpSelectores.getChecked();
            for (var i = 0; i < arrNodos.length; i++) {
                var aux = {
                    text: arrNodos[i].attributes.text,
                    qtip: arrNodos[i].attributes.qtip,
                    idcampo: arrNodos[i].attributes.idcampo,
                    esquema: arrNodos[i].attributes.esquema,
                    tabla: arrNodos[i].attributes.tabla,
                    campo: arrNodos[i].attributes.campo,
                    alias: arrNodos[i].attributes.alias,
                    obligatorio: arrNodos[i].attributes.obligatorio,
                    anchocolumna: arrNodos[i].attributes.anchocolumna,
                    expander: arrNodos[i].attributes.expander,
                    renderer: arrNodos[i].attributes.renderer,
                    agruparcampo: arrNodos[i].attributes.agruparcampo
                };
                arrCampos.push(aux);
            }
            return arrCampos;
        };

        /**
         * Devuelve los campos por los que se va a ordenar la consulta
         * @param Boolean returnDenom Si se va a devolver la denominacion
         * @returns {Array}
         */
        this.getFieldsOrderBy = function(returnDenom){
            var arrCampos = new Array();
            var cantTotalCond = self.gpOrderBy.getStore().getCount();
            for (var i = 0; i < cantTotalCond; i++) {
                var record = self.gpOrderBy.getStore().getAt(i);
                var field = {
                    orden: record.get('orden'),
                    idcampo: record.get('idcampo')
                };
                if(returnDenom){
                    field.denom = record.get('denom');
                }
                arrCampos.push(field);
            }
            return arrCampos;
        }

        this.obtenerCondicionesAEvaluar = function() {

            var arrCondiciones = new Array();
            var cantTotalCond = stCondiciones.getCount();

            if (cantTotalCond > 0) {
                for (var i = 0; i < cantTotalCond; i++) {
                    var record = stCondiciones.getAt(i);
                    var aux = {
                        condicion: record.get('condicion'),
                        valor: record.get('valor'),
                        logico: record.get('logico'),
                        idcampo: record.get('idcampo'),
                        tipo: record.get('tipo')
                    };
                    arrCondiciones.push(aux);
                }
            }
            return arrCondiciones;
        };

//Funcion que se llamara cuando se valla a guardar la busqueda configurada
        this.obtenerCondicionesAGuardar = function() {
            var arrCondiciones = new Array();
            var cantTotalCond = stCondiciones.getCount();
            if (cantTotalCond > 0) {
                for (var i = 0; i < cantTotalCond; i++) {
                    var record = stCondiciones.getAt(i);
                    /*if(record.get('tipo') == 'pabierto' || record.get('tipo') == 'pcerrado'){
                     continue;
                     }*/
                    if (record.get('condicion') == '' || record.get('valor') == '') {
                        return false; //Para saber si se quedó algún campo de las condiciones vacíos
                    }
                    else {
                        var aux = {
                            condicion: record.get('condicion'),
                            valor: record.get('valor'),
                            logico: record.get('logico'),
                            idcampo: record.get('idcampo'),
                            tipo: record.get('tipo'),
                            denominacion: record.get('denominacion'),
                            condicionmostrar: record.get('condicionmostrar'),
                            valormostrar: record.get('valormostrar'),
                            mostrarlogico: record.get('mostrarlogico')
                        };
                        arrCondiciones[i] = aux;
                    }
                }
            }
            return arrCondiciones;
        }

        function eliminarCondicion() {
//if(tpcondicionesreportes.getActiveTab().getId() == 'idpcondiciones'){
            var arrayCond = self.gpCondiciones.getSelectionModel().getSelections();
            for (var i = 0; i < arrayCond.length; i++) {
                stCondiciones.remove(arrayCond[i]);
            }
            if (stCondiciones.getCount() > 0) {
                stCondiciones.getAt(stCondiciones.getCount() - 1).set('logico', '');
                stCondiciones.getAt(stCondiciones.getCount() - 1).set('mostrarlogico', '');
            }
            btnEliminarCond.disable();
            if (stCondiciones.getCount() == 0) {
                btnValidarCond.disable();
            }
//}
        }

        function adicionarParAbierto() {
            if (self.smCondiciones.hasSelection()) {
                var recordSeleccionado = self.smCondiciones.getSelected();
                var pos = stCondiciones.indexOf(recordSeleccionado);
                var rParentesisAbierto = new rPlantillaCond({
                    denominacion: '(',
                    condicionmostrar: '',
                    valormostrar: '',
                    logico: '',
                    mostrarlogico: '',
                    tipo: 'pabierto',
                    condicion: '',
                    valor: '',
                    idcampo: ''
                });
                stCondiciones.insert(pos, rParentesisAbierto);
                self.gpCondiciones.getSelectionModel().selectRow(pos + 1);
            }
        }

        function adicionarParCerrado() {
            if (self.smCondiciones.hasSelection()) {
                var recordSeleccionado = self.smCondiciones.getSelected();
                var pos = stCondiciones.indexOf(recordSeleccionado);
                var rParentesisCerrado = new rPlantillaCond({
                    denominacion: ')',
                    condicionmostrar: '',
                    valormostrar: '',
                    logico: recordSeleccionado.get('logico'),
                    mostrarlogico: recordSeleccionado.get('mostrarlogico'),
                    tipo: 'pcerrado',
                    condicion: '',
                    valor: '',
                    idcampo: ''
                });
                recordSeleccionado.set('logico', '');
                recordSeleccionado.set('mostrarlogico', '');
                stCondiciones.insert(pos + 1, rParentesisCerrado);
            }
        }

        function subirCondicion() {
            var recordSeleccionado = self.smCondiciones.getSelected();
            var pos = stCondiciones.indexOf(recordSeleccionado);
            var recordAux = recordSeleccionado;
            stCondiciones.remove(recordSeleccionado);
            stCondiciones.insert(pos - 1, recordAux);
            self.smCondiciones.selectPrevious(false);
            if ((pos + 1) == stCondiciones.getCount()) {
                var temp = stCondiciones.getAt(pos);
                var valorLogico = temp.get('logico');
                var mostrarLogico = temp.get('mostrarlogico');
                temp.set('logico', '');
                temp.set('mostrarlogico', '');
                var temp1 = stCondiciones.getAt(pos - 1);
                temp1.set('logico', valorLogico);
                temp1.set('mostrarlogico', mostrarLogico);
            }
        }

        function bajarCondicion() {
            var recordSeleccionado = self.gpCondiciones.getSelectionModel().getSelected();
            var pos = stCondiciones.indexOf(recordSeleccionado);
            var recordAux = recordSeleccionado;
            stCondiciones.remove(recordSeleccionado);
            stCondiciones.insert(pos + 1, recordAux);
            self.gpCondiciones.getSelectionModel().selectNext(false);
            if ((pos + 2) == stCondiciones.getCount()) {
                var temp = stCondiciones.getAt(pos + 1);
                var valorLogico = temp.get('logico');
                var mostrarLogico = temp.get('mostrarlogico');
                temp.set('logico', '');
                temp.set('mostrarlogico', '');
                var temp1 = stCondiciones.getAt(pos);
                temp1.set('logico', valorLogico);
                temp1.set('mostrarlogico', mostrarLogico);
            }
        }

//Función que obtiene los campos por los que se puede realizar una operación.
        function obtenerCamposOperar() {
            var arrCampos = new Array();
            var cantCampos = 0;
            var arrNodos = self.tpSelectores.getChecked();

            for (var i = 0; i < arrNodos.length; i++) {
                var arrAux = new Array();
                arrAux[0] = arrNodos[i].attributes.idcampo;
                arrAux[1] = arrNodos[i].attributes.campo;
                arrAux[2] = arrNodos[i].attributes.qtip;
                arrAux[3] = arrNodos[i].attributes.text;
                /********************Adicionando esquema y tabla*************************/
                arrAux[4] = arrNodos[i].attributes.esquema;
                arrAux[5] = arrNodos[i].attributes.tabla;
                arrCampos[cantCampos] = arrAux;
                cantCampos++;
            }

            return arrCampos;
        }

        /**
         * Funcion que devuelve los campos seleccionados
         */
        this.getFieldsToShow = function() {
            var arrCampos = new Array();
            var arrNodos = self.tpSelectores.getChecked();
            for (var i = 0; i < arrNodos.length; i++) {
                arrCampos.push(arrNodos[i].attributes);
            }
            return arrCampos;
        }

        function fnShowWinOperacion() {
            var arrCampos = obtenerCamposOperar();
            stOperacion.loadData(arrCampos);
            if (!winOperacion) {
				var btnAcep = new Ext.Button({
					id: 'btnCeptarOperacion' + self.id,
					iconCls: 'aceptar',
					tooltip: self.idioma.ttpBtnAceptar,
					text: self.idioma.lbBtnAceptar,
					handler: function() {
						if (gpOperacion.getSelectionModel().hasSelection()) {
                            var arraycampos = gpOperacion.getSelectionModel().getSelections()

                            if(arraycampos.length<=2){
                                var arrCampo = gpOperacion.getSelectionModel().getSelections();
                                self.arrOperacion.length= 0;
                                Ext.each(arrCampo, function (campo) {
                                    self.arrOperacion.push({campo: campo.get('text'), idcampo:campo.get('idcampo') ,tooltip:campo.get('tooltip'),tipoOperacion:'COUNT',nombreOperacion:'Cantidad',esquema:campo.get('esquema'),tabla:campo.get('tabla')});
                                });
                                if(arraycampos.length==2){
                                    if(self.arrOperacion[0].campo == 'Sexo'){
                                        var valorcampo = self.arrOperacion[0].campo;
                                        var valortabla = self.arrOperacion[0].tabla;
                                        var valoridcampo = self.arrOperacion[0].idcampo;
                                        var valoresquema = self.arrOperacion[0].esquema;

                                        self.arrOperacion[0].campo = self.arrOperacion[1].campo;
                                        self.arrOperacion[0].tabla = self.arrOperacion[1].campo;
                                        self.arrOperacion[0].idcampo = self.arrOperacion[1].idcampo;
                                        self.arrOperacion[0].esquema = self.arrOperacion[1].esquema;

                                        self.arrOperacion[1].campo = valorcampo;
                                        self.arrOperacion[1].tabla = valortabla;
                                        self.arrOperacion[1].idcampo = valoridcampo;
                                        self.arrOperacion[1].esquema = valoresquema;

                                    }
                                    if(self.arrOperacion[1].campo == 'Edad'){
                                        var valorcampod = self.arrOperacion[1].campo;
                                        var valortablad = self.arrOperacion[1].tabla;
                                        var valoridcampod = self.arrOperacion[1].idcampo;
                                        var valoresquemad = self.arrOperacion[1].esquema;

                                        self.arrOperacion[1].campo = self.arrOperacion[0].campo;
                                        self.arrOperacion[1].tabla = self.arrOperacion[0].tabla;
                                        self.arrOperacion[1].idcampo = self.arrOperacion[0].idcampo;
                                        self.arrOperacion[1].esquema = self.arrOperacion[0].esquema;

                                        self.arrOperacion[0].campo = valorcampod;
                                        self.arrOperacion[0].tabla = valortablad;
                                        self.arrOperacion[0].idcampo = valoridcampod;
                                        self.arrOperacion[0].esquema = valoresquemad;
                                    }
                                    if(self.arrOperacion[0].campo == 'Estatura' && self.arrOperacion[1].campo!='Edad' && self.arrOperacion[0].campo != 'Sexo'){
                                        var valorcampoe = self.arrOperacion[0].campo;
                                        var valortablae = self.arrOperacion[0].tabla;
                                        var valoridcampoe = self.arrOperacion[0].idcampo;
                                        var valoresquemae = self.arrOperacion[0].esquema;

                                        self.arrOperacion[0].campo = self.arrOperacion[1].campo;
                                        self.arrOperacion[0].tabla = self.arrOperacion[1].tabla;
                                        self.arrOperacion[0].idcampo = self.arrOperacion[1].idcampo;
                                        self.arrOperacion[0].esquema = self.arrOperacion[1].esquema;

                                        self.arrOperacion[1].campo = valorcampoe;
                                        self.arrOperacion[1].tabla = valortablae;
                                        self.arrOperacion[1].idcampo = valoridcampoe;
                                        self.arrOperacion[1].esquema = valoresquemae;
                                    }
                                }

                                winOperacion.hide();
                            }else
                            {
                                mostrarMensaje(8, "Debe seleccionar dos campo solamente.");
                                btnAcep.focus();
                            }

						}
						else {
							Ext.MessageBox.show({
								title: self.idioma.titleAlerta,
								msg: 'Debe seleccionar un campo',
								buttons: Ext.MessageBox.OK,
								icon: Ext.MessageBox.INFO
							});
							btnAcep.focus();
						}
					}
				});
				var btnCancel = new Ext.Button({
					iconCls: 'cancelar',
					tooltip: self.idioma.ttpBtnCancelar,
					text: self.idioma.lbBtnCancelar,
					handler: function() {
						winOperacion.hide();
					}
				});
                winOperacion = new Ext.Window({
                    title: self.idioma.lbTitWinOperacion,
                    layout: 'fit',
                    modal: true,
                    resizable: false,
                    closeAction: 'hide',
                    modal: true,
                            autoHeight: true,
                    items: [gpOperacion],
                    buttons: [btnCancel,btnAcep]
                });
			var map = new Ext.KeyMap(Ext.getDoc(), [
				{
						key:Ext.EventObject.ENTER,
						fn:function(){
							btnAcep.handler();
						}
					},{
						key:'x',
						alt:true,
						fn:function(){
							btnCancel.handler();
						}
					}
			]);
            }


            winOperacion.show();
            winOperacion.on('hide', function(cmp) {
                btnGenerar.focus();
            });
        }

//Función auxiliar para resetear el árbol de selectores
        function miFuncion(nodo) {
            if (nodo.attributes.obligatorio != '1') {
                nodo.getUI().toggleCheck(false);
            } else {
                nodo.getUI().toggleCheck(true);
            }
        }

//Función que limpia el árbol de selectores.
        function limpiarArbolSelectores() {
            var raiz = self.tpSelectores.getRootNode();
            var cant = 0;
            var otrosnodos = new Array();
            var nodos = raiz.childNodes;
            for (var i = 0; i < nodos.length; i++) {
                if(nodos[i].childNodes.leaf != true){
                    var nodosinternos = nodos[i].childNodes;
                    for(var j = 0; j < nodosinternos.length; j++){
                         otrosnodos[cant] = nodosinternos[j];
                         cant++;
                    }
                }
            }
            for (var i = 0; i < otrosnodos.length; i++) {
                otrosnodos[i].eachChild(miFuncion, this);
            }

            var nodosPadres = raiz.childNodes;
            for (var i = 0; i < nodosPadres.length; i++) {
                nodosPadres[i].eachChild(miFuncion, this);
            }
        }

        function showWinGuardarBusqueda() {
            if (self.validarCondiciones(false)) {
                var winGuardarBusqueda = new Ext.components.CmpReccomplejas.WinSalvarBusqueda({
                    title: self.idioma.lbTitWinGuardarBusqueda,
                    idioma: self.idioma,
                    idbusqueda: 0,
                    idconfiguracion: self.idconfiguracion,
                    campos: self.obtenerCamposAMostrar(),
                    condiciones: self.obtenerCondicionesAGuardar(),
                    operacion: self.arrOperacion,
                    orderby: self.getFieldsOrderBy(true),
                    noUsarGestAvisos: self.noUsarGestAvisos
                });
                winGuardarBusqueda.show();
                winGuardarBusqueda.on('close', function(component) {
                    stReportes.reload({
                        params: {
                            idconfiguracion: self.idconfiguracion
                        }
                    });
                    btnGenerar.focus();
                });
                winGuardarBusqueda.on('hide', function(component) {
                    btnGenerar.focus();
                });
            }
            btnGenerar.focus();
        }

        function showWinGestBusquedas() {
            var winGestBusqueda = new Ext.components.CmpReccomplejas.WinGestBusquedas({
                idconfiguracion: self.idconfiguracion,
                idioma: self.idioma,
                parent: self,
                noUsarGestAvisos: self.noUsarGestAvisos
            });
            winGestBusqueda.show();
            winGestBusqueda.on('busquedaEliminada', function() {
                stReportes.reload({
                    params: {
                        idconfiguracion: self.idconfiguracion
                    }
                });
            });
            winGestBusqueda.on('close', function(cmp) {
                btnGenerar.focus();
            });
        }
        function limpiarOperacion() {
            //Limpio el arreglo de operacion
            self.arrOperacion = new Array();

            btnEliminarCond.disable();
            btnValidarCond.disable();
            btnParentesisAbierto.disable();
            btnParentesisCerrado.disable();
            btnSubirCond.disable();
            btnBajarCond.disable();
            //Limpio el arbol de selectores
            limpiarArbolSelectores();
            btnGenerar.focus();
        }

        function limpiarCondicion() {
            //Limpio el store del GridPanel de Condiciones
            stCondiciones.removeAll();

            btnEliminarCond.disable();
            btnValidarCond.disable();
            btnParentesisAbierto.disable();
            btnParentesisCerrado.disable();
            btnSubirCond.disable();
            btnBajarCond.disable();
            btnGenerar.focus();
        }

        function limpiarTodo() {
            //Limpio el store del GridPanel de Condiciones
            stCondiciones.removeAll();
            //Limpio el arreglo de operacion
            self.arrOperacion = new Array();
            //Limpio el los campos de ordenar
            self.gpOrderBy.getStore().removeAll();
            //Limpio el combo de reportes guardados
            cbReportes.reset();
            btnEliminarCond.disable();
            btnValidarCond.disable();
            btnParentesisAbierto.disable();
            btnParentesisCerrado.disable();
            btnSubirCond.disable();
            btnBajarCond.disable();
            //Limpio el arbol de selectores
            limpiarArbolSelectores();
            btnGenerar.focus();
        }

        this.validarCondiciones = function(mostraMensajeOK) { //la variabel mostraMensajeOK es para si quiero mostrar algún mensaje si las condiciones están conrrectas
            var cantPOpen = 0;
            var cantPClose = 0;
            var cantTotalCond = stCondiciones.getCount();
            if (cantTotalCond > 0) {
                for (var i = 0; i < cantTotalCond; i++) {
                    var record = stCondiciones.getAt(i);
                    if (record.get('tipo') == 'pabierto') {
                        cantPOpen++;
                    }
                    if (record.get('tipo') == 'pcerrado') {
                        cantPClose++;
                    }
                    if (record.get('tipo') == 'TEXTO' || record.get('tipo') == 'NUMERO' || record.get('tipo') == 'HORA' || record.get('tipo') == 'FECHA') {
                        if (record.get('valormostrar') != '') {
                            record.set('valor', record.get('valormostrar'));
                        }
                    }
//Valido si quedó algún campo de las condiciones vacíos
                    if (record.get('tipo') != 'pcerrado' && record.get('tipo') != 'pabierto' && record.get('condicion') != 'IS NULL' && record.get('condicion') != 'IS NOT NULL' && (record.get('condicion') == '' || record.get('valor') == '')) {
                        Ext.MessageBox.show({
                            title: self.idioma.titleAlerta,
                            msg: self.idioma.MsgCondIncompletas,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.WARNING,
                            fn: function() {
                                btnGenerar.focus();
                            }
                        });
                        return false;
                    }
                }
//Valido los Paréntesis desbalanceados
                if (cantPOpen != cantPClose) {
                    Ext.MessageBox.show({
                        title: self.idioma.titleAlerta,
                        msg: self.idioma.MsgParentDesbalanceados,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING,
                        fn: function() {
                            btnGenerar.focus();
                        }
                    });
                    return false;
                }
                if (mostraMensajeOK) {
                    Ext.MessageBox.show({
                        title: self.idioma.titleInfo,
                        msg: self.idioma.MsgCondicionesOK,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        fn: function() {
                            btnGenerar.focus();
                        }
                    });
                    return true;
                }
            }
//Valido que se hayan seleccionado los campos obligatorios
            if (self.validarCamposObligatorios() == false) {
                self.parent.setActiveTab(1);
                Ext.MessageBox.show({
                    title: self.idioma.titleAlerta,
                    msg: self.idioma.MsgCamposFail,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.WARNING,
                    fn: function() {
                        btnGenerar.focus();
                    }
                });
                return false;
            }
            return true;
        }

        /*
         * Funcion que valida que esten seleccionados todos los campos de seleccion que son obligatorios
         * @return: void
         * */
        this.validarCamposObligatorios = function() {
            var raiz = self.tpSelectores.getRootNode();
            var nodosPadres = raiz.childNodes;
            var hijos = new Array();
            for (var i = 0; i < nodosPadres.length; i++) {
                hijos = nodosPadres[i].childNodes;
                for (var x = 0; x < hijos.length; x++) {
                    if (hijos[x].attributes.obligatorio == '1' && !hijos[x].getUI().isChecked()) {
                        return false;
                    }
                }
            }
            return true;
        }

        this.cargarConfiguracionBusqueda = function(pidbusqueda) {
//Primero limpio todo
            stCondiciones.removeAll();
            self.arrOperacion = new Array();
            btnParentesisAbierto.disable();
            btnParentesisCerrado.disable();
            btnSubirCond.disable();
            btnBajarCond.disable();
            limpiarArbolSelectores();
            /*
             var datos = Ext.decode(cbReportes.getSelected().get('configuracion'));
             self.reconfigurarBusqueda(datos.selectores, datos.condiciones, datos.orden, datos.operacion);
             */
            PVD.mostrarMascara('idmskreconfbusqueda', self.idioma.lbporfavorespere, self.idioma.lbLoadConfigBusqueda);
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/getConfiguracionBusqueda',
                method: 'POST',
                params: {
                    idbusqueda: pidbusqueda
                },
                callback: function(options, success, response) {
                    var datos = Ext.decode(response.responseText);
                    self.reconfigurarBusqueda(datos.selectores, datos.condiciones, datos.orden, datos.operacion);
                    //Recupero los datos del servidor y reconfiguro...
                    PVD.ocultarMascara('idmskreconfbusqueda');
                }
            });
        }

        this.reconfigurarBusqueda = function(parrSelectores, parrCondiciones, parrOrden, parrOperacion) {
            //Reconfigurando los selectores
            for (var i = 0; i < parrSelectores.length; i++) {
                var raiz = self.tpSelectores.getRootNode();
                var nodosPadres = raiz.childNodes;
                for (var j = 0; j < nodosPadres.length; j++) {
                    nodosPadres[j].eachChild(function(nodo) {
                        if (nodo.attributes.idcampo == parrSelectores[i].idcampo) {
                            nodo.getUI().toggleCheck(true);
                        }
                    }, this);
                }
            }
            //Reconfigurando las condiciones
            for (var i = 0; i < parrCondiciones.length; i++) {
                rFilaCond = new rPlantillaCond({
                    denominacion: parrCondiciones[i].denominacion,
                    condicionmostrar: parrCondiciones[i].condicionmostrar,
                    valormostrar: parrCondiciones[i].valormostrar,
                    logico: parrCondiciones[i].logico,
                    mostrarlogico: parrCondiciones[i].mostrarlogico,
                    tipo: parrCondiciones[i].tipo,
                    condicion: parrCondiciones[i].condicion,
                    valor: parrCondiciones[i].valor,
                    idcampo: parrCondiciones[i].idcampo,
                    campo: parrCondiciones[i].campo
                });
                stCondiciones.add(rFilaCond);
            }

            //Limpia los elementos de listados de campos a ordenar
            var stOrderBy = self.gpOrderBy.getStore();
            stOrderBy.removeAll();
            //Carga los campos a ordenar en su listado
            for(var i= 0, objOrder; objOrder = parrOrden[i]; i++){
                var tmpRecord = new rPlantillaCond({
                    denom: objOrder.denom,
                    idcampo:  objOrder.idcampo,
                    orden: objOrder.orden
                });
                stOrderBy.add(tmpRecord);
            }

            //Reconfigurando las operaciones
            if (parrOperacion.length == 1) {
                self.arrOperacion.push({campo: parrOperacion[0].campo, idcampo:parrOperacion[0].idcampo ,tipoOperacion:'COUNT',nombreOperacion:'Cantidad', tabla: parrOperacion[0].tabla, esquema: parrOperacion[0].esquema});
            }else if(parrOperacion.length == 2){
                self.arrOperacion.push({campo: parrOperacion[0].campo, idcampo:parrOperacion[0].idcampo ,tipoOperacion:'COUNT',nombreOperacion:'Cantidad', tabla: parrOperacion[0].tabla, esquema: parrOperacion[0].esquema});
                self.arrOperacion.push({campo: parrOperacion[1].campo, idcampo:parrOperacion[1].idcampo ,tipoOperacion:'COUNT',nombreOperacion:'Cantidad', tabla: parrOperacion[1].tabla, esquema: parrOperacion[1].esquema});
            }
        };

        this.generarReporte = function() {

            self.parent.setActiveTab(0);
            var arrayCampos = new Array();

            if(self.arrOperacion.length==2){

                Ext.getBody().mask('Procesando datos del reporte datos...');
                Ext.Ajax.request({
                    url: '/reccomplejas/index.php/administracion/obtenerValorCampo',
                    method: 'POST',
                    params: {
                        esquema: self.arrOperacion[1].esquema,
                        tabla: self.arrOperacion[1].tabla,
                        campo: self.arrOperacion[1].campo
                    },
                    callback: function (options, success, response) {
                        Ext.getBody().unmask();
                        var responseData = Ext.util.JSON.decode(response.responseText);
                        Ext.each(responseData, function (node) {
                            arrayCampos.push({
                                campo: node.denominacion
                            })
                        });
                        self.parent.pReporte.Buscar(arrayCampos);
                    }
                });
            }else
            {
                self.parent.pReporte.Buscar();
            }
        };
        function mostrarAyuda() {
            var title = 'Ayuda de recuperaciones complejas';
            help.show(title, 'seguimiento_colaborador');
        }

        /**
         * Plantilla de record para para los campos ordenar
         * @type {create}
         */
        var tplRecOrderBy = new Ext.data.Record.create({
                    name: 'denom'
                },
                {
                    name: 'idcampo'
                },
                {
                    name: 'orden'
                });

        this.gpOrderBy = new Ext.components.CmpReccomplejas.gpOrdenarPor({
            region:'east',
            idioma: self.idioma,
            //width: '20%',
            collapsible:true,
            split:true,
            margins: '5 5 5 0',
            cmargins: '5 5 5 5',
            listeners:{
                render: function(g){
                    GridDropTarget = new Ext.dd.DropTarget(g.getView().el.dom.childNodes[0].childNodes[1], {
                        ddGroup: 'tpSelectores',
                        notifyDrop: function(ddSource, e, data) {
                            if(ddSource.dragData.node.attributes.checked){
                                //Verifica que el campo a adicionar no exista
                                if(g.getStore().find('idcampo', ddSource.dragData.node.attributes.idcampo) == -1){
                                    var tmpRecord = new rPlantillaCond({
                                        denom: ddSource.dragData.node.attributes.denominacion,
                                        idcampo:  ddSource.dragData.node.attributes.idcampo,
                                        orden: 'ASC'
                                    });
                                    g.getStore().add(tmpRecord);
                                    return true;
                                }
                            }
                            return false;
                        },
                        notifyOver : function(ddSource, e, data) {
                            var node = ddSource.dragData.node;
                            if(ddSource.dragData.node.attributes.checked && g.getStore().find('idcampo', ddSource.dragData.node.attributes.idcampo) == -1){
                                return Ext.dd.DropTarget.prototype.dropAllowed;
                            } else {
                                return Ext.dd.DropTarget.prototype.dropNotAllowed;
                            }
                        }
                    });
                }
            }
        });

        this.tbar = ['B&uacute;squedas configuradas:&nbsp;', cbReportes, '-', btnGestionarBusquedas, btnGuardarConf, '->', btnGenerar, btnMapa, btnLimpiar, btnAyuda];
        this.items = [this.tpSelectores, self.gpCondiciones, this.gpOrderBy];
        this.on('beforeshow', function(panel) {
            self.tpSelectores.getRootNode().expand(true, true);
        });
        this.on('activate', function(panel) {
            btnGenerar.focus();
        });
        this.on('render', function(cmp) {
            stReportes.reload({
                params: {
                    idconfiguracion: self.idconfiguracion
                }
            });
        });
        Ext.components.CmpReccomplejas.PanelConfiguracion.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_pConfiguracion', Ext.components.CmpReccomplejas.PanelConfiguracion);

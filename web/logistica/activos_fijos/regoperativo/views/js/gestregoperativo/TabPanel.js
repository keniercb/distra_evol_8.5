Ext.ns('Ext.LOG.RegNumOperativo');
Ext.LOG.RegNumOperativo.tabGeneral = Ext.extend(Ext.TabPanel, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        _this.idioma = config.idioma;
        _this.height = 350;
        _this.autoScroll = true;
        _this.frame = true;
        _this.activeTab = 0;
        _this.enableTabScroll = true;
        _this.cantpaneles = -1;
        _this.idPanelActivo = 1;
        _this.cantcheck = 0;
        _this.canttabarriba = 1;
        _this.cantTabDatosGenerales = 0;
        _this.recordIndicador = null;

        Ext.LOG.RegNumOperativo.tabGeneral.activeButtons = null;
        _this.listeners = {
            'tabchange': function(tab, panel) {
                idImagenSeleccionada = null;
                imagenparaBtnMaximisarEliminarNGuardadas = null;
            }
        };
        this.panel = new Ext.Panel({
            title: '+',
            show: function() {
                if (_this.recordTree && _this.modificar) {
                    if (_this.plantilla) {
                        _this.reconfigurarInterfaz(_this.plantilla);
                    } else {
                        _this.reconfigurarInterfaz();
                    }
                } else {
                    _this.contruirInterfaz();
                }
                _this.remove(this);
            }
        });
        this.items = _this.panel;
        Ext.LOG.RegNumOperativo.tabGeneral.superclass.constructor.call(this);
    },
    reconfigurarInterfaz: function(plantilla) {
        var _this = this;
        if (_this.recordTree.length > 1) {
            for (var i = 0; i < _this.recordTree.length; i++) {
                _this.contruirInterfaz(_this.recordTree[i], plantilla);
            }
        } else {
            _this.contruirInterfaz(_this.recordTree[0], plantilla);
        }
    },
    contruirInterfaz: function(record, plantilla) {
        var _this = this;
        _this.cantpaneles++;
        _this.cantcheck++;
        _this.idindicador = (record)?record.data.idindicador:null;
        _this.panelImagen = new Ext.LOG.RegNumOperativo.panelCargarImagenes({
            idioma: _this.idioma,
            title: 'Im&aacute;genes',
            id: 'idPanelImagen' + _this.canttabarriba,
            height: 175,
            disabled: _this.busqAvanzada,
            modificar: _this.modificar,
            incrementoID: _this.canttabarriba,
            arrImagenesRegistro: (record) ? record.data.imagenesRegistro : null,
            panelImagen: 'Imagenes',
            recordTree: _this.recordTree,
            anchor: '98%'
        });
        _this.tabDatosGenerales = new Ext.TabPanel({
            id: 'idtabDatosGenerales' + _this.canttabarriba,
            frame: true,
            enableTabScroll: true,
            region: 'center',
            idPanelActivo: 1,
            activeTab: 0,
            listeners: {
                'tabchange': function(tab, panel) {
                    _this.tabDatosGenerales.idPanelActivo = panel.id;
                }
            },
            idregnumerico: (record) ? record.data.idregnumerico : null,
            items: [_this.panelImagen]
        });

        _this.panelComboDatosIndicador = new Ext.LOG.RegNumOperativo.PanelDatosIndicador({
            region: 'center',
            idioma: _this.idioma,
            layout: 'border',
            idareaComboFiltro: _this.idareaComboFiltro,
            idestructurapadre: _this.idestructurapadre,
            busqAvanzada: _this.busqAvanzada,
            recordTree: record,
            notab: _this.cantcheck,
            listaAcciones:_this.listaAcciones,
            plantilla: plantilla,
            modificar: _this.modificar,
            treegridPrincipal: _this.treegridPrincipal,
            panelContent: _this,
            winsGest: _this.winsGest
        });
        _this.canttabarriba++;
        var panelarriba = new Ext.Panel({
            region: 'north',
            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            autoScroll: true,
            animCollapse: false,
            animate: false,
            layout: 'fit',
            split: true,
            collapsed: false,
            height: 80,
            frame: true,
            listeners: {
                'expand': function() {
                    _this.tabDatosGenerales.getActiveTab().doLayout();
                },
                'collapse': function() {
                    _this.tabDatosGenerales.getActiveTab().doLayout();
                }
            },
            items: [_this.panelComboDatosIndicador]
        });
        if (_this.cantpaneles == 0) {
            _this.panel1 = new Ext.Panel({
                closable: false,
                title: (record && record.data.nroserie) ? record.data.nroserie : _this.idioma.lbnuevoregistro,
                layout: 'border',
                cantPaneles: _this.cantcheck,
                frame: true,
                id: 'idregistro' + _this.cantcheck,
                items: [panelarriba, _this.tabDatosGenerales]
            });
        }
        else {
            _this.panel1 = new Ext.Panel({
                closable: true,
                title: (record && record.data.nroserie) ? record.data.nroserie : _this.idioma.lbnuevoregistro,
                layout: 'border',
                cantPaneles: _this.cantcheck,
                frame: true,
                id: 'idregistro' + _this.cantcheck,
                items: [panelarriba, _this.tabDatosGenerales]
            });
        }
        _this.panel1.on({
            'beforeclose': function(p) {
                var pos = 0;
                for (var i = 0; i < _this.items.items.length; i++) {
                    if (_this.items.items[i].id == _this.panel1.id) {
                        pos = i;
                    }
                }
                if (_this.cantpaneles == 1) {
                    _this.activate(_this.getComponent(0));
                } else {
                    _this.activate(_this.getComponent(pos/*pos - 1*/));
                }
                _this.cantpaneles--;
                return true;
            }
        });
        if (record && _this.modificar) {
            _this.panelComboDatosIndicador.configurarVentana(record, _this.modificar, _this.panel1, _this.clonar, _this.plantilla);
        }
        _this.insert(_this.cantpaneles, _this.panel1);
        _this.activate(_this.panel1);
    },
    devolverDatosTab: function() {
        var _this = this;
        var arrayObj = Array();
        var bandera = true;

        for (var j = 0; j < _this.items.items.length; j++) {
            var elementosXtabla = Array();
            var indi = _this.items.items[j].items.items[0].items.items[0].idindicador;
            var modu = _this.items.items[j].items.items[0].items.items[0].esmodulo;
            var objEnv = {
                idindicador: (indi)? indi:_this.idindicador,
                esmodulo: (modu)? modu:_this.esmodulo
            };
            var cantObj = 0;
            for (var i = 0; i < _this.items.items[j].items.items[1].items.items.length; i++) {
                _this.items.items[j].items.items[1].setActiveTab(i);

                var obj = _this.items.items[j].items.items[1].items.items[i].retornarValoresCmp();

                if (obj != -1) {
                    var regnum = {
                        idregnumerico: _this.items.items[j].items.items[1].idregnumerico
                    };
                    Ext.apply(obj, regnum);
                    Ext.apply(objEnv, obj);

                    if(!_this.modificar) {
                        objEnv.valorcontable = objEnv.valoradquisicion;
                        if(alternativa)
                            objEnv.valorcontablealternativo = objEnv.valoradquisicionalternativo;
                    }
                    if (obj.elementosXtabla && obj.elementosXtabla.length != 0) {
                        elementosXtabla.push(obj.elementosXtabla);
                    }

                    cantObj++;
                } else if(!_this.modificar){
                    bandera = false;
                    mostrarMensaje(1, _this.idioma.lbValoresIncorrectos);
                    break;
                }
            }

            if(_this.modificar && cantObj == 0)
            {
                bandera = false;
                mostrarMensaje(1, _this.idioma.lbNoModificacion);
            }
            elementosXtabla = _this.agruparElementosXtabla(elementosXtabla);
            objEnv.elementosXtabla = elementosXtabla;
            _this.items.items[j].items.items[1].setActiveTab(0);
            if (bandera) {
                if (objEnv.idindicador) {
                    arrayObj.push(objEnv);
                } else {
                    bandera = false;
                    mostrarMensaje(1, _this.idioma.lbValoreIncorrectoIndicador);
                }
            } else {
                break;
            }
        }
        if (bandera) {
            for (var j = 0; j < _this.items.items.length; j++) {

                for (var i = 0; i < _this.items.items[j].items.items[1].items.items.length; i++) {
                    _this.items.items[j].items.items[1].setActiveTab(i);

                    //_this.items.items[j].items.items[1].items.items[i].LimpiarValoresCmp();
                }
                _this.items.items[j].items.items[1].setActiveTab(0);

            }

            return arrayObj;
        }
    },
    agruparElementosXtabla: function(martiz) {
        martiz = this.alinearMatriz(martiz);
        var _this = this;
        var arrResul = new Array();
        var a = 0;
        while (a < martiz.length) {
            if (_this.findObjetMatriz(arrResul, martiz[a]) == -1) {
                var obj = {};
                obj.idtabla = martiz[a].idtabla;
                obj.datos = new Array();
                for (var i = 0; i < martiz.length; i++) {
                    if (martiz[a].idtabla == martiz[i].idtabla) {
                        obj.datos = obj.datos.concat(martiz[i].datos);
                    }
                }
                obj.datos = _this.encabsularDatos(obj.datos);
                arrResul.push(obj);
            }
            a++;
        }
        return arrResul;
    },
    encabsularDatos: function(datos) {
        var resp = {};
        for (var i = 0; i < datos.length; i++) {
            for (var property in datos[i]) {
                resp[property] = datos[i][property];
            }
        }
        return resp;
    },
    findObjetMatriz: function(matriz, obj) {
        for (var i = 0; i < matriz.length; i++) {
            if (matriz[i].idtabla == obj.idtabla) {
                return 1;
            }
        }
        return -1;
    },
    alinearMatriz: function(matriz) {
        var resultado = new Array();
        for (var i = 0; i < matriz.length; i++) {
            resultado = resultado.concat(matriz[i]);
        }
        return resultado;
    },
    LimpiarDatosTab: function(apli) {
        var _this = this;
        for (var j = 0; j < _this.items.items.length; j++) {
            for (var i = 0; i < _this.items.items[j].items.items[1].items.items.length; i++) {
                _this.items.items[j].items.items[1].items.items[i].LimpiarValoresCmp();
            }
        }
    },
    cargarTabDatosDinamicos: function(record, panel1, noTab, clonar) {
        var _this = this;
        var idregnumerico = null;
        var idindicador = null;
        var arridtablas = null;
        var idtabla = -1;
        if (record) {
            idregnumerico = record.data.idregnumerico;
            idindicador = record.data.idindicador;
            arridtablas = record.data.arridtablas;
            idtabla = record.data.idtabla;
        }
        var mask = new Ext.LoadMask(Ext.getCmp('idwingestregnumeric').getEl(), {msg: "Cargando configuraci&oacute;n..."}, {msgCls: 'mask-css'});
        mask.show();
        Ext.Ajax.request({
            url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/cargarconfiguracionDatos',
            method: 'POST',
            params: {
                idindicador: idindicador,
                idregnumerico: idregnumerico,
                arridtablas: arridtablas,
                idtabla: idtabla
            },
            callback: function(options, success, response) {
                response = Ext.util.JSON.decode(response.responseText);
                mask.hide();
                var componentes = response.datos.componentes;
                var datos = response.datos.datos;
                _this.crearTabsDinamicos(componentes, datos, panel1, noTab, clonar);
            }
        });
    },
    crearTabsDinamicos: function(componentes, datos, panel1, noTab, clonar) {
        var _this = this;
        var taps = _this.crearArregloTaps(componentes, datos);
        var tab = (panel1) ? panel1.items.items[1] : _this.getActiveTab().items.items[1];
        var tabEliminar = Array()
        for (var k = 0; k < tab.items.items.length; k++) {
            if (tab.items.items[k].dinamico) {
                tabEliminar.push(tab.items.items[k]);
            }
        }
        for (var g = 0; g < tabEliminar.length; g++) {
            tab.remove(tabEliminar[g]);
        }
        for (var i = 0; i < taps.length; i++) {
            var componentesdelTab = new Array();
            var componentesAuxdelTab = new Array();
            var cont = 1;
            for (var j = 0; j < componentes.length; j++) {
                var record = componentes[j];
                if (record.tab == taps[i]) {
                    var data = record.data;
                    var field = _this.getCmpfromData(record);
                    field.id = field.id + '-' + cont;
                    cont++;
                    /**
                     *  Caso especial de atributos dinámicos de tipo nomencladores
                     */
                    if (record.xtype == 'combo') {

                        var combo = field;
                        var store = combo.store;

                        var index = store.find(combo.initialConfig.hiddenName, data);
                        if (index != -1)
                            data = store.getAt(index).get(combo.initialConfig.displayField);
                        field.value = data;
                        if (_this.busqAvanzada) {
                            combo.allowBlank = true;
                        }
                        componentesdelTab.push(combo);
                    } else {
                        field.value = data;

                        if (record.xtype == 'textarea') {
                            field.height = 72;
                        }
                        if (record.xtype == 'checkbox') {
                            componentesAuxdelTab.push({
                                xtype: 'hidden',
                                name: field.name,
                                idtabla: field.idtabla,
                                id: field.id + 'checkbox'
                            });
                            field.checked = (data == "Si");
                            field.inputValue = 1;

                            field.handler = function(fi, newValue) {
                                if (newValue == false) {
                                    Ext.getCmp(fi.id + 'checkbox').setValue("2");
                                } else {
                                    Ext.getCmp(fi.id + 'checkbox').setValue("1");
                                }

                            };
                            field.name = "";
                        }
                        if (_this.busqAvanzada) {
                            field.allowBlank = true;
                        }
                        componentesdelTab.push(field);

                    }
                }
            }
            var panel = new Ext.LOG.RegNumOperativo.PanelDatosGenerales({
                title: taps[i],
                idioma: _this.idioma,
                id: 'idTabDinam' + taps[i],
                //idarea: _this.idarea,
                region: 'center',
                dinamico: 1,
                modificar:_this.modificar,
                listaAcciones: _this.listaAcciones,
                componentes: componentesdelTab,
                componentesAux: componentesAuxdelTab,
                tabPanelContenedor: _this
            });
            //      tab.add(panel);
            tab.insert(tab.items.length - 1, panel);
        }
        if (noTab == clonar) {
            Ext.getBody().unmask();
        }
        tab.setActiveTab(0);
    },
    crearArregloTaps: function(componentes) {
        var tabs = new Array();
        for (var i = 0; i < componentes.length; i++) {
            if (tabs.length == 0) {
                tabs.push(componentes[i].tab);
            } else {
                var existe = tabs.indexOf(componentes[i].tab);
                if (existe == -1) {
                    tabs.push(componentes[i].tab);
                }
            }
        }
        return tabs;
    },
    getCmpfromData: function(pTupla) {
        var _expresionReg = function _expresionReg(tupla) {
            if (pTupla['regex'] && pTupla['regex'] != "" && pTupla['regex'] != "//") {
                tupla['maskRe'] = Ext.decode(pTupla['regex']);
                tupla['regex'] = Ext.decode(pTupla['regex']);
            }
            return tupla;
        }
        var _adecuarStore = function _adecuarStore(tupla) {
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
        }

        var _adecuarCombo = function _adecuarCombo(tupla, _adecuarStore) {
            var store = _adecuarStore(tupla);
            var combo = new Ext.form.ComboBox({
                tpl: '<tpl for="."><div ext:qtip="{' + tupla.displayField + '}" class="x-combo-list-item">{' + tupla.displayField + '}</div></tpl>',
                hiddenName: tupla.hiddenName,
                valueField: tupla.valueField,
                displayField: tupla.displayField,
                allowBlank: tupla.allowBlank,
                editable: false,
                //id: tupla.id,
                name: tupla.hiddenName,
                fieldLabel: (tupla.fieldLabel) ? tupla.fieldLabel : tupla.hiddenName,
                lazyRender: true,
                store: store,
                mode: 'local',
                typeAhead: true,
                triggerAction: 'all'
            });

            return combo;
        }

        var tupla = {};
        for (var item in pTupla) {
            var cont = 1;
            if (/*item != 'xtype' && */item != 'anchor'/* && item != 'fieldLabel' */ && item != 'regex') {
                tupla[item] = pTupla[item];
            }
        }
        function _getCmp(pTupla, tupla, _expresionReg, _adecuarCombo, _adecuarStore) {

            var date = new Date();
            var idcomponente = 'idcomp_' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

            tupla.enableKeyEvents = true;

            var componente;
            switch (pTupla.xtype) {
                case 'numberfield' :
                    componente = new Ext.form.NumberField(_expresionReg(tupla));
                    break;

                case 'textarea' :
                    componente = new Ext.form.TextArea(_expresionReg(tupla));
                    break;

                case 'combo' :

                    componente = _adecuarCombo(tupla, _adecuarStore);
                    break;

                case 'checkbox' :

                    componente = new Ext.form.Checkbox(tupla);
                    break;

                case 'datefield' :
                    componente = new Ext.form.DateField(tupla);
                    componente.format = 'd/m/Y';
                    break;

                default :
                    componente = new Ext.form.TextField(_expresionReg(tupla));
                    break;
            }

            componente.id = idcomponente;
            componente.idtabla = pTupla.idtabla;
            return componente;
        }

        return  _getCmp(pTupla, tupla, _expresionReg, _adecuarCombo, _adecuarStore);
    }
});


Ext.LOG.RegNumOperativo.PanelDatosIndicador = Ext.extend(Ext.Panel, {
    constructor: function(config) {
        var _this = this;
        _this.panelContent = config.panelContent;
        _this.marcadoPrimero = true;
        _this.idindicador = null;
        _this.listeners = {
            'destroy': function() {
                if (_this.ventanaActivos) {
                    _this.ventanaActivos.destroy();
                }
            }
        }
        Ext.apply(this, config);

        _this.cbconvertir = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbConvertirModulo,
            name: 'cbconvertir',
            hideLabel: true,
            anchor: '95%',
            cls: "clschkbModulo",
            disabled: true,
            listeners: {
                check: function(ckeck, marcado) {
                    if (marcado == true) {
                        _this.crearTabmodulo(ckeck, marcado, _this.plantilla);
                        _this.panelContent.esmodulo = 2;
                    }
                    else if (marcado == false) {
                        _this.eliminarTabmodulo(ckeck, marcado);
                        _this.panelContent.esmodulo = 1;
                    }
                }
            }
        });
        _this.storeTipoMedio = new Ext.data.SimpleStore({
            fields: ['idindicador', 'denominacion']
        });

        _this.comboTipoMedio = new Ext.form.ComboBox({
//            width: 140,
            anchor: '98%',
            valueField: 'idindicador',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: _this.idioma.lbCbVacio,
            //labelWidth:5,
            store: _this.storeTipoMedio,
            minChars: 0,
            fieldLabel: 'Medio',
            labelStyle: 'font-size:13.2',
            forceSelection: true,
            disabled: (_this.modificar) ? true : false,
            mode: 'local',
            listeners: {
                'focus': function() {
                    if (_this.winsGest && _this.winsGest.isVisible()) {
                        _this.winsGest.close();
                        _this.panelContent.panelBotones.btnAddNuevoReg.handler();
                    } else {
                        _this.onBtnAdicionarProdClick();
                    }
                }
            }
        });
        _this.labelGroup = new Ext.form.Label({xtype: 'label', text: "Grupo" + ':', cls: "labelGroup"});

        _this.panelDatosDecombo = new Ext.Panel({
            region: 'center',
            layout: 'column',
            border: false,
            autoScroll: true,
            items: [
                {
                    columnWidth: .80,
                    layout: 'form',
                    labelWidth: 40,
                    items: [_this.comboTipoMedio,
                        _this.labelGroup
                    ]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [_this.cbconvertir
                    ]
                }
            ]
        });
        _this.items = [_this.panelDatosDecombo];

        Ext.LOG.RegNumOperativo.PanelDatosIndicador.superclass.constructor.apply(this, arguments);

    },
    onBtnAdicionarProdClick: function() {
        var _this = this;
        var LoadMask = new Ext.LoadMask(Ext.getCmp('idwingestregnumeric').getEl(), {msg: "Cargando datos de indicador..."}, {msgCls: 'mask-css'});
        LoadMask.show();
        LOG.inv.maestroproductos.Loader.init(function() {
            if (!_this.ventanaActivos) {
                _this.idseleccionados = new Array();

                _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                    tipo: 1,
                    usarAplicar: false,
                    showArbol: true,
                    usarMarcaModelo: true,
                    modoSeleccion: 1,
                    parametros: {
                        explotacion: 1
                    },
                    listeners: {
                        'show': function() {
                            LoadMask.hide();
                        }
                    },
                    doAction: function(record_seleccionado, e) {
                        if (record_seleccionado[0].data.idnaturaleza != null) {
                            _this.configurarVentana(record_seleccionado[0]);
                            _this.idseleccionados.push(record_seleccionado[0].data.idindicador);
                            if (!_this.busqAvanzada) {
                                _this.cbconvertir.enable();
                            }
                        } else {
                            mostrarMensaje(1, _this.idioma.msgindicadorSinnaturaleza);
                            _this.configurarVentana(record_seleccionado[0]);
                            _this.winsGest.btnAplicarWin.disable();
                            _this.winsGest.btnAceptarWin.disable();
                        }
                    }
                });
                _this.ventanaActivos.show();
                _this.ventanaActivos.panelProductos.getGridPrincipal().on({
                    'rowdblclick': function(grid,row,e) {
                        var recordSelected = _this.ventanaActivos.panelProductos.getSmPrincipal().getSelections();
                        _this.ventanaActivos.doAction(recordSelected);
                        _this.ventanaActivos.close();
                    }
                });
            } else {
                _this.ventanaActivos.show();
                _this.ventanaActivos.panelProductos.getStorePrincipal().baseParams.idseleccionados = Ext.encode(_this.idseleccionados);
                _this.ventanaActivos.panelProductos.getStorePrincipal().load();
                _this.ventanaActivos.show();
            }
        });
    },
    configurarVentana: function(record_seleccionado, modificar, panel1, clonar) {
        var _this = this;
        _this.idindicador = record_seleccionado.data.idindicador;
        _this.recordIndicador = record_seleccionado;
        _this.panelContent.idindicador = record_seleccionado.data.idindicador;
        _this.panelContent.idtabla = record_seleccionado.data.idtabla;
        _this.panelContent.idtablageneral = record_seleccionado.data.idtablageneral;
        _this.panelContent.cargarTabDatosDinamicos(record_seleccionado, panel1, _this.notab, clonar);
        _this.crearTabDatosporNaturaleza(record_seleccionado.data.idnaturaleza, panel1, modificar, clonar);
        _this.adicionarProductos(record_seleccionado, panel1);
        if (record_seleccionado.data.idregnumerico && modificar) {
            if (record_seleccionado.data.esmodulo == 2) {
                _this.cbconvertir.setValue(true);
                _this.esmodulo = 2;
            } else {
                _this.cbconvertir.setValue(false);
                _this.esmodulo = 1;
            }
        }
    },
    crearTabDatosporNaturaleza: function(idnaturaleza, panel1, modifificar, clonar) {
        var _this = this;
        var tabDatosGenerales = (panel1) ? panel1.items.items[1] : _this.panelContent.getActiveTab().items.items[1];

        if (_this.paneldatosgenerales) {
            tabDatosGenerales.remove(_this.paneldatosgenerales);
        }
        _this.paneldatosgenerales = new Ext.LOG.RegNumOperativo.PanelDatosGenerales({
            idioma: _this.panelContent.idioma,
            treegridPrincipal: _this.treegridPrincipal,
            clonar: clonar,
            cant: _this.notab,
            principal:true,
            modificar: _this.modificar,
            busqAvanzada: _this.busqAvanzada,
            listaAcciones: _this.listaAcciones,
            title: 'Datos generales',
            region: 'center',
            dinamico: 0,
            fnDatosEspesificosNaturaleza: function(componentes) {
                _this.crearTabDatosEspesificosNaturaleza(idnaturaleza, panel1, modifificar, clonar, componentes);
            },
            idnaturaleza: idnaturaleza,
            winsGest:_this.winsGest,
            tabDatosGenerales:tabDatosGenerales,
            recordTree: (modifificar) ? _this.recordTree : null,
            tabPanelContenedor: _this.panelContent
        });
         tabDatosGenerales.insert(0, _this.paneldatosgenerales);   
    },
    crearTabDatosEspesificosNaturaleza: function(idnaturaleza, panel1, modifificar, clonar, componentes) {
        var _this = this;
        var respData = {
            datos: componentes.atributos
        }
        var tabDatosGenerales = (panel1) ? panel1.items.items[1] : _this.panelContent.getActiveTab().items.items[1];
        var nameSpace = componentes.nameSpaceTabDatos;

       /* if (_this.paneldatosEspesificosNaturaleza) {
            tabDatosGenerales.remove(_this.paneldatosEspesificosNaturaleza);
        }*/

        _this.paneldatosEspesificosNaturaleza =  /*nameSpace*/new Ext.LOG.RegNumOperativo.PanelDatosGenerales({
            idioma: _this.panelContent.idioma,
            treegridPrincipal: _this.treegridPrincipal,
            datosEspesificosPlugins: true,
            listaAcciones: _this.listaAcciones,
            componentes: respData,
            clonar: clonar,
            cant: _this.notab,
            modificar: _this.modificar,
            busqAvanzada: _this.busqAvanzada,
            title: componentes.namePlugin,
            region: 'center',
            dinamico: 0,
            fnDatosEspesificosNaturaleza: function() {
                _this.crearTabDatosEspesificosNaturaleza();
            },
            idnaturaleza: idnaturaleza,
            recordTree: (modifificar) ? _this.recordTree : null,
            tabPanelContenedor: _this.panelContent
        });
        tabDatosGenerales.insert(0, _this.paneldatosEspesificosNaturaleza);
    },
    adicionarProductos: function(records, panel1) {
        var _this = this;
        var valueCmb = records.json.text;
        var text = _this.labelGroup.text;
        if (records.data.descripciongrupo != null) {
            _this.labelGroup.setText(_this.labelGroup.text + " " + records.data.descripciongrupo);
        }
        _this.panelDatosDecombo.idprod = records.data.idprod;
        _this.panelDatosDecombo.idtabla = records.data.idtabla;
        _this.panelDatosDecombo.idtablageneral = records.data.idtablageneral;
        _this.comboTipoMedio.reset();
        _this.comboTipoMedio.setValue(valueCmb);

    },
    crearTabmodulo: function(check, marcado, plantilla) {
        var _this = this;
        var objRegnumerico = null;
        if (_this.modificar) {
            objRegnumerico = {
                idregnumerico: _this.recordTree.data.idregnumerico,
                izquierdo: _this.recordTree.data.ordenizqmodulo,
                derecho: _this.recordTree.data.ordendermodulo
            }
        }
        _this.datosModulo = new Ext.LOG.RegNumOperativo.PanelModulo({
            idioma: _this.idioma,
            plantilla: plantilla,
            modificar: _this.modificar,
            notab: _this.notab,
            id: 'idPanelModulo' + _this.notab,
            idregnumerico: (_this.modificar) ? _this.recordTree.data.idregnumerico : null,
            //idarea: _this.idarea,
            treegridPrincipal: _this.treegridPrincipal,
            panelContent: _this.panelContent,
            objRegnumerico: objRegnumerico
        });
        var activatetab = Ext.getCmp('idregistro' + _this.notab);
        var tabDatosGenerales = activatetab.items.items[1];
        tabDatosGenerales.add(_this.datosModulo);
        if ((_this.modificar && !_this.marcadoPrimero) || !_this.modificar) {
            if (marcado) {
                tabDatosGenerales.setActiveTab(_this.datosModulo);
                activatetab.items.items[0].collapse(true);
            }
        } else {
            _this.marcadoPrimero = false;
        }
    },
    eliminarTabmodulo: function(check, marcado) {
        var _this = this;
        var activatetab = Ext.getCmp('idregistro' + _this.notab);

        var tabDatosGenerales = activatetab.items.items[1];
        var tabElimin = tabDatosGenerales.findById('idPanelModulo' + _this.notab);
        tabDatosGenerales.remove(tabElimin);
    }
});

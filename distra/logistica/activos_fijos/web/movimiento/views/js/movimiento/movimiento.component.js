/**
 *  Javier Martin Rojas
 *  02/09/2013
 **/
/**
 *  Javier Martin Rojas
 *  Modificado por: Jorge Luis Cuellar y Adrian Fernandez
 *
 *
 *  02/09/2013
 **/

Ext.ns('Ext.aft');
Ext.ns('Ext.aft.movActivosFijos');
teclascalientes = true;

Ext.aft.movActivosFijos = Ext.extend(Ext.aft.movimiento, {
    bloqueada: false,
    ventanaActivos: false,
    idioma: false,
    urlControladora: '/logistica/activos_fijos/movimiento/index.php/movimiento/',
    constructor: function(config) {

        var _this = this;

        Ext.apply(this, config);
        Ext.Ajax.request({
            url: _this.urlControladora + 'cargaretiquetas',
            method: 'POST',
            callback: function(o, s, r) {
                _this.idioma = Ext.decode(r.responseText);
                _this._initComponent();
            }
        });

        _this.inventarioTotal = config.datos.inventarioTotal;
        _this.inventarioParcial = config.datos.inventarioParcial;
        _this.operacionAjuste = config.datos.operacionAjuste;

        Ext.aft.movActivosFijos.superclass.constructor.call(this);
    },
    _initComponent: function() {
        var _this = this;
        var title = _this.idioma.lbMsgTitleWinMovs;
        if (!_this.idioma) {
            throw 'No se ha cargado el idioma';
        }

        Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');

        title = title.replace('_tipoDoc', _this.datos.tipodoc);
        title = title.replace('_nroDoc', _this.datos.nrodoc);

        this.title = title;
        this.idmovseleccionado = 0; //  Variable utilizada para no recargar los atributos dinámicos innecesariamente.


        this.smCentral = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            moveEditorOnEnter: false,
            listeners: {
                'rowselect': function(sm, rowIndex, record) {
                    _this.gestionarBotones();
                },
                'rowdeselect': function(sm, rowIndex, record) {
                    _this.propertyGridAtribDinamicos.setContenido();
                    pEast.collapse();
                    _this.idmovseleccionado = null;
                    _this.gestionarBotones();
                }
            }
        });

        this.columnsCentral = [
            new Ext.grid.RowNumberer({
                header: 'N\xBA.',
                width: 30
            }), {
                header: this.idioma.hdCodProd,
                width: 100,
                dataIndex: 'codigo'
            }, {
                header: this.idioma.hdDenominacion,
                width: 150,
                dataIndex: 'denominacion',
                id: 'expandir',
                renderer: function(value, meta, record) {
                    var marcamodelo = record.get('descripcionmarcamodelo');

                    return value + ((marcamodelo != null) ? ' ' + marcamodelo : ' ');
                }
            }/*, {
             header: this.idioma.hdNacionalidad,
             width: 120,
             dataIndex: 'descripcionnacionalidad'
             }*/, {
                header: this.idioma.hdGrupo,
                width: 120,
                dataIndex: 'descripciongrupo'
            }, {
                header: this.idioma.hdCantidad,
                width: 80,
                align: 'right',
                editable: false, // (!_this.inventarioParcial && !_this.inventarioTotal),
                dataIndex: 'cantidad',
                renderer: function(value, meta, record) {
                    var valor = record.data.cantidad;
                    return parseInt(valor);
                },
                editor: new Ext.form.NumberField({
                    regexp: /^[0-9]{1,25}$/,
                    selectOnFocus: (!_this.inventarioParcial && !_this.inventarioTotal)
//                        listeners:{
//                            focus: function(t){
//                                t.selectText(0,t.getValue().length);
//                            }
//                        }
                })
            }
        ];

        var fields_reader_stCentral = [
            {
                name: 'idproducto'
            },
            {
                name: 'idgruposubgrupo'
            },
            {
                name: 'codigo'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'descripcionnacionalidad'
            },
            {
                name: 'descripciongrupo'
            },
            {
                name: 'idnaturaleza'
            },
            {
                name: 'idmovimiento'
            },
            {
                name: 'cantidad'
            },
            {
                name: 'descripcionmarcamodelo'
            },
            {
                name: 'arridtablas'
            },
            {
                name: 'arridtablasgenerales'
            },
            {
                name: 'idtabla'
            },
            {
                name: 'idtablageneral'
            },
            {
                name: 'idprod'
            },
            {
                name: 'vidautil'
            },
            {
                name: 'coeficiente'
            },
            {
                name: 'porcientorecuperacion'
            },
            {
                name: 'tasafiscal'
            }
        ];
        if (_this.inventarioParcial && (_this.datos.idarearesp == _this.datos.identidadpadre)) {
            this.columnsCentral.push({
                id: 'area',
                hidden: true,
                hideable: false,
                header: '\xc1rea',
                width: 250,
                dataIndex: 'area'
            });
            fields_reader_stCentral.push({name: 'idestructuraop'});
            fields_reader_stCentral.push({name: 'area'});

            this.stCentral = new Ext.data.GroupingStore({
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarproductos',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad',
                    fields: fields_reader_stCentral
                }),
                remoteSort: true,
                sortInfo: {
                    field: 'codigo',
                    direction: "ASC"
                },
                groupField: 'area',
                listeners: {
                    'beforeload': function(store, opts) {
                        store.baseParams.iddocumento = _this.datos.iddocumento;

                        if (_this.tfCodigo) {
                            store.baseParams.codigo = _this.tfCodigo.getValue();
                        }

                        if (_this.tfDenominacion) {
                            store.baseParams.denominacion = _this.tfDenominacion.getValue();
                        }

                        if (_this.cbGrupo) {
                            store.baseParams.idgruposubgrupo = _this.cbGrupo.getValue();
                        }

                        if (_this.inventarioParcial) {
                            store.baseParams.idarearesp = _this.datos.idarearesp;
                            store.baseParams.porcientoInventario = _this.datos.porcientoInventario;
                            store.baseParams.idnaturalezasInventario = _this.datos.idnaturalezasInventario;
                            store.baseParams.idmediosInventario = _this.datos.idmediosInventario;
                            store.baseParams.idespecialidadesInventario = _this.datos.idespecialidadesInventario;
                            store.baseParams.idareasInventario = _this.datos.idareasInventario;
                            store.baseParams.identidad = _this.datos.identidadpadre;
                            store.baseParams.mensualInventario = _this.datos.mensualInventario;
                            store.baseParams.inventarioParcial = 2;
                            if (_this.datos.idestado != 1) {
                                store.baseParams.iddocumento = _this.datos.iddocumento;
                            } else {
                                store.baseParams.iddocumento = "";
                            }
                        }
                    },
                    'load': function(store, records, options) {
                        if (((_this.datos.idestado == '1' && _this.datos.tipo_interfaz == "entrada") || (_this.datos.idestado == 1 && _this.datos.tipo_interfaz == "entrada")) && store.getCount() == 0) {
                            _this.btnImportarListado.enable();
                        } else {
                            _this.btnImportarListado.disable();
                        }
                        _this.gestionarBotones();
                        _this.idmovseleccionado = null;

                        var es_busqueda = false;
                        if (store.baseParams.codigo != 'undefined' || store.baseParams.denominacion != 'undefined' || store.baseParams.idgruposubgrupo != '') {
                            es_busqueda = true;
                        }

                        if (records.length == 0 && !es_busqueda) {
                            _this.onBtnAdicionarProdClick();
                        } else if (records.length == 0 && es_busqueda) {
                            mostrarMensaje(1, _this.idioma.msgNoExistDatos);
                        } else {
                            if (pEast) {
                                pEast.collapse();
                            }
                        }
                        Ext.getBody().unmask();
                    }
                }
            });


            this.view = new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]})'
            });
        } else if (_this.inventarioTotal) { //Inventario totales
            this.columnsCentral.push({
                id: 'area',
                hidden: true,
                hideable: false,
                header: '\xc1rea',
                width: 250,
                dataIndex: 'area'
            });
            fields_reader_stCentral.push({name: 'idestructuraop'});
            fields_reader_stCentral.push({name: 'area'});

            this.stCentral = new Ext.data.GroupingStore({
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarproductos',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad',
                    fields: fields_reader_stCentral
                }),
                remoteSort: true,
                sortInfo: {
                    field: 'codigo',
                    direction: "ASC"
                },
                groupField: 'area',
                listeners: {
                    'beforeload': function(store, opts) {
                        store.baseParams.identidad = _this.datos.idarearesp;
                        store.baseParams.inventarioTotal = _this.inventarioTotal;

                        if (_this.datos.idestado != 1) {
                            store.baseParams.iddocumento = _this.datos.iddocumento;
                        } else {
                            store.baseParams.iddocumento = "";
                        }

                    },
                    'load': function(store, records, options) {
                        _this.gestionarBotones();
                        Ext.getBody().unmask();
                    }
                }
            });

            this.view = new Ext.grid.GroupingView({
                forceFit: true,
                groupTextTpl: '{text} ({[values.rs.length]})'
            });
        }
        else { //Cualquier tipo de movimientos
            this.stCentral = new Ext.data.Store({
                url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarproductos',
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    totalProperty: 'cantidad',
                    fields: fields_reader_stCentral
                }),
                listeners: {
                    'beforeload': function(store, opts) {
                        store.baseParams.iddocumento = _this.datos.iddocumento;

                        if (_this.tfCodigo) {
                            store.baseParams.codigo = _this.tfCodigo.getValue();
                        }

                        if (_this.tfDenominacion) {
                            store.baseParams.denominacion = _this.tfDenominacion.getValue();
                        }

                        if (_this.cbGrupo) {
                            store.baseParams.idgruposubgrupo = _this.cbGrupo.getValue();
                        }
                        if (_this.inventarioParcial) {
                            store.baseParams.idarearesp = _this.datos.idarearesp;
                            store.baseParams.porcientoInventario = _this.datos.porcientoInventario;
                            store.baseParams.idnaturalezasInventario = _this.datos.idnaturalezasInventario;
                            store.baseParams.idmediosInventario = _this.datos.idmediosInventario;
                            store.baseParams.idespecialidadesInventario = _this.datos.idespecialidadesInventario;
                            store.baseParams.idareasInventario = _this.datos.idareasInventario;
                            store.baseParams.identidad = _this.datos.identidadpadre;
                            store.baseParams.mensualInventario = _this.datos.mensualInventario;
                            store.baseParams.inventarioParcial = 2;
                            if (_this.datos.idestado != 1) {
                                store.baseParams.iddocumento = _this.datos.iddocumento;
                            } else {
                                store.baseParams.iddocumento = "";
                            }
                        }
                    },
                    'load': function(store, records, options) {

                        if (((_this.datos.idestado == '1' && _this.datos.tipo_interfaz == "entrada") || (_this.datos.idestado == 1 && _this.datos.tipo_interfaz == "entrada")) && store.getCount() == 0) {
                            _this.btnImportarListado.enable();
                        } else {
                            _this.btnImportarListado.disable();
                        }
                        _this.gestionarBotones();
                        _this.idmovseleccionado = null;

                        var es_busqueda = false;
                        if (store.baseParams.codigo != 'undefined' || store.baseParams.denominacion != 'undefined' || store.baseParams.idgruposubgrupo != '') {
                            es_busqueda = true;
                        }

                        if (records.length == 0 && !es_busqueda) {
                            _this.onBtnAdicionarProdClick();
                        } else if (records.length == 0 && es_busqueda) {
                            mostrarMensaje(1, _this.idioma.msgNoExistDatos);
                        } else {
                            if (pEast) { // XXX revizar donde esta este pEast
                                pEast.collapse();
                            }
                        }
                        Ext.getBody().unmask();
                    }
                }
            });
        }

        /*if (!_this.inventarioTotal) {
         this.stCentral = new Ext.data.Store({
         url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarproductos',
         reader: new Ext.data.JsonReader({
         root: 'datos',
         totalProperty: 'cantidad',
         fields: fields_reader_stCentral
         }),
         listeners: {
         'beforeload': function(store, opts) {
         store.baseParams.iddocumento = _this.datos.iddocumento;
         
         if (_this.tfCodigo) {
         store.baseParams.codigo = _this.tfCodigo.getValue();
         }
         
         if (_this.tfDenominacion) {
         store.baseParams.denominacion = _this.tfDenominacion.getValue();
         }
         
         if (_this.cbGrupo) {
         store.baseParams.idgruposubgrupo = _this.cbGrupo.getValue();
         }
         
         if (_this.inventarioParcial) {
         store.baseParams.idarearesp = _this.datos.idarearesp;
         store.baseParams.porcientoInventario = _this.datos.porcientoInventario;
         store.baseParams.idnaturalezasInventario = _this.datos.idnaturalezasInventario;
         store.baseParams.idmediosInventario = _this.datos.idmediosInventario;
         store.baseParams.idespecialidadesInventario = _this.datos.idespecialidadesInventario;
         store.baseParams.idareasInventario = _this.datos.idareasInventario;
         store.baseParams.identidad = _this.datos.identidadpadre;
         store.baseParams.mensualInventario = _this.datos.mensualInventario;
         store.baseParams.inventarioParcial = 2;
         if (_this.datos.idestado != 1) {
         store.baseParams.iddocumento = _this.datos.iddocumento;
         } else {
         store.baseParams.iddocumento = "";
         }
         }
         },
         'load': function(store, records, options) {
         if (((_this.datos.idestado == '1' && _this.datos.tipo_interfaz == "entrada") || (_this.datos.idestado == 1 && _this.datos.tipo_interfaz == "entrada")) && store.getCount() == 0) {
         _this.btnImportarListado.enable();
         } else {
         _this.btnImportarListado.disable();
         }
         _this.gestionarBotones();
         _this.idmovseleccionado = null;
         
         var es_busqueda = false;
         if (store.baseParams.codigo != 'undefined' || store.baseParams.denominacion != 'undefined' || store.baseParams.idgruposubgrupo != '') {
         es_busqueda = true;
         }
         
         if (records.length == 0 && !es_busqueda) {
         _this.onBtnAdicionarProdClick();
         } else if (records.length == 0 && es_busqueda) {
         mostrarMensaje(1, _this.idioma.msgNoExistDatos);
         } else {
         if (pEast) { // XXX revizar donde esta este pEast
         pEast.collapse();
         }
         }
         Ext.getBody().unmask();
         }
         }
         });
         }
         else {
         this.columnsCentral.push({
         id: 'area',
         hidden: true,
         hideable: false,
         header: '\xc1rea',
         width: 250,
         dataIndex: 'area'
         });
         fields_reader_stCentral.push({name: 'idestructuraop'});
         fields_reader_stCentral.push({name: 'area'});
         
         this.stCentral = new Ext.data.GroupingStore({
         url: '/logistica/activos_fijos/movimiento/index.php/movimiento/cargarproductos',
         reader: new Ext.data.JsonReader({
         root: 'datos',
         totalProperty: 'cantidad',
         fields: fields_reader_stCentral
         }),
         remoteSort: true,
         sortInfo: {
         field: 'codigo',
         direction: "ASC"
         },
         groupField: 'area',
         listeners: {
         'beforeload': function(store, opts) {
         store.baseParams.identidad = _this.datos.idarearesp;
         store.baseParams.inventarioTotal = _this.inventarioTotal;
         
         if (_this.datos.idestado != 1) {
         store.baseParams.iddocumento = _this.datos.iddocumento;
         } else {
         store.baseParams.iddocumento = "";
         }
         
         },
         'load': function(store, records, options) {
         _this.gestionarBotones();
         Ext.getBody().unmask();
         }
         }
         });
         
         this.view = new Ext.grid.GroupingView({
         forceFit: true,
         '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "' + 'Productos' + '" : "' + 'Producto' + '"]})'
         });
         }*/

        this.tfCodigo = new Ext.form.TextField({
            enableKeyEvents: true,
            id: 'idcodigom',
            autoCreate: true,
            width: 100,
            maskRe: /^[0-9]/,
            maxLength: 255,
            maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.stCentral.load();
                    }
                }
            }
        });

        this.tfDenominacion = new Ext.form.TextField({
            enableKeyEvents: true,
            width: 150,
            maskRe: '/^([a-zA-ZáéíóúñüÑ0-9-_/.]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.]*)+$/',
            regex: '/^([a-zA-ZáéíóúñüÑ0-9-_/.]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.]*)+$/',
            maxLength: 255,
            maxLengthText: _this.idioma.lbMsgMaxLongDescripcion,
            regexText: _this.idioma.lbMsgInfoCaract,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.stCentral.load();
                    }
                }
            }
        });

        this.cbGrupo = new Ext.form.ComboBox({
            width: 200,
            displayField: 'denominacionlarga',
            valueField: 'idgruposubgrupo',
            hiddenName: 'idgruposubgrupo',
            triggerAction: 'all',
            selectOnFocus: true,
            forceSelection: true,
            minChars: 0,
            tpl: '<tpl for="."><div ext:qtip="{denominacionlarga}" class="x-combo-list-item">{denominacionlarga}</div></tpl>',
            pageSize: 20,
            resizable: true,
            listWidth: 300,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        _this.stCentral.load();
                    }
                }
            },
            store: new Ext.data.Store({
                url: _this.urlControladora + 'cargargrupos',
                autoLoad: true,
                reader: new Ext.data.JsonReader({
                    root: 'datos',
                    id: 'idgruposubgrupo'
                }, [
                    {
                        name: 'idgruposubgrupo'
                    },
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'denominacionlarga'
                    }
                ])
            })
        });

        this.btnBuscar = new Ext.Button({
            iconCls: 'buscar',
            text: _this.idioma.lbBuscarBtn,
            tooltip: _this.idioma.lbTtBtnBuscar,
            handler: function() {
                _this.stCentral.load();
            }
        });

        this.btnLimpiar = new Ext.Button({
            iconCls: 'limpiar',
            text: _this.idioma.lbLimpiarBtn,
            tooltip: _this.idioma.lbTtBtnLimpiar,
            handler: function() {
                _this.tfCodigo.reset();
                _this.tfDenominacion.reset();
                _this.cbGrupo.reset();
                _this.stCentral.load();

            }
        });

        this.tbarGridCentral = ['', {
                xtype: 'label',
                text: _this.idioma.lbCodigo
            }, '', _this.tfCodigo, '', {
                xtype: 'label',
                text: _this.idioma.lbDescrip
            }, '', _this.tfDenominacion, '', {
                xtype: 'label',
                text: _this.idioma.hdGrupo + ':'
            }, '', _this.cbGrupo, '', _this.btnBuscar, _this.btnLimpiar];

        var tBarGeneralDefaul = this.getTbarDefault();

        this.btnRegistro = new Ext.Button({
            iconCls: 'numeroserie',
            text: _this.idioma.lbBtnRegistro,
            tooltip: _this.idioma.lbTtBtnRegistro,
            disabled: true,
            handler: function() {
                _this.onBtnRegistroNumericoClick();
            }
        });

        var copyTBarGeneralDefaul = Array();

        copyTBarGeneralDefaul.push(tBarGeneralDefaul[0]);
        copyTBarGeneralDefaul.push(tBarGeneralDefaul[1]);
        copyTBarGeneralDefaul.push(tBarGeneralDefaul[2]);
        copyTBarGeneralDefaul.push(_this.btnRegistro);
        copyTBarGeneralDefaul.push(tBarGeneralDefaul[3]);
        copyTBarGeneralDefaul.push('-');

        for (var i = 4; i < tBarGeneralDefaul.length; i++) {
            copyTBarGeneralDefaul.push(tBarGeneralDefaul[i]);
        }

        this.tbarGeneral = copyTBarGeneralDefaul;

        Ext.aft.movActivosFijos.superclass.initComponent.call(this);

        var modificarEstado = function(estado, idestado) {
            _this.datos.idestado = idestado;
            _this.gestionarBotones();
            document.getElementById('idestadoFSMovimiento').innerHTML = estado;
        };

        this.btnAprobarDoc.purgeListeners();
        this.btnAprobarDoc.on('click', function() {
            var params = {
                iddocumento: _this.datos.iddocumento,
                idoperacion: _this.datos.idoperacion,
                observacion: _this.datos.operacion + ' ' + _this.datos.nrodoc,
                idarea: _this.datos.idarearesp,
                identidadpadre: _this.datos.idestructurapadre
            };

            if ((_this.inventarioTotal || _this.inventarioParcial) && (_this.datos.idestado == '2')) {
                params.inventario = 2;
            }

            if (_this.inventarioParcial) {
                params.parcial = 2;
            }
            _this._parent.aprobarDoc(params, modificarEstado);
            _this.gestionarBotones();
        });

        this.btnImportarListado.purgeListeners();

        this.btnImportarListado.on('click', function() {
            teclascalientes = false;
            _this.importarFileUploadField();
        });
        // this.btnImportarListado. setVisible(false);

        this.btnConfirmarDoc.purgeListeners();
        this.btnConfirmarDoc.on('click', function() {

            var params = {
                iddocumento: _this.datos.iddocumento
            };

            if (!_this.inventarioTotal && !_this.inventarioParcial) {
                _this._parent.confirmarDoc(params, modificarEstado);
                _this.gestionarBotones();
            }
            else {
                
                mostrarMensaje(2, _this.idioma.MsgConfirmarEstatus, function(btn) {
                    if (btn == 'ok') {
                        var datStore = _this.stCentral.getRange();
                        var arrayDatos = new Array();
                        for (var i = 0; i < datStore.length; i++) {
                            var ob = {
                                idestructuraop: datStore[i].data.idestructuraop,
                                idmovimiento: datStore[i].data.idmovimiento,
                                idproducto: datStore[i].data.idproducto,
                                // 0 Porque se piensa quitar la cantidad del cmp movimientos
                                cantidad: datStore[i].data.cantidad,
                                iddocumento: _this.datos.iddocumento
                            };

                            arrayDatos.push(ob);
                        }
                       //Ext.getBody().mask(_this.idioma.MaskConfHI, 'x-mask-loading');
                        Ext.MessageBox.wait(_this.idioma.MaskConfHI, "Por favor espere...");
                        Ext.Ajax.request({
                            url: '/logistica/activos_fijos/movimiento/index.php/movimiento/salvarproductos',
                            params: {
                                medios: Ext.encode(arrayDatos),
                                iddocumento: _this.datos.iddocumento,
                                inventario: 2
                            },
                            callback: function(o, s, r) {
                                var resp = Ext.decode(r.responseText);
                                if (resp.success) {
                                    modificarEstado("Preparado", resp.idestado);
                                   // Ext.getBody().unmask();
                                   Ext.MessageBox.hide();
                                    mostrarMensaje(1, _this.idioma.MsgConfHIOk);
                                    _this.stCentral.load();

                                } else {
                                    Ext.getBody().unmask();
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(3, _this.idioma.MsgConfHIError);
                                }
                            }
                        });
                    }
                });
            }
        });

        this.btnAnularDoc.purgeListeners();
        this.btnAnularDoc.on('click', function() {
            var params = {
                iddocumento: _this.datos.iddocumento
            };
            _this._parent.cancelarEstadoDoc(params, modificarEstado);
            _this.gestionarBotones();
        });


        this.btnAdicionarProd.disable();

        if (_this.inventarioTotal || _this.inventarioParcial) {
            this.btnAdicionarProd.setVisible(false);
            this.btnEliminarProd.setVisible(false);
        }

        var pEast = new Ext.Panel({
            hideCollapseTool: true,
            collapsible: true,
            collapseMode: 'mini',
            autoScroll: true,
            animCollapse: false,
            animate: false,
            split: true,
            collapsed: true,
            titleCollapse: true,
            region: 'east',
            useSplitTips: true,
            layout: 'fit',
            width: 300
        });

        var pNorth = new Ext.Panel({
            region: 'north',
            border: false,
            split: true,
            collapseMode: 'mini',
            frame: true,
            height: 110,
            items: [
                {
                    xtype: 'fieldset',
                    anchor: '100%',
                    title: _this.idioma.lbTitleFieldSet,
                    layout: 'column',
                    autoHeight: true,
                    items: [
                        {
                            columnWidth: .20,
                            layout: 'form',
                            items: [
                                {
                                    html: _this.idioma.lbAreaResp + ':'
                                },
                                {
                                    html: _this.idioma.lbNumero + ':'
                                },
                                {
                                    html: _this.idioma.lbFecha + ':'
                                },
                                {
                                    html: _this.idioma.lbEstado + ':'
                                }
                            ]
                        },
                        {
                            columnWidth: .7,
                            layout: 'form',
                            items: [
                                {
                                    html: _this.datos.arearesp
                                },
                                {
                                    html: _this.datos.nrodoc
                                },
                                {
                                    html: _this.datos.fecha
                                },
                                {
                                    id: 'idestadoFSMovimiento',
                                    html: _this.datos.estado
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        this.propertyGridAtribDinamicos = new Ext.erp.PropertyGrid({
            schema: 'mod_datosmaestrosmeta',
            globalDefault: true,
            editable: false,
            listeners: {
                'show': function(propertyGrid) {

                    pEast.add(propertyGrid);
                    pEast.doLayout(true);
                }
            },
            preOperacion: function() {

                var record = _this.gridCentral.getSelectionModel().getSelected();

                if (record) {
                    this.llavesForaneas = Array();

                    this.llavesForaneas.push({
                        key: 'idindicador',
                        value: record.get('idprod')
                    });

                    this.idtabla = record.get('idtabla');
                    this.idtablageneral = record.get('idtablageneral');
                    this.ar_where = 'idindicador = ' + record.get('idprod');

                } else
                    throw 'Record no seleccionado'

            }
        });

        this.pContenedor.add(pEast);
        this.pContenedor.add(pNorth);

        this.stCentral.load({
            params: {
                start: 0,
                limit: _this.gridCentral.getBottomToolbar().cbPageSize.getValue()
            }
        });

        this.gridCentral.on({
            'rowdblclick': function(grid, rowIndex, e) {
                _this.onBtnRegistroNumericoClick()
            },
            'rowclick': function(grid, rowIndex, e) {
                if (grid.getSelectionModel().getCount() > 0) {


                    if (_this.idmovseleccionado != grid.getSelectionModel().getSelected().get('idmovimiento')) {

                        var record = grid.getSelectionModel().getSelected();

                        if (record.get('arridtablasgenerales').replace(/[\,\-1]/ig, '').length > 0) {


                            _this.propertyGridAtribDinamicos.setContenido(record.get('arridtablasgenerales'));
                            pEast.expand();

                        } else {
                            pEast.collapse();
                        }
                        _this.idmovseleccionado = grid.getSelectionModel().getSelected().get('idmovimiento');
                    }
                }
            }
        });

        this.on('beforeclose', function() {
            _this._parent.stDocumento.load();
        });
        this.on('beforehide', function() {
            _this._parent.stDocumento.load();
        });

        this.show();
        this.maximize();

        _this.teclasCalientesMov();
    },
    onBtnAdicionarProdClick: function() {

        var _this = this;
        LOG.inv.maestroproductos.Loader.init(function() {
            if (!_this.bloqueada) {
                Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');

                if (_this.datos.tipo_interfaz == 'entrada') { //!this.ventanaActivos &&

                    _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        width: 750,
                        height: 350,
                        usarAplicar: true,
                        showArbol: false,
                        listeners: {
                            'show': function() {
                                Ext.getBody().unmask();
                            }
                        },
                        parametros: {
                            explotacion: 1,
                            idseleccionados: _this.indicadoresNoMostrar
                        },
                        doAction: function(recordSeleccionado, e) {
                            if (recordSeleccionado != null) {
                                _this.adicionarProductos(recordSeleccionado);
                            }
                        }
                    });

                }
                else if (_this.datos.tipo_interfaz != 'entrada') { //!this.ventanaActivos &&

                    _this.ventanaActivos = new LOG.lb.maestroproductos.UIProductos({
                        tipo: 1,
                        width: 750,
                        height: 350,
                        showArbol: false,
                        usarEspecialidad: false,
                        usarAplicar: true,
                        dirController: '/logistica/utiles/producto/index.php/producto',
                        controllerAction: 'cargarproductos',
                        listeners: {
                            'show': function() {
                                Ext.getBody().unmask();
                            }
                        },
                        parametros: {
                            idestructura: _this.datos.idarearesp,
                            explotacion: 1,
                            idseleccionados: _this.indicadoresNoMostrar
                        },
                        doAction: function(recordSeleccionado, e) {
                            if (recordSeleccionado != null) {
                                _this.adicionarProductos(recordSeleccionado);
                               // _this.adicionarRegNum(recordSeleccionado);

                            }
                        }
                    });

                    _this.ventanaActivos.panelProductos.getStorePrincipal().load();
                }
                else {
                    _this.ventanaActivos.parametros = {idseleccionados: _this.indicadoresNoMostrar};
                }

                //this.ventanaActivos.getVistaPrincipal().show();
                _this.ventanaActivos.show();
            }
        });
    },
    onBtnEliminarProdClick: function() {
        var _this = this;
        if (!_this.bloqueada) {
            mostrarMensaje(2, _this.idioma.lbMsgConfEliminar, function(button) {

                if (button == 'ok') {
                    Ext.getBody().mask(_this.idioma.MaskDelProducto, 'x-mask-loading');
                    var recordSelect = _this.gridCentral.getSelectionModel().getSelected();

                    Ext.Ajax.request({
                        url: _this.urlControladora + 'eliminarproductos',
                        method: 'POST',
                        params: {
                            idmovimiento: recordSelect.get('idmovimiento')
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                        },
                        success: function() {
                            Ext.getBody().unmask();
                            var index = _this.indicadoresNoMostrar.indexOf(recordSelect.get('idprod'));
                            if (!_this.inventarioTotal && !_this.inventarioParcial) {
                                _this.indicadoresNoMostrar.splice(index, 1);
                            }

                            mostrarMensaje(1, _this.idioma.lbMsgEliminarOK);
                            _this.gridCentral.getStore().reload();
                        },
                        failure: function() {
                            Ext.getBody().unmask();
                            mostrarMensaje(3, _this.idioma.lbMsgEliminarError);
                        }
                    });
                }
            })
        }
    },
    onBtnRegistroNumericoClick: function() {

        var _this = this;
        var rec = _this.gridCentral.getSelectionModel().getSelected();
        var denominacion = rec.get('denominacion');
        denominacion += (rec.get('descripcionmarcamodelo')) ? ' ' + rec.get('descripcionmarcamodelo') : '';
        if (!_this.inventarioTotal && !_this.inventarioParcial) {
            var rec = _this.gridCentral.getSelectionModel().getSelected();
            Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');
            Ext.aft.regNumerico.controller.init({
                datos: {
                    codprod: rec.get('codigo'),
                    denominacion: denominacion,
                    idmovimiento: rec.get('idmovimiento'),
                    idprod: rec.get('idprod'),
                    idproducto: rec.get('idproducto'),
                    idgruposubgrupo: rec.get('idgruposubgrupo'),
                    idarearesp: _this.datos.idarearesp,
                    idestado: _this.datos.idestado,
                    idoperacion: _this.datos.idoperacion,
                    operacionAjuste: _this.operacionAjuste,
                    cantidad: 0,
                    idnaturaleza: rec.get('idnaturaleza'),
                    tipo_interfaz: _this.datos.tipo_interfaz,
                    idcentrocosto: _this.datos.idcentrocosto,
                    arearesp: _this.datos.arearesp,
                    idestructurapadre: _this.datos.idestructurapadre,
                    arridtablas: rec.get('arridtablas'),
                    iddocumento: _this.datos.iddocumento,
                    vidautil: rec.get('vidautil'),
                    coeficiente: rec.get('coeficiente'),
                    porcientorecuperacion: rec.get('porcientorecuperacion'),
                    tasafiscal: rec.get('tasafiscalmax'),
                    iddocinventario: _this.datos.iddocinventario,
                    responsable: rec.get('responsable'),
                    denomresponsable: rec.get('denomresponsable')

                },
                actionPostClose: function() {
                    _this.stCentral.load();
                }
            });
        } else {
            if (_this.datos.idestado == 1) {
                mostrarMensaje(1, 'Debe confirmar el documento antes de continuar con la operaci&oacute;n.')
            } else {
                Ext.getBody().mask(_this.idioma.lbMaskCargandoDatos, 'x-mask-loading');
                Ext.aft.regNumerico.controller.init({
                    datos: {
                        codprod: rec.get('codigo'),
                        denominacion: denominacion,
                        idmovimiento: rec.get('idmovimiento'),
                        idprod: rec.get('idprod'),
                        idproducto: rec.get('idproducto'),
                        idgruposubgrupo: rec.get('idgruposubgrupo'),
                        idarearesp: (_this.inventarioTotal) ? rec.get('idestructuraop') : _this.datos.idarearesp,
                        idestado: _this.datos.idestado,
                        idoperacion: _this.datos.idoperacion,
                        cantidad: 0,
                        inventario: 2,
                        idnaturaleza: rec.get('idnaturaleza'),
                        tipo_interfaz: 'entrada', //,
                        idcentrocosto: _this.datos.idcentrocosto,
                        arearesp: _this.datos.arearesp,
                        idestructurapadre: _this.datos.idestructurapadre,
                        arridtablas: rec.get('arridtablas'),
                        vidautil: rec.get('vidautil'),
                        coeficiente: rec.get('coeficiente'),
                        porcientorecuperacion: rec.get('porcientorecuperacion'),
                        tasafiscal: rec.get('tasafiscal'),
                        responsable: rec.get('responsable'),
                        denomresponsable: rec.get('denomresponsable')
                    }
                });
            }
        }
    },
    adicionarProductos: function(records) {
        var _this = this;

        if (records.length > 0) {
            var datos = new Array();

            Ext.getBody().mask(_this.idioma.MaskAddProducto, 'x-mask-loading');

            for (var i = 0; i < records.length; i++) {
                datos.push(records[i].get('idindicador'));
                _this.indicadoresNoMostrar.push(records[i].get('idindicador'));
            }

            Ext.Ajax.request({
                url: _this.urlControladora + 'salvarproductos',
                method: 'POST',
                params: {
                    iddocumento: _this.datos.iddocumento,
                    idarearesp: _this.datos.idarearesp,
                    idoperacion: _this.datos.idoperacion,
                    datos: Ext.encode(datos)
                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    if (rd.success == true) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, _this.idioma.MsgAddProductoOk);
                        _this.gridCentral.getStore().reload();

                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.MsgAddProductoError);
                    }
                }
            });
        } else {
            mostrarMensaje('3', _this.idioma.lbMsgNoSeleccionaMediosAdd);
        }
    },
    adicionarRegNum: function(records) {
        var _this = this;

        if (records.length > 0) {
            var datos = new Array();

            Ext.getBody().mask(_this.idioma.MaskAddProducto, 'x-mask-loading');

            // for (var i = 0; i < records.length; i++) {
            //     datos.push(records[i].get('idindicador'));
            //     _this.indicadoresNoMostrar.push(records[i].get('idindicador'));
            // }

            Ext.Ajax.request({
                url: _this.urlControladora + ' addRegistrosMovimientos',
                method: 'POST',
                params: {
                    iddocumento: _this.datos.iddocumento,
                    idoperacion: _this.datos.idoperacion,
                    datos: Ext.encode(datos)
                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    if (rd.success == true) {
                        Ext.getBody().unmask();
                        mostrarMensaje(1, _this.idioma.MsgAddProductoOk);
                        _this.gridCentral.getStore().reload();

                    } else {
                        Ext.getBody().unmask();
                        mostrarMensaje(3, _this.idioma.MsgAddProductoError);
                    }
                }
            });
        } else {
            mostrarMensaje('3', _this.idioma.lbMsgNoSeleccionaMediosAdd);
        }
    },


    modificarCantidades: function(records) {
        var _this = this;
        if (records) {
            Ext.getBody().mask(_this.idioma.MaskModCantProducto, 'x-mask-loading');
            var datos = [];

            for (var i = 0; i < records.length; i++) {
                datos.push({
                    idmovimiento: records[i].get('idmovimiento'),
                    cantidad: records[i].get('cantidad')
                });
            }

            Ext.Ajax.request({
                url: _this.urlControladora + 'modificarcantidad',
                method: 'POST',
                params: {
                    datos: Ext.encode(datos)
                },
                callback: function(options, success, response) {
                    Ext.getBody().unmask();
                    var rd = Ext.decode(response.responseText);
                    if (rd.success) {
                        _this.gridCentral.getStore().load({
                            callback: function() {
                                _this.gridCentral.getStore().rejectChanges();
                            }
                        });
                        mostrarMensaje(1, _this.idioma.lbMsgModCantidadOk);
                    } else if (rd.failure) {
                        mostrarMensaje(3, _this.idioma.lbMsgModCantidadError);
                        _this.gridCentral.getStore().rejectChanges();

                    } else {
                        _this.gridCentral.getStore().rejectChanges();
                    }
                }
            });
        }
    },
    gestionarBotones: function() {
        var _this = this;
        var rowselected = false;
        if (this.btnAyuda) {
            this.btnAyuda.handler = function() {
                if (!Ext.Msg.isVisible()) {
                    var title = 'Ayuda de Medios en uso';
                    var referencia = 'Logística/Gestión del transporte/Gestión de documentos/Medios en uso';
                    help.show(title, referencia);
                }
            }
        }

        if (this.gridCentral.getSelectionModel().getCount() > 0) {
            rowselected = this.gridCentral.getSelectionModel().getSelected();
        }
        switch (true) {
            case this.datos.idestado == '1' || this.datos.idestado == 1:
                {

                    this.btnAnularDoc.disable();
                    this.btnAprobarDoc.disable();
                    if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                        this.btnAdicionarProd.disable();
                    } else {
                        this.btnAdicionarProd.enable();
                    }

                    if (_this.inventarioTotal || _this.inventarioParcial) {

                        this.btnConfirmarDoc.enable();
                        this.btnRegistro.disable();
                    } else {

                        if (rowselected) {
                            this.btnEliminarProd.enable();
                        } else {
                            this.btnEliminarProd.disable();
                        }
                        if (this.gridCentral.getStore().getCount() > 0) {
                            this.btnConfirmarDoc.enable();
                        }
                    }
                }
                break;
            case this.datos.idestado == '2' || this.datos.idestado == 2:
                {

                    this.btnAnularDoc.enable();
                    this.btnAprobarDoc.enable();
                    this.btnConfirmarDoc.disable();
                    this.btnAdicionarProd.disable();
                    this.btnEliminarProd.disable();

                }
                break;
            case this.datos.idestado == '3' || this.datos.idestado == 3:
                {

                    this.btnImpromirMod.disable();
                    this.btnAnularDoc.disable();
                    this.btnAprobarDoc.disable();
                    this.btnConfirmarDoc.disable();
                    this.btnAdicionarProd.disable();
                    this.btnEliminarProd.disable();

                }
                break;
            default :
                {
                    this.btnAnularDoc.disable();
                    this.btnAprobarDoc.disable();
                    this.btnAdicionarProd.disable();

                }
        }

        if (rowselected) {
            this.btnRegistro.enable();
            if (_this.datos.iddocinventario && _this.datos.iddocinventario != null) {
                this.btnAdicionarProd.disable();
                this.btnEliminarProd.disable();
            }

        } else {
            this.btnRegistro.disable();
        }

        if (_this.operacionAjuste) {
            this.btnEliminarProd.disable();
            this.btnAdicionarProd.disable();
        }

    },
    mostrarGridExcel: function(parametros) {

        var _this = this;
        this.myMaskGrid = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando..."});

        var datos = parametros['datos'];
        var rowindex = 0;
        var oldmarca = "";
        var oldmodelo = "";
        var oldcolor = "";
        var oldactividad = "";
        var oldestado = "";
        var oldcategoria = "";
        var oldcombustible = "";
        var oldmatricula = "";
        var oldindicativo = "";

        var stgrid = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'denominacion'
                },
                {
                    name: 'idmarca'
                },
                {
                    name: 'marca'
                },
                {
                    name: 'idmodelo'
                },
                {
                    name: 'modelo'
                },
                {
                    name: 'idcolor'
                },
                {
                    name: 'color'
                },
                {
                    name: 'idactividad'
                },
                {
                    name: 'actividad'
                },
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'estado'
                }/*,
                 {
                 name: 'idtipocombustible'
                 },
                 {
                 name: 'combustible'
                 }*/,
                {
                    name: 'numeroserie'
                },
                {
                    name: 'tipomedio'
                },
                {
                    name: 'fechaadq'
                }/*,
                 {
                 name: 'nromotor1'
                 },
                 {
                 name: 'nromatricula'
                 }, {
                 name: 'capacidad'
                 }, {
                 name: 'indiceconsumo'
                 }, {
                 name: 'odometro'
                 },
                 {
                 name: 'indicativo'
                 }*/,
                {
                    name: 'valoradquisicion'
                },
                {
                    name: 'fechaexpini'
                },
                {
                    name: 'depreciacionacumulada'
                },
                {
                    name: 'tasafiscal'
                },
                {
                    name: 'porcientorecuperacion'
                },
                {
                    name: 'valorcontable'
                },
                {
                    name: 'annofabricacion'
                },
                {
                    name: 'vidautil'
                },
                {
                    name: 'fechaexpfin'
                },
                {
                    name: 'garantia'
                },
                {
                    name: 'depreciacion'
                },
                {
                    name: 'idcategoria'
                },
                {
                    name: 'categoria'
                },
                {
                    name: 'recursoconsumido'
                },
                {
                    name: 'cantidadrecursoconsumido'
                },
                {
                    name: 'importe'
                },
                {
                    name: 'usufructo'
                },
                {
                    name: 'idindicador'
                }
            ]
        });

        var stmarcas = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "idmarca"
            }, [
                {
                    name: 'idmarca'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        var stmodelos = new Ext.data.Store({
            url: _this.urlControladora + 'cargarModelos',
            reader: new Ext.data.JsonReader({
                id: "idmodelo", root: "datos"

            }, [
                {
                    name: 'idmodelo'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        var stcolores = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "idcolor"
            }, [
                {
                    name: 'idcolor'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        var stactividades = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "idactividad"
            }, [
                {
                    name: 'idactividad'
                },
                {
                    name: 'denominacion'
                }
            ])
        });


        var stestados = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "idestatustecnico"
            }, [
                {
                    name: 'idestatustecnico'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        var stcategorias = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "idcategoria"
            }, [
                {
                    name: 'idcategoria'
                },
                {
                    name: 'denominacion'
                }
            ])
        });

        /*var stcombustibles = new Ext.data.Store({
         reader: new Ext.data.JsonReader({
         id: "idtipocombustible"
         }, [
         {
         name: 'idtipocombustible'
         },
         {
         name: 'denominacion'
         }
         ])
         });*/

        stmarcas.loadData(parametros['marcas']);
        stcolores.loadData(parametros['colores']);
        stactividades.loadData(parametros['actividades']);
        stestados.loadData(parametros['estados']);
        stcategorias.loadData(parametros['categorias']);
        //stcombustibles.loadData(parametros['combustible']);

        var arrayGrid = new Array();
        for (var i = 0; i < datos.length; i++) {
            var obj = [datos[i].idmarca, datos[i].marca, datos[i].idmodelo,
                datos[i].modelo, datos[i].idcolor, datos[i].color, datos[i].idactividad, datos[i].actividad,
                datos[i].idestatustecnico, datos[i].estado,
                //datos[i].idtipocombustible, datos[i].combustible,
                datos[i].denominacion,datos[i].numeroserie, datos[i].tipomedio, datos[i].fechaadq, /*datos[i].nromotor1,*/
                /*datos[i].nromatricula,datos[i].capacidad, datos[i].indiceconsumo, datos[i].odometro, datos[i].indicativo,*/
                datos[i].valoradquisicion, datos[i].fechaexpini, datos[i].depreciacionacumulada,
                datos[i].tasafiscal, datos[i].porcientorecuperacion, datos[i].valorcontable,
                datos[i].annofabricacion, datos[i].vidautil, datos[i].fechaexpfin,
                datos[i].garantia, datos[i].depreciacion, datos[i].idcategoria, datos[i].categoria, datos[i].recursoconsumido,
                datos[i].cantidadrecursoconsumido, datos[i].importe, datos[i].usufructo, datos[i].idindicador]
            arrayGrid.push(obj);
        }
        stgrid.loadData(arrayGrid);
        Ext.Msg.hide();

        var colum = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer({
                header: 'N\xba.',
                width: 30
            }), {
                header: _this.idioma.lbCmMarca,
                dataIndex: 'marca',
                width: 100,
                sortable: true,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stmarcas,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idmarcamodelo',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var idmarca = record.data.idmarca;
                            var idmodelo = _this.gridExcel.getSelectionModel().getSelected().data.idmodelo;
                            var marca = record.data.denominacion;

                            _this.gridExcel.getSelectionModel().getSelected().data.idmarca = idmarca;
                            _this.gridExcel.getSelectionModel().getSelected().data.marca = marca;
                            _this.obtenerProducto({
                                index: rowindex, idmarca: idmarca, idmodelo: idmodelo,
                                marca: oldmarca, newmarca: marca
                            });

                        },
                        'beforeselect': function(combo, record, index) {

                        }
                    }
                })
            }, {
                header: _this.idioma.lbCmModelo,
                dataIndex: 'modelo',
                width: 100,
                sortable: true,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stmodelos,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idmarcamodelo',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var idmodelo = record.data.idmodelo;
                            var idmarca = _this.gridExcel.getSelectionModel().getSelected().data.idmarca
                            var modelo = record.data.denominacion;
                            _this.gridExcel.getSelectionModel().getSelected().data.idmodelo = idmodelo;
                            _this.gridExcel.getSelectionModel().getSelected().data.modelo = modelo;
                            _this.obtenerProducto({
                                index: rowindex, idmodelo: idmodelo, idmarca: idmarca,
                                modelo: oldmodelo, newmodelo: modelo
                            });

                        }
                    }
                })
            }, {
                header: _this.idioma.lbCmTmedio,
                width: 100,
                sortable: true,
                dataIndex: 'tipomedio',
                id: 'tipomedio',
                editable: true,
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            }, {
                header: _this.idioma.lbCmColor,
                dataIndex: 'color',
                sortable: true,
                width: 100,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stcolores,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idcolor',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var color = record.data.denominacion;
                            var idcolor = record.data.idcolor;
                            _this.gridExcel.getSelectionModel().getSelected().data.idcolor = idcolor;
                            _this.gridExcel.getSelectionModel().getSelected().data.color = color;
                            _this.obtenerProducto({idcolor: idcolor, color: oldcolor, newcolor: color});

                        }
                    }
                })
            }, {
                header: _this.idioma.lbActividad,
                dataIndex: 'actividad',
                sortable: true,
                width: 100,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stactividades,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idactividad',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var actividad = record.data.denominacion;
                            var idactividad = record.data.idactividad;
                            _this.gridExcel.getSelectionModel().getSelected().data.idactividad = idactividad;
                            _this.gridExcel.getSelectionModel().getSelected().data.actividad = actividad;
                            _this.obtenerProducto({
                                idactividad: idactividad,
                                actividad: oldactividad,
                                newactividad: actividad
                            });
                        }
                    }
                })
            }, {
                header: _this.idioma.lbEstatus,
                dataIndex: 'estado',
                sortable: true,
                width: 100,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stestados,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idestatustecnico',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var estado = record.data.denominacion;
                            var idestatustecnico = record.data.idestatustecnico;
                            _this.gridExcel.getSelectionModel().getSelected().data.idestatustecnico = idestatustecnico;


                            _this.gridExcel.getSelectionModel().getSelected().data.estado = estado;
                            _this.obtenerProducto({
                                idestatustecnico: idestatustecnico,
                                estado: oldestado, newestado: estado
                            });
                        }
                    }
                })
            }, /* {
             header: _this.idioma.lbTcombustible,
             dataIndex: 'combustible',
             sortable: true,
             width: 100,
             editor: new Ext.form.ComboBox({
             editable: true,
             store: stcombustibles,
             valueField: 'denominacion',
             displayField: 'denominacion',
             hiddenName: 'idtipocombustible',
             typeAhead: true,
             mode: 'local',
             triggerAction: 'all',
             selectOnFocus: true,
             anchor: '100%',
             listeners: {
             'select': function(combo, record, index) {
             var combustible = record.data.denominacion;
             var idtipocombustible = record.data.idtipocombustible;
             _this.gridExcel.getSelectionModel().getSelected().data.idtipocombustible = idtipocombustible;
             _this.gridExcel.getSelectionModel().getSelected().data.combustible = combustible;
             _this.obtenerProducto({
             idtipocombustible: idtipocombustible, combustible: oldcombustible,
             newcombustible: combustible
             });
             }
             }
             })
             },*/ {
                header: _this.idioma.lbnoserie,
                width: 150,
                sortable: true,
                dataIndex: 'numeroserie',
                id: 'numeroserie',
                editor: new Ext.form.TextField({
                    allowBlank: false
                })
            }, {
                header: _this.idioma.lbFechaAdq,
                width: 110,
                hidden: false,
                sortable: true,
                dataIndex: 'fechaadq',
                id: 'fechaadq',
                editor: new Ext.form.TextField({})
            }, /*, {
             header: _this.idioma.lbNoMotor,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'nromotor1',
             id: 'nromotor1',
             editor: new Ext.form.TextField({})
             }, {
             header: _this.idioma.lbMatricula,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'nromatricula',
             id: 'nromatricula',
             editor: new Ext.form.TextField({})
             }, {
             header: _this.idioma.lbCapacidad,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'capacidad',
             id: 'capacidad',
             editor: new Ext.form.TextField({})
             }, {
             header: _this.idioma.lbIndice,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'indiceconsumo',
             id: 'indiceconsumo',
             editor: new Ext.form.TextField({})
             }, {
             header: _this.idioma.lbOdometro,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'odometro',
             id: 'odometro',
             editor: new Ext.form.TextField({})
             }, {
             header: _this.idioma.lbIndicativo,
             width: 100,
             hidden: false,
             sortable: true,
             dataIndex: 'indicativo',
             id: 'indicativo',
             editor: new Ext.form.TextField({})
             },*/ {
                header: _this.idioma.lbValoradquisicion,
                width: 110,
                hidden: false,
                sortable: true,
                dataIndex: 'valoradquisicion',
                id: 'valoradquisicion',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbFechaExpIni,
                width: 110,
                hidden: false,
                sortable: true,
                dataIndex: 'fechaexpini',
                id: 'fechaexpini',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoDeprecAcum,
                width: 150,
                hidden: false,
                sortable: true,
                dataIndex: 'depreciacionacumulada',
                id: 'depreciacionacumulada',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoTasaFiscal,
                width: 70,
                hidden: false,
                sortable: true,
                dataIndex: 'tasafiscal',
                id: 'tasafiscal',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoPorcientoRecup,
                width: 150,
                hidden: false,
                sortable: true,
                dataIndex: 'porcientorecuperacion',
                id: 'porcientorecuperacion',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoValorContable,
                width: 80,
                hidden: false,
                sortable: true,
                dataIndex: 'valorcontable',
                id: 'valorcontable',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoAnnoFabri,
                width: 100,
                hidden: false,
                sortable: true,
                dataIndex: 'annofabricacion',
                id: 'annofabricacion',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoVidaUtil,
                width: 60,
                hidden: false,
                sortable: true,
                dataIndex: 'vidautil',
                id: 'vidautil',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbFechaExpIni,
                width: 110,
                hidden: false,
                sortable: true,
                dataIndex: 'fechaexpfin',
                id: 'fechaexpfin',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoGarantia,
                width: 60,
                hidden: false,
                sortable: true,
                dataIndex: 'garantia',
                id: 'garantia',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoDeprec,
                width: 80,
                hidden: false,
                sortable: true,
                dataIndex: 'depreciacion',
                id: 'depreciacion',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoCategoria,
                dataIndex: 'categoria',
                sortable: true,
                width: 80,
                editor: new Ext.form.ComboBox({
                    editable: true,
                    store: stcategorias,
                    valueField: 'denominacion',
                    displayField: 'denominacion',
                    hiddenName: 'idcategoria',
                    typeAhead: true,
                    mode: 'local',
                    triggerAction: 'all',
                    selectOnFocus: true,
                    anchor: '100%',
                    listeners: {
                        'select': function(combo, record, index) {
                            var categoria = record.data.denominacion;
                            var idcategoria = record.data.idcategoria;
                            _this.gridExcel.getSelectionModel().getSelected().data.idcategoria = idcategoria;
                            _this.gridExcel.getSelectionModel().getSelected().data.categoria = categoria;
                            _this.obtenerProducto({
                                idcategoria: idcategoria,
                                categoria: oldcategoria,
                                newcategoria: categoria
                            });
                        }
                    }
                })
            }, {
                header: _this.idioma.lbNoRecursoConsumido,
                width: 150,
                hidden: false,
                sortable: true,
                dataIndex: 'recursoconsumido',
                id: 'recursoconsumido',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoCatnRecursoConsumido,
                width: 150,
                hidden: false,
                sortable: true,
                dataIndex: 'cantidadrecursoconsumido',
                id: 'cantidadrecursoconsumido',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoImporte,
                width: 60,
                hidden: false,
                sortable: true,
                dataIndex: 'importe',
                id: 'importe',
                editor: new Ext.form.TextField({})
            }, {
                header: _this.idioma.lbNoUsufructo,
                width: 60,
                hidden: false,
                sortable: true,
                dataIndex: 'usufructo',
                id: 'usufructo',
                editor: new Ext.form.TextField({})
            }
        ]);
        this.gridExcel = new Ext.grid.EditorGridPanel({
            clicksToEdit: 1,
            autoScroll: true,
            listeners: {
                'beforeedit': function(e) {
                    switch (e.column) {
                        case 1:
                            oldmarca = _this.gridExcel.getStore().getAt(rowindex).data.marca;
                            e.record.data.marca = "";
                            break;
                        case 2:
                            oldmodelo = _this.gridExcel.getStore().getAt(rowindex).data.modelo;
                            e.record.data.modelo = "";
                            idpadre = _this.gridExcel.getSelectionModel().getSelected().data.idmarca
                            stmodelos.load({params: {idpadre: idpadre}});

                            break;
                        case 3:
                            e.record.data.text = "";
                            break;
                        case 4:
                            oldcolor = _this.gridExcel.getStore().getAt(rowindex).data.color
                            e.record.data.color = "";
                            break;
                        case 5:
                            oldactividad = _this.gridExcel.getStore().getAt(rowindex).data.actividad
                            e.record.data.actividad = "";
                            break;
                        case 6:
                            oldestado = _this.gridExcel.getStore().getAt(rowindex).data.estado
                            e.record.data.estado = "";
                            break;
                        case 20:
                            oldcategoria = _this.gridExcel.getStore().getAt(rowindex).data.categoria
                            e.record.data.categoria = "";
                            break;
                            /*case 7:
                             oldcombustible = _this.gridExcel.getStore().getAt(rowindex).data.combustible
                             e.record.data.combustible = "";
                             break;
                             case 11:
                             oldmatricula = _this.gridExcel.getStore().getAt(rowindex).data.nromatricula
                             e.record.data.nromatricula = "";
                             break;
                             case 15:
                             oldindicativo = _this.gridExcel.getStore().getAt(rowindex).data.indicativo
                             e.record.data.indicativo = "";
                             break;
                             */
                    }

                }
            },
            autoExpandColumn: 'numeroserie',
            sm: new Ext.grid.RowSelectionModel({
                singleSelect: true,
                moveEditorOnEnter: false,
                listeners: {
                    'rowselect': function(sel, row, record) {
                        rowindex = row;

                    }
                }
            }),
            store: stgrid,
            cm: colum/*,
             loadMask: {
             store: stgrid
             },
             bbar: new Ext.PagingToolbar({
             pageSize: 30,
             store: _this.stCentral,
             displayInfo: true
             })*/
        });
        _this.btnAyudaMostrarDatos = new Ext.Button({
            iconCls: 'ayuda',
            hidden: false,
            tooltip: _this.idioma.lbTtBtnTitleAyuda,
            text: _this.idioma.lbBtnAyuda,
            listeners: {
                'click': function() {
                    /*var title = _this.idioma.lbAyudaText;
                     var referencia = 'Logística/Gestión del transporte/Gestión de documentos';
                     help.show(title, referencia);*/
                }
            }
        });

        _this.btnAceptarWinMostDatos = new Ext.Button({
            iconCls: 'incluir',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnCargarG,
            listeners: {
                'click': function() {
                    Ext.Msg.wait(_this.idioma.lbWaitMsg, _this.idioma.lbWaitTitle);
                    var cant = stgrid.getTotalCount();
                    var datos = stgrid.getRange(0, cant);

                    var enviar = new Array();
                    var bandera = true;
                    var datind = null;
                    var datmatri = null;
                    /*if (!_this.datos.idcentrocosto) {
                     mostrarMensaje(1, _this.idioma.lbMsgInsertarExcelErrorCentroCosto);
                     Ext.Msg.hide();
                     return;
                     }*/
                    for (var i = 0; i < cant; i++) {
                        if (datos[i].data.indicativo) {
                            datind = datos[i].data.indicativo.split("=");
                        }
                        if (datos[i].data.nromatricula) {
                            datmatri = datos[i].data.nromatricula.split("=");
                        }

                        if (!datos[i].data.idmarca || !datos[i].data.idmodelo /*|| !datos[i].data.numeroserie*/ || !datos[i].data.idindicador || !datos[i].data.idestatustecnico || !datos[i].data.idactividad) {
                            bandera = false;
                            Ext.Msg.hide();
                            break;

                        } else if (datind && datind[0] == "<span style") {
                            Ext.Msg.hide();
                            mostrarMensaje(3, _this.idioma.lbMsgDatosError);
                            return;
                        }
                        else if (datmatri && datmatri[0] == "<span style") {
                            Ext.Msg.hide();
                            mostrarMensaje(3, _this.idioma.lbMsgDatosError);
                            return;
                        } else if (datmatri && datmatri[0] == "<span style") {
                            Ext.Msg.hide();
                            mostrarMensaje(3, _this.idioma.lbMsgDatosError);
                            return;
                        } else if (isNaN(datos[i].data.depreciacionacumulada)) {
                            Ext.Msg.hide();
                            mostrarMensaje(1, _this.idioma.lbMsgInsertarExcelErrorDepre1 + datos[i].data.depreciacionacumulada +
                                    _this.idioma.lbMsgInsertarExcelErrorDepre2);
                            return;
                        } else if (isNaN(datos[i].data.tasafiscal)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.tasafiscal).replace("_", "tasa fiscal");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.porcientorecuperacion)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.porcientorecuperacion).replace("_", "prociento de recuperaci\xf3n");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.valorcontable)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.valorcontable).replace("_", "valor contable");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.annofabricacion)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.annofabricacion).replace("_", "a\xf1o de fabricaci\xf3n");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.vidautil)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.vidautil).replace("_", "vida \xfatil");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.garantia)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.garantia).replace("_", "garant\xeda");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.depreciacion)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.depreciacion).replace("_", "depreciaci\xf3n");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.recursoconsumido)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.recursoconsumido).replace("_", "recurso consumido");
                            mostrarMensaje(1, mensaje);
                            return;
                        } else if (isNaN(datos[i].data.cantidadrecursoconsumido)) {
                            Ext.Msg.hide();
                            var mensaje = _this.idioma.lbMsgInsertarExcelErrorAll2.replace("=", datos[i].data.cantidadrecursoconsumido).replace("_", "cantidad de recurso consumido");
                            mostrarMensaje(1, mensaje);
                            return;
                        }
                        /*else if (isNaN(datos[i].data.capacidad)) {
                         Ext.Msg.hide();
                         mostrarMensaje(1, _this.idioma.lbMsgInsertarExcelErrorPax1 + datos[i].data.capacidad +
                         _this.idioma.lbMsgInsertarExcelErrorPax2);
                         return;
                         } else if (isNaN(datos[i].data.indiceconsumo)) {
                         Ext.Msg.hide();
                         mostrarMensaje(1, _this.idioma.lbMsgInsertarExcelErrorIndConsumo1 + datos[i].data.indiceconsumo +
                         _this.idioma.lbMsgInsertarExcelErrorIndConsumo2);
                         return;
                         }*/


                        var obj = {
                            idcolorprim: datos[i].data.idcolor,
                            nroserie: datos[i].data.numeroserie,
                            idprod: datos[i].data.idindicador,
                            idactividad: datos[i].data.idactividad,
                            idestatustecnico: datos[i].data.idestatustecnico,
                            idtipocombustible: datos[i].data.idtipocombustible,
                            fechaadq: datos[i].data.fechaadq,
                            //nromotor1: datos[i].data.nromotor1,
                            nromatricula: datos[i].data.nromatricula,
                            //capacidad: datos[i].data.capacidad,
                            // indiceconsumo: datos[i].data.indiceconsumo,
                            // indicativo: datos[i].data.indicativo,
                            valoradquisicion: datos[i].data.valoradquisicion,
                            fechaexpini: datos[i].data.fechaexpini,
                            depreciacionacumulada: datos[i].data.depreciacionacumulada,
                            tasafiscal: datos[i].data.tasafiscal,
                            porcientorecuperacion: datos[i].data.porcientorecuperacion,
                            valorcontable: datos[i].data.valorcontable,
                            annofabricacion: datos[i].data.annofabricacion,
                            vidautil: datos[i].data.vidautil,
                            fechaexpfin: datos[i].data.fechaexpfin,
                            garantia: datos[i].data.garantia,
                            depreciacion: datos[i].data.depreciacion,
                            idcategoria: datos[i].data.idcategoria,
                            recursoconsumido: datos[i].data.recursoconsumido,
                            cantidadrecursoconsumido: datos[i].data.cantidadrecursoconsumido,
                            importe: datos[i].data.importe,
                            usufructo: datos[i].data.usufructo,
                            denominacion: datos[i].data.denominacion
                                    // odometro: datos[i].data.odometro

                        };

                        enviar.push(obj);
                    }
                    if (bandera) {

                        Ext.Ajax.timeout = 6000000;

                        Ext.Ajax.request({
                            url: _this.urlControladora + 'insertarDatos',
                            method: 'POST',
                            params: {
                                datos: Ext.encode(enviar),
                                iddocumento: _this.datos.iddocumento,
                                idarearesp: _this.datos.idarearesp,
                                idcentrocosto: _this.datos.idcentrocosto

                            },
                            callback: function(options, success, response) {
                                Ext.Msg.hide();
                                var rd = Ext.decode(response.responseText);
                                if (rd.cod == 1) {
                                    mostrarMensaje(1, _this.idioma.lbMsgInsertarExcel);
                                    _this.winMostrarDatos.close();
                                    if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible()) {
                                        _this.winConfigurarDatos.close();
                                    }
                                    _this.winImportar.close();
                                    _this.gridCentral.getStore().reload();

                                } else if (rd.cod == 3) {
                                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelError);
                                } else if (rd.cod == 4) {
                                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorNumeros);
                                } else if (rd.cod == 5) {
                                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorFecha);
                                } else if (rd.cod == 6) {
                                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorDoc);
                                } else if (rd.cod == 7) {
                                    mostrarMensaje(3, _this.idioma.lbMsgInsertarExcelErrorDuplicados);
                                } else if (rd.cod == 8) {
                                    var msg = _this.idioma.lbMsgInsertarExcelErrorNumerosExistentes;
                                    if (rd.repetidos) {
                                        if (rd.repetidos.length > 0) {
                                            msg += ":";
                                        } else {
                                            msg += ".";
                                        }
                                        var i = 0;
                                        while (rd.repetidos.length > i) {
                                            msg += ' -' + rd.repetidos[i].nroserie;
                                            i += 1;
                                        }
                                    }
                                    mostrarMensaje(3, msg);
                                }
                            }
                        })
                    } else {
                        mostrarMensaje(3, _this.idioma.lbMsgDatosError);
                    }
                }
            }
        });

        _this.btnCancelarWinMostDatos = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCerrarG,
            handler: function() {
                _this.winMostrarDatos.close();
            }
        });

        _this.winMostrarDatos = new Ext.Window({
            title: _this.idioma.lbTtleWinPrevia,
            //width: 1100,
            //height: 550,
            modal: true,
            layout: 'fit',
            items: [_this.gridExcel],
            // tbar: ['->', _this.btnAyudaMostrarDatos],
            buttons: [_this.btnCancelarWinMostDatos, _this.btnAceptarWinMostDatos]
        });

        _this.winMostrarDatos.show();
        _this.winMostrarDatos.maximize();

    },
    configurarAsociacion: function(parametros) {

        var _this = this;
        var arrayDenominaciones = Array();
        for (var i = 0; i < parametros.total; i++) {

            arrayDenominaciones.push({descripcion: parametros.datos[i].descripcion, posicion: i});
        }

        var storeDenominaciones = new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                id: "descripcion"
            }, [
                {
                    name: 'descripcion'
                },
                {
                    name: 'posicion'
                }
            ])
        });

        storeDenominaciones.loadData(arrayDenominaciones);

        _this.cmbMarca = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbmarca,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbCombAsig = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCombustibleAsig,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbModelo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbmodelo,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbColor = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbcolor,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbNoserie = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbnoserie,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbActividad = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbActividad,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbMatricula = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbMatricula,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbNoMotor = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoMotor,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbFAdquisicion = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbFecha,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbEstatus = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbEstatus,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbCapacidad = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbCapacidad,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbIndiceConsumo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbIndice,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbTcombunstible = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbTcombustible,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbOdometro = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbOdometro,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbIndicativo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbIndicativo,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbValoradquisicion = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbValoradquisicion,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            allowBlank: true,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbNoInv = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoInv,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbVIN = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbVIN,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbFicav = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbFicav,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbLOT = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbLOT,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbFechaExpIni = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbFechaExpIni,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbNoCirculacion = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoCirculacion,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbDepreAcum = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoDeprecAcum,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbTasaFiscal = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoTasaFiscal,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbProcientoRecup = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoPorcientoRecup,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbValorContable = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoValorContable,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbAnnoFabri = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoAnnoFabri,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbVidaUtil = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoVidaUtil,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        _this.cmbFechaExpFin = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbFechaExpFin,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbGarantia = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoGarantia,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbDeprec = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoDeprec,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbCategoria = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoCategoria,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbRecursoConsumido = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoRecursoConsumido,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbCantRecursoConsumido = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoCatnRecursoConsumido,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbImporte = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoImporte,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });
        _this.cmbUsufructo = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbNoUsufructo,
            store: storeDenominaciones,
            valueField: 'posicion',
            displayField: 'descripcion',
            typeAhead: true,
            //allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: _this.idioma.lbseleccione,
            selectOnFocus: true,
            width: 150
        });

        for (var i = 0; i < arrayDenominaciones.length; i++) {

            if (arrayDenominaciones[i].descripcion) {
                var deno = arrayDenominaciones[i].descripcion.toLowerCase();
                if (_this.idioma.lbTcombustible.toLowerCase().search(deno) != -1) {
                    _this.cmbTcombunstible.setValue(i);


                } else if (_this.idioma.lbIndice.toLowerCase().search(deno) != -1) {
                    _this.cmbIndiceConsumo.setValue(i);


                } /*else if (_this.idioma.lbCapacidad.toLowerCase().search(deno) != -1) {
                 _this.cmbCapacidad.setValue(i);
                 
                 
                 }*/ else if (_this.idioma.lbEstatus.toLowerCase().search(deno) != -1) {
                    _this.cmbEstatus.setValue(i);


                } else if (_this.idioma.lbFecha.toLowerCase().search(deno) != -1) {
                    _this.cmbFAdquisicion.setValue(i);


                }/* else if (_this.idioma.lbNoMotor.toLowerCase().search(deno) != -1) {
                 _this.cmbNoMotor.setValue(i);
                 
                 
                 } else if (_this.idioma.lbMatricula.toLowerCase().search(deno) != -1) {
                 _this.cmbMatricula.setValue(i);
                 
                 
                 }*/ else if (_this.idioma.lbActividad.toLowerCase().search(deno) != -1) {
                    _this.cmbActividad.setValue(i);


                } else if (_this.idioma.lbnoserie.toLowerCase().search(deno) != -1) {
                    _this.cmbNoserie.setValue(i);


                } else if (_this.idioma.lbcolor.toLowerCase().search(deno) != -1) {
                    _this.cmbColor.setValue(i);


                } else if (_this.idioma.lbmodelo.toLowerCase().search(deno) != -1) {
                    _this.cmbModelo.setValue(i);


                } else if (_this.idioma.lbmarca.toLowerCase().search(deno) != -1) {
                    _this.cmbMarca.setValue(i);

                } /*else if (_this.idioma.lbOdometro.toLowerCase().search(deno) != -1) {
                 _this.cmbOdometro.setValue(i);
                 
                 } else if (_this.idioma.lbIndicativo.toLowerCase().search(deno) != -1) {
                 _this.cmbIndicativo.setValue(i);
                 
                 }*/ else if (_this.idioma.lbValoradquisicion.toLowerCase().search(deno) != -1) {
                    _this.cmbValoradquisicion.setValue(i);

                } /*else if (_this.idioma.lbVIN.toLowerCase().search(deno) != -1) {
                 _this.cmbVIN.setValue(i);
                 
                 } else if (_this.idioma.lbLOT.toLowerCase().search(deno) != -1) {
                 _this.cmbLOT.setValue(i);
                 
                 } else if (_this.idioma.lbFicav.toLowerCase().search(deno) != -1) {
                 _this.cmbFicav.setValue(i);
                 
                 }else if (_this.idioma.lbCombustibleAsig.toLowerCase().search(deno) != -1) {
                 
                 _this.cmbCombAsig.setValue(i);
                 
                 } else if (_this.idioma.lbNoCirculacion.toLowerCase().search(deno) != -1) {
                 _this.cmbNoCirculacion.setValue(i);
                 
                 }*/ else if (_this.idioma.lbFechaExpIni.toLowerCase().search(deno) != -1) {
                    _this.cmbFechaExpIni.setValue(i);

                } else if (_this.idioma.lbNoInv.toLowerCase().search(deno) != -1) {
                    _this.cmbNoInv.setValue(i);

                } else if (_this.idioma.lbNoDeprecAcum.toLowerCase().search(deno) != -1) {
                    _this.cmbDepreAcum.setValue(i);

                } else if (_this.idioma.lbNoTasaFiscal.toLowerCase().search(deno) != -1) {
                    _this.cmbTasaFiscal.setValue(i);

                } else if (_this.idioma.lbNoPorcientoRecup.toLowerCase().search(deno) != -1) {
                    _this.cmbProcientoRecup.setValue(i);

                } else if (_this.idioma.lbNoValorContable.toLowerCase().search(deno) != -1) {
                    _this.cmbValorContable.setValue(i);

                } else if (_this.idioma.lbNoAnnoFabri.toLowerCase().search(deno) != -1) {
                    _this.cmbAnnoFabri.setValue(i);

                } else if (_this.idioma.lbNoVidaUtil.toLowerCase().search(deno) != -1) {
                    _this.cmbVidaUtil.setValue(i);

                } else if (_this.idioma.lbNoGarantia.toLowerCase().search(deno) != -1) {
                    _this.cmbGarantia.setValue(i);

                } else if (_this.idioma.lbFechaExpFin.toLowerCase().search(deno) != -1) {
                    _this.cmbFechaExpFin.setValue(i);

                } else if (_this.idioma.lbNoDeprec.toLowerCase().search(deno) != -1) {
                    _this.cmbDeprec.setValue(i);

                } else if (_this.idioma.lbNoCategoria.toLowerCase().search(deno) != -1) {
                    _this.cmbCategoria.setValue(i);

                } else if (_this.idioma.lbNoRecursoConsumido.toLowerCase().search(deno) != -1) {
                    _this.cmbRecursoConsumido.setValue(i);

                } else if (_this.idioma.lbNoCatnRecursoConsumido.toLowerCase().search(deno) != -1) {
                    _this.cmbCantRecursoConsumido.setValue(i);

                } else if (_this.idioma.lbNoImporte.toLowerCase().search(deno) != -1) {
                    _this.cmbImporte.setValue(i);

                } else if (_this.idioma.lbNoUsufructo.toLowerCase().search(deno) != -1) {
                    _this.cmbUsufructo.setValue(i);

                }
            }


        }


        var formPanelWinConf = new Ext.form.FormPanel({
            layout: 'column',
            frame: true,
            id: 'idpanelMovImp',
            bodyBorder: false,
            items: [
                {
                    columnWidth: .25,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.cmbMarca,
                        _this.cmbModelo,
                        _this.cmbTasaFiscal,
                        _this.cmbVidaUtil,
                        _this.cmbCategoria,
                        _this.cmbUsufructo,
                        _this.cmbActividad/*, _this.cmbCombAsig, _this.cmbLOT*/]
                },
                {
                    columnWidth: .25,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.cmbMatricula,
                        _this.cmbColor,
                        _this.cmbProcientoRecup,
                        _this.cmbFechaExpFin,
                        _this.cmbRecursoConsumido,
                        /*_this.cmbNoMotor, _this.cmbIndicativo, */
                        _this.cmbFAdquisicion/*, _this.cmbFicav*/]

                },
                {
                    columnWidth: .25,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.cmbEstatus,
                        /*_this.cmbTcombunstible, _this.cmbCapacidad, _this.cmbIndiceConsumo,*/
                        _this.cmbFechaExpIni,
                        _this.cmbGarantia,
                        _this.cmbCantRecursoConsumido,
                        _this.cmbValorContable,
                        _this.cmbNoInv]

                },
                {
                    columnWidth: .25,
                    layout: 'form',
                    labelAlign: 'top',
                    items: [_this.cmbNoserie,
                        _this.cmbDepreAcum/*, _this.cmbOdometro*/,
                        _this.cmbAnnoFabri,
                        _this.cmbImporte,
                        _this.cmbDeprec,
                        _this.cmbValoradquisicion/*, _this.cmbVIN, _this.cmbNoCirculacion*/]

                }
            ]
        });

        _this.btnAceptarWinConfgtDatos = new Ext.Button({
            iconCls: 'aceptar',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnCargarW,
            listeners: {
                'click': function() {
                    if (!formPanelWinConf.getForm().isValid()) {
                        mostrarMensaje(3, _this.idioma.lbMsgDatosVacios)
                    }
                    else {
                        Ext.Msg.wait(_this.idioma.lbWaitMsgMostrar, _this.idioma.lbWaitTitle);
                        Ext.Ajax.request({
                            url: _this.urlControladora + 'validarExcel',
                            method: 'POST',
                            params: {
                                noSerie: _this.cmbNoserie.getValue(),
                                marca: _this.cmbMarca.getValue(),
                                modelo: _this.cmbModelo.getValue(),
                                color: _this.cmbColor.getValue(),
                                // odometro: _this.cmbOdometro.getValue(),
                                // indicativo: _this.cmbIndicativo.getValue(),
                                valoradquisicion: _this.cmbValoradquisicion.getValue(),
                                actividad: _this.cmbActividad.getValue(),
                                // matricula: _this.cmbMatricula.getValue(),
                                // noMotor: _this.cmbNoMotor.getValue(),
                                fechaAdq: _this.cmbFAdquisicion.getValue(),
                                estado: _this.cmbEstatus.getValue(),
                                // combustible: _this.cmbTcombunstible.getValue(),
                                // capacidad: _this.cmbCapacidad.getValue(),
                                // indiceconsumo: _this.cmbIndiceConsumo.getValue(),
                                // combustibleasig: _this.cmbCombAsig.getValue(),
                                nroinventario: _this.cmbNoInv.getValue(),
                                fechaexpini: _this.cmbFechaExpIni.getValue(),
                                depreciacionacumulada: _this.cmbDepreAcum.getValue(),
                                tasafiscal: _this.cmbTasaFiscal.getValue(),
                                porcientorecuperacion: _this.cmbProcientoRecup.getValue(),
                                valorcontable: _this.cmbValorContable.getValue(),
                                annofabricacion: _this.cmbAnnoFabri.getValue(),
                                vidautil: _this.cmbVidaUtil.getValue(),
                                fechaexpfin: _this.cmbFechaExpFin.getValue(),
                                garantia: _this.cmbGarantia.getValue(),
                                depreciacion: _this.cmbDeprec.getValue(),
                                categoria: _this.cmbCategoria.getValue(),
                                recursoconsumido: _this.cmbRecursoConsumido.getValue(),
                                cantidadrecursoconsumido: _this.cmbCantRecursoConsumido.getValue(),
                                importe: _this.cmbImporte.getValue(),
                                usufructo: _this.cmbUsufructo.getValue(),
                                // nrocirculacion: _this.cmbNoCirculacion.getValue(),
                                // ficav: _this.cmbFicav.getValue(),
                                //  lot: _this.cmbLOT.getValue(),
                                identidadpadre: _this.datos.idestructurapadre,
                                datos: Ext.encode(parametros.datos)


                            },
                            callback: function(options, success, response) {
                                var rd = Ext.decode(response.responseText);
                                _this.mostrarGridExcel(rd);
                            }
                        });
                    }

                }
            }
        });

        _this.btnCancelarWinConfgDatos = new Ext.Button({
            iconCls: 'Cancelar',
            text: _this.idioma.lbBtnCancelar,
            tooltip: _this.idioma.lbTtBtnCerrarW,
            listeners: {
                'click': function() {
                    _this.winConfigurarDatos.close();
                }
            }
        });
        _this.winConfigurarDatos = new Ext.Window({
            bodyStyle: 'padding:5px 5px 0',
            title: _this.idioma.lbtiTlewinConfg,
            width: 750,
            resizable: false,
            height: 440,
            modal: true,
            items: [
                formPanelWinConf

            ],
            buttons: [_this.btnCancelarWinConfgDatos, _this.btnAceptarWinConfgtDatos

            ]
        });

        _this.winConfigurarDatos.on('show', function() {
            Ext.Msg.hide();
        });
        _this.winConfigurarDatos.show();

    },
    importarFileUploadField: function() {
        var _this = this;

        var panel = new Ext.FormPanel({
            fileUpload: true,
            width: 280,
            frame: true,
            autoHeight: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 50,
            hideLabels: true,
            defaults: {
                anchor: '95%',
                allowBlank: false,
                msgTarget: 'side'
            },
            items: [
                {
                    xtype: 'logfileuploadfield',
                    id: 'subir',
                    name: 'fichero',
                    buttonCfg: {
                        iconCls: 'buscar'
                    },
                    buttonText: _this.idioma.lbSeleccionar,
                    emptyText: _this.idioma.lbMsgSeleccioneArchivo,
                    listeners: {
                        'fileselected': function(cmp, v) {
                            if (!/\.xls$/.test(v) /*&& !/\.xlsx$/.test(v)*/) {
                                mostrarMensaje(1, 'Solo se pueden seleccionar ficheros de tipo excel 97-2003.');
                                cmp.markInvalid('Extensi\xf3n invalida');
                                _this.btnIncluirDatos.disable();

                            } else {
                                _this.btnIncluirDatos.enable();
                            }

                        }
                    }
                }
            ]
        });

        _this.btnIncluirDatos = new Ext.Button({
            iconCls: 'incluir',
            text: _this.idioma.lbBtnAceptar,
            tooltip: _this.idioma.lbTtBtnCargar,
            listeners: {
                'click': function() {
                    if (panel.getForm().isValid()) {
                        Ext.Msg.wait(_this.idioma.lbWaitMsgConf, _this.idioma.lbWaitTitle);
                        panel.getForm().submit({
                            url: _this.urlControladora + 'importarDatos',
                            success: function(fp, response) {

                                var responseText = Ext.decode(response.response.responseText);
                                _this.configurarAsociacion(responseText);

                            },
                            failure: function(fp, response) {

                            }
                        });
                    } else {

                        mostrarMensaje(1, _this.idioma.lbMsgCampoEmpty);
                    }
                }
            }
        });

        _this.btnCancelarImportar = new Ext.Button({
            iconCls: 'cancelar',
            text: _this.idioma.lbBtnCancelarTC,
            tooltip: _this.idioma.lbTtBtnCerrar,
            listeners: {
                'click': function() {
                    teclascalientes = true;
                    _this.winImportar.close();
                }
            }
        });
        _this.winImportar = new Ext.Window({
            title: _this.idioma.lbTitleImportar,
            width: 400,
            layout: 'fit',
            modal: true,
            items: [panel],
            buttons: [_this.btnCancelarImportar, _this.btnIncluirDatos

            ]
        });
        _this.winImportar.show();
    },
    corregirValores: function(valores, objProducto) {
        var _this = this;
        var arraynewdata = Array();

        for (var i = 0; i < _this.gridExcel.getStore().getCount(); i++) {
            if ((valores.idmarca && _this.gridExcel.getStore().getAt(i).data.marca == valores.marca)) {
                _this.gridExcel.getStore().getAt(i).data.idmarca = valores.idmarca;
                _this.gridExcel.getStore().getAt(i).data.marca = valores.newmarca;
            }

            if ((valores.idmodelo && _this.gridExcel.getStore().getAt(i).data.modelo == valores.modelo)) {
                if (_this.gridExcel.getStore().getAt(i).data.idmarca == valores.idmarca) {
                    _this.gridExcel.getStore().getAt(i).data.idmodelo = valores.idmodelo;
                    _this.gridExcel.getStore().getAt(i).data.modelo = valores.newmodelo;
                }
            }

            if (_this.gridExcel.getStore().getAt(i).data.idmodelo == valores.idmodelo &&
                    _this.gridExcel.getStore().getAt(i).data.idmarca == valores.idmarca) {
                if (objProducto) {
                    _this.gridExcel.getStore().getAt(i).data.tipomedio = objProducto.tipomedio;
                    _this.gridExcel.getStore().getAt(i).data.idindicador = objProducto.idindicador;
                }
            }

            if (valores.idcolor && _this.gridExcel.getStore().getAt(i).data.color == valores.color) {
                _this.gridExcel.getStore().getAt(i).data.idcolor = valores.idcolor;
                _this.gridExcel.getStore().getAt(i).data.color = valores.newcolor;
            }

            if (valores.idactividad && _this.gridExcel.getStore().getAt(i).data.actividad == valores.actividad) {
                _this.gridExcel.getStore().getAt(i).data.idactividad = valores.idactividad;
                _this.gridExcel.getStore().getAt(i).data.actividad = valores.newactividad;
            }

            if (valores.idestatustecnico && _this.gridExcel.getStore().getAt(i).data.estado == valores.estado) {
                _this.gridExcel.getStore().getAt(i).data.idestatustecnico = valores.idestatustecnico;
                _this.gridExcel.getStore().getAt(i).data.estado = valores.newestado;

            }

            if (valores.idcategoria && _this.gridExcel.getStore().getAt(i).data.categoria == valores.categoria) {
                _this.gridExcel.getStore().getAt(i).data.idcategoria = valores.idcategoria;
                _this.gridExcel.getStore().getAt(i).data.categoria = valores.newcategoria;

            }

            if (valores.idtipocombustible && _this.gridExcel.getStore().getAt(i).data.combustible == valores.combustible) {
                _this.gridExcel.getStore().getAt(i).data.idtipocombustible = valores.idtipocombustible;
                _this.gridExcel.getStore().getAt(i).data.combustible = valores.newcombustible;
            }

            var obj = [
                _this.gridExcel.getStore().getAt(i).data.idmarca, _this.gridExcel.getStore().getAt(i).data.marca,
                _this.gridExcel.getStore().getAt(i).data.idmodelo, _this.gridExcel.getStore().getAt(i).data.modelo,
                _this.gridExcel.getStore().getAt(i).data.idcolor, _this.gridExcel.getStore().getAt(i).data.color,
                _this.gridExcel.getStore().getAt(i).data.idactividad, _this.gridExcel.getStore().getAt(i).data.actividad,
                _this.gridExcel.getStore().getAt(i).data.idestatustecnico, _this.gridExcel.getStore().getAt(i).data.estado];
            if (valores.hayCmb)
            {
                obj.push(_this.gridExcel.getStore().getAt(i).data.idtipocombustible);
                obj.push(_this.gridExcel.getStore().getAt(i).data.combustible);
            }


            obj.push(_this.gridExcel.getStore().getAt(i).data.numeroserie);
            obj.push(_this.gridExcel.getStore().getAt(i).data.tipomedio);
            obj.push(_this.gridExcel.getStore().getAt(i).data.fechaadq);
            obj.push(_this.gridExcel.getStore().getAt(i).data.valoradquisicion);
            obj.push(_this.gridExcel.getStore().getAt(i).data.fechaexpini);
            obj.push(_this.gridExcel.getStore().getAt(i).data.depreciacionacumulada);
            obj.push(_this.gridExcel.getStore().getAt(i).data.tasafiscal);
            obj.push(_this.gridExcel.getStore().getAt(i).data.porcientorecuperacion);
            obj.push(_this.gridExcel.getStore().getAt(i).data.valorcontable);
            obj.push(_this.gridExcel.getStore().getAt(i).data.annofabricacion);
            obj.push(_this.gridExcel.getStore().getAt(i).data.vidautil);
            obj.push(_this.gridExcel.getStore().getAt(i).data.fechaexpfin);
            obj.push(_this.gridExcel.getStore().getAt(i).data.garantia);
            obj.push(_this.gridExcel.getStore().getAt(i).data.depreciacion);
            obj.push(_this.gridExcel.getStore().getAt(i).data.idcategoria);
            obj.push(_this.gridExcel.getStore().getAt(i).data.categoria);
            obj.push(_this.gridExcel.getStore().getAt(i).data.recursoconsumido);
            obj.push(_this.gridExcel.getStore().getAt(i).data.cantidadrecursoconsumido);
            obj.push(_this.gridExcel.getStore().getAt(i).data.importe);
            obj.push(_this.gridExcel.getStore().getAt(i).data.usufructo);
            obj.push(_this.gridExcel.getStore().getAt(i).data.idindicador);


            arraynewdata.push(obj);
        }

        _this.gridExcel.getStore().loadData(arraynewdata);
        _this.gridExcel.getSelectionModel().selectRow(valores.index);
        _this.myMaskGrid.hide();
    },
    teclasCalientesMov: function() {
        var _this = this;
        document.onkeyup = function(e) {
            if (e.altKey) {
                if (e.which == Ext.EventObject.I && !e.ctrlKey) {
                    if (_this.btnAdicionarProd) {
                        if (!_this.btnAdicionarProd.disabled && teclascalientes) {
                            _this.btnAdicionarProd.fireEvent('click');
                        }
                    }
                } else if (e.which == Ext.EventObject.P) {
                    if (_this.btnImpromirMod) {
                        if (!_this.btnImpromirMod.disabled && teclascalientes) {
                            _this.btnImpromirMod.fireEvent('click');
                        }
                    }
                } else if (e.which == Ext.EventObject.C) {
                    if (!Ext.Msg.isVisible()) {
                        if (!_this.verificarVentanasActivas() && Ext.getCmp('idBtnCerrarMovimientos')) {
                            if (!Ext.getCmp('idBtnCerrarMovimientos').disabled) {
                                Ext.getCmp('idBtnCerrarMovimientos').handler();
                            }
                        } else {
                            if (_this.winImportar && _this.winImportar.isVisible()) {
                                _this.btnCancelarImportar.fireEvent('click');
                            }
                        }
                    }
                } else if (e.which == Ext.EventObject.G) {
                    /*if (_this.btnGuardarCant) {
                     if (!_this.btnGuardarCant.disabled && teclascalientes) {
                     _this.btnGuardarCant.handler();
                     
                     }//Porque se piensa quitar la cantidad del cmp movimientos
                     }*/
                } else if (e.which == Ext.EventObject.H) {
                    if (_this.winMostrarDatos && _this.winMostrarDatos.isVisible() && teclascalientes) {
                        _this.btnAyudaMostrarDatos.fireEvent('click');
                    } else if (_this.btnAyuda) {
                        if (!_this.btnAyuda.disabled && teclascalientes) {
                            _this.btnAyuda.handler();
                        }
                    }
                } else if (e.which == Ext.EventObject.B) {
                    if (_this.btnBuscar) {
                        if (!_this.btnBuscar.disabled && teclascalientes) {
                            _this.btnBuscar.handler();
                        }
                    }
                } else if (e.which == Ext.EventObject.L) {
                    if (_this.btnLimpiar) {
                        if (!_this.btnLimpiar.disabled && teclascalientes) {
                            _this.btnLimpiar.handler();
                        }
                    }
                } else if (e.which == Ext.EventObject.M) {
                    if (e.ctrlKey) {
                        if (_this.btnRegistro) {
                            if (!_this.btnRegistro.disabled && teclascalientes) {
                                _this.btnRegistro.handler();
                            }
                        }
                    }
                } else if (e.which == Ext.EventObject.F) {
                    if (e.ctrlKey) {
                        if (_this.btnConfirmarDoc) {
                            if (!_this.btnConfirmarDoc.disabled && teclascalientes) {
                                _this.btnConfirmarDoc.fireEvent('click');
                            }
                        }
                    }
                } else if (e.which == Ext.EventObject.A) {
                    if (e.ctrlKey) {
                        if (_this.btnAprobarDoc) {
                            if (!_this.btnAprobarDoc.disabled && teclascalientes) {
                                _this.btnAprobarDoc.fireEvent('click');
                            }
                        }
                    }
                } else if (e.which == Ext.EventObject.L) {
                    if (e.ctrlKey) {
                        if (_this.btnAnularDoc) {
                            if (!_this.btnAnularDoc.disabled && teclascalientes) {
                                _this.btnAnularDoc.fireEvent('click');
                            }
                        }
                    }
                } else if (e.which == Ext.EventObject.C && !e.ctrlKey) {
                    if (_this.winMostrarDatos && _this.winMostrarDatos.isVisible() && teclascalientes) {
                        _this.btnCancelarWinMostDatos.fireEvent('click');
                    } else if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible() && teclascalientes) {
                        _this.btnCancelarWinConfgDatos.fireEvent('click');

                    } else if (_this.winImportar && _this.winImportar.isVisible() && teclascalientes) {
                        _this.btnCancelarImportar.fireEvent('click');
                    }

                } else if (e.which == Ext.EventObject.I) {
                    if (e.ctrlKey) {
                        if (_this.winImportar && _this.winImportar.isVisible()) {
                            _this.btnIncluirDatos.fireEvent('click');
                        } else if (_this.btnImportarListado) {
                            if (!_this.btnImportarListado.disabled && teclascalientes) {
                                _this.btnImportarListado.fireEvent('click');
                            }
                        }
                    }
                }
            }
            if (e.which == Ext.EventObject.DELETE) {
                if (_this.btnEliminarProd) {
                    if (!_this.btnEliminarProd.disabled && teclascalientes) {
                        _this.btnEliminarProd.fireEvent('click');
                    }
                }
            }

            if (e.which == Ext.EventObject.ENTER) {
                if (_this.winMostrarDatos && _this.winMostrarDatos.isVisible()) {
                    _this.btnAceptarWinMostDatos.fireEvent('click');
                } else if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible()) {
                    if (!_this.btnAceptarWinConfgtDatos.disabled && teclascalientes) {
                        _this.btnAceptarWinConfgtDatos.fireEvent('click');
                    }
                }
            }


        };
    },
    verificarVentanasActivas: function() {
        var _this = this;
        if (_this.winMostrarDatos && _this.winMostrarDatos.isVisible())
            return true;
        if (_this.winConfigurarDatos && _this.winConfigurarDatos.isVisible())
            return true;
        if (_this.winImportar && _this.winImportar.isVisible())
            return true;
        return false;
    },
    obtenerProducto: function(valores) {
        var _this = this;
        var objProducto = {};

        _this.myMaskGrid.show();
        if (valores.idmarca && valores.idmodelo) {
            Ext.Ajax.request({
                url: _this.urlControladora + 'cargarProductosPorMarcamodelo',
                method: 'POST',
                params: {
                    idmarca: valores.idmarca,
                    idmodelo: valores.idmodelo

                },
                callback: function(options, success, response) {
                    var rd = Ext.decode(response.responseText);
                    rd = rd.datos;

                    if (!rd.idindicador) {
                        objProducto = {tipomedio: "<span style='color:#ff0800;'>No encontrado</span>"};
                    } else {
                        objProducto = {tipomedio: rd.tipomedio, idindicador: rd.idindicador};
                    }
                    _this.corregirValores(valores, objProducto);

                }
            });

        } else {
            _this.corregirValores(valores);
        }

    }
});



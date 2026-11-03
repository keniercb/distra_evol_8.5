Ext.ns('Ext.erp');
Ext.ns('Ext.farm.conf');
//Contenedor general
Ext.erp.configuracionfarmacia = Ext.extend(LOG.util.Panel, {
    panelCuadroBasico: undefined,
    panelAnno: undefined,
    panelCentral: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        var _this = this;
        this.idioma = LOG.farm.configuracion.Idioma;
        Ext.Ajax.request({
            url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarDatosEstructura',
            method: 'POST',
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                if (resp.idestructura != resp.idpadre){
                    var path = resp.parent_path.split('.');
                    var raiz = path[0];
                    _this.panelAnno.collapse(true);
                    _this.panelAnno.hide();
                    _this.gridCuadrosB.estructurahija = true;
                    _this.gridCuadrosB.idPadreRaiz = raiz;
                    _this.gridCuadrosB.idannoActivo = resp.idannoActivo;
                    _this.gridCuadrosB.getGridPrincipal().getColumnModel().setHidden(12, false);
                    _this.gridCuadrosB.getStorePrincipal().load();
                    if (_this.gridCuadrosB.listaBotones){
                        _this.gridCuadrosB.listaBotones.getItem(0).hide();
                        _this.gridCuadrosB.listaBotones.getItem(2).hide();
                    }
                }
                _this.gridCuadrosB.idestructura = resp.idestructura;
            }.createDelegate(this)
        });
        this.bildComponents();
        this.contenedorCuadroBasico = new LOG.util.Panel({
            region: 'center',
            title: 'Cuadro b\xe1sico',
            layout: 'border',
            frame: true
        });
        this.contenedorCuadroBasico.add(this.panelAnno);
        this.contenedorCuadroBasico.add(this.panelCentral);
        this.tapPanelGeneral = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.contenedorCuadroBasico]
        });
        Ext.apply(this, {
            layout: 'border',
            items: [this.contenedorCuadroBasico]
        });
        Ext.erp.configuracionfarmacia.superclass.constructor.call(this, config);

    },
    bildComponents: function () {
        this.panelAnno = new Ext.erp.configuracionfarmacia.panelIzq({idioma: this.idioma});
        this.gridCuadrosB = new Ext.erp.gridCuadrosB({idioma: this.idioma, gridAnno: this.panelAnno.gridAnno});
        this.gridCuadrosB.init();
        this.panelCentral = this.gridCuadrosB.view();
    }
});
//Grid central de cuadro basicos
Ext.erp.gridCuadrosB = Ext.extend(LOG.util.UITemplate, {
    gridAnno: undefined,
    estructurahija: undefined,
    idPadreRaiz: undefined,
    idannoActivo: undefined,
    idestructura: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlBusquedaGridPrincipal = 'cargarCuadroBasico';
        this.modoSeleccion = 2;
        this.idioma = config.idioma;
        this.autoLoad = false;
        this.busquedaBasica = true;
        this.textBusquedaSimple = "C\xf3digo, denominaci\xf3n";
        this.concepto = "cuadro b\xe1sico";
        this.modelo = new Ext.farm.conf.Modelo({idioma: this.idioma});
        Ext.erp.gridCuadrosB.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idcuadrobasico'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idanno'
        });
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 150,
            dataIndex: 'codigo',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'codigo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'denominacion',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denominacion'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgTipoCuadro,
            width: 260,
            dataIndex: 'idtipocuadrobasico',
            default: true,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataCuadroBasico, val);
            },
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataCuadroBasico,
                dataIndex: 'idtipocuadrobasico'
            }
        });
        this.addGridColumn({
            dataIndex: 'idproveedor',
        });
        this.addGridColumn({
            header: this.idioma.cgLaboratorio,
            width: 260,
            dataIndex: 'denomproveedor',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denomproveedor'
            }
        });
        this.addGridColumn({///Pendiente el filtro.....................
            header: this.idioma.cgGrupoFarmacologico,
            width: 260,
            dataIndex: 'idgrupofarmacologico',
            default: true,
            filter: {
                type: 'combo',
                dataIndex: 'idgrupofarmacologico',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarGrupoFarmacologico',
                valueField: 'idgrupofm',
                displayField: 'text'
            },
            renderer: function (val, x, record) {
                return record.json.denomgrupofarmacologico;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgViaAdquisicion,
            width: 150,
            dataIndex: 'idviaadquicicion',
            default: true,
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataViaAdquicicion,
                dataIndex: 'idviaadquicicion'
            },
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataViaAdquicicion, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgClasificacionVEN,
            width: 150,
            dataIndex: 'idclasificacionven',
            default: true,
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataClasificadoVEN,
                dataIndex: 'idclasificacionven'
            },
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataClasificadoVEN, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPrioridad,
            width: 90,
            dataIndex: 'prioridad',
            align: 'center',
            default: true,
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataPrioridad,
                dataIndex: 'prioridad'
            },
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataPrioridad, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgTieneCertificado,
            width: 260,
            dataIndex: 'tienecertificado',
            default: true,
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataTieneCertificado,
                dataIndex: 'tienecertificado'
            },
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataTieneCertificado, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFormaFarmaceutica,
            dataIndex: 'denomforma',
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'denomforma'
            }
        });
        this.addGridColumn({
            dataIndex: 'formafarmaceutica',
        });
        this.addGridColumn({
            header: 'Precio de venta',
            width: 150,
            dataIndex: 'precioventa',
            align: 'right',
            default: true,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return Ext.util.Format.number(value, '0,000.00');
            }
        });
        this.addGridColumn({
            header: 'Tipo de dispensaci\xf3n',
            width: 150,
            hidden: (!this.estructurahija),
            dataIndex: 'idtipodispensacion',
            default: true,
            filter: {
                type: 'list',
                options: Ext.farm.conf.datas.dataTipoDispensacion,
                dataIndex: 'idtipodispensacion'
            },
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataTipoDispensacion, val);
            }

        });
        this.addGridColumn({
            dataIndex: 'formulamagistral'
        });

    },
    initDefaultButtons: function () {
        var _this = this;

        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: this.idioma.btnAdicionarProducto,
            text: this.idioma.btnAdicionarProducto,
            handler: function () {
                if (!_this.estructurahija) {
                    var idAnno = _this.gridAnno.getSmPrincipal().getSelected()['json'].idanno;
                }
                var widthG = (_this.panelPrincipal.getWidth() > 800) ? _this.panelPrincipal.getWidth() : 800;
                var heightG = (_this.panelPrincipal.getHeight() > 600) ? _this.panelPrincipal.getHeight() * 0.9 : 500;
                var vent = new Ext.farm.conf.AdicionarProducto({
                    height: heightG,
                    minWidth: 800,
                    minHeight: 500,
                    width: widthG,
                    usarAplicar: true,
                    idioma: _this.idioma,
                    title: "Adicionar producto",
                    idanno: (idAnno) ? idAnno : _this.idannoActivo,
                    idPadreRaiz: _this.idPadreRaiz,
                    modelo: _this.modelo,
                    estructurahija: _this.estructurahija
                });

                vent.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.estructurahija) {
                    b.hide();
                }
                else b.show();
                b.disable();
                _caller.gridAnno.getGridPrincipal().getSelectionModel().fireEvent = _caller.gridAnno.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
                if (this.estructurahija) {
                    b.enable();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonAbrir({
            tooltip: 'Modificar producto.',
            text: 'Abrir',
            handler: function () {
                var idAnno = (_this.idannoActivo)?_this.idannoActivo:_this.gridAnno.getSmPrincipal().getSelected()['json'].idanno;
                var widthG = (_this.panelPrincipal.getWidth() > 800) ? _this.panelPrincipal.getWidth() : 800;
                var heightG = (_this.panelPrincipal.getHeight() > 600) ? _this.panelPrincipal.getHeight() * 0.9 : 500;
                var vent = new Ext.farm.conf.AdicionarProducto({
                    height: heightG, minWidth: 800, minHeight: 500, width: widthG,
                    idioma: _this.idioma, usarAplicar: false,
                    title: "Modificar producto", idanno: idAnno, modelo: _this.modelo,
                    modificar: true, recordModificar: _this.getSmPrincipal().getSelected()
                });
                vent.show();
            },
            controlFn: function (b, _caller) {
                if (_caller.estructurahija) {
                    b.hide();
                }
                else b.show();
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: this.idioma.btnEliminarProducto,
            tooltip: this.idioma.btnEliminarProducto,
            disabled: true,
            handler: function () {
                var ids = new Array();
                Ext.each(_this.getSmPrincipal().getSelections(), function (rec) {
                    ids.push(rec.data.idcuadrobasico);
                });
                _this.modelo.eliminarCB({id: ids});
            },
            controlFn: function (b, _caller) {
                if (_caller.estructurahija) {
                    b.hide();
                }
                else b.show();
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            text: this.idioma.btnImprimirProducto,
            tooltip: this.idioma.btnImprimirProducto,
            disabled: false,
            handler: function () {
                var params = [];
                _this.getGridPrincipal().filters.getFilterData().forEach(function (p) {
                    params[p.field] = p.data.value;
                })
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Cuadro b\xe1sico',
                            isList: true,
                            params: {
                                idestructura: _this.idestructura,
                                idanno: _this.gridAnno.getSmPrincipal().getSelected()['json'].idanno,
                                activo: null,
                                idindicador: null,
                                excluiridproducto: null,
                                idcuadrobasico: null,
                                excluiridcuadrobasico: null,
                                criterio: null,
                                codigo: params['codigo'],
                                denominacion: params['denominacion'],
                                idtipocuadrobasico: params['idtipocuadrobasico'],
                                denomproveedor: params['denomproveedor'],
                                idviaadquicicion: params['idviaadquicicion'],
                                idclasificacionven: params['idclasificacionven'],
                                prioridad: params['prioridad'],
                                tienecertificado: params['tienecertificado'],
                                denomforma: params['denomform'],
                                idtipodispensacion: null,
                                idgrupofarmacologico: null,
                                start: null,
                                limit: null,
                                estructurahija: null
                            },
                            dirReport: '/distra/logistica/farmacia/configuracion/cuadrobasico',
                            detailFirma: {}
                        }
                    ]
                });
                report.view();

            },
            controlFn: function (b, _caller) {
                b.hide();
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridCuadrosB.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idanno = (_this.estructurahija) ? _this.idannoActivo : _this.gridAnno.getSmPrincipal().getSelected()['json'].idanno;
                obj.params.estructurahija = _this.estructurahija;
                obj.params.idPadreRaiz = _this.idPadreRaiz;
            }
        });
        this.gridAnno.getGridPrincipal().getSelectionModel().fireEvent =
            this.gridAnno.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                if (e == 'rowselect') {
                    _this.getStorePrincipal().load();
                }
            });
        return vista;
    }
});
//Ventana de adicionar productos
Ext.farm.conf.AdicionarProducto = Ext.extend(LOG.util.Window, {

    idioma: undefined,
    idanno: undefined,
    estructurahija: undefined,
    modificar: false,
    recordModificar: undefined,
    idPadreRaiz: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.loadMask = true;
        this.idioma = config.idioma;
        this.modelo = config.modelo;
        this.idanno = config.idanno;
        this.idPadreRaiz = config.idPadreRaiz;
        this.estructurahija = config.estructurahija;
        this.modificar = config.modificar;
        this.recordModificar = config.recordModificar;
        this.bildComponents();
        Ext.apply(this, {
            items: [this.clsGeneral]
        });
        Ext.farm.conf.AdicionarProducto.superclass.constructor.call(this, config);
        this.on({
            resize: function () {
                var interior = _this.getHeight() - 85;
                _this.panelProductos.setHeight(interior);
            }
        });
        this.modelo.idanno = config.idanno;
        this.modelo.addActionButton(this.listaBotones.getItem(2));
        this.modelo.addActionButton(this.listaBotones.getItem(1));
    },
    bildComponents: function () {
        var _this = this;
        this.modelo.idcuadrobasico = undefined;
        this.clsGeneral = new LOG.util.UIManager.initColumnForm({
            columnas: (!this.estructurahija) ? 2 : 1,
            region: 'center',
            defaultsAnchor: (!this.estructurahija) ? '98%' : '100%',
            minHeight: 600,
            autoScroll: true,
            frame: true
        });
        this.gridproductoProd = new Ext.erp.gridproductoProducto({
            idioma: this.idioma,
            busquedaBasica: true,
            autoLoad: false,
            idanno: _this.idanno,
            estructurahija: this.estructurahija,
            modoSeleccion: (this.estructurahija) ? 3 : 1,
            idPadreRaiz: this.idPadreRaiz,
            idindicador: (this.modificar) ? this.recordModificar.data.idindicador : undefined
        });
        this.gridproductoProd.init();
        this.panelProductos = this.gridproductoProd.view({region: 'center', height: 570, width: 800, frame: true});
        this.gridproductoProd.getSmPrincipal().on({
            rowdeselect: function () {
                if (this.getCount() == 0) {
                    _this.modelo.idindicador = undefined;
                    _this.modelo.habilitarBotones(true);
                }
            },
            rowselect: function () {
                _this.modelo.idindicador = this.getSelected().data.idindicador;
                _this.buttons[2].disabled = false; 
            }
        });
        this.gridproductoProd.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.start = _this.gridproductoProd.getGridPrincipal().initialConfig.bbar.cursor;
                obj.params.limit = _this.gridproductoProd.getGridPrincipal().initialConfig.bbar.pageSize;
            }
        });
        this.gridproductoProd.getStorePrincipal().load();
        this.clsGeneral.addComponent(this.panelProductos);
        if (!this.estructurahija) {
            this.clsGeneral.getColumn(0).columnWidth = 0.66;
            this.clsGeneral.getColumn(1).columnWidth = 0.34;
            Ext.apply(this.clsGeneral.getColumn(1), {
                layout: 'form',
                heigh: 500,
                autoScroll: true
            })
            this.formDatos = new LOG.util.UIManager.initForm({region: 'center', frame: true});
            var clsDatos = new LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '98%'
            });
            this.clsDatos2 = new LOG.util.UIManager.initColumnForm({
                columnas: 2,
                defaultsAnchor: '96%'
            });
            this.comboTipoCB = new LOG.util.ComboBox({
                name: 'idtipocuadrobasico',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarTipoCuadroBasico',
                valueField: 'idtipocuadrobasico',
                displayField: 'denominacion',
                fieldLabel: this.idioma.cgTipoCuadro,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: false,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idtipocuadrobasico', 'denominacion'],
                    data: Ext.farm.conf.datas.dataCuadroBasico
                }),
                resizable: true
            });
            this.comboGrupoFarmacologico = new LOG.util.LovCombo({
                name: 'idgrupofarmacologico',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarGrupoFarmacologico',
                valueField: 'idgrupofm',
                displayField: 'text',
                autoLoad: true,
                fieldLabel: this.idioma.cgGrupoFarmacologico,
                queryParam: 'criterio',
                mode: 'local',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                resizable: true
            })
            this.comboClasificacionVEN = new LOG.util.ComboBox({
                name: 'idclasificacionven',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarClasificacionVEN',
                valueField: 'idclasificacionven',
                displayField: 'denominacion',
                fieldLabel: this.idioma.cgClasificacionVEN,
                queryParam: 'criterio',
                mode: 'remote',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idclasificacionven', 'denominacion'],
                    data: Ext.farm.conf.datas.dataClasificadoVEN
                }),
                resizable: true
            });
            this.comboProveedor = new LOG.util.ComboBox({
                name: 'idproveedor',
                url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarProveedores',
                displayField: 'nombre',
                valueField: 'idclientesproveedores',
                fieldLabel: this.idioma.cgLaboratorio,
                queryParam: 'criterio',
                mode: 'remote',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                pageSize: 15,
                resizable: true
            });
            this.comboProveedor.store.on({
                load: function () {
                    _this.comboProveedor.setValue(_this.comboProveedor.getValue());
                }
            })
            this.comboViaAdquicicion = new LOG.util.ComboBox({
                name: 'idviaadquicicion',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarViaAdquicicion',
                valueField: 'idviaadquicicion',
                displayField: 'denominacion',
                fieldLabel: this.idioma.cgViaAdquisicion,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: false,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idviaadquicicion', 'denominacion'],
                    data: Ext.farm.conf.datas.dataViaAdquicicion
                }),
                resizable: true
            });
            this.comboPrioridad = new LOG.util.ComboBox({
                name: 'prioridad',
                url: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia/cargarPrioridad',
                valueField: 'idprioridad',
                displayField: 'denominacion',
                fieldLabel: this.idioma.cgPrioridad,
                width: '98%',
                allowBlank: true,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idprioridad', 'denominacion'],
                    data: Ext.farm.conf.datas.dataPrioridad
                }),
                resizable: true
            });
            this.comboFormulaMagistral = new LOG.util.ComboBox({
                name: 'formulamagistral',
                valueField: 'formulamagistral',
                displayField: 'denominacion',
                fieldLabel: this.idioma.lbFormulaMagistral,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['formulamagistral', 'denominacion'],
                    data: [
                        [1, 'Si'],
                        [0, 'No']
                    ]
                }),
                resizable: true
            });
            this.comboTieneCertificado = new LOG.util.ComboBox({
                name: 'tienecertificado',
                valueField: 'idcertificado',
                displayField: 'denominacion',
                fieldLabel: this.idioma.lbTieneCertificado,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idcertificado', 'denominacion'],
                    data: Ext.farm.conf.datas.dataTieneCertificado
                }),
                resizable: true
            });
            this.comboTipoUnidadSalud = new LOG.util.ComboBox({
                name: 'idtipounidadsalud',
                valueField: 'idtipounidadsalud',
                displayField: 'denominacion',
                autoSelect: true,
                forceSelection: true,
                fieldLabel: this.idioma.cgTipoUnidadSalud,
                queryParam: 'criterio',
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idtipounidadsalud', 'denominacion'],
                    data: Ext.farm.conf.datas.dataTipoUnidadSalud
                }),
                width: '98%',
                allowBlank: false,
                minChars: 1,
                resizable: true,
                listeners: {
                    select: function (cb, rec) {
                    }
                }
            });
            this.comboTipoDispensacion = new LOG.util.ComboBox({
                name: 'idtipodispensacion',
                valueField: 'idtipodispensacion',
                displayField: 'denominacion',
                fieldLabel: this.idioma.lbTipoDispensacion,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: true,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idtipodispensacion', 'denominacion'],
                    data: Ext.farm.conf.datas.dataTipoDispensacion
                }),
                resizable: true
            });
            this.textPrecioVenta = new LOG.util.Prototipos.inputDecimal({
                name: 'precioventa',
                allowBlank: true,
                fieldLabel: 'Precio de venta'
            });
            this.comboCobro = new LOG.util.ComboBox({
                name: 'modocobro',
                valueField: 'idmodo',
                displayField: 'denominacion',
                fieldLabel: this.idioma.lbModoCobro,
                queryParam: 'criterio',
                width: '98%',
                allowBlank: false,
                minChars: 1,
                mode: 'local',
                store: new Ext.data.SimpleStore({
                    fields: ['idmodo', 'denominacion'],
                    data: [
                        [0, 'Cobrar'],
                        [1, 'Entregar gratis'],
                        [2, 'Entregar por donaci\xf3n']
                    ]
                }),
                resizable: true
            });
            this.clsDatos2.addComponent(this.comboTipoCB);
            this.clsDatos2.addComponent(this.comboGrupoFarmacologico);
            this.clsDatos2.addComponent(this.comboClasificacionVEN);
            this.clsDatos2.addComponent(this.comboProveedor);
            this.clsDatos2.addComponent(this.comboViaAdquicicion);
            this.clsDatos2.addComponent(this.comboPrioridad);
            this.clsDatos2.addComponent(this.comboFormulaMagistral);
            this.clsDatos2.addComponent(this.comboTieneCertificado);
            this.clsDatos2.addComponent(this.textPrecioVenta);
            this.clsDatos2.addComponent(this.comboCobro);

            this.gridDatosInferior = new LOG.util.UITemplate({
                formaVisualizacion: 'panel',
                dirController: '/logistica/farmacia/configuracion/index.php/configuracionfarmacia',
                urlBusquedaGridPrincipal: 'cargarUnidadSaludDispensacion',
                autoLoad: false,
                autoSelect: false,
                modoSeleccion: 1,
                gridEditable: true,
                idGridPrincipal: 'idorgano',
                idioma: this.idioma,
                initDefaultColumns: function () {
                    this.addGridColumn({
                        dataIndex: 'idunidadsaluddispensacion'
                    });
                    this.addGridColumn({
                        header: _this.idioma.cgTipoUnidadSalud,
                        width: 150,
                        dataIndex: 'idtipounidadsalud',
                        editor: _this.comboTipoUnidadSalud,
                        default: true,
                        renderer: function (val) {
                            return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataTipoUnidadSalud, val);
                        }
                    });
                    this.addGridColumn({
                        header: _this.idioma.cgTipoDispensacion,
                        width: 150,
                        dataIndex: 'idtipodispensacion',
                        default: true,
                        editor: _this.comboTipoDispensacion,
                        renderer: function (val) {
                            return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataTipoDispensacion, val);
                        }
                    });
                },
                initDefaultButtons: function () {
                    var _local = this;
                    this.addToolbarButton(this.btnAdd = LOG.util.Prototipos.botonAdicionar({
                        tooltip: 'Adicionar a\xf1o',
                        text: ' ',
                        handler: function () {
                            var cantUnidadSalud = _this.comboTipoUnidadSalud.store.getCount();
                            //Es la cantidad maxima de convinaciones a poner.
                            if (_local.getStorePrincipal().getCount() < (cantUnidadSalud)) {
                                var topicRecord = Ext.data.Record.create([
                                    {name: 'idtipounidadsalud'},
                                    {name: 'idtipodispensacion'}
                                ]);
                                var cantRecord = _local.getStorePrincipal().getCount();

                                var newRecord = new topicRecord({
                                    idtipounidadsalud: (cantRecord == 0) ? 0 : 1,
                                    idtipodispensacion: null
                                });
                                _local.getStorePrincipal().add(newRecord);
                                _this.modelo.isDirtyGridInferior = true;
                            }
                        }
                    }));

                    this.addToolbarButton(this.btnDel = LOG.util.Prototipos.botonEliminar({
                        text: ' ',
                        tooltip: 'Eliminar a\xf1o',
                        disabled: true,
                        handler: function () {
                            var rec = _local.getSmPrincipal().getSelected();
                            _local.getStorePrincipal().remove(rec);
                            _this.modelo.inferioreElimi.add(rec.data.idunidadsaluddispensacion);
                            _this.modelo.isDirtyGridInferior = true;
                        },
                        controlFn: function (b, _caller) {
                            b.disable();
                            _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                                if (e == 'rowselect') {
                                    b.enable();
                                }
                                if (e == 'rowdeselect') {
                                    b.disable();
                                }
                            });
                        }
                    }));
                }
            });
            this.gridDatosInferior.init();
            this.panelGrid = this.gridDatosInferior.view();
            this.gridDatosInferior.getGridPrincipal().initialConfig.bbar.hide();
            this.gridDatosInferior.getGridPrincipal().on({
                afteredit: function () {
                    _this.modelo.isDirtyGridInferior = true;
                    _this.validarBtns();
                }
            });
            this.gridDatosInferior.getStorePrincipal().on(
                {
                    change: function () {
                        _this.modelo.isDirtyGridInferior = true;
                        _this.validarBtns();
                    },
                    add: function (st, records) {
                        _this.modelo.isDirtyGridInferior = true;
                        _this.validarBtns();
                    },
                    remove: function () {
                        _this.modelo.isDirtyGridInferior = true;
                        _this.validarBtns();
                    },
                    beforeload: function (st, obj) {
                        obj.params.idcuadrobasico = (_this.modificar || _this.recordModificar) ? _this.recordModificar.data.idcuadrobasico : -1;
                    }
                }
            );
            if (this.modificar) {
                this.gridDatosInferior.getStorePrincipal().load();
            }
            Ext.apply(this.panelGrid, {
                height: 150,
                minHeight: 150,
                autoHeight: false
            });
            clsDatos.addComponent(this.panelGrid);
            this.formDatos.add(this.clsDatos2);
            this.formDatos.add(new Ext.Panel({height: 20}));
            this.formDatos.add(clsDatos);
            this.modelo.bindForm(this.formDatos);
            this.modelo.setStoreGridValidar(this.gridDatosInferior.getStorePrincipal());
            this.clsGeneral.addComponent(this.formDatos);
        }
        if (this.modificar) {
            this.recordModificar.data = this.recordModificar.json;
            if (!this.estructurahija) { //denomgrupofarmacologico
                this.comboGrupoFarmacologico.store.on({
                    load: function (cb, res) {
                        _this.comboGrupoFarmacologico.setRawValue(_this.recordModificar.data.denomgrupofarmacologico);
                        _this.comboGrupoFarmacologico.setValue(_this.recordModificar.data.idgrupofarmacologico);
                    }
                });

                this.comboProveedor.setRawValue(this.recordModificar.data.denomproveedor);
                this.comboProveedor.valueNotFoundText = this.recordModificar.data.denomproveedor;
                this.formDatos.getForm().loadRecord(this.recordModificar);
                this.modelo.idcuadrobasico = this.recordModificar.data.idcuadrobasico;

            }
        }
    },
    aceptarFn: function () {
        var _this = this;
        var adicionarusd = [];
        var cant = 0;
        var idPadre = undefined;
        if (!this.estructurahija) {
            this.gridDatosInferior.getStorePrincipal().each(function (rec, pos) {
                if (!rec.data.idunidadsaluddispensacion || rec.dirty) {
                    adicionarusd.push(rec.data);
                    cant++;
                }
            });
        }
        else {
            if (_this.gridproductoProd.getSmPrincipal().hasSelection()) {
                var selections = _this.gridproductoProd.getSmPrincipal().getSelections();
                var idPadre = new Array();
                Ext.each(selections, function (rec) {
                    idPadre.push(rec.json.idcuadrobasico);
                })
            }
        }

        this.modelo.adicionarCB({
            adicionarusd: (cant > 0) ? Ext.encode(adicionarusd) : undefined,
            eliminarusd: (this.modelo.inferioreElimi.count() > 0) ? Ext.encode(this.modelo.inferioreElimi.getArray()) : undefined,
            idpadre: (idPadre) ? Ext.encode(idPadre) : undefined
        }, function (r) {
            if (_this.estructurahija) {
                _this.gridproductoProd.getStorePrincipal().load();
            }
            if (!_this.recordModificar) {
                _this.recordModificar = {data: {}, json: {}};
                _this.recordModificar.data.idcuadrobasico = _this.recordModificar.json.idcuadrobasico = r.datos;
            }
            _this.modificar = null;
            _this.recordModificar = null;
            _this.gridDatosInferior.getStorePrincipal().load();
            _this.modelo.inferioreElimi.deleteAll();
            _this.gridproductoProd.getStorePrincipal().reload();
            _this.modelo.reset();
            _this.modelo.idanno = _this.idanno;
        });
    },
    validarBtns: function () {
        if (this.modelo.isValid()) {
            this.modelo.habilitarBotones();
        } else {
            this.modelo.habilitarBotones(true);
        }
    }
});
//Grid codificador de producto
Ext.erp.gridproductoProducto = Ext.extend(LOG.util.UITemplate, {
    idanno: undefined,
    estructurahija: undefined,
    idPadreRaiz: undefined,
    idindicador: undefined,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlBusquedaGridPrincipal = 'cargarCodificador';
        this.modoSeleccion = 1;
        this.idioma = config.idioma;
        this.textBusquedaSimple = "c\xf3digo y denominaci\xf3n";
        this.concepto = "codificador";
        Ext.erp.gridproductoProducto.superclass.constructor.call(this, config);
        this.getVistaPrincipal().on({
            render: function () {
            }
        });
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idindicador'
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 100,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 260,
            dataIndex: 'descripcion',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUM,
            hidden: this.estructurahija,
            width: 60,
            align: 'center',
            dataIndex: 'unidadmedida',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgTipoCuadro,
            width: 130,
            dataIndex: 'idtipocuadrobasico',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataCuadroBasico, val);
            }

        });
        this.addGridColumn({
            header: this.idioma.cgLaboratorio,
            width: 200,
            hidden: !this.estructurahija,
            dataIndex: 'idproveedor',
            default: true,
            renderer: function (v, x, rec) {
                return rec.json.denomproveedor;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgGrupoFarmacologico,
            width: 260,
            dataIndex: 'idgrupofarmacologico',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val, x, record) {
                return record.json.denomgrupofarmacologico;
            }
        });
        this.addGridColumn({
            header: this.idioma.cgViaAdquisicion,
            width: 130,
            dataIndex: 'idviaadquicicion',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataViaAdquicicion, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgClasificacionVEN,
            width: 100,
            dataIndex: 'idclasificacionven',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataClasificadoVEN, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPrioridad,
            width: 80,
            dataIndex: 'prioridad',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataPrioridad, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgTieneCertificado,
            width: 260,
            dataIndex: 'tienecertificado',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val) {
                return Ext.farm.conf.getDenominacionPorDataId(Ext.farm.conf.datas.dataTieneCertificado, val);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgFormaFarmaceutica,
            width: 130,
            dataIndex: 'formafarmaceutica',
            default: true,
            hidden: !this.estructurahija,
            renderer: function (val, x, record) {
                return record.json.denomforma;
            }
        });

        this.addGridColumn({
            header: this.idioma.cgFormaFarmaceutica,
            id: 'formafarmac',
            hidden: this.estructurahija,
            dataIndex: 'formafarmac',
            width: 100,
            default: true
        });

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            header: this.idioma.cgComposicion,
            hidden: this.estructurahija,
            dataIndex: 'composicion',
            default: true
        }));

        this.addGridColumn({
            header: this.idioma.cgTipoEnvase,
            hidden: this.estructurahija,
            dataIndex: 'tipoembase',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgUnidadPresentacion,
            hidden: this.estructurahija,
            dataIndex: 'unidadpresent',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbCodigoEAN,
            dataIndex: 'codigoean',
            hidden: this.estructurahija,
            default: true
        });

    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridproductoProducto.superclass.render.call(this);
        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
                obj.params.idPadreRaiz = _this.idPadreRaiz;
                obj.params.idanno = _this.idanno;
                obj.params.estructurahija = _this.estructurahija;
                obj.params.idindicador = _this.idindicador;
                obj.params.excluirAllcb = true;
            },
            load: function (st, result, obj) {
            }
        });
        return vista;
    }
});

//Grid izquierdo de los annos
Ext.erp.gridAnno = Ext.extend(LOG.util.UITemplate, {
    hide: undefined,
    datosMostrar: undefined,
    recordsInferior: Array(),
    gridEditable: true,
    constructor: function (config) {
        this.formaVisualizacion = 'panel';
        this.dirController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlBusquedaGridPrincipal = 'cargarAnnos';
        this.modoSeleccion = 2;
        this.idioma = config.idioma;
        this.modelo = new Ext.farm.conf.Modelo({idioma: this.idioma});
        Ext.erp.gridAnno.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;
        var fecha = new Date();
        this.addGridColumn({
            hidden: true,
            dataIndex: 'idanno'
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 100,
            dataIndex: 'denominacion',
            editor: new LOG.util.ComboBox({
                editable: false,
                valueField: 'idanno',
                displayField: 'denominacion',
                store: new Ext.data.SimpleStore({
                    fields: ['idanno', 'denominacion'],
                    data: [
                        [fecha.getFullYear() - 5, fecha.getFullYear() - 5],
                        [fecha.getFullYear() - 4, fecha.getFullYear() - 4],
                        [fecha.getFullYear() - 3, fecha.getFullYear() - 3],
                        [fecha.getFullYear() - 2, fecha.getFullYear() - 2],
                        [fecha.getFullYear() - 1, fecha.getFullYear() - 1],
                        [fecha.getFullYear(), fecha.getFullYear()],
                        [fecha.getFullYear() + 1, fecha.getFullYear() + 1],
                        [fecha.getFullYear() + 2, fecha.getFullYear() + 2],
                        [fecha.getFullYear() + 3, fecha.getFullYear() + 3],
                        [fecha.getFullYear() + 4, fecha.getFullYear() + 4],
                        [fecha.getFullYear() + 5, fecha.getFullYear() + 5]
                    ]

                })
            })

        });
        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 100,
            dataIndex: 'estado',
            default: true,
            renderer: function (val) {
                if (val == 0)
                    return "Elaboraci\xf3n";
                else if (val == 1)
                    return "Aprobado";
                else return "Cerrado";
            }
        });
        this.addGridColumn({
            header: 'Fecha de inicio',
            width: 100,
            dataIndex: 'fechainicio',
            editor: new Ext.form.DateField({}),
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
        });
        this.addGridColumn({
            header: 'fechafin',
            width: 100,
            dataIndex: 'fechafin',
            editor: new Ext.form.DateField({}),
            renderer: function (value, c, record) {
                return _this.formatDate(value, c, record)
            },
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(this.btnAdd = LOG.util.Prototipos.botonAdicionar({
            tooltip: 'Adicionar a\xf1o',
            text: ' ',
            handler: function () {
                var add = new Ext.farm.conf.AdicionarAnno({
                    height: 200,
                    width: 300,
                    title: _this.idioma.tlAdicionarAnno,
                    idioma: _this.idioma,
                    usarAplicar: false
                });
                add.show();
                add.aceptarFn = function () {
                    var denomina = add.getDenominacion();
                    var fechaFI = add.dfFechaInicio.getValue();
                    var fechaFF = add.dfFechaFin.getValue();
                    _this.modelo.adicionarAnnos({
                        denominacion: denomina,
                        fechainicio: fechaFI,
                        fechafin: fechaFF
                    }, function (val) {
                    })
                }
            }
        }));
        this.addToolbarButton(this.btnDel = LOG.util.Prototipos.botonEliminar({
            text: ' ',
            tooltip: 'Eliminar a\xf1o',
            disabled: true,
            handler: function () {
                _this.modelo.eliminarAnnos({
                    id: _this.getSmPrincipal().getSelected().data.idanno
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        if (_caller.getSmPrincipal().getSelected().data.estado == 0) {
                            b.enable();
                        }
                        else b.disable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(this.btnDup = LOG.util.Prototipos.botonDuplicar({
            text: " ",
            tooltip: 'Dupilcar a\xf1o',
            isContextual: true,
            disabled: true,
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                var add = new Ext.farm.conf.AdicionarAnno({
                    height: 200,
                    width: 300,
                    title: _this.idioma.tlAdicionarAnno,
                    idioma: _this.idioma,
                    usarAplicar: false,
                    duplicar: true,
                    recordDuplicar: record
                });
                add.show();
                add.aceptarFn = function () {
                    var denomina = add.getDenominacion();
                    var fechaFI = add.dfFechaInicio.getValue();
                    var fechaFF = add.dfFechaFin.getValue();
                    _this.modelo.adicionarAnnos({
                        denominacion: denomina,
                        duplicar: record.data.idanno,
                        fechainicio: fechaFI,
                        fechafin: fechaFF
                    }, function (val) {
                    })
                }

            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        b.enable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));

        this.addToolbarButton(this.btnMod = LOG.util.Prototipos.botonModificar({
            text: " ",
            tooltip: 'Modificar a\xf1o',
            isContextual: true,
            disabled: true,
            handler: function () {
                var storee = _this.getStorePrincipal().getModifiedRecords();// para obtener todas las filas modificadas

                _this.modelo.modificarAnno(storee);
                _this.btnMod.disable();

            },
            controlFn: function (b, _caller) {
                b.disable();                
            }
        }));

        this.addToolbarButton(this.btnApr = LOG.util.Prototipos.botonAprobar({
            text: " ",
            tooltip: 'Aprobar a\xf1o',
            isContextual: true,
            disabled: true,
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                _this.modelo.aprobarAnno(record.data, function (res) {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        var recSelected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected() && recSelected.data.estado == 0)
                            b.enable();
                        else b.disable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }));
        this.addToolbarButton(this.btnActv = LOG.util.UIManager.createBtn({
            text: " ",
            tooltip: 'Activar a\xf1o',
            isContextual: true,
            iconCls: 'habilitar',
            disabled: true,
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                _this.modelo.activarAnno(record.data, function (res) {
                    _this.getStorePrincipal().reload();
                });
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent =
                    _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                        if (e == 'rowselect') {
                            var recSelected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                            var alguien = false;
                            if (recSelected.json.activo == 0) {
                                b.show();
                                _caller.getStorePrincipal().each(function (rec) {
                                    if (rec.data.idanno != recSelected.data.idanno && rec.json.activo == 1)
                                        alguien = true;
                                });
                            }
                            else b.hide();
                            if (recSelected && recSelected.json.estado == 1) {

                                if (recSelected.json.activo == 0 && recSelected.json.estado == 1 && !alguien)
                                    b.enable();
                                else b.disable();
                            }

                            else b.disable();
                        }
                        if (e == 'rowdeselect') {
                            b.disable();
                        }
                    });
            }
        }));        
        this.addToolbarButton(this.btnCerr = LOG.util.Prototipos.botonCancelar({
            text: " ",
            tooltip: 'Cerrar a\xf1o',
            isContextual: true,
            disabled: true,
            handler: function () {
                var record = _this.getGridPrincipal().getSelectionModel().getSelected();
                _this.modelo.cerrarAnno(record.data);
            },
            controlFn: function (b, _caller) {
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function (e) {
                    if (e == 'rowselect') {
                        var recSelected = _caller.getGridPrincipal().getSelectionModel().getSelected();
                        if (_caller.getGridPrincipal().getSelectionModel().getSelected() && recSelected.data.estado == 1)
                            b.enable();
                        else b.disable();
                    }
                    if (e == 'rowdeselect') {
                        b.disable();
                    }
                });
            }
        }), true);
        Ext.apply(this.btnAdd, {key: null});
        Ext.apply(this.btnDel, {key: null});
        Ext.apply(this.btnDup, {key: null});
        Ext.apply(this.btnApr, {key: null});
        Ext.apply(this.btnCerr, {key: null, text: ' '});
        Ext.apply(this.btnActv, {key: null, text: ' '});
    },
    render: function () {
        var _this = this;
        var vista = Ext.erp.gridAnno.superclass.render.call(this);
        this.bandera = -1;
        this.banderaintermedia = 0;
        _this.btnMod.disable();
        Ext.apply(this.gpPrincipal, {
            viewConfig: {
                getRowClass: function (rec, index, rowParams, store) {
                    if (rec.json.activo == 1) {
                        return 'greenrow-text';
                    }
                    if (_this.bandera == index) {
                        return 'redrow-text';
                    }
                }
            }
        });
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'beforeedit') {
                if (obj.record.data.estado == 0) {
                    obj.cancel = false;
                    if (obj.row != _this.bandera && _this.bandera != -1) {// *******************..........para cancelar las filas en el modificar anno
                        obj.cancel = true;
                    }
                }
                else {
                    obj.cancel = true;
                }
            }
            if (e == 'afteredit') {

                if (obj) {// ********************************************..........para validar el modificar anno
                    var fi = obj.record.data.fechainicio;
                    var ff = obj.record.data.fechafin;
                    var denominacion = obj.record.data.denominacion;
                    var conflicto = [];

                    _this.banderaintermedia = 0;
                    obj.grid.store.data.items.forEach(function (p) {
                        if (obj.record.id != p.id) {

                            if (typeof p.data['fechainicio'] === 'object') {
                                var fechai = new Date(p.data['fechainicio']);
                            }
                            else {
                                var anno = p.data['fechainicio'].substring(6, 10);
                                var mes = parseInt(p.data['fechainicio'].substring(3, 5)) - 1;
                                var dia = p.data['fechainicio'].substring(0, 2);
                                var fechai = new Date(anno, mes, dia);
                            }
                            if (typeof p.data['fechafin'] === 'object') {
                                var fechafin = new Date(p.data['fechafin']);
                            }
                            else {
                                var anno = p.data['fechafin'].substring(6, 10);
                                var mes = parseInt(p.data['fechafin'].substring(3, 5)) - 1;
                                var dia = p.data['fechafin'].substring(0, 2);
                                var fechafin = new Date(anno, mes, dia);
                            }
                            if (typeof fi != 'object') {
                                var anno = fi.substring(6, 10);
                                var mes = parseInt(fi.substring(3, 5)) - 1;
                                var dia = fi.substring(0, 2);
                                fi = new Date(anno, mes, dia);
                            }
                            if (typeof ff != 'object') {
                                var anno = ff.substring(6, 10);
                                var mes = parseInt(ff.substring(3, 5)) - 1;
                                var dia = ff.substring(0, 2);
                                ff = new Date(anno, mes, dia);
                            }
                            if (denominacion == p.data['denominacion']) {
                                _this.bandera = obj.row;
                                _this.banderaintermedia = 1;
                                conflicto[conflicto.length] = p.data['denominacion'];
                            }
                            else if (fi > fechai && fi < fechafin) {
                                _this.bandera = obj.row;
                                _this.banderaintermedia = 1;
                                conflicto[conflicto.length] = p.data['denominacion'];
                            }
                            else if (ff > fechai && ff < fechafin) {
                                _this.bandera = obj.row;
                                _this.banderaintermedia = 1;
                                conflicto[conflicto.length] = p.data['denominacion'];
                            }
                            else if (fi < fechai && ff > fechafin) {
                                _this.bandera = obj.row;
                                _this.banderaintermedia = 1;
                                conflicto[conflicto.length] = p.data['denominacion'];
                            }
                            else if (fi > ff) {
                                _this.bandera = obj.row;
                                _this.banderaintermedia = 1;
                                conflicto[conflicto.length] = " La fecha de inicio tiene que ser menor que la fecha fin";
                            }
                        }
                    });
                    if (_this.banderaintermedia == 0) {
                        _this.bandera = -1;
                    }
                    if (_this.bandera != -1) {
                        _this.btnMod.disable();

                        _this.gpPrincipal.getView().refresh();
                        //3 error, 2 confirm, 1 alert.....
                        mostrarMensaje(3, 'Conflicto con:(' + conflicto + ').')
                    }
                    else {
                        _this.gpPrincipal.getView().refresh();
                        _this.btnMod.enable();
                    }
                }

            }
        });

        return vista;
    },
    formatDate: function (value, c, record) {
        if (value) {
            if (typeof value == "object") {
                return value.dateFormat('d/m/Y');
            }
        }
        return value;
    }


});
//panel Izquierdo q contiene el gridAnno
Ext.erp.configuracionfarmacia.panelIzq = Ext.extend(Ext.Panel, {
    panelAnno: undefined,
    btnAdicionar: undefined,
    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'west';
        this.loadMask = true;
        this.title = 'A\xf1os';
        this.idioma = config.idioma;
        this.width = 200;
        this.bildComponent();
        Ext.apply(this, {
            labelAlign: 'top',
            width: 255,
            minSize: 255,
            maxSize: 500,
            frame: true,
            collapsible: true,
            titleCollapse: true,
            collapseMode: 'mini',
            layout: 'border',
            border: true,
            split: true,
            margins: '0 2 0 0',
            cmargins: '0 0 0 0',
            autoScroll: true,
            items: [this.panelAnno]
        });

        Ext.erp.configuracionfarmacia.panelIzq.superclass.constructor.call(this, config);
    },
    bildComponent: function () {
        var _this = this;
        this.gridAnno = new Ext.erp.gridAnno({idioma: this.idioma});
        this.gridAnno.init();
        this.panelAnno = this.gridAnno.view();
    }

});
//Ventana de adicionar los annos
Ext.farm.conf.AdicionarAnno = Ext.extend(LOG.util.Window, {
    idioma: undefined,
    duplicar: false,
    recordDuplicar: undefined,
    constructor: function (config) {
        var _this = this;
        this.region = 'center';
        this.frame = true;
        this.loadMask = true;
        this.idioma = config.idioma;
        this.duplicar = (config.duplicar) ? config.duplicar : false;
        this.recordDuplicar = (config.recordDuplicar) ? config.recordDuplicar : undefined;
        this.resizable = false;
        this.bildComponents();
        var cls1 = new LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        cls1.addComponent(this.tfDenominacion);
        var cls2 = new LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        cls2.addComponent(this.dfFechaInicio);
        cls2.addComponent(this.dfFechaFin);
        Ext.apply(this, {
            items: [new LOG.util.UIManager.initForm({region: 'center', frame: true, items: [cls1, cls2]})]
        });
        Ext.farm.conf.AdicionarAnno.superclass.constructor.call(this, config);

        this.listaBotones.getItem(2).disable();
        if (this.duplicar) {
            if (this.isValid()) {
                this.listaBotones.getItem(2).enable()
            }
            else this.listaBotones.getItem(2).disable();
        }
    },
    bildComponents: function () {
        var _this = this;
        var fecha = new Date();
        this.tfDenominacion = new LOG.util.ComboBox({
            fieldLabel: 'A\xf1o',
            allowBlank: false,
            enableKeyEvents: true,
            hiddenName: 'idanno',
            valueField: 'idanno',
            displayField: 'denominacion',
            store: new Ext.data.SimpleStore({
                fields: ['idanno', 'denominacion'],
                data: [
                    [fecha.getFullYear() - 5, fecha.getFullYear() - 5],
                    [fecha.getFullYear() - 4, fecha.getFullYear() - 4],
                    [fecha.getFullYear() - 3, fecha.getFullYear() - 3],
                    [fecha.getFullYear() - 2, fecha.getFullYear() - 2],
                    [fecha.getFullYear() - 1, fecha.getFullYear() - 1],
                    [fecha.getFullYear(), fecha.getFullYear()],
                    [fecha.getFullYear() + 1, fecha.getFullYear() + 1],
                    [fecha.getFullYear() + 2, fecha.getFullYear() + 2],
                    [fecha.getFullYear() + 3, fecha.getFullYear() + 3],
                    [fecha.getFullYear() + 4, fecha.getFullYear() + 4],
                    [fecha.getFullYear() + 5, fecha.getFullYear() + 5]
                ]
            }),
            listeners: {
                keyup: function () {
                    if (_this.isValid()) {
                        _this.listaBotones.getItem(2).enable()
                    }
                    else _this.listaBotones.getItem(2).disable();
                },
                select: function () {
                    if (_this.isValid()) {
                        _this.listaBotones.getItem(2).enable()
                    }
                    else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.dfFechaInicio = new Ext.form.DateField({
            name: 'fechainicio',
            fieldLabel: 'Fecha de inicio',
            width: 200,
            allowBlank: false,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaFin.setMinValue(campo.getValue());
                    if (_this.isValid()) {
                        _this.listaBotones.getItem(2).enable()
                    }
                    else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        this.dfFechaFin = new Ext.form.DateField({
            name: 'fechafin',
            fieldLabel: 'Fecha fin',
            width: 200,
            allowBlank: false,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            listeners: {
                'select': function (campo) {
                    _this.dfFechaInicio.setMaxValue(campo.getValue());
                    if (_this.isValid()) {
                        _this.listaBotones.getItem(2).enable()
                    }
                    else _this.listaBotones.getItem(2).disable();
                }
            }
        });
        if (this.duplicar) {
            this.tfDenominacion.setValue(fecha.getFullYear() + 1);
            this.dfFechaFin.setValue(this.recordDuplicar.data.fechafin);
            this.dfFechaInicio.setValue(this.recordDuplicar.data.fechainicio);
        }
    },
    getDenominacion: function () {
        return this.tfDenominacion.getValue();
    },
    isValid: function () {
        if (this.tfDenominacion.isValid() && this.dfFechaFin.isValid() && this.dfFechaInicio.isValid()) {
            return true;
        }
        return false;
    }
});

//Modelo
Ext.farm.conf.Modelo = Ext.extend(LOG.util.Model, {
    urlAccionAdicionarAnno: undefined,
    urlAccionEliminarAnno: undefined,
    urlAccionDuplicarAnno: undefined,
    urlAccionEliminarActividades: undefined,
    urlAccionAdicionarMedios: undefined,
    urlAccionEliminarMedios: undefined,
    urlAccionActivarAnno: undefined,
    urlAccionModificarAnno: undefined,
    inferioreelimi: undefined,
    isDirtyGridInferior: false,
    idindicador: undefined,
    stGridValidar: undefined,
    constructor: function (config) {
        config.urlController = '/logistica/farmacia/configuracion/index.php/configuracionfarmacia';
        this.urlAccionAdicionarAnno = '/adicionarAnnos';
        this.urlAccionEliminarAnno = '/eliminarAnno';
        this.urlAccionDuplicarAnno = '/duplicarAnno';
        this.urlAccionAprobarAnno = '/aprobarAnno';
        this.urlAccionCerrarAnno = '/cerrarAnno';
        this.urlAccionActivarAnno = '/activarAnno';

        this.urlAccionModificarAnno = '/modificarAnno';

        this.inferioreElimi = new LOG.util.List(config.acciones);
        if (!config.fields) {
            config.fields = [];
        }
        config.fields.push({
            name: 'idcuadrobasico',
            primary: true
        });
        config.fields.push({
            name: 'idtipocuadrobasico'
        });
        config.fields.push({
            name: 'idgrupofarmacologico'
        });
        config.fields.push({
            name: 'idclasificacionven'
        });
        config.fields.push({
            name: 'idproveedor'
        });
        config.fields.push({
            name: 'idviaadquicicion'
        });
        config.fields.push({
            name: 'prioridad'
        });
        config.fields.push({
            name: 'formulamagistral'
        });
        config.fields.push({
            name: 'tienecertificado'
        });
        config.fields.push({
            name: 'idtipounidadsalud'
        });
        config.fields.push({
            name: 'idindicador'
        });
        config.fields.push({
            name: 'precioventa'
        });
        this.stGridValidar = null;
        Ext.farm.conf.Modelo.superclass.constructor.call(this, config);
    },
    modificarAnno: function (parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgModificandoAnno, this.idioma.msgEspere || '...');
        var filas = [];
        var cont = 0;

        parametros.forEach(function (p) {
                filas[cont] = p.data;
                cont++;
            }
        );
        cont = 0;
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionModificarAnno,
            method: 'POST',
            params: {filas: Ext.encode(filas)},
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {

                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgAnnoModificado);
                        if (this.st) {

                            _this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    mostrarMensaje(3, resp.message);
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });


    },
    adicionarAnnos: function (parametros, _fn, _fnfail) {
        var _this = this;
        Ext.MessageBox.wait(this.idioma.msgAdicionandoAnno, this.idioma.msgEspere || '...');
        var objSubmit = parametros || {};
        Ext.Ajax.request({
            url: _this.urlController + _this.urlAccionAdicionarAnno,
            method: 'POST',
            params: objSubmit,
            callback: function (o, s, r) {
                Ext.MessageBox.hide();
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                this.apply(resp);
                if (resp.success) {
                    if (s) {
                        mostrarMensaje(1, _this.idioma.lbMsgAnnoSalvado);
                        if (this.st) {
                            _this.st.reload();
                        }
                    }
                    if (typeof _fn == 'function') {
                        _fn.createDelegate(this, [resp]).call();
                    }
                } else {
                    mostrarMensaje(3, resp.message);
                    if (typeof _fnfail == 'function') {
                        _fnfail.createDelegate(this, [resp]).call();
                    }
                }
            }.createDelegate(this)
        });
    },
    eliminarAnnos: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarAnnos, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoAnno, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionEliminarAnno,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgAnnoEliminado);
                                if (this.st) {
                                    this.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    aprobarAnno: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgAprobarAnnos, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgAprobandoAnno, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.idanno) ? Ext.encode([objSubmit.idanno]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionAprobarAnno,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgAnnoAprobado);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    cerrarAnno: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgCerrarAnnos, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgCerrandoAnno, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.idanno) ? Ext.encode([objSubmit.idanno]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionCerrarAnno,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgAnnoCerrado);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    activarAnno: function (parametros, _fn, loadStore) {
        var _this = this;
        if (!this.sm.hasSelection()) {
            mostrarMensaje(1, this.idioma.msgSelectObjeto);
            return;
        }
        mostrarMensaje(2, this.idioma.msgActivarAnnos, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgActivandoAnno, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.idanno) ? Ext.encode([objSubmit.idanno]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + _this.urlAccionActivarAnno,
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgAnnoActivado);
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                        else {
                            mostrarMensaje(3, resp.message);
                        }
                    }.createDelegate(this)
                });
            }
        }.createDelegate(this));
    },
    adicionarCB: function (parametros, _fn, _fnfail) {
        var _this = this;
        if (this.isValid()) {
            Ext.MessageBox.wait(this.idioma.msgAdicionandoCuadroBasico, this.idioma.msgEspere || '...');
            var objSubmit = parametros || {};
            objSubmit.data = Ext.encode(objSubmit.data || this.encode());
            Ext.Ajax.request({
                url: _this.urlController + '/adicionarCuadroBasico',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    Ext.MessageBox.hide();
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                    if (resp.success) {
                        if (s) {
                            mostrarMensaje(1, _this.idioma.lbMsgCuadroBasicoSalvado);
                            if (this.st) {
                                _this.st.reload();
                            }
                        }
                        if (typeof _fn == 'function') {
                            _fn.createDelegate(this, [resp]).call();
                        }
                    } else {
                        if (typeof _fnfail == 'function') {
                            _fnfail.createDelegate(this, [resp]).call();
                        }
                    }
                }.createDelegate(this)
            });
        } else {
            mostrarMensaje(3, this.idioma.msgDatosIncorrectos);
        }
    },
    eliminarCB: function (parametros, _fn, loadStore) {
        var _this = this;
        mostrarMensaje(2, this.idioma.msgEliminarCuadroBasico, function (btn) {
            if (btn == 'ok') {
                Ext.MessageBox.wait(this.idioma.msgEliminandoCuadroBasico, this.idioma.msgEspere || '...');
                var objSubmit = parametros || {};
                objSubmit.id = (objSubmit.id) ? Ext.encode([objSubmit.id]) : Ext.encode(_this.getSelectedId());
                Ext.Ajax.request({
                    url: _this.urlController + '/eliminarCuadroBasico',
                    method: 'POST',
                    params: objSubmit,
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        this.apply(resp);
                        if (resp.success) {
                            if (s) {
                                mostrarMensaje(1, this.idioma.msgCuadroBasicoEliminado);
                                if (this.st) {
                                    this.st.reload();
                                }
                            }
                            if (typeof _fn == 'function') {
                                _fn.createDelegate(this, [resp]).call();
                            }
                        }
                    }.createDelegate(this)

                });
            }
        }.createDelegate(this));
    },
    reset: function () {
        for (var property in this) {
            if (typeof this[property] != 'function'
                && this.keys.indexOf(property) == -1
                && property != 'primaryKeyField') {
                this[property] = null;
            }
        }
        if (this.basicForm) {
            this.basicForm.items.each(function (field) {
                if (field.isFormField) {
                    field.setValue(null);
                    field.originalValue = field.getValue();
                }
            });
        }
        this.idindicador = undefined;
        this.isDirtyGridInferior = false;
        this.inferioreElimi.deleteAll();
        this.habilitarBotones(true);
    },
    isValid: function () {
        if (this.basicForm) {
            if (this[this.primaryKeyField]) {
                return this.basicForm.isValid() && (this.basicForm.isDirty() || this.isDirtyGridInferior) && this.isValidGrid()
            } else {
                return this.basicForm.isValid() && this.isValidGrid()
            }
        }
        return this.idindicador && 1;
    },
    isValidGrid: function () {
        var _this = this;
        if (this.stGridValidar) {
            var cant = this.stGridValidar.getCount();
            var valid = true;
            //Si tiene algun valor null no es un valor valido para guardar.
            var lastRecord = (_this.stGridValidar) ? _this.stGridValidar.getAt(cant - 1) : null;
            if (lastRecord) {
                if (lastRecord && lastRecord.data.idtipounidadsalud != null && lastRecord.data.idtipodispensacion != null) {
                    for (var i = 0; i < cant - 1; i++) {
                        if (_this.stGridValidar.getAt(i).data.idtipounidadsalud != null && _this.stGridValidar.getAt(i).data.idtipodispensacion != null) {
                            for (var j = i + 1; j < cant; j++) {
                                var recorI = _this.stGridValidar.getAt(i);
                                var recorJ = _this.stGridValidar.getAt(j);
                                if (recorI.data.idtipounidadsalud == recorJ.data.idtipounidadsalud ||
                                    recorI.data.idtipodispensacion == recorJ.data.idtipodispensacion) {
                                    valid = false;
                                }
                            }
                        } else valid = false;
                    }
                } else valid = false;
            }
            return valid;
        }
        return true;
    },
    setStoreGridValidar: function (store) {
        this.stGridValidar = store;
    }
});

Ext.farm.conf.datas = {
    dataCuadroBasico: [
        [1, 'Medicamentos'],
        [2, 'Productos naturales (Medicina Natural Tradicional)'],
        [3, 'Efectos m\xe9dicos'],
        [4, 'Reactivos']
    ],
    dataClasificadoVEN: [
        [1, 'Vitales'],
        [2, 'Esenciales'],
        [3, 'No esenciales'],
        [4, 'Especiales']
    ],
    dataViaAdquicicion: [
        [1, 'Importado'],
        [2, 'Producción nacional'],
        [3, 'Producción local'],
        [4, 'Producción industrial']
    ],
    dataPrioridad: [
        [1, '1'],
        [2, '2'],
        [3, '3']
    ],
    dataTieneCertificado: [
        [1, 'Certificado de Medicamentos Controlados'],
        [2, 'Certificado Médico de Especialidades (CME)'],
        [3, 'Ninguno']
    ],
    dataTipoUnidadSalud: [
        [0, 'FCIA Farmacia comunitaria'],
        [1, 'UEI']
    ],
    dataTipoDispensacion: [
        [1, 'Receta médica'],
        [2, 'Venta Liberada'],
        [3, 'Tarjeta control'],
        [4, 'Fórmula'],
        [5, 'Usufructo'],
        [6, 'Retrovirales'],
        [7, 'Pedido']
    ],
    dataTipoVenta: [
        [1,'Receta médica'],
        [2,'Tarjeta control'],
        [3,'Torpedo'],
        [4,'Caso \xedndice'],
        [5,'Venta libre'],
        [6,'F\xf3rmula'],
        [7,'Usufructo'],
        [8,'Fondo'],
        [9,'Extracci\xf3n']
    ]

};

/**
 *@params data = [
 [id, denominacion] ,
 ...
 ]
 */

Ext.farm.conf.getDenominacionPorDataId = function (data, id) {
    var denominacion = "";
    Ext.each(data, function (arr) {
        if (arr[0] == id) {
            denominacion = arr[1];
        }
    });
    return denominacion;
};
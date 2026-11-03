/**Vista general*/
Ext.LOG.moduloMedio.confRegistroComponentP = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        config.resizable = false;
        var _this = this;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.layout = 'border';
        this.scopeSm = config.scopeSm;
        this.dataregnumerico = config.dataregnumerico;
        this.denentidad = this.identidad;
        this.tree = this.tree;
        this.idarea = config.idarea;
        this.objObra = config.objObra;
        this.expediente = config.expediente;
        this.titlesTabs = this.titlesTabs;

        this.dsbasedatos = new Array();
        this.modelo = new Ext.LOG.modulo.Model({
            idioma: config.idioma,
            dataregnumerico: this.dataregnumerico,
        });

        this.listaStores = new LOG.util.List();
        this.array = Array();
        this.validos = Array();
        Ext.LOG.moduloMedio.confRegistroComponentP.superclass.constructor.call(this, config);
        this.setTitle(this.title);
        this.panelDatos();
        this.bodyStyle = 'padding:5px 5px 0';
        this.modal = true;
        this.collapsible = true;
        this.width = 445;
        this.height = 130;
        this.documentKeyMap = new Ext.KeyMap(document,
            [{
                alt: false,
                ctrl: true,
                key: Ext.EventObject.ENTER,
                shift: false,
                fn: function () {
                    alert('ass')
                    if (_this.listaBotones.getItem(1).isVisible() && !_this.this.listaBotones.getItem(1).disabled) {
                        _this.listaBotones.getItem(1).handler(_this.listaBotones.getItem(1));
                    }
                }
            }]);
    },
    initComponent: function (config) {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            handler: function () {
                if (!_this.expediente) {
                    _this.tree.getStore().load({
                        params: {
                            anode: null
                        }
                    });
                }
                _this.close();
            }
        }, true)));
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonAceptar({
            disabled: true,
            handler: function () {

                _this.modelo.guardarValores(_this.listaStores, function () {
                   /* console.info(_this.scopeSm.data.espadre);
                    console.info("Osmel");*/
                    _this.listaStores.each(function (o) {
                        o.store.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                        o.store.initBaseParams.espadre = (_this.scopeSm.data.espadre) ? 1 : 0;
                        o.store.load();
                    });
                    _this.tabpanel.items.each(function (tab) {
                        _this.modelo.obtenerLista(tab.idComponent).each(function (cmp) {
                        });
                    });
                    _this.cargarDatosTabs();
                    _this.listaBotones.getItem(1).setDisabled(true);
                });
                if (_this.expediente) {
                    _this.expediente.comboRegimen.enable();
                }
            }
        })));
        _this.modelo.addListConditions(this.listaBotones.getItem(1));

        Ext.LOG.moduloMedio.confRegistroComponentP.superclass.initComponent.call(this);
    },
    /*Panel de datos general*/
    panelDatos: function () {
        var _this = this;
        var f = new Date();
        _this.existeRegistro = (this.dataregnumerico.data.registro == null) ? false : true;
        this.denominacion = (_this.dataregnumerico.data.denominacion) ? _this.dataregnumerico.data.denominacion : "_";
        this.unidadmilitar = _this.denentidad;
        this.fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();

        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsPanelfieluno = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtml2 + '  ' + _this.denominacion});
        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtmlUM + '  ' + _this.unidadmilitar});
        this.clsPanelfieluno.addComponent({html: _this.idioma.lbHtmlFecha + '  ' + _this.fecha});
        this.clsPanel.addComponent(new Ext.form.FieldSet({
            title: _this.idioma.lbDatosMedio,
            autoHeight: true,
            items: [this.clsPanelfieluno]
        }));
        this.panelCenter = LOG.util.UIManager.initForm({
            frame: true,
            region: 'north',
            layout: 'form',
            defaultsAnchor: '100%',
            anchor: '100%',
            autoHeight: true,
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            },
            items: [this.clsPanel]
        });


        this.tabpanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true

        });


        //this.denominacioncolumnareporte = "constAloj";//constAloj ingenieria vivienda sistemaEmp 

        _this.modelo.setEntidad(this.denominacioncolumnareporte);

        if (this.titlesTabs.length > 0) {
            for (var i = 0; i < this.titlesTabs.length; i++) {
                this.panelDatosG = LOG.util.UIManager.initForm({
                    frame: false,
                    border: false,
                    anchor: '100%',
                    idComponent: i,
                    region: 'center'
                });
                if (_this.denominacioncolumnareporte == "vivienda") {
                    this.getRegistroVivienda(this.panelDatosG);
                }
                if (_this.denominacioncolumnareporte == "ingenieria") {

                    this.getRegistroIngenieria(this.panelDatosG);
                }
                if (_this.denominacioncolumnareporte == "constAloj" || _this.denominacioncolumnareporte == "sistemaEmp") {
                    this.getRegistroCampSistemaEmp(this.panelDatosG);
                }
                _this.modelo.inicializarListas();
                /*var panelCenterTabs = LOG.util.UIManager.initForm({
                 frame: true,
                 region: 'center',
                 layout: 'form',
                 anchor: '95%',
                 autoHeight: true,

                 defaults: {
                 anchor: '95%',
                 msgTarget: 'side'
                 },
                 items: [this.panelDatosG]
                 });*/
                this.tabpanel.add(new LOG.util.Panel({
                    region: 'center',
                    frame: true,
                    idComponent: i,
                    autoScroll: true,
                    title: this.titlesTabs[i],
                    items: [this.panelDatosG]
                }));
            }
            this.tabpanel.on({
                'tabchange': function (panel, tab) {
                    _this.listaStores.each(function (o) {
                        if (_this.existeRegistro && tab.idComponent == 0) {
                            o.store.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                            o.store.load();
                        } else {
                            if (o.tab == tab.idComponent) {
                                o.store.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                                if (o.store.getCount() == 0) {
                                    o.store.change = false;
                                    o.store.load();
                                }
                            }
                        }
                    });
                }
            })
        }
        this.add(this.panelCenter, this.tabpanel);
        _this.cargarDatosTabs();
    },
    /*Construccion de la vista de vivienda*/
    getRegistroVivienda: function (panelDatosG) {
        var _this = this;
        var campos = _this.getCampos();
        if (panelDatosG.idComponent == 0) {
            var clsPanelIdentificacion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfieluno = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            var clsPanelfieldos = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });

            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(campos[0])));
            campos[0].getStore().reload();
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(campos[1])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(campos[2])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(campos[3])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(campos[4])));

            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosGenerales,
                items: [clsPanelfieluno]
            }));
            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[16])));
            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[6])));
            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[22])));
            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[23])));
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                title: _this.idioma.lbDatosInventario,
                autoHeight: true,
                items: [clsPanelfieldos]
            }));
            var clsPanelfieltres = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[7])));
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[18])));
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[19])));
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[20])));
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[21])));
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosExtras,
                items: [clsPanelfieltres]
            }));
            panelDatosG.add(clsPanelIdentificacion);

        }
        if (panelDatosG.idComponent == 1) {
            var clsPanelUbicacion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielUbicacGeogra = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            var clsPanelfielcuatro = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelfielUbicacGeogra.addComponent(this.contenedor(this.contenedor(campos[8])));
            clsPanelfielUbicacGeogra.addComponent(this.contenedor(this.contenedor(campos[9])));

            clsPanelUbicacion.addComponent(new Ext.form.FieldSet({
                title: _this.idioma.lbUbicacionGeogr,
                autoHeight: true,
                items: [clsPanelfielUbicacGeogra]
            }));

            var clsPanelfielDireccion = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            var camposdireccion = _this.getCamposDireccion();
            for (var i = 0; i < camposdireccion.length - 1; i++) {
                if (i < camposdireccion.length) {
                    clsPanelfielDireccion.addComponent(this.contenedor(this.contenedor(camposdireccion[i])));
                }
            }

            clsPanelUbicacion.addComponent(new Ext.form.FieldSet({
                title: _this.idioma.lbTextDireccion,
                autoHeight: true,
                items: [clsPanelfielDireccion]
            }));

            panelDatosG.add(clsPanelUbicacion);
        }
        if (panelDatosG.idComponent == 2) {
            var clsPanelConstruccion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielConst = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            var clsPanelfielTipologia = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelfielConst.addComponent(this.contenedor(this.contenedor(campos[10])));
            clsPanelfielConst.addComponent(this.contenedor(this.contenedor(campos[11])));
            clsPanelfielConst.addComponent(this.contenedor(this.contenedor(campos[12])));
            campos[11].getStore().load();
            campos[12].getStore().load();

            clsPanelConstruccion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosVivienda,
                items: [clsPanelfielConst]
            }));

            clsPanelfielTipologia.addComponent(this.contenedor(this.contenedor(campos[13])));
            clsPanelfielTipologia.addComponent(this.contenedor(this.contenedor(campos[14])));
            clsPanelfielTipologia.addComponent(this.contenedor(this.contenedor(campos[15])));
            campos[13].getStore().load();
            campos[14].getStore().load();
            campos[15].getStore().load();
            clsPanelConstruccion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextTipologiaTecnConst,
                items: [clsPanelfielTipologia]
            }));

            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getCargarGridConstruccion',
                urlAux: 'eliminarCompartimentoVivienda',
                entidad: _this.denominacioncolumnareporte,
                modelo: _this.modelo,
                pEliminar: Array('idregnumerico', 'idcompartimiento'),
                tab: panelDatosG.idComponent,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                obligatorio: true,
                modify: _this.existeRegistro
            });
            gridEquipos.init();
            var grid = gridEquipos.view();
            grid.height = 435;
            clsPanelConstruccion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextCompartimientos,
                items: [grid]
            }));
            var obj = {};
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            panelDatosG.add(clsPanelConstruccion);

        }
        if (panelDatosG.idComponent == 3) {
            var clsPanelOtrosDatos = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });
            var clsPanelOtrosDatosGeneral = LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '100%'
            });

            var clsPanelfielDatosContables = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielDatosArrendatario = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            var otrosDatos = _this.getCamposOtrosDatos();
            clsPanelfielDatosContables.addComponent(this.contenedor(this.contenedor(otrosDatos[0])));
            clsPanelfielDatosContables.addComponent(this.contenedor(this.contenedor(otrosDatos[1])));
            clsPanelfielDatosContables.addComponent(this.contenedor(this.contenedor(otrosDatos[2])));

            clsPanelOtrosDatos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextDatosContable,
                items: [clsPanelfielDatosContables]
            }));

            var clsPanelOtrosDatosMedio = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            clsPanelOtrosDatosMedio.addComponent(this.contenedor(this.contenedor(otrosDatos[3])));
            clsPanelOtrosDatosMedio.addComponent(this.contenedor(this.contenedor(otrosDatos[5])));
            clsPanelOtrosDatosMedio.addComponent(this.contenedor(this.contenedor(otrosDatos[4])));
            clsPanelfielDatosArrendatario.addComponent(clsPanelOtrosDatosMedio);

            var clsPanelfielfechaArrendam = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielDatosArrendatarioaux = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelfielDatosArrendatarioaux.addComponent(this.contenedor(this.contenedor(otrosDatos[6])));
            clsPanelfielDatosArrendatarioaux.addComponent(this.contenedor(this.contenedor(otrosDatos[7])));
            clsPanelfielfechaArrendam.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextDatosContable,
                items: [clsPanelfielDatosArrendatarioaux]
            }));
            clsPanelfielDatosArrendatario.addComponent(this.contenedor(this.contenedor(clsPanelfielfechaArrendam)));

            clsPanelOtrosDatos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextFechaArrendamiento,
                items: [clsPanelfielDatosArrendatario]
            }));

            var clsPanelfielocupViviaux = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfist = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielocupVivi = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            //clsPanelfielocupViviaux.addComponent(this.contenedor(this.contenedor(otrosDatos[8])));
            clsPanelfist.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextOcupacionViviendaPor,
                items: [this.contenedor(this.contenedor(otrosDatos[8]))]
            }));
            clsPanelfielocupVivi.addComponent(clsPanelfist);
            otrosDatos[8].getStore().load();
            var clsPanelfistdos = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelfistdos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextVinculacionlaboral,
                items: [this.contenedor(this.contenedor(otrosDatos[9]))]
            }));
            otrosDatos[9].getStore().load();
            clsPanelfielocupVivi.addComponent(clsPanelfistdos);
            clsPanelOtrosDatos.addComponent(clsPanelfielocupVivi);
            clsPanelOtrosDatosGeneral.addComponent(clsPanelOtrosDatos);


            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getCargarGridOtrasInstalaciones',
                urlAux: 'eliminarCompartimentoVivienda',
                otrosdatos: true,
                entidad: _this.denominacioncolumnareporte,
                tab: panelDatosG.idComponent,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                obligatorio: true,
                pEliminar: Array('idregnumerico', 'idotrasinstalaciones'),
                modelo: _this.modelo
            });
            gridEquipos.init();
            var gridOtras = gridEquipos.view();
            gridOtras.height = 432;

            clsPanelOtrosDatosGeneral.addComponent(this.contenedor(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextOtrasInstalaciones,
                items: [gridOtras]
            })));
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            panelDatosG.add(clsPanelOtrosDatosGeneral);
        }
        if (panelDatosG.idComponent == 4) {
            var clsPanelEquipos = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getCargarGridEquiposMedios',
                urlAux: 'eliminarEquiposMediosVivienda',
                viviendaEquipos: true,
                tab: panelDatosG.idComponent,
                entidad: _this.denominacioncolumnareporte,
                pEliminar: Array('idregnumerico', 'idequipomedio'),
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                obligatorio: false,
                modelo: _this.modelo,
                msg: _this.idioma.MsgEliminarPuntoFuego
            });
            gridEquipos.init();
            var gridEq = gridEquipos.view();
            gridEq.height = 620;
            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.btnAdicionaEquipoyOtrosMedios,
                handler: function () {
                    _this.onAdicionar(false, gridEquipos);
                }
            });

            clsPanelEquipos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextEquiposOtrosMediosEntregados,
                items: [gridEq]
            }));
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            panelDatosG.add(clsPanelEquipos);
        }
        _this.modelo.bindFormMedio(panelDatosG, panelDatosG.idComponent);
    },
    /*Construccion de la vista de ingenieria*/
    getRegistroIngenieria: function (panelDatosG) {
        var _this = this;
        var getCamposOtrosDatos = _this.getCamposOtrosDatos();
        var getCampos = _this.getCampos();
        if (panelDatosG.idComponent == 0) {
            var clsPanelIdentificacion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfieluno = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelfieluno.getColumn(0).columnWidth = 0.15;
            clsPanelfieluno.getColumn(1).columnWidth = 0.15;
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[10])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[11])));
            getCamposOtrosDatos[10].getStore().reload();
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosGenerales,
                items: [clsPanelfieluno]
            }));

            var clsPanelfielUbicacion = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            clsPanelfielUbicacion.getColumn(0).columnWidth = 0.35;
            clsPanelfielUbicacion.getColumn(1).columnWidth = 0.25;
            var clsPanelfielAuxOtro = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            clsPanelfielAuxOtro.addComponent(new LOG.util.Panel({height: 12}));
            clsPanelfielAuxOtro.addComponent(new LOG.util.Panel({height: 12}));
            clsPanelfielAuxOtro.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[12])));
            clsPanelfielAuxOtro.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[14])));
            clsPanelfielAuxOtro.addComponent(new LOG.util.Panel({height: 12}));
            clsPanelfielAuxOtro.addComponent(new LOG.util.Panel({height: 12}));
            clsPanelfielAuxOtro.addComponent(this.contenedor(this.contenedor(getCampos[12])));
            getCampos[12].fieldLabel = 'Utilizaci&oacute;n';
            getCampos[12].on({
                'select': function (combo, record, index) {
                    if (record.data.idestatustecnico == -1) {
                        _this.comboSelladaPor.enable();
                        _this.comboSelladaPor.reset();
                        _this.comboSelladaPor.getStore().load({
                            params: {
                                idpadre: -1
                            }
                        });
                    } else {
                        _this.comboSelladaPor.disable();
                        _this.comboSelladaPor.reset();
                    }
                }
            })
            getCampos[12].getStore().load();
            _this.comboSelladaPor = new LOG.util.ComboBox({
                fieldLabel: 'Sellada por',
                allowBlank: true,
                name: 'idestadooperativo',
                valueField: 'idselladapor',
                displayField: 'denominacion',
                resizable: true,
                url: 'gestSelladaPor',
                autoLoad: false,
                //  typeAhead: true,
                emptyText: _this.idioma.lbCbVacio,
                mode: 'local',
                disabled: true,
                //  editable: false
            });
            _this.comboSelladaPor.getStore().on({
                'beforeload': function (st) {
                    st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                    // st.baseParams.idpadre = (_this.comboEstatusTecnico.getValue()) ? _this.comboEstatusTecnico.getValue() : null;
                },
                'load': function (st, records) {
                    if (records.length > 0) {
                        _this.comboSelladaPor.enable();
                    }
                }
            });
            clsPanelfielAuxOtro.addComponent(this.contenedor(this.contenedor(_this.comboSelladaPor)));
            clsPanelfielUbicacion.addComponent(clsPanelfielAuxOtro);

            var clsPanelFilsCordenadas = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            var clsPanelcorrAux = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });

            var clsPanelfielAux = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[15])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[16])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[17])));
            getCamposOtrosDatos[15].height = 19.5;
            getCamposOtrosDatos[16].height = 19.5;
            getCamposOtrosDatos[17].height = 19.5;
            clsPanelFilsCordenadas.addComponent(new Ext.form.FieldSet({
                height: 72.5,
                title: 'Coordenadas',
                items: [clsPanelcorrAux]
            }));

            clsPanelfielAux.addComponent(clsPanelFilsCordenadas);
            clsPanelfielAux.addComponent(getCamposOtrosDatos[18]);
            clsPanelfielUbicacion.addComponent(clsPanelfielAux);

            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosUbicacion,
                items: [clsPanelfielUbicacion]
            }));
            var clsPanelcolumObser = LOG.util.UIManager.initColumnForm({
                columnas: 4
            });

            clsPanelcolumObser.addComponent(getCampos[7]);
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosExtras,
                items: [clsPanelcolumObser]
            }));
            panelDatosG.add(clsPanelIdentificacion);
        }
        if (panelDatosG.idComponent == 1) {
            var clsPanelObrasprotectoras = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfieotros = LOG.util.UIManager.initColumnForm({
                columnas: 4
            });

            var clsPanelUltimo = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelfieotros.getColumn(0).columnWidth = 0.13;
            clsPanelfieotros.getColumn(1).columnWidth = 0.13;

            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[19])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[20])));

            var clsPanelEntradas = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfiltroEntrada = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });
            clsPanelfiltroEntrada.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[25])));
            clsPanelfiltroEntrada.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[26])));
            clsPanelfiltroEntrada.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[27])));
            clsPanelEntradas.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: 'Entrada',
                items: [clsPanelfiltroEntrada]
            }));
            clsPanelfieotros.addComponent(clsPanelEntradas);
            clsPanelfieotros.addComponent(new LOG.util.Panel({}));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[23])));
            //clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[24])));
            getCamposOtrosDatos[19].getStore().load();
            getCamposOtrosDatos[20].getStore().load();
            getCamposOtrosDatos[23].getStore().load();
            //getCamposOtrosDatos[24].getStore().load();

            clsPanelfieotros.addComponent(new LOG.util.Panel({}));
            clsPanelfieotros.addComponent(new LOG.util.Panel({}));

            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[28])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[29])));
            getCamposOtrosDatos[29].getStore().load();

            clsPanelUltimo.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[21])));
            clsPanelUltimo.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[22])));
            clsPanelfieotros.addComponent(clsPanelUltimo);

            var fielseting = new Ext.form.FieldSet({
                autoHeight: true,
                items: [clsPanelfieotros]
            });
            clsPanelObrasprotectoras.addComponent(fielseting);

            panelDatosG.add(clsPanelObrasprotectoras);

            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getLocalesObrasIng',
                obligatorio: false,
                pEliminar: Array('idlocalesobrasing', 'idlocalesobrasing'),
                urlAux: 'eliminarLocalesObrasIng',
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                modelo: _this.modelo,
                entidad: _this.denominacioncolumnareporte,
                msg: _this.idioma.MsgEliminarPuntoFuego,
                msgDell: _this.idioma.lbDellRegistrarObrasProtc,
            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 490;

            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.lbAddRegistrarObrasProtc,
                handler: function () {
                    _this.onAdicionar('Adicionar locales', gridEquipos, 'cargarnomencladorlocal');
                }
            });

            clsPanelObrasprotectoras.addComponent(gridLocales);
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            panelDatosG.add(clsPanelObrasprotectoras);
        }
        if (panelDatosG.idComponent == 2) {
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridEquipos = new Ext.LOG.moduloMedio.gridSinBooton({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDatosObrasAsoc',
                obligatorio: false,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                obrasAsoc: true,
                modelo: _this.modelo,
                entidad: _this.denominacioncolumnareporte

            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 659;
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            clsPanel.addComponent(gridLocales);
            panelDatosG.add(clsPanel);

        }
        if (panelDatosG.idComponent == 3) {
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var getCamposOtrosDatos = _this.getCamposOtrosDatos();
            var getCampos = _this.getCampos();
            var clsPanelDatosContables = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });

            var clsPanelDatosGridContable = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelDatosContables.getColumn(0).columnWidth = 0.15;
            clsPanelDatosContables.getColumn(1).columnWidth = 0.15;
            clsPanelDatosContables.getColumn(2).columnWidth = 0.15;
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[30])));//codigo
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[1])));//cuenta control
            getCamposOtrosDatos[1].fieldLabel = 'Cuenta control';
            getCamposOtrosDatos[1].name = 'cuenta';
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[2])));//analisis
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCampos[12])));//estado
            getCampos[12].fieldLabel = 'Estado';
            getCampos[12].getStore().load();
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[6])));//feha inicio
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[7])));//fecha fin
            getCamposOtrosDatos[6].fieldLabel = 'Fecha inicio';
            getCamposOtrosDatos[6].name = 'fechainicio';
            getCamposOtrosDatos[7].fieldLabel = 'Fecha fin';
            getCamposOtrosDatos[7].name = 'fechafin';

            getCamposOtrosDatos[7].on({
                'change': function (obj, newValue, oldValue) {
                    getCamposOtrosDatos[6].setMaxValue(newValue);
                }
            });
            getCamposOtrosDatos[6].on({
                'change': function (obj, newValue, oldValue) {
                    getCamposOtrosDatos[7].setMinValue(newValue);
                }
            });

            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDatosContables',
                clave: false,
                obligatorio: false,
                pEliminar: Array('idregnumerico', 'iddatcontableinmcamp'),
                urlAux: 'eliminarDatosContables',
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                ing: true,
                modelo: _this.modelo,
                entidad: _this.denominacioncolumnareporte,
                msg: _this.idioma.MsgEliminarPuntoFuego,
                msgDell: _this.idioma.lbDellRegistrarDatosContables,
            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 559;

            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.lbAddRegistrarDatosContables,
                handler: function () {
                    var record = new Ext.data.Record({
                        fecha: '',
                        clave: '',
                        numero: '',
                        importe: (_this.dataregnumerico.valorcontable) ? _this.dataregnumerico.valorcontable : 0,
                        contabilidad: '',
                        resptecnico: ''
                    });
                    gridEquipos.getStorePrincipal().add(record);
                }
            });

            panelDatosG.add(clsPanelDatosContables);
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridEquipos.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridEquipos);
            clsPanel.addComponent(gridLocales);
            panelDatosG.add(clsPanel);

        }
        _this.modelo.bindFormMedio(panelDatosG, panelDatosG.idComponent);
    },
    /*Construccion de la vista de construccion y compartimento*/
    getRegistroCampSistemaEmp: function (panelDatosG) {
        var _this = this;
        // console.info(_this.scopeSm);
        var getCamposOtrosDatos = _this.getCamposOtrosDatos();
        var getCamposDireccion = _this.getCamposDireccion();
        var getCampos = _this.getCampos();
        if (panelDatosG.idComponent == 0) {
            var clsPanelIdentificacion = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            var clsPanelfieldos = LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '100%'
            });
            var clsPanelgenAux = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelgenAux.addComponent(this.contenedor(this.contenedor(getCampos[17])));
            getCampos[17].fieldLabel = 'Resoluci&oacute;n';
            clsPanelgenAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[31])));
            clsPanelgenAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[32])));
            clsPanelgenAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[35])));
            getCamposOtrosDatos[35].disabled = true;
            if (_this.scopeSm.data.espadre) {
                getCamposOtrosDatos[32].disabled = true;
            } else {
                getCamposOtrosDatos[32].disabled = false;
            }
            clsPanelfieldos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosGenerales,
                items: [clsPanelgenAux]
            }));
            clsPanelIdentificacion.addComponent(clsPanelfieldos);

            var clsPanelfieluno = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var clsPanelFilsCordenadas = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelcorrAux = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });

            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposDireccion[14])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposDireccion[15])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[15])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[16])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[17])));
            clsPanelFilsCordenadas.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbCoordenadas,
                items: [clsPanelcorrAux]
            }));
            clsPanelfieluno.addComponent(clsPanelFilsCordenadas);
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposDireccion[16])));
            getCamposDireccion[16].height = 63;
            getCamposDireccion[14].getStore().reload();
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                items: [clsPanelfieluno]
            }));
            clsPanelfieluno.getColumn(0).columnWidth = 0.20;
            clsPanelfieluno.getColumn(1).columnWidth = 0.19;

            var clsPanelfieltres = LOG.util.UIManager.initColumnForm({
                columnas: 1,
                defaultsAnchor: '100%'
            });
            var clsPanelinvAux = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            clsPanelinvAux.addComponent(this.contenedor(this.contenedor(getCampos[16])));
            Ext.apply(getCampos[6], {
                maxLength: '11',
                minLength: '11'
            });
            clsPanelinvAux.addComponent(this.contenedor(this.contenedor(getCampos[6])));
            clsPanelfieltres.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbDatosInventario,
                items: [clsPanelinvAux]
            }));
            clsPanelIdentificacion.addComponent(clsPanelfieltres);

            panelDatosG.add(clsPanelIdentificacion);
        }
        if (panelDatosG.idComponent == 1) {
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridObjsObras = new Ext.LOG.moduloMedio.gridSinBooton({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getObjetosObraCamp',
                idarea: _this.idarea,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                panel: panelDatosG,
                objObra: _this.objObra,
                obligatorio: false
            });
            gridObjsObras.init();
            var vistaObjs = gridObjsObras.view();
            vistaObjs.height = 659;
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridObjsObras.getStorePrincipal();
            _this.listaStores.add(obj);
            _this.validacionGrids(gridObjsObras);
            clsPanel.addComponent(vistaObjs);
            panelDatosG.add(clsPanel);
        }
        if (panelDatosG.idComponent == 2) {
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridDestinos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getCaracTecnicasEstado',
                urlAux: 'eliminarCaracTec',
                entidad: _this.denominacioncolumnareporte,
                modelo: _this.modelo,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                tab: panelDatosG.idComponent,
                obligatorio: true,
                pEliminar: Array('idcaracteristicainmcamp', 'idcaracteristicainmcamp'),
                msg: _this.idioma.MsgEliminarConfirmacionCaracTec,
                msgDell: _this.idioma.btnTtElimCaractEstado,
            });
            gridDestinos.init();
            var vistaDestinos = gridDestinos.view();
            vistaDestinos.height = 659;
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridDestinos.getStorePrincipal()
            _this.listaStores.add(obj);
            _this.validacionGrids(gridDestinos);
            Ext.apply(gridDestinos.listaBotones.getItem(0), {
                tooltip: _this.idioma.btnTtAdicCaractEstado,
                handler: function () {
                    _this.onAdicionar(_this.idioma.lbTitleAdicionarTipoMaterial, gridDestinos, 'cargarnomencladorTipoMaterial', false, panelDatosG.idComponent);
                }
            });
            clsPanel.addComponent(vistaDestinos);
            panelDatosG.add(clsPanel);
        }
        if (panelDatosG.idComponent == 3) {
            var clsPanel = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridDestinos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDestinoLocales',
                urlAux: 'eliminarDestinoLocal',
                entidad: _this.denominacioncolumnareporte,
                modelo: _this.modelo,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                tab: panelDatosG.idComponent,
                obligatorio: true,
                pEliminar: Array('iddestinolocalinmcomp', 'iddestinolocalinmcomp'),
                msg: _this.idioma.MsgEliminadoDestinoLocales,
                msgDell: _this.idioma.lbTtBtnEliminarLocales
            });
            gridDestinos.init();
            var vistaDestinos = gridDestinos.view();
            vistaDestinos.height = 659;
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridDestinos.getStorePrincipal()
            _this.listaStores.add(obj);
            _this.validacionGrids(gridDestinos);
            Ext.apply(gridDestinos.listaBotones.getItem(0), {
                tooltip: _this.idioma.lbTitleAdicionarLocales,
                handler: function () {
                    _this.onAdicionar('Adicionar locales', gridDestinos, 'cargarnomencladorlocal', false, panelDatosG.idComponent);
                }
            });
            clsPanel.addComponent(vistaDestinos);
            panelDatosG.add(clsPanel);
        }
        if (panelDatosG.idComponent == 4) {
            var getCamposOtrosDatos = _this.getCamposOtrosDatos();
            var clsPanelfieluno = LOG.util.UIManager.initColumnForm({
                columnas: 5
            });
            var clsPanelfieldos = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[30])));
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[1])));
            getCamposOtrosDatos[1].name = 'cuenta';
            clsPanelfieluno.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[2])));
            panelDatosG.add(clsPanelfieluno);

            var gridDocumentos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDatosContables',
                urlAux: 'eliminarDatosContables',
                entidad: _this.denominacioncolumnareporte,
                modelo: _this.modelo,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                tab: panelDatosG.idComponent,
                obligatorio: true,
                pEliminar: Array('iddatcontableinmcamp', 'iddatcontableinmcamp'),
                msg: _this.idioma.MsgEliminadoDocumentosContables,
                msgDell: _this.idioma.lbDellRegistrarDatosContables,
            });
            gridDocumentos.init();
            var vistaDocumentos = gridDocumentos.view();
            vistaDocumentos.height = 600;
            clsPanelfieldos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextDoccontables,
                items: [vistaDocumentos]
            }));
            clsPanelfieldos.getColumn(0).anchor = '100%';
            var obj = {}
            obj['tab'] = panelDatosG.idComponent;
            obj['store'] = gridDocumentos.getStorePrincipal()
            _this.listaStores.add(obj);
            _this.validacionGrids(gridDocumentos);
            Ext.apply(gridDocumentos.listaBotones.getItem(0), {
                tooltip: _this.idioma.lbAddRegistrarDatosContables,
                handler: function () {
                    var record = new Ext.data.Record({
                        fecha: '',
                        clave: '',
                        numero: '',
                        importe: (_this.dataregnumerico.data.valorcontable) ? _this.dataregnumerico.data.valorcontable : 0,
                        aracontabilidad: '',
                        denomrespareacontable: null
                    });
                    gridDocumentos.getStorePrincipal().add(record);
                }
            });

            /* Ext.apply(gridDocumentos.listaBotones.getItem(1), {
             disabled: true,
             tooltip: _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
             handler: function() {
             _this.eliminarDatosContables(gridDocumentos);
             }
             });*/
            panelDatosG.add(clsPanelfieldos);
        }

        _this.modelo.bindFormMedio(panelDatosG, panelDatosG.idComponent);
    },
    /*Construccion de los campos de las vistas*/
    contenedor: function (campo) {
        var contenedor = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        contenedor.addComponent(campo);
        return contenedor;
    },
    eliminarDatosContables: function (gridEquipos) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgElimCaracTecnicas, function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                var arraybd = new Array();
                var arrayvista = new Array();
                var seleccionados = gridEquipos.smGridPrincipal.selections;
                for (var i = 0; i < seleccionados.items.length; i++) {
                    if (seleccionados.items[i].data.estadobd == 'guardado')
                        arraybd.push(seleccionados.items[i].data.iddatcontableinmcamp);
                    else {
                        arrayvista.push(seleccionados.items[i]);
                    }
                }

                if (arraybd.length == 0) {
                    for (var i = 0; i < arrayvista.length; i++) {
                        gridEquipos.getStorePrincipal().remove(arrayvista[i]);
                        gridEquipos.getStorePrincipal().commitChanges();
                    }
                }
                else {
                    Ext.Ajax.request({
                        url: 'eliminarDatosContables',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(arraybd),
                            idregnumericoactivo: _this.idregnumerico
                        },
                        callback: function (options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.msg == 1) {
                                mostrarMensaje(1, _this.idioma.MsgEliminadoDocumentosContables);
                                gridEquipos.getStorePrincipal().load({
                                    callback: function () {
                                        for (var i = 0; i < arrayvista.length; i++) {
                                            gridEquipos.getStorePrincipal().remove(arrayvista[i]);
                                            gridEquipos.getStorePrincipal().commitChanges();
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    getCampos: function () {
        var _this = this;
        var comboRegimen = new LOG.util.ComboBox({
            url: 'getCargarRegimen',
            name: 'idregimen',
            autoLoad: false,
            hiddenName: 'idregimen',
            valueField: 'idregimen',
            disabled: true,
            displayField: 'denominacion',
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            anchor: '80%',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbRegimen,
            editable: false
        });//1

        comboRegimen.getStore().on({
            'beforeload': function (st) {
                // st.baseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
            },
            'load': function (st, records) {
                var cant = st.data.items.length;
                comboRegimen.setRawValue((cant == 1) ? st.data.items[0].data.denominacion : _this.idioma.lbSeleccione);
                if (records.length > 0) {
                    comboRegimen.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoRegimen);
                }
            }
        });

        var nroResolucion = new LOG.util.Prototipos.inputTexto({
            name: 'nroresolucion',
            maxLength: '11',
            allowBlank: false,
            anchor: '50%',
            fieldLabel: this.idioma.lbResolucion,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/
        });//2

        var nroExpediente = new LOG.util.Prototipos.inputTexto({
            name: 'nroexpediente',
            maxLength: '11',
            allowBlank: false,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbExpediente,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });//3

        var precioLegal = new LOG.util.Prototipos.inputDecimal({
            name: 'preciolegal',
            maxLength: '14',
            allowBlank: true,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbPreciolegal,
            // maskRe: /^([0-9]+ ?[0-9]*)+$/,
            //regex: /^([0-9]+ ?[0-9]*)+$/
        });//4

        var superficieUtil = new LOG.util.Prototipos.inputDecimal({
            name: 'superficieutil',
            maxLength: '11',
            allowBlank: true,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbSuperficieUtil,
            //maskRe: /^([0-9]+ ?[0-9]*)+$/,
            //regex: /^([0-9]+ ?[0-9]*)+$/
        });//5

        var noInventarioViv = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'nroinventario',
            anchor: '80%',
            maxLength: '16',
            minLength: '16',
            allowBlank: true,
            valido: true,
            fieldLabel: 'No. inventario',
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//7

        var obsercaviones = new Ext.form.TextArea({
            autoCreate: true,
            name: 'observaciones',
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            fieldLabel: _this.idioma.lbObservaciones,
            enableKeyEvents: true,
            valido: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//8

        var stTipoAsentamiento = new Ext.data.SimpleStore({
            fields: ['idasentamiento', 'denominacion'],
            data: [
                [21, 'La Habana'],
                [22, 'Santiago de Cuba'],
                [23, 'De m\xe0s capitales provinciales'],
                [24, 'Otras ciudades'],
                [25, 'De m\xe0s asentamientos urbanos'],
                [26, 'Asentamientos rurales']
            ]

        });

        var comboTipoAsentamiento = new LOG.util.ComboBox({
            hiddenName: 'idasentamiento',
            valueField: 'idasentamiento',
            name: 'idasentamiento',
            displayField: 'denominacion',
            store: stTipoAsentamiento,
            mode: 'local',
            autoCreate: true,
            allowBlank: false,
            triggerAction: 'all',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbTipoAsentamiento,
            editable: false
        });//9

        var stVarianteUbicacion = new Ext.data.SimpleStore({
            fields: ['varianteubicacion', 'denominacion'],
            data: [
                [1, '1'],
                [2, '2'],
                [3, '3'],
                [4, '4'],
                [5, '5'],
                [6, '6'],
                [7, '7'],
                [8, '8'],
                [9, '9'],
                [10, '10']

            ]

        });

        var comboVarianteUbicacion = new LOG.util.ComboBox({
            hiddenName: 'varianteubicacion',
            valueField: 'varianteubicacion',
            name: 'varianteubicacion',
            anchor: '80%',
            displayField: 'denominacion',
            store: stVarianteUbicacion,
            mode: 'local',
            autoCreate: true,
            allowBlank: false,
            triggerAction: 'all',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbVarianteUbicacion,
            editable: false
        });//10

        var storetipo = new Ext.data.SimpleStore({
            fields: ['idtipoconstruccion', 'denominacion'],
            data: [
                [11, 'Aislada'],
                [12, 'Individual'],
                [13, 'Biplanta'],
                [14, 'Edificio multifamiliar']
            ]

        });

        var combomaterialconstruccion = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Tipo',
            allowBlank: true,
            name: 'tipoconstruccion',
            valueField: 'idtipoconstruccion',
            displayField: 'denominacion',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            store: storetipo,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local'
        });//11

        var combosistemaconstrucctivo = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            autoLoad: false,
            fieldLabel: 'Sistema constructivo',
            allowBlank: true,
            name: 'idsistemaconstructivo',
            valueField: 'idsistemaconstructivo',
            displayField: 'denominacion',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            url: 'getSistemaConstrutivo',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local'
        });//12

        combosistemaconstrucctivo.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    combosistemaconstrucctivo.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoSistemaConstr);
                }
            }
        });

        this.comboEstatusTecnico = new LOG.util.ComboBox({
            disabled: false,
            fieldLabel: _this.idioma.lbHeaderEstado,
            allowBlank: true,
            name: 'idestatustecnico',
            valueField: 'idestatustecnico',
            displayField: 'denominacion',
            resizable: true,
            url: 'gestEstatusTecnico',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local'
        });//13

        _this.comboEstatusTecnico.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                _this.comboEstatusTecnico.enable();
                if (records.length > 0) {
                    _this.comboEstatusTecnico.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoestatus);
                }
            }
        });

        var combotechode = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Techos de',
            allowBlank: true,
            name: 'idtechode',
            valueField: 'idmaterialesconstruccion',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getGestionarTechosParedes',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local'
        });//14

        combotechode.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                st.baseParams.idtechosParedes = -1;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    combotechode.enable();
                } else {
                    //mostrarMensaje(1, _this.idioma.lbNoTechos);
                }
            }
        });

        var comboparedes = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Paredes de',
            allowBlank: true,
            name: 'idparedesde',
            valueField: 'idmaterialesconstruccion',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getGestionarTechosParedes',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local'
        });//15

        comboparedes.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                st.baseParams.idtechosParedes = -2;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboparedes.enable();
                } else {
                    //  mostrarMensaje(1, _this.idioma.lbNoParedes);
                }
            }
        });

        var combotipologia = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Tipolog&iacute;a',
            allowBlank: true,
            name: 'idtipologia',
            valueField: 'idtipologia',
            displayField: 'denominacion',
            listWidth: 300,
            minChars: 0,
            resizable: true,
            url: 'gesTipologia',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local'
        });//16

        combotipologia.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    combotipologia.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoTipologia);
                }
            }
        });

        var responsableInventario = new LOG.util.ComboBox({//LOG.util.ComboBox            
            autoCreate: true,
            anchor: '80%',
            name: 'responsable',
            hiddenName: 'responsable',
            allowBlank: true,
            fieldLabel: _this.idioma.lbResponsableInventario,
            enableKeyEvents: true,
        }); //17

        responsableInventario.on('focus', function () {
            if (!Responsable) {

                var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                    seguridad: 0,
                    region: 'center',
                    listeners: {
                        'personaselecionada': function () {
                            Responsable.listaBotones.getItem(2).enable();
                        },
                        'personadeselecionada': function () {
                            Responsable.listaBotones.getItem(2).disable();
                        }
                    },
                    limit: 15,
                    start: 0
                });

                var Responsable = new Ext.LOG.moduloMedio.winResponsable({
                    title: 'Personas',
                    layout: 'fit',
                });
                LOG.util.UIManager.apply(Responsable.listaBotones.getItem(2), {
                    disabled: true,
                    handler: function () {
                        if (panelBusPer.getSeleccion()) {
                            responsableInventario.setValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                            responsableInventario.setRawValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                            responsableInventario.fireEvent('blur', responsableInventario);
                            Responsable.destroy();
                        }
                    }
                });

                Responsable.add(panelBusPer);
                Responsable.show();

            }
            else {
                Responsable.show();
            }
        });
        var resolucion = new LOG.util.Prototipos.inputTexto({
            name: 'resolucion',
            maxLength: '11',
            allowBlank: false,
            anchor: '50%',
            fieldLabel: _this.idioma.lbResolucion,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/
        });//18

        var anno = new LOG.util.Prototipos.inputEntero({
            name: 'anno',
            maxLength: '4',
            allowBlank: true,
            anchor: '50%',
            fieldLabel: _this.idioma.lbAnno
        });//19

        var consecutivo = new LOG.util.Prototipos.inputEntero({
            name: 'consecutivo',
            maxLength: '19',
            allowBlank: false,
            anchor: '50%',
            fieldLabel: _this.idioma.lbConsecutivo
        });//20

        var ilegal = new LOG.util.Prototipos.inputTexto({
            name: 'ilegal',
            maxLength: '20',
            allowBlank: true,
            anchor: '50%',
            fieldLabel: _this.idioma.lbIlegal,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/
        });//21

        var stFormaPago = new Ext.data.SimpleStore({
            fields: ['idformapago', 'denominacion'],
            data: [
                [1, 'Chequera'],
                [2, 'N&oacute;mina']
            ]

        });

        var formaPago = new LOG.util.ComboBox({
            hiddenName: 'idformapago',
            valueField: 'idformapago',
            name: 'idformapago',
            displayField: 'denominacion',
            store: stFormaPago,
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: _this.idioma.lbFormaPago,
            editable: false
        });//22


        var mando = new LOG.util.Prototipos.inputEntero({
            name: 'mando',
            maxLength: '19',
            allowBlank: true,
            anchor: '50%',
            fieldLabel: _this.idioma.lbmando
        });//23

        var precioarrenda = new LOG.util.Prototipos.inputDecimal({
            name: 'precioarrendamiento',
            maxLength: '14',
            allowBlank: true,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: _this.idioma.lbPrecioArrenda
        });//24


        return [
            comboRegimen, nroResolucion, nroExpediente, precioLegal, superficieUtil, 0,
            noInventarioViv, obsercaviones, comboTipoAsentamiento, comboVarianteUbicacion, combomaterialconstruccion, combosistemaconstrucctivo,
            _this.comboEstatusTecnico, combotechode, comboparedes, combotipologia, responsableInventario, resolucion, anno, consecutivo, ilegal, formaPago,
            mando, precioarrenda
        ];
    },
    getCamposDireccion: function () {
        var _this = this;
        var textfieldCalleAvenida = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'calleavenida',
            anchor: '80%',
            maxLength: '255',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: _this.idioma.lbCalleAvenida,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//1

        var textfieldNro = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            name: 'numero',
            anchor: '80%',
            maxLength: '9',
            allowBlank: true,
            fieldLabel: 'Nro',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });//2

        var textfieldPiso = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            name: 'piso',
            anchor: '80%',
            maxLength: '3',
            allowBlank: true,
            fieldLabel: 'Piso',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });//3

        var textfieldNroApto = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'nroapto',
            anchor: '80%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'Nro. Apto',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//4

        var textfieldEntrecalle = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'entrecalle',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Entrecalle',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }
                }
            }
        });//5

        var textfieldBarrioReparto = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'barrioreparto',
            anchor: '80%',
            maxLength: '255',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'Barrio o reparto',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//6

        var textfieldManzana = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'manzana',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Manzana',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//7

        var textfieldDistrito = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'distrito',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Distrito',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//8

        var textfieldCarretera = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'carretera',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Carretera',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//9

        var textfieldCamino = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'camino',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            valido: true,
            allowBlank: true,
            fieldLabel: 'Camino',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//10

        var textfieldKm = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            name: 'kilometro',
            anchor: '80%',
            maxLength: '255',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: true,
            fieldLabel: 'Km',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });//11

        var textfieldFinca = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'finca',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Finca',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//12

        var textfieldLocalidad = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'localidad',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            valido: true,
            allowBlank: true,
            fieldLabel: 'Localidad',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//13

        var combomunicipios = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: true,
            fieldLabel: _this.idioma.lbMunicipio,
            allowBlank: true,
            name: 'idmunicipio',
            valueField: 'iddpt',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getCargarProvincias',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local',
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.buttons[2].handler();
                    }
                }
            }
        });//15

        var comboprovincia = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbProvincia,
            allowBlank: true,
            name: 'idprovincia',
            valueField: 'iddpt',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getCargarProvincias',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: 'Seleccione....',
            mode: 'local',
            disabled: false,
            editable: false,
            listeners: {
                'select': function (combo, record, index) {
                    combomunicipios.reset();
                    combomunicipios.disable();
                    combomunicipios.getStore().load({
                        params: {
                            accion: "municipio",
                            idpadre: record.data.iddpt
                        },
                        callback: function (options, success, response) {
                            combomunicipios.enable();
                        }
                    })
                }
            }
        });//14
        comboprovincia.getStore().load();

        var direccion = new Ext.form.TextArea({
            autoCreate: true,
            name: 'direccion',
            maxLength: '255',
            height: 50,
            allowBlank: false,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            fieldLabel: _this.idioma.lbDireccion,
            enableKeyEvents: true,
            valido: true,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//16
        var edificio = new LOG.util.Prototipos.inputTexto({
            name: 'edificio',
            maxLength: '255',
            allowBlank: true,
            anchor: '50%',
            fieldLabel: _this.idioma.lbEdificio,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/
        });//25
        return [
            textfieldCalleAvenida,
            textfieldNro,
            textfieldPiso,
            edificio,
            textfieldNroApto,
            textfieldEntrecalle,
            textfieldBarrioReparto,
            textfieldManzana,
            textfieldDistrito,
            textfieldCarretera,
            textfieldCamino,
            textfieldKm,
            textfieldFinca,
            textfieldLocalidad,
            comboprovincia,
            combomunicipios,
            direccion
        ];
    },
    getCamposOtrosDatos: function () {
        var _this = this;
        var codigoCuentacontable = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            name: 'codigocuentacontrato',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            valido: true,
            fieldLabel: 'C&oacute;digo de la cuenta control',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    if (field.getValue()) {
                        field.valido = true;
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });//1

        var nombreCuentacontable = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            name: 'nombrecuentacontable',
            maxLength: '30',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            valido: true,
            fieldLabel: 'Nombre de la cuenta control',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//2

        var analisis = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'analisis',
            anchor: '95%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            fieldLabel: 'An&aacute;lisis',
            enableKeyEvents: true,
            valido: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//3

        var nombreApellidoArrendatario = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '80%',
            name: 'nombreyapellido',
            maxLength: '60',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            valido: true,
            fieldLabel: 'Nombres y apellidos',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//4

        var nroCI = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            anchor: '80%',
            maxLength: '11',
            name: 'nroidentidad',
            minLength: '11',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false,
            fieldLabel: 'Nro. de identidad',
            enableKeyEvents: true
        });//5

        var nroContrato = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            anchor: '80%',
            name: 'nrocontrato',
            maxLength: '19',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false,
            fieldLabel: 'Nro.Contrato',
            enableKeyEvents: true
        });//6

        var fechavencimiento = new Ext.form.DateField({
            fieldLabel: 'Fecha vencimiento',
            editable: false,
            format: 'd/m/Y',
            name: 'fechanacicmiento',
            emptyText: _this.idioma.lbCbVacio
        });//7

        var fechacontable = new Ext.form.DateField({
            fieldLabel: 'Fecha contrato',
            editable: false,
            format: 'd/m/Y',
            name: 'fechacontrato',
            emptyText: _this.idioma.lbCbVacio
        });//8

        var comboocupacion = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Ocupaci&oacute;n de la vivienda',
            allowBlank: false,
            name: 'idocupacionviv',
            valueField: 'idocupacionviv',
            displayField: 'denominacion',
            url: 'gestOcupacionViv',
            autoLoad: false,
            listWidth: 300,
            minChars: 0,
            resizable: true,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local'
        });//9

        comboocupacion.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboocupacion.enable();
                }
                Ext.getBody().unmask();
            }
        });

        var vinculacionlaboral = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Vinculaci&oacute;n laboral con el organismo',
            allowBlank: false,
            name: 'idvinculacionlaboral',
            valueField: 'idvinculacionlaboral',
            displayField: 'denominacion',
            listWidth: 300,
            url: 'gestVinculacionLaboral',
            autoLoad: false,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local',
        });//10

        vinculacionlaboral.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    vinculacionlaboral.enable();
                }
                Ext.getBody().unmask();
            }
        });

        var combotipoobra = new LOG.util.ComboBox({
            // anchor: '100%',
            fieldLabel: 'Tipo de obra',
            allowBlank: true,
            name: 'idtipoobra',
            valueField: 'idtipoobra',
            displayField: 'denominacion',
            resizable: true,
            autoLoad: false,
            url: 'getCargarTipoObra',
            //  forceSelection: true,
            typeAhead: true,
            // emptyText: _this.idioma.lbSeleccione,
            mode: 'local',
            disabled: true,
            editable: false
        });//11

        combotipoobra.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                combotipoobra.enable();
                if (records.length > 0) {
                    // _this.combotipoobra.setValue(st.data.items[0].data.idtipoobra);
                }
                Ext.getBody().unmask();
            }
        });
        var inventario = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'inventario',
            anchor: '80%',
            maxLength: '12',
            minLength: '12',
            allowBlank: true,
            valido: true,
            fieldLabel: 'No. inventario',
            enableKeyEvents: true,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            listeners: {
                'specialkey': function (cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//12

        var zonaDefensa = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'zonadefensa',
            anchor: '80%',
            maxLength: '19',
            /*regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
             maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,*/
            allowBlank: true,
            valido: true,
            fieldLabel: 'Zona de defensa',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }
                            }
                        }
                    }

                }
            }
        });//13

        var comboSelladaPor = new LOG.util.ComboBox({
            fieldLabel: 'Sellada por',
            allowBlank: true,
            name: 'idestadooperativo',
            valueField: 'idselladapor',
            displayField: 'denominacion',
            resizable: true,
            url: 'gestSelladaPor',
            autoLoad: false,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            disabled: true,
        });//14
        comboSelladaPor.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                // st.baseParams.idpadre = (_this.comboEstatusTecnico.getValue()) ? _this.comboEstatusTecnico.getValue() : null;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboSelladaPor.enable();
                }
            }
        });

        var stPertenecea = new Ext.data.SimpleStore({
            fields: ['idpertenecea', 'denominacion'],
            data: [
                [1, 'Tropas regulares'],
                [2, 'Milicias de tropas territoriales']
            ]

        });
        var comboPertenecea = new LOG.util.ComboBox({
            hiddenName: 'pertenece',
            valueField: 'idpertenecea',
            name: 'pertenece',
            anchor: '80%',
            displayField: 'denominacion',
            store: stPertenecea,
            mode: 'local',
            autoCreate: true,
            allowBlank: true,
            triggerAction: 'all',
            typeAhead: true,
            resizable: true,
            emptyText: _this.idioma.lbSeleccione,
            fieldLabel: 'Pertenece a',
            editable: false
        });//15

        var ejeX = new LOG.util.Prototipos.inputDecimal({//Ext.form.NumberField
            maxLength: '6',
            name: 'x',
            anchor: '98%',
            allowBlank: true,
            fieldLabel: 'X',
            //regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/, //
            enableKeyEvents: true
        });//16

        var ejeY = new LOG.util.Prototipos.inputDecimal({
            maxLength: '6',
            name: 'y',
            anchor: '98%',
            allowBlank: true,
            fieldLabel: 'Y',
            //regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/,
            enableKeyEvents: true
        });//17

        var ejeZ = new LOG.util.Prototipos.inputDecimal({
            maxLength: '6',
            anchor: '98%',
            name: 'z',
            allowBlank: true,
            fieldLabel: 'Z',
            //regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/, ///^[0-9]+(\.[0-9][0-9]?)?$/,
            enableKeyEvents: true
        });//18

        var enlaMontaña = new Ext.form.Checkbox({
            boxLabel: 'En la montaña',
            name: 'montana',
            hideLabel: false,
            inputValue: 1

        });//19

        var comboDesignacion = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbDesignacion,
            allowBlank: true,
            name: 'iddesignacion',
            valueField: 'iddesignacion',
            displayField: 'denominacion',
            minChars: 0,
            resizable: true,
            url: 'getNomDesignacion',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbSeleccione,
            mode: 'local',
            autoLoad: false,
            disabled: false,
            editable: false
        });//20
        comboDesignacion.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                var cant = st.data.items.length;
                if (cant == 1) {
                    // _this.comboDesignacion.setValue(st.data.items[0].data.iddesignacion);
                }
            }
        });

        var comboCaracConstructiva = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbCaracConstructiva,
            allowBlank: true,
            name: 'idcaracteristicaconstructiva',
            valueField: 'idconstructiva',
            displayField: 'denominacion',
            minChars: 0,
            resizable: true,
            url: 'getNomCaractConstructiva',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbSeleccione,
            mode: 'local',
            disabled: false,
            editable: false
        });//21

        comboCaracConstructiva.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboCaracConstructiva.enable();
                }
            }
        });

        var climatizacion = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbClimatizacion,
            name: 'climatizacion',
            hideLabel: false
        });//22

        var capital = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbCapital,
            name: 'capital',
            hideLabel: false
        });//23

        var comboVentilacion = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbVentilacion,
            allowBlank: true,
            name: 'idventilacion',
            valueField: 'idventilacion',
            displayField: 'denominacion',
            minChars: 0,
            resizable: true,
            url: 'getNomVentilacion',
            autoLoad: false,
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbSeleccione,
            mode: 'local',
            disabled: false,
            editable: false
        });//24

        comboVentilacion.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboVentilacion.enable();
                }
            }
        });

        var comboComunicacion = new LOG.util.LovCombo({
            fieldLabel: _this.idioma.lbComunicacion,
            url: 'getNomComunicacion',
            hiddenName: 'idtipocomunicacion',
            name: 'idcomunicacion',
            itemId: 'idcomunicacion',
            valueField: 'idcomunicacion',
            displayField: 'denominacion',
            allowBlank: true,
            editable: false,
            typeAhead: false,
            anchor: '98%',
            mode: 'local',
            emptyText: _this.idioma.lbSeleccione,
            autoLoad: false

        });//25

        comboComunicacion.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                // comboComunicacion.setValue("1000000,1000001,1000002");
                if (records.length > 0) {
                    comboComunicacion.enable();
                }
            }
        });

        var entradasHorizontal = new LOG.util.Prototipos.inputTexto({
            anchor: '60%',
            maxLength: '12',
            name: 'horizontal',
            allowBlank: true,
            fieldLabel: _this.idioma.lbHorizontal,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });//26

        var entradasVertical = new LOG.util.Prototipos.inputTexto({
            //autoCreate: true,
            anchor: '60%',
            maxLength: '12',
            name: 'vertical',
            allowBlank: true,
            fieldLabel: _this.idioma.lbVertical,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });//27

        var entradasPuertas = new LOG.util.Prototipos.inputTexto({
            // autoCreate: true,
            anchor: '60%',
            maxLength: '12',
            name: 'puerta',
            allowBlank: true,
            fieldLabel: _this.idioma.lbPuertas,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });//28

        var transFormador = new LOG.util.Prototipos.inputTexto({
            anchor: '80%',
            name: 'transformador',
            maxLength: '255',
            allowBlank: true,
            fieldLabel: _this.idioma.lbTransformador,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/
        });//29

        var comboSistemaElectrico = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbSistEnergetico,
            allowBlank: true,
            name: 'idsistemaenergetico',
            valueField: 'idenergetico',
            displayField: 'denominacion',
            minChars: 0,
            resizable: true,
            url: 'getNomSistElectrico',
            autoLoad: false,
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: _this.idioma.lbSeleccione,
            mode: 'local',
            disabled: false,
            editable: false
        });//30
        comboSistemaElectrico.getStore().on({
            'beforeload': function (st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st, records) {
                if (records.length > 0) {
                    comboSistemaElectrico.enable();
                }
            }
        });

        var codigo1 = new LOG.util.Prototipos.inputTexto({
            anchor: '95%',
            name: 'codigo',
            maxLength: '19',
            fieldLabel: 'C&oacute;digo',
            autoCreate: true,
            allowBlank: false,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true
        });//31

        var fechaexplotacion = new Ext.form.DateField({
            fieldLabel: 'Fecha explotaci\xf2n',
            editable: false,
            format: 'd/m/Y',
            allowBlank: false,
            name: 'fechaexplotacion',
            listeners: {
                'select': function (field, date) {
                    var fecha = fechaexplotacion.getValue();
                    var año = fecha.getFullYear();
                    var dia = fecha.getDate();
                    if (dia < 10) {
                        dia = '0' + dia;
                    }
                    var mes = fecha.getMonth() + 1;
                    if (mes < 10) {
                        mes = '0' + mes;
                    }
                    año = año + parseInt(_this.dataregnumerico.data.vidautil);
                    vidautil.setValue(dia + '/' + mes + '/' + año);
                    vidautil.fireEvent('blur', vidautil);
                }
            }
        });//32

        var areaTotalFabricacion = new LOG.util.Prototipos.inputDecimal({
            autoCreate: true,
            anchor: '80%',
            name: 'area',
            maxLength: '19',
          /*  maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,*/
            allowBlank: false,
            fieldLabel: '\xc0rea total de fabricaci\xf3n',
            enableKeyEvents: true
        });//33

        var vidautil = new LOG.util.Prototipos.inputTexto({
            anchor: '95%',
            name: 'terminovidautil',
            maxLength: '19',
            fieldLabel: 'Vida util',
            allowBlank: false,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true
        });//34

        var cuenta = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            name: 'cuenta',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            valido: true,
            fieldLabel: 'Cuenta control',
            enableKeyEvents: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue()) {
                        if (field.getValue().charAt(0) == ' ') {
                            field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                            field.valido = false;
                        } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                            field.valido = false;
                        } else {
                            for (var i = 0; i < field.getValue().length - 1; i++) {
                                var char = field.getValue().charAt(i);
                                if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                    var char1 = field.getValue().charAt(i + 1);
                                    if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                                        field.valido = false;
                                    }
                                }

                            }
                        }
                    }

                }
            }
        });//35

        return [codigoCuentacontable, nombreCuentacontable, analisis, nombreApellidoArrendatario, nroCI, nroContrato,
            fechavencimiento, fechacontable, comboocupacion, vinculacionlaboral, combotipoobra, inventario,
            zonaDefensa, comboSelladaPor, comboPertenecea, ejeX, ejeY, ejeZ, enlaMontaña, comboDesignacion,
            comboCaracConstructiva, climatizacion, capital, comboVentilacion, comboComunicacion,
            entradasHorizontal, entradasVertical, entradasPuertas, transFormador, comboSistemaElectrico, codigo1,
            fechaexplotacion, areaTotalFabricacion, fechaexplotacion, areaTotalFabricacion, vidautil, cuenta

        ];
    },
    /*Funciones de los botones de la ventana*/
    onAdicionar: function (title, gridEquipos, urlAux, clave, idComponent) {
        var _this = this;
        var arrRNnomostrar = Array();

        if (gridEquipos) {
            if (gridEquipos.getStorePrincipal().data.items.length > 0) {
                for (var i = 0; i < gridEquipos.getStorePrincipal().data.items.length; i++) {
                    if (gridEquipos.getStorePrincipal().data.items[i].data.idregnumactivo) {
                        arrRNnomostrar.push(gridEquipos.getStorePrincipal().data.items[i].data.idregnumactivo);
                    } else if (gridEquipos.getStorePrincipal().data.items[i].data.idtipocontruccion) {
                        arrRNnomostrar.push(gridEquipos.getStorePrincipal().data.items[i].data.idtipocontruccion);
                    }
                    else if (gridEquipos.getStorePrincipal().data.items[i].data.idlocal) {
                        arrRNnomostrar.push(gridEquipos.getStorePrincipal().data.items[i].data.idlocal);
                    }
                }
            }
        } else {
            if (gridEquipos.getStorePrincipal().data.items.length > 0) {
                for (var i = 0; i < gridEquipos.getStorePrincipal().data.items.length; i++) {
                    arrRNnomostrar.push(_this.gridEquiposgetStorePrincipal().data.items[i].data.idregnumactivo)
                }
            }
        }
        var winregnum = new Ext.LOG.moduloMedio.winGetRegNumericosService({
            singleSelect: false,
            arrRNnomostrar: arrRNnomostrar,
            idioma: _this.idioma,
            title: (title) ? title : false,
            idestructura: _this.idarea,
            datConfExp: gridEquipos,
            clave: clave,
            idComponent: idComponent,
            urlAux: (urlAux) ? urlAux : false,
            denominacioncolumnareporte: _this.denominacioncolumnareporte,
            doAction: function (records_seleccionadas, aplicar) {
                Ext.getBody().mask("Cargando...", 'x-mask-loading');
                if (records_seleccionadas.length > 0) {
                    var arrayRec = records_seleccionadas;

                    for (var i = 0; i < arrayRec.length; i++) {
                        var record = new Ext.data.Record({
                            descripcion: arrayRec[i].data.denominacion,
                            nroinventario: arrayRec[i].data.nroinventario,
                            idregnumactivo: arrayRec[i].data.idregnumerico

                        });
                        gridEquipos.storePrincipal.add(record);
                    }
                    Ext.getBody().unmask();
                    if (!aplicar) {
                        winregnum.vistaPrincipal.close();
                    }

                }

            },
            cargarEnviadosATaller: false
        });

        winregnum.init();
        winregnum.view();
    },
    eliminarLocalesObrasIng: function (gridEquipos) {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgElimCaracTecnicas, function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {
                var arraybd = new Array();
                var arrayvista = new Array();

                var seleccionados = gridEquipos.smGridPrincipal.selections;
                for (var i = 0; i < seleccionados.items.length; i++) {
                    if (seleccionados.items[i].data.idlocalesobrasing)
                        arraybd.push(seleccionados.items[i].data.idlocalesobrasing);
                    else {
                        arrayvista.push(seleccionados.items[i]);
                    }
                }

                if (arraybd.length == 0) {
                    for (var i = 0; i < arrayvista.length; i++) {
                        gridEquipos.getStorePrincipal().remove(arrayvista[i]);
                        gridEquipos.getStorePrincipal().commitChanges();
                    }
                }

                if (arraybd.length >= 1) {
                    Ext.Ajax.request({
                        url: 'eliminarLocalesObrasIng',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(arraybd),
                            idregnumericoactivo: _this.dataregnumerico.data.idregnumerico
                        },
                        callback: function (options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.msg == 1) {

                                mostrarMensaje(1, _this.idioma.MsgEliminadoDestinoLocales);
                                gridEquipos.getStorePrincipal().load({
                                    callback: function () {
                                        for (var i = 0; i < arrayvista.length; i++) {
                                            gridEquipos.getStorePrincipal().remove(arrayvista[i]);
                                            gridEquipos.getStorePrincipal().commitChanges();
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    /*Validacion de grids*/
    validacionGrids: function (grid) {
        var _this = this;
        _this.array.push(grid);
        grid.on({
            'validarGrids': function (mod) {
                var valido = false;
                Ext.each(_this.array, function (a, p) {
                    valido = _this.validarGrid(a, mod)
                    if (valido && !_this.verificarValidos(p)) {
                        _this.validos.push({pos: p, valor: valido})
                    } else if (!valido && _this.verificarValidos(p)) {
                        _this.eliminarValido(p);
                    }
                });
                if (_this.array.length == _this.validos.length)
                    _this.modelo.setGridValidos(true);
                else
                    _this.modelo.setGridValidos(false);
                if (mod)
                    _this.modelo.setDirty(true);
                _this.modelo.habilitarBtns();
            }
        });
    },
    validarGrid: function (a, mod) {
        var valido = false;
        var totalColumnas = a.getGridPrincipal().getColumnModel().getColumnCount();
        var totalFilas = a.getStorePrincipal().getCount();
        if ((a.obligatorio && totalFilas > 0) || (!a.obligatorio && mod && totalFilas > 0)) {
            for (var i = 0; i < totalFilas; i++) {
                for (var j = 0; j < totalColumnas; j++) {
                    if (a.getGridPrincipal().getColumnModel().isCellEditable(j, i)) {
                        var cell = a.getGridPrincipal().getColumnModel().getCellEditor(j, i);
                        var dataIndex = a.getGridPrincipal().getColumnModel().getDataIndex(j);
                        var val = a.getStorePrincipal().getAt(i).data[dataIndex];
                        val = (val == null) ? '' : val;
                        cell.field.setValue(val.toString());
                        valido = cell.field.isValid();
                        if (!valido)
                            break;
                    } else
                        valido = true;
                }
                if (!valido)
                    break;
            }
        } else {
            if (!a.obligatorio)
                valido = true;
        }
        return valido;
    },
    verificarValidos: function (p) {
        var _this = this;
        var existe = false;
        Ext.each(_this.validos, function (a) {
            if (a.pos == p) {
                existe = true;
                return;
            }
        });
        return existe;
    },
    eliminarValido: function (p) {
        var _this = this;
        var aux = {};
        Ext.each(_this.validos, function (a) {
            if (a.pos == p) {
                aux = a;
                return;
            }
        });
        _this.validos.remove(aux);
    },
    cargarDatosTabs: function () {
        var _this = this;
        window.setTimeout(function () {
            Ext.MessageBox.wait(_this.idioma.lbMsgCargandoDatos, _this.idioma.msgEspere);
            _this.modelo.cargarRegistros(function (dat) {
                Ext.each(dat, function (obj, pos) {
                    var record = {};
                    record.data = obj[0];
                    if (record.data && record.data.idmunicipio && record.data.idmunicipio != "") {
                        var aux = _this.modelo.formularios.getItem(pos).items.items[_this.modelo.formularios.getItem(pos).items.items.length - 1];
                        for (var i = 0; i < _this.modelo.formularios.getItem(pos).items.items.length; i++) {
                            if (_this.modelo.formularios.getItem(pos).items.items[i].name == "idmunicipio") {
                                _this.modelo.formularios.getItem(pos).items.items[i].getStore().load({
                                    params: {
                                        accion: "municipio",
                                        idpadre: record.data.idprovincia
                                    }
                                });
                            }
                        }
                    }
                    window.setTimeout(function () {
                        _this.modelo.formularios.getItem(pos).loadRecord(record);
                    }, 100);

                });
                _this.modelo.setOldValues();
                if (_this.dataregnumerico.data.registro) {
                    _this.listaStores.each(function (o) {
                        o.store.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                        o.store.change = true;
                        o.store.load();
                    });
                }
                if (_this.dataregnumerico.data.registro == 'ingenieria' && dat[0].length > 0 && dat[0][0].idestatustecnico) {
                    _this.comboSelladaPor.getStore().load({
                        params: {
                            idpadre: dat[0][0].idestatustecnico
                        },
                        callback: function () {
                            _this.comboSelladaPor.setValue(dat[0][0].idestatusoperativo);
                            Ext.MessageBox.hide();
                        }
                    });
                } else {
                    window.setTimeout(function () {
                        Ext.MessageBox.hide();
                    }, 4000);

                }

            }, _this.objObra);
        }, 800);

    }
});
/**Vistas de grids para las entidades*/
Ext.LOG.moduloMedio.viviendaConstrCompartimento = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.gridEditable = true;
        this.tab = config.tab;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.viviendaEquipos = config.viviendaEquipos;
        this.ing = config.ing;
        this.modelo = config.modelo;
        this.urlAux = config.urlAux;
        this.pEliminar = config.pEliminar;
        this.modoSeleccion = 2;
        this.otrosdatos = config.otrosdatos;
        this.urlBusquedaGridPrincipal = config.url;
        this.datConfExp = config.datConfExp;
        this.msg = config.msg;
        this.denominacioncolumnareporte = config.denominacioncolumnareporte;
        this.obrasAsoc = (config.obrasAsoc) ? config.obrasAsoc : false;
        this.msgDell = config.msgDell;

        Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.constructor.call(this, config);
        this.addEvents('validarGrids');


    },
    initDefaultColumns: function () {
        var _this = this;
        if (_this.denominacioncolumnareporte == "vivienda") {
            this.addGridColumn({
                dataIndex: 'idregnumerico',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idcompartimiento',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idotrasinstalaciones',
                default: true
            });

            this.addGridColumn({
                dataIndex: 'idotrasinstalacionesviv',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idequipomedio',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idregnumactivo',
                default: true
            });

            if (_this.viviendaEquipos) {

                this.addGridColumn({
                    header: 'Descripci&oacute;n',
                    dataIndex: 'descripcion',
                    autoExpand: true,
                    width: 170,
                    default: true,
                });
                this.addGridColumn({
                    header: 'Nro.Inventario',
                    dataIndex: 'nroinventario',
                    autoExpand: true,
                    width: 170,
                    default: true,
                });

            } else {
                this.addGridColumn({
                    header: _this.idioma.lbTextCompartimientos,
                    dataIndex: 'denominacion',
                    autoExpand: true,
                    width: 170,
                    default: true
                });
                var textfieldM2vIV = new LOG.util.Prototipos.inputTexto({
                    autoCreate: true,
                    width: 100,
                    maxLength: '19',
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    enableKeyEvents: true,
                    valido: true,
                    listeners: {
                        'valid': function (field) {
                            field.valido = true;
                            if (field.getValue().charAt(0) == ' ') {
                                field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                                field.valido = false;
                            } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                                field.markInvalid(_this.idioma.lbContenidoErroneo);
                                field.valido = false;
                            } else {
                                for (var i = 0; i < field.getValue().length - 1; i++) {
                                    var char = field.getValue().charAt(i);
                                    if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                        var char1 = field.getValue().charAt(i + 1);
                                        if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                            field.markInvalid(_this.idioma.lbContenidoErroneo);
                                            field.valido = false;
                                        }
                                    }

                                }
                            }
                        }
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderCantidad,
                    dataIndex: 'cantidad',
                    width: 120,
                    default: true,
                    editable: true,
                    editor: textfieldM2vIV
                });
            }
        }

        if (_this.denominacioncolumnareporte == "ingenieria") {
            if (_this.obrasAsoc) {
                this.addGridColumn({
                    dataIndex: 'idregnumerico',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderTipo,
                    dataIndex: 'denominacion',
                    width: 270,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderInventario,
                    dataIndex: 'nroinventario',
                    width: 270,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderCantidad,
                    dataIndex: 'cantidad',
                    width: 270,
                    autoExpand: true,
                    default: true
                });

            }
            else if (_this.ing) {

                var datefieldFecha = new Ext.form.DateField({
                    name: 'fecha',
                    editable: false,
                    format: 'd/m/Y'
                });

                /*var textfieldClave = new LOG.util.Prototipos.inputTexto({
                 anchor: '95%',
                 autoCreate: true,
                 maskRe: /^([0-9]+ ?[0-9]*)+$/,
                 regex: /^([0-9]+ ?[0-9]*)+$/,
                 allowBlank: (!_this.clave) ? true : false
                 });*/

                var textfieldNumero = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    name: 'numero',
                    maskRe: (_this.clave) ? /^([0-9]+ ?[0-9]*)+$/ : /^([a-zA-Z0-9]*)([-_][a-zA-Z0-9]*)?([-_/][a-zA-Z0-9]*)?$/,
                    regex: (_this.clave) ? /^([0-9]+ ?[0-9]*)+$/ : /^([a-zA-Z0-9]*)([-_][a-zA-Z0-9]+)?([-_/][a-zA-Z0-9]+)?$/,
                    allowBlank: false
                });

                var textfieldImporte = new LOG.util.Prototipos.inputDecimal({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    allowBlank: false
                });

                var areacontabilidad = new LOG.util.Prototipos.inputTexto({
                    anchor: '80%',
                    allowBlank: true,
                    readOnly: true,
                    name: 'denomrespareacontable',
                    editable: false,
                    listeners: {
                        'focus': function (e) {
                            if (!responsablecontabilidad) {
                                var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                    seguridad: 0,
                                    region: 'center',
                                    listeners: {
                                        'personaselecionada': function () {
                                            responsablecontabilidad.listaBotones.getItem(2).enable();
                                        },
                                        'personadeselecionada': function () {
                                            responsablecontabilidad.listaBotones.getItem(2).disable();
                                        }
                                    },
                                    limit: 15,
                                    start: 0
                                });

                                var responsablecontabilidad = new Ext.LOG.moduloMedio.winResponsable({
                                    title: 'Personas',
                                    layout: 'fit',
                                });
                                LOG.util.UIManager.apply(responsablecontabilidad.listaBotones.getItem(2), {
                                    disabled: true,
                                    handler: function () {
                                        if (panelBusPer.getSeleccion()) {
                                            areacontabilidad.setValue(panelBusPer.getSeleccion().get('idpersona'));
                                            areacontabilidad.setRawValue((panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') + ' ' + panelBusPer.getSeleccion().get('sapel')));
                                            _this.getGridPrincipal().getSelectionModel().getSelected().set('denomrespareacontable', areacontabilidad.getRawValue());
                                            responsablecontabilidad.destroy();
                                        }
                                    }
                                });

                                responsablecontabilidad.add(panelBusPer);
                                responsablecontabilidad.show();
                            }
                            else {
                                responsablecontabilidad.show();
                            }
                        }
                    }

                });

                var responsableTecnico = new LOG.util.Prototipos.inputTexto({
                    anchor: '80%',
                    allowBlank: true,
                    readOnly: true,
                    name: 'denomresotecnico',
                    editable: false,
                    listeners: {
                        'focus': function (e) {
                            if (!respontecnico) {
                                var panelBusPer2 = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                    seguridad: 0,
                                    region: 'center',
                                    listeners: {
                                        'personaselecionada': function () {
                                            respontecnico.listaBotones.getItem(2).enable();
                                        },
                                        'personadeselecionada': function () {
                                            respontecnico.listaBotones.getItem(2).disable();
                                        }
                                    },
                                    limit: 15,
                                    start: 0
                                });

                                var respontecnico = new Ext.LOG.moduloMedio.winResponsable({
                                    title: 'Personas',
                                    layout: 'fit',
                                });
                                LOG.util.UIManager.apply(respontecnico.listaBotones.getItem(2), {
                                    disabled: true,
                                    handler: function () {
                                        if (panelBusPer2.getSeleccion()) {
                                            responsableTecnico.setValue(panelBusPer2.getSeleccion().get('idpersona'));
                                            responsableTecnico.setRawValue((panelBusPer2.getSeleccion().get('nombre') + ' ' + panelBusPer2.getSeleccion().get('papel') + ' ' + panelBusPer2.getSeleccion().get('sapel')));
                                            _this.getGridPrincipal().getSelectionModel().getSelected().set('denomresotecnico', responsableTecnico.getRawValue());
                                            respontecnico.destroy();
                                        }
                                    }
                                });

                                respontecnico.add(panelBusPer2);
                                respontecnico.show();
                            }
                            else {
                                respontecnico.show();
                            }
                        }
                    }

                });

                this.addGridColumn({
                    dataIndex: 'iddatcontableinmcamp',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idpersonatecnico',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idregnumerico',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderFecha,
                    dataIndex: 'fecha',
                    width: 270,
                    default: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var result = value;
                        if (value != null && typeof value == "object") {
                            result = value.dateFormat('d/m/Y');
                            record.set('fecha', value.dateFormat('d/m/Y'));
                        }
                        return result;
                    },
                    editor: datefieldFecha
                });
                /*this.addGridColumn({
                 header: (!_this.clave) ? _this.idioma.lbHeaderClave : _this.idioma.lbHeaderSubmayor,
                 dataIndex: (!_this.clave) ? 'submayor' : 'clave',
                 width: 170,
                 default: true,
                 editor: textfieldClave,
                 hidden: (!_this.clave) ? true : false
                 });*/
                this.addGridColumn({
                    header: (_this.clave) ? _this.idioma.lbHeaderNo : _this.idioma.lbHeaderDoc,
                    dataIndex: 'numero',
                    width: 170,
                    default: true,
                    editor: textfieldNumero
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderImporte,
                    dataIndex: 'importe',
                    width: 270,
                    default: true,
                    editor: textfieldImporte
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderContabilidad,
                    dataIndex: 'denomrespareacontable',
                    width: 270,
                    default: true,
                    editor: areacontabilidad
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderResponsableTecnico,
                    dataIndex: 'denomresotecnico',
                    width: 270,
                    default: true,
                    editor: responsableTecnico
                });
            }
            else {
                var secciones = Array();
                var textfieldVolumen = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });

                var textfieldTecho = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });

                var textfieldFPK = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/
                });

                var comboeditorSeccion = new LOG.util.ComboBox({
                    hiddenName: 'idseccion',
                    name: 'idseccion',
                    valueField: 'idseccion',
                    displayField: 'denominacion',
                    url: 'getNomSeccion',
                    mode: 'local',
                    autoCreate: true,
                    allowBlank: false,
                    triggerAction: 'all',
                    typeAhead: true,
                    resizable: true,
                    emptyText: _this.idioma.lbSeleccione,
                    editable: false,
                    listeners: {
                        'select': function (cb, record) {
                            var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                            rc.set('idseccion', record.data.idseccion);
                        }
                    }

                });
                comboeditorSeccion.getStore().on({
                    'beforeload': function (st) {
                        st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                    },
                    'load': function (st, records) {
                        st.each(function (o) {
                            secciones.push(o.data);
                        });
                    }
                });

                var textfieldExcavacion = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });

                var textfielRevestida = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });

                var textfieldTerminacion = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });


                this.addGridColumn({
                    dataIndex: 'idlocal',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idlocalesobrasing',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idseccion',
                    default: true
                });

                this.addGridColumn({
                    header: _this.idioma.lbHeaderTipo,
                    dataIndex: 'tipo',
                    autoExpand: false,
                    width: 170,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderVolumen,
                    dataIndex: 'volumen',
                    autoExpand: false,
                    editable: true,
                    editor: new LOG.util.Prototipos.inputTexto({
                        anchor: '95%',
                        autoCreate: true,
                        allowBlank: false,
                        regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                    }),
                    width: 170,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderSeccion,
                    dataIndex: 'idseccion',
                    editable: true,
                    autoExpand: false,
                    editor: comboeditorSeccion,
                    width: 170,
                    default: true,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var denominacion = value;
                        if (record.json && record.json.idseccion == value) {
                            denominacion = record.json.seccion;
                        } else {
                            Ext.each(secciones, function (r) {
                                if (value == r.idseccion) {
                                    denominacion = r.denominacion;
                                }
                            });
                        }
                        return denominacion;
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderExcavacion,
                    dataIndex: 'excavacion',
                    autoExpand: false,
                    editor: textfieldExcavacion,
                    width: 170,
                    editable: true,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderRevestida,
                    dataIndex: 'revestida',
                    autoExpand: false,
                    editable: true,
                    width: 170,
                    editor: textfielRevestida,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderTerminacion,
                    dataIndex: 'terminacion',
                    autoExpand: false,
                    editor: textfieldTerminacion,
                    width: 170,
                    editable: true,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderTecho,
                    dataIndex: 'techo',
                    autoExpand: false,
                    editor: textfieldTecho,
                    width: 170,
                    editable: true,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderFPK,
                    dataIndex: 'fkp',
                    autoExpand: false,
                    editable: true,
                    editor: textfieldFPK,
                    width: 170,
                    default: true
                });
            }
        }

        if (_this.denominacioncolumnareporte == "constAloj" || _this.denominacioncolumnareporte == "sistemaEmp") {
            this.addGridColumn({
                dataIndex: 'idregnumerico',
                default: true
            });
            if (_this.tab == 2) {
                var partes = Array();
                var caracteristicas = Array();
                var estados = Array();

                var comboEstatusTecnico = new LOG.util.ComboBox({
                    disabled: true,
                    fieldLabel: _this.idioma.lbHeaderEstado,
                    allowBlank: true,
                    name: 'idestatustecnico',
                    valueField: 'idestatustecnico',
                    displayField: 'denominacion',
                    resizable: true,
                    url: 'gestEstatusTecnico',
                    autoLoad: true,
                    editable: false,
                    emptyText: _this.idioma.lbCbVacio,
                    mode: 'local',
                    listeners: {
                        'select': function (cb, record) {
                            var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                            rc.set('idestatustecnico', record.data.idestatustecnico);
                        }
                    }
                });
                comboEstatusTecnico.getStore().on({
                    'beforeload': function (st) {
                        st.baseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                    },
                    'load': function (st, records) {
                        comboEstatusTecnico.enable();
                        if (records.length > 0) {
                            comboEstatusTecnico.enable();
                        } else {
                            mostrarMensaje(1, _this.idioma.lbNoestatus);
                        }
                        st.each(function (o) {
                            estados.push(o.data);
                        });
                    }
                });

                this.comboeditorTipoMaterial = new LOG.util.ComboBox({
                    hiddenName: 'idtipocontruccion',
                    valueField: 'idtipocontruccion',
                    displayField: 'denominacion',
                    url: 'cargarnomencladorTipoMaterial',
                    mode: 'remote',
                    autoCreate: true,
                    autoLoad: true,
                    allowBlank: false,
                    triggerAction: 'all',
                    typeAhead: true,
                    resizable: true,
                    emptyText: _this.idioma.lbSeleccione,
                    editable: false,
                    listeners: {
                        'select': function (combo, record, index) {
                            var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                            rc.set('idtipocontruccion', record.data.idtipocontruccion);
                        }
                    }

                });
                _this.comboeditorTipoMaterial.getStore().on({
                    'load': function (st) {
                        st.each(function (o) {
                            partes.push(o.data);
                        });

                    }
                });

                var caracteristicasTecnicas = new LOG.util.LovCombo({
                    valueField: 'idmaterialesconstruccion',
                    itemId: 'idmaterialesconstruccion',
                    displayField: 'denominacion',
                    url: 'cargarnomencladorMaterialConst',
                    mode: 'local',
                    autoLoad: true,
                    resizable: true,
                    editable: false,
                    allowBlank: false,
                    typeAhead: false,
                    minListWidth: 300,
                    listeners: {
                        'change': function (combo, record, index) {
                            var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                            rc.set('idmaterialesconstruccion', caracteristicasTecnicas.getValue());
                            //rc.set('denominacion', record.data.denominacion);

                        },
                        'focus': function () {
                            this.store.reload();
                        }
                    }
                });

                caracteristicasTecnicas.getStore().on({
                    'beforeload': function (st) {
                        var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                        if (rc) {
                            this.baseParams.id = rc.get('idtipocontruccion');
                        }
                    },
                    'load': function (st) {
                        caracteristicas = new Array();
                        st.each(function (o) {
                            caracteristicas.push(o.data);
                        });

                    }
                });

                this.addGridColumn({
                    header: _this.idioma.lbHeaderPartesGruesas,
                    dataIndex: 'idtipocontruccion',
                    width: 270,
                    default: true,
                    //  editor: _this.comboeditorTipoMaterial,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var denominacion = value;
                        if (record.json && record.json.idtipocontruccion == value) {
                            denominacion = record.json.partes;
                        } else {
                            Ext.each(partes, function (r) {
                                if (value == r.idtipocontruccion) {
                                    denominacion = r.denominacion;
                                }
                            });
                        }
                        return denominacion;
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderCaractMateriales,
                    dataIndex: 'idmaterialesconstruccion',
                    width: 270,
                    default: true,
                    editor: caracteristicasTecnicas,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var denominacion = "";
                        var arr = (value) ? value.split(",") : [];
                        if (arr.length == 1) {
                            Ext.each(caracteristicas, function (r) {
                                if (value == r.idmaterialesconstruccion) {
                                    denominacion = r.denominacion;
                                }
                            });
                        }
                        else if (arr.length > 1) {
                            Ext.each(arr, function (id, pos) {
                                Ext.each(caracteristicas, function (r) {
                                    if (id == r.idmaterialesconstruccion) {
                                        if (pos == 0) {
                                            denominacion += r.denominacion;
                                        }
                                        else {
                                            denominacion += "," + r.denominacion;
                                        }
                                    }
                                });
                            });
                        }
                        else {
                            denominacion = value;
                        }
                        if (value && (denominacion == value || denominacion == "") && record.json.caracteristicas) {
                            denominacion = record.json.caracteristicas;
                        }
                        return denominacion;
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderEstadoTecnico,
                    dataIndex: 'idestatustecnico',
                    width: 270,
                    default: true,
                    editor: comboEstatusTecnico,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var denominacion = value;
                        if (record.json && record.json.idestatustecnico == value) {
                            denominacion = record.json.estado;
                        } else {
                            Ext.each(estados, function (r) {
                                if (value == r.idestatustecnico) {
                                    denominacion = r.denominacion;
                                }
                            });
                        }
                        return denominacion;
                    }
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderPorciento,
                    dataIndex: 'porciento',
                    width: 270,
                    default: true,
                    editor: new LOG.util.Prototipos.inputDecimal({
                        hiddenName: 'porciento',
                        invalidText: _this.idioma.msgRangoMax,
                        allowBlank: false,
                        validator: function (value) {
                            if (value <= 100) {
                                return true;
                            } else {
                                return false;
                            }

                        }
                    })
                });
                this.addGridColumn({
                    dataIndex: 'idcaracteristicainmcamp',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'partes',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'idmaterialesconstruccionOrig',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'denominacion',
                    default: true
                });
            }
            if (_this.tab == 3) {
                var cantidad = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: false,
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/
                });

                var area = new LOG.util.Prototipos.inputDecimal({
                    anchor: '95%',
                    autoCreate: true,
                    name: 'aream2',
                    allowBlank: false
                    //maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    //regex: /^([0-9]+ ?[0-9]*)+$/
                });

                this.addGridColumn({
                    dataIndex: 'idlocal',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'iddestinolocalinmcomp',
                    default: true
                });
                this.addGridColumn({
                    dataIndex: 'estadobd',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderFuncion,
                    dataIndex: 'clave',
                    width: 270,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderDestinoLocales,
                    dataIndex: 'denominacion',
                    width: 270,
                    default: true,
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderCantidad,
                    dataIndex: 'cantidad',
                    width: 270,
                    default: true,
                    editable: true,
                    editor: cantidad,
                    renderer: _this.validar
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderAream2,
                    dataIndex: 'aream2',
                    width: 270,
                    editable: true,
                    editor: area,
                    default: true,
                    renderer: _this.validar
                });
            }
            if (_this.tab == 4) {

                var datefieldFecha = new Ext.form.DateField({
                    anchor: '95%',
                    editable: false,
                    format: 'd/m/Y',
                    name: 'fecha'
                });

                var submayor = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    allowBlank: false,
                    name: 'clave'
                });

                var numero = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    allowBlank: false,
                    name: 'numero'
                });

                var importe = new LOG.util.Prototipos.inputDecimal({
                    anchor: '95%',
                    autoCreate: true,
                    // maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    // regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    allowBlank: false,
                    name: 'importe'
                });

                var responsableTecnico = new LOG.util.Prototipos.inputTexto({
                    anchor: '80%',
                    allowBlank: false,
                    readOnly: true,
                    name: 'denomrespareacontable',
                    editable: false,
                    listeners: {
                        'focus': function (e) {
                            if (!respontecnico) {
                                var panelBusPer2 = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                    seguridad: 0,
                                    region: 'center',
                                    listeners: {
                                        'personaselecionada': function () {
                                            respontecnico.listaBotones.getItem(2).enable();
                                        },
                                        'personadeselecionada': function () {
                                            respontecnico.listaBotones.getItem(2).disable();
                                        }
                                    },
                                    limit: 15,
                                    start: 0
                                });

                                var respontecnico = new Ext.LOG.moduloMedio.winResponsable({
                                    title: 'Personas',
                                    layout: 'fit',
                                });
                                LOG.util.UIManager.apply(respontecnico.listaBotones.getItem(2), {
                                    disabled: true,
                                    handler: function () {
                                        if (panelBusPer2.getSeleccion()) {
                                            responsableTecnico.setValue(panelBusPer2.getSeleccion().get('idpersona'));
                                            responsableTecnico.setRawValue((panelBusPer2.getSeleccion().get('nombre') + ' ' + panelBusPer2.getSeleccion().get('papel') + ' ' + panelBusPer2.getSeleccion().get('sapel')));
                                            _this.getGridPrincipal().getSelectionModel().getSelected().set('denomrespareacontable', responsableTecnico.getRawValue());
                                            respontecnico.destroy();
                                        }
                                    }
                                });

                                respontecnico.add(panelBusPer2);
                                respontecnico.show();
                            }
                            else {
                                respontecnico.show();
                            }
                        }
                    }

                });

                this.addGridColumn({
                    dataIndex: 'iddatcontableinmcamp',
                    default: true
                });

                this.addGridColumn({
                    header: _this.idioma.lbHeaderFecha,
                    dataIndex: 'fecha',
                    width: 270,
                    default: true,
                    editor: datefieldFecha,
                    renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                        var result = value;
                        if (value != null && typeof value == "object") {
                            result = value.dateFormat('d/m/Y');
                            record.set('fecha', value.dateFormat('d/m/Y'));
                        }
                        return result;
                    },
                    editable: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderSubmayor,
                    dataIndex: 'clave',
                    width: 270,
                    default: true,
                    editor: submayor,
                    editable: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderNo,
                    dataIndex: 'numero',
                    width: 270,
                    default: true,
                    editor: numero,
                    editable: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderImporte,
                    dataIndex: 'importe',
                    width: 270,
                    default: true,
                    editable: false,
                    editor: importe
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderRespareaContab,
                    dataIndex: 'denomrespareacontable',
                    width: 270,
                    default: true,
                    editor: responsableTecnico
                });
            }
        }

    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.btnAdicionaCpmpartimiento,
            handler: function () {

                _this.winAddCompartimiento = new Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd({
                    idioma: _this.idioma,
                    datConfExp: _this,
                    idregnumerico: _this.dataregnumerico.data.idregnumerico,
                    otrosdatos: (_this.otrosdatos) ? _this.otrosdatos : false
                });
                _this.winAddCompartimiento.init();
                _this.winAddCompartimiento.view();
            }
        }));

        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            tooltip: (_this.msgDell) ? _this.msgDell : _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
            disabled: true,
            handler: function () {
                mostrarMensaje(2, _this.idioma.lbMsgElimCaracTecnicas, function eliminar(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        var array = _this.eliminarVisual();
                        if (array.length > 0) {
                            var param = {};
                            if (_this.entidad == 'vivienda') {
                                param['ids'] = Ext.encode(array);
                                param['idregnumerico'] = _this.dataregnumerico.data.idregnumerico;
                                if (_this.tab == 2 || _this.tab == 3) {
                                    param['otrosdatos'] = (_this.otrosdatos) ? 'true' : 'false';
                                }
                            }
                            if (_this.entidad == 'ingenieria') {
                                param['idregnumericoactivo'] = _this.dataregnumerico.data.idregnumerico;
                                param['ids'] = Ext.encode(array);

                            }
                            //implementar aqui para la eliminacion de bd en la entidad de camp y sistema E.
                            if (_this.entidad == 'constAloj' || _this.entidad == 'sistemaEmp') {
                                param['ids'] = Ext.encode(array);
                                param['idregnumerico'] = _this.dataregnumerico.data.idregnumerico;
                            }
                            Ext.MessageBox.wait(_this.idioma.labEliminando, _this.idioma.msgEspere || '...');
                            _this.modelo.eliminarDeGrids(param, _this.urlAux, function () {
                                _this.getStorePrincipal().load();
                            }, _this.msg);
                        }
                    }
                });
            }
        }));
    },
    render: function () {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.render.call(this);

        this.getStorePrincipal().on({
            'load': function (st, records, obj) {
                Ext.getBody().unmask();
                var partes = Array();
                st.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                if (st.data.items.length == 0 && !this.change) {
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
                } else {
                    _this.cargarValores(records);
                }
                obj.callback = function () {
                    _this.fireEvent('validarGrids', false);
                }
            },
            'add': function () {
                _this.fireEvent('validarGrids', true);
            },
            'remove': function () {
                _this.fireEvent('validarGrids', true);
            },
            'update': function () {
                _this.fireEvent('validarGrids', true);
            }
        });

        this.smGridPrincipal.on({
            'rowselect': function (sm) {
                _this.listaBotones.getItem(1).enable();
                // _this.btnDelCompartimentos.enable();
            },
            'rowdeselect': function (sm) {
                _this.listaBotones.getItem(1).disable();
            },
            'selectionchange': function (sm) {
                var selection = sm.getSelections();
                _this.listaBotones.getItem(1).setDisabled((selection.length >= 1) ? false : true);
            }

        });
        return vista;
    },
    validar: function (val, metadata) {
        if (val == 'emptyField') {
            metadata.css = 'x-form-invalid';

            return '';
        } else {
            return val;
        }
    },
    eliminarVisual: function () {
        var _this = this;
        var arraybd = new Array();
        var seleccionados = _this.getGridPrincipal().getSelectionModel().getSelections();
        for (var i = 0; i < seleccionados.length; i++) {
            if (seleccionados[i].data[_this.pEliminar[0]])
                arraybd.push(seleccionados[i].data[_this.pEliminar[1]]);
            else {
                _this.getStorePrincipal().remove(seleccionados[i]);
                _this.getStorePrincipal().commitChanges();
            }
        }
        return arraybd;
    },
    cargarValores: function (records) {
        var _this = this;
        Ext.each(records, function (r, rowindex) {
            for (var prop in r.data) {
                var colindex = _this.getGridPrincipal().getColumnModel().findColumnIndex(prop.toString());
                if (colindex != -1 && _this.getGridPrincipal().getColumnModel().isCellEditable(colindex, rowindex)) {
                    _this.getGridPrincipal().getColumnModel().getCellEditor(colindex, rowindex).field.setValue(r.data[prop])
                }
            }
        });
    }

});
Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.datConfExp = config.datConfExp;
        this.urlBusquedaGridPrincipal = 'cargarGridNomCompartimiento';
        Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = (this.title) ? this.title : this.idioma.btnAdicionaCpmpartimiento;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(600, 400);


    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idotrasinstalacionesviv',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idcompartimiento',
            default: true
        });

        this.addGridColumn({
            header: _this.idioma.lbHederDescp,
            dataIndex: 'denominacion',
            autoExpand: true,
            width: 170,
            default: true,
        });
    },
    initDefaultButtons: function () {
        var _this = this;

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                if (_this.otrosdatos) {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();

                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idotrasinstalacionesviv: arrayRec[i].data.idotrasinstalacionesviv,
                                    cantidad: 0
                                });
                                _this.datConfExp.getStorePrincipal().add(record);
                            }
                        }
                        Ext.MessageBox.hide();
                        this.close();
                    }
                } else {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();
                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idcompartimiento: arrayRec[i].data.idcompartimiento,
                                    cantidad: 0
                                });
                                _this.datConfExp.getStorePrincipal().add(record);
                            }
                        }
                        Ext.getBody().unmask();
                        this.close();
                    }
                }
                Ext.MessageBox.hide();
            }
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
            disabled: true,
            handler: function () {
                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                if (_this.otrosdatos) {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();

                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idotrasinstalacionesviv: arrayRec[i].data.idotrasinstalacionesviv,
                                    cantidad: 0
                                });
                                _this.datConfExp.getStorePrincipal().add(record);
                            }
                            _this.getStorePrincipal().load();
                        }
                        Ext.MessageBox.hide();
                        //  this.close();
                    }
                } else {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();
                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idcompartimiento: arrayRec[i].data.idcompartimiento,
                                    cantidad: 0
                                });
                                _this.datConfExp.getStorePrincipal().add(record);
                            }
                            _this.getStorePrincipal().load();
                        }
                        Ext.getBody().unmask();
                        //  this.close();
                    }
                }
                Ext.MessageBox.hide();
            }
        });
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            handler: function () {
                this.close();
            }
        });

    },
    render: function () {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function (st) {
                //Ext.getBody().mask('Cargando...', 'x-mask-loading');
                var idcompartimiento = Array();
                var idotrasinstlaciones = Array();

                if (_this.datConfExp.getStorePrincipal().data.items.length > 0) {
                    for (var i = 0; i < _this.datConfExp.getStorePrincipal().data.items.length; i++) {

                        if (_this.otrosdatos) {
                            idotrasinstlaciones.push(_this.datConfExp.getStorePrincipal().data.items[i].data.idotrasinstalacionesviv);
                        } else {
                            idcompartimiento.push(_this.datConfExp.getStorePrincipal().data.items[i].data.idcompartimiento);
                        }
                    }
                    if (_this.otrosdatos) {
                        st.initBaseParams.idotrasinstlaciones = Ext.encode(idotrasinstlaciones);
                    } else {
                        st.initBaseParams.idcompartimiento = Ext.encode(idcompartimiento);
                    }
                }

                st.initBaseParams.idregnumerico = _this.idregnumerico;
                if (_this.otrosdatos) {
                    st.initBaseParams.otrasinstalaciones = true;
                }

                st.initBaseParams.idestructuracomun = Ext.LOG.moduloMedio.ventanaP.identidad;
            },
            'load': function (st) {
                var idcompartimiento = Array();
                if (_this.datConfExp.getStorePrincipal().data.items.length > 0) {
                    for (var i = 0; i < _this.datConfExp.getStorePrincipal().data.items.length; i++) {
                        idcompartimiento.push(_this.datConfExp.getStorePrincipal().data.items[i].data.idcompartimiento);
                    }
                    st.baseParams.idcompartimiento = Ext.encode(idcompartimiento);
                }
                st.baseParams.idregnumerico = _this.idregnumerico;
                if (_this.otrosdatos) {
                    st.baseParams.otrasinstalaciones = true;
                }
                st.baseParams.idestructuracomun = Ext.LOG.moduloMedio.ventanaP.identidad;
                // Ext.getBody().unmask();
                if (st.data.items.length == 0)
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
            }
        });

        this.smGridPrincipal.on({
            'rowselect': function (sm) {
                if (sm.selections.items.length > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
            },
            'rowdeselect': function (sm) {
                if (sm.selections.items.length == 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
        });
        this.getStorePrincipal().load();
        return vista;
    }
});
Ext.LOG.moduloMedio.winGetRegNumericosService = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.region = 'center';
        this.clave = config.clave;
        this.idComponent = config.idComponent;
        this.idestructura = config.idestructura;
        this.dataregnumerico = config.dataregnumerico;
        this.urlBusquedaGridPrincipal = (config.urlAux) ? config.urlAux : 'getcargarregnummedios';
        this.datConfExp = config.datConfExp;
        this.title = config.title;
        this.denominacioncolumnareporte = config.denominacioncolumnareporte;


        Ext.LOG.moduloMedio.winGetRegNumericosService.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = (this.title) ? this.title : 'Registros num&eacute;ricos';
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(999, 500);

        var _this = this;
        this.doAction = config.doAction;
        this.arrRNnomostrar = (config.arrRNnomostrar) ? config.arrRNnomostrar : Array();

    },
    initDefaultColumns: function () {
        var _this = this;

        if (_this.denominacioncolumnareporte == "vivienda") {
            this.addGridColumn({
                dataIndex: 'idproducto',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idprod',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idregnumerico',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idpersona',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idresponsable',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idcategoria',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idestatustecnico',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'idactividad',
                default: true
            });

            /*this.addGridColumn({
             header: _this.idioma.lbCmCodigo,
             dataIndex: 'codigo',
             autoExpand: true,
             width: 90,
             default: true,
             });*/
            this.addGridColumn({
                header: _this.idioma.lbCmDenominacion,
                dataIndex: 'denominacion',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmMarca,
                dataIndex: 'marca',
                autoExpand: true,
                width: 170,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmModelo,
                dataIndex: 'modelo',
                autoExpand: true,
                width: 90,
                default: true,
            });
            /*
             this.addGridColumn({
             header: _this.idioma.lbCmNacionalidad,
             dataIndex: 'nacionalidad',
             autoExpand: true,
             width: 90,
             default: true,
             });*/
            this.addGridColumn({
                header: _this.idioma.lbCmColorPrim,
                dataIndex: 'colorptim',
                autoExpand: true,
                width: 100,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmColorSec,
                dataIndex: 'colorsec',
                autoExpand: true,
                width: 100,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmValorAdquisicion,
                dataIndex: 'valoradquisicion',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmValorContable,
                dataIndex: 'valorcontable',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmFechaAdq,
                dataIndex: 'fechaadq',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmAnnoFabri,
                dataIndex: 'annofabricacion',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmGarantia,
                dataIndex: 'garantia',
                autoExpand: true,
                width: 60,
                default: true,
                renderer: _this.activarCategoria
            });
            this.addGridColumn({
                header: _this.idioma.lbCmActividad,
                dataIndex: 'denomactividad',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmResponsable,
                dataIndex: 'responsable',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbCmEstatus,
                dataIndex: 'denomestadotecnico',
                autoExpand: true,
                width: 90,
                default: true,
            });
            this.addGridColumn({
                header: 'Nro.Inventario',
                dataIndex: 'nroinventario',
                autoExpand: true,
                width: 90,
                default: true,
            });
        }
        if (_this.denominacioncolumnareporte == "ingenieria") {
            this.addGridColumn({
                dataIndex: 'idlocal',
                default: true
            });
            this.addGridColumn({
                dataIndex: 'usarentidad',
                default: true
            });
            this.addGridColumn({
                header: _this.idioma.lbHederEstatus,
                dataIndex: 'estado',
                width: 50,
                default: true,
                renderer: function (value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            });
            this.addGridColumn({
                header: _this.idioma.lbHederDescp,
                dataIndex: 'denominacion',
                autoExpand: true,
                width: 200,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbHeaderClave,
                dataIndex: 'clave',
                width: 200,
                default: true,
            });
        }
        if (_this.denominacioncolumnareporte == "constAloj" || _this.denominacioncolumnareporte == "sistemaEmp") {
            this.addGridColumn({
                header: _this.idioma.lbHederEstatus,
                dataIndex: 'idestatustecnico',
                width: 50,
                default: true,
                renderer: function (value, metaData) {
                    if (value == 1) {
                        metaData.css = 'activo';
                    } else {
                        metaData.css = 'inactivo';
                    }
                }
            });

            this.addGridColumn({
                header: _this.idioma.lbHederDescp,
                dataIndex: 'denominacion',
                autoExpand: true,
                width: 200,
                default: true
            });

            if (_this.idComponent == 2) {
                this.addGridColumn({
                    dataIndex: 'idtipocontruccion',
                    default: true
                });
            }

            if (_this.idComponent == 3) {
                this.addGridColumn({
                    dataIndex: 'idlocal',
                    default: true
                });

                this.addGridColumn({
                    header: _this.idioma.lbHeaderClave,
                    dataIndex: 'clave',
                    hidden: _this.clave,
                    width: 200,
                    default: true
                });
            }

        }
    },
    initDefaultButtons: function () {
        var _this = this;
        if (_this.denominacioncolumnareporte == "vivienda") {
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                handler: function () {

                    Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                    var records = _this.smGridPrincipal.getSelections();
                    _this.doAction(records, false);
                    //_this.close();
                    Ext.MessageBox.hide();
                }
            });
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
                disabled: true,
                handler: function () {
                    Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                    var records = _this.smGridPrincipal.getSelections();
                    _this.doAction(records, true);
                    var i = 0;
                    while (i < records.length) {
                        _this.arrRNnomostrar.push(records[i].data.idregnumerico);
                        i += 1;
                    }
                    _this.getStorePrincipal().load();
                    Ext.MessageBox.hide();
                }
            });
        }
        if (_this.denominacioncolumnareporte == "ingenieria") {
            this.getVistaPrincipal().listaBotones.getItem(1).hide();
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                handler: function () {
                    if (_this.getSmPrincipal().hasSelection()) {
                        var arrayRec = _this.getSmPrincipal().getSelections();
                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    tipo: arrayRec[i].data.denominacion,
                                    idlocal: arrayRec[i].data.idlocal,
                                    volumen: '',
                                    idseccion: '',
                                    excavacion: '',
                                    revestida: '',
                                    terminacion: '',
                                    techo: '',
                                    fkp: ''
                                });
                                _this.datConfExp.getStorePrincipal().add(record);
                                this.close();
                            }
                        }

                    }
                }
            });
        }
        if (_this.denominacioncolumnareporte == "sistemaEmp" || _this.denominacioncolumnareporte == "constAloj") {
            this.getVistaPrincipal().listaBotones.getItem(1).hide();
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                handler: function () {
                    if (_this.getSmPrincipal().hasSelection()) {
                        var arrayRec = _this.getSmPrincipal().getSelections();
                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                if (_this.idComponent == 3) {
                                    var record = new Ext.data.Record({
                                        clave: arrayRec[i].data.clave,
                                        denominacion: arrayRec[i].data.denominacion,
                                        idlocal: arrayRec[i].data.idlocal,
                                        cantidad: '',
                                        aream2: ''
                                    });
                                    _this.datConfExp.getStorePrincipal().add(record);
                                    this.close();
                                } else {
                                    var record = new Ext.data.Record({
                                        partes: arrayRec[i].data.denominacion,
                                        idtipocontruccion: arrayRec[i].data.idtipocontruccion,
                                        caracteristicas: '',
                                        idestatustecnico: '',
                                        porciento: '',
                                        idcaracteristicainmcamp: '',
                                        idmaterialesconstruccion: '',
                                    });
                                    _this.datConfExp.getStorePrincipal().add(record);
                                    this.close();
                                }
                            }
                        }
                    }
                }
            });
        }

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            handler: function () {
                this.close();
            }
        });
    },
    render: function () {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                /*idestructura	100000634
                 idestructurapadre	100000532*/
                st.initBaseParams.arrRNnomostrar = Ext.encode(_this.arrRNnomostrar);
                st.initBaseParams.idestructura = Ext.LOG.moduloMedio.ventanaP.identidad;
                // st.initBaseParams.idnaturaleza = natactivosP;
            },
            'load': function (st) {
                if (st.data.items.length == 0) {
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
                }
            }
        });
        _this.getStorePrincipal().load();

        _this.smGridPrincipal.on({
            'rowselect': function (sm) {
                if (sm.selections.items.length > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
            },
            'rowdeselect': function (sm) {
                if (sm.selections.items.length == 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
        });
        return vista;
    },
    activarCategoria: function (val, metaData, record, rowIndex, colIndex, store) {
        var _this = this;
        val = (!val || val == null || val == '') ? '' : val;

        if (record.data.garantia == 1) {
            return '<span style="color:black;">' + "Si" + '</span>';
        } else {
            return '<span style="color:black;">' + "No" + '</span>';
        }
    },
});
Ext.LOG.moduloMedio.gridSinBooton = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.dirController = '/logistica/activos_fijos/patrimonio/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.modoSeleccion = 2;
        this.gridEditable = true;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.viviendaEquipos = config.viviendaEquipos;
        this.otrosdatos = config.otrosdatos;
        this.urlBusquedaGridPrincipal = config.url;
        this.idarea = config.idarea;
        this.objObra = config.objObra;
        this.denominacioncolumnareporte = config.denominacioncolumnareporte;
        this.obrasAsoc = (config.obrasAsoc) ? config.obrasAsoc : false;
        Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.constructor.call(this, config);
        this.addEvents('validarGrids');


    },
    initDefaultColumns: function () {
        var _this = this;
        var cantidadIng = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            width: 100,
            maxLength: '19',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
            enableKeyEvents: true,
            allowBlank: false,
            valido: true,
            listeners: {
                'valid': function (field) {
                    field.valido = true;
                    if (field.getValue().charAt(0) == ' ') {
                        field.markInvalid(_this.idioma.lbContenidoSinEspacios);
                        field.valido = false;
                    } else if (field.getValue().charAt(0) == '-' || field.getValue().charAt(0) == '.' || field.getValue().charAt(0) == '_') {
                        field.markInvalid(_this.idioma.lbContenidoErroneo);
                        field.valido = false;
                    } else {
                        for (var i = 0; i < field.getValue().length - 1; i++) {
                            var char = field.getValue().charAt(i);
                            if (char == ' ' || char == '-' || char == '.' || char == '_') {
                                var char1 = field.getValue().charAt(i + 1);
                                if (char1 == ' ' || char1 == '-' || char1 == '.' || char1 == '_') {
                                    field.markInvalid(_this.idioma.lbContenidoErroneo);
                                    field.valido = false;
                                }
                            }

                        }
                    }
                }
            }
        });
        if (_this.denominacioncolumnareporte == "ingenieria") {
            if (_this.obrasAsoc) {
                this.addGridColumn({
                    dataIndex: 'idregnumerico',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderTipo,
                    dataIndex: 'denominacion',
                    width: 270,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderInventario,
                    dataIndex: 'nroinventario',
                    width: 270,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderCantidad,
                    dataIndex: 'cantidad',
                    width: 270,
                    autoExpand: true,
                    default: true,
                    editor: cantidadIng
                });

            }
        }
        if (_this.denominacioncolumnareporte == "constAloj" || _this.denominacioncolumnareporte == "sistemaEmp") {

            var m2 = new LOG.util.Prototipos.inputDecimal({
                autoCreate: true,
                width: 100,
                name: 'mcuadrado',
                allowBlank: false,
                maxLength: '19',
                regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                enableKeyEvents: true
            });

            var numeroPlantas = new LOG.util.Prototipos.inputTexto({
                autoCreate: true,
                width: 100,
                maxLength: 3,
                allowBlank: false,
                maskRe: /^([0-9]+ ?[0-9]*)+$/,
                regex: /^([0-9]+ ?[0-9]*)+$/,
                enableKeyEvents: true
            });

            var areaDes = new LOG.util.Prototipos.inputDecimal({
                autoCreate: true,
                width: 100,
                maxLength: '19',
                allowBlank: false,
                maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                enableKeyEvents: true
            });

            var altura = new LOG.util.Prototipos.inputDecimal({
                autoCreate: true,
                width: 100,
                maxLength: '19',
                allowBlank: false,
                maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                enableKeyEvents: true
            });
            var secciones = Array();
            var comboeditorSistema = new LOG.util.ComboBox({
                hiddenName: 'idsistemaconstructivo',
                valueField: 'idsistemaconstructivo',
                displayField: 'denominacion',
                url: 'cargarnomencladorSistemaConstructivo',
                mode: 'local',
                autoLoad: true,
                autoCreate: true,
                allowBlank: false,
                triggerAction: 'all',
                typeAhead: true,
                resizable: true,
                emptyText: _this.idioma.lbSeleccione,
                editable: false,
                listeners: {
                    'select': function (cb, record) {
                        var rc = _this.getGridPrincipal().getSelectionModel().getSelected();
                        rc.set('idsistemaconstructivo', record.data.idsistemaconstructivo);
                    }
                }
            });

            comboeditorSistema.getStore().on({
                'beforeload': function (st) {
                    st.baseParams.idregnumerico = Ext.LOG.moduloMedio.ventanaP.identidad;
                },
                'load': function (st, records) {
                    st.each(function (o) {
                        secciones.push(o.data);
                    });
                }
            });

            this.addGridColumn({
                header: _this.idioma.lbHeaderObjetoObra,
                dataIndex: 'denominacion',
                width: 270,
                default: true,
            });
            this.addGridColumn({
                header: _this.idioma.lbHeaderm2,
                dataIndex: 'mcuadrado',
                width: 270,
                default: true,
                editor: m2
            });
            this.addGridColumn({
                header: _this.idioma.lbHeaderNumeroPlantas,
                dataIndex: 'nroplantas',
                width: 270,
                default: true,
                editor: numeroPlantas
            });
            this.addGridColumn({
                header: _this.idioma.lbHeaderAreaAledana,
                dataIndex: 'aream2',
                width: 270,
                default: true,
                editor: areaDes
            });
            this.addGridColumn({
                header: _this.idioma.lbHeaderAltura,
                dataIndex: 'altura',
                width: 270,
                default: true,
                editor: altura
            });
            this.addGridColumn({
                dataIndex: 'idregnumerico',
                default: true
            });

            this.addGridColumn({
                header: _this.idioma.lbHeaderSistema,
                dataIndex: 'idsistemaconstructivo',
                width: 270,
                default: true,
                editor: comboeditorSistema,
                renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                    var denominacion = value;
                    if (record.json && record.json.idsistemaconstructivo == value) {
                        denominacion = record.json.sistema;
                    } else {
                        Ext.each(secciones, function (r) {
                            if (value == r.idsistemaconstructivo) {
                                denominacion = r.denominacion;
                            }
                        });
                    }
                    return denominacion;
                }
            });
        }
    },
    render: function () {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
                if (_this.idarea) {
                    st.initBaseParams.idarea = _this.idarea;
                }
                if (_this.objObra && _this.objObra.length > 0) {
                    st.initBaseParams.id = Ext.encode(_this.objObra);
                }

            },
            'load': function (st, records, obj) {
                if (st.data.items.length == 0 && !this.change) {
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
                }
                obj.callback = function () {
                    _this.fireEvent('validarGrids', false);
                }
            },
            'add': function () {
                _this.fireEvent('validarGrids', true);
            },
            'remove': function () {
                _this.fireEvent('validarGrids', true);
            },
            'update': function () {
                _this.fireEvent('validarGrids', true);
            }
        });
        return vista;
    },
    validarGrid: function () {
        var _this = this;
        var totalColumnas = _this.getGridPrincipal().getColumnModel().getColumnCount();
        var totalFilas = _this.getStorePrincipal().getCount();
        var valido = false;
        if (totalFilas > 0) {
            for (var i = 0; i < totalFilas; i++) {
                var esEditable = false;
                for (var j = 0; j < totalColumnas; j++) {
                    if (_this.getGridPrincipal().getColumnModel().isCellEditable(j, i)) {
                        esEditable = true;
                        if (_this.getGridPrincipal().getColumnModel().getCellEditor(j, i))
                            valido = _this.getGridPrincipal().getColumnModel().getCellEditor(j, i).field.isValid();
                    }
                }
                if (!esEditable)
                    return true;
            }
        }
        return valido;
    }
});
Ext.LOG.moduloMedio.winResponsable = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        Ext.apply(this, config);
        this.resizable = false;
        this.usarAplicar = false;
        this.closeAction = 'close';
        this.width = 800;
        this.height = 600;
        this.modal = true;
        Ext.LOG.moduloMedio.winResponsable.superclass.constructor.call(this, config);
    },
    initComponent: function (config) {
        var _this = this;
        Ext.LOG.moduloMedio.winResponsable.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function () {
                _this.destroy();
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function () {
                _this.onAceprtarFn.call(_this.scope);
            }
        });


    }
});
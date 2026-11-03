Ext.LOG.moduloMedio.confRegistroComponent = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        config.resizable = false;
        this.usarAplicar = false;
        this.idioma = config.idioma;
        this.layout = 'border';
        this.dataregnumerico = config.dataregnumerico;
        this.denentidad = this.identidad;
        this.tree = this.tree;
        this.idarea = this.idarea;
        this.titlesTabs = this.titlesTabs;
        this.dsbasedatos = new Array();
        Ext.LOG.moduloMedio.confRegistroComponent.superclass.constructor.call(this, config);

        this.setTitle(this.title);
        this.panelDatos();
        this.bodyStyle = 'padding:5px 5px 0';
        this.modal = true;
        this.collapsible = true;
        //this.layout = 'border';
        //this.region = 'center';

        this.width = 445;
        this.height = 130;
        var _this = this;

    },
    initComponent: function(config) {
        var _this = this;
        Ext.LOG.moduloMedio.confRegistroComponent.superclass.initComponent.call(this);
        _this.listaBotones.getItem(1).disable();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: false,
            handler: function() {

            /*    Ext.Ajax.request({
                    url: 'getConformarDocExpediente',
                    method: 'POST',
                    params: {
                        idregnumerico: _this.dataregnumerico.data.idregnumerico,
                        regcontable: (_this.checkRegistro.getValue()) ? 1 : 0,
                        areaatencion: (_this.checkAreaAtencion.getValue()) ? 1 : 0,
                        addfecha: activar,
                        cmbregimen: (_this.comboRegimen.getValue()) ? _this.comboRegimen.getValue() : null,
                    },
                    callback: function(options, success, response) {
                        var rd = Ext.decode(response.responseText);
                        if (rd.msg == 1) {
                            mostrarMensaje(1, _this.idioma.MsgConformarExpediente);
                            _this.close();
                            _this.tree.getStore().reload({
                                idarea: _this.idarea,
                                start: Ext.LOG.moduloMedio.start,
                                limit: Ext.LOG.moduloMedio.limit
                            });
                            //_this.stDocExpInmueble.load();
                        }
                    }
                });*/
            }
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            handler: function() {
                _this.close();
            }
        });
    },
    panelDatos: function() {
        var _this = this;
        var f = new Date();
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
            //title: _this.idioma.lbTitleDocExpInmueble,
            anchor: '98%',
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
            layoutOnTabChange: true,
            // items: [this.panelDatosG]
        });
        this.denominacioncolumnareporte = "ingenieria";//vivienda

        if (this.titlesTabs.length > 0) {
            for (var i = 0; i < this.titlesTabs.length; i++) {
                this.panelDatosG = LOG.util.UIManager.initForm({//new LOG.util.Panel({
                    frame: true,
                    idComponent: i,
                    region: 'center',
                    // title: this.titlesTabs[i],
                    // items: [cls, numerics]
                });
                if (_this.denominacioncolumnareporte == "vivienda") {
                    this.getRegistroVivienda(this.panelDatosG);
                }
                if (_this.denominacioncolumnareporte == "ingenieria") {

                    this.getRegistroIngenieria(this.panelDatosG);
                }

                var panelCenterTabs = LOG.util.UIManager.initForm({
                    frame: true,
                    region: 'center',
                    layout: 'form',
                    anchor: '98%',
                    autoHeight: true,
                    defaults: {
                        anchor: '100%',
                        msgTarget: 'side'
                    },
                    items: [this.panelDatosG]
                });
                this.tabpanel.add(new Ext.Panel({region: 'center', frame: true, idComponent: i, title: this.titlesTabs[i], items: [this.panelDatosG]}));
            }
        }

        this.add(this.panelCenter, this.tabpanel); //title: this.titlesTabs[i],
    },
    getRegistroVivienda: function(panelDatosG) {
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
                items: [clsPanelfieluno]
            }));

            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[5])));
            clsPanelfieldos.addComponent(this.contenedor(this.contenedor(campos[6])));
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                title: _this.idioma.lbDatosInventario,
                autoHeight: true,
                items: [clsPanelfieldos]
            }));
            var clsPanelfieltres = LOG.util.UIManager.initColumnForm({
                columnas: 4
            });
            clsPanelfieltres.addComponent(this.contenedor(this.contenedor(campos[7])));
            clsPanelIdentificacion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
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
            for (var i = 0; i < camposdireccion.length; i++) {
                clsPanelfielDireccion.addComponent(this.contenedor(this.contenedor(camposdireccion[i])));
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
                denominacioncolumnareporte: _this.denominacioncolumnareporte
            });
            gridEquipos.init();
            var grid = gridEquipos.view();
            grid.height = 450;
            var panelGrid = new Ext.Panel({
                height: 450,
                items: [grid]
            });
            clsPanelConstruccion.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextCompartimientos,
                items: [panelGrid]
            }));
            panelDatosG.add(clsPanelConstruccion);

        }
        if (panelDatosG.idComponent == 3) {
            var clsPanelOtrosDatos = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });

            var clsPanelOtrosDatosGeneral = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            clsPanelOtrosDatos.getColumn(0).columnWidth = 0.14;
            clsPanelOtrosDatos.getColumn(1).columnWidth = 0.6;
            clsPanelOtrosDatos.getColumn(2).columnWidth = 0.14;
            var clsPanelfielDatosContables = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielDatosArrendatario = LOG.util.UIManager.initColumnForm({
                columnas: 3
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

            clsPanelfielDatosArrendatario.addComponent(this.contenedor(this.contenedor(otrosDatos[3])));
            clsPanelfielDatosArrendatario.addComponent(this.contenedor(this.contenedor(otrosDatos[5])));

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
            clsPanelfielDatosArrendatario.addComponent(this.contenedor(this.contenedor(otrosDatos[4])));
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
            clsPanelfielocupViviaux.addComponent(this.contenedor(this.contenedor(otrosDatos[8])));
            clsPanelfist.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextOcupacionViviendaPor,
                items: [clsPanelfielocupViviaux]
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
                otrosdatos: true,
                denominacioncolumnareporte: _this.denominacioncolumnareporte
            });
            gridEquipos.init();
            var gridOtras = gridEquipos.view();
            gridOtras.height = 450;

            var panelGridOtrosDatos = new Ext.Panel({
                height: 450,
                items: [gridOtras]
            });
            //this.gridOtrasInstalaciones.listaBotones

            clsPanelOtrosDatosGeneral.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextOtrasInstalaciones,
                items: [panelGridOtrosDatos]
            }));
            panelDatosG.add(clsPanelOtrosDatosGeneral);
        }
        if (panelDatosG.idComponent == 4) {
            var clsPanelEquipos = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var clsPanelfielequipos = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });
            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getCargarGridEquiposMedios',
                viviendaEquipos: true,
                denominacioncolumnareporte: _this.denominacioncolumnareporte
            });
            gridEquipos.init();
            var gridEq = gridEquipos.view();
            gridEq.height = 640;
            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.btnAdicionaEquipoyOtrosMedios,
                handler: function() {
                    _this.onAdicionar();
                }
            });

            Ext.apply(gridEquipos.listaBotones.getItem(1), {
                disabled: true,
                tooltip: _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
                handler: function() {
                    _this.onEliminar();
                }
            });

            clsPanelfielequipos.addComponent(gridEq);
            clsPanelEquipos.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTextEquiposOtrosMediosEntregados,
                items: [clsPanelfielequipos]
            }));
            panelDatosG.add(clsPanelEquipos);
        }

    },
    getRegistroIngenieria: function(panelDatosG) {
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
                items: [clsPanelfieluno]
            }));


            var clsPanelfielUbicacion = LOG.util.UIManager.initColumnForm({
                columnas: 3
            });
            clsPanelfielUbicacion.getColumn(0).columnWidth = 0.15;
            clsPanelfielUbicacion.getColumn(1).columnWidth = 0.15;
            clsPanelfielUbicacion.getColumn(2).columnWidth = 0.12;
            clsPanelfielUbicacion.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[12])));
            clsPanelfielUbicacion.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[14])));


            var clsPanelFilsCordenadas = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            var clsPanelcorrAux = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });

            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[15])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[16])));
            clsPanelcorrAux.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[17])));
            clsPanelFilsCordenadas.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: 'Coordenadas',
                items: [clsPanelcorrAux]
            }));
            clsPanelfielUbicacion.addComponent(clsPanelFilsCordenadas);
            clsPanelfielUbicacion.addComponent(this.contenedor(this.contenedor(getCampos[12])));
            getCampos[12].fieldLabel = 'Utilizaci&oacute;n';
            getCampos[12].on({
                'select': function(combo, record, index) {
                    if (record.data.idestatustecnico == -1) {
                        getCamposOtrosDatos[13].enable();
                        getCamposOtrosDatos[13].reset();
                        getCamposOtrosDatos[13].getStore().load({
                            params: {
                                idpadre: record.data.idestatustecnico
                            }
                        });
                    } else {
                        getCamposOtrosDatos[13].disable();
                        getCamposOtrosDatos[13].reset();
                    }
                }
            })
            getCampos[12].getStore().reload();
            clsPanelfielUbicacion.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[13])));
            clsPanelfielUbicacion.addComponent(new Ext.Panel({height: 2}));
            clsPanelfielUbicacion.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[18])));
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
                // title: _this.idioma.lbDatosUbicacion,                
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
            clsPanelfieotros.getColumn(0).columnWidth = 0.13;
            clsPanelfieotros.getColumn(1).columnWidth = 0.13;

            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[19])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[20])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[21])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[22])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[23])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[24])));
            getCamposOtrosDatos[19].getStore().load();
            getCamposOtrosDatos[20].getStore().load();
            getCamposOtrosDatos[23].getStore().load();
            getCamposOtrosDatos[24].getStore().load();

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

            clsPanelObrasprotectoras.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                items: [clsPanelfieotros]
            }));
            clsPanelfieotros.addComponent(new Ext.Panel({}));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[28])));
            clsPanelfieotros.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[29])));
            getCamposOtrosDatos[29].getStore().load();

            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getLocalesObrasIng',
                denominacioncolumnareporte: _this.denominacioncolumnareporte

            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 550;

            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.btnAdicionaEquipoyOtrosMedios,
                handler: function() {
                    _this.onAdicionar('Adicionar locales', gridEquipos, 'cargarnomencladorlocal');
                }
            });

            Ext.apply(gridEquipos.listaBotones.getItem(1), {
                disabled: true,
                tooltip: _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
                handler: function() {
                    _this.eliminarLocalesObrasIng(gridEquipos);
                }
            });
            var panelGridLocales = new Ext.Panel({
                height: 600,
                items: [gridLocales]
            });


            clsPanelObrasprotectoras.addComponent(new Ext.form.FieldSet({
                autoHeight: true,
                title: _this.idioma.lbTitleDestinoLocalesIng,
                items: [panelGridLocales]
            }));

            panelDatosG.add(clsPanelObrasprotectoras);
        }
        if (panelDatosG.idComponent == 2) {
            var clsPanelObrasasociadas = LOG.util.UIManager.initColumnForm({
                columnas: 1
            });

            var gridEquipos = new Ext.LOG.moduloMedio.gridSinBooton({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDatosObrasAsoc',
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                obrasAsoc: true

            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 680;

            var panelGridObrasAsocia = new Ext.Panel({
                height: 700,
                title: _this.idioma.lbTitleDatosObrasAsociados,
                items: [gridLocales]
            });

            clsPanelObrasasociadas.addComponent(panelGridObrasAsocia);
            panelDatosG.add(clsPanelObrasasociadas);
        }
        if (panelDatosG.idComponent == 3) {
            var _this = this;
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
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[2])));//analisis
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCampos[12])));//estado
            getCampos[12].fieldLabel = 'Estado';
            getCampos[12].getStore().load();
            getCamposOtrosDatos[6].fieldLabel = 'Fecha inicio';
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[6])));//feha inicio
            clsPanelDatosContables.addComponent(this.contenedor(this.contenedor(getCamposOtrosDatos[7])));//fecha fin
            getCamposOtrosDatos[6].fieldLabel = 'Fecha inicio';
            getCamposOtrosDatos[7].fieldLabel = 'Fecha fin';

            var gridEquipos = new Ext.LOG.moduloMedio.viviendaConstrCompartimento({
                idioma: _this.idioma,
                dataregnumerico: _this.dataregnumerico,
                datConfExp: _this,
                url: 'getDatosContables',
                clave: false,
                denominacioncolumnareporte: _this.denominacioncolumnareporte,
                ing: true

            });
            gridEquipos.init();
            var gridLocales = gridEquipos.view();
            gridLocales.height = 550;

            Ext.apply(gridEquipos.listaBotones.getItem(0), {
                tooltip: _this.idioma.btnAdicionaEquipoyOtrosMedios,
                handler: function() {
                    var record = new Ext.data.Record({
                        fecha: '',
                        clave: '',
                        no: '',
                        importe: (_this.dataregnumerico.valorcontable) ? _this.dataregnumerico.valorcontable : 0,
                        contabilidad: '',
                        resptecnico: ''
                    });
                    gridEquipos.getStorePrincipal().add(record);
                }
            });

            Ext.apply(gridEquipos.listaBotones.getItem(1), {
                disabled: true,
                tooltip: _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
                handler: function() {
                    _this.eliminarDatosContables(gridEquipos);
                }
            });
            var panelGridLocales = new Ext.Panel({
                height: 600,
                items: [gridLocales]
            });
            panelDatosG.add(clsPanelDatosContables);
            panelDatosG.add(panelGridLocales);

        }
    },
    eliminarDatosContables: function(gridEquipos) {
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
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.msg == 1) {
                                mostrarMensaje(1, _this.idioma.MsgEliminadoDocumentosContables);
                                gridEquipos.getStorePrincipal().load({
                                    callback: function() {
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
    contenedor: function(campo) {
        var contenedor = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        contenedor.addComponent(campo);
        return contenedor;
    },
    getCampos: function() {
        var _this = this;
        var comboRegimen = new LOG.util.ComboBox({
            url: 'getCargarRegimen',
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
        });

        comboRegimen.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
            },
            'load': function(st, records) {
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
            name: 'denominacion',
            maxLength: '11',
            allowBlank: false,
            anchor: '50%',
            fieldLabel: this.idioma.lbResolucion,
            regex: /^([a-zA-ZáéíóúñüÑ0-9-_/.\s]+ ?[a-zA-ZáéíóúñüÑ0-9-_/.\s]*)+$/
        });

        var nroExpediente = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            maxLength: '11',
            allowBlank: false,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbExpediente,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var precioLegal = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            maxLength: '14',
            allowBlank: true,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbPreciolegal,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var superficieUtil = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            maxLength: '11',
            allowBlank: true,
            anchor: '80%',
            enableKeyEvents: true,
            fieldLabel: this.idioma.lbSuperficieUtil,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var cmpHideEditable = new Ext.form.Hidden({
            name: "idpersona"
        });
        
        var cmpEditable = new Ext.form.ComboBox({
            autoCreate: true,
            anchor: '80%',
            allowBlank: false,
            fieldLabel: _this.idioma.lbsResponablePersona,
            enableKeyEvents: true,
            listeners: {
                'render': function(p) {
                    var theTip = null;
                    p.getEl().on('mouseover', function() {
                        theTip = new Ext.Tip({
                            margin: '0 0 0 200',
                            shadow: false
                        });
                        var pos = _this.comboResponsable.getPosition();
                        var x = pos[0];
                        var y = pos[1] + 30;
                        var text = _this.idioma.lbResponsable;
                        theTip.html = '<b>' + text + '</b>' + ' ' + _this.comboResponsable.getRawValue();
                        theTip.showAt([x, y]);
                    });

                    p.getEl().on('mouseleave', function() {
                        if (theTip)
                            theTip.hide();
                    });
                }
            }
        });

        var noInventarioViv = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
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
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var obsercaviones = new Ext.form.TextArea({
            autoCreate: true,
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            fieldLabel: _this.idioma.lbObservaciones,
            enableKeyEvents: true,
            valido: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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
            anchor: '80%',
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
        });

        var stVarianteUbicacion = new Ext.data.SimpleStore({
            fields: ['idvarianteUbicacion', 'denominacion'],
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
            hiddenName: 'idvarianteUbicacion',
            valueField: 'idvarianteUbicacion',
            name: 'idvarianteUbicacion',
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
        });

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
            name: 'idtipoconstruccion',
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
        });

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
        });

        combosistemaconstrucctivo.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    combosistemaconstrucctivo.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoSistemaConstr);
                }
            }
        });

        var comboEstatusTecnico = new LOG.util.ComboBox({
            disabled: true,
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
        });

        comboEstatusTecnico.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                comboEstatusTecnico.enable();
                if (records.length > 0) {
                    comboEstatusTecnico.enable();
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
            name: 'idtechos',
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
        });

        combotechode.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
                st.baseParams.idtechosParedes = -1;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    combotechode.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoTechos);
                }
            }
        });

        var comboparedes = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: false,
            fieldLabel: 'Paredes de',
            allowBlank: true,
            name: 'idparedes',
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
        });

        comboparedes.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
                st.baseParams.idtechosParedes = -2;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    comboparedes.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoParedes);
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
        });

        combotipologia.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    combotipologia.enable();
                } else {
                    mostrarMensaje(1, _this.idioma.lbNoTipologia);
                }
            }
        });


        return [
            comboRegimen, nroResolucion, nroExpediente, precioLegal, superficieUtil, cmpEditable,
            noInventarioViv, obsercaviones, comboTipoAsentamiento, comboVarianteUbicacion, combomaterialconstruccion, combosistemaconstrucctivo,
            comboEstatusTecnico, combotechode, comboparedes, combotipologia
        ];
    },
    getCamposDireccion: function() {
        var _this = this;
        var textfieldCalleAvenida = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idcalleavenida',
            anchor: '80%',
            maxLength: '255',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: _this.idioma.lbCalleAvenida,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldNro = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idNro',
            anchor: '80%',
            maxLength: '9',
            allowBlank: true,
            fieldLabel: 'Nro',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });

        var textfieldPiso = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idPiso',
            anchor: '80%',
            maxLength: '3',
            allowBlank: true,
            fieldLabel: 'Piso',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });

        var textfieldNroApto = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idNroApro',
            anchor: '80%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'Nro. Apto',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldEntrecalle = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idEntrecalle',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Entrecalle',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldBarrioReparto = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idBarrioReparto',
            anchor: '80%',
            maxLength: '255',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'Barrio o reparto',
            enableKeyEvents: true,
            listeners: {
                'valid': function(field) {
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

        var textfieldManzana = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idManzana',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Manzana',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldDistrito = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idDistrito',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Distrito',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldCarretera = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idCarretera',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Carretera',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldCamino = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idCamino',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            valido: true,
            allowBlank: true,
            fieldLabel: 'Camino',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldKm = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            name: 'idKm',
            anchor: '80%',
            maxLength: '255',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: true,
            fieldLabel: 'Km',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                }
            }
        });

        var textfieldFinca = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idFinca',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            valido: true,
            fieldLabel: 'Finca',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var textfieldLocalidad = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            name: 'idLocalidad',
            anchor: '80%',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maxLength: '255',
            valido: true,
            allowBlank: true,
            fieldLabel: 'Localidad',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var comboprovincia = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbProvincia,
            allowBlank: true,
            name: 'idprovinciaviv',
            valueField: 'iddpt',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getCargarProvincias',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            emptyText: 'Seleccione....',
            mode: 'local',
            disabled: false,
            editable: false,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.buttons[2].handler();
                    }
                },
                'select': function(combo, record, index) {
                    combomunicipios.enable();
                    combomunicipios.reset();
                    combomunicipios.getStore().load({
                        params: {
                            accion: "municipio",
                            idpadre: record.data.idpadre
                        }
                    })

                }
            }
        });

        var combomunicipios = new LOG.util.ComboBox({
            anchor: '80%',
            disabled: true,
            fieldLabel: _this.idioma.lbMunicipio,
            allowBlank: true,
            name: 'idmunicipioviv',
            valueField: 'iddpt',
            displayField: 'denominacion',
            listWidth: 300,
//            pageSize: 20,
            minChars: 0,
            resizable: true,
            url: 'getCargarProvincias',
            triggerAction: 'all',
            forceSelection: true,
            typeAhead: true,
            editable: false,
            emptyText: 'Seleccione....',
            mode: 'local',
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.buttons[2].handler();
                    }
                }
            }
        });
        return [
            textfieldCalleAvenida,
            textfieldNro,
            textfieldPiso,
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
            combomunicipios
        ];
    },
    getCamposOtrosDatos: function() {
        var _this = this;
        var codigoCuentacontable = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'C&oacute;digo de la cuenta control',
            enableKeyEvents: true,
            listeners: {
                'valid': function(field) {
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

        var nombreCuentacontable = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            valido: true,
            fieldLabel: 'Nombre de la cuenta control',
            enableKeyEvents: true,
            listeners: {
                'valid': function(field) {
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

        var analisis = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '95%',
            maxLength: '19',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: true,
            fieldLabel: 'An&aacute;lisis',
            enableKeyEvents: true,
            valido: true,
            listeners: {
                'valid': function(field) {
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

        var nombreApellidoArrendatario = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '80%',
            maxLength: '60',
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            allowBlank: false,
            valido: true,
            fieldLabel: 'Nombres y apellidos',
            enableKeyEvents: true,
            listeners: {
                'valid': function(field) {
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

        var nroCI = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            anchor: '80%',
            maxLength: '11',
            minLength: '11',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false,
            fieldLabel: 'Nro. de identidad',
            enableKeyEvents: true
        });

        var nroContrato = new LOG.util.Prototipos.inputEntero({
            autoCreate: true,
            anchor: '80%',
            maxLength: '19',
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/,
            allowBlank: false,
            fieldLabel: 'Nro.Contrato',
            enableKeyEvents: true
        });

        var fechavencimiento = new Ext.form.DateField({
            anchor: '100%',
            autoCreate: true,
            fieldLabel: 'Fecha vencimiento',
            readOnly: true,
            format: 'd/m/Y',
            enableKeyEvents: true,
            name: 'fechafin',
            emptyText: _this.idioma.lbCbVacio
        });

        var fechacontable = new Ext.form.DateField({
            anchor: '100%',
            fieldLabel: 'Fecha contrato',
            readOnly: true,
            autoCreate: true,
            format: 'd/m/Y',
            name: 'fechacontable',
            enableKeyEvents: true,
            emptyText: _this.idioma.lbCbVacio
        });

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
        });

        comboocupacion.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
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
        });

        vinculacionlaboral.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
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
        });

        combotipoobra.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                combotipoobra.enable();
                if (records.length > 0) {
                    // _this.combotipoobra.setValue(st.data.items[0].data.idtipoobra);
                }
                Ext.getBody().unmask();
            }
        });
        var inventario = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
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
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        // _this.Buscar();
                    }
                },
                'valid': function(field) {
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

        var zonaDefensa = new LOG.util.Prototipos.inputTexto({
            autoCreate: true,
            anchor: '80%',
            maxLength: '19',
            /*regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
             maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,*/
            allowBlank: true,
            valido: true,
            fieldLabel: 'Zona de defensa',
            enableKeyEvents: true,
            listeners: {
                'valid': function(field) {
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

        var comboSelladaPor = new LOG.util.ComboBox({
            fieldLabel: 'Sellada por',
            allowBlank: true,
            name: 'idselladapor',
            valueField: 'idselladapor',
            displayField: 'denominacion',
            resizable: true,
            url: 'gestSelladaPor',
            autoLoad: false,
            typeAhead: true,
            emptyText: _this.idioma.lbCbVacio,
            mode: 'local',
            disabled: true,
            editable: false
        });

        comboSelladaPor.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
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
            hiddenName: 'idpertenecea',
            valueField: 'idpertenecea',
            name: 'idpertenecea',
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
        });

        var ejeX = new LOG.util.Prototipos.inputTexto({//Ext.form.NumberField
            maxLength: '14',
            anchor: '95%',
            allowBlank: true,
            fieldLabel: 'X',
            regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/, //
            enableKeyEvents: true
        });

        var ejeY = new LOG.util.Prototipos.inputTexto({
            maxLength: '14',
            anchor: '95%',
            allowBlank: true,
            fieldLabel: 'Y',
            regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/,
            enableKeyEvents: true
        });

        var ejeZ = new LOG.util.Prototipos.inputTexto({
            maxLength: '14',
            anchor: '95%',
            allowBlank: true,
            fieldLabel: 'Z',
            regex: /^[0-9\s]+(\.[0-9\s\.][0-9\s\.]*?)?$/, ///^[0-9]+(\.[0-9][0-9]?)?$/,
            enableKeyEvents: true
        });

        var enlaMontaña = new Ext.form.Checkbox({
            boxLabel: 'En la montaña',
            name: 'culminacion',
            hideLabel: false,
            inputValue: 1

        });

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
        });
        comboDesignacion.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
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
            name: 'idconstructiva',
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
        });

        comboCaracConstructiva.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    comboCaracConstructiva.enable();
                }
            }
        });

        var climatizacion = new Ext.form.Checkbox({
            boxLabel: _this.idioma.lbClimatizacion,
            name: 'idclimatizacion',
            hideLabel: false
        });

        var capital = new Ext.form.Checkbox({
            boxLabel: this.idioma.lbCapital,
            name: 'idcapital',
            hideLabel: false
        });

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
        });

        comboVentilacion.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    comboVentilacion.enable();
                }
            }
        });

        var comboComunicacion = new LOG.util.LovCombo({
            fieldLabel: _this.idioma.lbComunicacion,
            url: 'getNomComunicacion',
            hiddenName: 'idcomunicacion',
            valueField: 'idcomunicacion',
            displayField: 'denominacion',
            allowBlank: true,
            editable: false,
            typeAhead: false,
            anchor: '98%',
            mode: 'remote',
            emptyText: _this.idioma.lbSeleccione,
            autoLoad: false
                    /* anchor: '80%',
                     fieldLabel: _this.idioma.lbComunicacion,
                     allowBlank: true,
                     typeAhead: true,
                     mode: 'local',
                     url: 'getNomComunicacion',
                     triggerAction: 'all',
                     enableKeyEvents: true,            
                     editable: false,
                     autoLoad: false,            
                     emptyText: _this.idioma.lbSeleccione*/

        });

        comboComunicacion.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    comboComunicacion.enable();
                }
            }
        });

        var entradasHorizontal = new LOG.util.Prototipos.inputTexto({
            anchor: '60%',
            maxLength: '12',
            allowBlank: true,
            fieldLabel: _this.idioma.lbHorizontal,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var entradasVertical = new LOG.util.Prototipos.inputTexto({
            //autoCreate: true,
            anchor: '60%',
            maxLength: '12',
            allowBlank: true,
            fieldLabel: _this.idioma.lbVertical,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var entradasPuertas = new LOG.util.Prototipos.inputTexto({
            // autoCreate: true,
            anchor: '60%',
            maxLength: '12',
            allowBlank: true,
            fieldLabel: _this.idioma.lbPuertas,
            maskRe: /^([0-9]+ ?[0-9]*)+$/,
            regex: /^([0-9]+ ?[0-9]*)+$/
        });

        var transFormador = new LOG.util.Prototipos.inputTexto({
            anchor: '80%',
            maxLength: '255',
            allowBlank: true,
            fieldLabel: _this.idioma.lbTransformador,
            regex: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+ ?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/,
            maskRe: /^([a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]+?[a-zA-Z0-9\sÁÉÝÓÚÑáéíúóñ?]*)+$/
        });

        var comboSistemaElectrico = new LOG.util.ComboBox({
            anchor: '80%',
            fieldLabel: _this.idioma.lbSistEnergetico,
            allowBlank: true,
            name: 'idenergetico',
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
        });
        comboSistemaElectrico.getStore().on({
            'beforeload': function(st) {
                st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st, records) {
                if (records.length > 0) {
                    comboSistemaElectrico.enable();
                }
            }
        });

        var codigo1 = new LOG.util.Prototipos.inputTexto({
            anchor: '95%',
            maxLength: '19',
            fieldLabel: 'C&oacute;digo',
            autoCreate: true,
            allowBlank: true,
            /*maskRe: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
             regex: /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,*/
            enableKeyEvents: true
        });




        return [codigoCuentacontable, nombreCuentacontable, analisis, nombreApellidoArrendatario, nroCI, nroContrato,
            fechavencimiento, fechacontable, comboocupacion, vinculacionlaboral, combotipoobra, inventario,
            zonaDefensa, comboSelladaPor, comboPertenecea, ejeX, ejeY, ejeZ, enlaMontaña, comboDesignacion,
            comboCaracConstructiva, climatizacion, capital, comboVentilacion, comboComunicacion,
            entradasHorizontal, entradasVertical, entradasPuertas, transFormador, comboSistemaElectrico, codigo1
        ];
    },
    onAdicionar: function(title, gridEquipos, urlAux) {
        var _this = this;
        var arrRNnomostrar = Array();
        if (gridEquipos) {
            if (gridEquipos.getStorePrincipal().data.items.length > 0) {
                for (var i = 0; i < gridEquipos.getStorePrincipal().data.items.length; i++) {
                    arrRNnomostrar.push(gridEquipos.getStorePrincipal().data.items[i].data.idregnumactivo)
                }
            }
        } else {
            if (_this.gridEquipos.getStorePrincipal().data.items.length > 0) {
                for (var i = 0; i < _this.gridEquiposgetStorePrincipal().data.items.length; i++) {
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
            urlAux: (urlAux) ? urlAux : false,
            denominacioncolumnareporte: _this.denominacioncolumnareporte,
            doAction: function(records_seleccionadas, aplicar) {
                Ext.getBody().mask("Cargando...", 'x-mask-loading');

                if (records_seleccionadas.length > 0) {
                    var arrayRec = records_seleccionadas;

                    for (var i = 0; i < arrayRec.length; i++) {
                        var record = new Ext.data.Record({
                            descripcion: arrayRec[i].data.denominacion,
                            nroinventario: arrayRec[i].data.nroinventario,
                            idregnumactivo: arrayRec[i].data.idregnumerico

                        });
                        _this.datConfExp.gridEquipos.storePrincipal.add(record);
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
    onEliminar: function() {
        var _this = this;
        mostrarMensaje(2, _this.idioma.lbMsgElimCaracTecnicas, function eliminar(btnPresionado) {
            if (btnPresionado == 'ok') {

                var arraybd = new Array();
                var arrayvista = new Array();

                var seleccionados = _this.gridEquipos.smGridPrincipal.selections;
                for (var i = 0; i < seleccionados.items.length; i++) {
                    if (seleccionados.items[i].data.idequipomedio)
                        arraybd.push(seleccionados.items[i].data.idequipomedio);
                    else {
                        arrayvista.push(seleccionados.items[i]);
                    }
                }

                if (arraybd.length == 0) {
                    for (var i = 0; i < arrayvista.length; i++) {
                        _this.gridEquipos.storePrincipal.remove(arrayvista[i]);
                        _this.gridEquipos.storePrincipal.commitChanges();
                    }
                }
                else {
                    Ext.Ajax.request({
                        url: 'eliminarEquiposMediosVivienda',
                        method: 'POST',
                        params: {
                            ids: Ext.encode(arraybd),
                            idregnumerico: _this.dataregnumerico.data.idregnumerico
                        },
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.msg == 1) {

                                mostrarMensaje(1, _this.idioma.MsgEliminarCompartimentosViv);
                                _this.gridEquipos.storePrincipal.load({
                                    callback: function() {
                                        for (var i = 0; i < arrayvista.length; i++) {
                                            _this.gridEquipos.storePrincipal.remove(arrayvista[i]);
                                            _this.gridEquipos.storePrincipal.commitChanges();
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
    eliminarLocalesObrasIng: function(gridEquipos) {
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
                        callback: function(options, success, response) {
                            var rd = Ext.decode(response.responseText);
                            if (rd.msg == 1) {

                                mostrarMensaje(1, _this.idioma.MsgEliminadoDestinoLocales);
                                gridEquipos.getStorePrincipal().load({
                                    callback: function() {
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
});

Ext.LOG.moduloMedio.viviendaConstrCompartimento = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.gridEditable = true;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.viviendaEquipos = config.viviendaEquipos;
        this.ing = config.ing;
        this.otrosdatos = config.otrosdatos;
        this.urlBusquedaGridPrincipal = config.url;
        this.denominacioncolumnareporte = config.denominacioncolumnareporte;
        this.obrasAsoc = (config.obrasAsoc) ? config.obrasAsoc : false;

        Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.constructor.call(this, config);


    },
    initDefaultColumns: function() {
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
                        'valid': function(field) {
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
                function formatDate(value, c, record) {

                    if (typeof value == "object")
                    {
                        record.set('fecha', value.dateFormat('d/m/Y'));
                        return value.dateFormat('d/m/Y');
                    }

                    return value;
                }

                var datefieldFecha = new Ext.form.DateField({
                    anchor: '95%',
                    name: 'fecha',
                    readOnly: true,
                    format: 'd/m/Y'
                });

                var textfieldClave = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: /^([0-9]+ ?[0-9]*)+$/,
                    regex: /^([0-9]+ ?[0-9]*)+$/,
                    allowBlank: false
                });

                var textfieldNumero = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: (_this.clave) ? /^([0-9]+ ?[0-9]*)+$/ : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                    regex: (_this.clave) ? /^([0-9]+ ?[0-9]*)+$/ : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
                    allowBlank: false
                });

                var textfieldImporte = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    maskRe: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/,
                    allowBlank: false
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
                    dataIndex: 'estadobd',
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderFecha,
                    dataIndex: 'fecha',
                    width: 270,
                    default: true,
                    editable: true,
                    renderer: formatDate,
                    editor: datefieldFecha
                });
                this.addGridColumn({
                    header: (!_this.clave) ? _this.idioma.lbHeaderClave : _this.idioma.lbHeaderSubmayor,
                    dataIndex: 'clave',
                    width: 170,
                    default: true,
                    editable: true,
                    editor: textfieldClave,
                    hidden: (!_this.clave) ? true : false
                });
                this.addGridColumn({
                    header: (_this.clave) ? _this.idioma.lbHeaderNo : _this.idioma.lbHeaderDoc,
                    dataIndex: 'no',
                    width: 170,
                    default: true,
                    editable: true,
                    editor: textfieldNumero
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderImporte,
                    dataIndex: 'importe',
                    width: 270,
                    editable: true,
                    //autoExpand: true,
                    default: true,
                    editor: textfieldImporte
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderContabilidad,
                    dataIndex: 'contabilidad',
                    width: 270,
                    editable: false,
                    default: true,
                    // editor: triggerContabilidad
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderResponsableTecnico,
                    dataIndex: 'resptecnico',
                    width: 170,
                    default: false,
                    editable: true,
                    //  editor: triggerTecnico
                });
            }
            else {
                var textfieldVolumen = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: true,
                    regex: /^[0-9]+(\.[0-9][0-9]?)?$/
                });

                var textfieldTecho = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: true,
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
                    valueField: 'denominacion',
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
                        'select': function(combo, record, index) {
                            // var rc = _this.gpDestinosLocalesIngieneria.getSelectionModel().getSelected();
                            //  rc.set('idseccion', record.get('idseccion'));
                        }
                    }

                });
                comboeditorSeccion.getStore().on({
                    'beforeload': function(st) {
                        st.baseParams.idestructura = Ext.LOG.moduloMedio.ventana.identidad;
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

                var textfieldVolumen = new LOG.util.Prototipos.inputTexto({
                    anchor: '95%',
                    autoCreate: true,
                    allowBlank: true,
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
                    editor: textfieldVolumen,
                    width: 170,
                    default: true
                });
                this.addGridColumn({
                    header: _this.idioma.lbHeaderSeccion,
                    dataIndex: 'seccion',
                    editable: true,
                    autoExpand: false,
                    editor: comboeditorSeccion,
                    width: 170,
                    default: true
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

    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.btnAdicionaCpmpartimiento,
            handler: function() {

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
            tooltip: _this.idioma.EquipoyOtrosMediosbtnEliminarCaractEstado,
            disabled: true,
            handler: function() {
                mostrarMensaje(2, _this.idioma.lbMsgElimCaracTecnicas, function eliminar(btnPresionado) {
                    if (btnPresionado == 'ok') {

                        var arraybd = new Array();
                        var arrayvista = new Array();

                        var seleccionados = _this.smGridPrincipal.getSelections();

                        for (var i = 0; i < seleccionados.length; i++) {
                            if (seleccionados[i].data.idregnumerico)
                                arraybd.push(seleccionados[i].data.idcompartimiento);
                            else {
                                arrayvista.push(seleccionados[i]);
                            }
                        }

                        if (arraybd.length == 0) {
                            for (var i = 0; i < arrayvista.length; i++) {
                                _this.getStorePrincipal().remove(arrayvista[i]);
                                _this.getStorePrincipal().commitChanges();
                            }
                        }
                        else {
                            Ext.Ajax.request({
                                url: 'eliminarCompartimentoVivienda',
                                method: 'POST',
                                params: {
                                    ids: Ext.encode(arraybd),
                                    idregnumerico: _this.dataregnumerico.data.idregnumerico
                                },
                                callback: function(options, success, response) {
                                    var rd = Ext.decode(response.responseText);
                                    if (rd.msg == 1) {

                                        mostrarMensaje(1, _this.idioma.MsgEliminarCompartimentosViv);
                                        _this.getStorePrincipal().load({
                                            callback: function() {
                                                for (var i = 0; i < arrayvista.length; i++) {
                                                    _this.getStorePrincipal().remove(arrayvista[i]);
                                                    _this.getStorePrincipal().commitChanges();
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }));

    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function(st) {
                st.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
            },
            'load': function(st) {
                Ext.getBody().unmask();
                if (st.data.items.length == 0) {
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
                }
            }
        });

        this.smGridPrincipal.on({
            'rowselect': function(sm) {
                _this.listaBotones.getItem(1).enable();
                // _this.btnDelCompartimentos.enable();
            },
            'rowdeselect': function(sm) {
                _this.listaBotones.getItem(1).disable();
            },
            'selectionchange': function(sm) {
                var selection = sm.getSelections();
                _this.listaBotones.getItem(1).setDisabled((selection.length >= 1) ? false : true);
            }

        });
        this.getStorePrincipal().load();
        return vista;
    }
});
Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.urlBusquedaGridPrincipal = 'cargarGridNomCompartimiento';
        Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = (this.title) ? this.title : this.idioma.btnAdicionaCpmpartimiento;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().setSize(600, 400);


    },
    initDefaultColumns: function() {
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
    initDefaultButtons: function() {
        var _this = this;

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
            disabled: true,
            handler: function() {
                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                if (_this.otrosdatos) {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();

                        if (arrayRec.length > 0)
                        {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idotrasinstalacionesviv: arrayRec[i].data.idotrasinstalacionesviv,
                                    cantidad1: 0
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
                        if (arrayRec.length > 0)
                        {
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
            handler: function() {
                Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                if (_this.otrosdatos) {
                    if (_this.smGridPrincipal.getSelections()) {

                        var arrayRec = _this.smGridPrincipal.getSelections();

                        if (arrayRec.length > 0)
                        {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    denominacion: arrayRec[i].data.denominacion,
                                    idotrasinstalacionesviv: arrayRec[i].data.idotrasinstalacionesviv,
                                    cantidad1: 0
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
                        if (arrayRec.length > 0)
                        {
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
            handler: function() {
                this.close();
            }
        });

    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function(st) {
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
                    // console.info(idotrasinstlaciones)
                }

                st.initBaseParams.idregnumerico = _this.idregnumerico;
                if (_this.otrosdatos) {
                    st.initBaseParams.otrasinstalaciones = true;
                }

                st.initBaseParams.idestructuracomun = Ext.LOG.moduloMedio.ventana.identidad;
            },
            'load': function(st) {
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
                st.baseParams.idestructuracomun = Ext.LOG.moduloMedio.ventana.identidad;
                // Ext.getBody().unmask();
                if (st.data.items.length == 0)
                    mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
            }
        });

        this.smGridPrincipal.on({
            'rowselect': function(sm) {
                if (sm.selections.items.length > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
            },
            'rowdeselect': function(sm) {
                if (sm.selections.items.length == 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
        });
        this.getStorePrincipal().load();
        return vista;
    },
});
Ext.LOG.moduloMedio.winGetRegNumericosService = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'ventana';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.region = 'center';
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
        this.idestructura = config.idestructura;

//$this->uiParams
    },
    initDefaultColumns: function() {
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

            this.addGridColumn({
                header: _this.idioma.lbCmCodigo,
                dataIndex: 'codigo',
                autoExpand: true,
                width: 90,
                default: true,
            });
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
            this.addGridColumn({
                header: _this.idioma.lbCmNacionalidad,
                dataIndex: 'nacionalidad',
                autoExpand: true,
                width: 90,
                default: true,
            });
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
                renderer: function(value, metaData) {
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


    },
    initDefaultButtons: function() {
        var _this = this;
        if (_this.denominacioncolumnareporte == "vivienda") {
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
                disabled: true,
                handler: function() {

                    Ext.MessageBox.wait('Enviando datos', 'Por favor espere...' || '...');
                    var records = _this.smGridPrincipal.getSelections();
                    _this.doAction(records, false);
                    //_this.close();
                    Ext.MessageBox.hide();
                }
            });
            LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(1), {
                disabled: true,
                handler: function() {
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
                handler: function() {
                    if (_this.getSmPrincipal().hasSelection()) {
                        var arrayRec = _this.getSmPrincipal().getSelections();
                        if (arrayRec.length > 0) {
                            for (var i = 0; i < arrayRec.length; i++) {
                                var record = new Ext.data.Record({
                                    tipo: arrayRec[i].data.denominacion,
                                    idlocal: arrayRec[i].data.idlocal,
                                    volumen: '',
                                    seccion: '',
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
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), {
            handler: function() {
                this.close();
            }
        });
    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimentoAdd.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function(st) {

                st.initBaseParams.arrRNnomostrar = Ext.encode(_this.arrRNnomostrar);
                st.initBaseParams.idestructura = _this.idestructura;
                st.initBaseParams.idnaturaleza = -3;
            },
            'load': function(st) {

            }
        });

        this.smGridPrincipal.on({
            'rowselect': function(sm) {
                if (sm.selections.items.length > 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                }
            },
            'rowdeselect': function(sm) {
                if (sm.selections.items.length == 0) {
                    _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                    _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            },
        });
        this.getStorePrincipal().load();
        return vista;
    },
    activarCategoria: function(val, metaData, record, rowIndex, colIndex, store) {
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
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/modulo/index.php/gestmodulos';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.autoLoad = false;
        this.idioma = config.idioma;
        this.gridEditable = true;
        this.region = 'center';
        this.dataregnumerico = config.dataregnumerico;
        this.viviendaEquipos = config.viviendaEquipos;
        this.otrosdatos = config.otrosdatos;
        this.urlBusquedaGridPrincipal = config.url;
        this.denominacioncolumnareporte = config.denominacioncolumnareporte;
        this.obrasAsoc = (config.obrasAsoc) ? config.obrasAsoc : false;

        Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.constructor.call(this, config);


    },
    initDefaultColumns: function() {
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
                'valid': function(field) {
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

    },
    render: function() {
        var _this = this;
        var vista = Ext.LOG.moduloMedio.viviendaConstrCompartimento.superclass.render.call(this);

        this.getStorePrincipal().on({
            'beforeload': function(st) {
                st.initBaseParams.idregnumerico = _this.dataregnumerico.data.idregnumerico;
            },
            'load': function(st) {
                Ext.getBody().unmask();
                if (st.data.items.length == 0) {
                    //  mostrarMensaje(2, _this.idioma.MsgNoExistenDatosGrid);
                }
            }
        });
        this.getStorePrincipal().load();
        return vista;
    }
});
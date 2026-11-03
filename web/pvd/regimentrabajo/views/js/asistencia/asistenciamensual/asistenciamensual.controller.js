Ext.ns('Pvd.ControlAsistencia.Asistenciamensual');
//Controlador de la vista del componente
Pvd.ControlAsistencia.Asistenciamensual.Controlador = {

    init: function (idioma, vista, modelo) {
        this.idestructura = perfil.idestructuracomun;
        this.denomestructura = perfil.denomestructuracomun;
        var self = this;
        var idtipo = null;
        var _self = this;
        this.idconcepto = null;
        this.fecha = new Date();
        var hora;
        var minutos;
        var segundos;
        hora = this.fecha.getHours();
        minutos = this.fecha.getMinutes();
        segundos = this.fecha.getSeconds();
        this.horareporte = hora + ':' + minutos + ':' + segundos;
        this.annoactual = this.fecha.getFullYear();
        var tipoRango;
        this.stpersonasausen;
        _self.stNewapa;
        this.personas;


        if (vista.tipoanalisis.getValue() == 2) {
            vista.comboMeses.setVisible(false);
            vista.comboYear.setVisible(false);
            vista.lbmes.setVisible(false);
            vista.lbanno.setVisible(false);

            vista.desde.setVisible(true);
            vista.hasta.setVisible(true);
            vista.lbfdesde.setVisible(true);
            vista.lbfhasta.setVisible(true);
        } else {
            vista.comboMeses.setVisible(true);
            vista.comboYear.setVisible(true);
            vista.lbmes.setVisible(true);
            vista.lbanno.setVisible(true);

            vista.desde.setVisible(false);
            vista.hasta.setVisible(false);
            vista.lbfdesde.setVisible(false);
            vista.lbfhasta.setVisible(false);
        }

        Ext.Ajax.request({
            url: 'isPeriodoConfigurado',
            method: 'POST',
            params: {
                anno: self.annoactual
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                self.tipoRango = responseData;
                if (responseData == 1) {
                    vista.tiporango.setVisible(true);
                    vista.lbtexto.setVisible(true);
                }
                else if (responseData == 2) {
                    vista.tiporango.setVisible(false);
                    vista.lbtexto.setVisible(false);
                }
                else if (responseData == 0) {
                    vista.tiporango.setVisible(false);
                    vista.lbtexto.setVisible(false);

                }
            }
        });

        vista.btnFondoTiempo.menu.items.items[0].setHandler(function () {
            modelo.storeCausas.load( {params: {idconcepto: -1}});
            vista.winFondoTiempo.show();
            vista.listadoConceptos.getSelectionModel().clearSelections();
            vista.listadoCausas.getSelectionModel().clearSelections();
        }, this);

        vista.btnCancelarFT.on('click', function () {
            vista.winFondoTiempo.hide();
        }, this);

        vista.btnAceptarFT.on('click', function () {
            guardar();
            vista.winFondoTiempo.hide();
        }, this);

        vista.btnAplicarFT.on('click', function () {
            guardar();
        }, this);

        function guardar() {
            var causas = new Array();
            if (vista.smgridCausas.getCount() > 0) {
                Ext.each(vista.listadoCausas.getSelectionModel().getSelections(), function (rec) {
                    causas.push(rec.data.idcausa);
                });
            }
            if (vista.smgridConceptos.getCount() > 0)
                var concepto = vista.listadoConceptos.getSelectionModel().getSelected().data.idconcepto;
            Ext.getBody().mask(idioma.lbMsgmaskGuardar);
            Ext.Ajax.request({
                url: 'setConceptoCausas',
                params: {
                    causas: Ext.encode(causas),
                    concepto: concepto
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                },
                success: function () {
                    mostrarMensaje(1, idioma.lbMsgGuardarExito);
                }
            });
        }

        modelo.storeCausas.on('load', function (_this, records, opt) {
            var seleccion = new Array();
            Ext.each(records, function (rec) {
                if (rec.data.check == 1) {
                    seleccion.push(rec);
                }
            });
            vista.listadoCausas.selModel.selectRecords(seleccion);
        });

        vista.smgridConceptos.on('selectionchange', function (th) {
            modelo.storeCausas.load(
                {params: {idconcepto: vista.listadoConceptos.getSelectionModel().getSelected().data.idconcepto}}
            );
        });

        vista.btnFondoTiempo.menu.items.items[1].setHandler(function () {
            vista.winTrimestre.show();
        }, this);

        vista.btnCancelarTrim.on('click', function () {
            vista.winTrimestre.hide();
        }, this);

        vista.btnAceptarTrim.on('click', function () {
            var params = Ext.urlEncode({
                trimestre: vista.trimestre.getValue(),
                denomtrimestre: vista.trimestre.getRawValue(),
                year: vista.comboYearFT.getValue(),
                idestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().id,
            });

            var idIframeNominal = Ext.id();
            new Ext.Window({
                title: 'Modelo 241- 488-02 Utilización del Fondo de Tiempo',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframeNominal,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                            '/pvd/regimentrabajo/index.php/asistenciamensual/modelofondotiempoPdf?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte en formato PDF.');
            document.getElementById(idIframeNominal).onload = function () {
                PVD.ocultarMascara('rep01');
            }
            vista.winTrimestre.hide();
        }, this);




        modelo.storeMeses.on('load', function (th, recs, opt) {
            vista.comboMeses.setValue(vista.fecha.getMonth() + 1);
        });

        modelo.stlistadoCausas.load();

        vista.tabs.on('load', function (th, recs, opt) {
            vista.comboMeses.setValue(vista.fecha.getMonth() + 1);
        });

        this.smPersonasapa = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        vista.estructura.tree.root.on('expand', function (nodo) {
            vista.estructura.tree.getSelectionModel().select(nodo.childNodes[0]);
            self.idtipo = nodo.childNodes[0].attributes.idtipo;
            self.idconcepto = self.idtipo;
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), perfil.idestructuracomun, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), perfil.idestructuracomun, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
            GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        });

        vista.tipoanalisis.on('select', function (cb, r, i) {
            if (vista.tipoanalisis.getValue() == 2) {
                vista.comboMeses.setVisible(false);
                vista.comboYear.setVisible(false);
                vista.lbmes.setVisible(false);
                vista.lbanno.setVisible(false);

                vista.desde.setVisible(true);
                vista.hasta.setVisible(true);
                vista.lbfdesde.setVisible(true);
                vista.lbfhasta.setVisible(true);

                vista.tiporango.setVisible(false);
                vista.lbtexto.setVisible(false);

            } else {
                vista.comboMeses.setVisible(true);
                vista.comboYear.setVisible(true);
                vista.lbmes.setVisible(true);
                vista.lbanno.setVisible(true);

                vista.desde.setVisible(false);
                vista.hasta.setVisible(false);
                vista.lbfdesde.setVisible(false);
                vista.lbfhasta.setVisible(false);

                if (self.tipoRango == 1) {
                    vista.tiporango.setVisible(true);
                    vista.lbtexto.setVisible(true);
                }
                else if (self.tipoRango == 2) {
                    vista.tiporango.setVisible(false);
                    vista.lbtexto.setVisible(false);
                }
                else if (self.tipoRango == 0) {
                    vista.tiporango.setVisible(false);
                    vista.lbtexto.setVisible(false);
                }
            }
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetAPA(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
            GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        });

        vista.estructura.on('dameseleccion', function (obj, data) {
            //vista.btnCertificar.enable();
            if (data == false) {
                this.idestructura = vista.estructura.inicial;
                this.idconcepto = self.idtipo;
            }
            else {
                this.idestructura = data.id;
                this.idconcepto = data.attributes.idconcepto;
                this.denomestructura = data.attributes.denominacion;
            }
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), this.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), this.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
            GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        }.createDelegate(this));

        this.years = new Array();
        var startYear = 2014;
        var endYear = vista.fecha.getFullYear() + 3; // mostrar hasta 3 años por encima del actual
        for (var x = startYear; x <= endYear; x++) {
            this.years.push([x, x]);
        }
        modelo.storeYear.loadData(this.years);

        vista.tiporeporte.on('select', function (cb, r, i) {
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        });

        vista.ListadoPersonas.on('afteredit', function (e) {
            if (vista.smPersonas.getCount() > 1) {
                vista.smPersonas.each(function (rec, ind) {
                    if (e.field === "fdesde" || e.field === "fhasta") {
                        rec.set(e.field, e.value.dateFormat('d/m/Y'));
                    }
                    else {
                        rec.set(e.field, e.value);
                    }
                });
            }
            else {
                if (e.field === "fdesde" || e.field === "fhasta") {
                    e.record.set(e.field, e.value.dateFormat('d/m/Y'));
                }
                else {
                    e.record.set(e.field, e.value);
                }
            }
        });
        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        this.smHistorico = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {}
        });

        function GetApa(month, year, idestructura, filtro, idconcepto, fdesde, fhasta) {
            Ext.Ajax.timeout = 90000000;
            Ext.Ajax.request({
                url: 'getapa',
                method: 'POST',
                params: {
                    causas: 1,
                    idestructura: idestructura,
                    mes: month,
                    year: year,
                    start: 0,
                    limit: 20,
                    filtro: filtro,
                    idconcepto: idconcepto,
                    quincena: vista.tiporango.value,
                    analisis: vista.tipoanalisis.value,
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue()
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    if(responseData.cod == 3){
                       // _self.stNewapa.removeAll();
                    }
                    var causasAgrupadas = responseData.causas;
                    var tienecategoria = responseData.tienecategoria;
                    var nocturnidad = responseData.nocturnidad;
                    var nocturnidadfer = responseData.nocturnidadfer;
                    var columns = new Array();
                    var indexs = new Array();
                    var continentGroupRow = new Array();
                    columns.push(new Ext.grid.RowNumberer());
                    // columns.push({
                    //     dataIndex: 'foto',
                    //     sortable: true,
                    //     header: 'Foto',
                    //     hiddeable:false,
                    //     width: 60,
                    //     renderer: representarImagen
                    // });
                    columns.push({
                        dataIndex: 'numid',
                        sortable: true,
                        header: 'No. Identidad',
                        hiddeable: false,
                        width: 100
                    });
                    columns.push({
                        dataIndex: 'nombreapellidos',
                        sortable: true,
                        header: 'Nombre y apellidos',
                        hiddeable: false,
                        width: 200
                    });
                    columns.push({
                        dataIndex: 'denomcargo',
                        sortable: true,
                        header: 'Cargo',
                        width: 250,
                        hiddeable: false
                    });
                    columns.push({
                        dataIndex: 'denomarea',
                        sortable: true,
                        header: 'Entidad',
                        width: 200,
                        hidden: true,
                        hiddeable: false
                    });

                    //indexs.push({name:'foto'});
                    indexs.push({name: 'numid'});
                    indexs.push({name: 'nombreapellidos'});
                    indexs.push({name: 'denomcargo'});
                    indexs.push({name: 'denomarea'});

                    if (tienecategoria) {
                        continentGroupRow.push({header: ' ', align: 'center', colspan: 6});
                        Ext.each(causasAgrupadas, function (causaAgrupada) {
                            continentGroupRow.push({
                                header: causaAgrupada['denom'],
                                align: 'center',
                                colspan: causaAgrupada['childrens'].length
                            })
                            Ext.each(causaAgrupada['childrens'], function (causa) {
                                columns.push({
                                    dataIndex: causa['dataindex'] + '_horas',
                                    sortable: false,
                                    header: causa['denom'],
                                    width: 60,
                                    tooltip: causa['denominacion']
                                });
                                indexs.push({name: causa['dataindex'] + '_horas'});
                            });
                        });
                        continentGroupRow.push({header: ' ', align: 'center', colspan: 6});
                        var group = new Ext.ux.grid.ColumnHeaderGroup({
                            rows: [continentGroupRow]
                        });
                    }
                    else {
                        if (causasAgrupadas != null && causasAgrupadas.length > 0) {
                            Ext.each(causasAgrupadas, function (causa) {
                                columns.push({
                                    dataIndex: causa['dataindex'] + '_horas',
                                    sortable: false,
                                    header: causa['denom'],
                                    width: 60,
                                    tooltip: causa['denominacion']
                                });
                                indexs.push({name: causa['dataindex'] + '_horas'});
                            });
                        }
                    }
                    columns.push({
                        dataIndex: 'total',
                        sortable: true,
                        header: 'Total causas',
                        width: 80,
                        hiddeable: false
                    });

                    columns.push({
                        dataIndex: 'sc',
                        sortable: false,
                        header: 'Sin Causa',
                        width: 80,
                        hidden: false,
                        hiddeable: false
                    });
                    columns.push({
                        dataIndex: 'ft',
                        sortable: true,
                        header: 'Fondo de tiempo',
                        hiddeable: false,
                        width: 100,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'trt',
                        sortable: false,
                        header: 'Tiempo real trabajado',
                        width: 120,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'hp',
                        sortable: false,
                        header: 'Horas perdidas',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'he',
                        sortable: false,
                        header: 'Horas extras',
                        width: 75,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'diaslab',
                        sortable: false,
                        header: 'Días laborables',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'diastrab',
                        sortable: false,
                        header: 'Días trabajados',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'hf',
                        sortable: false,
                        header: 'Horas feriadas',
                        width: 85,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'hft',
                        sortable: false,
                        header: 'Horas feriadas trabajadas',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'hte',
                        sortable: false,
                        header: 'Horas de trabajo extraordinario',
                        width: 175,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columns.push({
                        dataIndex: 'hrl',
                        sortable: false,
                        header: 'Horas de receso laboral',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    if (responseData.trtmilitares == 1) {
                        columns.push({
                            dataIndex: 'diastrabmilit',
                            sortable: false,
                            header: 'Días a pagar a Oficiales',
                            width: 160,
                            hidden: false,
                            hiddeable: false,
                            renderer: Estilo
                        });
                    }

                    Ext.each(nocturnidad, function (noct) {
                        columns.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct ' + noct['denominacion'],
                            width: 100,
                            renderer: Estilo
                        });
                        indexs.push({
                            name: noct['idnocturnidad']
                        });
                    });
                    Ext.each(nocturnidadfer, function (noct) {
                        columns.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct-Fer ' + noct['denominacion'],
                            width: 110,
                            renderer: Estilo
                        });
                        indexs.push({
                            name: noct['idnocturnidad']
                        });
                    });

                    indexs.push({name: 'total'});
                    indexs.push({name: 'sc'});
                    indexs.push({name: 'ft'});
                    indexs.push({name: 'trt'});
                    indexs.push({name: 'hp'});
                    indexs.push({name: 'he'});
                    indexs.push({name: 'diaslab'});
                    indexs.push({name: 'diastrab'});
                    indexs.push({name: 'hf'});
                    indexs.push({name: 'hft'});
                    indexs.push({name: 'hte'});
                    indexs.push({name: 'hrl'});
                    if (responseData.trtmilitares == 1) {
                        indexs.push({name: 'diastrabmilit'});
                    }

                    _self.cmNewapa = new Ext.grid.ColumnModel(columns);
                    var plantillaapa = new Ext.data.Record.create(indexs);
                    var myReaderapa = new Ext.data.JsonReader({
                        totalProperty: "cantidad",
                        root: "datos"
                    }, plantillaapa);

                    _self.stNewapa = new Ext.data.GroupingStore({
                        url: 'getapa',
                        baseParams: {
                            causas: 1,
                            idestructura: idestructura,
                            mes: month,
                            year: year,
                            // start: 0,
                            // limit: 20,
                            idconcepto: idconcepto,
                            quincena: vista.tiporango.value,
                            analisis: vista.tipoanalisis.value,
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue()
                        },
                        reader: myReaderapa,
                        sortInfo: {field: 'denomarea', direction: "ASC"},
                        groupField: 'denomarea',
                        remoteSort: true,
                        listeners: {
                            load: function (st, recs, opt) {
                                if (recs.length == 0) {
                                    // mostrarMensaje(3, idioma.MsjErrorConfiguracionUsser, function () {
                                    // });
                                }
                            }
                        }
                    });
                    var smListadoApa = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    });

                    var ListadoNewApa1 = new Ext.grid.GridPanel({
                        id: 'listadonewapa1',
                        store: _self.stNewapa,
                        loadMask: {msg: idioma.lbMsgmasklistado},
                        width: '100%',
                        height: 500,
                        view: new Ext.grid.GroupingView({
                            showGroupName: false,
                            groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
                        }),
                        sm: smListadoApa,
                        plugins: (tienecategoria) ? [group] : [],
                        cm: _self.cmNewapa,
                        bbar: new Ext.PagingToolbar({
                            pageSize: 20,
                            store: _self.stNewapa,
                            displayInfo: true,
                            displayMsg: 'Resultados {0} - {1} de {2}',
                            emptyMsg: "Ning&uacute;n resultado para mostrar"
                        })
                    });
                    vista.tabs.getItem('apa').add(ListadoNewApa1);
                    vista.tabs.getItem('apa').doLayout();
                    vista.tabs.getItem('apa').enable();

                    _self.stNewapa.loadData({
                        datos: responseData.datos,
                        cantidad: responseData.cantidad
                    }, true);
                }
            });
        }

        function GetFechas(month, year, idestructura, filtro, idconcepto, fdesde, fhasta, certificacion) {
            Ext.Ajax.timeout = 90000000;
            vista.Maskara.show();
            Ext.Ajax.request({
                url: 'getreporteasistenciamensual',
                method: 'POST',
                params: {
                    idestructura: idestructura,
                    mes: month,
                    year: year,
                    idconcepto: idconcepto,
                    start: 0,
                    limit: 20,
                    filtro: filtro,
                    quincena: vista.tiporango.value,
                    tiporeporte: vista.tiporeporte.value,
                    analisis: vista.tipoanalisis.value,
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue(),
                    certificacion: certificacion
                },
                callback: function (options, success, response) {
                    vista.Maskara.hide();
                    var responseData = Ext.decode(response.responseText);
                    if(responseData.cod == 3){
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                        self.stpersonasausen.removeAll();
                    }
                    var columnas = new Array();
                    var indices = new Array();
                    //columnas.push(new Ext.grid.RowNumberer());
                    columnas.push(self.smPersonas);
                    /*columnas.push({
                     dataIndex: 'foto',
                     sortable: true,
                     header: 'Foto',
                     width: 60,
                     renderer: representarImagen
                     });*/
                    columnas.push({
                        dataIndex: 'numid',
                        sortable: true,
                        header: 'No. Identidad',
                        hiddeable: false,
                        width: 100,
                        //renderer:EstiloCeldas
                    });
                    columnas.push({
                        dataIndex: 'idpersona',
                        sortable: false,
                        header: 'idpersona',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'nombreapellidos',
                        sortable: true,
                        header: 'Nombre y apellidos',
                        width: 200
                    });
                    columnas.push({
                        dataIndex: 'denomcargo',
                        sortable: true,
                        header: 'Cargo',
                        width: 250,
                        hiddeable: false
                    });
                    columnas.push({
                        dataIndex: 'entidad',
                        sortable: false,
                        header: 'Entidad',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'denomarea',
                        sortable: false,
                        header: 'denomarea',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'certificado',
                        sortable: false,
                        header: 'Certificado',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'aprobado',
                        sortable: false,
                        header: 'Aprobado',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'otrodia',
                        sortable: false,
                        header: 'otrodia',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    indices.push({name: 'numid'});
                    indices.push({name: 'idpersona'});
                    //indices.push({name:'foto'});
                    indices.push({name: 'nombreapellidos'});
                    indices.push({name: 'denomcargo'});
                    indices.push({name: 'entidad'});
                    indices.push({name: 'denomarea'});
                    indices.push({name: 'certificado'});
                    indices.push({name: 'aprobado'});
                    indices.push({name: 'otrodia'});

                    Ext.each(responseData.columnas, function (col) {
                        columnas.push({
                            dataIndex: col,
                            sortable: false,
                            header: col,
                            width: 65,
                            renderer: EstiloColumn
                        });
                        indices.push({
                            name: col
                        });
                    });

                    columnas.push({
                        dataIndex: 'ft',
                        sortable: true,
                        header: 'Fondo de tiempo',
                        hiddeable: false,
                        width: 100,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'trt',
                        sortable: false,
                        header: 'Tiempo real trabajado',
                        width: 120,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hp',
                        sortable: false,
                        header: 'Horas perdidas',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'he',
                        sortable: false,
                        header: 'Horas extras',
                        width: 75,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'diaslab',
                        sortable: false,
                        header: 'Días laborables',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'diastrab',
                        sortable: false,
                        header: 'Días trabajados',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hf',
                        sortable: false,
                        header: 'Horas feriadas',
                        width: 85,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hft',
                        sortable: false,
                        header: 'Horas feriadas trabajadas',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hte',
                        sortable: false,
                        header: 'Horas de trabajo extraordinario',
                        width: 175,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hrl',
                        sortable: false,
                        header: 'Horas de receso laboral',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });

                    if (responseData.trtmilitares == 1) {
                        columnas.push({
                            dataIndex: 'diastrabmilit',
                            sortable: false,
                            header: 'Días a pagar a Oficiales',
                            width: 140,
                            hidden: false,
                            hiddeable: false,
                            renderer: Estilo
                        });
                    }


                    Ext.each(responseData.nocturnidad, function (noct) {
                        columnas.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct ' + noct['denominacion'],
                            width: 100,
                            renderer: Estilo
                        });
                        indices.push({
                            name: noct['idnocturnidad']
                        });
                    });

                    Ext.each(responseData.nocturnidadfer, function (noct) {
                        columnas.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct-Fer ' + noct['denominacion'],
                            width: 110,
                            renderer: Estilo
                        });
                        indices.push({
                            name: noct['idnocturnidad']
                        });
                    });

                    indices.push({name: 'ft'});
                    indices.push({name: 'trt'});
                    indices.push({name: 'hp'});
                    indices.push({name: 'he'});
                    indices.push({name: 'diaslab'});
                    indices.push({name: 'diastrab'});
                    indices.push({name: 'hf'});
                    indices.push({name: 'hft'});
                    indices.push({name: 'hte'});
                    indices.push({name: 'hrl'});
                    if (responseData.trtmilitares == 1) {
                        indices.push({name: 'diastrabmilit'});
                    }

                    var cmPersonasausen = new Ext.grid.ColumnModel(columnas);
                    var plantilla = new Ext.data.Record.create(indices);

                    var myReader = new Ext.data.JsonReader({
                        totalProperty: "cantidad",
                        root: "datos"
                    }, plantilla);

                    self.stpersonasausen = new Ext.data.GroupingStore({
                        url: 'getreporteasistenciamensual',
                        baseParams: {
                            idestructura: idestructura,
                            mes: month,
                            year: year,
                            idconcepto: idconcepto,
                            quincena: vista.tiporango.value,
                            tiporeporte: vista.tiporeporte.value,
                            analisis: vista.tipoanalisis.value,
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue(),
                            certificacion: vista.certificacion.value
                        },
                        reader: myReader,
                        sortInfo: {field: 'denomarea', direction: "ASC"},
                        groupField: 'denomarea',
                        remoteGroup: true,
                        remoteSort: true,
                        listeners: {
                            load: function (st, recs, opt) {
                                if (recs.length == 0) {
                                    mostrarMensaje(1, 'No existen datos que mostrar.');
                                    vista.btnCertificar.disable();
                                    // vista.btnQuitarCertificar.disable();
                                    vista.btnEnviarCorreo.disable();
                                    vista.btnAprobar.disable();
                                }
                            }
                        }
                    });
                    vista.ListadoPersonas.getBottomToolbar().bind(self.stpersonasausen);
                    vista.ListadoPersonas.reconfigure(self.stpersonasausen, cmPersonasausen);
                    vista.ListadoPersonas.doLayout();
                    self.stpersonasausen.loadData({
                        datos: responseData.datos,
                        cantidad: responseData.cantidad
                    }, true);

                    if(responseData.aprobado == 1){
                        vista.labelaprobado.show();
                        vista.btnCertificar.disable();
                        vista.btnAprobar.menu.items.items[0].disable();
                        vista.btnAprobar.menu.items.items[1].enable();
                        vista.labelaprobado.setText('<span style="color:#2da2fd"><b>' + 'PERÍODO APROBADO' + '</b></span>',false);
                    }else{
                        vista.labelaprobado.hide();
                        vista.btnCertificar.enable();
                        vista.btnAprobar.menu.items.items[0].enable();
                        vista.btnAprobar.menu.items.items[1].disable();
                        vista.labelaprobado.setText('<span style="color:#c6070c;"><b>' + 'PERÍODO NO APROBADO' + '</b></span>',false);
                    }
                }
            });
        }

        function GetHistorico(month, year, idestructura, filtro, idconcepto, fdesde, fhasta, certificacion) {
            Ext.Ajax.timeout = 90000000;
            //vista.Maskara.show();
            Ext.Ajax.request({
                url: 'gethistorico',
                method: 'POST',
                params: {
                    idestructura: idestructura,
                    mes: month,
                    year: year,
                    idconcepto: idconcepto,
                    start: 0,
                    limit: 20,
                    filtro: filtro,
                    quincena: vista.tiporango.value,
                    tiporeporte: vista.tiporeporte.value,
                    analisis: vista.tipoanalisis.value,
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue(),
                    certificacion: certificacion
                },
                callback: function (options, success, response) {
                    //vista.Maskara.hide();
                    var responseData = Ext.decode(response.responseText);
                    if(responseData.cod == 3){
                        //self.sthistorico.removeAll();
                    }
                    var columnas = new Array();
                    var indices = new Array();
                    //columnas.push(new Ext.grid.RowNumberer());
                    columnas.push(self.smHistorico);
                    /*columnas.push({
                     dataIndex: 'foto',
                     sortable: true,
                     header: 'Foto',
                     width: 60,
                     renderer: representarImagen
                     });*/
                    columnas.push({
                        dataIndex: 'numid',
                        sortable: true,
                        header: 'No. Identidad',
                        hiddeable: false,
                        width: 100,
                        //renderer:EstiloCeldas
                    });
                    columnas.push({
                        dataIndex: 'idpersona',
                        sortable: false,
                        header: 'idpersona',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'nombreapellidos',
                        sortable: true,
                        header: 'Nombre y apellidos',
                        width: 200
                    });
                    columnas.push({
                        dataIndex: 'denomcargo',
                        sortable: true,
                        header: 'Cargo',
                        width: 250,
                        hiddeable: false
                    });
                    columnas.push({
                        dataIndex: 'entidad',
                        sortable: false,
                        header: 'Entidad',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'denomarea',
                        sortable: false,
                        header: 'denomarea',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'certificado',
                        sortable: false,
                        header: 'Certificado',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'aprobado',
                        sortable: false,
                        header: 'Aprobado',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'otrodia',
                        sortable: false,
                        header: 'otrodia',
                        width: 70,
                        hidden: true,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'estado',
                        sortable: false,
                        header: 'Estado',
                        width: 70,
                        hideable: false
                    });
                    columnas.push({
                        dataIndex: 'hasta',
                        sortable: false,
                        header: 'Hasta',
                        width: 70,
                        hideable: false
                    });
                    indices.push({name: 'numid'});
                    indices.push({name: 'idpersona'});
                    //indices.push({name:'foto'});
                    indices.push({name: 'nombreapellidos'});
                    indices.push({name: 'denomcargo'});
                    indices.push({name: 'entidad'});
                    indices.push({name: 'denomarea'});
                    indices.push({name: 'certificado'});
                    indices.push({name: 'aprobado'});
                    indices.push({name: 'otrodia'});
                    indices.push({name: 'estado'});
                    indices.push({name: 'hasta'});

                    Ext.each(responseData.columnas, function (col) {
                        columnas.push({
                            dataIndex: col,
                            sortable: false,
                            header: col,
                            width: 65,
                            renderer: EstiloColumn
                        });
                        indices.push({
                            name: col
                        });
                    });

                    columnas.push({
                        dataIndex: 'ft',
                        sortable: true,
                        header: 'Fondo de tiempo',
                        hiddeable: false,
                        width: 100,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'trt',
                        sortable: false,
                        header: 'Tiempo real trabajado',
                        width: 120,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hp',
                        sortable: false,
                        header: 'Horas perdidas',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'he',
                        sortable: false,
                        header: 'Horas extras',
                        width: 75,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'diaslab',
                        sortable: false,
                        header: 'Días laborables',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'diastrab',
                        sortable: false,
                        header: 'Días trabajados',
                        width: 90,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hf',
                        sortable: false,
                        header: 'Horas feriadas',
                        width: 85,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hft',
                        sortable: false,
                        header: 'Horas feriadas trabajadas',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hte',
                        sortable: false,
                        header: 'Horas de trabajo extraordinario',
                        width: 175,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });
                    columnas.push({
                        dataIndex: 'hrl',
                        sortable: false,
                        header: 'Horas de receso laboral',
                        width: 140,
                        hidden: false,
                        hiddeable: false,
                        renderer: Estilo
                    });

                    if (responseData.trtmilitares == 1) {
                        columnas.push({
                            dataIndex: 'diastrabmilit',
                            sortable: false,
                            header: 'Días a pagar a Oficiales',
                            width: 140,
                            hidden: false,
                            hiddeable: false,
                            renderer: Estilo
                        });
                    }


                    Ext.each(responseData.nocturnidad, function (noct) {
                        columnas.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct ' + noct['denominacion'],
                            width: 100,
                            renderer: Estilo
                        });
                        indices.push({
                            name: noct['idnocturnidad']
                        });
                    });

                    Ext.each(responseData.nocturnidadfer, function (noct) {
                        columnas.push({
                            dataIndex: noct['idnocturnidad'],
                            sortable: false,
                            header: 'Noct-Fer ' + noct['denominacion'],
                            width: 110,
                            renderer: Estilo
                        });
                        indices.push({
                            name: noct['idnocturnidad']
                        });
                    });

                    indices.push({name: 'ft'});
                    indices.push({name: 'trt'});
                    indices.push({name: 'hp'});
                    indices.push({name: 'he'});
                    indices.push({name: 'diaslab'});
                    indices.push({name: 'diastrab'});
                    indices.push({name: 'hf'});
                    indices.push({name: 'hft'});
                    indices.push({name: 'hte'});
                    indices.push({name: 'hrl'});
                    if (responseData.trtmilitares == 1) {
                        indices.push({name: 'diastrabmilit'});
                    }

                    var cmhistorico = new Ext.grid.ColumnModel(columnas);
                    var plantillahist = new Ext.data.Record.create(indices);

                    var myReaderHist = new Ext.data.JsonReader({
                        totalProperty: "cantidad",
                        root: "datos"
                    }, plantillahist);

                    self.sthistorico = new Ext.data.GroupingStore({
                        url: 'gethistorico',
                        baseParams: {
                            idestructura: idestructura,
                            mes: month,
                            year: year,
                            idconcepto: idconcepto,
                            quincena: vista.tiporango.value,
                            tiporeporte: vista.tiporeporte.value,
                            analisis: vista.tipoanalisis.value,
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue(),
                            certificacion: vista.certificacion.value
                        },
                        reader: myReaderHist,
                        sortInfo: {field: 'denomarea', direction: "ASC"},
                        groupField: 'denomarea',
                        remoteGroup: true,
                        remoteSort: true,
                        listeners: {
                            load: function (st, recs, opt) {
                                if (recs.length == 0) {
                                    vista.btnCertificar.disable();
                                    // vista.btnQuitarCertificar.disable();
                                    vista.btnEnviarCorreo.disable();
                                    vista.btnAprobar.disable();
                                }
                            }
                        }
                    });
                    var smListadoHist = new Ext.grid.RowSelectionModel({
                        singleSelect: true
                    });

                    var ListadoHistorico = new Ext.grid.GridPanel({
                        id: 'historico1',
                        store: self.sthistorico,
                        loadMask: {msg: idioma.lbMsgmasklistado},
                        width: '100%',
                        height: 500,
                        view: new Ext.grid.GroupingView({
                            showGroupName: false,
                            groupTextTpl: '{group} ({[values.rs.length]} {[values.rs.length > 1 ? "Personas" : "Persona"]})'
                        }),
                        sm: smListadoHist,
                        cm: cmhistorico,
                        bbar: new Ext.PagingToolbar({
                            pageSize: 20,
                            store: self.sthistorico,
                            displayInfo: true,
                            displayMsg: 'Resultados {0} - {1} de {2}',
                            emptyMsg: "Ning&uacute;n resultado para mostrar"
                        })
                    });
                    vista.tabs.getItem('historico').add(ListadoHistorico);
                    vista.tabs.getItem('historico').doLayout();
                    vista.tabs.getItem('historico').enable();
                    self.sthistorico.loadData({
                        datos: responseData.datos,
                        cantidad: responseData.cantidad
                    }, true);

                    if(responseData.aprobado == 1){
                        vista.labelaprobado.show();
                        vista.btnCertificar.disable();
                        vista.btnAprobar.menu.items.items[0].disable();
                        vista.btnAprobar.menu.items.items[1].enable();
                        vista.labelaprobado.setText('<span style="color:#2da2fd"><b>' + 'PERÍODO APROBADO' + '</b></span>',false);
                    }else{
                        vista.labelaprobado.hide();
                        vista.btnCertificar.enable();
                        vista.btnAprobar.menu.items.items[0].enable();
                        vista.btnAprobar.menu.items.items[1].disable();
                        vista.labelaprobado.setText('<span style="color:#c6070c;"><b>' + 'PERÍODO NO APROBADO' + '</b></span>',false);
                    }
                }
            });
        }

        vista.btnBuscar.on('click', function () {
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
        }.createDelegate(this));

        vista.btnLimpiar.on('click', function () {
            vista.comboMeses.setValue(vista.fecha.getMonth() + 1);
            vista.comboYear.setValue(vista.fecha.getFullYear());
            vista.filtro.setValue('');
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
            GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        }.createDelegate(this));


        function representarImagen(val) {
            return "<img src=data:image/jpg;base64," + val + " width='50' height='40' />";
        }

        var fech = vista.fecha.format('d/m/Y').split('/');

        function EstiloCeldas(val, meta, rec, row, col, store) {
            //pintando los fines de semana
            var month = '';
            month += vista.comboMeses.getValue();
            var mes = (month.charAt(0) == 0) ? month.substring(1, 2) : month;
            var dia = (vista.ListadoPersonas.getColumnModel().getDataIndex(col).charAt(0) == 0) ? vista.ListadoPersonas.getColumnModel().getDataIndex(col).substring(1, 2) : vista.ListadoPersonas.getColumnModel().getDataIndex(col);
            var fechaColumna = new Date(vista.comboYear.getValue(), mes - 1, dia);
            var dia = fechaColumna.getDay();
            if (dia == 0 || dia == 6)
                meta.css = 'weekend';
            //pintando los fines de semana

            if (val)
                if (val == 'x')
                    return '<center><img src="/pvd/regimentrabajo/views/images/accept.png" style="margin-top: 12px"/></center>';
                else
                    return '<span><p  style=" margin-top: 12px; font-size: small"><b>' + val + '</b></p></span>';
            else {
                if (parseInt(vista.ListadoPersonas.getColumnModel().getDataIndex(col)) >= fech[0]) {
                    if (fech[1] != vista.comboMeses.getValue())
                        return '<center><img src="/pvd/regimentrabajo/views/images/conflicto.png" style="margin-top: 12px"/></center>';
                    else
                        return val;
                }
                else {

                    return '<center><img src="/pvd/regimentrabajo/views/images/conflicto.png" style="margin-top: 12px"/></center>';
                }
            }
        }

        function EstiloColumn(val, meta, rec, row, col, store) {

            // if (rec.data.otrodia != 1) {
            //pintando los fines de semana
            if (vista.tipoanalisis.value == 1) {
                var month = '';
                month += vista.comboMeses.getValue();
                var mes = (month.charAt(0) == 0) ? month.substring(1, 2) : month;
                var diaArr = vista.ListadoPersonas.getColumnModel().getDataIndex(col).split('/');
                var dia = diaArr[0];
                var fechaColumna = new Date(vista.comboYear.getValue(), mes - 1, dia);
                var dia = fechaColumna.getDay();
                if (dia == 0 || dia == 6)
                    meta.css = 'weekend';
            } else {
                var columna = vista.ListadoPersonas.getColumnModel().getDataIndex(col).split('/');
                var dia = columna[0];
                var mes = columna[1];
                var fechaColumna = new Date(vista.comboYear.getValue(), mes - 1, dia);
                var dia = fechaColumna.getDay();
                if (dia == 0 || dia == 6)
                    meta.css = 'weekend';
            }

            //pintando los fines de semana
            // }

            if (val) {
                var index = vista.ListadoPersonas.colModel.config[col].dataIndex;
                var color = rec.json[index + "_color"];
                if (!color) {
                    color = '';
                }
                var tmp = val.split(" ");
                var certificado = rec.json[index + "_certificado"];
                //console.info(rec.json[index + "_aprobado"]);
                var aprobado = rec.json[index + "_aprobado"];
                var causa = rec.json[index + "_causa"];
                if (causa) {
                    meta.attr = 'ext:qtip="' + causa + '"';
                }
                if (val.indexOf(".") > -1) {
                    var aux1 = val.split(".");
                    if (aprobado == 1) {
                        //meta.attr = 'ext:qtip="Certificada"';
                        if (dia == 0 || dia == 6) {
                            meta.css = 'weekend';
                            meta.attr = 'ext:qtip="Fin de semana"';
                            /*if (rec.data.otrodia == 0) {
                             return '<span style="float:left"><center></center></span>';
                             }*/
                        }
                        else
                            meta.css = 'aprobado';
                        return '<span style="float:left"><center><b>' + aux1[0] + '<br>' + aux1[1] + '</br></b></center></span>';
                    } else if (certificado == 1) {
                        //meta.attr = 'ext:qtip="Certificada"';
                        if (dia == 0 || dia == 6) {
                            meta.css = 'weekend';
                            meta.attr = 'ext:qtip="Fin de semana"';
                            /*if (rec.data.otrodia == 0) {
                             return '<span style="float:left"><center></center></span>';
                             }*/
                        }
                        else
                            meta.css = 'certificado';
                        return '<span style="float:left"><center><b>' + aux1[0] + '<br>' + aux1[1] + '</br></b></center></span>';
                    } else {
                        //meta.attr = 'ext:qtip="No Certificada"';
                        if (dia == 0 || dia == 6) {
                            meta.css = 'weekend';
                            meta.attr = 'ext:qtip="Fin de semana"';
                            /*if (rec.data.otrodia == 0) {
                             return '<span style="float:left"><center></center></span>';
                             }*/
                        }
                        else
                            meta.css = 'noCertificado';
                        return '<span style="float:left"><center><b>' + aux1[0] + '<br>' + aux1[1] + '</br></b></center></span>';
                    }
                    // return '<span style="float:left"><center><b>' + aux1[0] + '<br>' + aux1[1] + '</br></b></center></span>';
                } else if (val.indexOf("(") > -1) {
                    if (val.indexOf("-") > -1) {
                        var aux = val.split("-");
                        var a1 = aux[0].split(" ");
                        var a2 = aux[1].split(" ");
                        var col = color.split("-");
                        var t1 = '<span  style=" color:' + col[0] + '"><center><b>' + a1[1] + '</b></center></span>';
                        var t2 = '<span  style=" color:' + col[1] + '"><center><b>' + a2[1] + '</b></center></span>';
                        var s1 = a1[0] + t1;
                        var s2 = a2[0] + t2;

                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                /*if (rec.data.otrodia == 0) {
                                 return '<span style="float:left"><center></center></span>';
                                 }*/
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span style="float:left"><center>' + s1 + '<br>' + s2 + '</br></center></span>';
                        } else if (certificado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'certificado';
                            return '<span style="float:left"><center>' + s1 + '<br>' + s2 + '</br></center></span>';
                        } else {
                            //meta.attr = 'ext:qtip="No Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'noCertificado';
                            return '<span style="float:left"><center>' + s1 + '<br>' + s2 + '</br></center></span>';
                        }
                    } else {
                        var temp = '<span  style=" color:' + rec.json[index + "_color"] + '"><center><b>' + tmp[1] + '</b></center></span>';
                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                /*if (rec.data.otrodia == 0) {
                                 return '<span style="float:left"><center></center></span>';
                                 }*/
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span style="float:left"><center>' + tmp[0] + '<br>' + temp + '</br></center></span>';
                        } else if (certificado == 1) {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'certificado';
                            //meta.attr = 'ext:qtip="Certificada"';
                            return '<span style="float:left"><center>' + tmp[0] + '<br>' + temp + '</br></center></span>';
                        } else {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'noCertificado';
                            // meta.attr = 'ext:qtip="No Certificada"';
                            return '<span style="float:left"><center>' + tmp[0] + '<br>' + temp + '</br></center></span>';
                        }
                    }

                } else if (Ext.isEmpty(tmp[1])) {
                    if (tmp[0].indexOf(":") > -1) {
                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                /*if (rec.data.otrodia == 0) {
                                 return '<span style="float:left"><center></center></span>';
                                 }*/
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center>' + val + '</center></span></span>';
                        } else if (certificado == 1) {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'certificado';
                            // meta.attr = 'ext:qtip="Certificada"';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center>' + val + '</center></span></span>';
                        } else {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'noCertificado';
                            //meta.attr = 'ext:qtip="No Certificada"';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center>' + val + '</center></span></span>';
                        }
                    } else {
                        var pintarcol = vista.ListadoPersonas.getColumnModel().getDataIndex(col).split('/');
                        var pimtardia = pintarcol[0];
                        var pintarmes = pintarcol[1];
                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                if (Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) || (!Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) && rec.json[pimtardia + '/' + pintarmes + '_trabajo'] == '0')) {
                                    if(rec.json[pimtardia + '/' + pintarmes] != "Feriado")
                                        return '<span style="float:left"><center></center></span>';
                                }
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center><b>' + val + '</b></center></span>';
                        } else if (certificado == 1) {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                if (Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) || (!Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) && rec.json[pimtardia + '/' + pintarmes + '_trabajo'] == '0')) {
                                    if(rec.json[pimtardia + '/' + pintarmes] != "Feriado")
                                        return '<span style="float:left"><center></center></span>';
                                }
                            }
                            else
                                meta.css = 'certificado';
                            //meta.attr = 'ext:qtip="Certificada"';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center><b>' + val + '</b></center></span>';
                        } else {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                if (Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) || (!Ext.isEmpty(rec.json[pimtardia + '/' + pintarmes + '_trabajo']) && rec.json[pimtardia + '/' + pintarmes + '_trabajo'] == '0')) {
                                    if(rec.json[pimtardia + '/' + pintarmes] != "Feriado")
                                        return '<span style="float:left"><center></center></span>';
                                }
                            }
                            else
                                meta.css = 'noCertificado';
                            //meta.attr = 'ext:qtip="No Certificada"';
                            return '<span  style=" color:' + rec.json[index + "_color"] + ';float:left"><center><b>' + val + '</b></center></span>';
                        }

                    }
                } else {
                    if (val.indexOf("-") > -1) {
                        var aux = val.split("-");
                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                /*if (rec.data.otrodia == 0) {
                                 return '<span style="float:left"><center></center></span>';
                                 }*/
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span style="float:left"><center>' + aux[0] + '<br>' + '' + '<br>' + aux[1] + '</br></center></span>';
                        } else if (certificado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'certificado';
                            return '<span style="float:left"><center>' + aux[0] + '<br>' + '' + '<br>' + aux[1] + '</br></center></span>';
                        } else {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'noCertificado';
                            //meta.attr = 'ext:qtip="No Certificada"';
                            return '<span style="float:left"><center>' + aux[0] + '<br>' + '' + '<br>' + aux[1] + '</br></center></span>';
                        }
                    } else {
                        if (aprobado == 1) {
                            //meta.attr = 'ext:qtip="Certificada"';
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                /*if (rec.data.otrodia == 0) {
                                 return '<span style="float:left"><center></center></span>';
                                 }*/
                            }
                            else
                                meta.css = 'aprobado';
                            return '<span><center>' + val + '</center></span>';
                        } else if (certificado == 1) {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'certificado';
                            //meta.attr = 'ext:qtip="Certificada"';
                            return '<span><center>' + val + '</center></span>';
                        } else {
                            if (dia == 0 || dia == 6) {
                                meta.css = 'weekend';
                                meta.attr = 'ext:qtip="Fin de semana"';
                                // if (rec.data.otrodia == 0) {
                                //     return '<span style="float:left"><center></center></span>';
                                // }
                            }
                            else
                                meta.css = 'noCertificado';
                            //meta.attr = 'ext:qtip="No Certificada"';
                            return '<span><center>' + val + '</center></span>';
                        }
                    }

                }
            }
            else {
                if (dia == 0 || dia == 6) {
                    meta.css = 'weekend';
                    meta.attr = 'ext:qtip="Fin de semana"';
                    // if (rec.data.otrodia != 1) {
                    //     return '<span style="float:left"><center></center></span>';
                    // }
                }
            }

        }

        function EstiloCeldasApa(val, meta, rec, row, col, store) {
            if (!Ext.isEmpty(val)) {
                if (rec.fields.length == col && val == 0)
                    return '<p  style="margin-top: 8px; font-size: small; color: red"><b>' + val + '</b></p>';
                else
                    return '<p  style="margin-top: 8px; font-size: small"><b>' + val + '</b></p>';
            }
        }

        function Estilo(val, meta, rec, row, col, store) {
            meta.css = 'weekend';
            if (!Ext.isEmpty(val)) {
                return '<p><b>' + val + '</b></p>';
            }
        }

        function anioBisiesto(anio) {
            if ((anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0)
                return 29;
            else
                return 28;
        }

        function meses(fecha) {
            var longitud;
            if (fecha[1] == 2)
                return anioBisiesto(fecha[2]);
            else if (fecha[1] == 1 || fecha[1] == 3 || fecha[1] == 5 || fecha[1] == 7 || fecha[1] == 8 || fecha[1] == 10 || fecha[1] == 12)
                return 31;
            else
                return 30;
        }

////funcion para configurar las colunmas del grid del reporte de manera dinamica

        function formatDate(date) {
            var explodeDate = date.split('/');
            return parseInt(explodeDate[2] + explodeDate[1] + explodeDate[0]);
        }

        vista.btnCertificar.menu.items.items[0].setHandler(function () {
            Ext.getBody().mask(idioma.lbTitMsgCertificando);
            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            Ext.Ajax.request({
                url: 'certificar',
                params: {
                    idestructura: self.idestructura,
                    mes: vista.comboMeses.getValue(),
                    year: vista.comboYear.getValue(),
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue(),
                    idpersonas: Ext.encode(idpersonas),
                    quincena: vista.tiporango.value,
                    analisis: vista.tipoanalisis.value
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                    vista.Maskara.show();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                     if (responseData.cod == 4) {
                        //mostrarMensaje(1, idioma.MsjPersonasNoCert + responseData.persnocert.join(', ') + ' .');
                        mostrarMensaje(1, 'La asistencia de la(s) persona(s) seleccionada(s) no puede(n) ser certificada(s).');
                    } else if (responseData.cod == 3)
                        mostrarMensaje(1, 'La asistencia de la(s) persona(s) seleccionada(s) ya está(n) certificada(s).');
                    else {
                        mostrarMensaje(1, idioma.lbTitMsgCertificar);
                    }
                    //vista.Maskara.show();
                    GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                    vista.ListadoPersonas.getSelectionModel().clearSelections();
                }

            });
        });

        vista.btnCertificar.menu.items.items[1].setHandler(function () {
            Ext.getBody().mask(idioma.lbTitMsgQuitandoCertificacion);
            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            Ext.Ajax.request({
                url: 'quitarcertificacion',
                params: {
                    idestructura: self.idestructura,
                    mes: vista.comboMeses.getValue(),
                    year: vista.comboYear.getValue(),
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue(),
                    idpersonas: Ext.encode(idpersonas),
                    quincena: vista.tiporango.value,
                    analisis: vista.tipoanalisis.value
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                    vista.Maskara.show();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData.cod == 3)
                        mostrarMensaje(1, idioma.lbTitMsgErrorQuitarCertif);
                    else {
                        mostrarMensaje(1, idioma.lbTitMsgQuitarCertif);
                    }
                    //vista.Maskara.show();
                    GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                    vista.ListadoPersonas.getSelectionModel().clearSelections();
                }
            });
        });

        vista.btnAprobar.menu.items.items[0].setHandler(function () {
            mostrarMensaje(2, 'La asistencia será aprobada. ¿Está seguro que desea hacerlo?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Aprobando la asistencia del período...');
                    Ext.Ajax.timeout = 90000000;
                    Ext.Ajax.request({
                        url: 'aprobarasistencia',
                        params: {
                            idestructura: self.idestructura,
                            mes: vista.comboMeses.getValue(),
                            year: vista.comboYear.getValue(),
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue(),
                            quincena: vista.tiporango.value,
                            analisis: vista.tipoanalisis.value,
                            filtro: vista.filtro.getValue(),
                            tiporeporte: vista.tiporeporte.value
                        },
                        method: "POST",
                        callback: function () {
                            Ext.getBody().unmask();
                            vista.Maskara.show();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            var persnoaprobar = responseData.noaprobar;
                            if (responseData.cod == 3)
                                mostrarMensaje(1, 'Todas las asistencias tienen que estar certificadas para poder ser aprobadas.' /*Las personas siguientes tienen asistencias sin certificar: ' + persnoaprobar.join(', ')*/);
                            else {
                                mostrarMensaje(1, 'La asistencia ha sido aprobada satisfactoriamente.');
                                //vista.btnCertificar.disable();
                            }
                            //vista.Maskara.show();
                            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                            vista.ListadoPersonas.getSelectionModel().clearSelections();
                        }
                    });
                }
            });
        });

        vista.btnAprobar.menu.items.items[1].setHandler(function () {
            mostrarMensaje(2, 'La asistencia será desaprobada. ¿Está seguro que desea hacerlo?', function (btnPresionado) {
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask('Desaprobando la asistencia del período...');
                    Ext.Ajax.timeout = 90000000;
                    Ext.Ajax.request({
                        url: 'desaprobarasistencia',
                        params: {
                            fdesde: vista.desde.getRawValue(),
                            fhasta: vista.hasta.getRawValue(),
                            mes: vista.comboMeses.getValue(),
                            year: vista.comboYear.getValue(),
                            quincena: vista.tiporango.value,
                            analisis: vista.tipoanalisis.value
                        },
                        method: "POST",
                        callback: function () {
                            Ext.getBody().unmask();
                            vista.Maskara.show();
                        },
                        success: function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData.cod == 1){
                                mostrarMensaje(1, 'La asistencia ha sido desaprobada satisfactoriamente.');
                            }
                            //vista.Maskara.show();
                            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                            vista.ListadoPersonas.getSelectionModel().clearSelections();
                        }
                    });
                }
            });
        });

        vista.btnEnviarCorreo.on('click', function () {
            Ext.getBody().mask('Cargando...');

            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }

            Ext.Ajax.request({
                url: 'personasSeleccionas',
                params: {idestructura: self.idestructura, idpersonas: Ext.encode(idpersonas)},
                method: "POST",
                callback: function (options, success, response) {
                    Ext.getBody().unmask();
                    var responseData = Ext.decode(response.responseText);
                    self.personas = responseData.cant;

                    mostrarMensaje(2, 'Usted le enviará un correo a ' + self.personas + ' personas. ¿Está seguro que desea enviarlo?', function (btnPresionado) {
                        if (btnPresionado == 'ok') {
                            Ext.getBody().mask(idioma.lbTitMsgEnviarCorreo);
                            Ext.Ajax.timeout = 90000000;
                            Ext.Ajax.request({
                                url: 'enviarCorreo',
                                params: {
                                    idestructura: self.idestructura,
                                    mes: vista.comboMeses.getValue(),
                                    year: vista.comboYear.getValue(),
                                    fdesde: vista.desde.getRawValue(),
                                    fhasta: vista.hasta.getRawValue(),
                                    idpersonas: Ext.encode(idpersonas),
                                    quincena: vista.tiporango.value,
                                    analisis: vista.tipoanalisis.value
                                },
                                method: "POST",
                                callback: function () {
                                    Ext.getBody().unmask();
                                },
                                success: function (r) {
                                    var responseData = Ext.decode(r.responseText);
                                    if (responseData.cod == 3) {
                                        if (!Ext.isEmpty(responseData.noenviado))
                                            mostrarMensaje(1, idioma.MsgPeopleNoCorreo + '<ul>' + responseData.noenviado + '</ul>');
                                        else
                                            mostrarMensaje(1, idioma.lbTitMsgCorreoNoEnviado);
                                    } else {
                                        if (!Ext.isEmpty(responseData.noenviado))
                                            mostrarMensaje(1, idioma.MsgPeopleNoCorreo + '<ul>' + responseData.noenviado + '</ul>');
                                        else
                                            mostrarMensaje(1, idioma.lbTitMsgCorreoEnviado);
                                    }
                                    vista.ListadoPersonas.getSelectionModel().clearSelections();
                                }
                            });
                        }
                    });
                }
            });


        });

        vista.certificacion.on('select', function (cb, r, i) {
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
        });

        vista.btnLimpiarCert.on('click', function () {
            vista.certificacion.setValue(null);
            GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
        }.createDelegate(this));

        vista.btnRestaurar.on('click', function () {
            Ext.getBody().mask(idioma.lbTitMsgRestaurandoHP);
            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            Ext.Ajax.timeout = 90000000;
            Ext.Ajax.request({
                url: 'restaurarHorasPerdidas',
                params: {
                    idestructura: self.idestructura,
                    filtro: vista.filtro.getValue(),
                    mes: vista.comboMeses.getValue(),
                    year: vista.comboYear.getValue(),
                    fdesde: vista.desde.getRawValue(),
                    fhasta: vista.hasta.getRawValue(),
                    idpersonas: Ext.encode(idpersonas),
                    quincena: vista.tiporango.value,
                    analisis: vista.tipoanalisis.value
                },
                method: "POST",
                callback: function () {
                    Ext.getBody().unmask();
                    vista.Maskara.show();
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if (responseData.cod == 3)
                        mostrarMensaje(1, idioma.lbTitMsgErrorRestaurarHP);
                    else {
                        mostrarMensaje(1, idioma.lbTitMsgRestaurarHPok);
                    }
                    vista.Maskara.show();
                    GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                    vista.ListadoPersonas.getSelectionModel().clearSelections();
                }
            });
        });

        vista.btnGenerarHoja.on('click', function () {
            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            var params = Ext.urlEncode({
                idpersonas: Ext.encode(idpersonas),
                idestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().id,
                mes: vista.comboMeses.getValue(),
                year: vista.comboYear.getValue(),
                fdesde: vista.desde.getRawValue(),
                fhasta: vista.hasta.getRawValue(),
                quincena: vista.tiporango.value,
                analisis: vista.tipoanalisis.value
            });

            var idIframeNominal = Ext.id();
            new Ext.Window({
                title: 'Hoja de firma',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframeNominal,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/asistenciamensual/generarhojaPdf?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando el reporte en formato PDF.');
            document.getElementById(idIframeNominal).onload = function () {
                PVD.ocultarMascara('rep01');
            }
        }, this);

        vista.btnCancelar.on('click', function () {
            vista.ventanaExcel.hide();
            vista.formulario.getForm().reset();
        });

        vista.btnAceptar.on('click', function () {
            this.salvarFormulario(false);
        }, this);

        this.salvarFormulario = function (btnAplicarPresionado) {
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();
            var fecha = vista.fechaBuscar.getRawValue();
            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            var params = Ext.urlEncode({
                idpersonas: Ext.encode(idpersonas),
                idestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().id,
                mes: vista.comboMeses.getValue(),
                year: vista.comboYear.getValue(),
                filtro: vista.filtro.getValue(),
                denomestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().text,
                fecha: fecha,
                quincena: vista.tiporango.value,
                tiporeporte: vista.tiporeporte.value,
                analisis: vista.tipoanalisis.value,
                fdesde: vista.desde.getRawValue(),
                fhasta: vista.hasta.getRawValue(),
                trt: vista.trt.getValue(),
                ft: vista.ft.getValue(),
                hp: vista.hp.getValue(),
                he: vista.he.getValue(),
                hf: vista.hf.getValue(),
                hft: vista.hft.getValue()
            });
            var iframe = document.createElement("iframe");
            iframe.src = document.location.protocol + '//' + document.location.host + '/pvd/regimentrabajo/index.php/asistenciamensual/exportarExcel?' + params;
            iframe.style.display = 'none';
            iframe.onload = function () {
                winload.hideMask();
            }
            document.body.appendChild(iframe);
        }

        vista.btnCancelarhojas.on('click', function () {
            vista.ventanaHojas.hide();
        }, this);

        vista.btnAceptarhojas.on('click', function () {
            vista.ventanaHojas.hide();
            /*var a4 = vista.formulariohojas.getForm().items.items[0].checked;
            var a3 = vista.formulariohojas.getForm().items.items[1].checked;*/
            var tipohoja = vista.cbFormatohoja.getRawValue();
            if (tipohoja == 'A0')
                var tipohoja = 0;
            else if (tipohoja == 'A1')
                var tipohoja = 1;
            else if (tipohoja == 'A2')
                var tipohoja = 2;
            else if (tipohoja == 'A3')
                var tipohoja = 3;

            var idpersonas = new Array();
            var seleccionados = vista.ListadoPersonas.getSelectionModel().getSelections();
            if (seleccionados.length > 0) {
                Ext.each(seleccionados, function (rec) {
                    idpersonas.push(rec.data.idpersona);
                });
            }
            var fecha = vista.fechaBuscar.getRawValue();
            var params = Ext.urlEncode({
                idpersonas: Ext.encode(idpersonas),
                idestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().id,
                mes: vista.comboMeses.getValue(),
                year: vista.comboYear.getValue(),
                filtro: vista.filtro.getValue(),
                denomestructura: vista.estructura.tree.getSelectionModel().getSelectedNode().text,
                fecha: fecha,
                quincena: vista.tiporango.value,
                analisis: vista.tipoanalisis.value,
                fdesde: vista.desde.getRawValue(),
                fhasta: vista.hasta.getRawValue(),
                causas: 1,
                tipohoja: tipohoja
            });
            var idIframe = Ext.id();
            new Ext.Window({
                title: 'Reporte por causas de la asistencia del mes',
                width: 800,
                height: 500,
                id: 'winregistro',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrainHeader: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/regimentrabajo/index.php/asistenciamensual/generarPdfReporteAPA?' + params
                    }
                }
            }).show();
            Ext.getCmp('winregistro').maximize();
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando reporte.');
            var winload = new Ext.PVD.comun.window.winLoad({
                title: 'Por favor espere...',
                mensaje: 'Generando reporte'
            });

            winload.showMask();
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                winload.hideMask();
            }
        });

        // Ext.getCmp("a4").on('check', function (chek, checked) {
        //     if (checked == true) {
        //         Ext.getCmp("a3").setValue(false);
        //     }
        // });
        //
        // Ext.getCmp("a3").on('check', function (chek, checked) {
        //     if (checked == true) {
        //         Ext.getCmp("a4").setValue(false);
        //     }
        // });

        var teclaAlt = new Ext.KeyMap(Ext.getDoc(), [{
            key: 'ble',
            alt: true,
            stopEvent: true,
            handler: function (k, e) {
                switch (k) {
                    case 66: { //b para buscar
                        GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconceptovista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                        GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconceptovista.desde.getRawValue(), vista.hasta.getRawValue());
                        GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                        break;
                    }
                    case 76: { //l para limpiar
                        vista.comboMeses.setValue(vista.fecha.getMonth() + 1);
                        vista.comboYear.setValue(vista.fecha.getFullYear());
                        vista.filtro.setValue('');
                        GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconceptovista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                        GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconceptovista.desde.getRawValue(), vista.hasta.getRawValue());
                        GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                        break;
                    }
                    case 69: { //e para exportar
                        exportar();
                        break;
                    }
                }
            }
        }, {
            key: 13,//Enter para buscar
            fn: function () {
                GetFechas(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
                GetApa(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue());
                GetHistorico(vista.comboMeses.getValue(), vista.comboYear.getValue(), self.idestructura, vista.filtro.getValue(), self.idconcepto, vista.desde.getRawValue(), vista.hasta.getRawValue(), vista.certificacion.getValue());
            }
        }]);
    }
}

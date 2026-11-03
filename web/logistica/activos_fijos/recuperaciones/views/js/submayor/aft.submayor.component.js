/**
 * Created by yoendy on 12/17/2015.
 */

Ext.ns('Log.aft.submayor');
Log.aft.submayor.ViewGridMovRegNumActivos = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.submayor.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/submayor';
        this.urlBusquedaGridPrincipal = 'getDatosMovimiento';
        this.modoSeleccion = 1;
		this.autoLoad = false;
        this.busquedaAvanzada = false;
        this.panelBusquedaAvanzada = undefined;
        this.formaVisualizacion = 'panel';

        Log.aft.submayor.ViewGridMovRegNumActivos.superclass.constructor.call(this, config);


        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.attachPlugin(arrElementosGridCodigoNew[i]);
        }
    },
    render: function(config) {
        var _this = this;
        var render = Log.aft.submayor.ViewGridMovRegNumActivos.superclass.render.call(this, config);
        _this.getStorePrincipal().on({
            'load': function(st, records, opt) {
                if (records.length > 0)
                    _this.columnsRenderer(records);
            }
        });
        return render;
    },
    initDefaultColumns: function() {
        var _this = this;

        _this.addGridColumn({
            header: _this.idioma.lbNroSerie,
            dataIndex: 'nroserie',
            default: true,
            width: 120
        });

        _this.addGridColumn({
            header: _this.idioma.lbNroInventario,
            dataIndex: 'nroinventario',
            default: true,
            width: 80
        });

        _this.addGridColumn({
            header: _this.idioma.lbEntidad,
            dataIndex: 'entidad',
            default: true,
            width: 160
        });

        _this.addGridColumn({
            header: _this.idioma.lbArearesponsabilidad,
            dataIndex: 'arearesponsabilidad',
            default: true,
            width: 100
        });

        _this.addGridColumn({
            header: _this.idioma.lbUbicacion,
            dataIndex: 'ubicacion',
            default: true,
            width: 100,
            renderer: function(v, p, record) {

                var valor = '';

                if (record.get('area') != null) {
                    valor = record.get('area');
                }

                if (v != null && valor.length > 0) {
                    valor += ' - ' + v;
                }

                return (valor.length > 0) ? valor : v;
            }
        });

        _this.addGridColumn({
            header: (alternativa) ? _this.idioma.lbCmValorcontable + ' ' + nommonedacontable : _this.idioma.lbCmValorcontable,
            dataIndex: 'valorcontable',
            default: true,
            width: 100,
            align: 'right',
            renderer: function(val) {
                return Ext.util.Format.number(val, '000,000,000.00');
            }
        });

        _this.addGridColumn({
            header: (alternativa) ? _this.idioma.lbCmValorcontable + ' ' + nommonedaalternativa : _this.idioma.lbCmValorcontable,
            dataIndex: 'valorcontablealternativo',
            default: true,
            width: 100,
            align: 'right',
            hidden: (alternativa) ? false : true,
            renderer: function(val) {
                return Ext.util.Format.number(val, '000,000,000.00');
            }
        });

        _this.addGridColumn({
            header: (alternativa) ? _this.idioma.lbCmDepAcumulada + ' ' + nommonedacontable : _this.idioma.lbCmDepAcumulada,
            dataIndex: 'depreciacionacumulada',
            default: true,
            width: 110,
            align: 'right',
            renderer: function(val) {
                return Ext.util.Format.number(val, '000,000,000.00');
            }
        });

        _this.addGridColumn({
            header: (alternativa) ? _this.idioma.lbCmDepAcumulada + ' ' + nommonedaalternativa : _this.idioma.lbCmDepAcumulada,
            dataIndex: 'depreciacionacumuladaalternativo',
            hidden: (alternativa) ? false : true,
            default: true,
            width: 110,
            align: 'right',
            renderer: function(val) {
                return Ext.util.Format.number(val, '000,000,000.00');
            }
        });

        _this.addGridColumn({
            header: _this.idioma.lbEstado,
            dataIndex: 'denomestadotecnico',
            default: true,
            width: 100
        });

        _this.addGridColumn({
            header: _this.idioma.lbResponsable,
            dataIndex: 'responsable',
            default: true,
            width: 150
        });

        _this.addGridColumn({
            header: _this.idioma.lbCmFechaAdquisicion,
            dataIndex: 'fechaadq',
            default: true,
            width: 70,
            type: 'date',
            renderer: function(value) {
                value = (value) ? value : '';
                if (value && typeof (value) == 'object') {
                    value = value.format('d/m/Y');
                }
                return value;
            }
        });

        _this.addGridColumn({
            header: _this.idioma.lbCmFechaExpInicio,
            dataIndex: 'fechaexpini',//fechaexpini
            default: true,
            width: 70,
            type: 'date',
            renderer: function(value,x, re) {
                value = (re.json.fechaexpini) ? re.json.fechaexpini : '';
                if (value && typeof (value) == 'object') {
                    value = value.format('d/m/Y');
                }
                return value;
            }
        });

        _this.addGridColumn({
            header: _this.idioma.lbCmFechaExpFin,
            dataIndex: 'fechaexpfin',
            default: true,
            format: 'd/m/Y',
            width: 70,
            type: 'date',
            renderer: function(value,x, re) {
                value = (re.json.fechaexpfin) ? re.json.fechaexpfin : '';
                if (value && typeof (value) == 'object') {
                    value = value.format('d/m/Y');
                }
                return value;
            }
        });

        _this.addGridColumn({
            header: _this.idioma.lbCmCentroCosto,
            dataIndex: 'denomcentrocostomov',
            default: true,
            width: 70,
        });

        _this.addGridColumn({
            header: "Asignado",
            dataIndex: 'idestadoperacion',
            default: true,
            width: 150,
            renderer: function(val, metaData, record) {               
                return  _this.crearSwitchIdEstadoperac(val);
            }
        });

        _this.addGridColumn({
            dataIndex: 'idestadoperacion',
            default: false,
        });
    },
    crearSwitchIdEstadoperac: function(idestadoperacion) {
        switch (idestadoperacion) {
            case '0':
                {
                    return "Insertado";
                }
                break;
            case '1':
                {
                    return "Registrado";
                }
                break;
            case '2':
                {
                    return "Alquilado proveedor";
                }
                break;
            case '3':
                {
                    return "Alquilado cliete";
                }
                break;
            case '4':
                {
                    return "Prestado";
                }
                break;
            case '5':
                {
                    return "Reparacion";
                }
                break;
            case '6':
                {
                    return "Trasladado";
                }
                break;
            case '7':
                {
                    return "Baja";
                }
                break;
            case '8':
                {
                    return "Devuelto";
                }
                break;
            case '9':
                {
                    return "Conciliando apertura";
                }
                break;
            case '10':
                {
                    return "Asignado subsistema patrimonio";
                }
                break;

        }
    },
    columnsRenderer: function(records) {
        var _this = this;
        var columnModel = _this.getGridPrincipal().getColumnModel();
        var first = records[0].data;
        Ext.each(records, function(rec, pos) {
            if (pos != 0) {
                for (data in first) {
                    var aux = (first[data]) ? first[data].toString() : '';
                    var aux1 = (rec.data[data]) ? (rec.data[data]).toString() : '';
                    var index = columnModel.findColumnIndex(data);
                    if (aux != aux1) {
                        columnModel.setRenderer(parseInt(index), function(value) {
                            value = (value) ? value : '';
                            if (value && typeof (value) == 'object') {
                                value = value.format('d-m-Y');
                            }
                            return '<span style="color: #1c2ba8">' + value + '</span>';
                        });
                    } else if (aux === aux1) {
                        columnModel.setRenderer(parseInt(index), function(value) {
                            value = (value) ? value : '';
                            if (value && typeof (value) == 'object') {
                                value = value.format('d-m-Y');
                            }
                            return '<span style="color: #000000">' + value + '</span>';
                        });
                    }
                    _this.getGridPrincipal().getView().refresh();
                }
            }
        });
    }
});
Log.aft.submayor.ViewMovimiento = Ext.extend(LOG.util.UITemplate, {
    arrIdEstructura: undefined,
    idregistronumerico: undefined,
    recordreg: undefined,
    arrayAreas: undefined,
    constructor: function(config) {

        var _this = this;

        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.submayor.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/submayor';
        this.urlBusquedaGridPrincipal = 'getmovimientosregistro';
        this.modoSeleccion = 3;
        this.autoLoad = false;
        this.busquedaAvanzada = true;
        this.panelBusquedaAvanzada = undefined;

        this.modelo = new Log.aft.submayor.Model({
            idioma: config.idioma
        });
        this.formaVisualizacion = 'ventana';
        this.gridMovimietos = undefined;

        Ext.apply(this, config);
        Log.aft.submayor.ViewMovimiento.superclass.constructor.call(this, config);
        //this.rowexpander = ['<p><b>Observaciones: </b>{observaciones}</p>'];

        this.getVistaPrincipal().setTitle(_this.title);

    },
    init: function() {
        var _this = this;
        Log.aft.submayor.ViewMovimiento.superclass.init.call(this);

        this.getPanelPrincipal().onRender = this.getPanelPrincipal().onRender.createSequence(function() {

            _this.gridMovimietos = new Log.aft.submayor.ViewGridMovRegNumActivos({
                idioma: _this.idioma
            });
            _this.gridMovimietos.init();

            _this.panelSur = new LOG.util.UIManager.initPanel({
                animCollapse: false,
                collapsible: true,
                collapsed: false,
                region: 'south',
                layout: 'fit',
                height: 200,
                split: true,
                frame: true,
                title: _this.idioma.lbTitleRnMovimientos,
                titleCollapse: true,
                collapseMode: 'mini'
            });

            _this.panelSur.add(_this.gridMovimietos.view());
            _this.getPanelPrincipal().add(_this.panelSur);
            Ext.apply(_this.gpPrincipal, {
                viewConfig: {
                    getRowClass: function(rec, index, rowParams, store) {
                        if (rec.data.estado == 2)
                            return 'yellowrow-text';
                        else if (rec.data.estado == 1)
                            return 'redrow-text';
                        else if (rec.data.estado == 5)
                            return 'greyrow-text';
                        else 
                            return 'greenrow-text';
                    }
                }
            });

        });


    },
    render: function() {
        var _this = this;
        var render = Log.aft.submayor.ViewMovimiento.superclass.render.call(this);
        _this.gridMovimietos.getStorePrincipal().on({
            'beforeLoad': function(store, options) {
                var ids = Array();
                Ext.each(_this.getSmPrincipal().getSelections(), function(re) {
                    ids.push(re.data.idmovregnumerico);
                });
                options.params = {
                    idmovregnumerico: Ext.encode(ids),
                    //idregnumerico: _this.idregistronumerico
                };
            }
        });
        _this.getSmPrincipal().on({
            'rowselect': function(sm, rowIndex, Record) {
                _this.gridMovimietos.getStorePrincipal().load();
            },
            'rowdeselect': function(sm, rowIndex, Record) {
                _this.gridMovimietos.getStorePrincipal().load();
            }
        });

        _this.getStorePrincipal().initBaseParams = {
            'idarearesp': _this.arrIdEstructura,
            'idregnumerico': _this.idregistronumerico
        };
        _this.getStorePrincipal().load();

        return render;
    },
    initDefaultColumns: function() {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'idmovimiento',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'idmovregnumerico',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'codigooperacion',
            default: true
        });

        this.addGridColumn({
            dataIndex: 'cronologia',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmFecha,
            dataIndex: 'fechacontable',
            sortable: true,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmClaveDoc,
            dataIndex: 'denominacion',
            autoExpand: true,
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbEntidad,
            dataIndex: 'denomentidad',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCbDeposito,
            dataIndex: 'denomarearesp',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmNroDoc,
            dataIndex: 'nrodoc',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.lbCmNroRef,
            dataIndex: 'numeroref',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgEstado,
            width: 160,
            dataIndex: 'estado',
            default: true,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });

        this.addGridColumn({
            header: 'Nro Comprobante',
            width: 100,
            dataIndex: 'numerocomprobante',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.cgResponsableMov,
            width: 160,
            dataIndex: 'responsable',
            default: true,
            renderer: function(v) {
               if(v == null || v == ""){
                   return "-";
               }
                return v;
            }
        });

        this.addGridColumn({
            dataIndex: 'observaciones',
            default: true
        });
    },
    initDefaultButtons: function() {
        var _this = this;

        /*this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
         text: this.idioma.btnMostrar,
         iconCls: 'mostrar',
         tooltip: this.idioma.btnTtMostrar,
         handler: function() {
         alert("No se ha implementado esta funcionalidad");
         },
         controlFn: function(b, _caller) {
         b.disable();
         _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
         if (e == 'rowselect') {
         b.enable();
         }
         if (e == 'rowdeselect') {
         b.disable();
         }
         });
         }
         }));*/

        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(0), LOG.util.Prototipos.botonCancelar({
            text: this.idioma.lbBtnCerrar
        }, true));

        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        _this.btnReportes = {
            text: "Imprimir",
            tooltip: _this.idioma.btnReportes,
            iconCls: 'crearreporte',
            menu: [
                 {
                    text: "Imprimir modelo",
                    // tooltip: _this.idioma.btnTtReporteImprimir,
                    iconCls: 'imprimir',
                    //hidden:true,
                    // id: 'btnReporteImprimirModeloMov',
                    handler: function () {
                        console.info(_this.getSmPrincipal().getSelected().json.iddocumento)

                        if (_this.getSmPrincipal().hasSelection()) {
                            var report = new LOG.util.Report({
                                reports: [
                                    {
                                        name: 'Vista principal',
                                        params: {
                                            idregnumerico: _this.idregistronumerico,
                                            codigooperacion: _this.getSmPrincipal().getSelected().get('codigooperacion'),
                                            idestructura:_this.arrIdEstructura,
                                            iddocumento:_this.getSmPrincipal().getSelected().json.iddocumento
                                        },
                                        // params: {arraydeposito: "{" + _this.arregloAreas + "}", idestructura:_this.idestructura},
                                        dirReport: '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible',
                                        detailFirma: {}
                                    }
                                ]
                            }).view();
                        }else{
                            mostrarMensaje(1, "Debe seleccionar una operaci\xf3n.");
                        }
                    }
                },{
                    text: "Imprimir listado",
                    // tooltip: _this.idioma.btnTtReporteImprimir,
                    iconCls: 'imprimir',
                    //hidden:true,
                    // id: 'btnReporteImprimirListadoMov',
                    handler: function () {
                        var report = new LOG.util.Report({
                            reports: [
                                {
                                    name: 'Vista principal',
                                    params: {
                                        idregnumerico:_this.idregistronumerico,
                                        arraydeposito:"{" + _this.arrayAreas + "}",
                                        idestructura:_this.arrIdEstructura,
                                        nroserie:_this.recordreg.get('nroserie'),
                                        nroinventario:_this.recordreg.get('nroinventario'),
                                        iddocumento:_this.getSmPrincipal().getSelected().json.iddocumento
                                    },
                                    // params: {arraydeposito: "{" + _this.arregloAreas + "}", idestructura:_this.idestructura},
                                    dirReport: '/distra/logistica/activofijo/submayor/ReporteListadoMovimientoRegistro',
                                    detailFirma: {}
                                }
                            ]
                        }).view();
                    }
                }
            ]
        };

        this.addToolbarButton(_this.btnReportes);
        /*this.addToolbarButton(LOG.util.Prototipos.botonImprimir({
            tooltip: this.idioma.ttImprimir,
            handler: function() {
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: {
                                idregnumerico:_this.idregistronumerico,
                                arraydeposito:"{" + _this.arrayAreas + "}",
                                idestructura:_this.arrIdEstructura,
                                nroserie:_this.recordreg.get('nroserie'),
                                nroinventario:_this.recordreg.get('nroinventario')
                            },
                            // params: {arraydeposito: "{" + _this.arregloAreas + "}", idestructura:_this.idestructura},
                            dirReport: '/distra/logistica/activofijo/submayor/ReporteListadoMovimientoRegistro',
                            detailFirma: {}
                        }
                    ]
                }).view();
            }
        }));*/

    }
});
Log.aft.submayor.WinPrintConfigSIRM = Ext.extend(LOG.util.Window, {
    constructor: function (config) {

        Ext.apply(this, config);
        var _this = this;
        _this.constrain = true;
        //this.idioma = config.idioma;

        // Store para cargar los periodos...
        this.stPeriodoIni = new Ext.data.Store({
            url: 'cargarComboPeriodo',
            reader: new Ext.data.JsonReader({
                id: "idperiodoini",
                root: "datos",
                fields: [
                    {name: 'idperiodo'},
                    {name: 'nombre'},
                    {name: 'inicio'},
                    {name: 'fin'}
                ]
            })

        });


        this.stPeriodoIni.on({
            'load': function (store, records, options) {
                for (var i = 0; i < records.length; i++) {
                    var text = '<b><u>' + records[i].data.nombre + '</u></b><br>';
                    text += records[i].data.inicio + ' - ' + records[i].data.fin
                    records[i].data.text = text;
                }

                _this.cbPeriodoIni.setValue(records[0].data.idperiodo);
                _this.cbPeriodoIni.enable();

            }
        });


        this.stPeriodoFin = new Ext.data.Store({
            url: 'cargarComboPeriodo',
            reader: new Ext.data.JsonReader({
                id: "idperiodofin",
                root: "datos",
                fields: [
                    {name: 'idperiodo'},
                    {name: 'nombre'},
                    {name: 'inicio'},
                    {name: 'fin'}
                ]
            })
        });

        this.stPeriodoFin.on({
            'load': function (store, records, options) {
                for (var i = 0; i < records.length; i++) {
                    var text = '<b><u>' + records[i].data.nombre + '</u></b><br>';
                    text += records[i].data.inicio + ' - ' + records[i].data.fin
                    records[i].data.text = text;
                }

                _this.cbPeriodoFin.setValue(records[records.length - 1].data.idperiodo);
                _this.cbPeriodoFin.enable();
            }
        });

        // Combo para cargar los periodos...
        this.cbPeriodoIni = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbPeriodoInicial,
            disabled: true,
            hiddenName: 'idperiodoini',
            valueField: 'idperiodo',
            displayField: 'nombre',
            store: _this.stPeriodoIni,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            readOnly: true,
            mode: 'local',
            anchor: '95%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{nombre}</div></tpl>'
            //  emptyText: _this.idioma.lbEmptyTextCmb
        });

        // Combo para cargar los periodos...
        this.cbPeriodoFin = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbPeriodoFinal,
            disabled: true,
            hiddenName: 'idperiodofin',
            valueField: 'idperiodo',
            displayField: 'nombre',
            store: _this.stPeriodoFin,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            readOnly: true,
            mode: 'local',
            anchor: '95%',
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{nombre}</div></tpl>'
            // emptyText: _this.idioma.lbEmptyTextCmb
        });


        // Store para cargar los ejercicios...
        this.stEjercicio = new Ext.data.Store({
            autoLoad: true,
            url: 'cargarComboEjercicio',
            reader: new Ext.data.JsonReader({
                id: "idejercicio",
                root: "datos",
                fields: [
                    {name: 'idejercicio'},
                    {name: 'nombre'}
                ]
            }),
            baseParams: {
                idestructura: _this.nodoPadre.attributes.id
            },
            listeners: {
                'load': function (store, records, options) {
                    if (records.length == 0) {
                        mostrarMensaje(1, _this.idioma.lbNoHayEjerciciosEntidad);
                    }
                    else {

                        _this.cbEjercicioIni.setValue(records[0].data.idejercicio);
                        _this.cbEjercicioIni.enable();

                        _this.cbEjercicioFin.setValue(records[records.length - 1].data.idejercicio);
                        _this.cbEjercicioFin.enable();


                        _this.stPeriodoIni.load({
                            params: {
                                idejercicio: records[0].data.idejercicio
                            }
                        });

                        _this.stPeriodoFin.load({
                            params: {
                                idejercicio: records[records.length - 1].data.idejercicio
                            }
                        });

                    }
                }
            }
        });


        // Combo para cargar los ejercicios...
        this.cbEjercicioIni = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbEjercicioInicial,
            hiddenName: 'idejercicioini',
            valueField: 'idejercicio',
            displayField: 'nombre',
            store: _this.stEjercicio,
            autoCreate: true,
            disabled: true,
            typeAhead: true,
            triggerAction: 'all',
            readOnly: true,
            mode: 'local',
            anchor: '95%'//,
            // emptyText: _this.idioma.lbEmptyTextCmb,
            /* listeners: {
             'select': function(combo, record, index){
             _this.stPeriodoIni.load({
             params: {
             idejercicio: record.get('idejercicio')
             }
             });
             _this.cbPeriodoIni.enable();
             }
             }*/
        });

        // Combo para cargar los ejercicios...
        this.cbEjercicioFin = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbEjercicioFinal,
            hiddenName: 'idejerciciofin',
            valueField: 'idejercicio',
            displayField: 'nombre',
            store: _this.stEjercicio,
            autoCreate: true,
            typeAhead: true,
            triggerAction: 'all',
            readOnly: true,
            mode: 'local',
            anchor: '95%',
            disabled: true//,
            //  emptyText: _this.idioma.lbEmptyTextCmb,
            /* listeners: {
             'select': function(combo, record, index){
             _this.stPeriodoFin.load({
             params: {
             idejercicio: record.get('idejercicio')
             }
             });
             _this.cbPeriodoFin.enable();
             }
             }*/
        });

        this.modal = true;
        this.layout = 'border';
        this.width = 500;
        this.height = 180;
        this.items = [{
            xtype: 'panel',
            region: 'center',
            layout: 'column',
            frame: true,
            items: [{
                columnWidth: .49,
                layout: 'form',
                labelAlign: 'top',
                items: [_this.cbEjercicioIni, _this.cbPeriodoIni]
            }, {
                columnWidth: .49,
                layout: 'form',
                labelAlign: 'top',
                items: [_this.cbEjercicioFin, _this.cbPeriodoFin]
            }]
        }];
        this.buttons = [
            {
                iconCls: 'cancelar',
                text: _this.idioma.btnCancelar,
                tooltip: _this.idioma.btnTplCancelar,
                handler: function () {
                    _this.close();
                }
            }, {
                iconCls: 'aceptar',
                text: _this.idioma.btnAceptar,
                tooltip: _this.idioma.btnTplAceptar,
                handler: function () {
                    var recIni = _this.stPeriodoIni.getAt(_this.stPeriodoIni.find('idperiodo', _this.cbPeriodoIni.getValue()));
                    var recFin = _this.stPeriodoFin.getAt(_this.stPeriodoFin.find('idperiodo', _this.cbPeriodoFin.getValue()));
                    _this.doAction(recIni.get('inicio'), recFin.get('fin'), _this.nodoPadre);
                    _this.close();
                }
            }
        ];
        this.title = this.idioma.lbTitleSelecPeriodo;

        Log.aft.submayor.WinPrintConfigSIRM.superclass.constructor.call(this, arguments);
    }
});

Log.aft.submayor.BusquedaEstatica = Ext.extend(LOG.util.Window, {
    grid: undefined,
    arearesp: undefined,
    idarearesp: undefined,
    cerrarAceptar: false,
    heitghInicial: 0,
    arrayAlturas: Array(),
    tipo: 1,
    constructor: function (config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(config.idioma, Log.aft.submayor.Idioma);
        this.title = this.idioma.lbBtnBuscarAvz;
        this.tipo = config.tipo;
        this.width = 100;
        this.resizable = true;
        this.model = config.model;
        this.view = config.view;
        this.plugins = new LOG.util.List();
        this.corePlugins = {};
        this.closeAction = 'hide';
        Log.aft.submayor.BusquedaEstatica.superclass.constructor.call(this, config);
        this.addEvents('clean');
        this.addEvents('find');
        this.addEvents('limiarcampos');
        this.listaBotones.getItem(2).disable();
        this.on({
            /*'beforeshow': function() {
             console.debug(_this.tipo)
             if (_this.tipo !=  1)
             _this.definirComponenteDin();
             },*/

            'resize': function (win, width, height) {
                if (_this.tipo == 1) {
                    _this.panel.setHeight(_this.getHeight() - 80);
                    _this.panelGeneral.doLayout();
                } else {
                    if (_this.getHeight() != _this.heitghInicial && _this.heitghInicial > 0) {
                        Ext.each(_this.tabpanel.items.items, function (o) {
                            o.setHeight(_this.getHeight() - 110);//110
                        });
                        _this.panelDatosG.setHeight(_this.getHeight() - 115);//115
                        _this.panelGeneral.doLayout();
                    }
                }
            },
            'show': function (cmp) {
                //_this.codigo.focus(false, 500);
                // _this.codigoReg.focus(false, 500);
            },
            'limiarcampos': function () {
                _this.LimpiarVGeneral();
                _this.LimpiarVRegNume();
            }
        });
        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    key: Ext.EventObject.ENTER,
                    fn: function () {
                        if (_this.btnAvaible) {
                            _this.listaBotones.getItem(2).handler(_this.listaBotones.getItem(2));
                        }
                    }
                }

            ]);

    },
    initComponent: function () {
        var _this = this;
        this.listaBotones.deleteAll();
        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonCancelar({
            text: _this.idioma.btnCerrar,
            handler: function () {
                this.scope.hide();
                Log.aft.submayor.View.busquedaP = false;
            },
            scope: this
        })));

        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            disabled: true,
            handler: function () {
                Log.aft.submayor.View.busquedaP = false;
                if (_this.tipo == 1) {
                    _this.LimpiarVGeneral()
                    _this.LimpiarVRegNume()
                } else {
                    _this.LimpiarVRegNume()
                }
                this.disable();
            }
        })));

        this.listaBotones.add(LOG.util.UIManager.reconfigureButton(LOG.util.Prototipos.botonBuscar({
            disabled: true,
            handler: function () {
               /* var _this = this;
                var form = _this.formDatosMedioR.getForm();
                form.items.each(function (field) {
                    if (field.isFormField) {
                        field.reset();
                        field.enable();
                        field.originalValue = field.getValue();
                    }
                });
                _this.model.reset();*/

                Log.aft.submayor.View.busquedaP = true;
                _this.fireEvent('find');
                if (_this.tipo == 1)
                    _this.model.buscar(1);
                if (_this.tipo == 2){
                    _this.model.buscar(2);
                }

                _this.close();
            }
        })));

        Log.aft.submayor.BusquedaEstatica.superclass.initComponent.call(this);
        this.camposGenerales = LOG.aft.RegOperativo.Campos;
        //Añadiendo vistas
        this.panelGeneral = new LOG.util.Panel({
            frame: true,
            region: 'center',
            layout: 'card',
            activeItem: 0,
            items: [/*_this.camposBusquedaVistaGeneral(),*/ _this.camposNulosSolamente()/*_this.camposBusquedaVistaRegNum()*/]
        });
        //Añadiendo plugins
        this.addPlugins();
        this.add(this.panelGeneral);


    },
    /**
     * Campos estáticos de la búsqueda para la vista general
     * **/
    camposBusquedaVistaGeneral: function () {
        var _this = this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });

        this.codigo = new LOG.util.Prototipos.inputTexto({
            name: 'codigo',
            fieldLabel: this.idioma.labelCodigo,
            width: 390,
            listeners: {
                'keyup': function (cb, e) {
                    _this.condicionButtons()

                }
            }
        });
        cls.addComponent(this.codigo);

        this.denominacion = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            fieldLabel: this.idioma.labelDenominacion,
            width: 390,
            listeners: {
                'keyup': function (cb, e) {
                    _this.condicionButtons()

                }
            }
        });
        cls.addComponent(this.denominacion)

        this.marca = new LOG.util.ComboBox({
            name: 'marca',
            fieldLabel: this.idioma.ldMarca,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
            displayField: 'denominacion',
            valueField: 'idmarca',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 15,
            width: 390,
            listeners: {
                'select': function (cb, re) {
                    _this.idmarcaG = re.data.idmarca;
                    _this.modelo.store.load();
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        this.marca.store.on({
            'beforeload': function (store) {
                Ext.apply(store.baseParams, {incluirvencidas: 2});
            }
        });
        cls.addComponent(this.marca);

        this.modelo = new LOG.util.ComboBox({
            name: 'modelo',
            fieldLabel: this.idioma.ldModelo,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
            displayField: 'denominacion',
            valueField: 'idmodelo',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 10,
            width: 390,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        this.modelo.store.on({
            'beforeload': function (store) {
                Ext.apply(store.baseParams, {idmarca: _this.idmarcaG, estado: 1});
            }
        });
        cls.addComponent(this.modelo);

        this.nacionalidad = new LOG.util.ComboBox({
            name: 'idpais',
            fieldLabel: this.idioma.labelNacionalidad,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarPaises',
            displayField: 'nombrepais',
            valueField: 'idpais',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 10,
            width: 390,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        cls.addComponent(this.nacionalidad);

        this.especialidad = new LOG.util.ComboBox({
            name: 'idespecialidadBuscar',
            fieldLabel: this.idioma.labelEspecialidad,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/cargarEspecialidad',
            // url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarEspecialidad',
            displayField: 'denespecialidad',
            valueField: 'idespecialidad',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 10,
            width: 390,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        cls.addComponent(this.especialidad);

        this.naturaleza = new LOG.util.TreeCombo({
            name: 'idnaturaleza',
            fieldLabel: this.idioma.ldNaturaleza,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            selectOnlyLeaf: true,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                }
            }
        });
        cls.addComponent(this.naturaleza);


        var numerics = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        /*Cantidad*/
        this.cantidad = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.minCant = new LOG.util.Prototipos.inputDecimal({
            name: 'minCant',
            fieldLabel: this.idioma.labelMin,
            width: 15,
            maxLength: 10,
            maxLengthText: _this.idioma.msgMaxLength,
            invalidText: this.idioma.msgRangoMin,
            listeners: {
                keyup: function () {
                    _this.condicionButtons()
                    if (this.getValue() > 0) {
                        this.validate();
                        _this.maxCant.validate();
                    }
                }
            },
            validator: function (value) {
                if (_this.maxCant.getValue() > 0 && this.getValue() > 0) {
                    if (value < _this.maxCant.getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            }
        });
        this.cantidad.addComponent(this.minCant);
        this.maxCant = new LOG.util.Prototipos.inputDecimal({
            name: 'maxCant',
            fieldLabel: this.idioma.labelMax,
            width: 15,
            maxLength: 10,
            maxLengthText: _this.idioma.msgMaxLength,
            invalidText: this.idioma.msgRangoMax,
            listeners: {
                keyup: function () {
                    _this.condicionButtons()
                    if (this.getValue() > 0) {
                        this.validate();
                        _this.minCant.validate();
                    }

                }
            },
            validator: function (value) {
                if (_this.minCant.getValue() > 0 && this.getValue() > 0) {
                    if (value > _this.minCant.getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            }
        });
        this.cantidad.addComponent(this.maxCant);
        var fieldCant = new Ext.form.FieldSet({
            title: this.idioma.labelCantidad,
            items: [this.cantidad]
        });
        numerics.addComponent(fieldCant);

        /*Disponibilidad*/
        this.disponibilidad = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.minDisp = new LOG.util.Prototipos.inputDecimal({
            name: 'minDisp',
            fieldLabel: this.idioma.labelMin,
            width: 15,
            maxLength: 10,
            maxLengthText: _this.idioma.msgMaxLength,
            invalidText: this.idioma.msgRangoMin,
            listeners: {
                keyup: function () {
                    _this.condicionButtons()
                    if (this.getValue() > 0) {
                        this.validate();
                        _this.maxDisp.validate();
                    }
                }
            },
            validator: function (value) {
                if (_this.maxDisp.getValue() > 0 && this.getValue() > 0) {
                    if (value < _this.maxDisp.getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            }
        });
        this.disponibilidad.addComponent(this.minDisp);
        this.maxDisp = new LOG.util.Prototipos.inputDecimal({
            name: 'maxDisp',
            fieldLabel: this.idioma.labelMax,
            width: 15,
            maxLength: 10,
            maxLengthText: _this.idioma.msgMaxLength,
            invalidText: this.idioma.msgRangoMax,
            listeners: {
                keyup: function () {
                    _this.condicionButtons()
                    if (this.getValue() > 0) {
                        this.validate();
                        _this.minDisp.validate();
                    }

                }
            },
            validator: function (value) {
                if (_this.minDisp.getValue() > 0 && this.getValue() > 0) {
                    if (value > _this.minDisp.getValue()) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }

            }
        });
        this.disponibilidad.addComponent(this.maxDisp);
        var fieldDisp = new Ext.form.FieldSet({
            title: this.idioma.labelDisponibilidad,
            items: [this.disponibilidad]
        });
        numerics.addComponent(fieldDisp);

        this.panel = new LOG.util.Panel({
            frame: true,
            region: 'center',
            items: [cls, numerics]
        });
        this.formDatosMedio = LOG.util.UIManager.initForm({
            items: [_this.panel]
        });
        _this.model.bindForm(_this.formDatosMedio);

        return this.formDatosMedio;
    },
    /**
     * Campos estáticos de la búsqueda para la vista de los regnumericos
     * **/
    camposBusquedaVistaRegNum: function () {
        var _this = this;
        _this.initPlugin();
        var campos = Array();
        //this.camposGenerales = LOG.aft.RegOperativo.Campos;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var numerics = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var array = Array();

        _this.codigoReg = new LOG.util.Prototipos.inputTexto({
            name: 'codigo',
            id: 'codigoReg',
            fieldLabel: this.idioma.labelCodigo,
            width: 390,
            listeners: {
                'keyup': function (cb, e) {
                    _this.condicionButtons()

                }
            }
        });
        cls.addComponent(_this.codigoReg);

        var denominacion = new LOG.util.Prototipos.inputTexto({
            name: 'denominacion',
            fieldLabel: this.idioma.labelDenominacion,
            width: 390,
            listeners: {
                'keyup': function (cb, e) {
                    _this.condicionButtons()

                }
            }
        });
        cls.addComponent(denominacion);

        this.marcaReg = new LOG.util.ComboBox({
            name: 'idmarca',
            fieldLabel: this.idioma.ldMarca,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getMarcas',
            displayField: 'denominacion',
            valueField: 'idmarca',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'local',
            pageSize: 15,
            width: 390,
            listeners: {
                'select': function (cb, re) {
                    _this.idmarca = re.data.idmarca;
                    _this.modeloReg.store.load();
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        this.marcaReg.store.on({
            'beforeload': function (store) {
                Ext.apply(store.baseParams, {incluirvencidas: 2, estado: 1});
            }
        });
        cls.addComponent(this.marcaReg);

        this.modeloReg = new LOG.util.ComboBox({
            name: 'idmodelo',
            fieldLabel: this.idioma.ldModelo,
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/getModelos',
            displayField: 'denominacion',
            valueField: 'idmodelo',
            queryParam: 'criterio',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            pageSize: 10,
            width: 390,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        this.modeloReg.store.on({
            'beforeload': function (store) {
                Ext.apply(store.baseParams, {idmarca: _this.idmarca, estado: 1});
            }
        });
        cls.addComponent(this.modeloReg);

        var naturalezaR = new LOG.util.TreeCombo({
            name: 'idnaturaleza',
            fieldLabel: this.idioma.ldNaturaleza,
            url: '/logistica/utiles/plugin/index.php/sistemasexternos/getNaturalezas',
            emptyText: this.idioma.lbSeleccione,
            mode: 'remote',
            selectOnlyLeaf: true,
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                }
            }
        });
        cls.addComponent(naturalezaR);

        if (_this.camposGenerales.nroserie) {
            _this.definirComponente(_this.camposGenerales.nroserie, cls);
            campos.push(['N.\xb0 de serie', 'nroserie']);
        }
        if (_this.camposGenerales.nroinventario) {
            _this.definirComponente(_this.camposGenerales.nroinventario, cls);
            campos.push(['N.\xb0 de inventario', 'nroinventario']);
        }
        if (_this.camposGenerales.idestatustecnico) {
            _this.definirComponente(_this.camposGenerales.idestatustecnico, cls);
            campos.push(['Estado t\xe9nico', 'idestatustecnico']);
        }
        //Esto no se emplea en transgaviota
        /* if (_this.camposGenerales.idresponsable) {
         _this.definirComponente(_this.camposGenerales.idresponsable, cls);
         campos.push(['Responsable', 'idresponsable']);
         }*/
        if (_this.camposGenerales.idarearesp) {
            _this.definirComponente(_this.camposGenerales.idarearesp, cls);
            campos.push(['\xc1rea de responsabilidad', 'idarearesp']);
        }
        /*if(_this.camposGenerales.idubicacion) {
         _this.definirComponente(_this.camposGenerales.idubicacion, cls)
         campos.push(['Ubicaci\xf3n', 'idubicacion']);
         }*/
        if (_this.camposGenerales.valorcontable) {
            if (alternativa) {
                var label = _this.camposGenerales.valorcontable.fieldLabel;
                if (label.indexOf(nommonedacontable) == -1)
                    label = label + ' ' + nommonedacontable;
                Ext.apply(_this.camposGenerales.valorcontable, {
                    fieldLabel: label
                });
                array.push(_this.camposGenerales.valorcontable);

                var labelAlt = _this.camposGenerales.valorcontablealternativo.fieldLabel;
                if (label.indexOf(nommonedaalternativa) == -1)
                    labelAlt = labelAlt + ' ' + nommonedaalternativa;
                Ext.apply(_this.camposGenerales.valorcontablealternativo, {
                    fieldLabel: labelAlt
                });
                array.push(_this.camposGenerales.valorcontablealternativo);
            } else {
                array.push(_this.camposGenerales.valorcontable);
            }

        }

        if (_this.camposGenerales.depreciacionacumulada) {
            if (alternativa) {
                var labelDep = _this.camposGenerales.depreciacionacumulada.fieldLabel;
                if (labelDep.indexOf(nommonedacontable) == -1)
                    labelDep = labelDep + ' ' + nommonedacontable;
                Ext.apply(_this.camposGenerales.depreciacionacumulada, {
                    fieldLabel: labelDep
                });
                array.push(_this.camposGenerales.depreciacionacumulada);

                var labelAltDep = _this.camposGenerales.depreciacionacumuladaalternativo.fieldLabel;
                if (labelAltDep.indexOf(nommonedaalternativa) == -1)
                    labelAltDep = labelAltDep + ' ' + nommonedaalternativa;
                Ext.apply(_this.camposGenerales.depreciacionacumuladaalternativo, {
                    fieldLabel: labelAltDep
                });
                array.push(_this.camposGenerales.depreciacionacumuladaalternativo);
            } else {
                array.push(_this.camposGenerales.depreciacionacumulada);
            }
        }

        var tipos = [
            ['Insertado', '1'],
            ['Registrado', '2'],
            ['Alquilado proveedor', '3'],
            ['Alquilado cliente', '4'],
            ['Prestado', '5'],
            ['Reparacion', '6'],
            ['Trasladado', '7'],
            ['Baja', '8'],
        ];
        var storeTipo = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'estadoperacion'
                },
                {
                    name: 'idestadoperacion'
                }
            ]
        });
        storeTipo.loadData(tipos);
        var tipoOperacion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.lbOperacion,
            name: 'idestadoperacion',
            width: 360,
            store: storeTipo,
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            displayField: 'estadoperacion',
            valueField: 'idestadoperacion',
            listeners: {
                'select': function (cb, e) {
                    _this.condicionButtons()
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        cls.addComponent(tipoOperacion);

        var storeCampos = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'denominacion'
                },
                {
                    name: 'id'
                }
            ]
        });
        storeCampos.loadData(campos);
        var comboCampos = new LOG.util.LovCombo({
            fieldLabel: this.idioma.labelCamposNull,
            name: 'camposnullGen',
            width: 360,
            store: storeCampos,
            nameplugin: 'Datos generales',
            resizable: true,
            minListWidth: 300,
            emptyText: this.idioma.lbSeleccione,
            displayField: 'denominacion',
            valueField: 'id',
            listeners: {
                'select': function (cb, e) {
                    if (e.data.checked && cb.getValue()) {
                        _this.findById(e.data.id).reset();
                        _this.findById(e.data.id).disable();
                        _this.condicionButtons()
                    } else {
                        _this.model.listaCamposNull.each(function (o, p) {
                            if (o.valor == e.data.id && o.name == cb.nameplugin)
                                this.delete(p)
                        });
                        _this.findById(e.data.id).reset();
                        _this.findById(e.data.id).enable();
                        _this.condicionButtons(false)
                    }
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        cls.addComponent(comboCampos);

        _this.elementosNumericos(array, numerics);

        this.panelDatosG = new LOG.util.Panel({
            frame: true,
            region: 'center',
            // height: 520,
            title: this.idioma.labelDatosGenerales,
            items: [cls, numerics]
        });

        this.tabpanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.panelDatosG]
        });
        _this.formDatosMedioR = LOG.util.UIManager.initForm({
            items: [_this.tabpanel]
        });
        _this.model.initListaGeneral(_this.formDatosMedioR);
        var totalFilas = cls.getColumn(0).items.length * 65 + numerics.getColumn(0).items.length * 80;
        _this.arrayAlturas.push(totalFilas);
        return _this.formDatosMedioR;
    },
    camposNulosSolamente: function () {
        var _this = this;
        _this.columnForm = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var campos = Array();
        for (var prop in _this.camposGenerales) {
            var cmp = _this.camposGenerales[prop];
            var index = _this.view.getGridPrincipal().getColumnModel().findColumnIndex(cmp.dataIndex);
            if (index != -1) {
                if (alternativa) {
                    if (cmp.contable)
                        campos.push([cmp.display + ' ' + nommonedacontable, cmp.name]);
                    else if (cmp.dataIndex.indexOf('alternativo') != -1)
                        campos.push([cmp.display + ' ' + nommonedaalternativa, cmp.name]);
                    else campos.push([cmp.display, cmp.name]);
                } else if (cmp.dataIndex.indexOf('alternativo') == -1)
                    campos.push([cmp.display, cmp.name]);
            }
        };
        var storeCampos = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'denominacion'
                },
                {
                    name: 'id'
                }
            ]
        });
        storeCampos.loadData(campos);
        var comboCampos = new LOG.util.LovCombo({
            fieldLabel: this.idioma.labelDatosGenerales,
            name: 'camposnullGen',
            width: 260,
            store: storeCampos,
            nameplugin: 'Datos generales',
            resizable: true,
            minListWidth: 250,
            emptyText: this.idioma.lbSeleccione,
            displayField: 'denominacion',
            valueField: 'id',
            listeners: {
                'select': function (cb, e) {
                    if (e.data.checked && cb.getValue()) {
                        var index = _this.view.getGridPrincipal().getColumnModel().findColumnIndex(e.data.id);
                        var column = _this.view.getGridPrincipal().getColumnModel().getColumnAt(index);
                        Ext.apply(column, {
                            menuDisabled: true
                        });
                        _this.condicionButtons()
                    } else {
                        var index = _this.view.getGridPrincipal().getColumnModel().findColumnIndex(e.data.id);
                        var column = _this.view.getGridPrincipal().getColumnModel().getColumnAt(index);
                        Ext.apply(column, {
                            menuDisabled: false
                        });
                        _this.model.listaCamposNull.each(function (o, p) {
                            if (o.valor == e.data.id && o.name == cb.nameplugin)
                                this.delete(p)
                        });
                        _this.condicionButtons(false)
                    }
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        _this.columnForm.addComponent(comboCampos);
        this.panelDatosG = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: this.idioma.labelDatosNull,
            items: [_this.columnForm]
        });

        this.tabpanel = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            items: [this.panelDatosG]
        });
        _this.formDatosMedioR = LOG.util.UIManager.initForm({
            items: [_this.tabpanel]
        });
        _this.model.initListaGeneral(_this.formDatosMedioR);
        var totalFilas = _this.columnForm.getColumn(0).items.length * 65;
        _this.arrayAlturas.push(totalFilas);
        return _this.formDatosMedioR;
    },
    /**
     * Campos por naturaleza de la búsqueda para la vista de los regnumericos
     * **/
    camposPorNaturaleza: function () {
        var _this = this;
        if (_this.paramsDin.length > 0) {
            this.camposGenerales = LOG.aft.RegOperativo.Campos;
            var cls = LOG.util.UIManager.initColumnForm({
                columnas: 4
            });
            var numerics = LOG.util.UIManager.initColumnForm({
                columnas: 4
            });
            var array = Array();
            for (var prop in _this.camposGenerales) {
                var campo = _this.camposGenerales[prop];
                if (campo.xtype == 'numberfield' && (campo.name == 'cantidadrecursoconsumido' || campo.name == 'vidautil'
                    || campo.name == 'porcientorecuperacion' || campo.name == 'valoradquisicion')) {
                    array.push(campo);
                } else {
                    if (campo.name != 'iddeposito' && campo.name != 'nroserie' && campo.name != 'nroinventario' &&
                        campo.name != 'idestatustecnico' && campo.name != 'responsable' && campo.name != 'ubicacion') {
                        _this.definirComponente(campo, cls);
                    }
                }
            }
            _this.elementosNumericos(array, numerics);
            this.panelDatosNat = new LOG.util.Panel({
                frame: true,
                region: 'center',
                height: 520,
                title: this.idioma.labelDatosNaturaleza,
                items: [cls, numerics]
            });
            _this.tabpanel.add(_this.panelDatosNat);
        }

    },
    /**
     * Campos dinámicos de la búsqueda para la vista de los regnumericos
     * **/
    crearCamposPlugins: function (campos, columnas) {
        var _this = this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 4
        });
        var columnFechas = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        var arrCampos = _this.prepararCamposDin(campos, columnas);
        var title = '';
        for (var prop in arrCampos) {
            var cmp = arrCampos[prop];
            title = cmp.nameplugin;
            break;
        }
        var panelPlugin = new LOG.util.Panel({
            frame: true,
            region: 'center',
            title: title,
            items: [cls, columnFechas]
        });
        var camposnull = Array();
        var fechas = Array();
        for (var prop in arrCampos) {
            var cmp = arrCampos[prop];
            if (cmp.name && cmp.xtype != 'datefield')
                camposnull.push([cmp.fieldLabel, cmp.name, 0]);
            if (cmp.name && cmp.xtype == 'datefield')
                camposnull.push([cmp.fieldLabel, cmp.name, 1]);
            /*if (cmp.xtype == 'datefield') {
             fechas.push(cmp);
             } else {
             _this.definirComponente(cmp, cls);
             }*/
        }
        var storeCampos = new Ext.data.SimpleStore({
            fields: [
                {
                    name: 'denominacion'
                },
                {
                    name: 'id'
                },
                {
                    name: 'rango'
                }
            ]
        });
        storeCampos.loadData(camposnull);
        var comboCampos = new LOG.util.LovCombo({
            //fieldLabel: this.idioma.labelCamposNull,
            fieldLabel: title,
            name: 'camposnullPlg',
            width: 260,
            nameplugin: title,
            store: storeCampos,
            resizable: true,
            minListWidth: 250,
            emptyText: this.idioma.lbSeleccione,
            displayField: 'denominacion',
            valueField: 'id',
            listeners: {
                'select': function (cb, e) {
                    if (e.data.checked && cb.getValue()) {
                        /*if (!e.data.rango) {
                         _this.findById(e.data.id).reset();
                         _this.findById(e.data.id).disable();
                         } else {
                         _this.findById('min_' + e.data.id).reset();
                         _this.findById('min_' + e.data.id).disable();
                         _this.findById('max_' + e.data.id).reset();
                         _this.findById('max_' + e.data.id).disable();
                         }*/
                        var index = _this.view.getGridPrincipal().getColumnModel().findColumnIndex(e.data.id);
                        var column = _this.view.getGridPrincipal().getColumnModel().getColumnAt(index);
                        Ext.apply(column, {
                            menuDisabled: true
                        });
                        _this.condicionButtons(true)
                    } else {
                        var index = _this.view.getGridPrincipal().getColumnModel().findColumnIndex(e.data.id);
                        var column = _this.view.getGridPrincipal().getColumnModel().getColumnAt(index);
                        Ext.apply(column, {
                            menuDisabled: false
                        });
                        _this.model.listaCamposNull.each(function (o, p) {
                            if (o.valor == e.data.id && o.name == cb.nameplugin)
                                this.delete(p)
                        });
                        /*if (!e.data.rango) {
                         _this.findById(e.data.id).reset();
                         _this.findById(e.data.id).enable()
                         } else {
                         _this.findById('min_' + e.data.id).reset();
                         _this.findById('min_' + e.data.id).enable();
                         _this.findById('max_' + e.data.id).reset();
                         _this.findById('max_' + e.data.id).enable();
                         }*/
                        _this.condicionButtons(false);

                    }
                },
                'keyup': function (cb, e) {
                    if (e.getKey() != 9 && e.getKey() != 13) {
                        if (this.isDirty()) {
                            _this.listaBotones.getItem(2).disable();
                        }
                    }
                }
            }
        });
        var formDatosPlugin = LOG.util.UIManager.initForm({
            items: [comboCampos]
        });
        _this.model.initListaPlg(formDatosPlugin, title);
        _this.columnForm.addComponent(comboCampos);

        /*cls.addComponent(comboCampos);
         _this.panelDatosG.add(cls);
         _this.elementosFechas(fechas, columnFechas);
         panelPlugin.doLayout();
         this.formDatosPlugin = LOG.util.UIManager.initForm({
         items: [panelPlugin]
         });
         _this.model.initListaPlg(this.formDatosPlugin, title);
         _this.tabpanel.add(panelPlugin);
         var totalFilas = cls.getColumn(0).items.length * 65 + columnFechas.getColumn(0).items.length * 80;
         _this.arrayAlturas.push(totalFilas);*/
    },
    /**
     * Auxiliar para rango de los elementos númericos
     * **/
    elementosNumericos: function (array, numerics) {
        var _this = this;
        Ext.each(array, function (o) {
            var columns = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var minvalor = new LOG.util.Prototipos.inputDecimal({
                name: 'min_' + o.name,
                fieldLabel: _this.idioma.labelMin,
                width: 2,
                maxLength: 10,
                maxLengthText: _this.idioma.msgMaxLength,
                invalidText: _this.idioma.msgRangoMin,
                listeners: {
                    keyup: function () {
                        _this.condicionButtons()
                        if (this.getValue() > 0) {
                            this.validate();
                            maxvalor.validate();
                        }
                    }
                },
                validator: function (value) {
                    if (maxvalor.getValue() > 0 && this.getValue() > 0) {
                        if (value < maxvalor.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }

                }
            });
            columns.addComponent(minvalor);

            var maxvalor = new LOG.util.Prototipos.inputDecimal({
                name: 'max_' + o.name,
                fieldLabel: _this.idioma.labelMax,
                width: 2,
                maxLength: 10,
                maxLengthText: _this.idioma.msgMaxLength,
                invalidText: _this.idioma.msgRangoMax,
                listeners: {
                    keyup: function () {
                        _this.condicionButtons()
                        if (this.getValue() > 0) {
                            this.validate();
                            minvalor.validate();
                        }

                    }
                },
                validator: function (value) {
                    if (minvalor.getValue() > 0 && this.getValue() > 0) {
                        if (value > minvalor.getValue()) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }

                }
            });
            columns.addComponent(maxvalor);
            var fieldValor = new Ext.form.FieldSet({
                title: o.fieldLabel,
                items: [columns]
            });
            numerics.addComponent(fieldValor);

        });
    },
    /**
     * Auxiliar para rango de los elementos de fechas
     * **/
    elementosFechas: function (array, fechas) {
        var _this = this;
        Ext.each(array, function (o) {
            var columns = LOG.util.UIManager.initColumnForm({
                columnas: 2
            });
            var minvalor = new Ext.form.DateField({
                fieldLabel: _this.idioma.labelMinFecha,
                name: 'min_' + o.name,
                id: 'min_' + o.name,
                allowBlank: true,
                vtype: 'daterange',
                format: 'm/d/Y',
                editable: false,
                validarEnFormBasico: true,
                listeners: {
                    'select': function (campo) {
                        maxvalor.setMinValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(minvalor);
            var maxvalor = new Ext.form.DateField({
                name: 'max_' + o.name,
                id: 'max_' + o.name,
                fieldLabel: _this.idioma.labelMaxFech,
                startDateField: minvalor,
                editable: false,
                format: 'm/d/Y',
                vtype: 'daterange',
                validarEnFormBasico: true,
                allowBlank: true,
                listeners: {
                    select: function (campo) {
                        minvalor.setMaxValue(campo.getValue());
                        _this.condicionButtons();
                    }
                }
            });
            columns.addComponent(maxvalor);
            var fieldValor = new Ext.form.FieldSet({
                title: o.fieldLabel,
                items: [columns]
            });
            fechas.addComponent(fieldValor);

        });
    },
    /**
     * Auxiliar para crear campos de los datos generales y plugins
     * **/
    definirComponente: function (cmp, cls) {
        var _this = this;
        switch (cmp.xtype) {
            case 'textfield':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'keyup': function (cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'numberfield':
                var field = new Ext.form.NumberField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    id: cmp.name,
                    enableKeyEvents: true,
                    fieldLabel: cmp.fieldLabel,
                    maxLength: 30,
                    regexText: _this.idioma.ttnanTextEntero
                });
                field.on({
                    'keyup': function (cb, e) {
                        _this.condicionButtons()

                    }
                });
                cls.addComponent(field)
                break;
            case 'combobox':
                if (cmp.nameInRecord != 'idarearesp') {
                    var arrURL = cmp.url.split('/');
                    if (arrURL.length == 1) {
                        cmp.url = '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/' + arrURL[0];
                    }
                    var comboAux = new LOG.util.ComboBox(cmp);
                    var field = new Ext.form.ComboBox(cmp);
                    Ext.apply(field, {
                        allowBlank: true,
                        id: cmp.valorEnviar,
                        name: cmp.valorEnviar,
                        resizable: true,
                        minListWidth: 300,
                        queryParam: 'criterio',
                        mode: 'remote',
                        enableKeyEvents: true,
                        emptyText: this.idioma.lbSeleccione,
                        url: comboAux.url,
                        store: comboAux.store,
                        fieldLabel: cmp.fieldLabel
                    });
                    if (cmp.nameInRecord == 'denomcolorprim') {
                        field.store.baseParams.colorPrimario = 1;
                    }
                }
                if (cmp.nameInRecord == 'idarearesp') {
                    var field = new Ext.LOG.RegNumOperativo.ComboDepositos({
                        allowBlank: true,
                        fieldLabel: cmp.fieldLabel,
                        valueField: cmp.valueField,
                        name: cmp.valorEnviar,
                        id: cmp.valorEnviar,
                        autoCreate: true,
                        typeAhead: true,
                        triggerAction: 'all',
                        resizable: true,
                        enableKeyEvents: true,
                        forceSelection: true,
                        idioma: _this.idioma,
                        width: 216,
                        editable: false,
                        emptyText: _this.idioma.lbCbVacio
                    });
                }
                field.on({
                    'select': function (cb, re) {
                        _this.arearesp = re.data.deposito;
                        _this.idarearesp = re.data.iddeposito;
                        //_this.findById('idubicacion').enable();
                        _this.condicionButtons()
                    },
                    'keyup': function (cb, e) {
                        if (e.getKey() != 9 && e.getKey() != 13) {
                            if (this.isDirty()) {
                                _this.listaBotones.getItem(2).disable();
                            }
                        }
                    }
                });
                cls.addComponent(field)
                break;
            case 'datefield':
                var field = new Ext.form.DateField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    id: cmp.name,
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'select': function (cb, e) {
                        _this.condicionButtons()
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_responsable':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    idresponsable: undefined,
                    id: 'idresponsable',
                    name: 'idresponsable',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function (field) {

                        var panelBusPer;
                        if (!winBuscarPersona) {
                            var panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                region: 'center',
                                id: 'panelBusPer',
                                singleSelect: true,
                                identidad: perfil.idestructuracomun,
                                showBtnAdicionar: true,
                                modulo: 'LOGISTICA',
                                showBtnAyuda: false,
								limit: 15,
								start: 0
                            });
                            /*panelBusPer = new Ext.pvd.persona.buscarpersona.panelBuscarpersona({
                                seguridad: 0,
                                listeners: {
                                    'personaselecionada': function() {
                                        btnAceptarBusPer.enable();
                                    },
                                    'personadeselecionada': function() {
                                        btnAceptarBusPer.disable();
                                    }
                                },
                                limit: 15,
                                start: 0
                            })*/

                            /*var btnAceptar = new LOG.util.Prototipos.botonAceptar({
                             listeners: {
                             'click': function() {
                             if (panelBusPer.getSeleccion()) {
                             field.idresponsable = panelBusPer.getSeleccion().get('idpersona');
                             var nombre = panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') +
                             ' ' + panelBusPer.getSeleccion().get('sapel');
                             field.setValue(nombre);
                             field.fireEvent('blur');
                             }
                             _this.condicionButtons();
                             winBusPer.close();
                             }

                             }
                             });
                             var btnCancelar = new LOG.util.Prototipos.botonCancelar({
                             text: 'Cancelar',
                             iconCls: 'cancelar',
                             listeners: {
                             'click': function() {
                             winBusPer.close();
                             }

                             }
                             });*/

                            var winBuscarPersona = new Ext.LOG.RegNumOperativo.winResponsable({
                                title: 'Personas',
                                layout: 'fit',
                                initComponent: function (config) {
                                    Ext.LOG.RegNumOperativo.winResponsable.superclass.initComponent.call(this);
                                    LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
                                        handler: function () {
                                            winBuscarPersona.destroy();
                                        }
                                    });
                                    LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
                                        disabled: true,
                                        handler: function () {
                                            if (panelBusPer.getSeleccion()) {
                                                field.idresponsable = panelBusPer.getSeleccion().get('idpersona');
                                                var nombre = panelBusPer.getSeleccion().get('nombre') + ' ' + panelBusPer.getSeleccion().get('papel') +
                                                    ' ' + panelBusPer.getSeleccion().get('sapel');
                                                field.setValue(nombre);
                                                field.fireEvent('blur');
                                            }
                                            _this.condicionButtons();
                                            winBuscarPersona.close();
                                        }
                                    });
                                }
                            });
                            winBuscarPersona.add(panelBusPer);
                            winBuscarPersona.show();
                            panelBusPer.smPersonas.on({
                                'rowselect': function (sm, rowIndex, r) {
                                    if (sm.selections.items.length > 0) {
                                        winBuscarPersona.listaBotones.getItem(2).enable();
                                    } else {
                                        winBuscarPersona.listaBotones.getItem(2).disable();
                                    }
                                },
                                'rowdeselect': function (sm, rowIndex, r) {
                                    if (sm.selections.items.length > 0) {
                                        winBuscarPersona.listaBotones.getItem(2).enable();
                                    } else {
                                        winBuscarPersona.listaBotones.getItem(2).disable();
                                    }
                                }
                            });
                            panelBusPer.runSearch = function (condiciones) {
                                if (condiciones.length > 0) {
                                    condiciones[condiciones.length - 1].logico = '';
                                    panelBusPer.hasSearch = true;
                                    panelBusPer.searchField.setVisibleBtnClear(panelBusPer.hasSearch);
                                } else {
                                    panelBusPer.hasSearch = false;
                                    panelBusPer.searchField.setVisibleBtnClear(this.hasSearch);
                                }
                                panelBusPer.stPersonas.baseParams.condiciones = Ext.encode(condiciones);
                                panelBusPer.stPersonas.load();
                            }
                            panelBusPer.cleanSearch = function () {

                                panelBusPer.fpAdvancedSearch.getForm().reset();
                                panelBusPer.stPersonas.baseParams.condiciones = '';
                                if (panelBusPer.fpAdvancedSearch.isVisible())
                                    panelBusPer.tfNumero.focus(true, 100);
                                panelBusPer.btnCleanSearch.disable();
                                panelBusPer.btnSearch.disable();
                                panelBusPer.searchField.setValue(" ");
                            }

                        }
                        else {
                            winBuscarPersona.show();
                        }
                    }
                });
                cls.addComponent(field)
                break;

            case 'win_ubicacion':
                var field = new Ext.form.TextField(cmp);
                Ext.apply(field, {
                    allowBlank: true,
                    disabled: true,
                    idubicacion: undefined,
                    id: 'idubicacion',
                    name: 'idubicacion',
                    fieldLabel: cmp.fieldLabel
                });
                field.on({
                    'focus': function (field) {
                        Ext.getBody().mask(_this.idioma.lbLoad, 'x-mask-loading');
                        var objParams = new Object();
                        objParams.tipoestructura = 2;
                        objParams.arearesp = _this.arearesp;
                        objParams.idubicacion = _this.idarearesp;
                        objParams.doAction = function (obj_nodoSeleccionado) {
                            if (obj_nodoSeleccionado.getDepth() != 0) {
                                _this.Ubicacion.btnAceptar.enable()
                            } else {
                                _this.Ubicacion.btnAceptar.disable()
                            }
                            field.idubicacion = obj_nodoSeleccionado.id;
                            field.setValue(obj_nodoSeleccionado.text);
                            field.fireEvent('blur');
                            _this.Ubicacion.hide();
                        }
                        objParams.listeners = {
                            'beforeshow': function () {
                                _this.Ubicacion.idioma.lbMsgNoEstructuras = _this.idioma.lbMsgNoEstructuras;
                                _this.Ubicacion.tpEstructurae.on({
                                    'click': function (node, e) {
                                        _this.Ubicacion.btnAceptar.setDisabled(node.getDepth() == 0)
                                    }
                                });
                                Ext.getBody().unmask(_this.Ubicacion);
                                _this.Ubicacion.btnAceptar.disable()
                            }
                        }

                        _this.Ubicacion = new Ext.Log.Treestructuraubicacion.ventana(objParams);
                    }
                });
                cls.addComponent(field)
                break;
        }
    },
    /**
     * Auxiliar para crear campos de los datos dinámicos
     * **/
    definirComponenteDin: function () {
        var _this = this;
        _this.LimpiarTabPanel();
        if (_this.paramsDin.length > 0) {
            var record = _this.paramsDin[0].data;
            var objSubmit = {
                idindicador: record.idindicador,
                arridtablas: record.arridtablas,
                idtabla: record.idtabla
            };
            Ext.Ajax.request({
                url: '/logistica/activos_fijos/regoperativo/index.php/gestregoperativo/cargarconfiguracionDatos',
                method: 'POST',
                params: objSubmit,
                callback: function (o, s, r) {
                    var resp = LOG.util.UIManager.decodeAjaxResponse(r).datos.componentes;
                    if (resp.length > 0) {
                        this.formDatosDin = LOG.util.UIManager.initForm({});
                        var obj = _this.agruparCampos(resp);
                        for (var prop in obj) {
                            var cmp = obj[prop];
                            var cls = LOG.util.UIManager.initColumnForm({
                                columnas: 4
                            });
                            var panel = new LOG.util.Panel({
                                frame: true,
                                //region: 'center',
                                title: prop,
                                items: [cls]
                            });
                            Ext.each(cmp, function (o) {
                                _this.definirComponente(o, cls);
                            });
                            cls.doLayout();
                            panel.doLayout();
                            this.formDatosDin.add(panel);
                            _this.model.initListaDin(this.formDatosDin);
                            _this.tabpanel.add(panel);
                            var totalFilas = cls.getColumn(0).items.length * 65;
                            _this.arrayAlturas.push(totalFilas);
                        }
                        _this.recalcularAlturaGeneral();
                        _this.body.unmask();
                    } else {
                        _this.body.unmask();
                    }
                }
            });
        }
    },
    /**
     * Auxiliar para agrupar campos dinámicos en tabs según el tab dinámico
     * **/
    agruparCampos: function (array) {
        var campos = {};
        Ext.each(array, function (obj) {
            campos[obj.tab] = Array();
        });
        Ext.each(array, function (obj) {
            campos[obj.tab].push(obj);
        });
        return campos;
    },
    /**
     * Auxiliar para preparar los campos dinámicos a crear
     * **/
    prepararCamposDin: function (obj1, obj2) {
        var array = Array();
        for (var prop1 in obj1) {
            Ext.each(obj2, function (prop2) {
                if (obj1[prop1].name == prop2.dataIndex)
                    array.push(obj1[prop1]);
            });
        }
        return array;
    },
    /**
     * Auxiliar para recalcular altura
     **/
    recalcularAlturaGeneral: function () {
        var _this = this;
        var tempPrimario = _this.arrayAlturas[0];
        var tempSecundario = 0;
        Ext.each(_this.arrayAlturas, function (o, p) {
            tempSecundario = _this.arrayAlturas[p + 1];
            if (tempPrimario < tempSecundario)
                tempPrimario = tempSecundario;
        });
        _this.setHeight(tempPrimario + 140);//115
        _this.heitghInicial = tempPrimario + 130;//115
        Ext.each(_this.tabpanel.items.items, function (o, p) {
            o.setHeight(tempPrimario);
        });
        _this.panelDatosG.setHeight(tempPrimario);
        _this.panelDatosG.doLayout();
        _this.panelGeneral.doLayout();
    },
    /**
     * Auxiliares para limpiar las vistas
     **/
    LimpiarVGeneral: function (cerrar) {
        var _this = this;
        /*var form = _this.formDatosMedio.getForm();
         form.items.each(function(field) {
         if (field.isFormField) {
         field.reset();
         field.originalValue = field.getValue();
         }
         });*/
        _this.model.reset();
        // _this.model.basicForm.reset();
        /* var param = {};
         param['idmarca'] = null;
         this.modelo.store.load({params: param});*/
        _this.listaBotones.getItem(2).disable();
        if (!cerrar)
            _this.fireEvent('clean');
        var columns = _this.view.getGridPrincipal().getColumnModel().config;
        Ext.each(columns, function (col) {
            Ext.apply(col, {
                menuDisabled: false
            });
        });
    },
    LimpiarVRegNume: function (cerrar) {
        var _this = this;
        var form = _this.formDatosMedioR.getForm();
        form.items.each(function (field) {
            if (field.isFormField) {
                field.reset();
                field.enable();
                field.originalValue = field.getValue();
            }
        });
        _this.model.limpiarLista();
        _this.model.reset();
        //_this.findById('idubicacion').disable();
        var param = {};
        param['idmarca'] = null;
        //_this.modeloReg.store.load({params: param});
        _this.listaBotones.getItem(2).disable();
        if (!cerrar)
            _this.fireEvent('clean');
        var columns = _this.view.getGridPrincipal().getColumnModel().config;
        Ext.each(columns, function (col) {
            Ext.apply(col, {
                menuDisabled: false
            });
        });
    },
    LimpiarTabPanel: function () {
        var _this = this;
        _this.tabpanel.items.each(function (o, p) {
            if (p > 1)
                _this.tabpanel.remove(o);
        });
        var columns = _this.view.getGridPrincipal().getColumnModel().config;
        Ext.each(columns, function (col) {
            Ext.apply(col, {
                menuDisabled: false
            });
        });
    },
    /**
     * Auxiliar para validar boton buscar
     **/
    condicionButtons: function (check) {
        var _this = this;

        if (_this.tipo == 1) {
            var form = _this.formDatosMedio.getForm();
        } else {
            var form = _this.formDatosMedioR.getForm();
        }

        if (check && form.isValid() && form.isDirty()) {
            _this.btnAvaible = true;
            _this.listaBotones.getItem(1).enable();
            _this.listaBotones.getItem(2).enable();
        } else {
            if (!check && form.isValid() && form.isDirty()) {
                _this.listaBotones.getItem(1).enable();
                _this.listaBotones.getItem(2).enable();
                _this.btnAvaible = true;
            } else {
                _this.listaBotones.getItem(1).disable();
                _this.listaBotones.getItem(2).disable();
                _this.btnAvaible = false;
            }

        }
    },
    /**
     * Auxiliar para cambiar de vista
     **/
    setVista: function (item) {
        var _this = this;
        _this.panelGeneral.getLayout().setActiveItem(item);
        if (item == 0) {
            _this.setHeight(338);
            _this.setWidth(625);
            _this.center();
        } else {
            //_this.definirComponenteDin();
            _this.recalcularAlturaGeneral();
            //_this.setHeight(455);
            _this.setWidth(500);//760
            _this.center();
        }
    },
    /**
     * Auxiliar para cambiar el tipo de vista
     **/
    setTipo: function (tipo) {
        var _this = this;
        _this.tipo = tipo;
        _this.fireEvent('resize');
    },
    /**
     * Tratamiento de plugins
     **/
    addPlugins: function () {
        for (var i = 0; i < arrCampos.length; i++) {
            this.attatchPlugin(arrCampos[i]);
        }
        this.arrayColumns = Array();
        for (var i = 0; i < arrElementosGridCodigoNew.length; i++) {
            this.arrayColumns.push(arrElementosGridCodigoNew[i]);
        }
    },
    attatchPlugin: function (plugin) {
        this.plugins.add(plugin);
    },
    initPlugin: function () {
        var _this = this;
        _this.corePlugins['campos'] = {};
        _this.plugins.each(function (plugin, pos) {
            plugin.init(_this.corePlugins);
            if (!_this.isEmpty(_this.corePlugins.campos)) {
                _this.crearCamposPlugins(_this.corePlugins.campos, _this.arrayColumns[pos].getArrCampos());
            }
        });

    },
    isEmpty: function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

});
Log.aft.submayor.winResponsable = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        Ext.apply(this, config);
        this.resizable = false;
        this.usarAplicar = false;
        this.closeAction = 'close';
        this.width = 800;
        this.height = 600;
        this.modal = true;
        Log.aft.submayor.winResponsable.superclass.constructor.call(this, config);
    }
});

Log.aft.submayor.WinConfigReporte = Ext.extend(LOG.util.Window, {
    width:600,
    height:300,
    resizable:false,
    constrain : true,
    autoValidate:true,
    closeAction:'close',
    title:"Configurar reporte",
    constructor: function (config) {
        Ext.apply(this, config);
        var _this = this;

        var panelFechas = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var panelFiltrar = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var panelGeneral = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var checkCampos = new Ext.form.Checkbox({
            boxLabel: "Usar filtro",
            name:'filtro',
            listeners:{
                'check':function(chek, valor){
                    var fun = (valor)?'enable':'disable';
                        fechaFinal[fun]();
                        fechaFinal[fun]();
                        fechaInicial[fun]();
                        groupRadioCampoFiltrar[fun]();
                }
            }
        });

        var fechaInicial = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: "Fecha inicial",
            name: 'minfecha',
            format: 'd-m-Y',
            editable: false,
            disabled:true,
            allowBlank:false,
            listeners: {
                'select': function (df, value) {
                    fechaFinal.setMinValue(value);

                }
            }
        });
        panelFechas.addComponent(fechaInicial);

        var fechaFinal = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: "Fecha final",
            name: 'maxfecha',
            format: 'd-m-Y',
            editable: false,
            disabled: true,
            allowBlank: false,
            listeners: {
                'select': function (df, value) {
                    fechaInicial.setMaxValue(value);
                }
            }
        });
        panelFechas.addComponent(fechaFinal);

        var fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar Fechas
            title: "Rango de fechas",
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [panelFechas]
        });

        panelFiltrar.addComponent(fsRangoFecha);

        var groupRadioCampoFiltrar = new Ext.form.RadioGroup({
            //name: 'campos',
            columns: 3,
            disabled: true,
            itemCls: 'x-check-group-alt',
            //vertical: true,
            items: [{
                boxLabel: 'FICAV',
                name: 'campos',
                inputValue: '1',
                checked: true
            }, {
                boxLabel: "LOT",
                name: 'campos',
                inputValue: '2'
            }, {
                boxLabel: "Circulaci\xf3n",
                name: 'campos',
                inputValue: '3'
            }],
            listeners: {
                change: function (rb, newValue, oldValue) {

                }
            }
        });

        var fsCamposComparar = new Ext.form.FieldSet({ //fieldset Seleccionar Fechas
            title: "Campo pr\xf3ximo a vencer",
            //style: '-moz-border-radius:1px',
            labelAlign: 'top',
            autoHeight: true,
            items: [groupRadioCampoFiltrar]
        });
        panelFiltrar.addComponent(fsCamposComparar);
        panelGeneral.addComponent(panelFiltrar);
        panelGeneral.addComponent(checkCampos);

        panelGeneral.getColumn(0).columnWidth = 0.8;
        panelGeneral.getColumn(1).columnWidth = 0.2;

        this.panelFormGeneral = LOG.util.UIManager.initForm({//Formulario que contiene los elementos
            region: "center",
            frame:true,
            items:[panelGeneral]
        });
        this.items = [_this.panelFormGeneral];
        Log.aft.submayor.WinConfigReporte.superclass.constructor.call(this, config);
    },
    doAction: function (params) {
    },
    aceptarFn: function () {
        this.doAction(this.panelFormGeneral.getForm().getValues());
    }
});
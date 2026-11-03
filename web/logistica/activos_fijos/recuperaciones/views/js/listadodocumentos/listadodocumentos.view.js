/**
 * Created by yoendy on 2/23/2016.
 */
Ext.ns('LOG.aft.listadodocumentos');
LOG.aft.listadodocumentos.view = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.layout = 'border';
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadodocumentos.Idioma, LOG.util.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadodocumentos';

        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            handler: function () {
                _this.getReporte();
            }
        }));
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonLimpiar({
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {

                _this.dfDesde.reset();
                _this.dfHasta.reset();
                smAreas.deselectRange(0, stAreas.getTotalCount());
                _this.gridTipoOper.getSmPrincipal().deselectRange(0, _this.gridTipoOper.getStorePrincipal().getTotalCount());
            }
        }));
        this.addToolbarButtonPanel('->');
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonAyuda({id: 'idActivosPorOperacion'}));

        /*------------Fieldset Rango Fecha---------------*/

        this.dfDesde = new Ext.form.DateField({ //---datefield Desde
            fieldLabel: _this.idioma.dfDesdeDoc,
            name: 'desdedoc',
            //format: 'm/d/Y',
			format: 'd/m/Y',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    _this.dfHasta.setMinValue(value);

                }
            }
        });
        this.dfHasta = new Ext.form.DateField({ //---datefield Hasta
            fieldLabel: _this.idioma.dfHastaDoc,
            name: 'hastadoc',
            //format: 'm/d/Y',
			format: 'd/m/Y',
            editable: false,
            listeners: {
                'select': function (df, value) {
                    _this.dfDesde.setMaxValue(value);

                }
            }
        });

        //this.dfDesde.endDateField = this.dfHasta.id; //-------validacion de fecha
        //this.dfHasta.startDateField = this.dfDesde.id;

        this.clsFecha = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });
        this.clsFecha.addComponent(this.dfDesde);
        this.clsFecha.addComponent(this.dfHasta);

        this.fsRangoFecha = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsRangoFecha,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [this.clsFecha]
        });

        /*---------------Fieldset con grid Selecionar Area de responsabilidad-------------*/

        this.gridAreas = LOG.aft.obtenerGridAreas(_this.idioma);

        this.fsSelecAreas = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecAreas,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            height: 421,
            items: [_this.gridAreas]
        });

        this.gridTipoOper = new LOG.aft.ventanaOperDoc(
            {dirController:'/logistica/activos_fijos/recuperaciones/index.php/listadodocumentos',
            bbarVisible: false}
            );
        this.gridTipoOper.init();


        this.fsSelecTipoDoc = new Ext.form.FieldSet({ //fieldset Seleccionar Documento
            title: _this.idioma.fsSelecTipoDoc,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [_this.gridTipoOper.view()]
        });
        _this.gridTipoOper.getSmPrincipal().fireEvent = _this.gridTipoOper.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {
                var selecciones = _this.gridTipoOper.getSmPrincipal().getSelections();
                /*if(selecciones.length == 1)
                {
                    //_this.getDatosEspecificosOperacion(selecciones[0].data.iddatosespecificos);
                }else if(_this.tabSecundario)
                {

                    _this.clsSur.remove(_this.tabSecundario);
                    _this.tabSecundario.destroy();
                    _this.tabSecundario = null;
                    _this.clsSur.collapse();
                }*/
            }
        });
        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsSelecTipoDoc);
        this.clsGeneral.addComponent(this.fsSelecAreas);
        this.clsGeneral.getColumn(0).columnWidth = 0.4;
        this.clsGeneral.getColumn(1).columnWidth = 0.6;
        this.clsGeneral.anchor = '101.3%';
        this.clsSur = LOG.util.UIManager.initPanel({ //columnForm General
            region: 'south',
            layout: 'fit',
            collapsed:true,
            bodyBorder: false,
            collapseMode: 'mini',
            collapCollapsesible: true,
            hideTool: true,
            border: false,
            split: true,
            height: 300
        });
        this.fpCentral = LOG.util.UIManager.initPanel({ //formulario General
            id: 'idFormActivoOperacion',
            region: 'center',
            style: '-moz-border-radius:20px',
            items: [this.clsGeneral]
        });
        /* -------configuracion de la vista---------*/

        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            this.fpCentral, _this.clsSur
        ];


        LOG.aft.listadodocumentos.view.superclass.constructor.call(this, config);
    },
    getReporte: function () {
        var _this = this;
        var areas = _this.gridAreas.getSelectionModel().getSelections();
        var arrayAreas = "";
        var oper = _this.gridTipoOper.getSmPrincipal().getSelections();
        var arrayOper = Array();
        var operBaja = false;
        var arrayClaves = Array();
        var arrayValores = Array();
        var arrayTablas = Array();

        if (areas.length > 0) {
            for (var i = 0; i < areas.length - 1; i++) {
                arrayAreas += areas[i].data.iddeposito + ",";
            }
            arrayAreas += areas[areas.length - 1].data.iddeposito;
        } else {
            mostrarMensaje(3, _this.idioma.msgSelectAreas);
            return;
        }

        if (oper.length > 0) {
            for (var j = 0; j < oper.length; j++) {
                arrayOper.push(oper[j].data.idoperacion);

                switch (true) {
                    case (oper[j].data.codigo == "OPER_BAJA_DEFINITIVA" || oper[j].data.codigo == "OPER_BAJA_VENTA" || "OPER_BAJA"):
                        operBaja = true;
                        arrayTablas.push("OPER_BAJA");
                        break;
                    case (oper[j].data.codigo == "OPER_ALTA" || oper[j].data.codigo == "OPER_COMPRA"):
                        operBaja = true;
                        arrayTablas.push("OPER_COMPRA");
                        break;
                    case oper[j].data.codigo == "OPER_BAJA_DESARME" :
                        operBaja = true;
                        arrayTablas.push("OPER_BAJA_DESARME");
                        break;
                    case (oper[j].data.codigo == "OPER_ALQUI_ENTRADA" || oper[j].data.codigo == "OPER_ALQUILER") :
                        arrayTablas.push("OPER_ALQUILER");
                        break;
                    case (oper[j].data.codigo == "OPER_PRESTA_ENTRADA" || oper[j].data.codigo == "OPER_PRESTAMO") :
                        arrayTablas.push("OPER_PRESTAMO");
                        break;
                    case (oper[j].data.codigo == "OPER_TRASLADO_INTER" || oper[j].data.codigo == "OPER_TRASLADO_EXTER") :
                        arrayTablas.push("OPER_TRASLADO");
                        break;
                }

            }

        } else {
            mostrarMensaje(3, _this.idioma.msgSelectOpera);
            return;
        }
/*
        if(_this.tabSecundario)
        {
            var i = 0;
            var cambiar = true;

            while(i < _this.tabSecundario.getItems().length)
            {
                var objP = _this.tabSecundario.getItems()[i];
                if (objP.getValue()) {
                    if(cambiar)
                    {
                        arrayTablas = Array();
                        cambiar = false;
                    }
                    if (objP.hiddenName == "idAreaDestino") {
                        arrayClaves.push("identidaddestino");
                    }else{
                        arrayClaves.push((objP.hiddenName) ? objP.hiddenName : objP.name);
                    }
                    arrayValores.push(objP.getValue());
                    switch (true) {
                        case (oper[0].data.codigo == "OPER_BAJA_DEFINITIVA" || oper[0].data.codigo== "OPER_BAJA_VENTA" || "OPER_BAJA"):
                            operBaja = true;
                            arrayTablas.push("OPER_BAJA");
                            break;
                        case (oper[0].data.codigo == "OPER_ALTA"|| oper[0].data.codigo=="OPER_COMPRA"):
                            operBaja = true;
                            arrayTablas.push("OPER_COMPRA");
                            break;
                        case oper[0].data.codigo == "OPER_BAJA_DESARME" :
                            operBaja = true;
                            arrayTablas.push("OPER_BAJA_DESARME");
                            break;
                        case (oper[0].data.codigo == "OPER_ALQUI_ENTRADA" || oper[0].data.codigo == "OPER_ALQUILER") :
                            arrayTablas.push("OPER_ALQUILER");
                            break;
                        case (oper[0].data.codigo == "OPER_PRESTA_ENTRADA" || oper[0].data.codigo == "OPER_PRESTAMO") :
                            arrayTablas.push("OPER_PRESTAMO");
                            break;
                        case (oper[0].data.codigo == "OPER_TRASLADO_INTER" || oper[0].data.codigo == "OPER_TRASLADO_EXTER") :
                            arrayTablas.push("OPER_TRASLADO");
                            break;
                    }
                }
                i++;
            }
        }*/
        Ext.Ajax.request({
            url: 'guardarParamsReports',
            method: 'post',
            params: {
                areas: "{" + arrayAreas + "}",
                reportname: 'ListadoAftPorOperaciones'
            },
            success: function(rp) {
                let r = Ext.decode(rp.responseText);
                var report = new LOG.util.Report({
                    reports: [
                        {
                            name: 'Vista principal',
                            params: {
                                fechainicio: (_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                                fechafin: (_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                                arrayidestructura: "{" + r.idusuario + "}",
                                operacionBaja: (operBaja) ? 2 : 1,
                                codigo_operacion: (oper.length == 1) ? oper[0].data.codigo : null,
                                arrayidnomoperaciones: "{" + arrayOper.join(",") + "}",
                                arrayClaves: (arrayClaves)?arrayClaves.join(","):null,
                                arrayValores: (arrayValores) ?arrayValores.join(",") : null,
                                arrayTablas: (arrayTablas) ?arrayTablas.join(",") : null
                            },
                            dirReport: '/distra/logistica/activofijo/RecuperacionesOk/ListadoAftPorOperaciones',
                            detailFirma: {}
                        }
                    ]
                }).view();
            }
        });

    },
    addToolbarButtonPanel: function (b, f) {
        this.listaBotonesVentanaToolbar.add(LOG.util.UIManager.reconfigureButton(b));
    },
    /*getDatosEspecificosOperacion: function (datosespecificos) {
        var _this = this;
        _this.datos = {};
        _this.datos.data = {};
        console.info(datosespecificos);
        this.nodoPadre =
        {
            attributes: {
                text: "Entidad",
                id: -1
            }
        };
        this.tabSecundario = null;

        switch (datosespecificos) {
            case '1':
            {
                this.tabSecundario = getItemsAlquiler(LOG.aft.documento.Idioma, false, _this.datos);


            }
                break;
            case '2':
            {
                this.tabSecundario = getItemsReparar(LOG.aft.documento.Idioma, false, _this.datos);
            }
                break;
            case '3':
            {
                this.tabSecundario = getItemsTrasladoInterno(LOG.aft.documento.Idioma, _this.datos, false, this.nodoPadre, (this.comboCentroCosto) ? this.comboCentroCosto.getValue() : null, _this);
            }
                break;
            case '4':
            {
                this.tabSecundario = getItemsTrasladoExterno(LOG.aft.documento.Idioma, _this.datos, false, this.nodoPadre, true);
            }
                break;
            case '5':
            {
                this.tabSecundario = getItemsBajaPorVenta(LOG.aft.documento.Idioma, _this.datos, false, this.idarea_seleccionada);
            }
                break;
            case '10':
            {
                this.tabSecundario = getItemsBajaDesarme(LOG.aft.documento.Idioma, false, _this.datos, this.idarea_seleccionada);
            }
                break;
            case '11':
            {
                this.tabSecundario = getItemsCompra(LOG.aft.documento.Idioma, false, _this.datos);
            }
                break;
            case '16':
            {
                this.tabSecundario = getItemsAlta(LOG.aft.documento.Idioma, false, _this.datos);

            }
                break;
            case '20':
            {
                this.tabSecundario = getItemsPrestamo(LOG.aft.documento.Idioma, false, _this.datos, this.idarea_seleccionada);

            }
                break;
            default :
            {
                if(this.tabSecundario)
                {
                    this.tabSecundario.destroy();
                    this.tabSecundario = null;
                }

            }
                break;
        }

        if (this.tabSecundario) {
            for(var i =0; i< this.tabSecundario.getItems().length; i++ )
            {
                if (this.tabSecundario.getItems()[i]) {
                    this.tabSecundario.getItems()[i].allowBlank = true;
                }
            }
            _this.clsSur.add(this.tabSecundario);
            _this.clsSur.expand();
        }
    }*/
});

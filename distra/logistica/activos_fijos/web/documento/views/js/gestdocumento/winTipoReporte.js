LOG.aft.documento.VentanaTipoReporte = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        Ext.apply(this, config);
        var _this = this;
        _this.etiq = config.etiquetas;
        this.title = _this.etiq.lbTitleWInTipoReporte;
        this.closeAction = 'hide';
        this.resizable = false;
        this.modal = true;
        this.usarAplicar = false;
        this.width = 400;
        this.height = 150;
        this.idoperacion = config.idoperacion;
        this.iddocumento = config.iddocumento;
        this.aprobadopor = config.aprobadopor;
        this.operacion = config.operacion;
        this.entidad = config.entidad;

		
        _this.storeRecords = Array();
        _this.tituloReporte = "Desconocido";
        var i = 0;
        var record = _this.scope.getGridPrincipal().getSelectionModel().getSelected();
        
        this.codigooperacion = record.data.codigooperacion;
        
        while (i < _this.scope.arregloDocumentosAFT.length) {
            if (_this.scope.arregloDocumentosAFT[i].iddoc == record.get("iddoc")) {
                _this.tituloReporte = _this.scope.arregloDocumentosAFT[i].denominacion;
                break;
            }
            i += 1;
        }
		// ------Agregando Reporte de Utiles -----------
		var idreporte = '4';
		if(/tiles/.test(_this.tituloReporte)){
			idreporte = '20';
		}
		// ---------------------------------------------
        _this.storeRecords.push([_this.tituloReporte, idreporte]);
            if (estransgaviota) {
                _this.storeRecords.push(['Alta en el Reg de Veh\xedculos', '1']);
                _this.storeRecords.push(['Carta de dejacion de TECNOIMPORT', '2']);
                _this.storeRecords.push(['Carta de dejacion de Tecnotex', '3']);
                _this.storeRecords.push(['Copia de Factura de Oficio TECNOIMPORT', '5']);
                _this.storeRecords.push(['Factura de Oficio TECNOTEX', '6']);
                _this.storeRecords.push(['Solicitud de Baja tur autos', '7']);
                _this.storeRecords.push([' Acta de defactación y entrega de vehiculos ligeros', '9']);
                _this.storeRecords.push([' Bajas t\xe9cnicas Anexo 2', '8']);
                _this.storeRecords.push([' Bajas t\xe9cnicas Provari Anexo 2', '25']);
                _this.storeRecords.push([' Acta de defactación y entrega de motos', '10']);
                _this.storeRecords.push([' Acta de defactación y entrega de ómnibus', '11']);
                _this.storeRecords.push([' Acta de defactación y entrega de vehículos pesados', '12']);
                _this.storeRecords.push([' Acta de defactación y entrega de motores', '13']);              
                _this.storeRecords.push([' Anexo Hoja 4', '15']);
                _this.storeRecords.push([' Anexo Hoja 5', '16']);
                _this.storeRecords.push([' Movimiento de inventario', '17']);
                _this.storeRecords.push([' Presentaci\xf3n Baja técnica provari', '18']);
                _this.storeRecords.push([' Baja técnica por desarme gaviota', '19']);
                _this.storeRecords.push([' Baja aprobada', '21']);
                _this.storeRecords.push([' Presentación baja tur', '22']);
                _this.storeRecords.push([' Solicitud baja tur para \xf3mnibus', '24']);
            }
                    

        // for (var i = 0; i < _this.scope.acciones.length; i++) {
        //     switch (_this.scope.acciones[i].abreviatura) {
        //         case 'AltaRegVehiculos':
        //             _this.storeRecords.push(['Alta en el Reg de Veh\xedculos', '1']);
        //             break;
        //         case 'CartaDejaTecImport':
        //             _this.storeRecords.push(['Carta de dejacion de TECNOIMPORT', '2']);
        //             break;
        //         case 'CartaDejaTecTex':
        //             _this.storeRecords.push(['Carta de dejacion de Tecnotex', '3']);
        //             break;
        //         case 'CopiaFacOficioTecnoimport':
        //             _this.storeRecords.push(['Copia de Factura de Oficio TECNOIMPORT', '5']);
        //             break;
        //         case 'FacOficioTecnotex':
        //             _this.storeRecords.push(['Factura de Oficio TECNOTEX', '6']);
        //             break;
        //         case 'BajaTur':
        //             _this.storeRecords.push(['Solicitud de Baja tur autos', '7']);
        //             break;
        //         case 'Anexo1':
        //             _this.storeRecords.push([' Acta de defactación y entrega de vehiculos ligeros', '9']);
        //             break;
        //         case 'Anexo2':
        //             _this.storeRecords.push([' Bajas t\xe9cnicas Anexo 2', '8']);
        //             _this.storeRecords.push([' Bajas t\xe9cnicas Provari Anexo 2', '25']);
        //             break;
        //         case 'Anexo3':
        //             _this.storeRecords.push([' Acta de defactación y entrega de motos', '10']);
        //             break;
        //         case 'Anexo4':
        //             _this.storeRecords.push([' Acta de defactación y entrega de ómnibus', '11']);
        //             break;
        //         case 'Anexo5':
        //             _this.storeRecords.push([' Acta de defactación y entrega de vehículos pesados', '12']);
        //             break;
        //         case 'Anexo6':
        //             _this.storeRecords.push([' Acta de defactación y entrega de motores', '13']);                    
        //             break;                    
        //         case 'AnexoHoja4':
        //             _this.storeRecords.push([' Anexo Hoja 4', '15']);
        //             break;
        //         case 'AnexoHoja5':
        //             _this.storeRecords.push([' Anexo Hoja 5', '16']);
        //             break;
        //         case 'MovimientoInventario':
        //             _this.storeRecords.push([' Movimiento de inventario', '17']);
        //             break;
        //         case 'BajaTecnicaProvari':
        //             _this.storeRecords.push([' Presentaci\xf3n Baja técnica provari', '18']);
        //             break;
        //         case 'BajaTecnicaDesarmeGaviota':
        //             _this.storeRecords.push([' Baja técnica por desarme gaviota', '19']);
        //             break;
        //         case 'BajaAprobada':
        //             _this.storeRecords.push([' Baja aprobada', '21']);
        //             break;
        //         case 'PresenBajaTur':
        //             _this.storeRecords.push([' Presentación baja tur', '22']);
        //             break;
        //         case 'SoliciBajaOmnibusMoto':
        //             _this.storeRecords.push([' Solicitud baja tur para \xf3mnibus', '24']);
        //             break;

        //     }
        // }
        this.cmbTipoReporte = new LOG.util.ComboBox({
            fieldLabel: _this.etiq.lbcmbTipoReporte,
            valueField: 'id',
            displayField: 'name',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            editable: false,
            anchor: '98%',
            resizable: true,
            listeners: {
                'select': function(combo, record) {
                    _this.eventSelectCombo(combo, record);
                }
                //'select': function() {
                //    _this.listaBotones.getItem(2).enable();
                //}
            },
            store: new Ext.data.SimpleStore({
                fields: ['name', 'id'],
                data: _this.storeRecords
            })
        });
        this.frmReporte = new Ext.form.FormPanel({
            frame: true,
            region: 'center',
            labelAlign: 'top',
            items: [_this.cmbTipoReporte]
        });
        this.items = [_this.frmReporte];

        LOG.aft.documento.VentanaTipoReporte.superclass.constructor.apply(this, arguments);
    },
    eventSelectCombo:function (combo, record) {
        var _this = this;
        _this.listaBotones.getItem(2).enable();

        if(record.data.id == 6){
            _this.setHeight(480);
            _this.setWidth(520);
            _this.textNumeroContrato = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Nº. de contrato"
            });
            _this.textAutorizaOficio = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Autoriza"
            });
            _this.textNroAprobOficio = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Nº. de aprobación"
            });
            _this.frmReporte.add(_this.textNumeroContrato);
            _this.frmReporte.add(_this.textAutorizaOficio);
            _this.frmReporte.add(_this.textNroAprobOficio);

            var panelCuentasSum = new LOG.util.UIManager.initColumnForm({
                columnas:2
            });
            _this.textNroCuentaSumCup = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Cuenta CUP"
            });
            _this.textNroCuentaSumCUC = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Cuenta CUC"
            });
            panelCuentasSum.addComponent(_this.textNroCuentaSumCup);
            panelCuentasSum.addComponent(_this.textNroCuentaSumCUC);

            var panelCuentasRec = new LOG.util.UIManager.initColumnForm({
                columnas:2
            });
            _this.textNroCuentaRecCup = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Cuenta CUP"
            });
            _this.textNroCuentaRecCUC = new LOG.util.Prototipos.inputTexto({
                anchor: '80%',
                fieldLabel:"Cuenta CUC"
            });
            panelCuentasRec.addComponent(_this.textNroCuentaRecCup);
            panelCuentasRec.addComponent(_this.textNroCuentaRecCUC);
            _this.panelCuentasContainer = new LOG.util.UIManager.initPanel({
                items:[{
                    // Fieldset in Column 1
                    xtype:'fieldset',
                    title: 'Suministrador',
                    autoHeight:true,
                    items :[panelCuentasSum]
                }, {
                    // Fieldset in Column 1
                    xtype:'fieldset',
                    title: 'Deudor o Receptor',
                    autoHeight:true,
                    items :[panelCuentasRec]
                }]
            });

            _this.frmReporte.add(_this.panelCuentasContainer);
        }else{
            _this.setHeight(150);
            _this.setWidth(320);
            _this.frmReporte.remove(_this.textNumeroContrato);
            _this.frmReporte.remove(_this.panelCuentasContainer);

        }
    },
    initComponent: function() {
        var _this = this;
        LOG.aft.documento.winRecepciones.superclass.initComponent.call(this);
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            disabled: true,
            handler: function() {

                var dirReport = "";
                        var dirImg = "";
                        switch (_this.cmbTipoReporte.getValue()) {
                            case '1':
                                dirReport = '/distra/logistica/activofijo/documento/AltaRegVehiculos';
                                break;
                            case '2':
                                dirReport = '/distra/logistica/activofijo/documento/CartaDejaTecImport';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnoimport.png";
                                break;
                            case '3':
                                dirReport = '/distra/logistica/activofijo/documento/CartaDejaTecTex';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnotex.png";
                                break;
							// ------------------ Reporte general de Modelo de AFT -------------------------
                            case '4':
                                dirReport = _this.codigooperacion == 'OPER_TELETRABAJO' 
                                    ? '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangibleTeletrabajo'
                                    : '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible';
                                break;
							case '20':
                                // Este es el reporte del modelo de movimiento de los utiles 
                                dirReport = _this.codigooperacion == 'OPER_TELETRABAJO_UH' 
                                    ? '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangibleTeletrabajoUH'
                                    : '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible_3';
                                break;
							// ------------------ Reporte general de Modelo de UH --------------------------
                            case '5':
                                dirReport = '/distra/logistica/activofijo/documento/CopiaFacOficioTecnoimport';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnoimport.png";
                                break;
                            case '6':
                                dirReport = '/distra/logistica/activofijo/documento/FacOficioTecnotex';
                                dirImg = "/logistica/activos_fijos/documento/views/images/tecnotex.png";
                                break;
                            case '7':
                                dirReport = '/distra/logistica/activofijo/documento/BajaTur';
                                break;
                            case '8':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo1';
                                break;
                            case '9':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo2';
                                break;
                            case '10':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo3';
                                break;
                            case '11':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo4';
                                break;
                            case '12':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo5';
                                break;
                            case '13':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo6';
                                break;                                
                            case '15':
                                dirReport = '/distra/logistica/activofijo/documento/AnexoHoja4';
                                break;
                            case '16':
                                dirReport = '/distra/logistica/activofijo/documento/AnexoHoja5';
                                break;
                            case '17':
                                dirReport = '/distra/logistica/activofijo/documento/MovimientoActivoFijoTangible_2';
                                break;
                            case '18':
                                dirReport = '/distra/logistica/activofijo/documento/BajaTecProvari';//
                                break;
                            case '19':
                                dirReport = '/distra/logistica/activofijo/documento/BajaTecnicaDesarme';//gaviota
                                break;
                            case '21':
                                dirReport = '/distra/logistica/activofijo/documento/BajaAprobada';//
                                break;
                            case '22':
                                dirReport = '/distra/logistica/activofijo/documento/PresentacionBajaTur';//
                                break;
                            case '24':
                                dirReport = '/distra/logistica/activofijo/documento/SolicitudBaja';//omnibus
                                break;
                            case '25':
                                dirReport = '/distra/logistica/activofijo/documento/Anexo1_1';
                                break;
                        }

                        var fecha = new Date();
                        var has = _this.scope.getGridPrincipal().getSelectionModel().hasSelection();
                        var record = _this.scope.getGridPrincipal().getSelectionModel().getSelected();
                        var report = new LOG.util.Report({
                            reports: [
                                {
                                    name: 'Vista principal',
                                    params: {
                                        iddocumento: _this.iddocumento,
                                        iddoc: record.get("iddoc"),
                                        idnodo: record.get("idnodo"),
                                        iddestino: record.get("iddestinofinal") || record.get("iddestinofinalBajadesarme")|| record.get("iddestinofinalPropuestaBaja"),
                                        idreporte: _this.cmbTipoReporte.getValue(),
                                        anexo: (_this.cmbTipoReporte.getValue() == 25 || _this.cmbTipoReporte.getValue() == 8)?1:null,
                                        iddir: (idespaciotrabajo && idespaciotrabajo != undefined) ? idespaciotrabajo : null,
                                        aprobadopor: (_this.aprobadopor) ? LOG.aft.documento.utf8_encode(_this.aprobadopor) : '',
                                        operacion: (_this.operacion) ? LOG.aft.documento.utf8_encode(_this.operacion) : '',
                                        idestructura: _this.identidad,
                                        idestructuraop: _this.identidad,
                                        nommonedaalternativa: null,//(nommonedaalternativa)? LOG.aft.documento.utf8_encode(nommonedaalternativa):null,
                                        entidad_direccion: (_this.entidadSeleccionada.entidadDireccion) ? LOG.aft.documento.utf8_encode(_this.entidadSeleccionada.entidadDireccion) : '',
                                        codigo_entidad: _this.entidadSeleccionada.entidadCodigo,
                                        mes: LOG.aft.documento.mesActual(fecha.getMonth() + 1),
                                        year: fecha.getFullYear(),
                                        nrocontrato:(_this.textNumeroContrato && _this.textNumeroContrato.getValue())?_this.textNumeroContrato.getValue():null,
                                        nroaproboficio:(_this.textNroAprobOficio && _this.textNroAprobOficio.getValue())?_this.textNroAprobOficio.getValue():null,
                                        nrocuentacupsum:(_this.textNroCuentaSumCup && _this.textNroCuentaSumCup.getValue())?_this.textNroCuentaSumCup.getValue():null,
                                        nrocuentacucsum:(_this.textNroCuentaSumCUC && _this.textNroCuentaSumCUC.getValue())?_this.textNroCuentaSumCUC.getValue():null,
                                        nrocuentacuprec:(_this.textNroCuentaRecCup && _this.textNroCuentaRecCup.getValue())?_this.textNroCuentaRecCup.getValue():null,
                                        nrocuentacucrec:(_this.textNroCuentaRecCUC && _this.textNroCuentaRecCUC.getValue())?_this.textNroCuentaRecCUC.getValue():null,
                                        autorizaoficio:(_this.textAutorizaOficio && _this.textAutorizaOficio.getValue())?LOG.aft.documento.utf8_encode(_this.textAutorizaOficio.getValue()):null,
                                        titulo: LOG.aft.documento.utf8_encode(_this.tituloReporte),
                                        yearRev: fecha.getFullYear() - 1958,
                                        dirImg: dirImg,
                                        dia: fecha.getDate()
                                    },
                                    dirReport: dirReport
                                }
                            ]
                        }).view();                       
                        _this.close();

                
            }
        });
        this.fireEvent = this.fireEvent.createSequence(function(e) {
            if (e == 'show' && _this.storeRecords.length == 1) {
                _this.cmbTipoReporte.setValue(_this.storeRecords[0][1]);
                _this.listaBotones.getItem(2).handler();
            }
        })
    }
});
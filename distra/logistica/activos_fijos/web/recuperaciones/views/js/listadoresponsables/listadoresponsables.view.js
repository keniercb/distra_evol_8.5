Ext.ns('LOG.aft.listadoresponsables');
LOG.aft.listadoresponsables.view = Ext.extend(LOG.util.Panel, {
    listaBotonesVentanaToolbar: undefined,
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.layout = 'border';
        this.idioma = LOG.util.UIManager.apply(LOG.aft.listadoresponsables.Idioma, LOG.util.Idioma);
        this.dirController = '/logistica/activos_fijos/recuperaciones/index.php/listadoresponsables/';

        this.listaBotonesVentanaToolbar = new LOG.util.List();
        this.addToolbarButtonPanel(LOG.util.Prototipos.botonImprimir({
            tooltip: _this.idioma.ttImprimir,
            handler: function () {
                (!!_this.cmbTipoReport.getValue())?_this.getReporte():mostrarMensaje(3, _this.idioma.msgSelectTipoRep);
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
			disabled: true,
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
			disabled: true,
            listeners: {
                'select': function (df, value) {
                    _this.dfDesde.setMaxValue(value);

                }
            }
        });

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


        this.treeLoader = new Ext.tree.TreeLoader({
            dataUrl: _this.dirController+'getArbolUbicaciones',
            listeners: {
                load: function (loader, node, response) {
                    var datos = Ext.decode(response.responseText);
                    if (node.isRoot) {
                        if (datos.length == 0) {
                        }
                    }
                },
                beforeload: function (loader, nodo, fnCallBack) {
                    loader.baseParams.medios1 = 2;
                    loader.baseParams.ultimonivel = - 1;
                }
            }

        });
        this.tpEstructurae = new Ext.tree.TreePanel({
            enableDD: false,
            autoScroll: true,
            collapsible: false,
            style: 'margin: 2 0 0 0',
            margins: '1 1 1 1',
            id: 'tree',
            loader: _this.treeLoader,
            frame: false
        });
        this.nodopadre = new Ext.tree.AsyncTreeNode({
            text: "Ubicaciones",//_this.arearesp,//_this.idioma.lbEstructuraUbicacion,
            draggable: false,
            id: -1,//_this.idubicacion,
            animate: false,
            expanded: false
        });
        //this.tpEstructurae.setRootNode(_this.nodopadre);
        /*this.panelEst = new Ext.Panel({
            border: false,
            frame: false,
            disabled:true,
            title:_this.idioma.fsSelecUbicaciones,
            height: 250,
            layout: 'fit',
            items: [_this.tpEstructurae]
        });*/
        this.initEventosTreeUbicacion();

        /*---------------Fieldset con grid Selecionar Area de responsabilidad-------------*/

        this.gridAreas = LOG.aft.obtenerGridAreas(_this.idioma);
        this.initGridAreas();

        /*---------------Fieldset con grid Selecionar Responsable-------------*/

        this.panelBusPer = new Ext.aft.regNumerico.panelBuscarResponsable({
            region: 'center',
            id: 'panelBusPer',
            singleSelect: true,
            title:_this.idioma.fsSelecResposables,
            height:500,
            identidad: perfil.idestructuracomun,
            showBtnAdicionar: true,
            modulo: 'LOGISTICA',
            showBtnAyuda: false,
            seguridad:0,
            limit:30,
            start:0
        });

        _this.panelBusPer.runSearch = function (condiciones) {
            if (condiciones && condiciones.length > 0 && condiciones[0] != " ") {
                condiciones[condiciones.length - 1].logico = '';
                _this.panelBusPer.hasSearch = true;
                //_this.panelBusPer.searchField.setVisibleBtnClear(panelBusPer.hasSearch);
            } else {

                _this.panelBusPer.hasSearch = false;
                //_this.panelBusPer.searchField.setVisibleBtnClear(this.hasSearch);
            }
            _this.panelBusPer.stPersonas.baseParams.condiciones = condiciones; 
           _this.panelBusPer.stPersonas.load({params: {start: 0, limit: _this.panelBusPer.pagingToolbar.pageSize}});
        };

       _this.panelBusPer.cleanSearch = function () {
            _this.panelBusPer.tfbuscar.reset();
            delete _this.panelBusPer.stPersonas.baseParams.condiciones;
            delete _this.panelBusPer.stPersonas.baseParams.criterio;
            _this.panelBusPer.stPersonas.baseParams.start = 0;
            _this.panelBusPer.stPersonas.baseParams.limit = 25;
            _this.panelBusPer.stPersonas.load({params: {start: 0, limit: 25}});
        };


        /*this.fsSelecResposables = new Ext.form.FieldSet({ //fieldset Seleccionar cliente
            title: _this.idioma.fsSelecResposables,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [_this.panelBusPer]
        });*/

        /*---------------Fieldset tipo reporte-------------*/
        LOG.aft.cmbTipoReport(this);
        var clsCmbTipoReport = LOG.util.UIManager.initColumnForm({ //columnForm de la fecha
            columnas: 2
        });

        clsCmbTipoReport.addComponent(_this.cmbTipoReport);
        this.fsSelecTipoRepor = new Ext.form.FieldSet({ //fieldset Seleccionar Documento
            title: _this.idioma.fsSelecTipoRepor,
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            autoHeight: true,
            items: [clsCmbTipoReport]
        });

       /* this.gridTipoOper = new LOG.aft.ventanaOperDoc(
            {dirController:'/logistica/activos_fijos/recuperaciones/index.php/listadoresponsables',
                bbarVisible: false}
        );
        this.gridTipoOper.init();*/

        this.clsGeneral = LOG.util.UIManager.initColumnForm({ //columnForm General
            columnas: 2,
            region: 'center'
        });
        this.clsGeneral.addComponent(this.fsRangoFecha);
        this.clsGeneral.addComponent(this.fsSelecTipoRepor);


        var panAreaOperTab = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            flex:1,
            region: 'center',
            enableTabScroll: true,
            defaults: {autoScroll: true},
            items:[_this.gridAreas/*, _this.gridTipoOper.view()*/]
        });
       /* _this.gridTipoOper.getSmPrincipal().fireEvent = _this.gridTipoOper.getSmPrincipal().fireEvent.createSequence(function (e) {
            if (e == 'selectionchange') {

            }
        });*/

        var panUbicUserTab = new Ext.TabPanel({
            activeTab: 0,
            frame: true,
            flex:1,
            region: 'center',
            enableTabScroll: true,
            defaults: {autoScroll: true},
            items:[/*_this.panelEst,*/ _this.panelBusPer]
        });

        this.clsGeneral.addComponent(panAreaOperTab);
        this.clsGeneral.addComponent(panUbicUserTab);

        this.fpCentral = LOG.util.UIManager.initPanel({ //formulario General
            id: 'idFormActivoOperacion',
            region: 'center',
            layout:'fit',
            style: '-moz-border-radius:20px',
            items: [_this.clsGeneral/*, panGeneral*/]
        });
        /* -------configuracion de la vista---------*/

        config.items = [
            {
                region: 'north',
                tbar: [this.listaBotonesVentanaToolbar.getArray()]
            },
            this.fpCentral
        ];


        LOG.aft.listadoresponsables.view.superclass.constructor.call(this, config);
    },
    getReporte: function () {
        var _this = this;

        var areas = _this.gridAreas.getSelectionModel().getSelections();
        var arrayAreas = '';
        var oper = [];//_this.gridTipoOper.getSmPrincipal().getSelections();
        var  arrayTablas =  new Array(), arrayClaves =  new Array(), arrelgoNodos =  new Array(), arrayValores =  new Array(), arrayTablas =  new Array();

        var tipo = (_this.cmbTipoReport.getValue() == 1)?2:null;
       /* if (_this.cmbTipoReport.getValue() === 3 || _this.cmbTipoReport.getValue() === 4) {
            var records = _this.gridTipoOper.getStorePrincipal().getRange(0);
            var arrayEntradasOp = new Array();
            var arrayEntradasId = new Array();
            records.forEach(function (r) {
                arrayEntradasOp.push(r.get('codigo'));
                arrayEntradasId.push(r.get('idoperacion'));
            });

        }*/

        if(_this.cmbTipoReport.getValue() ===5 && (!(!!_this.dfHasta.getValue()) || !(!!_this.dfDesde.getValue())))
        {
            mostrarMensaje(3, _this.idioma.msgSelectFechas);
            return;
        }

        /*if(!this.panelEst.disabled){
            var nodos = this.tpEstructurae.getChecked();
            nodos.forEach(function (n) {
                arrelgoNodos.push(n.id);
            });
        }*/

        if (areas.length > 0) {
            for (var i = 0; i < areas.length - 1; i++) {
                arrayAreas += areas[i].data.iddeposito + ",";
            }
            arrayAreas += areas[areas.length - 1].data.iddeposito;
        } else {
            for (var i = 0; i < _this.gridAreas.store.data.items.length - 1; i++) {
                arrayAreas += _this.gridAreas.store.data.items[i].data.iddeposito + ",";
            }
            arrayAreas += _this.gridAreas.store.data.items[_this.gridAreas.store.data.items.length - 1].data.iddeposito;
           /*mostrarMensaje(3, _this.idioma.msgSelectAreas);
            return;*/
        }

        if (oper.length > 0) {
            var {arrayTablas, arrayOper} = _this.getOperatons(oper);
        } else if(_this.cmbTipoReport.getValue() === 1){
		//if(_this.cmbTipoReport.getValue() !== 3 && _this.cmbTipoReport.getValue() !== 4 && _this.cmbTipoReport.getValue() !== 5)
           /* mostrarMensaje(3, _this.idioma.msgSelectOpera);
            return;*/
        }else if((/*_this.cmbTipoReport.getValue() == 3 || */_this.cmbTipoReport.getValue() == 4) && !arrelgoNodos.length){
            mostrarMensaje(3, _this.idioma.msgSelectUbica);
            return;
        }
        let reportName = _this.getNameReport();
        Ext.Ajax.request({
            url: 'guardarParamsReports',
            method: 'post',
            params: {
                areas: `{${arrayAreas}}`,
                reportname: `${reportName}`
            },
            success: function(rp) {
                let r = Ext.decode(rp.responseText);
                var report = new LOG.util.Report({
                    reports: [
                        {

                            name: 'Vista principal',
                            params: {
                                fechainicio: (!!_this.dfDesde.getValue()) ? _this.dfDesde.getValue().format('d-m-Y') : null,
                                fechafin: (!!_this.dfHasta.getValue()) ? _this.dfHasta.getValue().format('d-m-Y') : null,
                                arrayidestructura: `{${r.idusuario}}`,
                                codigo_operacion: (oper.length == 1) ? oper[0].data.codigo : null,
                                // arrayidnomoperaciones: (!!arrayOper && !!arrayOper.length)?`{ ${arrayOper.join(",")}}`:(arrayEntradasId && _this.cmbTipoReport.getValue() === 1)?`{${arrayEntradasId.join(",")}}`:null,
                                arrayClaves: (!!arrayClaves)?arrayClaves.join(","):null,
                                arrayValores: (!!arrayValores) ?arrayValores.join(",") : null,
                                // arrayTablas: (!!arrayTablas && !!arrayTablas.length) ?arrayTablas.join(",") : (arrayEntradasOp)?arrayEntradasOp.join(","):null,
                                tipo:tipo,
                                idEntiadPadre:idEntiadPadre,
                                arrayExlcuirNatu:(_this.cmbTipoReport.getValue() == 2)?"{" + idNatObjObra + "," + idNatInmueble + ","+idnatUTIHERR+"}":null,
                                contabilidad:(!!integradocontabilidad)?1:null,
                                arrayUbicacion:(!!arrelgoNodos.length)?"{" +arrelgoNodos.join(",")+ "}":null,
                                idresponsable:(!!_this.panelBusPer.getSeleccion())?_this.panelBusPer.getSeleccion().get('idpersona'):null,
                                reportname: reportName,
                                nombreusuario:(!!_this.panelBusPer.getSeleccion())
                                    ?_this.panelBusPer.getSeleccion().get('nombreyapellidos')
                                    :null
                            },
                            dirReport: `/distra/logistica/activofijo/${_this.getDirectionReport()}`,
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
    getOperatons(oper){

        let arrayOper =  new Set(), arrayTablas = new Set();
        oper.map(o=>{
            arrayOper.add(o.data.idoperacion);
            switch (o.data.codigo) {
                case ("OPER_ALTA" || "OPER_COMPRA"):
                    arrayTablas.add("OPER_COMPRA");
                    break;
                case ("OPER_ALQUI_ENTRADA" ||  "OPER_ALQUILER") :
                    arrayTablas.add("OPER_ALQUILER");
                    break;
                case ("OPER_PRESTA_ENTRADA" ||  "OPER_PRESTAMO") :
                    arrayTablas.add("OPER_PRESTAMO");
                    break;
                case ("OPER_TRASLADO_INTER" || "OPER_TRASLADO_EXTER") :
                    arrayTablas.add("OPER_TRASLADO");
                    break;
                default:break;
            }
        });


        return {arrayOper:[...arrayOper], arrayTablas:[...arrayTablas]};
    },
    getDirectionReport(){
        let dir = "";
        switch (this.cmbTipoReport.getValue()) {
            case 1:
                dir = "Recuperaciones/ReporteUtilesHerramientas";
                break;
            case 2:
                dir = "Recuperaciones/ReporteListadoResponsable";
                //dir = "Recuperaciones/ListadoActivosResponsableOK";
                break;
            case 3:
                dir = "Recuperaciones/ReporteControlAFT";
                break;
            case 4:
                dir = "Recuperaciones/ReporteModeloFisico";
                break;
            case 5:
                dir = "Recuperaciones/DepreciacionActivos";
                break;
            default : dir = "Recuperaciones/NoReporte";
                break;
        }
        return dir;
    },
    getNameReport(){
        let name = "";
        switch (this.cmbTipoReport.getValue()) {
            case 1:
                name = "ReporteUtilesHerramientas";
                break;
            case 2:
                name = "ReporteListadoResponsable";
                break;
            case 3:
                name = "ReporteControlAFT";
                break;
            case 4:
                name = "ReporteModeloFisico";
                break;
            case 5:
                name = "DepreciacionActivos";
                break;
            default : name = "NoReporte";
                break;
        }
        return name;
    },
    initEventosTreeUbicacion: function () {

        var _this = this;

        _this.tpEstructurae.on('beforeexpandnode', function (node) {
            if (! node.isSelected()) {
                node.select();
            }
        }, this);

        this.tpEstructurae.on('dblclick', function (node, e) {
            // _this.doAction(node);
        }, this);

        // this.btnCancelar.on('click', function () {
        //     _this.hide();
        // });
        //
        // this.btnAceptar.on('click', function () {
        //     _this.doAction(_this.tpEstructurae.getSelectionModel().getSelectedNode());
        // });
    },
    initGridAreas:function(){
        var _this = this;
        var selection = _this.gridAreas.getSelectionModel();
        /*selection.fireEvent = selection.fireEvent.createSequence(function (e) {
            if(e=='selectionchange'){
                var cantidad = selection.getSelections().length;
                if(cantidad == 1)
                {
                    //_this.panelEst.enable();
                    _this.nodopadre.setId(selection.getSelected().id);
                    _this.nodopadre.setText(selection.getSelected().data.deposito);
                    _this.nodopadre.reload();
                }else{
                    //_this.panelEst.disable();
                    _this.nodopadre.setId(-1);
                    _this.nodopadre.setText("Ubicaciones");
                    _this.nodopadre.collapse();
                }
            }
        });*/

    },
    utf8_encode: function (argString) {


        if (argString === null || typeof argString === 'undefined') {
            return '';
        }

        var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        var utftext = '',
            start, end, stringl = 0;

        start = end = 0;
        stringl = string.length;
        for (var n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if (c1 > 127 && c1 < 2048) {
                enc = String.fromCharCode(
                    (c1 >> 6) | 192, (c1 & 63) | 128
                );
            } else if ((c1 & 0xF800) != 0xD800) {
                enc = String.fromCharCode(
                    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            } else { // surrogate pairs
                if ((c1 & 0xFC00) != 0xD800) {
                    throw new RangeError('Unmatched trail surrogate at ' + n);
                }
                var c2 = string.charCodeAt(++n);
                if ((c2 & 0xFC00) != 0xDC00) {
                    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
                }
                c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
                enc = String.fromCharCode(
                    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
                );
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.slice(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.slice(start, stringl);
        }

        return utftext;
    }

});

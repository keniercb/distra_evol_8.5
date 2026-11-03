Ext.ns('LOG.inv.cuadrediario');
LOG.inv.cuadrediario.VentanaAdicionar = Ext.extend(LOG.lb.documento.ventanaGestionDocumentos, {
    constructor: function (config) {
        var _this = this;
        this.listaAcciones = new LOG.util.List(config.acciones);
        LOG.util.UIManager.apply(config.idioma, LOG.inv.cuadrediario.Idioma);
        LOG.inv.cuadrediario.VentanaAdicionar.superclass.constructor.call(this, config);
    },

    builComponent: function () {
        this.idioma = this.idioma || LOG.lb.documento.Idioma;
        var _this = this;

        this.panelSuperior = LOG.util.UIManager.initPanel({
            region: 'north',
            title: _this.idioma.tlPanelGeneral,
            frame: true,
            animCollapse: false,
            collapsible: true,
            collapsed: false,
            height: 110,
            //width: 600, 
            layout: 'fit',
            //html: 'form',
            split: true,
            //titleCollapse: true 
        });    
        
        this.btnMostrar = LOG.util.UIManager.createBtn({ //boton Mostrar reportes
            text: _this.idioma.btnMostrar,
            tooltip: _this.idioma.ttBtnMostrar,
            iconCls:'mostrar',
            //sufijo:'Listado',
            title:'' ,
            handler: _this.showReport.createDelegate(this,[{/*sufijo:'Listado',*/title:''}]),
            controlFn: function(b, _caller) {
                if (_caller.grantedAction('RB')) {
                    b.setVisible(true);
                } else {
                    b.setVisible(false);
                }
            }
        });

        this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({
            text: _this.idioma.btnLimpiar,
            tooltip: _this.idioma.ttBtnLimpiar,
            handler: function () {
                _this.botonLimpiar();
            }
        });
        this.agrupadoReportes = new Ext.form.ComboBox({
            emptyText:  'Selecione criterio agrupación...',
            valueField: 'idagrupado',
            displayField: 'denominacion',
            hiddenName: 'idagrupado',
            allowBlank: false,
            mode: 'local',
            anchor: '100%',
            store: new Ext.data.SimpleStore({
                fields:['idagrupado','denominacion'],
                data: [[1,'Clasificación contable'],[2,'Naturaleza(s)']]
            }),
            blankText: 'Debe seleccionar el criterio para agrupar los datos a mostrar',
            readOnly: false,
            triggerAction: 'all'
        });
        this.agrupadoReportes.setValue(1);
        this.panelInferior = LOG.util.UIManager.initPanel({
            region: 'east',
            title:'Movimiento(s)',
            frame: true,
            animCollapse: false,
            collapsible: true,
            collapsed: false,
            width: 500,
            layout: 'form',
            autoScroll:true,
            //html: 'fit',
            minSize: 500,
            maxSize: 600,
            split: true,
            tbar: [this.btnMostrar, this.btnLimpiar,this.agrupadoReportes],
            titleCollapse: true
        });   

        this.chValorPrecioCosto = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chValorPrecioCosto,
            height: 20,
            name: _this.idioma.chValorPrecioCosto,
            report: 'ValorPrecioCosto',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                check : function ( ch, checked ) {
                    ch.setRawValue(checked == true ? 1 : 0);
                    //_this.agrupadoReportes.setDisabled(false);                    
                }
            }

            /* listeners: {
                'check': function (_checkbox, checked) {
                    _checkbox.setRawValue(checked == true ? 1 : 0);
                    var cont = 0;
                    var chgrItems = _this.chgrOpciones.items;
                    for (var i = 0; i <= chgrItems.length - 1; i++) {
                        if (chgrItems[i].checked) {
                            cont++;
                        }
                    }
                }
            } */
        });

        this.chValorTotalAgrupado = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chValorTotalAgrupado,
            height: 20,
            name: _this.idioma.chValorTotalAgrupado,
            report: 'ValorTotalAgrupado',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                check : function ( ch, checked ) {
                    ch.setRawValue(checked == true ? 1 : 0);
                    //_this.agrupadoReportes.setDisabled(false);                    
                }
            }
        });
        this.chExistValorAgrupado = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chExistValorAgrupado,
            height: 20,
            name: _this.idioma.chExistValorAgrupado,
            report: 'ExistValorAgrupado',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                check : function ( ch, checked ) {
                    ch.setRawValue(checked == true ? 1 : 0);
                    //_this.agrupadoReportes.setDisabled(false);                    
                }
            }
        });

        /* this.chValorCierre = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chValorCierre,
            height: 20,
            name: _this.idioma.chValorCierre,
            report: 'ValorCierre',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                check : function ( ch, checked ) {
                    ch.setRawValue(checked == true ? 1 : 0);
                    //_this.agrupadoReportes.setDisabled(false);                    
                }
            }
        }); */

        this.chValorPrecioCostoDoc = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chValorPrecioCostoDoc,
            height: 20,
            name: _this.idioma.chValorPrecioCostoDoc,
            report: 'ValorPrecioCostoDoc',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
                check : function ( ch, checked ) {
                    ch.setRawValue(checked == true ? 1 : 0);
                    //_this.agrupadoReportes.setDisabled(false);                    
                }
            }
        });
        /* this.chResumenVentaXAlmacen = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chResumenVentaXAlmacen,
            height: 20,
            name: _this.idioma.chResumenVentaXAlmacen,
            report: 'ResumenVentaXAlmacen',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
            }
        });
        this.chExistValorXCategoria = new Ext.form.Checkbox({ //checkbox
            boxLabel: _this.idioma.chExistValorXCategoria,
            height: 20,
            name: _this.idioma.chExistValorXCategoria,
            report: 'ExistValorXCategoria',
            //procedencia :'- Cliente:',
            //tipoCliente:1,
            //estados:'1',
            hideLabel: true,
            //style: 'margin:0px 0px 0px 25px',
            listeners: {
            }
        });  */
        this.chgrOpciones = new Ext.form.CheckboxGroup({
            items: [
                this.chValorTotalAgrupado,
                this.chValorPrecioCosto,
                this.chExistValorAgrupado,
                this.chValorPrecioCostoDoc
            ]
        });

        this.clsTipoReporte = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.clsTipoReporte.addComponent(this.chValorTotalAgrupado);
        this.clsTipoReporte.addComponent(this.chValorPrecioCosto);
        this.clsTipoReporte.addComponent(this.chExistValorAgrupado);
        this.clsTipoReporte.addComponent(this.chValorPrecioCostoDoc);
        
        this.fsTipoReporte = new Ext.form.FieldSet({ //fieldset Estado producto
            title:'Tipo de reporte',
            style: '-moz-border-radius:5px',
            labelAlign: 'top',
            labelWidth: 165,
            items: [this.clsTipoReporte/*, this.fsEstadoGeneral*/],
            height: 200
        });
        
        var listaClasifContab = new LOG.util.List();
        var checkClasifContab = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaClasifContab.add(checkClasifContab);
        listaClasifContab.add({
            header: _this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'nombre',
            default: true
        });

        var clsClasifContab = LOG.util.UIManager.proccessColumns(listaClasifContab);
        var cmClasifContab = new Ext.grid.ColumnModel(clsClasifContab.columns);
        var smClasifContab = checkClasifContab;
        _this.stClasifContab = new Ext.data.Store({
            idItem: 'diff',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'denominacion'
                    },
                    {
                        name: 'idclasificacioncontable'
                    },
                    {
                        name: 'cuenta'
                    }
                ]
            })
        });
        smClasifContab.on({
            'rowselect': function () {
                if (smClasifContab.getSelections().length >= 1) {
                    _this.btnElimClasifContab.enable();
                } else {
                    _this.btnElimClasifContab.disable();
                }
            },
            'rowdeselect': function () {
                if (smClasifContab.getSelections().length >= 1) {
                    _this.btnElimClasifContab.enable();
                } else {
                    _this.btnElimClasifContab.disable();
                }
            }
        });

        this.btnSelecClasifContab = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttBtnAddClasifContab,
            disabled: false,
            handler: function () {
                if (_this.cbDeposito.getValue() == '') {
                    mostrarMensaje(1, 'Debe selecionar el depósito.');
                }else{
                    var ventanaClasifContab = new LOG.inv.cuadrediario.ventanaClasifContab({
                        urlBusquedaGridPrincipal: 'cargarClasificaciones',
                        Idioma: LOG.inv.cuadrediario.Idioma,
                        iddeposito: _this.cbDeposito.getValue()
                    });
                    ventanaClasifContab.init();
                    ventanaClasifContab.getVistaPrincipal().title = _this.idioma.tlVentanaClasifContab;
                    ventanaClasifContab.view();
                    
                    ventanaClasifContab.getGridPrincipal().store.load();
                    var botonAceptar = ventanaClasifContab.getVistaPrincipal().listaBotones.getItem(2);
                    ventanaClasifContab.getGridPrincipal().getSelectionModel().on({
                        'rowselect': function () {
                            if (ventanaClasifContab.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                                botonAceptar.enable();
                            } else {
                                botonAceptar.disable();
                            }
                        },
                        'rowdeselect': function () {
                            if (ventanaClasifContab.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                                botonAceptar.enable();
                            } else {
                                botonAceptar.disable();
                            }
                        }
                    });
                    botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                        var records = ventanaClasifContab.getGridPrincipal().getSelectionModel().getSelections();
                        _this.addRecords(_this.stClasifContab, records);
    
                    });
                }
            }
        });
        this.btnElimClasifContab = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.ttBtnElimClasifContab,
            disabled: true,
            handler: function () {
                var seleccion = smClasifContab.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stClasifContab.remove(seleccion[i]);
                }
                if (_this.stClasifContab.getCount() == 0) {
                    _this.btnElimClasifContab.setDisabled(true);
                }
            }
        });

        this.tbClasifContab = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecClasifContab, this.btnElimClasifContab]
        });

        var gridClasifContab = LOG.util.UIManager.initGrid(cmClasifContab, _this.stClasifContab, smClasifContab, {
            tbar: this.tbClasifContab,
            height: 160,
            bbar: null,
            //expanded: clsClasifContab.expanded
        });

        this.fsClasificacionContable = new Ext.form.FieldSet({
            title: _this.idioma.fsClasificacionContable,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            //region:'west',
            autoHeight:true,
            layout:'fit',
            items: [gridClasifContab]
        });

        var listaNaturalezas = new LOG.util.List();
        var checkNaturalezas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });
        listaNaturalezas.add(checkNaturalezas);
        listaNaturalezas.add({
            header: _this.idioma.cgDenominacion,
            width: 250,
            dataIndex: 'nombre',
            default: true
        });

        var clsNaturalezas = LOG.util.UIManager.proccessColumns(listaNaturalezas);
        var cmNaturalezas = new Ext.grid.ColumnModel(clsNaturalezas.columns);
        var smNaturalezas = checkNaturalezas;
        _this.stNaturalezas = new Ext.data.Store({
            idItem: 'self',
            reader: new Ext.data.JsonReader({
                id: 'id',
                totalProperty: 'cantidad',
                root: 'datos',
                fields: [
                    {
                        name: 'idnaturaleza'
                    },
                    {
                        name: 'denominacion'
                    }
                ]
            })
        });
        smNaturalezas.on({
            'rowselect': function () {
                if (smNaturalezas.getSelections().length >= 1) {
                    _this.btnElimNaturalezas.enable();
                } else {
                    _this.btnElimNaturalezas.disable();
                }
            },
            'rowdeselect': function () {
                if (smNaturalezas.getSelections().length >= 1) {
                    _this.btnElimNaturalezas.enable();
                } else {
                    _this.btnElimNaturalezas.disable();
                }
            }
        });

        this.btnSelecNaturalezas = LOG.util.Prototipos.botonAdicionar({
            text: _this.idioma.botonAdicionar,
            tooltip: _this.idioma.ttBtnAddNaturalezas,
            disabled: false,
            handler: function () {
                if (_this.cbDeposito.getValue() == '') {
                    mostrarMensaje(1, 'Debe selecionar el depósito.');
                }else{
                    var ventanaNaturalezas = new LOG.inv.cuadrediario.ventanaNaturalezas({
                        urlBusquedaGridPrincipal: 'cargarNaturalezas',
                        Idioma: LOG.inv.cuadrediario.Idioma,
                        iddeposito: _this.cbDeposito.getValue()
                    });
                    ventanaNaturalezas.init();
                    ventanaNaturalezas.getVistaPrincipal().title = _this.idioma.tlVentanaNaturalezas;
                    ventanaNaturalezas.view();
                    ventanaNaturalezas.getGridPrincipal().store.load();
                    var botonAceptar = ventanaNaturalezas.getVistaPrincipal().listaBotones.getItem(2);
                    ventanaNaturalezas.getGridPrincipal().getSelectionModel().on({
                        'rowselect': function () {
                            if (ventanaNaturalezas.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                                botonAceptar.enable();
                            } else {
                                botonAceptar.disable();
                            }
                        },
                        'rowdeselect': function () {
                            if (ventanaNaturalezas.getGridPrincipal().getSelectionModel().getSelections().length >= 1) {
                                botonAceptar.enable();
                            } else {
                                botonAceptar.disable();
                            }
                        }
                    });
                    botonAceptar.handler = botonAceptar.handler.createSequence(function (e) {
                        var records = ventanaNaturalezas.getGridPrincipal().getSelectionModel().getSelections();
                        _this.addRecords(_this.stNaturalezas, records);
                    });
                }
                


            }
        });
        this.btnElimNaturalezas = LOG.util.Prototipos.botonEliminar({
            text: _this.idioma.btnEliminar,
            tooltip: _this.idioma.ttBtnElimNaturalezas,
            disabled: true,
            handler: function () {
                var seleccion = smNaturalezas.getSelections();
                for (var i = 0; i < seleccion.length; i++) {
                    _this.stNaturalezas.remove(seleccion[i]);
                }
                if (_this.stNaturalezas.getCount() == 0) {
                    _this.btnElimNaturalezas.setDisabled(true);
                }
            }
        });

        this.tbNaturalezas = new LOG.util.UIManager.initToolbar({
            items: [this.btnSelecNaturalezas, this.btnElimNaturalezas]
        });

        var griNaturalezas = LOG.util.UIManager.initGrid(cmNaturalezas, _this.stNaturalezas, smNaturalezas, {
            tbar: this.tbNaturalezas,
            height: 160,
            bbar: null//,
            //expanded: clsNaturalezas.expanded
        });

        this.fsNaturalezas = new Ext.form.FieldSet({
            title: _this.idioma.fsNaturalezas,
            style: '-moz-border-radius:5px;height:98%',
            labelAlign: 'top',
            //region:'west',
            autoHeight:true,
            layout:'fit',
            items: [griNaturalezas]
        });


        this.clsComponent = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });

        this.clsComponent.addComponent(this.fsTipoReporte);
        this.clsComponent.addComponent(this.fsClasificacionContable);
        this.clsComponent.addComponent(this.fsNaturalezas);

        this.panelInferior.add(this.clsComponent);

        this.formularioGeneral = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'form',
            bodyBorder: false,
            frame: true
        });

        //Diseño de la ventana
        var superiorCentral = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        var superiorWest = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        var superiorCentral1=LOG.util.UIManager.initColumnForm({
            columnas: 8
        });
        
        _this.cbDeposito =  new LOG.util.SelectorTF({
            fieldLabel :_this.idioma.lbDep,
            title :_this.idioma.lbcbDeposito,
            emptyText: _this.idioma.lbSeleccione,
            url: 'cargardepositos',
            controller : '/logistica/inventario/cuadrediario/index.php/cuadrediario',
            valueField : 'iddeposito',
            displayField : 'almacen',
            hiddenName : 'iddeposito',
            //autoLoad: true,
            anchor:'80%',
            columns : [{
                    header : _this.idioma.cgCodigo,
                    dataIndex : 'codigo',
                    width : 60
                }, {
                    header : _this.idioma.lbDep,
                    dataIndex : 'almacen',
                    width : 310,
                    autoExpand : true
                },{
                    header : _this.idioma.lbDfFecha,
                    dataIndex : 'fechaactual',
                    align: 'center',
                    width : 80,
                },{
                    header : _this.idioma.lbUltCierre,
                    dataIndex : 'fechaultcierre',
                    align: 'center',
                    width : 80,
                },{
                    dataIndex : 'proxfecha'
                }
            ],
            listeners: {
            }
        });
        
        _this.dfUltimocierre = new LOG.util.Prototipos.inputTexto({
            name : 'ultimocierre',
            //allowBlank: false,
            fieldLabel: _this.idioma.lbBtnFechaUltCierre,
            disabled: true,
            width:'80',
            anchor:'20%',
            //anchor: '60%',
            //value: modificar ? row.data.nombre : null
        });

        _this.cbDeposito.on('change', function (field, newValue, oldValue) {

            if (field.getValue()) {
                _this.modelo.cerrarDiaActual({
                    iddeposito:field.getValue(),
                    fechaactual: field.data.fechaactual}, function(resp){
                    _this.gridProductosG.getStorePrincipal().initBaseParams.iddeposito = field.getValue();
                    _this.gridProductosG.getStorePrincipal().initBaseParams.fechaactual = field.data.fechaactual;
                    _this.gridProductosG.getStorePrincipal().initBaseParams.idcierrediario = resp.idcierrediario || null;
                    _this.gridProductosG.getStorePrincipal().initBaseParams.estado = 0;
                    _this.gridProductosG.getStorePrincipal().initBaseParams.isapertura = 0;
                    _this.gridProductosG.getStorePrincipal().load();
                });
            }
        });

        _this.cbDeposito.on('select', function (field, newValue, oldValue) {
            
        });
        

        _this.lblSaldoInicial = new Ext.form.Label({
            text: _this.idioma.lbSaldoIni+': ',
            style: 'color:black;padding-left: 10px;font-weight: bolder;font-size: 14px;'
        }); 

        _this.lblValorSaldoInicial = new Ext.form.Label({
            html: '<span id="idvalorsaldoini">0.00</span>',
            style: 'color:black;font-weight: bolder;font-size: 14px;'
        });
        

        _this.lblSaldoFinal = new Ext.form.Label({
            text: _this.idioma.lbSaldoFin+': ',
            style: 'color:black;padding-left: 10px;font-weight: bolder;font-size: 14px;'
        });

        _this.lblValorSaldoFinal = new Ext.form.Label({
            html: '<span id="idvalorsaldofin">0.00</span>',
            style: 'color:black;font-weight: bolder;font-size: 14px;'
        });
        

        _this.lblSaldoContable = new Ext.form.Label({
            text: _this.idioma.lbSaldoCont+': ',
            style: 'color:black;padding-left: 10px;font-weight: bolder;font-size: 14px;'
        });

        _this.lblValorSaldoContable = new Ext.form.Label({
            html: '<span id="idvalorsaldoCont">0.00</span>',
            style: 'color:black;font-weight: bolder;font-size: 14px;'
        });
        

        _this.lblDiferencia = new Ext.form.Label({
            text: _this.idioma.lbDifSaldo+': ',
            style: 'color:black;padding-left: 10px;font-weight: bolder;font-size: 14px;'
        });

        _this.lblValorDiferencia = new Ext.form.Label({
            html: '<span id="idvalordiferencia">0.00</span>',
            style: 'color:black;font-weight: bolder;font-size: 14px;'
        });

        superiorCentral1.addComponent(_this.lblSaldoInicial);
        superiorCentral1.addComponent(_this.lblValorSaldoInicial);
        superiorCentral1.addComponent(_this.lblSaldoFinal);
        superiorCentral1.addComponent(_this.lblValorSaldoFinal);
        superiorCentral1.addComponent(_this.lblSaldoContable);
        superiorCentral1.addComponent(_this.lblValorSaldoContable); 
        superiorCentral1.addComponent(_this.lblDiferencia);
        superiorCentral1.addComponent(_this.lblValorDiferencia); 
       
        superiorWest.addComponent(_this.cbDeposito);
        superiorWest.addComponent(_this.dfUltimocierre);
        superiorCentral.addComponent(superiorWest);
        superiorCentral.addComponent(superiorCentral1);
        

        this.formularioGeneral.add(superiorCentral);
        this.formularioGeneral.setHeight(100);

        this.gridProductosG = new LOG.inv.cuadrediario.GridViewProducto({
            idioma: this.idioma,
            acciones: this.acciones,
            autoHeigth: true,
            region: 'center',
            gridEditable: false,
            iddeposorigen: undefined,
            autoLoad: false,
            scope: _this,
            modelo: this.modelo,
            initDefaultButtons: function () {
                //Botones de la ventana
                var _scope = this;
                this.addToolbarButton(LOG.util.UIManager.createBtn({                    
                    text: 'Actualizar',
                    tooltip: 'Actualizar saldos',
                    iconCls: 'actualizar',
                    disabled: true,
                    isContextual: true,
                    handler: function() {
                        _this.record.estado = 0;
                        _this.modelo.actualizarDatos(_this.record, function(){
                            _this.scope.gpPrincipal.store.load();
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function(b, _caller) {
                    }
                }));
                this.addToolbarButton('->');
                this.addToolbarButton(LOG.util.UIManager.createBtn({     
                    id: 'abrirdiaactual',               
                    text: 'Abrir cierre',
                    tooltip: 'Abrir cierre del día',
                    iconCls: 'abrir',
                    disabled: true,
                    //hidden: true,
                    isContextual: true,
                    handler: function() {
                        _this.record.estado = 0;
                        _this.modelo.abrirDiaActual(_this.record, function(){
                            _this.scope.gpPrincipal.store.load();
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function(b, _caller) {
                        /*if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RActivar')) {
                            b.show();
                            b.disable();
                            LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'activarTarea');
                        } else {
                            b.hide();
                        }*/
                    }
                }));
                this.addToolbarButton( LOG.util.Prototipos.inputTexto({
                    name : 'fechaactualinv',
                    id: 'fechaactualinv',
                    //allowBlank: false,
                    disabled: true,
                    width:'58'
                    //anchor: '60%',
                    //value: modificar ? row.data.nombre : null
                }));
                this.addToolbarButton(LOG.util.UIManager.createBtn({ 
                    id: 'cerrardia',                   
                    text: 'Realizar cierre',
                    tooltip: 'Relizar cierre del día',
                    iconCls: 'cierrediario',
                    isContextual: true,
                    disabled: true,
                    handler: function() {
                        _this.record.estado = 1;
                        _this.modelo.cerrarDiaActual(_this.record, function(){
                            _this.scope.gpPrincipal.store.load();
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function(b, _caller) {
                        /* if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RActivar')) {
                            b.show(); 
                            b.disable();
                            LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'activarTarea');
                        }  else {
                            b.hide();
                        }  */
                    }
                }));
                this.addToolbarButton( LOG.util.Prototipos.inputTexto({
                    name : 'fechainv',
                    id: 'fechainv',
                    disabled: true,
                    //allowBlank: false,
                    width:'58'
                    //anchor: '60%',
                    //value: modificar ? row.data.nombre : null
                }));
                this.addToolbarButton(LOG.util.UIManager.createBtn({       
                    id: 'abrirproxdia',             
                    text: 'Abrir día',
                    tooltip: 'Abrir día',
                    iconCls: 'siguiente',
                    disabled: true,
                    isContextual: true,
                    handler: function() {
                        _this.record.estado = 2;
                        _this.modelo.abrirProximoDia(_this.record, function(){
                            _this.scope.gpPrincipal.store.load();
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function(b, _caller) {
                        /* if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RActivar')) {
                            b.show();
                            b.disable();
                            LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                                if (e == 'selectionchange') {
                                    if (this.getCount() == 1 && this.getSelected().data.estado == '1') {
                                        b.enable();
                                    } else {
                                        b.disable();
                                    }
                                }
                            }, 'activarTarea');
                        } else {
                            b.hide();
                        } */
                    }
                }));
                this.addToolbarButton( LOG.util.Prototipos.inputTexto({
                    name : 'proxfechainv',
                    id: 'proxfechainv',
                    disabled: true,
                    //disabled: true,
                    //allowBlank: false,
                    width:'58'
                    //anchor: '60%',
                    //value: modificar ? row.data.nombre : null
                }));
                
                this.addToolbarButton(LOG.util.UIManager.createBtn({       
                    id: 'bloqcierre',             
                    text: 'Bloquear cierre',
                    tooltip: 'Bloquear cierre',
                    iconCls: 'cierre',
                    disabled: true,
                    isContextual: true,
                    handler: function() {
                        _this.record.estado = 2;
                        _this.modelo.bloquearCierre(_this.record, function(){
                            _this.scope.gpPrincipal.store.load();
                            _this.gridProductosG.getStorePrincipal().load();
                        });
                    },
                    controlFn: function(b, _caller) {
                    }
                }));
            }
        });
        this.gridProductosG.init();
        this.panelGridProductosG = this.gridProductosG.view();
        
        /* this.btnSalvar = LOG.util.Prototipos.botonGuardar({
            tooltip: this.idioma.ttBtnGuardar,
            handler: function () {
                console.info("primero");
                _this.salvarHandlerTransInterna();                
            },
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnSalvar);
            }
        });
        this.btnNuevo = LOG.util.Prototipos.botonNuevo({
            tooltip: 'this.idioma.ttBtnNuevo',
            handler: this.onResetHandler,
            scope: this,
            controlFn: function () {
                _this.controlFnGuardar(_this.btnNuevo, true);
            }
        });*/
        this.btnCerrar = LOG.util.Prototipos.botonCancelar({
            handler: this.onCancelarHandler,
            text: 'this.idioma.lbBtnCerrar',
            scope: this
        }, true);

        LOG.util.UIManager.apply(this, {
            //tbar: this.listaBotonesVentana.getArray(),
            resizable: false,
            layout: 'form',
            items: [this.panelSuperior, this.panelGridProductosG, this.panelInferior/*,this.panelContenedorGrids*/],
            buttons: [this.btnCerrar/*, this.btnSalvar */]
        });
        LOG.lb.documento.ventanaGestionDocumentos.superclass.initComponent.call(this);
        this.fireEvent = this.fireEvent.createSequence(function (e) {
            if (e == 'resize') {
                _this.definirAltura();
            }
        });
    },
    showReport: function (btn) {
        var _this=this;
        _this.reports = [];
        var chgrItems = _this.chgrOpciones.items;
        var stringstClasifContab = "";
        var stringNaturalezas = "";
        var contItems = 0;
        _this.entidades=[];
        _this.entidadesCheck=[];
        for (var i = 0; i < _this.stClasifContab.data.items.length; i++) {
            if (i != _this.stClasifContab.data.items.length - 1) {
                stringstClasifContab += _this.stClasifContab.data.items[i].data.idclasificacioncontable + ",";
            } else {
                stringstClasifContab += _this.stClasifContab.data.items[i].data.idclasificacioncontable + "";
            }
        }
        stringstClasifContab = "{" + stringstClasifContab + "}";
        if(stringstClasifContab== "{}") {
            stringstClasifContab = null;
        }

        for (var i = 0; i < _this.stNaturalezas.data.items.length; i++) {
            if (i != _this.stNaturalezas.data.items.length - 1) {
                stringNaturalezas += _this.stNaturalezas.data.items[i].data.idnaturaleza + ",";
            } else {
                stringNaturalezas += _this.stNaturalezas.data.items[i].data.idnaturaleza + "";
            }
        }
        stringNaturalezas = "{" + stringNaturalezas + "}";
        if(stringNaturalezas== "{}") {
            stringNaturalezas = null;
        }

        for (var i = 0; i <= chgrItems.length - 1; i++) {
            if (chgrItems[i].checked) {
                contItems++;
            }
        }

        if (this.cbDeposito.getValue() == '') {
            mostrarMensaje(1, 'Debe selecionar el depósito.');
        } else /*if (contItems == 0) {
            mostrarMensaje(1, 'Debe seleccionar al menos un reporte.');
        } else*/ if (this.agrupadoReportes.getValue() == '') {
            mostrarMensaje(1, 'Debe selecionar el orden para mostrar los datos.');
        } else {
            for (var i = 0; i <= chgrItems.length - 1; i++) {
                if (chgrItems[i].checked) {
                    _this.reports.push(
                        {
                            dirReport: '/distra/logistica/inventario/cuadrediario/'+ chgrItems[i].report /*+ btn.sufijo*/,
                            name: chgrItems[i].name,
                            isList:true,
                            params: {
                                iddeposito: this.cbDeposito.getValue(),
                                idcierrediario: this.record.idcierrediario,
                                estado: this.record.estado,
                                arrayclasifcontab: stringstClasifContab,
                                arraynaturalezas: stringNaturalezas,
                                agrupadopor: this.agrupadoReportes.getValue(),
                                //title: btn.title + ' Productos ' + chgrItems[i].boxLabel,
                                reporte: chgrItems[i].reporte ? chgrItems[i].reporte : 0,
                            }
                        }
                    );

                }
            }
            _this.tipoReportes = new LOG.util.Report({
                reports: _this.reports
            });
            _this.tipoReportes.view();
        }
    },
    botonLimpiar: function () {
        var _this=this;
        _this.stNaturalezas.removeAll();
        _this.stClasifContab.removeAll();
        for (var i = 0; i < _this.chgrOpciones.items.length; i++) {
            _this.chgrOpciones.items[i].setValue(false);
        }
        /* _this.dfDesdeCP.setValue(null);
        _this.dfHastaCP.setValue(null);
        _this.dfDesdeCP.setMaxValue(null);
        _this.dfHastaCP.setMinValue(null);
        for (var i = 0; i < _this.chgrEstadoProd.items.length; i++) {
            _this.chgrEstadoProd.items[i].setValue(false);
        }
        _this.stCliente.removeAll();
        _this.comboDepositos.clearValue(); */
    },
    addRecords: function (store, records) {
        var _this = this;
        Ext.each(records, function (record, index) {
            if (!_this.existsRecord(store, record)) {
                var recordType;
                if (store.idItem === 'diff') {
                    recordType = new store.recordType({
                        idclasificacioncontable: record.get('idclasificacioncontable'),
                        denominacion: record.get('denominacion')
                    });
                } else if (store.idItem === 'self') {
                    recordType = new store.recordType({
                        idnaturaleza: record.get('idnaturaleza'),
                        denominacion: record.get('denominacion')
                    });
                }
                store.add(recordType);
            }
        });
    },
    existsRecord: function (store, record) {
        var flags = false;
        Ext.each(store.data.items, function (nRecord, index) {
            if (store.idItem === 'diff') {
                if ( nRecord.get('idclasificacioncontable') === record.get('idclasificacioncontable')) {
                    flags = true;
                }
            } else if (store.idItem === 'self') {
                if (nRecord.get('idnaturaleza') === record.get('idnaturaleza')) {
                    flags = true;
                }
            }
        });
        return flags;
    },
    setValuesComponent:function(field){
        var _this = this;
        this.record = field;
        let diferencia = field.diferencia;  
        _this.lblValorSaldoInicial.setText(Ext.util.Format.number(parseFloat(field.importeinicial).toFixed(2), '0,000.00'));
        _this.lblValorSaldoFinal.setText(Ext.util.Format.number(parseFloat(field.importefinal).toFixed(2), '0,000.00'));
        _this.lblValorSaldoContable.setText(Ext.util.Format.number(parseFloat(field.saldocont).toFixed(2), '0,000.00'));
        _this.lblValorDiferencia.setText(Ext.util.Format.number(parseFloat(diferencia).toFixed(2), '0,000.00'));

        /* if(diferencia < 0){
            _this.lblValorSaldoFinal.style.color = 'red';
        }else if(diferencia > 0){
            _this.lblValorSaldoFinal.style.color = 'red';
        } */
        const vfecha = field.fechaactual.split("/");
        const [day,moth,year] = vfecha; 

        let lastDayMonth = new Date(year, parseInt(moth), 0);
        let lastDay = lastDayMonth.getDate();


        _this.dfUltimocierre.setValue(field.fechaultcierre);
        if(field.apertura == 1 || field.estado == 2){
            _this.gridProductosG.listaBotones.arrayData[0].disable();
            _this.gridProductosG.listaBotones.arrayData[4].disable();
            _this.gridProductosG.listaBotones.arrayData[5].disable();

            _this.gridProductosG.listaBotones.arrayData[2].disable();
            _this.gridProductosG.listaBotones.arrayData[3].disable();
            if(field.estado == 2 || day < lastDay){
                _this.gridProductosG.listaBotones.arrayData[6].disable();
                _this.gridProductosG.listaBotones.arrayData[7].disable();
            }else{                
                _this.gridProductosG.listaBotones.arrayData[6].enable();
                _this.gridProductosG.listaBotones.arrayData[7].enable();
            }

            _this.gridProductosG.listaBotones.arrayData[8].disable();

            _this.agrupadoReportes.setValue(1);
            _this.agrupadoReportes.setDisabled(true);
            _this.chExistValorAgrupado.setDisabled(true);
            _this.chValorPrecioCosto.setDisabled(true);
            _this.chValorPrecioCostoDoc.setDisabled(true);
        }else 
        if(field.estado == 0){
            _this.gridProductosG.listaBotones.arrayData[0].enable();
            _this.gridProductosG.listaBotones.arrayData[4].enable();
            _this.gridProductosG.listaBotones.arrayData[5].enable();

            _this.gridProductosG.listaBotones.arrayData[2].disable();
            _this.gridProductosG.listaBotones.arrayData[3].disable();
            _this.gridProductosG.listaBotones.arrayData[6].disable();
            _this.gridProductosG.listaBotones.arrayData[7].disable();

            _this.gridProductosG.listaBotones.arrayData[8].disable();

            _this.agrupadoReportes.setDisabled(false);
            _this.chExistValorAgrupado.setDisabled(false);
            _this.chValorPrecioCosto.setDisabled(false);
            _this.chValorPrecioCostoDoc.setDisabled(false);

        }else if(field.estado == 1){
            console.info(field);
            if(field.fechaactual != field.proxfecha){
                _this.gridProductosG.listaBotones.arrayData[2].disable();
                _this.gridProductosG.listaBotones.arrayData[3].disable();
            }else{
                _this.gridProductosG.listaBotones.arrayData[2].enable();
                _this.gridProductosG.listaBotones.arrayData[3].enable();
                _this.gridProductosG.listaBotones.arrayData[8].enable();
            }
            
            if(field.fechaactual < field.proxfecha && day < lastDay){
                _this.gridProductosG.listaBotones.arrayData[6].enable();
                _this.gridProductosG.listaBotones.arrayData[7].enable();
            }else{                
                _this.gridProductosG.listaBotones.arrayData[6].disable();
                _this.gridProductosG.listaBotones.arrayData[7].disable();
            }
            
            if(day == lastDay){
                _this.gridProductosG.listaBotones.arrayData[8].enable();
            }
            
            _this.gridProductosG.listaBotones.arrayData[0].disable();
            _this.gridProductosG.listaBotones.arrayData[4].disable();
            _this.gridProductosG.listaBotones.arrayData[5].disable();

            _this.agrupadoReportes.setValue(1);
            _this.agrupadoReportes.setDisabled(true);
            _this.chExistValorAgrupado.setDisabled(true);
            _this.chValorPrecioCosto.setDisabled(true);
            _this.chValorPrecioCostoDoc.setDisabled(true);
        }
        
        _this.gridProductosG.listaBotones.arrayData[3].setValue(field.fechaactual);
        _this.gridProductosG.listaBotones.arrayData[5].setValue(field.fechaactual);
        _this.gridProductosG.listaBotones.arrayData[7].setValue(field.proxfecha);
        _this.gridProductosG.getStorePrincipal().initBaseParams.iddeposito = field.iddeposito;
        _this.gridProductosG.getStorePrincipal().initBaseParams.isapertura = field.apertura;
        _this.gridProductosG.getStorePrincipal().initBaseParams.estado = field.estado;
        _this.gridProductosG.getStorePrincipal().initBaseParams.idcierrediario = field.idcierrediario;
        
        if(field.action == 'mod'){
            _this.gridProductosG.getStorePrincipal().load();
        }
    },
    onRenderHandler: function () {
        /* LOG.util.UIManager.applyKey(this.btnSalvar, this);
        LOG.util.UIManager.applyKey(this.btnCerrar, this); */
        //LOG.util.UIManager.applyKey(this.btnNuevo, this);

    },
    initDefaultColumns: function () {
    },/* 
    habilitarBtn: function () {
        Ext.each(this.fromularioGestion.getForm().items.items, function (e) {
            if (e.combo) {
                if (e.hiddenName == "idmotivodevolucion" && !e.getValue() || e.hiddenName == "idconcepretenido" && !e.getValue()) {
                    e.disable();
                } else {
                    e.enable();
                }
            } else {
                e.enable();
            }
        });


        this.gridProductosG.listaBotones.getItem(0).enable();
        this.gridProductosG.listaBotones.getItem(1).enable();

        this.gridEntregaG.listaBotones.getItem(0).enable();
        this.gridEntregaG.listaBotones.getItem(1).enable();
    }, */
    /* desHabilitarBtn: function () {
        Ext.each(this.fromularioGestion.getForm().items.items, function (e) {
            e.disable();
        });
        this.gridProductosG.listaBotones.getItem(0).disable();
        this.gridProductosG.listaBotones.getItem(1).disable();

        this.gridEntregaG.listaBotones.getItem(0).disable();
        this.gridEntregaG.listaBotones.getItem(1).disable();


    }, */
    initDefaultButtons: function () {
        //Botones de la ventana
        var _this = this;
        this.addToolbarButtonVentana(LOG.util.Prototipos.botonEliminar({
            handler: function () {
                _this.modelo.eliminar({id: _this.record.iddocumento}, function () {
                    _this.getTitleDocumento(_this.record.iddocumento);
                    _this.record = null;
                    _this.onResetHandler;
                    _this.controlBtns();
                });
            },
            controlFn: function (b, _caller) {
                /* if (_caller.grantedAction('CT') || _caller.grantedAction('RCRUD') || _caller.grantedAction('REliminar')) {
                    b.setVisible(true);
                } else b.setVisible(false);
                b.disable();
                if (_caller.record && _caller.record.data.estado == 1) {
                    b.enable();
                } else {
                    b.disable();
                } */
            }
        }));
    },
    definirAltura: function () {
        var alto = this.getHeight() - 126;
        var altoInferior = alto - 150;
    },
    prepareDocModify: function (d, noCargar) {
        var _this = this;
        this.fromularioGestion.getForm().loadRecord(d);
        /* if (!noCargar) {
            this.modelo.loadRecord();
        } */
        this.record = d.json;
        this.record.action = 'mod';
        this.setTitle(this.idioma.tlVerDetalles);
        //this.getHabilitarDesabilitarAbrir();
        _this.setValuesComponent(this.record);
        _this.cbDeposito.setRawValue(this.record.deposito);
    },/* 
    ocultarColumna: function () {

    }, */
    controlBtns: function () {
        var _this = this;
        _this.listaBotonesVentana.each(function (b) {
            LOG.util.UIManager.applyKey(b, _this);
            if (typeof b.controlFn == 'function') {
                b.controlFn.createDelegate(_this, [b, _this]).call();
            }
        }, _this);
    },
    grantedAction: function (idAccion) {
        var existe = false;
        this.listaAcciones.each(function (a) {
            if (a['abreviatura'] == idAccion) {
                existe = true;
            }
        });
        return existe;
    },
    onResetHandler: function () {
        var _this = this.scope || this;
        if (_this.fromularioGestion) {
            _this.modelo.reset();
            _this.fromularioGestion.getForm()._record = null;
            _this.gridProductosG.getStorePrincipal().removeAll();
            _this.gridEntregaG.getStorePrincipal().removeAll();
            _this.record = null;
            _this.setTitle(_this.idioma.tlAdicionar);
            _this.onShowHandler();
            _this.modelo.gridEditado = false;
        }
    },
    onCloseHandler: function (p) {
        var _this = this;
        if (_this.fromularioGestion) {
            _this.record = null;
            _this.fromularioGestion.getForm()._record = null;
            _this.fromularioGestion.getForm().reset();
            _this.modelo.reset();
            _this.gridProductosG.getStorePrincipal().removeAll();
            //_this.gridEntregaG.getStorePrincipal().removeAll();
            _this.modelo.gridEditado = false;
            _this.getHabilitarDesabilitarNuevo();

        }
        if (_this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento) {
            var id = _this.modelo[_this.modelo.primaryKeyField] || _this.idDocumento;
            _this.modelo.cargaInicial({
                cargando: true,
                url: '/logistica/utiles/documento/index.php/desbloqueo/desbloquearDocumento',
                id: Ext.encode([id])
            });
        }
        _this.scope.getStorePrincipal().reload();
        return LOG.lb.documento.ventanaGestionDocumentos.superclass.onCloseHandler.call(_this, p);
    },
    getHabilitarDesabilitarNuevo: function () {
        var _this = this;
        _this.cbDeposito.enable();
        _this.cbDeposito.setValue(null);
        _this.iddeposito = null;
        Ext.each(_this.chgrOpciones.items, function (e) {
            e.setValue(false);
        });
        _this.lblValorSaldoInicial.setText('0.00');
        _this.lblValorSaldoFinal.setText('0.00');
        _this.lblValorSaldoContable.setText('0.00');
        _this.lblValorDiferencia.setText('0.00');
        _this.stClasifContab.removeAll();
        _this.stNaturalezas.removeAll();
        _this.dfUltimocierre.setValue(null);
        _this.gridProductosG.getStorePrincipal().removeAll();

        /* _this.
        _this. */
        /* _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(0).disable();
        _this.scope.winGestionarDocumento.gridProductosG.listaBotones.getItem(1).disable(); */
        /* _this.scope.winGestionarDocumento.gridEntregaG.listaBotones.getItem(0).disable();
        _this.scope.winGestionarDocumento.gridEntregaG.listaBotones.getItem(1).disable(); */
    },/* 
    getHabilitarDesabilitarAbrir: function () {
        var _this = this;
        console.info(_this);
        if (_this.record.estado == 0) {
            
            Ext.each(_this.scope.winGestionarDocumento.gridProductosG.listaBotones.arrayData, function (e) {
                e.disable();
                if(e.id == "fechainv" || e.id == "cerrardia" || e.id == 'actualizardatos'){
                    e.enable();
                }
            });
        } else {
            
            Ext.each(_this.scope.winGestionarDocumento.gridProductosG.listaBotones.arrayData, function (e) {
                e.enable();
                if(e.id == "fechainv" || e.id == "cerrardia" || e.id == 'actualizardatos'){
                    e.disable();
                }
            });
        }
    }, */
    cargarProductos: function () {

    }
});

LOG.inv.cuadrediario.GridViewProducto = Ext.extend(LOG.util.UITemplate, {
    idtransfinterna: undefined,
    recordDoc: undefined,
    constructor: function (config) {
        this.busquedaBasica = false;
        this.formaVisualizacion = 'panel';
        this.modoSeleccion = 3;
        this.scope = config.scope;
        this.dirController = '/logistica/inventario/cuadrediario/index.php/cuadrediario';
        config.urlBusquedaGridPrincipal = 'cargarClasificacionesCierre';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.inv.cuadrediario.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        //this.gridEditable = false;
        LOG.inv.cuadrediario.GridViewProducto.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'idclasificacioncontable',
            hidden: true
        });

        this.addGridColumn({
            dataIndex: 'idcuadreclasificacion',
            hidden: true
        });
        
        this.addGridColumn({
            dataIndex: 'clasificacion',
            header: this.idioma.cgClasificacion,
            width: 250,
            autoExpand: true/* ,
            filter: {
                type: 'string',
                dataIndex: 'clasificacioncontable'
            } */
        });
        
        this.addGridColumn({
            dataIndex: 'cuenta',
            header: this.idioma.cgCuenta,
            width: 130
        });
        
        /* this.addGridColumn({
            dataIndex: 'productos',
            header: this.idioma.lbProductos,
            width: 90,
            align: 'right',
        }); */

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            dataIndex: 'saldoinicial',
            align: 'right',
            header: this.idioma.lbSaldoIni,
            width: 120
        }));

        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            dataIndex: 'saldofinal',
            align: 'right',
            header: this.idioma.lbSaldoFin,
            width: 120
        }));
        
        this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            dataIndex: 'saldocont',
            align: 'right',
            header: this.idioma.lbSaldoCont,
            width: 120
        }));
        
         this.addGridColumn(LOG.util.Prototipos.columnaImporte({
            dataIndex: 'diferencia',
            align: 'right',
            header: this.idioma.lbDifSaldo,
            width: 120,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                let saldocont = parseFloat(record.data.saldocont);
                let saldofinal = parseFloat(record.data.saldofinal);
                let diferencia = saldofinal - saldocont; 
                return diferencia;
                /* Ext.util.Format.number(parseFloat(diferencia).toFixed(2), '0,000.00')
                console.info(); */
            }
        })); 
    },
    render: function () {
        var _this = this;
         //var record = (_this.scope.scope.smGridPrincipal.selections.items[0].data) ? _this.scope.scope.smGridPrincipal.selections.items[0].data: false;

        var vista = LOG.inv.cuadrediario.GridViewProducto.superclass.render.call(this);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function (e, obj) {
            if (e == 'afteredit') {
                if (obj.field == 'cantidad') {
                    if (_this.scope.record && _this.scope.record.data.estado == 1)
                        _this.scope.modelo.gridEditado = true;
                    
                    if (_this.scope.modelo.isValid()) {
                        _this.scope.modelo.habilitarBotones();
                    } else {
                        _this.scope.modelo.habilitarBotones(true);
                    }
                }
            }
        });

        this.getStorePrincipal().on({
            beforeload: function (st, obj) {
            },
            load: function (st, record, obj){
                //console.info(st);
                if(record.length > 0){
                    _this.scope.cbDeposito.disable();
                }
                /* console.info((st.reader.jsonData.record));
                console.info((Object.keys(st.reader.jsonData.record).length));
                console.info(_this.scope.record);
                console.info(_this.scope.record.action); */
                //if(typeof st.reader.jsonData != 'undefined'){
                if(typeof st.reader.jsonData.record != 'undefined'
                    && Object.keys(st.reader.jsonData.record).length != 0){
                    st.reader.jsonData.record.action = 'reload';
                    _this.scope.setValuesComponent(st.reader.jsonData.record);
                    //}
                }else if(_this.scope.record != null){
                    if(_this.scope.record.action == 'mod'){
                        _this.scope.record.action = 'reload';
                    }
                    _this.scope.setValuesComponent(_this.scope.record);
                }

            }
        });

        this.getSmPrincipal().on(
            'rowselect', function (sm, index) {
                var record = sm.getSelected();

                /* if (sm.hasSelection() && _this.scope.record.data.estado == 1) {
                    _this.listaBotones.getItem(1).enable();
                } */

               /*  if (record && record.data.idtransfinterna) {

                    if (_this.scope.record && _this.scope.record.data.estado == 1) {
                        _this.scope.gridEntregaG.btnAdicionarLote.enable();
                    }
                }
                if(_this.scope.record.data.estado != 1){
                    var cm= _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=null;
                }else if(record.data.tienelote == 0 && _this.scope.record.data.estado == 1){
                    var cantidad = new LOG.util.Prototipos.inputDecimal({
                        width: 100,
                        maxLength: '19'
                    });
                    var cm = _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=cantidad;
                    _this.scope.panelInferior.collapse(true);
                }
                if(record.data.tienelote == 1){
                    var cm= _this.scope.gridProductosG.getGridPrincipal().getColumnModel().getColumnById('cantidad');
                    cm.editor=null;
                    _this.scope.panelInferior.expand(true);
                } */

            });
        this.getSmPrincipal().on(
            'rowdeselect', function (sm, index) {
                var record = sm.getSelected();
                if (!sm.hasSelection()) {
                    _this.listaBotones.getItem(1).disable();
                }

            });


        return vista;
    },
    getRecordsToSave: function () {
        var arr = new Array();
        this.getStorePrincipal().each(function (rec) {
            // if(rec.data.idproductotransfinterna || rec.dirty) {
            arr.push(rec.data);
            //}
        });
        return arr;
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

LOG.inv.cuadrediario.ventanaClasifContab = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.iddeposito = config.iddeposito;
        this.idioma = config.Idioma;
        config.dirController =  '/logistica/inventario/cuadrediario/index.php/cuadrediario',
        config.modoSeleccion = 3;
        config.autoSelect = false;
        config.autoLoad = true;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        LOG.inv.cuadrediario.ventanaClasifContab.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.clientes;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;

    },
    init: function () {
        var _this = this;
        LOG.inv.cuadrediario.ventanaClasifContab.superclass.init.call(this);
        
        _this.getVistaPrincipal().width = 550;
        _this.getVistaPrincipal().height = 500;
        /* _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable(); */


    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 280,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgCuenta,
            width: 180,
            dataIndex: 'cuenta',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idclasificacioncontable'
        });

    },
    render: function () {
        var _this = this;
        var p = LOG.inv.cuadrediario.ventanaClasifContab.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.baseParams.criterio = st.baseParams.criterio;
                st.initBaseParams.iddeposito = _this.iddeposito;
            }
        });
        return p;
    }
});

LOG.inv.cuadrediario.ventanaNaturalezas = Ext.extend(LOG.util.UITemplate, {

    idioma: undefined,
    constructor: function (config) {
        var _this = this;
        this.idioma = config.Idioma;
        this.iddeposito = config.iddeposito;
        config.dirController =  '/logistica/inventario/cuadrediario/index.php/cuadrediario',
        config.modoSeleccion = 3;
        config.autoSelect = false;
        config.autoLoad = true;
        config.busquedaBasica = true;
        config.formaVisualizacion = 'ventana';
        config = Ext.apply(_this, config);
        LOG.inv.cuadrediario.ventanaNaturalezas.superclass.constructor.call(this, config);
        _this.concepto = this.idioma.clientes;
        _this.textBusquedaSimple = this.idioma.txtBusquedaSimpleC;

    },
    init: function () {
        var _this = this;
        LOG.inv.cuadrediario.ventanaNaturalezas.superclass.init.call(this);

        _this.getVistaPrincipal().width = 500;
        _this.getVistaPrincipal().height = 500;
        /* _this.getVistaPrincipal().listaBotones.getItem(1).hide();
        _this.getVistaPrincipal().listaBotones.getItem(2).disable(); */


    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            header: _this.idioma.cgCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.cgDenominacion,
            width: 200,
            dataIndex: 'denominacion',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idnaturaleza'
        });

    },
    render: function () {
        var _this = this;
        var p = LOG.inv.cuadrediario.ventanaNaturalezas.superclass.render.call(this);
        _this.getStorePrincipal().on({
            'beforeload': function (st) {
                st.baseParams.criterio = st.baseParams.criterio;
                st.initBaseParams.iddeposito = _this.iddeposito;
            }
        });
        return p;
    }
});
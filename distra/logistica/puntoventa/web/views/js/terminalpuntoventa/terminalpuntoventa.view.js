Ext.ns('LOG.fac.puntoventa');
/**
 *
 * <Component> Punto de venta
 */
LOG.fac.puntoventa.pGeneral = Ext.extend(LOG.util.Panel, {
    frm: Ext.form,
    constructor: function (config) {
        this.addEvents('rowaction');
        LOG.util.UIManager.apply(this, config);
        this.listButtons = new LOG.util.List();
        this.region = 'center';
        this.title = this.idioma.titleProductos;
        this.layout = 'border';
        this.listaAcciones = config.listaAcciones;
        this.items = [this.createGridCentral(), this.createFrmVenta()];
        LOG.fac.puntoventa.pGeneral.superclass.constructor.call(this, config);
        //this.btnRealizarVenta.controlFn.createDelegate(this, [this.btnRealizarVenta, this]).call();
        this.cont=0;
        this.idmodopago = null;
        this.conceptoventa = null;
        this.valorconcepto = null;
        this.tipoconceptoventa = null;//1 porcentual, 0 no porcentual
    },
    createGridCentral: function () {
        var me = this;
        this.pnGridList = new LOG.fac.puntoventa.listProductos({
            idioma: this.idioma,
            listaAcciones: me.listaAcciones,
            _parent: me
        });
        /*this.rowaction = new Ext.ux.grid.RowActions({
            id: 'actioncolumn',
            actions: [{
                id: 'eliminar',
                tooltip: 'Eliminar productos',
                iconCls: 'vaciartemporal rojo'
            }]
        });
        this.pnGridList.addGridPlugin(this.rowaction);*/
        this.pnGridList.init();
        this.gdListProducto = this.pnGridList.view();
        LOG.util.UIManager.encadenaFn(this.pnGridList.getGridPrincipal(), 'fireEvent', function (e) {
            if (e == 'afteredit') {
                me.modelo.updateCantidad(me.stDatView);
                me.datos.conceptoventa = me.conceptoventa;
                me.datos.tipoconceptoventa = me.tipoconceptoventa;
                me.datos.valorconcepto = me.valorconcepto;
                me.modelo.updateDatosVenta(me.pnGridList.getStorePrincipal(),me.datos);
            }
        });
        LOG.util.UIManager.encadenaFn(this.pnGridList.getSmPrincipal(), 'fireEvent', function (e) {
            if (e == 'selectionchange') {
                var cambiar;
                if(me.pnGridList.getSmPrincipal().getSelections().length > 0 /*&& me.comboModopago.isValid()==true*/){
                    cambiar=false;

                    me.datos.conceptoventa = me.conceptoventa;
                    me.datos.tipoconceptoventa = me.tipoconceptoventa;
                    me.datos.valorconcepto = me.valorconcepto;

                    me.modelo.updateDatosVenta(me.pnGridList.getStorePrincipal(),me.datos);
                }else{
                    cambiar=true;
                }
                //me.btnRealizarVenta.setDisabled((me.pnGridList.getSmPrincipal().getSelections().length > 0) ? false : true);
                //me.btnRealizarVenta.setDisabled(cambiar);
            }
        });
        return this.gdListProducto;
    },
    bindDtView: function (stDatView) {
        this.stDatView = stDatView;
    },
    bindServDtView: function (stServDatView) {
        this.stServDatView = stServDatView;
    },
    getCmbNombApellido: function () {
        var me = this;
        return new LOG.util.ComboBox({
            hideTrigger: true,
            fieldLabel: me.idioma.txfCI,
            emptyText: this.idioma.lbTextNumeroIdentidad,
            //editable: false,
            autoScroll: true,
            name: 'idventacliente',
            url: 'cargarPersonas',
            hiddenName: 'idventacliente',
            valueField: 'idventacliente',
            displayField: 'numeroidentidad',
            triggerAction: 'all',
            enableQtip: true,
            regex: LOG.util.Regex.carnetypasaporte,
            regexText: this.idioma.msgCarnetIncorrecto,
            //pageSize: 10,
            minChars: 6,
            anchor: '80%',
            //maxLength: 11,
            //minLength: 6,
            mode: 'remote',
            //enableKeyEvents: true,
            //listWidth: 198,
            allowBlank: (me.datos.noobligatorio == 1),
            listeners: {
                'select': function (campo, value) {
                    campo.setValue(value.json.idventacliente);
                    me.idpersona = value.json.idventacliente;
                    me.txtfieldNombre.setValue(value.json.nombre);
                    me.txtfieldTelef.setValue(value.json.telefono);                    
                    me.txtfieldDir.setValue(value.json.direccion);                    
                    me.txtfieldCorreo.setValue(value.json.correo);
                    me.txtfieldNombre.disable();
                    me.txtfieldTelef.enable();
                    me.txtfieldDir.enable();
                    me.txtfieldCorreo.enable();
                },
                'keydown': function (t, e) {
                    //me.keyMap.disable();                                    
                    me.idpersona = null;
                    if (e.keyCode == 8) {
                        //me.keyMap.disable();  
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldCI.reset();
                        me.txtfieldNombre.disable();
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                        /*me.txtfieldNombre.reset();
                        me.txtfieldTelef.reset();
                        me.txtfieldDir.reset();
                        me.txtfieldCorreo.reset();*/
                    } else {
                        //me.keyMap.enable();
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldNombre.disable();
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                    }
                },
                'blur': function (th) {             
                    me.idpersona = null;  
                    var record = this.getStore().getById(th.value);
                    if (record) {
                        me.idpersona = record.json.idventacliente;
                        me.txtfieldCI.setValue(record.json.numeroidentidad);
                        me.txtfieldNombre.setValue(record.json.nombre);
                        me.txtfieldTelef.setValue(record.json.telefono);
                        me.txtfieldDir.setValue(record.json.direccion);
                        me.txtfieldCorreo.setValue(record.json.correo);
                        me.txtfieldTelef.enable();
                        me.txtfieldDir.enable();
                        me.txtfieldCorreo.enable();
                    } else {                         
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldNombre.enable();
                        me.txtfieldTelef.enable();
                        me.txtfieldDir.enable();
                        me.txtfieldCorreo.enable();
                    }
                    //me.txtfieldCI.fireEvent('blur', me.txtfieldCI);
                },'focus': function(th){
                    
                }/*,
                'change' : function ( field, newValue, oldValue ){
                    me.idpersona = null;      
                    var record = this.getStore().getById(newValue);
                    if (record) {
                        me.idpersona = record.json.idventacliente;
                        me.txtfieldCI.setValue(record.json.numeroidentidad);
                        me.txtfieldNombre.setValue(record.json.nombre);
                        me.txtfieldTelef.setValue(record.json.telefono);
                        me.txtfieldDir.setValue(record.json.direccion);
                        me.txtfieldCorreo.setValue(record.json.correo);
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                    } else {                         
                        me.txtfieldNombre.setValue('');
                        me.txtfieldTelef.setValue('');
                        me.txtfieldDir.setValue('');
                        me.txtfieldCorreo.setValue('');
                        me.txtfieldCI.reset();
                        me.txtfieldNombre.disable();
                        me.txtfieldTelef.disable();
                        me.txtfieldDir.disable();
                        me.txtfieldCorreo.disable();
                    }
                }*/
            }
        });
    },
    createFrmVenta: function () {
        var me = this;
        this.txtfieldCI = this.getCmbNombApellido();

        this.txtfieldNombre = new LOG.util.Prototipos.inputTexto({
            maxLength: 200,
            fieldLabel: this.idioma.nfCliente,
            emptyText: this.idioma.lbTextNombre,
            anchor: '100%',
            minChars: 8,
            allowBlank: (me.datos.noobligatorio == 1),
            regex: LOG.util.Regex.nombre,
            regexText: this.idioma.lbSoloLetras,
            disabled:true,
            //editable: false,            
            enableKeyEvents: true,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                    //me.keyMap.enable();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                },
                'keyup' : function(t) {
                    t.setValue(t.getValue().toUpperCase());
                }
            }
        });
        this.txtfieldTelef = new LOG.util.Prototipos.inputTexto({
            maxLength: 20,
            fieldLabel: this.idioma.nfTelefono,
            emptyText: this.idioma.lbTextTelefono,
            anchor: '80%',
            disabled:true,
            //allowBlank: false,
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldDir = new LOG.util.Prototipos.inputTexto({
            maxLength: 100,
            fieldLabel: this.idioma.nfDireccion,
            emptyText: this.idioma.lbTextDireccion,
            anchor: '100%',
            disabled:true, 
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });
        this.txtfieldCorreo = new LOG.util.Prototipos.inputTexto({
            //maxLength: 11,
            fieldLabel: this.idioma.nfCorreo,
            emptyText: this.idioma.lbTextCorreo,
            anchor: '80%',
            regex: LOG.util.Regex.email,
            disabled:true, 
            //editable: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });

        /*this.cmCalculator = LOG.util.UIManager.initColumnForm({columnas: 3});
        for (var i = 0; i < this.idioma.buttons.length; i++) {
            this.listButtons.add(LOG.util.UIManager.createBtn({
                height: 30,
                width: 40,
                value: this.idioma.buttons[i],
                text: '<p style="font-size: 23pt;">' + this.idioma.buttons[i] + '</p>',
                handler: function () {
                    var operacion = (me.btnCantidad.pressed) ? 'cantidad' : '';
                    me.modelo.calculator(this, operacion, me.stDatView);
                }
            }));
            me.listButtons.getItem(i).key = {
                key: this.idioma.keys[i],
                shift: false,
                alt: false,
                ctrl: false,
                scope: me.listButtons.getItem(i),
                stopEvent: true,
                fn: function () {
                    var operacion = (me.btnCantidad.pressed) ? 'cantidad' : '';
                    me.modelo.calculator(this, operacion, me.stDatView);
                }
            };
            //this.keyMap.addBinding(this.listButtons.getItem(i).key);
            this.cmCalculator.addComponent(this.listButtons.getItem(i));
        }*/
        this.clsOperacion = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.txtAObservaciones = new Ext.form.TextArea({
            fieldLabel: this.idioma.nfObservaciones,
            //anchor: '100% -3',
            enableKeyEvents: true,
            maxLength: '255',
            minLength: '2',
            width: '96%',
            height: 70,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });

        this.lblSubTotal = new Ext.form.Label({
            text: this.idioma.lblSubTotal,
            style: 'color:blue;font-weight: bolder;font-size: 14px;'
        });

        this.lblValorSubTotal = new Ext.form.Label({
            html: '<span id="idvalorsubtotal">0.00</span>',
            style: 'color:blue;font-weight: bolder;font-size: 14px;'
        });

        this.clsSubtotal = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            items:[
                {
                    columnWidth: .50,
                    items: this.lblSubTotal
                },
                {
                    columnWidth: .40,
                    items: this.lblValorSubTotal
                }
            ]
        });

        this.clsSubtotal.addComponent(this.lblSubTotal);
        this.clsSubtotal.addComponent(this.lblValorSubTotal);

        this.lblDescuento = new Ext.form.Label({
            text: this.idioma.lblDescuento,
            style: 'color:orange;font-weight: bolder;font-size: 13px;'
        });
        this.lblValorDescuento = new Ext.form.Label({
            html: '<span id="idvalordescuento">0.00</span>',
            style: 'color:orange;font-weight: bolder;font-size: 13px;'
        });
        this.clsDescuento = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            items:[
                {
                    columnWidth: .50,
                    items: this.lblDescuento
                },
                {
                    columnWidth: .50,
                    items: this.lblValorDescuento
                }
            ]
        });        
        this.lblTotal = new Ext.form.Label({
            text: this.idioma.lblTotal,//+ _this.confFactura.monedas.codigoisoalt,
            style: 'color:green;font-weight: bolder;font-size: 15px;'
        });
        this.lblValorTotal = new Ext.form.Label({
            html: '<span id="idvalortotal">0.00</span>',
            style: 'color:green;font-weight: bolder;font-size: 15px;'
        });
        this.clsTotal = LOG.util.UIManager.initColumnForm({
            columnas: 2,
            items:[
                {
                    columnWidth: .50,
                    items: this.lblTotal
                },
                {
                    columnWidth: .50,
                    items: this.lblValorTotal
                }
            ]
        });
        this.comboModopago = new LOG.util.ComboBox({
            fieldLabel: this.idioma.cgModopago,
            editable: false,
            name: 'idmodopago',
            url: 'cargarModoPago',
            hiddenName: 'idmodopago',
            valueField: 'idmodopago',
            displayField: 'modopago',
            typeAhead: true,
            triggerAction: 'all',
            height: 29,
            resizable: true,
            enableQtip: true,
            emptyText: this.idioma.cgModopago,
            listeners: {
                'select': function (campo, record) {
                    if (record.json.recargodescuento == '+' || record.json.recargodescuento == '-') {
                        me.conceptoventa = record.json.recargodescuento;
                        me.tipoconceptoventa = record.json.porcentual;
                        me.valorconcepto = record.json.valor;
                        if (me.conceptoventa == '+') {
                            me.lblDescuento.setText('Recargo:')
                        } else {
                            me.lblDescuento.setText('Descuento:')
                        }
                        let importeVenta = 0;
                        let stProductos = me.pnGridList.getStorePrincipal();
                        let descTotal = 0;
                        if(stProductos.data.length > 0){
                            stProductos.each(function (rd) {
                                if (rd.get('idindicador') != -1) {
                                    let importe = parseFloat(rd.get('precio')) * parseFloat(rd.get('cantidad')), descuento = 0;
                                    if (parseFloat(rd.get('descuento')) != 0) {
                                        descuento = (rd.get('descuento'))? (parseFloat(importe) * parseFloat(rd.get('descuento')) / 100):0;
                                        importe = parseFloat(importe) - parseFloat(descuento);
                                    }
                                    descTotal = parseFloat(descTotal) + parseFloat(descuento);
                                    importeVenta = parseFloat(importeVenta) + parseFloat(importe);
                                }
                            });

                        }
                        if (me.tipoconceptoventa == 1) {
                            descTotal = descTotal + (importeVenta*me.valorconcepto/100);
                            importeVenta = (me.conceptoventa == '+') ? importeVenta + descTotal : importeVenta - descTotal ;
                            document.getElementById('idvalordescuento').innerHTML = Ext.util.Format.number(parseFloat(descTotal).toFixed(2), '0,000.00'); //;
                            document.getElementById('idvalortotal').innerHTML = Ext.util.Format.number(parseFloat(importeVenta).toFixed(2), '0,000.00')+' '+me.datos.monedaventa; //;
                        }
                    } else {
                        me.conceptoventa = null;
                        me.tipoconceptoventa = null;
                        me.valorconcepto = null;
                    }
                    var cambia;
                   if(me.pnGridList.getSmPrincipal().getSelections().length > 0 && me.comboModopago.isValid()==true){
                       cambia = false;
                   }else {
                       cambia = true;
                   }
                   me.idmodopago = campo.getValue();
                   //me.btnRealizarVenta.setDisabled(cambia);
                }
            }
        }); 
        
        LOG.util.UIManager.encadenaFn(this.comboModopago.getStore(), 'fireEvent', function (e) {
            if (e === 'load') {
                if(me.datos.idmodopago){
                    me.comboModopago.setValue(me.datos.idmodopago);
                    me.idmodopago = me.datos.idmodopago;
                }else if (this.data.items.length === 1){
                    me.comboModopago.setValue(this.data.items[0].data.idmodopago);
                    me.idmodopago = this.data.items[0].data.idmodopago;
                }
                me.comboModopago.fireEvent('select', me.comboModopago,
                    me.comboModopago.getStore().getById(me.idmodopago),
                    me.comboModopago.getStore().indexOfId(me.idmodopago));
            }
        }, 'CMBMODOPAGO');
        LOG.util.UIManager.apply(this.comboModopago, {
            editable: false,
            anchor: '50%'
        });

        this.stTipoImpresion = new Ext.data.SimpleStore({
            fields: ['idmodeloimpresion','modeloimpresion'],
            data: [[1,'Factura comercial'],[2,'Ticket de venta']]
        });

        this.comboTipoImpresion = new LOG.util.ComboBox({
            fieldLabel: this.idioma.tlTipoModeloImp,
            name: 'idmodeloimpresion',
            store: this.stTipoImpresion,
            valueField: 'idmodeloimpresion',
            displayField: 'modeloimpresion',
            //disabled: (this.action == 'mod') ? true : false,
            //allowBlank: false,
            editable: false,
            typeAhead: false,
            listeners: {
                'select': function (campo, value) {
                   me.idmodeloimpresion = campo.getValue();
                   //me.btnRealizarVenta.setDisabled(cambia);
                },
                'afterrender': function (campo){
                    if(me.datos.idmodeloimpresion == 2){
                        campo.setRawValue('Ticket de venta');
                        campo.setValue(me.datos.idmodeloimpresion);
                        me.idmodeloimpresion = 2;
                    }else{
                        campo.setRawValue('Factura comercial');
                        campo.setValue(1);
                        me.idmodeloimpresion = 1;
                    }
                }
            }
        }); 
        
        LOG.util.UIManager.encadenaFn(this.comboTipoImpresion.getStore(), 'fireEvent', function (e) {
            if (e === 'load') {
                if(me.datos.idmodeloimpresion){
                    me.comboTipoImpresion.setValue(me.datos.idmodeloimpresion);
                    me.idmodeloimpresion = me.datos.idmodeloimpresion;
                }else if (this.data.items.length === 1){
                    me.comboTipoImpresion.setValue(this.data.items[0].data.idmodeloimpresion);
                    me.idmodeloimpresion = this.data.items[0].data.idmodeloimpresion;
                }else{
                    me.comboTipoImpresion.setValue(1);
                    me.comboTipoImpresion.setRawValue('Factura comercial');
                    me.idmodeloimpresion = 1;
                }              
            }
        }, 'CMBMODELOIMPRESION');
        LOG.util.UIManager.apply(this.comboTipoImpresion, {
            editable: false,
            anchor: '50%'
        });

        /*this.btnCorregirVenta = LOG.util.UIManager.createBtn({
            disabled:true,
            text: this.idioma.lbBtnCorregirVenta,
            tooltip: this.idioma.lbCorregirVenta,
            iconCls: 'modificar',//'cancelar',
            width: '96%',
            height: 42,
            handler: function () {
                
            }
        });*/

        this.btnCancelVenta = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnCancelarVenta,
            tooltip: this.idioma.lbCancelarVenta,
            iconCls: 'vaciartemporal rojo',//'cancelar',
            //width: '99%',
            height: 42,
            handler: function () {
                me.modelo.cancelarVenta();
                me.limpiarDatos(); 
                me.stDatView.load();          
            }
        });

        this.btnRealizarVenta = LOG.util.UIManager.createBtn({//LOG.util.Prototipos.botonAceptar({
            text: this.idioma.lbBtnRealizarVenta,
            height: 42,
            tooltip: this.idioma.lbRealizarVenta,
            //width: '99%',
            //disabled: true,
            iconCls: 'comprar verde',//'cobro',
            handler: function () {
                var importeTotal = 0
                if(me.pnGridList.getStorePrincipal().data.length > 0){
                    me.pnGridList.getStorePrincipal().each(function (rd) {
                        if (rd.get('idindicador') != -1) {
                            var importe = parseFloat(rd.get('precio')) * parseFloat(rd.get('cantidad')), descuento = 0;
                            if (parseFloat(rd.get('descuento')) != 0) {
                                descuento = (rd.get('descuento'))? (parseFloat(importe) * parseFloat(rd.get('descuento')) / 100):0;
                                importe = parseFloat(importe) - parseFloat(descuento);
                            }
                            importeTotal = parseFloat(importeTotal) + parseFloat(importe);
                        }
                    });
                }
                if (me.txtfieldCI.isValid() && me.txtfieldNombre.isValid() || me.datos.noobligatorio == 1) {
                    if(typeof DESGLOSE_VENTA !== 'undefined' && DESGLOSE_VENTA == true){
                        var  fp = new LOG.fac.puntoventa.FormasPago({
                            title : 'Registro de pagos',
                            importeTotal : importeTotal,
                            resizable :  false,
                            aceptarFn : function(p){
                                me.realizarVenta(p);
                            }
                        });
                        fp.show();
                    }else{
                       me.realizarVenta(); 
                    }
                } else {
                    mostrarMensaje(3, me.idioma.msgErrorDatosOblig);
                }
            },
            controlFn: function (b) {
                LOG.util.UIManager.encadenaFn(me.pnGridList.getGridPrincipal(), 'fireEvent', function (e) {
                    if (e == 'beforeedit') {
                        b.disable();
                    } else if (e == 'afteredit') {
                        b.enable();
                    }
                }, '++TPV++');
            }
        });
        
        this.clsButton = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        
        //this.clsButton.addComponent(this.btnCorregirVenta);
        this.clsButton.addComponent(this.btnCancelVenta);
        this.clsButton.addComponent(this.btnRealizarVenta);
        
        this.clsCMB = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        
        //this.clsButton.addComponent(this.btnCorregirVenta);
        this.clsCMB.addComponent(this.comboModopago);
        this.clsCMB.addComponent(this.comboTipoImpresion);

        //combos de datos de venta asignacion
        this.fsOtrosDatos = new Ext.form.FieldSet({
            title: this.idioma.tlFSOtrosDatos,
            items: [this.txtAObservaciones,this.clsSubtotal,this.clsDescuento,this.clsTotal,this.clsCMB,this.clsButton]
        });
        
        //combos de datos de venta asignacion
        this.fsProducto = new Ext.form.FieldSet({
            title: this.idioma.tlFSDatos,
            items: [this.txtfieldCI,this.txtfieldNombre,this.txtfieldTelef,this.txtfieldDir,this.txtfieldCorreo]
        });
        /*if (existeFact == 1) {
            this.fsProducto.add(this.nfCliente);
            this.fsProducto.add(this.txtfieldCI);
        }*/
        this.btnDelete = LOG.util.UIManager.createBtn({
            height: 29,
            width: '100%',
            text: '<p style="font-size: 23pt;">&#8592;</p>',
            tooltip: this.idioma.lbBtnEliminarProducto,
            handler: function () {
                if (me.pnGridList.getSmPrincipal().hasSelection()) {
                    me.modelo.deleteProducts(me.pnGridList.getSmPrincipal().getSelected(), me.stDatView);
                }
            },
            key: {
                key: 46,
                shift: false,
                alt: false,
                ctrl: false,
                scope: me.btnDelete,
                stopEvent: true,
                fn: function () {
                    if (me.pnGridList.getSmPrincipal().hasSelection()) {
                        me.modelo.deleteProducts(me.pnGridList.getSmPrincipal().getSelected(), me.stDatView);
                    }
                }
            }
        });
        //this.keyMap.addBinding(this.btnDelete.key);
        this.btnCantidad = LOG.util.UIManager.createBtn({
            height: 29,
            width: '100%',
            toggleGroup: 'operacion',
            text: '<p style="font-size: 23pt;">Cant.</p>',
//            tooltip: this.idioma.lbBtnCantidad,
            listeners: {
                click: function (btn) {
                    if (!btn.pressed) {
                        btn.toggle();
                    }
                },
                render: function (btn) {
                    btn.toggle();
                }
            },
            key: {
                key: "cC",
                shift: false,
                alt: true,
                ctrl: false,
                scope: me.btnCantidad,
                stopEvent: true,
                fn: function () {
                    if (!me.btnCantidad.pressed) {
                        me.btnCantidad.toggle();
                    }
                }
            }
        });
        //this.keyMap.addBinding(this.btnCantidad.key);
        this.btnVacio = LOG.util.UIManager.createBtn({
            height: 29,
            width: '100%',
            toggleGroup: 'operacion',
            text: '<p style="font-size: 23pt;"></p>'
        });

        this.btnDescuento = LOG.util.UIManager.createBtn({
            height: 29,
            width: '100%',
            toggleGroup: 'operacion',
            text: '<p style="font-size: 23pt;">Desc.</p>',
//            tooltip: this.idioma.lbBtnDescuento,
            listeners: {
                click: function (btn) {
                    if (!btn.pressed) {
                        btn.toggle();
                        me.pnGridList.getSmPrincipal().getSelected().set('descuento', '0%');
                    }
                }
            },
            key: {
                key: "dD",
                shift: false,
                alt: true,
                ctrl: false,
                scope: me.btnDescuento,
                stopEvent: true,
                fn: function () {
                    if (!me.btnDescuento.pressed) {
                        me.btnDescuento.toggle();
                    }
                }
            }
        });
        //this.keyMap.addBinding(this.btnDescuento.key);
        this.btnCambioLinea = LOG.util.UIManager.createBtn({
            height: 29,
            width: '100%',
            text: '<p style="font-size: 20pt;">&#9759;</p>',
            tooltip: this.idioma.lbBtnCambiarLinea,
            handler: function () {
                var selection = me.pnGridList.getSmPrincipal();
                if (selection.hasSelection()) {
                    if (selection.hasNext()) {
                        selection.selectNext();
                    } else {
                        selection.selectFirstRow();
                    }
                }
            },
            key: {
                key: 13,
                shift: false,
                alt: false,
                ctrl: false,
                scope: me.btnCambioLinea,
                stopEvent: true,
                fn: function () {
                    var selection = me.pnGridList.getSmPrincipal();
                    if (selection.hasSelection()) {
                        if (selection.hasNext()) {
                            selection.selectNext();
                        } else {
                            selection.selectFirstRow();
                        }
                    }
                }
            }
        });

        //this.keyMap.addBinding(this.btnCambioLinea.key);
        this.clsOperacion.addComponent(this.fsProducto);
        this.clsOperacion.addComponent(this.fsOtrosDatos);
        /*this.clsOperacion.addComponent({
            layout: 'column',
            items: [
                {
                    columnWidth: .70,
                    items: this.cmCalculator
                }, {
                    columnWidth: .30,
                    items: [
                        this.btnCantidad,
                        this.btnVacio,
                        this.btnDelete,
                        this.btnCambioLinea
                    ]
                }
            ]
        });*/
        
        this.frmGeneral = LOG.util.UIManager.initForm({
            title: this.idioma.lbDetalleVenta,
            region: 'south',
            frame: true,
            height: 320,
            border: false,
            items: [this.clsOperacion]
        });
        return this.frmGeneral;
    },
    limpiarDatos : function () {
        var me = this;
        me.txtfieldCI.reset();
        me.txtfieldNombre.setValue('');
        me.txtfieldTelef.setValue('');
        me.txtfieldDir.setValue('');
        me.txtfieldCorreo.setValue('');
        me.txtAObservaciones.setValue('');
        me.txtfieldNombre.disable();
        me.txtfieldTelef.disable();
        me.txtfieldDir.disable();
        me.txtfieldCorreo.disable();
        document.getElementById('idvalorsubtotal').innerHTML = '0.00 ';
        document.getElementById('idvalordescuento').innerHTML = '0.00 ';
        document.getElementById('idvalortotal').innerHTML = '0.00 ';
        me.idpersona = null;
    },
    realizarVenta: function (params) {
        var me = this, importeTotal = 0;
        this.productos = {};
        this.servicios = {};
        if(this.pnGridList.getStorePrincipal().data.length > 0){
            this.pnGridList.getStorePrincipal().each(function (rd) {
                if (rd.get('idindicador') != -1) {
                    var importe = parseFloat(rd.get('precio')) * parseFloat(rd.get('cantidad')), descuento = 0;
                    if (parseFloat(rd.get('descuento')) != 0) {
                        descuento = (rd.get('descuento'))? (parseFloat(importe) * parseFloat(rd.get('descuento')) / 100):0;
                        importe = parseFloat(importe) - parseFloat(descuento);
                    }
                    importeTotal = parseFloat(importeTotal) + parseFloat(importe);
                    if (rd.get('idproducto')) {
                        me.productos[rd.get('idproducto')] = {
                            idproducto: rd.get('idproducto'),
                            idindicador: rd.get('idindicador'),
                            precio: rd.get('precio'),
                            importetotal: importe,
                            descuento: descuento,
                            cantidad: rd.get('cantidad'),
                            idmoneda: me.datos.idmoneda
                        };
                    }
                    if (rd.get('idservicio')) {
                        me.servicios[rd.get('idservicio')] = {
                            idservicio: rd.get('idservicio'),
                            idindicador: rd.get('idindicador'),
                            precio: rd.get('precio'),
                            importetotal: importe,
                            descuento: descuento,
                            cantidad: rd.get('cantidad'),
                            idmoneda: me.datos.idmoneda,
                            idpersona: (typeof TPV_OPERARIOSERVICE !== 'undefined' && TPV_OPERARIOSERVICE == true) ? rd.get('idpersona') : null,
                        };
                    }
                }
            });
            var parametros = {
                productos: Ext.encode(me.productos),
                servicios: Ext.encode(me.servicios),
                importe: parseFloat(importeTotal).toFixed(2),
                //efectivo: parseFloat(me.cgPago.getValue()).toFixed(2),
                //cambio: parseFloat(me.cambio).toFixed(2),
                idcaja: me.datos.idcaja,
                diashabiles: me.datos.diashabiles,
                idseccion: me.datos.idseccion,
                idareaventa: me.datos.idareaventa,
                idtipoprecio: me.datos.idtipoprecio,
                idoperacion: me.datos.idnomoperaciones,
                iddeposito: me.datos.idestructuraop,
                idcliente: me.datos.idcliente,
                idpago: me.idmodopago,
                idmodeloimpresion: me.idmodeloimpresion,
                idcondicionpago: me.datos.idcondicionpago
            };
            LOG.util.UIManager.apply(parametros, params || {});
    
            if (me.idpersona && me.txtfieldCI.isValid() && me.txtfieldCI.isDirty()) {
                parametros.idpersona = me.idpersona;
            }else{
                parametros.numeroidentidad = me.txtfieldCI.value;
                parametros.nombre = me.txtfieldNombre.value;
                parametros.telefono = me.txtfieldTelef.value;
                parametros.direccion = me.txtfieldDir.value;
                parametros.correo = me.txtfieldCorreo.value;
            }
            parametros.observaciones = me.txtAObservaciones.value;
            if (me.tipoconceptoventa) {
                parametros.tipoconceptoventa = me.tipoconceptoventa;
                parametros.conceptoventa = me.conceptoventa;
                parametros.valorconcepto = me.valorconcepto;
            }


            me.modelo.realizarVenta(parametros, function (resp) {
                var datos = resp.datos;
                
                if (datos.nroventa) {
                    var objSubmit = {
                        idComprobante: -1,
                        id: Ext.encode([datos.idventas])
                    };

                    //mostrarMensaje(1, me.idioma.msgParte1Factura + datos.nroventa + me.idioma.msgParte2Factura);
                    datos.importeTotal = importeTotal;
                    //me.btnRealizarVenta.disable();
                    //me.btnCorregirVenta.enable();
                    me.limpiarDatos();

                    //generando comprobante automatico
                    var mensajeComprobante = "";
                    if (datos.comprobante) {
                        if (datos.comprobante.codMsg) {
                            mensajeComprobante = mensajeComprobante + "<br>No se ha podido generar el comprobante por descuadre en los importes";
                        } else {
                            objSubmit.idComprobante = datos.comprobante.idComprobante;
                            objSubmit.numComprobante = datos.comprobante.numComprobante;
                            objSubmit.fechaComprobante = datos.comprobante.fechaComprobante;
                            mensajeComprobante = mensajeComprobante + "<br>Se ha generado el comprobante numero: <b>"+datos.comprobante.numComprobante;
                        }
                    }
                    mostrarMensaje(1, me.idioma.msgParte1Factura + datos.nroventa + me.idioma.msgParte2Factura + mensajeComprobante);
                    if (objSubmit.idComprobante != -1) {
                        Ext.Ajax.request({
                            url: '/logistica/facturacion/facturacion/comun_fact/index.php/comprobantefact/postCreateComprobanteAuto',
                            method: 'POST',
                            params: objSubmit,
                            callback: function (o, s, r) {

                            }.createDelegate(me)
                        });
                    } else {
                        //Ext.MessageBox.hide();
                    }
                    //fin comprobante

                    if(me.datos.nodatosposventa != 1){
                        me.mostrarVentaPosVenta(datos);
                    }else{
                        me.stDatView.load();
                    }

                    return;
                }
                /*me.limpiarDatos();
                var report = new LOG.util.Report({
                    idioma: me.idioma,
                    reports: [
                        {
                            name: 'Recibo de venta',
                            isList: false,
                            params: {
                                iddocumento: datos.idventas ? datos.idventas : null,
                                idestructura: datos.idestructura ? datos.idestructura : null
                            },
                            dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaModelo'
                        }
                    ]
                });
                report.view();
                me.stDatView.load();*/
            },function (resp){
                var datos = resp.datos;
                let msg = "<p>No se puede realizar la venta. El(los) siguiente(s) producto(s) excede(n) el límite de compra por cliente, para un período de tiempo:</p></br>";
               
                datos.forEach(element => {
                    msg += "<p>- "+element.producto+"</p></br>";
                });
                mostrarMensaje(3, msg);
            });
        }    
    },
    mostrarVentaPosVenta: function(datosDoc){
        var me = this, importeTotal = datosDoc.importeTotal;
        var usarAplicar = false;
        if(me.idmodopago == -1){
            this.lbCambio = new Ext.form.Label({
                html: '<span id="idcambioPtoVenta">0.00</span>'
            });
            this.cgPago = new LOG.util.Prototipos.inputDecimal({
                //fieldLabel: this.idioma.cgCUC,
                name: 'pago',
                allowBlank: false,
                enableKeyEvents: true,
                height: 29,
                anchor:'100%',
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '16'},
                listeners: {
                    keyup: function (num, e) {
                        //me.cambio = me.modelo.convertirImporte(me.datos.idmoneda, num.getValue(), idAlternativa, me.datos.tasacambio, importeTotal);
                        me.cambio = parseFloat(num.getValue()) - parseFloat(importeTotal);
                        if (!isNaN(me.cambio)) {
                            document.getElementById('idcambioPtoVenta').innerHTML = parseFloat(me.cambio).toFixed(2);
                            var deshabilitar = me.cambio >= 0 ? false : true;
                            me.wRealizarVenta.getButton(2).setDisabled(deshabilitar);
                        }
                    }
                }
            });
            /*this.cgPagoDos = new LOG.util.Prototipos.inputDecimal({
                fieldLabel: this.idioma.cgCUP,
                name: 'pago',
                allowBlank: false,
                enableKeyEvents: true,
                height: 29,
                anchor:'100%',
                align: 'center',
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '16'},
                listeners: {
                    keyup: function (num, e) {
                        me.cambio = me.modelo.convertirImporte(me.datos.idmoneda, num.getValue(), idContable, me.datos.tasacambio, importeTotal);
                        //me.cambio = parseFloat(num.getValue()) - parseFloat(importeTotal);
                        if (!isNaN(me.cambio)) {
                            document.getElementById('idcambioPtoVenta').innerHTML = parseFloat(me.cambio).toFixed(2);
                            var deshabilitar = me.cambio >= 0 ? false : true;
                            me.wRealizarVenta.getButton(2).setDisabled(deshabilitar);
                        }
                    }
                }
            });*/
            //this.cmDesgloseMonedas = LOG.util.UIManager.initColumnForm({columnas: 2});
            //this.cmDesgloseMonedas.addComponent(this.cgPago);
            //this.cmDesgloseMonedas.addComponent(this.cgPagoDos);
            this.pFactura = LOG.util.UIManager.initForm({
                region: 'center',
                frame: true,
                labelAlign: 'top',
                items: [   
                    {html: '<h1 style="color:black;padding: 2px 0px 5px 0px;font-weight: bolder;font-size: 18px;text-align:center;">' + 
                            this.idioma.cgTotalapagar + '</h1><p> </p>'},
                    {html: '<h1 style="color:green;padding: 2px 0px 10px 0px;font-weight: bolder;font-size: 20px;text-align:center;">' + 
                            Ext.util.Format.number(importeTotal, '0,000.00')+' '+me.datos.monedaventa+'</h1><p> </p>'},
                    {html: '<h1 style="color:black;padding: 2px 0px 5px 0px;font-weight: bolder;font-size: 18px;text-align:center;">' + 
                            this.idioma.cgCambio + '</h1><p> </p>'},
                    {html: '<h1 style="color:green;padding: 2px 0px 10px 0px;font-weight: bolder;font-size: 20px;text-align:center;">' + 
                            this.lbCambio.html+' '+me.datos.monedaventa+'</h1><p> </p>'},
                    {html: '<h1 style="color:black;padding: 2px 0px 2px 0px;font-weight: bolder;font-size: 20px;text-align:center;">' + 
                            this.idioma.cgPago+'</h1><p> </p>'},
                    this.cgPago//,this.cgPagoDos
                ]
            });
        }else if(me.idmodopago == -2){
            usarAplicar = true;
            this.cgTitular = new LOG.util.Prototipos.inputTexto({
                emptyText: this.idioma.lbNombresyApp,
                fieldLabel: this.idioma.cgTitular,
                name: 'titular',
                allowBlank: false,
                height: 29,
                minChars: 8,
                enableKeyEvents: true,
                regex: LOG.util.Regex.nombre,
                regexText: this.idioma.lbSoloLetras,
                anchor:'100%',
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '150'},
                listeners: {
                    
                }
            });
            
            this.cgDigitos = new LOG.util.Prototipos.inputTexto({
                emptyText: this.idioma.lbDigitos,
                fieldLabel: this.idioma.cgDigitos,
                name: 'digitos',
                height: 29,
                allowBlank: false,
                enableKeyEvents: true,
                regex:LOG.util.Regex.digito,
                regexText:this.idioma.ttnanTextEntero,
                anchor:'60%',
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '4'},
                listeners: {
                    
                }
            });
            this.monedaTarjeta = new LOG.util.ComboBox({
                fieldLabel: this.idioma.cgDMoneda,
                editable: true,
                height: 29,
                name: 'idmoneda',
                url: 'cargarMonedasVentas',
                hiddenName: 'idmoneda',
                valueField: 'idmoneda',
                displayField: 'codigoiso',
                typeAhead: true,
                triggerAction: 'all',
                anchor:'60%',
                resizable: true,
                enableQtip: true,
                emptyText: this.idioma.lbSMonedas/*,
                listeners:{
                    render: function (cmp) {
                        cmp.setValue(idMlc);
                    }
                }*/
            });

            me.monedaTarjeta.on('load', function () {
                me.monedaTarjeta.setValue(idMlc);
            }, this, {single: true});

            this.pFactura = LOG.util.UIManager.initForm({
                region: 'center',
                frame: true,
                labelAlign: 'top',
                items: [
                    {html: '<h1 style="color:black;padding: 2px 0px 5px 0px;font-weight: bolder;font-size: 18px;text-align:center;">' + 
                            this.idioma.cgTotalapagar + '</h1><p> </p>'},
                    {html: '<h1 style="color:green;padding: 2px 0px 10px 0px;font-weight: bolder;font-size: 20px;text-align:center;">' + 
                            Ext.util.Format.number(importeTotal, '0,000.00')+' '+me.datos.monedaventa+'</h3><p> </p>'},
                    this.cgTitular,
                    this.cgDigitos,
                    this.monedaTarjeta
                ]
            });
        }else if(me.idmodopago == -3){
            usarAplicar = false;
            var fechaString = fechacontable.split('/');
            //console.info(fechaString);
            var moneda = '';
            var winQR = new LOG.lb.Enzona.QRView({
                aceptarFn: function (valid, operacionId, transactionId) {
                    var objSubmit = {
                      iddocumento: datosDoc.idventas,
                      transaccion: transactionId,
                      idoperacion: operacionId
                    };
                    Ext.MessageBox.wait('Actualizando datos de la venta', 'Por favor espere...');
                    Ext.Ajax.request({
                        url: 'actualizarDatosVenta',
                        method: 'POST',
                        params: objSubmit,
                        callback: function (o, s, r) {
                            Ext.MessageBox.hide();
                            var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                            if (resp.success && resp.codigoMsg == 1) {
                                mostrarMensaje(resp.codigoMsg, 'Los datos han sido guardados satisfactoriamente');
                                me.imprimirModelo(datosDoc);
                            }
                        }.createDelegate(this)
                    });
                    //mostrarMensaje(3, 'Operacion: '+operacionId+' Transaccion: '+transactionId);
                    //Con operacionId mostrar mensaje concatenando el id de la operacion
                    //Guardarlo en bd y mostrar el modelo con el id operacion
                    //guardar id de la transaccion para las devoluciones
                }/*,
                socpeFn: this.socpeFn*/
            });
            winQR.show();
            winQR.loadQrPayment(/*Monto*/importeTotal, /*Moneda*/me.datos.monedaventa,
            /*Detalles de la factura*/ me.datos.nombrecaja+', VENDEDOR '+datosDoc.vendedor+', REFERENCIA '+fechaString[2]+fechaString[1]+fechaString[0]+'-'+
            datosDoc.nroventa, 
            /*puede ser vacio*/me.datos.nombretienda,
            /*consumerKey*/ consumerkey,
            /*consumerSecret*/consumersecret, 
			/*iddocumento*/datosDoc.idventas,
			/*type*/1);
        } else if(me.idmodopago == -33){//viejo
            usarAplicar = false;
            var moneda = '';
            this.monedaTarjetaEz = new LOG.util.ComboBox({
                fieldLabel: this.idioma.cgDMoneda,
                editable: true,
                height: 29,
                name: 'idmoneda',
                url: 'cargarMonedasVentas',
                hiddenName: 'idmoneda',
                valueField: 'idmoneda',
                displayField: 'codigoiso',
                typeAhead: true,
                triggerAction: 'all',
                anchor:'60%',
                resizable: true,
                enableQtip: true,
                emptyText: this.idioma.lbSMonedas,
                listeners:{
                    select: function (campo, value) {
                        moneda = value.json.codigoiso;
                        me.montoMoneda.enable();
                    }
                }
            });
            
            this.montoMoneda = new LOG.util.Prototipos.inputDecimal({
                fieldLabel: this.idioma.cgMonto,
                disabled: true,
                name: 'montomoneda',
                allowBlank: false,
                enableKeyEvents: true,
                height: 29,
                anchor:'60%',
                align: 'center',
                autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: '16'}/*,
                listeners: {
                    keyup: function (num, e) {
                        me.cambio = me.modelo.convertirImporte(me.datos.idmoneda, num.getValue(), idAlternativa, me.datos.tasacambio, importeTotal);
                        //me.cambio = parseFloat(num.getValue()) - parseFloat(importeTotal);
                        if (!isNaN(me.cambio)) {
                            document.getElementById('idcambioPtoVenta').innerHTML = parseFloat(me.cambio).toFixed(2);
                            var deshabilitar = me.cambio >= 0 ? false : true;
                            me.wRealizarVenta.getButton(2).setDisabled(deshabilitar);
                        }
                    }
                }*/
            });

            this.btnGenerarQR = LOG.util.UIManager.createBtn({
                text: this.idioma.lbBtnGenerarQR,
                tooltip: this.idioma.lbGenerarQR,
                iconCls: 'tablasporcategoria',
                //width: '10%',
                height: 30,
                handler: function () {
                    if(me.montoMoneda.getValue() != 0 && moneda != ''){
                        /*var winEZN = new LOG.lb.Enzona.View({
                            monto: me.montoMoneda.getValue(),
                            moneda: moneda.toLowerCase(),
                            descripcion: 'Factura comercial VT-2020-000001',
                            cerrarFn:function(){
                                console.info('cerrar');
                            }
                        });
                        winEZN.show();
                        winEZN.loadQrPayment();   */
                        var winEZN = new LOG.lb.Enzona.View({
            							monto: me.montoMoneda.getValue(),
            							moneda: moneda.toLowerCase(),
            							comercio: 'tv13y84',
            							descripcion: 'Factura comercial VT-2020-000001'
            						});
            						winEZN.show();
                    }
                }
            });

            this.pFactura = LOG.util.UIManager.initForm({
                region: 'center',
                frame: true,
                labelAlign: 'top',
                items: [
                    {html: '<h1 style="color:black;padding: 2px 0px 5px 0px;font-weight: bolder;font-size: 18px;text-align:center;">' + 
                            this.idioma.cgTotalapagar + '</h1><p> </p>'},
                    {html: '<h1 style="color:green;padding: 2px 0px 10px 0px;font-weight: bolder;font-size: 20px;text-align:center;">' + 
                            Ext.util.Format.number(importeTotal, '0,000.00')+' '+me.datos.monedaventa+'</h3><p> </p>'},
                            this.monedaTarjetaEz,this.montoMoneda,this.btnGenerarQR
                ]
            });
        }else if(me.idmodopago == -4){
            me.datosDoc = datosDoc;
            me.datosPostVentaCliente = new LOG.fac.puntoventa.datosPostVentaCliente({
                idioma: me.idioma,
                title: 'Seleccionar aseguradora',
                _parent: me/*,
                btnDevolucion: this*/
            });
            me.datosPostVentaCliente.init();
            me.datosPostVentaCliente.view();
            
        }else if(me.idmodopago == -5){
            me.datosDoc = datosDoc;
            me.datosPostVentaCliente = new LOG.fac.puntoventa.datosPostVentaCliente({
                idioma: me.idioma,
                title: 'Seleccionar cliente',
                _parent: me/*,
                btnDevolucion: this*/
            });
            me.datosPostVentaCliente.init();
            me.datosPostVentaCliente.view();
            
        }else{        
            me.imprimirModelo(datosDoc);
        }     

        if(me.idmodopago != -5 || me.idmodopago != -4){
            this.wRealizarVenta = new LOG.util.Window({
                title: this.idioma.lbBtnRealizarVenta,
                width: 260,
                height: 300,
                usarAplicar: usarAplicar,
                items: this.pFactura,
                listeners: {
                    show: function () {
                        var modopago = me.comboModopago.getValue();
                        if(modopago == -1){
                            me.cgPago.focus(false,100);
                        }else if(modopago == -2){
                            me.cgTitular.focus(false,100);
                        }else if(modopago == -3){
                            me.monedaTarjetaEz.focus(false,100);
                        }
                    },
                    destroy: function () {
                        me.stDatView.load();
                        //me.txtSimpleFind.focus(false,100);
                        //me.keyMap.enable();
                    }
                }
            });
                
            LOG.util.UIManager.apply(this.wRealizarVenta.getButton(0), {
                handler: function () {
                    me.wRealizarVenta.destroy();
                }
            });
                
            LOG.util.UIManager.apply(this.wRealizarVenta.getButton(1), {
                handler: function () {            
                    if (me.cgTitular.isDirty() && me.cgTitular.isValid() &&
                            me.cgDigitos.isDirty() && me.cgDigitos.isValid() && 
                                me.monedaTarjeta.isDirty() && me.monedaTarjeta.isValid() && 
                                    !me.wRealizarVenta.getButton(2).disabled) {
                        var parametros = {
                            titular: me.cgTitular.getValue(),
                            digitos: me.cgDigitos.getValue(),
                            idmoneda: me.monedaTarjeta.getValue(),
                            idventas: datosDoc.idventas,
                            idmodopago: me.idmodopago
                        };
                        me.modelo.insertarDatosPosVenta(parametros, function (resp) {
                            var datos = resp.datos;
                            me.wRealizarVenta.getButton(1).setDisabled(true);
                            me.cgTitular.reset();
                            me.cgDigitos.reset();
                            me.monedaTarjeta.reset();
                            //if (datos.numero) {                                
                                //me.limpiarDatos();
                                //me.imprimirModelo(datosDoc);
                            //}                            
                        });
                        //me.wRealizarVenta.destroy();
                    }
                }
            });
            
            LOG.util.UIManager.apply(this.wRealizarVenta.getButton(2), {
                //disabled: true,
                handler: function () {
                    if(me.idmodopago == -1){
                        if (me.cgPago.isDirty() && me.cgPago.isValid() && !me.wRealizarVenta.getButton(2).disabled) {
                            var parametros = {
                                efectivo: parseFloat(me.cgPago.getValue()).toFixed(2),
                                cambio: parseFloat(me.cambio).toFixed(2),
                                idventas: datosDoc.idventas,
                                idmodopago: me.idmodopago
                            };
                            me.modelo.insertarDatosPosVenta(parametros, function (resp) {
                                var datos = resp.datos;   
                                me.imprimirModelo(datosDoc);             
                            });
                            me.wRealizarVenta.destroy();
                        }
                    }else if(me.idmodopago == -2){
                        if (me.cgTitular.isDirty() && me.cgTitular.isValid() &&
                                me.cgDigitos.isDirty() && me.cgDigitos.isValid() && 
                                    me.monedaTarjeta.isDirty() && me.monedaTarjeta.isValid() && 
                                        !me.wRealizarVenta.getButton(2).disabled) {
                            var parametros = {
                                titular: me.cgTitular.getValue(),
                                digitos: me.cgDigitos.getValue(),
                                idmoneda: me.monedaTarjeta.getValue(),
                                idventas: datosDoc.idventas,
                                idmodopago: me.idmodopago
                            };
                            me.modelo.insertarDatosPosVenta(parametros, function (resp) {
                                var datos = resp.datos;
                                me.imprimirModelo(datosDoc);                            
                            });
                            me.wRealizarVenta.destroy();
                        }
                    }
                    
                }
            });
            this.wRealizarVenta.show();
            this.wRealizarVenta.center();    
        }
        
    },
    imprimirModelo: function(datosDoc){
        var me = this;
        var dirReport = (farmacia != 1) ? '/distra/logistica/puntoventa/terminalpuntoventa/ReciboVentaModelo': '/distra/logistica/farmacia/terminalpuntoventa/ReciboVentaModelo';
        if(datosDoc.idmodeloimpresion == 2){
            dirReport = '/distra/logistica/puntoventa/terminalpuntoventa/TicketVentaModelo';
        }
        
        if (me.datos.opcionimprimir == 0) {//opcion de imprimir factura            
            var report = new LOG.util.Report({
                idioma: me.idioma,
                reports: [
                    {
                        name: 'Recibo de venta',
                        isList: false,
                        params: {
                            iddocumento: datosDoc.idventas ? datosDoc.idventas : null,
                            idestructura: datosDoc.idestructura ? datosDoc.idestructura : null
                        },
                        dirReport: dirReport
                    }
                ],
                listeners:{
                    close: function(p){                    
                        me.stDatView.load();
                    }
                }
            });
            report.view();
        }/*else if (me.datos.opcionimprimir == 1) {//opcion de imprimir vale de venta
            var me = this;
            var report = new LOG.util.Report({
                idioma: me.idioma,
                reports: [
                    {
                        name: 'Recibo de venta',
                        isList: false,
                        params: {
                            iddocumento: datosDoc.idventas ? datosDoc.idventas : null,
                            idestructura: datosDoc.idestructura ? datosDoc.idestructura : null
                        },
                        dirReport: '/distra/logistica/puntoventa/terminalpuntoventa/ReciboValeVentaModelo'
                    }
                ],
                listeners:{
                    close: function(p){                    
                        me.stDatView.load();
                    }
                }
            });
            report.view();
        }    */   
    }        
});
/**
 *
 * <Component> Panel con el listados de productos que se venderán...
 */
LOG.fac.puntoventa.listProductos = Ext.extend(LOG.util.UITemplate, {
    panelBotonesVisible: false,
    constructor: function (config) {
        this.modoSeleccion = 1;
        this.foreceFitView = false;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa';
        this.formaVisualizacion = 'panel';
        this.bbarVisible = false;
        this.autoLoad = false;
        this.gridEditable = true;
        LOG.fac.puntoventa.listProductos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        let _this = this;
        this.addGridColumn({
            default: false
        });
        this.addGridColumn({
          header: ' ',
          id: 'actioncolumn',
            width: 35,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                if (record.data.text == 'Total servicios:' || record.data.text == 'Total productos:') {
                    metaData.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                } else {
                    return '<button class="icondistra-eliminar rojo" style="background: transparent;border:none"></button>'
                }
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCodigoDenom,
            //autoExpand: true,
            dataIndex: 'text',
            default: true,
            width: 250,
            renderer: function (v, md, rd) {
                if (rd.data.text == 'Total servicios:' || rd.data.text == 'Total productos:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                return v;
            }
        });
        /*this.addGridColumn({
            header: this.idioma.cgDesc,
            dataIndex: 'descuento',
            default: true,
            width: 60,
            align: 'right',
            editor: LOG.util.Prototipos.inputDecimal({
                decimalPrecision: 2
            }),
            renderer: function (v, m, rd) {
                var descuento = parseFloat(v);
                if (descuento <= 100) {
                    return descuento.toFixed(2) + '%';
                }
                return parseFloat(0).toFixed(2) + '%';
            }
        });*/
        this.addGridColumn({
            header: this.idioma.cgCantidad,
            dataIndex: 'cantidad',
            align: 'right',
            default: true,
            width: 70,
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function (v, md, rd) {
                if (rd.data.text == 'Total servicios:' || rd.data.text == 'Total productos:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                } else {
                    if (!rd.data.cantidad) {
                        rd.data.cantidad = 0;
                    }
                    return rd.data.cantidad;
                }
                //return Ext.util.Format.number(rd.data.cantidad, '0,000.00');
            }
        });
        this.addGridColumn({
            header: this.idioma.cgPrecio,
            dataIndex: 'precio',
            align: 'right',
            default: true,
            width: 65,
            editor: LOG.util.Prototipos.inputDecimal({}),
            renderer: function (v, md, rd) {
                if (rd.data.text == 'Total servicios:' || rd.data.text == 'Total productos:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                }
                var precio = parseFloat(v).toFixed(2);
                return Ext.util.Format.number(precio, '0,000.00'); //
                //return parseFloat(v).toFixed(2);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgImporte,
            dataIndex: 'importetotal',
            align: 'right',
            width: 70,
            default: true,
            renderer: function (v, md, rd) {
                if (rd.data.text == 'Total servicios:' || rd.data.text == 'Total productos:') {
                    md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                    return Ext.util.Format.number(v.toFixed(2), '0,000.00'); //;
                } else {
                    var cantidad = rd.data.cantidad ? rd.data.cantidad : 1;
                    var importeTotal = parseFloat(cantidad) * parseFloat(rd.get('precio'));
                    var desc = parseFloat(rd.get('descuento'));
                    if (desc > 0 && desc <= 100) {
                        var descuento = parseFloat(importeTotal) * desc / 100;
                        importeTotal = parseFloat(importeTotal) - descuento;
                    }
                    return Ext.util.Format.number(importeTotal.toFixed(2), '0,000.00'); //;
                }
            }
        });
        if (typeof TPV_OPERARIOSERVICE !== 'undefined' && TPV_OPERARIOSERVICE == true) {
            this.editorOperario = new LOG.util.ComboBox({
                url: 'cargarPersonasArea',
                valueField: 'nombrepersona',
                displayField: 'nombrepersona',
                mode: 'remote',
                validarEnFormBasico: false,
                queryParam: 'criterio',
                resizable: true,
                listeners: {
                    'focus': function (cb) {

                    }
                },
                queryParam: 'criterio',
                minChars: 1,
                pageSize: 15,
                resizable: true
            });

            this.editorOperario.store.on('beforeload', function (st) {
                st.baseParams.idarea = _this._parent.datos.idareaventa;
                st.initBaseParams.idarea = _this._parent.datos.idareaventa;

                st.baseParams.idservicio = _this.getSmPrincipal().getSelected().data.idservicio;
                st.initBaseParams.idservicio = _this.getSmPrincipal().getSelected().data.idservicio;
            });

            this.editorOperario.addListener('select', function(cmb, rd, row) {
                _this.getSmPrincipal().getSelected().data.idpersona = rd.json.idpersona;
            });

            this.addGridColumn({
                header: 'Operario',
                dataIndex: 'nombrepersona',
                width: 200,
                default: true,
                editor: _this.editorOperario,
                renderer: function (v, md, rd) {
                    if (rd.data.text == 'Total servicios:' || rd.data.text == 'Total productos:') {
                        md.attr = 'style="background-color: rgba(186, 186, 186, 0.6);font-weight:bold;"';
                    }
                    return (v != null && v != 'null') ? v : '';
                }
            });
            this.addGridColumn({dataIndex: 'idpersona'});
        }
        this.addGridColumn({dataIndex: 'idproducto'});
        this.addGridColumn({dataIndex: 'idestructura'});
        this.addGridColumn({dataIndex: 'idindicador'});
        this.addGridColumn({dataIndex: 'decimales'});
    },
    render: function (config) {
        var _this = this;
        config = config || {
            border: true,
            title: this.idioma.tlGridProductos
        };
        var p = LOG.fac.puntoventa.listProductos.superclass.render.call(this, config), me = this;
        this.getGridPrincipal().getTopToolbar().setVisible(false);
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function (e, obj) {
            if (e == 'beforeedit') {
                if (obj.field == 'precio') {
                    if (!_this.grantedAction('RPRECIO')) {
                        obj.cancel = true;
                    }
                }
                if (obj.field == 'cantidad') {
                    if (obj.record.data.decimales == 0) {
                        obj.grid.getColumnModel().setEditor(obj.column, LOG.util.Prototipos.inputEntero({
                            maxLength: 10
                        }));
                    } else {
                        obj.grid.getColumnModel().setEditor(obj.column, LOG.util.Prototipos.inputDecimal({
                            decimalPrecision: 6,
                            regexText: me.idioma.ttregexTextCantidad,
                            maxLengthText: me.idioma.ttregexTextCantidad,
                            regex: LOG.util.Regex.cantidad,
                            maxLength: 10
                        }));
                    }
                }
                if (obj.field == 'nombrepersona') {
                    if (isNaN(parseFloat(obj.record.data.idservicio))) {
                        obj.cancel = true;
                    } else {
                        obj.grid.getColumnModel().getCellEditor(obj.column, obj.row).field.getStore().removeAll();
                        obj.grid.getColumnModel().getCellEditor(obj.column, obj.row).field.getStore().load();
                    }
                }
            } else if (e == 'afteredit') {
                if (obj.field == 'cantidad' && isNaN(parseFloat(obj.record.data.idservicio))) {
                    if (obj.value > obj.record.data.disponible) {
                        mostrarMensaje(1, me.idioma.msgFailRegistarCantidad);
                        obj.record.set(obj.field, 1);
                        obj.record.commit();
                    }
                }
            } 
        }, 'TPV++');
        this.getGridPrincipal().on('cellclick', function(grid, rowIndex, columnIndex, e ){
          if (columnIndex == 1) {
              if (me.getSmPrincipal().getSelected().data.idproducto) {
                  me._parent.modelo.deleteProducts(me.getSmPrincipal().getSelected(), me._parent.stDatView);
              } else {
                  me._parent.modelo.deleteServicios(me.getSmPrincipal().getSelected(), me._parent.stServDatView);
              }
          }
        });
        return p;
    }
});
/**
 *
 * <Component> DataView con el listados de productos a vender...
 */
LOG.fac.puntoventa.Centro = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        LOG.util.UIManager.apply(this, config);
        //this.createTbarPanel();
        this.items = this.createDataview()
        this.tipo = config.tipo;
        this.idPdView = config.idPdView;
        LOG.fac.puntoventa.Centro.superclass.constructor.call(this, config);
    },
    createDataview: function () {
        var me = this;
        this.stDtView = new Ext.data.Store({
            url: me.tipo == 1 ? 'cargarProductos' : 'cargarServicios',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos',
                //idProperty:'idproducto'
            }, [
                {name: 'idproducto'},
                {name: 'idservicio'},
                {name: 'idestructura'},
                {name: 'idindicador'},
                {name: 'idcategoria'},
                {name: 'disponible', type: 'float'},
                {name: 'precio', type: 'float'},
                {name: 'precioventa', type: 'float'},
                {name: 'importetotal'},
                {name: 'codigo'},
                {name: 'codigoproveedor'},
                {name: 'descripcionventa'},
                {name: 'decimales'},
                {name: 'text'},
                {name: 'imagen'},
                {name: 'monedaventa'},
                {name: 'idpersona'},
                {name: 'nombrepersona'},
                {name: 'numerolote'},

            ]),
            listeners: {
                beforeload: function (st) {
                    st.baseParams.idestructura = me.datos.idestructuraop;
                    st.baseParams.idareaventa = me.datos.idareaventa;
                    st.baseParams.idmonedaventa = me.datos.idmoneda;
                    st.baseParams.limit = 30;//me.pDataView.getBottomToolbar().cbPageSize.getValue();
                    if (me._parent.txtSimpleFind.getValue()) {
                        st.initBaseParams.criterio = me._parent.txtSimpleFind.getValue();
                    } else {
                        st.initBaseParams.criterio = null;
                    }
                    if (typeof Ext.getCmp(me.idPdView).el !== 'undefined') {
                        var myMask = new Ext.LoadMask(Ext.getCmp(me.idPdView).el, {useMsg: false});
                        myMask.show();
                    }

                },
                load: function (st, record, obj) {
                    if (typeof Ext.getCmp(me.idPdView).el !== 'undefined') {
                        var myMask = new Ext.LoadMask(Ext.getCmp(me.idPdView).el, {useMsg: false});
                        myMask.hide();
                    }
                    me.monedaventa = record[0]['data']['monedaventa'];                    
                    //document.getElementById('idmonedaventa').innerHTML = me.monedaventa;

                    if (this.getCount() == 0 && !this.filtrado) {
                        mostrarMensaje(1, me.idioma.msgNoMostrarResultados);
                        return;
                    }

                    if(this.getCount()<=10){
                        btnSigt.hide();
                    }
                    this.each(function (r) {
                        if (r.data.imagen == null || !r.data.imagen) {
                            r.data.imagen = 'data:image/jpeg;base64,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';
                        }
                        r.data.text = r.data.text.substring(0, 30);
                        r.commit();
                        /*if(r.data.codigoproveedor == null){
                            r.data.codigoproveedor = r.data.codigo;
                        }
                        r.data.text = r.data.codigoproveedor+' - '+r.data.descripcionventa;*/
                    });
                    //me._parent.txtSimpleFind.setValue('');
                    me._parent.txtSimpleFind.focus(false,100);
                }
            }
        });      
        var init = '<tpl for="."><div class="images-view thumb-wrap" id="idproducto:{idproducto},'
            + 'idindicador:{idindicador},disponible:{disponible},precio:{precioventa},text:{text},'
            + 'decimales:{decimales},idservicio:{idservicio},idpersona:{idpersona},nombrepersona:{nombrepersona}"><dd ext:idnodo="{idnomenclador}"><img src="{imagen}">';
            //+ '<div>';
        var disponible = '<p>' + this.idioma.lbDisponibleProducto + ': {disponible} </p>';
        //var precioCUC = '<p>' + this.idioma.cgPrecio + ': ${precioCUC} ' + codAlternativa+ ' </p>';
        //var precioCUP = '<p>' + this.idioma.cgPrecio + ': $ {precio} ' + codContable+ '  </p>';
        var precioUSD = '<p>' + this.idioma.cgPrecio + ': $ {precioventa} {monedaventa} </p>';
        var numeroLote = '<tpl if="numerolote"><p>Lote: {numerolote}</p></tpl>';
        var descripventa = '<p>Referencia:</p> <p>{text}</p>';
        var end = '</dd></div></tpl>';
        if (this.tipo == 1)
            this.tpl = new Ext.XTemplate(init, descripventa, disponible, precioUSD, numeroLote, end);
        else
            this.tpl = new Ext.XTemplate(init, descripventa, precioUSD,  end);
        this.dataview = new Ext.DataView({
            store: this.stDtView,
            tpl: this.tpl,
            autoHeight: true,
            frame: true,
           /* style: {
                marginLeft: '65px'
            },*/
            region:"center",
            singleSelect: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            listeners: {
                selectionchange: function (dtv, sel) {
                    if (sel.length > 0) {
                        if (me.tipo == 1)
                            me.modelo.addProducts({selections: sel[0].id, stDtView: dtv.getStore()});
                        else
                            me.modelo.addServicios({selections: sel[0].id, stDtView: dtv.getStore()});
                    }
                }
            }
        });
        var bbarP= new Ext.PagingToolbar({
                pageSize:11,
                hideRefresh: true,
                refresh:false,
                hidden:true,
                store: this.stDtView,
                displayInfo: true,
                listeners: {
                    afterrender: function() {
                        this.cbPageSize.hide();
                        this.refresh.hide();
                       // var Total=this.stDtView.getTotalCount();


                    }
                }
            });
        var activaspag=1;
        var activaspagcont=1;
        var btnTpl = new Ext.Template(
            '<table id="{4}" cellspacing="0" class="x-btn {3}"><tbody class="{1}">',
            '<tr><td class=""><i>&#160;</i></td><td class=""></td><td class=""><i>&#160;</i></td></tr>',
            '<tr><td class=""><i>&#160;</i></td><td class=""><em class="{2}" unselectable="on"><button type="{0}"></button></em></td><td class=""><i>&#160;</i></td></tr>',
            '<tr><td class=""><i>&#160;</i></td><td class=""></td><td class=""><i>&#160;</i></td></tr>',
            '</tbody></table>');
        var btnSigt = new Ext.Button({
            height:70,
            iconCls:'icon-siguiente',
            template :btnTpl,
            handler:function(){
               var activaspagina=me.pDataView.getBottomToolbar().getPageData().activePage+activaspag;
               var pagesTotal=me.pDataView.getBottomToolbar().getPageData().pages;

                //activaspagcont++;
                if(activaspagina>1){
                    btnAtras.show();
                }
                if(activaspagina==pagesTotal){
                    btnSigt.hide();
                }
                me.pDataView.getBottomToolbar().moveNext()
            }
        });

        var btnAtras =  new Ext.Button({
            height:70,
            hidden:true,
            iconCls:'icon-atras',
            template :btnTpl,
            handler:function(){
                var activaspa=1;
                activaspa=me.pDataView.getBottomToolbar().getPageData().activePage-activaspa;
                var activas=1;
                if(activaspa==1){
                    btnAtras.hide();
                }
                if(activas==1){
                    activaspagcont--;
                    btnSigt.show();
                }
                me.pDataView.getBottomToolbar().movePrevious()
            }
        });
        this.pDataView = new LOG.util.Panel({
            region: 'center',
            cls: 'images-view',
            autoScroll: true,
            id: me.idPdView,
            bbar: bbarP,
            maskDisabled:true,
                layout:"border",
            items: [{
                region:"west",
                width:"60px",
                layout:"fit",
                border:false,
                items:btnAtras
            },this.dataview,{
                region:"east",
                width:"60px",
                layout:"fit",
                border:false,
                items:btnSigt
            }]
        });
        return this.pDataView;
    },
    view: function () {
        return this;
    }
});

LOG.fac.puntoventa.winIngresarExtraerEfectivo = Ext.extend(LOG.util.Window, {
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 260;
        this.height = 250;
        this.resizable = false;
        this.usarAplicar = false;
        //this.idComponent = 'wAddConex';
        this.modelo = new LOG.fac.puntoventa.Model({
            idioma: this.idioma/*,
            urlController: '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa'*/
        });
        LOG.fac.puntoventa.winIngresarExtraerEfectivo.superclass.constructor.call(this, config);
        this.ventanaAdicionar();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var params = me.getParams(true);
                if(me.txtCantidad.isValid() && me.txtCantidad.getValue() > 0 && me.txtDescripcion.isValid()){
                    me.modelo.registrarEfectivo(params, function () {
                        me.close();
                    });
                }else{
                    mostrarMensaje(3, me.idioma.msgcamposVac);
                }
            }
        });
    },
    ventanaAdicionar: function () {
        var me = this;
        
        this.txtCantidad = new LOG.util.Prototipos.inputDecimal({
            //maxLength: 11,
            fieldLabel: this.idioma.lbCAnt,
            anchor: '100%',
            editable: false,
            allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    //field.setValue(selected.data.url);
                }
            }
        });
        
        this.txtDescripcion = new Ext.form.TextArea({
            fieldLabel: this.idioma.tDescripcion,
            //anchor: '100% -3',
            enableKeyEvents: true,
            maxLength: '255',
            minLength: '2',
            width: '100%',
            height: 65,
            allowBlank: false,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'change' : function ( field, newValue, oldValue ){
                    this.originalValue = this.getValue();
                    this.value = newValue;
                }
            }
        });

        this.clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 1,

        });
        
        this.clsSuperior.addComponent(this.txtCantidad);
        this.clsSuperior.addComponent(this.txtDescripcion);
        this.fsDatosCaja = new Ext.form.FieldSet({
            items: [this.clsSuperior]
        });
        this.pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [this.fsDatosCaja]
        });
        this.add(this.pMain);        
        //me.txtCantidad.focus(false,100);
    },
    getParams: function (test) {
        var params = {};
        var me = this;            
        params.idsesion = me._parent.datos.idseccion;
        params.cantidad = (me.signo == '-')?me.txtCantidad.getValue() * -1:me.txtCantidad.getValue();
        params.descripcion = me.txtDescripcion.getValue();
        params.signo = me.signo;
        return params;
    }
});

LOG.fac.puntoventa.datosPostVentaCliente = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'ventana',
    modoSeleccion: 1,
    autoLoad: false,
    busquedaBasica: true,
    dirController: '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa',
    urlBusquedaGridPrincipal: 'cargarProveedores',
    constructor: function(config) {
        this.concepto = config.idioma.ttBtnBuscarVenta;
        this.textBusquedaSimple = config.idioma.lbTxtIntroducir;
        LOG.fac.puntoventa.datosPostVentaCliente.superclass.constructor.call(this, config);
        this.getVistaPrincipal().width = 480;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().resizable = false;
        this.getVistaPrincipal().title = config.title;//'Seleccionar cliente';//this.idioma.lbBtnRealizarVenta;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
    },
    initDefaultColumns: function() {
        this.addGridColumn({
            header: this.idioma.tfCodigo,
            width: 80,
            dataIndex: 'codigo',
            default: true
        });

        this.addGridColumn({
            header: this.idioma.tfNombre,
            //width: 250,
            dataIndex: 'nombre',
            default: true,
            autoExpand: true
            //hidden: true,
            //agrupador: true
        });

        this.addGridColumn({dataIndex: 'idclientesproveedores'});
    },
    initDefaultButtons: function () {
        var me = this;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        LOG.util.UIManager.apply(this.getVistaPrincipal().listaBotones.getItem(2), {
           // disabled: true,
            handler: function () {
                if (me.getSmPrincipal().getSelected()) {
                    var parametros = {
                        idcliente: me.getSmPrincipal().getSelected().data.idclientesproveedores,
                        idventas: me._parent.datosDoc.idventas,
                        idmodopago: me._parent.idmodopago
                    };
                    me._parent.modelo.insertarDatosPosVenta(parametros, function (resp) {
                        var datos = resp.datos;
                        me._parent.imprimirModelo(me._parent.datosDoc);                            
                    });               
                    me.vistaPrincipal.destroy();                    
                }
            }
        });
    },
    view: function() {
        var me = this;
        //this.getPanelGrid().disable();
        this.btnBuscar = LOG.util.Prototipos.botonBuscar({
            tooltip: this.idioma.ttBtnBuscarDView + ' <b>(Alt+B)</b>',
            handler: function () {
                if(Ext.isEmpty(me.gridFilter.tfBusqueda.getValue())) {
                  if(me.desde.getValue() != '' || me.hasta.getValue() != ''){
                      me.getStorePrincipal().load(/*{
                          params: {
                              desde: me.desde.getValue(),
                              hasta: me.hasta.getValue()
                          },
                          callback: function() {*/
                              /*if (record.length == 0) {
                                  mostrarMensaje(1, me.idioma.msgNoResultados);
                                  return;
                              }*/
                          /*}
                      }*/);
                  }   
                } else {
                  me.gridFilter.onTriggerSearch();
                }
                
            }
        });
        this.btnBuscar.key.fn = function () {
            if(me.desde.getValue() != '' || me.hasta.getValue() != ''){
                me.getStorePrincipal().load(/*{
                    params: {
                        desde: me.desde.getValue(),
                        hasta: me.hasta.getValue()
                    },
                    callback: function() {*/
                        /*if (record.length == 0) {
                            mostrarMensaje(1, me.idioma.msgNoResultados);
                            return;
                        }*/
                    /*}
                }*/);
            }
        };
        this.btnBuscar.setText(LOG.util.UIManager.ireplaceStyle(this.btnBuscar.getText(), this.btnBuscar.key.key, 'span', 'text-decoration: underline;'));

        this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({            
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
            handler: function () {
                me.desde.reset();
                me.hasta.reset();
                me.gridFilter.onTriggerClear();
                me.getStorePrincipal().load(/*{
                    params: {
                        desde: me.desde.getValue(),
                        hasta: me.hasta.getValue()
                    },
                    callback: function() {
                        
                    }
                }*/);
            }
        });
        this.btnLimpiar.key.fn = function () {
            me.desde.reset();
            me.hasta.reset();
            me.getStorePrincipal().load(/*{
                params: {
                    desde: me.desde.getValue(),
                    hasta: me.hasta.getValue()
                },
                callback: function() {
                    
                }
            }*/);
        };
        this.btnLimpiar.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiar.getText(), this.btnLimpiar.key.key, 'span', 'text-decoration: underline;'));
 
        /*this.desde = new Ext.form.DateField({
            fieldLabel: me.idioma.fDesde,
            name: 'desde',
            vtype: 'daterange',
            //setMaxValue: fechaSistPV,
            id: 'fechainicio',
            endDateField: 'fechafin'
        });*/
        /*this.hasta = new Ext.form.DateField({
            fieldLabel: me.idioma.fHasta,
            name: 'hasta',
            vtype: 'daterange',
            //setMaxValue: fechaSistPV,
            id: 'fechafin',
            startDateField: 'fechainicio'            
        });*/
        /*if(this._parent.grantedAction('RangoFecha') || this._parent.grantedAction('CT')){
            this.getPanelSuperior().add(LOG.util.UIManager.initPanel({
                tbar: ['-', '->', '-', 'Desde: ', this.desde,'-','Hasta: ',this.hasta,'-',this.btnBuscar,'-',this.btnLimpiar]
            }));
            LOG.util.UIManager.apply(this.getPanelSuperior(), {
                width: '50%'
            });
        }*/
        return LOG.fac.puntoventa.datosPostVentaCliente.superclass.view.call(this);
    },
    render: function() {
        var p = LOG.fac.puntoventa.datosPostVentaCliente.superclass.render.call(this), me = this;
        LOG.util.UIManager.encadenaFn(this.gridFilter.btnLimpiar, 'handler', function () {
            me.desde.reset();
            me.hasta.reset();
        });
        this.getStorePrincipal().load({
            /*params: {
                idestructura: me.idestructura,
                deldia: me.deldia || null,
                desde: me.desde.getValue() || null,
                hasta: me.hasta.getValue() || null
            }*/
        });
        /*LOG.util.UIManager.encadenaFn(this.getStorePrincipal(), 'fireEvent', function(e) {
            if (e == 'beforeload') {
                this.initBaseParams.idestructura = me.idestructura;
                this.baseParams.idestructura = me.idestructura;
                this.initBaseParams.deldia = me.deldia;
                this.baseParams.deldia = me.deldia;
                this.initBaseParams.desde = me.desde.getValue() || null;
                this.baseParams.desde = me.desde.getValue() || null;
                this.initBaseParams.hasta = me.hasta.getValue() || null;
                this.baseParams.hasta = me.hasta.getValue() || null;
                if (existeInv === 0) {
                    this.initBaseParams.prodareas = 1;
                    this.baseParams.prodareas = 1;
                }
            } else if (e === 'load') {
                if (this.data.length > 0) {
                    me.getVistaPrincipal().listaBotones.getItem(1).enable();
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(1).disable();
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        }, 'REGVENTAS1');*/
        /*LOG.util.UIManager.encadenaFn(this.getSmPrincipal(), 'fireEvent', function(e) {
            if (e == 'selectionchange') {
                if (this.hasSelection()) {
                    me.getVistaPrincipal().listaBotones.getItem(1).enable();
                    me.getVistaPrincipal().listaBotones.getItem(2).enable();
                } else {
                    me.getVistaPrincipal().listaBotones.getItem(1).disable();
                    me.getVistaPrincipal().listaBotones.getItem(2).disable();
                }
            }
        }, 'REGVENTAS2');
        LOG.util.UIManager.encadenaFn(this.getVistaPrincipal(), 'fireEvent', function(e) {
            if (e === 'beforeclose') {
                me._parent.getStorePrincipal().reload();
                me.btnDevolucion.enable();
            }
        }, 'REGVENTAS3');
        LOG.util.UIManager.encadenaFn(this.getGridPrincipal(), 'fireEvent', function(e) {
            if (e === 'celldblclick') {
                me.getVistaPrincipal().listaBotones.getItem(1).handler();
            }
        }, 'REGVENTAS4');*/
        return p;
    }
});

/**
 *
 * <Component> Vista general del punto de venta...
 */
LOG.fac.puntoventa.View = Ext.extend(LOG.util.Viewport, {
    constructor: function (config) {
        Ext.apply(this, config);
        //this.btnRealizarVenta.controlFn.createDelegate(this, [this.btnRealizarVenta, this]).call();
        //this.keyMap = new Ext.KeyMap(Ext.getDoc());
        this.layout = 'border';
        this.modelo = new LOG.fac.puntoventa.Model({
            idioma: this.idioma
        });
        this.pVenta = new LOG.fac.puntoventa.pGeneral({
            idioma: this.idioma,
            //keyMap: this.keyMap,
            datos: config.datos,
            listaAcciones: new LOG.util.List(config.acciones),
            modelo: this.modelo
        });
        this.tabProductosServicios = new LOG.util.UITabTemplate({
            idioma: this.idioma,
            region: 'center',
            formaVisualizacion: 'panel',
        });
        this.productos = new LOG.fac.puntoventa.Centro({
            idioma: this.idioma,
            title: 'Productos',
            cgImporte: this.pVenta.cgImporte,
            _parent: this,
            datos: config.datos,
            modelo: this.modelo,
            tipo: 1,
            //keyMap: this.keyMap,
            region: 'center',
            width: '60%',
            idPdView: 'pdView',
            layout: 'border'/*.
            title: this.idioma.ttListaProductos*/
        });
        this.servicios = new LOG.fac.puntoventa.Centro({
            idioma: this.idioma,
            title: 'Servicios',
            cgImporte: this.pVenta.cgImporte,
            _parent: this,
            datos: config.datos,
            modelo: this.modelo,
            tipo: 2,
            //keyMap: this.keyMap,
            region: 'center',
            width: '60%',
            idPdView: 'pdViewServ',
            layout: 'border'/*.
            title: this.idioma.ttListaProductos*/
        });
        this.tabProductosServicios.addTabToTemplete(this.productos);
        this.tabProductosServicios.addTabToTemplete(this.servicios);

        this.tabProductosServicios.init();

        this.pVenta.bindDtView(this.productos.stDtView);
        this.pVenta.bindServDtView(this.servicios.stDtView);
        var me = this;

        this.comboNaturaleza = new LOG.util.ComboBox({
            disable:true,
            editable: true,
            name: 'id',
            url: 'cargarNaturalezas',
            hiddenName: 'id',
            valueField: 'id',
            displayField: 'denominacion',
            typeAhead: true,
            triggerAction: 'all',
            resizable: true,
            enableQtip: true,
            emptyText: this.idioma.cgNaturaleza,
            listeners: {
                'select': function (campo, value) {
                    me.productos.stDtView.filtrado = true;
                    me.productos.stDtView.initBaseParams.idnaturaleza = (value.json.idpadre == 0)?'':value.json.id;
                    me.productos.stDtView.initBaseParams.idnaturalezapadre = (value.json.idpadre == 0)?value.json.id:'';

                    me.productos.stDtView.baseParams.idnaturaleza = (value.json.idpadre == 0)?'':value.json.id;
                    me.productos.stDtView.baseParams.idnaturalezapadre = (value.json.idpadre == 0)?value.json.id:'';

                    me.productos.stDtView.reload({
                        params: {
                            idnaturaleza: (value.json.idpadre == 0)?'':value.json.id,
                            idnaturalezapadre: (value.json.idpadre == 0)?value.json.id:''
                        },
                        callback: function (record) {
                            if (record.length == 0) {
                                mostrarMensaje(1, me.idioma.msgNoResultados);
                                delete me.productos.stDtView.filtrado;
                                //me.comboNaturaleza.reset();
                                return;
                            }
                            var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                            Ext.each(record, function (rd) {
                                st.each(function (item) {
                                    if (rd.data.idproducto == item.data.idproducto) {
                                        rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                        rd.commit();
                                    }
                                });
                            });
                            //me.comboNaturaleza.reset();
                        }
                    });
                    //Servicios
                    me.servicios.stDtView.filtrado = true;
                    me.servicios.stDtView.initBaseParams.idnaturaleza = (value.json.idpadre == 0)?'':value.json.id;
                    me.servicios.stDtView.initBaseParams.idnaturalezapadre = (value.json.idpadre == 0)?value.json.id:'';

                    me.servicios.stDtView.baseParams.idnaturaleza = (value.json.idpadre == 0)?'':value.json.id;
                    me.servicios.stDtView.baseParams.idnaturalezapadre = (value.json.idpadre == 0)?value.json.id:'';

                    me.servicios.stDtView.reload({
                        params: {
                            idnaturaleza: (value.json.idpadre == 0)?'':value.json.id,
                            idnaturalezapadre: (value.json.idpadre == 0)?value.json.id:''
                        },
                        callback: function (record) {
                            if (record.length == 0) {
                                mostrarMensaje(1, me.idioma.msgNoResultados);
                                delete me.servicios.stDtView.filtrado;
                                //me.comboNaturaleza.reset();
                                return;
                            }
                            var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                            Ext.each(record, function (rd) {
                                st.each(function (item) {
                                    if (rd.data.idindicador == item.data.idindicador) {
                                        rd.commit();
                                    }
                                });
                            });
                            //me.comboNaturaleza.reset();
                        }
                    });
                },
                'keydown': function (txt, e) {
                    var value = this.getStore().getById(txt.getStore().data.keys[0]);
                   if (e.getKey() === 13) {
                        me.productos.stDtView.filtrado = true;
                        me.productos.stDtView.reload({
                            params: {
                                idnaturaleza: (value.json.idpadre == 0)?'':value.json.id,
                                idnaturalezapadre: (value.json.idpadre == 0)?value.json.id:''

                            },
                            callback: function (record) {
                                if (record.length == 0) {
                                    mostrarMensaje(1, me.idioma.msgNoResultados);
                                    delete me.productos.stDtView.filtrado;
                                    //me.comboNaturaleza.reset();
                                    return;
                                }
                                var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                                Ext.each(record, function (rd) {
                                    st.each(function (item) {
                                        if (rd.data.idproducto == item.data.idproducto) {
                                            rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                            rd.commit();
                                        }
                                    });
                                });
                                //me.comboNaturaleza.reset();
                            }
                        });
                        //Servicios
                       me.servicios.stDtView.filtrado = true;
                       me.servicios.stDtView.reload({
                           params: {
                               idnaturaleza: (value.json.idpadre == 0)?'':value.json.id,
                               idnaturalezapadre: (value.json.idpadre == 0)?value.json.id:''

                           },
                           callback: function (record) {
                               if (record.length == 0) {
                                   mostrarMensaje(1, me.idioma.msgNoResultados);
                                   delete me.servicios.stDtView.filtrado;
                                   //me.comboNaturaleza.reset();
                                   return;
                               }
                               var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                               Ext.each(record, function (rd) {
                                   st.each(function (item) {
                                       if (rd.data.idindicador == item.data.idindicador) {
                                           rd.commit();
                                       }
                                   });
                               });
                               //me.comboNaturaleza.reset();
                           }
                       });
                    }
                }
            }
        }); 

        LOG.util.UIManager.encadenaFn(this.comboNaturaleza.getStore(), 'fireEvent', function (e) {
            /*if (e === 'load') {
                if(me.datos.idnaturaleza){
                    me.comboNaturaleza.setValue(me.datos.idnaturaleza);
                    me.idnaturaleza = me.datos.idnaturaleza;
                }else if (this.data.items.length === 1){
                    me.comboNaturaleza.setValue(this.data.items[0].data.idnaturaleza);
                    me.idnaturaleza = this.data.items[0].data.idnaturaleza;
                }                
            }*/
            if(e === 'beforeload'){
                this.initBaseParams.idareaventa = me.datos.idareaventa;
                this.baseParams.idareaventa = me.datos.idareaventa;
            }
        }, 'CMBNATURALEZA');

        this.txtSimpleFind = LOG.util.Prototipos.inputTexto({
            emptyText: this.idioma.lbTextSimpleCodigoDenominacion,
            maxLength:50,
            enableKeyEvents: true,
            width:'150px',
            listeners: {
                keydown: function (txt, e) {
                    /*if (e.altKey && (e.L || e.B)) {
                        me.keyMap.enable();
                    } else*/ if (e.getKey() === 13) {
                        me.productos.stDtView.filtrado = true;
                        me.productos.stDtView.load({
                            params: {
                                criterio: txt.getValue()
                            },
                            callback: function (record) {
                                if (record.length == 0) {
                                    mostrarMensaje(1, me.idioma.msgNoResultados);
                                    delete me.productos.stDtView.filtrado;
                                    return;
                                }
                                var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                                Ext.each(record, function (rd) {
                                    st.each(function (item) {
                                        if (rd.data.idproducto == item.data.idproducto) {
                                            rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                            rd.commit();
                                        }
                                    });
                                });
                            }
                        });
                        //servicios
                        me.servicios.stDtView.filtrado = true;
                        me.servicios.stDtView.load({
                            params: {
                                criterio: txt.getValue()
                            },
                            callback: function (record) {
                                if (record.length == 0) {
                                    mostrarMensaje(1, me.idioma.msgNoResultados);
                                    delete me.servicios.stDtView.filtrado;
                                    return;
                                }
                                var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                                Ext.each(record, function (rd) {
                                    st.each(function (item) {
                                        if (rd.data.idindicador == item.data.idindicador) {
                                            rd.commit();
                                        }
                                    });
                                });
                            }
                        });
                    }
                }
            }
        });
        this.txtSimpleFind.on('render', function () {
            me.txtSimpleFind.el.dom.qtip = me.idioma.lbTextSimpleCodigoDenominacion;
        }, this, {single: true});

        this.btnBuscar = LOG.util.Prototipos.botonBuscar({
            tooltip: this.idioma.ttBtnBuscarDView + ' <b>(Alt+B)</b>',
            handler: function () {
                me.productos.stDtView.filtrado = true;
                me.productos.stDtView.load({
                    params: {
                        criterio: me.txtSimpleFind.getValue()
                    },
                    callback: function (record) {
                        if (record.length == 0) {
                            mostrarMensaje(1, me.idioma.msgNoResultados);
                            delete me.productos.stDtView.filtrado;
                            return;
                        }
                        var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idproducto == item.data.idproducto) {
                                    rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                    rd.commit();
                                }
                            });
                        });
                    }
                });
                //servicios
                me.servicios.stDtView.filtrado = true;
                me.servicios.stDtView.load({
                    params: {
                        criterio: me.txtSimpleFind.getValue()
                    },
                    callback: function (record) {
                        if (record.length == 0) {
                            mostrarMensaje(1, me.idioma.msgNoResultados);
                            delete me.servicios.stDtView.filtrado;
                            return;
                        }
                        var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idindicador == item.data.idindicador) {
                                    rd.commit();
                                }
                            });
                        });
                    }
                });
            }
        });
        this.btnBuscar.key.fn = function () {
            me.productos.stDtView.filtrado = true;
            me.productos.stDtView.load({
                params: {
                    criterio: me.txtSimpleFind.getValue()
                },
                callback: function (record) {
                    if (record.length == 0) {
                        mostrarMensaje(1, me.idioma.msgNoResultados);
                        delete me.productos.stDtView.filtrado;
                        return;
                    }
                    var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                    Ext.each(record, function (rd) {
                        st.each(function (item) {
                            if (rd.data.idproducto == item.data.idproducto) {
                                rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                rd.commit();
                            }
                        });
                    });
                }
            });
            //servicios
            me.servicios.stDtView.filtrado = true;
            me.servicios.stDtView.load({
                params: {
                    criterio: me.txtSimpleFind.getValue()
                },
                callback: function (record) {
                    if (record.length == 0) {
                        mostrarMensaje(1, me.idioma.msgNoResultados);
                        delete me.servicios.stDtView.filtrado;
                        return;
                    }
                    var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                    Ext.each(record, function (rd) {
                        st.each(function (item) {
                            if (rd.data.idindicador == item.data.idindicador) {
                                rd.commit();
                            }
                        });
                    });
                }
            });
        };
        this.btnBuscar.setText(LOG.util.UIManager.ireplaceStyle(this.btnBuscar.getText(), this.btnBuscar.key.key, 'span', 'text-decoration: underline;'));
        //this.keyMap.addBinding(this.btnBuscar.key);
        this.btnLimpiar = LOG.util.Prototipos.botonLimpiar({            
            tooltip: this.idioma.ttBtnLimpiar + ' <b>(Alt+L)</b>',
            handler: function () {
                me.txtSimpleFind.reset();                
                me.comboNaturaleza.reset();
                me.productos.stDtView.reload({
                    params: {},
                    callback: function (record) {
                        var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idproducto == item.data.idproducto) {
                                    rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                    rd.commit();
                                }
                            });
                        });
                    }
                });
                //servicios
                me.servicios.stDtView.reload({
                    params: {},
                    callback: function (record) {
                        var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idindicador == item.data.idindicador) {
                                    rd.commit();
                                }
                            });
                        });
                    }
                });
            }
        });
        this.btnLimpiar.key.fn = function () {
            me.txtSimpleFind.reset();                
            me.comboNaturaleza.reset();
            me.productos.stDtView.reload({
                params: {},
                callback: function (record) {
                    var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                    Ext.each(record, function (rd) {
                        st.each(function (item) {
                            if (rd.data.idproducto == item.data.idproducto) {
                                rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                rd.commit();
                            }
                        });
                    });
                }
            });
            //servicios
            me.servicios.stDtView.reload({
                params: {},
                callback: function (record) {
                    var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                    Ext.each(record, function (rd) {
                        st.each(function (item) {
                            if (rd.data.idindicador == item.data.idindicador) {
                                rd.commit();
                            }
                        });
                    });
                }
            });
        };
        this.btnLimpiar.setText(LOG.util.UIManager.ireplaceStyle(this.btnLimpiar.getText(), this.btnLimpiar.key.key, 'span', 'text-decoration: underline;'));
        //this.keyMap.addBinding(this.btnLimpiar.key);
        this.btnActualizar = LOG.util.UIManager.createBtn({
            //text: this.idioma.lbBtnActualizar,
            iconCls: 'actualizar',
            tooltip: this.idioma.ttBtnActualizar,
            handler: function () {
                me.txtSimpleFind.reset();                
                me.comboNaturaleza.reset();

                delete me.productos.stDtView.initBaseParams.idnaturaleza;
                delete me.productos.stDtView.initBaseParams.idnaturalezapadre;
                delete me.productos.stDtView.initBaseParams.criterio;

                delete me.productos.stDtView.baseParams.idnaturaleza;
                delete me.productos.stDtView.baseParams.idnaturalezapadre;
                delete me.productos.stDtView.baseParams.criterio;

                Ext.MessageBox.wait(me.idioma.msgActualizando, me.idioma.msgEspere || '...');
                me.productos.stDtView.load({
                    callback: function (record) {
                        var st = me.productos._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idproducto == item.data.idproducto) {
                                    rd.data.disponible = parseFloat(rd.data.disponible) - parseFloat(item.data.cantidad);
                                    rd.commit();
                                }
                            });
                        });
                        Ext.MessageBox.hide();
                    }
                });
                //servicios
                delete me.servicios.stDtView.initBaseParams.idnaturaleza;
                delete me.servicios.stDtView.initBaseParams.idnaturalezapadre;
                delete me.servicios.stDtView.initBaseParams.criterio;

                delete me.servicios.stDtView.baseParams.idnaturaleza;
                delete me.servicios.stDtView.baseParams.idnaturalezapadre;
                delete me.servicios.stDtView.baseParams.criterio;

                Ext.MessageBox.wait(me.idioma.msgActualizando, me.idioma.msgEspere || '...');
                me.servicios.stDtView.load({
                    callback: function (record) {
                        var st = me.servicios._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idindicador == item.data.idindicador) {
                                    rd.commit();
                                }
                            });
                        });
                        Ext.MessageBox.hide();
                    }
                });
            }
        });
        this.btnOferta = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnOferta,
            iconCls: 'docidentificativos',
            tooltip: this.idioma.ttBtnOferta,
            handler: function () {
                /*Ext.MessageBox.wait(me.idioma.msgActualizando, me.idioma.msgEspere || '...');
                me.stDtView.reload({
                    callback: function (record) {
                        var st = me._parent.pVenta.pnGridList.getStorePrincipal();
                        Ext.each(record, function (rd) {
                            st.each(function (item) {
                                if (rd.data.idproducto == item.data.idproducto) {
                                    rd.data.existencia = parseFloat(rd.data.existencia) - parseFloat(item.data.cantidad);
                                    rd.commit();
                                }
                            });
                        });
                        Ext.MessageBox.hide();
                    }
                });*/
            }
        });
        /*this.btnMenuAdd = new LOG.util.Prototipos.botonNuevo({
            tooltip: this.idioma.lbBtnAdicionarFact,
            disabled: (subsistema) ? false : true,
            hidden: ocultar,
            key: {
                key: 'N',
                ctrl: false,
                alt: true
            },
            handler: function () {
                var parametros = {};
                parametros.title = me.idioma.tAdicionarFactura;
                parametros.accion = 'add';
                parametros.subsistema = subsistema;
                parametros.tipoDoc = (subsistema == LOG.util.Subsistemas.activosfijos) ? 6 : 8;
                parametros.configFacturacion = me.configFacturacion;
                parametros.deshabilitarBotonesGrids = true;
                me.createAddWinFactura(parametros);
            }
        });*/

        this.btnCerrarSesion = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnSalir,
            disabled: true,
            tooltip: this.idioma.ttBtnSalir,
            iconCls: 'administradorsesion rojo',
            handler: function () {
                me.modelo.cerrarSesion({
                    idseccion: me.datos.idseccion
                }, function () {
                    me.productos._parent.destroy();
                    var sesionCaja = new LOG.fac.puntoventa.sesionCaja({
                        usarAplicar: false,
                        idioma: me.idioma/*,
                        listeners: {
                            show: function () {
                                me.keyMap.disable();
                            },
                            destroy: function () {
                                me.keyMap.enable();
                            }
                        }*/
                    });
                    sesionCaja.show();
                });
            }
        });  

        this.btnCerrarCaja = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnCerrarCaja,
            tooltip: this.idioma.ttBtnCerrarCaja,
            disabled: true,
            iconCls: 'cierrediario',
            handler: function () {
                mostrarMensaje(2, "\xbfEst\xe1 seguro que desea realizar el cierre de las ventas\x3f.", function (btn) {
                    if (btn == 'ok') {
                        var _this = this;
                        var winListCierre = new LOG.fac.ventasdevolucion.GridListCierre({
                            idioma: _this.idioma
                        });
                        winListCierre.init();
                        winListCierre.getPanelSuperior().onRender = winListCierre.getPanelSuperior().onRender.createSequence(function () {
                            winListCierre.getPanelSuperior().add(winListCierre.createComboCajero());
                            winListCierre.getPanelSuperior().doLayout();
                        });
                        winListCierre.getPanelSuperior().setVisible(true);
                        winListCierre.view();
                        winListCierre.getVistaPrincipal().cerrarAceptar = false;
                        winListCierre.getVistaPrincipal().aceptarFn = function () {
                            var storePago = winListCierre.getGridPrincipal().getStore();
                            var diferencia = 0;
                            if(storePago.data.length > 0){
                                storePago.each(function (rd) {
                                    diferencia = diferencia + parseFloat(rd.get('diferencia'));
                                });
                                if(diferencia != 0){
                                    mostrarMensaje(3, _this.idioma.msgErrorAlCerrar+'<b> '+Ext.util.Format.number(diferencia, '0,000.00')+'</b>.');
                                    return false;
                                }else{
                                    var params = {};
                                    _this.modelo.adicionarCierre(params, function () {
                                        _this.getGridPrincipal().getStore().load();
                                    });
                                    return true;
                                }
                            }else{
                                mostrarMensaje(3,'No se puede realizar el cierre de las ventas.');
                            }
                        }
                    }
                })
                /*me.modelo.cerrarVentasdelDia({
                    idcaja: me.datos.idcaja,
                    idsession: me.datos.idseccion
                }, function () {
                    me.productos._parent.destroy();
                    var sesionCaja = new LOG.fac.puntoventa.sesionCaja({
                        usarAplicar: false,
                        idioma: me.idioma
                    });
                    sesionCaja.show();
                });*/
            }
        }); 
        
        this.btnCambiarCaja = LOG.util.UIManager.createBtn({
            text: this.idioma.lbBtnCambiarCaja,
            tooltip: this.idioma.ttBtnCambiarCaja,
            //disabled: true,
            iconCls: 'intercambiar',
            handler: function () {
                me.productos._parent.destroy();
                var sesionCaja = new LOG.fac.puntoventa.sesionCaja({
                    usarAplicar: false,
                    acciones: me.acciones,
                    idioma: me.idioma
                });
                sesionCaja.show();
            }
        }); 

        this.btnIngresarCaja = LOG.util.UIManager.createBtn({
            //disabled: true,
            text: this.idioma.lbBtnIngresarCaja,
            tooltip: this.idioma.ttBtnIngresarCaja,
            iconCls: 'entrada',
            handler: function () {
                var winIngresarExtraerEfectivo = new LOG.fac.puntoventa.winIngresarExtraerEfectivo({
                    idioma: me.idioma,
                    title: me.idioma.tIngresarEfectivo,
                    _parent: me,
                    signo: '+'
                });
                winIngresarExtraerEfectivo.show();
            }
        }); 

        this.btnArqueoCaja = LOG.util.UIManager.createBtn({
            //disabled: true,
            text: this.idioma.lbBtnArqueoCaja,
            tooltip: this.idioma.ttBtnArqueoCaja,
            iconCls: 'salida',
            handler: function () {
                var winIngresarExtraerEfectivo = new LOG.fac.puntoventa.winIngresarExtraerEfectivo({
                    idioma: me.idioma,
                    title: me.idioma.tExtraerrEfectivo,
                    _parent: me,
                    signo: '-'
                });
                winIngresarExtraerEfectivo.show();
            }
        });  

        this.btnTestFUC = LOG.util.UIManager.createBtn({
            //disabled: true,
            text: 'Test FUC',
            tooltip: 'Test FUC',
            iconCls: 'cerrar',
            handler: function () {
                me.modelo.testFUC();
            }
        });   

        this.btnCambiarUser = LOG.util.UIManager.createBtn({
            tooltip: "Cambiar de Usuario",
            iconCls: 'usuario',
            handler: function () {
                mostrarMensaje(2, me.idioma.msgCabiarUsuario, function (btn) {
                    if (btn == 'ok') {
                        let winGeneralLogin = new LOG.fac.puntoventa.winLogin({
                            closable: false,
                            title: 'Seleccione el usuario'
                        });
                        winGeneralLogin.show();
                    }
                });
            }
        });

        this.lblFecha = new Ext.form.Label({
            text: this.idioma.lblFecha+': '+fechacontable,
            style: 'padding: 10px 10px 0px 10px;font-weight: bolder;font-size: 12px;'
        }); 

        this.lblDatosCaja = new Ext.form.Label({
            html: '<span id="iddatoscaja"><b>'+config.datos.nombrecaja+' - '+config.datos.deposito+'</b></span>',
            style: 'padding: 10px 10px 0px 10px;font-weight: bolder;font-size: 12px;'
        });
        this.panelProdServ = LOG.util.UIManager.initPanel({
            region: 'center',
            layout: 'border',
            //tbar: ['->', LOG.util.Prototipos.botonAyuda({id: 'idterminalpuntoventa'})],
            tbar: [this.btnCambiarCaja/*,this.btnCerrarCaja*/, '-', this.btnIngresarCaja, '-', this.btnArqueoCaja, '-', this.btnTestFUC, '-', '->', '-',this.lblDatosCaja,'-',
                this.lblFecha, '-', this.comboNaturaleza, '-', this.txtSimpleFind, '-'/*,this.btnLimpiar*/, this.btnActualizar, '-'/*, this.btnCambiarUser*/],
            /*,
                bbar: [],*/
        })
        this.panelProdServ.add(this.pVenta);
        this.panelProdServ.add({
            xtype: 'panel',
            region: 'east',
            width: '60%',
            layout: 'border',
            items: [this.tabProductosServicios.view()]
        });
        this.items = [
            this.panelProdServ
        ];
        this.modelo.bindGridPanel(this.pVenta.pnGridList.getGridPrincipal());
        LOG.fac.puntoventa.View.superclass.constructor.call(this, config);
    }
});

LOG.fac.puntoventa.FormasPago = Ext.extend(LOG.util.Window,{
    constructor: function (config) {
        var me = this;
        LOG.util.UIManager.apply(this, config);
        this.width = 550;
        this.height = 350;
        this.resizable = false;
        this.usarAplicar = false;
        this.pasar = true;
        /*this.modelo = new LOG.fac.puntoventa.Model({
            idioma: this.idioma
        });*/
        LOG.fac.puntoventa.FormasPago.superclass.constructor.call(this, config);
        this.paymentWindow();
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            //disabled: true,
            handler: function () {
                var arrayPaymens = [];
                if(parseFloat(me.tfImportePendiente.getValue()).toFixed(2) == 0){
                    me.pnGridList.getStorePrincipal().each(function (rd) {
                        var _existe = false;
                        arrayPaymens.forEach(function(p, pos){
                            if(p.idformapago == rd.data.idformapago){
                                _existe = true;
                                arrayPaymens[pos].importe+= parseFloat(rd.data.importe).toFixed(2)
                            }
                        });
                        if(!_existe){
                            arrayPaymens.push({
                                idformapago : rd.data.idformapago,
                                importe: parseFloat(rd.data.importe).toFixed(2)
                            }) 
                        }
                    });
                    me.aceptarFn.createDelegate(me,[{
                        pagos: Ext.encode(arrayPaymens)
                    }]).call();
                    me.close();
                }
            }
        });
    },

    paymentWindow : function(){
        var me = this;
        
        this.tfImporte = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Importe',
            anchor: '100%',
            editable: true,
            allowBlank: false,
            decimalPrecision:2,
            enableKeyEvents : true,
            listeners: {
                'blur': function () {
                    this.originalValue = this.getValue();
                },
                'render': function (field) {
                    //field.setValue(selected.data.url);
                },
                'keydown' : function(tf, e){
                    if(e.keyCode == 13){
                        if(me.cbFormaPago.isValid() && tf.isValid()){
                            me.pnGridList.getStorePrincipal().add(new Ext.data.Record({
                                idformapago: me.cbFormaPago.getValue(),
                                fpago: me.cbFormaPago.getRawValue(),
                                importe: tf.getValue()
                            }));
                            me.importeTotal = parseFloat(me.importeTotal).toFixed(2) - parseFloat(tf.getValue()).toFixed(2);
                            me.tfImportePendiente.setValue(me.importeTotal);
                            tf.setValue(0);
                        }
                        
                    }
                }
            }
        });

        this.tfImportePendiente = new LOG.util.Prototipos.inputDecimal({
            fieldLabel: 'Importe pendiente',
            anchor: '100%',
            editable: false,
            allowBlank: false,
            decimalPrecision:2,
            enableKeyEvents : true,
            disabled:true,
        });

        this.tfImportePendiente.setValue(this.importeTotal);
        
        this.cbFormaPago = new LOG.util.ComboBox({
            fieldLabel: 'Forma de pago',
            editable: false,
            name: 'idmodopago',
            url: 'cargarModoPago',
            hiddenName: 'idmodopago',
            valueField: 'idmodopago',
            displayField: 'modopago',
            allowBlank: false,
            typeAhead: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            enableQtip: true,
            emptyText: 'Forma de pago',
            listeners: {
                'select': function (campo, value) {
                    var cambia;
                   if(me.pnGridList.getSmPrincipal().getSelections().length > 0 && me.cbFormaPago.isValid()==true){
                       cambia = false;
                   }else {
                       cambia = true;
                   }
                   me.idmodopago = campo.getValue();
                }
            }
        }); 

        var clsSuperior = LOG.util.UIManager.initColumnForm({
            columnas: 3,
        });
        
        clsSuperior.addComponent(this.cbFormaPago);
        clsSuperior.addComponent(this.tfImporte);
        clsSuperior.addComponent(this.tfImportePendiente);
        var fsDatosCaja = new Ext.form.FieldSet({
            items: [clsSuperior]
        });
        me.pnGridList = new LOG.fac.puntoventa.GridPagos({
            /*idioma: this.idioma,
            listaAcciones: me.listaAcciones,*/
            _parent: me,
            onRemoveAction: function(r){
                me.importeTotal = me.importeTotal + r.data.importe;
                me.tfImportePendiente.setValue(me.importeTotal);
            }
        });
        /*this.rowaction = new Ext.ux.grid.RowActions({
            id: 'actioncolumn',
            actions: [{
                id: 'eliminar',
                tooltip: 'Eliminar productos',
                iconCls: 'vaciartemporal rojo'
            }]
        });
        this.pnGridList.addGridPlugin(this.rowaction);*/
        me.pnGridList.init();
        var gdPagos = me.pnGridList.view({
            region: 'south',
            height : 185
        });
        
        var pMain = LOG.util.UIManager.initForm({
            frame: true,
            labelAlign: 'top',
            region: 'center',
            items: [fsDatosCaja]
        });
        this.add(pMain);  
        this.add(gdPagos);  
    }
});


LOG.fac.puntoventa.GridPagos = Ext.extend(LOG.util.UITemplate, {
    panelBotonesVisible: false,
    constructor: function (config) {
        this.modoSeleccion = 1;
        this.dirController = '/logistica/facturacion/puntoventa/index.php/terminalpuntoventa';
        this.formaVisualizacion = 'panel';
        this.bbarVisible = false;
        this.autoLoad = false;
        this.gridEditable = true;
        LOG.fac.puntoventa.GridPagos.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function () {
        this.addGridColumn({
            default: false
        });
        this.addGridColumn({
          header: ' ',
          id: 'actioncolumn',
            width: 35,
            renderer: function (value, metaData, record, rowIndex, colIndex, store) {
                return '<button class="icondistra-eliminar rojo" style="background: transparent;border:none"></button>'
            }
        });
        this.addGridColumn({
            header: 'Forma de pago',
            autoExpand: true,
            dataIndex: 'fpago',
            default: true
        });

        this.addGridColumn({
            header: 'Importe',
            dataIndex: 'importe',
            width: 160,
            default: true
        });
        
        this.addGridColumn({dataIndex: 'idformapago'});
    },
    render: function (config) {
        var _this = this;
        config = config || {
            border: true,
            title: this.idioma.tlGridProductos
        };
        var p = LOG.fac.puntoventa.GridPagos.superclass.render.call(this, config), me = this;
        this.getGridPrincipal().getTopToolbar().setVisible(false);
        this.getGridPrincipal().on('cellclick', function(grid, rowIndex, columnIndex, e ){
            if (columnIndex == 1) {
                _this.onRemoveAction.createDelegate(_this,[_this.getStorePrincipal().getAt(rowIndex)]).call();
                _this.getStorePrincipal().removeAt(rowIndex);
            }
        });
        return p;
    }
});
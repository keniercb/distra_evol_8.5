Ext.define('GestionContratoImportacion.controller.FormaPagoContratacion', {
    extend: 'Ext.app.Controller',

    refs: [
        {ref: 'MainContratacion', selector: 'co_gcmainContratacionimportacion'},
        {ref: 'MainGridContratacion', selector: 'co_contratosgridContratacionimportacion'},
        {ref: 'mainWindow', selector: 'co_mainwindowContratacionimportacion'},
        {ref: 'GridHitoPago', selector: 'GridHitoPagoimportacion'},
        {ref: 'FormaPago', selector: 'FormaPagoimportacion'},
        {ref: 'Moneda', selector: 'Monedaimportacion'},
        {ref: 'PagoAlternativo', selector: 'PagoAlternativoimportacion'},
        {ref: 'HitoPagoWindow', selector: 'HitoPagoWindowimportacion'},
        {ref: 'WindowProductoProveedor', selector: 'WindowProductoProveedorimportacion'},
        {ref: 'gridProducto', selector: 'gridproductoimportacion'},
        {ref: 'windowProducto', selector: 'windowproductoimportacion'},
        {ref: 'gridMora', selector: 'gridmoraimportacion'},
        {ref: 'WindowPedido', selector: 'windowPedidoimportacion'},
    ],

    init: function () {
        var me = this;
        this.etiquetas = LangMgr.getLang(this);

        this.listen({
            store: {
                '#hitoStoreImportacion': {
                    loaddata: this.setOriginalValue,
                    addall: this.calcTotal,
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: this.onRemove,
                    removeall: this.calcTotal,
                    update: this.calcTotal
                },
                '#indicadorStoreImportacion': {
                    loaddata: this.setOriginalValue,
                    addall: this.calcTotal,
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: this.onRemove,
                    removeall: this.calcTotal,
                    update: this.calcTotal
                },
                '#hitoIndicadorStoreImportacion': {
                    loaddata: this.setOriginalValue,
                    addall: this.calcTotal,
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: this.onRemove,
                    removeall: this.calcTotal,
                    update: this.calcTotal
                },
                '#productoPedidoStoreImportacion': {
                    loaddata: this.setOriginalValue,
                    addall: this.calcTotal,
                    add: function (store, record) {
                        record[0].dirty = true;
                    },
                    remove: this.onRemove,
                    removeall: this.calcTotal,
                    update: function(yo, record){
                        this.calcTotal(yo);
                        if(record.get('cantidad')>record.get('cantidad_max')){
                            record.set('correcto', false);
                        }else{
                            record.set('correcto', null)
                        }
                    },
                    datachanged: function(yo){
                        var me=this;
                        // console.log('datachanged:', yo.storeId)
                        me.getWindowPedido().down('#validogridpedidos').setValue(yo.getCount()>0?'valido':'');
                    }
                },
                '#stTipoPrecioImportacion': {
                    load: this.onLoadTipoPrecio,
                    beforeload: this.onBeforeLoadTipoPrecio
                },
                '#stProductoImportacion': {
                    beforeload: this.resetTipoPrecio
                }
            },
            component: {
                "GridHitoPagoimportacion button[action],gridproductoimportacion menuitem[action],gridproductoimportacion button[action]": {
                    click: this.clickButton
                },
                "HitoPagoWindowimportacion": {
                    show: this.winShow,
                    hide: this.hideWin
                },
                "WindowProductoProveedorimportacion": {
                    show: this.winShow,
                    hide: this.hideWin
                },
                "GridHitoPagoimportacion": {
                    selectionchange: this.buttonEnableHito,
                    afterrender: this.createKeyMap,
                    itemdblclick: function (view) {
                        if(!view.up('GridHitoPago').sinAcciones){
                            var btn = view.up('GridHitoPago').btnMod;
                            btn.fireEvent('click', btn);
                        }
                    }
                },
                "gridproductoimportacion": {
                    selectionchange: this.buttonEnable,
                    afterrender: this.createKeyMap,
                },
                "HitoPagoWindowimportacion button": {
                    click: this.clickButtonWin
                },
                "WindowProductoProveedorimportacion button": {
                    click: this.clickButtonWinProductoProveedor
                },
                'FormaPagoimportacion checkboxfield[name=tipofactura]': {
                    change: this.changeCheckboxField
                },
                'Monedaimportacion combobox[context=monedacontrato]': {
                    select: this.selectCmbMoneda
                },
                'Monedaimportacion combobox[context=tasacontrato]': {
                    select: this.selectCmbTasa
                },
                'Monedaimportacion numberfield': {
                    change: this.changeValueNumberField
                },
                'textfield[name=montototal]': {
                    render: this.setAsCero,
                    blur: this.setAsCero
                },
                'HitoPagoWindowimportacion combobox[name=periodicidad]': {
                    select: this.selectCombo,
                    change: this.changeCombo
                },
                'HitoPagoWindowimportacion numberfield[name=vigencia]': {
                    change: this.changeVigencia
                },
                'HitoPagoWindowimportacion numberfield[name=unidadtiempo]': {
                    change: this.changeUnidadtiempo
                },
                'HitoPagoWindowimportacion combobox[name=unidadtiempo]': {
                    change: this.changeUnidadtiempo
                },
                'HitoPagoWindowimportacion button[itemId=calcularFechaEstimada]': {
                    click: this.buttonCalcularFechaEstimada
                },
                'HitoPagoWindowimportacion datefield[name=fechaestimada]': {
                    select: this.selectFechaEstimada,
                    change: this.changeFechaEstimada
                },
                'windowproductoimportacion combo[name=tipoprecio]': {
                    change: this.onChangeTipoPrecio
                },
                'gridmoraimportacion': {
                    selectionchange: this.onGridMoraSelect
                },
                'gridmoraimportacion button': {
                    click: this.onClickGridMora
                }
            }
        });
    },
    selectCombo:function(combo, records){
        var me=this, winHito=me.getHitoPagoWindow(),
            form = combo.up('form'), hiddenField = form.getForm().findField(combo.localId);
        if (hiddenField) {
            hiddenField.setValue(records[0].data[combo.localId]);
        }
    },

    changeCombo: function (combo, value) {
        var form = combo.up('form'),
            hiddenField = form.getForm().findField(combo.localId),
            winHito=this.getHitoPagoWindow();

        if (hiddenField && Ext.isEmpty(value)) {
            hiddenField.setValue('');
        }
        if(combo.getStore().findExact('denominacion', combo.getValue())!=-1){
            winHito.vigencia.setDisabled(true);
            winHito.unidadTiempo.setDisabled(true);
            winHito.vigencia.allowBlank=true;
        }else{
            winHito.vigencia.setDisabled(false);
            winHito.unidadTiempo.setDisabled(false);
            winHito.vigencia.allowBlank=false;
        }
    },

    posibleCalcularFechaEstimada:function(){
        var me=this, winHito=me.getHitoPagoWindow();
        return winHito.unidadTiempo.getValue() &&
            winHito.vigencia.getValue() &&
            !winHito.fechaEstimada.modificadaManual &&
            winHito.fecha_firma_contrato;
    },
    HabilitarCalcularFechaEstimada:function(){
        var me=this, winHito=me.getHitoPagoWindow();
        return winHito.unidadTiempo.getValue() &&
            winHito.vigencia.getValue() &&
            winHito.fecha_firma_contrato;
    },

    changeVigencia:function(yo){
        var me=this, winHito=me.getHitoPagoWindow();
        if(yo.getValue()){
            winHito.cmbIguala.setDisabled(true);
            winHito.cmbIguala.allowBlank=true;
        }else{
            winHito.cmbIguala.setDisabled(false);
            winHito.cmbIguala.allowBlank=false;
        }
        me.calcular_fecha_estimada();
    },

    changeUnidadtiempo: function(){
        var me=this, winHito=me.getHitoPagoWindow();
        winHito.calcularFechaEstimada.setDisabled(me.posibleCalcularFechaEstimada());
        me.calcular_fecha_estimada();
    },

    buttonCalcularFechaEstimada:function(){
        var me=this, winHito=me.getHitoPagoWindow();
        winHito.fechaEstimada.modificadaManual=false;
        me.calcular_fecha_estimada();
    },

    calcular_fecha_estimada:function(){
        var me=this, winHito=me.getHitoPagoWindow();
        winHito.calcularFechaEstimada.setDisabled(!me.HabilitarCalcularFechaEstimada());
        if(me.posibleCalcularFechaEstimada()){
            var fecha_inicial=Ext.clone(winHito.fecha_firma_contrato);
            if(winHito.unidadTiempo.getValue()==1){
                fecha_inicial.setDate(fecha_inicial.getDate()+winHito.vigencia.getValue());
            }else if(winHito.unidadTiempo.getValue()==2){
                fecha_inicial.setDate(fecha_inicial.getDate()+winHito.vigencia.getValue()*7);
            }else if(winHito.unidadTiempo.getValue()==3){
                fecha_inicial.setMonth(fecha_inicial.getMonth()+winHito.vigencia.getValue());
            }
            winHito.calcularFechaEstimada.setDisabled(true);
            winHito.fechaEstimada.setValue(fecha_inicial);
        }
    },

    selectFechaEstimada:function(field, value){
        var me=this, winHito=me.getHitoPagoWindow();
        winHito.fechaEstimada.modificadaManual=true;
        winHito.calcularFechaEstimada.setDisabled(!me.HabilitarCalcularFechaEstimada());
    },

    changeFechaEstimada:function(field){
        var me=this, winHito=me.getHitoPagoWindow();
        if(!field.getValue()){
            field.modificadaManual=false;
            winHito.calcularFechaEstimada.setDisabled(!me.HabilitarCalcularFechaEstimada());
        }

    },

    clickButtonWinProductoProveedor: function (myButton) {
        if (myButton.action == 'acept' || myButton.action == 'apply') {
            var me = this, win = myButton.up('window'),
                store = win.gridproducto.getStore(),
                data = win.down('form').getForm().getValues(),
                guardar = {
                    codigo: data.codigo,
                    codigoproveedor: data.codigo,
                    denominacion: data.descripcion,
                    cantidad: data.cantidad || 1,
                    unidadmedida: data.unidadmedida || 'Unidad',
                    precio: data.montomoneda_cup?data.montomoneda_cup:null,
                    preciodivisa: data.montomoneda_cuc?data.montomoneda_cuc:null,
                    preciototal: data.montomoneda_cup * data.cantidad,
                    preciodivisatotal: data.montomoneda_cuc * data.cantidad,
                    tipo: data.tipo,
                    monto: 0
                };

            if (win.action == 'addproducto') {
                store.add(guardar);
                store.fireEvent('update', store);
            } else {
                var record = win.gridproducto.getSelectionModel().getSelection()[0];
                record.set(guardar);
                store.fireEvent('update', store);
            }
            if (win.gridproducto.up('window').formaPago) {
                win.gridproducto.up('window').formaPago.cambiarMontosPorHitosIndicadores();
            } else if (Ext.isFunction(win.gridproducto.up('window').cambiarMontosPorHitosIndicadores)) {
                win.gridproducto.up('window').cambiarMontosPorHitosIndicadores();
            }
            if (myButton.action == 'acept')
                win.close()

        }
    },
    buttonEnableHito: function (sm) {
        var me = this,
            grid = sm.view.up('gridpanel'),
            selection = sm.getSelection(),
            len = selection.length;
        if (len == 1) {
            if (grid.btnMod)grid.btnMod.setDisabled(false);
            if (grid.btnDel)grid.btnDel.setDisabled(selection[0].get('inicial')!='1');
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(false);
        } else if (len == 0) {
            if (grid.btnMod)grid.btnMod.setDisabled(true);
            if (grid.btnDel)grid.btnDel.setDisabled(true);
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(true);
        } else {
            var todos_iniciales=selection.every(function(x){
                return x.get('inicial')=='1';});
            var todos_sinfactura=selection.every(function(x){
                return x.get('tienefactura')==false;});
            console.log(todos_iniciales, todos_sinfactura)
            if (grid.btnMod)grid.btnMod.setDisabled(true);
            if (grid.btnDel)grid.btnDel.setDisabled(!todos_iniciales && !todos_sinfactura);
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(true);
        }
    },
    buttonEnable: function (sm) {
        var me = this,
            grid = sm.view.up('gridpanel'),
            selection = sm.getSelection(),
            len = selection.length;
        if (len == 1) {
            if (grid.btnMod)grid.btnMod.setDisabled(false);
            if (grid.btnDel)grid.btnDel.setDisabled(false);
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(false);
        } else if (len == 0) {
            if (grid.btnMod)grid.btnMod.setDisabled(true);
            if (grid.btnDel)grid.btnDel.setDisabled(true);
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(true);
        } else {
            if (grid.btnMod)grid.btnMod.setDisabled(true);
            if (grid.btnDel)grid.btnDel.setDisabled(false);
            if (grid.btnReplicar)grid.btnReplicar.setDisabled(true);
        }
    },

    winShow: function (win, eOpts) {
        var self = this;
        var form = win.down('customform');
        this.activeWindows = true;
        form.on('validitychange', function (yo, valid) {
            self.checkWindow(form, win);
        });
        form.on('dirtychange', function (yo, valid) {
            self.checkWindow(form, win);
        });
    },

    hideWin: function (win, eOpts) {
        this.activeWindows = false;
    },

    checkWindow: function (form, win) {
        if (this.activeWindows) {
            var bForm = form.getForm(),
                invalid = bForm.hasInvalidField(),
                change = bForm.isDirty();
            if (win.action == 'edit') {
                win.disableButtons(invalid || !change);
            } else {
                win.disableButtons(invalid);
            }
        } else {
            return false;
        }
    },

    changeValueNumberField: function (number, newValue, oldValue, eOpts) {
        if (number) {
            var formaPago = number.up().up().up(),
                pagoAlternativo = number.up().up();
            this.calMonto(formaPago, pagoAlternativo)
        }
    },

    calMonto: function (formaPago, pagoAlternativo) {
        var items = pagoAlternativo.items.items,
            monto = 0;
        if (formaPago.xtype == 'FormaPago') {
            for (var i in items) {
                var moneda = items[i];
                if (moneda.montoAlternativo.getValue()) {
                    if (!moneda.tasa.isDisabled()) {
                        monto += moneda.montoAlternativo.getValue() / parseFloat(moneda.tasa.valueModels[0].data.factordeconversion);
                    } else {
                        monto += moneda.montoAlternativo.getValue();
                    }
                }
            }
            formaPago.montoTotal.setValue(monto);
        }
    },

    clickButtonWin: function (myButton, e, eOpts) {
        var me = this;
        switch (myButton.action) {
            case 'acept':
                me.eventDataHito(myButton.action);
                break;
            case 'apply':
                me.eventDataHito(myButton.action);
                break;
        }
    },
    getIndicadores: function () {
        var store = this.getHitoPagoWindow().productosservicios.getStore(),
            modificados = [], eliminados = [];
        store.getRange().forEach(function (valor) {
            if (!valor.get('idindicadorcontrato') || !Ext.isEmpty(valor.modified)) {
                modificados.push(valor.data);
            }
        });
        store.getRemovedRecords().forEach(function (valor) {
            if (valor.get('idindicadorcontrato')) {
                eliminados.push(valor.get('idindicadorcontrato'))
            }
        });
        return {modificados: modificados, eliminados: eliminados}
    },
    eventDataHito: function (action) {
        var me = this,
            win = me.getHitoPagoWindow(),
            formHito = win.form,
            valuesHito = formHito.getValues(),
            entregable = win.entregable,
            pagoAlternativo = win.pagoAlternativo,
            gridHitoPago = me.getGridHitoPago(),
            arrayPago = new Array(),
            arrayIndicadores = me.getIndicadores(),
            indicadores = [];
        store = gridHitoPago.getStore(),
            numero = win.numero.getValue(),
            monto = 0;
        Ext.each(win.extrafields, function (value, index) {
            if(win.down('#montomoneda_'+value.codigoiso.toLowerCase())){
                monto += win.down('#montomoneda_' + value.codigoiso.toLowerCase()).getValue();
                arrayPago.push({
                    monto: win.down('#montomoneda_' + value.codigoiso.toLowerCase()).getValue(),
                    moneda: value.codigoiso,
                    idmoneda: value.idmoneda,
                    idmonedaentidad: value.idmonedaentidad,
                    idmonedahito: win.down('#montomoneda_' + value.codigoiso.toLowerCase()).idmonedahito
                });
            }
        });
        Ext.each(win.productosservicios.getStore().getRange(), function (value, index) {
            indicadores.push(value.data);
        });
        
        if (numero) {
            var pos = store.find('numero', numero);
            if (pos != -1) {
                var record = store.getAt(pos);
                record.set({
                    descripcion: valuesHito.descripcion,
                    moneda:'cup',
                    monto: monto,
                    fechafin: valuesHito.fechaestimada,
                    vigencia: valuesHito.vigencia,
                    unidadtiempo: valuesHito.unidadtiempo,
                    nombrearea:valuesHito.nombrearea,
                    responsable: '',
                    idarea:valuesHito.idarea,
                    meses: valuesHito.meses,
                    idperiodicidad: valuesHito.idperiodicidad,
                    pago: arrayPago,
                    indicadores:indicadores,
                    arrayIndicadores:arrayIndicadores
                });
            }
        }
        else {
            store.add({
                numero: gridHitoPago.getStore().data.items.length + 1,
                descripcion: valuesHito.descripcion,
                moneda:'cup',
                monto: monto,
                fechafin: valuesHito.fechaestimada,
                vigencia: valuesHito.vigencia,
                unidadtiempo: valuesHito.unidadtiempo,
                nombrearea:valuesHito.nombrearea,
                responsable: '',
                idarea:valuesHito.idarea,
                meses: valuesHito.meses,
                idperiodicidad: valuesHito.idperiodicidad,
                pago: arrayPago,
                indicadores:indicadores,
                arrayIndicadores:arrayIndicadores
            });
            store.fireEvent('addall', store);
        }
        var hitos=gridHitoPago.getStore().getRange();
        if(hitos.length!=0){
            var cont=1;
            hitos.forEach(function(x){
                if(parseInt(x.get('numero'))!=cont)
                    x.set('numero', cont);
                cont++;
            });
        }
        store.fireEvent('update', store);
        if(gridHitoPago.up('window').formaPago) {
            if(Ext.isFunction(gridHitoPago.up('window').formaPago.cambiarMontosPorHitosIndicadores()))
                gridHitoPago.up('window').formaPago.cambiarMontosPorHitosIndicadores();
            if(gridHitoPago.up('window').fechafirma)
                gridHitoPago.up('window').fechafirma.validate();
        }else{
            if(Ext.isFunction(win.gridproducto.up('window').cambiarMontosPorHitosIndicadores()))
                win.gridproducto.up('window').cambiarMontosPorHitosIndicadores();
        }
        if (action == 'acept') {
            win.destroy();
        } else {
            formHito.getForm().reset();
            pagoAlternativo.reset();
            setTimeout(function () {
                win.first.focus();
            }, 10);
        }
        Ext.each(gridHitoPago.up('window').extrafields, function (value, index) {
            if(gridHitoPago.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
                 gridHitoPago.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
            }
        })
        gridHitoPago.up('window').formaPago.comprobarValidezMontos();
    },
    selectCmbMoneda: function (combo, records, eOpts) {
        var panelMoneda = combo.up(),
            tasa = panelMoneda.tasa,
            montoAlternativo = panelMoneda.montoAlternativo;
        if (records[0].data.tipomoneda) {
            tasa.setDisabled(false);
            montoAlternativo.setDisabled(true);
            tasa.getStore().load({
                params: {
                    idmonedaentidad: combo.getValue()
                }
            });
        } else {
            tasa.setDisabled(true);
            montoAlternativo.setDisabled(false);
        }
    },

    selectCmbTasa: function (combo, records, eOpts) {
        var panelMoneda = combo.up(),
            montoAlternativo = panelMoneda.montoAlternativo;
        if (records && records[0] && records[0].data) {
            montoAlternativo.setDisabled(false);
        }
        this.changeValueNumberField(montoAlternativo);
    },

    clickButton: function (myButton, e, eOpts) {
        var me = this;
        switch (myButton.action) {
            case 'addhito' :
                me.showWin(myButton);
                break;
            case 'edithito' :
                me.showWin(myButton);
                break;
            case 'delhito' :
                me.delHito();
                break;
            case 'replicarhito' :
                me.showWin(myButton);
                break;
            case 'addprod':
                me.addProducto(myButton);
                break;
            case 'addserv':
                me.addServicio(myButton);
                break;
            case 'modprodserv':
                me.modificarProductoServicio(myButton);
                break;
            case 'delprodserv':
                me.delProdServ(myButton);
                break;
            case 'importarprodserv':
                me.importarExcel(myButton);
                break;
            case 'exportarprodserv':
                me.exportarExcel(myButton);
                break;
            case 'tasacambio':
                me.tasaCambio(myButton);
                break;
        }
    },
    modificarProductoServicio:function(myButton){
        var me=this, win =myButton.up('window'),
            data=myButton.up('gridpanel').getSelectionModel().getSelection()[0],
        ps=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProductoProveedor', {
            title: data.get('tipo')==2?me.etiquetas.titleSelecProducto:me.etiquetas.titleSelecServicio,
            gridproducto: myButton.up('gridpanel'),
            windowParent:win,
            action:'edit',
            tipo:data.get('tipo'),
            context:win.context,
            etiquetas:win.etiquetas,
            extrafields:win.extrafields,
            idnaturaleza: win.idnaturaleza
        });
        ps.show(null, function(){
            ps.down('#cantidad').valorAnterior=data.get('cantidad');
            ps.down('form').getForm().loadRecord(data);
            ps.down('#descripcion').setValue(data.get('denominacion'));
            ps.down('#descripcion').resetOriginalValue();
            if(ps.down('#montomoneda_cup')){
                ps.down('#montomoneda_cup').setValue(data.get('precio'));
                ps.down('#montomoneda_cup').resetOriginalValue();
            }
            if(ps.down('#montomoneda_cuc')){
                ps.down('#montomoneda_cuc').setValue(data.get('preciodivisa'));
                ps.down('#montomoneda_cuc').resetOriginalValue();
            }
        });
    },
    addProducto:function(myButton){
        var me=this,win=myButton.up('window');
        console.log('win', win)
        if(win.context=='importacion'){
            if(!me.winProduct || (me.winProduct && me.winProduct.planificacion))
                console.log('me.winProduct:', me.winProduct)
                me.winProduct=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProducto', {
                    title: me.etiquetas.titleSelecProducto,
                    gridproducto: myButton.up('gridpanel'),
                    filtros: win.filtros,
                    idnaturaleza: win.idnaturaleza,
                    node: win.node,
                    mostrarDatosAdicionales: myButton.up('gridpanel').mostrarDatosAdicionales
                });
            me.winProduct.gridproducto=myButton.up('gridpanel');
            me.winProduct.show();
        }else if(win.context=='proveedor'){
            var ps=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProductoProveedor', {
                title:me.etiquetas.titleSelecProducto,
                gridproducto: myButton.up('gridpanel'),
                windowParent:win,
                context:win.context,
                action:'addproducto', tipo:1,
                etiquetas:win.etiquetas,
                extrafields:win.extrafields
            })
            ps.show(null, function(){ps.down('#descripcion').focus();ps.doLayout();});
        }
    },
    addServicio:function(myButton){
        var me=this,win=myButton.up('window');
        var activo=false;
        if(this.application.planificacion)
            activo=this.application.planificacion.activo;
        if(win.context=='importacion'){
            if(activo) {
                if(!me.winServic)
                    me.winServic=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowServicio', {
                        title: me.etiquetas.titleSelecServicio,
                        gridproducto: myButton.up('gridpanel'),
                        filtros: win.filtros,
                        idnaturaleza: win.idnaturaleza,
                        node: win.node
                    });
                me.winServic.gridproducto=myButton.up('gridpanel');
                me.winServic.show();
            }else{
                if(!me.winProduct || (me.winProduct && !me.winProduct.planificacion))
                    me.winProduct=Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProducto', {
                        title: me.etiquetas.titleSelecProducto,
                        gridproducto: myButton.up('gridpanel'),
                        planificacion: true,
                        filtros: win.filtros,
                        idnaturaleza: win.idnaturaleza,
                        node: win.node
                    });
                me.winProduct.gridproducto=myButton.up('gridpanel');
                me.winProduct.show();
            }
        }else{
           var ps= Ext.create('GestionContratoImportacion.view.FormaPago.Producto.WindowProductoProveedor', {
               title:me.etiquetas.titleSelecServicio,
               gridproducto: myButton.up('gridpanel'),
               windowParent:win,
               action:'addproducto', tipo:2,
               etiquetas:win.etiquetas,
               extrafields:win.extrafields
            });
            ps.show(null, function () {
                ps.down('#descripcion').focus();
                ps.doLayout();
            });
        }
    },
    addCmpMoneda: function (myButton) {
        var pagoAlternativo = myButton.up().up(),
            cmpMoneda = Ext.create('GestionContratoImportacion.view.FormaPago.Alternativo.Moneda');
        pagoAlternativo.add(cmpMoneda);
        return cmpMoneda;
    },

    delCmpMoneda: function (myButton) {
        var me = this;
        mostrarMensaje(2, me.etiquetas.msgEliminar + me.etiquetas.msgFormapago, function (response) {
                if (response === 'ok') {
                    var formaPago = myButton.up().up().up(),
                        pagoAlternativo = myButton.up().up();
                    myButton.up().destroy();
                    me.calMonto(formaPago, pagoAlternativo);
                }
            }
        )
    },

    showWin: function (btn) {
        var me = this,
            wincontrato = btn.up('window'),
            extrafields = wincontrato.extrafields,
            idhito=null;
            if(btn.action == 'edithito' || btn.action == 'replicarhito')
                idhito=me.getGridHitoPago().getSelectionModel().getLastSelected().data.idhito;
            var win = Ext.create('GestionContratoImportacion.view.FormaPago.Hito.HitoPagoWindow', {
                action: btn.action=='edithito'?'edit':'add',
                wincontrato:wincontrato,
                context:wincontrato.context,
                extrafields: extrafields,
                fecha_firma_contrato:wincontrato.fechafirma?wincontrato.fechafirma.getValue():null,
                idhito:idhito
            });
        if (btn.action == 'addhito') {
            win.pagoAlternativo.btnAddMoneda.fireEvent('click', win.pagoAlternativo.btnAddMoneda);
        }
        win.show(null, function () {
            if (btn.action == 'edithito' || btn.action == 'replicarhito') {
                var data = me.getGridHitoPago().getSelectionModel().getLastSelected().data,
                    record=me.getGridHitoPago().getSelectionModel().getLastSelected(),
                    arrayPago = data.pago;
                win.focus();
                win.down('form').getForm().loadRecord(record);
                win.unidadTiempo.setValue(data.unidadtiempo?parseInt(data.unidadtiempo):1);
                win.unidadTiempo.resetOriginalValue();
                var calculada=win.fechaEstimada.getValue();
                if(data.fechafin && data.fechafin!=calculada){
                    win.fechaEstimada.setValue(data.fechafin);
                    win.fechaEstimada.resetOriginalValue();
                    win.fechaEstimada.modificadaManual=true;
                    if(calculada)
                        win.calcularFechaEstimada.setDisabled(false);
                }
                win.fechaEstimada.validate();
                if(data.periodicidad){
                    win.vigencia.setDisabled(true);
                    win.unidadTiempo.setDisabled(true);
                }else if(data.vigencia){
                    win.cmbIguala.setDisabled(true);
                }
                if(data.indicadores)
                    if(data.indicadores.length>0) {
                        if(btn.action == 'replicarhito'){
                            for(var i in data.indicadores){
                                data.indicadores[i]['idindicadorcontrato']='';
                            }
                        }
                        win.productosservicios.getStore().loadData(data.indicadores);
                        win.productosservicios.getStore().commitChanges();
                    }
                if(typeof arrayPago!='string')
                    Ext.each(arrayPago, function(value, index){
                        if(win.down('#montomoneda_'+value['moneda'].toLowerCase())){
                            win.down('#montomoneda_'+value['moneda'].toLowerCase()).setValue(value.monto);
                            win.down('#montomoneda_'+value['moneda'].toLowerCase()).resetOriginalValue();
                            if(btn.action == 'edithito')
                                win.down('#montomoneda_'+value['moneda'].toLowerCase()).idmonedahito=value.idmonedahito;
                            // win.down('#montomoneda_'+value['moneda'].toLowerCase()).introducidoManual=true;
                        }
                    });
                if(btn.action == 'replicarhito'){
                    win.numero.setValue('');
                    win.numero.resetOriginalValue();
                }
            } else {
                setTimeout(function () {
                    win.first.focus();
                }, 10);
                if(me.getGridProducto().getStore().dataCargada){
                    win.productosservicios.getStore().loadData(me.getGridProducto().getStore().dataCargada);
                    win.productosservicios.getStore().commitChanges();
                }
            }
            if(wincontrato.fechafirma && wincontrato.fechafirma.getValue())
                win.fechaEstimada.setMinValue(wincontrato.fechafirma.getValue());
        });
    },

    delHito: function () {
        var grid = this.getGridHitoPago(),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection(),
            msg = this.etiquetas.msgDelConfirm;

        if (records.length == 1) {
            msg = msg.getSingular('m').get(this.etiquetas.lbHitoPago.toLowerCase());
        } else {
            msg = msg.getPlural('m').get(this.etiquetas.lbHitosPago.toLowerCase());
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    store.remove(records);
                    var hitos=store.getRange();
                    if(hitos.length!=0){
                        var cont=1;
                        hitos.forEach(function(x){
                            x.set('numero', cont);
                            cont++;
                        });
                    }
                    aa=store.getRemovedRecords()
                    store.fireEvent('removeall', store);
                    Ext.each(grid.up('window').extrafields, function (value, index) {
                        if(grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
                            // if(!grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).introducidoManual)
                                grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
                        }
                    })
                    grid.up('window').formaPago.comprobarValidezMontos();
                    store.fireEvent('update', store);
                    if(grid.up('window').formaPago) {
                        grid.up('window').formaPago.cambiarMontosPorHitosIndicadores();
                    }else{
                        win.gridproducto.up('window').cambiarMontosPorHitosIndicadores();
                    }
                }
            }
        });

    },

    delProdServ: function (btn) {
        var grid = btn.up('gridpanel'),
            store = grid.getStore(),
            records = grid.getSelectionModel().getSelection(),
            msg = this.etiquetas.msgDelConfirm;

        if (records.length == 1) {
            msg = msg.getSingular('m').get(this.etiquetas.lbProdServSingular.toLowerCase());
        } else {
            msg = msg.getPlural('m').get(this.etiquetas.lbProdServ.toLowerCase());
        }

        Ext.Msg.grid = grid;
        Ext.Msg.show({
            title: this.etiquetas.titleConfirm,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            icon: Ext.MessageBox.QUESTION,
            scope: this,
            fn: function (btn) {
                if (btn === 'ok') {
                    store.remove(records);
                    Ext.each(grid.up('window').extrafields, function (value, index) {
                        if(grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase())){
                            // if(!grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).introducidoManual)
                                grid.up('window').down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
                        }
                    })
                    store.fireEvent('update', store);
                    if(grid.up('window').formaPago) {
                        grid.up('window').formaPago.cambiarMontosPorHitosIndicadores();
                        grid.up('window').formaPago.comprobarValidezMontos();
                    }else if(Ext.isFunction(grid.up('window').cambiarMontosPorHitosIndicadores)){
                        grid.up('window').cambiarMontosPorHitosIndicadores();
                    }
                }
            }
        });

    },

    calcTotal: function (store) {
        var cant = store.getCount(),
            records = store.getRange(),
            total = 0,
            temp = new Array(),
            valores={};
            tabFormaPago=this.getFormaPago();
        Ext.each(records, function (record) {
            valores[record.get('moneda')]=valores[record.get('moneda')]?
                valores[record.get('moneda')]+=record.data.monto:record.data.monto;
            total += record.data.monto;
            temp.push(record.data);
        });
        temp = Ext.encode(temp);
        if (store.originalValue && store.originalValue != temp) {
            store.isDirty = true;
            if(tabFormaPago)
                tabFormaPago.hfdirtygrids.setValue('dirty');
        } else {
            store.isDirty = false;
        }
        if(tabFormaPago){
            Ext.Object.each(tabFormaPago.extrafields, function (key, value) {
                if(tabFormaPago.down('#montomoneda_'+value.codigoiso.toLowerCase())){
                    tabFormaPago.down('#montomoneda_'+value.codigoiso.toLowerCase()).validate();
                }
            });
        }
    },

    createKeyMap: function (grid) {
        var window = grid.up('window'),
            tabpanel = grid.up('tabpanel');

        if(window) {
            if (!window.keyMap) {
                window.keyMap = new Ext.util.KeyMap({
                    target: Ext.getBody()
                });
            }

            var binding = [{
                key: Ext.EventObject.DELETE,
                fn: function () {
                    var btn = grid.btnDel;
                    if (btn.disabled || tabpanel.getActiveTab().id != grid.id) {
                        return;
                    }
                    btn.fireEvent('click', btn);
                }
            }];

            window.keyMap.addBinding(binding);
        }
    },

    setOriginalValue: function (store) {
        var cant = store.getCount(),
            records = store.getRange(0, cant - 1),
            temp = new Array();
        Ext.each(records, function (record) {
            //se marcan como dirty para adcionarselos al suplemento del contrato
            if (this.getMainWindow() && this.getMainWindow().addsuplemento) {
                record.dirty = true;
            }
            temp.push(record.data);
        }, this);
        store.originalValue = Ext.encode(temp);
    },

    setHeight: function () {
        var h1 = this.getFormaPago().initialConfig.height,
            h2 = this.getFormaPago().tabpanel.initialConfig.height,
            c1 = this.getFormaPago().hitopago.getStore().getCount(),
            c2 = this.getFormaPago().indicadores.getStore().getCount(),
            p1 = c1 * 90,
            p2 = c2 * 21,
            p = p1 > p2 ? p1 : p2;

        this.getFormaPago().tabpanel.setHeight(h2 + p);
    },

    onRemove: function (store, record) {
        var id = store.proxy.reader.idProperty;
        if (!store.removedRecords) {
            store.removedRecords = new Array();
        }
        if (record.data[id]) {
            store.removedRecords.push(record);
        }
        var temp = this.obtenerEncodeStore(record);
        if (!store.grid.up('window').formaPago) {
            return;
        }
        if (store.originalValue && store.originalValue != temp) {
            store.grid.up('window').formaPago.hfdirtygrids.setValue('dirty');
            store.isDirty = true;
        } else {
            store.grid.up('window').formaPago.hfdirtygrids.reset();
            store.grid.up('window').formaPago.fireEvent('validitychange');
            store.isDirty = false;
        }
    },
    obtenerEncodeStore:function(records){
        var temp=[];
        Ext.each(records, function (record) {
            temp.push(record.data);
        }, this);
        return Ext.encode(temp);
    },
    setAsCero: function (field) {
        var value = field.getValue();

        if (!value) {
            field.setValue(0);
        }
    },

    onBeforeLoadTipoPrecio: function (store) {
        var clienteproveedor = Ext.ComponentQuery.query('co_mainwindowContratacionimportacion hidden[name=idclienteproveedor]')[0],
            idclienteproveedor = null;
        if (clienteproveedor) {
            idclienteproveedor = clienteproveedor.getValue();
        }
        store.proxy.extraParams.idclienteproveedor = idclienteproveedor;
    },

    onLoadTipoPrecio: function (store, records) {
        var window = this.getWindowProducto(),
            combo = window.cmbTipoPrecio,
            defecto = null;

        Ext.each(records, function (record) {
            if (record.data.pordefecto == 1) {
                defecto = record;
                return false;
            }
        });

        combo.select(defecto);
    },

    onChangeTipoPrecio: function (combo, value) {
        var window = this.getWindowProducto(),
            grid = window.grid,
            store = grid.getStore();

        store.proxy.extraParams.idtipoprecio = value;
        store.load();
    },

    resetTipoPrecio: function (store) {
        var window = this.getWindowProducto();
        if(window){
            combo = window.cmbTipoPrecio;
            value = combo.getValue();
            if (!value)
                store.proxy.extraParams.idtipoprecio = -1;
        }

    },

    importarExcel: function(button){
        console.log('importar excel 4')
        var me=this;
        var win=Ext.create('Ext.window.Window',{
            title:' Importar datos',
            minHeight: null,
            minWidth: null,
            width: 450,
            height: 230,
            layout:'fit',
            constrain:true,
            modal:true,
            resizable:false,
            items:[
                Ext.create('Ext.ux.CustomForm',
                {
                    layout:'anchor',
                    items:[
                        {
                            xtype: 'fieldset',
                            title: 'Formato del documento a importar',
                            anchor: '100%',
                            layout: 'fit',
                            border:1,
                            items:[
                                {
                                    xtype:'image',
                                    anchor: '100%',
                                    // height: 200,
                                    src: '/crm/application/views/images/formatoExcelImportarProductos.png',
                                },
                            ]
                        },
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            anchor: '100%',
                            items:[
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Moneda a utilizar',
                                    name: 'moneda',
                                    // labelAlign: 'left',
                                    labelWidth: 110,
                                    valueField: 'idmoneda',
                                    displayField: 'codigoiso',
                                    itemId: 'moneda',
                                    width: 140,
                                    margin: '0 5 0 0',
                                    anchor: '100%',
                                    editable: false,
                                    allowBlank: false,
                                    listConfig: {
                                        loadingText: me.etiquetas.msgLoading,
                                        emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgNoDataLoaded + '</div>'
                                    },
                                    tpl: Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '<div class="x-boundlist-item">' +
                                        '{codigoiso} ({nombremoneda})' +
                                        '</div>',
                                        '</tpl>'
                                    ),
                                    store: button.up('grid').monedasentidad?
                                        Ext.create('Ext.data.Store',{
                                            fields: [
                                                'codigoiso', 'idmoneda', 'nombremoneda', 'idpais',
                                                'organizacion', 'simbolo', 'factorredondeo'
                                            ],
                                            data: button.up('grid').monedasentidad
                                        }):
                                        Ext.create('Ext.data.Store', {
                                            fields: [
                                                'codigoiso', 'idmoneda', 'nombremoneda', 'idpais',
                                                'organizacion', 'simbolo', 'factorredondeo'
                                            ],
                                            proxy: {
                                                type: 'ajax',
                                                url: UtilsFn.buildUrl({action: 'getMonedas'}, ModuleMgr.get('OfertaNegocioImportacion')),
                                                reader: {
                                                    root: 'data',
                                                    totalProperty: 'total',
                                                    successProperty: 'success'
                                                }
                                            },
                                        }),
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: 'Excel a importar',
                                    flex: 1,
                                    name: 'excel',
                                    allowBlank: false,
                                    anchor:'100%',
                                    // margin: '0 0 0 0',
                                    emptyText:'Seleccione el excel',
                                    buttonText: '',
                                    buttonConfig: {
                                        iconCls: 'icondistra-subirfichero icon-fileupload'
                                    },
                                    validator: function(value){
                                        var aux=value.split('.');
                                        if(['xls', 'xlsx', 'XLS', 'XLSX'].indexOf(aux[aux.length-1])==-1)
                                            return 'Sólo se admiten los siguientes formatos: xls, xlsx.';
                                        return true;
                                    }
                                }
                            ]
                        }
                    ],
                    listeners:{
                        validitychange: function(yo, valid){
                            win.down('#aceptar').setDisabled(!valid);
                        }
                    }
                })
            ],
            buttons:[
                {
                    text: (this.etiquetas && this.etiquetas.lbBtnCancel) ? this.etiquetas.lbBtnCancel : 'Cancelar ',
                    tooltip: (this.etiquetas && this.etiquetas.qtipCancel) ? this.etiquetas.qtipCancel : 'Cancelar ',
                    iconCls: 'cancelar',
                    handler: function(){
                        win.close();
                    }
                },
                {
                    text: (this.etiquetas && this.etiquetas.lbBtnAccept) ? this.etiquetas.lbBtnAccept : 'Aceptar ',
                    tooltip: (this.etiquetas && this.etiquetas.qtipAccept) ? this.etiquetas.qtipAccept : 'Aceptar ',
                    itemId: 'aceptar',
                    disabled: true,
                    iconCls: 'aceptar',
                    handler: function(){
                        win.close();
                    }
                }
            ]
        });
        win.show(null, function(){
            if(button.up('gridproductoimportacion').monedasUsadas && button.up('gridproductoimportacion').monedasUsadas.length==1){
                win.down('#moneda').setValue(button.up('gridproductoimportacion').monedasUsadas[0]['idmoneda']);
            }
            win.down('#aceptar').setHandler(function(){
                if(win.down('form').getForm().isValid()){
                    Ext.MessageBox.show({
                        msg: me.etiquetas.lbImportandoDatos,
                        width: 300,
                        wait: true,
                        waitConfig: {interval: 200}
                    });
                    win.down('form').getForm().submit({
                        url: UtilsFn.buildUrl({action: 'importarDatosExcel'}, me),
                        // params: params,
                        success: function (form, action) {
                            Ext.MessageBox.hide();
                            var result = Ext.decode(action.response.responseText);
                            // button.up('grid').getStore().loadData(result.data);
                            if(result && result.count>0){
                                console.log('data',result.data.length);
                                // var respuesta=me.comprobarExistenciaProductos(button.up('window'), response.data);
                                var respuesta={'existen': [], 'noExisten': []},
                                    winSolicitud=button.up('window'),
                                    params={idtipoprecio: -1, idnaturaleza: result.naturaleza};
                                if(winSolicitud.sflinea && winSolicitud.sflinea.getValue())params['node']=winSolicitud.sflinea.getValue();
                                // Ext.MessageBox.show({
                                //     msg: me.etiquetas.lbComprobandoDatos,
                                //     width: 300,
                                //     wait: true,
                                //     waitConfig: {interval: 200}
                                // });
                                // idtipoprecio: -1
                                // idnaturaleza: 1000261
                                // node: 431654
                                if(button.up('grid').comprobarProductos) {
                                    var datos = button.up('grid').getStore().getRange();
                                    console.log('solicitud:', datos)
                                    // Ext.Ajax.request({
                                    //     url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContratoImportacion')),
                                    //     params: params,
                                    //     success: function (response) {
                                    //         Ext.MessageBox.hide();
                                    //         var datos = Ext.decode(response.responseText);
                                    // console.log('datos->', datos.length)
                                    result.data.forEach(function (x) {
                                        var existe = false;
                                        // datos.data.forEach(function(y){
                                        //     if(x['codigo']==y['codigoproveedor']){
                                        //         x['tipo']=1;
                                        //         respuesta['existen'].push(x);
                                        //         existe=true;
                                        //         return false;
                                        //     }
                                        // });
                                        var existe = false;
                                        indicador = null;
                                        datos.forEach(function (y) {
                                            if (x['codigo'] == y.get('codigo')) {
                                                existe = true;
                                                indicador = y.get('idindicador');
                                            }
                                        });
                                        if (existe) {
                                            // x['tipo'] = 1;
                                            x['idindicador'] = indicador;
                                            x['codigo'] = x['codigo'];
                                            respuesta['existen'].push(x)
                                        } else
                                            respuesta['noExisten'].push(x)
                                    });
                                    mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente.');

                                    if (respuesta['noExisten'].length > 0) { //354
                                        var winNoExisten = Ext.create('Ext.window.Window', {
                                            title: 'Información',
                                            width: 900,
                                            resizable: true,
                                            modal: true,
                                            constrain: true,
                                            autoScroll: true,
                                            maxHeight: window.innerHeight - 100,
                                            items: [
                                                {
                                                    xtype: 'panel',
                                                    tpl: new Ext.XTemplate(
                                                        '<div class="solicitudneogico-item">',
                                                        '<b>Existen ' + respuesta['noExisten'].length + ' productos que no pueden ser importados por no encontrarse entre los productos solicitados. ' +
                                                        'Debe añadirlos al excel y volver a importarlo.<br></b>',
                                                        '</div>',
                                                        '<div class="solicitudneogico-columnheader">',
                                                        '<div style="width:25%;"><label>' + me.etiquetas.lbCodigo + '</label></div>',
                                                        '<div style="width:75%;"><label>' + me.etiquetas.lbDescripcion + '</label></div>',
                                                        '</div>',
                                                        '<tpl for=".">',
                                                        '<div class="solicitudnegocio-row">',
                                                        '<div style="width:25%"><span>{codigo}</span></div>',
                                                        '<div style="width:75%"><span>{denominacion}</span></div>',
                                                        '</div>',
                                                        '</tpl>'
                                                    )
                                                }
                                            ],
                                            buttons: [
                                                {
                                                    text: me.etiquetas.lbCerrar,
                                                    tooltip: me.etiquetas.qtipCerrar,
                                                    iconCls: 'cerrar',
                                                    handler: function () {
                                                        winNoExisten.close();
                                                    }
                                                }
                                            ]
                                        });
                                        winNoExisten.show(null, function () {
                                            winNoExisten.down('panel').update(respuesta['noExisten'])
                                        })
                                    }
                                }else{
                                    respuesta['existen']=result.data;
                                    mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente.');
                                }
                                console.log('existen', respuesta['existen'].length, respuesta['existen'])
                                if (respuesta['existen'].length > 0) { //7
                                    var field = win.down('form').getForm().findField('moneda');
                                    var montoIndex = '';
                                    button.up('grid').columns.forEach(function (x) {
                                        if (x.dataIndex.indexOf('monto') == 0) {
                                            console.log(x.dataIndex)
                                            if (x.dataIndex != 'montomoneda_' + field.getRawValue().toLowerCase() + '_' + field.getValue())
                                                x.hide();
                                            else {
                                                montoIndex = 'montomoneda_' + field.getRawValue().toLowerCase() + '_' + field.getValue();
                                                x.show();
                                            }
                                        }
                                    });
                                    console.log(montoIndex)
                                    respuesta['existen'].forEach(function (x) {
//                                         console.log(x)
                                        x[montoIndex] = x['precio'];
                                        x['tipo'] = 1;
                                    })
                                    button.up('grid').getStore().loadData(respuesta['existen']);
                                    button.up('grid').getStore().fireEvent('update', button.up('grid').getStore());

                                }
                                // console.log(result['diccionario'])
                                var keys=[], falta=[];
                                Ext.Object.each(result['diccionario'], function(key, value){
                                    console.log(key, value)
                                    keys.push(key);
                                })
                                // console.log('keys:', keys)
                                if(keys.indexOf('codigo')==-1)falta.push('código');
                                if(keys.indexOf('denominacion')==-1)falta.push('descripción');
                                if(keys.indexOf('cantidad')==-1)falta.push('cantidad');
                                if(keys.indexOf('precio')==-1)falta.push('precio');
                                // console.log('falta:', falta)
                                if(falta.length>0)mostrarMensaje(2, 'No se encontraron los siguientes atributos:<br>-'+falta.join('<br>-'),
                                    function (response) {
                                        if (response === 'ok') {}})
                                win.close();
                                //     },
                                //     failure: function (response) {
                                //         // respuesta['existen']=importados;
                                //     }
                                // });
                            }
                        },
                        failure: function (form, action) {
                            Ext.MessageBox.hide();
                        }
                    });
                }
            });
        });
    },

    comprobarExistenciaProductos: function(win, importados){
        var respuesta={'existen': [], 'noExisten': []},
            params={idtipoprecio: -1, idnaturaleza: win.idnaturaleza};
        if(win.sflinea.getValue())params['node']=win.sflinea.getValue();
        Ext.Ajax.request({
            url: UtilsFn.buildUrl({action: 'getProducto'}, ModuleMgr.get('GestionContratoImportacion')),
            params: params,
            success: function (response) {
                var datos = Ext.decode(response.responseText);
                console.log('datos->', datos)
                importados.forEach(function(x){
                    var existe=false;
                    datos.forEach(function(y){
                        if(x['codigo']==y['codigo']){
                            x['idindicador']=y['idindicador'];
                            respuesta['existen'].push(x);
                            existe=true;
                            return false;
                        }
                    });
                    if(existe==false)respuesta['noExisten'].push(x);
                });
                console.log('respuesta', respuesta)
                return respuesta;
            },
            failure: function (response) {
                respuesta['existen']=importados;
                return respuesta;
            }
        });
    },

    onGridMoraSelect: function(yo, selected){
        var grid=this.getGridMora();
        grid.btnDel.setDisabled(selected.length==0);
    },

    onClickGridMora: function (myButton, e, eOpts) {
        var me = this,
            grid=me.getGridMora();
        switch (myButton.action) {
            case 'addmora':
                if(me.validoGridMora()){
                    grid.getStore().add({'moneda':'', 'porciento': '', 'dias':'', 'maximo':''});
                }else{
                    mostrarMensaje(8, 'Existen moras con campos inv&aacute;lidos.');
                }
                break;
            case 'delmora':
                var seleccionados=grid.getSelectionModel().getSelection();
                seleccionados.forEach(function(x){
                    if(x.get('idmora'))grid.idAEliminar.push(x.get('idmora'));
                });
                grid.getStore().remove(seleccionados);
                break;
        }
    },
    validoGridMora: function(){
        var me=this,
            grid=me.getGridMora(),
            valido=true;
        grid.getStore().getRange().forEach(function(x){
            if(x.get('moneda')=='' || x.get('porciento')=='' || x.get('dias')=='' || x.get('maximo')=='')
                valido=false;
        })
         return valido;
     },
    getProductos: function(){
        var me=this, store=me.getGridProducto().getStore(), result=[];
        Ext.each(store.getRange(), function (valor) {
            var cloneRecord = valor.copy();
            Ext.data.Model.id(cloneRecord);
            // cloneRecord.data.datos_json = Ext.decode(cloneRecord.data.datos_json);
            result.push(cloneRecord.data);
        })
        // console.log('getProductos:', result)
        return result;
    },
    exportarExcel: function(button){
        var me=this, productos=[];
        me.getProductos().forEach(function(x){
            datos={
                'codigo': x['codigo'],
                'denominacion': x['denominacion'],
                'cantidad': x['cantidad'],
                'precio': 0
            };
            var tipomoneda=x['fechaconversion']?'montomonedaconversion':'montomoneda';
            if(button.up('grid').monedasUsadas && button.up('grid').monedasUsadas.length>0){
                moneda=button.up('grid').monedasUsadas[0];
                console.log(tipomoneda+'_'+moneda['codigoiso'].toLowerCase()+'_'+moneda['idmoneda'], x[tipomoneda+'_'+moneda['codigoiso'].toLowerCase()+'_'+moneda['idmoneda']])
                datos['precio']=x[tipomoneda+'_'+moneda['codigoiso'].toLowerCase()+'_'+moneda['idmoneda']];
            }
            productos.push(datos);
        })
        console.log('productos:', productos)
        window.open(document.location.protocol + '//' + document.location.host +
            UtilsFn.buildUrl({action: 'exportarDatosExcel'}, me)+
            '?productos=' +Ext.encode(productos));
        // Ext.Ajax.request({
        //     url: UtilsFn.buildUrl({action: 'exportarDatosExcel'}, me),
        //     method  : 'POST',
        //     params: {'productos': Ext.encode(me.getProductos())},
        //     callback: function (options, success) {
        //         console.log('resulto')
        //         var iframe = document.createElement("iframe");
        //         iframe.src = document.location.protocol + '//' + document.location.host +
        //             UtilsFn.buildUrl({action: 'exportarDatosExcel'}, me)+
        //             '?productos=' +Ext.encode(me.getProductos());
        //         iframe.style.display = 'none';
        //         // iframe.onload = function () {
        //         //     PVD.ocultarMascara('idmaskdescuentos');
        //         // };
        //         document.body.appendChild(iframe);
        //         mostrarMensaje(1, 'Exportado.')
        //     }
        // });
    },
    tasaCambio: function(button){
        var me=this;
        // var win=Ext.create('Ext.ux.WindowTasaCambio');
        var win=Ext.create('Ext.ux.CustomWindow', {
            title: 'Aplicar tasa de cambio',
            width: 320,
            minWidth: null,
            minHeight: null,
            resizable: false,
            items: [
                {
                    xtype: 'combo',
                    fieldLabel: 'Convertir a',
                    labelAlign: 'top',
                    valueField: 'idmoneda',
                    displayField: 'codigoiso',
                    itemId: 'moneda',
                    flex: 1,
                    margin: '5 10 10 10',
                    anchor: '100%',
                    editable: false,
                    allowBlank: false,
                    listConfig: {
                        loadingText: me.etiquetas.msgLoading,
                        emptyText: '<div class="x-grid-empty">' + me.etiquetas.msgNoDataLoaded + '</div>'
                    },
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">' +
                        '{codigoiso} ({nombremoneda})' +
                        '</div>',
                        '</tpl>'
                    ),
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'codigoiso', 'idmoneda', 'nombremoneda', 'idpais',
                            'organizacion', 'simbolo', 'factorredondeo'
                        ],
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getMonedas'}, ModuleMgr.get('OfertaNegocioImportacion')),
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        },
                    }),
                    listeners:{
                        select: function(yo, records){
                            win.down('#gridtasas').setVisible(true);
                            var store=win.down('#gridtasas').getStore();
                            // if (store.isLoading()) {
                            //     Ext.Ajax.abort(store.proxy.activeRequest);
                            //     delete store.proxy.activeRequest;
                            // }
                            store.proxy.extraParams.idmoneda=yo.getValue();
                            store.load();
                        }
                    }
                },
                // {
                //     xtype: 'textfield',
                //     fieldLabel: 'Factor de conversión',
                //     labelAlign: 'top',
                //     name: 'factorconversion',
                //     readOnly: true,
                //     flex: 1,
                //     margin: '5 10 0 5'
                // }
                {
                    xtype: 'grid',
                    title: 'Tasas de conversión',
                    itemId: 'gridtasas',
                    anchor: '100%',
                    maxHeight: 200,
                    hidden: true,
                    margin: '0 10 10 10',
                    columnLines: true,
                    emptyText: 'No tiene tasas de conversión',
                    columns: [
                        {text: 'Tasa', dataIndex: 'nombretasa', flex: 1,
                            renderer: function (value, meta) {
                                if (value) {
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                }
                                return value;
                            }},
                        {text: 'De', dataIndex: 'monedainicial', width: 40,
                            renderer: function (value, meta) {
                                if (value) {
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                }
                                return value;
                            }},
                        {text: 'A', dataIndex: 'monedafinal', width: 40,
                            renderer: function (value, meta) {
                                if (value) {
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                }
                                return value;
                            }},
                        {text: 'Conversión', /*tooltip: 'Factor de conversión',*/ dataIndex: 'venta', width: 70, align: 'right',
                            renderer: function (value, meta, record) {
                                if (value) {
                                    meta.tdAttr = 'data-qtip="' + value + '"';
                                }
                                return value;
                            }},
                    ],
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            'codigoiso', 'idmoneda', 'idmonedacontable', 'idtasa',
                            'monedainicial', 'monedafinal', 'idmonedainicial', 'idmonedafinal',
                            'factordeconversion', 'nombretasa', 'factorredondeo', 'compra', 'venta'
                        ],
                        proxy: {
                            type: 'ajax',
                            url: UtilsFn.buildUrl({action: 'getTasasMoneda'}, ModuleMgr.get('OfertaNegocioImportacion')),
                            reader: {
                                root: 'data',
                                totalProperty: 'total',
                                successProperty: 'success'
                            }
                        },
                        listeners:{
                            beforeload: function(){
                                win.btnAceptar.setDisabled(true);
                            },
                            load: function(yo, records, success){
                                if(success){
                                    win.btnAceptar.setDisabled(records.length==0);
                                }
                            }
                        }
                    }),
                }
            ],
            listeners: {
                render: function(yo){
                    yo.btnAceptar.setHandler(function(){
                        var store=win.down('#gridtasas').getStore(),
                            gridproducto=button.up('grid'),
                            storeproductos = gridproducto.getStore(),
                            nuevascolumnas=[], nuevosfields=[],
                            tasas=[];
                        storeproductos.model.getFields().forEach(function(x){
                            nuevosfields.push(x.name);
                        })
                        // console.log(store.getRange())
                        // console.log(nuevosfields)
                        Ext.each(gridproducto.columns,function(x, i){
                            // console.log(x.hidden, x)
                            if(x.dataIndex.indexOf('monto')==0){
                                var aux = x.dataIndex.split('_');
                                if(x.hidden==false) {
                                    // monedainicial idmonedacontable  /
                                    var record = store.findRecord('idmonedainicial', aux[2], 0, true, true, true);
                                    // console.log('record', aux, record)
                                    if (record) tasas.push(record.data);
                                }
                                if(aux[2]==win.down('#moneda').getValue()){
                                    // x.show();
                                    var index = 'montomonedaconversion_' + win.down('#moneda').getRawValue().toLowerCase()+'_'+win.down('#moneda').getValue(),
                                        fields = storeproductos.model.getFields();
                                    if(nuevosfields.indexOf(index)==-1) {
                                        // console.log(index, fields.length, nuevosfields)
                                        nuevosfields.push(index);
                                        fields.push({name: index, type: 'float', defaultValue: 0});
                                        storeproductos.model.setFields(fields);
                                    }
                                    if(gridproducto.findColumna(index)){
                                        gridproducto.showColumna(index);
                                    }

                                }
                            }
                        })
                        if(tasas.length>0){
                            var fields = storeproductos.model.getFields();
                            if(nuevosfields.indexOf('idtasa')==-1)fields.push({name: 'idtasa'});
                            if(nuevosfields.indexOf('venta')==-1)fields.push({name: 'venta'});
                            storeproductos.model.setFields(fields);
                        }
                        tasas.forEach(function(tasa){
                            gridproducto.getStore().getRange().forEach(function(x){
                                x.set('montomonedaconversion_'+tasa['monedafinal'].toLowerCase()+'_'+tasa['idmonedafinal'],  x.get('montomoneda_'+tasa['monedainicial'].toLowerCase()+'_'+tasa['idmonedainicial']) * tasa['venta']);
                                x.set('idtasa', tasa['idtasa']);
                                x.set('venta', tasa['venta']);
                                x.set('fechaconversion', new Date());
                                x.set('idmonedaoriginal', tasa['idmonedainicial']);
                                x.set('tasas', tasas);
                            })
                        })
                        mostrarMensaje(1, 'Las conversiones se han realizado satisfactoriamente.')
                        win.close();
                    })
                }
            }
        });
        win.show();
    }

});

























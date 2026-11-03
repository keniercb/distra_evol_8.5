/**
 * Created by Daniel on 15/11/2016
 */
Ext.ns('LOG.aft.apertura');
LOG.aft.apertura.VentanaAdd = Ext.extend(LOG.util.Window, {
    idioma:undefined,
    modelo:undefined,
    record:undefined,
    listaEliminar:undefined,
    listaEliminarRN:undefined,
    iddocapertura:undefined,
    RecordEstructura:undefined,
    tipo:0,
    estado:1,
    constructor: function (config) {
        this.listaEliminar = new LOG.util.List();
        this.listaEliminarRN = new LOG.util.List();
        LOG.aft.apertura.VentanaAdd.superclass.constructor.call(this, config);
        if(!this.modelo){
            this.modelo = new LOG.aft.apertura.Model({
                idioma:this.idioma
            });
        }
        this.listaBotones.getItem(2).disable();
        this.buildComponent();
        this.height = 600;
        this.width = 800;
        RecordEstructura = Ext.data.Record.create([
            {name: "idfila"},
            {name: "text"}
        ]);
    },
    buildComponent:function(){
        var _this = this;
        this.panelSuperior = new LOG.util.Panel({
            region:'north',
            labelAlign:'top',
            frame:true,
            expandible:true,
            autoHeight:true
        });
        this.comboEstructuras = new LOG.util.ComboBox({
            name : 'destino' ,
            autoLoad: false,
            url : '/logistica/activos_fijos/documento/index.php/aperturaaft/cargarEstructuras',
            displayField : 'text',
            valueField : 'idfila',
            width:500,
            //editable:false,
            queryParam:'criterio',
            fieldLabel : this.idioma.lbDestino,
            allowBlank : false,
            mode:'remote',
            enableKeyEvents: true,
            minChars:1,
            pageSize : 15,
            resizable:true,
            listeners:{
                select:function(){
                    _this.validar()
                }
            }
        });
        this.taDescripcion = new Ext.form.TextArea({
            fieldLabel:this.idioma.lbDescripcion,
            anchor:'98%',
            enableKeyEvents: true,
            listeners:{
                keyup:function(){
                    _this.validar();
                }
            }
        });
        this.formPrincipal = new LOG.util.UIManager.initForm({
            labelAlign:'top',
            items:[this.comboEstructuras, this.taDescripcion ]
        });
        this.panelSuperior.add(this.formPrincipal);
        this.gridMedios = new LOG.aft.apertura.GridMedios({
            idioma : this.idioma,
            acciones:_this.acciones,
            autoLoad:false,
            iddocapertura:(this.iddocapertura)?this.iddocapertura:undefined,
            tipo:this.tipo,
            estado:this.estado
        });
        this.gridMedios.init();
        this.panelMedios = this.gridMedios.view();
        this.panelMedios.on({
            editmedio:function(rec){
            _this.modelo.adicionarMedio(rec.data);
            _this.validar()
        }
        });
        this.gridMedios.setModelo(this.modelo);
        this.add(this.panelSuperior);
        this.add(this.panelMedios);
        this.gridMedios.getStorePrincipal().on({
            add:function(st, records, index){
                _this.validar();
            },
            remove:function(st, record, index){
                if(record.data.idaperturaregnum && record.data.idaperturaregnum !=''){
                    _this.listaEliminar.add(record.data.idaperturaregnum );
                    _this.listaEliminarRN.add(record.data.idregnumerico );
                }
                _this.modelo.eliminarMedio(record.data);
                _this.validar();
            }
        });
        this.fireEvent = this.fireEvent.createSequence(function(e) {
            if(e=='resize'){
                _this.gridMedios.anchoPadre = _this.getWidth();
                _this.gridMedios.altoPadre = _this.getHeight();
            }
        });
    },
    aceptarFn: function(){
        var _this = this;
        var param = {};
        if(this.record){
            param['iddocapertura'] = (this.record)?this.record.data.iddocapertura:null;
            param['estadoreceptor'] = (this.record)?this.record.data.estadoreceptor:null;
        }
        param['destino'] = this.comboEstructuras.getValue();
        param['descripcion'] = this.taDescripcion.getValue();
        param['mediosadicionados'] = (this.modelo.listaProductos.count()>0)?Ext.encode(this.modelo.listaProductos.getArray()):null;
        param['medioseliminado'] =  (this.listaEliminar.count()>0)?Ext.encode(this.listaEliminar.getArray()):null;
        param['medioseliminadosrn'] =  (this.listaEliminarRN.count()>0)?Ext.encode(this.listaEliminarRN.getArray()):null;
        this.modelo.salvar(param,function(resp){
            _this.listaEliminar.deleteAll();
            _this.listaEliminarRN.deleteAll();
            _this.modelo.listaProductos.deleteAll();
        });
    },
    validar:function(){
        this.listaBotones.getItem(2).disable();
        if(this.comboEstructuras.isValid() && this.taDescripcion.isValid() ){
            if(this.record && this.isDirty()){
                this.listaBotones.getItem(2).enable();
            }
            else if ( this.modelo.listaProductos.count() > 0){
                this.listaBotones.getItem(2).enable();
            }
        }
    },
    isDirty:function(){
        if(this.record && (this.comboEstructuras.getValue()!= this.record.data.destino
            || this.taDescripcion.getValue()!= this.record.json.descripcion
            || this.modelo.listaProductos.count() > 0 || this.listaEliminar.count()>0)
            && this.gridMedios.getStorePrincipal().getCount()>0){
            return true;
        }
        return false;
    },
    onShowHandler:function(){
        LOG.aft.apertura.VentanaAdd.superclass.onShowHandler.call(this);
        if(this.tipo == 0){
            if(!this.record)
               this.comboEstructuras.enable();
        }
        else if (this.tipo == 1){
            this.comboEstructuras.disable();
        }
        this.modelo.reset();
        this.listaEliminar.deleteAll();
        this.modelo.listaProductos.deleteAll();
        this.gridMedios.getStorePrincipal().load();
    },
    datosModificar:function(rec){
        var _this = this;
        this.record = rec;
        var recEstruct = new RecordEstructura({idfila:rec.json.destino, text:rec.json.denomdestino});
        this.comboEstructuras.store.add(recEstruct);
        this.comboEstructuras.setValue(rec.json.destino);
        this.taDescripcion.setValue(rec.json.descripcion);
        if(this.tipo == 0 && rec.data.estadoemisor > 1){
            this.comboEstructuras.disable();
            if(rec.data.estadoemisor == 3){
                _this.gridMedios.setEstado(3);
            }
        }
        if(this.tipo == 1 && rec.data.estadoreceptor >1){
            this.comboEstructuras.disable();
            this.taDescripcion.disable();
            /*if(rec.data.estadoreceptor >= 2){
                _this.gridMedios.getGridPrincipal().setEditable(false);
            }*/
        }
    }
});

LOG.aft.apertura.GridMedios = Ext.extend(LOG.util.UITemplate,{
    idestructura:undefined,
    iddocapertura:undefined,
    tipo:0,
    estado:1,
    anchoPadre:undefined,
    altoPadre:undefined,
    excluir:undefined,
    constructor: function(config) {
        this.formaVisualizacion  = 'panel';
        this.busquedaBasica      = false;
        config.busquedaAvanzada  = false;
        this.modoSeleccion       = 2;
        this.autoLoad            = false;
        this.panelBotonesVisible = true;
        this.dirController       = '/logistica/activos_fijos/documento/index.php/aperturaaft';
        this.urlBusquedaGridPrincipal = 'cargarMediosDoc';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.aft.apertura.Idioma);
        this.concepto = this.idioma.ttBuscarMedios;
        this.textBusquedaSimple = this.idioma.tlCodigoDeno;
        this.idGridPrincipal = (config.idGridPrincipal)?config.idGridPrincipal:'idaperturaregnum';
        LOG.aft.apertura.GridMedios.superclass.constructor.call(this,config);
        this.excluir = new Array();
        if(this.tipo == 1 && this.estado < 2){
            this.gridEditable = true;
            this.addEvents('editmedio');
        }
        if(!this.modelo){
            this.modelo = new LOG.aft.apertura.Model({
                idioma:this.idioma
            });
        }

    },
    initDefaultColumns: function(){
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idaperturaregnum',
            hidden:true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idregnumerico',
            hidden:true,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'idpadre',
            hidden:true,
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCodigo,
            width: 120,
            dataIndex: 'codigo',
            filter:{
                type:'string',
                dataIndex:'codigo'
            }
        });
        this.addGridColumn({
            header: this.idioma.cgDenominacion,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            //default: true,
            filter:{
                type:'string',
                dataIndex:'denominacion'
            },
            id:'denominacionM'
        });

        this.addGridColumn({
            header: this.idioma.cgMarcaModelo,
            dataIndex: 'marcamodelo',
            width: 200,
            filter:{
                type:'string',
                dataIndex:'marcamodelo'
            },
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNoSerie,
            dataIndex: 'nroserie',
            filter:{
                type:'string',
                dataIndex:'nroserie'
            },
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNoInventario,
            dataIndex: 'nroinventario',
            filter:{
                type:'string',
                dataIndex:'nroinventario'
            },
            //default: true
        });
        var editorArea = new LOG.util.ComboBox({
            name : 'destino' ,
            autoLoad: true,
            url : '/logistica/activos_fijos/documento/index.php/aperturaaft/cargarEstructurasHijas',
            displayField : 'text',
            valueField : 'idfila',
            queryParam:'criterio',
            mode:'remote',
            minChars:1,
            //pageSize : 15,
            resizable:true,
            listeners:{
                select:function(cb,rec){
                    //_this.getSmPrincipal().getSelected().data.idarea = rec.data.idfila;
                    //_this.getGridPrincipal().getView().refresh();
                }
            }
        });
        editorArea.store.on({
            'load': function (st) {
                    if (_this.getSmPrincipal().getSelected() && _this.getSmPrincipal().getSelected().data.idarea) {
                        editorArea.setValue(_this.getSmPrincipal().getSelected().data.idarea);
                    }
            }
        });
        this.addGridColumn({
            header: this.idioma.cgAreaRespon,
            dataIndex: 'idarea',
            width: 200,
            editor:editorArea,
            renderer:function(val, x,rec){
                var temp = _this.modelo.getDenomEstructHijas(val);
               if(temp){
                    return temp;
                }
               else if(rec.json.denomarearesp){
                    return rec.json.denomarearesp;
                }
                else {
                   return val;
               }
            }
            //default: true
        });
        this.addGridColumn({
            header: this.idioma.cgEstadoTecnico,
            width: 120,
            dataIndex: 'denomestadotecnico',
        });
        var temp = new Array();
        this.listaColumnas.each(function(col,pos) {
            var obj = {'name':col.dataIndex};
            temp[pos]=obj;
        });
        this.topicRecord = Ext.data.Record.create(temp);
    },
    initDefaultButtons: function() {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
            text: this.idioma.lbBtnAdicionar,
            tooltip: this.idioma.ttBtnAdicionarMedio,
            handler: function() {
                var ventanaAdd =  new LOG.aft.apertura.GridMedios({
                    idioma:_this.idioma,
                    formaVisualizacion:'ventana',
                    autoLoad:false,
                    busquedaBasica:true,
                    dirController:'/logistica/activos_fijos/documento/index.php/aperturaaft',
                    urlBusquedaGridPrincipal:'cargarMediosExistentes',
                    title:_this.idioma.tlAdicionarMedios,
                    acciones:_this.acciones,
                    panelBotonesVisible:false,
                    idGridPrincipal:'idregnumerico',
                    usarAplicar:false,
                    initDefaultButtons:function(){},
                });
                ventanaAdd.init();
                var ancho = (_this.anchoPadre)?_this.anchoPadre*0.8:800;
                var alto = (_this.altoPadre)?_this.altoPadre*0.8:600;
                ventanaAdd.view({title:_this.idioma.tlSeleccionarMedios, width: ancho, height: alto});
                ventanaAdd.setModelo(_this.modelo);
                var arryExcluir = new Array();
                Ext.each(_this.getStorePrincipal().getRange(),function(rec){
                    if(!rec.data.idaperturaregnum){
                        arryExcluir.push(rec.data.idregnumerico);
                    }
                });
                ventanaAdd.setExcluir(arryExcluir);
                ventanaAdd.getVistaPrincipal().listaBotones.getItem(2).disable();
                ventanaAdd.getSmPrincipal().on({
                    'rowdeselect':function(){
                        if(!ventanaAdd.getSmPrincipal().hasSelection())
                            ventanaAdd.getVistaPrincipal().listaBotones.getItem(2).disable();
                    },
                    'rowselect':function(){
                        ventanaAdd.getVistaPrincipal().listaBotones.getItem(2).enable();
                    }
                });
                ventanaAdd.getVistaPrincipal().aceptarFn = function () {
                    if (ventanaAdd.getSmPrincipal().hasSelection()) {
                        var records = ventanaAdd.getSmPrincipal().getSelections();
                        Ext.each(records, function (r) {
                            var myNewRecord = new _this.topicRecord(r.data);
                            myNewRecord.data.idarearesp = null;
                            _this.modelo.adicionarMedio(r.data);
                            myNewRecord.json = myNewRecord.data;
                            _this.getStorePrincipal().add(myNewRecord);
                            ventanaAdd.getStorePrincipal().remove(r);
                            ventanaAdd.excluir.push(r.data.idregnumerico);
                        });
                    }
                };
                ventanaAdd.getStorePrincipal().on({beforeload:function(st){
                    st.initBaseParams.excluir = (ventanaAdd.excluir.length>0)?Ext.encode(ventanaAdd.excluir):null;
                }});
                ventanaAdd.getStorePrincipal().load();
            },
            controlFn: function(b, _caller) {
                b.hide();
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RAdicionar')) {
                    if(_this.tipo == 0 && _this.estado ==1) {
                        b.show();
                    }
                } else {
                    b.hide();
                }
            }
        }));
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
            text: this.idioma.lbBtnEliminar,
            tooltip: this.idioma.ttBtnEliminar,
            isContextual: true,
            handler: function() {
                _this.getStorePrincipal().remove(_this.getSmPrincipal().getSelections());
            },
            controlFn: function(b, _caller) {
                if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('REliminar')) {
                    b.hide();
                    if(_this.tipo == 0 && _this.estado !=3) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function (e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0) {
                                    var selectios = _caller.getSmPrincipal().getSelections();
                                    var ubicado = false;
                                    Ext.each(selectios, function(r){
                                        if(r.data.idarea){
                                            ubicado = true;
                                            return
                                        }
                                    });
                                    if(!ubicado)
                                        b.enable();
                                    else b.disable();
                                } else {
                                    b.disable();
                                }
                            }
                        }, 'eliminar');
                    }
                } else {
                    b.hide();
                }
            }
        }));
    },
    render:function(conf){
        var _this = this;
        var vista = LOG.aft.apertura.GridMedios.superclass.render.call(this,conf);
        if(this.iddocapertura) {
            this.getStorePrincipal().on({
                beforeload: function (st) {
                    st.initBaseParams.iddocapertura = _this.iddocapertura;
                    st.initBaseParams.excluir = (_this.excluir.length>0)?Ext.encode(_this.excluir):null;
                }
            })
        }
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function(e,obj) {
            if(e=='afteredit')
            {
                var rec = obj.record;
                if(obj.field == 'idarea') {
                    vista.fireEvent('editmedio',rec);
                }
            }
        });
        this.gpPrincipal.autoExpandColumn = 'denominacionM';
        Ext.apply(_this.gpPrincipal, {
            viewConfig: {
                getRowClass: function(rec, index, rowParams, store) {
                    if( rec.data.idarea!="" ) {
                        return 'greenrow-text';
                    }
                    else  return 'redrow-text';
                }
            }
        });
        return vista;
    },
    setModelo:function(modelo){
        this.modelo = modelo;
    },
    setEstado:function(estado){
        this.estado = estado;
    },
    setExcluir: function(excluir){
        this.excluir = excluir;
    }
});
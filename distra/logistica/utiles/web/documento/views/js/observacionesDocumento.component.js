Ext.ns('LOG.lb.documento');
LOG.lb.documento.observacionesDoc = Ext.extend(LOG.util.UITemplate, {
    /**
     * prototipo del record a crear
     */
    topicRecord:undefined,
    iddocumento:undefined,
    constructor: function (config) {
        this.urlBusquedaGridPrincipal = 'cargarReclamos';
        this.autoLoad = false;
        this.formaVisualizacion = 'ventana';
        this.modoSeleccion = 2;
        this.dirController = '/logistica/utiles/documento/index.php/documentologistica';
        this.urlBusquedaGridPrincipal = 'cargarObservaciones';
        this.gridEditable = true;
        LOG.lb.documento.observacionesDoc.superclass.constructor.call(this, config);
        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(0),LOG.util.Prototipos.botonCancelar({},true));
        Ext.apply(this.getVistaPrincipal().listaBotones.getItem(1),LOG.util.Prototipos.botonGuardar({}));
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
        this.modelo = new LOG.lb.documento.Model({
            idioma:config.idioma,
            urlController:'/logistica/utiles/documento/index.php/documentologistica'
        });
        var _this =  this;
        this.getVistaPrincipal().listaBotones.getItem(1).disable();
        this.getVistaPrincipal().listaBotones.getItem(2).disable();
        this.addEvents('addrecord');
        this.addEvents('editado');
        this.addEvents('storeload');
        this.on({
            'editado': function (obj) {
                var rec = obj.record;
                if (obj.field == 'observaciones') {
                    if (!obj.value) {
                        _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                        _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                    }
                    else {
                        var ok = true;
                        _this.getStorePrincipal().each(function (rec) {
                            if (!rec.data.observaciones || rec.data.observaciones == "") {
                                ok = false;
                            }
                        });
                        if (ok) {
                            _this.getVistaPrincipal().listaBotones.getItem(1).enable();
                            _this.getVistaPrincipal().listaBotones.getItem(2).enable();
                        }
                        else {
                            _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                            _this.getVistaPrincipal().listaBotones.getItem(2).disable();
                        }
                    }
                }
            },
            'addrecord': function(){
                _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
            },
            'storeload':function(){
                _this.getVistaPrincipal().listaBotones.getItem(1).disable();
                _this.getVistaPrincipal().listaBotones.getItem(2).disable();
            }
        });
    },
    initDefaultButtons: function () {
        var _this = this;
        this.addToolbarButton(LOG.util.Prototipos.botonAdicionar({
                tooltip:this.idioma.ttBtnAdicionarObsev,
                handler:function(){
                    var rec = new _this.topicRecord();
                    _this.getStorePrincipal().add(rec);
                }
            })
        );
        this.addToolbarButton(LOG.util.Prototipos.botonEliminar({
                tooltip:this.idioma.ttBtnEliminarObsev,
                handler:function(){
                    if(_this.getSmPrincipal().hasSelection()) {
                        mostrarMensaje(2, _this.idioma.msgCofirmarEliminarObsv, function (btn) {
                            if (btn == 'ok') {
                                Ext.MessageBox.wait(_this.idioma.msgEliminandoObjeto, _this.idioma.msgEspere || '...');
                                var selections = _this.getSmPrincipal().getSelections();
                                var ids = new Array();
                                Ext.each(selections, function (rec) {
                                    if (rec.data.iddocobservaciones) {
                                        ids.push(rec.data.iddocobservaciones)
                                    }
                                    _this.getStorePrincipal().remove(rec);
                                });
                                if(ids.length > 0){
                                    _this.modelo.eliminarObservaciones(ids,function(resp){
                                        _this.getStorePrincipal().reload();
                                    });
                                }
                                else {
                                    Ext.MessageBox.hide();
                                    mostrarMensaje(1, _this.idioma.msgObservacionEliminada);
                                }
                            }
                        });
                    }
                },
                controlFn: function(b, _caller) {
                    if (_this.grantedAction('CT') || _this.grantedAction('RCRUD') || _this.grantedAction('RElimObservaciones')) {
                        b.show();
                        b.disable();
                        LOG.util.UIManager.encadenaFn(_caller.getSmPrincipal(), 'fireEvent', function(e) {
                            if (e == 'selectionchange') {
                                if (this.getCount() > 0) {
                                    b.enable();
                                } else {
                                    b.disable();
                                }
                            }
                        });
                    } else {
                        b.hide();
                    }
                }
            })
        );
    },
    initDefaultColumns: function () {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocobservaciones',
            hidden: true
        });
        this.addGridColumn({
            header: 'Fecha',
            dataIndex: 'fecha',
            width: 150,
            default: true
        });
        this.addGridColumn({
            header: 'Descripción',
            id:'observacionesID',
            dataIndex: 'observaciones',
            width: 250,
            editor: new Ext.form.TextField({maskRe:LOG.util.Regex.cadena}),
            default: true
        });
        var temp = new Array();
        this.listaColumnas.each(function(col,pos) {
            var obj = {'name':col.dataIndex};
            temp[pos]=obj;
        });
        this.topicRecord = Ext.data.Record.create(temp);
    },
    render:function(cfg){
        var _this = this;
        var vista = LOG.lb.documento.observacionesDoc.superclass.render.call(this, cfg);
        _this.getGridPrincipal().fireEvent = _this.getGridPrincipal().fireEvent.createSequence(function(e,obj) {
            if(e =='afteredit')
            {
                _this.fireEvent('editado',obj);
            }
        });
        this.getStorePrincipal().on({
            add:function(){
                _this.fireEvent('addrecord');
            },
            beforeload:function(st){
                st.initBaseParams = {iddocumento: _this.iddocumento}
            },
            load:function(){
                _this.fireEvent('storeload');
            }
        });
        this.gpPrincipal.autoExpandColumn = 'observacionesID';
        return vista;
    },
    aceptarFn:function(){
        var datos = new Array();
        var i = 0;
        if(this.getStorePrincipal())
            this.getStorePrincipal().each(function (record) {
                if (!record.data.iddocobservaciones || record.dirty) {
                    datos[i] = record.data;
                    i++;
                }
            });
    }

});
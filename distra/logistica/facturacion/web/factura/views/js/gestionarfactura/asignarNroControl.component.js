Ext.ns('LOG.fact');

LOG.fact.vAsignarNrosControl = Ext.extend(LOG.util.Window, {
    constructor: function(config) {
        var _this = this;
        this.width = 600;
        this.height = 250;
        this.frame = true;
        this.modal = true;
        this.resizable= false;
        this.idioma = config.idioma;
        this.cantFacturas = config.cantFacturas;
        this.factImprimir = config.factImprimir;
        this.idsfacturas = config.idsfacturas;
        this.docFactura = config.docFactura;
        this.btn = config.btn;
        this.sm = config.sm;
        this.vp = config.vp;
        this.desdeAdd = config.desdeAdd;
        this.title = _this.idioma.lbConfirmacion;



        _this.cbPuntoImpresion = new LOG.util.ComboBox({
            allowBlank: false,
            fieldLabel: _this.idioma.cmbPuntoImpresion,
            url: 'getPuntosImpresion',
            displayField: 'denominacion',
            valueField: 'idpuestotrabajo',
            mode: 'local',
            forceSelection: true,
            editable: false,
            typeAhead: false,
            triggerAction: 'all',
            emptyText: _this.idioma.cbEmtyText,
            selectOnFocus: true,
            width: 250,
            listeners: {
                select: function (combo, record, index) {
                    _this.seleccionarPuestoImpresion(record, _this.cantFacturas, _this.factImprimir);
                }
            }
        });

        _this.textRangos = new Ext.form.TextArea({
            fieldLabel: _this.idioma.textAreaNrosControl,
            anchor: '100%',
            style: 'background:#dfe8f6;border=0',
            readOnly: true
        });
        _this.panelMsg = new LOG.util.UIManager.initPanel({
            items: [
                {
                    layout: 'form',
                    defaults: {
                        bodyStyle: 'padding:5px'
                    },
                    items: [{
                        html: '<p><font size="2"> '+ _this.idioma.impresion1 + _this.cantFacturas + _this.idioma.impresion2 + '<br>' +
                        _this.idioma.impresion3 +' </font></p>',
                        colspan: 2
                    },
                        {
                            xtype: 'form',
                            labelWidth: 130,
                            items: [_this.cbPuntoImpresion, _this.textRangos]
                        }
                    ]
                }
            ],
            frame: true,
            layout: 'fit',
            region: 'center'
        });
        this.items = [_this.panelMsg];


        LOG.fact.vAsignarNrosControl.superclass.constructor.apply(this, config);
        this.listaBotones.getItem(2).disable();
        LOG.util.UIManager.apply(this.listaBotones.getItem(0), {
            text: this.idioma.lbBtnCerrar
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            hidden: true
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            handler: function() {
                _this.imprimirFacturas();
                _this.close();
            }
        });
    },
    imprimirFacturas: function() {
        var _this = this;
        var ncontrol = _this.rangos;
        var iddocumento = Array();
        var nroanular = Array();
        var total = Array();
        if(!_this.idsfacturas){
            var seleccionadas = _this.sm.getSelections();
            Ext.each(seleccionadas, function(sel){
                if(sel.data.nrocontrol == null || sel.data.nrocontrol == '')
                    iddocumento.push(sel.data.iddocumento);
                total.push(sel.data.iddocumento);
            });
        }else{
            Ext.each(_this.idsfacturas, function(id){
                iddocumento.push(id.idfactura);
                nroanular.push(id.nrocontrol);
            });
        }

        if (iddocumento.length > 0) {
            var mascaraImprimiendo = new Ext.LoadMask(Ext.getBody(), {
                msg: _this.idioma.msgNumerosControl
            });
            mascaraImprimiendo.show();
            Ext.Ajax.request({
                url: 'imprimirModelo',
                params: {
                    iddocumento: Ext.encode(iddocumento),
                    ncontrol: Ext.encode(ncontrol),
                    nroanular: Ext.encode(nroanular),
                    puestoimpresion: _this.cbPuntoImpresion.getValue()
                },
                success: function(response) {
                    mascaraImprimiendo.hide();
                    var data = Ext.decode(response.responseText);
                    if (data['success'] === true) {
                        //desbloquear
                        if(_this.desdeAdd){
                            _this.desdeAdd.recargar = true;
                            _this.desdeAdd.documento.json.nrocontrol = data.respuesta.nrocontrol;
                            _this.desdeAdd.cmbNroControl.setValue(_this.desdeAdd.documento.json.nrocontrol);
                            var idfactura = Array();
                            Ext.each(_this.idsfacturas, function(id){
                                idfactura.push(id.idfactura);
                            });
                            _this.vp.onReport(_this.btn,idfactura);
                        }else{
                            _this.docFactura.reload({
                                callback: function(p, s, response) {
                                    if(!_this.idsfacturas){
                                        _this.vp.onReport(_this.btn);
                                    }else{
                                        var idfactura = Array();
                                        Ext.each(_this.idsfacturas, function(id){
                                            idfactura.push(id.idfactura);
                                        });
                                        _this.vp.onReport(_this.btn,idfactura);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        } else {
            var message = _this.idioma.lbMsgImprimir;
            mostrarMensaje(1, message);
        }
    },
    seleccionarPuestoImpresion: function(record, cantFacturas, factImprimir){
        var _this = this;

        _this.textRangos.setValue('');
        //_this.btnAceptar.setDisabled(true);
        Ext.Ajax.request({
            url: 'getNumerosControl',
            params: {
                idpuestotrabajo: record.json.idpuestotrabajo,
                cantnucontrol: cantFacturas-factImprimir.length
            },
            callback: function(options, succes, response) {
                /*var data = Ext.decode(response.responseText);
                if (data.respuesta.datos.length > 0) {
                    var nros = '', total = data.respuesta.datos.length;
                    if (total > 1) {
                        for (var i = 0; i < total; i++)
                        {
                            nros += data.respuesta.datos[i].inicio + " : " + data.respuesta.datos[i].fin;
                            if (total > 1 && (i + 1) < total)
                                nros += ", ";
                        }
                    } else {
                        if (data.respuesta.datos[0].fin) {
                            nros += data.respuesta.datos[0].inicio + " : " + data.respuesta.datos[0].fin;
                        } else {
                            nros += data.respuesta.datos[0].inicio;
                        }
                    }
                    //_this.btnAceptar.setDisabled(false);
                    _this.textRangos.setValue(nros);
                    _this.rangos = nros;
                }*/
                var data = Ext.decode(response.responseText);
                var nros = '';
                if (data.respuesta.inicio != null) {
                    if (cantFacturas-factImprimir.length > 1)
                        nros = data.respuesta.inicio + ' : ' + data.respuesta.fin;
                    else
                        nros = data.respuesta.inicio;
                    _this.listaBotones.getItem(2).enable();
                    _this.textRangos.setValue(nros);
                    _this.rangos = nros;
                } else {
                    nros = '';
                    _this.listaBotones.getItem(2).disable();
                    _this.textRangos.setValue(nros);
                    _this.rangos = nros;
                }
            }
        });
    }
});

Ext.ns('Log.AF.Utiles');
Ext.ns('Ext.Log.ExpTec');

Ext.Log.ExpTec.PanelNorte = Ext.extend(Ext.Panel,{
	constructor: function (config){
		var _this = this;
        _this.idioma = config.idioma;
        _this.perfil = config.perfil;
        _this.region = config.region;
        _this.layout = 'border';
        _this.smtreegrid = config.sm;


        _this.textfieldDenominacion = new Ext.form.TextField({
            autoCreate: true,
            id: 'idTxtNoDocumento',
            width: 100,
            maxLength: '11',
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                            _this.btnBuscar.handler();
                    }
                }
            }
        });

        _this.textfieldNroInventario = new Ext.form.TextField({
            autoCreate: true,
            id: 'idTxtNoSerie',
            width: 100,
            maxLength: '30',
            maskRe : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            regex : /^([a-zA-Z]*|[0-9]*)+-?_?([a-zA-Z]*|[0-9]*)+$/,
            enableKeyEvents: true,
            listeners: {
                'specialkey': function(cmp, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                            _this.btnBuscar.handler();
                    }
                }
            }
        });

        _this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            iconCls: 'buscar',
            hidden: false,
            tooltip: _this.idioma.btnTtBuscar,
            text: _this.idioma.btnBuscar,
            handler: function (buscar) {
                _this.smtreegrid.selections.clear();
                _this.fn();
                _this.treegrid.store.load({
                    params:{
                        buscar: buscar,
                        anode: '',
                        _id: '',
                        idarea: _this.comboDeposito.getValue(),
                        start: 0,
                        limit: 20,
                        denominacion: _this.textfieldDenominacion.getValue(),
                        nroinventario: _this.textfieldNroInventario.getValue()
                    }
                });
            }
        });

        _this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            iconCls: 'limpiar',
            hidden: false,
            tooltip: _this.idioma.btnTtLimpiar,
            text: _this.idioma.btnLimpiar,
            handler: function () {
                _this.smtreegrid.selections.clear();
                _this.fn();
                _this.textfieldDenominacion.reset();
                _this.textfieldNroInventario.reset();
                _this.treegrid.store.load({
                    params:{
                        anode: '',
                        _id: '',
                        idarea: _this.comboDeposito.getValue(),
                        start: 0,
                        limit: 20
                    }
                });
            }
        });

        _this.panelBotones= new Ext.Panel({
            region:'north',
            tbar : [_this.idioma.lbCMDenominacion+': ', _this.textfieldDenominacion, '-',
                    _this.idioma.lbCMNroInventario+': ', _this.textfieldNroInventario, '-', 
                    _this.btnBuscar, _this.btnLimpiar]
        });

        _this.treegrid = new Ext.Log.ExpTec.TreeGrid({
            id: 'idtreegrid',
            etiquetas: _this.idioma,
            region: 'center',
            sm: _this.smtreegrid,
            url: 'getMediosModulos',
            fn : function(){
                _this.getWinAreasResponsabilidad(); 
            }
        });
        
        _this.getComboDepositos();

        _this.tbar = ['->',_this.idioma.lbCMAreaResp+': ', _this.comboDeposito];

        _this.items = [_this.panelBotones,_this.treegrid];

        Ext.Log.ExpTec.PanelNorte.superclass.constructor.apply(this, arguments);
	},

    getComboDepositos: function() {
        var _this = this;
        if (this.comboDeposito == undefined) {
            this.stDepositos = new Ext.data.SimpleStore({
                fields: ['id', 'descripcion'],
                data: [],
                autoLoad: false
            });

            this.comboDeposito = new Ext.form.ComboBox({
                width: 300,
                disabled: true,
                id: 'itemx',
                mode: 'local',
                allowBlank: false,
                emptyText: 'Seleccione...',
                displayField: 'descripcion',
                valueField: 'id',
                hiddenName: 'id',
                readOnly: true,
                store: this.stDepositos,
                editable: false,
                listeners: {
                    'render': function(p) {

                        var theTip = null;

                        p.getEl().on('mouseover', function() {
                            theTip = new Ext.Tip({
                                margin: '0 0 0 200',
                                shadow: false
                            });
                            var pos = _this.comboDeposito.getPosition();
                            var x = pos[0];
                            var y = pos[1] + 20;
                            var text = (_this.identidad == _this.comboDeposito.getValue()) ? _this.idioma.lbEntidad : _this.idioma.lbCbDeposito;
                            theTip.html = '<b>' + text + ':</b>' + ' ' + _this.comboDeposito.getRawValue();
                            theTip.showAt([x, y]);
                        });

                        p.getEl().on('mouseleave', function() {
                            if (theTip)
                                theTip.hide();
                        });
                    },
                    'focus': function(combo) {
                        _this.getWinAreasResponsabilidad();
                    }
                }
            });
            
            this.cargarEntidadComboArea();
        }
    },

    getWinAreasResponsabilidad: function() {
        var _this = this;
        Ext.getBody().mask(_this.idioma.lbMsgCargandoDatos, 'x-mask-loading');
        if (!_this.cmpAreaRespWin) {

            _this.cmpAreaRespWin = new Log.AF.Utiles.WinContainer({
                modal: true,
                doAction: function(nodo) {
                    function funcion() {
                        _this.comboDeposito.setValue(nodo.attributes.id);
                        _this.comboDeposito.setRawValue(nodo.attributes.text);
                        _this.cmpAreaRespWin.hide();
                        _this.treegrid.getStore().load({
                            params: {
                                anode: '',
                                _id: '',
                                idarea: _this.comboDeposito.getValue(),
                                start: 0,
                                limit: 20
                            }
                        })
                    }
                    if (nodo.getDepth() == 0) {
                        //Es padre
                        _this.tipo_area_seleccionada = 'entidad';
                        funcion();
                    } else if (nodo.attributes.interna) {
                        //Es un area resp
                        _this.tipo_area_seleccionada = 'arearesp';
                        funcion();
                    } else {
                        _this.tipo_area_seleccionada = 'otra';
                        mostrarMensaje(1, _this.idioma.lbNoEsAreaResp);
                    }
                },
                entidad: _this.comboDeposito.getRawValue(),
                identidad: _this.comboDeposito.getValue(),
                listeners: {
                    'beforeshow': function() {
                        Ext.getBody().unmask();
                    }
                }
            });
        } else {
            _this.cmpAreaRespWin.show();
        }
    },

    cargarEntidadComboArea: function() {
        var _this = this;

        Ext.Ajax.request({
            url: 'getEntidad',
            method: 'POST',
            callback: function(options, success, response) {
                var rd = Ext.decode(response.responseText);
                _this.identidad = rd.identidad;
                _this.entidad = rd.entidad;

                _this.comboDeposito.setValue(rd.identidad);
                _this.comboDeposito.setRawValue(rd.entidad);
                _this.comboDeposito.enable();

                _this.treegrid.getStore().load({
                    params: {
                        idarea: _this.comboDeposito.getValue(),
                        start: 0,
                        limit: 20
                    }
                }
                );
            }
        });
    },
    
    WinbusquedaAvanzada: function () {
     
        var _this = this;
        var win = new Ext.Log.ExpTec.VentanaBusqAvanzada({
            idioma: _this.idioma,
            fn: function (parametros) {
                _this.Buscar(parametros);
            }
        });
        win.show();
    }  
});
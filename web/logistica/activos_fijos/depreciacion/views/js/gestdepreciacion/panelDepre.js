Ext.ns('Ext.aft');
Ext.aft.panelDepre = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        this.dirController = '/logistica/activos_fijos/depreciacion/index.php/gestdepreciacion';
        this.formaVisualizacion = 'panel';
        this.busquedaBasica = false;
        this.concepto = config.idioma.lbTtBuscar;
        this.idGridPrincipal = 'idregnumerico';
        this.autoLoad = false;
        this.btns = config.btns;
        this.idioma = config.idioma;
        this.urlBusquedaGridPrincipal = 'getdatos';
        this.listaAftPlugins = new LOG.util.List();
        this.campos = LOG.aft.RegOperativo.Campos;
        this.modoSeleccion = 1;
        
		this.valordeptotal = new LOG.util.Prototipos.inputDecimal({
            disabled: true,
			value: 0
        });
		this.valordepalttotal = new LOG.util.Prototipos.inputDecimal({
            disabled: true,
			value: 0
        });

        Ext.aft.panelDepre.superclass.constructor.call(this, config);
    },
    initDefaultColumns: function() {

        var _this = this;
        var nromatricula = false;
        for(var i = 0; i< arrElementosGridCodigoNew.length; i++)
        {
            var campos = arrElementosGridCodigoNew[i].getArrCampos();
            for (var j = 0; j < campos.length; j++)
            {
               if(campos[i].dataIndex == 'nromatricula')
               {
                   nromatricula = true;
                   break;
               }
            }
            if (nromatricula)
                break;
        }

        this.addGridColumn({
            dataIndex: 'idregnumerico',
            default: true
        });
        this.addGridColumn({
            header: _this.idioma.lbCmDenominacionMarcaModelo,
            width: 120,
            dataIndex: 'descripcionmarcamodelo',
            autoExpand: true,
            renderer: _this.activarColores,
            agrupador: true,
            default: false,
            filter: {
                type: 'string',
                dataIndex: 'descripcionmarcamodelo'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCmNoInventario,
            width: 80,
            dataIndex: 'nroinventario',
            renderer: _this.activarColores,
            default: true,
            filter: {
                type: 'string',
                dataIndex: 'nroinventario'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCmIdentificador,
            width: 80,
            dataIndex: 'denomidmedio',
            renderer: _this.activarColores,
            default: true,
            /*filter: {
                type: 'string',
                dataIndex: 'denomidmedio'
            }*/
        });

        var valorCont = this.idioma.lbCmValor;
        this.addGridColumn({
            header: (alternativa) ? valorCont +' '+nommonedacontable : valorCont,
            width: 80,
            dataIndex: 'valorcontable',
            renderer:  _this.activarColores,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontable'
            }
        });
        this.addGridColumn({
            header: (alternativa) ? valorCont +' '+nommonedaalternativa : valorCont,
            hidden: (alternativa) ? false : true,
            width: 85,
            dataIndex: 'valorcontablealternativo',
            renderer:  _this.activarColores,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'valorcontablealternativo'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCmVidaUtil + ' (' + _this.unidadmedida + ')',
            width: 70,
            dataIndex: 'vidautil',
            renderer: _this.activarColores,

            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'vidautil'
            }
        });
        
        
        if (_this.idmetodo == 1 || _this.idmetodo == 3 ) {

            this.addGridColumn({
                header: this.idioma.lbCmTasaDep,
                dataIndex: 'tasafiscal',
                renderer: _this.incorporarPorciento.createDelegate(_this),
                type: 'float',
    
                width: 110,
                default: true,
                filter: {
                    type: 'numeric',
                    dataIndex: 'tasafiscal'
                }
            });
            this.addGridColumn({
                header: this.idioma.lbCmRecursosConsumidos + ' (' + _this.unidadmedida + ')',
                dataIndex: 'recursoconsumido',
                renderer: _this.formarNumero.createDelegate(_this),

                tooltip: this.idioma.lbTtRecurso,
                width: 95,
                default: false,
                filter: {
                    type: 'numeric',
                    dataIndex: 'recursoconsumido'
                }
            });
            this.addGridColumn({
                header: this.idioma.lbCmCantidadRecursoConsumido + ' (' + _this.unidadmedida + ')',

                dataIndex: 'cantidadrecursoconsumido',
                renderer: _this.formarNumero.createDelegate(_this),
                tooltip: this.idioma.lbTtContadorRecurso,
                width: 98,
                default: false,
                filter: {
                    type: 'numeric',
                    dataIndex: 'cantidadrecursoconsumido'
                }
            });
        }
        else {
            this.addGridColumn({
                header: this.idioma.lbCmFactorDep + ' CUP',
                renderer: _this.calcFactorDepreciacion.createDelegate(_this),
                type: 'float',

                width: 110,
                default: true
            });
            /*this.addGridColumn({
                header: this.idioma.lbCmFactorDep+ ' CUC',
                renderer: _this.calcFactorDepreciacionCUC.createDelegate(_this),
                type: 'float',

                width: 110,
                default: true
            });*/
        }
        this.addGridColumn({
            header: this.idioma.lbCmRecuperacion,
            dataIndex: 'porcientorecuperacion',
            renderer: _this.incorporarPorciento.createDelegate(_this),

            width: 70,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'porcientorecuperacion'
            }
        });
        this.addGridColumn({
            header: this.idioma.lbCmDepreciacion,
            dataIndex: 'depreciacion',

            renderer: _this.formarNumero.createDelegate(_this),
            width: 70,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacion'
            }
        });
        
        /*this.addGridColumn({
            header: this.idioma.lbCmDepreciacion + ' CUC',
            dataIndex: 'depreciacioncuc',

            renderer: _this.formarNumero.createDelegate(_this),
            width: 80,
            default: true
        });*/
        var depereAcum = this.idioma.lbCmDepreciacionAcum;
        this.addGridColumn({
            header: (alternativa) ? depereAcum +' '+ nommonedacontable : depereAcum,
            dataIndex: 'depreciacionacumulada',

            renderer: _this.formarNumero.createDelegate(_this),
            width: 80,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumulada'
            }
        });
        /*this.addGridColumn({
            header: (alternativa) ? depereAcum +' '+ nommonedaalternativa : depereAcum,
            dataIndex: 'depreciacionacumuladaalternativo',
            renderer: _this.formarNumero.createDelegate(_this),
            width: 80,
            default: true,
            filter: {
                type: 'numeric',
                dataIndex: 'depreciacionacumuladaalternativo'
            }
        });*/
        this.addGridColumn({
            dataIndex: 'esta',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechaexpini',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'fechaaprobadoDoc',
            default: true
        });
        this.addGridColumn({
            dataIndex: 'vidautil',
            default: true
        });
        
    },
    formarNumero: function(val, metaData, record) {
        
        return this.activarColores(Ext.util.Format.number(val, '000,000,000.00'), metaData, record);
    },
    calcFactorDepreciacion: function(val, metaData, record) {
        if(record.get('vidautil') && record.get('vidautil') > 0){
            var periodo = 1;
            var valorSalavamento = record.get('porcientorecuperacion') * record.get('valorcontable') / 100;
            var totalDepreciar = record.get('valorcontable') - valorSalavamento;
            var factorDepAnual = totalDepreciar / record.get('vidautil');
            var factorDepPeriodo = factorDepAnual / 12 * periodo;
            return this.activarColores(Ext.util.Format.number(factorDepPeriodo, '00,000.00'), metaData, record);
        }
    },
    calcFactorDepreciacionCUC: function(val, metaData, record) {
        var periodo = 1;
        var valorSalavamento = record.get('porcientorecuperacion') * record.get('valorcontablealternativo') / 100;
        
        var totalDepreciar = record.get('valorcontablealternativo') - valorSalavamento;
        var factorDepAnual = totalDepreciar / record.get('vidautil');
        var factorDepPeriodo = factorDepAnual / 12 * periodo;  
        return this.activarColores(Ext.util.Format.number(factorDepPeriodo, '00,000.00'), metaData, record);
    },
    incorporarPorciento: function(val, metaData, record) {
        var val = (!val || val == null || val == '') ? '' : /*Ext.util.Format.number(val, '000')*/val + ' %';
        return this.activarColores(val, metaData, record);
    },
    activarColores: function(val, metaData, record) {
        val = (!val || val == null || val == '') ? '' : val;

        if (record.store.initBaseParams.idmetodo != 1 && record.store.initBaseParams.idmetodo != 2) {
            if (record.get('esta') == "verde") {
                return '<span style="color:green;">' + val + '</span>';
            }
            if (record.get('esta') != "verde" && (record.get('recursoconsumido') == null)) {
                return '<span style="color:red;">' + val + '</span>';
            } else {
                return '<span style="color:black;">' + val + '</span>';
            }
        }
        else {
            if (record.get('esta') == "verde") {
                return '<span style="color:green;">' + val + '</span>';
            } else {
                return '<span style="color:black;">' + val + '</span>';
            }
        }
    },
    render: function() {
        var vista = Ext.aft.panelDepre.superclass.render.call(this);
        var _this = this;
        _this.idareaResp = null;
        /*var comboArea = new LOG.util.ComboBox({
            url: '/logistica/activos_fijos/utiles/index.php/gestarearesponsabilidad/cargarareas',
            valueField: 'iddeposito',
            displayField: 'deposito',
            name: 'idestructuracomun',
            listeners: {
                'select': function (cb, rec) {
                    _this.idareaResp = cb.getValue();
                    _this.storePrincipal.load();
                }

            }

        });*/

        this.getStorePrincipal().fireEvent= this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {
               // Ext.getBody().mask('Cargando...', 'x-mask-loading');
                _this.storePrincipal.baseParams = {
                    idmetodo: _this.idmetodo,
                    idarearesp: _this.idareaResp
                };
            }
            if(e == 'load'){
                Ext.getBody().unmask();
            }
        });
		
		this.getStorePrincipal().on({
			'load': function(st, data, opts){
                if(data.length > 0){
                    _this.valordeptotal.setValue(data[0].json.totaldepreciacion);
                    _this.valordepalttotal.setValue(data[0].json.totaldepreciacionalt);
                }else{
                    _this.valordeptotal.setValue(0);
                    _this.valordepalttotal.setValue(0);
                    if(st.reader.jsonData.error){
                        mostrarMensaje(3, st.reader.jsonData.error);
                    }
                }
				
			}
		});
		
        this.getStorePrincipal().load();
       
        //var btns = this.btns;

        /*this.smGridPrincipal.on({
            'rowselect': function(smodel) { 
                var sm = _this.smGridPrincipal.getSelections();
                if (sm.length >= 1) {
                    var aux = true;                    
                    for (var i = 0; i < sm.length; i++) {
                        if(sm[i].data.esta == 'negro'){
                            btns[0].enable(); 
                           
                            if(!aux){
                               _this.smGridPrincipal.clearSelections();
                               aux = true;
                            }
                        }
                        else if(sm[i].data.esta == 'verde'){
                            btns[0].disable();
                            aux = false;
                            break;
                        }
                    }
                } else {
                    btns[0].disable();
                }
            },
            'rowdeselect': function(sm) {
                var sm = _this.smGridPrincipal.getSelections();
                if (sm.length >= 1) {
                    var aux = true;                    
                    for (var i = 0; i < sm.length; i++) {
                        if(sm[i].data.esta == 'negro'){
                            btns[0].enable(); 
                           
                            if(!aux){
                               _this.smGridPrincipal.clearSelections();
                               aux = true;
                            }
                        }
                        else if(sm[i].data.esta == 'verde'){
                            btns[0].disable();
                            aux = false;
                            break;
                        }
                    }
                } else {
                    btns[0].disable();
                }
            }
        });*/
		let lbtxtDepTotal = {
			xtype: 'tbtext',
			text: '<b>Depreciación total:</b>'
        };
		let lbtxtDepTotalAlt = {
			xtype: 'tbtext',
			text: '<b>Depreciación total alternativo:</b>'
        };
		 _this.getGridPrincipal().getTopToolbar().add('->', lbtxtDepTotal, ' ',_this.valordeptotal,'-', lbtxtDepTotalAlt,' ',  _this.valordepalttotal,'-');
		 _this.getVistaPrincipal().doLayout();
        return vista;
    },
    getValorDepTotal: function() {
        return this.valordeptotal.value;
    }
});


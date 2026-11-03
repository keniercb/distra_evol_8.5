Ext.ns('Ext.aft');
Ext.aft.panelporCuentas = Ext.extend(LOG.util.UITemplate, {
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

        Ext.aft.panelporCuentas.superclass.constructor.call(this, config);
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
            header: 'Grupo de activo',
            dataIndex: 'gruposubgrupo',
            width: 300,
            //autoExpand: true
        });
        this.addGridColumn({
            header: 'Cuenta depreciación',
            dataIndex: 'cuenta',
            width: 100,
           // autoExpand: true
        });
        this.addGridColumn({
            header: 'Valor adquisicion',
            dataIndex: 'valoradquisicion',
            width: 120,
           // autoExpand: true
        });
        this.addGridColumn({
            header: 'Valor contable',
            dataIndex: 'valorcontable',
            width: 120,
           // autoExpand: true
        });
    
        this.addGridColumn({
            header: 'Tasa',
            dataIndex: 'tasafiscal',
            width: 120,
         //   autoExpand: true
        });
        this.addGridColumn({
            header: 'Cantidad',
            dataIndex: 'cantidad',
            width: 120,
          //  autoExpand: true

        });  
        this.addGridColumn({
            header: 'Depreciación (MES)',
            dataIndex: 'depreciacion',
            width: 120,
           // autoExpand: true
        });     
     
    },
    formarNumero: function(val, metaData, record) {
        
        return this.activarColores(Ext.util.Format.number(val, '000,000,000.00'), metaData, record);
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
        var vista = Ext.aft.panelporCuentas.superclass.render.call(this);
        var _this = this;
        _this.idareaResp = null;

        this.getStorePrincipal().fireEvent= this.getStorePrincipal().fireEvent.createSequence(function (e) {
            if (e == 'beforeload') {
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
 
        return vista;
    },
    getValorDepTotal: function() {
        return this.valordeptotal.value;
    }
});


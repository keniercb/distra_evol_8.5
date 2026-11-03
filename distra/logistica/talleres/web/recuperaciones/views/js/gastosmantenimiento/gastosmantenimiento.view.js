Ext.ns('log.tall.gastosmantenimiento');

Ext.erp.gastosmantenimiento = Ext.extend(LOG.util.Panel, {
    constructor: function (config) {
        var _this = this;
        this.frame = true;
        this.doFocus = true;
        this.layout = 'border';
        this.region = 'center';
        this.count = 5;
        this.idioma = {};
        this.params = {};
        LOG.util.UIManager.apply(this.idioma, Log.tall.gastosmantenimiento.Idioma);

        this.comboEstructura = new LOG.util.LovCombo({
            mode:'remote',
            autoLoad:false,
            url:'/logistica/talleres/recuperaciones/index.php/paralizaciontalleres/getEstructurasPorDominio',
            displayField:'text',
            emptyText:'Seleccione',
            valueField:'id',
            listeners: {
                select: function(cb, record, index){
                      _this.grid.setPEntidades(cb.getValue());
                      _this.grid.getStorePrincipal().load();
                }
            },
            queryParam: 'criterio',
            pageSize: 10,
            resizable:true
        });

        this.comboServicio = new LOG.util.LovCombo({
            fieldLabel:this.idioma.lbServicio,
            url:'/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarActividadesExistentes',
            name:'idservicio',
            displayField : 'denominacion',
            valueField : 'idactividad',
            queryParam:'criterio',
            mode:'remote',
            emptyText:'Seleccione',
            autoLoad: false,
            validarEnFormBasico:true,
            listeners:{
                'select' : function(cb, record) {
                    _this.actualizarColumnModel(record, false);
                    _this.grid.setPServicios(cb.getValue());
                    _this.grid.getStorePrincipal().load();
                }
            },
            minChars:1,
            pageSize : 15,
            resizable:true
        });
        this.comboServicio.store.on({
            'beforeload': function(store){
                Ext.apply(store.baseParams , {nivel: 2});
            }
        });

        this.comboMedios = new LOG.util.LovCombo({
            mode: 'local',
            url: '/logistica/talleres/recuperaciones/index.php/gastosmantenimiento/cargarMedios',
            width: 180,
            displayField: 'descripcionmarcamodelo',
            valueField: 'idindicador',
            queryParam: 'criterio',
            pageSize: 10,
            resizable: true,
            minListWidth: 300,
            listeners: {
                'select' : function(cb, record) {
                    _this.grid.setPMedio(cb.getValue());
                    _this.grid.getStorePrincipal().load();
                }
            }
        });

        this.identificador = new LOG.util.Prototipos.inputTexto({
           name:'atributoidentificador',
            width: 180,
            listeners: {
            }
        });

        this.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    ctrl:false,
                    key: 'p',
                    fn: function () {
                        if(_this.isVisible() && !_this.btnExportar.disabled){
                            _this.grid.getReportes(_this);
                        }
                    }
                }
            ]);
        var param = {};
        param['explotacion'] = 1;
        Ext.Ajax.request({
            url: '/logistica/utiles/maestroproductos/index.php/maestroproductos/cargarGridClasificador',
            params: {explotacion : 1},
            method: 'POST',
            callback: function (o, s, r) {
                var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                _this.grid.setMedios(resp['datos']);
                _this.grid.fireEvent('cargainicial');
            }
        });

        this.grid = new Ext.erp.gridGastosMantenimiento({
            idioma: this.idioma,
            formaVisualizacion:'panel',
            comboEstructura: _this.comboEstructura,
            comboServicio: _this.comboServicio,
            comboMedios: _this.comboMedios,
            btnExportar: _this.btnExportar,
            identificador:_this.identificador
        });
        this.grid.init();
        var gridPedidos = this.grid.view();
        this.grid.on({
            'cargainicial': function () {
                Ext.MessageBox.hide();
                _this.grid.getStorePrincipal().load({
                    callback:function(){
                        if (_this.grid.getStorePrincipal().data.items.length == 0) {
                            _this.btnExportar.disable();
                        }
                        else {
                            _this.btnExportar.enable();
                        }
                    }
                });
            },
            'limpiar' : function() {
                _this.actualizarColumnModel(null, true);
            }
        });//arrayData
        this.grid.getStorePrincipal().fireEvent = this.grid.getStorePrincipal().fireEvent.createSequence(function (e, grid, datos, opt) {
            if(e=='load')
            {
                var longitud = _this.grid.getGridPrincipal().getColumnModel().config.length;
                var arrayColumnas= new Array();
                for(var i=0; i<longitud; i++)
                {
                    var obj = {
                       name: _this.grid.getGridPrincipal().getColumnModel().config[i]['dataIndex'],
                       denominacion: _this.grid.getGridPrincipal().getColumnModel().config[i]['header']
                    };
                    arrayColumnas.push(obj);

                }
                _this.params = {
                    idactividad: Ext.encode(_this.grid.servicios),
                    columnas: Ext.encode(arrayColumnas),
                    idindicador: _this.grid.medio,
                    idestructuracomun: Ext.encode(_this.grid.entidades),
                    fechainicio: _this.grid.textDesde.getValue(),
                    totalAltern: _this.grid.totalAltern.getValue(),
                    totalContab: _this.grid.totalContab.getValue(),
                    total: _this.grid.total.getValue(),
                    alternativa:alternativa,
                    fechafin: _this.grid.textHasta.getValue()
                };

                LOG.util.UIManager.apply(_this.params, opt.params);

                LOG.util.UIManager.apply(_this.btnExportar, {
                    objSubmit: _this.params
                });
            }
        });

        gridPedidos.height = 827;

        this.btnExportar = LOG.util.Prototipos.botonExportar({
            url: '/logistica/talleres/recuperaciones/index.php/gastosmantenimiento/exportarExcel',
            objSubmit: _this.params,
            disabled:true                                                       
        });


        config.layout = 'border';
        config.items = [
            {
                region: 'north',
                frame: false,
                tbar : [
                    _this.btnExportar,"->",
                    LOG.util.Prototipos.botonAyuda({
                        tooltip: this.idioma.ttAyuda,
                        id: 'ayudaGastosMantenimiento'
                    })
                ],
                bbar : [new Ext.form.Label({text:_this.idioma.tlServicios}),
                    ' ',
                    _this.comboServicio,
                    ' ', '-',
                    new Ext.form.Label({text:_this.idioma.tlMedios}),
                    ' ',
                    _this.comboMedios,
                    ' ','-',
                    new Ext.form.Label({text:_this.idioma.tlIdentificador}),
                    ' ',
                    _this.identificador,
                    "->",
                    new Ext.form.Label({text:_this.idioma.tlEstructuras}),
                    ' ',
                    _this.comboEstructura
                ]
            },
            gridPedidos
        ];
        Ext.erp.gastosmantenimiento.superclass.constructor.call(this, config);
        this.on({
            'resize': function () {
                var altura = _this.getHeight() - 80;
                gridPedidos.setHeight(altura);
            }
        });

    },

    actualizarColumnModel : function(record, clean) {
        var _this = this;
        var cols = _this.grid.getGridPrincipal().getColumnModel().config;


        if(record && record.data.checked) {
            _this.grid.limpiar = false;
            var inicio = cols.slice(0, _this.count++);
            var final = cols.slice(cols.length - 5, cols.length);
            var nueva  = {
                dataIndex: 'sd'+record.data.idactividad.toString(),
                header: record.data.denominacion,
                width: 120,
                default: true,
                renderer : function(value, metaData, r) {
                    var value = r.json['sd'+record.data.idactividad.toString()];
                    return value;
                }
            };
            inicio.push(nueva);
            var config = inicio.concat(final);
            _this.grid.getGridPrincipal().getColumnModel().setConfig(config);
        } else if(record && !record.data.checked) {
            var aux = {};
            Ext.each(cols, function(col) {
                if (col.dataIndex == 'sd'+record.data.idactividad)
                    aux = col; return;
            });
            cols.remove(aux);
            _this.count--;
            _this.grid.getGridPrincipal().getColumnModel().setConfig(cols);
        }
        if(clean) {
            var count = 0;
            Ext.each(cols, function(col) {
                if (col.dataIndex.indexOf('sd') != -1) {
                    count++;
                }

            });
            while(count != 0) {
                cols.remove(cols[3+count]);
                count--
            }
           _this.grid.getGridPrincipal().getColumnModel().setConfig(cols);
           _this.count = 4;
        }
    }
});

Ext.erp.gridGastosMantenimiento = Ext.extend(LOG.util.UITemplate, {
    arrEntidades: undefined,
    arrDesgloce: undefined,
    comboEstructura: 0,
    constructor: function (config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/gastosmantenimiento';
        config.urlBusquedaGridPrincipal = 'cargarMantenimientos';
        config.modoSeleccion = 1;
        config.busquedaBasica = false;
        config.formaVisualizacion = 'panel';
        config.autoShow = true;
        config.autoLoad = false;
        this.comboEstructura = config.comboEstructura;
        this.comboServicio = config.comboServicio;
        this.comboMedios = config.comboMedios;
        this.identificador = config.identificador;
        this.limpiar = false;
        this.ordenseleccionada = '';
        config.idioma = {};
        this.idGridPrincipal = 'idgastosmantenimiento';
        Ext.erp.gridGastosMantenimiento.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.gastosmantenimiento.Idioma);
        this.addEvents('limpiar');
        this.addEvents('cargainicial');
    },
    render: function (config) {
        var render = Ext.erp.gridGastosMantenimiento.superclass.render.call(this, config);
        var _this = this;

        _this.textDesde = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'desdeGastos',
            endDateField: 'hastaPedidos'
        });

        _this.textHasta = new Ext.form.DateField({
            width: 150,
            editable: false,
            xtype: 'datefield',
            vtype: 'daterange',
            id: 'hastaGastos',
            endDateField: 'desdePedidos'
        });
        _this.textDesde.endDateField = _this.textHasta.id; //-------validacion de fecha
        _this.textHasta.startDateField = _this.textDesde.id;
        _this.btnBuscar = new LOG.util.Prototipos.botonBuscar({
            text: this.idioma.lbBtnBuscar,
            tooltip: this.idioma.ttBuscarPedido,
            handler: function() {
                _this.fnBtnBuscar();
            }
        });
        _this.btnLimpiar = new LOG.util.Prototipos.botonLimpiar({
            text: this.idioma.lbBtnLimpiar,
            tooltip: this.idioma.ttBtnLimpiar,
            handler: function() {
                _this.fnBtnLimpiar();
            }
        });

        render.documentKeyMap = new Ext.KeyMap(document,
            [
                {
                    alt: true,
                    key: 'b',
                    fn: function() {
                        if (render.isVisible() && (_this.textHasta.getValue() || _this.textDesde.getValue()))
                            _this.fnBtnBuscar();
                    }
                },
                {
                    alt: true,
                    key: 'l',
                    fn: function() {
                        if (render.isVisible())
                            _this.fnBtnLimpiar();
                    }
                }
            ]);
        this.total = LOG.util.Prototipos.inputDecimal({
            disabled:true,
            value:0
        });
        this.totalAltern = LOG.util.Prototipos.inputDecimal({
            hidden:(alternativa)?false:true,
            disabled:true,
            value:0
        });
        this.totalContab = LOG.util.Prototipos.inputDecimal({
            disabled:true,
            hidden:(alternativa)?false:true,
            value:0
        });
        this.gpPrincipal.getTopToolbar().add('-', new Ext.form.Label({text: _this.idioma.tlDesde}), _this.textDesde,
            '-', new Ext.form.Label({text: _this.idioma.tlHasta}), _this.textHasta, '-', _this.btnBuscar, '-', _this.btnLimpiar);

        this.gpPrincipal.getBottomToolbar().add(
            '->',new Ext.form.Label({html:'<b>Total '+ nommonedacontable +': </b>', hidden:!alternativa}),
            {text:' ',hidden:!alternativa},this.totalContab,{text:' ',hidden:!alternativa},
            new Ext.form.Label({html:'<b>Total '+ nommonedaalternativa +': </b>', hidden:!alternativa}),
            {text:' ',hidden:!alternativa},this.totalAltern,{text:' ',hidden:!alternativa},
            new Ext.form.Label({html:'<b>Importe total: </b>'}),  {text:' '},this.total,{text:' '}
        );
        this.getStorePrincipal().on({
            load:function(){
                var sumCont = 0;
                var sumAlt = 0;
                var sumTotal = 0;
                if(_this.getStorePrincipal().getCount() == 0 ){
                    if(!_this.getStorePrincipal().filtrado){
                        mostrarMensaje(1, _this.idioma.msgInfDatosB);
                    }
                }
                else {
                    Ext.each(_this.getStorePrincipal().getRange(), function (rec) {
                        sumCont += parseFloat(rec.data.importetotal);
                        sumAlt += parseFloat(rec.data.importealternativo);
                    });
                    sumTotal = parseFloat(sumCont) + parseFloat(sumAlt);
                    _this.total.setValue(sumTotal);
                    _this.totalAltern.setValue(sumAlt);
                    _this.totalContab.setValue(sumCont);
                }
            }
        });
        this.gridDesgloce = new Ext.erp.gastosmantenimiento.GridDesgloce({
            idioma: this.idioma,
            modelo: this.modelo,
            servicios: this.servicios,
            parent: this
        });
        this.gridDesgloce.init();
        var vistaDesgloce = this.gridDesgloce.view({region:'south', expandable:true});
        Ext.apply(vistaDesgloce,{
            region:'south',
            titleCollapse: true,
            collapsible: true,
            collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: _this.idioma.tlListadoDesgloce,
            collapsed:false,
            frame: false,
            height : 350
        });
        this.getPanelPrincipal().add(vistaDesgloce);
        this.getSmPrincipal().on({
            rowselect:function(sm,index,record){
                _this.gridDesgloce.getStorePrincipal().initBaseParams.idindicador = record.json.idindicador;
                _this.gridDesgloce.getStorePrincipal().load();
            },
            rowdeselect:function(){
                _this.gridDesgloce.getStorePrincipal().removeAll();
            }
        });
        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params, {
                    idactividad:Ext.encode(_this.servicios),
                    idindicador:_this.medio,
                    idestructuracomun:Ext.encode(_this.entidades),
                    atributoidentificador:(_this.identificador.getValue())?_this.identificador.getValue():null,
                    fechainicio:_this.textDesde.getValue(),
                    fechafin:_this.textHasta.getValue()});
            },
            load:function(){
                var sumCont = 0;
                var sumAlt = 0;
                var sumTotal = 0;
                Ext.each(_this.getStorePrincipal().getRange(),function(rec){
                    sumCont += parseFloat((rec.data.importetotal!="")?rec.data.importetotal:0);
                    sumAlt += parseFloat((rec.data.importealternativo !="")?rec.data.importealternativo:0);
                });
                sumTotal = parseFloat(sumCont) + parseFloat(sumAlt);
               // console.info(sumTotal, sumAlt);
                _this.total.setValue(sumTotal);
                _this.totalAltern.setValue(sumAlt);
                _this.totalContab.setValue(sumCont);
            }
        });
        return render;
    },

    initDefaultColumns: function () {
        var _this = this;

        this.addGridColumn({
            dataIndex: 'idindicador',
            default: true
        });//1

        this.addGridColumn({
            dataIndex: 'tipo',
            agrupador:true,
            header: this.idioma.cgTipo,
            width: 120,
            default: true
        });//2
        this.addGridColumn({
            dataIndex: 'atributoidentificador',
            header: 'Identificador',
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'marca',
            header: this.idioma.cgMarca,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//3

        this.addGridColumn({
            dataIndex: 'modelo',
            header: this.idioma.cgModelo,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val == null) ? '-' : val;
                return resul;
            }
        });//4

        this.addGridColumn({
            dataIndex: 'totalservicios',
            header: this.idioma.cgTotal,
            width: 120,
            default: true,
            renderer : function(val, metaD, rec) {
                var val = 0;
                if (!_this.limpiar) {
                    for(var prop in rec.json) {
                        if(prop.indexOf('sd') != -1) {
                            val += parseInt(rec.json[prop]);
                        }
                    }
                }
                return (val==0) ? '-' : val;
            }});//5

        this.addGridColumn({
            dataIndex: 'fechacierre',
            header: "Fecha de realizaci\xf3n",
            width: 120,
            default: true,
        });//6

        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importetotal',
            header: (alternativa) ? this.idioma.cgImporteTotal+' '+nommonedacontable : this.idioma.cgImporteTotal,
            width: 120,
            default: true,
            renderer: function(val) {
                var resul = (val && val != "" ) ? val : 0;
                return resul;
            }
        }));//7


        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importealternativo',
            header: this.idioma.cgImporteTotal+' '+nommonedaalternativa,
            width: 120,
            hidden: (alternativa) ? false : true,
            default: true,
            renderer: function(val) {
                var resul = (val && val != "" ) ? val : 0;
                return resul;
            }
        }));//8

        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importetotal',
            header: "Importe total",
            width: 120,
            hidden: (alternativa) ? false : true,
            default: true,
            renderer: function(val, x, record) {
                val = (val && val !="")?parseFloat(val):0;
                var alter = record.json.importealternativo;
                alter = (alter && alter !="")?parseFloat(alter):0;
                //console.info(val, alter);
                return parseFloat(val) + parseFloat(alter);
            }
        }));//9

    },

    getReportes: function (data) {
        var _this = this;
        var desdePR = (_this.textDesde.getValue()) ? _this.textDesde.getValue().format('d-m-Y') : null;
        var hastaPR = (_this.textHasta.getValue()) ? _this.textHasta.getValue().format('d-m-Y') : null;
        var estructuras = "";
        _this.entidades=[];
        _this.entidadesCheck=[];

        if(this.comboEstructura.view){
            for(var i=0; i < this.comboEstructura.view.store.data.items.length; i++) {
                if (this.comboEstructura.view.store.data.items[i].data.checked) {
                    _this.entidadesCheck.push(this.comboEstructura.view.store.data.items[i].data.id);
                }
                _this.entidades.push(_this.comboEstructura.view.store.data.items[i].data.id);
            }
            if(_this.entidadesCheck.length > 0){
                estructuras = "{" + _this.entidadesCheck.join() + "}";
            }
            else{
                estructuras = "{" + _this.entidades.join() + "}";
            }
        }
        else{
            for(var i=0; i < this.arrEntidades.length; i++) {
                _this.entidades.push(this.arrEntidades[i].id);
            }
            estructuras =  "{" + _this.entidades.join() + "}";
        }

        _this.tipoReportes = new LOG.util.Report({
            reports: [
                {
                    dirReport: '/distra/logistica/talleres/recuperaciones/GastosMantenimiento',
                    isList:true,
                    params: {
                        fechainicio: desdePR,
                        fechafin:  hastaPR,
                        idestructura: idEntidad,
                        arrayidestructura: estructuras
                    }
                }
            ]
        });
        _this.tipoReportes.view();
    },

    fnBtnBuscar: function () {
        var _this = this;
        if(_this.comboEstructura.getValue() || _this.comboServicio.getValue() ||  _this.comboMedios.getValue()
            ||_this.textDesde.getValue()||_this.textHasta.getValue() || _this.textHasta.getValue() || _this.identificador.getValue()) {
            _this.getStorePrincipal().filtrado = true;
            _this.getStorePrincipal().load();
        }
    },

    fnBtnLimpiar: function () {
        var _this = this;
        if(_this.comboEstructura.getValue() || _this.comboServicio.getValue() ||  _this.comboMedios.getValue()
            ||_this.textDesde.getValue()||_this.textHasta.getValue() || _this.textHasta.getValue() || _this.identificador.getValue()) {
            _this.comboEstructura.reset();
            _this.comboServicio.reset();
            _this.comboMedios.reset();
            _this.textDesde.reset();
            _this.textHasta.reset();
            _this.identificador.reset();
            _this.limpiar = true;
            _this.entidades = null;
            _this.servicios = null;
            _this.medio = null;
            _this.fireEvent('limpiar');
            _this.getStorePrincipal().removeAll();
            _this.getStorePrincipal().filtrado = false;
            _this.getStorePrincipal().load();
        }

    },

    setMedios: function(medios) {
        this.arrMedios = medios;
    },

    setPEntidades:function(newParams){
        this.entidades = newParams;
        this.gridDesgloce.setEntidades(newParams);
    },
    setPServicios:function(newParams){
        this.servicios = newParams;
        this.gridDesgloce.setServicios(newParams);
    },
    setPMedio:function(newParams){
        this.medio = newParams;
    }

});

Ext.erp.gastosmantenimiento.GridDesgloce = Ext.extend(LOG.util.UITemplate, {
    idpedido:undefined,
    servicios:undefined,
    entidades:undefined,
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/gastosmantenimiento';
        config.urlBusquedaGridPrincipal = 'cargarDesgloceMantenimiento';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.busquedaAvanzada = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        this.idioma = config.idioma;
        this.concepto = config.idioma.ttBuscar;
        this.parent = config.parent;
        this.textBusquedaSimple = config.idioma.ttDeno_Codigo;
        Ext.erp.gastosmantenimiento.GridDesgloce.superclass.constructor.call(this, config);
        this.addEvents('cargarDesgloce');
    },
    initDefaultColumns:function(){
        var _this = this;

        this.addGridColumn({
            dataIndex: 'nrodoc',
            header: this.idioma.cgNoOrden,
            width: 120,
            default: true,
            filter : {
                type : 'combo',
                url : '/logistica/talleres/ordentrabajo/index.php/ordentrabajotalleres/cargarnomubicaciontall',
                valueField : 'idubicaciontall',
                displayField: 'denominacion',
                dataIndex : 'ubicacion'
            },
        });//1

        this.addGridColumn({
            dataIndex: 'estado',
            header: "Estado de orden",
            width: 120,
            renderer: function (value) {
              return _this.setestado(value)
            },  
            filter : {
                type: 'list',
                options: [
                    [1, 'Elaboraci&oacute;n'],
                    [2, 'Preparado'],
                    [9, 'Cerrado']
                ],
                dataIndex: 'estado'
            }
        });//2

        this.addGridColumn({
            dataIndex: 'servicio',
            header: this.idioma.cgServicio,
            width: 300,
            default: true
        });//3

        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importetotal',
            header: (alternativa) ? this.idioma.cgImporte+' '+nommonedacontable : this.idioma.cgImporte,
            width: 120,
            default: true
        }));//4

        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importealternativo',
            header: this.idioma.cgImporte+' '+nommonedaalternativa,
            hidden: (alternativa) ? false : true,
            width: 120,
            default: true
        }));//5

        this.addGridColumn( LOG.util.Prototipos.columnaImporte({
            dataIndex: 'importetotal',
            header: "Total",
            width: 120,
            default: true,
            renderer: function(val, x, record) {
                val = (val && val !="")?parseFloat(val):0;
                var alter = record.json.importealternativo;
                alter = (alter && alter !="")?parseFloat(alter):0;
                //console.info(val, alter);
                return parseFloat(val) + parseFloat(alter);
            }
        }));//6
       
    },

    render: function (config) {
        var render = Ext.erp.gridGastosMantenimiento.superclass.render.call(this, config);
        var _this = this;
        this.total = LOG.util.Prototipos.inputDecimal({
            disabled:true,
            value:0
        });
        this.totalAltern = LOG.util.Prototipos.inputDecimal({
            hidden:(alternativa)?false:true,
            disabled:true,
            value:0
        });
        this.totalContab = LOG.util.Prototipos.inputDecimal({
            disabled:true,
            hidden:(alternativa)?false:true,
            value:0
        });
        this.getStorePrincipal().on({
            beforeload:function(st, obj){
                Ext.apply(obj.params, {
                    idactividad: Ext.encode(_this.servicios),
                    entidad: Ext.encode(_this.entidades)
                });
            },
            load:function(){
                var sumCont = 0;
                var sumAlt = 0;
                var sumTotal = 0;
                Ext.each(_this.getStorePrincipal().getRange(),function(rec){
                    sumCont += parseFloat((rec.data.importetotal!="")?rec.data.importetotal:0);
                    sumAlt += parseFloat((rec.data.importealternativo !="")?rec.data.importealternativo:0);
                });
                sumTotal = parseFloat(sumCont) + parseFloat(sumAlt);
                _this.total.setValue(sumTotal);
                _this.totalAltern.setValue(sumAlt);
                _this.totalContab.setValue(sumCont);
            }
        });
        this.gpPrincipal.getBottomToolbar().add(
            '->',new Ext.form.Label({html:'<b>Total '+ nommonedacontable +': </b>', hidden:!alternativa}),
            {text:' ',hidden:!alternativa},this.totalContab,{text:' ',hidden:!alternativa},
            new Ext.form.Label({html:'<b>Total '+ nommonedaalternativa +': </b>', hidden:!alternativa}),
            {text:' ',hidden:!alternativa},this.totalAltern,{text:' ',hidden:!alternativa},
            new Ext.form.Label({html:'<b>Importe total: </b>'}),  {text:' '},this.total,{text:' '}
        );
         
        this.getSmPrincipal().on({
            scope: this,
            rowselect: function (sm, index, record) { 
                this.GridMateriales.getStorePrincipal().load({
                    params: {
                        iddocumento : record.json.iddocumento
                    }
                });
                this.GridMateriales.iddocumento = record.json.iddocumento;
            }
        });

        this.GridMateriales = new Ext.erp.gastosmantenimiento.GridMateriales({
            idioma: this.idioma,
            modelo: this.modelo,
            servicios: this.servicios,
            ordenseleccionada : this.ordenseleccionada
        });
        this.GridMateriales.init();
       
        var vistaMateriales = this.GridMateriales.view({
            forceLayout: false,
            layout: 'border',
            region:'east',
            titleCollapse: true,
            collapsible: true,
           // collapseMode: 'mini',
            animCollapse: false,
            animate: false,
            title: "Detalles de Materiales",
            collapsed:true,
            frame: true,
            width: (Ext.lib.Dom.getViewWidth() - 10) * 0.5,
            expandable:true
        });
        this.getPanelPrincipal().add(vistaMateriales);

        return render;
    },

    setServicios : function(nuevos) {
        this.servicios = nuevos;
    },

    setEntidades : function(nuevos) {
        this.entidades = nuevos;
    },
    setestado : function (value) {
        if (value == 1) {
            return 'Elaboraci\xf3n';
        }if (value == 2) {
            return 'Elaboraci\xf3n';
        }if (value == 3) {
            return 'Aprobado';
        }if (value == 4) {
            return 'Contabilizado';
        }if (value == 5) {
            return 'Eliminado';
        }if (value == 6) {
            return 'Anulado';
        }if (value == 7) {
            return 'Cancelado';
        }if (value == 9) {
            return 'Cerrado';
        }
    }

});

Ext.erp.gastosmantenimiento.GridMateriales = Ext.extend(LOG.util.UITemplate, {
    constructor: function(config) {
        config.dirController = '/logistica/talleres/recuperaciones/index.php/gastosmantenimiento';
        config.urlBusquedaGridPrincipal = 'cargarMateriales';
        config.modoSeleccion = 1;
        config.busquedaBasica = true;
        config.busquedaAvanzada = false;
        config.formaVisualizacion = 'panel';
        config.autoLoad = false;
        config.idioma = '';
        this.iddocumento= '' ;
        this.concepto = config.idioma.ttBuscar;
        this.textBusquedaSimple = config.idioma.ttDeno_Codigo;
        Ext.erp.gastosmantenimiento.GridMateriales.superclass.constructor.call(this, config);
        LOG.util.UIManager.apply(this.idioma, Log.tall.gastosmantenimiento.Idioma)
       
    },
    initDefaultColumns:function(){
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idmaterial',
            hidden:true,
            width: 120,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denominacion',
            header: "Denominacion de material",
            width: 175,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'cantidad',
            header: "Cantidad",
            width: 90,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'importecup',
            header: "Importe",
            width: 109,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'precio',
            header: "Precio",
            width: 109,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'abreviaturaunidadmedida',
            header: "Unidad de Medida",
            width: 110,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'denominacionactividad',
            header: "Material utilizado en",
            width: 300,
            default: true
        });
        this.addGridColumn({
            dataIndex: 'codigo',
            header: "C\xf3digo de material",
            width: 120,
            default: true
        });
       
    },
    
    render: function (config) {
        var render = Ext.erp.gridGastosMantenimiento.superclass.render.call(this, config);
       _this = this;
       _this.getStorePrincipal().on({
        beforeload : function (sto,obj) {
            if (_this.iddocumento != '') {
                Ext.apply(obj.params, {
                    iddocumento: _this.iddocumento
                });    
            }
        }
       })
        return render;
    }
});





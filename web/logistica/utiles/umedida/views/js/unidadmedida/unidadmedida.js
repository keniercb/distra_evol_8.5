Ext.ns('LOG.lb.unidadmedida')
LOG.lb.unidadmedida.View = Ext.extend(LOG.util.Window, {
    width: 500,
    height: 450,
    resizable: false,
    usarAplicar: false,
    constructor: function(config) {
        var _this = this;
        this.idioma = LOG.util.UIManager.apply(LOG.lb.unidadmedida.Idioma, LOG.util.Idioma);
        config.title = _this.idioma.tltitle;
        var grid = new LOG.lb.unidadmedida.gridGeneral({
            idioma: this.idioma,
            idindicador: config.idindicador
        });
        grid.init();
        this.temp = grid.view();
        this.fpImportar = new LOG.util.Panel({
            frame: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 50,
            width: 100,
            height: 100,
            region: 'center',
            items: [
                _this.temp
            ]
        });
        config.items = [this.temp];
        LOG.lb.unidadmedida.View.superclass.constructor.call(this, config);
    }
});

LOG.lb.unidadmedida.gridGeneral = Ext.extend(LOG.util.UITemplate, {
    formaVisualizacion: 'panel',
    idindicador:-1,
    constructor: function(config) {
        this.idioma = config.idioma;
        config.dirController = '/logistica/utiles/umedida/index.php/unidadmedidaoperativa';
        config.urlBusquedaGridPrincipal = 'getUMedidaOperativa';
        config.autoLoad=false;
        config.autoSelect=true;
        config.modoSeleccion=1;
        config.modelo=new LOG.lb.unidadmedida.Model(
            {
                idioma: config.idioma,
                urlController: config.dirController,
                indicador:config.idindicador
            }
        );
        LOG.lb.unidadmedida.gridGeneral.superclass.constructor.call(this, config);
    },
    init: function() {
        LOG.lb.unidadmedida.gridGeneral.superclass.init.call(this);
        this.panelSuperior();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'idconversionum',
            hidden:true
        });
        this.addGridColumn({
            header: this.idioma.cgCbunidadinicial,
            dataIndex: 'idumedidaorigen',
            width: 150,
            default: true,
            renderer:function(value, metaData, record, rowIndex, colIndex, store) {
                _this.umedida = store.reader.jsonData.umedida;
                return _this.getNombreById(value);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCbunidadfinal,
            dataIndex: 'idumedidadestino',
            width: 150,
            default: true,
            renderer:function(value, metaData, record, rowIndex, colIndex, store) {
                _this.umedida = store.reader.jsonData.umedida;
                return _this.getNombreById(value);
            }
        });
        this.addGridColumn({
            header: this.idioma.cgCbcantidadcontenida,
            dataIndex: 'factorconversion',
            width: 200,
            editor:new Ext.form.NumberField({allowBlank:false}),
            default: true
        });
    },
    getNombreById: function(id) {
        var _this=this;
        for (var i = 0; i < _this.umedida.length; i++) {
            if (_this.umedida[i].idunidadmedida == id) {
                return _this.umedida[i].denominacionunidadmedida;
            }
        }
        return '-';
    },
    formPanelSuperior:function(){
       var _this=this;
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        this.cbUMedidaInicial=  new LOG.util.ComboBox({
            fieldLabel: _this.idioma.cgCbunidadinicial,
            valueField: 'idumedidaorigen',
            hiddenName: 'idumedidaorigen',
            displayField: 'nombreum',
            autoLoad: false,
            url:_this.dirController + '/cargarUMedidaOperativaInicial',
            allowBlank :false
        });
        
        this.cbUMedidaInicial.store.baseParams.idindicador = _this.idindicador;
        this.cbUMedidaInicial.store.load();
        this.cbUMedidaFinal= new LOG.util.ComboBox({
            fieldLabel: _this.idioma.cgCbunidadfinal,
            valueField: 'idumedidadestino',
            hiddenName: 'idumedidadestino',
            displayField: 'denominacionunidadmedida',
            url:_this.dirController + '/cargarUMedidaOperativaFinal',
            allowBlank :false
        });
        this.tfCantidad= new LOG.util.Prototipos.inputDecimal({
            fieldLabel: _this.idioma.cgCbcantidadcontenida,
            name:'factorbase',
            allowBlank :false
        });
        cls.addComponent(this.cbUMedidaInicial);
        cls.addComponent(this.cbUMedidaFinal);
        cls.addComponent(this.tfCantidad);
        var btnAdicionar = LOG.util.Prototipos.botonAdicionar({
            tooltip: _this.idioma.ttBtnAdicionar,
            handler: function() {
                if(_this.cbUMedidaInicial.getValue()== _this.cbUMedidaFinal.getValue()){
                    mostrarMensaje(3, _this.idioma.msgDestinoOrigenIguales);
                }else{
                    _this.modelo.adicionar(null,function(){
                         _this.cbUMedidaInicial.store.load();
                    },function(res){
                        
                        mostrarMensaje(3, _this.idioma.msgExisteConversion);
                    });
                   
                    _this.cbUMedidaFinal.reset();
                    _this.cbUMedidaInicial.reset();
                    _this.tfCantidad.reset();
                   
                }
            }
        });
        var btnEliminar = LOG.util.Prototipos.botonEliminar({
            tooltip: _this.idioma.ttBtnEliminar,
            handler: function() {
                _this.modelo.eliminar(null,function(){
                    _this.cbUMedidaInicial.store.load();
                });
                 
            }
        });
        var initForm = LOG.util.UIManager.initForm({
            frame: true,
            items: [cls],
            buttons: [btnAdicionar, btnEliminar]

        });
        return initForm;
    },
    panelSuperior: function() {
        var _scope = this;
        this.getPanelSuperior().onRender = this.getPanelSuperior().onRender.createSequence(function() {
            var formBasico = _scope.formPanelSuperior();
            _scope.modelo.bindForm(formBasico);
            _scope.getPanelSuperior().add(formBasico);
            _scope.getPanelSuperior().doLayout();
        })
    },
    render: function(){
        var vista =  LOG.lb.unidadmedida.gridGeneral.superclass.render.call(this);
        LOG.util.UIManager.apply(this.getStorePrincipal().baseParams, {idindicador : this.idindicador});
        this.getStorePrincipal().load();
        return vista;
    }

});
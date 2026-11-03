Ext.ns('LOG.farm.tarjetamedicamento');
LOG.farm.tarjetamedicamento.View = Ext.extend(LOG.util.UITemplate, {
    constructor: function (config) {
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        LOG.farm.tarjetamedicamento.View.superclass.constructor.call(this, config);
    },
    view:function(){
        var _this =this;
        var vista = LOG.farm.tarjetamedicamento.View.superclass.view.call(this);
        _this.definirAltura();
        this.panelPrincipal.fireEvent = this.panelPrincipal.fireEvent.createSequence(function(e) {
            if(e == 'resize'){
                _this.definirAltura();
            }
        });
        return vista;
    },
    render:function(config) {
        this.panelPrincipal.add(this.getPanelContenido());
        this.setTemplateView(config || {});
        return this.vistaPrincipal;
    },
    getPanelContenido:function(){
        var _this = this;
        this.gridTarjeta = new LOG.farm.tarjetamedicamento.GridView({idioma:this.idioma, formaVisualizacion:'panel', acciones:this.acciones});
        this.gridTarjeta.init();
        this.panelGridTarjeta = this.gridTarjeta.view();

        this.gridTarjeta.getGridPrincipal().getSelectionModel().on({
            rowselect:function(){
                _this.gridProductos.idtarjetamedicamento = _this.gridTarjeta.getSmPrincipal().getSelected().data.iddocumento;
                _this.gridProductos.getStorePrincipal().load();               
            }
        });
        this.gridProductos = new LOG.farm.tarjetamedicamento.GridViewProducto({idioma:this.idioma, formaVisualizacion:'panel', acciones:this.acciones, autoLoad:false});
        this.gridProductos.init();
        this.panelgridProductos = this.gridProductos.view();
        this.gridEntrega = new LOG.farm.tarjetamedicamento.GridEntrega({idioma:this.idioma, formaVisualizacion:'panel', acciones:this.acciones, autoLoad:false});
        this.gridEntrega.init();
        this.panelgridEntrega = this.gridEntrega.view();
        this.gridProductos.getStorePrincipal().on({
            load: function(st) {
                if( st.totalLength == 0) 
                    _this.gridEntrega.getStorePrincipal().load();           
            }
        });
        this.gridProductos.getSmPrincipal().on({
            selectionchange:function(sm){
                if(sm.hasSelection() && sm.getCount()==1) {
                    _this.gridEntrega.idventacliente
                        = sm.getSelected().data.idpaciente;
                    _this.gridEntrega.idproducto
                        = sm.getSelected().data.idproducto;
                    _this.gridEntrega.idproductotarjetamedicamento
                        = sm.getSelected().data.idproductotarjetamedicamento;
                    _this.gridEntrega.getStorePrincipal().load();
                }
                else if(sm.getCount()==0) {
                    _this.gridEntrega.idventacliente = -1;
                    _this.gridEntrega.idproducto = -1;
                    _this.gridEntrega.idproductotarjetamedicamento = -1;
                }
            },
            rowdeselect:function(sm) {
                if (sm.getSelections().length == 0) {
                    _this.gridEntrega.idventacliente = -1;
                    _this.gridEntrega.idproducto = -1;
                    _this.gridEntrega.idproductotarjetamedicamento = -1;
                    _this.gridEntrega.getStorePrincipal().load();
                }     
            }
        });
        var cls =  LOG.util.UIManager.initColumnForm({
            columnas: 2,
            defaultsAnchor:'100%'
        });
        cls.addComponent(this.panelgridProductos);
        cls.addComponent(this.panelgridEntrega);
        this.panelContenedor =  new Ext.Panel({
            region:'center',
            items:[ new LOG.util.Panel({ autoHeight:true, items:[this.panelGridTarjeta]}),
                new LOG.util.Panel({autoHeight:true, items:[cls]})]
        });
        return this.panelContenedor;
    },
    definirAltura:function(){
        var alto = this.panelPrincipal.getHeight()-5;
        this.panelGridTarjeta.setHeight(alto/2);
        this.panelGridTarjeta.doLayout();
        this.panelgridProductos.setHeight(alto/2);
        this.panelgridProductos.doLayout();
        this.panelgridEntrega.setHeight(alto/2);
        this.panelgridEntrega.doLayout();
    }
});

LOG.farm.tarjetamedicamento.GridView = Ext.extend(LOG.lb.documento.View, {    
    constructor: function(config) {
        this.busquedaBasica = true;
        this.busquedaAvanzada = true;
        this.modoSeleccion = 2;
        this.autoSelect=true;
        this.dirController = '/logistica/farmacia/farmacia/index.php/tarjetamedicamento';
        config.urlBusquedaGridPrincipal = 'cargarTarjetas';
        this.idioma = LOG.util.UIManager.apply(config.idioma, LOG.farm.tarjetamedicamento.Idioma);
        this.concepto = this.idioma.tlBtnBuscar;
        this.textBusquedaSimple = this.idioma.lbNroTarjeta;
        LOG.farm.tarjetamedicamento.GridView.superclass.constructor.call(this, config);
        this.modelo = new LOG.farm.tarjetamedicamento.Model({
            idioma: config.idioma
        });
        this.dirReport = '/logistica/farmacia/tarjeta/';
        this.name = 'TarjetaMedicamento'
        this.autoExpandColumn = 'paciente';

        this.winGestionarDocumento = new LOG.farm.tarjetamedicamento.VentanaAdicionar({
            idioma: config.idioma,
            modelo: this.modelo,
            scope: this,
            title: "Adicionar tarjeta de medicamentos controlados",
            width: 750,
            acciones:this.acciones
        });
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({
            dataIndex: 'iddocumento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idpaciente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idproductotarjetamedicamento',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idventacliente',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'numeroref',
            header: this.idioma.cgNumeroTarjeta,
            width: 80,
            renderer:function(val,x,rec){
                if(val !='')
                    return val;
                else return rec.json.numeroref;
            }
        })
		this.addGridColumn({
            dataIndex: 'nrodoc',
            header: 'Nro de tarjeta real',
            width: 80
        });
        this.addGridColumn({
            dataIndex: 'nombre',
            //header: this.idioma.cgPaciente,
            header: (farmacia === 1) ? this.idioma.cgPaciente: 'Jefe Nucleo',
            width: 150,
            id:'paciente',
            renderer:function(value, x, record){
                var nb = value;
                var snombre = (record.json.snombre)?" "+record.json.snombre:"";
                return nb + snombre;
            }
        });
        this.addGridColumn({
            dataIndex: 'estado',
            header: this.idioma.cgEstado,
            width: 90,
            renderer: function(v) {
                return LOG.lb.documento.Estado[v];
            }
        });
        this.addGridColumn({
            dataIndex: 'cantidadproductos',
            header: this.idioma.cgCantProductos,
            align: 'right',
            width: 90,
            renderer: function(value) {
                if (!value)
                    return 0;
                else
                    return value;
            }
        });
        this.addGridColumn({
            dataIndex: 'creadopor',
            header: this.idioma.cgCreadoPor,
            width: 150,
        });
        this.addGridColumn({
            dataIndex: 'fechacontable',
            align: 'center',
            header: this.idioma.cgFechaCreacion,
            width: 130,
        });
        this.addGridColumn({
            dataIndex: 'aprobadopor',
            header: this.idioma.cgAprobadoPor,
            width: 150,
        });

        this.addGridColumn({
            dataIndex: 'retrovirales',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'nrocasoindice',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'numeroidentidad',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'direccion',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'consultoriomedico',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'area',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idpais',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idprovincia',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'idmunicipio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'sexo',
            hidden: true
        });
   
        this.addGridColumn({
            dataIndex: 'datosnull',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'telefono',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'correo',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'provincia',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'municipio',
            hidden: true
        });
        this.addGridColumn({
            dataIndex: 'fechainscripcion',
            hidden: true
        });
    },
    initDefaultButtons: function() {
        LOG.farm.tarjetamedicamento.GridView.superclass.initDefaultButtons.call(this);
        var _this = this;
        this.listaBotones.delete(0);
        this.insertToolbarButton(LOG.util.Prototipos.botonNuevo({
            text: this.idioma.lbBtnNuevo,
            tooltip: this.idioma.ttBtnAdicionarTarjeta,
            handler: function() {
                _this.initVentanaGestion(null, 1, null, null);
            },
            controlFn: function(b, _caller){
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAdicionar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
            }
        }), 0);
        LOG.util.UIManager.apply(this.listaBotones.getItem(1), {
            tooltip: this.idioma.ttBtnAbrirTarjeta,
            isContextual: true
        });
        LOG.util.UIManager.apply(this.listaBotones.getItem(2), {
            tooltip: this.idioma.ttBtnEliminarTarjeta,
            handler: function() {
                if (_this.getGridPrincipal().getSelectionModel().getSelected() && _this.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                    _this.modelo.eliminar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('REliminar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getSmPrincipal().fireEvent = _caller.getSmPrincipal().fireEvent.createSequence(function(e) {

                    if (e == 'selectionchange') {
                        if (this.getCount() >= 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 1)
                                b.enable();
                            else
                                b.disable();
                        }
                        else {
                            b.disable();
                        }
                    }
                });
            }
        });
        this.insertToolbarButton(new LOG.util.Prototipos.botonConfirmar({
            tooltip: 'Confirmar tarjeta de control',
            isContextual: true,
            disabled: true,
            handler: function() {
                _this.modelo.confirmar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RConfirmar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);

                _caller.getGridPrincipal().getSelectionModel().fireEvent
                    = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                var dataActual = _caller.getGridPrincipal().getSelectionModel().getSelected().json;
                                if (dataActual.estado == 1 && dataActual.datosnull == 0 && dataActual.cantidadproductos > 0) {
                                     b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                        if (this.getCount() == 1 && this.getSelected().data.estado == 1) {
                            b.enable();
                        } else {
                            b.disable();
                        }
                    }
                });
            }
        }), 3);
        this.insertToolbarButton(new LOG.util.Prototipos.botonAnularEstado({
            tooltip: 'Anular estado',
            isContextual: true,
            handler: function() {
                _this.modelo.anularestado();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAnularestado')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        }), 4);
        this.insertToolbarButton(new LOG.util.Prototipos.botonAprobar({
            tooltip:this.idioma.ttBtnAprobarTarjeta,
            isContextual: true,
            handler: function() {
                _this.modelo.aprobar();
            },
            controlFn: function(b, _caller) {
                if( _caller.grantedAction('CT') || _caller.grantedAction('RCRUD')|| _caller.grantedAction('RAprobar')){
                    b.setVisible(true);
                }
                else  b.setVisible(false);
                b.disable();
                _caller.getGridPrincipal().getSelectionModel().fireEvent = _caller.getGridPrincipal().getSelectionModel().fireEvent.createSequence(function(e) {
                    if (e == 'selectionchange') {
                        if (this.getCount() == 1) {
                            if (_caller.getGridPrincipal().getSelectionModel().getSelected()) {
                                if (_caller.getGridPrincipal().getSelectionModel().getSelected().data.estado == 2) {
                                    b.enable();
                                }
                                else
                                    b.disable();
                            }
                        } else {
                            b.disable();
                        }
                    }
                });

            }
        }), 5);

        this.insertToolbarButton (LOG.util.UIManager.createBtn({
            text: 'Importar',
            tooltip: 'Importar tarjetas',
            iconCls: 'importar',
            isContextual: true,
            handler: function() {
                var win = new LOG.lb.importar.View({            
                   class: 'TarjetaMedicamentoModel', 
                    fn: function(r) {
                          _this.getStorePrincipal().load();
                          if(r.error == 4){
                            _this.mostrarError(
                               ((r.error == 1 ? _this.idioma.msjErrorTarjeta :'Fueron importados: ' +  r.importados + ' ,actualizados: ' +  r.actualizados + ' y descartados: ' +  r.descartados )),
                            
                                );
                          }
                    
                    }
                });
                win.show();
            }, 
           controlFn: function(b, _caller) {
                if (_caller.grantedAction('CT') || _caller.grantedAction('RImportar')) {
                    b.setVisible(true);
                    b.enable();
                } else {
                    b.setVisible(false);
                    b.disable();
                }
            }
        }),7);
        LOG.util.UIManager.apply(this.listaBotones.getItem(8), {
            id: 'ayudatarjetamedicamento'
        });
    },
    view: function()  {
        var _this = this;
        _this.getPanelBusqueda().setColumns(1);
        var cls = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        this.textoCIPacienteBA = LOG.util.Prototipos.inputTexto({
            name: (farmacia === 1)? 'cipaciente': 'CI Jefe Núcleo',
            fieldLabel: (farmacia === 1)? 'cipaciente': 'CI Jefe Núcleo',
            width: 410,
            maxLength: 11,
            regex: LOG.util.Regex.carnet,
            maskRe: /\d/,
            enableKeyEvents: true
        });
		this.textNoTarjeta = LOG.util.Prototipos.inputEntero({
            name: 'nrotarjeta',
            fieldLabel: 'Nro de tarjeta real',
            width: 410,
            regex: LOG.util.Regex.digito,
            maxLength: 50,
            enableKeyEvents: true
        });
        this.comboEstadoBA = new LOG.util.ComboBox({
            fieldLabel: 'Estado tarjeta',
            hiddenName: 'estado',
            valueField: 'idestado',
            displayField: 'estado',
            editable: false,
            mode: 'local',
            minChars:1,
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    [7, LOG.lb.documento.Estado[7]],
                    [9, LOG.lb.documento.Estado[9]]
                ]
            })
        });
        this.textoNombre = LOG.util.Prototipos.inputTexto({
            name: 'nombre',
            fieldLabel: 'Nombre y Apellidos',
            width:410,
            maxLength: 300,
            regex: LOG.util.Regex.nombre,
            enableKeyEvents: true
        });
        cls.addComponent(this.textNoTarjeta);
        cls.addComponent(this.textoCIPacienteBA);
        cls.addComponent(this.comboEstadoBA);
        cls.addComponent(this.textoNombre);
        _this.addFilterComponent(cls);
        var clsmedio = LOG.util.UIManager.initColumnForm({
            columnas: 3
        });
        
        _this.addFilterComponent(clsmedio);
        var clsUsuarios = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });

        this.comboCreadoPorBA = new LOG.util.ComboBox({
            fieldLabel: 'Creado por',
            url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/getallusers',
            name: 'creadopor',
            queryParam:'criterio',
            displayField: 'nombreusuario',
            valueField: 'idusuario',
            minChars:1,
            mode: 'remote',
            pageSize : 20,
            resizable:true,
            editable:false
        });
        this.comboAprobadoPorBA = new LOG.util.ComboBox({
            fieldLabel: 'Aprobado por',
            url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/getallusers',
            name: 'aprobadopor',
            queryParam:'criterio',
            displayField: 'nombreusuario',
            valueField: 'idusuario',
            minChars:1,
            mode: 'remote',
            pageSize : 20,
            resizable:true,
            editable:false
        });
        this.dfFechaInicioBA = new Ext.form.DateField({
            name: 'fechainicio',
            endDateField: 'fin',
            vtype:'datrange',
            fieldLabel: this.idioma.lbFechaInicio,
            width: 200,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false
         
        });
        this.dfFechaFinBA = new Ext.form.DateField({
            name: 'fechafin',
            format: 'd/m/Y',
            vtype:'daterange',
            fieldLabel: this.idioma.lbFechaFin,
            width: 200,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
          
        });
        this.comboProductoBA = new LOG.util.ComboBox( {
            fieldLabel: 'Producto',
            //autoLoad:true,
            url: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento/cargarProductosTarjeta',
            name: 'idindicador',
            queryParam:'idindicador',
            displayField: 'denominacion',
            valueField: 'idindicador',
			forceSelection: true,
            //minChars:1,
            mode: 'local',
            pageSize : 20,
            resizable:true,
            editable:true
        });
        this.dfFechaEmisionBA = new Ext.form.DateField({
            name: 'fechaemision',
            format: 'd/m/Y',
            vtype:'daterange',
            fieldLabel: 'Fecha emisi\xf3n',
            width: 200,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            getValue : function(){
                var dat = this.parseDate(Ext.form.DateField.superclass.getValue.call(this));
                if(dat instanceof Date){
                return dat.format(this.format);
                }
                return dat || "";
                }

        });
        this.dfFechaExpiracionBA = new Ext.form.DateField({
            name: 'fechaexpiracion',
            format: 'd/m/Y',
            vtype:'daterange',
            fieldLabel: 'Fecha expiraci\xf3n',
            width: 200,
            invalidText: this.idioma.ttTextoFechaIncorrecto,
            editable: false,
            getValue : function(){
                var dat = this.parseDate(Ext.form.DateField.superclass.getValue.call(this));
                if(dat instanceof Date){
                return dat.format(this.format);
                }
                return dat || "";
                }
           
        });
        clsUsuarios.addComponent(this.comboCreadoPorBA);
        clsUsuarios.addComponent(this.comboAprobadoPorBA);
        var clsProducto = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        clsProducto.addComponent(this.comboProductoBA);
        var clsBajo = LOG.util.UIManager.initColumnForm({
            columnas: 2
        });
        clsBajo.addComponent(this.dfFechaEmisionBA);
        clsBajo.addComponent(this.dfFechaExpiracionBA);
        clsBajo.addComponent(this.dfFechaInicioBA);
        clsBajo.addComponent(this.dfFechaFinBA);
        _this.addFilterComponent(clsUsuarios);
        _this.addFilterComponent(clsProducto);
        _this.addFilterComponent(clsBajo);

       
        return LOG.farm.tarjetamedicamento.View.superclass.view.call(this);
    },
    render: function() {
        var vista = LOG.farm.tarjetamedicamento.GridView.superclass.render.call(this);
        this.gpPrincipal.autoExpandColumn = 'paciente';
        
        return vista;
    },
    initVentanaGestion: function (d, tipoVentana, noCargar) {
        if (!this.winGestionarDocumento.isInit()) {
            this.winGestionarDocumento.init();
            if (this.winGestionarDocumento.formularioGeneral != null) {
                this.winGestionarDocumento.addPanelSuperior(this.winGestionarDocumento.formularioGeneral);
            }
            if (this.formularioSur != null) {
                this.winGestionarDocumento.addPanel(this.formularioSur);
            }
            if (this.formularioEste != null) {
                this.winGestionarDocumento.addPanel(this.formularioEste);
            }
            if (this.formularioOeste != null) {
                this.winGestionarDocumento.addPanel(this.formularioOeste);
            }
        }
        this.winGestionarDocumento.tipoVentana = tipoVentana || 1;

        if (d) {
            this.winGestionarDocumento.prepareDocModify(d, noCargar);
        } else {
            this.winGestionarDocumento.fromularioGestion.getForm().loadRecord({data: {}});
            this.winGestionarDocumento.gridProductosG.idtarjetamedicamento = undefined;
            this.winGestionarDocumento.setTitle(this.idioma.tlAdicionar);
        }
        this.winGestionarDocumento.show();
        this.winGestionarDocumento.maximize();
    },
    getParamsReport:function (record, btn) {
        return btn.isList ? {
            nrotarjeta: this.textNoTarjeta.getValue() || null,
            nombre: this.textoNombre.getValue() || null,
            fechainicio: this.dfFechaInicioBA.getValue() || null,
            fechafin: this.dfFechaFinBA.getValue() || null,
            fechaexpiracion: this.dfFechaExpiracionBA.getValue() || null,
            fechaemision: this.dfFechaEmisionBA.getValue() || null,
            estado: this.comboEstadoBA.getValue() || null,
            creadopor: this.comboCreadoPorBA.getValue() || null,
            cipaciente: this.textoCIPacienteBA.getValue() || null,
            aprobadopor: this.comboAprobadoPorBA.getValue() || null,
            idcuadrobasico: this.comboProductoBA.getValue() || null,

        }:{
           iddocumento: record.get("iddocumento"),
           
       };

    },
    mostrarError: function(msg,diferencia) { 
        var _this = this;
        Ext.MessageBox.show({
            msg: msg,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.INFO,
            fn: function() {
                var win = new LOG.farm.tarjetamedicamento.Error({idioma: _this.idioma, diferencia: diferencia});
                win.init();
                win.view();
            }
        });
    },
});

LOG.farm.tarjetamedicamento.Error = Ext.extend(LOG.util.UITemplate, {
    dirController: '/logistica/farmacia/farmacia/index.php/tarjetamedicamento',
    /**
     * Nombre de la funcion de busqueda principal de datos.
     * @type String
     */
    urlBusquedaGridPrincipal: 'cargarProductoError',
    /**
     * Forma en que se muestra el componente (default = "viewport", "ventana", "panel").
     * @type String
     */
    formaVisualizacion: 'ventana',
    /**
     * Determina si se carga automaticamente el store.
     * @type Boolean
     */
    autoLoad: false,
    /**
     * Constructor de la clase.
     * @param {Object} config
     * @returns {undefined}
     */
    constructor: function(config) {
        this.formaVisualizacion = 'ventana';
        this.autoLoad = false;
        this.autoSelect = false;
        LOG.farm.tarjetamedicamento.Error.superclass.constructor.call(this, config);
        this.getVistaPrincipal().title = config.idioma.tlError;
        this.getVistaPrincipal().width = 800;
        this.getVistaPrincipal().height = 400;
        this.getVistaPrincipal().listaBotones.getItem(1).hide();
        this.getVistaPrincipal().listaBotones.getItem(2).hide();
    },
    initDefaultColumns: function() {
        var _this = this;
        this.addGridColumn({dataIndex: 'idimptarjeta'});
        this.addGridColumn({
            header: this.idioma.cgCarnetIdentidad,
            width: 80,
            dataIndex: 'numeroidentidad',        
            default: true
        });
        this.addGridColumn({
            //header: this.idioma.cgPaciente,
            header: (farmacia === 1) ? this.idioma.cgPaciente: 'Jefe Nucleo',
            autoExpand: true,
            dataIndex: 'nombrepaciente',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgDireccion,
            width: 40,
            dataIndex: 'direccion',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgCMF,
            width: 40,
            dataIndex: 'cmf',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgProvincia,
            width: 40,
            dataIndex: 'provincia',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMunicipio,
            width: 40,
            dataIndex: 'municipio',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgMedicamento,
            width: 40,
            dataIndex: 'medicamento',
            default: true
        });
        this.addGridColumn({
            header: (farmacia === 1) ? this.idioma.cgDosisMensual: 'Cuota Mensual',
            width: 40,
            dataIndex: 'dosis',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgNombreMedico,
            width: 40,
            dataIndex: 'nombremedico',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgRegistro,
            width: 40,
            dataIndex: 'nroregistro',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgPoliclinico,
            width: 40,
            dataIndex: 'policlinico',
            default: true
        });
        this.addGridColumn({
            header: (farmacia === 1) ? this.idioma.cgHospital: 'OFICODA',
            width: 40,
            dataIndex: 'hospital',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgOtrasUnidades,
            width: 40,
            dataIndex: 'otrasunidades',
            default: true
        });
        this.addGridColumn({
            header: this.idioma.cgFechaExpedicion,
            width: 40,
            dataIndex: 'fechaexpedicion',
            default: true
        });
        this.addGridColumn({
            header: 'Motivo',
            width: 40,
            dataIndex: 'motivodescarte',
            default: true,
            agrupador:true
        });
    },
    initDefaultButtons: function (){
        this.addToolbarButton(LOG.util.Prototipos.botonGeneral({
            text: 'Exportar tarjetas de medicamentos',
            tooltip: 'Exportar tarjetas de medicamentos',
            iconCls: 'exportar',
            disabled: false,
            handler: function () {
                var _this = this;
                Ext.MessageBox.wait(LOG.util.Idioma.msgExportando, LOG.util.Idioma.msgEspere);
                Ext.Ajax.request({
                    url: 'imprimirExcel',
                    method: 'POST',
                     params: {
                    },
                    callback: function (o, s, r) {
                        Ext.MessageBox.hide();
                        var resp = LOG.util.UIManager.decodeAjaxResponse(r);
                        var wCfg = 'titlebar=yes,status=yes,resizable=yes,width=' + screen.width + ',height=' + screen.height + ',scrollbars=' + 1 + ',menubar = yes';
                        window.open(resp.dirFichero, 'ventana', wCfg);
                    }.createDelegate(_this)
                });
            }
        }), 2);
    },
    render: function() {
        var _this = this;
        var render =LOG.farm.tarjetamedicamento.Error.superclass.render.call(this);
       
        this.getStorePrincipal().on({
            beforeload: function() {
                this.baseParams.diferencia = this.initBaseParams.diferencia = _this.diferencia || null;
            },
            load: function() {
                this.each(function(p, index) {
                    if (p.json.numeroidentidad) {
                        if (p.json.numeroidentidad == null) {                    
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index,2)).addClass('fila-verde');
                        }else{
                            Ext.fly(_this.getGridPrincipal().getView().getCell(index,2)).addClass('fila-roja');
                             }                    
                    }
                   if (p.json.codigoproducto == null) {
                  
                        Ext.fly(_this.getGridPrincipal().getView().getCell(index, 3)).addClass('fila-verde');
                    }
                
                });
            }
        });

        this.getStorePrincipal().load();
        this.getVistaPrincipal().closeFn = function() {
            Ext.Ajax.request({
                url: 'eliminarImportar',
                method: 'POST',
            });
        };
        return render;
    }
});
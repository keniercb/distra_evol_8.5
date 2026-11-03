Ext.ns("Ext.components.CmpReccomplejas");
Ext.components.CmpReccomplejas.WinGestBusquedas = Ext.extend(Ext.Window,{
    layout:'border',
    modal: true,
    height:470,
    width:800,
    maximizable: true,
    
    initComponent: function() {
        var self = this;
        this.title = self.idioma.lbTitGpBusquedas;
        
        var btnAyuda = new Ext.Button({
            iconCls:'ayuda',
            text:self.idioma.lbBtnAyuda,
            tooltip: self.idioma.ttpBtnAyuda,
            handler:mostrarAyuda,
            id:'btnAyuda'+self.id,
            nextTab:'btnImportar'+self.id,
            prevTab:'btnLimpiar'+self.id
        });
        var btnAsignarBusqueda = new Ext.Button({
            disabled:true,
            hidden:true,
            iconCls:'aplicar',
            text:self.idioma.lbBtnAsignar,
            tooltip: self.idioma.ttpBtnAsignar,
            handler: asignarBusqueda
        });
        var btnBusquedaPorDefecto = new Ext.Button({
            disabled:true,
            iconCls:'aprobar',
            text: self.idioma.lbBtnSearchByDefault,
            tooltip: self.idioma.ttpBtnSearchByDefault,
            handler: setBusquedaPorDefecto
        });
        var btnEliminar = new Ext.Button({
            disabled:true,
            iconCls:'eliminar',
            text:self.idioma.lbBtnEliminar,
            tooltip: self.idioma.ttpBtnElimBusqueda,
            handler: eliminarBusqueda
        });
        var btnModificar = new Ext.Button({
            disabled:true,
            iconCls:'modificar',
            text:self.idioma.lbBtnModificar,
            tooltip: self.idioma.ttpBtnModBusqueda,
            handler: modificarBusqueda
        });
        var btnGestAvisos = new Ext.Button({
            disabled:true,
            hidden: self.noUsarGestAvisos,
            iconCls:'agrupacion',
            text:self.idioma.lbBtnGestAvisos,
            tooltip: self.idioma.ttpBtnGestAvisos,
            handler: gestionarAvisos
        });
        var btnCargarBusqueda = new Ext.Button({
            disabled:true,
            iconCls:'generadorreportes',
            text:self.idioma.lbBtnCargarBusqueda,
            tooltip: self.idioma.ttpBtnCargarBusqueda,
            handler: importConfBusqueda,
            id:'btnImportar'+self.id,
            prevTab:'btnAyuda'+self.id
        });
        var btnActivarAviso = new Ext.Button({
            disabled:true,
            hidden: self.noUsarGestAvisos,
            iconCls:'activo',
            text:self.idioma.lbActivar,
            tooltip: self.idioma.ttpBtnActivarAviso,
            handler: activarDesactivarAviso
        });
        var btnBuscar = new Ext.Button({
            iconCls:'buscar',
            text:self.idioma.lbBtnBuscar,
            tooltip:self.idioma.ttpBtnBuscar,
            handler: filtrarBusquedas,
            id:'btnBuscar'+self.id
        });
        var btnLimpiar = new Ext.Button({
            iconCls:'limpiar',
            text:self.idioma.lbBtnLimpiar,
            tooltip:self.idioma.ttpBtnFiltros,
            handler: limpiarFiltros,
            id:'btnLimpiar'+self.id
        });
		
		this.btnCerrarWin = new Ext.Button({
            iconCls:'cerrar',
            text:self.idioma.lbBtnCerrar,
            tooltip: self.idioma.ttpBtnCerrar,
            handler:function(){
				self.close();
			},
            id:'btnCerrarWin'+self.id,
            //prevTab:'btnAyuda'+self.id,
			//nextTab:+self.id
		});
		
        this.keys = [{
            key: 'a',
            alt:true,
            ctrl:true,
            fn: activarDesactivarAviso
        },{
            key: 'g',
            alt:true,
            ctrl:true,
            fn: gestionarAvisos
        },{
            key: 'j',
            alt:true,
            fn: importConfBusqueda
        },{
            key: 'b',
            alt:true,
            fn: filtrarBusquedas
        },{
            key: 'l',
            alt:true,
            fn: limpiarFiltros
        },{
            key: 'm',
            alt:true,
            fn: modificarBusqueda
        },{
            key: 46,
            fn: eliminarBusqueda
        },{
			key:'x',
			alt:true,
			ctrl:true,
			fn:function(){
				self.btnCerrarWin.handler();
			}
		}
        ];

        var tfCodigo = new Ext.form.TextField({
            fieldLabel: self.idioma.lbCodigo,
            emptyText: self.idioma.lbCriterioBuscarText,
            regex: /^([a-zA-Z0-9áéíóúñüÑ]+ ?[a-zA-Z0-9áéíóúñüÑ]*)+$/,
            maskRe: /^([a-zA-Z0-9áéíóúñüÑ]+ ?[a-zA-Z0-9áéíóúñüÑ]*)+$/,
            hidden: self.noUsarGestAvisos,
            hideLabel: self.noUsarGestAvisos,
            maxLength: 255,
            anchor: '95%',
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        filtrarBusquedas();
                    }
                }
            }
        });

        var tfDenominacion = new Ext.form.TextField({
            fieldLabel: self.idioma.lbDenominacion,
            regex: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            maskRe: /^([a-zA-Z0-9áéíóúñüÑ ]+ ?[a-zA-Z0-9áéíóúñüÑ ]*)+$/,
            maxLength: 255,
            anchor: '95%',
            emptyText: self.idioma.lbCriterioBuscarText,
            regexText: self.idioma.msgAlfaNumericCharacter,
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        filtrarBusquedas();
                    }
                }
            }
        });

        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template('<p><b>Descripci&oacute;n:</b> {descripcion}</p>')
        });

        this.stBusquedas = new Ext.data.Store({
            url: '/reccomplejas/index.php/reccomplejas/obtenerBusquedas',
            baseParams: {
                idconfiguracion: self.idconfiguracion,
                noUsarGestAvisos: self.noUsarGestAvisos
            },
            reader : new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad'
            }, [
            {
                name: 'idbusqueda'
            },{
                name: 'codigo'
            },{
                name: 'denominacion'
            },{
                name: 'descripcion'
            },{
                name: 'idaviso'
            },{
                name: 'sistema'
            },{
                name: 'sms'
            }, {
                name: 'correo'
            }, {
                name: 'jabber'
            }, {
                name: 'activo'
            },{
                name: 'tablasvisitadas'
            },{
                name: 'pordefecto'
            },{
                name: 'propietario'
            },{
                name: 'idbusquedausuario'
            }
            ])
        });

        this.getColumnModel = function(){
            var cmBusquedas = new Array();
            if(self.noUsarGestAvisos == true){
                cmBusquedas = [expander,
                {
                    id:'denom',
                    dataIndex: 'denominacion',
                    sortable: true,
                    header: self.idioma.lbDenominacion,
                    width:200
                },
                {
                    dataIndex: 'pordefecto',
                    sortable: true,
                    header: self.idioma.lbBtnSearchByDefault,
                    width:80,
                    renderer: showTick
                }
                ];
            }
            else{
                cmBusquedas = [expander,
                {
                    dataIndex: 'codigo',
                    sortable: true,
                    header: self.idioma.cmCodigo,
                    width:80
                },

                {
                    id:'denom',
                    dataIndex: 'denominacion',
                    sortable: true,
                    header: self.idioma.lbDenominacion,
                    width:200
                },

                {
                    dataIndex: 'pordefecto',
                    sortable: true,
                    header: self.idioma.lbBtnSearchByDefault,
                    width:200
                },

                {
                    dataIndex: 'idaviso',
                    sortable: true,
                    header: self.idioma.cmAviso,
                    width:60,
                    renderer: showTickAviso
                },

                {
                    hidden:'true',
                    dataIndex: 'sistema',
                    sortable: true,
                    header: self.idioma.cmSistema,
                    width:60,
                    renderer: showTickContent
                },

                {
                    dataIndex: 'correo',
                    sortable: true,
                    header: self.idioma.cmCorreo,
                    width:60,
                    renderer: showTickContent
                },

                {
                    dataIndex: 'jabber',
                    sortable: true,
                    header:self.idioma.cmJabber,
                    width:60,
                    renderer: showTickContent
                },

                {
                    dataIndex: 'sms',
                    sortable: true,
                    header: self.idioma.cmSMS,
                    width:60,
                    renderer: showTickContent
                },

                {
                    dataIndex: 'activo',
                    sortable: true,
                    header: self.idioma.cmActivo,
                    width:60,
                    renderer: showImage
                }
                ];
            }
            return cmBusquedas
        }

        var paginadoGpBusqueda = new Ext.PagingToolbar({
            pageSize: 15,
            store: self.stBusquedas,
            displayInfo: true,
            displayMsg: 'Resultados {0} - {1} de {2}',
            emptyMsg: self.idioma.lbEmptyMsg
        });

        var smBusqueda = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                rowselect: function(sm, rowIndex, record){
                    if(record.get('idaviso') != null){
                        btnActivarAviso.enable();
                        if(record.get('activo') == 1){
                            btnActivarAviso.setText(self.idioma.lbDesactivar);
                            btnActivarAviso.setIconClass('inactivo');
                        }else{
                            btnActivarAviso.setText(self.idioma.lbActivar);
                            btnActivarAviso.setIconClass('activo');
                        }
                    }else{
                        btnActivarAviso.disable();
                    }
                    btnCargarBusqueda.enable();
                    btnModificar.enable();
                    btnEliminar.enable();
                    btnAsignarBusqueda.enable();
                    btnBusquedaPorDefecto.enable();
                    btnGestAvisos.enable();
                }
            }
        });

        this.gpBusquedas = new Ext.grid.GridPanel({
            stripeRows:true,
            region:'center',
            store: self.stBusquedas,
            columns: self.getColumnModel(),
            bbar: paginadoGpBusqueda,
            autoExpandColumn: 'denom',
            plugins: expander,
            loadMask:{
                msg: self.idioma.lbGridLoadMask
            },
            sm: smBusqueda,
            title: self.idioma.lbGpListBusquedas,
            margins:'0 5 5 5'
        });

        function modificarBusqueda(){
            if(smBusqueda.hasSelection()){
                if(smBusqueda.getSelected().get('idaviso') != null){
                    mostrarMensaje(2, self.idioma.lbMsgConfirmModAviso, function(btn){
                        if(btn == "ok"){
                            var winGuardarBusqueda = new Ext.components.CmpReccomplejas.WinSalvarBusqueda({
                                title: self.idioma.lbTitWinModBusqueda,
                                idioma: self.idioma,
                                idbusqueda: smBusqueda.getSelected().get('idbusqueda'),
                                idconfiguracion: self.idconfiguracion,
                                denominacion: smBusqueda.getSelected().get('denominacion'),
                                codigo: smBusqueda.getSelected().get('codigo'),
                                descripcion: smBusqueda.getSelected().get('descripcion'),
                                idaviso: smBusqueda.getSelected().get('idaviso'),
                                contenidoAviso: buildTemplateGestAviso(),
                                noUsarGestAvisos: self.noUsarGestAvisos
                            });
                            winGuardarBusqueda.show();
                            winGuardarBusqueda.on('close', function(component){
                                self.stBusquedas.reload({
                                    params: {
                                        limit:15,
                                        start: 0
                                    }
                                });
                                btnActivarAviso.disable();
                                btnCargarBusqueda.disable();
                                btnModificar.disable();
                                btnEliminar.disable();
                                btnAsignarBusqueda.disable();
                                btnBusquedaPorDefecto.disable();
                                btnGestAvisos.disable();
                            });
                        }
                    });
                }else{
                    var winGuardarBusqueda = new Ext.components.CmpReccomplejas.WinSalvarBusqueda({
                        title: self.idioma.lbTitWinModBusqueda,
                        idioma: self.idioma,
                        idbusqueda: smBusqueda.getSelected().get('idbusqueda'),
                        idconfiguracion: self.idconfiguracion,
                        denominacion: smBusqueda.getSelected().get('denominacion'),
                        codigo: smBusqueda.getSelected().get('codigo'),
                        descripcion: smBusqueda.getSelected().get('descripcion'),
                        noUsarGestAvisos: self.noUsarGestAvisos
                    });
                    winGuardarBusqueda.show();
                    winGuardarBusqueda.on('close', function(component){
                        self.stBusquedas.reload({
                            params: {
                                limit:15,
                                start: 0
                            }
                        });
                        btnActivarAviso.disable();
                        btnCargarBusqueda.disable();
                        btnModificar.disable();
                        btnEliminar.disable();
                        btnAsignarBusqueda.disable();
                        btnBusquedaPorDefecto.disable();
                        btnGestAvisos.disable();
                    });
                }
            }
        }

        function eliminarBusqueda(){
            if(smBusqueda.hasSelection()){
                mostrarMensaje(2, ((smBusqueda.getSelected().get('idaviso') != null) ? self.idioma.lbMsgConfirmElimAviso : self.idioma.lbMsgConfirm), function(btn){
                    if(btn == "ok"){
                        PVD.mostrarMascara('idmskelimbusqueda', self.idioma.lbporfavorespere, self.idioma.lbEliminarBusqueda);
                        Ext.Ajax.request({
                            url: '/reccomplejas/index.php/reccomplejas/eliminarBusqueda',
                            method:'POST',
                            params: {
                                idbusqueda: smBusqueda.getSelected().get('idbusqueda'),
                                idaviso: smBusqueda.getSelected().get('idaviso'),
                                noUsarGestAvisos: self.noUsarGestAvisos
                            },
                            callback: function (options,success,response){
                                PVD.ocultarMascara('idmskelimbusqueda');
                                var datos = Ext.util.JSON.decode(response.responseText);
                                if(datos.codMsg==1){
                                    mostrarMensaje(1,'La b&uacute;squeda ha sido eliminada satisfactoriamente.');
                                    self.stBusquedas.reload({
                                        params: {
                                            limit:15,
                                            start: 0,
                                            codigo: tfCodigo.getValue(),
                                            denominacion: tfDenominacion.getValue()
                                        }
                                    });
                                    self.fireEvent('busquedaEliminada');
                                    btnActivarAviso.disable();
                                    btnCargarBusqueda.disable();
                                    btnModificar.disable();
                                    btnEliminar.disable();
                                    btnAsignarBusqueda.disable();
                                    btnBusquedaPorDefecto.disable();
                                    btnGestAvisos.disable();

                                    btnBuscar.focus();

                                }else{
                                    mostrarMensaje(3,'Error al eliminar la configuración de la busqueda.');
                                }
                            }
                        });
                    }
                });
            }
        }
        function setBusquedaPorDefecto(){
            PVD.mostrarMascara('idmsksearchbydefault', self.idioma.lbporfavorespere, self.idioma.lbSetSearchByDefault);
            Ext.Ajax.request({
                url: '/reccomplejas/index.php/reccomplejas/setPorDefecto',
                method:'POST',
                params: {
                    idbusquedausuario: smBusqueda.getSelected().get('idbusquedausuario'),
                    pordefecto: smBusqueda.getSelected().get('pordefecto')
                },
                callback: function (options,success,response){
                    btnBusquedaPorDefecto.disable();
                    self.stBusquedas.reload({
                        params: {
                            limit:15,
                            start: 0,
                            codigo: tfCodigo.getValue(),
                            denominacion: tfDenominacion.getValue()
                        }
                    });
                    PVD.ocultarMascara('idmsksearchbydefault');
                }
            });
        }

        function importConfBusqueda(){
            if(smBusqueda.hasSelection()){
                self.close();
                self.parent.cargarConfiguracionBusqueda(smBusqueda.getSelected().get('idbusqueda'));
            }
        }

        function activarDesactivarAviso(){
            if(smBusqueda.hasSelection()){
                PVD.mostrarMascara('idmskmodificandoaviso',self.idioma.lbporfavorespere, self.idioma.lbModificandoAviso);
                Ext.Ajax.request({
                    url: '/reccomplejas/index.php/reccomplejas/activarDesactivarAviso',
                    method:'POST',
                    params: {
                        idaviso: smBusqueda.getSelected().get('idaviso'),
                        activo: smBusqueda.getSelected().get('activo')
                    },
                    callback: function (options,success,response){
                        var datos = Ext.decode(response.responseText);
                        self.stBusquedas.reload({
                            params: {
                                limit:15,
                                start: 0,
                                codigo: tfCodigo.getValue(),
                                denominacion: tfDenominacion.getValue()
                            }
                        });
                        btnActivarAviso.disable();
                        btnCargarBusqueda.disable();
                        btnModificar.disable();
                        btnEliminar.disable();
                        btnAsignarBusqueda.disable();
                        btnBusquedaPorDefecto.disable();
                        btnGestAvisos.disable();
                        PVD.ocultarMascara('idmskmodificandoaviso');
                    }
                });
            }
        }

        function limpiarFiltros(){
            tfDenominacion.reset();
            tfCodigo.reset();
        }

        function filtrarBusquedas(){
            self.stBusquedas.reload({
                params: {
                    limit:15,
                    start: 0,
                    codigo: tfCodigo.getValue(),
                    denominacion: tfDenominacion.getValue()
                }
            });
            self.stBusquedas.on('load', function(store, records, options){
                if(store.getCount() == 0){
                    if(tfCodigo.getValue() == '' && tfDenominacion.getValue() == ''){
                        return;
                    }
                    Ext.MessageBox.show({
                        title: 'Información',
                        msg: self.idioma.msgEmptySearch,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO,
                        fn: function(){
                            btnBuscar.focus();
                        }
                    });
                }
            });
        }

        function gestionarAvisos(){
            if(smBusqueda.hasSelection()){
                var add = (smBusqueda.getSelected().get('idaviso') == null);
                if(smBusqueda.getSelected().get('tablasvisitadas') != null){
                    var winAviso = new Ext.notificaciones.gestionarAvisos.InterfazConfigurarAviso({
                        onlyTabs: ['vias', 'destinatarios'],
                        adicionar: add,
                        nombreAviso: smBusqueda.getSelected().get('denominacion'),
                        descripcionBusqueda: smBusqueda.getSelected().get('descripcion'),
                        codigo: smBusqueda.getSelected().get('codigo'),
                        referenciaServicio: 'configsecodena-actualizaAvisoBusqueda',
                        idusuario: perfil.idusuario,	//Id del usuario conectado
                        nombreEvento: 'evento_reccomplejas',
                        showApplyBtn: false,
                        idaviso: smBusqueda.getSelected().get('idaviso'),
                        data: smBusqueda.getSelected().data,
                        contenidoViasAviso: {
                            email: {
                                topicAttribute: 'nombreAviso',
                                attributes: [{
                                    title: self.idioma.lbName,
                                    mapping:'nombreAviso'
                                }, {
                                    title:self.idioma.descripcion,
                                    mapping:'descripcionBusqueda'
                                }, {
                                    title:self.idioma.cmCodigo,
                                    mapping:'codigo'
                                }]
                            },
                            jabber: {
                                attributes: [{
                                    title: self.idioma.lbName,
                                    mapping:'nombreAviso'
                                }, {
                                    title:self.idioma.descripcion,
                                    mapping:'descripcionBusqueda'
                                }, {
                                    title:self.idioma.cmCodigo,
                                    mapping:'codigo'
                                }]
                            },
                            sistema: {
                                attributes: [{
                                    title: self.idioma.lbName,
                                    mapping:'nombreAviso'
                                }, {
                                    title:self.idioma.descripcion,
                                    mapping:'descripcionBusqueda'
                                }, {
                                    title:self.idioma.cmCodigo,
                                    mapping:'codigo'
                                }]
                            },
                            sms: {
                                attributes: [{
                                    title:self.idioma.cmCodigo,
                                    mapping:'codigo'
                                }]
                            }
                        }
                    });
                    if(add){
                        winAviso.show();
                    }
                    else{
                        winAviso.on('ready', function(){
                            winAviso.show();
                        }, this)
                    }
                    winAviso.on('avisoinsertado', function(idaviso){
                        Ext.Ajax.request({
                            url: '/reccomplejas/index.php/reccomplejas/actualizarAvisoBusqueda',
                            method:'POST',
                            params: {
                                idaviso: idaviso,
                                idbusqueda: smBusqueda.getSelected().get('idbusqueda')
                            },
                            failure: function () {
                                mostrarMensaje(3, self.idioma.lbFailureMsg);
                            },
                            callback: function (options, success, response) {
                                if(success) {
                                    var result = Ext.util.JSON.decode(response.responseText);
                                    self.stBusquedas.reload({
                                        params: {
                                            limit:15,
                                            start: 0
                                        }
                                    });
                                }
                            }
                        });
                    });
                    winAviso.on('avisomodificado', function(cmp){
                        self.stBusquedas.reload({
                            params: {
                                limit:15,
                                start: 0
                            }
                        });
                    });
                }
                else{
                    Ext.MessageBox.show({
                        title: 'Alerta',
                        msg: self.idioma.msgCondBusquedaRequerida,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.INFO
                    });
                }
            }
        }

        function showTick(valor) {
            if(valor == 0){
                return '';
            }
            else{
                return '<center><div class="tick">&nbsp;</div></center>';
            }
        }

        function showTickAviso(valor) {
            if(valor == null){
                return '';
            }
            else{
                return '<center><div class="tick">&nbsp;</div></center>';
            }
        }

        function showTickContent(valor) {
            if(valor.active == 1){
                return '<center><div class="tick">&nbsp;</div></center>';
            }
            else{
                return '';
            }
        }

        function showImage(valor) {
            if(valor == 0){
                return '<center><div class="imginactiva">&nbsp;</div></center>';
            }
            else if(valor == 1){
                return '<center><div class="imgactiva">&nbsp;</div></center>';
            }
            else{
                return '';
            }
        }

        function mostrarAyuda(){
            var title	= self.idioma.titleAyuda;
            help.show(title, 'evaluaciones/gestionarbusquedas');
        }
        
        function asignarBusqueda(){
            var win = new Ext.components.CmpReccomplejas.CmpAsignarBusqueda({
                idbusqueda: smBusqueda.getSelected().get('idbusqueda'),
                idioma: self.idioma,
                parent: self
            });
            win.show();
        }
        
        function buildTemplateGestAviso(){
            templateAviso = {};
            if(smBusqueda.getSelected().get('jabber').active == 1){
                templateAviso.jabber = {
                    attributes: [{
                        title: self.idioma.lbName,
                        mapping:'nombreAviso'
                    }, {
                        title:self.idioma.descripcion,
                        mapping:'descripcionBusqueda'
                    }, {
                        title:self.idioma.cmCodigo,
                        mapping:'codigo'
                    }]
                };
            }
            if(smBusqueda.getSelected().get('correo').active == 1){
                templateAviso.email = {
                    topicAttribute: 'nombreAviso',
                    attributes: [{
                        title: self.idioma.lbName,
                        mapping:'nombreAviso'
                    }, {
                        title:self.idioma.descripcion,
                        mapping:'descripcionBusqueda'
                    }, {
                        title:self.idioma.cmCodigo,
                        mapping:'codigo'
                    }]
                };
            }
            if(smBusqueda.getSelected().get('sms').active == 1){
                templateAviso.smstext = {
                    attributes: [{
                        title:self.idioma.cmCodigo,
                        mapping:'codigo'
                    }]
                };
            }
            if(smBusqueda.getSelected().get('sistema').active == 1){
                templateAviso.sistema = {
                    attributes: [{
                        title: self.idioma.lbName,
                        mapping:'nombreAviso'
                    }, {
                        title:self.idioma.descripcion,
                        mapping:'descripcionBusqueda'
                    }, {
                        title:self.idioma.cmCodigo,
                        mapping:'codigo'
                    }]
                };
            }
            return templateAviso;
        }
        
        function disableButtons(){
            btnCargarBusqueda.disable();
            btnModificar.disable();
            btnEliminar.disable();
            btnBusquedaPorDefecto.disable();
            btnAsignarBusqueda.disable();
            btnGestAvisos.disable();
            btnActivarAviso.disable();
        }

        this.on('show', function(component){
			btnBuscar.focus();  
            self.stBusquedas.load({
                params: {
                    limit:15,
                    start: 0
                }
            });
            self.stBusquedas.on('load', function(store, records, options){
                disableButtons();
                btnBuscar.focus();                
            });
        });
		
        this.tbar = [btnCargarBusqueda,btnModificar,btnEliminar,btnBusquedaPorDefecto,btnAsignarBusqueda,btnGestAvisos,btnActivarAviso];
		this.buttons=[this.btnCerrarWin];
        var pFiltros = new Ext.Panel({
            cls: 'x-toolbar',
            layout: 'column',
            margins: '5 5 5 5',
            frame:true,
            defaults:{
                layout:'form',
                border:false,
                labelAlign:'top',
                buttonAlign:'right'
            },
            height:64,
            autoScroll:true,
            autoShow:true,
            region:'north',
            items: [{
                columnWidth:.22,
                layout: 'form',
                hidden: self.noUsarGestAvisos,
                items:[tfCodigo]
            },{
                columnWidth: .35,
                layout:"form",
                items:[tfDenominacion]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'35px',
                items:[btnBuscar]
            },{
                layout:'form',
                bodyStyle:'padding:19px 0 0 0;',
                columnWidth:'35px',
                items:[btnLimpiar]
            }]
        });

        this.items = [pFiltros, self.gpBusquedas];
        Ext.components.CmpReccomplejas.WinGestBusquedas.superclass.initComponent.call(this);
    }
});
Ext.reg('CmpReccomplejas_WinGestBusquedas', Ext.components.CmpReccomplejas.WinGestBusquedas);

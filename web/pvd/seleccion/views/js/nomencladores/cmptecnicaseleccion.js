
/*
 * Componente Técnicas de selección.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores.TecSeleccion
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Seleccion.Nomencladores.TecSeleccion");
Pvd.Seleccion.Nomencladores.TecSeleccion = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'tecnicas',
    title: 'T&eacute;cnicas de selecci&oacute;n',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        var self = this;
        this.accion = 'add';
        var windAddShow = 0;
        var windActShow = 0;
        var busc = 0;
        //Store Grid Técnicas
        this.stTecnica = new Ext.data.JsonStore({
            url           : '/pvd/seleccion/index.php/gestionartecnica/getTecnica',
            totalProperty : 'total',
            root          : 'data',
            id            : 'idtecnica',
            fields        : [
                {name : 'idtecnica'},
                {name : 'idplanilla'},
                {name : 'denominacion'},
                {name : 'descripcion'},
                {name : 'fdesde'},
                {name : 'fhasta'},
                {name : 'cantd'},
                {name : 'activo'}
            ]
        });

        this.stTecnica.load();

        this.stTecnica.on('load', function() {
            self.btnDelTec.disable();
            self.btnActTec.disable();
        });
        
        //Store Grid Procesos
        this.stProceso = new Ext.data.JsonStore({
            url           : '/pvd/seleccion/index.php/gestionartecnica/getProcesoByTecnicaModelo',
            totalProperty : 'total',
            root          : 'data',
            id            : 'idproceso',
            fields        : [
                {name : 'idproceso'},
                {name : 'denominacion'},
                {name : 'fdesde'},
                {name : 'fhasta'},
                {name : 'recurso'},
                {name : 'cargos'}
            ]
        });
        
        this.stProceso.on('load', function() {
            marcarProcesos();
        });
        
        //Store Grid Planillas
        this.stPlanilla = new Ext.data.JsonStore({
            url           : '/pvd/seleccion/index.php/gestionartecnica/getPlanilla',
            totalProperty : 'total',
            root          : 'data',
            id            : 'idplanilla',
            fields        : [
                {name : 'idplanilla'},
                {name : 'denominacion'},
                {name : 'descripcion'},
                {name : 'fdesde'},
                {name : 'fhasta'},
                {name : 'cantd'}
            ]
        });
        //Store Combo Modelo
        this.stModelo = new Ext.data.JsonStore({
            url           : '/pvd/seleccion/index.php/gestionartecnica/getModeloByTecnica',
            totalProperty : 'total',
            root          : 'data',
            id            : 'idmodelo',
            fields        : [
                {name : 'idmodelo'},
                {name : 'denominacion'}
            ]
        });

        /* --- GESTIÓN DE TÉCNICAS --- */
        //Botón Adicionar técnica de selección
        this.btnAddTec = new Ext.Button({
            id       : 'btnAddTec',
            text     : self.idioma.btnAddTec_text,
            tooltip  : self.idioma.btnAddTec_tooltip,
            iconCls  : 'adicionar',
            handler: function ()
            {
                self.stPlanilla.load();
                self.winAddTecnica.show();
            }.createDelegate(this)
        });
        //Botón Eliminar técnica de selección
        this.btnDelTec = new Ext.Button({
            id       : 'btnDelTec',
            disabled : true,
            text     : self.idioma.btnDelTec_text,
            tooltip  : self.idioma.btnDelTec_tooltip,
            iconCls  : 'eliminar',
            handler: function ()
            {
                eliminarTecnica();
            }.createDelegate(this)
        });

        //Botón Activar técnica de selección
        this.btnActTec = new Ext.Button({
            id       : 'btnActTec',
            disabled : true,
            text     : self.idioma.btnActTec_text,
            tooltip  : self.idioma.btnActTec_tooltip,
            iconCls  : 'activar',
            handler: function ()
            {
                self.winActivarPlanilla.show();
                self.dfFinActivar.reset();
            }.createDelegate(this)
        });
        //Grid para listar las técnicas de selección
        //Expander
        this.expGpTecnica = new Ext.grid.RowExpander({
            tpl : new Ext.Template('<div><b>' + self.idioma.expGpWAddTec_desc + ': </b>{descripcion}.<br/></div>' +
            '<div><b>' + self.idioma.expGpWAddTec_fdesde + ': </b>{fdesde}.<br/></div>' +
            '<div><b>' + self.idioma.expGpWAddTec_fhasta + ': </b>{fhasta}.<br/></div>')
        });
        //color
        function colorFila(val, metaData, record, rowIndex, colIndex, store) {
            if(record.get('activo') == 0 && val != null) {
                return '<span style="color:#ff1703">' + val + '</span>';
            } else {
                return val;
            }
        }
        //Grid
        this.gpTecnica = new Ext.grid.GridPanel({
            title      : self.idioma.gpTecnica_title,
            region     : 'west',
            stripeRows : true,
            loadMask: {msg: 'Cargando...'},
            plugins    : this.expGpTecnica,
            store      : self.stTecnica,
            columns    : [
                this.expGpTecnica,
                {hidden : true,                              dataIndex : 'idtecnica'   , sortable : true},
                {hidden : true,                              dataIndex : 'idplanilla'  , sortable : true},
                {header : self.idioma.gpTecnica_col_denominacion, dataIndex : 'denominacion', sortable : true, width : 250, renderer : colorFila},
                {header : self.idioma.gpTecnica_col_cantd       , dataIndex : 'cantd'       , sortable : true, renderer : colorFila}
            ]
        });

        //Comportamiento del grid al seleccionar una fila (gpTecnica)
        this.gpTecnica.getSelectionModel().on('rowselect', function() {
            self.btnDelTec.enable();
            if(self.gpTecnica.getSelectionModel().getSelected().data.activo == 0) {
                mostrarMensaje(2, self.idioma.msgInfTecNoActSelect_text, function (btnPresionado){
                    if (btnPresionado == 'ok') {
                        self.winActivarPlanilla.show();
                        self.dfFinActivar.reset();
                    }
                });
                self.btnActTec.enable();
            } else {
                self.btnActTec.disable();
            }
            self.stProceso.removeAll();
            self.cbModelo.reset();
            self.cbModelo.disable();
            self.btnCompartir.disable();
            self.stModelo.removeAll();
            self.stModelo.baseParams = {idtecnica : self.gpTecnica.getSelectionModel().getSelected().data.idplanilla};
            self.stModelo.load();
            self.stModelo.on('load', function() {
                if(self.stModelo.getCount() > 0)
                    self.cbModelo.enable();
                else {
                    mostrarMensaje(2, 'Esta t&eacute;cnica no tiene modelos asociados a procesos de selección.');
                }
            });
        });
        //Panel
        this.pTecnica = new Ext.Panel({
            layout : 'fit',
            region : 'west',
            width  : '35%',
            border : false,
            tbar   : [this.btnAddTec, this.btnDelTec, this.btnActTec],
            items  : [this.gpTecnica]
        });
        //Window para adicionar las técnicas de selección
        //Botón Cancelar
        this.btnWTecCancel = new Ext.Button({
            id       : 'btnWTecCancel',
            nextTab: 'btnWTecAceptar',
            text     : self.idioma.btnWTecCancel_text,
            tooltip  : self.idioma.btnWTecCancel_tooltip,
            iconCls  : 'cancelar',
            handler: function ()
            {
                self.winAddTecnica.hide();
                self.gpWAddTec.getSelectionModel().clearSelections();
            }.createDelegate(this)
        });
        //Botón Aceptar
        this.btnWTecAceptar = new Ext.Button({
            id       : 'btnWTecAceptar',
            nextTab: 'btnWTecCancel',
            prevTab: 'btnWTecCancel',
            text     : self.idioma.btnWTecAceptar_text,
            tooltip  : self.idioma.btnWTecAceptar_tooltip,
            iconCls  : 'aceptar',
            handler: function ()
            {
                guardarDatos();
            }.createDelegate(this)
        });
        //Grid Planillas Evaluativas
        //Expander
        this.expGpWAddTec = new Ext.grid.RowExpander({
            tpl : new Ext.Template('<div><b>' + self.idioma.expGpWAddTec_desc + ': </b>{descripcion}.<br/></div>' +
            '<div><b>' + self.idioma.expGpWAddTec_fdesde + ': </b>{fdesde}.<br/></div>' +
            '<div><b>' + self.idioma.expGpWAddTec_fhasta + ': </b>{fhasta}.<br/></div>')
        });
        //Grid
        this.chbSelMod = new Ext.grid.CheckboxSelectionModel();
        this.gpWAddTec = new Ext.grid.GridPanel({
            region     : 'center',
            stripeRows : true,
            loadMask: {msg: 'Cargando...'},
            plugins    : this.expGpWAddTec,
            store      : self.stPlanilla,
            sm         : this.chbSelMod,
            columns    : [
                this.expGpWAddTec,
                this.chbSelMod,
                {hidden : true,                              dataIndex : 'idplanilla'  , sortable : true},
                {header : self.idioma.gpWAddTec_col_denominacion, dataIndex : 'denominacion', sortable : true, width : '60%'},
                {header : self.idioma.gpWAddTec_col_cantd       , dataIndex : 'cantd'       , sortable : true}
            ]
        });
        //Window
        this.winAddTecnica = new Ext.Window({
            layout      : 'fit',
            title       : self.idioma.winAddTecnica_title,
            modal       : true,
            closeAction : 'hide',
            closable    : false,
            resizable   : false,
            constrain   :true,
            width       : 400,
            height      : 300,
            items       : [this.gpWAddTec],
            buttons     : [this.btnWTecCancel, this.btnWTecAceptar],
            keys:[
                {
                    key: 'x',
                    alt: true,
                    fn: function () {
                        if (!self.btnWTecCancel.disabled) {
                            self.btnWTecCancel.handler();
                        }
                    }
                },{
                    key: 13,//enter para aceptar
                    fn: function(){
                        if(self.btnWTecAceptar.isVisible()){
                            self.btnWTecAceptar.handler();
                        }
                    }
                }
            ]
        });

        /* --- COMPARTIMENTACIÓN DE TÉCNICAS POR PROCESOS --- */
        //Combo box para seleccionar el self de la tecnica seleccionada
        this.cbModelo = new Ext.form.ComboBox({
            disabled      : true,
            store         : self.stModelo,
            displayField  :'denominacion',
            hiddenName    : 'idmodelo',
            valueField    : 'idmodelo',
            typeAhead     : true,
            mode          : 'local',
            triggerAction : 'all',
            editable      : false,
            emptyText     : self.idioma.cbModelo_emptyText
        });
        //Comportamiento del combo box (cbModelo)
        self.cbModelo.on('select', function() {
            self.btnCompartir.disable();
            self.stProceso.load({params : {
                idtecnica : self.gpTecnica.getSelectionModel().getSelected().data.idplanilla,
                idmodelo  : self.cbModelo.getValue(),
                start     : 0,
                limit     : 15
            }
            });
        });
        //Botón Compartir resultado de técnica por proceso
        this.btnCompartir = new Ext.Button({
            id       : 'btnCompartir',
            text     : self.idioma.btnCompartir_text,
            tooltip  : self.idioma.btnCompartir_tooltip,
            iconCls  : 'compartir',
            disabled : true,
            handler: function ()
            {
                compartirResultado();
            }.createDelegate(this)
        });
        /* GRID PROCESOS */
        //Expander
        this.expGpProceso = new Ext.grid.RowExpander({
            tpl : new Ext.Template('<div><b>' + self.idioma.expGpProceso_cargo + ': </b>{cargos}.<br/></div>' +
            '<div><b>' + self.idioma.expGpProceso_recurso + ': </b>{recurso}.<br/></div>')
        });
        //Paginado
        this.pag = new Ext.PagingToolbar({
            pageSize    : 15,
            store       : self.stProceso,
            displayMsg  : 'Mostrando {0} - {1} de {2} ',
            emptyMsg    : 'Vacío',
            displayInfo : true
        });
        //Grid
        this.check = new Ext.grid.CheckboxSelectionModel();
        this.gpProceso = new Ext.grid.GridPanel({
            title      : self.idioma.gpProceso_title,
            region     : 'center',
            stripeRows : true,
            loadMask: {msg: 'Cargando...'},
            bbar       : this.pag,
            plugins    : this.expGpProceso,
            store      : self.stProceso,
            sm         : this.check,
            columns    : [
                this.expGpProceso,
                this.check,
                {hidden : true,                              dataIndex : 'idproceso',    sortable : true},
                {header : self.idioma.gpProceso_col_denominacion, dataIndex : 'denominacion', sortable : true, width : 350},
                {header : self.idioma.gpProceso_col_fdesde      , dataIndex : 'fdesde',       sortable : true},
                {header : self.idioma.gpProceso_col_fhasta      , dataIndex : 'fhasta',       sortable : true}
            ]
        });

        //Comportamiento del grid de procesos al cambiar la selección
        self.gpProceso.getSelectionModel().on('rowselect', function() {
            self.btnCompartir.enable();
        });
        self.gpProceso.getSelectionModel().on('rowdeselect', function() {
            self.btnCompartir.enable();
        });
        //Botón Ayuda
        this.btnAyuda = new Ext.Button({
            id       : 'btnAyuda',
            text     : self.idioma.btnAyuda_text,
            tooltip  : self.idioma.btnAyuda_tooltip,
            iconCls  : 'ayuda'
        });
        //Panel
        this.pProceso = new Ext.Panel({
            layout : 'fit',
            region : 'center',
            width  : '65%',
            border : false,
            tbar   : [self.idioma.cbModelo_label, this.cbModelo, '  ', this.btnCompartir, '->', '-', this.btnAyuda],
            items  : [this.gpProceso]
        });

        this.dfFinActivar = new Ext.form.DateField({
            id: 'dfFinActivar',
            nextTab: 'btnCancelActts',
            fieldLabel: 'Fecha fin',
            name: 'fhasta',
            hiddenname:'fhasta',
            anchor: '98%',
            format: 'd/m/Y',
            editable: false,
            readOnly: true,
            vtype: 'daterange',
            maxValue: '31/12/2100',
            minValue: '01/01/1900'
        });

        this.fActivar = new Ext.form.FormPanel({
            frame: true,
            bodyStyle: 'padding: 3px 3px 0',
            border: false,
            autoDestroy: false,
            labelAlign: 'top',
            autoHeight: true,
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1.0,
                            layout: 'form',
                            items: [this.dfFinActivar]
                        }
                    ]
                }
            ]
        });

        this.btnAceptAct = new Ext.Button({
            id: 'btnAceptActts',
            iconCls: 'aceptar',
            text     : self.idioma.btnWTecAceptar_text,
            tooltip  : self.idioma.btnWTecAceptar_tooltip,
            handler: function ()
            {
                activarPlanilla();
            }.createDelegate(this)
        });

        this.btnCancelAct = new Ext.Button({
            id: 'btnCancelActts',
            nextTab: 'dfFinActivar',
            prevTab: 'dfFinActivar',
            iconCls: 'cancelar',
            text     : self.idioma.btnWTecCancel_text,
            tooltip  : self.idioma.btnWTecCancel_tooltip,
            handler: function ()
            {
                self.winActivarPlanilla.hide();
            }.createDelegate(this)
        });

        this.winActivarPlanilla = new Ext.Window({
            title:'Activar planilla',
            width: 230,
            height: 150,
            layout: 'fit',
            constrain:true,
            autoHeight: true,
            closable: true,
            resizable: false,
            closeAction: 'hide',
            items: [this.fActivar],
            modal: true,
            buttons: [this.btnCancelAct, this.btnAceptAct],
            keys:[
                {
                    key: 'x',
                    alt: true,
                    fn: function () {
                        if (!self.btnCancelAct.disabled) {
                            self.btnCancelAct.handler();
                        }
                    }
                },{
                    key: 13,//enter para aceptar
                    fn: function(){
                        if(self.btnAceptAct.isVisible()){
                            self.btnAceptAct.handler();
                        }
                    }
                }
            ]
        });

        this.items = [this.pTecnica, this.pProceso];

        this.btnAddTec.on('render', function ()
        {
            self.btnAddTec.focus();
        });

        self.winActivarPlanilla.on('hide', function() {windActShow = 0; self.btnAddTec.focus();});

        self.winActivarPlanilla.on('show', function() {windActShow = 1;});

        self.winAddTecnica.on('hide', function() {windAddShow = 0; self.btnAddTec.focus();});

        self.winAddTecnica.on('show', function() {windAddShow = 1;});

        Ext.Ajax.request({
            url     : '/pvd/seleccion/index.php/gestionartecnica/getPlanillaNoActiva',
            success : function (r) {
                var responseData = Ext.decode(r.responseText);
                if(responseData) {
                    Ext.Notification.show({
                        title: 'Advertencia',
                        msg: self.idioma.msgInfTecNoAct_text,
                        icon: 'warning',
                        time: 3
                    });
                }
            }
        });

        this.keys = [{
            key: 'ihxt',
            alt: true,
            //stopEvent: true,
            handler: function(k, e){
                switch(k) {
                    case 73:{ //i para adicionar
                        if(!self.btnAddTec.disabled){
                            self.btnAddTec.handler();
                        }
                        break;
                    }
                    case 72:{ //h para ayuda
                        self.btnAyuda.handler();
                        break;
                    }
                    case 88:{ //x para cancelar
                        if(!self.btnWTecCancel.disabled && windAddShow == 1){
                            self.btnWTecCancel.handler();
                        } else if(!self.btnCancelAct.disabled && windActShow == 1){
                            self.btnCancelAct.handler();
                        } else if(!self.btnActTec.disabled && windActShow == 0){
                            self.btnActTec.handler();
                        }
                    }
                    case 84:{ //t para compartir
                        if(!self.btnCompartir.disabled){
                            self.btnCompartir.handler();
                        }
                    }
                }
            }
        },{
            key: 46,//del para eliminar
            fn: function(){
                if(!self.btnDelTec.disabled){
                    self.btnDelTec.handler();
                }
            }
        }];

        function marcarProcesos()
        {
            Ext.Ajax.request({
                url     : '/pvd/seleccion/index.php/gestionartecnica/getConfCompTec',
                params  : {
                    idtecnica : self.gpTecnica.getSelectionModel().getSelected().data.idplanilla,
                    idmodelo  : self.cbModelo.getValue()
                },
                callback: function (){
                },
                success: function (r){
                    var responseData = Ext.decode(r.responseText).data;
                    var objrec = [];
                    for (i=0; i<responseData.length; i++) {
                        var obj = self.stProceso.getById(responseData[i].idproceso);
                        objrec.push(obj);
                    }
                    self.gpProceso.getSelectionModel().selectRecords(objrec);
                    self.btnCompartir.disable();
                }
            });
        }

        function guardarDatos()
        {
            var selectPlantilla = self.gpWAddTec.getSelectionModel().getSelections();
            if (selectPlantilla.length > 0) {
                var arrayTec = new Array();
                var stTec = self.stTecnica.getRange();
                for(i = 0; i < selectPlantilla.length; i++) {
                    var flag = false;
                    for(k = 0; k < stTec.length; k++) {
                        if(stTec[k].data.idplanilla == selectPlantilla[i].data.idplanilla) {
                            flag = true;
                        }
                    }
                    if (!flag) {
                        arrayTec.push(selectPlantilla[i].data.idplanilla);
                    }
                }
                Ext.Ajax.request({
                    url     : '/pvd/seleccion/index.php/gestionartecnica/addPlanillaTecnica',
                    params  : {arrayTec : Ext.encode(arrayTec)},
                    success : function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if(responseData) {
                            if(responseData.success == false) {
                                mostrarMensaje(6, self.idioma.msgAddTecnica_fail);
                            } else {
                                mostrarMensaje(2, self.idioma.msgAddTecnica_success);
                                self.stTecnica.reload();
                                self.winAddTecnica.hide();
                                self.gpWAddTec.getSelectionModel().clearSelections();
                            }
                        }
                    }
                });
            } else {
                mostrarMensaje(6, self.idioma.msgSelectVacia);
            }
        }

        function eliminarTecnica()
        {
            var tec = new Array();
            var s = self.gpTecnica.getSelectionModel().getSelections();
            for(i = 0; i < s.length; i++) {
                tec.push(s[i].id);
            }
            var mensaje = '';
            if (s.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la t&eacute;cnica seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las t&eacute;cnicas seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPress){
                if (btnPress == 'ok') {
                    Ext.getBody().mask(self.idioma.msgDelTec_status);
                    Ext.Ajax.request({
                        url      : '/pvd/seleccion/index.php/gestionartecnica/delPlanillaTecnica',
                        params	 : {tec: Ext.encode(tec)},
                        callback : function() {Ext.getBody().unmask();},
                        success  : function(r) {
                            var responseData = Ext.decode(r.responseText);
                            if (responseData == false) {
                                if (s.length == 1) {
                                    mensaje = 'La t&eacute;cnica seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las t&eacute;cnicas seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            } else {
                                if (s.length == 1) {
                                    mensaje = 'La t&eacute;cnica seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las t&eacute;cnicas seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(1, mensaje);
                                self.stTecnica.reload();
                            }
                        }
                    });
                }
            });
        }

        function compartirResultado()
        {
            var selectPreceso = self.gpProceso.getSelectionModel().getSelections();
            var arrProceso = new Array();
            for(i = 0; i < selectPreceso.length; i++) {
                arrProceso.push(selectPreceso[i].data.idproceso);
            }
            Ext.Ajax.request({
                url     : '/pvd/seleccion/index.php/gestionartecnica/addConfCompTec',
                params  : {
                    arrProceso : Ext.encode(arrProceso),
                    idtecnica  : self.gpTecnica.getSelectionModel().getSelected().data.idplanilla,
                    idmodelo  : self.cbModelo.getValue()
                },
                success : function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if(responseData) {
                        if(responseData.success == false) {
                            mostrarMensaje(6, self.idioma.btnCompartir_fail);
                        } else {
                            mostrarMensaje(2, self.idioma.btnCompartir_success);
                        }
                    }
                }
            });
        }

        function activarPlanilla()
        {
            Ext.Ajax.request({
                url     : '/pvd/seleccion/index.php/gestionartecnica/activarPlanilla',
                params  : {
                    idplanilla  : self.gpTecnica.getSelectionModel().getSelected().data.idplanilla,
                    fechafin   : self.dfFinActivar.getRawValue()
                },
                success : function (r) {
                    var responseData = Ext.decode(r.responseText);
                    if(responseData == true) {
                        mostrarMensaje(1, self.idioma.lbActivar_success);
                    }
                    self.winActivarPlanilla.hide();
                    self.stTecnica.reload();
                }
            });
        }

        Pvd.Seleccion.Nomencladores.TecSeleccion.superclass.initComponent.call(this);
    }
});

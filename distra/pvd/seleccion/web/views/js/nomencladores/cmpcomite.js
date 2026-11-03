
/*
 * Componente Comité de ingreso.
 *
 * @author Ing.Yaricel Guerra Velázquez
 * @package Pvd.Seleccion
 * @uses Pvd.Seleccion.Nomencladores.Comite
 * @copyright XETID
 * @version 1.0
 */ 
 
Ext.ns("Pvd.Seleccion.Nomencladores.Comite");
Pvd.Seleccion.Nomencladores.Comite = Ext.extend(Ext.Panel,{
    layout: 'border',
    id: 'comites',
    title: 'Comit&eacute;s de ingreso',
    region: 'center',
    height: '100%',
    closable: true,
    iconCls: '',
    initComponent: function () {
        var self = this;
        this.accion = 'add';
        var frmAccion = '';
        var windAddComite = 0;
        var addPersExpand = 0;
        var busc = 0;

        //TreeLoader para el Árbol.
        this.loaderComite = new Ext.tree.TreeLoader({
            url:'/pvd/seleccion/index.php/gestionarcomite/getNomComite'
        });
        
        self.loaderComite.on('load', function(){
            self.btnGpAdd.disable();
            self.TreeComite.getSelectionModel().select(self.TreeComite.getRootNode());
            var nodos = self.TreeComite.getRootNode().childNodes;
            var vencidas = 0;
            for(i =0; i<nodos.length;i++){
                if (nodos[i].attributes.cantd){
                    vencidas = 1;
                }
            }
            if (vencidas == 1) {
                mostrarMensaje(8, 'Existen comit&eacute;s de ingreso no activos.');
            }
        });

        var connObjPerDisponibles = new Ext.data.Connection({
            timeout : 3600000,
            url: '/pvd/seleccion/index.php/gestionarcomite/getPersonasAll',
            method : 'POST'
        });
        
        //Store Grid Personas
        this.stPersonasAll = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy(connObjPerDisponibles),
            reader: new Ext.data.JsonReader(
                {root: "data", id: "idpersona", totalProperty: "quantity"},
                [{name:'idpersona'}, {name:'numid'}, {name:'nombreapellidos'}, {name:'denomcargo'}, {name:'sexo'}]
            ),
            listeners: {
                load: function (st, rec, opt) {
                    if (rec.length == 0) {
                        if (self.sfBuscarPerson.getValue() == '') {
                            mostrarMensaje(1,this.idioma.lbNoDatos);
                        } else {
                            mostrarMensaje(1,this.idioma.lbNoDatosBusc);
                        }
                    }
                }.createDelegate(this)
            }
        });


        this.stPersona = new Ext.data.JsonStore({
            url          : '/pvd/seleccion/index.php/gestionarcomite/getPersonasComite',
            totalProperty: 'total',
            root         : 'data',
            id           : 'idcomitep',
            fields       : [
                {name:'idcomitep'},
                {name:'idcomite'},
                {name:'idpersona'},
                {name:'numid'},
                {name:'nombre'},
                {name:'sexo'},
                {name:'cargo'}
            ]
        });

        self.stPersona.on('load', function (st, rec, opt) {
            if (rec.length == 0) {
                if (self.sfBuscar.getValue() == '') {
                    mostrarMensaje(1,self.idioma.lbNoDatos);
                } else {
                    mostrarMensaje(1,self.idioma.lbNoDatosBusc);
                }
            }
        });

        self.stPersona.on('load', function() {
            if(self.stPersona.getCount() > 0){
                self.sfBuscar.enable();
            } else {
                self.sfBuscar.disable();
            }
        });

        /* --- GESTIONAR COMITÉ DE INGRESO --- */
        //Botón Adicionar comité de ingreso
        this.btnAddComite = new Ext.Button({
            id      : 'btnAddComite',
            text    : self.idioma.btnAddComite_text,
            tooltip : self.idioma.btnAddComite_tooltips,
            iconCls	: 'adicionar',
            handler: function ()
            {
                frmAccion = 'add';
                self.winGestComite.setTitle(self.idioma.winGestComite_title_add);
                self.btnFrmAplicar.show();
                self.winGestComite.show();
            }.createDelegate(this)
        });
        //Botón Modificar comité de ingreso
        this.btnModComite = new Ext.Button({
            id       : 'btnModComite',
            text     : self.idioma.btnModComite_text,
            tooltip  : self.idioma.btnModComite_tooltips,
            iconCls	 : 'modificar',
            disabled : true,
            handler: function ()
            {
                frmAccion = 'mod';
                self.winGestComite.setTitle(self.idioma.winGestComite_title_mod);
                self.btnFrmAplicar.hide();
                self.tfDenominacion.setValue(self.TreeComite.getSelectionModel().getSelectedNode().attributes.denominacion);
                self.dfFDesde.setValue(self.TreeComite.getSelectionModel().getSelectedNode().attributes.fdesde);
                self.dfFHasta.setValue(self.TreeComite.getSelectionModel().getSelectedNode().attributes.fhasta);
                self.taDescripcion.setValue(self.TreeComite.getSelectionModel().getSelectedNode().attributes.descripcion);
                self.winGestComite.show();
            }.createDelegate(this)
        });
        //Botón Eliminar comité de ingreso
        this.btnDelComite = new Ext.Button({
            id       : 'btnDelComite',
            text     : self.idioma.btnDelComite_text,
            tooltip  : self.idioma.btnDelComite_tooltips,
            iconCls	 : 'eliminar',
            disabled : true,
            handler: function ()
            {
                eliminarComite();
            }.createDelegate(this)
        });
        //Checkbox para determinar origen de gestión de los comité de ingreso
        this.ckbEstruct = new Ext.form.Checkbox({
            id : 'ckbEstruct'
        });

        self.ckbEstruct.on('check', function (check, val) {
            if (val) {
                self.btnAddComite.hide();
                self.btnModComite.hide();
                self.btnDelComite.hide();
                self.loaderComite.url = '/pvd/seleccion/index.php/gestionarcomite/getEstructComite';
                self.stPersona.removeAll();
            } else {
                self.btnAddComite.show();
                self.btnModComite.show();
                self.btnDelComite.show();
                self.loaderComite.url = '/pvd/seleccion/index.php/gestionarcomite/getNomComite';
                self.stPersona.removeAll();
            }
            self.TreeComite.getRootNode().reload();
            self.btnGpAdd.disable();
            self.btnGpDel.disable();
        }, this);
        
        //Botón expandir
        this.btnTreeExpandir = new Ext.Button({
            id      : 'btnTreeExpandir',
            tooltip : self.idioma.btnTreeExpandir_tooltips,
            iconCls : 'expandir',
            handler : function () {
                self.TreeComite.expandAll();
            }
        });
        //Botón colapsar
        this.btnTreeCollapse = new Ext.Button({
            id      : 'btnTreeCollapse',
            tooltip : self.idioma.btnTreeCollapse_tooltips,
            iconCls : 'contraer',
            handler : function () {
                self.TreeComite.collapseAll();
            }
        });
        //Árbol de comités de ingreso
        this.TreeComite = new Ext.tree.TreePanel({
            split      : false,
            width      : '40%',
            autoScroll : true,
            border     : true,
            region     : 'west',
            loader     : self.loaderComite,
            root       : new Ext.tree.AsyncTreeNode({
                id       : 'root',
                text     : self.idioma.treeNode_text,
                expanded : true
            }),
            tbar       : [this.btnAddComite, this.btnModComite, this.btnDelComite,'-',
                this.ckbEstruct, self.idioma.ckbEstruct_text, '->', '-',
                this.btnTreeExpandir, this.btnTreeCollapse]
        });

        self.TreeComite.on('click', function(n) {
            var cantdvenc = n.attributes.cantd;
            if(!self.ckbEstruct.checked && n.attributes.leaf) {
                self.btnModComite.enable();
                self.btnDelComite.enable();
                if (!cantdvenc) {
                    self.stPersona.baseParams = {idcomite   : n.attributes.id,
                        estructura : 0};
                    self.stPersona.load({params : {limit : 15, start : 0}});
                    self.stPersonasAll.load({params : {limit : 15, start : 0}});
                } else {
                    self.btnGpAdd.disable();
                    self.btnGpDel.disable();
                    self.stPersona.removeAll();
                    Ext.MessageBox.show({
                        title: 'Advertencia',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.WARNING,
                        msg: 'Este comit&eacute; de ingreso no est&aacute; activo.'
                    });
                }
            }
            if(!self.ckbEstruct.checked && !n.attributes.leaf){
                self.btnModComite.disable();
                self.btnDelComite.disable();
            }
            if(self.ckbEstruct.checked && n.leaf) {
                self.stPersona.baseParams = {idcomite   : n.attributes.id,
                    estructura : 1};
                self.stPersona.load({params : {limit : 15, start : 0}});
                self.stPersonasAll.load({params : {limit : 15, start : 0}});
            }
            if(!n.attributes.leaf) {
                self.stPersona.removeAll();
                self.btnGpAdd.disable();
                self.btnGpDel.disable();
            }
            if(n.attributes.leaf && cantdvenc==null) {
                self.btnGpAdd.enable();
            }
        });
        /* --- Window para la gestión de los comités (ADD, MOD, DEL) --- */
        //Campo de texto "Denominación" (textfield)
        this.tfDenominacion = new Ext.form.TextField({
            id              : 'tfDenominacion'+self.TreeComite.id,
            nextTab         : 'dfFDesde'+self.TreeComite.id,
            name            : 'denominacion',
            hiddenname      : 'denominacion',
            fieldLabel      : self.idioma.tfDenominacion_label,
            regex           : /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ])+$/,
            maskRe          : /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText       : self.idioma.msgCaracteres,
            allowBlank      : false,
            maxLength		: 100,
            //minLength		: 3,
            anchor          : '100%'
        });
        //Campo "Fecha de inicio" (DateField)
        this.dfFDesde = new Ext.form.DateField({
            id         : 'dfFDesde'+self.TreeComite.id,
            nextTab    : 'dfFHasta'+self.TreeComite.id,
            prevTab    : 'tfDenominacion'+self.TreeComite.id,
            name       : 'fdesde',
            hiddenname : 'fdesde',
            fieldLabel : self.idioma.dfFDesde_label,
            vtype      : 'daterange',
            format     : 'd/m/Y',
            readOnly   : true,
            allowBlank : false,
            value      : new Date(),
            endDateField: 'dfFHasta'+self.TreeComite.id,
            anchor     : '93%'
        });
        //Campo "Fecha fin" (Dateield)
        this.dfFHasta = new Ext.form.DateField({
            id         : 'dfFHasta'+self.TreeComite.id,
            nextTab    : 'taDescripcion'+self.TreeComite.id,
            prevTab    : 'dfFDesde'+self.TreeComite.id,
            name       : 'fhasta',
            hiddenname : 'fhasta',
            fieldLabel : self.idioma.dfFHasta_label,
            startDateField: 'dfFDesde'+self.TreeComite.id,
            vtype      : 'daterange',
            format     : 'd/m/Y',
            readOnly   : true,
            anchor     : '100%'
        });
        //Area de texto para la "Descripción" (textarea)
        this.taDescripcion = new Ext.form.TextArea({
            id         : 'taDescripcion'+self.TreeComite.id,
            prevTab    : 'dfFHasta'+self.TreeComite.id,
            name       : 'descripcion',
            hiddenname : 'descripcion',
            maxLength  : 255,
            fieldLabel : self.idioma.taDescripcion_label,
            regex      : /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]* ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ.,;:()_])+$/,
            maskRe     : /^([a-z A-Z0-9áéíóúÁÉÍÓÚñÑ])$/,
            regexText  : self.idioma.lbRegexTextDescripcion,
            anchor     : '100%',
            height     : 100
        });
        //Formulario
        this.frmGestComite = new Ext.FormPanel({
            labelAlign : 'top',
            frame      : true,
            bodyStyle  : 'padding:5px 5px 0',
            items      : [{
                layout : 'column',
                items  : [{
                    layout      : 'form',
                    columnWidth : 1.0,
                    items       : [this.tfDenominacion]
                },{
                    layout      : 'form',
                    columnWidth : 0.52,
                    items       : [this.dfFDesde]
                },{
                    layout      : 'form',
                    columnWidth : 0.48,
                    items       : [this.dfFHasta]
                },{
                    layout      : 'form',
                    columnWidth : 1.0,
                    items       : [this.taDescripcion]
                }]
            }]
        });
        //Botones del formulario
        //Aplicar
        this.btnFrmAplicar = new Ext.Button({
            id      : 'btnFrmAplicarc',
            text    : self.idioma.btnFrmAplicar_text,
            tooltip : self.idioma.btnFrmAplicar_tooltips,
            iconCls : 'aplicar',
            handler : function () {
                enviarFrm('APLICAR');
            }
        });
        //Aceptar
        this.btnFrmAceptar = new Ext.Button({
            id      : 'btnFrmAceptarc',
            nextTab : 'tfDenominacion',
            text    : self.idioma.btnFrmAceptar_text,
            tooltip : self.idioma.btnFrmAceptar_tooltips,
            iconCls : 'aceptar',
            listeners: {
                'enable': function()
                {
                    self.btnFrmCancelar.nextTab = 'btnFrmAplicarc';
                },
                'disable': function()
                {
                    self.btnFrmCancelar.nextTab = 'tfDenominacion'+self.TreeComite.id;
                }
            },
            handler : function () {
                enviarFrm('ACEPTAR');
            }
        });
        //Cancelar
        this.btnFrmCancelar = new Ext.Button({
            id      : 'btnFrmCancelarc',
            nextTab : 'tfDenominacion'+self.TreeComite.id,
            prevTab : 'taDescripcion'+self.TreeComite.id,
            text    : self.idioma.btnFrmCancelar_text,
            tooltip : self.idioma.btnFrmCancelar_tooltips,
            iconCls : 'cancelar',
            handler : function () {
                resetearFrm();
                self.winGestComite.hide();
            }
        });
        //Window
        this.winGestComite = new Ext.Window({
            layout      : 'fit',
            modal       : true,
            closeAction : 'hide',
            closable    : false,
            constrain   : true,
            resizable   : false,
            width       : 400,
            height      : 310,
            items       : [this.frmGestComite],
            buttons     : [this.btnFrmCancelar, this.btnFrmAplicar, this.btnFrmAceptar],
            listeners: {
                'beforeshow': function()
                {
                    Ext.getCmp('tfDenominacion'+self.TreeComite.id).focus(true, 500);
                }
            },
            keys:[
                {
                    key: 'x',
                    alt: true,
                    fn: function () {
                        if (!self.btnFrmCancelar.disabled) {
                            self.btnFrmCancelar.handler();
                        }
                    }
                },
                {
                    key: 'p',
                    alt: true,
                    ctrl: true,
                    fn: function () {
                        if (!self.btnFrmAplicar.disabled) {
                            self.btnFrmAplicar.handler();
                        }
                    }
                },{
                    key: 13,//enter para aceptar
                    fn: function(){
                        if(self.btnFrmAceptar.isVisible()){
                            self.btnFrmAceptar.handler();
                        }
                    }
                }
            ]
        });
        /* --- GRID PARA LA GESTION DE PERSONAS --- */
        //Botones del toolbar
        //Boton para adicionar una persona al comité de ingreso
        this.btnGpAdd = new Ext.Button({
            id       : 'btnGpAdd',
            text     : self.idioma.btnGpAdd_text,
            tooltip  : self.idioma.btnGpAdd_tooltips,
            iconCls  : 'adicionar',
            disabled : true,
            handler : function () {
                self.TreeComite.disable();
                self.gpPers.disable();
                self.btnGpAdd.disable();
                self.pFormPers.expand();
            }
        });
        //Boton para eliminar una persona al comité de ingreso
        this.btnGpDel = new Ext.Button({
            id       : 'btnGpDel',
            text     : self.idioma.btnGpDel_text,
            tooltip  : self.idioma.btnGpDel_tooltips,
            iconCls  : 'eliminar',
            disabled : true,
            handler : function () {
                eliminarPersona();
            }
        });
        this.sfBuscar = new Ext.app.SearchField({
            store     : self.stPersona,
            emptyText : self.idioma.sfBuscar_emptytext,
            toolTipTrigger1: self.idioma.ttLimpiar,
            toolTipTrigger2: self.idioma.ttBuscar,
            disabled  : true
        });
        //Boton para mostrar la ayuda de la funcionalidad.
        this.btnAyuda = new Ext.Button({
            id       : 'btnAyuda',
            text     : self.idioma.btnAyuda_text,
            tooltip  : self.idioma.btnAyuda_tooltips,
            iconCls  : 'ayuda'
        });
        //Expander
        this.expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template('<div><b>' + self.idioma.gpPers_expander_text + ': </b>{cargo}.</div>')
        });

        function showSexo(val) {
            if (val === 'Femenino' || val === '0') {
                return '<center><img ext:qtip="<b>Femenina</b> "src="/pvd/seleccion/views/images/female.png" /></center>';
            } else {
                return '<center><img ext:qtip="<b>Maculino</b>" src="/pvd/seleccion/views/images/male.png" /></center>';
            }
        }
        //GRID
        this.checkSelMod = new Ext.grid.CheckboxSelectionModel();
        this.gpPers = new Ext.grid.GridPanel({
            //title      : self.idioma.gpPers_title,
            region     : 'center',
            border     : false,
            width      : '100%',
            stripeRows : true,
            loadMask: {msg: 'Cargando...'},
            store      : self.stPersona,
            sm         : this.checkSelMod,
            columns    : [
                this.checkSelMod,
                {header : self.idioma.gpPers_header_registro, menuDisabled : true, dataIndex : 'idpersona', sortable : true},
                {header : self.idioma.gpPers_header_numid,    menuDisabled : true, dataIndex : 'numid',     sortable : true},
                {header : self.idioma.gpPers_header_nombre,   menuDisabled : true, dataIndex : 'nombre',    sortable : true, width : 250},
                {header : 'Cargo',   menuDisabled : true, dataIndex : 'cargo', width : 250},
                {header : 'Género',   menuDisabled : true, dataIndex : 'sexo', width : 50},
                {hidden : true,                          menuDisabled : true, dataIndex : 'idcomitep', sortable : true}
            ],
            bbar       : new Ext.PagingToolbar({
                pageSize    : 15,
                store       : self.stPersona,
                displayMsg  : 'Mostrando {0} - {1} de {2} ',
                emptyMsg    : 'Vacío',
                displayInfo : true
            })
        });
        self.gpPers.getSelectionModel().on('selectionchange', function(sm) {
            if(sm.hasSelection()){
                self.btnGpDel.enable();
            } else {
                self.btnGpDel.disable();
            }
        });
        /* --- Formulario ADD PERSONA --- */
        //Botón aplicar
        this.btnFrmPersAplicar = new Ext.Button({
            text    : self.idioma.btnFrmAplicar_text,
            tooltip : self.idioma.btnFrmAplicar_tooltips,
            iconCls : 'aplicar',
            disabled : true,
            handler : function () {
                addPers('APLICAR');
            }
        });
        //Botón aceptar
        this.btnFrmPersAceptar = new Ext.Button({
            text    : self.idioma.btnFrmAceptar_text,
            tooltip : self.idioma.btnFrmAceptar_tooltips,
            iconCls : 'aceptar',
            disabled : true,
            handler : function () {
                addPers('ACEPTAR');
            }
        });
        //Botón cancelar
        this.btnFrmPersCancelar = new Ext.Button({
            text    : self.idioma.btnFrmCancelar_text,
            tooltip : self.idioma.btnFrmCancelar_tooltips,
            iconCls : 'cancelar',
            handler : function () {
                self.TreeComite.enable();
                self.gpPers.enable();
                self.btnGpAdd.enable();
                self.gpPersonasAll.getSelectionModel().clearSelections();
                self.pFormPers.collapse();
            }
        });

        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });

        this.sfBuscarPerson = new Ext.app.SearchField({
            store: this.stPersonasAll,
            pageSize: 15,
            disabled: false,
            toolTipTrigger1: this.idioma.ttLimpiar,
            toolTipTrigger2: this.idioma.ttBuscarPer,
            emptyText: 'Criterio a buscar...'
        });

        this.gpPersonasAll = new Ext.grid.GridPanel({
            title: 'Listado de todas las personas',
            store: this.stPersonasAll,
            tbar: ['Buscar: ', this.sfBuscarPerson],
            height: 340,
            border: false,
            region: 'center',
            loadMask:{msg: this.idioma.lbCargando},
            sm: this.smPersonas,
            columns: [this.smPersonas,
                {header: 'No. Identidad', width:100, dataIndex: 'numid'},
                {header: 'Nombres y apellidos', width:250, dataIndex: 'nombreapellidos'},
                {header: 'Cargo', width:250, dataIndex: 'denomcargo'},
                {header : 'Género',   menuDisabled : true, dataIndex : 'sexo', width : 50, renderer: showSexo},
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: this.stPersonasAll,
                displayInfo: true
            })
        });
        //Manipulación del grid del recuperador complejo
        self.gpPersonasAll.getSelectionModel().on('selectionchange', function(sm) {
            if(sm.hasSelection()){
                self.btnFrmPersAceptar.enable();
                self.btnFrmPersAplicar.enable();
            } else {
                self.btnFrmPersAceptar.disable();
                self.btnFrmPersAplicar.disable();
            }
        });
        function getRenderes() {
            return Ext.apply({
                showSexo: function (val) {

                    if (val == 'Femenino') {
                        return '<center><img ext:qtip="<b>Femenina</b> "src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHgSURBVDjLjZLNbtNAFIXrJ8mL+QVQoVUWICFEFZCAbrJCAdpFWCC1i1QgVLEoZYFAgrY0rhPHTmwnThP/BKetU9vxT7I5zHWEhEBuWBxpFnO+c+6dWQGw8qfUisQNdnR+tD+ojQ9txz2wHPvdea1f7fDtssj9ff8fs7VnlCbCJRIzwsxNMfuZIuoGuPriwtjqlOSndS4XQMlkJuPcm2F+yXSxUGrHcD9YUDcbfC6AalMyGaNuiIvDEdx9C0FjwqAJfMGD/qRZywXQvFk6SxwfOOhvdwpGRSnYb/pslASxMYX6UHRuaDB0aGYCuO9N9J4rhW65VTC39AWgN0XnnpAPMHeN2lT1F3XrHqzXBsxXOq4+u0idGN7XMeTiaf4IvRcKP/5oIxlEWSKJjCTayeClhubaUf4SlWcCp5el0ujtEGHrOtt8asUIxQmGzCzdOS6JxW/5z5hBHguc9qjJdzekfqQGSM4jdFaFsHX7hG+sf7/5I5HaG2dV7UFD0+6K2lTxs8W1b536yuoPTVo72lwKUO+Lc6pP5nQYZ/uIeyGCMw+shbYUoBTrGYBE9UmhdI1A9CD/D0BaP6nKrC6rrZGRRGc5G+H401LAb5HBZ7WpOp3z7uUC2HtXqDKJJe/k3fsF8TkmWq5zP6gAAAAASUVORK5CYII=" /></center>';
                    } else {
                        return '<center><img ext:qtip="<b>Maculino</b>" src="data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIHSURBVDjLpVNNaxNRFH0fgzNxRlNIm6QVsSRQ1IUiVCSCS8FF4kokO/9BF7oUstBll4IuunBpl61RNy4suhgF21WhJVU0WiHUksmQr2bex/TeMJEoxog+uMzjzT3nnXPmDg3DkPzPMsY1PHrpdaWUZFBCDJ6C3L91NjaWAAH5SwkLhaJaTfBJyOOnmwf4no0lkIJUqg2hAKUAqKMKQMFfEdy5PhN7X/Ge1L22QqACCUFPhCIIvv6UwdJaiyopi1KqAnjMRZ5dUDBzbta5fDxuc99vafuYw9SQgj7B0qsmBeDdTJKXUhMWi5mcaRKSVrt30uCcHrFMtrv7Xb5wq8+uzp/Ip1MJLoYJ4KZiZsoozU5bBqWM9r8slO0c5bjvdrr6uVt9B6CF1dcfrgm5JVHhDwJIuoA3QyS0tteUGzueEtBwIRvnyXTC6HR76PnLw9tX0HdsOCMWJZ0zLZANt63v1NV+ozO377Xn3M2a0hCabdsMPOdGDhL60dFASthjQHgmOOufK/Az8PzrYhGB22wdaGw+n5ngjkkrjsUqF88kOZ75dV9jz2gFgSh/+ubfOJ012VR60sinJg0UhGApgnDrYw0IZHkkAUheXt/ey/aCoHRqOs4cx+7n4TcaehvAbzY+34PUl39HQAd/48KDtxT8FyH9ghQyhyOMgwRVRvDK4s3wjwT/ug4BPyZOkZTlSM0AAAAASUVORK5CYII=" /></center>';
                    }
                },
                showGradoMilitar: function (val, opt, rec) {
                    // grado
                    if (!Ext.isEmpty(val)) {
                        return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                    } else {
                        return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                    }
                }
            });
        }
        //Panel
        this.pFormPers = new Ext.Panel({
            layout       : 'fit',
            region       : 'south',
            collapseMode : 'mini',
            collapsed    : 'true',
            width        : '100%',
            height       : 400,
            bbar         : ['->', this.btnFrmPersCancelar, this.btnFrmPersAplicar, this.btnFrmPersAceptar],
            items        : [this.gpPersonasAll]
        });
        /* --- Panel principal --- */
        this.pGestPersComite = new Ext.Panel({
            region     : 'center',
            border	   : true,
            tbar       : [this.btnGpAdd, this.btnGpDel, '-', this.sfBuscar, '->', '-', this.btnAyuda],
            autoScroll : true,
            layout     :'border',
            width      : '60%',
            items      : [this.gpPers, this.pFormPers]
        });

        this.items = [this.TreeComite, this.pGestPersComite];

        this.TreeComite.on('render', function ()
        {
            self.btnAddComite.focus();
        });

        self.winGestComite.on('show', function() {
            windAddComite = 1;
        });

        self.winGestComite.on('hide', function() {
            windAddComite = 0;
            self.btnAddComite.focus();
        });

        self.pFormPers.on('expand', function() {
            addPersExpand = 1;
        });
        self.pFormPers.on('collapse', function() {
            addPersExpand = 0;
        });

        this.keys = [
            {
                key: 73,//i para adicionar
                ctrl: true,
                //stopEvent: true,
                fn: function(){
                    if(!self.btnGpAdd.disabled){
                        self.btnGpAdd.handler();
                    }
                }
            },{
                key: 73,//i para adicionar
                alt: true,
                fn: function(){
                    if(!self.btnAddComite.disabled){
                        self.btnAddComite.handler();
                    }
                }
            },{
                key: 77,//b para modificar
                alt: true,
                fn: function(){
                    if(!self.btnModComite.disabled){
                        self.btnModComite.handler();
                    }
                }
            },{
                key: 'h',//b para ayuda
                alt: true,
                fn: function(){
                    var title = 'Ayuda de Gestionar comité de ingreso';
                    var referencia = '';
                    help.show(title, referencia);
                }
            },{
                key: 88,//b para cancelar
                alt: true,
                fn: function(){
                    if(!self.btnFrmPersCancelar.disabled){
                        self.btnFrmPersCancelar.handler();
                    }
                }
            },{
                key: 76,//b para limpiar
                alt: true,
                fn: function(){
                    self.sfBuscar.onTrigger1Click();
                }
            },{
                key: 66,//b para buscar
                alt: true,
                fn: function(){
                    self.sfBuscar.onTrigger2Click();
                }
            },{
                key: 46,//del para eliminar
                fn: function(){
                    if(!self.btnDelComite.disabled){
                        self.btnDelComite.handler();
                    }
                }
            },{
                key: 46,//del para eliminar
                alt: true,
                fn: function(){
                    if(!self.btnGpDel.disabled){
                        self.btnGpDel.handler();
                    }
                }
            },{
                key: 13,//enter para aceptar
                fn: function(){
                    if(self.btnFrmPersAceptar.isVisible() && addPersExpand == 1){
                        self.btnFrmPersAceptar.handler();
                    }
                }
            },{
                key: 80,//p para aplicar
                alt: true,
                ctrl: true,
                fn: function(){
                    if(self.btnFrmPersAplicar.isVisible() && addPersExpand == 1){
                        self.btnFrmPersAplicar.handler();
                    }
                }
            }
        ];

        //Función para gestionar el comportamiento de los botones del formulario y el envio de los datos
        function enviarFrm(btn) {
            if (self.frmGestComite.getForm().isValid()) {
                Ext.Ajax.request({
                    url     : (frmAccion == 'add') ? '/pvd/seleccion/index.php/gestionarcomite/addComite' : '/pvd/seleccion/index.php/gestionarcomite/modComite',
                    params  : {
                        idcomite     : (frmAccion == 'mod') ? self.TreeComite.getSelectionModel().getSelectedNode().attributes.id : null,
                        denominacion : self.tfDenominacion.getValue(),
                        fdesde       : self.dfFDesde.getRawValue(),
                        fhasta       : (self.dfFHasta.getRawValue()) ? self.dfFHasta.getRawValue() : null,
                        descripcion  : (self.taDescripcion.getValue()) ? self.taDescripcion.getValue() : null
                    },
                    success : function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if(responseData) {
                            if (btn == 'ACEPTAR') {
                                self.winGestComite.hide();
                                self.TreeComite.getRootNode().reload();
                                if (frmAccion == 'add') {
                                    mostrarMensaje(2, self.idioma.msgAddComite_success);
                                } else {
                                    mostrarMensaje(2, self.idioma.msgModComite_success);
                                }
                            }
                            if (btn == 'APLICAR') {
                                self.TreeComite.getRootNode().reload();
                                mostrarMensaje(2, self.idioma.msgAddComite_success);
                            }
                            resetearFrm();
                        } else {
                            if (frmAccion == 'add') {
                                mostrarMensaje(6, self.idioma.msgAddComite_fail);
                            } else {
                                mostrarMensaje(6, self.idioma.msgModComite_fail);
                            }
                        }
                    }
                });
            } else {
                mostrarMensaje(6, self.idioma.msgFrmComite_fail);
            }
        }

        function resetearFrm() {
            self.tfDenominacion.setValue('');
            self.dfFDesde.setValue(new Date().format('d/m/Y'));
            self.dfFHasta.setValue('');
            self.taDescripcion.setValue('');
            self.frmGestComite.getForm().clearInvalid();
        }

        //Función para el envio de las personas que se adicionarán al comité de ingreso
        function addPers(btn) {
            var selectPers = self.gpPersonasAll.getSelectionModel().getSelections();
            if (selectPers.length > 0) {
                var arrayPers = new Array();
                for(i = 0; i < selectPers.length; i++) {
                    arrayPers.push(selectPers[i].data.idpersona);
                }
                Ext.Ajax.request({
                    url     : '/pvd/seleccion/index.php/gestionarcomite/addPersonasComite',
                    params  : {
                        idcomite   : self.TreeComite.getSelectionModel().getSelectedNode().attributes.id,
                        estructura : (self.ckbEstruct.checked) ? 1 : 0,
                        arrayPers  : Ext.encode(arrayPers)
                    },
                    success : function (r) {
                        var responseData = Ext.decode(r.responseText);
                        if(responseData) {
                            if (btn == 'ACEPTAR') {
                                self.TreeComite.enable();
                                self.gpPers.enable();
                                self.btnGpAdd.enable();
                                self.pFormPers.collapse();
                                mostrarMensaje(2, self.idioma.msgAddPersComite_success);
                            }
                            if (btn == 'APLICAR') {
                                self.gpPersonasAll.getSelectionModel().clearSelections();
                                mostrarMensaje(2, self.idioma.msgAddPersComite_success);
                            }
                            resetearFrm();
                            self.stPersona.reload();
                        } else {
                            mostrarMensaje(6, self.idioma.msgAddPersComite_fail);
                        }
                    }
                });
            } else {
                mostrarMensaje(6, 'Debe seleccionar al menos una persona.');
            }
        }

        function eliminarPersona()
        {
            var selectPers = self.gpPers.getSelectionModel().getSelections();
            var arrayPers = new Array();
            for(i = 0; i < selectPers.length; i++) {
                arrayPers.push(selectPers[i].data.idcomitep);
            }
            var mensaje = '';
            if (selectPers.length == 1) {
                mensaje = '¿Est&aacute; seguro que desea eliminar la persona seleccionada?';
            } else {
                mensaje = '¿Est&aacute; seguro que desea eliminar las personas seleccionadas?';
            }
            mostrarMensaje(2, mensaje, function (btnPress){
                if (btnPress == 'ok') {
                    Ext.getBody().mask(self.idioma.msgDelPersComite_mask);
                    Ext.Ajax.request({
                        url     : '/pvd/seleccion/index.php/gestionarcomite/delPersonasComite',
                        params  : {
                            arrPersCte: Ext.encode(arrayPers)
                        },
                        callback : function() {Ext.getBody().unmask();},
                        success : function (r) {
                            var responseData = Ext.decode(r.responseText);
                            if(responseData) {
                                if (selectPers.length == 1) {
                                    mensaje = 'La persona seleccionada ha sido eliminada satisfactoriamente.';
                                } else {
                                    mensaje = 'Las personas seleccionadas han sido eliminadas satisfactoriamente.';
                                }
                                mostrarMensaje(2, mensaje);
                                self.stPersona.reload();
                            } else {
                                if (selectPers.length == 1) {
                                    mensaje = 'La persona seleccionada no puede ser eliminada debido a que se encuentra en uso.';
                                } else {
                                    mensaje = 'Alguna de las personas seleccionadas no puede ser eliminada debido a que se encuentra en uso.';
                                }
                                mostrarMensaje(6, mensaje);
                            }
                        }
                    });
                }
            });
        }

        function eliminarComite()
        {
            mostrarMensaje(2, self.idioma.msgDelComite_confirm, function (btnPresionado){
                if (btnPresionado == 'ok') {
                    Ext.getBody().mask(self.idioma.msgDelComite_status);
                    Ext.Ajax.request({
                        url      : '/pvd/seleccion/index.php/gestionarcomite/delComite',
                        params   : {idcomite : self.TreeComite.getSelectionModel().getSelectedNode().attributes.id},
                        callback : function() {Ext.getBody().unmask();},
                        success  : function(r) {
                            var responseData = Ext.decode(r.responseText);
                            if(responseData == false)
                                mostrarMensaje(6, self.idioma.msgDelComite_fail);
                            else{
                                mostrarMensaje(1, self.idioma.msgDelComite_success);
                                self.btnDelComite.disable();
                            }
                            self.TreeComite.getRootNode().reload();
                        }
                    });
                }
            });
        }
        Pvd.Seleccion.Nomencladores.Comite.superclass.initComponent.call(this);
    }
});

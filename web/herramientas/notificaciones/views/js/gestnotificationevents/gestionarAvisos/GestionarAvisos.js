//-----------------------------------------------------------------------------------------------------------------
Ext.namespace('Ext.notificaciones.configurarMedio');
Ext.notificaciones.configurarMedio.Via = Ext.extend(Ext.form.FormPanel, {
    frame: true,
    layout: 'absolute',
    validateDefault: true,
    form1:true,
    form2:true,
    form3:true,
    initComponent: function(){
        Ext.notificaciones.configurarMedio.Via.superclass.initComponent.call(this);
        var flag = true;
        this.chboxActivo = new Ext.form.Checkbox({
            boxLabel:   this.labels.lbActivateVia,
            id: this.idactive,
            x: 0,
            y: 0
        });
        this.hdIdentifier = new Ext.form.Hidden({});
        this.add(this.chboxActivo, this.hdIdentifier);
        this.chboxActivo.on("check", function(){
            if (this.chboxActivo.checked){
                this.lbContent.enable();
                this.taContent.enable();
                this.fireEvent('viaactivada', this);
            }
            else{
                this.lbContent.disable();
                this.taContent.disable();
                this.fireEvent('viadesactivada', this);
            }
        }, this);        
        this.on('activate', function(){            
            this.chboxActivo.focus(false, 200);
        }, this);

        this.on('clientvalidation', function(form, valid){
            var myFlag = -1;
            if(form.validateDefault){
                if(flag){
                    flag = false;
                    form.defaultValues = this.getForm().getValues(true);
                }
                var btnApply = "";
                if(Ext.getCmp('btn-apply-save-notification') != undefined)
                    btnApply = Ext.getCmp('btn-apply-save-notification');

                var btnAcept = Ext.getCmp('btn-accept-save-notification');
                var arrForm = [btnAcept.form1, btnAcept.form2, btnAcept.form3];
                if(!btnAcept.tab2 && !btnAcept.tab1){
                    if(form.id == 'smstab'){
                        btnAcept.form2 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        if(btnApply != "") {
                            btnApply.form2 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        }
                        myFlag = 3;
                    }else if(form.id == 'jabbertab'){
                        myFlag = 0;
                        btnAcept.form1 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        if(btnApply != "") {
                            btnApply.form1 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        }
                    }else{
                        myFlag = 1;
                        btnAcept.form2 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        if(btnApply != "") {
                            btnApply.form2 = (valid && form.getForm().getValues(true) != form.defaultValues);
                        }
                    }

                    if(!valid){
                        btnAcept.setDisabled(
                            !(valid && form.getForm().getValues(true) != form.defaultValues)
                        );
                        if(btnApply != "") {
                            btnApply.setDisabled(
                                !(valid && form.getForm().getValues(true) != form.defaultValues)
                            );
                        }
                    }else if(myFlag == 0 && Ext.getCmp('smscorreo').getForm().isValid() && Ext.getCmp('smstab').getForm().isValid()){
                        btnAcept.setDisabled(
                            !(valid && form.getForm().getValues(true) != form.defaultValues)
                        );
                        if(btnApply != "") {
                            btnApply.setDisabled(
                                !(valid && form.getForm().getValues(true) != form.defaultValues)
                            );
                        }
                    }else if(myFlag == 1 && Ext.getCmp('jabbertab').getForm().isValid() && Ext.getCmp('smstab').getForm().isValid()){
                        btnAcept.setDisabled(
                            !(valid && form.getForm().getValues(true) != form.defaultValues)
                        );
                        if(btnApply != "") {
                            btnApply.setDisabled(
                                !(valid && form.getForm().getValues(true) != form.defaultValues)
                            );
                        }
                    }else if(myFlag == 2 && Ext.getCmp('jabbertab').getForm().isValid() && Ext.getCmp('smscorreo').getForm().isValid()){
                        btnAcept.setDisabled(
                            !(valid && form.getForm().getValues(true) != form.defaultValues)
                        );
                        if(btnApply != "") {
                            btnApply.setDisabled(
                                !(valid && form.getForm().getValues(true) != form.defaultValues)
                            );
                        }
                    }
                    btnAcept.tab3 = (valid && form.getForm().getValues(true) != form.defaultValues);
                    if(btnApply != "") {
                        btnApply.tab3 = !(valid && form.getForm().getValues(true) != form.defaultValues);
                    }
                }
                if(btnAcept.tab1 || btnAcept.tab2){
                    btnAcept.setDisabled(false);
                }
            }

        });
    },
    hasValidContent: function(){
        return this.getContent().trim().length > 0;
    },
    setContent: function(value){
        this.taContent.setValue(value);
    },
    getContent: function(){
        return this.taContent.getValue();
    },
    getIdentifier: function(){
        return this.hdIdentifier.getValue();
    },
    getChbox: function(){
        return this.chboxActivo;
    },
    setIdentifier:function(ident){
        this.hdIdentifier.setValue(ident);
    },
    isActive: function(){
        return this.chboxActivo.checked;
    }
});
//-----------------------------------------------------------------------------------------------------------------

Ext.notificaciones.configurarMedio.Sms = Ext.extend(Ext.notificaciones.configurarMedio.Via, {
    idactive: 'id-activo-sms',
    initComponent : function(){
        Ext.notificaciones.configurarMedio.Sms.superclass.initComponent.call(this);
        this.title = this.labels.via.sms;
        this.lbContent = new Ext.form.Label({
            text:       this.labels.lbContent + ':',
            x:          0,
            y:          30,
            disabled:   true
        });
        this.taContent = new Ext.form.TextArea({
            x:          0,
            y:          50,
            width:      610,
            height:     305,
            disabled:   true,
            allowBlank: false,
            id:         'id_descripcion_sms'
        });
        this.add(this.lbContent);
        this.add(this.taContent);
    },
    getConcretName: function(){
        return 'smstext';
    }
});
Ext.reg('configurarMedio.sms', Ext.notificaciones.configurarMedio.Sms);


//-------------------------------------------------------------------------------------------------------

Ext.notificaciones.configurarMedio.System = Ext.extend(Ext.notificaciones.configurarMedio.Via, {
    idactive: 'id-activo-system',
    initComponent : function(){
        Ext.notificaciones.configurarMedio.System.superclass.initComponent.call(this);
        this.title = this.labels.via.system;
        this.lbContent = new Ext.form.Label({
            text:       this.labels.lbContent + ':',
            x:          0,
            y:          30,
            disabled:   true
        });
        this.taContent = new Ext.form.TextArea({
            x:          0,
            y:          50,
            width:      610,
            height:     305,
            disabled:   true,
            allowBlank: false,
            id:         'id_descripcion_system'
        });
        this.add(this.lbContent);
        this.add(this.taContent);
    },
    getConcretName: function(){
        return 'sistema';
    }
});
Ext.reg('configurarMedio.system', Ext.notificaciones.configurarMedio.System);

//--------------------------------------------------------------------------------------------------------

Ext.notificaciones.configurarMedio.Correo = Ext.extend(Ext.notificaciones.configurarMedio.Via, {
    idactive: 'id-activo-correo',
    initComponent: function(){
        Ext.notificaciones.configurarMedio.Correo.superclass.initComponent.call(this);
        this.title = this.labels.via.email;
        this.lbTopic = new Ext.form.Label({
            text:       this.labels.lbTopic + ':',
            x:          0,
            y:          30,
            disabled:   true
        });
        this.tfTopic = new Ext.form.TextField({
            width:      610,
            id:         'id_asunto_correo',
            x:          0,
            y:          50,
            disabled:   true
        });
        this.lbContent = new Ext.form.Label({
            text:       this.labels.lbContent + ':',
            x:          0,
            y:          80,
            disabled:   true
        });
        this.taContent = new Ext.form.TextArea({
            x:          0,
            y:          100,
            width:      610,
            height:     230,
            disabled:   true,
            allowBlank: false,
            id:         'id_descripcion_correo'
        });
        this.add(this.lbTopic);
        this.add(this.tfTopic);
        this.add(this.lbContent);
        this.add(this.taContent);
        this.chboxActivo.on("check", function(){
            if (this.chboxActivo.checked){
                this.lbTopic.enable();
                this.tfTopic.enable();
            }
            else{
                this.lbTopic.disable();
                this.tfTopic.disable();
            }
        }, this);
    },
    setTopic : function(topic){
        this.tfTopic.setValue(topic);
    },
    getTopic : function(){
        return this.tfTopic.getRawValue();
    },
    getConcretName: function(){
        return 'email';
    }
});
Ext.reg('configurarMedio.correo', Ext.notificaciones.configurarMedio.Correo);
//-----------------------------------------------------------------------------------------------------------------

Ext.notificaciones.configurarMedio.Jabber = Ext.extend(Ext.notificaciones.configurarMedio.Via, {
    idactive: 'id-activo-jabber',
    initComponent : function(){
        Ext.notificaciones.configurarMedio.Jabber.superclass.initComponent.call(this);
        this.title = this.labels.via.jabber;
        this.lbContent = new Ext.form.Label({
            text:       this.labels.lbContent + ':',
            x:          0,
            y:          30,
            disabled:   true
        });
        this.taContent = new Ext.form.TextArea({
            x:          0,
            y:          50,
            width:      610,
            height:     305,
            disabled:   true,
            allowBlank: false,
            id:         'id_descripcion_jabber'
        });
        this.add(this.lbContent);
        this.add(this.taContent);
    },
    getConcretName: function(){
        return 'jabber';
    }
});
Ext.reg('configurarMedio.jabber', Ext.notificaciones.configurarMedio.Jabber);

//-----------------------------------------------------------------------------------------------------------------

Ext.namespace('Ext.notificaciones.gestionarAvisos');
Ext.notificaciones.gestionarAvisos.ConfigurarMedio = Ext.extend(Ext.TabPanel, {
    frame:      true,
    activeTab: 0,
    id: 'tp-viasEnv',
    initComponent: function(){
        this.title = this.labels.lbNotificationVia;
        var listenersVia = {
            'viaactivada':    this.fnViaActivada,
            'viadesactivada': this.fnViaDesactivada,
            scope: this
        };
        this.System = new Ext.notificaciones.configurarMedio.System({
            labels: this.labels,
            listeners: listenersVia
        });
        this.Correo = new Ext.notificaciones.configurarMedio.Correo({
            id: 'smscorreo',
            labels: this.labels,
            listeners: listenersVia
        });
        this.Jabber = new Ext.notificaciones.configurarMedio.Jabber({
            id: 'jabbertab',
            labels: this.labels,
            listeners: listenersVia
        });
        this.Sms    = new Ext.notificaciones.configurarMedio.Sms({
            id: 'smstab',
            labels: this.labels,
            listeners: listenersVia,
            disabled: true
        });
        this.methods = [];
        this.initMethod('email', this.getCorreo);
        this.initMethod('sistema', this.getSystem);
        this.initMethod('jabber', this.getJabber);
        this.initMethod('sms', this.getSms);
        
        this.on('activate', function(){
            this.getActiveTab().getChbox().focus(false, 200);
        }, this);
        this.on('tabchange', function(tabpanel, tab){
            if(tab.id == 'smstab'){
               tab.validateDefault = true;
                Ext.getCmp('jabbertab').validateDefault = false;
                Ext.getCmp('smscorreo').validateDefault = false;
            }else if(tab.id == 'jabbertab'){
                tab.validateDefault = true;
                Ext.getCmp('smstab').validateDefault = false;
                Ext.getCmp('smscorreo').validateDefault = false;
            }else{
                tab.validateDefault = true;
                Ext.getCmp('smstab').validateDefault = false;
                Ext.getCmp('jabbertab').validateDefault = false;
            }
        }, this);
        //...
        this.items = [/*this.System,*/ this.Jabber, this.Correo, this.Sms];
        Ext.notificaciones.gestionarAvisos.ConfigurarMedio.superclass.initComponent.call(this);
    },
    getCorreo: function(){
        return this.Correo;
    },
    getJabber: function(){
        return this.Jabber;
    },
    getSystem: function(){
        return this.System;
    },
    getSms: function(){
        return this.Sms;
    },
    getVias: function(){
        return this.items.items;
    },
    initMethod: function(name, fn){
        this.methods[name] = fn;
    },
    getViaMethod: function(via){
        return this.methods[via];
    },
    fnViaActivada: function(via){
        this.fireEvent('viaactivada', via.getConcretName());
    },
    fnViaDesactivada: function(via){
        this.fireEvent('viadesactivada', via.getConcretName());
    }
});
Ext.reg('gestionarAvisos.configurarMedio', Ext.notificaciones.gestionarAvisos.ConfigurarMedio);

//------------------------------------------------------------------------------------------

Ext.notificaciones.gestionarAvisos.StoreClass = {    
    "listartiposavisos":new Ext.data.JsonStore({
        url: '/herramientas/notificaciones/index.php/gestavisos/listartiposavisos',
        fields:["idtipoaviso","denominacion", "descripcion"],
        baseParams : {
            start : 0,
            limit : 10
        },
        autoLoad:true
    })
}

Ext.notificaciones.gestionarAvisos.ConfigurarAviso = Ext.extend(Ext.form.FormPanel, {
    layout: 'form',
    frame:  true,  
    labelAlign: 'top',
    validateDefault: true,
    id:'formConfigAv',
    initComponent: function(){
        var self = this;
        var flag = true;
        this.title = this.labels.lbBasicConfig;
        this.bodyStyle = 'padding:5px 5px 0';
        this.items = [{
            xtype: 'textfield',            
            fieldLabel: this.labels.lbNotificationName,            
            name:"denominacion",
            id: "id_ca_denominacion",
            prevTab: 'btn-accept-save-notification',
            nextTab: 'id_ca_descripcion',
            maskRe:/^[a-zA-Z0-9áéíóúñüÑ_]*$/,
            regex:new RegExp("^[a-zA-Z0-9áéíóúñüÑ_]*$"),
            regexText:'Este campo solo permite letras, n&uacute;meros y gui&oacute;n bajo.',
            maxLength: 50,
            maxLengthText: "El tamaño máximo requerido es 50 caracteres.",
            minLength: 1,            
            anchor: '98%',
            vtype:'vtalfanumericosguionesbajos',
            allowBlank: false
        }, {
            xtype:      'textarea',            
            anchor:     '98%',
            height: 150,
            fieldLabel: this.labels.lbNotificationDesc,            
            nextTab: 'id_ca_tipo_aviso',            
            name:       "descripcion",
            id:         'id_ca_descripcion',            
            allowBlank: true
        }, {
            xtype: 'combo',            
            anchor: '98%',
            fieldLabel: this.labels.lbNotificationType,            
            minListWidth: 20,            
            allowBlank : false,
            id: 'id_ca_tipo_aviso',
            nextTab: 'id_ca_comando_validacion',
            displayField : 'denominacion',
            hiddenName : "idtypeaviso",
            valueField : "idtipoaviso",
            typeAhead : true,
            tpl: '<tpl for="."><div ext:qtip="<b>{denominacion}</b><p><tpl if="descripcion">{descripcion}.</tpl></p> " class="x-combo-list-item">{denominacion}</div></tpl>',
            mode : 'local',
            forceSelection : true,
            editable:false,
            triggerAction : 'all',
            emptyText : this.labels.lbSelect,
            selectOnFocus : true,
            store: Ext.notificaciones.gestionarAvisos.StoreClass["listartiposavisos"]
        }, {
            xtype: 'textfield',
            anchor: '98%',                        
            name:"validador",
            fieldLabel: this.labels.lbValidationCommand,
            id:     'id_ca_comando_validacion',
            emptyText : this.labels.lbSelect,            
            allowBlank:true,
            readOnly: true,
            listeners:{
                focus:function(){
                    if(!self.win_Validador){
                        self.win_Validador = new Ext.notificaciones.gestionarAvisos.SelectValidation({
                            labels: self.labels
                        });
                        Ext.applyIf(self.win_Validador.loader.baseParams, {
                            idevento:self.idevento
                        });
                        self.win_Validador.on("selectednode", function(win,selectednode){
                            fromCmp = selectednode.text.indexOf('[') !== -1;
                            this.setValue(fromCmp ? selectednode.id : (selectednode.parentNode.text + '-' + selectednode.text));
                        }, this);
                    }
                    self.win_Validador.show();
                    self.win_Validador.focus();
                },
                blur: function(){
                    Ext.getCmp('id_ca_activo').focus();
                }
            }
        }, {
            xtype: 'checkbox',
            boxLabel: this.labels.state.active,
            anchor: '98%',
            fieldLabel: 'Estado',
            name:"active",
            checked: true,
            nextTab: 'btn-cancel-save-notification',
            prevTab: 'id_ca_comando_validacion',
            id: 'id_ca_activo'
        }];
        this.on('clientvalidation', function(form, valid){

            if(form.validateDefault){
                if(flag){
                    flag = false;
                    form.defaultValues = this.getForm().getValues(true);
                }
                var btnApply = "";
                if(Ext.getCmp('btn-apply-save-notification') != undefined)
                    btnApply = Ext.getCmp('btn-apply-save-notification');
                if(btnApply != ""){
                    if(!btnApply.tab2 && !btnApply.tab3){
                        btnApply.setDisabled(
                            !(valid && form.getForm().getValues(true) != form.defaultValues)
                        );
                        btnApply.tab1 = !(valid && form.getForm().getValues(true) != form.defaultValues);
                    }
                }
                var btnAcept = Ext.getCmp('btn-accept-save-notification');
                if(!btnAcept.tab2 && !btnAcept.tab3){
                    btnAcept.setDisabled(
                        !(valid && form.getForm().getValues(true) != form.defaultValues)
                    );
                    btnAcept.tab1 = (valid && form.getForm().getValues(true) != form.defaultValues);
                }
            }

        });
        Ext.notificaciones.gestionarAvisos.ConfigurarAviso.superclass.initComponent.call(this);

    },
    isActive: function(){
        return Ext.getCmp('id_ca_activo').getValue();
    }
});
Ext.reg('gestionarAvisos.configurarAviso', Ext.notificaciones.gestionarAvisos.ConfigurarAviso);

//-------------------------------------------------------------------------------------------

Ext.notificaciones.gestionarAvisos.Destinatarios = Ext.extend(Ext.Panel ,{
    frame:  true,
    layout: 'fit',
    ListarDestinatarios:    'none',
    id: 'tp-destinatarios',    
    listeners: {
        'activate': function(){            
            this.ListarDestinatarios.getTopToolbar().items.items[0].focus();
        }
    },
    initComponent:  function(){        
        this.title = this.labels.ttDestinatarios;
        this.ListarDestinatarios = new Ext.notificaciones.gestionarDestinatarios.ListarDestinatarios({
            labels: this.labels,
            adicionar: this.adicionar,
            allData: this.allData
        });
        this.items = [{
            xtype:  'tabpanel',
            region: 'center',
            activeTab: 0,
            listeners: {
                tabchange: function(tp, nextTab){
                    if(nextTab instanceof Ext.notificaciones.gestionarDestinatarios.ListarDestinatarios){
                        nextTab.getTopToolbar().items.items[0].focus();
                    }
                    else if(nextTab instanceof Ext.notificaciones.gestionarGruposContactos.TabContenedor){
                        nextTab.getGpGrupos().getTopToolbar().items.items[0].focus();
                    }
                },
                scope: this
            },
            items:  [this.ListarDestinatarios, new Ext.notificaciones.gestionarGruposContactos.TabContenedor({
                labels: this.labels
            })]
        }];
        Ext.notificaciones.gestionarAvisos.Destinatarios.superclass.initComponent.call(this);
    },
    getDestinatarios: function(){
        return this.ListarDestinatarios;
    }
});
Ext.reg('gestionarAvisos.destinatarios', Ext.notificaciones.gestionarAvisos.Destinatarios);

//-----------------------------------------------------------------------------------------------------------------

Ext.notificaciones.gestionarAvisos.EditarAviso = Ext.extend(Ext.Window, {
    modal:              true,
    layout:             'fit',
    height:             490,//400
    width:              640,
    closeAction:        "destroy",
    resizable:          false,
    constrain : true,
    autoValidate: false,
    initComponent: function() {        
        var elementos = [], botones = [];        
        //flags to update notification vias
        this.oldViasActivadas = [];
        this.newViasActivadas = [];
        this.newViasDesactivadas = [];
        //
        this.defaultNotificationType = null;
        this.defaultEvent = null;
        Ext.Ajax.request({
            url: '/herramientas/notificaciones/index.php/gestavisos/obtenertipoavisopordefecto',
            success: function(response, opt){
                this.defaultNotificationType = Ext.decode(response.responseText).id;
            },
            scope: this
        });
        if(this.nombreEvento){
            Ext.Ajax.request({
                url: '/herramientas/notificaciones/index.php/gestnotificationevents/obtenerideventopornombre',
                success: function(response, opt){
                    this.defaultEvent = Ext.decode(response.responseText).id;
                },
                params:{
                    nombre: this.nombreEvento
                },
                scope: this
            });
        }                

        //botón aplicar
        this.showApplyBtn = this.hasOwnProperty('showApplyBtn') ? this.showApplyBtn : true;
                
        //tabs
        if(this.onlyTabs){
            if(this.onlyTabs.contains('basic')){
                elementos.push(this.ConfigurarAviso = new Ext.notificaciones.gestionarAvisos.ConfigurarAviso({
                    idevento:this.idevento,
                    labels: this.labels
                }));
            }
            if(this.onlyTabs.contains('vias')){
                elementos.push(this.ConfigurarMedio = new Ext.notificaciones.gestionarAvisos.ConfigurarMedio({
                    labels: this.labels,
                    listeners: {
                        'viaactivada':    this.onViaActivada,
                        'viadesactivada': this.onViaDesactivada,
                        scope: this
                    }
                }));
            }
            if(this.onlyTabs.contains('destinatarios')){
                elementos.push(this.Destinatarios   = new Ext.notificaciones.gestionarAvisos.Destinatarios({
                    labels: this.labels,
                    adicionar: this.adicionar,
                    allData: this.allData
                }));
            }
        }
        else{
            this.ConfigurarAviso = new Ext.notificaciones.gestionarAvisos.ConfigurarAviso({
                idevento:this.idevento,
                labels: this.labels
            });
            this.ConfigurarMedio = new Ext.notificaciones.gestionarAvisos.ConfigurarMedio({
                labels: this.labels,
                listeners: {
                    viaactivada:    this.onViaActivada,
                    viadesactivada: this.onViaDesactivada,
                    scope: this
                }
            });
            this.Destinatarios   = new Ext.notificaciones.gestionarAvisos.Destinatarios({
                labels: this.labels,
                adicionar: this.adicionar,
                allData: this.allData
            });
            elementos = [this.ConfigurarAviso, this.Destinatarios, this.ConfigurarMedio];
        }        
        //botones
        botones.push({
            xtype: 'button',
            id: 'btn-cancel-save-notification',            
            text: this.labels.actions.cancel,
            x: 340,
            y: 400,
            height: 30,
            tooltip: this.labels.ttipCancelBtn,
            width: 60,
            nextTab: 'btn-apply-save-notification',
            prevTab: 'id_ca_activo',
            //icon: perfil.dirImg + 'cancelar.png',
            iconCls: 'cancelar',
            handler : function(){
                this.destroy();
            },
            scope: this
        });
        if(this.showApplyBtn && this.adicionar){
            botones.push({
                xtype: 'button',
                text: this.labels.actions.apply,
                x: 260,
                y: 400,
                width: 70,
                tooltip: this.labels.ttipApplyBtn,
                height: 30,
                disabled: true,
                //icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'aplicar',
                id: 'btn-apply-save-notification',
                nextTab: 'btn-accept-save-notification',
                prevTab: 'btn-cancel-save-notification',
                tab1: false,
                tab2: false,
                tab3: false,

                form1: false,
                form2: false,
                form3: false,
                handler : function(){
                    if (this.Validar()){
                        this.sendValues.call(this, true);
                    }
                },
                scope: this
            });
        }
        botones.push({
            xtype: 'button',
            text: this.labels.actions.accept,
            id: 'btn-accept-save-notification',
            x: 180,
            y: 400,
            width: 70,
            tooltip: this.labels.ttipAcceptBtn,
            height: 30,
            disabled: true,
            tab1: false,
            tab2: false,
            tab3: false,

            form1: false,
            form2: false,
            form3: false,
            nextTab: 'id_ca_denominacion',
            prevTab: 'btn-cancel-save-notification',
            //icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            handler : function(){
                if (this.Validar()){
                    this.sendValues.call(this, false);
                }
            },
            scope: this
        });
        this.items = [{
            xtype: "tabpanel",
            region: 'center',
            id:'tabconfig',
            activeTab: 0,
            items: elementos,
            listeners: {
               tabchange: function(tp, newTab){
                   Ext.getCmp('btn-accept-save-notification').setDisabled(true);
                   if(newTab.id == 'tp-destinatarios'){
                       Ext.getCmp('formConfigAv').validateDefault = false;
                       this.validateDefault=false;
                   }else if(newTab.id == 'tp-viasEnv'){
                       Ext.getCmp('formConfigAv').validateDefault=false;
                       this.validateDefault=false;
                   }else{
                       this.validateDefault=true;
                       Ext.getCmp('formConfigAv').validateDefault=true;
                   }
                   /*var elems = newTab.items.items;
                   Ext.each(this.buttons, function(btn){
                       elems.push(btn);
                   }, this);                    
                   tabGroup = Secodena.TabGroup.setTabGroup(newTab, elems);  */                                    
               },
               scope: this
            }            
        }];
        this.buttons = botones;        
        this.on('show', function(){
            //Ext.getCmp('tabconfig').getComponent(1).hide();
            this.fullRendered = false;
            this.setTitle(this.adicionar ? this.labels.ttAddNotification : this.labels.ttUpdNotification);
            if(this.hasOwnProperty('contenidoViasAviso')){
                for(via in this.contenidoViasAviso){
                    switch(via){
                        case 'jabber':
                        case 'sistema':
                        case 'sms':{
                            content = '', attribs = this.contenidoViasAviso[via].attributes;
                            for(i = 0; i < attribs.length; i++){
                                if(attribs[i].title !== ''){
                                    content += [attribs[i].title, this[attribs[i].mapping]].join(' : ');
                                }
                                else{
                                    content += this[attribs[i].mapping];
                                }
                                content += '\n';
                            }
                            currentContentCtn = this.ConfigurarMedio.getViaMethod(via).call(this.ConfigurarMedio);
                            currentContentCtn.setContent(content);
                        }
                        break;
                        case 'email':{
                            content = '', attribs = this.contenidoViasAviso[via].attributes;
                            for(i = 0; i < attribs.length; i++){
                                if(attribs[i].title !== ''){
                                    content += [attribs[i].title, this[attribs[i].mapping]].join(' : ');
                                }
                                else{
                                    content += this[attribs[i].mapping];
                                }
                                content += '\n';
                            }
                            currentContentCtn = this.ConfigurarMedio.getCorreo();
                            currentContentCtn.setTopic(this[this.contenidoViasAviso[via].topicAttribute]);
                            currentContentCtn.setContent(content);
                        }
                        break;
                        default:
                            break;
                    }
                }
            }
            if(this.adicionar){
                this.Destinatarios.getDestinatarios().getStore().removeAll();                
            }
            if (!this.adicionar && this.datos != null){
                //cargar configuración básica
                var denominacion = Ext.getCmp('id_ca_denominacion');
                var tipoAviso    = Ext.getCmp('id_ca_tipo_aviso');
                var activo       = Ext.getCmp('id_ca_activo');
                var descripcion  = Ext.getCmp('id_ca_descripcion');
                var command = Ext.getCmp('id_ca_comando_validacion');
                
                denominacion.setValue(this.datos.json.denominacion);
                tipoAviso.setValue(this.datos.json.idtipo);
                activo.setValue(this.datos.json.activo);
                descripcion.setValue(this.datos.json.descripcion);
                command.setValue(this.datos.json.comando);
                //cargar vias
                vias = this.ConfigurarMedio.getVias();
                contenidos = this.datos.json.contenidos;
                for(i = 0;  i< vias.length; i++){
                    viaName = vias[i].getConcretName();
                    textProp = 'texto_' + viaName;
                    topicProp = 'asunto_' + viaName;
                    for(j = 0; j < contenidos.length; j++){
                        if(contenidos[j].hasOwnProperty(textProp)  && contenidos[j][textProp]  != null ||
                            contenidos[j].hasOwnProperty(topicProp) && contenidos[j][topicProp] != null){
                            vias[i].setIdentifier(contenidos[j].idaviso);
                            vias[i].chboxActivo.setValue(true);
                            vias[i].setContent(contenidos[j][textProp]);
                            if(contenidos[j].hasOwnProperty(topicProp) && contenidos[j][topicProp] != null){
                                vias[i].setTopic(contenidos[j][topicProp]);
                            }
                            break;
                        }
                    }
                }
            }
            if(!this.adicionar && this.data){
                this.data.email = this.data.correo;
                this.data.smstext = this.data.sms;
                vias = this.ConfigurarMedio.getVias();
                Ext.each(vias, function(via){
                    viaName = via.getConcretName();
                    if(viaName == 'smstext') viaName = 'sms';
                    textProp = 'texto_' + viaName;
                    topicProp = 'asunto_' + viaName;
                    via.chboxActivo.setValue((this.data[viaName].active ==  1));
                    if(this.data[viaName].hasOwnProperty(topicProp)){
                        via.setTopic(this.data[viaName][topicProp]);
                    }
                    if(this.data[viaName].hasOwnProperty(textProp)){
                        via.setContent(this.data[viaName][textProp]);
                    }
                }, this);            
            }
            this.fullRendered = true;                        
            if(Ext.getCmp('id_ca_denominacion')){
                Ext.getCmp('id_ca_denominacion').focus(false, 200);
            }
        });
        this.on('beforedestroy', function(){
            if(this.gridReference) this.gridReference.winEditarAvisos = null;
        });
        Ext.notificaciones.gestionarAvisos.EditarAviso.superclass.initComponent.call(this);
    },
    onViaActivada: function(viaName){
        if(!this.adicionar && !this.fullRendered){
            this.oldViasActivadas.push(viaName);
        }
        if(!this.adicionar && this.fullRendered){
            if(!this.newViasActivadas.contains(viaName) && !this.oldViasActivadas.contains(viaName)){
                this.newViasActivadas.push(viaName);
            }
            else if(this.oldViasActivadas.contains(viaName)){
                this.newViasDesactivadas.remove(viaName);
            }
        }
    },
    onViaDesactivada: function(viaName){
        if(!this.adicionar && this.fullRendered){
            if(!this.newViasDesactivadas.contains(viaName) && this.oldViasActivadas.contains(viaName)){
                this.newViasDesactivadas.push(viaName);
            }
            else if(!this.oldViasActivadas.contains(viaName)){
                this.newViasActivadas.remove(viaName);
            }
        }
    },
    Validar: function(){
        //basic configuration

        var denominacion = Ext.getCmp('id_ca_denominacion') ? Ext.getCmp('id_ca_denominacion') : this.nombreAviso;
        var tipoAviso    = Ext.getCmp('id_ca_tipo_aviso') ? Ext.getCmp('id_ca_tipo_aviso') : this.defaultNotificationType;

        if((denominacion.getValue && denominacion.getValue() == "") || (tipoAviso.getValue && tipoAviso.getValue() == "")
            || (typeof denominacion == 'string' && denominacion == '') || !Ext.getCmp('id_ca_denominacion').isValid()){
            if(denominacion.getValue() == "") denominacion.markInvalid(this.labels.lbRequiredText);
            if(tipoAviso.getValue() == "") tipoAviso.markInvalid(this.labels.lbRequiredText);
            this.items.items[0].setActiveTab(this.ConfigurarAviso);
            mostrarMensaje(3, this.labels.validations.validateNotificationConfig, function(){
                denominacion.focus(false, 200);
            });
            return false;
        }
        //notification vias
        var __$ = this.ConfigurarMedio;
        var activoSystem = __$.getSystem().isActive();
        var activoCorreo = __$.getCorreo().isActive();
        var activoJabber = __$.getJabber().isActive();
        var activoSms    = __$.getSms().isActive();
        if(activoSystem || activoCorreo || activoJabber || activoSms){
            var errors = [];            
            if(activoSystem && !__$.getSystem().hasValidContent()){
                errors.push(this.labels.validations.validateNotificationViasContent.replace("{}", this.labels.via.system));
            }
            if(activoCorreo && !__$.getCorreo().hasValidContent()){
                errors.push(this.labels.validations.validateNotificationViasContent.replace("{}", this.labels.via.email));
            }
            if(activoJabber && !__$.getJabber().hasValidContent()){
                errors.push(this.labels.validations.validateNotificationViasContent.replace("{}", this.labels.via.jabber));
            }
            if(activoSms && !__$.getSms().hasValidContent()){
                errors.push(this.labels.validations.validateNotificationViasContent.replace("{}", this.labels.via.sms));
            }
            if(errors.length > 0){                
                this.items.items[0].setActiveTab(__$);
                mostrarMensaje(6, errors.join('<br/>'));
                __$.getActiveTab().getChbox().focus(false, 200);
                return false;
            }
        }
       else{
            this.items.items[0].setActiveTab(__$);
            mostrarMensaje(1, this.labels.validations.validateNotificationVia, function(){
                __$.getActiveTab().getChbox().focus(false, 200);                    
            });
            return false;
        }
        //destinataries
        __$ = this.Destinatarios;
        if(__$.getDestinatarios().store.getCount() == 0){
            this.items.items[0].setActiveTab(__$);
            mostrarMensaje(1, this.labels.validations.validateNotificationDest, function(){
                __$.getDestinatarios().getTopToolbar().items.items[0].focus(false, 200);
            });
            return false;
        }
        return true;
    },
    resetAll: function(){
        this.ConfigurarAviso.getForm().reset();
        this.ConfigurarMedio.getSystem().getForm().reset();
        this.ConfigurarMedio.getCorreo().getForm().reset();
        this.ConfigurarMedio.getJabber().getForm().reset();
        this.ConfigurarMedio.getSms().getForm().reset();
        this.Destinatarios.getDestinatarios().getStore().removeAll();
    },
    sendValues: function(apply){        
        var values = {}, form = null;
        var sistema = this.ConfigurarMedio.getSystem();
        var correo = this.ConfigurarMedio.getCorreo();
        var jabber = this.ConfigurarMedio.getJabber();
        var sms = this.ConfigurarMedio.getSms();
        var medios = {};

        if (correo.isActive()){
            medios['email'] = {
                topic : correo.getTopic(),
                body : correo.getContent()
            };
        }
        if(jabber.isActive())  medios['jabber']  = {
            body : jabber.getContent()
        };
        if(sistema.isActive()) medios['sistema'] = {
            body : sistema.getContent()
        };
        if(sms.isActive())     medios['smstext'] = {
            body : sms.getContent()
        };

        if(this.Destinatarios.getDestinatarios().store.getCount() > 0){
            if((this.ConfigurarAviso && this.ConfigurarAviso.getForm().isValid())){
                form = this.ConfigurarAviso.getForm();
                values = form.getValues();                
                values["destinatarios"]= [];
                values["idevento"] = this.idevento;
                values["medios"] = medios;                
                values.activo = this.ConfigurarAviso.isActive();
                var store = this.Destinatarios.getDestinatarios().store;
                store.each(function(record){
                    values["destinatarios"].push(record.data);
                });
                if(isDefined('Secodena')) Secodena.mostrarMascara('mask-add-notification', this.labels.waitTitle, this.labels.msgWaitAddNotification);
                if (this.adicionar){
                    form.submit({
                        url: '/herramientas/notificaciones/index.php/gestavisos/insertaraviso',
                        params : {
                            values : Ext.encode(values)
                        },
                        waitMsg:    this.labels.addingEvent,
                        waitTitle:  this.labels.waitTitle,
                        failure:function(response, action){
                            if(isDefined('Secodena'))Secodena.ocultarMascara('mask-add-notification');
                            var o = Ext.decode(action.response.responseText);  
                            this.fireEvent("datainserted", this, o);                           
                                if(apply){
                                    this.resetAll();
                                }
                                else{                                
                                    this.close();
                                }
                                                                                  
                        },
                        scope: this
                    });
                }
                else{
                    form = this.ConfigurarAviso.getForm();
                    values.idaviso = this.gridReference.getSelectionModel().getSelected().get('idaviso'); 
                    values.viasActivadas = this.newViasActivadas;
                    values.viasDesactivadas = this.newViasDesactivadas;
                    values.oldVias = this.oldViasActivadas;
                    
                    values.newDestinatarios = this.Destinatarios.getDestinatarios().getNewDestinatarios();
                    values.delDestinatarios = this.Destinatarios.getDestinatarios().getDelDestinatarios();
                    values.oldDestinatarios = this.Destinatarios.getDestinatarios().getOldDestinatarios();
                    form.submit({
                        url: '/herramientas/notificaciones/index.php/gestavisos/modificaraviso',
                        params:{
                            values: Ext.encode(values)
                        },
                        failure: function(r, action){
                            if(isDefined('Secodena'))Secodena.ocultarMascara('mask-add-notification');
                            o = Ext.decode(action.response.responseText);
                            if(o.msgLabel){
                                mostrarMensaje(1,this.labels[o.msgLabel]);
                                this.fireEvent('avisomodificado', o.idaviso);
                                this.destroy();
                            }                            
                            else if(o.mensaje && o.cod){
                                mostrarMensaje(o.cod, o.mensaje);
                            }                            
                        },
                        scope: this
                    });               
                }
            }
            else{
                if(isDefined('Secodena')) Secodena.mostrarMascara('mask-add-notification', this.labels.waitTitle, this.labels.msgWaitAddNotification);
                values['denominacion'] = this.nombreAviso;
                values['idtypeaviso'] = this.defaultNotificationType;
                values['activo'] = true;
                values['validador'] = this.referenciaServicio;
                values['idusuario'] = this.idusuario;
                values["idevento"] = this.defaultEvent;
                values["medios"] = medios;
                values["destinatarios"]= [];
                store = this.Destinatarios.getDestinatarios().store;
                store.each(function(record){
                    values["destinatarios"].push(record.data);
                });
                if(this.adicionar){
                    Ext.Ajax.request({
                        url: '/herramientas/notificaciones/index.php/gestavisos/insertaraviso',
                        params:{
                            values: Ext.encode(values)
                        },
                      callback: function(opt, success, response){                            
                            if(success){
                                if(isDefined('Secodena'))Secodena.ocultarMascara('mask-add-notification');
                                o = Ext.decode(response.responseText);
                                if(o.msgLabel){
                                    mostrarMensaje(7, this.labels[o.msgLabel]);
                                    this.fireEvent('avisoinsertado', o.idaviso);
                                    this.destroy();
                                }   
                                else{
                                    mostrarMensaje(o.cod, o.mensaje);
                                }                                
                            }
                        },
                        scope: this
                    });
                }
                else{
                    values.idaviso = this.data.idaviso;
                    values.viasActivadas = this.newViasActivadas;
                    values.viasDesactivadas = this.newViasDesactivadas;
                    values.oldVias = this.oldViasActivadas;
                    
                    values.newDestinatarios = this.Destinatarios.getDestinatarios().getNewDestinatarios();
                    values.delDestinatarios = this.Destinatarios.getDestinatarios().getDelDestinatarios();
                    values.oldDestinatarios = this.Destinatarios.getDestinatarios().getOldDestinatarios();                    
                    
                    Ext.Ajax.request({
                        url: '/herramientas/notificaciones/index.php/gestavisos/modificaraviso',
                        params:{
                            values: Ext.encode(values)
                        },
                        callback: function(opt, success, response){
                            if(success){
                                if(isDefined('Secodena'))Secodena.ocultarMascara('mask-add-notification');
                                o = Ext.decode(response.responseText);
                                if(o.msgLabel){
                                    mostrarMensaje(1, this.labels[o.msgLabel]);
                                    this.fireEvent('avisomodificado', o.idaviso);
                                    this.destroy();
                                }   
                                else{
                                    mostrarMensaje(o.cod, o.mensaje);
                                }                                
                            }
                        },
                        scope: this
                    });
                }
            }
        }        
    }
});

/**
 * @class Ext.notificaciones.gestionarAvisos.InterfazConfigurarAviso
 * @inherits Ext.util.Observable 
 */
Ext.notificaciones.gestionarAvisos.InterfazConfigurarAviso = function(config){      
    var idaviso = config.idaviso ? config.idaviso : (config.datos ? config.datos.data.idaviso : null);        
    this.labels = config.labels ? config.labels : Ext.notificaciones.gestnotificationevents.idioma[perfil.idioma].etiquetas;
    if(!config.labels){
        config.labels = this.labels; 
    }
    this.addEvents({
        'ready': true,
        'avisoinsertado': true,
        'avisomodificado': true
    });
    if(!config.adicionar){
        if(isDefined('Secodena')) Secodena.mostrarMascara('mask-build-interface', this.labels.waitTitle, this.labels.msgWaitLoadingInterface);
        Ext.Ajax.request({
            url: '/herramientas/notificaciones/index.php/gestdestinatarios/cargarpersonasdeaviso',
            method: 'POST',
            params: {
                idaviso: idaviso
            },
            callback: function(opt, success, response){
                if(success){ 
                    if(isDefined('Secodena')) Secodena.ocultarMascara('mask-build-interface');
                    config.allData = Ext.decode(response.responseText);
                    this.winEditarAviso = new Ext.notificaciones.gestionarAvisos.EditarAviso(config);
                    this.winEditarAviso.on('avisoinsertado', function(data){
                        this.fireEvent('avisoinsertado', data)
                    }, this);
                    this.winEditarAviso.on('avisomodificado', function(data){
                        this.fireEvent('avisomodificado', data)
                    }, this);
                    this.fireEvent('ready');
                }
            },
            scope: this
        });
    }
    else{
        this.winEditarAviso =  new Ext.notificaciones.gestionarAvisos.EditarAviso(config); 
        this.winEditarAviso.on('avisoinsertado', function(data){
            this.fireEvent('avisoinsertado', data)
        }, this);
        this.winEditarAviso.on('avisomodificado', function(data){
            this.fireEvent('avisomodificado', data)
        }, this);
    }  
}

Ext.extend(Ext.notificaciones.gestionarAvisos.InterfazConfigurarAviso, Ext.util.Observable, {
    show: function(){
        this.winEditarAviso.show();
    }
});
//-----------------------------------------------------------------------------------------------------------------

Ext.notificaciones.gestionarAvisos.ListarAvisos = Ext.extend(Ext.grid.GridPanel, {
    id: 'gestionarAvisos-ListarAvisos',
    cls:        'x-toolbar',    
    selModel:   new Ext.grid.RowSelectionModel({
        singleSelect:   true
    }),
    initComponent: function() {        
        var expander = new Ext.grid.RowExpander({
            tpl : new Ext.Template(                
                '<p>' + this.labels.lbDescription + ': {descripcion}</p><br>'
                )
        });
        this.plugins = expander;
        var self = this;
        this.title = this.labels.pNotificationTitle,
        this.store = new Ext.data.JsonStore({
            url: '/herramientas/notificaciones/index.php/gestavisos/listaravisos',
            fields:['idaviso','denominacion','activo','tipo', 'descripcion'],
            root: 'datos',        
            totalProperty: 'total'
        });
        var getActiveImg = function(active){                
            return '<span class="icondistra-' + (Util.str2Boolean(active) ? 'bandera verde' : 'bandera rojo') + '"/>';
        };
        this.columns = [expander,
        {
            dataIndex: 'denominacion',
            header: this.labels.lbNotificationName,
            sortable: true,
            width: 100
        },
        {
            dataIndex: 'tipo',
            header: this.labels.lbNotificationType,
            sortable: true,
            width: 100
        },
        {
            dataIndex: 'activo',
            header: this.labels.state.active,
            renderer: getActiveImg,
            sortable: true,
            width: 100
        }
        ];
        this.tbar = new Ext.Toolbar({
            items: [
            {
                xtype: 'button',
                text: this.labels.actions.add,
                //icon: perfil.dirImg + 'adicionar.png',
                id: 'btn-adicionar-aviso',
                nextTab: 'btn-modificar-aviso',
                tooltip: this.labels.ttipAddNotification,
                iconCls: 'adicionar',
                disabled:true,
                handler:function(){
                    self.MostrarAvisos.call(self, true, null);
                }
            },
            {
                xtype: 'button',
                text: this.labels.actions.upd,
                //icon: perfil.dirImg + 'modificar.png',
                id: 'btn-modificar-aviso',
                nextTab: 'btn-eliminar-aviso',
                tooltip: this.labels.ttipUdtNotification,
                iconCls: 'modificar',
                disabled:true,
                handler: function(){
                    var record = self.getSelectionModel().getSelected();
                    self.MostrarAvisos.call(self, false, record) ;
                }
            },
            {
                xtype: 'button',
                text: this.labels.actions.del,
                //icon: perfil.dirImg + 'eliminar.png',
                id: 'btn-eliminar-aviso',
                nextTab: 'btn-adicionar-evento',
                tooltip: this.labels.ttipDelNotification,
                iconCls: 'eliminar',
                disabled:true,
                handler: function(){
                    var store = self.getStore();
                    var record = self.getSelectionModel().getSelected();
                    self.Eliminar.call(self, store, record);
                }
            }
            ]
        });        
        this.bbar = new Ext.PagingToolbar({
            pageSize:       10,
            store :         this.store,
            displayInfo:    true,
            displayMsg:     this.labels.displayMsg,
            emptyMsg:       this.labels.emptyMsg            
        });
        var sm = this.selModel;
        sm.on('rowselect', function(sm, rowIndex, record){
            self.enableAll(true, true);
        });
        sm.on('rowdeselect', function(sm){
            self.enableAll(true, false);
        });        
        Ext.notificaciones.gestionarAvisos.ListarAvisos.superclass.initComponent.call(this);                
    },
    enableAll:function(adicionar, modificar){
        var toolbar = this.getTopToolbar();
        adicionar ? toolbar.items.items[0].enable() : toolbar.items.items[0].disable();
        if (modificar){
            toolbar.items.items[1].enable();
            toolbar.items.items[2].enable();
        }
        else{
            toolbar.items.items[1].disable();
            toolbar.items.items[2].disable();
        }
    },
    Eliminar: function(store, record){
        if(record){
            var fn = function(btn){ 
                if(btn == 'yes'){
                    if(isDefined('Secodena')) Secodena.mostrarMascara('mask-del-notification', this.labels.waitTitle, this.labels.msgWaitDelNotification);
                    Ext.Ajax.request({
                        url: '/herramientas/notificaciones/index.php/gestavisos/eliminaraviso',
                        params: {
                            idevento: this.idevento,
                            idaviso: record.data.idaviso
                        },
                        callback: function(opt, success, response){
                            if(success){
                                if(isDefined('Secodena')) Secodena.ocultarMascara('mask-del-notification');
                                var o = Ext.decode(response.responseText);                                
                                    if(o.cod != 7){
                                         mostrarMensaje(o.cod, this.labels[o.msgLabel]);
                                         store.load({
                                            params: {
                                                start: 0,
                                                limit: 10
                                            }
                                        });
                                      /*  Ext.Ajax.request({
                                            url: '/herramientas/notificaciones/index.php/gestavisos/desactivaraviso',
                                            params: {                                            
                                                idaviso: record.data.idaviso
                                            },
                                            callback: function(opt, success, response){
                                                if(success){
                                                    store.load({
                                                        params: {
                                                            start: 0,
                                                            limit: 10
                                                        }
                                                    });
                                                }
                                            }
                                        });*/
                                    }
                                    else{
                                        mostrarMensaje(o.cod, this.labels[o.msgLabel]);
                                        store.load({
                                            params: {
                                                start: 0,
                                                limit: 10
                                            }
                                        });
                                    }
                                                                                             
                            }
                        },
                        scope: this
                    });
                    this.enableAll(true, false);
                }            
            };
            mostrarMensaje(2, this.labels.confirmDelNotification, fn);
            Ext.Msg.confirm(this.labels.ttAlerta, this.labels.confirmDelNotification, fn, this);
        }
    },
    MostrarAvisos: function(adicionar, datos){
        if(!adicionar && !datos) return;
        if (this.winEditarAvisos == null){
            this.winEditarAvisos = new Ext.notificaciones.gestionarAvisos.InterfazConfigurarAviso({
                idevento:     	this.idevento,
                adicionar:    	adicionar,
                datos:        	datos,
                labels:           this.labels,
                gridReference: 	this,
                listeners: {
                    show: function(){
                        if(this.docKeyMap){
                            this.docKeyMap.disable();
                        }
                    },
                    destroy: function(){
                        if(this.docKeyMap){
                            this.docKeyMap.enable();
                        }
                    },
                    close: function(){
                        if(this.docKeyMap){
                            this.docKeyMap.enable();
                        }
                    },
                    hide: function(){
                        if(this.docKeyMap){
                            this.docKeyMap.enable();
                        }
                    },
                    datainserted: function(sf, o){
                        if(o.msgLabel){
                            var mensaje=this.labels[o.msgLabel];
                            mostrarMensaje(o.cod,mensaje);
                        }                            
                        else if(o.mensaje && o.cod){
                           mostrarMensaje(o.cod, o.mensaje);
                        }
                        this.enableAll(true, false);
                        this.store.load({
                            params: {
                                start: 0,
                                limit: 10
                            }
                        });
                    },
                    avisomodificado: function(){
                        this.enableAll(true, false);
                        this.store.load({
                            params: {
                                start: 0,
                                limit: 10
                            }
                        });
                    },
                    scope: this
                }
            });   
            if(adicionar){
                this.winEditarAvisos.show();                
            }
            else{
                this.winEditarAvisos.on('ready', function(){
                    this.winEditarAvisos.show();
                }, this); 
            }   
        }        
    }
});

Ext.reg("gestionarAvisos.listarAvisos",Ext.notificaciones.gestionarAvisos.ListarAvisos);


Ext.notificaciones.gestionarAvisos.SelectValidation = Ext.extend(Ext.Window, {
    width : 304,
    height : 387,
    layout : 'fit',
    modal: true,
    listeners: {
        hide: function(){            
            Ext.getCmp('id_ca_activo').focus(true, 200);            
        },
        close: function(){            
            Ext.getCmp('id_ca_activo').focus(true, 200);            
        },
        destroy: function(){
            Ext.getCmp('id_ca_activo').focus(true, 200);            
        },
        scope: this
    },
    initComponent : function() {
        var _$ = this;
        this.title = this.labels.selectNotificatorFunction,
        _$.loader  = new Ext.tree.TreeLoader({
            dataUrl: '/herramientas/notificaciones/index.php/gestavisos/cargarfuncionobservadora',
            baseParams: {
                idevento:_$.idevento
            }
        });
        this.items = [{
            xtype : 'treepanel',            
            //title : this.labels.lbNotificatorFunctions,
            width : 180,
            height : 290,
            x : 200,
            y : 90,
            autoScroll : true,
            loader:_$.loader,
            root : new Ext.tree.AsyncTreeNode({
                text : this.labels.lbFunctions,
                draggable : false,
                id : '0'
            }),
            listeners : {
                "click" : function(node) {
                    _$.selectedNode = node;
                    this.IsValid(node) ? this.buttons[1].enable() : this.buttons[1].disable();
                },
                scope: this
            }
        }];
        _$.on('beforeclose', _$.onCancel, _$);
        this.buttons = [{
            xtype : 'button',
            text : this.labels.actions.cancel,
            //icon: perfil.dirImg + 'cancelar.png',
            tooltip: this.labels.ttCloseWindow,
            iconCls: 'cancelar',
            x : 340,
            y : 400,
            height : 30,
            width : 70,
            handler : function() {
                _$.close();
            }
        }, {
            xtype : 'button',
            text : this.labels.actions.accept,
            //icon: perfil.dirImg + 'aceptar.png',
            tooltip: this.labels.ttSelectAndCloseWindow,
            disabled: true,
            iconCls: 'aceptar',
            x : 180,
            y : 400,
            width : 70,
            height : 30,
            handler : function() {
                if(_$.IsValid(_$.selectedNode)){
                    _$.fireEvent("selectednode",_$,_$.selectedNode);
                    _$.hide.call(_$, arguments);
                }
            }
        }];
        Ext.notificaciones.gestionarAvisos.SelectValidation.superclass.initComponent.call(this);
    },
    IsValid : function(node) {
        return (node.leaf);
    },
    onCancel: function(){
        this.hide.call(this, arguments);        
    }
});

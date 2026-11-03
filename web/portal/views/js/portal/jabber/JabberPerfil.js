function JabberPerfil(config) {
    if (!Jabber.instance) {
        Jabber["instance"] =
        {
            manager: null,
            JabberInterface: null
        }
    }
    var scope = this;
    var config = config || {};
    this.jid = false;
    if (config.jid)
        this.jid = config.jid;
    else
        this.jid = Jabber.instance.JabberInterface.connection.jid;
    this.owner = config.owner;
    Ext.apply(config, this.createConfig());
    Ext.Window.call(this, config);
    this.JabberInterface = Jabber.instance.JabberInterface;

    return this;
}
JabberPerfil.prototype = new Ext.Window;


JabberPerfil.prototype.getPerfil = function () {
    return {
        foto: this.foto,
        nombre: this.nombre.getValue(),
        apellidos: this.apellidos.getValue(),
        correo: this.correo.getRawValue(),
        ocupaciones: this.ocupaciones.getRawValue(),
        //fechanacimiento: this.fechaNacimiento.getValue(),
        sexo: this.nombre.getValue()
    };
}

JabberPerfil.prototype.setPerfil = function (perfil) {

    this.nombre.setValue(perfil.jabber.nombre);
    this.apellidos.setValue(perfil.jabber.apellidos);
    this.sexo.setValue(perfil.jabber.sexo);
    //this.fechaNacimiento.setValue(perfil.jabber.fechanacimiento);
    //this.ocupacionesStore.loadData(perfil.jabber.ocupacion,true);
    if (perfil.jabber.correoelectronico.length > 0) {
        var correos = [];
        for (i = 0; i < perfil.jabber.correoelectronico.length; i++) {
            var correo = perfil.jabber.correoelectronico[i].correoelectronico;
            var dir = new Ext.data.Record({correoelectronico: correo}, correo);
            correos.push(dir);
        }
        this.correoStore.add(correos);


    }
    if (perfil.jabber.ocupacion.length > 0) {
        var ocupaciones = [];
        for (i = 0; i < perfil.jabber.ocupacion.length; i++) {
            var ocupacion = perfil.jabber.ocupacion[i].cargo;
            var idocupacion = perfil.jabber.ocupacion[i].idcargo;
            ocupaciones.push(new Ext.data.Record({ocupacion: ocupacion}, idocupacion));
        }
        this.ocupacionesStore.add(ocupaciones);


    }
    if (perfil.jabber.foto) {
        if (Ext.get('foto-' + this.id))
            Ext.get('foto-' + this.id).dom.src = perfil.jabber.foto;
        this.foto = perfil.jabber.foto;
    }
    Ext.apply(this.owner, {perfilJabber: this.getPerfil()});
}

JabberPerfil.prototype.loadPerfil = function (myMask, fun) {
    var scope = this;
    Ext.Ajax.request(
        {
            url: 'cargarperfilJabber',
            method: 'POST',
            params: {username: scope.jid.split('@')[0]},
            callback: fun ? fun : function (o, s, r) {
                if (s) {
                    var response = Ext.decode(r.responseText);
                    if (response.exist == true)
                        scope.setPerfil(response);
                    if (myMask && myMask.hide)
                        myMask.hide();
                }
            },
            failure: function (response, options) {
                Ext.Msg.show({
                    title: XMPP.idioma.es.etiqueta.title.jabberError,
                    msg: XMPP.idioma.es.etiqueta.msg.jabberProfileError,
                    width: 300,
                    buttons: Ext.MessageBox.OK,
                    multiline: false,
                    //animEl: scope.ServidorJabber.getEl(),
                    icon: Ext.MessageBox.ERROR
                });
                if (myMask && myMask.hide)
                    myMask.hide();
            }
        });

}

JabberPerfil.prototype.createConfig = function () {
    var scope = this;
    this.foto = new Ext.Panel(
        {
            width: 120,
            height: 104,
            frame: true,
            html: '<img id="foto-' + this.id + '"  width=120 height=120 src="../../views/js/portal/jabber/resources/images/wlmessenger.jpg">'
        });
    this.nombre = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfilename,
        name: 'name',
        readOnly: true,
        width: 190
    });
    this.apellidos = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfilelastname,
        name: 'last',
        readOnly: true,
        width: 190
    });
    /*this.centroLaboral=new Ext.form.TextField({
     fieldLabel: 'Centro Laboral',
     name: 'company',
     readOnly:true,
     width:190
     });*/
    this.correoStore = new Ext.data.SimpleStore({
        fields: ['correoelectronico']
    });
    this.correo = new Ext.form.ComboBox({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfileEmail,
        //hiddenName:'state',
        store: this.correoStore,
        valueField: 'correoelectronico',
        displayField: 'correoelectronico',
        typeAhead: true,
        editable: false,
        loadingText: XMPP.idioma.es.etiqueta.msg.jabberLoading,
        mode: 'local',
        triggerAction: 'all',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberProfileEmptyTextEmail,
        selectOnFocus: true,
        width: 190
    });

    this.ocupacionesStore = new Ext.data.SimpleStore({
        fields: ['idcargo', 'cargo']//,
        //data : Ext.exampledata.states // from states.js
    });
    this.ocupaciones = new Ext.form.ComboBox({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfileJobs,
        //hiddenName:'state',
        store: this.ocupacionesStore,
        valueField: 'id',
        displayField: 'ocupacion',
        typeAhead: true,
        loadingText: XMPP.idioma.es.etiqueta.msg.jabberLoading,
        editable: false,
        mode: 'local',
        triggerAction: 'all',
        emptyText: XMPP.idioma.es.etiqueta.label.jabberProfileEmptyTextJobs,
        selectOnFocus: true,
        width: 190
    });

    /**this.fechaNacimiento = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfileDate,
        name: 'dob',
        readOnly: true,
        width: 190
    });*/
    this.sexo = new Ext.form.TextField({
        fieldLabel: XMPP.idioma.es.etiqueta.label.jabberProfileSex,
        name: 'sexo',
        readOnly: true,
        width: 190
    });
    this.formPanelPerfil = new Ext.FormPanel({
        frame: true,
        labelAlign: 'right',
        labelWidth: 100,
        region: 'center',
        width: '100%',
        waitMsgTarget: true,
        items: [
            this.foto,
            new Ext.form.FieldSet({
                title: String.format(XMPP.idioma.es.etiqueta.containers.jabberUserProfileInformation, this.jid.split('@')[0]),
                autoHeight: true,
                defaultType: 'textfield',
                items: [
                    this.nombre,
                    this.apellidos,
                    this.sexo,
                    //this.centroLaboral,
                    this.correo,
                    this.ocupaciones
                    //this.fechaNacimiento
                ]
            })
        ]
    });


    this.fpperfil = new Ext.Panel({
        layout: 'border',
        items: [this.formPanelPerfil]
    });
    var manager = null;
    if (Jabber.instance) {
        manager = Jabber.instance.manager
    }
    return this.configuracion =
    {

        layout: 'fit',
        width: 350,
        modal: false,
        resizable: false,
        iconCls: XMPP.idioma.es.etiqueta.styles.jabberMyProfile,
        height: 350,
        manager: manager,
        closeAction: 'close',
        title: XMPP.idioma.es.etiqueta.containers.jabberUserProfile + this.jid.split('@')[0],
        plain: true,
        listeners: {
            render: function (win) {
                var msg = XMPP.idioma.es.etiqueta.msg.jabberLoadingProfile;
                if (scope.jid)
                    msg = XMPP.idioma.es.etiqueta.msg.jabberLoadingProfile + scope.jid;

                var myMask = new Ext.LoadMask(Ext.getBody(), {msg: msg});
                myMask.show();
                scope.loadPerfil(myMask);
            }
        },
        items: [this.fpperfil],
        bbar: ['->',
            {
                text: XMPP.idioma.es.etiqueta.button.jabberClose,
                iconCls: XMPP.idioma.es.etiqueta.styles.jabberCancel,
                handler: function () {
                    scope.close();
                }
            }/**,
         {
             text: XMPP.idioma.es.etiqueta.button.jabberAcept,
             iconCls: XMPP.idioma.es.etiqueta.styles.jabberAcept,
             handler: function () {
                 if (scope.owner) {
                     var datos = scope.getPerfil();
                     Ext.apply(scope.owner, {perfilJabber: datos});

                 }
                 scope.close();
             }
         }*/

        ],
        keys: [
            {
                key: Ext.EventObject.ENTER,
                scope: this,
                fn: function (key, e) {
                    /*if (scope.fpgrupo.getForm().isValid())
                     {
                     onEnter();
                     }
                     else
                     {
                     alert('Introduzca sus datos');
                     } */
                }
            }
        ]
    }
}

XMPP.JabberPerfil = JabberPerfil;
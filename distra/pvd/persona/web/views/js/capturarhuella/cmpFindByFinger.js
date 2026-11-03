/**
 * Created by miguel on 4/03/15.
 */
Ext.ns('PVD.Persona.Fingerprint');
PVD.Persona.Fingerprint.windFindByFinger = Ext.extend(Ext.Window, {
    width: '55%',
    layout: 'border',
    height: 480,
    initComponent: function () {
        var me = this;
        this.data = new Array();

        this.fotoPersona = new Ext.ux.ScreenshotField({
            center: true,
            name: 'passport',
            width: 150,
            height: 150,
            value: '../../views/images/persona/no-photo-male.png',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        this.fingScaner = new Ext.ux.ScreenshotField({
            center: true,
            name: 'passport',
            width: 160,
            height: 230,
            value: '../../views/images/persona/huellas/procesamientohuella.ico',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        this.fingFind = new Ext.ux.ScreenshotField({
            center: true,
            name: 'passport',
            width: 160,
            height: 230,
            value: '../../views/images/persona/huellas/procesamientohuella.ico',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        this.fpInfo = new Ext.FormPanel({
            region: 'center',
            border: false,
            labelWidth: 75,
            bodyStyle: 'padding: 10px',
            labelAlign: 'top',
            //defaultType: 'textfield',
            defaults: {
                anchor: '100%',
                readOnly: true
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Nombre completo',
                    name: 'nombre'

                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'No de identidad',
                    name: 'numid'
                },
                {
                    xtype: 'textfield',
                    fieldLabel: 'Sexo',
                    name: 'sexo'
                }
            ]
        });

        /**
         * Componente para mostrar la ficha de la persona
         * @type {Panel}
         */
        this.pFicha = new Ext.Panel({
            margins: '5 0 5 5',
            split: true,
            // collapsible: true,
            title: 'Ficha de la persona',
            width: '40%',
            region: 'west',
            layout: 'border',
            items: [
                {
                    region: 'north',
                    height: 200,
                    border: false,
                    bodyStyle: 'padding:10px',
                    items: this.fotoPersona
                },
                this.fpInfo
            ]
        });
        /**
         *
         * @type {Ext.Panel}
         */
        this.pCaptura = new Ext.Panel({
            title: 'Captura',
            region: 'center',
            margins: '5 5 5 0',
            layout: 'border',
            bodyStyle: 'padding:10px',
            width: '60%',
            items: [{
                region: 'east',
                width: '50%',
                height: 200,
                border: false,
                bodyStyle: 'padding:10px',
                items: this.fingScaner
            }, {
                region: 'center',
                height: 200,
                width: '50%',
                border: false,
                bodyStyle: 'padding:10px',
                items: this.fingFind
            }]
        });

        this.btnCerrar = new Ext.Button({
            text: 'Cerrar',
            // disabled: true,
            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'btn',
            handler: function () {
                me.close();
            }
        });
        this.btnBuscar = new Ext.Button({
            text: 'Buscar',
            // disabled: true,
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            handler: function () {
                me.searchBy();
            }
        });

        this.items = [this.pFicha, this.pCaptura];

        this.buttons = [this.btnBuscar, this.btnCerrar];

        PVD.Persona.Fingerprint.windFindByFinger.superclass.initComponent.call(this);
        this.on('render', function () {
            // this.echoSocket = PVD.WebSocket.Conections.init("ws://10.12.29.14:8080", "TCP", this);
        }, this);
        this.on('show', function () {
            // this.echoSocket = PVD.WebSocket.Conections.init("ws://10.12.29.14:8080", "TCP", this);

            this.searchBy();
        }, this)
    },
    searchBy: function () {
        var me = this;
        this.echoSocket.setIntanceOf(this);
        var request = {
            action: 'verify',
            type: 'request',
            parameters: {}
        };
        var msg = Ext.encode(request);
        this.echoSocket.sendData(msg);


    },
    setImgActive: function (hactiva, hcapture) {
        var me = this;
        if (hactiva) {
            this.fingScaner.setValue(hactiva);
            //this.searchPerson();
        }
    },
    searchPerson: function (data) {
        var me = this;
        PVD.mostrarMascara('find' + me.id, 'Por favor espere.', 'Buscado datos de la persona...');
        Ext.Ajax.request({
            url: 'findByParams',
            method: 'POST',
            params: {
                data: Ext.encode(data)
            },
            callback: function (options, success, response) {
                var responseData = Ext.decode(response.responseText);
                PVD.ocultarMascara('find' + me.id);
                if (responseData.success) {
                    me.fpInfo.getForm().setValues({
                        nombre: responseData.data.nombreapellidos,
                        numid: responseData.data.numid,
                        sexo: responseData.data.sexo
                    });
                    var imagen = "data:image/jgp;base64," + responseData.data.imagen;
                    var foto = "data:image/jgp;base64," + responseData.data.foto;
                    me.fingFind.setValue(imagen);
                    me.fotoPersona.setValue(foto);
                } else {
                    mostrarMensaje('3', 'No existe persona que corresponda con el criterio de busqueda.');
                }

            }
        });
    }
});

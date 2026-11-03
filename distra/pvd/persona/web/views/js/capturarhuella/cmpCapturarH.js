/**
 * @Created por XETID-RRHH.
 * @Author: Ing. Miguel Antonio Cabreja Aldana
 * @Date: 11/12/2014
 * @Time: 9:22
 * @Version:1.0
 */
Ext.ns('PVD.Persona.Fingerprint');
PVD.Persona.Fingerprint.windCapturar = Ext.extend(Ext.Window, {
    modal: true,
    width: '100%',
    layout: 'border',
    imgDefaultMale: '../../views/images/persona/no-photo-male.png',
    imgDefaultFemale: '../../views/images/persona/no-photo-female.png',

    initComponent: function () {
        var me = this;
        this.data = new Array();
        this.cmbStore = new Ext.data.Store({
            url: 'getCmbFingers',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data'
            }, [
                {name: 'iddedo'},
                {name: 'denominacion'},
                {name: 'descripcion'},
                {name: 'activo'},
                {name: 'imagen'},
                {name: 'numdedo'}
            ])
            /*,listeners: {
             'beforeload': function () {
             me.cmbDedo.disable();
             },
             'load': function () {
             me.cmbDedo.enable();
             }
             }*/
        });
        this.cmbDedo = new Ext.form.ComboBox({
            emptyText: 'Seleccionar dedo..',
            store: me.cmbStore,
            valueField: 'iddedo',
            displayField: 'denominacion',
            forceSelection: true,
            mode: 'local',
            editable: false,
            width: 200,
            triggerAction: 'all',
            selectOnFocus: true,
            listeners: {
                select: function (cmb, record) {
                    me.capture = record;
                    me.btnCapture.enable();
                    me.btnCapture.handler();
                    switch (record.get('numdedo')) {
                        //Mano Izquierda
                        case '1i':
                            me.setImg('izq', record.get('imagen'));
                            break;
                        case '2i':
                            me.setImg('izq', record.get('imagen'));
                            break;
                        case '3i':
                            me.setImg('izq', record.get('imagen'));
                            break;
                        case '4i':
                            me.setImg('izq', record.get('imagen'));
                            break;
                        case '5i':
                            me.setImg('izq', record.get('imagen'));
                            break;

                        //Mano derecha
                        case '1d':
                            me.setImg('der', record.get('imagen'));
                            break;
                        case '2d':
                            me.setImg('der', record.get('imagen'));
                            break;
                        case '3d':
                            me.setImg('der', record.get('imagen'));
                            break;
                        case '4d':
                            me.setImg('der', record.get('imagen'));
                            break;
                        case '5d':
                            me.setImg('der', record.get('imagen'));
                            break;
                    }
                }
            }
        });
        this.huellaAct = new Ext.ux.ScreenshotField({
            center: true,
            name: 'huellaAct',
            width: 250,
            height: 300,
            // value: '../../views/images/persona/huellas/índice.jpg',
            value: '../../views/images/persona/huellas/dactilar.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        //Mano Izq.
        this.menniqueIzq = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'menniqueIzq',
            allowUpload: true,
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }

        });

        this.anularIzq = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'anularIzq',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.medioIzq = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'medioIzq',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.indiceIzq = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'indiceIzq',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.pulgarIzq = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'pulgarIzq',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        //Mano Der.
        this.menniqueDer = new Ext.ux.ScreenshotField({
            center: true,
            name: 'menniqueDer',
            hideLabel: true,
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.anularDer = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'anularDer',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.medioDer = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'medioDer',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.indiceDer = new Ext.ux.ScreenshotField({
            center: true,
            name: 'indiceDer',
            hideLabel: true,
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });
        this.pulgarDer = new Ext.ux.ScreenshotField({
            center: true,
            hideLabel: true,
            name: 'pulgarDer',
            width: 40,
            height: 50,
            value: '../../views/images/persona/huellas/índice1.jpg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        this.btnCapture = new Ext.Button({
            text: 'Capturar',
            disabled: true,
            iconCls: 'camera',
            handler: function () {

                var request = {
                    action: 'capture',
                    type: 'request',
                    parameters: {
                        numdedo: !Ext.isEmpty(me.capture.get('numdedo')) ? me.capture.get('numdedo') : null,
                        iddedo: !Ext.isEmpty(me.capture.get('iddedo')) ? me.capture.get('iddedo') : null
                    }
                };

                var msg = Ext.encode(request);
                //var msg = '{"action":"capture","type":"request","parameters":[]}';
                me.sendRequest(msg);
            }
        });
        this.btnEstablecer = new Ext.Button({
            text: 'Establecer',
            icon: perfil.dirImg + 'aprobar.png',
            iconCls: 'btn',
            handler: function () {
                me.savingEstablisheds();
            }
        });

        this.btnDetails = new Ext.Button({
            text: 'Detalles',
            tooltip: 'Ver detalles de las huellas',
            icon: perfil.dirImg + 'detalles.png',
            iconCls: 'btn',
            handler: function () {

                me.showDetails();
            }
        });
        this.btnCerrar = new Ext.Button({
            text: 'Cerrar',
            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'btn',
            handler: function () {
                me.close();
            }
        });


        this.manoIzq = new Ext.ux.ScreenshotField({
            center: true,
            name: 'manoIzq',
            width: 230,
            height: 300,
            value: '../../views/images/persona/huellas/izq/mano_izq.jpeg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            },
            listeners: {
                click: function () {
                }
            }
        });
        this.manoDer = new Ext.ux.ScreenshotField({
            center: true,
            name: 'manoDer',
            width: 230,
            height: 300,
            value: '../../views/images/persona/huellas/der/mano_der.jpeg',
            allowBlank: false,
            baseParams: {
                query: 'passport-upload'
            }
        });

        this.pManos = new Ext.Panel({
            region: 'center',
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    title: 'Izquierda',
                    frame: true,
                    region: 'west',
                    margins: '5 0 5 5',
                    width: '30%',
                    items: me.manoIzq
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    title: 'Activa',
                    frame: true,
                    margins: '5 5 5 5',
                    width: '40%',
                    items: this.huellaAct
                },
                {
                    xtype: 'panel',
                    title: 'Derecha',
                    frame: true,
                    region: 'east',
                    margins: '5 5 5 0',
                    width: '30%',
                    items: me.manoDer

                }
            ]
        });

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
            cmargins: '5 5 5 5',
            split: true,
            collapsible: true,
            //title: this.idioma.lbFicha,
            width: '25%',
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


        this.fpFingers = new Ext.FormPanel({
            frame: true,
            title: 'Huellas capturadas',
            //region: 'north',
            region: 'south',
            border: false,
            width: '100%',
            collapsible: true,
            //collapseMode: 'mini',
            //collapsed: true,
            labelWidth: 55,
            margins: '5 5 5 5',
            //bodyStyle: 'padding: 0px 5px 5px 5px',
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: .2,
                        layout: 'form',
                        items: me.menniqueIzq
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.anularIzq
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.medioIzq
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.indiceIzq
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.pulgarIzq
                    }]
                }, {
                    layout: 'column',
                    border: false,
                    items: [{
                        columnWidth: .2,
                        layout: 'form',
                        items: me.menniqueDer
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.anularDer
                    }, {
                        columnWidth: .2,
                        fieldLabel: 'Medio Izq',
                        layout: 'form',
                        items: me.medioDer
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.indiceDer
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: me.pulgarDer
                    }]
                }]
        });

        this.pEjemplo = new Ext.Panel({});
        this.pGestion = new Ext.Panel({
            layout: 'border',
            region: 'center',
            border: false,
            margins: '5 5 0 5',
            items: [this.pFicha, this.pManos]
        });

        this.items = [this.fpFingers/*, this.pManos*/, this.pGestion];
        // this.items = [this.pEjemplo, this.pGestion];

        this.tbar = ['Escoger: ', this.cmbDedo, '-', this.btnCapture, this.btnEstablecer/*, '-', this.btnSave*/, '-', this.btnDetails];

        PVD.Persona.Fingerprint.windCapturar.superclass.initComponent.call(this);

        this.on('render', function () {
            //this.echoSocket = PVD.WebSocket.Conections.init("ws://10.12.29.14:8080", "TCP", this);
            this.echoSocket.setIntanceOf(this);
            if (!this.echoSocket.conexion) {
                this.cmbDedo.disable();
                this.btnCapture.disable();
                this.btnEstablecer.disable();
            } else {
                this.cmbDedo.enable();
                this.btnCapture.enable();
                this.btnEstablecer.enable()
            }

        }, this);

        this.on('show', function () {
            PVD.mostrarMascara('mask', 'Por favor espere...', 'Cargando...');
            Ext.Ajax.request({
                url: 'getFingersByIdperson',
                method: 'POST',
                params: {
                    idpersona: this.persona.get('idpersona')
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    PVD.ocultarMascara('mask');
                    if (!Ext.isEmpty(responseData)) {
                        Ext.each(responseData.data, function (rec) {
                                me.data.push({
                                    'iddedo': rec.iddedo,
                                    'idhuella': rec.idhuella,
                                    'minutia': rec.minutia,
                                    'imagen': rec.imagen,
                                    'calidad': rec.calidad
                                });
                                me.setImgDedo(rec.numdedo, 'data:image/jgp;base64,' + rec.imagen);

                            }
                        );
                    }

                }
            });

            this.fichaHandler(this.persona);
            this.imgHandler(this.persona);
        }, this);

    },
    /**
     *
     * @param mano
     * @param foto
     */
    setImg: function (mano, foto) {
        if (mano == 'izq') {
            this.manoIzq.setValue('data:image/jpg;base64, ' + foto);
            this.manoDer.setValue('../../views/images/persona/huellas/der/mano_der.jpeg');
        } else if (mano == 'der') {
            this.manoDer.setValue('data:image/jpg;base64, ' + foto);
            this.manoIzq.setValue('../../views/images/persona/huellas/izq/mano_izq.jpeg');
        }

    },
    /**
     *
     * @param rec
     */
    fichaHandler: function (rec) {
        this.fpInfo.getForm().setValues({
            nombre: rec.get('nombreyapellidos'),
            numid: rec.get('numid'),
            sexo: rec.get('sexo')

        });
    },
    /**
     *
     * @param rec
     */
    imgHandler: function (rec) {
        if (Ext.isEmpty(rec.get('foto'))) {
            if (rec.get('sexo') === 'Femenino' || rec.get('sexo') == 0) {
                this.fotoPersona.setValue(this.imgDefaultFemale);
            } else {
                this.fotoPersona.setValue(this.imgDefaultMale);
            }
        } else {
            this.fotoPersona.setValue('data:image/jpg;base64, ' + rec.get('foto'));
        }
    },
    /**
     *
     * @param hactiva
     */
    setImgHuella: function (hactiva) {
        if (hactiva) {
            this.huellaAct.setValue(hactiva);
        }
    },

    setImgDedo: function (numdedo, image) {
        switch (numdedo) {
            //Mano Izquierda
            case '1i':
                this.menniqueIzq.setValue(image);
                break;
            case '2i':
                this.anularIzq.setValue(image);
                break;
            case '3i':
                this.medioIzq.setValue(image);
                break;
            case '4i':
                this.indiceIzq.setValue(image);
                break;
            case '5i':
                this.pulgarIzq.setValue(image);
                break;

            //Mano derecha
            case '1d':
                this.menniqueDer.setValue(image);
                break;
            case '2d':
                this.anularDer.setValue(image);
                break;
            case '3d':
                this.medioDer.setValue(image);
                break;
            case '4d':
                this.indiceDer.setValue(image);
                break;
            case '5d':
                this.pulgarDer.setValue(image);
                break;
        }
    },
    /**
     *
     * @param fingers
     */
    savingEstablisheds: function () {
        var me = this;

        mostrarMensaje(2, 'Esta seguro que quiere almacenar las huellas capturadas?', function (btn) {
            var result = new Array();
            Ext.each(me.data, function (rec) {
                result.push(rec);
            });
            if (btn == 'ok') {
                PVD.mostrarMascara('mask', 'Por espere..', 'Enviando datos al servidor.');
                Ext.Ajax.request({
                    url: 'saveFingers',
                    method: 'POST',
                    params: {
                        data: Ext.encode(result),

                        idpersona: me.persona.get('idpersona')
                    },
                    callback: function (options, success, response) {
                        var responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            mostrarMensaje('1', 'El registro se ha realizado satisfactoriamente.')
                        }

                    }
                });
            }
        });

    },
    /**
     *
     * @param msg
     */
    sendRequest: function (msg) {
        this.echoSocket.registerFinger(msg);
    },

    showDetails: function () {
        var wind = new PVD.Persona.Fingerprint.dataViewHuella({
            autoCarga: true,
            url: 'getFingersByIdperson',
            title: 'Detalles de huellas registradas',
            params: {
                idpersona: this.persona.get('idpersona')
            }
        });
        wind.show();

    }
});


PVD.Persona.Fingerprint.SliderTip = Ext.extend(Ext.Tip, {
    minWidth: 10,
    offsets: [0, -10],
    init: function (slider) {
        slider.on('dragstart', this.onSlide, this);
        slider.on('drag', this.onSlide, this);
        slider.on('dragend', this.hide, this);
        slider.on('destroy', this.destroy, this);
    },

    onSlide: function (slider) {
        this.show();
        this.body.update(this.getText(slider));
        this.doAutoWidth();
        this.el.alignTo(slider.thumb, 'b-t?', this.offsets);
    },

    getText: function (slider) {
        return slider.getValue();
    }
});


PVD.Persona.Fingerprint.dataViewHuella = Ext.extend(Ext.Window, {
    closeAction: 'close',
    width: '60%',
    height: 420,
    maximizable: true,
    modal: true,
    layout: 'border',
    cls: 'img-chooser-dlg',
    initComponent: function () {
        var me = this;
        this.btnClose = new Ext.Button({
            text: 'Cerrar',
            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'btn',
            handler: function () {
                me.close();
            }
        });

        this.xtDataView = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="img-chooser-view thumb-wrap">',

            '<div id="{idimagen} "class="thumb-p" style="background:none repeat scroll 0 0 {color}; cursor: pointer ">' +
            '<img src="data:image/jpg;base64, {imagen}" width="{width}px" height="{height}px"></div>',
            '<span>{denomdedo}</span>',
            '</div>',
            '</div>',
            '</tpl>', {
                isPrincipal: function (principal) {
                    return principal == 1 ? 1 : 0;
                }
            }
        );

        this.xtDetails = new Ext.XTemplate(
            '<div class="img-chooser-dlg details">',
            '<tpl for=".">',
//            '<img src="data:image/jpg;base64, {foto}" width="96px" height="96px">',
            '<img src="data:image/jpg;base64, {imagen} "  width="96px" height="120px">',
            '<div class="img-chooser-dlg details-info">',
            '<b>Denominacion: </b>',
            '<span>{denomdedo}</span>',
            '<b>Calidad: </b>',
            '<span style="color: {color}">{calidad} %</span>',
            '<b>Fecha registro</b>',
            '<span>{fdesde}</span>',
            '</div>',
            '</tpl>',
            '</div>'
        );

        this.xtDetails.compile();
        this.xtDataView.compile();

        /*Store del DataView*/
        this.stDataView = new Ext.data.Store({
            autoLoad: this.autoCarga,
            url: this.url,

            baseParams: {
                idpersona: me.params.idpersona || null
            },
            reader: new Ext.data.JsonReader({
                    totalProperty: "cant",
                    root: "data",
                    id: "idhuella"
                },
                [
                    {name: 'iddedo'},
                    {name: 'idpersona'},
                    {name: 'imagen'},
                    {name: 'calidad'},
                    {
                        name: 'color', convert: function (v, rec) {
                        if (parseInt(rec.calidad) >= 90) {
                            return 'green';
                        } else if (parseInt(rec.calidad) >= 60) {
                            return 'blue';
                        } else {
                            return 'red';
                        }
                    }
                    },
                    {name: 'denomdedo'},
                    {name: 'numdedo'},
                    {name: 'fdesde'},
                    {name: 'principal', defaultValue: 1},
                    {
                        name: 'width', convert: function (arr) {
                        if (!arr) {
                            return self.widthImagen || 90;
                        }
                    }
                    },
                    {
                        name: 'height', convert: function (arr) {
                        if (!arr) {
                            return self.heightImagen || 125;
                        }
                    }
                    },
                    {name: 'minutia'}
                ]),

            listeners: {
                beforeload: function () {
                    this.sldSizeView.setValue(16);
                    PVD.mostrarMascara('msk' + me.id, 'Por favor espere...', 'Cargando registro de hullas...');
                }.createDelegate(this),
                load: function () {
                    PVD.ocultarMascara('msk' + me.id);
                }.createDelegate(this)
            }

        });

        /*DataView para mostrar la imagenes*/
        var catalogoConfig = {
            title: 'Huellas registradas',
            border: false,
            singleSelect: true,
            store: this.stDataView,
            tpl: this.xtDataView,
            autoScroll: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: '<div style="padding:10px;">No existe registro de huellas para esta persona.</div>',
            listeners: {
                click: function (d, i, n, e) {
                    Ext.getCmp('detail' + this.id).expand(false);
                    var detailEl = Ext.getCmp('detail' + this.id).body;

                    detailEl.hide();
                    this.xtDetails.overwrite(detailEl, d.getRecord(n).data);

                    detailEl.slideIn('l', {stopFx: true, duration: .2});

                }.createDelegate(this)
            }
        };
        catalogoConfig.multiSelect = this.multiSelect || false;

        this.dvCatalogoHuellas = new Ext.DataView(catalogoConfig);

        this.tipplugins = new PVD.Persona.Fingerprint.SliderTip({
            getText: function (slider) {
                return String.format('<b>{0}x{0}</b>', slider.getValue());
            }
        });

        this.sldSizeView = new Ext.Slider({
            width: 214,
            value: 16,
            increment: 16,
            minValue: 16,
            maxValue: 112,
            plugins: this.tipplugins,
            listeners: {
                beforechange: function (sl, newValue, oldValue) {
                    Ext.each(this.stCatalogoImagenes.getRange(), function (rec) {
                        rec.set('width', newValue);
                        rec.set('height', newValue);
                    })
                    this.dvCatalogoImagenes.refresh();
                }.createDelegate(this)
            }
        });
        if (!this.tbar && this.scalable) {
            this.tbar = [this.idioma.sizeview, this.sldSizeView];
        } else if (this.tbar instanceof Ext.Toolbar) {
        } else if (this.scalable) {
            this.tbar.push('-');
            this.tbar.push(this.idioma.sizeview);
            this.tbar.push(this.sldSizeView);
        }


        this.bbar = this.ptbCatalogoImagenes || null;

        this.items = [
            {
                region: 'center',
                cls: 'img-chooser-view',
                split: true,
                margins: '5 0 5 5',
                width: '80%',
                autoScroll: true,
                minWidth: 350,
                items: this.dvCatalogoHuellas
            },
            {
                region: 'east',
                id: 'detail' + this.id,
                split: true,
                collapsed: true,
                margins: '5 5 5 0',
                width: '20%',
                minWidth: 150
            }
        ];
        this.buttons = [this.btnClose];
        PVD.Persona.Fingerprint.dataViewHuella.superclass.initComponent.call(this);

    },
    getSelection: function () {
        return this.dvCatalogoHuellas.getSelectedRecords();
    },
    loadImages: function (objParams) {
        this.stDataView.load({
            params: objParams || {}
        })
    },
    getStore: function () {
        return this.stDataView;
    },
    getDataView: function () {
        return this.dvCatalogoHuellas;
    },
    setEscalaValue: function (v) {
        this.sldSizeView.setValue(v || 16);
    }
});


PVD.Persona.Fingerprint.pCapturarHuella = Ext.extend(Ext.Panel, {
    layout: 'border',
    initComponent: function () {
        var me = this;

        /**
         *
         * @type {Ext.Button}
         */
        this.btnRegister = new Ext.Button({
            text: 'Registrar',
            disabled: true,
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',

            handler: function () {
                me.showWindCaptura();
            }
        });

        this.btnSync = new Ext.Button({
            text: 'Sincronizar',
            icon: perfil.dirImg + 'actualizar.png',
            iconCls: 'btn',

            handler: function () {
                me.syncFingers();
            }
        });
        this.btnSearch = new Ext.Button({
            text: 'Buscar',
            // disabled: true,
            icon: perfil.dirImg + 'buscar.png',
            iconCls: 'btn',
            handler: function () {
                me.findByFinger();
            }
        });
        /**
         *
         * @type {Ext.components.CmpReccomplejas.Interfaz}
         */
        this.persona = new Ext.components.CmpReccomplejas.Interfaz({
            title: 'Listado de personas',
            disabled: false,
            width: '100%',
            region: 'center',
            margins: '5 0 5 5 ',
            border: true,
            idconfiguracion: 'personas',
            tituloReporte: 'Listado de personas',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de personas',
            hideBtnRtf: true,
            mainToolBar: [this.btnRegister, '-', this.btnSync, '-', this.btnSearch, '->', {
                text: 'Ayuda',
                iconCls: 'btn',
                icon: perfil.dirImg + 'ayuda.png'
            }],
            singleSelect: true,
            noUsarGestAvisos: true,
            useMap: false,
            autoLoadList: true,
            hideBtnOperCant: true,
            renderers: me.getRenderes()
        });


        this.items = [this.persona];

        PVD.Persona.Fingerprint.pCapturarHuella.superclass.initComponent.call(this);
        this.on('render', function () {
            var server = "ws://" + this.server;
            this.echoSocket = PVD.WebSocket.Conections.init(server, this.protocol, this);
            if (!this.echoSocket.conexion) {
                mostrarMensaje('3', 'No se pudo establecer la conexión con el servidor: ' + server + '/.');
                this.btnSync.disable();
                this.btnSearch.disable();
            } else {
                this.btnSync.enable();
                this.btnSearch.enable();
            }

        }, this);

        this.persona.pReporte.gpReporte.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
            this.recordpersona = rec;
            this.btnRegister.enable();

        }, this);


    },
    /**
     *
     * @returns {*|Object}
     */
    getRenderes: function () {
        return Ext.apply({
            showSexo: function (val) {
                if (val === 'Femenino') {
                    return '<img ext:qtip="<b>Femenina</b> "src="../../views/images/persona/female.png" />';
                }
                return '<img ext:qtip="<b>Maculino</b>" src="../../views/images/persona/male.png" />';
            },
            showGradoMilitar: function (val, opt, rec) {
                if (!Ext.isEmpty(val)) {
                    return '<center><img style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                } else {
                    return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                }
            }
        });
    },
    /**
     *
     * @returns {PVD.Persona.Fingerprint.windCapturar}
     */
    showWindCaptura: function () {
        var me = this;

        var wind = new PVD.Persona.Fingerprint.windCapturar({
            title: 'Registro de huellas dactilares: ' + me.recordpersona.get('nombreyapellidos'),
            persona: me.recordpersona,
            echoSocket: me.echoSocket

            //huellas: responseData.data
        });
        wind.show();
        wind.maximize();


    },
    /**
     *
     * @returns {*}
     */
    syncFingers: function () {
        PVD.mostrarMascara('masksyncronice', 'Por espere..', 'Sincronizando datos...');
        var request = {
            action: 'syncronice',
            type: 'request',
            parameters: {}
        };
        var msg = Ext.encode(request);
        this.echoSocket.sendData(msg);


    },
    /**
     *
     * @returns {PVD.Persona.Fingerprint.windFindByFinger}
     */
    findByFinger: function () {
        var me = this;
        var wind = new PVD.Persona.Fingerprint.windFindByFinger({
            title: 'Buscar persona',
            echoSocket: me.echoSocket
        });
        wind.show();
    }
});



/**
 * Created by drago on 02/10/2017.
 */

LOG.util.SignReport = Ext.extend(LOG.util.Report, {
    buildMenus: function () {
        var _this = this;
        this.menu = LOG.util.SignReport.superclass.buildMenus.call(this);
        this.menuSign = {
            itemId: 'btnFirmar',
            text: this.idioma.lbBtnFirmar,
            tooltip: this.idioma.ttBtnFirmar,
            key: {
                key: Ext.EventObject.F,
                shift: true,
                alt: false,
                ctrl: false
            },
            hidden: !this.rulesSign,
            tabular: true,
            iconCls: 'icondistra-firmaautorizada',
            handler: this.onSign
        };
        this.menu.insert(2, this.menuSign);
        this.menu.get('btnControl').setVisible(false);
        this.menu.get('btnLoad').setVisible(!this.hasSign);
        this.menu.get('btnExportar').setVisible(!this.hasSign);
        this.menu.get('btnImprimir').setVisible(!this.hasSign);
        return this.menu;
    },
    createItem: function (config) {
        return new LOG.util.SignReportItem(config)
    },
    onAfterRenderReport: function (p) {
        var _this = this;
        if (p.isSigned()) {
            p.set('idpki', p.node.split("_")[0] || '');
            p.set('idnode', p.node.split("_")[3] || '');
            p.set('page', 0);
            p.set('maxpage', p.node.split("_")[1] || 0);
            p.body.on('scroll', function (tab, dom) {
                if (p.get('maxpage') > p.get('page')) {
                    if (dom.scrollTop >= (dom.scrollTopMax - 150) && dom.scrollTop >= (dom.scrollTopMax - 100)) {
                        _this.viewReport({
                            typeRequest: 'ajax',
                            typeFormat: 'JPEG',
                            content: 'images/jpeg',
                            paginated: true,
                            useSign: false,
                            isAttachment: false
                        });
                    }
                }
            }, p);
            _this.viewReport({
                typeRequest: 'ajax',
                typeFormat: 'JPEG',
                content: 'images/jpeg',
                paginated: true,
                useSign: false,
                isAttachment: false
            });
        } else {
            LOG.util.SignReport.superclass.onAfterRenderReport.call(this, p);
        }
    },
    /**
     * @param
     * @returns {boolean}
     */
    onSign: function () {
        var _this = this;
        var record = _this.getGridPrincipal().getSelectionModel().getSelected();
        this.sign = new LOG.util.SignView({
            action: (parseInt(record.get('controlfirma')) != 0) ? 'firmar' : 'certificar',
            cantSign: this.cantSign,
            posSign: 'last',
            controlSign: record.get('controlfirma')
        });
        this.sign.setTitle(this.sign.action === 'certificar' ? 'Certificar documento' : 'Firmar documento');
        this.sign.on('beforeSign', function (self, signSet) {
            _this.model.firmar({
                action: _this.sign.action === 'certificar' ? 'Certificando documento(s).' : 'Firmando documento(s).',
                signSet: signSet,//signSet
                reportSet: {
                    name: _this.name,
                    isList: false,
                    params: this.getItem().params,
                    dirReport: '/reports' + this.dirReport
                }
            }, _this.onSigned.createDelegate(_this));
        });
        this.sign.show();
    },
    /**
     * @param
     * @returns {boolean}
     */
    onSigned: function (response) {
        this.viewReport({
            typeRequest: 'ajax',
            typeFormat: 'JPEG',
            content: 'images/jpeg',
            paginated: true,
            useFirma: false,
            useSign: false,
            isAttachment: false
        });
    }
});
LOG.util.SignReportItem = Ext.extend(LOG.util.ReportItem, {
    typeView: 3,
    isSigned: function () {
        return this.hasSign;
    },
    onException: function (v, o) {
        v.getEl().update('<div style="padding:10px;">Error al cargar la(s) firma(s) digitale(s). Vuele a intentarlo.</div>');
    },
    buildItems: function () {
        this.elems = LOG.util.SignReportItem.superclass.buildItems.call(this);
        if (this.isSigned())
            return this.buildElements();
        return this.elems;
    },
    buildElements: function () {
        this.elems.push(this.buildSignDetails());
        this.elems.push(this.buildSignTree())
        return this.elems;
    },
    buildSignDetails: function () {
        var _this = this;
        if (!this.pnSignDetails) {
            this.porCiento = (this.limit == 1) ? 100 : parseInt(100 / this.limit);
            this.totalPorperty = 1;
            return this.pnSignDetails = new Ext.Panel({
                layout: 'fit',
                region: 'south',
                height: 180,
                collapsible: true,
                collapseMode: 'mini',
                collapsed: true,
                split: true,
                title: 'Detalles',
                frame: true,
                monitorResize: true,
                border: false,
                bodyBorder: true,
                defaults: {autoScroll: true},
                margins: '0 0 0 0',
                items: [{
                    xtype: 'panel',
                    frame: false,
                    layout: 'fit',
                    defaults: {autoScroll: true},
                    bodyStyle: 'padding: 0px 10px 10px 40px; background-color:#F1F5FB;',
                    items: [_this.dataView = new Ext.DataView({
                        tpl: new Ext.XTemplate(
                            '<tpl for=".">',
                            '<table border="0" width="' + this.porCiento + '%"' +
                            'style="font-family:tahoma,arial,helvetica,sans-serif;font-size:12px;' +
                            'font-size-adjust:none;font-style:normal;font-variant:normal;font-weight:normal;' +
                            'line-height:normal;width:100%;">' +
                            '<tr style="background-color:#F1F5FB;">' +
                            '<td width="22%"><label ><b>{text}</b></label></td>' +
                            '</tr>' +
                            '<tr style="background-color:#F1F5FB;">' +
                            '<td width="22%"><label ><b>' + _this.signDetails['fullName'] + ':</b></label></td>' +
                            '<td width="78%"><label id="idFullName_' + _this.signDetails['fullName'] + '_' + '{i}' + '">' + '{autor}' + '</label></td>' +
                            '</tr>' +
                            '<tr style="background-color:#F1F5FB;">' +
                            '<td width="22%"><label ><b>' + _this.signDetails['fechaCreacion'] + ':</b></label></td>' +
                            '<td width="78%"><label id="idFechaCreacion_' + _this.signDetails['fechaCreacion'] + '_' + '{i}' + '">' + '{fechaC}' + '</label></td>' +
                            '</tr>' +
                            '<tr style="background-color:#F1F5FB;">' +
                            '<td width="22%"><label><b>' + _this.signDetails['signDetails'] + ':</b></label></td>' +
                            '<td width="78%"><label id="idsignDetails_' + _this.signDetails['signDetails'] + '_' + '{i}' + '">' + '{generalSign}' + '</label></td>' +
                            '</tr>' +
                            '</table>' +
                            '</tpl>'
                        ),
                        singleSelect: true,
                        overClass: 'x-view-over',
                        emptyText: '<div style="padding:10px;align:center;">Este reporte no presenta firmas digitales.</div>',
                        store: new Ext.data.JsonStore({
                            url: '/pki/index.php/managedoc/signatureDetails',
                            baseParams: {tab: _this.node.split('_')[0] + '_', node: 'source'},
                            autoLoad: this.isSigned(),
                            root: '',
                            fields: ['text',
                                'valid', 'indentity',
                                'tsa', 'tsaStatus',
                                'tsaCn', 'time',
                                'autor', 'fechaC',
                                'fechaM'
                            ],
                            listeners: {
                                'beforeload': function (st, opts) {
                                    st.baseParams = {tab: _this.node.split('_')[0] + '_', node: 'source'};
                                    _this.totalPorperty = 1;
                                },
                                'load': function (st, r, o) {

                                }
                            }
                        }),
                        listeners: {
                            'loadexception': {fn: this.onLoadException, scope: this}
                        },
                        prepareData: function (data) {
                            data.i = _this.totalPorperty;
                            var autor = data['autor'];
                            data['autor'] = data['text'].split(':')[1];
                            data['text'] = _this.signDetails[_this.totalPorperty] + ' y ' + data['text'].split(':')[0]; //y Firmado por
                            if (data['valid'] != undefined) {
                                if (data['tsaCn'] != "" && data['tsaStatus'] != "") {
                                    _this.pnSignDetails.setTitle('Detalles de la firma');
                                    data.generalSign = (data['valid'] + '</br>' + data['indentity'] + '</br>' + data['tsa'] + '</br>' + data['tsaStatus'] + '</br>' + 'Marca de tiempo emitida por: ' + data['tsaCn'] + '</br>' + data['time'] + '</br>');
                                } else {
                                    _this.pnSignDetails.setTitle('Detalles de la firma');
                                    data.generalSign = (data['valid'] + '</br>' + data['indentity'] + '</br>' + data['tsa'] + '</br>' + 'Hora de la última comprobación: ' + data['time'] + '</br>');
                                }
                            } else if (data['sign_empty'] == 'sign_empty') {
                                _this.pnSignDetails.setTitle('Detalles');
                                data.generalSign = (data['text']);
                            } else {
                                _this.pnSignDetails.setTitle('Detalles del documento');
                                data.generalSign = ('Autor: ' + autor + '</br>' + 'Fecha de creación :' + data['fechaC'] + '</br>' + 'Fecha de modificación: ' + data['fechaM']);
                            }
                            _this.totalPorperty++;
                            return data;
                        }
                    })]
                }],
                listeners: {
                    collapse: function (p) {
                        if (Ext.version != '2.2') {
                            _this.panelReport.setHeight(_this.panelReport.getHeight() + p.getHeight());
                        }
                        // _this.doLayout();
                    },
                    expand: function (p) {
                        if (Ext.version != '2.2') {
                            _this.panelReport.setHeight(_this.panelReport.getHeight() + p.getHeight());
                        }
                        //   _this.doLayout();
                    }
                }
            });
        } else {
            _this.dataView.store.reload();
            return this.pnSignDetails;
        }
    },
    buildSignTree: function () {
        var _this = this;
        if (!this.reportDetails) {
            this.treeSign = new Ext.tree.TreePanel({
                region: 'center',
                useArrows: true,
                name: 'detalles',
                root: {
                    nodeType: 'async',
                    text: 'Firmas',
                    id: 'source',
                    expanded: this.isSigned(),
                    iconCls: 'root-node-icon'
                },
                //rootVisible: false,
                listeners: {
                    'click': function (nodo) {
                        if (nodo.id != 'source') {
                            if (nodo.attributes['valid'] != undefined) {
                                if (nodo.attributes['tsaCn'] != "" && nodo.attributes['tsaStatus'] != "") {
                                    _this.viewOtrosDetalles.setTitle('Detalles de la firma');
                                    _this.taDetalles.setValue(nodo.attributes['valid'] + '\n'
                                    + nodo.attributes['indentity'] + '\n'
                                    + nodo.attributes['tsa'] + '\n'
                                    + nodo.attributes['tsaStatus'] + '\n'
                                    + 'Marca de tiempo emitida por: ' + nodo.attributes['tsaCn'] + '\n'
                                    + nodo.attributes['time'] + '\n');
                                } else {
                                    _this.viewOtrosDetalles.setTitle('Detalles de la firma');
                                    _this.taDetalles.setValue(nodo.attributes['valid'] + '\n'
                                    + nodo.attributes['indentity'] + '\n'
                                    + nodo.attributes['tsa'] + '\n'
                                    + 'Hora de la última comprobación: '
                                    + nodo.attributes['time'] + '\n');
                                }
                            } else if (nodo.attributes['sign_empty'] == 'sign_empty') {
                                _this.viewOtrosDetalles.setTitle('Detalles');
                                _this.taDetalles.setValue(nodo.attributes['text']);
                            } else {
                                _this.viewOtrosDetalles.setTitle('Detalles del documento');
                                _this.taDetalles.setValue('Autor: ' + nodo.attributes['autor'] + '\n'
                                + 'Fecha de creación :' + nodo.attributes['fechaC'] + '\n'
                                + 'Fecha de modificación: ' + nodo.attributes['fechaM']);
                            }
                        } else {
                            _this.taDetalles.reset();
                        }
                    },
                    'beforeload': function (node) {
                        var anode = _this.treeSign.getLoader();
                        anode.clearOnLoad = true;
                        anode.dataUrl = '/pki/index.php/managedoc/signatureDetails';
                        anode.baseParams = {};
                        anode.baseParams.tab = _this.id + '_';
                    },
                    'load': function (node) {
                        if (node.firstChild && node.firstChild.text != null) {
                            var validez = _this.treeSign.getRootNode().firstChild.attributes.cod_validez;
                            if (validez.substring(4, 6) != null && (validez.substring(4, 6) == '44' || validez.substring(4, 6) == '45')) {
                                for (var i = 0; i < validez.substring(8); i++) {
                                    var nodo = {
                                        'id': 'nodo_' + i,
                                        'text': 'Campo de firma vacio ' + (i + 1),
                                        'idpadre': '0',
                                        'leaf': true,
                                        'iconCls': 'node-icon-sign',
                                        'enableColumnHide': false,
                                        'sign_empty': 'sign_empty'
                                    };
                                    _this.treeSign.getRootNode().appendChild(nodo);
                                }
                            }
                        } else {
                            mostrarMensaje(1, 'Error al cargar las firmas digitales. Vuele a intentarlo.');
                        }
                    }
                }
            });
            this.taDetalles = new Ext.form.TextArea({
                readOnly: true,
                name: "textarea1",
                hideLabel: true
            });
            this.btnDescargar = new Ext.Button({
                text: "Descargar",
                name: "descargar",
                tooltip: "Descargar documento(s). Alt+",
                iconCls: "recuperaciones",
                listeners: {
                    'click': this.onDownload.createDelegate(this)
                }
            });
            this.viewOtrosDetalles = new Ext.Panel({
                title: "Detalles",
                region: "south",
                height: 250,
                collapsible: true,
                layout: "fit",
                split: true,
                bbar: ['->', this.btnDescargar],
                items: [this.taDetalles]
            });
            return this.reportDetails = new Ext.Panel({
                layout: 'border',
                region: 'west',
                width: 300,
                collapsible: true,
                collapseMode: 'mini',
                collapsed: false,
                title: 'Firmas',
                frame: true,
                items: [this.treeSign, this.viewOtrosDetalles],
                listeners: {
                    'collapse': function (p) {
                        if (Ext.version != '2.2') {
                            _this.panelReport.setWidth(_this.panelReport.getWidth() + p.getWidth());
                        }
                    },
                    'expand': function (p) {
                        if (Ext.version != '2.2') {
                            _this.panelReport.setWidth(_this.panelReport.getWidth() + p.getWidth());
                        }
                    },
                    'afterrender': function (p) {
                        p.expand();
                    }
                }
            });
        } else {
            _this.treeSign.expand();
            return this.reportDetails;
        }
    },
    onDownload: function (btn) {
        window.open('/logistica/utiles/documento/index.php/documentologistica/descargarDocumento?idnodo=' + this.node.split('_')[3]);
    }
});

LOG.util.SignView = Ext.extend(Ext.Window, {
    cantSign: 3, //['4'], ['5'], ['6']
    posSign: 'last', //['1', 'fist'], ['2', 'last']
    validate: true,
    modal: true,
    constrain: true,
    closeAction: 'hide',
    constructor: function (config) {
        var _this = this;
        Ext.apply(this, config);
        this.idioma = Ext.apply(this, LOG.util.Report.Idioma);
        this.listaDocumentos = new Array();
        this.resizable = false;
        this.usarAplicar = false;
        this.width = 340;
        //this.height = 360;
        this.autoHeight = true;
        this.title = this.action === 'certificar' ? 'Certificar documento' : 'Firmar documento';
        this.builderUI();
        this.builderButtons();
        LOG.util.SignView.superclass.constructor.call(this, config);
    },
    builderUI: function () {
        var _this = this;
        this.clsPanel = LOG.util.UIManager.initColumnForm({
            columnas: 1
        });
        this.dsIDDigital = new Ext.data.Store({
            url: '/pki/index.php/manageids/listar',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    totalProperty: 'data_count',
                    root: 'data'
                },
                [
                    {name: 'denominacion'},
                    {name: 'emisor'},
                    {name: 'validez'},
                    {name: 'pk_iddigital'}
                ]),
            listeners: {
                'load': function (s, r, o) {
                    _this.cboxIDDigital.setValue(r.length > 0 ? r[0].get('pk_iddigital') : 0);
                }
            }
        });
        this.cboxIDDigital = new LOG.util.ComboBox({
            //fieldLabel: this.idioma.lbIDDigital,
            fieldLabel: "Seleccione el ID Digital",
            valueField: 'pk_iddigital',
            displayField: 'denominacion',
            allowBlank: false,
            editable: false,
            name: 'cmb_id_digital',
            emptyText: "Seleccione el ID Digital",
            store: this.dsIDDigital
        });
        this.clsPanel.addComponent(this.cboxIDDigital);
        this.tfPassword = new Ext.form.TextField({
            name: "tfPassword",
            inputType: "password",
            blankText: "Este campo es obligatorio.",
            fieldLabel: "Introduzca la contrase\u00f1a del ID digital",
            labelSeparator: '',
            allowBlank: false
        });
        this.clsPanel.addComponent(this.tfPassword);
        this.dsAspecto = new Ext.data.Store({
            url: '/pki/index.php/manageaspect/getaspects',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad_filas",
                    id: "id"
                },
                [
                    {name: 'pk_idaspecto'},
                    {name: 'idusuario'},
                    {name: 'denominacion'},
                    {name: 'grafico'}
                ]),
            listeners: {
                'load': function (s, r, o) {
                    _this.cboxAspecto.setValue(r.length > 0 ? r[0].get('pk_idaspecto') : 0);
                }
            }
        });
        this.cboxAspecto = new LOG.util.ComboBox({
            //fieldLabel: this.idioma.lbCbCalidad,
            valueField: 'pk_idaspecto',
            displayField: 'denominacion',
            allowBlank: false,
            width: '95%',
            editable: false,
            name: 'cmb_aspecto',
            emptyText: 'Seleccione el aspecto de firma',
            store: this.dsAspecto
        });
        this.fsetAspecto = new Ext.form.FieldSet({
            title: "Aspecto",
            name: "fsetAspecto",
            items: [this.cboxAspecto]
        });
        this.clsPanel.addComponent(this.fsetAspecto);

        this.txtAreaMotivo = new Ext.form.TextArea({
            name: "ta_motivo",
            fieldLabel: "Motivo",
            width: '95%',
            height: 70,
            autoScroll: true,
            minLength: 2,
            maxLength: 255
            //  maxLengthText: this.idioma.msgTaTamanoMaximo
        });
        this.clsPanel.addComponent(this.txtAreaMotivo);
        this.cboxBoqueo = new Ext.form.Checkbox({
            name: "chbox_bloqueo",
            width: 250,
            height: 19,
            hideLabel: true,
            hidden: true,
            boxLabel: "Bloquear documento despu\u00e9s de firmado",
            fieldLabel: "Bloquear documento despu\u00e9s de firmado"
        });
        this.clsPanel.addComponent(this.cboxBoqueo);
        if (this.action == 'firmar') {
            this.hdUbicacion = new Ext.form.Hidden({
                name: 'cmb_ubicacion_firma',
                value: _this.getUbicacionValue()
            });
            this.clsPanel.addComponent(this.hdUbicacion);
        }
        this.hdPagina = new Ext.form.Hidden({
            name: 'cmb_pagina_firma',
            value: _this.posSign == 'last' ? '2' : '1'
        });
        this.clsPanel.addComponent(this.hdPagina);

        this.hdSpaceFirmas = new Ext.form.Hidden({
            name: 'numf_cant_firmas',
            typeAhead: true,
            selectOnFocus: true,
            minValue: 0,
            maxValue: 30,
            value: parseInt(this.cantSign) - 1,
            width: 300
        });
        this.hdActionsFirmas = new Ext.form.Hidden({
            name: 'cmb_acciones_firmas',
            typeAhead: true,
            selectOnFocus: true,
            minValue: 0,
            maxValue: 30,
            value: 2,
            width: 300
        });
        this.clsPanel.addComponent(this.hdActionsFirmas);
        this.initFormPanel = LOG.util.UIManager.initForm({
            frame: true,
            region: 'center',
            layout: 'form',
            labelAlign: 'top',
            items: [this.clsPanel]
        });
        this.items = [this.initFormPanel];
    },
    getUbicacionValue: function () {
        var l = this.findUbicacion(this.cantSign);
        return l[parseInt(this.controlSign)];
    },
    findUbicacion: function (v) {
        if (v == 3) {
            return [4, 5, 6];
        } else if (v == 2) {
            return [4, 6];
        }
        return [4];
    },
    builderButtons: function () {
        var _this = this;
        this.listaBotones = new Array();
        this.listaBotones.push(LOG.util.Prototipos.botonCancelar({
            text: this.idioma.lbBtnCancelar,
            handler: function () {
                _this.hide();
            }
        }));
        this.aceptar = LOG.util.Prototipos.botonAceptar({
            text: this.idioma.lbBtnAceptar,
            disabled: true,
            handler: function () {
                var params = {
                    docs: Ext.encode(_this.listaDocumentos[0]),
                    encrytepass: _this.encryptRSA(_this.tfPassword.getValue()),
                    idDig: _this.cboxIDDigital.getValue(),
                    idAspecto: _this.cboxAspecto.getValue(),
                    accion: _this.action,
                    pagina: _this.hdPagina.getValue(),
                    numf_cant_firmas: _this.hdSpaceFirmas.getValue(),
                    position_extra_signature: "Inferior",
                    cert_action: _this.hdActionsFirmas.getValue(),
                    tf_password: _this.tfPassword.getValue(),
                    view: 1
                };
                Ext.apply(params, _this.initFormPanel.getForm().getValues());
                var wait = Ext.MessageBox.wait(_this.action === 'certificar' ? 'Certificando documento(s).' : 'Firmando documento(s).');
                params = _this.filterParams(params);
                _this.fireEvent('beforeSign',this,params);
            },
            controlFn: function (b) {
                _this.cboxIDDigital.on({
                    select: _this.onEventsComp.createDelegate(this, [b])
                });
                _this.tfPassword.on({
                    keyup: _this.onEventsComp.createDelegate(this, [b])
                });
                _this.txtAreaMotivo.on({
                    keyup: _this.onEventsComp.createDelegate(this, [b])
                });
                _this.cboxBoqueo.on({
                    select: _this.onEventsComp.createDelegate(this, [b])
                });
            }
        });
        this.listaBotones.push(this.aceptar);
        this.buttons = this.listaBotones;
    },
    filterParams: function (b) {
        var p = {
            accion: '', cert_action: '', encrytepass: '',
            idAspecto: '', idDig: '', numf_cant_firmas: '', cmb_ubicacion_firma: '',
            pagina: '', position_extra_signature: '',
            ta_motivo: '', tf_password: '', view: '', docs: ''
        };
        for (var k in p) {
            p[k] = b[k];
        }
        return p;
    },
    onEventsComp: function (b) {
        if (this.initFormPanel.getForm().isValid()) {
            b.enable();
        } else {
            b.disable();
        }
    },
    onShowHandler: function () {
        LOG.util.UIManager.applyKey(this.aceptar, this.panel);
        if (typeof this.aceptar.controlFn == 'function') {
            this.aceptar.controlFn.createDelegate(this, [this.aceptar, this]).call();
        }
    },
    addDocumento: function (doc) {
        this.listaDocumentos.push(doc);
    },
    setDocumento: function (doc) {
        this.listaDocumentos = [doc];
    },
    encryptRSA: function (text) {
        var key = RSA.getPublicKey(window.parent.document.getElementById('publicKey').value);
        return RSA.encrypt(text, key);
    }
});
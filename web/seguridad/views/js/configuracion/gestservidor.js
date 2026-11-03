Ext.ns("Configuracion");
////------------ Declarar Variables ------------////
var winInsServ, winModServ, openldap, tiposervidor, ldap;
var ventanaadicionar = false, tfpuerto;
var arregloAtribNomb = [];
var arregloAtribApell = [];
var arregloAtribUsuario = [];

Configuracion.Servidores = Ext.extend(Ext.Panel,
    {
        id: 'Servidores',
        layout: 'fit',
        closeAction: 'destroy',
        initComponent: function () {
            var _this = this;

            ////------------ Botones ------------////
            this.btnAdicionar = new Ext.Button({
                id: 'btnAgrServ',
                tooltip: perfil.etiquetas.textToolTipadicionar,
                prevTab: 'btnAyuServ',
                iconCls: 'adicionar',
                text: perfil.etiquetas.lbBtnAdicionar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 105,
                        alt: true
                    }
                },
                handler: function () {
                    winFormServ('Ins');
                }
            });

            this.btnModificar = new Ext.Button({
                id: 'btnModServ',
                disabled: true,
                tooltip: perfil.etiquetas.textToolTipModificar,
                iconCls: 'modificar',
                text: perfil.etiquetas.lbBtnModificar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 109,
                        alt: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() == 1) {
                        winFormServ('Mod');
                    }
                }
            });

            this.btnEliminar = new Ext.Button({
                id: 'btnEliServ',
                disabled: true,
                tooltip: perfil.etiquetas.textToolTipEliminar,
                iconCls: 'eliminar',
                text: perfil.etiquetas.lbBtnEliminar,
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: Ext.EventObject.DELETE,
                        stopEvent: true
                    }
                },
                handler: function () {
                    if (_this.sm.getCount() >= 1)
                        eliminarservidor();
                }
            });

            this.btnProbarConexAdd = new Ext.Button({
                tooltip: perfil.etiquetas.textToolTipProbar,
                iconCls: 'probar',
                text: 'Probar',
                id: 'probarConAdd',
                handler: function () {
                    winProbarCon.show();
                }
            });

            this.btnProbarConexMod = new Ext.Button({
                tooltip: perfil.etiquetas.textToolTipProbar,
                iconCls: 'probar',
                text: 'Probar',
                id: 'probarConMod',
                handler: function () {
                    winProbarCon.show();
                }
            });
            this.btnAyuda = new Ext.Button({
                id: 'btnAyuServ',
                iconCls: 'ayuda',
                text: '<b>Ayuda</b>',
                nextTab: 'btnAgrServ',
                prevTab: 'btnEliServ',
                disabled: false,
                toolTip: perfil.etiquetas.textToolTipHelp,
                icon: perfil.dirImg + 'ayuda.png',
                hotKey: {
                    idGrupo: 'Servidores',
                    config: {
                        key: 104,
                        alt: true
                    }
                },
                menu:
                    new Ext.menu.Menu({
                        id: 'mainMenu',
                        items: [
                            {
                                handler: function () {
                                    cargarAyuda();
                                }, text: 'Ayuda',
                                id: 'btnAyuDesktop',
                                icon: perfil.dirImg + 'ayuda.png',
                                iconCls: 'btn',
                                tooltip: 'Ayuda del sistema'
                            },
                            {
                                text: 'Acerca de',
                                id: 'acercade',
                                icon: perfil.dirImg + 'info.png',
                                iconCls: 'btn',
                                tooltip: "Acerca de <b>(Alt+...s)</b>",
                                handler: function () {

                                    var uri = "seguridad";
                                    acercaDe.show(uri);
                                }
                            }
                        ]
                    })

            });

            ////------------ Combo Box ------------////
            var dataTmp = [
                ['bd', 'Servidor de base datos'],
                ['autenticaci&oacute;n', 'Servidor de autenticaci\xf3n'],
                ['xmpp', 'Servidor XMPP'],
                ['email', 'Servidor de correo elctr\xf3nico']
            ];

            var storeDataTmp = new Ext.data.SimpleStore({
                fields: ['tiposervidor', 'denominacion'],
                data: dataTmp
            });

            ////------------ Store del Grid de Servidores ------------////
            this.store = new Ext.data.Store({
                url: arbolAcc.root.childNodes[2].attributes.controller + 'cargarservidores',
                reader: new Ext.data.JsonReader({
                    totalProperty: "cantidad_filas",
                    root: "datos",
                    id: "id"
                }, [
                    {
                        name: 'idservidor',
                        mapping: 'id'
                    },

                    {
                        name: 'denominacion',
                        mapping: 'text'
                    },

                    {
                        name: 'tiposervidor',
                        mapping: 'tiposervidor'
                    },

                    {
                        name: 'descripcion',
                        mapping: 'descripcion'
                    },

                    {
                        name: 'ip',
                        mapping: 'ip'
                    },

                    {
                        name: 'typeserverauth',
                        mapping: 'tservidor'
                    },

                    {
                        name: 'user',
                        mapping: 'usuario'
                    },

                    {
                        name: 'basedn',
                        mapping: 'basedn'
                    },

                    {
                        name: 'puerto',
                        mapping: 'puerto'
                    },
                    {
                        name: 'chekssl',
                        mapping: 'ssl'
                    },

                    {
                        name: 'chektsl',
                        mapping: 'tsl'
                    },
                    {
                        name: 'objectclass',
                        mapping: 'objectclass'
                    },
                    {
                        name: 'fnombre',
                        mapping: 'fnombre'
                    },
                    {
                        name: 'fapellidos',
                        mapping: 'fapellidos'
                    },
                    {
                        name: 'fusuario',
                        mapping: 'fusuario'
                    },

                    {
                        name: 'fqdn',
                        mapping: 'fqdn'
                    }
                ]),
                listeners: {
                    load: function () {
                        if (_this.store.getCount() == 0) {
                            Ext.Msg.show({
                                title: perfil.etiquetas.msgInf,
                                msg: perfil.etiquetas.msgInfDatos,
                                buttons: Ext.Msg.OK,
                                icon: Ext.MessageBox.INFO
                            });
                        }
                    }

                }
            });

            this.store.load({
                params: {
                    start: 0,
                    limit: 15
                }
            });

            ////------------ Establezco modo de selección de grid ------------////
            this.sm = new Ext.grid.RowSelectionModel({
                singleSelect: false
            });

            this.sm.on('rowselect', function () {
                _this.btnModificar.enable();
                _this.btnEliminar.enable()
            }, this);

            this.sm.on('rowdeselect', function (smodel) {
                if (smodel.hasSelection() == false) {
                    _this.btnModificar.disable();
                    _this.btnEliminar.disable()
                }
            }, this);

            ////------------ Defino el grid de Servidores ------------////
            this.grid = new Ext.grid.GridPanel({
                title: perfil.etiquetas.titleGridServidores,
                cls: 'x-toolbar',
                border: false,
                frame: false,
                region: 'center',
                autoExpandColumn: 'expandir',
                store: _this.store,
                sm: _this.sm,
                columns: [
                    {
                        hidden: true,
                        hideable: false,
                        dataIndex: 'idservidor'
                    },
                    {
                        header: perfil.etiquetas.lbServidor,
                        width: 150,
                        dataIndex: 'denominacion',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbIP,
                        dataIndex: 'ip',
                        sortable: true
                    },
                    {
                        header: perfil.etiquetas.lbTipo,
                        dataIndex: 'tiposervidor',
                        sortable: true
                    },
                    {
                        id: 'expandir',
                        header: perfil.etiquetas.lbDescripcion,
                        width: 350,
                        dataIndex: 'descripcion',
                        sortable: true
                    }
                ],
                loadMask: {
                    store: _this.store
                },
                bbar: new Ext.PagingToolbar({
                    pageSize: 15,
                    id: 'ptbaux',
                    store: _this.store,
                    displayInfo: true,
                    displayMsg: perfil.etiquetas.lbMsgbbarI,
                    emptyMsg: perfil.etiquetas.lbMsgbbarII
                })
            });

            ////************ ITEMS DEL FORMULARIO ************////

            ////------------ Combo servidores del formulario ------------////
            var cbservidores = new Ext.form.ComboBox({
                emptyText: perfil.etiquetas.lbMsgSelect,
                editable: false,
                fieldLabel: perfil.etiquetas.lbTiipoBD,
                store: storeDataTmp,
                tabIndex: 3,
                enableQtip: true,
                id: 'cbservidores',
                prevTab: 'ip',
                valueField: 'tiposervidor',
                displayField: 'denominacion',
                hiddenName: 'tiposervidor',
                typeAhead: true,
                mode: 'local',
                width: 150,
                allowBlank: false,
                triggerAction: 'all',
                selectOnFocus: true,
                anchor: '90%'
            });

            ////------------ Textfield usuario del formulario ------------////
            var tfusuario = new Ext.form.TextField({
                fieldLabel: perfil.etiquetas.lbUsuario,
                tabIndex: 6,
                allowBlank: false,
                maxLength: 100,
                width: 350,
                style: 'margin-right:22px',
                id: 'user'
            });

            var tfpassword = new Ext.form.TextField({
                fieldLabel: perfil.etiquetas.lbContrasena,
                inputType: 'password',
                allowBlank: false,
                encryptedValue: '',
                tabIndex: 7,
                width: 350,
                id: 'passw',
                validator: function (value) {
                    if (value) {
                        (ventanaadicionar) ? _this.btnProbarConexAdd.enable() : _this.btnProbarConexMod.enable();
                        if (false) {
                            return '@TODO Agregar mensaje de error (validator).';
                        } else {
                            return true;
                        }
                    } else {
                        if (ventanaadicionar) {
                            _this.btnProbarConexAdd.disable();
                            Ext.getCmp('btnInsServAut').disable();
                        } else {
                            _this.btnProbarConexMod.disable();
                            Ext.getCmp('btnAceptarMod').disable();
                        }
                        return this.emptyText;
                    }
                }
            });

            var tfpuerto = new Ext.form.NumberField({
                tabIndex: 11,
                maxLength: 4,
                anchor: '100%',
                fieldLabel: perfil.etiquetas.lbPuerto,
                value: 389,
                style: 'width: 225px;',
                allowBlank: true,
                id: 'puerto',
                name: 'puerto'
            });

            var panelpuerto = new Ext.Panel({
                hidden: 'true',
                autoHeight: true,
                labelAlign: 'top',
                layout: 'form',
                items: [tfpuerto]
            });

            var chbssl = new Ext.form.Checkbox({
                boxLabel: perfil.etiquetas.lbSSL,
                name: 'chekssl',
                id: 'chekssl',
                padding: '0 0 10 0',
                margins: '0 0 0 0',
                height: 40,
                inputValue: true
            });

            var chbtsl = new Ext.form.Checkbox({
                boxLabel: perfil.etiquetas.lbTSL,
                name: 'chektsl',
                id: 'chektsl',
                style: 'padding: 10px',
                height: 40,
                inputValue: true
            });

            var fqdn = new Ext.form.TextField({
                id: 'fqdn',
                tabIndex: 2,
                maxLength: 100,
                fieldLabel: perfil.etiquetas.fqdn,
                allowBlank: false
            });

            var fqdnct = new Ext.Panel({
                hidden: 'true',
                autoHeight: true,
                labelAlign: 'top',
                layout: 'form',
                autoWidth: true,
                items: [fqdn]
            });

            var chbAgrupador = new Ext.form.CheckboxGroup({
                xtype: 'checkboxgroup',
                labelSeparator: '',
                id: 'chbgp',
                style: 'margins: 10px',
                columns: 2,
                vertical: true,
                items: [chbssl, chbtsl]
            });

            ////------------ RadioButton LDAP y OpenLDAP ------------////
            var chbldap = new Ext.form.Radio({
                hideLabel: 'true',
                tabIndex: 5,
                name: 'ldap',
                boxLabel: perfil.etiquetas.lbTitLDAP,
                id: 'ldap'
            });

            var chbopenldap = new Ext.form.Radio({
                hideLabel: 'true',
                tabIndex: 5,
                name: 'openldap',
                boxLabel: perfil.etiquetas.lbTitOpenLDAP,
                id: 'openldap',
                nextTab: 'puerto'
            });

            ////------------ Fieldset tipos de autenticación del formulario ------------////
            var fstiposaut = new Ext.form.FieldSet({
                title: perfil.etiquetas.lbTitTipoAuth,
                autoHeight: true,
                collapsed: false,
                hidden: 'true',
                anchor: '90%',
                id: 'fstiposaut',
                items: [chbldap, chbopenldap]
            });

            ////------------ FieldSet filtros del ldap  ------------------////-------------------------------------------------------------------------------
            /******************************************************************/

            //-------------- Combo para el nombre de las clases ldap -----------
            var datafiltronombre = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['givenname', 'givenname'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']

            ];


            var storeFiltronombre = new Ext.data.SimpleStore({
                fields: ['fnombre', 'denomin'],
                data: datafiltronombre
            });

            var cbNombre = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomin',
                enableQtip: true,
                autoScroll: true,
                id: 'cbNombre',
                name: 'cbNombre',
                valueField: 'fnombre',
                store: storeFiltronombre,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fnombre',
                triggerAction: 'all',
                editable: true,
                // style:'width:202px',
                minListWidth: 202,
                fieldLabel: "Filtro para nombre",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribNomb.length == 0) {
                            arregloAtribNomb.push(atrib);
                        }
                        else {
                            AgregarAtribNombre(atrib);
                        }
                    }
                }
            });

            //-------------- Combo para el apellido de las clases ldap -----------

            var datafiltroapellidos = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['givenname', 'givenname'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']
            ];

            var storeFiltroapellidos = new Ext.data.SimpleStore({
                fields: ['fapellidos', 'denomi'],
                data: datafiltroapellidos
            });

            var cbApellidos = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomi',
                enableQtip: true,
                autoScroll: true,
                id: 'cbApellidos',
                name: 'cbApellidos',
                valueField: 'fapellidos',
                store: storeFiltroapellidos,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fapellidos',
                triggerAction: 'all',
                editable: true,
                style: 'width:205px;margin-right:2px;',
                minListWidth: 205,
                fieldLabel: "Filtro para apellidos",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribApell.length == 0) {
                            arregloAtribApell.push(atrib);
                        }
                        else {
                            AgregarAtribApell(atrib);
                        }
                    }
                }
            });


            //-------------- Combo para el usuario de las clases ldap -----------

            var datafiltrousuario = [
                ['businessCategory', 'businessCategory'],
                ['c', 'c'],
                ['cn', 'cn'],
                ['dc', 'dc'],
                ['description', 'description'],
                ['destinationIndicator', 'destinationIndicator'],
                ['distinguishedName', 'distinguishedName'],
                ['dnQualifier', 'dnQualifier'],
                ['enhancedSearchGuide', 'enhancedSearchGuide'],
                ['facsimileTelephoneNumber', 'facsimileTelephoneNumber'],
                ['generationQualifier', 'generationQualifier'],
                ['givenName', 'givenName'],
                ['houseIdentifier', 'houseIdentifier'],
                ['initials', 'initials'],
                ['internationalISDNNumber', 'internationalISDNNumber'],
                ['l', 'l'],
                ['member', 'member'],
                ['name', 'name'],
                ['o', 'o'],
                ['ou', 'ou'],
                ['owner', 'owner'],
                ['physicalDeliveryOfficeName', 'physicalDeliveryOfficeName'],
                ['postalAddress', 'postalAddress'],
                ['postalCode', 'postalCode'],
                ['postOfficeBox', 'postOfficeBox'],
                ['preferredDeliveryMethod', 'preferredDeliveryMethod'],
                ['registeredAddress', 'registeredAddress'],
                ['roleOccupant', 'roleOccupant'],
                ['searchGuide', 'searchGuide'],
                ['seeAlso', 'seeAlso'],
                ['serialNumber', 'serialNumber'],
                ['sn', 'sn'],
                ['st', 'st'],
                ['street', 'street'],
                ['telephoneNumber', 'telephoneNumber'],
                ['teletexTerminalIdentifier', 'teletexTerminalIdentifier'],
                ['telexNumber', 'telexNumber'],
                ['title', 'title'],
                ['uid', 'uid'],
                ['uniqueMember', 'uniqueMember'],
                ['userPassword', 'userPassword'],
                ['x121Address', 'x121Address'],
                ['x500UniqueIdentifier', 'x500UniqueIdentifier']

            ];

            var storeFiltrousuario = new Ext.data.SimpleStore({
                fields: ['fusuario', 'denomi'],
                data: datafiltrousuario
            });

            var cbUsuario = new Ext.form.ComboBox({
                xtype: 'combo',
                displayField: 'denomi',
                enableQtip: true,
                autoScroll: true,
                id: 'cbUsuario',
                name: 'cbUsuario',
                valueField: 'fusuario',
                store: storeFiltrousuario,
                autoCreate: true,
                typeAhead: true,
                hiddenName: 'fusuario',
                triggerAction: 'all',
                editable: true,
                style: 'width:201px',
                minListWidth: 201,
                fieldLabel: "Filtro para usuario",
                mode: 'local',
                emptyText: "Seleccione",
                listeners: {
                    select: function (c, record) {
                        var atrib = record.data.atributo;
                        if (arregloAtribUsuario.length == 0) {
                            arregloAtribUsuario.push(atrib);
                        }
                        else {
                            AgregarAtribUsuario(atrib);
                        }
                    }
                }
            });


            ////************ FIN ITEMS DEL FORMULARIO ************////

            ////------------ Formulario ------------////
            this.formulario = new Ext.FormPanel({
                labelAlign: 'top',
                autoHeight: true,
                autoWidth: true,
                monitorValid: true,
                enableKeyEvents: true,
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        layout: 'column',
                        items: [
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbServidor,
                                        id: 'denominacion',
                                        nextTab: 'ip',
                                        tabIndex: 1,
                                        enableKeyEvents: true,
                                        allowBlank: false,
                                        vtype: 'vtalfanumericos',
                                        anchor: '90%'
                                    },
                                    fstiposaut,
                                    fqdnct
                                ]
                            },
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: perfil.etiquetas.lbDireccionIP,
                                        id: 'ip',
                                        nextTab: 'cbservidores',
                                        prevTab: 'denominacion',
                                        tabIndex: 2,
                                        allowBlank: false,
                                        blankText: perfil.etiquetas.lbMsgCReq,
                                        vtype: 'vtdominioip',
                                        enableKeyEvents: true,
                                        anchor: '90%'
                                    },
                                    new Ext.Panel({
                                        id: 'panel3',
                                        hidden: 'true',
                                        autoHeight: true,
                                        labelAlign: 'top',
                                        layout: 'form',
                                        autoWidth: true,
                                        items: [
                                            new Ext.form.TextField({
                                                id: 'basedn',
                                                tabIndex: 2,
                                                maxLength: 100,
                                                style: 'width: 225px;',
                                                fieldLabel: perfil.etiquetas.lbBaseDN,
                                                allowBlank: false
                                            })
                                        ]
                                    }),
                                    chbAgrupador
                                ]
                            },
                            {
                                columnWidth: .33,
                                layout: 'form',
                                items: [
                                    cbservidores,
                                    panelpuerto
                                ]
                            }
                        ]
                    },
                    new Ext.form.FieldSet({
                        title: 'Filtros de b&uacute;squeda',
                        autoHeight: true,
                        height: 200,
                        hidden: 'true',
                        style: 'margin',
                        id: 'fsfiltrosLdap',
                        items: [{
                            layout: 'column',
                            items: [{
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbUsuario
                                ]
                            }, {
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbNombre
                                ]
                            }, {
                                columnWidth: .33,
                                width: '33%',
                                layout: 'form',
                                items: [
                                    cbApellidos
                                ]
                            }]
                        }]

                    }),
                    {
                        layout: 'column',
                        items: [{
                            width: '100%',
                            layout: 'form',
                            items: [
                                new Ext.form.FieldSet({
                                    title: perfil.etiquetas.lbTitConexion,
                                    autoHeight: true,
                                    hidden: 'true',
                                    layout: 'column',
                                    id: 'fsusuario',
                                    items: [{
                                        layout: 'form',
                                        items: [
                                            tfusuario
                                        ]
                                    }, {
                                        layout: 'form',
                                        items: [
                                            tfpassword
                                        ]
                                    }]
                                })
                            ]
                        }]
                    },
                    {
                        xtype: 'textarea',
                        height: '20%',
                        fieldLabel: perfil.etiquetas.lbDescripcion,
                        id: 'descripcion',
                        nextTab: 'btnCancelar',
                        maxLength: 255,
                        anchor: '96%'
                    }
                ]
            });

            ////------------ Formulario para probar conexion ------------////
            this.formProbar = new Ext.FormPanel({
                labelAlign: 'left',
                autoHeight: true,
                autoWidth: true,
                id: '_this.formProbar',
                frame: true,
                bodyStyle: 'padding:5px 5px 0',
                items: [
                    {
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbUsuario,
                        id: 'usuario',
                        width: 120,
                        name: 'usuario',
                        allowBlank: false,
                        maxLength: 50,
                        anchor: '90%'
                    },
                    {
                        xtype: 'textfield',
                        fieldLabel: perfil.etiquetas.lbContrasena,
                        id: 'password',
                        width: 120,
                        inputType: 'password',
                        name: 'password',
                        maxLength: 30,
                        allowBlank: false,
                        anchor: '90%'
                    }
                ]
            });

            var winProbarCon = new Ext.Window({
                modal: true,
                closeAction: 'hide',
                layout: 'fit',
                title: perfil.etiquetas.lbConexion,
                width: 300,
                height: 250,
                resizable: false,
                autoHeight: true,
                shadow: false,
                items: [_this.formProbar],
                buttons: [
                    {
                        iconCls: 'cancelar',
                        text: perfil.etiquetas.lbBtnCancelar,
                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                        handler: function () {
                            winProbarCon.hide();
                            Ext.getCmp('passw').reset();
                            Ext.getCmp('usuario').reset();
                            Ext.getCmp('password').reset();
                        }
                    },
                    {
                        iconCls: 'aceptar',
                        text: 'Aceptar',
                        handler: function () {
                            if (_this.formProbar.getForm().isValid()) {
                                Secodena.mostrarMascara('maskConexion', perfil.etiquetas.msgWait, perfil.etiquetas.msgProbarConex);
                                var tmp = Ext.getCmp('passw');
                                var passTemp = tmp.getValue();
                                tmp.encryptedValue = encryptRSA(tmp.getValue());
                                tmp.setValue(tmp.encryptedValue);

                                _this.formulario.getForm().submit({
                                    url: arbolAcc.root.childNodes[2].attributes.controller + 'probarConexion',
                                    waitMsg: perfil.etiquetas.lbMsgProbandoS,
                                    params: {
                                        usuario: Ext.getCmp('usuario').getValue(),
                                        password: encryptRSA(Ext.getCmp('password').getValue())
                                    },
                                    failure: function (form, action) {
                                        Secodena.ocultarMascara('maskConexion');
                                        if (action.result.codMsg != 3 || action.result.codMsg != 4) {
                                            if (winInsServ != null) {
                                                if (winInsServ.isVisible()) {
                                                    Ext.getCmp('btnInsServAut').enable();
                                                    Ext.getCmp('btnInsServAutApli').enable();
                                                }
                                            } else if (winModServ != null) {
                                                if (winModServ.isVisible()) {
                                                    Ext.getCmp('btnAceptarMod').enable();
                                                    Ext.getCmp('passw').setValue(tmp);
                                                }
                                            }
                                            mostrarMensaje(action.result.codMsg, action.result.mensaje, function (btnPresionado) {
                                                if (btnPresionado == 'ok') {
                                                    winProbarCon.hide();
                                                    Ext.getCmp('usuario').reset();
                                                    Ext.getCmp('password').reset();
                                                }
                                            });
                                        }
                                        if (action.result.codMsg == 3 || action.result.codMsg == 4) {
                                            mostrarMensaje(action.result.codMsg, action.result.mensaje, function (btnPresionado) {
                                                if (btnPresionado == 'ok') {
                                                    winProbarCon.hide();
                                                    Ext.getCmp('usuario').reset();
                                                    Ext.getCmp('password').reset();
                                                    if (winInsServ != null) {
                                                        if (winInsServ.isVisible()) {
                                                            Ext.getCmp('passw').reset();
                                                            Ext.getCmp('passw').focus(200);
                                                            Ext.getCmp('probarConAdd').disable();
                                                            Ext.getCmp('btnInsServAut').disable();
                                                            Ext.getCmp('btnInsServAutApli').disable();
                                                        }
                                                    } else if (winModServ != null) {
                                                        if (winModServ.isVisible()) {
                                                            Ext.getCmp('passw').reset();
                                                            Ext.getCmp('passw').focus(200);
                                                            Ext.getCmp('probarConMod').disable();
                                                            Ext.getCmp('btnAceptarMod').disable();
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                        tmp.setValue(passTemp);
                                    }
                                });
                            } else
                                mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
                        }
                    }
                ]
            });

            UCID.portal.cargarAcciones(window.frameElement.id);

            ////------------ Evento para activar o desactivar fieldset tipos de autenticación ------------////
            cbservidores.on('select', function () {
                tipoAutenticacion((cbservidores.getValue()));
                if (tfpuerto.getValue() == '')
                    tfpuerto.setValue(389);
                if (cbservidores.getValue() == 'autenticaci&oacute;n')
                    Ext.getCmp('basedn').allowBlank = false;
                else
                    Ext.getCmp('basedn').allowBlank = true;
                if (cbservidores.getValue() == 'autenticaci&oacute;n') {
                    _this.btnProbarConexAdd.enable();
                    if (winInsServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnInsServAutApli').disable();
                        Ext.getCmp('btnInsServAut').disable();
                    } else if (winModServ != null && winModServ.isVisible()) {
                        Ext.getCmp('btnAceptarMod').disable();
                    }
                } else {
                    if (winInsServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnInsServAutApli').enable();
                        Ext.getCmp('btnInsServAut').enable();
                    } else if (winModServ != null && winInsServ.isVisible()) {
                        Ext.getCmp('btnAceptarMod').enable();
                    }
                }
            });

            cbservidores.on('change', function () {
                if (cbservidores.getValue() == 'autenticaci&oacute;n')
                    Ext.getCmp('basedn').allowBlank = false;
                else
                    Ext.getCmp('basedn').allowBlank = true;
            });

            ////------------ Evento para activar o desactivar fieldset usuario a través del radio OpenLDAP ------------////
            chbldap.on('check', function () {
                if (chbldap.getValue() == true) {
                    chbopenldap.setValue(!chbldap.getValue());
                    ldap = 'ldap';
                    openldap = '';
                    cbUsuario.reset();
                    cbUsuario.hide();
                    cbUsuario.disable();

                    cbNombre.reset();
                    cbNombre.hide();
                    cbNombre.disable();

                    cbApellidos.reset();
                    cbApellidos.hide();
                    cbApellidos.disable();
                    Ext.getCmp('fsfiltrosLdap').disable();
                    Ext.getCmp('fsfiltrosLdap').hide();
                }
            });

            chbopenldap.on('check', function () {
                if (chbopenldap.getValue() == true) {
                    chbldap.setValue(!chbopenldap.getValue());
                    openldap = 'openldap';
                    ldap = '';
                    Ext.getCmp('fsfiltrosLdap').enable();
                    Ext.getCmp('fsfiltrosLdap').show();
                    cbNombre.show();
                    cbApellidos.show();
                    cbUsuario.show();
                    cbNombre.enable();
                    cbApellidos.enable();
                    cbUsuario.enable();
                }
            });

            chbssl.on('check', function () {
                if (tfpuerto.getValue() != '636')
                    tfpuerto.setValue('636');
                else
                    tfpuerto.setValue('389');
            });

            this.items = _this.grid;
            this.keyMapGroup = true;
            this.tbar = [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, '->', _this.btnAyuda];

            Configuracion.Servidores.superclass.initComponent.call(this);

            ////------------ Funciones ------------////

            function closeWindow(valor) {
                panelpuerto.hide();
                chbAgrupador.hide();
                Ext.getCmp('panel3').hide();
                (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                (ventanaadicionar) ? _this.btnProbarConexAdd.disable() : _this.btnProbarConexMod.disable();
                if (valor == 1) {
                    winInsServ.hide();
                    Ext.getCmp('btnInsServAut').enable();
                    Ext.getCmp('btnInsServAutApli').enable();
                } else {
                    winModServ.hide();
                    Ext.getCmp('btnAceptarMod').enable();
                }
            }

            function winFormServ(opcion) {
                switch (opcion) {
                    case 'Ins': {
                        ventanaadicionar = true;
                        if (!winInsServ) {

                            winInsServ = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinAdicionarS,
                                width: 800,
                                height: 400,
                                resizable: false,
                                x: 312,
                                y: 50,
                                autoHeight: true,
                                shadow: false,
                                listeners: {
                                    show: function () {
                                        Ext.getCmp('chekssl').container.dom.style.width = '100%';
                                        Ext.getCmp('chektsl').container.dom.style.width = '100%';
                                    },
                                    hide: function () {
                                        _this.getTopToolbar().items.items[0].focus();
                                    }
                                },
                                buttons: [
                                    _this.btnProbarConexAdd,
                                    {
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        handler: function () {
                                            closeWindow(1);
                                        }
                                    }, {
                                        iconCls: 'aplicar',
                                        id: 'btnInsServAutApli',
                                        text: perfil.etiquetas.lbBtnAplicar,
                                        tooltip: perfil.etiquetas.tooltipAplicarVen,
                                        handler: function () {
                                            adicionarservidor('apl');
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        nextTab: 'denominacion',
                                        id: 'btnInsServAut',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            adicionarservidor();
                                        }
                                    }]
                            });


                        }
                        panelpuerto.hide();
                        chbAgrupador.hide();
                        Ext.getCmp('panel3').hide();
                        _this.btnProbarConexAdd.hide();
                        _this.btnProbarConexAdd.disable();
                        Ext.getCmp('fsusuario').hide();
                        if (_this.formulario)
                            _this.formulario.getForm().reset();
                        fstiposaut.hide();
                        Ext.getCmp('fsfiltrosLdap').hide();
                        cbNombre.hide();
                        cbApellidos.hide();
                        cbUsuario.hide();
                        fqdnct.hide();
                        winInsServ.add(_this.formulario);
                        winInsServ.doLayout();
                        winInsServ.show();

                    }
                        break;
                    case 'Mod': {
                        ventanaadicionar = false;
                        if (!winModServ) {
                            winModServ = new Ext.Window({
                                modal: true,
                                closeAction: 'hide',
                                layout: 'fit',
                                title: perfil.etiquetas.lbWinModificarS,
                                width: 800,
                                height: 400,
                                x: 312,
                                y: 50,
                                resizable: false,
                                autoHeight: true,
                                shadow: false,
                                listeners: {
                                    show: function () {
                                        Ext.getCmp('chekssl').container.dom.style.width = '100%';
                                        Ext.getCmp('chektsl').container.dom.style.width = '100%';
                                    },
                                    hide: function () {
                                        _this.getTopToolbar().items.items[1].focus();
                                    }
                                },
                                buttons: [
                                    _this.btnProbarConexMod,
                                    {
                                        tooltip: perfil.etiquetas.tooltipCancelarVen,
                                        iconCls: 'cancelar',
                                        id: 'btnCancelar',
                                        text: perfil.etiquetas.lbBtnCancelar,
                                        handler: function () {
                                            closeWindow(0);
                                        }
                                    }, {
                                        iconCls: 'aceptar',
                                        id: 'btnAceptarMod',
                                        nextTab: 'denominacion',
                                        text: perfil.etiquetas.lbBtnAceptar,
                                        tooltip: perfil.etiquetas.tooltipAceptarVen,
                                        handler: function () {
                                            modificarservidor();
                                        }
                                    }]
                            });
                            _this.formulario.getForm().reset();
                        }
                        else {
                            _this.formulario.getForm().reset();
                        }

                        winModServ.add(_this.formulario);
                        winModServ.doLayout();
                        winModServ.show();
                        if (_this.sm.getSelected().data.tiposervidor == 'autenticaci&oacute;n') {
                            Ext.getCmp(_this.sm.getSelected().data.typeserverauth).setValue(true);
                            if (_this.sm.getSelected().data.chekssl == true)
                                chbssl.setValue(true);
                            if (_this.sm.getSelected().data.chektsl == true)
                                chbtsl.setValue(true);
                            tipoAutenticacion('autenticaci&oacute;n');
                            Ext.getCmp('basedn').allowBlank = false;
                        } else if (_this.sm.getSelected().data.tiposervidor == 'email' || _this.sm.getSelected().data.tiposervidor == 'xmpp') {
                            if (_this.sm.getSelected().data.chekssl == true)
                                chbssl.setValue(true);
                            if (_this.sm.getSelected().data.chektsl == true)
                                chbtsl.setValue(true);
                            //if (_this.sm.getSelected().data.fqdn != null)
                            //    fqdn.setValue(_this.sm.getSelected().data.fqdn);
                            tipoAutenticacion();
                        } else {
                            tipoAutenticacion('bd');
                            Ext.getCmp('basedn').allowBlank = true;
                        }
                        _this.formulario.getForm().loadRecord(_this.sm.getSelected())
                    }
                        break;
                }
            }

            function tipoAutenticacion(tiposerv) {
                if (tiposerv == 'autenticaci&oacute;n') {
                    if (!chbldap.getValue() && !chbopenldap.getValue())
                        chbldap.setValue(true);
                    tfpassword.show();
                    fstiposaut.show();
                    Ext.getCmp('fsusuario').show();
                    tfusuario.show();
                    panelpuerto.show();
                    chbAgrupador.show();
                    Ext.getCmp('panel3').show();
                    (ventanaadicionar) ? _this.btnProbarConexAdd.show() : _this.btnProbarConexMod.show();
                    (ventanaadicionar) ? _this.btnProbarConexAdd.disable() : _this.btnProbarConexMod.disable();
                    Ext.getCmp('fsusuario').enable();
                    fstiposaut.enable();
                    tfusuario.enable();
                    tfpuerto.allowBlank = false;
                    basedn.allowBlank = false;
                    fqdnct.hide();
                    fqdn.allowBlank = true;
                    tfpassword.enable();
                } else if (tiposerv == 'bd') {
                    chbldap.setValue(false);
                    chbopenldap.setValue(false);
                    Ext.getCmp('fsusuario').hide();
                    panelpuerto.hide();
                    fstiposaut.hide();
                    Ext.getCmp('fsfiltrosLdap').hide();
                    cbNombre.hide();
                    cbApellidos.hide();
                    cbUsuario.hide();
                    tfusuario.hide();
                    chbAgrupador.hide();
                    Ext.getCmp('panel3').hide();
                    basedn.allowBlank = true;
                    (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                    Ext.getCmp('fsusuario').disable();
                    tfpassword.disable();
                    fstiposaut.disable();
                    Ext.getCmp('fsfiltrosLdap').disable();
                    cbNombre.disable();
                    cbApellidos.disable();
                    cbUsuario.disable();
                    tfusuario.disable();
                    tfpuerto.allowBlank = true;
                    tfusuario.allowBlank = true;
                    fqdnct.hide();
                    fqdn.allowBlank = true;
                } else {
                    (ventanaadicionar) ? _this.btnProbarConexAdd.hide() : _this.btnProbarConexMod.hide();
                    fqdnct.show();
                    fqdn.allowBlank = false;
                    tfpassword.show();
                    tfpassword.enable();
                    Ext.getCmp('fsusuario').show();
                    tfusuario.show();
                    panelpuerto.show();
                    chbAgrupador.show();
                    Ext.getCmp('fsusuario').enable();
                    fstiposaut.disable();
                    fstiposaut.hide();
                    tfusuario.enable();
                    tfpuerto.allowBlank = false;
                    basedn.allowBlank = true;
                    Ext.getCmp('panel3').hide();
                    Ext.getCmp('fsfiltrosLdap').hide();
                }
            }

            function adicionarservidor(apl) {
                if (_this.formulario.getForm().isValid()) {
                    var tmp = Ext.getCmp('passw');
                    var passTemp = tmp.getValue();
                    tmp.encryptedValue = encryptRSA(tmp.getValue());
                    tmp.setValue(tmp.encryptedValue);
                    Secodena.mostrarMascara('maskServidor', perfil.etiquetas.msgWait, perfil.etiquetas.msgAdd);
                    if (cbservidores.getValue() == 'bd') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'insertarserv',
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskServidor');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    if (!apl)
                                        winInsServ.hide();
                                    _this.formulario.getForm().reset();
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);

                                tmp.setValue(passTemp);
                            }
                        });
                    } else if (chbopenldap.checked) {
                        enviarFormularioAdd(apl);
                    } else if (chbldap.checked) {
                        enviarFormularioAdd(apl);
                    } else if (cbservidores.getValue() == 'email' || cbservidores.getValue() == 'xmpp') {
                        enviarFormularioAdd(apl);
                    }
                    else
                        mostrarMensaje(3, perfil.etiquetas.msgInformacionServidor);
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function enviarFormularioAdd(apl) {
                _this.formulario.getForm().submit({
                    params: {
                        ldap: ldap
                    },
                    url: arbolAcc.root.childNodes[2].attributes.controller + 'insertarserv',
                    failure: function (form, action) {
                        Secodena.ocultarMascara('maskServidor');
                        if (action.result.codMsg != 3) {
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            if (!apl)
                                winInsServ.hide();
                            _this.formulario.getForm().reset();
                            _this.store.reload();
                            _this.sm.clearSelections();
                            _this.btnModificar.disable();
                            _this.btnEliminar.disable();
                            chbldap.setValue(true);
                            _this.btnProbarConexAdd.disable();
                        }
                        if (action.result.codMsg == 3)
                            mostrarMensaje(action.result.codMsg, action.result.mensaje);
                    }
                });
            }

            function modificarservidor() {
                if (_this.formulario.getForm().isValid()) {

                    var tmp = Ext.getCmp('passw');
                    var passTemp = tmp.getValue();
                    tmp.encryptedValue = encryptRSA(tmp.getValue());
                    tmp.setValue(tmp.encryptedValue);
                    Secodena.mostrarMascara('maskservidorMod', perfil.etiquetas.msgWait, perfil.etiquetas.msgMod);
                    if (cbservidores.getValue() == 'bd') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (cbservidores.getValue() == 'email' || cbservidores.getValue() == 'xmpp') {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (chbldap.checked) {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    winModServ.hide();
                                    _this.formulario.getForm().reset();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    } else if (chbopenldap.checked) {
                        _this.formulario.getForm().submit({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'modificarserv',
                            params: {
                                idservidor: _this.sm.getSelected().data.idservidor
                            },
                            failure: function (form, action) {
                                Secodena.ocultarMascara('maskservidorMod');
                                if (action.result.codMsg != 3) {
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                                    _this.store.reload();
                                    _this.formulario.getForm().reset();
                                    winModServ.hide();
                                }
                                if (action.result.codMsg == 3)
                                    mostrarMensaje(action.result.codMsg, action.result.mensaje);
                            }
                        });
                    }
                }
                else
                    mostrarMensaje(3, perfil.etiquetas.lbMsgErrorEnCamops);
            }

            function eliminarservidor() {
                var arrServElim = _this.sm.getSelections();
                var arrayServElim = [];
                for (var i = 0; i < arrServElim.length; i++)
                    arrayServElim.push(arrServElim[i].data.idservidor);
                mostrarMensaje(2, perfil.etiquetas.lbMsgFunEliminarMsgS, elimina);

                function elimina(btnPresionado) {
                    if (btnPresionado == 'ok') {
                        Secodena.mostrarMascara('maskservidorDel', perfil.etiquetas.msgWait, perfil.etiquetas.msgDEL);
                        Ext.Ajax.request({
                            url: arbolAcc.root.childNodes[2].attributes.controller + 'comprobarservidor',
                            method: 'POST',
                            params: {
                                arrayServ: Ext.encode(arrayServElim)
                            },
                            callback: function (options, success, response) {
                                Secodena.ocultarMascara('maskservidorDel');
                                responseData = Ext.decode(response.responseText);
                                if (responseData.tiene == 1)
                                    mostrarMensaje(2, perfil.etiquetas.lbMsgEliminarGA, elimina1);
                                if (responseData.codMsg == 1) {
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                                    _this.store.reload();
                                    _this.sm.clearSelections();
                                    _this.btnModificar.disable();
                                    _this.btnEliminar.disable();
                                }
                                if (responseData.codMsg == 3)
                                    mostrarMensaje(responseData.codMsg, responseData.mensaje);
                            }
                        });
                    }
                    if (btnPresionado != 'ok')
                        _this.btnEliminar.focus()
                }
            }

            function cargarAyuda() {
                help.show('Ayuda de servidores', 'seguridad/gestservidor');
            }

            function encryptRSA(text) {
                var key = RSA.getPublicKey(document.getElementById('publicKey').value);
                return RSA.encrypt(text, key);
            }

            function AgregarAtribNombre(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribNomb.length; i++) {
                    if (atrib == arregloAtribNomb[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribNomb.push(atrib);
                }
            }

            function AgregarAtribApell(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribApell.length; i++) {
                    if (atrib == arregloAtribApell[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribApell.push(atrib);
                }
            }

            function AgregarAtribUsuario(atrib) {
                var encuentra = false;
                for (var i = 0; i < arregloAtribUsuario.length; i++) {
                    if (atrib == arregloAtribUsuario[i]) {
                        encuentra = true;
                    }
                }
                if (!encuentra) {
                    arregloAtribUsuario.push(atrib);
                }
            }

        }
    }
);

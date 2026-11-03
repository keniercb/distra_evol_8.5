/**
 * Componente buscar personas en el SUIN
 *
 * @author Ing. Javier Rodriguez Lopez
 * @version 1.0
 * @type {Ext.Window}
 */

Ext.ns('Ext.Persona');
/**
 * Ventana para buscar personas
 * @type {Window}
 */



Ext.Persona.BuscadorSUIN = Ext.extend(Ext.Window, {
    title: 'Buscar persona en el SUIN',
    layout: 'border',
    closeAction: 'hide',
    modal: true,
    width: '60%',
    height: 450,
    data: 1, //datos y foto: 1, solo los datos: 2
    initComponent: function () {
        /**
         * Boton para configurar los parametros de conexion al SUIN
         * @type {Button}
         */
        this.btnConfig = new Ext.Button({
            id: 'btnConfig',
            iconCls: 'configuracion',
            text: 'Configuraci&oacute;n',
            tooltip: 'Configurar conexi&oacute;n al servidor SUIN',
            hidden: true,
            disabled: true,
            handler: this.showWinConfig
        });

        /**
         * Boton cancelar de la ventana
         * @type {Button}
         */
        this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin seleccionar datos <b>(ALt+X)</b>',
            handler: function () {
                this.hide();
            }.createDelegate(this)
        });

        /**
         * Boton aceptar de la ventana
         * @type {Button}
         */
        this.btnAcept = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Selecciona la persona y cierra ventana <b>(Enter)</b>',
            handler: function () {
                if (this.grid.getSelectionModel().hasSelection()) {
                    this.returnPerson(this.sm.getSelected());
                    this.hide();
                }
                else {
                    Ext.MessageBox.show({
                        title: 'Informaci&oacute;n',
                        msg: 'Debe seleccionar una persona.',
                        buttons: Ext.MessageBox.OK
                    });
                }
            }.createDelegate(this)
        });

        this.store = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscadorsuin/buscarpersona',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpers',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idpersona'
                }, {
                    name: 'idsuin'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'snombre'
                },
                {
                    name: 'papel'
                },
                {
                    name: 'sapel'
                },
                {
                    name: 'sexo'
                },
                {
                    name: 'nompa'
                },
                {
                    name: 'nomma'
                },
                {
                    name: 'tomo'
                },
                {
                    name: 'folio'
                },
                {
                    name: 'fechanacimiento'
                },
                {
                    name: 'idcolorpiel'
                },
                {
                    name: 'idcolorojos'
                },
                {
                    name: 'idcolorpelo'
                },
                {
                    name: 'estatura'
                },
                {
                    name: 'peso'
                }, {
                    name: 'annoregistrocivil'
                }, {
                    name: 'decas'
                }, {
                    name: 'idcondicionmigratoria'
                }, {
                    name: 'idregistrocivil'
                }, {
                    name: 'idpaisnac'
                }, {
                    name: 'idprovincianac'
                }, {
                    name: 'idmunicipionac'
                }, {
                    name: 'idprovinciares'
                }, {
                    name: 'idmunicipiores'
                }, {
                    name: 'direccion'
                }, {
                    name: 'fechares'
                }, {
                    name: 'denominacion'
                }, {
                    name: 'idtipodocidentidad'
                }, {
                    name: 'registrocivil'
                }, {
                    name: 'foto'
                }, {
                    name: 'nombreapellidos'
                }
            ]),

            listeners: {
                load: function (st, records, options) {
                    this.sm.selectFirstRow();
                    //Pregunta si la cantidad devuelta es 1 y la busqueda se realizo por el carnet de identidad
                    if (st.getCount() == 1 /*&& st.baseParams.numid*/) {
                        //Retorna la persona
                        this.returnPerson(this.sm.getSelected());
                    }
                }.createDelegate(this),
                beforeload: function () {
                    if (this.isValidSearchForm()) {
                        return true;
                    }
                    return false;
                }.createDelegate(this)
            }
        });

        /**
         * ColumnModel del listado de personas
         * @type {Array}
         */
        this.columns = [new Ext.grid.RowNumberer(),
            {
                header: 'No. de identidad',
                dataIndex: 'numid',
                width: 100
            },
            {
                header: 'Nombre',
                dataIndex: 'nombre',
                width: 120
            }, {
                header: 'Segundo nombre',
                dataIndex: 'snombre',
                width: 120
            },
            {
                header: 'Primer apellido',
                dataIndex: 'papel',
                width: 120
            },
            {
                header: 'Segundo apellido',
                dataIndex: 'sapel',
                width: 120
            },
            {
                header: 'Nombre del padre',
                dataIndex: 'nompa',
                width: 140
            },
            {
                header: 'Nombre del madre',
                dataIndex: 'nomma',
                width: 140
            }
        ];

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        /**
         * Mustra el listado de personas encontradas
         * @type {EditorGridPanel}
         */
        this.grid = new Ext.grid.GridPanel({
            title: 'Listado de personas del SUIN',
            store: this.store,
            columns: this.columns,
            sm: this.sm,
            bbar: new Ext.PagingToolbar({
                pageSize: 30,
                store: this.store,
                displayInfo: true
            }),
            region: 'center',
            loadMask: 'Cargando...',
            margins: '0 5 5 5'
        });

        /**
         * Campo de busqueda por no. identidad
         * @type {TextField}
         */
        this.tfNumid = new Ext.form.TextField({
            id: 'tfNumid' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'No. de identidad',
            allowBlank: true,
            maxLength: 11,
            minLength: 1,
            maskRe: /^([0-9\d]+ ?[0-9\d]*)+$/,
            regex: /^([0-9\d]+ ?[0-9\d]*)+$/,
            anchor: '95%',
            name: 'numid',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por nombre
         * @type {TextField}
         */
        this.tfNombre = new Ext.form.TextField({
            id: 'tfNombre' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Nombre',
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            anchor: '95%',
            name: 'nombre',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por primer apellido
         * @type {TextField}
         */
        this.tfPapel = new Ext.form.TextField({
            id: 'tfPapel' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Primer apellido',
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            anchor: '95%',
            name: 'papel',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por segundo apellido
         * @type {TextField}
         */
        this.tfSapel = new Ext.form.TextField({
            id: 'tfSapel' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Segundo apellido',
            allowBlank: true,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            anchor: '95%',
            name: 'sapel',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });
        
        this.validarCI = function(IDENTID) {
            //Validar número
            var reg = /^\d\d\d\d\d\d\d\d\d\d\d$/;
            if (!reg.test(IDENTID))
                return false;

            var FECHAV = IDENTID.substr(0, 6);
            var SIGLO = IDENTID.substr(6, 1);

            if (SIGLO <= 5) {
                FECHAV = "19" + FECHAV;
            }
            else if (SIGLO == 9) {
                FECHAV = "18" + FECHAV;
            }
            else {
                FECHAV = "20" + FECHAV;
            }
            var d = new Date();

            var year = parseInt(FECHAV.substr(0, 4), 10);
            var month = parseInt(FECHAV.substr(4, 2), 10) - 1;
            var day = parseInt(FECHAV.substr(6, 2), 10);
            if (year < 1800 || year > 2100 || month < 0 || month > 11 || day < 0 || day > 31)
                return false;

            d.setFullYear(year);
            d.setMonth(month, day);
            FECHAV = d;

            var TODAY = new Date();
            if (FECHAV > TODAY)
                return false;

            var ID = (IDENTID.charAt(0) * 2) + (IDENTID.charAt(1) * 1) + (IDENTID.charAt(2) * 9) + (IDENTID.charAt(3) * 8) + (IDENTID.charAt(4) * 7) + (IDENTID.charAt(5) * 6) + (IDENTID.charAt(6) * 5) + (IDENTID.charAt(7) * 4) + (IDENTID.charAt(8) * 3) + (IDENTID.charAt(9) * 2);
            ID = (10 - (ID % 10)) % 10;
            if (ID != IDENTID.charAt(10))
                return false;
            return true;
        };

        /**
         * Boton buscar del formulario
         * @type {Button}
         */
        this.btnSearch = new Ext.Button({
            iconCls: 'buscar',
            enableKeyEvents: true,
            text: 'Buscar',
            tooltip: 'Buscar persona <b>(Alt+B)</b>',
            handler: function () {
                this.store.removeAll();
                var values = this.searchForm.getForm().getValues();
                if (values.rb_minit == 1) {
                    if (this.isValidSearchForm()) {
                        
                        var civalido = this.validarCI(this.tfNumid.getValue());
                        if (!civalido) {
                            mostrarMensaje('6', 'El No. de identidad no es válido. Rectifíquelo y reintente la búsqueda.');
                            return;
                        }
                        
                        this.store.baseParams.numid = this.tfNumid.getValue();
                        this.store.baseParams.nombre = this.tfNombre.getValue();
                        this.store.baseParams.papel = this.tfPapel.getValue();
                        this.store.baseParams.sapel = this.tfSapel.getValue();
                        this.store.baseParams.selector = values.rb_minit;
                        this.store.baseParams.data = this.data;
                        this.store.load({
                            callback: function (rec, opt, success) {
                                if (success == false) {
                                    mostrarMensaje('3', 'El servicio no esta disponible. Por favor intente mas tarde.')
                                }else if (rec.length == 0) {
                                    mostrarMensaje('3', 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                }
                                // if (rec.length == 0) {
                                //     mostrarMensaje('3', 'El servicio no esta disponible. Por favor intente mas tarde.')
                                // }
                            }
                        });
                    }
                } else {
                    if (this.isValidSearchForm()) {
                        var cantidadCriterios = 0;
                        var peso = 0;

                        if (this.tfNumid.getValue() != '') {
                            peso = peso + this.tfNumid.getValue().length * 10;
                            cantidadCriterios++;
                        }
                        if (this.tfNombre.getValue() != '') {
                            peso = peso + this.tfNombre.getValue().length * 7;
                            cantidadCriterios++;
                        }
                        if (this.tfPapel.getValue() != '') {
                            peso = peso + this.tfPapel.getValue().length * 7;
                            cantidadCriterios++;
                        }
                        if (this.tfSapel.getValue() != '') {
                            peso = peso + this.tfSapel.getValue().length * 7;
                            cantidadCriterios++;
                        }
                        //Compruebo que los campos no esten vacios
                        if (this.tfNumid.getValue().length < 9) {
                            if (cantidadCriterios < 3) {
                                mostrarMensaje(3, 'Debe seleccionar como m&iacute;nimo 3 criterios de b&uacute;squeda.');
                                return;
                            }

                            if (peso < 75) {
                                mostrarMensaje(3, 'Los criterios de b&uacute;squeda son insuficientes.');
                                return;
                            }
                        }
                        this.store.baseParams.limit = 20;
                        this.store.baseParams.start = 0;
                        this.store.baseParams.numid = this.tfNumid.getValue();
                        this.store.baseParams.nombre = this.tfNombre.getValue();
                        this.store.baseParams.papel = this.tfPapel.getValue();
                        this.store.baseParams.sapel = this.tfSapel.getValue();
                        this.store.baseParams.selector = values.rb_minit;
                        this.store.load({
                            callback: function (rec, opt, success) {
                                // if (rec.length == 0) {
                                //     mostrarMensaje('3', 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                // }
                                if (success == false) {
                                    mostrarMensaje('3', 'El servicio no esta disponible. Por favor intente mas tarde.')
                                }else if (rec.length == 0) {
                                    mostrarMensaje('3', 'No existen datos que se correspondan con los criterios de búsqueda especificados.');
                                }
                            }
                        });
                    }
                }

            }.createDelegate(this)
        });

        /**
         * Boton limpiar del formulario
         * @type {Button}
         */
        this.btnClear = new Ext.Button({
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s) <b>(Alt+L)</b>',
            handler: function () {
                this.searchForm.getForm().reset();
                this.store.removeAll();
            }.createDelegate(this)
        });

        /**
         * Formulario de busqueda de personas
         * @type {FormPanel}
         */
        this.searchForm = new Ext.FormPanel({
            cls: 'x-toolbar',
            labelAlign: 'top',
            frame: true,
            region: 'north',
            layout: 'form',
            width: '100%',
            height: 120,
            margins: '5 5 5 5',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfNumid]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfNombre]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfPapel]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfSapel]
                        },
                        {
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [this.btnSearch]
                        },
                        {
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [this.btnClear]
                        }
                    ]
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: 'Tipo de conexión',
                    columns: [150, 150],
                    vertical: true,
                    items: [
                        {boxLabel: 'Servicio Web', name: 'rb_minit', inputValue: 1,disabled:false, checked: true},
                        {boxLabel: 'Base de datos', name: 'rb_minit', inputValue: 2/*, checked: true*/},
                    ]
                }
            ]
        });

        /**
         * Teclas calientes de la ventana
         * @type {Array}
         */
        this.keys = [
            {
                key: 'b',
                alt: true,
                scope: this,
                fn: function () {
                    this.btnSearch.handler();
                }.createDelegate(this)
            },
            {
                key: 'l',
                alt: true,
                scope: this,
                fn: function () {
                    this.btnClear.handler();
                }.createDelegate(this)
            }, {
                key: 13,
                alt: true,
                scope: this,
                fn: function () {
                    this.btnAcept.handler();
                }.createDelegate(this)
            }, {
                key: 'x',
                alt: true,
                scope: this,
                fn: function () {
                    this.btnCancel.handler();
                }.createDelegate(this)
            },
        ];

        this.items = [this.searchForm, this.grid];
        this.buttons = [this.btnConfig, this.btnCancel, this.btnAcept];
        Ext.Persona.BuscadorSUIN.superclass.initComponent.call(this);

        this.on('show', function (cmp) {
            this.searchForm.getForm().reset();
            this.store.removeAll();
            this.tfNumid.focus(false, 300);
        }, this);

        this.grid.on('rowdblclick', function (g, rowIndex, e) {
            this.returnPerson(this.store.getAt(rowIndex));
        }, this);

        /**
         * Valida que los datos de busqueda son correctos
         * @returns {boolean}
         */
        this.isValidSearchForm = function () {
            if (this.searchForm.getForm().isValid()) {
                if (this.tfNumid.getValue() == '' && this.tfNombre.getValue() == '' && this.tfPapel.getValue() == '' && this.tfSapel.getValue() == '') {
                    Ext.MessageBox.show({
                        title: 'Informaci&oacute;n',
                        msg: 'Debe especificar alg&uacute;n criterio de b&uacute;squeda.',
                        buttons: Ext.MessageBox.OK
                    });
                    this.store.removeAll();
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }.createDelegate(this);
    },
    showWinConfig: function () {
        new Ext.Persona.WinGestConfig().show();
    },
    returnPerson: function (record) {
        this.fireEvent('rowselect', record);
        this.hide();
    }
});

/**
 * Ventana para modificar la conexion al servidor SUIN
 * @type {*}
 */
Ext.Persona.WinGestConfig = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    plain: true,
    title: 'Configurar conexi&oacute;n al servidor SUIN',
    initComponent: function () {

        /**
         * Boton cancelar del formulario de configuracion
         * @type {Button}
         */
        this.btnCancel = new Ext.Button({
            iconCls: 'cancelar',
            //icon: perfil.dirImg + 'cancelar.png',
            text: 'Cancelar',
            handler: function () {
                this.close();
            }.createDelegate(this)
        });

        /**
         * Boton para guardar los parametros de conexion
         * @type {Button}
         */
        this.btnAcept = new Ext.Button({
            iconCls: 'aceptar',
            text: 'Aceptar',
            handler: function () {
                if (this.form.getForm().isValid()) {
                    PVD.mostrarMascara('msksavecon', 'Por favor espere…', 'Guardando datos de la configuración');
                    Ext.Ajax.request({
                        url: '/pvd/comun/index.php/buscadorsuin/saveConection',
                        params: this.form.getForm().getValues(),
                        callback: function (options, success, response) {
                            PVD.ocultarMascara('msksavecon');
                            mostrarMensaje(1, 'Los par&aacute;metros de conexi&oacute;n han sido guardados satisfacoriamente.');
                            this.close();
                        }.createDelegate(this)
                    });
                }
            }.createDelegate(this)
        });

        this.server = new Ext.form.TextField({
            fieldLabel: 'Servidor',
            name: 'server',
            id: 'server',
            allowBlank: false,
            maxLength: 15
        });

        this.port = new Ext.form.NumberField({
            fieldLabel: 'Puerto',
            name: 'port',
            allowBlank: false,
            allowNegative: false,
            allowDecimals: false,
            maxLength: 4,
            value: 5432
        });

        this.user = new Ext.form.TextField({
            fieldLabel: 'Usuario',
            name: 'user',
            allowBlank: false,
            maxLength: 100
        });

        this.pass = new Ext.form.TextField({
            fieldLabel: 'Contrase&ntilde;a',
            name: 'pass',
            allowBlank: false,
            maxLength: 100,
            inputType: 'password'
        });

        this.db = new Ext.form.TextField({
            fieldLabel: 'Base de datos',
            name: 'db',
            allowBlank: false,
            maxLength: 100
        });

        this.form = new Ext.form.FormPanel({
            labelWidth: 85,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            defaults: {width: 220},
            items: [
                this.server,
                this.port,
                this.user,
                this.pass,
                this.db
            ],
            buttons: [
                {
                    text: 'Comprobar conexi&oacute;n',
                    iconCls: 'validar',
                    handler: function () {
                        if (this.form.getForm().isValid()) {
                            PVD.mostrarMascara('checkcon', "Por favor espere…", "Comprobando conexi&oacute;n");
                            Ext.Ajax.request({
                                url: '/pvd/comun/index.php/buscadorsuin/checkConection',
                                method: 'POST',
                                params: this.form.getForm().getValues(),
                                callback: function (options, success, response) {
                                    PVD.ocultarMascara('checkcon');
                                    var responseData = Ext.decode(response.responseText);
                                    if (responseData.success) {
                                        mostrarMensaje(1, 'Conexión satisfactoria.');
                                    }
                                    else {
                                        var exceptionMsg = responseData.msg || '';
                                        mostrarMensaje(3, 'No se pudo conectar al servidor.</br>' + exceptionMsg);
                                    }
                                }
                            });
                        }
                    }.createDelegate(this)
                }
            ]
        });
        this.items = [this.form];
        this.buttons = [this.btnCancel, this.btnAcept];
        Ext.Persona.WinGestConfig.superclass.initComponent.call(this);

        this.on('show', function (cmp) {
            PVD.mostrarMascara('loadparams', 'Por favor espere…', 'Cargando par&aacute;metros de conexión');
            Ext.Ajax.request({
                url: '/pvd/comun/index.php/buscadorsuin/getParamConection',
                callback: function (options, success, response) {
                    PVD.ocultarMascara('loadparams');
                    var values = Ext.decode(response.responseText);
                    this.form.getForm().setValues(values);
                    this.server.focus(false, 300);
                }.createDelegate(this)
            });
        }, this);
    }
});


Ext.Persona.pBuscadorSUIN = Ext.extend(Ext.Panel, {
    title: 'Buscar persona en el SUIN',
    layout: 'border',
    width: '100%',
    initComponent: function () {
        this.store = new Ext.data.Store({
            url: '/pvd/comun/index.php/buscadorsuin/buscarpersona',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idpers',
                totalProperty: 'cantidad'
            }, [
                {
                    name: 'idpers'
                },
                {
                    name: 'numid'
                },
                {
                    name: 'nombre'
                },
                {
                    name: 'snombre'
                },
                {
                    name: 'papel'
                },
                {
                    name: 'sapel'
                },
                {
                    name: 'sexo'
                },
                {
                    name: 'nompa'
                },
                {
                    name: 'nomma'
                },
                {
                    name: 'fechanacimiento'
                },
                {
                    name: 'idcolorpiel'
                },
                {
                    name: 'idcolorojos'
                },
                {
                    name: 'idcolorpelo'
                },
                {
                    name: 'estatura'
                },
                {
                    name: 'peso'
                }, {
                    name: 'tomo'
                }, {
                    name: 'folio'
                }, {
                    name: 'annoregistrocivil'
                }, {
                    name: 'huella'
                }, {
                    name: 'idcondicionmigratoria'
                }, {
                    name: 'idregistrocivil'
                }, {
                    name: 'idpaisnac'
                }, {
                    name: 'idprovincianac'
                }, {
                    name: 'idmunicipionac'
                }, {
                    name: 'idprovinciares'
                }, {
                    name: 'idmunicipiores'
                }, {
                    name: 'direccion'
                }, {
                    name: 'fechares'
                }, {
                    name: 'paisprovmuni'
                }, {
                    name: 'provmunicres'
                }, {
                    name: 'registrocivil'
                }, {
                    name: 'talla'
                }, {
                    name: 'colorojos'
                }, {
                    name: 'colorpelo'
                }, {
                    name: 'colorpiel'
                }, {
                    name: 'foto'
                }, {
                    name: 'nombreapellidos'
                }

            ]),
            listeners: {
                load: function (st, records, options) {
                    this.sm.selectFirstRow();
                    //Pregunta si la cantidad devuelta es 1 y la busqueda se realizo por el carnet de identidad
                    if (st.getCount() == 1 /*&& st.baseParams.numid*/) {
                        //Retorna la persona
                        this.returnPerson(this.sm.getSelected());
                    }
                }.createDelegate(this),
                beforeload: function () {
                    if (this.isValidSearchForm()) {
                        return true;
                    }
                    return false;

                }.createDelegate(this)
            }
        });

        /**
         * ColumnModel del listado de personas
         * @type {Array}
         */
        this.columns = [new Ext.grid.RowNumberer(),
            {
                header: 'No. de identidad',
                dataIndex: 'numid',
                width: 100
            },
            {
                header: 'Nombre',
                dataIndex: 'nombre',
                width: 120
            }, {
                header: 'Segundo nombre',
                dataIndex: 'snombre',
                width: 120
            },
            {
                header: 'Primer apellido',
                dataIndex: 'papel',
                width: 120
            },
            {
                header: 'Segundo apellido',
                dataIndex: 'sapel',
                width: 120
            },
            {
                header: 'Nombre del padre',
                dataIndex: 'nompa',
                width: 140
            },
            {
                header: 'Nombre de la madre',
                dataIndex: 'nomma',
                width: 140
            }
        ];

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        /**
         * Mustra el listado de personas encontradas
         * @type {EditorGridPanel}
         */
        this.grid = new Ext.grid.GridPanel({
            title: 'Listado de personas del SUIN',
            store: this.store,
            columns: this.columns,
            sm: this.sm,
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                store: this.store,
                displayInfo: true
            }),
            region: 'center',
            loadMask: 'Cargando...',
            margins: '0 5 5 5'
        });

        /**
         * Campo de busqueda por no. identidad
         * @type {TextField}
         */
        this.tfNumid = new Ext.form.TextField({
            id: 'tfNumid' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'No. de identidad',
            allowBlank: true,
            maxLength: 11,
            //maxLengthText: '',
            minLength: 1,
            maskRe: /^([0-9\d]+ ?[0-9\d]*)+$/,
            regex: /^([0-9\d]+ ?[0-9\d]*)+$/,
            regexText: 'Solo admite caracteres num&eacute;ricos.',
            anchor: '95%',
            name: 'numid',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por nombre
         * @type {TextField}
         */
        this.tfNombre = new Ext.form.TextField({
            id: 'tfNombre' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Nombre',
            allowBlank: true,
            maxLength: 50,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regexText: 'Solo admite letras y el caracter especial ( ).',
            anchor: '95%',
            name: 'nombre',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por primer apellido
         * @type {TextField}
         */
        this.tfPapel = new Ext.form.TextField({
            id: 'tfPapel' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Primer apellido',
            allowBlank: true,
            maxLength: 50,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regexText: 'Solo admite letras y el caracter especial ( ).',
            anchor: '95%',
            name: 'papel',
            emptyText: 'Criterio a buscar',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Campo de busqueda por segundo apellido
         * @type {TextField}
         */
        this.tfSapel = new Ext.form.TextField({
            id: 'tfSapel' + this.id,
            enableKeyEvents: true,
            fieldLabel: 'Segundo apellido',
            allowBlank: true,
            maxLength: 50,
            maskRe: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regex: /^([a-zA-ZÁÉÍÓÚáéíóúñüÑ ]+ ?[a-zA-ZÁÉÍÓÚáéíóúñüÑ ]*)+$/,
            regexText: 'Solo admite letras y el caracter especial ( ).',
            anchor: '95%',
            name: 'sapel',
            emptyText: 'Criterio a buscar...',
            listeners: {
                keydown: function (f, e) {
                    if (e.getKey() == 13) {
                        this.btnSearch.handler();
                    }
                }.createDelegate(this)
            }
        });

        /**
         * Boton buscar del formulario
         * @type {Button}
         */
        this.btnSearch = new Ext.Button({
            iconCls: 'buscar',
            enableKeyEvents: true,
            //icon: perfil.dirImg + 'buscar.png',
            text: 'Buscar',
            tooltip: 'Buscar persona <b>Alt+B</b>',
            handler: function () {
                if (this.isValidSearchForm()) {
                    var cantidadCriterios = 0;
                    var peso = 0;

                    if (this.tfNumid.getValue() != '') {
                        peso = peso + this.tfNumid.getValue().length * 10;
                        cantidadCriterios++;
                    }
                    if (this.tfNombre.getValue() != '') {
                        peso = peso + this.tfNombre.getValue().length * 7;
                        cantidadCriterios++;
                    }
                    /*  if(this.tfsnombre.getValue() != ''){
                     peso = peso + this.tfsnombre.getValue().length * 2;
                     cantidadCriterios++;
                     }*/
                    if (this.tfPapel.getValue() != '') {
                        peso = peso + this.tfPapel.getValue().length * 7;
                        cantidadCriterios++;
                    }
                    if (this.tfSapel.getValue() != '') {
                        peso = peso + this.tfSapel.getValue().length * 7;
                        cantidadCriterios++;
                    }

                    /*Compruebo que los campos no esten vacios*/
                    if (this.tfNumid.getValue().length < 9) {
                        if (cantidadCriterios < 3) {
                            mostrarMensaje(3, 'Debe seleccionar como m&iacute;nimo 3 criterios de b&uacute;squeda.');
                            return;
                        }

                        if (peso < 75) {
                            mostrarMensaje(3, 'Los criterios de b&uacute;squeda son insuficientes.');
                            return;
                        }
                    }
                    this.store.baseParams.limit = 20;
                    this.store.baseParams.start = 0;
                    this.store.baseParams.numid = this.tfNumid.getValue();
                    this.store.baseParams.nombre = this.tfNombre.getValue();
                    this.store.baseParams.papel = this.tfPapel.getValue();
                    this.store.baseParams.sapel = this.tfSapel.getValue();
                    this.store.baseParams.fuente = 2;
                    this.store.load();
                }
            }.createDelegate(this)
        });

        /**
         * Boton limpiar del formulario
         * @type {Button}
         */
        this.btnClear = new Ext.Button({
            iconCls: 'limpiar',
            //icon: perfil.dirImg + 'limpiar.png',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s) <b>Alt+L</b>',
            handler: function () {
                this.searchForm.getForm().reset();
                this.store.removeAll();
            }.createDelegate(this)
        });

        /**
         * Boton para configurar los parametros de conexion al SUIN
         * @type {Button}
         */
        this.btnConfig = new Ext.Button({
            iconCls: 'configuracion',
            //icon: perfil.dirImg + 'configuracion.png',
            text: 'Configuraci&oacute;n',
            tooltip: 'Configurar conexi&oacute;n al servidor SUIN',
            handler: this.showWinConfig
        });

        /**
         * Formulario de busqueda de personas
         * @type {FormPanel}
         */
        this.searchForm = new Ext.FormPanel({
            cls: 'x-toolbar',
            labelAlign: 'top',
            frame: true,
            region: 'north',
            layout: 'form',
            width: 500,
            height: 120,
            margins: '5 5 5 5',
            items: [
                {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfNumid]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfNombre]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfPapel]
                        },
                        {
                            columnWidth: .18,
                            layout: 'form',
                            items: [this.tfSapel]
                        },
                        {
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [this.btnSearch]
                        },
                        {
                            columnWidth: '35px',
                            layout: 'form',
                            bodyStyle: 'padding:19px 0 0 0;',
                            items: [this.btnClear]
                        }
                    ]
                },
                {
                    xtype: 'radiogroup',
                    fieldLabel: 'Tipo de conexión',
                    columns: [150],
                    //id: 'selector',
                    vertical: true,
                    items: [
                        //{boxLabel: 'Servicio Web SOAP', name: 'rb_minit', inputValue: 1},
                        {boxLabel: 'Base de datos MINIT', name: 'rb_minit', inputValue: 2, checked: true}

                    ]
                }
            ]
        });

        /**
         * Teclas calientes de la ventana
         * @type {Array}
         */
        this.keys = [
            {
                key: 'b',
                alt: true,
                scope: this,
                fn: function () {
                    this.btnSearch.handler();
                }.createDelegate(this)
            },
            {
                key: 'l',
                alt: true,
                scope: this,
                fn: function () {
                    this.btnClear.handler();
                }.createDelegate(this)
            },
        ];

        this.items = [this.searchForm, this.grid];

        this.buttons = [this.btnConfig];

        Ext.Persona.pBuscadorSUIN.superclass.initComponent.call(this);

        this.on('show', function (cmp) {
            this.tfNumid.focus(false, 300);
        }, this);

        this.grid.on('rowdblclick', function (g, rowIndex, e) {
            this.returnPerson(this.store.getAt(rowIndex));
        }, this);
        this.grid.getSelectionModel().on('rowselect', function (g, rowIndex, e) {
            this.returnPerson(this.store.getAt(rowIndex));
        }, this);

        /**
         * Valida que los datos de busqueda son correctos
         * @returns {boolean}
         */
        this.isValidSearchForm = function () {
            if (this.searchForm.getForm().isValid()) {
                if (this.tfNumid.getValue() == '' && this.tfNombre.getValue() == '' && this.tfPapel.getValue() == '' && this.tfSapel.getValue() == '') {
                    mostrarMensaje(3, 'Debe especificar alg&uacute;n criterio de b&uacute;squeda.');
                    /*Ext.MessageBox.show({
                     title: 'Informaci&oacute;n',
                     msg: 'Debe especificar alg&uacute;n criterio de b&uacute;squeda.',
                     buttons: Ext.MessageBox.OK
                     });*/
                    this.store.removeAll();
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }.createDelegate(this);
    },
    showWinConfig: function () {
        new Ext.Persona.WinGestConfig().show();
    },
    returnPerson: function (record) {
        this.fireEvent('rowselect', record);

    }
});




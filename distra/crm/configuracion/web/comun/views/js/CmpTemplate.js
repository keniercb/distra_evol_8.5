/**
 * @class Ext.CmpTemplate
 * @extends Ext.Component
 * @author Ing. Alberto Mesa Martínez
 */
Ext.CmpTemplate = Ext.extend(Ext.Component, {
    idfuncionality: window.frameElement.id,
    createurl: '',
    useurl: '',
    idioma: {},
    tabparent: undefined,
    position: undefined,
    subsystem: false,
    constructor: function (params) {
        this.addEvents(/**
             * @event confirm
             * Se dispara una vez se haya creado o terminado de cargar los datos de una platilla.
             */
            'confirm');
        Ext.apply(this, params);

        this.btnCreateTemplate = new Ext.Button({
            id: 'btnCreateTemplate',
            iconCls: 'nuevo',
            action: 'create',
            hidden: true,
            tooltip: this.idioma.lbTtCreateTemplate || 'Crear',
            text: this.idioma.lbCreateTemplate || 'Crear'
        });

        this.btnUseTemplate = new Ext.Button({
            id: 'btnUseTemplate',
            action: 'use',
            iconCls: 'activarplanilla',
            hidden: true,
            tooltip: this.idioma.lbTtUseTemplate || 'Usar',
            text: this.idioma.lbUseTemplate || 'Usar'
        });

        if (this.tabparent && this.position >= 0) {
            this.tabparent.splice(this.position, 0, this.btnCreateTemplate, this.btnUseTemplate);

            this.defineEvents();
        }
    },
    defineEvents: function () {
        this.btnCreateTemplate.on({
            scope: this,
            click: this.clickMainButtons
        });

        this.btnUseTemplate.on({
            scope: this,
            click: this.clickMainButtons
        });
    },
    clickMainButtons: function (btn) {
        if (btn.action == 'create' && !this.createurl) {
            return;
        }
        if (btn.action == 'use' && !this.useurl) {
            return;
        }

        this.createWindow(btn);

        this.window.show();
    },
    createWindow: function (btn) {
        var me = this,
            title = this.idioma.titulocrear || 'Crear';

        this.name = new Ext.form.TextField({
            fieldLabel: this.idioma.lbdenominacion || 'nombre',
            regex: /^[a-zA-Z0-9\xf3\xf1\xe1\xe9\xed\xfa\xd1\xc1\xc9\xcd\xd3\xda\xfc\s\.\,\-]+$/,
            regexText: this.idioma.regexText || 'valor incorrecto',
            allowBlank: false,
            anchor: '100%',
            enableKeyEvents: true,
            listeners: {
                scope: this,
                keyup: this.checkWindow
            }
        });

        if (btn.action == 'use') {
            var store = new Ext.data.Store({
                url: 'listarPlantilla',
                baseParams: {
                    idfuncionalidad: me.idfuncionality
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: 'count',
                    root: 'data',
                    id: 'idplantilla'
                }, [
                    {
                        name: 'idplantilla'
                    },
                    {
                        name: 'denominacion'
                    }
                ])
            });

            this.name = new Ext.form.ComboBox({
                emptyText: this.idioma.emptyText,
                loadingText: this.idioma.loadingText || 'Cargando...',
                store: store,
                fieldLabel: this.idioma.lbdenominacion || 'nombre',
                name: 'idplantilla',
                typeAhead: false,
                pageSize: 10,
                displayField: 'denominacion',
                valueField: 'idplantilla',
                queryParam: 'denominacion',
                allowBlank: false,
                triggerAction: 'all',
                forceSelection: true,
                anchor: '100%',
                enableKeyEvents: true,
                listeners: {
                    scope: this,
                    select: this.checkWindow,
                    keyup: this.checkWindow
                }
            });

            title = this.idioma.titulousar || 'usar';
        }

        this.btnacept = new Ext.Button({
            iconCls: 'aceptar',
            tooltip: this.idioma.qtipAccept || 'Aceptar',
            text: this.idioma.lbBtnAccept || 'Aceptar',
            handler: this.executeAction.bind(this, btn.action),
            disabled: true
        });

        this.btncancel = new Ext.Button({
            iconCls: 'cancelar',
            tooltip: this.idioma.qtipCancel || 'Cancelar',
            text: this.idioma.lbBtnCancel || 'Cancelar',
            handler: function () {
                me.window.destroy();
            }
        });

        this.form = new Ext.FormPanel({
            labelWidth: 75,
            labelAlign: 'top',
            frame: true,
            region: 'center',
            items: [this.name]
        });

        var items = [this.form],
            height = 150;

        if (btn.action != 'use' && this.subsystem) {
            var gpstore = new Ext.data.Store({
                    url: 'cargarsubsistemas',
                    reader: new Ext.data.JsonReader({
                        id: 'idsubsistema'
                    }, [
                        {
                            name: 'idsubsistema'
                        },
                        {
                            name: 'nombsubsistema'
                        }
                    ])
                }),
                sm = new Ext.grid.CheckboxSelectionModel();

            this.gridpanel = new Ext.grid.GridPanel({
                store: gpstore,
                columns: [
                    sm,
                    {header: "Subsistema", width: 120, sortable: true, dataIndex: 'nombsubsistema'}
                ],
                viewConfig: {
                    forceFit: true,
                    emptyText: this.idioma.lbNoResults || 'No existen datos que mostrar.'
                },
                sm: sm,
                width: 350,
                height: 300,
                border: false,
                region: 'south'

            });
            items.push(this.gridpanel);
            height = 430;
            this.gridpanel.on({
                render: function () {
                    me.mask = new Ext.LoadMask(this.el);
                    gpstore.load();
                }
            });

            sm.on({
                scope: this,
                selectionchange: this.checkWindow
            });

            this.gridpanel.getStore().on({
                beforeload: function () {
                    me.mask.show();
                },
                load: function (store, record) {
                    me.mask.hide();
                }
            });
        }

        this.window = new Ext.Window({
            title: title,
            modal: true,
            layout: 'border',
            closeAction: 'destroy',
            constrain: true,
            items: items,
            width: 350,
            height: height,
            buttons: [this.btncancel, this.btnacept]
        });

        this.window.on({
            scope: this,
            show: function () {
                this.focusFirstElement();
            }
        })
    },
    executeAction: function (action) {
        var me = this,
            url, msg, msguse, msgok = '', count = 0,
            title = this.idioma.msgWait || 'Por favor espere...';

        this.name.setValue(this.name.getValue().trim());
        this.checkWindow();
        if (!this.form.getForm().isValid()) {
            this.focusFirstElement();
            return;
        }
        if (action == 'create') {
            url = this.createurl;
            msg = this.idioma.msgCreatingTemplate || 'Creando plantilla';
            msgok = this.idioma.msgTemplateCreated || 'La plantilla se ha creado satisfactoriamente.';
            if (this.gridpanel) {

                var sm = this.gridpanel.getSelectionModel(),
                    selections = sm.getSelections(),
                    subsistemas = [];
                count = sm.getCount();
                Ext.each(selections, function (record) {
                    subsistemas.push(record.id);
                });

            }
        } else {
            url = this.useurl;
            msg = this.idioma.msgUsingTemplate || 'Insertando datos de la plantilla';
            msgok = this.idioma.msgTemplateUsed || 'Los datos de la plantilla se han insertado satisfactoriamente.';
            msguse = this.idioma.msgInUse || 'La plantilla seleccionada no se puede utilizar debido a que los elementos actuales est&aacute;n en uso.'
        }

        this.showMessageBox(title, msg);
        Ext.Ajax.request({
            url: url,
            params: {
                idfuncionalidad: window.frameElement.id,
                denominacion: this.name.getRawValue(),
                idplantilla: action == 'create' ? 0 : this.name.getValue(),
                subsistemas: count != 0 ? Ext.encode(subsistemas) : null
            },
            callback: function (options, success, response) {
                Ext.MessageBox.hide();

                var response = Ext.decode(response.responseText);

                if (response.code == 1) {
                    mostrarMensaje(1, msgok);
                    me.window.destroy();
                    me.fireEvent('confirm', action);
                } else if (response.code == 23503) {
                    mostrarMensaje(1, msguse);
                }
            }
        })
    },
    showMessageBox: function (title, msg) {
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            width: 300,
            wait: true,
            waitConfig: {interval: 300},
            progress: true,
            closable: false
        });
    },
    checkWindow: function () {
        var condition = this.form.getForm().isValid() && this.name.getValue() && (!this.gridpanel || this.gridpanel.getSelectionModel().getCount() != 0);
        this.btnacept.setDisabled(!condition);
    },
    focusFirstElement:function(){
        var me = this;
        setTimeout(function () {
            me.name.focus();
        }, 10);
    }
})
;

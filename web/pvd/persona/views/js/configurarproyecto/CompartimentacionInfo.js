Ext.ns('Ext.Person');
Ext.Person.CompartimentacionInfo = Ext.extend(Ext.grid.EditorGridPanel, {
    title: 'Compartimentaci&oacute;n de la información por roles o usuarios',
    layout: 'fit',
    initComponent: function ()
    {
        var self = this;

        this.ConfigInfo = new Ext.components.CmpReccomplejas.Compartimentacion({
            config: this.config
        });

        this.wConfigInfo = new Ext.Window({
            modal: true,
            title: 'Configurar acceso a la informaci&oacute;n',
            layout: 'fit',
            items: this.ConfigInfo,
            closeAction: 'hide',
            buttons: []
        });

        this.store = new Ext.data.GroupingStore({
            url: 'loadCompartimentacion',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcompartimentacion'},
                {name: 'idroluser'},
                {name: 'denominacion'},
                {name: 'roluser'},
                {name: 'compartimentacion'},
                {name: 'idnomcompart'}
            ]),
            groupField: 'roluser',
            sortInfo: {
                field: 'denominacion',
                direction: "ASC"
            },
            listeners: {
                beforeload: function ()
                {
                    this.myMask.show();
                }.createDelegate(this),
                load: function ()
                {
                    this.myMask.hide();
                }.createDelegate(this),
                update: function (st)
                {
                    this.btnSave.enable();
                }.createDelegate(this)
            }
        });

        this.stCompartimentacion = new Ext.data.Store({
            url: 'getNomCompartimentacion',
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {name: 'idcompartimentacion'},
                {name: 'denominacion'},
                {name: 'compartimentacion'}
            ])
        });

        this.cbCompartimentacion = new Ext.form.ComboBox({
            store: this.stCompartimentacion,
            name: 'compartimentacion',
            displayField: 'denominacion',
            valueField: 'denominacion',
            hiddenName: 'denominacion',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: false,
            listeners: {
                select: function (cb, rec)
                {
                    var record = this.getSelectionModel().getSelected();
                    record.set('idnomcompart', rec.get('idcompartimentacion'));
                    //this.getStore().commitChanges();
                    this.btnSave.enable();
                }.createDelegate(this)
            }
        });

        this.btnSave = new Ext.Button({
            text: 'Guardar',
            iconCls: 'guardar',
            disabled: true,
            scope: this,
            handler: this.saveChanges
        });

        this.GestCompartimentacion = new Ext.Button({
            text: 'Config Info',
            iconCls: 'compartimentacion',
            border: false,
            scope: this,
            handler: function ()
            {
                this.wConfigInfo.show();
                this.wConfigInfo.maximize();
            }
        });

        this.clicksToEdit = 1;
        this.stripeRows = true;

        /**
         * Columnas del listado de roles o usuarios
         * @type {Array}
         */
        this.columns = [new Ext.grid.RowNumberer(),
            {header: 'Denominación', dataIndex: 'denominacion', sortable: true, width: 200},
            {header: 'Roles o Usuarios', dataIndex: 'roluser', hidden: true, hideable: false, sortable: true, renderer: function (v)
            {
                switch (v) {
                    case 'users':
                        return 'Usuarios';
                        break;
                    case 'roles':
                        return 'Roles';
                        break;
                }
            }},
            {header: 'Compartimentación', dataIndex: 'compartimentacion', sortable: true, editor: this.cbCompartimentacion}
        ];

        this.view = new Ext.grid.GroupingView({
            groupTextTpl: '{group}',//({[values.rs.length]} {[values.rs.length > 1 ? "Direcciones" : "Direcci&oacute;n"]})
            forceFit: true
        });

        /**
         * Modo de seleccion
         * @type {RowSelectionModel}
         */
        this.sm = new Ext.grid.RowSelectionModel({singleSelect: true});

        this.tbar = [
            this.GestCompartimentacion,
            '-',
            this.btnSave
        ];

        this.on('render', function ()
        {
            this.myMask = new Ext.LoadMask(this.body.dom, {
                msg: "Cargando..."
            });
            this.getStore().load();
            this.stCompartimentacion.load();
        }, this);

        Ext.Person.CompartimentacionInfo.superclass.initComponent.call(this);
    },
    saveChanges: function ()
    {
        var changes = [];
        Ext.each(this.getStore().getRange(), function (rec)
        {
            if (rec.isModified('idnomcompart')) {
                changes.push(rec.data);
            }
        }, this);
        if (changes.length > 0) {
            Ext.Ajax.request({
                url: 'saveCompartimentacionInfoByRolUser',
                params: {
                    changes: Ext.encode(changes)
                },
                success: function (response, options)
                {
                    var dataResponse = Ext.decode(response.responseText);
                    switch (dataResponse.codigo) {
                        case 1:
                            mostrarMensaje(1, 'La compartimentaci&oacute;n se ha guardado satisfactoriamente.');
                            this.getStore().load();
                            break;
                        default :
                            break;
                    }
                }.createDelegate(this)
            });
        } else {
            this.btnSave.disable();
        }

    }
});
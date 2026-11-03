Ext.erp.actividad = Ext.extend(Ext.erp.gridPanelNomenclador, {
    constructor: function (config) {

        var _this = this;
        config.campoIdNomenclador = 'idactividad';
        Ext.apply(this, config);
        this.codigo = false;
        this.acction = false;
        this.bussinesModel = 'ActividadMedioModel';

        var fields = [
            {
                name: _this.campoIdNomenclador
            },
            {
                name: 'codigo'
            },
            {
                name: 'estado'
            },
            {
                name: 'denominacion'
            },
            {
                name: 'fechainicio'
            },
            {
                name: 'fechafin'
            },
            {
                name: 'usarentidad'
            }
        ];


        _this.storeNomenclador = new Ext.data.Store({
            url: this.urlController + 'cargarnomenclador',
            baseParams: {
                modelo: _this.modelo,
                idnom: _this.campoIdNomenclador,
                bussines: _this.bussinesModel,

            },
            reader: new Ext.data.JsonReader({
                root: 'datos',
                totalProperty: 'cantidad',
                id: _this.campoIdNomenclador,
                fields: fields
            })
        });
        _this.columnsFields = [
            {
                header: _this.idioma.lbTipoactividad,
                dataIndex: 'descripciontc',
                width: 140

            }
        ]

        _this.storeFields = [
            {
                name: 'descripciontc'
            },
            {
                name: 'iddepreciacion'
            }
        ];



        RecordCombo = new Ext.data.Record.create([
            {
                name: 'descripcion',
                mapping: 'descripcion'
            },
            {
                name: 'iddepreciacion',
                mapping: 'iddepreciacion'

            }
        ]);

        var storedepreciacion = new Ext.data.Store({
            url: '/logistica/activos_fijos/configuracion/index.php/nomactividad/cargardepreciacion',
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'iddepreciacion'
            }, RecordCombo)
        });

        var combito = new Ext.form.ComboBox({
            fieldLabel: _this.idioma.lbTipoactividad,
            hiddenName: 'descripciontc',
            anchor: '98%',
            editable: false,
            store: storedepreciacion,
            valueField: 'iddepreciacion',
            displayField: 'descripcion',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            allowBlank: false,
            emptyText: _this.idioma.lbMsgSeleccionarCombo,
            selectOnFocus: true,
            listeners: {
                'select': function (c, r, i) {
                    Ext.getCmp('hdiddepreciacion').setValue(c.getValue());
                }
            }
        });

        _this.formFields = [combito, {
            xtype: 'hidden',
            name: 'iddepreciacion',
            id: 'hdiddepreciacion'
        }];


        if (acciones_reportes.length > 0) {

            for (var i = 0; i < acciones_reportes.length; i++) {
                if (acciones_reportes[i].abreviatura == "NOMACTIVBUQUE"){
                    this.acction = true;
                    _this.columnsFields = [{
                        header: "Tipo",
                        dataIndex: 'tipo',
                        width: 140,
                        renderer: function (value, metaData) {
                            if (value == 1) {
                                return  'Terrestre';
                            } else {
                                return  'Mar\xedtima';
                            }
                        }
                    },{
                        header: "Per\xedodo",
                        dataIndex: 'periodo',
                        width: 140,
                        renderer: function (value, metaData) {
                            if (value == 1) {
                                metaData.css = 'activo';
                            } else {
                                metaData.css = 'inactivo';
                            }
                        }
                    }];
                    _this.storeFields = [
                        {
                            name: 'tipo'
                        },
                        {
                            name: 'periodo'
                        }];

                    this.fsTipo = new Ext.form.FieldSet({
                        labelAlign: 'top',
                        title:"Tipo",
                        anchor:'95%',
                        autoHeight:true,
                        defaults: {bodyStyle: 'padding:0px 0px 10px 0px'}
                    });
                    this.fsP = new Ext.form.FieldSet({
                        labelAlign: 'top',
                        autoHeight:true,
                        hideMode:true,
                        title:"Frecuencia",

                        defaults: {bodyStyle: 'padding:0px 0px 10px 0px'}
                    });

                    _this.storeNomenclador.baseParams.accion = "NOMACTIVBUQUE";
                    this.fsTipo.add({
                        layout: 'column',
                        items: [{
                            xtype: 'radio',
                            columnWidth: .5,
                            boxLabel: "Terrestre",
                            name: 'tipo',
                            //checked:((_this.accion == 'mod' || _this.accion == 'apr') && _this.movimiento.estado==1)?true:false,
                            inputValue: '1'
                        }, {
                            xtype: 'radio',
                            columnWidth: .5,
                            boxLabel: "Mar\xedtima",
                            name: 'tipo',
                            //checked:((_this.accion == 'mod' || _this.accion == 'apr') && _this.movimiento.estado==1)?true:false,
                            inputValue: '2'
                        }]
                    });
                    this.chPeriodo = new Ext.form.Checkbox ({
                        boxLabel: "Per\xedodo",
                        name: 'periodo',
                        inputValue: '1'
                    });
                    this.fsP.add({
                        layout: 'column',
                        items: [_this.chPeriodo]
                    });


                    _this.formFields = [{
                        layout: 'column',
                        items: [{
                            columnWidth: .6,
                            layout: 'form',
                            items: [this.fsTipo]
                        }, {
                            columnWidth: .4,
                            layout: 'form',
                            items: [this.fsP]
                        }]
                    }];
                }
                if (acciones_reportes[i].abreviatura == "NOMACTVAFT") {

                }
            }
        };



        Ext.erp.actividad.superclass.constructor.apply(this, arguments);
    },
    initComponent: function(){
        var _this = this;
        Ext.erp.actividad.superclass.initComponent.call(this);


        this.storeNomenclador.on({
            'load': function(st, records, options) {
                _this.storeNomenclador.baseParams.acction = (_this.acction)? "NOMACTIVBUQUE": null;
                if (records.length > 0) {
                    if (_this.rowSelect)
                        _this.selectionModeNomenclador.selectRow(_this.rowSelect);
                    else
                        _this.selectionModeNomenclador.selectFirstRow();

                } else {
                    if (_this.buscar)
                        mostrarMensaje(1, _this.idioma.lbSindatosBuscar);

                    _this.rowSelect = false;
                }
            }
        });

        this.storeNomenclador.load({
            params: {
                start: 0,
                acction: (_this.acction)? "NOMACTIVBUQUE": null
            }
        });
    }
});

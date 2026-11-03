Ext.ns("Ext.components.Evaluaciones");
var idpersona;
var b;
Ext.components.Evaluaciones.pDatos = Ext.extend(Ext.Panel, {
    layout: 'border',
    height: 150,
    initComponent: function() {
        var self = this;

        this.foto = new Ext.Panel({
            region: 'center',
            margins: '0 5 0 0',
            //bodyStyle: 'padding:40px 20px 0;',
            width: 90,
            height: 114,
            frame: true,
            border: true,
            html: '<img id= "foto" src="/pvd/persona/views/images/persona/no-photo-male.png" width="100%" height="100%"/>' //imagen vacía
        });

        this.form = new Ext.FormPanel({
            region: 'east',
            title:'Dato del evaluado',
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width:500,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Tipo de identidad',
                        name: 'tipoidentidad',
                        readOnly: true,
                        anchor: '95%'
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Sexo',
                        readOnly: true,
                        name: 'idsexo',
                        anchor: '95%'
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: 'Número de identidad',
                        name: 'numid',
                        anchor: '95%',
                        readOnly: true
                    }, {
                        xtype: 'textfield',
                        fieldLabel: 'Cargo',
                        name: 'denomcargo',
                        anchor: '95%',
                        readOnly: true
                    }]
                }]
            }
            ]
        });

        this.items = [this.foto, this.form];

        Ext.components.Evaluaciones.pDatos.superclass.initComponent.call(this);
    }
});

Ext.components.Evaluaciones.GestEstructura = Ext.extend(Ext.Window, {
    title:'Gestionar estructura evaluativa para el periodo',
    layout: 'border',
    width: '90%',
    height: 750,
    initComponent: function() {
        var self = this;

        this.stPlanillas = new Ext.data.Store({
            url: 'cargarplanillasproceso',
            baseParams: {
                iddefprocesoevaluativo: self.iddefprocesoevaluativo
            },
            reader: new Ext.data.JsonReader({
                root: 'datos'
            }, [
                {
                    name: 'idprocesoplanilla'
                },
                {
                    name: 'planilla'
                },
                {
                    name: 'descripcion'
                },
                {
                    name: 'idplanilla'
                }
            ])
        });

        this.cbPlanillas = new Ext.form.ComboBox({
            store: this.stPlanillas,
            anchor: '100%',
            disabled:false,
            fieldLabel: labels.cbPlanillas,
            displayField: 'planilla',
            valueField: 'idplanilla',
            hiddenName: 'idplanilla',
            tpl: '<tpl for="."><div ext:qtip="<b>{planilla}.</b><p>{descripcion}</p>" class="x-combo-list-item">{planilla}</div></tpl>',
            typeAhead: true,
            triggerAction: 'all',
            forceSelection: true,
            emptyText: 'Planilla evaluativa',
            editable: false,
            allowBlank: false,
            selectOnFocus: true,
            listeners: {
                select: function (cb, rec, index) {
                    self.validateCondition();
                }
            }
        });

        var btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar accion',
            handler: function () {
                self.close();
            },
            nextTab: 'btnAceptar'
        });

        var btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            iconCls: 'aceptar',
            text: 'Aceptar',
            tooltip: 'Adicionar estrcutura evaluativa',
            disabled: true,
            handler: function () {

                PVD.mostrarMascara('mask', labels.lbMsgWhaitPeriodo,'Adicionando persona a la estrcutura evaluativa del periodo');
                Ext.Ajax.request({
                    url: 'adicionarpersonaestructura',
                    method: 'POST',
                    params: {
                        idperiodoproceso: self.idperiodoproceso,
                        iddefprocesoevaluativo: self.iddefprocesoevaluativo,
                        idplanilla:self.cbPlanillas.getValue(),
                        estado: self.estado,
                        idpersonaevaluador:self.perfilt.getSelectionModel().getSelected().data.idpersonaevaluador,
                        idpersonaevaluado:idpersona
                    },
                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        PVD.ocultarMascara('mask');
                        if (responseData.success) {
                            mostrarMensaje('1', 'Se ha adicionado la persona a la estructura satisfactoriamente');
                            btnAceptar.disable();
                        }
                        else if (!responseData.success) {
                            mostrarMensaje('3', labels.msgRemoveFalse);
                        }
                    }
                });
            },
            prevTab: 'btnCancelar'
        });

        this.pdato = new Ext.components.Evaluaciones.pDatos({
            region: 'north',
            anchor: '100%',
            frame: false,
           // height: 130,
            margins: '5 5 0 0'
        });

        this.store = new Ext.data.Store({
            url: 'getEvaluadoresEstructura',
            autoLoad: true,
            baseParams: {
                idperiodoproceso:self.idperiodoproceso
            },
            reader: new Ext.data.JsonReader({
                totalProperty: 'cantidad',
                root: 'datos'
            }, [
                {name: 'idpersonaevaluador'},
                {name: 'evaluador'}

            ])
        });

        this.obj = new Ext.app.SearchField({
            store: this.store,
            emptyText: 'Criterio a buscar...'
        });

        this.sm = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(sm) {
                    if (sm.hasSelection()) {
                        self.validateCondition();// btnAceptar.enable();
                    }
                }
            }
        });

        this.columns = [
            {
                header: 'Evaluador',
                sortable: true,
                width: 400,
                resizable: true,
                dataIndex: 'evaluador'

            }

        ];

        this.perfilt = new Ext.grid.GridPanel({
            title: 'Listado de evaluadores',
            columns: self.columns,
            tbar : [this.obj],
            stripeRows: true,
            store: self.store,
            loadMask: {
                msg: 'Cargando...'
            },
            region: 'center',
            margins: '5 5 5 5',
            width: 300,
            //height: 350,
            sm: this.sm,
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                store: self.store,
                displayMsg: labels.lbPaginToolBar
            })

        });

        this.pbuscarpersona = new Ext.components.CmpReccomplejas.Interfaz({
            margins: '5 0 5 0',
            title: 'Reporte de personas',
            width: '50%',
            height: 430,
            singleSelect: false,
            region: 'center',
            border: true,
            idconfiguracion: 'personas',
            tituloReporte: 'Reporte de personas',
            tituloConfiguracion: 'Configuración de la búsqueda',
            tituloGrid: 'Listado de personas a evaluar',
            mainToolBar: ['->', {
                text: 'Ayuda',
                iconCls: 'ayuda'
            }],
            hideBtnRtf: false,
            singleSelect: true,
            noUsarGestAvisos: true, //False si voy a usar el componente de Gestionar avisos
            useMap: false,
            hideBtnOperCant: false,
            //autoLoadList: false,
            renderers: getRenderes()
        });

        this.pbuscarpersona.pReporte.gpReporte.getSelectionModel().on('rowselect', function (sm, rowIndex, rec) {
            if(sm)
            {;
                b = 0;
                self.validateCondition();//btnAceptar.enable();
                idpersona = rec.data.idpersona;
                if(rec.data.foto!=null){
                    Ext.get('foto').dom.src = 'data:image/jpg;base64,'+rec.data.foto;
                }else{
                    Ext.get('foto').dom.src="/pvd/persona/views/images/persona/no-photo-male.png";
                }

                self.pdato.form.getForm().loadRecord(rec);
                if(rec.data.sexo == 1){
                    self.pdato.form.getForm().findField('idsexo').setValue('Masculino');
                }else if(rec.data.sexo == 2){
                    self.pdato.form.getForm().findField('idsexo').setValue('Femenino');
                }else{
                    self.pdato.form.getForm().findField('idsexo').setValue('No Conocido');
                }

            }
        });

         //*******************form panel*****************************
        this.form = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            autoHeight: true,
            region: 'north',
            margins: '5 5 5 0',
            width: '70%',
            height: 100,
            layout: 'form',
            items: [this.cbPlanillas]
        });

        //*********************Panel Derecho**************************
        this.pers = new Ext.Panel({
            layout: 'border',
            region: 'west',
            width: '40%',
            height: 430,
            border: false,
            items: [this.pdato, self.perfilt]
        });
        //*********************Panel Derecho**************************
        this.total = new Ext.Panel({
            layout: 'border',
            region: 'center',
            width: '70%',
            height: 430,
            border: false,
            items: [this.pbuscarpersona, self.pers]
        });

        this.btnHlp = new Ext.Button({
            id: self.id + 'hlp',
            tooltip: labels.lbToolTipAyuda,
            text: labels.lbBtnAyuda,
            iconCls: 'ayuda',
            handler: function() {
                var title   = 'Ayuda de clasificación de competencias';
                var referencia  = 'Competencias laborales/Registro de competencias a la persona';
                help.show(title,referencia);
            }
        });
        this.tbar = ['->', this.btnHlp];
        this.items = [this.form,this.total];
        this.buttons = [btnCancelar, btnAceptar];
        this.keys = [
            /*alt-h*/	{
                key: 'h',
                alt: true,
                fn: function() {
                    self.btnHlp.handler();
                }
            }
        ];
        Ext.components.Evaluaciones.GestEstructura.superclass.initComponent.call(this);
        function getRenderes() {
            return Ext.apply({
                showSexo: function (val) {
                    if (val == 0) {
                        return '<center><img src="/pvd/credenciales/views/images/female.png" /></center>';
                    } else {
                        return '<center><img src="/pvd/credenciales/views/images/male.png" /></center>';
                    }
                }, showGradoMilitar: function (val, opt, rec) {
                    // grado
                    if (!Ext.isEmpty(val)) {
                        return '<center><img ext:qtip="<b>' + rec.data.grado + '</b>" style="height: 16px;cursor: pointer" src="' + val + '" /></center>';
                    } else {
                        return '<center><img src="' + Ext.BLANK_IMAGE_URL + '" /></center>';
                    }
                }
            });
        };
        this.validateCondition = function () {
            if (self.cbPlanillas.isValid() && self.perfilt.getSelectionModel().getSelected() && b==0) {
                btnAceptar.enable();

            } else {
                btnAceptar.disable();

            }
        }
    }
});


/* 
 * @autor Alejandro Mengana Perez
 * Grupo de desarrolladores de CONFIN
 */

Ext.namespace('Banco.Recuperaciones.Reportes');

Banco.Recuperaciones.Reportes.View = {
    inicio: function(perfil, idioma, modelo) {

        //combo tipo reporte
        this.cbtipoReporte = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            id: 'cbtipoReporte',
            allowBlank: false,
            blankText: idioma.lbObligatorio,
            forceSelection: true,
            editable: false,
            fieldLabel: idioma.lbtipoReporte,
            store: modelo.sttipoReporte,
            valueField: 'idReporte',
            displayField: 'nombreReporte',
            hiddenName: 'idReporte',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            shadow: true,
            anchor: '97%',
            tpl: '<tpl for="."><div ext:qtip="{nombreReporte}" class="x-combo-list-item">{nombreReporte}</div></tpl>'
        });

        //combo periodo
        this.cbPeriodo = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            id: 'cbPeriodo',
            forceSelection: true,
            editable: false,
            fieldLabel: idioma.lbPeriodo,
            store: modelo.stperiodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            hiddenName: 'idperiodo',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            disabled: true,
            selectOnFocus: true,
            shadow: true,
            anchor: '94%',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>'
        });

        //combo ejercicio
        this.cbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            forceSelection: true,
            editable: false,
            id: 'cbEjercicio',
            fieldLabel: idioma.lbEjercicio,
            store: modelo.stejercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            hiddenName: 'idejercicio',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            tpl: '<tpl for="."><div ext:qtip="{nombre}" class="x-combo-list-item">{nombre}</div></tpl>'
        });
        
        //Componente tipo cuenta
        this.componentTipoCuenta = function() {
            //combo tipo de cuenta
            this.cbtipocuenta = new Ext.form.ComboBox({
                emptyText: idioma.emptyTSleccione,
                id: 'cbtipocuenta',
                fieldLabel: idioma.lbTipoCuenta,
                store: modelo.sttipocuenta,
                valueField: 'idtipocuenta',
                displayField: 'denom',
                hiddenName: 'idtipocuenta',
                typeAhead: true,
                resizable: true,
                mode: 'local',
                allowBlank: false,
                blankText: idioma.lbObligatorio,
                triggerAction: 'all',
                selectOnFocus: true,
                forceSelection: true,
                editable: false,
                //disabled: true,
                anchor: '98%',
                tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
                listeners: {
                    scope: this,
                    select: function(combo, record){
                        this.MostrarEtiquetas(this.panelFiltros.getEl(), idioma.msgCargando);
                        Ext.getCmp('gpCuentaB').getStore().removeAll();
                        Ext.getCmp('gpCuentaB').getStore().load({
                            scope: this,
                            params:{
                                arrentidades: Ext.encode(this.arrEntidadesCB()),
                                idtipocuenta: record.data.idtipocuenta
                            },                            
                            callback: function(record, options, success){
                                if(record.length === 0){
                                    this.cbxCuentaTipo.reset();
                                    this.cbxCuentaTipo.disable();
                                }else
                                    this.cbxCuentaTipo.enable();
                                this.lMask.hide();
                            }
                        });                        
                    }
                }
            });

            return {
                columnWidth: .99,
                labelAlign: 'top',
                layout: 'form',
                items: [this.cbtipocuenta]
            };
        };
        
        //funcion que devuelve el componente cuenta tipo
        this.componentCuentaTipo = function(){
            //Combo con tree grid para cargar las cuentas bancarias
            this.cbxCuentaTipo = new Ext.CONT.UIXCombo({
                emptyText: idioma.emptyTSleccione,
                allowBlank: true,
                fieldLabel: idioma.lbCuentaBancaria,
                tabIndex: 1,
                disabled: true,
                anchor: '100%',
                hiddenTbar: true
            }, {
                identificador: 'CuentaB',
                displayText: idioma.lbCuentaBancaria,
                url: 'obtenerCuentasPorIdTipoCuenta',
                autoLoad: false,
                singleSelect: false,
                reader: modelo.jrCuentaTipo
            });
            
            return {
                columnWidth: .99,
                labelAlign: 'top',
                layout: 'form',
                items: [this.cbxCuentaTipo]
            };
        };
        
        //funcion que llena el arreglo de entidades seleccionadas para poder cargar la cuenta bancaria
        this.arrEntidadesCB = function() {
            var sm = Ext.getCmp('gpEntidad').getSelectionModel();
            var cant = sm.getCount();
            var seleccionados = sm.getSelections();
            var arrentidades = new Array();
            for (i = 0; i < cant; i++) {
                arrentidades.push(seleccionados[i].data.idestructuracomun);
            }
            return arrentidades;
        };        

        //Crear componente cuenta bancaria
        this.componentCuentaBancaria = function() {
            //cta bancaria
            this.cbCuentaBancaria = new Ext.form.ComboBox({
                id: 'cbCuentaBancaria',
                fieldLabel: idioma.lbCuentaBancaria,
                mode: 'local',
                emptyText: idioma.emptyTSleccione,
                store: modelo.stCuentaBancaria,
                tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
                resizable: true,
                hiddenName: 'idcuentabancaria',
                //disabled: true,
                //disabledClass: 'disabled-component',
                valueField: 'idcuentabancaria',
                displayField: 'text',
                selectOnFocus: true,
                allowBlank: false,
                blankText: idioma.lbObligatorio,
                typeAhead: true,
                forceSelection: true,
                editable: false,
                anchor: '98%',
                triggerAction: 'all',
                enableKeyEvents: true
            });
            
            return {
                columnWidth: .99,
                labelAlign: 'top',
                layout: 'form',
                items: this.cbCuentaBancaria
            };
        };     

        //fecha inicio
        this.dfFechainicio = new Ext.form.DateField({
            fieldLabel: idioma.lbFechainicio,
            name: 'dfFechainicio',
            id: 'dfFechainicio',
            format: 'd/m/Y',
            readOnly: true,
            disabled: true,
            showToday: false,
            anchor: '95%'
        });

        //fecha fin
        this.dfFechafin = new Ext.form.DateField({
            fieldLabel: idioma.lbFechafin,
            name: 'dfFechafin',
            id: 'dfFechafin',
            format: 'd/m/Y',
            readOnly: true,
            disabled: true,
            showToday: false,
            anchor: '98%'
        });

        this.btnAyuda = new Ext.Button({
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbTooltipAyuda,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });
        
        //boton para aceptar configuracion y mostrar el reporte
        this.btnAceptar = new Ext.Button({
//            icon: perfil.dirImg + 'recuperaciones.png',
            iconCls: 'recuperaciones',
            text: idioma.lbAceptar,
            tooltip: idioma.lbTooltipAceptar
        });
        
        //boton para la vista reporte
        this.btnVistaReporte = new Ext.Button({
//            icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'imprimir',
            disabled: true,
            text: idioma.lbVistareporte,
            tooltip: idioma.lbTooltipVistaRep
        });

        /*label para mostrar espacio*/
        this.lbfespacio = new Ext.form.Label({
            id: 'lbespacio',
            html: '&nbsp;'
        });

        //Combo box con tree grid para cargar las estructuras economicas
        this.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: idioma.emptyTSleccione,
            allowBlank: true,
            fieldLabel: idioma.lbEntidad,
            tabIndex: 1,
            disabled: true,
            anchor: '99%'
        }, {
            identificador: 'Entidad',
            displayText: idioma.lbEntidad,
            url: 'cargararbolestructurae',
            autoLoad: false,
            //tbar: [],
            singleSelect: false,
            baseParams: {
            },
            reader: modelo.jrEntidad
        });

        //panel para los filtros
        this.panelFiltros = new Ext.form.FormPanel({
            id: 'panelFiltros',
            border: false,
            frame: true,
            height: 173,
            region: 'north',
            layout: 'column',
            labelAlign: 'top',
            tbar: ['->', this.btnAyuda],
            bbar: [this.btnAceptar, this.btnVistaReporte],
            items: [
                {
                    columnWidth: .5,
                    style: 'margin-top:7px;',
                    items: [
                        {
                            layout: 'form',
                            items: [this.cbtipoReporte]
                        },
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .5,
                                    items: [{layout: 'form', items: [this.cbEjercicio]}]
                                }, {
                                    columnWidth: .5,
                                    items: [{layout: 'form', items: [this.cbPeriodo]}]
                                }
                            ]
                        },
                        {
                            layout: 'column',
                            id: 'pdinamico'
                        }
                    ]
                },
                {
                    columnWidth: .5,
                    style: 'margin-top:7px;',
                    items: [
                        {
                            layout: 'form',
                            items: [this.cbxEntidad]
                        },
                        {
                            layout: 'column',
                            items: [
                                {
                                    columnWidth: .5,
                                    items: [{layout: 'form', items: [this.dfFechainicio]}]
                                }, {
                                    columnWidth: .5,
                                    items: [{layout: 'form', items: [this.dfFechafin]}]
                                }
                            ]
                        },
                        {
                            layout: 'column',
                            id: 'pdinamico1'
                        }
                    ]
                }
            ]
        });
        
        //Funcion que devuelve las columnas para el cargar los cheques
        this.columnasCargarChequesReporte = function() {
            var columnas = new Ext.grid.ColumnModel([
                {id: 'fechacreacion', header: "Fecha", width: 50, sortable: true, dataIndex: 'fechacreacion'},
                {id: 'numerodocumento', header: "No. documento", width: 60, sortable: true, dataIndex: 'numerodocumento'},
                //{id: 'tipooperacion', header: "Tipo operación", width: 70, sortable: true, dataIndex: 'tipooperacion'},
                {id: 'denominacion', header: "Tipo documento", width: 60, sortable: true, dataIndex: 'denominacion', align: 'center'},
                {id: 'importemo', header: "Importe", width: 50, sortable: true, dataIndex: 'importemo', align: 'right'},
                {id: 'estado', header: "Estado", width: 60, sortable: true, dataIndex: 'estado', align: 'center'},
                {id: 'expandir', header: "Beneficiario", width: 140, sortable: true, dataIndex: 'beneficiario'},
                {id: 'agrupador', header: "", width: 50, hidden: true, sortable: true, dataIndex: 'agrupador'}
            ]);
            
            return columnas;
        };
        
        //Funcion que devuelve las columnas para el reporte de la cociliacion
        this.columnasReporteConciliacion = function() {
            function estiloColumn(val) {
                return '<span style="color:black;font-weight:bolder;">' + val + '</span>';
            }

            var columnas = new Ext.grid.ColumnModel([
                {id: 'expandir', header: "", width: 140, dataIndex: 'nombreCampo'},
                {id: 'saldo1', header: "", width: 60, dataIndex: 'saldo1', align: 'right', renderer: estiloColumn},
                {id: 'saldo2', header: "", width: 60, dataIndex: 'saldo2', align: 'right', renderer: estiloColumn},
                {id: 'agrupador', header: "", width: 50, dataIndex: 'agrupador', align: 'right', hidden: true}
            ]);

            return columnas;
        };

        //panel de la parte de abajo
        this.panelAbajo = new Ext.Panel({
            //title: 'Panel de abajo',
            id: 'panelAbajo',
            border: false,
            frame: false,
            layout: 'border',
            region: 'center',
            items: [this.gpReporte = new Ext.grid.GridPanel({
                    store: new Ext.data.GroupingStore({
                        groupField: 'agrupador',
                        reader : new Ext.data.JsonReader({
                            id: 'readerIni'                        
                        },
                        [{name: 'agrupador'}]
                    )
                    }),
                    columns: [],
                    sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
                    frame: false,
                    header: true,
                    region: 'center',
                    border: false,
                    autoScroll: true,
                    //Para poder usar este grouping view hay que poner en el ColumnModel
                    //una columna que haga referencia al campo por el cual se va a agrupar
                    view: new Ext.grid.GroupingView({
                        forceFit: true,
                        groupTextTpl: '{[values.rs[0].data.agrupadornombre]}'
                    })
                })]
        });
        
        new Ext.Viewport({
            id: 'viewport',
            layout: 'border',
            items: [this.panelFiltros, this.panelAbajo]
        });

        //muestra una mascara dado el texto
        this.MostrarEtiquetas = function(componente, mensaje) {
            this.lMask = new Ext.LoadMask(componente, {
                msg: mensaje
            });
            this.lMask.show();
        };

        //pone tool tip a los componentes
        this.fToolTipShow = function(component, text) {
            if (!component.ttp)
                component.ttp = new Ext.ToolTip({
                    target: component.getEl(),
                    autoHeight: true,
                    autoWidth: true,
                    autoHide: true,
                    maxWidth: 200,
                    anchor: 'left',
                    title: text,
                    trackMouse: true
                });
            else
                component.ttp.setTitle(text);
        };

        //Funcion que crea la ventana para el reporte
        this.crearPrintView = function(dataReport, defaultValues) {
            return new SCFPrintView(dataReport, "/contabilidad/comun/SCFPrintView/", defaultValues);
        };

//Funcion para ponerle una mascara auxiliar al body
        this.addMascaraBody = function() {
            this.mascaraaux = Ext.getBody().createChild({cls: "ext-el-mask"}, Ext.getBody().dom);
            this.mascaraaux.enableDisplayMode("block");
            this.mascaraaux.hide();
            Ext.getBody().addClass("x-body-masked");
            this.mascaraaux.setSize(Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true));
            this.mascaraaux.show();
        };

        //Funcion para quitarle la mascara auxiliar al body
        this.delMascaraBody = function() {
            this.mascaraaux.hide();
            Ext.getBody().removeClass("x-body-masked");
        };

    }
};



//Inicializando la vista.
Ext.QuickTips.init();
var perfil = window.parent.perfil;

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function(options, success, response)
    {
        var etiquetas = Ext.decode(response.responseText);

        //Inicializar el modelo
        var modelo = Banco.Recuperaciones.Reportes.Model;
        modelo.inicio();

        //Inicializar la vista.
        var vista = Banco.Recuperaciones.Reportes.View;
        vista.inicio(perfil, etiquetas, modelo);

        //Inicializar controlador.
        Banco.Recuperaciones.Reportes.Controller.inicio(etiquetas, vista, modelo);
    }
});
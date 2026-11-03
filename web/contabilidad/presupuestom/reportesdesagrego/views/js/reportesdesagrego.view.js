Ext.namespace('Presupuesto.Reportes');

Presupuesto.Reportes.View = {
    //último parámetro para saber si lo abre por conciliacion o por su fuljo normal
    //true es si esta por el flujo normal y false es cuando se abre por conciliacion
    inicio: function(perfil, idioma, modelo, flujonormal) {

        this.btnSalarioAsignado = new Ext.Button({
            text: 'Salario',
            tooltip: 'Salario',
            //iconCls: 'adicionar',
        }); this.btnOtrosAsignado = new Ext.Button({
            text: 'Salario',
            tooltip: 'Salario',
            //iconCls: 'adicionar',
        }); this.btnIversionAsignado = new Ext.Button({
            text: 'Salario',
            tooltip: 'Salario',
            //iconCls: 'adicionar',
        });

        this.labelDoc= new Ext.form.NumberField({
            fieldLabel:'No Doc',
            triggerAction: 'all',
            anchor: '96%',
            enableKeyEvents: true,
            editable: true,
            name: 'NoDoc',
            pageSize: 100,
            // allowNegative: false,
            maxValue: 9999999999999,
            //allowBlank: false,
            disabled : true,
            tabIndex:4

        })

        //combo para saber el tipo de conciliacion
        this.tipo_operacion = new Ext.data.SimpleStore({
            fields: ['operacion','operacion2'],
            data:[['01 (Salario)',1],['02 (Otros Gastos)', 2],['03 (Inversiones)',3]]
        });

        this.cbOperacion = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de Operacion',//idioma.lbtipoMetodoConc,
            disabledClass: 'disabled-component',
            id: 'cbtipoOperacion',
            resizable: true,
            mode: 'local',
            disabled : true,
            editable: false,
            selectOnFocus: true,
            store: this.tipo_operacion,
            valueField: 'operacion2',
            displayField: 'operacion',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '98%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            tabIndex: 2
        })

        this.cbtipoMetdConc = new Ext.form.ComboBox({
            fieldLabel: 'Tipo de Reporte',//idioma.lbtipoMetodoConc,
            disabledClass: 'disabled-component',
            id: 'cbtipoMetdConc',
            resizable: true,
            mode: 'local',
            //disabled : true,
            editable: false,
            selectOnFocus: true,
            store: modelo.stTipoReporte,
            valueField: 'idreporte',
            displayField: 'textometdconc',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '98%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            tabIndex: 1
        });

        //combo periodo
        this.cbPeriodo = new Ext.form.ComboBox({
            emptyText: 'Periodo',//idioma.emptyTSleccione,
            id: 'cbPeriodo',
            forceSelection: true,
            fieldLabel: 'Periodo',//idioma.lbPeriodo,
            store: modelo.stperiodo,
            valueField: 'idperiodo',
            displayField: 'nombre',
            hiddenName: 'idperiodo',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            shadow: true,
            anchor: '98%',
            tabIndex: 8
        });

        //combo ejercicio
        this.cbEjercicio = new Ext.form.ComboBox({
            fieldLabel: 'Ejercicio',
            emptyText: 'Seleccione...',//idioma.emptyTSleccione,
            allowBlank: false,
            forceSelection: true,
            id: 'cbEjercicio',
            disabled : true,
            fieldLabel: 'Ejercicio',//idioma.lbEjercicio,
            store: modelo.stejercicio,
            valueField: 'idejercicio',
            displayField: 'nombre',
            hiddenName: 'idejercicio',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '98%',
            tabIndex: 7
        });

        //combo tipo de operacion
        this.cbconcepto = new Ext.form.ComboBox({
            emptyText: 'Seleccione...',//idioma.emptyTSleccione,
            id: 'cbconcepto',
            fieldLabel: 'Concepto',//idioma.lbConcepto,
            store: modelo.stconcepto,
            valueField: 'idtipocuenta',
            displayField: 'denom',
            hiddenName: 'codigo',
            typeAhead: true,
            resizable: true,
            mode: 'local',
            allowBlank: false,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '98%',
            forceSelection: true,
            editable: false,
            tpl: '<tpl for="."><div ext:qtip="{denom}" class="x-combo-list-item">{denom}</div></tpl>',
            //tabIndex: 2
        });

        //fecha desde
        this.dfDesde = new Ext.form.DateField({
            fieldLabel: 'Desde',//idioma.lbDesde,
            name: 'desdeintrv',
            id: 'desdeintrv',
            vtype: 'daterange',
            endDateField: 'hastaintrv',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '98%',
            tabIndex: 9
        });

        //fecha hasta
        this.dfHasta = new Ext.form.DateField({
            //fieldLabel: idioma.lbHasta,
            //width: 120,
            fieldLabel: 'Hasta',
            name: 'hastaintrv',
            id: 'hastaintrv',
            vtype: 'daterange',
            startDateField: 'desdeintrv',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '98%',
            tabIndex: 10,

        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudarepconciliacion',
            text: 'Ayuda',//idioma.lbBtnAyuda,
            tooltip: 'Ayuda',//idioma.lbTooltipAyuda,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });

        /*label para mostrar espacio*/
        this.lbespacio = new Ext.form.Label({
            id: 'lbespacio',
            html: '&nbsp; '
            //style: 'font-weight:bold;'
        });

        this.NAEEdit = new Ext.form.ComboBox({
            id: 'idcentrogrupo',
            fieldLabel: 'Grupo',
            //allowBlank: false,
            forceSelection: false,
            disabled: true,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            anchor: '98%',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerCentroCosto',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idcentrogrupo'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: 'idcentrogrupo',
            displayField: 'text',
            autoLoad:true,
            tabIndex: 4
        });

        //Combo box con tree grid para cargar las estructuras economicas
        this.cbxEntidad = new Ext.form.ComboBox({
            id: 'gpEntidad',
            anchor: '100%',
            fieldLabel: 'Entidades',
            allowBlank: true,
            forceSelection: false,
            disabled: true,
            anchor: '98%',
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 2,
            store: this.stentidades = new Ext.data.JsonStore({
                url: 'obtenerEntidadesParaBusqueda',
                baseParams:{
                    tipo:2
                },
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'text'
                    }, {
                        name: 'idestructurae'
                    }
                ]

            }),
            autoLoad:true,
            valueField: 'idestructurae',
            displayField: 'text',
            tabIndex: 3
        });

        this.comboespecialidad = new Ext.form.ComboBox({
            id: '_id',
            anchor: '98%',
            fieldLabel: 'Especialidad',
            allowBlank: true,
            forceSelection: false,
            disabled: true,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 2,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerEspecialidad',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: '_id'
                    }, {
                        name: 'text'
                    }
                ]
            }),
            valueField: '_id',
            displayField: 'text',
            autoLoad:true,
            tabIndex: 5
        });

        this.elementoGasto = new Ext.form.ComboBox({
            id: 'idelementoobjeto',
            anchor: '98%',
            fieldLabel: 'Epigrafe',
            allowBlank: true,
            forceSelection: false,
            disabled: true,
            disabledClass: 'disabled-component',
            mode: 'remote',
            triggerAction: 'all',
            enableKeyEvents: true,
            editable: true,
            pageSize: 100,
            minChars: 3,
            store: this.stgrupo = new Ext.data.JsonStore({
                url: 'obtenerElementosGasto',
                root: 'datos',
                totalProperty: 'cantidad',
                fields: [
                    {
                        name: 'idelementoobjeto'
                    }, {
                        name: 'text'
                    },{
                        name:'concat'
                    }
                ]
            }),
            valueField: 'idelementoobjeto',
            displayField: 'concat',
            autoLoad:true,
            tabIndex: 6
        });

        //panel con los filtros del reporte de la conciliacion
        this.pdatos = new Ext.FormPanel({
            frame: true,
            labelAlign: 'top',
            height: 105,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .3,
                    layout: 'form',
                    items: [this.cbtipoMetdConc]
                },{
                    columnWidth: .2,
                    layout: 'form',
                    items: [this.cbOperacion]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [this.cbxEntidad]
                }]
            },
                {
                  layout: 'column',
                  items: [{
                      columnWidth: .1,
                      layout: 'form',
                      items: [this.labelDoc]
                  },{
                      columnWidth: .3,
                      layout: 'form',
                      items: [this.NAEEdit]
                  },{
                      columnWidth: .3,
                      layout: 'form',
                      items: [this.comboespecialidad]
                  },{
                      columnWidth: .3,
                      layout: 'form',
                      items: [this.elementoGasto]
                  }]
                },
                {
                layout: 'column',
                items: [{
                    columnWidth: .30,
                    layout: 'form',
                    items: [this.cbEjercicio]
                }, {
                    columnWidth: .30,
                    layout: 'form',
                    items: [this.cbPeriodo]
                }, {
                    columnWidth: 0.20,
                    layout: 'form',
                    items: [this.dfDesde]
                }, {
                    columnWidth: .20,
                    layout: 'form',
                    items: [this.dfHasta]
                }]
            }]
        });
        this.btnVistaReporte= new Ext.Button({
            disabled: true,
            id: 'btnImprimir',
//                    icon: perfil.dirImg + 'imprimir.png',
            iconCls: 'vistareporte',
            tooltip: 'Imprimir',//idioma.lbTooltipbtnImprimir,
            text: 'Vista reporte',//idioma.lbImprimir,
            tabIndex: (flujonormal) ? 8 : 7
        });
        // ventana reporte conciliacion
        this.win = new Ext.Window({
            title: 'Reporte',//idioma.lbTitleWin,
            name: 'win',
            id: 'win',
            constrain: true,
            resizable: false,
            bodyStyle: 'padding:5px 5px 5px',
            width: '50%',
            height: 245,
            layout: 'fit',
            modal: true,
            closeAction: 'hide',
            frame: true,
            plain: true,
            items: [this.pdatos],
           // tbar: this.btnAdicionarconMenu,
           // closable: flujonormal,
            buttons: [this.btnVistaReporte,{
                id: 'btncerrar',
//                    icon: perfil.dirImg + 'cerrar.png',
                iconCls: 'cerrar',
                tooltip: 'Cerrar',//idioma.lbBtnTooltipCerrar,
                text: 'Cerrar',//idioma.lbBtnCerrar,
                tabIndex: 7
            },
            ]
        });

        //muestra una mascara dado el texto
        this.MostrarEtiquetas = function(componente, mensaje) {
            this.lMask = new Ext.LoadMask(componente, {
                msg: mensaje
            });
            this.lMask.show();
        };

        //pone etiquetas a los componentes
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

        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);
                var dispUpd = function(picker) {
                    var ad = picker.activeDate;
                    picker.activeDate = null;
                    picker.update(ad);
                };
                if (field.startDateField) {
                    var sd = Ext.getCmp(field.startDateField);
                    sd.maxValue = date;
                    if (sd.menu && sd.menu.picker) {
                        sd.menu.picker.maxDate = date;
                        dispUpd(sd.menu.picker);
                    }
                } else if (field.endDateField) {
                    var ed = Ext.getCmp(field.endDateField);
                    ed.minValue = date;
                    if (ed.menu && ed.menu.picker) {
                        ed.menu.picker.minDate = date;
                        dispUpd(ed.menu.picker);
                    }
                }
                return true;
            }
        });

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

// Ext.Ajax.request({
//     method: "POST",
//     url: "cargaretiquetas",
//     callback: function(options, success, response)
//     {
        var etiquetas = '';//Ext.decode(response.responseText)'';

        //Inicializar el modelo
        var modelo = Presupuesto.Reportes.Model;
        modelo.inicio();

        //Inicializar la vista.
        var vista = Presupuesto.Reportes.View;
        vista.inicio(perfil, etiquetas, modelo);

        //Inicializar controlador.
        Presupuesto.Reportes.Controller.inicio(etiquetas, vista, modelo);
    // }
// });
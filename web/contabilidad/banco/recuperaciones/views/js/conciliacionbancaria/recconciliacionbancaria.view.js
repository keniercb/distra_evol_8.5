/* 
 * @autor Alejandro Mengana Perez
 * Grupo de desarrolladores de CONFIN
 */

Ext.namespace('Banco.Recuperaciones.Conciliacion');

Banco.Recuperaciones.Conciliacion.View = {
    //último parámetro para saber si lo abre por conciliacion o por su fuljo normal
    //true es si esta por el flujo normal y false es cuando se abre por conciliacion
    inicio: function(perfil, idioma, modelo, flujonormal,tipo) {
        console.log(tipo);

        //combo para saber el tipo de conciliacion
        this.cbtipoMetdConc = new Ext.form.ComboBox({
            fieldLabel: idioma.lbtipoMetodoConc,
            disabledClass: 'disabled-component',
            id: 'cbtipoMetdConc',
            resizable: true,
            mode: 'local',
            //disabled : true,
            editable: false,
            selectOnFocus: true,
            store: modelo.stTipoMetdConc,
            valueField: 'idreporte',
            displayField: 'textometdconc',
            forceSelection: true,
            emptyText: 'Seleccione...',
            anchor: '98%',
            enableKeyEvents: true,
            triggerAction: 'all',
            typeAhead: true,
            allowBlank: false,
            tabIndex: 1,

        });
//combo para las cuentas bancarias
        this.cbCtaBanc = new Ext.form.ComboBox({
            // mode: 'local',
            //emptyText: idioma.lbEmptyMsg,
            store: modelo.stCuentaBanc,
            tpl: '<tpl for="."><div ext:qtip="{text}" class="x-combo-list-item">{text}</div></tpl>',
            resizable: true,
            disabledClass: 'disabled-component',
            valueField: 'idcuentabancaria',
            displayField: 'text',
            selectOnFocus: true,
            allowBlank: true,
            typeAhead: true,
            forceSelection: true,
            anchor: '98%',
            fieldLabel:'Cuenta',
            triggerAction: 'all',
            // enableKeyEvents: true,
            // tabIndex: 1
        });

        //combo periodo
        this.cbPeriodo = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            id: 'cbPeriodo',
            forceSelection: true,
            fieldLabel: idioma.lbPeriodo,
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
            tabIndex: 4
        });

        //combo ejercicio
        this.cbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            forceSelection: true,
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
            anchor: '98%',
            tabIndex: 3
        });

        //combo tipo de operacion
        this.cbconcepto = new Ext.form.ComboBox({
            emptyText: idioma.emptyTSleccione,
            id: 'cbconcepto',
            fieldLabel: idioma.lbConcepto,
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
            tabIndex: 2
        });

        //fecha desde
        this.dfDesde = new Ext.form.DateField({
            fieldLabel: idioma.lbDesde,
            name: 'desdeintrv',
            id: 'desdeintrv',
            vtype: 'daterange',
            endDateField: 'hastaintrv',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '98%'
        });

        //fecha hasta
        this.dfHasta = new Ext.form.DateField({
            //fieldLabel: idioma.lbHasta,
            fieldLabel: 'Fecha',
            name: 'hastaintrv',
            id: 'hastaintrv',
            vtype: 'daterange',
            startDateField: 'desdeintrv',
            format: 'd/m/Y',
            readOnly: true,
            anchor: '98%',
            tabIndex: 5
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudarepconciliacion',
            text: idioma.lbBtnAyuda,
            tooltip: idioma.lbTooltipAyuda,
//            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'ayuda'
        });

        /*label para mostrar espacio*/
        this.lbespacio = new Ext.form.Label({
            id: 'lbespacio',
            html: '&nbsp; '
                    //style: 'font-weight:bold;'
        });

        //Combo box con tree grid para cargar las estructuras economicas
        this.cbxEntidad = new Ext.CONT.UIXCombo({
            emptyText: idioma.emptyTSleccione,
            allowBlank: true,
            fieldLabel: idioma.lbEntidad,
            tabIndex: 6,
            disabled: true
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

        //panel con los filtros del reporte de la conciliacion
        if(tipo !=1)
        {
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
                    }, {
                        columnWidth: .5,
                        layout: 'form',
                        items: [this.cbconcepto]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.cbEjercicio]
                    }]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.cbPeriodo]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.dfHasta]
                    }, {
                        columnWidth: .6,
                        layout: 'form',
                        items: [this.cbxEntidad]
                    }]
                }]
            });
        }
        else
        {
            this.pdatos = new Ext.FormPanel({
                frame: true,
                labelAlign: 'top',
                height: 105,
                items: [{
                    layout: 'column',
                    items: [ {
                        columnWidth: .4,
                        layout: 'form',
                        items: [this.cbCtaBanc]
                    }, {
                        columnWidth: .6,
                        layout: 'form',
                        items: [this.cbxEntidad]
                    }]
                }, {
                    layout: 'column',
                    items: [{
                        columnWidth: .4,
                        layout: 'form',
                        items: [this.cbEjercicio]
                    }, {
                        columnWidth: .4,
                        layout: 'form',
                        items: [this.cbPeriodo]
                    }, {
                        columnWidth: .2,
                        layout: 'form',
                        items: [this.dfHasta]
                    }]
                }]
            });
        }


        // ventana reporte conciliacion
        this.win = new Ext.Window({
            title: idioma.lbTitleWin,
            name: 'win',
            id: 'win',
            constrain: true,
            resizable: false,
            bodyStyle: 'padding:5px 5px 5px',
            width: '75%',
            height: 215,
            layout: 'fit',
            modal: true,
            closeAction: 'hide',
            frame: true,
            plain: true,
            items: [this.pdatos],
            tbar: (flujonormal) ? ['->', this.btnAyuda] : [],
            closable: flujonormal,
            buttons: [{
                    id: 'btncerrar',
//                    icon: perfil.dirImg + 'cerrar.png',
                    iconCls: 'cerrar',
                    tooltip: idioma.lbBtnTooltipCerrar,
                    text: idioma.lbBtnCerrar,
                    hidden: (flujonormal) ? false : true,
                    tabIndex: 7
                }, {
                    disabled: true,
                    id: 'btnImprimir',
//                    icon: perfil.dirImg + 'imprimir.png',
                    iconCls: 'vistareporte',
                    tooltip: idioma.lbTooltipbtnImprimir,
                    text: idioma.lbImprimir,
                    tabIndex: (flujonormal) ? 8 : 7
                }
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

Ext.ns('Gestionar.gestreportesinversiones');
Ext.QuickTips.init();

// var perfil = eval(uneval(window.parent.UCID.portal.perfil));
var perfil = window.parent.UCID.portal.perfil;
Gestionar.gestreportesinversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        _this.cmbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 90,
            id: 'idejercicio',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });
        _this.btnAyudaReporteInversiones = new Ext.Button({
            id: 'btnAyudaReporteInversiones',
            text: idioma.btnAyuda,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn'
        });
        _this.btnguardarConfiguracion = new Ext.Button({
            name: 'btnguardarConfiguracion',
            id: 'btnguardarConfiguracion',
            text: 'Guardar configuracion',
            tooltip: 'Guardar configuraci\xF3n',
            iconCls: 'guardar',
            disabled: false
        });
        _this.btnExcel = new Ext.Button({
            name: 'btnExcel',
            id: 'btnExcel',
            text: 'Exportar',
            tooltip: 'Exportar a Excel',
            iconCls: 'ver',
            disabled: true
        });
        _this.btnPdf = new Ext.Button({
            name: 'btnPdf',
            id: 'btnpdf',
            text: 'Emisi&oacute;n',
            tooltip: 'Exportar a EPdf',
            iconCls: 'ver',
            disabled: true
        });
        _this.btnLimpiar = new Ext.Button({
            name: 'btnLimpiar',
            id: 'btnlimpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtros',
            iconCls: 'limpiar',
            disabled: false
        });
        _this.btnGuardarXrpt = new Ext.Button({
            name: 'btnGuardarXrpt',
            id: 'btnguardar',
            text: 'Guardar',
            tooltip: 'Guardar configuraci\xF3n del reporte.',
            iconCls: 'guardar',
            disabled: false,
            style: 'margin-right:10px;margin-top:0px'
        });
        _this.tfAprobado = new Ext.form.TextField({
            pie: true,
            id: 'tfaprobado',
            name: 'tfAprobado',
            xtype: 'textfield',
            anchor: '98%',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            allowBlank: true,
            fieldLabel: 'Aprobado por'
        });
        _this.tfElaborado = new Ext.form.TextField({
            pie: true,
            id: 'tfelaborado',
            name: 'tfElaborado',
            xtype: 'textfield',
            anchor: '98%',
//            style: 'margin-left:10px;margin-top:5.5px',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
//            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.taObservacionReporte = new Ext.form.TextArea({
            pie: true,
            height:72,
            xtype: 'textarea',
            name: 'taObservacionReporte',
            id: 'idobservacionrpt',
            anchor: '98%',
            fieldLabel: 'Observaciones',
            editable: true,
            //style: 'margin-left:0px;margin-top:5.5px'
        });
        //modo de seleccion del grid donde cargo los reportes existentes
        _this.smGReportes = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });
        //grid donde cargo los reportes existentes
        _this.gpReportes = new Ext.grid.GridPanel({
            margins: '3 3 3 3',
            width: 270,
            sm: _this.smGReportes,
            region: 'west',
            title: 'Reportes existentes',
            autoScroll: true,
            collapsible: true,
            stripeRows: true,
            columns: [{
                    dataIndex: 'denominacion',
                    width: 265,
                    header: '',
                    renderer: Cent
                }],
            store: modelo.stGReportesExistentes,
            loadMask: {
                msg: 'Cargando reportes'
            },
            viewConfig: {
                tpl: new Ext.XTemplate(
                        '<tpl>' +
                        '<div class="mouseover">' +
                        '<img class="mouseover/ ><div class="mouseover" style="width:60%;float:left">{descripcion}</div>' +
                        '</div>' +
                        '</tpl>'
                        ),
                enableRowBody: true,
                getRowClass: function(rec, idx, p, store) {
                    p.body = this.tpl.apply(rec.data);
                }
            },
            md: new Ext.menu.Menu({
                items: [{
//                        name: 'btnGuardar',
                        id: 'btnModificarNomRpt',
                        text: 'Modificar',
                        tooltip: 'Modificar denominaci\xF3n.',
                        iconCls: 'modificar'
                    }, {
//                        name: 'btnGuardar',
                        id: 'btnPDFexportar',
                        disabled: true,
                        text: 'Emisi&oacute;n',
                        tooltip: 'Exportar a PDF',
                        iconCls: 'modificar'
                    }
                ]
            })
        });
        function Cent(val) {
            if (val) {
                return '<b>' + val + '</b>';
            }
        }

        _this.cbxOrganismo = new Ext.CONT.UIXCombo({
            name: 'cbxOrganismo',
            //id:'cbxOrganismo',
            emptyText: 'Seleccione...',
            allowBlank: true,
            anchor: '95%',
            fieldLabel: 'Organismo',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Organismo',
            displayText: 'Organismo',
            url: 'cargarTreeNomencladores',
            autoLoad: true,
            singleSelect: false,
            valueField: 'idorganismo',
            reader: this.jrOrganismo = new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigoestructura'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbMedioAmbiente = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Medio Ambiente',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            name: 'cbMedioAmbiente',
            identificador: 'MedioAmbiente',
            valueField: 'idmedioambiente',
            displayText: 'Medio Ambiente',
            url: 'getMedioAmbiente',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrMedioAmbiente = new Ext.data.JsonReader({
                id: 'idmedioambiente',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idmedioambiente'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbObjetivo = new Ext.CONT.UIXCombo({
            name: 'cbObjetivo',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Objetivo',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Objetivo',
            displayText: 'Objetivo',
            url: '/planificacion/inversiones/index.php/inversiones/cargarDatosNomInversion',
            baseParams: {
                idNomInversion: 7,
            },
            autoLoad: true,
            singleSelect: false,
            reader: this.jrObjetivo = new Ext.data.JsonReader({
                id: 'idobjetivo',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idobjetivo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbxEntidad = new Ext.CONT.UIXCombo({
            name: 'cbxEntidad',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Entidad',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'cargarEntidades',
//            autoLoad: true,
            singleSelect: false,
            reader: this.jrEntidad = new Ext.data.JsonReader({
                id: 'idorganismo',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbFormaPropiedad = new Ext.CONT.UIXCombo({
            name: 'cbFormaPropiedad',
            emptyText: 'Seleccione...',
            allowBlank: true,
            anchor: '95%',
            fieldLabel: 'Forma de propiedad',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Formapropiedad',
            valueField: 'idformapropiedad',
            displayText: 'Formapropiedad',
            url: 'getFormaPropiedad',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrFormapropiedad = new Ext.data.JsonReader({
                id: 'idformapropiedad',
                root: 'data'
                
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idformapropiedad'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbEfecto = new Ext.CONT.UIXCombo({
            name: 'cbEfecto',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Efecto',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Efecto',
            displayText: 'Efecto',
            url: 'getEfecto',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrEfecto = new Ext.data.JsonReader({
                id: 'idefectocomercial',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idefectocomercial'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbMoneda = new Ext.CONT.UIXCombo({
            name: 'cbMoneda',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Moneda',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Moneda',
            valueField: 'idmoneda',
            displayText: 'Moneda',
            url: 'getMoneda',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrMoneda = new Ext.data.JsonReader({
                id: 'idmoneda',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idmoneda'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbProvincia = new Ext.CONT.UIXCombo({
            name: 'cbProvincia',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Provincia',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Provincia',
            displayText: 'Provincia',
            url: 'getProvincia',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrProvincia = new Ext.data.JsonReader({
                id: 'idProvincia',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbDesempeno = new Ext.CONT.UIXCombo({
            name: 'cbDesempeno',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Desempe\xF1o',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Desempeno',
            valueField: 'iddatdesempenno',
            displayText: 'Desempeno',
            url: 'getDesempeno',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrDesempeno = new Ext.data.JsonReader({
                id: 'iddatdesempenno',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'iddatdesempenno'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbClasificacion = new Ext.CONT.UIXCombo({
            name: 'cbClasificacion',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Clasificaci\xF3n',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Clasificacion',
            valueField: 'idmoneda',
            displayText: 'idtipoinversion',
            url: 'getClasificacion',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrClasificacion = new Ext.data.JsonReader({
                id: 'idtipoinversion',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idtipoinversion'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.dfFechaInicio = new Ext.form.DateField({
            name: 'dfFechaInicio',
            id: 'idFechaInicio',
            anchor: '95%',
            align: 'right',
            allowBlank: true,
            readOnly: true,
            // vtype: 'rangodefechas',
//            endDateField: 'idFechaFinP',
            //startDateField:'idFechaFinP',
            //anchor: '100%',
            fieldLabel: 'Fecha inicio',
            format: 'd/m/Y'
        });
        _this.cbPrograma = new Ext.CONT.UIXCombo({
            name: 'cbPrograma',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Programa',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Programa',
            displayText: 'Programa',
            url: 'getPrograma',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrPrograma = new Ext.data.JsonReader({
                id: 'idprogramada',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idprogramada'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbTipoInver = new Ext.CONT.UIXCombo({
            name: 'cbTipoInver',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Tipo inversi\xF3n',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Tipoinversion',
            valueField: 'idtipoinversionprograma',
            displayText: 'Tipoinversion',
            url: 'getTipoInv',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrTipoinversion = new Ext.data.JsonReader({
                id: 'idtipoinversionprograma',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idtipoinversionprograma'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.dfFechaFin = new Ext.form.DateField({
            name: 'dfFechaFin',
            id: 'idFechaFin',
            anchor: '95%',
            align: 'right',
            allowBlank: true,
            readOnly: true,
            // vtype: 'rangodefechas',
//            endDateField: 'idFechaFinP',
            //startDateField:'idFechaFinP',
            //anchor: '100%',
            fieldLabel: 'Fecha fin',
            format: 'd/m/Y'
        });
        _this.nfAnosPost = new Ext.form.TextField({
            xtype: 'textfield',
            name: 'nfAnosPost',
            id: 'idAnosposteriores',
            fieldLabel: 'An\xE1lisis post-inv',
            anchor: '95%',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            allowBlank: true,
            regex: /^(\<|\>|\=)?\ \d+$/
//            maskRe: /^(\<|\>|\=)?\ \d+$/
        });
        _this.chViarapida = new Ext.form.Checkbox({
            name: 'chViarapida',
            id: 'idviarapida',
            xtype: 'checkbox',
            disabled: false,
            boxLabel: 'V\xEDa r\xE1pida',
            checked: false,
            hideLabel: true
        });
        _this.chMostrarInversiones = new Ext.form.Checkbox({
            name: 'chMostrarInversiones',
            id: 'idmostrarinversion',
            xtype: 'checkbox',
            disabled: false,
            boxLabel: 'Mostrar inversiones/Desglosar organismo',
            checked: false,
            hideLabel: true
        });
        _this.chEjercicioActual = new Ext.form.Checkbox({
            name: 'chEjercicioActual',
            id: 'idejercicioactual',
            xtype: 'checkbox',
            disabled: false,
            boxLabel: 'Presupuesto',
            checked: false,
            hideLabel: true
        });
        _this.cbQuien = new Ext.CONT.UIXCombo({
            name: 'cbQuien',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Qui\xE9n financia',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Quienfinancia',
            valueField: 'idfinancista',
            displayText: 'Quienfinancia',
            url: 'getQuienfinancia',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrQuienfinancia = new Ext.data.JsonReader({
                id: 'idfinancista',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idfinancista'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbComo = new Ext.CONT.UIXCombo({
            name: 'cbComo',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'C\xF3mo se financia',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Comofinancia',
            displayText: 'Comofinancia',
            url: 'getComofinancia',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrComofinancia = new Ext.data.JsonReader({
                id: 'idComofinancia',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.nfGracias = new Ext.form.TextField({
            /*  name: 'nfGracias',
             fieldLabel: 'Gracia',
             anchor: '95%',
             disabledClass: 'disabled-component',
             selectOnFocus: true,
             regex: /^(\<|\>|\=)?\ \d+$/,
             regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
             allowBlank: true,*/
            name: 'nfGracias',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Gracia'
        });
        _this.nfPlazo = new Ext.form.TextField({
            name: 'nfPlazo',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Plazo de amortizaci\xF3n',
        });
        _this.nfPorciento = new Ext.form.TextField({
            name: 'nfPorciento',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Porciento de inter\xE9s'
        });
        _this.cbComprar = new Ext.CONT.UIXCombo({
            name: 'cbComprar',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Comprar',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Comprar',
            valueField: 'idcomprar',
            displayText: 'Comprar',
            url: 'getComprar',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrComprar = new Ext.data.JsonReader({
                id: 'idcomprar',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idcomprar'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbAquirir = new Ext.CONT.UIXCombo({
            name: 'cbAquirir',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Adquirir',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Aquirir',
            displayText: 'Aquirir',
            url: 'getAquirir',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrAquirir = new Ext.data.JsonReader({
                id: 'idadquisicion',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idadquisicion'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbPais = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Pa\xEDs',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            name: 'cbPais',
            identificador: 'Pais',
            displayText: 'Pais',
            url: 'getPais',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrPais = new Ext.data.JsonReader({
                id: 'idpais',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idpais'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.tfCantEquipo = new Ext.form.TextField({
            name: 'tfCantEquipo',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Cantidad'
        });
        _this.cbOrganoSatisf = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: '\xD3rgano que satisface',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            name: 'cbOrganoSatisf',
            identificador: 'OrganoSatisf',
            displayText: '\xD3rgano que satisface',
            url: 'getOrganoSatisface',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrOrganoSatisf = new Ext.data.JsonReader({
                id: 'idorganosatisface',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganosatisface'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbNivel = new Ext.CONT.UIXCombo({
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Nivel',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            name: 'cbNivel',
            identificador: 'Nivel',
            displayText: 'Nivel',
            url: 'getNivel',
            autoLoad: true,
            singleSelect: true,
            reader: this.jrNivel = new Ext.data.JsonReader({
                id: 'idnivel',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idnivel'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
//
        _this.cbConstructor = new Ext.CONT.UIXCombo({
            name: 'cbConstructor',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Constructor',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'Constructor',
            displayText: 'Constructor',
            url: 'getConstructor',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrConstructor = new Ext.data.JsonReader({
                id: 'idConstructor',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.cbConstructorProv = new Ext.CONT.UIXCombo({
            name: 'cbConstructorProv',
            emptyText: 'Seleccione...',
            //allowBlank: false,
            anchor: '95%',
            fieldLabel: 'Provincia',
            tabIndex: 2,
            xtype: 'treecombo'
        }, {
            identificador: 'ConstructorProv',
            displayText: 'ConstructorProv',
            url: 'getConstructorProv',
            autoLoad: true,
            singleSelect: false,
            reader: this.jrConstructorProv = new Ext.data.JsonReader({
                id: 'idConstructorProv',
                root: 'data'
            }, [{
                    name: '_parent'
                }, {
                    name: '_is_leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idorganismo'
                }, {
                    name: 'nombre'
                }, {
                    name: 'codigo',
                    mapping: 'text'
                }])
        });
        _this.tfErogacion = new Ext.form.TextField({
            name: 'tfErogacion',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Erogaci\xF3n a l\xEDquido'
        });
        _this.tfHabitacionesNuevas = new Ext.form.TextField({
            name: 'tfHabitacionesNuevas',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'F\xEDsico de habitaciones nuevas'
        });
        _this.tfInvProceso = new Ext.form.TextField({
            name: 'tfInvProceso',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Inversiones al inicio del a\xF1o'
        });
        _this.tfFondosBas = new Ext.form.TextField({
            name: 'tfFondosBas',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Fondos b\xE1sicos en explotaci\xf3n'
        });
        _this.tfFisicoToatalEquipos = new Ext.form.TextField({
            name: 'tfFisicoToatalEquipos',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'F\xEDsico total equipos automotores'
        });
        _this.tfCuotaInvproceso = new Ext.form.TextField({
            name: 'tfCuotaInvproceso',
            xtype: 'textfield',
            anchor: '95%', regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Cuota de inversi\xF3n en proceso'
        });
        _this.tfViviendasTerminacion = new Ext.form.TextField({
            name: 'tfViviendasTerminacion',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'F\xEDsico de viviendas terminaci\xF3n'
        });
        _this.tfContratacExterna = new Ext.form.TextField({
            name: 'tfContratacExterna',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Contrataci\xF3n externa'
        });
        _this.tfRendimientoInv = new Ext.form.TextField({
            name: 'tfRendimientoInv',
            xtype: 'textfield',
            anchor: '95%',
            regex: /^(\<|\>|\=)?\ \d+$/,
            regexText: 'Este campo admite un signo de comparaci\xF3n y despu\xE9s un n\xFAmeros',
            allowBlank: true,
            fieldLabel: 'Rendimiento de la inversi\xF3n'
        });
        _this.tfDenomRpt = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '100%',
            allowBlank: true,
            fieldLabel: 'Denominaci\xF3n'
        });
        _this.taObserModRpt = new Ext.form.TextArea({
            xtype: 'textarea',
            id: 'taObserModRpt',
            anchor: '100%',
            fieldLabel: 'Observaci\xF3n'
        });
        _this.btnAceptarModRpt = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Guardar datos y cerrar ventana.'
        });
        _this.btnCancelarModRpt = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cerrar',
            tooltip: 'Cerrar ventana sin guardar los datos.'
        });
        _this.fpModDatosRpt = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            anchor: '100%',
            region: 'center',
            items: [_this.tfDenomRpt, _this.taObserModRpt]
        });
        _this.winModRpt = new Ext.Window({
            title: "Modificar datos del reporte",
            closable: true,
            graggable: false,
            border: false,
            layout: 'border',
            maximized: false,
            width: 350,
            height: 220,
            closeAction: 'hide',
            modal: true,
            frame: true,
            items: [_this.fpModDatosRpt],
            buttons: [_this.btnCancelarModRpt, _this.btnAceptarModRpt]
        });
        _this.fpFiltros = new Ext.FormPanel({
            name: 'fpFiltros',
            labelAlign: 'top',
            frame: true,
            title: 'Filtros',
            autoScroll: true,
            anchor: '95%',
            region: 'center',
            items: [{
                    xtype: 'fieldset',
                    title: 'Datos generales',
                    collapsible: true,
                    autoHeight: true,
                    items: [{
                            layout: 'column',
                            items: [{
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbxOrganismo, _this.cbMedioAmbiente, _this.cbObjetivo, _this.chViarapida]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbxEntidad, _this.cbFormaPropiedad, _this.cbEfecto, _this.chMostrarInversiones]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbMoneda, _this.cbProvincia, _this.cbDesempeno, _this.chEjercicioActual]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbClasificacion, _this.dfFechaInicio, _this.cbPrograma]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbTipoInver, _this.dfFechaFin, _this.nfAnosPost]
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    title: 'Equipo',
                    collapsible: true,
                    autoHeight: true,
                    items: [{
                            layout: 'column',
                            items: [{
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbComprar, _this.cbNivel]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbAquirir]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbPais]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbOrganoSatisf]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.tfCantEquipo]
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    title: 'Constructor',
                    collapsible: true,
                    autoHeight: true,
                    items: [{
                            layout: 'column',
                            items: [{
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbConstructor]
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: [_this.cbConstructorProv]
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    title: 'Acreedores',
                    collapsed: true,
                    collapsible: true,
                    autoHeight: true,
                    items: [{
                        layout: 'column',
                        items: [{
                            columnWidth: .2,
                            layout: 'form',
                            items: [_this.cbQuien]
                        }, {
                            columnWidth: .2,
                            layout: 'form',
                            items: [_this.cbComo]
                        }, {
                            columnWidth: .2,
                            layout: 'form',
                            items: [_this.nfGracias]
                        }, {
                            columnWidth: .2,
                            layout: 'form',
                            items: [_this.nfPlazo]
                        }, {
                            columnWidth: .2,
                            layout: 'form',
                            items: [_this.nfPorciento]
                        }
                        ]
                    }]
                }, {
                    xtype: 'fieldset',
                    title: 'Otros indicadores',
                    collapsible: true,
                    collapsed: true,
                    autoHeight: true,
                    items: [{
                            layout: 'column',
                            items: [{
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfErogacion
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfHabitacionesNuevas
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfInvProceso
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfViviendasTerminacion
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfContratacExterna
                                }
                            ]
                        }, {
                            layout: 'column',
                            items: [{
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfFondosBas
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfFisicoToatalEquipos
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfCuotaInvproceso
                                }, {
                                    columnWidth: .2,
                                    layout: 'form',
                                    items: _this.tfRendimientoInv
                                }
                            ]
                        }
                    ]
                }, {
                    xtype: 'fieldset',
                    id:'pie',
                    checkboxToggle: true,
                    title: 'Pie de p\xE1gina',
                    autoHeight: true,
                    collapsed: true,
                    buttons:[_this.btnGuardarXrpt],
                    items: [{
                            layout: 'column',
                            items: [{
                                    columnWidth: .4,
                                    layout: 'form',
                                    items: [_this.tfAprobado,_this.tfElaborado]
                                }, {
                                    columnWidth: .6,
                                    layout: 'form',
                                    items: [_this.taObservacionReporte]
                                }
                            ]
                        }
                    ]
                }]
        }) ;
        _this.pGeneral = new Ext.Panel({
            scope: this,
            layout: 'border',
            border: false, width: 200,
            tbar: [_this.btnLimpiar/*, _this.btnguardarConfiguracion*/, _this.btnPdf, _this.btnExcel, '->', 'Ejercicio:', _this.cmbEjercicio, '->', _this.btnAyudaReporteInversiones],
            items: [_this.gpReportes, _this.fpFiltros]
        });
        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneral]
        });
    }
};

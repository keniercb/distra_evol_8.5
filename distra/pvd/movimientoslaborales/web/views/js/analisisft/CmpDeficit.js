/**
 * @name analisisft.Dashboard - Inicio.
 * @package Pvd.MovimientosLaborales.
 * @uses Pvd.MovimientosLaborales.Analisisft
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 *         Orestes Rodríguez Lorenzo
 * @version 1.0
 */
Ext.ns('Pvd.MovimientosLaborales.Analisisft');
Pvd.MovimientosLaborales.Analisisft.CmpDeficit = Ext.extend(Ext.Panel,{
    layout: 'fit',
    id: 'CmpDeficit',
    region: 'center',
    height: '100%',
    autoScroll: true,
    closable: false,
    initComponent: function () {
        var idioma = {
            es: {
                btnConfigText: 'Configurar',
                btnConfigTtip: 'B&uacute;squeda avanzada',
                btnExportText: 'Exportar',
                btnExportTtip: 'Exportar a PDF',
                winConfigTitle: 'Configurar b&uacute;squeda',
                btnCancelText: 'Cancelar',
                btnCancelTtip: '',
                btnBuscarText: 'Buscar',
                btnBuscarTtip: '',
                fLabEstruct: 'Estructura organizativa',
                fLabFecha: 'Fecha',
                fSetTitle: 'Opciones de integraci&oacute;n',
                fLabChBoxDemanda: 'Demanda de la fuerza de trabajo',
                fLabChBoxAsistencia: 'Registro de asistencia',
                gridpanelColCargo: 'Cargo',
                gridpanelColPlantilla: 'Por plantilla',
                gridpanelColCubiertos: 'Cubiertos',
                gridpanelColDemanda: 'Demanda',
                gridpanelColAsistencia: 'Asistencia',
                gridpanelColDeficit: 'Deficit',
                gridpanelBbarEstructura: '<b>Estructura organizativa: </b>',
                gridpanelBbarFecha: '<b>Fecha: </b>',
                maskTextLoad: 'Cargando datos del reporte...'
            }
        };
        var fecha = new Date();
        var form = new Ext.FormPanel({
            bodyStyle: 'padding:5px 5px 0',
            frame: true,
            items: [
                new Ext.components.TreeComboBox({
                    allowBlank: false,
                    anchor: '100%',
                    fieldLabel: idioma.es.fLabEstruct,
                    treeConfig: {
                        autoScroll: true,
                        border: false,
                        loader: new Ext.tree.TreeLoader({
                            dataUrl: 'obtenerEstructura',
                            preloadChildren: false
                        }),
                        rootVisible: false
                    }
                }),
                new Ext.form.DateField({
                    allowBlank: false,
                    anchor: '100%',
                    fieldLabel: idioma.es.fLabFecha,
                    format: 'd/m/Y',
                    id: 'deficit_dffecha',
                    maxValue: fecha.format('d/m/Y'),
                    readOnly: true,
                    value: fecha.format('d/m/Y')
                }),
                new Ext.form.FieldSet({
                    autoHeight: true,
                    items: [
                        new Ext.form.Checkbox({
                            boxLabel: idioma.es.fLabChBoxDemanda,
                            hideLabel: true
                        }),
                        new Ext.form.Checkbox({
                            boxLabel: idioma.es.fLabChBoxAsistencia,
                            hideLabel: true
                        })
                    ],
                    title: idioma.es.fSetTitle
                })
            ],
            labelAlign: 'top'
        });
        
        var winConfig = new Ext.Window({
            buttons: [
                new Ext.Button({
                    handler: function () {
                        winConfig.hide();
                    },
                    iconCls: 'cancelar',
                    text: idioma.es.btnCancelText,
                    tooltip: idioma.es.btnCancelTtip
                }),
                new Ext.Button({
                    handler: function () {
                        var formulario = form.getForm();
                        var treeField = formulario.items.items[0];
                        var dateField = formulario.items.items[1];
                        var demandaField = formulario.items.items[2];
                        var asistenciaField = formulario.items.items[3];

                        var idestructura = treeField ? (treeField.getValue ? treeField.getValue() : treeField.value) : 0;
                        var estructura = treeField ? (treeField.getRawValue ? treeField.getRawValue() : treeField.fieldLabel) : '';
                        var fechaVal = '';
                        if (dateField) {
                        var d = dateField.getValue ? dateField.getValue() : dateField.value;
                        fechaVal = d && d.format ? d.format('d/m/Y') : (d || '');
                        }
                        var demanda = (demandaField && demandaField.checked) ? 1 : 0;
                        var asistencia = (asistenciaField && asistenciaField.checked) ? 1 : 0;

                        obtenerReportDeficit(idestructura, estructura, fechaVal, demanda, asistencia);
                        winConfig.hide();
                    },
                    iconCls: 'buscar',
                    text: idioma.es.btnBuscarText,
                    tooltip: idioma.es.btnBuscarTtip
                })
            ],
            closeAction: 'hide',
            items: [form],
            modal: true,
            title: idioma.es.winConfigTitle,
        });
        this.tbar = [
            new Ext.Button({
                iconCls: 'buscaravanzada',
                handler: function () {
                    winConfig.show();
                },
                text: idioma.es.btnConfigText,
                tooltip: idioma.es.btnConfigTtip
            }),
            new Ext.Button({
                iconCls: 'exportar',
                text: idioma.es.btnExportText,
                tooltip: idioma.es.btnExportTtip,
                handler: function () {
                    let formulario = form.getForm();
                    var treeField = formulario.items.items[0];
                    var dateField = formulario.items.items[1];
                    var demandaField = formulario.items.items[2];
                    var asistenciaField = formulario.items.items[3];
                    
                    var idestructura = treeField ? (treeField.getValue ? treeField.getValue() : treeField.value) : 0;
                    var estructura = treeField ? (treeField.getRawValue ? treeField.getRawValue() : treeField.fieldLabel) : '';
                    var fechaVal = '';
                    if (dateField) {
                    var d = dateField.getValue ? dateField.getValue() : dateField.value;
                    fechaVal = d && d.format ? d.format('d/m/Y') : (d || '');
                    }
                    var demanda = (demandaField && demandaField.checked) ? 1 : 0;
                    var asistencia = (asistenciaField && asistenciaField.checked) ? 1 : 0;                

                    exportarDeficit(idestructura, estructura, fechaVal, demanda, asistencia);
                
                }
            })
        ];
        
        function exportarDeficit(idestructura, estructura, fecha, demanda, asistencia) {

            let params = Ext.urlEncode({
                idestructura:idestructura,
                demanda:demanda,
                asistencia:asistencia,
                estructura:estructura,
                fecha:fecha,

               });//console.log(params)
            let idIframe = Ext.id();

            new Ext.Window({
                title: 'Deficit de la Fuerza de Trabajo',
                width: '100%',
                height: '100%',
                id: 'windeficit',
                maskDisabled: false,
                animCollapse: false,
                maximizable: true,
                constrain: true,
                border: false,
                modal: true,
                items: {
                    xtype: 'component',
                    autoEl: {
                        tag: 'iframe',
                        id: idIframe,
                        style: 'height: 100%; width: 100%; border: none',
                        src: document.location.protocol + '//' + document.location.host +
                        '/pvd/movimientoslaborales/index.php/analisisft/exportarDeficit?' + params
                    }
                }
            }).show();
            Ext.getCmp('windeficit').maximize();
            Ext.getBody().mask('Por favor espere...');
            //PVD.mostrarMascara('rep01', 'Por favor espere...', 'Generando registro de altas.');
            document.getElementById(idIframe).onload = function () {
                //PVD.ocultarMascara('rep01');
                Ext.getBody().unmask()
            }
              
            
        }

        var filtroEstructura, filtroFecha = '';
        function obtenerReportDeficit(idestructura, fecha, demanda, asistencia) {
            Ext.getBody().mask('Guardando suplemento...');
            Ext.Ajax.request({
                params: {
                    idestructura: idestructura,
                    fecha: fecha,
                    demanda:demanda,
                    asistencia:asistencia
                },
                callback: function () {
                    Ext.getBody().unmask(idioma.es.maskTextLoad);
                },
                success: function (r) {
                    var responseData = Ext.decode(r.responseText);
                    filtroEstructura = responseData.filtros.estructura;
                    filtroFecha = responseData.filtros.fecha;
                    stDeficit.loadData(responseData.datos);
                },
                url: 'obtenerReporteDeficit',
            });
        }
        var stDeficit = new Ext.data.SimpleStore({
            fields: [
                {name: 'idnomcargo'},
                {name: 'cargo'},
                {name: 'plantilla'},
                {name: 'cubierto'},
                {name: 'deficit'}
            ]
        });
        obtenerReportDeficit();
        this.items = [new Ext.grid.GridPanel({
            bbar: [idioma.es.gridpanelBbarEstructura + filtroEstructura, '-', idioma.es.gridpanelBbarFecha + filtroFecha],
            columns: [
                {dataindex: 'cargo', hidden:true},
                {header: idioma.es.gridpanelColCargo, dataindex: 'cargo', width:300},
                //{header: idioma.es.gridpanelColDemanda},
                {header: idioma.es.gridpanelColPlantilla, dataindex: 'plantilla', align: 'right'},
                {header: idioma.es.gridpanelColCubiertos, dataindex: 'cubierto', align: 'right'},
                //{header: idioma.es.gridpanelColAsistencia},
                {header: idioma.es.gridpanelColDeficit, dataindex: 'cubierto', align: 'right'}
            ],
            sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
            store: stDeficit
        })];
        Pvd.MovimientosLaborales.Analisisft.CmpDeficit.superclass.initComponent.call(this);
    }
});
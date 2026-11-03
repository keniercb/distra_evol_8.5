Ext.ns('Pvd.ControlAsistencia.Asistencia');
//Vista del componente.
Pvd.ControlAsistencia.Asistencia.Vista = {

    init: function (idioma, modelo) {
        var fech = document.getElementById('fecha').getAttributeNode('value').value;
        this.fecha = new Date(fech.split('/')[2], fech.split('/')[1] - 1, fech.split('/')[0]);
        this.diasiguiente = new Date(fech.split('/')[2], fech.split('/')[1] - 1, parseInt(fech.split('/')[0]) + 1);
        this.store;
        this.nodeSelected;
        this.nodeSelectedps;
        this.nodeSelectedss;
        var self = this;
        this.record = null;
        this.recordps = null;
        this.recordss = null;
		this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg:"Cargando datos..."});


        this.fechaBuscar = new Ext.form.DateField({
            id: 'fecha',
            name: 'fecha',
            labelSeparator: ':',
            format: 'd/m/Y',
            readOnly: true,
            width: 160,
            allowBlank: false,
            value: this.fecha.format('d/m/Y'),
            //maxValue: this.fecha.format('d/m/Y'),
            blankText: idioma.lbCampoVacio
        });

        this.cbturno = new Ext.form.ComboBox({
            store: modelo.storeTurnoTrabajo,
            fieldLabel: 'Turno de trabajo',
            displayField:'denominacion',
            typeAhead: true,
            mode: 'local',
            enableKeyEvents:true,
            emptyText: 'Seleccione...',
            width: 200,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus:true,
            valueField:'idturnotrabajop',
            name:'idturnotrabajop',
            hiddenname:'idturnotrabajop'
        });

        //Boton para limpiar.
        this.btnLimpiarturno = new Ext.Button({
            id: 'btnLimpiarturno',
            text: 'Limpiar',
            tooltip: 'Limpiar turno',
            iconCls: 'limpiar'
        });

        this.smPersonas = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });

        //textfield para el buscar
        this.tfbuscar = new Ext.form.TextField({
            id: 'tfbuscar',
            allowBlank: true,
            emptyText: idioma.lbEmptyTextBuscar,
            minLength: 3,
            maxLength: 60,
            enableKeyEvents: true,
            maskRe: /^([a-zA-ZáéíóúñüÑ\d\s]+ ?[a-zA-ZáéíóúñüÑ\d\s]*)+$/,
            width: 140,
            name: 'tfbuscador'
        });

        //Boton para Buscar.
        this.btnBuscar = new Ext.Button({
            id: 'btnBuscar',
            text: idioma.btnBuscarDenom,
            tooltip: idioma.lbbtnBuscar,
            iconCls: 'buscar'
        });

        //Boton para limpiar.
        this.btnLimpiar = new Ext.Button({
            id: 'btnLimpiar',
            text: idioma.btnLimpiar,
            tooltip: idioma.lbbtnLimpiar,
            iconCls: 'limpiar'
        });

        //Campos del editor del grid

        this.desdeentrada = new Ext.form.DateField({
            id: 'desdeentrada',
            name: 'fentrada',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            value: this.fecha.format('d/m/Y'),
            minValue: this.fechaBuscar.getValue(),
            maxValue: this.fechaBuscar.getValue()
        });

        this.horaentrada = new Ext.form.TimeField({
            id: 'horaentrada',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '08:00',
            invalidText: idioma.lbRegexText
        });

        this.hastasalida = new Ext.form.DateField({
            id: 'hastasalida',
            name: 'fsalida',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            minValue: this.fecha.format('d/m/Y'),
            value:this.fecha.format('d/m/Y'),
        });

        this.horasalida = new Ext.form.TimeField({
            id: 'horasalida',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '17:00',
            invalidText: idioma.lbRegexText
        });

        this.horaentradaps = new Ext.form.TimeField({
            id: 'horaentradaps',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '08:00',
            invalidText: idioma.lbRegexText
        });

        this.horasalidaps = new Ext.form.TimeField({
            id: 'horasalidaps',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '17:00',
            invalidText: idioma.lbRegexText
        });

        this.horaentradass = new Ext.form.TimeField({
            id: 'horaentradass',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '08:00',
            invalidText: idioma.lbRegexText
        });

        this.horasalidass = new Ext.form.TimeField({
            id: 'horasalidass',
            width: '80',
            name: 'time',
            format: 'H:i',
            minValue: '00:00',
            maxValue: '23:59',
            value: '17:00',
            invalidText: idioma.lbRegexText
        });

        this.desde = new Ext.form.DateField({
            id: 'desde',
            name: 'fdesde',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            value: this.fecha.format('d/m/Y'),
            minValue: this.fechaBuscar.getValue(),
            maxValue: this.fechaBuscar.getValue()
        });

        this.hasta = new Ext.form.DateField({
            id: 'hasta',
            name: 'fhasta',
            format: 'd/m/Y',
            readOnly: false,
            width: 160,
            allowBlank: true,
            minValue: this.fecha.format('d/m/Y')
        });

        this.hrsdescontadas = new Ext.form.TextField({
            id: 'hrsdescontadas',
            name: 'hrsdescontadas',
            hiddenname: 'hrsdescontadas',
            maxLength: 2,
            maxLengthText: idioma.MaxLengthHora,
            prevTab: 'btnAceptar',
            nextTab: 'fechainicio',
            regex: /^([0-9]+ ?[0-9]*)+$/,
            regexText: idioma.regexTexthora,
            anchor: '96%',
            allowBlank: true
        });

        this.observacion = new Ext.form.TextArea({
            name: 'observacion',
            id: 'observacion',
            anchor: '96%',
            hiddenname: 'observacion',
            maxLength: 255,
            maxLengthText: idioma.maxLengthTextArea
        });

        this.btnAct = new Ext.Button({
            id: 'btnActualizar',
            text: 'Recargar',
            tooltip: 'Recargar listado',
            //disabled:true,
            iconCls: 'recargar'
        });

        this.expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(
                '<p><b>Observaci&oacute;n:</b> {observacion}</p><br>'
            )
        });

        var _self = this;

        //Campos del editor del grid


        function formatDate(value, metaData, record, rowIndex, colIndex, store) {
            if (value) {
                if (record.get('presente') == 0) {
                    return (value instanceof Date) ? '<i><b>' + value.format('d/m/Y') + '</i></b>' : '<i><b>' + value + '</i></b>';
                } else {
                    return (value instanceof Date) ? value.format('d/m/Y') : value;
                }
            } else {

            }
        };

        _this = this;
        function combo(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                var valor = "";
                var color = '#ffffff';
                if (record.get('presente') == 0) {
                    return '<span  style=" font-size: small; color:' + record.data.color + '"><b><i>' + record.data.denominacion + '</i></b></span>';
                }

                return '<span  style=" font-size: small; color:' + record.data.color + '"><b>' + record.data.denominacion + '</b></span>';
            }
            else
                return val;
        }

        function horas(val, metaData, record, rowIndex, colIndex, store) {
            if (val) {
                var fh = val.split(' ');
                if (record.get('presente') == 0) {
                    if (fh.length > 1) {
                        var horacompleta = fh[1].split(':');
                        return '<i><b>' + horacompleta[0] + ':' + horacompleta[1] + '</b></i>';
                    }
                    else {
                        return '<i><b>' + val + '</b></i>';
                    }
                } else {
                    if (fh.length > 1) {
                        var horacompleta = fh[1].split(':');
                        return horacompleta[0] + ':' + horacompleta[1];
                    }
                    else {
                        return val;
                    }

                }

            }
            else {

            }

        }

        function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if (record.get('presente') == 0 && val != null) {
                return '<i><b>' + val + '</b></i>';
            } else {
            }
            return val;
        }

        function  controlador(val, metaData, record, rowIndex, colIndex, store) {
            if (record.data.actualizado == 1) {
                val = 'Control de Acceso';
                return val;
            }else{
                return val;
            }

        }

        this.btnGuardar = new Ext.Button({
            id: 'btnGuardar',
            text: idioma.btnGuardar,
            tooltip: idioma.ttbtnGuardar,
            iconCls: 'guardar'
        });

        this.btnActualizar = new Ext.Button({
            id: 'btnActualizar',
            text: 'Control de Acceso',
            tooltip: 'Actualizar los datos de la asistencia',//idioma.ttbtnActualizar,
            iconCls: 'planificar'
        });

        //Boton para Certificar la asistencia.
        this.btnCertificar = new Ext.Button({
            id: 'btnCertificar',
            text: idioma.btnCertificarDenom,
            tooltip: idioma.lbbtnCertificar,
            iconCls: 'certificacion',
            hidden:false,
            disabled: true
        });

       /* this.btnQuitarCertificacion = new Ext.Button({
            id: 'btnQuitarCertificacion',
            text: idioma.btnQuitarCertificacion,
            tooltip: idioma.lbbtnQuitarCertificacion,
            iconCls: 'certificacion',
            hidden:false,
            disabled: true
        });*/

       /* this.btnCertificar = new Ext.Toolbar.MenuButton({
            text: 'Certificación',
            id: 'btnCertificacion',
            disabled: true,
			hidden:true,
            iconCls: 'certificacion',
            menu: {items: [
                {text: idioma.btnCertificarDenom, iconCls: 'certificacion', icon: '', id: 'btnCertificar'},
                {text: idioma.btnQuitarCertificacion, iconCls: 'certificacion', icon: '', id: 'btnQuitarCertificacion'}
            ]}
        });*/

        this.btnEliminar = new Ext.Button({
            id: 'btnEliminar',
            text: 'Borrar asistencia',
            tooltip: 'Borrar asistencia del día',
            iconCls: 'borrar',
            hidden:false,
            disabled: true
        });

        this.btnCausas = new Ext.Button({
            id: 'btnCausas',
            text: 'Multiples causas',
            tooltip: 'Multiples causas en el día',
            iconCls: 'adicionar',
            hidden:true,
            disabled: true
        });

        //Para resumen de asistencia
        this.btnResumen = new Ext.Button({
            id: 'btnResumen',
            text: idioma.btnResumen,
            tooltip: idioma.ttbtnResumen,
            iconCls: 'reportes'
        });

        this.btnAyuda = new Ext.Button({
            id: 'btnAyudaAsistencia',
            text: idioma.btnAyuda,
            iconCls: 'ayuda',
            disabled: false,
            tooltip: idioma.lbBtnAyuda
        });

        this.Maskara = new Ext.LoadMask(Ext.getBody(), {msg: "Cargando datos..."});

        this.smResumen = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.btnExportar = new Ext.Button({
            id: 'btnExportar',
            text: idioma.btnExportar,
            iconCls: 'exportar',
            disabled: false,
            tooltip: idioma.lbbtnExportar
        });

        this.ListadoResumen = new Ext.grid.GridPanel({
            id: 'listadoResumen',
            store: modelo.stListadoResumen,
            width: '60%',
            sm: this.smResumen,
            stripeRows: true,
            view: new Ext.grid.GroupingView({
                groupByText: ' ',
                groupTextTpl: '{text} ({[values.rs.length]})'
            }),
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idpersona', width: 100, hidden: true, hideable: false, dataIndex: 'idpersona'},
                {header: 'Causa', hidden: true, width: 100, dataIndex: 'causa'},
                {header: 'No.Identidad', width: 100, dataIndex: 'numid'},
                {header: 'Nombre y apellidos', width: 200, dataIndex: 'nombreapellidos'},
                {header: 'Cargo', width: 250, dataIndex: 'denomcargo'},
                {header: 'Área', width: 250, dataIndex: 'denomarea'},
                {
                    header: 'Hora de entrada',
                    width: 100,
                    dataIndex: 'fechahoraentrada',
                    editor: this.horaentrada,
                     renderer: horas
                },
                {
                    header: 'Hora de salida',
                    width: 100,
                    dataIndex: 'fechahorasalida',
                    editor: this.horasalida,
                     renderer: horas
                },

                {header: 'Desde', width: 100, dataIndex: 'fdesde', editor: this.desde, renderer: formatDate},
                {header: 'Hasta', width: 100, dataIndex: 'fhasta', editor: this.hasta, renderer: formatDate},
                {header: 'fecharegistro', width: 100, dataIndex: 'fecharegistro', hidden: true, hideable: false},
                {
                    header: 'Horas descontadas',
                    width: 130,
                    dataIndex: 'hrsdescontadas',
                },
                {header: 'Horas extras', width: 100, dataIndex: 'horasextras'}
            ],
            bbar: new Ext.PagingToolbar({
                pageSize: 15,
                store: modelo.stListadoResumen,
                displayInfo: true,
                displayMsg: 'Resultados {0} - {1} de {2}',
                emptyMsg: "Ning&uacute;n resultado para mostrar"
            })

        });

        this.plantillaResumen = new Ext.XTemplate(
            '<div >',
            '<tpl for=".">',
            '<p><center><b>RESUMEN</b></center></p>',
            '<p><b>Presentes:</b> {presentes}<br/>',
            '<b>Ausentes:</b> {ausentes}</p><br/>',
            '</tpl>',
            '</div>'
        );
        this.plantillaResumen.compile();
        var defecto = {
            presentes: 'x',
            ausentes: 'y'
        };

        this.panelResumen = new Ext.Panel({
            id: 'panelResumen',
            layout: 'fit',
            frame: true,
            region: 'west',
            width: 200,
            margins: '0 0 0 0',
            listeners: {
                render: function () {
                    this.plantillaResumen.overwrite(this.panelResumen.body, defecto);
                }.createDelegate(this)
            }
        });


        this.graficaResumen = new Ext.components.HighchartPanel({
            id: 'graficaResumen',
            border: true,
            tbar: ['frafica'],
            layout: 'fit',
            chartType:'column',
            chartDatas:{name:'sin datos',data:[['data',0]]},
            chartTitle:'Gráfica',
            chartCategories:['Causas de ausencia']
        });

        this.winResumen = new Ext.Window({
            title: idioma.winResumenTitle,
            closable: true,
            constrain: true,
            modal: true,
            closeAction: 'hide',
            plain: true,
            layout: 'border',
            items: [
                {
                    region: 'center',
                    layout: 'fit',
                    split: true,
                    width: '65%',
                    margins: '0 0 0 0',
                    items: [{
                        region: 'center',
                        layout: 'fit',
                        // minSize: 400,
                        split: true,
                        width: '65%',
                        margins: '0 0 0 0',
                        items: [this.ListadoResumen]
                    }]
                },
                {
                    region: 'east',
                    split: true,
                    layout: 'fit',
                    collapsible: true,
                    title: 'Gráfica',
                    width: '25%',
                    margins: '0 0 0 0',
                    items: [this.graficaResumen]
                }]
        });
        //Para resumen de asistencia

        //Botón para adicionar.
        this.btnAdicionarCausa = new Ext.Button({
            id: 'btnAdd',
            text: 'Adicionar',
            tooltip: 'Adicionar causa',
            iconCls: 'adicionar'
        });

        //Boton para modificar.
        this.btnModificarCausa = new Ext.Button({
            id: 'btnUpd',
            text: 'Modificar',
            tooltip: 'Modificar causa',
            iconCls: 'modificar',
            disabled:true
        });

        //Boton para eliminar.
        this.btnEliminarCausa = new Ext.Button({
            id: 'btnDel',
            text: 'Eliminar',
            tooltip: 'Eliminar causa',
            iconCls: 'eliminar',
            disabled:true
        });

        function ActivarColores(val, metaData, record, rowIndex, colIndex, store) {
            if(record.get('afectasalario') == 1)
                return '</center></span><span style=" color:' + '#c30703' + '">' + val + '</span>';
            else
                return '</center></span><span style=" color:' + '#33aa33' + '">' + val + '</span>';

        }

        this.smgridlistadoCausas = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        this.listadoCausas = new Ext.grid.GridPanel({
            id: 'listadoCausas',
            store: modelo.storeMultiplesCausas,
            loadMask: {msg: 'Cargando...'},
            region: 'center',
            width:'35%',
            layout: 'fit',
            stripeRows: true,
            sm: this.smgridlistadoCausas,
            height: 527,
            columns: [new Ext.grid.RowNumberer(),
                {header: 'idcausa', width: 100, hidden: true, dataIndex: 'idcausa', id: 'idcausa'},
                {header: 'idasistencia', width: 100, hidden: true, dataIndex: 'idasistencia'},
                {header: 'Causa', width: 150, dataIndex: 'denomcausa'},
                {header: 'Hora entrada', width: 100, dataIndex: 'horaentradamc'},
                {header: 'Hora salida', width: 100, dataIndex: 'horasalidamc'},
                {header: 'Horas', width:100, dataIndex: 'horas',renderer: ActivarColores},
                {header: 'Observaciones', width:100, dataIndex: 'observaciones'},
                {header: 'afectasalario', width:100, hidden: true, dataIndex: 'afectasalario'}
            ],
            tbar: [this.btnAdicionarCausa, this.btnModificarCausa, this.btnEliminarCausa]
        });

        this.panelcausas = new Ext.Panel({
             items: this.listadoCausas,
             id:'panelcausas',
             split:true,
             title: 'Causas en el día',
             region: 'east',
             layout: 'fit',
             width: '40%',
             collapsible: true,
             collapsed: true,
             frame: false,
             hidden:true,
             margins: '0 0 0 0',
             cmargins: '0 0 0 0'
        });

        var _self = this;
        // this.causasausenciamc = new Ext.components.TreeComboBox({
        //     anchor: '99%',
        //     editable: true,
        //     id: 'idcausa',
        //     name: 'denomcausa',
        //     enableKeyEvents: true,
        //     allowBlank : false,
        //     fieldLabel: 'Causa',
        //     treeConfig: {
        //         rootVisible: false,
        //         loader: modelo.TreePanelLoader,
        //         border: false,
        //         autoScroll: true
        //     },
        //     listeners: {
        //         keypress: function (tf, e) {
        //             if (e.getKey() == 8 || e.getKey() == 46) {
        //                 _self.causasausenciamc.valueNotFoundText = '';
        //                 _self.causasausenciamc.setValue(null);
        //                 if (_self.causasausenciamc.isExpanded())
        //                     _self.causasausenciamc.collapse();

        //             }

        //         }
        //     }
        // })

        
        // var fechaActual = this.fechaBuscar.getValue();
        // var fechaActualFi = this.fechaBuscar.getValue();
        // fechaActualFi.setHours(fechaActual.getHours() + 48);

        // this.horaentradamc = new Ext.form.TimeFieldMod({
        //     id: 'horaentradamc',
        //     anchor: '97%',
        //     fieldLabel  : 'Hora entrada',
        //     name: 'horaentradamc',
        //     hiddenname:'horaentradamc',
        //     emptyText: 'Seleccione...',
        //     format: 'Y-m-d H:i',
        //     // minValue: '00:00',
        //     // minValue: fechaActual,
        //     // maxValue: '23:59',
        //     listWidth: 130,
        //     // maxValue: fechaActualFi,
        //     enableKeyEvents: true,
        //     //value:'08:00',
        //     invalidText: 'El formato de la hora es hora:minutos (24 horas)',
        //     allowBlank : false,
        //     blankText: idioma.lbCampoVacio
        // });

        // this.horasalidamc = new Ext.form.TimeFieldMod({
        //     id: 'horasalidamc',
        //     anchor: '97%',
        //     name: 'horasalidamc',
        //     hiddenname:'horasalidamc',
        //     fieldLabel  : 'Hora salida',
        //     emptyText: 'Seleccione...',
        //     format: 'Y-m-d H:i',
        //     // minValue: fechaActual,
        //     enableKeyEvents: true,
        //     // maxValue: fechaActualFi,
        //     listWidth: 130,
        //     //value:'17:00',
        //     invalidText: 'El formato de la hora es hora:minutos (24 horas)',
        //     allowBlank : false,
        //     blankText: idioma.lbCampoVacio
        // });

        // this.observacionmc = new Ext.form.TextArea({
        //     name: 'observacionesmc',
        //     fieldLabel: 'Observaciones',
        //     id: 'observacionesmc',
        //     anchor: '99%',
        //     hiddenname: 'observaciones',
        //     maxLength: 255,
        //     height:75,
        //     maxLengthText: idioma.maxLengthTextArea
        // });

        
        // this.formulariomc = new Ext.FormPanel({
        //     labelAlign: 'top',
        //     frame:true,
        //     width : '100%',
        //     autoHeight:true,
        //     autoShow:true,
        //     items:[
        //         {
        //             layout:'column',
        //             items:[{
        //                 columnWidth:1.0,
        //                 layout: 'form',
        //                 items: [this.causasausenciamc]
        //             },{
        //                 columnWidth:.5,
        //                 layout: 'form',
        //                 items: [this.horaentradamc]
        //             },{
        //                 columnWidth:.5,
        //                 layout: 'form',
        //                 items: [this.horasalidamc]
        //             },{
        //                 columnWidth:1.0,
        //                 layout: 'form',
        //                 items: [this.observacionmc]
        //             }]
        //         }]
        // });

        // this.btnCancelar = new Ext.Button({
        //     id:'btnCancelar',
        //     iconCls:'cancelar',
        //     tooltip:'Cancelar',
        //     prevTab: 'descripcion',
        //     nextTab: 'btnAplicar',
        //     text:'Cancelar'
        // });

        // this.btnAplicar = new Ext.Button({
        //     id:'btnAplicar',
        //     iconCls:'aplicar',
        //     hidden: true,
        //     prevTab: 'btnCancelar',
        //     nextTab: 'btnAceptar',
        //     text:'Aplicar',
        //     tooltip:'Aplicar'
        // });

        // this.btnAceptar = new Ext.Button({
        //     id:'btnAceptar',
        //     iconCls:'aceptar',
        //     prevTab: 'btnAplicar',
        //     nextTab: 'denominacion',
        //     text:'Aceptar',
        //     tooltip:'Aceptar'
        // });

        // this.ventanamc = new Ext.Window({
        //     title:'Provisional',
        //     layout:'fit',
        //     width : 450,
        //     height :270,
        //     constrain: true,
        //     closable:true,
        //     resizable:false,
        //     closeAction: 'hide',
        //     items:[this.formulariomc],
        //     modal: true,
        //     buttons: [this.btnCancelar, this.btnAplicar, this.btnAceptar]
        // });

        this.listadoAsistencia = new Ext.Panel({
            layout: 'fit',
        });

        this.vp = new Ext.Viewport({
            layout: 'border',
            items: [{
                region: 'center',
                id:'panelp',
                layout: 'fit',
                frame:true,
                tbar: [this.btnGuardar, '-', idioma.fecha, this.fechaBuscar,'-','Turno: ',this.cbturno,this.btnLimpiarturno, this.btnActualizar,'->', /*this.btnResumen,*/ this.btnAyuda],
                items: [this.listadoAsistencia]
            },this.panelcausas
            ]
        });


    }
};

Ext.form.TimeFieldMod = Ext.extend(Ext.form.TimeField, {
    maximaFecha: undefined,
    minimaFecha: undefined,
    arrRemoveInicioFin: [],
    actualizarMinMaxValue: function (dateMin, dateMax) {
        this.setValue('');
        var min = this.parseDate(dateMin);
        var max = this.parseDate(dateMax);
        var times = [];

        while(min <= max){
            times.push([min.dateFormat(this.format)]);
            min = min.add('mi', this.increment);
        }

        this.store.removeAll();
        
        this.store.loadData(times);

        this.minimaFecha = undefined;
        this.maximaFecha = undefined;

        this.removeDataByArrInicioFin();
    },
    removeDataByArrInicioFin: function () {

        for (let index = 0; index < this.arrRemoveInicioFin.length; index++) {
            const element = this.arrRemoveInicioFin[index];
            
            this.removeDataByInicioFin(element[0], element[1]);
        }
    },
    removeDataByInicioFin: function (dateMin, dateMax) {
        let min = this.parseDate(dateMin);
        let max = this.parseDate(dateMax);

        if (!this.minimaFecha) {
            this.minimaFecha = min;
        } else if (min < this.minimaFecha) {
            this.minimaFecha = min;
        }

        if (!this.maximaFecha) {
            this.maximaFecha = max;
        } else if (max > this.maximaFecha) {
            this.maximaFecha = max;
        }

        // var times = [];

        while(min < max) {
            // times.push([min.dateFormat(this.format)]);
            min = min.add('mi', this.increment);

            let inde = this.store.find('text', min.dateFormat(this.format));

            if (inde > 0 && min < max) {
                this.store.remove(this.store.getAt(inde));
            }
        }
    },
    setValueByFecha: function (fecha) {
        
        var index = this.store.find('text', fecha);
        console.log(fecha, index, this.store);
        

        if (index >= 0) {
            var record = this.store.getAt(index);
            console.log(record);
            
            this.setValue(record.id);
        }
    }
});

Pvd.ControlAsistencia.Asistencia.AdicionarModMultiCausal = Ext.extend(Ext.Window, {
    title:'Provisional',
    layout:'fit',
    width : 450,
    height :270,
    constrain: true,
    closable:true,
    resizable:false,
    closeAction: 'destroy',
    modal: true,
    constructor: function (idiomaa, modeloa, fechaBuscar) {
        this.idioma = idiomaa;
        this.modelo = modeloa;
        this.fechaBuscar = fechaBuscar;

        this.crearBtns();
        this.crearItems();
        Pvd.ControlAsistencia.Asistencia.AdicionarModMultiCausal.superclass.constructor.call(this);
        this.addEvents('aceptar');
        this.crearEventos();
    },
    crearBtns: function () {
        this.btnCancelar = new Ext.Button({
            // id:'btnCancelar',
            iconCls:'cancelar',
            tooltip:'Cancelar',
            prevTab: 'descripcion',
            nextTab: 'btnAplicar',
            text:'Cancelar'
        });

        this.btnAplicar = new Ext.Button({
            // id:'btnAplicar',
            iconCls:'aplicar',
            hidden: false,
            prevTab: 'btnCancelar',
            nextTab: 'btnAceptar',
            text:'Aplicar',
            tooltip:'Aplicar'
        });

        this.btnAceptar = new Ext.Button({
            // id:'btnAceptar',
            iconCls:'aceptar',
            prevTab: 'btnAplicar',
            nextTab: 'denominacion',
            text:'Aceptar',
            tooltip:'Aceptar'
        });

        this.buttons = [this.btnCancelar, this.btnAplicar, this.btnAceptar];
    },
    crearItems: function () {
        var _self = this;
        this.causasausenciamc = new Ext.components.TreeComboBox({
            anchor: '99%',
            editable: true,
            id: 'idcausa',
            name: 'denomcausa',
            enableKeyEvents: true,
            allowBlank : false,
            fieldLabel: 'Causa',
            treeConfig: {
                rootVisible: false,
                loader: _self.modelo.TreePanelLoader,
                border: false,
                autoScroll: true
            },
            listeners: {
                keypress: function (tf, e) {
                    if (e.getKey() == 8 || e.getKey() == 46) {
                        _self.causasausenciamc.valueNotFoundText = '';
                        _self.causasausenciamc.setValue(null);
                        if (_self.causasausenciamc.isExpanded())
                            _self.causasausenciamc.collapse();

                    }

                }
            }
        });

        
        var fechaActual = new Date(this.fechaBuscar);
        var fechaActualFi = new Date(this.fechaBuscar);
        fechaActualFi.setHours(fechaActual.getHours() + 48);

        this.horaentradamc = new Ext.form.TimeFieldMod({
            // id: 'horaentradamc',
            anchor: '97%',
            fieldLabel  : 'Hora entrada',
            name: 'horaentradamc',
            hiddenname:'horaentradamc',
            emptyText: 'Seleccione...',
            format: 'Y-m-d H:i',
            // minValue: '00:00',
            // minValue: fechaActual,
            // maxValue: '23:59',
            listWidth: 130,
            // maxValue: fechaActualFi,
            enableKeyEvents: true,
            //value:'08:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',
            allowBlank : false,
            blankText: _self.idioma.lbCampoVacio
        });

        this.horasalidamc = new Ext.form.TimeFieldMod({
            // id: 'horasalidamc',
            anchor: '97%',
            name: 'horasalidamc',
            hiddenname:'horasalidamc',
            fieldLabel  : 'Hora salida',
            emptyText: 'Seleccione...',
            format: 'Y-m-d H:i',
            // minValue: fechaActual,
            enableKeyEvents: true,
            // maxValue: fechaActualFi,
            listWidth: 130,
            //value:'17:00',
            invalidText: 'El formato de la hora es hora:minutos (24 horas)',
            allowBlank : false,
            blankText: _self.idioma.lbCampoVacio
        });

        this.observacionmc = new Ext.form.TextArea({
            name: 'observacionesmc',
            fieldLabel: 'Observaciones',
            // id: 'observacionesmc',
            anchor: '99%',
            hiddenname: 'observaciones',
            maxLength: 255,
            height:75,
            maxLengthText: _self.idioma.maxLengthTextArea
        });

        this.formulariomc = new Ext.FormPanel({
            labelAlign: 'top',
            frame:true,
            width : '100%',
            autoHeight:true,
            autoShow:true,
            items:[
                {
                    layout:'column',
                    items:[{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.causasausenciamc]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.horaentradamc]
                    },{
                        columnWidth:.5,
                        layout: 'form',
                        items: [this.horasalidamc]
                    },{
                        columnWidth:1.0,
                        layout: 'form',
                        items: [this.observacionmc]
                    }]
                }]
        });

        this.items = [this.formulariomc];
    },
    crearEventos: function () {
        this.btnCancelar.on('click',function(){
            this.close();
        }, this);

        this.btnAplicar.on('click', function() {
            this.ADDUPD('APLIC');
        },this);

        this.btnAceptar.on('click',function(){
            this.ADDUPD('ACEPT');
        },this);
    },
    loadDataInicial: function (accion, recordAsistencia, fechaBuscar, recordCausaMod) {
        this.accion = accion;
        this.recordCausaMod = recordCausaMod;
        this.recordAsistencia = recordAsistencia;

        // console.log(recordAsistencia);
        var recordData = recordAsistencia.json;

        var horainicio = recordData.horainicio;
        var horafin = recordData.horafin;

        var time = horainicio.split(':').map(Number);

        var combinedDateInicio = new Date(
            fechaBuscar.getFullYear(),
            fechaBuscar.getMonth(),
            fechaBuscar.getDate(),
            time[0],
            time[1],
            time[2]
        );

        var time = horafin.split(':').map(Number);

        var combinedDateFin = new Date(
            fechaBuscar.getFullYear(),
            fechaBuscar.getMonth(),
            fechaBuscar.getDate() + recordData.otrodia,
            time[0],
            time[1],
            time[2]
        );

        this.horaentradamc.actualizarMinMaxValue(combinedDateInicio, combinedDateFin);
        this.horasalidamc.actualizarMinMaxValue(combinedDateInicio, combinedDateFin);

        const day = String(fechaBuscar.getDate()).padStart(2, '0');
        const month = String(fechaBuscar.getMonth() + 1).padStart(2, '0');
        const year = fechaBuscar.getFullYear();
        var fechaBuscarText = day + '/' + month + '/' + year;
        
        Ext.Ajax.request({
            url: 'getMultiplesCausas',
            method: 'POST',
            scope: this,
            params: {
                idpersona: recordAsistencia.data.idpersona,
                idAsistenciaMultiplesCausas: recordCausaMod ? recordCausaMod.get('idasistenciamultiplescausas') : undefined,
                fecha: fechaBuscarText
            },
            callback: function(options, success, response) {
                var responseData = Ext.decode(response.responseText);
                
                if (responseData.cont > 0) {
                    for (let index = 0; index < responseData.datos.length; index++) {
                        const element = responseData.datos[index];
                        var [fechaParte, horaParte] = element.fechaentrada.split(' ');
                        
                        var [dia, mes, año] = fechaParte.split('/');
                        
                        var [hora, minuto] = horaParte.split(':');
                        
                        var nuevaFecha1 = `${año}-${mes}-${dia} ${hora}:${minuto}`;
                        
                        var [fechaParte, horaParte] = element.fechasalida.split(' ');
                        
                        var [dia, mes, año] = fechaParte.split('/');
                        
                        var [hora, minuto] = horaParte.split(':');
                        
                        var nuevaFecha2 = `${año}-${mes}-${dia} ${hora}:${minuto}`;
                        
                        this.horaentradamc.removeDataByInicioFin(nuevaFecha1, nuevaFecha2);
                        this.horasalidamc.removeDataByInicioFin(nuevaFecha1, nuevaFecha2);
                    }
                }
                
                if (accion == 'ADD') {
                    this.setTitle('Adicionar causa');
                    this.show();
                } else if (accion == 'UPD') {
                    this.setTitle('Modificar causa');
                    this.btnAplicar.hide();
                    
                    // this.formulariomc.getForm().loadRecord(recordCausaMod);
                    // this.horaentradamc.setValueByFecha(vista.smgridlistadoCausas.getSelected().json.fechaentrada_format);
                    // this.horasalidamc.setValueByFecha(vista.smgridlistadoCausas.getSelected().json.fechasalida_format);
                    this.show();
                    this.causasausenciamc.setRawValue(recordCausaMod.json.denomcausa);
                    this.horaentradamc.setValue(recordCausaMod.json.fechaentrada_format.slice(0, -3));
                    this.horasalidamc.setValue(recordCausaMod.json.fechasalida_format.slice(0, -3));
                    this.observacionmc.setValue(recordCausaMod.get('observaciones'));
                }
                
                // this.show();
            }
        });
        
    },
    ADDUPD: function (boton) {
        if(this.formulariomc.getForm().isValid()) {
            var idasistenciamultiplescausas = -1;
            var url = 'adicionarMultiplesCausas';
            if(this.accion == 'ADD')
            {
                idcausa = this.causasausenciamc.getValue();
                url = 'adicionarMultiplesCausas';
                Ext.getBody().mask('Adicionar causa');
            }
            else
            {
                idasistenciamultiplescausas = this.recordCausaMod.get('idasistenciamultiplescausas');
                console.log(this.causasausenciamc.getValue(), !isNaN(this.causasausenciamc.getValue()), this.recordCausaMod);
                
                if(!isNaN(this.causasausenciamc.getValue()) && (this.causasausenciamc.getValue() + '').trim() !== '')
                    idcausa = this.causasausenciamc.getValue();
                else
                    idcausa = this.recordCausaMod.get('idcausa');
                url = 'modificarMultiplesCausas';
                Ext.getBody().mask('Modificar causa');
            }

            if(this.recordAsistencia){

                const day = String(this.fechaBuscar.getDate()).padStart(2, '0');
                const month = String(this.fechaBuscar.getMonth() + 1).padStart(2, '0');
                const year = this.fechaBuscar.getFullYear();
                var fechaBuscarText = day + '/' + month + '/' + year;

                Ext.Ajax.request({
                    url: url,
                    method:'POST',
                    scope: this,
                    params: {
                        idasistenciamultiplescausas:idasistenciamultiplescausas,
                        idcausa:idcausa,
                        denomcausa: this.causasausenciamc.getRawValue(),
                        idpersona: this.recordAsistencia.data.idpersona,
                        fecharegistro: fechaBuscarText,
                        horaentrada: this.horaentradamc.getValue(),
                        horasalida: this.horasalidamc.getRawValue(),
                        observaciones: this.observacionmc.getRawValue(),
                        idasistencia: this.recordAsistencia.data.idasistencia},
                    callback: function (options,success,response){
                        Ext.getBody().unmask();
                        var responseData = Ext.decode(response.responseText);
                        
                                    if(responseData.cod == 1)
                                {
                                    if(this.accion == 'ADD')
                                        mostrarMensaje(1,'La causa fue adicionada satisfactoriamente');
                                    else
                                        mostrarMensaje(1,'La causa fue modificada satisfactoriamente');
                        
                                    this.modelo.storeMultiplesCausas.load({params: {idpersona: this.recordAsistencia.data.idpersona, fecha: fechaBuscarText}});
                                    
                                    if(boton == 'ACEPT'){
                                        this.fireEvent('aceptar', fechaBuscarText);
                                        // this.close();
                                        // scope.stListadoPersonas.load({params: {fecha: fechaBuscarText}});
                                        // vista.panelcausas.collapse();
                                    }
                                    if(boton == 'APLIC'){
                                        this.formulariomc.getForm().reset();
                                        this.causasausenciamc.setRawValue('');
                                        this.causasausenciamc.setValue('');
                                        this.causasausenciamc.valueNotFoundText = '';
                                        this.loadDataInicial(this.accion, this.recordAsistencia, this.fechaBuscar);
                                    }
                                }else if (responseData.cod == 3) {
                                    mostrarMensaje(3,'La causa que desea adicionar ya existe');
                                } else if (responseData.cod == 4) {
                                    mostrarMensaje(3,'No puede sobrepasar las horas de la jornada laboral.');
                                } else if (responseData.cod == 5) {
                                    mostrarMensaje(3,'No puede repetir la entrada y/o salida.');
                                } else if (responseData.cod == 6) {
                                    mostrarMensaje(3,'No puede solapar rangos.');
                                }
                    }
                });
            }else{
                // Ext.getBody().unmask();
                // vista.ventanamc.hide();
                // vista.formulariomc.getForm().reset();
                // vista.panelcausas.collapse();
                // mostrarMensaje(3,'Debe seleccionar una persona para poder realizar esta acción');
            }

        }
    }
});

//Inicializando la vista.
UCID.portal.cargarEtiquetas('asistencia', function (perfil, idioma) {

    //Escogiendo la configuración del idioma según la versión del MT.
    idioma = (idioma) ? idioma : perfil.etiquetas;

    //Inicializando el modelo
    var modelo = Pvd.ControlAsistencia.Asistencia.Modelo;
    modelo.init();

    //Inicializando la vista.
    var vista = Pvd.ControlAsistencia.Asistencia.Vista;
    vista.init(idioma, modelo);

    //Inicializar controlador.
    Pvd.ControlAsistencia.Asistencia.Controlador.init(idioma, vista, modelo);
	
	UCID.portal.cargarAcciones(window.frameElement.id);

});
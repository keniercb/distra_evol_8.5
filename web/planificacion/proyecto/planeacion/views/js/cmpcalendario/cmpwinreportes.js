Utilidades.Cmp.Cmpwinreportes = function(idopcion, opcionesConfigReporte) {

    //captura del puntero de la clase para poder referenciarlo desde otras funciones
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.array = [];
    this.arrayobjreporte = [];
    this.tftituloreporte = '';
    this.versionadoSelecionado;
    this.idversionreporte;
    this.idtiporeporteseleccionado;
    this.opcionesConfigReporte;

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    if (_this.winConfigReporte)
        _this.winConfigReporte.destroy();

    //store para el combo del formato de los reportes
    _this.scbformatreporte = new Ext.data.SimpleStore({
        fields: ['idformato', 'nombre'],
        data: [
            ["vp", "Vista Previa"],
            [".doc", "Documento Word"],
            [".xls", "Documento Excel"]
        ]
    });
    //combo de formato de los reportes
    _this.cbformatreporte = new Ext.form.ComboBox({
        id: 'cbformatreporte',
        name: 'cbformatreporte',
        value: 'vp',
        prevTab: 'btnaceptarreporte',
        fieldLabel: 'Formato del reporte',
        store: _this.scbformatreporte,
        displayField: 'nombre',
        typeAhead: true,
        allowBlank: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        hiddenName: 'idformato',
        valueField: 'idformato',
        anchor: '90%',
        emptyText: 'Seleccione',
        disabled: false,
        enableKeyEvents: true
    });

    _this.stcbtipoformatoletra = new Ext.data.SimpleStore({
        fields: ['idtipo', 'nombre'],
        data: [
            [1, "Arial"]
        ]
    });

    _this.cbtipoformatoletra = new Ext.form.ComboBox({
        id: 'cbtipoformatoletra',
        name: 'cbtipoformatoletra',
        value: 'Arial',
        fieldLabel: 'Tipo de letra del reporte',
        store: _this.stcbtipoformatoletra,
        displayField: 'nombre',
        typeAhead: true,
        allowBlank: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        hiddenName: 'idtipo',
        valueField: 'nombre',
        anchor: '90%',
        emptyText: 'Seleccione',
        disabled: false,
        enableKeyEvents: true
    });

    _this.stcbtamanoformatoletra = new Ext.data.SimpleStore({
        fields: ['idotamano', 'nombre'],
        data: [
            [1, "8px"],
            [2, "9px"],
            [3, "10px"],
            [4, "11px"],
            [5, "12px"],
            [6, "13px"],
            [7, "14px"],
            [8, "15px"]
        ]
    });

    _this.cbtamanoformatoletra = new Ext.form.ComboBox({
        id: 'cbtamanoformatoletra',
        name: 'cbtamanoformatoletra',
        value: '8px',
        fieldLabel: 'Tamaño de letra del reporte',
        store: _this.stcbtamanoformatoletra,
        displayField: 'nombre',
        typeAhead: true,
        allowBlank: false,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        hiddenName: 'idotamano',
        valueField: 'nombre',
        anchor: '90%',
        emptyText: 'Seleccione',
        disabled: false,
        enableKeyEvents: true
    });

    //store para el combo de la orientacion del reporte
    _this.scborientacionh = new Ext.data.SimpleStore({
        fields: ['idorientacion', 'nombre'],
        data: [
            [1, "Vertical"],
            [2, "Horizontal"]
        ]
    });

    this.ObtenerImgVistaDoc = function(formato, orientacion, ancho, alto) {
        var imgname = "img_doc_previa";
        if (orientacion == '2') {
            var temp = ancho;
            _this.anchohoja = alto;
            _this.altohoja = temp;
            imgname = "img_doc_previa_horizontal";
        }
        var html = "<center><div style='width:auto;height:auto;position:relative;float:center'>" +
                "<div style='width:18px;height:160px;position:relative;float:left;margin-top:70px;margin-left:5px;'><b>" + _this.altohoja + "</b></div>" +
                "<div style='width:190px;height:160px;position:relative;float:left'><img src='/planificacion/pdo/comun/recursos/images/" + imgname + ".png'></img></div>" +
                "<div style='width:150px;height:20px;position:relative;float:left;margin-left:5px;'><b>" + _this.anchohoja + "</b></div>" +
                "</div></center>";
        return html;
    };

    //combo de la orientacion del reporte
    _this.cborientacionh = new Ext.form.ComboBox({
        id: 'cborientacionh',
        name: 'cborientacionh',
        value: 1,
        fieldLabel: 'Orientación de la hoja',
        store: _this.scborientacionh,
        displayField: 'nombre',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        allowBlank: false,
        triggerAction: 'all',
        hiddenName: 'idorientacion',
        valueField: 'idorientacion',
        anchor: '90%',
        emptyText: 'Seleccione...',
        disabled: false,
        enableKeyEvents: true,
        listeners: {
            select: function(combo, record, index) {
                Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                _this.arrayobjreporte = [];
                var formato = _this.cbformatreporte.getValue();
                _this.orientacion = _this.cborientacionh.getValue();
                _this.anchohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                }
                _this.altohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                }
                var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                var pvistapreviadoc = new Ext.Panel({
                    id: 'pvistadoc',
                    frame: false,
                    layout: 'fit',
                    width: 218,
                    html: htmlvistadoc,
                    height: 245
                });
                Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                Ext.getCmp('fsvistadoc').doLayout();
            }
        }
    });

    //store del combo tipo de hojas
    _this.stcbtipohoja = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpreportes/cargartipohojas',
        listeners: {
            load: function(store, records, options) {

                if (records[0] != undefined && records[0] != null) {
                    _this.cbtipohoja.setValue(records[0].id);
                }

            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idtipohoja',
            root: "data"
        }, [{
                name: 'idtipohoja'
            }, {
                name: 'denominacion'
            }, {
                name: 'ancho'
            }, {
                name: 'alto'
            }])
    });
    //combo tipo de hojas
    _this.cbtipohoja = new Ext.form.ComboBox({
        id: 'cbtipohoja',
        emptyText: 'Seleccione...',
        fieldLabel: 'Tipo de hoja a imprimir',
        store: _this.stcbtipohoja,
        hiddenName: 'idtipohoja',
        valueField: 'idtipohoja',
        displayField: 'denominacion',
        triggerAction: 'all',
        allowBlank: false,
        editable: true,
        loadingText: 'Cargando datos',
        forceSelection: true,
        mode: 'local',
        anchor: '90%',
        listeners: {
            expand: function(combo) {
                _this.stcbtipohoja.reload();
            },
            select: function(combo, record, index) {
                Ext.getCmp('fsvistadoc').remove(_this.arrayobjreporte[0]);
                _this.arrayobjreporte = [];
                var formato = _this.cbformatreporte.getValue();
                _this.orientacion = _this.cborientacionh.getValue();
                _this.anchohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.anchohoja = _this.stcbtipohoja.getById(valor).data.ancho;
                }
                _this.altohoja = '';
                if (_this.cbtipohoja.getValue()) {
                    var valor = _this.cbtipohoja.getValue();
                    _this.altohoja = _this.stcbtipohoja.getById(valor).data.alto;
                }
                var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
                var pvistapreviadoc = new Ext.Panel({
                    id: 'pvistadoc',
                    frame: false,
                    layout: 'fit',
                    width: 218,
                    html: htmlvistadoc,
                    height: 245
                });
                Ext.getCmp('fsvistadoc').add(pvistapreviadoc);
                Ext.getCmp('fsvistadoc').doLayout();
            }
        }
    });

    _this.fpConfigReporte = new Ext.FormPanel({
        id: 'fpConfigReporte',
        frame: false,
        border: false,
        rezisable: false,
        region: "center",
        labelAlign: 'top',
        width: 500,
        height: 360,
        items: [
            {
                layout: 'column',
                border: false,
                items: [
                    {
                        columnWidth: 0.5,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [
                            {
                                xtype: 'fieldset',
                                title: 'Configuración del reporte',
                                frame: false,
                                layout: 'form',
                                width: 240,
                                height: 290,
                                items: [_this.cbformatreporte, _this.cbtipohoja, _this.cborientacionh,
                                    _this.cbtipoformatoletra, _this.cbtamanoformatoletra]
                            }
                        ]
                    }, {
                        columnWidth: 0.5,
                        border: false,
                        layout: 'form',
                        labelAlign: 'top',
                        items: [
                            {
                                xtype: 'fieldset',
                                id: 'fsvistadoc',
                                title: 'Vista',
                                frame: false,
                                layout: 'form',
                                width: 240,
                                height: 290
                            }
                        ]
                    }
                ]
            }]
    });

    //construyo la imagen por defecto del reporte
    var formato = _this.cbformatreporte.getValue();
    _this.orientacion = _this.cborientacionh.getValue();
    _this.anchohoja = '';
    _this.altohoja = '';
    var htmlvistadoc = _this.ObtenerImgVistaDoc(formato, _this.orientacion, _this.anchohoja, _this.altohoja);
    var pvistapreviadoc = new Ext.Panel({
        id: 'pvistadoc',
        frame: false,
        layout: 'fit',
        width: 218,
        html: htmlvistadoc,
        height: 190
    });
    _this.arrayobjreporte.push(pvistapreviadoc);
    Ext.getCmp('fsvistadoc').add(pvistapreviadoc);

    _this.winConfigReporte = new Ext.Window({
        id: 'winConfigReporte',
        title: "Generar reporte",
        width: 500,
        height: 360,
        draggable: true,
        resizable: false,
        modal: true,
        constrain: true,
        layout: 'border',
        closeAction: 'destroy',
        items: [_this.fpConfigReporte],
        buttons: [
            new Ext.Button({
                text: 'Cancelar',
                tooltip: 'Cerrar ventana sin guardar los datos',
                iconCls: 'cancelar',
                handler: function() {
                    _this.winConfigReporte.hide();
                }
            }),
            new Ext.Button({
                id: 'btnaceptarreporte',
                nextTab: 'cbformatreporte',
                text: 'Aceptar',
                tooltip: 'Guardar datos y  cerrar ventana',
                iconCls: 'aceptar',
                handler: function() {
                    formato = _this.cbformatreporte.getValue();
                    _this.VisualizarReporte(formato);
                    _this.winConfigReporte.hide();
                }
            })
        ]
    });


    this.mostrarWinReporte = function(opcionesConfigReporte) {
        _this.opcionesConfigReporte = opcionesConfigReporte;

        if (opcionesConfigReporte.reporte) {
            _this.idversionreporte = _this.idtiporeporteseleccionado;
        }
        //Cuando se llama desde calendario
        if (opcionesConfigReporte.calendario) {
            _this.versionadoSelecionado = 5;
            _this.idversionreporte = 5;
            _this.idtiporeporteseleccionado = 5;
        }

        _this.stcbtipohoja.reload();
        _this.winConfigReporte.show();
        //_this.cbformatreporte.focus(false, 1024)
    };

    this.VisualizarReporte = function(formato) {
        if (_this.fpConfigReporte.getForm().isValid()) {
            switch (formato) {
                case 'vp':
                    var mensaje = 'Generando vista previa...';
                    break;
                default:
                    var mensaje = 'Generando documento...';
            }
            _this.BarraProgreso.show(mensaje);
            var anno = _this.opcionesConfigReporte.valueanno;
            var nummes = _this.opcionesConfigReporte.valuenummeses;
            var textomes = _this.opcionesConfigReporte.textomes;
            var fechainicio = _this.opcionesConfigReporte.fechainicio;
            var fechafin = _this.opcionesConfigReporte.fechafin;
            var tipoletra = _this.cbtipoformatoletra.getValue();
            var tamanoletra = _this.cbtamanoformatoletra.getValue();
            Ext.Ajax.request({
                url: '/planificacion/proyecto/planeacion/index.php/cmpcalendario/obtenerreporte',
                params: {
                    anchohoja: _this.anchohoja,
                    altohoja: _this.altohoja,
                    orientacionhoja: 2,
                    valueanno: anno,
                    valuenummeses: nummes,
                    valuetextomeses: textomes,
                    arrayautores: Ext.encode(_this.opcionesConfigReporte.arrayautores),
                    arrayinvolucrados: Ext.encode(_this.opcionesConfigReporte.arrayinvolucrados),
                    idEstructura: _this.opcionesConfigReporte.idEstructura,
                    fechainicio: fechainicio,
                    fechafin: fechafin,
                    idtiporeporte: _this.idtiporeporteseleccionado,
                    idversionreporte: _this.idversionreporte,
                    versionadoSelecionado: _this.versionadoSelecionado,
                    tituloreporte: 'Plan mensual',
                    idopcion: formato, //idopcion
                    tipoletra: tipoletra,
                    tamanoletra: '12px'
                },
                callback: function(options, success, response) {
                    _this.BarraProgreso.hide();
                    if (formato == 'vp') {
                        var cuerporeporte = Ext.decode(response.responseText);
                        var winreporte = window.open('', '', 'scrollbars = yes,toolbar = yes,location = yes,resizable = yes, menubar = yes, status = yes');
                        winreporte.document.write("<HTML><HEAD><TITLE>Vista previa del reporte</TITLE></HEAD><BODY>" + cuerporeporte + "</BODY></HTML>");
                        winreporte.document.close();
                    } else {
                        var tituloarchivo = Ext.decode(response.responseText);
                        window.open('../../resources/descargas/' + tituloarchivo);
                    }
                }
            });
        } else {
            mostrarMensaje(1, 'Por favor verifique que hay campo(s) vac&iacute;o(s).');
        }
    };

};

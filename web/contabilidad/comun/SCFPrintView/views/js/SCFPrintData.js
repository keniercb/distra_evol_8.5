/*
 * Ventana para exportar e importar datos: Comprobantes, cuentas, etc.
 *
 * @author Ing. Miguel D&iacute;az Riveaux.
 * @package ERP Cuba.
 * @subpackage Contabilidad y Finanzas.
 * @namespace SCFPrintData
 * @copyright XETID.
 * @version 1.0-0
 */
var arrayDataCentros = [];
var ComponentsValue
function SCFPrintData(requestDataSources, component_path, defaultComponentsValue, propertiesWindow) {
    Ext.QuickTips.init();
    ComponentsValue =defaultComponentsValue;
    this.reportType = defaultComponentsValue.reportType;
    this.component_path = component_path;
    this.requestDataSources = requestDataSources;
    Ext.apply(this, defaultComponentsValue);
    this.gPaperWidth = 11.69;
    this.gPaperHeight = 8.27;
    var perfil = window.parent.perfil;
    scopePrintData = this;
    scopePrintData.typeAction = scopePrintData.typeAction || 'export';
    if (!document.getElementById('FileUploadField')) {
        this.loadJs("/contabilidad/comun/componentes/FileUploadField/FileUploadField.min", 'FileUploadField');
        this.loadCSS("/contabilidad/comun/componentes/FileUploadField/FileUploadField.min");
    }
    if (!document.getElementById('MessageBox'))
        this.loadJs("/contabilidad/comun/componentes/MessageBox/MessageBox", 'MessageBox');
    this.keyMap = new Ext.KeyMap(Ext.getBody(), [{
        key: 'x',
        alt: true,
        fn: function () {
            scopePrintData.close();
        }
    }, {
        key: Ext.EventObject.ENTER,
        fn: function () {
            if (!Ext.getCmp('btnAceptar').disabled)
                Ext.getCmp('btnAceptar').handler.call();
        },
        scope: scopePrintData
    }, {
        key: Ext.EventObject.TAB, //TAB
        fn: function () {
            if (document.activeElement.tabIndex == 204) {
                Ext.getCmp('cbxSysCont').focus(false, 10);
            }
        },
        scope: scopePrintData
    }, {
        key: Ext.EventObject.TAB, //SHIFT+TAB
        shift: true,
        fn: function () {
            if (document.activeElement.tabIndex == 200) {
                if (Ext.getCmp('btnAceptar').disabled == false) {
                    Ext.getCmp('btnAceptar').focus();
                } else {
                    Ext.getCmp('btnCancelar').focus();
                }
            }
        },
        scope: scopePrintData
    }], "keydown");
    scopePrintData.dataStore = new Array();
    scopePrintData.flOption = '';
    scopePrintData.hdCombo = true;
    scopePrintData.lbBtnAceptar = (scopePrintData.typeAction == 'export') ? 'Aceptar configuraci&oacute;n y exportar datos' : 'Aceptar configuraci&oacute;n e importar datos';
    scopePrintData.ttlWinReport = (scopePrintData.typeAction == 'export') ? 'Seleccionar la configuraci&oacute;n para exportar los datos' : 'Seleccionar la configuraci&oacute;n para importar los datos';
    scopePrintData.flfsFormato = 'Formato contable';
    scopePrintData.flOption = 'Formato';
    if(this.reportType=='DISTRA_CENTROS' || this.reportType=='DISTRA_DIETAS' || this.reportType=='DISTRA_TARJETAS_COMBUSTIBLE' || this.reportType=='DISTRA_MOVIMIENTO' || this.reportType== 'DISTRA_MOVIMIENTO_EEFECTIVO' || this.reportType== 'DISTRA_OPERACIONES_ENZONA')
        scopePrintData.dataStore = [['EXCEL'], /*['DBF'], ['CMP']*/];
    else
        scopePrintData.dataStore = [['EXCEL'], ['DBF'], ['CMP']];
    var propertiesWindowDefault = {
        onEsc: function () {
            scopePrintData.close();
        },
        title: scopePrintData.ttlWinReport,
        bodyStyle: 'padding:5px 10px 5px 10px',
        resizable: false,
        modal: true,
        id: 'wReporte',
        layout: 'border',
        iconCls: (scopePrintData.typeAction == 'export') ? 'exportar' : 'importar',
        height: (scopePrintData.typeAction == 'export') ? 220 : 260,
        width: 400,
        defaultButton: (scopePrintData.typeAction == 'export') ? 1 : 0,
        animateTarget: 'btnVistaReporte',
        items: [scopePrintData.fContentPrintInPanelWest(), scopePrintData.fContentPrintInPanelCenter()],
        buttons: [scopePrintData.btnCancelar = new Ext.Button({
            id: 'btnCancelar',
            text: 'Cancelar',
            tooltip: 'Cancelar la configuraci&oacute;n y cerrar ventana',
            iconCls: "cancelar",
            tabIndex: 203,
            handler: function () {
                scopePrintData.close();
            }
        }), scopePrintData.btnAceptar = new Ext.Button({
            id: 'btnAceptar',
            text: 'Aceptar',
            disabled: (scopePrintData.typeAction == 'export') ? false : true,
            tooltip: scopePrintData.lbBtnAceptar,
            iconCls: 'aceptar',
            tabIndex: 204,
            handler: function () {
                if (scopePrintData.typeAction == 'export') {
                    scopePrintData.fBUILDReport();
                } else {
                    scopePrintData.fImportData();
                }
            }
        })],
        keys: scopePrintData.keyMap
    };
    if (propertiesWindow) {
        Ext.apply(propertiesWindowDefault, propertiesWindow);
    }
    Ext.Window.call(this, propertiesWindowDefault);
    return this;
}

SCFPrintData.prototype = new Ext.Window();
SCFPrintData.prototype.loadJs = function (jsSrc, id) {
    if (jsSrc != null) {
        var tagScript = document.createElement("script");
        tagScript.setAttribute("type", "text/javascript");
        tagScript.setAttribute("id", id);
        tagScript.setAttribute("src", jsSrc + ".js");
        document.getElementsByTagName("body")[0].appendChild(tagScript);
    }
};
SCFPrintData.prototype.loadCSS = function (dirCSS) {
    if (dirCSS != null) {
        var css_style = document.createElement("link");
        css_style.setAttribute("rel", "stylesheet");
        css_style.setAttribute("type", "text/css");
        css_style.setAttribute("href", dirCSS + ".css");
        document.getElementsByTagName("head")[0].appendChild(css_style);
    }
};
SCFPrintData.prototype.fContentPrintInPanelWest = function () {

       SCFPrintData.prototype.cbxSysCont = new Ext.form.ComboBox({
        tabIndex: 200,
        id: 'cbxSysCont',
        fieldLabel: 'Sistemas compatibles',
        store: SCFPrintData.prototype.stSysCont = new Ext.data.SimpleStore({
            fields: ['id', 'descripcion'],
            data: [['distra', 'DISTRA'], ['rodas', 'RODAS XXI'], ['zunacc', 'ZUNACC']/*, ['versat', 'VERSAT'], ['condor', 'CONDOR']*/]
        }),
        valueField: 'id',
        displayField: 'descripcion',
        hiddenName: 'id',
        tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
        anchor: '95%',
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        // value: 'zun',
        // value: 'distra',
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        selectOnFocus: true,
        listeners: {
            select: function (combo, record) {
                Ext.getCmp('cbxTipoReporte').enable();
                Ext.getCmp('cbxTipoReporte').reset();
                /*if (combo.getValue() == 'versat' && scopePrintData.typeAction == 'export') {
                    Ext.getCmp('cbxTipoReporte').setValue('CMP');
                    Ext.getCmp('cbxTipoReporte').store.loadData([['CMP']]);
                } else if (combo.getValue() == 'versat' && scopePrintData.typeAction == 'import') {
                    Ext.getCmp('cbxTipoReporte').store.loadData([['EXCEL'], ['CMP']]);
                } else if (combo.getValue() == 'conso' && scopePrintData.typeAction == 'export') {
                    Ext.getCmp('cbxTipoReporte').store.loadData([['TXT']]);
                } else */
                if (combo.getValue() == 'distra') {
                    Ext.getCmp('cbxTipoReporte').store.loadData([['EXCEL']]);
                    Ext.getCmp('cbxTipoReporte').setValue('EXCEL');
                    Ext.getCmp('cbxTipoReporte').fireEvent('select', Ext.getCmp('cbxTipoReporte'), Ext.getCmp('cbxTipoReporte').store.getAt(0), 0);
                } else if (combo.getValue() == 'zunacc') {
                    Ext.getCmp('cbxTipoReporte').store.loadData([['DBF']]);
                } else {
                    Ext.getCmp('cbxTipoReporte').store.loadData([['EXCEL'], ['DBF']]);
                }
            }
        }
    });
    if(this.reportType=='DISTRA_CENTROS' || this.reportType=='DISTRA_TARJETAS_COMBUSTIBLE'|| this.reportType=='DISTRA_DIETAS'|| this.reportType=='DISTRA_MOVIMIENTO'|| this.reportType== 'DISTRA_MOVIMIENTO_EEFECTIVO' || this.reportType== 'DISTRA_OPERACIONES_ENZONA')
    {
        SCFPrintData.prototype.cbxTipoReporte = new Ext.form.ComboBox({
            tabIndex: 201,
            id: 'cbxTipoReporte',
            fieldLabel: scopePrintData.flOption,
            store: SCFPrintData.prototype.stTipoReporte = new Ext.data.SimpleStore({
                fields: ['id'],
                data: scopePrintData.dataStore
            }),
            disabled: false,
            valueField: 'id',
            displayField: 'id',
            hiddenName: 'tipo',
            tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
            anchor: '95%',
            typeAhead: true,
            mode: 'local',
            allowBlank: false,
            forceSelection: true,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            selectOnFocus: true,
            listeners: {
                render: function (component) {
                    //component.setValue(scopePrintData.reportType);
                },
                select: function (combo, record, index) {
                    Ext.getCmp('dvImage').setStore(scopePrintData.fDataStore(combo.getValue()));
                    Ext.getCmp('lSize').hide();
                    if (scopePrintData.typeAction == 'import') {
                        Ext.getCmp('sfUpload').reset();
                        Ext.getCmp('btnAceptar').disable();
                    }
                    switch (combo.getValue()) {
                        case 'DBF': {
                            scopePrintData.fValidateFile();
                        }
                            break;
                        case 'EXCEL': {
                            scopePrintData.fValidateFile();
                        }
                            break;
                        default : {
                            Ext.getCmp('lSize').show();
                            scopePrintData.fValidateFile();
                        }
                            break;
                    }
                }
            }
        });


    }
    else
    {
    SCFPrintData.prototype.cbxTipoReporte = new Ext.form.ComboBox({
        tabIndex: 201,
        id: 'cbxTipoReporte',
        fieldLabel: scopePrintData.flOption,
        store: SCFPrintData.prototype.stTipoReporte = new Ext.data.SimpleStore({
            fields: ['id'],
            data: scopePrintData.dataStore
        }),
        disabled: true,
        valueField: 'id',
        displayField: 'id',
        hiddenName: 'tipo',
        tpl: '<tpl for="."><div ext:qtip="{id}" class="x-combo-list-item">{id}</div></tpl>',
        anchor: '95%',
        typeAhead: true,
        mode: 'local',
        allowBlank: false,
        forceSelection: true,
        triggerAction: 'all',
        emptyText: 'Seleccione...',
        selectOnFocus: true,
        listeners: {
            render: function (component) {
                //component.setValue(scopePrintData.reportType);
            },
            select: function (combo, record, index) {
                Ext.getCmp('dvImage').setStore(scopePrintData.fDataStore(combo.getValue()));
                Ext.getCmp('lSize').hide();
                if (scopePrintData.typeAction == 'import') {
                    Ext.getCmp('sfUpload').reset();
                    Ext.getCmp('btnAceptar').disable();
                }
                switch (combo.getValue()) {
                    case 'DBF': {
                        scopePrintData.fValidateFile();
                    }
                        break;
                    case 'EXCEL': {
                        scopePrintData.fValidateFile();
                    }
                        break;
                    default : {
                        Ext.getCmp('lSize').show();
                        scopePrintData.fValidateFile();
                    }
                        break;
                }
            }
        }
    });
    }

    SCFPrintData.prototype.sfUpload = new Ext.form.FileUploadField({
        tabIndex: 202,
        xtype: 'fileuploadfield',
        width: '95%',
        id: 'sfUpload',
        emptyText: 'Solo archivos .dbf, .cmp, .xls',
        fieldLabel: 'Archivo',
        minLength: 4,
        regex: /^.+\.(dbf|xls|xlsx|xml|csv|cmp)$/i,
        regexText: 'Solo admite archivos con formato .dbf, .cmp, .xls.',
        name: 'fileUpload',
        tooltip: 'Explorar y buscar archivos para exportar',
        buttonCfg: {
            iconCls: 'icondistra-buscar',
            text: '',
            tooltip: 'Explorar y buscar archivos para exportar'
        },
        listeners: {
            'invalid': function () {
                Ext.getCmp('btnAceptar').disable();
                Ext.getCmp('btnCancelar').focus(false, 100);
            },
            'valid': function (f) {
                if (f.getValue().length > 0) {
                    scopePrintData.fValidateFile();
                    Ext.getCmp('btnAceptar').enable();
                }
            }
        }
    });
    if(this.reportType=='DISTRA_CENTROS' || this.reportType=='DISTRA_TARJETAS_COMBUSTIBLE'|| this.reportType=='DISTRA_DIETAS'|| this.reportType=='DISTRA_MOVIMIENTO'|| this.reportType== 'DISTRA_MOVIMIENTO_EEFECTIVO' || this.reportType== 'DISTRA_OPERACIONES_ENZONA')
    {
        SCFPrintData.prototype.fsOpciones = new Ext.form.FieldSet({
            xtype: 'fieldset',
            title: 'Opciones',
            autoHeight: true,
            autoWidth: true,
            items: [SCFPrintData.prototype.cbxTipoReporte, SCFPrintData.prototype.sfUpload]
        });
    }
    else{
    SCFPrintData.prototype.fsOpciones = new Ext.form.FieldSet({
        xtype: 'fieldset',
        title: 'Opciones',
        autoHeight: true,
        autoWidth: true,
        items: (scopePrintData.typeAction == 'export') ? [SCFPrintData.prototype.cbxSysCont, SCFPrintData.prototype.cbxTipoReporte] : [SCFPrintData.prototype.cbxSysCont, SCFPrintData.prototype.cbxTipoReporte, SCFPrintData.prototype.sfUpload]
    });}
    return SCFPrintData.prototype.fpPrintView = new Ext.form.FormPanel({
        frame: true,
        region: 'west',
        id: 'fpContentPrintInPanelWest',
        width: 220,
        autoHeight: true,
        fileUpload: true,
        labelAlign: 'top',
        items: [SCFPrintData.prototype.fsOpciones]
    });
};
SCFPrintData.prototype.fContentPrintInPanelCenter = function () {
    var labelHtml = '<center>&nbsp;</center>';
    return new Ext.form.FormPanel({
        frame: true,
        id: 'fpContentPrintInPanelCenter',
        region: 'center',
        labelAlign: 'top',
        items: [new Ext.DataView({
            id: 'dvImage',
            style: 'margin:25 0 0 20',
            store: scopePrintData.fDataStore(scopePrintData.reportType),
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{url}" title="{name}"></div>',
                '<span class="x-editable">{shortName}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ),
            autoHeight: true,
            autoShow: true,
            overClass: 'x-view-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No existen im&aacute;genes para mostrar.'
        }), new Ext.form.Label({
            id: 'lSize',
            html: labelHtml
        })
        ]
    });
};
SCFPrintData.prototype.fDataStore = function (name) {
    return new Ext.data.SimpleStore({
        fields: ['url', 'name'],
        data: [[scopePrintData.component_path + "views/images/" + name + ".png", name]]
    });
};
SCFPrintData.prototype.onAfterReportShow = function () {
    Ext.CONT.Componentes.HideBox('msgbIniciando');
};
SCFPrintData.prototype.fBUILDReport = function () {
    Ext.CONT.Componentes.MessageBox('msgbIniciando');
    scopePrintData.paramsAjax = {
        dataSources: Ext.encode(scopePrintData.requestDataSources),
        reportType: Ext.getCmp('cbxTipoReporte').getValue(),
        systemCont: Ext.getCmp('cbxSysCont').getValue(),
        typeAction: 'export'
    };
    if (Ext.getCmp('cbxTipoReporte').getValue() == 'EXCEL') {
        Ext.Ajax.request({
            method: "POST",
            params: scopePrintData.paramsAjax,
            url: scopePrintData.component_path + "index.php/scfprintview/savePost",
            callback: function (options, success, response) {
                this.responseData = Ext.decode(response.responseText);
                switch (this.responseData.info) {
                    case true:
                        var gWindow = window.open(scopePrintData.component_path + "index.php/scfprintview/buildReport", "", "menubar = yes, scrollbars = yes, status = no, toolbar = no, location = yes, resizable = no, titlebar = no", true);
                        scopePrintData.showMask(gWindow);
                        gWindow.onbeforeunload = function () {
                            scopePrintData.onAfterReportShow();
                        };
                        gWindow.focus();
                        break
                    default:
                        scopePrintData.onAfterReportShow();
                        break
                }

            }
        });
    } else {
        Ext.Ajax.request({
            method: "POST",
            timeout: 500000000,
            params: scopePrintData.paramsAjax,
            url: scopePrintData.component_path + "index.php/scfprintview/exportReport",
            callback: function (options, success, response) {
                this.responseData = Ext.decode(response.responseText);
                scopePrintData.onAfterReportShow();
                switch (Ext.getCmp('cbxTipoReporte').getValue()) {
                    case 'DBF':
                    case 'TXT': {
                        var save = document.createElement('a');
                        save.href = this.responseData.url;
                        save.target = '_blank';
                        save.download = this.responseData.fileName
                        var clickEvent = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        save.dispatchEvent(clickEvent);
                    }
                        break;
                    case 'CMP': {
                        Ext.DomHelper.append(document.body, {
                            tag: 'iframe',
                            id: 'downloadIframe',
                            frameBorder: 0,
                            width: 0,
                            height: 0,
                            css: 'display:none;visibility:hidden;height:0px;',
                            src: this.responseData.url
                        });
                    }
                        break;
                    case 'XML': {
                        var formexport = document.getElementById('fpContentPrintInPanelWest');
                        formexport.method = 'POST';
                        formexport.target = '_blank';
                        formexport.action = scopePrintData.component_path + "index.php/scfprintview/exportReport";
                        formexport.submit();
                    }
                        break;
                    default: {
                        var gWindow = window.open(this.responseData.url, "", "menubar = yes, scrollbars = yes, status = no, toolbar = no, location = yes, resizable = no, titlebar = no", true);
                        scopePrintData.showMask(gWindow);
                        gWindow.onload = function () {
                            scopePrintData.onAfterReportShow();
                        };
                        gWindow.onbeforeunload = function () {
                            scopePrintData.onAfterReportShow();
                        };
                        gWindow.focus();
                    }
                        break;
                }
            }
        });
    }
};
SCFPrintData.prototype.showMask = function (win) {
    var div1 = document.createElement("div");
    div1.setAttribute("id", "loading-mask");
    div1.setAttribute("style", " background-color; blue;  position:absolute;left:45%; top:40%;padding:2px; z-index:20001; color:#444;font:bold 13px Helvetica, Arial, sans-serif; height:auto;   ");
    div1.innerHTML = ' <img src="http://' + document.location.host + '/contabilidad/comun/images/cargando.gif" width="64" height="64" style="margin-right:8px;float:left;vertical-align:top;"/>Cargando...<br /><span id="loading-msg" style = "font-size: 10px; font-weight: normal;"> Por favor espere...</span>';
    win.document.getElementsByTagName("body")[0].appendChild(div1);
};

SCFPrintData.prototype.fImportData = function () {
    if (Ext.getCmp('sfUpload').getRawValue() == '') {
        mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
    } else {
        if(this.reportType=='DISTRA_CENTROS')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {
                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importDataCentros",
                    waitMsg: 'Importando datos...',
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if(respData!=1)
                        {
                            var msg = '';
                            if(respData.repet)
                            {
                                msg+='<br>Centros de Costos repetidos<br>';
                                respData.repet
                                for (var i = 0; i < respData.repet.length; i++) {
                                    msg+=respData.repet[i];
                                    if(respData.repet.length>1 && i<respData.repet.length-1)
                                        msg+=', ';

                                }
                            }if(respData.centro_aperturado)
                        {
                            msg+='<br>Centros de Costos Aperturados<br>';
                            for (var i = 0; i < respData.centro_aperturado.length; i++) {
                                msg+=respData.centro_aperturado[i];
                                if(respData.centro_aperturado.length>1 && i<respData.centro_aperturado.length-1)
                                    msg+=', ';
                            }
                        }
                            if(respData.not_centro)
                            {
                                msg+='<br> Codigos de niveles superiores que no existen:<br>';
                                for (var i = 0; i < respData.not_centro.length; i++) {
                                    msg+=respData.not_centro[i];
                                    if(respData.not_centro.length>1 && i<respData.not_centro.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.formato)
                            {
                                msg+='<br>No existen formatos configurados para los centros de costo<br>';
                            }
                            if(respData.vacio)
                            {
                                msg+='<br>Existen celdas vacias en los centros de costos a importar<br>';
                            }
                            if(respData.out_format)
                            {
                                msg+='<br>El nivel de los centros de costos sobrepasan el formato configurado<br>';
                            }

                            mostrarMensaje(1, msg, function () {});
                            scopePrintData.close();

                        }
                        if(respData==1)
                        {
                            mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente');
                            scopePrintData.close();
                            Ext.ComponentMgr.get('ccnae').reload();
                        }

                    }

                });
            }

            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }
        else if(this.reportType=='DISTRA_TARJETAS_COMBUSTIBLE')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {

                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importTarjetasPrepagadas",
                    waitMsg: 'Importando datos...',
                    params: {
                        idcaja: this.idcaja,
                    },
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if(respData==1)
                        {
                            mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente');
                            scopePrintData.close();
                            Ext.ComponentMgr.get('ccnae').reload();
                        }
                        else
                        {
                            var msg='';
                            if(respData.repet)
                            {
                                msg+="<br>Tarjetas de Combustibles repetidas<br>"
                                for (var i = 0; i < respData.repet.length; i++) {
                                    msg+=respData.repet[i];
                                    if(respData.repet.length>1 && i<respData.repet.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notCuenta)
                            {
                                msg+="<br>Tarjetas con cuentas activas que no tienen asociadas una cuenta contable<br>"
                                for (var i = 0; i < respData.notCuenta.length; i++) {
                                    msg+=respData.notCuenta[i];
                                    if(respData.notCuenta.length>1 && i<respData.notCuenta.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notTipoCombustible)
                            {
                                msg+="<br>Tarjetas que no tienen definido el tipo de combustible<br>"
                                for (var i = 0; i < respData.notTipoCombustible.length; i++) {
                                    msg+=respData.notTipoCombustible[i];
                                    if(respData.notTipoCombustible.length>1 && i<respData.notTipoCombustible.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.matricula)
                            {
                                msg+="<br>No existen vehiculos con las siguientes matriculas<br>"
                                for (var i = 0; i < respData.matricula.length; i++) {
                                    msg+=respData.matricula[i];
                                    if(respData.matricula.length>1 && i<respData.matricula.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notci)
                            {
                                msg+="<br>Responsables que no tienen asociados un Carnet de Identidad<br>"
                                for (var i = 0; i < respData.notci.length; i++) {
                                    msg+=respData.notci[i];
                                    if(respData.notci.length>1 && i<respData.notci.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notpersona)
                            {
                                msg+="<br>Personas que no estan registradas en el sistema<br>"
                                for (var i = 0; i < respData.notpersona.length; i++) {
                                    msg+=respData.notpersona[i];
                                    if(respData.notpersona.length>1 && i<respData.notpersona.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notBDcuenta)
                            {
                                msg+="<br>Cuentas que no estan configuradas<br>"
                                for (var i = 0; i < respData.notBDcuenta.length; i++) {
                                    msg+=respData.notBDcuenta[i];
                                    if(respData.notBDcuenta.length>1 && i<respData.notBDcuenta.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.nohoja)
                            {
                                msg+="<br>Cuentas que no son de ultimo nivel<br>"
                                for (var i = 0; i < respData.nohoja.length; i++) {
                                    msg+=respData.nohoja[i];
                                    if(respData.nohoja.length>1 && i<respData.nohoja.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notcombustible)
                            {
                                msg+="<br>Tipos de combustibles incorrectos<br>"
                                for (var i = 0; i < respData.notcombustible.length; i++) {
                                    msg+=respData.notcombustible[i];
                                    if(respData.notcombustible.length>1 && i<respData.notcombustible.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.tajetinBD)
                            {
                                msg+="<br>Tarjetas que ya han sido registradas<br>"
                                for (var i = 0; i < respData.tajetinBD.length; i++) {
                                    msg+=respData.tajetinBD[i];
                                    if(respData.tajetinBD.length>1 && i<respData.tajetinBD.length-1)
                                        msg+=', ';
                                }
                            }
                            mostrarMensaje(1, msg, function () {});
                            scopePrintData.close();
                        }

                    }

                });
            }

            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }
 else if(this.reportType=='DISTRA_DIETAS')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {

                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importDietas",
                    waitMsg: 'Importando datos...',
                    params: {
                        idcajafondo: this.idcajafondo,
                        idMonedaEntidad:this.idMonedaEntidad
                    },
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if(respData==1)
                        {
                            mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente');
                            Ext.ComponentMgr.get('ccnae').reload();
                        }
                        else
                        {
                            var msg='';
                            if(respData.codigo)
                                msg+='<br>Faltan numeros de dietas y es un campo obligatorio<br>';
                            if(respData.CIDieta || respData.CIAutoriza)
                                msg+='<br>Faltan CI de personas y es un campo obligatorio<br>';
                            if(respData.nombre || respData.Autoriza)
                                msg+='<br>Faltan nombres de personas y es un campo obligatorio<br>';
                            if(respData.FechaEmision || respData.FechaSalida || respData.FechaRegreso)
                                msg+='<br>Faltan fechas por insertar y es un campo obligatorio<br>';
                            if(respData.Importe)
                                msg+='<br>El Importe es un campo obligatorio<br>';
                            if(respData.Labor)
                                msg+='<br>La Labor a realizar es un campo obligatorio<br>';
                            if(respData.TipoDieta)
                                msg+='<br>El tipo de dieta es un campo obligatorio<br>';
                            if(respData.rangTipoDieta)
                            {
                                msg+="<br>Verifique la clasificación de tipo de dieta (1-Anticipo, 2-Lquidación) de los siguientes documentos:<br>"
                                for (var i = 0; i < respData.rangTipoDieta.length; i++) {
                                    msg+=respData.rangTipoDieta[i];
                                    if(respData.rangTipoDieta.length>1 && i<respData.rangTipoDieta.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.nopersonadieta)
                            {
                                msg+="<br>Personas a las que se le realiza la dieta que no estan registradas<br>"
                                for (var i = 0; i < respData.nopersonadieta.length; i++) {
                                    msg+=respData.nopersonadieta[i];
                                    if(respData.nopersonadieta.length>1 && i<respData.nopersonadieta.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.nopersonaautoriza)
                            {
                                msg+="<br>Personas que autorizan que no estan registradas<br>"
                                for (var i = 0; i < respData.nopersonaautoriza.length; i++) {
                                    msg+=respData.nopersonaautoriza[i];
                                    if(respData.nopersonaautoriza.length>1 && i<respData.nopersonaautoriza.length-1)
                                        msg+=', ';
                                }
                            }

                            mostrarMensaje(1, msg, function () {});
                            scopePrintData.close();
                        }

                    }

                });
            }



            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }
        else if(this.reportType=='DISTRA_MOVIMIENTO')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {

                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importMovimientos",
                    waitMsg: 'Importando datos...',
                    params: {
                        idcajafondo:ComponentsValue.idcajafondo,
                        idcaja:ComponentsValue.idcaja,
                        idtipoMovimiento: ComponentsValue.idtipoMovimiento,
                        idmoneda:ComponentsValue.idmoneda
                    },
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if(respData==1)
                        {
                            mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente');
                            scopePrintData.close();
                            Ext.ComponentMgr.get('idMovimientoreset').reload();
                        }
                        else
                        {
                            var msg='';
                            if(respData.FechaEmision)
                                msg+='<br>El campo fecha de emision es obligaroeio<br>';
                            if(respData.Tipo)
                                msg+='<br>El campo Tipo Acreedor/Deudor es obligaroeio<br>';
                            if(respData.idTrabajadorCliente)
                                msg+='<br>El campo Codigo del cliente/CI Trabajador es obligaroeio<br>';
                            if(respData.nomTrabajador)
                                msg+='<br>El campo Cliente/Trabajador es obligaroeio<br>';
                            if(respData.NoMov)
                                msg+='<br>El campo No es obligaroeio<br>';
                            if(respData.Observacion)
                                msg+='<br>El campo Observacion es obligaroeio<br>';
                            if(respData.Importe)
                                msg+='<br>El campo Importe es obligatorio<br>';
                            if(respData.Instrumento)
                                msg+='<br>El campo Instrumento es obligatorio<br>';
                            if(respData.notoperacion)
                                msg+='<br>No existen operaciones configuradas<br>';
                            if(respData.IstruRepet)
                            {
                                msg+="<br>Instrumentos que ya estan en el sistema<br>"
                                for (var i = 0; i < respData.IstruRepet.length; i++) {
                                    msg+=respData.IstruRepet[i];
                                    if(respData.IstruRepet.length>1 && i<respData.IstruRepet.length-1)
                                        msg+=', ';
                                }
                            }

                            if(respData.notPersona)
                            {
                                msg+="<br>Personas no registradas en el sistema<br>"
                                for (var i = 0; i < respData.notPersona.length; i++) {
                                    msg+=respData.notPersona[i];
                                    if(respData.notPersona.length>1 && i<respData.notPersona.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notCliente)
                            {
                                msg+="<br>Clientes no registradas en el sistema<br>"
                                for (var i = 0; i < respData.notCliente.length; i++) {
                                    msg+=respData.notCliente[i];
                                    if(respData.notCliente.length>1 && i<respData.notCliente.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.repet)
                            {
                                msg+="<br>Id trabajador/cliente que se repiten<br>"
                                for (var i = 0; i < respData.repet.length; i++) {
                                    msg+=respData.repet[i];
                                    if(respData.repet.length>1 && i<respData.repet.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.repetNo)
                            {
                                msg+="<br>Numero de movimientos que se repiten<br>"
                                for (var i = 0; i < respData.repetNo.length; i++) {
                                    msg+=respData.repetNo[i];
                                    if(respData.repetNo.length>1 && i<respData.repetNo.length-1)
                                        msg+=', ';
                                }
                            }


                            mostrarMensaje(1, msg, function () {});
                            //scopePrintData.close();
                        }

                    }

                });
            }



            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }

        else if(this.reportType=='DISTRA_MOVIMIENTO_EEFECTIVO')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {

                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importMovimientosEfectivo",
                    waitMsg: 'Importando datos...',
                    params: {
                        idcajafondo:ComponentsValue.idcajafondo,
                        idcaja:ComponentsValue.idcaja,
                        idtipoMovimiento: ComponentsValue.idtipoMovimiento,
                        idmoneda:ComponentsValue.idmoneda
                    },
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if(respData==1)
                        {
                            mostrarMensaje(1, 'Los datos han sido importados satisfactoriamente');
                            scopePrintData.close();
                            Ext.ComponentMgr.get('idMovimientoreset').reload();
                        }
                        else
                        {
                            var msg='';
                            if(respData.FechaEmision)
                                msg+='<br>El campo fecha de emision es obligatorio<br>';
                            if(respData.Tipo)
                                msg+='<br>El campo Tipo Acreedor/Deudor es obligatorio<br>';
                            if(respData.idTrabajadorCliente)
                                msg+='<br>El campo Codigo del cliente/CI Trabajador es obligatorio<br>';
                            if(respData.nomTrabajador)
                                msg+='<br>El campo Cliente/Trabajador es obligatorio<br>';
                            if(respData.NoMov)
                                msg+='<br>El campo No es obligatorio<br>';
                            if(respData.Observacion)
                                msg+='<br>El campo Observacion es obligatorio<br>';
                            if(respData.Importe)
                                msg+='<br>El campo Importe es obligatorio<br>';
                            if(respData.notoperacion)
                                msg+='<br>No existen operaciones configuradas<br>';
                            if(respData.IstruRepet)
                            {
                                msg+="<br>Instrumentos que ya estan en el sistema<br>"
                                for (var i = 0; i < respData.IstruRepet.length; i++) {
                                    msg+=respData.IstruRepet[i];
                                    if(respData.IstruRepet.length>1 && i<respData.IstruRepet.length-1)
                                        msg+=', ';
                                }
                            }

                            if(respData.notPersona)
                            {
                                msg+="<br>Personas no registradas en el sistema<br>"
                                for (var i = 0; i < respData.notPersona.length; i++) {
                                    msg+=respData.notPersona[i];
                                    if(respData.notPersona.length>1 && i<respData.notPersona.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.notCliente)
                            {
                                msg+="<br>Clientes no registradas en el sistema<br>"
                                for (var i = 0; i < respData.notCliente.length; i++) {
                                    msg+=respData.notCliente[i];
                                    if(respData.notCliente.length>1 && i<respData.notCliente.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.repet)
                            {
                                msg+="<br>Id trabajador/cliente que se repiten<br>"
                                for (var i = 0; i < respData.repet.length; i++) {
                                    msg+=respData.repet[i];
                                    if(respData.repet.length>1 && i<respData.repet.length-1)
                                        msg+=', ';
                                }
                            }
                            if(respData.repetNo)
                            {
                                msg+="<br>Numero de movimientos que se repiten<br>"
                                for (var i = 0; i < respData.repetNo.length; i++) {
                                    msg+=respData.repetNo[i];
                                    if(respData.repetNo.length>1 && i<respData.repetNo.length-1)
                                        msg+=', ';
                                }
                            }


                            mostrarMensaje(1, msg, function () {});
                            //scopePrintData.close();
                        }

                    }

                });
            }



            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }
        else if(this.reportType=='DISTRA_OPERACIONES_ENZONA')
        {
            if (scopePrintData.fpPrintView.getForm().isValid()) {
                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importBancoOperacionesEnzona",
                    waitMsg: 'Importando datos...',
                    // params: {
                    //     idcajafondo:ComponentsValue.idcajafondo,
                    //     idcaja:ComponentsValue.idcaja,
                    //     idtipoMovimiento: ComponentsValue.idtipoMovimiento,
                    //     idmoneda:ComponentsValue.idmoneda
                    // },
                    success: function (form, action) {
                        // if (action.response.responseText == false) {
                        //     mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        // } else {
                        //     Ext.getCmp('sfUpload').reset();
                        //     scopePrintData.close();
                        // }
                    },
                    failure: function (form, action) {
                        // var respData = Ext.decode(action.response.responseText);

                    }

                });
            }



            else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }


        else {
            if (scopePrintData.fpPrintView.getForm().isValid()) {
                scopePrintData.fpPrintView.getForm().submit({
                    url: scopePrintData.component_path + "index.php/scfprintview/importData",
                    waitMsg: 'Importando datos...',
                    success: function (form, action) {
                        if (action.response.responseText == false) {
                            mostrarMensaje(6, 'El archivo introducido no es v&aacute;lido.');
                        } else {
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        }
                    },
                    failure: function (form, action) {
                        var respData = Ext.decode(action.response.responseText);
                        if (respData.codMg) {
                            mostrarMensaje(1, 'No existen operaciones configuadas para realizar esta operación.', function () {
                            });
                            return;
                        }
                        if (respData.analisisNoEncontrados) {
                            var msgAnalisisNoEncontrados = "<b>Las siguientes aperturas no existen:</b><br>" + respData.analisisNoEncontrados.join(', ');
                            mostrarMensaje(1, msgAnalisisNoEncontrados, function () {
                            });
                            return;
                        }
                        Ext.Msg.wait('Importando datos...', 'Por favor espere...');
                        var idsubsistema = respData.datos.idsubsistema || 4;
                        var detalle = respData.datos.detalle || 'Importando comprobante';
                        var observacion = respData.datos.observacion || 'Contabilizando comprobante importado';
                        var fechaContable = respData.datos.fechaContable || 4;
                        var dataComprobante = respData.datos.dataComprobante || new Array();
                        var idtipocomprobante = respData.datos.idtipocomprobante || 3;
                        Ext.Cont.Comprobante.init(idsubsistema, detalle, observacion, fechaContable, dataComprobante, idtipocomprobante, 0, 1, 'SIN ERROR', null, null, null, true).onSaved(function (idComprobante, numComprobante, fechaComprobante) {
                            mostrarMensaje(1, 'Comprobante importado satifactoriamente, y registrado con n&uacute;mero: ' + numComprobante + '.');
                            Ext.getCmp('sfUpload').reset();
                            scopePrintData.close();
                        });
                    }
                });
            } else {
                mostrarMensaje(1, 'Debe introducir un archivo .dbf, .cmp, .xls.');
            }
        }
    }
};
SCFPrintData.prototype.fValidateFile = function () {
    var formatFile = Ext.getCmp('cbxTipoReporte').getValue();
    switch (formatFile) {
        case 'CMP': {
            if (scopePrintData.typeAction == 'import') {
                Ext.getCmp('sfUpload').regex = /^.+\.(cmp)$/i;
                Ext.getCmp('sfUpload').regexText = 'Debe introducir un archivo (*.cmp).';
                Ext.getCmp('sfUpload').validateValue(Ext.getCmp('sfUpload').getValue());
                if (Ext.getCmp('sfUpload').isValid()) {
                    Ext.getCmp('btnAceptar').focus(false, 100);
                }
            }
        }
            break;
        case 'DBF': {
            if (scopePrintData.typeAction == 'import') {
                Ext.getCmp('sfUpload').regex = /^.+\.(dbf)$/i;
                Ext.getCmp('sfUpload').regexText = 'Debe introducir un archivo dBase(*.dbf).';
                Ext.getCmp('sfUpload').validateValue(Ext.getCmp('sfUpload').getValue());
                if (Ext.getCmp('sfUpload').isValid()) {
                    Ext.getCmp('btnAceptar').focus(false, 100);
                }
            }
        }
            break;
        case 'EXCEL': {
            if (scopePrintData.typeAction == 'import') {
                Ext.getCmp('sfUpload').regex = /^.+\.(xls|xlsx)$/i;
                Ext.getCmp('sfUpload').regexText = 'Debe introducir un archivo Hoja de cálculo de Microsoft Excel(*.xls).';
                Ext.getCmp('sfUpload').validateValue(Ext.getCmp('sfUpload').getValue());
                if (Ext.getCmp('sfUpload').isValid()) {
                    Ext.getCmp('btnAceptar').focus(false, 100);
                }
            }
        }
            break;
        case 'CSV': {
            if (scopePrintData.typeAction == 'import') {
                Ext.getCmp('sfUpload').regex = /^.+\.(csv)$/i;
                Ext.getCmp('sfUpload').regexText = 'Debe introducir un archivo Comma Separated Values(*.csv).';
                Ext.getCmp('sfUpload').validateValue(Ext.getCmp('sfUpload').getValue());
            }
        }
            break;
        case 'XML': {
            if (scopePrintData.typeAction == 'import') {
                Ext.getCmp('sfUpload').regex = /^.+\.(xml)$/i;
                Ext.getCmp('sfUpload').regexText = 'Debe introducir un archivo eXtensible Markup Language(*.xml).';
                Ext.getCmp('sfUpload').validateValue(Ext.getCmp('sfUpload').getValue());
            }
        }
            break;
        default : {
            Ext.getCmp('dvImage').setStore(scopePrintData.fDataStore(formatFile));
            Ext.getCmp('lSize').show();
        }
            break;
    }
};

SCFPrintData.prototype.fPonerOtrosSistemasYFormatos = function (arrSistemas, arrFormatos = false) {
    //quito los que vienen por defecto, esto hasta que revise y modifique este componente
    // SCFPrintData.prototype.stSysCont.removeAll();//El sistema
    // SCFPrintData.prototype.stTipoReporte.removeAll();//El tipo al que se va a exportar
    SCFPrintData.prototype.stSysCont.loadData(arrSistemas);
    if (arrFormatos) {
        SCFPrintData.prototype.stTipoReporte.loadData(arrFormatos);
    }
    // arrSistemas.forEach(function (item, i) {
    //     SCFPrintData.prototype.stSysCont.add(new Ext.data.Record([
    //         {
    //             'id': item.id,
    //             'descripcion': item.descripcion
    //         }
    //     ]));
    // });
    // arrFormatos.forEach(function (item, i) {
    //     SCFPrintData.prototype.stTipoReporte.add(new Ext.data.Record([
    //         {
    //             'id': item.id
    //         }
    //     ]));
    // });

};

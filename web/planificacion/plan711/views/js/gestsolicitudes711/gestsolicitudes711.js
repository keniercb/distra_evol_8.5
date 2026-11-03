var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();
UCID.portal.cargarEtiquetas('gestsolicitudes711', cargarAccionesPlanes);
var objciPlanes = {};
objciPlanes.acciones = [];

var hojaPlanes, denom_ent, rectoraPlanes = false, identidadEsODPlanes = 0, contJRGrid = 0, gestionSegunEstEjercicioPlan = true, gpProductosSel
    ,contembarques=0;

//variables auxialiares
var plan, empimp, cc, ff, monto = 0, codigoreup, codigocc, empdestino, direct, directecon, direccdest;;
var productossel =[], rolepersona, fuentes = [], cubicaje =[];
var embarque = [], formapagolista=[], cubicajelista = [], ft = [], identidadselectedPlanes;
var empdestino, especialista, listasersol = [], idsolp, textorchazo, nosol, idempimp;
var tipoplan = 1254,offset =0, desaprueba=0;
var prodindmaestros = [],contind=1, msgmotivo = "";
var servsol = [], pp = [], stAcciones, rec = null;


function cargarAccionesPlanes() {
    var temp = window.location.pathname;
    var url = temp.substr(1);
    UCID.portal.cargarAccionesXUri(url);
        cargarInterfazSolicitud();
}

function cargarInterfazSolicitud() {
    rolepersona = perfil.idrol;
    //mascaras
    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: 'Cargando...'
    });
    //carga de datos por defecto
    agregarmodificarsolicitudes711();
    actualizardatos();
    vermodificaciones();
    agregrarcontrato();
    
    Ext.override(Ext.grid.GridPanel, {
        Base64: function (input) {

            // private property
            var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < input.length; n++) {
                var c = input.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            input = utftext;
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) + keyStr.charAt(enc4);
            }

            return output;
        },

        normalize: function (str) {
            var from = "ÁÉÍÓÚÜáéíóúüÑñ",
                to = [],
                mapping = {};

            to.push("&Aacute;");
            to.push("&Eacute;");
            to.push("&Iacute;");
            to.push("&Oacute;");
            to.push("&Uacute;");
            to.push("&Uuml;");
            to.push("&aacute;");
            to.push("&eacute;");
            to.push("&iacute;");
            to.push("&oacute;");
            to.push("&uacute;");
            to.push("&uuml;");
            to.push("&Ntilde;");
            to.push("&ntilde;");


            for (var i = 0, j = from.length; i < j; i++)
                mapping[from.charAt(i)] = to[i];

            var ret = [];
            for (var i = 0, j = str.length; i < j; i++) {
                var c = str.charAt(i);
                if (mapping.hasOwnProperty(str.charAt(i)))
                    ret.push(mapping[c]);
                else
                    ret.push(c);
            }
            return ret.join('');

        },

        getExcelXml: function (includeHidden, title) {
            var worksheet = this.createWorksheet(includeHidden, title);
            var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
            return '<?xml version="1.0" encoding="UTF-8"?>' +
                '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
                '<o:DocumentProperties><o:Title>' + title + '</o:Title></o:DocumentProperties>' +
                '<ss:ExcelWorkbook>' +
                '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
                '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
                '<ss:ProtectStructure>False</ss:ProtectStructure>' +
                '<ss:ProtectWindows>False</ss:ProtectWindows>' +
                '</ss:ExcelWorkbook>' +
                '<ss:Styles>' +
                '<ss:Style ss:ID="Default">' +
                '<ss:Alignment ss:Vertical="Top" ss:WrapText="1" />' +
                '<ss:Font ss:FontName="arial" ss:Size="10" />' +
                '<ss:Borders>' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
                '<ss:Border ss:Color="#e4e4e4" ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
                '</ss:Borders>' +
                '<ss:Interior />' +
                '<ss:NumberFormat />' +
                '<ss:Protection />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="title">' +
                '<ss:Borders />' +
                '<ss:Font />' +
                '<ss:Alignment ss:WrapText="1" ss:Vertical="Center" ss:Horizontal="Center" />' +
                '<ss:NumberFormat ss:Format="@" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="headercell">' +
                '<ss:Font ss:Bold="1" ss:Size="10" />' +
                '<ss:Alignment ss:WrapText="1" ss:Horizontal="Center" />' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#A3C9F1" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="even">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#CCFFFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="grid1">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#f8f8ff" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="grid2">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#ffffff" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evendate">' +
                '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenint">' +
                '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
                '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '<ss:Style ss:ID="odd">' +
                '<ss:Interior ss:Pattern="Solid" ss:Color="#CCCCFF" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
                '<ss:NumberFormat ss:Format="[ENG][$-409]dd\-mmm\-yyyy;@" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
                '<ss:NumberFormat ss:Format="0" />' +
                '</ss:Style>' +
                '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
                '<ss:NumberFormat ss:Format="0.00" />' +
                '</ss:Style>' +
                '</ss:Styles>' +
                worksheet.xml +
                '</ss:Workbook>';
        },

        createWorksheet: function (includeHidden, title) {

            //      Calculate cell data types and extra class names which affect formatting
            var cellType = [];
            var cellTypeClass = [];
            var cm = this.getColumnModel();
            var totalWidthInPixels = 0;
            var colXml = '';
            var headerXml = '';
            for (var i = 1; i < cm.getColumnCount(); i++) {
                if (includeHidden || !cm.isHidden(i)) {
                    var w = cm.getColumnWidth(i)
                    if (cm.getDataIndex(i) == "nombreautor")
                        w = 265;
                    totalWidthInPixels += w;
                    colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="' + w + '" />';
                    headerXml += '<ss:Cell ss:StyleID="headercell">' +
                        '<ss:Data ss:Type="String">' + cm.getColumnHeader(i) + '</ss:Data>' +
                        '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
                    var fld = this.getStore().recordType.prototype.fields.get(cm.getDataIndex(i));
                    switch (fld.type) {
                        case "int":
                            cellType.push("Number");
                            cellTypeClass.push("int");
                            break;
                        case "float":
                            cellType.push("Number");
                            cellTypeClass.push("float");
                            break;
                        case "bool":
                        case "boolean":
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                        case "date":
                            cellType.push("DateTime");
                            cellTypeClass.push("date");
                            break;
                        default:
                            cellType.push("String");
                            cellTypeClass.push("");
                            break;
                    }
                }
            }
            var visibleColumnCount = cellType.length;

            var result = {
                height: 9000,
                width: Math.floor(totalWidthInPixels * 30) + 50
            };

            //      Generate worksheet header details.
            var t = '<ss:Worksheet ss:Name="Sheet1">' +
                '<ss:Names>' +
                '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + title + '\'!R1:R2" />' +
                '</ss:Names>' +
                '<ss:Table x:FullRows="1" x:FullColumns="1"' +
                ' ss:ExpandedColumnCount="' + visibleColumnCount +
                '" ss:ExpandedRowCount="' + (this.store.getCount() + 2) + '">' +
                colXml +
                '<ss:Row ss:Height="38">' +
                '<ss:Cell ss:StyleID="title" ss:MergeAcross="' + (visibleColumnCount - 1) + '">' +
                '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">' +
                '<html:B><html:U><html:Font html:Size="15">' + title +
                '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />' +
                '</ss:Cell>' +
                '</ss:Row>' +
                '<ss:Row ss:AutoFitHeight="1">' +
                headerXml +
                '</ss:Row>';

            //      Generate the data rows from the data in the Store
            for (var i = 0, it = this.getStore().data.items, l = it.length; i < l; i++) {
                t += '<ss:Row>';
                r = it[i].data;
                var cellClass = (i & 1) ? 'grid2' : 'grid1';
                var nivel = "";
                for (var j = 1; j < cm.getColumnCount(); j++) {
                    if (includeHidden || !cm.isHidden(j)) {
                        var v = r[cm.getDataIndex(j)];
                        if (v != null) {
                            if (v.length > 0)
                                v = this.normalize(v);
                            t += ('<ss:Cell  ss:StyleID="' + cellClass + '">' + '<ss:Data ss:Type="String">' + v + '</ss:Data></ss:Cell>');
                        } else {
                            t += ('<ss:Cell  ss:StyleID="' + cellClass + '">' + '<ss:Data ss:Type="String">' + '' + '</ss:Data></ss:Cell>');
                        }
                    }

                }
                t += '</ss:Row>';
            }

            result.xml = t + '</ss:Table>' +
                '<x:WorksheetOptions>' +
                '<x:PageSetup>' +
                '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
                '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
                '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
                '</x:PageSetup>' +
                '<x:FitToPage />' +
                '<x:Print>' +
                '<x:PrintErrors>Blank</x:PrintErrors>' +
                '<x:FitWidth>1</x:FitWidth>' +
                '<x:FitHeight>32767</x:FitHeight>' +
                '<x:ValidPrinterInfo />' +
                '<x:VerticalResolution>600</x:VerticalResolution>' +
                '</x:Print>' +
                '<x:Selected />' +
                '<x:DoNotDisplayGridlines />' +
                '<x:ProtectObjects>False</x:ProtectObjects>' +
                '<x:ProtectScenarios>False</x:ProtectScenarios>' +
                '</x:WorksheetOptions>' +
                '</ss:Worksheet>';
            return result;
        },
    });
    
    function saveAs(uri, filename) {
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }
    
    stTipoFuentesF = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoFuentesF.baseParams.uri = 1;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stTipoCC = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stTipoCC.baseParams.uri = 2;
                stTipoCC.baseParams.rolepersona = rolepersona;
            },
            load: function (t) {
                
                if(rolepersona==300000000402||rolepersona==300000000403||rolepersona==300000000404){
                    cbCC.setValue(t.reader.jsonData.data[0].iddatos);
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });
    
    stEmpresaImp = new Ext.data.Store({
        autoLoad: true,
        url: 'listarDatos',
        listeners: {
            beforeload: function () {
                stEmpresaImp.baseParams.uri = 3;
            },
            load: function (t) {
            }
        },
        reader: new Ext.data.JsonReader({
            root: "data",
            id: "iddatos"
        }, [{
                name: 'iddatos'
            }, {
                name: 'denominacion'
            }]
                )
    });

    btnAyudaGestSolicitudes = new Ext.Button({
        id: 'btnAyudaGestSolicitudes',
        iconCls: 'ayuda',
        text: perfil.etiquetas.lbBtnAyuda,
        tooltip: perfil.etiquetas.lbTtBtnAyu,
    });

    stCbejercicioPlanes = new Ext.data.Store({
        url: 'getEjercicios',
        autoLoad: true,
        disabled: true,
        reader: new Ext.data.JsonReader({
            root: 'data'
        }, [{
                name: 'idejercicio'
            },{
                name: 'idplan711'
            }, {
                name: 'ejercicio'
            }, {
                name: 'idestado'
            }, {
                name: 'uridatosnomenclador'
            }]),
        listeners: {
            load: function (t) {
                //cbEjercicioPlanes.setValue(t.reader.jsonData.idejercicioactual.idejercicio);
            }
        }
    });
    
    cbEjercicioPlanes = new Ext.form.ComboBox({
        id: 'cbEjercicio',
        width: 150,
        disabled: false,
        store: stCbejercicioPlanes,
        displayField: 'ejercicio',
        valueField: 'idplan711',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                pEstructuras.enable();
                claseMask();
                //stVerificarCredito.reload();
                rec=null;
                ControlarBotones(rec);
            }
        }
    });
    
    cbEmpresasImp = new Ext.form.ComboBox({
        id: 'idcbEmpresasImp',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stEmpresaImp,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                cbCC.enable();
                stSolicitudes711.reload();
                empimp=rec.data.denominacion;
                idempimp=rec.data.iddatos;
                stMontoTotal.reload();
                rec=null;
                ControlarBotones(rec);
            }
        }
    });
    
    cbFF = new Ext.form.ComboBox({
        id: 'idcbFF',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stTipoFuentesF,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                stSolicitudes711.reload();
                ff=rec.data.denominacion;
                stMontoTotal.reload();
                btnAdicionar711.enable();
                rec=null;
                ControlarBotones(rec);
                //btnModificar711.enable();
            }
        }
    });
    
    cbCC = new Ext.form.ComboBox({
        id: 'idcbCC',
        emptyText: 'Seleccione',
        width: 150,
        disabled: true,
        store: stTipoCC,
        displayField: 'denominacion',
        valueField: 'iddatos',
        typeAhead: true,
        mode: 'local',
        forceSelection: true,
        triggerAction: 'all',
        selectOnFocus: true,
        anchor: '95%',
        loadingText: 'Cargando...',
        allowBlank: false,
        listeners: {
            select: function (cb, rec, num) {
                cbFF.enable();
                stSolicitudes711.reload();
                cc=rec.data.denominacion;
                stMontoTotal.reload();
		gpSolicitudes711.enable();
            }
        }
    });
    
    stMontoTotal = new Ext.data.Store({
        autoLoad: false,
        url: 'MontoTotal',
        reader: new Ext.data.JsonReader({
            root: "data"
        }, [{
                name: 'montototal'
            }]
                ),
        listeners: {
            beforeload: function () {
                stMontoTotal.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stMontoTotal.baseParams.identidad = identidadselectedPlanes;
                stMontoTotal.baseParams.idempimp = cbEmpresasImp.getValue();
                stMontoTotal.baseParams.idcc = cbCC.getValue();
                stMontoTotal.baseParams.idff = cbFF.getValue();
                stMontoTotal.baseParams.tipoplan = tipoplan;
            },
            load: function (t) {
                monto = parseFloat(t.reader.jsonData.data[0].montototal);
                montototal.setText(addCommas(monto));
            }
        }
    });
    
    montototal = new Ext.form.Label({
        id: 'idmontototal',
        text: '0.00'
    });
    totalpresentdo = new Ext.form.Label({
        text: '0.00'
    });
    totalcontratado = new Ext.form.Label({
        text: '0.00'
    });
    //combo global
    chglobalPlanes = new Ext.form.Checkbox({
        boxLabel: 'Global',
        id: 'chglobalPlanes',
        listeners: {
            check: function (ck, t) {
                //stGpGestModeloPlanes.reload();
                
            }
        }
    });
    //****************************entidades********************************
    tpEstructuraPlanes = new Ext.estructura.panel.PanelEstructura({
        cargos: false,
        menu: false,
        width: 500

    });
    tpEstructuraPlanes.btnBuscar.setText("");
    tpEstructuraPlanes.btnLimpiar.setText("");
    tpEstructuraPlanes = tpEstructuraPlanes.items.items[0];
    tpEstructuraPlanes.getRootNode().expand();
    tpEstructuraPlanes.addListener('click', function (n) {
        if (n.text != "Estructuras") {
            if(n.attributes.nivel!=0){
                    tpEstructuraPlanes.getSelectionModel().select(n);
                    cbEjercicioPlanes.enable();
                    identidadselectedPlanes = n.id;
                    hojaPlanes = n.leaf;
                    denom_ent = n.text;
                    codigoreup = n.attributes.codigo;
                    stVerificarCredito.reload();
                    direccdest = n.attributes.direccion;
                    rec=null;
                    ControlarBotones(rec);
                    claseMask();
            }else{
                
                if(btnAprobar.hidden == false || btnAprobarAtm.hidden == false || btnAprobarAT.hidden == false
                        || btnAprobarDI.hidden == false || btnAprobarF.hidden == false) {
                    identidadselectedPlanes = null;
                    denom_ent = null;
                    listarSolicitudes();
                    claseMask();
                }
            }
        }

    });
    pEstructuras = new Ext.Panel({
        title: 'Entidades',
        layout: 'fit',
        region: 'west',
        width: 250,
        collapsible: true,
        split: true,
        disabled: true,
        items: [tpEstructuraPlanes]
    });
    pEntPlan = new Ext.Panel({
        layout: 'border',
        region: 'west',
        width: 500,
        items: [pEstructuras]
    });
    //**************grid panel solicitudes****************************
    btnLimpiarSol711 = new Ext.Toolbar.Button({
        iconCls: 'limpiar',
        tabIndex: 11,
        tooltip: perfil.etiquetas.lbTtBtnLimpiar,
        id: 'btntodos',
        disabled: false,
        handler: function () {
            filtrosSolicitudes711.clearFilters();
        }
    });
    stVerificarCredito = new Ext.data.Store({
        url: 'VerificarCredito',
        listeners: {
            beforeload: function () {
                stSolicitudes711.removeAll();
                stVerificarCredito.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stVerificarCredito.baseParams.identidad = identidadselectedPlanes;
            },
            load: function (st, rec, obj) {
                if(rec[0].data.aprobado==1){
                    listarSolicitudes();
                }
                if(rec[0].data.aprobado==0){
                    mostrarMensaje(1, 'La entidad seleccionada no tiene crédito financiero');
                    gpSolicitudes711.disable(true);
                    cbEmpresasImp.disable();
                    claseMask();
                }
            }
        },
        reader: new Ext.data.JsonReader({
            root: "codMsgD",
        }, [{
                name: 'aprobado'
            }]
        )
    });
        
    stSolicitudes711 = new Ext.data.Store({
        url: 'listarSolicitudes711',
        listeners: {
            beforeload: function () {
                stSolicitudes711.removeAll();
                stSolicitudes711.baseParams.start = offset;
                stSolicitudes711.baseParams.idejercicio = cbEjercicioPlanes.getValue();
                stSolicitudes711.baseParams.identidad = identidadselectedPlanes;
                stSolicitudes711.baseParams.idempimp = cbEmpresasImp.getValue();
                stSolicitudes711.baseParams.idcc = cbCC.getValue();
                stSolicitudes711.baseParams.idff = cbFF.getValue();
                stSolicitudes711.baseParams.tipoplan = tipoplan;
            },
            load: function (st, recor, obj) {
                rec = null;
                if(recor.length >=0){
                    gpSolicitudes711.enable(true);
                    totalpresentdo.setText('0.00'); 
                    totalcontratado.setText('0.00');
                    
                    if(recor.length >0){
                        if(recor[0].data.totalsolicitado)
                            totalpresentdo.setText(addCommas(recor[0].data.totalsolicitado));


                        if(recor[0].data.totalcontratado)
                            totalcontratado.setText(addCommas(recor[0].data.totalcontratado));
                    }
                }else{
                    gpSolicitudes711.disable(true);
                }
                gpContrato.disable();
                ControlarBotones();
            }
        },
        reader: new Ext.data.JsonReader({
            totalProperty: "total",
            root: "data"
        }, [{
                name: 'idsolicitud711'
            }, {
                name: 'nosolicitud'
            }, {
                name: 'iddatosempimp'
            }, {
                name: 'iddatoscc'
            }, {
                name: 'denominacion'
            }, {
                name: 'iddatosestado'
            }, {
                name: 'descripciongeneral'
            }, {
                name: 'totalgeneral'
            }, {
                name: 'identidadcliente'
            }, {
                name: 'identidaddestino'
            },{
                name: 'situacionpedido'
            },{
                name: 'idsp'
            },{
                name: 'nopedido'
            }, {
                name: 'fechapresped'
            }, {
                name: 'aperturacredito'
            }, {
                name: 'gerente'
            }, {
                name: 'antecedentes'
            }, {
                name: 'lugarentrega'
            }, {
                name: 'suministrototal'
            }, {
                name: 'otrosgastos'
            }, {
                name: 'idespecialista'
            }, {
                name: 'idgerente'
            }, {
                name: 'iddirector'
            }, {
                name: 'idcodigodecc'
            }, {
                name: 'valorreal'
            }, {
                name: 'iddatosff'
            }, {
                name: 'montoff'
            }, {
                name: 'estaconsolidada'
            }, {
                name: 'esconsolidada'
            }, {
                name: 'iddatostarea'
            }, {
                name: 'iddirectorecon'
            }, {
                name: 'idespecialistacs'
            }, {
                name: 'idcomprador'
            }, {
                name: 'idtiposolicitudplan'
            }, {
                name: 'nombreentidad'
            }, {
                name: 'codigoaprob'
            }, {
                name: 'iddatosgrupcomercial'
            }, {
                name: 'listaaprobacion'
            }, {
                name: 'fechacreacion'
            }, {
                name: 'totalsolicitado'
            }, {
                name: 'totalcontratado'
            }
        ]
                )
    });

    cmSolicitudes711 = new Ext.grid.ColumnModel([
        {
            header: "Estado",
            dataIndex: 'denominacion',
            width: 100,
            renderer: crearToolTip,
            sortable: true,
	    hidden: false
        }
		,{
            header: "Aprobado Especialista",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoEsp,
            sortable: true,
	    hidden: false
        },{
            header: "Aprobado finanzas empresa",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoFINEMP,
            sortable: true,
			hidden: false
        },{
            header: "Aprobado OSDE ATM",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEATM,
            sortable: true,
			hidden: true
        },{
            header: "Aprobado OSDE AT",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEAT,
            sortable: true,
			hidden: true
        },{
            header: "Aprobado OSDE DI",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEDI,
            sortable: true,
			hidden: true
        },{
            header: "Aprobado OSDE Finanzas",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEFIN,
            sortable: true,
			hidden: true
        }
		,{
            header: "Aprobado OSDE Dirección",
            dataIndex: 'listaaprobacion',
            width: 100,
            renderer: renderAprobadoOSDEDIRECC,
            sortable: true,
			hidden: true
        },
		{
            header: "No.Solicitud",
            dataIndex: 'nosolicitud',
            width: 130,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Descripción general",
            dataIndex: 'descripciongeneral',
            width: 180,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Suministro total",
            dataIndex: 'suministrototal',
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "Valor contratado",
            dataIndex: 'valorreal',
            //hidden: true,
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        },{
            header: "Fecha de presentación",
            tooltip: "Fecha de presentación",
            dataIndex: 'fechapresped',
            width: 100,
            align: 'rigth',
            renderer: crearToolTip
        },{
            header: "No. pedido",
            dataIndex: 'nopedido',
            id: 'expandir',
            width: 50,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Gerente",
            dataIndex: 'gerente',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        }
        ,{
            header: "Situación del pedido",
            dataIndex: 'situacionpedido',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Apertura de crédito",
            dataIndex: 'aperturacredito',
            width: 100,
            renderer: crearToolTip,
            sortable: true
        },{
            header: "Monto real en fuente",
            dataIndex: 'montoff',
            hidden: true,
            width: 100,
            renderer: RenderaddCommas,
            sortable: true
        }
    ]);
    
    filtrosSolicitudes711 = new Ext.grid.GridFilters({
        filters: [{
                type: 'string',
                dataIndex: 'nosolicitud'
            }, {
                type: 'string',
                dataIndex: 'nombreentidad'
            }, {
                type: 'string',
                dataIndex: 'descripciongeneral'
            }, {
                type: 'numeric',
                dataIndex: 'totalgeneral'
            },{
                type: 'numeric',
                dataIndex: 'valorreal'
            },{
                type: 'date',
                dataIndex: 'fechapresped'
            }, {
                type: 'string',
                dataIndex: 'nopedido'
            },{
                type: 'string',
                dataIndex: 'gerente'
            }, {
                type: 'string',
                dataIndex: 'situacionpedido'
            }]
    });
    
    smSolicitudes711 = new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
             rowselect : function (sm, y, record) {
                 rec=record;
                 idsolp = rec.data.idsolicitud711;
                 nosol = rec.data.nosolicitud;
                 ControlarBotones();
//                 stContrato.reload();
            }
        }
    });
    
    btnAdicionar711 = new Ext.Toolbar.Button({
        tooltip: 'Adicionar',
        id: 'btnAdicionar711',
        iconCls: 'adicionar',
        hidden: true,
        disabled: true,
        handler: function () {
            plan = cbEjercicioPlanes.getRawValue();
            empimp = cbEmpresasImp.getRawValue();
            cc = cbCC.getRawValue();
            ff = cbFF.getRawValue();
            winFp(1);
        }
    });
    btnEliminar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Eliminar',
        id: 'btnEliminar711',
        iconCls: 'eliminar',
        hidden: true,
        handler: function () {
            //eliminarIndModPlanes();
        }
    });
    btnModificar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Modificar',
        id: 'btnModificar711',
        iconCls: 'modificar',
        hidden: true,
        handler: function () {
            winFp(2);
        }
    });
    btnAprobar = new Ext.Toolbar.Button({
        tooltip: 'Aprobar administrador',
        id: 'btnAprobar',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 5);
        }
    });

    btnAprobarEspF = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista ecónomico empresa',
        id: 'btnAprobarEspF',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1,1);
        }
    });
    btnAprobarEspEmp = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista empresa',
        id: 'btnAprobarEspEmp',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1,7);
        }
    });
    btnAprobarAtm = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista ATM OSDE',
        id: 'btnAprobarAtm',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 2);
        }
    });
    btnAprobarAT = new Ext.Toolbar.Button({
        tooltip: 'Aprobar área técnica OSDE',
        id: 'btnAprobarAT',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 3);
        }
    });
    btnAprobarDI = new Ext.Toolbar.Button({
        tooltip: 'Aprobar dirección de inversiones OSDE',
        id: 'btnAprobarDI',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 4);
        }
    });
    btnAprobarF = new Ext.Toolbar.Button({
        tooltip: 'Aprobar especialista finanzas OSDE',
        id: 'btnAprobarF',
        disabled: true,
        iconCls: 'aprobar',
        hidden: true,
        handler: function () {
            textorchazo=null;
            AprobarDesaprobar(1, 6);
        }
    });

    btnDesaprobar = new Ext.Toolbar.Button({
        tooltip: 'Rechazar',
        id: 'btnDesaprobar',
        disabled: true,
        iconCls: 'desaprobar',
        hidden: true,
        handler: function () {
            MotivoRechazo(2);
        }
    });
    btnVerJust = new Ext.Toolbar.Button({
        tooltip: 'Ver justificación',
        id: 'btnVerJust',
        disabled: true,
        iconCls: 'ver',
        hidden: true,
        handler: function () {
            winModificaciones();
        }
    });
    btnActualizarFechaP = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Actualizar fecha pedido',
        id: 'btnActualizarFechaP',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            ActualizarFechaP();
        }
    });
    btnActualizar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Actualizar pedido',
        id: 'btnActualizar711',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            actualizarGerentePedido();
        }
    });
    btnAperturaCred = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Apertura carta crédito',
        id: 'btnAperturaCred',
        iconCls: 'actualizar',
        hidden: true,
        handler: function () {
            ActualizarFechaAperturaCredito();
        }
    });
    btnExportar711 = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Exportar plantilla 711',
        id: 'btnExportar711',
        iconCls: 'exportar',
        hidden: true,
        handler: function () {
            Exportar711();
        }
    });
    menuSituacionPEdido = new Ext.Toolbar.MenuButton({
        id: 'menuSituacionPEdido',
        tooltip: 'Situación del pedido',
        iconCls: 'cambiodestado',
        disabled: true,
        hidden: true,
        menu: {
            items: [{
                text: 'En solicitud de ofertas',
                id: 'Ensolicitud',
                handler: function () {
                        CambiarSituacionPedido(4, 'En solicitud de ofertas');
                }
            },{
                text: 'Ofertas pendientes',
                id: 'OfertaPend',
                handler: function () {
                        CambiarSituacionPedido(5, 'Ofertas pendientes');
                }
            },{
                text: 'Para comité Tecnotex',
                id: 'ParaTec',
                handler: function () {
                        CambiarSituacionPedido(6, 'Para comité Tecnotex');
                }
            },{
                text: 'Para comité GAE',
                id: 'ParaGae',
                handler: function () {
                        CambiarSituacionPedido(7, 'Para comité GAE');
                }
            },{
                text: 'Devuelto',
                id: 'Devuelto',
                handler: function () {
                        CambiarSituacionPedido(2, 'Devuelto');
                }
            },{
                text: 'En proceso de contratación',
                id: 'Enproceso',
                handler: function () {
                        msgmotivo = "";
                        mostrarMensaje(2, '¿Solicitar modificacar la solicitud?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                EscribirMotivo(3, 'En proceso de contratación');
                            } else {
                                CambiarSituacionPedido(3, 'En proceso de contratación');
                            }
                        });  
                }
            },{
                text: 'Contratado',
                id: 'Contratado',
                handler: function () {
//                    if (rec.data.iddatosestado=='5042'){
                        CambiarSituacionPedido(1, 'Contratado');
//                    }else{
//                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
//                    }
                }
            },{
                text: 'Suministrado completamente',
                id: 'Completo',
                handler: function () {
                    if (rec.data.iddatosestado=='5042'){
                        CambiarSituacionPedido(9, 'Suministrado completamente');
                    }else{
                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
                    }
                }
            },{
                text: 'Puesta en marcha',
                id: 'Marcha',
                handler: function () {
                    if (rec.data.iddatosestado==5042){
                        CambiarSituacionPedido(10, 'Puesta en marcha');
                    }else{
                        mostrarMensaje(1, "La solicitud no se encuentra aceptada por la dirección");
                    }
                        
                }
                
            },{
                text: 'Cancelado',
                id: 'Cancelado',
                handler: function () {
                        msgmotivo = "";
                        mostrarMensaje(2, '¿Escribir motivo para cancelar solicitud?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                EscribirMotivo(11, 'Cancelado');
                            }
                        });  
                }
                
            },{
                text: 'Reactivar',
                id: 'Reactivar',
                handler: function () {
                        mostrarMensaje(2, '¿Està seguro que desea reactivar la solicitud seleccionada?', function (btnPresionado) {
                            if (btnPresionado == 'ok') {
                                CambiarSituacionPedido(12, 'Reactivar'); 
                            }
                        }); 
                        
                }
                
            }]
        }
    });
    btnVerDescripcionSol = new Ext.Toolbar.Button({
        tooltip: 'Ver especificaciones técnicas',
        id: 'btnVerDescripcionSol',
        disabled: true,
        iconCls: 'ver',
        //hidden: true,
        handler: function () {
            winDescripcionTodas();
        }
    });
    
    btnDistribucionProd = new Ext.Toolbar.Button({
        disabled: true,
        tooltip: 'Distribuir productos suministrados',
        id: 'btnDistribucionProd',
        iconCls: 'distribucion',
        hidden: false,
        handler: function () {
            WpActualizarSuministros();
        }
    });
    
        btnExportarVista = new Ext.Button(
        {
            handler: function () {
                var file= 'data:application/vnd.ms-excel;base64,' +
                    gpSolicitudes711.Base64(
                        gpSolicitudes711.getExcelXml(true, "Listado de Solicitudes")
                    );
                saveAs(file, 'Listado de Solicitudes-'+(new Date()).dateFormat('Y/m/d')+'.xls');
            },
            disabled: false,
            iconCls: 'exportar',
            tooltip: 'Exportar lista de solicitudes',
            id: 'btnExportarVista',
            scope: this
        }); 
    
    gpSolicitudes711 = new Ext.grid.EditorGridPanel({
        frame: true,
        stripeRows: true,
        store: stSolicitudes711,
        sm: smSolicitudes711,
        disabled: true,
        region: 'center',
        layout: 'fit',
        autoExpandColumn: 'expandir',
        cm: cmSolicitudes711,
        tbar: ['Fuentes de Financiamiento: ',cbFF
            ,btnAdicionar711/*,btnEliminar711*/,btnModificar711,
            btnAprobar,btnAprobarEspF,btnAprobarAtm,btnAprobarAT,btnAprobarDI, btnAprobarF, btnAprobarEspEmp,btnDesaprobar,
            btnVerJust,btnVerDescripcionSol,btnActualizar711/*, btnActualizarFechaP*/,menuSituacionPEdido,btnExportar711, '-', btnAperturaCred, '-',btnDistribucionProd,'->',btnExportarVista],
        bbar: new Ext.PagingToolbar({
            pageSize: 1000,
            store: stSolicitudes711,
            displayInfo: true,
            items: [btnLimpiarSol711],
            listeners: {
                beforechange: function (p, e) {
                    offset = e.start;
                }
            }
        }),
        plugins: filtrosSolicitudes711,
        loadMask: {
            msg: 'Cargando ...'
        },
        listeners: {
            celldblclick: function (me, row_id, col_id) {
                gpSolicitudes711.getColumnModel().setEditable(col_id, true);
            }
        }
    });

    pSolicitudes = new Ext.Panel({
        id: 'pSolicitudes',
        title: perfil.etiquetas.titModelos,
        split: true,
        disabled: false,
        region: 'center',
        layout: 'border',
        tbar: ['Plan: ', cbEjercicioPlanes, '-','Empresa Importadora: ',cbEmpresasImp,'-','Concepto de compra: ',cbCC/*,'-',chglobalPlanes*/],
        items: [gpSolicitudes711]
    });
    //****************panel de Contrato*******************
    pCEmbarquesMin = new Ext.Panel({
        region: 'center',
        layout: 'fit',
        split: true,
        items: [gpCtFuentesF]
    });
    
    tabDetallesEmbarques = new Ext.TabPanel({
        activeTab: 0,
//        width:1000,
//        height:450,
        //layout: 'fit',
        plain:true,
        defaults:{autoScroll: true},
        items: [{
                title: 'Cubicajes',
                layout: 'fit',
                html: "<div id = 'cubicajes' ></div>",
                items: [gpListaDetalles]
            }, {
                title: 'Formas de pago',
                layout: 'fit',
                html: "<div id = 'formaspagos' ></div>",
                items: [gpCtFormaPago]
            }
        ],
        listeners: {
             tabchange : function (panel,tab){                 
                 tab.doLayout(true);                 
             }
        }
    });
    
    pDetalleEmbarque= new Ext.Panel({
        region: 'east',
        layout: 'fit',
        collapsible: true,
        collapsed: true,
        width: '70%',
        titleCollapse: true,
        split: true,
        title: "Detalles de por embarque",
        margins:'0 0 0 0',
        items: [tabDetallesEmbarques]
    });
    
    pCEmbarques= new Ext.Panel({
        region: 'east',
        layout: 'border',
        collapsible: true,
        collapsed: true,
        width: '85%',
        titleCollapse: true,
        split: true,
        title: "Embarques de contrato",
        margins:'0 0 0 0',
        items: [pCEmbarquesMin, pDetalleEmbarque]
    });
    pCont= new Ext.Panel({
        region: 'center',
        layout: 'fit',
        //width: '30%',
        items: [gpContrato]
    });
    pContratoyEmbarques= new Ext.Panel({
        region: 'center',
        layout: 'border',
        items: [pCont, pCEmbarques]
    });
    
    pContrato = new Ext.Panel({
        //id: 'pContrato',
        region: 'south',
        layout: 'border',
        collapsible: true,
        collapsed: true,
        disabled: false,
        height: 300,
        //hidden: true,
        titleCollapse: true,
        split: true,
        title: "Contrato",
        items: [pContratoyEmbarques]
    });
    //****************panel de solicitudes*******************
    pSolicitudesTodas = new Ext.Panel({
        region: 'center',
        layout: 'border',
        //tbar: ['MOnto akkaksaka'],
        items: [pSolicitudes, pContrato]
    });
    
    
    //****************panel principal*******************
    pGeneral = new Ext.Panel({
        layout: 'border',
        tbar: ['->','Monto total disponible: ',montototal,'-','Total presentado: ',totalpresentdo,'-','Total contratado: ',totalcontratado, btnAyudaGestSolicitudes],
        items: [pEstructuras, pSolicitudesTodas]
    });
    //******************viewport*****************
    myViewPlanes = new Ext.Viewport({
        layout: 'fit',
        items: [pGeneral],
        listeners: {
            afterlayout: function (e) {
//                var claseMask = document.getElementsByClassName('ext-el-mask');
//                var maskEstructura = claseMask.item(0);
//                var maskDistribucion = claseMask.item(1);
//                (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
//                (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
            claseMask();
            }
        }
    });
    
    function claseMask() {
        var claseMask = document.getElementsByClassName('ext-el-mask');
        var maskEstructura = claseMask.item(0);
        var maskDistribucion = claseMask.item(1);
        (maskEstructura != null) ? maskEstructura.style.zIndex = '0' : null;
        (maskDistribucion != null) ? maskDistribucion.style.zIndex = '0' : null;
    }
}

function listarSolicitudes(){
    stSolicitudes711.reload();
    cbEmpresasImp.enable();
    stMontoTotal.reload();
    rec=null;
    ControlarBotones(rec);
}

function AprobarDesaprobar(accion, aprobacion){
    text = (accion == 1) ? 'aprobar' : 'desaprobar';
    mostrarMensaje(2, '¿Está seguro que desea ' + text + ' el pedido ?', function (btnPresionado) {
        if (btnPresionado == 'ok') {
            mymask.show();
            Ext.Ajax.request({
                url: 'AprobarDesaprobar',
                params: {
                    aprobacion: aprobacion,
                    accion: accion,
                    idsolicitud711: smSolicitudes711.getSelected().data.idsolicitud711,
                    textorchazo: textorchazo
                },
                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData) {
                        if (responseData.msg == 1) {
                            listarSolicitudes();
                            mostrarMensaje(2, 'La solicitud ha sido aprobada correctamente');
                            if (responseData.usuarios.length > 0) {
                                setTimeout(function () {
                                    mostrarMensaje(2, 'Se ha detectado una configuración de notificaciones');
                                    ListaUsuariosNotificar(responseData.usuarios, 1);
                                }, 4000);
                            }
                        } else if (responseData.msg == 2) {
                            mostrarMensaje(1, responseData.msg);
                            gpSolicitudes711.disable(true);
                        }
                    }
                    mymask.hide();
                }
            });
        }
    });
}

function ControlarBotones(){
    btnEliminar711.disable();
    btnVerJust.disable();
    btnExportar711.disable();
    btnAprobar.disable();
    btnAprobarEspF.disable();
    btnAprobarAtm.disable();
    btnAprobarAT.disable();
    btnAprobarDI.disable();
    btnAprobarEspEmp.disable();
    btnAprobarF.disable();
    btnDesaprobar.disable();
    btnVerJust.disable();
    menuSituacionPEdido.disable();
    Ext.getCmp('Reactivar').disable(); 
    btnActualizarFechaP.disable();
    gpContrato.disable();
    gpCtFuentesF.disable();
    //***************************stContrato.reload();
    btnModificar711.disable();
    btnActualizar711.disable();
    btnAperturaCred.disable();
    btnDistribucionProd.disable();
    btnVerDescripcionSol.disable();

    if(rec!=null){
         
        btnExportar711.enable();
        if(rec.data.nopedido != null || rec.data.idsp != null){
            if(rec.data.idsp == '5026'){
                btnEliminar711.disable();
                btnVerJust.disable();
                //btnExportar711.disable();
                btnAprobar.disable();
                btnAprobarEspF.disable();
                btnAprobarAtm.disable();
                btnAprobarAT.disable();
                btnAprobarDI.disable();
                btnAprobarF.disable();
                btnDesaprobar.disable();
                btnVerJust.enable();
                btnVerDescripcionSol.enable();
                menuSituacionPEdido.disable();
                btnActualizarFechaP.disable();
                gpContrato.enable();
                gpCtFuentesF.enable();
                stContrato.reload();
                btnModificar711.disable();
                btnActualizar711.disable();
            }else{
                if (rec.data.idsp == '1245'){
//                    btnEliminar711.enable();
                    menuSituacionPEdido.disable();
                    gpContrato.disable();
                    btnVerJust.enable();
                    btnAprobar.disable();
                    btnAprobarEspF.disable();
                    btnAprobarAtm.disable();
                    btnAprobarAT.disable();
                    btnAprobarDI.disable();
                    btnAprobarF.disable();
                    btnDesaprobar.disable();
                    btnVerDescripcionSol.enable();
                    btnActualizarFechaP.disable();
                    btnActualizar711.disable();
                }
                if (rec.data.idsp != '1245'){
                    //btnExportar711.enable();
                    btnAprobar.enable();
                    btnAprobarEspF.enable();
                    btnAprobarAtm.enable();
                    btnAprobarAT.enable();
                    btnAprobarDI.enable();
                    btnAprobarF.enable();
                    btnDesaprobar.enable();
                    btnVerJust.enable();
                    btnVerDescripcionSol.enable();
                    menuSituacionPEdido.enable();
                    btnActualizarFechaP.enable();
                    btnActualizar711.enable();
                }
                switch (rec.data.idsp){
                    case '5023':
                            menuSituacionPEdido.enable();
                            Ext.getCmp('Ensolicitud').disable(); 
                            Ext.getCmp('OfertaPend').disable(); 
                            Ext.getCmp('ParaTec').disable(); 
                            Ext.getCmp('ParaGae').disable(); 
                            Ext.getCmp('Devuelto').disable(); 
                            Ext.getCmp('Enproceso').enable(); 
                            Ext.getCmp('Contratado').enable(); 
                            //Ext.getCmp('Parcial').enable(); 
                            Ext.getCmp('Completo').enable(); 
                            Ext.getCmp('Marcha').enable(); 
                            Ext.getCmp('Cancelado').enable();
                            btnAprobar.enable();
                            btnAprobarEspF.enable();
                            btnAprobarAtm.enable();
                            btnAprobarAT.enable();
                            btnAprobarDI.enable();
                            btnAprobarF.enable();
                            btnDesaprobar.enable();
                            gpContrato.disable();
                            btnDistribucionProd.disable();
                            gpCtFuentesF.disable();
                            btnVerJust.enable();
                    break;
                    case '5024':
                            Ext.getCmp('Ensolicitud').disable(); 
                            Ext.getCmp('OfertaPend').disable(); 
                            Ext.getCmp('ParaTec').disable(); 
                            Ext.getCmp('ParaGae').disable(); 
                            Ext.getCmp('Devuelto').disable(); 
                            Ext.getCmp('Enproceso').enable(); 
                            Ext.getCmp('Contratado').enable(); 
                            //Ext.getCmp('Parcial').enable(); 
                            Ext.getCmp('Completo').enable(); 
                            Ext.getCmp('Marcha').enable(); 
                            Ext.getCmp('Cancelado').disable();
                            btnAprobar.disable();
                            btnAprobarEspF.disable();
                            btnAprobarAtm.disable();
                            btnAprobarAT.disable();
                            btnAprobarDI.disable();
                            btnAprobarF.disable();
                            btnDesaprobar.disable();
                            gpContrato.enable();
                            btnDistribucionProd.enable();
                            gpCtFuentesF.enable();
                            stContrato.reload();
                            menuSituacionPEdido.enable();
                            btnVerJust.enable();
                    break;
                    case '5025':
                            Ext.getCmp('Ensolicitud').disable(); 
                            Ext.getCmp('OfertaPend').disable(); 
                            Ext.getCmp('ParaTec').disable(); 
                            Ext.getCmp('ParaGae').disable(); 
                            Ext.getCmp('Devuelto').disable(); 
                            Ext.getCmp('Enproceso').disable(); 
                            Ext.getCmp('Contratado').enable(); 
                            //Ext.getCmp('Parcial').enable(); 
                            Ext.getCmp('Completo').enable(); 
                            Ext.getCmp('Marcha').enable(); 
                            Ext.getCmp('Cancelado').disable(); 
                            gpContrato.enable();
                            gpCtFuentesF.enable();
                            btnDistribucionProd.enable();
                            stContrato.reload();
                            btnAprobar.disable();
                            btnAprobarEspF.disable();
                            btnAprobarAtm.disable();
                            btnAprobarAT.disable();
                            btnAprobarDI.disable();
                            btnAprobarF.disable();
                            btnDesaprobar.disable();
                            menuSituacionPEdido.enable();
                            btnVerJust.enable();
                    break;
                    case '5086':
                            Ext.getCmp('Ensolicitud').disable(); 
                            Ext.getCmp('OfertaPend').disable(); 
                            Ext.getCmp('ParaTec').disable(); 
                            Ext.getCmp('ParaGae').disable(); 
                            Ext.getCmp('Devuelto').disable(); 
                            Ext.getCmp('Enproceso').disable(); 
                            Ext.getCmp('Contratado').enable(); 
                            //Ext.getCmp('Parcial').enable(); 
                            Ext.getCmp('Completo').enable(); 
                            Ext.getCmp('Marcha').enable(); 
                            Ext.getCmp('Cancelado').disable(); 
                            gpContrato.enable();
                            gpCtFuentesF.enable();
                            btnDistribucionProd.enable();
                            stContrato.reload();
                            btnAprobar.disable();
                            btnAprobarEspF.disable();
                            btnAprobarAtm.disable();
                            btnAprobarAT.disable();
                            btnAprobarDI.disable();
                            btnAprobarF.disable();
                            btnDesaprobar.disable();
                            menuSituacionPEdido.enable();
                            btnVerJust.enable();
                    break;
                }

            }
            if (rec.data.idsp == "5020" ||rec.data.idsp == "5018" ||rec.data.idsp == "5019" ||rec.data.idsp == "5021" ||rec.data.idsp =="5022" || rec.data.idsp == null) {
                        btnVerJust.enable();
                        //btnExportar711.enable();
                        Ext.getCmp('Ensolicitud').enable();
                        Ext.getCmp('OfertaPend').enable();
                        Ext.getCmp('ParaTec').enable();
                        Ext.getCmp('ParaGae').enable();
                        Ext.getCmp('Devuelto').enable();
                        Ext.getCmp('Enproceso').enable();
                        Ext.getCmp('Contratado').disable();
                        //Ext.getCmp('Parcial').enable(); 
                        Ext.getCmp('Completo').disable();
                        Ext.getCmp('Marcha').disable();
                        Ext.getCmp('Cancelado').enable();
                        gpContrato.disable();
                        gpCtFuentesF.disable();
                        //stContrato.reload();
                        btnAprobar.enable();
                        btnAprobarEspF.enable();
                        btnAprobarAtm.enable();
                        btnAprobarAT.enable();
                        btnAprobarDI.enable();
                        btnAprobarF.enable();
                        btnDesaprobar.enable();
                        menuSituacionPEdido.enable();
                        btnActualizarFechaP.enable();
                        btnActualizar711.enable();
                        //btnAperturaCred.enable();
                    }
        }else{
            menuSituacionPEdido.enable();
                Ext.getCmp('Ensolicitud').disable();
                Ext.getCmp('OfertaPend').disable();
                Ext.getCmp('ParaTec').disable();
                Ext.getCmp('ParaGae').disable();
                Ext.getCmp('Devuelto').disable();
                Ext.getCmp('Enproceso').disable();
                Ext.getCmp('Contratado').disable();
                //Ext.getCmp('Parcial').enable(); 
                Ext.getCmp('Completo').disable();
                Ext.getCmp('Marcha').disable();
                Ext.getCmp('Cancelado').enable();
            btnAprobar.enable();
            btnAprobarEspF.enable();
            btnAprobarAtm.enable();
            btnAprobarAT.enable();
            btnAprobarDI.enable();
            btnAprobarF.enable();
            btnDesaprobar.enable();
            btnActualizar711.disable();
            gpContrato.disable();
            gpCtFuentesF.disable();
            btnVerJust.enable();
            btnVerDescripcionSol.enable();
            //btnExportar711.enable();
        }
        if (cbFF.disabled == false) {
            btnModificar711.enable();
        } else {
            btnModificar711.disable();
        }
        if (rec.data.listaaprobacion != null) {
            lista=rec.data.listaaprobacion;
            if((lista.includes('1') && lista.includes('2') && lista.includes('3') && lista.includes('4')
			&& lista.includes('6') && lista.includes('7') && btnDesaprobar.hidden == true)|| lista.includes('5') ){
                btnExportar711.enable();
                btnActualizar711.enable();
            }else{
                btnExportar711.disable();
                if (rec.data.idsp == "5020" || rec.data.idsp == "5018" || rec.data.idsp == "5019" || rec.data.idsp == "5021" || rec.data.idsp == "5022" || rec.data.idsp == null) {
                    btnActualizar711.enable();
                }
                
            }
            if(lista=='0'|| rec.data.idsp == "5023" ){
                btnModificar711.enable();
                btnAprobarEspEmp.enable();
            }else{
                btnModificar711.disable();
            }
            
        }
        if(btnAprobar.hidden == false || btnAprobarAtm.hidden == false || btnAprobarAT.hidden == false
                 || btnAprobarDI.hidden == false || btnAprobarF.hidden == false || btnAprobarEspF.hidden == false) {
             btnExportar711.enable();
             if (rec.data.idsp == '1245'){
                menuSituacionPEdido.enable();
                Ext.getCmp('Ensolicitud').disable();
                Ext.getCmp('OfertaPend').disable();
                Ext.getCmp('ParaTec').disable();
                Ext.getCmp('ParaGae').disable();
                Ext.getCmp('Devuelto').disable();
                Ext.getCmp('Enproceso').disable();
                Ext.getCmp('Contratado').disable();
                //Ext.getCmp('Parcial').enable(); 
                Ext.getCmp('Completo').disable();
                Ext.getCmp('Marcha').disable();
                Ext.getCmp('Cancelado').disable();
                Ext.getCmp('Reactivar').enable(); 
            }
         }else{
             Ext.getCmp('Reactivar').hide();
             if(lista.includes('2')||lista.includes('6')||lista.includes('4')||lista.includes('5')||lista.includes('3')){
                btnDesaprobar.disable();
             } 
         }
        if(cbCC.getValue()=="" || cbEmpresasImp.getValue()=="" || cbFF.getValue()==""){
            btnModificar711.disable();
        }
        if (rec.data.idsp == '1245') {
            btnModificar711.disable();
        }
    }
    if(identidadselectedPlanes==null){
        btnAdicionar711.disable();
        btnModificar711.disable();
    }
    
}
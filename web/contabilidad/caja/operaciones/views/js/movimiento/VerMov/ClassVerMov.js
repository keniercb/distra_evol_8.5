Ext.namespace('Ext.ClassVerMg');

Ext.ClassVerMg = Ext.extend(Ext.Component, {
    infoHTML: undefined,
    infoImporte: undefined,
    etiquetas: undefined,
    arrayMg: undefined,
    tipoMg: undefined,
    confEspecialidad: undefined,
    url: undefined,

    constructor: function(tipoMg, etiquetas, arrayMg, url, confEspecialidad)
    {
        this.etiquetas = etiquetas;
        this.confEspecialidad = confEspecialidad;
        this.arrayMg = arrayMg;
        this.tipoMg = tipoMg;
        this.url = url;
        this.initializeFunctions(this);
        this.fLoadDataGrid(this);
        return Ext.ClassVerMg.superclass.constructor.call(this);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeVer');

        this.btnVerCerrar.on('click', function(component)
        {
            scope.wVerMg.close();
            scope.fireEvent('closeVer', true);
        });
    },
    fLoadDataGrid: function(scope)
    {
        var arrayMg = scope.arrayMg;
        var preview = new Array();
        if (arrayMg.length > 0)
        {
            for (var i = 0; i < arrayMg.length; i++)
            {
                preview.push([
                    {
                        'nombrecliente': arrayMg[i].nombrecliente
                    }, // 0
                    {
                        'denominacion': arrayMg[i].denominacion
                    }, // 1
                    {
                        'numerodocumento': arrayMg[i].numerodocumento
                    }, // 2
                    {
                        'numerocontrato': arrayMg[i].numerocontrato
                    }, // 3
                    {
                        'text': arrayMg[i].text
                    }, // 4
                    {
                        'excepcional': arrayMg[i].excepcional
                    }, // 5
                    {
                        'fechaemision': arrayMg[i].fechaemision
                    }, // 6
                    {
                        'fechaentrega': arrayMg[i].fechaentrega
                    }, // 7
                    {
                        'fecharecepcion': arrayMg[i].fecharecepcion
                    }, // 8
                    {
                        'idestadodocumento': arrayMg[i].idestadodocumento
                    }, // 9
                    {
                        'importemb': arrayMg[i].importemb
                    }, // 10
                    {
                        'pagadomb': arrayMg[i].pagadomb
                    }, // 11
                    {
                        'idcuenta': arrayMg[i].idcuenta
                    }, // 12
                    {
                        'idcliente': arrayMg[i].idcliente
                    }, // 13
                    {
                        'numcomprobante': arrayMg[i].numcomprobante
                    }, // 14
                    {
                        'comentario': arrayMg[i].comentario
                    }, // 15
                    {
                        'especialidad': arrayMg[i].especialidad
                    }, // 16
                    {
                        'idderechouobligacion': arrayMg[i].idderechouobligacion
                    }, // 17
                    {
                        'estado': arrayMg[i].estadodescripcion
                    }, // 18
                    {
                        'liquidadomb': arrayMg[i].liquidadomb
                    }, // 19
                    {
                        'idsubsistema': arrayMg[i].idsubsistema
                    }, // 20
                    {
                        'documentoexterno': arrayMg[i].documentoexterno
                    }, // 21
                    {
                        'importecontable': arrayMg[i].importemo
                    }, // 22
                    {
                        'iva': arrayMg[i].iva
                    } // 23
                ]);
            }
        } else
            preview = new Array();
        scope.fHTMlConfigPreView(preview);
    },
    initializeFunctions: function(scope)
    {
        this.fShowWindow = function()
        {
            scope.wVerMg.show(Ext.getBody(), function()
            {
                scope.wVerMg.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fHTMlConfigPreView = function(previewHTML)
        {
            var arrIdMg = new Array();//almacena los id de las cuentas
            var arrIdcuenta = new Array();//almacena los id de las cuentas
            var arrIdcliente = new Array();//almacena los id de los clientes
            var arrIdclienteaux = new Array();//almacena los id de los clientes	
            var indDuO = false;//existe la cuenta en el array
            var indCuenta = false;//existe la cuenta en el array
            var indCliente = false;//existe el cliente en el array
            if (previewHTML.length > 0) {
                for (var i = 0; i < previewHTML.length; i++) {
                    indCuenta = false;
                    indCliente = false;
                    if (arrIdcuenta.length == 0)//si esta vacio se agrega el primer elemento
                    {
                        arrIdcuenta.push(previewHTML[i][12]['idcuenta']);
                    }
                    for (var j = 0; j < arrIdcuenta.length; j++) {//se verifica que el elemento no exista en el array de idcuenta
                        if (previewHTML[i][12]['idcuenta'] == arrIdcuenta[j])
                        {
                            indCuenta = false;
                            break;
                        }
                        else
                            indCuenta = true;
                    }
                    if (indCuenta == true)
                        arrIdcuenta.push(previewHTML[i][12]['idcuenta']);

                    for (var k = 0; k < arrIdcuenta.length; k++) {//se verifica que el elemento no exista en el array de idcuenta
                        if (previewHTML[i][17]['idderechouobligacion'] == arrIdMg[k])
                        {
                            indDuO = false;
                            break;
                        }
                        else
                            indDuO = true;
                    }
                    if (indDuO == true)
                        arrIdMg.push(previewHTML[i][17]['idderechouobligacion']);

                    if (arrIdcliente.length == 0)//si esta vacio se agrega el primer elemento
                    {
                        arrIdclienteaux = new Array();//almacena los id de los clientes
                        arrIdclienteaux.push(previewHTML[i][12]['idcuenta']);
                        arrIdclienteaux.push(previewHTML[i][13]['idcliente']);
                        arrIdcliente.push(arrIdclienteaux);
                    }

                    for (var r = 0; r < arrIdcliente.length; r++) {//se verifica que el elemento no exista en el array de idcuenta
                        if ((previewHTML[i][13]['idcliente'] == arrIdcliente[r][1]) && (previewHTML[i][12]['idcuenta'] == arrIdcliente[r][0]))
                        {
                            indCliente = false;
                            break;
                        }
                        else
                            indCliente = true;
                    }
                    if (indCliente == true)
                    {
                        arrIdclienteaux = new Array();//almacena los id de los clientes
                        arrIdclienteaux.push(previewHTML[i][12]['idcuenta']);
                        arrIdclienteaux.push(previewHTML[i][13]['idcliente']);
                        arrIdcliente.push(arrIdclienteaux);
                    }
                }
            }
            //se cargar los datos 
            Ext.Ajax.request({//se busca el importe de la cuenta (parametro:arrayIdcuenta)
                url: this.url + 'loadDataVer',
                method: 'POST',
                timeout: 9000000,
                params: {
                    tipoduo: scope.tipoMg,
                    arrayidcuenta: Ext.encode(arrIdcuenta),
                    arrayidcliente: Ext.encode(arrIdcliente),
                    arrayidduo: Ext.encode(arrIdMg)
                },
                callback: function(options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    scope.fFormatoHtmlVer(previewHTML, responseData);
                }
            });
        };

        this.fFormatoHtmlVer = function(previewHTML, impCuenta)
        {
            var monedaBsf = ' BsF';
            var infoHTML = '';
            var infoImporte = '';
            var contoperac = 0;
            var nombreFecha = (scope.tipoMg == 1) ? "- <b>" + scope.etiquetas.lbFechaEntrega + ": </b>" : "- <b>" + scope.etiquetas.lbFechaRecibo + ": </b>"
            var inicio_fila = '<div  style="font-size: 10pt"><p>&nbsp;&nbsp;';
            var final_fila = '</p></div>';
            var espacios = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            var importe = '';
            var nombreCliente = '';

            if (scope.tipoMg == 1)
                nombreCliente = "- <b>" + scope.etiquetas.lbCliente + ": </b>";
            else if (scope.tipoMg == 2)
                nombreCliente = "- <b>" + scope.etiquetas.lbProveedor + ": </b>";
            else
                nombreCliente = "- <b>" + scope.etiquetas.lbParrafoFiscal + ": </b>";

            if (previewHTML.length > 0) {
                for (var i = 0; i < previewHTML.length; i++) {
                    infoHTML += '<div style="padding:11px;background:#E7F1FE;font-size: 10pt"><p><b>'
                            + 'No. documento: </b>' + previewHTML[i][2]['numerodocumento'] + "&nbsp;&nbsp;&nbsp;&nbsp;" + '</p></div>';

                    infoHTML += '<div  style="font-size: 3pt"><p>' + "&nbsp;" + final_fila;
                    infoHTML += inicio_fila + nombreCliente + previewHTML[i][0]['nombrecliente'] + final_fila;
                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbCuenta + ": </b>" + previewHTML[i][4]['text'] + final_fila;
                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbTipoDoc + ": </b>" + previewHTML[i][1]['denominacion'] + final_fila;

                    if (previewHTML[i][21]['documentoexterno'])
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbDocOrigen + ": </b>" + previewHTML[i][21]['documentoexterno'] + final_fila;

                    if (scope.confEspecialidad) {
                        if (previewHTML[i][16]['especialidad'])
                            infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbEspecialidad + ": </b>" + previewHTML[i][16]['especialidad'] + final_fila;
                    }

                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbEstado + ": </b>" + previewHTML[i][18]['estado'] + final_fila;

                    if (previewHTML[i][10]['importemb'] < 0) {
                        importe = Math.abs(Math.round(previewHTML[i][10]['importemb'] * 100) / 100);
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(importe) + monedaBsf + final_fila;
                    }
                    else {
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(previewHTML[i][10]['importemb']) + monedaBsf + final_fila;
                    }
                    if (previewHTML[i][23]['iva'] < 0) {
                        importe = Math.abs(Math.round(previewHTML[i][23]['iva'] * 100) / 100);
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbIVA + ": </b>" + formatoMonedaABS(importe) + monedaBsf + final_fila;
                    }
                    else {
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbIVA + ": </b>" + formatoMonedaABS(previewHTML[i][23]['iva']) + monedaBsf + final_fila;
                    }
                    if (previewHTML[i][22]['importecontable'] < 0) {
                        importe = Math.abs(Math.round(previewHTML[i][22]['importecontable'] * 100) / 100);
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbTotalFactura + ": </b>" + formatoMonedaABS(importe) + monedaBsf + final_fila;
                    }
                    else {
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbTotalFactura + ": </b>" + formatoMonedaABS(previewHTML[i][22]['importecontable']) + monedaBsf + final_fila;
                    }
                    
                    var liquidado = '';
                    if (previewHTML[i][19]['liquidadomb'] == 0)
                        liquidado = '0.00' + monedaBsf;
                    else if (previewHTML[i][19]['liquidadomb'] < previewHTML[i][10]['importemb'])
                        liquidado = scope.etiquetas.lbParcial + ' ' + formatoMonedaABS(previewHTML[i][19]['liquidadomb']) + monedaBsf;
                    else if (previewHTML[i][19]['liquidadomb'] == previewHTML[i][10]['importemb'])
                        liquidado = scope.etiquetas.lbTotal;

                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbLiquidado + ": </b>" + liquidado + final_fila;

                    //importe segun la cuenta y el cliente
                    var cuentacliente = '0.00';
                    var importectacliente = '0.00';
                    if (impCuenta['ctacliente'].length > 0) {
                        for (var k = 0; k < impCuenta['ctacliente'].length; k++) {
                            if (previewHTML[i][12]['idcuenta'] == impCuenta['ctacliente'][k]['idcuenta'] && previewHTML[i][13]['idcliente'] == impCuenta['ctacliente'][k]['idcliente']) {
                                importectacliente = impCuenta['ctacliente'][k]['importecli']
                                if (importectacliente < 0) {
                                    cuentacliente = Math.abs(Math.round(importectacliente * 100) / 100);
                                }
                                else {
                                    cuentacliente = importectacliente;
                                }
                            }
                        }
                    }
                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporteCtaCliente + ": </b>" + cuentacliente + monedaBsf + final_fila;

                    if (previewHTML[i][5]['excepcional'] == true)
                        infoHTML += inicio_fila + "- " + scope.etiquetas.lbExcepcional + final_fila;
                    else if (previewHTML[i][5]['excepcional'] == false)
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbNumContrato + ": </b>" + previewHTML[i][3]['numerocontrato'] + final_fila;

                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbFechaEmision + ": </b>" + previewHTML[i][6]['fechaemision'] + final_fila;

                    if (previewHTML[i][7]['fechaentrega'] != (null && ''))
                        infoHTML += inicio_fila + nombreFecha + previewHTML[i][7]['fechaentrega'] + final_fila;

                    if (previewHTML[i][8]['fecharecepcion'] != (null && ''))
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbFechaRecepcion + ": </b>" + previewHTML[i][8]['fecharecepcion'] + final_fila;

                    if (previewHTML[i][14]['numcomprobante'])
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbNoComprobante + ": </b>" + previewHTML[i][14]['numcomprobante'] + final_fila;

                    if (previewHTML[i][15]['comentario'])
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbDetalle + ": </b>" + previewHTML[i][15]['comentario'] + final_fila;

                    //para separar la informacion de las operaciones
                    infoHTML += '<div  style="font-size: 3pt"><p>' + "&nbsp;" + final_fila;

                    if (impCuenta['operaciones'] != '') {
                        for (var p = 0; p < impCuenta['operaciones'].length; p++) {
                            if (impCuenta['operaciones'][p]['descripcion'] != null) {
                                if (previewHTML[i][17]['idderechouobligacion'] == impCuenta['operaciones'][p]['idderechouobligacion'] && contoperac == 0) {
                                    contoperac++;
                                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbOperaciones + ": </b>" + final_fila;
                                }

                                if (previewHTML[i][17]['idderechouobligacion'] != impCuenta['operaciones'][p]['idderechouobligacion'])
                                    contoperac = 0;

                                if (previewHTML[i][17]['idderechouobligacion'] == impCuenta['operaciones'][p]['idderechouobligacion']) {
                                    infoHTML += inicio_fila + espacios + '- ' + impCuenta['operaciones'][p]['descripcion'] + final_fila;
                                    if (impCuenta['anexos'] != '') {
                                        for (var w = 0; w < impCuenta['anexos'].length; w++) {
                                            if (impCuenta['operaciones'][p]['idoperacion'] == impCuenta['anexos'][w]['idoperacion']) {
                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbGrupoPresup + ": </b>" + impCuenta['anexos'][w]['grupo'] + final_fila;
                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbObjGasto + ": </b>" + impCuenta['anexos'][w]['objeto'] + final_fila;
                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(parseFloat(impCuenta['anexos'][w]['importemb'])) + monedaBsf + final_fila;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    infoHTML += "&nbsp;"; //para separar la informacion de un documento del otro que se encuentra a continuacion.
                }
            }

            //IMPORTES SEGUN CUENTA Y SEGUN CONTABILIDAD
            var cuenta = '0.00';
            var importecta = '0.00';
            if (impCuenta['cuenta'].length > 0) {
                for (var i = 0; i < impCuenta['cuenta'].length; i++) {
                    infoImporte += '<div style="padding:11px;background:#E7F1FE;font-size: 10pt";><p><b>'
                            + 'Cuenta: </b>' + impCuenta['cuenta'][i]['text'] + "&nbsp;&nbsp;&nbsp;&nbsp;" + '</p></div>';
                    //importe segun la cuenta
                    for (var j = 0; j < impCuenta['cuenta'].length; j++) {
                        if (impCuenta['cuenta'][i]['idcuenta'] == impCuenta['cuenta'][j]['idcuenta']) {
                            importecta = impCuenta['cuenta'][j]['importe'];
                            if (importecta < 0)
                                cuenta = Math.abs(Math.round(importecta * 100) / 100);
                            else
                                cuenta = importecta;
                        }
                    }
                    infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalCuenta + ": </b>" + cuenta + monedaBsf + final_fila;

                    //importe segun contabilidad	
                    var contabilidad = '0.00';
                    var finalcont = '0.00';
                    var diferenciatotal = '0.00';

                    if (impCuenta['ctacont'] == '') {
                        diferenciatotal = cuenta;
                        infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalContabilidad + ": </b>" + '0.00' + monedaBsf + final_fila;
                    }
                    else
                    {
                        if (impCuenta['ctacont'].length > 0)
                        {
                            for (var m = 0; m < impCuenta['ctacont'].length; m++)
                            {
                                if (impCuenta['cuenta'][i]['idcuenta'] == impCuenta['ctacont'][m]['idcuenta'])
                                    contabilidad = impCuenta['ctacont'][m]['saldo'];

                                if (contabilidad < 0)
                                    finalcont = '(' + Math.abs(Math.round(contabilidad * 100) / 100) + ')';
                                else
                                    finalcont = contabilidad;
                            }
                        }
                        infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalContabilidad + ": </b>" + finalcont + monedaBsf + final_fila;
                    }
                    // la diferencia entre el importe de la cuenta con la de contabilidad
                    if (impCuenta['diferencia'] != 0) {
                        for (var n = 0; n < impCuenta['diferencia'].length; n++) {
                            if (finalcont == '0.00')
                                diferenciatotal = impCuenta['cuenta'][i]['importe'];
                            else if (impCuenta['diferencia'][n]['idcuenta'] == impCuenta['cuenta'][i]['idcuenta'])
                                diferenciatotal = impCuenta['diferencia'][n]['diferencia'];
                        }
                    }
                    infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbDifSaldos + ": </b>" + diferenciatotal + monedaBsf + final_fila;
                    infoImporte += inicio_fila + espacios + espacios + final_fila;
                }
            }

            this.wVerMg = new Ext.UIVerMg(this, infoImporte, infoHTML);
            this.initializeEvents(this);
            scope.fShowWindow();
        };
    }
});

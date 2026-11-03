Ext.namespace('Ext.ClassVerDuo');

Ext.ClassVerDuo = Ext.extend(Ext.Component, {
    infoHTML: undefined,
    infoImporte: undefined,
    etiquetas: undefined,
    arrayDuo: undefined,
    tipoDuo: undefined,
    confEspecialidad: undefined,
    url: undefined, //'/finanzas/cobros_pagos/derechouobligacion/index.php/GestionarDuo/',

    //constructor: function(tipoDuo, etiquetas, arrayDuo, url, confEspecialidad)
    constructor: function(etiquetas, params)
    {
        this.etiquetas = etiquetas;
        Ext.apply(this, params);
        this.confEspecialidad = params.confEspecialidad;
        this.arrayDuo = params.arrayDuo;
        this.tipoDuo = params.tipoDuo;
        this.url = params.url;
        this.initializeFunctions(this);
        this.fLoadDataGrid(this);
        //this.initWindow(this);
        return Ext.ClassVerDuo.superclass.constructor.call(this);
    },
    initializeEvents: function(scope)
    {
        this.addEvents('closeVer');

        this.btnVerCerrar.on('click', function(component)
        {
            scope.wVerDuo.close();
            scope.fireEvent('closeVer', true);
        });

        scope.wVerDuo.on('close', function() {
            scope.wVerDuo.close();
            scope.fireEvent('closeVer', true);
        });
    },
    fLoadDataGrid: function(scope)
    {
        var arrayDuo = scope.arrayDuo;
        var preview = new Array();
        if (arrayDuo.length > 0)
        {
            for (var i = 0; i < arrayDuo.length; i++)
            {
                preview.push([
                    {
                        'nombrecliente': arrayDuo[i].nombrecliente
                    }, // 0
                    {
                        'denominacion': arrayDuo[i].denominacion
                    }, // 1
                    {
                        'numero': arrayDuo[i].numero
                    }, // 2
                    {
                        'numerocontrato': arrayDuo[i].numerocontrato
                    }, // 3
                    {
                        'text': arrayDuo[i].text
                    }, // 4
                    {
                        'excepcional': arrayDuo[i].excepcional
                    }, // 5
                    {
                        'fechaemision': arrayDuo[i].fechaemision
                    }, // 6
                    {
                        'fechaentrega': arrayDuo[i].fechaentrega
                    }, // 7
                    {
                        'fecharecepcion': arrayDuo[i].fecharecepcion
                    }, // 8
                    {
                        'idestadodocumento': arrayDuo[i].idestadodocumento
                    }, // 9
                    {
                        'importemb': arrayDuo[i].importemb
                    }, // 10
                    {
                        'pagadomb': arrayDuo[i].pagadomb
                    }, // 11
                    {
                        'idcuenta': arrayDuo[i].idcuenta
                    }, // 12
                    {
                        'idcliente': arrayDuo[i].idcliente
                    }, // 13
                    {
                        'numcomprobante': arrayDuo[i].numcomprobante
                    }, // 14
                    {
                        'comentario': arrayDuo[i].comentario
                    }, // 15
                    {
                        'especialidad': arrayDuo[i].especialidad
                    }, // 16
                    {
                        'idderechouobligacion': arrayDuo[i].idderechouobligacion
                    }, // 17
                    {
                        'estado': arrayDuo[i].estadodescripcion
                    }, // 18
                    {
                        'liquidadomb': arrayDuo[i].liquidadomb
                    }, // 19
                    {
                        'idsubsistema': arrayDuo[i].idsubsistema
                    }, // 20
                    {
                        'documentoexterno': arrayDuo[i].documentoexterno
                    }// 21
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
            scope.wVerDuo.show(Ext.getBody(), function()
            {
                scope.wVerDuo.doLayout(true);
                if (Ext.MessageBox)
                    Ext.MessageBox.hide();
            });
        };

        this.fHTMlConfigPreView = function(previewHTML)
        {
            var arrIdDuo = new Array();//almacena los id de las cuentas
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
                        if (previewHTML[i][17]['idderechouobligacion'] == arrIdDuo[k])
                        {
                            indDuO = false;
                            break;
                        }
                        else
                            indDuO = true;
                    }
                    if (indDuO == true)
                        arrIdDuo.push(previewHTML[i][17]['idderechouobligacion']);

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
                    tipoduo: scope.tipoDuo,
                    arrayidcuenta: Ext.encode(arrIdcuenta),
                    arrayidcliente: Ext.encode(arrIdcliente),
                    arrayidduo: Ext.encode(arrIdDuo)
                },
                callback: function(options, success, response) {
                    Ext.getBody().unmask();
                    responseData = Ext.decode(response.responseText);
                    scope.fFormatoHtmlVer(previewHTML, responseData);
                }
            });
        };

        this.fFormatoHtmlVer = function(previewHTML, impCuenta)
        {
            var infoHTML = '';
            var infoImporte = '';
            var contoperac = 0;
            var nombreFecha = (scope.tipoDuo == 1) ? "- <b>" + scope.etiquetas.lbFechaEntrega + ": </b>" : "- <b>" + scope.etiquetas.lbFechaRecibo + ": </b>"
            var inicio_fila = '<div  style="font-size: 10pt"><p>&nbsp;&nbsp;';
            var final_fila = '</p></div>';
            var espacios = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            var importe = '';
            var nombreCliente = '';

            if (scope.tipoDuo == 1)
                nombreCliente = "- <b>" + scope.etiquetas.lbCliente + ": </b>";
            else if (scope.tipoDuo == 2)
                nombreCliente = "- <b>" + scope.etiquetas.lbProveedor + ": </b>";
            else
                nombreCliente = "- <b>" + scope.etiquetas.lbParrafoFiscal + ": </b>";

            if (previewHTML.length > 0) {
                for (var i = 0; i < previewHTML.length; i++) {
                    infoHTML += '<div style="padding:11px;background:#E7F1FE;font-size: 10pt"><p><b>'
                            + 'No. documento: </b>' + previewHTML[i][2]['numero'] + "&nbsp;&nbsp;&nbsp;&nbsp;" + '</p></div>';

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
                        importe = Math.abs(Math.round(previewHTML[i][10]['importemb'] * 100) / 100)
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(importe) + final_fila;
                    }
                    else
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(previewHTML[i][10]['importemb']) + final_fila;

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
                    /*aqui*/
                    if(scope.tipoDuo==1){
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporteCtaCliente + ": </b>" + cuentacliente + final_fila;
                    }
                    if(scope.tipoDuo==2){

                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbImporteCtaClienteA + ": </b>" + cuentacliente + final_fila;
                    }


                    var liquidado = '';
                    if (previewHTML[i][19]['liquidadomb'] == 0)
                        liquidado = '0.00';

                    else if (previewHTML[i][19]['liquidadomb'] < previewHTML[i][10]['importemb'])
                        liquidado = scope.etiquetas.lbParcial + ' ' + formatoMonedaABS(previewHTML[i][19]['liquidadomb'])

                    else if (previewHTML[i][19]['liquidadomb'] == previewHTML[i][10]['importemb'])
                        liquidado = scope.etiquetas.lbTotal

                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbLiquidado + ": </b>" + liquidado + final_fila;

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

                    //infoHTML += '<div  style="font-size: 1pt"><p>' + "&nbsp;" + '</p></div>';  //PARA SEPARAR TODAS LAS LINEAS DE INFORMACION CON LETRA DE TAMANNO 1
                    if (previewHTML[i][15]['comentario'])
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbDetalle + ": </b>" + previewHTML[i][15]['comentario'] + final_fila;

                    //para separar la informacion de las operaciones
                    infoHTML += '<div  style="font-size: 3pt"><p>' + "&nbsp;" + final_fila;
                    
                    if (impCuenta['operaciones'][0]['descripcion'] != null)
                        infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbOperaciones + ": </b>" + impCuenta['operaciones'][0]['descripcion'] + final_fila;
//                    if (impCuenta['operaciones'] != '') {
//                        for (var p = 0; p < impCuenta['operaciones'].length; p++) {
//                            if (impCuenta['operaciones'][p]['descripcion'] != null) {
//                                if (previewHTML[i][17]['idderechouobligacion'] == impCuenta['operaciones'][p]['idderechouobligacion'] && contoperac == 0) {
//                                    contoperac++;
//                                    infoHTML += inicio_fila + "- <b>" + scope.etiquetas.lbOperaciones + ": </b>" + final_fila;
//                                }
//
//                                if (previewHTML[i][17]['idderechouobligacion'] != impCuenta['operaciones'][p]['idderechouobligacion'])
//                                    contoperac = 0;
//
//                                if (previewHTML[i][17]['idderechouobligacion'] == impCuenta['operaciones'][p]['idderechouobligacion']) {
//                                    infoHTML += inicio_fila + espacios + impCuenta['operaciones'][p]['descripcion'] + final_fila;
//                                    if (impCuenta['anexos'] != '') {
//                                        for (var w = 0; w < impCuenta['anexos'].length; w++) {
//                                            if (impCuenta['operaciones'][p]['idoperacion'] == impCuenta['anexos'][w]['idoperacion']) {
//                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbGrupoPresup + ": </b>" + impCuenta['anexos'][w]['grupo'] + final_fila;
//                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbObjGasto + ": </b>" + impCuenta['anexos'][w]['objeto'] + final_fila;
//                                                infoHTML += inicio_fila + espacios + espacios + "&nbsp;&nbsp;- <b>" + scope.etiquetas.lbImporte + ": </b>" + formatoMonedaABS(parseFloat(impCuenta['anexos'][w]['importemb'])) + final_fila;
//                                            }
//                                        }
//                                    }
//                                }
//                            }
//                        }
//                    }
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
                    infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalCuenta + ": </b>" + cuenta + final_fila;

                    //importe segun contabilidad	
                    var contabilidad = '0.00';
                    var finalcont = '0.00';
                    var diferenciatotal = '0.00';
                    
                    if (impCuenta['ctacont'] == '') {
                        diferenciatotal = cuenta;
                        infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalContabilidad + ": </b>" + '0.00' + final_fila;
                    } else
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
                        infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbImpTotalContabilidad + ": </b>" + finalcont + final_fila;
                    }
                    // la diferencia entre el importe de la cuenta con la de contabilidad
//                    var diferencia = 0

                    if (impCuenta['diferencia'] != 0) {
                        for (var n = 0; n < impCuenta['diferencia'].length; n++) {
                            if (finalcont == '0.00')
                                diferenciatotal = impCuenta['cuenta'][i]['importe'];
                            else if (impCuenta['diferencia'][n]['idcuenta'] == impCuenta['cuenta'][i]['idcuenta'])
                                diferenciatotal = impCuenta['diferencia'][n]['diferencia'];
                        }
                    }
                    infoImporte += inicio_fila + "- <b>" + scope.etiquetas.lbDifSaldos + ": </b>" + diferenciatotal + final_fila;
                    infoImporte += inicio_fila + espacios + espacios + final_fila;
                }
            }

            this.wVerDuo = new Ext.UIVerDuo(this, infoImporte, infoHTML);
            this.initializeEvents(this);
            scope.fShowWindow();
        };
    }
});

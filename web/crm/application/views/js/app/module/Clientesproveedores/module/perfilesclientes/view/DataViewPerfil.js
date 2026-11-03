var fileref = document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", "../../views/js/app/module/Clientesproveedores/module/perfilesclientes/css/data-view.css");
document.getElementsByTagName("head")[0].appendChild(fileref);

Ext.define('PerfilesClientes.view.DataViewPerfil', {
    extend: 'Ext.view.View',
    store: this.store,
    multiSelect: true,
    alias: 'widget.DataViewPerfil',
    height: 310,
    trackOver: true,
    overItemCls: 'x-item-over',
    itemSelector: 'div.thumb-wrap',
    //emptyText: 'No images to display',
    initComponent: function () {
        var me = this;
        me.etiquetas = LangMgr.getLang(me);
        me.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name:stripTags}">',
            '<div class="container"> ' +
            '<div class="sidebar1" id="list8">' +
            '<img src="{[this.image(values.foto, values.idclasificacion, values.idtipo)]}" title="{nombre:htmlEncode}" alt="' + me.etiquetas.lbNoExisteImagen + '" name="{nombre}" width="130" height="150" id="{nombre}" style="background-color: #C6D580; display:block;"/>' +
            '<span class="abreviatura" style="text-align: center; margin: 5px;">{abreviatura}</span>' +
            '<ul class="nav">' +
            '<li><a href="#Datos_generales{idclientesproveedores}">' + me.etiquetas.lbDatosGenerales + '</a></li>' +
            '{[this.contactoHref(values.idclasificacion)]}' +
            '<li><a href="#Contabilidad{idclientesproveedores}">' + me.etiquetas.lbContabilidad + '</a></li>' +
            '<li><a href="#Cobros_pagos{idclientesproveedores}">' + me.etiquetas.lbCobrosPagos + '</a></li>' +
            '<li><a href="#Cuestionario{idclientesproveedores}">' + me.etiquetas.lbCuestionarioPlantilla + '</a></li>' +
            '</ul>' +
            '</div>' +
            '<article class="content scrollable">' +
            '<span class="abreviatura">{[this.porDefinir(values.nombre)]}</span>' +
            '<section>' +
            '<a name="Datos_generales{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbDatosGenerales + me.etiquetas.lbPersonaCls + '{[this.clasificacion(values.idclasificacion)]}</a>' +
            '<table class="mytable">' +
            '<tr><td class="td1">' + me.etiquetas.lbDescripcion + '</td><td class="td2 mgn">{[this.porDefinir(values.descripcion)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbCodigo + '</td><td class="td2 mgn">{[this.porDefinir(values.codigo)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbCorreo + '</td><td class="td2 mgn">{[this.valueRaw(values.correo)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbTelefono + '</td><td class="td2 mgn">{[this.porDefinir(values.telefono)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbDireccion + '</td><td class="td2 mgn">{[this.porDefinir(values.direccion)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbUsuario + '</td><td class="td2 mgn">{[this.porDefinir(values.nombreusuario)]}</td></tr>' +
            '<tr><td class="td1">' + me.etiquetas.lbClasificacion + '</td><td class="td2 mgn">{[this.porDefinir(values.tipocliente)]}</td></tr>' +
            '</table>' +
            '</section>' +
            '{[this.contactoSection(values.idclasificacion, values.contacto)]}' +
            '<section>' +
            '<a name="Contabilidad{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbContabilidad + '</a>' +
            '{[this.cuentaBancaria(values.cuentabancaria)]}' +
            '</section>' +
            '<section>' +
            '<a name="Cobros_pagos{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbCobrosPagos + '</a>' +
            '{[this.cobrosPagos(values.cobrospagos)]}' +
            '</section>' +
            '<section>' +
            '<a name="Cuestionario{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbCuestionarioPlantilla + '</a>' +
            '{[this.cuestionario(values.cuestionario)]}' +
            '</section>' +
            '</article>' +
            '</div>',
            '</div>',
            '</tpl>',
            '<div class="x-clear"></div>',
            {
                disableFormats: true,
                image: function (image, idclasificacion, idtipo) {
                    if (image) {
                        return image;
                    } else if (idclasificacion == 2 && idtipo == 3) {
                        return "../../../../configuracion/comun/views/images/persona_cliente-proveedor.png";
                    } else if (idclasificacion == 2 && idtipo == 1) {
                        return "../../../../configuracion/comun/views/images/persona_cliente.png";
                    } else if (idclasificacion == 1 && idtipo == 3) {
                        return "../../../../configuracion/comun/views/images/entidad_cliente-proveedor.png";
                    } else if (idclasificacion == 1 && idtipo == 1) {
                        return "../../../../configuracion/comun/views/images/entidad_cliente.png";
                    }
                },
                contactoHref: function (idclasificacion) {
                    if (idclasificacion == 1) {
                        return '<li><a href="#contacto{idclientesproveedores}">' + me.etiquetas.lbContacto + '</a></li>';
                    }
                },
                contactoSection: function (idclasificacion, contacto) {
                    if (idclasificacion == 1) {
                        var contactoHtml = '<section>' + '<a name="contacto{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbContacto + '</a>';
                        if (contacto.length > 0) {
                            for (var i in contacto) {
                                contactoHtml += '<table style="border: 1px solid #fafafa; margin-left: auto; margin-right: auto;">' + '<tr><td>' + '<img src="' + contacto[i].foto + '"' + ' title="' + contacto[i].nombre +
                                    '" alt="' + me.etiquetas.lbNoExisteImagen + '" name="' + contacto[i].nombre + '" width="130" height="150" id="' + contacto[i].nombre +
                                    '" style="background-color: #C6D580; display:block;"/>' +
                                    '</td><td><table class="mytable" style="border: none"><tr><td class="td1">' + me.etiquetas.lbNombre + '</td><td class="td1">' + this.porDefinir(contacto[i].nombre) + '</td></tr>' +
                                    '<tr><td class="td1">' + me.etiquetas.lbCargo + '</td><td class="td1">' + this.porDefinir(contacto[i].cargo) + '</td></tr>' +
                                    '<tr><td class="td1">' + me.etiquetas.lbMovil + '</td><td class="td1">' + this.porDefinir(contacto[i].movil) + '</td></tr>' +
                                    '<tr><td class="td1">' + me.etiquetas.lbTelefono + '</td><td class="td1">' + this.porDefinir(contacto[i].telefono) + '</td></tr>' +
                                    '<tr><td class="td1">' + me.etiquetas.lbCorreo + '</td><td class="td1">' + this.valueRaw(contacto[i].correocontacto) + '</td></tr>' +
                                    '</table></td></tr></table>';
                            }
                            contactoHtml += '</section>';
                        } else {
                            contactoHtml += '<span style="text-align: center;"><b style="color:#d9534f;">' + me.etiquetas.lbPorDefinir + '</b></spam></section>';
                        }
                        return contactoHtml;
                        /*return '<section>' +
                         '<a name="contacto{idclientesproveedores}" class="jumpsection">' + me.etiquetas.lbContacto + '</a>' +
                         '<span><b style="color:#d9534f">Dicen que Alberto tiene la culpa, preguntale como se hace</b></span>' +
                         '</section>';*/
                    }
                },
                clasificacion: function (idclasificacion) {
                    if (idclasificacion == 1) {
                        return me.etiquetas.lbPersonaJuridica;
                    }
                },
                valueRaw: function (correo) {
                    return correo ? '<a href="mailto:' + correo + '">' + correo + '</a>' : '<span><b style="color:#d9534f">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                },
                porDefinir: function (value) {
                    return value ? value : '<span><b style="color:#d9534f">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                },
                cuentaBancaria: function (cuentaBancaria) {
                    var table = '';
                    if (cuentaBancaria && cuentaBancaria.length > 0) {
                        table += '<table class="mytable">' +
                            '<tr><th class="th1">' + me.etiquetas.lbNumeroCuenta + '</th><th class="th2">' + me.etiquetas.lbNombreCuenta + '</th><th class="th3">' + me.etiquetas.lbNombreBanco + '</th><th class="th3">' + me.etiquetas.lbNumeroSucursal + '</th><th class="th3">' + me.etiquetas.lbCodigoISO + '</th><th class="th3">' + me.etiquetas.lbPredeterminada + '</th></tr>';
                        for (var i in cuentaBancaria) {
                            table += '<tr><td class="td1">' + cuentaBancaria[i].numerocuenta + '</td><td class="td1">' + cuentaBancaria[i].nombrecuenta + '</td><td class="td1">' + cuentaBancaria[i].nombrebanco + '</td><td class="td1">' + cuentaBancaria[i].numerosucursal + '</td><td class="td1">' + cuentaBancaria[i].codigoiso + '</td><td class="td2 ' + (cuentaBancaria[i].predeterminado ? "icondistra-true verde" : "icondistra-false rojo") + '"></td></tr>';
                        }
                        table += '</table>';
                    } else {
                        table += '<span style="text-align: center;"><b style="color:#d9534f;">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                    }
                    return table;
                },
                cobrosPagos: function (cobrospagos) {
                    var table = '';
                    if (cobrospagos && cobrospagos.length > 0) {
                        table += '<table class="mytable">' +
                            '<tr><th class="th1">' + me.etiquetas.lbCodigoISO + '</th><th class="th2">' + me.etiquetas.lbCuenta + '</th><th class="th3">' + me.etiquetas.lbClasificacion + '</th></tr>';
                        for (var i in cobrospagos) {
                            table += '<tr><td class="td1">' + cobrospagos[i].codigoiso + '</td><td class="td2">' + cobrospagos[i].nombrecuenta + '</td><td class="td3">' + cobrospagos[i].nombclasificacion + '</td></tr>';
                        }
                        table += '</table>';
                    } else {
                        table += '<span style="text-align: center;"><b style="color:#d9534f;">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                    }
                    return table;
                },
                cuestionario: function (cuestionario) {
                    var table = '';
                    if (cuestionario && cuestionario.length > 0) {
                        for (var j in cuestionario) {
                            table += '<span style="text-align: center"><b style="align-self: right; font: 85%/1.4 Verdana, Arial, Helvetica, sans-serif; border-bottom: 1px black solid">' + cuestionario[j].nombre + '</b></spam>' +
                                '<table class="mytable">' +
                                '<tr><th class="th1">' + me.etiquetas.lbPregunta + '</th><th class="th2">' + me.etiquetas.lbRespuestas + '</th></tr>';
                            var preguntarespuesta = cuestionario[j].preguntarespuesta;
                            for (var i in preguntarespuesta) {
                                if (preguntarespuesta[i].idcuestionario == cuestionario[j].idcuestionario) {
                                    table += '<tr><td class="td1">' + preguntarespuesta[i].pregunta + '</td><td class="td2">' + preguntarespuesta[i].respuesta + '</td></tr>';
                                }
                            }
                            table += '</table>';
                        }
                    } else {
                        table += '<span><b style="color:#d9534f;">' + me.etiquetas.lbPorDefinir + '</b></spam>';
                    }
                    return table;
                }
            }
        );
        me.callParent();
    }
});
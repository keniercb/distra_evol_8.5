Utilidades.Cmp.Cmpgestionarfip = function (opcionesConfig) {
    var _this = this;
    Ext.Ajax.timeout = 1000000000;
    this.prevrow = -1;
    this.idtipodocumento = 2;
    this.eshija = 0;
    this.busqueda = 0;
    this.rowIndex;
    this.ultimoElemenSelec;
    this.fotoDefault_GA = ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAK0AAACmCAYAAACoaA+AAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAABNySURBVHhe7Z0LkFTVmce/nunp6Z7pYWYAmQHDAIK8IgFNRCIhuCKRRMSwS6JitFhJUqvLxhRbSyXZJVUat0xVNrrJGqMxD6OirFkfCEmUqMHwUIhGEWR4DTOMIgPOo+fZPT2v7f+de6EZpm+f033P7Xu7v19V19zukrGn+3e/+93vnPMdz0AMYhgXkaf/ZBjXoDzSRqJR6uyKkJMCusfjoeIiv/7MOfh9Pv2IMUOJtI0trdQeaqau7h7q7u7WX3UOhYWFVFlZ6ZgTCSeRQcCXR3leHwtsgmXSIqI2NjbR6Y8b9VeciyGtU8FXYoiMKwILfC6WSPvhRyddIauB06U1iJd3VNkI7SdjwY3Y+wcPu0pYN2EIC3mbQm3a1YxJQ1p8gBDWiTlrtmHIixtaFjdFafHBHag+xMJmABY3RWlrjtXpR0wmyHVxpaWtra3lCOsAIG6uIiUtzu6Wtg79GZNJcHOWq9FWSlpOC5wDbs5yNU0QlhYlF04LnIUFJXZXIixtW0uTfsQ4BSPa5hrC0nIu61xyLUUQkhapAeNMkCLkWrQVkjZXcyc3YIyW5RJC0mKaIcM4BSFpMS+WYZyC8I0YwzgFlpZxHSwt4zpYWsZ1sLSM62BpGdfB0jKug6VlXAdLy7gOlpZxHSwt4zpYWsZ1sLSM62BpGdch1IAu29ofyTSgQ+tNqwhH+/Uj68mlBnUsbQIg63sfRemtui463Wn+EQVKAlToL9WfnU80EqHKYqL5k4vowqKwEnlZ2iHkorRrXmihjUfaqVygNeyIEaOoraBEf5aYlj6i+2YN0LfmeSwXN5ek5Zx2CIiwEPbl4+00PuChYH7yByjLT/6YFDsBvrvPQz99c8DStCPX4E9uCG/U9moR1pDRagxxT3QF9FcYWVjaOBD9XtwXEkoJ0qE8FnV31nRxtE0R/tSG0NcbSzxtoKFTP2CkYWkZ18HSMq6DpWVcB0vLuA6WlnEdLC3jOlhaxnWwtIzrYGkZ18HSMq6DpWVcB0vLuA6WlnEdLC3jOlhaxnWwtIzrYGkZ18HSMq6DpWVcB0vLuI6MS9vbT9Qc9ljywO9isp+MdZiBYJvrfPRek5hppZUX6UfmzChqp0XlJ8lrcjom6jCDJd3rnjtFT9WEpfoe5BWPpDx/8g4zBqE+onUzre00wx1mFANh73/XqwkbyI/JIvAozOsXelR3ldCjJ6dw1M1iMiItImw4Fm0go9VA3O7+PHq1Zaz+CpNtZETaI6HBCKsKI+JmO8jsBLK7rMN2aXHZRpS1g/a+Av0oe4iXNFgcoNHlpTmVz4KMRFomdSAqJMXD71PcdMyhsLQOJf7SX1zkz3lR42FpHUr8pZ9FPReW1iHE56osqjksrQOAsB6P50wKwJjD0joA4+aKEYOlzRDRvgHK8/o4FUgBltZmMO8Am4Z8eVaxrbK2dg9QQ3uf9tPt2D5hBoML//m2V3pErKRion4kBoZyV4+rpZL8Hv2Vs2RqwkxtlOjGcXn0yLIAlRZauxFJJBqlw835VN8Ypj01LdQa7qPXG/qovjWsbQVlUD7m7Oeo7bhT4qGLRubRjDIvzRrjoYqgh6aO7HN09Gdp41ApLYT98eWFtPZK60bpjjT20a4jIXrpUIe2hZQhJzYiAcP9Dd5RE/SjsyD6G+B34N9/oSKPllT1aRv2XTxa8stSDKcHNgAptt/gt0RYXOIffOVDmvPfNTT1gWpa9ceTmrAQdLxv8IFjmZNu6F5n+Ln1VD+t/Wss6m4I0xW/6aT7d/VoJ4kTYGkVYkSw3TcF6HMTvYNPUuS92KX+5seO09gfVdO//CWkXfaxOZ8hqdXES/xxZIDu/Vu3JvBNv+uiHXW9+n+VGVhaheBL3/W1QFqXVwjydz85SLP/p3pwF8m4aGonhsB7GvtpwaaIFn3/dDQz8rK0CjAi7Du3F1NlSWrC4lK87Ff1tODRg7Q31Htmy1MnAHmPdA7QF34foUVPdmpXATthaS3GKGlB2FQrBN/f9IGWr+74sM1RssZjRN53QgM0+3/DdNuWbtvKaSytApASpCIsIlbVve/Tg++2OlbWoRjybqnroUmP2pMysLQWgii7bUUgpZTgvtcatby1o2/AFbIOBfLigZThG38I66+qgaW1CNRhH7+K6FOV8sKiKvC9bQ2uia5mIOo+e6xPy3VRnlMBS2sRd8/sp6WXBPVnYuBLRb3VqApkC1pOH8t1r3wyTIcbrV8WzdKmCS7nky8YQd9fLDdLC8LOvL9aq7e6PboOB8QF0zZYX9dladMEw54PL/Hrz8QwhAUqhcUJ9UH03AfSGOOBHNwoz6kC6QLqulaKy9KmAST4zXUTpAYP7BDWkPXaCSX00Hw/bfpSEb11c5D2r/RR6J+K6eTtAdp7Y4Ae/JyPlk4s0MSFxKowxLWqnsvSpgjEmD0yQKuuEO+vgDrm3J8c1I5VCIv3hMc988s0QR+4ZoCWTM2nWRUeGukfoKLCAq0Uh+oGbhhXzvHR40sLqXlNkDYvIrrA71EmL8RFPdeK+Qu2SovZVWY9tlSA/2f8A+DLwwrXROCSbwiQ6NES+3Ifv0lu5tmtT36g/VsVwiKyfn2aj96+rZhWTO/V/sZwj3ixHzeRu/+xmDYs9J1JHawG4l77u3DagxDKpyZClJOnTtM7R+v1V4j2Ncp/aQUB+Y4x04vb9KPzKQkOf6e/q66TYvdGSfnU7MvoB8un6c+Sc9fGOvrpgQ5lVYIHrwnQ3E/kJRV10qRJ+lFikMLc8H8RbajWuKGyCpwMl5Z56NWvFeuvyKNc2ude30NH6+opEMyuNkX/tfabwuu6tuzvoOufrtPqsFZiRO3n/6GYLox9vCKRVURaA9RaUbqyWlxE8nTmFiu9WEPYE40tWSfs1QsWCguLqHX9M9YLawBhka/KpAKiIBoiKlqdKiBN+Ne/dqd8Y6ZM2uZQqxZhs5Fln/+MfpScbz5z4sxKAiv5IDxAz1/v1YRVyXNfKbI80gJ8Jt/4Y0R/JocyaZHDZluEBYiyopNhkBZsPtZm+Y0Xbrr+4zMFNG2MXH04FfC3Pv5Fv+VVBZwIe9oGtBURsijJaXHz9fTW7VkXaft6e+jhe74jnBqMvHu/slrsnlXFKaUEMjltPJh6iJlcKvJb1I1lJhkpi7SlxQFq6+jQvuhseUybMllYWKzjil8FaxWIsj9c4JcWNlAwePKkWm5aP8+r5O9BmrDudbnRMiXSIipfOqVKf5YddEa6afniRfozcyAG1nGpKG/hd362Svxrg6xv1PfTzc9GaOGGLm3Oq7FQUUZgjPph+bvVN2WI3E/U9EhNrFEWacdWjKFlixZqX3Y2MCIYpE/PEBtMeGhnk35kLShx3TSl4EzUFAGy3vJqWFuyAyAJFiri7v3SX3dKybL6Up+yaHvvm+K5rdI6LXLb7XsP0rbdb2upglvpDEfoxqVfpDtvXKq/Yg5WH6gAqQHmEWBYVoTbX+zWZI3Pq4f2PZDJKRGZyx7u1EpWViPzPmxr1oESmJPAlUCGyRdNFOq6og0koC6rIDVApMUwbTIQiX8Wi6T3vtNz3vsYKi0u92jMsfErRfor5mDAobY9tbzYDLyPb0/rF5riaZu0TgJXgOE6zJghegOGFbRYkKiiajAy6KeXVuQL3YQhfx2O4TrMIModuqWIpo5Oni1iKQ1WJqio3YJjdySfSK8sp80WcE6bTa6JBzOYNh9XIyyiLPptiVDf0q0NPoiCnHJXTaf+zBzR95AKOHlEFkaytElAs2NRdtYMH92sYpRXrDR04GMvlUvmnTubxGSsLBpQcjMGcPI8cTD5L2dpBRDtIPjbN9UM2cpgVBZUiaUSpBwYwEgGS2sRmBizrencO3Urwe/d0ag/SUJtS7/0yTN/lFgUb+jyKD0xcbIlm0jD0pogk8++dVztWn+wtzlMez7sN63TNnVE6ZeHolInD0S5bIJY9aCjU+3fiRPilWPmtWOW1iL2nx5QnhqgfLXmlTCdaD+bBhgYz9e8LLdkG6Wmq0d5hPs1vH5K8R8ZY88J8xSBpU2CaD778r4T+pF6Fj/TQc+/30td3YNfLn4iAi/f1H/eYEIyEGV/viSgPzMH3cZVTAqPB78bnRnNYGlNEK0c4MusieW0qvLZoeD/8+9vRuiSJ6JaPfaSp6J0wx+6qLkjIvUeUGJCs2eR+ix466M8W27w8L5wj5AIltYCQt352hCrnUBOYzUE0gaZEThj0svhW+SaPf9if59t1ZGjTYk/T5bWAupOOWuI2gwIe3GxR2tFKtuvAbOxVKYGBjgx6kOJUwSWNgEylYPGiIIZJArAqBqk27qySLoV6frtUduiLEBpLREsbY6RSu9cTF/85RF18w2Gw6y0xtJaQF1DSD9yLsi5H7u2KKXeubduDiuZjmjG0e7BxirDwdJaQHue39ZLpyxIC/5tpk9r5iEL1oahaYedIKJHw1w9kEZmoky4Xf1oWDqg0nDHFXJtkgCmIapYzJgMo7qRCJY2AQLTjF2BsRDSbOh3OLBfmMp5s+nA0lpAoCTg2FlVqN9ePVls4jjAkhosfMSOjZkU1meyDy1LawHjFLU8Shfkst+9PPENzVAgLBY7qmg8J0thHtdplTKqRFwMO0E70rlVXuEo+/exlAD5pBNSArMVEixtAnAj1tkl1msq4JFrNmEXV43xat0URXhsdzu91pT5CGuAFRKJYGkt4JNVzutZhtTg8gqxrxdpAXYct7sWmwjcH1wQTPzehf4qdJVmEhPwOfPcnzNW7Abs99U9jrqRRM17Ylmaw7gFheq787kZDIti/wVEN6cACYOCw7UvHul11OAI3vuYkjQjbaAo9VbjbkamVrswhZ0alRL74i8sFbsC1HY4J5cFc0d4TOdHCP1VorOdshFM8Bbhsgkljq3VJgO9vZwCqhfXfcL8gxSSFktOjJ1hmOG58uIy/YhJB5z4n51kvshS7PoRo6KiQj/KHWTKXphQLbN6gEnM3PHmuYqwtKPLS/UjJhGrZo1wzs1Y7Hs/0Zp8ZS5WJGBNlhNAaoCVwcnm+wpLC6qqsqtRsiiiee2KK8Y5Jq9FNeDpg/lJJ8o8tU++sYdKVl+SvLwqJS2iba7ltqggiKYI6B3glBQB0xE3HmvXlponEhedXNBc2SmVA5zwmNyTDClpAfq05hIy82rBunmltq/MTQROoDt3Rui+HUTNEc8ZeTEChmFb7FXrlFEwpAZoj29ZU+WhNIXaqKb2uO373FpFKv1pUfYTadyBHHHsD6uVbXaXCsizEcUwAFJYWqlthYSUwEm1WaMHg8iS9pS0Q4PhyZPOb86brcic14gU35oVdNTomNYjIRZ10cwDNVlEVycJa9yAifZgSDlWQtwJE3JDXJnSF1hzzXhtWqCTwEmEtAURDZI4CVwFvjNP/F4prQs8xJ05Y1pO3Jwh2opWEVCz/ecZzpiLYMi6cnKAHprvp82LBvc2gLhOkBfvAcO2i6eId7pJKacdDuS5DQ0NrtibIZWc1kB07wUn5LYQtqo0QL+6Nv/MLuXGjo14f99+qTvjy2pkclkDy26l8GV+cvpULWVwS+TF+SrzAKLRFrnt+rmZryRsWNI37C7leH/Y0Qa7jGcKRFlUDGSEBZZF2uHAF4xOIZGw2r0IZPEHiihYLNbecjhE238ClfvjmoEoe8/8MloxvfccYYfujbujrpcWbIpkpPSFKCu7Ly5QKi2jS/HoQdvTBET4bV/2UlX5uVe9odIisIz7RdT2FAHCbljoo5Vz5M8Wl1Za3QMufRlJE2KX3mAg+ZRSXDXsFtZIC1IRFrC0NnDPDePtX9kQE1FkwgxGxxD17AQnySPLUk/PWFqbeGn1RFsn02DEa+vRgaQTZrA+zE5wgrywXL5zYzwsrU3gZmPvnTNsSxNw8/ezw+a74aDstWZH1LabMCOPFd2UJBEsrY3gy9r81YlSW4CmA4ZusRcDZnqBeHmfejdKY38dti2fhbA/vrww5Tw2Hq4eZIDfvtFEq7actK2igOgOgeeMLaGiEaO13WMgkZ0R9u6ZYjuMi8DSZgi7xTXoKJtga7XAamEBS5tBtuzvoOufrrNV3OG2zleFkRKsvdLaZi8sbYbB6oGrHqnWju0YObNLWgi79Tq/1EQYUfhGLMPg5uzA2hk0u8yb8XkKVmDMHDt0S5ESYQFL6wBQDvvzXdNp/adLtcqCE6Y0pgKi69KJBXRgtU94F8hU4PTAYSBduG1jnbbjuIpFkirSA0RXbZRrsZp0YCgsrUO577VG+t6rDVTuszbXtVJayIpRPlQH7vp8SVqjXDKwtA4GI1YPvfYR/WBPq2XyWiGtIeutkwto/Tyv1HalVsDSuoAz8r49uAcv5hWkKnA60hqyfv3ifFo312e7rAYsrYvAjKwX/tZMD+wO0d6Pw1r0BTICy0hrVAIgKtZx3RFLA5bPCdqWBiSCpXUpRxr76OV3T9Kz73fQttO92lREo72RmcRm0sZLCrCs+7qLfLR0ar7SaoAsLG0WgPThaNMAbT8WovfqO6k61KtVH4Zl1LkdggzRsZ3+pKCH5l5YQLPGeGhWhUd6GYxdsLRZClKJcLSf6k61Umf32SjZXxjUfga8RCP8HhpTTFRW2Ce17i3TsLSM6+ARMcZ1sLSM62BpGdfB0jIug+j/AUiyJofctDquAAAAAElFTkSuQmCC';
    this.horainicio = '08:00';
		this.formatohora = 'H:i';
		this.tipoformato = 'hmilitar';
		this.hvalorminimo = '00:00';
		this.hvalormaximo = '23:59';

    this.arrayidfipsReorganizar = [];


    Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/getHora',
        				callback: function (options, success, response) {
        						responseData = Ext.decode(response.responseText);
        								_this.horainicio=responseData.hora;
        				}
        		});

    /**Stores de la busqueda rapida**/

    _this.store_operador_searchrapida = new Ext.data.SimpleStore({
        fields: ['id', 'den'],
        data: [
            ['lt', 'Antes'],
            ['gt', 'Después'],
            ['eq', 'En']
        ]
    });

    _this.store_estado_cumplimiento_searchrapida = new Ext.data.SimpleStore({
        fields: ['id', 'den'],
        data: [
            ['Cumplida', 'Cumplida'],
            ['Parcialmente cumplido', 'Parcialmente cumplido'],
            ['Sin cumplir', 'Sin cumplir']
        ]
    });

    //  Store del combo de cargar tipo fip
    _this.store_tipo_fip_searchrapida = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
        reader: new Ext.data.JsonReader({
            id: 'idtipo',
            root: "data"
        }, [{
            name: 'idtipo'
        }, {
            name: 'denominacion'
        }])
    });

    /********************************************************/

    //componente para el manejo de los mensajes de errores de texto regido
    this.ObjValidaciones = new Utilidades.Cmp.Cmpvalidaciones();

    //validacion de fechas
    Ext.apply(Ext.form.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                var start = Ext.getCmp(field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                var end = Ext.getCmp(field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        },
		    rangfechas: function(val, field) {
				    var date = field.parseDate(val);
				    if (!date) {
						    return false;
				    }
				    if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
						    var start = [];
						    for (i = 0; i < field.startDateField.length; i++) {
								    start[i] = Ext.getCmp(field.startDateField[i]);
						    }
						    for (i = 0; i < start.length; i++) {
								    start[i].setMaxValue(date);
								    start[i].validate();
						    }
						    this.dateRangeMax = date;

				    } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
						    var end = [];
						    for (i = 0; i < field.endDateField.length; i++) {
								    end[i] = Ext.getCmp(field.endDateField[i]);
						    }
						    if (end.length != 0) {
								    for (i = 0; i < end.length; i++) {
										    end[i].setMinValue(date);
										    end[i].validate();
								    }
						    }
						    this.dateRangeMin = date;
				    }
				    /*
						 * Always return true since we're only using this vtype to set the
						 * min/max allowed values (these are tested for after the vtype test)
						 */
				    return true;
		    }
    });


    //objeto CRUD-ACTIVIDADES inicializado
    this.objCrudFip = new Utilidades.Cmp.Cmpcrudfip();

    //objeto del componente observaciones inicializado
    this.objCmpObservaciones = new Utilidades.Cmp.Cmpgestionarobservaciones();

    //objeto del componente "clasificador de involucrados"
    this.objclasificadorinvol = new Utilidades.Cmp.Cmpclasificadorinvol();

    //inicializando el objeto menu dinamico
    this.objcmpmenurelacionesdin = new Utilidades.Cmp.CmpMenuRelacionesDinamicas();

    //objeto del componente "barra de progreso"
    this.BarraProgreso = new BarraEstado();

    //objeto de configuraci'on de perfil el que esta en plan
    this.objconfiguracionperfil = new Utilidades.Cmp.Cmpconfigurarperfil({mostrarVentana: false, panel: 'fip'});

    //objeto del componente "exportarimportar"
    this.cmpexpimp = new Utilidades.Cmp.Cmpexportarimportar();

    //objeto del componente "Fechas de control""
    this.objfechascontrol = new Utilidades.Cmp.Cmpfechacontrol();

    //variables
    var started = 0;
    var ultimapag;
    this.opcionBusqueda = 3;
    this.arrayidfips = [];
    this.arraynombreFip = [];
    this.arrayfipseleccionadas = [];
    this.eshija = 0;
    this.idtipoelementotributa = null;
    this.idtipoelementotributasuperior = 0;
    this.permitirmodificar = 0;
    this.permitireliminar = 0;
    this.permitirduplicar = 0;
    this.start = 0;

    //botones para la gestion de los planes
    this.btnAdicionar = new Ext.Button({
        disabled: false,
        iconCls: 'adicionar',
        handler: function () {
            if (_this.arrayfipseleccionadas.length == 0) {
                _this.eshija = 0
                _this.objCrudFip.CrearWinCrudFips(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                    'Adicionar', _this.PostAccionesGestionar, _this.arrayidfips,
                    null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                    _this.smTGCmpFips, _this.stTGCmpFips);
            } else if (_this.arrayfipseleccionadas.length == 1) {
                _this.eshija = 1;
                _this.objCrudFip.CrearWinCrudFips(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                    'Adicionar', _this.PostAccionesGestionar, _this.arrayidfips,
                    null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                    _this.smTGCmpFips, _this.stTGCmpFips);
            }
        },
        tooltip: 'Adicionar FIP',
        key: {
            alt: true,
            key: 'I'
        },
        scope: this
    });
    this.btnModificar = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudFip.CrearWinCrudFips(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                'Modificar', _this.PostAccionesGestionar, _this.arrayidfips,
                _this.arrayfipseleccionadas[0].idautor, _this.eshija,
                permisomodificar = 1, permisoeliminar = 1, _this.smTGCmpFips);
        },
        hidden: opcionesConfig.noUsarModificar,
        disabled: true,
        iconCls: 'modificar',
        tooltip: 'Modificar FIP',
        key: {
            alt: true,
            key: 'M'
        },
        scope: this
    });
    this.btnEliminar = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudFip.EliminarFips(
                _this.arrayidfips, _this.PostAccionesGestionar,
                _this.smTGCmpFips, _this.TGCmpFips);
        },
        hidden: opcionesConfig.noUsarEliminar,
        disabled: true,
        iconCls: 'eliminar',
        tooltip: 'Eliminar FIP',
        key: {
            key: Ext.EventObject.DELETE
        },
        scope: this
    });
    this.btnVer = new Ext.Button({
        handler: function () {
            _this.eshija = 0;
            _this.objCrudFip.CrearWinCrudFips(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                'Ver datos del', _this.PostAccionesGestionar, _this.arrayidfips,
                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1);
        },
        disabled: true,
        iconCls: 'ver',
        tooltip: 'Ver datos del FIP',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnDuplicar = new Ext.Button({
        disabled: true,
        handler: function () {
            _this.eshija = 0;
            _this.objCrudFip.CrearWinCrudFips(
                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                'Duplicar', _this.PostAccionesGestionar, _this.arrayidfips,
                _this.arrayfipseleccionadas[0].idautor, _this.eshija,
                permisomodificar = 1, permisoeliminar = 1, _this.smTGCmpFips);
        },
        iconCls: 'duplicar',
        tooltip: 'Duplicar FIP',
        key: {
            alt: true,
            key: 'D'
        },
        scope: this
    });
    this.btnGestObs = new Ext.Button({
        handler: function () {
            _this.objCmpObservaciones.CargarCmpObservaciones(_this.arrayidfips[0], 'FIP', _this.PostAccionesGestionar);
        },
        hidden: opcionesConfig.noUsarGestObser,
        disabled: true,
        iconCls: 'vistareporte',
        tooltip: 'Gestionar observaciones al FIP',
        key: {
            ctrl: true,
            alt: true,
            key: 'G'
        }
    });
    this.btnPanelBusqueda = new Ext.Button({
        disabled: false,
        iconCls: 'buscaravanzada',
        id: 'btnPanelBusqueda',
        tooltip: 'B&uacute;squeda avanzada de FIP(s)',
        handler: function () {
            _this.pBuscarFips.toggleCollapse(true);
            _this.tpAutoresInvolucrados.doLayout();
        },
        key: {
            alt: true,
            key: 'B'
        },
        scope: this
    });

    /***********************
     * Nueva accion reogranizar fip, hacer raiz, expandir todos
     * *****************************/

    this.btnReorganizar = new Ext.Button({
        disabled: true,
        //hidden: true,
        iconCls: 'diferenciaconbanco',
        tooltip: 'Reorganizar sub-fip(s)',
        id: 'btnReorganizarFip',
        handler: function () {
            _this.ReorganizarHijos();
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'J'
        },
        scope: this
    });

    this.btnHacerRaiz = new Ext.Button({
        disabled: false,
        //hidden: true,
        iconCls: 'top',
        tooltip: 'Hacer raiz',
        id: 'btnHaceRaizFip',
        handler: function () {
            var start = (_this.ptbTGCmpFips.getPageData().activePage - 1) * (_this.ptbTGCmpFips.cbPageSize.getValue());
            _this.HacerRaizActividades(
                _this.arrayidfips,
                _this.smTGCmpFips, _this.stTGCmpFips, start);
        },
        key: {
            ctrl: true,
            key: 'J'
        },
        scope: this
    });

    this.btnAsociarInvolFip = new Ext.Button({
        iconCls: 'asociar',
        //hidden: true,
        tooltip: 'Asociar involucrado(s) a lo(s) fip(s)',
        id: 'btnAsociarInvolFip',
        disabled: true,
        prevTab: '',
        nextTab: '',
        handler: function () {
            _this.asociarInvolFip();
        },
        key: {
            ctrl: true,
            key: 'K'
        },
        scope: this
    });

    //btnActCumplimiento
    this.btnMaxCumplimiento = new Ext.Button({
        disabled: true,
        //hidden: true,
        iconCls: 'icondistra-bandera sipac-verde',
        tooltip: 'Actualizar fip al 100% de cumplimiento',
        id: 'btnMaxCumplimiento',
        prevTab: 'btnAsociarInvolFip',
        nextTab: 'btnOtroValorCumplimiento',
        handler: function () {
            _this.actualizarCumplimiento(1);
        },
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    });

    this.btnOtroValorCumplimiento = new Ext.Button({
        disabled: true,
        //hidden: true,
        iconCls: 'icondistra-bandera sipac-amarilla',
        tooltip: 'Actualizar % cumplimiento del fip',
        id: 'btnOtroValorCumplimiento',
        prevTab: 'btnMaxCumplimiento',
        nextTab: 'btnExportarActaTrabajo',
        handler: function () {
            _this.actualizarCumplimiento(2);
        }
    });

    this.btnExportarActaTrabajo = new Ext.Button({
        handler: function () {
            _this.generarActaTrabajo();
        },
        disabled: false,
        //hidden: true, //quitar esta condicion y poner la de abajo
        hidden: (opcionesConfig.acuerdos_GA != null)?true:false,
        iconCls: 'clausulacrm',
        tooltip: 'Generar acta',
        id: 'btnExportarActaTrabajo',
        prevTab: 'btnOtroValorCumplimiento',
        nextTab: 'btnPanelBusqueda',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });

    this.btnExportarGrid = new Ext.Button({
        handler: function () {
            if(_this.stTGCmpFips.getCount()>0){
                _this.TGCmpFips.saveAs('data:application/vnd.ms-excel;base64,' +
                    _this.TGCmpFips.Base64(_this.TGCmpFips.getExcelXml(false, "Listado de FIP")), "Listado_de_fip.xls");
            }else{
                mostrarMensaje(1, 'No existen datos para exportar.');
            }
        },
        hidden: false,//opcionesConfig.noUsarActivar,
        disabled: false,
        iconCls: 'exportar',
        tooltip: 'Exportar FIP',
        key: {
            alt: true,
            key: 'G'
        },
        scope: this
    });

    this.btnBusquedaRapida = new Ext.Button({
        handler: function () {
            _this.searchRapida();
        },
        //hidden: true,
        id:'btnBusquedaRapida',
        iconCls: 'buscar',
        tooltip: 'B&uacute;squeda r&aacute;pida',
        key: {
            alt: true,
            key: 'R'
        },
        scope: this
    });

    this.btnExpandirPadre = new Ext.Button({
        handler: function () {
            var arrayrecords = [];
            for (var i = 0; i < _this.smTGCmpFips.getSelections().length; i++)
                if (!_this.smTGCmpFips.getSelections()[i].data._is_leaf)
                    arrayrecords.push(_this.smTGCmpFips.getSelections()[i]);
            _this.analizados = [];
            _this.posiciones = [];
            _this.ExpandParent(arrayrecords);


        },
        //hidden: true, //quitar esta condicion y poner la de abajo
        hidden: opcionesConfig.noUsarActivar,
        disabled: true,
        iconCls: 'expandir',
        tooltip: 'Expandir fip',
        key: {
            alt: true,
            key: 'C'
        },
        scope: this
    });


    /************************************
     * ************************************************/


    /*this.btnImprimir = new Ext.Button({
     disabled: false,
     iconCls: 'crearreporte',
     tooltip: 'Obtener reporte',
     handler: function() {
     
     objCmpReportes = new Utilidades.Cmp.Cmpreportes(
     {
     noUsarModificar: false,
     noUsarEliminar: false,
     noUsarActivar: false,
     noUsarDesactivar: false,
     noUsarCerrarWinP: false,
     noUsarSeleccionarWinP: true,
     maxWinPrincipal: false,
     noUsarCbAprob: false,
     noUsarGestObser: false,
     noMostrarColumObser: false,
     singlemodoSeleccionGridPlanes: false,
     noUsarMenuGrid: false,
     closableWinPrincipal: true,
     titleWinPrincipal: 'Reportes'
     });
     objCmpReportes.CargarCmpReportes(idelemento = null, tipoelemento = null, parentelemento = null, PostAccionesRelacionar = null);
     },
     key: {
     alt: true,
     key: 'R'
     }
     });*/

    this.btnLimpiar = new Ext.Button({
        disabled: false,
        handler: function () {
            // _this.opcionBusqueda = 3;
            //_this.CargarFips();
            _this.pBuscarFips.collapse(false);
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpFips.clearSelections();
            _this.cbbtipo.reset();
            _this.cbNivelAcceso.reset();
            _this.stTGCmpFips.baseParams.arrayautores = '';
            _this.stTGCmpFips.baseParams.arrayinvolucrados = '';
            if (_this.ftCmpFIP.getFiltrosActivos() == undefined || _this.ftCmpFIP.getFiltrosActivos().length == 0) {
                _this.stTGCmpFips.load();
            }
            _this.ftCmpFIP.clearFilters();
            _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
        },
        iconCls: 'limpiar',
        tooltip: 'Limpiar filtro(s)',
        key: {
            alt: true,
            key: 'L'
        },
        scope: this
    });
    this.btnBusquedaSimple = new Ext.Button({
        handler: function () {
            _this.btnBusquedaSimple.focus();
            if (_this.fppBuscarFips.getForm().isValid()) {
                _this.opcionBusqueda = 1;
                _this.stTGCmpFips.baseParams.start = 0;
                _this.stTGCmpFips.reload({
                    params: {
                        anode: null
                    }
                });
                //     _this.CargarFips();
            }
        },
        text: 'Buscar',
        iconCls: 'buscar',
        tooltip: 'Buscar FIP(s)',
        disabled: true,
    });
    this.btnSeleccionar = new Ext.Button({
        handler: function () {
            _this.RelacionarElementos();
        },
        disabled: true,
        text: 'Seleccionar',
        iconCls: 'seleccion ',
        tooltip: 'Relacionar FIP(s) seleccionado(s)',
        hidden: opcionesConfig.noUsarSeleccionarWinP
    });
    this.btnDesgloce = new Ext.Button({
        handler: function () {
            _this.ConstruirWinDesgloce();
        },
        disabled: true,
        iconCls: 'desglose',
        tooltip: 'Desglosar FIP',
        key: {
            ctrl: true,
            key: 'D'
        }
    });
    this.btnAyuda = new Ext.Button({
        id: 'btnAyudaCmpGestionarFIP',
        text: 'Ayuda',
        iconCls: 'ayuda',
        hidden: opcionesConfig.noUsarAyuda,
        tooltip: 'Mostrar ayuda de la funcionalidad',
        key: {
            alt: true,
            key: 'H'
        },
        scope: this
    });

    this.btnExportar = new Ext.Button({
        handler: function () {
            if (_this.smTGCmpFips.getSelected) {
                _this.cmpexpimp.ventanaExportarElemento(_this.TGCmpFips, _this.smTGCmpFips, 2);
            }
        },
        disabled: true,
        iconCls: 'exportar',
        tooltip: 'Exportar FIP(s)',
        key: {
            alt: true,
            key: 'E'
        },
        scope: this
    });
    this.btnImportar = new Ext.Button({
        handler: function () {
            _this.cmpexpimp.showCmpImportar(2, _this.TGCmpFips, _this.PanPrincipal);
        },
        disabled: false,
        iconCls: 'importar',
        tooltip: 'Importar FIP(s)',
        key: {
            alt: true,
            ctrl: true,
            key: 'I'
        },
        scope: this
    });
    this.btnConfPerfil = new Ext.Button({
        handler: function () {
            _this.objconfiguracionperfil.verConfiguracionperfil(_this.cargarConfiguracionPerfil, 2);
        },
        disabled: false,
        iconCls: 'filtrar',
        tooltip: 'Configurar cargas por defecto',
        key: {
            ctrl: true,
            alt: true,
            key: 'F'
        }
    });
    this.btnFechaControl = new Ext.Button({
        handler: function () {
            _this.ConstruirWinFechasControl(0, 0, null);
        },
        disabled: false,
        iconCls: 'calendario',
        tooltip: 'Adicionar fechas de control',
    });

		this.btnActualizarParametros = new Ext.Button({
				handler: function () {
						_this.actualizarParametros();
				},
				// hidden: opcionesConfig.noUsarActivar,
                hidden: true,
				disabled: true,
				iconCls: 'modificar',
				tooltip: 'Actualizar parámetros',
				key: {
						alt: true,
						key: 'P'
				},
				scope: this
		});

    this.btnEnviarCorreo = new Ext.Button({
        handler: function () {
            _this.enviarCorreo();
        },
        // hidden: opcionesConfig.noUsarActivar,
        disabled: true,
        iconCls: 'notificaciones',
        tooltip: 'Notificar por correo',
        key: {
            alt: true,
            key: 'N'
        },
        scope: this
    });

    this.btnRefresh = {
        text: 'Actualizar registro de FIP',
        hidden: true,
        handler: function () {
            var paginado = _this.TGCmpFips.getBottomToolbar().items;
            _this.smTGCmpFips.clearSelections();
            paginado.items[0].show();
            paginado.items[1].show();
            paginado.items[2].show();
            paginado.items[3].show();
            paginado.items[4].hide();
            _this.stTGCmpFips.reload();
        },
        iconCls: 'x-btn-text x-tbar-loading',
        key: {
            ctrl: true,
            alt: true,
            key: 'Z'
        }
    };

    //store del treegrid donde se muestran las fips
    this.stTGCmpFips = new Ext.ux.maximgb.treegrid.AdjacencyListStore({
        autoLoad: true,
        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargarfips',
        listeners: {
            beforeload: function (st) {
                st.baseParams.idfip = _this.arrayidfips[0];
                st.baseParams.eshija = _this.eshija;
                st.baseParams.fipsreorganizar = Ext.encode(_this.arrayidfipsReorganizar);
                if (_this.opcionBusqueda != 3) {
                    var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    st.baseParams.arrayautores = Ext.encode(arrayautores);
                    st.baseParams.arrayinvolucrados = Ext.encode(arrayinvolucrados);
                    st.baseParams.nivelacceso = _this.cbNivelAcceso.getValue();
                    st.baseParams.tipoact = _this.cbbtipo.getValue();
                    st.baseParams.busqueda = _this.busqueda;
                }
            },
            expandnode: function (record, ev) {

                var rowIndex = record.find('idelemento', _this.ultimoElemenSelec/*_this.arrayidfips[0]*/);
                _this.TGCmpFips.getView().focusRow(rowIndex);
                //_this.smTGCmpFips.selectRow(rowIndex);
            },
            load: function (store, record, options) {
                if (_this.TGCmpFips.getStore().getCount() == 0 && !_this.posteliminar) {
                    var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
                    var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
                    if ((_this.ftCmpFIP.getFiltrosActivos() == undefined || _this.ftCmpFIP.getFiltrosActivos().length == 0) && (arrayautoresbusq.length == 0 && arrayinvolucradosbusq.length == 0)) {
                        mostrarMensaje(1, 'No existen datos que mostrar.');
                    } else {
                        mostrarMensaje(1, 'No existen datos que se correspondan con los criterios de b&uacute;squeda especificados.');
                    }
                }

                _this.posteliminar = false;
                _this.ActualizarEstadoBarraHerramientas();
                if (_this.smTGCmpFips.hasSelection()) {
                    _this.TGCmpFips.getView().refresh(true);
                }
                store.baseParams.arrayautores = '';
                store.baseParams.arrayinvolucrados = '';
                store.baseParams.nivelacceso = '';
                store.baseParams.tipoact = '';
                store.baseParams.busqueda = '';
                _this.changeTitleFIP();
            }
        },
        reader: new Ext.data.JsonReader({
            id: 'idelemento',
            totalProperty: "total",
            root: "campos"
        }, [{
            name: 'idelemento'
        }, {
            name: 'denominacion'
        }, {
            name: 'activo'
        }, {
            name: 'fechainicio'
        }, {
            name: 'fechafin'
        }, {
            name: 'fechascontrol'
        }, {
            name: '_parent'
        }, {
            name: '_is_leaf'
        }, {
            name: 'estadocumplimiento'
        }, {
            name: 'gradocumplimiento'
        }, {
            name: 'nombreautor'
        }, {
            name: 'subordinado'
        }, {
            name: 'superior'
        }, {
            name: 'observaciones'
        }, {
            name: 'textocumplimiento'
        }, {
            name: 'tipoelemento'
        }, {
            name: 'modificar'
        }, {
            name: 'eliminar'
        }, {
            name: 'idautor'
        }, {
            name: 'cantrelacdescorigen1'
        }, {
            name: 'tipofip'
            }
        ])
    });

    //barra de paginado del treegrid donde se muestran las actividades
    this.ptbTGCmpFips = new Ext.ux.maximgb.treegrid.PagingToolbar({
        pageSize: 1000,
        store: _this.stTGCmpFips,
        displayInfo: true,
        listeners: {
            beforechange: function (paginado, evento) {
                _this.start = evento.start;
            }
        }
    });

    //modo de del treegrid donde se muestran las fips
    this.smTGCmpFips = new Ext.grid.CheckboxSelectionModel({
        singleSelect: false,
        listeners: {
            rowselect: function (sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpFips.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpFips.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpFips.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpFips.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            },
            rowdeselect: function (sm, indiceFila, record) {
                if (_this.prevrow >= 0 && _this.prevrow != indiceFila) {
                    Ext.get(_this.TGCmpFips.getView().getRow(_this.prevrow)).removeClass('superior2');
                    Ext.get(_this.TGCmpFips.getView().getRow(_this.prevrow)).addClass('superior');
                }
                if (record.data.superior == 1) {
                    Ext.get(_this.TGCmpFips.getView().getRow(indiceFila)).removeClass('superior');
                    Ext.get(_this.TGCmpFips.getView().getRow(indiceFila)).addClass('superior2');
                    _this.prevrow = indiceFila;
                } else
                    _this.prevrow = -1;
                _this.ActualizarEstadoBarraHerramientas();
            }
        }
    });
    //plugins para los filtros del grid
    this.ftCmpFIP = new Ext.grid.GridFilters({
        filters: [{
            type: 'string',
            dataIndex: 'idelemento'
        }, {
            type: 'string',
            dataIndex: 'denominacion'
        }, {
            type: 'date',
            dataIndex: 'fechainicio'
        }, {
            type: 'date',
            dataIndex: 'fechafin'
        }, {
            type: 'date',
            dataIndex: 'fechascontrol'
        }, {
            type: 'numeric',
            dataIndex: 'gradocumplimiento'
        }, {
            type: 'list',
            dataIndex: 'textocumplimiento',
            options: ['Cumplida', 'Parcialmente cumplido', 'Sin cumplir']
        }, {
            type: 'list',
            dataIndex: 'observaciones',
            options: ['Si', 'No']
        }, {
            type: 'listado',
            dataIndex: 'tipofip',
            idcombo: 'idcbtipofip',
            urlcb: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
            idstore: 'idstcbtipofip',
            valueFieldcb: 'idtipo',
            displayFieldcb: 'denominacion'
        }]
    });

    //treegrid donde se muestran las fips
    this.TGCmpFips = new Ext.ux.maximgb.treegrid.GridPanel({
        store: _this.stTGCmpFips,
        master_column_id: 'expandir',
        autoExpandMin: 165,
        stripeRows: true,
        columnsByDemand: true,
        region: 'center',
        /*viewConfig: {
         forcefit: true
         },*/
        sm: _this.smTGCmpFips,
        plugins: _this.ftCmpFIP,
        margins: '3 3 3 3',
        loadMask: {
            msg: 'Cargando FIP...'
        },
        root_title: 'Registro de FIP',
        columns: [_this.smTGCmpFips,
            {
                header: "Nro de Control",
                dataIndex: 'idelemento',
                width: 90,
                renderer: function (val) {
                    return val;
                },
                hidden: true,
                sortable: true
            }, {
                header: "Denominaci&oacute;n",
                id: 'expandir',
                dataIndex: 'denominacion',
                width: 565,
                sortable: true,
                renderer: MostrarImagenTipoElemento
            }, {
                header: "Fecha de Emisi&oacute;n",
                dataIndex: 'fechainicio',
                width: 125,
                sortable: true
            }, {
                header: "Fecha de Cumplimiento",
                dataIndex: 'fechafin',
                width: 135,
                sortable: true
            }, {
                header: "Fechas de Control",
                dataIndex: 'fechascontrol',
                width: 150,
                sortable: true,
                renderer: MostrarTodosLosDatos
            }, {
                header: "Tipo de FIP",
                dataIndex: 'tipofip',
                width: 150,
                sortable: true
            }, {
                header: "Estado de cumplimiento",
                dataIndex: 'textocumplimiento',
                width: 150,
                hidden: false,
                sortable: true,
                renderer: MostrarImagenEstadoCumplimiento
            }, {
                header: "% de cumplimiento",
                dataIndex: 'gradocumplimiento',
                width: 120,
                hidden: false,
                aling: 'center',
                sortable: true,
                renderer: function (a) {
                    return a + ' %'
                }
            }, {
                header: "Observaciones",
                hidden: false,
                dataIndex: 'observaciones',
                width: 90,
                sortable: true,
                renderer: MostrarImagenT
            }, {
                header: "Autor",
                dataIndex: 'nombreautor',
                width: 150,
                sortable: true,
                renderer: function (val) {
                    return val;
                }
            }
        ],
        menuderecho: _this.menuderechoTGCmpFips,
        listeners: {
            rowcontextmenu: function (grid, row, e) {
                _this.TGCmpFips.getSelectionModel().selectRow(row);
                //menu derecho del grid de fips
                _this.menuderechoTGCmpFips = new Ext.menu.Menu({});

                (_this.miadicionar) ? _this.miadicionar.destroy() : null;
                if (_this.arrayfipseleccionadas.length == 1) {
                    _this.miadicionar = new Ext.menu.Item({
                        text: 'Adicionar FIP',
                        itemCls: 'x-menu-item icondistra-adicionar',
                        iconCls: 'imagen-none',
                        hideOnClick: true,
                        handler: function () {
                            _this.eshija = 1;
                            _this.objCrudFip.CrearWinCrudFips(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                'Adicionar', _this.PostAccionesGestionar, _this.arrayidfips,
                                null, _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                                _this.smTGCmpFips, _this.stTGCmpFips);
                        }
                    });
                    _this.menuderechoTGCmpFips.add(_this.miadicionar);
                }
                if (_this.mimodificar) {
                    _this.mimodificar.destroy();
                }
                if (_this.permitirmodificar == 1) {
                    _this.mimodificar = new Ext.menu.Item({
                        text: 'Modificar FIP',
                        itemCls: 'x-menu-item icondistra-modificar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.eshija = 0;
                            _this.objCrudFip.CrearWinCrudFips(
                                new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                                'Modificar', _this.PostAccionesGestionar, _this.arrayidfips, null,
                                _this.eshija, permisomodificar = 1, permisoeliminar = 1,
                                _this.smTGCmpFips, _this.stTGCmpFips);
                        }
                    });
                    _this.menuderechoTGCmpFips.add(_this.mimodificar);
                }
                if (_this.mieliminar) {
                    _this.mieliminar.destroy();
                }
                if (_this.permitireliminar == 1) {
                    _this.mieliminar = new Ext.menu.Item({
                        text: _this.setTextdeMenus(_this.smTGCmpFips.getCount(), 'Eliminar'),
                        itemCls: 'x-menu-item icondistra-eliminar',
                        iconCls: 'imagen-none',
                        handler: function () {
                            _this.eshija = 0;
                            _this.objCrudFip.EliminarFips(
                                _this.arrayidfips, _this.PostAccionesGestionar, _this.smTGCmpFips, _this.TGCmpFips);
                        }
                    });
                    _this.menuderechoTGCmpFips.add(_this.mieliminar);
                }
                if (_this.midatos) {
                    _this.midatos.destroy();
                }
                _this.midatos = new Ext.menu.Item({
                    text: 'Ver datos del FIP',
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    handler: function () {
                        _this.eshija = 0;
                        _this.objCrudFip.CrearWinCrudFips(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            'Ver datos del', _this.PostAccionesGestionar, _this.arrayidfips,
                            null, _this.eshija, permisomodificar = 1, permisoeliminar = 1);
                    }
                });
                if (_this.mostrardetalles) {
                    _this.mostrardetalles.destroy();
                }
                _this.mostrardetalles = new Ext.menu.Item({
                    text: 'Mostrar detalles',
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    handler: function () {
                    }
                });
                if (_this.smTGCmpFips.getCount() == 1) {
                    _this.menuderechoTGCmpFips.add(_this.midatos);
                }
                e.stopEvent();
                var xy = e.getXY();
                _this.menuderechoTGCmpFips.showAt(xy);
            },
            rowdblclick: function (grid, row, event) {
                _this.eshija = 0;
                var select = _this.TGCmpFips.getSelectionModel().selections.items;
                if (Object.keys(select).length == 1) {
                    if (_this.permitirmodificar) {
                        _this.objCrudFip.CrearWinCrudFips(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            'Modificar', _this.PostAccionesGestionar, _this.arrayidfips,
                            _this.arrayfipseleccionadas[0].idautor, _this.eshija,
                            permisomodificar = 1, permisoeliminar = 1, _this.smTGCmpFips);
                    } else {

                        _this.objCrudFip.CrearWinCrudFips(
                            new Date().format('d/m/Y'), new Date().format('d/m/Y'),
                            'Ver datos del', _this.PostAccionesGestionar, _this.arrayidfips,
                            _this.arrayfipseleccionadas[0].idautor, _this.eshija,
                            permisomodificar = 1, permisoeliminar = 1, _this.smTGCmpFips);
                    }
                }
            }
        },
        tbar: [_this.btnAdicionar, ' ', _this.btnModificar, ' ', _this.btnEliminar, ' ', _this.btnVer, ' ',
               _this.btnDuplicar, ' ', _this.btnDesgloce, ' ', /*_this.btnExportar, ' ',_this.btnImportar, ' ',*/
               _this.btnGestObs, ' ',_this.btnReorganizar, ' ', _this.btnHacerRaiz, ' ',
               _this.btnAsociarInvolFip, ' ', _this.btnMaxCumplimiento, ' ', _this.btnOtroValorCumplimiento, ' ',_this.btnExportarActaTrabajo, _this.btnExportarGrid,
               ' ', _this.btnPanelBusqueda, /*' ', _this.btnImprimir,*/ ' ', _this.btnConfPerfil, ' ',
               _this.btnFechaControl, ' ', _this.btnActualizarParametros, ' ', _this.btnEnviarCorreo, ' ',
               _this.btnExpandirPadre, ' ',_this.btnBusquedaRapida,' ',_this.btnLimpiar,
               '->', _this.btnAyuda],
        bbar: (!opcionesConfig.noUsarPaginado) ? _this.ptbTGCmpFips : null
    });


    _this.setTextdeMenus = function (conteo, accion) {
        if (accion == 'Exportar') {
            if (conteo == 1) {
                return 'Exportar FIP';
            } else
                return 'Exportar FIPs';
        } else if (accion == 'Eliminar') {
            if (conteo == 1) {
                return 'Eliminar FIP';
            } else
                return 'Eliminar FIPs';
        }
    };

    _this.ReorganizarHijos= function(){
        objCmpFip = new Utilidades.Cmp.Cmpgestionarfip(
            {
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarActivar: true,
                noUsarDesactivar: true,
                noUsarCerrarWinP: false,
                noUsarSeleccionarWinP: false,
                maxWinPrincipal: false,
                noUsarCbAprob: true,
                noUsarGestObser: true,
                noMostrarColumObser: true,
                singlemodoSeleccionGridPlanes: false,
                noUsarMenuGrid: true,
                noUsarAyuda: true,
                titleWinPrincipal: 'Registro de FIPs',
                closableWinPrincipal: true,
                noUsarPaginado: true,
                reordenarHijos: true,
                arraysubfips: _this.arrayfipseleccionadas,
            });

        var aux = [];
        for (var i = 0; i < _this.smTGCmpFips.getCount(); i++) {
            aux.push(_this.smTGCmpFips.getSelections()[i].id);
            if (_this.smTGCmpFips.getSelections()[i].data._parent != null)
                aux.push(_this.smTGCmpFips.getSelections()[i].data._parent);
        }

        objCmpFip.CargarCmpFip(idelemento = null, tipoelemento = null, parentelemento = 'hijo', function () {
            _this.smTGCmpFips.clearSelections();
            _this.stTGCmpFips.reload({
                params: {
                    anode: null,
                    start: 0
                }
            });
        }, aux);

        _this.ActualizarEstadoBarraHerramientas();
    }

    _this.acuerdos_GA= function(){

        var aux = [];

        var arrayrecords=_this.storeAcuerdos_GA.data.items;

        for (var i=0; i < arrayrecords.length; i++){
                aux.push(arrayrecords[i].data.idelemento);
                if (arrayrecords[i].data._parent != null)
                    aux.push(arrayrecords[i].data._parent);

        }

        objCmpFip = new Utilidades.Cmp.Cmpgestionarfip(
            {
                noUsarModificar: true,
                noUsarEliminar: true,
                noUsarActivar: true,
                noUsarDesactivar: true,
                noUsarCerrarWinP: false,
                noUsarSeleccionarWinP: false,
                maxWinPrincipal: false,
                noUsarCbAprob: true,
                noUsarGestObser: true,
                noMostrarColumObser: true,
                singlemodoSeleccionGridPlanes: false,
                noUsarMenuGrid: true,
                noUsarAyuda: true,
                titleWinPrincipal: 'Registro de FIPs',
                closableWinPrincipal: true,
                noUsarPaginado: true,
                reordenarHijos: false,
                acuerdos_GA: true
            });




        objCmpFip.CargarCmpFip(idelemento = null, tipoelemento = null, parentelemento = 'hijo', function (arrayfipseleccionadas) {
            for (var i=0; i < arrayfipseleccionadas.length; i++){
            _this.storeAcuerdos_GA.add(new Ext.data.Record({
                idelemento:arrayfipseleccionadas[i].idelemento,
                denominacion:arrayfipseleccionadas[i].denominacion,
                activo:arrayfipseleccionadas[i].activo,
                fechainicio:arrayfipseleccionadas[i].fechainicio,
                fechafin:arrayfipseleccionadas[i].fechafin,
                fechascontrol:arrayfipseleccionadas[i].fechascontrol,
                _parent:arrayfipseleccionadas[i]._parent,
                _is_leaf:arrayfipseleccionadas[i]._is_leaf,
                estadocumplimiento:arrayfipseleccionadas[i].estadocumplimiento,
                gradocumplimiento:arrayfipseleccionadas[i].gradocumplimiento,
                nombreautor:arrayfipseleccionadas[i].nombreautor,
                subordinado:arrayfipseleccionadas[i].subordinado,
                superior:arrayfipseleccionadas[i].superior,
                observaciones:arrayfipseleccionadas[i].observaciones,
                textocumplimiento:arrayfipseleccionadas[i].textocumplimiento,
                tipoelemento:arrayfipseleccionadas[i].tipoelemento,
                modificar:arrayfipseleccionadas[i].modificar,
                eliminar:arrayfipseleccionadas[i].eliminar,
                idautor:arrayfipseleccionadas[i].idautor,
                cantrelacdescorigen1:arrayfipseleccionadas[i].cantrelacdescorigen1
            }));
           }
        }, aux);

        _this.ActualizarEstadoBarraHerramientas();
    };

    this.HacerRaizActividades = function (arrayidfips, sm, st, start) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        if (arrayidfips.length == 1) {
            mensajeconfirmacion = 'El sub-fip ha sido reordenado satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar el sub-fip seleccionado?';
            mensajemascara = 'Reorganizando sub-fip';
            mensajeconfirmacion2 = 'No se ha podido reordenar el sub-fip seleccionado.';
        } else {
            mensajeconfirmacion = 'Los sub-fips han sido reordenados satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar los sub-fips seleccionados?';
            mensajemascara = 'Reorganizando sub-fips';
            mensajeconfirmacion2 = 'No se han podido reordenar los sub-fips seleccionados.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/hacerRaizActividades',
                    params: {
                        arrayidfips: Ext.encode(arrayidfips)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                            });
                        }
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            st.reload({
                                params: {
                                    anode: null,
                                    start: start
                                }
                            });
                            sm.clearSelections();
                        }
                    }
                });
            } else {
                if (sm.hasSelection())
                    sm.clearSelections();
            }
        });
    };

    this.asociarInvolFip = function () {
        if (_this.smTGCmpFips.hasSelection()) {
            this.btnCancelarAsociar = new Ext.Button({
                handler: function () {
                    _this.winAsociarInvolFip.destroy();
                },
                iconCls: 'cancelar ',
                text: 'Cancelar ',
                tooltip: 'Cerrar ventana sin guardar los datos',
                id: 'btnCancelarAsociar',
                nextTab: 'btnAceptarAsociar',
                prevTab: 'btnActualizarExpandirAgrupacion'
            });
            this.btnAceptarAsociar = new Ext.Button({
                handler: function () {
                    _this.asociarInvolucrados();
                },
                iconCls: 'aceptar ',
                text: 'Aceptar ',
                tooltip: 'Guardar datos y cerrar ventana',
                id: 'btnAceptarAsociar',
                disabled: true,
                nextTab: 'tfbuscarInv',
                prevTab: 'btnCancelarAsociar'
            });
            var parametros = {arrayfipseleccionadas: _this.arrayfipseleccionadas}
            this.pClasificadorInvol = _this.objclasificadorinvol.CrearClasificadorInvol(idelemento = undefined, tipoelemento = 2, estamodificando = 0, idautor = null, parametros);

            this.pAsociarInvolAct = new Ext.FormPanel({
                id: 'pAsociarInvolFip',
                items: [_this.pClasificadorInvol],
                listeners: {
                    'clientvalidation': function (fm, valid) {
                        if (_this.objclasificadorinvol.verificarCantInv) {
                            _this.btnAceptarAsociar.enable();
                        } else {
                            _this.btnAceptarAsociar.disable();
                        }
                    }
                }

            });

            if (_this.winAsociarInvolFip) {
                _this.winAsociarInvolFip.destroy();
            }
            var titulo = (_this.smTGCmpFips.getSelections().length > 1) ? 'Asociar involucrados a los fips seleccionados' : 'Asociar involucrados al fip seleccionado';
            this.winAsociarInvolFip = new Ext.Window({
                title: titulo,
                width: 712,
                height: 330,
                modal: true,
                closeAction: 'destroy',
                constrain: true,
                resizable: false,
                buttons: [_this.btnCancelarAsociar, _this.btnAceptarAsociar],
                items: [_this.pAsociarInvolAct]
            });
            _this.winAsociarInvolFip.on('beforeshow', function () {
                _this.btnCancelarAsociar.focus(true, 700);
            });
            _this.winAsociarInvolFip.doLayout();
            _this.winAsociarInvolFip.show();
            _this.btnCancelarAsociar.focus(false, 1024);
        } else {
            mostrarMensaje(1, 'Debe seleccionar al menos una actividad para poder involucrar usuarios.');
        }
    };

    this.actualizarCumplimiento = function (metodo) {
        var msj = '', msjError = '';
        _this.arrayidfips = (opcionesConfig.arrayidfips) ? opcionesConfig.arrayidfips : _this.arrayidfips;
        if (_this.arrayidfips.length > 0) {
            if (_this.arrayidfips.length == 1) {
                msj = 'El fip ha sido actualizado satisfactoriamente.';
                msjError = 'La acci&oacute;n no se pudo realizar porque el fip ' +
                    'seleccionado tiene elementos asociados.';
            } else {
                msj = 'Los fips han sido actualizados satisfactoriamente.';
                msjError = 'La acci&oacute;n no se pudo realizar porque los fips ' +
                    'seleccionados tienen elementos asociados.';
            }
            if (metodo == 1) {
                this.BarraProgreso.show('Actualizando cumplimiento');
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/actualizarCumplimiento',
                    params: {
                        arrayidfips: Ext.encode(_this.arrayidfips),
                        metodo: metodo
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);

                        if (responseData.respuesta == 1) {
                            mostrarMensaje(1, msj);
                        }
                        if (responseData.respuesta == 2) {
                            mostrarMensaje(1, msj + ', excepto aquellas seleccionadas con actualizaci&oacute;n autom&aacute;tica.');
                        }
                        if (responseData.respuesta == 3) {
                            mostrarMensaje(1, msjError);
                        }
                        if (_this.smTGCmpFips.isSelected()) _this.smTGCmpFips.clearSelections();
                        var start = _this.ptbTGCmpFips.getLastStart();
                        _this.stTGCmpFips.reload({
                            params: {
                                anode: null,
                                start: _this.start
                            }
                        });
                        _this.ActualizarEstadoBarraHerramientas();
                    }
                });
            } else {
                if (_this.winActualizarCumplimiento) {
                    _this.winActualizarCumplimiento.destroy();
                }
                _this.winActualizarCumplimiento = new Ext.Window({
                    title: 'Actualizar Cumplimiento',
                    width: 200,
                    height: 130,
                    modal: true,
                    buttons: [
                        new Ext.Button({
                            handler: function () {
                                _this.winActualizarCumplimiento.destroy();
                            },
                            iconCls: 'cancelar',
                            text: 'Cancelar',
                            tooltip: ''
                        }),
                        new Ext.Button({
                            handler: function () {
                                if (Ext.getCmp('nfActCumplimiento').isValid()) {
                                    _this.BarraProgreso.show('Actualizando cumplimiento');
                                    Ext.Ajax.request({
                                        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/actualizarCumplimiento',
                                        params: {
                                            arrayidfips: Ext.encode((opcionesConfig.arrayidfips) ? opcionesConfig.arrayidfips : _this.arrayidfips),
                                            cumplimiento: Ext.getCmp('nfActCumplimiento').getValue(),
                                            metodo: metodo
                                        },
                                        callback: function (options, success, response) {
                                            _this.BarraProgreso.hide();
                                            responseData = Ext.decode(response.responseText);
                                            if (responseData.respuesta == 1) {
                                                mostrarMensaje(1, msj);
                                            }
                                            if (responseData.respuesta == 2) {
                                                mostrarMensaje(1, msj + ', excepto aquellas seleccionadas con actualizaci&oacute;n autom&aacute;tica.');
                                            }
                                            if (responseData.respuesta == 3) {
                                                mostrarMensaje(1, msjError);
                                            }
                                            _this.winActualizarCumplimiento.destroy();
                                            _this.smTGCmpFips.clearSelections();
                                            var start = _this.ptbTGCmpFips.getLastStart();
                                            _this.stTGCmpFips.reload({
                                                params: {
                                                    anode: null,
                                                    start: _this.start
                                                }
                                            });
                                            _this.ActualizarEstadoBarraHerramientas();
                                        }
                                    });
                                } else {
                                    mostrarMensaje(1, "Existe(n) algún(os) campo(s) con valor(es) incorrecto(s) o vacío(s).");
                                }
                            },
                            iconCls: 'aceptar',
                            text: 'Aceptar',
                            tooltip: ''
                        })
                    ],
                    items: [
                        new Ext.FormPanel({
                            labelAlign: 'top',
                            frame: true,
                            items: [
                                new Ext.form.NumberField({
                                    fieldLabel: 'Porciento de cumplimiento',
                                    id: 'nfActCumplimiento',
                                    maxValue: 100,
                                    maxText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    minValue: 0,
                                    minText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    allowBlank: false,
                                    regex: /^[0-9]+([.][0-9][0-9]?)?$/,
                                    allowNegative: false,
                                    regexText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    nanText: 'Solo admite números enteros positivos entre 0 y 100. Con 2 cifras decimales.',
                                    anchor: '90%'
                                })
                            ]
                        })
                    ]
                });
                _this.winActualizarCumplimiento.on('beforeshow', function () {
                    Ext.getCmp('nfActCumplimiento').focus(true, 700);
                });
                _this.winActualizarCumplimiento.doLayout();
                _this.winActualizarCumplimiento.show();
                Ext.getCmp('nfActCumplimiento').focus(false, 1024);
            }
        } else mostrarMensaje(1, 'No existe(n) actividad(es) seleccionada(s).');

    };

    this.generarActaTrabajo = function () {

        _this.tplImagen_GA = new Ext.Template(
            '<center>',
            '<div id="{id}" class="x-box x-box-blue x-screenshotfield-bwrap" style="position: relative; width: {widthP}; height: {heightP};">' +
            '<div class="x-box-tl">' +
            '<div class="x-box-tr">' +
            '<div class="x-box-tc"></div>' +
            '</div>' +
            '</div>' +
            '<div class="x-box-ml">' +
            '<div class="x-box-mr">' +
            '<div class="x-screenshotfield-wrap" style="width: {width}; height: {height};">' +
            '<img class="x-screenshotfield" width="{width}" height="{height}" src="{dir}">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="x-box-bl">' +
            '<div class="x-box-br">' +
            '<div class="x-box-bc"></div>' +
            '</div>' +
            '</div>' +
            '<center>'
        );

        _this.tplImagen_GA.compile();

        _this.Img_GA = new Ext.ux.ScreenshotField({
            center: true,
            fieldLabel: 'Imagen',
            hideLabel: true,
            allowUpload: true,
            name: 'foto',
            width: 150,
            height: 150,
            value: _this.fotoDefault_GA,
            allowBlank: true
        });

        _this.btnGestionarImg_GA = new Ext.Button({
            iconCls: 'gestionarimagen',
            //icon: perfil.dirImg + 'cambiar.png',
            tooltip: 'Gestionar imagen',
            scope: this,
            handler: function () {
                _this.actalizarImagen();
            }
        });

        _this.panelLogo_GA=new Ext.Panel({
            shadow: true,
            width:200,
            frame:true,
            height: 300,
            region      : 'west',
            split       : true,
            items : [
                _this.Img_GA
            ]
        });


        _this.tftitulo_GA = new Ext.form.TextField({
            id: 'tftitulo_GA',
            fieldLabel: 'Título',
            maxLength: 150,
		        value:'Acta de trabajo',
            maxLengthText: 'El tamaño máximo requerido es 150 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' :*,./()_-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            labelAlign:'right',
            flex: 1,
            anchor:'100%',
        });

        _this.tforganismo_GA = new Ext.form.TextField({
            id: 'tforganismo_GA',
            fieldLabel: 'Organismo',
            maxLength: 150,
            maxLengthText: 'El tamaño máximo requerido es 150 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ ._-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            labelAlign:'right',
            flex: 1,
            anchor:'100%',
        });

        _this.tfnumero_GA = new Ext.form.NumberField({
            id: 'tfnumero_GA',
            fieldLabel: 'No',
            maxLength: 4,
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            labelAlign:'right',
            flex: 1,
            anchor:'100%',
        });

        _this.tffecha_GA = new Ext.form.DateField({
            fieldLabel: 'Fecha',
            id: 'tffecha_GA',
            allowBlank: false,
            format: 'd/m/Y',
            labelAlign:'right',
            anchor:'100%', flex: 1
        });

        _this.tfhora_GA = new Ext.form.TimeField({
            fieldLabel: 'Hora',
            format: _this.formatohora,
            minValue: _this.hvalorminimo,
            maxValue: _this.hvalormaximo,
            increment: 15,
            value: _this.horainicio, //'8:00 AM',
            editable: true,
            emptyText: 'Seleccione',
            anchor: '95%',
            maskRe: /^([0-9:aAmMpP\s])$/,
            maxText: 'Formato establecido: hh:mm am/pm.',
            allowBlank: false,
            validationEvent: false,
            labelAlign:'right',
            anchor:'100%', flex: 1
        });

        _this.tflugar_GA = new Ext.form.TextField({
            id: 'tflugar_GA',
            fieldLabel: 'Lugar',
            maxLength: 150,
            maxLengthText: 'El tamaño máximo requerido es 150 caracteres.',
            regex: _this.ObjValidaciones.expresionRegular('denominacion'),
            maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
            regexText: _this.ObjValidaciones.ObtenerMsjErrorTextoRegido('denominacion'),
            vtype: 'validarEspaciosEnBlanco',
            allowBlank: false,
            blankText: 'Este campo es obligatorio.',
            labelAlign:'right',
            anchor:'100%',
            flex: 1
        });

        _this.scbformatreporte_GA = new Ext.data.SimpleStore({
            fields: ['idformato', 'nombre'],
            data: [
                ["vp", "Vista Previa"],
                [".doc", "Documento Word"],
                [".xls", "Documento Excel"],
                [".pdf", "Documento Pdf"]
            ]
        });

        //combo de formato de los reportes
        _this.cbformatreporte_GA = new Ext.form.ComboBox({
            id: 'cbformatreporte_GA',
            name: 'cbformatreporte_GA',
            value: 'vp',
            fieldLabel: 'Formato del reporte',
            store: _this.scbformatreporte_GA,
            displayField: 'nombre',
            typeAhead: true,
            allowBlank: false,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            hiddenName: 'idformato',
            valueField: 'idformato',
            anchor: '95%',
            labelStyle:'width:115px;',
            emptyText: 'Seleccione',
            disabled: false,
            enableKeyEvents: true
        });


        _this.form_GA = new Ext.FormPanel({
            frame: true,
            bodyStyle: 'padding:10px 10px 0',
            region: 'center',
            labelAlign:'right',
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    bodyStyle: 'padding:0 0 0',
                    items: [
                        _this.tftitulo_GA,
                        _this.tforganismo_GA

                    ]
                }, {
                    columnWidth: .5,
                    bodyStyle: 'padding:0 0 0',
                    layout: 'form',
                    items: [
                        _this.tfnumero_GA
                    ]
                }]
            },                        {
                layout: 'column',
                items: [{
                    columnWidth: .4,
                    bodyStyle: 'padding:0 0 0',
                    layout: 'form',
                    items: [
                        _this.tffecha_GA

                    ]
                }, {
                    columnWidth: .3,
                    bodyStyle: 'padding:0 0 0',
                    layout: 'form',
                    items: [
                        _this.tfhora_GA
                    ]
                }, {
                    columnWidth: .3,
                    bodyStyle: 'padding:0 0 0',
                    layout: 'form',
                    items: [_this.tflugar_GA]
                }]
            },{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    bodyStyle: 'padding:25px 0 0',
                    items: [
                        _this.cbformatreporte_GA
                    ]
                }]
            }],
            listeners: {
                'clientvalidation': function (fm, valid) {
                    // if (valid) {
                    // 		_this.btnAceptarwindow_actParams.enable();
                    // } else {
                    // 		_this.btnAceptarwindow_actParams.disable();
                    // }
                }
            }
        });

        /********************
         * Panel dirige acta de trabajo.
         * *********************************/

        _this.storeDirige_GA = new Ext.data.SimpleStore({
            fields: [{
                name:'cargo',
                name:'nombre',
                name:'apellidos'
            }],
            data: []
        });

        // modo de seleccion del  grid listado de indicadores
        _this.smDirige_GA = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                // rowselect: function (sm, indiceFila, record) {
                //
                // },
                // rowdeselect: function (sm, indiceFila, record) {
                // },
                selectionchange:function(sm){
                    _this.btnEliminarDirige_GA.setDisabled(sm.getSelections().length==0);
                }
            }
        });

        _this.btnAdicionarDirige_GA = new Ext.Button({
            handler: function () {
                    _this.gridEditorDirige_GA.stopEditing();
                    _this.storeDirige_GA.add(new Ext.data.Record({
                        cargo:'',
                        nombre:'',
                        apellidos:''
                    }));
                    _this.gridEditorDirige_GA.startEditing(0, 0);
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar dirigentes',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });

        _this.btnEliminarDirige_GA = new Ext.Button({
            handler: function () {
                var seleccion =_this.gridEditorDirige_GA.getSelectionModel().getSelections();
                if (seleccion.length == 1) {
                    mensajeconfirmacion = 'El dirigente ha sido eliminado satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar la fila seleccionada?';
                    mensajemascara = 'Eliminando dirigente...';
                } else {
                    mensajeconfirmacion = 'Los dirigentes han sido eliminados satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar las filas seleccionadas?';
                    mensajemascara = 'Eliminando dirigentes...';
                }
                mostrarMensaje(2, mensaje, function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.BarraProgreso.show(mensajemascara);
                        _this.gridEditorDirige_GA.stopEditing();
                        if(seleccion.length>0){
                            var recordDelete=_this.gridEditorDirige_GA.getSelectionModel().getSelections();
                            for (var i=0; i < recordDelete.length; i++){
                                _this.storeDirige_GA.remove(recordDelete[i]);
                            }

                        }
                        _this.gridEditorDirige_GA.startEditing(0, 0);
                        _this.gridEditorDirige_GA.getSelectionModel().clearSelections();
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, mensajeconfirmacion);
                    }
                });
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar dirigentes',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });
        

        //grid editor para listado de indicadores
        _this.gridEditorDirige_GA = new Ext.grid.EditorGridPanel({
            store: _this.storeDirige_GA,
            stripeRows: true,
            title:"Dirige",
            height: 300,
            sm: _this.smDirige_GA,
            clicksToEdit: 2,
            margins: '3 3 3 3',
            columns: [_this.smDirige_GA,
                // {
                //     hidden: true,
                //     hideable: false,
                //     dataIndex: 'id'
                // },
                {
                    header: "Cargo",
                    dataIndex: 'cargo',
                    width: 250,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Nombre",
                    dataIndex: 'nombre',
                    width: 250,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Apellidos",
                    dataIndex: 'apellidos',
                    width: 260,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                }
            ],
            tbar: [_this.btnAdicionarDirige_GA,'-',_this.btnEliminarDirige_GA]
        });


        /********************
         * *********************************/

        /********************
         * Panel asistentes acta de trabajo.
         * *********************************/

        _this.storeAsistentes_GA = new Ext.data.SimpleStore({
            fields: [{
                name:'cargo',
                name:'nombre',
                name:'apellidos',
                name:'area'
            }],
            data: []
        });

        // modo de seleccion del  grid listado de indicadores
        _this.smAsistentes_GA = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                // rowselect: function (sm, indiceFila, record) {
                //
                // },
                // rowdeselect: function (sm, indiceFila, record) {
                // },
                selectionchange:function(sm){
                    _this.btnEliminarAsistentes_GA.setDisabled(sm.getSelections().length==0);
                }
            }
        });

        _this.btnAdicionarAsistentes_GA = new Ext.Button({
            handler: function () {
                _this.gridEditorAsistentes_GA.stopEditing();
                _this.storeAsistentes_GA.add(new Ext.data.Record({
                    cargo:'',
                    nombre:'',
                    apellidos:'',
                    area:''
                }));
                _this.gridEditorAsistentes_GA.startEditing(0, 0);
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar asistentes',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });

        _this.btnEliminarAsistentes_GA = new Ext.Button({
            handler: function () {
                var seleccion =_this.gridEditorAsistentes_GA.getSelectionModel().getSelections();
                if (seleccion.length == 1) {
                    mensajeconfirmacion = 'El asistente ha sido eliminado satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar la fila seleccionada?';
                    mensajemascara = 'Eliminando asistente...';
                } else {
                    mensajeconfirmacion = 'Los asistentes han sido eliminados satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar las filas seleccionadas?';
                    mensajemascara = 'Eliminando asistentes...';
                }
                mostrarMensaje(2, mensaje, function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.BarraProgreso.show(mensajemascara);
                        _this.gridEditorAsistentes_GA.stopEditing();
                        if(seleccion.length>0){
                            var recordDelete=_this.gridEditorAsistentes_GA.getSelectionModel().getSelections();
                            for (var i=0; i < recordDelete.length; i++){
                                _this.storeAsistentes_GA.remove(recordDelete[i]);
                            }

                        }
                        _this.gridEditorAsistentes_GA.startEditing(0, 0);
                        _this.gridEditorAsistentes_GA.getSelectionModel().clearSelections();
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, mensajeconfirmacion);
                    }
                });
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar asistente',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });


        //grid editor para listado de indicadores
        _this.gridEditorAsistentes_GA = new Ext.grid.EditorGridPanel({
            store: _this.storeAsistentes_GA,
            stripeRows: true,
            title:"Asistencia",
            height: 300,
            sm: _this.smAsistentes_GA,
            clicksToEdit: 2,
            margins: '3 3 3 3',
            columns: [_this.smAsistentes_GA,
                // {
                //     hidden: true,
                //     hideable: false,
                //     dataIndex: 'id'
                // },
                {
                    header: "Cargo",
                    dataIndex: 'cargo',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Nombre",
                    dataIndex: 'nombre',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Apellidos",
                    dataIndex: 'apellidos',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Área",
                    dataIndex: 'area',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                }
            ],
            tbar: [_this.btnAdicionarAsistentes_GA,'-',_this.btnEliminarAsistentes_GA]
        });


        /*******************************
                                                    **********************************/

        /*************************************
         * Panel del orden del dia
                                              *******************************************/

        _this.heordendeldia = new Ext.form.HtmlEditor({
            id: 'hedescripcionact',
            width: 500,
            height: 150,
            buttonTips: {
                bold: {
                    title: 'Negrita (Ctrl+B)',
                    text: 'Aplica el formato de negrita al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                italic: {
                    title: 'Cursiva (Ctrl+I)',
                    text: 'Aplica el formato de cursiva al texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                underline: {
                    title: 'Subrayado (Ctrl+U)',
                    text: 'Subraya el texto seleccionado.',
                    cls: 'x-html-editor-tip'
                },
                increasefontsize: {
                    title: 'Agrandar fuente',
                    text: 'Aumenta el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                decreasefontsize: {
                    title: 'Encoger fuente',
                    text: 'Reduce el tamaño de la fuente.',
                    cls: 'x-html-editor-tip'
                },
                backcolor: {
                    title: 'Color de resaltado del texto',
                    text: 'Cambia el aspecto del texto como si estuviera marcado con un marcador.',
                    cls: 'x-html-editor-tip'
                },
                forecolor: {
                    title: 'Color de fuente',
                    text: 'Cambia el color del texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyleft: {
                    title: 'Alinear texto a la izquierda',
                    text: 'Alinea el texto a la izquierda.',
                    cls: 'x-html-editor-tip'
                },
                justifycenter: {
                    title: 'Centrar',
                    text: 'Centrar el texto.',
                    cls: 'x-html-editor-tip'
                },
                justifyright: {
                    title: 'Alinear texto a la derecha',
                    text: 'Alinea el texto a la derecha.',
                    cls: 'x-html-editor-tip'
                },
                insertunorderedlist: {
                    title: 'Viñetas',
                    text: 'Inicia una lista con viñetas.',
                    cls: 'x-html-editor-tip'
                },
                insertorderedlist: {
                    title: 'Numeración',
                    text: 'Inicia una lista numerada.',
                    cls: 'x-html-editor-tip'
                },
                createlink: {
                    title: 'Hipervínculo',
                    text: 'Hace del texto seleccionado un hipervínculo.',
                    cls: 'x-html-editor-tip'
                },
                sourceedit: {
                    title: 'Edición de código',
                    text: 'Cambia al modo de edición de código.',
                    cls: 'x-html-editor-tip'
                }
            },
            listeners: {
                editmodechange: function (editor) {
                    editor.syncValue();
                },
                sync: function (editor, html) {
                }
            }
        });

        /*************************************
                                             *******************************************/

        /********************
         * Panel acuerdos acta de trabajo.
         * *********************************/

        _this.storeAcuerdos_GA = new Ext.data.SimpleStore({
            fields: [{
                name: 'idelemento'
            }, {
                name: 'denominacion'
            }, {
                name: 'activo'
            }, {
                name: 'fechainicio'
            }, {
                name: 'fechafin'
            }, {
                name: 'fechascontrol'
            }, {
                name: '_parent'
            }, {
                name: '_is_leaf'
            }, {
                name: 'estadocumplimiento'
            }, {
                name: 'gradocumplimiento'
            }, {
                name: 'nombreautor'
            }, {
                name: 'subordinado'
            }, {
                name: 'superior'
            }, {
                name: 'observaciones'
            }, {
                name: 'textocumplimiento'
            }, {
                name: 'tipoelemento'
            }, {
                name: 'modificar'
            }, {
                name: 'eliminar'
            }, {
                name: 'idautor'
            }, {
                name: 'cantrelacdescorigen1'
            }],
            data: []
        });

        // modo de seleccion del  grid listado de indicadores
        _this.smAcuerdos_GA = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                // rowselect: function (sm, indiceFila, record) {
                //
                // },
                // rowdeselect: function (sm, indiceFila, record) {
                // },
                selectionchange:function(sm){
                    _this.btnEliminarAcuerdos_GA.setDisabled(sm.getSelections().length==0);
                }
            }
        });

        _this.btnAdicionarAcuerdos_GA = new Ext.Button({
            handler: function () {
                _this.acuerdos_GA();
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar acuerdos',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });

        _this.btnEliminarAcuerdos_GA = new Ext.Button({
            handler: function () {
                var seleccion =_this.gridAcuerdos_GA.getSelectionModel().getSelections();
                if (seleccion.length == 1) {
                    mensajeconfirmacion = 'El acuerdo ha sido eliminado satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar la fila seleccionada?';
                    mensajemascara = 'Eliminando acuerdo...';
                } else {
                    mensajeconfirmacion = 'Los acuerdos han sido eliminados satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar las filas seleccionadas?';
                    mensajemascara = 'Eliminando acuerdos...';
                }
                mostrarMensaje(2, mensaje, function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.BarraProgreso.show(mensajemascara);
                        if(seleccion.length>0){
                            var recordDelete=_this.gridAcuerdos_GA.getSelectionModel().getSelections();
                            for (var i=0; i < recordDelete.length; i++){
                                _this.storeAcuerdos_GA.remove(recordDelete[i]);
                            }

                        }
                        _this.gridAcuerdos_GA.getSelectionModel().clearSelections();
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, mensajeconfirmacion);
                    }
                });
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar acuerdo',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });


        //grid editor para listado de indicadores
        _this.gridAcuerdos_GA = new Ext.grid.GridPanel({
            store: _this.storeAcuerdos_GA,
            stripeRows: true,
            title:"Acuerdos",
            height: 300,
            sm: _this.smAcuerdos_GA,
            margins: '3 3 3 3',
            columns: [_this.smTGCmpFips,
                {
                    header: "Nro de Control",
                    dataIndex: 'idelemento',
                    width: 90,
                    renderer: function (val) {
                        return val;
                    },
                    hidden: true,
                    sortable: true
                }, {
                    header: "Denominaci&oacute;n",
                    id: 'expandir',
                    dataIndex: 'denominacion',
                    width: 250,
                    sortable: true,
                    renderer: MostrarImagenTipoElemento
                }, {
                    header: "Fecha de Emisi&oacute;n",
                    dataIndex: 'fechainicio',
                    width: 125,
                    sortable: true
                }, {
                    header: "Fecha de Cumplimiento",
                    dataIndex: 'fechafin',
                    width: 135,
                    sortable: true
                }, {
                    header: "Fechas de Control",
                    dataIndex: 'fechascontrol',
                    width: 150,
                    sortable: true,
                    renderer: MostrarTodosLosDatos
                }, {
                    header: "Estado de cumplimiento",
                    dataIndex: 'textocumplimiento',
                    width: 150,
                    hidden: true,
                    sortable: true,
                    renderer: MostrarImagenEstadoCumplimiento
                }, {
                    header: "% de cumplimiento",
                    dataIndex: 'gradocumplimiento',
                    width: 120,
                    hidden: true,
                    aling: 'center',
                    sortable: true,
                    renderer: function (a) {
                        return a + ' %'
                    }
                }, {
                    header: "Observaciones",
                    hidden: true,
                    dataIndex: 'observaciones',
                    width: 90,
                    sortable: true,
                    renderer: MostrarImagenT
                }, {
                    header: "Autor",
                    dataIndex: 'nombreautor',
                    width: 150,
                    sortable: true,
                    renderer: function (val) {
                        return val;
                    }
                }
            ],
            tbar: [_this.btnAdicionarAcuerdos_GA,'-',_this.btnEliminarAcuerdos_GA]
        });


        /*******************************
         **********************************/

        /********************
         * Panel pie de firma acta de trabajo.
         * *********************************/

        _this.storePiedeFirma_GA = new Ext.data.SimpleStore({
            fields: [{
                name:'cargo',
                name:'nombre',
                name:'apellidos',
                name:'piefirma'
            }],
            data: []
        });

        // modo de seleccion del  grid listado de indicadores
        _this.smPiedeFirma_GA = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false,
            listeners: {
                // rowselect: function (sm, indiceFila, record) {
                //
                // },
                // rowdeselect: function (sm, indiceFila, record) {
                // },
                selectionchange:function(sm){
                    _this.btnEliminarPiedeFirma_GA.setDisabled(sm.getSelections().length==0);
                }
            }
        });

        _this.btnAdicionarPiedeFirma_GA = new Ext.Button({
            handler: function () {
                _this.gridEditorPiedeFirma_GA.stopEditing();
                _this.storePiedeFirma_GA.add(new Ext.data.Record({
                    cargo:'',
                    nombre:'',
                    apellidos:'',
                    area:''
                }));
                _this.gridEditorPiedeFirma_GA.startEditing(0, 0);
            },
            disabled: false,
            iconCls: 'adicionar',
            tooltip: 'Adicionar pie de firma',
            key: {
                alt: true,
                key: 'I'
            },
            scope: this
        });

        _this.btnEliminarPiedeFirma_GA = new Ext.Button({
            handler: function () {
                var seleccion =_this.gridEditorPiedeFirma_GA.getSelectionModel().getSelections();
                if (seleccion.length == 1) {
                    mensajeconfirmacion = 'El pie de firma ha sido eliminado satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar la fila seleccionada?';
                    mensajemascara = 'Eliminando pie de firma...';
                } else {
                    mensajeconfirmacion = 'Los pie de firma han sido eliminados satisfactoriamente.';
                    mensaje = ' ¿Est&aacute; seguro que desea eliminar las filas seleccionadas?';
                    mensajemascara = 'Eliminando pie de firma...';
                }
                mostrarMensaje(2, mensaje, function (btnoprimido) {
                    if (btnoprimido == 'ok') {
                        _this.BarraProgreso.show(mensajemascara);
                        _this.gridEditorPiedeFirma_GA.stopEditing();
                        if(seleccion.length>0){
                            var recordDelete=_this.gridEditorPiedeFirma_GA.getSelectionModel().getSelections();
                            for (var i=0; i < recordDelete.length; i++){
                                _this.storePiedeFirma_GA.remove(recordDelete[i]);
                            }

                        }
                        _this.gridEditorPiedeFirma_GA.startEditing(0, 0);
                        _this.gridEditorPiedeFirma_GA.getSelectionModel().clearSelections();
                        _this.BarraProgreso.hide();
                        mostrarMensaje(1, mensajeconfirmacion);
                    }
                });
            },
            disabled: true,
            iconCls: 'eliminar',
            tooltip: 'Eliminar pie de firma',
            key: {
                key: Ext.EventObject.DELETE
            },
            scope: this
        });


        //grid editor para listado de indicadores
        _this.gridEditorPiedeFirma_GA = new Ext.grid.EditorGridPanel({
            store: _this.storePiedeFirma_GA,
            stripeRows: true,
            title:"Pie de firma",
            height: 300,
            sm: _this.smPiedeFirma_GA,
            clicksToEdit: 2,
            margins: '3 3 3 3',
            columns: [_this.smPiedeFirma_GA,
                // {
                //     hidden: true,
                //     hideable: false,
                //     dataIndex: 'id'
                // },
                {
                    header: "Cargo",
                    dataIndex: 'cargo',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Nombre",
                    dataIndex: 'nombre',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Apellidos",
                    dataIndex: 'apellidos',
                    width: 200,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                },{
                    header: "Firma",
                    dataIndex: 'piefirma',
                    width: 150,
                    sortable: true,
                    editor: new Ext.form.TextField({
                        allowBlank: false,
                        maskRe: /^([a-zA-Z0-9áéíóúüÁÉÍÓÚñÑÜ"' ,._/:-])$/,
                        regex: _this.ObjValidaciones.expresionRegular('denominacion')
                    })
                }
            ],
            tbar: [_this.btnAdicionarPiedeFirma_GA,'-',_this.btnEliminarPiedeFirma_GA]
        });


        /*******************************
         **********************************/



        _this.tabPanel_GA = new Ext.TabPanel({
            region    : 'south',
            margins   : '3 3 3 0',
            activeTab : 0,
            height:300,
            defaults  : {
                autoScroll : true
            },
            items     : [_this.gridEditorDirige_GA,
                         _this.gridEditorAsistentes_GA,
                {
                    xtype: 'panel',
                    title: 'Orden del día',
                    id: 'panelordendeldia',
                    layout: 'fit',
                    height: 300,
                    items: [_this.heordendeldia]
                },
                _this.gridAcuerdos_GA,
                _this.gridEditorPiedeFirma_GA
            ]
        });



        _this.btnCancelar_GA = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.window_GA.destroy();
            }
        });

        _this.btnAceptar_GA = new Ext.Button({
            iconCls: 'aceptar ',
            text: 'Aceptar',
            tooltip: 'Generar acta y cerrar ventana',
            handler: function () {
                var formato = _this.cbformatreporte_GA.getValue();
                _this.visualizar_GA(formato);
            }
        });


        _this.window_GA = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            plain    : true,
            layout   : 'border',
            title: 'Generar Acta',
            width: 860,
            height: 560,
            resizable: false,
            items: [_this.panelLogo_GA,_this.form_GA, _this.tabPanel_GA],
            buttons: [_this.btnCancelar_GA, _this.btnAceptar_GA],
            listeners: {
                beforeshow: function(win) {
                    _this.tffecha_GA.setValue(new Date().format('d/m/Y'));
                }
            }
        });

        _this.window_GA.show();


    };


    this.visualizar_GA = function (formato) {
        if (_this.form_GA.getForm().isValid()) {
            switch (formato) {
                case 'vp':
                    var mensaje = 'Generando vista previa';
                    break;
                default:
                    var mensaje = 'Generando documento';
            }
            _this.BarraProgreso.show(mensaje);

            var titulo = _this.tftitulo_GA.getValue();
            var organismo = _this.tforganismo_GA.getValue();
            var numero = _this.tfnumero_GA.getValue();
            var fecha = _this.tffecha_GA.getRawValue();
            var hora = _this.tfhora_GA.getValue();
            var lugar = _this.tflugar_GA.getValue();

            var ordendeldia=_this.heordendeldia.getValue();

            var dirigentes = [];
            var arrayrecords=_this.storeDirige_GA.data.items;
            for (var i=0; i < arrayrecords.length; i++){
                var elementoseleccionado = {};
                elementoseleccionado = {
                    cargo: arrayrecords[i].data.cargo,
                    nombre: arrayrecords[i].data.nombre,
                    apellidos: arrayrecords[i].data.apellidos
                }
                dirigentes.push(elementoseleccionado);
            }

            var asistentes = [];
            var arrayrecords=_this.storeAsistentes_GA.data.items;
            for (var i=0; i < arrayrecords.length; i++){
                var elementoseleccionado = {};
                elementoseleccionado = {
                    cargo: arrayrecords[i].data.cargo,
                    nombre: arrayrecords[i].data.nombre,
                    apellidos: arrayrecords[i].data.apellidos,
                    area: arrayrecords[i].data.area
                }
                asistentes.push(elementoseleccionado);
            }

            var acuerdos = [];
            var arrayrecords=_this.storeAcuerdos_GA.data.items;
            for (var i=0; i < arrayrecords.length; i++){
                var elementoseleccionado = {};
                elementoseleccionado = {
                    idelemento: arrayrecords[i].data.idelemento,
                    denominacion: arrayrecords[i].data.denominacion,
                    activo: arrayrecords[i].data.activo,
                    fechainicio: arrayrecords[i].data.fechainicio,
                    fechafin: arrayrecords[i].data.fechafin,
                    fechascontrol: arrayrecords[i].data.fechascontrol,
                    estadocumplimiento: arrayrecords[i].data.estadocumplimiento,
                    gradocumplimiento: arrayrecords[i].data.gradocumplimiento,
                    observaciones: arrayrecords[i].data.observaciones,
                    textocumplimiento: arrayrecords[i].data.textocumplimiento,
                    modificar: arrayrecords[i].data.modificar,
                    eliminar: arrayrecords[i].data.eliminar,
                    cantrelacdescorigen1: arrayrecords[i].data.cantrelacdescorigen1,
                    tipoelemento: 2,
                    autorelemento: arrayrecords[i].data.nombreautor,
                    _parent: arrayrecords[i].data._parent,
                    _is_leaf: arrayrecords[i].data._is_leaf,
                    superior: arrayrecords[i].data.superior,
                    subordinado: arrayrecords[i].data.subordinado,
                    idautor: arrayrecords[i].data.idautor
                };
                acuerdos.push(elementoseleccionado);
            }

            var piedefirma = [];
            var arrayrecords=_this.storePiedeFirma_GA.data.items;
            for (var i=0; i < arrayrecords.length; i++){
                var elementoseleccionado = {};
                elementoseleccionado = {
                    cargo: arrayrecords[i].data.cargo,
                    nombre: arrayrecords[i].data.nombre,
                    apellidos: arrayrecords[i].data.apellidos,
                    piefirma: arrayrecords[i].data.piefirma
                }
                piedefirma.push(elementoseleccionado);
            }

            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/generarActaTrabajoFip',
                params: {
                    logo:Ext.encode(_this.Img_GA.getValue()),
                    titulo: titulo,
                    organismo: organismo,
                    numero: numero,
                    fecha: fecha,
                    hora: hora,
                    lugar: lugar,
                    idopcion: formato,
                    ordendeldia: ordendeldia,
                    dirigentes:Ext.encode(dirigentes),
                    asistentes:Ext.encode(asistentes),
                    acuerdos:Ext.encode(acuerdos),
                    piedefirma:Ext.encode(piedefirma)
                },
                callback: function (options, success, response) {
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


    this.actalizarImagen = function(imgName, width, height) {

        _this.tplImagen_GA = new Ext.Template(
            '<center>',
            '<div id="{id}" class="x-box x-box-blue x-screenshotfield-bwrap" style="position: relative; width: {widthP}; height: {heightP};">' +
            '<div class="x-box-tl">' +
            '<div class="x-box-tr">' +
            '<div class="x-box-tc"></div>' +
            '</div>' +
            '</div>' +
            '<div class="x-box-ml">' +
            '<div class="x-box-mr">' +
            '<div class="x-screenshotfield-wrap" style="width: {width}; height: {height};">' +
            '<img class="x-screenshotfield" width="{width}" height="{height}" src="{dir}">' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="x-box-bl">' +
            '<div class="x-box-br">' +
            '<div class="x-box-bc"></div>' +
            '</div>' +
            '</div>' +
            '<center>'
        );

        if (_this.pImg_GA.rendered) {
            var width = width || _this.pImg_GA.getBox().width;
            var height = height || _this.pImg_GA.getBox().height;
            var dirImagen = _this.fotoDefault_GA;

            _this.tplImagen_GA.overwrite(_this.pImg_GA.body, {
                //id: this.getId(),
                dir: dirImagen,
                width: width - 20 + 'px',
                widthP: width + 'px',
                heightP: height + 'px',
                height: height - 20 + 'px'
            });
        }

        _this.tplImagen_GA.compile();
    };

    this.searchRapida = function () {
        _this.cb_operador_fecha_emision = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Rango de fecha emisi&oacute;n',
            store: _this.store_operador_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_operador_fecha_emision',
            name: 'cb_operador_fecha_emision',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.cb_operador_fecha_cumplimiento = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Rango de fecha de cumplimiento',
            store: _this.store_operador_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_operador_fecha_cumplimiento',
            name: 'cb_operador_fecha_cumplimiento',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.f_emision_searchRapida = new Ext.form.DateField({
            fieldLabel: 'Fecha de emisi&oacute;n',
            format: 'd/m/Y',
            name: 'f_emision_searchRapida',
            id: 'f_emision_searchRapida',
            //value: new Date().format('d/m/Y'),
            emptyText: 'Seleccione',
            endDateField: 'f_cumplimiento_searchRapida',
            allowBlank: true,
            vtype: 'daterange',
            anchor: '95%',
            // labelWidth:50,
            menuListeners: {
                select: function (df, date) {
                    _this.f_emision_searchRapida.setValue(date);
                }
            }
        });
        _this.f_cumplimiento_searchRapida = new Ext.form.DateField({
            fieldLabel: 'Fecha de cumplimiento',
            format: 'd/m/Y',
            name: 'f_cumplimiento_searchRapida',
            id: 'f_cumplimiento_searchRapida',
            startDateField: 'f_emision_searchRapida',
            //value: new Date().format('d/m/Y'),
            emptyText: 'Seleccione',
            vtype: 'daterange',
            anchor: '95%',
            // labelWidth:50,
            menuListeners: {
                select: function (df, date) {
                    _this.f_cumplimiento_searchRapida.setValue(date);
                }
            }
        });


        // Combo de seleccionar tipo actividad de aprobacion para busqueda rapida
        _this.tooltipTipo_Fip_seachRapida;

        _this.cb_tipo_fip_seachRapida = new Ext.form.ComboBox({
            fieldLabel: 'Tipo fip',
            store: _this.store_tipo_fip_searchrapida,
            valueField: 'idtipo',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            allowBlank: false,
            editable: false,
            loadingText: 'Cargando datos...',
            forceSelection: true,
            mode: 'remote',
            // listWidth:200,
            emptyText: 'Seleccione...',
            anchor: '95%',
            listeners: {
                select: function (c, r, i) {
                    if (_this.tooltipTipo_Fip_seachRapida)
                        _this.tooltipTipo_Fip_seachRapida.destroy();
                    if (_this.cb_tipo_fip_seachRapida.getValue() && _this.cb_tipo_fip_seachRapida.getRawValue().length > 20) {
                        _this.tooltipTipo_Fip_seachRapida = new Ext.ToolTip({
                            target: c.getEl(),
                            html: _this.cb_tipo_fip_seachRapida.getRawValue()
                        });
                    }
                },
                expand: function (combo) {
                    _this.store_tipo_fip_searchrapida.reload();
                }
            }
        });

        // Combo de seleccionar estado de cumplimiento para busqueda rapida

        _this.cb_estado_cumpl_seachRapida = new Ext.form.ComboBox({
            hiddenName: '',
            fieldLabel: 'Estado de cumplimiento',
            store: _this.store_estado_cumplimiento_searchrapida,
            valueField: 'id',
            displayField: 'den',
            // labelWidth:10,
            hiddenName: 'id',
            typeAhead: true,
            mode: 'local',
            forceSelection: true,
            triggerAction: 'all',
            id: 'cb_estado_cumpl_seachRapida',
            name: 'cb_estado_cumpl_seachRapida',
            emptyText: 'Seleccionar',
            selectOnFocus: true,
            anchor: '95%'
        });

        _this.formSearchRapida = new Ext.FormPanel({
            labelAlign: 'top',
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            width: 600,
            items: [{
                layout: 'column',
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    items: [_this.cb_operador_fecha_emision,
                        _this.cb_operador_fecha_cumplimiento,
                        _this.cb_tipo_fip_seachRapida
                    ]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    items: [_this.f_emision_searchRapida,
                        _this.f_cumplimiento_searchRapida,
                        _this.cb_estado_cumpl_seachRapida
                    ]
                }]
            }]
        });


        _this.btnCancelarSearchRapida = new Ext.Button({
            iconCls: 'cancelar',
            text: 'Cancelar',
            tooltip: 'Cerrar ventana sin guardar los datos',
            handler: function () {
                _this.windowSearchRapida.destroy();
            }
        });

        _this.btnLimpiarSearchRapida = new Ext.Button({
            iconCls: 'limpiar',
            text: 'Limpiar',
            tooltip: 'Limpiar filtro(s)',
            handler: function () {
                _this.stTGCmpFips.baseParams.tipofip=null;
                _this.formSearchRapida.getForm().reset();
                _this.objclasificadorinvol.ResetearArbolesBusqueda();
                _this.smTGCmpFips.clearSelections();
                _this.stTGCmpFips.baseParams.arrayautores = '';
                _this.stTGCmpFips.baseParams.arrayinvolucrados = '';
                _this.ftCmpFIP.clearFilters();
                _this.objclasificadorinvol.verificarAutoresInvolBusqueda = false;
                _this.btnBusquedaSimple.disable();
            }
        });

        _this.btnAceptarwindowSearchRapida = new Ext.Button({
            iconCls: 'buscar',
            text: 'Buscar',
            tooltip: 'Buscar datos y cerrar ventana',
            handler: function () {

                if (_this.cb_operador_fecha_emision.getValue() != "" && _this.f_emision_searchRapida.getValue() != null) {
                    var fi = _this.f_emision_searchRapida.getRawValue().split('/')[2] + "-" +
                        _this.f_emision_searchRapida.getRawValue().split('/')[1] + "-" +
                        _this.f_emision_searchRapida.getRawValue().split('/')[0];
                    var dt_ini = new Date(fi);
                    dt_ini.setDate(dt_ini.getDate() + 1);

                    if (_this.cb_operador_fecha_emision.getValue() == "gt") {
                        _this.ftCmpFIP.filters.items[2].dates.after.menu.picker.setValue(dt_ini);
                        _this.ftCmpFIP.filters.items[2].active = true;
                        _this.ftCmpFIP.filters.items[2].dates.after.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_emision.getValue() == "lt") {
                        _this.ftCmpFIP.filters.items[2].dates.before.menu.picker.setValue(dt_ini);
                        _this.ftCmpFIP.filters.items[2].active = true;
                        _this.ftCmpFIP.filters.items[2].dates.before.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_emision.getValue() == "eq") {
                        _this.ftCmpFIP.filters.items[2].dates.on.menu.picker.setValue(dt_ini);
                        _this.ftCmpFIP.filters.items[2].active = true;
                        _this.ftCmpFIP.filters.items[2].dates.on.setChecked(true);
                    }

                }


                if (_this.cb_operador_fecha_cumplimiento.getValue() != "" && _this.f_cumplimiento_searchRapida.getValue() != null) {
                    var ff = _this.f_cumplimiento_searchRapida.getRawValue().split('/')[2] + "-" +
                        _this.f_cumplimiento_searchRapida.getRawValue().split('/')[1] + "-" +
                        _this.f_cumplimiento_searchRapida.getRawValue().split('/')[0];
                    var dt_fin = new Date(ff);
                    dt_fin.setDate(dt_fin.getDate() + 1);
                    if (_this.cb_operador_fecha_cumplimiento.getValue() == "gt") {
                        _this.ftCmpFIP.filters.items[3].dates.after.menu.picker.setValue(dt_fin);
                        _this.ftCmpFIP.filters.items[3].active = true;
                        _this.ftCmpFIP.filters.items[3].dates.after.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_cumplimiento.getValue() == "lt") {
                        _this.ftCmpFIP.filters.items[3].dates.before.menu.picker.setValue(dt_fin);
                        _this.ftCmpFIP.filters.items[3].active = true;
                        _this.ftCmpFIP.filters.items[3].dates.before.setChecked(true);
                    }

                    if (_this.cb_operador_fecha_cumplimiento.getValue() == "eq") {
                        _this.ftCmpFIP.filters.items[3].dates.on.menu.picker.setValue(dt_fin);
                        _this.ftCmpFIP.filters.items[3].active = true;
                        _this.ftCmpFIP.filters.items[3].dates.on.setChecked(true);
                    }

                }

                if (_this.cb_tipo_fip_seachRapida.getValue() != "") {
                    _this.stTGCmpFips.baseParams.tipofip  = _this.cb_tipo_fip_seachRapida.getValue();

                }

                if (_this.cb_estado_cumpl_seachRapida.getValue() != "") {
                    _this.ftCmpFIP.filters.items[6].active = true;
                    _this.ftCmpFIP.filters.items[6].setValue(_this.cb_estado_cumpl_seachRapida.getValue());
                    console.log(_this.cb_estado_cumpl_seachRapida.getValue(), _this.cb_estado_cumpl_seachRapida.getValue())
                }

                _this.stTGCmpFips.reload();

                _this.windowSearchRapida.destroy();
            }
        });
        _this.windowSearchRapida = new Ext.Window({
            modal: true,
            closeAction: 'destroy',
            constrain: true,
            layout: 'fit',
            title: 'B&uacute;squeda r&aacute;pida',
            width: 500,
            height: 260,
            resizable: false,
            items: [_this.formSearchRapida],
            buttons: [_this.btnCancelarSearchRapida, _this.btnLimpiarSearchRapida, _this.btnAceptarwindowSearchRapida]
        });

        _this.windowSearchRapida.show();

        var cantActivos = 0;
        var filters_activos = _this.ftCmpFIP.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }

        for (var k = 0; k < cantActivos; k++) {
            if (_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][field]'] == "fechainicio") {
                var date_inicial = new Date(_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_operador_fecha_emision.setValue(_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][comparison]']);
                _this.f_emision_searchRapida.setValue(date_inicial);
            }

            if (_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][field]'] == "fechafin") {
                var date_final = new Date(_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][value]']);
                _this.cb_operador_fecha_cumplimiento.setValue(_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][comparison]']);
                _this.f_cumplimiento_searchRapida.setValue(date_final);
            }

            if (_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][field]'] == "textocumplimiento") {
                _this.cb_estado_cumpl_seachRapida.setValue(_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][value]']);
            }

            // if (_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][field]'] == "tipoactividad") {
            //     var tipo_actividad_load = _this.store_tipo_actividad_searchrapida.getById("" + _this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][value]']);
            //     _this.cb_tipo_actividad_seachRapida.setValue(tipo_actividad_load.id);
            // }
        }

    }

    this.asociarInvolucrados = function () {
        var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucrados();
        var cantinvol = Object.keys(arrayinvolucrados).length;
        if (cantinvol > 0) {
            var msj = (cantinvol > 1) ? 'Asociando involucrados' : 'Asociando involucrado';
            this.BarraProgreso.show(msj);
            Ext.Ajax.request({
                url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/asociarInvolucrados',
                params: {
                    arrayactividadesseleccionadas: Ext.encode(_this.arrayfipseleccionadas),
                    arrayinvolucrados: Ext.encode(arrayinvolucrados)
                },
                callback: function (options, success, response) {
                    _this.BarraProgreso.hide();
                    responseData = Ext.decode(response.responseText);
                    if (responseData.mensaje == 1) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente.');
                    }
                    if (responseData.mensaje == 0) {
                        mostrarMensaje(1, 'Ha ocurrido un error al realizar la asociaci&oacute;n.');
                    }
                    if (responseData.mensaje == 2) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente para las actividades seleccionadas con permiso de escritura.');
                    }
                    if (responseData.mensaje == 3) {
                        mostrarMensaje(1, 'La asociaci&oacute;n se ha realizado satisfactoriamente para la actividad seleccionada con permiso de escritura.');
                    }
                    if (responseData.mensaje == 4) {
                        var cantActvSelec = Object.key(_this.arrayactividadesseleccionadas).length;
                        var msj = (cantActvSelec > 1) ? 'Las actividades seleccionadas no pueden ser modificadas.' : 'Las actividad seleccionada no puede ser modificada.';
                        mostrarMensaje(1, msj);
                    }
                    _this.winAsociarInvolFip.destroy();
                    _this.smTGCmpFips.clearSelections();
                }
            });
        } else
            mostrarMensaje(1, 'Debe seleccionar al menos un involucrado.');
    };


    this.ExpandParent = function (arrayrecord) {
        if (arrayrecord.length > 0) {
            var node = arrayrecord[arrayrecord.length - 1];
            if (node.data._is_leaf == false) {
                _this.stTGCmpFips.reload({
                    params: {
                        anode: node.id,
                        start: 0
                    },
                    callback: function () {
                        _this.stTGCmpFips.collapseNode(node);
                        _this.stTGCmpFips.setNodeLoaded(node, true);
                        _this.stTGCmpFips.expandNode(node);
                        _this.analizados.push(node.id);
                        var aux = [];
                        var pos = 0;
                        for (var k = 0; k < arrayrecord.length; k++)
                            if (arrayrecord[k].id != node.id) {
                                aux[pos] = arrayrecord[k];
                                pos++;
                            }
                        arrayrecord = aux;
                        _this.ExpandParent(arrayrecord);
                    }
                });
            }
        } else {
            _this.ExpandNodesChildrens(_this.smTGCmpFips.getSelections()[0]);
        }

    }

    //Funcion que recarga y expande el nodo.
    this.ExpandNodesChildrens = function (rec) {
        if (rec.data._is_leaf == false) {
            _this.stTGCmpFips.reload({
                params: {
                    anode: rec.id,
                    start: 0
                },
                callback: function () {
                    _this.stTGCmpFips.collapseNode(rec);
                    _this.stTGCmpFips.setNodeLoaded(rec, true);
                    _this.stTGCmpFips.expandNode(rec);
                    _this.ExpandAllChildren(rec);
                }
            });
        }
    }

    this.ExpandAllChildren = function (rec) {
        if (_this.analizados.indexOf("" + rec.id) == -1)
            _this.analizados.push(rec.id);
        for (var i = 0; i < _this.stTGCmpFips.data.items.length; i++)
            if (_this.analizados.indexOf("" + _this.stTGCmpFips.data.items[i].data._parent) != -1 &&
                _this.analizados.indexOf("" + _this.stTGCmpFips.data.items[i].id) == -1) {
                _this.ExpandNodesChildrens(_this.stTGCmpFips.data.items[i]);
            }
    };


    _this.TGCmpFips.getView().getRowClass = function (ri, n) {
        if (ri.data.superior == 1)
            return "superior";
        else
            return "";
    };


    //store para el combo para la busqueda de fips por nivel de acceso
    this.stCmbNivelAcceso = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargarnivelacceso',
        reader: new Ext.data.JsonReader({
            id: 'idnivel',
            root: "data"
        }, [{
            name: 'idnivel'
        }, {
            name: 'denominacion'
        }])
    });
    //combo para la busqueda de fips por nivel de acceso
    this.cbNivelAcceso = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Nivel de acceso al FIP',
        store: _this.stCmbNivelAcceso,
        hiddenName: 'idnivel',
        valueField: 'idnivel',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos...',
        forceSelection: true,
        mode: 'local',
        anchor: '90%',
        listeners: {
            expand: function (combo) {
                _this.stCmbNivelAcceso.reload();
            }
        }
    });

    //store para el combo para la busqueda de fips por tipo
    this.stCmbTipo = new Ext.data.Store({
        url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
        reader: new Ext.data.JsonReader({
            id: 'idtipo',
            root: "data"
        }, [{
            name: 'idtipo'
        }, {
            name: 'denominacion'
        }])
    });
    //combo para la busqueda de fips por tipo
    this.cbbtipo = new Ext.form.ComboBox({
        emptyText: 'Seleccione',
        fieldLabel: 'Tipo de FIP',
        store: _this.stCmbTipo,
        hiddenName: 'idtipo',
        valueField: 'idtipo',
        displayField: 'denominacion',
        triggerAction: 'all',
        editable: true,
        loadingText: 'Cargando datos...',
        forceSelection: true,
        mode: 'local',
        anchor: '95%',
        listeners: {
            expand: function (combo) {
                _this.stCmbTipo.reload();
            }
        }
    });
    this.tpAutoresInvolucrados = _this.objclasificadorinvol.CrearClasificadorInvolBusqueda(tipoelemento = 2, 2);
    this.fppBuscarFips = new Ext.form.FormPanel({
        frame: true,
        layout: 'fit',
        items: [_this.tpAutoresInvolucrados],
        buttons: [_this.btnBusquedaSimple],
        listeners: {
            clientvalidation: function (form, valid) {
                (_this.objclasificadorinvol.verificarAutoresInvolBusqueda) ? _this.btnBusquedaSimple.enable() : _this.btnBusquedaSimple.disable();
            }
        }
    });

    //panel donde se muestran las opciones de busqueda de fips
    this.pBuscarFips = new Ext.Panel({
        title: 'Opciones de b&uacute;squeda',
        layout: 'fit',
        width: 350,
        collapsible: true,
        collapsed: true,
        margins: '3 3 3 3',
        region: 'east',
        items: [_this.fppBuscarFips],
        //buttons: [_this.btnBusquedaSimple],
        listeners: {
            expand: function (p) {
                p.doLayout();
                _this.stCmbNivelAcceso.reload();
                _this.stCmbTipo.reload();
            },
            'show': function (p) {
            }
        }
    });

    //panel principal de la vista
    this.PanPrincipal = new Ext.Panel({
        layout: 'border',
        //title: 'Registro de Factores que Influyen en el Plan (FIP)',
        region: 'center',
        usarKeymap: true,
        botonesKeymap: [_this.btnAdicionar, _this.btnModificar, _this.btnEliminar, _this.btnVer,
            _this.btnActualizarParametros, _this.btnEnviarCorreo,
            _this.btnDesgloce, _this.btnGestObs, _this.btnReorganizar,_this.btnHacerRaiz,
            _this.btnAsociarInvolFip, _this.btnMaxCumplimiento, _this.btnOtroValorCumplimiento, _this.btnExportarActaTrabajo, _this.btnExportarGrid,
            _this.btnPanelBusqueda, /*_this.btnImprimir,*/
            _this.btnExpandirPadre,_this.btnLimpiar, _this.btnConfPerfil, _this.btnAyuda],
        items: [_this.TGCmpFips, _this.pBuscarFips]
    });

    //ventana principal de la vista
    this.WinPrincipal = new Ext.Window({
        layout: 'border',
        title: opcionesConfig.titleWinPrincipal,
        closable: opcionesConfig.closableWinPrincipal,
        graggable: false,
        maximized: opcionesConfig.maxWinPrincipal,
        noTitle: opcionesConfig.maxWinPrincipal,
        modal: true,
        constrain: true,
        width: 1000,
        height: 510,
        items: _this.PanPrincipal,
        buttons: [
            {
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                hidden: opcionesConfig.noUsarCerrarWinP,
                iconCls: 'cerrar',
                handler: function () {
                    _this.WinPrincipal.hide();
                }
            },
            _this.btnSeleccionar
        ]
    });

    //funcion donde se procede a cargar el treegrid con las fips
    this.CargarFips = function () {
        nivelacceso = _this.cbNivelAcceso.getValue();
        tipoact = _this.cbbtipo.getValue();
        if (_this.opcionBusqueda == 1 || _this.opcionBusqueda == 2) {
            _this.busqueda = 1;
            var arrayautores = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
            var arrayinvolucrados = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();
            if (_this.opcionBusqueda == 1) {
                if (_this.tfdenominacionBS.getValue() != ''
                    || _this.fechaInicioBS.getValue() != ''
                    || _this.fechaFinBS.getValue() != ''
                    || _this.tfCAR.getValue() != ''
                    || _this.cbNivelAcceso.getValue() != ''
                    || _this.cbbtipo.getValue() != ''
                    || arrayautores.length > 0
                    || arrayinvolucrados.length > 0) {
                    _this.stTGCmpFips.removeAll();
                    _this.stTGCmpFips.reload({
                        callback: function () {
                            if (_this.stTGCmpFips.getTotalCount() == 0) {
                                mostrarMensaje(1, 'No existen elementos para el criterio de b&uacute;squeda definido.', function () {
                                    _this.opcionBusqueda = 3;
                                    _this.CargarFips();
                                });
                                _this.pBuscarFips.collapse(true);
                            }
                        }
                    });
                } else {
                    mostrarMensaje(1, "Introduzca un criterio de b&uacute;squeda.");
                    return;
                }
            } else {
                _this.stTGCmpFips.removeAll();
                _this.stTGCmpFips.reload({
                    callback: function () {
                        if (_this.stTGCmpFips.getTotalCount() == 0) {
                            mostrarMensaje(1, 'No existen elementos para el criterio de b&uacute;squeda definido.', function () {
                                _this.opcionBusqueda = 3;
                                _this.CargarFips();
                            });
                        }
                    }
                });
            }
        }
        if (_this.opcionBusqueda == 3) {
            _this.objclasificadorinvol.ResetearArbolesBusqueda();
            _this.smTGCmpFips.clearSelections();
            _this.cbNivelAcceso.reset();
            _this.cbbtipo.reset();
            _this.stTGCmpFips.reload({});
        }
        if (_this.opcionBusqueda != 3) {
            _this.opcionBusqueda = 3;
        }
    };

    //funcion donde se procede a cargar la plantilla
    this.CargarCmpFip = function (idelemento, tipoelemento, parentelemento, AccionesAlRelacionar, Fipsreorganizar) {
        _this.AccionesAlRelacionar = AccionesAlRelacionar;
        _this.idelementohijo = idelemento;
        _this.tipoelementohijo = tipoelemento;
        _this.arrayidfipsReorganizar = Fipsreorganizar;
        if (parentelemento == 'padre') {
            _this.idelementopadre = idelemento;
            _this.tipoelementopadre = tipoelemento;
        }
        _this.WinPrincipal.show();
        _this.cargarConfiguracionPerfil(2);
    };

    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    /*this.PostAccionesGestionar = function(mensaje, accion) {
     _this.busqueda = 0;
     switch (mensaje) {
     case 0:
     _this.stTGCmpFips.reload({
     params: {
     anode: null
     }
     });
     break;
     case 1:
     if (_this.eshija == 1) {
     var rec = _this.stTGCmpFips.getById(_this.arrayidfips[0]);
     if (rec.data._is_leaf == true && rec.data._parent == null) {
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: started
     }
     });
     }
     if (rec.data._is_leaf == true && rec.data._parent != null) {
     var recparent = _this.stTGCmpFips.getById(rec.data._parent);
     _this.arrayidfips[0] = rec.data._parent;
     _this.stTGCmpFips.collapseNode(recparent);
     _this.stTGCmpFips.setNodeLoaded(recparent, false);
     _this.stTGCmpFips.expandNode(recparent);
     }
     if (rec.data._is_leaf == false) {
     _this.stTGCmpFips.collapseNode(rec);
     _this.stTGCmpFips.setNodeLoaded(rec, false);
     _this.stTGCmpFips.expandNode(rec);
     }
     } else {
     var rec = _this.stTGCmpFips.getById(_this.arrayidfips[0]);
     if (accion == 'Adicionar') {
     _this.smTGCmpFips.clearSelections();
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: ultimapag
     }
     });
     }
     if (accion == 'Modificar' && rec.data._parent != null) {
     var recparent = _this.stTGCmpFips.getById(rec.data._parent);
     _this.arrayidfips[0] = recparent.data._parent;
     _this.stTGCmpFips.collapseNode(recparent);
     _this.stTGCmpFips.setNodeLoaded(recparent, false);
     _this.stTGCmpFips.expandNode(recparent);
     }
     if (accion == 'Modificar' && rec.data._parent == null) {
     _this.smTGCmpFips.clearSelections();
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: started
     }
     });
     }
     if (accion == 'Eliminar' && rec.data._parent != null) {
     var recparent = _this.stTGCmpFips.getById(rec.data._parent);
     var totalnodoshijos = _this.stTGCmpFips.getNodeChildrenTotalCount(recparent);
     if (totalnodoshijos == 1) {
     if (recparent.data._parent != null) {
     var recabuparent = _this.stTGCmpFips.getById(recparent.data._parent);
     _this.arrayidfips[0] = recabuparent.data.idelemento;
     _this.stTGCmpFips.collapseNode(recabuparent);
     _this.stTGCmpFips.setNodeLoaded(recabuparent, false);
     _this.stTGCmpFips.expandNode(recabuparent);
     } else {
     _this.smTGCmpFips.clearSelections();
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: started
     }
     });
     }
     } else {
     _this.arrayidfips[0] = recparent.data._parent;
     _this.stTGCmpFips.collapseNode(recparent);
     _this.stTGCmpFips.setNodeLoaded(recparent, false);
     _this.stTGCmpFips.expandNode(recparent);
     }
     }
     if (accion == 'Eliminar' && rec.data._parent == null) {
     _this.smTGCmpFips.clearSelections();
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: started
     }
     });
     }
     }
     break;
     default:
     _this.smTGCmpFips.clearSelections();
     _this.stTGCmpFips.reload({
     params: {
     anode: null,
     start: started
     }
     });
     }
     };*/


		this.actualizarParametros = function () {

				//campo para la fecha de inicio del fip
				_this.femision_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de emisi&oacute;n',
						id: 'femision_actParams',
						endDateField: ['fcumplimiento_actParams', 'fcumplio_actParams'],
						allowBlank: false,
						maxText: 'La fecha de emisión tiene que ser anterior o igual a la fecha de cumplimiento.',
						vtype: 'rangfechas',
						format: 'd/m/Y',
						anchor: '95%',
						menuListeners: {
								select: function(df, date) {
										this.setValue(date);
										_this.fcumplimiento_actParams.setMinValue(date);
										if (date > _this.fcumplimiento_actParams.getValue()) {
												_this.fcumplimiento_actParams.setValue(date);
										}
								}
						}
				});

				//campo para la fecha de fin del fip
				_this.fcumplimiento_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha de cumplimiento',
						id: 'fcumplimiento_actParams',
						vtype: 'rangfechas',
						startDateField: ['femision_actParams'],
						format: 'd/m/Y',
						allowBlank: false,
						minText: 'La fecha de cumplimiento tiene que ser posterior o igual a la fecha de emisión.',
						invalidText: 'El formato establecido: dd/mm/aaaa.',
						anchor: '95%',
						menuListeners: {
								select: function(df, date) {
										this.setValue(date);
										_this.femision_actParams.setMaxValue(date);
								}
						}
				});

				//campo para la fecha de fin del fip
				_this.fcumplio_actParams = new Ext.form.DateField({
						fieldLabel: 'Fecha en que se cumpli&oacute; ',
						id: 'fcumplio_actParams',
						vtype: 'rangfechas',
						startDateField: ['femision_actParams'],
						format: 'd/m/Y',
						allowBlank: true,
						invalidText: 'El formato establecido: dd/mm/aaaa.',
						anchor: '95%',
						menuListeners: {
								select: function(df, date) {
										this.setValue(date);
								}
						}
				});


				// Combo de seleccionar categoria para busqueda rapida
				_this.tooltipTipo_actParams;

				//store para el combo para la busqueda de fips por tipo
				_this.stCmbTipo_actParams = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargartiposfip',
						autoLoad: true,
						reader: new Ext.data.JsonReader({
								id: 'idtipo',
								root: "data"
						}, [{
								name: 'idtipo'
						}, {
								name: 'denominacion'
						}])
				});


				//combo para la busqueda de fips por tipo
				_this.cbbtipo_actParams = new Ext.form.ComboBox({
						emptyText: 'Seleccione',
						fieldLabel: 'Tipo de FIP',
						store: _this.stCmbTipo_actParams,
						hiddenName: 'idtipo',
						valueField: 'idtipo',
						displayField: 'denominacion',
						triggerAction: 'all',
						editable: true,
						loadingText: 'Cargando datos',
						forceSelection: true,
						mode: 'local',
						anchor: '95%',
						listeners: {
								select: function (c, r, i) {
										if (_this.tooltipTipo_actParams)
												_this.tooltipTipo_actParams.destroy();
										if (_this.cbbtipo_actParams.getValue() && _this.cbbtipo_actParams.getRawValue().length > 20) {
												_this.tooltipTipo_actParams = new Ext.ToolTip({
														target: c.getEl(),
														html: _this.cbbtipo_actParams.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.stCmbTipo_actParams.reload();
								}
						}
				});


				_this.tooltipNivelAcceso_actParams;
				//store para el combo para la busqueda de fips por nivel de acceso
				_this.stCmbNivelAcceso_actParams = new Ext.data.Store({
						url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/cargarnivelacceso',
						autoLoad: true,
						reader: new Ext.data.JsonReader({
								id: 'idnivel',
								root: "data"
						}, [{
								name: 'idnivel'
						}, {
								name: 'denominacion'
						}])
				});
				//combo para la busqueda de fips por nivel de acceso
				_this.cbNivelAcceso_actParams = new Ext.form.ComboBox({
						emptyText: 'Seleccione',
						fieldLabel: 'Nivel de acceso al FIP',
						store: _this.stCmbNivelAcceso_actParams,
						hiddenName: 'idnivel',
						valueField: 'idnivel',
						displayField: 'denominacion',
						triggerAction: 'all',
						editable: true,
						loadingText: 'Cargando datos',
						forceSelection: true,
						mode: 'local',
						anchor: '95%',
						listeners: {
								select: function (c, r, i) {
										if (_this.tooltipNivelAcceso_actParams)
												_this.tooltipNivelAcceso_actParams.destroy();
										if (_this.cbNivelAcceso_actParams.getValue() && _this.cbNivelAcceso_actParams.getRawValue().length > 20) {
												_this.tooltipNivelAcceso_actParams = new Ext.ToolTip({
														target: c.getEl(),
														html: _this.cbNivelAcceso_actParams.getRawValue()
												});
										}
								},
								expand: function (combo) {
										_this.stCmbNivelAcceso_actParams.reload();
								}
						}
				});

				_this.form_actParams = new Ext.FormPanel({
						labelAlign: 'top',
						frame: true,
						bodyStyle: 'padding:5px 5px 0',
						width: 600,
						items: [{
								layout: 'column',
								items: [{
										columnWidth: .5,
										layout: 'form',
										items: [
												_this.femision_actParams,
												_this.fcumplio_actParams,
												_this.cbNivelAcceso_actParams
										]
								}, {
										columnWidth: .5,
										layout: 'form',
										items: [
												_this.fcumplimiento_actParams,
												_this.cbbtipo_actParams
										]
								}]
						}],
						listeners: {
								'clientvalidation': function (fm, valid) {
										// if (valid) {
										// 		_this.btnAceptarwindow_actParams.enable();
										// } else {
										// 		_this.btnAceptarwindow_actParams.disable();
										// }
								}
						}
				});


				_this.btnCancelar_actParams = new Ext.Button({
						iconCls: 'cancelar',
						text: 'Cancelar',
						tooltip: 'Cerrar ventana sin guardar los datos',
						handler: function () {
								_this.window_actParams.destroy();
						}
				});

				_this.btnAceptarwindow_actParams = new Ext.Button({
						iconCls: 'aceptar ',
						text: 'Guardar',
						tooltip: 'Guardar datos y cerrar ventana',
						handler: function () {
								if(_this.validarParametros()){
										var waitMsg = 'Guardando datos del FIP seleccionado';
										var respuesta= 'Se han actualizado los parámetros del FIP seleccionado';
										if(_this.arrayidfips.length>1){
												waitMsg = 'Guardando datos de los FIPs seleccionados';
												respuesta= 'Se han actualizado los parámetros de los FIPs seleccionados';
										}
										_this.BarraProgreso.show(waitMsg);
										_this.form_actParams.getForm().submit({
												url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/actualizarParametros',
												params: {
														idtipo: _this.cbbtipo_actParams.getValue(),
														denomtipo: _this.cbbtipo_actParams.getRawValue(),
														idnivel: _this.cbNivelAcceso_actParams.getValue(),
														denomnivel: _this.cbNivelAcceso_actParams.getRawValue(),
														arrayidfips: Ext.encode(_this.arrayidfips)
												},
												failure: function (form, action) {
														if (action.result.mensaje > 0) {
																mostrarMensaje(1, respuesta);
																_this.window_actParams.destroy();
																_this.BarraProgreso.hide();
																_this.smTGCmpFips.clearSelections();
																_this.stTGCmpFips.reload({
																		params: {
																				anode: null,
																				start: _this.start
																		}
																});
														}else{
																_this.BarraProgreso.hide();
																mostrarMensaje(1, 'Error al guardar la información');
														}

												}

										});
								}
						}
				});

				_this.window_actParams = new Ext.Window({
						modal: true,
						closeAction: 'destroy',
						constrain: true,
						layout: 'fit',
						title: 'Actualizar párametros comunes',
						width: 500,
						height: 300,
						resizable: false,
						items: [_this.form_actParams],
						buttons: [_this.btnCancelar_actParams, _this.btnAceptarwindow_actParams],
						listeners: {
								beforeshow: function(win) {
										_this.femision_actParams.setValue(new Date().format('d/m/Y'));
										_this.fcumplimiento_actParams.setValue(new Date().format('d/m/Y'));
								}
						}
				});

				_this.window_actParams.show();
		};

		this.validarParametros = function () {
				if(_this.femision_actParams.getValue()=="" &&
						_this.fcumplio_actParams.getValue()=="" &&
						_this.fcumplimiento_actParams.getValue()=="" &&
						_this.cbbtipo_actParams.getValue()=="" &&
						_this.cbNivelAcceso_actParams.getValue()==""){
						mostrarMensaje(1, 'Debe cambiar algún parámetro');
						return false;
				}
				return true;
		};

    this.enviarCorreo = function () {
        var mensaje="¿Desea notificar a los usuarios involucrados sobre los fip(s) seleccionados?";
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show("Enviando correo");
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/enviarCorreo',
                    params: {
                        arrayidfips: Ext.encode(_this.arrayidfips)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if(responseData.mensaje != -1){
                            // mostrarMensaje(1, responseData.notice);
                            mostrarMensaje(4, "No se ha generado la notificacion por correo.",'',responseData.error);
                        }else if(responseData.mensaje == 1){
                            mostrarMensaje(1, responseData.notice);
                        }
                    }
                });
            }
        });

    };


    //funcion donde se procede a disparar post-aciones luego de adicionar/modificar/eliminar
    this.PostAccionesGestionar = function (mensaje, accion) {
        _this.busqueda = 0;
        switch (mensaje) {
            case 0:
                _this.stTGCmpFips.reload({
                    params: {
                        anode: null,
                        start: _this.start
                    }
                });
                break;
            case 1:
                var rec = _this.stTGCmpFips.getById(_this.arrayidfips[0]);
                _this.rowIndex = _this.stTGCmpFips.find('idelemento', _this.arrayidfips[0]);
                if (accion == 'Adicionar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpFips.getById(rec.data._parent);
                            _this.smTGCmpFips.selectRecords([recparent]);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else if (accion == 'Modificar' || accion == 'Duplicar') {

                    if (rec.data._parent != null) {
                        var recparent = _this.stTGCmpFips.getById(rec.data._parent);
                        _this.smTGCmpFips.selectRecords([recparent]);
                        _this.RecargarNodo(recparent.id, 0, recparent);
                    } else
                        _this.PaginaActual(null);

                } else if (accion == 'Eliminar') {
                    var totalseleccionados = _this.smTGCmpFips.getCount();
                    if (_this.start != 0)
                        _this.posteliminar = true;
                    if (totalseleccionados > 1) {
                        _this.PaginaActual(null);
                    } else {
                        if (rec.data._parent == null) {
                            _this.PaginaActual(null);
                        } else {
                            var recparent = _this.stTGCmpFips.getById(rec.data._parent);
                            _this.smTGCmpFips.selectRecords([recparent]);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                    }
                } else if (accion == 'Cancelar-Cerrar') {
                    if (_this.eshija == 1) {
                        if (rec.data._is_leaf && rec.data._parent == null) {
                            _this.PaginaActual(null);
                        }
                        if (rec.data._is_leaf && rec.data._parent != null) {
                            var recparent = _this.stTGCmpFips.getById(rec.data._parent);
                            _this.RecargarNodo(recparent.id, 0, recparent);
                        }
                        if (!rec.data._is_leaf) {
                            _this.RecargarNodo(rec.id, 0, rec);
                        }
                    } else
                        _this.UltimaPagina();
                } else {

                }
                break;
            default:
                _this.PaginaActual(null);
        }
        //_this.objCrudFip.objcmprelaciones.arrayelementosrelacionados = [];
    };
    //Funcion que recarga y exande el nodo.
    this.RecargarNodo = function (anode, start, rec) {
        _this.stTGCmpFips.reload({
            params: {
                anode: anode,
                start: start
            },
            callback: function () {
                _this.stTGCmpFips.collapseNode(rec);
                _this.stTGCmpFips.setNodeLoaded(rec, false);
                _this.stTGCmpFips.expandNode(rec);

                //_this.TGCmpFips.getView().focusRow(_this.rowIndex /*+ parseInt(_this.TGCmpFips.view.el.getHeight() / 29)*/);
            }
        });
    };
    //Funcion que recarga la pagina actual. Si no hay elementos listados regarga la pagina anterior.
    this.PaginaActual = function (anode) {
        _this.smTGCmpFips.clearSelections();
        _this.start = (_this.ptbTGCmpFips.getPageData().activePage - 1) * (_this.ptbTGCmpFips.cbPageSize.getValue());
        _this.stTGCmpFips.reload({
            params: {
                anode: anode,
                start: _this.start
            },
            callback: function () {
                if (_this.stTGCmpFips.getCount() == 0 && _this.start != 0) {
                    _this.start = _this.start - _this.ptbTGCmpFips.cbPageSize.getValue();
                    _this.stTGCmpFips.reload({
                        params: {
                            anode: anode,
                            start: _this.start
                        }
                    });
                }
            }
        });
    };

    this.UltimaPagina = function () {
        _this.smTGCmpFips.clearSelections();
        var numentero = Math.floor(_this.stTGCmpFips.getTotalCount() / _this.ptbTGCmpFips.cbPageSize.getValue());
        _this.start = numentero * _this.ptbTGCmpFips.cbPageSize.getValue();
        _this.stTGCmpFips.reload({
            params: {
                anode: null,
                start: _this.start
            }
        });
    };

    this.AccionesPostEjecutarFT = function () {
        _this.arrayidfips = [];
        _this.stTGCmpFips.reload({});
        _this.ActualizarEstadoBarraHerramientas();
    };

    this.ActualizarEstadoBarraHerramientas = function () {
        _this.arrayidfips = [];
        _this.arraynombreFip = [];
        _this.arrayfipseleccionadas = [];
        _this.btnModificar.disable();
        _this.btnEnviarCorreo.disable();
        _this.btnFechaControl.disable();
        _this.btnSeleccionar.disable();
        _this.btnExportar.disable();
        _this.btnEliminar.disable();
        _this.btnActualizarParametros.disable();
        _this.btnVer.disable();
        _this.btnDuplicar.disable();
        _this.btnDesgloce.disable();
        _this.btnGestObs.disable();
        _this.btnReorganizar.disable();
        _this.btnHacerRaiz.disable();
        _this.btnAsociarInvolFip.disable();
        _this.btnMaxCumplimiento.disable();
        _this.btnOtroValorCumplimiento.disable();
        _this.btnExpandirPadre.disable();
        _this.permitirmodificar = 0;
        _this.permitireliminar = 0;
        _this.estarelacionado=false;
        if (_this.smTGCmpFips.hasSelection()) {
            var arrayrecords = _this.smTGCmpFips.getSelections();
            var totalrecords = arrayrecords.length;
            _this.btnExportar.enable();
            (totalrecords <= 1) ? _this.btnAdicionar.enable() : _this.btnAdicionar.disable();
            if (totalrecords > 0) {
                var puedemodificar = 1;
                var puedeeliminar = 1;
                for (var i = 0; i < totalrecords; i++) {
                    if (arrayrecords[i].data.modificar == 0) {
                        puedemodificar = 0;
                    }
                    if (arrayrecords[i].data.eliminar == 0) {
                        puedeeliminar = 0;
                    }

                    if(!_this.estarelacionado)
                       _this.estarelacionado = (arrayrecords[i].data.cantrelacdescorigen1=="1")?true:false;

                    _this.arrayidfips[i] = arrayrecords[i].data.idelemento;
                    _this.ultimoElemenSelec = arrayrecords[i].data.idelemento;
                    _this.arraynombreFip[i] = arrayrecords[i].data.denominacion;
                    var elementoseleccionado = {};
                    elementoseleccionado = {
                        idelemento: arrayrecords[i].data.idelemento,
                        denominacion: arrayrecords[i].data.denominacion,
                        activo: arrayrecords[i].data.activo,
                        fechainicio: arrayrecords[i].data.fechainicio,
                        fechafin: arrayrecords[i].data.fechafin,
                        fechascontrol: arrayrecords[i].data.fechascontrol,
                        estadocumplimiento: arrayrecords[i].data.estadocumplimiento,
                        gradocumplimiento: arrayrecords[i].data.gradocumplimiento,
                        observaciones: arrayrecords[i].data.observaciones,
                        textocumplimiento: arrayrecords[i].data.textocumplimiento,
                        modificar: arrayrecords[i].data.modificar,
                        eliminar: arrayrecords[i].data.eliminar,
                        cantrelacdescorigen1: arrayrecords[i].data.cantrelacdescorigen1,
                        tipoelemento: 2,
                        autorelemento: arrayrecords[i].data.nombreautor,
                        _parent: arrayrecords[i].data._parent,
                        _is_leaf: arrayrecords[i].data._is_leaf,
                        superior: arrayrecords[i].data.superior,
                        subordinado: arrayrecords[i].data.subordinado,
                        idautor: arrayrecords[i].data.idautor
                    };
                    _this.arrayfipseleccionadas.push(elementoseleccionado);
                }
                if (totalrecords == 1) {
                    _this.btnGestObs.enable();
                    _this.btnDesgloce.enable();
                    _this.btnVer.enable();
                    _this.btnDuplicar.enable();
                }
                if (puedemodificar == 1 && totalrecords == 1) {
                    _this.btnModificar.enable();
                    _this.btnFechaControl.enable();
                    _this.permitirmodificar = 1;
                }
                if (puedeeliminar == 1) {
                    _this.btnEliminar.enable();
                    _this.btnActualizarParametros.enable();
                    _this.permitireliminar = 1;
                }
                if (totalrecords > 0) {
                    _this.btnSeleccionar.enable();
                    _this.btnReorganizar.enable();
                    _this.btnHacerRaiz.enable();
                    _this.btnAsociarInvolFip.enable();
                    _this.btnEnviarCorreo.enable();

                    if(_this.estarelacionado){
                        _this.btnMaxCumplimiento.disable();
                        _this.btnOtroValorCumplimiento.disable();
                    }else{
                        _this.btnMaxCumplimiento.enable();
                        _this.btnOtroValorCumplimiento.enable();
                    }
                    _this.btnExpandirPadre.enable();
                }
            }
        }
        var arrayautoresbusq = _this.objclasificadorinvol.ObtenerAutoresBusqueda();
        var arrayinvolucradosbusq = _this.objclasificadorinvol.ObtenerInvolucradosBusqueda();

    };

    //funcion que se encarga de contruir la ventana con el desgloce del fip
    this.ConstruirWinDesgloce = function () {
        if (_this.WinDesgloce) {
            _this.WinDesgloce.destroy();
        }
        //arbol con los elementos del desgloce
        _this.tpdesglose = new Ext.tree.TreePanel({
            autoScroll: true,
            bbar: [
                '-', 'Leyenda: ', ' ',
                {
                    text: 'Plan',
                    iconCls: 'folder',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'ARC',
                    iconCls: 'gestionardocumentosporsubsistema',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Objetivo',
                    iconCls: 'archivo',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Criterio',
                    iconCls: 'unidadmedida',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Actividad',
                    iconCls: 'actividades',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'FIP',
                    iconCls: 'ficha',
                    disabled: true,
                    disabledClass: ''
                }, ' ', ' ', ' ', ' ',
                {
                    text: 'Desviación',
                    iconCls: 'conflicto',
                    disabled: true,
                    disabledClass: ''
                },
                '-'
            ],
            split: false,
            useArrows: true,
            width: 200,
            height: 200,
            root: {
                text: _this.arraynombreFip[0],
                expanded: true,
                idtipoelemento: '2',
                trinomio: 0,
                idfip: _this.arrayidfips[0],
                iconCls: 'fip',
                idelemento: _this.arrayidfips[0]
            },
            loader: new Ext.tree.TreeLoader({
                dataUrl: '/planificacion/pdo/plan/index.php/cmpgestionarfip/desglozarfip',
                listeners: {
                    'beforeload': function (atreeloader, anode) {
                        atreeloader.baseParams = {
                            idelemento: anode.attributes.idelemento,
                            idplan: anode.attributes.idelemento,
                            idarc: anode.attributes.idarc,
                            idfip: anode.attributes.idfip,
                            trinomio: anode.attributes.trinomio,
                            idtipoelemento: anode.attributes.idtipoelemento
                        };
                    }
                }
            }),
            contextMenu: new Ext.menu.Menu({
                items: [{
                    id: 'detalles',
                    text: '<b>Mostrar detalles</b> ',
                    itemCls: 'x-menu-item icondistra-ver',
                    iconCls: 'imagen-none',
                    tooltip: 'Mostrar detalles'
                }],
                listeners: {
                    itemclick: function (item) {
                        switch (item.id) {
                            case 'detalles':
                                var n = item.parentMenu.contextNode;
                                _this.CrearVentanaDetalles(n);
                                break;
                        }
                    }
                }
            }),
            listeners: {
                contextmenu: function (node, e) {
                    if (node.attributes.idtipoelemento != 0) {
                        node.select();
                        var c = node.getOwnerTree().contextMenu;
                        c.contextNode = node;
                        c.showAt(e.getXY());
                    }
                }
            }
        });
        //ventana que carga el arbol donde se mostrara el desgloce del objetivo
        _this.WinDesgloce = new Ext.Window({
            maximizable: true,
            modal: true,
            closeAction: 'hide',
            constrain: true,
            layout: 'fit',
            title: 'Desglose del FIP: ' + _this.arraynombreFip[0],
            width: 620,
            height: 400,
            items: _this.tpdesglose,
            buttons: [{
                iconCls: 'cerrar',
                text: 'Cerrar',
                tooltip: 'Cerrar ventana',
                handler: function () {
                    _this.WinDesgloce.destroy();
                }
            }]
        });
        _this.WinDesgloce.show();
    };

    //funcion que muestra los detalles del desgloce
    this.CrearVentanaDetalles = function (n) {
        var idtipoelemento = n.attributes.idtipoelemento;
        switch (idtipoelemento) {
            case 1:
                var arrayidobjetivos = [];
                arrayidobjetivos[0] = n.attributes.idelemento;
                var eshija = 0;
                var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
                objCrudObjetivo.CrearWinCrudObjetivos(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'), 'Ver datos del', function () {
                    }, arrayidobjetivos, null, eshija, permisomodificar = 1, permisoeliminar = 1,
                    arrayelementosrelacionadosinicial = []);
                break;
            case '2':
                var arrayidfips = [];
                arrayidfips[0] = n.attributes.idelemento;
                var eshija = 0;
                var objCrudFip = new Utilidades.Cmp.Cmpcrudfip();
                objCrudFip.CrearWinCrudFips(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'), 'Ver datos del', function () {
                    }, arrayidfips, null, _this.eshija, permisomodificar = 1, permisoeliminar = 1);
                break;
            case 3:
                var arrayidactividades = [];
                arrayidactividades[0] = n.attributes.idelemento;
                var eshija = 0;
                var objCrudActividad = new Utilidades.Cmp.Cmpcrudactividades();
                objCrudActividad.CrearWinCrudActividades(
                    new Date().format('d/m/Y'), new Date().format('d/m/Y'), '8:00 AM',
                    '5:00 PM', 'Ver datos de la', function () {
                    }, arrayidactividades, null, eshija, permisomodificar = 1, permisoeliminar = 1,
                    arrayelementosrelacionadosinicial = []);
                break;
            case 4:
                var objCrudObjetivo = new Utilidades.Cmp.Cmpcrudobjetivos();
                objCrudObjetivo.arrayidcriterios = [];
                objCrudObjetivo.arrayidcriterios[0] = n.attributes.idelemento;
                objCrudObjetivo.CrearWinCriterio(
                    'Ver datos del', new Date().format('d/m/Y'), new Date().format('d/m/Y'));
                break;
        }
    };

    //funcion a ejecutarse para relacionar el o los objetivos seleccionados con otros elementos
    this.RelacionarElementos = function () {
        if (opcionesConfig.reordenarHijos == true) {
            _this.AccionesAlReordenar(opcionesConfig.arraysubfips, _this.arrayfipseleccionadas, _this.WinPrincipal);
        }else if (opcionesConfig.acuerdos_GA != null) {
            _this.seleccionarAcuerdo_GA(opcionesConfig.arraysubfips, _this.arrayfipseleccionadas, _this.WinPrincipal);
        }
        else{
            _this.AccionesAlRelacionar(_this.arrayfipseleccionadas, _this.WinPrincipal);
        }

    };

    this.seleccionarAcuerdo_GA = function (arraysubfips, arrayfipseleccionadas, WinPrincipal) {
        WinPrincipal.destroy();
        _this.arrayidfipsReorganizar = [];
        _this.AccionesAlRelacionar(arrayfipseleccionadas);
    };

    this.AccionesAlReordenar = function (arraysubfips, arrayfipseleccionadas, WinPrincipal) {
        var mensaje = '', mensajemascara = '', mensajeconfirmacion = '', mensajeconfirmacion2 = '';
        if (arraysubfips.length == 1) {
            mensajeconfirmacion = 'El sub-fip ha sido reordenado satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar el sub-fip seleccionado?';
            mensajemascara = 'Reorganizando sub-fip';
            mensajeconfirmacion2 = 'No se ha podido reordenar el sub-fip seleccionado.';
        } else {
            mensajeconfirmacion = 'Los sub-fips han sido reordenados satisfactoriamente.';
            mensaje = ' ¿Est&aacute; seguro que quiere reorganizar los sub-fips seleccionados?';
            mensajemascara = 'Reorganizando sub-fips';
            mensajeconfirmacion2 = 'No se han podido reordenar los sub-fips seleccionados.';
        }
        mostrarMensaje(2, mensaje, function (btnoprimido) {
            if (btnoprimido == 'ok') {
                _this.BarraProgreso.show(mensajemascara);
                Ext.Ajax.request({
                    url: '/planificacion/pdo/plan/index.php/cmpgestionarfip/reorganizarfips',
                    params: {
                        arraysubfips: Ext.encode(arraysubfips),
                        arrayfipseleccionadas: Ext.encode(arrayfipseleccionadas)
                    },
                    callback: function (options, success, response) {
                        _this.BarraProgreso.hide();
                        responseData = Ext.decode(response.responseText);
                        if (responseData.mensaje == 1) {
                            mostrarMensaje(1, mensajeconfirmacion);
                            WinPrincipal.destroy();
                            _this.arrayidfipsReorganizar = [];
                            _this.AccionesAlRelacionar();
                        }
                        if (responseData.mensaje == 0) {
                            mostrarMensaje(1, mensajeconfirmacion2, function () {
                                WinPrincipal.destroy();
                                _this.arrayidfipsReorganizar = [];
                                _this.AccionesAlRelacionar();
                            });
                        }
                    }
                });
            }
        });
    };

    //funcion para mostrar el icono "activo"
    function MostrarImagenActivo(valor) {
        if (valor == 0) {
            return '<center><span><img src="../../../comun/recursos/images/fam/desactivo.png" ></span></center>';
        } else {
            return '<center><span><img src="../../../comun/recursos/images/fam/activo.png" ></span></center>';
        }
    }

    //funcion para realizar la carga por defecto
    this.cargarConfiguracionPerfil = function (tipoelemento, idcargaspordefecto) {
        _this.BarraProgreso.show('Cargando factores que influyen en el plan');
        Ext.Ajax.request({
            url: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/getConfiguracionPerfil',
            params: {
                idconfiguracion: 2,
                idtipoelemento: tipoelemento,
                idcargapordefecto: idcargaspordefecto
            },
            callback: function (options, success, response) {
                //esto es lo ke hizo ariel
                _this.BarraProgreso.hide();
                responseData = Ext.decode(response.responseText);
                if (responseData.ejecutar) {
                    if (responseData.fechainicio != null && responseData.fechainicio != 'undefined') {
                        var dt = new Date(responseData.fechainicio);
                        _this.ftCmpFIP.filters.items[2].dates.after.menu.picker.setValue(dt);
                        _this.ftCmpFIP.filters.items[2].active = true;
                    }
                    if (responseData.fechafin != null && responseData.fechafin != 'undefined') {
                        var dt = new Date(responseData.fechafin);
                        _this.ftCmpFIP.filters.items[3].dates.before.menu.picker.setValue(dt);
                        _this.ftCmpFIP.filters.items[3].active = true;

                    }
                    if (_this.ftCmpFIP.filters.items[3].active === true
                        && _this.ftCmpFIP.filters.items[2].active === true) {
                        _this.ftCmpFIP.filters.items[2].dates.after.setChecked(true);
                        _this.ftCmpFIP.filters.items[3].dates.before.setChecked(true);
                    } else if (_this.ftCmpFIP.filters.items[3].active === true) {
                        _this.ftCmpFIP.filters.items[3].dates.before.setChecked(true);
                    } else if (_this.ftCmpFIP.filters.items[2].active === true) {
                        _this.ftCmpFIP.filters.items[2].dates.after.setChecked(true);
                    }
                    /*if (responseData.estadoaprobacion != null && responseData.estadoaprobacion != 'undefined' && _this.stestados.getCount() != 0) {
                     _this.ftCmpFIP.filters.items[5].active = true;
                     _this.ftCmpFIP.filters.items[5].setValue(responseData.estadoaprobacion);
                     }*/
                    if (responseData.porcientocumplimiento != null && responseData.porcientocumplimiento != 'undefined') {
                        _this.ftCmpFIP.filters.items[5].active = true;
                        if (responseData.igual == 1) {
                            _this.ftCmpFIP.filters.items[5].menu.fields.eq.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.mayor == 1) {
                            _this.ftCmpFIP.filters.items[5].menu.fields.gt.setValue(responseData.porcientocumplimiento);
                        }
                        if (responseData.menor == 1) {
                            _this.ftCmpFIP.filters.items[5].menu.fields.lt.setValue(responseData.porcientocumplimiento);
                        }
                    }
                    _this.stTGCmpFips.reload();
                    /* if (_this.ftCmpFIP.filters.items[5].active !== true)
                     _this.stTGCmpFips.reload();*/
                } else {
                    _this.stTGCmpFips.reload();
                }
            }
        });
    };

    //funcion para mostrar el icono "tipo de elemento"
    function MostrarImagenTipoElemento(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        //return '<span><img src="../../../comun/recursos/images/fam/books_open.gif" >' + ' ' + valor + '</span>';
        return '<span class="icondistra-ficha sipac-azul">' + ' ' + _this.searchView(valor) + '</span>';
    }

    //funcion para mostrar tooltip con todos los datos de la columna "fechas de control"
    function MostrarTodosLosDatos(valor, m) {
        m.attr = 'ext:qtip="<b>' + valor + '</b>"';
        return valor;
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function MostrarImagenEstadoCumplimiento(val, b, c) {
        val3 = c.data.gradocumplimiento * 1;
        if (val3 == 0) {
            return '<span class="icondistra-bandera sipac-roja">' + ' ' + val + '</span>';
        }
        if (val3 > 0 && val3 < 95) {
            return '<span class="icondistra-bandera sipac-amarilla">' + ' ' + val + '</span>';
        }
        if (val3 >= 95) {
            return '<span class="icondistra-bandera sipac-verde">' + ' ' + val + '</span>';
        }
    }

    //funcion para mostrar el icono "estado de cumplimiento"
    function renderFecha(val) {
        if (val) {
            return (val.substring(8, 10) + '/' + val.substring(5, 7) + '/' + val.substring(0, 4));
        }
    }

    function MostrarImagenT(val) {
        if (val == 0) {
            return ' ';
        }
        if (val > 0) {
            return '<center><span class="icondistra-validaryaceptar sipac-verde"></span></center>';
        }
    }

    //funcion para cambiarle el titulo al grid de FIP cuando filtre
    this.changeTitleFIP = function () {
        var filtrado_por = "";
        var sep = "/";
        if (_this.ftCmpFIP.getFiltrosActivos() == undefined || _this.ftCmpFIP.getFiltrosActivos().length == 0) {
            //_this.PanPrincipal.setTitle('Registro de Factores que Influyen en el Plan (FIP)');
        } else {
            for (i = 0; i < _this.ftCmpFIP.getFiltrosActivos().length; i++) {
                var aux = "";
                if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "denominacion") {
                    aux = 'Denominaci&oacute;n';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "idelemento") {
                    aux = 'CAR';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "fechainicio") {
                    aux = 'Fecha de Emisi&oacute;n';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "fechafin") {
                    aux = 'Fecha de Cumplimiento';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "nombreautor") {
                    aux = 'Autor';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "textocumplimiento") {
                    aux = 'Estado de cumplimiento';
                } else if (_this.ftCmpFIP.getFiltrosActivos()[i].dataIndex == "gradocumplimiento") {
                    aux = 'Porciento de cumplimiento';
                } else {
                    aux = 'Observ.';
                }
                if (i == _this.ftCmpFIP.getFiltrosActivos().length - 1) {
                    sep = "";
                }
                filtrado_por += aux + sep;
            }
            //_this.PanPrincipal.setTitle('Registro de Factores que Influyen en el Plan (FIP) <i>- Filtrado por: ' + filtrado_por + '</i>');
            filtrado_por = "";
        }
    }

    this.searchView = function (val) {
        var cantActivos = 0;
        var criterio = "";
        var filters_activos = _this.ftCmpFIP.filters.items;
        for (var i = 0; i < filters_activos.length; i++) {
            if (filters_activos[i].active) {
                cantActivos++;
            }
        }
        for (var k = 0; k < cantActivos; k++) {
            if (_this.stTGCmpFips.lastOptions.params['filtros[' + k + '][field]'] == "denominacion") {
                criterio = _this.stTGCmpFips.lastOptions.params['filtros[' + k + '][data][value]'];
                break;
            }
        }
        if (criterio.trim().length > 0) {
            var startPosition = val.toLowerCase().indexOf(criterio.toLowerCase());
            var endPosition = startPosition + criterio.length;

            var respuesta = "";
            for (var i = 0; i < val.length; i++) {
                if (startPosition != -1 && i >= startPosition && i < endPosition) {
                    respuesta += '<span style="color:black; font-weight:bold; background-color: yellow;">' + val[i] + '</span>';
                } else {
                    respuesta += val[i];
                }
            }
        }
        else
            respuesta = val;
        return respuesta;
    }

    this.mostrarTodosNodosExpandidos = function () {
        var arrayrecords = [];
        _this.smTGCmpFips.selectAll();
        for (var i = 0; i < _this.smTGCmpFips.getSelections().length; i++)
            if (!_this.smTGCmpFips.getSelections()[i].data._is_leaf)
                arrayrecords.push(_this.smTGCmpFips.getSelections()[i]);
        _this.analizados = [];
        _this.posiciones = [];
        _this.ExpandParent(arrayrecords);

    }

    this.ExpandParent = function (arrayrecord) {
        if (arrayrecord.length > 0) {
            var node = arrayrecord[arrayrecord.length - 1];
            if (node.data._is_leaf == false) {
                _this.stTGCmpFips.reload({
                    params: {
                        anode: node.id,
                        start: 0
                    },
                    callback: function () {
                        _this.stTGCmpFips.collapseNode(node);
                        _this.stTGCmpFips.setNodeLoaded(node, true);
                        _this.stTGCmpFips.expandNode(node);
                        _this.analizados.push(node.id);
                        var aux = [];
                        var pos = 0;
                        for (var k = 0; k < arrayrecord.length; k++)
                            if (arrayrecord[k].id != node.id) {
                                aux[pos] = arrayrecord[k];
                                pos++;
                            }
                        arrayrecord = aux;
                        _this.ExpandParent(arrayrecord);
                    }
                });
            }
        } else {
            _this.ExpandNodesChildrens(_this.smTGCmpFips.getSelections()[0]);
        }

    }

    //Funcion que recarga y expande el nodo.
    this.ExpandNodesChildrens = function (rec) {
        if (rec.data._is_leaf == false) {
            _this.stTGCmpFips.reload({
                params: {
                    anode: rec.id,
                    start: 0
                },
                callback: function () {
                    _this.stTGCmpFips.collapseNode(rec);
                    _this.stTGCmpFips.setNodeLoaded(rec, true);
                    _this.stTGCmpFips.expandNode(rec);
                    _this.ExpandAllChildren(rec);
                }
            });
        }
    }

    this.ExpandAllChildren = function (rec) {
        if (_this.analizados.indexOf("" + rec.id) == -1)
            _this.analizados.push(rec.id);
        for (var i = 0; i < _this.stTGCmpFips.data.items.length; i++)
            if (_this.analizados.indexOf("" + _this.stTGCmpFips.data.items[i].data._parent) != -1 &&
                _this.analizados.indexOf("" + _this.stTGCmpFips.data.items[i].id) == -1) {
                _this.ExpandNodesChildrens(_this.stTGCmpFips.data.items[i]);
            }
    };

    this.ConstruirWinFechasControl = function (estamodificando, idelemento, AccionPostGestionarFechasControl) {

        _this.pfechascontrol = _this.objfechascontrol.ConstruirPanelFechasControl(1, _this.arrayidfips[0], _this.AccionPostGestionarFechasControl, 'adicionarfechas');

        _this.WinFechasControl = new Ext.Window({
            width: 500,
            height: 300,
            //closable: false,
            //resizable: false,
            modal: true,
            layout: 'fit',
            //constrain: true,
            items: [_this.pfechascontrol],
            buttons: [
                {
                    iconCls: 'cerrar',
                    text: 'Cerrar',
                    tooltip: 'Cerrar ventana',
                    handler: function () {
                        _this.WinFechasControl.destroy();
                    }
                }
            ]
        });

        _this.WinFechasControl.show();

    }

};

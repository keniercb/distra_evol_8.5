Ext.ns('Go.Validator.VTypes');
Go.Validator.VTypes = {
		registrar : function (name, config)
		{
				if (name) {
						if (config && (config.regExp || config.fnValidar) && config.mensaje) {
								var vtype = {};
								vtype[name] = function (val, field)
								{
										if (config.regExp instanceof RegExp) {
												if (config.regExp.test(val) && val.match(config.regExp)) {
														return true;
												} else {
														return false;
												}
										} else {
												if (config.fnValidar) {
														return config.fnValidar(val, field);
												}
										}
								}
								vtype[name + 'Text'] = config.mensaje;
								if (config.mask && config.mask instanceof RegExp) {
										vtype[name + 'Mask'] = config.mask;
								}
								Ext.apply(Ext.form.VTypes, vtype);
						}
				}
		},
		setMensaje: function (name, mensaje)
		{
				Ext.form.VTypes[name + "Text"] = mensaje;
		}
};
/////-----VTYPES-----//////
Go.Validator.VTypes.registrar('vtsalario', {regExp: /^([0-9]{6})([.][0-9]{2})?$/, mensaje: "Solo números de hasta 6 digitos y el caracter especial (.)."});
Go.Validator.VTypes.registrar('vtusername', {regExp: /^([a-zA-ZáéíóúñÑ ]+ ?[a-zA-ZáéíóúñÑ ]*)+[^;]*$/, mensaje: "Solo admite letras."});
Go.Validator.VTypes.registrar('vtelefonos', {regExp: /^(\([0-9]{3}\))?([0-9]{3})([-]?)([0-9]{4})([,][ ]?([0-9]{2}\))?([0-9]{3})([-]?)([0-9]{4})){0,2}$/, mensaje: "Este campo debe ser un teléfono con el formato <b>'(011)123-4567' - '(011)1234567' - '012-3456' - '0123456'</b> separados por coma <b>(,)</b>.Solo se admiten hasta 3 teléfonos."});
Go.Validator.VTypes.registrar('vtalfanumerico', {regExp: /^([a-zA-Z0-9áéíóúñüÑ])+$/, mensaje: "Solo admite caracteres alfanuméricos."});
Go.Validator.VTypes.registrar('vtdirip', {regExp: /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){2}(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5]))$/, mensaje: "Este campo debe ser una direcci&#243;n ip con el formato 255.255.255.255"});
Go.Validator.VTypes.registrar('vtarchivo', {regExp: /^[a-zA-Z0-9]+[^\\\/:"<>\?\|;.\*]*$/, mensaje: "Solo admite caracteres alfanuméricos y signos, excepto (/.:*?<>;)."});
Go.Validator.VTypes.registrar('vtarchivootro', {regExp: /^[a-zA-Z0-9]+[^\\\/:"<>\?\|;\*]*$/, mensaje: "Solo admite caracteres alfanuméricos excepto (/:*?<>;)"});
Go.Validator.VTypes.registrar('vtdescripcion', {regExp: /^[^ ][^\\\\\\\\"<>]*([ ][^\\\\\\\\"<>])*[^ ]$/, mensaje: 'Solo admite caracteres alfanuméricos excepto (\\"<>'});
Go.Validator.VTypes.registrar('vtcorreo', {regExp: /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, mensaje: "Este campo debe ser una dirección de correo electrónico con el formato 'usuario@dominio.ext'."});
Go.Validator.VTypes.registrar('vtnumero', {regExp: /^(-?\d{1,2})([.]\d{1,2})?$/, mensaje: "Solo admite números enteros entre -99.99 y 99.99 .Con 2 cifras decimales."});
Go.Validator.VTypes.registrar('vtnumeroReales', {regExp: /^[0-9]+$/, mensaje: "Solo admite números reales."});
Go.Validator.VTypes.registrar('vtnumero4dig', {regExp: /^-?\d*$/, mensaje: "Solo admite números enteros de hasta 4 dígitos."});
Go.Validator.VTypes.registrar('vtcodigo', {regExp: /^(([0-9]{4,5})|([0-9]{9})|([0-9]{3}(\.|\-)[0-9](\.)[0-9]{5}))$/, mensaje: "Solo admite caracteres numericos con los formatos siguientes: <br>(<b>XXXX</b>) (<b>XXXXX</b>) ((<b>XXXXXXXXX</b>) ó (<b>XXX.X.XXXXX</b> separados por <b>. </b>(opcional)."});
Go.Validator.VTypes.registrar('vtcodigoN', {regExp: /^((\d{4,5})|(\d{9})|(\d{3}(\.|\-)\d(\.)\d{5}))$/, mensaje: "Solo admite números enteros con los formatos siguientes: <br>(<b>XXXX</b>) (<b>XXXXX</b>) ((<b>XXXXXXXXX</b>) ó (<b>XXX.X.XXXXX</b> separados por <b>.</b> ó <b>-</b>) opcionales."});
Go.Validator.VTypes.registrar('vtnombre', {regExp: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*)+$/, mensaje: "Solo admite letras."});
Go.Validator.VTypes.registrar('vtabrev', {regExp: /^([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+ ?[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]*)+$/, mensaje: "Solo admite caracteres alfanuméricos."});
Go.Validator.VTypes.registrar('vtalfanumericos', {regExp: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+ ?([a-zA-ZáéíóÁÉÍÓÚúñÑ\d\_\s]*))$/, mensaje: "Solo admite caracteres alfanuméricos."});
Go.Validator.VTypes.registrar('vtletrasycomas', {regExp: /^([a-zA-ZáéíóúñÑ]+ ?[a-zA-ZáéíóúñÑ\,\;]*)+$/, mensaje: "Solo admite letras seguido de los caracteres especiales (,;)."});
Go.Validator.VTypes.registrar('vtalfanumericosguiones', {regExp: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))$/, mensaje: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."});
Go.Validator.VTypes.registrar('vtdenominaciones', {regExp: /^(([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ()+-/_\\]+)([ \_\+\-]([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ()+-/_\\]+))*)$/, mensaje: "Solo admite caracteres alfanuméricos y los caracteres especiales (espacio ()+-_/\\ .)."});
Go.Validator.VTypes.registrar('vtdenomest', {regExp: /^(([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ]+)([ \_\-\.]([a-zA-Z0-9ÁÉÍÓÚáéíóúñüÑ]+))*)$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_.)."});
Go.Validator.VTypes.registrar('vtusuario', {regExp: /(^([a-zA-ZáéíóúñÑ])+([a-zA-ZáéíóúñÑ\d\_\s\-\@\.]*))$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_.@)."});
Go.Validator.VTypes.registrar('vtreferencia', {regExp: /(^([a-zA-ZáéíóúñÑ\/])+([a-zA-ZáéíóúñÑ\d\_\s\-\.\/]*))$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_/.)."});
Go.Validator.VTypes.registrar('vtletrasguion', {regExp: /^([a-zA-ZáéíóúÁÉÍÓÚñÑ ]+ ?[a-zA-ZáéíóúÁÉÍÓÚñÑ\_]*)+$/, mensaje: "Solo admite letras seguido del caracter especial (_)."});
Go.Validator.VTypes.registrar('vtletrasextendido', {regExp: /^([a-zA-ZáéíóúñÑ\d\/])+([a-zA-ZáéíóúñÑ\d\_\s\-\,\:\;\.\/]*)$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_.:;,)."});
Go.Validator.VTypes.registrar('vtletrasextendidos', {regExp: /^([a-zA-ZáéíóúñÑ\d\/])+([a-zA-ZáéíóúñÑ\d\_\s\-\,\:\;\.\(\)\/]*)$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_.:;,())."});
Go.Validator.VTypes.registrar('vtcampo', {regExp: /(^([a-zA-ZáéíóúñÑ])+([a-zA-ZáéíóúñÑ\d\_\s\-\@\.\/\(\)\&]*))$/, mensaje: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_.@ ()&)."});
Go.Validator.VTypes.registrar('vtci', {regExp: /^[0-9]{11}$/, mensaje: "Solo admite caracteres numéricos de hasta 11 dígitos."});
Ext.apply(Ext.form.VTypes, {
		daterange    : function (val, field)
		{
				if (val) {
						var date = field.parseDate(val);
						if (!date) {
								return;
						}
						if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
								var start = Ext.getCmp(field.startDateField);
								start.setMaxValue(date);
								this.dateRangeMax = date;
								start.validate();
						} else {
								if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
										var end = Ext.getCmp(field.endDateField);
										end.setMinValue(date);
										this.dateRangeMin = date;
										end.validate();
								}
						}
						return true;
				}
		},
		password     : function (val, field)
		{
				if (field.initialPassField) {
						var pwd = Ext.getCmp(field.initialPassField);
						return (val == pwd.getValue());
				}
				return true;
		},
		passwordText : 'Las claves de acceso no coinciden.',
		datetimerange: function (val, field)
		{
				if (val) {
						var myDate = (field.dateField && Ext.getCmp(field.dateField)) ? field.dateField : null;
						var timeEval = Date.parseDate(val, field.format);
						if (myDate && Ext.getCmp(myDate) && timeEval) {
								if (field.endTimeField && (!this.dateRangeMin || (timeEval.getTime() != this.dateRangeMin.getTime()))) {
										var endDate = (field.endTimeField && Ext.getCmp(field.endTimeField)) ? Ext.getCmp(field.endTimeField).dateField : null;
										if (endDate && Ext.getCmp(endDate) && Ext.getCmp(endDate).getValue()) {
												var date_fin = Ext.getCmp(endDate).getValue().format('d/m/Y');
												var date_ini = Ext.getCmp(myDate).getValue().format('d/m/Y');
												if (date_ini == date_fin) {
														var endTime = Ext.getCmp(field.endTimeField);
														if (endTime) {
																endTime.setMinValue(timeEval);
																this.dateRangeMin = timeEval;
																endTime.validate();
														}
												}
										}
								} else {
										if (field.startTimeField && (!this.dateRangeMax || (timeEval.getTime() != this.dateRangeMax.getTime()))) {
												var startDate = (field.startTimeField && Ext.getCmp(field.startTimeField)) ? Ext.getCmp(field.startTimeField).dateField : null;
												if (startDate && Ext.getCmp(startDate) && Ext.getCmp(startDate).getValue()) {
														var date_ini = Ext.getCmp(startDate).getValue().format('d/m/Y');
														var date_fin = Ext.getCmp(myDate).getValue().format('d/m/Y');
														if (date_ini == date_fin) {
																var startTime = Ext.getCmp(field.startTimeField);
																if (startTime) {
																		startTime.setMaxValue(timeEval);
																		this.dateRangeMax = timeEval;
																		startTime.validate();
																}
														}
												}
										}
								}
						}
						return true;
				} else {
						if (field.startTimeField) {
								var start1 = Ext.getCmp(field.startTimeField);
								start1.dateRangeMax = false;
								start1.setMaxValue(null);
								start1.validate();
						} else {
								if (field.endTimeField) {
										var end1 = Ext.getCmp(field.endTimeField);
										end1.dateRangeMin = false;
										end1.setMinValue(null);
										end1.validate();
								}
						}
				}
		}
});
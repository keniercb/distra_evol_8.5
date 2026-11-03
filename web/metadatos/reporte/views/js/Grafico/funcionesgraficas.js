var myChart = null;
function graficar(idgrafica, div, data, denConcepto) {
		var variation = false;
		var title = {
				text: ''
		}
		var subtitle = function (text, description) {
				this.text = 'Concepto: <b>' + text + '.</b>';
				if (description != '' && description != null && description != undefined) {
						this.text += '<br>';
						this.text += description;
				}
				this.floating = true, this.align = 'center', this.verticalAlign = 'top', this.y = 15
		}
		var yAxis = {
				title: {text: 'Cantidad'}
		}
		var exporting = {enabled: false}
		var tooltip = {
				valueSuffix: ''
		}
		var credits = {
				text: '',
				href: ''
		}
		switch (idgrafica) {
				case 'grafpie':
						var datosSeries = construirSeriePie(data, denConcepto);
						var brandsData = datosSeries.brandsData;
						var drilldownSeries = datosSeries.drilldownSeries;

						var descrip = '';
						if (!variation) {
								descrip = "<i>Recuperación por cantidades <b>OCUPADAS</b></i>";
						} else {
								descrip = "<i>Recuperación por cantidades <b>PROPUESTAS</b></i>";
								variation = false;
						}
						var chart = {
								type: 'pie',
								renderTo: div,
								plotBackgroundColor: null,
								plotBorderWidth: null,
								plotShadow: false,
								marginTop: 45,
								paddingTop: 30,
								paddingBottom: 10
						};
						var plotOptions =
						{
								series: {
										shadow: false,
										center: ['50%', '50%'],
										allowPointSelect: true,
										dataLabels: {
												enabled: false
										},
										showInLegend: true
								}
						};
						var drillDown = (denConcepto == 'Cargo' || denConcepto == 'Medio') ? {
								series: drilldownSeries
						} : false;
						myChart = new Highcharts.Chart({
								chart: chart,
								title: title,
								subtitle: new subtitle(denConcepto, descrip),
								plotOptions: plotOptions,
								tooltip: {
										pointFormat: '<span style="font-size:11px;color:{point.color}">{series.name}</span>: <b>{point.y:.2f} %</b><br/>'
								},
								series: [
										{
												name: 'Porcentaje',
												colorByPoint: true,
												data: brandsData
										}
								],
								exporting: exporting,
								credits: credits,
								drilldown: drillDown
						});
						break;
				case 'grafbarras':

						var text = [];
						for (var k = 0; k < data.length; k++) {
								text.push((data[k].abreviatura == undefined) ? data[k].denominacion : data[k].abreviatura);
						}
						var xAxis = {
								categories: text,
								labels: {rotation: -45, align: 'right',
										style: {fontSize: '13px', fontFamily: 'Verdana, sans-serif'}}};
						serie = construirSerieColumn(data, denConcepto);

						var plotOptions = {
								column: {
										grouping: false,
										shadow: false,
										borderWidth: 0
								}
						};

						myChart = new Highcharts.Chart({
								chart: {
										renderTo: div,
										type: 'column'
								},
								title: title,
								xAxis: xAxis,
								yAxis: [
										{
												min: 0,
												title: {
														text: denConcepto
												}
										},
										{
												title: {
														text: 'Cantidades (ocupadas)'
												},
												opposite: true
										}
								],
								legend: {
										shadow: false
								},
								tooltip: {
										shared: true
								},
								plotOptions: plotOptions,
								subtitle: new subtitle(denConcepto),
								exporting: exporting,
								series: serie,
								credits: credits
						});
						break;
				case 'graflinearea':
						var categoria = construirCategoriasColumn(data);
						var serie = construirSerieColumn(data, denConcepto);
						var xAxis = {categories: categoria, labels: {rotation: -45, align: 'right', style: {fontSize: '13px',
								fontFamily: 'Verdana, sans-serif'}}};
						var leyenda = (denConcepto == "Cargo") ? {enabled: true} : {enabled: false};
						myChart = new Highcharts.Chart({
								chart: {renderTo: div, type: 'areaspline'},
								title: title,
								subtitle: new subtitle(denConcepto),
								legend: leyenda,
								xAxis: xAxis,
								yAxis: yAxis,
								tooltip: tooltip,
								credits: credits,
								exporting: exporting,
								plotOptions: {
										areaspline: {
												fillOpacity: 0.5
										}
								},
								series: serie
						});
						break;
				case 'graflineal':
						var categoria = construirCategoriasColumn(data);
						var serie = construirSerieColumn(data, denConcepto);
						var xAxis = {categories: categoria, labels: {rotation: -45, align: 'right', style: {fontSize: '13px',
								fontFamily: 'Verdana, sans-serif'}}};
						myChart = new Highcharts.Chart({
								chart: {
										renderTo: div
								},
								title: title,
								subtitle: new subtitle(denConcepto),
								xAxis: xAxis,
								yAxis: yAxis,
								tooltip: tooltip,
								legend: {
										layout: 'vertical',
										align: 'right',
										verticalAlign: 'middle',
										borderWidth: 0
								},
								exporting: exporting,
								series: serie,
								credits: credits
						});
						break;
		}
		function construirSerieColumn(data, denconcepto) {
				var categories = [];
				var cantidad = [];
				var cantidadReal = [];
				for (var k = 0; k < data.length; k++) {
						categories.push(data[k].denominacion);
						cantidad.push(parseInt(data[k].cantidad));
						cantidadReal.push(parseInt(data[k].cantidadreal));
				}
				var serie = [
						{
								name: 'Cantidad',
								color: 'rgba(8,75,201, 0.6)',
								data: cantidad
						}
				];

				if (denconcepto == 'Cargo'|| denconcepto == 'Medio') {
						serie = [
								{
										name: 'Propuestas',
										color: 'rgba(8,75,201, 0.6)',
										data: cantidad
								},
								{
										name: 'Ocupadas',
										color: 'rgba(8,75,201, 1)',
										data: cantidadReal,
										pointPadding: 0.2
								}
						];
				}

				return serie;
		}

		function construirSeriePie(data, denConcepto) {
				var brands = {};
				var brandsData = [];
				var versions = {};
				var drilldownSeries = [];
				var porciento = [];
				var categories = [];
				var cantidad = [];
				var ocupadas = [];
				var total = 0;
				var totalOcupadas = 0;
				for (var k = 0; k < data.length; k++) {
						categories.push(new String(data[k].denominacion));
						cantidad.push(parseInt(data[k].cantidad));
						ocupadas.push(parseInt(data[k].cantidadreal));
						total += parseInt(data[k].cantidad);
						totalOcupadas += parseInt(data[k].cantidadreal);
				}
				var calc = 0;
				variation = totalOcupadas == 0;
				for (var i = 0; i < data.length; i++) {
						if (denConcepto == "Cargo" && totalOcupadas > 0) {
								calc = (cantidad[i] * 100) / total;
								calc = parseFloat(calc.toFixed(2));
						} else {
								calc = cantidad[i] * 100 / total;
								calc = parseFloat(calc.toFixed(2));
						}
						porciento.push(calc);
				}
				$.each(categories, function (i, name) {
						var version, brand = name;
						if (!brands[brand]) {
								brands[brand] = porciento[i]; //=porciento
						}
						if (version !== null) {
								if (!versions[brand]) {
										versions[brand] = [];
								}
								versions[brand].push(['Ocupadas', (ocupadas[i] * 100) / cantidad[i]]);
								versions[brand].push(['Disponibles', ((cantidad[i] - ocupadas[i]) * 100) / cantidad[i]]);
						}
				});
				$.each(brands, function (name, y) {
						brandsData.push({
								name: name,
								y: y,
								drilldown: versions[name] ? name : null
						});
				});
				$.each(versions, function (key, value) {
						drilldownSeries.push({
								name: key,
								id: key,
								data: value
						});
				});
				return {brandsData: brandsData, drilldownSeries: drilldownSeries};
		}

		function construirCategoriasColumn(data) {
				var categoria = [];
				for (var i = 0; i < data.length; i++) {
						var den = (data[i].abreviatura == undefined) ? data[i].denominacion : data[i].abreviatura;
						categoria.push(den);
				}
				return categoria;
		}
}


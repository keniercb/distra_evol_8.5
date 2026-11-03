if (!Ax.ready) {
    var FileLocation = Ax.servicesLocation;
    Ax.includeCss(FileLocation + 'lib/color-picker/spectrum.css');
    Ax.includeCss(FileLocation + 'assets/css/styles.css');

    Ax.includeJs(FileLocation + 'lib/jquery/jquery-' + Ax.Highcharts.jquery.version + '.js', function () {
        Ax.includeHighChart();
        Ax.includeSpectrum();
        Ax.includeMoment();
    });

    Ax.includeMoment = function () {
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/moment/moment.js' : FileLocation + 'lib/moment/moment.js';
        Ax.includeJs(fileLocation);
    };

    Ax.includeHighChart = function () {
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/highcharts.src.js' : FileLocation + 'lib/highcharts/lib/highcharts.js';
        Ax.includeJs(fileLocation, function () {
            Ax.Highcharts.upgrade(function(){
                Ax.includeHighChartModules();
                Ax.includeAxChartFiles();
            });
        });
    };
    Ax.includeHighChartModules = function () {
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/highcharts-3d.src.js' : FileLocation + 'lib/highcharts/lib/highcharts-3d.js';
        Ax.includeJs(fileLocation);
        var fileLocation2 = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/highcharts-more.src.js' : FileLocation + 'lib/highcharts/lib/highcharts-more.js';
        Ax.includeJs(fileLocation2, function () {
            Ax.includeHighChartSubModules();
        });
        var fileLocation3 = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/exporting.src.js' : FileLocation + 'lib/highcharts/lib/modules/exporting.js';
        Ax.includeJs(fileLocation3, function () {
            var fileLocation4 = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/offline-exporting.src.js' : FileLocation + 'lib/highcharts/lib/modules/offline-exporting.js';
            Ax.includeJs(fileLocation4);
        });
    };
    Ax.includeHighChartSubModules = function () {
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/solid-gauge.src.js' : FileLocation + 'lib/highcharts/lib/modules/solid-gauge.js';
        Ax.includeJs(fileLocation);
        fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/funnel.src.js' : FileLocation + 'lib/highcharts/lib/modules/funnel.js';
        Ax.includeJs(fileLocation);
        fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/treemap.src.js' : FileLocation + 'lib/highcharts/lib/modules/treemap.js';
        Ax.includeJs(fileLocation);
    };
    Ax.includeAxChartFiles = function () {
        Ax.includeJs(FileLocation + 'config.js', function () {
            moment.locale(Ax.Charts.chartDefaultOptions.locale)
            Ax.includeJs(FileLocation + 'controllers/chartController.js');
            Ax.includeJs(FileLocation + 'models/chartModel.js');
            Ax.includeJs(FileLocation + 'views/chartView.js');
            Ax.includeJs(FileLocation + 'views/ax-ext-chart.js');
        });
    };
    Ax.includeSpectrum = function () {
        Ax.includeJs(FileLocation + 'lib/color-picker/spectrum.js');
    };
}

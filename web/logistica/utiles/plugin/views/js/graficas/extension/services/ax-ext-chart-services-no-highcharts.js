if (!Ax.ready) {
    var FileLocation = Ax.servicesLocation;
    Ax.includeCss(FileLocation + 'lib/color-picker/spectrum.css');
    Ax.includeCss(FileLocation + 'assets/css/styles.css');

    Ax.includeJs(FileLocation + 'lib/jquery/jquery-' + Ax.Highcharts.jquery.version + '.js', function () {
        Ax.Highcharts.upgrade(function(){
            Ax.includeMoment();
            Ax.includeSpectrum();
            Ax.includeExportModules();
        });
    });

    Ax.includeExportModules = function(){
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/exporting.src.js' : FileLocation + 'lib/highcharts/lib/modules/exporting.js';
        Ax.includeJs(fileLocation, function () {
            var fileLocation1 = Ax.env == 'dev' ? FileLocation + 'lib/highcharts/' + Ax.Highcharts.version + '/lib/modules/offline-exporting.src.js' : FileLocation + 'lib/highcharts/lib/modules/offline-exporting.js';
            Ax.includeJs(fileLocation1);
        });
    }

    Ax.includeMoment = function () {
        var fileLocation = Ax.env == 'dev' ? FileLocation + 'lib/moment/moment.js' : FileLocation + 'lib/moment/moment.js';
        Ax.includeJs(fileLocation, function () {
            Ax.includeAxChartFiles();
        });
    };
    Ax.includeAxChartFiles = function () {
        Ax.includeJs(FileLocation + 'config.js', function () {
            moment.locale(Ax.Charts.chartDefaultOptions.locale);
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

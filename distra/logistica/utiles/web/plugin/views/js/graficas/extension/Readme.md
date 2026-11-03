Componente de graficacion de la Division de Gestion de entidades

Descripcion:
 Componente desarrollado con el objetivo de estandarizar y facilitar el empleo de las graficas. Esta basado en la libreria HighchartJS. Amplia el uso de la libreria mencionada al soportar varios tipos de fuentes de datos, entre las que se encuentran, formato JSON, Ext.data.Store y consultas a realizar sobre la base de datos.

Objetos principales:
   Ax: Es el objeto principal
   Ax.Charts.chartDefaultOptions: Contiene las variables y funciones de configuracion del componente.
   Ax.Charts.Controllers.Chart: Controlador del componente
   Ax.Charts.Models.Chart: Modelo encargado de procesar los datos y la integracion con la vista del componente
   Ax.Charts.Views.Chart: Clase encargada de integrar los diferentes componentes visuales con HighchartsJs

   Integracion con ExtJS
   Ax.Charts.Views.ChartPanel: Panel que contiene la grafica con las funciones para la visualizacion y actualizacion de la misma.
        Funciones:
        - initComponent: Inicializa el componente
            Parametros:
                -config: Configuracion inicial del componente
        - initChartOptions: Inicializa las opciones de la grafica
            Parametros:
                - options: Opciones del componente
        - renderChart: Visualiza la grafica
        - createChart: Crea la instancia del objeto Chart
        - setChartData: Sobreescribe los valores de los datos a mostrar en la grafica
            Parametros:
                -data: Nuevos valores a graficar
        - setChartType: Redefine el tipo de grafica a mostrar
            Parametros:
                -type: Tipo de grafica (area, bar, column, line, pie, scatter, spline, polygon, arearange, areaspline, areasplinerange, funnel, pyramid, waterfall, solidgauge)
        - addChartSerie: Adiciona una serie de datos a representar en la grafica
            Parametros:
                -serie: Serie de datos. es un array con la siguiente estructura:
                    {
                        name: 'test',
                        data: [
                            {a: 'attr1', b: 2},
                            {a: 'attr2', b: 5},
                            {a: 'attr3', b: 1},
                            {a: 'attr4', b: 12}
                        ],
                        color: 'red'
                    }

                    o

                    {
                        name: 'test',
                        data: [['attr1', 1], ['attr2', 10], ['attr3', 5], ['attr4', 2]],
                        color: 'red'
                    }
        - addSerieFromStore: Adiciona una serie de datos partiendo de la base de un Ext.data.Store
            Parametros:
                -store: Ext,data.Store que contiene los datos para la graficacion
        - getLabel: Funcion que retorna los datos de la internacionalizacion
            Parametros:
                -label: Etiqueta de la palabra a mostrar
                -lang: Idioma en el que se mostrara la palabra("en" o "es")El idioma por defecto es "es"(Espannol)
        - setXaxisTitle: Funcion que redefine el titulo del eje "X"
            Parametros:
                -title: Titulo del eje "X"
        - setYayisTitle: Funcion que redefine el titulo del eje "Y"
             Parametros:
                 -title: Titulo del eje "Y"
        - redraw: Funcion que recarga los datos de la grafica y la muestra.

   Ax.Charts.Views.PropertyGrid: Tabla editable con las propiedades principales a administrar dentro de la grafica.(Es decision del desarrollador que componente para el manejo de las propiedades utilizara)
    Funciones:
        -addSourceStore: Adiciona una serie de datos partiendo de la base de un Ext.data.Store
             Parametros:
                -name: Nombre de la fuente de datos
                -store: Ext.data.Store o un objeto que contiene los datos para la graficacion
                -reader: campos del stores que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
        -clearSourceStore: Elimina todas las fuentes de datos
        -addStore: Idem a addSourceStore pero solo para Ext.data.Store como fuentes de datos
        -getLabelFuncion que retorna los datos de la internacionalizacion
             Parametros:
                -label: Etiqueta de la palabra a mostrar
                -lang: Idioma en el que se mostrara la palabra("en" o "es")El idioma por defecto es "es"(Espannol)
        -loadDefaults: Carga los atributos por defecto de la grafica
        -showColorPicker: Visualiza el selector de color de fondo de la grafica
        -initChartOptions: Inicializa las opciones de la grafica
            Parametros:
                - options: Opciones del componente
        -setChartData: Sobreescribe los valores de los datos a mostrar en la grafica
             Parametros:
                 -data: Nuevos valores a graficar
        -getThemeList: Retorna el listado de temas disponibles para aplicar sobre la grafica
        -setChartTheme: Cambia el tema de la grafica
            Parametros:
                -theme: Tema a aplicar(Debe pertenecer a la lista de temas disponibles)
        -getChartTitle: Devuelve el titulo de la grafica
        -setChartTitle: Modifica el titulo de la grafica
            Parametros:
                -title: Titulo de la grafica
        -getXaxisTitle: Devuleve le titulo del eje "X"
        -getYayisTitle: Devuleve le titulo del eje "Y"
        -setXaxisTitle: Mdifica el titulo del Eje "X"
            Parametros:
                -title: Titulo del Eje "X"
        -setYayisTitle: Mdifica el titulo del Eje "Y"
            Parametros:
                -title: Titulo del Eje "Y"
        -setChartType: Redefine el tipo de grafica a mostrar
           Parametros:
               -type: Tipo de grafica (area, bar, column, line, pie, scatter, spline, polygon, arearange, areaspline, areasplinerange, funnel, pyramid, waterfall, solidgauge)
        -reconfigureChart: Recarga las opciones de la grafica
            Parametros:
                -type: Tipo de grafica (area, bar, column, line, pie, scatter, spline, polygon, arearange, areaspline, areasplinerange, funnel, pyramid, waterfall, solidgauge)
                -data: Fuente de datos
                -reader: campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                -rotation: Rotacion 3D de la grafica
        -addSerie: Adiciona una serie de datos a representar en la grafica
           Parametros:
               -serie: Serie de datos. es un array con la siguiente estructura:
                   {
                       name: 'test',
                       data: [
                           {a: 'attr1', b: 2},
                           {a: 'attr2', b: 5},
                           {a: 'attr3', b: 1},
                           {a: 'attr4', b: 12}
                       ],
                       color: 'red'
                   }

                   o

                   {
                       name: 'test',
                       data: [['attr1', 1], ['attr2', 10], ['attr3', 5], ['attr4', 2]],
                       color: 'red'
                   }
        -rotationEnabled: Verifica si el tipo grafica soporta representacion tridimensional
            Parametros:
                -type: Tipo de grafica
        -rotateChart: Aplica visualizacion trimensional a la grafica
            Parametros
                -rotation: Rotacion 3D a aplicar Ej. {x: 10, y: 10, deep: 45}
        -setFillOpacity: Aplica transparencia a las graficas de tipo "area"
            Parametros
                -fillOpacity: Nivel de transparencia(Entre 0 - 1 donde 0 representa la invisibilidad)
        -parseStoreData: Se encarga de leer los datos de la serie
            Parametros:
                -store: Fuente de datos que puede ser un Object, Array o Ext.data.Store
                -reader: campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
        -redraw: Recarga los datos de la grafica y la visualiza
   Ax.Charts.Views.Form: Formulario con las propiedades principales a administrar dentro de la grafica.(Es decision del desarrollador que componente para el manejo de las propiedades utilizara)
        Funciones:
           -addSourceStore: Adiciona una serie de datos partiendo de la base de un Ext.data.Store
                Parametros:
                   -name: Nombre de la fuente de datos
                   -store: Ext.data.Store o un objeto que contiene los datos para la graficacion
                   -reader: campos del stores que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                   -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
           -clearSourceStore: Elimina todas las fuentes de datos
           -addStore: Idem a addSourceStore pero solo para Ext.data.Store como fuentes de datos
           -getLabelFuncion que retorna los datos de la internacionalizacion
                Parametros:
                   -label: Etiqueta de la palabra a mostrar
                   -lang: Idioma en el que se mostrara la palabra("en" o "es")El idioma por defecto es "es"(Espannol)
           -loadDefaults: Carga los atributos por defecto de la grafica
           -showColorPicker: Visualiza el selector de color de fondo de la grafica
           -initChartOptions: Inicializa las opciones de la grafica
               Parametros:
                   - options: Opciones del componente
           -setChartData: Sobreescribe los valores de los datos a mostrar en la grafica
                Parametros:
                    -data: Nuevos valores a graficar
           -getThemeList: Retorna el listado de temas disponibles para aplicar sobre la grafica
           -setChartTheme: Cambia el tema de la grafica
               Parametros:
                   -theme: Tema a aplicar(Debe pertenecer a la lista de temas disponibles)
           -getChartTitle: Devuelve el titulo de la grafica
           -setChartTitle: Modifica el titulo de la grafica
               Parametros:
                   -title: Titulo de la grafica
           -getXaxisTitle: Devuleve le titulo del eje "X"
           -getYayisTitle: Devuleve le titulo del eje "Y"
           -setXaxisTitle: Mdifica el titulo del Eje "X"
               Parametros:
                   -title: Titulo del Eje "X"
           -setYayisTitle: Mdifica el titulo del Eje "Y"
               Parametros:
                   -title: Titulo del Eje "Y"
           -setChartType: Redefine el tipo de grafica a mostrar
              Parametros:
                  -type: Tipo de grafica (area, bar, column, line, pie, scatter, spline, polygon, arearange, areaspline, areasplinerange, funnel, pyramid, waterfall, solidgauge)
           -reconfigureChart: Recarga las opciones de la grafica
               Parametros:
                   -type: Tipo de grafica (area, bar, column, line, pie, scatter, spline, polygon, arearange, areaspline, areasplinerange, funnel, pyramid, waterfall, solidgauge)
                   -data: Fuente de datos
                   -reader: campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                   -rotation: Rotacion 3D de la grafica
           -addSerie: Adiciona una serie de datos a representar en la grafica
              Parametros:
                  -serie: Serie de datos. es un array con la siguiente estructura:
                      {
                          name: 'test',
                          data: [
                              {a: 'attr1', b: 2},
                              {a: 'attr2', b: 5},
                              {a: 'attr3', b: 1},
                              {a: 'attr4', b: 12}
                          ],
                          color: 'red'
                      }

                      o

                      {
                          name: 'test',
                          data: [['attr1', 1], ['attr2', 10], ['attr3', 5], ['attr4', 2]],
                          color: 'red'
                      }
           -rotationEnabled: Verifica si el tipo grafica soporta representacion tridimensional
               Parametros:
                   -type: Tipo de grafica
           -rotateChart: Aplica visualizacion trimensional a la grafica
               Parametros
                   -rotation: Rotacion 3D a aplicar Ej. {x: 10, y: 10, deep: 45}
           -setFillOpacity: Aplica transparencia a las graficas de tipo "area"
               Parametros
                   -fillOpacity: Nivel de transparencia(Entre 0 - 1 donde 0 representa la invisibilidad)
           -parseStoreData: Se encarga de leer los datos de la serie
               Parametros:
                   -store: Fuente de datos que puede ser un Object, Array o Ext.data.Store
                   -reader: campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
           -redraw: Recarga los datos de la grafica y la visualiza
   Ax.Charts.Views.Panel: Panel principal que contiene los componentes de gestion y visualizacion de la grafica.
        Funciones:
            -addSourceStore:Adiciona una serie de datos partiendo de la base de un Ext.data.Store
               Parametros:
                  -name: Nombre de la fuente de datos
                  -store: Ext.data.Store o un objeto que contiene los datos para la graficacion
                  -reader: campos del stores que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                  -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
            -clearSourceStore: Elimina todas las fuentes de datos
            -setXaxisTitle: Mdifica el titulo del Eje "X"
               Parametros:
                   -title: Titulo del Eje "X"
            -setYayisTitle: Mdifica el titulo del Eje "Y"
               Parametros:
                   -title: Titulo del Eje "Y"
            -initChartOptions: Inicializa las opciones de la grafica
                Parametros:
                    - options: Opciones del componente
            -createSerieStore: Crea un Ext.data.Store a partir de una consulta sql o un arreglo de datos
                Parametros:
                    -sql: Consulta Sql(permite valores nulos)
                    -source: Arreglo de datos(permite valores nulos)
                    -reader: Campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
            -addSerieStore: Adiciona una serie de datos a partir de una consulta sql o un arreglo de datos
                Parametros:
                    -name: Nombre de la serie
                    -store: Ext.data.Store(permite valores nulos)
                    -sql: Consulta Sql(permite valores nulos)
                    -reader: Campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                    -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
            -addSqlQuery: Adiciona una serie de datos a partir de una consulta sql o un arreglo de datos
                Parametros:
                    -name: Nombre de la serie
                    -sql: Consulta Sql(permite valores nulos)
                    -reader: Campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
            -clearSerieStore: Elimina todas las fuentes de datos
   Ax.Charts.Views.Window: Ventana de contenedora del panel principal.
        Funciones:
            -setXaxisTitle: Mdifica el titulo del Eje "X"
               Parametros:
                   -title: Titulo del Eje "X"
            -setYayisTitle: Mdifica el titulo del Eje "Y"
               Parametros:
                   -title: Titulo del Eje "Y"
           -clearSources: Elimina todas las fuentes de datos
           -addSqlQuery: Adiciona una serie de datos a partir de una consulta sql o un arreglo de datos
               Parametros:
                   -name: Nombre de la serie
                   -sql: Consulta Sql(permite valores nulos)
                   -reader: Campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
           -addSourceStore:Adiciona una serie de datos partiendo de la base de un Ext.data.Store
                Parametros:
                    -name: Nombre de la fuente de datos
                    -store: Ext.data.Store o un objeto que contiene los datos para la graficacion
                    -reader: campos del stores que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                    -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
           -addSerieStore: Adiciona una serie de datos a partir de una consulta sql o un arreglo de datos
                Parametros:
                    -name: Nombre de la serie
                    -store: Ext.data.Store(permite valores nulos)
                    -sql: Consulta Sql(permite valores nulos)
                    -reader: Campos de la fuente de datos que serviran de xaxis y yayis Ej: {x: 'a', y: 'b'}
                    -type: opcion incial para la representacion de los datos. (Por defecto: 'line')
           -loadChartData: Carga los datos de la grafica.
   Ax.Charts.Views.QuryResultWindow: Ventana que muestra las opciones de seleccion de campos a representar en la grafica en caso de tratarse de que la fuente de datos sea una consulta SQL.
        Funciones:
            -buildAxisConfig: Construye el objeto reader
            -executeQuery: Ejecuta la consulta sql
                Parametros:
                    -query: Consulta sql
            -buildGrid: Construye el grid con los campos que retorna la consulta
                Parametros:
                    -data: Resultado de la consulta sql
            -getLabel: Funcion que retorna los datos de la internacionalizacion
               Parametros:
                   -label: Etiqueta de la palabra a mostrar
                   -lang: Idioma en el que se mostrara la palabra("en" o "es")El idioma por defecto es "es"(Espannol)
            -showChartWindow: Muestra la ventana con la grafica
                Parametros:
                    -title: Titulo de la grafica
                    -source: Fuente de datos
                    -chartType: Tipo de grafica
                    -axisConfig: Configuracion de las axisas
   Ax.Charts.Views.ChartButton: Boton encargado de desencadenar el flujo de gestion y visualizacion de la grafica. Su instanciacion facilita la gestion de la grafica.
        Funciones:
            -setAxisConfig: Redefine la configuracion de las axisas
                Parametros:
                    -axisConfig: Configuracion de la axisa. Estructura del objeto {x: {label: 'Xaxis Title', source: 'xaxis'}, y: {label: 'Yayis Title', source: 'yayis'}}
            -addSqlQuery: Adiciona la consulta sql y su reader
                Parametros:
                    -sqlQuery: Consulta Sql
                    -axisConfig: Configuracion de la axisa. Estructura del objeto {x: {label: 'Xaxis Title', source: 'xaxis'}, y: {label: 'Yayis Title', source: 'yayis'}}
            -showChartWindow: Muestra la ventana con la grafica
                Parametros:
                    -title: Titulo de la grafica
                    -source: Fuente de datos
                    -chartType: Tipo de grafica
                    -axisConfig: Configuracion de las axisas
            -showQueryResultWindow: Muestra la ventana con el resultado de la consulta sql
                Parametros:
                    -sqlQuery: Consulta Sql.

Modo de empleo:
1. Incluir el fichero core.js en el body de tu pagina html. Puede estar en el body o el head de la pagina, depende del mecanismo empleado en tu sitio.
    Ej:
    <html>
    < ..... >
    <script src="core.js"></script>
    < ..... >
    </html>

    Nota: Este script se encarga de gestionar la inclusion dinamica de todas las dependencias del componente asi como las funciones base del mismo.

2. Este paso varia en funcion del funcionamiento del sitio.
    2.1 En caso de ser un sitio en el que no se utilice ExtJs
        2.1.1 Se crea un div dentro del body de la pagina que contendra la grafica.
        2.1.2 Se crea un script, que se ubicara despues de la inclusion del core.js con las instrucciones para la creacion de la grafica.
            Ej: Ver ejemplo en samples/test.html
                Ax.onReady(function(){
                    //Data Source
                    var dataExamples = {
                        data1: [{
                            name: 'test1',
                            data: [
                                {a: '10/12/2015', b: 2},
                                {a: '15/12/2015', b: 5},
                                {a: '28/12/2015', b: 1},
                                {a: '25/12/2015', b: 12},
                                {a: '30/12/2015', b: 1}
                            ],
                            color: 'red'
                        }]
                    };
                    var chart = new Ax.Charts.Views.Chart({
                        config: {
                            chartType: 'line',//Chart Type
                            x: {
                                label: 'Xaxis',
                                source: 'a'
                            },
                            y: {
                                label: 'Yayis',
                                source: 'b'
                            },
                            renderTo: 'grafica',//Html element container Id
                            title: 'Chart'//Chart Title
                        }
                    });
                    chart.reconfigure({
                        data: dataExamples.data1,
                        type: 'line'
                    });
                }, false//No usa ExtJS)
    2.2 En caso de usar ExtJS
        2.2.1.1 Usar el componente a traves de un boton. Se crea una instancia del boton Ax.Charts.Views.ChartButton pasandole los valores de la configuracion
            Ej: Ver ejemplo en samples/testExt.html, samples/testExtWindow.html o samples/testExtButton.html
                Ax.onReady(function () {
                    var panel = new Ext.Panel({
                        title: 'Testing graph',
                        region: 'center',
                        layout: 'fit',
                        tbar: new Ax.Charts.Views.ChartButton({
                            sqlQuery: 'Select * from mod_logistica.nom_categoria'
                        })//Instancia del boton
                    });
                    new Ext.Viewport({
                        layout: 'border',
                        items: [panel],
                        renderTo: 'grafica'
                    });
                }, true//Usa ExtJS);
        2.2.1.2 Utilizar la ventana de la grafica directamente. Se instancia la ventana que contiene la grafica con las opciones de configuracion.
            Ej:
                Ax.onReady(function () {
                    var dataExamples = {
                        data1: [{
                            name: 'test1',
                            data: [
                                {a: '10/12/2015', b: 2},
                                {a: '15/12/2015', b: 5},
                                {a: '28/12/2015', b: 1},
                                {a: '25/12/2015', b: 12},
                                {a: '30/12/2015', b: 1}
                            ],
                            color: 'red',
                            sql: ''
                        }, {
                            name: 'test1',
                            data: [['10/12/2015', 20], ['15/12/2015', 15], ['20/12/2015', 10], ['28/12/2015', 2], ['31/12/2015', 7]],
                            color: 'blue'
                        }, {
                            name: 'test1',
                            data: [['28/12/2015', 10], ['15/12/2015', 5], ['20/12/2015', 2], ['31/12/2015', 17], ['25/12/2015', 2],],
                            color: 'yellow'
                        }]
                    };
                    var chartWindow = new Ax.Charts.Views.Window({
                        region: 'center',
                        chartOptions: {
                            config: {
                                chartType: 'line',//Chart Type
                                x: {
                                    label: 'Xaxis',
                                    source: 'a'
                                },
                                y: {
                                    label: 'Yayis',
                                    source: 'b'
                                },
                                title: 'Chart'//Chart Title
                            }
                        }
                    });
                    var panel = new Ext.Panel({
                        title: 'Testing chart',
                        region: 'center',
                        layout: 'fit'
                    });
                    new Ext.Viewport({
                        layout: 'border',
                        items: [panel],
                        renderTo: 'body'
                    });
                    chartWindow.show();
                    chartWindow.addSqlQuery('test', 'Select * from schema.table', {x: 'field1', y: 'field2'});//Adding sql query data source
                    chartWindow.addSourceStore('Chart 1', dataExamples.data1, {x: 'a', y: 'b'});//Adding simple array data source
                }, true);



<?php
//Probando
define('CMP_HOME', realpath(dirname(__FILE__) . '/..') . '/');
define('CMP_WEB', realpath(dirname(__FILE__) . '/../../../web') . '/');
define('APP_HOME', realpath(dirname(__FILE__)) . '/');

require(CMP_HOME . 'models/templateModel.php');
require(CMP_HOME . 'models/HelperModel.php');

class NomencladorCmpController extends ZendExt_Controller_Secure
{
    /**
     * @var Array()
     */
    private $nomenclatos;

    protected $fileConfig;

    public $inViewport;

    function init()
    {
        $this->nomenclatos = array();
        $this->fileConfig = "";
        $this->inViewport = true;
        parent::init();
    }

    function nomencladorcmpAction()
    {
        $this->render();
    }

    private function getHttpServer()
    {
        $arregloPath = explode('/', $_SERVER['PHP_SELF']);
        array_pop($arregloPath);
        $secure
            = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on' ? 's' : '';
        return 'http' . $secure . '://' . $_SERVER['SERVER_NAME'] . ':'
        . $_SERVER['SERVER_PORT'] . '/';

    }

    protected function getArrayConfig()
    {
        // Verificar que exista el archivo
        if (file_exists($this->fileConfig)) {
            $ar = $this->getConfig();

            $outPut = array();
            foreach ($ar as $modelName => $nom) {
                $outPut[] = array(
                    'text'    => $nom['text'],
                    'clase'   => $modelName,
                    'leaf'    => $nom['leaf'],
                    'gen'     => $nom['gen'],
                    'qtip'    => $nom['qtip'],
                    'refHelp' => $nom['refHelp'],
                    'iconCls' => $nom['iconCls']
                );
            }
            return ($outPut);
        } else {
            return (array('error'   => true,
                          'message' => 'Archivo de configuraci&oacute;n no disponible'));
        }
    }

    /**
     * @param $agFile
     */
    protected function setFileConfig($agFile)
    {
        $this->fileConfig = $agFile;
    }

    /**.
     * Devuelve la configuracion
     *
     * @return mixed
     */
    protected function getConfig()
    {
        if (file_exists($this->fileConfig)) {
            return parse_ini_file($this->fileConfig, true);
        }
        throw new Exception('No existe el fichero de configuracion');
    }

    /**
     * Adicionar un modelo
     *
     * @param $agModel
     */
    protected function addModel($agModel)
    {
        // Obtener el nombre de la clase que controla
        $className = get_class($agModel);
        // verificar que no exista
        if (!isset($this->nomenclatos [$className])) {
            // adicionarla al listado de modelos controlados
            $this->nomenclatos [$className] = new templateModel($agModel);
        }
    }

    /**
     * Funcion filtro para redefinir el renderizado de los nomencladores
     */
    public function render($agConfig = null, $render = true)
    {

        if ($render) {
            parent::render();
        }

        // Si existe una configuracion asimilarla y comenzr el renderizado con esta
        if ($agConfig != null) {
            // Tomar el nombre del controlador frontal
            $request = $this->getRequest();
            $actionName = $request->getActionName();
            // Asimilar la configuracion
            $this->setFileConfig($agConfig);

            // Agregar el perfil al ambito JS
            $this->getResponse()->appendBody(
                '<script type="text/javascript">
                    var perfil = window.parent.UCID.portal.perfil;
                    var etiquetas = perfil.etiquetas;
                    var Nomenclador = {
                        idioma: { es: etiquetas}
                    };
                    var fileConfig =' . json_encode(array("file" => $agConfig))
                . ';
                 </script>',
                null
            );

            // Cargar las librerias
            $this->getResponse()->appendBody(
                '
               <script type="text/javascript" src="' . $this->getHttpServer() .
                '/componenteNomencladores/include.php"></script>
                ',
                null
            );
            // Cargar la funcion de inicializacion
            $inView = ($this->inViewport) ? ('true') : ('false');
        }
    }

    /**
     * Funcion para obtener un modelo dado el nombre
     *
     * @param $modelName
     *
     * @return templateModel|bool
     */
    protected function getModel($modelName)
    {
//        print('/*protected*/');
        if (!isset($this->nomenclatos [$modelName])) {
            try {
                // Adicionar el emeneto dinamicamente (esto debe llamar al autoload)
                $this->addModel(new $modelName());
                return $this->nomenclatos [$modelName];
            } catch (Exception $e) {
                return false;
            }
        }
        return $this->nomenclatos [$modelName];
    }

    /**
     * Accion
     * Imprime un json en el formato  {cant:numero,data:[]}
     * con la informacion de un modelo
     */
    public function showValuesAction()
    {
        $modelName = $this->_request->getPost('modelName', 'NomTipoobjetivo');
        $start = $this->_request->getPost('start', 0);
        $limit = $this->_request->getPost('limit', 18);
        $order = $this->_request->getPost('order', false);
        $orderDirect = $this->_request->getPost('orderDirect', 'ASC');
        $filter = $this->_request->getPost('filter', array());

        $model = $this->getModel($modelName);
        if ($model !== false) {
            echo json_encode(
                $model->getData($start, $limit, $order, $orderDirect, $filter)
            );
        } else {
            echo json_encode(
                array('error'   => true,
                      'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
            );
        }

    }

    /**
     * Accon para eliminar elementos de la base de datos
     */
    public function deleteValuesAction()
    {
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getParams();
        // Capturar el modelo a utilizar
        $modelName = $params['modelName'];

        // Verificar que se haya enviado el modelo
        if ($modelName !== false) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // mandar a modificar el modelo
                $result = $model->deleteValues($params);
                echo json_encode($result);
                return true;
            }
        }
        echo json_encode(
            array('failure' => true,
                  'msg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
        );

    }

    /**
     * Acction paara mostrar
     */
    public function showNomenclatorsAction()
    {
        echo json_encode($this->getArrayConfig());
    }

    public function getNomencladorAction()
    {
        $request = $this->_request->getParams();
        $fileCongig = $request['fileConfig'];
        if ($fileCongig) {
            $this->setFileConfig($fileCongig);
        }
        echo json_encode($this->getArrayConfig());
    }

    /**
     * Obtener la configuracion del modelo
     */
    public function getModelAction()
    {
        // Capturar el modelo a utilizar
//        print('/*inicio*/');
        $request = $this->_request->getParams();
        $modelName = $request['modelName'];
        $values = array();
        $conf = array();
        if ($request['path'] && !class_exists($modelName)) {
            $helper = new HelperModel();
            $helper->inludeDomainModel($request['path']);
        }

        // Verificar que se haya enviado el modelo
        if ($modelName !== false && class_exists($modelName)) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // mandar a modificar el modelo
                $result = $model->digestConfig(array());


                // generar la variable de salida
                $output = array();
                // Si existe un fichero de redefinicion
                $fileRedefinition
                    = APP_HOME . '../../comun/recursos/' . $modelName . '.ini';
                //en caso que se envie la ruta en la peticion no se cargan las configuraciones
                if (file_exists($fileRedefinition) && !$request['path']) {

                    // Combinar con la redefinicion
                    $init = parse_ini_file($fileRedefinition, true);



                    // Combinar y montar sobre arreglo de salida
                    foreach ($init as $fieldname => $column) {

                        // Cambiar el estado de las variables numericas y bool
                        $fieldRedefined = $init [$fieldname];
                        foreach ($fieldRedefined as $k => $v) {
                            // Trabajar tipeando los valores
                            if ($v == "true") {
                                $fieldRedefined[$k] = true;
                            } elseif ($v == "false") {
                                $fieldRedefined[$k] = false;
                            } elseif (is_numeric($v)) {
                                $fieldRedefined[$k] = (int)$v;
                            }
                        }

                        /*
                         * En caso que exista esta opcion en el .ini no se
                         * adiciona a las columnas de la salida
                         */
                        if($fieldname == "entity_conf"){
                            $conf = $column;
                        }else{
                            // Almacenar la convinacion
                            if (isset($result [$fieldname])) {
                                $output[] = array_merge(
                                    $result [$fieldname], $fieldRedefined
                                );
                                unset($result [$fieldname]);
                            } else {
                                $output[] = $fieldRedefined;
                            }
                        }

                    }
                    // Agregar el resto de los valores al arreglo de elementos
                    foreach ($result as $value) {
                        foreach ($value as $k => $v) {
                            // Trabajar tipeando los valores
                            if ($v == "true") {
                                $value[$k] = true;
                            } elseif ($v == "false") {
                                $value[$k] = false;
                            } elseif (is_numeric($v)) {
                                $value[$k] = (int)$v;
                            }
                        }
                        // Adicionar al areglo
                        $output[] = $value;
                    }

                } else {
                    $output = array_values($result);
                }
//                print_r($request);

                if (!$request['noData']) {
                    $values = $this->showValues($request);
                }

                $ident = false;
                foreach ($output as $key => $value) {
                    // Crear los campos del store
                    $fields[$key] = array('name'    => $value['name']
                        ? $value['name'] : $value['dataIndex'],
                                          'type'    => $value['dataType'],
                                          'mapping' => $value['mapping']
                                              ? $value['mapping']
                                              : $value['dataIndex']);
                    // Para el caso de los columnas con fechas
                    if ($value['dataType'] == 'date') {
                        $output[$key]['xtype'] = 'datecolumn';
                        $output[$key]['format'] = 'd/m/Y';
                        $fields[$key]['dateFormat'] = 'd/m/Y';
                    }

                    if (!isset($output[$key]['width'])) {
                        $output[$key]['flex'] = 1;
                    }

                    // Determinando la columna identificador
                    if (isset($value ['identifier']) && !$ident) {
                        $identifier = $value['dataIndex'];
                        $ident = true;
                    }
                    // Crear los filtros de cada columna
                    $output[$key]['filter']
                        = array('type' => $value['dataType']);
                }
                $meta = array(
                    "count"    => $values['cant'],
                    "data"     => $values['data'],
                    "metaData" => array(
                        "idProperty"  => $identifier,
                        "fields"      => $fields,
                        "columns"     => $output,
                        "entity_conf" => $conf
                    ),
                    "success"  => true
                );
                echo json_encode($meta);
                return true;
            }
        }
        echo json_encode(
            array('success' => false,
                  'msg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
        );

    }

    public function showValues($params)
    {
        $sort = json_decode($params['sort']);
        $modelName = $params['modelName'];
        $start = $params['start'];
        $limit = $params['limit'];
        $join = $params['path'] ? 0 : 1;

        if ($sort) {
            $order = $sort[0]->property;
            $orderDirect = $sort[0]->direction;
        }
        $filter = $params['filter'];

        $model = $this->getModel($modelName);
//        print_r($model);die;
        if ($model !== false) {
//            print('/*aaaaaaaaaaa*/');
            return $model->getData(
                $start, $limit, $order, $orderDirect, $filter, $join
            );
        } else {
            echo json_encode(
                array('success' => false,
                      'msg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
            );
        }
    }

    /**
     * Accion
     * insertar datos en un modelo
     */
    public function insertValuesAction()
    {
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getParams();
        // Capturar el modelo a utilizar
        $modelName = $params['modelName'];
//        print_r($modelName);die;
        // Verificar que se haya enviado el modelo
        if ($modelName) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // mandar a modificar el modelo
                $result = $model->insertValues($params);
                echo json_encode($result);
                return true;
            }
        }
        echo json_encode(
            array('failure' => true,
                  'msg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
        );
    }

    /**
     * Accion
     * Modificar valores del modelo
     */
    public function modifyValuesAction()
    {
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getParams();
        // Capturar el modelo a utilizar
        $modelName = $params['modelName'];
//        print_r($params);
        // Verificar que se haya enviado el modelo
        if ($modelName !== false) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // mandar a modificar el modelo
                $result = $model->modifyValues($params);
                echo json_encode($result);
                return true;
            }
        }
        echo json_encode(
            array('failure' => true,
                  'msg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
        );

    }

}

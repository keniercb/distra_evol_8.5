<?php

define('CMP_HOME', realpath(dirname(__FILE__) . '/..') . '/');
define('CMP_WEB', realpath(dirname(__FILE__) . '/../../../web') . '/');

require(CMP_HOME . 'models/templateModel.php');
require(CMP_HOME . 'models/HelperModel.php');

class NomencladorCmpController extends ZendExt_Controller_Secure
{
    /**
     * @var Array()sadasd
     */
    private $nomenclatos;

    private $fileConfig;

    //TODO caskete variable necesaria
    private $childAdd = array();

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
        $secure = isset($_SERVER['HTTPS']) &&
        $_SERVER['HTTPS'] == 'on' ? 's' : '';
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
                //TODO caskete
                if(!isset($this->childAdd[$modelName])){
                    $child  = (isset($nom['children'])) ? ($this->getChildsNomenclador($nom['children'])) : (null);
                    if($child!=null){
                        $this->childAdd = $this->addNomChild($child,$this->childAdd);
                    }

                    $data = array(
                        'text' => $nom['text'],
                        'clase' => $modelName,
                        'leaf' => $nom['leaf'],
                        'icon' => isset($nom['icono']) ?
                            $nom['icono'] :
                            $this->getHttpServer() . '/nomencladoresCmp/core/images/obconf.png',
                        'qtip' => $nom['qtip'],
                        // 'gen' => $nom['gen'], //add by mgleon
                        'refHelp' => $nom['refHelp'],
                        'children' => $child
                    );
                    if( isset($nom['plugin']) ) {
                        $data['plugin'] = $nom['plugin'];
                    }
                    $outPut[] = $data;
                }

            }
            return ($outPut);
        } else
            return (array('error' => true,
                'message' => 'Archivo de configuraci&oacute;n no disponible'));
    }

    /**
     * TODO caskete
     * @param $childs
     * @param $childAdd
     *
     * @return mixed
     */
    public function addNomChild($childs,$childAdd)
    {
        $cont  = count($childs);
        for($i = 0 ; $i < $cont; $i++){
            $nomb = $childs[$i]['clase'];
            if(!isset($childAdd[$nomb])){
                $childAdd[$nomb] = true;
            }
        }
        return $childAdd;
    }

    /**
     * TODO Caskete
     * Funcion q devuelve los atributos de un nomenclador
     * @param $nom
     * @return array
     * @throws Exception
     */
    private function getNomenclador($nomenclador)
    {
        $ar = $this->getConfig();
        $res = array();
        foreach ($ar as $modelName => $nom) {
            if ($modelName == $nomenclador) {
                if(!isset($this->childAdd[$modelName])){

                    $child  = (isset($nom['children'])) ? ($this->getChildsNomenclador($nom['children'])) : (null);
                    if($child!=null){
                        $this->childAdd = $this->addNomChild($child,$this->childAdd);
                    }

                    $res['text'] = $nom['text'];
                    $res['clase'] = $modelName;
                    $res['leaf'] = $nom['leaf'];
                    $res['icon'] = isset($nom['icono']) ? $nom['icono'] :
                        $this->getHttpServer()
                        . '/nomencladoresCmp/core/images/obconf.png';
                    $res['qtip'] = $nom['qtip'];
                    $res['refHelp'] = $nom['refHelp'];
                    $res['children'] = $child;
                    // Verificar si posee plugin e la interfaz para el grid
                    if( isset($nom['plugin']) ) {
                        $res['plugin'] = $nom['plugin'];
                    }
                    break;
                }
            }
        }
        return $res;
    }

    /**
     * TODO Caskete
     * Funcion q devuelve los datos asociados a los child de los nomencladores pasados por parametro
     * @param $arg  Ej: "[NomAeropuerto],[NomDetalle]"
     *
     * @return array
     */
    private function getChildsNomenclador($arg)
    {
        $noms = explode(',',$arg);
        $resp = array();
        $cont = count($noms);
        for($i = 0; $i < $cont; $i++){
            $nom = explode('[',$noms[$i]);
            $nom = explode(']',$nom[1]);
            $resp[] = $this->getNomenclador($nom[0]);
        }
        return $resp;
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
            //$a = $this->nomenclatos [$className ]->getTable();
        }
    }


    /**
     * Funcion filtro para redefinir el renderizado de los nomencladores
     */
    public function render($agConfig = null)
    {

        parent::render();

    // Si existe una configuracion asimilarla y comenzr el renderizado con esta
        if ($agConfig != null) {
            // Tomar el nombre del controlador frontal
            $request = $this->getRequest();
            $actionName = $request->getActionName();
            // Asimilar la configuracion
            $this->setFileConfig($agConfig);
            // Agregar el perfil al ambito JS
            $this->getResponse()->appendBody(
                '
                <script type="text/javascript"  >
                var perfil = window.parent.UCID.portal.perfil;
                    var etiquetas = perfil.etiquetas;
                    var Nomenclador = {
                        idioma: { es: etiquetas}
                    };
                    </script>',
                null
            );

//            if( $this->integrator->ayuda ) {
//                $jsayuda = $this->integrator->ayuda->devolverJS();
//            // Incuyendo JavaScript de Ayuda
//                $this->getResponse()->appendBody($jsayuda, null);
//            }
            // Cargar las librerias
            $this->getResponse()->appendBody(
                '
               <script type="text/javascript" src="' . $this->getHttpServer() .
                '/nomencladoresCmp/core/include.php"></script>
                ',
                null
            );
            // Cargar la funcion de inicializacion
            $inView = ($this->inViewport) ? ('true') : ('false');
            $this->getResponse()->appendBody(
                '<script type="text/javascript"  >
                    if(Ext.isReady) {
                        Ext.QuickTips.init();
      this.UCID.portal.cargarEtiquetas("' . $actionName . '", creaNomenclador);
                    }
                    else {
                        Ext.onReady(function(){
                            Ext.QuickTips.init();
      this.UCID.portal.cargarEtiquetas("' . $actionName . '", creaNomenclador);
                        });
                    }
                    function creaNomenclador() {
             var nomencladores = ' . json_encode($this->getArrayConfig()) . ';
                        crudNomenclador = new gestionarNomenclador({
                            "nomencladores": nomencladores,
                            perfil : perfil,
                            inViewport : ' . $inView . '
                        });
                        cargarNomeclador = function(clase, fn, scope, selectMulti){
                            var node = null;
                            for (var i = 0; i < nomencladores.length; i++) {
                                var nomenclador = nomencladores[i];
                                if(nomenclador.clase == clase){
                                    node = {
                                        attributes : nomenclador
                                    };
                                    break;
                                }
                            }
                            if(node){
                            crudNomenclador.loadNomen(node, true, fn, scope, selectMulti);
                            }
                            else{
                                alert("El nomenclador buscado no existe");
                            }
                        };
                    }
                    </script>',
                null
            );
        }
    }

    /**
     * Funcion para obtener un modelo dado el nombre
     * @param $modelName
     * @return templateModel|bool
     */
    protected function getModel($modelName)
    {
        if (!isset($this->nomenclatos [$modelName])) {
            try {
     // Adicionar el elemento dinamicamente (esto debe llamar al autoload)
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
            echo json_encode($model->getData($start, $limit, $order, $orderDirect, $filter));
        } else
            echo json_encode(array('error' => true,
                'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));

    }

    /**
     * Accion
     * insertar datos en un modelo
     */
    public function insertValuesAction()
    {
        // Capturar el modelo a utilizar
        $modelName = $this->_request->getPost('modelName', false);
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getPost();

        // Verificar que se haya enviado el modelo
        if ($modelName !== false) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // mandar a modificar el modelo
                $result = $model->insertValues($params);
                echo json_encode($result);
                return true;
            }
        }
        echo json_encode(array('error' => true,
            'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));
    }

    /**
     * Accion
     * Modificar valores del modelo
     */
    public function modifyValuesAction()
    {
        // Capturar el modelo a utilizar
        $modelName = $this->_request->getPost('modelName', false);
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getPost();

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
        echo json_encode(array('error' => true,
            'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));

    }

    /**
     * Accon para eliminar elementos de la base de datos
     */
    public function deleteValuesAction()
    {
        // Capturar el modelo a utilizar
        $modelName = $this->_request->getPost('modelName', false);
        // Capturar todos los valoes enviados para procesar
        $params = $this->_request->getPost();

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
        echo json_encode(array('error' => true,
            'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));

    }

    /**
     * Acction paara mostrar
     */
    public function showNomenclatorsAction()
    {
        echo json_encode($this->getArrayConfig());
    }

    /**
     * Obtener la configuracion del modelo
     */
    public function getModelAction()
    {
        // Capturar el modelo a utilizar
        $modelName = $this->_request->getPost('modelName', false);

        // Verificar que se haya enviado el modelo
        if ($modelName !== false) {
            // Verificar que exista el modelo
            $model = $this->getModel($modelName);
            if ($model !== false) {
                // TODO tomar configuacion
                $config = array();
                // mandar a modificar el modelo
                $result = $model->digestConfig(array());

                // generar la variable de salida
                $output = array();

                // Si existe un fichero de redefinicion
    $fileRedefinition = APP_HOME . '../comun/recursos/' . $modelName . '.ini';
                if (file_exists($fileRedefinition)) {

                    // Combinar con la redefinicion
                    $init = parse_ini_file($fileRedefinition, true);

                    // Combinar y montar sobre arreglo de salida
                    foreach ($init as $fieldname => $column) {

                        // Cambiar el estado de las variables numericas y bool
                        $fieldRedefined = $init [$fieldname];
                        foreach ($fieldRedefined as $k => $v) {
                            // Trabajar tipeando los valores
                            if ($v == "true")
                                $fieldRedefined[$k] = true;
                            elseif ($v == "false")
                                $fieldRedefined[$k] = false;
                            elseif (is_numeric($v))
                                $fieldRedefined[$k] = (int)$v;
                        }

                        // Almacenar la convinacion
                        if (isset($result [$fieldname])) {
                            $output[] = array_merge($result [$fieldname], $fieldRedefined);
                            unset($result [$fieldname]);
                        } else {
                            $output[] = $fieldRedefined;
                        }
                    }

                    // Agregar el resto de los valores al arreglo de elementos
                    foreach ($result as $value) {
                        foreach ($value as $k => $v) {
                            // Trabajar tipeando los valores
                            if ($v == "true")
                                $value[$k] = true;
                            elseif ($v == "false")
                                $value[$k] = false;
                            elseif (is_numeric($v))
                                $value[$k] = (int)$v;
                        }
                        // Adicionar al areglo
                        $output[] = $value;
                    }
                } else {
                    $output = array_values($result);
                }

                echo json_encode(array('cm' => $output));
                return true;
            }
        }
        echo json_encode(array('error' => true,
            'message' => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));

    }

}

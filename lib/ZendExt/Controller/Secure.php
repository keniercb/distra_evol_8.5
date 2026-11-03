<?php

/**
 * ZendExt_Controller_Secure
 * Controlador de acciones personalizado e integrado a seguridad
 *
 * @author Omar Antonio Diaz Pena
 * @package ZendExt
 * @subpackage ZendExt_Controller
 * @copyright UCID-ERP Cuba
 * @version 1.0-0
 */
class ZendExt_Controller_Secure extends Zend_Controller_Action {

    /**
     * Conexion a la BD
     *
     * @var Doctrine_Conexion
     */
    protected $conn;
    /**
     * Integrador IoC
     */
    protected $integrator;
    /**
     * Integrador interno IoC
     */
    protected $pIntegrator;
    /**
     * GlobalConcept
     */
    protected $global;
    /**
     * Nomencladores cargados
     *
     * @var array of ZendExt_FastResponse_NomLoader
     */
    protected $nomencladores;
    /**
     * Tejedor de aspectos asociados a una accion
     *
     * @var ZendExt_Weaver
     */
    private $actionWeaver;
    /**
     * Modulo al cual pertenece el controlador
     *
     * @var string
     */
    protected $module;
    /**
     * Administrador de transacciones
     *
     * @var ZendExt_Aspect_TransactionManager
     */
    protected $transactionManager;

    /**
     * Inicializa el controlador
     *
     * @return void
     */
    public function init() {
        //Inicializo la conexion
        $this->initConnection();

        //Obtengo la instancia del integrador
        $this->integrator = ZendExt_IoC::getInstance();

        //Obtengo la instancia del integrador interno
        $this->pIntegrator = ZendExt_IoC_Inter::getInstance();

        //Inicializo el global concept
        $this->global = ZendExt_GlobalConcept::getInstance();

        //Para evitar que las acciones intente renderear la vista automaticamente
        $this->_helper->viewRenderer->setNoRender(true);
        $this->_helper->removeHelper('viewRenderer');
        Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);

        //Obtengo una instancia del registro.
        $registro = Zend_Registry::getInstance();

        //Obtengo el idioma y el tema
        $idioma = $this->global->Perfil->idioma;
        $tema = $this->global->Perfil->tema;

        //Obteniendo la direccion de ExtJS y UCID
        $this->view->dir_extjs = $registro->config->idioma->$idioma->extjs_path;
        $this->view->tema = $tema;
        $this->view->dir_ucid = $registro->config->ucid_path;
        $this->view->dir_ext_ccs = $registro->config->extjs_themes_path . $tema . '/';
        $this->view->dir_adapters=$registro->config->adapters_path;
        $this->view->helper = new ZendExt_View_Helper();
        $this->view->helper->setLocation($this->view->dir_adapters);
    }

    /**
     * Obtiene el perfil del usuario
     *
     * @throws ZendExt_Exception - dispara excepcion declarada en el xml de excepciones
     * @return array - devuelve los datos del usuario y de su perfil
     */
    public function getPerfil() {

        $perfil = $this->global->Perfil;

        unset($perfil->certificado);
        return $perfil;
    }

    /**
     * Imprime las etiquetas para una vista en formato json
     *
     * @throws ZendExt_Exception - dispara excepcion declarada en el xml de excepciones
     * @return void
     */
    public function cargaretiquetasAction() {
        $controller = $this->_request->getControllerName();
        $vista = $this->_request->getPost('vista');
        $es = $this->_request->getPost('es');
        $fn = $this->_request->getPost('fn');
        if (!$vista)
            $vista = $controller;
        $perfil = $this->getPerfil();

        $modulo_path = Zend_Registry::getInstance()->config->modulo_path;
        $file = "{$modulo_path}views/idioma/{$perfil->idioma}/$controller/$vista.json";
        if (file_exists($file)) {
            if (is_readable($file))
                echo file_get_contents($file);
            else
                throw new ZendExt_Exception('E011');
        }else if(file_exists("{$modulo_path}views/idioma/es/$controller/$vista.json")){
            if (is_readable("{$modulo_path}views/idioma/es/$controller/$vista.json")){
                if($es==null){
                echo "{'codMsg':4,'mensaje': 'Error loading language. The language file view does not exist.','detalles':'System default language has been loaded. If the problem persists, contact the administrator.'}";
                }else{
                echo file_get_contents("{$modulo_path}views/idioma/es/$controller/$vista.json");
                }
                //echo file_get_contents("{$modulo_path}views/idioma/es/$controller/$vista.json");
                //throw new ZendExt_Exception('E012');
            }
            else{
            throw new ZendExt_Exception('E011');
            }
        }
        else
            throw new ZendExt_Exception('E010');
    }

    /**
     * Imprime un mensaje en formato json
     *
     * @param string $msg - mensaje
     * @return void
     */
    protected function showMessage($msg) {
        echo "{'codMsg':1,'mensaje': '$msg'}";
    }

    /**
     * Imprime un mensaje de error en formato json
     *
     * @param string $msg - mensaje
     * @return void
     */
    protected function showErrorMessage($msg) {
        echo "{'codMsg':6,'mensaje': '$msg'}";
    }
    /**
     * Imprime un mensaje de advertencia en formato json
     *
     * @param string $msg - mensaje
     * @return void
     */
    protected function showWarningMessage($msg) {
        echo "{'codMsg':8,'mensaje': '$msg'}";
    }

    protected function construirMensajeInformacion($mensaje,$detalles){
        return $this->construirMensaje(1,$mensaje,$detalles);
    }
    protected function construirMensajeAdvertencia($mensaje,$detalles=""){
        return $this->construirMensaje(8,$mensaje,$detalles);
    }
    protected function construirMensajeError($mensaje,$detalles=""){
        return $this->construirMensaje(3,$mensaje,$detalles);
    }
    private function construirMensaje($codigoMensaje, $mensaje, $detalles=""){
        return array('codMsg'=> $codigoMensaje, 'mensaje' => $mensaje, 'detalles' => $detalles);
    }

    /**
     * Cierra la session del usuario al salir del portal
     *
     * @return void
     */
    public function closeportalAction() {
        $registro = Zend_Registry::getInstance();
        $registro->session->unsetAll();
        $registro->session->close = true;
        echo json_encode(array('close' => true));
    }

    /**
     * Precondicion que se dispara antes de executarse la accion
     *
     * @return void
     */
    public function preDispatch() {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini($register->config->security_config,"methods");
        $arrayMethods=$config->toArray();
       (new HisTrazaModel())->saveTraza();
        if(in_array($_SERVER['REQUEST_METHOD'], $arrayMethods['allowedMethods'])||$_REQUEST===array()||(count($_REQUEST)===1&&  key_exists('opcion', $_REQUEST))){
            $this->initActionWeaver();
            if (isset($this->actionWeaver)){
                $this->actionWeaver->preAction();
            }
        }else{
            throw new ZendExt_Exception('STD09');
        }

    }

    /**
     * Postcondicion que se dispara despues de executarse la accion
     *
     * @return void
     */
    public function postDispatch() {
        if (isset($this->actionWeaver))
            $this->actionWeaver->postAction();
    }

    /**
     * Inicializa el tejedor de la accion, para que los aspectos
     * asociados a la accion sean disparados
     *
     * @return void
     */
    private function initActionWeaver() {
        if (!$this->module)
            $this->setModule();
        $controller = ucfirst($this->_request->getControllerName()) . 'Controller';
        $action = $this->_request->getActionName() . 'Action';
        $weaver = ZendExt_Weaver::getInstance();
        $module_reference = Zend_Registry::get('config')->module_reference;
        $arrModuleRef = explode('/', $module_reference);
        foreach ($arrModuleRef as $arrFolder) {
            $weaver = $weaver->$arrFolder;
        }
        $this->actionWeaver = $weaver->$controller->$action->init();
    }

    /**
     * Inicializa el modulo al cual pertenece el controlador
     *
     * @return void
     */
    public function setModule($module = null) {
        if (isset($module))
            $this->module = $module;
        elseif (!$this->module)
            $this->module = Zend_Registry::get('config')->module_name;
    }

    /**
     * Ejecuta o despacha la accion
     *
     * @param string $action - Nombre de la accion
     * @return void
     */
    public function dispatch($action) {
        try {
            // Notify helpers of action preDispatch state
            $this->_helper->notifyPreDispatch();
            $this->preDispatch();
            if ($this->getRequest()->isDispatched()) {
                // preDispatch() didn't change the action, so we can continue
                $this->$action();
                $this->postDispatch();
            }
            // whats actually important here is that this action controller is
            // shutting down, regardless of dispatching; notify the helpers of this
            // state
            $this->_helper->notifyPostDispatch();
        } catch (Exception $e) {
            $this->failedDispatch($e);
        }
    }

    /**
     * Se ejecuta cuando ocurre un error durante la ejecucion de la accion
     *
     * @return void
     */
    public function failedDispatch($e) {
        if (isset($this->actionWeaver))
            $this->actionWeaver->failedAction($e);
        else
            throw $e;
    }

    /**
     * Inicializa la conexion del controlador
     *
     * @param string $module - Modulo al que pertenece el controlador
     * @return void
     */
    public function initConnection($module = null) {
        //Inicializo el modulo
        $this->setModule($module);
        //Se obtiene una instancia del gestor de doctrine
        $dmInstance = Doctrine_Manager::getInstance();
        //Se obtiene la conexion del modulo
        try {
            if ($this->module)
                $this->conn = $dmInstance->getConnection($this->module);
            else
                $this->conn = $dmInstance->getCurrentConnection();
        } catch (Exception $exc) {
            $this->conn = NULL;
        }
    }

    /**
     * Inicializa el administrador de transacciones
     *
     * @return void
     */
    public function initTransactionManager() {
        $this->transactionManager = ZendExt_Aspect_TransactionManager::getInstance();
    }

    /**
     * Carga las acciones de una funcionalidad
     *
     * @return void
     */
    public function cargaraccionesAction() {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $certificado = Zend_Registry::get('session')->certificado;
        $integrator = ZendExt_IoC::getInstance();
        $acciones = $integrator->seguridad->ObtenerAcciones($certificado, $idfuncionalidad, $identidad);
        if ($acciones)
            echo json_encode($acciones);
        else
            echo '[]';
    }

    /**
     * Carga las acciones de una funcionalidad
     *
     * @return void
     */
    public function cargaraccionesbyidAction() {
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $identidad = $this->_request->getPost('identidad');
        $certificado = Zend_Registry::get('session')->certificado;
        $integrator = ZendExt_IoC::getInstance();
        $acciones = $integrator->seguridad->ObtenerAccionesbyID($certificado, $idfuncionalidad, $identidad);
        if ($acciones)
            echo json_encode($acciones);
        else
            echo '[]';
    }

    /**
     * Carga las acciones de una funcionalidad
     *
     * @return void
     */
    public function cargarAccionesXUriAction() {
        $uri = $this->_request->getPost('uri');
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $certificado = Zend_Registry::get('session')->certificado;
        $integrator = ZendExt_IoC::getInstance();
        $acciones = $integrator->seguridad->cargarAccionesXUri($certificado, $uri, $identidad);
        if ($acciones)
            echo json_encode($acciones);
        else
            echo '[]';
    }

    /**
     * Muestra la vista de la ayuda
     *
     * @return void
     */
    public function cargarayudaAction() {
        //Mostrar la vista de la ayuda
        $this->render('ayuda');
    }

    public function render($action = null, $name = null, $noController = false) {
        ZendExt_Aspect_Security::getInstance()->verifyAccessToFunctionality();
        $development = (Zend_Registry::get('config')->development) ? 'true' : 'false';
        if(!$this->getRequest()->isXmlHttpRequest()){
            $link = $this->view->dir_ext_ccs;
            //$link = '/lib/ExtJS/temas/default/css/icon-font.css';
            $link1 = "/lib/ExtJS/temas/default/css/icon-font.css";
            $this->getResponse()->appendBody(
                "<link media='all' rel='stylesheet' href='$link1'/>", $name
            );
            $cadena = explode("/", $link);
            $tema = $cadena[4];
            //var_dump($tema); die;
            if ($tema != "default"){
                $link2 = $link."css/icon-tema.css";
            }
            $this->getResponse()->appendBody(
                 "<link media='all' rel='stylesheet' href='$link2'/>", $name
            );
        }
        $this->getResponse()->appendBody(
            "<style id=\"antiClickjack\">body{display:none !important;}</style>", $name
        );
        $this->getResponse()->appendBody(
            "<script type=\"text/javascript\">"
            ."if (self === top || self.location.origin === top.location.origin) {"
            ."var antiClickjack = document.getElementById('antiClickjack');"
            ."antiClickjack.parentNode.removeChild(antiClickjack);"
            ."} else {"
            ."top.location = self.location;"
            ."}"
            ."</script>", $name
        );
        $this->getResponse()->appendBody(
                "<script type=\"text/javascript\"> var development = {$development} </script>", $name
        );
        parent::render($action, $name, $noController);
    }

}

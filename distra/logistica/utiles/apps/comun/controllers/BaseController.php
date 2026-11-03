<?php

/**
 * Controlador base para la inicializacion de componentes y ejecucion
 * de acciones desde la IU
 *
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class BaseController extends ZendExt_Controller_Secure
{

    protected $responseData,
        /**
         * Configuracion utilizada por el controlador
         */
        $controllerConfig,
        /**
         * Instanacia de la clase JSONComponent que se encagar
         * de la inizalizacion y
         */
        $jsonComponent,
        /**
         * Arreglo que almacena los parametros que se envian de la IU
         */
        $uiParams;

    /**
     * Funcion que inicializa el Controlador y resuelve las dependencias del
     * componente con los componentes internos
     *
     * @param string $strComponent Nombre del componente a inicializar
     */
    public function init($strComponent = '')
    {
        ini_set('memory_limit', -1);
        parent::init();
        $this->uiParams = $this->_getAllParams();
        $register = Zend_Registry::getInstance();
        if (array_key_exists('idEntidadComun', $this->uiParams)) {
            if (isset($register->session)) {
                if (!isset($register->session->entidad->idestructuracomun)) {
                    $register->session->entidad->idestructuracomun = $this->global->Estructura->idestructura;
                }
                $register->session->entidad->idestructura = $this->uiParams['idEntidadComun'];
            }
        } else {
            if (isset($register->session)) {
                if (isset($register->session->entidad->idestructuracomun)) {
                    $register->session->entidad->idestructura = $register->session->entidad->idestructuracomun;
                }
            }
        }
        //Se crea la respuesta por defecto que va a mostrar el componente
        $this->responseData = new BaseResponse();
        $this->controllerConfig = 'default';
        $this->jsonComponent = JSONComponent::__init();
        $this->jsonComponent->loadDefinitionsFile('cmp.definitions');
        if (!empty($strComponent)) {
            $component = $this->jsonComponent->getComponent($strComponent);
            if ($component != null && $this->jsonComponent->existComponentDir($component)) {
                $this->jsonComponent->loadComponent($strComponent);
                $this->jsonComponent->buildDependencies($component);
                $this->jsonComponent->getComponentRequiredFiles($component, true);
                $this->jsonComponent->loadPath();
            }
        }
        $this->view->idioma = $this->global->Perfil->idioma;
        $entidad = ServiciosEstructuraComposicionHelper::__init()
            ->getEstructura($this->global->Estructura->idestructura);
        $variablesModel = new VariablesGlobalesModel();
        $this->view->uiVariables = array_merge($variablesModel->nameAsKey($variablesModel->devolverVariables(array('ambito'=>VariablesGlobalesModel::AMBIT_UI)))
            , array(
                'idiomaMT' => "'{$this->global->Perfil->idioma}'",
                'idEntidad' => $this->global->Estructura->idestructura,
                'idEspecialidad' => $this->global->Estructura->idespecialidad,
                'temaMT' => "'{$this->global->Perfil->tema}'",
                'idUsuario' => $this->global->Perfil->idusuario,
                'entidad' => "'{$entidad[0]->denominacion}'",
            ));
        $this->proccessFilters($this->uiParams);
        $this->unsetParam('filter');
        $this->purgeInitials($this->uiParams);
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        //$this->imagenHelper->buscarIconoEntidad($this->global->Estructura->idestructura);
        $this->view->defaultJs = array(
            $this->rrhhHelper->mostrarIUBuscarPersona(),
            $this->contabilidadHelper->getComprobanteComponent()
        );
    }

    public function getLoadedComponents()
    {
        return $this->jsonComponent->getLoadedComponents();
    }

    /**
     * Metodo que devuelve por defecto la respuesta segun las variables
     * configuradas datos, total, codigoMsg y success, por lo que no es
     * necesario hacer el echo al terminar la ejecucion de la peticion
     */
    public function postDispatch()
    {
        if ($this->responseData->autoShow) {
            $this->responseData->toJsonResponse();
        }
        parent::postDispatch();
    }

    public function preDispatch()
    {
        parent::preDispatch();

    }

    /**
     * Metodo magico para establecer los valores de la respuesta
     *
     * @param string $name
     * @param mixed $value
     */
    public function __set($name, $value)
    {
        if (isset($this->$name)) {
            $this->$name = $value;
        } else {
            $this->responseData->$name = $value;
        }
    }

    /**
     * Metodo magico para obtener los valores de la respuesta
     *
     * @param type $name
     *
     * @return type
     */
    public function __get($name)
    {

        if (stripos($name, 'Helper') == -1) {
            if (isset($this->$name)) {
                return $this->$name;
            } else {
                return $this->responseData->$name;
            }
        } else {
            return LogisticaGlobal::__init()->getHelperInstance($name);
        }
    }

    /**
     * @override
     */
    public function cargaretiquetasAction()
    {
        $this->autoShow = false;
        parent::cargaretiquetasAction($this->_getParam('vista', ''));
    }

    /**
     * @override
     */
    public function cargaraccionesAction()
    {
        $this->autoShow = false;
        parent::cargaraccionesAction($this->_getParam('idfuncionalidad'));
    }

    /**
     * Metodo que establece los ficheros comunes que se usan por defecto en las
     * vistas
     *
     * @param type $cfg
     *
     * @return array
     */
    public function getViewCfg($cfg = 'default')
    {
        return LogisticaConfigHelper::__init()->loadConfig('comunview')->get($cfg);
    }

    public function initComponent($component)
    {
        $this->jsonComponent->buildComponent($component, $this);
    }

    /**
     * Metodo que procesa cada seccion de la configuracion para conformar
     * las variables
     * de cabecera de la vista
     */
    public function proccessConfig($pConfig = array())
    {

        $config = (count($pConfig)) ? $pConfig : $this->getViewCfg($this->controllerConfig);
        foreach ($config as $seccion => $value) {
            if (!in_array($seccion, array('estilos', 'idiomas', 'scripts', 'util-scripts'))) {
                continue;
            }
            if ($seccion == 'estilos') {
                $this->proccessStyles($value);
            } elseif ($seccion == 'idiomas') {
                $this->proccessLocale($value);
            } elseif ($seccion == 'scripts') {
                $this->proccessScripts($value);
            } elseif ($seccion == 'util-scripts') {
                $this->proccessScripts($value);
            }
        }
    }

    /**
     * Metodo que inicializa todos los valores por defecto de la vista
     * se debe llamar en todos los metodos render
     */
    public function prepareView()
    {
        $this->view->doctype('HTML5');
        $this->view->headMeta()->appendHttpEquiv('Content-Type', 'text/html; charset=utf-8');
        $this->view->headMeta()->appendHttpEquiv('Cache-Control', 'no-cache, no-store, must-revalidate');
        $this->view->headMeta()->appendHttpEquiv('Pragma', 'no-cache');
        $this->view->headMeta()->appendHttpEquiv('Expires', '0');
        $this->proccessConfig();
    }

    /**
     * Annade las hojas de estilo al phtml
     *
     * @param array $styles
     */
    public function proccessStyles($styles)
    {
        foreach ($styles as $css) {
            if ($css['tipo'] == 'file') {
                $this->view->headLink()->appendStylesheet($css['css']);
            } else {

            }
        }
    }

    /**
     * Configura los js de los idiomas en funcion del idioma del MT
     *
     * @param array $locales
     */
    public function proccessLocale($locales)
    {
        $locales = str_replace('locale', $this->global->Perfil->idioma, $locales);
        foreach ($locales as $idioma) {
            $this->view->headScript()->appendFile($idioma);
        }
    }

    /**
     * Metodo para annadir los ficheros de javascript al phtml
     *
     * @param array $scripts
     */
    public function proccessScripts($scripts)
    {
        foreach ($scripts as $js) {
            if ($js['tipo'] == 'file') {
                $this->view->headScript()->appendFile($js['js']);
            } else {
                $this->view->headScript()->appendScript($js['js']);
            }
        }
    }

    /**
     * Renderiza la plantilla por defecto de la vista
     *
     * @param type $view
     */
    public function renderTemplate($view = null)
    {
        if (!is_null($view)) {
            $this->render($view);
        } else {
            $index = $_SERVER['SCRIPT_FILENAME'];
            $dir_vistas = substr($index, 0, strrpos($index, 'web')) . 'apps/logistica/utiles/comun/views/scripts';
            $this->view->setScriptPath($dir_vistas);
            echo $this->view->render('logistica.phtml');
        }
    }

    private function purgeInitials(&$params)
    {
        unset($params['controller']);
//        unset($params['action']);
        unset($params['module']);
    }

    public function setDefaultParam($param, $default = null)
    {
        $value = $this->uiParams[$param];
        if ((null === $value) && (null !== $default)) {
            $value = $default;
        }
        $this->uiParams[$param] = $value;
    }

    public function unsetParam($param)
    {
        unset($this->uiParams[$param]);
    }

    public function unsetNullValues()
    {
        foreach ($this->uiParams as $param => $value) {
            if (null == $value) {
                $this->unsetParam($param);
            }
        }
    }

    public function cargaraccionesbyidAction()
    {
        return parent::cargaraccionesbyidAction();
    }

    public function jsonResponse($respuesta)
    {
        $this->autoShow = false;
        echo Zend_Json::encode($respuesta);
    }

    public function existComponent($strComponent)
    {
        return $this->jsonComponent->getComponent($strComponent, true);
    }

    public function proccessFilters(&$uiParams)
    {
        if ($uiParams['filter']) {
            $params = json_decode($uiParams['filter']);
            $comparaciones = array();
            foreach ($params as $searchParam) {
                if (($searchParam->type == 'numeric' || $searchParam->type == 'date') && $searchParam->comparison != 'eq') {
                    if ($searchParam->type == 'date') {
                        array_push($comparaciones, array(
                            'campo' => $searchParam->field,
                            'valor' => $searchParam->value,
                            'signo' => $searchParam->comparison == 'gt' ? '>=' : '<=',
                        ));
                    }else{
                        array_push($comparaciones, array(
                            'campo' => $searchParam->field,
                            'valor' => $searchParam->value,
                            'signo' => $searchParam->comparison == 'gt' ? '>' : '<',
                        ));
                    }
                } else {
                    $uiParams[$searchParam->field] = $searchParam->value;
                }
            }
            $uiParams['comparaciones'] = $comparaciones;
            unset($uiParams['filter']);
        }
    }

    /**
     * Funcionalidades comunes a todos los controladores
     */
    public function getallusersAction()
    {
        $this->datos = $this->seguridadHelper->obtenerTodosUsuarios(0, 1000);
    }

    public function getallespecialidadAction()
    {
        $this->uiParams['gridSearch'] = true;
        $this->uiParams['restringir'] = 0;
        $this->objectHelper->synchronize(
            $this, $this->configuracionHelper->obtenerEspecialidades($this->uiParams)
        );
    }

    public function adicionarCompartimentacionEspAction()
    {
        $idusuario = $this->uiParams['idusuario'];
        $marcados = (array)Zend_Json::decode($this->uiParams['marcados']);
        $desmarcados = (array)Zend_Json::decode($this->uiParams['desmarcados']);

        Doctrine_Query::create()->delete('CfgUsuarioespecialidad')
            ->where('idusuario = ?', $idusuario)
            ->whereIn('idespecialidad', $desmarcados)
            ->execute();

        $collection = new Doctrine_Collection('CfgUsuarioespecialidad');
        foreach ($marcados as $value) {
            $record = new CfgUsuarioespecialidad();
            $obj = Doctrine::getTable('CfgUsuarioespecialidad')
                ->findByDql('idusuario = ? AND idespecialidad = ?', array($idusuario, $value))
                ->getFirst();
            if ($obj->idusuarioespecialidad) {
                $record->assignIdentifier($obj->idusuarioespecialidad);
            }
            $record->synchronizeWithArray(array('idusuario' => $idusuario, 'idespecialidad' => $value));
            $collection->add($record);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return array('success' => true);
    }


    public function obtenerElementosAction()
    {
        $datos = ServiciosContabilidadFinanzasHelper::__init()->
        obtenerElementosHoja(200530666);
        foreach ($datos as &$d) {
            $d->descripcion = $d->codigoelementoobjeto . ' ' . $d->descripcionelementoobjeto;
        }
        $this->datos = $datos;
    }

}

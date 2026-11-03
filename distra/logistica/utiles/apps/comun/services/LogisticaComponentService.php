<?php

/**
 * Clase para el acceso a los componentes descritos en los ficheros de
 * configuracion de componentes
 *
 * @package    Servicios
 * @subpackage Logistica
 * @author     Kenier Cumba Bueno
 */
class LogisticaComponentService implements ISingletonClass
{

    /**
     * Instancia de la clase JSONComponent para el acceso a los componentes
     *
     * @var JSONComponent
     */
    private $jsonComponent;

    /**
     * Arreglo con las URL de los scripts y los css cargados por el componete
     *
     * @var Array
     */
    private $arrayULR;

    /**
     * Variable para controlar el acceso a la instancia unica de la clase
     *
     * @var LogisticaComponentService
     */
    protected static $instance = null;

    /**
     *
     * @var type
     */
    private $isService;

    /**
     *
     * @var type
     */
    private $global;
    private $isLogistica;

    /**
     * Clase para el acceso a los componentes descritos en los ficheros de
     * configuracion de componentes
     */
    public function __construct()
    {
        $this->jsonComponent = JSONComponent::__init(true);
        $this->arrayULR = array('<!-- Inicio de los scripts del componente _cmp -->');
        $this->isService = true;
        $this->global = ZendExt_GlobalConcept::getInstance();
    }

    /**
     *
     * @param string                    $componentName Nombre del componente a inicializar
     * @param ZendExt_Controller_Secure $controller    Controlador al que se
     *                                                 asignan los scripts
     */
    public function getComponent($componentName, ZendExt_Controller_Secure $controller = null, $isLogistica = true)
    {
        $this->isLogistica = $isLogistica;
        if ($this->getIsService()) {
            $this->autoLoadViwFolder();
        }
        $this->jsonComponent->loadDefinitionsFile('srv.definitions');
        $this->jsonComponent->buildComponent($componentName, null);
        $this->proccessULRs($this->jsonComponent->componentFiles);
        if (!is_null($controller)) {
            if ($controller->view->arrayJs) {
                $this->arrayULR = array_merge($controller->view->arrayJs, $this->arrayULR);
            }
            $controller->view->arrayJs = $this->arrayULR;
        }
        array_push($this->arrayULR, "<!-- Fin de los scripts del componente _cmp -->");
        $this->arrayULR = str_replace('_cmp', $componentName, $this->arrayULR);
        return $this->arrayULR;
    }

    /**
     * Metodo que devuelve la instancia de la clase
     *
     * @return JSONComponent
     */
    public static function __init()
    {
        if (null == self::$instance) {
            self::$instance = new LogisticaComponentService;
        }
        self::$instance->setIsService(false);
        return self::$instance;
    }

    /**
     * Metodo que recorre las configuraciones y las incopora al arreglo global
     *
     * @param array $componentFiles Arreglo de las dependencias del componente
     */
    public function proccessULRs($componentFiles = array())
    {
        $config = LogisticaConfigHelper::__init()->loadConfig('comunview')->get('log');
        $this->loadScript($config['idiomas']);
        $this->loadScript($config['util-scripts']);
        $this->loadCss($config['estilos']);
        foreach ($componentFiles as $key => $value) {
            if ($key == 'estilos') {
                $this->loadCss($value);
            } else {
                $this->loadScript($value);
            }
        }
    }

    /**
     *
     * @param type $arrayCss
     */
    public function loadCss($arrayCss = array())
    {
        foreach ($arrayCss as $css) {
            if (!$css['ext']) {
                $cssDir = '<link rel="stylesheet" type="text/css" href="%s"/>';
                if (is_array($css)) {
                    array_push($this->arrayULR, sprintf($cssDir, $css['css']));
                }
            }
        }
    }

    /**
     *
     * @param type $arrayJS
     */
    public function loadScript($arrayJS = array())
    {
        $arrayJS = str_replace('locale', $this->global->Perfil->idioma, $arrayJS);
        $jsDir = '<script type="text/javascript" src="%s"></script>';
        foreach ($arrayJS as $js) {
            if (is_array($js)) {
                array_push($this->arrayULR, sprintf($jsDir, $js['js']));
            } else {
                array_push($this->arrayULR, sprintf($jsDir, $js));
            }
        }
    }

    /**
     *
     * @return type
     */
    public function getIsService()
    {
        return $this->isService;
    }

    /**
     *
     * @param type $isService
     */
    public function setIsService($isService)
    {
        $this->isService = $isService;
    }

    public function autoLoadViwFolder()
    {
        $dirApps = Zend_Registry::getInstance()->get('config')->dir_aplication;
        $srcViews = PATH_SEPARATOR . '' . $dirApps . '/logistica/utiles/comun/views/scripts';
        $srcViews .= PATH_SEPARATOR . '' . $dirApps . '/logistica/utiles/comun/helpers';
        set_include_path(get_include_path() . $srcViews);
    }

    public function initComponent($component = '')
    {
        if ($component) {
            $this->jsonComponent = JSONComponent::__init();
            $this->jsonComponent->loadDefinitionsFile('cmp.definitions');
            $component = $this->jsonComponent->getComponent('log.lb.maestroproductos');
            $this->jsonComponent->loadComponent('log.lb.maestroproductos');
            $this->jsonComponent->buildDependencies($component);
            $this->jsonComponent->getComponentRequiredFiles($component, true);
            $this->jsonComponent->loadPath();
            $this->maestroProductoModel = new MaestroProductoModel;
        }
    }

}

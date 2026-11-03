<?php

/**
 * Description of JSONComponent
 *
 * @author Kenier Cumba Bueno
 */
class JSONComponent implements IComponentParser, ISingletonClass
{

    private $path,
        $loadedComponents,
        $includedComponents,
        $loadedPath,
        $jsonLoader,
        $dirApps,
        $componentFiles;
    private static $jsonComponent = null;

    private function __construct()
    {
        $this->path = '';
        $this->loadedComponents = array();
        $this->includedComponents = array();
        $this->componentFiles = array(
            'idiomas' => array(),
            'estilos' => array(),
            'scripts' => array(),
        );
        $this->loadedPath = false;
        $this->jsonLoader = JSONConfigLoader::__init();
        $file = Zend_Registry::getInstance()->get('config')->dir_aplication;
        $this->dirApps = $file . '' . DIRECTORY_SEPARATOR;
    }

    public function __get($name)
    {
        if (isset($this->$name)) {
            return $this->$name;
        }
        return null;
    }

    public function buildComponent($component, BaseController $controller = null)
    {
        $cmp = $this->initComponent($component);
        $this->loadPath();
        if ($controller && $controller instanceof BaseController) {
            $controller->view->mainViewJs = $this->loadMainView($cmp);
            $controller->proccessConfig($this->componentFiles);
        }
    }

    public function initComponent($component, $autoloadPath = false, $isPrincipal = true)
    {
        $objComponent = $this->getComponent($component);
        $this->loadComponent($component, $autoloadPath);
        $this->buildDependencies($objComponent, $isPrincipal);
        $this->getComponentRequiredFiles($objComponent, $autoloadPath);
        return $objComponent;
    }

    public function buildDependencies($component, $isPrincipal = true)
    {
        $this->buildIncluded($component);
        if ($isPrincipal) {
            $this->buildRequired($component);
        }
    }

    public function getComponentRequiredFiles($component, $autoloadPath = false)
    {
        if (!$autoloadPath) {
            $this->loadCSSFiles($component);
            $this->loadLocaleFiles($component);
            $this->loadJSFiles($component);
        } else {
            $this->getComponentRequiredPath($component);
        }
    }

    public function getComponentRequiredPath($cmp)
    {
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'controllers';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'services';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'validators';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'plugins';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'models/bussines';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'models/domain';
        $this->path .= PATH_SEPARATOR . $this->dirApps . $cmp['src'] . DIRECTORY_SEPARATOR . 'models/domain/generated';
        //$this->autoLoad.= PATH_SEPARATOR . $component['src'] . DIRECTORY_SEPARATOR . 'views/scripts';
    }

    public function isLoadedComponent($component)
    {
        return isset($this->loadedComponents[$component]) ? true : false;
    }

    public function isIncludedComponent($component)
    {
        return isset($this->includedComponents[$component]) ? true : false;
    }

    public function loadComponent($component, $include = false)
    {
        if (!$include) {
            $this->requireComponent($component);
        } else {
            $this->includeComponent($component);
        }
    }

    public function requireComponent($component)
    {
        $this->loadedComponents[$component] = true;
    }

    public function includeComponent($component)
    {
        $this->includedComponents[$component] = true;
    }

    public function loadDefinitionsFile($file)
    {
        $this->jsonLoader->load($file);
        return $this;
    }

    public function buildIncluded($component)
    {
        if ($this->arrayHasValues($component['include'])) {
            foreach ($component['include'] as $cmp) {
                $components = explode(',', $cmp);
                if ($this->arrayHasValues($components)) {
                    foreach ($components as $strComponent) {
                        if (!$this->isIncludedComponent($strComponent)) {
                            $this->initComponent($strComponent, true, false);
                        }
                    }
                }
            }
        }
    }

    public function buildRequired($component)
    {
        if ($this->arrayHasValues($component['require'])) {
            foreach ($component['require'] as $cmp) {
                $components = explode(',', $cmp);
                if ($this->arrayHasValues($components)) {
                    foreach ($components as $strComponent) {
                        if (!$this->isLoadedComponent($strComponent)) {
                            $this->initComponent($strComponent, false);
                        }
                    }
                }
            }
        }
    }

    public function loadCSSFiles($component)
    {
        if ($this->arrayHasValues($component['css'])) {
            foreach ($component['css'] as $css) {
                $cadenaURL = "/%s/views/css/%s";
                $files = array();
                if ($css) {
                    $files = explode(',', $css);
                }
                if ($this->arrayHasValues($files)) {
                    foreach ($files as $cssURL) {
                        array_push(
                            $this->componentFiles['estilos'],
                            array(
                                'tipo' => 'file',
                                'css' => sprintf($cadenaURL, $component['src'], $cssURL)
                            )
                        );
                    }
                }
            }
        }
    }

    public function loadJSFiles($component)
    {
        if ($this->arrayHasValues($component['js'])) {
            foreach ($component['js'] as $script) {
                $cadenaURL = "/%s/views/js/%s";
                $files = array();
                if ($script) {
                    $files = explode(',', $script);
                }
                if ($this->arrayHasValues($files)) {
                    foreach ($files as $scriptURL) {
                        array_push(
                            $this->componentFiles['scripts'],
                            array(
                                'tipo' => 'file',
                                'js' => sprintf($cadenaURL, $component['src'], $scriptURL)
                            )
                        );
                    }
                }
            }
        }
    }

    public function loadLocaleFiles($component)
    {
        if ($this->arrayHasValues($component['idiomas'])) {
            foreach ($component['idiomas'] as $idioma) {
                $cadenaURL = "/%s/views/idioma/locale/%s";
                $files = array();
                if ($idioma) {
                    $files = explode(',', $idioma);
                }
                if ($this->arrayHasValues($files)) {
                    foreach ($files as $idiomaURL) {
                        array_push(
                            $this->componentFiles['idiomas'], sprintf($cadenaURL, $component['src'], $idiomaURL)
                        );
                    }
                }
            }
        }
    }

    public function getComponent($component, $validar = false)
    {
        $arrayCMP = explode('.', $component);
        $cmp = null;
        if (count($arrayCMP)) {
            $cmp = $this->jsonLoader->$arrayCMP[0];
            for ($level = 1; $level < count($arrayCMP); $level++) {
                $cmp = $cmp[$arrayCMP[$level]];
            }
        }
        if ($validar) {
            return $cmp != null && $this->existComponentDir($cmp);
        }
        return $cmp;
    }

    /**
     *
     * @return JSONComponent
     */
    public static function __init($newInstance = false)
    {

        if (NULL == self::$jsonComponent) {
            self::$jsonComponent = new JSONComponent;
        }
        return self::$jsonComponent;
    }

    public function arrayHasValues($array)
    {
        return count($array) > 0 ? true : false;
    }

    public function loadMainView($component)
    {
        if ($component['main-view']) {
            $cadenaURL = "/%s/views/js/%s";
            $view = explode('.', $component['main-view']);
            $mainView = implode('.main.', $view);
            $cad = sprintf($cadenaURL, $component['src'], $mainView);
            return $cad;
        }
        return '';
    }

    public function loadPath()
    {
        if (!$this->loadedPath) {
            set_include_path(get_include_path() . $this->path);
        }
    }

    public function existComponentDir($component)
    {
        return is_dir($this->dirApps . $component['src']);
    }

}

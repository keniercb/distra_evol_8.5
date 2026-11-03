<?php

/**
 * Class GenerateServerSide
 */
class GenerateServerSide extends GeneratorCodePersona
{
    public $moduleName;
    /**
     * @var dirección del proyecto en apps
     */
    private $appsPath;
    /**
     * @var array arquitectura de ficheros en apps
     */
    private $arrAppsArchitect;
    /**
     * @var string
     */
    private $className;

    /**
     * @param $nameProject
     * @param $appsPath
     * @param $arrAppsArchitect
     */
    function __construct($nameProject, $appsPath, $arrAppsArchitect)
    {
        $this->nameProject = $nameProject;
        $this->appsPath = $appsPath;
        $this->arrAppsArchitect = $arrAppsArchitect;
        $this->fileManager = new ZendExt_File ();
        $this->className = $this->formatClassName($nameProject);
    }

    /**
     * Da formato al nombre de la clase segun el estandar de codigo
     *
     * @param $className
     *
     * @return string
     */
    private function formatClassName($className)
    {
        return ucfirst(strtolower($className));
    }

    /**
     * Funcion que crea la estructura de carpetas del proyecto en apps
     *
     * @param null $chmod
     */
    public function createFileAppsProject($chmod = null)
    {
        foreach ($this->arrAppsArchitect as $k => $v) {
            $this->arrAppsArchitect[$k] = str_replace('{}', $this->nameProject, $v);
            $this->fileManager->mkdir($this->appsPath . $this->arrAppsArchitect[$k], $chmod);
        }
    }

    /**
     * Crea los ficheros php y pHtml de la personalizacion
     */
    public function generatePhpFiles($projectConfig, $moduleName)
    {
        if ($moduleName) {
            $this->moduleName = $moduleName;
            $this->generateControllerFile();
            //$this->createModelInheritance();
            $this->generatePHTMLFile($projectConfig['denominacion']);
        } else {
            throw new Exception('No existe modulo sobre el cual se registrar el proyecto como componente.');
        }
    }

    /**
     *
     */
    public function generateControllerFile()
    {
        $includ = $this->arrAppsArchitect['controllers'] . '/' . $this->className . self::CONTROLLER_NAME . '.php';
        $path = $this->appsPath . $includ;
        if (!file_exists($path)) {
            $class = $this->createControllerClass();
            $code = new Zend_CodeGenerator_Php_File ();
            $code->setClass($class);
            $classCode = $code->generate();
            $this->fileManager->mkfile($this->injectInclude(array('apps/pvd/persona/controllers'), $classCode), $path);
        }
    }

    /**
     *
     */
    private function createControllerClass()
    {
        $classController = new Zend_CodeGenerator_Php_Class();
        $classController->setName($this->className . self::CONTROLLER_NAME);
        $classController->setExtendedClass(self::CONTROLLER_EXTEND);
        $classController->setDocblock('Clase controladora de la personalización de persona ' . $this->nameProject);
        $this->createFunctionsToControllerClass($classController);

        return $classController;
    }

    /**
     * @param $classController
     */
    private function createFunctionsToControllerClass(&$classController)
    {
        $methodInit = new Zend_CodeGenerator_Php_Method();
        $methodInit->setName('init');
        $methodInit->setDocblock('Inicializa las variables necesarias');
        $methodInit->setBody('parent::init();');
        $methodRender = new Zend_CodeGenerator_Php_Method();
        $methodRender->setName(strtolower($this->nameProject) . 'Action');
        $methodRender->setDocblock('Inicializa las variables necesarias');
        $code = '$this->cargaInicial' . "('$this->moduleName', '$this->nameProject');" . self::LINE_FEED;
        $code .= '$this->render();';
        $methodRender->setBody($code);
        $methods = array(
            $methodInit, $methodRender);
        $classController->setMethods($methods);
    }

    private function injectInclude($arrDir, $code)
    {
        $codeController = '<?php' . self::LINE_FEED . '$dirwww = $_SERVER["DOCUMENT_ROOT"];' . self::LINE_FEED .
            '//Direccion del Marco de trabajo relativa a la carpeta de publicacion.' . self::LINE_FEED .
            '$dirrelmt = "/";' . self::LINE_FEED . '//Direccion absoluta del marco de trabajo' . self::LINE_FEED .
            //'$dirabsmt = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);' . self::LINE_FEED .
            '$dirabsmt = str_replace("//", "/", str_replace("web","",$dirwww). $dirrelmt);' . self::LINE_FEED .
            '$config["include_path"] = get_include_path();' . self::LINE_FEED;
        foreach ($arrDir as $v) {
            $config = '$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "';
            $codeController .= $config . $v . '";' . self::LINE_FEED;
        }
        $comment = '//Se inicializa el include path de php a partir de la variable de configuracion';
        $codeController .= $comment . self::LINE_FEED . 'set_include_path($config["include_path"]);' . self::LINE_FEED;
        $codeController .= str_replace('<?php', '', $code);

        return $codeController;
    }

    public function generatePHTMLFile($title)
    {
        $code = '<html>' . self::LINE_FEED;
        $code .= '<head>' . self::LINE_FEED;
        $code .= $this->indentation . "<title>$title</title>" . self::LINE_FEED;
        $meta = '<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
        $code .= $this->indentation . $meta . self::LINE_FEED;
        $code .= $this->indentation . '<?php echo $this->headLink(); ?>';
        $code .= self::LINE_FEED . '</head>';
        $code .= self::LINE_FEED . '<body>' . self::LINE_FEED;
        $code .= $this->indentation . '<?php echo $this->headScript(); ?>';
        $code .= self::LINE_FEED . '</body>';
        $code .= self::LINE_FEED . '</html>';
        $path = $this->appsPath . $this->arrAppsArchitect['phtml'] . '/' . strtolower($this->nameProject) . '.phtml';
        $this->fileManager->mkfile($code, $path);
    }

    private function createModelInheritance()
    {
        $dir = Zend_Registry::getInstance()->config->modulo_path . '/models/bussines/';
        $d = dir($dir);
        while ($name = $d->read()) {
            if (!preg_match('/Model\.(php)$/', $name)) {
                continue;
            }
            $nameClass = explode('Model.php', $name);
            $parentClass = $nameClass[0] . self::MODEL_NAME;
            $className = $this->formatClassName($nameClass[0] . $this->nameProject) . self::MODEL_NAME;
            $path = $this->appsPath . $this->arrAppsArchitect['bussines'] . '/' . $className . '.php';
            if (!file_exists($path)) {
                $code = new Zend_CodeGenerator_Php_File ();
                $code->setClass($this->createModelsClass($className, $parentClass));
                $accesToDomain = $this->appsPath . $this->arrAppsArchitect['domain'];
                $classCode = $code->generate();
                $this->fileManager->mkfile($this->injectInclude(array($accesToDomain), $classCode), $path);
            }
        }
        $d->close();
    }

    private function createModelsClass($className, $parentClass)
    {
        $classController = new Zend_CodeGenerator_Php_Class();
        $classController->setName($className);
        $classController->setExtendedClass($parentClass);

        //$classController->setDocblock('Clase controladora de la personalización de persona ' . $this->nameProject);
        return $classController;
    }
}
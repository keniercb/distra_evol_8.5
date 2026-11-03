<?php

class ComponentSpecModel extends ZendExt_Model
{

    private $_fileMgr;
    private $_cmpReference = null;
    private static $_cmpElements
        = array('controllers', 'models', 'views', 'validators', 'notificators',
                'services');
    const COMUN_SPEC = 'comun';
    const ACTION_SUFIX = 'Action';
    const SEPARATOR = '-';


    public static function applyConfig($childNodes, $areLeaf = false)
    {
        $childNodesConfig = array();
        foreach ($childNodes as $node) {
            $nodeConfig['id'] = is_array($node) ? $node['id'] : $node;
            $nodeConfig['leaf'] = $areLeaf;
            $nodeConfig['text'] = end(
                explode(
                    self::SEPARATOR, is_array($node) ? $node['text'] : $node
                )
            );
            $childNodesConfig[] = $nodeConfig;
        }

        return $childNodesConfig;
    }

    public function   __construct()
    {
        parent::ZendExt_Model();
        $appsPath = Zend_Registry::getInstance()->config->dir_aplication;
        $this->_fileMgr = new ZendExt_File($appsPath);
    }

    /**
     * mostrarFuncionalidades
     * Retorna un arreglo serializado (para mostrarlos en un árbol)
     * de subsistemas, módulos, clases, o funciones
     * en dependencia de la referencia del padre.
     *
     * @param string $node
     * @param string $classesFolder
     *
     * @return array
     */
    public function mostrarFuncionalidades(
        $node, $classesFolder = "controllers"
    )
    {
        $classSufix = substr(
            ucfirst($classesFolder), 0, strlen($classesFolder) - 1
        );
        $passedArgs = func_get_args();
        if (strstr($node, $classSufix)) {
            $reference = explode(self::SEPARATOR, $node);
            $class = end($reference);
            unset($reference[count($reference) - 1]);
            $reference = implode(DIRECTORY_SEPARATOR, $reference);
            $classPath
                = $this->_fileMgr->get_path() . DIRECTORY_SEPARATOR . $reference
                . DIRECTORY_SEPARATOR . $classesFolder
                . DIRECTORY_SEPARATOR . $class . ".php";
            $functionalities = array();
            if ($this->_fileMgr->type($classPath) == 'file') {
                require_once $classPath;
            } else {
                return self:: applyConfig($functionalities);
            }
            $controller = new Zend_Reflection_Class($class);
            $actions = $controller->getMethods(ReflectionMethod::IS_PUBLIC);
            foreach ($actions as $action) {
                $action = $action->getName();
                if (isset($passedArgs[1])
                    || strstr(
                        $action, self::ACTION_SUFIX
                    )
                ) {
                    $functionalities[] = implode(
                        self::SEPARATOR, array($node, $action)
                    );
                }
            }
            unset($controller);
            unset($actions);

            return self:: applyConfig($functionalities, true);
        } else {
            $nodePath = str_replace(
                self::SEPARATOR, DIRECTORY_SEPARATOR, $node
            );
            $subfolders = ($node == "0")
                ? $this->_fileMgr->lsd()
                :
                $this->_fileMgr->lsd(
                    $this->_fileMgr->get_path() . DIRECTORY_SEPARATOR
                    . $nodePath
                );
            $isCmp = false;
            $modules = array();
            foreach ($subfolders as $folder) {
                $folder = end(explode(DIRECTORY_SEPARATOR, $folder));
                if (array_search($folder, self::$_cmpElements)) {
                    $isCmp = true;
                    break;
                }
                if ($folder != self::COMUN_SPEC && !strstr($folder, '.svn')) {
                    $modules[] = ($node != "0") ? implode(
                        self::SEPARATOR, array($node, $folder)
                    ) : $folder;
                }
            }
            if (!$isCmp) {
                return self:: applyConfig($modules);
            } else {
                unset($modules);
                $this->_fileMgr->set_path(
                    $this->_fileMgr->get_path() . DIRECTORY_SEPARATOR
                    . $nodePath . DIRECTORY_SEPARATOR . $classesFolder
                );
                $controllers = $this->_fileMgr->ls();
                $classes = array();
                if (count($controllers) > 0) {
                    foreach ($controllers as $controller) {
                        if ($this->_fileMgr->type($controller) == 'file') {
                            $controller = end(
                                explode(DIRECTORY_SEPARATOR, $controller)
                            );
                            if (isset($passedArgs[1])
                                || strstr(
                                    $controller, $classSufix
                                )
                            ) {
                                $classes[] = implode(
                                    self::SEPARATOR, array($node, substr(
                                        $controller, 0, count($controller) - 5
                                    ))
                                );
                            }
                        }
                    }
                }

                return self:: applyConfig($classes);
            }
        }
    }

    /**
     * getComponentByFullReference
     * Devuelve la referencia de un componente dada una referencia de una
     * acción.
     *
     * @param string $fullReference
     * @param string $sepator
     *
     * @returns string
     */
    public static function getComponentByFullReference(
        $fullReference, $separator = null
    )
    {
        $fullReference = explode(
            ($separator) ? $separator : self::SEPARATOR, $fullReference
        );
        $count = count($fullReference);
        unset($fullReference[$count - 1]);
        unset($fullReference[$count - 2]);

        return implode(
            ($separator) ? $separator : self::SEPARATOR, $fullReference
        );
    }

    public function __set($attrib, $value)
    {
        if ($attrib == 'cmpReference') {
            $cmpReference = str_replace(
                self::SEPARATOR, DIRECTORY_SEPARATOR, $value
            );
            $realPath = $this->_fileMgr->get_path() . DIRECTORY_SEPARATOR
                . $cmpReference;
            if ($this->_fileMgr->type($realPath) == 'dir') {
                $this->$attrib = $realPath;
            }
        }
    }

    public function __get($attrib)
    {
        switch ($attrib) {
            case 'fileMng':
                return $this->_fileMgr;
            case 'cmpReference':
                return $this->_cmpReference;
            default:
                return null;
        }
    }
}
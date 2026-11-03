<?php

/**
 * Class GestionarConfiguracion
 */
class GestionarConfiguracion
{
    /**
     * @var ReadWriteConfiguracion
     */
    private $objReadConfig,
            $configuracion;

    /**
     *
     */
    function __construct()
    {
        $this->objReadConfig = ReadWriteConfiguracion::getInstance();
        $this->configuracion = $this->objReadConfig->getConfigModules();
    }

    /**
     * Existe el modulo
     * @param string|GeneratorModule $module
     * @return bool
     */
    public function hasModule($module)
    {
        if ($module instanceof GeneratorModule) {

        } else if (is_string($module)) {
            return ($this->configuracion->$module) ? true : false;
        }
    }

    public function addModule(GeneratorModule $module)
    {
        if (!$this->hasModule($module)) {
            $this->objReadConfig->writeInFileJson($module->generate(), $this->modulo_path);
        }
        return $module;
    }

    /**
     * Existe el componente
     * @param $components
     */
    public function hasComponent($components, $moduleName = null)
    {
        if ($components instanceof GeneratorComponent) {

        } else if (is_string($components)) {
            if ($moduleName && is_string($moduleName)) {
                return isset($this->configuracion[$moduleName]['component'][$components]) ? true : false;
            }
        }
    }

    public function addComponent(GeneratorComponent $components, $moduleName, $overWrite = false)
    {
        if (!$this->hasModule($moduleName)) {
            if (!$this->hasComponent($components->getName(), $moduleName) || $overWrite) {
                $cmpName = $components->getName();
                $cmpConfig = $components->generate();
                $this->configuracion[$moduleName]['component'][$cmpName] = $cmpConfig->$cmpName;
                $this->objReadConfig->writeInFileJson($this->configuracion, $this->objReadConfig->getSubsistemByModule($moduleName));
            } else {
                throw new Exception('Ya existe un componente con esa denominaci&oacute;n.');
            }
        }
    }

    public function addRequired()
    {

    }

}
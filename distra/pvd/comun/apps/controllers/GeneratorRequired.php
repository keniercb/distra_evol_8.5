<?php

class GeneratorRequired //extends GeneratorConfig_Abstract
{
    protected $moduleName;

    protected $cmpName;

    function __construct($arrRequired = null)
    {
        if(is_array($arrRequired)){
            $this->moduleName = $arrRequired['module'];
            $this->cmpName = $arrRequired['component'];
        }
    }

    /**
     * @param mixed $cmpName
     */
    public function setCmpName($cmpName)
    {
        $this->cmpName = $cmpName;
    }

    /**
     * @return mixed
     */
    public function getCmpName()
    {
        return $this->cmpName;
    }

    /**
     * @param mixed $moduleName
     */
    public function setModuleName($moduleName)
    {
        $this->moduleName = $moduleName;
    }

    /**
     * @return mixed
     */
    public function getModuleName()
    {
        return $this->moduleName;
    }

    public function generate()
    {
        $module = 'module'; //self::MODULE;
        $cmp = 'component'; //self::CMP;
        $required->$module = $this->moduleName;
        $required->$cmp = $this->cmpName;
        return $required;
    }
}
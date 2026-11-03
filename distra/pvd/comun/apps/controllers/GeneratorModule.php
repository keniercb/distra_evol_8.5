<?php
/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 17/03/14
 * Time: 22:13
 */

class GeneratorModule extends GeneratorConfig_Abstract
{
    protected $name;

    protected $src = null;

    protected $components;

    function __construct($module = null)
    {
        $this->components = new stdClass();
    }

    /**
     * Set Nombre del modulo
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * Get Nombre del modulo
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set Src
     * @param string $src
     */
    public function setSrc($src)
    {
        $this->src = $src;
    }

    /**
     * Get Src
     * @return mixed
     */
    public function getSrc()
    {
        return $this->src;
    }

    /**
     * Set Componentes
     * @param array $component
     * @return $this
     */
    public function setComponents(array $components)
    {
        foreach ($components as $v) {
            $this->setComponent($v);
        }
        return $this;
    }

    /**
     * Set Componente
     * @param $components
     */
    public function setComponent($component)
    {
        $this->components = $components;
    }

    /**
     * Get Componentes
     * @return mixed
     */
    public function getComponents()
    {
        return $this->components;
    }

    /**
     * Get Componente
     *
     * @param string $methodName
     * @return Zend_CodeGenerator_Php_Method
     */
    public function getMethod($componentName)
    {
        foreach ($this->components as $component) {
            /*if ($component->getName() == $componentName) {
                return $component;
            }*/
        }
        return false;
    }

    /**
     * Existe el componente
     * @param $componentName
     * @return bool
     */
    public function hasMethod($componentName)
    {
        return isset($this->components->$componentName);
    }

    public function generate()
    {
        return true;
    }

} 
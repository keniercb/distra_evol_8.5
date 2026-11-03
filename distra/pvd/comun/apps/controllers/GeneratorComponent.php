<?php

class GeneratorComponent //extends GeneratorConfig_Abstract
{
    private $name = null;

    private $js = null;

    private $css = null;

    private $idioma = null;

    private $required = null;

    /**
     * Adiciona un nuevo css
     * @param string $css
     */
    public function addCss($css)
    {

    }

    /**
     * @param null $css
     */
    public function setCss($css)
    {
        $this->css = $css;
    }

    /**
     * @return null
     */
    public function getCss()
    {
        return $this->css;
    }

    /**
     * @param null $idioma
     */
    public function setIdioma($idioma)
    {
        $this->idioma = $idioma;
    }

    /**
     * @return null
     */
    public function getIdioma()
    {
        return $this->idioma;
    }

    /**
     * @param null $js
     */
    public function setJs($js)
    {
        if (!isset($this->js[$js])) {
            $this->js[$js] = $js;
        }
        return $this;
    }

    /**
     * @return null
     */
    public function getJs()
    {
        return $this->js;
    }

    /**
     * @param null $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return null
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Adiciona un nuevo required
     * @param $required
     */
    public function addRequired($required)
    {

    }

    /**
     * @param null $required
     */
    public function setRequired($required)
    {
        if (is_array($required)) {
            $required = new GeneratorRequired($required);
            $requiredName = $required->getModuleName() . '-' . $required->getCmpName();
        } elseif ($required instanceof GeneratorRequired) {
            $requiredName = $required->getModuleName() . '-' . $required->getCmpName();
        }

        if (!isset($this->required[$requiredName])) {
            $this->required[$requiredName] = $required;
        }
        return $this;
    }

    /**
     * @return null
     */
    public function getRequired()
    {
        return $this->required;
    }

    /**
     * Existe el required
     * @param $required
     */
    public function hasRequired($required)
    {

    }

    public function generate()
    {
        $cmp = new stdClass();
        $name = $this->name;
        $cmp->$name;
        foreach ($this->required as $v) {
            $cmp->$name->required[] = $v->generate();
        }
        $cmp->$name->js = $this->getArrayByVariablesLocales($this->js);
        $cmp->$name->css = $this->getArrayByVariablesLocales($this->css);
        $cmp->$name->idioma = $this->getArrayByVariablesLocales($this->idioma);
        return $cmp;
    }

    private function getArrayByVariablesLocales($arr)
    {
        $arrTmp = array();
        foreach ($arr as $v) {
            $arrTmp[] = $v;
        }
        return $arrTmp;
    }
}
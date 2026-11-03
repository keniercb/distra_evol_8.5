<?php

/**
 * Created by PhpStorm.
 * User: kenier
 * Date: 27/10/16
 * Time: 13:30
 */
class EstructuraIntegracionValidator
{
    private $validadores;

    public function __construct()
    {
        $this->validadores = array();
        $this->cargarValidadores();
    }

    public function addValidador($validador)
    {
        array_push($this->validadores, $validador);
    }

    public function validarEliminar($arrayIdEstructura)
    {
        foreach ($this->validadores as $validador) {
            if (!$validador->validarEliminar($arrayIdEstructura)) {
                return false;
            }
        }
        return true;
    }

    private function loadFile($file)
    {
        return include_once $file;
    }

    private function cargarValidadores()
    {
        $cfgValidadores = $this->loadFile('validators.php');
        if (!is_array($cfgValidadores)) {
            return;
        }
        $dirMT = Zend_Registry::getInstance()->get('config')->dir_aplication;
        foreach ($cfgValidadores as $validador) {
            $dirValidador = $dirMT . $validador['dir'];
            set_include_path(get_include_path() . PATH_SEPARATOR . $dirValidador);
            if ($validador['activo'] == 1 && class_exists($validador['clase'])) {
                $this->addValidador(new $validador['clase']);
            }
        }
    }


}
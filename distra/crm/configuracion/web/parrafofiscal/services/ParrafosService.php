<?php

class ParrafosService extends ZendExt_Model
{
    public function __construct()
    {
    }

    public function BuscarPorId($idparrafofiscal)
    {
        $model = new ParrafofiscalModel();
        $result = $model->BuscarPorId($idparrafofiscal);
        $standart = new ZendExt_ClassStandard();
        return $standart->Object($result);
    }

    public function ArbolParrafos()
    {
        $dir_rel_app = Zend_Registry::get('config')->uri_aplication;
        $dir_controller = $dir_rel_app
            . '/configuracion/parrafofiscal/index.php/arbolparrafofiscal/arbolparrafofiscal';
        header("Location: $dir_controller");
    }

    public function BuscarPorEntidad($idestructuracomun)
    {
        $model = new ParrafofiscalModel();
        $result = $model->BuscarPorEntidad($idestructuracomun);
        $standart = new ZendExt_ClassStandard();
        return $standart->ArrayObject($result);
    }
}

?>

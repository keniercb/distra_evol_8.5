<?php

class DatGestionaractividadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatGestionaractividad($datGestionaractividad)
    {
        $datGestionaractividad->save();
    }

    public function modificardatGestionaractividad($datGestionaractividad)
    {
        $datGestionaractividad->save();
    }

    public function eliminardatGestionaractividad($datGestionaractividad)
    {
        $datGestionaractividad->delete();
    }

    public function listareventosFecha($params)
    {
        if (is_array($params['identidad'])) {
            $params['identidad'] = implode(',', $params['identidad']);
        }
        return DatGestionaractividad::listartodaslasActividades($params);
    }

    public function listarcartasTecnologicas($params)
    {
        return DatGestionaractividad::listarcartasTecnologicas($params);
    }
}



<?php

class DatAjusteexistenciaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAjusteexistencia($datAjusteexistencia)
    {
        $datAjusteexistencia->save();
    }

    public function insertardatAjusteexistencia_cc($obj)
    {
        $data = DatAjusteexistencia::existe_ccc($obj);
        return $data;
    }

    public function adicionardatAjusteexistencia_cc($obj)
    {
        $obj->save();
    }

    public function modificardatAjusteexistencia($datAjusteexistencia)
    {
        $datAjusteexistencia->save();
    }

    public function eliminardatAjusteexistencia($datAjusteexistencia)
    {
        $datAjusteexistencia->delete();
    }

    public function eliminardatAjusteexistenciaCc($datAjusteexistencia)
    {
        $datAjusteexistencia->delete();
    }

   /* public function listarIndicadoresExistenciaOD($start, $limit, $parametros)
    {

        $data = DatAjusteexistencia::listarIndOD($start, $limit, $parametros);
        return $data;
    }*/

   /* public function listarIndAjusteCB($start, $limit, $parametros)
    {

        $data = DatAjusteexistencia::listarIndicadoresAjusteCB(
            $start, $limit, $parametros
        );
        return $data;
    }*/

}



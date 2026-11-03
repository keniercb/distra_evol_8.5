<?php

class NomTipoareatModel extends NomencladoresLogisticaModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($array)
    {

        $obj = parent::insertarNomenclador($array, true);
        if (!is_object($obj)) {
            return $obj;
        }
        unset($array['idnomtipoarea']);

        $obj->save();
        return true;
    }

//    

    public function buscar($obj)
    {
        $arr = parent::buscar($obj, array(), true);

        $query = $arr['query'];


        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';

        if (class_exists($clasEntidad)) {
            $res = $query->addSelect("e.idtipoareaentidad as idtipoareaentidad")
                ->limit(($obj['limit']) ? $obj['limit'] : 30)
                ->offset(($obj['start']) ? $obj['start'] : 0)
                ->orderBy("{$obj['idnom']} DESC")->fetchArray();

        }


        $resultado = array('cantidad' => $arr['cant'], 'datos' => $res);
        return $resultado;
    }


    public function modificarNomenclador($array)
    {
        $obj = parent::modificarNomenclador($array, true);
        if (!is_object($obj)) {
            return $obj;
        }
//        }
        $obj->save();
        return true;
    }


}


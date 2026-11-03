<?php

class NomFallasmediosModel extends NomencladoresModel
{

    public function __construct()
    {
        parent::__construct();
    }


    public function buscar($obj, $arrIdsInsertados)
    {
        $arr = parent::buscar($obj, $arrIdsInsertados, true);
        $query = $arr['query'];
        if ($obj['idproducto']) {
            $query->addWhere("{$arr['alias']}.idproducto = {$obj['idproducto']}");
        } else {
            $query->addWhere("{$arr['alias']}.idproducto = 0");
        }
        $res = $query->fetchArray();
        return array('cantidad' => $arr['cant'], 'datos' => $res);
    }

    public function insertarNomenclador($array, $returnobj = false)
    {
        LogisticaObjectHelper::__init()->unsetNullValues($array);
        if ($this->comprobarExistencia($array)) {
            return false;
        }
        $obj = new $array['modelo']();
        $obj->synchronizeWithArray($array);
        if (!$returnobj) {
            $obj->save();
        }
        $bandera = 1;
        $resultado = ($returnobj && $bandera == 1) ? $obj : $bandera;
        return $resultado;
    }

    public function comprobarExistencia($array)
    {
        $query = new Doctrine_Query();
        $query->select('*')->from('NomFallasmedios nom')->where("denominacion = ?", array($array['denominacion']))
              ->andWhere("idproducto = ?", array($array['idproducto']));
        $existe = $query->fetchArray();

        return $existe;
    }

}


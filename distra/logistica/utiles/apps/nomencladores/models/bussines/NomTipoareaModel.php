<?php

class NomTipoareaModel extends NomencladoresModel
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

        if ($obj->productounico == 1) {
            $obj->NomCampostipoarea->synchronizeWithArray($array);
        }
        $obj->save();
        return true;
    }

    public function buscar($obj)
    {
        $arr = parent::buscar($obj, array(), true);
        $query = $arr['query'];
        $query->addSelect(
            'nca.capacidad as capacidad, nca.producto as producto, nca.um as um'
        );

        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';

        if (class_exists($clasEntidad)) {
            $query->addSelect("e.idtipoareaentidad as idtipoareaentidad");
        }

        $res = $query->leftJoin("{$arr['alias']}.NomCampostipoarea nca")
                ->limit(($obj['limit']) ? $obj['limit'] : 30)
                ->offset(($obj['start']) ? $obj['start'] : 0)
                ->orderBy("{$obj['idnom']} DESC")->fetchArray();
        return array('cantidad' => $arr['cant'], 'datos' => $res);
    }

    public function modificarNomenclador($array)
    {
        $obj = parent::modificarNomenclador($array, true);
        if (!is_object($obj)) {
            return $obj;
        }
        $objCampos = Doctrine::getTable('NomCampostipoarea')->findByDql(
            "idnomtipoarea = ?", array($array['idnomtipoarea'])
        );
        unset($array['idnomtipoarea']);
        if ($obj->productounico == 1) {
            if ($objCampos[0]->idnomtipoarea) {
                $obj->NomCampostipoarea = $objCampos[0];
            }
            $obj->NomCampostipoarea->synchronizeWithArray($array);
        } else {
            if ($objCampos[0]->idnomtipoarea) {
                $objCampos->delete();
            }
        }
        $obj->save();
        return true;
    }

}

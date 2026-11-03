<?php
class DatObservacionequipo extends BaseDatObservacionequipo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEquipoaltoriesgo', array('local' => 'idequipoaltoriesgo', 'foreign' => 'idequipoaltoriesgo'));
    }

    public function getById($idobservacionequipo)
    {
        return Doctrine::getTable('DatObservacionequipo')->find($idobservacionequipo);
    }

    public function getObservacionByEquipo($idequipoaltoriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "doe.*";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatObservacionequipo doe')
                ->addWhere("doe.idequipoaltoriesgo = '$idequipoaltoriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantObservacionByEquipo($idequipoaltoriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatObservacionequipo doe')
                ->addWhere("doe.idequipoaltoriesgo = '$idequipoaltoriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}
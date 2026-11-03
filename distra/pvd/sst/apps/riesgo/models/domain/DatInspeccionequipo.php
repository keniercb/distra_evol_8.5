<?php
class DatInspeccionequipo extends BaseDatInspeccionequipo
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEquipoaltoriesgo', array('local' => 'idequipoaltoriesgo', 'foreign' => 'idequipoaltoriesgo'));
        $this->hasOne('NomTipoinspeccion', array('local' => 'idtipoinspeccion', 'foreign' => 'idtipoinspeccion'));
        $this->hasOne('NomResultadoinspeccion', array('local' => 'idresultadoinspeccion', 'foreign' => 'idresultadoinspeccion'));
    }

    public function getById($idinspeccionequipo)
    {
        return Doctrine::getTable('DatInspeccionequipo')->find($idinspeccionequipo);
    }

    public function getInspeccionByEquipo($idequipoaltoriesgo, $limit = null, $start = 0)
    {
        try {
            $select = "die.*, nti.denominacion as tipoinspeccion, nri.denominacion as resultadoinspeccion, date_part('day',die.fplan - now()) AS cantd";
            $query = Doctrine_Query::create()->select($select)
                ->from('DatInspeccionequipo die')
                ->innerJoin('die.NomTipoinspeccion nti')
                ->leftJoin('die.NomResultadoinspeccion nri')
                ->addWhere("die.idequipoaltoriesgo = '$idequipoaltoriesgo'");
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->fetchArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantInspeccionByEquipo($idequipoaltoriesgo)
    {
        try {
            $query = Doctrine_Query::create()
                ->from('DatInspeccionequipo die')
                ->innerJoin('die.NomTipoinspeccion nti')
                ->addWhere("die.idequipoaltoriesgo = '$idequipoaltoriesgo'");
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}
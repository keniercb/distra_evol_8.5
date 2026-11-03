<?php
class DatEvalrg extends BaseDatEvalrg
{
    public function setUp()
    {
        $this->hasOne(
            'DatRgindicador', array('local' => 'idrgindicador', 'foreign' => 'idrgindicador')
        );
        parent::setUp();
    }

    public function getById($idevalrg)
    {
        return Doctrine::getTable('DatEvalrg')->find($idevalrg);
    }

    public function getEvalIndicadores($idrgindicador)
    {
        $queryObj = Doctrine_Query::create()
            ->select('m.*')
            ->from('DatEvalrg m')
            ->where("m.idrgindicador = '$idrgindicador'")
            ->orderBy('m.denominacion ASC');
        return $queryObj->fetchArray();
    }

    public function eliminarByIndicador($idrgindicador, $idrgperiodo)
    {
        $query = new Doctrine_Query();
        return $query->delete('DatEvalrg')
            ->where("idrgindicador = '$idrgindicador' AND idrgperiodo = '$idrgperiodo'")
            ->execute();
    }
}
<?php
class SegCompartimentacion extends BaseSegCompartimentacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('SegUsuariocompartimentacion', array('local' => 'idcompartimentacion', 'foreign' => 'idcompartimentacion'));
    }

    public function getById($idcompartimentacion)
    {
        return Doctrine::getTable('SegCompartimentacion')->find($idcompartimentacion);
    }

    public function getCompartimentacionesAll($start, $limit)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*')
            ->from('SegCompartimentacion d');

        if (!empty($limit)) {
            $queryObj->limit($limit);
        }
        if (!empty($start)) {
            $queryObj->offset($start);
        }
        return $queryObj->fetchArray();
    }
}

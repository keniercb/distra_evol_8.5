<?php

class DatDocObservaciones extends BaseDatDocObservaciones
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

    public function buscarObservacion($iddocumento)
    {
        $queryObj = Doctrine_Query::create()
            ->select('do.*')
            ->from('DatDocObservaciones do')
            ->where('do.iddocumento = ?',$iddocumento);
        return $queryObj->fetchArray();
    }

}

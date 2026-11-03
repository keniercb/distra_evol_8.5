<?php

class DatTerminopagoEntidad extends BaseDatTerminopagoEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTerminopago', array('local' => 'idterminodepago',
                'foreign' => 'idterminodepago')
        );
    }

    static public function getTerminopagoEntidad($idterminopago)
    {
        $q = new Doctrine_Query();
        $result = $q->select("d.*")
            ->from('DatTerminopagoEntidad d')
            ->where("d.idterminodepago = '$idterminopago'")
            ->orderBy('d.idterminodepago')
            ->execute()->toArray();

        return $result;
    }

}



<?php

class NomEstadoTarea extends BaseNomEstadoTarea
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'HisRespuestaTarea',
            array('local' => 'idestado', 'foreign' => 'estadotarea')
        );
    }

    public static function getIdByCode($code)
    {
        $state = Doctrine::getTable(__CLASS__)->findBy('codigo', $code);

        return $state[0]->idestado;
    }
}
<?php

class DatDatosEspTransDisponibilidad extends BaseDatDatosEspTransDisponibilidad
{

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatTransDisponibilidad', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
    }

}

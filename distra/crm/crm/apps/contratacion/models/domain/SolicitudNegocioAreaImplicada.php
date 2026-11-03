<?php

class SolicitudNegocioAreaImplicada extends DatSolicitudNegocioAreaImplicadaMapper
{
    public function setUp()
    {
        parent::setUp();
		$this->hasOne('SolicitudNegocio', array('local' => 'idsolicitud', 'foreign' => 'idsolicitud'));
    }
}
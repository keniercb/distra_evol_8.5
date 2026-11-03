<?php

class SolicitudNegocio extends DatSolicitudNegocioMapper
{
    public function setUp()
    {
        parent::setUp();
		$this->hasMany('SolicitudNegocioAreaImplicada', array('local' => 'idsolicitud', 'foreign' => 'idsolicitud'));
        $this->hasMany('SolicitudNegocioEstado', array('local' => 'idsolicitud', 'foreign' => 'idsolicitud'));
    }

    public function fromArray($values)
    {
        parent::fromArray($this->formatValues($values));
    }

    public function synchronizeWithArray($values)
    {
        parent::synchronizeWithArray($this->formatValues($values));
    }

    private function formatValues($values)
    {
        $values['descripcion'] = ( $values['descripcion'] )? $values['descripcion'] : null;
        $values['fechacreada'] = date('d/m/Y');
       
        return $values;
    }
}
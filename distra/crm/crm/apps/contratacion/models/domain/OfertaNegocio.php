<?php

class OfertaNegocio extends DatOfertaNegocioMapper
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('OfertaNegocioEstado', array('local' => 'idoferta', 'foreign' => 'idoferta'));
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
        $values['fechafirma'] = ( $values['fechafirma'] )? $values['fechafirma'] : null;
        $values['idmediopago'] = ( $values['idmediopago'] )? $values['idmediopago'] : null;
        $values['idcondicionpago'] = ( $values['idcondicionpago'] )? $values['idcondicionpago'] : null;
        $values['descripcion'] = ( $values['descripcion'] )? $values['descripcion'] : null;
        
        return $values;
    }
}
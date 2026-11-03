<?php

class DatEstandarCodigoBarrasEstructura extends BaseDatEstandarCodigoBarrasEstructura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEstandarCodigoBarras', array('local' => 'idestandarcodigobarra', 'foreign' => 'idestandarcodigobarra'));
    }

}
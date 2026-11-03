<?php

/**
 * Description of SolicitudEntregaValidator
 *
 * @author Osmel A. Larduet Hechavarría
 */
class SolicitudEntregaValidator extends SalidaValidator
{
    public function __construct()
    {
        parent::__construct();
        $this->model = new SolicitudentregaModel(
            array('alias' => 'solEntrega')
        );
    }

}

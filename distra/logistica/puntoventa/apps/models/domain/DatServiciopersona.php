<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatServiciopersona extends BaseDatServiciopersona
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatServicioareaventa', array('local' => 'idservicio', 'foreign' => 'idservicio'));
    }
}

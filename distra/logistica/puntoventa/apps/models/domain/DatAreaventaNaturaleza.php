<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatAreaventaNaturaleza extends BaseDatAreaventaNaturaleza
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatAreaventa', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
    }
}

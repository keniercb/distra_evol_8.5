<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatAreaventa extends BaseDatAreaventa
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatCaja', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
        $this->hasMany('DatVenta', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
        $this->hasOne('DatInfoConexion', array('local' => 'idinfoconexion', 'foreign' => 'idinfoconexion'));
        $this->hasOne('DatInfoConexioncr', array('local' => 'idinfoconexioncr', 'foreign' => 'idinfoconexioncr'));
        $this->hasMany('DatAreaventaNaturaleza', array('local' => 'idareaventa', 'foreign' => 'idareaventa'));
    }
}

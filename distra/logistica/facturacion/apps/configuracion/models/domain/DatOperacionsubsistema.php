<?php

/**
 * Clase mapeada de la tabla de base de datos
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class DatOperacionsubsistema extends BaseDatOperacionsubsistema
{

    public function setUp()
    {
        parent::Setup();
        $this->hasOne(
            'NomOperaciones', array('local' => 'idnomoperaciones', 'foreign' => 'idnomoperaciones')
        );
    }

}

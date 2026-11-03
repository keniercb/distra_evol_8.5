<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatAreaventaNaturaleza extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_areaventanaturaleza');
        $sequence = 'mod_logpuntoventa.sec_datareaventanaturaleza';
        $this->hasColumn(
            'idareaventanaturaleza', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idnaturaleza', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idareaventa', 'numeric', null,
            array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'enviado', 'numeric', null,
            array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechaenvio', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

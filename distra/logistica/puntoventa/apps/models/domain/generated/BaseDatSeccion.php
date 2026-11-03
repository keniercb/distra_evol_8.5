<?php

/**
 * Clase base mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatSeccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_seccion');
        $sequence = 'mod_logpuntoventa.sec_datseccion';
        $this->hasColumn(
            'idseccion', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true,
            'sequence' => $sequence
            )
        );
        $this->hasColumn(
            'idusuario', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'idcaja', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechaapertura', 'date', null, array(
            'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechacierre', 'date', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'efectivo', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'horaapertura', 'time without time zone', null, array(
            'notnull' => false, 'primary' => false));
        $this->hasColumn(
            'horacierre', 'time without time zone', null, array(
            'notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

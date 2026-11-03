<?php

/**
 * Clase mapeada de la tabla de base de datos
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
abstract class BaseDatServiciopersona extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.dat_serviciopersona');
        $this->hasColumn(
            'idserviciopersona', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_logpuntoventa.sec_datserviciopersona_seq'
            )
        );
        $this->hasColumn(
            'idservicio', 'numeric', null,
            array(
            'notnull' => true, 'primary' => true
            )
        );
        $this->hasColumn(
            'idpersona', 'numeric', null, array(
            'notnull' => false, 'primary' => false
            )
        );

        
    }

    public function Setup()
    {
        parent::setUp();
    }

}

<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseDatConversion extends Doctrine_Record
{

    /**
     * Cambiar la definición de la tabla
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.dat_conversion');
        $this->hasColumn('factorconversion', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idunidadmedidaconversion', 'numeric', 19, array('notnull' => true, 'primary' => true));
    }

    /**
     * Constuctor de la clase
     */
    public function Setup() 
    {
        parent::setUp();
    }
}


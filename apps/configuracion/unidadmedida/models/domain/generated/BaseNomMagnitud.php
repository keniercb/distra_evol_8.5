<?php

/**
 * Componente para gestionar las unidades de medida de los subsistemas.
 *
 * @package    Configuración
 * @subpackage Unidadmedida/Models/Domain/Generated
 * @copyright  XETID
 * @version    1.0
 */
abstract class BaseNomMagnitud extends Doctrine_Record
{

    /**
     * Cambiar la definición de la tabla
     */
    public function setTableDefinition() 
    {
        $this->setTableName('mod_datosmaestros.nom_magnitud');
        $this->hasColumn(
        'denominacionmagnitud', 'character varying', 255, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn('descripcionmagnitud', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
        'idmagnitud', 'numeric', 19, array(
            'notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_nommagnitud'
            )
                );
        $this->hasColumn('urimagnitud', 'character varying', 255, array('notnull' => true, 'primary' => false));
    }

    /**
     * Constuctor de la clase
     */
    public function Setup() 
    {
        parent::setUp();
    }
}


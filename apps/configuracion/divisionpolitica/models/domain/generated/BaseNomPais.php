<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class BaseNomPais extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_pais');
        $this->hasColumn(
            'idpais', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_idpais')
        );
        $this->hasColumn('codigopais', 'character varying', 3, array('notnull' => false, 'primary' => false));
        $this->hasColumn('siglas', 'character varying', 10, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nacionalidad', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrepais', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}


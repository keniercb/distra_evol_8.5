<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain/Generated
 * @version    1.0
 */
abstract class  BaseNomConcept extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_conceptoestructural');
        $this->hasColumn(
            'idconceptoestructural', 'numeric', 4,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_conceptoestructural')
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('uri', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'fechaini', 'date', null, array(
                                           'type'     => 'date',
                                           'fixed'    => false,
                                           'unsigned' => false,
                                           'notnull'  => true,
                                           'primary'  => false,
                                      )
        );
        $this->hasColumn(
            'fechafin', 'date', null, array(
                                           'type'     => 'date',
                                           'fixed'    => false,
                                           'unsigned' => false,
                                           'notnull'  => false,
                                           'primary'  => false,
                                      )
        );
        $this->hasColumn(
            'descripcion', 'string', null, array(
                                                'type'     => 'string',
                                                'fixed'    => false,
                                                'unsigned' => false,
                                                'notnull'  => false,
                                                'primary'  => false,
                                           )
        );
        $this->hasColumn('visible', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}

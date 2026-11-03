<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:39
 */
abstract class BaseDatReclamacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_reclamacion');
        $this->hasColumn(
            'idreclamacion',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_personaext.sec_reclamacion')
        );
        $this->hasColumn('decision', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('numeroacuerdo', 'numeric', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('fechaacuerdo', 'date', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('reclamacion', 'character varying', null, array ('notnull' => false,'primary' => false));
        $this->hasColumn('nuevaplaza', 'character varying', null, array ('notnull' => false,'primary' => false));
    }
}
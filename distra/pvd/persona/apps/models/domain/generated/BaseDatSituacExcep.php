<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:39
 */
abstract class BaseDatSituacExcep extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_sitexcepcional');
        $this->hasColumn(
            'idsitexcepcional',
            'numeric',
            null,
            array ('notnull' => false,'primary' => true, 'sequence' => 'mod_personaext.sec_sitexcepcional')
        );
        $this->hasColumn('idsituacexcep', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idcargoexcep', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
    }
}
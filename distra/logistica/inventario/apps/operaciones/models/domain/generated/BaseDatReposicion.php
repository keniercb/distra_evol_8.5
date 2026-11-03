<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 31/05/2018
 * Time: 14:34
 */

abstract class BaseDatReposicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_reposicion');

        $this->hasColumn(
            'idreposicion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datreposicion')
        );
        $this->hasColumn(
            'cantidadrep', 'numeric', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtransferencia', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}
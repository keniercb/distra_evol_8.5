<?php
define('APP_HOME', realpath(dirname(__FILE__)) . '/');

include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');

class DatRolTransicion extends BaseDatRolTransicion
{

    public function setUp()
    {
        $this->hasOne('SegRol', array('local' => 'idrol', 'foreign' => 'idrol'));
        parent::setUp();
    }

    public function deleteRolTransicion($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatRolTransicion')
            ->whereIn('idroltransicion', $array)
            ->execute();
    }
} 
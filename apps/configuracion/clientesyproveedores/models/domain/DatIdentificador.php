<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 17/03/2015
 * Time: 3:39
 */

class DatIdentificador extends BaseDatIdentificador{
    public function setUp() {
        parent::setUp();
    }

    static function deleteFromArray($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatIdentificador')
            ->whereIn('ididentificador',$array)
            ->execute();
    }
}
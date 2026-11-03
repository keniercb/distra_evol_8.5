<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 05/06/2018
 * Time: 14:29
 */

class RotacionCodificador extends BaseRotacionCodificador
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('Rotacionlote', array('local' => 'idrotacionlote', 'foreign' => 'idrotacionlote'));
    }

}
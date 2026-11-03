<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 05/06/2018
 * Time: 14:31
 */

class RotacionProductoLote extends BaseRotacionProductoLote
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('Rotacionlote', array('local' => 'idrotacionlote', 'foreign' => 'idrotacionlote'));
    }
}
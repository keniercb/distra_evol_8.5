<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 01/06/2018
 * Time: 15:34
 */

class Rotacionlote extends BaseRotacionlote
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatDocumento', array('local' => 'idrotacionlote', 'foreign' => 'iddocumento'));
    }
}
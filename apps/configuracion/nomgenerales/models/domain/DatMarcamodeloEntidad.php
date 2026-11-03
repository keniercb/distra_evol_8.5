<?php
/**
 * Created by JetBrains PhpStorm.
 * User: lester
 * Date: 31/07/13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */

class DatMarcamodeloEntidad extends BaseDatMarcamodeloEntidad
{
   public function setUp(){
       parent::setUp();
       $this->hasMany('NomMarcamodelo', array('local' => 'idmarcamodelo', 'foreign' => 'idmarcamodelo'));
   }
}
<?php
/**
 * Created by PhpStorm.
 * User: Gabriel Ibarra Garcia
 * Date: 21/07/16
 * Time: 04:29 PM
 */
class NomTipoembalaje extends BaseNomTipoembalaje
{
    public function setUp()
    {//ver los id de las tablas de la BD
        parent::setUp();
        $this->hasMany('DatTipoembalajeEntidad', array('local' => 'idtipoembalaje',
                'foreign' => 'idtipoembalaje'));
    }
}
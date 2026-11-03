<?php
/**
 * Created by PhpStorm.
 * User: Gabriel Ibarra Garcia
 * Date: 22/07/16
 * Time: 08:52 AM
 */
class DatTipoembalajeEntidad extends BaseDatTipoembalajeEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTipoembalaje', array('local' => 'idtipoembalaje', 'foreign' => 'idtipoembalaje'));
    }
}
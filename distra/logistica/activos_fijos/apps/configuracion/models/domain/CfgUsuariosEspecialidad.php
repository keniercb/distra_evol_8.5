<?php

/**
 *
 */
class CfgUsuariosEspecialidad extends BaseCfgUsuariosEspecialidad
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('SegUsuario', array('local' => 'idaprobadopor', 'foreign' => 'idusuario'));
        $this->hasMany('SegUsuario', array('local' => 'idpropuestopor', 'foreign' => 'idusuario'));
        $this->hasOne('NomEspecialidad', array('local' => 'idespecialidad', 'foreign' => 'idespecialidad'));
    }

}

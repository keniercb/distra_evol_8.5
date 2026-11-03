<?php

class SegUsuarioNomina extends BaseSegUsuarioNomina {

	
    public function setUp(){
        parent::setUp();
    }

    public static function existeUsuarioNomina($usuario)
    {
        //Devolviendo el listado de tipos de nómina en forma de arreglo.
        return Doctrine_Query::create()
            ->from('SegUsuarioNomina')
            ->where("nombreusuario='$usuario'")
            ->fetchArray();
    }
    
}

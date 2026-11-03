<?php

/**
 *
 */
class ModuloPatrimonioService extends ZendExt_Model
{

    /**
     *
     */
    public function __construct()
    {
        
    }

    /**
     *
     */
    public function crearModuloDragDrop($arrIdesOrigen, $idRegNumericoDestino)
    {
        $mRegNumModulo = new RegNumericoModuloPatrimonioModel();
        $mRegNumModulo->crearModuloDragDrop($arrIdesOrigen, $idRegNumericoDestino);
    }

}

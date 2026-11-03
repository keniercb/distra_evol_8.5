<?php

/**
 *
 */
class ModuloService extends ZendExt_Model
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
        $mRegNumModulo = new RegNumericoModuloModel();
        $mRegNumModulo->crearModuloDragDrop($arrIdesOrigen, $idRegNumericoDestino);
    }

}

<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ImagenModel
 *
 * @author kenier
 */
class ImagenModel extends BaseModel
{

//    put your code here
    public function __construct()
    {
        parent::__construct();
    }

    public function salvarImagen($tmpFile)
    {
        $result = $this->imagenHelper->insertarImagenDb($tmpFile);
        return is_array($result) ? $result : array('idimagen' => $result, 'failure' => true);
    }

    public function obtenerImagen($id)
    {
        $this->imagenHelper->obtenerImagenDb($id);
    }

    public function eliminarImagen($arrId,$idindicador)
    {
        $this->imagenHelper->eliminarImagen($arrId,$idindicador);
    }

}

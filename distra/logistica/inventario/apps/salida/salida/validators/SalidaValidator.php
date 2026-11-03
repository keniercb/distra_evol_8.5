<?php

/**
 * Descripción de SalidaValidator
 *
 * @author Osmel A. Larduet Hechavarría
 */
class SalidaValidator extends DocumentoValidator
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @return boolean
     */
    public function validarCantidad()
    {
        return $this->model->productosConCantidad($this->params['id']);
    }

}

<?php

/**
 * Descripción de RecetaValidator
 *
 * @author Dainier Aguila Medina
 */
class RecetaValidator extends BaseValidator
{

    public function __construct()
    {
        parent::__construct();
    }

    public function initModel()
    {
        $this->model = new RecetaModel(array('noexception' => true));
    }

    /**
     * Verifica que la receta tenga producto.
     *
     * @return bool
     */
    public function contieneProductos()
    {
        return $this->model->contieneProductos($this->params['idreceta']);
    }

    /**
     * Verifica que los productos de la receta tengan cantidades registradas.
     *
     * @return bool
     */
    public function productosConCantidad()
    {
        return $this->model->productosConCantidad($this->params['idreceta']);
    }

    /**
     * Verifica si la receta esta siendo usada para poder eliminarla
     *
     * @return bool
     */
    public function verificarUso()
    {

        $this->params['idreceta'] = Zend_Json::decode($this->params['id']);
        return $this->model->verificarUso($this->params['idreceta']);
    }
    /**
     * Verifica que no exista una receta con las mismas caracteristica en la entidad
     *
     * @return bool
     */
    public function verificarExisteMismaReceta()
    {
       
       return $this->model->verificarExisteMismaReceta($this->params);
    }

}

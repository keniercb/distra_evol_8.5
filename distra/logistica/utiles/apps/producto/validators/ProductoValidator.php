<?php

/**
 * Descripción de AperturaValidator
 *
 * @author Maricet
 */
class ProductoValidator extends BaseValidator
{

    public function __construct()
    {
        parent::__construct();

    }

    /**
     * Verifica la existencia de la tarjeta de un producto según una categoría.
     *
     * @param $idestructura
     * @param $idindicador
     * @param $idcategoria
     *
     * @return bool
     */
    public function crearTarjeta()
    {

        return $this->model->validarExistenciaProdCantegDep($this->params);
    }

    public function initModel()
    {
        $this->model = new LogisticaProductoModel();
    }

    public function validarAdicionarNroSerie()
    {
        $modelnroserie = new LogisticaNumeroSerieModel();
        return $modelnroserie->validarExistenciaNroSerieModel($this->params);
    }

}

<?php

/**
 * Descripción de AlimentoValidator
 *
 * @author Jorge Luis Saavedra Rubio
 */
class AlimentoValidator extends BaseValidator
{

    public function __construct()
    {
        parent::__construct();
    }

    public function initModel()
    {
        $this->model = new MenualimentoModel(
            array('alias' => 'menuAlim', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV)
        );
    }

    /**
     * Verifica que los productos del menu estén recepcionados.
     *
     * @return bool
     */
    public function verificarProductosByRecetas()
    {

        if ($this->params['idreceta']) {
            $pDatos = (array)Zend_Json::decode($this->params['idreceta']);
            $data = (array)Zend_Json::decode($this->params['data']);
            $data['iddeposito'] = explode(',', $data['iddeposito']);
            return $this->model->verificarProductosByRecetas($pDatos, $data['iddeposito']);
        } else {
            return true;
        }
    }

    /**
     * Verifica que los productos tienen cantidad disponible respecto a la cantidad a rebajar.
     *
     * @return bool
     */
    public function verificarProductosConfirmar()
    {
        return $this->model->verificarProductosConfirmar($this->params);
    }

}

<?php

/**
 *
 */
class ParetesPiezasAgregadosService extends ZendExt_Model
{

    private $piezaModel;

    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->piezaModel = new PartesPiezasAgregadosModel();
    }

    /**
     * Método para cargar las piezas de un registro numerico
     *
     * @param Array $params Arreglo con los parametros para filtrar los atributos
     *
     * @return array
     */
    public function devolverPiezas($params)
    {
        return $this->piezaModel->cargarPiezas($params);
    }

    /**
     * Método para actualizar el cierre de las piezas
     *
     * @param Array $parametros Arreglo con los parametros para filtrar las piezas
     *
     * @return array
     */
    public function actualizarFechaCierre($params)
    {
        return $this->piezaModel->actualizarFechaCierre($params);
    }

    /**
     * Método paraadicionar  piezas
     *
     * @param Array $parametros
     *
     * @return array
     */
    public function adicionarPieza($params)
    {
        return $this->piezaModel->adicionarPiezas($params);
    }

    public function cargarPiezasConfiguradas($params)
    {
        $this->piezaModel->cargarPiezasConfiguradas($params);
    }

    /**
     * @param $idindicador
     *
     * @return array
     */
    public function estaConfigurado($idindicador)
    {
        return $this->piezaModel->estaConfigurado($idindicador);
    }

}

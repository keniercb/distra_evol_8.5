<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\JsonResponse;

class PgmController extends BaseController
{
    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverSurtidos()
    {
        die('ok');
        $offset = $this->getParam('offset');
        $limit = $this->getParam('limit');
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        return $this->to_json($this->implService->devolverSurtidos($this->getParam('idEspecialidad'), $this->getParam('criterio'), $offset, $limit));
    }

    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param null $idAlmacen
     * @param null $idNomenclador
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverMediosAlmacenados()
    {
        $offset = $this->getParam('offset');
        $limit = $this->getParam('limit');
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        return $this->to_json($this->implService->devolverSurtidosdevolverMediosAlmacenados($this->getParam('idEspecialidad'), $this->getParam('criterio'), $this->getParam('idAlmacen'), $this->getParam('idNomenclador'), $offset, $limit));
    }

    /**
     * @param $idEspecialidad
     * @param $criterio
     * @param null $idEntidad
     * @param null $idNomenclador
     * @param null $offset
     * @param null $limit
     * @return string
     */
    public function devolverActivos()
    {
        $offset = $this->getParam('offset');
        $limit = $this->getParam('limit');
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        return $this->to_json($this->implService->devolverActivos($this->getParam('idEspecialidad'), $this->getParam('criterio'), $this->getParam('idEntidad'), $this->getParam('idNomenclador'), $offset, $limit));
    }

    public function devolverEntidadesActivos()
    {
        $offset = $this->getParam('offset');
        $limit = $this->getParam('limit');
        $this->setDefaultValue($offset, 0);
        $this->setDefaultValue($limit, 30);
        return $this->to_json($this->implService->devolverEntidadesActivos($this->getParam('idEspecialidad'), $this->getParam('criterio'), $this->getParam('idEntidad'), $this->getParam('idNomenclador'), $offset, $limit));
    }

    /**
     * @param $idIndicador
     * @return string
     */
    public function obtenerDatosMedioPorId()
    {
        return $this->to_json($this->implService->obtenerDatosMedioPorId($this->getParam('idIndicador')));
    }

    /**
     * @param $nomenclador
     * @param $extraParams
     *
     * @return string
     * Obtener las naturalezas del sistema
     */
    public function obtenerNomencladorCategorias()
    {
        return $this->to_json($this->implService->obtenerNomencladorCategorias($this->getParam('nomenclador'), $this->getParam('extraParams')));
    }


    /**
     * @param $naturaleza
     * @param $extraParams
     *
     * @return string
     * Obtener los datos de los RN dado una naturaleza
     */
    public function obtenerNomencladorArbol()
    {
        return $this->to_json($this->implService->obtenerNomencladorArbol($this->getParam('nomenclador'), $this->getParam('naturaleza'), $this->getParam('extraParams')));
    }

    /**
     * @param $nomenclador
     * @param $naturaleza
     * @param $activo
     * @param $extraParams
     *
     * @return string
     * @throws Zend_Exception
     */
    public function obtenerNomencladorDetalles()
    {
        return $this->to_json($this->implService->obtenerNomencladorDetalles($this->getParam('nomenclador'), $this->getParam('naturaleza'), $this->getParam('activo'), $this->getParam('extraParams')));
    }
}

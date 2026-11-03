<?php

class DatClienteProveedorEspacioTrabajo extends BaseDatClienteProveedorEspacioTrabajo
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerPorParametros($paramestros)
    {
        try {

            $filtros = $this->obtenerFiltros($paramestros);

            $query = Doctrine_Query::create();
            $query->select()->from('DatClienteProveedorEspacioTrabajo');

            if (count($filtros)) {
                $filtros = implode(' AND ', $filtros);
                $query->where($filtros);
            }

            return $query->execute()->toArray()[0];
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerFiltros($parametros)
    {
        $filtros = array();
        foreach ($parametros as $k => $v) {
            $filtros[] = $k . " = " . $v;
        }
        return $filtros;
    }
} 
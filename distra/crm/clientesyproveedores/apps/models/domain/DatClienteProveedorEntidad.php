<?php

class DatClienteProveedorEntidad extends BaseDatClienteProveedorEntidad
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        $this->hasOne(
            'NomClienteproveedor', array('local'   => 'idclienteproveedor',
                                         'foreign' => 'idclienteproveedores')
        );

        parent::setUp();
    }

    public function obtenerClienteProveedor($parametros, $toarray = true)
    {
        try {
            $filtros = $this->obtenerFiltros($parametros);
            $query = new Doctrine_Query();
            $query->select('*')->from('DatClienteProveedorEntidad');
            if ($filtros) {
                $query->where($filtros);
            }
            $result = $query->execute();
            return !$toarray ? $result : $result->toArray();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerFiltros($parametros)
    {
        $filtro = array();
        foreach ($parametros as $k => $valor) {
            $filtro[] = $k . " = " . $valor;
        }
        return implode(" AND ", $filtro);
    }
} 
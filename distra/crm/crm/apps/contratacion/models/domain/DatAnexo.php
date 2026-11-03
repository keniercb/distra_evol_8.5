<?php

class DatAnexo extends BaseDatAnexo
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getAnexos($params, $contenido = false)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $query = $this->getMainQuery($contenido);
            $filters = $this->getFilter($params);
            if (count($filters)) {
                $where = " WHERE " . implode(' AND ', $filters);
            }
            $result = $conexion->fetchAll($query . $where);
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function getMainQuery($contenido)
    {
        if ($contenido) {
            $contenido = ",contenido";
        }
        return "SELECT idanexo,idexterno,nombre,tipoarchivo $contenido
                from mod_crmcontratacion.dat_anexo";
    }

    private function getFilter($params)
    {
        $result = array();
        foreach ($params as $k => $v) {
            $result[] = $k . " = " . $v;
        }
        return $result;
    }
}

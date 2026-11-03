<?php

/**
 *
 *
 * @author         Ing. Alberto Mesa Martinez
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Models/Domain
 * @version        1.0
 */
class DatSolicitud extends BaseDatSolicitud
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getByParams($params)
    {
        try {
            $start = !is_null($params['start']) ? $params['start'] : 0;
            $limit = !is_null($params['limit']) ? $params['limit'] : 25;
            $filters = $this->createFilter($params);
            $where = count($filters) ? 'WHERE ' . implode(' AND ', $filters) : '';

            $query = "SELECT ds.*,np.nombrepais as nombredpapais,dpt.denominacion as nombredpaciudad,count(*) OVER() FROM mod_crmclienteproveedor.dat_solicitud ds
                   INNER JOIN mod_datosmaestros.nom_pais np ON ds.iddpapais = np.idpais
                   INNER JOIN mod_datosmaestros.nom_dpt dpt ON ds.iddpaciudad = dpt.iddpt $where LIMIT $limit OFFSET $start;";

            $result = $this->executeQuery($query);

            return array('data' => $result, 'count' => $result[0]['count']);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function executeQuery($query)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            return $conexionActual->fetchAll($query);
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private function createFilter($params)
    {
        $alias = array('nombredpapais' => 'np.nombrepais', 'nombredpaciudad' => 'dpt.denominacion');
        $filters = [];
        foreach ($params['filter'] as $filter) {
            $field = $filter['field'];
            $field = $alias[$field] ? $alias[$field] : $field;
            $type = $filter['data']['type'];
            $value = $filter['data']['value'];
            if ($type == 'string') {
                $filters[] = $field . " ILIKE '%" . $value . "%'";
            }

            if ($field == 'estado') {
                $value = $value == "true" ? 1 : 2;
                $filters[] = $field . " = " . $value;
            }
        }
        return $filters;
    }
}

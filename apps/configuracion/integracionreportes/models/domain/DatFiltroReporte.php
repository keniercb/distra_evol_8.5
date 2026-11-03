<?php

class DatFiltroReporte extends BaseDatFiltroReporte
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatReporte',
            array('local' => 'idreporte', 'foreign' => 'idreporte')
        );
    }

    public function obtenerFiltroReporteDadoId($parametros)
    {
        try {
            extract($parametros);
            $query = new Doctrine_Query();
            $query->from('DatFiltroReporte fr');
            if ($tipo == 1) {
                $query->innerJoin('fr.DatFiltroReporteTexto frt');
            } else if ($tipo == 2) {
                $query->innerJoin('fr.DatFiltroReporteNumerico frn');
            } else if ($tipo == 4) {
                $query->innerJoin('fr.DatFiltroReporteNumerico frnom');
            } else if ($tipo == 6) {
                $query->innerJoin('fr.DatFiltroReporteEstructura fre');
            }
            $query->where('fr.idfiltro = ?', $idfiltro);
            /*$temp = $query->getSqlQuery();
            print_r($temp);die;*/
            $result = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result[0];
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function obtenerFiltroReporteDadoIdSql($parametros)
    {
        extract($parametros);
        $cadenasql = 'SELECT rf.*';
        $cadenasql .= ($tipo == 1) ? ',rft.longitudmaxima, rft.longitudminima' : '';
        $cadenasql .= ($tipo == 2) ? ',rfn.valorminimo, rfn.valormaximo' : '';
        $cadenasql .= ($tipo == 4) ? ',rfnom.enviarid, rfnom.nomdenominacion, rfnom.nomidentificador,
                                        rfnom.nomservicio, rfnom.paginado, rfnom.sentenciasql, rfnom.tipofuentedatos' : '';
        $cadenasql .= ($tipo == 6) ? ',rfe.estructuracompleta' : '';

        $cadenasql .= ' FROM mod_integracionreporte.dat_reportefiltro rf';
        $cadenasql .= ($tipo == 1) ? ' INNER JOIN mod_integracionreporte.dat_reportefiltrotexto rft ON (rf.idfiltro = rft.idfiltro)' : '';
        $cadenasql .= ($tipo == 2) ? ' INNER JOIN mod_integracionreporte.dat_reportefiltronumerico rfn ON (rf.idfiltro = rfn.idfiltro)' : '';
        $cadenasql .= ($tipo == 4) ? ' INNER JOIN mod_integracionreporte.dat_reportefiltronomenclador rfnom ON (rf.idfiltro = rfnom.idfiltro)' : '';
        $cadenasql .= ($tipo == 6) ? ' LEFT JOIN mod_integracionreporte.dat_reportefiltroestructura rfe ON (rf.idfiltro = rfe.idfiltro)' : '';
        $cadenasql .= " WHERE (rf.idfiltro = $idfiltro)";
        try {
            $conn = Doctrine_Manager::connection();
            $result = $conn->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function listarFiltroReporteDql($params)
    {
        try {
            $query = new Doctrine_Query ();
            if (isset($params['filtros'][0])) {
                $where = self::SqlFiltros('DatFiltroReporte', $params['filtros']);
                $query->addwhere($where);
            }
            if ($params['start']) {
                $query->offset($params['start']);
            }
            if ($params['limit']) {
                $query->limit($params ['limit']);
            }
            $idreporte = $params['idreporte'];
            $query->select('*')
                ->from('DatFiltroReporte rf')
                ->where('rf.idreporte = ?', $idreporte)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY);
            if ($params['campo']) {
                $query->orderby($params['campo']);
            } else $query->orderby('rf.orden');

            //$temp = $query->getSqlQuery();
            //print_r($temp);die;

            $res ['data'] = $query->execute();
            $res ['total'] = $query->count();
            return $res;
        } catch (Exception $e) {
            echo($e->getMessage());
            return 0;
        }
    }

    public function SqlFiltros($table, $filtros, $alias = "")
    {
        $where = '';
        $operation = '';
        $compar = "";
        if (is_array($filtros)) {
            foreach ($filtros as $key => $filtro) {
                $length = strlen($filtro['data']['value']);
                $caracter_scapado = "%";
                if (substr($filtro['data']['value'], $length - 1, $length) == '.') {
                    $filtro['data']['value'] = substr($filtro['data']['value'], 0, $length - 1);
                    $caracter_scapado = "";
                }
                switch ($filtro['data']['comparison']) {
                    case 'lt':
                        $operation = ' < ';
                        break;
                    case 'gt':
                        $operation = ' > ';
                        break;
                    case 'eq':
                    default:
                        $operation = ' = ';
                        break;
                }
                switch ($filtro['data']['type']) {
                    case 'string':
                        $compar = 'lower(' . $alias . $filtro['field'] . ") LIKE '{$caracter_scapado}" . strtolower($filtro['data']['value'])
                            . "{$caracter_scapado}' ";
                        break;
                    default:
                        $compar = $alias . $filtro['field'] . $operation . ' ' . $filtro['data']['value'] . ' ';
                        break;
                }
                if (strlen($where) == 0) $where .= $compar;
                else $where .= 'AND ' . $compar;
            }
        }
        return $where;
    }

    public function listarFiltroReportes($params)
    {
        extract($params);
        $cadena = 'SELECT rf.*,
                       rft.longitudmaxima,
                       rft.longitudminima,
                       rfn.valormaximo,
                       rfn.valorminimo,
                       rfnom.enviarid,
                       rfnom.nomdenominacion,
                       rfnom.nomidentificador,
                       rfnom.nomservicio,
                       rfnom.paginado,
                       rfnom.sentenciasql,
                       rfnom.tipofuentedatos,
                       rfe.estructuracompleta
                    FROM mod_integracionreporte.dat_reportefiltro rf
                    LEFT JOIN mod_integracionreporte.dat_reportefiltrotexto rft on (rf.idfiltro = rft.idfiltro)
                    LEFT JOIN mod_integracionreporte.dat_reportefiltronumerico rfn on (rf.idfiltro = rfn.idfiltro)
                    LEFT JOIN mod_integracionreporte.dat_reportefiltronomenclador rfnom on (rf.idfiltro = rfnom.idfiltro)
                    LEFT JOIN mod_integracionreporte.dat_reportefiltroestructura rfe on (rf.idfiltro = rfe.idfiltro)';

        $cadena .= " WHERE (rf.idreporte = $idreporte ";
        $addwhere = "";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= " AND UPPER(replace(replace(replace(replace(replace(replace(rf.denominacion,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
                if ($datos ['field'] == 'nombreparametro') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= " AND UPPER(replace(replace(replace(replace(replace(replace(rf.nombreparametro,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
                if ($datos ['field'] == 'denominaciontipo') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= " AND UPPER(replace(replace(replace(replace(replace(replace(rf.denominaciontipo,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
            }
            $cadena .= " $addwhere ) ";
        } else $cadena .= " ) ";
        if ($sort) $cadena .= " ORDER BY rf.$sort $dir";
        else $cadena .= " ORDER BY rf.orden ASC";

        try {
            $connA = Doctrine_Manager:: connection();
            $resultado['total'] = count(
                $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
            );
            $cadena .= " LIMIT( $limit ) OFFSET( $start ) ";
            $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
            $resultado['data'] = $result;
            return $resultado;
        } catch (Exception $e) {
            echo $e->getMessage();
            return -1;
        }
    }

    public function cargarDatosNomenclador($params)
    {
        extract($params);
        $cadenasql = $sentenciasql;
        try {
            $connA = Doctrine_Manager:: connection();
            $resultado['total'] = count(
                $connA->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC)
            );
            $cadenasql .= " LIMIT( $limit ) OFFSET( $start ) ";
            $result = $connA->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC);
            $resultado['data'] = $result;
            $resultado['mensaje'] = 1;
            return $resultado;
        } catch (Exception $e) {
            echo $e->getMessage();
            return -1;
        }
    }

    public function obtenerFiltroEstructuraDadoIdReporte($parametros)
    {
        try {
            extract($parametros);
            $query = new Doctrine_Query();
            $query->select('fr.idreporte');
            $query->from('DatFiltroReporte fr');
            $query->where("fr.idreporte = $idreporte");
            $query->addWhere("fr.tipo =  6");

            /*$temp = $query->getSqlQuery();
            print_r($temp);die;*/

            $result = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }

    public function existeNombreParametroDadoIdReporte($parametros)
    {
        try {
            extract($parametros);
            $query = new Doctrine_Query();
            $query->select('fr.idreporte');
            $query->from('DatFiltroReporte fr');
            $query->where("fr.idreporte = $idreporte");
            $query->addWhere("fr.nombreparametro like '$nombreparametro'");

            /* $temp = $query->getSqlQuery();
             print_r($temp);die;*/

            $result = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
            return $result;
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }
}

//fin clase 

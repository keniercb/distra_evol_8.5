<?php

class DatReporteModel extends ZendExt_Model
{
    private $datreporte;

    public function __construct()
    {
        $this->datreporte = new DatReporte();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarReportesOld()
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatReporte')->setHydrationMode(
            Doctrine::HYDRATE_ARRAY
        )->execute();
        return $result;
    }

    public function listarReportesDql($params)
    {
        try {
            $query = new Doctrine_Query ();
            if ($params['filtros']) {
                $where = self::SqlFiltros('DatReporte', $params['filtros']);
                //print_r($where);die;
                $query->addwhere($where);
            }
            if ($params['start']) {
                $query->offset($params['start']);
            }
            if ($params['limit']) {
                $query->limit($params ['limit']);
            }
            $query->select('r.*, cr.denconfiguracion, cr.urlservidor')
                ->from('DatReporte r')
                ->innerJoin('r.NomConfiguracionReporte cr')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY);
            if ($params['campo']) {
                $query->orderby($params['campo']);
            }
            $temp = $query->getSqlQuery();

            $res ['data'] = $query->execute();
            $res ['total'] = $query->count();
            return $res;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function listarReportes($params)
    {
        extract($params);
        $cadena = 'SELECT r.*, cr.denconfiguracion, cr.urlservidor, cr.autenticarapikey, clr.denominacion as denclasificacion
                    FROM mod_integracionreporte.dat_reporte r
                    INNER JOIN mod_integracionreporte.nom_configuracionreporte cr ON r.idconfiguracion = cr.idconfiguracion 
                    LEFT JOIN mod_integracionreporte.nom_clasificacionreporte clr ON r.idclasificacion = clr.idclasificacion ';

        $addwhere = "";
        $arrayParams = array();
        $count = 0;
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos ['field'] == 'denreporte') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= " UPPER(replace(replace(replace(replace(replace(replace(r.denreporte,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
                if ($datos ['field'] == 'denconfiguracion') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= ($count == 0) ? '' : ' AND ';
                    $addwhere .= " UPPER(replace(replace(replace(replace(replace(replace(cr.denconfiguracion,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
                if ($datos ['field'] == 'urlservidor') {
                    $query = str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O', str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A', strtoupper($datos ['data'] ['value'])))))));
                    $addwhere .= ($count == 0) ? '' : ' AND ';
                    $addwhere .= " UPPER(replace(replace(replace(replace(replace(replace(cr.urlservidor,'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'))
                                  LIKE '%" . $query . "%' ";
                    $count++;
                }
                if ($datos ['field'] == 'idreportereportserver') {
                    $query = $datos ['data']['value'];
                    $addwhere .= ($count == 0) ? '' : ' AND ';
                    $addwhere .= " r.idreportereportserver LIKE '%" . $query . "%' ";
                    $count++;
                }
            }
            $cadena .= " WHERE (";
            $cadena .= " $addwhere ) ";
        }

        if ($sort) {
            if ($sort == 'denreporte') $cadena .= " ORDER BY r.$sort $dir";
            else  $cadena .= " ORDER BY cr.$sort $dir";
        } else {
            $cadena .= " ORDER BY r.denreporte ASC";
        }
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $resultado['total'] = count(
            $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC)
        );
        $cadena .= " LIMIT( $limit ) OFFSET( $start ) ";

        $result = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        $resultado['data'] = $result;
        return $resultado;

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
                if (strlen($where) == 0) {
                    $where .= $compar;
                } else {
                    $where .= 'AND ' . $compar;
                }
            }
        }
        return $where;
    }

    public function adicionarReporte($params)
    {
        extract($params);
        if (empty($denreporte) || empty($idreportereportserver) || empty($idconfiguracion)) {
            return 3; //campos obligatorios vacios
        } else {
            try {
                $this->datreporte->denreporte = $denreporte;
                $this->datreporte->descreporte = $descreporte;
                $this->datreporte->idconfiguracion = $idconfiguracion;
                if(is_numeric($idclasificacion))
                    $this->datreporte->idclasificacion = $idclasificacion;
                $this->datreporte->idreportereportserver = $idreportereportserver;
                $this->datreporte->save();
                if (isset($arrayfiltros[0])) {
                    $params['idreporte'] = $this->datreporte->idreporte;
                    $filtroreportemodel = new DatFiltroReporteModel();
                    $result = $filtroreportemodel->adicionarArrayFiltroReportes($params);
                    return $result;
                } else return 1;  //ok
            } catch (Exception $e) {
                echo ($e->getMessage());
                return -1; //error
            }
        }
    }

    public function modificarReporte($params)
    {
        extract($params);
        if (empty($denreporte) || empty($idreportereportserver) || empty($idconfiguracion) || empty($idreporte)) {
            return 3; //campos obligatorios vacios
        } else {
            try {
                $objdatreporte = Doctrine::getTable('DatReporte')->find($idreporte);
                if (isset($objdatreporte->idreporte)) {
                    $objdatreporte->denreporte = $denreporte;
                    $objdatreporte->descreporte = $descreporte;
                    $objdatreporte->idconfiguracion = $idconfiguracion;
                    if(is_numeric($idclasificacion))
                        $objdatreporte->idclasificacion = $idclasificacion;
                    $objdatreporte->idreportereportserver = $idreportereportserver;
                    $objdatreporte->save();
                    return 1;  //ok
                } else return 2; //no existe reporte
            } catch (Exception $e) {
                echo ($e->getMessage());
                return -1; //error
            }
        }
    }

    public function eliminarReporte($arrayidreportes)
    {
        $noexiste = 0;
        try {
            foreach ($arrayidreportes as $idreporte) {
                $objelemento = Doctrine::getTable('DatReporte')->find(
                    $idreporte
                );
                if (isset($objelemento->idreporte)) $objelemento->delete();
                else $noexiste++;
            }
        } catch (Exception $e) {
            $noexiste++;
        }
        $cant = count($arrayidreportes);
        if ($cant == 1) {
            if ($noexiste) $mensaje = 0; //mensaje :el elemento no existe en el registro
            else $mensaje = 1; //mensaje :elemento eliminado correctamente
        }
        if ($cant > 1) {
            if (!$noexiste) $mensaje = 1; // mensaje :elementos eliminados correctamente
            else if ($noexiste == $cant) $mensaje = 0; //los elementos no existen en el registro
            else $mensaje = 2; //algunos elementos no fueron eliminados
        }
        return $mensaje;
    }

    public function obtenerReporteDadoId($idreporte)
    {
        if (!empty($idreporte)) {
            $result = $this->datreporte->obtenerReporteDadoId($idreporte);
            if (isset($result['idreporte'])) {
                return $result;
            } else return 0; //no se encuentra el reporte
        } else return 2; //falta id reporte

    }

    public function obtenerReporteDadoIdSql($idreporte)
    {
        $cadenasql = 'SELECT r.*, cr.denconfiguracion, clr.denominacion as denclasificacion
                        FROM mod_integracionreporte.dat_reporte r
                        INNER JOIN mod_integracionreporte.nom_configuracionreporte cr ON (r.idconfiguracion = cr.idconfiguracion)
                        LEFT JOIN mod_integracionreporte.nom_clasificacionreporte clr ON (r.idclasificacion = clr.idclasificacion)';
        $cadenasql .= " WHERE (r.idreporte = $idreporte)";
        try {
            $conn = Doctrine_Manager::connection();
            $result = $conn->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Exception $e) {
            echo($e->getMessage());
            return -1;
        }
    }


}

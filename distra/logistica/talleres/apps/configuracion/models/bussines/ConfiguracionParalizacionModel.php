<?php

class ConfiguracionParalizacionModel extends BaseModel {

    public function __construct() {
        parent::__construct();
    }

    public function cargarReporteParalizacion($params) {
        $query = Doctrine_Query::create()->from('ConfReporteparalizacion r');
        $cantidad = $query->count();
        $datos = $query->orderBy('r.denominacion')->fetchArray();
        return array('datos' => $datos, 'cantidad' => $cantidad);
    }

    public function actionsReporte($params) {
        $reporte = new ConfReporteparalizacion();
        if ($params['actions'] == 'add') {
            $reporte->synchronizeWithArray($params);
        } else if ($params['actions'] == 'mod') {
            $reporte->assignIdentifier($params['idreporteparalizacion']);
            $reporte->synchronizeWithArray($params);
        } else if ($params['actions'] == 'del') {
            return Doctrine_Query::create()->delete()->from('ConfReporteparalizacion r')->whereIn('r.idreporteparalizacion', json_decode($params['idreporteparalizacion']))->execute();
        }
        $reporte->save();
    }

    public function getListaConcepto($params) {
        $util = json_decode($params['util']);
        $query = Doctrine_Query::create()->from($util->domain)->where('idreporteparalizacion = ?', array($params['idreporteparalizacion']));
        $data = $query->fetchArray();

        if (count($data)) {
            $ids = $this->objectHelper->extractValueFromArrayColumn($data, 'id' . $params['concepto']);
        } else {
            $ids = array(-1);
        }
        $return = array('datos' => array(), 'cantidad' => 0);
        switch ($params['concepto']) {
            case 'tipo':
                $params['idseleccionados'] = json_encode($ids);
                $maestro = new MaestroProductoModel();
//                $result = $maestro->devolverPadresHojas($params);
                $result = $maestro->devolverPadres($params);
                foreach ($result['datos'] as &$v) {
                    $v['idtipo'] = $v['idindicador'];
                }
                $return = $result;
                break;
            case 'gruposubgrupo':
                $where = " WHERE true ";
                if ($params['criterio']) {
                    $where .= " AND gs.denominacion ILIKE '%{$params['criterio']}%' ";
                }
                $conn = Zend_Registry::get('conexion');
                $selec = "Select gs.*";
                $from = " FROM  mod_datosmaestros.nom_gruposubgrupo gs 
                inner join mod_datosmaestros.nom_gruposubgrupohoja gsh on gsh.idgruposubgrupo = gs.idgruposubgrupo";
                if (count($ids) > 0)
                    $where .= " AND gs.idgruposubgrupo not in (" . implode(',', $ids) . ")";
                $limit = "";
                if ($params['limit']) {
                    $limit .= " LIMIT {$params['limit']} ";
                }
                if ($params['start']) {
                    $limit .= "OFFSET {$params['start']} ";
                }
                $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                        ->fetchAll(PDO::FETCH_ASSOC);
                $orderBy = " ORDER BY gs.denominacion ";
                $result = $conn->execute($selec . $from . $where . $orderBy . $limit)->fetchAll();

                $return = array('datos' => $result, 'cantidad' => count($total));
                break;
            case 'marca':
                $where = " WHERE true ";
                $conn = Zend_Registry::get('conexion');
                $selec = "Select m.*";
                $from = " FROM  mod_datosmaestros.nom_marca m ";
                if (count($ids) > 0)
                    $where .= " AND m.idmarca not in (" . implode(',', $ids) . ")";
                if ($params['criterio']) {
                    $where .= " AND m.denominacion ILIKE '%{$params['criterio']}%' ";
                }
                $limit = "";
                if ($params['limit']) {
                    $limit .= " LIMIT {$params['limit']} ";
                }
                if ($params['start']) {
                    $limit .= "OFFSET {$params['start']} ";
                }
                $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                        ->fetchAll(PDO::FETCH_ASSOC);
                $orderBy = " ORDER BY m.denominacion ";
                $result = $conn->execute($selec . $from . $where . $orderBy . $limit)->fetchAll();

                $return = array('datos' => $result, 'cantidad' => count($total));
                break;
            case 'modelo':
                $where = " WHERE true ";
                $conn = Zend_Registry::get('conexion');
                $selec = "Select distinct md.*";
                $from = " FROM mod_datosmaestros.nom_modelo md 
                            inner join mod_datosmaestros.dat_nommarcamodelo nmm on nmm.idmodelo = md.idmodelo 
                            inner join mod_logtaller.dat_reportemarca rm on rm.idmarca = nmm.idmarca";
                $where .= " AND rm.idreporteparalizacion = {$params['idreporteparalizacion']}";
                if (count($ids) > 0)
                    $where .= " and md.idmodelo not in (" . implode(',', $ids) . ")";
                if ($params['criterio']) {
                    $where .= " AND md.denominacion ILIKE '%{$params['criterio']}%' ";
                }
                $limit = "";
                if ($params['limit']) {
                    $limit .= " LIMIT {$params['limit']} ";
                }
                if ($params['start']) {
                    $limit .= "OFFSET {$params['start']} ";
                }
                $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                        ->fetchAll(PDO::FETCH_ASSOC);
                $orderBy = " ORDER BY md.denominacion ";
                $result = $conn->execute($selec . $from . $where . $orderBy . $limit)->fetchAll();

                $return = array('datos' => $result, 'cantidad' => count($total));
                break;
            default: break;
        }
        return $return;
    }

    public function getConceptoReporte($params) {
        $util = json_decode($params['util']);
        $query = Doctrine_Query::create()->from($util->domain)->where('idreporteparalizacion = ?', array($params['idreporteparalizacion']));
        $data = $query->fetchArray();
        if (count($data)) {
            $ids = $this->objectHelper->extractValueFromArrayColumn($data, 'id' . $params['concepto']);
        } else {
            $ids = array(-1);
        }
        $return = array('datos' => array(), 'cantidad' => 0);
        switch ($params['concepto']) {
            case 'tipo':
                $conn = Zend_Registry::get('conexion');
                $selec = "Select ni.*, rt.*, COUNT(*) OVER() as total";
                $from = " FROM  mod_logtaller.dat_reportetipo rt
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = rt.idtipo ";
                $where = " Where rt.idreporteparalizacion = {$params['idreporteparalizacion']}";
                $limit = "";
                if ($params['limit']) {
                    $limit .= " LIMIT {$params['limit']} ";
                }
                if ($params['start']) {
                    $limit .= "OFFSET {$params['start']} ";
                }
                $result = $conn->execute($selec . $from . $where . $limit)->fetchAll();

                $total = $result[0]['total'] ? $result[0]['total'] : 0;

                $return = array('datos' => $result, 'cantidad' => $total);
                break;
            case 'gruposubgrupo':
                if (count($ids) > 0) {
                    $conn = Zend_Registry::get('conexion');
                    $selec = "Select gs.*, rg.*";
                    $from = " FROM mod_logtaller.dat_reportegruposubgrupo rg
                    inner join  mod_datosmaestros.nom_gruposubgrupo gs on gs.idgruposubgrupo = rg.idgruposubgrupo
                inner join mod_datosmaestros.nom_gruposubgrupohoja gsh on gsh.idgruposubgrupo = gs.idgruposubgrupo ";
                    $where .= " AND rg.idreporteparalizacion = {$params['idreporteparalizacion']}";
                    $limit = "";
                    if ($params['limit']) {
                        $limit .= " LIMIT {$params['limit']} ";
                    }
                    if ($params['start']) {
                        $limit .= "OFFSET {$params['start']} ";
                    }
                    $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                            ->fetchAll(PDO::FETCH_ASSOC);

                    $result = $conn->execute($selec . $from . $where . $limit)->fetchAll();

                    $return = array('datos' => $result, 'cantidad' => count($total));
                }
                break;
            case 'marca':
                if (count($ids) > 0) {
                    $conn = Zend_Registry::get('conexion');
                    $selec = "Select m.*, rm.*";
                    $from = " FROM mod_logtaller.dat_reportemarca rm
                    inner join  mod_datosmaestros.nom_marca m on m.idmarca = rm.idmarca ";
                    $where .= " AND rm.idreporteparalizacion = {$params['idreporteparalizacion']}";
                    $limit = "";
                    if ($params['limit']) {
                        $limit .= " LIMIT {$params['limit']} ";
                    }
                    if ($params['start']) {
                        $limit .= "OFFSET {$params['start']} ";
                    }
                    $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                            ->fetchAll(PDO::FETCH_ASSOC);

                    $result = $conn->execute($selec . $from . $where . $limit)->fetchAll();

                    $return = array('datos' => $result, 'cantidad' => count($total));
                }
                break;
            case 'modelo':
                if (count($ids) > 0) {
                    $conn = Zend_Registry::get('conexion');
                    $selec = "Select distinct m.*, rm.*";
                    $from = " FROM mod_logtaller.dat_reportemodelo rm
                    inner join  mod_datosmaestros.nom_modelo m on m.idmodelo = rm.idmodelo ";
                    $where .= " AND rm.idreporteparalizacion = {$params['idreporteparalizacion']}";
                    $limit = "";
                    if ($params['limit']) {
                        $limit .= " LIMIT {$params['limit']} ";
                    }
                    if ($params['start']) {
                        $limit .= "OFFSET {$params['start']} ";
                    }
                    $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec . $from . $where)
                            ->fetchAll(PDO::FETCH_ASSOC);

                    $result = $conn->execute($selec . $from . $where . $limit)->fetchAll();

                    $return = array('datos' => $result, 'cantidad' => count($total));
                }
                break;
            default: break;
        }
        return $return;
    }

    public function actionsConcepto($params) {
        if ($params['actions'] == 'add') {
            $ids = json_decode($params['ids']);
            $util = json_decode($params['util']);
            $collection = new Doctrine_Collection($util->domain);
            foreach ($ids as $id) {
                $obj = new $util->domain();
                $existe = Doctrine::getTable($util->domain)->findByDql("{$params['idconcepto']} = ? and idreporteparalizacion = ?", array($id, $params['idreporteparalizacion']));
                if (count($existe) == 0) {
                    $obj = new $util->domain();
                    $obj->$params['idconcepto'] = $id;
                    $obj->idreporteparalizacion = $params['idreporteparalizacion'];
                    if ($params['idconcepto'] == 'idmodelo') {
                        $conn = Doctrine_Manager::connection();
                        $sqlQuery = "SELECT idmarca
                                        FROM mod_datosmaestros.dat_nommarcamodelo
                                        WHERE idmodelo = $id";
                        $result = $conn->execute($sqlQuery)->fetchAll(PDO::FETCH_COLUMN);
                        $obj->idmarca = $result[0];
                        unset($conn, $sqlQuery, $result);
                    }
                    $collection->add($obj);
                }
            }
            try {
                $collection->save();
            } catch (Exception $e) {
                if ($e->getCode() == 23505)
                    throw new ZendExt_Exception('LOG_LB_FAC_005');
            }
        } else {
            $ids = json_decode($params['ids']);
            $util = json_decode($params['util']);
            if (count($ids) > 0) {
                $query = Doctrine_Query::create()->delete()->from($util->domain)->whereIn("{$util->primaryKey}", $ids);
                $query->execute();
            }
        }
    }

}

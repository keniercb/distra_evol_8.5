<?php
/**
 * SolicitudNegocioRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class SolicitudNegocioRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalIdSolicitud' =>  array('statement'=>'sn.idsolicitud = ?')
        );
        parent::__construct('SolicitudNegocio', 'sn', 'idsolicitud', $filters);
    }

    public function getSolicitudesNegocio($params)
    {
        $sqlSolicitudNeg = $this->getSqlSolicitudesNegocio();
        $sqlEstado = $this->getSqlEstado();
        $sqlAreasImp = $this->getSqlAreasImplicadas();
        $sqlClientProv = $this->getSqlClienteProveedor();
        $sqlFilters = $this->getSqlFilters($params);

        $query = 'SELECT '.$sqlSolicitudNeg['select'].', '.$sqlEstado['select'].' '
            .$sqlSolicitudNeg['join'].' '.$sqlEstado['join'];
        $queryCount=$sqlSolicitudNeg['join'].' '.$sqlEstado['join'];
//print_r($query);die;
        if($sqlFilters[0]){
            $query .= $sqlFilters[0];
            $queryCount.=$sqlFilters[0];
        }
        if($sqlFilters[1]){
            $query = "SELECT * FROM (".$query.") sn WHERE ".$sqlFilters[1];
            $queryCount=" FROM (".'SELECT '.$sqlSolicitudNeg['select'].', '." ".$queryCount.") 
            sn WHERE ".$sqlFilters[1];
        }
        $ordenar='ORDER BY sn.idsolicitud DESC';
        if($params['sorters']){
            $ordenar='ORDER BY ';
            foreach(json_decode($params['sorters']) as $sort){
                $ordenar=$ordenar . $sort->property . ' ' . $sort->direction . ',';
            }
            $ordenar = trim($ordenar, ',');
        }
        $query=$query. ' ' .$ordenar;
        if(array_key_exists('limit', $params)){
            $start=$params['start']? $params['start'] : 0;
            $query.='  LIMIT '.$params['limit']." OFFSET ".$start;
        }
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
//        print($query);die;
        return array(
            'cant'=>$conn->fetchAll('SELECT count(*) '.$queryCount)[0]['count'],
            'datos'=>$conn->fetchAll($query),
        );
    }

    private function getSqlSolicitudesNegocio()
    {

        return array('select' => 'sn.*, sn.montototal,sn.idarearesponsable as idarea , sn2.nombre as solicituddemanda, sect.denominacion as sector, 
                        COALESCE (estuc.denominacion, estucop.denominacion) as arearesponsable, tl.denominacion as tipolinea,
                        i.denominacion as linea, 
                        (CASE WHEN sn.idpersona NOTNULL THEN per2.nombre||\' \'||per2.papel||\' \'||per2.sapel else \'\' END) as nombrepersona,
                        COALESCE((SELECT count(ofn.idsolicitud)
                         FROM mod_crmcontratacion.dat_ofertanegocio ofn
                        WHERE ofn.idsolicitud=sn.idsolicitud GROUP BY ofn.idsolicitud), 0) AS cantofertas,
                        EXISTS (SELECT sn1.idsolicitud
                         FROM mod_crmcontratacion.dat_solicitudnegocio sn1
                        WHERE sn1.idpadre=sn.idsolicitud) AS desactivada',
                     'join'   => "FROM mod_crmcontratacion.dat_solicitudnegocio sn
                        LEFT JOIN mod_crmcontratacion.nom_sector sect ON sect.idsector = sn.idsector
                        LEFT JOIN mod_estructuracomp.dat_estructura estuc ON (sn.idarearesponsable = estuc.idestructura and estuc.idproyecto = 0)
                        LEFT JOIN mod_estructuracomp.dat_estructuraop estucop ON (sn.idarearesponsable = estucop.idestructuraop and estucop.idproyecto = 0)
                        LEFT JOIN mod_persona.dat_persona per2 ON (sn.idpersona = per2.idpersona)
                        LEFT JOIN mod_crmcontratacion.nom_tipolinea tl ON (tl.idtipolinea=sn.idtipolinea)
                        LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio sn2 ON (sn.idpadre=sn2.idsolicitud)
                        LEFT JOIN mod_datosmaestros.nom_naturaleza i ON (i.idnaturaleza=sn.idlinea)
                        "
        );
    }

    private function getSqlEstado()
    {
        return array(
            'select' => 'ne.idestado as idestado, ne.nombre as estado, ne.icono as estadoicon,dsne.fechainicio as fechaestado, dsne.rolesobligatorios',
            'join' => "LEFT JOIN mod_crmcontratacion.dat_solicitudnegocioestado dsne ON dsne.idsolicitud = sn.idsolicitud and dsne.fechafin is null
                    LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = dsne.idestado"
        );
    }

    private function getSqlAreasImplicadas()
    {

        return array(
            'select' => "snai.idarea, snai.idestructura, COALESCE (estuc1.denominacion, estucop1.denominacion) as area",
            'join' => "LEFT JOIN mod_crmcontratacion.dat_solicitudnegocioareaimplicada snai ON snai.idsolicitud = sn.idsolicitud
                LEFT JOIN mod_estructuracomp.dat_estructura estuc1 ON (snai.idestructura = estuc1.idestructura and estuc1.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop estucop1 ON (snai.idestructura = estucop1.idestructuraop and estucop1.idproyecto = 0)"
        );
    }

    private function getSqlClienteProveedor()
    {

        return array(
            'select' => "(CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estru.denominacion, per.nombre||' '||per.papel||' '||per.sapel) END) as clienteproveedor",
            'join' => "LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idclientesproveedores= sn.idclienteproveedor 
                       LEFT JOIN mod_estructuracomp.dat_estructura estru ON (cp.idestructura = estru.idestructura and estru.idproyecto=0)
                       LEFT JOIN mod_persona.dat_persona per ON (cp.idpersona = per.idpersona)"
        );
    }

    private function getSqlFilters($filters)
    {
        $sqlFilter = array();
        $filterExtra=array();
        foreach($filters['filters'] as $val){
            $type=$val['data']['type'];
            $value=$val['data']['value'];
            if($value && !is_null($value)) {
                if ($val['field'] == 'idestructuracomun') {
                    array_push($sqlFilter, "sn.idestructuracomun=" . $value);
                } else if ($val['field'] == 'general') {
                    array_push($sqlFilter, "(sn.nombre ILIKE '%" . $value . "%' OR sn.numero ILIKE '%".$value."%')");
                } else if ($val['field'] == 'idsolicitud') {
                    array_push($sqlFilter, $this->getFilterNumeric('sn.idsolicitud', $value, $val['data']['comparison']));
                } else if ($val['field'] == 'nombre') {
                    array_push($sqlFilter, "sn.nombre ilike '%" . $value . "%'");
                } else if ($val['field'] == 'clienteproveedor') {
                    $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
                    $coinc = $conn->fetchAll("
                        SELECT aux2.idsolicitudnegocio FROM 
                        (SELECT snp2.idsolicitudnegocio,
                        (CASE WHEN cp2.registrado = 0 THEN cp2.nombre else COALESCE (estru2.denominacion, per2.nombre||' '||per2.papel||' '||per2.sapel) END) as nombre
                        FROM mod_crmcontratacion.dat_solicitudnegocioproveedor snp2
                        LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp2 ON cp2.idclientesproveedores=snp2.idproveedor
                        LEFT JOIN mod_estructuracomp.dat_estructura estru2 ON (cp2.idestructura = estru2.idestructura and estru2.idproyecto=0)
                        LEFT JOIN mod_persona.dat_persona per2 ON (cp2.idpersona = per2.idpersona)
                        ) aux2
                        WHERE aux2.nombre ILIKE '%" . $value . "%'");
                    $ids = array();
                    foreach ($coinc as $temp) {
                        $ids[] = $temp['idsolicitudnegocio'];
                    }
                    $filtcliente = count($ids) > 0 ? "(sn.clienteproveedor ilike '%" . $value . "%' OR 
                                sn.idsolicitud in (" . implode(',', $ids) . "))" : "sn.clienteproveedor ilike '%" . $value . "%'";
                    array_push($filterExtra, $filtcliente);
                } else if ($val['field'] == 'sector') {
                    array_push($sqlFilter, $this->getFilterList('sn.idsector', $value));
                } else if ($val['field'] == 'arearesponsable') {
                    array_push($sqlFilter, "(estuc.denominacion ilike '%" . $value . "%' or 
                    estucop.denominacion ilike '%" . $value . "%')");
                } else if ($val['field'] == 'estado') {
                    array_push($sqlFilter, $this->getFilterList('ne.idestado', $value));
                } else if ($val['field'] == 'idestado') {
                    $idsestado = is_array($value) ? $value : array($value);
                    array_push($sqlFilter, 'dsne.idestado in (' . implode(',', $idsestado) . ')');
                } else if ($val['field'] == 'cliente') {
                    $value = json_decode($value);
                    $idtipo = is_array($value) ? $value : array($value);
                    array_push($sqlFilter, 'sn.cliente in (' . implode(',', $idtipo) . ')');
                } else if ($val['field'] == 'idlinea') {
                    array_push($sqlFilter, 'sn.idlinea = ' . $value);
                }else if ($val['field'] == 'rangofechaestado') {
                    array_push($sqlFilter, $this->getFilterDate('dsne.fechainicio', $value, $val['data']['comparison']));
                } else if ($type == 'date') {
                    $field = $val['field'];
                    array_push($sqlFilter, $this->getFilterDate($field, $value, $val['data']['comparison']));
                }else if ($val['field'] == 'numero') {
                    array_push($sqlFilter, "sn.numero ILIKE '%".$value."%'");
                }
            }
        }
        $result = implode(" and ", $sqlFilter);
        if(!empty($result))
            $result=' WHERE '.$result;
        $result2=implode(' and ', $filterExtra);
        return array($result, $result2);
    }

    private function attachSqlAcotarCantidadSalidas($sqlFilters, $limit, $start)
    {
        $result = "sn.idsolicitud IN (SELECT doctrine_subquery_alias.idsolicitud FROM (SELECT DISTINCT m3.idsolicitud FROM
         mod_crmcontratacion.dat_solicitudnegocio m3 LEFT JOIN mod_crmcontratacion.dat_solicitudnegocioareaimplicada
         m4 ON m3.idsolicitud = m4.idsolicitud ";

        if(!empty($sqlFilters))
            $result .= " WHERE ".str_replace('sn.', 'm3.', $sqlFilters);

        $result .= "order by m3.idsolicitud LIMIT ".$limit." OFFSET ".$start.") AS doctrine_subquery_alias)";

        if(!empty($sqlFilters))
            $result .=' AND ('.$sqlFilters.')';

        return $result;
    }

    private function getFilterList($field, $value){
        $value=json_decode($value);
        if (is_array($value) && count($value)>0) {
            $value = implode(',', $value);
        }
        return $field . " IN (" . $value . ")";
    }

    private function getFilterDate($field, $value, $comparison)
    {
        if ($comparison == 'lt') {
            return $field . " < '" . $value . "'";
        }
        if ($comparison == 'gt') {
            return $field . " > '" . $value . "'";
        }
        if ($comparison == 'eq') {
            return $field . " = '" . $value . "'";
        }
        if ($comparison == 'in') {
            return $field . " ISNULL";
        }
        if ($comparison == 'nn') {
            return $field . " NOTNULL";
        }
    }

    private function getFilterNumeric($field, $value, $comparison)
    {
        $value = !is_array($value) ? json_decode($value) : $value;
        if ($comparison == 'lt') {
            return $field . " < " . $value;
        }
        if ($comparison == 'gt') {
            return $field . " > " . $value;
        }
        if ($comparison == 'di') {
            return $field . " <> " . $value;
        }
        if (is_array($value)) {
            return $field . " in( " . implode(' , ', $value) . ")";
        } else {
            return $field . " = " . $value;
        }
    }

    private function getSqlFilters2($filters)
    {
        $sqlFilter = array();

        foreach($filters['filters'] as $val){

            if($val['property'] == 'idsolicitud')
                array_push($sqlFilter, 'sn.idsolicitud = '.$val['value']);

            if($val['property'] == 'nombre')
                array_push($sqlFilter, "sn.nombre ilike '%".$val['value']."%'");

            if($val['property'] == 'idclientesproveedores')
                array_push($sqlFilter, 'sn.idclienteproveedor = '.$val['value']);

            if($val['property'] == 'idsector')
                array_push($sqlFilter, 'sn.idsector = '.$val['value']);

            if($val['property'] == 'idarea')
                array_push($sqlFilter, 'sn.idarearesponsable = '.$val['value']);

            if($val['property'] == 'idestado'){
                $idsestado =is_array($val['value'])?$val['value']:array($val['value']);
                array_push($sqlFilter, 'dsne.idestado in ('.implode(',', $idsestado).')');
            }
        }

        $result = implode(" and ", $sqlFilter);

        if(array_key_exists('limit', $filters)){
            $result = $this->attachSqlAcotarCantidadSalidas(
                $result,
                $filters['limit'],
                ( $filters['start'] )? $filters['start'] : 0
            );
        }

        return $result;
    }

}
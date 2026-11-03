<?php
/**
 * OfertaNegocioRepository
 *
 * @package Persistencia de datos.
 * @subpackage Interfaces Repositorios.
 * @copyright UCID
 * @version 1.0
 */
class OfertaNegocioRepository extends BaseRepository
{
    public function  __construct()
    {
        $filters = array(
            'equalOferta'=> array('statement'=>'ofern.idoferta = ?'),
        );
        parent::__construct('OfertaNegocio', 'ofern', 'idoferta', $filters);
    }

    public function getOfertasNegocio($filters)
    {
        $sqlOfer = $this->getSqlOfertaNegocio();
        $sqlSol =  $this->getSqlSolicitudNegocio();
        $sqlEst = $this->getSqlEstado();
        $sqlFilters = $this->getSqlFilters($filters);
//        print('/*'.$filters['filtrofijo'].'*/');
        if($filters['filtrofijo']){
            $sqlFilters[0].=' AND ofern.idsolicitud='.$filters['filtrofijo'];
        }
//        print($sqlFilters);die;
        // .$sqlSol['select'].','     ' '.$sqlSol['join'].
        $query = $sqlOfer['select'].','.$sqlEst['select'].' '.$sqlOfer['join'].' '.$sqlEst['join'];
        $queryCount = $sqlOfer['join'].' '.$sqlEst['join'];

//        print('/*'.$ordenar.'*/');
//        if($filters['idestructuracomun'])
//            $query.='  ofern.idestructuracomun='.$filters['idestructuracomun'];
        if($sqlFilters[0]) {
            $query .= ' WHERE ' . $sqlFilters[0];
            $queryCount.=' WHERE '.$sqlFilters[0];
        }
        if($sqlFilters[1]) {
            $query = "SELECT * FROM (" . $query . ") a WHERE " . $sqlFilters[1];
            $queryCount=" FROM (".$sqlOfer['select'].','.$sqlEst['select'].' '." ".$queryCount.") 
            ofern WHERE ".$sqlFilters[1];
        }
        $ordenar='ORDER BY ofern.idoferta DESC';
        if($filters['sorters']){
            $ordenar='ORDER BY ';
            foreach(json_decode($filters['sorters']) as $sort){
                $ordenar=$ordenar . $sort->property . ' ' . $sort->direction . ',';
            }
            $ordenar = trim($ordenar, ',');
//            $ordenar.=', ofern.idoferta DESC';
        }
        $query=$query. ' ' .$ordenar;
//        print('/*$sqlFilters:'.$sqlFilters.'*/');
        if(array_key_exists('limit', $filters)){
            $start=$filters['start']? $filters['start'] : 0;
            $query.=' LIMIT '.$filters['limit']." OFFSET ".$start;
        }
//        print($query);die;
//        print('SELECT count(*) '.$queryCount);die;
        try{
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result= $conn->fetchAll($query);
//            $cant=$conn->fetchAll('SELECT count(*) '.$queryCount);
//            return $result;
            return  array(
//                'cantidad'=>$cant[0]['count'],
                'cantidad'=>count($result)?$result[0]['count']:0,
                'datos'=>$result
//                'cantidad'=>$conn->fetchAll('SELECT count(*) '.$queryCount)[0]['count'],
//                'datos'=>$conn->fetchAll($query),
            );
        }catch(Exception $e){
            throw $e;
        }
    }

    private function getSqlOfertaNegocio()
    {
        return array(
            'select' => 'SELECT DISTINCT count(ofern.idoferta) over(), ofern.*, ofer.*, ofer.idincoterms as idincoterm, 
                    ntp.nombre as condicionpago, sect.denominacion as sector, sn.nombre as solicitud, 
                    sn.numero as numerosolicitud, nem.denominacion as embalaje,
                    sn.idlinea, sn.idtipolinea, ni.denominacion as linea, ntl.denominacion as tipolinea,
                    COALESCE (inc.abreviatura) as incoterms, COALESCE (te.denominacion) as tiempoentrega,
                    COALESCE (estuc.denominacion, estucop.denominacion) as arearesponsable, ofern.idresponsable AS idpersona,
                    (CASE WHEN ofern.idresponsable NOTNULL THEN per.nombre||\' \'||per.papel||\' \'||per.sapel else \'\' END) as nombreresponsable,
                    (CASE WHEN cp.registrado = 0 THEN cp.nombre else COALESCE (estrucp.denominacion, percp.nombre||\' \'||percp.papel||\' \'||percp.sapel) END) as clienteproveedor,
                    inc.peso as pesoincoterms, po.nombrepais as paispuertoorigen, po.peso as pesopuertoorigen,
                    pd.peso as pesopuertodestino, 
                    te.peso as pesotiempoentrega, nmt.denominacion as mediotransporte,
                    (CASE WHEN ofern.fechafirma IS NOT NULL AND 
                    (CASE WHEN ofern.unidadtiempo=1 THEN ofern.fechafirma+CAST(ofern.vigencia||\' days\' AS INTERVAL) > CURRENT_DATE ELSE 
                    ofern.fechafirma+CAST(ofern.vigencia||\' month\' AS INTERVAL) > CURRENT_DATE END) THEN 1 ELSE 0 END) as vigente',
            'join' => "FROM mod_crmcontratacion.dat_ofertanegocio ofern
                LEFT JOIN mod_crmcontratacion.dat_oferta ofer ON ofer.idofertanegocio = ofern.idoferta
                LEFT JOIN mod_crmcontratacion.nom_incoterm inc ON inc.idincoterm = ofer.idincoterms
                LEFT JOIN mod_crmcontratacion.nom_puertoorigen po ON po.idpuertoorigen = ofer.idpuertoorigen
                LEFT JOIN mod_crmcontratacion.nom_puertodestino pd ON pd.idpuertodestino = ofer.idpuertodestino
                LEFT JOIN mod_crmcontratacion.nom_tiempoentrega te ON te.idtiempoentrega = ofer.idtiempoentrega
                LEFT JOIN mod_crmcontratacion.nom_embalaje nem ON nem.idembalaje = ofer.idembalaje
                LEFT JOIN mod_crmcontratacion.nom_mediotransporte nmt ON nmt.idmediotransporte = ofer.idmediotransporte
                LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio sn ON sn.idsolicitud = ofern.idsolicitud
                LEFT JOIN mod_datosmaestros.nom_naturaleza ni ON sn.idlinea = ni.idnaturaleza
                LEFT JOIN mod_crmcontratacion.nom_tipolinea ntl ON sn.idtipolinea = ntl.idtipolinea
                LEFT JOIN mod_datosmaestros.nom_terminosdepago ntp ON ntp.idterminodepago = ofern.idcondicionpago
                LEFT JOIN mod_crmcontratacion.nom_sector sect ON sect.idsector = ofern.idsector
                LEFT JOIN mod_datosmaestros.nom_clientesproveedor cp ON ofern.idclienteproveedor = cp.idclientesproveedores
                LEFT JOIN mod_estructuracomp.dat_estructura estrucp ON (cp.idestructura = estrucp.idestructura and estrucp.idproyecto=0)
                LEFT JOIN mod_persona.dat_persona percp ON (cp.idpersona = percp.idpersona)
                LEFT JOIN mod_persona.dat_persona per ON ofern.idresponsable=per.idpersona
                LEFT JOIN mod_estructuracomp.dat_estructura estuc ON (ofern.idarea = estuc.idestructura and estuc.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop estucop ON (ofern.idarea = estucop.idestructuraop and estucop.idproyecto = 0)
                "
        );
    }
    //LEFT JOIN mod_crmcontratacion.dat_monedaoferta mo ON ofern.idoferta = mo.idoferta
    //LEFT JOIN mod_datosmaestros.nom_moneda m ON mo.idmoneda = m.idmoneda

    private function getSqlSolicitudNegocio()
    {
        return array(
            'select' => 'sn.idsolicitud as idsolicitud, sn.idclienteproveedor as idclienteproveedor, sn.nombre as solicitud,
                        COALESCE (estuc.denominacion, estucop.denominacion) as arearesponsable, i.numeropieza as codigoLinea,sect.denominacion as sector',
            'join' => "LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio sn ON sn.idsolicitud = ofern.idsolicitud
                LEFT JOIN mod_crmcontratacion.nom_sector sect ON sect.idsector = sn.idsector
                LEFT JOIN mod_datosmaestros.nom_indicador i ON sn.idlinea= i.idindicador
                LEFT JOIN mod_estructuracomp.dat_estructura estuc ON (sn.idarearesponsable = estuc.idestructura and estuc.idproyecto = 0)
                LEFT JOIN mod_estructuracomp.dat_estructuraop estucop ON (sn.idarearesponsable = estucop.idestructuraop and estucop.idproyecto = 0)"
        );
    }

    private function getSqlEstado()
    {
        return array(
            'select' => 'ne.idestado as idestado, ne.nombre as estado, ne.icono as estadoicon, oferest.fechainicio as fechaestado, ne.inicial as estadoinicial',
            'join' => "LEFT JOIN mod_crmcontratacion.dat_ofertanegocioestado oferest ON oferest.idoferta = ofern.idoferta and oferest.fechafin is null
                    LEFT JOIN mod_crmcontratacion.nom_estado ne ON ne.idestado = oferest.idestado"
        );
    }

    private function getSqlFilters($filters){
        $sqlFilter = array();
        $filterExtra=array();
        $isnumeric = array('int', 'numeric');
//        print_r($filters);die;
        foreach($filters['filters'] as $val){
            $type=$val['data']['type'];
            $value=$val['data']['value'];
//            print('/*field:'.$val['field'].'*/');
//            print('/*$value:'.$value.'*/');
            if($value && !is_null($value)) {
                if ($val['field'] == 'idestructuracomun') {
//                    ofern.idestructuracomun='.$filters['idestructuracomun'];
                    array_push($sqlFilter, "ofern.idestructuracomun=" . $value);
                }else if ($val['field'] == 'general') {
                    array_push($sqlFilter, "(ofern.nombre ILIKE '%" . $value . "%' OR ofern.numero ILIKE '%".$value."%')");
                }else if ($val['field'] == 'nombre') {
                    array_push($sqlFilter, "ofern.nombre ilike '%" . $value . "%'");
                } else if ($val['field'] == 'clienteproveedor') {
//                    array_push($sqlFilter, "cp.nombre ilike '%" . $value . "%'");
                    array_push($filterExtra, "a.clienteproveedor ILIKE '%".$value."%'");
                } else if ($val['field'] == 'sector') {
                    array_push($sqlFilter, $this->getFilterList('ofern.idsector', $value));
                    //                array_push($sqlFilter, "sect.denominacion ilike '%".$value."%'");
                } else if ($val['field'] == 'solicitud') {
                    array_push($sqlFilter, 'ofern.idsolicitud=' . $value);
                } else if($val['field'] == 'clasificacionclienteproveedor'){
                    array_push($sqlFilter, 'cp.idclasificacion=' . $value);
                } else if($val['field'] == 'tienecontrato'){
                    array_push($sqlFilter, 'ofern.idcontrato IS ' . ($value=='true'?'NOT NULL ':'NULL '));
                }
                else if ($type == 'list') {
                    $field = $val['field'];
                    if ($val['field'] == 'estado') {
                        $field = 'oferest.idestado';
                    } else if ($val['field'] == 'cliente') {
                        $field = 'ofern.cliente';
                    }
                    array_push($sqlFilter, $this->getFilterList($field, $value));
                } else if (in_array($type, $isnumeric)) {
                    if(stristr($val['field'], 'montomoneda_')){
//                        print_r(str_split($val['field'], 12));die;
                        array_push($sqlFilter, "(".$this->getFilterNumeric('mo.valor', $value, $val['data']['comparison']).
                            " AND m.codigoiso ILIKE '".str_split($val['field'], 12)[1]."')");
                    }else{
                        array_push($sqlFilter, $this->getFilterNumeric($val['field'], $value, $val['data']['comparison']));
                    }
                } else if ($type == 'date') {
                    $field = $val['field'];
                    if ($val['field'] == 'fechainicio') {
                        $field = 'ofern.fechainicio';
                    } else if ($val['field'] == 'fechafirma') {
                        $field = 'ofern.fechafirma';
                    }
                    array_push($sqlFilter, $this->getFilterDate($field, $value, $val['data']['comparison']));
                }
            }
        }
        $result = implode(" and ", $sqlFilter);
        $result2=implode(' and ', $filterExtra);
        return array($result, $result2);
    }

    private function getFilterList($field, $value){
        $value=!is_array($value) ? json_decode($value) : $value;
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
        print_r($filters['filters']);
        foreach($filters['filters'] as $val){

            if($val['property'] == 'idoferta')
                array_push($sqlFilter, 'ofern.idoferta = '.$val['value']);

            if($val['property'] == 'nombre')
                array_push($sqlFilter, "ofern.nombre ilike '%".$val['value']."%'");

            if($val['property'] == 'idcondicionpago')
                array_push($sqlFilter, 'ofern.idcondicionpago = '.$val['value']);

            if($val['property'] == 'idmediodepago')
                array_push($sqlFilter, 'ofern.idmediopago = '.$val['value']);

            if($val['property'] == 'idclientesproveedores')
                array_push($sqlFilter, 'sn.idclienteproveedor = '.$val['value']);

            if($val['property'] == 'idsector')
                array_push($sqlFilter, 'sn.idsector = '.$val['value']);

            if($val['property'] == 'idarea')
                array_push($sqlFilter, 'sn.idarearesponsable = '.$val['value']);

            if($val['property'] == 'idestado'){
                $idsestado =is_array($val['value'])?$val['value']:array($val['value']);
                array_push($sqlFilter, 'oferest.idestado in ('.implode(',', $idsestado).')');
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

    private function attachSqlAcotarCantidadSalidas($sqlFilters, $limit, $start)
    {
        $result = "ofern.idoferta IN (SELECT doctrine_subquery_alias.idoferta FROM (SELECT DISTINCT m3.idoferta 
            FROM mod_crmcontratacion.dat_ofertanegocio m3 
            LEFT JOIN mod_crmcontratacion.dat_solicitudnegocio m5 ON m3.idsolicitud = m5.idsolicitud";

        if(!empty($sqlFilters))
            $result .= " WHERE ".str_replace('sn.', 'm5.', str_replace('ofern.', 'm3.', $sqlFilters));

        $result .= " LIMIT ".$limit." OFFSET ".$start.") AS doctrine_subquery_alias)";

        if(!empty($sqlFilters))
            $result .=' AND ('.$sqlFilters.')';

        return $result;
    }
}
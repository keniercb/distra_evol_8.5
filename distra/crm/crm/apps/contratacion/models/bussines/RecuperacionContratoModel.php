<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:39 PM
 */

class RecuperacionContratoModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_idestructura = $this->global->Estructura->idestructura;
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->DatHitoContrato = new DatHitoContrato();
    }

    public function getMainRecuperacionContrato($params){
        $result=array();
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $extraWhere='';
		//print_r($params);die;
        $start=$params['start'];
        $limit=$params['limit'];
		$fechainicio=$params[filter][50][data][value];
		//print_r($fechainicio);die;
		$fechafin=$params[filter][51][data][value];
	
//        $filters= $this->DatHitoContrato->getFilters($params['filter']);
//        if (count($filters))$extraWhere.= ' AND ' . implode(" AND ", $filters);
        $filters2=$this->getFilters($params['filter']);
        if (count($filters2))$extraWhere.= ' AND ' . implode(" AND ", $filters2);
        $query="SELECT count(dh.idhito) over(), dh.*, 
           c.nombre as nombrecontrato, c.numerocontrato, 
           COALESCE (desop1.denominacion, des1.denominacion) as nombreareacontrato,
           e1.nombre as nombreestadocontrato,
           COALESCE (desop.denominacion, des.denominacion) as nombrearea,
           e.nombre as nombreestado, dhe.fechainicio, e.icono as iconoestado,
           (SELECT SUM(mih.valor) FROM mod_crmcontratacion.dat_indicadorhito ih
           INNER JOIN mod_crmcontratacion.dat_monedaindicador mih 
           ON (mih.idindicadorhito=ih.idindicadorhito) WHERE ih.idhito=dh.idhito) as montoservicios,
           (SELECT COUNT(ih.idindicadorhito) FROM mod_crmcontratacion.dat_indicadorhito ih
           WHERE ih.idhito=dh.idhito) as cantservicios
           FROM mod_crmcontratacion.dat_hito dh
           LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=dh.idcontrato
           LEFT JOIN mod_estructuracomp.dat_estructura des ON (dh.idarea = des.idestructura and des.idproyecto = 0) 
           LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (dh.idarea = desop.idestructuraop and desop.idproyecto = 0) 
           LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito=dhe.idhito AND dhe.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=dhe.idestado
           LEFT JOIN mod_estructuracomp.dat_estructura des1 ON (c.idarea = des1.idestructura and des1.idproyecto = 0) 
           LEFT JOIN mod_estructuracomp.dat_estructuraop desop1 ON (c.idarea = desop1.idestructuraop and desop1.idproyecto = 0) 
           LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (c.idcontrato=ce.idcontrato AND ce.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e1 ON e1.idestado=ce.idestado
		   INNER JOIN (SELECT n.*,VALUE FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
           WHERE VALUE::VARCHAR = '\"endedwork\"') fact ON fact.idestado = ce.idestado
           WHERE c.cliente=1 and ((COALESCE(dh.fechareplanificada,dh.fechaestimada) BETWEEN '$fechainicio' AND '$fechafin') or (dhe.fechainicio BETWEEN '$fechainicio' AND '$fechafin' ) ) $extraWhere
           ORDER BY dh.numero, dh.fechaestimada
           LIMIT $limit OFFSET $start;";

//        print($query);die;
        $result=$conexionActual->fetchAll($query);
//       $post=new stdClass();
//       $post->idestructura=$this->global->Estructura->idestructura;
//       $post->filter=$params['filter'];
//       $result=$this->DatHitoContrato->cargarhitoscontrato($post);
        foreach($result as &$r){
           $infoareas=$conexionActual->fetchAll(
               "SELECT count(ha.idhitoareaimplicada) as cantareas,sum(ha.monto) as montodesglose
                FROM mod_crmcontratacion.dat_hitoareaimplicada ha
                WHERE ha.idhito=".$r['idhito']
           );
           $r['cantareas']=$infoareas[0]['cantareas'];
           $r['montodesglose']=0;
           if($infoareas[0]['cantareas']>0)
               $r['montodesglose']=$infoareas[0]['montodesglose'];

           $pago = DatMonedaHito::cargarMonedasHito(
               array(
                   'idhito'       => $r['idhito'],
                   'idestructura' => $this->global->Estructura->idestructura)
           );
           $total = 0;
           foreach ($pago as $p) {
               $total = $total + (float)$p['monto'];
           }
           $r['pago'] = $pago;
           $r['montototal'] = $total;
        }
//        $mostrarTipos=$this->getFilterValue($params['filter'], 'mostrartipos');
//        if ($mostrarTipos) {
//            $query
//                = "SELECT * FROM(" . $query . ")a WHERE " . $this->filtroMostrarTipos($mostrarTipos);
//        }
        $cant=count($result)>0?$result[0]['count']:0;
        return array('success' => true, 'data' => $result, 'total' => $cant,
            'monedasentidad'=>$this->getArrayMonedasEntidad($this->global->Estructura->idestructura));
    }

    private function getFilters($filtros){
       $where = [];
       foreach ($filtros as $f) {
           $value = $f['data']['value'];
           $type = $f['data']['type'];
           $comparison = $f['data']['comparison'];
           $field = $f['field'];
//           $field = in_array($f['field'], $columns) ? 'c.' . $f['field'] : $f['field'];
           if($type=='string'){
               $where[] = $this->getStringFilter($field, $value);
           }else if($type=='int') {
               $where[] = $this->getNumericFilter($field, $value);
           }else if($type=='list') {
               $where[] = $this->getListFilter($field, $value);
           }else if ($f['field'] == 'mostrartipos') {
               $where[] = $this->filtroMostrarTipos($value);
           }/*else if($field=='fechafin'){
               if ($comparison == 'lt') {
                   $where[]="(dh.fechaestimada <= '" . $value . "' OR dh.fechareplanificada <= '".$value."')";
               }
               if ($comparison == 'gt') {
                   $where[]="(dh.fechaestimada >= '" . $value . "' OR dh.fechareplanificada >= '".$value."')";
               }
           }*/
       }
       return $where;
    }

    private function getStringFilter($field, $value)
    {
        if ($value) {
            return "$field ILIKE '%" . $value . "%'";
        }
    }

    private function getNumericFilter($field, $value)
    {
        if ($value) {
            return "$field =" . $value;
        }
    }

    private function getListFilter($field, $value)
    {
//        print($value);die;
        if ($value) {
            if (!is_array($value)) {
                $value = json_decode($value);
                $value = !is_array($value) ? [$value] : $value;
            }
            return $field . " IN (" . implode(',', $value) . ")";
        }
    }

    private function filtroMostrarTipos($value){
       $tipos = [];
       foreach (explode(',', $value) as $tipo) {
           if ($tipo == 'correctos') {
               $tipos[] = "(EXISTS(SELECT ih.idindicadorhito FROM mod_crmcontratacion.dat_indicadorhito ih
                        WHERE ih.idhito=dh.idhito) AND 
                        (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)=
                        (SELECT sum(mih.valor) FROM mod_crmcontratacion.dat_indicadorhito ih
                        LEFT JOIN mod_crmcontratacion.dat_monedaindicador mih ON mih.idindicadorhito=ih.idindicadorhito
                        WHERE ih.idhito=dh.idhito))";
//               $tipos[]="(a.cantareas>0 AND a.montototal==a.montodesglose)";
           } else if ($tipo == 'incorrectos') {
               $tipos[] = "(EXISTS(SELECT ih.idindicadorhito FROM mod_crmcontratacion.dat_indicadorhito ih
                        WHERE ih.idhito=dh.idhito) AND 
                        (SELECT sum(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh WHERE mh.idhito=dh.idhito)<>
                        (SELECT sum(mih.valor) FROM mod_crmcontratacion.dat_indicadorhito ih
                        LEFT JOIN mod_crmcontratacion.dat_monedaindicador mih ON mih.idindicadorhito=ih.idindicadorhito
                        WHERE ih.idhito=dh.idhito))";
//               $tipos[]="(a.cantareas>0 AND a.montototal!=a.montodesglose)";
           } else if ($tipo == 'sindesglose') {
               $tipos[] = "NOT EXISTS(SELECT ih.idindicadorhito FROM mod_crmcontratacion.dat_indicadorhito ih
                        WHERE ih.idhito=dh.idhito)";
//               $tipos[]="a.cantareas==0";
           }
       }
       return '('.implode(' OR ', $tipos).')';
    }

    private function getFilterValue($filter, $search)
    {
//        return $filter[0];
        foreach ($filter as $f) {
//            return $f;
            if ($f['field'] == $search) {
                return $f['data']['value'];
            }
        }
        return false;
    }

    private function getArrayMonedasEntidad($idestructura)
    {
        try {
            $resultado = $this->_datosmaestros->getMonedasEntidad(
                $idestructura
            );
//            foreach($resultado as $r){
//                $this->_extrafields['montomoneda_'.strtolower($r['codigoiso']).'_'.$r['idmoneda']]= array('type' => 'int');
//            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

     public function calcularMontosTotales($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
		$fechainicio=$params[filter][50][data][value];
		//print_r($fechainicio);die;
		$fechafin=$params[filter][51][data][value];
        $filters=$this->getFilters($params['filter']);
        if (count($filters))$extraWhere.= ' AND ' . implode(" AND ", $filters);
        $query="SELECT 
            SUM((SELECT SUM(mh.valor) FROM mod_crmcontratacion.dat_monedahito mh
             WHERE mh.idhito=dh.idhito)) as montoshitos,
            SUM((SELECT SUM(mih.valor) FROM mod_crmcontratacion.dat_indicadorhito ih
               INNER JOIN mod_crmcontratacion.dat_monedaindicador mih 
               ON (mih.idindicadorhito=ih.idindicadorhito) WHERE ih.idhito=dh.idhito)) as montosservicios
           FROM mod_crmcontratacion.dat_hito dh
           LEFT JOIN mod_crmcontratacion.dat_contrato c ON c.idcontrato=dh.idcontrato
		   LEFT JOIN mod_crmcontratacion.dat_hitoestado dhe ON (dh.idhito=dhe.idhito AND dhe.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=dhe.idestado
		   LEFT JOIN mod_crmcontratacion.dat_contratoestado ce ON (c.idcontrato=ce.idcontrato AND ce.fechafin IS NULL)
           LEFT JOIN mod_crmcontratacion.nom_estado e1 ON e1.idestado=ce.idestado
		   INNER JOIN (SELECT n.*,VALUE FROM mod_crmcontratacion.nom_estado n,json_array_elements(n.acciones) ac 
           WHERE VALUE::VARCHAR = '\"endedwork\"') fact ON fact.idestado = ce.idestado
            WHERE c.cliente=1 and ((COALESCE(dh.fechareplanificada,dh.fechaestimada) BETWEEN '$fechainicio' AND '$fechafin') or (dhe.fechainicio BETWEEN '$fechainicio' AND '$fechafin' ) ) $extraWhere";
       
        $result=$conexionActual->fetchAll($query);
        //AND (dh.fechaestimada BETWEEN '$fechainicio' AND '$fechafin'
        //OR dh.fechareplanificada BETWEEN '$fechainicio' AND '$fechafin')
        return $result;
    }
}

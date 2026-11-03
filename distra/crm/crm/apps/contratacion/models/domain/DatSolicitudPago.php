<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatSolicitudPago extends BaseDatSolicitudPago
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarSolicitudesPago($params){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where=''; $where2='';$offset='';
        $result=array('data'=>[],'total'=>0);
        if ($params['filter']) {
            //            $filtros=json_decode($params['filter']);
            $parametros = self::getFiltros($params['filter']);
            //            if($filtros[0]->property=='idcontrato'){
            //                $where=' WHERE sp.idcontrato='.$filtros[0]->value;
            //            }
        }
        if ($params['idcontrato']) {
            $parametros[] = 'sp.idcontrato=' . $params['idcontrato'];
            $where2='WHERE sp.idcontrato='. $params['idcontrato'];
        }
        if (count($parametros) > 0) {
            $where = ' WHERE ' . implode(' AND ', $parametros);
        }
        if(!is_null($params['start']) && !is_null($params['limit'])){
            $offset=' OFFSET '. $params['start'].' LIMIT '.$params['limit'];
        }
        $query = "SELECT sp.*, mp.nombre as mediopago, e.nombre as estado,
          e.icono, spe.idestado,spe.fechainicio as fechaestado,
          spo.hitos, spo.indicadores,
          COALESCE (desop.denominacion, des.denominacion) as nombrearea".
            self::getFroms(). $where." ORDER BY sp.fecharecibo ".$offset;
//            print($query);
        $datos = $conexionActual->fetchAll($query);
        foreach($datos as $index=>$value){
            $montos=$conexionActual->fetchAll(
                "SELECT sum(fm.valor) as monto, m.codigoiso 
                  FROM mod_crmcontratacion.dat_facturamoneda fm
                  LEFT JOIN mod_crmcontratacion.dat_facturasolicitudpago f 
                  ON f.idfactura=fm.idfactura 
                  LEFT JOIN mod_datosmaestros.nom_moneda m 
                  ON m.idmoneda=fm.idmoneda 
                  WHERE f.idsolicitudpago=".$value['idsolicitudpago']."
                  GROUP BY m.codigoiso"
            );
            $datos[$index]['montototal']=$montos;
        }
        $cant = $conexionActual->fetchAll(
            "SELECT count(sp.idsolicitudpago) ".self::getFroms(). $where);
        $montos=array();
        if($params['idcontrato']) {
            $montos = $conexionActual->fetchAll('
                    SELECT mc.valor as contrato, m.idmoneda, m.codigoiso 
                    FROM mod_crmcontratacion.dat_monedacontrato mc
                    LEFT JOIN mod_datosmaestros.nom_moneda m
                    ON mc.idmoneda=m.idmoneda 
                    WHERE  mc.idcontrato=' . $params['idcontrato']
            );
            foreach ($montos as $pos => $valor) {
                $cont = $conexionActual->fetchAll(
                    'SELECT SUM(fm.valor) as valor, fm.idmoneda
                    FROM mod_crmcontratacion.dat_facturamoneda fm
                    INNER JOIN mod_crmcontratacion.dat_facturasolicitudpago fs
                    ON fs.idfactura=fm.idfactura
                    INNER JOIN mod_crmcontratacion.dat_solicitudpago sp
                    ON sp.idsolicitudpago=fs.idsolicitudpago
                    WHERE 
                    sp.idcontrato=' . $params['idcontrato'] . ' AND 
                    fm.idmoneda=' . $valor['idmoneda'] .
                    ' GROUP BY fm.idmoneda'
                );
                $sumcont = 0;
                if (count($cont) > 0) {
                    $sumcont = $cont[0]['valor'];
                }
                $montos[$pos]['valor'] = $sumcont;
                $montos[$pos]['restante'] = $valor['contrato'] - $sumcont;
            }
        }
        $result=array('total'=>$cant[0]['count'], 'data'=>$datos, 'montos'=>$montos);

        return $result;
    }

    private function getFroms(){
        return " FROM mod_crmcontratacion.dat_solicitudpago sp
          LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON sp.idformapago=mp.idmediodepago
          LEFT JOIN mod_estructuracomp.dat_estructura des ON (sp.idarea = des.idestructura and des.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (sp.idarea = desop.idestructuraop and desop.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (sp.idarea = nfe.idfila) 
          LEFT JOIN mod_crmcontratacion.dat_solicitudpagoestado spe 
          ON (spe.idsolicitudpago=sp.idsolicitudpago AND spe.fechafin ISNULL) 
          LEFT JOIN mod_crmcontratacion.nom_estado e ON (spe.idestado = e.idestado)
          LEFT JOIN mod_crmcontratacion.dat_solicitudpagoobjetivo spo ON (sp.idsolicitudpago=spo.idsolicitudpago) ";
    }

    private function getFiltros($filtros){
        $where = array();
        $columns = Doctrine::getTable('DatContrato')->getColumnNames();
        if($filtros){
            foreach($filtros as $f){
                $value = $f['data']['value'];
                $type = $f['data']['type'];
                $comparison = $f['data']['comparison'];
                $field = in_array($f['field'], $columns) ? 'sp.' . $f['field'] : $f['field'];
                if($value && !is_null($value)){
                    if($f['field']=='codigo'){
                        $where[] = 'sp.codigo ILIKE \'%'.$value.'%\'';
                    }
                    else if($f['field']=='nombrearea') {
                        $where[] = '(desop.denominacion ILIKE \'%' . $value . '%\' OR
                        des.denominacion ILIKE \'%' . $value . '%\')';
                    }
                    else if($f['field']=='estado'){
                        $where[] = 'e.idestado IN ('.implode(',',json_decode($value)).')';
                    }
                    else if($f['field']=='mediopago') {
                        $where[] = 'mp.idmediodepago IN  ('.implode(',',json_decode($value)).')';
                    }
                    else if($f['field']=='fecharecibo'){
                        list($moth, $day, $year) = explode('/', $value);
                        $value = "$day/$moth/$year";
                        if ($f['data']['comparison'] == 'lt') {
                            $where[] = $f['field'] . " < '" . $value . "'";
                        }
                        if ($f['data']['comparison'] == 'gt') {
                            $where[] = $f['field'] . " > '" . $value . "'";
                        }
                        if ($f['data']['comparison'] == 'eq') {
                            $where[] = $f['field'] . " = '" . $value . "'";
                        }
                    }
                    else if($type == 'numeric'){
                        $where[] = self::getNumericFilter($field, $value, $comparison);
                    }
                }
            }
        }
        return $where;
    }

    private function getNumericFilter($field, $value, $comparison)
    {
        if ($value || $value == 0) {
            if ($comparison) {
                if ($comparison == 'lt') {
                    return $field . " < " . $value;
                }
                if ($comparison == 'gt') {
                    return $field . " > " . $value;
                }
                if ($comparison == 'eq') {
                    return $field . " = " . $value;
                }
                if ($comparison == 'null') {
                    return $field . $value;
                }
            } else {
                if (is_array($value)) {
                    return $field . " IN (" . implode(',', $value) . ")";
                } else {
                    return $field . " = " . $value;
                }
            }
        }
    }

}
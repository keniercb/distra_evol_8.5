<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatArribo extends BaseDatArribo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatArriboEstado', array('local' => 'idarribo', 'foreign' => 'idarribo'));
    }

    public function listarArribos($params){
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where=''; $where2='';$offset='';
        $result=array('data'=>[],'total'=>0);
        if ($params['filter']) {
            $parametros = self::getFiltros($params['filter']);
        }
        if ($params['idcontrato']) {
            $parametros[] = 'a.idcontrato=' . $params['idcontrato'];
            $where2='WHERE a.idcontrato='. $params['idcontrato'];
        }
        if (count($parametros) > 0) {
            $where = ' WHERE ' . implode(' AND ', $parametros);
        }
        if(!is_null($params['start']) && !is_null($params['limit'])){
            $offset=' OFFSET '. $params['start'].' LIMIT '.$params['limit'];
        }
        $query = "SELECT a.*, mp.nombre as mediopago, e.nombre as estado,
          e.icono, ae.idestado,ae.fechainicio as fechaestado,
          COALESCE (desop.denominacion, des.denominacion) as nombrearea, ap.pedidos,
          COALESCE((SELECT COUNT(p.idpenalidad) FROM mod_crmcontratacion.dat_penalizaciones p 
          WHERE p.idarribo=a.idarribo), 0) as cantpenalidades".
            self::getFroms(). $where." ORDER BY a.fecharecibo ".$offset;
//        print_r($query);die;
        $datos = $conexionActual->fetchAll($query);
        foreach($datos as $index=>$value){
            $montos=$conexionActual->fetchAll(
                "SELECT sum(fam.valor) as monto, m.codigoiso 
                  FROM mod_crmcontratacion.dat_facturaarribomoneda fam
                  LEFT JOIN mod_crmcontratacion.dat_facturaarribo fa 
                  ON fa.idfacturaarribo=fam.idfacturaarribo 
                  LEFT JOIN mod_datosmaestros.nom_moneda m 
                  ON m.idmoneda=fam.idmoneda 
                  WHERE fa.idarribo=".$value['idarribo']."
                  GROUP BY m.codigoiso"
            );
            $datos[$index]['montototal']=$montos;
        }
        $cant = $conexionActual->fetchAll(
            "SELECT count(a.idarribo) ".self::getFroms(). $where);
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
                    'SELECT SUM(fam.valor) as valor, fam.idmoneda
                    FROM mod_crmcontratacion.dat_facturaarribomoneda fam
                    INNER JOIN mod_crmcontratacion.dat_facturaarribo fa
                    ON fa.idfacturaarribo=fam.idfacturaarribo
                    INNER JOIN mod_crmcontratacion.dat_arribo a
                    ON a.idarribo=fa.idarribo
                    WHERE 
                    a.idcontrato=' . $params['idcontrato'] . ' AND 
                    fam.idmoneda=' . $valor['idmoneda'] .
                    ' GROUP BY fam.idmoneda'
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
//        print($result);die;
        return $result;
    }

    private function getFroms(){
        return " FROM mod_crmcontratacion.dat_arribo a
          LEFT JOIN mod_crmcontratacion.nom_mediodepago mp ON a.idformapago=mp.idmediodepago
          LEFT JOIN mod_estructuracomp.dat_estructura des ON (a.idarea = des.idestructura and des.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.dat_estructuraop desop ON (a.idarea = desop.idestructuraop and desop.idproyecto = 0)
          LEFT JOIN mod_estructuracomp.nom_filaestruc nfe ON (a.idarea = nfe.idfila) 
          LEFT JOIN mod_crmcontratacion.dat_arriboestado ae 
          ON (ae.idarribo=a.idarribo AND ae.fechafin ISNULL) 
          LEFT JOIN mod_crmcontratacion.nom_estado e ON (ae.idestado = e.idestado)
          LEFT JOIN mod_crmcontratacion.dat_arribopedido ap ON (a.idarribo=ap.idarribo)";
    }

    private function getFiltros($filtros){
        $where = array();
        $columns = Doctrine::getTable('DatContrato')->getColumnNames();
        if($filtros){
            foreach($filtros as $f){
                $value = $f['data']['value'];
                $type = $f['data']['type'];
                $comparison = $f['data']['comparison'];
                $field = in_array($f['field'], $columns) ? 'a.' . $f['field'] : $f['field'];
                if($value && !is_null($value)){
                    if($f['field']=='codigo'){
                        $where[] = 'a.codigo ILIKE \'%'.$value.'%\'';
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
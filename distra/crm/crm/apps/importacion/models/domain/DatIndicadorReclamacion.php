<?php

class DatIndicadorReclamacion extends BaseDatIndicadorReclamacion
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
		 $this->hasOne('DatIndicadorContrato', array('local' => 'idindicadorcontrato', 'foreign' => 'idindicadorcontrato'));
        $this->hasOne('DatReclamaciones', array('local' => 'idreclamacion', 'foreign' => 'idreclamacion'));
    }

    public function cargarindicadoresreclamacion($params){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $cond = [];
            $where = "";
            if($params['idreclamacion']){
                $cond[] = "dic.idreclamacion = ". $params['idreclamacion'];
            }
            if(count($cond)){
                $where = " where ".implode("AND",$cond);
            }
            $query = "SELECT ir.*, ir.idindicadorreclamacion as idindicadorcontrato,
                  COALESCE(ir.denominacion, i.denominacion) as denominacion,
                  COALESCE(num.denominacionunidadmedida, 'Unidad') as unidadmedida,
                  COALESCE (i.precio, 0) as precio, ip.preciodivisa, 0 as monto
                  FROM mod_crmcontratacion.dat_indicadorreclamacion ir 
                  LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ir.idindicador
                  LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
                  LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = i.idumedida".$where;
            $datosindicadores= $conexionActual->fetchAll($query);

            foreach ($datosindicadores as $indexindi => $indi) {
                $moneda = DatMonedaIndicadorReclamacion::cargarMonedasIndicador(
                    array('idindicador' => $indi['idindicadorreclamacion'])
                );
                if (count($moneda)) {
                    foreach ($moneda as $mon) {
//                            print_r($mon);
//                            print_r($mon['monto']);
                        if($mon['moneda']=='CUP' && $indi['precio']==''){
                            $datosindicadores[$indexindi]['precio']=$mon['monto'];
                        }
                        if($mon['moneda']=='CUC' && $indi['preciodivisa']==''){
                            $datosindicadores[$indexindi]['preciodivisa']=$mon['monto'];
                        }
                    }
                }
            }
            return $datosindicadores;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function eliminarIndicador($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatIndicadorReclamacion')
            ->whereIn('idindicadorreclamacion',$array)
            ->execute();
    }

    public function getIndicadoresDominio($params)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $query = $this->getMainQuery();
            $filters = $this->getFilters($params['filter']);
            if (count($filters)) {
                $where = " WHERE " . implode(" AND ", $filters);
                $query .= $where;
            }
            $query .= $this->getSortQuery($params['sort']);
            if (!is_null($params['start']) && !is_null($params['limit'])) {
                $query .= " offset " . $params['start'] . " limit " . $params['limit'];
            }
            return $conexion->fetchAll($query);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getMainQuery()
    {
        return "SELECT dic.*,ni.denominacion,num.denominacionunidadmedida as unidadmedida,0 as precio,0 as monto,
                  count(dic.idindicadorcontrato) over(),dc.numerocontrato
                  FROM mod_crmcontratacion.dat_indicadorcontrato dic
                  INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dic.idindicador
                  INNER JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                  INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dic.idcontrato
                  INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dc.idarea";
    }

    private function getSortQuery($sort)
    {
        if ($sort) {
            $sort = json_decode($sort);
            $query = " ORDER BY";
            $result = [];
            foreach ($sort as $field) {
                $result[] = " $field->property $field->direction";
            }
            return $query . implode(',', $result);
        }
        return "";
    }

    public function getFilters($params)
    {
        $isstring = array('string', 'character varying', 'varchar');
        $isnumeric = array('int', 'numeric');
        $alias = array("unidadmedida"=> "num.denominacionunidadmedida");
        $filter = array();
        foreach ($params as $param) {
            $field = $param['field'];
            $type = $param['data']['type'];
            $value = $param['data']['value'];
            $comparison = $param['data']['comparison'];

            if($alias[$field]){
                $field = $alias[$field];
            }

            if (in_array($type, $isnumeric)) {
                $result = $this->getNumericFilter($field, $value, $comparison);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if (in_array($type, $isstring)) {
                $result = $this->getStringFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'bit') {
                $result = $this->getBitFilter($field, $value);
                if ($result) {
                    $filter[] = $result;
                }
            }

            if ($type == 'date') {
                $result = $this->getDateFilter($field, $value, $comparison);
                if ($result) {
                    $filter[] = $result;
                }
            }
        }
        return $filter;
    }

    private function getNumericFilter($field, $value, $comparison)
    {
        if ($value) {
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
            } else {
                if (is_array($value)) {
                    return $field . " IN (" . implode(',', $value) . ")";
                } else {
                    return $field . " = " . $value;
                }
            }
        }
    }

    private function getStringFilter($field, $value)
    {
        if ($value) {
            return "$field ILIKE '%" . $value . "%'";
        }
    }

    private function getBitFilter($field, $value)
    {
        if ($value) {
            return $field . "[" . $value . "] = 1::bit";
        }
    }

    private function getDateFilter($field, $value, $comparison)
    {
        if ($value) {
            list($moth, $day, $year) = explode(
                '/', $value
            );
            $value = "$day/$moth/$year";
            if ($comparison == 'lt') {
                return $field . " < '" . $value . "'";
            }
            if ($comparison == 'gt') {
                return $field . " > '" . $value . "'";
            }
            if ($comparison == 'eq') {
                return $field . " = '" . $value . "'";
            }
        }
    }

}

<?php

class DatIndicadorFacturaArribo extends BaseDatIndicadorFacturaArribo
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatFacturaArribo', array('local' => 'idfacturaarribo', 'foreign' => 'idfacturaarribo'));
    }

    public function cargarindicadoresfacturaarribo($params){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $cond = [];
            $where = "";
            if($params['idfacturaarribo']){
                $cond[] = "ir.idfacturaarribo = ". $params['idfacturaarribo'];
            }
            if(count($cond)){
                $where = " where ".implode("AND",$cond);
            }
//            $query = "SELECT ir.*, ir.idindicadorfacturaarribo as idindicadorcontrato,
//                  COALESCE(ir.denominacion, i.denominacion) as denominacion,
//                  COALESCE(num.denominacionunidadmedida, 'Unidad') as unidadmedida,
//                  COALESCE (i.precio, 0) as precio, ip.preciodivisa, 0 as monto
//                  FROM mod_crmcontratacion.dat_indicadorfacturaarribo ir
//                  LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ir.idindicador
//                  LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip on i.idindicador = ip.idindicador
//                  LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = i.idumedida".$where;
            $query=$this->getMainQuery()['select'].$this->getMainQuery()['froms'].$where;
            $datosindicadores= $conexionActual->fetchAll($query);

            foreach ($datosindicadores as $indexindi => $indi) {
                $moneda = DatMonedaIndicadorFacturaArribo::cargarMonedasIndicador(
                    array('idindicador' => $indi['idindicadorfacturaarribo'])
                );
                if (count($moneda)) {
                    foreach ($moneda as $mon) {
                        if($mon['moneda']=='CUP' && $indi['precio']==''){
                            $datosindicadores[$indexindi]['precio']=$mon['monto'];
                        }
                        if($mon['moneda']=='CUC' && $indi['preciodivisa']==''){
                            $datosindicadores[$indexindi]['preciodivisa']=$mon['monto'];
                        }
                        $datosindicadores[$indexindi]['montomoneda_'.strtolower($mon['moneda']).'_'.$mon['idmoneda']]=$mon['monto'];
                    }
                }
            }
            return $datosindicadores;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function guardarIndicador($params){
        try {
            $instance = $params['idindicadorfacturaarribo'] ?
                Doctrine::getTable('DatIndicadorFacturaArribo')->find($params['idindicadorfacturaarribo'])
                : new DatIndicadorFacturaArribo();
            $instance->idindicador = $params['idindicador']?$params['idindicador']:null;
            $instance->idfacturaarribo = $params['idfacturaarribo']?$params['idfacturaarribo']:null;
            $instance->cantidad = $params['cantidad']?$params['cantidad']:null;
            $instance->tipo = 1;
            $instance->denominacion = $params['denominacion']?$params['denominacion']:null;
            $instance->codigo = $params['codigo']?$params['codigo']:null;
            $instance->save();
            $modelmonedas=new DatMonedaIndicadorFacturaArribo();
            $modelmonedas->guardarMonedaEntidadIndicador(
                $params, $instance->idindicadorfacturaarribo
            );
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function eliminarIndicador($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatIndicadorFacturaArribo')
            ->whereIn('idindicadorfacturaarribo',$array)
            ->execute();
    }

    public function getIndicadoresDominio($params)
    {
        try {
            $doctrine = Doctrine_Manager::getInstance();
            $conexion = $doctrine->getCurrentConnection();
            $query = $this->getMainQuery()['select'].$this->getMainQuery()['froms'];
            $filters = $this->getFilters($params);
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
        return array(
            'select'=> " SELECT ir.*, ir.idindicadorfacturaarribo as idindicadorcontrato,
                        COALESCE(ir.denominacion, i.denominacion) as denominacion,
                        COALESCE(num.denominacionunidadmedida, 'Unidad') as unidadmedida ",
            'froms'=>" FROM mod_crmcontratacion.dat_indicadorfacturaarribo ir 
                       LEFT JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = ir.idindicador
                       LEFT JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = i.idumedida ");
    }

    public function getExtraQuery()
    {
        return array(
            'select'=> "  ",
            'froms'=>" LEFT JOIN mod_crmcontratacion.dat_facturaarribo fa ON (fa.idfacturaarribo=ir.idfacturaarribo) 
                       LEFT JOIN mod_crmcontratacion.dat_arribo da ON (da.idarribo=fa.idarribo)
                       ");
//        LEFT JOIN mod_crmcontratacion.dat_contrato c ON (c.idcontrato=da.idcontrato)
    }

    public function getMainQuery2()
    {
        return "SELECT dic.*,ni.denominacion,num.denominacionunidadmedida as unidadmedida,0 as precio,0 as monto,
                  count(dic.idindicadorcontrato) over(),dc.numerocontrato
                  FROM mod_crmcontratacion.dat_indicadorfacturaarribo dic
                  INNER JOIN mod_datosmaestros.nom_indicador ni ON ni.idindicador = dic.idindicador
                  INNER JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                  INNER JOIN mod_crmcontratacion.dat_contrato dc ON dc.idcontrato = dic.idcontrato
                  INNER JOIN mod_estructuracomp.nom_filaestruc nfe ON nfe.idfila = dc.idarea";
    }

    public function getIndicadoresfacturaarriboByParams($params){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $cond = [];
            $where = "";
            $filters = $this->getFilters($params);
            if(count($filters)){
                $where = " WHERE ".implode("AND",$filters);
            }
            $query=$this->getMainQuery()['select'].$this->getMainQuery()['froms'].$this->getExtraQuery()['froms'].$where;
            $datosindicadores= $conexionActual->fetchAll($query);

            foreach ($datosindicadores as $indexindi => $indi) {
                $moneda = DatMonedaIndicadorFacturaArribo::cargarMonedasIndicador(
                    array('idindicador' => $indi['idindicadorfacturaarribo'])
                );
                if (count($moneda)) {
                    foreach ($moneda as $mon) {
                        if($mon['moneda']=='CUP' && $indi['precio']==''){
                            $datosindicadores[$indexindi]['precio']=$mon['monto'];
                        }
                        if($mon['moneda']=='CUC' && $indi['preciodivisa']==''){
                            $datosindicadores[$indexindi]['preciodivisa']=$mon['monto'];
                        }
                        $datosindicadores[$indexindi]['montomoneda_'.strtolower($mon['moneda']).'_'.$mon['idmoneda']]=$mon['monto'];
                    }
                }
            }
            return $datosindicadores;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
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
        $filters=$params['filter'];
        $filter = array();
        foreach ($filters as $param) {
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
        if($params['idcontrato']){
            $filter[] = " da.idcontrato=".$params['idcontrato'];
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

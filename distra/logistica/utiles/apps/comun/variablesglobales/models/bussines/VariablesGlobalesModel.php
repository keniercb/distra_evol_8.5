<?php


class VariablesGlobalesModel extends BaseModel
{
    const AMBIT_UI = 1, AMBIT_LN = 2, AMBIT_GLOBAL =3;
    const DT_NUM = 1,DT_TEXT = 2;
    /**
     * VariablesGlobalesModel constructor.
     */
    public function __construct()
    {
        parent::__construct(true);
    }

    /**
     * @param int $ambito
     * @return array
     */
    public function devolverVariables($parametros = array()){
        try {
            $whereArr = array();
            $where = '';
            if(isset($parametros['activo'])){
                $whereArr[] = "ng.activo = {$parametros['activo']}";
            }
            if(isset($parametros['ambito'])){
                $whereArr[] = "ng.ambito = {$parametros['ambito']}";
            }
            if(count($whereArr)){
                $where = 'where '.implode(' and ', $whereArr);
            }
            $sql = "select ng.nombre, ng.valor, ng.id, ng.activo, ng.ambito, count(ng.id) over() as total
                from mod_logistica.nom_variableglobal ng {$where}";
            return $this->doctrineHelper->executeQuery($sql)->fetchAll(PDO::FETCH_ASSOC);
        }catch (Exception $e){
            throw new ZendExt_Exception('LOG_LB_COMUN_003');
        }

    }

    /**
     * @param $nombreVar
     * @return mixed|null
     */
    public function obtenerValor($nombreVar){
        $query ="select ng.valor from mod_logistica.nom_variableglobal ng 
                    where ng.nombre = '{$nombreVar}' and ng.activo  = 1";
        $data = $this->doctrineHelper->executeQuery($query)->fetchAll(PDO::FETCH_ASSOC);
        return count($data) > 0 ? str_replace("'", "", $data[0]['valor']) : null;
    }

    /**
     * @param $arrayVars
     * @return array
     */
    public function nameAsKey($arrayVars){
        $arrResult = array();
        foreach ($arrayVars as $var){
            $arrResult[$var['nombre']] =  $var['valor'] ;
        }
        return $arrResult;
    }

    /**
     * @param $datos
     * @return bool
     */
    public function adicionar($datos){
        $datos['valor'] = str_replace("'", '"', $datos['valor']);
        $sqlInsert = "insert into mod_logistica.nom_variableglobal(nombre, valor, ambito) 
                            values ('{$datos['nombre']}','{$datos['valor']}',{$datos['ambito']})";
        $this->doctrineHelper->executeQuery($sqlInsert);
        return true;
    }

    /**
     * @param $id
     * @return bool
     */
    public function eliminar($id){
        //$delete = "delete from mod_logistica.nom_variableglobal where id = {$id} and activo = 0";
        $delete = "delete from mod_logistica.nom_variableglobal where id = {$id}";
        $this->doctrineHelper->executeQuery($delete);
        return true;
    }

    /**
     * @param $id
     * @param false $activo
     * @return bool
     */
    public function activar($id, $activo = false){
        $activo = $activo == true ? 1 : 0;
        $update = "update mod_logistica.nom_variableglobal set activo = {$activo} where id = {$id}";
        $this->doctrineHelper->executeQuery($update);
        return true;
    }

    public function modificar($params){
        $update = " update mod_logistica.nom_variableglobal set ";
        $arrSets = array();
        if($params['nombre']){
            array_push($arrSets, " nombre = '{$params['nombre']}'");
        }
        if($params['valor']){
            array_push($arrSets, " valor = '{$params['valor']}'");
        }
        $updateSet = implode(',', $arrSets);
        $updateWhere = " where id = {$params['id']} ";
        $this->doctrineHelper->executeQuery($update . $updateSet . $updateWhere);
        return true;
    }
}
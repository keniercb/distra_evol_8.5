<?php

/**
 * Created by JetBrains PhpStorm.
 * User: Kenier Cumba Bueno, Lester A. Gonzalez Gutierrez
 * Date: 31/07/13
 * Time: 14:20
 * To change this template use File | Settings | File Templates.
 */
class NomencladoresGeneralesModel extends ZendExt_Model
{

    public function NomencladoresGeneralesModel()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $filtro = '';
        $alias = $obj['alias'] ? $obj['alias'] : 'm';
        if ($obj['denominacion'])
            $arrFiltro [] = "lower( {$alias}.denominacion) iLike '%{$obj['denominacion']}%'";

        if ($obj['codigo'])
            $arrFiltro [] = " {$alias}.codigo iLike '%{$obj['codigo']}%'";

        $query = new Doctrine_Query ();
        $query->from("{$obj['modelo']} $alias");
        if ($obj['denominacion'] || $obj['codigo']) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }

        if (count($arrIdsInsertados) > 0) {
            $query->addWhereNotIn("{$alias}.{$obj['idnom']}", $arrIdsInsertados);
        }
        if ($obj['idnaturaleza']) {
            $query->addWhere("{$alias}.idnaturaleza = {$obj['idnaturaleza']}");
        }

        $clasEntidad = 'Dat'.substr($obj['modelo'], 3).'Entidad';
        if (class_exists($clasEntidad)) {
            $query->addSelect("{$alias}.*, e.idestructuracomun as usarentidad")->leftJoin("{$alias}.$clasEntidad e ON e.idestructuracomun = {$this->global->Estructura->idestructura} AND {$alias}.{$obj['idnom']} = e.{$obj['idnom']}");
        }

        if (!$obj['onlyData']) {
            $cant = $query->count();
        }

        $query->limit(($obj['limit']) ? $obj['limit'] : 30)->offset(($obj['start']) ? $obj['start'] : 0)->orderBy(
            "{$obj['idnom']} DESC"
        );

        if ($returnobj) {
            return array('cant' => $cant, 'query' => $query, 'alias' => $alias);
        }
        $res = $query->fetchArray();
        if ($obj['onlyData']) {
            return array($res);
        } else {

            return array('cantidad' => $cant, 'datos' => $res);
        }
    }

    public function existeCodigo($obj)
    {
        $filtro = '';
        if ($obj['codigo'])
            $arrFiltro [] = "codigo = '{$obj['codigo']}'";
        $query = new Doctrine_Query();
        if ($obj['codigo']) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }
        return $query->from($obj['modelo'])->count();
    }

    public function existedenominacion($obj)
    {
        $filtro = '';
        if ($obj['denominacion'])
            $arrFiltro [] = "denominacion = '{$obj['denominacion']}'";
        $query = new Doctrine_Query();
        if ($obj['denominacion']) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }

        return $query->from($obj['modelo'])->count();
    }

    public function InsertarNomenclador($array, $returnobj = false)
    {
        if ($array['codigo']) {
            $existeCod = $this->existeCodigo($array);
        }
        $existedenominacion = $this->existedenominacion($array);
        if (!$existeCod && !$existedenominacion) {
            $obj = new $array['modelo']();
            $obj->synchronizeWithArray($array);
            if (!$returnobj)
                $obj->save();
            $bandera = 1;
        } else if ($existedenominacion > 0 && ($existeCod > 0 && $array['codigo']))
            $bandera = -1;
        else if ($existedenominacion > 0)
            $bandera = -2;
        else
            $bandera = -3;
        return ($returnobj && $bandera == 1) ? $obj : $bandera;
    }

    public function ModificarNomenclador($array, $returnobj = false)
    {
        $bandera = false;
        $objMod = Doctrine::getTable($array['modelo'])->find($array[$array['idnom']]);
        if ($objMod->$array['idnom']) {
            if ((($array['codigo']) && $objMod->codigo != $array['codigo']) || $objMod->denominacion != $array['denominacion']) {
                if (($array['codigo']) && $objMod->codigo != $array['codigo']) {
                    $existecod = $this->existeCodigo($array);
                    if ($existecod != 0)
                        return -1;
                }
                if ($objMod->denominacion != $array['denominacion']) {
                    $existedenominacion = $this->existedenominacion($array);
                    if ($existedenominacion != 0)
                        return -2;
                }
            }
            $objMod->synchronizeWithArray($array);
            if (!$returnobj)
                $objMod->save();
            $bandera = 1;
        }
        return ($returnobj && $bandera == 1) ? $objMod : $bandera;
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $clasEntidad = 'Dat'.substr($array['modelo'], 3).'Entidad';
        if (class_exists($clasEntidad)) {
            $colecction = new Doctrine_Collection($clasEntidad);
            $arr = (!is_array($array['idnom'])) ? json_decode(stripslashes($array['idnom'])) : $array['idnom'];
            foreach ($arr as $key => $id) {
                $objModEst = Doctrine::getTable($clasEntidad)->findByDql(" idestructuracomun=? AND {$array['pkid']} = ? ",
                    array($this->global->Estructura->idestructura, $id));
                if ($array['habilitarentidad'] == 1) {
                    if (!$objModEst[0]->idestructuracomun) {
                        $objest = new $clasEntidad();
                        $objest->idestructuracomun = $this->global->Estructura->idestructura;
                        $objest->$array['pkid'] = $id;
                        $colecction[] = $objest;
                    }
                } else if ($array['habilitarentidad'] == 2) {
                    if ($objModEst[0]->idestructuracomun)
                        $objModEst->delete();
                }
            }
            $colecction->save();
        }
        return true;
    }

    public function EliminarNomenclador($array, $modificar)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $arr = (!is_array($array['idnom'])) ? json_decode(stripslashes($array['idnom'])) : $array['idnom'];
        foreach ($arr as $key => $id) {
            $obj = Doctrine::getTable($array['modelo'])->find($id);
            
            try {
                if ($obj->$array['pkid'])
                    $obj->delete();
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    unset($arr[$key]);
                    $modificar .= (!$modificar) ? $id : ','.$id;
                    if ($conn->getTransactionLevel() != 0)
                        $conn->rollBack();
                    $array['idnom'] = $arr;
                    self::EliminarNomenclador($array, $modificar);
                } else
                    echo $e->getMessage();
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        if ($modificar) {
            $query = new Doctrine_Query();
            $query->update($array['modelo'])->set('estado=?', 0)->where("{$array['pkid']} in ($modificar)")->execute();
            return true;
        }
        return true;
    }

    public function ActivarNomenclador($array)
    {
        $query = new Doctrine_Query();
        $query->update($array['modelo'])->set('estado=?', 1)->where("{$array['pkid']} in ({$array['idnom']})")->execute();
        return true;
    }

    public function cargarArbol($obj)
    {
        $filtro = array();
        $valores = array();
        $alias = $obj['alias'] ? $obj['alias'] : 'm';

        if ($obj['node'] && $obj['node'] != $obj['anode']) {
            $obj['anode'] = $obj['node'];
        }
        if ($obj['anode'] && $obj['anode'] != 0) {
            $filtro[] = "{$alias}.idpadre =:idpadre";
            $filtro[] = "{$alias}.{$obj['idnom']} <> :idpadre";
            $valores['idpadre'] = $obj['anode'];
        } else {
            $filtro[] = "{$alias}.{$obj['idnom']} = {$alias}.idpadre";
        }
        $strFiltro = implode(' AND ', $filtro);
        $queryObj = Doctrine_Query::create()->select(
                "'' as _emptyval, {$alias}.*, {$alias}.denominacion as text,"
                ." {$alias}.{$obj['idnom']} as id,(case when ({$alias}.{$obj['idnom']} = {$alias}.idpadre)"
                ." then null else {$alias}.idpadre end) as _parent,(case when ({$alias}.ordender - {$alias}.ordenizq = 1)"
                ." then true else false end) as _is_leaf, (case when ({$alias}.{$obj['idnom']} = {$alias}.idpadre) "
                ."then null else {$alias}.idpadre end) as _parent,(case when ({$alias}.ordender - {$alias}.ordenizq = 1)"
                ." then true else false end) as leaf"
            )->from("{$obj['modelo']} $alias");
        if ($obj['denominacion']) {
            $queryObj->addWhere("{$alias}.denominacion iLike '%{$obj['denominacion']}%'");
        } else {
            $queryObj->addWhere($strFiltro, $valores);
        }

        if ($obj['incluirvencidas'] != 2) {//1 es false, 2 true
            $fechacontable = date('d/m/Y');
            $queryObj->addWhere("{$alias}.fechainicio <= '{$fechacontable}' ");
            $queryObj->addWhere("{$alias}.fechafin >= '{$fechacontable}' or {$alias}.fechafin is null");
        }

        $datos = $queryObj->orderBy(
                "{$alias}.{$obj['idnom']}"
            )->offset(
                $obj['start'] ? $obj['start'] : 0
            )->limit($obj['limit'] ? $obj['limit'] : 30)->fetchArray();

        if ($obj['onlyData']) {
            return $datos;
        } else {

            return array('cantidad' => $queryObj->count(), 'datos' => $datos);
        }
    }

    public function cargarComboNomenclador($params)
    {
        $alias = $params['alias'] ? $params['alias'] : 'm';
        $query = new Doctrine_Query ();
        $query->from("{$params['modelo']} $alias");
        $clasEntidad = 'Dat'.substr($params['modelo'], 3).'Entidad';
        if (class_exists($clasEntidad)) {
            $query->addSelect("{$alias}.*, e.idestructuracomun as usarentidad")
                ->innerJoin("{$alias}.$clasEntidad e "
                    ."ON e.idestructuracomun = {$this->global->Estructura->idestructura} "
                    ."AND {$alias}.{$params['idnom']} = e.{$params['idnom']}");
        }
        $res = $query->fetchArray();
        $cant = $query->count();
        return array('cantidad' => $cant, 'datos' => $res);
    }

    private function cargarOrganos(){
        $count1=0;
        $sql = "SELECT  idorganosatisface,denominacion, estado
        FROM mod_datosmaestros.nom_organosatisface";
        $conn = Zend_Registry::get('conexion');
        $cant = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            foreach($datos as $i){
                if($i['estado']){
                    $datos[$count1]['estado']='Activo';
                    $count1++;
                }else{
                    $datos[$count1]['estado']='No Activo';
                    $count1++;
                }
            }
        return array('cantidad' => count($cant), 'datos' => $datos);
    }
    public function exportarOrgano()
    {
        $dirname = dirname($_SERVER['SCRIPT_FILENAME']) . "/tmp/";
        array_map('unlink', glob("$dirname/*.*"));
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $datos = $this->cargarOrganos()['datos'];
        $columns = array(
            array('header' => 'Identificador', 'dataIndex' => 'idorganosatisface'),
            array('header' => 'Denominacion', 'dataIndex' => 'denominacion'),
            array('header' => 'Estado', 'dataIndex' => 'estado')
        );
        $excel->writeData($datos, $columns);
        $excel->close();
        return '/configuracion/nomgenerales/' . $fichero;
    }

}

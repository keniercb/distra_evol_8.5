<?php

/**
 * Description of NomencladoresModel
 *
 * @author Lester Antonio Gonzalez Gutierrez
 */
class NomencladoresModel extends ZendExt_Model
{

    private $sConfGeneral;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $filtro = '';
        $arrFiltro = array();
        $valores = array();
        if ($obj['filtro']) {
            $arr = json_decode(stripslashes($obj['filtro']));
            foreach ($arr as $arrfiltros) {
                foreach ($arrfiltros as $key => $value) {
                    if ($key != 'signo' && $key != 'modelo') {
                        if ($arrfiltros->signo) {
                            $signo = explode(',', $arrfiltros->signo);
                            if (trim($signo[0]) == 'in' || trim($signo[0]) == 'not in'
                            ) {
                                if ($signo[1] == 'select') {
                                    $arrFiltro [] = " m.{$obj['idnom']} " . strtoupper(
                                            $signo[0]
                                        )
                                        . " ( SELECT x.{$obj['idnom']}
                                            FROM {$arrfiltros->modelo} x
                                            WHERE  {$key} = $value )";
                                } else {
                                    $arrFiltro [] = " m.{$obj['idnom']}
                                        {$signo[0]}( $value )";
                                }
                            } else {
                                if($obj['modelo'] == 'NomTipoprecio'){
                                    if ($key == 'tipo') {
                                        $signo = ($arrfiltros->signo) ? $arrfiltros->signo : " = ?";
                                        $arrFiltro [] = " ($key $signo or $key = 0 or $key is null) ";
                                        $valores [] = $value;
                                    } else {
                                        $signo = ($arrfiltros->signo) ? $arrfiltros->signo : " = ?";
                                        $arrFiltro [] = " $key $signo";
                                        $valores [] = $value;
                                    }
                                } else {
                                    $signo = ($arrfiltros->signo) ? $arrfiltros->signo : " = ?";
                                    $arrFiltro [] = " $key $signo";
                                    $valores [] = $value;
                                }
                            }
                        }
                    }
                }
            }
        }
        if ($obj['tipo']) {
            $arrFiltro [] = "(m.tipo = {$obj['tipo']} or m.tipo is null or m.tipo = 0)";
        }
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion ILIKE '%{$obj['denominacion']}%'";
        }
        if ($obj['codigo']) {
            $arrFiltro [] = "codigo LIKE '%{$obj['codigo']}%'";
        }
        if($obj['modelo'] == 'NomClasificacioncontablelog'){
            if ($obj['facturacion']) {
                $arrFiltro [] = "facturacion = 1";
            } else {
                $arrFiltro [] = "facturacion = 0";
            }
        }
        $query = new Doctrine_Query();
        $query->select('m.*')->from("{$obj['modelo']} m");
        if ($obj['join']) {
            $query->innerJoin($obj['join']);
        }
        if (!empty($arrFiltro)) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro, $valores);
        }
        $this->addFiltrosBasicos($query, $obj, $arrIdsInsertados);
        $cant = $query->count();
        if($obj['entidad'])
        {
            $query->orderBy("{$obj['idnom']} DESC");
        }else{
            $query->limit(($obj['limit']) ? $obj['limit'] : 30)
                ->offset(($obj['start']) ? $obj['start'] : 0)
                ->orderBy("{$obj['idnom']} DESC");
        }

        if ($returnobj) {
            return array('cant' => $cant, 'query' => $query, 'alias' => 'm');
        }
        $res = $query->fetchArray();

        return array('cantidad' => $cant, 'datos' => $res);
    }

    public function addFiltrosBasicos(Doctrine_Query $query, $obj, $arrIdsInsertados)
    {
        if (count($arrIdsInsertados) > 0) {
            $query->addWhereNotIn("{$obj['idnom']}", $arrIdsInsertados);
        }
        if ($obj['adicionados']) {
            $query->addWhere("{$obj['idnom']} not in ({$obj['adicionados']})");
        }
        if ($obj['eliminados']) {
            $query->addWhere("{$obj['idnom']} not in ({$obj['eliminados']})");
        }
        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';
        if (class_exists($clasEntidad)) {
            $query->addSelect(
                ",e.idestructuracomun as usarentidad {$obj['select']}"
            )->leftJoin(
                "m.$clasEntidad e ON m.{$obj['idnom']} = e.{$obj['idnom']} AND e.idestructuracomun =
                                                            {$this->global->Estructura->idestructura}"
            );
        } else {
            if ($obj['select']) {
                $query->addSelect("{$obj['select']}");
            }
        }

        if ($obj['usarentidad']) {
            $query->addWhere("e.idnomconceptoentidad is not null");
        }

        if ($obj['filtroOr']) {
            $query->orWhere("{$obj['idnom']} in ({$obj['filtroOr']})");
        }
    }

    public function buscarEntidad($obj, $devolvequery = false)
    {
        $filtro = '';
        $arrFiltro = array();
        $valores = array();
        $query = new Doctrine_Query();
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion ILIKE '%{$obj['denominacion']}%'";
        }
        if ($obj['codigo']) {
            $arrFiltro [] = "codigo LIKE '%{$obj['codigo']}%'";
        }
        if ($obj['tipo']) {
            $arrFiltro [] = "(m.tipo = {$obj['tipo']} or m.tipo is null or m.tipo = 0)";
        }
        if ($obj['modelo'] != 'DatTipoprecioEntidad')
          $query->addWhere("m.estado = '1'");

        if ($obj['modelo'] == 'NomClasificacioncontablelog') {
            if ($obj['facturacion']) {
                $arrFiltro [] = "m.facturacion = 1";
            } else {
                $arrFiltro [] = "m.facturacion = 0";
            }
        }

        if (!empty($arrFiltro)) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro, $valores);
        }
        
        $query->select('m.*')->from("{$obj['modelo']} m");
        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';
        $fechaHoy = date("d/m/Y");
        // !$obj['cargarSinEntidad']  Esto se hizo para que en la Orden de Trabajo cargaran todos los tipos de precio sin tener en cuenta  la entidad
        if (class_exists($clasEntidad) /*&&  !$obj['cargarSinEntidad']*/) {
            if(array_key_exists('bussines',$obj)){
                $query->addSelect(",e.idestructuracomun as usarentidad")->innerjoin(
                    "m.$clasEntidad e ON m.{$obj['idnom']} = e.{$obj['idnom']} "/*AND e.idestructuracomun = {$this->global->Estructura->idestructura}"*/
                );
            }
            if(array_key_exists('cargarSinEntidad',$obj)){
                $query->addSelect(",e.idestructuracomun as usarentidad")->innerjoin(
                    "m.$clasEntidad e ON m.{$obj['idnom']} = e.{$obj['idnom']} AND e.idestructuracomun = {$this->global->Estructura->idestructura}"
                );
            }
            if ($obj['iddependence']) {
                $query->addWhere(
                    "e.{$obj['iddependence']} = ?", array($obj['value'])
                );
            }
            if($obj['tipo']){
                $query->addWhere(
                    "m.tipo = ? or m.tipo is null or m.tipo = 0", array($obj['tipo']));
            }

            $query->addWhere(
                'm.fechainicio <= ? OR m.fechafin IS NULL', array($fechaHoy)
            );
        }
        $cant = $query->count();
        if ($devolvequery) {
            return array('cant' => $cant, 'query' => $query, 'alias' => 'm');
        } else {
            $query->limit(($obj['limit']) ? $obj['limit'] : 1000)
                ->offset(($obj['start']) ? $obj['start'] : 0)
                ->orderBy("{$obj['idnom']} DESC");
            $res = $query->fetchArray();
            if($obj['ninguna']) {
                $res[] = array($obj['idnom']=>"null", 'denominacion' => 'Sin Naturaleza'); 
                $cant += 1; 
                
            }
            return array('cantidad' => $cant, 'datos' => $res);
        }
    }

    public function existeCodigo($obj)
    {
        $filtro = '';
        if ($obj['codigo']) {
            $arrFiltro [] = "codigo = '{$obj['codigo']}'";
        }
        $query = new Doctrine_Query();
        if ($obj['codigo']) {
            $filtro = implode(' AND ', $arrFiltro);
            if ($obj['modelo'] == 'NomClasificacioncontablelog')
                $filtro .= (($obj['facturacion']) ? ' AND facturacion = 1' : ' AND facturacion = 0');
            $query->addWhere($filtro);
        }
        return $query->from($obj['modelo'])->count();
    }

    public function existedenominacion($obj)
    {
        $filtro = '';
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion = '{$obj['denominacion']}'";
        }
        $query = new Doctrine_Query();
        if ($obj['denominacion']) {
            $filtro = implode(' AND ', $arrFiltro);
            if($obj['modelo'] == 'NomClasificacioncontablelog')
                $filtro .= (($obj['facturacion']) ? ' AND facturacion = 1' : ' AND facturacion = 0');
            $query->addWhere($filtro);
        }
        return $query->from($obj['modelo'])->count();
    }

    public function cuentaenuso($obj)
    {
        $query = "SELECT dp.idclasificacioncontable, dm.idclasificacion
                    FROM mod_logistica.dat_producto dp
                    LEFT JOIN mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto and dm.idclasificacion = {$obj['idclasificacioncontable']}
                    WHERE dp.idclasificacioncontable = {$obj['idclasificacioncontable']}
                    LIMIT 1";
         $subquery = "SELECT cc.denominacion 
         FROM mod_logistica.nom_clasificacioncontable cc
         WHERE cc.idcuenta <> null and cc.idclasificacioncontable = {$obj['idclasificacioncontable']}";

        $conn = Zend_Registry::get('conexion');
        $resp = $conn->fetchAll($query);
        $subresp = $conn->fetchAll($subquery);
        if(count($resp)>0 && count($subresp) == 0){
            return true;
        }else if(count($subresp)>0 && count($resp) == 0){
            return true;
        }else{
            return false;
        }
            
        
    }

    public function insertarNomenclador($array, $returnobj = false)
    {

        LogisticaObjectHelper::__init()->unsetNullValues($array);
        $existeCod = 0;
        $array['estado'] = 1;
        if (array_key_exists('codigo', $array)) {
            $existeCod = $this->existeCodigo($array);
        }
        $existedenominacion = $this->existedenominacion($array);
        if ($array['fechainicio'] == '') {
            $array['fechainicio'] = date("d/m/Y");
        }
        if ($existeCod == 0 && $existedenominacion == 0) {

            $obj = new $array['modelo']();
            $obj->synchronizeWithArray($array);
            
            if (!$returnobj) {
                try{
                    $obj->save();
                }catch (Exception $e){
                    throw $e;
                }
            }
            $bandera = 1;
        } else {
            if ($existedenominacion > 0 && ($existeCod > 0 && $array['codigo']))
            {
                $bandera = -1;
            } else {
                if ($existedenominacion > 0) {
                    $bandera = -2;
                } else {
                    $bandera = -3;
                }
            }
        }

        $resultado = ($returnobj && $bandera == 1) ? $obj : $bandera;

        return $resultado;
    }

    public function modificarNomenclador($array, $returnobj = false)
    {
        LogisticaObjectHelper::__init()->unsetNullValues($array);
        $bandera = false;
        $objMod = Doctrine::getTable($array['modelo'])->find(
            $array[$array['idnom']]
        );
        if ($objMod->$array['idnom']) {
            if ((($array['codigo']) && $objMod->codigo != $array['codigo']) ||
                $objMod->denominacion != $array['denominacion']
            ) {
                if (($array['codigo']) && $objMod->codigo != $array['codigo']) {
                    $existecod = $this->existeCodigo($array);
                    if ($existecod != 0) {
                        return -1;
                    }
                }
                if ($objMod->denominacion != $array['denominacion']) {
                    $existedenominacion = $this->existedenominacion($array);
                    if ($existedenominacion != 0) {
                        return -2;
                    }
                }
            }

            if ((($array['idcuenta']) && $objMod->idcuenta != $array['idcuenta'])
            ) {
                $cuentaenuso = $this->cuentaenuso($array);
                    if ($cuentaenuso) {
                        return -3;
                    }
            }


            $objMod->synchronizeWithArray($array);
            if (!$returnobj) {
                $objMod->save();
            }
            $bandera = 1;
        }
        return ($returnobj && $bandera == 1) ? $objMod : $bandera;
    }

    public function habilitarDesabiltarEntidad($array)
    {
        $clasEntidad = 'Dat' . substr($array['modelo'], 3) . 'Entidad';

        if (class_exists($clasEntidad)) {
            $colecction = new Doctrine_Collection($clasEntidad);
            $arr = (!is_array($array['idnom'])) ? json_decode(
                    stripslashes($array['idnom'])
                ) : $array['idnom'];
            foreach ($arr as $id) {
                $objModEst = Doctrine::getTable($clasEntidad)->findByDql(
                    " idestructuracomun=? AND {$array['pkid']} = ? ",
                    array($this->global->Estructura->idestructura, $id)
                );
                if ($array['habilitarentidad'] == 1) {
                    if (!$objModEst[0]->idestructuracomun) {
                        $objest = new $clasEntidad();
                        $objest->idestructuracomun = $this->global->Estructura->idestructura;
                        $objest->$array['pkid'] = $id;
                        $colecction[] = $objest;
                    }
                } else {
                    if ($array['habilitarentidad'] == 2) {
                        if ($objModEst[0]->idestructuracomun) {
                            try {
                                $objModEst->delete();
                            } catch (Exception $ex) {
                                return false;
                            }
                        }
                    }
                }
            }
            $colecction->save();
        }
        return true;
    }

    public function eliminarNomenclador($array, $modificar)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $arr = (!is_array($array['idnom'])) ? json_decode(
                stripslashes($array['idnom'])
            ) : $array['idnom'];
        foreach ($arr as $key => $id) {
            $obj = Doctrine::getTable($array['modelo'])->find($id);
            try {
                if ($obj->$array['pkid']) {
                    $obj->delete();
                }
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    unset($arr[$key]);
                    $modificar .= (!$modificar) ? $id : ',' . $id;
                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }
                    $array['idnom'] = $arr;
                    self::EliminarNomenclador($array, $modificar);
                } else {
                    echo $e->getMessage();
                }
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        if ($modificar) {
            $query = new Doctrine_Query();
            $query->update($array['modelo'])->set('estado=?', 0)->where(
                "{$array['pkid']} in ($modificar)"
            )->execute();
        }
        return true;
    }

    public function activarNomenclador($array)
    {

        $query = new Doctrine_Query();
        $query->update($array['modelo'])->set('estado=?', 1)->where(
            "{$array['pkid']} in ({$array['idnom']})"
        )->execute();
        return true;
    }

    public function setCategoriaDefecto($idcategoria)
    {
        $queryBorrarPorDefecto = new Doctrine_Query();
        $queryBorrarPorDefecto->update('NomCategoriasproducto')->set('pordefecto=?', 0)->where(
            'pordefecto in ?', 1
        )->execute();

        $queryPorDefecto = new Doctrine_Query();
        $queryPorDefecto->update('NomCategoriasproducto')->set('pordefecto=?', 1)->where(
            'idcategoria in ?', $idcategoria
        )->execute();

        return true;
    }

    public function setTipoprecioDefecto($idtipoprecio)
    {
        $queryBorrarPorDefecto = new Doctrine_Query();
        $queryBorrarPorDefecto->update('NomTipoprecio')->set('pordefecto=?', 0)->where(
            'pordefecto in ?', 1
        )->execute();

        $queryPorDefecto = new Doctrine_Query();
        $queryPorDefecto->update('NomTipoprecio')->set('pordefecto=?', 1)->where(
            'idtipoprecio in ?', $idtipoprecio
        )->execute();
        
        $desgClTipoprecio = new DatClientedesgloceprecio();
        $parametros['result'] = $desgClTipoprecio->getResultByIdTipoprecio(
            array('idtipopreciocl'=>$idtipoprecio, 'idestructuracomun'=>$this->global->Estructura->idestructura)
        );
        $parametros['result'] = (count($parametros['result']) > 0) ? $parametros['result'] : array(-1);
        $filtro = array('idclientesproveedores' => array('notin'=>1, 'ids'=> $parametros['result']));
        $clientes = $this->sConfGeneral->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, true, false, $filtro, 0
        );

        $collection = new Doctrine_Collection('DatClientedesgloceprecio');
        foreach ($clientes['datos'] as $value) {
            $desglose = new DatClientedesgloceprecio();
            $tipoprecioentidad = $desglose->getIdTipoPrecEntByParams($idtipoprecio);
            $tipo = $tipoprecioentidad[0]['idtipoprecioentidad'];
            $desglose->idtipoprecioentidad = $tipo;
            $desglose->idcliente = $value['idclientesproveedores'];
            $collection->add($desglose);
        }
        $collection->save();

        return true;
    }

    public function setCondicionDefecto($idcondicion)
    {
        $query = new Doctrine_Query();
        $queryCondicion = new Doctrine_Query();
        $queryCondicion->update('NomCondicionpago')->set('pordefecto=?', 0)->where("pordefecto = 1")->execute();
        $query->update('NomCondicionpago')->set('pordefecto=?', 1)->where("idcondicionpago = ?", array($idcondicion))
            ->execute();
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


}

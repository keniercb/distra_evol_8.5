<?php

class NomPos extends BaseNomPos
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatPosEntidad', array('local' => 'idpos', 'foreign' => 'idpos'));
        $this->hasMany('NomTipocaja', array('local' => 'idtipocaja', 'foreign' => 'idtipocaja'));
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $query = new Doctrine_Query();
        $query->select('np.*, ntc.denominacion as caja, ntc.idtipocaja as idtipocaja, dpe.idestructuracomun as usarentidad')
            ->from('NomPos np')
            ->leftJoin('np.DatPosEntidad dpe')
            ->leftJoin('np.NomTipocaja ntc')
            ->where("np.estado=1");

        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion ILIKE '%{$obj['denominacion']}%'";
        }
        if ($obj['codigo']) {
            $arrFiltro [] = "codigo LIKE '%{$obj['codigo']}%'";
        }

        if (!empty($arrFiltro)) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }
        $this->addFiltrosBasicos($query, $obj, $arrIdsInsertados);
        $cant = $query->count();
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
                    return $e;
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

            $objMod->synchronizeWithArray($array);
            if (!$returnobj) {
                $objMod->save();
            }
            $bandera = 1;
        }
        return ($returnobj && $bandera == 1) ? $objMod : $bandera;
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

     public function habilitarDesabiltarEntidad($array, $idestructuracomun)
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
                     array($idestructuracomun, $id)
                 );
                 if ($array['habilitarentidad'] == 1) {
                     if (!$objModEst[0]->idestructuracomun) {
                         $objest = new $clasEntidad();
                         $objest->idestructuracomun = $idestructuracomun;
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

     public function activarNomenclador($array)
     {
         $query = new Doctrine_Query();
         $query->update($array['modelo'])->set('estado=?', 1)->where(
             "{$array['pkid']} in ({$array['idnom']})"
         )->execute();
         return true;
     }
}
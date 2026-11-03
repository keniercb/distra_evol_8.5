<?php

class DatTerminopago extends BaseDatTerminopago
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatMora',
            array('local' => 'idterminodepago', 'foreign' => 'idterminodepago')
        );
        $this->hasMany(
            'DatDpp',
            array('local' => 'idterminodepago', 'foreign' => 'idterminodepago')
        );
        $this->hasMany(
            'DatDescuentosVenta',
            array('local' => 'idterminodepago', 'foreign' => 'idterminodepago')
        );
        $this->hasMany(
            'DatCuotas',
            array('local' => 'idterminodepago', 'foreign' => 'idterminodepago')
        );
    }

    static public function registrarTerminoPago(
        $idestructura, $tiempo, $plazo, $descuentos, $dpp, $mora, $denominacion, $id, $predeterminado
    ) {
        try {
            $obj = ($id == '-1') ? new DatTerminopago() : Doctrine::getTable('DatTerminopago')->find($id);
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $obj->idestructura = $idestructura;
            $obj->idumplazo = $tiempo;
            $obj->aplazos = ($plazo) ? 0 : 1;
            $obj->plazo = $plazo;
            $obj->mora = (count($mora) > 0) ? 1 : 0;
            $obj->descventa = (count($descuentos) > 0) ? 1 : 0;
            $obj->dpp = (count($dpp) > 0) ? 1 : 0;
            $obj->nombre = $denominacion;
            $obj->predeterminado = ($predeterminado != '-1') ? $predeterminado : 0;

            $obj->save();
            $va->commit();
            $va->beginTransaction();
            return $obj->idterminodepago;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function delTerminoPago($idterminodepago)
    {
        try {
            $obj = Doctrine::getTable('DatTerminopago')->find($idterminodepago);

            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $obj->delete();

            $va->commit();
            $va->beginTransaction();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function GetCondiciones($post, $idestructura)
    {
        try {
            $cond = " ";
            $wheres=array();
            if ($post['denominacion']) {
                $denominacion = $post['denominacion'];
                $wheres[]=" t.nombre ilike '%$denominacion%' ";
//                $cond .= " WHERE t.nombre ilike '%$denominacion%'";
            }
            if ($post['enuso']) {
                $enuso = $post['enuso']==1?' NOT NULL ':' NULL ';
                $wheres[]=" te.idterminodepagoentidad IS ".$enuso." AND te.idestructuracomun =".$idestructura;
//                $cond .= " WHERE enuso= '%$enuso%'";
            }
            if(count($wheres)>0){
                $cond=' WHERE '.implode('AND', $wheres);
            }
            $offset='';
            if ($post['start'] != null && $post['limit'] != null) {
                $offset=" LIMIT ".$post['limit']." OFFSET ".$post['start']." ";
            }
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$conexionActual->fetchAll("
                SELECT count(t.idterminodepago) over(), t.*,
                (CASE WHEN te.idestructuracomun=$idestructura THEN TRUE ELSE FALSE END) as enuso
                FROM mod_datosmaestros.nom_terminosdepago t
                LEFT JOIN mod_datosmaestros.dat_mora dm ON (dm.idterminodepago=t.idterminodepago)
                LEFT JOIN mod_datosmaestros.dat_dpp dpp ON (dpp.idterminodepago=t.idterminodepago)
                LEFT JOIN mod_datosmaestros.dat_descuentosventa dv ON (dv.idterminodepago=t.idterminodepago)
                LEFT JOIN mod_datosmaestros.dat_cuotasterminosdepago dc ON (dc.idterminodepago=t.idterminodepago)
                LEFT JOIN mod_datosmaestros.dat_terminodepagoentidad te ON (te.idterminodepago=t.idterminodepago AND te.idestructuracomun=$idestructura)
                $cond
                ORDER BY enuso DESC, t.predeterminado DESC $offset
            ");
            $total=count($result)?$result[0]['count']:0;

//            $query = Doctrine_Query::create();
//            $query->from('DatTerminopago t')
//                ->leftJoin('t.DatMora dm')
//                ->leftJoin('t.DatDpp dpp')
//                ->leftJoin('t.DatDescuentosVenta dv')
//                ->leftJoin('t.DatCuotas dc')
////                ->leftJoin('t.DatTerminopagoEntidad te')
//                ->where($cond)
//                ->orderBy('t.predeterminado DESC');
//
//            if ($post['start'] != null && $post['limit'] != null) {
//                $query->offset($post['start'])
//                    ->limit($post['limit']);
//            }
//            $result = $query->execute()->toArray();

//            return array('total' => count($query), 'data' => $result);
            return array('total' => $total, 'data' => $result);
        } catch (Doctrine_Exception $e) {
            throw $e;
//            return $e;
        }
    }

    public function GetCondicionesCombo($idestructura)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatTerminopago t')
                ->where("t.idestructura = '$idestructura' AND t.aplazos = 0")
                ->execute()->toArray();

            return array('total' => count($result), 'data' => $result);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetTerminoPagoPorId($id)
    {
        $q = new Doctrine_Query();
        $result = $q->select("t.*")
            ->from('DatTerminopago t')
            ->leftJoin('t.DatMora dm')
            ->leftJoin('t.DatDpp dpp')
            ->leftJoin('t.DatDescuentosVenta dv')
            ->leftJoin('t.DatCuotas dc')
            ->where("t.idterminodepago = '$id'")
            ->execute()->toArray();

        return $result;
    }

    static public function GetActiva($idEstructura)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatTerminopago t')
                ->where("t.idestructura = '$idEstructura' AND t.predeterminado = 1")
                ->execute();//->toArray();
            return $result[0];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetLLave()
    {
        $query = new Doctrine_Query();
        $result = $query->select('MAX(idcondicionpago)')->from(
            'DatCondicionpago'
        )->execute();
        $arr = $result->toArray();
        return (is_array($arr) ? $arr[0]['MAX'] + 1 : 1);
    }

    public function InsertarCondicionPago($pDPP, $pMora, $pPlazo, $pActivo, $pCambio, $pIdEstructura)
    {
        $obj = new DatCondicionpago();
        $a = Doctrine_Manager::getInstance();
        $va = $a->getCurrentConnection();
        $obj->dpp = $pDPP;
        $obj->mora = $pMora;
        $obj->plazo = $pPlazo;
        $obj->activo = $pActivo;
        $obj->cambio = $pCambio;
        $obj->idestructuracomun = $pIdEstructura;
        //$obj->idestructuracomun=0;
        $obj->save();
        $va->commit();
        $va->beginTransaction();
        $idcondicionpago = $obj->idcondicionpago;
        return $idcondicionpago;
    }

    //Mio
    public function ModificarActivoCondicionPago($pIdCondPago)
    {
        $obj = Doctrine::getTable('DatCondicionpago')->find($pIdCondPago);
        $obj->activo = 0;
        $obj->save();
    }

    //Mio
    public function ObtenerCondicionPagoDadoId($pIdCondicionPago)
    {
        $query = new Doctrine_Query();

        $query->from('DatCondicionpago c')
            ->where('c.idcondicionpago = ?', $pIdCondicionPago);

        return $query->execute()->toArray(true);
    }

    public function Buscar($idcondicionpago)
    {
        $temp = $this->conn->getTable('DatCondicionpago')->find(
            $idcondicionpago
        );
        return $temp->toArray();
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicionpago')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatCondicionpago')->limit($limite)->offset(
            $inicio
        )->execute();
        return $result->toArray();
    }

    //Cargar condicion de pago por default
    public function cargarcondicionpago($idcondi)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('c.dpp,c.mora,c.plazo')->from(
            'DatCondicionpago c'
        )->where("c.idcondicionpago =?", $idcondi)->execute();
        return $datos;
    }

    public function buscaidcondicionpago($plazo, $dpp, $mora)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('c.idcondicionpago')->from('DatCondicionpago c')
            ->where(
                "c.plazo =? AND c.dpp AND c.mora", array($plazo, $dpp, $mora)
            )->execute();
        return $datos;
    }

    public function genID()
    {
        $query = new Doctrine_Query();
        $result = $query->select('max(d.idcondicionpago) as maximo')
            ->from('DatCondicionpago d')
            ->execute()
            ->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;
        return $proximo;
    }

    public function is_empty()
    {
        $query = Doctrine_Query::create();
        $array = $query->select('cp.*')
            ->from('DatCondicionpago cp')
            ->execute();
        return $array->count();
    }

    public function ObtenerCondicionPago($idcondicion)
    {
        $q = new Doctrine_Query();
        $result = $q->select("dt.*")
            ->from('DatCondicionpago dt')
            ->where("dt.idcondicionpago = '$idcondicion'")
            ->execute()->toArray();
        return $result;
    }

    public function damecondiciones()
    {
        $query = Doctrine_Query:: create();

        $result = $query->select('min(d.idcondicionpago) as minimo')
            ->from('DatCondicionpago d')
            ->execute()
            ->toArray();

        $menor = $result[0]['minimo'];

        if ($menor) {
            $arr = $query->select("dt.*")
                ->from('DatCondicionpago dt')
                ->where("dt.idcondicionpago = '$menor'")
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        } else {
            $arr = array();
        }

        return $arr;
    }

    public function ObtenerCondicionesPago()
    {
        $query = Doctrine_Query:: create();
        $result = $query->select('d.*')
            ->from('DatCondicionpago d')
            ->execute()
            ->toArray();
        return $result;
    }

    public function adicionarCondPago($dpp, $mora, $plazo, $activo)
    {
        $objCondPago = new DatCondicionpago();

        $objCondPago->dpp = $dpp;
        $objCondPago->mora = $mora;
        $objCondPago->plazo = $plazo;
        $objCondPago->activo = $activo;
    }

    /* Implementaciones nuevas (@autor: Ing.Rodain Terrer Molina) */

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatCondicionpago')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idcondicionpago)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatCondicionpago')
                ->where("idcondicionpago = ?", array($idcondicionpago))
                ->execute();
            return $result[0];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition($condition, $params, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('DatCondicionpago')
                ->where("$condition", $params)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idcondicionpago, $idestructuracomun)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('DatCondicionpago')
                ->where(
                    "idcondicionpago = ? AND idestructuracomun = ?",
                    array($idcondicionpago, $idestructuracomun)
                )
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->delete('DatCondicionpago')
                ->where("$conditions", $params)
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function UpdateByCondition($field, $value, $condition, $paramCondition)
    {
        try {
            $query = Doctrine_Query::create();
            $rowsAfected = $query->update('DatCondicionpago')
                ->set("$field", '?', $value)
                ->where("$condition", $paramCondition)
                ->execute();
            return $rowsAfected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /* esta funcion en realidad deberia ser sustituida paor un servicio de derecho y obligacion */

    static public function inUse($idcondicionpago)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $resultado = ZendExt_ClassStandard::ArrayObject(
                $conexionActual->fetchAll(
                    "SELECT idderechouobligacion FROM mod_cobroypago.dat_derechouobligacion dat
                        WHERE dat.idcondicionpago = $idcondicionpago"
                )
            );
            return count($resultado) > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByConditionSQLVersion($conditions)
    {
        try {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $resultado = $conexionActual->fetchAll(
                "SELECT n.*,(CASE WHEN n.idcondicionpago
                IN (SELECT d.idcondicionpago FROM mod_cobroypago.dat_derechouobligacion d)
                THEN 1 ELSE 0 END) as usado
                FROM mod_cobroypago.dat_condicionpago n
                WHERE $conditions ORDER BY n.denominacion"
            );
            return $resultado;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }


}



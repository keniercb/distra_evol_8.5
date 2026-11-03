<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomModelosContabilizacion extends BaseNomModelosContabilizacion
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        $this->hasMany(
            'DatAsientosContables',
            array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
            'DatOperacionesentidad',
            array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        parent::setUp();
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();

            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this->idmodelo;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomModelosContabilizacion')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByPage($offset, $limit, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomModelosContabilizacion')
                ->offset($offset)
                ->limit($limit)
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idmodelo, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('NomModelosContabilizacion')->find(
                $idmodelo
            );
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition(
        $condition, $params, $toArray = false, $start = null, $limit = null
    ) {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomModelosContabilizacion mc')
                ->leftJoin('mc.DatAsientosContables ac')
                ->leftJoin('ac.NomCamposContables ncc on ac.tipocuenta = 1 and ac.cuenta = ncc.idcampo')
                ->leftJoin('ncc.NomClasificadores ncf on ncc.idclasificador = ncf.idclasificador')
                ->leftJoin('ac.NomValoresContables nvc on ac.idvalorcontable = nvc.idvalorcontable')
                ->leftJoin('ac.DatSustituciones s')
                ->leftJoin('s.NomValoresContables nvc1 on valor notnull and s.valor = nvc1.idvalorcontable')
                ->where("$condition", $params)
                ->orderby("mc.idsubsistema,mc.codigo");
            if (!is_null($start) && !is_null($limit)) {
                $query->offset($start)
                    ->limit($limit);
            }
            $result = $query->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e->getMessage();
        }
    }

    static public function CountByCondition($condition, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('count(idmodelo) as cantidad')->from(
                'NomModelosContabilizacion'
            )
                ->where("$condition", $params)
                ->execute()
                ->toArray();
            return $result[0]['cantidad'];
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idmodelo)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomModelosContabilizacion')
                ->where("idmodelo=?", array($idmodelo))
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomModelosContabilizacion')
                ->where("$conditions", $params)
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetCuentaByIdModelo(
        $idmodelo, $tipo, $toArray = false
    ) {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('nm.idmodelo,da.cuenta')
                ->from('NomModelosContabilizacion nm')
                ->innerJoin('nm.DatAsientosContables da')
                ->where(
                    "da.idmodelo=? AND da.tipocuenta=?", array($idmodelo, $tipo)
                )
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetValorByIdModelo($idmodelo, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->select('nm.idmodelo,da.idvalorcontable')
                ->from('NomModelosContabilizacion nm')
                ->innerJoin('nm.DatAsientosContables da')
                ->where("da.idmodelo=?", array($idmodelo))
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetOperacionByIdModelo($idmodelo, $toArray = false)
    {
        try {
            $result = Doctrine::getTable('DatOperacionesentidad')->findBy(
                'idmodelo', $idmodelo
            );
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetConcepto(
        $esquema, $concepto, $idConcepto, $identificador
    ) {
        try {
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $result = $conn->fetchAll(
                "SELECT * FROM $esquema.$concepto WHERE $idConcepto=$identificador"
            );
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function getModelosBySubsystems($idssub, $idestruc)
    {
        $query = Doctrine_Query::create()
            ->select('mc.*, ac.*, s.*')
            ->from('NomModelosContabilizacion mc')
            ->leftJoin('mc.DatAsientosContables ac')
            ->leftJoin('ac.DatSustituciones s')
            ->where('mc.idestructuracomun = ?', $idestruc)
            ->whereIn('mc.idsubsistema', $idssub);
        return $query->fetchArray();
    }
}

<?php

class DatCuentabancaria extends BaseDatCuentabancaria
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne(
            'NomTipocuentabancaria', array('local' => 'idtipocuentabancaria', 'foreign' => 'idtipocuentabancaria')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocuentabancaria
     *
     * @return Doctrine_Record
     */
    public function getById($idcuentabancaria)
    {
        $cuentas = self::reflectArray($idcuentabancaria);
        if (count($cuentas) > 0) {
            $query = Doctrine_Query::create()->from('DatCuentabancaria')->whereIn('idcuentabancaria', $cuentas);

            return $query->execute();
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getCuentaBancariaByPersona(array $idpersona, $limit, $start, $all = true)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "dcb.*, ntcb.denominacion as denomtipocuentabancaria, ntcb.idtipocuentabancaria as idtipocuentabancaria,
                (CASE
                WHEN dcb.fdesde <= now() and (now() <= dcb.fhasta or dcb.fhasta is null)
                THEN 1
                ELSE 0
                END) AS historico"
            )->from('DatCuentabancaria dcb')->leftJoin('dcb.NomTipocuentabancaria ntcb');
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            switch ($all) {
                case 'activo':
                    $query->where('dcb.fdesde <= now() and (now() <= dcb.fhasta or dcb.fhasta is null)');
                    break;
                case 'hist':
                    $query->where('now() > dcb.fhasta');
                    break;
                default:
                    break;
            }

            return (count($idpersona)) > 0 ? $query->andWhereIn('dcb.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantCuentaBancariaByPersona(array $idpersona, $all = true)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCuentabancaria dcb')
                ->leftJoin('dcb.NomTipocuentabancaria ntcb');
            switch ($all) {
                case 'activo':
                    $query->andWhere('dcb.fdesde <= now() and (now() <= dcb.fhasta or dcb.fhasta is null)');
                    break;
                case 'hist':
                    $query->andWhere('now() > dcb.fhasta');
                    break;
                default:
                    break;
            }

            return (count($idpersona)) > 0 ? $query->whereNotIn('dcb.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delCuentaBancaria(array $ids, array $idpersona)
    {
        try {
            if (count($ids) > 0) {
                $query = Doctrine_Query::create()->delete('DatCuentabancaria')->whereIn('idcuentabancaria', $ids);
                if (count($idpersona) > 0) {
                    $query->andWhereIn('idpersona', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}
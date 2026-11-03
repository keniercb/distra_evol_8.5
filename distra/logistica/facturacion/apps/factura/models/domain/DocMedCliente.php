<?php

class DocMedCliente extends BaseDocMedCliente
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DocMedicion', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('MedCliente', array('local' => 'idmedicioncliente', 'foreign' => 'idmedicioncliente'));
    }

    static public function listar($params)
    {
        $filterArr = array();
        if (!empty($params['iddocumento'])) {
            $filterArr[] = "m.iddocumento = " . $params['iddocumento'];
        }
        if (!empty($params['idmedicioncliente'])) {
            $filterArr[] = "m.idmedicioncliente = " . $params['idmedicioncliente'];
        }
        $q = Doctrine_Query::create();
        $q->select(
            'm.iddocumedcliente, m.cantidad,m.iddocumento,
                    m.idmedicioncliente, m2.idmedicioncliente, m2.idcontrato,
                    m2.idcliente, m2.fechamedicion, m2.medicion'
        )
            ->from('DocMedCliente m')
            ->innerjoin('m.MedCliente m2 ON m.idmedicioncliente = m2.idmedicioncliente');
        $filter = implode(" and ", $filterArr);
        if ($filter) {
            $q->where($filter);
        }
        $cant = $q->count();
        if ($params['confirmar']) {
            $filter .= " and m.cantidad = 0";
            $q->where($filter);
            $cantcero = $q->count();
        }
        if ($params['limit']) {
            $q->limit($params['limit'])
                ->offset($params['start']);
        }
        $result = $q->fetchArray();
        return array('cantidad' => $cant, 'datos' => $result, 'cantcero' => ($cantcero) ? $cantcero : 0);
    }

    static public function getDataByIdDocuments()
    {
        $q = Doctrine_Query::create()
            ->select('dm.*, mc.*')
            ->from('DocMedCliente dm')
            ->innerjoin('dm.MedCliente mc ON dm.idmedicioncliente = mc.idmedicioncliente')
            ->where('mc.medicion is not null')
            ->orderBy('dm.iddocumento DESC');
        $result = $q->fetchArray();
        return $result;
    }

    static public function buscarPorIdDoc($iddocumento)
    {
        $q = Doctrine_Query::create()
            ->select('dm.*, mc.*')
            ->from('MedCliente mc')
            ->innerjoin('mc.DocMedCliente dm ON dm.idmedicioncliente = mc.idmedicioncliente')
            ->where("dm.iddocumento= ?", $iddocumento);
        return $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    static public function buscarDocsPosIdsClientes($idclientes)
    {
        $q = Doctrine_Query::create()
            ->select('DISTINCT (dm.iddocumento) as iddocumento')
            ->from('DocMedCliente dm')
            ->innerjoin('dm.MedCliente mc ON dm.idmedicioncliente = mc.idmedicioncliente')
            ->where("mc.idcliente in ({$idclientes})");
        return $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
    }

    static public function getIdDocumentsByIdsCustomer($params)
    {
        $q = Doctrine_Query::create()
            ->select(
                'dmd.iddocumento,dmd.idservicio,dd.estado as estado,' .
                'dd.nrodoc,dd.fechacontable,mc.idcliente,dm.idmedicioncliente'
            )
            ->from('DocMedicion dmd')
            ->innerjoin('dmd.DatDocumento dd')
            ->innerJoin('dmd.DocMedCliente dm')
            ->innerJoin('dm.MedCliente mc')
            ->where(
                "dd.estado = 1 and dmd.idservicio =? and mc.idcliente in ({$params['clientes']})",
                array($params['idservicio'])
            ); // (1,2)
        if ($params['accion'] == "dc") {
            $total = $q->count();
            $q->limit($params['limit'])
                ->offset($params['start']);
            return array('total' => $total, 'datos' => $q->fetchArray());
        } else {
            return $q->fetchArray();
        }
    }
}
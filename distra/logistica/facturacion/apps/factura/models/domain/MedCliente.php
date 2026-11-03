<?php

class MedCliente extends BaseMedCliente
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DocMedCliente', array('local' => 'idmedicioncliente', 'foreign' => 'idmedicioncliente'));
        $this->hasOne('HisMedicion', array('local' => 'idmedicioncliente', 'foreign' => 'idmedicioncliente'));
    }

    static public function listar($idproducto)
    {
        $q = Doctrine_Query::create()
            ->select('mc.*')
            ->from('MedCliente mc')
            ->where('mc.idproducto=?', $idproducto);
        $result = $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    static public function ContratosDocsElaboracionConfirmacion()
    {
        $model = new DocMedicionModel();
        $iddocs = $model->obtenerIdsDocsElaboracionConfirmacion();
        $result = array();
        if ($iddocs) {
            $q = Doctrine_Query::create()
                ->select('mc.idcontrato')
                ->from('MedCliente mc')
                ->innerjoin('mc.DocMedCliente dm ON dm.idmedicioncliente = mc.idmedicioncliente');
            $q->addWhere("dm.iddocumento not in ({$iddocs})");
            $result = $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
                ->execute();
        }
        //   ->where("dm.iddocumento not in ({$iddocs})");
        return $result;
    }

    static public function idsContratosDocsElaboracionConfirmacion()
    {
        $mediciones = self::ContratosDocsElaboracionConfirmacion();
        $result = array();
        foreach ($mediciones as $medicion) {
            $result[] = $medicion['idcontrato'];
        }
        return $result;
    }

    static public function existsConsumidorById($iddocumento, $idcontrato, $idcliente)
    {
        $q = Doctrine_Query::create()
            ->select('mc.idcontrato')
            ->from('MedCliente mc')
            ->innerjoin('mc.DocMedCliente dm');
        $q->addWhere(
            "dm.iddocumento=? and mc.idcontrato =? and mc.idcliente =?", array($iddocumento, $idcontrato, $idcliente)
        );
        $result = $q->fetchArray();
        return $result;
    }

    static public function buscarClientes()
    {
        $q = Doctrine_Query::create()
            ->select('DISTINCT (mc.idcliente) as idcliente')
            ->from('MedCliente mc');
        $idsclientes = $q->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY)
            ->execute();
        $idscli = array();
        foreach ($idsclientes as $ids) {
            $idscli[] = $ids['idcliente'];
        }
        return $idscli;
    }
}

<?php

class DatEvalhecho extends BaseDatEvalhecho {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('NomEvalvalorescualitativos', array('local' => 'idvalorescualitativos', 'foreign' => 'idvalorescualitativos'));
    }

    public function Buscar($idhecho) {
        $temp = $this->conn->getTable('DatEvalhecho')->find($idhecho);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalhecho')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalhecho')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function GetHechosPorModelo($idmodelo, $inicio, $limite) {
        try {
            $arr = array();
            $query = new Doctrine_Query ( );
            $result = $query
                            ->select('ee.idhecho, ee.idmodelo, ee.idvalorescualitativos, er.idexpresionmatematica, er.denom as denomr, nom.denom,ee.orden')
                            ->from('DatEvalhecho ee')
                            ->innerJoin('ee.DatEvalregla er')
                            ->innerJoin('ee.NomEvalvalorescualitativos nom')
                            ->where('ee.idmodelo = ?', array($idmodelo))
                            ->orderby('ee.orden ASC')
                            ->limit($limite)
                            ->offset($inicio)
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

            foreach ($result as $k) {
                $arr[] = array(
                    'idhecho' => $k['idhecho'],
                    'idmodelo' => $k['idmodelo'],
                    'orden' => $k['orden'],
                    'idvalorescualitativos' => $k['idvalorescualitativos'],
                    'idexpresionmatematica' => $k['DatEvalregla'][0]['idexpresionmatematica'],
                    'denomr' => $k['DatEvalregla'][0]['denomr'],
                    'idvalorescualitativos' => $k['NomEvalvalorescualitativos'][0]['idvalorescualitativos'],
                    'denom' => $k['NomEvalvalorescualitativos'][0]['denom']
                );
            }
            return $arr;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteHecho($idmodelo, $idvalorcualitativo, $idexpresionmatematica) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalhecho h')->where("h.idmodelo = '$idmodelo' and h.idvalorescualitativos = '$idvalorcualitativo' and h.idexpresionmatematica = '$idexpresionmatematica' ")->execute();
        return $result->toArray();
    }

    /**
     * Devuelve todos los hechos asociados al modelo
     *
     * @param $idmodelo
     *
     * @return array
     */
    public function getAllHechosByModelo($idmodelo) {
        $query = Doctrine_Manager::getInstance();
        $sql = "SELECT m.idmodelo, m.idescala, he.idhecho, he.idvalorescualitativos, he.idexpresionmatematica, he.orden, evc.peso, vc.denom
            FROM mod_evaluaciones.dat_evalmodelo m
            INNER JOIN mod_evaluaciones.dat_evalhecho he ON m.idmodelo = he.idmodelo
            INNER JOIN mod_evaluaciones.dat_evalescalavalorescualitativos evc ON (m.idescala = evc.idescala AND he.idvalorescualitativos = evc.idvalorescualitativos)
            INNER JOIN mod_evaluaciones.nom_evalvalorescualitativos vc ON vc.idvalorescualitativos = he.idvalorescualitativos
            WHERE m.idmodelo = {$idmodelo}
            ORDER BY he.orden ASC;";
        return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

}
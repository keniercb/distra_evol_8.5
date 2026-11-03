<?php

class NomEvalvalorescualitativos extends BaseNomEvalvalorescualitativos
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEvalhecho', array('local' => 'idvalorescualitativos', 'foreign' => 'idvalorescualitativos'));
        $this->hasOne('DatEvalescalavalorescualitativos', array('local' => 'idvalorescualitativos', 'foreign' => 'idvalorescualitativos'));

    }

    public function Buscar($idvalorescualitativos)
    {
        $temp = $this->conn->getTable('NomEvalvalorescualitativos')->find($idvalorescualitativos);
        return $temp->toArray();

    }

    public function BuscarValoresbyDenom($denom)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalvalorescualitativos')
            ->where("denom = '$denom'")
            ->execute();
        return $result->toArray();

    }

    public function BuscarValoresbyDenomCantidad($denom)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalvalorescualitativos')
            ->where("denom = '$denom'")
            ->count();
        return $result;

    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalvalorescualitativos')->execute();
        return $result->toArray();

    }

    public function existeValorC($denom)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalvalorescualitativos')
            ->where("denom = '$denom'")
            ->execute();
        return $result->toArray();
    }

    public function getCantidad($denom = '')
    {
        $query = new Doctrine_Query ();
        if (!$denom) {
            return $result = $query->from('NomEvalvalorescualitativos')
                ->count();
        } else {
            return $result = $query->from('NomEvalvalorescualitativos')
                ->where("denom = '$denom'")
                ->count();
        }

    }

    public function devolverValoresCualitativos($limite = 10, $inicio = 0, $denom = '')
    {
        $query = new Doctrine_Query ();
        if (!$denom) {
            $result = $query->from('NomEvalvalorescualitativos')
                ->orderby("idvalorescualitativos DESC")
                ->limit($limite)
                ->offset($inicio)
                ->execute();
        } else {
            $result = $query->from('NomEvalvalorescualitativos')
                ->where("denom ILIKE '%$denom%' OR descripcion ILIKE '%$denom%'")
                ->orderby("idvalorescualitativos DESC")
                ->limit($limite)
                ->offset($inicio)
                ->execute();
        }
        return $result->toArray();
    }

    /*select * from nom_valorescualitativos t
    where t.idvalorescualitativos not in(
        select s.idvalorescualitativos FROM dat_evalescalavalorescualitativos s where s.idescala = 5
    )*/
    public function GetPorLimite($limite = 10, $inicio = 0, $idescala = null)
    {
        /*$query = new Doctrine_Query ();
        $result = $query
            ->from('NomEvalvalorescualitativos')
            ->limit($limite)
            ->offset($inicio)
            ->execute();
        return $result->toArray();*/

           $sql = "SELECT DISTINCT *
                FROM mod_evaluaciones.nom_evalvalorescualitativos nom
                WHERE nom.idvalorescualitativos NOT IN
                  (
                    SELECT s.idvalorescualitativos FROM mod_evaluaciones.dat_evalescalavalorescualitativos s
                    WHERE s.idescala=$idescala
                  )
                  limit $limite
                  offset $inicio;";
           $mg = Doctrine_Manager::getInstance();
           $conn = $mg->getCurrentConnection();
           $result = $conn->fetchAll($sql);
           return $result;
    }

    //Devuelve la cantidad total que tiene la tabla
    public function GetCantTotal()
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query
                ->select('COUNT(idvalorescualitativos)')
                ->from('NomEvalvalorescualitativos')
                ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function verifvaloresMod($id, $denom)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('NomEvalvalorescualitativos')
            ->where("idvalorescualitativos <> '$id' and denom = '$denom'")
            ->execute();
        return $result->toArray();
    }

    public function BuscarPorFiltro($limit, $start, $filtro, $idescala = null)
    {

        /* $query = new Doctrine_Query ();
         $result = $query->from('NomEvalvalorescualitativos')
             ->where("denom ILIKE '%$filtro%'")
             ->limit($limit)
             ->offset($start)
             ->execute();
         return $result->toArray();*/

        $sql = "SELECT DISTINCT *
            FROM mod_evaluaciones.nom_evalvalorescualitativos nom,mod_evaluaciones.dat_evalescalavalorescualitativos dat
            WHERE dat.idvalorescualitativos = nom.idvalorescualitativos AND
              nom.idvalorescualitativos NOT IN
              (
                SELECT s.idvalorescualitativos FROM mod_evaluaciones.dat_evalescalavalorescualitativos s
                   WHERE s.idescala=$idescala
              )
              AND nom.denom ilike '%$filtro%'
              limit $limit offset $start";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);

        return $result;
    }

    public function GetCantTotalporFiltro($filtro, $idescala)
    {
        try {
            /* $query = new Doctrine_Query ();
             $result = $query
                 ->select('COUNT(idvalorescualitativos)')
                 ->from('NomEvalvalorescualitativos')
                 ->where("denom ILIKE '%$filtro%' and idescala=?", $idescala)
                 ->execute();
             $arr = $result->toArray();
             return (is_array($arr) ? $arr [0] ['COUNT'] : 0);*/

            $sql = "SELECT DISTINCT count(nom.idvalorescualitativos)
            FROM mod_evaluaciones.nom_evalvalorescualitativos nom,mod_evaluaciones.dat_evalescalavalorescualitativos dat
            WHERE dat.idvalorescualitativos = nom.idvalorescualitativos AND
              nom.idvalorescualitativos NOT IN
              (
                  SELECT s.idvalorescualitativos FROM mod_evaluaciones.dat_evalescalavalorescualitativos s
                  WHERE s.idescala=$idescala
              )
              AND nom.denom ilike '%$filtro%'";

            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}

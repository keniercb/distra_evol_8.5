<?php

class DatEvalseguridadevalentidad extends BaseDatEvalseguridadevalentidad {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatEvalaccesoevalentidad', array('local' => 'idevalseguridadevalentidad', 'foreign' => 'idevalseguridadevalentidad'));
    }

    public function GetTodos() {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalseguridadevalentidad')->execute();
        return $result->toArray();
    }

    public function Buscar($idevalseguridadevalentidad) {
        return $DatEvalregla = Doctrine::getTable('DatEvalseguridadevalentidad')->find($idevalseguridadevalentidad);
    }

    public function GetPorLimite($limite = 15, $inicio = 0) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalseguridadevalentidad')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }

    public function existePersona($idpersona, $idpreprocesoevaluativo)
    {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvalseguridadevalentidad se')
                ->where("se.idpersona = {$idpersona} and se.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
                ->execute();
        return $result->toArray();
    }

    public function obtenerEvaluadoresPE($limite, $inicio, $idpreprocesoevaluativo, $formaevaluacion) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('se.idevalseguridadevalentidad, se.idpersona, se.identidad, se.formaevaluacion, se.todo, se.idpreprocesoevaluativo, se.tipopersona')
                    ->from('DatEvalseguridadevalentidad se')
                    ->where("se.idpreprocesoevaluativo = '$idpreprocesoevaluativo' and se.formaevaluacion = '$formaevaluacion'")
                    ->orderBy('se.idevalseguridadevalentidad DESC')
                    ->limit($limite)
                    ->offset($inicio)
                    ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                    ->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getCantEvaluadoresPE($idpreprocesoevaluativo, $formaevaluacion) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('COUNT(se.idevalseguridadevalentidad)')
                    ->from('DatEvalseguridadevalentidad se')
                    ->where("se.idpreprocesoevaluativo = '$idpreprocesoevaluativo' and se.formaevaluacion = '$formaevaluacion'")
                    ->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatEvalseguridadevalentidad s')
                        ->where("s.idpersona = {$idpersona} and s.idpreprocesoevaluativo = {$idpreprocesoevaluativo} ")//and s.identidad = {$idestructura}
                        ->execute();
        return $result->toArray();
    }

    /*public function ExisteDatEvalseguridadevalentidad($idpersona, $idpreprocesoevaluativo, $idestructura) {
        $query = new Doctrine_Query();
        $result = $query->from('DatEvalseguridadevalentidad s')
                        ->where("s.idpersona = {$idpersona} and s.idpreprocesoevaluativo = {$idpreprocesoevaluativo} ")//and s.identidad = {$idestructura}
                        ->execute();
        return $result->toArray();
    }*/

    public function obtenerEvaluados($idevaluador, $entidad, $formaevaluacion, $idPrepProcesoEvaluativo, $limit, $start) {
        try {
            $query = new Doctrine_Query();
            if ($limit != "") {
                $result = $query->select('ae.idevalaccesoevalentidad, ae.idpersona, ae.ver, ae.modificar')
                        ->from('DatEvalaccesoevalentidad ae')
                        ->leftJoin('ae.DatEvalseguridadevalentidad se')
                        ->where("se.idpersona = '$idevaluador' and se.identidad = '$entidad' and se.idpreprocesoevaluativo = '$idPrepProcesoEvaluativo' and se.formaevaluacion = '$formaevaluacion'")
                        ->limit($limit)
                        ->offset($start)
                        ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                        ->execute();
                return $result;
            } else {
                $result = $query->select('ae.idevalaccesoevalentidad, ae.idpersona, ae.ver, ae.modificar')
                        ->from('DatEvalaccesoevalentidad ae')
                        ->innerJoin('ae.DatEvalseguridadevalentidad se')
                        ->where("se.idpersona = '$idevaluador' and se.identidad = '$entidad' and se.idpreprocesoevaluativo = '$idPrepProcesoEvaluativo' and se.formaevaluacion = '$formaevaluacion'")
                        ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                        ->execute();
                return $result;
            }
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function obtenerCantidadEvaluados($idevaluador, $entidad, $formaevaluacion, $idPrepProcesoEvaluativo) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('ae.idevalaccesoevalentidad')
                    ->from('DatEvalaccesoevalentidad ae')
                    ->innerJoin('ae.DatEvalseguridadevalentidad se')
                    ->where("se.idpersona = '$idevaluador' and se.identidad = '$entidad' and se.idpreprocesoevaluativo = '$idPrepProcesoEvaluativo' and se.formaevaluacion = '$formaevaluacion'")
                    ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getIdEvalSeguridadEvalentidad($idpersona, $identidad, $formaevaluacion, $idPrepProcesoEvaluativo) {
        $query = new Doctrine_Query();
        $result = $query->select('s.idevalseguridadevalentidad')
                ->from('DatEvalseguridadevalentidad s')
                ->where("s.idpersona = {$idpersona} and s.identidad ={$identidad} and s.formaevaluacion = {$formaevaluacion} and s.idpreprocesoevaluativo = {$idPrepProcesoEvaluativo}")
                ->execute();
        return $result->toArray();
    }

    public function buscarTablaSeguridadEvalEntidad($idpersona, $identidad, $formaevaluacion, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatEvalseguridadevalentidad a')
                ->where("a.idpersona = {$idpersona} and a.identidad = {$identidad} and a.formaevaluacion = {$formaevaluacion} and a.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
                ->execute();
        return $result;
    }

    public function obtenerControldores($idpreprocesoevaluativo, $formaevaluacion, $tipopersona, $idestructura, $limit, $start) {
        if ($limit != null && $start != null) {
            $query = new Doctrine_Query ();
            $result = $query->select('se.idevalseguridadevalentidad, se.idpersona, se.identidad, se.formaevaluacion, se.todo, se.idpreprocesoevaluativo, se.tipopersona')
                    ->from('DatEvalseguridadevalentidad se')
                    ->where("se.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and se.formaevaluacion = {$formaevaluacion} and tipopersona = {$tipopersona} and identidad = {$idestructura}")
                    ->orderBy('se.idevalseguridadevalentidad DESC')
                    ->limit($limit)
                    ->offset($start)
                    ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                    ->execute();
            return $result;
        } else {
            $query = new Doctrine_Query ();
            $result = $query->select('se.idevalseguridadevalentidad, se.idpersona, se.identidad, se.formaevaluacion, se.todo, se.idpreprocesoevaluativo, se.tipopersona')
                    ->from('DatEvalseguridadevalentidad se')
                    ->where("se.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and se.formaevaluacion = {$formaevaluacion} and tipopersona = {$tipopersona} and identidad = {$idestructura}")
                    ->orderBy('se.idevalseguridadevalentidad DESC')
                    ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
                    ->execute();
                   
            return $result;
        }
        
    }

    public function obtenerCantControldores($idpreprocesoevaluativo, $formaevaluacion, $tipopersona, $idestructura) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->select('se.idevalseguridadevalentidad')
                    ->from('DatEvalseguridadevalentidad se')
                    ->where("se.idpreprocesoevaluativo = {$idpreprocesoevaluativo} and se.formaevaluacion = {$formaevaluacion} and tipopersona = {$tipopersona} and identidad = {$idestructura}")
                    ->count();
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}

//fin clase
?>



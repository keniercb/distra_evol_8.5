<?php

class DatEvalprocesoevaluadoresModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalprocesoevaluadores $DatEvalprocesoevaluadores) {
        $DatEvalprocesoevaluadores->save();
    }

    public function getIdProcesoEvaluadores($idpreprocesoevaluativo, $idpersona, $idprocesocomisionevaluacion) {
        $query = new Doctrine_Query ();
        $result = null;
        if ($idprocesocomisionevaluacion != null) {
            $result = $query->from('DatEvalprocesoevaluadores')
                    ->where("idpreprocesoevaluativo = {$idpreprocesoevaluativo} and idpersona = {$idpersona} and idprocesocomisionevaluacion = '$idprocesocomisionevaluacion'")
                    ->execute();
        } else {
            $result = $query->from('DatEvalprocesoevaluadores')
                    ->where("idpreprocesoevaluativo = {$idpreprocesoevaluativo} and idpersona = {$idpersona} and idprocesocomisionevaluacion is null")
                    ->execute();
        }
        return $result->toArray();
    }

    public function Actualizar(DatEvalprocesoevaluadores $DatEvalprocesoevaluadores) {
        $DatEvalprocesoevaluadores->save();
    }

    public function Eliminar($DatEvalprocesoevaluadores) {
        $DatEvalprocesoevaluadores->delete();
    }

    public function delete($idprocesoevaluadores) {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                    ->delete()
                    ->from('DatEvalprocesoevaluadores')
                    ->where('idprocesoevaluadores = ?', $idprocesoevaluadores)
                    ->execute();
            $r->success = true;
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                throw new ZendExt_Exception('CHE055');
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function noEstaEvaluador($idpersona, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query ();
        $result = $query->select('idpersona')
                ->from('DatEvalprocesoevaluadores')
                ->where("idpersona = {$idpersona} and idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
                ->execute();
        if (empty($result))
            return 1;
        return 2;
    }

    public function adicionarevaluadores($arrIdPersona, $idpreprocesoevaluativo, $idprocesocomisionevaluacion) {
        //0- Crea un str de idpersonas para buscar los evaluadores que ya existen
        $strIdPersonas = '';
        foreach ($arrIdPersona as $value) {
            $strIdPersonas.=$value->idpersona . ',';
        }
        $strIdPersonas = substr($strIdPersonas, 0, -1);

        //1 Busco personas que existen en base d datos como evaluadores para el proceso evaluativo dado
        $arrIdEvaluadores = Doctrine_Query::create()
                ->select('idpersona')
                ->from('DatEvalprocesoevaluadores')
                ->where("idpreprocesoevaluativo={$idpreprocesoevaluativo} and idpersona IN ({$strIdPersonas})")
                ->fetchArray();

        //2 Las que no esten en base de datos las adiciona normalmente
        $i = 0;
        $dcEvaluadores = new Doctrine_Collection('DatEvalprocesoevaluadores');
        foreach ($arrIdPersona as $idpersona) {
            $existe = false;
            foreach ($arrIdEvaluadores as $idpersonaE) {
                if ($idpersona->idpersona == $idpersonaE['idpersona']) {
                    $existe = true;
                    break;
                }
            }
            if (!$existe) {
                $dcEvaluadores[$i]->idpersona = $idpersona->idpersona;
                if ($idprocesocomisionevaluacion != -1) {
                    $dcEvaluadores[$i]->idprocesocomisionevaluacion = $idprocesocomisionevaluacion;
                }
                $dcEvaluadores[$i++]->idpreprocesoevaluativo = $idpreprocesoevaluativo;
            }
        }
        if ($i > 0) {
            //3- Adiciono las personas como evaluadores
            $dcEvaluadores->save();
        }
    }

    public function buscarTablaProcesoEvaluadores($idpersona, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query();
        $result = $query->from('DatEvalprocesoevaluadores a')->where("a.idpersona = {$idpersona} and a.idpreprocesoevaluativo = {$idpreprocesoevaluativo}")->execute();
        return $result;
    }

    public function EliminarEvaluador($idprocesoevaluadores) {
        try{
		$r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('DatEvalprocesoevaluadores')
                ->where('idprocesoevaluadores = ?', $idprocesoevaluadores)
                ->execute();
			return $r;
		}
		catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                $r->exception = 1;
                return $r;
            }else{
                return (json_encode($e->getMessage()));
            }
        }
    }
}
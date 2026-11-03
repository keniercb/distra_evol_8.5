<?php

class DatEvalprocesoevaluadosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(DatEvalprocesoevaluados $DatEvalprocesoevaluados) {
        $DatEvalprocesoevaluados->save();
    }

    public function Actualizar(DatEvalprocesoevaluados $DatEvalprocesoevaluados) {
        $DatEvalprocesoevaluados->save();
    }

    public function Eliminar($DatEvalprocesoevaluados) {
        $DatEvalprocesoevaluados->delete();
    }

    public function getTablaEvaluados($idpersona, $idprocesoevaluadores, $idpreprocesoevaluativo) {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalprocesoevaluados')
                ->where("idpersona = {$idpersona} and idprocesoevaluadores = {$idprocesoevaluadores} and idpreprocesoevaluativo = {$idpreprocesoevaluativo}")
                ->execute();
        return $result;
    }
	
    public function adicionarevaluados($idpreprocesoevaluativo, $arrIdPersona, $idEvaluador, $permiso, $idprocesoplanilla, $autoevaluacion) {
        //0- Crea un str de idpersonas para buscar los evaluadores que ya existen
        $strIdPersonas = '';
        foreach ($arrIdPersona as $value) {
            $strIdPersonas.=$value->idpersona . ',';
        }
        $strIdPersonas = substr($strIdPersonas, 0, -1);

        //1 Busco personas que existen en base d datos como evaluados para el proceso evaluativo dado
        $arrIdEvaluados = Doctrine_Query::create()
                ->select('idpersona')
                ->from('DatEvalprocesoevaluados')
                ->where("idpreprocesoevaluativo={$idpreprocesoevaluativo} and idpersona IN ({$strIdPersonas})")
                ->fetchArray();
		
        //adiciona en caso de autoevaluacion	
        if ($autoevaluacion) {
            //2 Las que no esten en base de datos las adiciono normalmente
            foreach ($arrIdPersona as &$persona) {
                $existe = false;
                foreach ($arrIdEvaluados as $idpersonaE) {
                    if ($persona->idpersona == $idpersonaE['idpersona']) {
                        $existe = true;
                        break;
                    }
                }
                if (!$existe) {
                    try {
                        $objEvaluador = new DatEvalprocesoevaluadores();
                        $objEvaluador->idpersona = $persona->idpersona;
                        $objEvaluador->idpreprocesoevaluativo = $idpreprocesoevaluativo;
                        $objEvaluador->save();
                        $persona->idprocesoevaluadores = $objEvaluador->idprocesoevaluadores;
                    } catch (Exception $e) {
                        die($e->getMessage());
                    }
                }
            }
            $i = 0;
            $dcEvaluado = new Doctrine_Collection('DatEvalprocesoevaluados');
            foreach ($arrIdPersona as $evaluado) {
                $dcEvaluado[$i]->idpersona = $evaluado->idpersona;
                $dcEvaluado[$i]->idprocesoplanilla = $idprocesoplanilla;
                $dcEvaluado[$i]->idpreprocesoevaluativo = $idpreprocesoevaluativo;
                $dcEvaluado[$i]->DatEvalpersonaevaluacion[0]->estado = 0;
                $dcEvaluado[$i]->DatPermisoevaluacion[0]->idevaluador = $evaluado->idprocesoevaluadores;
                $dcEvaluado[$i++]->DatPermisoevaluacion[0]->permiso = 1;
            }
            $dcEvaluado->save();
        }
        //adiciona en caso de evaluacion normal
        else {
            //2 Las que no esten en base de datos las adiciona normalmente
            $i = 0;
            $dcEvaluados = new Doctrine_Collection('DatEvalprocesoevaluados');
            foreach ($arrIdPersona as $idpersona) {
                $existe = false;
                foreach ($arrIdEvaluados as $idpersonaE) {
                    if ($idpersona->idpersona == $idpersonaE['idpersona']) {
                        $existe = true;
                        break;
                    }
                }
                if (!$existe) {
                    $dcEvaluados[$i]->idpersona = $idpersona->idpersona;
                    $dcEvaluados[$i]->idprocesoplanilla = $idprocesoplanilla;
                    $dcEvaluados[$i]->idpreprocesoevaluativo = $idpreprocesoevaluativo;
                    $dcEvaluados[$i]->DatEvalpersonaevaluacion[0]->estado = 0;
                    $dcEvaluados[$i]->DatPermisoevaluacion[0]->idevaluador = $idEvaluador;
                    $dcEvaluados[$i++]->DatPermisoevaluacion[0]->permiso = $permiso;
                }
            }
            if ($i > 0) {
                //3- Adiciono las personas como evaluados y en permiso
                $dcEvaluados->save();
            }
        }
    }

    public function EliminarEvluado($idEvaluado) {
       try{
		$r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('DatEvalprocesoevaluados')
                ->where('idprocesoevaluados = ?', $idEvaluado)
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
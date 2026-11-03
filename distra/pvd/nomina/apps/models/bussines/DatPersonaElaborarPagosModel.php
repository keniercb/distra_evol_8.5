<?php
class DatPersonaElaborarPagosModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function DatPersonaElaborarPagosModel() {
        parent::ZendExt_Model();
    }

    public function

    adicionarPersonasElaborarPago($datos) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        foreach($datos->arrpersonas as $i => $v) {
            $idreportescertificaciones = ($datos->modoseleccionpersonas == 1 || $datos->modoseleccionpersonas == 2) ? null : $datos->idreportescertificaciones;
            if($idreportescertificaciones){
                $values = "({$datos->idelaborarpagos}, {$v}, 0, null, {$idreportescertificaciones})";
            }else{
                $values = "({$datos->idelaborarpagos}, {$v}, 0, null, null)";
            }

            //Salvando en DatPersonaElaborarPagos
            $sql = "INSERT INTO mod_nomina.dat_personaselaborarpagos(idelaborarpagos, idpersona, excluido, idcausaexclusion, idreportescertificaciones)
              VALUES ".$values." returning idpersonaelaborarpagos;";//print_r($sql);die;
            $r = $conn->fetchAll($sql);
            $idpersonaelaborarpagos = $r[0]['idpersonaelaborarpagos'];

            foreach($datos->arrcargosocupados[$v] as $j => $co) {
                //Salvando en DatPersonaElaborarPagosCargosOcupados
                $sql = "INSERT INTO mod_nomina.dat_personaelaborarpagoscargosocupados(idpersonaelaborarpagos, idcargosocupados)
                      VALUES ({$idpersonaelaborarpagos}, {$co});";
                $conn->execute($sql);
            }
        }
        $conn->commit();
        return true;
/*
		foreach ($datos->arrpersonas as $i => $v) {
			$p = new DatPersonaElaborarPagos();
			$p->idelaborarpagos = $datos->idelaborarpagos;
			$p->idpersona = $v;
			$p->excluido = 0;
			$p->idcausaexclusion = null;
			if($datos->modoseleccionpersonas == 1){
				$p->idreportescertificaciones = null;
			}else{
				$p->idreportescertificaciones = $datos->idreportescertificaciones;
			}
			$p->save();
			foreach($datos->arrcargosocupados[$v] as $j => $co){
				$c = new DatPersonaElaborarPagosCargosOcupados();
				$c->idpersonaelaborarpagos = $p->idpersonaelaborarpagos;
				$c->idcargosocupados = $co;
				$c->save();
			}
		}
		return true;*/
    }


    public function excluiroNoPersonasElaborarPago($arridpersonaelaborarpagos, $excluir, $idcausaexclusion) {
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
		foreach ($arridpersonaelaborarpagos as $i => $v) {
			$obj = Doctrine::getTable('DatPersonaElaborarPagos')->find($v);
			$obj->excluido = $excluir;
			$obj->idcausaexclusion = ($excluir == 1 || $excluir == '1' ? $idcausaexclusion : null);
			$obj->save();
		}
        $conn->commit();
		return true;
    }

    public function incluirNoPersonasElaborarPago($arreglo) {

        foreach ($arreglo as $i => $v) {
            $obj = Doctrine::getTable('DatPersonaElaborarPagos')->find($v);
            $obj->excluido = 0;
            $obj->idcausaexclusion = null;
            $obj->save();
        }
        return true;
    }

    public function eliminarPersonasElaborarPago($arridpersonaelaborarpagos) {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
		foreach ($arridpersonaelaborarpagos as $i => $v) {
			$obj = Doctrine::getTable('DatPersonaElaborarPagos')->find($v);
			$obj->delete();
		}

        $conn->commit();
		return true;
    }
}

<?php 
class DatEvalimpactoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getIndicadoresParticipante($idaccionparticipante)
    {
        try {
            $datos = DatEvalimpacto::getEvalImpactoByAccionParticipante($idaccionparticipante);
            if (count($datos) > 0) {
                foreach ($datos as $p => $ev) {
                    $datos[$p]['valor'] = ZendExt_IoC_Inter::getInstance()->maestro->getDenomValorByIdEscalaIdValor(
                        $ev['idescala'], $ev['idvalor']
                    );
                }
            } else {
                $datos = Array();
            }
            return $datos;
        } catch (Exception $e) {
            return false;
        }
    }

    public function add($idaccionparticipante, $idperiodo, $idindicador, $idvalorescala, $fecha, $complemento)
    {
        try {
            $obj = new DatEvalimpacto();
            $obj->idaccionparticipante = $idaccionparticipante;
            $obj->idperiodo = $idperiodo;
            $obj->idindicador = $idindicador;
            $obj->idvalorescala = $idvalorescala;
            $obj->fecha = $fecha;
            $obj->complemento = $complemento;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idevalimpacto, $idperiodo, $idindicador, $idvalorescala, $fecha, $complemento)
    {
        try {
            $obj = DatEvalimpacto::getById($idevalimpacto);
            $obj->idperiodo = $idperiodo;
            $obj->idindicador = $idindicador;
            $obj->idvalorescala = $idvalorescala;
            $obj->fecha = $fecha;
            $obj->complemento = $complemento;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idevalimpacto)
    {
        try {
            $obj = DatEvalimpacto::getById($idevalimpacto);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}
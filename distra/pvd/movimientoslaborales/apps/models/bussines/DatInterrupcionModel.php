<?php
class DatInterrupcionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getInterrupciones($filtro, $idestructura, $fdesde, $fhasta, $inicio, $limite)
    {
        try {
            $hijosest = ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
            $estructuras = array($idestructura);
            foreach ($hijosest as $est) {
                array_push($estructuras, $est->id);
            }
            $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
            foreach ($entidades as $e) {
                array_push($estructuras, $e->idfila);
            }
            $obj = new DatInterrupcion();
            $inst = ZendExt_IoC::getInstance();
            $datos = $obj->getInterrupciones(
                $filtro, $estructuras, $fdesde, $fhasta, $inicio, $limite
            );
            $cantidad = $obj->cantInterrupciones($filtro, $estructuras, $fdesde, $fhasta);
            if ($cantidad == 0) {
                $datos = Array();
            }
            foreach ($datos as $r => $interr) {
                $area = $inst->metadatos->DameEstructura($interr['idestructura']);
                $datos[$r]['estructura'] = $area[0]->denominacion;
            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addInterrupcion($idestructura, $idmotivointerrupcion, $fdesde, $fhasta, $horas, $observacion)
    {
        try {
            $existe = DatInterrupcion::existeInterrupcion($idmotivointerrupcion, $fdesde);
            if (count($existe) == 0) {
                $obj = new DatInterrupcion();
                $obj->idestructura = $idestructura;
                $obj->idmotivointerrupcion = $idmotivointerrupcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->horas = ($horas == '')?null:$horas;
                $obj->observacion = ($observacion == '') ? null : $observacion;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateInterrupcion(
        $idinterrupcion, $idestructura, $idmotivointerrupcion, $fdesde, $fhasta, $horas, $observacion
    )
    {
        try {
            $sql = "UPDATE mod_fuerzatrabajo.dat_interrupcion
                   SET idmotivointerrupcion =$idmotivointerrupcion, fdesde ='$fdesde', fhasta = $fhasta, 
                       horas =$horas, observacion = $observacion, idestructura = $idestructura
                   WHERE idinterrupcion = $idinterrupcion";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $conn->execute($sql);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteInterrupcion($idinterrupcion)
    {
        try {
            $sql = "DELETE FROM mod_fuerzatrabajo.dat_interrupcion
                   WHERE idinterrupcion = $idinterrupcion";
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $conn->execute($sql);
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
}
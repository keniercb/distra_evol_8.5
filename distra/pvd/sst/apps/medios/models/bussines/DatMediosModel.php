<?php 
class DatMediosModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMedios($filtro, $idestructura, $limit = null, $start = 0)
    {

        try {
            $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);

            $estructuras = array($idestructura);
            foreach ($hijosest as $est) {
                array_push($estructuras, $est->id);
            }
            $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);

            foreach ($entidades as $e) {
                array_push($estructuras, $e->idfila);
            }

            $obj = new DatMedios();
            $datos = $obj->getMedios($estructuras, $filtro, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $rie) {
                    $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($rie['idestructura']);
                    $datos[$p]['estructura'] = $estructura[0]->denominacion;
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantMedios($estructuras, $filtro);

            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function addMedio($idmedio, $idestructura, $cantidad)
    {
        try {
            $existe = DatMedios::existe($idmedio, $idestructura);
            if (count($existe) == 0) {
                $obj = new DatMedios();
                $obj->idmedio = $idmedio;
                $obj->idestructura = $idestructura;
                $obj->cantidad = $cantidad;

                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }
    
    public function updateMedio($iddmedio,$idmedio, $idestructura, $cantidad)
    {
        try {
            $obj = DatMedios::getById($iddmedio);
            $existe = DatMedios::existe($idmedio, $idestructura);
            if (count($existe) == 0 || $existe[0]['iddmedio'] == $iddmedio) {
                $obj->idmedio = $idmedio;
                $obj->idestructura = $idestructura;
                $obj->cantidad = $cantidad;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }
    
    public function deleteMedio($iddmedio)
    {
        try {
            $obj = DatMedios::getById($iddmedio);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
    
}
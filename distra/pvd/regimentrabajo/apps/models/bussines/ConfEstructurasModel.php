<?php
class ConfEstructurasModel extends ZendExt_Model 
 {
  
    public function setUp()
    { 
        parent::ZendExt_Model();

    }

    public function getConfigEstructuras()
    {
        try {
            $obj = new ConfEstructuras();
            $datos = $obj->getConfigEstructuras();
            foreach ($datos as $k => $val) {
                $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idpadre']);
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idestructura']);
                $datos[$k]['identidad'] = $val['idpadre'];
                $datos[$k]['entidad'] = $entidad[0]->denominacion;
                $datos[$k]['estructura'] = $estructura[0]->denominacion;
            }
            $result->datos = $datos;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEstructuras($idpadre, $arrayEst)
    {
        try {
            $domain = new ConfEstructuras();
            foreach ($arrayEst as $v) {
                $existe = $domain->existe($v, $idpadre);
                if (count($existe) == 0) {
                    $obj = new ConfEstructuras();
                    $obj->idpadre = $idpadre;
                    $obj->idestructura = $v;
                    $obj->save();
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateEstructuras($padre, $arrayEst)
    {
        try {
            $domain = new ConfEstructuras();
            foreach ($arrayEst as $v) {
                $existe = $domain->existe($v, $padre);
                if (count($existe) == 0) {
                    $obj = new ConfEstructuras();
                    $obj->idpadre = $padre;
                    $obj->idestructura = $v;
                    $obj->save();
                }
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEstructuras($idestructura)
    {
        try {
            $domain = new ConfEstructuras();
            $obj = $domain->getByIdEst($idestructura);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function obtenerIdsConfigEstructuras($idestructura){
        try {
            $config = ConfEstructuras::idsEstructByPadre($idestructura);
            $tipo = 0;
            $estructuras = Array();
            if (count($config) > 0) {
                foreach ($config as $idarr => $config) {
                    array_push($estructuras, $config['idestructura']);
                }
            } else {
                $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
                if (count($entidades) > 0) {
                    foreach ($entidades as $idarr => $estructura) {
                        array_push($estructuras, $estructura->idfila);
                    }
                    $tipo = 1;
                } else {
                    array_push($estructuras, $idestructura);
                    $tipo = 2;
                }
            }
            $datos = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($estructuras);
            return array($tipo, $datos);
        } catch (Exception $e) {
            return false;
        }
    }

 }
